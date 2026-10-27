import React from "react";
import { Link } from "@tanstack/react-router";
import {
  Building2,
  Target,
  Wrench,
  ShieldCheck,
  Users,
  Phone,
  ChevronRight,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Move3d,
} from "lucide-react";

interface AboutDropdownProps {
  onClose: () => void;
  onLinkClick: (title: string, href: string) => void;
}

const ABOUT_ITEMS = [
  {
    title: "Company Overview",
    href: "/about",
    hash: "#overview",
    description: "Who we are, engineering heritage & executive leadership.",
    icon: Building2,
  },
  {
    title: "Mission and Vision",
    href: "/about",
    hash: "#mission",
    description: "First-principles physics, precision robotics & industrial reliability.",
    icon: Target,
  },
  {
    title: "Engineering Capabilities",
    href: "/technology",
    description: "Mechatronic joint design, deterministic motion & cell integration.",
    icon: Wrench,
  },
  {
    title: "Engineering Services Portfolio",
    href: "/engineering-services",
    description: "Feasibility, kinematic simulation & custom motion engineering.",
    icon: Sparkles,
  },
  {
    title: "Quality and Certifications",
    href: "/about",
    hash: "#quality",
    description: "ISO 9001:2015, DIN 3990 calculation & ISO 9283 benchmarking.",
    icon: ShieldCheck,
  },
  {
    title: "Equipment Rental & Pilot Leasing",
    href: "/rental",
    description: "Industrial robotics leasing, evaluation hardware & pilot workcell trials.",
    icon: Move3d,
  },
  {
    title: "Partners & Ecosystem",
    href: "/about",
    hash: "#partners",
    description: "System integrators, fieldbus consortia & university alliances.",
    icon: Users,
  },
  {
    title: "Contact Us",
    href: "/contact",
    description: "Engineering HQ in Chennai, direct support desk & quotation.",
    icon: Phone,
  },
];

export function AboutDropdown({ onClose, onLinkClick }: AboutDropdownProps) {
  return (
    <div className="w-[380px] rounded-2xl border border-[#E5EAF1] bg-white p-3 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.18),0_2px_8px_rgba(15,23,42,0.06)] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
      {/* Blue top accent line */}
      <div className="h-[2px] -mx-3 -mt-3 mb-2 bg-gradient-to-r from-transparent via-[#155EEF]/80 to-transparent" />

      <div className="px-3 py-2 mb-1 border-b border-[#F2F4F7]">
        <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-[#667085]">
          About INDUS Robotics
        </span>
      </div>

      <nav className="space-y-0.5" aria-label="About INDUS submenu">
        {ABOUT_ITEMS.map((item) => {
          const Icon = item.icon;
          const fullHref = item.hash ? `${item.href}${item.hash}` : item.href;

          return (
            <Link
              key={item.title}
              to={item.href}
              hash={item.hash ? item.hash.replace("#", "") : undefined}
              onClick={() => {
                onLinkClick(item.title, fullHref);
                onClose();
              }}
              className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#F8FAFC] transition-all"
            >
              <div className="size-8 rounded-lg bg-[#EFF6FF] text-[#155EEF] grid place-items-center shrink-0 border border-[#D1E0FF] group-hover:bg-[#155EEF] group-hover:text-white transition-colors">
                <Icon size={16} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#172033] group-hover:text-[#155EEF] transition-colors">
                    {item.title}
                  </h4>
                  <ChevronRight
                    size={13}
                    className="text-[#98A2B3] group-hover:text-[#155EEF] group-hover:translate-x-0.5 transition-all"
                  />
                </div>
                <p className="text-[11px] text-[#667085] mt-0.5 leading-snug">
                  {item.description}
                </p>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Direct link to About index */}
      <div className="mt-2 pt-2 border-t border-[#F2F4F7] px-2 flex items-center justify-between">
        <Link
          to="/about"
          onClick={() => {
            onLinkClick("Read Full Company Profile", "/about");
            onClose();
          }}
          className="text-[11px] font-bold text-[#155EEF] hover:underline inline-flex items-center gap-1"
        >
          <span>Complete Company Profile</span>
          <ArrowRight size={11} />
        </Link>
        <span className="text-[10px] font-mono text-[#98A2B3]">ISO 9001:2015</span>
      </div>
    </div>
  );
}
