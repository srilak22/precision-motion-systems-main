import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { ProductsMegaMenu } from "./megamenu/ProductsMegaMenu";
import { SolutionsMegaMenu } from "./megamenu/SolutionsMegaMenu";
import { IndustriesMegaMenu } from "./megamenu/IndustriesMegaMenu";
import { EngineeringMegaMenu } from "./megamenu/EngineeringMegaMenu";
import { ResourcesMegaMenu } from "./megamenu/ResourcesMegaMenu";
import { CompanyMegaMenu } from "./megamenu/CompanyMegaMenu";
import { useModals } from "@/components/modals/ModalContext";
import { trackDigitalPresence } from "@/trackDigitalPresence";
import { trackClarityEvent } from "@/analytics/clarity";

interface SlidingMegaMenuProps {
  activeMenu: string | null;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  isScrolled: boolean;
}

export function SlidingMegaMenu({
  activeMenu,
  onClose,
  onMouseEnter,
  onMouseLeave,
  isScrolled,
}: SlidingMegaMenuProps) {
  const { openModal } = useModals();

  const handleLinkClick = (title: string, href: string) => {
    trackDigitalPresence("navigation", `Mega Menu - ${title}`, href);
    trackClarityEvent("mega_nav_click");
    onClose();
  };

  const handleQuoteClick = () => {
    trackDigitalPresence("cta_click", "Mega Menu Request Quote", "Opened Quote Modal");
    trackClarityEvent("request_quote");
    onClose();
    openModal("quote");
  };

  return (
    <AnimatePresence>
      {activeMenu && (
        <div
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          className="absolute inset-x-0 top-full z-50 hidden lg:block"
        >
          {/* Subtle Ambient Scrim Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-[1.5px] z-40 pointer-events-auto"
            style={{ top: isScrolled ? "64px" : "80px" }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Floating Mega Menu Container with Hover Bridge */}
          <div className="relative z-50 pt-2 pb-6 px-4 flex justify-center">
            <motion.div
              key={activeMenu}
              initial={{ opacity: 0, y: 6, scale: 0.995 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.995 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className={`w-full rounded-[16px] border border-[#E5EAF1] bg-[#FFFFFF] shadow-[0_20px_50px_-12px_rgba(16,27,45,0.14),0_2px_8px_rgba(16,27,45,0.04)] overflow-hidden transition-all duration-200 ${
                activeMenu === "company"
                  ? "max-w-[760px]"
                  : activeMenu === "resources"
                  ? "max-w-[840px]"
                  : activeMenu === "solutions" || activeMenu === "industries" || activeMenu === "engineering"
                  ? "max-w-[960px]"
                  : "max-w-[1080px]"
              }`}
              role="region"
              id={activeMenu ? `${activeMenu}-mega-menu` : undefined}
              aria-label={`${activeMenu} mega menu`}
            >
              {/* Subtle Blue Indicator Line on top */}
              <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#155EEF]/75 to-transparent" />

              {/* Dynamic Content Panel by Active Menu */}
              {activeMenu === "products" && (
                <ProductsMegaMenu
                  onClose={onClose}
                  onLinkClick={handleLinkClick}
                  onQuoteClick={handleQuoteClick}
                />
              )}

              {activeMenu === "solutions" && (
                <SolutionsMegaMenu
                  onClose={onClose}
                  onLinkClick={handleLinkClick}
                  onQuoteClick={handleQuoteClick}
                />
              )}

              {activeMenu === "industries" && (
                <IndustriesMegaMenu
                  onClose={onClose}
                  onLinkClick={handleLinkClick}
                  onQuoteClick={handleQuoteClick}
                />
              )}

              {activeMenu === "engineering" && (
                <EngineeringMegaMenu
                  onClose={onClose}
                  onLinkClick={handleLinkClick}
                  onQuoteClick={handleQuoteClick}
                />
              )}

              {activeMenu === "resources" && (
                <ResourcesMegaMenu
                  onClose={onClose}
                  onLinkClick={handleLinkClick}
                  onQuoteClick={handleQuoteClick}
                />
              )}

              {activeMenu === "company" && (
                <CompanyMegaMenu
                  onClose={onClose}
                  onLinkClick={handleLinkClick}
                  onQuoteClick={handleQuoteClick}
                />
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
