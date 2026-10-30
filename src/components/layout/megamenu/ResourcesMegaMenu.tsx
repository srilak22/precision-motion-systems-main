import React from "react";
import { Link } from "@tanstack/react-router";
import {
  FileText,
  BookOpen,
  HelpCircle,
  FolderKanban,
  ArrowRight,
} from "lucide-react";

interface ResourcesMegaMenuProps {
  onClose: () => void;
  onLinkClick: (title: string, href: string) => void;
  onQuoteClick: () => void;
}

interface ResourceItemConfig {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ElementType<{ size?: number; className?: string }>;
}

const RESOURCES_LIST: ResourceItemConfig[] = [
  {
    id: "docs",
    title: "Technical Documentation",
    description: "Component manuals, wiring diagrams, bus protocols, dimensional drawings, and datasheets",
    href: "/resources",
    icon: FileText,
  },
  {
    id: "case-studies",
    title: "Case Studies",
    description: "Documented application engineering projects, integration approaches, and lessons learned",
    href: "/resources/case-studies",
    icon: FolderKanban,
  },
  {
    id: "insights",
    title: "Insights & Articles",
    description: "In-depth engineering articles on precision motion, fieldbuses, reducers, and robot integration",
    href: "/engineering-intelligence",
    icon: BookOpen,
  },
  {
    id: "faqs",
    title: "FAQs & Support",
    description: "Answers to sizing questions, maintenance intervals, fieldbus setup, compatibility, and lead times",
    href: "/resources/faqs",
    icon: HelpCircle,
  },
];

export function ResourcesMegaMenu({
  onClose,
  onLinkClick,
  onQuoteClick,
}: ResourcesMegaMenuProps) {
  return (
    <div className="p-6 bg-white">
      {/* Header section */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF]">
            Knowledge &amp; Documentation
          </span>
          <h3 className="text-base font-bold text-slate-900 mt-0.5">
            Technical Resources &amp; Support Hub
          </h3>
        </div>
        <Link
          to="/resources"
          onClick={() => onLinkClick("All Resources", "/resources")}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#155EEF] hover:text-[#1047BF] transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF] rounded px-2 py-1"
        >
          <span>Explore All Resources</span>
          <ArrowRight
            size={13}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>
      </div>

      {/* 4 Clean Resource Rows in 2 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
        {RESOURCES_LIST.map((item) => {
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

      {/* Footer bar */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="font-mono text-[11px]">
          Verified Technical Documents · On-Request Engineering Support
        </span>
        <div className="flex items-center gap-4">
          <Link
            to="/resources/faqs"
            onClick={() => onLinkClick("FAQs", "/resources/faqs")}
            className="text-slate-600 hover:text-[#155EEF] font-medium transition-colors"
          >
            Frequently Asked Questions →
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
