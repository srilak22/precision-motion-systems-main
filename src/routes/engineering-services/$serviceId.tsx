import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  Factory,
  Cpu,
  Layers,
  ChevronDown,
  Phone,
  Mail,
  ShieldCheck,
  Wrench,
  Compass,
  FileCheck2,
  Sliders,
  CheckSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModals } from "@/components/modals/ModalContext";
import { buildSeoMeta } from "@/lib/seo";
import {
  getEngineeringService,
  ENGINEERING_SERVICES,
  type EngineeringServiceItem,
} from "@/data/engineeringServicesData";
import { companyConfig } from "@/data/config";

export const Route = createFileRoute("/engineering-services/$serviceId")({
  loader: ({ params }) => {
    const service = getEngineeringService(params.serviceId);
    if (!service) {
      throw notFound();
    }
    return { service };
  },
  head: ({ loaderData }) => {
    const service = loaderData?.service;
    return buildSeoMeta({
      title: `${service?.title || "Engineering Service"} | INDUS Industrial Robotics`,
      description:
        service?.summary ||
        "Professional industrial robotics and precision motion engineering services by INDUS.",
      path: `/engineering-services/${service?.id || ""}`,
      ogType: "article",
    });
  },
  component: ServiceDetailPage,
});

function ServiceDetailPage() {
  const { service } = Route.useLoaderData();
  const { openModal } = useModals();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleDiscussService = () => {
    openModal("engineer", {
      categoryName: service.title,
      initialMessage: `I would like to discuss our requirements for ${service.title} (${service.badge}).`,
    });
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* =========================================================================
          HERO SECTION: SERVICE-SPECIFIC EDITORIAL BANNER
         ========================================================================= */}
      <section className="technical-grid border-b border-border/50 bg-[#0B0F17] px-5 py-14 text-white sm:py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex flex-wrap items-center gap-2 text-xs font-mono tracking-wider text-slate-400"
          >
            <Link to="/" className="hover:text-signal transition-colors">
              HOME
            </Link>
            <span>/</span>
            <Link to="/engineering-services" className="hover:text-signal transition-colors">
              ENGINEERING SERVICES
            </Link>
            <span>/</span>
            <span className="text-signal font-semibold uppercase">{service.shortTitle}</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            {/* Left: Headlines & Core Value */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-signal/30 bg-signal/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-signal font-mono">
                <span>SERVICE {service.number}</span>
                <span>•</span>
                <span>{service.badge}</span>
              </div>

              <h1 className="mt-4 font-display text-3xl font-extrabold uppercase leading-[1.02] tracking-tight sm:text-4xl lg:text-5xl text-white">
                {service.title}
              </h1>

              <p className="mt-3 text-base font-semibold text-sky-400 sm:text-lg">
                {service.heroHeadline}
              </p>

              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
                {service.heroSubtitle}
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button
                  className="h-12 rounded-none bg-signal px-7 text-xs font-bold uppercase tracking-wider text-signal-foreground hover:bg-signal/90 shadow-[0_4px_20px_rgba(21,94,239,0.35)] cursor-pointer"
                  onClick={handleDiscussService}
                >
                  Discuss This Service <ArrowRight size={15} className="ml-2" />
                </Button>

                <a
                  href="#checklist"
                  className="inline-flex h-12 items-center gap-2 border border-slate-700 bg-slate-900/60 px-6 text-xs font-bold uppercase tracking-wider text-slate-200 hover:border-signal hover:text-signal transition-colors"
                >
                  <span>Pre-Consultation Checklist</span>
                  <CheckSquare size={14} />
                </a>

                <Link
                  to="/engineering-services"
                  className="inline-flex h-12 items-center gap-1.5 px-3 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  <ArrowLeft size={14} />
                  <span>All Services</span>
                </Link>
              </div>
            </div>

            {/* Right: Technical Specification & Discipline Telemetry HUD */}
            <div className="border border-slate-800 bg-slate-900/80 p-6 sm:p-7 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2 text-xs font-mono text-signal">
                  <Sliders size={15} />
                  <span className="font-bold uppercase tracking-wider">Service Scope Overview</span>
                </div>
                <span className="font-mono text-[10px] text-slate-400 uppercase">
                  Ref: INDUS-ES-{service.number}
                </span>
              </div>

              <div className="mt-5 space-y-4 text-xs font-mono">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400">
                    Target Industry &amp; Team:
                  </span>
                  <p className="mt-1 text-sm font-sans text-slate-200">{service.targetAudience}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 border-t border-slate-800 pt-3">
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">
                      Engineering Method:
                    </span>
                    <span className="text-white font-semibold">
                      {service.engineeringApproach.stages.length} Structured Phases
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">
                      Key Deliverables:
                    </span>
                    <span className="text-white font-semibold">CAD, Math &amp; Test Records</span>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-3">
                  <span className="block text-[10px] uppercase font-bold text-slate-400">
                    Deliverable Format:
                  </span>
                  <p className="mt-1 text-slate-300 font-sans text-[11.5px] leading-relaxed">
                    3D CAD (.STEP / Native), 2D drawings with GD&amp;T, calculation worksheets, and
                    validation test protocols tailored to project scope.
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-slate-800 pt-4 flex items-center justify-between">
                <Link
                  to="/contact/engineering-enquiry"
                  className="text-xs font-bold uppercase tracking-wider text-signal hover:underline inline-flex items-center gap-1.5"
                >
                  <FileCheck2 size={14} />
                  <span>Submit Specification Intake →</span>
                </Link>
                <span className="text-[10px] font-mono text-slate-400">24-48h Review</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 1: CUSTOMER PROBLEM STATEMENT & TECHNICAL RISKS
         ========================================================================= */}
      <section className="px-5 py-16 lg:px-10 lg:py-20 border-b border-border/60">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-signal font-mono">
                THE ENGINEERING CHALLENGE
              </p>
              <h2 className="mt-3 font-display text-2xl font-extrabold uppercase tracking-tight sm:text-3xl lg:text-4xl">
                What Goes Wrong Without Rigorous Sizing?
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                {service.problemStatement.challenge}
              </p>
              <div className="mt-6 border-l-2 border-signal pl-4 bg-muted/20 py-2.5 pr-3">
                <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-signal">
                  Operational Impact:
                </span>
                <p className="mt-1 text-xs leading-relaxed text-foreground/90 font-medium">
                  {service.problemStatement.impact}
                </p>
              </div>
            </div>

            {/* Technical Risks Grid */}
            <div>
              <h3 className="font-display text-lg font-bold uppercase tracking-wider text-foreground">
                Critical Failure Modes Addressed
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Specific technical risks mitigated through this engineering discipline:
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {service.problemStatement.technicalRisks.map((risk, index) => (
                  <div
                    key={index}
                    className="border border-border/80 bg-card p-4 flex items-start gap-3"
                  >
                    <AlertCircle size={16} className="mt-0.5 shrink-0 text-signal" />
                    <p className="text-xs leading-relaxed text-foreground/90">{risk}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: ENGINEERING METHODOLOGY & STAGES
         ========================================================================= */}
      <section className="bg-muted/20 px-5 py-16 lg:px-10 lg:py-24 border-b border-border/60">
        <div className="mx-auto max-w-[1440px]">
          <div className="max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-signal font-mono">
              ENGINEERING APPROACH
            </p>
            <h2 className="mt-3 font-display text-2xl font-extrabold uppercase tracking-tight sm:text-3xl lg:text-4xl">
              Systematic 4-Phase Engineering Framework
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {service.engineeringApproach.methodology}
            </p>
          </div>

          <div className="mt-10 grid gap-0 border border-border bg-card sm:grid-cols-2 lg:grid-cols-4">
            {service.engineeringApproach.stages.map((stage, idx) => (
              <div
                key={stage.step}
                className={`p-6 sm:p-7 flex flex-col justify-between ${
                  idx > 0 ? "border-t border-border lg:border-l lg:border-t-0" : ""
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-3xl font-black text-signal">{stage.step}</span>
                    <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-muted-foreground border border-border px-1.5 py-0.5">
                      STAGE {stage.step}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold uppercase tracking-tight">
                    {stage.name}
                  </h3>
                  <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">
                    {stage.focus}
                  </p>
                </div>

                <div className="mt-6 border-t border-border/60 pt-3">
                  <span className="block text-[9.5px] uppercase font-mono font-bold text-signal">
                    Stage Deliverable:
                  </span>
                  <span className="mt-1 block text-xs font-semibold text-foreground">
                    {stage.output}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: DEEP TECHNICAL CAPABILITIES
         ========================================================================= */}
      <section className="px-5 py-16 lg:px-10 lg:py-24 border-b border-border/60">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-10 max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-signal font-mono">
              TECHNICAL CAPABILITIES
            </p>
            <h2 className="mt-3 font-display text-2xl font-extrabold uppercase tracking-tight sm:text-3xl lg:text-4xl">
              Specialized Scope Areas
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              In-depth technical capabilities applied throughout this service discipline.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {service.capabilities.map((cap) => (
              <div
                key={cap.title}
                className="border border-border bg-card p-6 flex flex-col justify-between hover:border-signal transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-signal shrink-0" />
                    <h3 className="font-display text-base font-bold uppercase tracking-tight text-foreground">
                      {cap.title}
                    </h3>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                    {cap.description}
                  </p>
                </div>
                <div className="mt-5 border-t border-border/60 pt-3">
                  <span className="block text-[9.5px] font-mono uppercase text-muted-foreground font-bold">
                    Engineering Detail:
                  </span>
                  <p className="mt-1 text-[11px] font-mono text-foreground/90 leading-relaxed">
                    {cap.engineeringDetail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: SYSTEM COMPONENTS & RELEVANT HARDWARE
         ========================================================================= */}
      <section className="bg-muted/20 px-5 py-16 lg:px-10 lg:py-20 border-b border-border/60">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-10 max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-signal font-mono">
              SYSTEM INTEGRATION
            </p>
            <h2 className="mt-3 font-display text-2xl font-extrabold uppercase tracking-tight sm:text-3xl lg:text-4xl">
              Relevant Hardware &amp; Mechatronic Components
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Component technologies sized, verified, or integrated within this service.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {service.systemComponents.map((comp) => (
              <div key={comp.name} className="border border-border bg-card p-5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-signal bg-signal/10 px-2 py-0.5 rounded">
                    {comp.category}
                  </span>
                  <Cpu size={15} className="text-muted-foreground" />
                </div>
                <h3 className="mt-3 font-display text-base font-bold uppercase text-foreground">
                  {comp.name}
                </h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{comp.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: REAL-WORLD INDUSTRIAL USE CASES
         ========================================================================= */}
      <section className="px-5 py-16 lg:px-10 lg:py-24 border-b border-border/60">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-10 max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-signal font-mono">
              PROVEN APPLICATIONS
            </p>
            <h2 className="mt-3 font-display text-2xl font-extrabold uppercase tracking-tight sm:text-3xl lg:text-4xl">
              Representative Engineering Engagements
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Examples of verified project challenges and the quantifiable results delivered.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {service.useCases.map((useCase) => (
              <div
                key={useCase.title}
                className="border border-border bg-card p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-signal">
                      {useCase.industry}
                    </span>
                    <Factory size={15} className="text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold uppercase tracking-tight text-foreground">
                    {useCase.title}
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                    {useCase.description}
                  </p>
                </div>

                <div className="mt-6 border-t border-border/60 pt-3 bg-signal/5 -mx-6 -mb-6 p-4">
                  <span className="block text-[10px] font-mono font-bold uppercase text-signal">
                    Empirical Result / Metric:
                  </span>
                  <p className="mt-1 text-xs font-semibold text-foreground">{useCase.keyMetric}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: DELIVERABLES & TECHNICAL DOCUMENTATION
         ========================================================================= */}
      <section className="bg-muted/20 px-5 py-16 lg:px-10 lg:py-20 border-b border-border/60">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-10 max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-signal font-mono">
              PROJECT ARTIFACTS
            </p>
            <h2 className="mt-3 font-display text-2xl font-extrabold uppercase tracking-tight sm:text-3xl lg:text-4xl">
              Potential Deliverables (Qualified by Scope)
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Exact deliverables are confirmed during the initial definition phase based on customer
              data availability, machine interfaces, and project scope.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {service.deliverables.map((delivGroup) => (
              <div key={delivGroup.category} className="border border-border bg-card p-6">
                <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                  <FileText size={18} className="text-signal" />
                  <h3 className="font-display text-base font-bold uppercase text-foreground">
                    {delivGroup.category}
                  </h3>
                </div>
                <ul className="mt-4 space-y-2.5">
                  {delivGroup.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-xs leading-5">
                      <CheckCircle2 size={13} className="mt-1 shrink-0 text-signal" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 border-t border-border/60 pt-3">
                  <p className="text-[11px] font-mono text-muted-foreground">
                    <span className="font-bold text-foreground">Scope qualification: </span>
                    {delivGroup.scopeQualification}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: PRE-CONSULTATION CHECKLIST (What Customer Should Provide)
         ========================================================================= */}
      <section id="checklist" className="px-5 py-16 lg:px-10 lg:py-24 border-b border-border/60">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-10 max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-signal font-mono">
              PRE-CONSULTATION CHECKLIST
            </p>
            <h2 className="mt-3 font-display text-2xl font-extrabold uppercase tracking-tight sm:text-3xl lg:text-4xl">
              Information Needed From Your Engineering Team
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Preparing these baseline parameters before an engineering consultation accelerates our
              sizing and simulation work. Missing items can be addressed collaboratively.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {service.customerChecklist.map((checkGroup) => (
              <div key={checkGroup.category} className="border border-border bg-card p-6">
                <h3 className="font-display text-base font-bold uppercase tracking-tight text-foreground border-b border-border/60 pb-3">
                  {checkGroup.category}
                </h3>
                <ul className="mt-4 space-y-3">
                  {checkGroup.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-xs leading-5 text-foreground/90"
                    >
                      <div className="size-4 rounded-none border border-signal/60 bg-signal/10 grid place-items-center shrink-0 mt-0.5">
                        <CheckSquare size={11} className="text-signal" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: RELATED PRODUCTS & APPLICATION AREAS
         ========================================================================= */}
      <section className="bg-muted/20 px-5 py-16 lg:px-10 lg:py-20 border-b border-border/60">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Related Product Categories */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-signal font-mono">
                HARDWARE INTEGRATION
              </p>
              <h3 className="mt-2 font-display text-xl font-bold uppercase tracking-tight">
                Related Product Categories
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Verified hardware lines frequently specified in this service:
              </p>
              <div className="mt-6 space-y-3">
                {service.relatedProducts.map((prod) => (
                  <Link
                    key={prod.name}
                    to={prod.path as never}
                    className="flex items-center justify-between border border-border bg-card p-4 hover:border-signal transition-colors group"
                  >
                    <div>
                      <h4 className="text-xs font-bold uppercase text-foreground group-hover:text-signal transition-colors">
                        {prod.name}
                      </h4>
                      <p className="mt-1 text-[11px] text-muted-foreground">{prod.detail}</p>
                    </div>
                    <ArrowRight
                      size={14}
                      className="text-signal shrink-0 ml-3 group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                ))}
              </div>
            </div>

            {/* Related Applications */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-signal font-mono">
                INDUSTRY VERTICALS
              </p>
              <h3 className="mt-2 font-display text-xl font-bold uppercase tracking-tight">
                Related Industrial Application Sectors
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Explore dedicated sector pages and 220+ verified automation use cases:
              </p>
              <div className="mt-6 space-y-3">
                {service.relatedApplications.map((app) => (
                  <Link
                    key={app.name}
                    to={app.path as never}
                    className="flex items-center justify-between border border-border bg-card p-4 hover:border-signal transition-colors group"
                  >
                    <div>
                      <span className="font-mono text-[10px] text-signal uppercase font-bold">
                        {app.sector}
                      </span>
                      <h4 className="mt-0.5 text-xs font-bold uppercase text-foreground group-hover:text-signal transition-colors">
                        {app.name}
                      </h4>
                    </div>
                    <ArrowRight
                      size={14}
                      className="text-signal shrink-0 ml-3 group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 9: SERVICE-SPECIFIC TECHNICAL FAQS
         ========================================================================= */}
      <section className="px-5 py-16 lg:px-10 lg:py-24 border-b border-border/60">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-10 max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-signal font-mono">
              FREQUENTLY ASKED QUESTIONS
            </p>
            <h2 className="mt-3 font-display text-2xl font-extrabold uppercase tracking-tight sm:text-3xl lg:text-4xl">
              Technical &amp; Commercial Clarifications
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Direct answers regarding scope, timelines, deliverables, and engineering
              methodologies.
            </p>
          </div>

          <div className="space-y-3 max-w-4xl">
            {service.faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div key={index} className="border border-border bg-card">
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between p-5 text-left text-sm font-bold uppercase tracking-tight text-foreground hover:text-signal transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      size={16}
                      className={`shrink-0 text-muted-foreground transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-signal" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="border-t border-border/60 p-5 pt-3 text-xs leading-relaxed text-muted-foreground animate-in fade-in duration-150">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 10: FINAL SERVICE-SPECIFIC ENQUIRY CTA
         ========================================================================= */}
      <section className="technical-grid border-t border-border/50 bg-[#0B0F17] px-5 py-16 text-white lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-signal/30 bg-signal/10 px-3 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-signal">
                <span>SERVICE {service.number} INTAKE</span>
              </div>
              <h2 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl lg:text-5xl text-white">
                Initiate {service.title}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                Connect directly with an INDUS application engineer specializing in{" "}
                {service.shortTitle}. We review your load parameters, space limits, and cycle-time
                constraints to produce a tailored scope proposal.
              </p>

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

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <Button
                className="h-13 rounded-none bg-signal px-8 text-xs font-bold uppercase tracking-wider text-signal-foreground hover:bg-signal/90 shadow-[0_4px_20px_rgba(21,94,239,0.35)] cursor-pointer"
                onClick={handleDiscussService}
              >
                Schedule Technical Consultation <ArrowRight size={15} className="ml-2" />
              </Button>

              <Link
                to="/contact/engineering-enquiry"
                className="inline-flex h-13 items-center justify-center gap-2 border border-slate-700 bg-slate-900/70 px-7 text-xs font-bold uppercase tracking-wider text-slate-200 hover:border-signal hover:text-signal transition-colors text-center"
              >
                <span>Submit Detailed Spec Sheet</span>
                <FileCheck2 size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
