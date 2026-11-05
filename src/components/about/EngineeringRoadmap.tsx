import React from "react";
import { Milestone, CheckCircle2 } from "lucide-react";
import { ROADMAP_STAGES } from "@/data/aboutPageData";

export function EngineeringRoadmap() {
  return (
    <section className="py-20 lg:py-24 bg-[#F8FAFC] border-b border-[#E5EAF1]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF] bg-[#EFF6FF] border border-[#D1E0FF]">
            <Milestone size={12} className="text-[#155EEF]" />
            PROGRESSIVE EXECUTION
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-[#101B2D]">
            Engineering Development Roadmap
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#475467] leading-relaxed">
            Our structured multi-stage execution framework translates complex industrial automation
            requirements into validated, repeatable, high-uptime deployments.
          </p>
        </div>

        {/* 5-Stage Progressive Roadmap Timeline */}
        <div className="mt-14 relative">
          {/* Desktop Connecting Line */}
          <div className="hidden lg:block absolute top-[28px] left-[5%] right-[5%] h-0.5 bg-gradient-to-r from-[#155EEF] via-[#0284C7] to-[#16A34A] z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10">
            {ROADMAP_STAGES.map((stage, idx) => (
              <div
                key={stage.stage}
                className="rounded-2xl border border-[#E5EAF1] bg-white p-6 shadow-xs hover:border-[#155EEF]/50 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  {/* Step Marker Indicator */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="size-8 rounded-full bg-[#EFF6FF] border-2 border-[#155EEF] text-[#155EEF] font-mono font-bold text-xs flex items-center justify-center group-hover:bg-[#155EEF] group-hover:text-white transition-colors">
                      0{idx + 1}
                    </span>
                    <span className="text-[10.5px] font-mono font-bold text-[#667085] uppercase">
                      {stage.stage}
                    </span>
                  </div>

                  {/* Stage Heading */}
                  <h3 className="text-base font-bold text-[#101B2D] group-hover:text-[#155EEF] transition-colors">
                    {stage.name}
                  </h3>
                  <p className="mt-1 text-[11px] font-medium text-[#155EEF] leading-tight">
                    {stage.subtitle}
                  </p>

                  {/* Milestones list */}
                  <ul className="mt-4 space-y-2 pt-3 border-t border-[#F2F4F7]">
                    {stage.points.map((pt) => (
                      <li
                        key={pt}
                        className="flex items-start gap-1.5 text-[11px] text-[#475467] leading-relaxed"
                      >
                        <CheckCircle2 size={13} className="text-[#155EEF] shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-3 border-t border-[#F2F4F7]">
                  <span className="text-[10px] font-mono text-[#98A2B3] font-semibold block">
                    Deliverable Gate Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
