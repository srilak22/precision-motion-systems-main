import { createFileRoute, Link } from "@tanstack/react-router";
import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  Bot,
  Box,
  Calendar,
  ChevronDown,
  CircuitBoard,
  Cpu,
  FileText,
  Gauge,
  MessageSquare,
  Move3d,
  Search,
  Settings2,
  ShieldCheck,
  Zap,
  Calculator,
  GitCompare,
  Layers,
  Sparkles,
  SlidersHorizontal,
  RotateCcw,
  CheckCircle2,
  X,
  Compass,
  Building2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FadeUp, StaggerContainer, StaggerItem, HoverMotion } from "@/components/ui/motion";
import { categories, faqs, products, type Product } from "@/data/robotics";
import { TOP_LEVEL_CATEGORIES } from "@/data/productTaxonomy";
import { companyConfig } from "@/data/config";
import { useModals } from "@/components/modals/ModalContext";
import { ProductCard } from "@/components/common/ProductCard";
import { IndusMotionStudio } from "@/components/engineering/IndusMotionStudio";
import { InteractiveRobotAnatomy } from "@/components/engineering/InteractiveRobotAnatomy";
import { IndusAutomationNavigator } from "@/components/engineering/IndusAutomationNavigator";
import { ManufacturingRoiCalculator } from "@/components/engineering/ManufacturingRoiCalculator";
import { HeroBackgroundSlider } from "@/components/home/HeroBackgroundSlider";
import { IndustrialShowcase } from "@/components/home/IndustrialShowcase";
import { trackDigitalPresence } from "@/trackDigitalPresence";
import { trackClarityEvent } from "@/analytics/clarity";
import heroImage from "@/assets/robotics-hero.jpg";
import componentsImage from "@/assets/robotic-components.jpg";
import armImage from "@/assets/robotic-arm-cell.jpg";
import mobileImage from "@/assets/mobile-robotics.jpg";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () =>
    buildSeoMeta({
      title: "INDUS Industrial Robotics — Precision Motion & Automation Technology",
      description:
        "Discover robotic components, precision reducers, actuators, motion control, and connected industrial automation technology engineered for manufacturing performance.",
      path: "/",
      image: "/assets/robotics-hero.jpg",
    }),
  component: HomePage,
});

const featuredApplicationCards = [
  {
    title: "Automotive & EV",
    desc: "Body welding, sub-assembly, powertrain, and EV battery pack assembly lines.",
    img: armImage,
    slug: "automotive",
    badge: "13 Use Cases",
  },
  {
    title: "Electronics & Semiconductor",
    desc: "Sub-micron wafer handling, cleanroom assembly, PCB testing, and micro-dispensing.",
    img: armImage,
    slug: "electronics",
    badge: "13 Use Cases",
  },
  {
    title: "Aerospace & Defence",
    desc: "Composite component milling, automated rivet inspection, and engine blade finishing.",
    img: componentsImage,
    slug: "aerospace-defence",
    badge: "12 Use Cases",
  },
  {
    title: "Metal Fabrication & Machining",
    desc: "CNC machine tending, heavy robotic welding, foundry deburring, and press brake feeding.",
    img: componentsImage,
    slug: "metal-fabrication-machining",
    badge: "12 Use Cases",
  },
  {
    title: "Warehousing & Intralogistics",
    desc: "Autonomous mobile robots (AMR), high-speed sortation, palletizing, and ASRS shuttles.",
    img: mobileImage,
    slug: "warehousing-intralogistics",
    badge: "12 Use Cases",
  },
  {
    title: "Food & Pharmaceutical",
    desc: "IP69K washdown delta picking, sterile syringe assembly, cleanroom inspection, and cartoning.",
    img: armImage,
    slug: "food-beverage",
    badge: "24 Use Cases",
  },
] as const;

function SectionHeading({
  eyebrow,
  title,
  text,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  dark?: boolean;
}) {
  return (
    <FadeUp distance={16} duration={0.55} className="mb-10 max-w-3xl">
      <p className="mb-3 text-[10px] font-bold uppercase tracking-[.24em] text-signal">{eyebrow}</p>
      <h2
        className={`font-display text-4xl font-bold uppercase leading-[.92] sm:text-5xl lg:text-6xl ${
          dark ? "text-surface-foreground" : "text-foreground"
        }`}
      >
        {title}
      </h2>
      {text && (
        <p
          className={`mt-5 max-w-2xl text-sm leading-7 sm:text-base ${
            dark ? "text-surface-foreground/65" : "text-muted-foreground"
          }`}
        >
          {text}
        </p>
      )}
    </FadeUp>
  );
}

// =========================================================================
// 3. PRODUCT DISCOVERY & COMPONENT SEARCH PLATFORM
// =========================================================================
function ProductFinder() {
  const { openModal } = useModals();
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [application, setApplication] = useState("All");
  const [requirement, setRequirement] = useState("All");
  const [sortBy, setSortBy] = useState<"relevance" | "name" | "category">("relevance");

  const matched = useMemo(() => {
    let result = products.filter((p) => {
      // 1. Category Filter
      const matchCat = category === "All" || p.category === category || p.categorySlug === category;

      // 2. Application Filter
      const matchApp =
        application === "All" ||
        p.applications.some((app) => app.toLowerCase().includes(application.toLowerCase()));

      // 3. Requirement / Engineering Priority Filter
      const matchReq =
        requirement === "All" ||
        p.requirements.some((r) => r.toLowerCase().includes(requirement.toLowerCase())) ||
        p.features.some((f) => f.toLowerCase().includes(requirement.toLowerCase()));

      // 4. Keyword / Search Query Filter
      const query = searchQuery.trim().toLowerCase();
      const matchQuery =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.shortDescription.toLowerCase().includes(query) ||
        p.positioning.toLowerCase().includes(query) ||
        p.slug.toLowerCase().includes(query) ||
        p.specifications.some(
          (s) =>
            s.label.toLowerCase().includes(query) || s.value.toLowerCase().includes(query),
        );

      return matchCat && matchApp && matchReq && matchQuery;
    });

    // Sorting
    if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "category") {
      result.sort((a, b) => a.category.localeCompare(b.category));
    }

    return result;
  }, [searchQuery, category, application, requirement, sortBy]);

  const handleWhatsApp = () => {
    window.open(companyConfig.getWhatsAppUrl({ type: "general" }), "_blank", "noopener,noreferrer");
  };

  const isFiltered =
    Boolean(searchQuery) || category !== "All" || application !== "All" || requirement !== "All";

  const handleResetFilters = () => {
    setSearchQuery("");
    setCategory("All");
    setApplication("All");
    setRequirement("All");
    setSortBy("relevance");
  };

  // Distinct category names
  const availableCategories = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.category)));
  }, []);

  return (
    <section
      id="finder"
      className="bg-[#F4F7FB] border-y border-slate-200 px-5 py-20 lg:px-10 lg:py-28"
    >
      <div className="mx-auto max-w-[1360px]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <SectionHeading
            eyebrow="Interactive Discovery & Search"
            title="Component Discovery Platform"
            text="Filter verified component families by technology discipline, industrial task, and engineering priority. Matched items link directly to full technical specifications and comparison tools."
          />
          <div className="flex items-center gap-3 shrink-0 pb-10">
            <span className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3.5 py-1.5 rounded-full shadow-xs">
              Showing <span className="font-bold text-[#101B2D]">{matched.length}</span> of{" "}
              {products.length} components
            </span>
            {isFiltered && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-blue-700 underline transition-colors cursor-pointer"
              >
                <RotateCcw size={12} /> Reset filters
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls Panel */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          {/* Top Row: Search Input & Sorting */}
          <div className="grid gap-4 md:grid-cols-[1.5fr_1fr]">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <Input
                type="text"
                placeholder="Search by model, technology, ratio, fieldbus, or keyword (e.g., Cycloidal, EtherCAT, 50:1)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 pl-10 pr-10 text-sm bg-slate-50/50 border-slate-300 focus:bg-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                <SlidersHorizontal size={14} /> Sort By:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="h-11 w-full rounded border border-slate-300 bg-slate-50/50 px-3 text-xs font-semibold text-slate-900 focus:border-primary focus:bg-white focus:outline-none"
              >
                <option value="relevance">Default Engineering Relevance</option>
                <option value="name">Component Name (A–Z)</option>
                <option value="category">Category Discipline</option>
              </select>
            </div>
          </div>

          {/* Bottom Row: 3 Dropdowns (Category, Application, Requirement) */}
          <div className="grid gap-4 md:grid-cols-3 border-t border-slate-100 pt-3">
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[.18em] text-slate-500">
                1. Product Discipline
              </span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-11 w-full rounded border border-slate-300 bg-slate-50/50 px-3 text-sm text-slate-900 focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="All">All Disciplines ({products.length} Components)</option>
                {availableCategories.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[.18em] text-slate-500">
                2. Application Task
              </span>
              <select
                value={application}
                onChange={(e) => setApplication(e.target.value)}
                className="h-11 w-full rounded border border-slate-300 bg-slate-50/50 px-3 text-sm text-slate-900 focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="All">All Industrial Tasks</option>
                {[
                  "Assembly",
                  "Welding",
                  "Material Handling",
                  "Inspection",
                  "Pick & Place",
                  "Mobile Robotics",
                  "Warehousing",
                  "Packaging",
                ].map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[.18em] text-slate-500">
                3. Engineering Priority
              </span>
              <select
                value={requirement}
                onChange={(e) => setRequirement(e.target.value)}
                className="h-11 w-full rounded border border-slate-300 bg-slate-50/50 px-3 text-sm text-slate-900 focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="All">All Engineering Priorities</option>
                {[
                  "High Torque",
                  "High Speed",
                  "High Precision",
                  "High Payload",
                  "Compact Design",
                  "Cleanroom",
                  "Deterministic",
                ].map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Active Filter Tags */}
          {isFiltered && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Active:
              </span>
              {searchQuery && (
                <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2.5 py-1 text-xs text-slate-700">
                  Search: "{searchQuery}"
                  <button onClick={() => setSearchQuery("")} className="hover:text-red-500">
                    <X size={12} />
                  </button>
                </span>
              )}
              {category !== "All" && (
                <span className="inline-flex items-center gap-1 rounded bg-primary/10 text-primary px-2.5 py-1 text-xs font-semibold">
                  Category: {category}
                  <button onClick={() => setCategory("All")} className="hover:text-red-500">
                    <X size={12} />
                  </button>
                </span>
              )}
              {application !== "All" && (
                <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2.5 py-1 text-xs text-slate-700">
                  Task: {application}
                  <button onClick={() => setApplication("All")} className="hover:text-red-500">
                    <X size={12} />
                  </button>
                </span>
              )}
              {requirement !== "All" && (
                <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2.5 py-1 text-xs text-slate-700">
                  Priority: {requirement}
                  <button onClick={() => setRequirement("All")} className="hover:text-red-500">
                    <X size={12} />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Results Grid */}
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {matched.length ? (
            matched.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full rounded-xl border border-slate-200 bg-white p-10 text-center sm:p-14 shadow-xs">
              <p className="font-display text-2xl uppercase tracking-wide text-[#101B2D]">
                No matching components found
              </p>
              <p className="mx-auto mt-2 max-w-lg text-sm text-slate-600">
                No components matched your active search and filter criteria. Adjust your search or clear filters to view the full product portfolio.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button
                  className="rounded bg-primary font-bold uppercase text-white hover:bg-[#1a74dc]"
                  onClick={() => openModal("engineer")}
                >
                  Request Custom Sizing Support
                </Button>
                <Button
                  variant="outline"
                  className="rounded border-slate-300 bg-white text-slate-800"
                  onClick={handleWhatsApp}
                >
                  <MessageSquare size={14} className="mr-1.5 text-emerald-500" />
                  WhatsApp Engineering
                </Button>
                <Button
                  variant="outline"
                  className="rounded border-slate-300 bg-white text-slate-800"
                  onClick={handleResetFilters}
                >
                  Reset All Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// =========================================================================
// MAIN HOMEPAGE COMPONENT
// =========================================================================
function HomePage() {
  const { openModal } = useModals();

  const handleWhatsApp = () => {
    window.open(companyConfig.getWhatsAppUrl({ type: "general" }), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen">
      {/* =========================================================================
          1. HERO SECTION & PRIMARY ACTIONS — Full-Width Edge-to-Edge Sliding Background
         ========================================================================= */}
      <section
        className="relative flex w-full min-h-[calc(100svh-5rem)] lg:min-h-[84vh] items-center overflow-hidden bg-slate-950 text-surface-foreground select-none"
      >
        {/* FULL-WIDTH SLIDING BACKGROUND: Edge-to-Edge Continuous Carousel Across Entire Hero */}
        <HeroBackgroundSlider />

        {/* FOREGROUND CONTENT: Stationary, High-Contrast, Persistent Hierarchy */}
        <div className="relative z-20 mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12 py-16 sm:py-20 lg:py-24 pointer-events-auto">
          <div className="max-w-2xl xl:max-w-3xl">
            {/* Small Industrial Eyebrow Label */}
            <div className="inline-flex items-center gap-2 border border-signal/30 bg-[#081222]/90 px-3.5 py-1.5 backdrop-blur-md rounded-sm">
              <span className="size-1.5 rounded-full bg-signal shadow-[0_0_8px_rgba(22,199,232,0.9)] animate-pulse" />
              <p className="text-[11px] font-bold uppercase tracking-[.24em] text-signal sm:text-xs font-mono">
                INDUSTRIAL ROBOTICS · PRECISION MOTION PLATFORMS
              </p>
            </div>

            {/* Main Headline */}
            <h1 className="mt-5 font-display text-[clamp(2.25rem,4.5vw,4.5rem)] font-bold uppercase leading-[0.96] tracking-tight text-white drop-shadow-sm">
              <span>PRECISION ROBOTICS.</span>{" "}
              <span className="text-signal block mt-1">SMARTER MANUFACTURING.</span>
            </h1>

            {/* Supporting Copy */}
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-slate-100 sm:text-base md:text-lg sm:leading-8 font-normal drop-shadow-sm">
              Discover industrial automation solutions designed around manufacturing requirements,
              production workflows, and operational performance.
            </p>

            {/* Redesigned Information Panel */}
            <div className="mt-6 max-w-2xl lg:max-w-3xl rounded-lg border border-white/15 bg-[#081222]/85 p-3.5 sm:p-4 backdrop-blur-md shadow-lg">
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/10">
                <div className="pt-2 md:pt-0">
                  <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    OFFERINGS
                  </span>
                  <p className="mt-0.5 text-xs sm:text-sm font-semibold text-white tracking-tight">
                    Reducers, Joints &amp; Cells
                  </p>
                </div>
                <div className="pt-2 md:pt-0 md:pl-4">
                  <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    TARGET BUYERS
                  </span>
                  <p className="mt-0.5 text-xs sm:text-sm font-semibold text-white tracking-tight">
                    Machine OEMs &amp; Plants
                  </p>
                </div>
                <div className="pt-2 md:pt-0 md:pl-4">
                  <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    CORE CHALLENGES
                  </span>
                  <p className="mt-0.5 text-xs sm:text-sm font-semibold text-white tracking-tight">
                    Precision, Downtime &amp; Reliability
                  </p>
                </div>
                <div className="pt-2 md:pt-0 md:pl-4">
                  <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    VERIFICATION
                  </span>
                  <p className="mt-0.5 text-xs sm:text-sm font-semibold text-signal tracking-tight">
                    ISO 9283 · DIN 3990 Standards
                  </p>
                </div>
              </div>
            </div>

            {/* Primary & Secondary Hero Actions with Tertiary Link */}
            <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4 sm:mt-9">
              {/* Primary CTA: EXPLORE PRODUCTS */}
              <Button
                asChild
                size="xl"
                className="h-12 px-7 rounded-md bg-primary hover:bg-[#1a74dc] text-white font-bold uppercase text-xs tracking-wider shadow-[0_0_24px_rgba(35,136,255,0.45)] hover:shadow-[0_0_32px_rgba(35,136,255,0.65)] hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Link
                  to="/products"
                  onClick={() => {
                    trackDigitalPresence("primary_cta_click", "Hero Explore Products", "/products");
                    trackClarityEvent("primary_cta_click");
                  }}
                >
                  Explore Products
                  <ArrowRight size={15} className="ml-2" />
                </Link>
              </Button>

              {/* Secondary CTA: DISCUSS YOUR APPLICATION */}
              <Button
                asChild
                size="xl"
                variant="outline"
                className="h-12 px-7 rounded-md border border-white/25 bg-white/[0.06] hover:bg-white/[0.12] hover:border-signal/60 text-white font-bold uppercase text-xs tracking-wider shadow-sm transition-all"
              >
                <Link
                  to="/book-consultation"
                  onClick={() => {
                    trackDigitalPresence("cta_click", "Hero Discuss Application", "/book-consultation");
                    trackClarityEvent("discuss_application_click");
                  }}
                >
                  <Calendar size={14} className="mr-2 text-signal" />
                  Discuss Your Application
                </Link>
              </Button>

              {/* Optional Tertiary Action: EXPLORE SOLUTIONS */}
              <Link
                to="/solutions"
                onClick={() => {
                  trackDigitalPresence("cta_click", "Hero Explore Solutions", "/solutions");
                  trackClarityEvent("explore_solutions_click");
                }}
                className="group inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-signal transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal rounded"
              >
                <span>Explore Solutions</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Verified Engineering Standards Footer Note */}
            <div className="mt-8 flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-[.2em] text-slate-400 sm:mt-10 font-mono">
              <span className="text-slate-300">{companyConfig.tagline}</span>
              <span className="hidden sm:inline text-slate-600">|</span>
              <span className="tracking-widest text-signal">
                ISO 9001:2015 · ISO 9283 · DIN 3990
              </span>
            </div>
          </div>
        </div>
      </section>
      {/* Premium multi-row sliding showcase */}
      <IndustrialShowcase />

      {/* =========================================================================
          INDUSTRIAL SECTORS & VERIFICATION CREDIBILITY BAR
          (Inspired by reference design partner/credibility ribbon)
         ========================================================================= */}
      <section className="bg-[#080E18] border-b border-white/10 py-5 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col xl:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 shrink-0">
              <span className="size-2 rounded-full bg-signal animate-ping" />
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-300">
                Deployments &amp; Standards
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
              {[
                { name: "Automotive & EV Battery", tag: "Production Lines" },
                { name: "Semiconductor & SMT", tag: "Cleanroom Class 1" },
                { name: "Aerospace & Defence", tag: "5-Axis Kinematics" },
                { name: "Heavy CNC Machining", tag: "Continuous Tending" },
                { name: "Autonomous Logistics", tag: "1,200kg Payloads" },
                { name: "ISO 9001:2015", tag: "Quality Management" },
                { name: "DIN 3990 Standards", tag: "Gear Durability" },
              ].map((partner, pIdx) => (
                <div
                  key={pIdx}
                  className="group flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-signal/40 px-3 py-1.5 transition-all shadow-xs"
                >
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-200 group-hover:text-white">
                    {partner.name}
                  </span>
                  <span className="rounded bg-black/40 px-1.5 py-0.2 text-[9px] font-mono text-signal font-semibold border border-white/5">
                    {partner.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DUAL-PATH INTENT ROUTING (OEMs vs. Plant Operations) */}
      <section className="bg-surface-elevated/40 border-b border-border/60 py-12 px-5 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1360px]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-[11px] font-mono font-bold uppercase tracking-[.24em] text-signal mb-1">
                Engineering Deployment Pathways
              </p>
              <h2 className="text-2xl sm:text-3xl font-display font-bold uppercase tracking-tight text-foreground">
                Select Your Manufacturing Objective
              </h2>
            </div>
            <p className="text-xs text-muted-foreground max-w-md">
              Whether specifying precision components for a custom machine or deploying turnkey automation on your plant floor.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Pathway A */}
            <div className="group rounded-xl border border-border/80 bg-card p-6 sm:p-7 transition-all hover:border-signal/80 hover:shadow-lg flex flex-col justify-between">
              <div>
                <span className="inline-block px-2.5 py-1 rounded bg-signal/15 border border-signal/30 text-[10px] font-mono font-bold uppercase tracking-wider text-signal mb-3">
                  For Machine Builders &amp; Robotics OEMs
                </span>
                <h3 className="text-xl sm:text-2xl font-display font-bold uppercase tracking-wide text-foreground group-hover:text-signal transition-colors">
                  Kinematic Subsystems &amp; Joint Actuators
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Accelerate custom machine builds with verified sub-0.1 arcminute strain-wave and RV cycloidal reducers, frameless torque motors, and integrated 48V DC hollow-shaft joint modules. Delivered with native CAD STEP files and open EtherCAT XMLs in 6-8 weeks.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
                <Link
                  to="/products/$category"
                  params={{ category: "precision-reducers" }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-signal hover:underline"
                >
                  Explore Subsystems Catalogue <ArrowRight size={13} />
                </Link>
                <span className="text-[10px] font-mono text-muted-foreground">Standard Delivery: 6-8 Wks</span>
              </div>
            </div>

            {/* Pathway B */}
            <div className="group rounded-xl border border-border/80 bg-card p-6 sm:p-7 transition-all hover:border-primary/80 hover:shadow-lg flex flex-col justify-between">
              <div>
                <span className="inline-block px-2.5 py-1 rounded bg-primary/15 border border-primary/30 text-[10px] font-mono font-bold uppercase tracking-wider text-primary mb-3">
                  For Manufacturing Operations &amp; Machine Shops
                </span>
                <h3 className="text-xl sm:text-2xl font-display font-bold uppercase tracking-wide text-foreground group-hover:text-primary transition-colors">
                  Turnkey Robotic Workcells &amp; Tending
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Eliminate operator shortages and double CNC machine spindle utilization. Pre-engineered, standardized robotic machine tending and welding workcells deployed in 5 business days with documented cash payback in under 10 months.
                </p>
              </div>
              <div className="mt-6 pt-4 border-border/50 border-t flex items-center justify-between">
                <Link
                  to="/solutions"
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary hover:underline"
                >
                  View Turnkey Workcells <ArrowRight size={13} />
                </Link>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">OEE Increase: +38% to +45%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. MAIN PRODUCT FAMILIES (8 CORE DISCIPLINES)
         ========================================================================= */}
      <section id="products" className="border-b border-border bg-card px-5 py-20 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-[1360px]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <SectionHeading
              eyebrow="Product Portfolio"
              title="Engineered Product Families"
              text="From component-level strain-wave gearheads to complete 6-axis industrial workcells, INDUS architectures are engineered to rigorous ISO and DIN standards."
            />
            <Button
              asChild
              variant="outline"
              className="border-border text-foreground hover:border-signal hover:text-signal shrink-0 pb-10 font-bold uppercase text-xs"
            >
              <Link to="/products">
                View All 240+ Catalogue Ranges →
              </Link>
            </Button>
          </div>

          <StaggerContainer
            staggerDelay={0.06}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {TOP_LEVEL_CATEGORIES.map((cat, i) => {
              const icons = [Zap, Bot, Move3d, Cpu, Gauge, Box, Settings2, ShieldCheck];
              const Icon = icons[i % icons.length] as React.ElementType;

              return (
                <StaggerItem key={cat.id} className="h-full">
                  <HoverMotion variant="card" className="h-full">
                    <article className="group relative flex h-full flex-col justify-between rounded-xl border border-border bg-background p-6 transition-all hover:border-signal/80 hover:shadow-md">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="flex size-9 items-center justify-center rounded bg-signal/15 text-signal">
                            <Icon size={18} />
                          </span>
                          <span className="rounded bg-signal/15 px-2 py-0.5 font-mono text-[10px] font-bold text-signal">
                            {cat.rangeCountBadge}
                          </span>
                        </div>

                        <div className="mt-5">
                          <Link to={cat.primaryRoute as any} className="block">
                            <h3 className="font-display text-xl uppercase tracking-wide text-foreground group-hover:text-signal transition-colors">
                              {cat.title}
                            </h3>
                          </Link>
                          <p className="mt-1 text-[11px] font-mono text-signal">
                            {cat.engineeringStandard}
                          </p>
                          <p className="mt-2 text-xs leading-5 text-muted-foreground line-clamp-3">
                            {cat.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center justify-between border-t border-border/40 pt-4">
                        <Link
                          to={cat.primaryRoute as any}
                          className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-signal hover:underline"
                        >
                          Explore <ArrowRight size={13} />
                        </Link>
                        <button
                          onClick={() =>
                            openModal("quote", { productName: cat.title, categoryName: cat.id })
                          }
                          className="text-[11px] font-bold uppercase text-muted-foreground hover:text-foreground"
                        >
                          RFQ
                        </button>
                      </div>
                    </article>
                  </HoverMotion>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* =========================================================================
          3. PRODUCT DISCOVERY & COMPONENT SEARCH PLATFORM
         ========================================================================= */}
      <ProductFinder />

      {/* =========================================================================
          4. ENGINEERING TOOLS SUITE (MOTION STUDIO, ANATOMY & CALCULATORS)
         ========================================================================= */}
      <section
        id="engineering-tools"
        className="border-b border-border bg-card px-5 py-20 lg:px-10 lg:py-28"
      >
        <div className="mx-auto max-w-[1360px] space-y-16">
          <SectionHeading
            eyebrow="Physics-Validated Engineering Suite"
            title="Kinematic Sizing & Systems Diagnostics"
            text="Eliminate undersizing failures and motor overheating with research-backed kinematic sizing tools. Every calculation publishes explicit mathematical equations, physical assumptions, units, and boundary limits."
          />

          {/* 4A: Flagship Feature: INDUS Motion Studio */}
          <IndusMotionStudio />

          {/* 4B: Interactive Robot Anatomy */}
          <InteractiveRobotAnatomy />

          {/* 4C: Specialized Toolkits Grid */}
          <div>
            <div className="grid gap-6 md:grid-cols-3">
              {/* Tool 1: Motion Sizing Calculators */}
              <div className="flex flex-col justify-between rounded-xl border border-border bg-background p-6 lg:p-8 shadow-sm hover:border-signal/80 transition-all group">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex size-10 items-center justify-center rounded-md bg-signal/15 text-signal">
                      <Calculator size={20} />
                    </span>
                    <span className="rounded bg-signal/15 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-signal">
                      ISO Equations
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-2xl font-bold uppercase tracking-wide text-foreground group-hover:text-signal transition-colors">
                    Motion Sizing Calculators
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    Documented mathematical calculators for linear ball screws, precision reducer inertia ratios (JL/JM ≤ 5:1), and robot wrist flange overhung moments.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border/40">
                  <Link
                    to="/technology/calculators"
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-signal hover:underline"
                  >
                    Calculate Kinematics <ArrowRight size={13} />
                  </Link>
                </div>
              </div>

              {/* Tool 2: Component Comparison */}
              <div className="flex flex-col justify-between rounded-xl border border-border bg-background p-6 lg:p-8 shadow-sm hover:border-signal/80 transition-all group">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex size-10 items-center justify-center rounded-md bg-signal/15 text-signal">
                      <GitCompare size={20} />
                    </span>
                    <span className="rounded bg-signal/15 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-signal">
                      Side-by-Side
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-2xl font-bold uppercase tracking-wide text-foreground group-hover:text-signal transition-colors">
                    Component Comparator
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    Direct cross-comparison matrix for up to 4 components. Audit torque ratings, backlash limits, allowable radial moments, and fieldbus standards.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border/40">
                  <Link
                    to="/products/compare"
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-signal hover:underline"
                  >
                    Open Comparison Matrix <ArrowRight size={13} />
                  </Link>
                </div>
              </div>

              {/* Tool 3: Architecture Explorer */}
              <div className="flex flex-col justify-between rounded-xl border border-border bg-background p-6 lg:p-8 shadow-sm hover:border-signal/80 transition-all group">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex size-10 items-center justify-center rounded-md bg-signal/15 text-signal">
                      <Layers size={20} />
                    </span>
                    <span className="rounded bg-signal/15 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-signal">
                      5-Tier Stack
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-2xl font-bold uppercase tracking-wide text-foreground group-hover:text-signal transition-colors">
                    Architecture Explorer
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    Interactive multi-tier hardware visualizer mapping mechanical kinematics, servo drivetrains, deterministic fieldbuses, trajectory interpolation, and safety zones.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border/40">
                  <Link
                    to="/technology/architecture-explorer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-signal hover:underline"
                  >
                    Launch Explorer <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4D: SIGNATURE FEATURE: INDUS AUTOMATION NAVIGATOR */}
      <IndusAutomationNavigator />

      {/* =========================================================================
          5. APPLICATION & INDUSTRY SOLUTIONS (18 VERTICALS)
         ========================================================================= */}
      <section id="applications" className="bg-card px-5 py-20 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-[1360px]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <SectionHeading
              eyebrow="Industry Sectors"
              title="Engineered for 18 Industrial Verticals"
              text="Proven kinematics, washdown IP ratings, and deterministic fieldbuses engineered to meet rigorous cycle times across global manufacturing environments."
            />
            <Button
              asChild
              variant="outline"
              className="border-border text-foreground hover:border-signal hover:text-signal shrink-0 pb-10 font-bold uppercase text-xs"
            >
              <Link to="/applications">
                Explore All 18 Application Verticals (220+ Use Cases) →
              </Link>
            </Button>
          </div>

          <StaggerContainer
            staggerDelay={0.08}
            className="grid gap-px bg-border md:grid-cols-2 lg:grid-cols-3 rounded-xl overflow-hidden"
          >
            {featuredApplicationCards.map((app) => (
              <StaggerItem key={app.title} className="h-full">
                <HoverMotion variant="card" className="h-full">
                  <Link
                    to="/applications/$applicationId"
                    params={{ applicationId: app.slug }}
                    className="group relative block aspect-[4/3] overflow-hidden bg-surface-dark"
                  >
                    <img
                      src={app.img}
                      alt={`${app.title} industrial robotics application`}
                      loading="lazy"
                      width={1200}
                      height={912}
                      className="h-full w-full object-cover opacity-70 grayscale transition duration-500 group-hover:scale-105 group-hover:opacity-50"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-surface-dark to-transparent p-7 pt-24 text-surface-foreground">
                      <div className="flex items-center justify-between mb-1">
                        <span className="rounded bg-signal/20 px-2 py-0.5 text-[10px] font-mono text-signal">
                          {app.badge}
                        </span>
                      </div>
                      <h3 className="font-display text-2xl uppercase tracking-wide group-hover:text-signal transition-colors">
                        {app.title}
                      </h3>
                      <p className="mt-1 text-xs text-surface-foreground/65 line-clamp-2">{app.desc}</p>
                      <span className="mt-3 flex items-center gap-1.5 text-xs font-bold uppercase text-signal">
                        Explore Vertical <ArrowRight size={13} />
                      </span>
                    </div>
                  </Link>
                </HoverMotion>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* 5B: INTERACTIVE AUTOMATION PAYBACK & ROI CALCULATOR */}
      <ManufacturingRoiCalculator />

      {/* =========================================================================
          6. ROBOTICS ARCHITECTURE & INTELLIGENCE
         ========================================================================= */}
      <section
        id="technology"
        className="technical-grid bg-surface-dark px-5 py-20 text-surface-foreground lg:px-10 lg:py-28"
      >
        <div className="mx-auto max-w-[1360px] space-y-20">
          <div>
            <SectionHeading
              dark
              eyebrow="Robotics Ecosystem"
              title="One Ecosystem. Every Movement."
              text="A modern robot is an interconnected system of power, motion, control, sensing, and intelligence. Every layer must interoperate deterministically."
            />

            <StaggerContainer
              staggerDelay={0.08}
              className="grid items-center gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr]"
            >
              {[
                {
                  icon: Zap,
                  title: "Power",
                  text: "Motors & servo technology",
                  href: "/technology/servo",
                },
                {
                  icon: Move3d,
                  title: "Motion",
                  text: "Actuators & precision reducers",
                  href: "/technology/motion-control",
                },
                {
                  icon: Cpu,
                  title: "Control",
                  text: "Controllers & fieldbuses",
                  href: "/products/control-systems",
                },
                {
                  icon: Gauge,
                  title: "Feedback",
                  text: "Sensors & encoders",
                  href: "/technology/sensors",
                },
                {
                  icon: Bot,
                  title: "Automation",
                  text: "Complete robotic systems",
                  href: "/products/industrial-robots",
                },
              ].map(({ icon: Icon, title, text, href }, i) => (
                <React.Fragment key={title}>
                  <StaggerItem className="h-full">
                    <HoverMotion variant="card" className="h-full">
                      <Link
                        to={href}
                        className="group block h-full border border-surface-foreground/15 bg-surface-elevated p-6 transition-all hover:border-signal hover:bg-surface-elevated/80 rounded-lg"
                      >
                        <Icon
                          className="text-signal transition-transform group-hover:scale-110"
                          size={24}
                        />
                        <p className="mt-8 font-display text-2xl uppercase group-hover:text-signal transition-colors">
                          {title}
                        </p>
                        <p className="mt-1 text-xs text-surface-foreground/50">{text}</p>
                        <span className="mt-4 inline-flex items-center gap-1 text-[10px] font-bold uppercase text-signal opacity-0 transition-opacity group-hover:opacity-100">
                          Explore Layer →
                        </span>
                      </Link>
                    </HoverMotion>
                  </StaggerItem>
                  {i < 4 && (
                    <div className="hidden items-center justify-center lg:flex">
                      <div className="signal-line h-px w-8" />
                      <ArrowRight size={14} className="text-signal" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </StaggerContainer>
          </div>

          {/* 6-Layer Technology Stack */}
          <div className="pt-10 border-t border-border/40 grid max-w-[1360px] gap-14 lg:grid-cols-[.75fr_1.25fr]">
            <SectionHeading
              dark
              eyebrow="Technology Stack"
              title="From Motion to Intelligence"
              text="Mechanical design, electrical power, real-time control, sensing, software, and intelligence working as one engineered architecture."
            />
            <StaggerContainer staggerDelay={0.06} className="space-y-2">
              {[
                {
                  num: "01",
                  name: "Mechanical",
                  sub: "Actuators · Reducers · Gears · Joints · Wheels",
                  href: "/technology/robotics",
                },
                {
                  num: "02",
                  name: "Electrical",
                  sub: "Motors · Servo Drives · Power Systems",
                  href: "/technology/servo",
                },
                {
                  num: "03",
                  name: "Control",
                  sub: "Motion Controllers · PLCs · Fieldbuses",
                  href: "/technology/motion-control",
                },
                {
                  num: "04",
                  name: "Sensing",
                  sub: "Encoders · Torque Sensors · Vision · Proximity",
                  href: "/technology/sensors",
                },
                {
                  num: "05",
                  name: "Software",
                  sub: "Programming · Trajectory Math · Digital Twin",
                  href: "/technology/automation",
                },
                {
                  num: "06",
                  name: "Intelligence",
                  sub: "Autonomous Agents · Neural Vision · Machine Learning",
                  href: "/technology/ai-robotics",
                },
              ].map((layer) => (
                <StaggerItem key={layer.name}>
                  <HoverMotion variant="lift">
                    <Link
                      to={layer.href}
                      className="group grid grid-cols-[48px_1fr] items-center border border-border/40 bg-surface-elevated/60 transition-all hover:border-signal rounded-lg"
                    >
                      <span className="grid h-full place-items-center border-r border-border/40 font-display text-lg text-muted-foreground group-hover:text-signal">
                        {layer.num}
                      </span>
                      <div className="flex items-center justify-between p-5">
                        <div>
                          <h3 className="font-display text-2xl uppercase tracking-wide group-hover:text-signal transition-colors text-white">
                            {layer.name}
                          </h3>
                          <p className="mt-1 text-xs text-muted-foreground">{layer.sub}</p>
                        </div>
                        <ArrowRight
                          size={16}
                          className="text-signal opacity-0 transition-opacity group-hover:opacity-100"
                        />
                      </div>
                    </Link>
                  </HoverMotion>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. VERIFIED TECHNICAL RESOURCES & FAQS
         ========================================================================= */}
      <section id="resources" className="bg-card px-5 py-20 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-[1360px]">
          <SectionHeading
            eyebrow="Knowledge Center"
            title="Engineering Resources & Technical Documentation"
            text="Everything engineers need to evaluate, size, integrate, and deploy robotic systems with verifiable documentation."
          />

          <StaggerContainer
            staggerDelay={0.06}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {[
              {
                title: "Product Catalogues",
                desc: "Browse full dimensional drawings, mounting patterns, and torque ratings.",
                href: "/resources?type=catalogue",
              },
              {
                title: "Datasheets & 3D CAD",
                desc: "Access electrical, thermal, torque curves, and verified step models.",
                href: "/resources?type=datasheet",
              },
              {
                title: "Application Notes",
                desc: "Understand real-world implementation math and thermal sizing calculations.",
                href: "/resources?type=app-note",
              },
              {
                title: "Case Studies",
                desc: "Explore verified industrial deployment ROI and production takt reports.",
                href: "/resources?type=case-study",
              },
              {
                title: "Technical Articles",
                desc: "Engineering deep-dives into motion control, kinematics, and fieldbuses.",
                href: "/engineering-intelligence",
              },
              {
                title: "Robotics Knowledge Graph",
                desc: "Explore 520+ semantic component, application, and ISO nodes.",
                href: "/technology/knowledge-graph",
              },
            ].map((item) => (
              <StaggerItem key={item.title} className="h-full">
                <HoverMotion variant="lift" className="h-full">
                  <Link
                    to={item.href}
                    className="group block h-full rounded-xl border border-border bg-background p-8 transition-colors hover:border-signal"
                  >
                    <FileText className="text-signal" size={24} />
                    <h3 className="mt-8 font-display text-2xl uppercase tracking-wide group-hover:text-signal transition-colors text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">{item.desc}</p>
                    <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-signal">
                      Explore Resource <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </HoverMotion>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* FAQ Accordion Section */}
          <div id="faqs" className="mt-20 border-t border-border pt-16">
            <SectionHeading
              eyebrow="Technical Reference"
              title="Frequently Asked Questions"
              text="Direct engineering answers to common technical inquiries regarding robotics, actuators, gearing, and control architectures."
            />

            <div className="grid gap-4 md:grid-cols-2">
              {faqs.slice(0, 6).map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-lg border border-border bg-background p-5 transition-colors open:bg-surface-elevated/40"
                >
                  <summary className="flex cursor-pointer items-center justify-between font-display text-lg uppercase tracking-wide list-none">
                    <span>{faq.question}</span>
                    <ChevronDown
                      className="shrink-0 transition-transform group-open:rotate-180 text-signal"
                      size={18}
                    />
                  </summary>
                  <p className="mt-4 text-xs leading-6 text-muted-foreground border-t border-border/50 pt-3">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button
                asChild
                variant="outline"
                className="border-border font-bold uppercase text-xs"
              >
                <Link to="/resources/faqs">View All Technical FAQs in Knowledge Center →</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. COMPANY CREDIBILITY & VALUE PILLARS
         ========================================================================= */}
      <section className="border-b border-border bg-background px-5 py-20 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-[1360px] space-y-16">
          <div className="max-w-4xl">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[.24em] text-signal">
              Company Credibility &amp; Core Standards
            </p>
            <h2 className="font-display text-3xl font-bold uppercase leading-tight sm:text-4xl lg:text-5xl">
              Engineering the Technologies Behind Modern Automation
            </h2>
            <p className="mt-6 text-base leading-8 text-muted-foreground sm:text-lg">
              Modern industrial automation relies on the deterministic coordination of mechanical
              dynamics and real-time electronic architectures. Achieving micro-scale repeatability
              and long-term durability requires harmonious interaction between precision actuators,
              zero-backlash gearing, dynamic sensing, and multi-axis kinematic control. We deliver
              the critical technologies underpinning these systems—whether deployed as standalone
              joint modules or integrated within complete automation architectures.
            </p>
            <div className="mt-8">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 font-display text-base font-bold uppercase tracking-wider text-signal hover:underline"
              >
                Learn More About INDUS Standards &amp; Culture <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* 4 Value Pillars */}
          <StaggerContainer
            staggerDelay={0.08}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {[
              {
                icon: Gauge,
                title: "Precision",
                text: "Sub-millimeter path following and sub-arcminute lost motion compliant with ISO 9283.",
              },
              {
                icon: ShieldCheck,
                title: "Reliability",
                text: "Engineered for 24/7 continuous duty cycles (L10h ≥ 20,000h) in harsh factory environments.",
              },
              {
                icon: CircuitBoard,
                title: "Integration",
                text: "Standardized DIN mechanical flanges and deterministic EtherCAT / PROFINET fieldbuses.",
              },
              {
                icon: Settings2,
                title: "Scalability",
                text: "From individual joint modules to synchronized multi-robot production lines.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <StaggerItem key={title} className="h-full">
                <HoverMotion variant="lift" className="h-full">
                  <div className="h-full rounded-xl border border-border bg-card p-6 lg:p-8 transition-colors hover:border-signal">
                    <Icon className="mb-4 text-signal" size={24} />
                    <h3 className="font-display text-xl uppercase tracking-wide text-foreground">
                      {title}
                    </h3>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">{text}</p>
                  </div>
                </HoverMotion>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* =========================================================================
          9. FINAL CALL TO ACTION (CONSULTATION & RFQ)
         ========================================================================= */}
      <section
        id="contact"
        className="relative overflow-hidden bg-[#101B2D] border-t border-slate-800 px-5 py-20 text-white lg:px-10 lg:py-28"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-15"
          style={{
            backgroundImage: "radial-gradient(#2388FF 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 size-96 rounded-full bg-signal/10 blur-3xl" />

        <FadeUp
          distance={24}
          className="relative mx-auto flex max-w-[1360px] flex-col justify-between gap-8 lg:flex-row lg:items-end"
        >
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary mb-3">
              <ShieldCheck size={13} />
              <span>Engineering Consultation &bull; Kinematics Sizing</span>
            </div>
            <h2 className="mt-2 font-display text-4xl font-bold uppercase leading-[.92] text-white sm:text-6xl lg:text-7xl">
              Ready to Build Your Next Robotic System?
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Whether you're specifying a high-torque joint actuator, developing a specialized AMR
              chassis, or planning an entire automated manufacturing cell, our application engineers
              are ready to assist.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <HoverMotion variant="button">
              <Button
                asChild
                className="h-12 rounded-md bg-primary px-7 font-bold uppercase text-white shadow-[0_0_20px_rgba(35,136,255,0.35)] hover:bg-[#1a74dc]"
              >
                <Link to="/book-consultation">
                  <Calendar size={14} className="mr-1.5 text-white" />
                  Book a Robotics Consultation
                </Link>
              </Button>
            </HoverMotion>

            <HoverMotion variant="button">
              <Button
                variant="outline"
                className="h-12 rounded-md border-slate-700 bg-slate-900/60 px-7 font-bold uppercase text-white hover:bg-slate-800 hover:border-primary"
                onClick={() => openModal("engineer")}
              >
                Talk to an Engineer
              </Button>
            </HoverMotion>

            <HoverMotion variant="button">
              <Button
                variant="outline"
                className="h-12 rounded-md border-slate-700 bg-slate-900/60 px-7 font-bold uppercase text-white hover:bg-slate-800 hover:border-primary"
                onClick={() => openModal("quote")}
              >
                Request a Quote <ArrowRight size={14} className="ml-1" />
              </Button>
            </HoverMotion>
          </div>
        </FadeUp>
      </section>
    </div>
  );
}
