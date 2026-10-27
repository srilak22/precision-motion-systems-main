import React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ProductImage } from "./ProductImage";
import { getProductImageUrl } from "@/lib/images";
import type { TopLevelCategory } from "@/data/productTaxonomy";

export interface CategoryCardProps {
  category: TopLevelCategory;
  index?: number;
  className?: string;
}

// Concise 12-16 word engineering summaries tailored for clear industrial scanning
const CATEGORY_EDITORIAL_DESCRIPTIONS: Record<string, string> = {
  "motion-actuation":
    "Zero-backlash harmonic gearheads, planetary reducers, and high-torque servomotors engineered for precision industrial axes.",
  "robotic-systems":
    "Articulated 6-axis robot arms, collaborative cobots, and high-speed SCARA manipulators for automated assembly cells.",
  "mobility-systems":
    "In-hub brushless AGV drive units, omnidirectional Mecanum wheels, and autonomous heavy-payload mobile chassis platforms.",
  "control-drives":
    "Multi-axis real-time motion controllers, deterministic EtherCAT servo drives, and industrial PLC automation systems.",
  "sensing-vision":
    "High-resolution optical encoders, 6-axis force-torque sensors, and machine vision systems for precise robotic guidance.",
  "end-effectors":
    "Programmable electric parallel grippers, vacuum tool arrays, and automatic quick-change robotic wrist tooling.",
  "mechanical-components":
    "Precision ground linear guideways, ballscrew drive assemblies, and cross-roller bearings for rigid machine builds.",
  "safety-intelligent":
    "Certified safety laser scanners, protective light curtains, and edge intelligence gateways for industrial automation safety.",
};

export function CategoryCard({
  category,
  index = 0,
  className = "",
}: CategoryCardProps) {
  const imageUrl = getProductImageUrl(category.id);
  const description =
    CATEGORY_EDITORIAL_DESCRIPTIONS[category.id] ||
    category.subtitle ||
    category.description;

  return (
    <Link
      to={category.primaryRoute as never}
      className={`group relative flex h-full flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all duration-200 ease-out hover:-translate-y-1 hover:border-[#155EEF]/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF] ${className}`}
      aria-label={`Explore ${category.title} Category`}
    >
      <div>
        {/* 1. Visual Stage: Representative Product Photograph */}
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-slate-50/80 border border-slate-100 flex items-center justify-center p-3">
          <ProductImage
            src={imageUrl}
            alt={category.title}
            fitMode="contain"
            className="size-full transition-transform duration-200 ease-out group-hover:scale-[1.02]"
          />
        </div>

        {/* 2. Category Title */}
        <h3 className="mt-4 font-display text-base xl:text-lg font-bold text-slate-900 group-hover:text-[#155EEF] transition-colors leading-snug">
          {category.title}
        </h3>

        {/* 3. Short Engineering Description */}
        <p className="mt-2 text-xs leading-relaxed text-slate-600 line-clamp-2">
          {description}
        </p>
      </div>

      {/* 4. One Primary Action: Simple Text Link */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#155EEF] group-hover:text-[#1047BF] transition-colors">
          <span>Explore category</span>
          <ArrowRight
            size={13}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </span>
      </div>
    </Link>
  );
}
