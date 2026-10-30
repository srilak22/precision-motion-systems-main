import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDownRight,
  ArrowRight,
  Activity,
  Bot,
  CheckCircle2,
  CircuitBoard,
  ClipboardCheck,
  DraftingCompass,
  Factory,
  Gauge,
  Layers3,
  ShieldCheck,
  Wrench,
  Cpu,
  FileCheck2,
  ChevronRight,
  Phone,
  Mail,
  Sliders,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModals } from "@/components/modals/ModalContext";
import { buildSeoMeta } from "@/lib/seo";
import { ENGINEERING_SERVICES, type EngineeringServiceItem } from "@/data/engineeringServicesData";
import { companyConfig } from "@/data/config";
import { RelatedContent } from "@/components/common/RelatedContent";

export const Route = createFileRoute("/engineering-services/")({
  head: () =>
    buildSeoMeta({
      title: "Industrial Robotics Engineering Services | INDUS Precision Motion",
      description:
        "Comprehensive engineering services across application feasibility, joint mechatronics, robotic workcells, motion control synchronization, functional safety, custom robotics, and lifecycle optimization.",
      path: "/engineering-services",
    }),
  component: EngineeringServicesLandingPage,
});

// Map icon strings / services to Lucide components
const SERVICE_ICONS: Record<string, React.ElementType> = {
  "application-engineering": DraftingCompass,
  "kinematic-subsystems": Layers3,
  "robotic-workcells": Bot,
  "motion-control": CircuitBoard,
  "safety-compliance": ShieldCheck,
  "custom-robotics": Wrench,
  "lifecycle-optimization": Activity,
};

const WORKFLOW_STAGES = [
  {
    step: "01",
    name: "Discover",
    headline: "Process & Constraint Intake",
    description:
      "Understand the target takt time, part geometries, spatial envelope, and upstream/downstream interfaces.",
    inputs: "Part CAD, cycle targets, factory footprint",
    outputs: "Station cycle budget, initial feasibility score",
  },
  {
    step: "02",
    name: "Define",
    headline: "Architecture & Scope Agreement",
    description:
      "Model kinematic configurations, size reducers/drives, evaluate trade-offs, and define acceptance criteria.",
    inputs: "Load spectrum, fieldbus standards, safety specs",
    outputs: "3D CAD reach layout, torque curves, deliverables list",
  },
  {
    step: "03",
    name: "Engineer",
    headline: "Detailed Design & Implementation",
    description:
      "Complete mechanical CAD packages, wiring schematics, motion control routines, and safety PLC logic.",
    inputs: "Agreed architecture, component specifications",
    outputs: "2D/3D drawing sets, IEC 61131-3 code, SISTEMA model",
  },
  {
    step: "04",
    name: "Verify & Improve",
    headline: "Empirical Validation & Optimization",
    description:
      "Execute FAT/SAT protocols, measure following errors, tune servo loops, and establish preventive maintenance.",
    inputs: "Physical test runs, vibration telemetry logs",
    outputs: "Validation certificates, optimized trajectory sets",
  },
];

const ENGINEERING_PRINCIPLES = [
  {
    icon: Gauge,
    title: "Performance Criteria",
    detail: "Traceable Sizing",
    description:
      "Every mechanism is sized against empirical continuous (RMS) torque, peak acceleration, load-to-motor inertia ratios (≤5:1), and ISO 9283 kinematic repeatability targets.",
  },
  {
    icon: ClipboardCheck,
    title: "Technical Evidence",
    detail: "Calculated Verification",
    description:
      "We provide verifiable engineering documentation: L10h bearing fatigue life, finite element deflection models, Bode plot frequency sweeps, and gear tooth safety factors per DIN 3990.",
  },
  {
    icon: ShieldCheck,
    title: "Safety by Design",
    detail: "ISO 12100 & 13849-1",
    description:
      "Hazard identification, SISTEMA calculations, and safety circuit category design (Cat 3/4, PL d/e) integrated from first concepts—never bolted on after physical commissioning.",
  },
  {
    icon: Layers3,
    title: "Mechatronic Integration",
    detail: "Unified Systems",
    description:
      "Mechanical joints, frameless motors, real-time fieldbus networks (EtherCAT, PROFINET IRT), and supervisory factory controls are engineered as a cohesive, deterministic system.",
  },
];

function EngineeringServicesLandingPage() {
  const { openModal } = useModals();

  const handleDiscussService = (service: EngineeringServiceItem) => {
    openModal("engineer", {
      categoryName: service.title,
      initialMessage: `I would like to discuss engineering requirements for ${service.title} (${service.badge}).`,
    });
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* =========================================================================
          SECTION A: HERO SECTION (Editorial, Industrial, High Credibility)
         ========================================================================= */}
      <section className="technical-grid border-b border-border/50 bg-[#0B0F17] px-5 py-16 text-white sm:py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          {/* Breadcrumb & Identifier */}
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex items-center gap-2 text-xs font-mono tracking-wider text-slate-400"
          >
            <Link to="/" className="hover:text-signal transition-colors">
              HOME
            </Link>
            <span>/</span>
            <span className="text-signal font-semibold">ENGINEERING SERVICES</span>
          </nav>

          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            {/* Left Column: Headline & Value Proposition */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-signal/30 bg-signal/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-signal">
                <Sliders size={13} className="text-signal" />
                Deterministic Industrial Engineering
              </div>

              <h1 className="mt-4 font-display text-4xl font-extrabold uppercase leading-[0.96] tracking-tight sm:text-5xl lg:text-6xl text-white">
                Precision Motion. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-signal">
                  Deterministic Robotics
                </span>{" "}
                Engineering.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
                INDUS provides specialized engineering services for machine builders, robotics OEMs,
                and manufacturing plants. From application feasibility and joint actuator sizing to
                sub-millisecond multi-axis synchronization and functional safety validation.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button
                  className="h-12 rounded-none bg-signal px-7 text-xs font-bold uppercase tracking-wider text-signal-foreground hover:bg-signal/90 shadow-[0_4px_20px_rgba(21,94,239,0.35)] transition-all cursor-pointer"
                  onClick={() =>
                    openModal("engineer", {
                      categoryName: "Application Engineering & Feasibility",
                      initialMessage:
                        "I would like to discuss our robotics engineering project requirements.",
                    })
                  }
                >
                  Discuss Your Project <ArrowRight size={15} className="ml-2" />
                </Button>

                <a
                  href="#service-portfolio"
                  className="inline-flex h-12 items-center gap-2 border border-slate-700 bg-slate-900/60 px-6 text-xs font-bold uppercase tracking-wider text-slate-200 backdrop-blur-xs transition-colors hover:border-signal hover:text-signal"
                >
                  Explore 7 Disciplines <ArrowDownRight size={15} />
                </a>

                <Link
                  to="/contact/engineering-enquiry"
                  className="inline-flex h-12 items-center gap-1.5 px-4 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  <FileCheck2 size={14} className="text-signal" />
                  <span>Submit 7-Section Spec Sheet</span>
                </Link>
              </div>

              {/* Verified Discipline Quick Anchors */}
              <div className="mt-10 border-t border-slate-800 pt-6">
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">
                  Core Engineering Capabilities:
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs font-mono">
                  {ENGINEERING_SERVICES.map((s) => (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      className="rounded border border-slate-800 bg-slate-900/80 px-2.5 py-1 text-slate-300 hover:border-signal/60 hover:text-signal transition-all"
                    >
                      {s.number}: {s.shortTitle}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Industrial Technical Visual & Metric Panel */}
            <div className="relative">
              <div className="relative overflow-hidden border border-slate-800 bg-slate-900/70 p-1.5 shadow-2xl">
                {/* Real Technical Robotics Image */}
                <div className="relative aspect-[16/11] overflow-hidden bg-slate-950">
                  <img
                    src="/welding-robot.jpg"
                    alt="INDUS Industrial Robotics Engineering Services"
                    className="h-full w-full object-cover opacity-85 transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-transparent to-transparent opacity-80" />

                  {/* Overlaid Engineering Telemetry Badge */}
                  <div className="absolute bottom-4 left-4 right-4 border border-slate-700/80 bg-slate-950/85 p-3.5 backdrop-blur-md">
                    <div className="flex items-center justify-between text-[11px] font-mono text-signal">
                      <span className="flex items-center gap-1.5 font-bold">
                        <span className="size-2 rounded-full bg-signal animate-pulse" />
                        KINEMATIC VERIFICATION
                      </span>
                      <span className="text-slate-400">ISO 9283 / DIN 3990</span>
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-2 border-t border-slate-800 pt-2 text-left font-mono">
                      <div>
                        <span className="block text-[9.5px] uppercase text-slate-400">
                          Target Inertia
                        </span>
                        <span className="text-xs font-bold text-white">≤ 5:1 Ratio</span>
                      </div>
                      <div>
                        <span className="block text-[9.5px] uppercase text-slate-400">
                          Lost Motion
                        </span>
                        <span className="text-xs font-bold text-white">&lt; 1.0 arcmin</span>
                      </div>
                      <div>
                        <span className="block text-[9.5px] uppercase text-slate-400">
                          Bus Jitter
                        </span>
                        <span className="text-xs font-bold text-white">&lt; 1.0 µs DC</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub-panel: Engineering Commitment */}
                <div className="border-t border-slate-800 bg-slate-900/90 p-4">
                  <div className="flex items-start gap-3">
                    <Cpu size={18} className="mt-0.5 shrink-0 text-signal" />
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                        Evidence-Backed Methodology
                      </h4>
                      <p className="mt-1 text-[11.5px] leading-relaxed text-slate-300">
                        We calculate and verify mechanical, electrical, and control constraints
                        before capital commitment. Every recommendation is traceable to engineering
                        datasheets and physical laws.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION B: 7 ENGINEERING SERVICE DISCIPLINES (Deep Structured Cards)
         ========================================================================= */}
      <section id="service-portfolio" className="px-5 py-16 lg:px-10 lg:py-24 bg-card/40">
        <div className="mx-auto max-w-[1440px]">
          {/* Header */}
          <div className="mb-12 grid gap-6 md:grid-cols-[1fr_1.1fr] md:items-end border-b border-border/60 pb-8">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-signal font-mono">
                SERVICE PORTFOLIO / 01–07
              </p>
              <h2 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl lg:text-5xl">
                Engineering Disciplines
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground md:justify-self-end">
              Choose a service based on your application, subsystem, or operating challenge. Scope,
              tangible deliverables, testing criteria, and project milestones are formally defined
              for each engineering engagement.
            </p>
          </div>

          {/* 7 Services Grid */}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {ENGINEERING_SERVICES.map((service) => {
              const Icon = SERVICE_ICONS[service.id] || DraftingCompass;

              return (
                <article
                  id={service.id}
                  key={service.id}
                  className="group relative flex h-full flex-col border border-border bg-card p-6 transition-all duration-200 hover:border-signal hover:shadow-lg sm:p-7"
                >
                  {/* Card Top: Number, Badge & Icon */}
                  <div className="flex items-start justify-between border-b border-border/60 pb-4">
                    <div>
                      <span className="font-mono text-xs font-bold tracking-[0.2em] text-signal">
                        SERVICE {service.number}
                      </span>
                      <span className="ml-2.5 inline-block rounded bg-signal/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-signal">
                        {service.badge}
                      </span>
                    </div>
                    <div className="size-9 rounded-none border border-border bg-muted/30 grid place-items-center text-muted-foreground transition-colors group-hover:border-signal group-hover:text-signal">
                      <Icon size={19} strokeWidth={1.8} />
                    </div>
                  </div>

                  {/* Card Title & Summary */}
                  <h3 className="mt-5 font-display text-xl font-bold uppercase leading-snug tracking-tight text-foreground group-hover:text-signal transition-colors">
                    {service.title}
                  </h3>

                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                    {service.summary}
                  </p>

                  {/* Technical Capabilities List */}
                  <div className="mt-5 border-t border-border/60 pt-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground font-mono">
                      Technical Scope &amp; Focus:
                    </p>
                    <ul className="mt-3 space-y-2">
                      {service.capabilities.slice(0, 5).map((cap) => (
                        <li key={cap.title} className="flex items-start gap-2 text-xs leading-5">
                          <CheckCircle2 size={13} className="mt-1 shrink-0 text-signal" />
                          <span className="text-foreground/90 font-medium">{cap.title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Audience & Key Metric */}
                  <div className="mt-5 border-t border-border/60 pt-4">
                    <div className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Factory size={14} className="mt-0.5 shrink-0 text-signal" />
                      <p className="leading-snug">
                        <span className="font-semibold text-foreground">Target Applications: </span>
                        {service.targetAudience}
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="mt-auto pt-6 flex flex-col gap-2.5 border-t border-border/60">
                    <Link
                      to="/engineering-services/$serviceId"
                      params={{ serviceId: service.id }}
                      className="inline-flex w-full items-center justify-between border border-border bg-background px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-foreground hover:border-signal hover:text-signal transition-all"
                    >
                      <span>Explore Technical Details &amp; Deliverables</span>
                      <ChevronRight size={14} />
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDiscussService(service)}
                      className="inline-flex w-full items-center justify-center gap-2 bg-signal/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-signal hover:bg-signal hover:text-signal-foreground transition-all cursor-pointer"
                    >
                      <span>Discuss This Service</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION C: 4-STAGE ENGINEERING WORKFLOW (Horizontal Industrial Process)
         ========================================================================= */}
      <section className="border-y border-border/60 bg-muted/20 px-5 py-16 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-signal font-mono">
              PROJECT EXECUTION METHOD
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl lg:text-5xl">
              A Four-Stage Path to Verifiable Results
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Every INDUS engineering engagement proceeds through clear technical milestones. We
              align on physics, boundary constraints, and quantifiable verification criteria before
              committing to equipment or physical installation.
            </p>
          </div>

          {/* Horizontal Desktop Process Matrix */}
          <div className="mt-12 grid gap-0 border border-border bg-card sm:grid-cols-2 lg:grid-cols-4">
            {WORKFLOW_STAGES.map((stage, idx) => (
              <div
                key={stage.step}
                className={`relative flex flex-col justify-between p-6 sm:p-7 ${
                  idx > 0 ? "border-t border-border lg:border-l lg:border-t-0" : ""
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-3xl font-black text-signal">{stage.step}</span>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground border border-border px-2 py-0.5">
                      PHASE {stage.step}
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-xl font-bold uppercase tracking-tight">
                    {stage.name}
                  </h3>
                  <p className="mt-1 text-xs font-semibold text-signal uppercase tracking-wider">
                    {stage.headline}
                  </p>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                    {stage.description}
                  </p>
                </div>

                <div className="mt-6 border-t border-border/60 pt-4 space-y-2 text-[11px] font-mono">
                  <div>
                    <span className="block text-[9.5px] uppercase font-bold text-muted-foreground">
                      Key Inputs:
                    </span>
                    <span className="text-foreground/90">{stage.inputs}</span>
                  </div>
                  <div>
                    <span className="block text-[9.5px] uppercase font-bold text-signal">
                      Deliverable Output:
                    </span>
                    <span className="text-foreground font-semibold">{stage.outputs}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION D: ENGINEERING PRINCIPLES (Non-Marketing Technical Commitments)
         ========================================================================= */}
      <section className="px-5 py-16 lg:px-10 lg:py-24">
        <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-signal font-mono">
              ENGINEERING PHILOSOPHY
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl lg:text-5xl">
              Traceable Calculations. No Hand-Waving.
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              Industrial machinery cannot tolerate trial-and-error design. Our engineering
              recommendations are backed by first-principles kinematics, finite-element structural
              deflection models, empirical motor/gearhead thermal limits, and international safety
              standards.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              We do not invent unverifiable certifications or guarantee outputs without validated
              customer operating data. Every calculation is delivered with assumptions explicitly
              logged.
            </p>

            <div className="mt-8">
              <Button
                variant="outline"
                className="rounded-none border-border px-6 text-xs font-bold uppercase tracking-wider hover:border-signal hover:text-signal"
                onClick={() =>
                  openModal("engineer", {
                    categoryName: "Application Engineering & Feasibility",
                    initialMessage:
                      "I would like to review calculation reports and engineering sizing methodologies.",
                  })
                }
              >
                Request Sizing Sample Report <ArrowRight size={14} className="ml-2" />
              </Button>
            </div>
          </div>

          {/* 4 Pillars Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {ENGINEERING_PRINCIPLES.map((pillar) => {
              const PillarIcon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="border border-border bg-card p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <PillarIcon size={22} className="text-signal" />
                      <span className="font-mono text-[10px] font-semibold text-muted-foreground uppercase">
                        {pillar.detail}
                      </span>
                    </div>
                    <h3 className="mt-4 font-display text-lg font-bold uppercase tracking-tight text-foreground">
                      {pillar.title}
                    </h3>
                    <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION E: TECHNICAL ENQUIRY & SPECIFICATION CTA
         ========================================================================= */}
      <section className="technical-grid border-t border-border/50 bg-[#0B0F17] px-5 py-16 text-white lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-signal font-mono">
                START AN ENGINEERING DISCUSSION
              </p>
              <h2 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl lg:text-5xl text-white">
                What Manufacturing Challenge Are You Solving?
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                Share your target cycle time, part mass, machine interfaces, or joint envelope. Our
                senior application engineering team will review your parameters, identify technical
                risks, and propose a structured path forward.
              </p>

              {/* Direct Support Badges */}
              <div className="mt-6 flex flex-wrap items-center gap-6 text-xs font-mono text-slate-400">
                <a
                  href={`tel:${companyConfig.contact.phone.raw}`}
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Phone size={14} className="text-signal" />
                  <span>Direct: {companyConfig.contact.phone.display}</span>
                </a>
                <a
                  href={`mailto:${companyConfig.contact.email.general}`}
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Mail size={14} className="text-signal" />
                  <span>{companyConfig.contact.email.general}</span>
                </a>
              </div>
            </div>

            {/* Action Group */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <Button
                className="h-13 rounded-none bg-signal px-8 text-xs font-bold uppercase tracking-wider text-signal-foreground hover:bg-signal/90 shadow-[0_4px_20px_rgba(21,94,239,0.35)] cursor-pointer"
                onClick={() =>
                  openModal("engineer", {
                    categoryName: "Application Engineering & Feasibility",
                    initialMessage:
                      "I would like to schedule an engineering consultation to discuss our application requirements.",
                  })
                }
              >
                Schedule Technical Consultation <ArrowRight size={15} className="ml-2" />
              </Button>

              <Link
                to="/contact/engineering-enquiry"
                className="inline-flex h-13 items-center justify-center gap-2 border border-slate-700 bg-slate-900/70 px-7 text-xs font-bold uppercase tracking-wider text-slate-200 hover:border-signal hover:text-signal transition-colors text-center"
              >
                <span>Submit 7-Section Spec Sheet</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION F: ENGINEERING REFERENCE & CROSS-LINKING */}
      <RelatedContent
        title="Engineering Infrastructure & Reference"
        items={[
          {
            sectionTitle: "Systems & Standards",
            links: [
              {
                title: "System Integration",
                description: "Mechanical, electrical, and control boundaries for automated cells.",
                href: "/engineering-services/system-integration",
              },
              {
                title: "Technical Specifications",
                description: "Verified parameters by product family and motion discipline.",
                href: "/engineering-services/technical-specifications",
              },
              {
                title: "Quality & Standards",
                description: "ISO 9283, ISO 13849, DIN 3990 calculation and testing scope.",
                href: "/engineering-services/quality-standards",
              },
            ],
          },
          {
            sectionTitle: "Design Tools & Documentation",
            links: [
              {
                title: "Kinematic Sizing Calculators",
                description: "Ball screw, reducer inertia ratio, and wrist moment sizing.",
                href: "/technology/calculators",
              },
              {
                title: "CAD & Downloads",
                description: "Request 3D STEP files, dimension drawings, and wiring manuals.",
                href: "/engineering-services/cad-downloads",
              },
              {
                title: "Application Case Studies",
                description: "Documented integration projects and application experience.",
                href: "/resources/case-studies",
              },
            ],
          },
        ]}
      />
    </main>
  );
}
