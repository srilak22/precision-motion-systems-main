import React, { useState } from "react";
import { Layers, Activity, GitBranch, Cpu, ShieldCheck } from "lucide-react";

export type DiagramType = "iso-ifr-system" | "articulated-arm" | "scara-kinematics" | "amr-kinematics" | "autonomous-control-loop";

export function TaxonomyDiagrams() {
  const [activeDiagram, setActiveDiagram] = useState<DiagramType>("iso-ifr-system");

  return (
    <div className="space-y-6">
      {/* Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border/60 pb-4">
        <button
          onClick={() => setActiveDiagram("iso-ifr-system")}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
            activeDiagram === "iso-ifr-system"
              ? "bg-signal text-signal-foreground shadow-sm"
              : "bg-surface-elevated/60 text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
          }`}
        >
          <GitBranch size={13} />
          ISO 8373 vs IFR Taxonomy Framework
        </button>

        <button
          onClick={() => setActiveDiagram("articulated-arm")}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
            activeDiagram === "articulated-arm"
              ? "bg-signal text-signal-foreground shadow-sm"
              : "bg-surface-elevated/60 text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
          }`}
        >
          <Layers size={13} />
          6-Axis Articulated Arm Kinematics
        </button>

        <button
          onClick={() => setActiveDiagram("scara-kinematics")}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
            activeDiagram === "scara-kinematics"
              ? "bg-signal text-signal-foreground shadow-sm"
              : "bg-surface-elevated/60 text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
          }`}
        >
          <Cpu size={13} />
          SCARA Planar Kinematic Scheme
        </button>

        <button
          onClick={() => setActiveDiagram("amr-kinematics")}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
            activeDiagram === "amr-kinematics"
              ? "bg-signal text-signal-foreground shadow-sm"
              : "bg-surface-elevated/60 text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
          }`}
        >
          <Activity size={13} />
          AMR Differential Motion &amp; Safety Fields
        </button>

        <button
          onClick={() => setActiveDiagram("autonomous-control-loop")}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
            activeDiagram === "autonomous-control-loop"
              ? "bg-signal text-signal-foreground shadow-sm"
              : "bg-surface-elevated/60 text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
          }`}
        >
          <ShieldCheck size={13} />
          Closed-Loop Autonomous Control Pipeline
        </button>
      </div>

      {/* Render Diagram */}
      <div className="rounded-lg border border-border/60 bg-surface-dark p-6 text-surface-foreground shadow-xl">
        {activeDiagram === "iso-ifr-system" && <IsoIfrSystemDiagram />}
        {activeDiagram === "articulated-arm" && <ArticulatedArmDiagram />}
        {activeDiagram === "scara-kinematics" && <ScaraKinematicsDiagram />}
        {activeDiagram === "amr-kinematics" && <AmrKinematicsDiagram />}
        {activeDiagram === "autonomous-control-loop" && <AutonomousControlLoopDiagram />}
      </div>
    </div>
  );
}

/* 1. ISO 8373 vs IFR Taxonomy Framework Diagram */
function IsoIfrSystemDiagram() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-2 border-b border-border/30 pb-3 md:flex-row md:items-center">
        <div>
          <h3 className="font-display text-base font-bold uppercase text-foreground">
            ISO 8373:2021 &amp; IFR Robotics Classification Hierarchy
          </h3>
          <p className="text-xs text-muted-foreground">
            Preserving the formal international distinction between morphology-driven Industrial Robots and application/locomotion-driven Service Robots.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded bg-precision-blue/20 px-2 py-0.5 text-[10px] font-bold uppercase text-precision-blue">
            ISO TC 299
          </span>
          <span className="rounded bg-signal/20 px-2 py-0.5 text-[10px] font-bold uppercase text-signal">
            IFR Statistical Standard
          </span>
        </div>
      </div>

      <div className="overflow-x-auto py-4">
        <svg viewBox="0 0 960 480" className="w-full min-w-[760px] text-xs font-sans">
          {/* Defs */}
          <defs>
            <linearGradient id="grad-blue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2388FF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#101B2D" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="grad-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#16C7E8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#101B2D" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="grad-card" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#16243A" />
              <stop offset="100%" stopColor="#101B2D" />
            </linearGradient>
            <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#16C7E8" />
            </marker>
          </defs>

          {/* Root ISO 8373 Node */}
          <rect x="330" y="20" width="300" height="60" rx="4" fill="url(#grad-blue)" stroke="#2388FF" strokeWidth="1.5" />
          <text x="480" y="44" textAnchor="middle" fill="#FFFFFF" fontWeight="bold" fontSize="13">
            ISO 8373:2021 — ROBOT DEFINITION
          </text>
          <text x="480" y="62" textAnchor="middle" fill="#E2E8F0" fontSize="10">
            Actuated mechanism in 2+ axes with degree of autonomy
          </text>

          {/* Connector lines to Primary Branches */}
          <path d="M 400 80 L 400 120 L 220 120 L 220 150" fill="none" stroke="#2388FF" strokeWidth="2" markerEnd="url(#arrow)" />
          <path d="M 560 80 L 560 120 L 740 120 L 740 150" fill="none" stroke="#16C7E8" strokeWidth="2" markerEnd="url(#arrow)" />

          {/* Branch 1: Industrial Robots */}
          <rect x="70" y="150" width="300" height="75" rx="4" fill="url(#grad-card)" stroke="#2388FF" strokeWidth="1.5" />
          <text x="220" y="175" textAnchor="middle" fill="#2388FF" fontWeight="bold" fontSize="13">
            INDUSTRIAL ROBOTS (Clause 3.6)
          </text>
          <text x="220" y="195" textAnchor="middle" fill="#94A3B8" fontSize="10">
            Multipurpose manipulator in 3+ axes, automatically
          </text>
          <text x="220" y="210" textAnchor="middle" fill="#94A3B8" fontSize="10">
            controlled, fixed/mobile in manufacturing automation
          </text>

          {/* Branch 2: Service Robots */}
          <rect x="590" y="150" width="300" height="75" rx="4" fill="url(#grad-card)" stroke="#16C7E8" strokeWidth="1.5" />
          <text x="740" y="175" textAnchor="middle" fill="#16C7E8" fontWeight="bold" fontSize="13">
            SERVICE ROBOTS (Clause 3.7)
          </text>
          <text x="740" y="195" textAnchor="middle" fill="#94A3B8" fontSize="10">
            Performs useful tasks for humans or equipment
          </text>
          <text x="740" y="210" textAnchor="middle" fill="#94A3B8" fontSize="10">
            excluding industrial automation applications
          </text>

          {/* Principle Tags */}
          <rect x="70" y="235" width="300" height="28" rx="2" fill="#2388FF" fillOpacity="0.15" stroke="#2388FF" strokeDasharray="3 3" />
          <text x="220" y="253" textAnchor="middle" fill="#93C5FD" fontSize="10" fontWeight="bold">
            CLASSIFICATION PRINCIPLE: MECHANICAL MORPHOLOGY
          </text>

          <rect x="590" y="235" width="300" height="28" rx="2" fill="#16C7E8" fillOpacity="0.15" stroke="#16C7E8" strokeDasharray="3 3" />
          <text x="740" y="253" textAnchor="middle" fill="#67E8F9" fontSize="10" fontWeight="bold">
            CLASSIFICATION PRINCIPLE: APPLICATION &amp; LOCOMOTION
          </text>

          {/* Sub-boxes Industrial */}
          <g transform="translate(70, 280)">
            <rect x="0" y="0" width="140" height="40" rx="3" fill="#16243A" stroke="#334155" />
            <text x="70" y="24" textAnchor="middle" fill="#E2E8F0" fontSize="11">Articulated Arm</text>

            <rect x="160" y="0" width="140" height="40" rx="3" fill="#16243A" stroke="#334155" />
            <text x="230" y="24" textAnchor="middle" fill="#E2E8F0" fontSize="11">SCARA Kinematics</text>

            <rect x="0" y="50" width="140" height="40" rx="3" fill="#16243A" stroke="#334155" />
            <text x="70" y="74" textAnchor="middle" fill="#E2E8F0" fontSize="11">Cartesian / Gantry</text>

            <rect x="160" y="50" width="140" height="40" rx="3" fill="#16243A" stroke="#334155" />
            <text x="230" y="74" textAnchor="middle" fill="#E2E8F0" fontSize="11">Delta / Parallel</text>

            <rect x="0" y="100" width="140" height="40" rx="3" fill="#16243A" stroke="#334155" />
            <text x="70" y="124" textAnchor="middle" fill="#E2E8F0" fontSize="11">Collaborative Cobot</text>

            <rect x="160" y="100" width="140" height="40" rx="3" fill="#16243A" stroke="#334155" />
            <text x="230" y="124" textAnchor="middle" fill="#E2E8F0" fontSize="11">Cylindrical / Polar</text>
          </g>

          {/* Sub-boxes Service */}
          <g transform="translate(590, 280)">
            <rect x="0" y="0" width="140" height="40" rx="3" fill="#16243A" stroke="#334155" />
            <text x="70" y="24" textAnchor="middle" fill="#E2E8F0" fontSize="11">Mobile AMRs / AGVs</text>

            <rect x="160" y="0" width="140" height="40" rx="3" fill="#16243A" stroke="#334155" />
            <text x="230" y="24" textAnchor="middle" fill="#E2E8F0" fontSize="11">Quadruped Mules</text>

            <rect x="0" y="50" width="140" height="40" rx="3" fill="#16243A" stroke="#334155" />
            <text x="70" y="74" textAnchor="middle" fill="#E2E8F0" fontSize="11">Aerial Drones</text>

            <rect x="160" y="50" width="140" height="40" rx="3" fill="#16243A" stroke="#334155" />
            <text x="230" y="74" textAnchor="middle" fill="#E2E8F0" fontSize="11">Subsea ROVs / AUVs</text>

            <rect x="0" y="100" width="140" height="40" rx="3" fill="#16243A" stroke="#334155" />
            <text x="70" y="124" textAnchor="middle" fill="#E2E8F0" fontSize="11">AS/RS Cube Grids</text>

            <rect x="160" y="100" width="140" height="40" rx="3" fill="#16243A" stroke="#334155" />
            <text x="230" y="124" textAnchor="middle" fill="#E2E8F0" fontSize="11">Surgical Platforms</text>
          </g>

          {/* Central Hybrid Connector */}
          <path d="M 370 380 L 480 380 L 590 380" fill="none" stroke="#64748B" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="480" cy="380" r="18" fill="#101B2D" stroke="#16C7E8" strokeWidth="1.5" />
          <text x="480" y="384" textAnchor="middle" fill="#16C7E8" fontSize="9" fontWeight="bold">INDUS</text>
          <text x="480" y="415" textAnchor="middle" fill="#94A3B8" fontSize="10">
            8-Pillar Framework Bridges Mechanical Kinematics with Real Industrial Missions
          </text>
        </svg>
      </div>
    </div>
  );
}

/* 2. 6-Axis Articulated Arm Kinematic Schematic */
function ArticulatedArmDiagram() {
  return (
    <div className="space-y-4">
      <div className="border-b border-border/30 pb-3">
        <h3 className="font-display text-base font-bold uppercase text-foreground">
          6-Axis Serial Kinematic Chain &amp; Drivetrain Layout
        </h3>
        <p className="text-xs text-muted-foreground">
          Revolute joint configuration (J1–J6) illustrating cycloidal reducers on major positioning axes and strain-wave reducers on orienting wrist axes.
        </p>
      </div>

      <div className="overflow-x-auto py-2">
        <svg viewBox="0 0 900 400" className="w-full min-w-[700px] text-xs font-sans">
          {/* Base Pedestal */}
          <rect x="80" y="320" width="140" height="50" rx="3" fill="#1E293B" stroke="#475569" strokeWidth="2" />
          <text x="150" y="350" textAnchor="middle" fill="#E2E8F0" fontWeight="bold">BASE PEDESTAL</text>

          {/* J1 Joint (Waist Rotation) */}
          <circle cx="150" cy="300" r="24" fill="#16243A" stroke="#2388FF" strokeWidth="2" />
          <text x="150" y="304" textAnchor="middle" fill="#2388FF" fontWeight="bold">J1</text>
          <text x="190" y="305" fill="#94A3B8" fontSize="10">Waist Yaw (RV Cycloid)</text>

          {/* Link 1 */}
          <rect x="135" y="210" width="30" height="65" fill="#334155" stroke="#64748B" />

          {/* J2 Joint (Shoulder Pitch) */}
          <circle cx="150" cy="200" r="26" fill="#16243A" stroke="#2388FF" strokeWidth="2.5" />
          <text x="150" y="204" textAnchor="middle" fill="#2388FF" fontWeight="bold">J2</text>
          <text x="60" y="195" fill="#94A3B8" fontSize="10">Shoulder Pitch</text>
          <text x="60" y="210" fill="#64748B" fontSize="9">Max Bending Torque</text>

          {/* Upper Arm Link */}
          <line x1="168" y1="185" x2="330" y2="105" stroke="#475569" strokeWidth="22" strokeLinecap="round" />

          {/* J3 Joint (Elbow Pitch) */}
          <circle cx="340" cy="100" r="24" fill="#16243A" stroke="#2388FF" strokeWidth="2" />
          <text x="340" y="104" textAnchor="middle" fill="#2388FF" fontWeight="bold">J3</text>
          <text x="340" y="70" textAnchor="middle" fill="#94A3B8" fontSize="10">Elbow Pitch (RV Cycloid)</text>

          {/* Forearm Link */}
          <line x1="360" y1="105" x2="540" y2="135" stroke="#334155" strokeWidth="18" strokeLinecap="round" />

          {/* J4 Joint (Forearm Roll) */}
          <circle cx="550" cy="138" r="18" fill="#16243A" stroke="#16C7E8" strokeWidth="1.5" />
          <text x="550" y="142" textAnchor="middle" fill="#16C7E8" fontWeight="bold" fontSize="10">J4</text>
          <text x="550" y="172" textAnchor="middle" fill="#94A3B8" fontSize="10">Forearm Roll</text>

          {/* J5 Joint (Wrist Pitch) */}
          <circle cx="620" cy="148" r="18" fill="#16243A" stroke="#16C7E8" strokeWidth="1.5" />
          <text x="620" y="152" textAnchor="middle" fill="#16C7E8" fontWeight="bold" fontSize="10">J5</text>
          <text x="620" y="182" textAnchor="middle" fill="#94A3B8" fontSize="10">Wrist Pitch</text>

          {/* J6 Joint (Wrist Roll Tool Flange) */}
          <circle cx="690" cy="158" r="18" fill="#16243A" stroke="#16C7E8" strokeWidth="2" />
          <text x="690" y="162" textAnchor="middle" fill="#16C7E8" fontWeight="bold" fontSize="10">J6</text>
          <text x="690" y="192" textAnchor="middle" fill="#94A3B8" fontSize="10">Wrist Roll</text>

          {/* Tool Flange & TCP */}
          <rect x="715" y="150" width="16" height="24" fill="#E2E8F0" />
          <path d="M 731 162 L 770 162" stroke="#EF4444" strokeWidth="2" strokeDasharray="3 3" />
          <circle cx="770" cy="162" r="4" fill="#EF4444" />
          <text x="780" y="166" fill="#EF4444" fontWeight="bold" fontSize="11">TCP (Tool Center Point)</text>

          {/* Engineering Callout Cards */}
          <g transform="translate(620, 220)">
            <rect x="0" y="0" width="240" height="120" rx="4" fill="#16243A" stroke="#334155" />
            <text x="15" y="24" fill="#16C7E8" fontWeight="bold" fontSize="11">WRIST DRIVETRAIN</text>
            <text x="15" y="44" fill="#CBD5E1" fontSize="10">• Strain-Wave Harmonic Reducers</text>
            <text x="15" y="60" fill="#CBD5E1" fontSize="10">• Hollow-Bore internal dress cabling</text>
            <text x="15" y="76" fill="#CBD5E1" fontSize="10">• Zero backlash (&lt;0.5 arcmin)</text>
            <text x="15" y="96" fill="#94A3B8" fontSize="9">ISO 9409-1 Flange Interface</text>
          </g>

          <g transform="translate(260, 260)">
            <rect x="0" y="0" width="230" height="90" rx="4" fill="#16243A" stroke="#334155" />
            <text x="15" y="24" fill="#2388FF" fontWeight="bold" fontSize="11">MAIN AXES (J1–J3)</text>
            <text x="15" y="44" fill="#CBD5E1" fontSize="10">• High-rigidity RV Cycloidal Drives</text>
            <text x="15" y="60" fill="#CBD5E1" fontSize="10">• Resists extreme dynamic moments</text>
            <text x="15" y="76" fill="#94A3B8" fontSize="9">Up to 500% momentary shock rating</text>
          </g>
        </svg>
      </div>
    </div>
  );
}

/* 3. SCARA Kinematics Diagram */
function ScaraKinematicsDiagram() {
  return (
    <div className="space-y-4">
      <div className="border-b border-border/30 pb-3">
        <h3 className="font-display text-base font-bold uppercase text-foreground">
          SCARA Kinematic Architecture (Selective Compliance)
        </h3>
        <p className="text-xs text-muted-foreground">
          Horizontal planar articulated joints (J1 &amp; J2) combined with vertical prismatic stroke and quill rotation (Z &amp; U).
        </p>
      </div>

      <div className="overflow-x-auto py-2">
        <svg viewBox="0 0 840 360" className="w-full min-w-[650px] text-xs font-sans">
          {/* Base Pedestal */}
          <rect x="60" y="220" width="120" height="80" rx="3" fill="#1E293B" stroke="#475569" strokeWidth="2" />
          <text x="120" y="265" textAnchor="middle" fill="#E2E8F0" fontWeight="bold">FIXED BASE</text>

          {/* J1 Axis */}
          <circle cx="120" cy="180" r="28" fill="#16243A" stroke="#2388FF" strokeWidth="2" />
          <text x="120" y="185" textAnchor="middle" fill="#2388FF" fontWeight="bold">J1</text>
          <text x="120" y="145" textAnchor="middle" fill="#94A3B8" fontSize="10">Arm 1 Rotation (θ1)</text>

          {/* Link 1 */}
          <line x1="148" y1="180" x2="340" y2="180" stroke="#334155" strokeWidth="26" strokeLinecap="round" />

          {/* J2 Axis */}
          <circle cx="360" cy="180" r="26" fill="#16243A" stroke="#2388FF" strokeWidth="2" />
          <text x="360" y="185" textAnchor="middle" fill="#2388FF" fontWeight="bold">J2</text>
          <text x="360" y="145" textAnchor="middle" fill="#94A3B8" fontSize="10">Arm 2 Rotation (θ2)</text>

          {/* Link 2 */}
          <line x1="386" y1="180" x2="540" y2="180" stroke="#475569" strokeWidth="20" strokeLinecap="round" />

          {/* Quill Head (J3 & J4) */}
          <rect x="540" y="140" width="40" height="80" rx="3" fill="#16243A" stroke="#16C7E8" strokeWidth="2" />
          <text x="560" y="175" textAnchor="middle" fill="#16C7E8" fontWeight="bold" fontSize="10">QUILL</text>

          {/* Ball Screw Spline Shaft */}
          <line x1="560" y1="80" x2="560" y2="280" stroke="#E2E8F0" strokeWidth="8" strokeDasharray="6 2" />
          
          {/* Z-Axis Motion Arrows */}
          <path d="M 590 120 L 590 80" stroke="#16C7E8" strokeWidth="2" markerEnd="url(#arrow)" />
          <path d="M 590 200 L 590 250" stroke="#16C7E8" strokeWidth="2" markerEnd="url(#arrow)" />
          <text x="610" y="170" fill="#16C7E8" fontWeight="bold">Z-Stroke (Prismatic)</text>

          {/* Gripper */}
          <rect x="548" y="280" width="24" height="15" fill="#EF4444" />
          <line x1="544" y1="295" x2="544" y2="315" stroke="#EF4444" strokeWidth="3" />
          <line x1="576" y1="295" x2="576" y2="315" stroke="#EF4444" strokeWidth="3" />
          <text x="590" y="310" fill="#EF4444" fontSize="10">Gripper End-Effector</text>

          {/* Spec Box */}
          <g transform="translate(60, 40)">
            <rect x="0" y="0" width="240" height="70" rx="3" fill="#16243A" stroke="#334155" />
            <text x="15" y="24" fill="#16C7E8" fontWeight="bold">HORIZONTAL COMPLIANCE</text>
            <text x="15" y="44" fill="#94A3B8" fontSize="10">High rigidity in vertical Z-axis;</text>
            <text x="15" y="58" fill="#94A3B8" fontSize="10">Compliant in X-Y prevents component jam</text>
          </g>
        </svg>
      </div>
    </div>
  );
}

/* 4. AMR Differential Motion & Safety Field Diagram */
function AmrKinematicsDiagram() {
  return (
    <div className="space-y-4">
      <div className="border-b border-border/30 pb-3">
        <h3 className="font-display text-base font-bold uppercase text-foreground">
          Autonomous Mobile Robot (AMR) Differential Drive &amp; Safety Envelopes
        </h3>
        <p className="text-xs text-muted-foreground">
          ISO 3691-4:2023 certified dynamic safety laser scanner protective fields expanding proportional to vehicle velocity.
        </p>
      </div>

      <div className="overflow-x-auto py-2">
        <svg viewBox="0 0 860 380" className="w-full min-w-[680px] text-xs font-sans">
          {/* Floor Grid */}
          <line x1="50" y1="320" x2="810" y2="320" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />

          {/* Dynamic Laser Fields (Outer Warning, Inner Protective Stop) */}
          <ellipse cx="480" cy="180" rx="220" ry="120" fill="#EF4444" fillOpacity="0.08" stroke="#EF4444" strokeWidth="1" strokeDasharray="4 2" />
          <text x="640" y="100" fill="#EF4444" fontSize="10" fontWeight="bold">WARNING FIELD (Slow Down)</text>

          <ellipse cx="450" cy="180" rx="140" ry="75" fill="#EF4444" fillOpacity="0.2" stroke="#EF4444" strokeWidth="1.5" />
          <text x="490" y="130" fill="#EF4444" fontSize="10" fontWeight="bold">PROTECTIVE STOP FIELD</text>

          {/* AMR Chassis (Top View) */}
          <rect x="250" y="120" width="180" height="120" rx="10" fill="#16243A" stroke="#2388FF" strokeWidth="2" />
          <text x="340" y="175" textAnchor="middle" fill="#FFFFFF" fontWeight="bold" fontSize="13">AMR CHASSIS</text>
          <text x="340" y="195" textAnchor="middle" fill="#16C7E8" fontSize="10">Payload Deck: 1,000 kg</text>

          {/* Drive Wheels */}
          <rect x="325" y="100" width="30" height="16" rx="2" fill="#2388FF" />
          <rect x="325" y="244" width="30" height="16" rx="2" fill="#2388FF" />
          <text x="340" y="85" textAnchor="middle" fill="#93C5FD" fontSize="9">Left Drive Wheel</text>
          <text x="340" y="275" textAnchor="middle" fill="#93C5FD" fontSize="9">Right Drive Wheel</text>

          {/* Swivel Casters */}
          <circle cx="270" cy="140" r="8" fill="#64748B" />
          <circle cx="270" cy="220" r="8" fill="#64748B" />
          <circle cx="410" cy="140" r="8" fill="#64748B" />
          <circle cx="410" cy="220" r="8" fill="#64748B" />

          {/* Front Safety Scanner (270° coverage) */}
          <polygon points="425,125 435,135 425,145" fill="#16C7E8" />
          <circle cx="425" cy="135" r="7" fill="#16C7E8" />
          <text x="445" y="140" fill="#16C7E8" fontSize="9">LiDAR 1 (Front)</text>

          {/* Rear Safety Scanner */}
          <circle cx="255" cy="225" r="7" fill="#16C7E8" />
          <text x="200" y="230" fill="#16C7E8" fontSize="9">LiDAR 2 (Rear)</text>

          {/* Velocity Vector */}
          <path d="M 430 180 L 530 180" stroke="#16C7E8" strokeWidth="3" markerEnd="url(#arrow)" />
          <text x="480" y="200" fill="#16C7E8" fontWeight="bold">v = 2.0 m/s</text>

          {/* VDA 5050 Cloud Fleet Interface Box */}
          <g transform="translate(60, 40)">
            <rect x="0" y="0" width="220" height="75" rx="3" fill="#101B2D" stroke="#334155" />
            <text x="15" y="24" fill="#2388FF" fontWeight="bold">VDA 5050 v2.1.0 INTERACTION</text>
            <text x="15" y="44" fill="#94A3B8" fontSize="10">• Dynamic Order Trajectory (JSON)</text>
            <text x="15" y="60" fill="#94A3B8" fontSize="10">• MQTT state telemetry @ 10 Hz</text>
          </g>
        </svg>
      </div>
    </div>
  );
}

/* 5. Closed-Loop Autonomous Control Pipeline */
function AutonomousControlLoopDiagram() {
  return (
    <div className="space-y-4">
      <div className="border-b border-border/30 pb-3">
        <h3 className="font-display text-base font-bold uppercase text-foreground">
          Autonomous Perception, Planning &amp; Real-Time Actuation Pipeline
        </h3>
        <p className="text-xs text-muted-foreground">
          5-tier deterministic control architecture from millisecond motor current loops to cloud-coordinated mission planning.
        </p>
      </div>

      <div className="overflow-x-auto py-2">
        <svg viewBox="0 0 920 300" className="w-full min-w-[720px] text-xs font-sans">
          {/* Tier 1: Sensing */}
          <g transform="translate(20, 40)">
            <rect x="0" y="0" width="150" height="200" rx="4" fill="#16243A" stroke="#334155" />
            <rect x="0" y="0" width="150" height="32" rx="4" fill="#2388FF" fillOpacity="0.2" />
            <text x="75" y="22" textAnchor="middle" fill="#2388FF" fontWeight="bold">1. PERCEPTION</text>
            <text x="15" y="55" fill="#CBD5E1" fontSize="10">• 3D LiDAR Point Cloud</text>
            <text x="15" y="80" fill="#CBD5E1" fontSize="10">• Stereo Depth Cameras</text>
            <text x="15" y="105" fill="#CBD5E1" fontSize="10">• 6-Axis Tactical IMU</text>
            <text x="15" y="130" fill="#CBD5E1" fontSize="10">• Joint Torque Cells</text>
            <text x="15" y="155" fill="#CBD5E1" fontSize="10">• Absolute Encoders</text>
            <text x="75" y="185" textAnchor="middle" fill="#64748B" fontSize="9">Bandwidth: 1.2 Gbps</text>
          </g>

          {/* Arrow */}
          <line x1="175" y1="140" x2="205" y2="140" stroke="#16C7E8" strokeWidth="2" markerEnd="url(#arrow)" />

          {/* Tier 2: State Estimation */}
          <g transform="translate(210, 40)">
            <rect x="0" y="0" width="150" height="200" rx="4" fill="#16243A" stroke="#334155" />
            <rect x="0" y="0" width="150" height="32" rx="4" fill="#2388FF" fillOpacity="0.2" />
            <text x="75" y="22" textAnchor="middle" fill="#2388FF" fontWeight="bold">2. ESTIMATION</text>
            <text x="15" y="55" fill="#CBD5E1" fontSize="10">• EKF / Factor Graph SLAM</text>
            <text x="15" y="80" fill="#CBD5E1" fontSize="10">• 6-DoF Centroidal State</text>
            <text x="15" y="105" fill="#CBD5E1" fontSize="10">• Dynamic Obstacle Voxel</text>
            <text x="15" y="130" fill="#CBD5E1" fontSize="10">• Contact Force Est.</text>
            <text x="75" y="185" textAnchor="middle" fill="#64748B" fontSize="9">Frequency: 250 Hz</text>
          </g>

          {/* Arrow */}
          <line x1="365" y1="140" x2="395" y2="140" stroke="#16C7E8" strokeWidth="2" markerEnd="url(#arrow)" />

          {/* Tier 3: Trajectory Planning */}
          <g transform="translate(400, 40)">
            <rect x="0" y="0" width="150" height="200" rx="4" fill="#16243A" stroke="#334155" />
            <rect x="0" y="0" width="150" height="32" rx="4" fill="#16C7E8" fillOpacity="0.2" />
            <text x="75" y="22" textAnchor="middle" fill="#16C7E8" fontWeight="bold">3. PLANNING</text>
            <text x="15" y="55" fill="#CBD5E1" fontSize="10">• Whole-Body MPC</text>
            <text x="15" y="80" fill="#CBD5E1" fontSize="10">• Collision Detour Path</text>
            <text x="15" y="105" fill="#CBD5E1" fontSize="10">• Jerk-Limited S-Curve</text>
            <text x="15" y="130" fill="#CBD5E1" fontSize="10">• Friction Cone Const.</text>
            <text x="75" y="185" textAnchor="middle" fill="#64748B" fontSize="9">Frequency: 100 Hz</text>
          </g>

          {/* Arrow */}
          <line x1="555" y1="140" x2="585" y2="140" stroke="#16C7E8" strokeWidth="2" markerEnd="url(#arrow)" />

          {/* Tier 4: Real-time Servo Loop */}
          <g transform="translate(590, 40)">
            <rect x="0" y="0" width="150" height="200" rx="4" fill="#16243A" stroke="#334155" />
            <rect x="0" y="0" width="150" height="32" rx="4" fill="#16C7E8" fillOpacity="0.2" />
            <text x="75" y="22" textAnchor="middle" fill="#16C7E8" fontWeight="bold">4. SERVO CONTROL</text>
            <text x="15" y="55" fill="#CBD5E1" fontSize="10">• Inverse Dynamics ID</text>
            <text x="15" y="80" fill="#CBD5E1" fontSize="10">• FOC Current Loop</text>
            <text x="15" y="105" fill="#CBD5E1" fontSize="10">• High-Speed EtherCAT</text>
            <text x="15" y="130" fill="#CBD5E1" fontSize="10">• Safe Torque Off (STO)</text>
            <text x="75" y="185" textAnchor="middle" fill="#64748B" fontSize="9">Loop: 16–20 kHz</text>
          </g>

          {/* Arrow */}
          <line x1="745" y1="140" x2="775" y2="140" stroke="#16C7E8" strokeWidth="2" markerEnd="url(#arrow)" />

          {/* Tier 5: Physical Hardware */}
          <g transform="translate(780, 40)">
            <rect x="0" y="0" width="120" height="200" rx="4" fill="#1E293B" stroke="#475569" />
            <rect x="0" y="0" width="120" height="32" rx="4" fill="#EF4444" fillOpacity="0.2" />
            <text x="60" y="22" textAnchor="middle" fill="#EF4444" fontWeight="bold">5. ACTUATION</text>
            <text x="10" y="55" fill="#CBD5E1" fontSize="10">• PMSM Motors</text>
            <text x="10" y="80" fill="#CBD5E1" fontSize="10">• Strain-Wave Gears</text>
            <text x="10" y="105" fill="#CBD5E1" fontSize="10">• Cycloidal Drives</text>
            <text x="10" y="130" fill="#CBD5E1" fontSize="10">• Holding Brakes</text>
            <text x="60" y="185" textAnchor="middle" fill="#94A3B8" fontSize="9">Physical World</text>
          </g>
        </svg>
      </div>
    </div>
  );
}
