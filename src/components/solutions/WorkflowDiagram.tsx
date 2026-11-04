import React, { useState } from "react";
import {
  Camera,
  Layers,
  Search,
  CheckSquare,
  Bot,
  Sparkles,
  Archive,
  BarChart2,
  ArrowRight,
  ChevronRight,
  Activity,
  Zap,
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
  technologies: string;
}

const WORKFLOW_STAGES: WorkflowStage[] = [
  {
    id: "camera-sensors",
    stepNumber: 1,
    name: "Camera and Sensors",
    shortName: "Perception",
    icon: Camera,
    description:
      "Dual stereo RGB-D optical sensors, combined with 360° LiDAR and ultrasound ground scanners, scan the operating environment continuously for ground debris and bin markers.",
    input: "Ambient optical photons, infrared time-of-flight returns, ultrasonic pulse reflections",
    processing:
      "Hardware-level frame synchronization, auto-exposure adjustment, and point cloud registration",
    output: "Synchronized 60 FPS 4K RGB video streams and dense 3D spatial depth maps",
    latency: "<5 ms",
    technologies: "Stereo Depth Camera, Time-of-Flight (ToF), Micro-LiDAR, Hardware Triggering",
  },
  {
    id: "image-acquisition",
    stepNumber: 2,
    name: "Image Acquisition",
    shortName: "Acquisition",
    icon: Layers,
    description:
      "Raw sensor streams are ingested through low-latency DMA channels, debayered, lens-distortion corrected, and normalized for neural network ingestion.",
    input: "Raw Bayer pixel matrices and asynchronous depth buffers from USB3/MIPI-CSI bus",
    processing:
      "Contrast enhancement, bilinear interpolation, lens undistortion, and tensor conversion",
    output: "Preprocessed normalized tensor batches [1 x 3 x 640 x 640] at 30 Hz",
    latency: "6–8 ms",
    technologies: "OpenCV, CUDA Tensor Core pre-processing, V4L2 kernel driver",
  },
  {
    id: "ai-waste-detection",
    stepNumber: 3,
    name: "AI Waste Detection",
    shortName: "Detection",
    icon: Search,
    description:
      "Deep convolutional neural network scans ground frames to pinpoint garbage items, distinguish trash from pedestrians or floor fixtures, and predict 2D/3D bounding boxes.",
    input: "Normalized RGB-D image tensors and previous frame motion vectors",
    processing:
      "Single-shot multi-box detection (YOLOv8 / TensorRT), non-maximum suppression (NMS), bounding box regression",
    output: "Bounding coordinates [x, y, w, h, depth] for every detected object with confidence scores >0.85",
    latency: "12–15 ms",
    technologies: "YOLOv8, TensorRT 10.x, PyTorch export, ONNX Runtime",
  },
  {
    id: "waste-classification",
    stepNumber: 4,
    name: "Waste Classification",
    shortName: "Classification",
    icon: CheckSquare,
    description:
      "Sub-region visual classifiers analyze surface gloss, texture, geometry, and reflectivity to classify recognized objects into discrete waste streams.",
    input: "Cropped bounding box image patches and multi-spectral reflection coefficients",
    processing:
      "ResNet/EfficientNet feature extraction, softmax category distribution across 24 material classes",
    output: "Material category classification label (PET Plastic, Can, Paperboard, Organic, Hazard)",
    latency: "8–10 ms",
    technologies: "Custom ResNet Classifier, Multi-spectral analysis, Bayesian Confidence Thresholding",
  },
  {
    id: "collection-decision",
    stepNumber: 5,
    name: "Collection Decision",
    shortName: "Decision Logic",
    icon: Bot,
    description:
      "Robotic decision engine evaluates object safety, weight feasibility, internal compartment space, and local obstacle safety before issuing pick commands.",
    input: "Material class, 3D target coordinates, robot velocity, current hopper fill-levels",
    processing:
      "Safety rule verification, pick priority scoring, trajectory feasibility kinematics check",
    output: "Deterministic go/no-go command, optimal approach vector, and assigned storage bin ID",
    latency: "4–6 ms",
    technologies: "Behavior Trees, Rule-based safety interlock, ROS2 Action Server",
  },
  {
    id: "robotic-collection-mechanism",
    stepNumber: 6,
    name: "Robotic Collection Mechanism",
    shortName: "Actuation",
    icon: Sparkles,
    description:
      "Articulated manipulator or adaptive suction intake aligns with the target coordinate, executing a torque-monitored grip and lifting the waste safely.",
    input: "Calculated inverse kinematics joint trajectories and gripper pressure setpoints",
    processing:
      "Closed-loop PID servo control, slip detection, force-feedback torque monitoring",
    output: "Target item securely retrieved and lifted into internal hopper intake chute",
    latency: "1.8–2.5 s",
    technologies: "EtherCAT Servo Drives, Soft Silicone Gripper, Vacuum Venturi Suction, MoveIt 2",
  },
  {
    id: "smart-waste-storage",
    stepNumber: 7,
    name: "Smart Waste Storage",
    shortName: "Storage",
    icon: Archive,
    description:
      "Chute gates route the collected item into the designated segregated chamber. Active compaction operates if volume thresholds dictate, sealing odor.",
    input: "Collected physical item and destination chamber selector trigger",
    processing:
      "Diverter flap routing, automated mechanical compaction, ultrasonic fill-level re-check",
    output: "Item stored in segregated bin; chamber fill level telemetry logged",
    latency: "0.8 s",
    technologies: "Ultrasonic level transducers, Linear electric actuator compaction, Odor seal damper",
  },
  {
    id: "dashboard-monitoring",
    stepNumber: 8,
    name: "Dashboard Monitoring",
    shortName: "Telemetry",
    icon: BarChart2,
    description:
      "Event log, GPS coordinate, item category, and updated hopper fill level are encrypted and streamed over cellular/Wi-Fi to the central fleet operations cloud.",
    input: "Collection event payload (timestamp, coordinates, waste class, mass estimate, battery)",
    processing:
      "JSON payload packaging, TLS encryption, cloud time-series ingestion, and UI state push",
    output: "Real-time dashboard KPI update, route heatmap refresh, automated maintenance audit log",
    latency: "<200 ms",
    technologies: "MQTT over TLS, WebSockets, TimescaleDB, Fleet Management REST APIs",
  },
];

export function WorkflowDiagram() {
  const [activeStep, setActiveStep] = useState<number>(3); // Default to AI Waste Detection

  const currentStage =
    WORKFLOW_STAGES.find((s) => s.stepNumber === activeStep) || WORKFLOW_STAGES[0];
  const CurrentIcon = currentStage.icon;

  return (
    <section className="relative bg-slate-950 text-white py-16 sm:py-24 px-4 lg:px-8 border-b border-slate-800 overflow-hidden">
      {/* Background accents */}
      <div className="pointer-events-none absolute top-10 left-10 w-96 h-96 bg-[#16C7E8]/5 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-10 w-96 h-96 bg-[#155EEF]/10 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-[1440px]">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#16C7E8]/30 bg-[#16C7E8]/10 px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider text-[#16C7E8] mb-4">
            <Activity size={13} className="text-[#16C7E8]" />
            <span>Real-Time Execution Pipeline</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            How It Works: <br />
            <span className="text-[#16C7E8]">8-Stage Autonomous Pipeline</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            From the initial optical photon striking the stereo sensor to real-time cloud dispatch,
            every waste interaction executes deterministically in sub-second cycles.
            Click any stage below to inspect the full data contract.
          </p>
        </div>

        {/* Interactive 8-Stage Flowchart / Step Strip */}
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
                        ? "border-[#16C7E8] bg-slate-900 shadow-lg shadow-[#16C7E8]/10 ring-1 ring-[#16C7E8]"
                        : isPast
                        ? "border-slate-800 bg-slate-900/60 hover:border-slate-700"
                        : "border-slate-800/80 bg-slate-950 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`font-mono text-[11px] font-bold ${
                          isActive
                            ? "text-[#16C7E8]"
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
                            ? "text-[#16C7E8]"
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
                        idx < activeStep - 1 ? "text-[#16C7E8]/60" : "text-slate-700"
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
              <div className="size-14 rounded-xl bg-[#16C7E8]/10 border border-[#16C7E8]/30 flex items-center justify-center text-[#16C7E8]">
                <CurrentIcon size={26} />
              </div>
              <div>
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#16C7E8]">
                  Stage 0{currentStage.stepNumber} of 08 · Pipeline Execution
                </div>
                <h3 className="text-2xl font-bold text-white mt-0.5">
                  {currentStage.name}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-[10px] font-mono uppercase text-slate-500">Latency</div>
                <div className="font-mono text-sm font-bold text-[#16C7E8]">
                  {currentStage.latency}
                </div>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div className="text-right">
                <div className="text-[10px] font-mono uppercase text-slate-500">Execution</div>
                <div className="font-mono text-xs font-bold text-emerald-400">Deterministic</div>
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
                  Input Stream
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
                <span className="size-2 rounded-full bg-[#16C7E8]" />
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

          {/* Underpinning Tech */}
          <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-slate-500">Frameworks / Spec:</span>
              <span className="text-xs font-mono text-[#16C7E8]">
                {currentStage.technologies}
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
