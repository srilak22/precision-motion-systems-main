import React, { useState, useEffect, useRef } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Move3d,
  ChevronDown,
  Search,
  ArrowRight,
  MessageSquare,
  Menu,
  X,
  Cpu,
  Factory,
  Wrench,
  Layers,
  FileText,
  Calendar,
  Sparkles,
  Calculator,
  GitCompare,
  Gauge,
  Zap,
  Bot,
  Box,
  Settings2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { navigationData } from "@/data/navigation";
import { companyConfig } from "@/data/config";
import { useModals } from "@/components/modals/ModalContext";
import { TOP_LEVEL_CATEGORIES } from "@/data/productTaxonomy";
import { MobileNav } from "./MobileNav";
import { trackDigitalPresence } from "@/trackDigitalPresence";
import { trackClarityEvent } from "@/analytics/clarity";

export function Header() {
  const [openMega, setOpenMega] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<string>("motion-actuation");
  const [productFilterQuery, setProductFilterQuery] = useState<string>("");
  const { openModal } = useModals();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const headerRef = useRef<HTMLElement>(null);

  // Close mega menus on route change
  useEffect(() => {
    setOpenMega(null);
    setMobileMenuOpen(false);
  }, [currentPath]);

  // Click outside and Escape key listener for desktop mega menus & mobile nav
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setOpenMega(null);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenMega(null);
        setMobileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const toggleMega = (menu: string) => {
    const nextState = openMega === menu ? null : menu;
    setOpenMega(nextState);
    if (nextState) {
      trackDigitalPresence("navigation", `Header Menu - ${menu}`, `Opened ${menu} menu`);
      trackClarityEvent("navigation_click");
    }
  };

  const handleWhatsApp = () => {
    trackDigitalPresence("contact", "Header WhatsApp", "Opened WhatsApp chat");
    trackClarityEvent("whatsapp_click");
    window.open(companyConfig.getWhatsAppUrl({ type: "general" }), "_blank", "noopener,noreferrer");
  };

  const handleQuoteClick = () => {
    trackDigitalPresence("cta_click", "Header Request Quote", "Opened Quote Modal");
    trackClarityEvent("request_quote");
    openModal("quote");
  };

  const navProducts = navigationData["products"];
  const navSolutions = navigationData["solutions"];
  const navApplications = navigationData["applications"];
  const navTechnology = navigationData["technology"];
  const navResources = navigationData["resources"];

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 border-b border-border/40 bg-surface-dark/95 text-surface-foreground backdrop-blur-xl transition-all"
    >
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-5 lg:px-10">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
          aria-label="INDUS Industrial Robotics Home"
        >
          <span className="grid size-9 place-items-center border border-primary bg-primary/10 text-primary shadow-xs rounded-md">
            <Move3d size={20} />
          </span>
          <span>
            <b className="block font-sans text-lg font-extrabold leading-none tracking-wide text-white">
              {companyConfig.brandName}
            </b>
            <span className="text-[9px] font-semibold uppercase tracking-[.22em] text-signal">
              Industrial Robotics &bull; Precision Motion
            </span>
          </span>
        </Link>

        {/* Desktop Main Navigation */}
        <nav
          className="hidden items-center gap-1.5 lg:gap-2 xl:gap-3 lg:flex"
          aria-label="Primary navigation"
        >
          {/* Home Link */}
          <Link
            to="/"
            className={`rounded-md px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              currentPath === "/"
                ? "text-signal bg-surface-elevated/40"
                : "text-surface-foreground/80 hover:text-signal hover:bg-surface-elevated/20"
            }`}
          >
            Home
          </Link>

          {/* Products Dropdown Trigger */}
          <div className="relative">
            <button
              id="nav-trigger-products"
              onClick={() => toggleMega("products")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer ${
                openMega === "products" || currentPath.startsWith("/products")
                  ? "text-signal bg-surface-elevated/40"
                  : "text-surface-foreground/80 hover:text-signal hover:bg-surface-elevated/20"
              }`}
              aria-expanded={openMega === "products"}
              aria-controls="mega-menu-products"
              aria-haspopup="true"
            >
              Products
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${openMega === "products" ? "rotate-180 text-signal" : ""}`}
              />
            </button>
          </div>

          {/* Applications / Industries Dropdown Trigger */}
          <div className="relative">
            <button
              id="nav-trigger-industries"
              onClick={() => toggleMega("industries")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer ${
                openMega === "industries" || currentPath.startsWith("/applications")
                  ? "text-signal bg-surface-elevated/40"
                  : "text-surface-foreground/80 hover:text-signal hover:bg-surface-elevated/20"
              }`}
              aria-expanded={openMega === "industries"}
              aria-controls="mega-menu-industries"
              aria-haspopup="true"
            >
              Applications
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${openMega === "industries" ? "rotate-180 text-signal" : ""}`}
              />
            </button>
          </div>

          {/* Engineering Suite & Tools Dropdown Trigger */}
          <div className="relative">
            <button
              id="nav-trigger-engineering"
              onClick={() => toggleMega("engineering")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer ${
                openMega === "engineering" || currentPath.startsWith("/technology") || currentPath === "/products/compare"
                  ? "text-signal bg-surface-elevated/40"
                  : "text-surface-foreground/80 hover:text-signal hover:bg-surface-elevated/20"
              }`}
              aria-expanded={openMega === "engineering"}
              aria-controls="mega-menu-engineering"
              aria-haspopup="true"
            >
              Engineering
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${openMega === "engineering" ? "rotate-180 text-signal" : ""}`}
              />
            </button>
          </div>

          {/* Resources Dropdown Trigger */}
          <div className="relative">
            <button
              id="nav-trigger-resources"
              onClick={() => toggleMega("resources")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer ${
                openMega === "resources" || currentPath.startsWith("/resources") || currentPath.startsWith("/engineering-intelligence")
                  ? "text-signal bg-surface-elevated/40"
                  : "text-surface-foreground/80 hover:text-signal hover:bg-surface-elevated/20"
              }`}
              aria-expanded={openMega === "resources"}
              aria-controls="mega-menu-resources"
              aria-haspopup="true"
            >
              Resources
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${openMega === "resources" ? "rotate-180 text-signal" : ""}`}
              />
            </button>
          </div>

          {/* Company Dropdown Trigger */}
          <div className="relative">
            <button
              id="nav-trigger-company"
              onClick={() => toggleMega("company")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer ${
                openMega === "company" || currentPath.startsWith("/about") || currentPath.startsWith("/careers") || currentPath === "/contact"
                  ? "text-signal bg-surface-elevated/40"
                  : "text-surface-foreground/80 hover:text-signal hover:bg-surface-elevated/20"
              }`}
              aria-expanded={openMega === "company"}
              aria-controls="mega-menu-company"
              aria-haspopup="true"
            >
              Company
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${openMega === "company" ? "rotate-180 text-signal" : ""}`}
              />
            </button>
          </div>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search Trigger */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              trackDigitalPresence("click", "Header Search Button", "Opened Search Modal");
              openModal("search");
            }}
            className="text-surface-foreground hover:bg-surface-elevated hover:text-signal focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Open search modal"
          >
            <Search size={18} />
          </Button>

          {/* Secondary Action: Request a Quote */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleQuoteClick}
            className="hidden border-border/60 bg-surface-elevated/40 text-surface-foreground hover:border-primary/70 hover:bg-surface-elevated hover:text-primary md:inline-flex"
            aria-label="Request a Quote"
          >
            Request a Quote
          </Button>

          {/* Primary CTA: Book Consultation */}
          <Button
            asChild
            variant="default"
            size="sm"
            className="shadow-[0_0_16px_rgba(35,136,255,0.35)] focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Book a Robotics Consultation"
          >
            <Link
              to="/book-consultation"
              onClick={() => {
                trackDigitalPresence("consultation_cta_click", "Header Book Consultation", "/book-consultation");
                trackClarityEvent("consultation_cta_click");
              }}
            >
              <Calendar size={15} className="mr-1.5" />
              Book Consultation
            </Link>
          </Button>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-surface-foreground hover:bg-surface-elevated lg:hidden focus-visible:ring-2 focus-visible:ring-signal"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      {/* PRODUCTS DROPDOWN — 8 Master Categories with ~20 Ranges Each */}
      {openMega === "products" && (
        <div
          id="mega-menu-products"
          role="region"
          aria-label="Products Navigation Menu"
          className="absolute inset-x-0 top-20 hidden border-b border-border/40 bg-surface-dark/98 shadow-2xl backdrop-blur-2xl lg:block animate-in fade-in slide-in-from-top-1 duration-150"
        >
          <div className="mx-auto max-w-[1440px] px-6 lg:px-10 py-6">
            {/* 8 Top-Level Category Navigation Tabs */}
            <div className="flex border-b border-border/30 pb-3 gap-1 overflow-x-auto scrollbar-none">
              {TOP_LEVEL_CATEGORIES.map((cat) => {
                const isActive = cat.id === activeCategoryId;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategoryId(cat.id);
                      setProductFilterQuery("");
                    }}
                    onMouseEnter={() => {
                      setActiveCategoryId(cat.id);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? "bg-signal/15 text-signal border border-signal/40 shadow-xs"
                        : "text-surface-foreground/75 hover:text-white hover:bg-surface-elevated/40 border border-transparent"
                    }`}
                  >
                    <span>{cat.shortTitle}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                        isActive ? "bg-signal/25 text-signal font-bold" : "bg-surface-elevated text-muted-foreground"
                      }`}
                    >
                      {cat.groups.reduce((a, g) => a + g.items.length, 0)}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Category Content */}
            {(() => {
              const activeCat =
                TOP_LEVEL_CATEGORIES.find((c) => c.id === activeCategoryId) || TOP_LEVEL_CATEGORIES[0];
              const query = productFilterQuery.toLowerCase().trim();

              return (
                <div className="pt-4">
                  {/* Category Header Row */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/20 pb-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-display text-base font-bold uppercase text-white tracking-wide">
                          {activeCat.title}
                        </h3>
                        <span className="rounded bg-signal/10 px-2 py-0.5 text-[10px] font-mono font-bold text-signal border border-signal/30 uppercase tracking-wider">
                          {activeCat.rangeCountBadge}
                        </span>
                        <span className="hidden sm:inline-block rounded bg-surface-elevated px-2 py-0.5 text-[10px] font-mono text-muted-foreground border border-border/40">
                          {activeCat.engineeringStandard}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground max-w-3xl leading-relaxed">
                        {activeCat.description}
                      </p>
                    </div>

                    {/* Search & Actions */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="relative w-64">
                        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          type="text"
                          value={productFilterQuery}
                          onChange={(e) => setProductFilterQuery(e.target.value)}
                          placeholder="Filter ranges by keyword..."
                          className="w-full bg-surface-elevated/70 border border-border/50 rounded-md pl-8 pr-3 py-1.5 text-xs text-surface-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-signal/70 focus:ring-1 focus:ring-signal"
                        />
                        {productFilterQuery && (
                          <button
                            onClick={() => setProductFilterQuery("")}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white text-xs cursor-pointer"
                          >
                            ×
                          </button>
                        )}
                      </div>

                      <Link
                        to={activeCat.primaryRoute}
                        onClick={() => setOpenMega(null)}
                        className="rounded bg-primary/20 hover:bg-primary/30 text-primary border border-primary/40 px-3 py-1.5 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1 transition-colors"
                      >
                        View Category <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>

                  {/* 4 Technology Columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 pt-4">
                    {activeCat.groups.map((group, gIdx) => {
                      const filteredItems = query
                        ? group.items.filter(
                            (item) =>
                              item.name.toLowerCase().includes(query) ||
                              item.specHighlight.toLowerCase().includes(query) ||
                              group.groupName.toLowerCase().includes(query)
                          )
                        : group.items;

                      if (query && filteredItems.length === 0) return null;

                      return (
                        <div key={gIdx} className="space-y-2.5">
                          <div className="border-b border-border/20 pb-1.5">
                            <h4 className="text-[11px] font-bold uppercase tracking-[.15em] text-signal font-mono">
                              {group.groupName}
                            </h4>
                            <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                              {group.technologyDescription}
                            </p>
                          </div>

                          <ul className="space-y-1">
                            {filteredItems.map((item) => (
                              <li key={item.id}>
                                <Link
                                  to={item.href}
                                  onClick={() => setOpenMega(null)}
                                  className="group flex flex-col p-2 rounded-md hover:bg-surface-elevated transition-colors border border-transparent hover:border-border/40"
                                >
                                  <div className="flex items-center justify-between gap-1.5">
                                    <span className="text-xs font-semibold text-surface-foreground/90 group-hover:text-signal line-clamp-1">
                                      {item.name}
                                    </span>
                                    <span
                                      className={`size-1.5 rounded-full shrink-0 ${
                                        item.verificationStatus === "verified"
                                          ? "bg-signal shadow-[0_0_6px_rgba(0,255,178,0.6)]"
                                          : "bg-primary"
                                      }`}
                                      title={item.verificationStatus}
                                    />
                                  </div>
                                  <span className="text-[10px] text-muted-foreground font-mono mt-0.5 group-hover:text-surface-foreground/80">
                                    {item.specHighlight}
                                  </span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>

                  {/* Submenu Footer Bar */}
                  <div className="mt-5 border-t border-border/20 pt-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                        Quick Tools:
                      </span>
                      <Link
                        to="/products/precision-reducers"
                        onClick={() => setOpenMega(null)}
                        className="font-bold text-signal hover:underline inline-flex items-center gap-1"
                      >
                        <Gauge size={13} /> Priority: Precision Reducers (24 Ranges)
                      </Link>
                      <span className="text-border">|</span>
                      <Link
                        to="/products/compare"
                        onClick={() => setOpenMega(null)}
                        className="text-muted-foreground hover:text-white inline-flex items-center gap-1 font-semibold"
                      >
                        <GitCompare size={13} /> Component Comparator
                      </Link>
                      <span className="text-border">|</span>
                      <Link
                        to="/technology/intelligence-explorer"
                        onClick={() => setOpenMega(null)}
                        className="text-muted-foreground hover:text-white inline-flex items-center gap-1 font-semibold"
                      >
                        <Bot size={13} /> Intelligence L0–L5
                      </Link>
                    </div>

                    <button
                      onClick={() => {
                        setOpenMega(null);
                        openModal("quote");
                      }}
                      className="font-bold uppercase tracking-wider text-primary hover:text-primary/80 inline-flex items-center gap-1 cursor-pointer"
                    >
                      {activeCat.enquiryActionLabel} →
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}


      {/* APPLICATIONS DROPDOWN — 18 Researched Sectors with 221 Use Cases */}
      {openMega === "industries" && (
        <div
          id="mega-menu-industries"
          role="region"
          aria-label="Industries Navigation Menu"
          className="absolute inset-x-0 top-20 hidden border-b border-border/40 bg-surface-dark/98 shadow-2xl backdrop-blur-2xl lg:block animate-in fade-in slide-in-from-top-1 duration-150"
        >
          <div className="mx-auto max-w-[1440px] px-6 lg:px-10 py-7">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border/20 pb-4 gap-3">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-display text-base font-bold uppercase text-white tracking-wide">
                    Industrial Robotics Application Verticals
                  </h3>
                  <span className="rounded bg-signal/15 px-2 py-0.5 text-[10px] font-mono font-bold text-signal border border-signal/30 uppercase tracking-wider">
                    18 Sectors • 221 Technical Use Cases
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground max-w-3xl">
                  Researched industrial problem statements, kinematic architectures, cycle metrics, and verified component selection across discrete and continuous process industries.
                </p>
              </div>
              <Link
                to="/applications"
                onClick={() => setOpenMega(null)}
                className="rounded bg-signal/15 hover:bg-signal/25 text-signal border border-signal/40 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors shrink-0"
              >
                View All 18 Sectors <ArrowRight size={13} />
              </Link>
            </div>

            {/* 5 Industrial Sector Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5 pt-5">
              {/* Sector 1: Advanced Manufacturing */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold uppercase tracking-[.18em] text-signal font-mono border-b border-border/20 pb-1.5 flex items-center gap-1.5">
                  <Factory size={13} /> Advanced Manufacturing
                </h4>
                <ul className="space-y-2">
                  {[
                    { id: "automotive", title: "Automotive Manufacturing", desc: "BIW welding, EV battery packs & powertrain lines", uc: 12 },
                    { id: "electronics-semiconductor", title: "Electronics & Semiconductor", desc: "Wafer transfer, die sort & high-speed SMT", uc: 12 },
                    { id: "aerospace-defence", title: "Aerospace & Defence", desc: "Fuselage drilling, titanium machining & NDT", uc: 12 },
                    { id: "metal-fabrication-machining", title: "Metal Fabrication & Machining", desc: "CNC machine tending, laser cutting & forging", uc: 13 },
                  ].map((app) => (
                    <li key={app.id}>
                      <Link
                        to="/applications/$applicationId"
                        params={{ applicationId: app.id }}
                        onClick={() => setOpenMega(null)}
                        className="group flex flex-col p-2 rounded-md hover:bg-surface-elevated transition-colors border border-transparent hover:border-border/40"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-surface-foreground/90 group-hover:text-signal line-clamp-1">
                            {app.title}
                          </span>
                          <span className="text-[9px] font-mono px-1 rounded bg-surface-elevated text-muted-foreground group-hover:text-signal">
                            {app.uc} UC
                          </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                          {app.desc}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sector 2: Logistics & Packaging */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold uppercase tracking-[.18em] text-signal font-mono border-b border-border/20 pb-1.5 flex items-center gap-1.5">
                  <Move3d size={13} /> Logistics & Packaging
                </h4>
                <ul className="space-y-2">
                  {[
                    { id: "warehousing-intralogistics", title: "Warehousing & Intralogistics", desc: "Automated storage, high-speed sorting & AMR fleets", uc: 13 },
                    { id: "food-beverage", title: "Food & Beverage Processing", desc: "IP69K washdown picking, primary packaging & packing", uc: 13 },
                    { id: "packaging-consumer-goods", title: "Packaging & Consumer Goods", desc: "High-speed cartoning, case erecting & palletizing", uc: 12 },
                    { id: "plastics-rubber", title: "Plastics & Rubber", desc: "IMM side-entry unloading, degating & insert mold", uc: 12 },
                  ].map((app) => (
                    <li key={app.id}>
                      <Link
                        to="/applications/$applicationId"
                        params={{ applicationId: app.id }}
                        onClick={() => setOpenMega(null)}
                        className="group flex flex-col p-2 rounded-md hover:bg-surface-elevated transition-colors border border-transparent hover:border-border/40"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-surface-foreground/90 group-hover:text-signal line-clamp-1">
                            {app.title}
                          </span>
                          <span className="text-[9px] font-mono px-1 rounded bg-surface-elevated text-muted-foreground group-hover:text-signal">
                            {app.uc} UC
                          </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                          {app.desc}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sector 3: Healthcare & Process */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold uppercase tracking-[.18em] text-signal font-mono border-b border-border/20 pb-1.5 flex items-center gap-1.5">
                  <Layers size={13} /> Healthcare & Process
                </h4>
                <ul className="space-y-2">
                  {[
                    { id: "pharmaceuticals-lifesciences", title: "Pharmaceuticals & Life Sciences", desc: "Sterile vial filling, cleanroom isolators & lyophilizer", uc: 12 },
                    { id: "medical-devices-healthcare", title: "Medical Devices & Healthcare", desc: "Catheter bonding, orthopedic polishing & surgical arms", uc: 12 },
                    { id: "chemicals-process", title: "Chemicals & Process Industries", desc: "Corrosive drum filling, reactor inspection & ATEX sampling", uc: 12 },
                  ].map((app) => (
                    <li key={app.id}>
                      <Link
                        to="/applications/$applicationId"
                        params={{ applicationId: app.id }}
                        onClick={() => setOpenMega(null)}
                        className="group flex flex-col p-2 rounded-md hover:bg-surface-elevated transition-colors border border-transparent hover:border-border/40"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-surface-foreground/90 group-hover:text-signal line-clamp-1">
                            {app.title}
                          </span>
                          <span className="text-[9px] font-mono px-1 rounded bg-surface-elevated text-muted-foreground group-hover:text-signal">
                            {app.uc} UC
                          </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                          {app.desc}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sector 4: Heavy Industry & Energy */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold uppercase tracking-[.18em] text-signal font-mono border-b border-border/20 pb-1.5 flex items-center gap-1.5">
                  <Zap size={13} /> Heavy Industry & Energy
                </h4>
                <ul className="space-y-2">
                  {[
                    { id: "energy-utilities", title: "Energy & Utilities", desc: "Wind turbine blade crawlers, subsea ROVs & solar wash", uc: 12 },
                    { id: "mining", title: "Mining & Heavy Industry", desc: "Underground haulage AGVs, rock bolting & mill liners", uc: 12 },
                    { id: "construction-building", title: "Construction & Building", desc: "3D concrete printing, precast rebar & facade crawlers", uc: 12 },
                    { id: "agritech-agriculture", title: "Agriculture & Agri-Tech", desc: "Autonomous harvesting, orchard weeding & robotic milking", uc: 12 },
                  ].map((app) => (
                    <li key={app.id}>
                      <Link
                        to="/applications/$applicationId"
                        params={{ applicationId: app.id }}
                        onClick={() => setOpenMega(null)}
                        className="group flex flex-col p-2 rounded-md hover:bg-surface-elevated transition-colors border border-transparent hover:border-border/40"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-surface-foreground/90 group-hover:text-signal line-clamp-1">
                            {app.title}
                          </span>
                          <span className="text-[9px] font-mono px-1 rounded bg-surface-elevated text-muted-foreground group-hover:text-signal">
                            {app.uc} UC
                          </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                          {app.desc}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sector 5: Next-Gen & Research */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold uppercase tracking-[.18em] text-signal font-mono border-b border-border/20 pb-1.5 flex items-center gap-1.5">
                  <Bot size={13} /> Next-Gen & Research
                </h4>
                <ul className="space-y-2">
                  {[
                    { id: "humanoid", title: "Humanoid & Service Robotics", desc: "Bipedal balance, high-torque joint modules & dexterous hands", uc: 14 },
                    { id: "textiles", title: "Textiles & Apparel", desc: "3D preform carbon fabric layup, ultrasonic slitting & sewing", uc: 12 },
                    { id: "education", title: "Education & Research Labs", desc: "Academic kinematics benches, open ROS2 joints & dynamometers", uc: 12 },
                  ].map((app) => (
                    <li key={app.id}>
                      <Link
                        to="/applications/$applicationId"
                        params={{ applicationId: app.id }}
                        onClick={() => setOpenMega(null)}
                        className="group flex flex-col p-2 rounded-md hover:bg-surface-elevated transition-colors border border-transparent hover:border-border/40"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-surface-foreground/90 group-hover:text-signal line-clamp-1">
                            {app.title}
                          </span>
                          <span className="text-[9px] font-mono px-1 rounded bg-surface-elevated text-muted-foreground group-hover:text-signal">
                            {app.uc} UC
                          </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                          {app.desc}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Applications Submenu Footer */}
            <div className="mt-6 border-t border-border/20 pt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  Kinematic Integration:
                </span>
                <Link
                  to="/technology/motion-studio"
                  onClick={() => setOpenMega(null)}
                  className="font-bold text-signal hover:underline inline-flex items-center gap-1"
                >
                  <Cpu size={13} /> Interactive Robot Anatomy & Motion Studio
                </Link>
                <span className="text-border">|</span>
                <Link
                  to="/technology/calculators"
                  onClick={() => setOpenMega(null)}
                  className="text-muted-foreground hover:text-white inline-flex items-center gap-1 font-semibold"
                >
                  <Calculator size={13} /> Engineering Calculators
                </Link>
              </div>

              <Link
                to="/book-consultation"
                onClick={() => setOpenMega(null)}
                className="font-bold uppercase tracking-wider text-signal hover:underline inline-flex items-center gap-1"
              >
                <Calendar size={13} /> Book Application Engineering Consultation →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ENGINEERING SUITE & TOOLS DROPDOWN */}
      {openMega === "engineering" && (
        <div
          id="mega-menu-engineering"
          role="region"
          aria-label="Engineering Suite & Tools Navigation Menu"
          className="absolute inset-x-0 top-20 hidden border-b border-border/40 bg-surface-dark/98 shadow-2xl backdrop-blur-2xl lg:block animate-in fade-in slide-in-from-top-1 duration-150"
        >
          <div className="mx-auto max-w-[1440px] px-6 lg:px-10 py-7">
            {/* Header row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border/20 pb-4 gap-3">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-display text-base font-bold uppercase text-white tracking-wide">
                    Physics-Validated Engineering Suite &amp; Architecture Tools
                  </h3>
                  <span className="rounded bg-signal/15 px-2 py-0.5 text-[10px] font-mono font-bold text-signal border border-signal/30 uppercase tracking-wider">
                    6 Interactive Platforms &bull; ISO &amp; DIN Backed
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed max-w-3xl">
                  Kinematic sizing tools, 5-tier hardware explorers, robotics intelligence frameworks, and semantic knowledge network for mechatronic design.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link
                  to="/technology"
                  onClick={() => setOpenMega(null)}
                  className="rounded bg-primary/20 hover:bg-primary/30 text-primary border border-primary/40 px-3 py-1.5 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1 transition-colors"
                >
                  Technology Overview <ArrowRight size={12} />
                </Link>
              </div>
            </div>

            {/* 6 Engineering Tool Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-5">
              {/* Card 1: Motion Sizing Calculators */}
              <Link
                to="/technology/calculators"
                onClick={() => setOpenMega(null)}
                className="group flex flex-col justify-between rounded-md border border-surface-foreground/10 bg-surface-elevated/30 p-4 transition-all hover:border-signal/50 hover:bg-surface-elevated"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="grid size-8 place-items-center rounded bg-signal/15 text-signal">
                      <Calculator size={16} />
                    </div>
                    <span className="rounded bg-signal/15 px-2 py-0.5 font-mono text-[9px] font-bold text-signal uppercase tracking-wider">
                      ISO &bull; DIN Formulas
                    </span>
                  </div>
                  <h4 className="mt-3 font-display text-sm uppercase text-surface-foreground group-hover:text-signal font-bold">
                    Motion Sizing Calculators
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    Linear ball screws, precision reducer inertia ratios (JL/JM ≤ 5:1), and wrist flange overhung moments.
                  </p>
                </div>
                <span className="mt-3 inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground group-hover:text-signal">
                  Launch Calculators &rarr;
                </span>
              </Link>

              {/* Card 2: Interactive Motion Studio & Anatomy */}
              <Link
                to="/technology/motion-studio"
                onClick={() => setOpenMega(null)}
                className="group flex flex-col justify-between rounded-md border border-signal/40 bg-surface-elevated/50 p-4 transition-all hover:border-signal hover:bg-surface-elevated shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="grid size-8 place-items-center rounded bg-signal/20 text-signal">
                      <Cpu size={16} />
                    </div>
                    <span className="rounded bg-signal/25 px-2 py-0.5 font-mono text-[9px] font-bold text-signal uppercase tracking-wider">
                      Kinematics Studio
                    </span>
                  </div>
                  <h4 className="mt-3 font-display text-sm uppercase text-white group-hover:text-signal font-bold">
                    Motion Studio &amp; Robot Anatomy
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    Interactive 6-axis joint visualizer, real-time torque limit checks, dynamic inertia matching, and engineering passport export.
                  </p>
                </div>
                <span className="mt-3 inline-flex items-center gap-1 font-mono text-[11px] font-bold uppercase text-signal">
                  Open Studio &rarr;
                </span>
              </Link>

              {/* Card 3: 5-Tier Architecture Explorer */}
              <Link
                to="/technology/architecture-explorer"
                onClick={() => setOpenMega(null)}
                className="group flex flex-col justify-between rounded-md border border-surface-foreground/10 bg-surface-elevated/30 p-4 transition-all hover:border-signal/50 hover:bg-surface-elevated"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="grid size-8 place-items-center rounded bg-signal/15 text-signal">
                      <Layers size={16} />
                    </div>
                    <span className="rounded bg-signal/15 px-2 py-0.5 font-mono text-[9px] font-bold text-signal uppercase tracking-wider">
                      5-Tier Stack
                    </span>
                  </div>
                  <h4 className="mt-3 font-display text-sm uppercase text-surface-foreground group-hover:text-signal font-bold">
                    Architecture Explorer
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    Deconstruct mechanical kinematics, servo drivetrains, deterministic fieldbuses (EtherCAT, PROFINET), and safety zones.
                  </p>
                </div>
                <span className="mt-3 inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground group-hover:text-signal">
                  Explore Hardware Stack &rarr;
                </span>
              </Link>

              {/* Card 4: Level 0–5 Intelligence Explorer */}
              <Link
                to="/technology/intelligence-explorer"
                onClick={() => setOpenMega(null)}
                className="group flex flex-col justify-between rounded-md border border-surface-foreground/10 bg-surface-elevated/30 p-4 transition-all hover:border-signal/50 hover:bg-surface-elevated"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="grid size-8 place-items-center rounded bg-signal/15 text-signal">
                      <Bot size={16} />
                    </div>
                    <span className="rounded bg-signal/15 px-2 py-0.5 font-mono text-[9px] font-bold text-signal uppercase tracking-wider">
                      L0–L5 Hierarchy
                    </span>
                  </div>
                  <h4 className="mt-3 font-display text-sm uppercase text-surface-foreground group-hover:text-signal font-bold">
                    Robotics Intelligence Framework
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    Educational classification: Level 0 direct mechanical transmission through Level 5 autonomous adaptive planning.
                  </p>
                </div>
                <span className="mt-3 inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground group-hover:text-signal">
                  View Intelligence Framework &rarr;
                </span>
              </Link>

              {/* Card 5: Knowledge Graph & Agentic Network */}
              <Link
                to="/technology/knowledge-graph"
                onClick={() => setOpenMega(null)}
                className="group flex flex-col justify-between rounded-md border border-surface-foreground/10 bg-surface-elevated/30 p-4 transition-all hover:border-signal/50 hover:bg-surface-elevated"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="grid size-8 place-items-center rounded bg-signal/15 text-signal">
                      <Sparkles size={16} />
                    </div>
                    <span className="rounded bg-signal/15 px-2 py-0.5 font-mono text-[9px] font-bold text-signal uppercase tracking-wider">
                      Agentic Ready
                    </span>
                  </div>
                  <h4 className="mt-3 font-display text-sm uppercase text-surface-foreground group-hover:text-signal font-bold">
                    Robotics Knowledge Graph
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    524 semantic nodes, 1,613 typed relationships, zero dangling references, and 10 future agent capability contracts.
                  </p>
                </div>
                <span className="mt-3 inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground group-hover:text-signal">
                  Launch Knowledge Graph &rarr;
                </span>
              </Link>

              {/* Card 6: Side-by-Side Component Comparator */}
              <Link
                to="/products/compare"
                onClick={() => setOpenMega(null)}
                className="group flex flex-col justify-between rounded-md border border-surface-foreground/10 bg-surface-elevated/30 p-4 transition-all hover:border-signal/50 hover:bg-surface-elevated"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="grid size-8 place-items-center rounded bg-signal/15 text-signal">
                      <GitCompare size={16} />
                    </div>
                    <span className="rounded bg-signal/15 px-2 py-0.5 font-mono text-[9px] font-bold text-signal uppercase tracking-wider">
                      Side-by-Side
                    </span>
                  </div>
                  <h4 className="mt-3 font-display text-sm uppercase text-surface-foreground group-hover:text-signal font-bold">
                    Component Comparator
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    Direct comparison matrix for up to 4 components across torque, backlash, radial moments, and fieldbuses.
                  </p>
                </div>
                <span className="mt-3 inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground group-hover:text-signal">
                  Open Comparison Tool &rarr;
                </span>
              </Link>
            </div>

            {/* Submenu Footer */}
            <div className="mt-6 border-t border-border/20 pt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  Reference Implementation:
                </span>
                <Link
                  to="/products/precision-reducers"
                  onClick={() => setOpenMega(null)}
                  className="font-bold text-signal hover:underline inline-flex items-center gap-1"
                >
                  <Gauge size={13} /> Precision Reducers (24 Verified Ranges)
                </Link>
                <span className="text-border">|</span>
                <Link
                  to="/contact/engineering-enquiry"
                  onClick={() => setOpenMega(null)}
                  className="text-muted-foreground hover:text-white inline-flex items-center gap-1 font-semibold"
                >
                  <FileText size={13} /> Project Kinematics RFQ
                </Link>
              </div>

              <Link
                to="/book-consultation"
                onClick={() => setOpenMega(null)}
                className="font-bold uppercase tracking-wider text-signal hover:underline inline-flex items-center gap-1"
              >
                <Calendar size={13} /> Book Application Engineering Consultation →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* RESOURCES DROPDOWN */}
      {openMega === "resources" && (
        <div
          id="mega-menu-resources"
          role="region"
          aria-label="Resources Navigation Menu"
          className="absolute inset-x-0 top-20 hidden border-b border-border/40 bg-surface-dark/98 shadow-2xl backdrop-blur-2xl lg:block animate-in fade-in slide-in-from-top-1 duration-150"
        >
          <div className="mx-auto max-w-[1440px] px-6 lg:px-10 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                to="/engineering-intelligence"
                onClick={() => setOpenMega(null)}
                className="group flex flex-col justify-between rounded-md border border-signal/40 bg-surface-elevated/50 p-4 transition-all hover:border-signal hover:bg-surface-elevated shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="grid size-8 place-items-center rounded bg-signal/15 text-signal">
                      <Sparkles size={16} />
                    </div>
                    <span className="rounded bg-signal/20 px-2 py-0.5 font-mono text-[9px] font-bold text-signal uppercase tracking-wider">
                      Flagship Hub
                    </span>
                  </div>
                  <h4 className="mt-3 font-display text-sm uppercase text-white group-hover:text-signal font-bold">
                    Intelligence Center
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    Central destination for peer-reviewed papers, verified CAD, and application libraries.
                  </p>
                </div>
                <span className="mt-3 inline-flex items-center gap-1 font-mono text-[11px] font-bold uppercase text-signal">
                  Launch Center &rarr;
                </span>
              </Link>

              <Link
                to="/engineering-intelligence"
                search={{ section: "knowledge" } as any}
                onClick={() => setOpenMega(null)}
                className="group flex flex-col justify-between rounded-md border border-surface-foreground/10 bg-surface-elevated/30 p-4 transition-all hover:border-signal/50 hover:bg-surface-elevated"
              >
                <div>
                  <div className="grid size-8 place-items-center rounded bg-signal/10 text-signal">
                    <FileText size={16} />
                  </div>
                  <h4 className="mt-3 font-display text-sm uppercase text-surface-foreground group-hover:text-signal font-bold">
                    Knowledge Hub
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    In-depth papers on FOC, harmonic vs cycloidal reducers, fieldbus latency, and mounting tolerances.
                  </p>
                </div>
                <span className="mt-3 inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground group-hover:text-signal">
                  Browse Papers &rarr;
                </span>
              </Link>

              <Link
                to="/engineering-intelligence"
                search={{ section: "resources" } as any}
                onClick={() => setOpenMega(null)}
                className="group flex flex-col justify-between rounded-md border border-surface-foreground/10 bg-surface-elevated/30 p-4 transition-all hover:border-signal/50 hover:bg-surface-elevated"
              >
                <div>
                  <div className="grid size-8 place-items-center rounded bg-signal/10 text-signal">
                    <Cpu size={16} />
                  </div>
                  <h4 className="mt-3 font-display text-sm uppercase text-surface-foreground group-hover:text-signal font-bold">
                    Resource Library
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    Traceable product datasheets, 2D dimensional drawings, 3D CAD STEP models, and manuals.
                  </p>
                </div>
                <span className="mt-3 inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground group-hover:text-signal">
                  Search Files &rarr;
                </span>
              </Link>

              <Link
                to="/engineering-intelligence"
                search={{ section: "applications" } as any}
                onClick={() => setOpenMega(null)}
                className="group flex flex-col justify-between rounded-md border border-surface-foreground/10 bg-surface-elevated/30 p-4 transition-all hover:border-signal/50 hover:bg-surface-elevated"
              >
                <div>
                  <div className="grid size-8 place-items-center rounded bg-signal/10 text-signal">
                    <Factory size={16} />
                  </div>
                  <h4 className="mt-3 font-display text-sm uppercase text-surface-foreground group-hover:text-signal font-bold">
                    Application Library
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    Multi-sector problem statements, shock load mitigation, cleanrooms, and takt optimization.
                  </p>
                </div>
                <span className="mt-3 inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground group-hover:text-signal">
                  View Solutions &rarr;
                </span>
              </Link>
            </div>

            <div className="mt-6 border-t border-border/20 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
              <Link
                to="/engineering-intelligence"
                onClick={() => setOpenMega(null)}
                className="font-bold uppercase tracking-wider text-signal hover:underline inline-flex items-center gap-1.5"
              >
                Visit Engineering Intelligence Center <ArrowRight size={13} />
              </Link>
              <div className="flex items-center gap-4">
                <Link
                  to="/resources"
                  onClick={() => setOpenMega(null)}
                  className="text-muted-foreground hover:text-surface-foreground font-medium"
                >
                  Product Catalogue &amp; Specs →
                </Link>
                <Link
                  to="/resources/faqs"
                  onClick={() => setOpenMega(null)}
                  className="text-muted-foreground hover:text-surface-foreground font-medium"
                >
                  Engineering FAQs →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COMPANY DROPDOWN */}
      {openMega === "company" && (
        <div
          id="mega-menu-company"
          role="region"
          aria-label="Company Navigation Menu"
          className="absolute inset-x-0 top-20 hidden border-b border-border/40 bg-surface-dark/98 shadow-2xl backdrop-blur-2xl lg:block animate-in fade-in slide-in-from-top-1 duration-150"
        >
          <div className="mx-auto max-w-[1440px] px-6 lg:px-10 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/about"
                onClick={() => setOpenMega(null)}
                className="group flex items-start gap-3 rounded-md border border-surface-foreground/10 bg-surface-elevated/30 p-4 transition-all hover:border-signal/50 hover:bg-surface-elevated"
              >
                <div className="grid size-8 place-items-center rounded bg-signal/10 text-signal shrink-0">
                  <Factory size={16} />
                </div>
                <div>
                  <h4 className="font-display text-sm uppercase text-surface-foreground group-hover:text-signal font-bold">
                    About INDUS
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    Our precision engineering mission, manufacturing facilities, and platform values.
                  </p>
                </div>
              </Link>

              <Link
                to="/careers"
                onClick={() => setOpenMega(null)}
                className="group flex items-start gap-3 rounded-md border border-surface-foreground/10 bg-surface-elevated/30 p-4 transition-all hover:border-signal/50 hover:bg-surface-elevated"
              >
                <div className="grid size-8 place-items-center rounded bg-signal/10 text-signal shrink-0">
                  <Layers size={16} />
                </div>
                <div>
                  <h4 className="font-display text-sm uppercase text-surface-foreground group-hover:text-signal font-bold">
                    Careers & Culture
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    Join our team of robotics architects, control engineers, and motion specialists.
                  </p>
                </div>
              </Link>

              <Link
                to="/contact"
                onClick={() => setOpenMega(null)}
                className="group flex items-start gap-3 rounded-md border border-surface-foreground/10 bg-surface-elevated/30 p-4 transition-all hover:border-signal/50 hover:bg-surface-elevated"
              >
                <div className="grid size-8 place-items-center rounded bg-signal/10 text-signal shrink-0">
                  <MessageSquare size={16} />
                </div>
                <div>
                  <h4 className="font-display text-sm uppercase text-surface-foreground group-hover:text-signal font-bold">
                    Contact Engineering
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    Direct communication with technical support, offices, and regional application teams.
                  </p>
                </div>
              </Link>
            </div>

            <div className="mt-6 border-t border-border/20 pt-4 flex justify-between items-center text-xs">
              <Link
                to="/contact/engineering-enquiry"
                onClick={() => setOpenMega(null)}
                className="font-bold uppercase tracking-wider text-signal hover:underline inline-flex items-center gap-1.5"
              >
                Submit Detailed Project Enquiry <ArrowRight size={13} />
              </Link>
              <Link
                to="/book-consultation"
                onClick={() => setOpenMega(null)}
                className="text-signal hover:underline font-bold uppercase inline-flex items-center gap-1"
              >
                <Calendar size={13} /> Book Application Review
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </header>
  );
}
