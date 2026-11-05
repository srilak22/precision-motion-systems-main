import React, { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";

interface NavItem {
  id: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "mission-vision", label: "Our Mission & Vision" },
  { id: "capabilities-stack", label: "Capabilities Stack" },
  { id: "philosophy", label: "Engineering Philosophy" },
  { id: "safety", label: "Robotics Safety & Reliability" },
  { id: "co-engineering", label: "Our Co-Engineering Model" },
  { id: "presence-innovation", label: "Global Presence & Innovation" },
  { id: "leadership-teams", label: "Leadership & Teams" },
];

export function AboutSecondaryNav() {
  const [activeSection, setActiveSection] = useState<string>("mission-vision");
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 120);

      const sectionElements = NAV_ITEMS.map((item) => ({
        id: item.id,
        el: document.getElementById(item.id),
      })).filter((item) => item.el !== null);

      const scrollPosition = window.scrollY + 220;

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const item = sectionElements[i];
        if (item.el && item.el.offsetTop <= scrollPosition) {
          setActiveSection(item.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;

    const navOffset = 135;
    const elementPosition = target.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - navOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });

    setActiveSection(id);
  };

  return (
    <nav
      aria-label="About section quick navigation"
      className={`sticky top-[64px] sm:top-[72px] lg:top-[80px] z-30 w-full transition-all duration-200 border-b ${
        isScrolled
          ? "bg-[#0F172A]/95 backdrop-blur-md border-slate-800 shadow-md py-2"
          : "bg-[#0F172A] border-slate-800/80 py-2.5"
      }`}
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 overflow-x-auto no-scrollbar scroll-smooth">
          {/* Section Navigation Tabs */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;

              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => scrollToSection(e, item.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] ${
                    isActive
                      ? "bg-[#155EEF] text-white shadow-sm font-bold"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/80"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </div>

          {/* Quick jump to Leadership CTA on desktop */}
          <div className="hidden xl:flex items-center gap-2 shrink-0 border-l border-slate-800 pl-4">
            <a
              href="#leadership-teams"
              onClick={(e) => scrollToSection(e, "leadership-teams")}
              className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[#38BDF8] hover:text-[#7DD3FC] transition-colors"
            >
              <span>View Team Directory</span>
              <ChevronRight size={13} />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
