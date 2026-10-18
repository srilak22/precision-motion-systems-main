import React, { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Cpu,
  Download,
  ExternalLink,
  Eye,
  Factory,
  FileCheck,
  FileCode2,
  FileSpreadsheet,
  FileText,
  Filter,
  Layers,
  Lock,
  MessageSquare,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  knowledgeArticles,
  knowledgeCategories,
  KnowledgeArticle,
} from "@/data/knowledgeHub";
import {
  technicalResources,
  resourceTypesList,
  resourceCategoriesList,
  TechnicalResourceItem,
  ResourceType,
} from "@/data/technicalResources";
import {
  applicationLibraryEntries,
  applicationIndustries,
  engineeringProblems,
  ApplicationLibraryEntry,
} from "@/data/applicationLibrary";
import { companyConfig } from "@/data/config";
import { useModals } from "@/components/modals/ModalContext";
import { buildSeoMeta } from "@/lib/seo";
import { trackDigitalPresence } from "@/trackDigitalPresence";
import { trackClarityEvent } from "@/analytics/clarity";

export interface IntelligenceSearchParams {
  section?: "all" | "knowledge" | "resources" | "applications";
  q?: string;
  category?: string;
  type?: string;
  problem?: string;
  industry?: string;
}

export const Route = createFileRoute("/engineering-intelligence/")({
  validateSearch: (search: Record<string, unknown>): IntelligenceSearchParams => {
    return {
      section:
        search["section"] === "knowledge" ||
        search["section"] === "resources" ||
        search["section"] === "applications"
          ? (search["section"] as "knowledge" | "resources" | "applications")
          : "all",
      q: typeof search["q"] === "string" ? (search["q"] as string) : undefined,
      category: typeof search["category"] === "string" ? (search["category"] as string) : undefined,
      type: typeof search["type"] === "string" ? (search["type"] as string) : undefined,
      problem: typeof search["problem"] === "string" ? (search["problem"] as string) : undefined,
      industry: typeof search["industry"] === "string" ? (search["industry"] as string) : undefined,
    };
  },
  head: () =>
    buildSeoMeta({
      title: "Engineering Intelligence Center | INDUS Industrial Robotics",
      description:
        "Technical knowledge hub, verified product datasheets, 3D CAD models, integration guidelines, and industrial application engineering libraries.",
      path: "/engineering-intelligence",
    }),
  component: EngineeringIntelligenceCenterPage,
});

function EngineeringIntelligenceCenterPage() {
  const searchParams = Route.useSearch();
  const navigate = Route.useNavigate();
  const { openModal } = useModals();

  const activeSection = searchParams.section || "all";
  const urlQuery = searchParams.q || "";
  const selectedCategory = searchParams.category || "all";
  const selectedResourceType = searchParams.type || "all";
  const selectedProblem = searchParams.problem || "all";
  const selectedIndustry = searchParams.industry || "all";

  // Local state for smooth typing input
  const [queryInput, setQueryInput] = useState(urlQuery);

  useEffect(() => {
    setQueryInput(urlQuery);
  }, [urlQuery]);

  const updateFilters = (updates: Partial<IntelligenceSearchParams>) => {
    navigate({
      search: (prev) => ({
        ...prev,
        ...updates,
      }),
      replace: true,
    });
  };

  const handleSearchSubmit = (val: string) => {
    setQueryInput(val);
    updateFilters({ q: val.trim() ? val.trim() : undefined });
    if (val.trim()) {
      trackDigitalPresence("resource_search", "Intelligence Search", val.trim());
      trackClarityEvent("resource_search");
    }
  };

  const handleSectionSwitch = (sec: "all" | "knowledge" | "resources" | "applications") => {
    updateFilters({ section: sec });
    trackDigitalPresence("navigation_click", `Intelligence Tab - ${sec}`, sec);
    trackClarityEvent("navigation_click");
  };

  const clearAllFilters = () => {
    setQueryInput("");
    navigate({
      search: { section: activeSection },
      replace: true,
    });
  };

  // -------------------------------------------------------------
  // Filtered Knowledge Articles
  // -------------------------------------------------------------
  const filteredArticles = useMemo(() => {
    return knowledgeArticles.filter((item) => {
      if (selectedCategory !== "all" && item.categorySlug !== selectedCategory) {
        return false;
      }
      if (urlQuery) {
        const q = urlQuery.toLowerCase();
        const inTitle = item.title.toLowerCase().includes(q);
        const inSummary = item.summary.toLowerCase().includes(q);
        const inTags = item.tags.some((t) => t.toLowerCase().includes(q));
        const inStandards = item.standardsReferenced.some((s) => s.toLowerCase().includes(q));
        if (!inTitle && !inSummary && !inTags && !inStandards) return false;
      }
      return true;
    });
  }, [selectedCategory, urlQuery]);

  // -------------------------------------------------------------
  // Filtered Technical Resources
  // -------------------------------------------------------------
  const filteredResources = useMemo(() => {
    return technicalResources.filter((item) => {
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false;
      }
      if (selectedResourceType !== "all" && item.resourceType !== selectedResourceType) {
        return false;
      }
      if (urlQuery) {
        const q = urlQuery.toLowerCase();
        const inTitle = item.title.toLowerCase().includes(q);
        const inRef = item.refCode.toLowerCase().includes(q);
        const inDesc = item.description.toLowerCase().includes(q);
        const inProd = item.associatedProductName?.toLowerCase().includes(q);
        if (!inTitle && !inRef && !inDesc && !inProd) return false;
      }
      return true;
    });
  }, [selectedCategory, selectedResourceType, urlQuery]);

  // -------------------------------------------------------------
  // Filtered Applications
  // -------------------------------------------------------------
  const filteredApplications = useMemo(() => {
    return applicationLibraryEntries.filter((item) => {
      if (selectedIndustry !== "all" && item.industrySlug !== selectedIndustry) {
        return false;
      }
      if (selectedProblem !== "all" && item.problemSlug !== selectedProblem) {
        return false;
      }
      if (urlQuery) {
        const q = urlQuery.toLowerCase();
        const inTitle = item.title.toLowerCase().includes(q);
        const inStatement = item.problemStatement.toLowerCase().includes(q);
        const inIndustry = item.industry.toLowerCase().includes(q);
        const inProblem = item.engineeringProblem.toLowerCase().includes(q);
        const inProducts = item.associatedProducts.some((p) => p.name.toLowerCase().includes(q));
        if (!inTitle && !inStatement && !inIndustry && !inProblem && !inProducts) return false;
      }
      return true;
    });
  }, [selectedIndustry, selectedProblem, urlQuery]);

  // Request modal trigger
  const handleRequestResource = (res: TechnicalResourceItem) => {
    trackDigitalPresence(
      "resource_enquiry_click",
      `Resource Request: ${res.refCode}`,
      res.title,
    );
    trackClarityEvent("resource_enquiry_click");
    openModal("engineer");
  };

  const handleApplicationEnquiry = (app: ApplicationLibraryEntry) => {
    trackDigitalPresence("application_view", app.title, app.industry);
    trackDigitalPresence("resource_enquiry_click", `App Enquiry: ${app.title}`, app.engineeringProblem);
    trackClarityEvent("resource_enquiry_click");
    openModal("engineer");
  };

  const handleWhatsApp = () => {
    trackDigitalPresence("whatsapp_click", "Intelligence Center WhatsApp", "General Query");
    trackClarityEvent("whatsapp_click");
    window.open(companyConfig.getWhatsAppUrl({ type: "general" }), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <section className="technical-grid border-b border-border/40 bg-surface-dark px-5 py-16 text-surface-foreground lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="inline-flex items-center gap-2 rounded bg-signal/15 border border-signal/30 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-signal">
            <Sparkles size={13} />
            <span>Industrial Robotics &bull; Technical Architecture</span>
          </div>

          <h1 className="mt-4 font-display text-4xl font-extrabold uppercase leading-[.92] text-white sm:text-5xl lg:text-6xl">
            Engineering Intelligence Center
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-relaxed text-surface-foreground/80 sm:text-lg">
            A centralized destination for machine design engineers: access peer-reviewed technical
            whitepapers, verified component specifications, 3D CAD models, and real-world industrial
            application frameworks.
          </p>

          {/* Quick Metrics Bar */}
          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-border/40 pt-8 sm:grid-cols-4 max-w-4xl">
            <div className="border-l-2 border-signal pl-4">
              <span className="font-mono text-2xl font-bold text-white">5</span>
              <span className="block text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Technical Papers
              </span>
            </div>
            <div className="border-l-2 border-[#2388FF] pl-4">
              <span className="font-mono text-2xl font-bold text-white">20+</span>
              <span className="block text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Verified Resources
              </span>
            </div>
            <div className="border-l-2 border-emerald-400 pl-4">
              <span className="font-mono text-2xl font-bold text-white">8</span>
              <span className="block text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Industry Solutions
              </span>
            </div>
            <div className="border-l-2 border-purple-400 pl-4">
              <span className="font-mono text-2xl font-bold text-white">100%</span>
              <span className="block text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Traceable Data
              </span>
            </div>
          </div>

          {/* Search Bar Input */}
          <div className="mt-10 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                type="text"
                placeholder="Search articles, document codes (e.g. DS-ACT-LIN), formulas, or engineering topics..."
                value={queryInput}
                onChange={(e) => handleSearchSubmit(e.target.value)}
                className="h-13 rounded-none border-border/60 bg-surface-elevated/70 pl-11 pr-10 text-sm text-white placeholder:text-muted-foreground focus-visible:border-signal"
              />
              {queryInput && (
                <button
                  type="button"
                  onClick={() => handleSearchSubmit("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Section Navigation Switcher Tabs */}
          <div className="mt-10 flex flex-wrap gap-2 border-b border-border/40 pb-px">
            <button
              type="button"
              onClick={() => handleSectionSwitch("all")}
              className={`flex items-center gap-2 border-b-2 px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider transition-all ${
                activeSection === "all"
                  ? "border-signal text-signal bg-surface-elevated/40"
                  : "border-transparent text-muted-foreground hover:border-border hover:text-white"
              }`}
            >
              <Layers size={14} />
              <span>01. All Intelligence</span>
            </button>

            <button
              type="button"
              onClick={() => handleSectionSwitch("knowledge")}
              className={`flex items-center gap-2 border-b-2 px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider transition-all ${
                activeSection === "knowledge"
                  ? "border-signal text-signal bg-surface-elevated/40"
                  : "border-transparent text-muted-foreground hover:border-border hover:text-white"
              }`}
            >
              <BookOpen size={14} />
              <span>02. Knowledge Hub ({knowledgeArticles.length})</span>
            </button>

            <button
              type="button"
              onClick={() => handleSectionSwitch("resources")}
              className={`flex items-center gap-2 border-b-2 px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider transition-all ${
                activeSection === "resources"
                  ? "border-signal text-signal bg-surface-elevated/40"
                  : "border-transparent text-muted-foreground hover:border-border hover:text-white"
              }`}
            >
              <FileCheck size={14} />
              <span>03. Technical Resource Library ({technicalResources.length})</span>
            </button>

            <button
              type="button"
              onClick={() => handleSectionSwitch("applications")}
              className={`flex items-center gap-2 border-b-2 px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider transition-all ${
                activeSection === "applications"
                  ? "border-signal text-signal bg-surface-elevated/40"
                  : "border-transparent text-muted-foreground hover:border-border hover:text-white"
              }`}
            >
              <Factory size={14} />
              <span>04. Application Library ({applicationLibraryEntries.length})</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION A: ENGINEERING KNOWLEDGE HUB
      ======================================================== */}
      {(activeSection === "all" || activeSection === "knowledge") && (
        <section id="knowledge-hub" className="border-b border-border/40 px-5 py-16 lg:px-10 lg:py-20">
          <div className="mx-auto max-w-[1440px]">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-border/60 pb-6">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-signal">
                  Section 01 &bull; Peer-Reviewed Papers
                </span>
                <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-foreground sm:text-4xl">
                  Engineering Knowledge Hub
                </h2>
                <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
                  In-depth mathematical analyses, kinematic derivations, and integration protocols covering robotics fundamentals, vector drives, fieldbuses, and gearhead contact mechanics.
                </p>
              </div>

              {/* Category Filter Chips */}
              <div className="flex flex-wrap gap-2">
                {knowledgeCategories.map((cat) => (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => {
                      updateFilters({ category: cat.slug });
                      trackDigitalPresence("resource_filter", "Knowledge Category", cat.name);
                    }}
                    className={`rounded px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider transition-all ${
                      selectedCategory === cat.slug
                        ? "bg-foreground text-background"
                        : "border border-border bg-card text-muted-foreground hover:border-signal hover:text-foreground"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Articles Grid */}
            {filteredArticles.length === 0 ? (
              <div className="mt-12 rounded-lg border border-dashed border-border p-12 text-center">
                <FileText className="mx-auto size-12 text-muted-foreground/60" />
                <h3 className="mt-4 font-display text-lg font-bold uppercase text-foreground">
                  No Technical Papers Match Your Filter
                </h3>
                <p className="mt-2 text-xs text-muted-foreground">
                  Try adjusting your search keywords or reset category filters.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-5 rounded-none font-mono text-xs uppercase"
                  onClick={clearAllFilters}
                >
                  Reset Knowledge Filters
                </Button>
              </div>
            ) : (
              <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredArticles.map((article) => (
                  <div
                    key={article.id}
                    className="group flex flex-col justify-between border border-border bg-card p-6 shadow-xs transition-all hover:border-signal hover:shadow-lg"
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex items-center justify-between border-b border-border/40 pb-3">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-signal">
                          {article.category}
                        </span>
                        <span className="inline-flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
                          <Clock size={11} />
                          {article.readingTimeMinutes} min
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="mt-4 font-display text-xl font-bold uppercase leading-snug text-foreground group-hover:text-signal transition-colors">
                        {article.title}
                      </h3>

                      <p className="mt-2 text-xs font-medium text-signal">
                        {article.subtitle}
                      </p>

                      <p className="mt-3 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                        {article.summary}
                      </p>

                      {/* Standards Chips */}
                      <div className="mt-4 flex flex-wrap gap-1.5 border-t border-border/40 pt-3">
                        {article.standardsReferenced.map((std) => (
                          <span
                            key={std}
                            className="rounded bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
                          >
                            {std}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Author & Read Action */}
                    <div className="mt-6 border-t border-border/40 pt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="grid size-6 place-items-center rounded bg-muted font-mono text-[10px] font-bold text-foreground">
                          {article.author.name.charAt(0)}
                        </div>
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {article.author.name}
                        </span>
                      </div>

                      <Link
                        to="/engineering-intelligence/articles/$slug"
                        params={{ slug: article.slug }}
                        className="inline-flex items-center gap-1 text-xs font-mono font-bold uppercase text-signal hover:underline"
                      >
                        Read Paper <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ========================================================
          SECTION B: TECHNICAL RESOURCE LIBRARY
      ======================================================== */}
      {(activeSection === "all" || activeSection === "resources") && (
        <section id="technical-resources" className="border-b border-border/40 bg-muted/20 px-5 py-16 lg:px-10 lg:py-20">
          <div className="mx-auto max-w-[1440px]">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-border/60 pb-6">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#2388FF]">
                  Section 02 &bull; Authorized Technical Documentation
                </span>
                <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-foreground sm:text-4xl">
                  Technical Resource Library
                </h2>
                <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
                  Verified product datasheets, dimensional 2D drawings, 3D CAD STEP solids, and integration manuals directly tied to INDUS component dossiers.
                </p>
              </div>

              {/* Resource Type Filter Selector */}
              <div className="flex flex-wrap gap-2">
                {resourceTypesList.map((rt) => (
                  <button
                    key={rt.value}
                    type="button"
                    onClick={() => {
                      updateFilters({ type: rt.value });
                      trackDigitalPresence("resource_filter", "Resource Type", rt.label);
                    }}
                    className={`rounded px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider transition-all ${
                      selectedResourceType === rt.value
                        ? "bg-[#2388FF] text-white"
                        : "border border-border bg-card text-muted-foreground hover:border-[#2388FF] hover:text-foreground"
                    }`}
                  >
                    {rt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Resources Cards Grid */}
            {filteredResources.length === 0 ? (
              <div className="mt-12 rounded-lg border border-dashed border-border p-12 text-center bg-card">
                <FileCheck className="mx-auto size-12 text-muted-foreground/60" />
                <h3 className="mt-4 font-display text-lg font-bold uppercase text-foreground">
                  No Technical Resources Match Your Filter
                </h3>
                <p className="mt-2 text-xs text-muted-foreground">
                  Try searching a different reference code or clear the type filter.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-5 rounded-none font-mono text-xs uppercase"
                  onClick={clearAllFilters}
                >
                  Reset Resource Filters
                </Button>
              </div>
            ) : (
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredResources.map((res) => (
                  <div
                    key={res.id}
                    className="flex flex-col justify-between border border-border bg-card p-6 shadow-xs transition-all hover:border-[#2388FF] hover:shadow-md"
                  >
                    <div>
                      {/* Top Bar with Ref Code & Verification */}
                      <div className="flex items-center justify-between border-b border-border/40 pb-3">
                        <span className="font-mono text-xs font-bold text-foreground">
                          {res.refCode}
                        </span>
                        <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 font-mono text-[9px] font-bold text-emerald-600">
                          {res.verificationLevel}
                        </span>
                      </div>

                      {/* Resource Type & Category */}
                      <div className="mt-3 flex items-center gap-2">
                        <span className="rounded bg-muted px-2 py-0.5 font-mono text-[10px] font-semibold text-muted-foreground">
                          {res.resourceTypeLabel}
                        </span>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          &bull; {res.category}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h4 className="mt-3 font-display text-lg font-bold uppercase text-foreground leading-snug">
                        {res.title}
                      </h4>

                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                        {res.description}
                      </p>

                      {/* Technical Specs Footer */}
                      <div className="mt-4 space-y-1.5 border-t border-border/40 pt-3 text-[11px] font-mono text-muted-foreground">
                        <div className="flex items-center justify-between">
                          <span>Format & Size:</span>
                          <span className="font-bold text-foreground">{res.format} &bull; {res.fileSizeBytes}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Revision:</span>
                          <span>{res.version} ({res.releaseDate})</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Traceability:</span>
                          <span className="truncate max-w-[160px] text-right" title={res.traceableSource}>
                            {res.traceableSource}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions Bar */}
                    <div className="mt-6 border-t border-border/40 pt-4 flex items-center justify-between gap-2">
                      <Button
                        size="sm"
                        className="w-full rounded-none bg-signal font-mono text-xs font-bold uppercase text-signal-foreground hover:bg-signal/90"
                        onClick={() => handleRequestResource(res)}
                      >
                        <Lock size={12} className="mr-1.5" />
                        Request File Access
                      </Button>

                      {res.associatedProductId && res.productCategorySlug && (
                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                          className="rounded-none border-border font-mono text-xs uppercase"
                        >
                          <Link
                            to="/products/$category/$id"
                            params={{
                              category: res.productCategorySlug,
                              id: res.associatedProductId,
                            }}
                          >
                            Specs
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ========================================================
          SECTION C: APPLICATION LIBRARY
      ======================================================== */}
      {(activeSection === "all" || activeSection === "applications") && (
        <section id="application-library" className="border-b border-border/40 px-5 py-16 lg:px-10 lg:py-20">
          <div className="mx-auto max-w-[1440px]">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-border/60 pb-6">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-emerald-500">
                  Section 03 &bull; Industrial Engineering Solutions
                </span>
                <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-foreground sm:text-4xl">
                  Application Engineering Library
                </h2>
                <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
                  Organized by manufacturing vertical and mechanical challenge: inspect real constraint envelopes, multi-axis hardware architectures, and test verification standards.
                </p>
              </div>

              {/* Dual Filter: Industry Sector */}
              <div className="flex flex-wrap gap-2">
                {applicationIndustries.map((ind) => (
                  <button
                    key={ind.slug}
                    type="button"
                    onClick={() => {
                      updateFilters({ industry: ind.slug });
                      trackDigitalPresence("resource_filter", "App Industry", ind.name);
                    }}
                    className={`rounded px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider transition-all ${
                      selectedIndustry === ind.slug
                        ? "bg-emerald-600 text-white"
                        : "border border-border bg-card text-muted-foreground hover:border-emerald-500 hover:text-foreground"
                    }`}
                  >
                    {ind.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Problem Filter Bar */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground mr-2 font-semibold">
                Filter by Problem:
              </span>
              {engineeringProblems.map((pr) => (
                <button
                  key={pr.slug}
                  type="button"
                  onClick={() => {
                    updateFilters({ problem: pr.slug });
                    trackDigitalPresence("resource_filter", "Engineering Problem", pr.name);
                  }}
                  className={`rounded px-2.5 py-1 font-mono text-[11px] transition-all ${
                    selectedProblem === pr.slug
                      ? "bg-foreground text-background font-bold"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {pr.name}
                </button>
              ))}
            </div>

            {/* Application Cards */}
            {filteredApplications.length === 0 ? (
              <div className="mt-12 rounded-lg border border-dashed border-border p-12 text-center bg-card">
                <Factory className="mx-auto size-12 text-muted-foreground/60" />
                <h3 className="mt-4 font-display text-lg font-bold uppercase text-foreground">
                  No Applications Match Your Selection
                </h3>
                <p className="mt-2 text-xs text-muted-foreground">
                  Try selecting "All Industries" or "All Engineering Problems".
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-5 rounded-none font-mono text-xs uppercase"
                  onClick={clearAllFilters}
                >
                  Reset Application Filters
                </Button>
              </div>
            ) : (
              <div className="mt-8 space-y-8">
                {filteredApplications.map((app) => (
                  <div
                    key={app.id}
                    className="rounded-lg border border-border bg-card p-6 lg:p-8 shadow-xs transition-all hover:border-emerald-500"
                  >
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/40 pb-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded bg-muted px-2.5 py-1 font-mono text-xs font-bold uppercase tracking-wider text-foreground">
                          {app.industry}
                        </span>
                        <span className="rounded bg-signal/15 border border-signal/30 px-2.5 py-1 font-mono text-xs font-bold text-signal">
                          {app.engineeringProblem}
                        </span>
                      </div>

                      {/* Project Type Badge */}
                      <div>
                        {app.projectType === "Documented Real Project" ? (
                          <span className="inline-flex items-center gap-1.5 rounded bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 font-mono text-xs font-bold text-emerald-600">
                            <CheckCircle2 size={13} />
                            Documented Real Project
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded bg-amber-500/10 border border-amber-500/30 px-3 py-1 font-mono text-xs font-bold text-amber-600">
                            <ShieldAlert size={13} />
                            Illustrative Engineering Example
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Title & Statement */}
                    <h3 className="mt-4 font-display text-2xl font-bold uppercase text-foreground">
                      {app.title}
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {app.problemStatement}
                    </p>

                    {/* Mechanical Constraints Grid */}
                    <div className="mt-6 grid gap-6 md:grid-cols-2">
                      <div className="rounded border border-border/60 bg-muted/40 p-4">
                        <span className="font-mono text-xs font-bold uppercase tracking-wider text-foreground block mb-2">
                          Operational Constraints & Loads
                        </span>
                        <ul className="space-y-1.5 text-xs text-muted-foreground">
                          {app.mechanicalConstraints.map((c, cIdx) => (
                            <li key={cIdx} className="flex items-start gap-2">
                              <span className="mt-1 size-1.5 rounded-full bg-signal shrink-0" />
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Recommended Architecture */}
                      <div className="rounded border border-border/60 bg-muted/40 p-4">
                        <span className="font-mono text-xs font-bold uppercase tracking-wider text-foreground block mb-2">
                          Hardware Architecture
                        </span>
                        <div className="space-y-2 text-xs">
                          {app.recommendedArchitecture.map((arch, aIdx) => (
                            <div key={aIdx} className="border-b border-border/40 pb-2 last:border-b-0 last:pb-0">
                              <strong className="text-foreground block">{arch.stage}</strong>
                              <span className="text-muted-foreground">{arch.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Products & Enquiry Action */}
                    <div className="mt-6 border-t border-border/40 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      {/* Products Pills */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs text-muted-foreground font-semibold">
                          Associated Components:
                        </span>
                        {app.associatedProducts.map((p) => (
                          <Link
                            key={p.id}
                            to="/products/$category/$id"
                            params={{ category: p.categorySlug, id: p.id }}
                            className="rounded border border-border bg-card px-2.5 py-1 text-xs font-mono font-medium text-foreground hover:border-signal hover:text-signal transition-colors"
                          >
                            {p.name} &rarr;
                          </Link>
                        ))}
                      </div>

                      {/* Enquiry Action Button */}
                      <Button
                        className="rounded-none bg-signal px-6 font-mono text-xs font-bold uppercase text-signal-foreground hover:bg-signal/90"
                        onClick={() => handleApplicationEnquiry(app)}
                      >
                        <Wrench size={13} className="mr-1.5" />
                        Discuss Sector Requirements
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Engineering Consultation Callout */}
      <section className="border-t border-border/40 bg-surface-dark px-5 py-20 text-surface-foreground lg:px-10">
        <div className="mx-auto max-w-[1200px] rounded-lg border border-signal/40 bg-surface-elevated/40 p-8 lg:p-12 shadow-2xl">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-signal">
                Engineering Consultation
              </span>
              <h3 className="mt-2 font-display text-3xl font-extrabold uppercase text-white sm:text-4xl">
                Ready to Validate Your Motion Architecture?
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-surface-foreground/80 sm:text-base">
                Submit your kinematics model, load profiles, or fieldbus communication parameters. Our technical specialists review motor inertia ratios, gearbox lost motion, and thermal margins.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 lg:justify-end">
              <Button
                className="h-12 rounded-none bg-signal px-8 font-bold uppercase text-signal-foreground hover:bg-signal/90"
                onClick={() => {
                  trackDigitalPresence("resource_enquiry_click", "Footer Consult Engineer", "Intelligence Center");
                  trackClarityEvent("resource_enquiry_click");
                  openModal("engineer");
                }}
              >
                <Wrench size={15} className="mr-2" />
                Consult Application Engineer
              </Button>
              <Button
                variant="outline"
                className="h-12 rounded-none border-surface-foreground/30 bg-transparent px-6 font-bold uppercase text-surface-foreground hover:border-signal hover:text-signal"
                onClick={handleWhatsApp}
              >
                <MessageSquare size={15} className="mr-2 text-signal" />
                WhatsApp Us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
