import React from "react";
import { Camera, Cpu, Navigation, Activity, ArrowRight, Database } from "lucide-react";

export function RailwayHowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Line-Scan Image Capture",
      desc: "Synchronized dual line-scan cameras capture 16,000 lines/sec across running rail heads and fastenings.",
      icon: Camera,
    },
    {
      num: "02",
      title: "Ultrasonic Acoustic Testing",
      desc: "EMAT transducers pulse high-frequency acoustic waves into rail steel to detect subsurface internal fractures.",
      icon: Activity,
    },
    {
      num: "03",
      title: "AI Edge Crack Detection",
      desc: "NVIDIA Jetson AGX Orin runs YOLOv8 defect models, classifying squats, head checks, and missing bolts in real time.",
      icon: Cpu,
    },
    {
      num: "04",
      title: "Track Clearance & Obstacle Radar",
      desc: "Millimeter-wave radar detects stalled debris, cattle, or track maintenance vehicles 300m ahead.",
      icon: Navigation,
    },
    {
      num: "05",
      title: "GIS Kilopost Geotagging",
      desc: "RTK GPS logs exact chainage / kilopost coordinates with ±1.5 cm accuracy for immediate repair dispatch.",
      icon: Navigation,
    },
    {
      num: "06",
      title: "Rail Asset Cloud Sync",
      desc: "Streams inspection passes to enterprise Permanent Way GIS software and triggers maintenance work orders.",
      icon: Database,
    },
  ];

  return (
    <section className="bg-slate-50 py-16 sm:py-24 border-b border-slate-200">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-mono font-bold text-[#155EEF] mb-3">
            <span>INSPECTION PIPELINE</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-slate-900">
            How It Works: <span className="text-[#155EEF]">6-Step Track Inspection</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal">
            Continuous real-time defect isolation from high-speed line scan to automated work-order generation.
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
