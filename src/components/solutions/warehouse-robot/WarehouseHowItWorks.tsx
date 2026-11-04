import React from "react";
import { Bell, Navigation, Cpu, Scan, CheckCircle, Database } from "lucide-react";

export function WarehouseHowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Schedule Trigger & Dispatch",
      desc: "WMS initiates scheduled audit mission during off-peak shifts or background cycles.",
      icon: Bell,
    },
    {
      num: "02",
      title: "LiDAR SLAM Aisle Traversal",
      desc: "Robot navigates aisle grid autonomously using natural feature 3D LiDAR without floor fiducials.",
      icon: Navigation,
    },
    {
      num: "03",
      title: "Vertical Mast Elevation",
      desc: "Telescopic mast raises dual UHF beam antennas from floor to 12m high pallet bays.",
      icon: Cpu,
    },
    {
      num: "04",
      title: "Mass RFID & Barcode Capture",
      desc: "High-speed multi-tag inventory reader captures 600+ tags/second across all rack levels.",
      icon: Scan,
    },
    {
      num: "05",
      title: "WMS Ledger Cross-Check",
      desc: "Edge processor compares live counts against ERP database in real-time.",
      icon: CheckCircle,
    },
    {
      num: "06",
      title: "Discrepancy Reporting & Heatmaps",
      desc: "Sends instant misplaced SKU notifications and 3D visual inventory maps to logistics managers.",
      icon: Database,
    },
  ];

  return (
    <section className="bg-slate-50 py-16 sm:py-24 border-b border-slate-200">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-mono font-bold text-[#155EEF] mb-3">
            <span>AUDIT PIPELINE</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-slate-900">
            How It Works: <span className="text-[#155EEF]">6-Step Cycle Count Flowchart</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal">
            A closed-loop, fail-safe auditing workflow ensuring complete zero-downtime inventory synchronization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={s.num}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-[#155EEF] hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-2xl font-black text-[#155EEF]">{s.num}</span>
                    <div className="size-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#155EEF]">
                      <Icon size={20} />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {s.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
