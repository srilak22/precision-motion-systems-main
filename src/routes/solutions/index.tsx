import React, { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Activity,
  Bot,
  Factory,
  Boxes,
  Target,
  Wrench,
  ChevronRight,
  CheckCircle2,
  ShieldCheck,
  Search,
  Cpu,
  Layers,
  Settings2,
  Eye,
  Sliders,
  Check,
  Workflow,
  Sparkles,
  PhoneCall,
  Calendar,
  FileText,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { solutionsData, type SolutionItem } from "@/data/solutions";
import { images } from "@/lib/images";
import { companyConfig } from "@/data/config";
import { useModals } from "@/components/modals/ModalContext";
import { buildSeoMeta } from "@/lib/seo";
import heroProductionImage from "@/assets/hero/hero-production-line.jpg";

export const Route = createFileRoute("/solutions/")({
  head: () =>
    buildSeoMeta({
      title: "Engineered Turnkey Solutions | INDUS Industrial Robotics",
      description:
        "Engineered automation and motion systems: Motion Control, Robotic Automation, Machine Integration, Material Handling, Precision Positioning, and Custom Engineering.",
      path: "/solutions",
    }),
  component: SolutionsIndexPage,
});

// Solution-specific imagery mapping to verified local photographic assets
const SOLUTION_IMAGE_MAP: Record<string, string> = {
  "motion-control": images.motionController,
  "robotic-automation": images.weldingRobot,
  "machine-integration": images.plcAutomation,
  "material-handling": images.palletizingRobot,
  "precision-positioning": images.rotaryEncoder,
  "custom-engineering": images.servoActuator,
};

// Solution icons
const SOLUTION_ICONS: Record<string, React.ElementType<{ size?: number; className?: string }>> = {
  "motion-control": Activity,
  "robotic-automation": Bot,
  "machine-integration": Factory,
  "material-handling": Boxes,
  "precision-positioning": Target,
  "custom-engineering": Wrench,
};

// Section C: Engineering Capabilities with verified delivery status
interface EngineeringCapability {
  id: string;
  title: string;
  category: "Direct In-House Engineering" | "Partner & Specialized Hardware";
  status: "Directly Offered" | "Engineered with Certified Partners";
  description: string;
  technologies: string[];
  deliverables: string[];
  icon: React.ElementType<{ size?: number; className?: string }>;
}

const ENGINEERING_CAPABILITIES: EngineeringCapability[] = [
  {
    id: "cap-motion",
    title: "Mechanical & Motion-System Engineering",
    category: "Direct In-House Engineering",
    status: "Directly Offered",
    description: "Multi-axis kinematics sizing, dynamic inertia ratio matching (JL/JM < 10:1), and high-rigidity structural frame design.",
    technologies: ["Bode plot resonance analysis", "S-curve jerk profiling", "Thermal expansion modeling"],
    deliverables: ["Motor & gearbox sizing calculations", "3D CAD space claim envelope", "Torsional stiffness analysis"],
    icon: Sliders,
  },
  {
    id: "cap-robotics",
    title: "Robot Selection & Application Engineering",
    category: "Direct In-House Engineering",
    status: "Directly Offered",
    description: "Kinematic reach evaluation, wrist moment of inertia calculations, singular pose avoidance, and cycle takt simulation.",
    technologies: ["3D physics cycle simulation", "ISO 9283 kinematics verification", "7th-axis floor track extension"],
    deliverables: ["Reach study report", "Takt time breakdown chart", "Singularity-free robot trajectory code"],
    icon: Bot,
  },
  {
    id: "cap-controls",
    title: "Servo & Multi-Axis Synchronized Control",
    category: "Direct In-House Engineering",
    status: "Directly Offered",
    description: "Sub-microsecond bus synchronization across multi-axis master IPCs running real-time CiA 402 drive profiles.",
    technologies: ["EtherCAT Distributed Clocks (DC)", "PROFINET IRT deterministic loops", "Dual-loop load position feedback"],
    deliverables: ["Real-time PLC/motion kernel code", "Notch filter frequency tuning", "Trajectory timing verification"],
    icon: Activity,
  },
  {
    id: "cap-integration",
    title: "PLC, HMI & Industrial Network Integration",
    category: "Direct In-House Engineering",
    status: "Directly Offered",
    description: "Interfacing disparate OEM machines, Siemens/Rockwell/Beckhoff controllers, fieldbus gateways, and centralized touch HMIs.",
    technologies: ["EtherNet/IP, PROFINET, EtherCAT, Modbus TCP", "OPC UA (IEC 62541)", "Centralized recipe databases"],
    deliverables: ["EPLAN electrical schematics", "HMI visualization screens", "Interlock state machine diagrams"],
    icon: Factory,
  },
  {
    id: "cap-vision",
    title: "Machine Vision & Optical Metrology",
    category: "Partner & Specialized Hardware",
    status: "Engineered with Certified Partners",
    description: "2D/3D part localization, robotic visual servoing, laser profile measurement, and automated defect inspection.",
    technologies: ["Telecentric optical gauging", "Structured 3D blue-laser profiling", "Automated hand-eye calibration"],
    deliverables: ["Camera mounting fixtures & optics", "Lighting enclosure geometry", "Pass/Fail inspection recipes"],
    icon: Eye,
  },
  {
    id: "cap-safety",
    title: "End-of-Arm Tooling & Safety Integration",
    category: "Direct In-House Engineering",
    status: "Directly Offered",
    description: "Custom vacuum/electric grippers, quick tool changers, safety interlocks, and dynamic area scanners conforming to ISO 13849-1.",
    technologies: ["ISO 10218-1/2 & ISO 13849-1 Cat 4 PLe", "FailSafe over EtherCAT (FSoE)", "Dual-channel emergency stop loops"],
    deliverables: ["Formal risk assessment document", "Safety circuit wiring diagrams", "Gripper clamping test logs"],
    icon: ShieldCheck,
  },
];

// Section D: 8-Stage Engineering Project Lifecycle
interface ProjectLifecycleStage {
  stageNumber: string;
  title: string;
  duration: string;
  description: string;
  activities: string[];
  outputMilestone: string;
}

const PROJECT_LIFECYCLE_STAGES: ProjectLifecycleStage[] = [
  {
    stageNumber: "01",
    title: "Application Discovery",
    duration: "Week 1",
    description: "On-site or virtual discovery session analyzing part CAD, required cycle takt, factory floor space, and electrical supply constraints.",
    activities: [
      "Workpiece geometry and mass review",
      "Production throughput target confirmation",
      "Utility interface boundary definition",
    ],
    outputMilestone: "Engineering Statement of Work (SOW)",
  },
  {
    stageNumber: "02",
    title: "Kinematic Feasibility & Simulation",
    duration: "Weeks 2–3",
    description: "3D digital twin simulation analyzing robot reach, dynamic payload inertia at wrist flange, cycle timing, and obstacle clearance.",
    activities: [
      "3D kinematic simulation modeling",
      "Wrist torque/inertia margin validation",
      "Singular region and pinch-point check",
    ],
    outputMilestone: "Preliminary Design Review (PDR) Sign-Off",
  },
  {
    stageNumber: "03",
    title: "System Architecture & Sizing",
    duration: "Weeks 3–4",
    description: "Detailed component sizing for servo motors, reducers, fieldbus master, power supplies, and safety interlock controllers.",
    activities: [
      "Reflected motor-to-load inertia sizing",
      "Fieldbus cycle time and network topology",
      "BOM component selection freeze",
    ],
    outputMilestone: "Hardware Architecture Specification",
  },
  {
    stageNumber: "04",
    title: "Mechanical & Electrical Design",
    duration: "Weeks 5–7",
    description: "Complete 3D mechanical CAD drafting of cell framing, custom EOAT fixtures, and EPLAN electrical/pneumatics wiring schematics.",
    activities: [
      "FEA structural deflection simulation",
      "EPLAN panel schematics drafting",
      "Safety circuit dual-channel mapping",
    ],
    outputMilestone: "Critical Design Review (CDR) & Release for Build",
  },
  {
    stageNumber: "05",
    title: "Software & Virtual Commissioning",
    duration: "Weeks 8–9",
    description: "PLC ladder, motion kernel, HMI screens, and safety PLC logic development; tested against digital simulation before physical wiring.",
    activities: [
      "Motion trajectory and E-CAM programming",
      "Fault tree and alarm diagnostics setup",
      "Virtual hardware-in-the-loop validation",
    ],
    outputMilestone: "Verified Software Base Build",
  },
  {
    stageNumber: "06",
    title: "Cell Assembly & Factory Acceptance (FAT)",
    duration: "Weeks 10–12",
    description: "Physical assembly, mechanical alignment, wiring, and pre-commissioning run in INDUS integration facility with customer workpieces.",
    activities: [
      "Point-to-point electrical wire ringing",
      "Continuous 50-cycle dry run at full speed",
      "Safety interlock trip timing audit",
    ],
    outputMilestone: "Customer-Witnessed FAT Certificate",
  },
  {
    stageNumber: "07",
    title: "On-Site Commissioning (SAT)",
    duration: "Weeks 13–14",
    description: "Installation onto customer factory floor, utility connection, leveling, calibration, and integrated line handshaking verification.",
    activities: [
      "Floor anchoring and laser coordinate zeroing",
      "Upstream/downstream machine handshakes",
      "Full shift production ramp-up run",
    ],
    outputMilestone: "Site Acceptance Testing (SAT) Handover",
  },
  {
    stageNumber: "08",
    title: "Lifecycle Support & Telemetry",
    duration: "Ongoing",
    description: "Operator and maintenance staff training, preventative maintenance schedules, spare parts provision, and optional remote telemetry.",
    activities: [
      "Operator teach pendant training",
      "Scheduled lube and bearing inspections",
      "OPC UA condition telemetry monitoring",
    ],
    outputMilestone: "Production Warranty & Operations Manual",
  },
];

// Section E: Industries and verified route mappings
const RELEVANT_INDUSTRIES = [
  {
    name: "Automotive & Electric Vehicles",
    slug: "automotive",
    href: "/applications/automotive",
    description: "Body-in-White welding, EV battery module assembly, and high-duty powertrain machining.",
    highlight: "High-Throughput Continuous Duty",
  },
  {
    name: "Electronics & Semiconductor",
    slug: "electronics",
    href: "/applications/electronics",
    description: "Cleanroom wafer transfer, micro-insertion, optical inspection, and wire bonding.",
    highlight: "Sub-Micron Cleanroom Precision",
  },
  {
    name: "Aerospace & Defense",
    slug: "aerospace",
    href: "/applications/aerospace",
    description: "Structural drilling, composite laying, laser seam inspection, and gimbal pods.",
    highlight: "High-Rigidity Zero Backlash",
  },
  {
    name: "Metal Machining & Tooling",
    slug: "metalMachining",
    href: "/applications/metalMachining",
    description: "CNC machine tool automated loading, 5-axis mill indexing, and deburring cells.",
    highlight: "Heavy Shock Load Resistance",
  },
  {
    name: "Warehouse & Logistics",
    slug: "warehousing",
    href: "/applications/warehousing",
    description: "Robotic palletizing, mixed-SKU carton singulation, and fleet-managed AMR delivery.",
    highlight: "24/7 Continuous Intralogistics",
  },
  {
    name: "Medical Devices & Cleanroom",
    slug: "medical",
    href: "/applications/medical",
    description: "Catheter laser micromanufacturing, surgical joint modules, and pharmaceutical packing.",
    highlight: "ISO Class 5/6 Compatible",
  },
];

// Section F: Related verified product lines
const RELATED_PRODUCT_FAMILIES = [
  {
    categoryTitle: "Control & Drives",
    route: "/products/control-drives",
    description: "Deterministic master IPCs, 64-axis motion controllers, and servo amplifiers.",
    featuredProduct: "IND-CTL 64-Axis Deterministic EtherCAT Master",
    featuredHref: "/products/control-drives/ind-ctl-64axis-ethercat-motion",
    techBadge: "250 µs Cycle Jitter < 1 µs",
  },
  {
    categoryTitle: "Motion & Actuation",
    route: "/products/motion-actuation",
    description: "Zero-backlash strain-wave harmonic reducers and high-torque cycloidal drives.",
    featuredProduct: "IND-PR-SW100 Cup Strain-Wave Reducer",
    featuredHref: "/products/motion-actuation/ind-pr-sw-cup-set",
    techBadge: "Zero Backlash (< 0.1 arcmin)",
  },
  {
    categoryTitle: "Robotic Systems",
    route: "/products/robotic-systems",
    description: "Heavy-payload articulated arms, high-speed SCARAs, and collaborative manipulators.",
    featuredProduct: "Heavy Palletizing Cobot Arm (20kg Payload)",
    featuredHref: "/products/robotic-systems/ind-rob-cobot-20kg-pallet",
    techBadge: "ISO 10218-1 Certified",
  },
  {
    categoryTitle: "Mobility Systems",
    route: "/products/mobility-systems",
    description: "Autonomous Mobile Robot (AMR) chassis, powered roller top decks, and lift modules.",
    featuredProduct: "500kg Omnidirectional AMR Mobile Chassis",
    featuredHref: "/products/mobility-systems/ind-mob-chassis-amr-500",
    techBadge: "Natural LiDAR SLAM",
  },
];

export function SolutionsIndexPage() {
  const { openModal } = useModals();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSolutions = useMemo(() => {
    if (!searchQuery.trim()) return solutionsData;
    const q = searchQuery.toLowerCase().trim();
    return solutionsData.filter(
      (sol) =>
        sol.title.toLowerCase().includes(q) ||
        sol.heroSubtitle.toLowerCase().includes(q) ||
        sol.shortDescription.toLowerCase().includes(q) ||
        sol.technologiesUsed.some((t) => t.toLowerCase().includes(q)) ||
        sol.typicalApplications.some((a) => a.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const scrollToSolutions = () => {
    const el = document.getElementById("explore-solutions");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToEnquiry = () => {
    const el = document.getElementById("engineering-enquiry");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* SECTION A: HERO */}
      <section className="relative border-b border-slate-200/90 bg-gradient-to-b from-slate-50 via-white to-slate-50/50 px-4 py-12 sm:py-16 lg:px-8 overflow-hidden">
        {/* Subtle engineering grid background */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(to right, #E2E8F0 1px, transparent 1px), linear-gradient(to bottom, #E2E8F0 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative mx-auto max-w-[1440px]">
          {/* Breadcrumb Navigation */}
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500"
          >
            <Link to="/" className="hover:text-[#155EEF] transition-colors">
              Home
            </Link>
            <ChevronRight size={13} className="text-slate-300" />
            <span className="text-[#155EEF] font-bold">Solutions</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 max-w-3xl">
              {/* Badges */}
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-md border border-blue-200 bg-blue-50/80 px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF]">
                  <ShieldCheck size={13} />
                  <span>Turnkey Industrial Automation</span>
                </span>
                <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-100/80 px-2 py-1 text-[10px] font-mono font-semibold uppercase text-slate-600">
                  <Layers size={12} className="text-slate-500" />
                  <span>6 Core Engineering Disciplines</span>
                </span>
                <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-100/80 px-2 py-1 text-[10px] font-mono font-semibold uppercase text-slate-600">
                  <span>EtherCAT CoE Sync &lt; 1 µs</span>
                </span>
              </div>

              {/* Headline */}
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-slate-900 leading-tight">
                Industrial Automation &amp; Engineered Kinematic Systems
              </h1>

              {/* Customer Problem & Solution Description */}
              <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
                INDUS bridges the gap between catalog automation hardware and functional shopfloor machinery. 
                We engineer deterministic multi-axis motion, turnkey robotic cells, fieldbus communication, 
                and custom drivetrains to eliminate takt bottlenecks, reduce changeover downtime, and guarantee zero-defect repeatability.
              </p>

              {/* Engineering Scope Summary Points */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="text-[#155EEF] shrink-0 mt-0.5" />
                  <span>Sub-microsecond multi-axis bus synchronization</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="text-[#155EEF] shrink-0 mt-0.5" />
                  <span>ISO 10218-1/2 &amp; ISO 13849-1 Cat 4 PLe cell safety</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="text-[#155EEF] shrink-0 mt-0.5" />
                  <span>Multi-vendor PLC bridging (Siemens, Rockwell, Beckhoff)</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="text-[#155EEF] shrink-0 mt-0.5" />
                  <span>Direct-drive sub-micron metrology stages</span>
                </div>
              </div>

              {/* CTA Row */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button
                  onClick={scrollToEnquiry}
                  className="h-11 rounded-lg bg-[#155EEF] px-6 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-[#1047BF] transition-colors"
                >
                  <PhoneCall size={14} className="mr-2" />
                  Discuss Your Application
                </Button>
                <Button
                  variant="outline"
                  onClick={scrollToSolutions}
                  className="h-11 rounded-lg border-slate-300 bg-white px-5 text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  Explore 6 Core Solutions
                  <ArrowRight size={14} className="ml-2" />
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => openModal("consultation")}
                  className="h-11 text-xs font-semibold text-slate-600 hover:text-[#155EEF]"
                >
                  <Calendar size={14} className="mr-1.5" />
                  Schedule Virtual Discovery
                </Button>
              </div>
            </div>

            {/* Right Visual Column */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl border border-slate-200/90 bg-white p-3 shadow-xl overflow-hidden group">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-100">
                  <img
                    src={heroProductionImage}
                    alt="INDUS Industrial Robotics Turnkey Automated Production Line"
                    className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                  
                  {/* Floating technical HUD overlay */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center justify-between text-[11px] font-mono font-medium text-blue-200 mb-1">
                      <span>INTEGRATED WORKCELL ARCHITECTURE</span>
                      <span>ISO 9283 VERIFIED</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-snug">
                      High-throughput automated assembly cell with multi-axis trajectory synchronization and dual-channel safety perimeter.
                    </p>
                  </div>
                </div>

                {/* Sub-strip specifications */}
                <div className="mt-3 grid grid-cols-3 divide-x divide-slate-100 py-1 text-center font-mono">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">Sync Jitter</div>
                    <div className="text-xs font-bold text-slate-900 mt-0.5">&lt; 1.0 µs</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">Safety Rating</div>
                    <div className="text-xs font-bold text-slate-900 mt-0.5">Cat 4 PLe</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">Fieldbus</div>
                    <div className="text-xs font-bold text-slate-900 mt-0.5">EtherCAT / PN</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION B: EXPLORE 6 CORE SOLUTIONS */}
      <section id="explore-solutions" className="px-4 py-16 lg:px-8 border-b border-slate-200/80 bg-white">
        <div className="mx-auto max-w-[1440px]">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#155EEF]">
                Domain Engineering Taxonomy
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-slate-900 mt-1">
                Explore The Six Solution Areas
              </h2>
              <p className="text-sm text-slate-600 max-w-2xl mt-2">
                Each solution represents an integrated engineering package combining precision mechanics, 
                servo drives, real-time control software, and verified testing protocols.
              </p>
            </div>

            {/* Filter Search Input */}
            <div className="relative w-full md:w-72">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search solutions, bus, specs..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-4 text-xs font-medium text-slate-900 placeholder-slate-400 transition-colors focus:border-[#155EEF] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Solution Cards Grid (6 High-Density Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSolutions.map((solution) => {
              const Icon = SOLUTION_ICONS[solution.id] || Activity;
              const cardImage = SOLUTION_IMAGE_MAP[solution.id] || images.components;

              return (
                <div
                  key={solution.id}
                  className="group flex flex-col rounded-2xl border border-slate-200/90 bg-white shadow-sm hover:border-[#155EEF]/50 hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  {/* Card Visual Header with Verified Solution Image */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                    <img
                      src={cardImage}
                      alt={`${solution.title} industrial automation visual`}
                      className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/10 to-transparent" />
                    
                    {/* Top Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-white/95 px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[#155EEF] shadow-sm backdrop-blur-sm">
                        <Icon size={12} />
                        <span>{solution.id}</span>
                      </span>
                    </div>

                    {/* Bottom Title on Image */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="font-display text-lg font-bold uppercase tracking-tight text-white drop-shadow-sm">
                        {solution.title}
                      </h3>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="flex flex-1 flex-col p-5">
                    {/* Industrial Problem Addressed */}
                    <div className="mb-4">
                      <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                        Industrial Problem Addressed
                      </div>
                      <p className="mt-1 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {solution.challenge?.description || solution.shortDescription}
                      </p>
                    </div>

                    {/* Typical System Scope */}
                    <div className="mb-4 rounded-lg bg-slate-50 p-3 border border-slate-100">
                      <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-2">
                        Typical System Scope
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {solution.systemScope?.included?.slice(0, 3).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-[#155EEF] font-bold text-xs leading-none mt-0.5">•</span>
                            <span className="line-clamp-1">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Typical Applications Tags */}
                    <div className="mb-5">
                      <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Target Applications
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {solution.typicalApplications?.slice(0, 3).map((app, idx) => (
                          <span
                            key={idx}
                            className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600"
                          >
                            {app.split(" ")[0]} {app.split(" ")[1] || ""}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Link Button */}
                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                      <Link
                        to="/solutions/$solutionId"
                        params={{ solutionId: solution.id }}
                        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#155EEF] hover:text-[#1047BF] transition-colors group-hover:translate-x-0.5"
                      >
                        <span>View Solution Engineering</span>
                        <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => openModal("quote", {
                          productName: `${solution.title} System Solution`,
                          categoryName: solution.title,
                          initialMessage: `Requesting engineering feasibility and preliminary quotation for ${solution.title}.`,
                        })}
                        className="text-[11px] font-medium text-slate-500 hover:text-slate-800 transition-colors"
                      >
                        RFQ
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION C: ENGINEERING CAPABILITIES */}
      <section className="px-4 py-16 lg:px-8 border-b border-slate-200/80 bg-slate-50/60">
        <div className="mx-auto max-w-[1440px]">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#155EEF]">
              Direct In-House &amp; Partner Delivery
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-slate-900 mt-1">
              Engineering Capabilities &amp; System Integration
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Every INDUS solution is backed by clearly defined engineering domains. We distinguish 
              directly offered in-house competencies from specialized hardware delivered through certified manufacturer partners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ENGINEERING_CAPABILITIES.map((cap) => {
              const Icon = cap.icon;
              const isDirect = cap.status === "Directly Offered";

              return (
                <div
                  key={cap.id}
                  className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-sm hover:border-slate-300 transition-all flex flex-col"
                >
                  {/* Category Status Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="size-10 rounded-lg bg-blue-50 border border-blue-100 text-[#155EEF] flex items-center justify-center">
                      <Icon size={20} />
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider ${
                        isDirect
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-blue-50 text-blue-700 border border-blue-200"
                      }`}
                    >
                      <Check size={10} />
                      {cap.status}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-display text-base font-bold text-slate-900 leading-snug">
                    {cap.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {cap.description}
                  </p>

                  {/* Core Technologies */}
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="text-[10px] font-mono font-bold uppercase text-slate-400 mb-1.5">
                      Applied Technologies
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {cap.technologies.map((tech, idx) => (
                        <span key={idx} className="rounded bg-slate-100 px-2 py-0.5 text-[10px] text-slate-700 font-medium">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Expected Engineering Deliverables */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="text-[10px] font-mono font-bold uppercase text-slate-400 mb-1.5">
                      Customer Deliverables
                    </div>
                    <ul className="space-y-1 text-[11px] text-slate-600">
                      {cap.deliverables.map((del, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <CheckCircle2 size={11} className="text-[#155EEF] shrink-0" />
                          <span>{del}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION D: HOW PROJECTS PROGRESS (8-Stage Engineering Project Lifecycle) */}
      <section className="px-4 py-16 lg:px-8 border-b border-slate-200/80 bg-white">
        <div className="mx-auto max-w-[1440px]">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#155EEF]">
              Structured Delivery Roadmap
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-slate-900 mt-1">
              Engineering Project Lifecycle &amp; Quality Gates
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Industrial automation projects carry operational risk. We manage this through a transparent, 
              stage-gated engineering process where every phase concludes with measurable customer verification.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PROJECT_LIFECYCLE_STAGES.map((step) => (
              <div
                key={step.stageNumber}
                className="relative rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-[#155EEF]/50 transition-all flex flex-col"
              >
                {/* Stage Header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-2xl font-black text-slate-200">
                    {step.stageNumber}
                  </span>
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-mono font-bold uppercase text-slate-600">
                    {step.duration}
                  </span>
                </div>

                {/* Stage Title */}
                <h3 className="text-sm font-bold text-slate-900">
                  {step.title}
                </h3>

                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  {step.description}
                </p>

                {/* Key Activities */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1">
                  {step.activities.map((act, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-600">
                      <span className="text-[#155EEF] font-bold">•</span>
                      <span>{act}</span>
                    </div>
                  ))}
                </div>

                {/* Output Milestone Box */}
                <div className="mt-auto pt-4">
                  <div className="rounded-md bg-blue-50/80 p-2 text-[10px] font-mono font-bold text-[#155EEF] border border-blue-100/80">
                    Gate: {step.outputMilestone}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION E: INDUSTRIES & APPLICATIONS */}
      <section className="px-4 py-16 lg:px-8 border-b border-slate-200/80 bg-slate-50/50">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-slate-200/60">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#155EEF]">
                Verified Production Contexts
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-slate-900 mt-1">
                Supported Industries &amp; Factory Scenarios
              </h2>
              <p className="text-sm text-slate-600 mt-1 max-w-2xl">
                Our solutions are deployed across regulated and high-throughput sectors with verified compliance standards.
              </p>
            </div>
            <Link
              to="/applications"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#155EEF] hover:text-[#1047BF] transition-colors"
            >
              <span>Explore All 18 Application Sectors</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {RELEVANT_INDUSTRIES.map((ind) => (
              <Link
                key={ind.slug}
                to={ind.href as never}
                className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-[#155EEF]/50 hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-mono font-bold text-[#155EEF] border border-blue-100">
                      {ind.highlight}
                    </span>
                    <ArrowRight size={13} className="text-slate-300 group-hover:text-[#155EEF] transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#155EEF] transition-colors">
                    {ind.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {ind.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-[#155EEF] flex items-center gap-1">
                  <span>View Industry Kinematics</span>
                  <ChevronRight size={12} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION F: RELATED PRODUCTS & SUBSYSTEMS */}
      <section className="px-4 py-16 lg:px-8 border-b border-slate-200/80 bg-white">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-slate-200/60">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#155EEF]">
                Standardized Hardware Building Blocks
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-slate-900 mt-1">
                Connected Product Families
              </h2>
              <p className="text-sm text-slate-600 mt-1 max-w-2xl">
                Every custom system is built from verified, interchangeable components in the INDUS product catalogue.
              </p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#155EEF] hover:text-[#1047BF] transition-colors"
            >
              <span>View Full 164-Range Catalogue</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {RELATED_PRODUCT_FAMILIES.map((prod) => (
              <div
                key={prod.categoryTitle}
                className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-[#155EEF]/50 transition-all justify-between"
              >
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Component Category
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    {prod.categoryTitle}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {prod.description}
                  </p>

                  <div className="mt-4 rounded-lg bg-slate-50 p-2.5 border border-slate-100">
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-1">
                      Featured Range
                    </span>
                    <Link
                      to={prod.featuredHref as never}
                      className="text-xs font-bold text-slate-900 hover:text-[#155EEF] transition-colors line-clamp-1"
                    >
                      {prod.featuredProduct}
                    </Link>
                    <span className="inline-block mt-1 text-[10px] font-mono text-[#155EEF]">
                      {prod.techBadge}
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100">
                  <Link
                    to={prod.route as never}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#155EEF] hover:text-[#1047BF]"
                  >
                    <span>Browse Category</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION G: ENGINEERING ENQUIRY STRIP */}
      <section id="engineering-enquiry" className="px-4 py-16 lg:px-8 bg-slate-900 text-white">
        <div className="mx-auto max-w-[1440px]">
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-8 sm:p-12 relative overflow-hidden">
            {/* Background glowing gradient */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#155EEF]/20 blur-3xl" />

            <div className="relative z-10 max-w-3xl">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#155EEF]">
                Application Review &amp; Feasibility
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-bold uppercase tracking-tight text-white mt-1">
                Discuss Your Engineering Requirements
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                To evaluate your automation project and provide an accurate feasibility assessment and 
                preliminary proposal, our engineering team requires basic mechanical and operational parameters.
              </p>

              {/* What Information Helps Assess a Project */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
                <div className="rounded-lg bg-slate-900/80 border border-slate-800 p-3">
                  <div className="font-mono font-bold text-white text-[11px] mb-1">
                    1. Workpiece &amp; Payload Envelope
                  </div>
                  <p className="text-slate-400">
                    Gross mass, geometry, center of gravity offset, material type, and surface condition.
                  </p>
                </div>
                <div className="rounded-lg bg-slate-900/80 border border-slate-800 p-3">
                  <div className="font-mono font-bold text-white text-[11px] mb-1">
                    2. Kinematic &amp; Takt Demands
                  </div>
                  <p className="text-slate-400">
                    Target cycle time per unit, stroke/travel distances, and required in-position repeatability.
                  </p>
                </div>
                <div className="rounded-lg bg-slate-900/80 border border-slate-800 p-3">
                  <div className="font-mono font-bold text-white text-[11px] mb-1">
                    3. Plant Environment &amp; Utilities
                  </div>
                  <p className="text-slate-400">
                    Available floor space footprint, electrical supply voltage, compressed air, and ambient temps.
                  </p>
                </div>
                <div className="rounded-lg bg-slate-900/80 border border-slate-800 p-3">
                  <div className="font-mono font-bold text-white text-[11px] mb-1">
                    4. Control &amp; Network Standards
                  </div>
                  <p className="text-slate-400">
                    Preferred master PLC brand, industrial fieldbus (EtherCAT, PROFINET), and safety level.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button
                  onClick={() => openModal("consultation")}
                  className="h-12 rounded-lg bg-[#155EEF] px-8 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#1047BF] transition-colors"
                >
                  <Calendar size={15} className="mr-2" />
                  Book Technical Discovery
                </Button>
                <Link
                  to="/contact/engineering-enquiry"
                  className="inline-flex h-12 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 px-6 text-xs font-bold uppercase tracking-wider text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <FileText size={15} className="mr-2" />
                  Submit Detailed Engineering Specs
                </Link>
                <a
                  href={companyConfig.getWhatsAppUrl({ type: "general" })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs font-bold text-emerald-400 hover:text-emerald-300 ml-2"
                >
                  Direct WhatsApp Engineering Desk →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
