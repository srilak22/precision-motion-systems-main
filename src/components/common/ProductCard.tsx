import React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, GitCompare, ArrowUpRight } from "lucide-react";
import { ProductImage } from "./ProductImage";
import { useModals } from "@/components/modals/ModalContext";
import { engineeringDossiers, type EngineeringParameter } from "@/data/engineeringData";
import type { Product } from "@/data/robotics";

export interface ProductCardProps {
  product: Product;
  className?: string;
  showCompareAction?: boolean;
  priority?: boolean;
}

interface DisplaySpec {
  label: string;
  value: string;
}

export function ProductCard({
  product,
  className = "",
  showCompareAction = true,
  priority = false,
}: ProductCardProps) {
  const { openModal } = useModals();
  const dossier = engineeringDossiers[product.id] || engineeringDossiers[product.slug];

  // Resolve authentic verified specifications, strictly eliminating any placeholders
  const verifiedSpecs: DisplaySpec[] = React.useMemo(() => {
    const specs: DisplaySpec[] = [];

    // 1. Try to extract from research-backed engineering dossiers first
    if (dossier?.parameters && Array.isArray(dossier.parameters)) {
      for (const param of dossier.parameters) {
        if (specs.length >= 3) break;
        if (!param.value || param.value.includes("[") || param.value.toLowerCase().includes("request")) {
          continue;
        }

        // Clean label
        let shortLabel = param.name;
        if (shortLabel.includes(" (")) shortLabel = shortLabel.split(" (")[0] || shortLabel;
        if (shortLabel.length > 20) shortLabel = shortLabel.substring(0, 18) + "…";

        const formattedVal = param.unit ? `${param.value} ${param.unit}` : param.value;
        specs.push({
          label: shortLabel,
          value: formattedVal,
        });
      }
    }

    // 2. If dossier didn't have enough, check product.specifications (filtering out placeholders)
    if (specs.length < 2 && product.specifications && Array.isArray(product.specifications)) {
      for (const s of product.specifications) {
        if (specs.length >= 3) break;
        if (
          !s.value ||
          s.value.includes("[") ||
          s.value.toLowerCase().includes("request") ||
          s.value.toLowerCase().includes("available")
        ) {
          continue;
        }
        specs.push({
          label: s.label,
          value: s.value,
        });
      }
    }

    return specs;
  }, [dossier, product.specifications]);

  const categoryLabel = product.category || product.categorySlug?.replace(/-/g, " ") || "Robotics";
  const modelCode = dossier?.modelCode || dossier?.modelIdentifier || product.slug?.toUpperCase();

  return (
    <article
      className={`group relative flex h-full flex-col justify-between rounded-xl border border-slate-200/90 bg-white shadow-xs transition-all duration-200 ease-out hover:-translate-y-1 hover:border-[#155EEF]/50 hover:shadow-md ${className}`}
    >
      <div>
        {/* A. Image Stage: 4:3 Aspect Ratio with Centered Photographic Asset */}
        <div className="relative overflow-hidden rounded-t-xl bg-slate-50 border-b border-slate-100">
          <ProductImage
            product={product}
            alt={`${product.name} precision motion component`}
            aspectRatioClass="aspect-[4/3]"
            fitMode="contain"
            priority={priority}
          />

          {/* Model code pill overlaid discreetly in image stage */}
          <div className="absolute top-3 right-3 z-10">
            <span className="rounded bg-white/90 backdrop-blur-xs px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-500 border border-slate-200/70 shadow-2xs">
              {modelCode}
            </span>
          </div>
        </div>

        {/* B. Product Information */}
        <div className="p-5">
          {/* Eyebrow Category */}
          <div className="flex items-center justify-between gap-2">
            <span className="rounded-sm bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[.16em] text-[#155EEF] border border-blue-100">
              {categoryLabel}
            </span>
            {dossier?.datasheet?.verificationLevel && (
              <span className="text-[10px] font-mono text-emerald-600 font-medium">
                Verified Spec
              </span>
            )}
          </div>

          {/* Product Name */}
          <h3 className="mt-2.5 font-display text-lg font-bold uppercase tracking-tight text-slate-900 group-hover:text-[#155EEF] transition-colors leading-snug">
            <Link
              to="/products/$category/$id"
              params={{ category: product.categorySlug, id: product.slug }}
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF] rounded"
            >
              {product.name}
            </Link>
          </h3>

          {/* Positioning Description */}
          <p className="mt-1.5 text-xs leading-relaxed text-slate-600 line-clamp-2">
            {product.shortDescription || product.positioning}
          </p>

          {/* C. Verified Technical Specifications Grid (Omitted cleanly if unavailable) */}
          {verifiedSpecs.length > 0 && (
            <div className="mt-4 border-t border-slate-100 pt-3">
              <div
                className={`grid gap-2 ${
                  verifiedSpecs.length === 3 ? "grid-cols-3" : "grid-cols-2"
                }`}
              >
                {verifiedSpecs.map((spec, i) => (
                  <div
                    key={i}
                    className="rounded-md bg-slate-50 border border-slate-100 p-2 text-left"
                  >
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 truncate">
                      {spec.label}
                    </span>
                    <span className="mt-0.5 block font-mono text-[11px] font-bold text-slate-900 truncate">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* D. Card Footer: Primary CTA & Restrained Secondary Actions */}
      <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-3 rounded-b-xl">
        <Link
          to="/products/$category/$id"
          params={{ category: product.categorySlug, id: product.slug }}
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#155EEF] hover:text-[#0c44b3] transition-colors group/link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF] rounded"
        >
          <span>View Specifications</span>
          <ArrowRight
            size={13}
            className="transition-transform duration-200 group-hover/link:translate-x-1"
          />
        </Link>

        <div className="flex items-center gap-2">
          {showCompareAction && (
            <Link
              to="/products/compare"
              className="text-[11px] font-semibold text-slate-500 hover:text-slate-900 inline-flex items-center gap-1 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400 rounded px-1"
              title="Compare in Decision Matrix"
            >
              <GitCompare size={12} />
              <span>Compare</span>
            </Link>
          )}

          <button
            type="button"
            onClick={() =>
              openModal("quote", {
                productName: product.name,
                categoryName: product.category,
              })
            }
            className="rounded bg-blue-50 border border-blue-200/80 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#155EEF] hover:bg-[#155EEF] hover:text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF]"
          >
            Quote
          </button>
        </div>
      </div>
    </article>
  );
}
