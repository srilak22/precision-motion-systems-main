import React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronRight, ShieldCheck, Cpu, Zap, Activity, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModals } from "@/components/modals/ModalContext";

export function IndustriesHero() {
  const { openModal } = useModals();

  return (
    <section className="relative border-b border-slate-200/80 bg-white pt-12 pb-16 lg:pt-16 lg:pb-20 overflow-hidden">
      {/* Precision Blueprint Grid (Subtle Light Slate & Blue) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `linear-gradient(to right, #155eef0a 1px, transparent 1px), linear-gradient(to bottom, #155eef0a 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Atmospheric Soft Light Blue Ambient Glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-b from-blue-50/80 via-sky-50/40 to-transparent blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-slate-500 font-mono">
          <Link to="/" className="hover:text-[#155EEF] transition-colors">
            Home
          </Link>
          <ChevronRight size={12} className="text-slate-400" />
          <span className="text-slate-900 font-medium">Industries</span>
        </nav>

        {/* Top Micro-Label / Status Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-[11px] font-mono font-bold text-[#155EEF] tracking-wider uppercase mb-6 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-[#155EEF] animate-pulse" />
          <span>MISSION-CRITICAL SECTORS • INDUSTRIAL ROBOTICS • EDGE AI</span>
        </div>

        {/* Main Headline & Description Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15] mb-5">
              Autonomous Precision Engineered for{" "}
              <span className="bg-gradient-to-r from-[#155EEF] via-[#0284C7] to-[#0B47BE] bg-clip-text text-transparent">
                High-Throughput Manufacturing
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl mb-8 font-normal">
              Deploying physics-validated robotics, computer vision, and ROS2-driven automation across six core industrial
              domains. Designed to achieve zero-defect quality and maximum uptime.
            </p>

            {/* Header Actions */}
            <div className="flex flex-wrap items-center gap-4">
              <Button
                onClick={() => openModal("quote")}
                className="bg-[#155EEF] hover:bg-[#0d4ecc] text-white font-bold text-sm px-6 h-11 rounded-lg shadow-sm shadow-blue-500/20 cursor-pointer"
              >
                GET A QUOTE
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <Button
                variant="outline"
                onClick={() =>
                  openModal("engineer", {
                    initialMessage: "Inquiry from Industries Page: Engineering Feasibility Consultation",
                  })
                }
                className="bg-white hover:bg-slate-50 text-slate-800 border-slate-300 hover:border-[#155EEF] font-semibold text-sm px-6 h-11 rounded-lg cursor-pointer"
              >
                Book a Consultation
              </Button>

              <a
                href="#industry-architecture"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#155EEF] hover:text-[#0d4ecc] transition-colors ml-1 px-3 py-2 rounded hover:bg-blue-50/60"
              >
                <span>Explore Industry Architecture</span>
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          {/* Quick Technical Telemetry Strip / Highlights */}
          <div className="lg:col-span-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF] mb-4 flex items-center justify-between">
                <span>OPERATIONAL BENCHMARKS</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#155EEF] flex items-center justify-center shrink-0 font-mono font-bold">
                    01
                  </div>
                  <div>
                    <div className="text-slate-900 font-bold text-sm">6 Manufacturing Sectors</div>
                    <div className="text-slate-500 mt-0.5">Automotive, Electronics, Machinery, Logistics, Pharma, Aerospace</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-mono font-bold">
                    99%
                  </div>
                  <div>
                    <div className="text-slate-900 font-bold text-sm">99.98% Defect Accuracy</div>
                    <div className="text-slate-500 mt-0.5">Real-time edge convolutional neural vision inspection</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 font-mono font-bold">
                    ±02
                  </div>
                  <div>
                    <div className="text-slate-900 font-bold text-sm">±0.02 mm Kinematic Tolerance</div>
                    <div className="text-slate-500 mt-0.5">ISO 9283 validated positioning across 7-axis gantry robots</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
