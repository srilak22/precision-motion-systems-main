import React from "react";
import { Layers, ChevronRight, Check } from "lucide-react";

export interface FamilyNavItem {
  id: string;
  name: string;
  description?: string;
  productCount: number;
}

export interface CategoryFamilyNavProps {
  families: FamilyNavItem[];
  selectedFamilyId: string;
  onSelectFamily: (familyId: string) => void;
  totalProductsCount: number;
}

export function CategoryFamilyNav({
  families,
  selectedFamilyId,
  onSelectFamily,
  totalProductsCount,
}: CategoryFamilyNavProps) {
  return (
    <section className="border-b border-slate-200/80 bg-white px-4 py-4 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[.18em] text-[#155EEF]">
              Section B: Technology Navigation
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-semibold text-slate-700">
              Filter by Product Family
            </span>
          </div>

          <span className="text-[11px] font-mono text-slate-500">
            {families.length} Configured Mechatronic Subfamilies
          </span>
        </div>

        {/* Clean, compact horizontal pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-1 scrollbar-none no-scrollbar">
          {/* "All Families" Tab */}
          <button
            type="button"
            onClick={() => onSelectFamily("all")}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF] ${
              selectedFamilyId === "all"
                ? "bg-[#155EEF] text-white shadow-xs"
                : "border border-slate-200 bg-slate-50/80 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
            }`}
          >
            <span>All Families</span>
            <span
              className={`rounded-full px-1.5 py-0.2 font-mono text-[10px] font-bold ${
                selectedFamilyId === "all"
                  ? "bg-white/20 text-white"
                  : "bg-slate-200/80 text-slate-600"
              }`}
            >
              {totalProductsCount}
            </span>
          </button>

          {/* Each Individual Family Tab */}
          {families.map((family) => {
            const isSelected = selectedFamilyId === family.id;
            return (
              <button
                key={family.id}
                type="button"
                onClick={() => onSelectFamily(family.id)}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF] ${
                  isSelected
                    ? "bg-[#155EEF] text-white shadow-xs"
                    : "border border-slate-200 bg-slate-50/80 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                }`}
              >
                <span>{family.name}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 font-mono text-[10px] font-bold ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-slate-200/80 text-slate-600"
                  }`}
                >
                  {family.productCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
