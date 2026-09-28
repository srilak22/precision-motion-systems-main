import React, { useState, useEffect, useRef } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Move3d, ChevronDown, Search, ArrowRight, MessageSquare, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navigationData } from "@/data/navigation";
import { companyConfig } from "@/data/config";
import { useModals } from "@/components/modals/ModalContext";
import { MobileNav } from "./MobileNav";

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

  // Click outside listener for desktop mega menus
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setOpenMega(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMega = (menu: string) => {
    setOpenMega(openMega === menu ? null : menu);
  };

  const handleWhatsApp = () => {
    window.open(companyConfig.getWhatsAppUrl({ type: "general" }), "_blank", "noopener,noreferrer");
  };

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 border-b border-border/40 bg-surface-dark/95 text-surface-foreground backdrop-blur-xl transition-all"
    >
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-5 lg:px-10">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 transition-opacity hover:opacity-90"
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
        <nav className="hidden items-center gap-6 xl:gap-8 lg:flex" aria-label="Primary navigation">
          {/* Products Mega Trigger */}
          <div className="relative">
            <button
              onClick={() => toggleMega("products")}
              className={`flex items-center gap-1.5 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                openMega === "products" || currentPath.startsWith("/products")
                  ? "text-signal"
                  : "text-surface-foreground/80 hover:text-signal"
              }`}
              aria-expanded={openMega === "products"}
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
              onClick={() => toggleMega("solutions")}
              className={`flex items-center gap-1.5 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                openMega === "solutions" || currentPath.startsWith("/solutions")
                  ? "text-signal"
                  : "text-surface-foreground/80 hover:text-signal"
              }`}
              aria-expanded={openMega === "solutions"}
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
              onClick={() => toggleMega("applications")}
              className={`flex items-center gap-1.5 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                openMega === "applications" || currentPath.startsWith("/applications")
                  ? "text-signal"
                  : "text-surface-foreground/80 hover:text-signal"
              }`}
              aria-expanded={openMega === "applications"}
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
              onClick={() => toggleMega("technology")}
              className={`flex items-center gap-1.5 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                openMega === "technology" || currentPath.startsWith("/technology")
                  ? "text-signal"
                  : "text-surface-foreground/80 hover:text-signal"
              }`}
              aria-expanded={openMega === "technology"}
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
              onClick={() => toggleMega("resources")}
              className={`flex items-center gap-1.5 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                openMega === "resources" || currentPath.startsWith("/resources")
                  ? "text-signal"
                  : "text-surface-foreground/80 hover:text-signal"
              }`}
              aria-expanded={openMega === "resources"}
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
            className={`text-xs font-bold uppercase tracking-wider transition-colors ${
              currentPath.startsWith("/about")
                ? "text-signal"
                : "text-surface-foreground/80 hover:text-signal"
            }`}
          >
            About
          </Link>

          {/* Contact Link */}
          <Link
            to="/contact"
            className={`text-xs font-bold uppercase tracking-wider transition-colors ${
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
            onClick={() => openModal("search")}
            className="text-surface-foreground hover:bg-surface-elevated hover:text-signal"
            aria-label="Open search"
          >
            <Search size={18} />
          </Button>

          {/* Header WhatsApp Action */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleWhatsApp}
            className="hidden h-10 rounded-none border-surface-foreground/20 bg-transparent px-3 text-xs font-bold uppercase tracking-wider text-surface-foreground hover:border-signal hover:bg-surface-elevated hover:text-signal md:inline-flex"
            aria-label="Chat on WhatsApp"
          >
            <MessageSquare size={14} className="mr-1.5 text-signal" />
            WhatsApp
          </Button>

          {/* Primary Request a Quote Button */}
          <Button
            onClick={() => openModal("quote")}
            className="hidden h-10 rounded-none bg-signal px-5 text-xs font-bold uppercase tracking-wider text-signal-foreground hover:bg-signal/90 sm:inline-flex"
          >
            Request a Quote <ArrowRight size={14} className="ml-1" />
          </Button>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-surface-foreground hover:bg-surface-elevated lg:hidden"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      {/* PRODUCTS MEGA MENU */}
      {openMega === "products" && (
        <div className="absolute inset-x-0 top-20 hidden border-b border-border/40 bg-surface-dark shadow-2xl lg:block animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="mx-auto max-w-[1440px] px-10 py-8">
            <div className="grid grid-cols-6 gap-6">
              {navigationData.products.groups?.map((group) => (
                <div key={group.slug} className="space-y-3">
                  <Link to={group.href} onClick={() => setOpenMega(null)} className="group block">
                    <p className="font-display text-base uppercase text-signal transition-colors group-hover:underline">
                      {group.name}
                    </p>
                    <p className="line-clamp-2 mt-1 text-[11px] leading-4 text-surface-foreground/60">
                      {group.description}
                    </p>
                  </Link>

                  <ul className="space-y-2 border-t border-border/20 pt-2">
                    {group.items.map((sub) => (
                      <li key={sub.href}>
                        <Link
                          to={sub.href}
                          onClick={() => setOpenMega(null)}
                          className="block text-xs text-surface-foreground/75 transition-colors hover:text-signal hover:underline"
                        >
                          {sub.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-border/30 pt-4">
              <span className="text-xs text-surface-foreground/50">
                Explore our full engineering portfolio across all 6 core categories.
              </span>
              <Link
                to="/products"
                onClick={() => setOpenMega(null)}
                className="inline-flex items-center gap-2 font-display text-sm uppercase tracking-wider text-signal hover:underline"
              >
                View All Products & Specifications →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* SOLUTIONS MEGA MENU */}
      {openMega === "solutions" && (
        <div className="absolute inset-x-0 top-20 hidden border-b border-border/40 bg-surface-dark shadow-2xl lg:block animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="mx-auto max-w-[1440px] px-10 py-8">
            <div className="mb-4">
              <p className="text-[10px] font-bold uppercase tracking-[.22em] text-signal">
                Industrial Solutions
              </p>
              <h3 className="font-display text-2xl uppercase">
                Turnkey Automation & Motion Architectures
              </h3>
            </div>
            <div className="grid grid-cols-4 gap-6">
              {navigationData.solutions.items?.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setOpenMega(null)}
                  className="group block border border-surface-foreground/10 bg-surface-elevated/40 p-4 transition-colors hover:border-signal/50 hover:bg-surface-elevated"
                >
                  <p className="font-display text-lg uppercase text-surface-foreground group-hover:text-signal">
                    {item.name}
                  </p>
                  <p className="mt-1 text-xs text-surface-foreground/60">{item.description}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold uppercase text-signal">
                    Explore →
                  </span>
                </Link>
              ))}
            </div>
            <div className="mt-6 border-t border-border/30 pt-4 text-right">
              <Link
                to="/solutions"
                onClick={() => setOpenMega(null)}
                className="font-display text-sm uppercase tracking-wider text-signal hover:underline"
              >
                View All Solutions Architecture →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* APPLICATIONS MEGA MENU */}
      {openMega === "applications" && (
        <div className="absolute inset-x-0 top-20 hidden border-b border-border/40 bg-surface-dark shadow-2xl lg:block animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="mx-auto max-w-[1440px] px-10 py-8">
            <div className="mb-4">
              <p className="text-[10px] font-bold uppercase tracking-[.22em] text-signal">
                Industry Sectors
              </p>
              <h3 className="font-display text-2xl uppercase">
                Robotics Engineered for Manufacturing Verticals
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-5">
              {navigationData.applications.items?.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setOpenMega(null)}
                  className="group block border border-surface-foreground/10 bg-surface-elevated/40 p-4 transition-colors hover:border-signal/50 hover:bg-surface-elevated"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-display text-lg uppercase text-surface-foreground group-hover:text-signal">
                      {item.name}
                    </p>
                    <ArrowRight
                      size={14}
                      className="text-signal opacity-0 transition-opacity group-hover:opacity-100"
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-surface-foreground/65">{item.description}</p>
                </Link>
              ))}
            </div>
            <div className="mt-6 border-t border-border/30 pt-4 text-right">
              <Link
                to="/applications"
                onClick={() => setOpenMega(null)}
                className="font-display text-sm uppercase tracking-wider text-signal hover:underline"
              >
                Explore All Industrial Applications →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* TECHNOLOGY MEGA MENU */}
      {openMega === "technology" && (
        <div className="absolute inset-x-0 top-20 hidden border-b border-border/40 bg-surface-dark shadow-2xl lg:block animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="mx-auto max-w-[1440px] px-10 py-8">
            <div className="mb-4">
              <p className="text-[10px] font-bold uppercase tracking-[.22em] text-signal">
                Engineering Pillars
              </p>
              <h3 className="font-display text-2xl uppercase">
                From Mechanical Motion to Industrial Intelligence
              </h3>
            </div>
            <div className="grid grid-cols-4 gap-5">
              {navigationData.technology.items?.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setOpenMega(null)}
                  className="group block border border-surface-foreground/10 bg-surface-elevated/40 p-4 transition-colors hover:border-signal/50 hover:bg-surface-elevated"
                >
                  <p className="font-display text-lg uppercase text-surface-foreground group-hover:text-signal">
                    {item.name}
                  </p>
                  <p className="mt-1.5 text-xs text-surface-foreground/65">{item.description}</p>
                </Link>
              ))}
            </div>
            <div className="mt-6 border-t border-border/30 pt-4 text-right">
              <Link
                to="/technology"
                onClick={() => setOpenMega(null)}
                className="font-display text-sm uppercase tracking-wider text-signal hover:underline"
              >
                View Full Technology Stack →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* RESOURCES MEGA MENU */}
      {openMega === "resources" && (
        <div className="absolute inset-x-0 top-20 hidden border-b border-border/40 bg-surface-dark shadow-2xl lg:block animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="mx-auto max-w-[1440px] px-10 py-8">
            <div className="mb-4">
              <p className="text-[10px] font-bold uppercase tracking-[.22em] text-signal">
                Technical Documentation
              </p>
              <h3 className="font-display text-2xl uppercase">Engineering Resource Center</h3>
            </div>
            <div className="grid grid-cols-3 gap-5">
              {navigationData.resources.items?.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setOpenMega(null)}
                  className="group block border border-surface-foreground/10 bg-surface-elevated/40 p-4 transition-colors hover:border-signal/50 hover:bg-surface-elevated"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-display text-lg uppercase text-surface-foreground group-hover:text-signal">
                      {item.name}
                    </p>
                    <ArrowRight
                      size={14}
                      className="text-signal opacity-0 transition-opacity group-hover:opacity-100"
                    />
                  </div>
                  <p className="mt-1 text-xs text-surface-foreground/65">{item.description}</p>
                </Link>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-border/30 pt-4">
              <Link
                to="/resources/faqs"
                onClick={() => setOpenMega(null)}
                className="text-xs text-surface-foreground/75 hover:text-signal hover:underline"
              >
                View Technical FAQ Knowledge Base →
              </Link>
              <Link
                to="/resources"
                onClick={() => setOpenMega(null)}
                className="font-display text-sm uppercase tracking-wider text-signal hover:underline"
              >
                Filter All Engineering Documents →
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
