import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  AlertOctagon,
  MessageSquare,
  Wrench,
  FileText,
  Factory,
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
  Cpu,
  Cog,
  Activity,
  Gauge,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getApplication, applicationsData } from "@/data/applications";
import { getSegmentSolution } from "@/data/segmentsData";
import { companyConfig } from "@/data/config";
import { useModals } from "@/components/modals/ModalContext";
import { RelatedContent } from "@/components/common/RelatedContent";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/applications/$applicationId")({
  loader: ({ params }) => {
    const application = getApplication(params.applicationId);
    const segment = getSegmentSolution(params.applicationId);
    if (!application && !segment) {
      throw notFound();
    }
    return { application, segment };
  },
  head: ({ loaderData }) => {
    const application = loaderData?.application;
    const segment = loaderData?.segment;
    return buildSeoMeta({
      title: `${segment?.title || application?.title || "Industry"} Automation Solutions | INDUS`,
      description:
        segment?.subtitle ||
        application?.heroSubtitle ||
        application?.shortDescription ||
        "Automated industrial motion applications and robotic cells.",
      path: `/applications/${application?.id || segment?.slug || ""}`,
      ogType: "article",
    });
  },
  component: ApplicationDetailPage,
});

function ApplicationDetailPage() {
  const { application, segment } = Route.useLoaderData();
  const { openModal } = useModals();

  const handleWhatsApp = () => {
    window.open(
      companyConfig.getWhatsAppUrl({ type: "application", name: application.title }),
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* 1. HERO WITH BREADCRUMBS */}
      <section className="technical-grid border-b border-border/40 bg-surface-dark px-5 py-20 text-surface-foreground lg:px-10 lg:py-28">
        <div className="mx-auto max-w-[1440px]">
          {/* Breadcrumb Navigation */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-surface-foreground/60"
          >
            <Link to="/" className="hover:text-signal transition-colors">
              Home
            </Link>
            <ChevronRight size={13} className="text-surface-foreground/30" />
            <Link to="/applications" className="hover:text-signal transition-colors">
              Applications
            </Link>
            <ChevronRight size={13} className="text-surface-foreground/30" />
            <span className="text-signal">{application.title}</span>
          </nav>

          <div className="mt-6 inline-flex items-center gap-2 border border-signal/30 bg-surface-elevated/70 px-3 py-1 rounded-xs">
            <span className="size-1.5 rounded-full bg-signal shadow-[0_0_8px_rgba(180,245,20,0.9)] animate-pulse" />
            <p className="text-[11px] font-bold uppercase tracking-[.22em] text-signal">
              Manufacturing Automation Vertical
            </p>
          </div>

          <h1 className="mt-4 font-display text-5xl font-bold uppercase leading-[.92] sm:text-6xl lg:text-7xl">
            {application.title}
          </h1>

          <p className="mt-4 font-display text-xl uppercase tracking-wide text-signal sm:text-2xl">
            {application.heroSubtitle}
          </p>

          <p className="mt-6 max-w-3xl text-base leading-8 text-surface-foreground/75 sm:text-lg">
            {application.shortDescription}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              className="h-12 rounded bg-signal px-7 font-bold uppercase text-signal-foreground hover:bg-[#86b800] transition-colors"
              onClick={() =>
                openModal("engineer", { categoryName: `${application.title} Application` })
              }
            >
              <Wrench size={15} className="mr-2" />
              Discuss {application.title} Automation
            </Button>
            <Button
              variant="outline"
              className="h-12 rounded border-surface-foreground/30 bg-transparent px-6 font-bold uppercase text-surface-foreground hover:bg-surface-elevated hover:text-signal"
              onClick={() => openModal("quote", { productName: `${application.title} Systems` })}
            >
              Request Quote
            </Button>
            <Button
              variant="outline"
              className="h-12 rounded border-surface-foreground/30 bg-transparent px-5 font-bold uppercase text-surface-foreground hover:border-signal hover:text-signal"
              onClick={handleWhatsApp}
            >
              <MessageSquare size={14} className="mr-1.5 text-signal" />
              WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* 2. INDUSTRY OVERVIEW (MARKET CONTEXT) */}
      <section className="border-b border-slate-200 bg-[#F7F8F6] px-5 py-16 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-[1360px]">
          <div className="max-w-4xl">
            <span className="rounded-xs bg-[#95CC00]/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.2em] text-[#111A30]">
              Market Context & Challenges
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-tight text-[#111A30] sm:text-4xl">
              Industry Manufacturing Overview
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-700 sm:text-lg">
              {application.industryOverview}
            </p>
          </div>
        </div>
      </section>

      {/* 3. CHALLENGES & ROBOTIC OPPORTUNITIES (UNIFIED CARD DESIGN) */}
      <section className="bg-white px-5 py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-12 max-w-3xl">
            <span className="text-[10px] font-bold uppercase tracking-[.22em] text-slate-500">
              Comparative Analysis
            </span>
            <h2 className="mt-2 font-display text-4xl font-bold uppercase tracking-tight text-[#111A30] sm:text-5xl">
              Manufacturing Challenges & Robotic Solutions
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              Comparing conventional production bottlenecks against deterministic multi-axis robotic
              automation.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 items-stretch">
            {/* Column 1: Challenges (Consistent White Surface, Restrained Warning Cue) */}
            <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-8 shadow-xs transition-all hover:border-slate-300 sm:p-10">
              <div>
                <div className="inline-flex items-center gap-2 rounded border border-amber-200 bg-amber-50 px-3 py-1 text-amber-800">
                  <AlertOctagon size={16} className="text-amber-600" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    Industry Bottlenecks
                  </span>
                </div>
                <h3 className="mt-5 font-display text-2xl font-bold uppercase tracking-tight text-[#111A30] sm:text-3xl">
                  {application.automationChallenges.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                  {application.automationChallenges.description}
                </p>
                <div className="mt-6 border-t border-slate-100 pt-6">
                  <ul className="space-y-3.5">
                    {application.automationChallenges.points.map((pt) => (
                      <li key={pt} className="flex items-start gap-3 text-sm text-slate-700">
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-amber-500" />
                        <span className="leading-snug">{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Column 2: Solutions (Unified White Card with Lime Accent Indicator) */}
            <div className="relative flex flex-col justify-between overflow-hidden rounded-xl border-2 border-[#95CC00]/50 bg-white p-8 shadow-sm transition-all hover:border-[#95CC00] sm:p-10">
              <div className="absolute inset-x-0 top-0 h-1.5 bg-[#95CC00]" />
              <div>
                <div className="inline-flex items-center gap-2 rounded border border-[#95CC00]/30 bg-[#95CC00]/10 px-3 py-1 text-[#111A30]">
                  <CheckCircle2 size={16} className="text-[#95CC00]" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    Robotic Automation Potential
                  </span>
                </div>
                <h3 className="mt-5 font-display text-2xl font-bold uppercase tracking-tight text-[#111A30] sm:text-3xl">
                  {application.roboticOpportunity.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                  {application.roboticOpportunity.description}
                </p>
                <div className="mt-6 border-t border-slate-100 pt-6">
                  <ul className="space-y-3.5">
                    {application.roboticOpportunity.points.map((pt) => (
                      <li
                        key={pt}
                        className="flex items-start gap-3 text-sm font-medium text-slate-800"
                      >
                        <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#95CC00]" />
                        <span className="leading-snug">{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Technologies Chips */}
          <div className="mt-12 rounded-lg border border-slate-200 bg-[#F7F8F6] p-6">
            <span className="block text-[11px] font-bold uppercase tracking-[.18em] text-slate-500">
              Recommended Technologies for {application.title}
            </span>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {application.recommendedTechnologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#111A30] shadow-2xs hover:border-[#95CC00] hover:text-[#95CC00] transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3B. SEGMENT-SPECIFIC PRODUCTION TASKS & ENGINEERING CONSTRAINTS */}
      {segment && (
        <section className="border-y border-border/40 bg-card px-5 py-20 lg:px-10 lg:py-24">
          <div className="mx-auto max-w-[1440px]">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="rounded-xs bg-signal/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.2em] text-foreground">
                  {segment.badge}
                </span>
                <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">
                  {segment.title}: Production Tasks &amp; Engineering Constraints
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                  {segment.overview}
                </p>
              </div>

              {/* Key Standards Badges */}
              <div className="rounded border border-border bg-background p-3.5 space-y-1.5 shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-signal block">
                  Applicable Industry Standards
                </span>
                <ul className="space-y-1">
                  {segment.keyStandards.map((std) => (
                    <li key={std} className="flex items-center gap-1.5 text-xs font-mono text-foreground">
                      <ShieldCheck size={12} className="text-signal shrink-0" />
                      <span>{std}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Production Tasks Grid */}
            <div className="mt-10 space-y-8">
              {segment.productionTasks.map((task, tIdx) => (
                <div
                  key={tIdx}
                  className="rounded-xl border border-border bg-background p-6 lg:p-8 shadow-sm hover:border-signal/70 transition-all"
                >
                  <div className="border-b border-border/50 pb-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-mono font-bold uppercase text-signal">
                        Production Task 0{tIdx + 1}
                      </span>
                      <span className="rounded bg-muted px-2.5 py-0.5 text-[10px] font-mono text-muted-foreground uppercase">
                        Rigorous Engineering Specification
                      </span>
                    </div>
                    <h3 className="mt-2 font-display text-2xl font-bold uppercase tracking-wide text-foreground">
                      {task.taskName}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                      {task.description}
                    </p>
                  </div>

                  {/* Required Technology Chips */}
                  <div className="mt-4 pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-signal">
                      Required Technology &amp; Hardware:
                    </span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {task.requiredTechnology.map((tech) => (
                        <span
                          key={tech}
                          className="rounded border border-signal/30 bg-surface-elevated/40 px-3 py-1 font-mono text-xs font-semibold text-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 5-Dimensional Engineering Constraints Grid */}
                  <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    {/* Mechanical Constraints */}
                    <div className="rounded border border-border/70 bg-card p-3.5 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-signal">
                        <Cog size={13} />
                        <span>Mechanical</span>
                      </div>
                      <p className="text-xs text-foreground/80 leading-relaxed font-mono">
                        {task.mechanicalConstraints}
                      </p>
                    </div>

                    {/* Motion Requirements */}
                    <div className="rounded border border-border/70 bg-card p-3.5 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-signal">
                        <Activity size={13} />
                        <span>Motion Dynamics</span>
                      </div>
                      <p className="text-xs text-foreground/80 leading-relaxed font-mono">
                        {task.motionRequirements}
                      </p>
                    </div>

                    {/* Control Architecture */}
                    <div className="rounded border border-border/70 bg-card p-3.5 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-signal">
                        <Cpu size={13} />
                        <span>Control Arch</span>
                      </div>
                      <p className="text-xs text-foreground/80 leading-relaxed font-mono">
                        {task.controlArchitecture}
                      </p>
                    </div>

                    {/* Safety Considerations */}
                    <div className="rounded border border-border/70 bg-card p-3.5 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-amber-500">
                        <AlertOctagon size={13} />
                        <span>Safety Design</span>
                      </div>
                      <p className="text-xs text-foreground/80 leading-relaxed font-mono">
                        {task.safetyConsiderations}
                      </p>
                    </div>

                    {/* Verification Method */}
                    <div className="rounded border border-border/70 bg-card p-3.5 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-signal">
                        <ShieldCheck size={13} />
                        <span>Verification</span>
                      </div>
                      <p className="text-xs text-foreground/80 leading-relaxed font-mono">
                        {task.verificationMethod}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* System-Level Architecture Breakdown */}
            <div className="mt-10 rounded-xl border-2 border-signal/30 bg-surface-dark p-6 sm:p-8 text-surface-foreground">
              <span className="text-[10px] font-bold uppercase tracking-[.22em] text-signal">
                System-Level Engineering Blueprint
              </span>
              <h3 className="mt-2 font-display text-2xl font-bold uppercase sm:text-3xl">
                {segment.title} System Specifications
              </h3>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="border-l-2 border-signal pl-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-surface-foreground/60">
                    Mechanical Envelope
                  </span>
                  <p className="mt-1 text-xs text-surface-foreground/90 font-mono leading-relaxed">
                    {segment.systemLevelArchitecture.mechanicalEnvelope}
                  </p>
                </div>
                <div className="border-l-2 border-signal pl-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-surface-foreground/60">
                    Fieldbus Topology
                  </span>
                  <p className="mt-1 text-xs text-surface-foreground/90 font-mono leading-relaxed">
                    {segment.systemLevelArchitecture.fieldbusTopology}
                  </p>
                </div>
                <div className="border-l-2 border-signal pl-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-surface-foreground/60">
                    Safety Integrity
                  </span>
                  <p className="mt-1 text-xs text-surface-foreground/90 font-mono leading-relaxed">
                    {segment.systemLevelArchitecture.safetyIntegrity}
                  </p>
                </div>
                <div className="border-l-2 border-signal pl-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-surface-foreground/60">
                    Throughput Target
                  </span>
                  <p className="mt-1 text-xs text-surface-foreground/90 font-mono leading-relaxed">
                    {segment.systemLevelArchitecture.throughputTarget}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. SYSTEM ARCHITECTURE & WORKFLOW (TECHNICAL GRID SECTION) */}
      <section className="technical-grid border-y border-border/40 bg-[#111A30] px-5 py-20 text-white lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-12 max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[.24em] text-signal">
              Process Topology
            </p>
            <h2 className="mt-2 font-display text-4xl font-bold uppercase tracking-tight sm:text-5xl">
              System Architecture Workflow
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-surface-foreground/70">
              Deterministic handshakes between robotic arms, transfer axes, machine vision, and
              central plant controllers.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {application.systemArchitecture.map((step) => (
              <div
                key={step.step}
                className="rounded-lg border border-white/10 bg-[#18233e] p-6 transition-all hover:border-signal/80 hover:bg-[#1e2c4f]"
              >
                <span className="font-display text-3xl font-bold text-signal">{step.step}</span>
                <h3 className="mt-3 font-display text-xl uppercase tracking-wide text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-xs leading-5 text-white/70">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TYPICAL TASKS & RELEVANT HARDWARE */}
      <section className="bg-[#F7F8F6] px-5 py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Typical Tasks */}
            <div>
              <span className="rounded-xs bg-[#95CC00]/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[.2em] text-[#111A30]">
                Tasks Automated
              </span>
              <h3 className="mt-2 font-display text-3xl font-bold uppercase text-[#111A30]">
                Typical Automation Tasks in {application.title}
              </h3>
              <ul className="mt-6 space-y-3">
                {application.typicalApplications.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-2xs"
                  >
                    <span className="size-2 rounded-full bg-signal" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800 sm:text-sm">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Relevant Hardware */}
            <div>
              <span className="rounded-xs bg-[#95CC00]/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[.2em] text-[#111A30]">
                Hardware Catalog
              </span>
              <h3 className="mt-2 font-display text-3xl font-bold uppercase text-[#111A30]">
                Relevant Robotic Components
              </h3>
              <div className="mt-6 space-y-3">
                {application.relevantProducts.map((p) => (
                  <Link
                    key={p.name}
                    to={p.href}
                    className="group block rounded-lg border border-slate-200 bg-white p-4 shadow-2xs transition-all hover:border-signal hover:shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-display text-lg uppercase text-[#111A30] group-hover:text-signal transition-colors">
                        {p.name}
                      </p>
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] uppercase font-semibold text-slate-600">
                        {p.category}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-600">{p.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Integrated Engineering CTA Box */}
          <div className="mt-16 rounded-xl border border-slate-200 bg-white p-8 text-center shadow-xs sm:p-12">
            <h3 className="font-display text-3xl font-bold uppercase text-[#111A30]">
              Plan Your {application.title} Automation Cell
            </h3>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
              Our application engineers review cycle times, payload envelopes, and integration
              requirements to recommend the exact kinematic configuration.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button
                asChild
                className="h-11 rounded bg-signal px-6 font-bold uppercase text-signal-foreground hover:bg-[#86b800] transition-colors"
              >
                <Link to="/book-consultation">
                  <Calendar size={15} className="mr-2" />
                  Book Application Review
                </Link>
              </Button>
              <Button
                variant="outline"
                className="h-11 rounded border-slate-300 bg-white px-6 font-bold uppercase text-slate-800 hover:bg-slate-50"
                onClick={() => openModal("quote", { productName: `${application.title} Systems` })}
              >
                Request Quote
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CONTEXTUAL RELATED CONTENT */}
      <RelatedContent
        title="Other Manufacturing Sectors"
        items={[
          {
            sectionTitle: "Related Applications",
            links: applicationsData
              .filter((a) => a.id !== application.id)
              .slice(0, 3)
              .map((a) => ({
                title: a.title,
                description: a.shortDescription,
                href: `/applications/${a.id}`,
              })),
          },
          {
            sectionTitle: "Turnkey Solutions",
            links: [
              {
                title: "Factory Automation",
                description: "Modular production cells and transfer conveyors.",
                href: "/solutions/factory-automation",
              },
              {
                title: "Mobile Robotics",
                description: "AMR and AGV autonomous material distribution.",
                href: "/solutions/mobile-robotics",
              },
              {
                title: "Smart Manufacturing",
                description: "OPC UA telemetry and predictive analytics.",
                href: "/solutions/smart-manufacturing",
              },
            ],
          },
        ]}
      />
    </div>
  );
}
