import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  Cpu,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Maximize2,
  Workflow,
  Wrench,
  Gauge,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModals } from "@/components/modals/ModalContext";
import { images } from "@/lib/images";
import heroWeldingCell from "@/assets/hero/hero-welding-cell.jpg";
import heroProductionLine from "@/assets/hero/hero-production-line.jpg";

export interface GalleryApplicationCard {
  id: string;
  title: string;
  deploymentBadge: string;
  image: string;
  description: string;
  kpiImpact: string;
  specs: {
    payload: string;
    repeatability: string;
    cycleTime: string;
  };
  techStack: string[];
  expandedDetails: {
    kinematics: string;
    fieldbus: string;
    safetyCompliance: string;
    roiSummary: string;
  };
}

export const AUTOMOTIVE_GALLERY_CARDS: GalleryApplicationCard[] = [
  {
    id: "battery-assembly",
    title: "EV Battery Pack Module Assembly Cell",
    deploymentBadge: "AUTOMATED ASSEMBLY",
    image: heroProductionLine,
    description:
      "Automated robotic cell executing prismatic and pouch battery cell stacking, busbar laser welding, thermal paste dispensing, and high-voltage isolation testing.",
    kpiImpact: "Cuts module kitting cycle time by 46% while ensuring 100% thermal gap-filler uniformity.",
    specs: {
      payload: "150 kg",
      repeatability: "±0.015 mm",
      cycleTime: "< 42 sec",
    },
    techStack: ["ROS2 Kinematics", "OpenCV 3D", "Force-Torque Regulated", "EtherCAT CoE"],
    expandedDetails: {
      kinematics: "Dual 6-Axis Articulated Arms + Synchronized Cartesian Dispense Rail",
      fieldbus: "EtherCAT Master (Beckhoff TwinCAT 3) @ 250 µs cycle time",
      safetyCompliance: "ISO 13849-1 (Category 4, PL e) with laser safety zones",
      roiSummary: "Prevents battery thermal paste voiding; payback achieved in 8.4 months",
    },
  },
  {
    id: "body-welding",
    title: "Body-in-White 7th-Axis Gantry Welding",
    deploymentBadge: "ROBOTIC WELDING ARMS",
    image: heroWeldingCell,
    description:
      "7th-axis linear track robotic spot welding and fiber laser seam joining for automotive body-in-white (BIW) framing and high-strength aluminum door apertures.",
    kpiImpact: "Delivers 99.98% leak-proof weld seam integrity with automated real-time spatter suppression.",
    specs: {
      payload: "210 kg",
      repeatability: "±0.02 mm",
      cycleTime: "< 48 sec",
    },
    techStack: ["Laser Seam Triangulation", "MoveIt2 Motion", "Beckhoff CX2040", "PROFINET IRT"],
    expandedDetails: {
      kinematics: "6-Axis Heavy Articulated Arm on 12-Meter Servo Linear Track",
      fieldbus: "PROFINET IRT with closed-loop medium-frequency DC weld gun control",
      safetyCompliance: "AWS D8.1M Automotive Welding Specification compliant",
      roiSummary: "Reduced chassis framing takt time from 78s to 48s",
    },
  },
  {
    id: "powertrain-handling",
    title: "Powertrain & Gearbox Articulated Handling",
    deploymentBadge: "HEAVY MATERIAL HANDLING",
    image: images.arm,
    description:
      "High-torque articulated handling arms automating engine decking, electric drive unit (EDU) stator-rotor insertion, and transmission pallet transfer.",
    kpiImpact: "Achieves 12-second decking takt time with zero mechanical shock and complete torque telemetry logging.",
    specs: {
      payload: "350 kg",
      repeatability: "±0.03 mm",
      cycleTime: "< 12 sec",
    },
    techStack: ["6-DOF Force Control", "Dual Pneumatic Gripper", "SIL 3 Safety PLC", "OPC-UA UNS"],
    expandedDetails: {
      kinematics: "Rigid Articulated 6-Axis Kinematics with dynamic counterbalancing",
      fieldbus: "EtherNet/IP CIP Safety & OPC-UA Unified Namespace bridge",
      safetyCompliance: "Safe Torque Off (STO), Safe Stop 1 (SS1), Safe Operating Stop (SOS)",
      roiSummary: "Zero dropped component incidents across 3.2 million duty cycles",
    },
  },
  {
    id: "machine-tending",
    title: "Dual-Gripper CNC Machine Tending Cell",
    deploymentBadge: "CNC TENDING AUTOMATION",
    image: images.weldingRobot,
    description:
      "Turnkey robotic tending cell loading and unloading high-tonnage stamping presses and multi-axis CNC milling centers with pneumatic zero-point fixtures.",
    kpiImpact: "Elevates spindle utilization from 62% to 96.4% via continuous 24/7 lights-out machining.",
    specs: {
      payload: "180 kg",
      repeatability: "±0.02 mm",
      cycleTime: "< 8s swap",
    },
    techStack: ["Siemens S7-1500", "Zero-Point Clamping", "IO-Link Sensors", "VDA 5050"],
    expandedDetails: {
      kinematics: "Pedestal-Mounted 6-Axis Manipulator with dual pneumatic tooling",
      fieldbus: "Siemens PROFINET with PROFIsafe wireless tool changer link",
      safetyCompliance: "Dual-channel light curtains + dynamic muting radar sensors",
      roiSummary: "Finished-to-raw pallet part swap completed in under 8 seconds per cycle",
    },
  },
];

interface VerticalUseCasesGridProps {
  title?: string;
  subtitle?: string;
  cards?: GalleryApplicationCard[];
}

export function VerticalUseCasesGrid({
  title = "Turnkey Production Workcells & Robotic Applications",
  subtitle = "High-resolution robotics imagery, verified kinematic metrics, and turnkey workcell architectures engineered for high-throughput automotive and EV manufacturing.",
  cards = AUTOMOTIVE_GALLERY_CARDS,
}: VerticalUseCasesGridProps) {
  const { openModal } = useModals();
  const [expandedId, setExpandedId] = useState<string | null>(cards[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="bg-white py-16 sm:py-24 border-b border-slate-200/90 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-mono font-bold text-[#1D4ED8] uppercase mb-4 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#1D4ED8] animate-pulse" />
              <span>// ROBOTIC APPLICATIONS GALLERY</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              {title}
            </h2>

            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              {subtitle}
            </p>
          </div>

          <Button
            onClick={() =>
              openModal("engineer", {
                initialMessage: "Inquiry: Custom Robotic Workcell Sizing & CAD Space-Claim Request",
              })
            }
            className="bg-[#1D4ED8] hover:bg-[#1e40af] text-white font-bold font-mono text-xs h-11 px-6 rounded-xl shrink-0 cursor-pointer shadow-md shadow-blue-500/20 border-0"
          >
            Request Workcell Architecture →
          </Button>
        </div>

        {/* 2x2 Bento Gallery Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {cards.map((card) => {
            const isExpanded = expandedId === card.id;
            return (
              <div
                key={card.id}
                className="group rounded-2xl bg-white border border-slate-200 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* High-Resolution Imagery with Micro-Zoom */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Gradient Vignette for Badge Contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/30" />

                    {/* Top Deployment Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/95 backdrop-blur-md border border-slate-200 text-[10px] font-mono font-bold text-[#1D4ED8] uppercase shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1D4ED8] animate-pulse" />
                        {card.deploymentBadge}
                      </span>
                    </div>

                    {/* Performance Callout Pill on Image */}
                    <div className="absolute bottom-3 left-4 right-4 z-10">
                      <div className="px-3.5 py-2 rounded-xl bg-slate-950/85 backdrop-blur-md border border-white/10 text-xs font-mono text-white flex items-center justify-between">
                        <span className="text-cyan-300 font-semibold">{card.kpiImpact}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-6 sm:p-7">
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-[#1D4ED8] transition-colors mb-2.5">
                      {card.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mb-5">
                      {card.description}
                    </p>

                    {/* 3 Key Spec Badges (Minimalist Cards) */}
                    <div className="grid grid-cols-3 gap-2.5 mb-5 pt-4 border-t border-slate-100">
                      <div className="bg-blue-50/50 border border-blue-100/80 rounded-xl p-2.5 text-center">
                        <div className="text-[10px] font-mono text-slate-500 font-semibold uppercase">PAYLOAD</div>
                        <div className="text-xs sm:text-sm font-bold font-mono text-[#1D4ED8] mt-0.5">
                          {card.specs.payload}
                        </div>
                      </div>

                      <div className="bg-blue-50/50 border border-blue-100/80 rounded-xl p-2.5 text-center">
                        <div className="text-[10px] font-mono text-slate-500 font-semibold uppercase">REPEATABILITY</div>
                        <div className="text-xs sm:text-sm font-bold font-mono text-slate-900 mt-0.5">
                          {card.specs.repeatability}
                        </div>
                      </div>

                      <div className="bg-blue-50/50 border border-blue-100/80 rounded-xl p-2.5 text-center">
                        <div className="text-[10px] font-mono text-slate-500 font-semibold uppercase">CYCLE TAKT</div>
                        <div className="text-xs sm:text-sm font-bold font-mono text-[#1D4ED8] mt-0.5">
                          {card.specs.cycleTime}
                        </div>
                      </div>
                    </div>

                    {/* Tech Stack Pills */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {card.techStack.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-[10px] font-mono font-medium text-slate-700"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Expandable Technical Specs Drawer */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-slate-100 space-y-2.5 bg-slate-50/80 p-4 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 animate-in fade-in duration-300">
                        <div className="flex items-center gap-1.5 text-[#1D4ED8] font-bold text-[11px] uppercase tracking-wider mb-2">
                          <Cpu size={13} />
                          <span>System Kinematics &amp; Bus Architecture</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                          <div className="p-2 rounded bg-white border border-slate-200">
                            <span className="text-slate-500 block text-[10px]">KINEMATICS</span>
                            <span className="font-semibold text-slate-900">{card.expandedDetails.kinematics}</span>
                          </div>
                          <div className="p-2 rounded bg-white border border-slate-200">
                            <span className="text-slate-500 block text-[10px]">FIELDBUS PROTOCOL</span>
                            <span className="font-semibold text-[#1D4ED8]">{card.expandedDetails.fieldbus}</span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-200/80 flex items-center gap-1.5 text-emerald-700 font-medium text-[11px]">
                          <ShieldCheck size={14} className="shrink-0 text-emerald-600" />
                          <span>{card.expandedDetails.roiSummary}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Controls & Direct Action Links */}
                <div className="p-6 sm:p-7 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => toggleExpand(card.id)}
                    className="inline-flex items-center gap-1 font-bold text-[#1D4ED8] hover:text-[#1e40af] transition-colors cursor-pointer"
                  >
                    <span>{isExpanded ? "Hide Architecture" : "View Architecture"}</span>
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      openModal("engineer", {
                        initialMessage: `Feasibility & Sizing Proposal Request for [${card.title}]`,
                      })
                    }
                    className="font-bold text-slate-700 hover:text-[#1D4ED8] flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Request Proposal →</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
