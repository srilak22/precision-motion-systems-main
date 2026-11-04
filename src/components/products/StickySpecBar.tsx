import React, { useState, useEffect } from "react";
import { Download, ArrowRight, Layers, FileCode, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { NormalizedProductData } from "./types";

export interface StickySpecBarProps {
  productName?: string;
  primarySpec?: string;
  secondarySpec?: string;
  data?: NormalizedProductData;
  onGetQuote: () => void;
  onDownloadCad: () => void;
}

export function StickySpecBar({
  productName,
  primarySpec,
  secondarySpec,
  data,
  onGetQuote,
  onDownloadCad,
}: StickySpecBarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past primary hero section (approx 450px)
      if (window.scrollY > 450) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  // Resolve values from direct props or from data object
  const resolvedName = productName || data?.name || "Industrial Motion System";
  const resolvedPrimary =
    primarySpec ||
    (data?.highlights?.[0]
      ? `${data.highlights[0].label}: ${data.highlights[0].value} ${data.highlights[0].unit || ""}`
      : undefined);
  const resolvedSecondary =
    secondarySpec ||
    (data?.highlights?.[1]
      ? `${data.highlights[1].label}: ${data.highlights[1].value} ${data.highlights[1].unit || ""}`
      : undefined);
  const modelCode = data?.modelCode || "INDUS SPEC";

  return (
    <aside
      aria-label="Sticky Specifications Quick Bar"
      className="fixed bottom-0 inset-x-0 w-full z-50 bg-white/90 backdrop-blur-md border-t border-slate-200 py-3 px-4 sm:px-6 lg:px-10 shadow-[0_-8px_30px_rgba(15,23,42,0.08)] animate-in slide-in-from-bottom duration-300"
    >
      <div className="mx-auto max-w-[1440px] flex items-center justify-between gap-4">
        {/* Left: Product Name & Specs */}
        <div className="flex items-center gap-3 sm:gap-5 min-w-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1D4ED8] px-2 py-0.5 rounded bg-blue-50 border border-blue-100 hidden sm:inline-block">
                {modelCode}
              </span>
              <h4 className="font-display font-bold text-sm sm:text-base text-[#0F172A] truncate">
                {resolvedName}
              </h4>
            </div>
          </div>

          {/* Core Spec Pills */}
          {(resolvedPrimary || resolvedSecondary) && (
            <div className="hidden md:flex items-center gap-2 border-l border-slate-200 pl-4 text-xs font-mono">
              {resolvedPrimary && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F8FAFC] border border-slate-200/80">
                  <span className="font-bold text-[#0F172A]">{resolvedPrimary}</span>
                </div>
              )}
              {resolvedSecondary && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F8FAFC] border border-slate-200/80">
                  <span className="font-bold text-[#1D4ED8]">{resolvedSecondary}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: High-Conversion Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onDownloadCad}
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-[#0F172A] text-xs font-mono font-bold transition-all shadow-2xs cursor-pointer"
          >
            <Download size={14} className="text-[#1D4ED8]" />
            <span className="hidden xs:inline">Download CAD</span>
            <span className="xs:hidden">CAD</span>
          </button>

          <button
            type="button"
            onClick={onGetQuote}
            className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-xl bg-[#1D4ED8] hover:bg-[#155EEF] text-white text-xs font-mono font-bold transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            <span>Get Quote</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
