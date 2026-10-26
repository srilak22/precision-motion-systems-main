import React, { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  Plus,
  Minus,
  ArrowRight,
  MessageSquare,
  Search,
  Calendar,
  Layers,
  Factory,
  Wrench,
  Building2,
  ChevronRight,
  Calculator,
  GitCompare,
  Cpu,
  Sparkles,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { companyConfig } from "@/data/config";
import { useModals } from "@/components/modals/ModalContext";
import { TOP_LEVEL_CATEGORIES } from "@/data/productTaxonomy";
import { ALL_18_APPLICATIONS } from "@/data/applicationsUniverse";

export function MobileNav({
  isOpen,
  onClose,
  isScrolled = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  isScrolled?: boolean;
}) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const { openModal } = useModals();

  // Lock background body scroll when mobile menu is open & listen for Escape
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggle = (key: string) => {
    setExpandedSection(expandedSection === key ? null : key);
  };

  const toggleCategory = (catId: string) => {
    setExpandedCategory(expandedCategory === catId ? null : catId);
  };

  const handleWhatsApp = () => {
    onClose();
    window.open(companyConfig.getWhatsAppUrl({ type: "general" }), "_blank", "noopener,noreferrer");
  };

  const handleQuote = () => {
    onClose();
    openModal("quote");
  };

  const handleSearch = () => {
    onClose();
    openModal("search");
  };

  return (
    <div
      id="mobile-navigation"
      role="dialog"
      aria-label="Mobile Navigation Menu"
      aria-modal="true"
      className={`fixed inset-x-0 bottom-0 z-50 overflow-y-auto overflow-x-hidden border-t border-white/10 bg-surface-dark/98 backdrop-blur-2xl px-5 py-5 text-surface-foreground lg:hidden animate-in fade-in slide-in-from-top-2 duration-200 ${
        isScrolled ? "top-16" : "top-20"
      }`}
    >
      <div className="space-y-1">
        {/* HOME LINK */}
        <div className="border-b border-border/20 py-2">
          <Link
            to="/"
            onClick={onClose}
            className="flex min-h-[44px] items-center font-display text-lg uppercase tracking-wide text-surface-foreground hover:text-signal"
          >
            Home
          </Link>
        </div>

        {/* QUICK ACCESS ENGINEERING TOOLS SHORTCUT STRIP */}
        <div className="py-3 border-b border-border/20">
          <div className="grid grid-cols-3 gap-2">
            <Link
              to="/technology/calculators"
              onClick={onClose}
              className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-surface-elevated/70 border border-white/10 text-surface-foreground hover:text-signal hover:border-signal/30 transition-all text-center"
            >
              <Calculator size={17} className="mb-1 text-signal" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Calculators</span>
              <span className="text-[8px] font-mono text-muted-foreground">ISO/DIN</span>
            </Link>
            <Link
              to="/products/compare"
              onClick={onClose}
              className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-surface-elevated/70 border border-white/10 text-surface-foreground hover:text-signal hover:border-signal/30 transition-all text-center"
            >
              <GitCompare size={17} className="mb-1 text-signal" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Compare</span>
              <span className="text-[8px] font-mono text-muted-foreground">Side-by-Side</span>
            </Link>
            <Link
              to="/technology/motion-studio"
              onClick={onClose}
              className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-surface-elevated/70 border border-white/10 text-surface-foreground hover:text-signal hover:border-signal/30 transition-all text-center"
            >
              <Cpu size={17} className="mb-1 text-signal" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Studio</span>
              <span className="text-[8px] font-mono text-muted-foreground">6-Axis Live</span>
            </Link>
          </div>
        </div>

        {/* 1. PRODUCTS ACCORDION (8 TOP-LEVEL CATEGORIES, 240+ RANGES) */}
        <div className="border-b border-border/20 py-2">
          <button
            onClick={() => toggle("products")}
            aria-expanded={expandedSection === "products"}
            aria-controls="mobile-section-products"
            className="flex min-h-[44px] w-full items-center justify-between py-2 text-left font-display text-lg uppercase tracking-wide text-surface-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
          >
            <span className="flex items-center gap-2">
              <Layers size={18} className="text-signal" />
              Products Portfolio
            </span>
            <span className="text-signal">
              {expandedSection === "products" ? <Minus size={18} /> : <Plus size={18} />}
            </span>
          </button>
          {expandedSection === "products" && (
            <div
              id="mobile-section-products"
              className="mt-2 space-y-2 pb-3 pl-3 animate-in fade-in duration-150"
            >
              <Link
                to="/products"
                onClick={onClose}
                className="flex min-h-[40px] items-center justify-between rounded bg-signal/10 px-3 text-xs font-bold uppercase tracking-wider text-signal hover:bg-signal/20"
              >
                <span>View Full Catalogue (240+ Ranges)</span>
                <ArrowRight size={14} />
              </Link>

              {/* 8 MASTER CATEGORIES */}
              <div className="space-y-1 pt-1">
                {TOP_LEVEL_CATEGORIES.map((cat) => {
                  const isCatExpanded = expandedCategory === cat.id;
                  return (
                    <div key={cat.id} className="rounded border border-border/30 bg-surface-elevated/40">
                      <div className="flex items-center justify-between px-3 py-2">
                        <Link
                          to={cat.primaryRoute as any}
                          onClick={onClose}
                          className="flex flex-col text-left hover:text-signal"
                        >
                          <span className="text-xs font-bold text-foreground">
                            {cat.title}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {cat.rangeCountBadge}
                          </span>
                        </Link>
                        <button
                          onClick={() => toggleCategory(cat.id)}
                          aria-label={`Toggle ${cat.title} ranges`}
                          className="p-1 text-muted-foreground hover:text-signal"
                        >
                          {isCatExpanded ? <Minus size={14} /> : <Plus size={14} />}
                        </button>
                      </div>

                      {/* Expanded Sub-ranges */}
                      {isCatExpanded && (
                        <div className="border-t border-border/30 bg-black/20 px-3 py-2 space-y-1.5 animate-in fade-in duration-100">
                          {cat.groups.flatMap((g) => g.items).slice(0, 6).map((item) => (
                            <Link
                              key={item.id}
                              to={item.href as any}
                              onClick={onClose}
                              className="flex items-center justify-between text-[11px] text-surface-foreground/80 hover:text-signal py-0.5"
                            >
                              <span className="truncate pr-2">{item.name}</span>
                              <span className="text-[9px] font-mono text-signal/80 shrink-0">
                                {item.specHighlight.split("|")[0].trim()}
                              </span>
                            </Link>
                          ))}
                          <Link
                            to={cat.primaryRoute as any}
                            onClick={onClose}
                            className="block pt-1 text-[10px] font-bold uppercase tracking-wider text-signal hover:underline"
                          >
                            Explore All {cat.shortTitle} Ranges →
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 2. APPLICATIONS ACCORDION (18 RESEARCHED VERTICALS, 220+ USE CASES) */}
        <div className="border-b border-border/20 py-2">
          <button
            onClick={() => toggle("applications")}
            aria-expanded={expandedSection === "applications"}
            aria-controls="mobile-section-applications"
            className="flex min-h-[44px] w-full items-center justify-between py-2 text-left font-display text-lg uppercase tracking-wide text-surface-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
          >
            <span className="flex items-center gap-2">
              <Factory size={18} className="text-signal" />
              18 Application Verticals
            </span>
            <span className="text-signal">
              {expandedSection === "applications" ? <Minus size={18} /> : <Plus size={18} />}
            </span>
          </button>
          {expandedSection === "applications" && (
            <div
              id="mobile-section-applications"
              className="mt-2 space-y-2 pb-3 pl-3 animate-in fade-in duration-150"
            >
              <Link
                to="/applications"
                onClick={onClose}
                className="flex min-h-[40px] items-center justify-between rounded bg-signal/10 px-3 text-xs font-bold uppercase tracking-wider text-signal hover:bg-signal/20"
              >
                <span>All 18 Applications (220+ Use Cases)</span>
                <ArrowRight size={14} />
              </Link>
              <div className="grid grid-cols-1 gap-1 pt-1 max-h-72 overflow-y-auto pr-1">
                {ALL_18_APPLICATIONS.map((app) => (
                  <Link
                    key={app.id}
                    to="/applications/$applicationId"
                    params={{ applicationId: app.slug || app.id }}
                    onClick={onClose}
                    className="flex min-h-[36px] items-center justify-between rounded px-2 text-xs text-surface-foreground/80 hover:bg-surface-elevated hover:text-signal"
                  >
                    <span className="truncate pr-2">{app.name}</span>
                    <span className="text-[10px] font-mono text-signal/80 shrink-0">
                      {app.useCases.length} Cases
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 3. ENGINEERING TOOLS & RESOURCES ACCORDION */}
        <div className="border-b border-border/20 py-2">
          <button
            onClick={() => toggle("resources")}
            aria-expanded={expandedSection === "resources"}
            aria-controls="mobile-section-resources"
            className="flex min-h-[44px] w-full items-center justify-between py-2 text-left font-display text-lg uppercase tracking-wide text-surface-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
          >
            <span className="flex items-center gap-2">
              <Wrench size={18} className="text-signal" />
              Engineering Suite & Tools
            </span>
            <span className="text-signal">
              {expandedSection === "resources" ? <Minus size={18} /> : <Plus size={18} />}
            </span>
          </button>
          {expandedSection === "resources" && (
            <div
              id="mobile-section-resources"
              className="mt-2 space-y-2 pb-3 pl-3 animate-in fade-in duration-150"
            >
              <Link
                to="/engineering-services"
                onClick={onClose}
                className="flex min-h-[40px] items-center justify-between rounded bg-signal/10 px-3 text-xs font-bold uppercase tracking-wider text-signal hover:bg-signal/20"
              >
                <span>Engineering Services Portfolio</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                to="/technology/calculators"
                onClick={onClose}
                className="flex min-h-[36px] items-center justify-between text-xs text-surface-foreground/80 hover:text-signal"
              >
                <span>Motion Sizing Calculators (Ball Screw / Inertia)</span>
                <span className="rounded bg-signal/20 px-1.5 py-0.5 text-[9px] font-mono text-signal">ISO</span>
              </Link>
              <Link
                to="/products/compare"
                onClick={onClose}
                className="flex min-h-[36px] items-center justify-between text-xs text-surface-foreground/80 hover:text-signal"
              >
                <span>Component Specification Comparator</span>
                <span className="rounded bg-signal/20 px-1.5 py-0.5 text-[9px] font-mono text-signal">Matrix</span>
              </Link>
              <Link
                to="/technology/motion-studio"
                onClick={onClose}
                className="flex min-h-[36px] items-center justify-between text-xs text-surface-foreground/80 hover:text-signal"
              >
                <span>INDUS Motion Studio (Kinematic Sizing)</span>
                <span className="rounded bg-signal/20 px-1.5 py-0.5 text-[9px] font-mono text-signal">Live</span>
              </Link>
              <Link
                to="/technology/intelligent-actuators"
                onClick={onClose}
                className="flex min-h-[36px] items-center justify-between text-xs text-surface-foreground/80 hover:text-signal font-semibold"
              >
                <span>Intelligent Actuator Studio (Comparison &amp; Telemetry)</span>
                <span className="rounded bg-signal/20 px-1.5 py-0.5 text-[9px] font-mono text-signal">Studio</span>
              </Link>
              <Link
                to="/technology/architecture-explorer"
                onClick={onClose}
                className="flex min-h-[36px] items-center text-xs text-surface-foreground/80 hover:text-signal"
              >
                Robotic Architecture Explorer (Signal / Bus)
              </Link>
              <Link
                to="/technology/knowledge-graph"
                onClick={onClose}
                className="flex min-h-[36px] items-center text-xs text-surface-foreground/80 hover:text-signal"
              >
                Robotics Knowledge Graph (520+ Nodes)
              </Link>
              <Link
                to="/engineering-intelligence"
                onClick={onClose}
                className="flex min-h-[36px] items-center text-xs text-surface-foreground/80 hover:text-signal"
              >
                Engineering Intelligence Center
              </Link>
              <Link
                to="/resources/faqs"
                onClick={onClose}
                className="flex min-h-[36px] items-center text-xs text-surface-foreground/80 hover:text-signal"
              >
                Technical FAQs & Standards
              </Link>
            </div>
          )}
        </div>

        {/* 4. COMPANY ACCORDION */}
        <div className="border-b border-border/20 py-2">
          <button
            onClick={() => toggle("company")}
            aria-expanded={expandedSection === "company"}
            aria-controls="mobile-section-company"
            className="flex min-h-[44px] w-full items-center justify-between py-2 text-left font-display text-lg uppercase tracking-wide text-surface-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
          >
            <span className="flex items-center gap-2">
              <Building2 size={18} className="text-signal" />
              Company & Contact
            </span>
            <span className="text-signal">
              {expandedSection === "company" ? <Minus size={18} /> : <Plus size={18} />}
            </span>
          </button>
          {expandedSection === "company" && (
            <div
              id="mobile-section-company"
              className="mt-2 space-y-2 pb-3 pl-3 animate-in fade-in duration-150"
            >
              <Link
                to="/about"
                onClick={onClose}
                className="flex min-h-[36px] items-center text-xs text-surface-foreground/80 hover:text-signal"
              >
                About INDUS Robotics
              </Link>
              <Link
                to="/careers"
                onClick={onClose}
                className="flex min-h-[36px] items-center text-xs text-surface-foreground/80 hover:text-signal"
              >
                Careers & Engineering Culture
              </Link>
              <Link
                to="/contact"
                onClick={onClose}
                className="flex min-h-[36px] items-center text-xs text-surface-foreground/80 hover:text-signal"
              >
                Contact Technical Desk
              </Link>
              <Link
                to="/contact/engineering-enquiry"
                onClick={onClose}
                className="flex min-h-[36px] items-center text-xs text-surface-foreground/80 hover:text-signal"
              >
                Submit Custom Engineering RFQ
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* SEARCH BUTTON IN DRAWER */}
      <div className="mt-6">
        <button
          onClick={handleSearch}
          className="flex h-11 w-full items-center justify-between rounded-lg border border-white/15 bg-surface-elevated/80 px-4 text-xs font-bold uppercase tracking-wider text-surface-foreground hover:border-signal/50 hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal cursor-pointer"
        >
          <span className="flex items-center gap-2.5">
            <Search size={16} className="text-signal" />
            <span>Search Platform Catalogue</span>
          </span>
          <kbd className="rounded bg-black/40 px-1.5 py-0.5 text-[10px] font-mono font-bold text-muted-foreground border border-white/10">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* MOBILE CTAs */}
      <div className="mt-5 space-y-2.5 pb-8">
        <Button
          asChild
          variant="default"
          size="lg"
          className="w-full rounded-lg bg-[#155EEF] hover:bg-[#1047BF] text-white font-bold uppercase tracking-wider text-xs shadow-md"
        >
          <Link to="/application-finder" onClick={onClose}>
            <Compass size={16} className="mr-2" />
            Find the Right Solution
          </Link>
        </Button>
        <Button
          asChild
          variant="default"
          size="lg"
          className="w-full rounded-lg bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-500 text-white font-bold uppercase tracking-wider text-xs shadow-[0_0_20px_rgba(35,136,255,0.35)]"
        >
          <Link to="/book-consultation" onClick={onClose}>
            <Calendar size={16} className="mr-2" />
            Book a Technical Consultation
          </Link>
        </Button>
        <Button
          onClick={handleQuote}
          variant="outline"
          size="lg"
          className="w-full rounded-lg border-white/15 bg-surface-elevated/40 text-surface-foreground hover:border-signal/50 hover:text-signal text-xs font-bold uppercase tracking-wider"
        >
          Request an Engineering Quote <ArrowRight size={14} className="ml-1.5" />
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={handleWhatsApp}
          className="w-full rounded-lg border-white/15 bg-transparent text-surface-foreground hover:border-signal/50 hover:text-signal text-xs font-bold uppercase tracking-wider"
        >
          <MessageSquare size={16} className="mr-2 text-signal" />
          Chat on WhatsApp with Specialist
        </Button>
      </div>
    </div>
  );
}

