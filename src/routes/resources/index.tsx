import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import {
  ArrowRight,
  FileText,
  Search,
  X,
  Wrench,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resourcesData } from "@/data/resources";
import { useModals } from "@/components/modals/ModalContext";
import { buildSeoMeta } from "@/lib/seo";
import { RelatedContent } from "@/components/common/RelatedContent";
import { CtaBanner } from "@/components/common/CtaBanner";

export interface ResourceSearchParams {
  q?: string | undefined;
  type?: string | undefined;
  category?: string | undefined;
  productCategory?: string | undefined;
}

export const Route = createFileRoute("/resources/")({
  validateSearch: (search: Record<string, unknown>): ResourceSearchParams => {
    return {
      q: typeof search["q"] === "string" ? (search["q"] as string) : undefined,
      type: typeof search["type"] === "string" ? (search["type"] as string) : undefined,
      category: typeof search["category"] === "string" ? (search["category"] as string) : undefined,
      productCategory:
        typeof search["productCategory"] === "string"
          ? (search["productCategory"] as string)
          : undefined,
    };
  },
  head: () =>
    buildSeoMeta({
      title: "Engineering Resource Center | INDUS Industrial Robotics",
      description:
        "Access technical specifications, datasheets, product catalogues, application notes, case studies, and engineering whitepapers for industrial robotics.",
      path: "/resources",
    }),
  component: ResourcesIndexPage,
});

function ResourcesIndexPage() {
  const searchParams = Route.useSearch();
  const navigate = Route.useNavigate();
  const { openModal } = useModals();

  const urlQuery = searchParams.q || "";
  const selectedType = searchParams.type || "all";
  const selectedCategory = searchParams.category || "all";
  const selectedProductCategory = searchParams.productCategory || "all";

  const [queryInput, setQueryInput] = useState(urlQuery);

  useEffect(() => {
    setQueryInput(urlQuery);
  }, [urlQuery]);

  const documentTypes = [
    { label: "All Document Types", value: "all" },
    { label: "Datasheets", value: "datasheet" },
    { label: "Catalogues", value: "catalogue" },
    { label: "Application Notes", value: "app-note" },
    { label: "Case Studies", value: "case-study" },
    { label: "Technical Articles", value: "article" },
    { label: "Documentation", value: "tech-doc" },
  ];

  const categoriesList = ["all", "Products", "Applications", "Technology"];
  const productCategoriesList = [
    "all",
    "Actuators",
    "Precision Reducers",
    "Robotic Wheels",
    "Robotic Arms",
    "Industrial Robots",
    "Control Systems",
  ];

  const updateFilters = (updates: Partial<ResourceSearchParams>) => {
    const nextQ = updates.q !== undefined ? updates.q.trim() : searchParams.q || "";
    const nextType = updates.type !== undefined ? updates.type : searchParams.type || "all";
    const nextCat =
      updates.category !== undefined ? updates.category : searchParams.category || "all";
    const nextProdCat =
      updates.productCategory !== undefined
        ? updates.productCategory
        : searchParams.productCategory || "all";

    navigate({
      search: {
        q: nextQ ? nextQ : undefined,
        type: nextType !== "all" ? nextType : undefined,
        category: nextCat !== "all" ? nextCat : undefined,
        productCategory: nextProdCat !== "all" ? nextProdCat : undefined,
      },
      replace: true,
    });
  };

  const handleQueryChange = (val: string) => {
    setQueryInput(val);
    updateFilters({ q: val });
  };

  const clearAllFilters = () => {
    setQueryInput("");
    navigate({
      search: {},
      replace: true,
    });
  };

  const hasActiveFilters =
    Boolean(urlQuery) ||
    selectedType !== "all" ||
    selectedCategory !== "all" ||
    selectedProductCategory !== "all";

  const filteredResources = useMemo(() => {
    const normalizedQuery = urlQuery.toLowerCase().trim();

    return resourcesData.filter((item) => {
      const matchesType = selectedType === "all" || item.documentType === selectedType;
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
      const matchesProductCat =
        selectedProductCategory === "all" || item.productCategory === selectedProductCategory;
      const matchesQuery =
        !normalizedQuery ||
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.description.toLowerCase().includes(normalizedQuery) ||
        (item.productCategory && item.productCategory.toLowerCase().includes(normalizedQuery));

      return matchesType && matchesCategory && matchesProductCat && matchesQuery;
    });
  }, [selectedType, selectedCategory, selectedProductCategory, urlQuery]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* 1. CLEAN LIGHT EDITORIAL HERO */}
      <section className="border-b border-slate-200 bg-white px-5 py-14 lg:px-10 lg:py-16">
        <div className="mx-auto max-w-[1440px] grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1">
              <span className="size-2 rounded-full bg-[#155EEF] animate-pulse" />
              <p className="text-[11px] font-mono font-bold uppercase tracking-[0.18em] text-[#155EEF]">
                Technical Documentation &amp; Engineering Data
              </p>
            </div>

            <h1 className="mt-4 font-display text-4xl font-extrabold uppercase leading-[0.98] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Engineering <span className="text-[#155EEF]">Resource Center</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
              Access verified mechanical specifications, torque curves, electrical pinouts,
              application sizing notes, and industrial robotics case studies.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button
                asChild
                className="h-11 rounded-xl bg-[#155EEF] px-6 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#1047BF] transition-all"
              >
                <Link to="/engineering-intelligence">
                  <Sparkles size={15} className="mr-2" />
                  Intelligence Center
                </Link>
              </Button>
              <Button
                variant="outline"
                className="h-11 rounded-xl border-slate-300 bg-white px-5 text-xs font-bold uppercase tracking-wider text-slate-800 hover:border-[#155EEF] hover:text-[#155EEF] cursor-pointer"
                onClick={() => openModal("engineer")}
              >
                <Wrench size={15} className="mr-2 text-[#155EEF]" />
                Request Custom CAD / Sizing
              </Button>
              <Link
                to="/resources/case-studies"
                className="inline-flex h-11 items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-bold text-slate-700 hover:border-[#155EEF] hover:text-[#155EEF] transition-colors"
              >
                Case Studies <ArrowRight size={13} />
              </Link>
              <Link
                to="/resources/faqs"
                className="inline-flex h-11 items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-bold text-slate-700 hover:border-[#155EEF] hover:text-[#155EEF] transition-colors"
              >
                FAQs <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Interactive Quick-Filter Category Cards */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-bottom-3 duration-500">
            {[
              { label: "Datasheets", type: "datasheet", desc: "Torque & pinout specs" },
              { label: "Catalogues", type: "catalogue", desc: "Full product families" },
              { label: "App Notes", type: "app-note", desc: "Sizing & integration" },
              { label: "Case Studies", type: "case-study", desc: "Field deployments" },
            ].map((card) => {
              const count = resourcesData.filter((r) => r.documentType === card.type).length;
              const isActive = selectedType === card.type;
              return (
                <button
                  key={card.type}
                  type="button"
                  onClick={() => updateFilters({ type: isActive ? "all" : card.type })}
                  className={`rounded-2xl border p-4 text-left transition-all duration-200 cursor-pointer hover:-translate-y-0.5 ${
                    isActive
                      ? "border-[#155EEF] bg-blue-50/70 shadow-sm"
                      : "border-slate-200 bg-[#F8FAFC] hover:bg-white hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      {card.label}
                    </span>
                    <span className="rounded-full bg-white border border-slate-200 px-2 py-0.5 text-[11px] font-mono font-bold text-[#155EEF]">
                      {count}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-500">{card.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. FILTER TOOLBAR */}
      <section className="border-b border-slate-200 bg-[#F4F7FB] px-5 py-6 lg:px-10">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-4 md:grid-cols-[1.5fr_1fr_1fr_1fr] items-center">
            <div className="relative">
              <Search className="absolute left-3.5 top-3 text-slate-400" size={18} />
              <Input
                value={queryInput}
                onChange={(e) => handleQueryChange(e.target.value)}
                placeholder="Search resources by keyword or product..."
                className="h-11 w-full rounded-xl border-slate-300 bg-white pl-10 pr-9 text-sm text-slate-900 focus:border-[#155EEF] focus:ring-1 focus:ring-[#155EEF] shadow-2xs outline-none"
                aria-label="Search resources by keyword"
              />
              {queryInput && (
                <button
                  type="button"
                  onClick={() => handleQueryChange("")}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
                  aria-label="Clear search input"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <label className="block">
              <span className="sr-only">Document Type</span>
              <select
                value={selectedType}
                onChange={(e) => updateFilters({ type: e.target.value })}
                className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-xs font-bold uppercase tracking-wider text-slate-800 focus:border-[#155EEF] focus:ring-1 focus:ring-[#155EEF] shadow-2xs outline-none"
                aria-label="Filter by document type"
              >
                {documentTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="sr-only">Discipline Category</span>
              <select
                value={selectedCategory}
                onChange={(e) => updateFilters({ category: e.target.value })}
                className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-xs font-bold uppercase tracking-wider text-slate-800 focus:border-[#155EEF] focus:ring-1 focus:ring-[#155EEF] shadow-2xs outline-none"
                aria-label="Filter by category"
              >
                {categoriesList.map((c) => (
                  <option key={c} value={c}>
                    {c === "all" ? "All Disciplines" : c}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="sr-only">Product Family</span>
              <select
                value={selectedProductCategory}
                onChange={(e) => updateFilters({ productCategory: e.target.value })}
                className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-xs font-bold uppercase tracking-wider text-slate-800 focus:border-[#155EEF] focus:ring-1 focus:ring-[#155EEF] shadow-2xs outline-none"
                aria-label="Filter by product family"
              >
                {productCategoriesList.map((p) => (
                  <option key={p} value={p}>
                    {p === "all" ? "All Product Families" : p}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </section>

      {/* 3. RESOURCE CARDS GRID */}
      <section className="bg-white px-5 py-12 lg:px-10 lg:py-16">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full shadow-2xs">
                Showing <span className="font-bold text-[#101B2D]">{filteredResources.length}</span>{" "}
                of {resourcesData.length} engineering documents
              </span>
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#101B2D] hover:text-[#155EEF] transition-colors cursor-pointer"
              >
                <X size={14} className="text-[#155EEF]" />
                Clear All Filters
              </button>
            )}
          </div>

          {filteredResources.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredResources.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#155EEF]/50 hover:shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <span className="rounded-md bg-blue-50 border border-blue-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#155EEF]">
                        {item.documentType}
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                        {item.fileFormat} {item.fileSizeBytes ? `· ${item.fileSizeBytes}` : ""}
                      </span>
                    </div>

                    <h3 className="mt-4 font-display text-xl font-bold uppercase tracking-wide text-[#101B2D] line-clamp-2 min-h-[3.25rem]">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-xs leading-relaxed text-slate-600 line-clamp-3 min-h-[3.5rem]">
                      {item.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-1.5 min-h-[1.75rem]">
                      {item.productCategory && (
                        <span className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-slate-600">
                          {item.productCategory}
                        </span>
                      )}
                      <span className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-slate-600">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="text-[11px] text-slate-400">Verified: {item.dateAdded}</span>

                    {item.availableOnRequest ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-lg border-slate-300 bg-white text-xs font-bold uppercase text-slate-800 hover:bg-slate-50 hover:border-[#155EEF] hover:text-[#155EEF] transition-colors cursor-pointer"
                        onClick={() => openModal("engineer", { productName: item.title })}
                      >
                        Request Copy
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="rounded-lg bg-[#155EEF] hover:bg-[#1047BF] text-xs font-bold uppercase text-white shadow-2xs transition-colors cursor-pointer"
                        onClick={() => openModal("quick", { productName: item.title })}
                      >
                        View Details
                      </Button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs sm:p-16">
              <FileText size={36} className="mx-auto text-slate-400" />
              <h3 className="mt-4 font-display text-2xl font-bold uppercase text-[#101B2D]">
                No Matching Documents Found
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
                We couldn&apos;t find technical resources matching your exact filter combination.
                Clear your filters or request customized specifications directly from our engineering
                team.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button
                  variant="outline"
                  className="rounded-xl border-slate-300 bg-white font-bold uppercase text-xs text-slate-800 cursor-pointer"
                  onClick={clearAllFilters}
                >
                  Clear Filters
                </Button>
                <Button
                  className="rounded-xl bg-[#155EEF] hover:bg-[#1047BF] font-bold uppercase text-xs text-white cursor-pointer"
                  onClick={() => openModal("engineer")}
                >
                  Request Custom Technical Documentation
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CONNECTED JOURNEY CTA BANNER */}
      <div className="mx-auto max-w-7xl px-4 lg:px-8 my-8">
        <CtaBanner
          variant="dark"
          badge="TECHNICAL SUPPORT & CAD ASSETS"
          headline="Cannot find the specific CAD model or test certificate?"
          description="Our engineering team maintains 3D STEP files, thermal dissipation curves, and ISO 9283 repeatability dossiers for every catalog actuator and reducer."
          ctaPrimary={{
            label: "Request Custom Engineering Files",
            href: "/contact/engineering-enquiry",
          }}
          ctaSecondary={{
            label: "Consult Application Engineer",
            href: "/book-consultation",
          }}
        />
      </div>

      {/* 4. CONTEXTUAL RELATED CONTENT */}
      <RelatedContent
        title="Explore Related Technical Hubs"
        items={[
          {
            sectionTitle: "Engineering Services",
            links: [
              {
                title: "Engineering Capabilities",
                description: "Application feasibility, joint kinematics, and cell design.",
                href: "/engineering-services",
              },
              {
                title: "System Integration",
                description: "Fieldbus architecture and multi-axis cell commissioning.",
                href: "/engineering-services/system-integration",
              },
            ],
          },
          {
            sectionTitle: "Industry Applications",
            links: [
              {
                title: "Automotive Manufacturing",
                description: "High-duty powertrain welding and EV battery assembly.",
                href: "/applications/automotive",
              },
              {
                title: "Electronics & Semiconductor",
                description: "Cleanroom micro-assembly and optical testing.",
                href: "/applications/electronics",
              },
              {
                title: "Packaging & Logistics",
                description: "High-speed carton sorting, case packing, and AMR fleets.",
                href: "/applications/packaging",
              },
            ],
          },
        ]}
      />
    </div>
  );
}
