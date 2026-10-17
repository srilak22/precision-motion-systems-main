import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Layers,
  Cpu,
  Zap,
  Cog,
  Wrench,
  ArrowRight,
  CheckCircle2,
  Share2,
  Activity,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModals } from "@/components/modals/ModalContext";

interface ArchLayer {
  id: string;
  name: string;
  level: number;
  icon: React.ReactNode;
  description: string;
  protocolBus: string;
  components: {
    id: string;
    name: string;
    categorySlug: string;
    modelCode: string;
    role: string;
    interfaces: string[];
    upstream: string;
    downstream: string;
  }[];
}

const ARCHITECTURE_LAYERS: ArchLayer[] = [
  {
    id: "supervisory",
    name: "Layer 1: Supervisory & Plant Cell Control",
    level: 1,
    icon: <Cpu className="size-5 text-signal" />,
    description:
      "Cell sequencing, safety interlock orchestration, plant MES/SCADA integration, and recipe coordination.",
    protocolBus: "OPC UA, PROFINET, EtherNet/IP, MQTT (10 - 100 ms)",
    components: [
      {
        id: "plc-automation",
        name: "PLC & Automation Controller",
        categorySlug: "control-systems",
        modelCode: "IND-CTL-PLC-61131",
        role: "Coordinates cell interlocks, light curtains, and MES work orders.",
        interfaces: ["PROFINET IRT", "EtherNet/IP", "OPC UA", "FSoE Safety"],
        upstream: "Enterprise MES / SCADA Database",
        downstream: "Robot & Motion Controllers via EtherCAT Master Bridge",
      },
    ],
  },
  {
    id: "motion",
    name: "Layer 2: Real-Time Kinematic & Trajectory Coordination",
    level: 2,
    icon: <Activity className="size-5 text-cyan-400" />,
    description:
      "Deterministic trajectory calculation, 6-DoF inverse kinematics, electronic camming, and path interpolation.",
    protocolBus: "EtherCAT CoE Master, Distributed Clock (< 1 µs jitter, 250 µs - 1 ms cycle)",
    components: [
      {
        id: "robot-controllers",
        name: "Real-Time Robot Controller",
        categorySlug: "control-systems",
        modelCode: "IND-CTL-RBC-X86-RT",
        role: "Calculates joint velocity & torque trajectories for 6-axis and Delta arms.",
        interfaces: ["EtherCAT CoE Master", "10.1-inch Teach Pendant", "Dual Safety Bus"],
        upstream: "Layer 1 Cell PLC",
        downstream: "Layer 3 Digital Servo Drives via EtherCAT Ring",
      },
      {
        id: "motion-controllers",
        name: "64-Axis Deterministic Motion Controller",
        categorySlug: "control-systems",
        modelCode: "IND-CTL-MTC-064-EC",
        role: "Coordinates up to 64 physical axes with electronic camming and CNC G-code.",
        interfaces: ["EtherCAT Dual Master", "8x Hardware Fast Registration Probes"],
        upstream: "Layer 1 Plant Network",
        downstream: "Layer 3 Gantry & Conveyor Servo Drives",
      },
    ],
  },
  {
    id: "drive",
    name: "Layer 3: Power Conversion & Servo Amplification",
    level: 3,
    icon: <Zap className="size-5 text-amber-400" />,
    description:
      "High-bandwidth current loop regulation, field-oriented control (FOC), and functional Safe Torque Off (STO).",
    protocolBus: "FOC Current Loop at 32 kHz, Dual Encoder BiSS-C Feedback",
    components: [
      {
        id: "servo-drives",
        name: "Digital GaN Servo Drive Amplifier",
        categorySlug: "control-systems",
        modelCode: "IND-CTL-SRV-048-GN",
        role: "Regulates 3-phase motor current with 32 kHz loop rate and integrated STO SIL 3.",
        interfaces: ["48VDC / 400VAC Bus", "BiSS-C / EnDat 2.2 Dual Port", "Hardware STO"],
        upstream: "Layer 2 EtherCAT Motion Commands (CSP / CSV)",
        downstream: "Layer 4 & 5 Motor Windings & Joint Feedback Scales",
      },
      {
        id: "sensors-feedback",
        name: "Absolute Optical Encoder & F/T Sensor",
        categorySlug: "control-systems",
        modelCode: "IND-SNS-ENC-026-BC",
        role: "Reports true joint angle (26-bit) and 6-axis wrist contact forces.",
        interfaces: ["10 MHz BiSS-C Serial", "Pure Digital CRC-6 Checked Telegram"],
        upstream: "Layer 3 Servo Drive Feedback Port",
        downstream: "Directly coupled to Motor Rotor and Output Flange",
      },
    ],
  },
  {
    id: "transmission",
    name: "Layer 4: Mechanical Torque Multiplication & Reduction",
    level: 4,
    icon: <Cog className="size-5 text-indigo-400" />,
    description:
      "Torque amplification, speed reduction, and inertia matching with zero or minimal backlash.",
    protocolBus: "Mechanical Flange Coupling (ISO 9409-1 / NEMA / IEC Spigot)",
    components: [
      {
        id: "harmonic",
        name: "Zero-Backlash Strain Wave Reducer",
        categorySlug: "precision-reducers",
        modelCode: "IND-RED-HMC-025-CS",
        role: "Zero-backlash transmission (< 1 arcmin) for robot wrists and cobots.",
        interfaces: ["ISO 9409-1-50-4-M6", "Center Hollow Bore Ø25mm"],
        upstream: "Frameless Servomotor Rotor",
        downstream: "Robot Arm Link Castings and Wrist Tooling",
      },
      {
        id: "cycloidal",
        name: "High-Shock Cycloidal Pin-Wheel Reducer",
        categorySlug: "precision-reducers",
        modelCode: "IND-RED-CYC-160-RV",
        role: "Absorbs up to 500% shock loads on heavy robot base joints J1-J3.",
        interfaces: ["Heavy Robot Flange Ø220mm", "Hollow Cable Bore Ø55mm"],
        upstream: "Layer 3 AC Servomotor",
        downstream: "Heavy Manipulator Shoulder & Elbow Castings",
      },
      {
        id: "planetary",
        name: "Precision Inline Planetary Gearbox",
        categorySlug: "precision-reducers",
        modelCode: "IND-RED-PLN-090-P1",
        role: "High-efficiency (>97%) speed reduction for Cartesian gantries and linear axes.",
        interfaces: ["Universal Motor Clamping Hub", "Smooth/Keyed Output Shaft"],
        upstream: "Layer 3 Standard Servo Motor",
        downstream: "Ball Screw or Rack-and-Pinion Drive Drivetrain",
      },
      {
        id: "gearboxes",
        name: "Right-Angle Helical-Bevel Gearbox",
        categorySlug: "precision-reducers",
        modelCode: "IND-RED-IND-220-RA",
        role: "Space-saving 90° right-angle torque redirection for heavy transfer axes.",
        interfaces: ["B5 Flange / Hollow Shrink Disc", "Cast Iron Housing"],
        upstream: "Horizontal Servo Motor",
        downstream: "Vertical Gantry or Conveyor Line Indexer",
      },
    ],
  },
  {
    id: "execution",
    name: "Layer 5: Actuation, Kinematics & Physical Work Execution",
    level: 5,
    icon: <Wrench className="size-5 text-emerald-400" />,
    description:
      "Physical tool path manipulation, linear transfer, part gripping, welding, and mobile navigation.",
    protocolBus: "Physical ISO Tool Flange, Pneumatic Lines, End-Effectors",
    components: [
      {
        id: "linear",
        name: "Precision Guided Linear Slide Actuator",
        categorySlug: "actuators",
        modelCode: "IND-ACT-LIN-200-B",
        role: "Converts motor rotation into guided linear travel up to 2500mm.",
        interfaces: ["Precision Ball Screw C5", "Dual Gothic-Arch Linear Guides"],
        upstream: "Layer 4 Planetary Reducer / Servomotor",
        downstream: "End-Effector Tooling or Multi-Axis Gantry Cross-Slide",
      },
      {
        id: "rotary",
        name: "Direct Drive Rotary Hollow Actuator",
        categorySlug: "actuators",
        modelCode: "IND-ACT-ROT-140-DD",
        role: "Zero-backlash direct-drive rotary indexing and joint articulation.",
        interfaces: ["Crossed Roller Bearings", "Large Hollow Bore Ø45mm"],
        upstream: "Layer 3 FOC Servo Inverter",
        downstream: "Precision Rotary Dial Table or Robot J1 Base",
      },
      {
        id: "electric",
        name: "ISO 15552 Electric Positioning Cylinder",
        categorySlug: "actuators",
        modelCode: "IND-ACT-ELE-063-ISO",
        role: "Replaces pneumatics with programmable multi-stop force-regulated pressing.",
        interfaces: ["ISO 15552 Pneumatic Standard Flange", "Roller Screw Drivetrain"],
        upstream: "Layer 3 Digital Servo Drive",
        downstream: "Press-fit Collet, Clamping Fixture, or Part Pusher",
      },
      {
        id: "servo",
        name: "All-in-One Smart Integrated Servo Actuator",
        categorySlug: "actuators",
        modelCode: "IND-ACT-SRV-090-INT",
        role: "Self-contained cobot joint uniting motor, reducer, encoder, and drive.",
        interfaces: ["Daisy-Chain EtherCAT Ports", "ISO 9409-1 Flange"],
        upstream: "48VDC Power Bus & EtherCAT Daisy Chain",
        downstream: "Next Robot Joint Link in Kinematic Chain",
      },
      {
        id: "6-axis",
        name: "High-Precision 6-Axis Articulated Robot",
        categorySlug: "robotic-arms",
        modelCode: "IND-ARM-6AX-1400-P",
        role: "Universal 1420mm reach articulated manipulator for handling and tending.",
        interfaces: ["ISO 9409-1-50-4-M6 Tool Flange", "IP67 Sealed Wrist"],
        upstream: "Layer 2 RC-600 Controller via Dedicated Harness",
        downstream: "Grippers, Dispensing Heads, or Laser Scanners",
      },
      {
        id: "collaborative",
        name: "Human-Collaborative Robot Arm (Cobot)",
        categorySlug: "robotic-arms",
        modelCode: "IND-ARM-COB-1000-C",
        role: "Direct fence-free human-robot collaboration with dual joint torque limiting.",
        interfaces: ["Lead-Through Programming Flange", "Integrated Torque Sensors"],
        upstream: "Layer 2 Compact Cobot Controller",
        downstream: "Collaborative Electric Gripper or Vision Sensor",
      },
      {
        id: "pick-and-place",
        name: "High-Speed Parallel Delta Robot",
        categorySlug: "robotic-arms",
        modelCode: "IND-ARM-DLT-1200-F",
        role: "Ultra-fast pick-and-place up to 180 picks/min over moving conveyors.",
        interfaces: ["Carbon Fiber Parallel Rods", "Titanium Tool Platform"],
        upstream: "Layer 2 Multi-Axis Synchronized Drive System",
        downstream: "High-Speed Vacuum Suction Cup Array",
      },
      {
        id: "mobile-modules",
        name: "Dual-Servo Swerve Drive AMR Mobile Module",
        categorySlug: "robotic-wheels",
        modelCode: "IND-MOD-SWR-300-SD",
        role: "Omnidirectional 360° swerve steering and traction for warehouse AMRs.",
        interfaces: ["48VDC Battery Bus", "ROS 2 Nav2 Swerve Controller Interface"],
        upstream: "Layer 2 Chassis Navigation Computer",
        downstream: "Warehouse Floor Contact Surface",
      },
    ],
  },
];

const PRESETS = [
  {
    name: "Automotive Body Spot Welding Cell",
    description: "Heavy articulated robot coupled with cycloidal reduction and welding controller.",
    activeIds: ["plc-automation", "robot-controllers", "servo-drives", "cycloidal", "6-axis"],
  },
  {
    name: "High-Speed Electronics BGA Assembly Line",
    description: "SCARA robotics and precision linear slide modules with vision latching.",
    activeIds: ["plc-automation", "motion-controllers", "servo-drives", "sensors-feedback", "linear"],
  },
  {
    name: "Autonomous Mobile Swerve AMR Transporter",
    description: "Low-voltage 48V GaN drives controlling dual-servo swerve traction modules.",
    activeIds: ["motion-controllers", "servo-drives", "planetary", "mobile-modules"],
  },
  {
    name: "High-Speed Delta Food Packaging Cell",
    description: "Parallel kinematics delta robot synchronized with conveyor vision tracking.",
    activeIds: ["plc-automation", "robot-controllers", "servo-drives", "pick-and-place"],
  },
];

export function ComponentArchitectureExplorer() {
  const { openModal } = useModals();
  const [selectedComponentId, setSelectedComponentId] = useState<string>("6-axis");
  const [highlightedPreset, setHighlightedPreset] = useState<string | null>(null);

  // Find currently selected component metadata
  let selectedComp: (typeof ARCHITECTURE_LAYERS)[0]["components"][0] | null = null;
  let selectedLayer: (typeof ARCHITECTURE_LAYERS)[0] | null = null;

  for (const layer of ARCHITECTURE_LAYERS) {
    const found = layer.components.find((c) => c.id === selectedComponentId);
    if (found) {
      selectedComp = found;
      selectedLayer = layer;
      break;
    }
  }

  const handleApplyPreset = (presetName: string) => {
    const preset = PRESETS.find((p) => p.name === presetName);
    if (preset) {
      setHighlightedPreset(presetName);
      const targetId = preset.activeIds[preset.activeIds.length - 1];
      if (targetId) setSelectedComponentId(targetId);
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Explorer Header */}
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded bg-signal/15 text-signal font-mono font-bold text-xs">
                SYS
              </span>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-signal">
                System Topology & Integration Matrix
              </p>
            </div>
            <h2 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight text-foreground sm:text-3xl">
              Component-to-System Architecture Explorer
            </h2>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              Trace signals, industrial fieldbuses, and mechanical power flow across all 5 architectural layers.
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Pre-Configured Architecture Topologies
            </p>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handleApplyPreset(preset.name)}
                  className={`rounded px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide transition-colors ${
                    highlightedPreset === preset.name
                      ? "bg-signal text-signal-foreground font-black"
                      : "border border-border bg-muted/30 text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                  }`}
                >
                  {preset.name.split(" ")[0]} {preset.name.split(" ")[1]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Explorer Grid */}
      <div className="grid gap-8 lg:grid-cols-[1.3fr_.7fr]">
        {/* Left: 5-Layer System Visualizer */}
        <div className="space-y-6">
          {ARCHITECTURE_LAYERS.map((layer) => (
            <div
              key={layer.id}
              className="rounded-lg border border-border bg-card p-5 shadow-sm transition-all hover:border-border/80"
            >
              {/* Layer Title & Protocol */}
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between border-b border-border/50 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded bg-muted/60 border border-border">
                    {layer.icon}
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">
                      {layer.name}
                    </h3>
                    <p className="text-[11px] text-muted-foreground">{layer.description}</p>
                  </div>
                </div>
                <div className="mt-2 sm:mt-0 flex items-center gap-1.5 rounded bg-muted/30 px-2.5 py-1 text-[10px] font-mono text-muted-foreground">
                  <Share2 size={12} className="text-signal" />
                  <span>{layer.protocolBus}</span>
                </div>
              </div>

              {/* Component Buttons in this layer */}
              <div className="mt-4 flex flex-wrap gap-2">
                {layer.components.map((comp) => {
                  const isSelected = comp.id === selectedComponentId;
                  const isPresetActive =
                    highlightedPreset &&
                    PRESETS.find((p) => p.name === highlightedPreset)?.activeIds.includes(comp.id);

                  return (
                    <button
                      key={comp.id}
                      onClick={() => {
                        setSelectedComponentId(comp.id);
                        setHighlightedPreset(null);
                      }}
                      className={`group relative rounded border px-3.5 py-2 text-left transition-all ${
                        isSelected
                          ? "border-signal bg-signal/10 ring-1 ring-signal text-foreground shadow-sm"
                          : isPresetActive
                          ? "border-signal/50 bg-surface-elevated text-foreground"
                          : "border-border bg-muted/20 text-muted-foreground hover:border-border/90 hover:bg-muted/40 hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-display text-xs font-bold uppercase tracking-wide">
                          {comp.name}
                        </span>
                        {isSelected && <CheckCircle2 size={13} className="text-signal shrink-0" />}
                      </div>
                      <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                        {comp.modelCode}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Right: Component Detail & Signal Route Dossier */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm space-y-6 flex flex-col justify-between sticky top-24 self-start">
          {selectedComp && selectedLayer ? (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[.22em] text-signal">
                      {selectedLayer.name.split(":")[0]} Node
                    </span>
                    <h3 className="font-display text-xl font-bold uppercase tracking-tight text-foreground">
                      {selectedComp.name}
                    </h3>
                  </div>
                  <span className="rounded bg-muted px-2 py-0.5 font-mono text-[11px] text-foreground">
                    {selectedComp.modelCode}
                  </span>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  {selectedComp.role}
                </p>
              </div>

              {/* Upstream & Downstream Flow Diagram */}
              <div className="space-y-3 rounded border border-border bg-muted/20 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Signal & Mechanical Coupling Topology
                </p>

                <div className="space-y-2 text-xs">
                  {/* Upstream */}
                  <div className="rounded border border-border/60 bg-background/80 p-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-cyan-400">
                      ▲ Upstream Input:
                    </span>
                    <p className="mt-0.5 text-xs text-foreground font-medium">
                      {selectedComp.upstream}
                    </p>
                  </div>

                  {/* Current Node */}
                  <div className="rounded border border-signal/60 bg-signal/10 p-2.5 text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-signal font-mono">
                      [Active Node: {selectedComp.modelCode}]
                    </span>
                  </div>

                  {/* Downstream */}
                  <div className="rounded border border-border/60 bg-background/80 p-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-amber-400">
                      ▼ Downstream Output:
                    </span>
                    <p className="mt-0.5 text-xs text-foreground font-medium">
                      {selectedComp.downstream}
                    </p>
                  </div>
                </div>
              </div>

              {/* Supported Interface Standards */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Standardized Fieldbuses & Interfaces
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {selectedComp.interfaces.map((iface) => (
                    <span
                      key={iface}
                      className="rounded border border-border bg-muted/40 px-2 py-1 font-mono text-[10px] text-foreground"
                    >
                      {iface}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4 border-t border-border">
                <Link
                  to="/products/$category/$id"
                  params={{
                    category: selectedComp.categorySlug,
                    id: selectedComp.id,
                  }}
                  className="w-full inline-flex items-center justify-center gap-1.5 h-10 rounded border border-border bg-muted/40 hover:bg-muted text-xs font-bold uppercase text-foreground transition-colors"
                >
                  View Component PDP & Specs <ExternalLink size={13} />
                </Link>

                <Button
                  className="w-full h-10 rounded bg-signal text-signal-foreground font-bold uppercase text-xs"
                  onClick={() =>
                    openModal("quote", {
                      productName: `${selectedComp?.name} (${selectedComp?.modelCode})`,
                      categoryName: selectedComp?.categorySlug || "Components",
                    })
                  }
                >
                  Request System Integration RFQ <ArrowRight size={13} className="ml-1" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-muted-foreground">
              Select any component node from the left architecture layers to inspect its interface requirements.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
