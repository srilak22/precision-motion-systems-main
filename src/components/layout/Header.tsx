import React, { useState, useEffect, useRef } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Move3d,
  ChevronDown,
  Search,
  ArrowRight,
  MessageSquare,
  Menu,
  X,
  Plus,
  Calendar,
  Layers,
  Sparkles,
  ShieldCheck,
  PanelRightOpen,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { companyConfig } from "@/data/config";
import { useModals } from "@/components/modals/ModalContext";
import { MobileNav } from "./MobileNav";
import { SlidingNavigationDrawer } from "./SlidingNavigationDrawer";
import { SlidingMegaMenu } from "./SlidingMegaMenu";
import { trackDigitalPresence } from "@/trackDigitalPresence";
import { trackClarityEvent } from "@/analytics/clarity";

interface NavItemConfig {
  id: string;
  label: string;
  href?: string;
  hasDropdown: boolean;
}

const NAV_ITEMS: NavItemConfig[] = [
  { id: "products", label: "Products", href: "/products", hasDropdown: true },
  { id: "solutions", label: "Solutions", href: "/solutions", hasDropdown: true },
  { id: "industries", label: "Industries", href: "/applications", hasDropdown: true },
  { id: "engineering", label: "Engineering", href: "/technology", hasDropdown: true },
  { id: "resources", label: "Resources", href: "/resources", hasDropdown: true },
  { id: "company", label: "Company", href: "/about", hasDropdown: true },
];

export function Header() {
  const [openMega, setOpenMega] = useState<string | null>(null);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { openModal } = useModals();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const headerRef = useRef<HTMLElement>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isClickOpened, setIsClickOpened] = useState(false);

  // Dynamic scroll listener for compact header & subtle elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setOpenMega(null);
    setIsClickOpened(false);
    setDrawerOpen(false);
    setMobileMenuOpen(false);
  }, [currentPath]);

  // Click outside and Escape key listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setOpenMega(null);
        setIsClickOpened(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenMega(null);
        setIsClickOpened(false);
        setDrawerOpen(false);
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

  // Determine which nav item matches current route
  const getActiveNavId = (): string => {
    if (currentPath === "/") return "";
    if (currentPath.startsWith("/products")) return "products";
    if (currentPath.startsWith("/solutions")) return "solutions";
    if (currentPath.startsWith("/applications")) return "industries";
    if (
      currentPath.startsWith("/technology") ||
      currentPath.startsWith("/taxonomy") ||
      currentPath.includes("compare")
    )
      return "engineering";
    if (
      currentPath.startsWith("/resources") ||
      currentPath.startsWith("/engineering-intelligence")
    )
      return "resources";
    if (
      currentPath.startsWith("/about") ||
      currentPath.startsWith("/careers") ||
      currentPath === "/contact"
    )
      return "company";
    return "";
  };

  const activeNavId = getActiveNavId();

  // Smooth hover open/close with debounce buffer to avoid jitter
  const handleNavMouseEnter = (item: NavItemConfig) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoveredNav(item.id);
    if (item.hasDropdown) {
      setOpenMega(item.id);
      trackDigitalPresence("navigation", `Header Hover - ${item.label}`, `Opened ${item.id} mega menu`);
    } else if (!isClickOpened) {
      setOpenMega(null);
    }
  };

  const handleNavMouseLeave = () => {
    setHoveredNav(null);
    if (isClickOpened) return;
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setOpenMega(null);
    }, 280);
  };

  const handleMenuMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const handleMenuMouseLeave = () => {
    if (isClickOpened) return;
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setOpenMega(null);
    }, 280);
  };

  const toggleMega = (menuId: string) => {
    if (openMega === menuId && isClickOpened) {
      setOpenMega(null);
      setIsClickOpened(false);
    } else {
      setOpenMega(menuId);
      setIsClickOpened(true);
      trackDigitalPresence("navigation", `Header Toggle - ${menuId}`, `Clicked ${menuId}`);
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

  return (
    <header
      ref={headerRef}
      onMouseLeave={handleNavMouseLeave}
      className={`sticky top-0 z-40 transition-all duration-300 ease-in-out border-b border-[#E5EAF1] ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.05)]"
          : "bg-[#FFFFFF]"
      }`}
    >
      {/* 1. TOP UTILITY STRIP (Light Industrial Theme) */}
      <div className="hidden border-b border-[#E5EAF1] bg-[#F8FAFC] px-4 py-1.5 text-[11.5px] text-[#475467] font-mono sm:block">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-2 sm:px-4">
          <div className="flex items-center gap-3.5">
            <span className="flex items-center gap-1.5 text-[#16A34A] font-semibold">
              <span className="size-1.5 rounded-full bg-[#16A34A] shadow-[0_0_6px_rgba(22,163,74,0.6)] animate-pulse" />
              ISO 9001:2015 Verified
            </span>
            <span className="text-[#D0D5DD]">•</span>
            <span className="text-[#667085]">DIN 3990 &amp; ISO 9283 Standards</span>
            <span className="hidden md:inline text-[#D0D5DD]">•</span>
            <span className="hidden md:inline text-[#155EEF] font-semibold">
              Precision Kinematics &amp; Motion Subsystems
            </span>
          </div>

          <div className="flex items-center gap-3.5">
            <span className="flex items-center gap-1.5 text-[#475467]">
              <Phone size={12} className="text-[#155EEF]" />
              Direct Engineering:{" "}
              <a
                href="tel:+919444024848"
                className="text-[#172033] hover:text-[#155EEF] transition-colors font-bold"
              >
                +91 94440 24848
              </a>
            </span>
            <span className="text-[#D0D5DD]">•</span>
            <button
              onClick={handleWhatsApp}
              className="text-[#16A34A] hover:text-[#15803D] inline-flex items-center gap-1 cursor-pointer font-bold transition-colors"
            >
              <MessageSquare size={12} />
              <span>WhatsApp Active</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER BAR (White Industrial Background) */}
      <div
        className={`mx-auto flex max-w-[1440px] items-center justify-between px-3 sm:px-6 lg:px-8 transition-all duration-300 ${
          isScrolled ? "h-16" : "h-19"
        }`}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          className="group flex items-center gap-3 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF] rounded-lg shrink-0 mr-2 xl:mr-4"
          aria-label="INDUS Industrial Robotics Home"
        >
          <div
            className={`relative grid place-items-center rounded-xl border border-[#D1E0FF] bg-[#EFF6FF] text-[#155EEF] group-hover:border-[#155EEF] group-hover:bg-[#155EEF] group-hover:text-white shadow-xs transition-all duration-200 ${
              isScrolled ? "size-9" : "size-10"
            }`}
          >
            <Move3d
              size={isScrolled ? 18 : 20}
              className="group-hover:rotate-6 transition-transform duration-300"
            />
            <span className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-[#155EEF] group-hover:bg-white animate-pulse" />
          </div>
          <div className="flex flex-col">
            <b
              className={`block font-sans font-black leading-none tracking-tight text-[#172033] group-hover:text-[#155EEF] transition-colors duration-200 ${
                isScrolled ? "text-base" : "text-lg"
              }`}
            >
              {companyConfig.brandName}
            </b>
            <span className="text-[9.5px] font-mono font-bold uppercase tracking-[.18em] text-[#667085] flex items-center gap-1 mt-0.5">
              Precision Motion &amp; Automation
            </span>
          </div>
        </Link>

        {/* 3. PRIMARY NAVIGATION CAPSULE (Desktop) */}
        <nav
          className="relative hidden items-center gap-1 p-1 rounded-full border border-[#E5EAF1] bg-[#F8FAFC] lg:flex"
          aria-label="Primary navigation"
        >
          {NAV_ITEMS.map((item) => {
            const isCurrent = activeNavId === item.id;
            const isOpen = openMega === item.id;
            const isHovered = hoveredNav === item.id;
            const isIndicatorActive = isHovered || (!hoveredNav && (isOpen || isCurrent));

            return (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => handleNavMouseEnter(item)}
              >
                {/* Magnetic Sliding Indicator Pill */}
                {isIndicatorActive && (
                  <motion.div
                    layoutId="nav-magnetic-pill"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    className="absolute inset-0 rounded-full bg-white border border-[#D1E0FF] shadow-xs"
                  />
                )}

                {item.hasDropdown ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMega(item.id);
                    }}
                    className={`relative z-10 flex items-center gap-1 rounded-full px-3 py-1.5 xl:px-4 xl:py-1.5 text-[13px] font-semibold transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF] ${
                      isOpen || isCurrent
                        ? "text-[#155EEF] font-bold"
                        : "text-[#475467] hover:text-[#172033]"
                    }`}
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                  >
                    <span>{item.label}</span>
                    <Plus
                      size={12}
                      className={`transition-transform duration-200 text-[#98A2B3] group-hover:text-[#155EEF] ${
                        isOpen ? "rotate-45 text-[#155EEF] scale-110" : "rotate-0"
                      }`}
                    />
                  </button>
                ) : (
                  <Link
                    to={item.href || "/"}
                    className={`relative z-10 flex items-center gap-1 rounded-full px-3 py-1.5 xl:px-4 xl:py-1.5 text-[13px] font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF] ${
                      isCurrent
                        ? "text-[#155EEF] font-bold"
                        : "text-[#475467] hover:text-[#172033]"
                    }`}
                  >
                    <span>{item.label}</span>
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        {/* 4. ACTION CONTROLS & CTA BUTTONS */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 ml-2">
          {/* Quick Search Pill on Desktop */}
          <button
            onClick={() => {
              trackDigitalPresence("click", "Header Search Button", "Opened Search Modal");
              openModal("search");
            }}
            className="group hidden xl:flex items-center gap-2 rounded-full border border-[#E5EAF1] bg-[#F8FAFC] hover:bg-[#EFF6FF] hover:border-[#B2CCFF] px-3 py-1.5 text-xs text-[#667085] hover:text-[#172033] transition-all shadow-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF] shrink-0"
            aria-label="Open search modal (Ctrl+K)"
          >
            <Search size={13} className="text-[#155EEF] group-hover:scale-110 transition-transform" />
            <span className="font-medium text-[12px]">Search...</span>
            <kbd className="rounded-md bg-white px-1.5 py-0.5 text-[9px] font-mono font-bold text-[#667085] border border-[#E5EAF1] shadow-2xs group-hover:text-[#155EEF] transition-colors">
              ⌘K
            </kbd>
          </button>

          {/* Compact Search Trigger on Smaller Screens */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              trackDigitalPresence("click", "Header Search Button", "Opened Search Modal");
              openModal("search");
            }}
            className="xl:hidden rounded-full text-[#475467] hover:bg-[#EFF6FF] hover:text-[#155EEF] focus-visible:ring-2 focus-visible:ring-[#155EEF] border border-[#E5EAF1] shrink-0 size-9"
            aria-label="Open search modal"
          >
            <Search size={16} />
          </Button>

          {/* Sliding Systems Drawer Trigger ("All Systems") */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              trackDigitalPresence("click", "Header Systems Drawer Button", "Opened Sliding Drawer");
              trackClarityEvent("drawer_open");
              setDrawerOpen(true);
            }}
            className="group hidden sm:flex items-center gap-1.5 rounded-full border border-[#D1E0FF] bg-[#EFF6FF] hover:bg-[#D1E0FF]/50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#155EEF] transition-all shadow-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF] shrink-0"
            aria-label="Open All Systems Sliding Drawer"
            title="Open Complete Systems Index"
          >
            <PanelRightOpen size={13} className="group-hover:translate-x-0.5 transition-transform" />
            <span className="text-[11.5px]">All Systems</span>
          </button>

          {/* Primary CTA: Get a Quote (High Priority Prompt Mandate) */}
          <button
            type="button"
            onClick={handleQuoteClick}
            className="rounded-full bg-[#155EEF] hover:bg-[#1047BF] text-white font-bold text-xs uppercase tracking-wider px-4.5 py-2 shadow-[0_4px_14px_rgba(21,94,239,0.25)] hover:shadow-[0_6px_20px_rgba(21,94,239,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap shrink-0 cursor-pointer"
            aria-label="Request an Engineering Quote"
          >
            Get a Quote
          </button>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-[#155EEF] size-9 ${
              mobileMenuOpen
                ? "bg-[#EFF6FF] text-[#155EEF] border border-[#B2CCFF]"
                : "text-[#475467] hover:bg-[#F8FAFC] border border-[#E5EAF1]"
            }`}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </Button>
        </div>
      </div>

      {/* 5. FLOATING LIGHT MEGA-MENU PANEL */}
      <SlidingMegaMenu
        activeMenu={openMega}
        onClose={() => {
          setOpenMega(null);
          setIsClickOpened(false);
        }}
        onMouseEnter={handleMenuMouseEnter}
        onMouseLeave={handleMenuMouseLeave}
        isScrolled={isScrolled}
      />

      {/* 6. SLIDING RIGHT DRAWER ("ALL SYSTEMS" FULL NAVIGATOR) */}
      <SlidingNavigationDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      {/* 7. MOBILE NAVIGATION (Preserved Intact) */}
      <MobileNav
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onQuoteClick={handleQuoteClick}
        onWhatsAppClick={handleWhatsApp}
      />
    </header>
  );
}
