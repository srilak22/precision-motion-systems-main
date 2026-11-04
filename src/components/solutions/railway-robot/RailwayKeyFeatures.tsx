import React from "react";
import { Scan, ShieldAlert, Cpu, BarChart3, BatteryCharging, Radio } from "lucide-react";

export function RailwayKeyFeatures() {
  const features = [
    {
      icon: Scan,
      title: "Sub-Millimeter Crack Detection",
      description: "Dual line-scan cameras detect micro-surface cracks, squats, spalling, and head checks at up to 25 km/h.",
    },
    {
      icon: ShieldAlert,
      title: "Fastener & Bolt Audit",
      description: "Deep learning models audit elastic clips, tie plates, and track bolt missing or loosened conditions automatically.",
    },
    {
      icon: Cpu,
      title: "Laser Track Gauge Profiler",
      description: "Real-time non-contact laser triangulators verify exact gauge distance (1435mm / 1676mm) and cant angles.",
    },
    {
      icon: Radio,
      title: "Real-Time Kilopost GIS Telemetry",
      description: "Immediate wireless transmission of detected flaws with centimeter-accurate RTK railway kilopost coordinates.",
    },
    {
      icon: BatteryCharging,
      title: "Autonomous 40 km Inspection Range",
      description: "Heavy-duty LiFePO4 battery pack drives motorized flanged steel wheel assemblies over 40 kilometers per charge.",
    },
    {
      icon: BarChart3,
      title: "Permanent Way GIS Integration",
      description: "Direct bi-directional sync with SAP PM, Maximo, and national railway infrastructure management databases.",
    },
  ];

  return (
    <section className="bg-slate-50 py-16 sm:py-24 border-b border-slate-200">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-mono font-bold text-[#155EEF] mb-3">
            <span>CORE CAPABILITIES</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-slate-900">
            Engineered for <span className="text-[#155EEF]">Zero-Defect Rail Safety</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal">
            Automating railway safety audits with laboratory precision at operational line speeds.
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
