import React from "react";
import { Link } from "@tanstack/react-router";
import {
  FileText,
  BookOpen,
  HelpCircle,
  FolderKanban,
  ArrowRight,
  Sparkles,
  Move3d,
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
  badge: string;
  icon: React.ElementType<{ size?: number; className?: string }>;
}

const RESOURCES_LIST: ResourceItemConfig[] = [
  {
    id: "docs",
    title: "Technical Documentation",
    description: "Datasheets, torque curves, electrical pinouts & dimensional drawings",
    href: "/resources",
    badge: "Library",
    icon: FileText,
  },
  {
    id: "case-studies",
    title: "Application Case Studies",
    description: "Real-world industrial deployments, kinematic architectures & ROI data",
    href: "/resources/case-studies",
    badge: "Deployments",
    icon: FolderKanban,
  },
  {
    id: "insights",
    title: "Engineering Intelligence",
    description: "Technical whitepapers, 3D CAD STEP libraries & fieldbus guides",
    href: "/engineering-intelligence",
    badge: "Flagship",
    icon: BookOpen,
  },
  {
    id: "faqs",
    title: "FAQs & Engineering Support",
    description: "Sizing formulas, maintenance intervals, EtherCAT setup & lead times",
    href: "/resources/faqs",
    badge: "Q&A",
    icon: HelpCircle,
  },
];

const QUICK_FILTERS = [
  { label: "Datasheets", href: "/resources?type=datasheet" },
  { label: "Catalogues", href: "/resources?type=catalogue" },
  { label: "App Notes", href: "/resources?type=app-note" },
  { label: "Case Studies", href: "/resources/case-studies" },
];

export function ResourcesMegaMenu({
  onLinkClick,
  onQuoteClick,
}: ResourcesMegaMenuProps) {
  return (
    <div className="p-6 bg-white selection:bg-[#155EEF] selection:text-white">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
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
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#155EEF] hover:text-[#1047BF] transition-colors group rounded-lg bg-blue-50/80 hover:bg-blue-100/80 px-3 py-1.5 border border-blue-100"
        >
          <span>Explore All Resources</span>
          <ArrowRight
            size={13}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      {/* Quick Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 pt-3.5">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mr-1">
          Quick Jump:
        </span>
        {QUICK_FILTERS.map((q) => (
          <Link
            key={q.label}
            to={q.href as never}
            onClick={() => onLinkClick(q.label, q.href)}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-700 hover:border-[#155EEF] hover:bg-blue-50 hover:text-[#155EEF] transition-colors"
          >
            {q.label}
          </Link>
        ))}
      </div>

      {/* 4 Clean Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3.5">
        {RESOURCES_LIST.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              to={item.href as never}
              onClick={() => onLinkClick(item.title, item.href)}
              className="group flex items-start gap-3.5 p-3.5 rounded-xl border border-slate-150/90 bg-white hover:border-[#155EEF]/50 hover:bg-[#F8FAFC] hover:shadow-xs transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF]"
            >
              <div className="size-9 rounded-lg bg-blue-50 border border-blue-100 text-[#155EEF] shrink-0 flex items-center justify-center group-hover:bg-[#155EEF] group-hover:text-white transition-colors">
                <Icon size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#155EEF] transition-colors truncate">
                    {item.title}
                  </h4>
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase text-slate-500 shrink-0">
                    {item.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-1 line-clamp-2">
                  {item.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Footer Bar */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-slate-500">
          <Sparkles size={12} className="text-[#155EEF]" />
          Verified Technical Documents &bull; ISO 9283 &amp; DIN 3990
        </span>
        <div className="flex items-center gap-4">
          <Link
            to="/technology/motion-studio"
            onClick={() => onLinkClick("3D Motion Studio", "/technology/motion-studio")}
            className="inline-flex items-center gap-1 text-slate-600 hover:text-[#155EEF] font-semibold transition-colors"
          >
            <Move3d size={13} className="text-[#155EEF]" />
            <span>3D Motion Studio</span>
          </Link>
          <button
            type="button"
            onClick={onQuoteClick}
            className="text-[#155EEF] hover:text-[#1047BF] font-bold cursor-pointer transition-colors"
          >
            Request Custom CAD / Quote
          </button>
        </div>
      </div>
    </div>
  );
}
