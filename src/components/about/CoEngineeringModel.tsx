import React, { useState } from "react";
import { Workflow, CheckCircle2, ArrowRight } from "lucide-react";
import { CO_ENGINEERING_STAGES } from "@/data/aboutPageData";

export function CoEngineeringModel() {
  const [selectedStage, setSelectedStage] = useState<number>(0);
  const active = CO_ENGINEERING_STAGES[selectedStage];

  return (
    <section
      id="co-engineering"
      className="py-20 lg:py-24 bg-white border-b border-[#E5EAF1] scroll-mt-36"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF] bg-[#EFF6FF] border border-[#D1E0FF]">
            <Workflow size={12} className="text-[#155EEF]" />
            COLLABORATIVE DELIVERY
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-[#101B2D]">
            Our Co-Engineering Model
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#475467] leading-relaxed">
            We partner directly with plant managers, robotics system integrators, and machine OEMs.
            From application discovery to final commissioning, our engineers work alongside your
            team at every phase.
          </p>
        </div>

        {/* Interactive 6-Stage Timeline Stepper */}
        <div className="mt-12">
          {/* Horizontal Stage Selectors */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
            {CO_ENGINEERING_STAGES.map((stage, idx) => {
              const isSelected = selectedStage === idx;

              return (
                <button
                  key={stage.step}
                  type="button"
                  onClick={() => setSelectedStage(idx)}
                  className={`p-3.5 rounded-xl border text-left transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF] ${
                    isSelected
                      ? "bg-[#155EEF] border-[#155EEF] text-white shadow-md scale-[1.02]"
                      : "bg-[#F8FAFC] border-[#E5EAF1] hover:bg-white hover:border-[#155EEF]/40 text-[#475467]"
                  }`}
                >
                  <span
                    className={`text-xs font-mono font-bold block ${
                      isSelected ? "text-white/80" : "text-[#155EEF]"
                    }`}
                  >
                    Stage {stage.step}
                  </span>
                  <span
                    className={`text-[12.5px] font-bold block mt-1 line-clamp-1 ${
                      isSelected ? "text-white" : "text-[#101B2D]"
                    }`}
                  >
                    {stage.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Stage Detailed Panel */}
          <div className="mt-6 rounded-2xl border border-[#E5EAF1] bg-[#F8FAFC] p-6 sm:p-8 lg:p-10 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#E5EAF1]">
              <div>
                <span className="text-xs font-mono font-bold text-[#155EEF] uppercase tracking-wider">
                  Phase {active.step} of 06
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#101B2D] mt-1">
                  {active.title}
                </h3>
                <p className="text-sm text-[#475467] mt-1">{active.shortDesc}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={selectedStage === 0}
                  onClick={() => setSelectedStage((prev) => Math.max(0, prev - 1))}
                  className="px-3.5 py-2 rounded-lg border border-[#E5EAF1] bg-white text-xs font-bold text-[#344054] hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Previous Phase
                </button>
                <button
                  type="button"
                  disabled={selectedStage === CO_ENGINEERING_STAGES.length - 1}
                  onClick={() =>
                    setSelectedStage((prev) => Math.min(CO_ENGINEERING_STAGES.length - 1, prev + 1))
                  }
                  className="px-4 py-2 rounded-lg bg-[#155EEF] text-white text-xs font-bold hover:bg-[#1047BF] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
                >
                  <span>Next Phase</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>

            {/* Stage Detailed Deliverables */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              {active.details.map((detail) => (
                <div
                  key={detail}
                  className="flex items-start gap-3 p-4 rounded-xl bg-white border border-[#E5EAF1]"
                >
                  <CheckCircle2 size={18} className="text-[#155EEF] shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm font-medium text-[#344054] leading-relaxed">
                    {detail}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
