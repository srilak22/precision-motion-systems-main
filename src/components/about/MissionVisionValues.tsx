import React from "react";
import {
  Target,
  Compass,
  Award,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Layers,
  Users,
} from "lucide-react";

export function MissionVisionValues() {
  return (
    <section
      id="mission"
      className="py-20 lg:py-24 bg-[#F8FAFC] border-b border-[#E5EAF1] scroll-mt-20"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF] bg-[#EFF6FF] border border-[#D1E0FF]">
            <Award size={12} className="text-[#155EEF]" />
            GUIDING PRINCIPLES
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-[#101B2D]">
            Mission, Vision &amp; Core Values
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#475467] leading-relaxed">
            Our engineering ethos is founded on technical rigor, deterministic mechanical behavior,
            and dependable long-term collaboration with automated manufacturing facilities.
          </p>
        </div>

        {/* 3 Main Cards Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Our Mission */}
          <div className="rounded-2xl border border-[#E5EAF1] bg-white p-7 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
            <div>
              <div className="size-12 rounded-xl bg-[#EFF6FF] border border-[#D1E0FF] text-[#155EEF] flex items-center justify-center group-hover:bg-[#155EEF] group-hover:text-white transition-colors duration-200">
                <Target size={24} />
              </div>

              <h3 className="mt-5 text-xl font-bold text-[#101B2D]">Our Mission</h3>
              <p className="mt-3 text-sm text-[#475467] leading-relaxed">
                To engineer deterministic, high-durability robotics and precision motion subsystems
                that maximize automation uptime, repeatable precision, and operational efficiency
                for industrial manufacturers and robotic builders worldwide.
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-[#F2F4F7]">
              <span className="text-xs font-mono font-bold text-[#155EEF]">
                // Focused on Measurable Uptime
              </span>
            </div>
          </div>

          {/* Card 2: Our Vision */}
          <div className="rounded-2xl border border-[#E5EAF1] bg-white p-7 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
            <div>
              <div className="size-12 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-[#16A34A] flex items-center justify-center group-hover:bg-[#16A34A] group-hover:text-white transition-colors duration-200">
                <Compass size={24} />
              </div>

              <h3 className="mt-5 text-xl font-bold text-[#101B2D]">Our Vision</h3>
              <p className="mt-3 text-sm text-[#475467] leading-relaxed">
                To serve as the trusted kinematic and robotic engineering foundation for
                next-generation smart factories, agile production lines, and physical AI systems,
                setting the benchmark for reliability in industrial motion.
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-[#F2F4F7]">
              <span className="text-xs font-mono font-bold text-[#16A34A]">
                // Kinematics for Future Factories
              </span>
            </div>
          </div>

          {/* Card 3: Our Core Values */}
          <div className="rounded-2xl border border-[#E5EAF1] bg-white p-7 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
            <div>
              <div className="size-12 rounded-xl bg-[#EFF8FF] border border-[#B2DDFF] text-[#0284C7] flex items-center justify-center group-hover:bg-[#0284C7] group-hover:text-white transition-colors duration-200">
                <ShieldCheck size={24} />
              </div>

              <h3 className="mt-5 text-xl font-bold text-[#101B2D]">Our Core Values</h3>
              <div className="mt-3.5 space-y-2.5">
                <div className="flex items-start gap-2 text-xs text-[#344054]">
                  <span className="font-bold text-[#101B2D] shrink-0">• Precision First:</span>
                  <span>Deterministic mechanical accuracy and sub-micron repeatability.</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-[#344054]">
                  <span className="font-bold text-[#101B2D] shrink-0">
                    • Industrial Durability:
                  </span>
                  <span>Engineered and tested for 24/7 continuous multi-shift production.</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-[#344054]">
                  <span className="font-bold text-[#101B2D] shrink-0">• Open Integration:</span>
                  <span>Standardized ISO mountings and open industrial fieldbuses.</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-[#344054]">
                  <span className="font-bold text-[#101B2D] shrink-0">• Technical Integrity:</span>
                  <span>Direct engineer-to-engineer support and transparent sizing data.</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-[#F2F4F7]">
              <span className="text-xs font-mono font-bold text-[#0284C7]">
                // Engineered with First Principles
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
