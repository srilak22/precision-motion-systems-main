import React, { useState, useEffect } from "react";
import { Download, ArrowRight, Layers, FileCode, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { NormalizedProductData } from "./types";

interface StickySpecBarProps {
  data: NormalizedProductData;
  onGetQuote: () => void;
  onDownloadCad: () => void;
}

export function StickySpecBar({ data, onGetQuote, onDownloadCad }: StickySpecBarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past hero section (approx 450px)
      if (window.scrollY > 450) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  // Extract primary highlight specs (e.g. Payload, Speed, Takt, Torque)
  const primarySpec = data.highlights?.[0];
  const secondarySpec = data.highlights?.[1];

  return (
    <aside
      aria-label="Sticky Product Quick Action Bar"
      className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-8px_30px_rgba(15,23,42,0.08)] py-3 px-4 sm:px-6 lg:px-10 animate-in slide-in-from-bottom duration-300"
    >
      <div className="mx-auto max-w-[1440px] flex items-center justify-between gap-4">
        {/* Left: Product Info & Core Engineering Specs */}
        <div className="flex items-center gap-3 sm:gap-5 min-w-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1D4ED8] px-2 py-0.5 rounded bg-blue-50 border border-blue-100 hidden sm:inline-block">
                {data.modelCode || "INDUS MODEL"}
              </span>
              <h4 className="font-display font-bold text-sm sm:text-base text-[#0F172A] truncate">
                {data.name}
              </h4>
            </div>
          </div>

          {/* Core Spec Pills */}
          {(primarySpec || secondarySpec) && (
            <div className="hidden md:flex items-center gap-2 border-l border-slate-200 pl-4 text-xs font-mono">
              {primarySpec && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F8FAFC] border border-slate-200/80">
                  <span className="text-slate-500 uppercase text-[10px]">{primarySpec.label}:</span>
                  <span className="font-bold text-[#0F172A]">
                    {primarySpec.value} {primarySpec.unit || ""}
                  </span>
                </div>
              )}
              {secondarySpec && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F8FAFC] border border-slate-200/80">
                  <span className="text-slate-500 uppercase text-[10px]">{secondarySpec.label}:</span>
                  <span className="font-bold text-[#1D4ED8]">
                    {secondarySpec.value} {secondarySpec.unit || ""}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: High-Conversion CTAs */}
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
