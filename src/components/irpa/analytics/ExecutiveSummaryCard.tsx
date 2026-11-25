import React from "react";
import {
  Award,
  TrendingUp,
  Target,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  BarChart3,
  Factory,
} from "lucide-react";

interface ExecutiveSummaryCardProps {
  summary: {
    sessionId: string;
    assessmentId: string;
    industryId: string;
    industryArchetype: string;
    overallCurrentMaturity: number;
    overallTargetMaturity: number;
    overallWeightedGap: number;
    overallAchievementPercentage: number;
    evidenceConfidencePercentage: number;
    evidenceQualityRating: string;
    criticalGapsCount: number;
    highGapsCount: number;
    hasContradictions: boolean;
  };
  factoryName?: string;
  companyName?: string;
  calculatedAt?: string;
}

export function ExecutiveSummaryCard({
  summary,
  factoryName = "Primary Manufacturing Facility",
  companyName = "Industrial Enterprise",
  calculatedAt,
}: ExecutiveSummaryCardProps) {
  const getMaturityLabel = (score: number) => {
    if (score < 1.0) return "Level 0: Not Implemented";
    if (score < 2.0) return "Level 1: Initial Manual";
    if (score < 3.0) return "Level 2: Basic Standalone";
    if (score < 4.0) return "Level 3: Intermediate Robotics";
    if (score < 4.8) return "Level 4: Advanced Connected";
    return "Level 5: Optimized Autonomous";
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0B132B] via-[#0F172A] to-[#1E293B] border border-cyan-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                {summary.assessmentId}
              </span>
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                {summary.industryArchetype} Archetype
              </span>
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Phase 3 Intelligence Certified
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Industrial Automation Gap &amp; Intelligence Report
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
              Factory: <strong className="text-white">{factoryName}</strong> &bull; Enterprise:{" "}
              <strong className="text-white">{companyName}</strong> &bull; Evaluated on{" "}
              {calculatedAt ? new Date(calculatedAt).toLocaleDateString() : new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Quick Confidence Pill */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 shrink-0 text-right">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
              Evidence Quality Rating
            </div>
            <div className="text-base font-bold text-cyan-400 mt-0.5">
              {summary.evidenceQualityRating}
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center justify-end gap-1.5">
              <span className="font-mono font-bold text-white">{summary.evidenceConfidencePercentage}%</span>
              <span>Audit Confidence</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Executive Metric Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Baseline Maturity */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase mb-2">
            <span>Current Baseline ($M_{'{curr}'}$)</span>
            <Factory className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-4xl font-black text-cyan-400 font-mono tracking-tight">
            {summary.overallCurrentMaturity.toFixed(2)}
          </div>
          <div className="text-xs text-slate-400 mt-2 font-medium">
            {getMaturityLabel(summary.overallCurrentMaturity)}
          </div>
        </div>

        {/* Target Horizon */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase mb-2">
            <span>Target Horizon ($M_{'{tgt}'}$)</span>
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-4xl font-black text-emerald-400 font-mono tracking-tight">
            {summary.overallTargetMaturity.toFixed(2)}
          </div>
          <div className="text-xs text-slate-400 mt-2 font-medium">
            {getMaturityLabel(summary.overallTargetMaturity)}
          </div>
        </div>

        {/* Weighted Gap */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 shadow-lg bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-cyan-300 font-semibold uppercase mb-2">
            <span>Weighted Gap ($\Delta$)</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-4xl font-black text-white font-mono tracking-tight">
            +{summary.overallWeightedGap.toFixed(2)}
          </div>
          <div className="text-xs text-cyan-400 mt-2 font-medium">
            {summary.overallAchievementPercentage}% Desired Maturity Met
          </div>
        </div>

        {/* Critical & High Prioritization */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase mb-2">
            <span>Intervention Urgency</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-rose-400 font-mono">
              {summary.criticalGapsCount}
            </span>
            <span className="text-xs text-slate-400 font-semibold">Critical</span>
            <span className="text-2xl font-bold text-amber-400 font-mono ml-2">
              {summary.highGapsCount}
            </span>
            <span className="text-xs text-slate-400 font-semibold">High</span>
          </div>
          <div className="text-xs text-slate-400 mt-2">
            {summary.hasContradictions ? (
              <span className="text-amber-400 font-semibold">Contains data contradiction flags</span>
            ) : (
              <span className="text-emerald-400">Zero contradiction discrepancies</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
