import React from "react";
import { Eye, Cpu, Mic, Heart, Bell, PhoneCall } from "lucide-react";

export function ElderlyHowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Gentle Ambient Patrol",
      desc: "Robot maintains a discreet 3-4 meter proximity across hallways and living rooms using whisper-quiet direct-drive motors.",
      icon: Eye,
    },
    {
      num: "02",
      title: "Pose Estimation & Fall Sensing",
      desc: "Edge AI computes skeletal 3D joint angles in real time to detect sudden slips, trips, or prolonged floor inactivity.",
      icon: Cpu,
    },
    {
      num: "03",
      title: "Voice Inquiry & Verification",
      desc: "If abnormal posture is detected, robot approaches gently and asks: 'Are you alright? Do you need me to call for help?'",
      icon: Mic,
    },
    {
      num: "04",
      title: "Scheduled Medication Dispensing",
      desc: "Rotary carousel unlocks sealed blister compartments at exact prescribed hours with audio chime and reminder screen.",
      icon: Heart,
    },
    {
      num: "05",
      title: "Caregiver & Family Notification",
      desc: "Sends real-time updates to children or home nurses confirming medication intake or alerting to missed steps.",
      icon: Bell,
    },
    {
      num: "06",
      title: "Emergency 2-Way EMS Video Call",
      desc: "In confirmed fall events without response, immediately auto-dials emergency services and opens hands-free speakerphone.",
      icon: PhoneCall,
    },
  ];

  return (
    <section className="bg-slate-50 py-16 sm:py-24 border-b border-slate-200">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-mono font-bold text-[#155EEF] mb-3">
            <span>CARE PROTOCOL</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-slate-900">
            How It Works: <span className="text-[#155EEF]">6-Step Assistive Care Flowchart</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal">
            From discreet ambient assistance to instant life-saving emergency escalation.
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
