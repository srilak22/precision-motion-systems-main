import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Car,
  Cpu,
  Factory,
  Warehouse,
  UtensilsCrossed,
  Plane,
  AlertCircle,
  Cpu as CpuIcon,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModals } from "@/components/modals/ModalContext";

interface ProjectCaseStudy {
  id: string;
  industry: string;
  projectName: string;
  clientSector: string;
  icon: React.ElementType<{ size?: number; className?: string }>;
  problemStatement: string;
  deployedStack: {
    hardware: string[];
    software: string[];
  };
  validatedResults: {
    highlight: string;
    metrics: { label: string; value: string }[];
    summary: string;
  };
  schematicBadge: string;
}

const CASE_STUDIES: ProjectCaseStudy[] = [
  {
    id: "automotive",
    industry: "Automotive & Mobility",
    projectName: "High-Rate EV Battery Module Assembly & Seam Welding",
    clientSector: "Tier-1 Tier Powertrain Gigafactory",
    icon: Car,
    problemStatement:
      "Manual welding of prismatic cell battery pack enclosures suffered high thermal distortion, 4.2% weld seam leak failures, and cycle times exceeding 78 seconds per chassis tray, creating a major output bottleneck.",
    deployedStack: {
      hardware: [
        "7th-Axis 12-meter Linear Servo Gantry Track",
        "Two 6-Axis High-Payload Robot Arms (210 kg)",
        "Adaptive Laser Seam Tracker & Pyrometer",
        "EtherCAT Beckhoff CX2040 Real-Time Master",
      ],
      software: [
        "ROS2 MoveIt2 Kinematic Trajectory Smoothing",
        "Custom ESP32 Thermal Telemetry DAQ Nodes",
        "YOLOv8 Real-Time Weld Spatter Defect Classifier",
        "OPC-UA Unified Namespace (UNS) MES Interface",
      ],
    },
    validatedResults: {
      highlight: "99.98% Weld Seam Integrity Coverage | 42s Cycle Time (46% Reduction)",
      metrics: [
        { label: "Cycle Time", value: "42 sec" },
        { label: "Weld Rejection", value: "< 0.05%" },
        { label: "Spindle Uptime", value: "99.4%" },
      ],
      summary:
        "Reduced pack cycle time from 78s to 42s while eliminating post-process leak rework, saving over $280,000 in monthly scrap losses.",
    },
    schematicBadge: "BLUEPRINT // AUTO-EV-2026",
  },
  {
    id: "electronics",
    industry: "Electronics & Electrical",
    projectName: "Sub-15 Micron SMT PCB Automated Optical Inspection & Placement",
    clientSector: "High-Density Consumer Electronics OEM",
    icon: Cpu,
    problemStatement:
      "Microscopic 01005 passives and multi-layer flex circuits were experiencing solder bridging and component tilt that human operators could not detect at line speeds of 1,200 boards per hour.",
    deployedStack: {
      hardware: [
        "Cleanroom ISO Class 1 High-Speed SCARA Arms",
        "Telecentric High-Resolution 20MP GigE Cameras",
        "Coaxial Multi-Angle Polarized LED Illuminators",
        "Direct-Drive High-Torque Rotary Sizing Stage",
      ],
      software: [
        "OpenCV & Deep Convolutional Neural Network AOI",
        "Real-Time TensorRT Sub-Pixel Defect Segmentation",
        "IPC-A-610 Standard Electronic Quality Engine",
        "Automated Laser Marking Serialization Database",
      ],
    },
    validatedResults: {
      highlight: "100% In-Line Micro-Defect Catch Rate | Placement Precision Down to ±15 µm",
      metrics: [
        { label: "Precision", value: "±15 µm" },
        { label: "Inspection Latency", value: "3.2 ms" },
        { label: "Throughput", value: "1,800 BPH" },
      ],
      summary:
        "Eliminated customer field failure returns completely and increased inspection throughput by 50% without adding cleanroom floor footprint.",
    },
    schematicBadge: "BLUEPRINT // SMT-MICRO-2026",
  },
  {
    id: "manufacturing",
    industry: "Manufacturing & Machine Building",
    projectName: "Autonomous Dual-Gripper CNC Machine Tending Cell",
    clientSector: "Precision Hydraulic Valve Manufacturer",
    icon: Factory,
    problemStatement:
      "CNC milling centers operated at only 54% spindle utilization due to operator reload delays, chip fouling inside hydraulic chucks, and fatigue-induced misclamping during late night shifts.",
    deployedStack: {
      hardware: [
        "Heavy-Duty Floor-Mounted 6-Axis Tending Robot",
        "Dual Parallel Pneumatic Gripper End-Effector",
        "Automated Air-Blast Chuck Cleaning Station",
        "Siemens S7-1500 PLC Safety Interlock Unit",
      ],
      software: [
        "ROS2 Trajectory Collision Avoidance Engine",
        "Siemens PROFINET IRT Deterministic Bridge",
        "Vibration FFT Spindle Health Diagnostics",
        "Automated ERP Maintenance Ticket Trigger",
      ],
    },
    validatedResults: {
      highlight: "96.4% Spindle Utilization | 7.4s Part Swap Time (Lights-Out Ready)",
      metrics: [
        { label: "Spindle Uptime", value: "96.4%" },
        { label: "Part Swap", value: "7.4 sec" },
        { label: "Shift Coverage", value: "24/7 Continuous" },
      ],
      summary:
        "Unlocked 28 extra production hours every week from existing CNC machine assets with immediate zero-defect part seating.",
    },
    schematicBadge: "BLUEPRINT // CNC-TEND-2026",
  },
  {
    id: "packaging",
    industry: "Packaging & Logistics",
    projectName: "Dynamic Autonomous Mobile Fleet (AMR) & Palletizing Matrix",
    clientSector: "Regional E-Commerce Fulfillment & 3PL Hub",
    icon: Warehouse,
    problemStatement:
      "Rigid conveyor lines created facility transit gridlocks and could not handle rapid retail SKU mix variations, while manual pallet jack operations caused 14 forklift safety near-misses quarterly.",
    deployedStack: {
      hardware: [
        "Fleet of 18 High-Payload AMRs (1,200 kg capacity)",
        "360° Safety LiDAR Perimeter Zone Scanners",
        "Heavy-Duty 4-Axis End-of-Line Palletizing Arm",
        "Opportunity Induction Rapid-Charging Pads",
      ],
      software: [
        "VDA 5050 Multi-Vendor Fleet Management System",
        "SLAM Dynamic Re-Routing (No Floor Tape)",
        "Dynamic Palletizing Layer Pattern Generator",
        "WMS / SAP Direct Task Dispatch Connector",
      ],
    },
    validatedResults: {
      highlight: "62% Faster Dock-to-Stock Transit | Zero Facility Collisions Certified",
      metrics: [
        { label: "Transit Time", value: "-62%" },
        { label: "Fleet Capacity", value: "1,200 kg" },
        { label: "Incident Rate", value: "0 Incidents" },
      ],
      summary:
        "Recovered 2,400 sq. ft. of floor space by retiring legacy permanent conveyors and cut order turnaround latency in half.",
    },
    schematicBadge: "BLUEPRINT // AMR-FLEET-2026",
  },
  {
    id: "food-pharma",
    industry: "Food & Pharmaceutical",
    projectName: "Aseptic Sterile Vial Filling & High-Speed Delta Cartoning",
    clientSector: "FDA-Registered Biopharmaceutical Facility",
    icon: UtensilsCrossed,
    problemStatement:
      "Stringent sterility requirements in clean containment isolators caused extreme operator ergonomics fatigue, while particulate contamination risks threatened multi-million dollar vaccine batch integrity.",
    deployedStack: {
      hardware: [
        "IP69K Mirror-Polished Stainless Steel Delta Robot",
        "Vaporized Hydrogen Peroxide (VHP) Proof Seals",
        "Medical-Grade Soft Adaptive Vacuum Grippers",
        "Rotary Peristaltic Micro-Dosing Filling Pumps",
      ],
      software: [
        "FDA 21 CFR Part 11 Electronic Signature Ledger",
        "In-Line Optical Seal Integrity Computer Vision",
        "High-Speed Conveyor Tracking Encoder Sync",
        "Automated Cryptographic Batch Record Trace",
      ],
    },
    validatedResults: {
      highlight: "100% Sterile Compliance Pass Rate | 140 Picks/Min Sustained Velocity",
      metrics: [
        { label: "Pick Speed", value: "140 P/min" },
        { label: "Contamination", value: "Zero PPM" },
        { label: "Compliance", value: "21 CFR Part 11" },
      ],
      summary:
        "Removed manual intervention entirely from the sterile isolator envelope while doubling packaging throughput with complete audit trail integrity.",
    },
    schematicBadge: "BLUEPRINT // PHARMA-ASEPTIC-2026",
  },
  {
    id: "aerospace",
    industry: "Aerospace & Precision Engineering",
    projectName: "Automated Composite Wing Skin Drilling & Ultrasonic Metrology",
    clientSector: "Commercial Aircraft Aerostructures Prime",
    icon: Plane,
    problemStatement:
      "Hand-drilling 12,000 fastener holes per carbon composite wing spar caused severe drill bit thermal delamination and high scrap risks on $180,000 aerostructure panels.",
    deployedStack: {
      hardware: [
        "Track-Mounted 6-Axis Rigid Drilling Robot",
        "6-DOF Multi-Axis Force-Torque Tool Sensor",
        "High-Frequency Ultrasonic Non-Destructive Probe",
        "Optical Laser Photogrammetry Metrology Head",
      ],
      software: [
        "Closed-Loop Real-Time Thrust & Torque Feed Control",
        "Sub-Millimeter CAD-to-Path Kinematic Compiler",
        "AS9100 Dimensional Hole Verification Logger",
        "Automated Tool Bit Wear Compensation Logic",
      ],
    },
    validatedResults: {
      highlight: "Zero Hole Delamination Scrap | 5.2x Faster Drilling Throughput",
      metrics: [
        { label: "Drill Rate", value: "5.2x Faster" },
        { label: "Diameter Tol.", value: "±0.008 mm" },
        { label: "Scrap Saved", value: "$410k/yr" },
      ],
      summary:
        "Completely eliminated oversized hole rejections across 40,000 drilled holes with full digital torque and diameter certificates tied to tail numbers.",
    },
    schematicBadge: "BLUEPRINT // AERO-WING-2026",
  },
];

export function IndustryCaseStudy() {
  const { openModal } = useModals();
  const [activeTab, setActiveTab] = useState<string>("automotive");

  React.useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#case-study-", "");
      if (hash && CASE_STUDIES.some((c) => c.id === hash)) {
        setActiveTab(hash);
      }
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const study = CASE_STUDIES.find((c) => c.id === activeTab) || CASE_STUDIES[0];
  const IconComponent = study.icon;

  return (
    <section id="case-studies" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-200/80 scroll-mt-20">
      {/* Anchor targets for each sector */}
      {CASE_STUDIES.map((c) => (
        <div key={c.id} id={`case-study-${c.id}`} className="scroll-mt-28" />
      ))}

      <div className="max-w-3xl mb-12">
        <div className="text-xs font-mono font-bold tracking-wider text-[#155EEF] uppercase mb-2">
          // FIELD-VALIDATED PROJECT BLUEPRINTS
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Industry Project &amp; Case Study Drawer
        </h2>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
          Examine concrete deployment architectures. Select a domain below to review the industrial challenge, the deployed
          hardware/software stack, and the audited operational outcomes.
        </p>
      </div>

      {/* Industry Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 pb-3 border-b border-slate-200/80">
        {CASE_STUDIES.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-mono tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === item.id
                ? "bg-[#155EEF] text-white font-bold shadow-sm"
                : "bg-white text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 shadow-2xs"
            }`}
          >
            <span>{item.industry}</span>
          </button>
        ))}
      </div>

      {/* Case Study Card */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-10 shadow-sm">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#155EEF]">
              <IconComponent size={24} />
            </div>
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF]">
                {study.clientSector}
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">{study.projectName}</h3>
            </div>
          </div>
          <span className="self-start sm:self-auto text-xs font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded border border-slate-200">
            {study.schematicBadge}
          </span>
        </div>

        {/* Highlight Banner */}
        <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 mb-8 flex items-center gap-3">
          <TrendingUp size={20} className="text-emerald-700 shrink-0" />
          <div className="text-sm font-bold text-emerald-950 font-mono">{study.validatedResults.highlight}</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Problem Statement & Results Summary */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-rose-700 mb-2 flex items-center gap-1.5">
                <AlertCircle size={14} />
                <span>The Problem Statement</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed bg-rose-50/50 p-4 rounded-xl border border-rose-200/60 font-normal">
                {study.problemStatement}
              </p>
            </div>

            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-2">
                Operational Impact Summary
              </div>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">{study.validatedResults.summary}</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {study.validatedResults.metrics.map((m, idx) => (
                <div key={idx} className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 text-center">
                  <div className="text-base sm:text-lg font-bold font-mono text-[#155EEF]">{m.value}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">{m.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Deployed Hardware & Software Stack */}
          <div className="lg:col-span-6 bg-slate-50/60 rounded-xl p-6 border border-slate-200 space-y-5">
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 mb-2.5 flex items-center gap-1.5">
                <CpuIcon size={14} className="text-[#155EEF]" />
                <span>Deployed Hardware Mechatronics</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                {study.deployedStack.hardware.map((hw, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#155EEF] shrink-0 mt-1.5" />
                    <span>{hw}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-200/80">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 mb-2.5 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[#155EEF]" />
                <span>Deployed Software &amp; Intelligence Stack</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                {study.deployedStack.software.map((sw, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5" />
                    <span>{sw}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action inside drawer */}
            <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between">
              <Button
                onClick={() =>
                  openModal("engineer", {
                    initialMessage: `Case Study Sizing Inquiry: Request technical feasibility study for [${study.projectName}]`,
                  })
                }
                size="sm"
                className="bg-[#155EEF] hover:bg-[#0d4ecc] text-white text-xs font-bold font-mono h-9 cursor-pointer"
              >
                Request Sizing Proposal →
              </Button>

              <Link
                to="/solutions"
                className="text-xs font-mono font-bold text-slate-600 hover:text-[#155EEF] flex items-center gap-1"
              >
                <span>View Full Portfolio</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
