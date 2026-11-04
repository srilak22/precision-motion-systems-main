import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ShieldCheck,
  Search,
  MessageSquare,
  ChevronRight,
  GitCompare,
  Box,
  CheckCircle2,
  SlidersHorizontal,
  X,
  Filter,
  Calculator,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { companyConfig } from "@/data/config";
import { useModals } from "@/components/modals/ModalContext";
import { TOP_LEVEL_CATEGORIES } from "@/data/productTaxonomy";
import { CategoryCard } from "@/components/common/CategoryCard";
import {
  FLAGSHIP_PRODUCTS,
  getFlagshipCategories,
  type FlagshipProduct,
  type StockStatus,
} from "@/data/flagshipCatalogue";
import { FlagshipProductCard } from "@/components/products/FlagshipProductCard";
import { useState, useMemo } from "react";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/products/")({
  head: () =>
    buildSeoMeta({
      title: "Flagship Robotics Product Portfolio (25 Models) | INDUS Robotics",
      description:
        "Engineered robotics components across 25 verified flagship models: zero-backlash reducers, guided actuators, collaborative & industrial robots, omnidirectional wheels, and deterministic motion controllers.",
      path: "/products",
    }),
  component: ProductsIndexPage,
});

export function ProductsIndexPage() {
  const { openModal } = useModals();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedAvailability, setSelectedAvailability] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "category" | "availability">("name");

  // Get distinct categories with counts from the 25 flagship models
  const flagshipCategories = useMemo(() => getFlagshipCategories(), []);

  // Filter and sort the 25 flagship models
  const filteredProducts = useMemo(() => {
    let result = [...FLAGSHIP_PRODUCTS];

    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.productName.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.applications.some((app) => app.toLowerCase().includes(q)) ||
          p.specifications.some(
            (s) => s.label.toLowerCase().includes(q) || s.value.toLowerCase().includes(q)
          )
      );
    }

    // 2. Category Filter
    if (selectedCategory !== "all") {
      result = result.filter((p) => p.categorySlug === selectedCategory);
    }

    // 3. Availability Filter
    if (selectedAvailability !== "all") {
      result = result.filter((p) => p.stockStatus === selectedAvailability);
    }

    // 4. Sorting
    result.sort((a, b) => {
      if (sortBy === "name") {
        return a.productName.localeCompare(b.productName);
      }
      if (sortBy === "category") {
        return a.category.localeCompare(b.category);
      }
      if (sortBy === "availability") {
        return b.availableQuantity - a.availableQuantity;
      }
      return 0;
    });

    return result;
  }, [searchQuery, selectedCategory, selectedAvailability, sortBy]);

  const hasActiveFilters =
    searchQuery.trim() !== "" || selectedCategory !== "all" || selectedAvailability !== "all";

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedAvailability("all");
    setSortBy("name");
  };

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
            <span className="text-[#155EEF] font-bold">Products</span>
          </nav>

          <div className="max-w-4xl">
            {/* Standard & Portfolio Badge */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-blue-200 bg-blue-50/80 px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF]">
                <ShieldCheck size={13} />
                <span>DIN 3990 / ISO 9283 / IEC 61800 Standards</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-100/80 px-2.5 py-1 text-[11px] font-mono font-semibold uppercase text-slate-700">
                <Box size={12} className="text-slate-500" />
                <span>25 Active Flagship Models · 100% Unique Imagery</span>
              </span>
            </div>

            {/* Main Page Title */}
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-slate-900 leading-tight">
              Flagship Robotics Hardware Portfolio
            </h1>

            {/* Subtitle */}
            <p className="mt-3 font-display text-lg sm:text-xl uppercase tracking-wide text-[#155EEF] font-bold">
              Precision Kinematics, Actuation &amp; Intelligent Automation
            </p>

            {/* Overview Description */}
            <p className="mt-4 max-w-3xl text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every model in the INDUS flagship portfolio is backed by verified physical operating parameters,
              traceable DIN/ISO certifications, and live inventory allocations. Review technical specifications,
              configure order quantities, and request instant engineering quotations.
            </p>

            {/* Primary Action Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button
                onClick={() => openModal("quote")}
                className="h-11 rounded-lg bg-[#155EEF] px-6 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#1047BF] shadow-xs transition-all cursor-pointer"
              >
                <span>Request Commercial Quote</span>
                <ArrowRight size={14} className="ml-1.5" />
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-11 rounded-lg border-slate-300 bg-white px-5 text-xs font-bold uppercase tracking-wider text-slate-800 hover:border-[#155EEF] hover:text-[#155EEF] hover:bg-blue-50/50 shadow-2xs transition-all cursor-pointer"
              >
                <Link to="/products/compare">
                  <GitCompare size={14} className="mr-1.5 text-slate-600" />
                  <span>Decision Matrix Compare</span>
                </Link>
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

      {/* 2. REAL-TIME SEARCH, DISCOVERY & FILTERING BAR (Phase 9) */}
      <section className="sticky top-16 z-20 border-b border-slate-200/90 bg-white/95 backdrop-blur-md px-4 py-4 lg:px-8 shadow-xs">
        <div className="mx-auto max-w-[1440px] space-y-3">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-xl">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by product name, SKU (e.g. SHD-20), category, or application..."
                aria-label="Search product catalogue"
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-10 pr-4 text-xs text-slate-900 placeholder:text-slate-400 shadow-2xs outline-none transition-colors focus:bg-white focus:border-[#155EEF] focus:ring-1 focus:ring-[#155EEF]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label="Clear search input"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Filter Dropdowns & Sort Controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Category Dropdown */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-mono text-slate-500 uppercase">Category:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-700 shadow-2xs outline-none focus:border-[#155EEF]"
                  aria-label="Filter by category"
                >
                  <option value="all">All Categories ({FLAGSHIP_PRODUCTS.length})</option>
                  {flagshipCategories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name} ({c.count})
                    </option>
                  ))}
                </select>
              </div>

              {/* Availability Dropdown */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-mono text-slate-500 uppercase">Availability:</span>
                <select
                  value={selectedAvailability}
                  onChange={(e) => setSelectedAvailability(e.target.value)}
                  className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-700 shadow-2xs outline-none focus:border-[#155EEF]"
                  aria-label="Filter by availability"
                >
                  <option value="all">All Availability</option>
                  <option value="In Stock">In Stock</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Made to Order">Made to Order</option>
                </select>
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-mono text-slate-500 uppercase">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-700 shadow-2xs outline-none focus:border-[#155EEF]"
                  aria-label="Sort products"
                >
                  <option value="name">Product Name</option>
                  <option value="category">Category</option>
                  <option value="availability">Highest Stock</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Bar & Results Count */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-slate-600">
                Displaying <strong>{filteredProducts.length}</strong> of {FLAGSHIP_PRODUCTS.length} flagship models
              </span>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer ml-2"
                >
                  <X size={12} /> Clear all filters
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500">
              <span className="flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                <span>Real-Time Inventory Monitored</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 25 FLAGSHIP PRODUCTS GRID */}
      <section className="bg-white px-4 py-12 lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          {filteredProducts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center my-8">
              <div className="mx-auto grid size-12 place-items-center rounded-full bg-slate-100 text-slate-500 mb-3">
                <Search size={22} />
              </div>
              <h3 className="font-display text-lg font-bold uppercase text-slate-800">
                No matching product models found
              </h3>
              <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
                No hardware components matched "{searchQuery}". Try searching for specific gear types like "Harmonic", "SCARA", "Mecanum", or "EtherCAT".
              </p>
              <button
                onClick={clearAllFilters}
                className="mt-4 rounded-lg bg-[#155EEF] px-4 py-2 text-xs font-bold uppercase text-white hover:bg-[#1047BF] transition-colors"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((prod, idx) => (
                <FlagshipProductCard key={prod.productId} product={prod} priority={idx < 4} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. MASTER 8 ARCHITECTURE CATEGORIES (Taxonomy Reference) */}
      <section className="border-t border-slate-200/90 bg-slate-50/50 px-4 py-14 lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-8">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[.22em] text-[#155EEF]">
              Comprehensive Engineering Taxonomy
            </span>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-slate-900">
              8 Core Mechatronic Categories
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-600 max-w-2xl">
              Beyond our 25 flagship models, INDUS maintains deep engineering documentation, kinematic envelopes,
              and CAD STEP assets across all 8 foundational industrial disciplines.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TOP_LEVEL_CATEGORIES.map((category, idx) => (
              <CategoryCard key={category.id} category={category} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. ENGINEERING SIZING SHORTCUTS */}
      <section className="border-t border-slate-200/80 bg-white px-4 py-12 lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-6">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[.22em] text-[#155EEF]">
              Engineering Utilities
            </span>
            <h3 className="mt-1 font-display text-xl sm:text-2xl font-bold uppercase text-slate-900">
              Interactive Kinematic Sizing &amp; Architecture Tools
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Link
              to="/technology/calculators"
              className="group rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs hover:border-[#155EEF] hover:shadow-xs transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-lg bg-blue-50 text-[#155EEF]">
                  <Calculator size={18} />
                </span>
                <div>
                  <h4 className="font-display text-sm font-bold uppercase text-slate-900 group-hover:text-[#155EEF] transition-colors">
                    Kinematic Sizing Calculators
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Calculate motor torque, inertia ratios, and duty cycle thermal loads.
                  </p>
                </div>
              </div>
            </Link>

            <Link
              to="/products/compare"
              className="group rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs hover:border-[#155EEF] hover:shadow-xs transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-lg bg-blue-50 text-[#155EEF]">
                  <GitCompare size={18} />
                </span>
                <div>
                  <h4 className="font-display text-sm font-bold uppercase text-slate-900 group-hover:text-[#155EEF] transition-colors">
                    Side-by-Side Compare Matrix
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Compare torsional stiffness, backlash arcmin, and envelope dimensions.
                  </p>
                </div>
              </div>
            </Link>

            <div
              onClick={() => openModal("engineer")}
              className="group rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs hover:border-[#155EEF] hover:shadow-xs transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-lg bg-emerald-50 text-[#16A34A]">
                  <ShieldCheck size={18} />
                </span>
                <div>
                  <h4 className="font-display text-sm font-bold uppercase text-slate-900 group-hover:text-[#155EEF] transition-colors">
                    Direct Application Engineering
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Collaborate directly with our senior robotic motion engineers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProductsIndexPage;
