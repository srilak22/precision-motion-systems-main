import React from "react";
import { AlertCircle, Flame, Clock, DollarSign, Activity } from "lucide-react";

export function RailwayProblems() {
  const problems = [
    {
      icon: Activity,
      title: "Micro-Fractures & Rail Break Risk",
      impact: "Catastrophic Derailment Risk",
      description:
        "Rolling contact fatigue causes microscopic cracks beneath the rail head that grow undetected under cyclic axle loading until sudden transverse fractures occur.",
      stats: "73% of major derailments stem from unaddressed rail fatigue flaws.",
    },
    {
      icon: Clock,
      title: "Hazardous Manual Walking Audits",
      impact: "Extreme Human Safety Hazard",
      description:
        "Human trackmen walking live lines face extreme safety risks from fast trains, severe weather, and fatigue across remote stretches with limited sight distance.",
      stats: "Manual audits cover <5 km/day per crew and miss sub-surface micro-cracks.",
    },
    {
      icon: DollarSign,
      title: "Emergency Network Shutdowns",
      impact: "Millions in Delayed Freight & Fines",
      description:
        "Reactive discovery of railhead deformation forces emergency track closures, delaying passenger networks and freight operations with severe penalties.",
      stats: "$420,000 avg. hourly cost of unanticipated trunk-line service disruption.",
    },
  ];

  return (
    <section className="bg-slate-50 py-16 sm:py-20 lg:py-24 border-b border-slate-200">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-mono font-bold text-[#155EEF] mb-3">
            <AlertCircle size={14} />
            <span>CRITICAL INFRASTRUCTURE DEFICITS</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-slate-900">
            Why Traditional Rail Inspection <span className="text-[#155EEF]">Falls Short</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal">
            Railway authorities struggle with intermittent manual audits that leave blind spots across thousands of track kilometers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {problems.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm hover:border-[#155EEF] hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="size-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#155EEF] mb-6">
                    <Icon size={24} />
                  </div>
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF] mb-1">
                    {p.impact}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {p.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {p.description}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-mono font-medium text-slate-500">
                  {p.stats}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
