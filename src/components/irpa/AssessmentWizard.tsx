import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Factory,
  Building,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Save,
  HelpCircle,
  AlertCircle,
  FileText,
  Clock,
  Sparkles,
  Layers,
  Bot,
  Cpu,
  ShieldCheck,
  Target,
  BarChart3,
  Search,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressTracker } from "./ProgressTracker";
import {
  AssessmentQuestionCard,
  QuestionData,
  UserResponse,
} from "./AssessmentQuestionCard";
import { EvidenceUploaderModal, EvidenceFileItem } from "./EvidenceUploaderModal";
import { TargetStateForm, TargetStateData } from "./TargetStateForm";
import { AssessmentReviewSummary } from "./AssessmentReviewSummary";
import { AssessmentSubmittedScreen } from "./AssessmentSubmittedScreen";
import { CompanyRegistrationForm } from "./CompanyRegistrationForm";
import { FactoryProfileForm } from "./FactoryProfileForm";
import { IRPA_DOMAINS } from "@/data/irpa/domains";
import { IRPA_INDUSTRIES, IndustryDefinition } from "@/data/irpa/industries";
import { MASTER_ASSESSMENT_QUESTIONS } from "@/data/irpa/questions";

// Map wizard step (4 to 10) to domain IDs
const STEP_DOMAINS_MAP: Record<number, string[]> = {
  4: ["D01"],
  5: ["D02", "D03"],
  6: ["D04", "D05"],
  7: ["D06", "D07"],
  8: ["D08", "D09"],
  9: ["D10", "D11"],
  10: ["D12"],
};

interface AssessmentWizardProps {
  initialAssessmentId?: string;
  initialStep?: number;
  onNavigateHome?: () => void;
  onOpenConsultant?: () => void;
}

export function AssessmentWizard({
  initialAssessmentId,
  initialStep = 1,
  onNavigateHome,
  onOpenConsultant,
}: AssessmentWizardProps) {
  // Navigation & Step state
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Assessment identity
  const [assessmentId, setAssessmentId] = useState<string>(
    initialAssessmentId || ""
  );
  const [companyId, setCompanyId] = useState<string>("");
  const [factoryId, setFactoryId] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [factoryName, setFactoryName] = useState<string>("");

  // Selected industry
  const [selectedIndustry, setSelectedIndustry] =
    useState<IndustryDefinition | null>(null);
  const [industrySearch, setIndustrySearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState<string>("All");

  // Responses & Target state
  const [responses, setResponses] = useState<Record<string, UserResponse>>({});
  const [evidenceFiles, setEvidenceFiles] = useState<EvidenceFileItem[]>([]);
  const [targetState, setTargetState] = useState<TargetStateData | undefined>(
    undefined
  );

  // Evidence modal state
  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false);
  const [activeEvidenceQuestion, setActiveEvidenceQuestion] = useState<{
    id: string;
    title: string;
  } | null>(null);

  // Submission result state
  const [submittedResult, setSubmittedResult] = useState<{
    referenceId: string;
    submittedAt: string;
    overallCurrentScore: number;
    overallTargetScore: number;
  } | null>(null);

  // Auto-save feedback
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [saveError, setSaveError] = useState<string | null>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Convert raw questions into QuestionData array
  const allQuestions: QuestionData[] = useMemo(() => {
    return MASTER_ASSESSMENT_QUESTIONS.map((q) => {
      const domain = IRPA_DOMAINS.find((d) => d.id === q.domainId);
      return {
        id: q.id,
        code: q.id,
        domainId: q.domainId,
        domainName: domain?.name || q.domainName,
        title: q.parameter,
        description: q.questionText,
        helpText: q.evidenceRequired,
        evidenceRequired: q.evidenceRequired,
        answerType: q.answerType,
        isMandatory: q.isMandatory,
        kpiCode: q.relevantKpis,
        options: q.options.map((opt, idx) => ({
          id: `OPT-${q.id}-${idx + 1}-${opt.level}`,
          level: opt.level,
          label: `Level ${opt.level}: ${opt.text}`,
          criteria: opt.text,
        })),
      };
    });
  }, []);

  // Filter questions for the current wizard step
  const activeStepQuestions = useMemo(() => {
    const domainIds = STEP_DOMAINS_MAP[currentStep];
    if (!domainIds || domainIds.length === 0) return [];
    return allQuestions.filter((q) => domainIds.includes(q.domainId));
  }, [currentStep, allQuestions]);

  // Total and answered counts
  const totalQuestionsCount = allQuestions.length;
  const answeredQuestionsCount = useMemo(() => {
    return Object.values(responses).filter(
      (r) => r.isNotApplicable || (r.score !== null && r.score !== undefined)
    ).length;
  }, [responses]);

  // Current domain scores for target configuration
  const currentDomainScores = useMemo(() => {
    const scores: Record<string, number> = {};
    IRPA_DOMAINS.forEach((domain) => {
      const dQuestions = allQuestions.filter((q) => q.domainId === domain.id);
      const dResponses = dQuestions
        .map((q) => responses[q.id])
        .filter((r) => r && !r.isNotApplicable && r.score !== null && r.score !== undefined);

      if (dResponses.length > 0) {
        const sum = dResponses.reduce((acc, r) => acc + (r.score ?? 0), 0);
        scores[domain.id] = parseFloat((sum / dResponses.length).toFixed(2));
      } else {
        scores[domain.id] = 1.0;
      }
    });
    return scores;
  }, [allQuestions, responses]);

  // 1. Initial hydration: Check stored session or query API if initialAssessmentId passed
  useEffect(() => {
    const initializeSession = async () => {
      // Check localStorage for existing company / factory
      const storedComp = localStorage.getItem("indus_irpa_company");
      if (storedComp) {
        try {
          const comp = JSON.parse(storedComp);
          setCompanyId(comp.id);
          setCompanyName(comp.name);
          setCompletedSteps((prev) => (prev.includes(1) ? prev : [...prev, 1]));
        } catch {}
      }

      const storedFact = localStorage.getItem("indus_irpa_factory");
      if (storedFact) {
        try {
          const fact = JSON.parse(storedFact);
          setFactoryId(fact.id);
          setFactoryName(fact.name);
          setCompletedSteps((prev) => (prev.includes(2) ? prev : [...prev, 2]));
        } catch {}
      }

      const storedIndustry = localStorage.getItem("indus_irpa_industry");
      if (storedIndustry) {
        try {
          const ind = JSON.parse(storedIndustry);
          setSelectedIndustry(ind);
          setCompletedSteps((prev) => (prev.includes(3) ? prev : [...prev, 3]));
        } catch {}
      }

      // Check localStorage draft responses
      const savedResponses = localStorage.getItem("indus_irpa_responses");
      if (savedResponses) {
        try {
          const parsed = JSON.parse(savedResponses);
          setResponses(parsed);
        } catch {}
      }

      // Check localStorage target state
      const savedTargets = localStorage.getItem("indus_irpa_target_state");
      if (savedTargets) {
        try {
          const parsed = JSON.parse(savedTargets);
          setTargetState(parsed);
        } catch {}
      }

      // If assessment ID is present, fetch full session from server
      const targetId = initialAssessmentId || localStorage.getItem("indus_irpa_assessment_id");
      if (targetId) {
        setAssessmentId(targetId);
        try {
          const storedToken = localStorage.getItem("indus_irpa_token");
          const res = await fetch(`/api/assessments/${targetId}`, {
            headers: {
              ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
            },
          });
          if (res.ok) {
            const data = await res.json();
            const session = data.session;
            if (session) {
              if (session.companyName) setCompanyName(session.companyName);
              if (session.factoryName) setFactoryName(session.factoryName);
              if (session.industryId) {
                const ind = IRPA_INDUSTRIES.find(
                  (i) => i.id === session.industryId || i.code === session.industryId
                );
                if (ind) setSelectedIndustry(ind);
              }
              if (session.responses && Array.isArray(session.responses)) {
                const respMap: Record<string, UserResponse> = {};
                session.responses.forEach((r: any) => {
                  respMap[r.questionId] = {
                    questionId: r.questionId,
                    selectedOptionId: r.selectedOptionId,
                    score: r.score,
                    numericValue: r.numericValue,
                    textValue: r.textValue,
                    isNotApplicable: Boolean(r.isNotApplicable),
                    notes: r.notes,
                  };
                });
                setResponses(respMap);
              }
              if (session.evidenceFiles && Array.isArray(session.evidenceFiles)) {
                setEvidenceFiles(session.evidenceFiles);
              }
              if (session.status === "submitted" || session.status === "under_review") {
                setSubmittedResult({
                  referenceId: session.referenceId || `IRPA-${session.id.slice(0, 8)}`,
                  submittedAt: session.submittedAt || new Date().toISOString(),
                  overallCurrentScore: session.overallCurrentScore || 2.5,
                  overallTargetScore: session.overallTargetScore || 4.0,
                });
              }
            }
          }
        } catch (err) {
          console.warn("Could not load existing session from backend:", err);
        }
      }
    };

    initializeSession();
  }, [initialAssessmentId]);

  // Debounced Auto-Save responses to backend
  const triggerAutoSave = (updatedResponses: Record<string, UserResponse>) => {
    localStorage.setItem("indus_irpa_responses", JSON.stringify(updatedResponses));
    setSaveStatus("saving");

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(async () => {
      if (!assessmentId) {
        setSaveStatus("saved");
        return;
      }

      try {
        const storedToken = localStorage.getItem("indus_irpa_token");
        const payload = Object.values(updatedResponses).map((r) => ({
          questionId: r.questionId,
          selectedOptionId: r.selectedOptionId,
          score: r.score,
          numericValue: r.numericValue,
          textValue: r.textValue,
          isNotApplicable: r.isNotApplicable,
          notes: r.notes,
        }));

        const res = await fetch(`/api/assessments/${assessmentId}/responses`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
          },
          body: JSON.stringify({ responses: payload }),
        });

        if (res.ok) {
          setSaveStatus("saved");
          setSaveError(null);
        } else {
          setSaveStatus("idle");
        }
      } catch (err: any) {
        setSaveStatus("idle");
        setSaveError("Auto-save offline; saved to browser.");
      }
    }, 800);
  };

  // Response change handler for single question card
  const handleResponseChange = (updated: UserResponse) => {
    setResponses((prev) => {
      const next = { ...prev, [updated.questionId]: updated };
      triggerAutoSave(next);
      return next;
    });
  };

  // Step 1 Success -> move to step 2
  const handleCompanySuccess = (newCompanyId: string, companyInfo: any) => {
    setCompanyId(newCompanyId);
    setCompanyName(companyInfo.companyName);
    setCompletedSteps((prev) => (prev.includes(1) ? prev : [...prev, 1]));
    setCurrentStep(2);
  };

  // Step 2 Success -> create/ensure assessment session & move to step 3
  const handleFactorySuccess = async (newFactoryId: string, profile: any) => {
    setFactoryId(newFactoryId);
    setFactoryName(profile.factoryName);
    setCompletedSteps((prev) => (prev.includes(2) ? prev : [...prev, 2]));

    // Create assessment session on backend if none exists
    if (!assessmentId) {
      try {
        const storedToken = localStorage.getItem("indus_irpa_token");
        const res = await fetch("/api/assessments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
          },
          body: JSON.stringify({
            factoryId: newFactoryId,
            industryId: selectedIndustry?.id || "IND-01",
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setAssessmentId(data.session.id);
          localStorage.setItem("indus_irpa_assessment_id", data.session.id);
        }
      } catch (err) {
        console.error("Failed to create assessment session:", err);
      }
    }

    setCurrentStep(3);
  };

  // Step 3: Select Industry Archetype
  const handleSelectIndustry = async (industry: IndustryDefinition) => {
    setSelectedIndustry(industry);
    localStorage.setItem("indus_irpa_industry", JSON.stringify(industry));
    setCompletedSteps((prev) => (prev.includes(3) ? prev : [...prev, 3]));

    // Update assessment session with selected industry
    if (assessmentId) {
      try {
        const storedToken = localStorage.getItem("indus_irpa_token");
        await fetch(`/api/assessments/${assessmentId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
          },
          body: JSON.stringify({ industryId: industry.id }),
        });
      } catch {}
    }

    setCurrentStep(4);
  };

  // Step 11: Target State Success -> move to step 12
  const handleTargetSuccess = (targetData: TargetStateData) => {
    setTargetState(targetData);
    setCompletedSteps((prev) => (prev.includes(11) ? prev : [...prev, 11]));
    setCurrentStep(12);
  };

  // Step 12: Final Submission Success
  const handleSubmitSuccess = (result: {
    referenceId: string;
    submittedAt: string;
    overallCurrentScore: number;
    overallTargetScore: number;
  }) => {
    setSubmittedResult(result);
    setCompletedSteps((prev) => (prev.includes(12) ? prev : [...prev, 12]));
  };

  // Evidence modal open
  const openEvidenceModal = (questionId: string, questionTitle: string) => {
    setActiveEvidenceQuestion({ id: questionId, title: questionTitle });
    setEvidenceModalOpen(true);
  };

  // Evidence upload callback
  const handleEvidenceUploaded = (newFile: EvidenceFileItem) => {
    setEvidenceFiles((prev) => [...prev, newFile]);
  };

  const handleEvidenceDeleted = async (fileId: string) => {
    setEvidenceFiles((prev) => prev.filter((f) => f.id !== fileId));
    // Call server delete if needed
  };

  // Filtered industries for Step 3
  const filteredIndustries = useMemo(() => {
    return IRPA_INDUSTRIES.filter((ind) => {
      const matchesSearch =
        ind.name.toLowerCase().includes(industrySearch.toLowerCase()) ||
        ind.archetype.toLowerCase().includes(industrySearch.toLowerCase()) ||
        ind.fastTrackFocus.toLowerCase().includes(industrySearch.toLowerCase());
      const matchesFilter =
        industryFilter === "All" ||
        ind.type.toLowerCase() === industryFilter.toLowerCase();
      return matchesSearch && matchesFilter;
    });
  }, [industrySearch, industryFilter]);

  // If already submitted, show submitted screen
  if (submittedResult) {
    return (
      <div className="min-h-screen bg-[#070D1F] text-slate-100 flex flex-col">
        <AssessmentSubmittedScreen
          referenceId={submittedResult.referenceId}
          factoryName={factoryName || "Primary Manufacturing Site"}
          companyName={companyName || "Industrial Partner"}
          submittedAt={submittedResult.submittedAt}
          overallCurrentScore={submittedResult.overallCurrentScore}
          overallTargetScore={submittedResult.overallTargetScore}
          onViewConsultantPortal={onOpenConsultant}
          onStartNew={() => {
            localStorage.removeItem("indus_irpa_assessment_id");
            localStorage.removeItem("indus_irpa_responses");
            localStorage.removeItem("indus_irpa_target_state");
            setAssessmentId("");
            setResponses({});
            setSubmittedResult(null);
            setCurrentStep(1);
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070D1F] text-slate-100 flex flex-col">
      {/* Top Progress Tracker */}
      <ProgressTracker
        currentStep={currentStep}
        completedSteps={completedSteps}
        totalQuestions={totalQuestionsCount}
        answeredQuestions={answeredQuestionsCount}
        onStepClick={(step) => setCurrentStep(step)}
      />

      {/* Auto-Save & Status Floating Notification Bar */}
      <div className="bg-[#0B132B]/90 border-b border-slate-800/60 px-4 sm:px-6 py-1.5 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          {saveStatus === "saving" ? (
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              Auto-saving assessment responses...
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              All responses synchronized locally &amp; to cloud
            </span>
          )}
          {saveError && <span className="text-amber-400">({saveError})</span>}
        </div>

        <div className="flex items-center gap-4">
          {companyName && (
            <span className="hidden sm:inline">
              Company: <strong className="text-white">{companyName}</strong>
            </span>
          )}
          {selectedIndustry && (
            <span>
              Sector: <strong className="text-cyan-400">{selectedIndustry.name}</strong>
            </span>
          )}
        </div>
      </div>

      {/* Main Form Content Area */}
      <main className="flex-1 pb-16">
        {/* Step 1: Company Registration */}
        {currentStep === 1 && (
          <div className="py-8">
            <CompanyRegistrationForm
              onSuccess={handleCompanySuccess}
              initialData={{ companyName }}
            />
          </div>
        )}

        {/* Step 2: Factory Profile */}
        {currentStep === 2 && (
          <div className="py-8">
            <FactoryProfileForm
              companyId={companyId}
              initialData={{ factoryName }}
              onSuccess={handleFactorySuccess}
              onBack={() => setCurrentStep(1)}
            />
          </div>
        )}

        {/* Step 3: Industry Selection */}
        {currentStep === 3 && (
          <div className="w-full max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-8 animate-in fade-in">
            {/* Header Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0F172A] to-[#1E293B] border border-blue-900/40 shadow-xl">
              <div className="flex items-center gap-3 text-cyan-400 text-sm font-semibold tracking-wider uppercase mb-2">
                <Layers className="w-4 h-4" />
                <span>Step 3 of 12 &bull; Industrial Archetype Calibration</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Select Your Manufacturing Industry Archetype
              </h2>
              <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
                Choose the industry profile that best describes your production facility. This tunes the domain weighting matrix ($W_d$), benchmark maturity targets, and prioritized robotics workcells.
              </p>

              {/* Search & Filter Bar */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="text"
                    value={industrySearch}
                    onChange={(e) => setIndustrySearch(e.target.value)}
                    placeholder="Search industry name, archetype or bottleneck..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-700 rounded-lg text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                  {["All", "Discrete", "Process", "Hybrid"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setIndustryFilter(type)}
                      className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                        industryFilter === type
                          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50"
                          : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 15 Industry Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredIndustries.map((ind) => {
                const isSelected = selectedIndustry?.id === ind.id;
                return (
                  <div
                    key={ind.id}
                    onClick={() => handleSelectIndustry(ind)}
                    className={`p-5 rounded-2xl border text-left cursor-pointer transition-all duration-200 flex flex-col justify-between group ${
                      isSelected
                        ? "bg-gradient-to-br from-blue-950/70 to-cyan-950/50 border-cyan-400 shadow-xl shadow-cyan-950/30 ring-1 ring-cyan-400"
                        : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300">
                          {ind.code}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                            ind.type === "Discrete"
                              ? "bg-blue-950 text-blue-300 border border-blue-500/30"
                              : ind.type === "Process"
                              ? "bg-purple-950 text-purple-300 border border-purple-500/30"
                              : "bg-amber-950 text-amber-300 border border-amber-500/30"
                          }`}
                        >
                          {ind.type}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {ind.name}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5 font-medium">
                        {ind.archetype}
                      </p>

                      <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between text-slate-300">
                          <span className="text-slate-500">Industry Median:</span>
                          <span className="font-mono font-semibold text-cyan-400">
                            Level {ind.currentMedian} / 5
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-300">
                          <span className="text-slate-500">Target Benchmark:</span>
                          <span className="font-mono font-semibold text-emerald-400">
                            Level {ind.targetBenchmark} / 5
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-300">
                          <span className="text-slate-500">Typical Payback:</span>
                          <span className="font-semibold text-amber-300">
                            {ind.typicalPayback}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60">
                        <span className="font-semibold text-slate-300">Focus: </span>
                        {ind.fastTrackFocus}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                      <span className="text-xs font-semibold text-cyan-400 group-hover:underline">
                        Select this Archetype
                      </span>
                      <ArrowRight className="w-4 h-4 text-cyan-400 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Step 3 Navigation Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(2)}
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Factory Profile
              </Button>

              {selectedIndustry && (
                <Button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium px-8 py-2.5 rounded-xl shadow-lg shadow-blue-900/30"
                >
                  <span>Continue with {selectedIndustry.name}</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Steps 4 to 10: Questionnaire Domain Sections */}
        {currentStep >= 4 && currentStep <= 10 && (
          <div className="w-full max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-8 animate-in fade-in">
            {/* Section Header */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0F172A] to-[#1E293B] border border-blue-900/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
                  <span>Step {currentStep} of 12</span>
                  <span>&bull;</span>
                  <span>Domains {STEP_DOMAINS_MAP[currentStep]?.join(" & ")}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {STEP_DOMAINS_MAP[currentStep]
                    ?.map((id) => IRPA_DOMAINS.find((d) => d.id === id)?.name)
                    .join(" & ")}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                  Evaluate each capability parameter according to verifiable plant operations. Answer options reflect Level 0 to Level 5 observable evidence.
                </p>
              </div>

              {/* Progress Pill */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-right shrink-0">
                <div className="text-[11px] text-slate-400">Section Progress</div>
                <div className="text-lg font-bold text-cyan-400 font-mono">
                  {
                    activeStepQuestions.filter(
                      (q) =>
                        responses[q.id]?.isNotApplicable ||
                        (responses[q.id]?.score !== null &&
                          responses[q.id]?.score !== undefined)
                    ).length
                  }{" "}
                  / {activeStepQuestions.length} Evaluated
                </div>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-6">
              {activeStepQuestions.map((question, qIdx) => (
                <AssessmentQuestionCard
                  key={question.id}
                  question={question}
                  index={qIdx}
                  totalQuestions={activeStepQuestions.length}
                  response={responses[question.id]}
                  evidenceFiles={evidenceFiles}
                  onChange={handleResponseChange}
                  onOpenEvidenceModal={openEvidenceModal}
                />
              ))}
            </div>

            {/* Step Navigation Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                className="border-slate-700 text-slate-300 hover:bg-slate-800 w-full sm:w-auto"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous Step
              </Button>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button
                  type="button"
                  onClick={() => {
                    setCompletedSteps((prev) =>
                      prev.includes(currentStep) ? prev : [...prev, currentStep]
                    );
                    setCurrentStep((prev) => Math.min(12, prev + 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-medium px-8 py-3 rounded-xl shadow-lg shadow-blue-900/30 w-full sm:w-auto transition-all"
                >
                  <span>Continue to Next Step</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 11: Target State Definition */}
        {currentStep === 11 && (
          <div className="py-8">
            <TargetStateForm
              assessmentId={assessmentId}
              initialData={targetState}
              domainScores={currentDomainScores}
              onSuccess={handleTargetSuccess}
              onBack={() => setCurrentStep(10)}
            />
          </div>
        )}

        {/* Step 12: Review & Final Submission */}
        {currentStep === 12 && (
          <div className="py-8">
            <AssessmentReviewSummary
              assessmentId={assessmentId}
              factoryName={factoryName}
              companyName={companyName}
              industryName={selectedIndustry?.name || "Manufacturing"}
              industryArchetype={
                (selectedIndustry?.type.toLowerCase() as any) || "discrete"
              }
              questions={allQuestions}
              responses={responses}
              evidenceFiles={evidenceFiles}
              targetState={targetState}
              onBack={() => setCurrentStep(11)}
              onSubmitSuccess={handleSubmitSuccess}
              onJumpToQuestion={(qId) => {
                // Find which step this question belongs to
                const targetQ = allQuestions.find((q) => q.id === qId);
                if (targetQ) {
                  for (const [stepNum, domainIds] of Object.entries(STEP_DOMAINS_MAP)) {
                    if (domainIds.includes(targetQ.domainId)) {
                      setCurrentStep(parseInt(stepNum));
                      window.scrollTo({ top: 0, behavior: "smooth" });
                      break;
                    }
                  }
                }
              }}
            />
          </div>
        )}
      </main>

      {/* Evidence Uploader Modal Dialog */}
      {activeEvidenceQuestion && (
        <EvidenceUploaderModal
          isOpen={evidenceModalOpen}
          onClose={() => setEvidenceModalOpen(false)}
          questionId={activeEvidenceQuestion.id}
          questionTitle={activeEvidenceQuestion.title}
          assessmentId={assessmentId}
          existingFiles={evidenceFiles}
          onUploadSuccess={handleEvidenceUploaded}
          onDeleteFile={handleEvidenceDeleted}
        />
      )}
    </div>
  );
}
