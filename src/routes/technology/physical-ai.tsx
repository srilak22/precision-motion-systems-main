import React, { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  Eye,
  Layers,
  Workflow,
  Cpu,
  Zap,
  Activity,
  CheckCircle2,
  Sliders,
  ShieldCheck,
  Target,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Bot,
  ExternalLink,
  Radar,
  Move3d,
  Box,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModals } from "@/components/modals/ModalContext";
import { companyConfig } from "@/data/config";
import { buildSeoMeta } from "@/lib/seo";
import { CtaBanner } from "@/components/common/CtaBanner";

export const Route = createFileRoute("/technology/physical-ai")({
  head: () =>
    buildSeoMeta({
      title: "Physical AI Platform | INDUS Industrial Robotics",
      description:
        "Physical AI architecture bridging perception, vision-language-action models, real-time trajectory planning, and deterministic 1kHz robotic actuation. Intelligent Motion. Autonomous Future.",
      path: "/technology/physical-ai",
    }),
  component: PhysicalAiPage,
});

// Architecture Layer Definition
interface ArchitectureLayer {
  step: number;
  id: string;
  title: string;
  subtitle: string;
  description: string;
  technologies: string[];
  hardwareRequired: string;
  status: "Verified In-House" | "Active Research Prototype";
}

const PHYSICAL_AI_LAYERS: ArchitectureLayer[] = [
  {
    step: 1,
    id: "perception",
    title: "1. 3D Spatial Perception",
    subtitle: "High-density point clouds & tactile sensing",
    description:
      "Continuous depth acquisition, structured-light 3D scanning, and micro-deflection tactile finger matrices capturing sub-millimeter workpiece geometries.",
    technologies: ["3D Structured Light", "Time-of-Flight (ToF)", "Stereo Depth RGB-D", "Optical Tactile Arrays"],
    hardwareRequired: "IND-VIS-3D Eye-in-Hand camera, multi-axis F/T wrist sensor",
    status: "Verified In-House",
  },
  {
    step: 2,
    id: "fusion",
    title: "2. Sensor Fusion & World Modeling",
    subtitle: "Real-time spatial scene graphs & occupancy voxel grids",
    description:
      "Fuses high-bandwidth camera streams, encoder joint positions, and torque feedback into a live 3D voxel representation with dynamic collision envelopes.",
    technologies: ["Extended Kalman Filter (EKF)", "3D Gaussian Splatting", "OctoMap Voxel Trees", "Spatial Scene Graphs"],
    hardwareRequired: "Edge AI Industrial IPC (NVIDIA Jetson AGX Orin / RTX Ada)",
    status: "Verified In-House",
  },
  {
    step: 3,
    id: "intelligence",
    title: "3. Vision-Language-Action (VLA) Reasoning",
    subtitle: "Prompt-driven task decomposition & goal inference",
    description:
      "Translates natural language or ERP task instructions ('Fasten 4x M6 bolts to lower subframe') into hierarchical subgoals and spatial target coordinates.",
    technologies: ["Multimodal Robotics Transformers (RT-2/OpenVLA)", "Semantic Segmentation", "Zero-Shot Object Grounding"],
    hardwareRequired: "Low-latency Edge Inference Engine with TensorRT",
    status: "Active Research Prototype",
  },
  {
    step: 4,
    id: "motion-planning",
    title: "4. Real-Time Kinematic Trajectory Planning",
    subtitle: "Singularity-free collision-avoidance trajectory generation",
    description:
      "Calculates jerk-continuous 7-segment S-curve trajectories in Cartesian and joint space, dynamically re-planning in under 5ms when obstacles are introduced.",
    technologies: ["Bi-RRT / OMPL Planning", "Differential Dynamic Programming (DDP)", "7th-Axis Linear Rail Sync"],
    hardwareRequired: "Real-Time Linux Kernel (PREEMPT_RT / Xenomai)",
    status: "Verified In-House",
  },
  {
    step: 5,
    id: "control",
    title: "5. Whole-Body Robot Control",
    subtitle: "Deterministic 1kHz torque servoing & impedance compliance",
    description:
      "Closed-loop computed torque control with active impedance regulation, ensuring safe contact dynamics during assembly without damaging sensitive workpieces.",
    technologies: ["Active Impedance Control", "Gravity & Coriolis Feedforward", "1.0 kHz EtherCAT Cyclic Sync Torque (CST)"],
    hardwareRequired: "INDUS Motion Controller (IND-MC-400), EtherCAT Master",
    status: "Verified In-House",
  },
  {
    step: 6,
    id: "actuation",
    title: "6. Precision Mechanical Actuation",
    subtitle: "Zero-backlash strain wave joints & direct-drive links",
    description:
      "Transforms electrical energy and digital torque commands into smooth physical motion via harmonic gearing (<1 arcmin backlash) and dual 19-bit encoders.",
    technologies: ["Strain Wave Gearing", "Frameless BLDC Motors", "Dual Absolute Encoders", "Direct-Drive Servo Joints"],
    hardwareRequired: "IND-IRA Intelligent Rotary Actuators (70-142mm frames)",
    status: "Verified In-House",
  },
  {
    step: 7,
    id: "execution",
    title: "7. Autonomous Execution & Verification",
    subtitle: "In-process quality monitoring & self-correction",
    description:
      "Monitors real-time torque profiles against expected insertion resistance; automatically triggers micro-search patterns if misalignments occur.",
    technologies: ["Torque Signature Anomaly Detection", "Sub-Millimeter Insertion Spiral Search", "Automated Optical Inspection (AOI)"],
    hardwareRequired: "6-Axis Force-Torque Sensor (IND-FTS-500)",
    status: "Verified In-House",
  },
  {
    step: 8,
    id: "learning",
    title: "8. Continuous Learning & Sim2Real Transfer",
    subtitle: "Digital twin simulation to factory-floor convergence",
    description:
      "Transfers synthetic policies trained in physics simulators to physical cells via domain randomization, closing the gap between simulated and real kinematics.",
    technologies: ["Sim2Real Domain Randomization", "Reinforcement Learning with Human Feedback (RLHF)", "Fleet Knowledge Sharing"],
    hardwareRequired: "Cloud Training Pipeline & On-Premises Simulation Node",
    status: "Active Research Prototype",
  },
];

function PhysicalAiPage() {
  const { openModal } = useModals();
  const [selectedLayer, setSelectedLayer] = useState<ArchitectureLayer>(PHYSICAL_AI_LAYERS[0]);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(68);
  const [currentStepName, setCurrentStepName] = useState<string>("Fasten the screw at the joint");
  const [subgoal, setSubgoal] = useState<string>("Align screw and tighten with 3.2 Nm torque");

  // Simulated execution loop matching the user's reference image
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) {
          setCurrentStepName("Inspecting bolt seating & depth tolerance");
          setSubgoal("Optical verification via 3D point cloud");
          return 24;
        }
        if (prev === 45) {
          setCurrentStepName("Fasten the screw at the joint");
          setSubgoal("Align screw and tighten with 3.2 Nm torque");
        }
        return prev + 1;
      });
    }, 400);
    return () => clearInterval(interval);
  }, [isSimulating]);

  return (
    <div className="min-h-screen bg-[#0B111E] text-slate-100 font-sans selection:bg-[#16C7E8] selection:text-[#0B111E]">
      {/* 1. HERO SECTION (INDUSTRIAL DARK THEME) */}
      <section className="relative overflow-hidden border-b border-white/10 pt-24 pb-20 px-5 lg:px-10">
        {/* Engineering Grid Background */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(35,136,255,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(35,136,255,0.2) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-1/4 -right-40 w-96 h-96 bg-[#2388FF]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#16C7E8]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-[1440px]">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400 mb-6">
            <Link to="/" className="hover:text-[#16C7E8] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/technology" className="hover:text-[#16C7E8] transition-colors">
              Technology Stack
            </Link>
            <span>/</span>
            <span className="text-[#16C7E8]">Physical AI</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16C7E8]/10 border border-[#16C7E8]/30 text-[#16C7E8] text-xs font-mono uppercase tracking-widest mb-4">
            <span className="size-2 rounded-full bg-[#16C7E8] animate-ping" />
            <span>Flagship Architectural Recommendation</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold uppercase tracking-tight text-white leading-none">
            Physical AI Platform
          </h1>
          <p className="text-xl sm:text-2xl font-light text-[#16C7E8] mt-3 font-display uppercase tracking-widest">
            Intelligent Motion. Autonomous Future.
          </p>

          <p className="mt-6 max-w-3xl text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Physical AI is the combination of artificial intelligence with machines that can perceive,
            reason, and act in the unstructured physical world. By uniting 3D spatial perception,
            vision-language-action (VLA) foundation models, and sub-millisecond deterministic robot control,
            INDUS transforms industrial manipulators into truly autonomous physical agents.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              onClick={() => openModal("engineer", { categoryName: "Physical AI Co-Development" })}
              className="h-11 rounded-none bg-[#16C7E8] text-[#0B111E] font-bold uppercase hover:bg-[#16C7E8]/90 text-xs px-6 tracking-wider cursor-pointer"
            >
              <Cpu className="mr-2 size-4" /> Discuss Physical AI Architecture
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-11 rounded-none border-white/20 bg-white/5 text-white hover:bg-white/10 text-xs uppercase font-bold tracking-wider"
            >
              <Link to="/technology/motion-studio">
                <Move3d className="mr-2 size-4 text-[#2388FF]" /> Open Motion Studio
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-11 rounded-none border-white/20 bg-white/5 text-white hover:bg-white/10 text-xs uppercase font-bold tracking-wider"
            >
              <Link to="/technology/robotics-ecosystem">
                <Bot className="mr-2 size-4 text-[#16C7E8]" /> View Robotics Ecosystem
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE 3D POINT CLOUD & TRAJECTORY SIMULATOR (IMAGE 1 REPLICA) */}
      <section className="py-16 px-5 lg:px-10 border-b border-white/10 bg-[#0F172A]/70">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#16C7E8] block mb-1">
                LIVE INTERACTION &amp; TRAJECTORY VISUALIZATION
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase text-white tracking-tight">
                3D Point Cloud &amp; Trajectory Generation
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-400">
                Simulation Loop: <strong className="text-emerald-400">1,000 Hz CST</strong>
              </span>
              <button
                onClick={() => setIsSimulating(!isSimulating)}
                className="px-3 py-1.5 text-xs font-mono font-bold uppercase rounded bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {isSimulating ? <Pause size={13} /> : <Play size={13} />}
                <span>{isSimulating ? "Pause Feed" : "Resume Feed"}</span>
              </button>
            </div>
          </div>

          {/* Visualization Studio Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Visual Viewport with Simulated 3D Point Cloud Canvas */}
            <div className="lg:col-span-8 rounded-xl border border-white/10 bg-[#080D1A] p-4 relative overflow-hidden min-h-[440px] flex flex-col justify-between">
              {/* Top Viewport HUD Overlays */}
              <div className="flex items-center justify-between z-10 text-[11px] font-mono text-slate-400">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-[#2388FF]" /> Point Cloud (24,500 pts)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-emerald-400" /> Planned Trajectory
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-amber-400" /> Executed Trajectory
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-rose-500" /> Target Position
                  </span>
                </div>
                <span className="text-slate-500 hidden sm:inline">Sensor: Eye-in-Hand Stereo RGB-D</span>
              </div>

              {/* Dynamic Simulated Interactive Point Cloud Canvas */}
              <div className="relative my-auto flex items-center justify-center py-6">
                <svg
                  viewBox="0 0 600 300"
                  className="w-full max-w-2xl h-auto overflow-visible select-none"
                >
                  <defs>
                    <linearGradient id="traj-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2388FF" />
                      <stop offset="50%" stopColor="#16C7E8" />
                      <stop offset="100%" stopColor="#10B981" />
                    </linearGradient>
                  </defs>

                  {/* Ground Plane Grid in Isometric View */}
                  <g opacity="0.25" stroke="#2388FF" strokeWidth="0.75">
                    <line x1="50" y1="240" x2="550" y2="240" />
                    <line x1="80" y1="260" x2="520" y2="260" />
                    <line x1="120" y1="280" x2="480" y2="280" />
                    <line x1="100" y1="230" x2="160" y2="290" />
                    <line x1="200" y1="230" x2="260" y2="290" />
                    <line x1="300" y1="230" x2="360" y2="290" />
                    <line x1="400" y1="230" x2="460" y2="290" />
                  </g>

                  {/* Workpiece / Cabinet Geometry Assembly */}
                  <rect x="220" y="140" width="160" height="90" fill="#1E293B" stroke="#475569" strokeWidth="1.5" rx="3" />
                  <rect x="235" y="155" width="60" height="75" fill="#0F172A" stroke="#334155" strokeWidth="1" />
                  <rect x="305" y="155" width="60" height="75" fill="#0F172A" stroke="#334155" strokeWidth="1" />

                  {/* Scattered 3D Point Cloud Dots */}
                  <g fill="#2388FF" opacity="0.65">
                    <circle cx="215" cy="135" r="1.5" />
                    <circle cx="225" cy="130" r="1.2" />
                    <circle cx="240" cy="132" r="1.8" />
                    <circle cx="260" cy="128" r="1.3" />
                    <circle cx="280" cy="130" r="1.7" />
                    <circle cx="300" cy="125" r="1.5" />
                    <circle cx="320" cy="128" r="1.4" />
                    <circle cx="340" cy="132" r="1.6" />
                    <circle cx="360" cy="130" r="1.8" />
                    <circle cx="380" cy="138" r="1.5" />
                    {/* Corner clusters */}
                    <circle cx="225" cy="225" r="2" fill="#16C7E8" />
                    <circle cx="228" cy="223" r="1.5" fill="#16C7E8" />
                    <circle cx="375" cy="225" r="2" fill="#16C7E8" />
                  </g>

                  {/* Robot Arm Graphic Representation */}
                  <g stroke="#94A3B8" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none">
                    {/* Base */}
                    <path d="M 90 240 L 120 180" stroke="#475569" strokeWidth="14" />
                    {/* Link 1 (Shoulder) */}
                    <path d="M 120 180 L 180 80" stroke="#E2E8F0" strokeWidth="12" />
                    {/* Link 2 (Elbow) */}
                    <path d="M 180 80 L 250 110" stroke="#CBD5E1" strokeWidth="9" />
                    {/* Wrist & Tool Tool Flange */}
                    <path d="M 250 110 L 285 130" stroke="#16C7E8" strokeWidth="6" />
                  </g>

                  {/* Robotic Joint Nodes */}
                  <circle cx="90" cy="240" r="10" fill="#0F172A" stroke="#2388FF" strokeWidth="3" />
                  <circle cx="120" cy="180" r="8" fill="#0F172A" stroke="#2388FF" strokeWidth="3" />
                  <circle cx="180" cy="80" r="7" fill="#0F172A" stroke="#2388FF" strokeWidth="3" />
                  <circle cx="250" cy="110" r="5" fill="#0F172A" stroke="#16C7E8" strokeWidth="2.5" />

                  {/* Tool Head & Fastening Bit */}
                  <g transform="translate(285, 130)">
                    <rect x="-3" y="0" width="6" height="18" fill="#16C7E8" rx="1" />
                    <line x1="0" y1="18" x2="0" y2="26" stroke="#F8FAFC" strokeWidth="2" />
                    <circle cx="0" cy="26" r="3" fill="#E11D48" className="animate-pulse" />
                  </g>

                  {/* Real-time Trajectory Curve */}
                  <path
                    d="M 180 80 Q 230 40 285 156"
                    fill="none"
                    stroke="url(#traj-grad)"
                    strokeWidth="3.5"
                    strokeDasharray="6 3"
                  />

                  {/* Target Fastener Position */}
                  <circle cx="285" cy="156" r="6" fill="none" stroke="#E11D48" strokeWidth="2" />
                  <circle cx="285" cy="156" r="2" fill="#E11D48" />
                  <text x="295" y="160" fill="#F43F5E" fontSize="10" fontFamily="monospace" fontWeight="bold">
                    Target [X: 420.2, Y: 110.5, Z: 18.0]
                  </text>
                </svg>
              </div>

              {/* Bottom Telemetry HUD matching Image 1 */}
              <div className="rounded-lg border border-white/10 bg-[#0F172A]/90 p-4 backdrop-blur-md">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                      Task: <span className="text-white font-bold">Assemble structural subframe</span>
                    </div>
                    <div className="text-xs font-mono text-[#16C7E8] font-bold">
                      Step: <span>{currentStepName}</span>
                    </div>
                  </div>

                  <div className="w-full sm:w-64 space-y-1">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-slate-400">Status: <strong className="text-emerald-400">Executing</strong></span>
                      <span className="text-white font-bold">{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#2388FF] to-[#16C7E8] h-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="text-[9.5px] font-mono text-slate-400 truncate">
                      Subgoal: {subgoal}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Telemetry Column (Physics & Kinematic Envelope) */}
            <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
              <div className="rounded-xl border border-white/10 bg-[#080D1A] p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-mono font-bold uppercase text-[#16C7E8]">
                    Real-Time State Estimation
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    CONVERGED
                  </span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-slate-400">Cartesian Position Error</span>
                    <span className="font-bold text-emerald-400">± 0.004 mm</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-slate-400">Z-Axis Contact Force</span>
                    <span className="font-bold text-white">24.2 N (Target: 25 N)</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-slate-400">Tightening Torque</span>
                    <span className="font-bold text-[#16C7E8]">3.18 Nm (±0.05 Nm)</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-slate-400">Trajectory Jitter</span>
                    <span className="font-bold text-white">&lt; 12 μs</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-slate-400">VLA Inference Latency</span>
                    <span className="font-bold text-[#2388FF]">1.4 ms @ Edge</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-400">Joint Backlash Compensation</span>
                    <span className="font-bold text-emerald-400">Active (Harmonic)</span>
                  </div>
                </div>
              </div>

              {/* Hardware Passport Callout */}
              <div className="rounded-xl border border-[#2388FF]/30 bg-gradient-to-br from-[#101B2D] to-[#16243A] p-5 text-xs space-y-3">
                <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#2388FF] block">
                  PHYSICAL ACTUATION SUBSYSTEM
                </span>
                <h4 className="font-bold text-sm text-white">IND-IRA Rotary Actuator Stack</h4>
                <p className="text-slate-300 leading-relaxed text-[11.5px]">
                  Powering joints J1–J6 with zero-backlash strain wave gears, 48V DC integrated field-oriented
                  control (FOC), and EtherCAT CoE (CiA 402) cyclic synchronous torque mode.
                </p>
                <Link
                  to="/products/$category"
                  params={{ category: "rotary-actuator" }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16C7E8] hover:underline"
                >
                  Inspect Actuator Technical Specs <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. STRUCTURED 8-LAYER PHYSICAL AI ARCHITECTURE */}
      <section className="py-20 px-5 lg:px-10 border-b border-white/10 bg-[#0B111E]">
        <div className="mx-auto max-w-[1440px]">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#16C7E8] block mb-2">
              END-TO-END PHYSICAL INTELLIGENCE STACK
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold uppercase text-white tracking-tight">
              The 8 Layers of Industrial Physical AI
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed">
              Unlike software-only AI, Physical AI operates within strict Newtonian laws, friction boundaries,
              resonance modes, and micro-second safety limits. Here is how the INDUS stack connects perception to torque.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Layer Navigation List */}
            <div className="lg:col-span-5 space-y-2">
              {PHYSICAL_AI_LAYERS.map((layer) => {
                const isSelected = selectedLayer.id === layer.id;
                return (
                  <button
                    key={layer.id}
                    onClick={() => setSelectedLayer(layer)}
                    className={`w-full text-left p-4 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "bg-[#1E293B] border-[#16C7E8] text-white shadow-lg"
                        : "bg-[#0F172A]/60 border-white/5 text-slate-400 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-sm tracking-wide">
                          {layer.title}
                        </span>
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-semibold ${
                            layer.status === "Verified In-House"
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                          }`}
                        >
                          {layer.status === "Verified In-House" ? "Production" : "Research"}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">{layer.subtitle}</div>
                    </div>
                    <ArrowRight
                      size={15}
                      className={`shrink-0 transition-transform ${
                        isSelected ? "text-[#16C7E8] translate-x-1" : "text-slate-600"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Right Detailed Inspector Panel */}
            <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-[#0F172A] p-8 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#16C7E8] block">
                    LAYER {selectedLayer.step} ARCHITECTURE DEEP DIVE
                  </span>
                  <h3 className="font-display text-2xl font-bold uppercase text-white tracking-tight mt-1">
                    {selectedLayer.title}
                  </h3>
                </div>
                <span
                  className={`text-xs font-mono px-3 py-1 rounded-full uppercase font-bold border ${
                    selectedLayer.status === "Verified In-House"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : "bg-purple-500/10 text-purple-300 border-purple-500/30"
                  }`}
                >
                  {selectedLayer.status}
                </span>
              </div>

              <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
                <div>
                  <h4 className="text-xs font-mono uppercase font-bold text-slate-400 mb-2">Technical Execution</h4>
                  <p className="bg-slate-900/60 p-4 rounded-lg border border-white/5 text-slate-200">
                    {selectedLayer.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase font-bold text-slate-400 mb-2">Key Algorithms &amp; Protocols</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedLayer.technologies.map((tech, tIdx) => (
                      <div
                        key={tIdx}
                        className="rounded border border-white/5 bg-[#1E293B]/50 px-3 py-2 text-xs font-mono text-[#16C7E8] flex items-center gap-2"
                      >
                        <CheckCircle2 size={13} className="text-[#16C7E8] shrink-0" />
                        <span className="truncate">{tech}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase font-bold text-slate-400 mb-2">Required Physical Hardware</h4>
                  <div className="rounded-lg border border-[#2388FF]/30 bg-[#2388FF]/10 p-3.5 text-xs font-mono text-white flex items-center justify-between">
                    <span>{selectedLayer.hardwareRequired}</span>
                    <ShieldCheck size={16} className="text-[#16C7E8] shrink-0" />
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                <Button
                  onClick={() =>
                    openModal("engineer", {
                      categoryName: `Physical AI - Layer ${selectedLayer.step}`,
                      initialMessage: `Inquiring about ${selectedLayer.title} implementation feasibility.`,
                    })
                  }
                  className="rounded-none bg-[#16C7E8] text-[#0B111E] font-bold uppercase text-xs hover:bg-[#16C7E8]/90"
                >
                  Request Architecture Whitepaper
                </Button>
                <span className="text-[11px] font-mono text-slate-500">
                  DIN 3990 &bull; ISO 9283 Compatible
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRACTICAL INDUSTRIAL APPLICATION SCENARIOS */}
      <section className="py-20 px-5 lg:px-10 border-b border-white/10 bg-[#0F172A]">
        <div className="mx-auto max-w-[1440px]">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#16C7E8] block mb-2">
              DEPLOYMENT DOMAINS
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold uppercase text-white tracking-tight">
              Where Physical AI Delivers Measurable ROI
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-2">
              Traditional fixed robot trajectories fail when parts vary in orientation, flex, or surface finish. Physical AI adapts autonomously.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-white/10 bg-[#080D1A] p-6 space-y-4 hover:border-[#16C7E8]/50 transition-colors">
              <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                Automotive &amp; EV Battery
              </span>
              <h3 className="font-display text-xl font-bold uppercase text-white">
                Prismatic Cell Busbar Laser Fastening
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Adaptive 3D visual servoing locating individual battery cell terminals subject to thermal manufacturing expansion tolerances. Automatically offsets laser toolhead trajectory with ±0.01mm repeatability.
              </p>
              <div className="pt-2 border-t border-white/10 text-[11px] font-mono text-slate-400">
                Takt Time Reduction: <strong>32%</strong> &bull; Zero Scrap
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#080D1A] p-6 space-y-4 hover:border-[#16C7E8]/50 transition-colors">
              <span className="text-[10px] font-mono uppercase font-bold text-[#16C7E8] bg-[#16C7E8]/10 px-2.5 py-0.5 rounded border border-[#16C7E8]/20">
                High-Mix Electronics
              </span>
              <h3 className="font-display text-xl font-bold uppercase text-white">
                Random Bin Picking &amp; Wire Harness Insertion
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Grounded 3D point cloud segmentation separating tangled, reflective flexible wire harnesses. Bi-RRT planners prevent singularity binding during tight electrical enclosure insertions.
              </p>
              <div className="pt-2 border-t border-white/10 text-[11px] font-mono text-slate-400">
                Zero Dedicated Fixturing Required
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#080D1A] p-6 space-y-4 hover:border-[#16C7E8]/50 transition-colors">
              <span className="text-[10px] font-mono uppercase font-bold text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded border border-purple-500/20">
                Precision Furniture &amp; Joinery
              </span>
              <h3 className="font-display text-xl font-bold uppercase text-white">
                Adaptive Mortise &amp; Tenon Assembly
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Directly matches the visual demonstration: real-time point clouds detect wood grain deviations and warpage, modulating insertion force dynamically to prevent wood cracking or joint jamming.
              </p>
              <div className="pt-2 border-t border-white/10 text-[11px] font-mono text-slate-400">
                Force Threshold Guard: <strong>12.5 N max</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CONNECTED CTA BANNER */}
      <div className="mx-auto max-w-[1440px] px-5 lg:px-10 py-12">
        <CtaBanner
          variant="precision"
          badge="PHYSICAL AI APPLICATION FEASIBILITY"
          headline="Co-Develop Physical AI Cells with INDUS Engineers"
          description="Access our Chennimalai engineering facility simulation testbeds, validate your CAD parts under real-time point cloud guidance, and inspect mechanical inertia matching before placing hardware orders."
          ctaPrimary={{
            label: "Book Application Consultation",
            href: "/book-consultation",
          }}
          ctaSecondary={{
            label: "Explore Robotics Ecosystem",
            href: "/technology/robotics-ecosystem",
          }}
        />
      </div>
    </div>
  );
}
