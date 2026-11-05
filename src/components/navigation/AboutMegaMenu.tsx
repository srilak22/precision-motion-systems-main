import React from "react";
import { ABOUT_NAV_CARDS } from "@/data/aboutNavigationData";
import { useAboutNavigation } from "@/hooks/useAboutNavigation";
import { CompanyOverviewPanel } from "./CompanyOverviewPanel";
import { AboutMenuCard } from "./AboutMenuCard";
import { AboutMenuFooter } from "./AboutMenuFooter";

export interface AboutMegaMenuProps {
  onClose: () => void;
  onLinkClick: (title: string, href: string) => void;
  onQuoteClick: () => void;
}

export function AboutMegaMenu({ onClose, onLinkClick, onQuoteClick }: AboutMegaMenuProps) {
  const { navigateTo } = useAboutNavigation(onClose);

  const handleNavigate = (href: string, title?: string) => {
    onLinkClick(title || "Navigation", href);
    navigateTo(href, title);
  };

  return (
    <div className="p-5 sm:p-6 bg-white">
      {/* Main Content Area: Left Overview Panel + Right 6-Card Grid */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-5">
        {/* Left Information Panel */}
        <CompanyOverviewPanel onLinkClick={(title, href) => handleNavigate(href, title)} />

        {/* Right Navigation Card Grid (3 columns x 2 rows on desktop) */}
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {ABOUT_NAV_CARDS.map((card) => (
              <AboutMenuCard key={card.id} card={card} onNavigate={handleNavigate} />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Information Strip */}
      <AboutMenuFooter
        onLinkClick={(title, href) => handleNavigate(href, title)}
        onQuoteClick={onQuoteClick}
      />
    </div>
  );
}
