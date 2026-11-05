import React from "react";
import { Compass, SlidersHorizontal, Gauge, Cpu, Layers, Users, CheckCircle2 } from "lucide-react";

interface ValueProposition {
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType<{ size?: number; className?: string }>;
}

const VALUE_PROPS: ValueProposition[] = [
  {
    title: "Engineering-Focused Solutions",
    subtitle: "Physics-Based Kinematic Sizing",
    description:
      "Every robotic manipulator and gearbox is evaluated based on actual load dynamics, motor thermal curves, and dynamic inertia matching—not generic catalog estimates.",
    icon: Compass,
  },
  {
    title: "Application-Oriented Selection",
    subtitle: "Matched to Exact Duty Cycles",
    description:
      "We select and configure strain-wave flexsplines, cycloidal pins, or planetary stages specifically to match your machine's acceleration, backlash, and torque profiles.",
    icon: SlidersHorizontal,
  },
  {
    title: "Precision Motion Technology",
    subtitle: "Sub-Arcminute Lost Motion",
    description:
      "Zero-backlash gearing geometries, sub-micron optical feedback, and high torsional stiffness eliminate dynamic overshoot in precision assembly lines.",
    icon: Gauge,
  },
  {
    title: "Integration Flexibility",
    subtitle: "Standardized Flanges & Fieldbuses",
    description:
      "Seamlessly interface with existing automation PLCs via EtherCAT CoE, PROFINET IRT, and standard ISO bolt patterns that accelerate machine integration.",
    icon: Cpu,
  },
  {
    title: "Industrial Application Knowledge",
    subtitle: "Automotive, Electronics & Logistics",
    description:
      "Decades of collective domain familiarity across automotive body shops, cleanroom electronics assembly, high-speed delta pick-and-place, and mobile AGV chassis.",
    icon: Layers,
  },
  {
    title: "Customer-Focused Engineering",
    subtitle: "Direct Mechatronics Engineering Desk",
    description:
      "Direct engineer-to-engineer communication. Work with senior mechatronics engineers for 3D CAD modeling, custom flange adaptations, and field diagnostics.",
    icon: Users,
  },
];

export function WhyIndus() {
  return (
    <section
      id="why-indus"
      className="py-20 lg:py-24 bg-[#F8FAFC] border-b border-[#E5EAF1] scroll-mt-20"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF] bg-[#EFF6FF] border border-[#D1E0FF]">
            <CheckCircle2 size={12} className="text-[#155EEF]" />
            VALUE PROPOSITION
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-[#101B2D]">
            Why Partner with INDUS
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#475467] leading-relaxed">
            We deliver the engineering certainty, mechanical precision, and collaborative technical
            support required to turn ambitious automation concepts into high-uptime production
            systems.
          </p>
        </div>

        {/* 6 Value Prop Cards Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {VALUE_PROPS.map((prop) => {
            const Icon = prop.icon;

            return (
              <div
                key={prop.title}
                className="rounded-2xl border border-[#E5EAF1] bg-white p-6 shadow-xs hover:border-[#155EEF]/50 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="size-10 rounded-xl bg-[#EFF6FF] border border-[#D1E0FF] text-[#155EEF] flex items-center justify-center group-hover:bg-[#155EEF] group-hover:text-white transition-colors duration-200">
                    <Icon size={18} />
                  </div>

                  <span className="mt-4 block text-[11px] font-mono font-semibold text-[#155EEF] uppercase tracking-wider">
                    {prop.subtitle}
                  </span>
                  <h3 className="mt-1 text-base font-bold text-[#101B2D] group-hover:text-[#155EEF] transition-colors">
                    {prop.title}
                  </h3>
                  <p className="mt-2 text-xs text-[#475467] leading-relaxed">{prop.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
