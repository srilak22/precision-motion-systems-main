import React, { useState, useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Search,
  ArrowRight,
  Move3d,
  Layers,
  Factory,
  Cpu,
  FileText,
  ShieldCheck,
  Calendar,
  MessageSquare,
  Sparkles,
  GitCompare,
  Gauge,
  Bot,
  ExternalLink,
  ChevronRight,
  Calculator,
  Compass,
  Wrench,
} from "lucide-react";
import { TOP_LEVEL_CATEGORIES } from "@/data/productTaxonomy";
import { solutionsData } from "@/data/solutions";
import { companyConfig } from "@/data/config";
import { useModals } from "@/components/modals/ModalContext";
import { trackDigitalPresence } from "@/trackDigitalPresence";
import { trackClarityEvent } from "@/analytics/clarity";

interface SlidingNavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

type DrawerTab = "products" | "solutions" | "applications" | "engineering" | "company";

export function SlidingNavigationDrawer({ isOpen, onClose }: SlidingNavigationDrawerProps) {
  const [activeTab, setActiveTab] = useState<DrawerTab>("products");
  const [searchQuery, setSearchQuery] = useState("");
  const { openModal } = useModals();
  const drawerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Prevent background scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Auto-focus search after animation completes
      const timeout = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 350);
      return () => {
        document.body.style.overflow = "";
        clearTimeout(timeout);
      };
    } else {
      document.body.style.overflow = "";
      return undefined;
    }
  }, [isOpen]);

  // Handle ESC key to dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleLinkClick = (title: string, href: string) => {
    trackDigitalPresence("navigation", `Sliding Drawer - ${title}`, href);
    trackClarityEvent("drawer_nav_click");
    onClose();
  };

  const handleQuoteClick = () => {
    trackDigitalPresence("cta_click", "Sliding Drawer Request Quote", "Opened Quote Modal");
    trackClarityEvent("request_quote");
    onClose();
    openModal("quote");
  };

  const query = searchQuery.toLowerCase().trim();

  // Filtered categories for products tab
  const filteredProductCats = TOP_LEVEL_CATEGORIES.map((cat) => {
    if (!query) return cat;
    const matchingGroups = cat.groups
      .map((g) => ({
        ...g,
        items: g.items.filter(
          (item) =>
            item.name.toLowerCase().includes(query) ||
            item.specHighlight.toLowerCase().includes(query) ||
            g.groupName.toLowerCase().includes(query),
        ),
      }))
      .filter((g) => g.items.length > 0);

    const matchesCatTitle =
      cat.title.toLowerCase().includes(query) || cat.description.toLowerCase().includes(query);

    if (matchesCatTitle && matchingGroups.length === 0) {
      return cat;
    }

    return {
      ...cat,
      groups: matchingGroups,
    };
  }).filter((cat) => cat.groups.length > 0);

  // Applications list
  const applicationList = [
    {
      title: "Automotive & EV Battery Assembly",
      slug: "automotive",
      href: "/applications/automotive",
      desc: "Synchronized welding, battery module stacking, torque verification, powertrain assembly.",
      badge: "13 Use Cases",
    },
    {
      title: "Electronics & Semiconductor Cleanrooms",
      slug: "electronics",
      href: "/applications/electronics",
      desc: "Sub-micron wafer handling, cleanroom SMT inspection, micro-dispensing, precision packaging.",
      badge: "13 Use Cases",
    },
    {
      title: "Aerospace & Defence Manufacturing",
      slug: "aerospace-defence",
      href: "/applications/aerospace-defence",
      desc: "5-axis composite milling, automated rivet inspection, turbine blade finishing, non-destructive testing.",
      badge: "12 Use Cases",
    },
    {
      title: "Metal Fabrication & CNC Machining",
      slug: "metal-fabrication-machining",
      href: "/applications/metal-fabrication-machining",
      desc: "High-uptime CNC machine tending, press brake loading, robotic arc welding, foundry deburring.",
      badge: "12 Use Cases",
    },
    {
      title: "Warehousing & Intralogistics",
      slug: "warehousing-intralogistics",
      href: "/applications/warehousing-intralogistics",
      desc: "Autonomous mobile robots (AMR), high-speed sortation, automated palletizing, ASRS shuttles.",
      badge: "12 Use Cases",
    },
    {
      title: "Food & Pharmaceutical Processing",
      slug: "food-beverage",
      href: "/applications/food-beverage",
      desc: "IP69K washdown delta picking, sterile syringe packaging, cleanroom cartoning, vial inspection.",
      badge: "24 Use Cases",
    },
  ].filter(
    (app) =>
      !query ||
      app.title.toLowerCase().includes(query) ||
      app.desc.toLowerCase().includes(query),
  );

  // Turnkey solutions list
  const filteredSolutions = solutionsData.filter(
    (sol) =>
      !query ||
      sol.title.toLowerCase().includes(query) ||
      sol.shortDescription.toLowerCase().includes(query) ||
      sol.technologiesUsed.some((t) => t.toLowerCase().includes(query)),
  );

  // Engineering tools list
  const engineeringSuite = [
    {
      title: "Indus Motion Studio",
      href: "/technology/motion-studio",
      desc: "Interactive 3D kinematics simulator with real-time trajectory visualization.",
      icon: Move3d,
      badge: "Interactive Tool",
    },
    {
      title: "Kinematic Sizing & ROI Calculator",
      href: "/technology/calculators",
      desc: "Calculate joint torque, reduction ratios, inertia matching, and labor payback.",
      icon: Calculator,
      badge: "Engineering Tool",
    },
    {
      title: "Total Robotics Taxonomy (ISO 8373)",
      href: "/taxonomy",
      desc: "ISO 8373:2021 robotics classification across 8 primary pillars and orthogonal facets.",
      icon: Layers,
      badge: "ISO 8373:2021",
    },
    {
      title: "Component Specifications Comparator",
      href: "/products/compare",
      desc: "Side-by-side comparison matrix of 240+ robotic motion components.",
      icon: GitCompare,
      badge: "240+ Specs",
    },
    {
      title: "Robotics Architecture L0–L5",
      href: "/technology/architecture-explorer",
      desc: "5-tier physical hardware stack and autonomy framework explorer.",
      icon: Bot,
      badge: "Architecture",
    },
    {
      title: "Technical Whitepaper Library",
      href: "/engineering-intelligence",
      desc: "ISO 9283 path repeatability, DIN 3990 gear durability calculations, and CAD models.",
      icon: FileText,
      badge: "Documentation",
    },
  ].filter(
    (item) =>
      !query ||
      item.title.toLowerCase().includes(query) ||
      item.desc.toLowerCase().includes(query),
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop Scrim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm cursor-pointer"
            aria-hidden="true"
          />

          {/* Sliding Panel Container */}
          <motion.div
            ref={drawerRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex h-full w-full max-w-2xl flex-col bg-[#0E1726] text-white shadow-[0_0_80px_rgba(0,0,0,0.85)] border-l border-white/10"
            role="dialog"
            aria-modal="true"
            aria-label="INDUS Systems Index & Direct Navigation"
          >
            {/* Cyber Accent Line */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-signal via-primary to-signal" />

            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5 bg-[#101B2D]/90 backdrop-blur-md shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg border border-signal/40 bg-signal/10 text-signal">
                  <Move3d size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-base font-bold uppercase tracking-wider text-white">
                      INDUS Systems Index
                    </span>
                    <span className="rounded bg-signal/15 px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-widest text-signal border border-signal/30">
                      Direct Navigator
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    Engineering Catalogue · Kinematics · Applications
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center gap-1 rounded bg-black/40 px-2 py-1 text-[10px] font-mono text-slate-400 border border-white/10">
                  <kbd>ESC</kbd> to close
                </span>
                <button
                  onClick={onClose}
                  className="flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/10 hover:border-signal/50 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                  aria-label="Close navigation drawer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Drawer Search & Filter Bar */}
            <div className="border-b border-white/10 bg-[#0A1220] p-4 shrink-0">
              <div className="relative">
                <Search
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-signal"
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter 240+ motion components, applications, tools..."
                  className="h-10 w-full rounded-lg border border-white/15 bg-white/[0.04] pl-10 pr-9 text-xs text-white placeholder-slate-400 transition-colors focus:border-signal focus:bg-white/[0.07] focus:outline-none focus:ring-1 focus:ring-signal"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
                    aria-label="Clear filter query"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Tab Navigation Buttons */}
              <div className="mt-3 flex gap-1.5 border-t border-white/5 pt-3 overflow-x-auto scrollbar-none">
                {[
                  { id: "products", label: "Motion Systems", count: 8 },
                  { id: "solutions", label: "Turnkey Solutions", count: filteredSolutions.length },
                  { id: "applications", label: "Applications", count: applicationList.length },
                  { id: "engineering", label: "Engineering Suite", count: engineeringSuite.length },
                  { id: "company", label: "Company & ISO", count: 5 },
                ].map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as DrawerTab)}
                      className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                        isActive
                          ? "bg-signal/20 text-signal border border-signal/40 shadow-xs"
                          : "text-slate-300 hover:text-white hover:bg-white/[0.05] border border-transparent"
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                          isActive ? "bg-signal/30 text-white font-bold" : "bg-black/30 text-slate-400"
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 scrollbar-thin">
              {/* TAB 1: PRODUCTS & MOTION SYSTEMS */}
              {activeTab === "products" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-signal">
                      8 Master Product Portfolios ({filteredProductCats.length} Shown)
                    </span>
                    <Link
                      to="/products"
                      onClick={() => handleLinkClick("Full Catalogue", "/products")}
                      className="text-xs font-bold uppercase text-primary hover:text-signal hover:underline inline-flex items-center gap-1"
                    >
                      View All Products <ArrowRight size={12} />
                    </Link>
                  </div>

                  {filteredProductCats.length === 0 ? (
                    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-8 text-center">
                      <p className="text-sm font-semibold text-slate-300">
                        No product ranges matched "{searchQuery}"
                      </p>
                      <button
                        onClick={() => setSearchQuery("")}
                        className="mt-3 text-xs font-bold text-signal hover:underline"
                      >
                        Clear Filter
                      </button>
                    </div>
                  ) : (
                    filteredProductCats.map((cat) => (
                      <div
                        key={cat.id}
                        className="rounded-xl border border-white/10 bg-[#121E32]/70 p-4 transition-all hover:border-signal/40"
                      >
                        <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-display text-sm font-bold uppercase text-white tracking-wide">
                                {cat.title}
                              </h4>
                              <span className="rounded bg-signal/15 px-2 py-0.5 text-[9px] font-mono font-bold text-signal border border-signal/30">
                                {cat.rangeCountBadge}
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                              {cat.description}
                            </p>
                          </div>
                          <Link
                            to={cat.primaryRoute}
                            onClick={() => handleLinkClick(cat.title, cat.primaryRoute)}
                            className="shrink-0 rounded bg-white/5 hover:bg-signal/20 hover:text-signal border border-white/10 p-2 text-slate-300 transition-colors"
                            aria-label={`Open ${cat.title}`}
                          >
                            <ChevronRight size={15} />
                          </Link>
                        </div>

                        {/* Sub-groups */}
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {cat.groups.map((grp, gIdx) => (
                            <div key={gIdx} className="space-y-1">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                                {grp.groupName}
                              </span>
                              <div className="space-y-0.5">
                                {grp.items.slice(0, 3).map((item) => (
                                  <Link
                                    key={item.id}
                                    to={item.href}
                                    onClick={() => handleLinkClick(item.name, item.href)}
                                    className="group flex items-center justify-between rounded px-2 py-1 text-xs text-slate-300 hover:bg-white/[0.06] hover:text-white transition-colors"
                                  >
                                    <span className="group-hover:text-signal line-clamp-1">
                                      {item.name}
                                    </span>
                                    <span className="text-[10px] font-mono text-slate-500 group-hover:text-slate-400 shrink-0 ml-1">
                                      {item.specHighlight.split("·")[0]}
                                    </span>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB: TURNKEY SOLUTIONS */}
              {activeTab === "solutions" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-signal">
                      7 Turnkey Industrial Architectures
                    </span>
                    <Link
                      to="/solutions"
                      onClick={() => handleLinkClick("All Solutions", "/solutions")}
                      className="text-xs font-bold uppercase text-primary hover:text-signal hover:underline inline-flex items-center gap-1"
                    >
                      View All Solutions <ArrowRight size={12} />
                    </Link>
                  </div>

                  {filteredSolutions.map((sol, idx) => (
                    <Link
                      key={sol.id}
                      to={`/solutions/${sol.id}` as any}
                      onClick={() => handleLinkClick(sol.title, `/solutions/${sol.id}`)}
                      className="group block rounded-xl border border-white/10 bg-[#121E32]/70 p-4 transition-all hover:border-signal/50 hover:bg-[#16243A]"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="grid size-6 place-items-center rounded bg-signal/15 text-signal border border-signal/30 text-xs font-mono font-bold">
                            0{idx + 1}
                          </span>
                          <h4 className="font-display text-sm font-bold uppercase text-white group-hover:text-signal transition-colors">
                            {sol.title}
                          </h4>
                        </div>
                        <span className="rounded bg-primary/20 px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider text-primary border border-primary/30">
                          Architecture
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                        {sol.shortDescription}
                      </p>
                      <div className="mt-3 flex items-center justify-between text-[11px] text-surface-foreground/60 border-t border-white/10 pt-2">
                        <span className="font-mono truncate max-w-[280px]">
                          {sol.technologiesUsed.slice(0, 3).join(" · ")}
                        </span>
                        <span className="font-bold uppercase tracking-wider text-primary group-hover:text-signal inline-flex items-center gap-1 shrink-0">
                          View Architecture <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* TAB 2: APPLICATIONS & INDUSTRIES */}
              {activeTab === "applications" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-signal">
                      Target Manufacturing Verticals
                    </span>
                    <Link
                      to="/applications"
                      onClick={() => handleLinkClick("All Applications", "/applications")}
                      className="text-xs font-bold uppercase text-primary hover:text-signal hover:underline inline-flex items-center gap-1"
                    >
                      View All Verticals <ArrowRight size={12} />
                    </Link>
                  </div>

                  {applicationList.map((app, idx) => (
                    <Link
                      key={idx}
                      to={app.href}
                      onClick={() => handleLinkClick(app.title, app.href)}
                      className="group block rounded-xl border border-white/10 bg-[#121E32]/70 p-4 transition-all hover:border-signal/50 hover:bg-[#16243A]"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-display text-sm font-bold uppercase text-white group-hover:text-signal transition-colors">
                          {app.title}
                        </h4>
                        <span className="rounded bg-primary/20 px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider text-primary border border-primary/30">
                          {app.badge}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                        {app.desc}
                      </p>
                      <div className="mt-3 flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-signal group-hover:translate-x-1 transition-transform">
                        <span>Explore Kinematic Solutions</span>
                        <ArrowRight size={12} />
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* TAB 3: ENGINEERING SUITE */}
              {activeTab === "engineering" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-signal">
                      Calculators, Kinematics & 3D Tools
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {engineeringSuite.map((tool, idx) => {
                      const Icon = tool.icon;
                      return (
                        <Link
                          key={idx}
                          to={tool.href}
                          onClick={() => handleLinkClick(tool.title, tool.href)}
                          className="group flex flex-col justify-between rounded-xl border border-white/10 bg-[#121E32]/70 p-4 transition-all hover:border-signal/50 hover:bg-[#16243A]"
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <div className="flex size-8 items-center justify-center rounded-lg bg-signal/15 text-signal border border-signal/30 group-hover:scale-110 transition-transform">
                                <Icon size={16} />
                              </div>
                              <span className="rounded bg-white/5 px-2 py-0.5 text-[9px] font-mono font-bold text-slate-400 border border-white/10">
                                {tool.badge}
                              </span>
                            </div>
                            <h4 className="mt-3 font-display text-xs font-bold uppercase text-white group-hover:text-signal transition-colors">
                              {tool.title}
                            </h4>
                            <p className="mt-1 text-[11px] text-slate-300 leading-normal">
                              {tool.desc}
                            </p>
                          </div>
                          <div className="mt-3 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary group-hover:text-signal">
                            <span>Launch Tool</span>
                            <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 4: COMPANY & ISO STANDARDS */}
              {activeTab === "company" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-signal">
                      Organization & Quality Accreditations
                    </span>
                  </div>

                  <div className="space-y-3">
                    <Link
                      to="/about"
                      onClick={() => handleLinkClick("About INDUS", "/about")}
                      className="group block rounded-xl border border-white/10 bg-[#121E32]/70 p-4 hover:border-signal/40 hover:bg-[#16243A] transition-all"
                    >
                      <h4 className="font-display text-sm font-bold uppercase text-white group-hover:text-signal">
                        About INDUS Industrial Robotics
                      </h4>
                      <p className="mt-1 text-xs text-slate-300">
                        Engineering legacy, high-precision manufacturing centers, cleanroom assembly, and global deployment footprint.
                      </p>
                    </Link>

                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4">
                      <div className="flex items-center gap-2 text-emerald-400">
                        <ShieldCheck size={18} />
                        <span className="font-mono text-xs font-bold uppercase tracking-wider">
                          ISO 9001:2015 & DIN 3990 Standards
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-300">
                        Every actuator and harmonic drive module undergoes rigorous 100% CMM dimensional inspection, backlash verification under rated torque, and 72-hour thermal stability burn-in.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Link
                        to="/careers"
                        onClick={() => handleLinkClick("Careers", "/careers")}
                        className="rounded-lg border border-white/10 bg-white/[0.03] p-3 hover:bg-white/[0.08] transition-colors"
                      >
                        <span className="block text-xs font-bold uppercase text-white">
                          Careers & Openings
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5 block">
                          Join our kinematics & motion control team
                        </span>
                      </Link>

                      <Link
                        to="/contact"
                        onClick={() => handleLinkClick("Contact", "/contact")}
                        className="rounded-lg border border-white/10 bg-white/[0.03] p-3 hover:bg-white/[0.08] transition-colors"
                      >
                        <span className="block text-xs font-bold uppercase text-white">
                          Global Contact & Hotline
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5 block">
                          Direct phone, email, and facility locations
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer Actions */}
            <div className="border-t border-white/10 bg-[#0A1220] p-5 shrink-0">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-[11px] text-slate-400 font-mono text-center sm:text-left">
                  <span>Helpline: </span>
                  <a
                    href="tel:+919444024848"
                    className="text-signal hover:underline font-bold"
                  >
                    +91 94440 24848
                  </a>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    onClick={handleQuoteClick}
                    className="flex-1 sm:flex-none rounded-lg border border-white/20 bg-white/[0.06] hover:bg-white/[0.12] hover:border-signal/50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition-all cursor-pointer"
                  >
                    Request a Quote
                  </button>

                  <Link
                    to="/book-consultation"
                    onClick={() => handleLinkClick("Book Consultation", "/book-consultation")}
                    className="flex-1 sm:flex-none rounded-lg bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-500 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-[0_0_20px_rgba(35,136,255,0.4)] transition-all flex items-center justify-center gap-1.5"
                  >
                    <Calendar size={13} />
                    <span>Book Consultation</span>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
