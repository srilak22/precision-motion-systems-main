import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import React from "react";
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
  Compass,
  ChevronDown,
  HelpCircle,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getApplication, applicationsData } from "@/data/applications";
import { getApplicationBySlug } from "@/data/applicationsUniverse";
import { getSegmentSolution } from "@/data/segmentsData";
import { companyConfig } from "@/data/config";
import { useModals } from "@/components/modals/ModalContext";
import { RelatedContent } from "@/components/common/RelatedContent";
import { CtaBanner } from "@/components/common/CtaBanner";
import { ApplicationUseCasesExplorer } from "@/components/applications/ApplicationUseCasesExplorer";
import { VerticalHero } from "@/components/applications/vertical/VerticalHero";
import { VerticalMetricsBar } from "@/components/applications/vertical/VerticalMetricsBar";
import { VerticalUseCasesGrid } from "@/components/applications/vertical/VerticalUseCasesGrid";
import { VerticalConfigurator } from "@/components/applications/vertical/VerticalConfigurator";
import { getVerticalPreset } from "@/components/applications/vertical/verticalCatalog";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/applications/$applicationId")({
  loader: ({ params }) => {
    let application = getApplication(params.applicationId);
    if (!application) {
      const area = getApplicationBySlug(params.applicationId);
      if (area) {
        application = getApplication(area.id);
      }
    }
    if (!application) {
      throw notFound();
    }
    const segment = getSegmentSolution(params.applicationId) || getSegmentSolution(application.id);
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

  const preset = getVerticalPreset(application.id || (application as any).slug || "");

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#1D4ED8] selection:text-white antialiased">
      {/* =========================================================================
          A. HERO SECTION (Above the Fold - Light Theme)
         ========================================================================= */}
      <VerticalHero
        title={`${application.title} Robotics`}
        subtitle={application.shortDescription || application.heroSubtitle}
        badge="MANUFACTURING AUTOMATION VERTICAL"
        tagline={preset.heroTagline}
        heroImage={preset.heroImage}
        workcellName={preset.workcellName}
        metrics={preset.metrics}
      />

      {/* =========================================================================
          B. KEY METRICS & BENCHMARKS BAR (Clean White Cards, Blue Text)
         ========================================================================= */}
      <VerticalMetricsBar metrics={preset.metrics} />

      {/* =========================================================================
          C. ROBOTIC APPLICATIONS GALLERY (Grid Layout with High-Res Imagery)
         ========================================================================= */}
      <VerticalUseCasesGrid
        title={`Robotic Applications in ${application.title}`}
        subtitle={`Turnkey robotic workcells, kinematic metrics, and operational architectures deployed across modern ${application.title.toLowerCase()} manufacturing plants.`}
        cards={preset.galleryCards}
      />

      {/* =========================================================================
          D. INTERACTIVE ROBOT CONFIGURATOR & SPEC SELECTOR
         ========================================================================= */}
      <VerticalConfigurator
        title={`Select Your ${application.title} Automation Requirement`}
        subtitle="Toggle between core automation processes to inspect matching kinematic models, payload capacities, cycle times, and directly download engineering CAD files."
        options={preset.configOptions}
      />

      {/* =========================================================================
          E. RESEARCHED INDUSTRIAL USE CASES (Deep Dive Explorer)
         ========================================================================= */}
      {application.useCases && application.useCases.length > 0 && (
        <div className="bg-[#F8FAFC] border-b border-slate-200">
          <ApplicationUseCasesExplorer
            applicationTitle={application.title}
            useCases={application.useCases}
          />
        </div>
      )}

      {/* =========================================================================
          F. COMPARATIVE ANALYSIS (Industry Hurdles vs Robotic Opportunity)
         ========================================================================= */}
      <section className="bg-white px-4 sm:px-6 lg:px-8 py-16 sm:py-20 border-b border-slate-200">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-mono font-bold text-[#1D4ED8] uppercase mb-3 shadow-2xs">
              <span>// COMPARATIVE ANALYSIS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Manufacturing Challenges &amp; Robotic Solutions
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              Comparing conventional production bottlenecks against deterministic multi-axis robotic automation.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 items-stretch">
            {/* Column 1: Challenges (Clean White Surface with subtle amber warning cue) */}
            <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-7 sm:p-9 shadow-sm hover:border-slate-300 transition-all">
              <div>
                <div className="inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1 text-amber-800">
                  <AlertOctagon size={15} className="text-amber-600" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
                    Industry Bottlenecks
                  </span>
                </div>
                <h3 className="mt-4 text-xl sm:text-2xl font-bold text-slate-900">
                  {application.automationChallenges.title}
                </h3>
                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-600">
                  {application.automationChallenges.description}
                </p>
                <div className="mt-6 border-t border-slate-100 pt-5">
                  <ul className="space-y-3">
                    {application.automationChallenges.points.map((pt) => (
                      <li key={pt} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-amber-500" />
                        <span className="leading-snug">{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Column 2: Solutions (Clean White Card with Primary Blue Accent Bar) */}
            <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-blue-200 bg-white p-7 sm:p-9 shadow-sm hover:border-[#1D4ED8] transition-all">
              <div className="absolute inset-x-0 top-0 h-1.5 bg-[#1D4ED8]" />
              <div>
                <div className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1 text-[#1D4ED8]">
                  <CheckCircle2 size={15} className="text-[#1D4ED8]" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
                    Robotic Automation Potential
                  </span>
                </div>
                <h3 className="mt-4 text-xl sm:text-2xl font-bold text-slate-900">
                  {application.roboticOpportunity.title}
                </h3>
                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-600">
                  {application.roboticOpportunity.description}
                </p>
                <div className="mt-6 border-t border-slate-100 pt-5">
                  <ul className="space-y-3">
                    {application.roboticOpportunity.points.map((pt) => (
                      <li key={pt} className="flex items-start gap-2.5 text-xs sm:text-sm font-medium text-slate-800">
                        <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#1D4ED8]" />
                        <span className="leading-snug">{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          G. CONNECTED JOURNEY CTA BANNER
         ========================================================================= */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-10">
        <CtaBanner
          variant="precision"
          badge="APPLICATION SIZING &amp; FEASIBILITY"
          headline={`Accelerate ${application.title} Automation`}
          description="Access our specialized kinematics sizing tools, discuss payload vs cycle takt trade-offs, and receive 3D CAD space-claim models verified for this manufacturing discipline."
          ctaPrimary={{
            label: "Schedule Application Review",
            href: "/book-consultation",
          }}
          ctaSecondary={{
            label: "Open Sizing Calculator",
            href: "/application-finder",
          }}
        />
      </div>

      {/* =========================================================================
          H. CONTEXTUAL RELATED CONTENT
         ========================================================================= */}
      <div className="bg-white">
        <RelatedContent
          title="Other Manufacturing Sectors"
          items={[
            {
              sectionTitle: "Related Industrial Sectors",
              links: applicationsData
                .filter((a) => a.id !== application.id)
                .slice(0, 3)
                .map((a) => ({
                  title: a.title,
                  description: a.heroSubtitle,
                  href: `/applications/${a.id}`,
                })),
            },
          ]}
        />
      </div>
    </div>
  );
}
