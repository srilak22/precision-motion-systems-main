import React, { useState, useEffect } from "react";
import {
  Target,
  TrendingUp,
  Clock,
  DollarSign,
  ShieldCheck,
  Zap,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sliders,
  Sparkles,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { IRPA_DOMAINS } from "@/data/irpa/domains";

export interface TargetStateData {
  globalTargetLevel: number;
  domainTargets: Record<string, number>;
  automationObjectives: string[];
  targetOeeImprovement: string;
  targetScrapReduction: string;
  targetThroughputIncrease: string;
  paybackExpectationMonths: string;
  businessPriorities: string[];
  implementationTimeline: string;
  budgetReadiness: string;
  executiveNotes?: string;
}

const COMMON_OBJECTIVES = [
  "Reduce Critical Cycle Times & Bottlenecks",
  "Eliminate Scrap & Achieve Zero-Defect Quality",
  "Boost Factory Overall Equipment Effectiveness (OEE)",
  "Mitigate Skilled Labor Shortages & Ergonomic Risks",
  "Enable Flexible High-Mix / Low-Volume Production",
  "Achieve 100% Traceability for ISO/FDA Compliance",
  "Unify Shopfloor Telemetry with Cloud ERP/MES",
  "Deploy Predictive Maintenance to End Unplanned Downtime",
];

const BUSINESS_PRIORITIES = [
  "Maximum Operational Safety & ISO 10218 Compliance",
  "Rapid Return on Investment (Payback under 18 months)",
  "High Product Flexibility & Autonomous Changeovers",
  "Energy Efficiency & Sustainable Carbon Footprint",
  "Standardized Global Workcells Across Multi-Site Operations",
];

const TIMELINE_OPTIONS = [
  { id: "3_6_months", label: "3 – 6 Months (Immediate Fast-Track Workcells)" },
  { id: "6_12_months", label: "6 – 12 Months (Turnkey Line Automation Phase)" },
  { id: "12_24_months", label: "12 – 24 Months (Full Plant-Wide Transformation)" },
  { id: "24_plus_months", label: "24+ Months (Multi-Facility Strategic Modernization)" },
];

const BUDGET_RANGES = [
  { id: "under_50k", label: "< $50,000 USD (Pilot Cobot / Vision Station)" },
  { id: "50k_250k", label: "$50,000 – $250,000 USD (Single Turnkey Robotic Cell)" },
  { id: "250k_1m", label: "$250,000 – $1,000,000 USD (Integrated Multi-Cell Line)" },
  { id: "1m_5m", label: "$1,000,000 – $5,000,000 USD (Complete Automated Department)" },
  { id: "above_5m", label: "> $5,000,000 USD (Lights-Out Greenfield / Brownfield Facility)" },
];

interface TargetStateFormProps {
  assessmentId: string;
  initialData?: Partial<TargetStateData>;
  domainScores?: Record<string, number>; // Current domain scores
  onSuccess: (targetData: TargetStateData) => void;
  onBack: () => void;
}

export function TargetStateForm({
  assessmentId,
  initialData,
  domainScores = {},
  onSuccess,
  onBack,
}: TargetStateFormProps) {
  // Initialize domain targets with realistic default (e.g. current + 1 or 2, capped at 4 by default)
  const [domainTargets, setDomainTargets] = useState<Record<string, number>>(() => {
    if (initialData?.domainTargets) return initialData.domainTargets;
    const initial: Record<string, number> = {};
    IRPA_DOMAINS.forEach((d) => {
      const current = domainScores[d.id] || 1.5;
      initial[d.id] = Math.min(5, Math.max(2, Math.round(current + 1.5)));
    });
    return initial;
  });

  const [globalTargetLevel, setGlobalTargetLevel] = useState<number>(
    initialData?.globalTargetLevel || 3.5
  );

  const [automationObjectives, setAutomationObjectives] = useState<string[]>(
    initialData?.automationObjectives || [
      "Boost Factory Overall Equipment Effectiveness (OEE)",
      "Reduce Critical Cycle Times & Bottlenecks",
      "Eliminate Scrap & Achieve Zero-Defect Quality",
    ]
  );

  const [targetOeeImprovement, setTargetOeeImprovement] = useState(
    initialData?.targetOeeImprovement || "15"
  );
  const [targetScrapReduction, setTargetScrapReduction] = useState(
    initialData?.targetScrapReduction || "25"
  );
  const [targetThroughputIncrease, setTargetThroughputIncrease] = useState(
    initialData?.targetThroughputIncrease || "20"
  );
  const [paybackExpectationMonths, setPaybackExpectationMonths] = useState(
    initialData?.paybackExpectationMonths || "18"
  );

  const [businessPriorities, setBusinessPriorities] = useState<string[]>(
    initialData?.businessPriorities || [
      "Rapid Return on Investment (Payback under 18 months)",
      "Maximum Operational Safety & ISO 10218 Compliance",
    ]
  );

  const [implementationTimeline, setImplementationTimeline] = useState(
    initialData?.implementationTimeline || "6_12_months"
  );
  const [budgetReadiness, setBudgetReadiness] = useState(
    initialData?.budgetReadiness || "250k_1m"
  );
  const [executiveNotes, setExecutiveNotes] = useState(
    initialData?.executiveNotes || ""
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleObjective = (obj: string) => {
    setAutomationObjectives((prev) =>
      prev.includes(obj) ? prev.filter((x) => x !== obj) : [...prev, obj]
    );
  };

  const togglePriority = (p: string) => {
    setBusinessPriorities((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  const handleDomainTargetChange = (domainId: string, value: number) => {
    setDomainTargets((prev) => ({ ...prev, [domainId]: value }));
  };

  const applyGlobalPreset = (lvl: number) => {
    setGlobalTargetLevel(lvl);
    const updated: Record<string, number> = {};
    IRPA_DOMAINS.forEach((d) => {
      updated[d.id] = lvl;
    });
    setDomainTargets(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload: TargetStateData = {
      globalTargetLevel,
      domainTargets,
      automationObjectives,
      targetOeeImprovement,
      targetScrapReduction,
      targetThroughputIncrease,
      paybackExpectationMonths,
      businessPriorities,
      implementationTimeline,
      budgetReadiness,
      executiveNotes,
    };

    try {
      const storedToken = localStorage.getItem("indus_irpa_token");
      const res = await fetch(`/api/assessments/${assessmentId}/target`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save target state.");
      }

      localStorage.setItem("indus_irpa_target_state", JSON.stringify(payload));
      onSuccess(payload);
    } catch (err: any) {
      setError(err.message || "Failed to save target capabilities.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* Header Banner */}
      <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-[#0F172A] to-[#1E293B] border border-blue-900/40 shadow-xl">
        <div className="flex items-center gap-3 text-cyan-400 text-sm font-semibold tracking-wider uppercase mb-2">
          <Target className="w-4 h-4" />
          <span>Step 11 of 12 &bull; Strategic Transformation Calibration</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Target Automation Maturity &amp; Business Objectives
        </h2>
        <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
          Define your target maturity level across each domain. Rather than defaulting every domain to Level 5, calibrate targets according to operational return on investment, production economics, and capital readiness.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Domain-by-Domain Target Slider Matrix */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-cyan-400" />
                <span>Domain-Specific Target Maturity Ladder (Levels 1 – 5)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Configure your target score ($M_{'{target}'}$) per domain. Gaps are calculated as $G_d = M_{'{target}'} - M_{'{current}'}$.
              </p>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Quick Presets:</span>
              <button
                type="button"
                onClick={() => applyGlobalPreset(3)}
                className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-800 text-slate-200 hover:bg-slate-700"
              >
                Level 3 (Integrated)
              </button>
              <button
                type="button"
                onClick={() => applyGlobalPreset(4)}
                className="px-2.5 py-1 text-xs font-semibold rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-900/50"
              >
                Level 4 (Connected)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {IRPA_DOMAINS.map((domain) => {
              const currentVal = domainScores[domain.id] ?? 1.5;
              const targetVal = domainTargets[domain.id] ?? 3;
              const gap = Math.max(0, targetVal - currentVal);

              return (
                <div
                  key={domain.id}
                  className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <div className="text-xs font-bold text-slate-200">{domain.name}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Current: <span className="font-semibold text-white">{currentVal.toFixed(1)}</span> &bull; Gap:{" "}
                        <span className={`font-semibold ${gap > 1.5 ? "text-amber-400" : "text-emerald-400"}`}>
                          +{gap.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <div className="px-2 py-0.5 rounded text-xs font-bold bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                      Target: {targetVal}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={targetVal}
                      onChange={(e) =>
                        handleDomainTargetChange(domain.id, parseInt(e.target.value))
                      }
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>L1 Initial</span>
                      <span>L2 Basic</span>
                      <span>L3 Interm</span>
                      <span>L4 Adv</span>
                      <span>L5 Optim</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Automation Objectives */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-md space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <span>Primary Strategic Objectives</span>
          </h3>
          <p className="text-xs text-slate-400">
            Select the top business and engineering drivers propelling this automation initiative.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {COMMON_OBJECTIVES.map((obj) => {
              const active = automationObjectives.includes(obj);
              return (
                <button
                  type="button"
                  key={obj}
                  onClick={() => toggleObjective(obj)}
                  className={`p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-start gap-2.5 ${
                    active
                      ? "bg-amber-950/40 border-amber-500/70 text-amber-200 shadow-sm"
                      : "bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border shrink-0 ${
                      active
                        ? "bg-amber-500 border-amber-400 text-slate-950"
                        : "border-slate-700 bg-slate-900"
                    }`}
                  >
                    {active && <CheckCircle2 className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span>{obj}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Operational Target Metrics */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-md space-y-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <span>Quantified Operational Target Improvements</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target OEE Gain (%)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={targetOeeImprovement}
                  onChange={(e) => setTargetOeeImprovement(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
                />
                <span className="text-xs text-slate-400 font-bold">%</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Expected: +10% to +25%</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Scrap / Defect Reduction (%)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={targetScrapReduction}
                  onChange={(e) => setTargetScrapReduction(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
                />
                <span className="text-xs text-slate-400 font-bold">%</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Expected: -20% to -60%</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Throughput Boost (%)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={targetThroughputIncrease}
                  onChange={(e) => setTargetThroughputIncrease(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
                />
                <span className="text-xs text-slate-400 font-bold">%</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Expected: +15% to +40%</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target Payback (Months)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={paybackExpectationMonths}
                  onChange={(e) => setPaybackExpectationMonths(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
                />
                <span className="text-xs text-slate-400 font-bold">Mo</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Benchmark: 12 – 24 months</div>
            </div>
          </div>
        </div>

        {/* Section 4: Timeline & Budget Readiness */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-md space-y-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-cyan-400" />
            <span>Implementation Timeline &amp; Capital Readiness</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Target Deployment Timeline
              </label>
              <div className="space-y-2">
                {TIMELINE_OPTIONS.map((opt) => (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => setImplementationTimeline(opt.id)}
                    className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                      implementationTimeline === opt.id
                        ? "bg-cyan-950/50 border-cyan-400 text-white font-medium"
                        : "bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {implementationTimeline === opt.id && (
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Allocated Capital Budget (CAPEX)
              </label>
              <div className="space-y-2">
                {BUDGET_RANGES.map((opt) => (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => setBudgetReadiness(opt.id)}
                    className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                      budgetReadiness === opt.id
                        ? "bg-blue-950/50 border-blue-400 text-white font-medium"
                        : "bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {budgetReadiness === opt.id && (
                      <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Strategic Executive Remarks / Special Operating Conditions
            </label>
            <textarea
              rows={3}
              value={executiveNotes}
              onChange={(e) => setExecutiveNotes(e.target.value)}
              placeholder="e.g. Cleanroom ISO Class 6 requirements, union labor transition constraints, existing Siemens Profinet backbone..."
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="border-slate-700 text-slate-300 hover:bg-slate-800 w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Assessment Questions
          </Button>

          <Button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-medium px-8 py-3 rounded-xl shadow-lg shadow-blue-900/30 w-full sm:w-auto transition-all"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving Targets...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>Proceed to Final Review</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
