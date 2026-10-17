import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Layers,
  ArrowRight,
} from "lucide-react";
import { ProductImage } from "@/components/common/ProductImage";
import { useModals } from "@/components/modals/ModalContext";

export interface RobotJointLayer {
  id: string;
  name: string;
  axis: string;
  category: string;
  productSlug: string;
  categorySlug: string;
  dossierId: string;
  description: string;
  role: string;
  specSummary: {
    ratio: string;
    backlash: string;
    repeatability: string;
    payloadOrTorque: string;
  };
  svgHotspot: { cx: number; cy: number; r: number };
}

export const ROBOT_ANATOMY_LAYERS: RobotJointLayer[] = [
  {
    id: "layer-j1",
    name: "J1 Base Azimuth Turret",
    axis: "Axis 1 (Base Rotation)",
    category: "Precision Reducers",
    productSlug: "cycloidal",
    categorySlug: "precision-reducers",
    dossierId: "cycloidal",
    description: "High-rigidity cycloidal pinwheel drive absorbing multi-thousand Nm overturning tilting moments from extended arm reach.",
    role: "Absorbs full-arm cantilever tipping moments and provides 360° continuous foundation rotation.",
    specSummary: {
      ratio: "81:1 / 119:1",
      backlash: "< 1.0 arcmin",
      repeatability: "±0.005 mm",
      payloadOrTorque: "1,450 Nm Acceleration Torque",
    },
    svgHotspot: { cx: 280, cy: 380, r: 24 },
  },
  {
    id: "layer-j2",
    name: "J2 Shoulder Elevation Boom",
    axis: "Axis 2 (Shoulder Pivot)",
    category: "Precision Reducers",
    productSlug: "harmonic",
    categorySlug: "precision-reducers",
    dossierId: "harmonic",
    description: "Strain wave transmission with zero-backlash flexible spline, driving vertical lift against dynamic gravity vectors.",
    role: "Lifts the primary boom arm under full payload with zero backlash and smooth velocity profiles.",
    specSummary: {
      ratio: "100:1 / 160:1",
      backlash: "Zero Backlash (< 0.1 arcmin)",
      repeatability: "±0.003 mm",
      payloadOrTorque: "680 Nm Rated Torque",
    },
    svgHotspot: { cx: 280, cy: 290, r: 22 },
  },
  {
    id: "layer-j3",
    name: "J3 Elbow Articulation Link",
    axis: "Axis 3 (Elbow Pivot)",
    category: "Precision Reducers",
    productSlug: "planetary",
    categorySlug: "precision-reducers",
    dossierId: "planetary",
    description: "Precision helical planetary reducer delivering high torsional stiffness and rapid cyclic reversing dynamics.",
    role: "Positions the forearm rapidly while maintaining sub-arcminute lost motion during aggressive high-speed pick-and-place cycles.",
    specSummary: {
      ratio: "50:1 / 70:1",
      backlash: "< 3.0 arcmin",
      repeatability: "±0.010 mm",
      payloadOrTorque: "340 Nm Torque",
    },
    svgHotspot: { cx: 330, cy: 200, r: 20 },
  },
  {
    id: "layer-j4",
    name: "J4 / J5 Forearm & Wrist Pitch",
    axis: "Axis 4 & 5 (Forearm & Wrist)",
    category: "Actuators & Reducers",
    productSlug: "servo",
    categorySlug: "actuators",
    dossierId: "servo",
    description: "Integrated hollow-shaft servo actuator module combining frameless BLDC motor, harmonic gear, and 23-bit optical absolute encoder.",
    role: "Provides compact, high-power-density wrist orientation while allowing internal pneumatic/electrical dress packs through the hollow shaft.",
    specSummary: {
      ratio: "100:1 Integrated",
      backlash: "< 0.5 arcmin",
      repeatability: "±0.005 mm",
      payloadOrTorque: "95 Nm Peak Torque",
    },
    svgHotspot: { cx: 410, cy: 140, r: 18 },
  },
  {
    id: "layer-j6",
    name: "J6 Tool Flange & End-Effector",
    axis: "Axis 6 (Wrist Roll Flange)",
    category: "Robotic Arms & Flanges",
    productSlug: "6-axis",
    categorySlug: "robotic-arms",
    dossierId: "6-axis",
    description: "ISO 9409-1 mechanical mounting flange with integrated torque-angle sensory feedback and deterministic tool bus.",
    role: "Final positioning interface for welding torches, vacuum grippers, inspection cameras, and high-speed rotary spindles.",
    specSummary: {
      ratio: "Direct / Micro-gear",
      backlash: "< 0.1 arcmin",
      repeatability: "±0.005 mm",
      payloadOrTorque: "25 Nm Wrist Moment",
    },
    svgHotspot: { cx: 470, cy: 110, r: 16 },
  },
  {
    id: "layer-plc",
    name: "Deterministic Controller & Fieldbus",
    axis: "Central Motion Brain",
    category: "Control Systems",
    productSlug: "robot-controllers",
    categorySlug: "control-systems",
    dossierId: "robot-controllers",
    description: "Real-time industrial kinematics engine executing 6-axis NURBS curve interpolation over EtherCAT with 250 µs cycle times.",
    role: "Coordinates all 6 joints synchronously, performs inverse kinematics, collision protection, and cloud telemetry integration.",
    specSummary: {
      ratio: "Fieldbus EtherCAT DC",
      backlash: "Deterministic Sync",
      repeatability: "250 µs Cycle Time",
      payloadOrTorque: "Multi-Axis Synchronization",
    },
    svgHotspot: { cx: 210, cy: 425, r: 24 },
  },
];

export function InteractiveRobotAnatomy() {
  const { openModal } = useModals();
  const [activeLayerId, setActiveLayerId] = useState<string>("layer-j2");

  const currentLayer =
    ROBOT_ANATOMY_LAYERS.find((l) => l.id === activeLayerId) || ROBOT_ANATOMY_LAYERS[0];

  return (
    <div className="w-full rounded-2xl border border-border bg-card p-6 lg:p-10 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-border pb-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-signal/30 bg-signal/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-signal">
            <Layers size={13} />
            <span>Interactive Robot Anatomy</span>
          </div>
          <h3 className="mt-2 font-display text-2xl uppercase tracking-tight text-foreground sm:text-3xl">
            6-Axis Articulated Kinematic Architecture
          </h3>
          <p className="mt-1 max-w-2xl text-xs text-muted-foreground sm:text-sm">
            Select any joint tier or control subsystem to inspect internal strain-wave transmissions, cycloidal reducers, servo encoders, and deterministic fieldbus kinematics.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => openModal("engineer", { initialMessage: `Inquiry regarding ${currentLayer.name} architecture.` })}
            className="rounded-md border border-border bg-background px-4 py-2 text-xs font-bold uppercase tracking-wider text-foreground hover:border-signal hover:text-signal transition-colors cursor-pointer"
          >
            Consult Kinematics Engineer
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-start">
        {/* Left Visual Area: Interactive Schematic Diagram */}
        <div className="relative rounded-xl border border-border bg-surface-dark p-6 lg:col-span-7 flex flex-col items-center justify-center min-h-[440px] overflow-hidden">
          {/* Subtle Grid Backdrop */}
          <div className="technical-grid-dense absolute inset-0 opacity-20 pointer-events-none" />

          {/* SVG Robot Kinematic Schematic Wireframe */}
          <svg
            viewBox="0 0 560 480"
            className="w-full max-w-[520px] h-auto select-none"
            aria-label="6-Axis Robot Arm Kinematic Diagram"
          >
            <defs>
              <linearGradient id="armBoneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2388FF" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#16C7E8" stopOpacity="0.3" />
              </linearGradient>
            </defs>

            {/* Pedestal / Ground Base */}
            <path
              d="M 180 440 L 380 440 L 360 410 L 200 410 Z"
              fill="#16243A"
              stroke="#334155"
              strokeWidth="2"
            />
            <line x1="160" y1="440" x2="400" y2="440" stroke="#475569" strokeWidth="3" />

            {/* Bone 1: Base to J2 Shoulder */}
            <path
              d="M 270 410 L 290 410 L 290 300 L 270 300 Z"
              fill="#1E293B"
              stroke="#475569"
              strokeWidth="1.5"
            />

            {/* Bone 2: Shoulder J2 to Elbow J3 */}
            <line
              x1="280"
              y1="290"
              x2="330"
              y2="200"
              stroke="url(#armBoneGrad)"
              strokeWidth="16"
              strokeLinecap="round"
            />
            <line
              x1="280"
              y1="290"
              x2="330"
              y2="200"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeDasharray="4 4"
            />

            {/* Bone 3: Elbow J3 to Wrist J4/J5 */}
            <line
              x1="330"
              y1="200"
              x2="410"
              y2="140"
              stroke="url(#armBoneGrad)"
              strokeWidth="12"
              strokeLinecap="round"
            />

            {/* Bone 4: Wrist J4/J5 to Tool Flange J6 */}
            <line
              x1="410"
              y1="140"
              x2="470"
              y2="110"
              stroke="#16C7E8"
              strokeWidth="8"
              strokeLinecap="round"
            />

            {/* Tool Flange & Pointer */}
            <circle cx="470" cy="110" r="10" fill="#2388FF" stroke="#FFFFFF" strokeWidth="2" />
            <line x1="470" y1="110" x2="495" y2="95" stroke="#16C7E8" strokeWidth="3" strokeLinecap="round" />
            <polygon points="495,95 505,90 500,102" fill="#16C7E8" />

            {/* Central Controller Cabinet Wire */}
            <rect x="180" y="405" width="60" height="35" rx="3" fill="#16243A" stroke="#2388FF" strokeWidth="1.5" />
            <text x="210" y="426" textAnchor="middle" fill="#16C7E8" fontSize="8" fontFamily="monospace" fontWeight="bold">
              PLC / BUS
            </text>

            {/* Interactive Hotspot Nodes */}
            {ROBOT_ANATOMY_LAYERS.map((layer) => {
              const isSelected = layer.id === activeLayerId;
              return (
                <g
                  key={layer.id}
                  onClick={() => setActiveLayerId(layer.id)}
                  className="cursor-pointer transition-transform hover:scale-110"
                  tabIndex={0}
                  role="button"
                  aria-label={`Select ${layer.name}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActiveLayerId(layer.id);
                    }
                  }}
                >
                  {/* Pulse Ring when selected */}
                  {isSelected && (
                    <circle
                      cx={layer.svgHotspot.cx}
                      cy={layer.svgHotspot.cy}
                      r={layer.svgHotspot.r + 8}
                      fill="none"
                      stroke="#16C7E8"
                      strokeWidth="2"
                      className="animate-ping opacity-60"
                    />
                  )}

                  {/* Outer circle */}
                  <circle
                    cx={layer.svgHotspot.cx}
                    cy={layer.svgHotspot.cy}
                    r={layer.svgHotspot.r}
                    fill={isSelected ? "#2388FF" : "#101B2D"}
                    stroke={isSelected ? "#16C7E8" : "#475569"}
                    strokeWidth={isSelected ? 3 : 1.5}
                  />

                  {/* Axis Label Code */}
                  <text
                    cx={layer.svgHotspot.cx}
                    cy={layer.svgHotspot.cy}
                    x={layer.svgHotspot.cx}
                    y={layer.svgHotspot.cy + 4}
                    textAnchor="middle"
                    fill={isSelected ? "#FFFFFF" : "#94A3B8"}
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                    pointerEvents="none"
                  >
                    {layer.id.replace("layer-", "").toUpperCase()}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Bottom Interactive Legend */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 font-mono text-[10px] text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-signal" />
              <span>Click any node to inspect transmission and sizing specs</span>
            </span>
          </div>
        </div>

        {/* Right Detail Dossier Card */}
        <div className="flex flex-col justify-between rounded-xl border border-border bg-background p-6 lg:col-span-5 h-full">
          <div>
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <span className="rounded bg-signal/15 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-signal">
                  {currentLayer.axis}
                </span>
                <h4 className="mt-2 font-display text-xl font-bold uppercase text-foreground">
                  {currentLayer.name}
                </h4>
              </div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {currentLayer.category}
              </span>
            </div>

            {/* Product Image Preview with Real Photography */}
            <div className="mt-4 overflow-hidden rounded-lg border border-border bg-slate-100">
              <ProductImage
                product={currentLayer.productSlug}
                alt={`${currentLayer.name} industrial robotics component`}
                aspectRatioClass="aspect-[16/9]"
              />
            </div>

            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              {currentLayer.description}
            </p>

            <div className="mt-3 rounded-lg border border-border/70 bg-muted/40 p-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-foreground block">
                Kinematic Role:
              </span>
              <p className="mt-0.5 text-xs text-muted-foreground">{currentLayer.role}</p>
            </div>

            {/* Technical Specifications Table */}
            <div className="mt-5 space-y-2 border-t border-border pt-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                Audited Performance Envelope
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded border border-border/60 bg-card p-2.5">
                  <span className="text-[10px] uppercase text-muted-foreground block">Reduction Ratio</span>
                  <span className="font-mono font-bold text-foreground">{currentLayer.specSummary.ratio}</span>
                </div>
                <div className="rounded border border-border/60 bg-card p-2.5">
                  <span className="text-[10px] uppercase text-muted-foreground block">Lost Motion / Backlash</span>
                  <span className="font-mono font-bold text-signal">{currentLayer.specSummary.backlash}</span>
                </div>
                <div className="rounded border border-border/60 bg-card p-2.5">
                  <span className="text-[10px] uppercase text-muted-foreground block">Repeatability</span>
                  <span className="font-mono font-bold text-foreground">{currentLayer.specSummary.repeatability}</span>
                </div>
                <div className="rounded border border-border/60 bg-card p-2.5">
                  <span className="text-[10px] uppercase text-muted-foreground block">Capacity / Torque</span>
                  <span className="font-mono font-bold text-foreground">{currentLayer.specSummary.payloadOrTorque}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
            <Link
              to="/products/$category/$id"
              params={{ category: currentLayer.categorySlug, id: currentLayer.productSlug }}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-signal hover:underline"
            >
              View Full Engineering Dossier <ArrowRight size={13} />
            </Link>

            <button
              onClick={() => openModal("quote", { productName: currentLayer.name })}
              className="rounded bg-primary px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-primary/90 transition-colors cursor-pointer"
            >
              Request Sizing RFQ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
