import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Car,
  Cpu,
  Factory,
  Warehouse,
  UtensilsCrossed,
  Plane,
  ArrowRight,
  Sparkles,
  Layers,
  ShieldCheck,
  MousePointerClick,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { IndustryCard, type IndustryFlipCardData } from "./IndustryCard";
import { useModals } from "@/components/modals/ModalContext";
import { images } from "@/lib/images";

export const INDUSTRY_FLIP_CARDS: IndustryFlipCardData[] = [
  {
    id: "automotive",
    title: "Automotive & EV Mobility",
    categoryBadge: "AUTOMATED ASSEMBLY",
    badgeColorClass: "bg-blue-50 text-[#1D4ED8] border-blue-200",
    icon: Car,
    description:
      "Continuous-duty robotic welding cells, high-payload chassis handling, and micro-precision EV battery module pack integration.",
    coreSpecs: [
      { label: "Cycle Time", value: "< 42s" },
      { label: "Seam Acc.", value: "±0.02 mm" },
      { label: "Payload", value: "210 kg" },
    ],
    techStack: ["ROS2 Kinematics", "7th-Axis Linear", "Laser Seam Tracking", "EtherCAT CoE"],
    workcellImage: images.weldingRobot,
    activeWorkcell:
      "Dual-robot MIG & adaptive laser seam welding cell mounted on a 12-meter 7th-axis linear track for high-cadence EV battery pack chassis enclosures.",
    operationalBenefit:
      "Cuts pack cycle times by 46% while eliminating thermal distortion rework and delivering 99.98% leak-proof weld seam integrity.",
    motionStudioLink: "/technology/physical-ai",
    caseStudyAnchor: "automotive",
  },
  {
    id: "electronics",
    title: "Electronics & Semiconductor",
    categoryBadge: "MICRON PRECISION",
    badgeColorClass: "bg-sky-50 text-sky-700 border-sky-200",
    icon: Cpu,
    description:
      "Cleanroom ISO Class 1 high-speed pick & place manipulators, micro-fastening, and automated 3D optical defect classification.",
    coreSpecs: [
      { label: "Placement", value: "±15 µm" },
      { label: "Throughput", value: "1,200 PPH" },
      { label: "ESD Rating", value: "Class 1" },
    ],
    techStack: ["OpenCV", "Deep CNN YOLO", "SCARA Manipulators", "SEMI S2/S8"],
    workcellImage: images.scaraRobot,
    activeWorkcell:
      "High-speed cleanroom SCARA pick-and-place cell paired with multi-camera telecentric optical inspection classifying microscopic 01005 solder bridges.",
    operationalBenefit:
      "Achieves 100% in-line micro-defect interception at line speed, reducing component scrap losses by $180,000 annually.",
    motionStudioLink: "/technology/physical-ai",
    caseStudyAnchor: "electronics",
  },
  {
    id: "machining",
    title: "Heavy Machining & Tooling",
    categoryBadge: "HEAVY AUTOMATION",
    badgeColorClass: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Factory,
    description:
      "Heavy-duty CNC lathe & mill tending, automated press brake feeding, and continuous metal fabrication cells maximizing spindle uptime.",
    coreSpecs: [
      { label: "Spindle Uptime", value: "96.4%" },
      { label: "Swap Takt", value: "< 8s" },
      { label: "Max Payload", value: "450 kg" },
    ],
    techStack: ["Siemens/AB PLCs", "Industrial IoT", "Torque Control", "PROFINET IRT"],
    workcellImage: images.arm,
    activeWorkcell:
      "Dual-gripper heavy articulated robotic workcell automating CNC spindle raw billet loading and pneumatic fixture swap under continuous coolant spray.",
    operationalBenefit:
      "Increases spindle operating utilization from 64% to 96.4% via 24/7 lights-out shifts with zero operator pinch hazards.",
    motionStudioLink: "/technology/physical-ai",
    caseStudyAnchor: "machining",
  },
  {
    id: "logistics",
    title: "Packaging & Logistics",
    categoryBadge: "AMR / AGV FLEET",
    badgeColorClass: "bg-indigo-50 text-indigo-700 border-indigo-200",
    icon: Warehouse,
    description:
      "Autonomous mobile intralogistics and dynamic multi-line packaging workcells orchestrating continuous warehouse carton flow.",
    coreSpecs: [
      { label: "Pick Velocity", value: "140 P/min" },
      { label: "AMR Payload", value: "1,200 kg" },
      { label: "Sort Acc.", value: "99.8%" },
    ],
    techStack: ["ROS2 Nav2", "LiDAR SLAM", "3D Bin Picking", "VDA 5050 Fleet"],
    workcellImage: images.pillarLogistics,
    activeWorkcell:
      "Autonomous mixed-palletizing and dynamic 3D vision bin-picking in high-throughput fulfillment centers paired with LiDAR-guided AMR fleet coordination.",
    operationalBenefit:
      "Eliminates sorting bottlenecks and reduces damage rates by 99.8% while doubling multi-SKU dispatch throughput.",
    motionStudioLink: "/technology/physical-ai",
    caseStudyAnchor: "packaging",
  },
  {
    id: "pharma",
    title: "Food & Pharmaceutical",
    categoryBadge: "STERILE & WASH-DOWN",
    badgeColorClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: UtensilsCrossed,
    description:
      "High-speed delta pick-and-pack, sterile vial handling, and automated 21 CFR Part 11 cryptographic batch traceability.",
    coreSpecs: [
      { label: "Pick Speed", value: "180 BPM" },
      { label: "Ingress", value: "IP69K" },
      { label: "Compliance", value: "FDA 21 CFR" },
    ],
    techStack: ["Delta Robots", "FDA 21 CFR 11", "Seal Vision AI", "IP69K Washdown"],
    workcellImage: images.deltaRobot,
    activeWorkcell:
      "IP69K washdown stainless steel delta robot cell executing sterile syringe kitting, peristaltic vial filling, and seal defect classification.",
    operationalBenefit:
      "Guarantees zero human microbial contamination inside aseptic barrier isolators with automated electronic signatures.",
    motionStudioLink: "/technology/physical-ai",
    caseStudyAnchor: "pharma",
  },
  {
    id: "aerospace",
    title: "Aerospace & High-Precision",
    categoryBadge: "AS9100 COMPLIANT",
    badgeColorClass: "bg-purple-50 text-purple-700 border-purple-200",
    icon: Plane,
    description:
      "Automated composite wing skin drilling, 6-DOF force-torque fastener installation, and non-destructive ultrasonic testing.",
    coreSpecs: [
      { label: "Hole Tol.", value: "±0.008 mm" },
      { label: "Drill Feed", value: "5.2x Faster" },
      { label: "Inspection", value: "Ultrasonic" },
    ],
    techStack: ["6-DOF Force Control", "MoveIt2 ROS2", "Ultrasonic NDT", "AS9100"],
    workcellImage: images.pillarSpecialised,
    activeWorkcell:
      "Track-mounted rigid 6-axis drilling and ultrasonic metrology robot executing precision counter-sinking across carbon composite aerostructures.",
    operationalBenefit:
      "Completely eliminates oversized hole delamination scrap across 40,000 drilled holes, saving $410,000 annually.",
    motionStudioLink: "/technology/physical-ai",
    caseStudyAnchor: "aerospace",
  },
];

interface IndustryFlipGridProps {
  showTitle?: boolean;
  className?: string;
}

export function IndustryFlipGrid({ showTitle = true, className = "" }: IndustryFlipGridProps) {
  const { openModal } = useModals();

  return (
    <section className={`py-16 sm:py-20 lg:py-24 bg-white relative overflow-hidden ${className}`}>
      {/* Background Architectural Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `linear-gradient(to right, #1d4ed80a 1px, transparent 1px), linear-gradient(to bottom, #1d4ed80a 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {showTitle && (
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[11px] font-mono font-bold text-[#1D4ED8] tracking-wider uppercase mb-4 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#1D4ED8] animate-pulse" />
                <span>MISSION-CRITICAL SECTORS • ROBOTIC WORKCELLS • 3D SPECIFICATION FLIP</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Industries &amp; Deployed{" "}
                <span className="bg-gradient-to-r from-[#1D4ED8] via-[#2563EB] to-[#0B47BE] bg-clip-text text-transparent">
                  Robotic Applications
                </span>
              </h2>

              <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
                Deploying physics-validated robotics, computer vision, and ROS2-driven automation across six core
                industrial sectors. <strong>Hover or tap any card</strong> to flip between detailed engineering
                specifications and active robotic workcell deployments.
              </p>
            </div>

            {/* Interactive Hint Indicator */}
            <div className="hidden lg:flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-600 shrink-0">
              <MousePointerClick size={16} className="text-[#1D4ED8] animate-bounce" />
              <span>Interactive 3D Flip Enabled</span>
            </div>
          </div>
        )}

        {/* The 3x2 Bento Grid of Flip Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {INDUSTRY_FLIP_CARDS.map((card) => (
            <IndustryCard key={card.id} card={card} />
          ))}
        </div>

        {/* Bottom Navigation & Sizing Bar */}
        <div className="mt-14 pt-8 border-t border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-600">
            <ShieldCheck size={16} className="text-[#1D4ED8]" />
            <span>All Kinematics Physics-Validated • DIN 3990 &amp; ISO 9283 Standards Compliance</span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="outline"
              className="border-slate-300 hover:border-[#1D4ED8] text-slate-800 text-xs font-bold font-mono h-10 px-5 rounded-lg cursor-pointer"
            >
              <Link to="/industries">
                <span>View Full Industry Architecture</span>
                <ArrowRight size={13} className="ml-1.5" />
              </Link>
            </Button>

            <Button
              onClick={() =>
                openModal("engineer", {
                  initialMessage: "Home Page Flip Grid: Request Sizing Proposal & Feasibility",
                })
              }
              className="bg-[#1D4ED8] hover:bg-[#1e40af] text-white text-xs font-bold font-mono h-10 px-5 rounded-lg shadow-sm cursor-pointer"
            >
              Request Sizing Proposal
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
