import React, { useState } from "react";
import { GitCompare, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { NormalizedProductData, NormalizedVariant } from "./types";

interface ProductVariantsProps {
  data: NormalizedProductData;
  onSelectVariantForQuote: (variant: NormalizedVariant) => void;
}

export function ProductVariants({ data, onSelectVariantForQuote }: ProductVariantsProps) {
  if (!data.hasGenuineVariants || data.variants.length === 0) {
    return null;
  }

  const [selectedModel, setSelectedModel] = useState<string>(data.variants[0]?.modelCode || "");

  const activeVariant =
    data.variants.find((v) => v.modelCode === selectedModel) || data.variants[0];

  return (
    <section id="variants" className="border-b border-[#E5EAF1] bg-[#F8FAFC] px-4 py-14 sm:px-6 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-[1440px]">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF]">
            <GitCompare size={14} />
            <span>5. Product Variants &amp; Configurations</span>
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-[#172033] tracking-tight">
            Standard Configurations &amp; Sizing Matrices
          </h2>
          <p className="mt-2 text-sm text-[#475467] leading-relaxed">
            Select a verified physical variant below to inspect continuous ratings, peak torque/force envelopes, and dimension comparisons.
          </p>
        </div>

        {/* Variant Selector Tabs */}
        <div className="mt-8 flex flex-wrap items-center gap-2">
          {data.variants.map((v) => (
            <button
              key={v.modelCode}
              type="button"
              onClick={() => setSelectedModel(v.modelCode)}
              className={`rounded-lg px-4 py-2 text-xs font-mono font-bold transition-all cursor-pointer border ${
                selectedModel === v.modelCode
                  ? "border-[#155EEF] bg-[#155EEF] text-white shadow-xs"
                  : "border-[#E5EAF1] bg-white text-[#475467] hover:border-[#B2CCFF] hover:text-[#172033]"
              }`}
            >
              {v.modelCode}
            </button>
          ))}
        </div>

        {/* Active Variant Detailed Card */}
        {activeVariant && (
          <div className="mt-6 rounded-xl border border-[#E5EAF1] bg-white p-6 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E5EAF1]">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-[#155EEF] tracking-wider">
                  Active Configuration
                </span>
                <h3 className="text-xl font-bold text-[#172033] mt-0.5">
                  {activeVariant.modelCode} — {activeVariant.headlineMetric}
                </h3>
              </div>
              <Button
                onClick={() => onSelectVariantForQuote(activeVariant)}
                className="bg-[#155EEF] hover:bg-[#1047BF] text-white font-bold text-xs uppercase px-5 h-10"
              >
                Quote This Model ({activeVariant.modelCode}) <ArrowRight size={14} className="ml-1.5" />
              </Button>
            </div>

            {/* Spec Comparison Grid */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-lg bg-[#F8FAFC] border border-[#E5EAF1] p-3.5">
                <span className="text-[11px] text-[#667085] font-medium block">Nominal S1 Rating</span>
                <strong className="text-base font-mono font-bold text-[#172033] mt-1 block">
                  {activeVariant.nominalRating}
                </strong>
                <span className="text-[10px] text-[#667085] mt-0.5 block">Continuous thermal limit</span>
              </div>

              <div className="rounded-lg bg-[#F8FAFC] border border-[#E5EAF1] p-3.5">
                <span className="text-[11px] text-[#667085] font-medium block">Peak Rating Limit</span>
                <strong className="text-base font-mono font-bold text-[#172033] mt-1 block">
                  {activeVariant.peakRating}
                </strong>
                <span className="text-[10px] text-[#667085] mt-0.5 block">Acceleration envelope</span>
              </div>

              <div className="rounded-lg bg-[#F8FAFC] border border-[#E5EAF1] p-3.5">
                <span className="text-[11px] text-[#667085] font-medium block">Rated Speed / Velocity</span>
                <strong className="text-base font-mono font-bold text-[#172033] mt-1 block">
                  {activeVariant.ratedSpeedOrVelocity}
                </strong>
                <span className="text-[10px] text-[#667085] mt-0.5 block">At rated input voltage</span>
              </div>

              <div className="rounded-lg bg-[#F8FAFC] border border-[#E5EAF1] p-3.5">
                <span className="text-[11px] text-[#667085] font-medium block">Precision / Repeatability</span>
                <strong className="text-base font-mono font-bold text-[#172033] mt-1 block">
                  {activeVariant.precisionOrBacklash}
                </strong>
                <span className="text-[10px] text-[#667085] mt-0.5 block">Backlash / Resolution</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[#E5EAF1] flex flex-wrap items-center justify-between gap-3 text-xs text-[#667085]">
              <div>
                <strong className="text-[#344054]">Dimensions &amp; Mass:</strong> {activeVariant.massOrDimension}
              </div>
              <div>
                <strong className="text-[#344054]">Application Fit:</strong> {activeVariant.applicationFit}
              </div>
              <div className="text-[#16A34A] font-semibold flex items-center gap-1">
                <CheckCircle2 size={13} /> {activeVariant.verificationStatus.toUpperCase()} Specification
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
