import React, { useState } from "react";
import {
  Camera,
  Cpu,
  Layers,
  Sparkles,
  Archive,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface ComponentDetail {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  tag: string;
  description: string;
  subComponents: string[];
  keySpecs: { label: string; value: string }[];
  workingMechanism: string;
}

const SYSTEM_COMPONENTS: ComponentDetail[] = [
  {
    id: "vision-system",
    number: "01",
    title: "High-Resolution Vision System",
    subtitle: "Real-Time Spatial Perception & Object Tracking",
    icon: Camera,
    tag: "Perception Layer",
    description:
      "Dual industrial RGB-D depth cameras paired with wide-angle panoramic sensors capture dynamic ground environments, detecting litter, receptacles, and obstacles across varying illumination levels.",
    subComponents: [
      "Stereo depth perception (0.2m – 10m detection range)",
      "HDR active infrared illumination for night-time operation",
      "Lens air-curtain & automated dust-clearing wiper",
    ],
    keySpecs: [
      { label: "Frame Rate", value: "60 FPS" },
      { label: "Field of View", value: "120° H / 80° V" },
      { label: "Resolution", value: "4K RGB + 1080p Depth" },
    ],
    workingMechanism:
      "Continuously streams calibrated point-clouds and RGB frames to the edge inference unit for instant surface and object segmentation.",
  },
  {
    id: "ai-processing",
    number: "02",
    title: "AI Edge Processing Unit",
    subtitle: "Low-Latency Autonomous Compute",
    icon: Cpu,
    tag: "Edge Compute",
    description:
      "Industrial-grade edge computing module with dedicated tensor acceleration executes deep learning models directly on the robot without relying on cloud connectivity.",
    subComponents: [
      "Dedicated NPU / GPU accelerator (>40 TOPS)",
      "Fanless aluminum conduction heatsink chassis (IP67)",
      "Dual CAN bus & real-time ROS2 micro-controller link",
    ],
    keySpecs: [
      { label: "Inference Latency", value: "<18 ms" },
      { label: "Compute Capacity", value: "40+ TOPS" },
      { label: "Operating Temp", value: "-20°C to +65°C" },
    ],
    workingMechanism:
      "Performs real-time YOLOv8 object localization, bounding box calculation, and 6-DoF grasp pose prediction locally at 30+ decisions per second.",
  },
  {
    id: "classification-engine",
    number: "03",
    title: "Waste Classification Engine",
    subtitle: "Multi-Category Material Taxonomy",
    icon: Layers,
    tag: "Intelligence",
    description:
      "Trained on over 500,000 localized industrial and municipal waste items, the engine instantly sorts recognized targets into distinct recyclability classes.",
    subComponents: [
      "Multi-label classification (Plastic, Paper, Metal, Glass, Organic, E-Waste)",
      "Material surface sheen & texture decomposition",
      "Hazardous & sharp object lockout flags",
    ],
    keySpecs: [
      { label: "Accuracy", value: ">94.6% Top-1" },
      { label: "Classes Detected", value: "24 Waste Types" },
      { label: "Model Architecture", value: "Optimized YOLOv8 + ResNet" },
    ],
    workingMechanism:
      "Assigns confidence scores and material labels, determining whether to trigger immediate robotic collection or flag hazardous items for human review.",
  },
  {
    id: "collection-mechanism",
    number: "04",
    title: "Robotic Collection Mechanism",
    subtitle: "Adaptive Force-Feedback Manipulation",
    icon: Sparkles,
    tag: "Actuation Layer",
    description:
      "Multi-axis articulated arm combined with an adaptive high-torque roller intake and pneumatic suction effector captures varied geometries without jams.",
    subComponents: [
      "Torque-limited servomotors with active collision sensing",
      "Dual soft-silicone grip fingers & vacuum suction assist",
      "Reversible anti-jam clearing cycle",
    ],
    keySpecs: [
      { label: "Payload / Pick", value: "Up to 3.5 kg" },
      { label: "Cycle Time", value: "2.8 sec / pick" },
      { label: "Reach Radius", value: "750 mm envelope" },
    ],
    workingMechanism:
      "Executes calculated grasp trajectories, retrieves target objects smoothly, and transfers items into the designated internal storage hopper.",
  },
  {
    id: "smart-storage",
    number: "05",
    title: "Smart Waste Storage Hoppers",
    subtitle: "Segregated Compartments & Fill Telemetry",
    icon: Archive,
    tag: "Payload Storage",
    description:
      "Internal multi-chamber modular storage units keep segregated waste streams separated with automated compaction and ultrasonic volume measurement.",
    subComponents: [
      "Dual or triple segregated chambers (Dry Recyclables / Wet / Residual)",
      "Ultrasonic & ToF array fill-level monitoring",
      "Odor-seal gasket with optional HEPA / carbon active filter",
    ],
    keySpecs: [
      { label: "Total Capacity", value: "120 Liters" },
      { label: "Compaction Ratio", value: "2:1 Volumetric" },
      { label: "Fill Accuracy", value: "±2% volumetric" },
    ],
    workingMechanism:
      "Monitors volume in real time; triggers automated notifications and autonomous transit to the central discharge bay when capacity hits 90%.",
  },
  {
    id: "monitoring-dashboard",
    number: "06",
    title: "Fleet Monitoring & Analytics Hub",
    subtitle: "Centralized Telematics & Route Dispatch",
    icon: BarChart3,
    tag: "Cloud & Fleet",
    description:
      "Cloud-native management console delivering continuous GPS fleet tracking, real-time hopper fill heatmaps, maintenance telemetry, and ESG reporting.",
    subComponents: [
      "Interactive digital-twin site map with live robot locations",
      "Dynamic route rescheduling based on real-time bin alerts",
      "Automated PDF compliance & carbon savings reports",
    ],
    keySpecs: [
      { label: "Telemetry Latency", value: "<500 ms" },
      { label: "Protocol", value: "MQTT over TLS / WebSocket" },
      { label: "Uptime SLA", value: "99.9% Cloud Availability" },
    ],
    workingMechanism:
      "Aggregates metrics from deployed robots, generates daily operational insights, and automatically balances collection routes across peak facility hours.",
  },
];

export function SolutionOverview() {
  const [activeComponentId, setActiveComponentId] = useState<string>("vision-system");

  const activeComponent =
    SYSTEM_COMPONENTS.find((c) => c.id === activeComponentId) || SYSTEM_COMPONENTS[0];
  const ActiveIcon = activeComponent.icon;

  return (
    <section className="relative bg-white text-slate-900 py-16 sm:py-24 px-4 lg:px-8 border-b border-slate-200">
      <div className="relative mx-auto max-w-[1440px]">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider text-[#155EEF] mb-4">
            <Zap size={13} className="text-[#155EEF]" />
            <span>Integrated Robotics Architecture</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-slate-900 leading-tight">
            How The System <br />
            <span className="text-[#155EEF]">Functions as a Cohesive Unit</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            The INDUS Smart Waste Collection Robot integrates sensing, real-time edge intelligence,
            adaptive mechanics, and cloud telematics into a closed-loop autonomous system designed
            for demanding municipal and commercial environments.
          </p>
        </div>

        {/* 6 Components Interactive Selector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Component Cards List */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            {SYSTEM_COMPONENTS.map((comp) => {
              const Icon = comp.icon;
              const isSelected = comp.id === activeComponentId;

              return (
                <button
                  key={comp.id}
                  onClick={() => setActiveComponentId(comp.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-start gap-3.5 ${
                    isSelected
                      ? "border-[#155EEF] bg-blue-50/70 shadow-sm ring-1 ring-[#155EEF]"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70"
                  }`}
                >
                  <div
                    className={`size-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? "bg-[#155EEF] text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <Icon size={20} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                        {comp.number} · {comp.tag}
                      </span>
                      {isSelected && (
                        <span className="size-2 rounded-full bg-[#155EEF] shrink-0" />
                      )}
                    </div>
                    <div className="text-sm font-bold text-slate-900 truncate">
                      {comp.title}
                    </div>
                    <div className="text-xs text-slate-500 truncate mt-0.5">
                      {comp.subtitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Deep-Dive Component Inspector */}
          <div className="lg:col-span-7 bg-slate-900 rounded-2xl border border-slate-800 text-white p-6 sm:p-8 lg:p-10 shadow-xl">
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-[#16C7E8]">
                  <ActiveIcon size={24} />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#16C7E8]">
                    Component {activeComponent.number} // {activeComponent.tag}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    {activeComponent.title}
                  </h3>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-mono text-emerald-400">
                <CheckCircle2 size={13} />
                <span>Verified Spec</span>
              </span>
            </div>

            {/* Description */}
            <p className="mt-6 text-sm sm:text-base text-slate-300 leading-relaxed">
              {activeComponent.description}
            </p>

            {/* Sub-Components Checklist */}
            <div className="mt-6">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-3">
                Core Engineering Modules
              </h4>
              <div className="space-y-2">
                {activeComponent.subComponents.map((sub, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80"
                  >
                    <CheckCircle2 size={16} className="text-[#16C7E8] shrink-0 mt-0.5" />
                    <span>{sub}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Specs Matrix */}
            <div className="mt-6 pt-6 border-t border-slate-800">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-3">
                Operational Specifications
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {activeComponent.keySpecs.map((spec, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg bg-slate-950 p-3 border border-slate-800/80 text-center"
                  >
                    <div className="text-[11px] font-mono text-slate-400 uppercase">
                      {spec.label}
                    </div>
                    <div className="text-sm sm:text-base font-bold font-mono text-[#16C7E8] mt-1">
                      {spec.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* How it collaborates */}
            <div className="mt-6 rounded-xl bg-gradient-to-r from-blue-950/40 via-slate-950/60 to-blue-950/40 p-4 border border-blue-900/40">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#16C7E8] mb-1">
                Collaborative Mechanism in Sequence
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeComponent.workingMechanism}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
