import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  Layers,
  Eye,
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
  const [view, setView] = useState<"specs" | "workcell">("specs");
  const { openModal } = useModals();
  const IconComponent = card.icon;

  return (
    <article className="group flex h-full flex-col justify-between rounded-2xl border border-slate-200/90 bg-white shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-[#155EEF]/50 hover:shadow-md overflow-hidden">
      {/* Top Workcell Image Strip */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100 border-b border-slate-100">
        <img
          src={card.workcellImage}
          alt={`${card.title} robotic workcell`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-white/95 px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-800 shadow-xs">
            <IconComponent size={12} className="text-[#155EEF]" />
            {card.categoryBadge}
          </span>

          {/* Clean Tab Switcher: Specs vs Workcell */}
          <div className="inline-flex rounded-lg bg-slate-900/80 p-0.5 backdrop-blur-xs border border-white/15">
            <button
              type="button"
              onClick={() => setView("specs")}
              className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-mono font-bold uppercase transition-colors cursor-pointer ${
                view === "specs"
                  ? "bg-white text-slate-900"
                  : "text-slate-200 hover:text-white"
              }`}
            >
              <Layers size={10} />
              Specs
            </button>
            <button
              type="button"
              onClick={() => setView("workcell")}
              className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-mono font-bold uppercase transition-colors cursor-pointer ${
                view === "workcell"
                  ? "bg-white text-slate-900"
                  : "text-slate-200 hover:text-white"
              }`}
            >
              <Eye size={10} />
              Workcell
            </button>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#155EEF] transition-colors tracking-tight">
            {card.title}
          </h3>

          {view === "specs" ? (
            <>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
                {card.description}
              </p>

              {/* Core Specs Grid */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="grid grid-cols-3 gap-2">
                  {card.coreSpecs.map((spec, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg bg-slate-50 border border-slate-200/80 p-2 text-center"
                    >
                      <div className="text-xs font-bold font-mono text-[#155EEF] leading-tight">
                        {spec.value}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5 leading-tight truncate">
                        {spec.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack Pills */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {card.techStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-mono bg-blue-50/80 border border-blue-200/60 text-[#155EEF] px-2 py-0.5 rounded font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="mt-3 rounded-lg bg-slate-50 border border-slate-200/80 p-3.5">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#155EEF] mb-1">
                  Operational Deployment
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {card.activeWorkcell}
                </p>
              </div>

              <div className="mt-3 rounded-lg bg-emerald-50/70 border border-emerald-200/80 p-3.5">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 mb-1 flex items-center gap-1">
                  <CheckCircle2 size={12} className="text-emerald-600" />
                  <span>Performance Impact</span>
                </div>
                <p className="text-xs font-medium text-emerald-900 leading-snug">
                  {card.operationalBenefit}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Card Footer */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() =>
              openModal("engineer", {
                initialMessage: `Inquiry for ${card.title}: Request kinematics feasibility & sizing proposal`,
              })
            }
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#155EEF] hover:text-[#1047BF] transition-colors cursor-pointer"
          >
            <span>Request Sizing</span>
            <ArrowRight size={13} />
          </button>

          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-8 px-2.5 text-xs font-semibold text-slate-600 hover:text-[#155EEF]"
          >
            <Link
              to="/industries"
              hash={card.caseStudyAnchor ? `case-study-${card.caseStudyAnchor}` : undefined}
            >
              View Details
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
