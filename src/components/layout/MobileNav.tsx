import React, { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Plus, Minus, ArrowRight, MessageSquare, Search, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navigationData } from "@/data/navigation";
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

  const navProducts = navigationData["products"];
  const navSolutions = navigationData["solutions"];
  const navApplications = navigationData["applications"];
  const navTechnology = navigationData["technology"];
  const navResources = navigationData["resources"];
  const navAbout = navigationData["about"];

  return (
    <div
      id="mobile-navigation"
      role="dialog"
      aria-label="Mobile Navigation Menu"
      aria-modal="true"
      className="fixed inset-x-0 top-20 bottom-0 z-50 overflow-y-auto overflow-x-hidden border-t border-border/40 bg-surface-dark px-5 py-6 text-surface-foreground xl:hidden animate-in fade-in slide-in-from-top-2 duration-150"
    >
      <div className="space-y-1">
        {/* PRODUCTS ACCORDION */}
        <div className="border-b border-border/20 py-2">
          <button
            onClick={() => toggle("products")}
            aria-expanded={expandedSection === "products"}
            aria-controls="mobile-section-products"
            className="flex min-h-[44px] w-full items-center justify-between py-2 text-left font-display text-lg uppercase tracking-wide text-surface-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
          >
            <span>Products</span>
            <span className="text-signal">
              {expandedSection === "products" ? <Minus size={18} /> : <Plus size={18} />}
            </span>
          </button>
          {expandedSection === "products" && navProducts?.groups && (
            <div
              id="mobile-section-products"
              className="mt-2 space-y-4 pb-3 pl-3 animate-in fade-in duration-150"
            >
              <Link
                to="/products"
                onClick={onClose}
                className="flex min-h-[40px] items-center text-xs font-bold uppercase tracking-wider text-signal hover:underline"
              >
                View All Products Portfolio →
              </Link>
              {navProducts.groups.map((group) => (
                <div key={group.slug} className="space-y-2">
                  <Link
                    to={group.href}
                    onClick={onClose}
                    className="flex min-h-[36px] items-center text-xs font-bold uppercase tracking-wider text-surface-foreground hover:text-signal"
                  >
                    {group.name}
                  </Link>
                  <div className="grid grid-cols-2 gap-2 pl-2">
                    {group.items.map((sub) => (
                      <Link
                        key={sub.href}
                        to={sub.href}
                        onClick={onClose}
                        className="flex min-h-[36px] items-center text-[11px] text-surface-foreground/75 hover:text-signal"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
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
          {expandedSection === "solutions" && navSolutions?.items && (
            <div
              id="mobile-section-solutions"
              className="mt-2 space-y-2 pb-3 pl-3 animate-in fade-in duration-150"
            >
              <Link
                to="/solutions"
                onClick={onClose}
                className="flex min-h-[40px] items-center text-xs font-bold uppercase tracking-wider text-signal hover:underline"
              >
                View All Solutions →
              </Link>
              {navSolutions.items.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={onClose}
                  className="flex min-h-[36px] items-center text-xs text-surface-foreground/75 hover:text-signal"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* APPLICATIONS ACCORDION */}
        <div className="border-b border-border/20 py-2">
          <button
            onClick={() => toggle("applications")}
            aria-expanded={expandedSection === "applications"}
            aria-controls="mobile-section-applications"
            className="flex min-h-[44px] w-full items-center justify-between py-2 text-left font-display text-lg uppercase tracking-wide text-surface-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
          >
            <span>Applications</span>
            <span className="text-signal">
              {expandedSection === "applications" ? <Minus size={18} /> : <Plus size={18} />}
            </span>
          </button>
          {expandedSection === "applications" && navApplications?.items && (
            <div
              id="mobile-section-applications"
              className="mt-2 space-y-2 pb-3 pl-3 animate-in fade-in duration-150"
            >
              <Link
                to="/applications"
                onClick={onClose}
                className="flex min-h-[40px] items-center text-xs font-bold uppercase tracking-wider text-signal hover:underline"
              >
                View All Applications →
              </Link>
              {navApplications.items.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={onClose}
                  className="flex min-h-[36px] items-center text-xs text-surface-foreground/75 hover:text-signal"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* TECHNOLOGY ACCORDION */}
        <div className="border-b border-border/20 py-2">
          <button
            onClick={() => toggle("technology")}
            aria-expanded={expandedSection === "technology"}
            aria-controls="mobile-section-technology"
            className="flex min-h-[44px] w-full items-center justify-between py-2 text-left font-display text-lg uppercase tracking-wide text-surface-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
          >
            <span>Technology</span>
            <span className="text-signal">
              {expandedSection === "technology" ? <Minus size={18} /> : <Plus size={18} />}
            </span>
          </button>
          {expandedSection === "technology" && navTechnology?.items && (
            <div
              id="mobile-section-technology"
              className="mt-2 space-y-2 pb-3 pl-3 animate-in fade-in duration-150"
            >
              <Link
                to="/technology"
                onClick={onClose}
                className="flex min-h-[40px] items-center text-xs font-bold uppercase tracking-wider text-signal hover:underline"
              >
                View Technology Stack →
              </Link>
              {navTechnology.items.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={onClose}
                  className="flex min-h-[36px] items-center text-xs text-surface-foreground/75 hover:text-signal"
                >
                  {item.name}
                </Link>
              ))}
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
          {expandedSection === "resources" && navResources?.items && (
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
              {navResources.items.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={onClose}
                  className="flex min-h-[36px] items-center text-xs text-surface-foreground/75 hover:text-signal"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* ABOUT ACCORDION */}
        <div className="border-b border-border/20 py-2">
          <button
            onClick={() => toggle("about")}
            aria-expanded={expandedSection === "about"}
            aria-controls="mobile-section-about"
            className="flex min-h-[44px] w-full items-center justify-between py-2 text-left font-display text-lg uppercase tracking-wide text-surface-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
          >
            <span>About & Company</span>
            <span className="text-signal">
              {expandedSection === "about" ? <Minus size={18} /> : <Plus size={18} />}
            </span>
          </button>
          {expandedSection === "about" && navAbout?.items && (
            <div
              id="mobile-section-about"
              className="mt-2 space-y-2 pb-3 pl-3 animate-in fade-in duration-150"
            >
              {navAbout.items.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={onClose}
                  className="flex min-h-[36px] items-center text-xs text-surface-foreground/75 hover:text-signal"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* DIRECT CAREERS LINK */}
        <div className="border-b border-border/20 py-3">
          <Link
            to="/careers"
            onClick={onClose}
            className="flex min-h-[44px] items-center justify-between font-display text-lg uppercase tracking-wide text-surface-foreground hover:text-signal"
          >
            <span className="flex items-center gap-2">
              <Briefcase size={16} className="text-signal" />
              Careers & Profile
            </span>
            <ArrowRight size={14} className="text-muted-foreground" />
          </Link>
        </div>

        {/* DIRECT CONTACT LINK */}
        <div className="border-b border-border/20 py-3">
          <Link
            to="/contact"
            onClick={onClose}
            className="flex min-h-[44px] items-center justify-between font-display text-lg uppercase tracking-wide text-surface-foreground hover:text-signal"
          >
            <span>Contact Hub</span>
            <ArrowRight size={14} className="text-muted-foreground" />
          </Link>
        </div>
      </div>

      {/* SEARCH BUTTON IN DRAWER */}
      <div className="mt-6">
        <button
          onClick={handleSearch}
          className="flex h-12 w-full items-center justify-between border border-border/40 bg-surface-elevated px-4 text-xs font-bold uppercase tracking-wider text-surface-foreground hover:border-signal/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
        >
          <span className="flex items-center gap-2">
            <Search size={16} className="text-signal" />
            Search Platform
          </span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* MOBILE CTAs */}
      <div className="mt-6 space-y-3 pb-8">
        <Button
          onClick={handleQuote}
          className="h-12 w-full rounded-none bg-signal font-bold uppercase tracking-wider text-signal-foreground hover:bg-signal/90"
        >
          Request a Quote <ArrowRight size={14} className="ml-1.5" />
        </Button>
        <Button
          variant="outline"
          onClick={handleWhatsApp}
          className="h-12 w-full rounded-none border-surface-foreground/30 bg-transparent font-bold uppercase tracking-wider text-surface-foreground hover:bg-surface-elevated hover:text-signal"
        >
          <MessageSquare size={16} className="mr-2 text-signal" />
          Chat on WhatsApp
        </Button>
      </div>
    </div>
  );
}
