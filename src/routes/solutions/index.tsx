import React, { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Compass,
  Cpu,
  GitCompare,
  Search,
  Sparkles,
  Wrench,
  X,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModals } from "@/components/modals/ModalContext";
import { buildSeoMeta } from "@/lib/seo";
import { FloatingEngineerCta } from "@/components/solutions/FloatingEngineerCta";

import mfgAutoImg from "@/assets/solution-manufacturing-auto.jpg";
import weldingImg from "@/assets/products/welding-robot.jpg";
import cobotImg from "@/assets/products/cobot-robot.jpg";
import scaraImg from "@/assets/products/scara-robot.jpg";
import warehouseImg from "@/assets/solution-warehouse-logistics.jpg";
import amrImg from "@/assets/hero/hero-amr-fleet.jpg";
import forkliftImg from "@/assets/taxonomy/pillar-logistics.jpg";
import palletizerImg from "@/assets/products/palletizing-robot.jpg";
import healthcareImg from "@/assets/solution-healthcare-robot.jpg";
import agricultureImg from "@/assets/solution-agriculture-robot.jpg";
import droneImg from "@/assets/taxonomy/pillar-aerial.jpg";
import deltaImg from "@/assets/products/delta-robot.jpg";
import hospitalityImg from "@/assets/solution-hospitality-robot.jpg";

export const Route = createFileRoute("/solutions/")({
  head: () =>
    buildSeoMeta({
      title: "Explore All Robotics Solutions | INDUS Robotics",
      description:
        "Filter our complete portfolio of 15 industrial, mobile, and service robotics systems by industry, payload, or application.",
      path: "/solutions",
    }),
  component: SolutionsCatalogPage,
});

type IndustryFilterId =
  | "all"
  | "manufacturing"
  | "warehousing"
  | "healthcare"
  | "agriculture"
  | "hospitality";

type AppTag =
  | "Pick & Place"
  | "Autonomous Navigation"
  | "Hygiene & Sterilization"
  | "Heavy Lifting";

interface RobotSolutionCard {
  id: string;
  name: string;
  industryId: Exclude<IndustryFilterId, "all">;
  industryBadge: string;
  summary: string;
  specChips: [string, string];
  tags: AppTag[];
  keywords: string;
  href: string;
  image: string;
}

const ALL_15_ROBOTS: RobotSolutionCard[] = [
  // Manufacturing & Automotive (3)
  {
    id: "6-axis-articulated-robots",
    name: "6-Axis Articulated Robots",
    industryId: "manufacturing",
    industryBadge: "Manufacturing",
    summary: "Heavy-duty welding, painting, and material handling.",
    specChips: ["Payload: 20 – 500 kg", "Repeatability: ±0.03 mm"],
    tags: ["Heavy Lifting"],
    keywords: "welding spot arc spray painting press tending automotive heavy",
    href: "/solutions/manufacturing-automotive#6-axis-articulated-robots",
    image: weldingImg,
  },
  {
    id: "collaborative-robots",
    name: "Collaborative Robots (Cobots)",
    industryId: "manufacturing",
    industryBadge: "Manufacturing",
    summary:
      "Safe, cage-free human-robot assembly, screwdriving, and CNC machine tending.",
    specChips: ["Payload: 5 – 25 kg", "ISO/TS 15066 Safe"],
    tags: ["Pick & Place"],
    keywords: "cobot cnc tending screwdriving gluing assembly inspection",
    href: "/solutions/manufacturing-automotive#collaborative-robots",
    image: cobotImg,
  },
  {
    id: "scara-delta-robots",
    name: "SCARA & Delta Robots",
    industryId: "manufacturing",
    industryBadge: "Manufacturing",
    summary:
      "High-speed pick-and-place sorting and precision electronics packaging.",
    specChips: ["Speed: 150+ PPM", "Repeatability: ±0.01 mm"],
    tags: ["Pick & Place"],
    keywords: "scara delta pick and place pcb electronics packaging sorting",
    href: "/solutions/manufacturing-automotive#scara-delta-robots",
    image: scaraImg,
  },

  // Warehousing & Logistics (3)
  {
    id: "autonomous-mobile-robots",
    name: "Autonomous Mobile Robots (AMRs)",
    industryId: "warehousing",
    industryBadge: "Warehousing",
    summary:
      'Smart, self-navigating carts for "goods-to-person" order picking.',
    specChips: ["Payload: Up to 1,500 kg", "LiDAR SLAM"],
    tags: ["Autonomous Navigation"],
    keywords: "amr goods to person order picking warehouse ecommerce fulfillment",
    href: "/solutions/warehousing-ecommerce-logistics#autonomous-mobile-robots",
    image: amrImg,
  },
  {
    id: "autonomous-forklifts-agvs",
    name: "Autonomous Forklifts & AGVs",
    industryId: "warehousing",
    industryBadge: "Warehousing",
    summary: "Unmanned heavy pallet transport across warehouse floors.",
    specChips: ["Payload: Up to 2,500 kg", "Lift: 8.5 m"],
    tags: ["Autonomous Navigation", "Heavy Lifting"],
    keywords: "forklift agv pallet transport racking cold storage warehouse",
    href: "/solutions/warehousing-ecommerce-logistics#autonomous-forklifts-agvs",
    image: forkliftImg,
  },
  {
    id: "robotic-palletizers",
    name: "Robotic Palletizers",
    industryId: "warehousing",
    industryBadge: "Warehousing",
    summary: "Vision-guided arms for automated box stacking and unloading.",
    specChips: ["Up to 1,080 cases/hr", "3D AI Vision"],
    tags: ["Pick & Place", "Heavy Lifting"],
    keywords: "palletizer depalletizer box stacking vacuum gripper 3d vision",
    href: "/solutions/warehousing-ecommerce-logistics#robotic-palletizers",
    image: palletizerImg,
  },

  // Healthcare & Pharmaceuticals (3)
  {
    id: "uvc-disinfection-robots",
    name: "UV-C Disinfection Robots",
    industryId: "healthcare",
    industryBadge: "Healthcare",
    summary:
      "Chemical-free, autonomous room sterilization for hospitals and labs.",
    specChips: ["254 nm UV-C", "99.99% Kill Rate"],
    tags: ["Hygiene & Sterilization", "Autonomous Navigation"],
    keywords: "uvc disinfection sterilization hospital icu operating room",
    href: "/solutions/healthcare-pharmaceuticals#uvc-disinfection-robots",
    image: healthcareImg,
  },
  {
    id: "hospital-delivery-bots",
    name: "Hospital Delivery Bots",
    industryId: "healthcare",
    industryBadge: "Healthcare",
    summary:
      "Secure, locked mobile couriers for medicines, lab samples, and supplies.",
    specChips: ["RFID Locked Bays", "Elevator Integrated"],
    tags: ["Autonomous Navigation", "Hygiene & Sterilization"],
    keywords: "hospital delivery pharmacy courier medicine lab samples",
    href: "/solutions/healthcare-pharmaceuticals#hospital-delivery-bots",
    image: hospitalityImg,
  },
  {
    id: "lab-automation-arms",
    name: "Lab Automation Arms",
    industryId: "healthcare",
    industryBadge: "Healthcare",
    summary:
      "High-precision desktop arms for automated testing and sample sorting.",
    specChips: ["Repeatability: ±0.015 mm", "ISO Class 4"],
    tags: ["Pick & Place", "Hygiene & Sterilization"],
    keywords: "lab automation pipetting pcr diagnostic sample sorting pharma",
    href: "/solutions/healthcare-pharmaceuticals#lab-automation-arms",
    image: mfgAutoImg,
  },

  // Agriculture & Food Processing (3)
  {
    id: "field-rovers-drones",
    name: "Field Rovers & Drones",
    industryId: "agriculture",
    industryBadge: "Agriculture",
    summary:
      "AI-guided precision spraying, weed removal, and crop monitoring.",
    specChips: ["RTK-GPS: ±2 cm", "-80% Herbicide"],
    tags: ["Autonomous Navigation"],
    keywords: "field rover drone spraying weeding crop monitoring agriculture",
    href: "/solutions/agriculture-food-processing#field-rovers-drones",
    image: droneImg,
  },
  {
    id: "washdown-food-cobots",
    name: "Washdown Food Cobots",
    industryId: "agriculture",
    industryBadge: "Agriculture & Food",
    summary:
      "Waterproof, hygienic stainless-steel arms for food sorting and packaging.",
    specChips: ["IP69K Stainless", "FDA Soft Gripper"],
    tags: ["Hygiene & Sterilization", "Pick & Place"],
    keywords: "washdown food cobot ip69k stainless packaging dairy",
    href: "/solutions/agriculture-food-processing#washdown-food-cobots",
    image: deltaImg,
  },
  {
    id: "harvesting-robots",
    name: "Harvesting Robots",
    industryId: "agriculture",
    industryBadge: "Agriculture",
    summary:
      "Vision-guided arms for picking delicate fruits and vegetables.",
    specChips: ["Ripeness AI Vision", "< 1.2% Bruising"],
    tags: ["Pick & Place"],
    keywords: "harvesting fruit vegetable greenhouse picking soft gripper",
    href: "/solutions/agriculture-food-processing#harvesting-robots",
    image: agricultureImg,
  },

  // Hospitality, Retail & Facility Management (3)
  {
    id: "autonomous-floor-scrubbers",
    name: "Autonomous Floor Scrubbers",
    industryId: "hospitality",
    industryBadge: "Hospitality & Facilities",
    summary:
      "Self-navigating commercial cleaners for malls, airports, and offices.",
    specChips: ["3,200 m²/hr", "Auto-Drain Dock"],
    tags: ["Autonomous Navigation", "Hygiene & Sterilization"],
    keywords: "floor cleaning scrubber vacuum mall airport office commercial",
    href: "/solutions/hospitality-retail-facility-management#autonomous-floor-scrubbers",
    image: hospitalityImg,
  },
  {
    id: "service-delivery-bots",
    name: "Service & Delivery Bots",
    industryId: "hospitality",
    industryBadge: "Hospitality",
    summary:
      "Tray-based food runners for restaurants and room-service bots for hotels.",
    specChips: ["Payload: 40 kg", "Elevator Sync"],
    tags: ["Autonomous Navigation"],
    keywords: "restaurant food runner hotel room service concierge delivery",
    href: "/solutions/hospitality-retail-facility-management#service-delivery-bots",
    image: warehouseImg,
  },
  {
    id: "inventory-security-patrol-bots",
    name: "Inventory & Security Patrol Bots",
    industryId: "hospitality",
    industryBadge: "Retail & Security",
    summary:
      "Autonomous rovers for retail shelf scanning and 24/7 perimeter security.",
    specChips: ["UHF RFID + Thermal", "24/7 Patrol"],
    tags: ["Autonomous Navigation"],
    keywords: "retail inventory shelf scan rfid security patrol thermal",
    href: "/solutions/hospitality-retail-facility-management#inventory-security-patrol-bots",
    image: amrImg,
  },
];

const INDUSTRY_TABS: { id: IndustryFilterId; label: string }[] = [
  { id: "all", label: "All Solutions (15)" },
  { id: "manufacturing", label: "Manufacturing & Automotive (3)" },
  { id: "warehousing", label: "Warehousing & Logistics (3)" },
  { id: "healthcare", label: "Healthcare & Pharma (3)" },
  { id: "agriculture", label: "Agriculture & Food (3)" },
  { id: "hospitality", label: "Hospitality & Facilities (3)" },
];

const SECONDARY_TAGS: AppTag[] = [
  "Pick & Place",
  "Autonomous Navigation",
  "Hygiene & Sterilization",
  "Heavy Lifting",
];

const TURNKEY_PILLARS = [
  {
    title: "Custom End-of-Arm Tooling (EOAT)",
    description:
      "Grippers, sensors, and vision systems tailored to your exact product.",
    icon: Wrench,
  },
  {
    title: "3D Simulation & Digital Twin",
    description: "Validate ROI and cycle times before installation.",
    icon: Cpu,
  },
  {
    title: "Pan-India Installation & AMC",
    description: "On-site deployment, operator training, and 24/7 support.",
    icon: ShieldCheck,
  },
];

function SolutionsCatalogPage() {
  const { openModal } = useModals();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeIndustry, setActiveIndustry] =
    useState<IndustryFilterId>("all");
  const [activeTag, setActiveTag] = useState<AppTag | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Robot Matcher State
  const [automateGoal, setAutomateGoal] = useState("Factory Assembly");
  const [priorityGoal, setPriorityGoal] = useState("Faster Speed");
  const [matchedIds, setMatchedIds] = useState<string[]>([]);

  const filteredRobots = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return ALL_15_ROBOTS.filter((robot) => {
      const matchIndustry =
        activeIndustry === "all" || robot.industryId === activeIndustry;
      const matchTag = !activeTag || robot.tags.includes(activeTag);
      const matchQuery =
        !q ||
        robot.name.toLowerCase().includes(q) ||
        robot.summary.toLowerCase().includes(q) ||
        robot.industryBadge.toLowerCase().includes(q) ||
        robot.keywords.toLowerCase().includes(q);
      return matchIndustry && matchTag && matchQuery;
    });
  }, [searchQuery, activeIndustry, activeTag]);

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (prev.length >= 3) return [...prev.slice(1), id];
      return [...prev, id];
    });
  };

  const handleBestMatch = () => {
    setActiveIndustry("all");
    setActiveTag(null);
    setSearchQuery("");

    let picks: string[] = [];
    if (automateGoal === "Factory Assembly") {
      picks =
        priorityGoal === "Heavy Lifting"
          ? ["6-axis-articulated-robots", "collaborative-robots"]
          : ["scara-delta-robots", "collaborative-robots"];
    } else if (automateGoal === "Warehouse Transport") {
      picks =
        priorityGoal === "Heavy Lifting"
          ? ["autonomous-forklifts-agvs", "robotic-palletizers"]
          : ["autonomous-mobile-robots", "robotic-palletizers"];
    } else if (automateGoal === "Hospital Sterilization") {
      picks =
        priorityGoal === "Strict Hygiene"
          ? ["uvc-disinfection-robots", "lab-automation-arms"]
          : ["hospital-delivery-bots", "uvc-disinfection-robots"];
    } else if (automateGoal === "Farm & Food") {
      picks =
        priorityGoal === "Strict Hygiene"
          ? ["washdown-food-cobots", "harvesting-robots"]
          : ["field-rovers-drones", "harvesting-robots"];
    } else {
      picks =
        priorityGoal === "Strict Hygiene"
          ? ["autonomous-floor-scrubbers", "service-delivery-bots"]
          : ["service-delivery-bots", "inventory-security-patrol-bots"];
    }

    setMatchedIds(picks);
    const el = document.getElementById(picks[0]);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const renderCard = (robot: RobotSolutionCard) => {
    const isCompared = compareIds.includes(robot.id);
    const isBestMatch = matchedIds.includes(robot.id);

    return (
      <article
        key={robot.id}
        id={robot.id}
        className={`group rounded-2xl border bg-white overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between ${
          isBestMatch
            ? "border-[#155EEF] ring-2 ring-[#155EEF]/30"
            : "border-slate-200"
        }`}
      >
        <div>
          {/* Top Visual + Industry Badge */}
          <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
            <img
              src={robot.image}
              alt={robot.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute top-3 left-3 rounded-full bg-blue-50/95 border border-blue-200 px-3 py-1 text-[11px] font-bold text-[#155EEF] backdrop-blur-xs">
              {robot.industryBadge}
            </span>
            {isBestMatch && (
              <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-[#155EEF] px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
                <Sparkles size={11} />
                <span>Best Match</span>
              </span>
            )}
          </div>

          {/* Content */}
          <div className="p-5 space-y-3">
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#155EEF] transition-colors">
              {robot.name}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {robot.summary}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {robot.specChips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between gap-2">
          <Link
            to={robot.href as never}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#155EEF] hover:text-[#1047BF] transition-colors group/link"
          >
            <span>Read More</span>
            <ArrowRight
              size={14}
              className="transition-transform duration-150 group-hover/link:translate-x-0.5"
            />
          </Link>

          <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isCompared}
              onChange={() => toggleCompare(robot.id)}
              className="size-3.5 rounded border-slate-300 text-[#155EEF] accent-[#155EEF] cursor-pointer"
            />
            <span>Compare</span>
          </label>
        </div>
      </article>
    );
  };

  const firstBatch = filteredRobots.slice(0, 6);
  const secondBatch = filteredRobots.slice(6);
  const comparedRobots = ALL_15_ROBOTS.filter((r) => compareIds.includes(r.id));

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-[#155EEF] selection:text-white">
      {/* SECTION 1: COMPACT HERO BANNER + LIVE SEARCH BAR */}
      <section className="bg-gradient-to-b from-blue-50/70 via-white to-white py-10 lg:py-14">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900">
            Explore All Robotics Solutions
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Filter our complete portfolio of 15 industrial, mobile, and service
            robotics systems by industry, payload, or application.
          </p>

          {/* Live Search Bar */}
          <div className="mx-auto max-w-2xl pt-2">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search by task, e.g., "welding", "palletizing", "floor cleaning", "disinfection"...'
                className="w-full rounded-full border border-slate-300 bg-white pl-11 pr-10 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-xs focus:border-[#155EEF] focus:outline-none focus:ring-2 focus:ring-[#155EEF]/20"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: STICKY INTERACTIVE FILTER BAR */}
      <section className="sticky top-16 lg:top-20 z-30 bg-white/95 backdrop-blur-md border-y border-slate-200 py-3.5">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8 space-y-2.5">
          {/* Primary Industry Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {INDUSTRY_TABS.map((tab) => {
              const isActive = activeIndustry === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveIndustry(tab.id)}
                  className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer border ${
                    isActive
                      ? "bg-[#155EEF] text-white border-[#155EEF] shadow-2xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Secondary Application Tags */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">
                Filter by Capability:
              </span>
              {SECONDARY_TAGS.map((tag) => {
                const isSelected = activeTag === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setActiveTag(isSelected ? null : tag)}
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-colors cursor-pointer border ${
                      isSelected
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>

            {compareIds.length > 0 && (
              <button
                type="button"
                onClick={() => setShowCompareModal(true)}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#155EEF] text-white px-3.5 py-1 text-xs font-bold shadow-xs cursor-pointer"
              >
                <GitCompare size={13} />
                <span>Compare Selected ({compareIds.length})</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 3 & 4: 15-SOLUTION FILTERABLE GRID + MID-PAGE ROBOT MATCHER */}
      <section className="bg-[#F8FAFC] py-12 lg:py-16">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8 space-y-12">
          {filteredRobots.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center space-y-3">
              <p className="text-lg font-bold text-slate-900">
                No robot solutions matched your filter
              </p>
              <p className="text-sm text-slate-600">
                Try clearing your search term or switching back to All Solutions.
              </p>
              <Button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveIndustry("all");
                  setActiveTag(null);
                }}
                className="rounded-full bg-[#155EEF] text-white cursor-pointer"
              >
                Reset All Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {firstBatch.map(renderCard)}
              </div>

              {/* SECTION 4: INTERACTIVE "NOT SURE WHERE TO START?" ROBOT MATCHER */}
              <div className="rounded-3xl border border-blue-200 bg-blue-50/80 p-7 sm:p-9 shadow-2xs">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
                  <div className="lg:col-span-4 space-y-2">
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#155EEF]">
                      <Compass size={14} />
                      <span>Not Sure Where to Start?</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      2-Click Robot Matcher
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600">
                      Pick your goal and top priority to highlight the 2 best-fit
                      robots.
                    </p>
                  </div>

                  <div className="lg:col-span-3">
                    <label
                      htmlFor="matcher-goal"
                      className="block text-xs font-bold text-slate-700 mb-1.5"
                    >
                      I want to automate...
                    </label>
                    <select
                      id="matcher-goal"
                      value={automateGoal}
                      onChange={(e) => setAutomateGoal(e.target.value)}
                      className="w-full rounded-xl border border-blue-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-[#155EEF] focus:outline-none"
                    >
                      <option value="Factory Assembly">Factory Assembly</option>
                      <option value="Warehouse Transport">
                        Warehouse Transport
                      </option>
                      <option value="Hospital Sterilization">
                        Hospital Sterilization
                      </option>
                      <option value="Farm & Food">Farm & Food</option>
                      <option value="Commercial Cleaning">
                        Commercial Cleaning
                      </option>
                    </select>
                  </div>

                  <div className="lg:col-span-3">
                    <label
                      htmlFor="matcher-priority"
                      className="block text-xs font-bold text-slate-700 mb-1.5"
                    >
                      My top priority is...
                    </label>
                    <select
                      id="matcher-priority"
                      value={priorityGoal}
                      onChange={(e) => setPriorityGoal(e.target.value)}
                      className="w-full rounded-xl border border-blue-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-[#155EEF] focus:outline-none"
                    >
                      <option value="Faster Speed">Faster Speed</option>
                      <option value="Lower Labor Cost">Lower Labor Cost</option>
                      <option value="Strict Hygiene">Strict Hygiene</option>
                      <option value="Heavy Lifting">Heavy Lifting</option>
                    </select>
                  </div>

                  <div className="lg:col-span-2">
                    <Button
                      type="button"
                      onClick={handleBestMatch}
                      className="w-full rounded-xl bg-[#155EEF] hover:bg-[#1047BF] text-white font-bold h-11 text-xs sm:text-sm cursor-pointer"
                    >
                      Show My Best Match
                    </Button>
                  </div>
                </div>
              </div>

              {secondBatch.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {secondBatch.map(renderCard)}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* SECTION 5: TURNKEY ENGINEERING & INTEGRATION BANNER */}
      <section className="border-t border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#155EEF]">
                End-to-End Delivery
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
                Complete turnkey engineering—not just hardware
              </h2>
            </div>
            <Button
              size="lg"
              onClick={() => openModal("quote")}
              className="rounded-full bg-[#155EEF] hover:bg-[#1047BF] text-white font-bold px-8 h-12 text-sm shadow-sm cursor-pointer shrink-0 self-start md:self-auto"
            >
              GET A QUOTE
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TURNKEY_PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 space-y-3"
                >
                  <div className="size-10 rounded-xl bg-blue-50 text-[#155EEF] flex items-center justify-center">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SIDE-BY-SIDE COMPARE MODAL */}
      {showCompareModal && comparedRobots.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-4xl rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <GitCompare size={18} className="text-[#155EEF]" />
                <span>Side-by-Side Robot Comparison</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowCompareModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 max-h-[75vh] overflow-y-auto">
              {comparedRobots.map((robot) => (
                <div
                  key={robot.id}
                  className="rounded-xl border border-slate-200 p-4 space-y-3 bg-[#F8FAFC]"
                >
                  <span className="inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-[#155EEF]">
                    {robot.industryBadge}
                  </span>
                  <h4 className="font-bold text-slate-900">{robot.name}</h4>
                  <p className="text-xs text-slate-600">{robot.summary}</p>
                  <div className="space-y-1.5 pt-2 border-t border-slate-200">
                    {robot.specChips.map((chip) => (
                      <div
                        key={chip}
                        className="flex items-center gap-1.5 text-xs font-semibold text-slate-800"
                      >
                        <Check size={13} className="text-[#155EEF]" />
                        <span>{chip}</span>
                      </div>
                    ))}
                  </div>
                  <Link
                    to={robot.href as never}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#155EEF] pt-2"
                  >
                    <span>Open Full Page</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <FloatingEngineerCta />
    </div>
  );
}
