import React from "react";
import { Camera, Radio, Cpu, ArrowDown, Database, Server, Smartphone, Activity } from "lucide-react";

export function RailwayArchitectureDiagram() {
  return (
    <section className="bg-white py-16 sm:py-24 border-b border-slate-200">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-mono font-bold text-[#155EEF] mb-3">
            <span>SYSTEM SCHEMATIC</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-slate-900">
            Inspection System <span className="text-[#155EEF]">Architecture Diagram</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal">
            End-to-end data processing stream from trackside multi-modal sensing to centralized railway GIS dispatch.
          </p>
        </div>

        {/* Diagram Card in Technical High-Contrast Schematic */}
        <div className="mx-auto max-w-4xl rounded-2xl border border-slate-800 bg-slate-900 p-8 sm:p-12 text-white shadow-xl">
          {/* Top Sensor Layer */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl border border-blue-500/40 bg-blue-950/40">
              <Camera size={24} className="text-sky-400 mx-auto mb-2" />
              <div className="font-bold text-white text-sm">4K Line-Scan Cameras</div>
              <div className="text-xs text-slate-400">16,000 lines/sec Surface Profiling</div>
            </div>
            <div className="p-4 rounded-xl border border-cyan-500/40 bg-cyan-950/40">
              <Activity size={24} className="text-cyan-400 mx-auto mb-2" />
              <div className="font-bold text-white text-sm">EMAT Ultrasonic Transducers</div>
              <div className="text-xs text-slate-400">Sub-Surface Metallurgy Flaws</div>
            </div>
            <div className="p-4 rounded-xl border border-indigo-500/40 bg-indigo-950/40">
              <Radio size={24} className="text-indigo-400 mx-auto mb-2" />
              <div className="font-bold text-white text-sm">Dual RTK-GNSS + Kilopost IMU</div>
              <div className="text-xs text-slate-400">±1.5cm Chainage Geotagging</div>
            </div>
          </div>

          <div className="my-6 flex justify-center text-[#155EEF]">
            <ArrowDown size={32} className="animate-bounce" />
          </div>

          {/* Central AI Computing Node */}
          <div className="rounded-xl border-2 border-blue-500 bg-blue-950/60 p-6 text-center shadow-lg">
            <Cpu size={32} className="text-sky-300 mx-auto mb-2" />
            <div className="font-display font-bold text-lg text-white">
              NVIDIA Jetson AGX Orin Edge Computer
            </div>
            <div className="text-xs text-sky-200 mt-1">
              Real-Time YOLOv8 Crack &amp; Fastener Inference • EN 13848 Track Geometry Scoring • Fail-Safe Motor Interlocks
            </div>
          </div>

          <div className="my-6 flex justify-center text-[#155EEF]">
            <ArrowDown size={32} className="animate-bounce" />
          </div>

          {/* Execution & Output Streams */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-5 text-center">
              <Database size={24} className="text-emerald-400 mx-auto mb-2" />
              <div className="font-bold text-white text-sm">Permanent Way GIS Synchronizer</div>
              <div className="text-xs text-emerald-200 mt-1">
                Automated SAP PM / Maximo Work-Order Creation
              </div>
            </div>

            <div className="rounded-xl border border-amber-500/40 bg-amber-950/30 p-5 text-center">
              <Smartphone size={24} className="text-amber-400 mx-auto mb-2" />
              <div className="font-bold text-white text-sm">Trackmaster Cloud Telematics</div>
              <div className="text-xs text-amber-200 mt-1">
                Live Web Map • Urgent Transverse Fissure Push Alarms
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
