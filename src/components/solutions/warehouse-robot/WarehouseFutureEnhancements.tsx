import React from "react";
import { Zap, Bot, ArrowRight, Layers, Smartphone, Cpu } from "lucide-react";

interface Milestone {
  icon: React.ElementType;
  phase: string;
  quarter: string;
  title: string;
  description: string;
  status: "In Development" | "Prototyped" | "Pilot Ready" | "Roadmap";
  tags: string[];
}

const ROADMAP: Milestone[] = [
  {
    icon: Zap,
    phase: "Phase 1",
    quarter: "Q1 2026",
    title: "Continuous Inductive Fast-Charging",
    description: "In-aisle floor induction pads charging the robot while paused for 10-second scans, enabling 100% duty cycle 24/7 continuous operation.",
    status: "Pilot Ready",
    tags: ["Inductive Pads", "Zero Downtime", "100% Duty Cycle"]
  },
  {
    icon: Bot,
    phase: "Phase 2",
    quarter: "Q2 2026",
    title: "Forklift V2X Cooperative Telematics",
    description: "Ultra-wideband (UWB) vehicle-to-everything communication automatically signaling human forklift operators around blind corners and intersections.",
    status: "In Development",
    tags: ["UWB V2X", "Forklift Safety", "Blind Corner Alert"]
  },
  {
    icon: Cpu,
    phase: "Phase 3",
    quarter: "Q3 2026",
    title: "AI Pallet Occupancy Volumetrics",
    description: "Stereo 3D depth cameras estimating percentage fill volume on partially loaded pallets, identifying underutilized storage cubic space.",
    status: "Prototyped",
    tags: ["Cubic Utilization", "Stereo 3D Depth", "Pallet Volumetrics"]
  },
  {
    icon: Layers,
    phase: "Phase 4",
    quarter: "Q4 2026",
    title: "Multi-Robot Warehouse Swarm Fleet",
    description: "Central dynamic load-balancing distributing 1,000,000 sq.ft. mega-facilities across 8 coordinated AMRs with automated corridor deconfliction.",
    status: "Roadmap",
    tags: ["Swarm Logistics", "Deconfliction", "Fleet Coordination"]
  },
  {
    icon: Smartphone,
    phase: "Phase 5",
    quarter: "2027",
    title: "Augmented Reality Mobile Picker App",
    description: "Direct handheld AR tablet application guiding human order pickers directly to misplaced items identified by the robot with illuminated 3D wayfinding.",
    status: "Roadmap",
    tags: ["Augmented Reality", "Handheld Guidance", "Lost Item Locator"]
  }
];

export function WarehouseFutureEnhancements() {
  return (
    <section className="bg-slate-50 py-16 sm:py-24 border-b border-slate-200">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-mono font-bold text-[#155EEF] mb-3">
            <span>LOGISTICS ROADMAP</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-slate-900">
            Future Enhancements &amp; <span className="text-[#155EEF]">Technical Milestones</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal">
            Pushing the boundaries of intralogistics with collaborative swarms, inductive charging, and spatial intelligence.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical central spine */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-blue-200" />

          <div className="space-y-8">
            {ROADMAP.map((item, idx) => {
              const Icon = item.icon;
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={item.title}
                  className={`relative flex flex-col lg:flex-row items-center gap-8 ${
                    isEven ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  <div className="w-full lg:w-1/2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-[#155EEF] hover:shadow-md transition-all">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#155EEF]">{item.phase}</span>
                          <span className="text-xs text-slate-400">• {item.quarter}</span>
                        </div>
                        <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-[#155EEF]">
                          {item.status}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">
                        {item.description}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {item.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] text-slate-600 border border-slate-200"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Center Node Icon */}
                  <div className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-[#155EEF] bg-white text-[#155EEF] shadow-sm">
                    <Icon size={20} />
                  </div>

                  <div className="hidden lg:block lg:w-1/2" />
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA banner card */}
        <div className="mt-16 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-8 sm:p-10 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
          <div>
            <h3 className="text-xl font-bold text-white">Need Custom Rack Integration or Cold-Storage Compliance?</h3>
            <p className="mt-1.5 text-sm text-slate-200 max-w-xl">
              INDUS intralogistics engineers configure AMR chassis for sub-zero (-25°C) environments and very-narrow-aisle (VNA) racking standards.
            </p>
          </div>
          <a
            href="/contact?topic=warehouse-inventory-robot"
            className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-[#155EEF] px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-[#1047BF] transition-all"
          >
            Consult Logistics Specialist
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
