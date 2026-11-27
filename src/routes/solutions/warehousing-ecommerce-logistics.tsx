import React, { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowDown,
  ArrowRight,
  BatteryCharging,
  Boxes,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  Cpu,
  Footprints,
  Layers,
  Mail,
  MapPin,
  Network,
  Phone,
  Radar,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Warehouse,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { companyConfig } from "@/data/config";
import { buildSeoMeta } from "@/lib/seo";
import { trackDigitalPresence } from "@/trackDigitalPresence";
import { FloatingEngineerCta } from "@/components/solutions/FloatingEngineerCta";

import heroWarehouseImg from "@/assets/solution-warehouse-logistics.jpg";
import amrFleetImg from "@/assets/hero/hero-amr-fleet.jpg";
import forkliftAgvImg from "@/assets/taxonomy/pillar-logistics.jpg";
import palletizerImg from "@/assets/products/palletizing-robot.jpg";

export const Route = createFileRoute(
  "/solutions/warehousing-ecommerce-logistics",
)({
  head: () =>
    buildSeoMeta({
      title:
        "Intelligent Robotics for Warehousing & Logistics | INDUS Robotics",
      description:
        "Accelerate order fulfillment, eliminate heavy-lifting injuries, and maximize storage throughput with autonomous mobile fleets and vision-guided palletizing.",
      path: "/solutions/warehousing-ecommerce-logistics",
    }),
  component: WarehousingLogisticsPage,
});

interface WarehouseRobotBlock {
  id: string;
  name: string;
  tagline: string;
  description: string;
  applications: string[];
  buttonLabel: string;
  image: string;
  imageAlt: string;
  toolingBadge: string;
  safetyFeatures: string[];
  specs: { label: string; value: string }[];
  compliance: string;
  defaultRequirement: string;
}

const TRUST_METRICS = [
  {
    value: "Up to 3x",
    label: "Faster Order Picking",
    icon: Zap,
  },
  {
    value: "70%",
    label: "Less Worker Walking Time",
    icon: Footprints,
  },
  {
    value: "Zero",
    label: "Floor Infrastructure Changes",
    icon: Layers,
  },
  {
    value: "24/7",
    label: "Multi-Shift Uptime",
    icon: Clock,
  },
];

const CORE_ROBOT_BLOCKS: WarehouseRobotBlock[] = [
  {
    id: "autonomous-mobile-robots",
    name: "Autonomous Mobile Robots (AMRs)",
    tagline: 'Smart "Goods-to-Person" Fulfillment',
    description:
      "Equipped with 3D LiDAR and SLAM navigation, our AMRs map your warehouse dynamically, reroute around people and obstacles in real time, and bring racks or totes directly to packing stations.",
    applications: [
      "Goods-to-Person E-Commerce Order Picking",
      "Automated Sortation & Cross-Docking",
      "Dynamic Inventory Transport Between Zones",
    ],
    buttonLabel: "View Fleet Specs & ROI",
    image: amrFleetImg,
    imageAlt:
      "Autonomous mobile robots navigating warehouse aisles with inventory pods",
    toolingBadge: "3D LiDAR SLAM + Dynamic Pod Lift",
    safetyFeatures: [
      "360° Dual Safety LiDAR",
      "3D Obstacle Avoidance",
      "Wrap-Around E-Stop Bumper",
    ],
    specs: [
      { label: "Payload Capacity", value: "300 kg – 1,500 kg" },
      { label: "Max Travel Speed", value: "2.0 m/s (Unloaded)" },
      { label: "Navigation", value: "3D LiDAR + Visual SLAM (No Tape)" },
      { label: "Battery & Charging", value: "8–10 hrs (15-min Auto-Dock)" },
      { label: "Min. Aisle Width", value: "1,100 mm" },
      { label: "WMS / Fleet API", value: "REST API • VDA 5050 • SAP/Manhattan" },
    ],
    compliance: "ISO 3691-4 • ANSI/RIA R15.08 • CE",
    defaultRequirement: "Goods-to-Person AMRs",
  },
  {
    id: "autonomous-forklifts-agvs",
    name: "Autonomous Forklifts & AGVs",
    tagline: "Unmanned Heavy Pallet Transport",
    description:
      "Engineered for continuous horizontal transport and high-bay stacking, our driverless forklifts and AGVs move heavy pallets safely across warehouses and cold-storage facilities without human error.",
    applications: [
      "Dock-to-Stock & High-Bay Racking Transport",
      "Raw Material Feeding to Production Lines",
      "Cold-Storage & Multi-Shift Pallet Movement",
    ],
    buttonLabel: "View Payload Specs",
    image: forkliftAgvImg,
    imageAlt:
      "Autonomous heavy-duty warehouse logistics robot and AGV transporting pallets",
    toolingBadge: "3D Fork-Tip Vision + Heavy Pallet Lift",
    safetyFeatures: [
      "3x Safety Laser Scanners",
      "Load-Backrest Sensors",
      "Audible & Blue-Spot Warning",
    ],
    specs: [
      { label: "Load Capacity", value: "1,400 kg – 2,500 kg" },
      { label: "Max Lift Height", value: "Up to 8,500 mm" },
      { label: "Positioning Accuracy", value: "±10 mm" },
      { label: "Cold-Storage Rating", value: "-25°C to +45°C Option" },
      { label: "Battery Chemistry", value: "48V LiFePO4 Fast-Charge" },
      { label: "Safety Architecture", value: "PLd Cat 3 + 360° LiDAR Curtain" },
    ],
    compliance: "ISO 3691-4 • EN 1525 • UL 583",
    defaultRequirement: "Autonomous Forklifts/AGVs",
  },
  {
    id: "robotic-palletizers",
    name: "Robotic Palletizers & De-Palletizers",
    tagline: "High-Speed Vision-Guided Box Stacking",
    description:
      "Combining heavy-duty robotic arms, custom vacuum grippers, and 3D AI vision, our palletizers automatically identify, pick, and stack mixed-SKU cartons into dense, transit-ready pallet loads.",
    applications: [
      "End-of-Line Mixed-SKU Palletizing",
      "Automated Container & Truck Unloading",
      "High-Speed Case Packing & Wrapping Integration",
    ],
    buttonLabel: "View Vision & Gripper Specs",
    image: palletizerImg,
    imageAlt:
      "High-reach robotic palletizer with vacuum gripper stacking boxes onto pallets",
    toolingBadge: "Multi-Zone Vacuum Gripper + 3D AI Vision",
    safetyFeatures: [
      "Area Safety Light Curtains",
      "Zone Radar Interlocks",
      "Vacuum Loss Drop-Guard",
    ],
    specs: [
      { label: "Arm Payload", value: "50 kg – 180 kg" },
      { label: "Max Stack Height", value: "2,400 mm" },
      { label: "Throughput", value: "Up to 1,080 cases / hr" },
      { label: "End-of-Arm Tooling", value: "Multi-Zone Vacuum / Servo Clamp" },
      { label: "Vision System", value: "3D ToF + RGB Mixed-SKU AI" },
      { label: "Cell Footprint", value: "Compact Dual-Pallet Station" },
    ],
    compliance: "ISO 10218-2 • OSHA • CE",
    defaultRequirement: "Robotic Palletizing",
  },
];

const FLEET_DASHBOARD_UNITS = [
  {
    unit: "AMR-04",
    zone: "Aisle B3 → Pack Station 02",
    task: "Goods-to-Person Tote #8841",
    battery: "92%",
    status: "En Route",
  },
  {
    unit: "AGV-Fork-02",
    zone: "Inbound Dock 04 → Bay R14",
    task: "Pallet Putaway (1,450 kg)",
    battery: "84%",
    status: "Lifting",
  },
  {
    unit: "PAL-Cell-01",
    zone: "Outbound Lane 07",
    task: "Mixed-SKU Pallet (18/24 cases)",
    battery: "AC Mains",
    status: "Active",
  },
];

const DEPLOYMENT_STEPS = [
  {
    step: "01",
    title: "Throughput & Layout Analysis",
    description:
      "We evaluate your SKU volume, aisle widths, and order-picking bottlenecks.",
    icon: Warehouse,
  },
  {
    step: "02",
    title: "Fleet & Traffic Simulation",
    description:
      "We model robot traffic flow and cycle times in a virtual replica of your warehouse.",
    icon: Cpu,
  },
  {
    step: "03",
    title: "WMS / ERP Integration",
    description:
      "Seamless API connection with your existing Warehouse Management System—no magnetic floor tape required.",
    icon: Network,
  },
  {
    step: "04",
    title: "Live Rollout & Fleet Support",
    description:
      "Phased deployment with zero operational downtime, staff training, and 24/7 remote diagnostics.",
    icon: ShieldCheck,
  },
];

const REQUIREMENT_OPTIONS = [
  "Goods-to-Person AMRs",
  "Autonomous Forklifts/AGVs",
  "Robotic Palletizing",
  "Full Warehouse Automation",
];

function WarehousingLogisticsPage() {
  const [expandedRobotId, setExpandedRobotId] = useState<string | null>(
    "autonomous-mobile-robots",
  );
  const [nameAndCompany, setNameAndCompany] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [primaryRequirement, setPrimaryRequirement] = useState(
    "Goods-to-Person AMRs",
  );
  const [warehouseDetails, setWarehouseDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const toggleSpecs = (robotId: string) => {
    setExpandedRobotId((prev) => (prev === robotId ? null : robotId));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAndCompany.trim() || !contactInfo.trim()) return;
    trackDigitalPresence(
      "lead_capture",
      "Warehousing & Logistics Automation Plan",
      primaryRequirement,
    );
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-[#155EEF] selection:text-white">
      {/* SECTION 1: HERO BANNER (ABOVE THE FOLD) */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-8"
          >
            <Link
              to="/solutions"
              className="hover:text-[#155EEF] transition-colors"
            >
              Solutions
            </Link>
            <ChevronRight size={14} />
            <span className="text-[#155EEF]">
              Warehousing & E-Commerce Logistics
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#155EEF]">
                <Warehouse size={14} />
                <span>Warehousing & Logistics</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-bold tracking-tight text-slate-900 leading-[1.08]">
                Intelligent Robotics for Warehousing & Logistics
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                Accelerate order fulfillment, eliminate heavy-lifting injuries,
                and maximize storage throughput with autonomous mobile fleets
                and vision-guided palletizing.
              </p>

              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <a
                  href="#lead-capture"
                  className="inline-flex items-center gap-2 rounded-full bg-[#155EEF] hover:bg-[#1047BF] text-white font-semibold px-7 h-12 text-sm shadow-sm transition-colors"
                >
                  <span>Request a Warehouse Audit</span>
                  <ArrowRight size={16} />
                </a>
                <a
                  href="#core-robots"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-semibold px-6 h-12 text-sm transition-colors"
                >
                  <span>Explore Solutions</span>
                  <ArrowDown size={15} />
                </a>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl aspect-[16/10] bg-slate-100">
                <img
                  src={heroWarehouseImg}
                  alt="Autonomous Mobile Robots (AMRs) and unmanned forklift navigating warehouse aisles"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: KEY IMPACT METRICS (TRUST BAR) */}
      <section className="border-b border-slate-200 bg-[#F8FAFC]">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {TRUST_METRICS.map((metric) => {
              const Icon = metric.icon;
              return (
                <div
                  key={metric.label}
                  className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs"
                >
                  <div className="size-11 rounded-lg bg-blue-50 text-[#155EEF] shrink-0 flex items-center justify-center">
                    <Icon size={20} />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-slate-900">
                      {metric.value}
                    </div>
                    <div className="text-xs sm:text-sm font-medium text-slate-600">
                      {metric.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 3: THE 3 CORE ROBOT SOLUTIONS (ALTERNATING FEATURE BLOCKS) */}
      <section id="core-robots" className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12 lg:mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#155EEF]">
              Core Warehouse Fleet
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Autonomous mobility & vision-guided palletizing
            </h2>
            <p className="text-base sm:text-lg text-slate-600">
              Every unit is built with multi-layer pedestrian safety—360° LiDAR
              zones, emergency stop bumpers, and real-time obstacle avoidance.
            </p>
          </div>

          <div className="space-y-14 lg:space-y-20">
            {CORE_ROBOT_BLOCKS.map((robot, idx) => {
              const isReversed = idx % 2 === 1;
              const isExpanded = expandedRobotId === robot.id;

              return (
                <article
                  key={robot.id}
                  id={robot.id}
                  className="rounded-2xl border border-slate-200 bg-[#F8FAFC] overflow-hidden shadow-xs"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
                    {/* Warehouse Robot Photo */}
                    <div
                      className={`lg:col-span-6 relative aspect-[16/11] lg:aspect-auto lg:h-full min-h-[280px] bg-slate-100 overflow-hidden ${
                        isReversed ? "lg:order-2" : ""
                      }`}
                    >
                      <img
                        src={robot.image}
                        alt={robot.imageAlt}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-4 left-4 rounded-full bg-slate-900/85 backdrop-blur-xs px-3.5 py-1.5 text-xs font-semibold text-white">
                        {robot.toolingBadge}
                      </div>
                    </div>

                    {/* Text, Safety Callouts & Applications */}
                    <div
                      className={`lg:col-span-6 p-7 sm:p-10 lg:p-12 bg-white ${
                        isReversed ? "lg:order-1" : ""
                      }`}
                    >
                      <span className="text-xs font-bold uppercase tracking-wider text-[#155EEF]">
                        {robot.tagline}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-2">
                        {robot.name}
                      </h3>
                      <p className="text-sm sm:text-base text-slate-600 leading-relaxed mt-3">
                        {robot.description}
                      </p>

                      {/* Pedestrian Safety Highlights */}
                      <div className="mt-5 flex flex-wrap gap-2">
                        {robot.safetyFeatures.map((safety) => (
                          <span
                            key={safety}
                            className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800"
                          >
                            <Radar size={13} className="text-emerald-600" />
                            <span>{safety}</span>
                          </span>
                        ))}
                      </div>

                      <div className="mt-6 pt-5 border-t border-slate-100">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                          Key Applications
                        </p>
                        <ul className="space-y-2.5">
                          {robot.applications.map((app) => (
                            <li
                              key={app}
                              className="flex items-center gap-2.5 text-sm font-semibold text-slate-800"
                            >
                              <CheckCircle2
                                size={17}
                                className="text-[#155EEF] shrink-0"
                              />
                              <span>{app}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-7 flex flex-wrap items-center gap-3">
                        <Button
                          type="button"
                          onClick={() => toggleSpecs(robot.id)}
                          className="rounded-full bg-[#155EEF] hover:bg-[#1047BF] text-white font-semibold px-6 h-11 text-sm cursor-pointer"
                        >
                          <span>{robot.buttonLabel}</span>
                          {isExpanded ? (
                            <ChevronUp size={16} className="ml-2" />
                          ) : (
                            <ChevronDown size={16} className="ml-2" />
                          )}
                        </Button>
                        <a
                          href="#lead-capture"
                          onClick={() =>
                            setPrimaryRequirement(robot.defaultRequirement)
                          }
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-[#155EEF] px-3 py-2 transition-colors"
                        >
                          <span>Request Fleet Quote</span>
                          <ArrowRight size={14} />
                        </a>
                      </div>

                      {/* Expandable Engineering Specifications Drawer */}
                      {isExpanded && (
                        <div className="mt-6 pt-6 border-t border-slate-200 animate-in fade-in duration-200">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                              Technical Specifications
                            </span>
                            <span className="text-xs font-semibold text-[#155EEF] bg-blue-50 px-2.5 py-1 rounded-full">
                              {robot.compliance}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {robot.specs.map((spec) => (
                              <div
                                key={spec.label}
                                className="rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-3"
                              >
                                <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                  {spec.label}
                                </div>
                                <div className="text-sm font-bold text-slate-900 mt-0.5">
                                  {spec.value}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Software & Fleet Control Dashboard Preview */}
          <div className="mt-16 rounded-2xl border border-slate-200 bg-[#0F172A] text-white p-7 sm:p-10 shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-sky-300">
                  <Activity size={13} />
                  <span>INDUS Fleet Orchestrator + WMS</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Real-time fleet routing & WMS sync
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Monitor every AMR, autonomous forklift, and palletizer cell
                  from one browser console—balancing aisle traffic, battery
                  docking, and live WMS wave priorities automatically.
                </p>
                <div className="flex flex-wrap gap-3 pt-1 text-xs font-medium text-slate-300">
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldAlert size={14} className="text-emerald-400" />
                    Zero-Collision Aisle Lock
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <BatteryCharging size={14} className="text-sky-400" />
                    Auto-Opportunity Charging
                  </span>
                </div>
              </div>

              <div className="lg:col-span-7 rounded-xl border border-white/10 bg-slate-900/90 p-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-white/10">
                  <span className="font-semibold text-white flex items-center gap-2">
                    <Boxes size={14} className="text-sky-400" />
                    Live Warehouse Telemetry (WMS Connected)
                  </span>
                  <span className="text-emerald-400 font-semibold">
                    ● 99.95% Order Accuracy
                  </span>
                </div>
                {FLEET_DASHBOARD_UNITS.map((row) => (
                  <div
                    key={row.unit}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-2 items-center rounded-lg bg-white/5 px-3.5 py-2.5 text-xs"
                  >
                    <span className="font-bold text-white">{row.unit}</span>
                    <span className="text-slate-300 truncate">{row.zone}</span>
                    <span className="text-sky-300 truncate">{row.task}</span>
                    <span className="text-right font-semibold text-emerald-400">
                      {row.status} · {row.battery}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: HOW WE DEPLOY (4-STEP PROCESS) */}
      <section className="border-t border-b border-slate-200 bg-[#F8FAFC] py-16 lg:py-20">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#155EEF]">
              How We Deploy
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Live warehouse rollout without halting operations
            </h2>
            <p className="text-base text-slate-600">
              Phased integration designed to connect with your WMS and scale
              throughput without floor magnets or facility shutdowns.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DEPLOYMENT_STEPS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <span className="inline-flex items-center justify-center size-10 rounded-xl bg-blue-50 text-[#155EEF]">
                        <Icon size={20} />
                      </span>
                      <span className="text-2xl font-bold text-slate-200">
                        {item.step}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed mt-2">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 5: BOTTOM CONVERSION FORM (LEAD CAPTURE) */}
      <section id="lead-capture" className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-[#F8FAFC] overflow-hidden shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Left Column: Consultation Details */}
              <div className="lg:col-span-5 bg-[#0F172A] text-white p-8 sm:p-10 lg:p-12 flex flex-col justify-between">
                <div className="space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                    Warehouse Automation Plan
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
                    Ready to Scale Your Fulfillment Speed?
                  </h2>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                    Share your warehouse size and daily order volume, and our
                    logistics automation team will design a tailored fleet and
                    ROI plan.
                  </p>
                </div>

                <div className="mt-10 space-y-4 pt-8 border-t border-white/10 text-sm text-slate-300">
                  <div className="flex items-center gap-3">
                    <Phone size={17} className="text-sky-400 shrink-0" />
                    <span>{companyConfig.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail size={17} className="text-sky-400 shrink-0" />
                    <span>{companyConfig.salesEmail}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin size={17} className="text-sky-400 shrink-0" />
                    <span>{companyConfig.headquarters}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock size={17} className="text-sky-400 shrink-0" />
                    <span>{companyConfig.supportHours}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Short 4-Field Lead Capture Form */}
              <div className="lg:col-span-7 p-8 sm:p-10 lg:p-12 bg-white">
                {submitted ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-10 space-y-4">
                    <div className="size-14 rounded-full bg-blue-50 text-[#155EEF] flex items-center justify-center">
                      <CheckCircle2 size={28} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">
                      Warehouse Plan Request Received
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 max-w-md">
                      Thank you,{" "}
                      <span className="font-semibold text-slate-900">
                        {nameAndCompany}
                      </span>
                      . Our logistics automation engineers will prepare your{" "}
                      <span className="font-semibold text-slate-900">
                        {primaryRequirement}
                      </span>{" "}
                      fleet sizing and ROI plan shortly.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setSubmitted(false);
                        setNameAndCompany("");
                        setContactInfo("");
                        setWarehouseDetails("");
                      }}
                      className="rounded-full mt-2 cursor-pointer"
                    >
                      Submit Another Inquiry
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-5">
                    <div>
                      <label
                        htmlFor="wh-name-company"
                        className="block text-sm font-semibold text-slate-800 mb-1.5"
                      >
                        Name & Company Name *
                      </label>
                      <input
                        id="wh-name-company"
                        type="text"
                        required
                        value={nameAndCompany}
                        onChange={(e) => setNameAndCompany(e.target.value)}
                        placeholder="e.g., Priya Nair — Velocity 3PL Hubs"
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#155EEF] focus:outline-none focus:ring-2 focus:ring-[#155EEF]/20"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="wh-contact"
                        className="block text-sm font-semibold text-slate-800 mb-1.5"
                      >
                        Work Email / Phone Number *
                      </label>
                      <input
                        id="wh-contact"
                        type="text"
                        required
                        value={contactInfo}
                        onChange={(e) => setContactInfo(e.target.value)}
                        placeholder="e.g., priya@velocity3pl.com or +1 555-0188"
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#155EEF] focus:outline-none focus:ring-2 focus:ring-[#155EEF]/20"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="wh-requirement"
                        className="block text-sm font-semibold text-slate-800 mb-1.5"
                      >
                        Primary Requirement
                      </label>
                      <select
                        id="wh-requirement"
                        value={primaryRequirement}
                        onChange={(e) => setPrimaryRequirement(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-[#155EEF] focus:outline-none focus:ring-2 focus:ring-[#155EEF]/20"
                      >
                        {REQUIREMENT_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="wh-details"
                        className="block text-sm font-semibold text-slate-800 mb-1.5"
                      >
                        Warehouse Size / Daily Order Volume{" "}
                        <span className="font-normal text-slate-400">
                          (Optional)
                        </span>
                      </label>
                      <textarea
                        id="wh-details"
                        rows={3}
                        value={warehouseDetails}
                        onChange={(e) => setWarehouseDetails(e.target.value)}
                        placeholder="e.g., 120,000 sq ft facility, 8,500 orders/day, SAP EWM..."
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#155EEF] focus:outline-none focus:ring-2 focus:ring-[#155EEF]/20"
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full rounded-full bg-[#155EEF] hover:bg-[#1047BF] text-white font-semibold h-12 text-sm shadow-sm cursor-pointer"
                    >
                      <span>Get My Warehouse Automation Plan</span>
                      <ArrowRight size={16} className="ml-2" />
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <FloatingEngineerCta />
    </div>
  );
}
