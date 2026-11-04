import React from "react";
import { Eye, ShieldAlert, Heart, Mic, CheckCircle2, ShieldCheck } from "lucide-react";
import { images } from "@/lib/images";

export function ElderlySolutionOverview() {
  const centralRobotImage = images.elderlyRobot;

  return (
    <section className="bg-white py-16 sm:py-24 border-b border-slate-200">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-mono font-bold text-[#155EEF] mb-3">
            <ShieldCheck size={14} />
            <span>COMPASSIONATE ARCHITECTURE</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-slate-900">
            Autonomous Elderly Care Assistance <span className="text-[#155EEF]">Blueprint</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal">
            A privacy-conscious companion robot designed to monitor health, dispense medications, and provide immediate fall rescue support.
          </p>
        </div>

        {/* Central Robot Visual with 4 Cardinal Subsystem Nodes */}
        <div className="relative mx-auto max-w-4xl py-10">
          {/* Center Card */}
          <div className="relative z-10 mx-auto w-72 sm:w-96 rounded-2xl border-2 border-blue-500/30 bg-white p-3 shadow-xl">
            <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-100">
              <img
                src={centralRobotImage}
                alt="INDUS CareCompanion Assistance Robot"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="mt-3 text-center">
              <div className="font-display font-bold text-slate-900 text-base">INDUS CareCompanion-50</div>
              <div className="text-xs text-[#155EEF] font-mono">Autonomous Assistive Mobile Robot</div>
            </div>
          </div>

          {/* TOP Node */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div className="flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs font-mono font-bold text-[#155EEF] shadow-md">
              <Eye size={16} />
              <span>3D Depth LiDAR Fall Sensor</span>
            </div>
            <div className="h-6 w-0.5 bg-blue-400" />
          </div>

          {/* BOTTOM Node */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div className="h-6 w-0.5 bg-blue-400" />
            <div className="flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs font-mono font-bold text-[#155EEF] shadow-md">
              <Heart size={16} />
              <span>Automated Smart Pill Dispenser</span>
            </div>
          </div>

          {/* LEFT Node */}
          <div className="absolute left-0 sm:left-4 top-1/2 -translate-y-1/2 flex items-center">
            <div className="flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs font-mono font-bold text-[#155EEF] shadow-md">
              <Mic size={16} />
              <span className="hidden sm:inline">Conversational Voice AI</span>
            </div>
            <div className="w-6 h-0.5 bg-blue-400" />
          </div>

          {/* RIGHT Node */}
          <div className="absolute right-0 sm:right-4 top-1/2 -translate-y-1/2 flex items-center">
            <div className="w-6 h-0.5 bg-blue-400" />
            <div className="flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs font-mono font-bold text-[#155EEF] shadow-md">
              <ShieldAlert size={16} />
              <span className="hidden sm:inline">24/7 Cellular SOS Link</span>
            </div>
          </div>
        </div>

        {/* 5-Point Checklist */}
        <div className="mt-16 mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-slate-50 p-8">
          <h3 className="font-display text-lg font-bold text-slate-900 mb-6 text-center">
            Core Assistive Capabilities Checklist
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "Detects Falls & Immobile Postures in <3s",
              "Dispatches Automatic SOS to Family & EMS",
              "Dispenses Timed Dosages with Voice Prompts",
              "Navigates Living Spaces via Smooth SLAM",
              "Protects Privacy: Zero Optical Video Upload",
              "Enables Hands-Free Family Video Calling",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <CheckCircle2 size={18} className="text-[#155EEF] shrink-0" />
                <span className="text-sm text-slate-700 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
