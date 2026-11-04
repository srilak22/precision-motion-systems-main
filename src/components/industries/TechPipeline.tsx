import React, { useState } from "react";
import {
  Camera,
  Eye,
  Cpu,
  Workflow,
  Wrench,
  ArrowRight,
  CheckCircle2,
  Radio,
  Zap,
  Activity,
  Layers,
} from "lucide-react";

interface PipelineStep {
  id: string;
  stepNumber: string;
  name: string;
  subtitle: string;
  icon: React.ElementType<{ size?: number; className?: string }>;
  protocols: string[];
  latency: string;
  description: string;
  specs: string[];
}

const PIPELINE_STEPS: PipelineStep[] = [
  {
    id: "sensors",
    stepNumber: "01",
    name: "Camera & Sensor Array",
    subtitle: "High-Cadence Environmental Acquisition",
    icon: Camera,
    protocols: ["GigE Vision", "USB3 Vision", "GenICam", "IO-Link"],
    latency: "< 1.2 ms",
    description:
      "Captures high-resolution 3D point clouds, stereoscopic RGB-D imagery, and multi-axis force/torque sensor telemetry directly at the tool center point.",
    specs: ["Up to 120 FPS at 4K resolution", "Sub-pixel spatial accuracy", "Laser triangulation depth map"],
  },
  {
    id: "edge-vision",
    stepNumber: "02",
    name: "Edge Vision Engine",
    subtitle: "YOLO / OpenCV Defect Detection",
    icon: Eye,
    protocols: ["TensorRT C++", "ONNX Runtime", "RTSP / WebRTC", "CUDA"],
    latency: "< 3.5 ms",
    description:
      "Hardware-accelerated edge inference classifying micro-scratches, pin pitch deviations, missing components, and barcode serialization.",
    specs: ["99.98% classification confidence", "Bounding-box segmentation", "Zero cloud round-trip latency"],
  },
  {
    id: "ai-decision",
    stepNumber: "03",
    name: "INDUS AI Decision Unit",
    subtitle: "Cognitive Kinematic Arbitration",
    icon: Cpu,
    protocols: ["OPC-UA", "MQTT Sparkplug B", "JSON-RPC", "ZeroMQ"],
    latency: "< 1.8 ms",
    description:
      "Determines dynamic pick vectors, part orientation compensation, and process parameter adjustments to prevent upstream line starvation.",
    specs: ["Dynamic collision avoidance", "Real-time trajectory smoothing", "Adaptive weld seam tracking"],
  },
  {
    id: "motion-planner",
    stepNumber: "04",
    name: "ROS2 Motion Planner",
    subtitle: "Deterministic Trajectory Generation",
    icon: Workflow,
    protocols: ["ROS2 Humble/Jazzy", "DDS (Data Distribution)", "MoveIt2", "Nav2"],
    latency: "< 0.8 ms",
    description:
      "Calculates inverse kinematics, singularity-free jerk-limited acceleration profiles, and multi-robot intersection reservations.",
    specs: ["6-DOF & 7-DOF kinematics solver", "VDA 5050 AMR coordination", "Hard real-time Linux PREEMPT_RT"],
  },
  {
    id: "execution",
    stepNumber: "05",
    name: "7th-Axis & Manipulator",
    subtitle: "Mechatronic Hardware Execution",
    icon: Wrench,
    protocols: ["EtherCAT CoE", "PROFINET IRT", "EtherNet/IP", "CANopen"],
    latency: "< 250 µs",
    description:
      "Synchronized closed-loop execution across planetary reducers, servo drives, pneumatic vacuum grippers, and high-speed linear guide tracks.",
    specs: ["±0.02 mm repeatable positioning", "3.2G peak linear acceleration", "SIL 3 / PL e certified e-stop"],
  },
];

export function TechPipeline() {
  const [activeStepId, setActiveStepId] = useState<string>("ai-decision");
  const activeStep = PIPELINE_STEPS.find((s) => s.id === activeStepId) || PIPELINE_STEPS[2];

  return (
    <section id="industry-architecture" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-200/80">
      <div className="max-w-3xl mb-12">
        <div className="text-xs font-mono font-bold tracking-wider text-[#155EEF] uppercase mb-2">
          // END-TO-END DATA PIPELINE
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Technical System Architecture
        </h2>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
          From photon acquisition at the camera array to deterministic torque modulation at the servo axis, our verified
          five-stage data pipeline operates with sub-5 millisecond end-to-end loop latency.
        </p>
      </div>

      {/* Horizontal Interactive Pipeline Flow Strip */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs mb-8">
        <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-6 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Activity size={14} className="text-[#155EEF]" />
            DATA TRANSMISSION PIPELINE • SELECT A STAGE TO INSPECT
          </span>
          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            TOTAL LATENCY &lt; 5 MS
          </span>
        </div>

        {/* 5-Step Flow Line */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 relative">
          {PIPELINE_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isSelected = activeStepId === step.id;
            return (
              <div key={step.id} className="relative flex flex-col">
                <button
                  type="button"
                  onClick={() => setActiveStepId(step.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between h-full ${
                    isSelected
                      ? "bg-blue-50/80 border-[#155EEF] shadow-sm ring-1 ring-[#155EEF]/30"
                      : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                          isSelected
                            ? "bg-[#155EEF] text-white border-[#155EEF]"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        {step.stepNumber}
                      </span>
                      <Icon size={18} className={isSelected ? "text-[#155EEF]" : "text-slate-400"} />
                    </div>

                    <div className="font-bold text-sm text-slate-900 mb-1 leading-snug">{step.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{step.subtitle}</div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">LATENCY:</span>
                    <span className="text-[#155EEF] font-bold">{step.latency}</span>
                  </div>
                </button>

                {/* Arrow connector between stages for large screens */}
                {idx < PIPELINE_STEPS.length - 1 && (
                  <div className="hidden lg:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-300 pointer-events-none">
                    <ArrowRight size={14} className="text-slate-400" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Step Technical Detail Drawer */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-50/50 via-white to-blue-50/30 border border-blue-200 p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-mono text-[#155EEF] font-bold mb-3">
              <span>STAGE {activeStep.stepNumber} DEEP DIVE:</span>
              <span className="text-slate-900 uppercase">{activeStep.name}</span>
            </div>

            <h3 className="text-2xl font-extrabold text-slate-900 mb-2">{activeStep.subtitle}</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-6 font-normal">{activeStep.description}</p>

            {/* Specifications list */}
            <div className="space-y-2 mb-6">
              {activeStep.specs.map((spec, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                  <CheckCircle2 size={14} className="text-[#155EEF] shrink-0" />
                  <span>{spec}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 bg-white rounded-xl p-6 border border-slate-200 shadow-2xs">
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-3">
              Supported Industrial Protocols:
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {activeStep.protocols.map((proto, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-xs font-mono font-bold text-[#155EEF]"
                >
                  {proto}
                </span>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500">DETERMINISTIC LATENCY</span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {activeStep.latency}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
