import React from "react";
import { Link } from "@tanstack/react-router";
import {
  Bot,
  Brain,
  Settings2,
  Cpu,
  Eye,
  Layers,
  Terminal,
  Workflow,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { CAPABILITY_STACK } from "@/data/aboutPageData";

const ICON_MAP: Record<string, React.ElementType<{ size?: number; className?: string }>> = {
  "industrial-robotics": Bot,
  "physical-ai": Brain,
  "precision-motion": Settings2,
  "robotics-simulation": Cpu,
  "robot-perception": Eye,
  "motion-control": Layers,
  "robotics-software": Terminal,
  "automation-integration": Workflow,
  "reliability-testing": ShieldCheck,
};

export function EngineeringCapabilities() {
  return (
    <section
      id="capabilities-stack"
      className="py-20 lg:py-24 bg-[#F8FAFC] border-b border-[#E5EAF1] scroll-mt-36"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF] bg-[#EFF6FF] border border-[#D1E0FF]">
              <Cpu size={12} className="text-[#155EEF]" />
              DEEP-TECH SPECIALIZATION
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-[#101B2D]">
              Engineering the Complete Robotics and Automation Stack
            </h2>
            <p className="mt-3 text-base text-[#475467] leading-relaxed">
              INDUS unifies mechanical joint engineering, power electronics, deterministic motion
              control, distributed robotics software, physics simulation, and turnkey factory
              integration.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#155EEF] hover:text-[#1047BF] transition-colors shrink-0 group"
          >
            <span>Explore All Products &amp; Subsystems</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 9 Capability Cards Grid (3x3 on desktop) */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CAPABILITY_STACK.map((cap) => {
            const Icon = ICON_MAP[cap.id] || Cpu;

            return (
              <div
                key={cap.id}
                className="group flex flex-col justify-between rounded-2xl border border-[#E5EAF1] bg-white p-6 hover:border-[#155EEF]/50 hover:shadow-lg transition-all duration-300"
              >
                <div>
                  {/* Top Bar: Icon and Category Tag */}
                  <div className="flex items-center justify-between">
                    <div className="size-11 rounded-xl bg-[#EFF6FF] border border-[#D1E0FF] text-[#155EEF] flex items-center justify-center group-hover:bg-[#155EEF] group-hover:text-white transition-colors duration-200">
                      <Icon size={20} />
                    </div>
                    <span className="text-[10.5px] font-mono font-semibold px-2.5 py-1 rounded-md bg-[#F1F5F9] text-[#475467]">
                      {cap.category}
                    </span>
                  </div>

                  {/* Title & Technical Description */}
                  <h3 className="mt-4 text-base font-bold text-[#101B2D] group-hover:text-[#155EEF] transition-colors">
                    {cap.title}
                  </h3>
                  <p className="mt-2 text-xs text-[#475467] leading-relaxed">{cap.description}</p>

                  {/* Engineering Expertise Tags */}
                  <div className="mt-4 pt-3 border-t border-[#F2F4F7]">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#98A2B3] block mb-2">
                      Key Capabilities:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cap.expertise.map((exp) => (
                        <span
                          key={exp}
                          className="px-2 py-0.5 rounded text-[10.5px] font-medium bg-[#F8FAFC] text-[#344054] border border-[#E5EAF1]"
                        >
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Navigation Link */}
                <div className="mt-6 pt-3.5 border-t border-[#F2F4F7]">
                  <Link
                    to={cap.href as never}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#155EEF] group-hover:text-[#1047BF] transition-colors"
                  >
                    <span>View Specifications &amp; Solutions</span>
                    <ArrowRight
                      size={13}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
