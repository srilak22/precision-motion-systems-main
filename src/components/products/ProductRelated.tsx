import React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Layers } from "lucide-react";
import { ProductCard } from "@/components/common/ProductCard";
import { getProduct, type Product } from "@/data/robotics";
import type { NormalizedProductData } from "./types";

interface ProductRelatedProps {
  data: NormalizedProductData;
  onQuickQuote: (productName: string, category: string) => void;
}

export function ProductRelated({ data }: ProductRelatedProps) {
  // Find related products by IDs or category
  const resolvedRelated: Product[] = [];

  for (const id of data.relatedProductIds) {
    const p = getProduct(id);
    if (p && p.id !== data.id && !resolvedRelated.some((r) => r.id === p.id)) {
      resolvedRelated.push(p);
    }
    if (resolvedRelated.length >= 3) break;
  }

  // If still fewer than 3, grab complementary products from same or related category
  if (resolvedRelated.length < 3) {
    const fallbackIds = ["linear", "rotary", "servo-drives", "motion-controllers", "planetary"];
    for (const id of fallbackIds) {
      const p = getProduct(id);
      if (p && p.id !== data.id && !resolvedRelated.some((r) => r.id === p.id)) {
        resolvedRelated.push(p);
      }
      if (resolvedRelated.length >= 3) break;
    }
  }

  if (resolvedRelated.length === 0) {
    return null;
  }

  return (
    <section id="related-products" className="border-b border-[#E5EAF1] bg-[#FFFFFF] px-4 py-14 sm:px-6 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-[1440px]">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF]">
              <Layers size={14} />
              <span>10. Complementary Systems &amp; Components</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#172033] mt-2 tracking-tight">
              Compatible Kinematic &amp; Control Products
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs font-bold text-[#155EEF] hover:underline inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF] rounded px-1"
          >
            Explore Full Robotics Catalogue <ArrowRight size={13} />
          </Link>
        </div>

        {/* Standardized Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resolvedRelated.map((rel) => (
            <ProductCard
              key={rel.id}
              product={rel}
              showCompareAction={true}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
