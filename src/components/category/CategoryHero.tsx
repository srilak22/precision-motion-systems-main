import React from "react";
import { Link } from "@tanstack/react-router";
import {
  ChevronRight,
  ArrowRight,
  Wrench,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Box,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductImage } from "@/components/common/ProductImage";
import { getProductImageUrl } from "@/lib/images";
import { companyConfig } from "@/data/config";
import { useModals } from "@/components/modals/ModalContext";
import type { Category } from "@/data/robotics";

export interface CategoryHeroProps {
  category: Category;
  totalProductsCount: number;
  familyCount: number;
  engineeringStandard?: string;
}

export function CategoryHero({
  category,
  totalProductsCount,
  familyCount,
  engineeringStandard,
}: CategoryHeroProps) {
  const { openModal } = useModals();

  const handleWhatsApp = () => {
    window.open(
      companyConfig.getWhatsAppUrl({ type: "product", name: category.title }),
      "_blank",
      "noopener,noreferrer"
    );
  };

  const imageUrl = getProductImageUrl(category.slug);
  const standard = engineeringStandard || "ISO 9283 / DIN 3990 / IEC 60034";

  return (
    <section className="relative border-b border-slate-200/90 bg-gradient-to-b from-slate-50 via-white to-slate-50/50 px-4 py-8 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        {/* Section A1: Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="mb-5 flex flex-wrap items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500"
        >
          <Link to="/" className="hover:text-[#155EEF] transition-colors">
            Home
          </Link>
          <ChevronRight size={13} className="text-slate-300" />
          <Link to="/products" className="hover:text-[#155EEF] transition-colors">
            Products
          </Link>
          <ChevronRight size={13} className="text-slate-300" />
          <span className="text-[#155EEF] font-bold">{category.title}</span>
        </nav>

        {/* Section A2: Main Grid Hero (2 Columns: Information & Product Visual) */}
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Identity, Description & CTAs */}
          <div className="lg:col-span-7">
            {/* Engineering Standard & Category Badge */}
            <div className="mb-3.5 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-blue-200 bg-blue-50/80 px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF]">
                <ShieldCheck size={13} />
                <span>{standard}</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-100/80 px-2 py-1 text-[10px] font-mono font-semibold uppercase text-slate-600">
                <Box size={12} className="text-slate-500" />
                <span>{totalProductsCount} Verified Products</span>
              </span>
            </div>

            {/* Main Category Heading (Clean, balanced proportion, NOT oversized) */}
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-slate-900 leading-tight">
              {category.title}
            </h1>

            {/* Positioning / Tagline */}
            <p className="mt-2.5 font-display text-base sm:text-lg uppercase tracking-wide text-[#155EEF] font-bold">
              {category.positioning}
            </p>

            {/* Engineering Description */}
            <p className="mt-4 max-w-2xl text-xs sm:text-sm text-slate-600 leading-relaxed">
              {category.intro}
            </p>

            {/* Key Engineering Metrics Strip */}
            <div className="mt-6 grid grid-cols-3 gap-3 border-y border-slate-200/80 py-3.5 max-w-xl">
              <div>
                <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  Verified Ranges
                </span>
                <span className="font-mono text-base font-bold text-slate-900">
                  {totalProductsCount} Models
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  Product Families
                </span>
                <span className="font-mono text-base font-bold text-slate-900">
                  {familyCount} Architectures
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  Traceability
                </span>
                <span className="font-mono text-base font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 size={13} />
                  <span>100% Calibrated</span>
                </span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button
                onClick={() =>
                  openModal("quote", {
                    productName: category.title,
                    categoryName: category.title,
                  })
                }
                className="h-11 rounded-lg bg-[#155EEF] px-6 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#1047BF] shadow-xs transition-all cursor-pointer"
              >
                <span>Request a Quote</span>
                <ArrowRight size={14} className="ml-1.5" />
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  openModal("engineer", { categoryName: category.title })
                }
                className="h-11 rounded-lg border-slate-300 bg-white px-5 text-xs font-bold uppercase tracking-wider text-slate-800 hover:border-[#155EEF] hover:text-[#155EEF] hover:bg-blue-50/50 shadow-2xs transition-all cursor-pointer"
              >
                <Wrench size={14} className="mr-1.5 text-slate-600" />
                <span>Talk to an Engineer</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleWhatsApp}
                className="h-11 rounded-lg border-slate-200 bg-white px-4 text-xs font-bold uppercase tracking-wider text-[#16A34A] hover:border-[#16A34A] hover:bg-emerald-50/50 shadow-2xs transition-all cursor-pointer"
              >
                <MessageSquare size={14} className="mr-1.5" />
                <span>WhatsApp</span>
              </Button>
            </div>
          </div>

          {/* Right Column: Representative Component Photograph */}
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-50/80 border border-slate-100 flex items-center justify-center p-4">
                <ProductImage
                  src={imageUrl}
                  alt={`${category.title} industrial component`}
                  aspectRatioClass="aspect-[4/3]"
                  fitMode="contain"
                  priority={true}
                  className="size-full transition-transform duration-300 ease-out hover:scale-[1.03]"
                />
              </div>

              {/* Subtitle Caption Strip */}
              <div className="mt-3 flex items-center justify-between px-1 text-[11px] font-mono text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  <span>Verified Industrial Hardware</span>
                </span>
                <span className="text-[#155EEF] font-bold">
                  {standard.split(" ")[0]} Compliant
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
