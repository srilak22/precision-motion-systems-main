import React from "react";
import { Cpu, Server, Radio, Scan, Wifi, Code2, Database, Shield } from "lucide-react";

export function AgriTechStack() {
  const hardware = [
    { name: "NVIDIA Jetson Orin Nano / Xavier NX", detail: "40 TOPS edge AI processor for real-time leaf segmentation", icon: Cpu },
    { name: "MicaSense RedEdge 5-Band Multispectral", detail: "Captures Blue, Green, Red, RedEdge, and Near-Infrared spectra", icon: Scan },
    { name: "Dual-Frequency RTK-GNSS Receiver", detail: "Sub-inch ±1.5cm autonomous field furrow navigation", icon: Radio },
    { name: "Electrochemical Multi-Depth Soil Probe", detail: "Automated penetration measurement of moisture, EC, and nitrogen", icon: Scan },
    { name: "All-Terrain 4WD Brushless Hub Drives", detail: "Independent articulated suspension for muddy and uneven soils", icon: Cpu },
  ];

  const software = [
    { name: "ROS 2 Humble / Nav2 Agritech", detail: "Row-following obstacle avoidance and furrow costmaps", icon: Code2 },
    { name: "Custom YOLOv8 Crop Disease Model", detail: "Trained on 250,000+ labeled foliar pathogen image samples", icon: Cpu },
    { name: "QGIS & ISO-XML Farm Mapping", detail: "Industry-standard prescription maps for automated sprayer tractors", icon: Database },
    { name: "OpenCV NDVI / NDRE Pipeline", detail: "Sub-second normalized vegetative index and canopy heat scoring", icon: Scan },
    { name: "AgriCloud Mobile Telemetry", detail: "Encrypted farm portal with drone-to-rover sync and yield reports", icon: Server },
  ];

  return (
    <section className="bg-white py-16 sm:py-24 border-b border-slate-200">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-mono font-bold text-[#155EEF] mb-3">
            <span>ENGINEERING SPECIFICATION</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-slate-900">
            Integrated Hardware &amp; <span className="text-[#155EEF]">Software Architecture</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal">
            Weatherproof IP67-rated field robotics built for harsh agrarian outdoor environments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Hardware Column */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
              <div className="size-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#155EEF]">
                <Cpu size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Hardware Subsystems</h3>
            </div>
            <div className="space-y-4">
              {hardware.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.name} className="flex items-start gap-4 p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                    <div className="p-2 rounded-lg bg-blue-50 text-[#155EEF] shrink-0">
                      <Icon size={18} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{item.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{item.detail}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Software Column */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
              <div className="size-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#155EEF]">
                <Code2 size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Software &amp; AI Stack</h3>
            </div>
            <div className="space-y-4">
              {software.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.name} className="flex items-start gap-4 p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                    <div className="p-2 rounded-lg bg-blue-50 text-[#155EEF] shrink-0">
                      <Icon size={18} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{item.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{item.detail}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
