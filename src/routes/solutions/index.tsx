import React, { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  Trash2,
  Stethoscope,
  Sprout,
  TrainTrack,
  HeartHandshake,
  Activity,
  Bot,
  Factory,
  Boxes,
  Target,
  Wrench,
  ChevronRight,
  CheckCircle2,
  ShieldCheck,
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
  Terminal,
  Truck,
  Zap,
  BarChart3,
  Gauge,
  Network,
  Compass,
  ArrowUpRight,
  Flame,
  Package,
  RefreshCw,
  Radio,
  HardDrive,
  Filter,
  Maximize2,
  X,
  ChevronDown,
  Lock,
  Server,
  Database,
  Crosshair,
  TrendingUp,
  Award,
  Globe2,
  Headphones,
  Search,
  CheckSquare,
  Microchip,
  Cable,
  Building2,
  Clock,
  Send,
  HelpCircle,
  Cog,
  Share2,
  Scan,
  Compass as CompassIcon,
  RotateCw,
  Binary,
  Layers3,
  Radar,
  LineChart,
  GitBranch,
  ShieldAlert,
  PlayCircle,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { images } from "@/lib/images";
import { useModals } from "@/components/modals/ModalContext";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/solutions/")({
  head: () =>
    buildSeoMeta({
      title: "Industrial Robotics & Intelligent Automation Solutions | Precision Motion Systems",
      description:
        "From fixed robotic workcells to autonomous factory ecosystems, Precision Motion Systems engineers enterprise automation solutions that improve productivity, quality, safety, and operational performance.",
      path: "/solutions",
    }),
  component: SolutionsIndexPage,
});

// ============================================================================
// DATA DEFINITIONS & STATIC DATA
// ============================================================================

// --- SECTION 2: 3 AUTOMATION CATEGORIES ---
interface AutomationCategory {
  id: "fixed" | "mobile" | "autonomous";
  letter: string;
  badge: string;
  title: string;
  tagline: string;
  description: string;
  accentColor: string;
  glowClass: string;
  borderClass: string;
  image: string;
  examples: string[];
  businessValue: string[];
  techStack: string[];
  kpis: { label: string; value: string }[];
}

const AUTOMATION_CATEGORIES: AutomationCategory[] = [
  {
    id: "fixed",
    letter: "01",
    badge: "KINEMATIC WORKCELLS & MECHATRONICS",
    title: "Fixed Robotic Automation",
    tagline: "Sub-millimeter repeatable precision for high-cadence production lines.",
    description:
      "Engineered robotic cells built for continuous, high-speed, and ultra-precise industrial manufacturing. We design turnkey robotic workcells integrated directly with your tooling and machine centers.",
    accentColor: "#00F0FF",
    glowClass: "from-[#00F0FF]/20 via-[#0062FF]/10 to-transparent",
    borderClass: "border-[#00F0FF]/40 hover:border-[#00F0FF]",
    image: images.weldingRobot,
    examples: [
      "Robotic Welding (MIG, TIG, Laser, Spot)",
      "Assembly Automation (Press-fit, Screwdriving, Pinning)",
      "CNC Machine Tending (Dual-gripper Lathe/Mill Loading)",
      "High-Speed Packaging & Case Packing",
      "End-of-Line Heavy Palletizing",
      "Painting & Surface Coating Automation",
    ],
    businessValue: [
      "Increased Throughput — 24/7 continuous duty cycles without cycle variation or fatigue",
      "Consistent Quality — Sub-millimeter weld seam tracking and force-calibrated assembly",
      "Reduced Labor Dependency — Offload heavy repetitive, toxic, and high-ergonomic-risk tasks",
    ],
    techStack: [
      "6-Axis Articulated Robots & 4-Axis SCARA arms",
      "Zero-backlash strain wave & cycloidal gearboxes",
      "Deterministic fieldbuses: EtherCAT, PROFINET IRT",
      "Laser seam tracking & 6-DOF force/torque sensing",
    ],
    kpis: [
      { label: "Repeatability", value: "±0.02 mm" },
      { label: "Cycle Acceleration", value: "Up to 3.2G" },
      { label: "Uptime Rating", value: "99.85%" },
    ],
  },
  {
    id: "mobile",
    letter: "02",
    badge: "INTRALOGISTICS & FLEET MOBILITY",
    title: "Mobile Robotic Automation",
    tagline: "Dynamic natural-feature navigation replacing rigid conveyors and manual forklifts.",
    description:
      "Autonomous Mobile Robots (AMRs) and Automated Guided Vehicles (AGVs) engineered to orchestrate seamless material flow between raw storage, work-in-progress kitting, and final dispatch lines.",
    accentColor: "#0062FF",
    glowClass: "from-[#0062FF]/25 via-[#00F0FF]/10 to-transparent",
    borderClass: "border-[#0062FF]/50 hover:border-[#0062FF]",
    image: images.mobile,
    examples: [
      "Autonomous Mobile Robots (AMRs with SLAM)",
      "Automated Guided Vehicles (Heavy-Payload AGVs)",
      "Line-Side Material Transport & Tuggers",
      "Warehouse Pallet & Tote Automation",
      "Multi-Agent Fleet Coordination (VDA 5050)",
      "Cross-Docking & Staging Transport",
    ],
    businessValue: [
      "Faster Material Movement — Rapid pull-based replenishment synchronized with MES schedules",
      "Reduced Bottlenecks — Dynamic path recalculation around floor obstacles without layout changes",
      "Improved Operational Flexibility — Reconfigurable virtual routes without physical tracks or floor tape",
    ],
    techStack: [
      "2D/3D Multi-Layer LiDAR SLAM Navigation",
      "ISO 3691-4 & SIL 2 Certified Safety Laser Scanners",
      "VDA 5050 Multi-Vendor Fleet Orchestration Protocols",
      "High-Torque Integrated BLDC Drive Wheels",
    ],
    kpis: [
      { label: "Payload Capacity", value: "50 - 2,500 kg" },
      { label: "Transit Speed", value: "Up to 2.2 m/s" },
      { label: "Collision Rate", value: "Zero Certified" },
    ],
  },
  {
    id: "autonomous",
    letter: "03",
    badge: "EDGE AI & COGNITIVE MANUFACTURING",
    title: "Autonomous Robotic Automation",
    tagline: "Self-governing, perception-driven systems powered by Industrial AI and Digital Twins.",
    description:
      "Cognitive robotics combining deep-learning computer vision, physics-based digital twin models, and predictive edge intelligence to deliver fully autonomous, self-optimizing factory environments.",
    accentColor: "#38BDF8",
    glowClass: "from-[#38BDF8]/20 via-[#00F0FF]/10 to-transparent",
    borderClass: "border-[#38BDF8]/40 hover:border-[#38BDF8]",
    image: images.edgeAiCompute,
    examples: [
      "AI Deep Learning Vision Inspection",
      "Predictive Maintenance & Vibration FFT Diagnostics",
      "Autonomous High-Density Smart Warehouses",
      "Autonomous Forklifts with 3D Spatial Perception",
      "Self-Balancing Smart Factory Ecosystems",
      "Closed-Loop Real-Time Process Optimization",
    ],
    businessValue: [
      "Real-Time Decision Making — Millisecond edge inference catches defects before value-add processes",
      "Self-Optimizing Operations — Autonomous parameter adjustments maintain target yield amidst drift",
      "Industry 4.0 Readiness — Seamless closed-loop synchronization from shop floor to enterprise ERP",
    ],
    techStack: [
      "NVIDIA Jetson / TensorRT Edge AI inference engines",
      "3D Stereoscopic & Structured Light Photometric Sensors",
      "OPC-UA Unified Namespace (UNS) & MQTT Sparkplug B",
      "ISO/IEC 62443 Industrial Cybersecurity Compliant",
    ],
    kpis: [
      { label: "Inference Latency", value: "< 4.5 ms" },
      { label: "Defect Detection", value: "99.98%" },
      { label: "Unplanned Stops", value: "-68%" },
    ],
  },
];

// --- SECTION 3: 15 INDUSTRY SOLUTIONS ---
interface IndustrySolution {
  id: string;
  name: string;
  sectorGroup: "Advanced Manufacturing" | "Process & Regulated" | "Logistics & Commerce" | "Heavy & Resources";
  icon: any;
  challenge: string;
  automationSolution: string;
  businessOutcome: string;
  keyTechnologies: string[];
  referenceMetric: string;
}

const INDUSTRY_SOLUTIONS: IndustrySolution[] = [
  {
    id: "automotive",
    name: "Automotive & EV",
    sectorGroup: "Advanced Manufacturing",
    icon: Factory,
    challenge:
      "Intense model cycle shifts, EV battery tray seal tolerances under 0.05mm, and rigid cycle time constraints under 48 seconds per vehicle chassis.",
    automationSolution:
      "Turnkey robotic welding cells, high-precision thermal paste dispensing gantry robots, and automated battery module pack-assembly lines with machine vision guidance.",
    businessOutcome:
      "38% reduction in cycle time, 100% automated bead inspection coverage, and sub-second defect flagging across 3 continuous shifts.",
    keyTechnologies: ["Laser Seam Tracking", "Multi-Axis Robot Arms", "Servo Dispensing", "EtherCAT Fieldbus"],
    referenceMetric: "+42% Line OEE",
  },
  {
    id: "electronics",
    name: "Electronics & SMT",
    sectorGroup: "Advanced Manufacturing",
    icon: Microchip,
    challenge:
      "Microscopic component pitch (01005 passives), fragile PCB flex circuits, and high electrostatic discharge (ESD) contamination vulnerabilities.",
    automationSolution:
      "Cleanroom-certified high-speed SCARA pick-and-place robots, automated screw driving with torque-angle telemetry, and in-line 3D AOI (Automated Optical Inspection).",
    businessOutcome:
      "Placement accuracy down to ±15 microns, zero mechanical crack damage, and 65% faster product changeover times.",
    keyTechnologies: ["Cleanroom SCARA", "Torque-Angle Telemetry", "3D AOI Machine Vision", "Anti-Static Tooling"],
    referenceMetric: "±15μm Precision",
  },
  {
    id: "semiconductor",
    name: "Semiconductor",
    sectorGroup: "Advanced Manufacturing",
    icon: Cpu,
    challenge:
      "Zero-particle tolerance (ISO Class 1), extreme vacuum handling requirements, and ultra-fragile 300mm silicon wafers valued over $50,000 each.",
    automationSolution:
      "Atmospheric and vacuum wafer handling robots with non-contact edge-grip end effectors, high-vacuum harmonic reducers, and SEMI S2/S8 compliant EFEMs.",
    businessOutcome:
      "Complete elimination of wafer micro-scratches, 99.999% particulate-free operation, and continuous 24/7 chamber transfer reliability.",
    keyTechnologies: ["SEMI Cleanroom EFEM", "Vacuum Dual-Arm Kinematics", "Non-Contact Bernoulli Grippers"],
    referenceMetric: "Class 1 Cleanroom",
  },
  {
    id: "aerospace",
    name: "Aerospace & Defense",
    sectorGroup: "Advanced Manufacturing",
    icon: CompassIcon,
    challenge:
      "Stringent AS9100 quality standards, massive titanium aerostructures, and tedious manual drilling of thousands of fastener holes per wing panel.",
    automationSolution:
      "Heavy-duty mobile drilling robots mounted on precision linear tracks, real-time laser photogrammetry positioning, and automated composite layup workcells.",
    businessOutcome:
      "5x faster hole-drilling throughput, zero oversized hole scrap, and 100% digital trace logs tied to aircraft tail numbers.",
    keyTechnologies: ["Track-Mounted 6-Axis Arms", "Photogrammetry Laser Metrology", "Closed-Loop Drilling Feeds"],
    referenceMetric: "5x Faster Drilling",
  },
  {
    id: "food-beverage",
    name: "Food & Beverage",
    sectorGroup: "Process & Regulated",
    icon: Package,
    challenge:
      "Aggressive high-pressure chemical washdowns (IP69K), perishable shelf-life constraints, and gentle handling of variable organic food shapes.",
    automationSolution:
      "Full stainless-steel IP69K delta pick-and-place packaging cells, soft adaptive food-grade vacuum grippers, and washdown robotic palletizers.",
    businessOutcome:
      "Hygiene audit pass rates at 100%, 140 picks/minute per delta robot, and immediate labor redeployment away from freezing cold rooms.",
    keyTechnologies: ["IP69K Stainless Delta Robots", "Food-Safe FDA Grippers", "High-Speed Washdown Conveyors"],
    referenceMetric: "140 Picks/Min",
  },
  {
    id: "pharmaceutical",
    name: "Pharmaceutical",
    sectorGroup: "Process & Regulated",
    icon: ShieldCheck,
    challenge:
      "Stringent FDA 21 CFR Part 11 electronic batch compliance, aseptic sterile isolator environments, and high risks of operator-induced vial contamination.",
    automationSolution:
      "Vaporized Hydrogen Peroxide (VHP) resistant robotic filling cells, automated vial syringe inspection, and serialized track-and-trace packaging robots.",
    businessOutcome:
      "Zero contamination recalls, automated digital batch record generation, and continuous aseptic production in sterile containment.",
    keyTechnologies: ["VHP-Resistant Robotics", "21 CFR Part 11 Audit Trail", "Hypodermic Vision Inspection"],
    referenceMetric: "Zero Contamination",
  },
  {
    id: "healthcare",
    name: "Healthcare & MedTech",
    sectorGroup: "Process & Regulated",
    icon: Activity,
    challenge:
      "Tight regulatory tolerances on surgical instruments and implants, small batch sizes with high mix, and demanding cleanroom packaging requirements.",
    automationSolution:
      "Force-controlled micro-polishing of titanium orthopedic implants, automated sterile blister pack packaging, and collaborative cobot medical kitting.",
    businessOutcome:
      "Perfect surface finish consistency (< Ra 0.05μm), 100% seal integrity verification, and ISO 13485 compliant manufacturing data logs.",
    keyTechnologies: ["Force-Torque Polishing", "Automated Blister Sealing", "Cobot Cleanroom Kitting"],
    referenceMetric: "Ra <0.05μm Polish",
  },
  {
    id: "logistics",
    name: "Logistics & 3PL",
    sectorGroup: "Logistics & Commerce",
    icon: Truck,
    challenge:
      "High seasonal order surges, severe warehouse labor shortages, and high injury rates associated with manual cross-dock pallet handling.",
    automationSolution:
      "High-capacity autonomous mobile robot (AMR) fleets, dynamic pallet staging coordination, and autonomous trailer unloading robotic systems.",
    businessOutcome:
      "60% reduction in dock-to-stock transit times, elimination of manual pallet jack traffic accidents, and scalable surge capacity.",
    keyTechnologies: ["VDA 5050 AMR Fleets", "Dynamic Fleet Dispatch", "Automated Pallet Conveying"],
    referenceMetric: "60% Faster Transit",
  },
  {
    id: "warehouse-distribution",
    name: "Warehouse & Distribution",
    sectorGroup: "Logistics & Commerce",
    icon: Boxes,
    challenge:
      "Skyrocketing facility real estate costs, order picking errors, and inefficient travel times consuming over 50% of manual picker shifts.",
    automationSolution:
      "Autonomous Goods-to-Person (G2P) robotic fleets, automated high-density shuttle storage, and intelligent vertical lift buffer retrieval systems.",
    businessOutcome:
      "300% pick rate improvement, 400% storage density increase per square foot, and picking accuracy exceeding 99.99%.",
    keyTechnologies: ["Goods-to-Person AMRs", "Automated Storage & Retrieval (ASRS)", "AI Pick-Route Optimization"],
    referenceMetric: "+300% Pick Rates",
  },
  {
    id: "ecommerce",
    name: "E-Commerce Fulfillment",
    sectorGroup: "Logistics & Commerce",
    icon: Zap,
    challenge:
      "Same-day delivery expectations, millions of diverse SKU shapes/sizes, and massive return handling bottlenecks during peak shopping seasons.",
    automationSolution:
      "AI-driven robotic piece-picking arms equipped with generative suction grippers, automated polybag packing, and AMR cross-belt sorting matrices.",
    businessOutcome:
      "Autonomous picking of 1,200 items per hour across unknown SKUs, 90% faster returns restocking, and 24/7 uninterrupted fulfillment.",
    keyTechnologies: ["AI Vision Piece-Picking", "Multi-Item Suction Grippers", "High-Speed Sortation AMRs"],
    referenceMetric: "1,200 PPH AI Picking",
  },
  {
    id: "agriculture",
    name: "Precision Agriculture",
    sectorGroup: "Heavy & Resources",
    icon: Target,
    challenge:
      "Severe farm labor shortages during harvest windows, excessive chemical herbicide usage, and harsh outdoor weather operating conditions.",
    automationSolution:
      "All-terrain autonomous mobile field robots, AI-driven targeted micro-herbicide spraying, and automated post-harvest grading and packing cells.",
    businessOutcome:
      "90% reduction in chemical spray volume, automated 24/7 crop harvesting, and enhanced crop quality sorting before cold storage transit.",
    keyTechnologies: ["RTK-GPS Field Navigation", "Multispectral AI Crop Vision", "Outdoor Rugged Mobility Modules"],
    referenceMetric: "-90% Herbicide Use",
  },
  {
    id: "energy",
    name: "Energy & Renewables",
    sectorGroup: "Heavy & Resources",
    icon: Flame,
    challenge:
      "High scrap rates in solar PV wafer stringing, wind turbine blade composite defect risks, and dangerous offshore utility inspection tasks.",
    automationSolution:
      "Ultra-fast solar cell tabber-stringer robotics, automated ultrasonic inspection crawler robots for turbine blades, and subsea inspection drones.",
    businessOutcome:
      "Sub-0.1% solar cell breakage rates, complete structural integrity assurance on turbine blades, and zero human risk in extreme high-voltage zones.",
    keyTechnologies: ["High-Cadence Solar Handling", "Automated NDT Ultrasonic Crawlers", "Thermal Inspection Vision"],
    referenceMetric: "<0.1% Breakage",
  },
  {
    id: "construction",
    name: "Construction & Prefab",
    sectorGroup: "Heavy & Resources",
    icon: Building2,
    challenge:
      "Dangerous jobsite conditions, slow on-site framing speeds, and heavy timber/steel structural assembly bottlenecks.",
    automationSolution:
      "Factory-based offsite modular framing robotics, robotic structural steel beam plasma cutting cells, and autonomous rebar-tying robots.",
    businessOutcome:
      "70% faster modular panel fabrication, millimeter-perfect joinery, and a 50% decrease in on-site construction safety incidents.",
    keyTechnologies: ["Heavy-Payload Gantry Arms", "Automated Plasma CAD-to-Cut", "Modular Panel Jig Robotics"],
    referenceMetric: "70% Faster Prefab",
  },
  {
    id: "mining",
    name: "Mining & Heavy Equipment",
    sectorGroup: "Heavy & Resources",
    icon: HardDrive,
    challenge:
      "Deep underground hazards, abrasive dust environments, and catastrophic downtime when massive mineral crushers or haulers fail.",
    automationSolution:
      "Autonomous underground haulage vehicles, robotic drill rig positioning, and heavy-payload robotic hardfacing / plasma weld refurbishment cells.",
    businessOutcome:
      "Complete removal of human operators from dangerous rockfall faces, 3x longer component wear life, and 24/7 continuous extraction.",
    keyTechnologies: ["Ruggedized Underground Lidar", "Automated Hardfacing Robotic Welding", "Predictive Telemetry"],
    referenceMetric: "Zero Human Risk",
  },
  {
    id: "oil-gas",
    name: "Oil & Gas",
    sectorGroup: "Heavy & Resources",
    icon: Radar,
    challenge:
      "Explosion-hazard ATEX environments, remote offshore rig maintenance, and costly manual pipeline corrosion surveys.",
    automationSolution:
      "ATEX Zone 1 explosion-proof robotic pipe inspection crawlers, automated drill-pipe handling arms, and autonomous perimeter surveillance AMRs.",
    businessOutcome:
      "95% reduction in manned entry into confined hazardous tanks, 24/7 real-time methane leak detection, and continuous pipeline asset assurance.",
    keyTechnologies: ["ATEX Zone 1 Certified Arms", "Non-Destructive Testing Crawlers", "Optical Gas Imaging Vision"],
    referenceMetric: "ATEX Zone 1 Safe",
  },
];

// --- SECTION 4: SOLUTION FINDER CRITERIA & RECOMMENDATION RULES ---
interface ImprovementGoal {
  id: string;
  label: string;
  description: string;
  categoryFit: "fixed" | "mobile" | "autonomous" | "integrated";
  recommendedSolutions: string[];
  expectedKpi: string;
  paybackPeriod: string;
  recommendedStack: string[];
}

const IMPROVEMENT_GOALS: ImprovementGoal[] = [
  {
    id: "productivity",
    label: "Productivity & Throughput",
    description: "Eliminate line bottlenecks, cycle variance, and manual slowdowns.",
    categoryFit: "fixed",
    recommendedSolutions: [
      "High-Cadence Fixed Robotic Workcells (Welding / Assembly)",
      "Automated Dual-Gripper CNC Machine Tending",
      "High-Speed Delta Carton Packaging & Sorting",
    ],
    expectedKpi: "+35% to +55% Throughput Increase",
    paybackPeriod: "9 - 14 Months",
    techStack: ["6-Axis Articulated Robots", "EtherCAT High-Speed Bus", "Zero-Backlash Strain-Wave Actuators"],
  },
  {
    id: "quality",
    label: "Quality & Zero-Defects",
    description: "Stop defect leakage, scrap costs, and post-process rework cycles.",
    categoryFit: "autonomous",
    recommendedSolutions: [
      "In-Line 3D Edge AI Vision Inspection Systems",
      "Adaptive Closed-Loop Laser Seam Tracking",
      "Precision Micro-Force Feedback Assembly Cells",
    ],
    expectedKpi: "50% to 75% Defect Reduction (Sub-10 PPM)",
    paybackPeriod: "7 - 12 Months",
    techStack: ["NVIDIA TensorRT Inference", "Sub-Pixel 3D Photometry", "6-DOF Force/Torque Transducers"],
  },
  {
    id: "labor",
    label: "Labor Efficiency & Safety",
    description: "Overcome skilled operator shortages and protect teams from ergonomic strain.",
    categoryFit: "integrated",
    recommendedSolutions: [
      "Turnkey Robotic Welding & Plasma Cutting Workcells",
      "Autonomous Palletizing & De-Palletizing Cells",
      "Safe Collaborative Robotic (Cobot) Kitting Workbenches",
    ],
    expectedKpi: "30% to 50% Labor Optimization Reallocation",
    paybackPeriod: "10 - 15 Months",
    techStack: ["ISO 10218-1 Safety Interlocks", "Cobot Force Limiting", "Intuitive Lead-Through HMI"],
  },
  {
    id: "material-flow",
    label: "Material Flow & Intralogistics",
    description: "End assembly line starvation and dangerous manual forklift traffic.",
    categoryFit: "mobile",
    recommendedSolutions: [
      "Autonomous Mobile Robot (AMR) Fleet Delivery",
      "Heavy-Payload Automated Guided Vehicles (AGVs)",
      "VDA 5050 Multi-Vendor Traffic & Dispatch Management",
    ],
    expectedKpi: "60% Faster Material Transit & Zero Floor Gridlock",
    paybackPeriod: "11 - 16 Months",
    techStack: ["LiDAR SLAM Natural Navigation", "ISO 3691-4 Safety Scanners", "Integrated High-Torque BLDC Drives"],
  },
  {
    id: "safety",
    label: "Operator Safety & Compliance",
    description: "Remove operators from toxic fumes, pinch points, and heavy manual lifts.",
    categoryFit: "fixed",
    recommendedSolutions: [
      "Fully Enclosed Robotic Cells with Optical Safety Curtains",
      "Autonomous Forklift Fleet with 3D Collision Avoidance",
      "ATEX Zone Certified Explosion-Proof Robotic Arms",
    ],
    expectedKpi: "Zero Recordable Workplace Incidents",
    paybackPeriod: "Immediate Risk Abatement",
    techStack: ["SIL 3 / PL e Safety PLCs", "Dual-Channel Safety Light Curtains", "Dynamic Radar Envelopes"],
  },
  {
    id: "downtime",
    label: "Downtime Reduction & OEE",
    description: "Prevent catastrophic mechanical breakdown and unplanned line stoppages.",
    categoryFit: "autonomous",
    recommendedSolutions: [
      "Edge-Based Predictive Vibration & Thermal Telemetry",
      "Real-Time Digital Twin Virtual Line Monitoring",
      "Automated Spares Triggering via MES/ERP Integration",
    ],
    expectedKpi: "-68% Unplanned Production Downtime",
    paybackPeriod: "6 - 11 Months",
    techStack: ["FFT Vibration Accelerometers", "OPC-UA Pub/Sub Data Broker", "Time-Series Anomaly Detection"],
  },
  {
    id: "smart-mfg",
    label: "Smart Manufacturing & Industry 4.0",
    description: "Unify fragmented machines into a connected, telemetry-driven smart factory.",
    categoryFit: "autonomous",
    recommendedSolutions: [
      "Unified Enterprise Robot Orchestration Layer",
      "Digital Twin Simulation & Virtual Commissioning",
      "Shopfloor MES to ERP Cloud Connectivity Infrastructure",
    ],
    expectedKpi: "100% Production Visibility & Zero Blind Spots",
    paybackPeriod: "12 - 18 Months",
    techStack: ["Unified Namespace (UNS)", "MQTT Sparkplug B", "Cloud REST / GraphQL Microservices"],
  },
];

// --- SECTION 5: INDUSTRIAL USE CASES (BY CATEGORY) ---
interface UseCaseItem {
  id: string;
  category: "fixed" | "mobile" | "autonomous";
  title: string;
  tag: string;
  problem: string;
  solution: string;
  techStack: string[];
  businessImpact: string;
  roiBenefits: string;
}

const INDUSTRIAL_USE_CASES: UseCaseItem[] = [
  // FIXED ROBOTICS
  {
    id: "fixed-welding",
    category: "fixed",
    title: "Robotic Welding Workcell",
    tag: "Fixed Robotics",
    problem:
      "Severe shortage of certified welding artisans, high rework rates on structural seams, and worker exposure to toxic weld fumes and UV arc flashes.",
    solution:
      "Turnkey 6-axis robotic welding workcell with synchronized 2-axis positioner table, adaptive laser optical seam tracking, and integrated fume extraction hood.",
    techStack: ["6-Axis Arc Welding Manipulator", "Laser Seam Tracking", "EtherCAT Fronius / Lincoln Integration", "PL-d Interlocked Enclosure"],
    businessImpact:
      "3.5x faster linear weld deposition speeds, 98% reduction in post-weld grinding rework, and continuous repeatability on multi-pass welds.",
    roiBenefits: "Full capital payback achieved within 11 months based on two-shift operations.",
  },
  {
    id: "fixed-assembly",
    category: "fixed",
    title: "High-Precision Assembly Automation",
    tag: "Fixed Robotics",
    problem:
      "Micro-component insertion fatigue causing scrap, irregular press-fit depth, and inconsistent fastener torque across multi-stage manual benches.",
    solution:
      "Multi-stage robotic assembly cell with SCARA and 6-axis arms featuring micro-force feedback insertion, closed-loop torque drivers, and optical part verification.",
    techStack: ["High-Speed SCARA Arms", "6-Axis Force-Torque End-Effector", "Torque-Angle Nutrunners", "Telecentric Optical Verification"],
    businessImpact:
      "Zero missed screws or stripped threads, guaranteed press-fit depth tolerances within ±0.01mm, and 60% faster sub-assembly completion.",
    roiBenefits: "Scrap reduction saves an estimated $140,000 annually per production cell.",
  },
  {
    id: "fixed-packaging",
    category: "fixed",
    title: "High-Speed Packaging & Case Packing",
    tag: "Fixed Robotics",
    problem:
      "Manual cartoning lines cannot keep pace with upstream automated processing lines, creating product backlog and package deformities.",
    solution:
      "High-speed delta robot packaging system with conveyor tracking, dynamic vacuum pick heads, and automatic case erector synchronization.",
    techStack: ["Carbon-Fiber Delta Kinematics", "Line-Tracking Vision Encoders", "Venturi Vacuum Grippers", "High-Flow Case Erector"],
    businessImpact:
      "Up to 150 picks per minute per robot head, gentle product handling with zero cosmetic damage, and instant changeover for multi-SKU retail packaging.",
    roiBenefits: "Eliminates 4 manual packing operator shifts per line with 10-month payback.",
  },
  {
    id: "fixed-machine-tending",
    category: "fixed",
    title: "CNC Machine Tending System",
    tag: "Fixed Robotics",
    problem:
      "CNC milling and lathe spindle idle times during manual part changeovers, operator safety hazards inside machining envelopes, and scrap caused by improper chuck seating.",
    solution:
      "Dual-gripper 6-axis robotic loading cell mounted on a floor rail or pedestal with air-blast chuck cleaning, pneumatic fixture clamping, and part blow-off.",
    techStack: ["6-Axis Machine Tending Arm", "Dual Parallel Pneumatic Grippers", "Direct CNC CNC-I/O Interface", "Laser Part-Seat Sensor"],
    businessImpact:
      "Spindle utilization increased from 52% to 91%, parts swapped in under 8 seconds, and continuous lights-out machining across weekends.",
    roiBenefits: "Generates an additional 28 production hours weekly from existing CNC machines.",
  },
  {
    id: "fixed-palletizing",
    category: "fixed",
    title: "Heavy-Payload End-of-Line Palletizing",
    tag: "Fixed Robotics",
    problem:
      "High incidence of musculoskeletal workplace injuries from stacking 25kg - 50kg bags and cartons, coupled with unstable pallet stacks during transit.",
    solution:
      "Heavy-payload 4-axis / 6-axis robotic palletizer with parametric layer-pattern software, vacuum or clamp tooling, and integrated slip-sheet dispenser.",
    techStack: ["450kg Payload Palletizing Robot", "Area Vacuum Foam Gripper", "Automatic Pallet Dispenser", "Integrated Turntable Stretch Wrapper"],
    businessImpact:
      "Continuous stacking of up to 24 units per minute, perfect interlocked pallet integrity, and zero operator lifting injuries.",
    roiBenefits: "Direct labor cost reduction and 100% elimination of transit load tip accidents.",
  },

  // MOBILE ROBOTICS
  {
    id: "mobile-material-handling",
    category: "mobile",
    title: "Line-Side Material Handling Tugger",
    tag: "Mobile Robotics",
    problem:
      "Unsynchronized raw material replenishment causes assembly line starvation, while manual forklift traffic creates acute collision hazards in tight aisles.",
    solution:
      "Autonomous Mobile Tuggers that navigate dynamically using LiDAR SLAM, pulling cart trains of up to 1,500 kg directly from warehouse kitting to assembly cells.",
    techStack: ["LiDAR SLAM Navigation", "Automatic Hitching Mechanism", "Safety Field Zone Laser Scanners", "MES Pull-Signal API"],
    businessImpact:
      "Zero line starvation stoppages, JIT parts delivery synchronized with takt time, and complete removal of manual forklifts from operator aisles.",
    roiBenefits: "Recovers 18% floor space previously reserved for permanent conveyor runs.",
  },
  {
    id: "mobile-warehouse-transport",
    category: "mobile",
    title: "Warehouse Pallet Transport AMR",
    tag: "Mobile Robotics",
    problem:
      "Floor bottlenecks moving finished goods from packaging to shipping docks, with manual drivers spending 70% of their shift simply driving pallets across facilities.",
    solution:
      "Autonomous pallet-lifting AMRs capable of driving underneath standard industrial pallets, elevating up to 1,200 kg, and transporting to dispatch staging racks.",
    techStack: ["Integrated Hydraulic Pin Lift", "Dual 360° Safety Scanners", "Omnidirectional Drive Platform", "Industrial Wi-Fi / 5G Roaming"],
    businessImpact:
      "Rapid autonomous cross-dock staging, 45% faster dock turnaround, and complete elimination of damaged facility racking.",
    roiBenefits: "Reduces internal logistics operating costs by 40% with a 13-month payback.",
  },
  {
    id: "mobile-inventory-movement",
    category: "mobile",
    title: "Autonomous Inventory Movement & Kitting",
    tag: "Mobile Robotics",
    problem:
      "Manual kitting errors leading to wrong parts reaching assembly lines, wasted walking time across large mezzanine warehouses, and delayed ERP inventory updates.",
    solution:
      "Shelf-carrying and tote-shuttle AMRs moving specialized multi-tier kitting racks directly to designated picking stations under automated guidance.",
    techStack: ["QR Grid & SLAM Hybrid Localization", "Electronic Shelf Locking Mechanism", "Dynamic Task Scheduler", "WMS / ERP Gateway"],
    businessImpact:
      "Order picking accuracy increased to 99.99%, operator walking time reduced by 85%, and real-time inventory ledger updates.",
    roiBenefits: "Inventory cycle counts reduced from quarterly manual shutdowns to daily automated audits.",
  },
  {
    id: "mobile-logistics-automation",
    category: "mobile",
    title: "Logistics Cross-Dock Sortation AMR Fleet",
    tag: "Mobile Robotics",
    problem:
      "Sorting hubs overwhelmed by parcel volume spikes, with fixed sorter conveyors costing millions and requiring months of rigid construction.",
    solution:
      "Modular fleet of table-top cross-belt sortation AMRs operating on a raised platform, dynamically routing packages to hundreds of destination chutes.",
    techStack: ["High-Speed Cross-Belt Deck", "VDA 5050 Fleet Traffic Engine", "Sub-Millimeter Optical Docking", "Opportunity Fast-Charging Stations"],
    businessImpact:
      "Handles up to 12,000 parcels per hour, modular fleet easily scaled up during peak seasons, and footprint 50% smaller than legacy tilt-tray systems.",
    roiBenefits: "CapEx investment 45% lower than traditional fixed conveyor sortation systems.",
  },

  // AUTONOMOUS ROBOTICS
  {
    id: "autonomous-ai-inspection",
    category: "autonomous",
    title: "AI Deep Learning Visual Inspection",
    tag: "Autonomous Robotics",
    problem:
      "Human visual inspectors miss hairline fractures, paint blemishes, or missing components due to eye fatigue; rule-based vision systems fail on complex textures.",
    solution:
      "Multi-camera edge AI inspection cell utilizing high-resolution stereoscopic vision and convolutional neural networks trained to detect anomalies in real time.",
    techStack: ["NVIDIA Jetson AGX Compute", "Industrial 3D GigE Cameras", "Deep Learning Defect Classifier", "PLC Rejection Gate Trigger"],
    businessImpact:
      "Inspection latency under 4ms per part, 99.98% defect detection accuracy, and complete elimination of customer quality escape claims.",
    roiBenefits: "Prevents catastrophic warranty recall costs and eliminates dedicated manual inspection benches.",
  },
  {
    id: "autonomous-smart-warehousing",
    category: "autonomous",
    title: "Autonomous High-Reach Smart Warehousing",
    tag: "Autonomous Robotics",
    problem:
      "Operating high-reach reach trucks in narrow aisles poses significant tipping hazards, with damage to racking and goods costing millions annually.",
    solution:
      "Fully autonomous robotic forklifts equipped with 3D perception and spatial SLAM, capable of lifting 1,500 kg loads up to 12-meter high-bay racking.",
    techStack: ["3D Solid-State LiDAR", "Pallet Pocket Optical Alignment Vision", "Dynamic Center-of-Gravity Control", "WMS High-Bay Dispatch"],
    businessImpact:
      "24/7 autonomous high-bay replenishment, zero rack impacts, and operating speed optimized for maximum throughput and safety.",
    roiBenefits: "Lowers warehousing storage cost per pallet by 32% while doubling operating hours.",
  },
  {
    id: "autonomous-predictive-maintenance",
    category: "autonomous",
    title: "Edge Predictive Maintenance & Telemetry",
    tag: "Autonomous Robotics",
    problem:
      "Sudden bearing failure on critical drives or robot joints halts whole factory assembly lines, costing $25,000+ per minute of unplanned downtime.",
    solution:
      "Tri-axial vibration accelerometers and thermal sensors coupled to an edge compute unit running continuous FFT frequency and degradation algorithms.",
    techStack: ["MEMS High-Frequency Accelerometers", "Edge AI Telemetry Gateway", "Vibration Spectral Anomaly Model", "Automated Maintenance Ticket Trigger"],
    businessImpact:
      "Mechanical anomalies detected 3 to 6 weeks before physical failure, scheduled maintenance replacing emergency fire-fighting, and longer asset lifespan.",
    roiBenefits: "Reduces overall plant maintenance expenditures by 28% and extends robot gearbox life.",
  },
  {
    id: "autonomous-factory-intelligence",
    category: "autonomous",
    title: "Factory Intelligence & Digital Twin Optimization",
    tag: "Autonomous Robotics",
    problem:
      "Plant management operates with lagging reports, unaware of real-time micro-stoppages, line imbalances, and sub-optimal cycle cadence across workcells.",
    solution:
      "Unified industrial IoT digital twin architecture capturing real-time telemetry from every robot, PLC, and sensor, driving autonomous closed-loop line balancing.",
    techStack: ["OPC-UA Unified Namespace (UNS)", "Real-Time 3D Digital Twin Simulation", "MQTT Sparkplug B Architecture", "Closed-Loop Dispatch Optimizer"],
    businessImpact:
      "Sub-second plantwide operational visibility, automated bottleneck mitigation, and virtual commissioning of new product variants with zero line downtime.",
    roiBenefits: "Yields an additional 8% to 14% overall equipment effectiveness across entire manufacturing plants.",
  },
];

// --- SECTION 6: ENTERPRISE AUTOMATION ARCHITECTURE (7 TIERS) ---
interface ArchitectureTier {
  id: string;
  tierNumber: string;
  name: string;
  subtitle: string;
  summary: string;
  protocols: string[];
  responsibilities: string[];
  hardwareSoftware: string[];
  telemetryStream: string;
}

const ARCHITECTURE_TIERS: ArchitectureTier[] = [
  {
    id: "erp",
    tierNumber: "Tier 1",
    name: "ERP / SAP Enterprise Layer",
    subtitle: "Enterprise Resource Planning & Business Governance",
    summary:
      "Global business management, demand forecasting, supplier order allocation, bill-of-materials (BOM) management, and financial balance sheets.",
    protocols: ["REST / GraphQL", "SAP RFC / BAPI", "OData v4", "Secure Webhooks"],
    responsibilities: [
      "Master production scheduling (MPS)",
      "Customer order intake and SLA commitments",
      "Supply chain purchasing and raw inventory valuation",
      "Enterprise cost accounting and operational margin auditing",
    ],
    hardwareSoftware: ["SAP S/4HANA", "Oracle NetSuite", "Microsoft Dynamics 365", "Custom Enterprise Portals"],
    telemetryStream: "Batch sync: Production orders, BOM releases, finished goods dispatch confirmation.",
  },
  {
    id: "mes",
    tierNumber: "Tier 2",
    name: "MES (Manufacturing Execution System)",
    subtitle: "Shopfloor Execution, Routing & Track-and-Trace",
    summary:
      "Translates high-level enterprise orders into granular shopfloor work instructions, manages operational routings, enforces recipes, and logs complete traceability.",
    protocols: ["ISA-95 Standard", "OPC-UA", "WebSockets", "Kafka Event Streams"],
    responsibilities: [
      "Real-time work-in-progress (WIP) tracking across all stations",
      "Recipe and CAD program dispatch to individual robotic workcells",
      "Operator authorization and digital work instruction guidance",
      "Comprehensive serialization and FDA / AS9100 quality compliance logs",
    ],
    hardwareSoftware: ["Siemens Opcenter", "Rockwell FactoryTalk", "Dassault DELMIA", "Custom Cloud MES"],
    telemetryStream: "Real-time: Station cycle progress, scrap logs, operator badges, serial trace records.",
  },
  {
    id: "iiot",
    tierNumber: "Tier 3",
    name: "Industrial IoT & Unified Namespace",
    subtitle: "Standardized Pub/Sub Telemetry Broker",
    summary:
      "A decoupled, single source of truth enterprise architecture that aggregates plant floor telemetry and distributes it across analytics, monitoring, and edge apps.",
    protocols: ["MQTT Sparkplug B", "OPC-UA Pub/Sub", "Kafka", "AMQP 1.0"],
    responsibilities: [
      "Decoupling edge hardware from enterprise consumers",
      "Contextualizing raw sensor data with standardized naming hierarchies",
      "Bi-directional message brokering with millisecond delivery",
      "Industrial edge buffering preventing data loss during network interruptions",
    ],
    hardwareSoftware: ["EMQX Enterprise Broker", "HiveMQ", "AWS IoT Core", "Siemens Industrial Edge"],
    telemetryStream: "10,000+ msgs/sec: Temperature, vibration, current, motor torque, sensor health packets.",
  },
  {
    id: "ai-analytics",
    tierNumber: "Tier 4",
    name: "AI Analytics & Perception Layer",
    subtitle: "Real-Time Edge Inference & Cognitive Processing",
    summary:
      "Computer vision models, predictive maintenance analytics, and reinforcement learning engines processing high-frequency data at microsecond latency.",
    protocols: ["TensorRT C++ Runtime", "gRPC Microservices", "ZeroMQ", "RTSP / WebRTC"],
    responsibilities: [
      "Sub-pixel 3D defect detection on moving production lines",
      "Continuous vibration FFT spectral analysis for mechanical health",
      "Dynamic robotic trajectory optimization avoiding singularities",
      "Root-cause anomaly attribution preventing process drift",
    ],
    hardwareSoftware: ["NVIDIA Jetson AGX Orin", "Intel OpenVINO", "Edge TPU Accelerators", "PyTorch Industrial Models"],
    telemetryStream: "High-frequency: 4.2ms inference results, bounding box coordinates, confidence scores.",
  },
  {
    id: "orchestration",
    tierNumber: "Tier 5",
    name: "Robot Orchestration Layer",
    subtitle: "Multi-Agent Coordination & Fleet Traffic Arbitration",
    summary:
      "Centralized supervisory control that orchestrates fixed multi-arm workcells, mobile AMR fleets, automated doors, elevators, and safety zones without deadlocks.",
    protocols: ["VDA 5050 Standard", "ROS 2 Galactic/Humble", "DDS (Data Distribution Service)", "Modbus TCP"],
    responsibilities: [
      "Multi-vendor AMR traffic dispatch and collision avoidance routing",
      "Dynamic task allocation based on battery state and proximity",
      "Interlocking fixed robot envelopes with mobile robot drop zones",
      "Automated charging station scheduling during production lulls",
    ],
    hardwareSoftware: ["Indus Fleet Manager", "Nav2 ROS2 Stack", "Open-RMF Orchestration", "Industrial Wi-Fi 6 Routers"],
    telemetryStream: "Continuous: Vehicle coordinates, battery %, task states, intersection reservations.",
  },
  {
    id: "physical-robots",
    tierNumber: "Tier 6",
    name: "Robotic Hardware Execution Layer",
    subtitle: "Fixed Arms, Mobile AMRs & Autonomous Machinery",
    summary:
      "The physical mechatronic workforce executing precise motion profiles, welds, assemblies, material transfers, and heavy pallet lifts with deterministic timing.",
    protocols: ["EtherCAT", "PROFINET IRT", "EtherNet/IP CIP Sync", "CANopen / SafetyBUS"],
    responsibilities: [
      "Sub-millimeter physical kinematic trajectory execution",
      "Continuous closed-loop torque, velocity, and position control",
      "Direct mechanical interaction with workpieces and machine centers",
      "Instant hardware fail-safe e-stop execution under SIL 3 / PL e",
    ],
    hardwareSoftware: ["6-Axis Articulated Arms", "SCARA & Delta Manipulators", "Autonomous Mobile AMRs", "Servo Drives & Motors"],
    telemetryStream: "Microsecond: Joint encoder positions, current draw, safety interlock circuit status.",
  },
  {
    id: "operations",
    tierNumber: "Tier 7",
    name: "Physical Plant Floor Operations",
    subtitle: "High-Throughput Continuous Manufacturing",
    summary:
      "The real-world industrial output: automotive bodies, semiconductor chips, consumer packaged goods, and logistics shipments produced safely and consistently.",
    protocols: ["Physical Material Transfer", "Barcode / RFID Tags", "Visual Andon Displays", "Factory Audio Alarms"],
    responsibilities: [
      "24/7 autonomous production of verified enterprise goods",
      "Zero-defect delivery meeting rigorous end-customer SLAs",
      "Zero-injury human working environment around automated cells",
      "Continuous operational margin creation and asset value realization",
    ],
    hardwareSoftware: ["Production Assemblies", "Raw Material Warehouses", "Dock Staging Yards", "Andon Boards"],
    telemetryStream: "Operational: Units produced per hour, total scrap count, overall line OEE metric.",
  },
];

// --- SECTION 7: BUSINESS OUTCOMES (KPIS) ---
interface BusinessOutcomeKpi {
  metric: string;
  label: string;
  benchmark: string;
  description: string;
  impactArea: string;
}

const BUSINESS_OUTCOMES: BusinessOutcomeKpi[] = [
  {
    metric: "40%+",
    label: "Productivity Increase",
    benchmark: "Average +44% line throughput across deployed workcells",
    description:
      "Elimination of operator fatigue, smooth continuous cycle cadence, and optimal multi-axis trajectory synchronization maximizing machine tool contact time.",
    impactArea: "Throughput & Capacity",
  },
  {
    metric: "30%+",
    label: "Labor Optimization",
    benchmark: "Reallocation of 3.2 operators per shift to higher-value roles",
    description:
      "Transition workforce away from monotonous, physically punishing lifting and toxic fume exposure into supervisory, programming, and QA roles.",
    impactArea: "Workforce & Safety",
  },
  {
    metric: "50%+",
    label: "Defect Reduction",
    benchmark: "Defect escapes reduced to < 12 PPM across automated lines",
    description:
      "Closed-loop optical machine vision inspection and precision servo torque-limiting eliminate assembly errors before downstream value-add steps.",
    impactArea: "Quality & Scrap",
  },
  {
    metric: "60%+",
    label: "Faster Material Flow",
    benchmark: "Internal dock-to-assembly transit latency cut from 42 min to 16 min",
    description:
      "AMR fleet replaces rigid permanent conveyors and manual tuggers, establishing dynamic pull-based replenishment triggered directly by MES demand.",
    impactArea: "Intralogistics & WIP",
  },
  {
    metric: "24/7",
    label: "Operations Availability",
    benchmark: "99.85% mechanical availability across 3 continuous shifts",
    description:
      "Industrial-grade reducers, high-duty-cycle brushless drives, and edge predictive telemetry prevent unexpected mechanical breakdowns during peak runs.",
    impactArea: "Reliability & Uptime",
  },
  {
    metric: "100%",
    label: "Production Visibility",
    benchmark: "Zero unmonitored blind spots from shop floor to enterprise ERP",
    description:
      "Standardized MQTT Sparkplug B and OPC-UA Unified Namespace telemetry streams real-time cycle data, OEE metrics, and fault alarms to management dashboards.",
    impactArea: "Digital Transformation",
  },
];

// --- SECTION 8: INDUSTRY 4.0 CAPABILITIES (9 CAPABILITIES) ---
interface CapabilityItem {
  id: string;
  title: string;
  categoryBadge: string;
  tagline: string;
  description: string;
  specs: string[];
  icon: any;
}

const CAPABILITIES_LIST: CapabilityItem[] = [
  {
    id: "machine-vision",
    title: "Machine Vision",
    categoryBadge: "Optical Metrology & AI",
    tagline: "Sub-pixel dimensional verification and AI surface flaw classification.",
    description:
      "High-speed 2D/3D stereoscopic, telecentric, and structured light vision solutions integrated directly onto robotic arms or overhead inspection stations.",
    specs: ["Sub-pixel accuracy down to ±5μm", "3D point cloud generation < 30ms", "Deep neural network segmentation", "GigE Vision & GenICam compliance"],
    icon: Eye,
  },
  {
    id: "ai-analytics",
    title: "AI Analytics",
    categoryBadge: "Cognitive Intelligence",
    tagline: "Edge inference models transforming raw time-series data into predictive decisions.",
    description:
      "Hardware-accelerated neural networks deployed on rugged edge computers analyzing sensor telemetry, torque profiles, and vibration spectra in real time.",
    specs: ["TensorRT optimized neural runtimes", "Inference latency under 5ms", "Automated drift detection & retraining", "Edge-to-cloud telemetry sync"],
    icon: Sparkles,
  },
  {
    id: "digital-twin",
    title: "Digital Twin",
    categoryBadge: "Virtual Commissioning",
    tagline: "Complete physics-based virtual representations of entire automated factories.",
    description:
      "Comprehensive digital twin simulation environments allowing full Kinematic validation, cycle-time verification, and PLC code testing before equipment delivery.",
    specs: ["Full 6-DOF physics collision simulation", "Virtual commissioning with Software-in-the-Loop (SiL)", "Real-time kinematic twin synchronization", "Zero plant downtime during model re-tooling"],
    icon: Boxes,
  },
  {
    id: "predictive-maintenance",
    title: "Predictive Maintenance",
    categoryBadge: "Asset Health Telemetry",
    tagline: "Acoustic and vibration anomaly detection stopping catastrophic mechanical failure.",
    description:
      "Continuous condition monitoring systems tracking high-frequency harmonics across cycloidal reducers, ball screws, spindle bearings, and drive inverters.",
    specs: ["Tri-axial MEMS vibration accelerometers", "FFT spectral analysis & envelope detection", "3 to 6 week advance warning prior to failure", "Automated ERP maintenance work-order generation"],
    icon: Activity,
  },
  {
    id: "edge-computing",
    title: "Edge Computing",
    categoryBadge: "Deterministic Real-Time",
    tagline: "High-performance compute clusters installed directly inside shopfloor control cabinets.",
    description:
      "Fanless, vibration-resistant industrial computers running real-time Linux kernels with Xenomai / PREEMPT_RT for deterministic microsecond machine control.",
    specs: ["Intel Xeon & NVIDIA Orin GPU hardware", "Hard real-time deterministic cycle < 250μs", "IP65 sealed fanless enclosures", "Dual redundant power supplies"],
    icon: Cpu,
  },
  {
    id: "iiot",
    title: "Industrial IoT (IIoT)",
    categoryBadge: "Unified Namespace (UNS)",
    tagline: "Enterprise connectivity bridging fieldbuses to cloud data lakes seamlessly.",
    description:
      "Decoupled industrial messaging infrastructure utilizing MQTT Sparkplug B and OPC-UA to democratize telemetry data across plant and corporate systems.",
    specs: ["MQTT Sparkplug B standard compliance", "OPC-UA server/client with security profiles", "Native edge buffering against connection drop", "TLS 1.3 end-to-end payload encryption"],
    icon: Network,
  },
  {
    id: "robot-fleet-mgmt",
    title: "Robot Fleet Management",
    categoryBadge: "Multi-Agent Coordination",
    tagline: "VDA 5050 certified multi-vendor traffic arbitration and dynamic dispatch.",
    description:
      "Centralized supervisory control software that manages heterogeneous AMR and AGV fleets across complex factory floor layouts without deadlocks or gridlock.",
    specs: ["VDA 5050 standard protocol support", "Dynamic intersection priority arbitration", "Automated opportunity charging management", "Live 2D/3D map editing & restricted zone tagging"],
    icon: Truck,
  },
  {
    id: "production-intel",
    title: "Production Intelligence",
    categoryBadge: "Operational Dashboards",
    tagline: "Real-time OEE dashboards, bottleneck analytics, and automated yield tracking.",
    description:
      "Enterprise visualization platforms providing plant managers with instantaneous insights into overall equipment effectiveness, cycle times, and scrap root causes.",
    specs: ["Automated OEE calculation (Availability, Performance, Quality)", "Micro-stoppage pareto analysis", "Role-based mobile and desktop dashboards", "Automated shift reporting & email alerts"],
    icon: BarChart3,
  },
  {
    id: "process-optimization",
    title: "Process Optimization",
    categoryBadge: "Closed-Loop Control",
    tagline: "Adaptive parameter tuning eliminating manual calibration drift.",
    description:
      "Closed-loop feedback loops linking in-line sensor measurements directly back to robot path planners, welding power supplies, or dispensing valves.",
    specs: ["Adaptive laser seam tracking modulation", "Dynamic robot trajectory smoothing", "Closed-loop dispensing bead volume regulation", "Statistical process control (SPC) integration"],
    icon: Settings2,
  },
];

// --- SECTION 9: DELIVERY METHODOLOGY (7 STAGES) ---
interface MethodologyStage {
  stage: string;
  name: string;
  duration: string;
  deliverables: string[];
  description: string;
}

const DELIVERY_METHODOLOGY: MethodologyStage[] = [
  {
    stage: "01",
    name: "Assessment & Plant Audit",
    duration: "Week 1 - 2",
    description:
      "Comprehensive on-site engineering review of your existing manufacturing operations, part geometries, takt times, and ergonomic bottlenecks.",
    deliverables: ["Baseline OEE and cycle-time audit", "Technical feasibility analysis", "Automation ROI & payback model", "Risk assessment report"],
  },
  {
    stage: "02",
    name: "Discovery Workshop",
    duration: "Week 2 - 3",
    description:
      "Collaborative technical design sessions aligning plant engineering, operations, maintenance, and safety leadership on core project objectives.",
    deliverables: ["Functional design specification (FDS)", "Plant floor footprint constraints", "Fieldbus & IT/OT integration plan", "Safety category requirements"],
  },
  {
    stage: "03",
    name: "Solution Engineering",
    duration: "Week 3 - 6",
    description:
      "Complete mechanical 3D CAD modeling, electrical schematic development, tooling design, and kinematic envelope calculations.",
    deliverables: ["Full 3D CAD assembly models", "EPLAN electrical & pneumatic schematics", "Structural stress & FEA calculations", "Bill of materials (BOM) freeze"],
  },
  {
    stage: "04",
    name: "Digital Twin Simulation",
    duration: "Week 6 - 8",
    description:
      "Virtual commissioning of the entire robotic system inside physics-based simulation environments before physical hardware fabrication.",
    deliverables: ["Cycle-time verification video", "Reachability & collision analysis", "PLC code software-in-the-loop testing", "Virtual sign-off with customer"],
  },
  {
    stage: "05",
    name: "Fabrication & Deployment",
    duration: "Week 8 - 14",
    description:
      "Precision manufacturing of robotic workcells, fieldbus wiring, on-site mechanical anchoring, laser alignment, and turnkey integration.",
    deliverables: ["Factory Acceptance Test (FAT)", "On-site mechanical & electrical installation", "Safety system validation (ISO 13849-1)", "Site Acceptance Test (SAT)"],
  },
  {
    stage: "06",
    name: "Optimization & Ramp-Up",
    duration: "Week 14 - 16",
    description:
      "Active production monitoring, trajectory cycle-time shaving, parameter fine-tuning, and comprehensive operator and maintenance technician training.",
    deliverables: ["Final cycle-time optimization report", "Operator training certification", "Maintenance manual & spare parts catalog", "Handover to plant operations"],
  },
  {
    stage: "07",
    name: "Continuous Support & SLA",
    duration: "Ongoing Lifecycle",
    description:
      "Dedicated long-term service engineering support, 24/7 emergency response, remote telemetry diagnostics, and scheduled preventative maintenance.",
    deliverables: ["Guaranteed 4-hour response SLA", "24/7 remote telemetry diagnostic access", "Quarterly preventative maintenance visits", "Consigned spare parts storage"],
  },
];

// --- SECTION 10: WHY PRECISION MOTION SYSTEMS (8 PILLARS) ---
interface ValuePillar {
  title: string;
  badge: string;
  description: string;
  icon: any;
}

const WHY_CHOOSE_US: ValuePillar[] = [
  {
    title: "Engineering Excellence",
    badge: "Precision Craftsmanship",
    description:
      "Every robotic system is engineered with sub-millimeter mechanical tolerances, finite element analysis (FEA), and premium industrial components built for decades of heavy service.",
    icon: Award,
  },
  {
    title: "Deep Automation Expertise",
    badge: "Domain Authority",
    description:
      "Decades of combined engineering experience designing, programming, and commissioning complex multi-axis robotic cells and autonomous systems worldwide.",
    icon: Cpu,
  },
  {
    title: "Industry-Specific Solutions",
    badge: "Tailored Architecture",
    description:
      "We don't sell generic one-size-fits-all automation. Every cell is engineered specifically for your part envelope, cleanliness class, temperature, and cycle time.",
    icon: Factory,
  },
  {
    title: "AI + Robotics Integration",
    badge: "Cognitive Kinematics",
    description:
      "Pioneering the convergence of physical mechatronics with neural machine vision and edge inference, creating truly adaptive systems that handle real-world variations.",
    icon: Sparkles,
  },
  {
    title: "Industry 4.0 Leadership",
    badge: "Open Standards",
    description:
      "Built natively on open enterprise standards (OPC-UA, MQTT Sparkplug B, VDA 5050, EtherCAT) ensuring zero vendor lock-in and seamless integration with your IT/OT systems.",
    icon: Network,
  },
  {
    title: "End-to-End Delivery",
    badge: "Single-Source Accountability",
    description:
      "Turnkey responsibility from initial plant audit and digital twin simulation to on-site mechanical anchoring, PLC programming, safety certification, and training.",
    icon: Workflow,
  },
  {
    title: "Scalable Architecture",
    badge: "Modular Expansion",
    description:
      "Standardized modular cell footprints and fleet management architectures designed to scale effortlessly from a single proof-of-concept cell to a multi-line smart factory.",
    icon: Boxes,
  },
  {
    title: "Long-Term Support & SLA",
    badge: "Lifecycle Partnership",
    description:
      "Direct phone and remote access to qualified application engineers, guaranteed response SLAs, preventative maintenance packages, and guaranteed spare parts availability.",
    icon: Headphones,
  },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function SolutionsIndexPage() {
  const { openModal } = useModals();

  // --- State Hooks ---
  // Section 2: Selected Category tab
  const [selectedCategory, setSelectedCategory] = useState<"fixed" | "mobile" | "autonomous">("fixed");

  // Section 3: Industry Solutions Filter & Active Modal/Detail
  const [industryFilter, setIndustryFilter] = useState<string>("all");
  const [activeIndustry, setActiveIndustry] = useState<IndustrySolution>(INDUSTRY_SOLUTIONS[0]);
  const [industrySearchQuery, setIndustrySearchQuery] = useState<string>("");

  // Section 4: Solution Finder Interactive Selector
  const [selectedGoalId, setSelectedGoalId] = useState<string>("productivity");

  // Section 5: Use Case Filter Tabs & Search
  const [useCaseTab, setUseCaseTab] = useState<"fixed" | "mobile" | "autonomous">("fixed");
  const [useCaseSearch, setUseCaseSearch] = useState<string>("");

  // Section 6: Architecture Layer Interactive Inspector
  const [activeTierId, setActiveTierId] = useState<string>("orchestration");

  // Section 11: Enterprise Lead Gen Consultation Form
  const [formName, setFormName] = useState("");
  const [formCompany, setFormCompany] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formIndustry, setFormIndustry] = useState("Automotive & EV");
  const [formCategoryInterest, setFormCategoryInterest] = useState("Fixed Robotic Automation");
  const [formDetails, setFormDetails] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  // Filtered industries
  const filteredIndustries = useMemo(() => {
    return INDUSTRY_SOLUTIONS.filter((item) => {
      const matchesGroup = industryFilter === "all" || item.sectorGroup === industryFilter;
      if (!matchesGroup) return false;
      if (!industrySearchQuery.trim()) return true;
      const q = industrySearchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.challenge.toLowerCase().includes(q) ||
        item.automationSolution.toLowerCase().includes(q) ||
        item.businessOutcome.toLowerCase().includes(q)
      );
    });
  }, [industryFilter, industrySearchQuery]);

  // Filtered use cases
  const filteredUseCases = useMemo(() => {
    return INDUSTRIAL_USE_CASES.filter((item) => {
      const matchesCategory = item.category === useCaseTab;
      if (!matchesCategory) return false;
      if (!useCaseSearch.trim()) return true;
      const q = useCaseSearch.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.problem.toLowerCase().includes(q) ||
        item.solution.toLowerCase().includes(q) ||
        item.techStack.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [useCaseTab, useCaseSearch]);

  // Selected Solution Finder Goal
  const activeGoal = useMemo(() => {
    return IMPROVEMENT_GOALS.find((g) => g.id === selectedGoalId) || IMPROVEMENT_GOALS[0];
  }, [selectedGoalId]);

  // Active Architecture Tier
  const activeTier = useMemo(() => {
    return ARCHITECTURE_TIERS.find((t) => t.id === activeTierId) || ARCHITECTURE_TIERS[4];
  }, [activeTierId]);

  // Handle Enterprise Consultation Form Submission
  const handleConsultationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formCompany.trim() || !formEmail.trim()) {
      setFormError("Please fill in your name, company, and business email address.");
      return;
    }
    setFormError("");
    setFormSubmitted(true);
    openModal("engineer", {
      initialMessage: `Solutions Page Consultation Request:
Name: ${formName}
Company: ${formCompany}
Work Email: ${formEmail}
Phone: ${formPhone}
Industry: ${formIndustry}
Automation Category: ${formCategoryInterest}
Project Scope: ${formDetails}`,
    });
  };

  return (
    <div className="min-h-screen bg-[#05070B] text-slate-100 font-sans selection:bg-[#00F0FF] selection:text-black antialiased relative overflow-hidden">
      {/* Precision Blueprint Grid Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Atmospheric Industrial Glow Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-b from-[#0062FF]/15 via-[#00F0FF]/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-[28%] right-0 w-[600px] h-[600px] bg-[#00F0FF]/5 blur-3xl pointer-events-none" />
      <div className="absolute top-[62%] left-0 w-[600px] h-[600px] bg-[#0062FF]/8 blur-3xl pointer-events-none" />

      {/* ==================================================================== */}
      {/* SECTION 1: ENTERPRISE HERO                                           */}
      {/* ==================================================================== */}
      <section className="relative pt-24 pb-20 px-6 max-w-7xl mx-auto border-b border-white/[0.07]">
        {/* Top Enterprise Badging */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0A1224] border border-[#00F0FF]/30 text-xs font-mono text-[#00F0FF] tracking-wider uppercase mb-8 shadow-lg shadow-[#00F0FF]/5">
          <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-ping" />
          <span>Industrial Robotics &amp; Intelligent Automation</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300">Industry 4.0 Ecosystems</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Copy */}
          <div className="lg:col-span-7">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12] mb-6">
              Industrial Robotics &amp;{" "}
              <span className="bg-gradient-to-r from-[#00F0FF] via-[#38BDF8] to-[#0062FF] bg-clip-text text-transparent">
                Intelligent Automation
              </span>{" "}
              Solutions
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl mb-8 font-light">
              From fixed robotic workcells to autonomous factory ecosystems, we deliver automation solutions that improve
              productivity, quality, safety, and operational performance.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 items-center mb-10">
              <Button
                onClick={() =>
                  openModal("engineer", {
                    initialMessage: "Solutions Page Inquiry: Enterprise Automation Consultation",
                  })
                }
                size="lg"
                className="bg-gradient-to-r from-[#00F0FF] to-[#0062FF] hover:from-[#00E0EF] hover:to-[#0052DF] text-black font-semibold text-base px-8 h-12 shadow-lg shadow-[#00F0FF]/20 cursor-pointer border-0"
              >
                Book Consultation
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <a
                href="#automation-categories"
                className="inline-flex items-center justify-center px-6 h-12 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 hover:text-white border border-white/10 hover:border-[#00F0FF]/40 text-base font-medium transition-colors"
              >
                Explore Solutions
                <ChevronDown className="w-4 h-4 ml-2 text-[#00F0FF]" />
              </a>
            </div>

            {/* Micro Trust Stats */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/[0.08] max-w-xl">
              <div>
                <div className="text-2xl font-bold font-mono text-white">40%+</div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">Productivity Gain</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono text-[#00F0FF]">±0.02 mm</div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">Kinematic Precision</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono text-white">24/7</div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">Continuous Duty</div>
              </div>
            </div>
          </div>

          {/* Hero Interactive Smart Factory Animated Visualization */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl bg-[#0A101D] border border-white/10 p-6 shadow-2xl overflow-hidden group">
              {/* Top Telemetry Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono font-medium tracking-wider text-slate-300">
                    DIGITAL TWIN FACTORY // LIVE
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[#00F0FF] bg-[#00F0FF]/10 px-2 py-0.5 rounded border border-[#00F0FF]/30">
                  LATENCY: 3.8ms
                </span>
              </div>

              {/* Animated Graphic Canvas: Smart Factory Layout */}
              <div className="relative h-64 sm:h-72 w-full rounded-xl bg-[#060A14] border border-white/[0.06] overflow-hidden flex items-center justify-center">
                {/* Factory Grid Background */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `radial-gradient(#00F0FF 1px, transparent 1px)`,
                    backgroundSize: "20px 20px",
                  }}
                />

                {/* SVG Visual Elements: Fixed Arms, Mobile AMRs, Digital Twin Axes, AI Vision */}
                <svg className="w-full h-full relative z-10" viewBox="0 0 400 280">
                  <defs>
                    <linearGradient id="wireframeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#0062FF" stopOpacity="0.2" />
                    </linearGradient>
                    <radialGradient id="laserGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#00F0FF" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Factory Floor Transit Tracks */}
                  <line x1="40" y1="210" x2="360" y2="210" stroke="#00F0FF" strokeOpacity="0.25" strokeDasharray="4 4" />
                  <line x1="40" y1="130" x2="360" y2="130" stroke="#0062FF" strokeOpacity="0.2" strokeDasharray="4 4" />

                  {/* Station 1: Fixed Robotic Welding Workcell (Left) */}
                  <g transform="translate(60, 90)">
                    {/* Base Pedestal */}
                    <rect x="0" y="70" width="40" height="20" rx="3" fill="#131B2E" stroke="#00F0FF" strokeWidth="1.2" />
                    {/* Articulated Arm Segments */}
                    <path
                      d="M20 70 L20 40 L45 20 L65 35"
                      fill="none"
                      stroke="#00F0FF"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    {/* Joint pivots */}
                    <circle cx="20" cy="70" r="4.5" fill="#0062FF" stroke="#00F0FF" strokeWidth="1.5" />
                    <circle cx="20" cy="40" r="4" fill="#0062FF" stroke="#00F0FF" strokeWidth="1.5" />
                    <circle cx="45" cy="20" r="4" fill="#0062FF" stroke="#00F0FF" strokeWidth="1.5" />
                    {/* Tooling Torch Arc Flash */}
                    <circle cx="65" cy="35" r="7" fill="url(#laserGlow)" className="animate-pulse" />
                    <line x1="65" y1="35" x2="70" y2="50" stroke="#00F0FF" strokeWidth="2" strokeDasharray="2 2" />
                    <text x="0" y="105" fill="#94A3B8" fontSize="9" fontFamily="monospace">FIXED WORKCELL A-1</text>
                  </g>

                  {/* Station 2: Mobile AMR on Grid Path (Center-Right) */}
                  <g transform="translate(200, 185)">
                    {/* AMR Chassis */}
                    <rect x="0" y="0" width="55" height="28" rx="5" fill="#0F172A" stroke="#0062FF" strokeWidth="1.8" />
                    {/* Drive Wheels */}
                    <rect x="-3" y="6" width="4" height="16" rx="2" fill="#00F0FF" />
                    <rect x="54" y="6" width="4" height="16" rx="2" fill="#00F0FF" />
                    {/* Dynamic LiDAR Sweep Arc */}
                    <path
                      d="M27 0 A 26 26 0 0 1 50 14"
                      fill="none"
                      stroke="#00F0FF"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                      className="animate-spin"
                      style={{ transformOrigin: "27px 14px" }}
                    />
                    <circle cx="27" cy="14" r="3" fill="#00F0FF" />
                    <text x="-5" y="42" fill="#38BDF8" fontSize="9" fontFamily="monospace">AMR-04 [VDA 5050]</text>
                  </g>

                  {/* Station 3: Edge AI Vision Inspection Station (Top Right) */}
                  <g transform="translate(260, 40)">
                    {/* Camera Mount */}
                    <rect x="25" y="0" width="30" height="18" rx="3" fill="#131B2E" stroke="#38BDF8" strokeWidth="1.2" />
                    <circle cx="40" cy="9" r="4" fill="#00F0FF" />
                    {/* Vision Inspection Cone */}
                    <polygon points="40,18 10,75 70,75" fill="#00F0FF" fillOpacity="0.08" stroke="#00F0FF" strokeWidth="0.8" strokeDasharray="3 3" />
                    {/* Inspected Target Bounding Box */}
                    <rect x="25" y="65" width="30" height="15" rx="2" fill="#0F172A" stroke="#22C55E" strokeWidth="1.2" />
                    <text x="18" y="94" fill="#22C55E" fontSize="9" fontFamily="monospace">AI CONFIDENCE: 99.8%</text>
                  </g>

                  {/* Connected Data Stream Vectors */}
                  <path
                    d="M100 80 Q 180 50 260 50"
                    fill="none"
                    stroke="#00F0FF"
                    strokeWidth="1"
                    strokeDasharray="2 4"
                    strokeOpacity="0.6"
                  />
                  <path
                    d="M230 185 Q 260 140 280 60"
                    fill="none"
                    stroke="#0062FF"
                    strokeWidth="1"
                    strokeDasharray="2 4"
                    strokeOpacity="0.6"
                  />
                </svg>

                {/* Live Factory Status HUD Pill */}
                <div className="absolute bottom-3 left-3 bg-[#0A1224]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-3 text-xs font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">LINE OEE:</span>
                    <span className="text-emerald-400 font-bold">96.4%</span>
                  </div>
                  <span className="text-slate-600">|</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">ACTIVE FLEET:</span>
                    <span className="text-[#00F0FF] font-bold">18 UNITS</span>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Features */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/[0.08] text-[11px] font-mono text-slate-300">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00F0FF]" />
                  <span>ISO 10218 Safe</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00F0FF]" />
                  <span>VDA 5050 Fleet</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00F0FF]" />
                  <span>NVIDIA AI Edge</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      
      {/* ==================================================================== */}
      {/* FLAGSHIP INTELLIGENT ROBOTICS SOLUTIONS (6 CORE APPLICATIONS)        */}
      {/* ==================================================================== */}
      <section id="intelligent-robotics" className="py-20 px-6 max-w-7xl mx-auto border-b border-white/[0.07]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-xs font-mono font-bold uppercase tracking-widest text-[#00F0FF] mb-3">
              <span className="size-1.5 rounded-full bg-[#00F0FF] animate-pulse" />
              <span>INDUS INTELLIGENT ROBOTICS SOLUTIONS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Engineering Intelligent Robots for Real-World Challenges
            </h2>
            <p className="mt-3 text-slate-300 text-base max-w-2xl leading-relaxed">
              Explore six autonomous robotics applications engineered for critical sectors—from smart infrastructure and healthcare to agriculture, railway networks, and warehouse logistics.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400">6 Specialized Architectures</span>
          </div>
        </div>

        {/* 3 Columns × 2 Rows Solution Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              id: "smart-waste-collection-robot",
              category: "Smart Infrastructure",
              title: "Smart Waste Collection Robot",
              description: "AI-based waste detection, object recognition, and automated urban & facility garbage collection.",
              href: "/solutions/smart-waste-collection-robot",
              icon: Trash2,
              capabilities: ["AI Waste Detection", "Camera Object Recognition", "Smart Navigation", "Waste Classification"],
              color: "from-emerald-950/40 to-slate-900/60 border-emerald-500/30 hover:border-emerald-400/70",
              accentColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
            },
            {
              id: "hospital-delivery-robot",
              category: "Healthcare Robotics",
              title: "Hospital Delivery Robot",
              description: "Autonomous indoor intralogistics for medicines, sterile supplies, documents, and lab reports.",
              href: "/solutions/hospital-delivery-robot",
              icon: Stethoscope,
              capabilities: ["Indoor Navigation", "Medicine Transport", "Department Routing", "RFID Badge Security"],
              color: "from-blue-950/40 to-slate-900/60 border-blue-500/30 hover:border-blue-400/70",
              accentColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
            },
            {
              id: "agricultural-crop-monitoring-robot",
              category: "Agricultural Robotics",
              title: "Agricultural Crop Monitoring Robot",
              description: "AI-powered crop health monitoring with multispectral imaging, disease detection, and field telemetry.",
              href: "/solutions/agricultural-crop-monitoring-robot",
              icon: Sprout,
              capabilities: ["Plant Disease Detection", "Leaf Image Analysis", "Multispectral Sensors", "Rough Field Travel"],
              color: "from-lime-950/40 to-slate-900/60 border-lime-500/30 hover:border-lime-400/70",
              accentColor: "text-lime-400 bg-lime-500/10 border-lime-500/20",
            },
            {
              id: "railway-track-inspection-robot",
              category: "Railway Robotics",
              title: "Railway Track Inspection Robot",
              description: "Vision and sensor-based rail inspection for crack, defect, and fastener maintenance detection.",
              href: "/solutions/railway-track-inspection-robot",
              icon: TrainTrack,
              capabilities: ["Camera Track Inspection", "Crack Profilometry", "GPS/Chainage Tagging", "Maintenance Alerts"],
              color: "from-amber-950/40 to-slate-900/60 border-amber-500/30 hover:border-amber-400/70",
              accentColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
            },
            {
              id: "warehouse-inventory-robot",
              category: "Logistics Robotics",
              title: "Warehouse Inventory Robot",
              description: "RFID and computer vision stock auditing with automated barcode recognition and WMS syncing.",
              href: "/solutions/warehouse-inventory-robot",
              icon: Boxes,
              capabilities: ["UHF RFID Scanning", "Barcode/QR Matrix", "High-Bay Mast Reach", "WMS Live Ledger Sync"],
              color: "from-cyan-950/40 to-slate-900/60 border-cyan-500/30 hover:border-cyan-400/70",
              accentColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
            },
            {
              id: "elderly-assistance-robot",
              category: "Assistive Robotics",
              title: "Elderly Assistance Robot",
              description: "Caregiver support platform offering scheduled medication reminders, emergency alerts, and voice communication.",
              href: "/solutions/elderly-assistance-robot",
              icon: HeartHandshake,
              capabilities: ["Medication Reminders", "Fall Alert Sequence", "Two-Way Video Call", "Caregiver App Sync"],
              color: "from-purple-950/40 to-slate-900/60 border-purple-500/30 hover:border-purple-400/70",
              accentColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
            },
          ].map((robot) => {
            const Icon = robot.icon;
            return (
              <div
                key={robot.id}
                className={`group relative flex flex-col justify-between rounded-2xl border bg-gradient-to-b ${robot.color} p-7 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {robot.category}
                    </span>
                    <span className={`size-10 rounded-xl flex items-center justify-center border ${robot.accentColor} group-hover:scale-110 transition-transform`}>
                      <Icon size={20} />
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-[#00F0FF] transition-colors leading-snug">
                    {robot.title}
                  </h3>
                  <p className="mt-2.5 text-xs text-slate-300 leading-relaxed">
                    {robot.description}
                  </p>

                  <div className="mt-5 pt-4 border-t border-white/10 space-y-1.5">
                    {robot.capabilities.map((cap, cIdx) => (
                      <div key={cIdx} className="flex items-center gap-2 text-[11.5px] font-mono text-slate-300">
                        <span className="size-1 rounded-full bg-[#00F0FF]" />
                        <span>{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <Link
                    to={robot.href as never}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#00F0FF] hover:underline group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Explore Solution</span>
                    <ArrowRight size={13} />
                  </Link>
                  <span className="text-[10px] font-mono text-slate-500">
                    INDUS ROBOTICS
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 2: AUTOMATION CATEGORIES (3 MAJOR PILLARS)                   */}
      {/* ==================================================================== */}
      <section id="automation-categories" className="py-24 px-6 max-w-7xl mx-auto border-b border-white/[0.07]">
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-mono text-[#00F0FF] tracking-wider uppercase mb-3">
            // THREE MAJOR AUTOMATION PILLARS
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Robotics Architectures Built for Scalable Manufacturing
          </h2>
          <p className="text-slate-300 text-lg leading-relaxed">
            Industrial transformation is not monolithic. We engineer three distinct pillars of automation—fixed, mobile,
            and autonomous—that operate independently or converge into unified smart factories.
          </p>
        </div>

        {/* 3 Pillars Selector Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {AUTOMATION_CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category.id;
            return (
              <div
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`relative rounded-2xl bg-gradient-to-b from-[#0D1527] to-[#070B14] p-8 border transition-all duration-300 cursor-pointer flex flex-col justify-between group ${
                  isSelected
                    ? "border-[#00F0FF] shadow-xl shadow-[#00F0FF]/10 scale-[1.02]"
                    : "border-white/10 hover:border-white/20 hover:scale-[1.01]"
                }`}
              >
                {/* Glow accent */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-b ${category.glowClass} pointer-events-none opacity-50`}
                />

                <div className="relative z-10">
                  {/* Top Bar with Number & Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-3xl font-extrabold text-slate-500 group-hover:text-[#00F0FF] transition-colors">
                      {category.letter}
                    </span>
                    <span className="text-[10px] font-mono tracking-wider px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-slate-300 uppercase">
                      {category.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#00F0FF] transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-xs font-mono text-[#38BDF8] mb-4">{category.tagline}</p>
                  <p className="text-sm text-slate-300 leading-relaxed mb-6">{category.description}</p>

                  {/* Examples List */}
                  <div className="mb-6 pt-4 border-t border-white/[0.08]">
                    <div className="text-xs font-mono text-slate-400 mb-2 uppercase tracking-wide">
                      Core Implementations:
                    </div>
                    <ul className="space-y-1.5">
                      {category.examples.slice(0, 4).map((ex, idx) => (
                        <li key={idx} className="text-xs text-slate-300 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]" />
                          <span>{ex}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Business Value Highlight */}
                  <div className="mb-6 pt-4 border-t border-white/[0.08]">
                    <div className="text-xs font-mono text-slate-400 mb-2 uppercase tracking-wide">
                      Business Value:
                    </div>
                    <ul className="space-y-2">
                      {category.businessValue.map((val, idx) => (
                        <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{val}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom KPIs */}
                <div className="relative z-10 pt-4 border-t border-white/[0.08] grid grid-cols-3 gap-2">
                  {category.kpis.map((kpi, idx) => (
                    <div key={idx} className="text-center bg-black/30 p-2 rounded-lg border border-white/[0.04]">
                      <div className="text-xs font-bold font-mono text-[#00F0FF]">{kpi.value}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{kpi.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Deep Dive Action Bar */}
        <div className="mt-12 p-6 rounded-2xl bg-[#0A101D] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center justify-center text-[#00F0FF]">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="text-white font-semibold text-base">Looking for a hybrid cross-category deployment?</div>
              <div className="text-slate-400 text-sm">
                Most top-tier enterprises deploy fixed cells tended by AMRs and overseen by autonomous AI inspection.
              </div>
            </div>
          </div>
          <Button
            onClick={() =>
              openModal("engineer", {
                initialMessage: "Request Architecture Consultation: Multi-Pillar Robotics Strategy",
              })
            }
            className="bg-[#00F0FF] hover:bg-[#00E0EF] text-black font-semibold shrink-0 cursor-pointer"
          >
            Request System Architecture
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 3: INDUSTRY SOLUTIONS (15 INTERACTIVE SECTOR CARDS)           */}
      {/* ==================================================================== */}
      <section id="industry-solutions" className="py-24 px-6 max-w-7xl mx-auto border-b border-white/[0.07]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="text-xs font-mono text-[#00F0FF] tracking-wider uppercase mb-3">
              // INDUSTRY-SPECIFIC AUTOMATION
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
              Engineered for Your Industry's Operating Environment
            </h2>
            <p className="text-slate-300 text-base max-w-2xl">
              From Class 1 cleanroom semiconductors to heavy underground mining and ATEX explosion zones, our systems
              comply with strict domain certifications and environmental constraints.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search industries, challenges..."
              value={industrySearchQuery}
              onChange={(e) => setIndustrySearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-[#0A101D] border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#00F0FF]"
            />
          </div>
        </div>

        {/* Sector Group Tabs */}
        <div className="flex flex-wrap gap-2 mb-10 pb-4 border-b border-white/[0.08]">
          {[
            { id: "all", label: "All 15 Industries" },
            { id: "Advanced Manufacturing", label: "Advanced Manufacturing" },
            { id: "Process & Regulated", label: "Process & Regulated" },
            { id: "Logistics & Commerce", label: "Logistics & Commerce" },
            { id: "Heavy & Resources", label: "Heavy & Resources" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setIndustryFilter(tab.id)}
              className={`px-4 py-2 rounded-lg text-xs font-mono tracking-wider transition-all cursor-pointer ${
                industryFilter === tab.id
                  ? "bg-[#00F0FF] text-black font-semibold shadow-md shadow-[#00F0FF]/20"
                  : "bg-[#0A101D] text-slate-300 hover:text-white border border-white/10 hover:border-white/20"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 15 Industry Cards Grid: Challenge -> Automation Solution -> Business Outcome */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIndustries.map((ind) => {
            const IconComponent = ind.icon;
            const isSelected = activeIndustry.id === ind.id;
            return (
              <div
                key={ind.id}
                onClick={() => setActiveIndustry(ind)}
                className={`relative rounded-2xl bg-[#090E1A] p-6 border transition-all duration-300 flex flex-col justify-between group cursor-pointer ${
                  isSelected
                    ? "border-[#00F0FF] bg-[#0C1424] shadow-lg shadow-[#00F0FF]/10 ring-1 ring-[#00F0FF]/40"
                    : "border-white/[0.08] hover:border-white/20 hover:bg-[#0B1120]"
                }`}
              >
                <div>
                  {/* Header with Icon, Name, and KPI Tag */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#00F0FF] group-hover:border-[#00F0FF]/40 transition-colors">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white group-hover:text-[#00F0FF] transition-colors">
                          {ind.name}
                        </h3>
                        <span className="text-[10px] font-mono text-slate-400">{ind.sectorGroup}</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                      {ind.referenceMetric}
                    </span>
                  </div>

                  {/* Flow: Challenge -> Automation Solution -> Business Outcome */}
                  <div className="space-y-3 my-4 text-xs">
                    {/* Challenge */}
                    <div className="p-3 rounded-lg bg-red-950/20 border border-red-500/20">
                      <div className="text-[10px] font-mono uppercase text-red-400 font-semibold mb-1 flex items-center gap-1.5">
                        <AlertCircle className="w-3 h-3" />
                        <span>The Challenge</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{ind.challenge}</p>
                    </div>

                    {/* Downward Connector arrow */}
                    <div className="flex justify-center -my-1 text-slate-500">
                      <ChevronDown className="w-4 h-4" />
                    </div>

                    {/* Automation Solution */}
                    <div className="p-3 rounded-lg bg-[#0062FF]/10 border border-[#0062FF]/30">
                      <div className="text-[10px] font-mono uppercase text-[#38BDF8] font-semibold mb-1 flex items-center gap-1.5">
                        <Cpu className="w-3 h-3" />
                        <span>Automation Solution</span>
                      </div>
                      <p className="text-slate-200 leading-relaxed">{ind.automationSolution}</p>
                    </div>

                    {/* Downward Connector arrow */}
                    <div className="flex justify-center -my-1 text-slate-500">
                      <ChevronDown className="w-4 h-4" />
                    </div>

                    {/* Business Outcome */}
                    <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20">
                      <div className="text-[10px] font-mono uppercase text-emerald-400 font-semibold mb-1 flex items-center gap-1.5">
                        <TrendingUp className="w-3 h-3" />
                        <span>Business Outcome</span>
                      </div>
                      <p className="text-slate-200 font-medium leading-relaxed">{ind.businessOutcome}</p>
                    </div>
                  </div>
                </div>

                {/* Footer Badges & Action */}
                <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {ind.keyTechnologies.slice(0, 2).map((tech, idx) => (
                      <span key={idx} className="text-[10px] font-mono text-slate-400 bg-white/[0.04] px-2 py-0.5 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal("engineer", {
                        initialMessage: `Industry Inquiry: Automation Assessment for ${ind.name}`,
                      });
                    }}
                    className="text-xs font-mono text-[#00F0FF] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Consult</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 4: SOLUTION FINDER (INTERACTIVE SELECTOR)                     */}
      {/* ==================================================================== */}
      <section id="solution-finder" className="py-24 px-6 max-w-7xl mx-auto border-b border-white/[0.07]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-mono text-[#00F0FF] tracking-wider uppercase mb-3">
            // INTERACTIVE SOLUTION FINDER
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            What Are You Trying to Improve?
          </h2>
          <p className="text-slate-300 text-base">
            Select your operational pain point to see our recommended robotics architecture, estimated ROI timeline,
            and proven technology stack.
          </p>
        </div>

        {/* Interactive Selector Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {IMPROVEMENT_GOALS.map((goal) => {
            const isSelected = selectedGoalId === goal.id;
            return (
              <button
                key={goal.id}
                onClick={() => setSelectedGoalId(goal.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-r from-[#00F0FF] to-[#0062FF] text-black font-semibold shadow-lg shadow-[#00F0FF]/25 scale-105"
                    : "bg-[#0A101D] text-slate-300 hover:text-white border border-white/10 hover:border-white/20"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isSelected ? "bg-black" : "bg-[#00F0FF]"}`} />
                <span>{goal.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Recommendation Card */}
        <div className="rounded-3xl bg-gradient-to-b from-[#0D1527] to-[#080D18] border border-[#00F0FF]/40 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          {/* Subtle Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#00F0FF]/10 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left: Recommended Architecture Breakdown */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-xs font-mono text-[#00F0FF] mb-4">
                <span>TARGET OBJECTIVE:</span>
                <span className="font-bold text-white uppercase">{activeGoal.label}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                Recommended Solution Framework
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 font-light">
                {activeGoal.description}
              </p>

              {/* Recommended Implementations */}
              <div className="mb-6">
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3">
                  Recommended Automation Systems:
                </div>
                <div className="space-y-2.5">
                  {activeGoal.recommendedSolutions.map((sol, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-xl bg-black/40 border border-white/[0.08]"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#00F0FF] shrink-0" />
                      <span className="text-sm font-medium text-slate-200">{sol}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Tech Stack Badges */}
              <div>
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                  Integrated Mechatronics &amp; Software Stack:
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeGoal.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-md bg-[#0062FF]/20 border border-[#0062FF]/40 text-xs font-mono text-[#38BDF8]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Quantified Outcomes & CTA */}
            <div className="lg:col-span-5 bg-[#060A14] rounded-2xl p-6 sm:p-8 border border-white/10 shadow-inner">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-4">
                Projected Business Metrics
              </div>

              {/* KPI 1 */}
              <div className="mb-6 pb-6 border-b border-white/[0.08]">
                <div className="text-xs text-slate-400 font-mono">EXPECTED OPERATIONAL IMPACT</div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400 mt-1">
                  {activeGoal.expectedKpi}
                </div>
              </div>

              {/* KPI 2 */}
              <div className="mb-8">
                <div className="text-xs text-slate-400 font-mono">ESTIMATED CAPITAL PAYBACK</div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#00F0FF] mt-1">
                  {activeGoal.paybackPeriod}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Based on two-shift continuous manufacturing operations
                </div>
              </div>

              {/* Action Button */}
              <Button
                onClick={() =>
                  openModal("engineer", {
                    initialMessage: `Solution Finder Plan: Request detailed proposal for [${activeGoal.label}] automation.`,
                  })
                }
                className="w-full bg-gradient-to-r from-[#00F0FF] to-[#0062FF] hover:from-[#00E0EF] hover:to-[#0052DF] text-black font-bold h-12 text-sm shadow-lg shadow-[#00F0FF]/20 cursor-pointer"
              >
                Configure Custom Solution
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 5: INDUSTRIAL USE CASES (BY AUTOMATION TYPE)                  */}
      {/* ==================================================================== */}
      <section id="use-cases" className="py-24 px-6 max-w-7xl mx-auto border-b border-white/[0.07]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="text-xs font-mono text-[#00F0FF] tracking-wider uppercase mb-3">
              // PRODUCTION PROVEN USE CASES
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
              Industrial Use Cases by Robotics Category
            </h2>
            <p className="text-slate-300 text-base max-w-2xl">
              Every production challenge requires a dedicated mechanical and digital methodology. Explore our turnkey use
              cases detailing problem, solution, technology stack, business impact, and ROI benefits.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search welding, AMRs, inspection..."
              value={useCaseSearch}
              onChange={(e) => setUseCaseSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-[#0A101D] border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#00F0FF]"
            />
          </div>
        </div>

        {/* 3 Major Category Tabs */}
        <div className="flex gap-3 mb-10 pb-4 border-b border-white/[0.08]">
          {[
            { id: "fixed", label: "Fixed Robotics (Welding, Assembly, CNC, Packaging)" },
            { id: "mobile", label: "Mobile Robotics (AMRs, AGVs, Logistics, Fleet)" },
            { id: "autonomous", label: "Autonomous Robotics (AI Vision, Smart Warehouse, Predictive)" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setUseCaseTab(tab.id as any)}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-mono tracking-wider transition-all cursor-pointer ${
                useCaseTab === tab.id
                  ? "bg-[#00F0FF] text-black font-semibold shadow-md shadow-[#00F0FF]/25"
                  : "bg-[#0A101D] text-slate-300 hover:text-white border border-white/10 hover:border-white/20"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Use Cases Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredUseCases.map((uc) => (
            <div
              key={uc.id}
              className="rounded-2xl bg-gradient-to-b from-[#0C1222] to-[#070B14] p-8 border border-white/10 hover:border-[#00F0FF]/50 transition-all duration-300 flex flex-col justify-between group shadow-xl"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono tracking-wider px-3 py-1 rounded-full bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 uppercase">
                    {uc.tag}
                  </span>
                  <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                    VERIFIED ROI
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-6 group-hover:text-[#00F0FF] transition-colors">
                  {uc.title}
                </h3>

                {/* Problem vs Solution Split */}
                <div className="space-y-4 mb-6">
                  {/* Problem */}
                  <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/20">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-red-400 font-bold mb-1 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>The Industrial Problem</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{uc.problem}</p>
                  </div>

                  {/* Solution */}
                  <div className="p-4 rounded-xl bg-[#0062FF]/10 border border-[#0062FF]/30">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#38BDF8] font-bold mb-1 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5" />
                      <span>Turnkey Automation Solution</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">{uc.solution}</p>
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="mb-6">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2">
                    Technology Stack:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {uc.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-mono px-2.5 py-1 rounded bg-white/[0.04] border border-white/[0.08] text-slate-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Business Impact & ROI */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-black/40 border border-white/[0.06] mb-6">
                  <div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                      Business Impact:
                    </div>
                    <p className="text-xs text-slate-200 font-medium leading-relaxed">{uc.businessImpact}</p>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-[#00F0FF] uppercase tracking-wider mb-1">
                      ROI Benefit:
                    </div>
                    <p className="text-xs text-slate-200 font-medium leading-relaxed">{uc.roiBenefits}</p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500">TURNKEY COMMISSIONING</span>
                <Button
                  onClick={() =>
                    openModal("engineer", {
                      initialMessage: `Use Case Inquiry: Request technical specification for [${uc.title}]`,
                    })
                  }
                  size="sm"
                  className="bg-white/[0.06] hover:bg-[#00F0FF] hover:text-black text-slate-200 border border-white/10 hover:border-[#00F0FF] text-xs font-mono cursor-pointer transition-colors"
                >
                  Request Technical Spec
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 6: AUTOMATION ARCHITECTURE (ENTERPRISE 7-TIER DIAGRAM)        */}
      {/* ==================================================================== */}
      <section id="automation-architecture" className="py-24 px-6 max-w-7xl mx-auto border-b border-white/[0.07]">
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-mono text-[#00F0FF] tracking-wider uppercase mb-3">
            // FULL-STACK ENTERPRISE INTEGRATION
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Industrial Automation Architecture: ERP to Shopfloor
          </h2>
          <p className="text-slate-300 text-lg leading-relaxed">
            True automation bridges the chasm between corporate ERP systems and physical robot actuators. Our reference
            architecture provides seamless, secure, and deterministic communication across all 7 operational tiers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: 7-Tier Vertical Flow Stack */}
          <div className="lg:col-span-5 space-y-3">
            {ARCHITECTURE_TIERS.map((tier, idx) => {
              const isSelected = activeTierId === tier.id;
              return (
                <div
                  key={tier.id}
                  onClick={() => setActiveTierId(tier.id)}
                  className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer flex items-center justify-between group ${
                    isSelected
                      ? "bg-gradient-to-r from-[#0062FF]/20 to-[#00F0FF]/15 border-[#00F0FF] shadow-lg shadow-[#00F0FF]/10 scale-[1.02]"
                      : "bg-[#090E1A] border-white/[0.08] hover:border-white/20 hover:bg-[#0C1322]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-mono px-2 py-0.5 rounded border ${
                        isSelected
                          ? "bg-[#00F0FF] text-black font-bold border-[#00F0FF]"
                          : "bg-white/[0.05] text-slate-400 border-white/10"
                      }`}
                    >
                      {tier.tierNumber}
                    </span>
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-[#00F0FF] transition-colors">
                        {tier.name}
                      </div>
                      <div className="text-[11px] text-slate-400">{tier.subtitle}</div>
                    </div>
                  </div>

                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      isSelected ? "text-[#00F0FF] translate-x-1" : "text-slate-600"
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* Right: Selected Layer Interactive Deep Dive Card */}
          <div className="lg:col-span-7 rounded-2xl bg-gradient-to-b from-[#0D1527] to-[#070B14] p-8 border border-[#00F0FF]/40 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-6 border-b border-white/[0.08] mb-6">
              <div>
                <span className="text-xs font-mono text-[#00F0FF] tracking-wider uppercase">
                  {activeTier.tierNumber} SPECIFICATION
                </span>
                <h3 className="text-2xl font-extrabold text-white mt-1">{activeTier.name}</h3>
                <p className="text-xs text-slate-400">{activeTier.subtitle}</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                SECURE &amp; STANDARDIZED
              </span>
            </div>

            {/* Summary */}
            <p className="text-slate-300 text-sm leading-relaxed mb-6 font-light">{activeTier.summary}</p>

            {/* Protocols Grid */}
            <div className="mb-6">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                Supported Industrial Protocols:
              </div>
              <div className="flex flex-wrap gap-2">
                {activeTier.protocols.map((proto, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-md bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-xs font-mono text-[#00F0FF]"
                  >
                    {proto}
                  </span>
                ))}
              </div>
            </div>

            {/* Responsibilities */}
            <div className="mb-6">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                Key Architectural Responsibilities:
              </div>
              <ul className="space-y-2">
                {activeTier.responsibilities.map((resp, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Telemetry Stream simulation banner */}
            <div className="p-4 rounded-xl bg-black/50 border border-white/[0.08]">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-[#00F0FF] animate-pulse" />
                <span>Simulated Data Flow Packet</span>
              </div>
              <div className="text-xs font-mono text-slate-200">{activeTier.telemetryStream}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 7: BUSINESS OUTCOMES (LARGE KPI CARDS)                        */}
      {/* ==================================================================== */}
      <section id="business-outcomes" className="py-24 px-6 max-w-7xl mx-auto border-b border-white/[0.07]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-mono text-[#00F0FF] tracking-wider uppercase mb-3">
            // MEASURABLE FINANCIAL & OPERATIONAL OUTCOMES
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Proven ROI Delivered to Plant Leadership
          </h2>
          <p className="text-slate-300 text-base">
            We don't measure success by robot hardware sold; we measure success by cycle-time shaving, scrap elimination,
            and rapid capital payback verified across hundreds of thousands of operational hours.
          </p>
        </div>

        {/* 6 Large KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BUSINESS_OUTCOMES.map((kpi, idx) => (
            <div
              key={idx}
              className="relative rounded-2xl bg-gradient-to-b from-[#0D1527] to-[#070B14] p-8 border border-white/10 hover:border-[#00F0FF]/50 transition-all duration-300 flex flex-col justify-between group shadow-xl"
            >
              <div>
                <span className="text-[10px] font-mono text-[#00F0FF] uppercase tracking-wider bg-[#00F0FF]/10 px-2.5 py-1 rounded border border-[#00F0FF]/30">
                  {kpi.impactArea}
                </span>

                {/* Big Metric Display */}
                <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-white group-hover:text-[#00F0FF] transition-colors my-4">
                  {kpi.metric}
                </div>

                <h3 className="text-xl font-bold text-slate-100 mb-2">{kpi.label}</h3>

                <p className="text-xs text-slate-300 leading-relaxed mb-6 font-light">{kpi.description}</p>
              </div>

              {/* Benchmark Footnote */}
              <div className="pt-4 border-t border-white/[0.08]">
                <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{kpi.benchmark}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 8: INDUSTRY 4.0 CAPABILITIES (9 CAPABILITY GRID)              */}
      {/* ==================================================================== */}
      <section id="capabilities" className="py-24 px-6 max-w-7xl mx-auto border-b border-white/[0.07]">
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-mono text-[#00F0FF] tracking-wider uppercase mb-3">
            // ADVANCED TECHNICAL CAPABILITY SUITE
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Industry 4.0 Capabilities Portfolio
          </h2>
          <p className="text-slate-300 text-lg leading-relaxed">
            Modern automation requires more than mechanical arms. Explore the 9 core technical disciplines our systems
            engineers bring to every industrial transformation initiative.
          </p>
        </div>

        {/* 9 Capability Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CAPABILITIES_LIST.map((cap) => {
            const IconComp = cap.icon;
            return (
              <div
                key={cap.id}
                className="rounded-2xl bg-[#090E1A] p-7 border border-white/[0.08] hover:border-[#00F0FF]/40 hover:bg-[#0C1424] transition-all duration-300 flex flex-col justify-between group shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#00F0FF] group-hover:border-[#00F0FF]/40 group-hover:scale-105 transition-all">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 tracking-wider uppercase bg-white/[0.03] px-2 py-0.5 rounded border border-white/[0.06]">
                      {cap.categoryBadge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#00F0FF] transition-colors">
                    {cap.title}
                  </h3>
                  <p className="text-xs font-mono text-[#38BDF8] mb-3">{cap.tagline}</p>
                  <p className="text-xs text-slate-300 leading-relaxed mb-6 font-light">{cap.description}</p>
                </div>

                {/* Technical Specs List */}
                <div className="pt-4 border-t border-white/[0.08]">
                  <ul className="space-y-1.5">
                    {cap.specs.map((spec, idx) => (
                      <li key={idx} className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-[#00F0FF]" />
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 9: DELIVERY METHODOLOGY (7-STAGE TIMELINE)                    */}
      {/* ==================================================================== */}
      <section id="delivery-methodology" className="py-24 px-6 max-w-7xl mx-auto border-b border-white/[0.07]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-mono text-[#00F0FF] tracking-wider uppercase mb-3">
            // TURNKEY EXECUTION LIFECYCLE
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Structured 7-Stage Delivery Methodology
          </h2>
          <p className="text-slate-300 text-base">
            From initial plant audit to long-term operational SLA, our engineering process guarantees predictable
            budgets, verified cycle times, and zero unpleasant surprises on launch day.
          </p>
        </div>

        {/* 7-Stage Roadmap Grid */}
        <div className="space-y-4">
          {DELIVERY_METHODOLOGY.map((step, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-[#090E1A] p-6 border border-white/[0.08] hover:border-[#00F0FF]/40 transition-all duration-300 grid grid-cols-1 md:grid-cols-12 gap-6 items-center group"
            >
              {/* Stage Number & Name */}
              <div className="md:col-span-4 flex items-center gap-4">
                <span className="text-3xl font-black font-mono text-slate-600 group-hover:text-[#00F0FF] transition-colors">
                  {step.stage}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-[#00F0FF] transition-colors">
                    {step.name}
                  </h3>
                  <span className="text-xs font-mono text-[#38BDF8]">{step.duration}</span>
                </div>
              </div>

              {/* Description */}
              <div className="md:col-span-5">
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">{step.description}</p>
              </div>

              {/* Deliverables Badges */}
              <div className="md:col-span-3">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                  Key Deliverables:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {step.deliverables.map((del, dIdx) => (
                    <span
                      key={dIdx}
                      className="text-[10px] font-mono bg-white/[0.04] border border-white/[0.08] px-2 py-0.5 rounded text-slate-300"
                    >
                      {del}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 10: WHY PRECISION MOTION SYSTEMS (8 PILLARS)                 */}
      {/* ==================================================================== */}
      <section id="why-precision-motion" className="py-24 px-6 max-w-7xl mx-auto border-b border-white/[0.07]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-mono text-[#00F0FF] tracking-wider uppercase mb-3">
            // TRUST &amp; ENTERPRISE CREDIBILITY
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Why Global Manufacturers Choose Precision Motion Systems
          </h2>
          <p className="text-slate-300 text-base">
            We partner with operational leaders to execute high-stakes automation initiatives with zero tolerance for
            downtime, rework, or uncertified engineering shortcuts.
          </p>
        </div>

        {/* 8 Pillars Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {WHY_CHOOSE_US.map((pillar, idx) => {
            const IconC = pillar.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-gradient-to-b from-[#0D1527] to-[#070B14] p-6 border border-white/10 hover:border-[#00F0FF]/50 transition-all duration-300 flex flex-col justify-between group shadow-xl"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#00F0FF] group-hover:scale-110 transition-transform mb-4">
                    <IconC className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono text-[#38BDF8] uppercase tracking-wider block mb-1">
                    {pillar.badge}
                  </span>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#00F0FF] transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-light">{pillar.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Industrial Certifications & Compliance Banner */}
        <div className="rounded-2xl bg-[#090E1A] p-8 border border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="text-xs font-mono text-[#00F0FF] uppercase tracking-wider mb-1">
              GLOBAL SAFETY &amp; QUALITY STANDARDS COMPLIANCE
            </div>
            <div className="text-white font-bold text-lg">
              Engineered and certified in strict accordance with international robotics norms:
            </div>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            {["ISO 10218-1/2", "ISO 13849-1 (PL e)", "ISO 3691-4 (AMR Safety)", "SEMI S2 / S8", "CE Mark", "UL 508A", "ANSI / RIA 15.06"].map(
              (cert, cIdx) => (
                <span
                  key={cIdx}
                  className="px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs font-mono font-bold text-slate-300"
                >
                  {cert}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 11: FINAL CONVERSION CTA (REQUEST ASSESSMENT / CONSULTATION)  */}
      {/* ==================================================================== */}
      <section id="consultation" className="py-24 px-6 max-w-5xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-b from-[#0E1529] via-[#090E1D] to-[#05070B] border border-[#00F0FF]/40 p-8 sm:p-14 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          {/* Background Ambient Glow */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#00F0FF]/15 blur-3xl pointer-events-none" />

          <div className="text-center max-w-3xl mx-auto mb-10 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-xs font-mono text-[#00F0FF] mb-4">
              <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-ping" />
              <span>TRANSFORMATION PARTNER</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
              Ready to Build the Future of Industrial Automation?
            </h2>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-light">
              Whether implementing a robotic workcell, deploying a fleet of AMRs, or building a fully autonomous
              factory, Precision Motion Systems delivers intelligent automation solutions engineered for measurable
              business outcomes.
            </p>
          </div>

          {/* Quick Consultation Intake Form */}
          <form onSubmit={handleConsultationSubmit} className="relative z-10 space-y-4 max-w-2xl mx-auto">
            {formSubmitted ? (
              <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-white mb-1">Assessment Request Received</h3>
                <p className="text-sm text-slate-300">
                  A senior applications engineer will review your operating parameters and contact you within 24 hours
                  with initial feasibility insights.
                </p>
              </div>
            ) : (
              <>
                {formError && (
                  <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Marcus Vance"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#00F0FF]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Company / Plant *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex Powertrain Systems"
                      value={formCompany}
                      onChange={(e) => setFormCompany(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#00F0FF]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Work Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. m.vance@apexpower.com"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#00F0FF]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Direct Phone (Optional)</label>
                    <input
                      type="tel"
                      placeholder="e.g. +1 (555) 019-2834"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#00F0FF]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Primary Industry</label>
                    <select
                      value={formIndustry}
                      onChange={(e) => setFormIndustry(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg bg-[#0A101D] border border-white/10 text-white text-sm focus:outline-none focus:border-[#00F0FF]"
                    >
                      {INDUSTRY_SOLUTIONS.map((ind) => (
                        <option key={ind.id} value={ind.name} className="bg-[#0A101D] text-white">
                          {ind.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Primary Robotics Interest</label>
                    <select
                      value={formCategoryInterest}
                      onChange={(e) => setFormCategoryInterest(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg bg-[#0A101D] border border-white/10 text-white text-sm focus:outline-none focus:border-[#00F0FF]"
                    >
                      <option value="Fixed Robotic Automation">Fixed Robotic Automation (Welding, Assembly, CNC)</option>
                      <option value="Mobile Robotic Automation">Mobile Robotic Automation (AMRs, AGVs, Fleet)</option>
                      <option value="Autonomous Robotics">Autonomous Robotics (AI Vision, Predictive, Warehouse)</option>
                      <option value="Comprehensive Smart Factory">Comprehensive Industry 4.0 Transformation</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Project Scope / Target Cycle Time / Pain Point
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe your part sizes, target cycle times, existing machinery, or desired throughput improvement..."
                    value={formDetails}
                    onChange={(e) => setFormDetails(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    type="submit"
                    size="lg"
                    className="flex-1 bg-gradient-to-r from-[#00F0FF] to-[#0062FF] hover:from-[#00E0EF] hover:to-[#0052DF] text-black font-bold h-12 shadow-lg shadow-[#00F0FF]/25 cursor-pointer border-0"
                  >
                    Request Assessment
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      openModal("engineer", {
                        initialMessage:
                          "Priority Request: Direct Consultation with Senior Automation Application Engineer",
                      })
                    }
                    className="flex-1 border-white/20 hover:border-[#00F0FF] text-white hover:text-[#00F0FF] h-12 font-mono text-sm cursor-pointer"
                  >
                    <Headphones className="w-4 h-4 mr-2" />
                    Talk to an Automation Expert
                  </Button>
                </div>
              </>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}
