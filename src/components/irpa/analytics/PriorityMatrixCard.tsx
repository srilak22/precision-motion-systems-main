import React from "react";
import { AlertTriangle, ShieldAlert, CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";

interface PriorityItem {
  domainId: string;
  domainCode: string;
  domainName: string;
  itemTitle: string;
  classification: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | string;
  gapSeverity: number;
  productionImpact: number;
  financialImpact: number;
  safetyImpact: number;
  qualityImpact: number;
  feasibilityScore: number;
  urgencyScore: number;
  compositePriorityScore: number;
  isSafetyEscalated: number;
  recommendedAction: string;
}

interface PriorityMatrixCardProps {
  priorities: PriorityItem[];
}

export function PriorityMatrixCard({ priorities }: PriorityMatrixCardProps) {
  const getBadgeStyle = (classification: string, isSafety: number) => {
    if (isSafety === 1) {
      return "bg-rose-950 text-rose-300 border-rose-500 shadow-md shadow-rose-950/40 ring-1 ring-rose-500";
    }
    switch (classification) {
      case "CRITICAL":
        return "bg-rose-950/80 text-rose-300 border-rose-500/50";
      case "HIGH":
        return "bg-amber-950/80 text-amber-300 border-amber-500/50";
      case "MEDIUM":
        return "bg-blue-950/80 text-blue-300 border-blue-500/50";
      default:
        return "bg-slate-800 text-slate-400 border-slate-700";
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <span>Intelligent Gap Prioritization Matrix</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Multi-factor scoring: Gap Severity (25%) + Safety (25%) + Production (15%) + Financial (15%) + Feasibility (10%) + Quality (10%).
          </p>
        </div>

        <div className="text-xs text-rose-300 font-semibold flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-500/40 shrink-0">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Safety-Critical Escalation Enabled</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {priorities.map((item) => (
          <div
            key={item.domainId}
            className={`p-5 rounded-2xl border transition-all space-y-3 ${
              item.classification === "CRITICAL"
                ? "bg-gradient-to-br from-slate-950 to-rose-950/30 border-rose-500/40"
                : item.classification === "HIGH"
                ? "bg-slate-950/60 border-amber-500/30"
                : "bg-slate-950/40 border-slate-800"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-mono font-bold text-cyan-400">
                {item.domainCode} &bull; {item.domainName}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border ${getBadgeStyle(
                  item.classification,
                  item.isSafetyEscalated
                )}`}
              >
                {item.isSafetyEscalated === 1 ? "CRITICAL (Safety Escalated)" : item.classification}
              </span>
            </div>

            <div className="text-sm font-bold text-white">{item.itemTitle}</div>

            {/* Factor score chips */}
            <div className="grid grid-cols-4 gap-2 pt-1 text-center text-[10px] font-mono">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-slate-400">Severity</div>
                <div className="font-bold text-cyan-400 mt-0.5">{item.gapSeverity.toFixed(1)}</div>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-slate-400">Safety</div>
                <div className="font-bold text-rose-400 mt-0.5">{item.safetyImpact.toFixed(1)}</div>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-slate-400">Production</div>
                <div className="font-bold text-amber-400 mt-0.5">{item.productionImpact.toFixed(1)}</div>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-slate-400">Feasibility</div>
                <div className="font-bold text-emerald-400 mt-0.5">{item.feasibilityScore.toFixed(0)}/5</div>
              </div>
            </div>

            <div className="pt-2 text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <span className="font-semibold text-cyan-300">Action: </span>
              {item.recommendedAction}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
