import React from "react";
import { Zap, Heart, ArrowRight, Layers, Smartphone, Activity } from "lucide-react";

interface Milestone {
  icon: React.ElementType;
  phase: string;
  quarter: string;
  title: string;
  description: string;
  status: "In Development" | "Prototyped" | "Clinical Trial" | "Roadmap";
  tags: string[];
}

const ROADMAP: Milestone[] = [
  {
    icon: Activity,
    phase: "Phase 1",
    quarter: "Q1 2026",
    title: "Contactless 60GHz Radar Vitals",
    description: "Millimeter-wave radar measuring respiratory rate and resting heart rate from across the room through clothing and bedding without wearables.",
    status: "Clinical Trial",
    tags: ["60GHz Radar", "Contactless Vitals", "Zero Wearables"]
  },
  {
    icon: Heart,
    phase: "Phase 2",
    quarter: "Q2 2026",
    title: "Robotic Sit-to-Stand Mechanical Assist",
    description: "Deployable motorized ergonomic handle bars supporting seniors during transfers between bed, armchair, and standing postures.",
    status: "In Development",
    tags: ["Sit-to-Stand", "Ergonomic Grips", "Motorized Assist"]
  },
  {
    icon: Zap,
    phase: "Phase 3",
    quarter: "Q3 2026",
    title: "AI Cognitive Decline Early Detection",
    description: "Passive speech cadence and daily walking trajectory analysis detecting early micro-changes correlated with mild cognitive impairment.",
    status: "Prototyped",
    tags: ["Speech Cadence", "Gait Analysis", "Cognitive Health"]
  },
  {
    icon: Layers,
    phase: "Phase 4",
    quarter: "Q4 2026",
    title: "Multi-Resident Care Home Swarm",
    description: "Centralized server coordinating 10-20 robots across an entire retirement community, ensuring all residents receive simultaneous medication rounds.",
    status: "Roadmap",
    tags: ["Care Home Swarm", "Central Fleet", "Multi-Resident"]
  },
  {
    icon: Smartphone,
    phase: "Phase 5",
    quarter: "2027",
    title: "Direct Physician EHR Integration",
    description: "Automated telemetry feeds into Epic, Cerner, and NHS electronic health records, providing doctors with objective monthly compliance summaries.",
    status: "Roadmap",
    tags: ["Epic / Cerner EHR", "Clinical Records", "Telehealth API"]
  }
];

export function ElderlyFutureEnhancements() {
  return (
    <section className="bg-slate-50 py-16 sm:py-24 border-b border-slate-200">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-mono font-bold text-[#155EEF] mb-3">
            <span>COMPANION CARE ROADMAP</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-slate-900">
            Future Enhancements &amp; <span className="text-[#155EEF]">Technical Milestones</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal">
            Continuing our mission to make assistive robotics empathetic, non-intrusive, and accessible to every senior.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical central spine */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-blue-200" />

          <div className="space-y-8">
            {ROADMAP.map((item, idx) => {
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
                          <span className="text-xs text-slate-400">• {item.quarter}</span>
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

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {item.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] text-slate-600 border border-slate-200"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
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
            <h3 className="text-xl font-bold text-white">Interested in a Care Home Trial or Pilot Deployment?</h3>
            <p className="mt-1.5 text-sm text-slate-200 max-w-xl">
              We partner with senior living operators and municipal healthcare providers to conduct supervised pilot programs with dedicated support engineers.
            </p>
          </div>
          <a
            href="/contact?topic=elderly-assistance-robot"
            className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-[#155EEF] px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-[#1047BF] transition-all"
          >
            Schedule Care Pilot Discussion
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
