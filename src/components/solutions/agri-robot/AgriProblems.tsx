import React from "react";
import { AlertCircle, Clock, DollarSign, Sprout, Droplets, Bug } from "lucide-react";

export function AgriProblems() {
  const problems = [
    {
      icon: Bug,
      title: "Undetected Foliar Pathogens",
      impact: "Catastrophic Yield Blight",
      description:
        "Fungal leaf rust, powdery mildew, and blight spread undetected across thousands of crop acres before visible discoloration is noticed by field scouts.",
      stats: "20-40% global crop yield lost annually to late-diagnosed plant diseases.",
    },
    {
      icon: Clock,
      title: "Exhausting Manual Scouting",
      impact: "Labor Shortages & Lag Time",
      description:
        "Human agronomists walking expansive commercial fields can only inspect <2% of individual leaves, creating critical blind spots and inspection bottlenecks.",
      stats: "Manual field walks miss localized micro-infestations in 65% of large plots.",
    },
    {
      icon: Droplets,
      title: "Blanket Chemical Overuse",
      impact: "High Chemical Expense & Soil Damage",
      description:
        "Lacking precise disease location data, farmers are forced to spray entire fields with expensive chemical pesticides and fungicides, wasting money and degrading soil microbiology.",
      stats: "45% of applied chemical sprays are wasted on healthy crops.",
    },
  ];

  return (
    <section className="bg-slate-50 py-16 sm:py-20 lg:py-24 border-b border-slate-200">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-mono font-bold text-[#155EEF] mb-3">
            <AlertCircle size={14} />
            <span>AGRONOMIC DEFICITS</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-slate-900">
            Why Traditional Crop Scouting <span className="text-[#155EEF]">Falls Short</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal">
            Precision agriculture demands sub-millimeter disease detection before symptoms become visible to human scouts.
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
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
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
