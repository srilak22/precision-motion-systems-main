import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  FileText,
  BookOpen,
  HelpCircle,
  FileCheck,
  Compass,
  Download,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  MessageSquare,
} from "lucide-react";

interface ResourcesMegaMenuProps {
  onClose: () => void;
  onLinkClick: (title: string, href: string) => void;
  onQuoteClick: () => void;
}

const RESOURCE_CATEGORIES = [
  { id: "docs", title: "Technical Documentation", icon: <FileText size={18} /> },
  { id: "catalogues", title: "Product Catalogues & Datasheets", icon: <Download size={18} /> },
  { id: "intelligence", title: "Engineering Intelligence Articles", icon: <BookOpen size={18} /> },
  { id: "faqs", title: "FAQs & Technical Support", icon: <HelpCircle size={18} /> },
  { id: "compliance", title: "Standards & Compliance Guides", icon: <FileCheck size={18} /> },
];

export function ResourcesMegaMenu({
  onClose,
  onLinkClick,
  onQuoteClick,
}: ResourcesMegaMenuProps) {
  const [activeTab, setActiveTab] = useState<string>("docs");

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
              Knowledge &amp; Resources
            </h3>
            <p className="text-xs text-[#667085] mt-1 leading-relaxed">
              Technical documentation, application papers, and engineering guides.
            </p>
          </div>

          {/* Vertical Selectable Tabs */}
          <nav className="space-y-1" aria-label="Resources rail">
            {RESOURCE_CATEGORIES.map((item) => {
              const isActive = item.id === activeTab;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  onMouseEnter={() => setActiveTab(item.id)}
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
                      {item.icon}
                    </span>
                    <span className="truncate">{item.title}</span>
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

        {/* View All Resources Link */}
        <div className="pt-4 mt-4 border-t border-[#E5EAF1]">
          <Link
            to="/resources"
            onClick={() => onLinkClick("Resources Hub", "/resources")}
            className="flex items-center justify-between text-xs font-semibold text-[#155EEF] hover:text-[#1047BF] transition-colors group"
          >
            <span>Explore Complete Hub</span>
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
          {/* Top Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-[#E5EAF1]">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-bold text-[#172033] tracking-tight">
                  Technical Documentation &amp; Knowledge Base
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#EFF6FF] text-[#155EEF] border border-[#B2CCFF]">
                  <CheckCircle2 size={11} className="text-[#155EEF]" />
                  Verified Engineering Standards
                </span>
              </div>
              <p className="text-xs text-[#667085] mt-1 max-w-2xl leading-relaxed">
                Access product datasheets, installation manuals, kinematics guides, and technical FAQs.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                to="/resources"
                onClick={() => onLinkClick("Full Resources", "/resources")}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#155EEF] hover:text-[#1047BF] transition-colors"
              >
                <span>All Documents</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Resources Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Card 1: Engineering Intelligence Articles */}
            <Link
              to="/engineering-intelligence"
              onClick={() => onLinkClick("Engineering Intelligence", "/engineering-intelligence")}
              className="group rounded-xl border border-[#E5EAF1] bg-[#FFFFFF] hover:border-[#B2CCFF] hover:shadow-xs p-4 flex flex-col justify-between transition-all"
            >
              <div>
                <div className="size-8 rounded-lg bg-[#EFF6FF] text-[#155EEF] grid place-items-center group-hover:bg-[#155EEF] group-hover:text-white transition-colors">
                  <BookOpen size={16} />
                </div>
                <h4 className="text-sm font-bold text-[#172033] group-hover:text-[#155EEF] transition-colors mt-3">
                  Engineering Intelligence Hub
                </h4>
                <p className="text-[12px] text-[#667085] mt-1 leading-relaxed">
                  Deep-dive technical whitepapers on harmonic gear flexspline life, cycloidal pin load sharing, and thermal dynamics.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-[#F0F4F8] flex items-center justify-between text-xs font-semibold text-[#155EEF]">
                <span>Browse Articles</span>
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 2: Technical FAQs */}
            <Link
              to="/resources/faqs"
              onClick={() => onLinkClick("FAQs", "/resources/faqs")}
              className="group rounded-xl border border-[#E5EAF1] bg-[#FFFFFF] hover:border-[#B2CCFF] hover:shadow-xs p-4 flex flex-col justify-between transition-all"
            >
              <div>
                <div className="size-8 rounded-lg bg-[#EFF6FF] text-[#155EEF] grid place-items-center group-hover:bg-[#155EEF] group-hover:text-white transition-colors">
                  <HelpCircle size={16} />
                </div>
                <h4 className="text-sm font-bold text-[#172033] group-hover:text-[#155EEF] transition-colors mt-3">
                  Technical FAQs &amp; Support
                </h4>
                <p className="text-[12px] text-[#667085] mt-1 leading-relaxed">
                  Answers to installation clearances, oil/grease lubrication maintenance, bus protocol timings, and encoder calibration.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-[#F0F4F8] flex items-center justify-between text-xs font-semibold text-[#155EEF]">
                <span>View FAQs</span>
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 3: Datasheets & CAD Drawings */}
            <Link
              to="/resources"
              onClick={() => onLinkClick("Datasheets Hub", "/resources")}
              className="group rounded-xl border border-[#E5EAF1] bg-[#FFFFFF] hover:border-[#B2CCFF] hover:shadow-xs p-4 flex flex-col justify-between transition-all"
            >
              <div>
                <div className="size-8 rounded-lg bg-[#EFF6FF] text-[#155EEF] grid place-items-center group-hover:bg-[#155EEF] group-hover:text-white transition-colors">
                  <Download size={16} />
                </div>
                <h4 className="text-sm font-bold text-[#172033] group-hover:text-[#155EEF] transition-colors mt-3">
                  Product Catalogues &amp; Spec Sheets
                </h4>
                <p className="text-[12px] text-[#667085] mt-1 leading-relaxed">
                  Verified mechanical dimension prints, reduction ratio tables, and motor mounting interface specs.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-[#F0F4F8] flex items-center justify-between text-xs font-semibold text-[#155EEF]">
                <span>Download Spec Sheets</span>
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
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
                Can't find the documentation or 3D STEP model you need?
              </h5>
              <p className="text-[12px] text-[#667085]">
                Contact our engineering support desk directly for application drawings and compliance certificates.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/contact"
              onClick={() => onLinkClick("Contact Us", "/contact")}
              className="hidden md:inline-flex text-xs font-semibold text-[#475467] hover:text-[#172033] px-3 py-2 rounded-lg border border-[#D0D5DD] bg-white hover:bg-[#F9FAFB] transition-colors"
            >
              Contact Support Desk
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
