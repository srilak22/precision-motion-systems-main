import React from "react";
import { FileText, Download, ShieldCheck, FileCheck2, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { NormalizedProductData, NormalizedResource } from "./types";

interface ProductDownloadsProps {
  data: NormalizedProductData;
  onRequestResource: (resource: NormalizedResource) => void;
}

export function ProductDownloads({ data, onRequestResource }: ProductDownloadsProps) {
  if (data.resources.length === 0) {
    return null;
  }

  return (
    <section id="downloads" className="border-b border-[#E5EAF1] bg-[#F8FAFC] px-4 py-14 sm:px-6 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-[1440px]">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF]">
            <FileText size={14} />
            <span>9. Technical Documentation &amp; CAD Models</span>
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-[#172033] tracking-tight">
            Datasheets, 3D STEP Geometry &amp; User Manuals
          </h2>
          <p className="mt-2 text-sm text-[#475467] leading-relaxed">
            All engineering assets are revision-controlled and traceable to physical laboratory test benches. Request calibrated files directly from our engineering desk without broken links.
          </p>
        </div>

        {/* Resources Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.resources.map((res, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-[#E5EAF1] bg-white p-5 flex flex-col justify-between hover:border-[#B2CCFF] transition-all shadow-2xs"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF1]">
                  <span className="rounded bg-[#EFF6FF] px-2 py-0.5 text-[10px] font-mono font-bold text-[#155EEF] uppercase">
                    {res.type}
                  </span>
                  <span className="text-[10px] font-mono text-[#667085]">
                    {res.format} · {res.fileSize}
                  </span>
                </div>

                <h3 className="mt-3 font-bold text-sm text-[#172033] leading-snug">
                  {res.title}
                </h3>

                <div className="mt-2 text-xs font-mono text-[#155EEF] font-bold">
                  {res.docNumber}
                </div>

                <p className="mt-1 text-[11px] text-[#667085]">
                  {res.verificationLevel}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#E5EAF1]">
                <Button
                  onClick={() => onRequestResource(res)}
                  variant={res.type === "Datasheet" ? "default" : "outline"}
                  className={`w-full font-bold text-xs uppercase h-10 ${
                    res.type === "Datasheet"
                      ? "bg-[#155EEF] hover:bg-[#1047BF] text-white"
                      : "border-[#D0D5DD] bg-white text-[#344054] hover:bg-[#F8FAFC]"
                  }`}
                >
                  <Download size={14} className="mr-1.5" /> Request {res.type}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
