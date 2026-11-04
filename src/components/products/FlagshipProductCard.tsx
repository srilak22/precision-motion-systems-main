import React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, AlertCircle, Info, ShieldCheck, Box } from "lucide-react";
import type { FlagshipProduct } from "@/data/flagshipCatalogue";
import { ProductImage } from "@/components/common/ProductImage";
import { useModals } from "@/components/modals/ModalContext";

export interface FlagshipProductCardProps {
  product: FlagshipProduct;
  priority?: boolean;
}

export function FlagshipProductCard({ product, priority = false }: FlagshipProductCardProps) {
  const { openModal } = useModals();

  const handleQuoteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openModal("quote", {
      productName: `${product.productName} (${product.sku})`,
      categoryName: product.category,
      productSlug: product.slug,
      modelConfig: product.sku,
      originUrl: `/products/${product.categorySlug}/${product.slug}`,
      quantity: `${product.minimumOrderQuantity} unit`,
      orderUnits: product.minimumOrderQuantity,
    });
  };

  const getStockBadge = () => {
    switch (product.stockStatus) {
      case "In Stock":
        return (
          <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={11} className="text-emerald-600" />
            <span>{product.availableQuantity} In Stock</span>
          </span>
        );
      case "Low Stock":
        return (
          <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-amber-700 border border-amber-200">
            <AlertCircle size={11} className="text-amber-600" />
            <span>Low Stock ({product.availableQuantity} Left)</span>
          </span>
        );
      case "Made to Order":
        return (
          <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-blue-700 border border-blue-200">
            <Info size={11} className="text-blue-600" />
            <span>Made to Order</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded bg-slate-50 px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-700 border border-slate-200">
            <Info size={11} className="text-slate-500" />
            <span>Contact Availability</span>
          </span>
        );
    }
  };

  return (
    <article className="group relative flex h-full flex-col justify-between rounded-xl border border-slate-200 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#155EEF]/60 hover:shadow-lg">
      <div>
        {/* 1. VISUAL IMAGE STAGE (4:3 aspect ratio, contain fit) */}
        <div className="relative overflow-hidden rounded-t-xl bg-slate-50 border-b border-slate-100 p-4">
          <ProductImage
            product={{
              id: product.productId,
              slug: product.slug,
              image: product.imageKey,
            }}
            alt={`${product.productName} industrial component`}
            aspectRatioClass="aspect-[4/3]"
            fitMode="contain"
            priority={priority}
          />

          {/* SKU Badge */}
          <div className="absolute top-3 left-3 z-10">
            <span className="rounded bg-white/95 backdrop-blur-xs px-2 py-0.5 font-mono text-[9.5px] font-bold uppercase tracking-wider text-slate-700 border border-slate-200 shadow-2xs">
              {product.sku}
            </span>
          </div>

          {/* Stock Availability Badge */}
          <div className="absolute top-3 right-3 z-10">{getStockBadge()}</div>
        </div>

        {/* 2. BODY CONTENT */}
        <div className="p-5">
          {/* Eyebrow & Standard */}
          <div className="flex items-center justify-between gap-2">
            <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#155EEF] border border-blue-100 truncate">
              {product.category}
            </span>
            <span className="text-[9px] font-mono text-slate-400 font-semibold truncate max-w-[120px]">
              {product.engineeringStandard.split("/")[0]?.trim()}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="mt-2.5 font-display text-base font-bold uppercase tracking-tight text-slate-900 group-hover:text-[#155EEF] transition-colors leading-snug">
            <Link
              to="/products/$category/$id"
              params={{ category: product.categorySlug, id: product.slug }}
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF] rounded"
            >
              {product.productName}
            </Link>
          </h3>

          {/* Description */}
          <p className="mt-2 text-xs leading-relaxed text-slate-600 line-clamp-2">
            {product.shortDescription}
          </p>

          {/* Key Specifications Matrix (Top 3) */}
          <div className="mt-4 border-t border-slate-100 pt-3">
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              {product.specifications.slice(0, 4).map((spec, sIdx) => (
                <div key={sIdx} className="rounded-md bg-slate-50/80 p-1.5 border border-slate-100">
                  <span className="block text-[9.5px] text-slate-500 font-medium truncate">
                    {spec.label}
                  </span>
                  <span className="block font-mono font-bold text-slate-900 truncate">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. CARD FOOTER ACTIONS */}
      <div className="border-t border-slate-100 bg-slate-50/50 p-4 rounded-b-xl flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Lead Time</span>
          <span className="text-xs font-mono font-semibold text-slate-700">{product.leadTimeWeeks}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleQuoteClick}
            className="rounded-lg bg-[#155EEF] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white hover:bg-[#1047BF] shadow-2xs transition-colors cursor-pointer"
          >
            Quote
          </button>
          <Link
            to="/products/$category/$id"
            params={{ category: product.categorySlug, id: product.slug }}
            className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-700 hover:border-[#155EEF] hover:text-[#155EEF] transition-colors"
            aria-label={`View ${product.productName} specifications`}
          >
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default FlagshipProductCard;
