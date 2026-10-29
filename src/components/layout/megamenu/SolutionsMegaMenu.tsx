import React from "react";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  Bot,
  Factory,
  Boxes,
  Target,
  Wrench,
  ArrowRight,
} from "lucide-react";

interface SolutionsMegaMenuProps {
  onClose: () => void;
  onLinkClick: (title: string, href: string) => void;
  onQuoteClick: () => void;
}

interface SolutionItemConfig {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ElementType<{ size?: number; className?: string }>;
}

const SOLUTIONS_LIST: SolutionItemConfig[] = [
  {
    id: "motion-control",
    title: "Motion Control",
    description: "Multi-axis kinematics and deterministic trajectory synchronization",
    href: "/solutions/motion-control",
    icon: Activity,
  },
  {
    id: "robotic-automation",
    title: "Robotic Automation",
    description: "Machine tending, automated welding cells, and collaborative assembly",
    href: "/solutions/robotic-automation",
    icon: Bot,
  },
  {
    id: "machine-integration",
    title: "Machine Integration",
    description: "End-to-end plant cell automation and deterministic fieldbus master loops",
    href: "/solutions/machine-integration",
    icon: Factory,
  },
  {
    id: "material-handling",
    title: "Material Handling",
    description: "High-throughput carton sorting, palletizing, and robotic transfer",
    href: "/solutions/material-handling",
    icon: Boxes,
  },
  {
    id: "precision-positioning",
    title: "Precision Positioning",
    description: "Sub-micron direct-drive rotary stages and metrology indexing",
    href: "/solutions/precision-positioning",
    icon: Target,
  },
  {
    id: "custom-engineering",
    title: "Custom Engineering",
    description: "Engineered-to-order robotic joint modules and tailored OEM drivetrains",
    href: "/solutions/custom-engineering",
    icon: Wrench,
  },
];

export function SolutionsMegaMenu({
  onClose,
  onLinkClick,
  onQuoteClick,
}: SolutionsMegaMenuProps) {
  return (
    <div className="p-6 bg-white">
      {/* Header section */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF]">
            Engineering Solutions
          </span>
          <h3 className="text-base font-bold text-slate-900 mt-0.5">
            Turn-Key Automation &amp; Kinematic Subsystems
          </h3>
        </div>
        <Link
          to="/solutions"
          onClick={() => onLinkClick("All Solutions", "/solutions")}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#155EEF] hover:text-[#1047BF] transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF] rounded px-2 py-1"
        >
          <span>Explore All Solutions</span>
          <ArrowRight
            size={13}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>
      </div>

      {/* Solutions 6-outcome grid in 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-4">
        {SOLUTIONS_LIST.map((item) => {
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
          Outcome-focused kinematics • Deterministic bus synchronization
        </span>
        <div className="flex items-center gap-4">
          <Link
            to="/book-consultation"
            onClick={() => onLinkClick("Book Consultation", "/book-consultation")}
            className="text-slate-600 hover:text-[#155EEF] font-medium transition-colors"
          >
            Book an Engineering Consultation →
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
