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
  BrainCircuit,
  Bot,
  Move3d,
  Radio,
  Sparkles,
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
  badge?: string;
  isSpecial?: boolean;
}

const ENGINEERING_LIST: EngineeringItemConfig[] = [
  {
    id: "physical-ai",
    title: "Physical AI Platform",
    description: "3D point clouds, vision-language-action (VLA) models, and 1kHz deterministic robot control",
    href: "/technology/physical-ai",
    icon: BrainCircuit,
    badge: "Flagship",
    isSpecial: true,
  },
  {
    id: "motion-studio",
    title: "INDUS Motion Studio",
    description: "7th-axis dual-robot workcell simulation, inverse kinematics (J1-J6), and inertia ratio sizing",
    href: "/technology/motion-studio",
    icon: Move3d,
    badge: "Interactive",
    isSpecial: true,
  },
  {
    id: "robotics-ecosystem",
    title: "Robotics Ecosystem",
    description: "8-pillar architecture: Humanoids, AMRs, Cobots, AI Vision, Delta, Cartesian, and Soft Grippers",
    href: "/technology/robotics-ecosystem",
    icon: Bot,
    badge: "Taxonomy",
  },
  {
    id: "digital-twin",
    title: "Digital Twin & Telemetry",
    description: "Virtual workcell simulation, ISO 10816 vibration FFT diagnostics, and AMR fleet tracking",
    href: "/technology/digital-twin",
    icon: Radio,
    badge: "Live Twin",
  },
  {
    id: "indus-bot",
    title: "Indus Bot 2.0 AI Assistant",
    description: "Dedicated multimodal engineering assistant for component discovery, voice queries & vision",
    href: "/indus-bot",
    icon: Sparkles,
    badge: "AI + Vision",
  },
  {
    id: "capabilities",
    title: "Engineering Services Hub",
    description: "Kinematics feasibility, joint mechatronics, robotic workcells, and motion control engineering",
    href: "/engineering-services",
    icon: Wrench,
  },
  {
    id: "downloads",
    title: "CAD & Technical Downloads",
    description: "Download 3D STEP models, dimensional drawings, datasheets, wiring diagrams, and manuals",
    href: "/engineering-services/cad-downloads",
    icon: Download,
  },
  {
    id: "standards",
    title: "Quality & Testing Standards",
    description: "Engineering standards, ISO 9283 / DIN 3990 test references, and certification dossiers",
    href: "/engineering-services/quality-standards",
    icon: ShieldCheck,
  },
];

export function EngineeringMegaMenu({
  onClose,
  onLinkClick,
  onQuoteClick,
}: EngineeringMegaMenuProps) {
  return (
    <div className="p-6 bg-white max-w-[1200px] mx-auto">
      {/* Header section */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF]">
            Robotics Technology &bull; Simulation &bull; Intelligence
          </span>
          <h3 className="text-base font-bold text-slate-900 mt-0.5">
            Systems Engineering, Physical AI &amp; Simulation Platforms
          </h3>
        </div>
        <Link
          to="/technology"
          onClick={() => onLinkClick("Technology Hub", "/technology")}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#155EEF] hover:text-[#1047BF] transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF] rounded px-2 py-1"
        >
          <span>Explore Technology Stack</span>
          <ArrowRight
            size={13}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>
      </div>

      {/* Grid of Engineering Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-4">
        {ENGINEERING_LIST.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              to={item.href}
              onClick={() => onLinkClick(item.title, item.href)}
              className={`group flex items-start gap-3 p-3.5 rounded-xl border transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF] ${
                item.isSpecial
                  ? "border-[#D1E0FF] bg-[#EFF6FF]/60 hover:bg-[#EFF6FF] hover:border-[#155EEF]/70 shadow-2xs"
                  : "border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50/70"
              }`}
            >
              <div
                className={`size-8 rounded-lg shrink-0 flex items-center justify-center transition-colors ${
                  item.isSpecial
                    ? "bg-[#155EEF] text-white"
                    : "bg-slate-100 text-slate-700 group-hover:bg-[#155EEF] group-hover:text-white"
                }`}
              >
                <Icon size={16} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#155EEF] transition-colors leading-tight">
                    {item.title}
                  </h4>
                  {item.badge && (
                    <span className="text-[9px] font-mono uppercase font-bold px-1.5 py-0.2 rounded bg-blue-100 text-[#155EEF] border border-blue-200">
                      {item.badge}
                    </span>
                  )}
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
      <div className="mt-5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-3">
        <span className="font-mono text-[11px]">
          Physics-Validated Calculations &bull; DIN 3990 &amp; ISO 9283
        </span>
        <div className="flex items-center gap-4">
          <Link
            to="/technology/motion-studio"
            onClick={() => onLinkClick("Motion Studio", "/technology/motion-studio")}
            className="text-slate-600 hover:text-[#155EEF] font-medium transition-colors"
          >
            Launch 7th-Axis Motion Studio &rarr;
          </Link>
          <button
            type="button"
            onClick={onQuoteClick}
            className="text-[#155EEF] hover:text-[#1047BF] font-bold cursor-pointer transition-colors"
          >
            Request Sizing Proposal
          </button>
        </div>
      </div>
    </div>
  );
}
