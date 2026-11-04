import React from "react";
import { Cpu, Server, Radio, Scan, Wifi, Code2, Database, Shield, Heart } from "lucide-react";

export function ElderlyTechStack() {
  const hardware = [
    { name: "Raspberry Pi 5 / Coral Edge TPU", detail: "On-device private inference without cloud video streaming", icon: Cpu },
    { name: "Solid-State LiDAR & ToF Depth", detail: "Anonymous 3D point cloud generation preserving bathroom/bedroom privacy", icon: Scan },
    { name: "Smart Rotary Pill Carousel", detail: "Stepper-driven 28-day tamper-resistant medicine dispenser", icon: Heart },
    { name: "4-Microphone Beamforming Array", detail: "Far-field acoustic voice recognition with ambient noise suppression", icon: Radio },
    { name: "Dual-Band 4G/5G LTE + Wi-Fi 6", detail: "Fail-safe dual-SIM cellular modem for emergency SOS beacon transmission", icon: Wifi },
  ];

  const software = [
    { name: "MediaPipe & YOLOv8 Pose", detail: "Real-time 33-point human skeletal keypoint fall tracking", icon: Code2 },
    { name: "Local Whisper Speech Engine", detail: "Offline natural language voice processing for zero-latency commands", icon: Server },
    { name: "ROS 2 Galactic Nav2", detail: "Smooth social-compliant navigation that never startles residents", icon: Shield },
    { name: "HIPAA Compliant Care Cloud", detail: "End-to-end encrypted medical event telematics & caregiver notifications", icon: Database },
    { name: "Family Companion Mobile App", detail: "Cross-platform iOS/Android dashboard for video check-in and pill schedules", icon: Wifi },
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
            Engineered with strict privacy-by-design standards and medical-grade reliability.
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
