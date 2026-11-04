import React, { useState } from "react";
import {
  FileText,
  Package,
  Lock,
  Compass,
  Building,
  BellRing,
  KeyRound,
  BatteryCharging,
  ArrowRight,
  ChevronRight,
  Activity,
  CheckCircle2,
} from "lucide-react";

interface WorkflowStage {
  id: string;
  stepNumber: number;
  name: string;
  shortName: string;
  icon: React.ElementType;
  description: string;
  input: string;
  processing: string;
  output: string;
  latency: string;
  protocols: string;
}

const WORKFLOW_STAGES: WorkflowStage[] = [
  {
    id: "order-ingestion",
    stepNumber: 1,
    name: "Clinical Order Ingestion",
    shortName: "Order Intake",
    icon: FileText,
    description:
      "A clinician enters a medication or lab transport request into the Hospital Information System (EHR/HIS). The dispatch engine validates priority level (STAT vs. Routine) and assigns the closest available delivery robot.",
    input: "HL7 Order Message / FHIR Task payload containing patient ward, medication SKU, and target nurse ID",
    processing:
      "Priority triage, fleet route optimization, and compartment volume allocation",
    output: "Mission dispatch manifest sent to assigned robot over encrypted Wi-Fi",
    latency: "<350 ms",
    protocols: "HL7 v2.5.1 / FHIR R4 / TLS 1.3",
  },
  {
    id: "pharmacy-loading",
    stepNumber: 2,
    name: "Pharmacy / Lab Loading",
    shortName: "Secure Loading",
    icon: Package,
    description:
      "The robot docks at the central pharmacy or pathology lab. The technician scans their staff badge and the medication barcode; the assigned smart compartment door unlocks automatically.",
    input: "Staff RFID badge scan and medication 2D DataMatrix barcode scan",
    processing:
      "Barcode cross-verification against order manifest and physical door solenoid actuation",
    output: "Medication placed inside; compartment closed and physical seal confirmed",
    latency: "1.2 s",
    protocols: "NFC ISO 14443A / 2D Barcode Engine",
  },
  {
    id: "biometric-sealing",
    stepNumber: 3,
    name: "Chain-of-Custody Sealing",
    shortName: "Digital Sealing",
    icon: Lock,
    description:
      "The compartment door snaps shut, engaging high-torque electronic solenoid deadbolts. A cryptographic chain-of-custody token is minted recording load timestamp, technician ID, and initial compartment temperature.",
    input: "Door contact closure sensor and internal temperature probe reading",
    processing:
      "Solenoid latch engagement, tamper-sensor arming, cryptographic custody hash generation",
    output: "Tamper-monitored secure state active; EHR order updated to 'In-Transit'",
    latency: "<200 ms",
    protocols: "AES-256 GCM / Hardware Security Module (HSM)",
  },
  {
    id: "corridor-transit",
    stepNumber: 4,
    name: "Autonomous Corridor Navigation",
    shortName: "Hallway Transit",
    icon: Compass,
    description:
      "The robot navigates hospital corridors smoothly at whisper-quiet speeds, dynamically rerouting around gurneys, cleaning carts, and walking patients while maintaining certified safety clearances.",
    input: "Continuous 360° dual planar LiDAR point clouds, 3D depth camera frames, and IMU odometry",
    processing:
      "Real-time costmap generation, dynamic pedestrian velocity extrapolation, and smooth jerk-free trajectory interpolation",
    output: "Safe, uninterrupted transit at 0.8–1.2 m/s governed clinical corridor speed",
    latency: "20 ms loop",
    protocols: "ROS2 Nav2 / ISO 3691-4 Safety Gov",
  },
  {
    id: "elevator-interfacing",
    stepNumber: 5,
    name: "Elevator & Multi-Floor Interfacing",
    shortName: "Elevator Transit",
    icon: Building,
    description:
      "Approaching the elevator bank, the robot calls the elevator car via wireless IoT relay, reserves car space, safely boards upon car arrival, and commands the destination floor autonomously.",
    input: "Target floor ID, elevator status beacons, and door optical opening sensors",
    processing:
      "Elevator dispatch negotiation, priority boarding clearance, and floor arrival confirmation",
    output: "Seamless floor-to-floor transition without human assistance or manual button pressing",
    latency: "<500 ms handshake",
    protocols: "BACnet IP / MQTT Gateway / Modbus TCP",
  },
  {
    id: "arrival-alert",
    stepNumber: 6,
    name: "Department Arrival Alert",
    shortName: "Nurse Pager Alert",
    icon: BellRing,
    description:
      "Upon arriving outside the target ward nursing station or ICU entrance, the robot broadcasts an automated chime and sends an instant alert to the receiving nurse's mobile workstation or Vocera badge.",
    input: "Arrival waypoint coordinates and receiving nurse staff directory profile",
    processing:
      "Geofence arrival trigger, multi-channel alert dispatch (Vocera / SMS / Nurse Station UI)",
    output: "Audible courtesy alert and notification: 'Medication Delivery Waiting at Station 3'",
    latency: "<800 ms",
    protocols: "VoIP / Vocera API / Hospital Wi-Fi Webhook",
  },
  {
    id: "authorized-unlock",
    stepNumber: 7,
    name: "Authorized Nurse Unlock",
    shortName: "Staff Verification",
    icon: KeyRound,
    description:
      "The receiving nurse taps their authorized hospital ID badge or enters their clinical PIN on the touchscreen. Only the specific compartment containing their order unlocks, keeping other tiers locked.",
    input: "Receiving nurse RFID card scan or 6-digit clinical security PIN",
    processing:
      "Credential authorization check against order manifest; single-compartment solenoid release",
    output: "Assigned locker opens; nurse retrieves medication; digital signature captured",
    latency: "<300 ms",
    protocols: "RFID Mifare / Active Directory SSO",
  },
  {
    id: "audit-return-recharge",
    stepNumber: 8,
    name: "Audit Logging & Depot Return",
    shortName: "Audit & Return",
    icon: BatteryCharging,
    description:
      "Complete chain-of-custody transfer log is uploaded to the hospital HIS/EHR. The robot automatically routes back to the pharmacy or docks into an inductive charging pad for continuous availability.",
    input: "Locker door closed sensor, remaining battery %, next queued mission in buffer",
    processing:
      "EHR delivery confirmation transmission, battery health check, return route calculation",
    output: "Order marked 'Delivered'; robot docked or en route to next clinical dispatch",
    latency: "Continuous",
    protocols: "HL7 Confirmation / Inductive Wireless Qi Charging",
  },
];

export function HospitalWorkflow() {
  const [activeStep, setActiveStep] = useState<number>(4); // Default to Corridor Transit

  const currentStage =
    WORKFLOW_STAGES.find((s) => s.stepNumber === activeStep) || WORKFLOW_STAGES[0];
  const CurrentIcon = currentStage.icon;

  return (
    <section className="relative bg-slate-950 text-white py-16 sm:py-24 px-4 lg:px-8 border-b border-slate-800 overflow-hidden">
      {/* Background accents */}
      <div className="pointer-events-none absolute top-10 left-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-[1440px]">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-4">
            <Activity size={13} className="text-cyan-400" />
            <span>End-to-End Clinical Transit Pipeline</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            How It Works: <br />
            <span className="text-cyan-400">8-Stage Medical Delivery Flow</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            From pharmacy order generation to bedside nurse verification, every transit leg
            executes with biometric security, elevator autonomy, and complete chain-of-custody
            auditability. Click any stage to inspect the technical data contracts.
          </p>
        </div>

        {/* 8-Stage Flowchart / Step Strip */}
        <div className="mb-10 overflow-x-auto pb-4 pt-2">
          <div className="flex items-center gap-2 min-w-[880px]">
            {WORKFLOW_STAGES.map((stage, idx) => {
              const Icon = stage.icon;
              const isActive = stage.stepNumber === activeStep;
              const isPast = stage.stepNumber < activeStep;

              return (
                <React.Fragment key={stage.id}>
                  <button
                    onClick={() => setActiveStep(stage.stepNumber)}
                    className={`group relative flex-1 min-w-[105px] rounded-xl p-3 border text-left transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "border-cyan-400 bg-slate-900 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400"
                        : isPast
                        ? "border-slate-800 bg-slate-900/60 hover:border-slate-700"
                        : "border-slate-800/80 bg-slate-950 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`font-mono text-[11px] font-bold ${
                          isActive
                            ? "text-cyan-400"
                            : isPast
                            ? "text-slate-400"
                            : "text-slate-600"
                        }`}
                      >
                        0{stage.stepNumber}
                      </span>
                      <Icon
                        size={16}
                        className={
                          isActive
                            ? "text-cyan-400"
                            : isPast
                            ? "text-slate-400"
                            : "text-slate-600"
                        }
                      />
                    </div>
                    <div
                      className={`text-xs font-bold leading-snug line-clamp-2 ${
                        isActive ? "text-white" : "text-slate-300"
                      }`}
                    >
                      {stage.shortName}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 mt-1">
                      {stage.latency}
                    </div>
                  </button>

                  {idx < WORKFLOW_STAGES.length - 1 && (
                    <ChevronRight
                      size={16}
                      className={`shrink-0 ${
                        idx < activeStep - 1 ? "text-cyan-400/60" : "text-slate-700"
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Detailed Stage Deep-Dive Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 lg:p-10 shadow-2xl backdrop-blur-md">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-3.5">
              <div className="size-14 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <CurrentIcon size={26} />
              </div>
              <div>
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                  Stage 0{currentStage.stepNumber} of 08 · Medical Workflow
                </div>
                <h3 className="text-2xl font-bold text-white mt-0.5">
                  {currentStage.name}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-[10px] font-mono uppercase text-slate-500">Latency</div>
                <div className="font-mono text-sm font-bold text-cyan-400">
                  {currentStage.latency}
                </div>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div className="text-right">
                <div className="text-[10px] font-mono uppercase text-slate-500">Compliance</div>
                <div className="font-mono text-xs font-bold text-emerald-400">HIPAA Aligned</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="mt-6 text-base text-slate-200 leading-relaxed max-w-4xl">
            {currentStage.description}
          </p>

          {/* Data Contract: Input / Processing / Output */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Input */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  Input Data Stream
                </span>
                <span className="size-2 rounded-full bg-blue-500" />
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-mono">
                {currentStage.input}
              </p>
            </div>

            {/* Processing */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  Processing Logic
                </span>
                <span className="size-2 rounded-full bg-cyan-400" />
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-mono">
                {currentStage.processing}
              </p>
            </div>

            {/* Output */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  Output Contract
                </span>
                <span className="size-2 rounded-full bg-emerald-500" />
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-mono">
                {currentStage.output}
              </p>
            </div>
          </div>

          {/* Underpinning Tech & Controls */}
          <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-slate-500">Clinical Protocols:</span>
              <span className="text-xs font-mono text-cyan-400">
                {currentStage.protocols}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={activeStep <= 1}
                onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-xs font-medium text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
              >
                Previous Stage
              </button>
              <button
                disabled={activeStep >= WORKFLOW_STAGES.length}
                onClick={() => setActiveStep((prev) => Math.min(WORKFLOW_STAGES.length, prev + 1))}
                className="px-3 py-1.5 rounded-lg bg-[#155EEF] text-xs font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#1047BF] transition-colors flex items-center gap-1"
              >
                <span>Next Stage</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
