import React, { useState } from "react";
import {
  HelpCircle,
  GitBranch,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Wrench,
  CheckCircle2,
  FileText,
} from "lucide-react";

interface RootCauseItem {
  id: string;
  category: "TECHNOLOGY" | "PEOPLE" | "PROCESS" | "DATA" | "FINANCIAL" | string;
  ishikawaBranch: string;
  title: string;
  description: string;
  fiveWhysTrail: string[];
  severityImpact: string;
  evidenceBasis: string;
  countermeasure: string;
  isOverride?: boolean;
  consultantNotes?: string;
}

interface RootCauseAnalysisCardProps {
  rootCauses: RootCauseItem[];
}

export function RootCauseAnalysisCard({ rootCauses }: RootCauseAnalysisCardProps) {
  const [activePillar, setActivePillar] = useState<string>("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const pillars = ["ALL", "TECHNOLOGY", "PEOPLE", "PROCESS", "DATA", "FINANCIAL"];

  const getPillarColor = (pillar: string) => {
    switch (pillar) {
      case "TECHNOLOGY":
        return "bg-blue-950 text-blue-300 border-blue-500/40";
      case "PEOPLE":
        return "bg-purple-950 text-purple-300 border-purple-500/40";
      case "PROCESS":
        return "bg-amber-950 text-amber-300 border-amber-500/40";
      case "DATA":
        return "bg-cyan-950 text-cyan-300 border-cyan-500/40";
      case "FINANCIAL":
        return "bg-emerald-950 text-emerald-300 border-emerald-500/40";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  const filtered = rootCauses.filter((rc) => {
    if (activePillar === "ALL") return true;
    return rc.category.toUpperCase() === activePillar;
  });

  return (
    <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-amber-400" />
            <span>Root Cause Analysis &bull; Ishikawa 6M &amp; 5-Whys Diagnostics</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Systemic classification of underlying manufacturing deficiencies into 5 organizational pillars.
          </p>
        </div>

        {/* Pillar Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {pillars.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setActivePillar(p)}
              className={`px-3 py-1.5 rounded-lg font-semibold text-[11px] transition-colors shrink-0 ${
                activePillar === p
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/50"
                  : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-white"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="p-8 rounded-2xl bg-slate-950/40 border border-slate-800 text-center text-xs text-slate-400">
          No systemic root causes identified in this pillar category.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((rc) => {
            const isExpanded = expandedId === rc.id;
            return (
              <div
                key={rc.id}
                className="rounded-2xl bg-slate-950/60 border border-slate-800 overflow-hidden transition-all"
              >
                <div
                  onClick={() => setExpandedId(isExpanded ? null : rc.id)}
                  className="p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-900/60 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getPillarColor(rc.category)}`}>
                        {rc.category}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        Ishikawa: <strong className="text-white">{rc.ishikawaBranch}</strong>
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 font-mono">
                        {rc.id}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white pt-1">{rc.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                      {rc.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        rc.severityImpact === "CRITICAL"
                          ? "bg-rose-950 text-rose-300 border-rose-500/50"
                          : rc.severityImpact === "HIGH"
                          ? "bg-amber-950 text-amber-300 border-amber-500/50"
                          : "bg-blue-950 text-blue-300 border-blue-500/50"
                      }`}
                    >
                      {rc.severityImpact}
                    </span>
                    <button type="button" className="p-1 rounded text-slate-400 hover:text-white">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* 5-Whys Drilldown Container */}
                {isExpanded && (
                  <div className="p-5 border-t border-slate-800 bg-slate-900/50 space-y-4 text-xs">
                    <div>
                      <div className="text-[11px] font-semibold text-cyan-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <GitBranch className="w-3.5 h-3.5" />
                        <span>Deterministic 5-Whys Diagnostic Chain</span>
                      </div>
                      <div className="space-y-1.5 pl-2 border-l-2 border-cyan-500/40">
                        {rc.fiveWhysTrail.map((why, wIdx) => (
                          <div key={wIdx} className="text-slate-300 leading-relaxed font-mono text-[11px]">
                            {why}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                      <span className="font-semibold text-emerald-400">Engineering Countermeasure: </span>
                      <span className="text-slate-200">{rc.countermeasure}</span>
                    </div>

                    {rc.consultantNotes && (
                      <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-indigo-200 text-xs">
                        <span className="font-semibold text-indigo-300">Consultant Observation: </span>
                        {rc.consultantNotes}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
