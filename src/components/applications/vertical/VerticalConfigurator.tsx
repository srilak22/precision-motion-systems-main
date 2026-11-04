import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Cpu,
  Layers,
  Download,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  FileText,
  Activity,
  Rotate3d,
  Box,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModals } from "@/components/modals/ModalContext";
import { ProductCadViewer } from "@/components/products/ProductCadViewer";
import { images } from "@/lib/images";
import heroWeldingCell from "@/assets/hero/hero-welding-cell.jpg";
import heroProductionLine from "@/assets/hero/hero-production-line.jpg";

export interface ConfigOption {
  id: string;
  tabLabel: string;
  badge: string;
  modelName: string;
  kinematicsType: string;
  image: string;
  description: string;
  specs: {
    payload: string;
    reach: string;
    repeatability: string;
    axes: string;
    ipRating: string;
    fieldbus: string;
  };
  keyFeatures: string[];
  cadFilename: string;
  datasheetFilename: string;
}

export const AUTOMOTIVE_CONFIG_OPTIONS: ConfigOption[] = [
  {
    id: "battery-kitting",
    tabLabel: "Battery Module Kitting",
    badge: "CARTESIAN & ARTICULATED WORKCELL",
    modelName: "INDUS-BAT-K150 (7-DOF)",
    kinematicsType: "6-Axis Articulated Arm + Synchronized Cartesian Dispense Rail",
    image: heroProductionLine,
    description:
      "Engineered specifically for prismatic cell stacking, busbar tightening, and high-voltage module casing insertion with constant 6-DOF force/torque regulation.",
    specs: {
      payload: "150 kg dynamic",
      reach: "2,650 mm radius",
      repeatability: "±0.015 mm",
      axes: "6 + 1 Auxiliary",
      ipRating: "IP65 (Clean Enclosure)",
      fieldbus: "EtherCAT CoE / TwinCAT 3",
    },
    keyFeatures: [
      "Integrated laser triangulation seam height profiling",
      "Dynamic anti-vibration damping on sudden deceleration",
      "Zero-backlash cycloidal joints with torque telemetry",
      "Automated high-voltage insulation dielectric check",
    ],
    cadFilename: "INDUS_BAT_K150_3D_ASSEMBLY.STEP",
    datasheetFilename: "INDUS_BAT_K150_Datasheet_2026.pdf",
  },
  {
    id: "laser-welding",
    tabLabel: "Adaptive Laser Seam Welding",
    badge: "7TH-AXIS LINEAR WELDING CELL",
    modelName: "INDUS-WELD-R210-7X",
    kinematicsType: "High-Payload 6-Axis Manipulator on 12m Servo Linear Track",
    image: heroWeldingCell,
    description:
      "Purpose-built for automotive BIW structural framing, battery tray leak-tight perimeter welding, and exhaust hydroformed component joining.",
    specs: {
      payload: "210 kg dynamic",
      reach: "3,100 mm + 12m Rail",
      repeatability: "±0.020 mm",
      axes: "7 Continuous Coordinated",
      ipRating: "IP67 (Spatter Shielded)",
      fieldbus: "PROFINET IRT / Beckhoff EtherCAT",
    },
    keyFeatures: [
      "Sub-pixel optical seam following @ 120 FPS camera sync",
      "Multi-layer laser power closed-loop regulation",
      "Dual safety laser scanner safety zone muting",
      "Automatic torch cleaner and nozzle reamer cycle",
    ],
    cadFilename: "INDUS_WELD_R210_7X_3D_STEP.zip",
    datasheetFilename: "INDUS_WELD_R210_Specifications.pdf",
  },
  {
    id: "cnc-tending",
    tabLabel: "CNC Machine Tending",
    badge: "HEAVY ARTICULATED TENDING",
    modelName: "INDUS-TEND-HD350",
    kinematicsType: "Heavy-Duty Pedestal Articulated Robotic Arm",
    image: images.arm,
    description:
      "Extreme-duty articulated robot tending multiple machining centers with dual pneumatic zero-point tool changers for rapid finished-to-raw part transfer.",
    specs: {
      payload: "350 kg dynamic",
      reach: "2,850 mm radius",
      repeatability: "±0.025 mm",
      axes: "6-Axis Articulated",
      ipRating: "IP67 / Wrist IP69K",
      fieldbus: "Siemens PROFIsafe / EtherNet/IP",
    },
    keyFeatures: [
      "Dual pneumatic gripper for sub-8s finished-to-raw part swap",
      "Air-purge pressurized arm casting for hostile swarf",
      "Direct handshake with Siemens 840D / Fanuc CNC controllers",
      "Integrated machine door and pneumatic clamp interlocks",
    ],
    cadFilename: "INDUS_TEND_HD350_CAD_MODEL.STEP",
    datasheetFilename: "INDUS_TEND_HD350_Technical_Data.pdf",
  },
];

interface VerticalConfiguratorProps {
  title?: string;
  subtitle?: string;
  options?: ConfigOption[];
}

export function VerticalConfigurator({
  title = "Select Your Automation Requirement",
  subtitle = "Toggle between core industrial automation processes to inspect the matching kinematic models, payload capacities, cycle times, and directly download engineering CAD files.",
  options = AUTOMOTIVE_CONFIG_OPTIONS,
}: VerticalConfiguratorProps) {
  const { openModal } = useModals();
  const [selectedTab, setSelectedTab] = useState<string>(options[0]?.id || "battery-kitting");
  const [viewMode, setViewMode] = useState<"render" | "3d">("render");
  const selected = options.find((c) => c.id === selectedTab) || options[0];

  const handleDownloadCad = (filename: string) => {
    openModal("engineer", {
      initialMessage: `CAD Sizing Request: Download [${filename}] for [${selected.modelName}]`,
    });
  };

  const handleDownloadPdf = (filename: string) => {
    openModal("engineer", {
      initialMessage: `Datasheet Request: Download [${filename}] for [${selected.modelName}]`,
    });
  };

  return (
    <section className="bg-[#F8FAFC] py-16 sm:py-24 border-b border-slate-200/90 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-mono font-bold text-[#1D4ED8] uppercase mb-4 shadow-2xs">
            <Sliders size={13} />
            <span>INTERACTIVE WORKCELL CONFIGURATOR</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            {title}
          </h2>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-normal">
            {subtitle}
          </p>
        </div>

        {/* Tab Selection Bar */}
        <div className="flex flex-wrap gap-2.5 p-1.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm mb-8">
          {options.map((opt) => {
            const isCurrent = opt.id === selectedTab;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedTab(opt.id)}
                className={`flex-1 min-w-[200px] py-3.5 px-4 rounded-xl text-xs font-mono font-bold transition-all text-center cursor-pointer ${
                  isCurrent
                    ? "bg-[#1D4ED8] text-white shadow-md shadow-blue-500/20"
                    : "text-slate-700 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <span>{opt.tabLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Active Workcell Details Grid */}
        <div className="rounded-2xl border border-slate-200/90 bg-white shadow-sm p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left Column: Visual & 3D CAD Preview */}
            <div className="lg:col-span-5 space-y-4">
              {/* View Switcher: 2D Workcell View vs 3D Model Kinematics */}
              <div className="flex items-center justify-between pb-1">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                  VISUALIZATION MODE:
                </span>
                <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-[11px] font-mono">
                  <button
                    type="button"
                    onClick={() => setViewMode("render")}
                    className={`px-2.5 py-1 rounded-md font-bold transition-colors cursor-pointer ${
                      viewMode === "render"
                        ? "bg-white text-slate-900 shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Workcell Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("3d")}
                    className={`px-2.5 py-1 rounded-md font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                      viewMode === "3d"
                        ? "bg-[#1D4ED8] text-white shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Rotate3d size={12} />
                    <span>3D CAD Stage</span>
                  </button>
                </div>
              </div>

              {viewMode === "3d" ? (
                <ProductCadViewer
                  modelName={selected.modelName}
                  modelCode={selected.modelName.split(" ")[0]}
                  cadFormat="STEP AP242"
                  cadFilename={selected.cadFilename}
                  posterImage={selected.image}
                  onDownloadCad={() => handleDownloadCad(selected.cadFilename)}
                />
              ) : (
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200/90 bg-slate-950 shadow-sm">
                  <img
                    src={selected.image}
                    alt={selected.modelName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30" />

                  {/* Badge Overlay */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded bg-[#1D4ED8] text-white text-[10px] font-mono font-bold uppercase shadow-sm">
                      {selected.badge}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-white bg-slate-950/80 backdrop-blur-md p-2.5 rounded-lg border border-white/10">
                    <span className="font-bold">{selected.modelName}</span>
                    <span className="text-cyan-300 font-bold">{selected.specs.payload}</span>
                  </div>
                </div>
              )}

              {/* Explicit Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                <Button
                  onClick={() => handleDownloadCad(selected.cadFilename)}
                  className="bg-[#1D4ED8] hover:bg-[#155EEF] text-white text-xs font-mono font-bold h-11 px-4 cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                >
                  <Download size={14} />
                  <span>Download .STEP Assembly</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => handleDownloadPdf(selected.datasheetFilename)}
                  className="bg-white hover:bg-slate-50 text-slate-800 border-slate-300 hover:border-[#1D4ED8] text-xs font-mono font-bold h-11 px-4 cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
                >
                  <FileText size={14} className="text-[#1D4ED8]" />
                  <span>Download PDF Datasheet</span>
                </Button>
              </div>
            </div>

            {/* Right Column: Kinematics Specs & Capabilities */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="text-xs font-mono text-[#1D4ED8] font-bold uppercase mb-1">
                  // {selected.kinematicsType}
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2.5">
                  {selected.modelName}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {selected.description}
                </p>
              </div>

              {/* 6-Cell Engineering Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
                  <div className="text-[10px] font-mono text-slate-500 uppercase font-medium">Payload Rating</div>
                  <div className="text-sm font-mono font-bold text-[#1D4ED8] mt-0.5">{selected.specs.payload}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
                  <div className="text-[10px] font-mono text-slate-500 uppercase font-medium">Reach Envelope</div>
                  <div className="text-sm font-mono font-bold text-slate-900 mt-0.5">{selected.specs.reach}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
                  <div className="text-[10px] font-mono text-slate-500 uppercase font-medium">Repeatability</div>
                  <div className="text-sm font-mono font-bold text-[#1D4ED8] mt-0.5">{selected.specs.repeatability}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
                  <div className="text-[10px] font-mono text-slate-500 uppercase font-medium">DOF / Axis Count</div>
                  <div className="text-sm font-mono font-bold text-slate-900 mt-0.5">{selected.specs.axes}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
                  <div className="text-[10px] font-mono text-slate-500 uppercase font-medium">Ingress Protection</div>
                  <div className="text-sm font-mono font-bold text-emerald-600 mt-0.5">{selected.specs.ipRating}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
                  <div className="text-[10px] font-mono text-slate-500 uppercase font-medium">Deterministic Bus</div>
                  <div className="text-sm font-mono font-bold text-[#1D4ED8] mt-0.5">{selected.specs.fieldbus}</div>
                </div>
              </div>

              {/* Key Features List */}
              <div>
                <div className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                  Architectural Highlights:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selected.keyFeatures.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 p-2.5 rounded-lg bg-blue-50/50 border border-blue-100/70 text-xs text-slate-800"
                    >
                      <CheckCircle2 size={14} className="text-[#1D4ED8] shrink-0 mt-0.5" />
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Consultation CTA */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs font-mono text-slate-500">
                  Custom kinematic envelope or tooling requirement?
                </div>
                <button
                  type="button"
                  onClick={() =>
                    openModal("engineer", {
                      initialMessage: `Feasibility Review: Request for [${selected.modelName}] in Automotive Automation`,
                    })
                  }
                  className="font-mono text-xs font-bold text-[#1D4ED8] hover:text-[#1e40af] inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Request Engineering Review →</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
