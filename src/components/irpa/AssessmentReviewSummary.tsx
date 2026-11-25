import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  FileText,
  Paperclip,
  BarChart3,
  Sliders,
  Award,
  AlertCircle,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { IRPA_DOMAINS } from "@/data/irpa/domains";
import { UserResponse, QuestionData } from "./AssessmentQuestionCard";
import { EvidenceFileItem } from "./EvidenceUploaderModal";
import { TargetStateData } from "./TargetStateForm";

interface AssessmentReviewSummaryProps {
  assessmentId: string;
  factoryName: string;
  companyName: string;
  industryName: string;
  industryArchetype?: "discrete" | "process" | "hybrid";
  questions: QuestionData[];
  responses: Record<string, UserResponse>;
  evidenceFiles: EvidenceFileItem[];
  targetState?: TargetStateData;
  onBack: () => void;
  onSubmitSuccess: (result: {
    referenceId: string;
    submittedAt: string;
    overallCurrentScore: number;
    overallTargetScore: number;
  }) => void;
  onJumpToQuestion?: (questionId: string) => void;
}

export function AssessmentReviewSummary({
  assessmentId,
  factoryName,
  companyName,
  industryName,
  industryArchetype = "discrete",
  questions,
  responses,
  evidenceFiles,
  targetState,
  onBack,
  onSubmitSuccess,
  onJumpToQuestion,
}: AssessmentReviewSummaryProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [executiveNotes, setExecutiveNotes] = useState("");

  // Domain score calculations
  const domainSummaries = IRPA_DOMAINS.map((domain) => {
    const domainQuestions = questions.filter((q) => q.domainId === domain.id);
    const applicableResponses = domainQuestions
      .map((q) => responses[q.id])
      .filter((r) => r && !r.isNotApplicable && r.score !== null && r.score !== undefined);

    const answeredCount = applicableResponses.length;
    const totalCount = domainQuestions.length;

    const currentScore =
      answeredCount > 0
        ? applicableResponses.reduce((sum, r) => sum + (r.score ?? 0), 0) / answeredCount
        : 1.0;

    const targetScore = targetState?.domainTargets[domain.id] ?? 3.5;
    const gap = Math.max(0, targetScore - currentScore);

    // Get weight based on industry archetype
    const weight =
      industryArchetype === "process"
        ? domain.weights.process
        : industryArchetype === "hybrid"
        ? domain.weights.hybrid
        : domain.weights.discrete;

    // Priority classification based on gap & weight
    let priority: "Critical" | "High" | "Moderate" | "Low" = "Moderate";
    const weightedGap = gap * weight;
    if (gap >= 2.0 && weight >= 0.08) priority = "Critical";
    else if (gap >= 1.5 || weightedGap >= 0.15) priority = "High";
    else if (gap >= 0.8) priority = "Moderate";
    else priority = "Low";

    return {
      domain,
      weight,
      currentScore,
      targetScore,
      gap,
      priority,
      answeredCount,
      totalCount,
    };
  });

  // Calculate overall weighted score
  const totalWeight = domainSummaries.reduce((sum, d) => sum + d.weight, 0);
  const overallCurrent =
    domainSummaries.reduce((sum, d) => sum + d.currentScore * d.weight, 0) /
    (totalWeight || 1);
  const overallTarget =
    domainSummaries.reduce((sum, d) => sum + d.targetScore * d.weight, 0) /
    (totalWeight || 1);
  const overallGap = Math.max(0, overallTarget - overallCurrent);

  // Missing answers check
  const unanswered = questions.filter(
    (q) => !responses[q.id] || (responses[q.id].score === null && !responses[q.id].isNotApplicable)
  );

  const handleSubmit = async () => {
    setError(null);
    setSubmitting(true);

    try {
      const storedToken = localStorage.getItem("indus_irpa_token");
      const res = await fetch(`/api/assessments/${assessmentId}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
        },
        body: JSON.stringify({
          notes: executiveNotes,
          overallCurrentScore: parseFloat(overallCurrent.toFixed(2)),
          overallTargetScore: parseFloat(overallTarget.toFixed(2)),
          domainBreakdown: domainSummaries.map((d) => ({
            domainId: d.domain.id,
            currentScore: parseFloat(d.currentScore.toFixed(2)),
            targetScore: parseFloat(d.targetScore.toFixed(2)),
            gap: parseFloat(d.gap.toFixed(2)),
            priority: d.priority,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit assessment.");
      }

      onSubmitSuccess({
        referenceId: data.referenceId || `IRPA-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        submittedAt: new Date().toISOString(),
        overallCurrentScore: parseFloat(overallCurrent.toFixed(2)),
        overallTargetScore: parseFloat(overallTarget.toFixed(2)),
      });
    } catch (err: any) {
      setError(err.message || "Failed to finalize and submit assessment.");
    } finally {
      setSubmitting(false);
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-rose-950/70 border-rose-500/50 text-rose-300";
      case "High":
        return "bg-amber-950/70 border-amber-500/50 text-amber-300";
      case "Moderate":
        return "bg-blue-950/70 border-blue-500/50 text-blue-300";
      default:
        return "bg-slate-800 border-slate-700 text-slate-400";
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0F172A] to-[#1E293B] border border-blue-900/40 shadow-xl">
        <div className="flex items-center gap-3 text-cyan-400 text-sm font-semibold tracking-wider uppercase mb-2">
          <Award className="w-4 h-4" />
          <span>Step 12 of 12 &bull; Pre-Submission Verification &amp; Audit</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Automation Gap Analysis Pre-Submission Summary
        </h2>
        <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
          Review your factory capability scores, domain weights, target aspirations, and attached evidence before final submission to INDUS Industrial Robotics consultants.
        </p>

        {/* Facility Meta */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-6 text-xs text-slate-300">
          <div>
            <span className="text-slate-500">Facility:</span>{" "}
            <span className="font-semibold text-white">{factoryName || "Plant 01"}</span>
          </div>
          <div>
            <span className="text-slate-500">Enterprise:</span>{" "}
            <span className="font-semibold text-white">{companyName || "Industrial Partner"}</span>
          </div>
          <div>
            <span className="text-slate-500">Industry:</span>{" "}
            <span className="font-semibold text-cyan-400">{industryName}</span>
          </div>
          <div>
            <span className="text-slate-500">Archetype:</span>{" "}
            <span className="font-semibold text-indigo-400 uppercase">{industryArchetype}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/50 flex items-start gap-3 text-red-200 text-sm">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}

      {/* Unanswered Questions Alert Callout */}
      {unanswered.length > 0 && (
        <div className="p-5 rounded-2xl bg-amber-950/40 border border-amber-500/50 space-y-3">
          <div className="flex items-center gap-2.5 text-amber-300 font-semibold text-sm">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <span>Notice: {unanswered.length} Questions Remain Unanswered</span>
          </div>
          <p className="text-xs text-amber-200/80 leading-relaxed">
            Unanswered questions default to Level 1.0 (Initial) baseline. For maximum accuracy in your gap analysis report, we recommend completing all questions before submitting.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {unanswered.slice(0, 10).map((q) => (
              <button
                key={q.id}
                type="button"
                onClick={() => onJumpToQuestion && onJumpToQuestion(q.id)}
                className="px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-amber-900/60 text-amber-200 border border-amber-500/40 hover:bg-amber-800"
              >
                {q.code}: {q.title.slice(0, 24)}...
              </button>
            ))}
            {unanswered.length > 10 && (
              <span className="px-2 py-1 text-xs text-amber-400">
                +{unanswered.length - 10} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* High-Level Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Current Score */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-center relative overflow-hidden">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Current Factory Baseline ($M_{'{curr}'}$)
          </div>
          <div className="text-4xl sm:text-5xl font-black text-cyan-400 tracking-tight font-mono">
            {overallCurrent.toFixed(2)}
          </div>
          <div className="text-xs text-slate-400 mt-2 font-medium">
            Maturity Level {Math.floor(overallCurrent)} &bull;{" "}
            {overallCurrent < 2 ? "Initial Manual" : overallCurrent < 3 ? "Basic Automation" : "Intermediate"}
          </div>
        </div>

        {/* Target Score */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-center relative overflow-hidden">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Target Strategic Maturity ($M_{'{target}'}$)
          </div>
          <div className="text-4xl sm:text-5xl font-black text-emerald-400 tracking-tight font-mono">
            {overallTarget.toFixed(2)}
          </div>
          <div className="text-xs text-slate-400 mt-2 font-medium">
            Maturity Level {Math.floor(overallTarget)} &bull;{" "}
            {overallTarget >= 4 ? "Connected & Automated" : "Intermediate Robotics"}
          </div>
        </div>

        {/* Aggregate Gap */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-cyan-500/30 text-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40">
          <div className="text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-2">
            Composite Automation Gap ($\Delta$)
          </div>
          <div className="text-4xl sm:text-5xl font-black text-white tracking-tight font-mono">
            +{overallGap.toFixed(2)}
          </div>
          <div className="text-xs text-cyan-400 mt-2 font-medium">
            {overallGap > 1.8 ? "High Transformation Opportunity" : "Moderate Transition"}
          </div>
        </div>
      </div>

      {/* Domain-by-Domain Scorecard Matrix Table */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <span>12-Domain Capability Scorecard &amp; Priority Classification</span>
          </h3>
          <span className="text-xs text-slate-400">
            Formula: $G_d = M_{'{target}'} - M_{'{current}'}$
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold tracking-wider text-[11px]">
                <th className="py-3 px-3">Domain</th>
                <th className="py-3 px-3 text-center">Weight ($W_d$)</th>
                <th className="py-3 px-3 text-center">Current Score</th>
                <th className="py-3 px-3 text-center">Target Score</th>
                <th className="py-3 px-3 text-center">Gap ($G_d$)</th>
                <th className="py-3 px-3 text-center">Priority</th>
                <th className="py-3 px-3 text-right">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {domainSummaries.map((row) => (
                <tr key={row.domain.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-medium text-white">
                    <div className="font-semibold text-slate-100">{row.domain.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Domain {row.domain.number}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-slate-300">
                    {(row.weight * 100).toFixed(0)}%
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-cyan-400">
                    {row.currentScore.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-emerald-400">
                    {row.targetScore.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-amber-300">
                    +{row.gap.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${getPriorityBadge(
                        row.priority
                      )}`}
                    >
                      {row.priority}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right text-slate-400 font-mono">
                    {row.answeredCount}/{row.totalCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attached Evidence Checklist */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Paperclip className="w-5 h-5 text-blue-400" />
            <span>Substantiating Evidence Register</span>
          </h3>
          <span className="text-xs text-slate-400">
            {evidenceFiles.length} files attached
          </span>
        </div>

        {evidenceFiles.length === 0 ? (
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 text-xs text-slate-400 flex items-center gap-3">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              No supporting documents uploaded. Assessments with uploaded SOPs or telemetry data receive faster formal verification.
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {evidenceFiles.map((file) => (
              <div
                key={file.id}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="truncate font-medium text-slate-200">
                    {file.fileName}
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 font-mono uppercase shrink-0">
                  {file.questionId}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reviewer / Submitter Notes */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-md space-y-3">
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Submission Notes for INDUS Consulting Engineers
        </label>
        <textarea
          rows={3}
          value={executiveNotes}
          onChange={(e) => setExecutiveNotes(e.target.value)}
          placeholder="Add any specific context regarding production shutdowns, target automation timelines, or specific workcells you want prioritized..."
          className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
      </div>

      {/* Submission CTA Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="border-slate-700 text-slate-300 hover:bg-slate-800 w-full sm:w-auto"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Target Configuration
        </Button>

        <Button
          type="button"
          disabled={submitting}
          onClick={handleSubmit}
          className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-semibold px-10 py-3.5 rounded-xl shadow-xl shadow-emerald-950/40 w-full sm:w-auto transition-all text-sm"
        >
          {submitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Transmitting Assessment for Verification...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
              <span>Submit Assessment for Official Audit</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}
