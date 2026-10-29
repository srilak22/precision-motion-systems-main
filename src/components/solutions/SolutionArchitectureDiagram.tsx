import React, { useState } from "react";
import {
  Activity,
  Cpu,
  Radio,
  Sliders,
  ShieldCheck,
  ArrowRight,
  Layers,
  CheckCircle2,
} from "lucide-react";
import type { SolutionArchitectureStep } from "@/data/solutions";

interface SolutionArchitectureDiagramProps {
  solutionId: string;
  solutionTitle: string;
  steps: SolutionArchitectureStep[];
}

export function SolutionArchitectureDiagram({
  solutionId,
  solutionTitle,
  steps,
}: SolutionArchitectureDiagramProps) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const activeStep = steps[activeStepIndex] || steps[0];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF]">
            Deterministic System Topology
          </span>
          <h3 className="font-display text-xl font-bold text-slate-900 mt-0.5">
            {solutionTitle} Architecture &amp; Signal Flow
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2.5 py-1 text-[11px] font-mono text-slate-600">
            <Radio size={12} className="text-[#155EEF]" />
            <span>Cyclic Synchronous Loop</span>
          </span>
        </div>
      </div>

      {/* Interactive Step Navigator */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2">
        {steps.map((step, idx) => {
          const isActive = idx === activeStepIndex;
          return (
            <button
              key={step.step}
              type="button"
              onClick={() => setActiveStepIndex(idx)}
              className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                isActive
                  ? "border-[#155EEF] bg-blue-50/60 shadow-xs"
                  : "border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className={`font-mono text-xs font-bold ${isActive ? "text-[#155EEF]" : "text-slate-400"}`}>
                  STAGE {step.step}
                </span>
                {isActive && <div className="size-2 rounded-full bg-[#155EEF]" />}
              </div>
              <span className={`text-xs font-bold line-clamp-1 ${isActive ? "text-slate-900" : "text-slate-600"}`}>
                {step.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Signal Flow Display */}
      {activeStep && (
        <div className="mt-6 rounded-xl border border-blue-100 bg-gradient-to-br from-slate-50 via-white to-blue-50/40 p-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded bg-[#155EEF] px-2 py-0.5 font-mono text-[10px] font-bold text-white uppercase tracking-wider">
                  Phase {activeStep.step}
                </span>
                <h4 className="text-base font-bold text-slate-900">
                  {activeStep.title}
                </h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {activeStep.description}
              </p>
            </div>

            {/* Signal Flow Path Ribbon */}
            {activeStep.signalFlow && (
              <div className="w-full lg:w-auto shrink-0 rounded-lg border border-slate-200 bg-white p-3.5 shadow-xs">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Deterministic Hardware Path
                </span>
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-800 flex-wrap">
                  {activeStep.signalFlow.split("->").map((segment, idx, arr) => (
                    <React.Fragment key={idx}>
                      <span className="rounded bg-slate-100 px-2 py-1 text-[11px] text-[#155EEF]">
                        {segment.trim()}
                      </span>
                      {idx < arr.length - 1 && (
                        <ArrowRight size={12} className="text-slate-400 shrink-0" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Control Hierarchy Strip */}
      <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">Tier 1: Master IPC</span>
          <span className="font-bold text-slate-800 text-xs">Trajectory Kernel</span>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">Tier 2: Fieldbus</span>
          <span className="font-bold text-slate-800 text-xs">EtherCAT / PROFINET</span>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">Tier 3: Drive / Motor</span>
          <span className="font-bold text-slate-800 text-xs">FOC 32 kHz Control</span>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">Tier 4: Safety / Load</span>
          <span className="font-bold text-slate-800 text-xs">Cat 4 PLe Interlocks</span>
        </div>
      </div>
    </div>
  );
}
