import React, { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import {
  Play,
  Github,
  FileText,
  ShieldCheck,
  Sprout,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { images } from "@/lib/images";

interface AgriHeroProps {
  onWatchDemo?: () => void;
  onProjectReport?: () => void;
  robotImage?: string;
}

export function AgriHero({
  onWatchDemo,
  onProjectReport,
  robotImage,
}: AgriHeroProps) {
  const heroImg = robotImage || images.agriRobot;
  // Clean background with subtle engineering grid

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-slate-50/50 text-slate-900 py-14 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-200 select-none">
      

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
          <span className="text-[#155EEF] font-bold">AGRICULTURAL CROP MONITORING ROBOT</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 max-w-3xl">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-mono font-bold text-[#155EEF]">
                <span className="size-2 rounded-full bg-[#155EEF] animate-pulse" />
                INTELLIGENT ROBOTICS SOLUTION 03
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-mono font-semibold text-slate-700 shadow-xs">
                <ShieldCheck size={14} className="text-[#155EEF]" />
                ISO 12100 &amp; Precision Ag Standards
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight text-slate-900 leading-[1.08]">
              Agricultural Crop <span className="text-[#155EEF]">Monitoring Robot</span>
            </h1>

            {/* Tagline */}
            <p className="mt-4 text-base sm:text-lg font-mono font-medium text-[#155EEF]">
              "An Autonomous Robot for Crop Health, Disease Detection, and Precision Agriculture."
            </p>

            {/* Description */}
            <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl font-normal">
              An AI-powered agricultural robot that monitors crop health using multispectral cameras, soil probes, and computer vision. Detects foliar fungal infections and nutrient deficiencies before visual symptoms spread.
            </p>

            {/* 3 Call-to-Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button
                onClick={onWatchDemo || (() => window.open("https://youtube.com", "_blank"))}
                className="h-12 rounded-xl bg-[#155EEF] px-6 text-xs font-bold uppercase font-mono tracking-wider text-white shadow-md hover:bg-[#1047BF] transition-all cursor-pointer flex items-center gap-2"
              >
                <Play size={15} className="fill-white" />
                <span>Watch Field Demo</span>
              </Button>

              <a
                href="https://github.com/srilak22/precision-motion-systems-main"
                target="_blank"
                rel="noopener noreferrer"
                className="h-12 rounded-xl border border-slate-300 bg-white px-5 text-xs font-bold uppercase font-mono tracking-wider text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-xs"
              >
                <Github size={15} />
                <span>View GitHub</span>
                <ExternalLink size={12} className="text-slate-400" />
              </a>

              <Button
                variant="outline"
                onClick={onProjectReport || (() => {
                  const el = document.getElementById("solution-inquiry-section");
                  el?.scrollIntoView({ behavior: "smooth" });
                })}
                className="h-12 rounded-xl border border-blue-200 bg-blue-50 px-5 text-xs font-bold uppercase font-mono tracking-wider text-[#155EEF] hover:bg-blue-100 transition-all cursor-pointer flex items-center gap-2"
              >
                <FileText size={15} />
                <span>Agritech Report</span>
              </Button>
            </div>

            {/* Quick Metrics Strip */}
            <div className="mt-10 pt-6 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <div className="text-[10px] font-mono text-slate-500 uppercase">Disease Detection</div>
                <div className="text-sm font-bold font-mono text-[#155EEF] mt-0.5">96% Accuracy</div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-slate-500 uppercase">Chemical Cut</div>
                <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">45% Chemical Reduction</div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-slate-500 uppercase">Labor Saved</div>
                <div className="text-sm font-bold font-mono text-[#155EEF] mt-0.5">60% Scouting Effort</div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-slate-500 uppercase">Coverage</div>
                <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">3.5x Faster</div>
              </div>
            </div>
          </div>

          {/* Right Column: Real True Robot Photo */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl border border-slate-200 bg-white p-3 shadow-xl group">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-100 border border-slate-200">
                <img
                  src={heroImg}
                  alt="INDUS Agricultural Crop Monitoring Robot"
                  className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute top-3 left-3 bg-white/95 border border-blue-200 rounded-md px-2.5 py-1 text-[10px] font-mono text-[#155EEF] flex items-center gap-1.5 shadow-sm">
                  <span className="size-2 rounded-full bg-[#155EEF] animate-ping" />
                  <span>FIELD PATROL ACTIVE</span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 text-white rounded-xl p-3 border border-slate-800 backdrop-blur-sm">
                  <div className="flex items-center justify-between text-[11px] font-mono text-sky-400 mb-0.5">
                    <span>INDUS AGRI-ROVER 200</span>
                    <span>MULTISPECTRAL AI</span>
                  </div>
                  <div className="text-xs text-slate-200">
                    Precision foliar disease scanning and centimeter RTK-GPS field scouting.
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
