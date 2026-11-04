import React, { useState } from "react";
import {
  Camera,
  Cpu,
  BrainCircuit,
  Filter,
  Sliders,
  Sparkles,
  Radio,
  Cloud,
  LayoutDashboard,
  Layers,
  ArrowDown,
  ChevronRight,
  Info,
} from "lucide-react";

interface ArchitectureLayer {
  id: string;
  level: number;
  name: string;
  layerCategory: string;
  icon: React.ElementType;
  description: string;
  technicalPurpose: string;
  input: string;
  output: string;
  relevantTechnologies: string[];
  specs: string;
}

const ARCHITECTURE_LAYERS: ArchitectureLayer[] = [
  {
    id: "camera-sensors",
    level: 1,
    name: "Camera and Sensors",
    layerCategory: "Sensing & Perception",
    icon: Camera,
    description:
      "Perception hardware array comprising stereoscopic RGB-D optical cameras, wide-angle mono cameras, 360° solid-state LiDAR, and ultrasonic ground proximity sensors.",
    technicalPurpose:
      "Acquires continuous spatial, geometric, and chromatic environmental data to facilitate mapping, navigation, and obstacle avoidance.",
    input: "Photonic reflections, ambient infrared illumination, ultrasonic pulse echoes",
    output: "Raw 4K RGB frames, depth point-clouds, LiDAR distance scans, proximity alerts",
    relevantTechnologies: ["Intel RealSense / Stereolabs ZED", "Livox Mid-360 LiDAR", "HC-SR04 Arrays", "MIPI-CSI2 / USB 3.0"],
    specs: "30-60 FPS · 0.2m–25m Sensing Range",
  },
  {
    id: "edge-computing",
    level: 2,
    name: "Edge Computing",
    layerCategory: "Processing Hardware",
    icon: Cpu,
    description:
      "Ruggedized, fanless onboard industrial computing hardware engineered to endure vibration, humidity, and wide ambient temperature fluctuations.",
    technicalPurpose:
      "Hosts the real-time Linux operating system, orchestrates inter-module bus communication, and runs embedded AI acceleration kernels with zero cloud dependency.",
    input: "High-bandwidth camera and sensor streams, power status telemetry, motor feedback",
    output: "Synchronized frame buffers, processed sensor packets, system status heartbeats",
    relevantTechnologies: ["NVIDIA Jetson Orin Industrial / AGX", "ARM Cortex-A78AE", "Ubuntu Core / RT-Linux", "CAN bus / GPIO"],
    specs: "Up to 275 TOPS Compute · IP67 Enclosure",
  },
  {
    id: "ai-inference-engine",
    level: 3,
    name: "AI Inference Engine",
    layerCategory: "Deep Learning Acceleration",
    icon: BrainCircuit,
    description:
      "Dedicated neural processing runtime optimized for low-latency concurrent execution of object detection and spatial localization models.",
    technicalPurpose:
      "Processes normalized image tensors in real time to locate potential waste targets, filter false positives (shadows, curbs), and predict 3D bounding coordinates.",
    input: "Synchronized RGB-D image tensors [1x3x640x640] at 30 Hz",
    output: "Object candidate proposals, bounding boxes [x, y, z, w, h, d], confidence scores",
    relevantTechnologies: ["TensorRT 10.x", "CUDA 12.x", "ONNX Runtime", "YOLOv8 Edge Optimization"],
    specs: "12-18 ms Latency · FP16 / INT8 Precision",
  },
  {
    id: "waste-classification",
    level: 4,
    name: "Waste Classification",
    layerCategory: "Material Intelligence",
    icon: Filter,
    description:
      "Specialized classification pipeline determining material taxonomy, surface finish, recyclability category, and hazard safety lockout status.",
    technicalPurpose:
      "Categorizes detected debris into discrete waste streams (Plastic, Paper, Can, Bio/Food, Hazardous) to guide segregated sorting mechanisms.",
    input: "Cropped bounding box visual patches, multi-spectral reflectance indicators",
    output: "Target class labels, material purity probability vectors, safety flags",
    relevantTechnologies: ["Deep ConvNet Classifier", "Spectral Sheen Analysis", "Bayesian Purity Filter", "Custom Waste Dataset"],
    specs: "24 Discrete Classes · 94.6% Accuracy",
  },
  {
    id: "robot-controller",
    level: 5,
    name: "Robot Controller",
    layerCategory: "Core Autonomy & Motion",
    icon: Sliders,
    description:
      "Real-time robotics coordination core managing mission planning, SLAM localization, path generation, and actuator trajectory interpolation.",
    technicalPurpose:
      "Coordinates mobile chassis movement and robotic arm kinematics while enforcing strict obstacle clearance and safety speed governors.",
    input: "Target coordinates, obstacle distance matrices, chassis odometry, battery status",
    output: "Differential drive velocity commands (cmd_vel), 6-DoF joint angles, safety interlocks",
    relevantTechnologies: ["ROS 2 Humble / Iron", "Nav2 Navigation Stack", "MoveIt 2 Motion Planning", "EtherCAT Master"],
    specs: "1 kHz Servo Control Loop · ISO 3691-4 Safety",
  },
  {
    id: "collection-mechanism",
    level: 6,
    name: "Collection Mechanism",
    layerCategory: "Physical Actuation",
    icon: Sparkles,
    description:
      "Electromechanical manipulation subsystem featuring compliant end-effectors, force-sensing servos, and pneumatic vacuum suction assistance.",
    technicalPurpose:
      "Physically approaches, grasps, elevates, and discharges detected waste into internal segregated containment chambers without jamming.",
    input: "Joint trajectory vectors, gripper torque setpoints, vacuum solenoid trigger commands",
    output: "Torque feedback readings, vacuum pressure sensors, item containment confirmation",
    relevantTechnologies: ["Brushless DC Servos", "Harmonic Drive Reducers", "Pneumatic Venturi Ejectors", "Soft Silicone Fingertips"],
    specs: "3.5 kg Pick Capacity · 2.5s Cycle Time",
  },
  {
    id: "iot-communication",
    level: 7,
    name: "IoT Communication",
    layerCategory: "Connectivity & Telemetry",
    icon: Radio,
    description:
      "Rugged dual-SIM 4G/5G cellular gateway and Wi-Fi 6 transceiver with encrypted multi-protocol edge-to-cloud telemetry transmission.",
    technicalPurpose:
      "Maintains continuous low-latency data pipelines between mobile robot fleets, local dispatch servers, and enterprise cloud dashboards.",
    input: "Robot operational logs, GPS breadcrumbs, bin fill percentages, fault alerts",
    output: "Secure TLS-encrypted telemetry packets, remote OTA firmware updates, dispatch pings",
    relevantTechnologies: ["MQTT over TLS 1.3", "WebSockets", "Dual SIM 5G / LTE Cat-M1", "Wi-Fi 6 (802.11ax)"],
    specs: "<200ms Latency · TLS 1.3 AES-256",
  },
  {
    id: "cloud-platform",
    level: 8,
    name: "Cloud Platform",
    layerCategory: "Backend Infrastructure",
    icon: Cloud,
    description:
      "High-availability cloud infrastructure orchestrating distributed fleet operations, historical time-series storage, and dynamic multi-agent task dispatch.",
    technicalPurpose:
      "Ingests, analyzes, and indexes telemetry from dozens of deployed robots to generate spatial waste heatmaps, predictive maintenance alerts, and compliance reports.",
    input: "High-frequency MQTT telemetry streams, system logs, collection audit trails",
    output: "Aggregated facility analytics, optimized route schedules, RESTful API endpoints",
    relevantTechnologies: ["PostgreSQL / TimescaleDB", "Node.js / Go Microservices", "Docker / Kubernetes", "Terraform Cloud"],
    specs: "99.9% Availability SLA · Real-time Stream Analytics",
  },
  {
    id: "monitoring-dashboard",
    level: 9,
    name: "Monitoring Dashboard",
    layerCategory: "User & Fleet Interface",
    icon: LayoutDashboard,
    description:
      "Modern web and tablet interface for facility managers, presenting live robot tracking, bin capacity alerts, historical trends, and remote manual intervention controls.",
    technicalPurpose:
      "Empowers operations teams with actionable visibility into daily waste volume, recycling efficiency, fleet battery levels, and ESG metrics.",
    input: "Real-time WebSocket telemetry pushes, REST API analytical payloads",
    output: "Visual site maps, live camera streams (optional/authenticated), PDF ESG reports, dispatch commands",
    relevantTechnologies: ["React / Vite", "Tailwind CSS", "Mapbox / Leaflet GL", "Chart.js / D3 Data Visualizations"],
    specs: "Sub-second UI latency · Multi-role RBAC",
  },
];

export function TechnicalArchitecture() {
  const [activeLayerId, setActiveLayerId] = useState<string>("ai-inference-engine");

  const activeLayer =
    ARCHITECTURE_LAYERS.find((l) => l.id === activeLayerId) || ARCHITECTURE_LAYERS[2];
  const ActiveIcon = activeLayer.icon;

  return (
    <section className="relative bg-slate-900 text-white py-16 sm:py-24 px-4 lg:px-8 border-b border-slate-800 overflow-hidden">
      {/* Background accents */}
      <div className="pointer-events-none absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#155EEF]/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-10 w-[400px] h-[400px] bg-[#16C7E8]/10 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-[1440px]">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#16C7E8]/30 bg-[#16C7E8]/10 px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider text-[#16C7E8] mb-4">
            <Layers size={13} className="text-[#16C7E8]" />
            <span>End-to-End System Stack</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            Technical Architecture: <br />
            <span className="text-[#16C7E8]">9-Layer Data &amp; Control Flow</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            A vertically integrated architecture spanning low-level sensory acquisition to
            enterprise cloud dashboards. Click any architectural layer to inspect its technical
            inputs, outputs, and embedded frameworks.
          </p>
        </div>

        {/* 2-Column Layout: Left Vertical Stack Diagram, Right Deep-Dive Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 9-Layer Vertical Stack */}
          <div className="lg:col-span-5 space-y-2">
            {ARCHITECTURE_LAYERS.map((layer, idx) => {
              const Icon = layer.icon;
              const isSelected = layer.id === activeLayerId;

              return (
                <div key={layer.id} className="relative">
                  <button
                    onClick={() => setActiveLayerId(layer.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 flex items-center gap-3.5 cursor-pointer ${
                      isSelected
                        ? "border-[#16C7E8] bg-slate-800 shadow-lg shadow-[#16C7E8]/10 ring-1 ring-[#16C7E8]"
                        : "border-slate-800 bg-slate-950/70 hover:border-slate-700 hover:bg-slate-900/60"
                    }`}
                  >
                    <div
                      className={`size-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? "bg-[#16C7E8] text-slate-950"
                          : "bg-slate-900 text-slate-400"
                      }`}
                    >
                      <Icon size={18} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                          LAYER 0{layer.level} · {layer.layerCategory}
                        </span>
                        {isSelected && (
                          <span className="size-2 rounded-full bg-[#16C7E8] shrink-0" />
                        )}
                      </div>
                      <div
                        className={`text-sm font-bold truncate mt-0.5 ${
                          isSelected ? "text-white" : "text-slate-300"
                        }`}
                      >
                        {layer.name}
                      </div>
                    </div>

                    <ChevronRight
                      size={16}
                      className={isSelected ? "text-[#16C7E8]" : "text-slate-600"}
                    />
                  </button>

                  {idx < ARCHITECTURE_LAYERS.length - 1 && (
                    <div className="flex justify-center my-0.5">
                      <div className="h-2 w-px bg-slate-800" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Layer Inspector Panel */}
          <div className="lg:col-span-7 bg-slate-950 rounded-2xl border border-slate-800 p-6 sm:p-8 lg:p-10 shadow-2xl sticky top-24">
            {/* Layer Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-3.5">
                <div className="size-14 rounded-xl bg-[#16C7E8]/10 border border-[#16C7E8]/30 flex items-center justify-center text-[#16C7E8]">
                  <ActiveIcon size={26} />
                </div>
                <div>
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#16C7E8]">
                    Layer 0{activeLayer.level} // {activeLayer.layerCategory}
                  </div>
                  <h3 className="text-2xl font-bold text-white mt-0.5">
                    {activeLayer.name}
                  </h3>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-mono text-slate-300">
                {activeLayer.specs}
              </span>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
                System Overview
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                {activeLayer.description}
              </p>
            </div>

            {/* Technical Purpose */}
            <div className="mt-5 rounded-xl bg-slate-900/90 border border-slate-800 p-4">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#16C7E8] mb-1.5 flex items-center gap-1.5">
                <Info size={13} />
                <span>Technical Purpose &amp; Critical Role</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeLayer.technicalPurpose}
              </p>
            </div>

            {/* Data In / Data Out */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Input Data Streams
                </span>
                <p className="text-xs text-slate-300 font-mono leading-relaxed">
                  {activeLayer.input}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#16C7E8] block mb-1.5">
                  Output Data Streams
                </span>
                <p className="text-xs text-slate-300 font-mono leading-relaxed">
                  {activeLayer.output}
                </p>
              </div>
            </div>

            {/* Relevant Technologies Pill Grid */}
            <div className="mt-6 pt-6 border-t border-slate-800">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-3">
                Proposed &amp; Validated Technologies
              </h4>
              <div className="flex flex-wrap gap-2">
                {activeLayer.relevantTechnologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-mono text-slate-300"
                  >
                    <span className="size-1.5 rounded-full bg-[#16C7E8]" />
                    <span>{tech}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
