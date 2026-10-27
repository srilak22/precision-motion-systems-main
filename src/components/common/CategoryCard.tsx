import React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronRight, type LucideIcon } from "lucide-react";
import { useModals } from "@/components/modals/ModalContext";
import type { TopLevelCategory } from "@/data/productTaxonomy";

export interface CategoryCardProps {
  category: TopLevelCategory;
  icon: React.ElementType<{ size?: number; className?: string }>;
  index?: number;
  className?: string;
}

export function CategoryCard({
  category,
  icon: IconComponent,
  index = 0,
  className = "",
}: CategoryCardProps) {
  const { openModal } = useModals();

  // Compute actual verified range count strictly from confirmed taxonomy data
  const verifiedRangeCount = React.useMemo(() => {
    if (category.groups && Array.isArray(category.groups)) {
      return category.groups.reduce((acc, g) => acc + (g.items?.length || 0), 0);
    }
    return 0;
  }, [category.groups]);

  // Extract top 2-3 technology group names as preview chips
  const technologyPreviews = React.useMemo(() => {
    if (category.groups && Array.isArray(category.groups)) {
      return category.groups.slice(0, 3).map((g) => g.groupName);
    }
    return [];
  }, [category.groups]);

  return (
    <article
      className={`group relative flex h-full flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-6 shadow-xs transition-all duration-200 ease-out hover:-translate-y-1 hover:border-[#155EEF]/50 hover:shadow-md ${className}`}
    >
      <div>
        {/* Top Header: Category Icon & Verified Range Badge */}
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-[#155EEF] border border-blue-100 group-hover:bg-[#155EEF] group-hover:text-white transition-colors">
            <IconComponent size={20} />
          </div>

          <div className="flex items-center gap-2">
            {verifiedRangeCount > 0 && (
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-mono text-[10px] font-bold text-slate-700 border border-slate-200/80">
                {verifiedRangeCount} Ranges
              </span>
            )}
            <span className="font-mono text-[10px] font-semibold text-slate-400">
              0{index + 1}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="mt-4">
          <Link
            to={category.primaryRoute as never}
            className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF] rounded"
          >
            <h3 className="font-display text-xl font-bold uppercase tracking-tight text-slate-900 group-hover:text-[#155EEF] transition-colors leading-snug">
              {category.title}
            </h3>
          </Link>

          {/* Verified Engineering Standard */}
          {category.engineeringStandard && (
            <p className="mt-1 font-mono text-[11px] font-semibold text-[#155EEF]/90">
              {category.engineeringStandard}
            </p>
          )}

          {/* Concise Description */}
          <p className="mt-2 text-xs leading-relaxed text-slate-600 line-clamp-3">
            {category.subtitle || category.description}
          </p>

          {/* Technology Group Chips */}
          {technologyPreviews.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
              {technologyPreviews.map((tech) => (
                <span
                  key={tech}
                  className="rounded bg-slate-50 border border-slate-200/60 px-2 py-0.5 text-[10px] font-medium text-slate-600"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: Clear Action Path */}
      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
        <Link
          to={category.primaryRoute as never}
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#155EEF] hover:text-[#0c44b3] transition-colors group/link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF] rounded"
        >
          <span>Explore Category</span>
          <ArrowRight
            size={13}
            className="transition-transform duration-200 group-hover/link:translate-x-1"
          />
        </Link>

        <button
          type="button"
          onClick={() =>
            openModal("quote", {
              productName: category.title,
              categoryName: category.id,
            })
          }
          className="text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-800 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF] px-1 py-0.5 rounded"
        >
          Request Quote
        </button>
      </div>
    </article>
  );
}
