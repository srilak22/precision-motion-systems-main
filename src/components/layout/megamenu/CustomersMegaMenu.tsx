import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  ChevronRight,
  Compass,
  GraduationCap,
  Headphones,
  ShieldCheck,
  Wrench,
} from "lucide-react";

interface CustomersMegaMenuProps {
  onClose: () => void;
  onLinkClick: (title: string, href: string) => void;
  onQuoteClick: () => void;
}

interface CustomerSubItem {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ElementType<{ size?: number; className?: string }>;
}

interface CustomerCategoryConfig {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  isDirectArrow?: boolean;
  items: CustomerSubItem[];
}

const CUSTOMER_CATEGORIES: CustomerCategoryConfig[] = [
  {
    id: "customer-success",
    title: "Customer Success",
    subtitle: "Build long-term success with INDUS Robotics",
    href: "/customers/customer-success",
    items: [
      {
        id: "integration-services",
        title: "Integration Services",
        description:
          "Evaluate your facilities and implement a tailored solution",
        href: "/customers/customer-success#integration-services",
        icon: Wrench,
      },
      {
        id: "fleet-care",
        title: "INDUS Fleet Care",
        description:
          "Ensure long-term reliable service across your robot fleet",
        href: "/customers/customer-success#fleet-care",
        icon: ShieldCheck,
      },
      {
        id: "amc-support",
        title: "Annual Maintenance (AMC)",
        description:
          "Preventive inspections, spare parts, and guaranteed uptime SLAs",
        href: "/customers/customer-success#amc-support",
        icon: Award,
      },
    ],
  },
  {
    id: "support-training",
    title: "Support & Training",
    subtitle: "Empower your operators and maintenance engineers",
    href: "/customers/support-training",
    items: [
      {
        id: "operator-training",
        title: "Operator & Safety Training",
        description:
          "Hands-on cell programming, E-Stop drills, and ISO safety certification",
        href: "/customers/support-training#operator-training",
        icon: GraduationCap,
      },
      {
        id: "remote-support",
        title: "24/7 Remote Diagnostics",
        description:
          "Live telemetry triage, firmware updates, and rapid on-site dispatch",
        href: "/customers/support-training#remote-support",
        icon: Headphones,
      },
    ],
  },
  {
    id: "consulting",
    title: "Consulting",
    subtitle: "Validate cycle times and ROI before hardware deployment",
    href: "/customers/consulting",
    isDirectArrow: true,
    items: [
      {
        id: "floor-audit",
        title: "Floor Audit & Feasibility",
        description:
          "Analyze payloads, cycle times, and custom EOAT requirements",
        href: "/customers/consulting#floor-audit",
        icon: Compass,
      },
      {
        id: "digital-twin",
        title: "3D Simulation & Digital Twin",
        description:
          "Virtual cell commissioning and payback modeling before capex",
        href: "/customers/consulting#digital-twin",
        icon: ShieldCheck,
      },
    ],
  },
];

export function CustomersMegaMenu({ onLinkClick }: CustomersMegaMenuProps) {
  const [activeId, setActiveId] = useState<string>(CUSTOMER_CATEGORIES[0].id);

  const activeCategory =
    CUSTOMER_CATEGORIES.find((cat) => cat.id === activeId) ??
    CUSTOMER_CATEGORIES[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-[290px_1fr] bg-white min-h-[300px] selection:bg-[#155EEF] selection:text-white">
      {/* Left Column: Customer Success / Support & Training / Consulting + Case Studies */}
      <div className="flex flex-col justify-between p-6 border-b md:border-b-0 md:border-r border-slate-100 bg-white">
        <div className="space-y-1">
          {CUSTOMER_CATEGORIES.map((category) => {
            const isActive = category.id === activeCategory.id;
            return (
              <Link
                key={category.id}
                to={category.href as never}
                onMouseEnter={() => setActiveId(category.id)}
                onFocus={() => setActiveId(category.id)}
                onClick={() => onLinkClick(category.title, category.href)}
                className={`group flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-[14px] transition-colors ${
                  isActive
                    ? "text-slate-900 font-bold bg-slate-50"
                    : "text-slate-700 font-semibold hover:text-slate-900 hover:bg-slate-50/70"
                }`}
              >
                <span>{category.title}</span>
                {category.isDirectArrow ? (
                  <ArrowRight
                    size={16}
                    className={`shrink-0 transition-transform duration-150 ${
                      isActive
                        ? "text-slate-900 translate-x-0.5"
                        : "text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5"
                    }`}
                  />
                ) : (
                  <ChevronRight
                    size={16}
                    className={`shrink-0 transition-transform duration-150 ${
                      isActive
                        ? "text-slate-900 translate-x-0.5"
                        : "text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5"
                    }`}
                  />
                )}
              </Link>
            );
          })}
        </div>

        <div className="pt-5">
          <Link
            to="/customers/case-studies"
            onClick={() =>
              onLinkClick("Case Studies", "/customers/case-studies")
            }
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#38BDF8] text-[#0284C7] text-[13px] font-semibold hover:bg-[#F0F9FF] transition-colors group"
          >
            <span>Case Studies</span>
            <ArrowRight
              size={14}
              className="transition-transform duration-150 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>

      {/* Right Column: Active Category + Sub-items */}
      <div className="p-7 bg-[#F8FAFC]">
        <div className="pb-5 border-b border-slate-200/80">
          <h3 className="text-[15px] font-bold text-slate-900">
            {activeCategory.title}
          </h3>
          <p className="text-[13px] text-slate-500 mt-1">
            {activeCategory.subtitle}
          </p>
          <Link
            to={activeCategory.href as never}
            onClick={() =>
              onLinkClick(activeCategory.title, activeCategory.href)
            }
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#0284C7] hover:text-[#155EEF] mt-2.5 group transition-colors"
          >
            <span>Read More</span>
            <ArrowRight
              size={14}
              className="transition-transform duration-150 group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 pt-5">
          {activeCategory.items.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="flex flex-col items-start">
                <h4 className="flex items-center gap-2 text-[14px] font-bold text-slate-900">
                  <Icon size={15} className="text-slate-500 shrink-0" />
                  <span>{item.title}</span>
                </h4>
                <p className="text-[13px] text-slate-500 leading-relaxed mt-1">
                  {item.description}
                </p>
                <Link
                  to={item.href as never}
                  onClick={() => onLinkClick(item.title, item.href)}
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#0284C7] hover:text-[#155EEF] mt-2.5 group transition-colors"
                >
                  <span>Read More</span>
                  <ArrowRight
                    size={14}
                    className="transition-transform duration-150 group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CustomersMegaMenu;
