/**
 * Central Data Model for INDUS About Us Experience
 * Powers the TRUSTGRID.AI-inspired architecture:
 * - Foundational Engineering Pillars
 * - Deep-Tech Capability Stack (9 Cards)
 * - Engineering Philosophy (6 Principles)
 * - Robotics Safety & Reliability (8 Engineering Focus Areas)
 * - Co-Engineering Model (6 Sequential Stages)
 * - Engineering Milestone Roadmap (5 Progressive Stages)
 * - Robotics & Physical AI Impact (4 Impact Sectors)
 * - Global Presence & Engineering Network
 */

export interface EngineeringPillar {
  title: string;
  subtitle: string;
  description: string;
}

export const ENGINEERING_PILLARS: EngineeringPillar[] = [
  {
    title: "Precision Engineering",
    subtitle: "Sub-Arcminute Kinematic Accuracy",
    description:
      "Deterministic mechanical architectures, zero-backlash strain-wave gearing, and sub-micron optical encoders ensuring repeatable accuracy across multi-shift production.",
  },
  {
    title: "Intelligent Automation",
    subtitle: "Real-Time Deterministic Control",
    description:
      "Deterministic fieldbuses (EtherCAT CoE, PROFINET IRT) executing cyclic synchronous motion loops with sub-microsecond jitter and synchronized multi-axis coordination.",
  },
  {
    title: "Robotics Innovation",
    subtitle: "Physical AI & Embodied Intelligence",
    description:
      "Bridging digital simulations in NVIDIA Isaac Sim with physical hardware, testing adaptive trajectories, and implementing spatial AI models for autonomous tasks.",
  },
  {
    title: "Industrial Reliability",
    subtitle: "Engineered for 24/7 Multi-Shift Duty",
    description:
      "High-power brushless actuators, sealed IP67/IP69K housings, and thermal soak validation guaranteeing high uptime in harsh industrial environments.",
  },
  {
    title: "Application-Driven Design",
    subtitle: "Physics-First Kinematic Sizing",
    description:
      "Custom gear reductions, tailored flange adapters, and torque-inertia matching calculated specifically for the real mass, reach, and speed requirements of the workcell.",
  },
  {
    title: "Human-Centred Engineering",
    subtitle: "Safe Collaborative Operation",
    description:
      "Certified functional safety (ISO 13849-1, Cat 4 / PL e), dual-channel Safe Torque Off (STO), and power-force limiting mechanisms enabling safe operator interaction.",
  },
];

export interface CapabilityCardData {
  id: string;
  title: string;
  category: string;
  description: string;
  expertise: string[];
  href: string;
}

export const CAPABILITY_STACK: CapabilityCardData[] = [
  {
    id: "industrial-robotics",
    title: "Industrial Robotics",
    category: "Manipulators & Workcells",
    description:
      "High-speed 6-axis articulated arms, collaborative cobots, and high-throughput delta manipulators engineered for continuous welding, machine tending, and micro-assembly.",
    expertise: [
      "6-Axis Articulated Arms",
      "Collaborative Cobots",
      "Delta Manipulators",
      "Custom Tooling Cells",
    ],
    href: "/products/robotic-systems",
  },
  {
    id: "physical-ai",
    title: "Physical AI & Humanoid Robotics",
    category: "Embodied Intelligence",
    description:
      "Vision-Language-Action (VLA) models, spatial reasoning representations, and torque-controlled humanoid joint actuation for unstructured industrial environments.",
    expertise: [
      "VLA Model Architectures",
      "Spatial Reasoning",
      "Compliance Control",
      "Sim-to-Real Transfer",
    ],
    href: "/technology/physical-ai",
  },
  {
    id: "precision-motion",
    title: "Precision Motion Systems",
    category: "Kinematic Hardware",
    description:
      "Zero-backlash strain-wave gearheads, high-rigidity RV cycloidal drives, and precision planetary gearboxes delivering sub-arcminute lost motion accuracy.",
    expertise: [
      "Harmonic Reducers",
      "RV Cycloidal Drives",
      "Planetary Gearboxes",
      "Precision Ball Screws",
    ],
    href: "/products/motion-actuation",
  },
  {
    id: "robotics-simulation",
    title: "Simulation & Digital Engineering",
    category: "Virtual Commissioning",
    description:
      "Digital twin creation, dynamic cycle-time simulation, reach envelope validation, and physics-based load emulation to de-risk deployments prior to steel cutting.",
    expertise: [
      "Isaac Sim Digital Twins",
      "Finite Element Analysis",
      "Kinematic Validation",
      "Thermal Modeling",
    ],
    href: "/technology/digital-twin",
  },
  {
    id: "robot-perception",
    title: "Perception & Computer Vision",
    category: "Sensing & Feedback",
    description:
      "Real-time 3D depth sensors, structured-light surface profilometry, and low-latency feature extraction for automated bin-picking, seam tracking, and metrology.",
    expertise: [
      "3D Point-Cloud Processing",
      "Visual Servoing",
      "Sub-Millimeter SMT Inspection",
      "Hand-Eye Calibration",
    ],
    href: "/technology/sensors",
  },
  {
    id: "motion-control",
    title: "Motion Control & Mechatronics",
    category: "Servo Actuation",
    description:
      "High-density frameless BLDC torque motors, sub-microsecond synchronized multi-axis fieldbuses, and advanced field-oriented current control algorithms.",
    expertise: [
      "Deterministic EtherCAT CoE",
      "PROFINET IRT",
      "Field-Oriented Control (FOC)",
      "Dual Absolute Feedback",
    ],
    href: "/products/control-drives",
  },
  {
    id: "robotics-software",
    title: "Robotics Software Platforms",
    category: "Edge & Fleet Systems",
    description:
      "Enterprise ROS2 architecture, real-time DDS middleware, modular microservices, hardware abstraction layers (HAL), and cloud telemetry connectivity.",
    expertise: [
      "ROS2 Galactic/Humble",
      "DDS Middleware",
      "Hardware Abstraction (HAL)",
      "OTA Firmware Pipelines",
    ],
    href: "/technology/architecture-explorer",
  },
  {
    id: "automation-integration",
    title: "Industrial Automation & Integration",
    category: "Turnkey Implementation",
    description:
      "Turnkey robotic cells, customized vacuum/pneumatic end-effectors, safety perimeter architectures, and field integration with industrial PLCs.",
    expertise: [
      "Safety Envelope per ISO 13849",
      "End-Effector Design",
      "PLC Fieldbus Interfacing",
      "On-Site Commissioning",
    ],
    href: "/engineering-services/system-integration",
  },
  {
    id: "reliability-testing",
    title: "Robotics Reliability & Testing",
    category: "Metrology & Validation",
    description:
      "Continuous dyno endurance benchmarking, CMM metrology verification of gear geometries, and dynamic path repeatability validation per ISO 9283 standards.",
    expertise: [
      "CMM Sub-Micron Metrology",
      "Dynamic Dyno Test Benches",
      "ISO 9283 Pose Verification",
      "Thermal Soak Runs",
    ],
    href: "/engineering-services/technical-specifications",
  },
];

export interface PhilosophyPrinciple {
  number: string;
  title: string;
  description: string;
}

export const ENGINEERING_PHILOSOPHIES: PhilosophyPrinciple[] = [
  {
    number: "01",
    title: "Engineering First",
    description:
      "We design from physical first principles. Every torque curve, gear ratio, and stiffness calculation is verified through mathematical modeling before fabrication.",
  },
  {
    number: "02",
    title: "Precision by Design",
    description:
      "Precision cannot be an afterthought. Sub-micron encoder feedback, zero-backlash flexsplines, and stiff structural castings are engineered into the fundamental geometry.",
  },
  {
    number: "03",
    title: "Safety and Reliability",
    description:
      "Industrial automation demands predictable behavior. Functional safety interlocks, fail-safe holding brakes, and thermal stress buffers are built into every subsystem.",
  },
  {
    number: "04",
    title: "Application-Driven Innovation",
    description:
      "Technology exists to solve manufacturing bottlenecks. We develop hardware and software tailored directly to cycle times, washdown environments, and payload demands.",
  },
  {
    number: "05",
    title: "Intelligent Automation",
    description:
      "Deterministic hardware combined with physical AI and adaptive trajectory planning gives robotic cells the capability to handle variability without sacrificing speed.",
  },
  {
    number: "06",
    title: "Continuous Improvement",
    description:
      "Real-world operational telemetry feeds back into mechanical refinement, firmware optimizations, and life-cycle support for existing and future deployments.",
  },
];

export interface SafetyConsideration {
  title: string;
  focus: string;
  description: string;
}

export const SAFETY_CONSIDERATIONS: SafetyConsideration[] = [
  {
    title: "Functional Safety Architecture",
    focus: "ISO 13849-1 & IEC 62061",
    description:
      "Dual-channel safety circuits, Cat 4 / PL e architecture considerations, and verified safe inputs and outputs designed to prevent uncommanded motion.",
  },
  {
    title: "Motion Limits & Envelope Control",
    focus: "Safe Motion Monitoring",
    description:
      "Configurable software and hardware axis limits, Safe Limited Speed (SLS), and Safe Direction (SDI) monitoring to prevent boundary violations.",
  },
  {
    title: "Emergency Stop & Interlocks",
    focus: "Safe Torque Off (STO)",
    description:
      "Hardware-level Safe Torque Off (STO) integrated directly into servo inverters, isolating power from motor windings within milliseconds of trip signals.",
  },
  {
    title: "Collision Detection & Compliance",
    focus: "Dynamic Force Sensing",
    description:
      "Joint torque estimation and external force sensors triggering immediate dynamic deceleration upon unexpected resistance, protecting machinery and tooling.",
  },
  {
    title: "Sensor & Actuator Telemetry",
    focus: "Continuous Health Monitoring",
    description:
      "Real-time monitoring of motor winding temperatures, DC bus voltages, encoder signal integrity, and vibration anomalies across all active joints.",
  },
  {
    title: "Reliability & Endurance Testing",
    focus: "Accelerated Life Testing",
    description:
      "Subjecting gearheads and joint actuators to continuous high-torque duty cycles, reversing shocks, and thermal swings to model component longevity.",
  },
  {
    title: "System Validation Protocols",
    focus: "ISO 9283 Verification",
    description:
      "Laser interferometer and optical tracker validation of positional accuracy, multidirectional pose repeatability, and path velocity constancy.",
  },
  {
    title: "Preventive Maintenance Design",
    focus: "Predictive Analytics",
    description:
      "Lubrication life calculations, seal degradation modeling, and edge telemetry thresholds enabling proactive servicing prior to unplanned line stops.",
  },
];

export interface CoEngineeringStage {
  step: string;
  title: string;
  shortDesc: string;
  details: string[];
}

export const CO_ENGINEERING_STAGES: CoEngineeringStage[] = [
  {
    step: "01",
    title: "Application Discovery",
    shortDesc: "Understand manufacturing process, constraints & targets",
    details: [
      "Process flow analysis and spatial envelope assessment",
      "Payload, reach, cycle time, and takt requirements",
      "Environmental constraints (temperature, cleanroom, washdown)",
      "Target fieldbus and plant-wide PLC communication protocols",
    ],
  },
  {
    step: "02",
    title: "Engineering Assessment",
    shortDesc: "Evaluate mechanical, electrical & control sizing",
    details: [
      "Continuous and peak torque requirement calculations",
      "Dynamic inertia matching ratio evaluation (< 5:1)",
      "Gearhead reduction ratio and thermal dissipation analysis",
      "Safety perimeter and functional safety zoning review",
    ],
  },
  {
    step: "03",
    title: "System Architecture & Design",
    shortDesc: "Define configuration, components & integration",
    details: [
      "3D CAD assembly modeling and mounting flange design",
      "Selection of strain-wave, cycloidal, or planetary reducers",
      "Electrical cabinet single-line diagrams and power budgeting",
      "Custom vacuum, magnetic, or mechanical gripper interfaces",
    ],
  },
  {
    step: "04",
    title: "Simulation & Development",
    shortDesc: "Evaluate kinematic envelopes & virtual commissioning",
    details: [
      "Digital twin kinematic simulation in Isaac Sim",
      "Cycle-time verification and collision clearance analysis",
      "Finite Element Analysis (FEA) of structural brackets",
      "Preliminary EtherCAT master trajectory sequencing",
    ],
  },
  {
    step: "05",
    title: "Integration & Validation",
    shortDesc: "Bring hardware, firmware & automation together",
    details: [
      "Mechanical assembly and optical encoder calibration",
      "Servo drive parameter tuning and vibration suppression",
      "End-of-arm tooling testing with real workpieces",
      "ISO 9283 pose repeatability and load benchmark testing",
    ],
  },
  {
    step: "06",
    title: "Deployment & Lifecycle Support",
    shortDesc: "Commissioning, reliability & continuous improvement",
    details: [
      "On-site installation and fieldbus network commissioning",
      "Operator safety and maintenance documentation handover",
      "Spare parts inventory provisioning and wear monitoring",
      "Direct engineer-to-engineer ongoing support desk access",
    ],
  },
];

export interface RoadmapStage {
  stage: string;
  name: string;
  subtitle: string;
  points: string[];
}

export const ROADMAP_STAGES: RoadmapStage[] = [
  {
    stage: "Stage 01",
    name: "Application Feasibility",
    subtitle: "Understanding constraints & preliminary scoping",
    points: [
      "Manufacturing process understanding",
      "Technical specifications definition",
      "Physical and environmental constraints",
      "Initial feasibility and ROI assessment",
    ],
  },
  {
    stage: "Stage 02",
    name: "Engineering Design",
    subtitle: "Kinematic sizing & system architecture",
    points: [
      "Mechanical joint & link architecture",
      "Electrical and power distribution design",
      "Optimal robot manipulator selection",
      "Motion control & fieldbus network design",
    ],
  },
  {
    stage: "Stage 03",
    name: "Simulation & Validation",
    subtitle: "Virtual commissioning & stress modeling",
    points: [
      "Physics-based motion simulation",
      "Multi-axis path planning & smoothing",
      "Dynamic collision and reach analysis",
      "Finite Element structural validation",
    ],
  },
  {
    stage: "Stage 04",
    name: "Integration & Commissioning",
    subtitle: "Hardware realization & factory staging",
    points: [
      "Precision mechanical hardware assembly",
      "Fieldbus and firmware stack integration",
      "Full-system dry run and cycle testing",
      "Factory acceptance testing (FAT)",
    ],
  },
  {
    stage: "Stage 05",
    name: "Reliability & Optimization",
    subtitle: "Lifecycle engineering & performance tuning",
    points: [
      "Continuous operational performance evaluation",
      "Dynamic reliability & thermal verification",
      "Process optimization & cycle trimming",
      "Long-term lifecycle engineering support",
    ],
  },
];

export interface ImpactArea {
  id: string;
  title: string;
  tagline: string;
  description: string;
  keyPoints: string[];
}

export const IMPACT_AREAS: ImpactArea[] = [
  {
    id: "productivity",
    title: "Industrial Productivity",
    tagline: "Consistent Throughput & Predictable Takt",
    description:
      "Automated robotic cells operate with deterministic repeatability, eliminating shift-to-shift variance and maintaining steady production cadence across demanding multi-shift schedules.",
    keyPoints: [
      "Predictable 24/7 operating cycles without operator fatigue",
      "Elimination of micro-stops through optimized path trajectory",
      "Seamless synchronization with automated conveyors and CNC tools",
    ],
  },
  {
    id: "precision",
    title: "Precision & Quality",
    tagline: "Sub-Millimeter Repeatability & Zero-Defects",
    description:
      "Combining stiff zero-backlash mechanical joints with optical encoder feedback ensures that every spot weld, sealant bead, and micro-component placement matches exact tolerances.",
    keyPoints: [
      "Sub-arcminute lost motion eliminating mechanical overshoot",
      "Integrated machine vision validating workpieces in real time",
      "Rigid structural castings resistant to dynamic deflection",
    ],
  },
  {
    id: "safety",
    title: "Worker Safety",
    tagline: "Ergonomic Protection & Hazardous Task Relocation",
    description:
      "Robotic automation relieves human operators from repetitive strain injuries, high-heat environments, toxic fumes, and heavy lifting while maintaining collaborative safety zones.",
    keyPoints: [
      "Relocating operators away from welding spatter and fumes",
      "Handling heavy battery packs and raw castings safely",
      "ISO-compliant safety laser scanners guarding collaborative cells",
    ],
  },
  {
    id: "intelligent-manufacturing",
    title: "Intelligent Manufacturing",
    tagline: "Adaptive Operations & Physical AI Readiness",
    description:
      "Modern robotics goes beyond fixed programming. By incorporating edge sensor telemetry and physical AI models, industrial workcells can accommodate part variations and auto-correct.",
    keyPoints: [
      "Real-time sensor feedback adapting to component tolerances",
      "Edge telemetry monitoring joint thermals and vibration",
      "Interoperability with plant MES and digital twin models",
    ],
  },
];
