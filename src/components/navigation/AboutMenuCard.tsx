import React from "react";
import { ArrowRight, Factory, Users, Cpu, ShieldCheck, Layers, Sparkles } from "lucide-react";
import { AboutNavCard, SubMenuItem } from "@/data/aboutNavigationData";

const ICON_MAP = {
  overview: Factory,
  leadership: Users,
  capabilities: Cpu,
  infrastructure: ShieldCheck,
  industries: Layers,
  innovation: Sparkles,
};

interface AboutMenuCardProps {
  card: AboutNavCard;
  onNavigate: (href: string, title?: string) => void;
}

export function AboutMenuCard({ card, onNavigate }: AboutMenuCardProps) {
  const Icon = ICON_MAP[card.iconName] || Cpu;

  return (
    <div className="group rounded-2xl border border-[#E5EAF1] bg-white hover:border-[#155EEF]/50 hover:bg-[#F8FAFC] transition-all duration-200 p-4 sm:p-4.5 shadow-[0_1px_3px_rgba(16,27,45,0.02)] hover:shadow-[0_6px_16px_rgba(21,94,239,0.06)] flex flex-col justify-between">
      <div>
        {/* Top Header: Clickable Card Header */}
        <button
          type="button"
          onClick={() => onNavigate(card.href, card.heading)}
          className="w-full text-left flex items-start justify-between gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF] rounded-lg p-0.5"
          aria-label={`Navigate to ${card.heading}`}
        >
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-[#EFF6FF] border border-[#D1E0FF] text-[#155EEF] flex items-center justify-center shrink-0 group-hover:bg-[#155EEF] group-hover:text-white transition-colors duration-200">
              <Icon size={16} />
            </div>
            <div>
              <h4 className="text-[13.5px] font-bold text-[#101B2D] group-hover:text-[#155EEF] transition-colors leading-tight">
                {card.heading}
              </h4>
            </div>
          </div>

          <ArrowRight
            size={14}
            className="text-[#98A2B3] group-hover:text-[#155EEF] transition-transform duration-200 group-hover:translate-x-1 shrink-0 mt-1"
          />
        </button>

        {/* Short Description */}
        <p className="mt-2 text-[11px] text-[#475467] leading-relaxed line-clamp-1">
          {card.description}
        </p>
      </div>

      {/* Submenu Links List (Each link is an interactive, verified destination) */}
      <div className="mt-3.5 pt-2.5 border-t border-[#F2F4F7]">
        <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-[#98A2B3] block mb-1.5">
          Destinations:
        </span>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px]">
          {card.items.map((subItem: SubMenuItem, idx: number) => (
            <React.Fragment key={subItem.id}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(subItem.href, subItem.name);
                }}
                className="text-[#475467] hover:text-[#155EEF] hover:underline font-medium transition-colors cursor-pointer text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-[#155EEF] rounded"
              >
                {subItem.name}
              </button>
              {idx < card.items.length - 1 && (
                <span className="text-[#CBD5E1] select-none text-[9px]">•</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
