import React, { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronRight,
  FolderKanban,
  CheckCircle2,
  Factory,
  Cpu,
  Warehouse,
  UtensilsCrossed,
  Wrench,
  Send,
  BookOpen,
  FileText,
  ShieldCheck,
  Activity,
  Layers,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModals } from "@/components/modals/ModalContext";
import { buildSeoMeta } from "@/lib/seo";
import { RelatedContent } from "@/components/common/RelatedContent";
import {
  applicationLibraryEntries,
  applicationIndustries,
  type ApplicationLibraryEntry,
} from "@/data/applicationLibrary";

export const Route = createFileRoute("/resources/case-studies")({
  head: () =>
    buildSeoMeta({
      title: "Industrial Application Case Studies & Deployments | INDUS Robotics",
      description:
        "Documented industrial robotics case studies across automotive, semiconductor, pharmaceutical, logistics, and heavy manufacturing. Real engineering constraints, kinematic architectures, and verified testing data.",
      path: "/resources/case-studies",
    }),
  component: CaseStudiesPage,
});

const EXPERIENCE_SECTORS = [
  {
    icon: Factory,
    title: "Automotive Assembly & EV",
    description:
      "Actuator and reducer supply for welding, press loading, and EV battery handling applications. Integration support for servo drive commissioning in multi-axis robotic cells.",
  },
  {
    icon: Cpu,
    title: "Electronics & Semiconductor",
    description:
      "Precision reducer and linear motion components for wafer handling, pick-and-place, and optical inspection stages. Engineering review of cleanroom-compliant motion system specifications.",
  },
  {
    icon: Warehouse,
    title: "Packaging & Material Handling",
    description:
      "Drive wheel and mobile platform components for AMR and AGV applications. Palletizer and case packing cell kinematic sizing consultations.",
  },
  {
    icon: UtensilsCrossed,
    title: "Food & Pharmaceutical",
    description:
      "Hygienic-design actuator selection guidance for washdown environments. Servo drive and safety PLC integration support for packaging line automation.",
  },
  {
    icon: Wrench,
    title: "Machine Building & OEM",
    description:
      "Component supply and engineering consultation for machine builders integrating INDUS motion systems into custom equipment designs.",
  },
  {
    icon: CheckCircle2,
    title: "Aerospace & Heavy Fabrication",
    description:
      "Precision reducer and linear motion supply for metrology, positioning, and composite machining support equipment.",
  },
];

function CaseStudiesPage() {
  const { openModal } = useModals();
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");

  const filteredStudies = useMemo(() => {
    if (selectedIndustry === "all") return applicationLibraryEntries;
    return applicationLibraryEntries.filter(
      (entry) => entry.industrySlug === selectedIndustry
    );
  }, [selectedIndustry]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* 1. HERO */}
      <section className="technical-grid border-b border-border/40 bg-surface-dark px-5 py-20 text-surface-foreground lg:px-10 lg:py-28">
        <div className="mx-auto max-w-[1440px]">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-surface-foreground/60"
          >
            <Link to="/" className="hover:text-signal transition-colors">
              Home
            </Link>
            <ChevronRight size={13} className="text-surface-foreground/30" />
            <Link to="/resources" className="hover:text-signal transition-colors">
              Resources
            </Link>
            <ChevronRight size={13} className="text-surface-foreground/30" />
            <span className="text-signal">Case Studies</span>
          </nav>

          <div className="mt-6 inline-flex items-center gap-2 border border-signal/30 bg-surface-elevated/70 px-3 py-1 rounded-xs">
            <span className="size-1.5 rounded-full bg-signal shadow-[0_0_8px_rgba(180,245,20,0.9)] animate-pulse" />
            <p className="text-[11px] font-bold uppercase tracking-[.22em] text-signal font-mono">
              Industrial Deployment Case Studies
            </p>
          </div>

          <h1 className="mt-4 font-display text-5xl font-bold uppercase leading-[.92] sm:text-6xl lg:text-7xl">
            Engineering Deployments &amp; Case Studies
          </h1>

          <p className="mt-4 font-display text-xl uppercase tracking-wide text-signal sm:text-2xl">
            Verified Kinematic Architectures, Takt Times &amp; Measurable Industrial Results
          </p>

          <p className="mt-6 max-w-3xl text-base leading-8 text-surface-foreground/75 sm:text-lg">
            Explore detailed engineering analyses from automated production lines worldwide.
            Each study documents real mechanical constraints, multi-axis hardware architectures,
            validation test methods, and quantifiable performance gains.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              className="h-12 rounded bg-signal px-7 font-bold uppercase text-signal-foreground hover:bg-[#86b800] transition-colors cursor-pointer"
              onClick={() =>
                openModal("engineer", {
                  categoryName: "Application Case Study",
                  initialMessage:
                    "I would like to discuss engineering an architecture similar to these case studies.",
                })
              }
            >
              <Wrench size={15} className="mr-2" />
              Discuss Your Application
            </Button>
            <Button
              variant="outline"
              className="h-12 rounded border-surface-foreground/30 bg-transparent px-6 font-bold uppercase text-surface-foreground hover:bg-surface-elevated hover:text-signal cursor-pointer"
              onClick={() =>
                openModal("engineer", {
                  categoryName: "Case Study Submission",
                  initialMessage:
                    "I would like to submit a completed industrial project for case study documentation.",
                })
              }
            >
              <Send size={14} className="mr-2" />
              Submit an OEM Project
            </Button>
          </div>
        </div>
      </section>

      {/* 2. VERIFIED CASE STUDIES SHOWCASE */}
      <section className="px-5 py-16 lg:px-10 lg:py-24 border-b border-border/40 bg-background">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border/60">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-signal font-mono">
                Real-World Production Metrics
              </p>
              <h2 className="mt-2 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">
                Featured Deployment Studies
              </h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
                Filtered by industrial sector, citing genuine engineering constraints and laboratory-validated solutions.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {applicationIndustries.slice(0, 6).map((ind) => (
                <button
                  key={ind.slug}
                  onClick={() => setSelectedIndustry(ind.slug)}
                  className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded transition-colors cursor-pointer ${
                    selectedIndustry === ind.slug
                      ? "bg-signal text-signal-foreground font-bold"
                      : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                  }`}
                >
                  {ind.name}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            {filteredStudies.map((study: ApplicationLibraryEntry) => (
              <article
                key={study.id}
                className="group flex flex-col justify-between rounded-xl border border-border bg-card p-6 sm:p-8 shadow-xs hover:border-signal/50 hover:shadow-lg transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <span className="rounded bg-signal/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-signal font-mono">
                      {study.industry}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground uppercase flex items-center gap-1">
                      <ShieldCheck size={13} className="text-signal" />
                      {study.projectType}
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-2xl font-bold uppercase tracking-tight text-foreground group-hover:text-signal transition-colors">
                    {study.title}
                  </h3>

                  <p className="mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                    {study.problemStatement}
                  </p>

                  {/* Mechanical Constraints Box */}
                  <div className="mt-5 rounded-lg border border-border/80 bg-background/80 p-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-foreground font-mono mb-2 flex items-center gap-1.5">
                      <Activity size={12} className="text-signal" />
                      Key Engineering Constraints
                    </h4>
                    <ul className="space-y-1.5 text-xs text-muted-foreground">
                      {study.mechanicalConstraints.map((constraint, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-signal font-bold">•</span>
                          <span>{constraint}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Architecture Implementation */}
                  <div className="mt-5">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-foreground font-mono mb-2 flex items-center gap-1.5">
                      <Layers size={12} className="text-signal" />
                      Implemented Subsystem Architecture
                    </h4>
                    <div className="space-y-2">
                      {study.recommendedArchitecture.map((arch, idx) => (
                        <div
                          key={idx}
                          className="text-xs border-l-2 border-signal/40 pl-3 py-0.5"
                        >
                          <span className="font-bold text-foreground block">
                            {arch.stage}
                          </span>
                          <span className="text-muted-foreground">
                            {arch.description}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Associated Products */}
                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono uppercase text-muted-foreground">
                      Core Hardware:
                    </span>
                    {study.associatedProducts.map((p) => (
                      <Link
                        key={p.id}
                        to="/products/$category"
                        params={{ category: p.categorySlug }}
                        className="rounded border border-border bg-secondary/50 px-2 py-0.5 text-[11px] font-medium text-foreground hover:border-signal hover:text-signal transition-colors"
                      >
                        {p.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-8 pt-5 border-t border-border flex items-center justify-between gap-4 flex-wrap">
                  <div className="text-[11px] text-muted-foreground font-mono truncate max-w-xs">
                    {study.verificationMethod.slice(0, 70)}…
                  </div>
                  <Button
                    size="sm"
                    className="bg-signal text-signal-foreground hover:bg-[#86b800] text-xs font-bold uppercase tracking-wider cursor-pointer"
                    onClick={() =>
                      openModal("engineer", {
                        categoryName: study.industry,
                        initialMessage: `I am interested in the engineering architecture from case study: ${study.title}`,
                      })
                    }
                  >
                    Request Sizing Data <ArrowRight size={13} className="ml-1.5" />
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 3. APPLICATION ENGINEERING SCOPE (Sectors) */}
      <section className="px-5 py-16 lg:px-10 lg:py-24 bg-card border-b border-border/40">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-signal font-mono">
            Cross-Sector Experience
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">
            Application Engineering Scope Across Sectors
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Our engineering teams support robotic integration, motion profiling, and component sizing
            across diverse heavy industrial and micro-precision sectors.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {EXPERIENCE_SECTORS.map((sector) => {
              const Icon = sector.icon;
              return (
                <div
                  key={sector.title}
                  className="group rounded-xl border border-border bg-background p-6 shadow-xs transition-all duration-200 hover:border-signal/50 hover:shadow-md"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="size-9 rounded-lg bg-signal/15 border border-signal/20 text-signal grid place-items-center">
                      <Icon size={18} />
                    </div>
                    <h3 className="font-display text-base font-bold uppercase tracking-tight text-foreground">
                      {sector.title}
                    </h3>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                    {sector.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. SUBMIT AN OEM PROJECT SECTION */}
      <section className="border-b border-border/40 bg-background px-5 py-16 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-signal font-mono">
                OEM Co-Development
              </p>
              <h2 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">
                Have a Robot Cell or OEM Project to Share?
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                If you have integrated INDUS precision reducers, actuators, or robotic arms into your
                production lines or machine builder systems, co-publish an engineering case study
                with us. Citing verified cycle times and reliability metrics builds lasting market authority.
              </p>

              <div className="mt-8">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground font-mono mb-3">
                  Documentation Submission Checklist:
                </p>
                <ul className="space-y-2.5">
                  {[
                    "Kinematic challenge: payload, takt cycle time, and dynamic shock limits",
                    "Hardware bill of materials: reducers, servo joints, controller fieldbus",
                    "Measured operational outcomes: cycle time reduction, MTBF, or backlash longevity",
                    "NDA compliance: optional anonymization as Tier-1 manufacturer",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-signal" />
                      <span className="text-foreground/90">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <Button
                  className="h-11 rounded bg-signal hover:bg-[#86b800] text-signal-foreground px-6 font-bold uppercase text-xs tracking-wider cursor-pointer"
                  onClick={() =>
                    openModal("engineer", {
                      categoryName: "Case Study Submission",
                      initialMessage:
                        "I would like to discuss submitting an industrial project for case study publication.",
                    })
                  }
                >
                  <Send size={14} className="mr-2" />
                  Submit Your Project for Review
                </Button>
              </div>
            </div>

            {/* Side panel: Verification standard */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-xs">
              <h4 className="font-display text-base font-bold uppercase tracking-tight text-foreground">
                Case Study Rigor &amp; Verification
              </h4>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Every published case study conforms to international kinematic testing standards:
              </p>
              <ol className="mt-4 space-y-2.5">
                {[
                  "ISO 9283 Pose Repeatability & Trajectory Accuracy verification",
                  "DIN 3990 Gear Tooth Fatigue & Shock Load Safety margins",
                  "Real-time EtherCAT Distributed Clocks jitter analysis (< 1 µs)",
                  "Thermal equilibrium testing across continuous 3-shift duty cycles",
                  "Environmental sealing inspection per IP65/IP67/Cleanroom ISO Class 4",
                ].map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs">
                    <span className="font-mono font-bold text-signal text-[10px] mt-0.5 min-w-[1.25rem]">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="text-foreground/80">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* 5. RELATED RESOURCES */}
      <section className="px-5 py-16 lg:px-10 lg:py-24 bg-card">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-signal font-mono">
            Knowledge Ecosystem
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">
            Related Technical Resources
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: FolderKanban,
                title: "Engineering Intelligence Hub",
                description: "Technical articles on strain wave reducers, fieldbus synchronization, and kinematic modeling.",
                href: "/engineering-intelligence",
              },
              {
                icon: BookOpen,
                title: "Robotics Architecture Explorer",
                description: "Interactive visual explorer of 6-axis articulated arms, AMRs, and delta packaging cells.",
                href: "/technology/architecture-explorer",
              },
              {
                icon: FileText,
                title: "Motion Sizing Calculators",
                description: "Physics-backed calculation tools for ball screw thrust, inertia matching, and overhung loads.",
                href: "/technology/calculators",
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.title}
                  to={card.href as never}
                  className="group rounded-xl border border-border bg-background p-6 shadow-xs transition-all duration-200 hover:border-signal/50 hover:shadow-md"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="size-9 rounded-lg bg-signal/15 border border-signal/20 text-signal grid place-items-center group-hover:bg-signal group-hover:text-signal-foreground transition-colors">
                      <Icon size={18} />
                    </div>
                    <h3 className="font-display text-base font-bold uppercase tracking-tight text-foreground group-hover:text-signal transition-colors">
                      {card.title}
                    </h3>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                    {card.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-signal">
                    Explore <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* RELATED CONTENT */}
      <RelatedContent
        title="More Resources"
        items={[
          {
            sectionTitle: "Resources & Support",
            links: [
              {
                title: "Technical Documentation",
                description: "Datasheets, catalogues, and application notes.",
                href: "/resources",
              },
              {
                title: "FAQs & Support",
                description: "Engineering answers to common technical questions.",
                href: "/resources/faqs",
              },
              {
                title: "Engineering Capabilities",
                description: "7 engineering disciplines and project workflow.",
                href: "/engineering-services",
              },
            ],
          },
        ]}
      />
    </main>
  );
}
