import React from "react";
import { Link } from "@tanstack/react-router";
import {
  Building2,
  Phone,
  Users,
  ShieldCheck,
  ArrowRight,
  Clock,
  MapPin,
} from "lucide-react";
import { companyConfig } from "@/data/config";

interface CompanyMegaMenuProps {
  onClose: () => void;
  onLinkClick: (title: string, href: string) => void;
  onQuoteClick: () => void;
}

interface CompanyItemConfig {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ElementType<{ size?: number; className?: string }>;
}

const COMPANY_LIST: CompanyItemConfig[] = [
  {
    id: "about",
    title: "About INDUS",
    description: "Corporate mission, engineering heritage, manufacturing infrastructure, and ISO standards",
    href: "/about",
    icon: Building2,
  },
  {
    id: "contact",
    title: "Contact Us",
    description: "Direct technical enquiry desks, application sizing consultation, and sales support",
    href: "/contact",
    icon: Phone,
  },
  {
    id: "careers",
    title: "Careers",
    description: "Join our mechatronics, embedded firmware, robotic software, and kinematics teams",
    href: "/careers",
    icon: Users,
  },
];

export function CompanyMegaMenu({
  onClose,
  onLinkClick,
  onQuoteClick,
}: CompanyMegaMenuProps) {
  return (
    <div className="p-6 bg-white">
      {/* Header section */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF]">
            Corporate &amp; Contact
          </span>
          <h3 className="text-base font-bold text-slate-900 mt-0.5">
            About INDUS Industrial Robotics
          </h3>
        </div>
        <Link
          to="/about"
          onClick={() => onLinkClick("About INDUS", "/about")}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#155EEF] hover:text-[#1047BF] transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF] rounded px-2 py-1"
        >
          <span>Company Overview</span>
          <ArrowRight
            size={13}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>
      </div>

      {/* 3 Main Company Links & 1 Direct Engineering Contact Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4">
        {COMPANY_LIST.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              to={item.href as never}
              onClick={() => onLinkClick(item.title, item.href)}
              className="group flex items-start gap-3.5 p-3.5 rounded-xl border border-slate-100 bg-white hover:border-[#155EEF]/40 hover:bg-[#F8FAFC] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF]"
            >
              <div className="size-9 rounded-lg bg-blue-50/80 border border-blue-100 text-[#155EEF] shrink-0 flex items-center justify-center group-hover:bg-[#155EEF] group-hover:text-white transition-colors">
                <Icon size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#155EEF] transition-colors">
                    {item.title}
                  </h4>
                  <ArrowRight
                    size={11}
                    className="text-slate-300 group-hover:text-[#155EEF] shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-1 line-clamp-2">
                  {item.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Footer bar with direct contact information */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-medium text-slate-700">
            <Phone size={13} className="text-[#155EEF]" />
            Direct:{" "}
            <a
              href="tel:+919444024848"
              className="hover:text-[#155EEF] font-bold text-slate-900 transition-colors"
            >
              +91 94440 24848
            </a>
          </span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span className="hidden sm:inline-flex items-center gap-1 text-slate-600">
            <Clock size={12} className="text-slate-400" />
            Response Time: &lt; 2 Business Hours
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/contact"
            onClick={() => onLinkClick("Contact", "/contact")}
            className="text-slate-600 hover:text-[#155EEF] font-medium transition-colors"
          >
            Engineering Enquiry Form →
          </Link>
          <button
            type="button"
            onClick={onQuoteClick}
            className="text-[#155EEF] hover:text-[#1047BF] font-bold cursor-pointer transition-colors"
          >
            Request Quotation
          </button>
        </div>
      </div>
    </div>
  );
}
