import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Cpu,
  Zap,
  Activity,
  Layers,
  ChevronRight,
  MessageSquare,
  Maximize2,
  Sliders,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModals } from "@/components/modals/ModalContext";
import { companyConfig } from "@/data/config";
import heroWeldingCell from "@/assets/hero/hero-welding-cell.jpg";

interface VerticalHeroProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  tagline?: string;
}

export function VerticalHero({
  title = "Automotive & EV Mobility",
  subtitle = "High-precision robotics meeting the extreme uptime and sub-millimeter tolerances of modern EV battery assembly, body-in-white welding, and high-cadence chassis integration.",
  badge = "MANUFACTURING AUTOMATION VERTICAL",
  tagline = "High-Throughput Robotic Workcells & 7th-Axis Mechatronics",
}: VerticalHeroProps) {
  const { openModal } = useModals();
  const [activeViewMode, setActiveViewMode] = useState<"perspective" | "kinematics" | "sensor">("perspective");

  const handleWhatsApp = () => {
    window.open(
      companyConfig.getWhatsAppUrl({ type: "application", name: "Automotive & EV Mobility Robotics" }),
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <section className="relative overflow-hidden bg-[#0B0F17] text-white border-b border-slate-800/80 pt-10 pb-16 lg:pt-14 lg:pb-24">
      {/* Precision Blueprint Grid Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `linear-gradient(to right, #00F0FF15 1px, transparent 1px), linear-gradient(to bottom, #00F0FF15 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Radial Neon Atmospheric Glows */}
      <div className="absolute -top-32 left-1/4 w-[600px] h-[400px] bg-[#00F0FF]/15 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-[500px] h-[400px] bg-[#0052FF]/20 blur-[140px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-mono text-slate-400">
          <Link to="/" className="hover:text-[#00F0FF] transition-colors">
            Home
          </Link>
          <ChevronRight size={12} className="text-slate-600" />
          <Link to="/applications" className="hover:text-[#00F0FF] transition-colors">
            Applications
          </Link>
          <ChevronRight size={12} className="text-slate-600" />
          <span className="text-[#00F0FF] font-semibold">Automotive &amp; EV Mobility</span>
        </nav>

        {/* Split-Screen Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Context, Typography, CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Integrated Pill Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-xs font-mono font-bold text-[#00F0FF] tracking-wider uppercase shadow-lg shadow-[#00F0FF]/10">
              <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse" />
              <span>• {badge}</span>
            </div>

            {/* Title with Glowing Gradient Accent */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase leading-[1.1]">
              Automotive &amp; EV{" "}
              <span className="bg-gradient-to-r from-[#00F0FF] via-[#38BDF8] to-[#0052FF] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(0,240,255,0.35)]">
                Mobility
              </span>
            </h1>

            {/* Sub-tagline */}
            <div className="text-xs sm:text-sm font-mono uppercase tracking-wider text-cyan-200/80 font-semibold">
              // {tagline}
            </div>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
              {subtitle}
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              {/* Primary Glowing Button */}
              <Button
                onClick={() =>
                  openModal("engineer", {
                    initialMessage: "Automotive & EV Sizing Request: 7-Axis Linear Track & Robotic Welding Cells",
                  })
                }
                size="lg"
                className="bg-gradient-to-r from-[#00F0FF] to-[#0062FF] hover:from-[#38BDF8] hover:to-[#004cd8] text-slate-950 font-black text-sm px-7 h-12 rounded-xl shadow-lg shadow-[#00F0FF]/25 border-0 cursor-pointer"
              >
                Request Sizing Proposal
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              {/* Secondary Action: Simulate */}
              <Link
                to="/technology/physical-ai"
                className="inline-flex items-center justify-center px-6 h-12 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 font-mono text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <Sparkles size={15} className="mr-2 text-[#00F0FF]" />
                <span>Simulate in Motion Studio</span>
              </Link>

              {/* WhatsApp Action */}
              <button
                type="button"
                onClick={handleWhatsApp}
                className="inline-flex items-center justify-center px-4 h-12 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold transition-all cursor-pointer"
                title="Direct WhatsApp Consultation with Application Engineer"
              >
                <MessageSquare size={15} className="mr-1.5" />
                <span>WhatsApp Desk</span>
              </button>
            </div>

            {/* Compliance & Safety Ribbon */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-cyan-300">
                <ShieldCheck size={14} className="text-[#00F0FF]" />
                <span>ISO 10218-1/2 &amp; ISO 13849-1 (PL e)</span>
              </span>
              <span className="text-slate-600">•</span>
              <span>Deterministic EtherCAT CoE Bus</span>
              <span className="text-slate-600">•</span>
              <span>Sub-Pixel Laser Seam Tracking</span>
            </div>
          </div>

          {/* Right Column: Interactive 3D Canvas / Dynamic Image Frame */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl bg-slate-900/90 border border-cyan-500/30 p-2 shadow-2xl shadow-cyan-950/40 overflow-hidden group">
              {/* Outer Neon Edge Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-transparent to-blue-600/20 rounded-3xl pointer-events-none" />

              {/* Mode Control Bar */}
              <div className="relative z-20 flex items-center justify-between p-3 bg-slate-950/80 backdrop-blur-md rounded-2xl border border-white/10 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[11px] font-mono font-bold text-slate-200 uppercase">
                    WORKCELL // 7-AXIS LINEAR GANTRY
                  </span>
                </div>

                <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setActiveViewMode("perspective")}
                    className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-colors cursor-pointer ${
                      activeViewMode === "perspective"
                        ? "bg-[#00F0FF] text-slate-950 shadow-xs"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    3D Render
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveViewMode("kinematics")}
                    className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-colors cursor-pointer ${
                      activeViewMode === "kinematics"
                        ? "bg-[#00F0FF] text-slate-950 shadow-xs"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Kinematics
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveViewMode("sensor")}
                    className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-colors cursor-pointer ${
                      activeViewMode === "sensor"
                        ? "bg-[#00F0FF] text-slate-950 shadow-xs"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Thermal/Laser
                  </button>
                </div>
              </div>

              {/* Visual Display Container */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800/80">
                <img
                  src={heroWeldingCell}
                  alt="7-Axis Automotive Welding Robot on Linear Track"
                  className={`w-full h-full object-cover transition-all duration-700 ${
                    activeViewMode === "kinematics"
                      ? "grayscale contrast-150 invert-[0.15]"
                      : activeViewMode === "sensor"
                      ? "hue-rotate-180 saturate-200"
                      : "scale-100 group-hover:scale-105"
                  }`}
                />

                {/* Grid Overlay for Visual Frame */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-30"
                  style={{
                    backgroundImage: `linear-gradient(to right, #00F0FF20 1px, transparent 1px), linear-gradient(to bottom, #00F0FF20 1px, transparent 1px)`,
                    backgroundSize: "28px 28px",
                  }}
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40 pointer-events-none" />

                {/* Floating Tech Spec Status Pills */}
                {/* 1. Payload */}
                <div className="absolute top-4 right-4 z-20 backdrop-blur-md bg-slate-950/80 border border-[#00F0FF]/40 rounded-xl px-3 py-1.5 shadow-lg flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse" />
                  <div className="text-[11px] font-mono">
                    <span className="text-slate-400">Payload: </span>
                    <span className="text-white font-bold">210 kg</span>
                  </div>
                </div>

                {/* 2. Repeatability */}
                <div className="absolute top-16 left-4 z-20 backdrop-blur-md bg-slate-950/80 border border-white/20 rounded-xl px-3 py-1.5 shadow-lg flex items-center gap-2">
                  <Activity size={13} className="text-[#00F0FF]" />
                  <div className="text-[11px] font-mono">
                    <span className="text-slate-400">Repeatability: </span>
                    <span className="text-[#00F0FF] font-bold">±0.02 mm</span>
                  </div>
                </div>

                {/* 3. Protocol */}
                <div className="absolute bottom-12 left-4 z-20 backdrop-blur-md bg-slate-950/80 border border-blue-400/30 rounded-xl px-3 py-1.5 shadow-lg flex items-center gap-2">
                  <Cpu size={13} className="text-blue-400" />
                  <div className="text-[11px] font-mono">
                    <span className="text-slate-400">Bus: </span>
                    <span className="text-blue-300 font-bold">EtherCAT / ROS2</span>
                  </div>
                </div>

                {/* 4. Duty Cycle */}
                <div className="absolute bottom-4 right-4 z-20 backdrop-blur-md bg-emerald-950/70 border border-emerald-500/40 rounded-xl px-3 py-1.5 shadow-lg flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <div className="text-[10px] font-mono font-bold text-emerald-300 uppercase">
                    100% 24/7 Duty Cycle
                  </div>
                </div>
              </div>

              {/* Bottom Telemetry Bar */}
              <div className="p-3 bg-slate-950/90 rounded-2xl border border-white/10 mt-2 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="text-cyan-400">KINEMATICS // 7-DOF ROS2 MOVEIT2</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  JITTER &lt; 250 µs
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
