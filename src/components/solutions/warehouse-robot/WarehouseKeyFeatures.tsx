import React from "react";
import { Scan, ShieldAlert, Cpu, BarChart3, BatteryCharging, Radio } from "lucide-react";

export function WarehouseKeyFeatures() {
  const features = [
    {
      icon: Scan,
      title: "Autonomous Stock Auditing",
      description: "Continuous barcode and RFID tag acquisition across deep-storage bay locations without physical contact.",
    },
    {
      icon: ShieldAlert,
      title: "Human-Safe Coexistence",
      description: "Compliant with ISO 3691-4 safety standards, stopping within milliseconds when workers or forklifts intersect.",
    },
    {
      icon: Cpu,
      title: "Multi-Tier Rack Scanning",
      description: "High-reach motorized vertical telescopic lift scanning up to level 6 racking (up to 12 meters altitude).",
    },
    {
      icon: Radio,
      title: "Real-Time WMS Sync",
      description: "Instantly reconciles counted items with Manhattan Associates, SAP EWM, Blue Yonder, and Oracle WMS.",
    },
    {
      icon: BatteryCharging,
      title: "Autonomous Wireless Docking",
      description: "Return-to-base magnetic induction docking ensures 22 hours daily operation on a 1.5-hour fast charge.",
    },
    {
      icon: BarChart3,
      title: "3D Discrepancy Heatmaps",
      description: "Automated warehouse spatial analytics visually pinpoint misplaced inventory, empty bays, and lost stock.",
    },
  ];

  return (
    <section className="bg-slate-50 py-16 sm:py-24 border-b border-slate-200">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-mono font-bold text-[#155EEF] mb-3">
            <span>CAPABILITY SUITE</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-slate-900">
            Key Features &amp; <span className="text-[#155EEF]">System Capabilities</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal">
            Engineered to automate inventory audits at scale with zero disruption to warehouse operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="group rounded-2xl border border-slate-200 bg-white p-8 shadow-sm hover:-translate-y-1.5 hover:border-[#155EEF] hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
              >
                <div className="size-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#155EEF] mb-6 group-hover:bg-[#155EEF] group-hover:text-white transition-colors">
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#155EEF] transition-colors mb-3">
                  {f.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {f.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
