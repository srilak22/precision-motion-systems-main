import React from "react";
import { Scale, ChevronRight, Sparkles, Check } from "lucide-react";
import type { NormalizedProductData } from "./types";

interface ProductBenefitsProps {
  data: NormalizedProductData;
}

export function ProductBenefits({ data }: ProductBenefitsProps) {
  if (data.benefits.length === 0) {
    return null;
  }

  return (
    <section id="benefits" className="border-b border-[#E5EAF1] bg-[#F8FAFC] px-4 py-14 sm:px-6 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-[1440px]">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF]">
            <Scale size={14} />
            <span>7. Engineering Benefits &amp; Causality</span>
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-[#172033] tracking-tight">
            Technical Feature → Engineering Effect → Customer Advantage
          </h2>
          <p className="mt-2 text-sm text-[#475467] leading-relaxed">
            Every customer advantage below is linked directly to an underlying physical or electronic design feature. Operating boundaries and verification conditions are explicitly declared.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.benefits.map((b, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-[#E5EAF1] bg-white p-5 flex flex-col justify-between hover:border-[#155EEF] transition-all shadow-2xs"
            >
              <div className="space-y-3.5">
                {/* Step 1: Feature */}
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-[#155EEF] block mb-1">
                    1. Technical Feature
                  </span>
                  <h3 className="font-bold text-sm text-[#172033] leading-snug">
                    {b.feature}
                  </h3>
                </div>

                {/* Step 2: Effect */}
                <div className="pt-3 border-t border-[#E5EAF1]">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#475467] block mb-1 flex items-center gap-1">
                    <ChevronRight size={12} className="text-[#155EEF]" /> 2. Engineering Effect
                  </span>
                  <p className="text-xs text-[#475467] leading-relaxed">
                    {b.effect}
                  </p>
                </div>

                {/* Step 3: Benefit */}
                <div className="pt-3 border-t border-[#E5EAF1] bg-[#EFF6FF] p-3 rounded-lg border border-[#B2CCFF]">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#155EEF] block mb-1 flex items-center gap-1">
                    <Sparkles size={12} /> 3. Customer Benefit
                  </span>
                  <p className="text-xs font-semibold text-[#172033] leading-relaxed">
                    {b.benefit}
                  </p>
                </div>
              </div>

              {/* Conditions */}
              <div className="mt-4 pt-3 border-t border-[#E5EAF1] text-[11px] text-[#475467] bg-[#F8FAFC] p-2.5 rounded-lg border border-[#E5EAF1]">
                <strong className="text-[#172033] block mb-0.5">Verification &amp; Operating Boundaries:</strong>
                <span className="text-[#667085] leading-relaxed">{b.conditions}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
