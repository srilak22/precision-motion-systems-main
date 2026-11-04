import React from "react";
import { Eye, ShieldAlert, Heart, Mic, PhoneCall, BatteryCharging } from "lucide-react";

export function ElderlyKeyFeatures() {
  const features = [
    {
      icon: Eye,
      title: "Real-Time 3D Fall Detection",
      description: "Immediate detection of sudden ground collapses or unconscious motionless states using anonymous point clouds.",
    },
    {
      icon: Heart,
      title: "Smart Medication Dispensing",
      description: "Motorized multi-compartment carousel dispenses exact prescribed pill combinations with audio/visual reminders.",
    },
    {
      icon: Mic,
      title: "Conversational Companion AI",
      description: "Friendly voice interface answers questions, provides cognitive stimulation exercises, and checks daily wellness.",
    },
    {
      icon: PhoneCall,
      title: "One-Touch Family Video Calls",
      description: "Auto-answering video monitor allowing children and doctors to visually check in without requiring senior phone handling.",
    },
    {
      icon: ShieldAlert,
      title: "Cellular Emergency Beacon",
      description: "Built-in 4G/5G LTE automatically pages EMS, emergency contacts, and building staff upon confirmed distress.",
    },
    {
      icon: BatteryCharging,
      title: "Autonomous Safe Recharging",
      description: "Quietly navigates to compact wall charging station when battery drops to 20%, maintaining 24/7 continuous room vigilance.",
    },
  ];

  return (
    <section className="bg-slate-50 py-16 sm:py-24 border-b border-slate-200">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-mono font-bold text-[#155EEF] mb-3">
            <span>COMPREHENSIVE GUARDIANSHIP</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-slate-900">
            Key Features &amp; <span className="text-[#155EEF]">System Capabilities</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal">
            Dedicated assistive technologies providing independence for seniors and peace of mind for families.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="group rounded-2xl border border-slate-200 bg-white p-8 shadow-sm hover:-translate-y-1.5 hover:border-[#155EEF] hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
              >
                <div className="size-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#155EEF] mb-6 group-hover:bg-[#155EEF] group-hover:text-white transition-colors">
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#155EEF] transition-colors mb-3">
                  {f.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {f.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
