import React from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  Cpu,
  Factory,
  Layers,
  ShieldCheck,
  Sparkles,
  Users,
  Briefcase,
  Phone,
  Move3d,
} from "lucide-react";
import { ABOUT_NAV_CARDS, type AboutNavCard } from "@/data/aboutNavigationData";
import { useAboutNavigation } from "@/hooks/useAboutNavigation";

export interface AboutMegaMenuProps {
  onClose: () => void;
  onLinkClick: (title: string, href: string) => void;
  onQuoteClick: () => void;
}

const CARD_ICONS: Record<AboutNavCard["iconName"], React.ElementType<{ size?: number; className?: string }>> = {
  overview: Building2,
  leadership: Users,
  capabilities: Cpu,
  infrastructure: ShieldCheck,
  industries: Factory,
  innovation: Sparkles,
};

export function AboutMegaMenu({ onClose, onLinkClick }: AboutMegaMenuProps) {
  const { navigateTo } = useAboutNavigation(onClose);

  const handleNavigate = (href: string, title?: string) => {
    onLinkClick(title || "About Us", href);
    navigateTo(href, title);
  };

  return (
    <div className="p-6 bg-white max-w-[1060px] mx-auto selection:bg-[#155EEF] selection:text-white">
      {/* Clean Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF]">
            INDUS Industrial Robotics
          </span>
          <h3 className="text-sm font-bold text-slate-900 mt-0.5">
            Engineering Heritage, Leadership &amp; Global Infrastructure
          </h3>
        </div>
        <Link
          to="/about"
          onClick={() => handleNavigate("/about", "Company Profile")}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#155EEF] hover:text-[#1047BF] transition-colors group rounded-lg bg-blue-50/70 hover:bg-blue-100/70 px-3 py-1.5 border border-blue-100"
        >
          <span>Company Profile</span>
          <ArrowRight
            size={13}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      {/* Clean 3x2 Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-4">
        {ABOUT_NAV_CARDS.map((card) => {
          const Icon = CARD_ICONS[card.iconName] || Layers;
          const visibleItems = card.items.slice(0, 3);

          return (
            <div
              key={card.id}
              className="rounded-xl border border-slate-150/90 bg-slate-50/50 p-4 hover:border-[#155EEF]/40 hover:bg-white hover:shadow-xs transition-all duration-150"
            >
              <button
                type="button"
                onClick={() => handleNavigate(card.href, card.heading)}
                className="group flex items-center gap-2.5 w-full text-left cursor-pointer"
              >
                <div className="size-8 rounded-lg bg-blue-50 border border-blue-100 text-[#155EEF] shrink-0 flex items-center justify-center group-hover:bg-[#155EEF] group-hover:text-white transition-colors">
                  <Icon size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#155EEF] transition-colors truncate">
                    {card.heading}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate">{card.description}</p>
                </div>
              </button>

              <ul className="mt-3 pt-2.5 border-t border-slate-200/60 space-y-1">
                {visibleItems.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => handleNavigate(item.href, item.name)}
                      className="group flex items-center justify-between w-full text-left py-1 px-1.5 -mx-1.5 rounded-md text-xs text-slate-600 hover:text-[#155EEF] hover:bg-blue-50/60 transition-colors cursor-pointer"
                    >
                      <span className="truncate font-medium">{item.name}</span>
                      <ArrowRight
                        size={11}
                        className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#155EEF] shrink-0"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Clean Footer Quick Links */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="font-mono text-[11px] text-slate-500">
          ISO 9001:2015 Certified &bull; Deterministic Robotics Engineering
        </span>
        <div className="flex flex-wrap items-center gap-4">
          <Link
            to="/careers"
            onClick={() => handleNavigate("/careers", "Careers")}
            className="inline-flex items-center gap-1.5 font-semibold text-slate-700 hover:text-[#155EEF] transition-colors"
          >
            <Briefcase size={12} className="text-[#155EEF]" />
            <span>Careers</span>
          </Link>
          <Link
            to="/rental"
            onClick={() => handleNavigate("/rental", "Equipment Rental")}
            className="inline-flex items-center gap-1.5 font-semibold text-slate-700 hover:text-[#155EEF] transition-colors"
          >
            <Move3d size={12} className="text-[#155EEF]" />
            <span>Equipment Rental</span>
          </Link>
          <Link
            to="/contact"
            onClick={() => handleNavigate("/contact", "Contact Us")}
            className="inline-flex items-center gap-1.5 font-bold text-[#155EEF] hover:text-[#1047BF] transition-colors"
          >
            <Phone size={12} />
            <span>Contact Us</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
