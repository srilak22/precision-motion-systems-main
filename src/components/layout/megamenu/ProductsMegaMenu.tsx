import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Settings2,
  Bot,
  Compass,
  Sliders,
  Eye,
  Wrench,
  Boxes,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { images } from "@/lib/images";

interface ProductsMegaMenuProps {
  onClose: () => void;
  onLinkClick: (title: string, href: string) => void;
  onQuoteClick: () => void;
}

interface ProductFamilyCardData {
  title: string;
  description: string;
  badge?: string;
  image: string;
  href: string;
}

interface FeaturedProductData {
  title: string;
  badge: string;
  description: string;
  specs: string[];
  image: string;
  href: string;
}

interface ProductCategoryConfig {
  id: string;
  label: string;
  tagline: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  products: ProductFamilyCardData[];
  featured?: FeaturedProductData;
}

// 8 Master Product Categories with clean, focused product families & verified photographic assets
const PRODUCT_CATEGORIES: ProductCategoryConfig[] = [
  {
    id: "motion-actuation",
    label: "Motion & Actuation",
    tagline: "Precision reducers, servomotors & actuators",
    icon: Settings2,
    products: [
      {
        title: "Strain-Wave Harmonic Reducers",
        description:
          "Zero-backlash flexspline gearing for cobots, surgical arms, and precision rotary indexing axes.",
        badge: "<0.5 arcmin backlash",
        image: images.harmonicReducer,
        href: "/products/precision-reducers",
      },
      {
        title: "RV Cycloidal Drives",
        description:
          "High-rigidity shock-tolerant speed reducers for robot base joints and heavy turntable positioners.",
        badge: "500% shock capacity",
        image: images.cycloidalReducer,
        href: "/products/precision-reducers",
      },
      {
        title: "Precision Planetary Gearboxes",
        description:
          "High-efficiency gearing for controlled torque transmission in industrial automation and machine axes.",
        badge: "Efficiency >97%",
        image: images.planetaryReducer,
        href: "/products/precision-reducers",
      },
      {
        title: "Servo Motors & Joint Actuators",
        description:
          "Brushless AC servomotors and integrated hollow-shaft joint modules with 24-bit multi-turn feedback.",
        badge: "24-bit absolute",
        image: images.servoActuator,
        href: "/products/servo-motors",
      },
    ],
    featured: {
      badge: "Featured Mechatronics",
      title: "Intelligent Joint Actuator (IND-IJA-140)",
      description:
        "All-in-one hollow-shaft joint integrating brushless servomotor, strain-wave gearing, dual encoders, and EtherCAT drive.",
      specs: ["48V DC bus", "Dual 19-bit encoders", "EtherCAT CiA 402"],
      image: images.servoActuator,
      href: "/technology/intelligent-actuators",
    },
  },
  {
    id: "robotics",
    label: "Robotics",
    tagline: "Industrial arms, cobots & assembly cells",
    icon: Bot,
    products: [
      {
        title: "Industrial Robotic Arms",
        description:
          "6-axis articulated arms engineered for machine tending, palletizing, and high-rate continuous handling.",
        badge: "7 – 50 kg payload",
        image: images.arm,
        href: "/products/robotic-arms",
      },
      {
        title: "Collaborative Robots",
        description:
          "Power and force limited cobots equipped with joint torque sensing for safe direct operator collaboration.",
        badge: "ISO 10218-1 certified",
        image: images.cobotRobot,
        href: "/products/robotic-arms",
      },
      {
        title: "SCARA & Pick-and-Place",
        description:
          "High-speed 4-axis planar handling robots for electronics assembly, kitting, and conveyor tracking.",
        badge: "Cycle time <0.38s",
        image: images.scaraRobot,
        href: "/products/robotic-arms",
      },
      {
        title: "Industrial Welding Robots",
        description:
          "Continuous seam-tracking articulated robots with integrated hollow wrist for MIG, TIG, and spot welding.",
        badge: "IP67 sealed wrist",
        image: images.weldingRobot,
        href: "/products/industrial-robots",
      },
    ],
    featured: {
      badge: "Flagship Cobot",
      title: "IND-CR7 Collaborative Arm",
      description:
        "7 kg payload cobot with integrated joint torque sensing, zero-effort lead-through teaching, and collision stop.",
      specs: ["920 mm reach", "±0.02 mm repeatability", "SafeStop PL d"],
      image: images.cobotRobot,
      href: "/products/robotic-arms",
    },
  },
  {
    id: "mobility",
    label: "Mobility & Autonomous Systems",
    tagline: "AGV/AMR wheels, drive units & steering",
    icon: Compass,
    products: [
      {
        title: "Mecanum Omnidirectional Wheels",
        description:
          "45-degree angled roller wheels enabling true zero-turn radius multi-directional chassis maneuvers.",
        badge: "Up to 1500 kg/wheel",
        image: images.mecanumWheel,
        href: "/products/robotic-wheels",
      },
      {
        title: "Differential Drive Wheel Units",
        description:
          "High-traction brushless servo drive wheels with integrated holding brakes and suspension mounts.",
        badge: "In-wheel BLDC motor",
        image: images.driveWheel,
        href: "/products/robotic-wheels",
      },
      {
        title: "Omni Transverse Wheels",
        description:
          "Multi-roller wheel assemblies for cross-transfer conveyors, ball transfer tables, and compact AGVs.",
        badge: "Low rolling resistance",
        image: images.omniWheel,
        href: "/products/robotic-wheels",
      },
      {
        title: "Integrated Mobile AMR Modules",
        description:
          "Complete traction and steering drive packages with dual encoders and CANopen control for mobile robotics.",
        badge: "CANopen DS402",
        image: images.mobileModule,
        href: "/products/robotic-wheels",
      },
    ],
    featured: {
      badge: "AMR Drive Module",
      title: "IND-MW-800 Traction Steering Unit",
      description:
        "Compact in-wheel drive unit engineered for industrial AGVs and autonomous warehouse transport platforms.",
      specs: ["800 kg static load", "Spring suspension", "24V/48V DC bus"],
      image: images.mobileModule,
      href: "/products/robotic-wheels",
    },
  },
  {
    id: "control-systems",
    label: "Control Systems",
    tagline: "Motion controllers, servo drives & PLCs",
    icon: Sliders,
    products: [
      {
        title: "Motion Controllers",
        description:
          "Deterministic multi-axis trajectory masters supporting electronic camming, gearing, and CNC interpolation.",
        badge: "125 µs sync cycle",
        image: images.motionController,
        href: "/products/control-systems",
      },
      {
        title: "Robot System Controllers",
        description:
          "Centralized robotic IPC platforms with kinematics compiler, teach pendant support, and ROS 2 bridges.",
        badge: "Multi-kinematics core",
        image: images.robotController,
        href: "/products/control-systems",
      },
      {
        title: "Servo Drives & Amplifiers",
        description:
          "SiC high-frequency vector drives with dual-loop position feedback and STO functional safety.",
        badge: "EtherCAT / CANopen",
        image: images.servoDrive,
        href: "/products/control-systems",
      },
      {
        title: "PLC & Automation Gateways",
        description:
          "Modular fieldbus couplers bridging industrial machines to edge automation infrastructure.",
        badge: "PROFINET & EtherNet/IP",
        image: images.plcAutomation,
        href: "/products/control-systems",
      },
    ],
    featured: {
      badge: "Motion Core",
      title: "IND-MC-64 Real-Time Controller",
      description:
        "DIN-rail industrial controller running deterministic real-time Linux with EtherCAT master engine.",
      specs: ["64 axes synchronized", "125 µs cycle time", "OPC UA & TSN"],
      image: images.motionController,
      href: "/products/control-systems",
    },
  },
  {
    id: "sensing-vision",
    label: "Sensing & Vision",
    tagline: "Optical encoders, F/T sensors & 3D vision",
    icon: Eye,
    products: [
      {
        title: "Absolute Rotary Encoders",
        description:
          "Optical and magnetic absolute encoders delivering sub-arcsecond position feedback to motion drives.",
        badge: "Up to 24-bit resolution",
        image: images.sensorsFeedback,
        href: "/products/sensors-encoders",
      },
      {
        title: "6-Axis Force / Torque Sensors",
        description:
          "Multi-axis wrist sensors measuring forces and torques for tactile feedback and insertion control.",
        badge: "Fx, Fy, Fz, Mx, My, Mz",
        image: images.sensorsFeedback,
        href: "/products/sensors-encoders",
      },
      {
        title: "3D Machine Vision Cameras",
        description:
          "Structured light and laser profile cameras for random bin picking, dimensioning, and part inspection.",
        badge: "Depth accuracy <0.02mm",
        image: images.plcAutomation,
        href: "/products/machine-vision",
      },
      {
        title: "Linear Position Feedback Scales",
        description:
          "Direct optical linear feedback scales compensating for ballscrew thermal expansion and mechanical backlash.",
        badge: "Sub-micron repeatability",
        image: images.linearActuator,
        href: "/products/sensors-encoders",
      },
    ],
    featured: {
      badge: "Wrist Metrology",
      title: "IND-SEN-6AX Force-Torque Sensor",
      description:
        "High-frequency wrist sensor providing continuous force-torque feedback for compliant assembly and polishing.",
      specs: ["IP67 rated", "EtherCAT/EtherNet interface", "<0.05% crosstalk"],
      image: images.sensorsFeedback,
      href: "/products/sensors-encoders",
    },
  },
  {
    id: "tooling",
    label: "Tooling & End Effectors",
    tagline: "Electric grippers, vacuum & tool changers",
    icon: Wrench,
    products: [
      {
        title: "Electric Parallel Grippers",
        description:
          "Precision digital parallel grippers with adjustable stroke, gripping force, and part drop detection.",
        badge: "Force control 10–500 N",
        image: images.electricActuator,
        href: "/products/end-effectors",
      },
      {
        title: "Vacuum Foam Area Arrays",
        description:
          "Smart multi-chamber vacuum foam arrays and ejectors for palletizing cartons, glass, and sheet metal.",
        badge: "Energy-saving valves",
        image: images.rotaryActuator,
        href: "/products/end-effectors",
      },
      {
        title: "Automatic Tool Changers",
        description:
          "Pneumatic and electric robotic tool changers enabling multi-process flexibility on single robot cells.",
        badge: "ISO 9409-1 flange",
        image: images.industrialGearbox,
        href: "/products/end-effectors",
      },
      {
        title: "Rotary Gripping Units",
        description:
          "Integrated grip-and-rotate actuators for automated capping, tube sorting, and assembly fixtures.",
        badge: "Continuous 360° rotation",
        image: images.rotaryActuator,
        href: "/products/end-effectors",
      },
    ],
    featured: {
      badge: "Digital Gripper",
      title: "IND-EG-80 Parallel Servo Gripper",
      description:
        "Programmable stroke and gripping force with continuous position confirmation and part detection.",
      specs: ["80 mm stroke", "5 N – 250 N force control", "IO-Link interface"],
      image: images.electricActuator,
      href: "/products/end-effectors",
    },
  },
  {
    id: "mechanical-components",
    label: "Mechanical Components",
    tagline: "Linear slides, ball screws & bearings",
    icon: Boxes,
    products: [
      {
        title: "Linear Actuators & Slides",
        description:
          "Enclosed ball-screw and belt-driven linear slides for multi-axis Cartesian gantries and transfer axes.",
        badge: "Repeatable ±0.01 mm",
        image: images.linearActuator,
        href: "/products/actuators",
      },
      {
        title: "Precision Ground Ball Screws",
        description:
          "JIS C3/C5 grade ground ball screws delivering high mechanical stiffness and low driving torque.",
        badge: "C3 precision grade",
        image: images.linearActuator,
        href: "/products/linear-motion",
      },
      {
        title: "Crossed Roller Bearings",
        description:
          "High-rigidity slewing rings handling radial, axial, and tilting moment loads simultaneously in joints.",
        badge: "P4 runout accuracy",
        image: images.cycloidalReducer,
        href: "/products/mechanical-transmission",
      },
      {
        title: "Flexible Couplings & Brakes",
        description:
          "Zero-backlash metal bellows couplings and failsafe electromagnetic spring brakes for machine axes.",
        badge: "Torsional stiffness",
        image: images.industrialGearbox,
        href: "/products/mechanical-transmission",
      },
    ],
    featured: {
      badge: "Precision Slide",
      title: "IND-LA-Compact Linear Module",
      description:
        "Ground ball screw guided by dual roller rails in an anodized extruded aluminum housing.",
      specs: ["±0.005 mm repeatability", "Up to 1500 mm stroke", "High dynamic stiffness"],
      image: images.linearActuator,
      href: "/products/actuators",
    },
  },
  {
    id: "safety-intelligent",
    label: "Safety & Intelligent Systems",
    tagline: "Safety scanners, PLCs & edge AI nodes",
    icon: ShieldCheck,
    products: [
      {
        title: "Safety Laser Scanners",
        description:
          "Configurable multi-zone optical scanners safeguarding robot perimeters and autonomous vehicle paths.",
        badge: "SIL 2 / PL d certified",
        image: images.sensorsFeedback,
        href: "/products/robotics-safety",
      },
      {
        title: "Modular Safety PLCs & Relays",
        description:
          "Certified safety controllers managing emergency stop circuits, gate interlocks, and Safe Motion STO.",
        badge: "ISO 13849 Category 4",
        image: images.plcAutomation,
        href: "/products/robotics-safety",
      },
      {
        title: "Industrial TSN & Fieldbus Switches",
        description:
          "Managed gigabit switches optimized for low-jitter deterministic EtherCAT and PROFINET IRT lines.",
        badge: "Sub-microsecond sync",
        image: images.motionController,
        href: "/products/networking-edge",
      },
      {
        title: "Edge AI Compute Gateways",
        description:
          "Rugged fanless edge computers running real-time defect classification, trajectory AI, and health diagnostics.",
        badge: "DIN-rail industrial",
        image: images.robotController,
        href: "/products/networking-edge",
      },
    ],
    featured: {
      badge: "Certified Safety",
      title: "IND-SAF-300 Multi-Zone Scanner",
      description:
        "Compact laser scanner with dynamic field switching based on vehicle speed and steering angle.",
      specs: ["5.5 m safety range", "Type 3 / SIL 2 / PL d", "CIP Safety over Ethernet"],
      image: images.sensorsFeedback,
      href: "/products/robotics-safety",
    },
  },
];

export function ProductsMegaMenu({ onClose, onLinkClick, onQuoteClick }: ProductsMegaMenuProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string>("motion-actuation");

  const activeCategory =
    PRODUCT_CATEGORIES.find((c) => c.id === activeCategoryId) || PRODUCT_CATEGORIES[0];

  return (
    <div className="w-full bg-[#FFFFFF] flex flex-col justify-between">
      {/* 3-AREA MAIN BODY */}
      <div className="flex flex-col lg:flex-row w-full min-h-[460px]">
        {/* =========================================================================
            AREA 1: COMPACT CATEGORY SIDEBAR (LEFT)
           ========================================================================= */}
        <div className="w-full lg:w-[250px] shrink-0 border-b lg:border-b-0 lg:border-r border-[#E5EAF1] bg-[#F8FAFC] p-3 flex flex-col justify-between">
          <nav className="space-y-1" aria-label="Product categories sidebar">
            {PRODUCT_CATEGORIES.map((cat) => {
              const isActive = cat.id === activeCategoryId;
              const IconComponent = cat.icon;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategoryId(cat.id)}
                  onMouseEnter={() => setActiveCategoryId(cat.id)}
                  className={`group w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-[12.5px] transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF] ${
                    isActive
                      ? "bg-[#EFF6FF] text-[#155EEF] font-semibold border-l-2 border-[#155EEF] shadow-2xs"
                      : "text-[#344054] hover:bg-[#F2F4F7] hover:text-[#172033]"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`shrink-0 transition-colors ${
                        isActive ? "text-[#155EEF]" : "text-[#667085] group-hover:text-[#172033]"
                      }`}
                    >
                      <IconComponent size={15} />
                    </span>
                    <span className="truncate">{cat.label}</span>
                  </div>

                  <ChevronRight
                    size={13}
                    className={`shrink-0 transition-transform ${
                      isActive
                        ? "text-[#155EEF] translate-x-0.5"
                        : "text-[#98A2B3] group-hover:text-[#667085]"
                    }`}
                  />
                </button>
              );
            })}
          </nav>

          {/* Quick link at bottom of sidebar */}
          <div className="pt-2.5 mt-2 border-t border-[#E5EAF1] px-1">
            <Link
              to="/products"
              onClick={() => onLinkClick("Full Product Catalogue", "/products")}
              className="flex items-center justify-between text-[11.5px] font-semibold text-[#155EEF] hover:text-[#1047BF] transition-colors group"
            >
              <span>Explore All Categories</span>
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* =========================================================================
            AREA 2: PRODUCT-FAMILY CARD GRID (CENTRE)
           ========================================================================= */}
        <div className="flex-1 p-5 lg:p-6 bg-[#FFFFFF] flex flex-col justify-between">
          <div>
            {/* Header for Active Category */}
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#E5EAF1]">
              <div>
                <h3 className="text-sm font-bold text-[#172033] tracking-tight flex items-center gap-2">
                  <span>{activeCategory.label}</span>
                  <span className="text-[#98A2B3] font-normal text-xs">/</span>
                  <span className="text-xs font-normal text-[#667085]">
                    {activeCategory.tagline}
                  </span>
                </h3>
              </div>

              <Link
                to={(activeCategory.products[0]?.href || "/products") as never}
                onClick={() =>
                  onLinkClick(
                    `${activeCategory.label} Overview`,
                    activeCategory.products[0]?.href || "/products",
                  )
                }
                className="hidden sm:inline-flex items-center gap-1 text-[11.5px] font-semibold text-[#155EEF] hover:text-[#1047BF] transition-colors"
              >
                <span>Category Overview</span>
                <ArrowRight size={11} />
              </Link>
            </div>

            {/* 2x2 Clean Product Family Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {activeCategory.products.map((product) => (
                <Link
                  key={product.title}
                  to={product.href as never}
                  onClick={() => onLinkClick(product.title, product.href)}
                  className="group flex flex-col justify-between rounded-xl border border-[#E5EAF1] bg-[#FFFFFF] hover:bg-[#F8FAFC] hover:border-[#B2CCFF] p-3 transition-all duration-150 shadow-2xs hover:shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF]"
                >
                  <div className="flex gap-3">
                    {/* Consistent Photographic Product Asset */}
                    <div className="relative size-16 shrink-0 rounded-lg bg-[#F8FAFC] border border-[#E5EAF1] overflow-hidden p-1 flex items-center justify-center">
                      <img
                        src={product.image}
                        alt={product.title}
                        loading="lazy"
                        className="h-full w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>

                    {/* Title & Description */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1.5">
                        <h4 className="text-[12.5px] font-bold text-[#172033] group-hover:text-[#155EEF] leading-snug transition-colors line-clamp-1">
                          {product.title}
                        </h4>
                      </div>
                      <p className="text-[11.5px] text-[#475467] leading-relaxed mt-1 line-clamp-2">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom: Verified Attribute & CTA Link */}
                  <div className="mt-2.5 pt-2 border-t border-[#F0F4F8] flex items-center justify-between">
                    {product.badge ? (
                      <span className="text-[10px] font-mono text-[#0284C7] bg-[#F0F9FF] border border-[#BAE6FD] px-1.5 py-0.5 rounded">
                        {product.badge}
                      </span>
                    ) : (
                      <span />
                    )}

                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#155EEF] group-hover:text-[#1047BF] transition-colors">
                      <span>Explore Products</span>
                      <ArrowRight
                        size={11}
                        className="group-hover:translate-x-0.5 transition-transform"
                      />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* =========================================================================
            AREA 3: FEATURED PRODUCT / ENGINEERING SPOTLIGHT (RIGHT)
           ========================================================================= */}
        {activeCategory.featured && (
          <div className="w-full lg:w-[250px] shrink-0 border-t lg:border-t-0 lg:border-l border-[#E5EAF1] bg-[#FAFCFF] p-4 flex flex-col justify-between">
            <div>
              {/* Badge */}
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#E5EAF1]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#155EEF] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#D1E0FF] inline-flex items-center gap-1">
                  <Zap size={10} className="text-[#155EEF]" />
                  <span>{activeCategory.featured.badge}</span>
                </span>
              </div>

              {/* Verified Product Image */}
              <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-white border border-[#D1E0FF] p-1.5 flex items-center justify-center">
                <img
                  src={activeCategory.featured.image}
                  alt={activeCategory.featured.title}
                  loading="lazy"
                  className="h-full w-full object-contain mix-blend-multiply"
                />
              </div>

              {/* Title & Description */}
              <div className="mt-3">
                <h4 className="text-xs font-bold text-[#172033] leading-snug">
                  {activeCategory.featured.title}
                </h4>
                <p className="text-[11px] text-[#475467] leading-relaxed mt-1 line-clamp-2">
                  {activeCategory.featured.description}
                </p>
              </div>

              {/* Verified Attributes */}
              <div className="mt-3 pt-2.5 border-t border-[#E5EAF1] space-y-1">
                {activeCategory.featured.specs.map((spec) => (
                  <div
                    key={spec}
                    className="flex items-center gap-1.5 text-[10.5px] text-[#344054]"
                  >
                    <CheckCircle2 size={11} className="text-[#16A34A] shrink-0" />
                    <span className="truncate">{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action */}
            <div className="pt-3 mt-3 border-t border-[#E5EAF1]">
              <Link
                to={(activeCategory.featured.href || "/products") as never}
                onClick={() =>
                  onLinkClick(
                    activeCategory.featured?.title || "Featured Product",
                    activeCategory.featured?.href || "/products",
                  )
                }
                className="w-full inline-flex items-center justify-center gap-1.5 text-[11.5px] font-bold text-white bg-[#155EEF] hover:bg-[#1047BF] py-2 rounded-lg shadow-2xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF]"
              >
                <span>View Product</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          BOTTOM CTA FOOTER STRIP
         ========================================================================= */}
      <div className="border-t border-[#E5EAF1] bg-[#F8FAFC] px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="size-6 rounded-full bg-[#EFF6FF] text-[#155EEF] grid place-items-center shrink-0 border border-[#D1E0FF]">
            <Sparkles size={12} />
          </div>
          <div>
            <span className="text-xs font-semibold text-[#172033]">
              Need help selecting the right component?
            </span>
            <span className="hidden sm:inline text-xs text-[#667085] ml-1.5">
              Discuss your application with our engineering team.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/book-consultation"
            onClick={() => {
              onClose();
              onLinkClick("Discuss Your Application", "/book-consultation");
            }}
            className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg border border-[#D1E0FF] bg-white hover:bg-[#EFF6FF] text-[#155EEF] text-xs font-semibold shadow-2xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF]"
          >
            <span>Discuss Your Application</span>
          </Link>

          <Link
            to="/products"
            onClick={() => {
              onClose();
              onLinkClick("All Products", "/products");
            }}
            className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-[#155EEF] hover:bg-[#1047BF] text-white text-xs font-semibold shadow-2xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF]"
          >
            <span>View All Products</span>
            <ArrowRight size={11} />
          </Link>
        </div>
      </div>
    </div>
  );
}
