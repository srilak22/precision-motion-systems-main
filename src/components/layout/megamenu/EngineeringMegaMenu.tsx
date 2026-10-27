import React from "react";
import { Link } from "@tanstack/react-router";
import {
  Wrench,
  Cpu,
  FileCheck2,
  Download,
  ShieldCheck,
  Calculator,
  Layers,
  ArrowRight,
} from "lucide-react";

interface EngineeringMegaMenuProps {
  onClose: () => void;
  onLinkClick: (title: string, href: string) => void;
  onQuoteClick: () => void;
}

interface EngineeringItemConfig {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ElementType<{ size?: number; className?: string }>;
}

const ENGINEERING_LIST: EngineeringItemConfig[] = [
  {
    id: "capabilities",
    title: "Engineering Capabilities",
    description: "Turn-key systems design, feasibility simulation, and custom kinematics engineering",
    href: "/engineering-services",
    icon: Wrench,
  },
  {
    id: "integration",
    title: "System Integration",
    description: "Multi-axis cell commissioning, PLC automation, and fieldbus protocol integration",
    href: "/solutions/factory-automation",
    icon: Cpu,
  },
  {
    id: "specifications",
    title: "Technical Specifications",
    description: "Verified component taxonomy, engineering standards, and mechanical tolerance tables",
    href: "/taxonomy",
    icon: FileCheck2,
  },
  {
    id: "downloads",
    title: "CAD & Downloads",
    description: "3D STEP CAD models, technical datasheets, dimension drawings, and wiring manuals",
    href: "/resources",
    icon: Download,
  },
  {
    id: "standards",
    title: "Quality & Standards",
    description: "ISO 9001:2015 certified processes, DIN 3990 gearing, and ISO 10218 safety metrics",
    href: "/about",
    icon: ShieldCheck,
  },
];

export function EngineeringMegaMenu({
  onClose,
  onLinkClick,
  onQuoteClick,
}: EngineeringMegaMenuProps) {
  return (
    <div className="p-6 bg-white">
      {/* Header section */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF]">
            Engineering &amp; Technology
          </span>
          <h3 className="text-base font-bold text-slate-900 mt-0.5">
            Systems Engineering, Standards &amp; Tools
          </h3>
        </div>
        <Link
          to="/technology"
          onClick={() => onLinkClick("Engineering Hub", "/technology")}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#155EEF] hover:text-[#1047BF] transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF] rounded px-2 py-1"
        >
          <span>Explore Engineering Hub</span>
          <ArrowRight
            size={13}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>
      </div>

      {/* Main 5 engineering links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-4">
        {ENGINEERING_LIST.map((item) => {
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

        {/* Featured Interactive Engineering Tool Callout */}
        <Link
          to="/technology/calculators"
          onClick={() => onLinkClick("Kinematics Sizing", "/technology/calculators")}
          className="group flex items-start gap-3.5 p-3.5 rounded-xl border border-[#D1E0FF] bg-[#EFF6FF]/60 hover:bg-[#EFF6FF] hover:border-[#155EEF]/60 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF]"
        >
          <div className="size-9 rounded-lg bg-[#155EEF] text-white shrink-0 flex items-center justify-center shadow-2xs">
            <Calculator size={18} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1">
              <h4 className="text-xs font-bold text-[#155EEF]">
                Kinematic Sizing Calculators
              </h4>
              <ArrowRight
                size={11}
                className="text-[#155EEF] shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </div>
            <p className="text-[11px] text-[#475467] leading-relaxed mt-1 line-clamp-2">
              Calculate reducer torque, motor inertia ratios, and linear feed force with physics formulas.
            </p>
          </div>
        </Link>
      </div>

      {/* Footer bar */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="font-mono text-[11px]">
          Physics-Validated Calculations • DIN 3990 &amp; ISO 9283
        </span>
        <div className="flex items-center gap-4">
          <Link
            to="/technology/architecture-explorer"
            onClick={() => onLinkClick("Architecture L0-L5", "/technology/architecture-explorer")}
            className="text-slate-600 hover:text-[#155EEF] font-medium transition-colors"
          >
            Hardware Architecture Stack (L0–L5) →
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
