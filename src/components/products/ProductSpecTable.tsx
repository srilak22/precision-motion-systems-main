import React, { useState } from "react";
import { Activity, ShieldCheck, Filter, Download, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { NormalizedProductData } from "./types";

interface ProductSpecTableProps {
  data: NormalizedProductData;
  onRequestQuote: () => void;
}

export function ProductSpecTable({ data, onRequestQuote }: ProductSpecTableProps) {
  const [filterQuery, setFilterQuery] = useState("");
  const [selectedRatingType, setSelectedRatingType] = useState<string>("All");

  const ratingTypes = [
    "All",
    ...Array.from(new Set(data.specifications.map((s) => s.ratingType || "Verified"))),
  ];

  const filteredSpecs = data.specifications.filter((s) => {
    const matchesQuery =
      s.parameter.toLowerCase().includes(filterQuery.toLowerCase()) ||
      s.value.toLowerCase().includes(filterQuery.toLowerCase()) ||
      s.notes.toLowerCase().includes(filterQuery.toLowerCase());

    const matchesRating =
      selectedRatingType === "All" || (s.ratingType || "Verified") === selectedRatingType;

    return matchesQuery && matchesRating;
  });

  return (
    <section id="specifications" className="border-b border-[#E5EAF1] bg-[#FFFFFF] px-4 py-14 sm:px-6 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-[1440px]">
        {/* Section Header with Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF]">
              <Activity size={14} />
              <span>4. Verified Technical Specifications</span>
            </div>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-[#172033] tracking-tight">
              Engineering Specification Matrix
            </h2>
            <p className="mt-2 text-sm text-[#475467] leading-relaxed">
              Continuous duty ratings are strictly separated from peak dynamic envelopes. All parameters reflect verified laboratory data traceable to {data.traceableStandard}.
            </p>
          </div>

          {/* Rating Type Tabs & Filter */}
          <div className="flex flex-wrap items-center gap-2">
            {ratingTypes.length > 2 && (
              <div className="flex items-center gap-1 rounded-lg border border-[#E5EAF1] bg-[#F8FAFC] p-1">
                {ratingTypes.map((rt) => (
                  <button
                    key={rt}
                    type="button"
                    onClick={() => setSelectedRatingType(rt)}
                    className={`rounded-md px-2.5 py-1 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                      selectedRatingType === rt
                        ? "bg-[#155EEF] text-white shadow-2xs font-bold"
                        : "text-[#667085] hover:text-[#172033]"
                    }`}
                  >
                    {rt}
                  </button>
                ))}
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={onRequestQuote}
              className="text-xs font-bold text-[#155EEF] border-[#B2CCFF] bg-[#EFF6FF] hover:bg-[#D1E9FF]"
            >
              Request Custom Sizing Proposal
            </Button>
          </div>
        </div>

        {/* Specifications Table */}
        <div className="mt-6 overflow-x-auto rounded-xl border border-[#E5EAF1] bg-white shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#E5EAF1] bg-[#F8FAFC] uppercase tracking-wider text-[#475467] font-bold text-[11px]">
              <tr>
                <th className="px-5 py-3.5 w-1/4">Parameter</th>
                <th className="px-5 py-3.5 w-1/4">Specification Value</th>
                <th className="px-5 py-3.5 w-1/6">Unit</th>
                <th className="px-5 py-3.5 w-1/3">Notes &amp; Test Conditions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAF1]">
              {filteredSpecs.length > 0 ? (
                filteredSpecs.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#F8FAFC] transition-colors">
                    {/* Parameter */}
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-[#172033] text-xs">
                        {row.parameter}
                      </div>
                      {row.ratingType && (
                        <div className="mt-1">
                          <span
                            className={`inline-block rounded px-1.5 py-0.5 text-[9px] font-mono uppercase font-bold tracking-wider ${
                              row.ratingType === "Continuous"
                                ? "bg-[#ECFDF3] text-[#16A34A] border border-[#A6F4C5]"
                                : row.ratingType === "Peak"
                                ? "bg-[#FEF3F2] text-[#D92D20] border border-[#FECDCA]"
                                : "bg-[#EFF6FF] text-[#155EEF] border border-[#B2CCFF]"
                            }`}
                          >
                            {row.ratingType}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Specification Value */}
                    <td className="px-5 py-3.5 font-mono font-bold text-[#172033] text-xs">
                      {row.value}
                    </td>

                    {/* Unit */}
                    <td className="px-5 py-3.5 font-mono text-[#667085] text-xs">
                      {row.unit || "—"}
                    </td>

                    {/* Notes & Operating Limits */}
                    <td className="px-5 py-3.5 text-[#475467] text-[11.5px] leading-relaxed">
                      {row.notes}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-xs text-[#667085]">
                    No specifications matched your filter query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Notes */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[#667085]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-[#16A34A] shrink-0" />
            <span>{data.verificationStandardNotes}</span>
          </div>
          <div className="font-mono text-[11px] text-[#475467]">
            Model Family: <span className="font-bold text-[#155EEF]">{data.modelCode}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
