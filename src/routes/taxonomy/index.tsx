import React, { useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowDown,
  Layers,
  Cpu,
  ShieldCheck,
  Wrench,
  MessageSquare,
  Sparkles,
  GitBranch,
  BookOpen,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildSeoMeta } from "@/lib/seo";
import { companyConfig } from "@/data/config";
import { useModals } from "@/components/modals/ModalContext";
import { TOTAL_ROBOTICS_PILLARS, TaxonomyPillar } from "@/data/taxonomy/roboticsTaxonomyData";
import { TaxonomyExplorer } from "@/components/taxonomy/TaxonomyExplorer";

export const Route = createFileRoute("/taxonomy/")({
  head: () =>
    buildSeoMeta({
      title: "Total Robotics Taxonomy | INDUS Industrial Robotics",
      description:
        "Comprehensive robotics classification framework and visual engineering specification workspace grounded in ISO 8373:2021 and IFR definitions. Explore 8 primary robotics pillars, 8 independent discovery facets, and verified SI parameters.",
      path: "/taxonomy",
    }),
  component: TotalRoboticsTaxonomyPage,
});

function TotalRoboticsTaxonomyPage() {
  const { openModal } = useModals();
  const explorerRef = useRef<HTMLDivElement>(null);

  const handleWhatsApp = () => {
    window.open(companyConfig.getWhatsAppUrl({ type: "general" }), "_blank", "noopener,noreferrer");
  };

  const scrollToExplorer = () => {
    explorerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* =====================================================
          1. HERO SECTION
      ===================================================== */}
      <section className="technical-grid relative border-b border-border/40 bg-surface-dark px-5 py-20 text-surface-foreground lg:px-10 lg:py-28 overflow-hidden">
        {/* Ambient Glow */}
        <div className="pointer-events-none absolute -top-40 right-10 size-96 rounded-full bg-signal/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 left-10 size-96 rounded-full bg-precision-blue/15 blur-3xl" />

        <div className="relative mx-auto max-w-[1440px]">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-surface-foreground/60">
            <Link to="/" className="text-signal hover:underline">
              INDUS
            </Link>
            <span>/</span>
            <Link to="/products" className="text-surface-foreground/80 hover:text-signal">
              Robotics Platform
            </Link>
            <span>/</span>
            <span className="text-signal font-bold">Total Robotics Taxonomy</span>
          </div>

          {/* Badges */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="rounded bg-signal/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[.2em] text-signal border border-signal/30">
              ISO 8373:2021 &amp; IFR Compliant
            </span>
            <span className="rounded bg-surface-elevated px-3 py-1 text-[11px] font-mono text-surface-foreground/70 border border-border/40">
              Phase 1 Robotics Transformation
            </span>
            <span className="rounded bg-emerald-500/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/30">
              8 Pillars • 8 Facets • 14 Engineering Subjects
            </span>
          </div>

          {/* Main Title */}
          <h1 className="mt-6 font-display text-4xl font-bold uppercase leading-[.92] tracking-tight sm:text-6xl lg:text-7xl">
            TOTAL ROBOTICS <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-signal via-precision-blue to-white">
              TAXONOMY
            </span>
          </h1>

          {/* Concise Mission Explanation */}
          <p className="mt-6 max-w-3xl text-sm leading-7 text-surface-foreground/80 sm:text-base lg:text-lg">
            A definitive industrial engineering classification framework preserving the formal international distinction 
            between morphology-driven industrial manipulators and application/locomotion-driven service robots. 
            Navigate eight core pillars through eight orthogonal discovery facets, dual-axis engineering parameter sheets, 
            and verified physical compatibility linkages into the INDUS component catalogue.
          </p>

          {/* Quick Metrics Bar */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 max-w-3xl">
            <div className="rounded border border-border/40 bg-surface-elevated/40 p-3.5 backdrop-blur">
              <span className="text-[10px] font-mono uppercase text-muted-foreground">Architectures</span>
              <div className="text-xl font-display font-bold text-foreground mt-0.5">8 Primary Pillars</div>
              <span className="text-[10px] text-signal font-mono">From Humanoid to Subsea</span>
            </div>

            <div className="rounded border border-border/40 bg-surface-elevated/40 p-3.5 backdrop-blur">
              <span className="text-[10px] font-mono uppercase text-muted-foreground">Classification</span>
              <div className="text-xl font-display font-bold text-foreground mt-0.5">8 Multi-Facets</div>
              <span className="text-[10px] text-signal font-mono">Orthogonal Discovery</span>
            </div>

            <div className="rounded border border-border/40 bg-surface-elevated/40 p-3.5 backdrop-blur">
              <span className="text-[10px] font-mono uppercase text-muted-foreground">Specification</span>
              <div className="text-xl font-display font-bold text-foreground mt-0.5">14 Subjects</div>
              <span className="text-[10px] text-signal font-mono">Verified SI Parameters</span>
            </div>

            <div className="rounded border border-border/40 bg-surface-elevated/40 p-3.5 backdrop-blur">
              <span className="text-[10px] font-mono uppercase text-muted-foreground">Agentic Readiness</span>
              <div className="text-xl font-display font-bold text-emerald-400 mt-0.5">PASS (0 Errors)</div>
              <span className="text-[10px] text-emerald-400 font-mono">Structured Graph Schema</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Button
              className="h-12 rounded-none bg-signal px-7 font-bold uppercase text-xs text-signal-foreground hover:bg-signal/90 shadow-lg shadow-signal/20"
              onClick={scrollToExplorer}
            >
              Explore Taxonomy
              <ArrowDown size={14} className="ml-2 animate-bounce" />
            </Button>

            <Button
              variant="outline"
              className="h-12 rounded-none border-surface-foreground/30 bg-transparent px-6 font-bold uppercase text-xs text-surface-foreground hover:border-signal hover:text-signal"
              onClick={() => openModal("engineer")}
            >
              <Wrench size={14} className="mr-2 text-signal" />
              Consult Robotics Architect
            </Button>

            <Button
              variant="outline"
              className="h-12 rounded-none border-surface-foreground/20 bg-surface-elevated/40 px-5 font-bold uppercase text-xs text-surface-foreground hover:border-signal hover:text-signal"
              onClick={handleWhatsApp}
            >
              <MessageSquare size={14} className="mr-2 text-signal" />
              WhatsApp Engineering
            </Button>

            <Button
              asChild
              variant="ghost"
              className="h-12 rounded-none font-bold uppercase text-xs text-signal hover:bg-surface-elevated/60"
            >
              <Link to="/technology/knowledge-graph">
                Knowledge Graph <ArrowRight size={14} className="ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* =====================================================
          2. THE EIGHT VISUAL PILLARS SECTION
      ===================================================== */}
      <section className="px-5 py-20 lg:px-10 lg:py-24 border-b border-border/50">
        <div className="mx-auto max-w-[1440px]">
          {/* Section Header */}
          <div className="flex flex-col justify-between gap-4 border-b border-border/60 pb-6 md:flex-row md:items-end">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-signal/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.2em] text-signal">
                  Foundational Architecture
                </span>
                <span className="text-xs font-mono text-muted-foreground">Eight Master Navigation Pillars</span>
              </div>
              <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-tight text-foreground sm:text-4xl">
                The Eight Pillars of Modern Robotics
              </h2>
              <p className="mt-2 max-w-2xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
                Each pillar represents a distinct mechanical morphology and operational domain, complete with dedicated engineering photography, governing standards, and representative types.
              </p>
            </div>

            <Button
              variant="outline"
              className="rounded-none border-border font-bold uppercase text-xs shrink-0"
              onClick={scrollToExplorer}
            >
              Jump to Interactive Workspace <ArrowDown size={13} className="ml-1.5" />
            </Button>
          </div>

          {/* 8 Pillar Cards Grid */}
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TOTAL_ROBOTICS_PILLARS.map((pillar) => (
              <div
                key={pillar.id}
                className="group flex flex-col justify-between rounded-lg border border-border/60 bg-card overflow-hidden shadow-lg hover:border-signal hover:shadow-2xl transition-all duration-300"
              >
                <div>
                  {/* Distinct Pillar Visual */}
                  <div className="relative h-48 w-full overflow-hidden bg-surface-dark">
                    <img
                      src={pillar.image}
                      alt={pillar.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108 group-hover:opacity-100 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                    
                    <div className="absolute top-3 left-3">
                      <span className="rounded bg-surface-dark/80 backdrop-blur px-2.5 py-1 text-[11px] font-mono font-bold text-signal border border-signal/40">
                        PILLAR {pillar.categoryNumber}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-4 right-4">
                      <h3 className="font-display text-xl font-bold uppercase tracking-tight text-foreground group-hover:text-signal transition-colors">
                        {pillar.title}
                      </h3>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {pillar.definition}
                    </p>

                    {/* Governing Standards Tags */}
                    <div className="flex flex-wrap gap-1">
                      {pillar.governingStandards.map((std) => (
                        <span
                          key={std}
                          className="rounded bg-surface-elevated px-2 py-0.5 text-[9px] font-mono text-muted-foreground border border-border/40"
                        >
                          {std}
                        </span>
                      ))}
                    </div>

                    {/* Representative Types Pills */}
                    <div className="border-t border-border/40 pt-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-foreground block mb-1.5">
                        Representative Systems:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {pillar.representativeTypes.slice(0, 4).map((type) => (
                          <span
                            key={type}
                            className="rounded bg-surface-elevated/70 px-1.5 py-0.5 text-[9px] text-muted-foreground"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer CTA */}
                <div className="border-t border-border/60 bg-surface-elevated/30 p-4">
                  <Button
                    className="w-full rounded-none bg-signal text-signal-foreground font-bold uppercase text-xs hover:bg-signal/90"
                    onClick={() => {
                      scrollToExplorer();
                    }}
                  >
                    View Taxonomy ({pillar.subcategories.length} Nodes)
                    <ArrowRight size={13} className="ml-1.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          3. INTERACTIVE TAXONOMY EXPLORER & SPEC WORKSPACE
      ===================================================== */}
      <section ref={explorerRef} className="px-5 py-20 lg:px-10 lg:py-24 bg-surface-elevated/20">
        <div className="mx-auto max-w-[1440px]">
          {/* Section Header */}
          <div className="mb-8 space-y-2">
            <div className="flex items-center gap-2">
              <span className="rounded bg-signal/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.2em] text-signal">
                Interactive Engineering Suite
              </span>
              <span className="text-xs font-mono text-muted-foreground">Specification &amp; Discovery Workspace</span>
            </div>
            <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-foreground sm:text-4xl">
              Taxonomy Explorer &amp; Specification Engine
            </h2>
            <p className="max-w-3xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Filter across 8 orthogonal dimensions, inspect dual-axis engineering parameter sheets, explore interactive component relationship graphs, or review governing ISO/IFR ground truth registers.
            </p>
          </div>

          {/* Master Explorer Component */}
          <TaxonomyExplorer />
        </div>
      </section>

      {/* =====================================================
          4. ENGINEERING ARCHITECT CONSULTATION BANNER
      ===================================================== */}
      <section className="border-t border-border/50 bg-surface-dark px-5 py-16 text-surface-foreground lg:px-10">
        <div className="mx-auto max-w-[1440px] rounded-lg border border-border/60 bg-surface-elevated p-8 lg:p-12 shadow-2xl flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
          <div className="space-y-3 max-w-2xl">
            <span className="rounded bg-signal/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[.2em] text-signal">
              Application Sizing &amp; Integration
            </span>
            <h3 className="font-display text-2xl font-bold uppercase text-foreground sm:text-3xl">
              Need Verification or Custom Robot Kinematics Sizing?
            </h3>
            <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Our principal robotics engineers provide deterministic joint torque sizing, reducer inertia matching, 
              safety cell validation (ISO 10218 / ISO 3691-4), and VDA 5050 fleet architecture review.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              className="h-11 rounded-none bg-signal px-6 font-bold uppercase text-xs text-signal-foreground hover:bg-signal/90"
              onClick={() => openModal("engineer")}
            >
              <Wrench size={14} className="mr-1.5" /> Consult Robotics Architect
            </Button>

            <Button
              variant="outline"
              className="h-11 rounded-none border-border px-5 font-bold uppercase text-xs text-foreground hover:border-signal hover:text-signal"
              onClick={handleWhatsApp}
            >
              <MessageSquare size={14} className="mr-1.5 text-signal" /> WhatsApp Engineering
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
