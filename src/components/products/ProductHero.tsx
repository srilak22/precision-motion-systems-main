import React from "react";
import { Link } from "@tanstack/react-router";
import {
  Gauge,
  RotateCw,
  Cpu,
  ShieldCheck,
  Activity,
  Layers,
  ArrowRight,
  MessageSquare,
  Sparkles,
  Download,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductImage } from "@/components/common/ProductImage";
import { companyConfig } from "@/data/config";
import type { NormalizedProductData } from "./types";

interface ProductHeroProps {
  data: NormalizedProductData;
  onRequestQuote: () => void;
  onRequestConsultation: () => void;
}

export function ProductHero({
  data,
  onRequestQuote,
  onRequestConsultation,
}: ProductHeroProps) {
  const handleWhatsApp = () => {
    window.open(
      companyConfig.getWhatsAppUrl({
        type: "product",
        name: `${data.name} (${data.modelCode})`,
      }),
      "_blank",
      "noopener,noreferrer",
    );
  };

  const getMetricIcon = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes("torque") || l.includes("force") || l.includes("load") || l.includes("grip")) {
      return <Gauge size={20} className="text-[#155EEF] shrink-0" />;
    }
    if (l.includes("speed") || l.includes("velocity") || l.includes("rpm")) {
      return <RotateCw size={20} className="text-[#155EEF] shrink-0" />;
    }
    if (l.includes("backlash") || l.includes("resolution") || l.includes("accuracy") || l.includes("repeatability")) {
      return <Activity size={20} className="text-[#155EEF] shrink-0" />;
    }
    return <Cpu size={20} className="text-[#155EEF] shrink-0" />;
  };

  return (
    <section className="border-b border-[#E5EAF1] bg-[#FFFFFF] px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-[1440px]">
        {/* Two-Column Grid: Left Column Image (col-span-5), Right Column Content (col-span-7) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* =========================================================================
              LEFT COLUMN: PRODUCT IMAGE CONTAINER & TECHNICAL METADATA
             ========================================================================= */}
          <div className="lg:col-span-5 space-y-4">
            <div className="overflow-hidden rounded-2xl border border-[#E5EAF1] bg-[#F8FAFC] p-4 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              {/* Product Visual Container */}
              <div className="overflow-hidden rounded-xl bg-white border border-[#E5EAF1] p-3 shadow-2xs">
                <ProductImage
                  product={data.id}
                  alt={`${data.name} (${data.modelCode}) technical hardware illustration`}
                  aspectRatioClass="aspect-[4/3]"
                  priority
                />
              </div>

              {/* Verified Hardware Spec Bar */}
              <div className="mt-4 space-y-2 border-t border-[#E5EAF1] pt-3 text-[11px] font-mono text-[#667085]">
                <div className="flex items-center justify-between">
                  <span className="text-[#475467] font-semibold">Model Identifier:</span>
                  <span className="font-bold text-[#172033] bg-[#EFF6FF] text-[#155EEF] px-2 py-0.5 rounded border border-[#B2CCFF]">
                    {data.modelCode}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#475467] font-semibold">Engineering Standard:</span>
                  <span className="font-medium text-[#172033] truncate max-w-[210px] text-right">
                    {data.traceableStandard.split("/")[0]?.trim()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#475467] font-semibold">Verification Level:</span>
                  <span className="text-[#16A34A] font-bold flex items-center gap-1">
                    <CheckCircle2 size={12} /> Audited Specification
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Spec Tags */}
            <div className="rounded-xl border border-[#E5EAF1] bg-[#F8FAFC] p-3 text-xs text-[#667085] flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-medium text-[#344054]">
                <ShieldCheck size={14} className="text-[#16A34A]" />
                Traceable Lab Bench Testing
              </span>
              <a
                href="#specifications"
                className="font-bold text-[#155EEF] hover:underline text-[11px]"
              >
                View Full Matrix ↓
              </a>
            </div>
          </div>

          {/* =========================================================================
              RIGHT COLUMN: PRODUCT DETAILS, HIGHLIGHTS & ACTIONS
             ========================================================================= */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div>
              {/* Category & Family Badge */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="rounded-md bg-[#EFF6FF] px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF] border border-[#B2CCFF]">
                  {data.categoryTitle}
                </span>
                <span className="text-[#D0D5DD]">/</span>
                <span className="text-xs font-semibold text-[#475467] uppercase tracking-wider">
                  {data.familyGroup}
                </span>
              </div>

              {/* Product Title (H1) */}
              <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-[#172033] tracking-tight leading-tight">
                {data.name}
              </h1>

              {/* Short Product Description */}
              <p className="mt-3 text-base sm:text-lg text-[#475467] leading-relaxed font-normal">
                {data.shortDescription}
              </p>

              {/* 2x2 Highlights Grid */}
              <div className="my-6 grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-[#E5EAF1] bg-[#F8FAFC] p-4 sm:p-5">
                {data.highlights.map((metric, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-white p-3.5 rounded-lg border border-[#E5EAF1]">
                    <div className="mt-0.5">{getMetricIcon(metric.label)}</div>
                    <div>
                      <span className="block text-[11px] text-[#667085] font-medium leading-tight">
                        {metric.label}
                      </span>
                      <strong className="block text-lg font-bold text-[#172033] tracking-tight mt-0.5">
                        {metric.value}
                      </strong>
                      {(metric.unit || metric.note) && (
                        <span className="block text-[10px] font-mono text-[#667085] mt-0.5">
                          {metric.unit ? `${metric.unit} · ` : ""}
                          {metric.note}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Row */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-wrap items-center gap-3">
                {/* Primary CTA */}
                <Button
                  size="lg"
                  className="h-11 rounded-lg bg-[#155EEF] hover:bg-[#1047BF] text-white font-bold text-xs uppercase tracking-wider px-6 shadow-sm transition-all"
                  onClick={onRequestQuote}
                >
                  Request a Quote
                </Button>

                {/* Secondary CTA: Discuss Application */}
                <Button
                  size="lg"
                  variant="outline"
                  className="h-11 rounded-lg border-[#D0D5DD] bg-white text-[#172033] hover:bg-[#F8FAFC] font-bold text-xs uppercase tracking-wider px-5 shadow-2xs"
                  onClick={onRequestConsultation}
                >
                  Discuss Your Application
                </Button>

                {/* Secondary CTA: View Specifications */}
                <Button
                  size="lg"
                  variant="outline"
                  className="h-11 rounded-lg border-[#D0D5DD] bg-white text-[#475467] hover:bg-[#F8FAFC] font-semibold text-xs uppercase tracking-wider px-4 shadow-2xs"
                  onClick={() => {
                    document.getElementById("specifications")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  View Specifications
                </Button>

                {/* Direct WhatsApp Desk */}
                <Button
                  variant="ghost"
                  onClick={handleWhatsApp}
                  className="h-11 text-xs text-[#16A34A] hover:bg-[#F0FDF4] font-semibold px-3"
                >
                  <MessageSquare size={14} className="mr-1.5" /> WhatsApp Desk
                </Button>
              </div>

              {/* Turnaround Guarantee Banner */}
              <p className="text-[11px] text-[#667085] font-medium flex items-center gap-1.5 pt-1">
                <CheckCircle2 size={13} className="text-[#16A34A]" />
                Official engineering proposal, CAD STEP models, and sizing verification within 24 business hours.
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
