import React from "react";
import { CheckCircle2, Wrench, ShieldAlert, Cpu } from "lucide-react";
import type { Category } from "@/data/robotics";

export interface CategorySelectionGuidanceProps {
  category: Category;
}

export function CategorySelectionGuidance({ category }: CategorySelectionGuidanceProps) {
  const selectionFactors = category.selectionFactors || [
    "Continuous & peak torque / thrust ratings across the duty cycle",
    "Reflected load inertia matching (recommended < 5:1 for dynamic positioning)",
    "Feedback resolution and protocol compatibility (BiSS-C, EnDat 2.2, EtherCAT)",
    "Dynamic thermal equilibrium and ambient derating factors",
  ];

  const considerations = category.considerations || [
    "Verify dynamic thermal cycle to prevent drive derating during high acceleration reversals",
    "Ensure power bus capacitance supports dynamic regeneration energy during braking",
    "Confirm ISO mounting tolerances and output flange moment limits",
  ];

  return (
    <section className="border-t border-slate-200/80 bg-white px-4 py-12 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-8">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[.22em] text-[#155EEF]">
            Section E: Engineering Specification
          </span>
          <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-slate-900">
            Technical Selection Guidance for {category.title}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
            Specifying the appropriate robotic drivetrain and automation hardware requires a holistic evaluation
            of mechanical stiffness, duty cycle thermals, reflected inertia, and fieldbus communication latency.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Column 1: Key Selection Factors Checklist */}
          <div className="rounded-xl border border-slate-200/90 bg-slate-50/60 p-6 sm:p-8">
            <div className="flex items-center gap-2.5 border-b border-slate-200 pb-4">
              <span className="grid size-8 place-items-center rounded-lg bg-blue-50 text-[#155EEF] font-bold">
                <Wrench size={16} />
              </span>
              <div>
                <h3 className="font-display text-base font-bold uppercase text-slate-900">
                  Primary Engineering Selection Factors
                </h3>
                <span className="text-[10px] font-mono text-slate-500 uppercase">
                  Kinematic &amp; Dynamic Verification
                </span>
              </div>
            </div>

            <ul className="mt-5 space-y-3.5">
              {selectionFactors.map((factor, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2
                    size={16}
                    className="mt-0.5 shrink-0 text-[#155EEF]"
                  />
                  <span className="text-xs font-medium text-slate-800 leading-relaxed">
                    {factor}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: System Integration Considerations */}
          <div className="rounded-xl border border-slate-200/90 bg-slate-50/60 p-6 sm:p-8">
            <div className="flex items-center gap-2.5 border-b border-slate-200 pb-4">
              <span className="grid size-8 place-items-center rounded-lg bg-emerald-50 text-emerald-600 font-bold">
                <Cpu size={16} />
              </span>
              <div>
                <h3 className="font-display text-base font-bold uppercase text-slate-900">
                  System Integration Considerations
                </h3>
                <span className="text-[10px] font-mono text-slate-500 uppercase">
                  Control Bus &amp; Power Architecture
                </span>
              </div>
            </div>

            <ul className="mt-5 space-y-3.5">
              {considerations.map((consideration, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-[#155EEF]" />
                  <span className="text-xs text-slate-700 leading-relaxed">
                    {consideration}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
