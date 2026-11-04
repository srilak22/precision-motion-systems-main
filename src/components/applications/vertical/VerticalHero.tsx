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
  heroImage?: string;
  workcellName?: string;
  metrics?: { label: string; value: string; badge?: string }[];
}

export function VerticalHero({
  title = "Automotive & EV Mobility",
  subtitle = "High-precision robotics meeting the extreme uptime and sub-millimeter tolerances of modern EV battery assembly, body-in-white welding, and high-cadence chassis integration.",
  badge = "MANUFACTURING AUTOMATION VERTICAL",
  tagline = "High-Throughput Robotic Workcells & 7th-Axis Mechatronics",
  heroImage = heroWeldingCell,
  workcellName = "7-AXIS LINEAR GANTRY WORKCELL",
  metrics = [
    { label: "Cycle Time", value: "< 42s", badge: "TAKT" },
    { label: "Precision", value: "±0.02 mm", badge: "ISO 9283" },
    { label: "Payload", value: "210 kg", badge: "RIGID" },
    { label: "Uptime", value: "99.98%", badge: "QUALITY" },
  ],
}: VerticalHeroProps) {
  const { openModal } = useModals();
  const [activeViewMode, setActiveViewMode] = useState<"perspective" | "kinematics" | "telemetry">("perspective");

  const handleWhatsApp = () => {
    window.open(
      companyConfig.getWhatsAppUrl({ type: "application", name: title }),
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <section className="relative overflow-hidden bg-white text-slate-900 border-b border-slate-200/80 pt-10 pb-16 lg:pt-14 lg:pb-20">
      {/* Subtle Precision Architectural Grid (Light Theme) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `linear-gradient(to right, #1d4ed80a 1px, transparent 1px), linear-gradient(to bottom, #1d4ed80a 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Atmospheric Soft Light Blue Radial Glow */}
      <div className="absolute -top-24 left-1/3 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-blue-50/80 via-sky-50/40 to-transparent blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-mono text-slate-500">
          <Link to="/" className="hover:text-[#1D4ED8] transition-colors">
            Home
          </Link>
          <ChevronRight size={12} className="text-slate-400" />
          <Link to="/applications" className="hover:text-[#1D4ED8] transition-colors">
            Applications
          </Link>
          <ChevronRight size={12} className="text-slate-400" />
          <span className="text-slate-900 font-semibold">{title}</span>
        </nav>

        {/* Split-Screen Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Context, Typography, CTAs, Metrics */}
          <div className="lg:col-span-7 space-y-6">
            {/* Integrated Pill Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-xs font-mono font-bold text-[#1D4ED8] tracking-wider uppercase shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#1D4ED8] animate-pulse" />
              <span>• {badge}</span>
            </div>

            {/* Title with High-Impact Gradient Accent */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
              {title.split(" ")[0]}{" "}
              <span className="bg-gradient-to-r from-[#1D4ED8] via-[#2563EB] to-[#0066FF] bg-clip-text text-transparent">
                {title.split(" ").slice(1).join(" ")}
              </span>
            </h1>

            {/* Sub-tagline */}
            <div className="text-xs sm:text-sm font-mono uppercase tracking-wider text-[#1D4ED8] font-bold">
              // {tagline}
            </div>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
              {subtitle}
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Button
                onClick={() =>
                  openModal("engineer", {
                    initialMessage: `Sizing Proposal Request: ${title} Automated Workcells`,
                  })
                }
                size="lg"
                className="bg-[#1D4ED8] hover:bg-[#1e40af] text-white font-bold text-sm px-7 h-12 rounded-xl shadow-md shadow-blue-500/20 border-0 cursor-pointer"
              >
                Request Sizing Proposal →
              </Button>

              <Link
                to="/technology/physical-ai"
                className="inline-flex items-center justify-center px-6 h-12 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#1D4ED8] border border-blue-200/80 font-bold text-xs font-mono transition-all shadow-2xs cursor-pointer"
              >
                <Sparkles size={15} className="mr-2 text-[#1D4ED8]" />
                <span>Simulate in Motion Studio</span>
              </Link>

              <button
                type="button"
                onClick={handleWhatsApp}
                className="inline-flex items-center justify-center px-4 h-12 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-mono font-bold transition-all cursor-pointer shadow-2xs"
                title="Direct WhatsApp Consultation with Application Engineer"
              >
                <MessageSquare size={15} className="mr-1.5" />
                <span>WhatsApp Desk</span>
              </button>
            </div>

            {/* Quick Metrics Bar (Integrated 4-Column Strip) */}
            <div className="pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {metrics.map((m, idx) => (
                <div
                  key={idx}
                  className="bg-[#F8FAFC] border border-slate-200/80 rounded-xl p-3 text-center shadow-2xs hover:border-blue-300 transition-colors"
                >
                  <div className="text-xs font-mono text-slate-500 font-semibold uppercase">{m.label}</div>
                  <div className="text-lg sm:text-xl font-bold font-mono text-[#1D4ED8] mt-0.5">{m.value}</div>
                </div>
              ))}
            </div>

            {/* Standards Compliance Stamp */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500 pt-1">
              <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                <ShieldCheck size={14} className="text-[#1D4ED8]" />
                <span>ISO 10218-1/2 &amp; ISO 13849-1 (PL e)</span>
              </span>
              <span className="text-slate-300">•</span>
              <span>Deterministic EtherCAT Bus</span>
              <span className="text-slate-300">•</span>
              <span>Sub-Pixel Laser Tracking</span>
            </div>
          </div>

          {/* Right Column: Hero Visual with Clean White Card Frame & Overlays */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl bg-white border border-slate-200 p-2.5 shadow-md group">
              {/* Outer Subtle Blue Glow Accent */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/50 via-transparent to-sky-50/40 rounded-3xl pointer-events-none" />

              {/* Top View Mode Control Bar */}
              <div className="relative z-20 flex items-center justify-between p-3 bg-slate-50/90 backdrop-blur-md rounded-2xl border border-slate-200/80 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-mono font-bold text-slate-800 uppercase">
                    {workcellName}
                  </span>
                </div>

                <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setActiveViewMode("perspective")}
                    className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-colors cursor-pointer ${
                      activeViewMode === "perspective"
                        ? "bg-[#1D4ED8] text-white shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    3D Render
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveViewMode("kinematics")}
                    className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-colors cursor-pointer ${
                      activeViewMode === "kinematics"
                        ? "bg-[#1D4ED8] text-white shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Kinematics
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveViewMode("telemetry")}
                    className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-colors cursor-pointer ${
                      activeViewMode === "telemetry"
                        ? "bg-[#1D4ED8] text-white shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Telemetry
                  </button>
                </div>
              </div>

              {/* Visual Display Frame */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 border border-slate-200">
                <img
                  src={heroImage}
                  alt={title}
                  className={`w-full h-full object-cover transition-all duration-700 ${
                    activeViewMode === "kinematics"
                      ? "grayscale contrast-125"
                      : activeViewMode === "telemetry"
                      ? "sepia-[0.3] contrast-110"
                      : "scale-100 group-hover:scale-105"
                  }`}
                />

                {/* Subtle Grid Watermark Overlay */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-20"
                  style={{
                    backgroundImage: `linear-gradient(to right, #ffffff20 1px, transparent 1px), linear-gradient(to bottom, #ffffff20 1px, transparent 1px)`,
                    backgroundSize: "28px 28px",
                  }}
                />

                {/* Dark Vignette Overlay for Text Legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30 pointer-events-none" />

                {/* Clean Floating Badges */}
                {/* 1. Architecture Badge */}
                <div className="absolute top-3 left-3 z-20 backdrop-blur-md bg-white/90 border border-slate-200/80 rounded-xl px-3 py-1.5 shadow-sm flex items-center gap-1.5">
                  <Activity size={13} className="text-[#1D4ED8]" />
                  <div className="text-[11px] font-mono font-bold text-slate-900">
                    Kinematics // 7-Axis Linear Gantry
                  </div>
                </div>

                {/* 2. Bus Protocol */}
                <div className="absolute top-3 right-3 z-20 backdrop-blur-md bg-white/90 border border-slate-200/80 rounded-xl px-3 py-1.5 shadow-sm flex items-center gap-1.5">
                  <Cpu size={13} className="text-[#1D4ED8]" />
                  <div className="text-[11px] font-mono font-bold text-slate-900">
                    EtherCAT Enabled
                  </div>
                </div>

                {/* 3. Bottom Status Bar */}
                <div className="absolute bottom-3 left-3 right-3 z-20 backdrop-blur-md bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2 flex items-center justify-between text-[11px] font-mono text-white">
                  <span className="text-cyan-300 font-semibold">100% 24/7 Duty Cycle</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Jitter &lt; 250 µs
                  </span>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200/80 mt-2 flex items-center justify-between text-[11px] font-mono text-slate-600">
                <span className="font-semibold text-slate-800">ISO 9283 VERIFIED</span>
                <span className="text-[#1D4ED8] font-bold">REPEATABILITY: ±0.02 mm</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
