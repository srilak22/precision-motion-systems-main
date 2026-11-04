import React from "react";
import { Link } from "@tanstack/react-router";
import {
  Brain,
  Move3d,
  Layers,
  Activity,
  Bot,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { FadeUp, StaggerContainer, StaggerItem, HoverMotion } from "@/components/ui/motion";

const flagshipPillars = [
  {
    id: "physical-ai",
    title: "Physical AI Platform",
    category: "Physical Intelligence",
    badge: "Flagship Architecture",
    badgeColor: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40",
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
    gradient: "from-emerald-950/70 via-[#0D1626] to-[#080D18]",
    accent: "text-emerald-400",
    border: "border-emerald-500/30 hover:border-emerald-400/80 hover:shadow-[0_0_25px_rgba(16,185,129,0.18)]",
    iconBg: "bg-emerald-950/80 border-emerald-500/40 text-emerald-400",
  },
  {
    id: "motion-studio",
    title: "INDUS Motion Studio",
    category: "Interactive Sizing & CAD",
    badge: "7th-Axis Multi-Arm",
    badgeColor: "bg-amber-500/15 text-amber-300 border-amber-500/40",
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
    gradient: "from-amber-950/70 via-[#0D1626] to-[#080D18]",
    accent: "text-amber-400",
    border: "border-amber-500/30 hover:border-amber-400/80 hover:shadow-[0_0_25px_rgba(245,158,11,0.18)]",
    iconBg: "bg-amber-950/80 border-amber-500/40 text-amber-400",
  },
  {
    id: "robotics-ecosystem",
    title: "Advanced Robotics Ecosystem",
    category: "8-Pillar Taxonomy",
    badge: "Verified Hardware Matrix",
    badgeColor: "bg-cyan-500/15 text-cyan-300 border-cyan-500/40",
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
    gradient: "from-cyan-950/70 via-[#0D1626] to-[#080D18]",
    accent: "text-cyan-400",
    border: "border-cyan-500/30 hover:border-cyan-400/80 hover:shadow-[0_0_25px_rgba(6,182,212,0.18)]",
    iconBg: "bg-cyan-950/80 border-cyan-500/40 text-cyan-400",
  },
  {
    id: "digital-twin",
    title: "Digital Twin & Diagnostics",
    category: "Predictive Maintenance",
    badge: "ISO 10816 Telemetry",
    badgeColor: "bg-purple-500/15 text-purple-300 border-purple-500/40",
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
    gradient: "from-purple-950/70 via-[#0D1626] to-[#080D18]",
    accent: "text-purple-400",
    border: "border-purple-500/30 hover:border-purple-400/80 hover:shadow-[0_0_25px_rgba(168,85,247,0.18)]",
    iconBg: "bg-purple-950/80 border-purple-500/40 text-purple-400",
  },
  {
    id: "indus-bot",
    title: "Indus Bot 2.0 AI Engineer",
    category: "Autonomous Engineering Assistant",
    badge: "Multimodal Voice & Vision",
    badgeColor: "bg-blue-500/15 text-blue-300 border-blue-500/40",
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
    gradient: "from-blue-950/70 via-[#0D1626] to-[#080D18]",
    accent: "text-[#2388FF]",
    border: "border-blue-500/30 hover:border-blue-400/80 hover:shadow-[0_0_25px_rgba(35,136,255,0.18)]",
    iconBg: "bg-blue-950/80 border-blue-500/40 text-[#2388FF]",
  },
];

export function AutonomousFutureShowcase() {
  return (
    <section className="relative overflow-hidden bg-[#07090D] py-24 text-white technical-grid border-y border-white/10">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute left-1/4 top-1/4 -z-10 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute right-1/4 bottom-1/4 -z-10 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="mx-auto max-w-[1360px] px-5 lg:px-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <FadeUp distance={16} duration={0.55} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-signal/30 bg-signal/10 px-3.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-signal mb-4">
              <Sparkles className="size-3.5 animate-pulse" />
              INTELLIGENT MOTION · AUTONOMOUS PHYSICAL AI
            </div>
            <h2 className="font-display text-4xl font-bold uppercase leading-[.92] sm:text-5xl lg:text-6xl text-white">
              Next-Gen Robotics &amp; Physical AI
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
              Bridging physics-grade precision motion with real-time embodied artificial intelligence. Explore INDUS's five foundational pillars designed to power fully autonomous industrial manufacturing.
            </p>
          </FadeUp>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/technology"
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:border-signal hover:text-signal hover:bg-white/10 transition-all"
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
            const isWide = idx === 0 || idx === 1; // Top two featured cards take prominent presence

            return (
              <StaggerItem
                key={pillar.id}
                className={isWide && idx === 0 ? "lg:col-span-2" : isWide && idx === 1 ? "lg:col-span-1" : ""}
              >
                <HoverMotion variant="card" className="h-full">
                  <div
                    className={`group relative flex h-full flex-col justify-between rounded-xl border bg-gradient-to-b ${pillar.gradient} p-7 lg:p-8 transition-all duration-300 ${pillar.border} shadow-2xl backdrop-blur-sm`}
                  >
                    <div>
                      {/* Top Bar */}
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                          <span className={`flex size-11 items-center justify-center rounded-lg border ${pillar.iconBg} group-hover:scale-105 transition-transform shadow-xs`}>
                            <Icon size={22} />
                          </span>
                          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            {pillar.category}
                          </span>
                        </div>
                        <span className={`rounded border px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${pillar.badgeColor}`}>
                          {pillar.badge}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h3 className="font-display text-2xl font-bold uppercase tracking-wide text-white group-hover:text-signal transition-colors sm:text-3xl">
                        {pillar.title}
                      </h3>
                      <p className="mt-3 text-xs leading-relaxed text-slate-300 sm:text-sm">
                        {pillar.description}
                      </p>

                      {/* Technical Feature Checkpoints */}
                      <div className="mt-6 pt-5 border-t border-white/10 space-y-2.5">
                        {pillar.features.map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-200 font-mono">
                            <CheckCircle2 size={14} className={`mt-0.5 shrink-0 ${pillar.accent}`} />
                            <span className="leading-snug">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom CTA */}
                    <div className="mt-8 pt-5 border-t border-white/10 flex items-center justify-between">
                      <Link
                        to={pillar.link}
                        className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${pillar.accent} hover:underline group-hover:translate-x-1 transition-transform`}
                      >
                        {pillar.linkText} <ArrowRight size={14} />
                      </Link>
                      <span className="text-[10px] font-mono text-slate-500 font-semibold">
                        0{idx + 1} // ECOSYSTEM
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
