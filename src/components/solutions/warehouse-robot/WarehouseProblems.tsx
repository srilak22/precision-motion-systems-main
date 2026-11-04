import React from "react";
import { AlertCircle, Clock, DollarSign, PackageX } from "lucide-react";

export function WarehouseProblems() {
  const problems = [
    {
      icon: PackageX,
      title: "Phantom Inventory & Stockouts",
      impact: "Order Cancellation Crisis",
      description:
        "Misplaced pallets and manual barcode scanning errors create ghost inventory. Fulfillment centers suffer 4-8% order cancellation rates because products listed as in-stock cannot be physically located.",
      stats: "$1.8M avg. annual loss per distribution hub from ghost inventory.",
    },
    {
      icon: Clock,
      title: "Hazardous Scissor Lift Counts",
      impact: "Worker Safety & Fall Hazard",
      description:
        "Reaching 10-14 meter high racking requires cherry pickers and elevated work platforms. Forklift operators and cycle counters face OSHA fall hazards and physical fatigue during 8-hour scanning shifts.",
      stats: "3.4x higher OSHA incident rate during manual vertical stock counts.",
    },
    {
      icon: DollarSign,
      title: "Expensive Facility Shutdowns",
      impact: "Millions in Lost Throughput",
      description:
        "Traditional full-warehouse audits require halting distribution operations over entire weekends or nights, racking up substantial overtime payroll and lost dispatch revenue.",
      stats: "$45,000+ direct payroll and stalled dispatch loss per weekend audit.",
    },
  ];

  return (
    <section className="bg-slate-50 py-16 sm:py-20 lg:py-24 border-b border-slate-200">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-mono font-bold text-[#155EEF] mb-3">
            <AlertCircle size={14} />
            <span>WAREHOUSE AUDIT DEFICITS</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-slate-900">
            Why Manual Inventory Auditing <span className="text-[#155EEF]">Fails</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal">
            Modern mega-warehouses cannot maintain 99%+ accuracy using paper clipboards, cherry pickers, and periodic physical shutdowns.
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
