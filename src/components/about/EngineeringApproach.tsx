import React from "react";
import {
  Search,
  Calculator,
  Compass,
  Workflow,
  CheckCircle,
  Headphones,
  ArrowRight,
} from "lucide-react";

interface StepItem {
  number: string;
  title: string;
  deliverable: string;
  description: string;
  icon: React.ElementType<{ size?: number; className?: string }>;
}

const STEPS: StepItem[] = [
  {
    number: "01",
    title: "Understand the Application",
    deliverable: "Operating Constraints Brief",
    description:
      "We begin by evaluating physical constraints, operating environment (temperature, washdown, cleanroom), cycle time objectives, and payload dynamics.",
    icon: Search,
  },
  {
    number: "02",
    title: "Analyse Engineering Requirements",
    deliverable: "Kinematic Sizing Calculations",
    description:
      "Our mechatronics team computes continuous and peak torque envelopes, determines optimal inertia ratios (< 5:1), and selects required gear reductions.",
    icon: Calculator,
  },
  {
    number: "03",
    title: "Design the Robotics Solution",
    deliverable: "3D CAD & Kinematic Envelope",
    description:
      "Detailed 3D CAD modeling, FEA torsional stress simulation of structural joints, end-effector interfacing, and ISO 13849-1 safety zone layout.",
    icon: Compass,
  },
  {
    number: "04",
    title: "Integrate Motion & Automation",
    deliverable: "Fieldbus Bus-Master Configuration",
    description:
      "Deterministic coupling of servo drives over EtherCAT or PROFINET IRT, cyclic synchronous position (CSP) tuning, and real-time controller commissioning.",
    icon: Workflow,
  },
  {
    number: "05",
    title: "Test and Validate",
    deliverable: "Metrology & Burn-In Certificate",
    description:
      "Coordinate Measuring Machine (CMM) dimensional verification, dynamic dynamometer torque testing, thermal soak runs, and ISO 9283 pose repeatability tests.",
    icon: CheckCircle,
  },
  {
    number: "06",
    title: "Support Implementation",
    deliverable: "Commissioning & Lifecycle Support",
    description:
      "On-site installation support, detailed wiring schematics, spare parts provisioning, and continuous direct engineer-to-engineer consultation.",
    icon: Headphones,
  },
];

export function EngineeringApproach() {
  return (
    <section
      id="approach"
      className="py-20 lg:py-24 bg-white border-b border-[#E5EAF1] scroll-mt-20"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF] bg-[#EFF6FF] border border-[#D1E0FF]">
            <Workflow size={12} className="text-[#155EEF]" />
            METHODOLOGY
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-[#101B2D]">
            Our Engineering Approach
          </h2>
          <p className="mt-3 text-base text-[#475467] leading-relaxed">
            A structured, physics-driven six-stage engineering process designed to eliminate
            integration uncertainty, optimize cycle times, and guarantee predictable mechanical
            reliability.
          </p>
        </div>

        {/* 6 Steps Grid (Connected Timeline Structure) */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="relative rounded-2xl border border-[#E5EAF1] bg-[#FFFFFF] p-6 shadow-xs hover:border-[#155EEF]/50 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar: Step Number & Icon */}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-mono font-bold text-[#D0D5DD] group-hover:text-[#155EEF] transition-colors">
                      {step.number}
                    </span>
                    <div className="size-10 rounded-xl bg-[#EFF6FF] border border-[#D1E0FF] text-[#155EEF] flex items-center justify-center group-hover:bg-[#155EEF] group-hover:text-white transition-colors duration-200">
                      <Icon size={18} />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="mt-4 text-base font-bold text-[#101B2D] group-hover:text-[#155EEF] transition-colors">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-xs text-[#475467] leading-relaxed">{step.description}</p>
                </div>

                {/* Bottom Deliverable Pill */}
                <div className="mt-5 pt-3.5 border-t border-[#F2F4F7]">
                  <span className="text-[11px] font-mono font-semibold text-[#667085] flex items-center gap-1.5">
                    <span className="text-[#155EEF] font-bold">Key Output:</span>
                    <span className="text-[#344054] truncate">{step.deliverable}</span>
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
