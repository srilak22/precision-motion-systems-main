import React from "react";
import { Eye, Mic, Cpu, ArrowDown, Heart, ShieldAlert, Smartphone } from "lucide-react";

export function ElderlyArchitectureDiagram() {
  return (
    <section className="bg-white py-16 sm:py-24 border-b border-slate-200">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-mono font-bold text-[#155EEF] mb-3">
            <span>SYSTEM SCHEMATIC</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-slate-900">
            Care Architecture <span className="text-[#155EEF]">Diagram</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal">
            Privacy-first on-device AI edge processing with isolated healthcare cloud dispatching.
          </p>
        </div>

        {/* Diagram Card in Technical High-Contrast Schematic */}
        <div className="mx-auto max-w-4xl rounded-2xl border border-slate-800 bg-slate-900 p-8 sm:p-12 text-white shadow-xl">
          {/* Top Sensor Layer */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl border border-blue-500/40 bg-blue-950/40">
              <Eye size={24} className="text-sky-400 mx-auto mb-2" />
              <div className="font-bold text-white text-sm">3D Depth LiDAR</div>
              <div className="text-xs text-slate-400">Anonymous Point Cloud Fall Tracking</div>
            </div>
            <div className="p-4 rounded-xl border border-cyan-500/40 bg-cyan-950/40">
              <Mic size={24} className="text-cyan-400 mx-auto mb-2" />
              <div className="font-bold text-white text-sm">Far-Field Mic Array</div>
              <div className="text-xs text-slate-400">Offline Local Whisper ASR</div>
            </div>
            <div className="p-4 rounded-xl border border-indigo-500/40 bg-indigo-950/40">
              <Heart size={24} className="text-indigo-400 mx-auto mb-2" />
              <div className="font-bold text-white text-sm">Dispenser Encoders</div>
              <div className="text-xs text-slate-400">Pill Verification Sensors</div>
            </div>
          </div>

          <div className="my-6 flex justify-center text-[#155EEF]">
            <ArrowDown size={32} className="animate-bounce" />
          </div>

          {/* Central AI Computing Node */}
          <div className="rounded-xl border-2 border-blue-500 bg-blue-950/60 p-6 text-center shadow-lg">
            <Cpu size={32} className="text-sky-300 mx-auto mb-2" />
            <div className="font-display font-bold text-lg text-white">
              On-Device Embedded AI Inference Hub
            </div>
            <div className="text-xs text-sky-200 mt-1">
              Zero Raw Video Streaming • Real-Time Skeletal Fall Classifier • Autonomous Smooth Nav2
            </div>
          </div>

          <div className="my-6 flex justify-center text-[#155EEF]">
            <ArrowDown size={32} className="animate-bounce" />
          </div>

          {/* Execution & Output Streams */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="rounded-xl border border-red-500/40 bg-red-950/30 p-5 text-center">
              <ShieldAlert size={24} className="text-red-400 mx-auto mb-2" />
              <div className="font-bold text-white text-sm">Emergency Dispatch Gateway</div>
              <div className="text-xs text-red-200 mt-1">
                Direct 4G/5G EMS &amp; Caregiver Push Alarms
              </div>
            </div>

            <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-5 text-center">
              <Smartphone size={24} className="text-emerald-400 mx-auto mb-2" />
              <div className="font-bold text-white text-sm">Family Telehealth Portal</div>
              <div className="text-xs text-emerald-200 mt-1">
                Pill Adherence Logs • Hands-Free Two-Way Video
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
