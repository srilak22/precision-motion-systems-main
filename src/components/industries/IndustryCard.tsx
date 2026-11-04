import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Layers,
  Activity,
  Maximize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModals } from "@/components/modals/ModalContext";

export interface IndustryFlipCardData {
  id: string;
  title: string;
  categoryBadge: string;
  badgeColorClass: string;
  icon: React.ElementType<{ size?: number; className?: string }>;
  description: string;
  coreSpecs: { label: string; value: string }[];
  techStack: string[];
  workcellImage: string;
  activeWorkcell: string;
  operationalBenefit: string;
  motionStudioLink?: string;
  caseStudyAnchor?: string;
}

interface IndustryCardProps {
  card: IndustryFlipCardData;
}

export function IndustryCard({ card }: IndustryCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { openModal } = useModals();

  const IconComponent = card.icon;
  const flipped = isFlipped || isHovered;

  const handleCardClick = () => {
    setIsFlipped((prev) => !prev);
  };

  return (
    <div
      className="relative w-full h-[520px] [perspective:1200px] cursor-pointer group select-none"
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="region"
      aria-label={`${card.title} Industry Card. Click or hover to flip.`}
    >
      <div
        className={`relative w-full h-full duration-700 transition-transform [transform-style:preserve-3d] will-change-transform ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* =========================================================================
            FRONT FACE: Engineering Specifications
           ========================================================================= */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(0deg)] bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between p-6 sm:p-7 overflow-hidden">
          {/* Subtle Industrial Grid Watermark */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: `linear-gradient(to right, #1d4ed808 1px, transparent 1px), linear-gradient(to bottom, #1d4ed808 1px, transparent 1px)`,
              backgroundSize: "24px 24px",
            }}
          />

          <div className="relative z-10">
            {/* Top Badge & Icon */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border ${card.badgeColorClass}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                {card.categoryBadge}
              </span>

              <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1D4ED8] shrink-0">
                <IconComponent size={18} />
              </div>
            </div>

            {/* Headline */}
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 group-hover:text-[#1D4ED8] transition-colors tracking-tight mb-2">
              {card.title}
            </h3>

            {/* Summary description */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mb-5 line-clamp-2">
              {card.description}
            </p>

            {/* Core Specs / Metrics List */}
            <div className="pt-4 border-t border-slate-100 mb-5">
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center justify-between">
                <span>CORE ENGINEERING SPECS</span>
                <span className="text-[10px] text-[#1D4ED8] font-semibold">ISO 9283</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {card.coreSpecs.map((spec, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-center flex flex-col justify-center"
                  >
                    <div className="text-xs sm:text-sm font-bold font-mono text-[#1D4ED8] leading-tight">
                      {spec.value}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5 leading-tight">{spec.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack Pills */}
            <div className="pt-3 border-t border-slate-100">
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-2">
                Tech Stack Architecture:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {card.techStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-mono bg-blue-50/70 border border-blue-200/60 text-[#1D4ED8] px-2 py-0.5 rounded font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Flip Prompt at Bottom */}
          <div className="relative z-10 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono font-bold text-[#1D4ED8] group-hover:text-[#1e40af] transition-colors">
            <span className="flex items-center gap-1.5">
              <span>Hover / Tap to View Live Workcell</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </span>
            <RotateCcw size={13} className="text-slate-400 group-hover:rotate-180 transition-transform duration-500" />
          </div>
        </div>

        {/* =========================================================================
            BACK FACE: Real-World Robotic Application
           ========================================================================= */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl overflow-hidden border border-slate-800 shadow-xl flex flex-col justify-between text-white">
          {/* Background High-Definition Photography */}
          <img
            src={card.workcellImage}
            alt={`${card.title} live workcell deployment`}
            className="absolute inset-0 w-full h-full object-cover scale-105"
            loading="lazy"
          />

          {/* Dark Semi-Transparent Gradient & Blur Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/85 to-slate-950/80 backdrop-blur-[2px]" />

          {/* Back Face Header */}
          <div className="relative z-10 p-6 sm:p-7 pb-0">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ACTIVE WORKCELL DEPLOYMENT
              </span>

              {/* Flip back button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(false);
                  setIsHovered(false);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 border border-white/20 text-[11px] font-mono text-white transition-colors cursor-pointer"
                title="Flip back to engineering specifications"
              >
                <RotateCcw size={12} />
                <span>Specs</span>
              </button>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-2">
              {card.title}
            </h3>

            {/* Active Workcell Application Description */}
            <div className="rounded-xl bg-white/5 border border-white/10 p-3.5 mb-4">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-300 mb-1">
                // Operational Deployment
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                {card.activeWorkcell}
              </p>
            </div>

            {/* Key Operational Benefit Callout */}
            <div className="rounded-xl bg-[#1D4ED8]/20 border border-[#1D4ED8]/40 p-3.5">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-200 mb-1 flex items-center gap-1">
                <CheckCircle2 size={12} className="text-sky-300" />
                <span>Audited Performance Impact</span>
              </div>
              <p className="text-xs font-medium text-blue-100 leading-snug">
                {card.operationalBenefit}
              </p>
            </div>
          </div>

          {/* Action Buttons at Bottom of Back Face */}
          <div className="relative z-10 p-6 sm:p-7 pt-4 border-t border-white/15 bg-slate-950/60 flex flex-col gap-2.5">
            <Button
              asChild
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-[#1D4ED8] hover:bg-[#1e40af] text-white font-bold text-xs h-10 rounded-lg shadow-md shadow-blue-900/30 cursor-pointer border-0"
            >
              <Link to={card.motionStudioLink || "/technology/physical-ai"}>
                <Sparkles size={14} className="mr-1.5 text-sky-200" />
                <span>Simulate in Motion Studio</span>
              </Link>
            </Button>

            <div className="flex items-center justify-between text-xs font-mono">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openModal("engineer", {
                    initialMessage: `Inquiry for ${card.title}: Request kinematics feasibility & sizing proposal`,
                  });
                }}
                className="font-bold text-sky-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1 py-1"
              >
                <span>Request Sizing Proposal →</span>
              </button>

              <Link
                to="/industries"
                hash={card.caseStudyAnchor ? `case-study-${card.caseStudyAnchor}` : undefined}
                onClick={(e) => e.stopPropagation()}
                className="text-[11px] text-slate-400 hover:text-white transition-colors underline underline-offset-4"
              >
                Architecture
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
