import React from "react";
import { Cpu, Server, Radio, Scan, Wifi, Code2, Database, Shield } from "lucide-react";

export function WarehouseTechStack() {
  const hardware = [
    { name: "NVIDIA Jetson AGX Orin", detail: "275 TOPS AI edge processor for computer vision & SLAM", icon: Cpu },
    { name: "Impinj Indy R2000 RFID", detail: "Multi-channel ultra-high frequency antenna array (860-960 MHz)", icon: Radio },
    { name: "Hokuyo 3D Safety LiDAR", detail: "30m range dual-plane obstacle detection & aisle SLAM", icon: Scan },
    { name: "High-Resolution 2D Imagers", detail: "Cognex Dataman multi-symbology barcode decoders", icon: Scan },
    { name: "Telescopic Servo Mast", detail: "Dual lead-screw linear actuator with optical encoder feedback", icon: Cpu },
  ];

  const software = [
    { name: "ROS 2 Humble / Iron", detail: "Deterministic real-time middleware for robotics navigation", icon: Code2 },
    { name: "Nav2 Navigation Stack", detail: "Costmap-based path planning with dynamic obstacle detour", icon: Wifi },
    { name: "SAP & Oracle WMS API", detail: "REST & MQTT bi-directional ERP database reconciliation", icon: Database },
    { name: "YOLOv8 Inventory Vision", detail: "Deep learning pallet vacancy & shrinkwrap tag verification", icon: Shield },
    { name: "INDUS Fleet Manager", detail: "Web telemetry, multi-robot traffic control & health metrics", icon: Server },
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
            Industrial-grade components built for 24/7 round-the-clock reliability in automated distribution hubs.
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
