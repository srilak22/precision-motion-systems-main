import React from "react";
import { Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  Activity,
  ArrowRight,
  Download,
  PhoneCall,
  Calendar,
  Sparkles,
  Zap,
  CheckCircle2,
  Scan,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface SolutionHeroProps {
  badge: string;
  standardsBadge?: string;
  headline: string;
  headlineAccent?: string;
  description: string;
  robotImage: string;
  robotImageAlt: string;
  onRequestDemo: () => void;
  onDownloadBrochure: () => void;
  onContactEngineer: () => void;
  keySpecs: { label: string; value: string; unit?: string }[];
  statusBadge?: string;
}

export function SolutionHero({
  badge,
  standardsBadge = "ISO 9001 · CE Compliant Design",
  headline,
  headlineAccent,
  description,
  robotImage,
  robotImageAlt,
  onRequestDemo,
  onDownloadBrochure,
  onContactEngineer,
  keySpecs,
  statusBadge = "Autonomous Operational State: Ready",
}: SolutionHeroProps) {
  return (
    <section className="relative border-b border-slate-200/90 bg-gradient-to-b from-[#0B1528] via-[#070E1B] to-[#040812] text-white px-4 py-12 sm:py-20 lg:px-8 overflow-hidden select-none">
      {/* Industrial Grid Background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            "linear-gradient(to right, #16C7E8 1px, transparent 1px), linear-gradient(to bottom, #16C7E8 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Subtle Radial Glow */}
      <div className="pointer-events-none absolute -top-40 right-1/4 w-[600px] h-[600px] bg-[#155EEF]/15 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 left-10 w-[500px] h-[500px] bg-[#16C7E8]/10 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-[1440px]">
        {/* Breadcrumb Trail */}
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex items-center gap-2 text-xs font-mono font-medium tracking-wider text-slate-400"
        >
          <Link to="/" className="hover:text-[#16C7E8] transition-colors">
            HOME
          </Link>
          <span className="text-slate-600">/</span>
          <Link to="/solutions" className="hover:text-[#16C7E8] transition-colors">
            SOLUTIONS
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-[#16C7E8] font-bold">SMART WASTE COLLECTION ROBOT</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Messaging & CTAs */}
          <div className="lg:col-span-7 max-w-3xl">
            {/* Top Eyebrow Badges */}
            <div className="flex flex-wrap items-center gap-2.5 mb-5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#16C7E8]/40 bg-[#16C7E8]/10 px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-[#16C7E8]">
                <span className="size-1.5 rounded-full bg-[#16C7E8] animate-pulse" />
                <span>{badge}</span>
              </span>

              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10.5px] font-mono text-slate-300">
                <ShieldCheck size={12} className="text-[#155EEF]" />
                <span>{standardsBadge}</span>
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-[1.04]">
              {headline}{" "}
              {headlineAccent && (
                <span className="bg-gradient-to-r from-[#16C7E8] via-[#38BDF8] to-[#155EEF] bg-clip-text text-transparent block mt-1">
                  {headlineAccent}
                </span>
              )}
            </h1>

            {/* Supporting Copy */}
            <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-2xl">
              {description}
            </p>

            {/* Primary Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
              <Button
                onClick={onRequestDemo}
                size="lg"
                className="h-12 px-7 rounded-lg bg-[#155EEF] hover:bg-[#1047BF] text-white font-bold uppercase text-xs tracking-wider shadow-[0_4px_18px_rgba(21,94,239,0.35)] hover:shadow-[0_6px_24px_rgba(21,94,239,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border-0"
              >
                <Calendar size={15} className="mr-2" />
                Request a Demo
              </Button>

              <Button
                onClick={onDownloadBrochure}
                variant="outline"
                size="lg"
                className="h-12 px-6 rounded-lg border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold uppercase text-xs tracking-wider transition-all hover:border-[#16C7E8] cursor-pointer"
              >
                <Download size={15} className="mr-2 text-[#16C7E8]" />
                Download Brochure
              </Button>

              <Button
                onClick={onContactEngineer}
                variant="ghost"
                size="lg"
                className="h-12 px-5 text-slate-300 hover:text-white hover:bg-white/5 font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                <PhoneCall size={14} className="mr-2 text-[#16C7E8]" />
                Contact an Engineer →
              </Button>
            </div>

            {/* Fast Engineering Spec Strip */}
            <div className="mt-10 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {keySpecs.map((spec, sIdx) => (
                <div key={sIdx} className="font-mono">
                  <span className="block text-[10px] uppercase tracking-wider text-slate-400">
                    {spec.label}
                  </span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      {spec.value}
                    </span>
                    {spec.unit && (
                      <span className="text-xs text-[#16C7E8] font-bold">
                        {spec.unit}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl border border-white/15 bg-slate-900/80 p-3 shadow-2xl backdrop-blur-md overflow-hidden group">
              {/* Outer Glow Halo */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#16C7E8]/10 via-transparent to-[#155EEF]/10 opacity-70" />

              {/* Main Image Container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-950 border border-white/10">
                <img
                  src={robotImage}
                  alt={robotImageAlt}
                  className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  loading="eager"
                  fetchPriority="high"
                />

                {/* Dark Vignette Overlay for HUD contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                {/* Top Telemetry Header */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[10.5px] font-mono bg-slate-950/80 border border-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-[#16C7E8] animate-ping" />
                    <span className="font-bold text-white">VISION SCAN ACTIVE</span>
                  </div>
                  <span className="text-[#16C7E8]">AI CONFIDENCE: 98.4%</span>
                </div>

                {/* Bottom Visual Card HUD Data */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="inline-flex items-center gap-1.5 rounded bg-[#16C7E8]/20 px-2 py-0.5 text-[10px] font-mono font-bold text-[#16C7E8] border border-[#16C7E8]/30 mb-2">
                    <Scan size={11} />
                    <span>OBJECT DETECTION &amp; RETRIEVAL SUBSYSTEM</span>
                  </div>

                  <h3 className="text-sm font-bold text-white tracking-wide">
                    INDUS Autonomous Waste Harvester Architecture
                  </h3>

                  <p className="text-xs text-slate-300 mt-1 leading-snug line-clamp-2">
                    Combines 360° LiDAR, stereo depth vision, and a multi-axis articulated scoop mechanism for zero-operator municipal litter collection.
                  </p>
                </div>
              </div>

              {/* Status Bar */}
              <div className="mt-3 flex items-center justify-between px-2 text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-[#16C7E8]" />
                  <span>{statusBadge}</span>
                </span>
                <span className="text-[#38BDF8]">IP65 WEATHERPROOF</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
