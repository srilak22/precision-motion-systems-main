import React from "react";
import { Link } from "@tanstack/react-router";
import {
  Briefcase,
  FileText,
  GraduationCap,
  Award,
  ChevronRight,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface CareerDropdownProps {
  onClose: () => void;
  onLinkClick: (title: string, href: string) => void;
}

const CAREER_ITEMS = [
  {
    title: "Careers Overview",
    href: "/careers",
    description: "Join INDUS in engineering next-generation robotics hardware.",
    icon: Briefcase,
  },
  {
    title: "Open Engineering Roles",
    href: "/careers",
    hash: "#open-positions",
    description: "Robotics architects, firmware developers & mechatronic engineers.",
    icon: Sparkles,
  },
  {
    title: "Submit Profile & Resume",
    href: "/careers",
    hash: "#apply",
    description: "Direct fast-track talent portal for mechanical & control specialists.",
    icon: FileText,
  },
  {
    title: "Graduate & Internship Track",
    href: "/careers",
    hash: "#internships",
    description: "6-month R&D university partnerships & junior engineer programs.",
    icon: GraduationCap,
  },
  {
    title: "Engineering Culture & Labs",
    href: "/careers",
    hash: "#culture",
    description: "First-principles engineering in our Chennai robotics dyno lab.",
    icon: Award,
  },
];

export function CareerDropdown({ onClose, onLinkClick }: CareerDropdownProps) {
  return (
    <div className="w-[380px] rounded-2xl border border-[#E5EAF1] bg-white p-3 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.18),0_2px_8px_rgba(15,23,42,0.06)] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
      {/* Blue top accent line */}
      <div className="h-[2px] -mx-3 -mt-3 mb-2 bg-gradient-to-r from-transparent via-[#155EEF]/80 to-transparent" />

      <div className="px-3 py-2 mb-1 border-b border-[#F2F4F7] flex items-center justify-between">
        <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-[#667085]">
          Careers &amp; Engineering Force
        </span>
        <span className="text-[10px] font-mono text-[#155EEF] font-bold">
          4 Roles Open
        </span>
      </div>

      <nav className="space-y-0.5" aria-label="Career submenu">
        {CAREER_ITEMS.map((item) => {
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
                    size={14}
                    className="text-[#98A2B3] group-hover:text-[#155EEF] group-hover:translate-x-0.5 transition-all"
                  />
                </div>
                <p className="text-[11px] text-[#667085] leading-relaxed mt-0.5 line-clamp-1">
                  {item.description}
                </p>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Fast-track CTA */}
      <div className="mt-2 pt-2.5 border-t border-[#F2F4F7] px-2 flex items-center justify-between">
        <Link
          to="/careers"
          hash="apply"
          onClick={() => {
            onLinkClick("Submit Profile", "/careers#apply");
            onClose();
          }}
          className="text-xs font-bold text-[#155EEF] hover:text-[#1047BF] inline-flex items-center gap-1.5 transition-colors group"
        >
          <span>Fast-Track Profile Submission</span>
          <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
