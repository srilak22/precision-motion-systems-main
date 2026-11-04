import React from "react";
import { AlertCircle, Clock, HeartHandshake, ShieldAlert, Heart } from "lucide-react";

export function ElderlyProblems() {
  const problems = [
    {
      icon: ShieldAlert,
      title: "Undetected Domestic Falls",
      impact: "Critical Emergency Window",
      description:
        "Falls are the leading cause of fatal injury among seniors. Over 68% of elderly persons living alone remain on the floor for more than an hour after falling before help arrives, multiplying mortality risks.",
      stats: "68% of seniors living alone experience long-lie times >1 hour.",
    },
    {
      icon: Heart,
      title: "Medication Non-Adherence",
      impact: "Preventable Complications",
      description:
        "Managing complex polypharmacy schedules leads to missed dosages or accidental double-dosing, causing 125,000 preventable hospital admissions and clinical relapses annually.",
      stats: "Adherence drops below 50% without persistent active reminders.",
    },
    {
      icon: HeartHandshake,
      title: "Severe Caregiver Shortages",
      impact: "Staff Burnout & Inadequate Care",
      description:
        "By 2030, assisted living facilities face a global deficit of 15 million geriatric healthcare workers, resulting in caregiver burnout and inadequate round-the-clock individual supervision.",
      stats: "15 Million caregiver shortage projected across global health systems by 2030.",
    },
  ];

  return (
    <section className="bg-slate-50 py-16 sm:py-20 lg:py-24 border-b border-slate-200">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-mono font-bold text-[#155EEF] mb-3">
            <AlertCircle size={14} />
            <span>GERIATRIC CARE DEFICITS</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-slate-900">
            Why Traditional Senior Care <span className="text-[#155EEF]">Needs Robotics</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal">
            Elderly individuals desire independence at home, but memory lapses and fall risks place overwhelming worry on families.
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
