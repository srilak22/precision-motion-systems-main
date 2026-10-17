import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import {
  ArrowRight,
  FileText,
  Search,
  X,
  MessageSquare,
  Wrench,
  Download,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resourcesData } from "@/data/resources";
import { companyConfig } from "@/data/config";
import { useModals } from "@/components/modals/ModalContext";
import { buildSeoMeta } from "@/lib/seo";

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

  // Local state for smooth typing input
  const [queryInput, setQueryInput] = useState(urlQuery);

  // Synchronize local input if URL query changes externally
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

  const handleWhatsApp = () => {
    window.open(companyConfig.getWhatsAppUrl({ type: "general" }), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 1. TECHNICAL HERO (Unified Brand Navy & Lime System) */}
      <section className="technical-grid border-b border-border/40 bg-surface-dark px-5 py-20 text-surface-foreground lg:px-10 lg:py-28">
        <div className="mx-auto max-w-[1440px]">
          <div className="inline-flex items-center gap-2 border border-signal/30 bg-surface-elevated/70 px-3 py-1 rounded-xs">
            <span className="size-1.5 rounded-full bg-signal shadow-[0_0_8px_rgba(180,245,20,0.9)] animate-pulse" />
            <p className="text-[11px] font-bold uppercase tracking-[.22em] text-signal">
              Technical Documentation & Engineering Data
            </p>
          </div>

          <h1 className="mt-4 font-display text-5xl font-bold uppercase leading-[.92] sm:text-6xl lg:text-7xl">
            Engineering Resource Center
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-surface-foreground/75 sm:text-lg">
            Access verified mechanical specifications, torque curves, electrical pinouts,
            application sizing notes, and case studies for industrial robotics and motion
            automation.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              className="h-11 rounded bg-signal px-6 font-bold uppercase text-signal-foreground hover:bg-[#86b800] transition-colors"
              onClick={() => openModal("engineer")}
            >
              <Wrench size={15} className="mr-2" />
              Request Custom Sizing Report
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-11 rounded border-surface-foreground/30 bg-transparent px-6 font-bold uppercase text-surface-foreground hover:bg-surface-elevated hover:text-signal"
            >
              <Link to="/resources/faqs">View FAQ Knowledge Base →</Link>
            </Button>
            <Button
              variant="outline"
              className="h-11 rounded border-surface-foreground/30 bg-transparent px-5 font-bold uppercase text-surface-foreground hover:border-signal hover:text-signal"
              onClick={handleWhatsApp}
            >
              <MessageSquare size={15} className="mr-2 text-signal" />
              Chat on WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* 2. FILTER TOOLBAR (Unified Heights, Clear Alignment, Modern Radius) */}
      <section className="border-b border-slate-200 bg-[#F7F8F6] px-5 py-6 lg:px-10">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-4 md:grid-cols-[1.5fr_1fr_1fr_1fr] items-center">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-3 text-slate-400" size={18} />
              <Input
                value={queryInput}
                onChange={(e) => handleQueryChange(e.target.value)}
                placeholder="Search resources by keyword or product..."
                className="h-11 w-full rounded border-slate-300 bg-white pl-10 pr-9 text-sm text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs outline-none"
                aria-label="Search resources by keyword"
              />
              {queryInput && (
                <button
                  type="button"
                  onClick={() => handleQueryChange("")}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-800 transition-colors"
                  aria-label="Clear search input"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Document Type Filter */}
            <label className="block">
              <span className="sr-only">Document Type</span>
              <select
                value={selectedType}
                onChange={(e) => updateFilters({ type: e.target.value })}
                className="h-11 w-full rounded border border-slate-300 bg-white px-3 text-xs font-bold uppercase tracking-wider text-slate-800 focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs outline-none"
                aria-label="Filter by document type"
              >
                {documentTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>

            {/* Discipline Category Filter */}
            <label className="block">
              <span className="sr-only">Discipline Category</span>
              <select
                value={selectedCategory}
                onChange={(e) => updateFilters({ category: e.target.value })}
                className="h-11 w-full rounded border border-slate-300 bg-white px-3 text-xs font-bold uppercase tracking-wider text-slate-800 focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs outline-none"
                aria-label="Filter by category"
              >
                {categoriesList.map((c) => (
                  <option key={c} value={c}>
                    {c === "all" ? "All Disciplines" : c}
                  </option>
                ))}
              </select>
            </label>

            {/* Product Category Filter */}
            <label className="block">
              <span className="sr-only">Product Family</span>
              <select
                value={selectedProductCategory}
                onChange={(e) => updateFilters({ productCategory: e.target.value })}
                className="h-11 w-full rounded border border-slate-300 bg-white px-3 text-xs font-bold uppercase tracking-wider text-slate-800 focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs outline-none"
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
      <section className="bg-white px-5 py-12 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-[1440px]">
          {/* Results Status Header */}
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
                className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#101B2D] hover:text-primary transition-colors cursor-pointer"
              >
                <X size={14} className="text-primary" />
                Clear All Filters
              </button>
            )}
          </div>

          {filteredResources.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredResources.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-xs transition-all duration-300 hover:border-primary hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <span className="rounded-xs bg-primary/10 border border-primary/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
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
                        className="rounded border-slate-300 bg-white text-xs font-bold uppercase text-slate-800 hover:bg-slate-50 hover:text-black transition-colors"
                        onClick={() => openModal("engineer", { productName: item.title })}
                      >
                        Request Copy
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="rounded bg-primary hover:bg-[#1a74dc] text-xs font-bold uppercase text-white shadow-2xs transition-colors"
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
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-xs sm:p-16">
              <FileText size={36} className="mx-auto text-slate-400" />
              <h3 className="mt-4 font-display text-2xl font-bold uppercase text-[#101B2D]">
                No Matching Documents Found
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
                We couldn't find technical resources matching your exact filter combination. Clear
                your filters or request customized specifications directly from our engineering
                team.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button
                  variant="outline"
                  className="rounded border-slate-300 bg-white font-bold uppercase text-xs text-slate-800"
                  onClick={clearAllFilters}
                >
                  Clear Filters
                </Button>
                <Button
                  className="rounded bg-primary hover:bg-[#1a74dc] font-bold uppercase text-xs text-white"
                  onClick={() => openModal("engineer")}
                >
                  Request Custom Technical Documentation
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
