import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Search, RotateCcw } from "lucide-react";
import { ProductCard } from "@/components/common/ProductCard";
import type { Product } from "@/data/robotics";

export interface CategoryProductGridProps {
  products: Product[];
  categoryTitle: string;
  onResetFilters: () => void;
  isFiltered: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.02,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export function CategoryProductGrid({
  products,
  categoryTitle,
  onResetFilters,
  isFiltered,
}: CategoryProductGridProps) {
  const prefersReduced = useReducedMotion();

  if (products.length === 0) {
    return (
      <section className="bg-slate-50/40 px-4 py-16 lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xs">
            <div className="mx-auto grid size-12 place-items-center rounded-full bg-blue-50 text-[#155EEF] mb-4">
              <Search size={22} />
            </div>
            <h3 className="font-display text-xl font-bold uppercase text-slate-900">
              No Matching Products Found
            </h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              We couldn&apos;t find any components in {categoryTitle} matching your current search or filter parameters.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={onResetFilters}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#155EEF] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#1047BF] active:scale-95 transition-all shadow-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF]"
              >
                <RotateCcw size={13} />
                <span>Reset All Filters</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (prefersReduced) {
    return (
      <section className="bg-slate-50/40 px-4 py-8 lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id || product.slug}
                product={product}
                showCompareAction={true}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-slate-50/40 px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        {/* Animated Staggered Grid */}
        <motion.div
          key={products.length > 0 ? products[0].id : "empty"}
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {products.map((product) => (
            <motion.div
              key={product.id || product.slug}
              variants={itemVariants}
              className="h-full"
            >
              <ProductCard
                product={product}
                showCompareAction={true}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
