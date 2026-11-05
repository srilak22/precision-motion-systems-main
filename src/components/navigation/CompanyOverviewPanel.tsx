import React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Building2, Sparkles, ShieldCheck } from "lucide-react";

interface CompanyOverviewPanelProps {
  onLinkClick: (title: string, href: string) => void;
}

export function CompanyOverviewPanel({ onLinkClick }: CompanyOverviewPanelProps) {
  return (
    <div className="w-full lg:w-[285px] shrink-0 bg-[#F8FAFC] border border-[#E5EAF1] rounded-2xl p-5 flex flex-col justify-between">
      <div>
        {/* Category Label */}
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10.5px] font-mono font-bold uppercase tracking-wider text-[#155EEF] bg-[#EFF6FF] border border-[#D1E0FF]">
            <Building2 size={12} className="text-[#155EEF]" />
            COMPANY
          </span>
        </div>

        {/* Main Heading */}
        <h3 className="mt-3 text-xl font-bold tracking-tight text-[#101B2D]">About INDUS</h3>

        {/* Concise Company Introduction */}
        <p className="mt-2 text-xs leading-relaxed text-[#475467]">
          INDUS Industrial Robotics develops precision motion components, mechanical joint reducers,
          autonomous mobile systems, and multi-axis kinematic controllers for industrial
          manufacturers.
        </p>

        {/* Short Supporting Statement */}
        <p className="mt-2.5 text-[11px] leading-relaxed text-[#667085] border-t border-[#E5EAF1] pt-2.5">
          Bridging sub-arcminute mechanical accuracy with intelligent automation to empower
          zero-defect industrial operations worldwide.
        </p>

        {/* Highlighted Information Pill */}
        <div className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold text-[#0284C7] bg-[#E0F2FE]/70 border border-[#38BDF8]/50">
          <Sparkles size={12} className="text-[#0284C7] shrink-0" />
          <span>Precision Engineering &amp; Automation</span>
        </div>
      </div>

      {/* Prominent CTA Button */}
      <div className="mt-5 pt-4 border-t border-[#E5EAF1]">
        <Link
          to="/about"
          onClick={() => onLinkClick("Explore Company Profile", "/about")}
          className="group flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl bg-[#155EEF] hover:bg-[#1047BF] text-white text-xs font-bold shadow-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF]"
        >
          <span>Explore Company Profile</span>
          <ArrowRight
            size={14}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>
      </div>
    </div>
  );
}
