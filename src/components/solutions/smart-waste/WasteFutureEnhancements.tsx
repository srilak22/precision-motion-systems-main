import React from "react";
import {
  Sun,
  Trash2,
  Cpu,
  Users,
  Smartphone,
  ArrowRight,
} from "lucide-react";

export function WasteFutureEnhancements() {
  const enhancements = [
    {
      phase: "Phase 1",
      icon: Sun,
      title: "Solar Charging",
      timeline: "Q1 2026",
      status: "In Development",
      description:
        "Rooftop photovoltaic solar canopy integration for continuous daytime energy replenishment in parks and plazas.",
    },
    {
      phase: "Phase 2",
      icon: Trash2,
      title: "Smart Bin Integration",
      timeline: "Q2 2026",
      status: "Prototyped",
      description:
        "Autonomous docking and auto-emptying protocol with municipal smart compactors via ultrasonic level triggers.",
    },
    {
      phase: "Phase 3",
      icon: Cpu,
      title: "AI Route Optimization",
      timeline: "Q3 2026",
      status: "In Research",
      description:
        "Predictive routing algorithms using historical litter pattern heatmaps to prioritize heavy foot-traffic areas.",
    },
    {
      phase: "Phase 4",
      icon: Users,
      title: "Multi-Robot Collaboration",
      timeline: "Q4 2026",
      status: "Planned",
      description:
        "Coordinated swarm dispatch allocating partitioned zones across corporate campuses and smart cities.",
    },
    {
      phase: "Phase 5",
      icon: Smartphone,
      title: "IoT Monitoring Mobile App",
      timeline: "2027",
      status: "Roadmap",
      description:
        "Native Android/iOS application for ground facility teams with live push alerts, battery indicators, and map tracking.",
    },
  ];

  return (
    <section className="bg-slate-50 py-16 sm:py-24 border-b border-slate-200">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-mono font-bold text-[#155EEF] mb-3">
            <span>TECHNICAL ROADMAP</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-slate-900">
            Future Enhancements &amp; <span className="text-[#155EEF]">Roadmap</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal">
            Advancing autonomous sanitation with renewable energy, swarm intelligence, and municipal integration.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical central spine */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-blue-200" />

          <div className="space-y-8">
            {enhancements.map((item, idx) => {
              const Icon = item.icon;
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={item.title}
                  className={`relative flex flex-col lg:flex-row items-center gap-8 ${
                    isEven ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  <div className="w-full lg:w-1/2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-[#155EEF] hover:shadow-md transition-all">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#155EEF]">{item.phase}</span>
                          <span className="text-xs text-slate-400">• {item.timeline}</span>
                        </div>
                        <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-[#155EEF]">
                          {item.status}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Center Node Icon */}
                  <div className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-[#155EEF] bg-white text-[#155EEF] shadow-sm">
                    <Icon size={20} />
                  </div>

                  <div className="hidden lg:block lg:w-1/2" />
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA banner card */}
        <div className="mt-16 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-8 sm:p-10 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
          <div>
            <h3 className="text-xl font-bold text-white">Interested in Pilot Testing on Your Campus or Facility?</h3>
            <p className="mt-1.5 text-sm text-slate-200 max-w-xl">
              We deploy pilot trial units for smart cities, educational campuses, industrial sites, and commercial spaces.
            </p>
          </div>
          <a
            href="/contact?topic=smart-waste-collection-robot"
            className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-[#155EEF] px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-[#1047BF] transition-all"
          >
            Schedule Pilot
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
