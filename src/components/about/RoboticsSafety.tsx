import React from "react";
import {
  ShieldCheck,
  AlertTriangle,
  Cpu,
  Gauge,
  Lock,
  Activity,
  CheckCircle,
  LifeBuoy,
} from "lucide-react";
import { SAFETY_CONSIDERATIONS } from "@/data/aboutPageData";

const ICONS = [ShieldCheck, Gauge, Lock, AlertTriangle, Activity, LifeBuoy, CheckCircle, Cpu];

export function RoboticsSafety() {
  return (
    <section
      id="safety"
      className="py-20 lg:py-24 bg-[#0F172A] text-white border-b border-slate-800 scroll-mt-36"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold text-[#38BDF8] bg-[#0284C7]/20 border border-[#38BDF8]/30">
            <ShieldCheck size={13} className="text-[#38BDF8]" />
            DETERMINISTIC DEFENSE &amp; RELIABILITY
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Robotics Safety &amp; Reliability Architecture
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Treating safety, fault containment, and hardware longevity as foundational engineering
            disciplines. Our robotics architectures prioritize sub-millisecond trip latency,
            fail-safe holding brakes, and continuous dynamic health telemetry.
          </p>
        </div>

        {/* 8 Critical Safety Focus Areas Grid (4x2 on desktop) */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {SAFETY_CONSIDERATIONS.map((item, idx) => {
            const Icon = ICONS[idx % ICONS.length];

            return (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 hover:border-[#38BDF8]/50 hover:bg-slate-900 transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="size-10 rounded-xl bg-slate-800 text-[#38BDF8] flex items-center justify-center group-hover:bg-[#155EEF] group-hover:text-white transition-colors duration-200">
                      <Icon size={18} />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 font-semibold px-2 py-0.5 rounded bg-slate-800/80">
                      {item.focus}
                    </span>
                  </div>

                  <h3 className="mt-4 text-base font-bold text-white group-hover:text-[#38BDF8] transition-colors">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">{item.description}</p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-slate-800/80">
                  <span className="text-[10.5px] font-mono text-[#38BDF8] font-medium flex items-center gap-1.5">
                    <span className="size-1 rounded-full bg-[#16A34A]" />
                    Design Consideration
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
