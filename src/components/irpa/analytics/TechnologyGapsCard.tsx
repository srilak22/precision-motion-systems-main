import React from "react";
import { Cpu, ShieldCheck, CheckCircle2, AlertCircle, Wrench, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DetectedTechnologyGap {
  ruleId: string;
  name: string;
  domainId: string;
  technologyCategory: string;
  missingTechnology: string;
  triggerCondition: string;
  recommendedSolution: string;
  confidenceScore: number;
  evidenceRequirements: string;
  safetyConstraints: string;
  isConsultantValidated?: boolean;
}

interface TechnologyGapsCardProps {
  techGaps: DetectedTechnologyGap[];
  onValidate?: (ruleId: string) => void;
  isConsultant?: boolean;
}

export function TechnologyGapsCard({
  techGaps,
  onValidate,
  isConsultant = false,
}: TechnologyGapsCardProps) {
  return (
    <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <span>Automated Technology Gap Detection ({techGaps.length} Opportunities Identified)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Rule-driven industrial robotics &amp; automation opportunities derived from shopfloor assessment signals.
          </p>
        </div>

        <div className="px-3 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-500/30 text-xs font-semibold shrink-0">
          Deterministic Rule Engine v1.0
        </div>
      </div>

      {techGaps.length === 0 ? (
        <div className="p-8 rounded-2xl bg-slate-950/40 border border-slate-800 text-center text-xs text-slate-400">
          No technology deficiencies detected. Facility baseline operates with modern robotics and automation systems.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {techGaps.map((gap) => (
            <div
              key={gap.ruleId}
              className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300">
                    {gap.ruleId} &bull; {gap.domainId}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950 border border-indigo-500/40 text-indigo-300">
                    {(gap.confidenceScore * 100).toFixed(0)}% Confidence
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white">{gap.name}</h4>
                <div className="text-xs text-cyan-400 font-semibold mt-0.5">
                  Missing: {gap.missingTechnology}
                </div>

                <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                  <span className="font-semibold text-emerald-300">Recommended Turnkey Solution: </span>
                  {gap.recommendedSolution}
                </div>

                <div className="mt-2.5 space-y-1.5 text-[11px] text-slate-400">
                  <div>
                    <span className="text-slate-500 font-semibold">Evidence Basis: </span>
                    {gap.evidenceRequirements}
                  </div>
                  <div>
                    <span className="text-amber-400/90 font-semibold">Safety Constraints: </span>
                    {gap.safetyConstraints}
                  </div>
                </div>
              </div>

              {/* Consultant Validation Status */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                {gap.isConsultantValidated ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Consultant Validated
                  </span>
                ) : isConsultant && onValidate ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => onValidate(gap.ruleId)}
                    className="border-slate-700 text-xs h-7 text-cyan-300 hover:bg-cyan-950/40 hover:border-cyan-500"
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Validate Finding
                  </Button>
                ) : (
                  <span className="text-slate-500 text-[11px]">Pending Consultant Verification</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
