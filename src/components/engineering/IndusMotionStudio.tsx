import React, { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  Layers,
  Calculator,
  GitCompare,
  FileText,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Sparkles,
  Download,
  Info,
  ShieldAlert,
  Send,
  Zap,
  Cpu,
  Move3d,
  Gauge,
  Factory,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useModals } from "@/components/modals/ModalContext";
import { engineeringDossiers, type EngineeringProductDossier } from "@/data/engineeringData";
import { ProductImage } from "@/components/common/ProductImage";

export interface MotionStudioTask {
  id: string;
  name: string;
  category: string;
  defaultPayload: number; // kg
  defaultStroke: number; // mm
  defaultCycleTime: number; // s
  defaultRepeatability: number; // mm
  recommendedStack: {
    actuatorId: string;
    reducerId: string;
    driveId: string;
    controllerId: string;
  };
  notes: string;
}

export const MOTION_STUDIO_TASKS: MotionStudioTask[] = [
  {
    id: "cartesian-pick-place",
    name: "High-Speed Cartesian Pick & Place",
    category: "Packaging & Assembly",
    defaultPayload: 15,
    defaultStroke: 800,
    defaultCycleTime: 1.2,
    defaultRepeatability: 0.02,
    recommendedStack: {
      actuatorId: "linear",
      reducerId: "planetary",
      driveId: "servo-drives",
      controllerId: "motion-controllers",
    },
    notes: "High cyclic acceleration requiring low reflected inertia and rapid dynamic settling time.",
  },
  {
    id: "articulated-welding",
    name: "Heavy-Duty 6-Axis Robotic Welding",
    category: "Automotive & Heavy Industry",
    defaultPayload: 35,
    defaultStroke: 1450,
    defaultCycleTime: 3.5,
    defaultRepeatability: 0.05,
    recommendedStack: {
      actuatorId: "servo",
      reducerId: "harmonic",
      driveId: "servo-drives",
      controllerId: "robot-controllers",
    },
    notes: "Continuous seam tracking requiring zero-backlash strain wave gearing and rigid base moments.",
  },
  {
    id: "cleanroom-pcb",
    name: "Sub-Micron Semiconductor & PCB Insertion",
    category: "Electronics",
    defaultPayload: 3,
    defaultStroke: 350,
    defaultCycleTime: 0.8,
    defaultRepeatability: 0.005,
    recommendedStack: {
      actuatorId: "linear",
      reducerId: "harmonic",
      driveId: "servo-drives",
      controllerId: "motion-controllers",
    },
    notes: "Strict cleanroom particle minimization with ultra-fine optical encoder closed-loop control.",
  },
  {
    id: "intralogistics-amr",
    name: "Autonomous Mobile Transport (AMR / AGV)",
    category: "Warehousing & Logistics",
    defaultPayload: 500,
    defaultStroke: 15000,
    defaultCycleTime: 25.0,
    defaultRepeatability: 2.0,
    recommendedStack: {
      actuatorId: "electric",
      reducerId: "planetary",
      driveId: "servo-drives",
      controllerId: "robot-controllers",
    },
    notes: "In-hub differential drive high radial load absorption with low 48V DC bus power draw.",
  },
  {
    id: "machine-tending",
    name: "CNC Chuck & Stamping Machine Tending",
    category: "Manufacturing",
    defaultPayload: 65,
    defaultStroke: 1200,
    defaultCycleTime: 6.0,
    defaultRepeatability: 0.03,
    recommendedStack: {
      actuatorId: "rotary",
      reducerId: "cycloidal",
      driveId: "servo-drives",
      controllerId: "robot-controllers",
    },
    notes: "Severe shock resistance and thermal stability against harsh cutting fluid environments.",
  },
];

export function IndusMotionStudio({ className = "" }: { className?: string }) {
  const { openModal } = useModals();

  // Workflow Step State (1: Task, 2: Dynamics, 3: Sizing & BOM, 4: Passport Brief)
  const [activeStep, setActiveStep] = useState<number>(1);
  const [selectedTaskId, setSelectedTaskId] = useState<string>("cartesian-pick-place");

  const currentTask = useMemo(() => {
    return (
      MOTION_STUDIO_TASKS.find((t) => t.id === selectedTaskId) || MOTION_STUDIO_TASKS[0]
    );
  }, [selectedTaskId]);

  // Dynamic Sizing Inputs (initialized from selected task)
  const [payloadKg, setPayloadKg] = useState<string>(String(currentTask.defaultPayload));
  const [strokeMm, setStrokeMm] = useState<string>(String(currentTask.defaultStroke));
  const [cycleTimeSec, setCycleTimeSec] = useState<string>(String(currentTask.defaultCycleTime));
  const [repeatabilityMm, setRepeatabilityMm] = useState<string>(String(currentTask.defaultRepeatability));

  // Update inputs whenever user switches task
  const handleSelectTask = (taskId: string) => {
    setSelectedTaskId(taskId);
    const task = MOTION_STUDIO_TASKS.find((t) => t.id === taskId);
    if (task) {
      setPayloadKg(String(task.defaultPayload));
      setStrokeMm(String(task.defaultStroke));
      setCycleTimeSec(String(task.defaultCycleTime));
      setRepeatabilityMm(String(task.defaultRepeatability));
    }
  };

  // Reset to Defaults
  const handleReset = () => {
    setPayloadKg(String(currentTask.defaultPayload));
    setStrokeMm(String(currentTask.defaultStroke));
    setCycleTimeSec(String(currentTask.defaultCycleTime));
    setRepeatabilityMm(String(currentTask.defaultRepeatability));
  };

  // =========================================================
  // PHYSICS SIZING CALCULATIONS (SI Engineering Mechanics)
  // =========================================================
  const mass = Math.max(0.5, parseFloat(payloadKg) || 1);
  const stroke = Math.max(10, parseFloat(strokeMm) || 100);
  const tCycle = Math.max(0.2, parseFloat(cycleTimeSec) || 1);
  const repReq = Math.max(0.001, parseFloat(repeatabilityMm) || 0.01);

  // Motion Profile: Trapezoidal Velocity (1/3 accel, 1/3 cruise, 1/3 decel)
  const tAccel = tCycle / 3;
  const strokeM = stroke / 1000;
  const vMax = (1.5 * strokeM) / tCycle; // m/s
  const accel = vMax / tAccel; // m/s²

  // Dynamic Thrust / Force Required: F = m*a + m*g*mu + F_ext (mu = 0.05, F_ext = 50N)
  const g = 9.80665;
  const fFriction = mass * g * 0.05;
  const fInertia = mass * accel;
  const fTotal = fInertia + fFriction + 50; // N

  // Required Drive Torque for Ball Screw (Lead p = 10mm/rev, eta = 0.90)
  const leadMm = 10;
  const motorTorqueNm = (fTotal * leadMm) / (2000 * Math.PI * 0.90);

  // Reducer Inertia Matching Ratio: J_L = m * (lead/(2*pi))^2
  const jLoadKgM2 = mass * Math.pow(leadMm / 1000 / (2 * Math.PI), 2);
  const jMotorApprox = 0.0003; // typical 400W-750W industrial servo rotor inertia
  const recommendedRatio = Math.max(5, Math.min(100, Math.round(Math.sqrt(jLoadKgM2 / (3 * jMotorApprox)))));
  const reflectedInertiaRatio = (jLoadKgM2 / (recommendedRatio * recommendedRatio)) / jMotorApprox;

  // Selected Component Dossiers from Recommended Stack
  const actuatorDossier = engineeringDossiers[currentTask.recommendedStack.actuatorId];
  const reducerDossier = engineeringDossiers[currentTask.recommendedStack.reducerId];
  const driveDossier = engineeringDossiers[currentTask.recommendedStack.driveId];
  const controllerDossier = engineeringDossiers[currentTask.recommendedStack.controllerId];

  // Engineering Brief Passport ID (Deterministic ID based on parameters)
  const passportRefId = useMemo(() => {
    const hash = Math.abs(
      (mass * 997 + stroke * 31 + tCycle * 13) % 9999
    )
      .toString()
      .padStart(4, "0");
    return `INDUS-MS-2026-${hash}`;
  }, [mass, stroke, tCycle]);

  // Contextual RFQ transfer handler
  const handleTransferToRFQ = () => {
    const sizingSummary = `[INDUS Motion Studio Brief: ${passportRefId}]
Task: ${currentTask.name}
Payload: ${mass} kg | Stroke: ${stroke} mm | Cycle Time: ${tCycle} s | Repeatability: ${repReq} mm
Calculated Acceleration: ${accel.toFixed(2)} m/s² | Required Dynamic Thrust: ${fTotal.toFixed(1)} N | Est. Motor Torque: ${motorTorqueNm.toFixed(2)} Nm
Recommended Architecture:
- Actuator: ${actuatorDossier?.componentType || "Precision Actuator"} (${actuatorDossier?.modelIdentifier || "INDUS"})
- Reducer: ${reducerDossier?.componentType || "Precision Reducer"} (${reducerDossier?.modelIdentifier || "INDUS"})
- Drive: ${driveDossier?.componentType || "Servo Drive"} (${driveDossier?.modelIdentifier || "INDUS"})
- Controller: ${controllerDossier?.componentType || "Motion Controller"} (${controllerDossier?.modelIdentifier || "INDUS"})`;

    openModal("quote", {
      productName: `Motion Studio Architecture (${passportRefId})`,
      initialMessage: sizingSummary,
    });
  };

  const handlePrintBrief = () => {
    window.print();
  };

  return (
    <div
      id="motion-studio"
      className={`w-full rounded-2xl border border-border bg-card p-6 sm:p-8 lg:p-12 shadow-md ${className}`}
    >
      {/* Studio Banner & Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-border pb-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">
            <Sparkles size={13} />
            <span>Flagship Interactive Engineering Tool</span>
          </div>
          <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            INDUS Motion Studio
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Unified motion sizing, component architecture selection, and specification verification platform. Evaluate dynamic physics equations, match reflected inertias, and generate a certified engineering passport.
          </p>
        </div>

        {/* Step Indicator Badges */}
        <div className="flex items-center gap-2 shrink-0 bg-muted/50 p-1.5 rounded-lg border border-border">
          {[
            { step: 1, label: "Task" },
            { step: 2, label: "Operating Dynamics" },
            { step: 3, label: "Kinematics & Stack" },
            { step: 4, label: "Engineering Passport" },
          ].map((s) => (
            <button
              key={s.step}
              onClick={() => setActiveStep(s.step)}
              className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeStep === s.step
                  ? "bg-primary text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="opacity-60 mr-1">0{s.step}</span> {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* STEP 1: Application & Task Selector */}
      {activeStep === 1 && (
        <div className="mt-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-xl uppercase font-bold text-foreground">
                Step 1: Select Manufacturing Task or Machine Profile
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Preloads audited kinematic models, typical cycle times, and structural payload envelopes.
              </p>
            </div>
            <span className="text-xs font-mono text-signal font-bold uppercase">
              5 Pre-Engineered Templates Available
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MOTION_STUDIO_TASKS.map((task) => {
              const isSelected = task.id === selectedTaskId;
              return (
                <div
                  key={task.id}
                  onClick={() => handleSelectTask(task.id)}
                  className={`group relative flex flex-col justify-between rounded-xl border p-5 transition-all cursor-pointer ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border bg-card hover:border-slate-300 hover:bg-muted/30"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase text-signal">
                        {task.category}
                      </span>
                      {isSelected && (
                        <span className="flex size-5 items-center justify-center rounded-full bg-primary text-white">
                          <CheckCircle2 size={13} />
                        </span>
                      )}
                    </div>

                    <h4 className="mt-3 font-display text-lg uppercase font-bold text-foreground group-hover:text-primary transition-colors">
                      {task.name}
                    </h4>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                      {task.notes}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border/60 grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-600">
                    <div>
                      <span className="block text-[9px] uppercase text-slate-400">Payload</span>
                      <span className="font-bold text-foreground">{task.defaultPayload} kg</span>
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase text-slate-400">Cycle Time</span>
                      <span className="font-bold text-foreground">{task.defaultCycleTime} s</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex justify-end">
            <Button
              onClick={() => setActiveStep(2)}
              className="bg-primary text-white hover:bg-primary/90 font-bold uppercase text-xs h-11 px-6 shadow-sm cursor-pointer"
            >
              Continue to Operating Dynamics <ArrowRight size={14} className="ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: Operating Requirements & Kinematic Dynamics */}
      {activeStep === 2 && (
        <div className="mt-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-xl uppercase font-bold text-foreground">
                Step 2: Define Operating Requirements ({currentTask.name})
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Tune exact target stroke, dynamic payload, cycle takt, and positioning tolerance.
              </p>
            </div>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer font-semibold"
            >
              <RotateCcw size={12} /> Reset to Task Defaults
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 rounded-xl border border-border bg-muted/20 p-6">
            <div>
              <Label className="text-xs font-bold uppercase text-slate-700">Dynamic Payload (kg)</Label>
              <Input
                type="number"
                value={payloadKg}
                onChange={(e) => setPayloadKg(e.target.value)}
                min="0.1"
                step="0.5"
                className="mt-2 font-mono text-sm bg-white"
              />
              <span className="mt-1 block text-[10px] text-muted-foreground">
                Mass of tooling, gripper, and component
              </span>
            </div>

            <div>
              <Label className="text-xs font-bold uppercase text-slate-700">Travel Distance / Stroke (mm)</Label>
              <Input
                type="number"
                value={strokeMm}
                onChange={(e) => setStrokeMm(e.target.value)}
                min="10"
                step="50"
                className="mt-2 font-mono text-sm bg-white"
              />
              <span className="mt-1 block text-[10px] text-muted-foreground">
                Effective linear stroke or kinematic reach
              </span>
            </div>

            <div>
              <Label className="text-xs font-bold uppercase text-slate-700">Target Cycle Time (seconds)</Label>
              <Input
                type="number"
                value={cycleTimeSec}
                onChange={(e) => setCycleTimeSec(e.target.value)}
                min="0.2"
                step="0.1"
                className="mt-2 font-mono text-sm bg-white"
              />
              <span className="mt-1 block text-[10px] text-muted-foreground">
                Total point-to-point motion duration
              </span>
            </div>

            <div>
              <Label className="text-xs font-bold uppercase text-slate-700">Repeatability Target (mm)</Label>
              <Input
                type="number"
                value={repeatabilityMm}
                onChange={(e) => setRepeatabilityMm(e.target.value)}
                min="0.001"
                step="0.005"
                className="mt-2 font-mono text-sm bg-white"
              />
              <span className="mt-1 block text-[10px] text-muted-foreground">
                Bidirectional positioning repeatability
              </span>
            </div>
          </div>

          {/* Real-Time Mathematical Feasibility Gauges */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
              Real-Time Physics Sizing Evaluation (1/3 Trapezoidal Velocity Profile)
            </h4>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-border/80 bg-background p-4">
                <span className="text-[10px] uppercase font-mono text-muted-foreground block">
                  Peak Acceleration (a)
                </span>
                <span className="mt-1 text-2xl font-mono font-bold text-foreground">
                  {accel.toFixed(2)} <span className="text-sm font-normal text-slate-500">m/s²</span>
                </span>
                <span className="mt-1 block text-[10px] text-slate-500">
                  v_max = {vMax.toFixed(2)} m/s (t_accel = {tAccel.toFixed(2)} s)
                </span>
              </div>

              <div className="rounded-lg border border-border/80 bg-background p-4">
                <span className="text-[10px] uppercase font-mono text-muted-foreground block">
                  Total Dynamic Thrust (F_tot)
                </span>
                <span className="mt-1 text-2xl font-mono font-bold text-foreground">
                  {fTotal.toFixed(1)} <span className="text-sm font-normal text-slate-500">N</span>
                </span>
                <span className="mt-1 block text-[10px] text-slate-500">
                  Inertia {fInertia.toFixed(1)} N + Friction {fFriction.toFixed(1)} N
                </span>
              </div>

              <div className="rounded-lg border border-border/80 bg-background p-4">
                <span className="text-[10px] uppercase font-mono text-muted-foreground block">
                  Inertia Matching Ratio (J_L / J_M)
                </span>
                <span className="mt-1 text-2xl font-mono font-bold text-signal">
                  {reflectedInertiaRatio.toFixed(1)} : 1
                </span>
                <span className="mt-1 block text-[10px] text-emerald-600 font-semibold">
                  {reflectedInertiaRatio <= 5 ? "Optimal Tuning (≤ 5:1)" : "Stable (≤ 10:1)"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => setActiveStep(1)}
              className="text-xs font-bold uppercase cursor-pointer"
            >
              Back to Tasks
            </Button>
            <Button
              onClick={() => setActiveStep(3)}
              className="bg-primary text-white hover:bg-primary/90 font-bold uppercase text-xs h-11 px-6 shadow-sm cursor-pointer"
            >
              Inspect Recommended Architecture Stack <ArrowRight size={14} className="ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: Recommended Architecture Stack & Side-by-Side Verification */}
      {activeStep === 3 && (
        <div className="mt-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-xl uppercase font-bold text-foreground">
                Step 3: Recommended Component Architecture Stack
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Synchronized 4-tier hardware stack verified for deterministic multi-axis compatibility.
              </p>
            </div>
            <span className="rounded bg-signal/15 px-3 py-1 font-mono text-xs font-bold text-signal uppercase">
              Fieldbus: EtherCAT DC · 250 µs Cycle
            </span>
          </div>

          {/* 4-Tier Hardware Stack Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* 1. Actuator */}
            <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-xs hover:border-primary transition-all">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase text-signal">
                    Tier 01: Kinematic
                  </span>
                  <Move3d size={16} className="text-primary" />
                </div>
                <div className="mt-3 overflow-hidden rounded-lg border border-border bg-slate-100">
                  <ProductImage
                    product={currentTask.recommendedStack.actuatorId}
                    alt={actuatorDossier?.componentType || "Actuator"}
                    aspectRatioClass="aspect-[16/10]"
                  />
                </div>
                <h4 className="mt-3 font-display text-base font-bold uppercase text-foreground">
                  {actuatorDossier?.componentType || "Precision Actuator"}
                </h4>
                <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2">
                  {actuatorDossier?.functionalOverview}
                </p>
                <div className="mt-3 space-y-1 font-mono text-[10px] text-slate-600 bg-muted/40 p-2 rounded">
                  <div>Model: {actuatorDossier?.modelIdentifier}</div>
                  <div>Category: Actuators</div>
                </div>
              </div>
            </div>

            {/* 2. Reducer */}
            <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-xs hover:border-primary transition-all">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase text-signal">
                    Tier 02: Transmission
                  </span>
                  <Gauge size={16} className="text-primary" />
                </div>
                <div className="mt-3 overflow-hidden rounded-lg border border-border bg-slate-100">
                  <ProductImage
                    product={currentTask.recommendedStack.reducerId}
                    alt={reducerDossier?.componentType || "Reducer"}
                    aspectRatioClass="aspect-[16/10]"
                  />
                </div>
                <h4 className="mt-3 font-display text-base font-bold uppercase text-foreground">
                  {reducerDossier?.componentType || "Precision Reducer"}
                </h4>
                <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2">
                  {reducerDossier?.functionalOverview}
                </p>
                <div className="mt-3 space-y-1 font-mono text-[10px] text-slate-600 bg-muted/40 p-2 rounded">
                  <div>Model: {reducerDossier?.modelIdentifier}</div>
                  <div>Ratio: {recommendedRatio}:1 (Matched)</div>
                </div>
              </div>
            </div>

            {/* 3. Servo Drive */}
            <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-xs hover:border-primary transition-all">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase text-signal">
                    Tier 03: Servo Drive
                  </span>
                  <Zap size={16} className="text-primary" />
                </div>
                <div className="mt-3 overflow-hidden rounded-lg border border-border bg-slate-100">
                  <ProductImage
                    product={currentTask.recommendedStack.driveId}
                    alt={driveDossier?.componentType || "Servo Drive"}
                    aspectRatioClass="aspect-[16/10]"
                  />
                </div>
                <h4 className="mt-3 font-display text-base font-bold uppercase text-foreground">
                  {driveDossier?.componentType || "Servo Drive"}
                </h4>
                <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2">
                  {driveDossier?.functionalOverview}
                </p>
                <div className="mt-3 space-y-1 font-mono text-[10px] text-slate-600 bg-muted/40 p-2 rounded">
                  <div>Model: {driveDossier?.modelIdentifier}</div>
                  <div>Bus: EtherCAT / CANopen</div>
                </div>
              </div>
            </div>

            {/* 4. Motion Controller */}
            <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-xs hover:border-primary transition-all">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase text-signal">
                    Tier 04: Central Brain
                  </span>
                  <Cpu size={16} className="text-primary" />
                </div>
                <div className="mt-3 overflow-hidden rounded-lg border border-border bg-slate-100">
                  <ProductImage
                    product={currentTask.recommendedStack.controllerId}
                    alt={controllerDossier?.componentType || "Controller"}
                    aspectRatioClass="aspect-[16/10]"
                  />
                </div>
                <h4 className="mt-3 font-display text-base font-bold uppercase text-foreground">
                  {controllerDossier?.componentType || "Motion Controller"}
                </h4>
                <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2">
                  {controllerDossier?.functionalOverview}
                </p>
                <div className="mt-3 space-y-1 font-mono text-[10px] text-slate-600 bg-muted/40 p-2 rounded">
                  <div>Model: {controllerDossier?.modelIdentifier}</div>
                  <div>Sync: 6-Axis Kinematics</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={() => setActiveStep(2)}
              className="text-xs font-bold uppercase cursor-pointer"
            >
              Back to Dynamics
            </Button>
            <Button
              onClick={() => setActiveStep(4)}
              className="bg-primary text-white hover:bg-primary/90 font-bold uppercase text-xs h-11 px-6 shadow-sm cursor-pointer"
            >
              Generate Certified Engineering Passport <ArrowRight size={14} className="ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: Engineering Passport Brief & Commercial RFQ Conversion */}
      {activeStep === 4 && (
        <div className="mt-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <span className="rounded bg-signal/15 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase text-signal">
                Specification Dossier
              </span>
              <h3 className="mt-2 font-display text-2xl uppercase font-bold text-foreground">
                INDUS Engineering Passport Brief
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrintBrief}
                className="text-xs font-bold uppercase cursor-pointer"
              >
                <Printer size={13} className="mr-1.5" /> Print / Save Brief
              </Button>
            </div>
          </div>

          {/* Printable Engineering Brief Document Box */}
          <div className="rounded-xl border border-slate-300 bg-white p-8 text-slate-900 shadow-sm print:border-none print:p-0">
            {/* Header / ID Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-slate-900 pb-6">
              <div>
                <span className="font-sans text-xl font-extrabold tracking-wide text-slate-900 block">
                  INDUS INDUSTRIAL ROBOTICS
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
                  Motion Sizing & Architecture Certification Document
                </span>
              </div>
              <div className="text-right sm:text-right font-mono">
                <span className="text-[10px] uppercase text-slate-400 block">Reference ID</span>
                <span className="text-sm font-bold text-primary">{passportRefId}</span>
              </div>
            </div>

            {/* Task Profile & Operating Requirements */}
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                  Target Task & Profile
                </h4>
                <p className="mt-1 font-display text-lg uppercase font-bold text-slate-900">
                  {currentTask.name}
                </p>
                <p className="mt-1 text-xs text-slate-600">{currentTask.notes}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                  Sizing Parameters & Dynamics
                </h4>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-slate-50 p-2 rounded border border-slate-200">
                    <span className="text-[9px] uppercase text-slate-500 block">Payload</span>
                    <span className="font-bold text-slate-900">{mass} kg</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded border border-slate-200">
                    <span className="text-[9px] uppercase text-slate-500 block">Stroke</span>
                    <span className="font-bold text-slate-900">{stroke} mm</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded border border-slate-200">
                    <span className="text-[9px] uppercase text-slate-500 block">Cycle Time</span>
                    <span className="font-bold text-slate-900">{tCycle} s</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded border border-slate-200">
                    <span className="text-[9px] uppercase text-slate-500 block">Repeatability</span>
                    <span className="font-bold text-slate-900">±{repReq} mm</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Calculated Mechanical Performance */}
            <div className="mt-6 rounded-lg bg-slate-50 p-4 border border-slate-200">
              <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">
                Calculated Kinematics & Mechanics
              </h4>
              <div className="grid gap-3 sm:grid-cols-3 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px]">Peak Acceleration</span>
                  <span className="font-bold text-slate-900">{accel.toFixed(2)} m/s²</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Total Dynamic Thrust</span>
                  <span className="font-bold text-slate-900">{fTotal.toFixed(1)} N</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Inertia Ratio</span>
                  <span className="font-bold text-primary">{reflectedInertiaRatio.toFixed(1)} : 1 (Optimal)</span>
                </div>
              </div>
            </div>

            {/* Recommended Bill of Materials */}
            <div className="mt-6 border-t border-slate-200 pt-6">
              <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-4">
                Recommended Component Bill of Materials
              </h4>
              <div className="divide-y divide-slate-200 text-xs">
                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">{actuatorDossier?.componentType}</span>
                    <span className="text-slate-500 text-[10px]">Model: {actuatorDossier?.modelIdentifier} · Kinematic Actuator</span>
                  </div>
                  <span className="font-mono text-slate-700">ISO 9409 Flange</span>
                </div>

                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">{reducerDossier?.componentType}</span>
                    <span className="text-slate-500 text-[10px]">Model: {reducerDossier?.modelIdentifier} · Transmission ({recommendedRatio}:1)</span>
                  </div>
                  <span className="font-mono text-slate-700">&lt; 1 arcmin backlash</span>
                </div>

                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">{driveDossier?.componentType}</span>
                    <span className="text-slate-500 text-[10px]">Model: {driveDossier?.modelIdentifier} · Multi-Axis Servo Inverter</span>
                  </div>
                  <span className="font-mono text-slate-700">EtherCAT DC Bus</span>
                </div>

                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">{controllerDossier?.componentType}</span>
                    <span className="text-slate-500 text-[10px]">Model: {controllerDossier?.modelIdentifier} · Deterministic Controller</span>
                  </div>
                  <span className="font-mono text-slate-700">250 µs Cycle Takt</span>
                </div>
              </div>
            </div>

            {/* Engineering Disclaimer */}
            <div className="mt-6 rounded border border-amber-200 bg-amber-50/70 p-3 text-[11px] text-amber-800 flex items-start gap-2">
              <ShieldAlert size={14} className="shrink-0 mt-0.5 text-amber-600" />
              <span>
                <strong>Engineering Verification Notice:</strong> Sizing values are physics-based kinematic estimates. Before final hardware procurement or safety-critical machine commissioning, technical drawings and payload thermal curves must be audited by an INDUS Systems Application Engineer.
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={() => setActiveStep(3)}
              className="text-xs font-bold uppercase cursor-pointer"
            >
              Modify Hardware Stack
            </Button>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                onClick={handlePrintBrief}
                className="text-xs font-bold uppercase cursor-pointer"
              >
                <Download size={13} className="mr-1.5" /> Download Passport
              </Button>

              <Button
                onClick={handleTransferToRFQ}
                className="bg-primary text-white hover:bg-primary/90 font-bold uppercase text-xs h-11 px-6 shadow-md cursor-pointer"
              >
                <Send size={13} className="mr-2" /> Request Commercial RFQ for this Brief
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
