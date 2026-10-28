import React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductImage } from "@/components/common/ProductImage";
import { getProduct, type Product } from "@/data/robotics";
import type { NormalizedProductData } from "./types";

interface ProductRelatedProps {
  data: NormalizedProductData;
  onQuickQuote: (productName: string, category: string) => void;
}

export function ProductRelated({ data, onQuickQuote }: ProductRelatedProps) {
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
            className="text-xs font-bold text-[#155EEF] hover:underline inline-flex items-center gap-1.5"
          >
            Explore Full Robotics Catalogue <ArrowRight size={13} />
          </Link>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resolvedRelated.map((rel) => (
            <div
              key={rel.id}
              className="rounded-xl border border-[#E5EAF1] bg-[#F8FAFC] p-5 flex flex-col justify-between hover:border-[#B2CCFF] transition-all"
            >
              <div>
                {/* Image */}
                <div className="overflow-hidden rounded-lg bg-white border border-[#E5EAF1] p-2 mb-4">
                  <ProductImage
                    product={rel.id}
                    alt={`${rel.name} component view`}
                    aspectRatioClass="aspect-[16/10]"
                  />
                </div>

                <span className="text-[10px] font-mono font-bold uppercase text-[#155EEF]">
                  {rel.category}
                </span>
                <h3 className="mt-1 font-bold text-base text-[#172033]">
                  {rel.name}
                </h3>
                <p className="mt-1 text-xs text-[#667085] line-clamp-2 leading-relaxed">
                  {rel.shortDescription || rel.positioning || rel.overview}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#E5EAF1] flex items-center justify-between">
                <Link
                  to="/products/$category/$id"
                  params={{ category: rel.categorySlug, id: rel.slug }}
                  className="text-xs font-bold text-[#155EEF] hover:underline inline-flex items-center gap-1"
                >
                  View Specifications <ArrowRight size={13} />
                </Link>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onQuickQuote(rel.name, rel.category)}
                  className="h-8 text-xs border-[#D0D5DD] hover:bg-white"
                >
                  Quote
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
