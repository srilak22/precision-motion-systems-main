import React from "react";
import { Link } from "@tanstack/react-router";
import {
  Brain,
  Move3d,
  Layers,
  Activity,
  Bot,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { FadeUp, StaggerContainer, StaggerItem, HoverMotion } from "@/components/ui/motion";

const flagshipPillars = [
  {
    id: "physical-ai",
    title: "Physical AI Platform",
    category: "Physical Intelligence",
    badge: "Flagship Architecture",
    icon: Brain,
    description:
      "Combining 3D spatial perception, Vision-Language-Action (VLA) foundation models, and deterministic real-time motion control for autonomous assembly and inspection.",
    features: [
      "3D Point Cloud & Trajectory Planning",
      "200 Hz Closed-Loop Visual Servoing",
      "8-Layer Autonomous Execution Stack",
      "Dynamic Obstacle Avoidance & Force Control",
    ],
    link: "/technology/physical-ai",
    linkText: "Launch Physical AI Hub",
  },
  {
    id: "motion-studio",
    title: "INDUS Motion Studio",
    category: "Interactive Sizing & CAD",
    badge: "7th-Axis Multi-Arm",
    icon: Move3d,
    description:
      "Interactive 3D simulation and kinematic sizing platform. Test dual articulated robots on a 7th-axis linear track with inverse kinematics (J1–J6) and inertia matching.",
    features: [
      "Dual 6-Axis Arms on 7th-Axis Linear Rail",
      "Physics Inertia Ratio Matching (JL/JM < 10:1)",
      "Reach Envelope & Collision Clearance Analysis",
      "Instant PDF Engineering Dossier Generation",
    ],
    link: "/technology/motion-studio",
    linkText: "Launch 3D Motion Studio",
  },
  {
    id: "robotics-ecosystem",
    title: "Advanced Robotics Ecosystem",
    category: "8-Pillar Taxonomy",
    badge: "Verified Hardware Matrix",
    icon: Layers,
    description:
      "From Humanoids and AMRs to High-Speed Delta and Coordinated Multi-Robot Systems. Rigorous mechanical, electrical, and AI specifications for manufacturing.",
    features: [
      "Humanoids & Whole-Body Dynamics",
      "AMRs with LiDAR SLAM & Fleet Management",
      "Cobots with ISO/TS 15066 Force Limiting",
      "Soft Robotics & Dexterous End-Effectors",
    ],
    link: "/technology/robotics-ecosystem",
    linkText: "Explore Robotics Matrix",
  },
  {
    id: "digital-twin",
    title: "Digital Twin & Diagnostics",
    category: "Predictive Maintenance",
    badge: "ISO 10816 Telemetry",
    icon: Activity,
    description:
      "Continuous virtual workcell monitoring, real-time vibration FFT harmonic breakdown, strain-wave reducer wear tracking, and autonomous mobile fleet telemetry.",
    features: [
      "Virtual 3D Robotic Workcell Simulation",
      "Vibration FFT 1X/2X/Harmonic Analysis",
      "Gearbox Backlash & Thermal Degradation",
      "AMR Fleet Battery & Localization Telemetry",
    ],
    link: "/technology/digital-twin",
    linkText: "View Digital Twin",
  },
  {
    id: "indus-bot",
    title: "Indus Bot 2.0 AI Engineer",
    category: "Autonomous Engineering Assistant",
    badge: "Multimodal Voice & Vision",
    icon: Bot,
    description:
      "Dedicated robotics engineering copilot. Conversational motor sizing, reducer calculations, voice-guided troubleshooting, and multimodal image inspection.",
    features: [
      "Multimodal Defect & Kinematic Image Analysis",
      "Web Speech Voice Interaction & Transcription",
      "Instant Torque, Inertia & Takt Time Calculations",
      "Cross-Reference 240+ Precision CAD Models",
    ],
    link: "/indus-bot",
    linkText: "Chat with Indus Bot 2.0",
  },
];

export function AutonomousFutureShowcase() {
  return (
    <section className="relative bg-white py-16 lg:py-24 text-slate-900 border-b border-slate-200">
      <div className="mx-auto max-w-[1360px] px-5 lg:px-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <FadeUp distance={16} duration={0.55} className="max-w-3xl">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[.24em] text-[#155EEF]">
              Intelligent Motion · Autonomous Physical AI
            </p>
            <h2 className="font-display text-4xl font-bold uppercase leading-[.92] sm:text-5xl lg:text-6xl text-slate-900">
              Next-Gen Robotics &amp; Physical AI
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Bridging physics-grade precision motion with real-time embodied artificial intelligence. Explore INDUS&apos;s five foundational pillars designed to power autonomous industrial manufacturing.
            </p>
          </FadeUp>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/technology"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-800 hover:border-[#155EEF] hover:text-[#155EEF] transition-all shadow-2xs"
            >
              Technology Overview <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* 5 Flagship Pillars Cards Grid */}
        <StaggerContainer
          staggerDelay={0.08}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {flagshipPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            const isFirst = idx === 0;

            return (
              <StaggerItem
                key={pillar.id}
                className={isFirst ? "lg:col-span-2" : ""}
              >
                <HoverMotion variant="card" className="h-full">
                  <div className="group relative flex h-full flex-col justify-between rounded-xl border border-slate-200/90 bg-[#F8FAFC] p-6 lg:p-7 transition-all duration-200 hover:-translate-y-1 hover:border-[#155EEF]/50 hover:bg-white hover:shadow-md">
                    <div>
                      {/* Top Bar */}
                      <div className="flex items-center justify-between gap-2 mb-5">
                        <div className="flex items-center gap-3">
                          <span className="flex size-10 items-center justify-center rounded-lg border border-blue-200/80 bg-blue-50 text-[#155EEF] group-hover:bg-[#155EEF] group-hover:text-white transition-colors">
                            <Icon size={20} />
                          </span>
                          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            {pillar.category}
                          </span>
                        </div>
                        <span className="rounded-md border border-blue-200 bg-blue-50/80 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#155EEF]">
                          {pillar.badge}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-slate-900 group-hover:text-[#155EEF] transition-colors">
                        {pillar.title}
                      </h3>
                      <p className="mt-2.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
                        {pillar.description}
                      </p>

                      {/* Technical Feature Checkpoints */}
                      <div className="mt-5 pt-4 border-t border-slate-200/80 space-y-2">
                        {pillar.features.map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-700">
                            <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-[#155EEF]" />
                            <span className="leading-snug">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom CTA */}
                    <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between">
                      <Link
                        to={pillar.link}
                        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#155EEF] hover:text-[#1047BF] group-hover:translate-x-0.5 transition-transform"
                      >
                        {pillar.linkText} <ArrowRight size={14} />
                      </Link>
                      <span className="text-[10px] font-mono text-slate-400 font-semibold">
                        0{idx + 1}
                      </span>
                    </div>
                  </div>
                </HoverMotion>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
