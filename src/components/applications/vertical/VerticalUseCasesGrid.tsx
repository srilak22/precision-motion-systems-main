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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModals } from "@/components/modals/ModalContext";
import { images } from "@/lib/images";
import heroWeldingCell from "@/assets/hero/hero-welding-cell.jpg";
import heroProductionLine from "@/assets/hero/hero-production-line.jpg";

interface UseCaseCard {
  id: string;
  title: string;
  deploymentBadge: string;
  image: string;
  description: string;
  kpiImpact: string;
  techStack: string[];
  expandedSpecs: {
    kinematics: string;
    payloadAndReach: string;
    repeatability: string;
    busProtocols: string;
    safetyStandard: string;
    roiHighlight: string;
  };
}

const AUTOMOTIVE_USE_CASES: UseCaseCard[] = [
  {
    id: "battery-assembly",
    title: "EV Battery Pack Module Assembly",
    deploymentBadge: "AUTOMATED ASSEMBLY DEPLOYMENT",
    image: heroProductionLine,
    description:
      "Automated robotic cell executing prismatic and pouch battery cell stacking, busbar laser welding, thermal paste dispensing, and high-voltage isolation testing.",
    kpiImpact: "Cuts module kitting cycle time by 46% while ensuring 100% thermal gap-filler uniformity.",
    techStack: ["ROS2 Kinematics", "OpenCV 3D", "Force-Torque Regulated", "EtherCAT CoE"],
    expandedSpecs: {
      kinematics: "Dual 6-Axis Articulated Arms + Multi-Axis Servo Cartesian Gantry",
      payloadAndReach: "Payload: 150 kg | Reach Radius: 2,650 mm",
      repeatability: "±0.015 mm with laser seam triangulation",
      busProtocols: "EtherCAT Master (Beckhoff TwinCAT 3) @ 250 µs cycle time",
      safetyStandard: "ISO 13849-1 (Category 4, PL e) with safety laser scanners",
      roiHighlight: "Prevents battery thermal paste voiding; payback achieved in 8.4 months",
    },
  },
  {
    id: "body-welding",
    title: "Adaptive Laser & Spot Body Welding",
    deploymentBadge: "WELDING CELL DEPLOYMENT",
    image: heroWeldingCell,
    description:
      "7th-axis linear track robotic spot welding and fiber laser seam joining for automotive body-in-white (BIW) framing and high-strength aluminum door apertures.",
    kpiImpact: "Delivers 99.98% leak-proof weld seam integrity with automated real-time spatter suppression.",
    techStack: ["Laser Seam Triangulation", "MoveIt2 Motion", "Beckhoff CX2040", "PROFINET IRT"],
    expandedSpecs: {
      kinematics: "6-Axis Heavy-Payload Arm on 12-Meter Servo Linear Floor Rail (7th-Axis)",
      payloadAndReach: "Payload: 210 kg servo spot gun | Reach: 3,100 mm",
      repeatability: "±0.02 mm across high-acceleration path reversals",
      busProtocols: "PROFINET IRT / EtherCAT CoE with weld gun servo closed loop",
      safetyStandard: "AWS D8.1M Automotive Welding Specification compliant",
      roiHighlight: "Reduced chassis framing takt time from 78s to 42s",
    },
  },
  {
    id: "powertrain-handling",
    title: "Powertrain & Gearbox Handling",
    deploymentBadge: "HEAVY MATERIAL DEPLOYMENT",
    image: images.arm,
    description:
      "High-torque articulated handling arms automating engine decking, electric drive unit (EDU) stator-rotor insertion, and transmission pallet transfer.",
    kpiImpact: "Achieves 12-second decking takt time with zero mechanical shock and complete torque telemetry logging.",
    techStack: ["6-DOF Force Control", "Dual-Gripper Pneumatics", "SIL 3 Safety PLC", "OPC-UA UNS"],
    expandedSpecs: {
      kinematics: "Heavy Rigid Articulated 6-Axis Kinematics with dynamic counterbalancing",
      payloadAndReach: "Payload: 350 kg | Reach: 2,800 mm",
      repeatability: "±0.03 mm with 6-DOF force insertion compliance",
      busProtocols: "EtherNet/IP CIP Safety & OPC-UA Unified Namespace bridge",
      safetyStandard: "Safe Torque Off (STO), Safe Stop 1 (SS1), Safe Operating Stop (SOS)",
      roiHighlight: "Zero dropped component incidents across 3.2 million duty cycles",
    },
  },
  {
    id: "chassis-machining",
    title: "Chassis Machining & Stamping Tending",
    deploymentBadge: "MACHINE TENDING DEPLOYMENT",
    image: images.weldingRobot,
    description:
      "Turnkey robotic tending cell loading and unloading high-tonnage sheet metal stamping presses and multi-axis CNC milling centers with pneumatic zero-point fixtures.",
    kpiImpact: "Elevates spindle utilization from 62% to 96.4% via continuous 24/7 lights-out machining.",
    techStack: ["Siemens S7-1500", "Pneumatic Zero-Point Clamping", "IO-Link Transducers", "VDA 5050"],
    expandedSpecs: {
      kinematics: "Pedestal-Mounted 6-Axis Manipulator with dual pneumatic vacuum/clamp tool",
      payloadAndReach: "Payload: 180 kg | Reach: 2,400 mm",
      repeatability: "±0.02 mm with automated fixture interlock handshake",
      busProtocols: "Siemens PROFINET with PROFIsafe wireless tool changer link",
      safetyStandard: "Dual-channel light curtains + dynamic muting radar sensors",
      roiHighlight: "Pallet part swap completed in under 8 seconds per cycle",
    },
  },
];

export function VerticalUseCasesGrid() {
  const { openModal } = useModals();
  const [expandedId, setExpandedId] = useState<string | null>("battery-assembly");

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="bg-[#0B0F17] py-16 sm:py-24 border-b border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-xs font-mono font-bold text-[#00F0FF] uppercase mb-4">
              <span>// AUTOMOTIVE SUB-VERTICAL WORKCELLS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase leading-tight">
              Turnkey Production Workcells &amp;{" "}
              <span className="bg-gradient-to-r from-[#00F0FF] to-[#0062FF] bg-clip-text text-transparent">
                Proven Applications
              </span>
            </h2>
            <p className="mt-3 text-base text-slate-400 font-normal">
              Engineered to integrate seamlessly with standard automotive plant architectures, existing PLC
              networks, and high-frequency tactile end-effectors.
            </p>
          </div>

          <Button
            onClick={() =>
              openModal("engineer", {
                initialMessage: "Inquiry: Custom Automotive Robotic Cell Sizing & CAD Request",
              })
            }
            className="bg-white hover:bg-slate-100 text-slate-950 font-bold font-mono text-xs h-11 px-6 rounded-xl shrink-0 cursor-pointer shadow-lg"
          >
            Custom Cell Architecture →
          </Button>
        </div>

        {/* 2x2 Bento Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {AUTOMOTIVE_USE_CASES.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                className="group rounded-3xl bg-[#0D1424]/90 backdrop-blur-md border border-white/10 hover:border-[#00F0FF]/50 transition-all duration-300 shadow-xl overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Card Header Image with Micro-Zoom */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D1424] via-[#0D1424]/40 to-transparent" />

                    {/* Operational Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-950/80 backdrop-blur-md border border-cyan-400/40 text-[10px] font-mono font-bold text-cyan-300 uppercase shadow-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-pulse" />
                        {item.deploymentBadge}
                      </span>
                    </div>

                    {/* KPI Callout on Image Bottom */}
                    <div className="absolute bottom-3 left-4 right-4 z-10">
                      <div className="px-3.5 py-2 rounded-xl bg-slate-950/85 backdrop-blur-md border border-white/10 text-xs font-mono font-medium text-cyan-200">
                        <span className="text-[#00F0FF] font-bold">Performance Impact: </span>
                        <span>{item.kpiImpact}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 sm:p-7">
                    <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-[#00F0FF] transition-colors mb-2.5">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal mb-5">
                      {item.description}
                    </p>

                    {/* Tech Stack Pills */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.techStack.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700/80 text-[10px] font-mono font-semibold text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Expandable Architecture Drawer */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-white/5 animate-in fade-in duration-300">
                        <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#00F0FF] flex items-center gap-1.5">
                          <Cpu size={13} />
                          <span>Detailed Kinematics &amp; Bus Architecture</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                          <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                            <span className="text-slate-400 block text-[10px]">KINEMATICS</span>
                            <span className="text-white font-medium">{item.expandedSpecs.kinematics}</span>
                          </div>
                          <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                            <span className="text-slate-400 block text-[10px]">PAYLOAD &amp; REACH</span>
                            <span className="text-[#00F0FF] font-bold">{item.expandedSpecs.payloadAndReach}</span>
                          </div>
                          <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                            <span className="text-slate-400 block text-[10px]">REPEATABILITY</span>
                            <span className="text-white font-medium">{item.expandedSpecs.repeatability}</span>
                          </div>
                          <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                            <span className="text-slate-400 block text-[10px]">BUS / PROTOCOL</span>
                            <span className="text-cyan-300 font-medium">{item.expandedSpecs.busProtocols}</span>
                          </div>
                        </div>

                        <div className="pt-2 text-[11px] font-mono text-emerald-300 flex items-center gap-1.5">
                          <ShieldCheck size={13} className="shrink-0" />
                          <span>{item.expandedSpecs.roiHighlight}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="p-6 sm:p-7 pt-0 flex items-center justify-between border-t border-slate-800/40 mt-2">
                  <button
                    type="button"
                    onClick={() => toggleExpand(item.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#00F0FF] hover:text-white transition-colors cursor-pointer"
                  >
                    <span>{isExpanded ? "Hide Architecture Specs" : "View Specs & Architecture"}</span>
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      openModal("engineer", {
                        initialMessage: `Feasibility Inquiry for Automotive [${item.title}]`,
                      })
                    }
                    className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Request Sizing →</span>
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
