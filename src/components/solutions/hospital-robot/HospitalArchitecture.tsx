import React, { useState } from "react";
import {
  Compass,
  Cpu,
  Navigation,
  Lock,
  KeyRound,
  Building,
  Radio,
  Cloud,
  LayoutDashboard,
  Layers,
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
    id: "hospital-sensing",
    level: 1,
    name: "Perception & Safety LiDAR",
    layerCategory: "Sensing Layer",
    icon: Compass,
    description:
      "Perception hardware suite comprising dual safety-certified planar LiDARs, 3D time-of-flight depth cameras, and ultrasonic foot-level drop sensors.",
    technicalPurpose:
      "Detects static and dynamic obstacles in crowded hospital corridors, identifying wheelchairs, IV poles, low gurney wheels, and passing clinical staff.",
    input: "Laser time-of-flight reflections, 3D infrared depth buffers, wheel encoder ticks",
    output: "Calibrated 360° 2D/3D point clouds and real-time odometry matrices",
    relevantTechnologies: ["Dual SICK / Hokuyo Safety LiDAR", "Intel RealSense Depth Camera", "ISO 13849-1 PLd Circuit"],
    specs: "360° Scan · 25 Hz · 0.05m–25m Range",
  },
  {
    id: "edge-compute",
    level: 2,
    name: "Medical Edge Compute Core",
    layerCategory: "Compute Hardware",
    icon: Cpu,
    description:
      "Fanless, sealed industrial embedded computing unit running real-time Linux with hardware-accelerated sensor processing and zero acoustic fan noise.",
    technicalPurpose:
      "Executes real-time SLAM localization, path planners, and motor PID control loops locally without reliance on cloud network availability.",
    input: "Synchronized sensor data buses (USB3 / CAN bus / Ethernet), battery telemetry",
    output: "Trajectory velocity vectors (cmd_vel), actuator control signals, health heartbeats",
    relevantTechnologies: ["Industrial x86 / ARM Quad-Core", "Ubuntu Real-Time Kernel", "CANopen / EtherCAT Bus"],
    specs: "Sealed Fanless Chassis · <48 dB Acoustics",
  },
  {
    id: "indoor-slam-nav",
    level: 3,
    name: "Indoor SLAM & Nav2 Planner",
    layerCategory: "Robotics Middleware",
    icon: Navigation,
    description:
      "High-precision localization and navigation stack utilizing laser-inertial odometry and dynamic multi-layer hospital costmaps.",
    technicalPurpose:
      "Plans smooth, jerk-free navigation paths through multi-wing corridors, automatically detouring around temporary cleaning signs and gurney congestion.",
    input: "Laser scans, floor plan vector map, target clinic waypoint coordinates",
    output: "Dynamic obstacle avoidance velocity profiles and turn steering commands",
    relevantTechnologies: ["ROS 2 Humble / Iron", "Nav2 Navigation Stack", "Cartographer / AMCL Localization"],
    specs: "±1.5 cm Localization Precision",
  },
  {
    id: "smart-compartments",
    level: 4,
    name: "Smart Compartment Actuation",
    layerCategory: "Hardware Security",
    icon: Lock,
    description:
      "Microcontroller-managed electromechanical locking system controlling high-torque solenoid latches, door position Hall sensors, and temperature probes.",
    technicalPurpose:
      "Prevents physical access to medications during transit; confirms door seal integrity and alerts on any unauthorized tampering attempt.",
    input: "Locker unlock authorization command, door open/close contact states",
    output: "Solenoid driver actuation, internal LED illumination, temperature readings",
    relevantTechnologies: ["ARM Cortex-M4 Microcontroller", "12V Electronic Solenoids", "Digital RTD Temp Probes"],
    specs: "<300ms Actuation · Tamper Monitored",
  },
  {
    id: "biometric-access",
    level: 5,
    name: "Credential & Access Control",
    layerCategory: "Identity & Auth",
    icon: KeyRound,
    description:
      "Hospital staff credential verification reader supporting RFID employee badges, NFC smartcards, and an interactive 6-digit clinical touchscreen keypad.",
    input: "Staff badge UID (Mifare / HID), capacitive touchscreen PIN inputs",
    output: "Decrypted staff token, authorized compartment selector command",
    technicalPurpose:
      "Ensures medications and blood samples can only be unlocked by verified clinical personnel assigned to that specific patient order.",
    relevantTechnologies: ["HID Omnikey / Mifare RFID Reader", "NFC ISO 14443A", "AES-256 Token Verification"],
    specs: "Sub-second Badge Scan · Multi-Nurse Roles",
  },
  {
    id: "elevator-iot-gateway",
    level: 6,
    name: "Elevator & Door IoT Gateway",
    layerCategory: "Facility Integration",
    icon: Building,
    description:
      "Industrial wireless bridge communicating with hospital elevator dispatch banks, motorized fire doors, and cleanroom airlock interlocks.",
    technicalPurpose:
      "Automates vertical travel across multi-story hospital towers without requiring dedicated human escorts or physical button presses.",
    input: "Current floor position, target destination floor, elevator status telegrams",
    output: "BACnet IP car call telegrams, cleanroom door trigger pulses, floor exit flags",
    relevantTechnologies: ["BACnet IP Gateway", "Modbus TCP", "MQTT Wireless Relay", "REST Elevator APIs"],
    specs: "Multi-Vendor Elevator Bridge (Otis/KONE/Schindler)",
  },
  {
    id: "encrypted-telemetry",
    level: 7,
    name: "Encrypted Network Telemetry",
    layerCategory: "Clinical Networking",
    icon: Radio,
    description:
      "Hospital-grade dual-band Wi-Fi 6 transceiver with seamless 802.11r/k roaming across hospital access points and private cellular backup.",
    technicalPurpose:
      "Maintains uninterrupted real-time communication between mobile robots, floor access controllers, and centralized dispatch dashboards.",
    input: "Operational logs, GPS/indoor breadcrumbs, battery status, door events",
    output: "Encrypted TLS 1.3 telemetry packets to hospital local server",
    relevantTechnologies: ["WPA3-Enterprise / 802.1X", "TLS 1.3 Encryption", "Wi-Fi 6 (802.11ax)", "Private 5G / LTE Fallback"],
    specs: "WPA3 Enterprise · Zero Roaming Packet Loss",
  },
  {
    id: "cloud-fleet-hub",
    level: 8,
    name: "Hospital Fleet Management Hub",
    layerCategory: "Fleet Intelligence",
    icon: Cloud,
    description:
      "Centralized supervisory server coordinating multi-robot task distribution, traffic deconfliction in narrow corridors, and automatic battery opportunity charging.",
    technicalPurpose:
      "Optimizes robot deployment across clinical wings, dynamically balancing routine supply deliveries against emergency STAT orders.",
    input: "Fleet position heartbeats, queued hospital transport missions, charger statuses",
    output: "Optimized route dispatches, corridor traffic right-of-way grants, maintenance alerts",
    relevantTechnologies: ["Node.js / Go Microservices", "PostgreSQL / TimescaleDB", "Docker Containerization", "WebSocket Real-Time Engine"],
    specs: "99.99% Hospital High-Availability SLA",
  },
  {
    id: "his-ehr-dashboard",
    level: 9,
    name: "Clinical EHR & Dispatch Console",
    layerCategory: "User & Nurse Interface",
    icon: LayoutDashboard,
    description:
      "Web interface for pharmacy technicians and ward charge nurses, coupled with direct HL7 / FHIR connectors to Epic, Cerner, and hospital nurse call pagers.",
    technicalPurpose:
      "Empowers clinicians to track real-time medication deliveries, verify arrival timestamps, and generate digital chain-of-custody compliance audits.",
    input: "EHR medication transport orders, real-time robot telemetry pushes",
    output: "Visual floor map tracking, nurse Vocera alerts, exportable PDF chain-of-custody audits",
    relevantTechnologies: ["React / Vite", "HL7 FHIR R4 Integration", "Epic / Cerner Interoperability", "Vocera / Ascom Pager Gateway"],
    specs: "HL7 v2.x & FHIR R4 Certified Interoperability",
  },
];

export function HospitalArchitecture() {
  const [activeLayerId, setActiveLayerId] = useState<string>("indoor-slam-nav");

  const activeLayer =
    ARCHITECTURE_LAYERS.find((l) => l.id === activeLayerId) || ARCHITECTURE_LAYERS[2];
  const ActiveIcon = activeLayer.icon;

  return (
    <section className="relative bg-slate-900 text-white py-16 sm:py-24 px-4 lg:px-8 border-b border-slate-800 overflow-hidden">
      {/* Background accents */}
      <div className="pointer-events-none absolute top-1/4 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-10 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-[1440px]">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-4">
            <Layers size={13} className="text-cyan-400" />
            <span>End-to-End Clinical Stack</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            Technical Architecture: <br />
            <span className="text-cyan-400">9-Layer Hospital Logistics Flow</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            A secure architecture connecting low-level corridor perception to hospital
            EHR systems. Click any architectural layer to inspect its technical data contracts
            and protocols.
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 9-Layer Stack */}
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
                        ? "border-cyan-400 bg-slate-800 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400"
                        : "border-slate-800 bg-slate-950/70 hover:border-slate-700 hover:bg-slate-900/60"
                    }`}
                  >
                    <div
                      className={`size-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? "bg-cyan-400 text-slate-950"
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
                          <span className="size-2 rounded-full bg-cyan-400 shrink-0" />
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
                      className={isSelected ? "text-cyan-400" : "text-slate-600"}
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

          {/* Right Column: Deep-Dive Panel */}
          <div className="lg:col-span-7 bg-slate-950 rounded-2xl border border-slate-800 p-6 sm:p-8 lg:p-10 shadow-2xl sticky top-24">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-3.5">
                <div className="size-14 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <ActiveIcon size={26} />
                </div>
                <div>
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
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
                Subsystem Overview
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                {activeLayer.description}
              </p>
            </div>

            {/* Purpose */}
            <div className="mt-5 rounded-xl bg-slate-900/90 border border-slate-800 p-4">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-1.5 flex items-center gap-1.5">
                <Info size={13} />
                <span>Technical Purpose &amp; Clinical Safety Role</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeLayer.technicalPurpose}
              </p>
            </div>

            {/* Input / Output */}
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
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400 block mb-1.5">
                  Output Data Streams
                </span>
                <p className="text-xs text-slate-300 font-mono leading-relaxed">
                  {activeLayer.output}
                </p>
              </div>
            </div>

            {/* Tech Stack Pills */}
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
                    <span className="size-1.5 rounded-full bg-cyan-400" />
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
