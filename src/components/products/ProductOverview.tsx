import React from "react";
import { Info, Cpu, ShieldAlert, Factory, Wrench, Layers } from "lucide-react";
import type { NormalizedProductData } from "./types";

interface ProductOverviewProps {
  data: NormalizedProductData;
}

export function ProductOverview({ data }: ProductOverviewProps) {
  return (
    <section id="overview" className="border-b border-[#E5EAF1] bg-[#F8FAFC] px-4 py-14 sm:px-6 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-[1440px]">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF]">
            <Info size={14} />
            <span>3. Product Overview &amp; Operating Principle</span>
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-[#172033] tracking-tight">
            Engineering Fundamentals &amp; Automation Architecture
          </h2>
          <p className="mt-2 text-sm text-[#475467] leading-relaxed">
            Detailed mechatronic breakdown of {data.name}, highlighting functional architecture, physical operating mechanisms, and deployment role.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Pillar 1: What It Is */}
          <div className="rounded-xl border border-[#E5EAF1] bg-white p-6 shadow-2xs hover:border-[#B2CCFF] transition-all">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-[#EFF6FF] p-2 text-[#155EEF]">
                <Layers size={18} />
              </div>
              <h3 className="text-base font-bold text-[#172033]">
                1. What the Product Is
              </h3>
            </div>
            <p className="mt-3 text-sm text-[#475467] leading-relaxed">
              {data.whatItIs}
            </p>
          </div>

          {/* Pillar 2: How It Works */}
          <div className="rounded-xl border border-[#E5EAF1] bg-white p-6 shadow-2xs hover:border-[#B2CCFF] transition-all">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-[#EFF6FF] p-2 text-[#155EEF]">
                <Cpu size={18} />
              </div>
              <h3 className="text-base font-bold text-[#172033]">
                2. Operating Physical Principle
              </h3>
            </div>
            <p className="mt-3 text-sm text-[#475467] leading-relaxed">
              {data.howItWorks}
            </p>
          </div>

          {/* Pillar 3: Engineering Problem Addressed */}
          <div className="rounded-xl border border-[#E5EAF1] bg-white p-6 shadow-2xs hover:border-[#B2CCFF] transition-all">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-[#FEF3F2] p-2 text-[#D92D20]">
                <ShieldAlert size={18} />
              </div>
              <h3 className="text-base font-bold text-[#172033]">
                3. Engineering Problem Addressed
              </h3>
            </div>
            <p className="mt-3 text-sm text-[#475467] leading-relaxed">
              {data.engineeringProblemSolved}
            </p>
          </div>

          {/* Pillar 4: Role in Automation & Environment */}
          <div className="rounded-xl border border-[#E5EAF1] bg-white p-6 shadow-2xs hover:border-[#B2CCFF] transition-all">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-[#F0FDF4] p-2 text-[#16A34A]">
                <Factory size={18} />
              </div>
              <h3 className="text-base font-bold text-[#172033]">
                4. Role in Automation Systems
              </h3>
            </div>
            <p className="mt-3 text-sm text-[#475467] leading-relaxed">
              {data.roleInAutomation}
            </p>
            <div className="mt-3 pt-3 border-t border-[#E5EAF1] text-xs text-[#667085]">
              <strong className="text-[#344054]">Target Operating Environment:</strong>{" "}
              {data.targetEnvironment}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
