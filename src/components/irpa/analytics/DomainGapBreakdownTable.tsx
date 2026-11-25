import React, { useState } from "react";
import {
  Layers,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Filter,
} from "lucide-react";

interface AnalyzedGapItem {
  domainId: string;
  domainCode: string;
  domainName: string;
  currentScore: number;
  targetScore: number;
  gapScore: number;
  gapPercentage: number;
  missingCapabilities: string[];
  operationalImpact: string;
  recommendedImprovement: string;
  priorityClassification: string;
  isApplicable: boolean;
}

interface DomainGapBreakdownTableProps {
  gaps: AnalyzedGapItem[];
}

export function DomainGapBreakdownTable({ gaps }: DomainGapBreakdownTableProps) {
  const [expandedDomainId, setExpandedDomainId] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");

  const toggleExpand = (id: string) => {
    setExpandedDomainId(expandedDomainId === id ? null : id);
  };

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case "CRITICAL":
        return "bg-rose-950/70 text-rose-300 border-rose-500/50";
      case "HIGH":
        return "bg-amber-950/70 text-amber-300 border-amber-500/50";
      case "MEDIUM":
        return "bg-blue-950/70 text-blue-300 border-blue-500/50";
      default:
        return "bg-slate-800 text-slate-400 border-slate-700";
    }
  };

  const filtered = gaps.filter((g) => {
    if (priorityFilter === "ALL") return true;
    return g.priorityClassification === priorityFilter;
  });

  return (
    <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span>12-Domain Capability Gap Analysis &amp; Action Plan</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Formula: $G_d = M_{'{target}'} - M_{'{current}'}$ &bull; Gap % = $(G_d / M_{'{target}'}) \times 100$
          </p>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-1.5 text-xs">
          {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPriorityFilter(p)}
              className={`px-2.5 py-1 rounded-md font-semibold text-[11px] transition-colors ${
                priorityFilter === p
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50"
                  : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-white"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold text-[11px]">
              <th className="py-3 px-3">Domain</th>
              <th className="py-3 px-3 text-center">Current</th>
              <th className="py-3 px-3 text-center">Target</th>
              <th className="py-3 px-3 text-center">Gap ($G_d$)</th>
              <th className="py-3 px-3 text-center">Gap %</th>
              <th className="py-3 px-3 text-center">Priority</th>
              <th className="py-3 px-3 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.map((row) => {
              const isExpanded = expandedDomainId === row.domainId;
              return (
                <React.Fragment key={row.domainId}>
                  <tr
                    onClick={() => toggleExpand(row.domainId)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-white flex items-center gap-2">
                        <span>{row.domainName}</span>
                      </div>
                      <div className="text-[10px] font-mono text-cyan-400">{row.domainCode}</div>
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono font-bold text-cyan-400">
                      {row.currentScore.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono font-bold text-emerald-400">
                      {row.targetScore.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono font-bold text-amber-300">
                      +{row.gapScore.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono text-slate-300">
                      {row.gapPercentage.toFixed(1)}%
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold border ${getPriorityBadge(
                          row.priorityClassification
                        )}`}
                      >
                        {row.priorityClassification}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right text-slate-400">
                      <button
                        type="button"
                        className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>

                  {/* Expandable Drilldown Row */}
                  {isExpanded && (
                    <tr className="bg-slate-950/70 border-b border-slate-800">
                      <td colSpan={7} className="p-4 sm:p-5 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Operational Impact */}
                          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                            <div className="text-[11px] font-semibold text-rose-300 uppercase mb-1">
                              Operational Impact &amp; Bottleneck
                            </div>
                            <div className="text-xs text-slate-300 leading-relaxed">
                              {row.operationalImpact}
                            </div>
                          </div>

                          {/* Recommended Countermeasure */}
                          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                            <div className="text-[11px] font-semibold text-cyan-300 uppercase mb-1">
                              Recommended Engineering Countermeasure
                            </div>
                            <div className="text-xs text-slate-300 leading-relaxed">
                              {row.recommendedImprovement}
                            </div>
                          </div>
                        </div>

                        {/* Missing Capabilities List */}
                        {row.missingCapabilities && row.missingCapabilities.length > 0 && (
                          <div className="pt-1">
                            <div className="text-[11px] font-semibold text-slate-400 uppercase mb-1.5">
                              Missing Capability Ladder Steps:
                            </div>
                            <div className="space-y-1">
                              {row.missingCapabilities.map((cap, idx) => (
                                <div
                                  key={idx}
                                  className="text-xs text-slate-300 flex items-start gap-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800/60"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5" />
                                  <span>{cap}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
