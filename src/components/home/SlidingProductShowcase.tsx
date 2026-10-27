import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Pause, Play, ArrowRight } from "lucide-react";
import { trackDigitalPresence } from "@/trackDigitalPresence";
import { trackClarityEvent } from "@/analytics/clarity";

// High-resolution verified photographic product assets
import harmonicReducerImage from "@/assets/products/harmonic-reducer.jpg";
import cycloidalReducerImage from "@/assets/products/cycloidal-reducer.jpg";
import planetaryReducerImage from "@/assets/products/planetary-reducer.jpg";
import weldingRobotImage from "@/assets/products/welding-robot.jpg";
import cobotRobotImage from "@/assets/products/cobot-robot.jpg";
import scaraRobotImage from "@/assets/products/scara-robot.jpg";
import linearActuatorImage from "@/assets/products/linear-actuator.jpg";
import rotaryActuatorImage from "@/assets/products/rotary-actuator.jpg";
import driveWheelImage from "@/assets/products/drive-wheel.jpg";
import mecanumWheelImage from "@/assets/products/mecanum-wheel.jpg";
import servoDriveImage from "@/assets/products/servo-drive.jpg";
import robotControllerImage from "@/assets/products/robot-controller.jpg";

export interface ShowcaseProduct {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  description: string;
  specPrimaryLabel: string;
  specPrimaryValue: string;
  specSecondaryLabel: string;
  specSecondaryValue: string;
  badge: string;
  image: string;
  alt: string;
}

export const SHOWCASE_PRODUCTS: ShowcaseProduct[] = [
  {
    id: "shd-series-harmonic-reducer",
    name: "SHD-20 Strain Wave Reducer",
    category: "Precision Reducers",
    categorySlug: "precision-reducers",
    description: "Zero-backlash strain-wave gearhead engineered for compact robotic arm joints and precision rotary indexers.",
    specPrimaryLabel: "Backlash",
    specPrimaryValue: "≤ 10 arcsec",
    specSecondaryLabel: "Ratio Range",
    specSecondaryValue: "50:1 – 160:1",
    badge: "DIN 3990 Class 4",
    image: harmonicReducerImage,
    alt: "INDUS SHD-20 strain wave harmonic gearhead for robotic joint integration",
  },
  {
    id: "rv-40e-cycloidal-reducer",
    name: "RV-40E Cycloidal Reducer",
    category: "Precision Reducers",
    categorySlug: "precision-reducers",
    description: "Ultra-rigid pin-wheel cycloidal drive with dual-supported bearings for high shock load absorption.",
    specPrimaryLabel: "Peak Torque",
    specPrimaryValue: "5,000 Nm",
    specSecondaryLabel: "Lost Motion",
    specSecondaryValue: "≤ 1 arcmin",
    badge: "5x Shock Capacity",
    image: cycloidalReducerImage,
    alt: "INDUS RV-40E high-torque cycloidal precision reducer",
  },
  {
    id: "pgl-115-planetary-gearbox",
    name: "PGL-115 Helical Planetary",
    category: "Precision Reducers",
    categorySlug: "precision-reducers",
    description: "Ground helical planetary gearbox designed for continuous servo motor coupling and dynamic motion.",
    specPrimaryLabel: "Backlash",
    specPrimaryValue: "≤ 3 arcmin",
    specSecondaryLabel: "Efficiency",
    specSecondaryValue: "≥ 97%",
    badge: "IP65 Sealed",
    image: planetaryReducerImage,
    alt: "INDUS PGL-115 helical inline planetary gearbox for servomotor coupling",
  },
  {
    id: "irb-6700-industrial-arm",
    name: "IRB-6700 6-Axis Industrial Arm",
    category: "Industrial Robots",
    categorySlug: "industrial-robots",
    description: "Rigid 6-axis articulated robot configured for machine tending, welding, and high-duty palletizing.",
    specPrimaryLabel: "Rated Payload",
    specPrimaryValue: "20 kg",
    specSecondaryLabel: "Repeatability",
    specSecondaryValue: "±0.05 mm",
    badge: "Reach 1,650 mm",
    image: weldingRobotImage,
    alt: "INDUS IRB-6700 6-axis industrial robot in automated manufacturing cell",
  },
  {
    id: "cr-10-collaborative-robot",
    name: "CR-10 Collaborative Cobot",
    category: "Industrial Robots",
    categorySlug: "industrial-robots",
    description: "Human-safe collaborative arm equipped with joint torque sensors and SIL3 dual-channel safety logic.",
    specPrimaryLabel: "Rated Payload",
    specPrimaryValue: "10 kg",
    specSecondaryLabel: "Safety Cert",
    specSecondaryValue: "ISO 10218-1 / PLe",
    badge: "Safe Torque Off",
    image: cobotRobotImage,
    alt: "INDUS CR-10 collaborative robot arm with collision detection",
  },
  {
    id: "scara-450-high-speed-robot",
    name: "SCARA-450 High-Speed Arm",
    category: "Industrial Robots",
    categorySlug: "industrial-robots",
    description: "High-speed 4-axis SCARA engineered for electronics sub-assembly, screw fastening, and sorting.",
    specPrimaryLabel: "Takt Cycle",
    specPrimaryValue: "0.38 s",
    specSecondaryLabel: "Repeatability",
    specSecondaryValue: "±0.02 mm",
    badge: "Payload 6 kg",
    image: scaraRobotImage,
    alt: "INDUS SCARA-450 high-speed 4-axis pick and place industrial arm",
  },
  {
    id: "la-80-linear-actuator",
    name: "LA-80 Precision Linear Stage",
    category: "Linear & Rotary Actuators",
    categorySlug: "actuators",
    description: "Integrated ground ball screw stage with dual linear guide rails and absolute optical feedback.",
    specPrimaryLabel: "Stroke Range",
    specPrimaryValue: "up to 1,200 mm",
    specSecondaryLabel: "Repeatability",
    specSecondaryValue: "±0.01 mm",
    badge: "Speed 1.5 m/s",
    image: linearActuatorImage,
    alt: "INDUS LA-80 integrated precision ball screw linear actuator stage",
  },
  {
    id: "rda-180-rotary-actuator",
    name: "RDA-180 Direct-Drive Rotary",
    category: "Linear & Rotary Actuators",
    categorySlug: "actuators",
    description: "Hollow-shaft direct-drive rotary torque motor for rotary tables, gimbals, and multi-axis tooling.",
    specPrimaryLabel: "Continuous Torque",
    specPrimaryValue: "180 Nm",
    specSecondaryLabel: "Feedback",
    specSecondaryValue: "24-bit Absolute",
    badge: "Hollow Bore 65mm",
    image: rotaryActuatorImage,
    alt: "INDUS RDA-180 hollow-shaft direct drive torque rotary actuator",
  },
  {
    id: "aw-800-agv-drive-wheel",
    name: "AW-800 Differential Drive Wheel",
    category: "Robotic Wheels",
    categorySlug: "robotic-wheels",
    description: "Integrated in-wheel drive unit with brushless AC servo motor and vulcanized polyurethane tire.",
    specPrimaryLabel: "Load Capacity",
    specPrimaryValue: "800 kg / Wheel",
    specSecondaryLabel: "Max Speed",
    specSecondaryValue: "2.2 m/s",
    badge: "Dual Feedback",
    image: driveWheelImage,
    alt: "INDUS AW-800 autonomous mobile robot in-wheel drive unit",
  },
  {
    id: "mw-1000-mecanum-wheel",
    name: "MW-1000 Mecanum Vector Wheel",
    category: "Robotic Wheels",
    categorySlug: "robotic-wheels",
    description: "Omnidirectional vector drive wheel with forged alloy hub and precision sealed-bearing rollers.",
    specPrimaryLabel: "Rated Capacity",
    specPrimaryValue: "1,000 kg",
    specSecondaryLabel: "Wheel Diameter",
    specSecondaryValue: "250 mm",
    badge: "Omnidirectional",
    image: mecanumWheelImage,
    alt: "INDUS MW-1000 heavy-duty omnidirectional mecanum wheel",
  },
  {
    id: "ec-800-ethercat-servo-drive",
    name: "EC-800 Multi-Axis Servo Driver",
    category: "Motion Controllers",
    categorySlug: "control-systems",
    description: "Compact multi-axis EtherCAT servo drive supporting CiA 402 profile with deterministic bus cycle.",
    specPrimaryLabel: "Fieldbus Cycle",
    specPrimaryValue: "250 µs",
    specSecondaryLabel: "Rated Supply",
    specSecondaryValue: "48 V / 60 A",
    badge: "EtherCAT CiA402",
    image: servoDriveImage,
    alt: "INDUS EC-800 compact multi-axis servo driver for robotics",
  },
  {
    id: "rc-500-modular-robot-controller",
    name: "RC-500 Modular Kinematics Unit",
    category: "Motion Controllers",
    categorySlug: "control-systems",
    description: "Real-time industrial kinematics computer with trajectory planning, ROS 2 bridge, and SIL3 logic.",
    specPrimaryLabel: "Synchronous Axes",
    specPrimaryValue: "Up to 32 Axes",
    specSecondaryLabel: "Fieldbus Support",
    specSecondaryValue: "PROFINET / EtherCAT",
    badge: "SIL3 Safety PLC",
    image: robotControllerImage,
    alt: "INDUS RC-500 modular robotics controller with real-time fieldbus",
  },
];

export function SlidingProductShowcase() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  // Speed: 95 pixels/second gives ~22s full track cycle for 12 cards (336px each = 4032px track)
  const normalSpeed = 95;
  const hoverSpeed = 0;

  // Reduced motion media query listener
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  // Continuous linear animation loop via requestAnimationFrame
  const stepAnimation = useCallback(
    (timestamp: number) => {
      if (!lastTimestampRef.current) {
        lastTimestampRef.current = timestamp;
      }
      const elapsed = (timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      const container = scrollContainerRef.current;
      if (container && !isPaused && !isHovered && !prefersReducedMotion) {
        const speed = isHovered ? hoverSpeed : normalSpeed;
        const delta = speed * elapsed;
        container.scrollLeft += delta;

        // Halfway point reset for seamless infinite loop
        const halfWidth = container.scrollWidth / 2;
        if (container.scrollLeft >= halfWidth) {
          container.scrollLeft -= halfWidth;
        }
      }

      animationFrameRef.current = requestAnimationFrame(stepAnimation);
    },
    [isPaused, isHovered, prefersReducedMotion],
  );

  useEffect(() => {
    if (prefersReducedMotion) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    lastTimestampRef.current = null;
    animationFrameRef.current = requestAnimationFrame(stepAnimation);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [stepAnimation, prefersReducedMotion]);

  // Manual step navigation (336px per click = 1 card + gap)
  const scrollManual = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 336;
    const target =
      direction === "left"
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: target,
      behavior: "smooth",
    });

    trackDigitalPresence("click", `Showcase Nav ${direction}`, "Manual slider step");
    trackClarityEvent(`showcase_step_${direction}`);
  };

  const togglePause = () => {
    setIsPaused((prev) => {
      const next = !prev;
      trackDigitalPresence("click", "Showcase Toggle Pause", `Animation ${next ? "Paused" : "Resumed"}`);
      return next;
    });
  };

  return (
    <section
      id="product-showcase"
      className="relative w-full bg-[#F8FAFC] border-y border-[#E2E8F0] py-14 lg:py-20 text-[#0F172A] overflow-hidden select-none"
      aria-label="Engineered Motion Systems Product Carousel"
    >
      {/* Background Subtle Precision Grid Line Accent */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[linear-gradient(to_right,#E2E8F0_1px,transparent_1px),linear-gradient(to_bottom,#E2E8F0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 mb-8 sm:mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#0284C7]/30 bg-[#E0F2FE]/70 px-3.5 py-1 font-mono text-[11px] font-bold uppercase tracking-[.18em] text-[#0284C7]">
              <span className="size-1.5 rounded-full bg-[#0284C7] animate-pulse" />
              Verified Kinematic &amp; Motion Hardware
            </div>
            <h2 className="mt-3 font-display text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-[#0F172A]">
              Engineered Motion Systems
            </h2>
            <p className="mt-2 max-w-2xl text-xs sm:text-sm text-[#475467] leading-relaxed font-normal">
              Explore precision reducers, robotic joints, actuators, and motion-control components designed for demanding industrial automation applications.
            </p>
          </div>

          {/* Interactive Controls: Prev/Next, Accessible Pause/Play & Full Catalogue Link */}
          <div className="flex items-center gap-2 self-start md:self-end shrink-0">
            {/* Pause/Play Button for Accessibility */}
            <button
              onClick={togglePause}
              className="inline-flex size-9 items-center justify-center rounded-lg border border-[#CBD5E1] bg-white text-[#475467] hover:text-[#0F172A] hover:border-[#155EEF] hover:bg-[#EFF6FF] transition-all cursor-pointer shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF]"
              aria-label={isPaused ? "Play product showcase animation" : "Pause product showcase animation"}
              title={isPaused ? "Resume auto-scroll" : "Pause auto-scroll"}
            >
              {isPaused ? <Play size={14} className="fill-current text-[#155EEF]" /> : <Pause size={14} className="fill-current text-[#475467]" />}
            </button>

            {/* Manual Left Scroll */}
            <button
              onClick={() => scrollManual("left")}
              className="inline-flex size-9 items-center justify-center rounded-lg border border-[#CBD5E1] bg-white text-[#475467] hover:text-[#0F172A] hover:border-[#155EEF] hover:bg-[#EFF6FF] transition-all cursor-pointer shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF]"
              aria-label="Previous product"
              title="Scroll left"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Manual Right Scroll */}
            <button
              onClick={() => scrollManual("right")}
              className="inline-flex size-9 items-center justify-center rounded-lg border border-[#CBD5E1] bg-white text-[#475467] hover:text-[#0F172A] hover:border-[#155EEF] hover:bg-[#EFF6FF] transition-all cursor-pointer shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF]"
              aria-label="Next product"
              title="Scroll right"
            >
              <ChevronRight size={16} />
            </button>

            {/* View Full Catalogue Link */}
            <Link
              to="/products"
              className="ml-2 hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-[#155EEF]/30 bg-white hover:bg-[#155EEF] hover:text-white text-[#155EEF] text-xs font-bold uppercase tracking-wider px-3.5 py-2 transition-all shadow-2xs"
            >
              <span>Full Catalogue</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      {/* Marquee Track Container */}
      <div
        ref={scrollContainerRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex gap-4 overflow-x-auto scrollbar-none px-4 sm:px-6 cursor-grab active:cursor-grabbing pb-3"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        role="region"
        aria-roledescription="carousel"
        aria-label="Engineered Motion Systems Product Showcase"
      >
        {/* Render products twice for seamless infinite wrapping */}
        {[...SHOWCASE_PRODUCTS, ...SHOWCASE_PRODUCTS].map((product, index) => {
          const isDuplicated = index >= SHOWCASE_PRODUCTS.length;

          return (
            <article
              key={`${product.id}-${index}`}
              aria-hidden={isDuplicated}
              className="group relative flex w-[300px] sm:w-[320px] shrink-0 flex-col justify-between rounded-xl border border-[#E2E8F0] bg-white p-4 transition-all duration-200 hover:-translate-y-1 hover:border-[#155EEF]/60 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)] shadow-2xs"
            >
              <div>
                {/* 16:10 Aspect Ratio Image Container */}
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-[#F1F5F9] bg-[#F8FAFC] p-2.5">
                  <img
                    src={product.image}
                    alt={product.alt}
                    loading="lazy"
                    className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute top-2.5 left-2.5 rounded-md bg-white/95 border border-[#E2E8F0] px-2 py-0.5 font-mono text-[9.5px] font-bold text-[#0284C7] shadow-2xs">
                    {product.badge}
                  </span>
                </div>

                {/* Category & Title */}
                <div className="mt-3.5">
                  <span className="block text-[10.5px] font-mono font-bold uppercase tracking-[.18em] text-[#0284C7]">
                    {product.category}
                  </span>
                  <h3 className="mt-1 font-display text-[15px] font-bold uppercase tracking-tight text-[#0F172A] group-hover:text-[#155EEF] transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="mt-1.5 text-xs text-[#475467] leading-5 line-clamp-2">
                    {product.description}
                  </p>
                </div>
              </div>

              {/* Technical Specifications Strip & Action */}
              <div className="mt-4 pt-3 border-t border-[#F1F5F9]">
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono mb-3 bg-[#F8FAFC] p-2.5 rounded-lg border border-[#E2E8F0]">
                  <div>
                    <span className="block text-[9.5px] text-[#64748B] uppercase tracking-wider font-semibold">
                      {product.specPrimaryLabel}
                    </span>
                    <span className="font-bold text-[#0F172A] line-clamp-1">
                      {product.specPrimaryValue}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[9.5px] text-[#64748B] uppercase tracking-wider font-semibold">
                      {product.specSecondaryLabel}
                    </span>
                    <span className="font-bold text-[#0284C7] line-clamp-1">
                      {product.specSecondaryValue}
                    </span>
                  </div>
                </div>

                <Link
                  to="/products/$category/$id"
                  params={{ category: product.categorySlug, id: product.id }}
                  tabIndex={isDuplicated ? -1 : 0}
                  onClick={() => {
                    trackDigitalPresence("click", `Showcase Card ${product.name}`, `/products/${product.categorySlug}/${product.id}`);
                    trackClarityEvent(`showcase_card_${product.id}`);
                  }}
                  className="inline-flex w-full items-center justify-between rounded-lg bg-[#F8FAFC] hover:bg-[#155EEF] border border-[#E2E8F0] hover:border-[#155EEF] text-[#1E293B] hover:text-white px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF]"
                >
                  <span>View Details</span>
                  <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
