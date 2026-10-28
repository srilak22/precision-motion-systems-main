import React from "react";
import { Link } from "@tanstack/react-router";
import {
  Settings2,
  Bot,
  Compass,
  Cpu,
  Gauge,
  Wrench,
  Sliders,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { getProductImageUrl } from "@/lib/images";

interface ProductsMegaMenuProps {
  onClose: () => void;
  onLinkClick: (title: string, href: string) => void;
  onQuoteClick: () => void;
}

interface ProductCategoryEntry {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ElementType<{ size?: number; className?: string }>;
}

const PRODUCT_CATEGORIES: ProductCategoryEntry[] = [
  {
    id: "motion-actuation",
    title: "Motion & Actuation",
    description: "Precision reducers, servo motors & joint modules",
    href: "/products/motion-actuation",
    icon: Settings2,
  },
  {
    id: "robotic-systems",
    title: "Robotic Systems",
    description: "6-axis articulated arms, cobots & assembly cells",
    href: "/products/robotic-systems",
    icon: Bot,
  },
  {
    id: "mobility-systems",
    title: "Mobility Systems",
    description: "In-hub AGV drive wheels & Mecanum chassis",
    href: "/products/mobility-systems",
    icon: Compass,
  },
  {
    id: "control-drives",
    title: "Control & Drives",
    description: "Motion controllers & EtherCAT servo drives",
    href: "/products/control-drives",
    icon: Cpu,
  },
  {
    id: "sensing-vision",
    title: "Sensing & Vision",
    description: "Optical encoders, 6-axis F/T sensors & vision",
    href: "/products/sensing-vision",
    icon: Gauge,
  },
  {
    id: "end-effectors",
    title: "End Effectors & Tooling",
    description: "Electric grippers, vacuum arrays & tool changers",
    href: "/products/end-effectors",
    icon: Wrench,
  },
  {
    id: "mechanical-components",
    title: "Mechanical Components",
    description: "Linear guideways, ballscrews & bearings",
    href: "/products/mechanical-components",
    icon: Sliders,
  },
  {
    id: "safety-intelligent",
    title: "Safety & Intelligent Systems",
    description: "Safety laser scanners, light curtains & edge AI",
    href: "/products/safety-intelligent",
    icon: ShieldCheck,
  },
];

export function ProductsMegaMenu({
  onClose,
  onLinkClick,
  onQuoteClick,
}: ProductsMegaMenuProps) {
  return (
    <div className="p-6 bg-white">
      {/* Header section */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF]">
            Product Catalogue
          </span>
          <h3 className="text-base font-bold text-slate-900 mt-0.5">
            Precision Motion &amp; Automation Components
          </h3>
        </div>
        <Link
          to="/products"
          onClick={() => onLinkClick("All Products", "/products")}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#155EEF] hover:text-[#1047BF] transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF] rounded px-2 py-1"
        >
          <span>View All Products</span>
          <ArrowRight
            size={13}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>
      </div>

      {/* 8 Categories in a clean, compact 2-column or 4-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-4">
        {PRODUCT_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const imageUrl = getProductImageUrl(cat.id);

          return (
            <Link
              key={cat.id}
              to={cat.href as never}
              onClick={() => onLinkClick(cat.title, cat.href)}
              className="group flex items-start gap-3 p-3 rounded-xl border border-slate-100 bg-white hover:border-[#155EEF]/40 hover:bg-[#F8FAFC] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF]"
            >
              {/* Subtle Thumbnail / Icon Stage */}
              <div className="size-11 rounded-lg bg-slate-50 border border-slate-200/80 overflow-hidden shrink-0 flex items-center justify-center p-1 group-hover:border-[#155EEF]/30 transition-colors">
                <img
                  src={imageUrl}
                  alt={cat.title}
                  className="size-full object-contain transition-transform duration-200 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Text content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#155EEF] transition-colors truncate">
                    {cat.title}
                  </h4>
                  <ArrowRight
                    size={11}
                    className="text-slate-300 group-hover:text-[#155EEF] shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </div>
                <p className="text-[11px] text-slate-500 leading-tight mt-1 line-clamp-2">
                  {cat.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Footer bar */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="font-mono text-[11px]">
          ISO 9001:2015 Verified • DIN 3990 &amp; ISO 9283 Standards
        </span>
        <div className="flex items-center gap-4">
          <Link
            to="/technology/calculators"
            onClick={() => onLinkClick("Calculators", "/technology/calculators")}
            className="text-slate-600 hover:text-[#155EEF] font-medium transition-colors"
          >
            Kinematic Sizing Tools →
          </Link>
          <button
            type="button"
            onClick={onQuoteClick}
            className="text-[#155EEF] hover:text-[#1047BF] font-bold cursor-pointer transition-colors"
          >
            Request Quotation
          </button>
        </div>
      </div>
    </div>
  );
}
