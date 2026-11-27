import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bot,
  Building2,
  ChevronRight,
  Compass,
  Cpu,
  Eye,
  Factory,
  Microscope,
  Navigation,
  Package,
  ShieldCheck,
  Sparkles,
  Sprout,
  Stethoscope,
  Tractor,
  Truck,
  UtensilsCrossed,
  Warehouse,
  Zap,
} from "lucide-react";

interface SolutionsMegaMenuProps {
  onClose: () => void;
  onLinkClick: (title: string, href: string) => void;
  onQuoteClick: () => void;
}

interface SolutionRobotItem {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ElementType<{ size?: number; className?: string }>;
}

interface SolutionCategoryConfig {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  icon: React.ElementType<{ size?: number; className?: string }>;
  robots: SolutionRobotItem[];
}

const SOLUTION_CATEGORIES: SolutionCategoryConfig[] = [
  {
    id: "manufacturing-automotive",
    title: "Manufacturing & Automotive",
    subtitle: "Automate heavy-duty welding, assembly, and precision packaging",
    href: "/solutions/manufacturing-automotive",
    icon: Factory,
    robots: [
      {
        id: "6-axis-articulated-robots",
        title: "6-Axis Articulated Robots",
        description: "Heavy-duty welding, painting, and material handling.",
        href: "/solutions/manufacturing-automotive#6-axis-articulated-robots",
        icon: Cpu,
      },
      {
        id: "collaborative-robots",
        title: "Collaborative Robots (Cobots)",
        description:
          "Safe, cage-free human-robot assembly, screwdriving, and CNC machine tending.",
        href: "/solutions/manufacturing-automotive#collaborative-robots",
        icon: Bot,
      },
      {
        id: "scara-delta-robots",
        title: "SCARA & Delta Robots",
        description:
          "High-speed pick-and-place sorting and precision electronics packaging.",
        href: "/solutions/manufacturing-automotive#scara-delta-robots",
        icon: Zap,
      },
    ],
  },
  {
    id: "warehousing-logistics",
    title: "Warehousing & Logistics",
    subtitle:
      "Accelerate fulfillment, palletizing, and autonomous material transport",
    href: "/solutions/warehousing-ecommerce-logistics",
    icon: Warehouse,
    robots: [
      {
        id: "autonomous-mobile-robots",
        title: "Autonomous Mobile Robots (AMRs)",
        description:
          'Smart, self-navigating carts for "goods-to-person" order picking.',
        href: "/solutions/warehousing-ecommerce-logistics#autonomous-mobile-robots",
        icon: Navigation,
      },
      {
        id: "autonomous-forklifts-agvs",
        title: "Autonomous Forklifts & AGVs",
        description:
          "Unmanned heavy pallet transport across warehouse floors.",
        href: "/solutions/warehousing-ecommerce-logistics#autonomous-forklifts-agvs",
        icon: Truck,
      },
      {
        id: "robotic-palletizers",
        title: "Robotic Palletizers",
        description:
          "Vision-guided arms for automated box stacking and unloading.",
        href: "/solutions/warehousing-ecommerce-logistics#robotic-palletizers",
        icon: Package,
      },
    ],
  },
  {
    id: "healthcare-pharmaceuticals",
    title: "Healthcare & Pharmaceuticals",
    subtitle:
      "Deliver sterile automation, lab precision, and autonomous hospital logistics",
    href: "/solutions/healthcare-pharmaceuticals",
    icon: Stethoscope,
    robots: [
      {
        id: "uvc-disinfection-robots",
        title: "UV-C Disinfection Robots",
        description:
          "Chemical-free, autonomous room sterilization for hospitals and labs.",
        href: "/solutions/healthcare-pharmaceuticals#uvc-disinfection-robots",
        icon: Sparkles,
      },
      {
        id: "hospital-delivery-bots",
        title: "Hospital Delivery Bots",
        description:
          "Secure, locked mobile couriers for medicines, lab samples, and supplies.",
        href: "/solutions/healthcare-pharmaceuticals#hospital-delivery-bots",
        icon: ShieldCheck,
      },
      {
        id: "lab-automation-arms",
        title: "Lab Automation Arms",
        description:
          "High-precision desktop arms for automated testing and sample sorting.",
        href: "/solutions/healthcare-pharmaceuticals#lab-automation-arms",
        icon: Microscope,
      },
    ],
  },
  {
    id: "agriculture-food-processing",
    title: "Agriculture & Food Processing",
    subtitle:
      "Scale precision farming, hygienic washdown handling, and smart harvesting",
    href: "/solutions/agriculture-food-processing",
    icon: Sprout,
    robots: [
      {
        id: "field-rovers-drones",
        title: "Field Rovers & Drones",
        description:
          "AI-guided precision spraying, weed removal, and crop monitoring.",
        href: "/solutions/agriculture-food-processing#field-rovers-drones",
        icon: Tractor,
      },
      {
        id: "washdown-food-cobots",
        title: "Washdown Food Cobots",
        description:
          "Waterproof, hygienic stainless-steel arms for food sorting and packaging.",
        href: "/solutions/agriculture-food-processing#washdown-food-cobots",
        icon: ShieldCheck,
      },
      {
        id: "harvesting-robots",
        title: "Harvesting Robots",
        description:
          "Vision-guided arms for picking delicate fruits and vegetables.",
        href: "/solutions/agriculture-food-processing#harvesting-robots",
        icon: Sprout,
      },
    ],
  },
  {
    id: "hospitality-retail-facility-management",
    title: "Hospitality, Retail & Facility Management",
    subtitle:
      "Automate commercial cleaning, guest delivery, and 24/7 facility patrol",
    href: "/solutions/hospitality-retail-facility-management",
    icon: Building2,
    robots: [
      {
        id: "autonomous-floor-scrubbers",
        title: "Autonomous Floor Scrubbers",
        description:
          "Self-navigating commercial cleaners for malls, airports, and offices.",
        href: "/solutions/hospitality-retail-facility-management#autonomous-floor-scrubbers",
        icon: Sparkles,
      },
      {
        id: "service-delivery-bots",
        title: "Service & Delivery Bots",
        description:
          "Tray-based food runners for restaurants and room-service bots for hotels.",
        href: "/solutions/hospitality-retail-facility-management#service-delivery-bots",
        icon: UtensilsCrossed,
      },
      {
        id: "inventory-security-patrol-bots",
        title: "Inventory & Security Patrol Bots",
        description:
          "Autonomous rovers for retail shelf scanning and 24/7 perimeter security.",
        href: "/solutions/hospitality-retail-facility-management#inventory-security-patrol-bots",
        icon: Eye,
      },
    ],
  },
];

export function SolutionsMegaMenu({ onLinkClick }: SolutionsMegaMenuProps) {
  const [activeId, setActiveId] = useState<string>(SOLUTION_CATEGORIES[0].id);

  const activeCategory =
    SOLUTION_CATEGORIES.find((cat) => cat.id === activeId) ??
    SOLUTION_CATEGORIES[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-[310px_1fr] bg-white min-h-[340px] selection:bg-[#155EEF] selection:text-white">
      {/* Left Column: Solution Categories with Monochrome Icons + Explore All */}
      <div className="flex flex-col justify-between p-6 border-b md:border-b-0 md:border-r border-slate-100 bg-white">
        <div className="space-y-1">
          {SOLUTION_CATEGORIES.map((category) => {
            const isActive = category.id === activeCategory.id;
            const CategoryIcon = category.icon;
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
                <span className="flex items-center gap-2.5 min-w-0">
                  <CategoryIcon
                    size={15}
                    className={`shrink-0 ${
                      isActive
                        ? "text-[#155EEF]"
                        : "text-slate-400 group-hover:text-slate-700"
                    }`}
                  />
                  <span className="leading-snug">{category.title}</span>
                </span>
                <ChevronRight
                  size={16}
                  className={`shrink-0 transition-transform duration-150 ${
                    isActive
                      ? "text-slate-900 translate-x-0.5"
                      : "text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5"
                  }`}
                />
              </Link>
            );
          })}
        </div>

        <div className="pt-5">
          <Link
            to="/solutions"
            onClick={() => onLinkClick("Explore All Solutions", "/solutions")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#38BDF8] text-[#0284C7] text-[13px] font-semibold hover:bg-[#F0F9FF] transition-colors group"
          >
            <span>Explore All Solutions</span>
            <ArrowRight
              size={14}
              className="transition-transform duration-150 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>

      {/* Right Column: Active Category Overview + 3 Robots + Robot Finder CTA Card */}
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
          {activeCategory.robots.map((robot) => {
            const RobotIcon = robot.icon;
            return (
              <div key={robot.id} className="flex flex-col items-start">
                <h4 className="flex items-center gap-2 text-[14px] font-bold text-slate-900">
                  <RobotIcon size={15} className="text-slate-500 shrink-0" />
                  <span>{robot.title}</span>
                </h4>
                <p className="text-[13px] text-slate-500 leading-relaxed mt-1">
                  {robot.description}
                </p>
                <Link
                  to={robot.href as never}
                  onClick={() => onLinkClick(robot.title, robot.href)}
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

          {/* Featured Quick CTA Card in the 4th Grid Slot */}
          <Link
            to="/application-finder"
            onClick={() =>
              onLinkClick("30-Second Robot Finder", "/application-finder")
            }
            className="group flex flex-col justify-between rounded-xl border border-blue-200/80 bg-white p-4 shadow-2xs hover:border-[#155EEF] hover:shadow-sm transition-all"
          >
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#155EEF]">
                <Compass size={13} />
                <span>Guided Selector</span>
              </div>
              <h4 className="text-[13px] font-bold text-slate-900">
                Not sure which robot fits?
              </h4>
              <p className="text-[12px] text-slate-500 leading-snug">
                Match your payload, environment, and ROI target in seconds.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#155EEF] mt-3">
              <span>Take the 30-second Robot Finder</span>
              <ArrowRight
                size={13}
                className="transition-transform duration-150 group-hover:translate-x-0.5"
              />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SolutionsMegaMenu;
