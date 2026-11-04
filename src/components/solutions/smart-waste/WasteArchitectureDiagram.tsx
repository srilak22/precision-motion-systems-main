import React from "react";
import { Camera, Cpu, ArrowDown, Bot, Database, Sparkles, HardDrive } from "lucide-react";

export function WasteArchitectureDiagram() {
  return (
    <section className="bg-white py-16 sm:py-24 border-b border-slate-200">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-mono font-bold text-[#155EEF] mb-3">
            <span>SYSTEM SCHEMATIC</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-slate-900">
            Robot System <span className="text-[#155EEF]">Architecture Diagram</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal">
            Dual-path dataflow bridging real-time low-latency motor control with cloud telemetry synchronization.
          </p>
        </div>

        {/* Diagram Card in Technical High-Contrast Schematic */}
        <div className="mx-auto max-w-4xl rounded-2xl border border-slate-800 bg-slate-900 p-8 sm:p-12 text-white shadow-xl">
          {/* Top Sensor Layer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
            <div className="p-5 rounded-xl border border-blue-500/40 bg-blue-950/40">
              <Camera size={24} className="text-sky-400 mx-auto mb-2" />
              <div className="font-bold text-white text-sm">Visual Stream: Camera Input</div>
              <div className="text-xs text-slate-400 mt-1">High-resolution frame acquisition &amp; illumination</div>
            </div>

            <div className="p-5 rounded-xl border border-cyan-500/40 bg-cyan-950/40">
              <HardDrive size={24} className="text-cyan-400 mx-auto mb-2" />
              <div className="font-bold text-white text-sm">Sensor Stream: Ultrasonic &amp; IMU</div>
              <div className="text-xs text-slate-400 mt-1">Proximity distance, heading, and battery metrics</div>
            </div>
          </div>

          <div className="my-6 flex justify-center text-[#155EEF]">
            <ArrowDown size={32} className="animate-bounce" />
          </div>

          {/* Central AI Computing Node */}
          <div className="rounded-xl border-2 border-blue-500 bg-blue-950/60 p-6 text-center shadow-lg">
            <Cpu size={32} className="text-sky-300 mx-auto mb-2" />
            <div className="font-display font-bold text-lg text-white">
              AI Processing Unit (YOLOv8 &amp; OpenCV)
            </div>
            <div className="text-xs text-sky-200 mt-1">
              Waste Detection • Bounding Coordinate Extraction • Path Planning Computation
            </div>
          </div>

          <div className="my-6 flex justify-center text-[#155EEF]">
            <ArrowDown size={32} className="animate-bounce" />
          </div>

          {/* Execution & Output Streams */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-5 text-center">
              <Bot size={24} className="text-emerald-400 mx-auto mb-2" />
              <div className="font-bold text-white text-sm">Actuator Control: Motors &amp; Gripper</div>
              <div className="text-xs text-emerald-200 mt-1">
                Motorized transit and mechanical waste collection
              </div>
            </div>

            <div className="rounded-xl border border-amber-500/40 bg-amber-950/30 p-5 text-center">
              <Database size={24} className="text-amber-400 mx-auto mb-2" />
              <div className="font-bold text-white text-sm">Cloud Telemetry: Web Dashboard</div>
              <div className="text-xs text-amber-200 mt-1">
                Live location logs, fill alerts, and fleet status
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
