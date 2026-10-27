import React from "react";
import { Link } from "@tanstack/react-router";
import {
  Settings2,
  Sliders,
  Bot,
  Sparkles,
  Zap,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Search,
  Calculator,
  GitCompare,
  Activity,
  Layers,
  ShieldCheck,
  Cpu,
  Move3d,
  Factory,
  Radio,
  Eye,
  Wrench,
  Boxes,
} from "lucide-react";
import { images } from "@/lib/images";
import { useModals } from "@/components/modals/ModalContext";

interface ProductsMegaMenuProps {
  onClose: () => void;
  onLinkClick: (title: string, href: string) => void;
  onQuoteClick: () => void;
}

interface MenuItemData {
  title: string;
  subtitle: string;
  badge?: string;
  href: string;
  isSpecialRoute?: boolean;
}

// COLUMN A: PRECISION MOTION COMPONENTS
const COLUMN_A_ITEMS: MenuItemData[] = [
  {
    title: "Precision Reducers",
    subtitle: "Harmonic, RV cycloidal & planetary gearheads",
    badge: "<0.5 arcmin",
    href: "/products/precision-reducers",
  },
  {
    title: "Robotic Joints",
    subtitle: "Smart hollow-shaft joint modules with 48V vector drive",
    badge: "Studio",
    href: "/technology/intelligent-actuators",
    isSpecialRoute: true,
  },
  {
    title: "Actuators",
    subtitle: "Electric linear cylinders & high-torque rotary actuators",
    badge: "650–3800 N",
    href: "/products/actuators",
  },
  {
    title: "Motors and Drives",
    subtitle: "Brushless AC servomotors, frameless kits & inverters",
    badge: "24-bit",
    href: "/products/servo-motors",
  },
  {
    title: "Bearings and Transmission Components",
    subtitle: "Crossed roller bearings, flexible couplings & holding brakes",
    badge: "DIN/ISO",
    href: "/products/mechanical-transmission",
  },
  {
    title: "Linear Motion Systems",
    subtitle: "Profile rail guides, ground ball screws & linear stages",
    badge: "Class C3/C5",
    href: "/products/linear-motion",
  },
];

// COLUMN B: ROBOTICS AND CONTROL
const COLUMN_B_ITEMS: MenuItemData[] = [
  {
    title: "Robot Controllers",
    subtitle: "Multi-axis trajectory cores & teach pendant hardware",
    badge: "CNC Core",
    href: "/products/robot-controllers",
  },
  {
    title: "Motion Controllers",
    subtitle: "Real-time EtherCAT & CANopen fieldbus masters",
    badge: "125 µs Sync",
    href: "/products/control-systems",
  },
  {
    title: "Sensors",
    subtitle: "24-bit optical absolute encoders & 6-DoF F/T sensors",
    badge: "BiSS-C / SSI",
    href: "/products/sensors-encoders",
  },
  {
    title: "Machine Vision",
    subtitle: "3D laser profilers & structured light metrology cameras",
    badge: "3D Laser",
    href: "/products/machine-vision",
  },
  {
    title: "End Effectors",
    subtitle: "Electric parallel grippers & vacuum suction matrix arrays",
    badge: "ISO 9409-1",
    href: "/products/end-effectors",
  },
  {
    title: "Safety Components",
    subtitle: "Safety laser scanners, light curtains & ISO 13849 PL e relays",
    badge: "SIL 3 / PL e",
    href: "/products/robotics-safety",
  },
];

// COLUMN C: ROBOTIC SYSTEMS
const COLUMN_C_ITEMS: MenuItemData[] = [
  {
    title: "Industrial Robot Arms",
    subtitle: "6-Axis articulated arms (7 kg – 50 kg payload capacity)",
    badge: "±0.03 mm",
    href: "/products/robotic-arms",
  },
  {
    title: "Collaborative Robots",
    subtitle: "Power & force limited cobots with joint torque sensing",
    badge: "Cobot",
    href: "/products/robotic-arms",
  },
  {
    title: "Mobile Robots",
    subtitle: "AGV/AMR differential & omnidirectional Mecanum drive units",
    badge: "1200 kg",
    href: "/products/robotic-wheels",
  },
  {
    title: "Integrated Robot Modules",
    subtitle: "Multi-axis pre-configured actuators & 7th axis transfer slides",
    badge: "Modular",
    href: "/technology/intelligent-actuators",
    isSpecialRoute: true,
  },
  {
    title: "Robotic Cells",
    subtitle: "Standardized machine tending, welding & palletizing stations",
    badge: "Turnkey",
    href: "/solutions",
    isSpecialRoute: true,
  },
  {
    title: "Accessories",
    subtitle: "Industrial Ethernet switches, edge AI gateways & flex cabling",
    badge: "Fieldbus",
    href: "/products/networking-edge",
  },
];

export function ProductsMegaMenu({
  onClose,
  onLinkClick,
  onQuoteClick,
}: ProductsMegaMenuProps) {
  const { openModal } = useModals();

  const handleSearchClick = () => {
    onClose();
    openModal("search");
  };

  return (
    <div className="w-full bg-[#FFFFFF] p-6 lg:p-7 flex flex-col justify-between max-h-[82vh] overflow-y-auto">
      {/* 1. TOP HEADER & DISCOVERY STRIP */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-[#E5EAF1]">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold text-[#172033] tracking-tight">
              Industrial Robotics &amp; Motion Portfolio
            </h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#EFF6FF] text-[#155EEF] border border-[#B2CCFF]">
              <CheckCircle2 size={11} className="text-[#155EEF]" />
              12 Master Lines · 244 Verified Ranges
            </span>
          </div>
          <p className="text-xs text-[#667085] mt-1">
            Engineered mechatronic components adhering to ISO 9283, DIN 3990, and IEC 61800 standards.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {/* Quick Search Entry Point */}
          <button
            type="button"
            onClick={handleSearchClick}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#E5EAF1] bg-[#F8FAFC] hover:bg-[#EFF6FF] hover:border-[#B2CCFF] text-xs font-semibold text-[#475467] hover:text-[#155EEF] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF]"
            aria-label="Open search modal"
          >
            <Search size={13} className="text-[#155EEF]" />
            <span>Search Catalogue</span>
            <kbd className="rounded bg-white px-1.5 py-0.5 text-[9px] font-mono font-bold text-[#667085] border border-[#E5EAF1]">
              ⌘K
            </kbd>
          </button>

          {/* View All Products Button */}
          <Link
            to="/products"
            onClick={() => onLinkClick("All Products Catalogue", "/products")}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#155EEF] hover:bg-[#1047BF] text-white text-xs font-bold shadow-2xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF]"
          >
            <span>View All Products</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* 2. 4-COLUMN CONTENT GRID (3 CATEGORY COLUMNS + 1 FEATURED PANEL) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* COLUMN A: PRECISION MOTION COMPONENTS */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-1.5 border-b border-[#E5EAF1]">
            <Settings2 size={16} className="text-[#155EEF]" />
            <div>
              <h3 className="text-[13px] font-bold uppercase tracking-wider text-[#172033]">
                Precision Motion Components
              </h3>
            </div>
          </div>

          <div className="space-y-1">
            {COLUMN_A_ITEMS.map((item) => (
              <Link
                key={item.title}
                to={item.href as never}
                onClick={() => onLinkClick(item.title, item.href)}
                className="group flex flex-col p-2 rounded-lg hover:bg-[#F8FAFC] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF]"
              >
                <div className="flex items-center justify-between text-xs font-bold text-[#172033] group-hover:text-[#155EEF]">
                  <span>{item.title}</span>
                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span className="text-[9.5px] font-mono text-[#667085] bg-[#F2F4F7] group-hover:bg-[#EFF6FF] group-hover:text-[#155EEF] px-1.5 py-0.2 rounded transition-colors">
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight
                      size={12}
                      className="text-[#98A2B3] group-hover:text-[#155EEF] group-hover:translate-x-0.5 transition-all"
                    />
                  </div>
                </div>
                <span className="text-[11px] text-[#667085] mt-0.5 line-clamp-1">
                  {item.subtitle}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* COLUMN B: ROBOTICS AND CONTROL */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-1.5 border-b border-[#E5EAF1]">
            <Sliders size={16} className="text-[#155EEF]" />
            <div>
              <h3 className="text-[13px] font-bold uppercase tracking-wider text-[#172033]">
                Robotics and Control
              </h3>
            </div>
          </div>

          <div className="space-y-1">
            {COLUMN_B_ITEMS.map((item) => (
              <Link
                key={item.title}
                to={item.href as never}
                onClick={() => onLinkClick(item.title, item.href)}
                className="group flex flex-col p-2 rounded-lg hover:bg-[#F8FAFC] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF]"
              >
                <div className="flex items-center justify-between text-xs font-bold text-[#172033] group-hover:text-[#155EEF]">
                  <span>{item.title}</span>
                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span className="text-[9.5px] font-mono text-[#667085] bg-[#F2F4F7] group-hover:bg-[#EFF6FF] group-hover:text-[#155EEF] px-1.5 py-0.2 rounded transition-colors">
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight
                      size={12}
                      className="text-[#98A2B3] group-hover:text-[#155EEF] group-hover:translate-x-0.5 transition-all"
                    />
                  </div>
                </div>
                <span className="text-[11px] text-[#667085] mt-0.5 line-clamp-1">
                  {item.subtitle}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* COLUMN C: ROBOTIC SYSTEMS */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-1.5 border-b border-[#E5EAF1]">
            <Bot size={16} className="text-[#155EEF]" />
            <div>
              <h3 className="text-[13px] font-bold uppercase tracking-wider text-[#172033]">
                Robotic Systems
              </h3>
            </div>
          </div>

          <div className="space-y-1">
            {COLUMN_C_ITEMS.map((item) => (
              <Link
                key={item.title}
                to={item.href as never}
                onClick={() => onLinkClick(item.title, item.href)}
                className="group flex flex-col p-2 rounded-lg hover:bg-[#F8FAFC] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF]"
              >
                <div className="flex items-center justify-between text-xs font-bold text-[#172033] group-hover:text-[#155EEF]">
                  <span>{item.title}</span>
                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span className="text-[9.5px] font-mono text-[#667085] bg-[#F2F4F7] group-hover:bg-[#EFF6FF] group-hover:text-[#155EEF] px-1.5 py-0.2 rounded transition-colors">
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight
                      size={12}
                      className="text-[#98A2B3] group-hover:text-[#155EEF] group-hover:translate-x-0.5 transition-all"
                    />
                  </div>
                </div>
                <span className="text-[11px] text-[#667085] mt-0.5 line-clamp-1">
                  {item.subtitle}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* FEATURED PANEL & ENGINEERING TOOLS */}
        <div className="space-y-3 flex flex-col justify-between">
          <div className="flex items-center gap-2 pb-1.5 border-b border-[#E5EAF1]">
            <Sparkles size={16} className="text-[#155EEF]" />
            <h3 className="text-[13px] font-bold uppercase tracking-wider text-[#172033]">
              Featured Hardware
            </h3>
          </div>

          {/* Featured Product Card */}
          <div className="rounded-xl border border-[#B2CCFF] bg-[#F5F8FF] p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#155EEF] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#D1E0FF]">
                Featured Mechatronics
              </span>
              <Zap size={14} className="text-[#155EEF]" />
            </div>

            {/* Product Image */}
            <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-slate-900 border border-[#D1E0FF]">
              <img
                src={images.servoActuator}
                alt="Intelligent Joint Actuator (IND-IJA-140)"
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <div className="absolute bottom-1.5 right-1.5">
                <span className="rounded bg-black/75 px-1.5 py-0.5 text-[9px] font-mono font-bold text-signal border border-white/10 backdrop-blur-xs">
                  48V CiA 402
                </span>
              </div>
            </div>

            {/* Model Name */}
            <div>
              <h4 className="text-xs font-bold text-[#172033] leading-snug">
                Intelligent Joint Actuator (IND-IJA-140)
              </h4>
              <p className="text-[11px] text-[#475467] leading-relaxed mt-1">
                All-in-one hollow-shaft joint integrating brushless servomotor, zero-backlash strain-wave gearing, dual 19-bit encoders, and EtherCAT CoE drive.
              </p>
            </div>

            {/* Actions: View Product & View All Products */}
            <div className="pt-1 flex items-center gap-2">
              <Link
                to="/technology/intelligent-actuators"
                onClick={() =>
                  onLinkClick("Intelligent Joint Actuators", "/technology/intelligent-actuators")
                }
                className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-[#155EEF] hover:bg-[#1047BF] px-2.5 py-1.5 rounded-md shadow-2xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF]"
              >
                <span>View Product</span>
                <ArrowRight size={11} />
              </Link>
              <Link
                to="/products"
                onClick={() => onLinkClick("All Products Catalogue", "/products")}
                className="text-[11px] font-semibold text-[#155EEF] hover:underline"
              >
                All Products →
              </Link>
            </div>
          </div>

          {/* Quick Engineering Tools Shortcuts */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10.5px] font-mono font-bold uppercase text-[#667085] tracking-wider block">
              Engineering Sizing &amp; Tools
            </span>

            <Link
              to="/technology/calculators"
              onClick={() => onLinkClick("Sizing Calculators", "/technology/calculators")}
              className="flex items-center justify-between text-xs text-[#344054] hover:text-[#155EEF] py-1 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Calculator size={13} className="text-[#667085]" />
                <span>Motion Sizing Calculators</span>
              </span>
              <span className="text-[10px] font-mono text-[#98A2B3]">ISO/DIN</span>
            </Link>

            <Link
              to="/products/compare"
              onClick={() => onLinkClick("Product Comparator", "/products/compare")}
              className="flex items-center justify-between text-xs text-[#344054] hover:text-[#155EEF] py-1 transition-colors"
            >
              <span className="flex items-center gap-2">
                <GitCompare size={13} className="text-[#667085]" />
                <span>Component Comparator</span>
              </span>
              <span className="text-[10px] font-mono text-[#98A2B3]">Matrix</span>
            </Link>

            <Link
              to="/technology/motion-studio"
              onClick={() => onLinkClick("INDUS Motion Studio", "/technology/motion-studio")}
              className="flex items-center justify-between text-xs text-[#344054] hover:text-[#155EEF] py-1 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Activity size={13} className="text-[#667085]" />
                <span>Motion Studio 6-Axis</span>
              </span>
              <span className="text-[10px] font-mono text-[#98A2B3]">Live</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM CONSULTATION & RFQ STRIP */}
      <div className="mt-6 rounded-xl border border-[#E5EAF1] bg-[#F8FAFC] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-[#EFF6FF] text-[#155EEF] grid place-items-center shrink-0 border border-[#D1E0FF]">
            <Sparkles size={15} />
          </div>
          <div>
            <h5 className="text-xs font-bold text-[#172033]">
              Need component sizing or kinematic torque validation?
            </h5>
            <p className="text-[11px] text-[#667085]">
              Our application engineering team verifies load moments, cycle times, and fieldbus compatibility.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Link
            to="/book-consultation"
            onClick={() => {
              onClose();
              onLinkClick("Discuss Your Application", "/book-consultation");
            }}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D1E0FF] bg-white hover:bg-[#EFF6FF] text-[#155EEF] text-xs font-bold shadow-2xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF]"
          >
            <span>Discuss Your Application</span>
          </Link>
          <Link
            to="/quote"
            onClick={() => {
              onClose();
              onLinkClick("Request Commercial Quote", "/quote");
            }}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#155EEF] hover:bg-[#1047BF] text-white text-xs font-bold shadow-2xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF]"
          >
            <span>Request Commercial Quote</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}
