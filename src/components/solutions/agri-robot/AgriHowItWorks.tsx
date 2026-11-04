import React from "react";
import { Camera, Cpu, Navigation, Droplets, CheckCircle, Database } from "lucide-react";

export function AgriHowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Multispectral Crop Scanning",
      desc: "Downward and sideways angled cameras capture 5-band spectral imagery across crop leaves in real time.",
      icon: Camera,
    },
    {
      num: "02",
      title: "Edge AI Disease Inference",
      desc: "NVIDIA Jetson computer evaluates leaf textures, identifying early rust, blight, and mold spores.",
      icon: Cpu,
    },
    {
      num: "03",
      title: "Row-Crop Autonomous Traversal",
      desc: "LiDAR and wheel odometry navigate tightly spaced crop furrows without damaging stalks or soil beds.",
      icon: Navigation,
    },
    {
      num: "04",
      title: "Soil & Nutrient Sampling",
      desc: "Electrochemical sensors measure soil moisture, electrical conductivity, and localized NPK parameters.",
      icon: Droplets,
    },
    {
      num: "05",
      title: "Prescription Spot Treatment",
      desc: "Generates geo-referenced micro-dosing spray commands for targeted nozzle micro-application.",
      icon: CheckCircle,
    },
    {
      num: "06",
      title: "Farm GIS Cloud Telemetry",
      desc: "Streams health index maps directly to farm management software and automated tractor systems.",
      icon: Database,
    },
  ];

  return (
    <section className="bg-slate-50 py-16 sm:py-24 border-b border-slate-200">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-mono font-bold text-[#155EEF] mb-3">
            <span>FIELD SCOUTING PIPELINE</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-slate-900">
            How It Works: <span className="text-[#155EEF]">6-Step Autonomous Crop Scouting</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal">
            A closed-loop agronomic workflow from spectral leaf acquisition to micro-targeted chemical dosing.
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
