import React from "react";
import { Scan, ShieldAlert, Cpu, BarChart3, BatteryCharging, Radio } from "lucide-react";

export function AgriKeyFeatures() {
  const features = [
    {
      icon: Scan,
      title: "Multispectral Plant Diagnosis",
      description: "Detects early fungal spores, powdery mildew, and nitrogen chlorosis using 5-band optical spectroscopy.",
    },
    {
      icon: ShieldAlert,
      title: "Autonomous Furrow Navigation",
      description: "Navigates tightly spaced crop rows using RTK-GPS and LiDAR without damaging root systems or crop foliage.",
    },
    {
      icon: Cpu,
      title: "Real-Time Weed Mapping",
      description: "Identifies invasive weeds down to the seedling stage, distinguishing crops from unwanted vegetation.",
    },
    {
      icon: Radio,
      title: "Prescription Map Generation",
      description: "Exports ISO-XML and Shapefiles for tractor sprayers, reducing pesticide application by up to 45%.",
    },
    {
      icon: BatteryCharging,
      title: "Solar-Assisted Field Endurance",
      description: "Integrated rooftop solar charging enables 10+ hours continuous daily scouting across commercial acreages.",
    },
    {
      icon: BarChart3,
      title: "Farm GIS Telemetry",
      description: "Syncs directly with John Deere Operations Center, Climate FieldView, and custom farm ERP platforms.",
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
            Key Features &amp; <span className="text-[#155EEF]">System Capabilities</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal">
            Precision autonomous monitoring designed for high-value specialty crops, vineyards, and grain fields.
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
