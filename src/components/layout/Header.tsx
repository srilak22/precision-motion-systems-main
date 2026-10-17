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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { navigationData } from "@/data/navigation";
import { companyConfig } from "@/data/config";
import { useModals } from "@/components/modals/ModalContext";
import { MobileNav } from "./MobileNav";
import { trackDigitalPresence } from "@/trackDigitalPresence";
import { trackClarityEvent } from "@/analytics/clarity";

export function Header() {
  const [openMega, setOpenMega] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

          {/* Products Link */}
          <Link
            to="/products"
            className={`rounded-md px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              currentPath.startsWith("/products")
                ? "text-signal bg-surface-elevated/40"
                : "text-surface-foreground/80 hover:text-signal hover:bg-surface-elevated/20"
            }`}
          >
            Products
          </Link>

          {/* Solutions Dropdown Trigger */}
          <div className="relative">
            <button
              id="nav-trigger-solutions"
              onClick={() => toggleMega("solutions")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                openMega === "solutions" || currentPath.startsWith("/solutions")
                  ? "text-signal bg-surface-elevated/40"
                  : "text-surface-foreground/80 hover:text-signal hover:bg-surface-elevated/20"
              }`}
              aria-expanded={openMega === "solutions"}
              aria-controls="mega-menu-solutions"
              aria-haspopup="true"
            >
              Solutions
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${openMega === "solutions" ? "rotate-180 text-signal" : ""}`}
              />
            </button>
          </div>

          {/* Industries Dropdown Trigger */}
          <div className="relative">
            <button
              id="nav-trigger-industries"
              onClick={() => toggleMega("industries")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                openMega === "industries" || currentPath.startsWith("/applications")
                  ? "text-signal bg-surface-elevated/40"
                  : "text-surface-foreground/80 hover:text-signal hover:bg-surface-elevated/20"
              }`}
              aria-expanded={openMega === "industries"}
              aria-controls="mega-menu-industries"
              aria-haspopup="true"
            >
              Industries
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${openMega === "industries" ? "rotate-180 text-signal" : ""}`}
              />
            </button>
          </div>

          {/* Resources Dropdown Trigger */}
          <div className="relative">
            <button
              id="nav-trigger-resources"
              onClick={() => toggleMega("resources")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                openMega === "resources" || currentPath.startsWith("/resources")
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
              className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
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

      {/* SOLUTIONS DROPDOWN */}
      {openMega === "solutions" && (
        <div
          id="mega-menu-solutions"
          role="region"
          aria-label="Solutions Navigation Menu"
          className="absolute inset-x-0 top-20 hidden border-b border-border/40 bg-surface-dark/98 shadow-2xl backdrop-blur-2xl lg:block animate-in fade-in slide-in-from-top-1 duration-150"
        >
          <div className="mx-auto max-w-[1440px] px-6 lg:px-10 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Column 1: Industrial Robotics Applications */}
              <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-[.2em] text-signal">
                  Robotics & Workcells
                </p>
                <ul className="space-y-2">
                  <li>
                    <Link
                      to="/products/$category"
                      params={{ category: "industrial-robots" }}
                      onClick={() => setOpenMega(null)}
                      className="group flex items-start gap-3 rounded-md p-2.5 transition-colors hover:bg-surface-elevated"
                    >
                      <span className="grid size-8 place-items-center rounded bg-signal/10 text-signal shrink-0 mt-0.5">
                        <Cpu size={16} />
                      </span>
                      <div>
                        <span className="font-display text-sm uppercase text-surface-foreground group-hover:text-signal block font-bold">
                          Industrial Robotics
                        </span>
                        <span className="text-xs text-muted-foreground block line-clamp-1">
                          6-Axis, SCARA, and articulated heavy-payload workcells
                        </span>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/products/$category/$id"
                      params={{ category: "industrial-robots", id: "welding" }}
                      onClick={() => setOpenMega(null)}
                      className="group flex items-start gap-3 rounded-md p-2.5 transition-colors hover:bg-surface-elevated"
                    >
                      <span className="grid size-8 place-items-center rounded bg-signal/10 text-signal shrink-0 mt-0.5">
                        <Wrench size={16} />
                      </span>
                      <div>
                        <span className="font-display text-sm uppercase text-surface-foreground group-hover:text-signal block font-bold">
                          Robotic Welding
                        </span>
                        <span className="text-xs text-muted-foreground block line-clamp-1">
                          Continuous seam, laser welding, and high-duty arc cells
                        </span>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/products/$category/$id"
                      params={{ category: "robotic-arms", id: "pick-and-place" }}
                      onClick={() => setOpenMega(null)}
                      className="group flex items-start gap-3 rounded-md p-2.5 transition-colors hover:bg-surface-elevated"
                    >
                      <span className="grid size-8 place-items-center rounded bg-signal/10 text-signal shrink-0 mt-0.5">
                        <Factory size={16} />
                      </span>
                      <div>
                        <span className="font-display text-sm uppercase text-surface-foreground group-hover:text-signal block font-bold">
                          Pick and Place
                        </span>
                        <span className="text-xs text-muted-foreground block line-clamp-1">
                          High-speed delta and Cartesian sorting mechanisms
                        </span>
                      </div>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 2: Material Handling & Industry Automation */}
              <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-[.2em] text-signal">
                  Automation Systems
                </p>
                <ul className="space-y-2">
                  <li>
                    <Link
                      to="/applications/$applicationId"
                      params={{ applicationId: "manufacturing" }}
                      onClick={() => setOpenMega(null)}
                      className="group flex items-start gap-3 rounded-md p-2.5 transition-colors hover:bg-surface-elevated"
                    >
                      <span className="grid size-8 place-items-center rounded bg-signal/10 text-signal shrink-0 mt-0.5">
                        <Layers size={16} />
                      </span>
                      <div>
                        <span className="font-display text-sm uppercase text-surface-foreground group-hover:text-signal block font-bold">
                          Machine Tending
                        </span>
                        <span className="text-xs text-muted-foreground block line-clamp-1">
                          Automated CNC part loading, stamping, and press transfer
                        </span>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/solutions/$solutionId"
                      params={{ solutionId: "material-handling" }}
                      onClick={() => setOpenMega(null)}
                      className="group flex items-start gap-3 rounded-md p-2.5 transition-colors hover:bg-surface-elevated"
                    >
                      <span className="grid size-8 place-items-center rounded bg-signal/10 text-signal shrink-0 mt-0.5">
                        <Move3d size={16} />
                      </span>
                      <div>
                        <span className="font-display text-sm uppercase text-surface-foreground group-hover:text-signal block font-bold">
                          Material Handling
                        </span>
                        <span className="text-xs text-muted-foreground block line-clamp-1">
                          Conveyor integration, buffer transfer, and palletizing
                        </span>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/solutions/$solutionId"
                      params={{ solutionId: "factory-automation" }}
                      onClick={() => setOpenMega(null)}
                      className="group flex items-start gap-3 rounded-md p-2.5 transition-colors hover:bg-surface-elevated"
                    >
                      <span className="grid size-8 place-items-center rounded bg-signal/10 text-signal shrink-0 mt-0.5">
                        <Factory size={16} />
                      </span>
                      <div>
                        <span className="font-display text-sm uppercase text-surface-foreground group-hover:text-signal block font-bold">
                          Industry-Specific Automation
                        </span>
                        <span className="text-xs text-muted-foreground block line-clamp-1">
                          Turn-key assembly cells and integrated production lines
                        </span>
                      </div>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 3: Component Hardware & Direct Sizing */}
              <div className="space-y-4 border-l border-border/20 pl-6 hidden lg:block">
                <p className="text-[10px] font-bold uppercase tracking-[.2em] text-signal">
                  Precision Hardware
                </p>
                <div className="space-y-2 text-xs">
                  <Link
                    to="/products/$category"
                    params={{ category: "actuators" }}
                    onClick={() => setOpenMega(null)}
                    className="flex items-center justify-between p-2 rounded hover:bg-surface-elevated text-surface-foreground/90 hover:text-signal"
                  >
                    <span>Linear & Rotary Actuators</span>
                    <ArrowRight size={13} className="text-signal" />
                  </Link>
                  <Link
                    to="/products/$category"
                    params={{ category: "precision-reducers" }}
                    onClick={() => setOpenMega(null)}
                    className="flex items-center justify-between p-2 rounded hover:bg-surface-elevated text-surface-foreground/90 hover:text-signal"
                  >
                    <span>Planetary & Harmonic Reducers</span>
                    <ArrowRight size={13} className="text-signal" />
                  </Link>
                  <Link
                    to="/products/$category"
                    params={{ category: "robotic-wheels" }}
                    onClick={() => setOpenMega(null)}
                    className="flex items-center justify-between p-2 rounded hover:bg-surface-elevated text-surface-foreground/90 hover:text-signal"
                  >
                    <span>Robotic Wheels & AGV Modules</span>
                    <ArrowRight size={13} className="text-signal" />
                  </Link>
                </div>

                <div className="mt-4 rounded-md border border-signal/30 bg-surface-elevated/40 p-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-signal">
                    Consultation Available
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Connect with an application engineer to verify kinematic payload and cycle time.
                  </p>
                  <Link
                    to="/book-consultation"
                    onClick={() => setOpenMega(null)}
                    className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-signal hover:underline"
                  >
                    <Calendar size={13} />
                    Schedule Engineering Review
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-border/20 pt-4 flex justify-between items-center text-xs">
              <Link
                to="/solutions"
                onClick={() => setOpenMega(null)}
                className="font-bold uppercase tracking-wider text-signal hover:underline inline-flex items-center gap-1.5"
              >
                Explore Complete Solutions Overview <ArrowRight size={13} />
              </Link>
              <Link
                to="/products"
                onClick={() => setOpenMega(null)}
                className="text-muted-foreground hover:text-surface-foreground font-medium"
              >
                View Full Component Catalog →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* INDUSTRIES DROPDOWN */}
      {openMega === "industries" && (
        <div
          id="mega-menu-industries"
          role="region"
          aria-label="Industries Navigation Menu"
          className="absolute inset-x-0 top-20 hidden border-b border-border/40 bg-surface-dark/98 shadow-2xl backdrop-blur-2xl lg:block animate-in fade-in slide-in-from-top-1 duration-150"
        >
          <div className="mx-auto max-w-[1440px] px-6 lg:px-10 py-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Link
                to="/applications/$applicationId"
                params={{ applicationId: "automotive" }}
                onClick={() => setOpenMega(null)}
                className="group flex items-start gap-3 rounded-md border border-surface-foreground/10 bg-surface-elevated/30 p-4 transition-all hover:border-signal/50 hover:bg-surface-elevated"
              >
                <div className="grid size-8 place-items-center rounded bg-signal/10 text-signal shrink-0">
                  <Factory size={16} />
                </div>
                <div>
                  <h4 className="font-display text-sm uppercase text-surface-foreground group-hover:text-signal font-bold">
                    Automotive
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    BIW welding, powertrain assembly, and EV battery pack production cells.
                  </p>
                </div>
              </Link>

              <Link
                to="/applications/$applicationId"
                params={{ applicationId: "electronics" }}
                onClick={() => setOpenMega(null)}
                className="group flex items-start gap-3 rounded-md border border-surface-foreground/10 bg-surface-elevated/30 p-4 transition-all hover:border-signal/50 hover:bg-surface-elevated"
              >
                <div className="grid size-8 place-items-center rounded bg-signal/10 text-signal shrink-0">
                  <Cpu size={16} />
                </div>
                <div>
                  <h4 className="font-display text-sm uppercase text-surface-foreground group-hover:text-signal font-bold">
                    Electronics & Semiconductor
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    Micro-placement, cleanroom part transfer, and PCB optical testing.
                  </p>
                </div>
              </Link>

              <Link
                to="/applications/$applicationId"
                params={{ applicationId: "food-packaging" }}
                onClick={() => setOpenMega(null)}
                className="group flex items-start gap-3 rounded-md border border-surface-foreground/10 bg-surface-elevated/30 p-4 transition-all hover:border-signal/50 hover:bg-surface-elevated"
              >
                <div className="grid size-8 place-items-center rounded bg-signal/10 text-signal shrink-0">
                  <Layers size={16} />
                </div>
                <div>
                  <h4 className="font-display text-sm uppercase text-surface-foreground group-hover:text-signal font-bold">
                    Food and Beverage
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    Hygienic IP69K delta pick-and-place, primary bagging, and carton packing.
                  </p>
                </div>
              </Link>

              <Link
                to="/applications/$applicationId"
                params={{ applicationId: "pharmaceuticals" }}
                onClick={() => setOpenMega(null)}
                className="group flex items-start gap-3 rounded-md border border-surface-foreground/10 bg-surface-elevated/30 p-4 transition-all hover:border-signal/50 hover:bg-surface-elevated"
              >
                <div className="grid size-8 place-items-center rounded bg-signal/10 text-signal shrink-0">
                  <Wrench size={16} />
                </div>
                <div>
                  <h4 className="font-display text-sm uppercase text-surface-foreground group-hover:text-signal font-bold">
                    Pharmaceuticals
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    Cleanroom vial handling, blister packing, and sterile automated inspection.
                  </p>
                </div>
              </Link>

              <Link
                to="/applications/$applicationId"
                params={{ applicationId: "warehousing" }}
                onClick={() => setOpenMega(null)}
                className="group flex items-start gap-3 rounded-md border border-surface-foreground/10 bg-surface-elevated/30 p-4 transition-all hover:border-signal/50 hover:bg-surface-elevated"
              >
                <div className="grid size-8 place-items-center rounded bg-signal/10 text-signal shrink-0">
                  <Move3d size={16} />
                </div>
                <div>
                  <h4 className="font-display text-sm uppercase text-surface-foreground group-hover:text-signal font-bold">
                    Warehousing & Logistics
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    Autonomous mobile robot (AMR) fleets, sortation, and pallet handling.
                  </p>
                </div>
              </Link>

              <Link
                to="/applications/$applicationId"
                params={{ applicationId: "manufacturing" }}
                onClick={() => setOpenMega(null)}
                className="group flex items-start gap-3 rounded-md border border-surface-foreground/10 bg-surface-elevated/30 p-4 transition-all hover:border-signal/50 hover:bg-surface-elevated"
              >
                <div className="grid size-8 place-items-center rounded bg-signal/10 text-signal shrink-0">
                  <Factory size={16} />
                </div>
                <div>
                  <h4 className="font-display text-sm uppercase text-surface-foreground group-hover:text-signal font-bold">
                    General Manufacturing
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    CNC machine tending, casting, stamping, deburring, and metal finishing.
                  </p>
                </div>
              </Link>
            </div>

            <div className="mt-6 border-t border-border/20 pt-4 flex justify-between items-center text-xs">
              <Link
                to="/applications"
                onClick={() => setOpenMega(null)}
                className="font-bold uppercase tracking-wider text-signal hover:underline inline-flex items-center gap-1.5"
              >
                Explore All Industry Applications <ArrowRight size={13} />
              </Link>
              <Link
                to="/book-consultation"
                onClick={() => setOpenMega(null)}
                className="text-signal hover:underline font-bold uppercase inline-flex items-center gap-1"
              >
                <Calendar size={13} /> Book an Industry Application Review
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/resources"
                search={{ type: "datasheet" } as any}
                onClick={() => setOpenMega(null)}
                className="group flex items-start gap-3 rounded-md border border-surface-foreground/10 bg-surface-elevated/30 p-4 transition-all hover:border-signal/50 hover:bg-surface-elevated"
              >
                <div className="grid size-8 place-items-center rounded bg-signal/10 text-signal shrink-0">
                  <FileText size={16} />
                </div>
                <div>
                  <h4 className="font-display text-sm uppercase text-surface-foreground group-hover:text-signal font-bold">
                    Technical Resources
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    Datasheets, dimension drawings, reach diagrams, and CAD specifications.
                  </p>
                </div>
              </Link>

              <Link
                to="/resources"
                search={{ type: "case-study" } as any}
                onClick={() => setOpenMega(null)}
                className="group flex items-start gap-3 rounded-md border border-surface-foreground/10 bg-surface-elevated/30 p-4 transition-all hover:border-signal/50 hover:bg-surface-elevated"
              >
                <div className="grid size-8 place-items-center rounded bg-signal/10 text-signal shrink-0">
                  <Factory size={16} />
                </div>
                <div>
                  <h4 className="font-display text-sm uppercase text-surface-foreground group-hover:text-signal font-bold">
                    Case Studies
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    Verified automation installations, cycle time gains, and plant ROI reports.
                  </p>
                </div>
              </Link>

              <Link
                to="/resources"
                search={{ type: "article" } as any}
                onClick={() => setOpenMega(null)}
                className="group flex items-start gap-3 rounded-md border border-surface-foreground/10 bg-surface-elevated/30 p-4 transition-all hover:border-signal/50 hover:bg-surface-elevated"
              >
                <div className="grid size-8 place-items-center rounded bg-signal/10 text-signal shrink-0">
                  <Layers size={16} />
                </div>
                <div>
                  <h4 className="font-display text-sm uppercase text-surface-foreground group-hover:text-signal font-bold">
                    Engineering Insights
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    Articles on kinematic sizing, thermal duty cycles, and fieldbus deterministic sync.
                  </p>
                </div>
              </Link>
            </div>

            <div className="mt-6 border-t border-border/20 pt-4 flex justify-between items-center text-xs">
              <Link
                to="/resources"
                onClick={() => setOpenMega(null)}
                className="font-bold uppercase tracking-wider text-signal hover:underline inline-flex items-center gap-1.5"
              >
                Visit Central Technical Resource Center <ArrowRight size={13} />
              </Link>
              <Link
                to="/resources/faqs"
                onClick={() => setOpenMega(null)}
                className="text-muted-foreground hover:text-surface-foreground font-medium"
              >
                Frequently Asked Technical Questions →
              </Link>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                to="/about/engineering"
                onClick={() => setOpenMega(null)}
                className="group flex items-start gap-3 rounded-md border border-surface-foreground/10 bg-surface-elevated/30 p-4 transition-all hover:border-signal/50 hover:bg-surface-elevated"
              >
                <div className="grid size-8 place-items-center rounded bg-signal/10 text-signal shrink-0">
                  <Cpu size={16} />
                </div>
                <div>
                  <h4 className="font-display text-sm uppercase text-surface-foreground group-hover:text-signal font-bold">
                    Engineering Approach
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    Deterministic motion design, metrology calibration, and ISO compliance.
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
