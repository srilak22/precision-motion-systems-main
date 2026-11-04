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
  RotateCw,
  FileText,
  Activity,
  HardDrive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModals } from "@/components/modals/ModalContext";
import { images } from "@/lib/images";
import heroWeldingCell from "@/assets/hero/hero-welding-cell.jpg";
import heroProductionLine from "@/assets/hero/hero-production-line.jpg";

interface ConfigOption {
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

const CONFIG_OPTIONS: ConfigOption[] = [
  {
    id: "battery-kitting",
    tabLabel: "Battery Module Kitting",
    badge: "HIGH-SPEED CARTESIAN & ARTICULATED",
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
    badge: "HIGH-DUTY 7TH-AXIS WELDING",
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
      "Built to withstand continuous coolant spray, high-temperature forged billet loading, and dual-gripper pneumatic pallet exchanges for machining centers.",
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

export function VerticalConfigurator() {
  const { openModal } = useModals();
  const [selectedTab, setSelectedTab] = useState<string>("battery-kitting");
  const selected = CONFIG_OPTIONS.find((c) => c.id === selectedTab) || CONFIG_OPTIONS[0];

  const handleDownload = (filename: string) => {
    openModal("engineer", {
      initialMessage: `CAD & Sizing Request: Download CAD package and sizing dossier for [${selected.modelName}] (${filename})`,
    });
  };

  return (
    <section className="bg-[#0B0F17] py-16 sm:py-24 border-b border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-xs font-mono font-bold text-[#00F0FF] uppercase mb-4">
            <Sliders size={13} />
            <span>INTERACTIVE WORKCELL CONFIGURATOR</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase leading-tight mb-4">
            Select Your Automotive{" "}
            <span className="bg-gradient-to-r from-[#00F0FF] via-[#38BDF8] to-[#0052FF] bg-clip-text text-transparent">
              Automation Requirement
            </span>
          </h2>

          <p className="text-slate-400 text-base leading-relaxed font-normal">
            Toggle between core automotive automation processes to inspect the matching kinematic models, payload
            capacities, cycle times, and directly download engineering CAD files.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2.5 mb-8 pb-3 border-b border-slate-800/80">
          {CONFIG_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSelectedTab(opt.id)}
              className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-mono tracking-wider font-bold transition-all cursor-pointer flex items-center gap-2 ${
                selectedTab === opt.id
                  ? "bg-[#00F0FF] text-slate-950 shadow-lg shadow-[#00F0FF]/25 border border-[#00F0FF]"
                  : "bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700"
              }`}
            >
              <span>{opt.tabLabel}</span>
            </button>
          ))}
        </div>

        {/* Main Configurator Display Panel */}
        <div className="rounded-3xl bg-[#0D1424]/90 backdrop-blur-md border border-white/10 p-6 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Robot Visual & Badges */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800/80">
                <img
                  src={selected.image}
                  alt={selected.modelName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />

                {/* Badge Overlay */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded bg-[#00F0FF] text-slate-950 text-[10px] font-mono font-black uppercase">
                    {selected.badge}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-cyan-200 bg-slate-950/80 backdrop-blur-md p-2 rounded-lg border border-white/10">
                  <span className="font-bold">{selected.modelName}</span>
                  <span className="text-[#00F0FF]">{selected.specs.payload}</span>
                </div>
              </div>

              {/* Download Buttons Bar */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleDownload(selected.cadFilename)}
                  className="bg-slate-900 hover:bg-slate-800 text-cyan-300 border-cyan-500/30 hover:border-[#00F0FF] text-xs font-mono font-bold h-10 px-3 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Download size={13} />
                  <span>Download 3D CAD</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => handleDownload(selected.datasheetFilename)}
                  className="bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-500 text-xs font-mono font-bold h-10 px-3 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <FileText size={13} />
                  <span>Datasheet PDF</span>
                </Button>
              </div>
            </div>

            {/* Right Column: Kinematics Specs & Capabilities */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="text-xs font-mono text-[#00F0FF] font-bold uppercase mb-1">
                  // {selected.kinematicsType}
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3">
                  {selected.modelName}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed font-normal">
                  {selected.description}
                </p>
              </div>

              {/* 6-Cell Engineering Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Payload Rating</div>
                  <div className="text-sm font-mono font-bold text-[#00F0FF] mt-0.5">{selected.specs.payload}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Reach Envelope</div>
                  <div className="text-sm font-mono font-bold text-white mt-0.5">{selected.specs.reach}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Repeatability</div>
                  <div className="text-sm font-mono font-bold text-[#00F0FF] mt-0.5">{selected.specs.repeatability}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">DOF / Axis Count</div>
                  <div className="text-sm font-mono font-bold text-white mt-0.5">{selected.specs.axes}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Ingress Protection</div>
                  <div className="text-sm font-mono font-bold text-emerald-400 mt-0.5">{selected.specs.ipRating}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Deterministic Bus</div>
                  <div className="text-sm font-mono font-bold text-cyan-300 mt-0.5">{selected.specs.fieldbus}</div>
                </div>
              </div>

              {/* Key Features List */}
              <div>
                <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                  Architectural Highlights:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                  {selected.keyFeatures.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-[#00F0FF] shrink-0 mt-0.5" />
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-3">
                <Button
                  onClick={() =>
                    openModal("engineer", {
                      initialMessage: `Configurator Proposal Request: Sizing proposal for [${selected.modelName}]`,
                    })
                  }
                  className="bg-[#00F0FF] hover:bg-[#38BDF8] text-slate-950 font-black text-xs font-mono h-11 px-6 rounded-xl shadow-lg shadow-[#00F0FF]/20 cursor-pointer"
                >
                  Request Sizing Proposal
                  <ArrowRight size={14} className="ml-1.5" />
                </Button>

                <Link
                  to="/technology/physical-ai"
                  className="inline-flex items-center justify-center h-11 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold transition-colors cursor-pointer"
                >
                  <Sparkles size={14} className="mr-1.5 text-[#00F0FF]" />
                  <span>Simulate in Motion Studio</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
