import React, { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  ChevronRight,
  Droplets,
  Factory,
  Leaf,
  Plus,
  Scan,
  ShieldCheck,
  Sparkles,
  Sprout,
  Timer,
  Tractor,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModals } from "@/components/modals/ModalContext";
import { buildSeoMeta } from "@/lib/seo";
import { FloatingEngineerCta } from "@/components/solutions/FloatingEngineerCta";

import agriRoverImg from "@/assets/solution-agriculture-robot.jpg";
import droneFieldImg from "@/assets/taxonomy/pillar-aerial.jpg";
import deltaArmImg from "@/assets/products/delta-robot.jpg";
import softGripperImg from "@/assets/products/soft-adaptive-gripper.jpg";

export const Route = createFileRoute("/solutions/agriculture-food-processing")(
  {
    head: () =>
      buildSeoMeta({
        title:
          "Smart Robotics from Soil to Shelf | Agriculture & Food Processing | INDUS",
        description:
          "Cut chemical waste by 80% in the field and achieve 100% FSSAI/FDA washdown hygiene on the processing line.",
        path: "/solutions/agriculture-food-processing",
      }),
    component: AgricultureFoodProcessingPage,
  },
);

interface HotspotItem {
  id: string;
  label: string;
  spec: string;
  xPercent: number;
  yPercent: number;
}

interface AnatomyCard {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  hotspots: HotspotItem[];
}

const ANATOMY_CARDS: AnatomyCard[] = [
  {
    id: "field-rovers-drones",
    title: "AI Field Rovers & Precision Drones",
    subtitle: "Autonomous scouting, targeted weeding & RTK-GPS traction",
    image: droneFieldImg,
    imageAlt:
      "Autonomous agricultural drone and precision field rover scanning crop rows",
    hotspots: [
      {
        id: "mast",
        label: "Top Mast: Multispectral & RGB-D Cameras",
        spec: "Identifies crop stress and distinguishes weeds from crops in milliseconds.",
        xPercent: 48,
        yPercent: 24,
      },
      {
        id: "undercarriage",
        label: "Undercarriage: Targeted Micro-Nozzles / Laser Weeder",
        spec: "Treats only the weed, reducing herbicide costs by up to 80%.",
        xPercent: 54,
        yPercent: 68,
      },
      {
        id: "drivetrain",
        label: "Drivetrain: All-Terrain Torque Wheels & RTK-GPS",
        spec: "Navigates muddy furrows with ±2 cm accuracy.",
        xPercent: 28,
        yPercent: 74,
      },
    ],
  },
  {
    id: "washdown-food-cobots",
    title: "Washdown-Grade Food Cobots & Delta Arms",
    subtitle: "IP69K stainless-steel hygiene at 150+ picks per minute",
    image: deltaArmImg,
    imageAlt:
      "High-speed stainless-steel Delta arm sorting fresh produce on a conveyor line",
    hotspots: [
      {
        id: "arm-body",
        label: "Arm Body: IP69K Sealed Stainless Steel",
        spec: "Survives high-pressure, high-temperature caustic washdowns without corrosion.",
        xPercent: 50,
        yPercent: 32,
      },
      {
        id: "eoat",
        label: "End-of-Arm Tooling: FDA-Grade Soft Silicone Gripper",
        spec: "Handles delicate berries, pastries, or raw poultry without bruising.",
        xPercent: 52,
        yPercent: 70,
      },
      {
        id: "overhead-vision",
        label: "Overhead Vision: 3D AI Optical Sorter",
        spec: "Detects size, ripeness, and defects at 150+ picks per minute.",
        xPercent: 26,
        yPercent: 28,
      },
    ],
  },
  {
    id: "harvesting-robots",
    title: "Autonomous Harvesting Bots",
    subtitle: "Gentle vision-guided picking for delicate fruits & vegetables",
    image: agriRoverImg,
    imageAlt:
      "Autonomous harvesting robot with stereo vision picking ripe produce in a greenhouse",
    hotspots: [
      {
        id: "stereo-head",
        label: "Stereo Vision Head: AI Ripeness Classifier",
        spec: "Evaluates color, firmness, and stem angle before picking.",
        xPercent: 45,
        yPercent: 28,
      },
      {
        id: "soft-cutter",
        label: "Soft-Touch Cutter: Pedicel Snipping & Suction Cup",
        spec: "Detaches fruit cleanly without touching or bruising the skin.",
        xPercent: 64,
        yPercent: 56,
      },
    ],
  },
];

const FARM_TO_FACTORY_STAGES = [
  {
    step: "01",
    title: "Precision Crop Care",
    description:
      "Drone/rover scans the plant and applies micro-nutrients or laser-targets weeds before canopy stress spreads.",
    badge: "80% Less Chemical",
    icon: Tractor,
  },
  {
    step: "02",
    title: "Autonomous Harvest",
    description:
      "Vision-guided arm evaluates color and firmness to pick only ripe produce with < 1.2% bruising.",
    badge: "96.5% Pick Accuracy",
    icon: Sprout,
  },
  {
    step: "03",
    title: "Hygienic Wash & Sort",
    description:
      "IP69K washdown cobot inspects and grades quality under high-pressure FSSAI/FDA sanitation cycles.",
    badge: "IP69K Washdown",
    icon: ShieldCheck,
  },
  {
    step: "04",
    title: "High-Speed Packaging",
    description:
      "Stainless-steel Delta robot packs trays at 150+ PPM ready for cold-chain dispatch.",
    badge: "150+ PPM Packing",
    icon: Factory,
  },
];

function AgricultureFoodProcessingPage() {
  const { openModal } = useModals();

  // 1. Seed-to-Shelf Split Slider & Mode Toggle
  const [heroMode, setHeroMode] = useState<"field" | "factory">("field");
  const [splitPercent, setSplitPercent] = useState<number>(52);

  // 2. X-Ray Robot Anatomy Hotspots
  const [activeHotspots, setActiveHotspots] = useState<Record<string, string>>({
    "field-rovers-drones": "mast",
    "washdown-food-cobots": "arm-body",
    "harvesting-robots": "stereo-head",
  });

  // 3. Farm-to-Factory Interactive Timeline Stage
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);

  // 4. Chemical & Labor Savings Calculator
  const [calcMode, setCalcMode] = useState<"farm" | "factory">("farm");
  const [scaleValue, setScaleValue] = useState<number>(250); // acres or tons/day
  const [workersOrCycles, setWorkersOrCycles] = useState<number>(18);

  const chemicalWaterSaved =
    calcMode === "farm"
      ? Math.min(82, Math.round(64 + (workersOrCycles / 40) * 18))
      : Math.min(58, Math.round(35 + (workersOrCycles / 40) * 20));

  const spoilageReduction =
    calcMode === "farm"
      ? Math.min(48, Math.round(24 + (scaleValue / 2000) * 22))
      : Math.min(62, Math.round(32 + (scaleValue / 200) * 28));

  const paybackMonths = Math.max(
    9,
    Math.min(
      24,
      Math.round(
        22 -
          (scaleValue / (calcMode === "farm" ? 2000 : 200)) * 7 -
          (workersOrCycles / 40) * 5,
      ),
    ),
  );

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-[#155EEF] selection:text-white">
      {/* 1. INTERACTIVE HERO: SPLIT-SCREEN "SEED-TO-SHELF" TOGGLE */}
      <section className="bg-[#0B1324] text-white border-b border-slate-800">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8 py-12 lg:py-18">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-6"
          >
            <Link to="/solutions" className="hover:text-white transition-colors">
              Solutions
            </Link>
            <ChevronRight size={14} />
            <span className="text-emerald-400">
              Agriculture & Food Processing
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300">
                <Leaf size={14} />
                <span>Seed-to-Shelf Automation</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.08]">
                Smart Robotics from Soil to Shelf
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                Cut chemical waste by 80% in the field and achieve 100%
                FSSAI/FDA washdown hygiene on the processing line.
              </p>

              {/* Live Environment Toggle */}
              <div className="inline-flex p-1 rounded-full bg-white/10 border border-white/15">
                <button
                  type="button"
                  onClick={() => {
                    setHeroMode("field");
                    setSplitPercent(78);
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    heroMode === "field"
                      ? "bg-emerald-500 text-slate-950 shadow-sm"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  Open Field Mode
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setHeroMode("factory");
                    setSplitPercent(22);
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    heroMode === "factory"
                      ? "bg-[#155EEF] text-white shadow-sm"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  Cleanroom Factory Mode
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Button
                  size="lg"
                  onClick={() => openModal("quote")}
                  className="rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-7 h-12 cursor-pointer"
                >
                  <span>Request Pilot Trial</span>
                  <ArrowRight size={16} className="ml-2" />
                </Button>
                <a
                  href="#roi-calculator"
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 hover:bg-white/10 px-6 h-12 text-sm font-semibold text-white transition-colors"
                >
                  <Calculator size={15} />
                  <span>Savings Calculator</span>
                </a>
              </div>
            </div>

            {/* Interactive Before/After Split-Screen Viewer */}
            <div className="lg:col-span-7 space-y-3">
              <div className="relative rounded-2xl overflow-hidden border border-white/15 shadow-2xl aspect-[16/10] bg-slate-900 select-none">
                {/* Base Layer: Cleanroom Factory View */}
                <img
                  src={softGripperImg}
                  alt="Stainless-steel robotic food gripper sorting produce on a hygienic line"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Factory HUD Overlay */}
                <div className="absolute top-4 right-4 rounded-xl bg-slate-950/85 border border-sky-400/40 px-3.5 py-2 text-xs backdrop-blur-xs">
                  <div className="font-bold text-sky-300 flex items-center gap-1.5">
                    <ShieldCheck size={14} />
                    <span>FACTORY MODE · IP69K</span>
                  </div>
                  <div className="text-slate-300 mt-0.5">
                    Grade A Sort · 152 PPM · FDA Soft Grip
                  </div>
                </div>

                {/* Clipped Overlay: Open Field View with Glowing Bounding Boxes */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: `inset(0 ${100 - splitPercent}% 0 0)` }}
                >
                  <img
                    src={agriRoverImg}
                    alt="Autonomous field rover scanning crops with AI vision"
                    className="absolute inset-0 w-full h-full object-cover"
                  />

                  {/* Glowing Green AI Vision Bounding Boxes */}
                  <div className="absolute left-[18%] top-[42%] w-24 h-20 rounded-md border-2 border-emerald-400 bg-emerald-400/10 shadow-[0_0_16px_rgba(52,211,153,0.55)] animate-pulse">
                    <span className=" -top-5 left-0 absolute rounded bg-emerald-500 px-1.5 py-0.5 text-[10px] font-bold text-slate-950">
                      CROP 99%
                    </span>
                  </div>
                  <div className="absolute left-[42%] top-[58%] w-20 h-16 rounded-md border-2 border-amber-400 bg-amber-400/15 shadow-[0_0_16px_rgba(251,191,36,0.55)]">
                    <span className="-top-5 left-0 absolute rounded bg-amber-400 px-1.5 py-0.5 text-[10px] font-bold text-slate-950">
                      WEED · LASER
                    </span>
                  </div>

                  <div className="absolute top-4 left-4 rounded-xl bg-slate-950/85 border border-emerald-400/40 px-3.5 py-2 text-xs backdrop-blur-xs">
                    <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                      <Scan size={14} />
                      <span>FIELD MODE · RTK-GPS ±2cm</span>
                    </div>
                    <div className="text-slate-300 mt-0.5">
                      -80% Herbicide · Micro-Spray Active
                    </div>
                  </div>
                </div>

                {/* Vertical Divider Handle */}
                <div
                  className="absolute inset-y-0 w-0.5 bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)] pointer-events-none"
                  style={{ left: `${splitPercent}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-8 rounded-full bg-white text-slate-900 font-bold text-xs flex items-center justify-center shadow-lg">
                    ⇄
                  </div>
                </div>
              </div>

              {/* Range Slider Control */}
              <div className="flex items-center gap-3 text-xs text-slate-400 px-1">
                <span className="font-semibold text-emerald-300 shrink-0">
                  Open Field
                </span>
                <input
                  type="range"
                  min={5}
                  max={95}
                  value={splitPercent}
                  onChange={(e) => setSplitPercent(Number(e.target.value))}
                  aria-label="Drag to compare Open Field Mode and Cleanroom Factory Mode"
                  className="w-full accent-emerald-400 cursor-pointer"
                />
                <span className="font-semibold text-sky-300 shrink-0">
                  Cleanroom Factory
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE HOTSPOTS: "X-RAY" ROBOT ANATOMY CARDS */}
      <section className="bg-white py-16 lg:py-24 border-b border-slate-200">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#155EEF]">
              Interactive X-Ray Anatomy
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Click any pulsing hotspot to inspect subsystem specs
            </h2>
            <p className="text-base text-slate-600">
              Explore the sensors, washdown seals, and soft-touch end-of-arm
              tooling engineered for farms, greenhouses, and food plants.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
            {ANATOMY_CARDS.map((card) => {
              const selectedHotspotId = activeHotspots[card.id];
              const activeHotspot =
                card.hotspots.find((h) => h.id === selectedHotspotId) ??
                card.hotspots[0];

              return (
                <article
                  key={card.id}
                  id={card.id}
                  className="rounded-2xl border border-slate-200 bg-[#F8FAFC] overflow-hidden shadow-xs flex flex-col justify-between"
                >
                  <div>
                    {/* Image with Pulsing + Hotspots */}
                    <div className="relative aspect-[16/11] bg-slate-900 overflow-hidden">
                      <img
                        src={card.image}
                        alt={card.imageAlt}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-slate-950/20" />

                      {card.hotspots.map((hotspot) => {
                        const isSelected = hotspot.id === activeHotspot.id;
                        return (
                          <button
                            key={hotspot.id}
                            type="button"
                            onClick={() =>
                              setActiveHotspots((prev) => ({
                                ...prev,
                                [card.id]: hotspot.id,
                              }))
                            }
                            onMouseEnter={() =>
                              setActiveHotspots((prev) => ({
                                ...prev,
                                [card.id]: hotspot.id,
                              }))
                            }
                            aria-label={hotspot.label}
                            style={{
                              left: `${hotspot.xPercent}%`,
                              top: `${hotspot.yPercent}%`,
                            }}
                            className={`absolute -translate-x-1/2 -translate-y-1/2 size-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                              isSelected
                                ? "bg-[#155EEF] text-white scale-110 ring-4 ring-white/70 shadow-lg"
                                : "bg-white/95 text-slate-900 hover:bg-[#155EEF] hover:text-white ring-4 ring-white/40"
                            }`}
                          >
                            <Plus size={16} />
                          </button>
                        );
                      })}
                    </div>

                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">
                          {card.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                          {card.subtitle}
                        </p>
                      </div>

                      {/* Hotspot Selector Pills */}
                      <div className="flex flex-wrap gap-1.5">
                        {card.hotspots.map((hotspot, i) => {
                          const isSelected = hotspot.id === activeHotspot.id;
                          return (
                            <button
                              key={hotspot.id}
                              type="button"
                              onClick={() =>
                                setActiveHotspots((prev) => ({
                                  ...prev,
                                  [card.id]: hotspot.id,
                                }))
                              }
                              className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition-colors cursor-pointer ${
                                isSelected
                                  ? "bg-[#155EEF] text-white"
                                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                              }`}
                            >
                              Hotspot 0{i + 1}
                            </button>
                          );
                        })}
                      </div>

                      {/* Active Hotspot Spec Tooltip Box */}
                      <div className="rounded-xl border border-blue-200 bg-white p-4 shadow-2xs">
                        <div className="text-xs font-bold text-[#155EEF]">
                          {activeHotspot.label}
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed">
                          {activeHotspot.spec}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE "FARM-TO-FACTORY" TIMELINE */}
      <section className="bg-[#F8FAFC] py-16 lg:py-20 border-b border-slate-200">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Farm-to-Factory Pathway
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Follow the produce journey across 4 automated stages
            </h2>
            <p className="text-base text-slate-600">
              Click any stage below to trace how autonomous robotics protects
              crop quality from field scouting to cold-chain tray dispatch.
            </p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-4 gap-5">
            {FARM_TO_FACTORY_STAGES.map((stage, idx) => {
              const Icon = stage.icon;
              const isActive = idx === activeStageIndex;
              return (
                <button
                  key={stage.step}
                  type="button"
                  onClick={() => setActiveStageIndex(idx)}
                  className={`text-left rounded-2xl p-6 border transition-all cursor-pointer flex flex-col justify-between ${
                    isActive
                      ? "bg-white border-emerald-500 ring-2 ring-emerald-500/20 shadow-md"
                      : "bg-white/80 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`size-10 rounded-xl flex items-center justify-center ${
                          isActive
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <Icon size={20} />
                      </span>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                        {stage.badge}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-400">
                      STAGE {stage.step}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">
                      {stage.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed mt-2">
                      {stage.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE WIDGET: CHEMICAL & LABOR SAVINGS CALCULATOR */}
      <section id="roi-calculator" className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-[#F8FAFC] p-7 sm:p-10 lg:p-12 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Sliders */}
              <div className="lg:col-span-6 space-y-6">
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#155EEF]">
                    Interactive ROI Estimator
                  </span>
                  <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                    Chemical & Labor Savings Calculator
                  </h2>
                  <p className="text-sm text-slate-600">
                    Adjust your operation scale to estimate chemical/water
                    savings, spoilage reduction, and payback period.
                  </p>
                </div>

                {/* Farm vs Processing Plant Switch */}
                <div className="inline-flex p-1 rounded-full bg-slate-200/80">
                  <button
                    type="button"
                    onClick={() => {
                      setCalcMode("farm");
                      setScaleValue(250);
                    }}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      calcMode === "farm"
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-600"
                    }`}
                  >
                    Farm Acreage
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCalcMode("factory");
                      setScaleValue(45);
                    }}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      calcMode === "factory"
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-600"
                    }`}
                  >
                    Daily Food Tonnage
                  </button>
                </div>

                {/* Slider 1 */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-semibold text-slate-800">
                    <span>
                      {calcMode === "farm"
                        ? "Farm Acreage"
                        : "Daily Food Processing Tonnage"}
                    </span>
                    <span className="text-[#155EEF] font-bold">
                      {scaleValue}{" "}
                      {calcMode === "farm" ? "acres" : "tons / day"}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={calcMode === "farm" ? 25 : 5}
                    max={calcMode === "farm" ? 2000 : 200}
                    value={scaleValue}
                    onChange={(e) => setScaleValue(Number(e.target.value))}
                    className="w-full accent-[#155EEF] cursor-pointer"
                  />
                </div>

                {/* Slider 2 */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-semibold text-slate-800">
                    <span>Current Manual Workers / Spraying Cycles</span>
                    <span className="text-[#155EEF] font-bold">
                      {workersOrCycles}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={4}
                    max={40}
                    value={workersOrCycles}
                    onChange={(e) =>
                      setWorkersOrCycles(Number(e.target.value))
                    }
                    className="w-full accent-[#155EEF] cursor-pointer"
                  />
                </div>
              </div>

              {/* Right Animated Output Gauges */}
              <div className="lg:col-span-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-2xl bg-[#0B1324] text-white p-5 text-center">
                    <Droplets
                      size={22}
                      className="mx-auto text-emerald-400 mb-2"
                    />
                    <div className="text-3xl font-bold text-emerald-400">
                      {chemicalWaterSaved}%
                    </div>
                    <div className="text-xs text-slate-300 mt-1">
                      Annual Herbicide / Water Saved
                    </div>
                  </div>

                  <div className="rounded-2xl bg-[#0B1324] text-white p-5 text-center">
                    <Sparkles size={22} className="mx-auto text-sky-400 mb-2" />
                    <div className="text-3xl font-bold text-sky-400">
                      {spoilageReduction}%
                    </div>
                    <div className="text-xs text-slate-300 mt-1">
                      Spoilage & Bruising Reduction
                    </div>
                  </div>

                  <div className="rounded-2xl bg-[#0B1324] text-white p-5 text-center">
                    <Timer size={22} className="mx-auto text-amber-400 mb-2" />
                    <div className="text-3xl font-bold text-amber-400">
                      {paybackMonths} Mo
                    </div>
                    <div className="text-xs text-slate-300 mt-1">
                      Estimated Payback Period
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2
                      size={18}
                      className="text-emerald-600 shrink-0 mt-0.5"
                    />
                    <p className="text-xs sm:text-sm text-slate-600">
                      Ready to validate these numbers on your farm or food
                      line? Schedule a seasonal pilot assessment.
                    </p>
                  </div>
                  <Button
                    onClick={() => openModal("quote")}
                    className="rounded-full bg-[#155EEF] hover:bg-[#1047BF] text-white font-semibold px-6 shrink-0 cursor-pointer"
                  >
                    Get Custom ROI Report
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FloatingEngineerCta />
    </div>
  );
}
