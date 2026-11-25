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
import { images } from "@/lib/images";

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
    <main className="min-h-screen bg-[#F8FAFC] text-slate-900">
      {/* =========================================================================
          SECTION A: HERO SECTION (Light Enterprise Industrial Theme)
         ========================================================================= */}
      <section className="border-b border-slate-200 bg-white px-5 py-14 sm:py-16 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            {/* Left Column: Headline & Value Proposition */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#155EEF]">
                <Sliders size={13} className="text-[#155EEF]" />
                Deterministic Industrial Engineering
              </div>

              <h1 className="mt-4 font-display text-4xl font-extrabold uppercase leading-[0.96] tracking-tight sm:text-5xl lg:text-6xl text-slate-900">
                Precision Motion. <br />
                <span className="text-[#155EEF]">
                  Deterministic Robotics
                </span>{" "}
                Engineering.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
                INDUS provides specialized engineering services for machine builders, robotics OEMs,
                and manufacturing plants. From application feasibility and joint actuator sizing to
                sub-millisecond multi-axis synchronization and functional safety validation.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button
                  className="h-11 rounded-lg bg-[#155EEF] px-6 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#1047BF] transition-all cursor-pointer"
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
                  className="inline-flex h-11 items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 text-xs font-bold uppercase tracking-wider text-slate-800 transition-colors hover:border-[#155EEF] hover:text-[#155EEF]"
                >
                  Explore 7 Disciplines <ArrowDownRight size={15} />
                </a>

                <Link
                  to="/contact/engineering-enquiry"
                  className="inline-flex h-11 items-center gap-1.5 px-3 text-xs font-semibold text-slate-600 hover:text-[#155EEF] transition-colors"
                >
                  <FileCheck2 size={14} className="text-[#155EEF]" />
                  <span>Submit Spec Sheet</span>
                </Link>
              </div>

              {/* Verified Discipline Quick Anchors */}
              <div className="mt-8 border-t border-slate-200 pt-5">
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 font-semibold">
                  Core Engineering Capabilities:
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs font-mono">
                  {ENGINEERING_SERVICES.map((s) => (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      className="rounded-md border border-slate-200 bg-[#F8FAFC] px-2.5 py-1 text-slate-700 hover:border-[#155EEF] hover:text-[#155EEF] transition-all"
                    >
                      {s.number}: {s.shortTitle}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Industrial Technical Visual & Metric Panel */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
                {/* Real Technical Robotics Image */}
                <div className="relative aspect-[16/11] overflow-hidden rounded-xl bg-slate-900">
                  <img
                    src={images.weldingRobot}
                    alt="INDUS Industrial Robotics Engineering Services"
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

                  {/* Overlaid Engineering Telemetry Badge */}
                  <div className="absolute bottom-3 left-3 right-3 rounded-xl border border-white/15 bg-slate-950/85 p-3.5 backdrop-blur-md">
                    <div className="flex items-center justify-between text-[11px] font-mono text-cyan-300">
                      <span className="flex items-center gap-1.5 font-bold">
                        <span className="size-2 rounded-full bg-cyan-400 animate-pulse" />
                        KINEMATIC VERIFICATION
                      </span>
                      <span className="text-slate-300">ISO 9283 / DIN 3990</span>
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-2 border-t border-white/10 pt-2 text-left font-mono">
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
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <Cpu size={18} className="mt-0.5 shrink-0 text-[#155EEF]" />
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                        Evidence-Backed Methodology
                      </h4>
                      <p className="mt-1 text-[11.5px] leading-relaxed text-slate-600">
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
          SECTION B: 7 ENGINEERING SERVICE DISCIPLINES
         ========================================================================= */}
      <section id="service-portfolio" className="px-5 py-16 lg:px-10 lg:py-20 bg-[#F4F7FB]">
        <div className="mx-auto max-w-[1440px]">
          {/* Header */}
          <div className="mb-10 grid gap-6 md:grid-cols-[1fr_1.1fr] md:items-end border-b border-slate-200 pb-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#155EEF] font-mono">
                SERVICE PORTFOLIO / 01–07
              </p>
              <h2 className="mt-2 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl lg:text-5xl text-slate-900">
                Engineering Disciplines
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-slate-600 md:justify-self-end">
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
                  className="group relative flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[#155EEF]/60 hover:shadow-md sm:p-7"
                >
                  {/* Card Top: Number, Badge & Icon */}
                  <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                    <div>
                      <span className="font-mono text-xs font-bold tracking-[0.2em] text-[#155EEF]">
                        SERVICE {service.number}
                      </span>
                      <span className="ml-2.5 inline-block rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#155EEF]">
                        {service.badge}
                      </span>
                    </div>
                    <div className="size-9 rounded-lg border border-slate-200 bg-slate-50 grid place-items-center text-slate-600 transition-colors group-hover:border-[#155EEF] group-hover:text-[#155EEF]">
                      <Icon size={19} strokeWidth={1.8} />
                    </div>
                  </div>

                  {/* Card Title & Summary */}
                  <h3 className="mt-5 font-display text-xl font-bold uppercase leading-snug tracking-tight text-slate-900 group-hover:text-[#155EEF] transition-colors">
                    {service.title}
                  </h3>

                  <p className="mt-3 text-xs leading-relaxed text-slate-600">
                    {service.summary}
                  </p>

                  {/* Technical Capabilities List */}
                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 font-mono">
                      Technical Scope &amp; Focus:
                    </p>
                    <ul className="mt-3 space-y-2">
                      {service.capabilities.slice(0, 5).map((cap) => (
                        <li key={cap.title} className="flex items-start gap-2 text-xs leading-5">
                          <CheckCircle2 size={13} className="mt-1 shrink-0 text-[#155EEF]" />
                          <span className="text-slate-700 font-medium">{cap.title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Audience & Key Metric */}
                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <div className="flex items-start gap-2 text-xs text-slate-600">
                      <Factory size={14} className="mt-0.5 shrink-0 text-[#155EEF]" />
                      <p className="leading-snug">
                        <span className="font-semibold text-slate-900">Target Applications: </span>
                        {service.targetAudience}
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="mt-auto pt-6 flex flex-col gap-2.5 border-t border-slate-100">
                    <Link
                      to="/engineering-services/$serviceId"
                      params={{ serviceId: service.id }}
                      className="inline-flex w-full items-center justify-between rounded-lg border border-slate-200 bg-[#F8FAFC] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-800 hover:border-[#155EEF] hover:text-[#155EEF] transition-all"
                    >
                      <span>Explore Details &amp; Deliverables</span>
                      <ChevronRight size={14} />
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDiscussService(service)}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#155EEF] hover:bg-[#155EEF] hover:text-white transition-all cursor-pointer"
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
          SECTION C: 4-STAGE ENGINEERING WORKFLOW
         ========================================================================= */}
      <section className="border-y border-slate-200 bg-white px-5 py-16 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#155EEF] font-mono">
              PROJECT EXECUTION METHOD
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl lg:text-5xl text-slate-900">
              A Four-Stage Path to Verifiable Results
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              Every INDUS engineering engagement proceeds through clear technical milestones. We
              align on physics, boundary constraints, and quantifiable verification criteria before
              committing to equipment or physical installation.
            </p>
          </div>

          {/* Horizontal Desktop Process Matrix */}
          <div className="mt-10 grid gap-0 rounded-2xl border border-slate-200 bg-[#F8FAFC] sm:grid-cols-2 lg:grid-cols-4 overflow-hidden">
            {WORKFLOW_STAGES.map((stage, idx) => (
              <div
                key={stage.step}
                className={`relative flex flex-col justify-between p-6 sm:p-7 ${
                  idx > 0 ? "border-t border-slate-200 lg:border-l lg:border-t-0" : ""
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-3xl font-black text-[#155EEF]">{stage.step}</span>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500 border border-slate-200 bg-white rounded px-2 py-0.5">
                      PHASE {stage.step}
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-xl font-bold uppercase tracking-tight text-slate-900">
                    {stage.name}
                  </h3>
                  <p className="mt-1 text-xs font-semibold text-[#155EEF] uppercase tracking-wider">
                    {stage.headline}
                  </p>
                  <p className="mt-3 text-xs leading-relaxed text-slate-600">
                    {stage.description}
                  </p>
                </div>

                <div className="mt-6 border-t border-slate-200 pt-4 space-y-2 text-[11px] font-mono">
                  <div>
                    <span className="block text-[9.5px] uppercase font-bold text-slate-500">
                      Key Inputs:
                    </span>
                    <span className="text-slate-800">{stage.inputs}</span>
                  </div>
                  <div>
                    <span className="block text-[9.5px] uppercase font-bold text-[#155EEF]">
                      Deliverable Output:
                    </span>
                    <span className="text-slate-900 font-semibold">{stage.outputs}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION D: ENGINEERING PRINCIPLES
         ========================================================================= */}
      <section className="px-5 py-16 lg:px-10 lg:py-20 bg-[#F4F7FB]">
        <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#155EEF] font-mono">
              ENGINEERING PHILOSOPHY
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl lg:text-5xl text-slate-900">
              Traceable Calculations. No Hand-Waving.
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-slate-600">
              Industrial machinery cannot tolerate trial-and-error design. Our engineering
              recommendations are backed by first-principles kinematics, finite-element structural
              deflection models, empirical motor/gearhead thermal limits, and international safety
              standards.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              We do not invent unverifiable certifications or guarantee outputs without validated
              customer operating data. Every calculation is delivered with assumptions explicitly
              logged.
            </p>

            <div className="mt-8">
              <Button
                variant="outline"
                className="rounded-lg border-slate-300 bg-white px-6 text-xs font-bold uppercase tracking-wider text-slate-800 hover:border-[#155EEF] hover:text-[#155EEF] cursor-pointer"
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
                  className="rounded-xl border border-slate-200 bg-white p-6 flex flex-col justify-between shadow-2xs"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <PillarIcon size={22} className="text-[#155EEF]" />
                      <span className="font-mono text-[10px] font-semibold text-slate-500 uppercase">
                        {pillar.detail}
                      </span>
                    </div>
                    <h3 className="mt-4 font-display text-lg font-bold uppercase tracking-tight text-slate-900">
                      {pillar.title}
                    </h3>
                    <p className="mt-2.5 text-xs leading-relaxed text-slate-600">
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
      <section className="border-t border-slate-800 bg-[#101B2D] px-5 py-16 text-white lg:px-10 lg:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-300 font-mono">
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
              <div className="mt-6 flex flex-wrap items-center gap-6 text-xs font-mono text-slate-300">
                <a
                  href={`tel:${companyConfig.contact.phone.raw}`}
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Phone size={14} className="text-cyan-300" />
                  <span>Direct: {companyConfig.contact.phone.display}</span>
                </a>
                <a
                  href={`mailto:${companyConfig.contact.email.general}`}
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Mail size={14} className="text-cyan-300" />
                  <span>{companyConfig.contact.email.general}</span>
                </a>
              </div>
            </div>

            {/* Action Group */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <Button
                className="h-12 rounded-lg bg-[#155EEF] px-7 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#1047BF] cursor-pointer"
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
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-7 text-xs font-bold uppercase tracking-wider text-white hover:border-cyan-300 hover:text-cyan-300 transition-colors text-center"
              >
                <span>Submit Spec Sheet</span>
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
