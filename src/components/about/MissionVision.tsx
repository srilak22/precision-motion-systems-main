import React from "react";
import { Target, Compass, Sparkles, CheckCircle2 } from "lucide-react";
import { ENGINEERING_PILLARS } from "@/data/aboutPageData";

export function MissionVision() {
  return (
    <section
      id="mission-vision"
      className="py-20 lg:py-24 bg-white border-b border-[#E5EAF1] scroll-mt-36"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF] bg-[#EFF6FF] border border-[#D1E0FF]">
            <Sparkles size={12} className="text-[#155EEF]" />
            FOUNDATIONAL ARCHITECTURE
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-[#101B2D]">
            Our Engineering Mission &amp; Vision
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#475467] leading-relaxed">
            Founded on physical first principles, INDUS empowers industrial manufacturing with
            deterministic precision motion subsystems, intelligent robotic workcells, and adaptive
            physical AI architectures.
          </p>
        </div>

        {/* Dedicated Mission & Vision Split Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Dedicated Mission Card */}
          <div className="rounded-2xl border border-[#E5EAF1] bg-[#F8FAFC] p-8 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between">
                <div className="size-12 rounded-xl bg-[#EFF6FF] border border-[#D1E0FF] text-[#155EEF] flex items-center justify-center group-hover:bg-[#155EEF] group-hover:text-white transition-colors duration-200">
                  <Target size={24} />
                </div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF] bg-white px-2.5 py-1 rounded-md border border-[#E5EAF1]">
                  CORE PURPOSE
                </span>
              </div>

              <h3 className="mt-6 text-2xl font-bold text-[#101B2D]">Our Mission</h3>
              <p className="mt-3 text-sm sm:text-base text-[#475467] leading-relaxed">
                To engineer deterministic, high-durability robotics, precision motion subsystems,
                and turnkey industrial automation platforms that maximize manufacturing uptime,
                repeatable accuracy, and operational efficiency for industrial enterprises
                worldwide.
              </p>

              <div className="mt-6 space-y-2.5 pt-4 border-t border-[#E5EAF1]">
                {[
                  "Eliminate kinematic integration risks with standardized ISO flanges",
                  "Guarantee sub-arcminute lost motion across continuous production cycles",
                  "Provide direct engineer-to-engineer technical consultation and sizing",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5 text-xs text-[#344054]">
                    <CheckCircle2 size={15} className="text-[#155EEF] shrink-0 mt-0.5" />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#E5EAF1]">
              <span className="text-xs font-mono font-bold text-[#155EEF]">
                // Focused on Practical Industrial Execution
              </span>
            </div>
          </div>

          {/* Dedicated Vision Card */}
          <div className="rounded-2xl border border-[#E5EAF1] bg-[#F8FAFC] p-8 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between">
                <div className="size-12 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-[#16A34A] flex items-center justify-center group-hover:bg-[#16A34A] group-hover:text-white transition-colors duration-200">
                  <Compass size={24} />
                </div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#16A34A] bg-white px-2.5 py-1 rounded-md border border-[#E5EAF1]">
                  FUTURE HORIZON
                </span>
              </div>

              <h3 className="mt-6 text-2xl font-bold text-[#101B2D]">Our Vision</h3>
              <p className="mt-3 text-sm sm:text-base text-[#475467] leading-relaxed">
                To serve as the global kinematic and robotic engineering foundation for
                next-generation smart factories, agile production cells, and physical AI systems,
                advancing embodied intelligence from experimental labs to industrial reality.
              </p>

              <div className="mt-6 space-y-2.5 pt-4 border-t border-[#E5EAF1]">
                {[
                  "Accelerate the convergence of physical mechanics and embodied AI",
                  "Enable zero-jitter deterministic multi-axis synchronization over open fieldbuses",
                  "Pioneer digital-twin-verified physical AI for agile factory lines",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5 text-xs text-[#344054]">
                    <CheckCircle2 size={15} className="text-[#16A34A] shrink-0 mt-0.5" />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#E5EAF1]">
              <span className="text-xs font-mono font-bold text-[#16A34A]">
                // Advancement of Intelligent Robotics &amp; Physical AI
              </span>
            </div>
          </div>
        </div>

        {/* 6 Foundational Engineering Pillars */}
        <div className="mt-16 pt-12 border-t border-[#E5EAF1]">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#155EEF]">
              ARCHITECTURAL FOUNDATIONS
            </span>
            <h3 className="mt-2 text-2xl sm:text-3xl font-bold text-[#101B2D]">
              Six Engineering Pillars
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-[#475467]">
              The core principles governing every joint, actuator, controller, and algorithm
              developed by INDUS.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ENGINEERING_PILLARS.map((pillar) => (
              <div
                key={pillar.title}
                className="p-6 rounded-2xl border border-[#E5EAF1] bg-white hover:border-[#155EEF]/50 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <span className="text-[11px] font-mono font-bold text-[#155EEF] uppercase tracking-wider">
                    {pillar.subtitle}
                  </span>
                  <h4 className="mt-2 text-base font-bold text-[#101B2D] group-hover:text-[#155EEF] transition-colors">
                    {pillar.title}
                  </h4>
                  <p className="mt-2 text-xs text-[#475467] leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
