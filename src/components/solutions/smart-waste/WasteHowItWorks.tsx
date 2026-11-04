import React from "react";
import { Camera, Cpu, Navigation, Sparkles, Database, CheckCircle2 } from "lucide-react";

export function WasteHowItWorks() {
  const steps = [
    {
      step: 1,
      title: "Camera Scans Area",
      description: "Wide-angle RGB and depth vision sensors scan pathways, floors, and street surfaces.",
      icon: Camera,
    },
    {
      step: 2,
      title: "AI Detects Waste",
      description: "Edge neural network running YOLO identifies waste items and distinguishes them from static obstacles.",
      icon: Cpu,
    },
    {
      step: 3,
      title: "Robot Moves to Target",
      description: "Autonomous navigation stack plans safe path around pedestrians and obstacles directly to the waste location.",
      icon: Navigation,
    },
    {
      step: 4,
      title: "Picks Up Waste",
      description: "Compliant motorized robotic gripper or vacuum mechanism retrieves the item safely from ground surface.",
      icon: Sparkles,
    },
    {
      step: 5,
      title: "Segregates Waste",
      description: "Classified waste is routed into partitioned organic, recyclable, or non-recyclable onboard bins.",
      icon: CheckCircle2,
    },
    {
      step: 6,
      title: "Updates Database",
      description: "Robot transmits real-time telemetry, location timestamps, and bin fill levels to the cloud dashboard.",
      icon: Database,
    },
  ];

  return (
    <section className="bg-slate-50 py-16 sm:py-24 border-b border-slate-200">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-mono font-bold text-[#155EEF] mb-3">
            <span>OPERATIONAL PIPELINE</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-slate-900">
            How It Works: <span className="text-[#155EEF]">6-Step Autonomous Workflow</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal">
            From initial surface scanning to sorted storage and cloud telemetry reporting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-[#155EEF] hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-2xl font-black text-[#155EEF]">0{s.step}</span>
                    <div className="size-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#155EEF]">
                      <Icon size={20} />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {s.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {s.description}
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
