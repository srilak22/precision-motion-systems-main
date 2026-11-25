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
import { PointCloud3DViewport } from "@/components/technology/PointCloud3DViewport";

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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      {/* 1. HERO SECTION (HIGH-CONTRAST LIGHT ENTERPRISE THEME) */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white pt-16 pb-16 px-5 lg:px-10">
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(21,94,239,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(21,94,239,0.06) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative mx-auto max-w-[1440px]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#155EEF] text-xs font-mono font-semibold uppercase tracking-widest mb-4">
            <span className="size-2 rounded-full bg-[#155EEF] animate-pulse" />
            <span>Physical AI Architecture</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-slate-900 leading-none">
            Physical AI Platform
          </h1>
          <p className="text-lg sm:text-xl font-medium text-[#155EEF] mt-3 font-display uppercase tracking-wider">
            Intelligent Motion. Autonomous Future.
          </p>

          <p className="mt-5 max-w-3xl text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Physical AI is the combination of artificial intelligence with machines that can perceive,
            reason, and act in the unstructured physical world. By uniting 3D spatial perception,
            vision-language-action (VLA) foundation models, and sub-millisecond deterministic robot control,
            INDUS transforms industrial manipulators into autonomous physical agents.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              onClick={() => openModal("engineer", { categoryName: "Physical AI Co-Development" })}
              className="h-11 rounded-lg bg-[#155EEF] text-white font-bold uppercase hover:bg-[#1047BF] text-xs px-6 tracking-wider cursor-pointer"
            >
              <Cpu className="mr-2 size-4" /> Discuss Physical AI Architecture
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-11 rounded-lg border-slate-300 bg-white text-slate-800 hover:border-[#155EEF] hover:text-[#155EEF] text-xs uppercase font-bold tracking-wider"
            >
              <Link to="/technology/motion-studio">
                <Move3d className="mr-2 size-4 text-[#155EEF]" /> Open Motion Studio
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-11 rounded-lg border-slate-300 bg-white text-slate-800 hover:border-[#155EEF] hover:text-[#155EEF] text-xs uppercase font-bold tracking-wider"
            >
              <Link to="/technology/robotics-ecosystem">
                <Bot className="mr-2 size-4 text-[#155EEF]" /> View Robotics Ecosystem
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE 3D POINT CLOUD & TRAJECTORY SIMULATOR */}
      <section className="py-16 px-5 lg:px-10 border-b border-slate-200 bg-[#F4F7FB]">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#155EEF] block mb-1">
                Live Interactive 3D Visualization
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase text-slate-900 tracking-tight">
                3D Point Cloud &amp; Trajectory Generation
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-600">
                Simulation Loop: <strong className="text-emerald-700">1,000 Hz CST</strong>
              </span>
              <button
                onClick={() => setIsSimulating(!isSimulating)}
                className="px-3.5 py-2 text-xs font-mono font-bold uppercase rounded-lg border border-slate-300 bg-white hover:border-[#155EEF] hover:text-[#155EEF] text-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                {isSimulating ? <Pause size={13} /> : <Play size={13} />}
                <span>{isSimulating ? "Pause Feed" : "Resume Feed"}</span>
              </button>
            </div>
          </div>

          {/* Visualization Studio Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Visual Viewport with Real Interactive 3D Point Cloud Canvas */}
            <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col justify-between gap-3">
              <div className="rounded-xl border border-slate-800 bg-[#0B1324] p-4 relative overflow-hidden flex flex-col justify-between">
                {/* Top Viewport HUD Overlays */}
                <div className="flex flex-wrap items-center justify-between gap-2 z-10 text-[11px] font-mono text-slate-300 mb-2">
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    <span className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-[#38BDF8]" /> Point Cloud (3D Voxel)
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
                  <span className="text-slate-400 hidden sm:inline">Sensor: Eye-in-Hand Stereo RGB-D</span>
                </div>

                {/* Real Interactive 3D Canvas */}
                <PointCloud3DViewport progress={progress} isSimulating={isSimulating} />
              </div>

              {/* Bottom Telemetry HUD (High-Contrast Light Card) */}
              <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
                      Task: <span className="text-slate-900 font-bold">Assemble structural subframe</span>
                    </div>
                    <div className="text-xs font-mono text-[#155EEF] font-bold">
                      Step: <span>{currentStepName}</span>
                    </div>
                  </div>

                  <div className="w-full sm:w-64 space-y-1">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-slate-600">Status: <strong className="text-emerald-700">Executing</strong></span>
                      <span className="text-slate-900 font-bold">{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#155EEF] to-[#0EA5E9] h-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 truncate">
                      Subgoal: {subgoal}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Telemetry Column (High-Contrast White Cards) */}
            <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-mono font-bold uppercase text-[#155EEF]">
                    Real-Time State Estimation
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    CONVERGED
                  </span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-600">Cartesian Position Error</span>
                    <span className="font-bold text-emerald-700">± 0.004 mm</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-600">Z-Axis Contact Force</span>
                    <span className="font-bold text-slate-900">24.2 N (Target: 25 N)</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-600">Tightening Torque</span>
                    <span className="font-bold text-[#155EEF]">3.18 Nm (±0.05 Nm)</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-600">Trajectory Jitter</span>
                    <span className="font-bold text-slate-900">&lt; 12 μs</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-600">VLA Inference Latency</span>
                    <span className="font-bold text-[#155EEF]">1.4 ms @ Edge</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-600">Backlash Compensation</span>
                    <span className="font-bold text-emerald-700">Active (Harmonic)</span>
                  </div>
                </div>
              </div>

              {/* Hardware Passport Callout */}
              <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-5 text-xs space-y-3 shadow-xs">
                <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#155EEF] block">
                  Physical Actuation Subsystem
                </span>
                <h4 className="font-bold text-sm text-slate-900">IND-IRA Rotary Actuator Stack</h4>
                <p className="text-slate-700 leading-relaxed text-[12px]">
                  Powering joints J1–J6 with zero-backlash strain wave gears, 48V DC integrated field-oriented
                  control (FOC), and EtherCAT CoE (CiA 402) cyclic synchronous torque mode.
                </p>
                <Link
                  to="/products/$category"
                  params={{ category: "motion-actuation" }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#155EEF] hover:underline"
                >
                  Inspect Actuator Technical Specs <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. STRUCTURED 8-LAYER PHYSICAL AI ARCHITECTURE */}
      <section className="py-16 lg:py-20 px-5 lg:px-10 border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1440px]">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#155EEF] block mb-2">
              End-to-End Physical Intelligence Stack
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold uppercase text-slate-900 tracking-tight">
              The 8 Layers of Industrial Physical AI
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
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
                    className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "bg-blue-50/80 border-[#155EEF] text-slate-900 shadow-xs"
                        : "bg-[#F8FAFC] border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-white"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-sm tracking-wide text-slate-900">
                          {layer.title}
                        </span>
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-semibold ${
                            layer.status === "Verified In-House"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-purple-50 text-purple-700 border border-purple-200"
                          }`}
                        >
                          {layer.status === "Verified In-House" ? "Production" : "Research"}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">{layer.subtitle}</div>
                    </div>
                    <ArrowRight
                      size={15}
                      className={`shrink-0 transition-transform ${
                        isSelected ? "text-[#155EEF] translate-x-1" : "text-slate-400"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Right Detailed Inspector Panel */}
            <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-[#F8FAFC] p-7 sm:p-8 shadow-sm relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-4 mb-6">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#155EEF] font-bold block">
                    Layer {selectedLayer.step} Architecture Deep Dive
                  </span>
                  <h3 className="font-display text-2xl font-bold uppercase text-slate-900 tracking-tight mt-1">
                    {selectedLayer.title}
                  </h3>
                </div>
                <span
                  className={`text-xs font-mono px-3 py-1 rounded-full uppercase font-bold border ${
                    selectedLayer.status === "Verified In-House"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-purple-50 text-purple-700 border-purple-200"
                  }`}
                >
                  {selectedLayer.status}
                </span>
              </div>

              <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
                <div>
                  <h4 className="text-xs font-mono uppercase font-bold text-slate-500 mb-2">Technical Execution</h4>
                  <p className="bg-white p-4 rounded-xl border border-slate-200 text-slate-700">
                    {selectedLayer.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase font-bold text-slate-500 mb-2">Key Algorithms &amp; Protocols</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedLayer.technologies.map((tech, tIdx) => (
                      <div
                        key={tIdx}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-mono text-[#155EEF] font-semibold flex items-center gap-2"
                      >
                        <CheckCircle2 size={13} className="text-[#155EEF] shrink-0" />
                        <span className="truncate">{tech}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase font-bold text-slate-500 mb-2">Required Physical Hardware</h4>
                  <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-3.5 text-xs font-mono text-slate-900 flex items-center justify-between gap-2">
                    <span>{selectedLayer.hardwareRequired}</span>
                    <ShieldCheck size={16} className="text-[#155EEF] shrink-0" />
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <Button
                  onClick={() =>
                    openModal("engineer", {
                      categoryName: `Physical AI - Layer ${selectedLayer.step}`,
                      initialMessage: `Inquiring about ${selectedLayer.title} implementation feasibility.`,
                    })
                  }
                  className="rounded-lg bg-[#155EEF] text-white font-bold uppercase text-xs hover:bg-[#1047BF] cursor-pointer"
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
      <section className="py-16 lg:py-20 px-5 lg:px-10 border-b border-slate-200 bg-[#F4F7FB]">
        <div className="mx-auto max-w-[1440px]">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#155EEF] block mb-2">
              Deployment Domains
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold uppercase text-slate-900 tracking-tight">
              Where Physical AI Delivers Measurable ROI
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              Traditional fixed robot trajectories fail when parts vary in orientation, flex, or surface finish. Physical AI adapts autonomously.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4 hover:border-[#155EEF]/50 transition-colors shadow-xs">
              <span className="inline-block text-[10px] font-mono uppercase font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                Automotive &amp; EV Battery
              </span>
              <h3 className="font-display text-xl font-bold uppercase text-slate-900">
                Prismatic Cell Busbar Laser Fastening
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Adaptive 3D visual servoing locating individual battery cell terminals subject to thermal manufacturing expansion tolerances. Automatically offsets laser toolhead trajectory with ±0.01mm repeatability.
              </p>
              <div className="pt-2 border-t border-slate-100 text-[11px] font-mono text-slate-600">
                Takt Time Reduction: <strong className="text-slate-900">32%</strong> &bull; Zero Scrap
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4 hover:border-[#155EEF]/50 transition-colors shadow-xs">
              <span className="inline-block text-[10px] font-mono uppercase font-bold text-[#155EEF] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                High-Mix Electronics
              </span>
              <h3 className="font-display text-xl font-bold uppercase text-slate-900">
                Random Bin Picking &amp; Wire Harness Insertion
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Grounded 3D point cloud segmentation separating tangled, reflective flexible wire harnesses. Bi-RRT planners prevent singularity binding during tight electrical enclosure insertions.
              </p>
              <div className="pt-2 border-t border-slate-100 text-[11px] font-mono text-slate-600">
                Zero Dedicated Fixturing Required
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4 hover:border-[#155EEF]/50 transition-colors shadow-xs">
              <span className="inline-block text-[10px] font-mono uppercase font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-200">
                Precision Furniture &amp; Joinery
              </span>
              <h3 className="font-display text-xl font-bold uppercase text-slate-900">
                Adaptive Mortise &amp; Tenon Assembly
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Real-time 3D point clouds detect grain deviations and warpage, modulating insertion force dynamically to prevent cracking or joint jamming.
              </p>
              <div className="pt-2 border-t border-slate-100 text-[11px] font-mono text-slate-600">
                Force Threshold Guard: <strong className="text-slate-900">12.5 N max</strong>
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
