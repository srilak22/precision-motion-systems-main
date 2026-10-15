import React, { useState } from "react";
import {
  Calculator,
  AlertTriangle,
  Info,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
  FileText,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useModals } from "@/components/modals/ModalContext";

export function EngineeringCalculators() {
  const { openModal } = useModals();
  const [activeTab, setActiveTab] = useState<"actuator" | "reducer" | "robot">("actuator");

  // 1. ACTUATOR & BALL SCREW SIZING STATE
  const [actMass, setActMass] = useState("25"); // kg
  const [actAccel, setActAccel] = useState("3.5"); // m/s²
  const [actFriction, setActFriction] = useState("0.05"); // mu (linear guide)
  const [actExtForce, setActExtForce] = useState("150"); // N
  const [actLead, setActLead] = useState("10"); // mm/rev
  const [actDiameter, setActDiameter] = useState("20"); // mm
  const [actStroke, setActStroke] = useState("800"); // mm
  const [actMaxRpm, setActMaxRpm] = useState("3000"); // rpm

  // 2. REDUCER INERTIA RATIO STATE
  const [loadInertia, setLoadInertia] = useState("0.08"); // kg·m²
  const [motorInertia, setMotorInertia] = useState("0.00025"); // kg·m²
  const [reducerRatio, setReducerRatio] = useState("50"); // ratio i
  const [loadTorque, setLoadTorque] = useState("45"); // Nm
  const [efficiency, setEfficiency] = useState("0.85"); // eta

  // 3. ROBOTIC WRIST MOMENT STATE
  const [toolMass, setToolMass] = useState("6.5"); // kg
  const [cgDistance, setCgDistance] = useState("140"); // mm
  const [angAccel, setAngAccel] = useState("12"); // rad/s²
  const [wristAllowableMoment, setWristAllowableMoment] = useState("38.5"); // Nm

  // ==========================================
  // CALCULATIONS: ACTUATOR & BALL SCREW
  // ==========================================
  const m = Math.max(0.1, parseFloat(actMass) || 0);
  const a = Math.max(0, parseFloat(actAccel) || 0);
  const mu = Math.max(0.001, parseFloat(actFriction) || 0);
  const f_ext = Math.max(0, parseFloat(actExtForce) || 0);
  const p = Math.max(1, parseFloat(actLead) || 1); // mm/rev
  const d_r = Math.max(5, parseFloat(actDiameter) || 5); // mm
  const stroke = Math.max(50, parseFloat(actStroke) || 50); // mm
  const rpm = Math.max(100, parseFloat(actMaxRpm) || 100);

  // Dynamic Thrust F = m * a + m * g * mu + F_ext
  const g = 9.80665;
  const fFriction = m * g * mu;
  const fInertia = m * a;
  const totalThrust = fInertia + fFriction + f_ext; // N

  // Motor Drive Torque T = (F * p) / (2000 * pi * eta) [eta = 0.90]
  const etaScrew = 0.90;
  const motorTorque = (totalThrust * p) / (2000 * Math.PI * etaScrew); // Nm

  // Linear Velocity v = (rpm * p) / 60,000 [m/s]
  const linearVelocity = (rpm * p) / 60000;

  // Ball Screw Whirling Critical Speed (Fixed-Supported f_k = 1.88)
  // n_cr = 1.2 * 10^8 * (d_r / L^2) * f_k [rpm]
  const lTotal = stroke + 150; // mm effective screw span
  const nCritical = 1.2e8 * (d_r / (lTotal * lTotal)) * 1.88;
  const whirlingSafetyFactor = nCritical / rpm;

  // Euler Buckling Load P_k = pi^2 * E * I / (k_b * L)^2 [Fixed-Supported k_b = 0.707]
  // E = 2.06e5 N/mm², I = pi * d_r^4 / 64
  const eModulus = 206000;
  const iMoment = (Math.PI * Math.pow(d_r, 4)) / 64;
  const kBuckling = 0.707;
  const bucklingLoad = (Math.PI * Math.PI * eModulus * iMoment) / Math.pow(kBuckling * lTotal, 2); // N
  const bucklingSafetyFactor = bucklingLoad / totalThrust;

  // ==========================================
  // CALCULATIONS: REDUCER & INERTIA RATIO
  // ==========================================
  const jLoad = Math.max(0.0001, parseFloat(loadInertia) || 0);
  const jMotor = Math.max(0.00001, parseFloat(motorInertia) || 0);
  const iRatio = Math.max(1, parseFloat(reducerRatio) || 1);
  const tLoad = Math.max(0.1, parseFloat(loadTorque) || 0);
  const etaRed = Math.min(1, Math.max(0.5, parseFloat(efficiency) || 0.85));

  // Reflected load inertia J_ref = J_load / i^2
  const jReflected = jLoad / (iRatio * iRatio);
  const inertiaRatio = jReflected / jMotor;
  const motorRequiredTorque = (tLoad / (iRatio * etaRed));

  let inertiaAssessment = "Optimal (≤ 5:1)";
  let inertiaColor = "text-emerald-500";
  if (inertiaRatio > 10) {
    inertiaAssessment = "High Overhung Inertia (> 10:1) — Requires Aggressive Servo Tuning or Higher Ratio";
    inertiaColor = "text-amber-500";
  } else if (inertiaRatio > 5) {
    inertiaAssessment = "Acceptable for Standard Industrial Machinery (5:1 - 10:1)";
    inertiaColor = "text-blue-400";
  }

  // ==========================================
  // CALCULATIONS: ROBOTIC WRIST MOMENT
  // ==========================================
  const mTool = Math.max(0.1, parseFloat(toolMass) || 0);
  const lCg = Math.max(10, parseFloat(cgDistance) || 10); // mm
  const alpha = Math.max(0.1, parseFloat(angAccel) || 0); // rad/s²
  const mAllow = Math.max(1, parseFloat(wristAllowableMoment) || 38.5);

  const lCgMeters = lCg / 1000;
  // Static Moment M_stat = m * g * L_cg
  const mStatic = mTool * g * lCgMeters; // Nm
  // Dynamic Inertial Moment M_dyn = J * alpha ~ m * L_cg^2 * alpha
  const mDynamicInertia = mTool * Math.pow(lCgMeters, 2) * alpha;
  const mTotalWrist = mStatic + mDynamicInertia;
  const wristLoadPercent = (mTotalWrist / mAllow) * 100;
  const wristSafetyFactor = mAllow / mTotalWrist;

  return (
    <div className="w-full space-y-8">
      {/* Header Banner */}
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded bg-signal/15 text-signal font-mono font-bold text-xs">
                ENG
              </span>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-signal">
                Engineering Sizing & Feasibility Suite
              </p>
            </div>
            <h2 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight text-foreground sm:text-3xl">
              Research-Backed Engineering Calculators
            </h2>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              Documented physics-based formulas, assumptions, units, and verification limits.
            </p>
          </div>

          {/* Calculator Selector Tabs */}
          <div className="flex flex-wrap gap-1 rounded bg-muted/40 p-1 border border-border">
            <button
              onClick={() => setActiveTab("actuator")}
              className={`px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors rounded ${
                activeTab === "actuator"
                  ? "bg-signal text-signal-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Linear / Ball Screw
            </button>
            <button
              onClick={() => setActiveTab("reducer")}
              className={`px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors rounded ${
                activeTab === "reducer"
                  ? "bg-signal text-signal-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Reducer & Inertia
            </button>
            <button
              onClick={() => setActiveTab("robot")}
              className={`px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors rounded ${
                activeTab === "robot"
                  ? "bg-signal text-signal-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Robot Wrist Moment
            </button>
          </div>
        </div>

        {/* Mandatory Engineering Disclaimer */}
        <div className="mt-5 flex items-start gap-3 rounded border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-amber-700 dark:text-amber-300">
          <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-500" />
          <p className="leading-5">
            <strong>Preliminary Feasibility Estimate Only:</strong> Results generated by these calculators
            are first-order sizing approximations and do not constitute certified design ratings. Final
            component sizing requires full dynamic simulation, thermal duty cycle verification, and vendor
            application engineering sign-off.
          </p>
        </div>
      </div>

      {/* 1. ACTUATOR & BALL SCREW SIZING */}
      {activeTab === "actuator" && (
        <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
          {/* Input Panel */}
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm space-y-5">
            <div className="border-b border-border pb-3">
              <h3 className="font-display text-lg font-bold uppercase tracking-wide text-foreground">
                1. Actuator Kinematics & Mechanics Inputs
              </h3>
              <p className="text-xs text-muted-foreground">
                Define the moving load, stroke geometry, and dynamic acceleration constraints.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-xs font-semibold text-foreground">Moving Mass (m)</Label>
                <div className="relative mt-1">
                  <Input
                    type="number"
                    value={actMass}
                    onChange={(e) => setActMass(e.target.value)}
                    className="pr-10 font-mono text-sm"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">kg</span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">Carriage + Payload mass</p>
              </div>

              <div>
                <Label className="text-xs font-semibold text-foreground">Acceleration Rate (a)</Label>
                <div className="relative mt-1">
                  <Input
                    type="number"
                    step="0.5"
                    value={actAccel}
                    onChange={(e) => setActAccel(e.target.value)}
                    className="pr-12 font-mono text-sm"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">m/s²</span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">Typical 2 to 10 m/s²</p>
              </div>

              <div>
                <Label className="text-xs font-semibold text-foreground">Friction Coeff (µ)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={actFriction}
                  onChange={(e) => setActFriction(e.target.value)}
                  className="mt-1 font-mono text-sm"
                />
                <p className="mt-1 text-[11px] text-muted-foreground">0.03 - 0.08 for linear guides</p>
              </div>

              <div>
                <Label className="text-xs font-semibold text-foreground">External Force (F_ext)</Label>
                <div className="relative mt-1">
                  <Input
                    type="number"
                    value={actExtForce}
                    onChange={(e) => setActExtForce(e.target.value)}
                    className="pr-10 font-mono text-sm"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">N</span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">Process thrust, cutting, press</p>
              </div>

              <div>
                <Label className="text-xs font-semibold text-foreground">Screw Lead (p)</Label>
                <div className="relative mt-1">
                  <Input
                    type="number"
                    value={actLead}
                    onChange={(e) => setActLead(e.target.value)}
                    className="pr-16 font-mono text-sm"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">mm/rev</span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">Standard 5, 10, or 20 mm</p>
              </div>

              <div>
                <Label className="text-xs font-semibold text-foreground">Screw Diameter (d_r)</Label>
                <div className="relative mt-1">
                  <Input
                    type="number"
                    value={actDiameter}
                    onChange={(e) => setActDiameter(e.target.value)}
                    className="pr-10 font-mono text-sm"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">mm</span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">Root diameter of ball screw</p>
              </div>

              <div>
                <Label className="text-xs font-semibold text-foreground">Stroke Length (L)</Label>
                <div className="relative mt-1">
                  <Input
                    type="number"
                    value={actStroke}
                    onChange={(e) => setActStroke(e.target.value)}
                    className="pr-10 font-mono text-sm"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">mm</span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">Effective working travel</p>
              </div>

              <div>
                <Label className="text-xs font-semibold text-foreground">Max Motor Speed</Label>
                <div className="relative mt-1">
                  <Input
                    type="number"
                    value={actMaxRpm}
                    onChange={(e) => setActMaxRpm(e.target.value)}
                    className="pr-12 font-mono text-sm"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">rpm</span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">Servomotor rated ceiling</p>
              </div>
            </div>

            {/* Documented Formulas Callout */}
            <div className="rounded border border-border bg-muted/20 p-4 text-xs space-y-2">
              <p className="font-bold uppercase tracking-wider text-signal flex items-center gap-1.5">
                <FileText size={14} /> Documented Mathematical Formulation
              </p>
              <ul className="list-disc pl-4 text-muted-foreground space-y-1 font-mono text-[11px]">
                <li>Total Dynamic Thrust: F = m·a + m·g·µ + F_ext</li>
                <li>Required Motor Torque: T = (F · p) / (2000 · π · η_screw) [η = 0.90]</li>
                <li>Linear Velocity: v = (n · p) / 60,000 m/s</li>
                <li>Critical Whirling Speed: n_cr = 1.2·10⁸ · (d_r / L²) · f_k [Fixed-Supported f_k=1.88]</li>
                <li>Euler Buckling Load: P_k = π²·E·I / (k_b · L)² [E=206,000 N/mm²]</li>
              </ul>
            </div>
          </div>

          {/* Results Panel */}
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm space-y-6 flex flex-col justify-between">
            <div>
              <div className="border-b border-border pb-3">
                <p className="text-[10px] font-bold uppercase tracking-[.24em] text-signal">
                  Calculated Mechanical Demands
                </p>
                <h3 className="font-display text-xl font-bold uppercase tracking-tight text-foreground">
                  Thrust, Torque & Whirling Limits
                </h3>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded border border-border bg-muted/30 p-4">
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                    Dynamic Thrust Force
                  </p>
                  <p className="mt-1 font-mono text-2xl font-bold text-foreground">
                    {totalThrust.toFixed(1)} <span className="text-sm font-normal text-muted-foreground">N</span>
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Accel: {fInertia.toFixed(0)}N | Friction: {fFriction.toFixed(0)}N
                  </p>
                </div>

                <div className="rounded border border-border bg-muted/30 p-4">
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                    Required Motor Torque
                  </p>
                  <p className="mt-1 font-mono text-2xl font-bold text-signal">
                    {motorTorque.toFixed(2)} <span className="text-sm font-normal text-muted-foreground">Nm</span>
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    At 90% mechanical screw efficiency
                  </p>
                </div>

                <div className="rounded border border-border bg-muted/30 p-4">
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                    Peak Linear Velocity
                  </p>
                  <p className="mt-1 font-mono text-2xl font-bold text-foreground">
                    {linearVelocity.toFixed(2)} <span className="text-sm font-normal text-muted-foreground">m/s</span>
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    At {rpm} rpm motor input
                  </p>
                </div>

                <div className="rounded border border-border bg-muted/30 p-4">
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                    Critical Whirling Limit
                  </p>
                  <p className="mt-1 font-mono text-2xl font-bold text-foreground">
                    {nCritical.toFixed(0)} <span className="text-sm font-normal text-muted-foreground">rpm</span>
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Safety Margin: {whirlingSafetyFactor.toFixed(1)}x
                  </p>
                </div>
              </div>

              {/* Engineering Evaluation Card */}
              <div className="mt-6 rounded border border-border bg-surface-elevated/40 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>Ball Screw Whirling Safety Margin:</span>
                  <span
                    className={`font-mono font-bold ${
                      whirlingSafetyFactor >= 1.5 ? "text-emerald-500" : "text-rose-500"
                    }`}
                  >
                    {whirlingSafetyFactor >= 1.5 ? "SAFE (≥ 1.5x)" : "WARNING: WHIRLING RISK (< 1.5x)"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>Euler Column Buckling Capacity:</span>
                  <span
                    className={`font-mono font-bold ${
                      bucklingSafetyFactor >= 2.0 ? "text-emerald-500" : "text-amber-500"
                    }`}
                  >
                    {bucklingSafetyFactor >= 2.0 ? "SAFE (> 2.0x)" : "CAUTION: VERIFY BUCKLING"}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Matches product: <strong className="text-foreground">IND-ACT-LIN-200-B</strong>
              </span>
              <Button
                size="sm"
                className="rounded bg-signal text-signal-foreground font-bold uppercase text-xs"
                onClick={() =>
                  openModal("quote", {
                    productName: "Linear Actuator (IND-ACT-LIN-200-B)",
                    categoryName: "Actuators",
                  })
                }
              >
                Inquire on This Sizing <ArrowRight size={13} className="ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 2. REDUCER TORQUE & INERTIA RATIO */}
      {activeTab === "reducer" && (
        <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
          {/* Input Panel */}
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm space-y-5">
            <div className="border-b border-border pb-3">
              <h3 className="font-display text-lg font-bold uppercase tracking-wide text-foreground">
                2. Reducer & Load Inertia Inputs
              </h3>
              <p className="text-xs text-muted-foreground">
                Evaluate inertia mismatch and reflected torque for servo-driven reducers.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-xs font-semibold text-foreground">Load Inertia (J_load)</Label>
                <div className="relative mt-1">
                  <Input
                    type="number"
                    step="0.001"
                    value={loadInertia}
                    onChange={(e) => setLoadInertia(e.target.value)}
                    className="pr-16 font-mono text-sm"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">kg·m²</span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">Rotational inertia at output shaft</p>
              </div>

              <div>
                <Label className="text-xs font-semibold text-foreground">Motor Rotor Inertia (J_m)</Label>
                <div className="relative mt-1">
                  <Input
                    type="number"
                    step="0.00001"
                    value={motorInertia}
                    onChange={(e) => setMotorInertia(e.target.value)}
                    className="pr-16 font-mono text-sm"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">kg·m²</span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">From servomotor datasheet</p>
              </div>

              <div>
                <Label className="text-xs font-semibold text-foreground">Gear Reduction Ratio (i)</Label>
                <Input
                  type="number"
                  value={reducerRatio}
                  onChange={(e) => setReducerRatio(e.target.value)}
                  className="mt-1 font-mono text-sm"
                />
                <p className="mt-1 text-[11px] text-muted-foreground">E.g. 10 (Planetary), 50, 100 (Harmonic)</p>
              </div>

              <div>
                <Label className="text-xs font-semibold text-foreground">Nominal Load Torque (T_L)</Label>
                <div className="relative mt-1">
                  <Input
                    type="number"
                    value={loadTorque}
                    onChange={(e) => setLoadTorque(e.target.value)}
                    className="pr-10 font-mono text-sm"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">Nm</span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">Output torque required by process</p>
              </div>

              <div>
                <Label className="text-xs font-semibold text-foreground">Gear Efficiency (η)</Label>
                <Input
                  type="number"
                  step="0.02"
                  value={efficiency}
                  onChange={(e) => setEfficiency(e.target.value)}
                  className="mt-1 font-mono text-sm"
                />
                <p className="mt-1 text-[11px] text-muted-foreground">0.97 (Planetary), 0.85 (Harmonic)</p>
              </div>
            </div>

            {/* Documented Formulas Callout */}
            <div className="rounded border border-border bg-muted/20 p-4 text-xs space-y-2">
              <p className="font-bold uppercase tracking-wider text-signal flex items-center gap-1.5">
                <FileText size={14} /> Documented Inertia Matching Formulation
              </p>
              <ul className="list-disc pl-4 text-muted-foreground space-y-1 font-mono text-[11px]">
                <li>Reflected Load Inertia: J_ref = J_load / i²</li>
                <li>Inertia Ratio: R = J_ref / J_motor</li>
                <li>Required Motor Torque: T_motor = T_load / (i · η)</li>
                <li>Design Rule: High-dynamic robotics R ≤ 5:1; standard positioning R ≤ 10:1</li>
              </ul>
            </div>
          </div>

          {/* Results Panel */}
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm space-y-6 flex flex-col justify-between">
            <div>
              <div className="border-b border-border pb-3">
                <p className="text-[10px] font-bold uppercase tracking-[.24em] text-signal">
                  Inertia Match & Dynamic Evaluation
                </p>
                <h3 className="font-display text-xl font-bold uppercase tracking-tight text-foreground">
                  Reflected Inertia & Required Drive Torque
                </h3>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded border border-border bg-muted/30 p-4">
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                    Reflected Inertia (J_ref)
                  </p>
                  <p className="mt-1 font-mono text-2xl font-bold text-foreground">
                    {(jReflected * 1e4).toFixed(3)} <span className="text-xs font-normal text-muted-foreground">×10⁻⁴ kg·m²</span>
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Reduced by {iRatio * iRatio}x ratio squared
                  </p>
                </div>

                <div className="rounded border border-border bg-muted/30 p-4">
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                    Inertia Ratio (R)
                  </p>
                  <p className="mt-1 font-mono text-2xl font-bold text-signal">
                    {inertiaRatio.toFixed(2)} : 1
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Load-to-motor ratio
                  </p>
                </div>

                <div className="rounded border border-border bg-muted/30 p-4 col-span-2">
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                    Required Motor Shaft Torque
                  </p>
                  <p className="mt-1 font-mono text-2xl font-bold text-foreground">
                    {motorRequiredTorque.toFixed(2)} <span className="text-sm font-normal text-muted-foreground">Nm</span>
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Continuous torque required from driving servomotor
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded border border-border bg-surface-elevated/40 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Dynamic Stability Assessment
                </p>
                <p className={`mt-1 text-sm font-semibold ${inertiaColor}`}>
                  {inertiaAssessment}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Matches products: <strong className="text-foreground">IND-RED-HMC / PLN / CYC</strong>
              </span>
              <Button
                size="sm"
                className="rounded bg-signal text-signal-foreground font-bold uppercase text-xs"
                onClick={() =>
                  openModal("quote", {
                    productName: "Precision Reducer (Harmonic / Planetary)",
                    categoryName: "Precision Reducers",
                  })
                }
              >
                Inquire on Reducer Selection <ArrowRight size={13} className="ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 3. ROBOTIC WRIST OVERHUNG MOMENT */}
      {activeTab === "robot" && (
        <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
          {/* Input Panel */}
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm space-y-5">
            <div className="border-b border-border pb-3">
              <h3 className="font-display text-lg font-bold uppercase tracking-wide text-foreground">
                3. Robot Tool Flange & Wrist Sizing Inputs
              </h3>
              <p className="text-xs text-muted-foreground">
                Validate end-effector cantilever moment and dynamic inertial loading (ISO 9409-1).
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-xs font-semibold text-foreground">Tool + Part Mass (m)</Label>
                <div className="relative mt-1">
                  <Input
                    type="number"
                    step="0.5"
                    value={toolMass}
                    onChange={(e) => setToolMass(e.target.value)}
                    className="pr-10 font-mono text-sm"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">kg</span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">Gripper, bracket, and workpiece</p>
              </div>

              <div>
                <Label className="text-xs font-semibold text-foreground">Center of Gravity Distance (L_cg)</Label>
                <div className="relative mt-1">
                  <Input
                    type="number"
                    value={cgDistance}
                    onChange={(e) => setCgDistance(e.target.value)}
                    className="pr-10 font-mono text-sm"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">mm</span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">From tool flange face to payload CG</p>
              </div>

              <div>
                <Label className="text-xs font-semibold text-foreground">Max Angular Accel (α)</Label>
                <div className="relative mt-1">
                  <Input
                    type="number"
                    value={angAccel}
                    onChange={(e) => setAngAccel(e.target.value)}
                    className="pr-14 font-mono text-sm"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">rad/s²</span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">Wrist rotational acceleration</p>
              </div>

              <div>
                <Label className="text-xs font-semibold text-foreground">Robot Allowable Wrist Moment</Label>
                <div className="relative mt-1">
                  <Input
                    type="number"
                    value={wristAllowableMoment}
                    onChange={(e) => setWristAllowableMoment(e.target.value)}
                    className="pr-10 font-mono text-sm"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">Nm</span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">From robot technical datasheet</p>
              </div>
            </div>

            {/* Documented Formulas Callout */}
            <div className="rounded border border-border bg-muted/20 p-4 text-xs space-y-2">
              <p className="font-bold uppercase tracking-wider text-signal flex items-center gap-1.5">
                <FileText size={14} /> Documented Wrist Moment Formulation (ISO 9409-1)
              </p>
              <ul className="list-disc pl-4 text-muted-foreground space-y-1 font-mono text-[11px]">
                <li>Static Gravity Moment: M_stat = m_load · g · L_cg</li>
                <li>Dynamic Rotational Inertial Moment: M_dyn = m_load · L_cg² · α</li>
                <li>Total Wrist Moment: M_total = M_stat + M_dyn</li>
                <li>Required Safety Condition: M_total ≤ M_allowable (SF ≥ 1.5 recommended)</li>
              </ul>
            </div>
          </div>

          {/* Results Panel */}
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm space-y-6 flex flex-col justify-between">
            <div>
              <div className="border-b border-border pb-3">
                <p className="text-[10px] font-bold uppercase tracking-[.24em] text-signal">
                  Wrist Flange Moment Capacity
                </p>
                <h3 className="font-display text-xl font-bold uppercase tracking-tight text-foreground">
                  Applied Moment vs Allowable Rating
                </h3>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded border border-border bg-muted/30 p-4">
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                    Total Applied Moment
                  </p>
                  <p className="mt-1 font-mono text-2xl font-bold text-foreground">
                    {mTotalWrist.toFixed(2)} <span className="text-sm font-normal text-muted-foreground">Nm</span>
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Static: {mStatic.toFixed(1)} Nm | Inertial: {mDynamicInertia.toFixed(1)} Nm
                  </p>
                </div>

                <div className="rounded border border-border bg-muted/30 p-4">
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                    Wrist Capacity Used
                  </p>
                  <p
                    className={`mt-1 font-mono text-2xl font-bold ${
                      wristLoadPercent <= 80
                        ? "text-emerald-500"
                        : wristLoadPercent <= 100
                        ? "text-amber-500"
                        : "text-rose-500"
                    }`}
                  >
                    {wristLoadPercent.toFixed(1)} %
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Safety Factor: {wristSafetyFactor.toFixed(2)}x
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded border border-border bg-surface-elevated/40 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Wrist Rating Compliance
                </p>
                <p
                  className={`mt-1 text-sm font-semibold ${
                    wristLoadPercent <= 100 ? "text-emerald-500" : "text-rose-500"
                  }`}
                >
                  {wristLoadPercent <= 80
                    ? "OPTIMAL: Well within dynamic wrist moment rating (SF ≥ 1.25)"
                    : wristLoadPercent <= 100
                    ? "ACCEPTABLE: Operating near maximum allowable wrist envelope"
                    : "EXCEEDED: Overhung moment exceeds manufacturer wrist rating. Reduce payload offset or acceleration."}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Matches products: <strong className="text-foreground">IND-ARM-6AX / COB / DLT</strong>
              </span>
              <Button
                size="sm"
                className="rounded bg-signal text-signal-foreground font-bold uppercase text-xs"
                onClick={() =>
                  openModal("quote", {
                    productName: "Robotic Arm (6-Axis / Cobot)",
                    categoryName: "Robotic Arms",
                  })
                }
              >
                Inquire on Robot Sizing <ArrowRight size={13} className="ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
