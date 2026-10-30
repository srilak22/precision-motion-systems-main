import React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Factory,
  MessageSquare,
  Wrench,
  Search,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { all18ApplicationsData } from "@/data/applications";
import { companyConfig } from "@/data/config";
import { useModals } from "@/components/modals/ModalContext";
import { buildSeoMeta } from "@/lib/seo";
import { RelatedContent } from "@/components/common/RelatedContent";

export const Route = createFileRoute("/applications/")({
  head: () =>
    buildSeoMeta({
      title: "18 Industrial Robotics Application Areas | INDUS Robotics",
      description:
        "Explore 18 industrial manufacturing and robotics sectors with 221 verified engineering use cases: Automotive, Aerospace, Semiconductor, Mining, Medical, Packaging, and Humanoids.",
      path: "/applications",
    }),
  component: ApplicationsIndexPage,
});

export function ApplicationsIndexPage() {
  const { openModal } = useModals();
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredApplications = React.useMemo(() => {
    if (!searchQuery.trim()) return all18ApplicationsData;
    const q = searchQuery.toLowerCase().trim();
    return all18ApplicationsData.filter(
      (app) =>
        app.title.toLowerCase().includes(q) ||
        app.shortDescription.toLowerCase().includes(q) ||
        app.heroSubtitle.toLowerCase().includes(q) ||
        app.typicalApplications.some((t) => t.toLowerCase().includes(q))
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
            <span className="text-[#155EEF] font-bold">Industries &amp; Verticals</span>
          </nav>

          <div className="max-w-4xl">
            {/* Standard Badge */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-blue-200 bg-blue-50/80 px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF]">
                <ShieldCheck size={13} />
                <span>Industry Sectors &amp; Manufacturing Verticals</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-100/80 px-2 py-1 text-[10px] font-mono font-semibold uppercase text-slate-600">
                <Building2 size={12} className="text-slate-500" />
                <span>18 Verified Sectors · 221 Use Cases</span>
              </span>
            </div>

            {/* Title */}
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-slate-900 leading-tight">
              Industry Sectors &amp; Manufacturing Verticals
            </h1>

            {/* Subtitle */}
            <p className="mt-3 font-display text-lg sm:text-xl uppercase tracking-wide text-[#155EEF] font-bold">
              Engineering Automation Tailored to Real-World Manufacturing Constraints
            </p>

            {/* Description */}
            <p className="mt-4 max-w-3xl text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every manufacturing vertical has distinct cycle takt times, contamination limits, and
              mechanical loading environments. We engineer automation hardware tailored specifically
              to these real-world industrial constraints.
            </p>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button
                onClick={() => openModal("engineer")}
                className="h-11 rounded-lg bg-[#155EEF] px-6 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#1047BF] shadow-xs transition-all cursor-pointer"
              >
                <Wrench size={14} className="mr-1.5" />
                <span>Discuss Industry Requirements</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleWhatsApp}
                className="h-11 rounded-lg border-slate-200 bg-white px-4 text-xs font-bold uppercase tracking-wider text-[#16A34A] hover:border-[#16A34A] hover:bg-emerald-50/50 shadow-2xs transition-all cursor-pointer"
              >
                <MessageSquare size={14} className="mr-1.5" />
                <span>WhatsApp Desk</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SEARCH & STATS BAR */}
      <section className="border-b border-slate-200/80 bg-slate-50/70 px-4 py-4 lg:px-8">
        <div className="mx-auto max-w-[1440px] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-lg">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vertical, task, or manufacturing process..."
              aria-label="Search applications"
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-xs text-slate-900 placeholder:text-slate-400 shadow-2xs outline-none transition-colors focus:border-[#155EEF] focus:ring-1 focus:ring-[#155EEF]"
            />
          </div>

          <div className="text-xs font-mono text-slate-600">
            Showing <strong>{filteredApplications.length}</strong> of {all18ApplicationsData.length} Sectors
          </div>
        </div>
      </section>

      {/* 3. APPLICATION CARDS GRID (Standardized Card Architecture) */}
      <section className="bg-white px-4 py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredApplications.map((app, idx) => {
              const useCaseCount = app.useCases?.length || 12;
              return (
                <article
                  key={app.id}
                  className="group relative flex h-full flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-6 shadow-xs transition-all duration-200 ease-out hover:-translate-y-1 hover:border-[#155EEF]/50 hover:shadow-md"
                >
                  <div>
                    {/* Header Strip */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <span className="rounded bg-blue-50 border border-blue-100 px-2 py-0.5 font-mono text-[10px] font-bold text-[#155EEF] uppercase">
                        SECTOR {idx < 9 ? `0${idx + 1}` : idx + 1}
                      </span>
                      <span className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 font-mono text-[10px] font-bold text-slate-700">
                        {useCaseCount} Use Cases
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="mt-4 font-display text-xl font-bold uppercase tracking-tight text-slate-900 group-hover:text-[#155EEF] transition-colors leading-snug">
                      <Link
                        to="/applications/$applicationId"
                        params={{ applicationId: app.id }}
                        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF] rounded"
                      >
                        {app.title}
                      </Link>
                    </h2>

                    {/* Subtitle */}
                    <p className="mt-1.5 text-xs font-semibold text-[#155EEF] leading-snug">
                      {app.heroSubtitle}
                    </p>

                    {/* Description */}
                    <p className="mt-3 text-xs leading-relaxed text-slate-600 line-clamp-3">
                      {app.shortDescription}
                    </p>

                    {/* Typical Applications Pills */}
                    {app.typicalApplications && app.typicalApplications.length > 0 && (
                      <div className="mt-4 border-t border-slate-100 pt-3">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-2">
                          Key Workflows
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {app.typicalApplications.slice(0, 3).map((work, wIdx) => (
                            <span
                              key={wIdx}
                              className="rounded bg-slate-50 border border-slate-100 px-2 py-0.5 text-[10px] text-slate-700 font-medium"
                            >
                              {work}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Footer: Primary & Secondary Actions */}
                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                    <Link
                      to="/applications/$applicationId"
                      params={{ applicationId: app.id }}
                      className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#155EEF] hover:text-[#1047BF] transition-colors group/link"
                    >
                      <span>Explore Sector</span>
                      <ArrowRight
                        size={12}
                        className="transition-transform duration-200 group-hover/link:translate-x-1"
                      />
                    </Link>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openModal("engineer", { categoryName: app.title })}
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
              Sector Engineering Solutions
            </span>
            <h3 className="mt-2 font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white leading-snug">
              Need Sizing Support for Your Specific Factory Task?
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
              From sub-micron semiconductor packaging to high-payload automotive spot welding,
              our automation engineering team provides custom kinematics sizing and cycle simulation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              onClick={() => openModal("engineer")}
              className="h-11 rounded-lg bg-[#155EEF] hover:bg-[#1047BF] text-white font-bold uppercase text-xs tracking-wider shadow-sm transition-all cursor-pointer"
            >
              <Wrench size={14} className="mr-1.5" />
              <span>Talk to an Application Engineer</span>
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

      {/* 5. CROSS-SECTION REFERENCE */}
      <RelatedContent
        title="Cross-Disciplinary Engineering &amp; Resources"
        items={[
          {
            sectionTitle: "Engineering Services",
            links: [
              {
                title: "Engineering Services Hub",
                description: "Application feasibility, joint mechatronics, and custom kinematics.",
                href: "/engineering-services",
              },
              {
                title: "System Integration",
                description: "Mechanical, electrical, and control boundaries for production cells.",
                href: "/engineering-services/system-integration",
              },
              {
                title: "Technical Specifications",
                description: "Torque, speed, payload, and repeatability by product family.",
                href: "/engineering-services/technical-specifications",
              },
            ],
          },
          {
            sectionTitle: "Resources & Sizing",
            links: [
              {
                title: "Kinematic Sizing Calculators",
                description: "Ball screw, reducer inertia ratio, and wrist moment formulas.",
                href: "/technology/calculators",
              },
              {
                title: "Application Case Studies",
                description: "Documented integration projects and customer application notes.",
                href: "/resources/case-studies",
              },
              {
                title: "Technical Documentation",
                description: "Verified datasheets, wiring diagrams, and component manuals.",
                href: "/resources",
              },
            ],
          },
        ]}
      />
    </div>
  );
}
