import React from "react";
import { Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  Calendar,
  Download,
  PhoneCall,
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
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-slate-50/50 text-slate-900 py-14 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-200 select-none">
      {/* Industrial Grid Background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20 z-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, #93C5FD 1px, transparent 1px), linear-gradient(to bottom, #93C5FD 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1440px]">
        {/* Breadcrumb Trail */}
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex items-center gap-2 text-xs font-mono font-medium tracking-wider text-slate-500"
        >
          <Link to="/" className="hover:text-[#155EEF] transition-colors">
            HOME
          </Link>
          <span className="text-slate-300">/</span>
          <Link to="/solutions" className="hover:text-[#155EEF] transition-colors">
            SOLUTIONS
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-[#155EEF] font-bold uppercase">{headline}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Messaging & CTAs */}
          <div className="lg:col-span-7 max-w-3xl">
            {/* Top Eyebrow Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-mono font-bold text-[#155EEF]">
                <span className="size-2 rounded-full bg-[#155EEF] animate-pulse" />
                <span>{badge}</span>
              </span>

              <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-mono font-semibold text-slate-700 shadow-xs">
                <ShieldCheck size={14} className="text-[#155EEF]" />
                <span>{standardsBadge}</span>
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight text-slate-900 leading-[1.08]">
              {headline}{" "}
              {headlineAccent && (
                <span className="text-[#155EEF] block mt-1 font-extrabold">
                  {headlineAccent}
                </span>
              )}
            </h1>

            {/* Supporting Copy */}
            <p className="mt-5 text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-2xl">
              {description}
            </p>

            {/* Primary Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button
                onClick={onRequestDemo}
                className="h-12 rounded-xl bg-[#155EEF] px-6 text-xs font-bold uppercase font-mono tracking-wider text-white shadow-md hover:bg-[#1047BF] transition-all cursor-pointer flex items-center gap-2"
              >
                <Calendar size={15} />
                <span>Request a Demo</span>
              </Button>

              <Button
                onClick={onDownloadBrochure}
                variant="outline"
                className="h-12 rounded-xl border border-slate-300 bg-white px-5 text-xs font-bold uppercase font-mono tracking-wider text-slate-700 hover:bg-slate-50 transition-all cursor-pointer flex items-center gap-2 shadow-xs"
              >
                <Download size={15} className="text-[#155EEF]" />
                <span>Download Brochure</span>
              </Button>

              <Button
                onClick={onContactEngineer}
                variant="ghost"
                className="h-12 rounded-xl border border-blue-200 bg-blue-50 px-5 text-xs font-bold uppercase font-mono tracking-wider text-[#155EEF] hover:bg-blue-100 transition-all cursor-pointer flex items-center gap-2"
              >
                <PhoneCall size={15} />
                <span>Contact an Engineer →</span>
              </Button>
            </div>

            {/* Fast Engineering Spec Strip */}
            <div className="mt-10 pt-6 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {keySpecs.map((spec, sIdx) => (
                <div key={sIdx} className="font-mono">
                  <span className="block text-[10px] uppercase tracking-wider text-slate-500">
                    {spec.label}
                  </span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                      {spec.value}
                    </span>
                    {spec.unit && (
                      <span className="text-xs text-[#155EEF] font-bold">
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
            <div className="relative rounded-2xl border border-slate-200 bg-white p-3 shadow-xl group">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-100 border border-slate-200">
                <img
                  src={robotImage}
                  alt={robotImageAlt}
                  className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  loading="eager"
                  fetchPriority="high"
                />

                <div className="absolute top-3 left-3 bg-white/95 border border-blue-200 rounded-md px-2.5 py-1 text-[10px] font-mono text-[#155EEF] flex items-center gap-1.5 shadow-sm">
                  <span className="size-2 rounded-full bg-[#155EEF] animate-ping" />
                  <span>{statusBadge}</span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 text-white rounded-xl p-3 border border-slate-800 backdrop-blur-sm">
                  <div className="flex items-center justify-between text-[11px] font-mono text-sky-400 mb-0.5">
                    <span>INDUS CLINICAL LOGISTICS</span>
                    <span>AUTOMATIC DISPATCH</span>
                  </div>
                  <div className="text-xs text-slate-200">
                    Autonomous inter-departmental hospital transportation platform.
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
