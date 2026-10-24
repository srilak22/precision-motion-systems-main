import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Car,
  Cpu,
  Plane,
  HeartPulse,
  Warehouse,
  Factory,
  UtensilsCrossed,
  Zap,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Building2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { ALL_18_APPLICATIONS } from "@/data/applicationsUniverse";

interface IndustriesMegaMenuProps {
  onClose: () => void;
  onLinkClick: (title: string, href: string) => void;
  onQuoteClick: () => void;
}

// Icon mapping for top manufacturing sectors
const INDUSTRY_ICONS: Record<string, React.ReactNode> = {
  automotive: <Car size={18} />,
  electronics: <Cpu size={18} />,
  aerospace: <Plane size={18} />,
  medical: <HeartPulse size={18} />,
  warehousing: <Warehouse size={18} />,
  "metal-machining": <Factory size={18} />,
  "food-beverage": <UtensilsCrossed size={18} />,
  energy: <Zap size={18} />,
};

// 8 primary sectors from prompt specifications
const PRIMARY_SECTORS = [
  { id: "automotive", name: "Automotive & EV Manufacturing" },
  { id: "electronics", name: "Electronics & Semiconductors" },
  { id: "aerospace", name: "Aerospace & Defence" },
  { id: "medical", name: "Medical & Life Sciences" },
  { id: "warehousing", name: "Warehousing & Logistics" },
  { id: "metal-machining", name: "General Manufacturing" },
  { id: "food-beverage", name: "Food & Packaging Automation" },
  { id: "energy", name: "Energy & Utilities" },
];

export function IndustriesMegaMenu({
  onClose,
  onLinkClick,
  onQuoteClick,
}: IndustriesMegaMenuProps) {
  const [activeSectorId, setActiveSectorId] = useState<string>("automotive");

  const currentApp =
    ALL_18_APPLICATIONS.find(
      (app) => app.id === activeSectorId || app.slug.includes(activeSectorId)
    ) || ALL_18_APPLICATIONS[0];

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-[460px] max-h-[75vh]">
      {/* =========================================================================
          LEFT CATEGORY RAIL (260px - 280px)
         ========================================================================= */}
      <div className="w-full lg:w-[280px] shrink-0 border-b lg:border-b-0 lg:border-r border-[#E5EAF1] bg-[#FBFDFE] p-5 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-base font-bold text-[#172033] tracking-tight">
              Target Industries
            </h3>
            <p className="text-xs text-[#667085] mt-1 leading-relaxed">
              Industrial robotics &amp; motion systems engineered for mission-critical verticals.
            </p>
          </div>

          {/* Vertical Selectable Sectors */}
          <nav className="space-y-1" aria-label="Industries rail">
            {PRIMARY_SECTORS.map((sector) => {
              const isActive = sector.id === activeSectorId;
              const icon = INDUSTRY_ICONS[sector.id] || <Building2 size={18} />;

              return (
                <button
                  key={sector.id}
                  type="button"
                  onClick={() => setActiveSectorId(sector.id)}
                  onMouseEnter={() => setActiveSectorId(sector.id)}
                  className={`group w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-[13.5px] font-medium transition-all duration-150 cursor-pointer ${
                    isActive
                      ? "bg-[#EFF6FF] text-[#155EEF] font-semibold shadow-xs"
                      : "text-[#475467] hover:bg-[#F4F7FB] hover:text-[#172033]"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`shrink-0 transition-colors ${
                        isActive
                          ? "text-[#155EEF]"
                          : "text-[#667085] group-hover:text-[#172033]"
                      }`}
                    >
                      {icon}
                    </span>
                    <span className="truncate">{sector.name}</span>
                  </div>

                  <ChevronRight
                    size={15}
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

        {/* View All 18 Industries */}
        <div className="pt-4 mt-4 border-t border-[#E5EAF1]">
          <Link
            to="/applications"
            onClick={() => onLinkClick("All 18 Applications", "/applications")}
            className="flex items-center justify-between text-xs font-semibold text-[#155EEF] hover:text-[#1047BF] transition-colors group"
          >
            <span>Explore All 18 Verticals</span>
            <ArrowRight
              size={13}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </div>

      {/* =========================================================================
          RIGHT CONTEXTUAL SUBMENU PANEL
         ========================================================================= */}
      <div className="flex-1 p-6 lg:p-7 flex flex-col justify-between overflow-y-auto bg-white">
        <div>
          {/* Top Sector Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-[#E5EAF1]">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-bold text-[#172033] tracking-tight">
                  {currentApp.name}
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#EFF6FF] text-[#155EEF] border border-[#B2CCFF]">
                  <CheckCircle2 size={11} className="text-[#155EEF]" />
                  {currentApp.useCases?.length || 12} Verified Production Workflows
                </span>
              </div>
              <p className="text-xs text-[#667085] mt-1 max-w-2xl leading-relaxed">
                {currentApp.description}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                to={`/applications/${currentApp.slug || currentApp.id}` as any}
                onClick={() =>
                  onLinkClick(
                    `${currentApp.name} Overview`,
                    `/applications/${currentApp.slug || currentApp.id}`
                  )
                }
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#155EEF] hover:text-[#1047BF] transition-colors"
              >
                <span>Explore Sector</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Sector Details: 3 Column Engineering Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
            {/* Column 1: Core Automation Workflows */}
            <div className="rounded-xl border border-[#E5EAF1] bg-[#FFFFFF] p-4 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF]">
                  Production Workflows
                </span>
                <h4 className="text-sm font-bold text-[#172033] mt-1">
                  Primary Use Cases
                </h4>
                <p className="text-[12px] text-[#667085] mt-1.5 leading-relaxed">
                  Engineered cells addressing high takt rate and strict tolerances:
                </p>

                <div className="mt-3.5 pt-3 border-t border-[#F0F4F8] space-y-2">
                  {currentApp.useCases?.slice(0, 4).map((uc) => (
                    <div key={uc.id} className="text-[12px]">
                      <span className="font-semibold text-[#172033] block">
                        {uc.title}
                      </span>
                      <span className="text-[11px] text-[#667085] line-clamp-1">
                        {uc.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Column 2: Recommended Technologies */}
            <div className="rounded-xl border border-[#E5EAF1] bg-[#FFFFFF] p-4 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0891B2]">
                  Recommended Hardware
                </span>
                <h4 className="text-sm font-bold text-[#172033] mt-1">
                  Motion &amp; Kinematic Stack
                </h4>
                <p className="text-[12px] text-[#667085] mt-1.5 leading-relaxed">
                  Pre-sized actuators and robotic manipulators for this domain:
                </p>

                <ul className="mt-3.5 pt-3 border-t border-[#F0F4F8] space-y-2 text-[12.5px] text-[#344054]">
                  {currentApp.technologies?.slice(0, 4).map((tech) => (
                    <li key={tech.name} className="flex items-start gap-2">
                      <span className="size-1.5 rounded-full bg-[#155EEF] mt-1.5 shrink-0" />
                      <div>
                        <span className="font-medium text-[#172033] block">
                          {tech.name}
                        </span>
                        <span className="text-[11px] text-[#667085]">
                          {tech.description}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Column 3: Performance Standards & Compliance */}
            <div className="rounded-xl border border-[#E5EAF1] bg-[#FFFFFF] p-4 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#16A34A]">
                  Verified Compliance
                </span>
                <h4 className="text-sm font-bold text-[#172033] mt-1">
                  Engineering Standards
                </h4>
                <p className="text-[12px] text-[#667085] mt-1.5 leading-relaxed">
                  Certifications and kinematic precision criteria:
                </p>

                <div className="mt-3.5 pt-3 border-t border-[#F0F4F8] space-y-2">
                  <div className="rounded-lg bg-[#F7F9FC] border border-[#E5EAF1] p-2.5">
                    <span className="text-[11px] font-bold text-[#172033] block">
                      DIN 3990 / ISO 9283
                    </span>
                    <span className="text-[11px] text-[#667085]">
                      Path repeatability verified under dynamic payload cycles
                    </span>
                  </div>
                  <div className="rounded-lg bg-[#F7F9FC] border border-[#E5EAF1] p-2.5">
                    <span className="text-[11px] font-bold text-[#172033] block">
                      ISO 13849-1 Category 4 PLe
                    </span>
                    <span className="text-[11px] text-[#667085]">
                      Dual-channel safety circuits with safe speed and torque stop
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-[#F0F4F8]">
                <Link
                  to={`/applications/${currentApp.slug || currentApp.id}` as any}
                  onClick={() =>
                    onLinkClick(
                      `${currentApp.name} Full Specification`,
                      `/applications/${currentApp.slug || currentApp.id}`
                    )
                  }
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#155EEF] hover:text-[#1047BF] transition-colors"
                >
                  <span>Explore Industry Workflows</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            BOTTOM CONVERSION BANNER
           ========================================================================= */}
        <div className="mt-6 rounded-xl border border-[#E5EAF1] bg-[#F8FAFC] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-full bg-[#EFF6FF] text-[#155EEF] grid place-items-center shrink-0 border border-[#D1E0FF]">
              <Sparkles size={16} />
            </div>
            <div>
              <h5 className="text-[13.5px] font-semibold text-[#172033]">
                Sector-specific automation requirements?
              </h5>
              <p className="text-[12px] text-[#667085]">
                Consult our manufacturing application engineers for cell integration and tooling sizing.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/book-consultation"
              onClick={() => onLinkClick("Book Consultation", "/book-consultation")}
              className="hidden md:inline-flex text-xs font-semibold text-[#475467] hover:text-[#172033] px-3 py-2 rounded-lg border border-[#D0D5DD] bg-white hover:bg-[#F9FAFB] transition-colors"
            >
              Book Sizing Review
            </Link>
            <button
              type="button"
              onClick={onQuoteClick}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#155EEF] hover:bg-[#1047BF] text-white text-xs font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer"
            >
              <span>Talk to Engineering</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
