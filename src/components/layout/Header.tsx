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
          className="flex items-center gap-3 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
          aria-label="INDUS Robotics Home"
        >
          <span className="grid size-9 place-items-center border border-signal bg-signal/10 text-signal shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Move3d size={20} />
          </span>
          <span>
            <b className="block font-display text-xl leading-none tracking-wider text-surface-foreground">
              {companyConfig.brandName}
            </b>
            <span className="text-[9px] font-bold uppercase tracking-[.24em] text-muted-foreground">
              Industrial Robotics
            </span>
          </span>
        </Link>

        {/* Desktop Main Navigation */}
        <nav
          className="hidden items-center gap-5 xl:gap-7 2xl:gap-8 xl:flex"
          aria-label="Primary navigation"
        >
          {/* Products Mega Trigger */}
          <div className="relative">
            <button
              id="nav-trigger-products"
              onClick={() => toggleMega("products")}
              className={`flex items-center gap-1.5 py-2 text-xs font-bold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal ${
                openMega === "products" || currentPath.startsWith("/products")
                  ? "text-signal"
                  : "text-surface-foreground/80 hover:text-signal"
              }`}
              aria-expanded={openMega === "products"}
              aria-controls="mega-menu-products"
            >
              Products
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${openMega === "products" ? "rotate-180 text-signal" : ""}`}
              />
            </button>
          </div>

          {/* Solutions Dropdown Trigger */}
          <div className="relative">
            <button
              id="nav-trigger-solutions"
              onClick={() => toggleMega("solutions")}
              className={`flex items-center gap-1.5 py-2 text-xs font-bold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal ${
                openMega === "solutions" || currentPath.startsWith("/solutions")
                  ? "text-signal"
                  : "text-surface-foreground/80 hover:text-signal"
              }`}
              aria-expanded={openMega === "solutions"}
              aria-controls="mega-menu-solutions"
            >
              Solutions
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${openMega === "solutions" ? "rotate-180 text-signal" : ""}`}
              />
            </button>
          </div>

          {/* Applications Dropdown Trigger */}
          <div className="relative">
            <button
              id="nav-trigger-applications"
              onClick={() => toggleMega("applications")}
              className={`flex items-center gap-1.5 py-2 text-xs font-bold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal ${
                openMega === "applications" || currentPath.startsWith("/applications")
                  ? "text-signal"
                  : "text-surface-foreground/80 hover:text-signal"
              }`}
              aria-expanded={openMega === "applications"}
              aria-controls="mega-menu-applications"
            >
              Applications
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${openMega === "applications" ? "rotate-180 text-signal" : ""}`}
              />
            </button>
          </div>

          {/* Technology Dropdown Trigger */}
          <div className="relative">
            <button
              id="nav-trigger-technology"
              onClick={() => toggleMega("technology")}
              className={`flex items-center gap-1.5 py-2 text-xs font-bold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal ${
                openMega === "technology" || currentPath.startsWith("/technology")
                  ? "text-signal"
                  : "text-surface-foreground/80 hover:text-signal"
              }`}
              aria-expanded={openMega === "technology"}
              aria-controls="mega-menu-technology"
            >
              Technology
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${openMega === "technology" ? "rotate-180 text-signal" : ""}`}
              />
            </button>
          </div>

          {/* Resources Dropdown Trigger */}
          <div className="relative">
            <button
              id="nav-trigger-resources"
              onClick={() => toggleMega("resources")}
              className={`flex items-center gap-1.5 py-2 text-xs font-bold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal ${
                openMega === "resources" || currentPath.startsWith("/resources")
                  ? "text-signal"
                  : "text-surface-foreground/80 hover:text-signal"
              }`}
              aria-expanded={openMega === "resources"}
              aria-controls="mega-menu-resources"
            >
              Resources
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${openMega === "resources" ? "rotate-180 text-signal" : ""}`}
              />
            </button>
          </div>

          {/* About Link */}
          <Link
            to="/about"
            className={`text-xs font-bold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal ${
              currentPath.startsWith("/about")
                ? "text-signal"
                : "text-surface-foreground/80 hover:text-signal"
            }`}
          >
            About
          </Link>

          {/* Careers Link */}
          <Link
            to="/careers"
            className={`text-xs font-bold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal ${
              currentPath.startsWith("/careers")
                ? "text-signal"
                : "text-surface-foreground/80 hover:text-signal"
            }`}
          >
            Careers
          </Link>

          {/* Contact Link */}
          <Link
            to="/contact"
            className={`text-xs font-bold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal ${
              currentPath === "/contact"
                ? "text-signal"
                : "text-surface-foreground/80 hover:text-signal"
            }`}
          >
            Contact
          </Link>
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
            className="text-surface-foreground hover:bg-surface-elevated hover:text-signal focus-visible:ring-2 focus-visible:ring-signal"
            aria-label="Open search modal"
          >
            <Search size={18} />
          </Button>

          {/* Header WhatsApp Action */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleWhatsApp}
            className="btn-whatsapp-glow hidden h-10 rounded-none border-surface-foreground/20 bg-transparent px-3 text-xs font-bold uppercase tracking-wider text-surface-foreground hover:border-signal hover:bg-surface-elevated hover:text-signal md:inline-flex focus-visible:ring-2 focus-visible:ring-signal"
            aria-label="Chat on WhatsApp"
          >
            <MessageSquare size={14} className="mr-1.5 text-signal" />
            WhatsApp
          </Button>

          {/* Primary Request a Quote Button */}
          <Button
            onClick={handleQuoteClick}
            className="btn-signal-glow hidden h-10 rounded-none bg-signal px-5 text-xs font-bold uppercase tracking-wider text-signal-foreground sm:inline-flex focus-visible:ring-2 focus-visible:ring-signal"
          >
            Request a Quote <ArrowRight size={14} className="ml-1" />
          </Button>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-surface-foreground hover:bg-surface-elevated xl:hidden focus-visible:ring-2 focus-visible:ring-signal"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      {/* PRODUCTS SUBMENU */}
      {openMega === "products" && navProducts?.groups && (
        <div
          id="mega-menu-products"
          role="region"
          aria-label="Products Navigation Menu"
          className="absolute inset-x-0 top-20 hidden max-h-[calc(100vh-5rem)] overflow-y-auto border-b border-border/40 bg-surface-dark/98 shadow-2xl backdrop-blur-2xl xl:block animate-in fade-in slide-in-from-top-1 duration-150"
        >
          <div className="mx-auto max-w-[1440px] px-10 py-6">
            <div className="grid grid-cols-6 gap-6">
              {navProducts.groups.map((group) => (
                <div
                  key={group.slug}
                  className="space-y-2 border-l border-border/20 pl-4 first:border-l-0 first:pl-0"
                >
                  <Link
                    to={group.href}
                    onClick={() => setOpenMega(null)}
                    className="group flex items-center gap-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal"
                  >
                    <span className="grid size-6 place-items-center rounded bg-signal/10 text-signal">
                      <Cpu size={14} />
                    </span>
                    <p className="font-display text-sm uppercase text-signal transition-colors group-hover:underline">
                      {group.name}
                    </p>
                  </Link>

                  <ul className="space-y-1.5 pt-1">
                    {group.items.map((sub) => (
                      <li key={sub.href}>
                        <Link
                          to={sub.href}
                          onClick={() => setOpenMega(null)}
                          className="flex items-center gap-1.5 text-xs text-surface-foreground/80 transition-colors hover:text-signal focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal"
                        >
                          <span className="size-1 rounded-full bg-signal/50" />
                          {sub.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-6 border-t border-border/20 pt-4 flex justify-between items-center text-xs">
              <Link
                to="/products"
                onClick={() => setOpenMega(null)}
                className="font-bold uppercase tracking-wider text-signal hover:underline inline-flex items-center gap-1"
              >
                Browse Complete Product Portfolio <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* SOLUTIONS SUBMENU */}
      {openMega === "solutions" && navSolutions?.items && (
        <div
          id="mega-menu-solutions"
          role="region"
          aria-label="Solutions Navigation Menu"
          className="absolute inset-x-0 top-20 hidden max-h-[calc(100vh-5rem)] overflow-y-auto border-b border-border/40 bg-surface-dark/98 shadow-2xl backdrop-blur-2xl xl:block animate-in fade-in slide-in-from-top-1 duration-150"
        >
          <div className="mx-auto max-w-[1440px] px-10 py-6">
            <div className="grid grid-cols-4 gap-3">
              {navSolutions.items.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setOpenMega(null)}
                  className="group flex items-center justify-between border border-surface-foreground/10 bg-surface-elevated/40 px-4 py-3 transition-colors hover:border-signal/50 hover:bg-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-7 place-items-center rounded bg-signal/10 text-signal">
                      <Factory size={15} />
                    </span>
                    <span className="font-display text-sm uppercase text-surface-foreground group-hover:text-signal">
                      {item.name}
                    </span>
                  </div>
                  <ArrowRight
                    size={14}
                    className="text-signal opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </Link>
              ))}
            </div>
            <div className="mt-6 border-t border-border/20 pt-4 flex justify-between items-center text-xs">
              <Link
                to="/solutions"
                onClick={() => setOpenMega(null)}
                className="font-bold uppercase tracking-wider text-signal hover:underline inline-flex items-center gap-1"
              >
                Explore All Automation Architectures <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* APPLICATIONS SUBMENU */}
      {openMega === "applications" && navApplications?.items && (
        <div
          id="mega-menu-applications"
          role="region"
          aria-label="Applications Navigation Menu"
          className="absolute inset-x-0 top-20 hidden max-h-[calc(100vh-5rem)] overflow-y-auto border-b border-border/40 bg-surface-dark/98 shadow-2xl backdrop-blur-2xl xl:block animate-in fade-in slide-in-from-top-1 duration-150"
        >
          <div className="mx-auto max-w-[1440px] px-10 py-6">
            <div className="grid grid-cols-3 gap-3">
              {navApplications.items.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setOpenMega(null)}
                  className="group flex items-center justify-between border border-surface-foreground/10 bg-surface-elevated/40 px-4 py-3 transition-colors hover:border-signal/50 hover:bg-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-7 place-items-center rounded bg-signal/10 text-signal">
                      <Wrench size={15} />
                    </span>
                    <span className="font-display text-sm uppercase text-surface-foreground group-hover:text-signal">
                      {item.name}
                    </span>
                  </div>
                  <ArrowRight
                    size={14}
                    className="text-signal opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </Link>
              ))}
            </div>
            <div className="mt-6 border-t border-border/20 pt-4 flex justify-between items-center text-xs">
              <Link
                to="/applications"
                onClick={() => setOpenMega(null)}
                className="font-bold uppercase tracking-wider text-signal hover:underline inline-flex items-center gap-1"
              >
                View All Manufacturing Sectors <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* TECHNOLOGY SUBMENU */}
      {openMega === "technology" && navTechnology?.items && (
        <div
          id="mega-menu-technology"
          role="region"
          aria-label="Technology Navigation Menu"
          className="absolute inset-x-0 top-20 hidden max-h-[calc(100vh-5rem)] overflow-y-auto border-b border-border/40 bg-surface-dark/98 shadow-2xl backdrop-blur-2xl xl:block animate-in fade-in slide-in-from-top-1 duration-150"
        >
          <div className="mx-auto max-w-[1440px] px-10 py-6">
            <div className="grid grid-cols-4 gap-3">
              {navTechnology.items.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setOpenMega(null)}
                  className="group flex items-center justify-between border border-surface-foreground/10 bg-surface-elevated/40 px-4 py-3 transition-colors hover:border-signal/50 hover:bg-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-7 place-items-center rounded bg-signal/10 text-signal">
                      <Layers size={15} />
                    </span>
                    <span className="font-display text-sm uppercase text-surface-foreground group-hover:text-signal">
                      {item.name}
                    </span>
                  </div>
                  <ArrowRight
                    size={14}
                    className="text-signal opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </Link>
              ))}
            </div>
            <div className="mt-6 border-t border-border/20 pt-4 flex justify-between items-center text-xs">
              <Link
                to="/technology"
                onClick={() => setOpenMega(null)}
                className="font-bold uppercase tracking-wider text-signal hover:underline inline-flex items-center gap-1"
              >
                Deep-Dive into Motion Technology Stack <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* RESOURCES SUBMENU */}
      {openMega === "resources" && navResources?.items && (
        <div
          id="mega-menu-resources"
          role="region"
          aria-label="Resources Navigation Menu"
          className="absolute inset-x-0 top-20 hidden max-h-[calc(100vh-5rem)] overflow-y-auto border-b border-border/40 bg-surface-dark/98 shadow-2xl backdrop-blur-2xl xl:block animate-in fade-in slide-in-from-top-1 duration-150"
        >
          <div className="mx-auto max-w-[1440px] px-10 py-6">
            <div className="grid grid-cols-3 gap-3">
              {navResources.items.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setOpenMega(null)}
                  className="group flex items-center justify-between border border-surface-foreground/10 bg-surface-elevated/40 px-4 py-3 transition-colors hover:border-signal/50 hover:bg-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-7 place-items-center rounded bg-signal/10 text-signal">
                      <FileText size={15} />
                    </span>
                    <span className="font-display text-sm uppercase text-surface-foreground group-hover:text-signal">
                      {item.name}
                    </span>
                  </div>
                  <ArrowRight
                    size={14}
                    className="text-signal opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </Link>
              ))}
            </div>
            <div className="mt-6 border-t border-border/20 pt-4 flex justify-between items-center text-xs">
              <Link
                to="/resources"
                onClick={() => setOpenMega(null)}
                className="font-bold uppercase tracking-wider text-signal hover:underline inline-flex items-center gap-1"
              >
                Visit Central Resource Center <ArrowRight size={13} />
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
