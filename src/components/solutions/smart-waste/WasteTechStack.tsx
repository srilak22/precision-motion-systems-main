import React from "react";
import { Cpu, Server, Radio, Scan, Wifi, Code2, Database, Shield } from "lucide-react";

export function WasteTechStack() {
  const hardware = [
    { name: "Arduino / ESP32 Microcontrollers", detail: "Motor drivers, sensor polling, low-level actuator control", icon: Cpu },
    { name: "Ultrasonic HC-SR04 & LiDAR Arrays", detail: "Short and long-range dynamic obstacle detection", icon: Scan },
    { name: "High-Torque Metal Gear Servo Motors", detail: "Precision articulated pickup gripper actuation", icon: Cpu },
    { name: "Wide-Angle Camera Module (OV5640 / USB 4K)", detail: "High-definition waste capture & visual stream", icon: Scan },
    { name: "NEO-6M GPS & IMU Inertial Sensors", detail: "Precise geofencing and autonomous heading coordination", icon: Radio },
  ];

  const software = [
    { name: "Python 3 Core Robotics Runtime", detail: "Central coordination and asynchronous state machine", icon: Code2 },
    { name: "OpenCV Computer Vision Library", detail: "Preprocessing, edge filtering, contour & bounding analysis", icon: Scan },
    { name: "TensorFlow / PyTorch / YOLOv8", detail: "Real-time waste detection and multi-category classification", icon: Cpu },
    { name: "Flask / FastAPI Embedded API", detail: "Local RESTful control endpoints and camera streaming", icon: Server },
    { name: "Firebase / Supabase Cloud DB", detail: "Real-time sync of patrol metrics, fill alerts, and battery status", icon: Database },
  ];

  return (
    <section className="bg-white py-16 sm:py-24 border-b border-slate-200">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-mono font-bold text-[#155EEF] mb-3">
            <span>ENGINEERING SPECIFICATION</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-slate-900">
            Hardware &amp; <span className="text-[#155EEF]">Software Stack</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal">
            Co-designed hardware and edge AI architecture for high-accuracy waste collection in public environments.
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
