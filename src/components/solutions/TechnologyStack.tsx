import React from "react";
import {
  Cpu,
  BrainCircuit,
  Compass,
  Cloud,
  CheckCircle2,
  AlertCircle,
  Layers,
} from "lucide-react";

interface TechGroup {
  id: string;
  category: string;
  badge: string;
  icon: React.ElementType;
  description: string;
  items: {
    name: string;
    role: string;
    status: "Proposed" | "Compatible" | "Standard";
  }[];
}

const TECH_GROUPS: TechGroup[] = [
  {
    id: "hardware",
    category: "Hardware & Sensory",
    badge: "Edge Robotics",
    icon: Cpu,
    description:
      "Physical sensory, compute, and electromechanical components providing real-time spatial awareness and robotic manipulation.",
    items: [
      {
        name: "RGB-D Optical Camera",
        role: "Dual high-resolution stereo visual & depth perception array",
        status: "Proposed",
      },
      {
        name: "Proximity & IR Sensors",
        role: "Ground clearance, stair-drop protection, and close-range docking",
        status: "Standard",
      },
      {
        name: "Ultrasonic Transducers",
        role: "Continuous internal waste hopper volumetric fill-level telemetry",
        status: "Standard",
      },
      {
        name: "Embedded Controller",
        role: "Ruggedized multi-core industrial Linux edge compute unit (Jetson/x86)",
        status: "Proposed",
      },
      {
        name: "Closed-Loop Motor Drivers",
        role: "High-efficiency brushless DC drives with regenerative braking",
        status: "Compatible",
      },
      {
        name: "Robotic Collection Mechanism",
        role: "Articulated compliant arm with dual silicone grip and vacuum suction",
        status: "Proposed",
      },
    ],
  },
  {
    id: "ai-vision",
    category: "AI & Computer Vision",
    badge: "Inference Stack",
    icon: BrainCircuit,
    description:
      "Embedded neural networks and real-time computer vision algorithms for item detection, material segmentation, and grasp pose planning.",
    items: [
      {
        name: "YOLOv8 Object Detection",
        role: "Sub-20ms bounding box proposal and multi-target tracking",
        status: "Proposed",
      },
      {
        name: "OpenCV Acceleration",
        role: "Color calibration, spatial filtering, and frame pre-processing",
        status: "Standard",
      },
      {
        name: "Material Classification Engine",
        role: "Multi-class CNN segmenting recyclables, organics, and hazardous waste",
        status: "Proposed",
      },
      {
        name: "Edge AI Runtime (TensorRT / ONNX)",
        role: "Low-power quantized (FP16/INT8) onboard neural network inference",
        status: "Compatible",
      },
    ],
  },
  {
    id: "robotics",
    category: "Robotics & Motion Control",
    badge: "Autonomy Core",
    icon: Compass,
    description:
      "Deterministic robotics operating middleware, SLAM localization, path planners, and safety-critical speed governors.",
    items: [
      {
        name: "ROS / ROS 2",
        role: "Modular inter-process communications and DDS message broker",
        status: "Standard",
      },
      {
        name: "Nav2 Navigation Stack",
        role: "Dynamic costmap generation, obstacle clearing, and global pathfinding",
        status: "Proposed",
      },
      {
        name: "Motion & Trajectory Control",
        role: "Kinematic velocity profiles, ramp smoothing, and torque limiting",
        status: "Compatible",
      },
      {
        name: "360° Obstacle Avoidance",
        role: "LiDAR and ultrasound real-time pedestrian safety zones",
        status: "Standard",
      },
    ],
  },
  {
    id: "cloud-data",
    category: "Cloud, IoT & Analytics",
    badge: "Fleet Cloud",
    icon: Cloud,
    description:
      "Scalable telemetry infrastructure, time-series data storage, web fleet dashboards, and enterprise facility integrations.",
    items: [
      {
        name: "MQTT over TLS",
        role: "Lightweight, secure publish-subscribe telemetry streaming",
        status: "Standard",
      },
      {
        name: "PostgreSQL / MongoDB / Timescale",
        role: "Hybrid relational and time-series logging of collection events",
        status: "Compatible",
      },
      {
        name: "Web Telemetry Dashboard",
        role: "Role-based operator portal with live maps, alerts, and PDF audits",
        status: "Standard",
      },
      {
        name: "IoT Fleet Monitoring",
        role: "Predictive battery health, OTA firmware rollouts, and dispatching",
        status: "Proposed",
      },
    ],
  },
];

export function TechnologyStack() {
  return (
    <section className="relative bg-white text-slate-900 py-16 sm:py-24 px-4 lg:px-8 border-b border-slate-200">
      <div className="relative mx-auto max-w-[1440px]">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider text-[#155EEF] mb-4">
            <Layers size={13} className="text-[#155EEF]" />
            <span>Underlying Engineering Matrix</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-slate-900 leading-tight">
            Proposed &amp; Compatible <br />
            <span className="text-[#155EEF]">Technology Architecture</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            The INDUS platform leverages proven open-standard robotics frameworks, industrial
            compute hardware, and hardened IoT telemetry. Specifications are tailored to meet
            specific facility operational requirements.
          </p>

          <div className="mt-4 flex items-center gap-2 text-xs font-mono text-slate-500 bg-slate-50 border border-slate-200 p-2.5 rounded-lg">
            <AlertCircle size={14} className="text-[#155EEF] shrink-0" />
            <span>
              <strong>Note:</strong> Listed architectures represent proposed and compatible
              engineering baselines. Final hardware components and cloud integrations are finalized
              during project scoping and site survey.
            </span>
          </div>
        </div>

        {/* 4 Groups Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {TECH_GROUPS.map((group) => {
            const Icon = group.icon;

            return (
              <div
                key={group.id}
                className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 sm:p-8 flex flex-col justify-between"
              >
                <div>
                  {/* Category Header */}
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="size-11 rounded-lg bg-[#155EEF]/10 border border-[#155EEF]/20 flex items-center justify-center text-[#155EEF]">
                        <Icon size={22} />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#155EEF]">
                          {group.badge}
                        </span>
                        <h3 className="text-xl font-bold text-slate-900">
                          {group.category}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 mb-6">
                    {group.description}
                  </p>

                  {/* Items List */}
                  <div className="space-y-3">
                    {group.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-slate-300 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <span className="text-sm font-bold text-slate-900 font-mono">
                            {item.name}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider shrink-0 ${
                              item.status === "Standard"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : item.status === "Proposed"
                                ? "bg-blue-50 text-[#155EEF] border border-blue-200"
                                : "bg-purple-50 text-purple-700 border border-purple-200"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-snug">
                          {item.role}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
