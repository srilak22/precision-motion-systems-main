import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Building2,
  ShieldCheck,
  Users,
  Phone,
  MessageSquare,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Sparkles,
  MapPin,
  Clock,
} from "lucide-react";
import { companyConfig } from "@/data/config";

interface CompanyMegaMenuProps {
  onClose: () => void;
  onLinkClick: (title: string, href: string) => void;
  onQuoteClick: () => void;
}

const COMPANY_CATEGORIES = [
  { id: "overview", title: "About INDUS", icon: <Building2 size={18} /> },
  { id: "quality", title: "Quality & Certifications", icon: <ShieldCheck size={18} /> },
  { id: "careers", title: "Careers & Culture", icon: <Users size={18} /> },
  { id: "contact", title: "Contact & Support Desk", icon: <Phone size={18} /> },
];

export function CompanyMegaMenu({
  onClose,
  onLinkClick,
  onQuoteClick,
}: CompanyMegaMenuProps) {
  const [activeTab, setActiveTab] = useState<string>("overview");

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
              Company &amp; Operations
            </h3>
            <p className="text-xs text-[#667085] mt-1 leading-relaxed">
              Industrial robotics &amp; precision motion manufacturing founded on global engineering standards.
            </p>
          </div>

          {/* Vertical Selectable Tabs */}
          <nav className="space-y-1" aria-label="Company rail">
            {COMPANY_CATEGORIES.map((item) => {
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

        {/* View About Page */}
        <div className="pt-4 mt-4 border-t border-[#E5EAF1]">
          <Link
            to="/about"
            onClick={() => onLinkClick("About INDUS", "/about")}
            className="flex items-center justify-between text-xs font-semibold text-[#155EEF] hover:text-[#1047BF] transition-colors group"
          >
            <span>Read Company Profile</span>
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
                  About INDUS Industrial Robotics
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#EFF6FF] text-[#155EEF] border border-[#B2CCFF]">
                  <CheckCircle2 size={11} className="text-[#155EEF]" />
                  ISO 9001:2015 Manufacturing Quality
                </span>
              </div>
              <p className="text-xs text-[#667085] mt-1 max-w-2xl leading-relaxed">
                Pioneering high-precision mechatronic reducers, articulated manipulators, and automated cell integration.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                to="/about"
                onClick={() => onLinkClick("About INDUS", "/about")}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#155EEF] hover:text-[#1047BF] transition-colors"
              >
                <span>Company Overview</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Corporate Columns / Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
            {/* Card 1: Our Engineering Approach & Quality */}
            <div className="rounded-xl border border-[#E5EAF1] bg-[#FFFFFF] p-4 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF]">
                  Engineering Quality
                </span>
                <h4 className="text-sm font-bold text-[#172033] mt-1">
                  Standards &amp; Verification
                </h4>
                <p className="text-[12px] text-[#667085] mt-1.5 leading-relaxed">
                  Every strain-wave flexspline, cycloidal pin-wheel, and planetary stage is metrologically inspected under ISO 9283 kinematics.
                </p>

                <div className="mt-3.5 pt-3 border-t border-[#F0F4F8] space-y-2 text-[12px]">
                  <div className="flex items-center gap-2 text-[#344054]">
                    <ShieldCheck size={14} className="text-[#16A34A] shrink-0" />
                    <span>ISO 9001:2015 Certified Assembly</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#344054]">
                    <CheckCircle2 size={14} className="text-[#155EEF] shrink-0" />
                    <span>DIN 3990 Gear Tooth Contact Analysis</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#344054]">
                    <CheckCircle2 size={14} className="text-[#155EEF] shrink-0" />
                    <span>Sub-0.5 arcmin Backlash Guarantee</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-[#F0F4F8]">
                <Link
                  to="/about"
                  onClick={() => onLinkClick("Engineering Philosophy", "/about")}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#155EEF] hover:text-[#1047BF] transition-colors"
                >
                  <span>Our Engineering Approach</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>

            {/* Card 2: Careers & Engineering Culture */}
            <div className="rounded-xl border border-[#E5EAF1] bg-[#FFFFFF] p-4 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0891B2]">
                  Join Our Team
                </span>
                <h4 className="text-sm font-bold text-[#172033] mt-1">
                  Careers &amp; Engineering Culture
                </h4>
                <p className="text-[12px] text-[#667085] mt-1.5 leading-relaxed">
                  We are hiring kinematics specialists, servo drive firmware engineers, and robotics integration architects.
                </p>

                <div className="mt-3.5 pt-3 border-t border-[#F0F4F8] space-y-2 text-[12px]">
                  <div className="rounded-lg bg-[#F7F9FC] border border-[#E5EAF1] p-2.5">
                    <span className="font-semibold text-[#172033] block">
                      Senior Motion Control Engineer
                    </span>
                    <span className="text-[11px] text-[#667085]">
                      EtherCAT firmware &amp; deterministic servo loops
                    </span>
                  </div>
                  <div className="rounded-lg bg-[#F7F9FC] border border-[#E5EAF1] p-2.5">
                    <span className="font-semibold text-[#172033] block">
                      Robotics Applications Specialist
                    </span>
                    <span className="text-[11px] text-[#667085]">
                      Industrial workcell design &amp; end-effector sizing
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-[#F0F4F8]">
                <Link
                  to="/careers"
                  onClick={() => onLinkClick("Careers Page", "/careers")}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#155EEF] hover:text-[#1047BF] transition-colors"
                >
                  <span>View Open Positions</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>

            {/* Card 3: Direct Engineering Desk & Connect */}
            <div className="rounded-xl border border-[#E5EAF1] bg-[#FFFFFF] p-4 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF]">
                  Direct Support
                </span>
                <h4 className="text-sm font-bold text-[#172033] mt-1">
                  Connect &amp; Consultation
                </h4>
                <p className="text-[12px] text-[#667085] mt-1.5 leading-relaxed">
                  Direct channels to our mechatronic application specialists and project estimators:
                </p>

                <div className="mt-3.5 pt-3 border-t border-[#F0F4F8] space-y-2.5 text-[12px]">
                  <div className="flex items-center gap-2 text-[#344054]">
                    <Phone size={14} className="text-[#155EEF] shrink-0" />
                    <span>Direct: <strong className="text-[#172033]">+91 94440 24848</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-[#344054]">
                    <MessageSquare size={14} className="text-[#16A34A] shrink-0" />
                    <span>WhatsApp Engineering Support Active</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#344054]">
                    <Clock size={14} className="text-[#667085] shrink-0" />
                    <span>Mon–Sat: 08:30 – 18:30 IST</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#344054]">
                    <MapPin size={14} className="text-[#667085] shrink-0" />
                    <span>Chennai Manufacturing Facility, India</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-[#F0F4F8]">
                <Link
                  to="/contact"
                  onClick={() => onLinkClick("Contact Us", "/contact")}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#155EEF] hover:text-[#1047BF] transition-colors"
                >
                  <span>Contact Global Support</span>
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
                Ready to evaluate INDUS for your next machine generation?
              </h5>
              <p className="text-[12px] text-[#667085]">
                Book a formal engineering review or request a fast-turnaround quote from our sales desk.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/book-consultation"
              onClick={() => onLinkClick("Book Consultation", "/book-consultation")}
              className="hidden md:inline-flex text-xs font-semibold text-[#475467] hover:text-[#172033] px-3 py-2 rounded-lg border border-[#D0D5DD] bg-white hover:bg-[#F9FAFB] transition-colors"
            >
              <Calendar size={13} className="mr-1.5" />
              Book Consultation
            </Link>
            <button
              type="button"
              onClick={onQuoteClick}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#155EEF] hover:bg-[#1047BF] text-white text-xs font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer"
            >
              <span>Get a Quote</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
