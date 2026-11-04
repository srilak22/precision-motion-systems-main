import React from "react";
import {
  AlertTriangle,
  Trash2,
  Ban,
  DollarSign,
} from "lucide-react";

export function WasteProblemStatement() {
  const cards = [
    {
      id: "overflowing-dustbins",
      icon: "🗑",
      lucideIcon: Trash2,
      title: "Overflowing Dustbins",
      badge: "Sanitation Hazard",
      description:
        "Public and campus bins fill up unpredictably between scheduled rounds. Overflow leads to secondary street litter, noxious odors, and pest infestations.",
      impact: "Uncontrolled litter spikes during peak event and lunch hours.",
    },
    {
      id: "littering-public",
      icon: "🚯",
      lucideIcon: Ban,
      title: "Littering in Public Areas",
      badge: "Environmental Degradation",
      description:
        "Cigarette butts, food wrappers, and plastic beverage bottles discarded across sidewalks, parks, and plazas degrade municipal hygiene and aesthetic appeal.",
      impact: "Manual ground sweeps struggle to keep expansive urban zones clean.",
    },
    {
      id: "high-manual-cost",
      icon: "💰",
      lucideIcon: DollarSign,
      title: "High Manual Collection Cost",
      badge: "Operational Expenditure",
      description:
        "Relying solely on manual labor is expensive, physically exhausting, and exposes sanitation workers to chronic ergonomics injuries and hazardous materials.",
      impact: "High recurring labor overhead with chronic worker shortages.",
    },
  ];

  return (
    <section className="bg-slate-50 py-16 sm:py-20 lg:py-24 border-b border-slate-200">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-mono font-bold text-[#155EEF] mb-3">
            <AlertTriangle size={14} />
            <span>PROBLEM STATEMENT</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-slate-900">
            Why Do We <span className="text-[#155EEF]">Need It?</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal">
            Urban areas generate massive waste daily. Manual collection is expensive, slow, and exposes workers to health risks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card) => {
            const Icon = card.lucideIcon;
            return (
              <div
                key={card.id}
                className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm hover:border-[#155EEF] hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="size-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-2xl">
                      {card.icon}
                    </div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {card.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    {card.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-mono font-medium text-slate-500">
                  {card.impact}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
