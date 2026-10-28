import React, { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Layers,
  MessageSquare,
  Wrench,
  Search,
  ChevronRight,
  CheckCircle2,
  ShieldCheck,
  Bot,
  Activity,
  Factory,
  Boxes,
  Compass,
  Cpu,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { solutionsData, type SolutionItem } from "@/data/solutions";
import { companyConfig } from "@/data/config";
import { useModals } from "@/components/modals/ModalContext";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/solutions/")({
  head: () =>
    buildSeoMeta({
      title: "Turn-Key Industrial Automation Solutions | INDUS Robotics",
      description:
        "Discover 7 turnkey industrial solutions: factory automation, robotic cells, motion control synchronization, mobile robotics, smart manufacturing, material handling, and custom robotics.",
      path: "/solutions",
    }),
  component: SolutionsIndexPage,
});

const SOLUTION_ICONS: Record<string, React.ElementType<{ size?: number; className?: string }>> = {
  "factory-automation": Factory,
  "robotic-automation": Bot,
  "motion-control": Activity,
  "mobile-robotics": Compass,
  "smart-manufacturing": Cpu,
  "material-handling": Boxes,
  "custom-robotics": Target,
};

export function SolutionsIndexPage() {
  const { openModal } = useModals();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSolutions = useMemo(() => {
    if (!searchQuery.trim()) return solutionsData;
    const q = searchQuery.toLowerCase().trim();
    return solutionsData.filter(
      (sol) =>
        sol.title.toLowerCase().includes(q) ||
        sol.heroSubtitle.toLowerCase().includes(q) ||
        sol.shortDescription.toLowerCase().includes(q) ||
        sol.technologiesUsed.some((t) => t.toLowerCase().includes(q)) ||
        sol.typicalApplications.some((a) => a.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const handleWhatsApp = () => {
    window.open(companyConfig.getWhatsAppUrl({ type: "general" }), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 1. HERO SECTION */}
      <section className="relative border-b border-slate-200/90 bg-gradient-to-b from-slate-50 via-white to-slate-50/50 px-4 py-10 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          {/* Breadcrumb Navigation */}
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500"
          >
            <Link to="/" className="hover:text-[#155EEF] transition-colors">
              Home
            </Link>
            <ChevronRight size={13} className="text-slate-300" />
            <span className="text-[#155EEF] font-bold">Solutions</span>
          </nav>

          <div className="max-w-4xl">
            {/* Standard Badge */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-blue-200 bg-blue-50/80 px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF]">
                <ShieldCheck size={13} />
                <span>Turn-Key Systems &amp; Engineering</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-100/80 px-2 py-1 text-[10px] font-mono font-semibold uppercase text-slate-600">
                <Layers size={12} className="text-slate-500" />
                <span>7 Core Industrial Architecture Packages</span>
              </span>
            </div>

            {/* Main Title */}
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-slate-900 leading-tight">
              Industrial Automation Solutions
            </h1>

            {/* Subtitle */}
            <p className="mt-3 font-display text-lg sm:text-xl uppercase tracking-wide text-[#155EEF] font-bold">
              Precision Hardware Coordinated with Deterministic Fieldbus Architecture
            </p>

            {/* Description */}
            <p className="mt-4 max-w-3xl text-xs sm:text-sm text-slate-600 leading-relaxed">
              We integrate precision robotics, motion control architectures, and intelligent sensing
              into turnkey manufacturing solutions that optimize throughput, eliminate defect variances,
              and elevate plant floor productivity.
            </p>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button
                onClick={() => openModal("engineer")}
                className="h-11 rounded-lg bg-[#155EEF] px-6 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#1047BF] shadow-xs transition-all cursor-pointer"
              >
                <Wrench size={14} className="mr-1.5" />
                <span>Discuss Automation Project</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleWhatsApp}
                className="h-11 rounded-lg border-slate-200 bg-white px-4 text-xs font-bold uppercase tracking-wider text-[#16A34A] hover:border-[#16A34A] hover:bg-emerald-50/50 shadow-2xs transition-all cursor-pointer"
              >
                <MessageSquare size={14} className="mr-1.5" />
                <span>WhatsApp Engineering</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SEARCH & FILTER BAR */}
      <section className="border-b border-slate-200/80 bg-slate-50/70 px-4 py-4 lg:px-8">
        <div className="mx-auto max-w-[1440px] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-lg">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter solutions by technology, process, or keyword..."
              aria-label="Filter solutions"
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-xs text-slate-900 placeholder:text-slate-400 shadow-2xs outline-none transition-colors focus:border-[#155EEF] focus:ring-1 focus:ring-[#155EEF]"
            />
          </div>

          <div className="text-xs font-mono text-slate-600">
            Showing <strong>{filteredSolutions.length}</strong> of {solutionsData.length} Solutions
          </div>
        </div>
      </section>

      {/* 3. SOLUTIONS CARD GRID (Standardized Card Architecture) */}
      <section className="bg-white px-4 py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredSolutions.map((sol, idx) => {
              const Icon = SOLUTION_ICONS[sol.id] || Factory;
              return (
                <article
                  key={sol.id}
                  className="group relative flex h-full flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-6 shadow-xs transition-all duration-200 ease-out hover:-translate-y-1 hover:border-[#155EEF]/50 hover:shadow-md"
                >
                  <div>
                    {/* Eyebrow & Icon Stage */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <span className="rounded bg-blue-50 border border-blue-100 px-2 py-0.5 font-mono text-[10px] font-bold text-[#155EEF] uppercase">
                        SOLUTION 0{idx + 1}
                      </span>
                      <span className="grid size-8 place-items-center rounded-lg bg-slate-50 border border-slate-200/80 text-[#155EEF] group-hover:bg-[#155EEF] group-hover:text-white transition-colors">
                        <Icon size={16} />
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="mt-4 font-display text-xl font-bold uppercase tracking-tight text-slate-900 group-hover:text-[#155EEF] transition-colors leading-snug">
                      <Link
                        to="/solutions/$solutionId"
                        params={{ solutionId: sol.id }}
                        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF] rounded"
                      >
                        {sol.title}
                      </Link>
                    </h2>

                    {/* Subtitle / Positioning */}
                    <p className="mt-1.5 text-xs font-semibold text-[#155EEF] leading-snug">
                      {sol.heroSubtitle}
                    </p>

                    {/* Description */}
                    <p className="mt-3 text-xs leading-relaxed text-slate-600 line-clamp-3">
                      {sol.shortDescription}
                    </p>

                    {/* Key Architectural Benefits */}
                    <div className="mt-4 border-t border-slate-100 pt-3">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-2">
                        Key Engineering Outcomes
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {sol.benefits.slice(0, 2).map((b, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-2">
                            <CheckCircle2 size={13} className="text-[#155EEF] shrink-0 mt-0.5" />
                            <span className="line-clamp-2">
                              <strong className="text-slate-800">{b.title}:</strong> {b.description}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Technologies Tags */}
                    {sol.technologiesUsed && sol.technologiesUsed.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1">
                        {sol.technologiesUsed.slice(0, 3).map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="rounded bg-slate-100 px-2 py-0.5 text-[9px] font-mono font-semibold uppercase text-slate-600"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Footer: Primary & Secondary Actions */}
                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                    <Link
                      to="/solutions/$solutionId"
                      params={{ solutionId: sol.id }}
                      className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#155EEF] hover:text-[#1047BF] transition-colors group/link"
                    >
                      <span>System Architecture</span>
                      <ArrowRight
                        size={12}
                        className="transition-transform duration-200 group-hover/link:translate-x-1"
                      />
                    </Link>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openModal("engineer", { categoryName: sol.title })}
                      className="h-7 px-2 text-[11px] font-bold uppercase text-slate-500 hover:text-[#155EEF] hover:bg-blue-50 rounded"
                    >
                      Consult
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. ENQUIRY STRIP */}
      <section className="border-t border-slate-200/90 bg-[#0F172A] px-4 py-14 text-white lg:px-8">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-400">
              Co-Engineering Services
            </span>
            <h3 className="mt-2 font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white leading-snug">
              Have a Specific Machine Automation Challenge?
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Our engineering team works directly with OEM machine builders and plant engineers to
              deliver turnkey control architectures, deterministic fieldbus loops, and custom kinematic tooling.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              onClick={() => openModal("engineer")}
              className="h-11 rounded-lg bg-[#155EEF] hover:bg-[#1047BF] text-white font-bold uppercase text-xs tracking-wider shadow-sm transition-all cursor-pointer"
            >
              <Wrench size={14} className="mr-1.5" />
              <span>Discuss Requirements</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => openModal("quote")}
              className="h-11 rounded-lg border-slate-600 bg-transparent text-slate-100 hover:bg-white/10 hover:border-white font-bold uppercase text-xs transition-all cursor-pointer"
            >
              <span>Request Quote</span>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
