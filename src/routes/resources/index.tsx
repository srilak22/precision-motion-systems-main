import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { ArrowRight, FileText, Search, X, MessageSquare, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resourcesData } from "@/data/resources";
import { companyConfig } from "@/data/config";
import { useModals } from "@/components/modals/ModalContext";

export interface ResourceSearchParams {
  q?: string | undefined;
  type?: string | undefined;
  category?: string | undefined;
  productCategory?: string | undefined;
}

import { buildSeoMeta } from "@/lib/seo";

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

  // Synchronize local input if URL query changes externally (e.g. Back/Forward)
  useEffect(() => {
    setQueryInput(urlQuery);
  }, [urlQuery]);

  const documentTypes = [
    { label: "All Documents", value: "all" },
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
    <div className="min-h-screen">
      {/* Hero */}
      <section className="technical-grid border-b border-border/40 bg-surface-dark px-5 py-20 text-surface-foreground lg:px-10 lg:py-28">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-[10px] font-bold uppercase tracking-[.24em] text-signal">
            Technical Knowledge Base
          </p>
          <h1 className="mt-3 font-display text-5xl font-bold uppercase leading-[.92] sm:text-6xl lg:text-7xl">
            Engineering Resource Center
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-surface-foreground/75 sm:text-lg">
            Access verified mechanical specifications, torque curves, electrical pinouts,
            application sizing notes, and case studies for industrial robotics and motion
            automation.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              asChild
              variant="outline"
              className="h-12 rounded-none border-surface-foreground/30 bg-transparent px-6 font-bold uppercase text-surface-foreground hover:bg-surface-elevated hover:text-signal"
            >
              <Link to="/resources/faqs">View FAQ Knowledge Base →</Link>
            </Button>
            <Button
              className="h-12 rounded-none bg-signal px-7 font-bold uppercase text-signal-foreground hover:bg-signal/90"
              onClick={() => openModal("engineer")}
            >
              <Wrench size={15} className="mr-2" />
              Request Custom Sizing Report
            </Button>
            <Button
              variant="outline"
              className="h-12 rounded-none border-surface-foreground/30 bg-transparent px-5 font-bold uppercase text-surface-foreground hover:border-signal hover:text-signal"
              onClick={handleWhatsApp}
            >
              <MessageSquare size={15} className="mr-2 text-signal" />
              Chat on WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* Filter Toolbar */}
      <section className="border-b border-border bg-card px-5 py-6 lg:px-10">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-4 md:grid-cols-[1.5fr_1fr_1fr_1fr] items-center">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
              <Input
                value={queryInput}
                onChange={(e) => handleQueryChange(e.target.value)}
                placeholder="Search resources by keyword..."
                className="h-11 rounded-none border-input bg-background pl-10 pr-9 text-sm"
                aria-label="Search resources by keyword"
              />
              {queryInput && (
                <button
                  type="button"
                  onClick={() => handleQueryChange("")}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
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
                className="h-11 w-full rounded-none border border-input bg-background px-3 text-xs font-bold uppercase tracking-wider text-foreground focus:border-signal"
                aria-label="Filter by document type"
              >
                {documentTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>

            {/* Category Filter */}
            <label className="block">
              <span className="sr-only">Discipline Category</span>
              <select
                value={selectedCategory}
                onChange={(e) => updateFilters({ category: e.target.value })}
                className="h-11 w-full rounded-none border border-input bg-background px-3 text-xs font-bold uppercase tracking-wider text-foreground focus:border-signal"
                aria-label="Filter by category"
              >
                {categoriesList.map((c) => (
                  <option key={c} value={c}>
                    {c === "all" ? "All Categories" : c}
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
                className="h-11 w-full rounded-none border border-input bg-background px-3 text-xs font-bold uppercase tracking-wider text-foreground focus:border-signal"
                aria-label="Filter by product family"
              >
                {productCategoriesList.map((p) => (
                  <option key={p} value={p}>
                    {p === "all" ? "All Product Lines" : p}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </section>

      {/* Resource Cards Grid */}
      <section className="px-5 py-16 lg:px-10 lg:py-24 bg-background">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-6 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Showing {filteredResources.length} of {resourcesData.length} engineering documents
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="flex items-center gap-1 font-bold uppercase tracking-wider text-signal hover:underline"
              >
                <X size={13} />
                Clear All Filters
              </button>
            )}
          </div>

          {filteredResources.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredResources.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col justify-between border border-border bg-card p-6 transition-all hover:border-signal hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-border/40 pb-3">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-signal">
                        {item.documentType}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {item.fileFormat} {item.fileSizeBytes ? `· ${item.fileSizeBytes}` : ""}
                      </span>
                    </div>

                    <h3 className="mt-4 font-display text-xl uppercase tracking-wide text-foreground">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                      {item.description}
                    </p>

                    {item.productCategory && (
                      <span className="mt-4 inline-block border border-border bg-muted/20 px-2 py-0.5 text-[9px] uppercase tracking-wider text-muted-foreground">
                        {item.productCategory}
                      </span>
                    )}
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-border/40 pt-4">
                    <span className="text-[10px] text-muted-foreground">
                      Updated: {item.dateAdded}
                    </span>

                    {item.availableOnRequest ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-none text-xs font-bold uppercase"
                        onClick={() => openModal("engineer", { productName: item.title })}
                      >
                        Request Copy
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-none text-xs font-bold uppercase"
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
            <div className="border border-border bg-card p-12 text-center">
              <FileText size={32} className="mx-auto text-muted-foreground" />
              <h3 className="mt-4 font-display text-2xl uppercase">No Matching Documents Found</h3>
              <p className="mx-auto mt-2 max-w-md text-xs text-muted-foreground">
                We couldn't find resources matching your exact filter combination. Clear your
                filters or request customized documentation directly from our engineering team.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button
                  variant="outline"
                  className="rounded-none font-bold uppercase text-xs"
                  onClick={clearAllFilters}
                >
                  Clear Filters
                </Button>
                <Button
                  className="rounded-none bg-signal font-bold uppercase text-xs text-signal-foreground hover:bg-signal/90"
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
