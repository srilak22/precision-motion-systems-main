import React, { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Layers,
  Cpu,
  Move3d,
  Activity,
  Compass,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
  Eye,
  Sliders,
  Warehouse,
  Boxes,
  Factory,
  Check,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModals } from "@/components/modals/ModalContext";
import { companyConfig } from "@/data/config";
import { buildSeoMeta } from "@/lib/seo";
import { CtaBanner } from "@/components/common/CtaBanner";

export const Route = createFileRoute("/technology/robotics-ecosystem")({
  head: () =>
    buildSeoMeta({
      title: "Robotics Technology Ecosystem | INDUS Industrial Robotics",
      description:
        "Comprehensive robotics architecture covering Humanoids, AMRs, Collaborative Robots, AI Vision, Delta, Cartesian Gantries, Soft Robotics, and Multi-Robot Coordination.",
      path: "/technology/robotics-ecosystem",
    }),
  component: RoboticsEcosystemPage,
});

export interface EcosystemCategory {
  id: string;
  number: number;
  name: string;
  subtitle: string;
  description: string;
  coreCapabilities: string[];
  indusOpportunity: string;
  mechanicalComponents: string;
  controlArchitecture: string;
  sensorsAndFeedback: string;
  aiAndAutonomy: string;
  targetIndustries: string[];
  maturity: "Directly Offered Hardware" | "Engineering Co-Development" | "Active Research Architecture";
}

const ECOSYSTEM_CATEGORIES: EcosystemCategory[] = [
  {
    id: "humanoid",
    number: 1,
    name: "Humanoid Robotics",
    subtitle: "Bipedal locomotion, articulated hands & whole-body dynamics",
    description:
      "Robots engineered with human-like kinematic topology for unstructured human-designed environments. Demands extreme torque-density joints, low backlash, and compliant impact absorption.",
    coreCapabilities: [
      "Bipedal dynamic balance & zero-moment point (ZMP) control",
      "Dexterous multi-fingered articulated robotic hands",
      "Whole-body inverse dynamics with center-of-mass trajectory optimization",
      "Multimodal spatial perception & vision-language-action (VLA) grounding",
    ],
    indusOpportunity:
      "High torque-density frameless BLDC motors, ultra-compact strain-wave reducers (<1 arcmin), integrated joint torque modules, multi-axis force sensors, and dual 19-bit absolute encoders.",
    mechanicalComponents: "Cycloidal & harmonic reducers, carbon fiber structural links, titanium joint shafts",
    controlArchitecture: "Real-time 1kHz EtherCAT / CANopen DS402 cyclic synchronous torque (CST) loops",
    sensorsAndFeedback: "Joint torque sensors, IMU (Inertial Measurement Units), tactile fingertip arrays",
    aiAndAutonomy: "Reinforcement learning for locomotion, vision-language model task planning",
    targetIndustries: ["Automotive Final Assembly", "Hazardous Material Handling", "Logistics & Fulfillment"],
    maturity: "Engineering Co-Development",
  },
  {
    id: "amr",
    number: 2,
    name: "Autonomous Mobile Robots (AMR)",
    subtitle: "Natural LiDAR navigation, SLAM mapping & intelligent intralogistics",
    description:
      "Self-navigating mobile platforms transporting pallets, totes, and sub-assemblies without physical guide wires or magnetic floor tape. Adapts dynamically to human traffic and obstacles.",
    coreCapabilities: [
      "2D/3D LiDAR Natural Feature SLAM mapping",
      "Dynamic obstacle avoidance & recalculation in < 50ms",
      "Fleet-level mission queuing, dispatching, and automated opportunistic charging",
      "Dual-differential, steering module, or omnidirectional Mecanum drive kinematics",
    ],
    indusOpportunity:
      "Integrated drive wheels with high-torque brushless hub motors, planetary drive gearboxes, regenerative servo drives, lithium battery management, and safety radar integration.",
    mechanicalComponents: "Polyurethane drive wheels, heavy-duty suspension caster assemblies, structural chassis",
    controlArchitecture: "Industrial Edge IPC (Linux PREEMPT_RT), CANopen motor drives, safety PLC",
    sensorsAndFeedback: "Safety laser scanners (360° coverage), 3D obstacle ToF cameras, wheel encoders",
    aiAndAutonomy: "Topological map reasoning, fleet routing algorithms, dynamic pedestrian prediction",
    targetIndustries: ["Warehousing & Distribution", "Automotive Parts Sequencing", "Cleanroom Semiconductor"],
    maturity: "Directly Offered Hardware",
  },
  {
    id: "cobot",
    number: 3,
    name: "Advanced Collaborative Robots (Cobots)",
    subtitle: "ISO/TS 15066 power and force limiting for human-robot cells",
    description:
      "Robots engineered for safe operation alongside human operators without intrusive safety fencing. Incorporates real-time contact detection, compliant joint back-drivability, and intuitive hand guiding.",
    coreCapabilities: [
      "Joint-integrated torque sensing with < 0.1 Nm sensitivity",
      "ISO 10218-1/2 and ISO/TS 15066 safety-rated monitored stop & force limiting",
      "Zero-gravity hand-guiding teaching mode",
      "Plug-and-play tool interface with internal slip-ring pneumatic & digital routing",
    ],
    indusOpportunity:
      "Integrated servo joint modules (motor + harmonic reducer + dual encoder + drive in one sealed unit), dual-channel safety controllers, and electric adaptive grippers.",
    mechanicalComponents: "Hollow-shaft strain-wave gears, lightweight aluminum arm castings, ergonomic round profiles",
    controlArchitecture: "Category 3 / PLd dual-channel safety controller, 48V DC bus architecture",
    sensorsAndFeedback: "Torque sensors on all 6 axes, capacitive skin proximity detection, optical joint encoders",
    aiAndAutonomy: "Operator gesture recognition, speed and separation monitoring (SSM)",
    targetIndustries: ["Electronics Screwdriving", "Machine Tending", "Medical Device Packaging"],
    maturity: "Directly Offered Hardware",
  },
  {
    id: "vision-guided",
    number: 4,
    name: "AI Vision-Guided Robots",
    subtitle: "3D point cloud perception, random bin picking & visual servoing",
    description:
      "Manipulators equipped with high-resolution 2D and structured-light 3D cameras that detect part poses, identify surface defects, and compensate for un-fixtured component presentation.",
    coreCapabilities: [
      "3D point cloud segmentation & 6-DoF object pose estimation",
      "Random bin picking with collision-free grasp pose synthesis",
      "Real-time visual servoing with trajectory updates @ 60-120 Hz",
      "Automated optical inspection (AOI) with sub-pixel dimensional verification",
    ],
    indusOpportunity:
      "High-speed 3D stereo vision cameras, industrial edge GPU compute boxes, hollow-wrist cable management joints, and intelligent suction/magnetic end effectors.",
    mechanicalComponents: "Rigid anti-vibration robot mounting pedestals, precision hollow-wrist J6 flanges",
    controlArchitecture: "GigE Vision / GenICam interfaces, PCIe hardware-accelerated frame grabbers",
    sensorsAndFeedback: "Structured light depth sensors, laser line triangulation profilers, high-CRI illumination",
    aiAndAutonomy: "Convolutional neural networks for defect classification, 3D CAD matching neural nets",
    targetIndustries: ["Automotive Body Welding", "Metal Forging & Stamping", "Consumer Goods Packaging"],
    maturity: "Directly Offered Hardware",
  },
  {
    id: "delta",
    number: 5,
    name: "Delta and Parallel Robots",
    subtitle: "High-acceleration parallel kinematics for micro-second picking",
    description:
      "Parallel mechanical linkages where stationary base motors drive lightweight carbon fiber arms, delivering extreme acceleration (up to 15G) and throughput rates exceeding 180 picks per minute.",
    coreCapabilities: [
      "Parallel link kinematics with stationary motor mass",
      "Throughput speeds up to 180–200 picks per minute",
      "Conveyor dynamic tracking with encoder synchronization",
      "IP67 / IP69K washdown hygienic construction options",
    ],
    indusOpportunity:
      "Low-inertia brushless servo motors, precision zero-play universal ball joints, carbon-fiber composite arms, high-bandwidth motion controllers, and vacuum tooling.",
    mechanicalComponents: "Carbon-fiber composite tubular rods, spring-tensioned ceramic ball joints, stainless base",
    controlArchitecture: "Dedicated kinematic transformation firmware, multi-axis master synchronization",
    sensorsAndFeedback: "High-resolution optical absolute encoders, conveyor tracking line-encoders",
    aiAndAutonomy: "Dynamic conveyor load-balancing AI, multi-robot target assignment",
    targetIndustries: ["Food & Confectionery Packaging", "Pharmaceutical Blister Sorting", "Battery Tab Stacking"],
    maturity: "Directly Offered Hardware",
  },
  {
    id: "cartesian",
    number: 6,
    name: "Cartesian & Gantry Systems",
    subtitle: "High-rigidity orthogonal multi-axis motion for vast envelopes",
    description:
      "Rigid linear-motion architectures configured in X-Y-Z configurations spanning from small benchtop dispensing tables up to massive 12-meter overhead gantries moving automotive engines.",
    coreCapabilities: [
      "Orthogonal multi-axis linear interpolation with zero kinematic singularity",
      "Long-stroke travel envelopes up to 12m (X), 4m (Y), 2m (Z)",
      "High payload capacities up to 2,000 kg",
      "High axial thrust through ground ball screws or rack-and-pinion drives",
    ],
    indusOpportunity:
      "IND-ILA Intelligent Linear Actuators, heavy-duty linear guideways, precision helical planetary gearboxes, servo drive amplifiers, and integrated cable carrier tracks.",
    mechanicalComponents: "Preloaded ball screws, precision helical racks, extruded aluminum/steel gantry beams",
    controlArchitecture: "G-code / CNC interpolators, dual-motor gantry master-slave electronic gearing",
    sensorsAndFeedback: "Magnetic scale linear encoders (1μm resolution), inductive home/limit switches",
    aiAndAutonomy: "Dynamic vibration feedforward, thermal growth error mapping",
    targetIndustries: ["CNC Machine Tending", "Aerospace Panel Drilling", "Automated Palletizing"],
    maturity: "Directly Offered Hardware",
  },
  {
    id: "soft-robotics",
    number: 7,
    name: "Soft Robotics & Adaptive Grippers",
    subtitle: "Compliant elastomer fingers & gentle variable-force handling",
    description:
      "Gripping mechanisms utilizing flexible elastomeric fingers, variable pneumatic air bladders, or under-actuated mechanical joints that passively conform around delicate and irregular objects.",
    coreCapabilities: [
      "Passive geometric compliance preventing surface bruising or scratching",
      "Grip force modulation from 0.5 N (fragile fruit/glass) to 60 N",
      "Food-grade FDA silicone and washdown-safe materials",
      "Tactile sensing embedded within elastomer finger pads",
    ],
    indusOpportunity:
      "High-speed proportional digital pneumatic regulators, miniature vacuum ejectors, compliant gripper fingers, and multi-protocol I/O-Link sensor masters.",
    mechanicalComponents: "Elastomeric bellows, compliant flexure joints, quick-change ISO tool flanges",
    controlArchitecture: "High-speed piezo pneumatic valves, proportional pressure closed-loop control",
    sensorsAndFeedback: "Micro-electro-mechanical (MEMS) pressure sensors, optical tactile curvature sensors",
    aiAndAutonomy: "Auto-adaptive grasp force calculation based on visual surface classification",
    targetIndustries: ["Fresh Produce Packing", "Optics & Lens Assembly", "Bakery Handling"],
    maturity: "Directly Offered Hardware",
  },
  {
    id: "multi-robot",
    number: 8,
    name: "Multi-Robot Coordinated Systems",
    subtitle: "Synchronized dual-arm cells, 7th-axis floor rails & cooperative welding",
    description:
      "Integrated automation cells where two or more robots synchronize their trajectories with sub-millisecond precision, such as one robot manipulating a car frame while another welds seams simultaneously.",
    coreCapabilities: [
      "Sub-millisecond trajectory time synchronization over deterministic fieldbus",
      "Shared collision-free workspace management with dynamic zone interlocks",
      "Cooperative workpiece handoff without intermediate station clamping",
      "7th-axis floor rail and dual-axis positioner synchronized interpolation",
    ],
    indusOpportunity:
      "Heavy-duty 7th-axis linear transfer rail modules, precision rotary-tilt welding positioners, central multi-axis cell controllers, and synchronized safe zone software.",
    mechanicalComponents: "Hardened floor linear rail tracks, heavy slewing ring bearings, ground rack drives",
    controlArchitecture: "Multi-robot master PLC (Beckhoff TwinCAT / Siemens Simatic), OPC-UA TSN",
    sensorsAndFeedback: "Laser safety scanners with dynamic zoning, synchronized robot state telemetry",
    aiAndAutonomy: "Automated workcell cycle takt balancing, multi-agent collision avoidance",
    targetIndustries: ["Automotive Chassis Seam Welding", "Heavy Earthmover Fabrication", "Aerospace Fuselage Riveting"],
    maturity: "Directly Offered Hardware",
  },
];

function RoboticsEcosystemPage() {
  const { openModal } = useModals();
  const [selectedCat, setSelectedCat] = useState<EcosystemCategory>(ECOSYSTEM_CATEGORIES[0]);

  return (
    <div className="min-h-screen bg-[#0B111E] text-slate-100 font-sans selection:bg-[#16C7E8] selection:text-[#0B111E]">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden border-b border-white/10 pt-24 pb-20 px-5 lg:px-10">
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(35,136,255,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(35,136,255,0.2) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-[#2388FF]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-[1440px]">
          <nav className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400 mb-6">
            <Link to="/" className="hover:text-[#16C7E8] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/technology" className="hover:text-[#16C7E8] transition-colors">
              Technology Stack
            </Link>
            <span>/</span>
            <span className="text-[#16C7E8]">Robotics Ecosystem</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2388FF]/15 border border-[#2388FF]/30 text-[#2388FF] text-xs font-mono uppercase tracking-widest mb-4">
            <Bot size={13} className="text-[#16C7E8]" />
            <span>Comprehensive 8-Pillar Robotics Taxonomy</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold uppercase tracking-tight text-white leading-none">
            Robotics Technology Ecosystem
          </h1>
          <p className="text-xl sm:text-2xl font-light text-[#16C7E8] mt-3 font-display uppercase tracking-widest">
            From Humanoid Joint Dynamics to Multi-Robot Welding Cells
          </p>

          <p className="mt-6 max-w-3xl text-sm sm:text-base text-slate-300 leading-relaxed">
            INDUS develops, manufactures, and integrates motion subsystems across the entire spectrum
            of modern robotics. Explore our verified hardware architectures, component sizing guidelines,
            and research co-development roadmaps across 8 distinct industrial robot classifications.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              onClick={() => openModal("engineer", { categoryName: "Robotics Architecture Review" })}
              className="h-11 rounded-none bg-[#16C7E8] text-[#0B111E] font-bold uppercase hover:bg-[#16C7E8]/90 text-xs px-6 tracking-wider cursor-pointer"
            >
              <Cpu className="mr-2 size-4" /> Request Architectural Consultation
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-11 rounded-none border-white/20 bg-white/5 text-white hover:bg-white/10 text-xs uppercase font-bold tracking-wider"
            >
              <Link to="/technology/physical-ai">
                <Sparkles className="mr-2 size-4 text-[#16C7E8]" /> Inspect Physical AI Platform
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-11 rounded-none border-white/20 bg-white/5 text-white hover:bg-white/10 text-xs uppercase font-bold tracking-wider"
            >
              <Link to="/technology/motion-studio">
                <Move3d className="mr-2 size-4 text-[#2388FF]" /> Launch Motion Studio
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE 8-CATEGORY ECOSYSTEM EXPLORER */}
      <section className="py-20 px-5 lg:px-10 border-b border-white/10 bg-[#0F172A]/50">
        <div className="mx-auto max-w-[1440px]">
          {/* Category Tabs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 mb-12">
            {ECOSYSTEM_CATEGORIES.map((cat) => {
              const isSelected = selectedCat.id === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCat(cat)}
                  className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[96px] ${
                    isSelected
                      ? "bg-[#1E293B] border-[#16C7E8] text-white shadow-md ring-1 ring-[#16C7E8]"
                      : "bg-[#080D1A]/80 border-white/5 text-slate-400 hover:border-white/20 hover:text-white"
                  }`}
                >
                  <div className="text-[10px] font-mono text-[#16C7E8] font-bold">0{cat.number}</div>
                  <div className="font-display text-xs font-bold uppercase tracking-tight leading-snug line-clamp-2">
                    {cat.name}
                  </div>
                  <div className="text-[9px] font-mono text-slate-500 uppercase truncate">
                    {cat.maturity === "Directly Offered Hardware" ? "Production" : "Co-Dev"}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Category Deep-Dive Inspector Panel */}
          <div className="rounded-2xl border border-white/10 bg-[#080D1A] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
              <div>
                <div className="flex items-center gap-3">
                  <span className="size-8 rounded-lg bg-[#2388FF]/20 border border-[#2388FF]/40 text-[#16C7E8] flex items-center justify-center font-mono font-bold text-sm">
                    {selectedCat.number}
                  </span>
                  <h2 className="font-display text-3xl sm:text-4xl font-bold uppercase text-white tracking-tight">
                    {selectedCat.name}
                  </h2>
                </div>
                <p className="text-sm font-mono text-[#16C7E8] mt-1 pl-11">{selectedCat.subtitle}</p>
              </div>

              <div className="flex items-center gap-3 pl-11 lg:pl-0">
                <span
                  className={`text-xs font-mono px-3.5 py-1.5 rounded-full uppercase font-bold border ${
                    selectedCat.maturity === "Directly Offered Hardware"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : "bg-purple-500/10 text-purple-300 border-purple-500/30"
                  }`}
                >
                  {selectedCat.maturity}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Description & Capabilities */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold mb-2">
                    Architectural Overview
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed bg-[#0F172A] p-4 rounded-xl border border-white/5">
                    {selectedCat.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold mb-3">
                    Core Technical Capabilities
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedCat.coreCapabilities.map((cap, cIdx) => (
                      <div
                        key={cIdx}
                        className="rounded-lg border border-white/5 bg-[#0F172A]/70 p-3 text-xs text-slate-300 flex items-start gap-2.5"
                      >
                        <CheckCircle2 size={15} className="text-[#16C7E8] shrink-0 mt-0.5" />
                        <span className="leading-snug">{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* INDUS Opportunity Callout Box matching Image 5 */}
                <div className="rounded-xl border border-[#2388FF]/30 bg-gradient-to-r from-[#101B2D] to-[#16243A] p-5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#16C7E8] font-bold">
                    <Sparkles size={14} />
                    <span>INDUS Engineering Opportunity &amp; Supply Stack</span>
                  </div>
                  <p className="text-xs text-white leading-relaxed font-mono">
                    {selectedCat.indusOpportunity}
                  </p>
                </div>
              </div>

              {/* Right Column: Engineering Subsystems Matrix */}
              <div className="lg:col-span-5 space-y-4">
                <div className="rounded-xl border border-white/10 bg-[#0F172A] p-5 space-y-4 text-xs font-mono">
                  <h3 className="text-[11px] uppercase tracking-widest text-slate-400 font-bold border-b border-white/10 pb-2">
                    Subsystem Engineering Breakdown
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase">Mechanical Hardware:</span>
                      <span className="text-slate-200">{selectedCat.mechanicalComponents}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase">Control &amp; Fieldbus:</span>
                      <span className="text-emerald-400">{selectedCat.controlArchitecture}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase">Sensors &amp; Feedback:</span>
                      <span className="text-[#16C7E8]">{selectedCat.sensorsAndFeedback}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase">AI &amp; Autonomy Stack:</span>
                      <span className="text-purple-300">{selectedCat.aiAndAutonomy}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10">
                    <span className="text-slate-500 block text-[10px] uppercase mb-1.5">
                      Target Manufacturing Sectors:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCat.targetIndustries.map((ind, iIdx) => (
                        <span
                          key={iIdx}
                          className="rounded bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] text-slate-300"
                        >
                          {ind}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() =>
                      openModal("engineer", {
                        categoryName: `${selectedCat.name} Sizing`,
                        initialMessage: `Requesting component sizing and integration consultation for ${selectedCat.name}.`,
                      })
                    }
                    className="flex-1 rounded-none bg-[#16C7E8] text-[#0B111E] font-bold uppercase text-xs hover:bg-[#16C7E8]/90"
                  >
                    Discuss {selectedCat.name}
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-none border-white/20 bg-white/5 text-white hover:bg-white/10 text-xs uppercase font-bold"
                  >
                    <Link to="/products">
                      Explore Components
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CONNECTED CTA BANNER */}
      <div className="mx-auto max-w-[1440px] px-5 lg:px-10 py-12">
        <CtaBanner
          variant="precision"
          badge="ROBOTICS ARCHITECTURE CO-DEVELOPMENT"
          headline="Engineer Your Robot Platform with INDUS Subsystems"
          description="Whether building humanoid joints requiring extreme torque density or high-payload gantry transfer systems, our engineers in Chennai validate inertia ratios, thermal envelopes, and ISO 9283 repeatability."
          ctaPrimary={{
            label: "Book Application Sizing",
            href: "/book-consultation",
          }}
          ctaSecondary={{
            label: "Open Motion Studio",
            href: "/technology/motion-studio",
          }}
        />
      </div>
    </div>
  );
}
