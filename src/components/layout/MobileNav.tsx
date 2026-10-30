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
  Briefcase,
  FileText,
  ShieldCheck,
  Download,
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
  onQuoteClick,
  onWhatsAppClick,
}: {
  isOpen: boolean;
  onClose: () => void;
  isScrolled?: boolean;
  onQuoteClick?: () => void;
  onWhatsAppClick?: () => void;
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
                    <div
                      key={cat.id}
                      className="rounded border border-border/30 bg-surface-elevated/40"
                    >
                      <div className="flex items-center justify-between px-3 py-2">
                        <Link
                          to={cat.primaryRoute as never}
                          onClick={onClose}
                          className="flex flex-col text-left hover:text-signal"
                        >
                          <span className="text-xs font-bold text-foreground">{cat.title}</span>
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
                          {cat.groups
                            .flatMap((g) => g.items)
                            .slice(0, 6)
                            .map((item) => (
                              <Link
                                key={item.id}
                                to={item.href as never}
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
                            to={cat.primaryRoute as never}
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

        {/* 2. INDUSTRIES ACCORDION (8 PRIMARY MANUFACTURING SECTORS) */}
        <div className="border-b border-border/20 py-2">
          <button
            onClick={() => toggle("industries")}
            aria-expanded={expandedSection === "industries"}
            aria-controls="mobile-section-industries"
            className="flex min-h-[44px] w-full items-center justify-between py-2 text-left font-display text-lg uppercase tracking-wide text-surface-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Factory size={18} className="text-signal" />
              Industries Served
            </span>
            <span className="text-signal">
              {expandedSection === "industries" ? <Minus size={18} /> : <Plus size={18} />}
            </span>
          </button>
          {expandedSection === "industries" && (
            <div
              id="mobile-section-industries"
              className="mt-2 space-y-1.5 pb-3 pl-3 animate-in fade-in duration-150"
            >
              <Link
                to="/applications"
                onClick={onClose}
                className="flex min-h-[40px] items-center justify-between rounded bg-signal/10 px-3 text-xs font-bold uppercase tracking-wider text-signal hover:bg-signal/20 mb-2"
              >
                <span>Explore All 18 Manufacturing Verticals</span>
                <ArrowRight size={14} />
              </Link>

              {[
                { name: "Automotive & EV Manufacturing", slug: "automotive", tag: "Takt <48s" },
                { name: "Electronics & Semiconductors", slug: "electronics", tag: "ISO Class 1" },
                { name: "Aerospace & Defence", slug: "aerospace", tag: "AS9100" },
                { name: "Medical Devices & Healthcare", slug: "medical", tag: "ISO 13485" },
                { name: "Warehousing & Intralogistics", slug: "warehousing", tag: "AMR / AGV" },
                { name: "Metal Fabrication & Machining", slug: "metal-machining", tag: "High Rigidity" },
                { name: "Food & Packaging Automation", slug: "food-beverage", tag: "Washdown IP69K" },
                { name: "Energy & Utilities", slug: "energy", tag: "Subsea / High-V" },
              ].map((ind) => (
                <Link
                  key={ind.slug}
                  to="/applications/$applicationId"
                  params={{ applicationId: ind.slug }}
                  onClick={onClose}
                  className="flex items-center justify-between text-xs text-surface-foreground/80 hover:text-signal py-1.5 px-2 rounded hover:bg-surface-elevated/40"
                >
                  <span className="truncate pr-2 font-medium">{ind.name}</span>
                  <span className="text-[9px] font-mono text-signal bg-signal/10 px-1.5 py-0.5 rounded shrink-0">
                    {ind.tag}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* ENGINEERING SUITE ACCORDION */}
        <div className="border-b border-border/20 py-2">
          <button
            onClick={() => toggle("engineering")}
            aria-expanded={expandedSection === "engineering"}
            aria-controls="mobile-section-engineering"
            className="flex min-h-[44px] w-full items-center justify-between py-2 text-left font-display text-lg uppercase tracking-wide text-surface-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Wrench size={18} className="text-signal" />
              Engineering Suite
            </span>
            <span className="text-signal">
              {expandedSection === "engineering" ? <Minus size={18} /> : <Plus size={18} />}
            </span>
          </button>
          {expandedSection === "engineering" && (
            <div
              id="mobile-section-engineering"
              className="mt-2 space-y-2 pb-3 pl-3 animate-in fade-in duration-150"
            >
              <Link
                to="/engineering-services"
                onClick={onClose}
                className="flex min-h-[36px] items-center text-xs font-bold text-signal hover:underline"
              >
                Engineering Hub &amp; Capabilities →
              </Link>
              <Link
                to="/engineering-services/system-integration"
                onClick={onClose}
                className="flex min-h-[36px] items-center text-xs text-surface-foreground/80 hover:text-signal"
              >
                System Integration Engineering
              </Link>
              <Link
                to="/engineering-services/technical-specifications"
                onClick={onClose}
                className="flex min-h-[36px] items-center text-xs text-surface-foreground/80 hover:text-signal"
              >
                Technical Specifications Reference
              </Link>
              <Link
                to="/engineering-services/cad-downloads"
                onClick={onClose}
                className="flex min-h-[36px] items-center text-xs text-surface-foreground/80 hover:text-signal"
              >
                CAD &amp; Engineering Downloads
              </Link>
              <Link
                to="/engineering-services/quality-standards"
                onClick={onClose}
                className="flex min-h-[36px] items-center text-xs text-surface-foreground/80 hover:text-signal"
              >
                Quality &amp; Standards (ISO/DIN)
              </Link>
              <Link
                to="/technology/calculators"
                onClick={onClose}
                className="flex min-h-[36px] items-center text-xs text-surface-foreground/80 hover:text-signal"
              >
                Kinematic Sizing Calculators
              </Link>
            </div>
          )}
        </div>

        {/* RESOURCES ACCORDION */}
        <div className="border-b border-border/20 py-2">
          <button
            onClick={() => toggle("resources")}
            aria-expanded={expandedSection === "resources"}
            aria-controls="mobile-section-resources"
            className="flex min-h-[44px] w-full items-center justify-between py-2 text-left font-display text-lg uppercase tracking-wide text-surface-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <FileText size={18} className="text-signal" />
              Resources &amp; Support
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
                to="/resources"
                onClick={onClose}
                className="flex min-h-[36px] items-center text-xs font-bold text-signal hover:underline"
              >
                Resource Center Overview →
              </Link>
              <Link
                to="/engineering-intelligence"
                onClick={onClose}
                className="flex min-h-[36px] items-center text-xs text-surface-foreground/80 hover:text-signal"
              >
                Engineering Intelligence Center
              </Link>
              <Link
                to="/resources/case-studies"
                onClick={onClose}
                className="flex min-h-[36px] items-center text-xs text-surface-foreground/80 hover:text-signal"
              >
                Application Case Studies
              </Link>
              <Link
                to="/resources/faqs"
                onClick={onClose}
                className="flex min-h-[36px] items-center text-xs text-surface-foreground/80 hover:text-signal"
              >
                Technical FAQs &amp; Knowledge
              </Link>
            </div>
          )}
        </div>

        {/* 3. CAREER ACCORDION */}
        <div className="border-b border-border/20 py-2">
          <button
            onClick={() => toggle("careers")}
            aria-expanded={expandedSection === "careers"}
            aria-controls="mobile-section-careers"
            className="flex min-h-[44px] w-full items-center justify-between py-2 text-left font-display text-lg uppercase tracking-wide text-surface-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Briefcase size={18} className="text-signal" />
              Careers &amp; Culture
            </span>
            <span className="text-signal">
              {expandedSection === "careers" ? <Minus size={18} /> : <Plus size={18} />}
            </span>
          </button>
          {expandedSection === "careers" && (
            <div
              id="mobile-section-careers"
              className="mt-2 space-y-2 pb-3 pl-3 animate-in fade-in duration-150"
            >
              <Link
                to="/careers"
                onClick={onClose}
                className="flex min-h-[36px] items-center text-xs font-bold text-signal hover:underline"
              >
                Careers Portal Overview →
              </Link>
              <Link
                to="/careers"
                hash="open-positions"
                onClick={onClose}
                className="flex min-h-[36px] items-center text-xs text-surface-foreground/80 hover:text-signal"
              >
                Open Positions (4 Verified Roles)
              </Link>
              <Link
                to="/careers"
                hash="apply"
                onClick={onClose}
                className="flex min-h-[36px] items-center text-xs text-surface-foreground/80 hover:text-signal"
              >
                Submit Resume / Profile
              </Link>
              <Link
                to="/careers"
                hash="internships"
                onClick={onClose}
                className="flex min-h-[36px] items-center text-xs text-surface-foreground/80 hover:text-signal"
              >
                Internship Opportunities (6-Month R&amp;D)
              </Link>
              <Link
                to="/careers"
                hash="culture"
                onClick={onClose}
                className="flex min-h-[36px] items-center text-xs text-surface-foreground/80 hover:text-signal"
              >
                Engineering Culture &amp; Values
              </Link>
            </div>
          )}
        </div>

        {/* 4. ABOUT ACCORDION */}
        <div className="border-b border-border/20 py-2">
          <button
            onClick={() => toggle("about")}
            aria-expanded={expandedSection === "about"}
            aria-controls="mobile-section-about"
            className="flex min-h-[44px] w-full items-center justify-between py-2 text-left font-display text-lg uppercase tracking-wide text-surface-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Building2 size={18} className="text-signal" />
              About INDUS
            </span>
            <span className="text-signal">
              {expandedSection === "about" ? <Minus size={18} /> : <Plus size={18} />}
            </span>
          </button>
          {expandedSection === "about" && (
            <div
              id="mobile-section-about"
              className="mt-2 space-y-2 pb-3 pl-3 animate-in fade-in duration-150"
            >
              <Link
                to="/about"
                hash="overview"
                onClick={onClose}
                className="flex min-h-[36px] items-center text-xs text-surface-foreground/80 hover:text-signal"
              >
                Company Overview &amp; Leadership
              </Link>
              <Link
                to="/about"
                hash="mission"
                onClick={onClose}
                className="flex min-h-[36px] items-center text-xs text-surface-foreground/80 hover:text-signal"
              >
                Mission &amp; First Principles
              </Link>
              <Link
                to="/technology"
                onClick={onClose}
                className="flex min-h-[36px] items-center text-xs text-surface-foreground/80 hover:text-signal"
              >
                Engineering Capabilities Platform
              </Link>
              <Link
                to="/engineering-services"
                onClick={onClose}
                className="flex min-h-[36px] items-center text-xs text-surface-foreground/80 hover:text-signal"
              >
                Engineering Services Portfolio
              </Link>
              <Link
                to="/about"
                hash="quality"
                onClick={onClose}
                className="flex min-h-[36px] items-center text-xs text-surface-foreground/80 hover:text-signal"
              >
                Quality &amp; Certifications (ISO 9001 / DIN 3990)
              </Link>
              <Link
                to="/rental"
                onClick={onClose}
                className="flex min-h-[36px] items-center text-xs text-surface-foreground/80 hover:text-signal"
              >
                Equipment Rental &amp; Pilot Leasing
              </Link>
              <Link
                to="/about"
                hash="partners"
                onClick={onClose}
                className="flex min-h-[36px] items-center text-xs text-surface-foreground/80 hover:text-signal"
              >
                Strategic Partners &amp; Integrators
              </Link>
              <Link
                to="/contact"
                onClick={onClose}
                className="flex min-h-[36px] items-center text-xs text-surface-foreground/80 hover:text-signal"
              >
                Contact Technical Desk
              </Link>
            </div>
          )}
        </div>

        {/* 5. GET QUOTE & BOOK CONSULTATION (DUAL ACTION STRIP) */}
        <div className="pt-3 pb-1 grid grid-cols-2 gap-2.5">
          <Link
            to="/book-consultation"
            onClick={onClose}
            className="flex min-h-[46px] items-center justify-center gap-1.5 rounded-xl border border-signal/40 bg-signal/15 px-3 font-display text-xs font-bold uppercase tracking-wider text-signal hover:bg-signal/25 transition-all text-center"
          >
            <Calendar size={14} />
            <span>Consultation</span>
          </Link>

          <Link
            to="/quote"
            onClick={onClose}
            className="flex min-h-[46px] items-center justify-center gap-1.5 rounded-xl bg-[#155EEF] hover:bg-[#1047BF] px-3 font-display text-xs font-bold uppercase tracking-wider text-white shadow-[0_4px_16px_rgba(21,94,239,0.35)] transition-all text-center"
          >
            <span>Get Quote</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* SEARCH BUTTON IN DRAWER */}
      <div className="mt-5">
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

      {/* MOBILE SECONDARY ACTIONS */}
      <div className="mt-4 space-y-2.5 pb-8">
        <Button
          asChild
          variant="default"
          size="lg"
          className="w-full rounded-lg bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-500 text-white font-bold uppercase tracking-wider text-xs shadow-md"
        >
          <Link to="/book-consultation" onClick={onClose}>
            <Calendar size={16} className="mr-2" />
            Discuss Your Application (Consultation)
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="w-full rounded-lg border-white/15 bg-surface-elevated/40 text-surface-foreground hover:border-signal/50 hover:text-signal text-xs font-bold uppercase tracking-wider"
        >
          <Link to="/application-finder" onClick={onClose}>
            <Compass size={16} className="mr-2 text-signal" />
            Find the Right Solution
          </Link>
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
