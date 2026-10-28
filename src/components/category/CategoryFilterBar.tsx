import React from "react";
import { Search, SlidersHorizontal, RotateCcw, X, Check } from "lucide-react";
import type { FamilyNavItem } from "./CategoryFamilyNav";

export interface CategoryFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  families: FamilyNavItem[];
  selectedFamilyId: string;
  onFamilyChange: (familyId: string) => void;
  sortOption: "default" | "name-asc" | "name-desc" | "model";
  onSortChange: (sort: "default" | "name-asc" | "name-desc" | "model") => void;
  onResetFilters: () => void;
  filteredCount: number;
  totalCount: number;
}

export function CategoryFilterBar({
  searchQuery,
  onSearchChange,
  families,
  selectedFamilyId,
  onFamilyChange,
  sortOption,
  onSortChange,
  onResetFilters,
  filteredCount,
  totalCount,
}: CategoryFilterBarProps) {
  const isFiltered =
    searchQuery.trim().length > 0 ||
    selectedFamilyId !== "all" ||
    sortOption !== "default";

  const selectedFamilyName =
    families.find((f) => f.id === selectedFamilyId)?.name || null;

  return (
    <section className="border-b border-slate-200/80 bg-slate-50/70 px-4 py-4 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        {/* Main Controls Row */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* 1. Real-Time Search Bar */}
          <div className="relative flex-1 max-w-lg">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search products by model, specification, or keyword..."
              aria-label="Search products"
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-9 text-xs text-slate-900 placeholder:text-slate-400 shadow-2xs outline-none transition-colors focus:border-[#155EEF] focus:ring-1 focus:ring-[#155EEF]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors p-0.5"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* 2. Filter & Sort Dropdowns */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Family Dropdown */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 h-10 shadow-2xs">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Family:
              </span>
              <select
                value={selectedFamilyId}
                onChange={(e) => onFamilyChange(e.target.value)}
                aria-label="Filter by product family"
                className="bg-transparent text-xs font-semibold text-slate-800 outline-none cursor-pointer pr-1"
              >
                <option value="all">All Families ({totalCount})</option>
                {families.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.productCount})
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 h-10 shadow-2xs">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Sort:
              </span>
              <select
                value={sortOption}
                onChange={(e) =>
                  onSortChange(e.target.value as "default" | "name-asc" | "name-desc" | "model")
                }
                aria-label="Sort products"
                className="bg-transparent text-xs font-semibold text-slate-800 outline-none cursor-pointer pr-1"
              >
                <option value="default">Featured Order</option>
                <option value="name-asc">Name (A → Z)</option>
                <option value="name-desc">Name (Z → A)</option>
                <option value="model">Model Code</option>
              </select>
            </div>

            {/* Reset Filters Action */}
            {isFiltered && (
              <button
                type="button"
                onClick={onResetFilters}
                className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 text-xs font-bold text-rose-600 hover:bg-rose-100 transition-colors shadow-2xs cursor-pointer"
              >
                <RotateCcw size={13} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Active Filter Chips & Counter Strip */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/60 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-[11px] font-bold text-slate-600">
              Showing {filteredCount} of {totalCount} verified products
            </span>

            {searchQuery && (
              <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 border border-blue-200 px-2 py-0.5 text-[11px] text-[#155EEF] font-semibold">
                <span>Keyword: &ldquo;{searchQuery}&rdquo;</span>
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="hover:text-blue-900 ml-0.5"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {selectedFamilyId !== "all" && selectedFamilyName && (
              <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 border border-blue-200 px-2 py-0.5 text-[11px] text-[#155EEF] font-semibold">
                <span>Family: {selectedFamilyName}</span>
                <button
                  type="button"
                  onClick={() => onFamilyChange("all")}
                  className="hover:text-blue-900 ml-0.5"
                >
                  <X size={12} />
                </button>
              </span>
            )}
          </div>

          <span className="text-[11px] font-mono text-slate-400">
            Adheres strictly to verified datasheets
          </span>
        </div>
      </div>
    </section>
  );
}
