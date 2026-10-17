import React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, GitCompare, FileText, CheckCircle2 } from "lucide-react";
import { ProductImage } from "./ProductImage";
import { useModals } from "@/components/modals/ModalContext";
import { engineeringDossiers } from "@/data/engineeringData";
import type { Product } from "@/data/robotics";

export interface ProductCardProps {
  product: Product;
  className?: string;
  showCompareAction?: boolean;
}

export function ProductCard({
  product,
  className = "",
  showCompareAction = true,
}: ProductCardProps) {
  const { openModal } = useModals();
  const dossier = engineeringDossiers[product.id] || engineeringDossiers[product.slug];

  // Key performance attributes with honest fallback
  const keySpecs = product.specifications?.slice(0, 3) || [];

  return (
    <article
      className={`group flex flex-col justify-between rounded-xl border border-border bg-card shadow-xs transition-all duration-300 hover:border-primary hover:shadow-md ${className}`}
    >
      <div>
        {/* Product Visual Container with Consistent Aspect Ratio */}
        <div className="overflow-hidden rounded-t-xl bg-slate-100">
          <ProductImage
            product={product}
            alt={`${product.name} industrial robotics component`}
            aspectRatioClass="aspect-[16/10]"
          />
        </div>

        {/* Content Body */}
        <div className="p-6">
          {/* Eyebrow & Model Code */}
          <div className="flex items-center justify-between gap-2">
            <span className="rounded-xs border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[.18em] text-primary">
              {product.category}
            </span>
            <span className="font-mono text-[10px] font-semibold uppercase text-slate-400">
              {dossier?.modelCode || product.slug}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="mt-3 font-display text-xl font-bold uppercase tracking-tight text-foreground group-hover:text-primary transition-colors">
            <Link
              to="/products/$category/$id"
              params={{ category: product.categorySlug, id: product.slug }}
              className="hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded"
            >
              {product.name}
            </Link>
          </h3>

          {/* Concise Positioning Description */}
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">
            {product.shortDescription || product.positioning}
          </p>

          {/* Key Engineering Specifications Grid */}
          {keySpecs.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border/60 pt-3 text-[11px]">
              {keySpecs.map((spec, i) => (
                <div key={i} className="rounded bg-muted/40 p-2 border border-border/40">
                  <span className="block text-[9px] uppercase tracking-wider text-muted-foreground line-clamp-1">
                    {spec.label}
                  </span>
                  <span className="font-mono font-bold text-foreground line-clamp-1">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between gap-2 border-t border-border/80 bg-muted/20 px-6 py-3.5 rounded-b-xl">
        <Link
          to="/products/$category/$id"
          params={{ category: product.categorySlug, id: product.slug }}
          className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-signal hover:underline"
        >
          Specifications <ArrowRight size={13} />
        </Link>

        <div className="flex items-center gap-2">
          {showCompareAction && (
            <Link
              to="/products/compare"
              className="text-[11px] font-semibold text-muted-foreground hover:text-foreground inline-flex items-center gap-1 cursor-pointer"
              title="Compare in Engineering Decision Matrix"
            >
              <GitCompare size={12} />
              <span>Compare</span>
            </Link>
          )}

          <button
            onClick={() => openModal("quote", { productName: product.name })}
            className="rounded bg-primary/10 border border-primary/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer"
          >
            Quote
          </button>
        </div>
      </div>
    </article>
  );
}
