import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  GitCompare,
  Calculator,
  Layers,
  Compass,
  Bot,
  Activity,
  FileCheck,
  ShieldCheck,
  Wrench,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Cpu,
} from "lucide-react";

interface EngineeringMegaMenuProps {
  onClose: () => void;
  onLinkClick: (title: string, href: string) => void;
  onQuoteClick: () => void;
}

const ENGINEERING_CATEGORIES = [
  { id: "tools", title: "Interactive Engineering Tools", icon: <Calculator size={18} /> },
  { id: "architecture", title: "Hardware Architecture L0–L5", icon: <Layers size={18} /> },
  { id: "standards", title: "Standards & Compliance", icon: <ShieldCheck size={18} /> },
  { id: "calculators", title: "Kinematics & Sizing", icon: <Activity size={18} /> },
  { id: "consultation", title: "Technical Consultation", icon: <Wrench size={18} /> },
];

export function EngineeringMegaMenu({
  onClose,
  onLinkClick,
  onQuoteClick,
}: EngineeringMegaMenuProps) {
  const [activeTab, setActiveTab] = useState<string>("tools");

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-[460px] max-h-[75vh]">
      {/* =========================================================================
          LEFT CATEGORY RAIL (260px - 280px)
         ========================================================================= */}
      <div className="w-full lg:w-[280px] shrink-0 border-b lg:border-b-0 lg:border-r border-[#E5EAF1] bg-[#FBFDFE] p-5 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-base font-bold text-[#172033] tracking-tight">
              Engineering Hub
            </h3>
            <p className="text-xs text-[#667085] mt-1 leading-relaxed">
              Design tools, kinematic models, and compliance standards for integrators.
            </p>
          </div>

          {/* Vertical Selectable Tabs */}
          <nav className="space-y-1" aria-label="Engineering rail">
            {ENGINEERING_CATEGORIES.map((item) => {
              const isActive = item.id === activeTab;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  onMouseEnter={() => setActiveTab(item.id)}
                  className={`group w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-[13.5px] font-medium transition-all duration-150 cursor-pointer ${
                    isActive
                      ? "bg-[#EFF6FF] text-[#155EEF] font-semibold shadow-xs"
                      : "text-[#475467] hover:bg-[#F4F7FB] hover:text-[#172033]"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`shrink-0 transition-colors ${
                        isActive
                          ? "text-[#155EEF]"
                          : "text-[#667085] group-hover:text-[#172033]"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className="truncate">{item.title}</span>
                  </div>

                  <ChevronRight
                    size={15}
                    className={`shrink-0 transition-transform ${
                      isActive
                        ? "text-[#155EEF] translate-x-0.5"
                        : "text-[#98A2B3] group-hover:text-[#475467]"
                    }`}
                  />
                </button>
              );
            })}
          </nav>
        </div>

        {/* View Main Engineering Hub */}
        <div className="pt-4 mt-4 border-t border-[#E5EAF1]">
          <Link
            to="/technology"
            onClick={() => onLinkClick("Engineering Portal", "/technology")}
            className="flex items-center justify-between text-xs font-semibold text-[#155EEF] hover:text-[#1047BF] transition-colors group"
          >
            <span>Engineering &amp; Tech Portal</span>
            <ArrowRight
              size={13}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </div>

      {/* =========================================================================
          RIGHT CONTEXTUAL SUBMENU PANEL
         ========================================================================= */}
      <div className="flex-1 p-6 lg:p-7 flex flex-col justify-between overflow-y-auto bg-white">
        <div>
          {/* Top Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-[#E5EAF1]">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-bold text-[#172033] tracking-tight">
                  Precision Kinematics &amp; Motion Engineering
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#EFF6FF] text-[#155EEF] border border-[#B2CCFF]">
                  <CheckCircle2 size={11} className="text-[#155EEF]" />
                  ISO 9283 / DIN 3990 Standards
                </span>
              </div>
              <p className="text-xs text-[#667085] mt-1 max-w-2xl leading-relaxed">
                Deterministic sizing calculators, 5-layer hardware architectures, and side-by-side component comparators.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                to="/technology"
                onClick={() => onLinkClick("Technology Hub", "/technology")}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#155EEF] hover:text-[#1047BF] transition-colors"
              >
                <span>Full Engineering Suite</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Interactive Engineering Cards (2x3 Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Card 1: Component Comparator */}
            <Link
              to="/products/compare"
              onClick={() => onLinkClick("Component Comparator", "/products/compare")}
              className="group rounded-xl border border-[#E5EAF1] bg-[#FFFFFF] hover:border-[#B2CCFF] hover:shadow-xs p-4 flex flex-col justify-between transition-all"
            >
              <div>
                <div className="size-8 rounded-lg bg-[#EFF6FF] text-[#155EEF] grid place-items-center group-hover:bg-[#155EEF] group-hover:text-white transition-colors">
                  <GitCompare size={16} />
                </div>
                <h4 className="text-sm font-bold text-[#172033] group-hover:text-[#155EEF] transition-colors mt-3">
                  Component Comparator
                </h4>
                <p className="text-[12px] text-[#667085] mt-1 leading-relaxed">
                  Compare torque densities, backlash ratings, and bearing capacities across multiple reducer lines.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-[#F0F4F8] flex items-center justify-between text-xs font-semibold text-[#155EEF]">
                <span>Launch Comparator</span>
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 2: Sizing Calculators */}
            <Link
              to="/technology/calculators"
              onClick={() => onLinkClick("Engineering Calculators", "/technology/calculators")}
              className="group rounded-xl border border-[#E5EAF1] bg-[#FFFFFF] hover:border-[#B2CCFF] hover:shadow-xs p-4 flex flex-col justify-between transition-all"
            >
              <div>
                <div className="size-8 rounded-lg bg-[#EFF6FF] text-[#155EEF] grid place-items-center group-hover:bg-[#155EEF] group-hover:text-white transition-colors">
                  <Calculator size={16} />
                </div>
                <h4 className="text-sm font-bold text-[#172033] group-hover:text-[#155EEF] transition-colors mt-3">
                  Sizing &amp; Kinematics Calculators
                </h4>
                <p className="text-[12px] text-[#667085] mt-1 leading-relaxed">
                  Calculate required continuous torque, acceleration inertia, and service life based on duty cycles.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-[#F0F4F8] flex items-center justify-between text-xs font-semibold text-[#155EEF]">
                <span>Open Calculators</span>
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 3: Architecture Explorer */}
            <Link
              to="/technology/architecture-explorer"
              onClick={() => onLinkClick("Architecture Explorer", "/technology/architecture-explorer")}
              className="group rounded-xl border border-[#E5EAF1] bg-[#FFFFFF] hover:border-[#B2CCFF] hover:shadow-xs p-4 flex flex-col justify-between transition-all"
            >
              <div>
                <div className="size-8 rounded-lg bg-[#EFF6FF] text-[#155EEF] grid place-items-center group-hover:bg-[#155EEF] group-hover:text-white transition-colors">
                  <Layers size={16} />
                </div>
                <h4 className="text-sm font-bold text-[#172033] group-hover:text-[#155EEF] transition-colors mt-3">
                  Hardware Architecture L0–L5
                </h4>
                <p className="text-[12px] text-[#667085] mt-1 leading-relaxed">
                  Explore full mechatronic stacks from structural joints (L0) to supervisory fleet intelligence (L5).
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-[#F0F4F8] flex items-center justify-between text-xs font-semibold text-[#155EEF]">
                <span>Explore Layers</span>
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 4: Intelligent Actuator Architecture */}
            <Link
              to="/technology/intelligent-actuators"
              onClick={() => onLinkClick("Intelligent Actuator Studio", "/technology/intelligent-actuators")}
              className="group rounded-xl border border-[#B2CCFF] bg-[#F5F8FF] hover:border-[#155EEF] hover:shadow-xs p-4 flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="size-8 rounded-lg bg-[#155EEF] text-white grid place-items-center">
                    <Cpu size={16} />
                  </div>
                  <span className="rounded bg-[#155EEF]/10 px-1.5 py-0.5 text-[9.5px] font-bold uppercase text-[#155EEF]">
                    Phase 5 Studio
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#172033] group-hover:text-[#155EEF] transition-colors mt-3">
                  Intelligent Actuator Studio
                </h4>
                <p className="text-[12px] text-[#475467] mt-1 leading-relaxed">
                  Compare verified models, inspect real-time DSP drive telemetry, and configure closed-loop joints.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-[#D1E0FF] flex items-center justify-between text-xs font-semibold text-[#155EEF]">
                <span>Launch Studio Workspace</span>
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 5: Knowledge Graph */}
            <Link
              to="/technology/knowledge-graph"
              onClick={() => onLinkClick("Knowledge Graph", "/technology/knowledge-graph")}
              className="group rounded-xl border border-[#E5EAF1] bg-[#FFFFFF] hover:border-[#B2CCFF] hover:shadow-xs p-4 flex flex-col justify-between transition-all"
            >
              <div>
                <div className="size-8 rounded-lg bg-[#EFF6FF] text-[#155EEF] grid place-items-center group-hover:bg-[#155EEF] group-hover:text-white transition-colors">
                  <Bot size={16} />
                </div>
                <h4 className="text-sm font-bold text-[#172033] group-hover:text-[#155EEF] transition-colors mt-3">
                  Kinematic Knowledge Graph
                </h4>
                <p className="text-[12px] text-[#667085] mt-1 leading-relaxed">
                  Interactive relationship mapping between reducers, motors, controllers, and ISO 9283 standards.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-[#F0F4F8] flex items-center justify-between text-xs font-semibold text-[#155EEF]">
                <span>View Knowledge Graph</span>
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 6: Taxonomy & Engineering Index */}
            <Link
              to="/taxonomy"
              onClick={() => onLinkClick("Taxonomy Index", "/taxonomy")}
              className="group rounded-xl border border-[#E5EAF1] bg-[#FFFFFF] hover:border-[#B2CCFF] hover:shadow-xs p-4 flex flex-col justify-between transition-all"
            >
              <div>
                <div className="size-8 rounded-lg bg-[#EFF6FF] text-[#155EEF] grid place-items-center group-hover:bg-[#155EEF] group-hover:text-white transition-colors">
                  <FileCheck size={16} />
                </div>
                <h4 className="text-sm font-bold text-[#172033] group-hover:text-[#155EEF] transition-colors mt-3">
                  Robotics Taxonomy Index
                </h4>
                <p className="text-[12px] text-[#667085] mt-1 leading-relaxed">
                  Comprehensive reference hierarchy of precision mechanical, kinematic, and automation tiers.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-[#F0F4F8] flex items-center justify-between text-xs font-semibold text-[#155EEF]">
                <span>View Taxonomy Index</span>
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>

        {/* =========================================================================
            BOTTOM CONVERSION BANNER
           ========================================================================= */}
        <div className="mt-6 rounded-xl border border-[#E5EAF1] bg-[#F8FAFC] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-full bg-[#EFF6FF] text-[#155EEF] grid place-items-center shrink-0 border border-[#D1E0FF]">
              <Sparkles size={16} />
            </div>
            <div>
              <h5 className="text-[13.5px] font-semibold text-[#172033]">
                Need custom engineering calculations or sizing verification?
              </h5>
              <p className="text-[12px] text-[#667085]">
                Our senior kinematics team provides formal calculation reports and 3D CAD step models.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link
              to="/application-finder"
              onClick={() => onLinkClick("Application Finder", "/application-finder")}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#B2CCFF] bg-[#EFF6FF] text-[#155EEF] text-xs font-bold hover:bg-[#D1E9FF] shadow-2xs transition-all cursor-pointer"
            >
              <Compass size={13} />
              <span>Find the Right Solution</span>
            </Link>
            <button
              type="button"
              onClick={onQuoteClick}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#155EEF] hover:bg-[#1047BF] text-white text-xs font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer"
            >
              <span>Request Engineering Consultation</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
