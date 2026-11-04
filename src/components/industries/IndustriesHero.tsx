import React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronRight, ShieldCheck, Cpu, Zap, Activity, Award, Download, Sparkles } from "lucide-react";
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
          backgroundImage: `linear-gradient(to right, #1d4ed80a 1px, transparent 1px), linear-gradient(to bottom, #1d4ed80a 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Atmospheric Soft Light Blue Ambient Glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-b from-blue-50/80 via-sky-50/40 to-transparent blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-slate-500 font-mono">
          <Link to="/" className="hover:text-[#1D4ED8] transition-colors">
            Home
          </Link>
          <ChevronRight size={12} className="text-slate-400" />
          <span className="text-slate-900 font-medium">Industries</span>
        </nav>

        {/* Top Micro-Tagline */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-[11px] font-mono font-bold text-[#1D4ED8] tracking-wider uppercase mb-6 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-[#1D4ED8] animate-pulse" />
          <span>INDUSTRY SOLUTIONS • PHYSICS-VALIDATED AUTOMATION • ROS2 &amp; AI</span>
        </div>

        {/* Main Headline & Description Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15] mb-5">
              Autonomous Precision &amp; Robotics Engineered for{" "}
              <span className="bg-gradient-to-r from-[#1D4ED8] via-[#2563EB] to-[#0B47BE] bg-clip-text text-transparent">
                Mission-Critical Manufacturing
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl mb-8 font-normal">
              Deploy end-to-end robotic systems, computer vision, and ROS2-driven automation built for high-throughput,
              zero-defect industrial environments.
            </p>

            {/* Action Buttons: Primary, Secondary, Secondary Outlined */}
            <div className="flex flex-wrap items-center gap-3.5">
              <Button
                onClick={() =>
                  openModal("engineer", {
                    initialMessage: "Inquiry: Request Feasibility Analysis for Plant Robotics Workcell",
                  })
                }
                className="bg-[#1D4ED8] hover:bg-[#1e40af] text-white font-bold text-sm px-6 h-11 rounded-lg shadow-sm shadow-blue-500/20 cursor-pointer"
              >
                Request Feasibility Analysis
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <Link
                to="/technology/physical-ai"
                className="inline-flex items-center justify-center px-5 h-11 rounded-lg bg-blue-50 hover:bg-blue-100/80 text-[#1D4ED8] border border-blue-200 font-semibold text-sm transition-colors cursor-pointer"
              >
                <Sparkles size={15} className="mr-2 text-[#1D4ED8]" />
                <span>Launch Motion Studio</span>
              </Link>

              <Button
                variant="outline"
                onClick={() => openModal("quote")}
                className="bg-white hover:bg-slate-50 text-slate-800 border-slate-300 hover:border-[#1D4ED8] font-semibold text-sm px-5 h-11 rounded-lg cursor-pointer flex items-center gap-2"
              >
                <Download size={14} className="text-slate-600" />
                <span>Download CAD &amp; Standards</span>
              </Button>
            </div>
          </div>

          {/* Quick Technical Telemetry Strip / Highlights */}
          <div className="lg:col-span-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#1D4ED8] mb-4 flex items-center justify-between">
                <span>OPERATIONAL BENCHMARKS</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1D4ED8] flex items-center justify-center shrink-0 font-mono font-bold">
                    01
                  </div>
                  <div>
                    <div className="text-slate-900 font-bold text-sm">6 Core Industrial Domains</div>
                    <div className="text-slate-500 mt-0.5">Automotive, Semiconductor, Machining, Logistics, Pharma, Aerospace</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-mono font-bold">
                    99%
                  </div>
                  <div>
                    <div className="text-slate-900 font-bold text-sm">99.98% Defect Detection</div>
                    <div className="text-slate-500 mt-0.5">Real-time edge convolutional neural vision inspection</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 font-mono font-bold">
                    ±02
                  </div>
                  <div>
                    <div className="text-slate-900 font-bold text-sm">±0.02 mm Kinematic Precision</div>
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
