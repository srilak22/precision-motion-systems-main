import React from "react";
import { TrendingUp, Target, ShieldCheck, Cpu, CheckCircle2 } from "lucide-react";
import { IMPACT_AREAS } from "@/data/aboutPageData";

const ICONS = [TrendingUp, Target, ShieldCheck, Cpu];

export function RoboticsImpact() {
  return (
    <section className="py-20 lg:py-24 bg-white border-b border-[#E5EAF1]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF] bg-[#EFF6FF] border border-[#D1E0FF]">
            <Target size={12} className="text-[#155EEF]" />
            MEASURABLE TRANSFORMATION
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-[#101B2D]">
            Impact of Robotics &amp; Physical AI
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#475467] leading-relaxed">
            By eliminating mechanical backlash and embedding deterministic intelligence into every
            workcell, we empower manufacturers to build resilient, high-speed, and safe production
            operations.
          </p>
        </div>

        {/* 4 Impact Cards Grid (2x2 on desktop) */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {IMPACT_AREAS.map((item, idx) => {
            const Icon = ICONS[idx % ICONS.length];

            return (
              <div
                key={item.id}
                className="rounded-2xl border border-[#E5EAF1] bg-[#F8FAFC] p-8 shadow-xs hover:border-[#155EEF]/50 hover:bg-white hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="size-12 rounded-xl bg-white border border-[#D1E0FF] text-[#155EEF] flex items-center justify-center group-hover:bg-[#155EEF] group-hover:text-white transition-colors duration-200">
                      <Icon size={22} />
                    </div>
                    <span className="text-[11px] font-mono font-bold text-[#155EEF] px-2.5 py-1 rounded-md bg-[#EFF6FF] border border-[#D1E0FF]">
                      SECTOR PILLAR 0{idx + 1}
                    </span>
                  </div>

                  <span className="block mt-5 text-xs font-mono font-bold text-[#0284C7] uppercase tracking-wider">
                    {item.tagline}
                  </span>
                  <h3 className="mt-1 text-2xl font-bold text-[#101B2D] group-hover:text-[#155EEF] transition-colors">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-xs sm:text-sm text-[#475467] leading-relaxed">
                    {item.description}
                  </p>

                  <div className="mt-6 space-y-2.5 pt-4 border-t border-[#E5EAF1]">
                    {item.keyPoints.map((point) => (
                      <div key={point} className="flex items-start gap-2.5 text-xs text-[#344054]">
                        <CheckCircle2 size={15} className="text-[#155EEF] shrink-0 mt-0.5" />
                        <span className="font-medium">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E5EAF1]">
                  <span className="text-[11px] font-mono font-semibold text-[#667085]">
                    Engineering Design Objective
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
