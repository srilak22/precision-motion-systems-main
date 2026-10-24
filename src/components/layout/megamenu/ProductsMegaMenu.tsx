import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Settings2,
  Gauge,
  Layers,
  Cpu,
  Bot,
  Compass,
  Sliders,
  Scan,
  Wrench,
  Boxes,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { TOP_LEVEL_CATEGORIES, TopLevelCategory } from "@/data/productTaxonomy";

interface ProductsMegaMenuProps {
  onClose: () => void;
  onLinkClick: (title: string, href: string) => void;
  onQuoteClick: () => void;
}

// 8 Master Categories strictly as specified in Prompt Section 4
const CATEGORY_DEFINITIONS = [
  { id: "motion-actuation", label: "Motion & Actuation", icon: <Settings2 size={17} /> },
  { id: "robotic-systems", label: "Robotics", icon: <Bot size={17} /> },
  { id: "mobility-systems", label: "Mobility & Autonomous Systems", icon: <Compass size={17} /> },
  { id: "control-systems", label: "Control Systems", icon: <Sliders size={17} /> },
  { id: "sensing-vision", label: "Sensing & Vision", icon: <Scan size={17} /> },
  { id: "tooling-effectors", label: "Tooling & End Effectors", icon: <Wrench size={17} /> },
  { id: "mechanical-components", label: "Mechanical Components", icon: <Boxes size={17} /> },
  { id: "safety-ai", label: "Safety & AI", icon: <ShieldCheck size={17} /> },
];

const FAMILY_ICONS: Record<number, React.ReactNode> = {
  0: <Settings2 size={15} />,
  1: <Gauge size={15} />,
  2: <Layers size={15} />,
  3: <Cpu size={15} />,
};

export function ProductsMegaMenu({
  onClose,
  onLinkClick,
  onQuoteClick,
}: ProductsMegaMenuProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string>("motion-actuation");

  const activeCategory: TopLevelCategory =
    TOP_LEVEL_CATEGORIES.find((cat) => cat.id === activeCategoryId) ||
    TOP_LEVEL_CATEGORIES[0];

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-[460px]">
      {/* =========================================================================
          LEFT CATEGORY RAIL (260px - 280px)
         ========================================================================= */}
      <div className="w-full lg:w-[270px] shrink-0 border-b lg:border-b-0 lg:border-r border-[#E5EAF1] bg-[#FBFDFE] p-4 lg:p-5 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="mb-3.5">
            <h3 className="text-[15px] font-bold text-[#172033] tracking-tight">
              Explore Products
            </h3>
            <p className="text-[11.5px] text-[#667085] mt-0.5 leading-relaxed">
              Precision components and integrated motion technologies.
            </p>
          </div>

          {/* Vertical Selectable Categories (Section 4) */}
          <nav className="space-y-0.5" aria-label="Product categories rail">
            {CATEGORY_DEFINITIONS.map((catDef) => {
              const isActive = catDef.id === activeCategoryId;

              return (
                <button
                  key={catDef.id}
                  type="button"
                  onClick={() => setActiveCategoryId(catDef.id)}
                  onMouseEnter={() => setActiveCategoryId(catDef.id)}
                  className={`group w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-[13px] font-medium transition-all duration-150 cursor-pointer ${
                    isActive
                      ? "bg-[#EFF6FF] text-[#155EEF] font-semibold shadow-xs"
                      : "text-[#475467] hover:bg-[#F4F7FB] hover:text-[#172033]"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`shrink-0 transition-colors ${
                        isActive
                          ? "text-[#155EEF]"
                          : "text-[#667085] group-hover:text-[#172033]"
                      }`}
                    >
                      {catDef.icon}
                    </span>
                    <span className="truncate">{catDef.label}</span>
                  </div>

                  <ChevronRight
                    size={14}
                    className={`shrink-0 transition-transform ${
                      isActive
                        ? "text-[#155EEF] translate-x-0.5"
                        : "text-[#98A2B3] group-hover:text-[#475467]"
                    }`}
                  />
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Link to Complete Catalogue */}
        <div className="pt-3 mt-3 border-t border-[#E5EAF1]">
          <Link
            to="/products"
            onClick={() => onLinkClick("All Products Catalogue", "/products")}
            className="flex items-center justify-between text-xs font-semibold text-[#155EEF] hover:text-[#1047BF] transition-colors group"
          >
            <span>View All Products</span>
            <ArrowRight
              size={12}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </div>

      {/* =========================================================================
          RIGHT CONTEXTUAL SUBMENU PANEL (Remaining Width)
         ========================================================================= */}
      <div className="flex-1 p-5 lg:p-6 flex flex-col justify-between bg-white overflow-y-auto max-h-[75vh]">
        <div>
          {/* Category Top Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3.5 mb-4 border-b border-[#E5EAF1]">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#172033] tracking-tight">
                  {activeCategory.title}
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-[#EFF6FF] text-[#155EEF] border border-[#B2CCFF]">
                  <CheckCircle2 size={11} className="text-[#155EEF]" />
                  {activeCategory.rangeCountBadge}
                </span>
              </div>
              <p className="text-xs text-[#667085] mt-0.5 max-w-2xl leading-relaxed">
                {activeCategory.subtitle || activeCategory.description}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="hidden xl:inline-block text-[10.5px] font-mono text-[#667085] bg-[#F7F9FC] px-2 py-0.5 rounded-md border border-[#E5EAF1]">
                {activeCategory.engineeringStandard}
              </span>
              <Link
                to={activeCategory.primaryRoute}
                onClick={() =>
                  onLinkClick(
                    `${activeCategory.title} Category Page`,
                    activeCategory.primaryRoute
                  )
                }
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#155EEF] hover:text-[#1047BF] transition-colors"
              >
                <span>Category Overview</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          {/* Product Families 2x2 Grid Layout (Prompt Section 4 & Reference Mockup) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 lg:gap-4">
            {activeCategory.groups.slice(0, 4).map((group, idx) => {
              const icon = FAMILY_ICONS[idx % 4] || <Settings2 size={15} />;

              return (
                <div
                  key={group.groupName}
                  className="rounded-xl border border-[#E5EAF1] bg-[#FFFFFF] hover:border-[#B2CCFF] hover:shadow-2xs transition-all duration-150 p-3.5 flex flex-col justify-between group/card"
                >
                  <div>
                    {/* Family Card Header */}
                    <div className="flex items-start gap-2.5">
                      <div className="size-7.5 rounded-lg bg-[#EFF6FF] text-[#155EEF] grid place-items-center shrink-0 border border-[#D1E0FF] group-hover/card:bg-[#155EEF] group-hover/card:text-white transition-colors">
                        {icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-[13.5px] font-bold text-[#172033] group-hover/card:text-[#155EEF] transition-colors truncate">
                          {group.groupName}
                        </h4>
                        <p className="text-[11.5px] text-[#667085] line-clamp-1 mt-0.5 leading-tight">
                          {group.technologyDescription}
                        </p>
                      </div>
                    </div>

                    {/* Compact Product SKUs / Range Links (Top 4 models) */}
                    <div className="mt-2.5 pt-2 border-t border-[#F0F4F8] space-y-1">
                      {group.items.slice(0, 4).map((item) => (
                        <Link
                          key={item.id}
                          to={item.href}
                          onClick={() => onLinkClick(item.name, item.href)}
                          className="flex items-center justify-between text-[12px] text-[#344054] hover:text-[#155EEF] hover:bg-[#F8FAFC] px-2 py-0.5 rounded transition-colors group/item"
                        >
                          <span className="truncate font-normal group-hover/item:font-medium">
                            {item.name}
                          </span>
                          <span className="text-[10px] font-mono text-[#667085] ml-2 shrink-0 group-hover/item:text-[#155EEF]">
                            {item.specHighlight.split("|")[0]?.trim()}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Family Link */}
                  <div className="mt-2.5 pt-2 border-t border-[#F0F4F8] flex items-center justify-between">
                    <Link
                      to={group.items[0]?.href || activeCategory.primaryRoute}
                      onClick={() =>
                        onLinkClick(
                          `${group.groupName} Family`,
                          group.items[0]?.href || activeCategory.primaryRoute
                        )
                      }
                      className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-[#155EEF] hover:text-[#1047BF] transition-colors"
                    >
                      <span>Explore family</span>
                      <ArrowRight size={11} className="group-hover/card:translate-x-1 transition-transform" />
                    </Link>

                    <span className="text-[10.5px] font-mono text-[#98A2B3]">
                      {group.items.length} Models
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            BOTTOM CONVERSION BANNER (Prompt Reference Mockup & Section 12)
           ========================================================================= */}
        <div className="mt-4 rounded-xl border border-[#E5EAF1] bg-[#F8FAFC] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-full bg-[#EFF6FF] text-[#155EEF] grid place-items-center shrink-0 border border-[#D1E0FF]">
              <Sparkles size={15} />
            </div>
            <div>
              <h5 className="text-[13px] font-semibold text-[#172033]">
                Need help selecting the right component?
              </h5>
              <p className="text-[11.5px] text-[#667085]">
                Get guidance from our engineering team for motion sizing and kinematic selection.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              to="/products"
              onClick={() => onLinkClick("All Products", "/products")}
              className="text-xs font-semibold text-[#155EEF] hover:text-[#1047BF] hover:underline px-2 transition-colors"
            >
              View All Products →
            </Link>
            <button
              type="button"
              onClick={onQuoteClick}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#155EEF] hover:bg-[#1047BF] text-white text-xs font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer"
            >
              <span>Talk to Engineering</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
