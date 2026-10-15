import React, { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Plus, Minus, ArrowRight, MessageSquare, Search, Briefcase, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { companyConfig } from "@/data/config";
import { useModals } from "@/components/modals/ModalContext";

export function MobileNav({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
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
      className="fixed inset-x-0 top-20 bottom-0 z-50 overflow-y-auto overflow-x-hidden border-t border-border/40 bg-surface-dark px-5 py-6 text-surface-foreground lg:hidden animate-in fade-in slide-in-from-top-2 duration-150"
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

        {/* SOLUTIONS ACCORDION */}
        <div className="border-b border-border/20 py-2">
          <button
            onClick={() => toggle("solutions")}
            aria-expanded={expandedSection === "solutions"}
            aria-controls="mobile-section-solutions"
            className="flex min-h-[44px] w-full items-center justify-between py-2 text-left font-display text-lg uppercase tracking-wide text-surface-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
          >
            <span>Solutions</span>
            <span className="text-signal">
              {expandedSection === "solutions" ? <Minus size={18} /> : <Plus size={18} />}
            </span>
          </button>
          {expandedSection === "solutions" && (
            <div
              id="mobile-section-solutions"
              className="mt-2 space-y-2 pb-3 pl-3 animate-in fade-in duration-150"
            >
              <Link
                to="/solutions"
                onClick={onClose}
                className="flex min-h-[40px] items-center text-xs font-bold uppercase tracking-wider text-signal hover:underline"
              >
                All Solutions Overview →
              </Link>
              <Link
                to="/products/industrial-robots"
                onClick={onClose}
                className="flex min-h-[36px] items-center text-xs text-surface-foreground/80 hover:text-signal"
              >
                Industrial Robotics (6-Axis & SCARA)
              </Link>
              <Link
                to="/products/industrial-robots/welding"
                onClick={onClose}
                className="flex min-h-[36px] items-center text-xs text-surface-foreground/80 hover:text-signal"
              >
                Robotic Welding Cells
              </Link>
              <Link
                to="/products/robotic-arms/pick-and-place"
                onClick={onClose}
                className="flex min-h-[36px] items-center text-xs text-surface-foreground/80 hover:text-signal"
              >
                Pick and Place Systems
              </Link>
              <Link
                to="/applications/manufacturing"
                onClick={onClose}
                className="flex min-h-[36px] items-center text-xs text-surface-foreground/80 hover:text-signal"
              >
                Machine Tending & CNC Automation
              </Link>
              <Link
                to="/solutions/material-handling"
                onClick={onClose}
                className="flex min-h-[36px] items-center text-xs text-surface-foreground/80 hover:text-signal"
              >
                Material Handling & Palletizing
              </Link>
              <Link
                to="/solutions/factory-automation"
                onClick={onClose}
                className="flex min-h-[36px] items-center text-xs text-surface-foreground/80 hover:text-signal"
              >
                Industry-Specific Turn-Key Lines
              </Link>
              <Link
                to="/products"
                onClick={onClose}
                className="flex min-h-[36px] items-center text-xs text-surface-foreground/80 hover:text-signal"
              >
                Motion Reducers & Actuators
              </Link>
            </div>
          )}
        </div>

        {/* INDUSTRIES ACCORDION */}
        <div className="border-b border-border/20 py-2">
          <button
            onClick={() => toggle("industries")}
            aria-expanded={expandedSection === "industries"}
            aria-controls="mobile-section-industries"
            className="flex min-h-[44px] w-full items-center justify-between py-2 text-left font-display text-lg uppercase tracking-wide text-surface-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
          >
            <span>Industries</span>
            <span className="text-signal">
              {expandedSection === "industries" ? <Minus size={18} /> : <Plus size={18} />}
            </span>
          </button>
          {expandedSection === "industries" && (
            <div
              id="mobile-section-industries"
              className="mt-2 space-y-2 pb-3 pl-3 animate-in fade-in duration-150"
            >
              <Link
                to="/applications"
                onClick={onClose}
                className="flex min-h-[40px] items-center text-xs font-bold uppercase tracking-wider text-signal hover:underline"
              >
                View All Industries →
              </Link>
              <Link
                to="/applications/automotive"
                onClick={onClose}
                className="flex min-h-[36px] items-center text-xs text-surface-foreground/80 hover:text-signal"
              >
                Automotive & EV Manufacturing
              </Link>
              <Link
                to="/applications/electronics"
                onClick={onClose}
                className="flex min-h-[36px] items-center text-xs text-surface-foreground/80 hover:text-signal"
              >
                Electronics & Semiconductor
              </Link>
              <Link
                to="/applications/food-packaging"
                onClick={onClose}
                className="flex min-h-[36px] items-center text-xs text-surface-foreground/80 hover:text-signal"
              >
                Food & Beverage (IP69K)
              </Link>
              <Link
                to="/applications/pharmaceuticals"
                onClick={onClose}
                className="flex min-h-[36px] items-center text-xs text-surface-foreground/80 hover:text-signal"
              >
                Pharmaceuticals & Cleanroom
              </Link>
              <Link
                to="/applications/warehousing"
                onClick={onClose}
                className="flex min-h-[36px] items-center text-xs text-surface-foreground/80 hover:text-signal"
              >
                Warehousing & Logistics (AMR)
              </Link>
              <Link
                to="/applications/manufacturing"
                onClick={onClose}
                className="flex min-h-[36px] items-center text-xs text-surface-foreground/80 hover:text-signal"
              >
                General Manufacturing & Fabrication
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
            className="flex min-h-[44px] w-full items-center justify-between py-2 text-left font-display text-lg uppercase tracking-wide text-surface-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
          >
            <span>Resources</span>
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
                className="flex min-h-[40px] items-center text-xs font-bold uppercase tracking-wider text-signal hover:underline"
              >
                Visit Resource Center →
              </Link>
              <Link
                to="/resources"
                search={{ type: "datasheet" } as any}
                onClick={onClose}
                className="flex min-h-[36px] items-center text-xs text-surface-foreground/80 hover:text-signal"
              >
                Technical Datasheets & Specs
              </Link>
              <Link
                to="/resources"
                search={{ type: "case-study" } as any}
                onClick={onClose}
                className="flex min-h-[36px] items-center text-xs text-surface-foreground/80 hover:text-signal"
              >
                Deployment Case Studies
              </Link>
              <Link
                to="/resources"
                search={{ type: "article" } as any}
                onClick={onClose}
                className="flex min-h-[36px] items-center text-xs text-surface-foreground/80 hover:text-signal"
              >
                Engineering Insights & Articles
              </Link>
              <Link
                to="/resources/faqs"
                onClick={onClose}
                className="flex min-h-[36px] items-center text-xs text-surface-foreground/80 hover:text-signal"
              >
                Technical FAQs
              </Link>
            </div>
          )}
        </div>

        {/* COMPANY ACCORDION */}
        <div className="border-b border-border/20 py-2">
          <button
            onClick={() => toggle("company")}
            aria-expanded={expandedSection === "company"}
            aria-controls="mobile-section-company"
            className="flex min-h-[44px] w-full items-center justify-between py-2 text-left font-display text-lg uppercase tracking-wide text-surface-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
          >
            <span>Company</span>
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
                About INDUS
              </Link>
              <Link
                to="/about/engineering"
                onClick={onClose}
                className="flex min-h-[36px] items-center text-xs text-surface-foreground/80 hover:text-signal"
              >
                Engineering Approach & Quality
              </Link>
              <Link
                to="/careers"
                onClick={onClose}
                className="flex min-h-[36px] items-center text-xs text-surface-foreground/80 hover:text-signal"
              >
                Careers & Culture
              </Link>
              <Link
                to="/contact"
                onClick={onClose}
                className="flex min-h-[36px] items-center text-xs text-surface-foreground/80 hover:text-signal"
              >
                Contact Engineering Desk
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* SEARCH BUTTON IN DRAWER */}
      <div className="mt-6">
        <button
          onClick={handleSearch}
          className="flex h-11 w-full items-center justify-between rounded-md border border-border/40 bg-surface-elevated px-4 text-xs font-bold uppercase tracking-wider text-surface-foreground hover:border-signal/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
        >
          <span className="flex items-center gap-2">
            <Search size={16} className="text-signal" />
            Search Platform
          </span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* MOBILE CTAs */}
      <div className="mt-5 space-y-2.5 pb-8">
        <Button
          asChild
          variant="default"
          size="lg"
          className="w-full shadow-[0_0_20px_rgba(149,204,0,0.25)]"
        >
          <Link to="/book-consultation" onClick={onClose}>
            <Calendar size={16} className="mr-2" />
            Book a Consultation
          </Link>
        </Button>
        <Button
          onClick={handleQuote}
          variant="outline"
          size="lg"
          className="w-full border-border/70 bg-surface-elevated/40 text-surface-foreground hover:border-signal/50 hover:text-signal"
        >
          Request a Quote <ArrowRight size={14} className="ml-1.5" />
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={handleWhatsApp}
          className="w-full border-surface-foreground/20 bg-transparent text-surface-foreground hover:border-signal/50 hover:text-signal"
        >
          <MessageSquare size={16} className="mr-2 text-signal" />
          Chat on WhatsApp
        </Button>
      </div>
    </div>
  );
}
