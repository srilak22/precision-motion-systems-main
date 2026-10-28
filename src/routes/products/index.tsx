import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ShieldCheck,
  Search,
  Wrench,
  MessageSquare,
  ChevronRight,
  Calculator,
  GitCompare,
  Cpu,
  Layers,
  Box,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { companyConfig } from "@/data/config";
import { useModals } from "@/components/modals/ModalContext";
import { TOP_LEVEL_CATEGORIES, type TopLevelCategory } from "@/data/productTaxonomy";
import { CategoryCard } from "@/components/common/CategoryCard";
import { useState, useMemo } from "react";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/products/")({
  head: () =>
    buildSeoMeta({
      title: "Industrial Robotics Product Portfolio (8 Core Categories) | INDUS Robotics",
      description:
        "Comprehensive mechatronic portfolio across 8 core product categories: Motion & Actuation, Robotic Systems, Mobility Systems, Control & Drives, Sensing & Vision, End Effectors, Mechanical Components, and Safety Systems.",
      path: "/products",
    }),
  component: ProductsIndexPage,
});

export function ProductsIndexPage() {
  const { openModal } = useModals();
  const [searchQuery, setSearchQuery] = useState("");

  const totalProducts = useMemo(() => {
    return TOP_LEVEL_CATEGORIES.reduce(
      (acc, cat) => acc + cat.groups.reduce((gAcc, g) => gAcc + g.items.length, 0),
      0
    );
  }, []);

  const totalFamilies = useMemo(() => {
    return TOP_LEVEL_CATEGORIES.reduce((acc, cat) => acc + cat.groups.length, 0);
  }, []);

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return TOP_LEVEL_CATEGORIES;
    const q = searchQuery.toLowerCase().trim();
    return TOP_LEVEL_CATEGORIES.filter((cat) => {
      const matchTitle = cat.title.toLowerCase().includes(q);
      const matchDesc = cat.description.toLowerCase().includes(q) || cat.subtitle.toLowerCase().includes(q);
      const matchStandard = cat.engineeringStandard.toLowerCase().includes(q);
      const matchGroups = cat.groups.some(
        (g) =>
          g.groupName.toLowerCase().includes(q) ||
          g.technologyDescription.toLowerCase().includes(q) ||
          g.items.some((i) => i.name.toLowerCase().includes(q) || i.specHighlight?.toLowerCase().includes(q))
      );
      return matchTitle || matchDesc || matchStandard || matchGroups;
    });
  }, [searchQuery]);

  const handleWhatsApp = () => {
    window.open(companyConfig.getWhatsAppUrl({ type: "general" }), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 1. HERO SECTION (Light Industrial Aesthetics) */}
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
            {/* Engineering Standard & Portfolio Badge */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-blue-200 bg-blue-50/80 px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF]">
                <ShieldCheck size={13} />
                <span>ISO 9283 / DIN 3990 / IEC 61800 Standards</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-100/80 px-2 py-1 text-[10px] font-mono font-semibold uppercase text-slate-600">
                <Box size={12} className="text-slate-500" />
                <span>8 Core Categories · {totalProducts} Verified Components</span>
              </span>
            </div>

            {/* Main Page Title */}
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-slate-900 leading-tight">
              Precision Motion &amp; Robotics Portfolio
            </h1>

            {/* Subtitle / Positioning */}
            <p className="mt-3 font-display text-lg sm:text-xl uppercase tracking-wide text-[#155EEF] font-bold">
              Engineering Hardware for High-Dynamic Automated Machinery
            </p>

            {/* Overview Description */}
            <p className="mt-4 max-w-3xl text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every component in the INDUS catalogue specifies real physical operating principles, traceable
              repeatability tolerances, and verified mechanical parameters. Explore 8 core categories comprising
              {totalFamilies} distinct engineering families designed for seamless multi-axis coordination.
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

      {/* 2. REAL-TIME SEARCH & CATEGORY FILTER BAR */}
      <section className="border-b border-slate-200/80 bg-slate-50/70 px-4 py-4 lg:px-8">
        <div className="mx-auto max-w-[1440px] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-lg">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across all categories, standards, or families..."
              aria-label="Search catalogue"
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-xs text-slate-900 placeholder:text-slate-400 shadow-2xs outline-none transition-colors focus:border-[#155EEF] focus:ring-1 focus:ring-[#155EEF]"
            />
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-600">
            <span>
              Showing <strong>{filteredCategories.length}</strong> of 8 Categories ({totalProducts} Products)
            </span>
          </div>
        </div>
      </section>

      {/* 3. 8 CORE CATEGORIES GRID */}
      <section className="bg-white px-4 py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-8">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[.22em] text-[#155EEF]">
              Primary Mechatronic Architecture
            </span>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-slate-900">
              8 Master Product Categories
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-600">
              Select a specialized category to explore verified model configurations, 3D CAD models, and technical specifications.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredCategories.map((category, idx) => (
              <CategoryCard key={category.id} category={category} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. ENGINEERING TOOLS QUICK SHORTCUT STRIP */}
      <section className="border-t border-slate-200/80 bg-slate-50/50 px-4 py-12 lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-6">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[.22em] text-[#155EEF]">
              Engineering Utilities
            </span>
            <h3 className="mt-1 font-display text-xl sm:text-2xl font-bold uppercase text-slate-900">
              Interactive Sizing &amp; Architecture Tools
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
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    Verify inertia ratios, gearhead backlash, and motor torque deratings online.
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
                    Side-by-Side Comparison
                  </h4>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    Evaluate torsional stiffness, backlash, and efficiency across multiple models.
                  </p>
                </div>
              </div>
            </Link>

            <Link
              to="/technology/intelligence-explorer"
              className="group rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs hover:border-[#155EEF] hover:shadow-xs transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-lg bg-blue-50 text-[#155EEF]">
                  <Cpu size={18} />
                </span>
                <div>
                  <h4 className="font-display text-sm font-bold uppercase text-slate-900 group-hover:text-[#155EEF] transition-colors">
                    Robotics Intelligence (L0–L5)
                  </h4>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    Explore five tiers of robotic autonomy from joint mechanics to cloud fleet coordination.
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. COMMERCIAL CONVERSION STRIP */}
      <section className="border-t border-slate-200/90 bg-[#0F172A] px-4 py-14 text-white lg:px-8">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-400">
              Commercial &amp; Technical Support
            </span>
            <h3 className="mt-2 font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white leading-snug">
              Require Custom Drivetrain Specifications?
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Our engineering team provides CAD integration reviews, thermal cycle validation, and OEM
              volume quotation directly backed by traceable laboratory test records.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              onClick={() => openModal("quote")}
              className="h-11 rounded-lg bg-[#155EEF] hover:bg-[#1047BF] text-white font-bold uppercase text-xs tracking-wider shadow-sm transition-all cursor-pointer"
            >
              <span>Get a Quote</span>
              <ArrowRight size={14} className="ml-1.5" />
            </Button>
            <Button
              variant="outline"
              onClick={() => openModal("engineer")}
              className="h-11 rounded-lg border-slate-600 bg-transparent text-slate-100 hover:bg-white/10 hover:border-white font-bold uppercase text-xs transition-all cursor-pointer"
            >
              <Wrench size={14} className="mr-1.5 text-sky-400" />
              <span>Talk to an Engineer</span>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
