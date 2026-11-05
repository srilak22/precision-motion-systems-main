import React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Bot, ShieldCheck, Gauge, Cpu, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import roboticArmCellImg from "@/assets/robotic-arm-cell.jpg";

interface AboutHeroProps {
  onConsultEngineer: () => void;
  onWhatsApp: () => void;
}

export function AboutHero({ onConsultEngineer, onWhatsApp }: AboutHeroProps) {
  return (
    <section
      id="overview"
      className="relative overflow-hidden bg-[#0F172A] text-white border-b border-slate-800 scroll-mt-36"
    >
      {/* Background Subtle Blueprint Grid */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #94A3B8 1px, transparent 0)`,
          backgroundSize: "28px 28px",
        }}
      />

      {/* Ambient gradient highlight */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-blue-600/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        {/* Breadcrumb Bar */}
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400 mb-6">
          <Link to="/" className="text-slate-400 hover:text-[#155EEF] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#38BDF8] font-bold">About INDUS Industrial Robotics</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Eyebrow, Headlines & Narrative */}
          <div className="lg:col-span-7 space-y-6">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider text-[#38BDF8] bg-[#0284C7]/15 border border-[#38BDF8]/30">
              <span className="size-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
              <span>PURPOSE-DRIVEN ROBOTICS ENGINEERING</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08]">
              Engineering Intelligent Motion. Building the Future of Automation.
            </h1>

            {/* Supporting Headline */}
            <h2 className="text-xl sm:text-2xl font-semibold text-[#38BDF8] tracking-tight">
              From Precision Motion to Physical AI.
            </h2>

            {/* Detailed Introduction */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
              INDUS Industrial Robotics bridges foundational mechanical engineering with modern
              embodied intelligence. We design, manufacture, and integrate multi-axis robotic arms,
              zero-backlash joint reducers, autonomous mobility platforms, and deterministic motion
              controllers that enable high-uptime, zero-defect industrial manufacturing.
            </p>

            {/* Technical Metric Pillars */}
            <div className="grid grid-cols-3 gap-3 pt-2 max-w-xl">
              <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-[#38BDF8] text-xs font-bold font-mono">
                  <Gauge size={14} />
                  <span>&lt; 1 Arcmin</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Lost Motion Backlash</p>
              </div>

              <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-[#16A34A] text-xs font-bold font-mono">
                  <ShieldCheck size={14} />
                  <span>ISO 9001:2015</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Quality Architecture</p>
              </div>

              <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-[#60A5FA] text-xs font-bold font-mono">
                  <Cpu size={14} />
                  <span>EtherCAT</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Deterministic Control</p>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <a
                href="#capabilities-stack"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#155EEF] hover:bg-[#1047BF] text-white text-xs font-bold uppercase tracking-wider shadow-[0_4px_14px_rgba(21,94,239,0.35)] transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Explore Capabilities Stack</span>
                <ArrowRight size={14} />
              </a>

              <a
                href="#leadership-teams"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold uppercase tracking-wider transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Meet the Engineering Team</span>
              </a>

              <Link
                to="/book-consultation"
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-[#0284C7]/20 hover:bg-[#0284C7]/30 text-[#38BDF8] border border-[#38BDF8]/40 text-xs font-bold tracking-wide transition-colors"
              >
                <Calendar size={14} />
                <span>Book Consultation</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl border border-slate-800 bg-slate-900/80 p-2 overflow-hidden shadow-2xl">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-950">
                <img
                  src={roboticArmCellImg}
                  alt="INDUS Multi-Axis Industrial Robotics Cell"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent pointer-events-none" />

                {/* Overlaid Technical Badge */}
                <div className="absolute bottom-3 left-3 right-3 p-3 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-700/60 text-xs">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                    <span className="flex items-center gap-1.5 font-bold text-white">
                      <span className="size-2 rounded-full bg-[#16A34A] animate-ping" />
                      Industrial Robotics &amp; Physical AI
                    </span>
                    <span className="text-[#38BDF8]">Precision Sized</span>
                  </div>
                  <p className="text-[10.5px] text-slate-400 mt-1">
                    Continuous 24/7 duty cycles verified across multi-axis kinematic envelopes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
