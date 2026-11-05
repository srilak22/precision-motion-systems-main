/**
 * Complete Leadership and Engineering Team Directory for INDUS Industrial Robotics
 * Centralized data model ensuring accurate representation of executives, advisors,
 * engineers, interns, and open talent searches.
 */

export type TeamCategory =
  | "executive"
  | "advisory"
  | "management"
  | "physical-ai"
  | "motion-control"
  | "software"
  | "interns";

export interface TeamMember {
  id: string;
  name: string;
  designation: string;
  category: TeamCategory;
  specialization?: string;
  affiliation?: string;
  institution?: string;
  qualification?: string;
  employmentType?: "Executive" | "Advisor" | "Full-time" | "Intern" | "Open Role";
  location?: string;
  isOpenRole?: boolean;
  avatarColor?: string;
  initials?: string;
  bio?: string;
}

export const TEAM_CATEGORIES: { id: TeamCategory | "all"; label: string; count?: number }[] = [
  { id: "all", label: "All Team Members" },
  { id: "executive", label: "Executive Leadership & Board" },
  { id: "advisory", label: "Advisory Board" },
  { id: "management", label: "Operational Leadership" },
  { id: "physical-ai", label: "Physical AI & Humanoid Robotics" },
  { id: "motion-control", label: "Motion Control & Mechatronics" },
  { id: "software", label: "Software & Infrastructure" },
  { id: "interns", label: "Engineering Interns & Associates" },
];

export const TEAM_MEMBERS: TeamMember[] = [
  // A. EXECUTIVE LEADERSHIP & BOARD OF DIRECTORS
  {
    id: "pranav-p-r",
    name: "Pranav P R",
    designation: "Chief Executive Officer (CEO)",
    category: "executive",
    specialization: "Robotics Strategy, Industrial Kinematics & Enterprise Architecture",
    employmentType: "Executive",
    initials: "PR",
    avatarColor: "from-blue-600 to-indigo-800",
    bio: "Guiding INDUS's corporate vision, capital allocation, and technology commercialization across industrial robotics and precision motion platforms.",
  },
  {
    id: "swathi-iyer",
    name: "Swathi Iyer",
    designation: "Lead Investor",
    category: "executive",
    affiliation: "Value Gravity Capital",
    specialization: "Deep-Tech Growth, Hardware Scaling & Capital Formation",
    employmentType: "Executive",
    initials: "SI",
    avatarColor: "from-emerald-600 to-teal-800",
    bio: "Partnering with INDUS to scale production infrastructure, supply chain resilience, and global industrial market penetration.",
  },
  {
    id: "naveen-thiruvengadam",
    name: "Naveen Thiruvengadam",
    designation: "Founder & Guide",
    category: "executive",
    specialization: "Foundational Mechatronics, Systems Architecture & Mentorship",
    employmentType: "Executive",
    initials: "NT",
    avatarColor: "from-amber-600 to-orange-800",
    bio: "Providing foundational leadership, technology stewardship, and mechanical engineering guidance across core robotics architectures.",
  },
  {
    id: "lavanya-srihari",
    name: "Lavanya Srihari",
    designation: "Investor",
    category: "executive",
    affiliation: "Indus Accel",
    specialization: "Industrial Automation Incubation & Enterprise Partnerships",
    employmentType: "Executive",
    initials: "LS",
    avatarColor: "from-purple-600 to-violet-800",
    bio: "Championing industrial automation alliances, strategic investor relations, and acceleration into advanced manufacturing supply chains.",
  },

  // B. ADVISORY BOARD
  {
    id: "balaji-venkatraman",
    name: "Balaji Venkatraman",
    designation: "Strategic Advisor",
    category: "advisory",
    specialization: "Sales, Marketing & Business Acceleration",
    employmentType: "Advisor",
    initials: "BV",
    avatarColor: "from-cyan-600 to-blue-800",
    bio: "Advising on global go-to-market strategies, commercial channel expansion, and enterprise customer acquisition across high-duty manufacturing.",
  },
  {
    id: "dr-seshadri-srinivasan",
    name: "Dr. Seshadri Srinivasan",
    designation: "Chief Technology Advisor",
    category: "advisory",
    specialization: "Robotics & Controls",
    employmentType: "Advisor",
    initials: "SS",
    avatarColor: "from-blue-700 to-slate-900",
    bio: "Guiding mathematical control formulation, non-linear kinematic observer design, and advanced multi-axis trajectory stabilization.",
  },

  // C. EXECUTIVE MANAGEMENT & OPERATIONAL LEADERSHIP
  {
    id: "kumar-v",
    name: "Kumar V",
    designation: "Chief Operating Officer (COO) & Head of Robotics Reliability",
    category: "management",
    specialization: "Manufacturing Operations, Supply Chain & ISO 9001 Metrology",
    employmentType: "Full-time",
    initials: "KV",
    avatarColor: "from-slate-700 to-slate-900",
    bio: "Directing precision manufacturing operations, dyno test bench metrology, vendor quality validation, and ISO quality management systems.",
  },
  {
    id: "murali-krishnamurthi",
    name: "Murali Krishnamurthi",
    designation: "US Markets – Industrial Automation",
    category: "management",
    specialization: "North American Automation OEMs & Enterprise Integration",
    employmentType: "Full-time",
    initials: "MK",
    avatarColor: "from-indigo-600 to-blue-900",
    bio: "Spearheading North American OEM engagements, systems integrator partnerships, and regional application support desks.",
  },
  {
    id: "shaji-k-namath",
    name: "Shaji K Namath",
    designation: "APJC Manufacturing & Industrial Automation",
    category: "management",
    specialization: "Asia-Pacific Manufacturing Ecosystems & Factory Automation",
    employmentType: "Full-time",
    initials: "SN",
    avatarColor: "from-teal-600 to-emerald-900",
    bio: "Driving Asia-Pacific and Japan customer programs across electronics, semiconductor packaging, and automotive tier-1 manufacturing hubs.",
  },

  // D. PHYSICAL AI & HUMANOID ROBOTICS CORE
  {
    id: "ananya-panday",
    name: "Ananya Panday",
    designation: "Lead, Physical AI & Embodied Intelligence",
    category: "physical-ai",
    specialization: "VLA Models & Spatial Reasoning",
    employmentType: "Full-time",
    initials: "AP",
    avatarColor: "from-fuchsia-600 to-pink-800",
    bio: "Leading research and deployment of Vision-Language-Action (VLA) architectures, multimodal spatial embeddings, and real-time physical AI inference.",
  },
  {
    id: "sreeja-bhattadri",
    name: "Sreeja Bhattadri",
    designation: "Robotics Simulation Engineer",
    category: "physical-ai",
    specialization: "Isaac Sim & Sim-to-Real Optimization",
    employmentType: "Full-time",
    initials: "SB",
    avatarColor: "from-violet-600 to-indigo-800",
    bio: "Developing high-fidelity digital twins in NVIDIA Isaac Sim, domain randomization pipelines, and robust sim-to-real kinematic transfer models.",
  },
  {
    id: "lalitha-kulkarni",
    name: "Lalitha Kulkarni",
    designation: "Robot Perception & Computer Vision Engineer",
    category: "physical-ai",
    specialization: "3D Scene Understanding & Depth Sensing",
    employmentType: "Full-time",
    initials: "LK",
    avatarColor: "from-sky-600 to-blue-800",
    bio: "Engineering real-time 3D point-cloud processing, structured light depth estimation, and 6-DoF object pose estimation algorithms.",
  },
  {
    id: "open-path-planning",
    name: "Open Position",
    designation: "Path Planning & Navigation Engineer",
    category: "physical-ai",
    specialization: "Autonomous Localization & Trajectory Optimization",
    employmentType: "Open Role",
    isOpenRole: true,
    initials: "+",
    avatarColor: "from-blue-500 to-indigo-600",
    bio: "Join our team to develop real-time obstacle avoidance, graph-based SLAM, and dynamic spline trajectory generation for mobile robotics.",
  },

  // E. MOTION CONTROL & MECHATRONICS ENGINEERING
  {
    id: "neha-hebbar",
    name: "Neha Hebbar",
    designation: "Robotics Motion Control Expert",
    category: "motion-control",
    qualification: "B.Tech, IIT Bombay",
    specialization: "Deterministic FOC, Servo Loop Sizing & Kinematics",
    employmentType: "Full-time",
    initials: "NH",
    avatarColor: "from-blue-600 to-sky-800",
    bio: "Formulating sub-millisecond Field-Oriented Control (FOC) loops, active vibration suppression, and dynamic torque ripple cancellation.",
  },
  {
    id: "abhishek-raman",
    name: "Abhishek Raman",
    designation: "Electrical Engineer",
    category: "motion-control",
    specialization: "Motor Drivers & Power Electronics",
    employmentType: "Full-time",
    initials: "AR",
    avatarColor: "from-indigo-700 to-slate-900",
    bio: "Designing high-efficiency GaN/MOSFET inverter power stages, functional safety STO interlocks, and thermal dissipation systems for servo drives.",
  },
  {
    id: "tanushree",
    name: "Tanushree",
    designation: "Actuator Geartrain Mechanical Engineer",
    category: "motion-control",
    specialization: "High-Torque Density Gearboxes",
    employmentType: "Full-time",
    initials: "TS",
    avatarColor: "from-purple-600 to-slate-800",
    bio: "Engineering strain-wave flexsplines, cycloidal gear pin contact geometry, bearing pre-load arrangements, and zero-backlash joint assemblies.",
  },
  {
    id: "swesha",
    name: "Swesha",
    designation: "Mechatronics & Embedded Systems Engineer",
    category: "motion-control",
    specialization: "Firmware & Sensor-Actuator Bus Integration",
    employmentType: "Full-time",
    initials: "SW",
    avatarColor: "from-teal-600 to-cyan-800",
    bio: "Architecting real-time ARM Cortex-M/R embedded firmware, EtherCAT CoE communication stacks, and high-resolution absolute encoder telemetry.",
  },

  // F. SOFTWARE PLATFORM & INFRASTRUCTURE
  {
    id: "sruthi-rajagopalan",
    name: "Sruthi Rajagopalan",
    designation: "Robotics Software Platform Engineer",
    category: "software",
    specialization: "ROS2 & Distributed Systems",
    employmentType: "Full-time",
    initials: "SR",
    avatarColor: "from-indigo-600 to-purple-800",
    bio: "Building enterprise ROS2 nodes, real-time DDS middleware, modular microservices, and hardware abstraction interfaces for multi-robot fleets.",
  },
  {
    id: "open-devops-role",
    name: "Open Position",
    designation: "Robotics Integration & DevOps Engineer",
    category: "software",
    specialization: "Fleet Management & CI/CD Pipelines",
    employmentType: "Open Role",
    isOpenRole: true,
    initials: "+",
    avatarColor: "from-blue-500 to-indigo-600",
    bio: "Seeking an engineer to build containerized simulation pipelines, OTA firmware delivery networks, and distributed robotics observability systems.",
  },

  // G. ENGINEERING INTERNS & SPECIALIZED ASSOCIATES
  {
    id: "gautham-vb",
    name: "Gautham VB",
    designation: "AI Motion Control Engineer",
    category: "interns",
    employmentType: "Intern",
    institution: "PES University",
    qualification: "B.Tech",
    specialization: "Dynamic Trajectory Optimization & Reinforcement Learning",
    initials: "GV",
    avatarColor: "from-blue-500 to-slate-700",
    bio: "Investigating neural network-assisted feedforward controllers to accelerate high-speed pick-and-place settling times.",
  },
  {
    id: "vishnu-aditya",
    name: "Vishnu Aditya",
    designation: "AI Motion Control Engineer",
    category: "interns",
    employmentType: "Intern",
    institution: "Ramaiah Institute of Technology, Bengaluru",
    specialization: "Adaptive Servo Tuning & Sensor Fusion",
    initials: "VA",
    avatarColor: "from-cyan-600 to-slate-700",
    bio: "Developing automated frequency-response analysis and Bode plot identification tools for automated servo commissioning.",
  },
  {
    id: "rishi-kumar",
    name: "Rishi Kumar",
    designation: "Robotics & Vision Coordination Engineer",
    category: "interns",
    employmentType: "Intern",
    specialization: "Visual Servoing & Hand-Eye Calibration",
    initials: "RK",
    avatarColor: "from-emerald-600 to-slate-700",
    bio: "Working on automated 9-point eye-in-hand kinematic calibration routines and low-latency feature tracking for 6-axis arms.",
  },
  {
    id: "mirdhula",
    name: "Mirdhula",
    designation: "Robotics Reliability & Testing Engineer",
    category: "interns",
    employmentType: "Intern",
    specialization: "Dynamic Dyno Benchmarking & Thermal Profiling",
    initials: "MD",
    avatarColor: "from-purple-600 to-slate-700",
    bio: "Assisting in continuous endurance testing, torsional backlash measurement, and ISO 9283 pose repeatability data collection.",
  },
  {
    id: "srilakshana",
    name: "Srilakshana",
    designation: "Industrial Process Engineering Intern",
    category: "interns",
    employmentType: "Intern",
    institution: "Ramco Institute of Technology",
    location: "Rajapalayam, Tamil Nadu, India",
    specialization: "Manufacturing Process Workflow & Cell Layout Optimization",
    initials: "SL",
    avatarColor: "from-amber-600 to-slate-700",
    bio: "Focusing on industrial cell layout design, cycle-time bottleneck analysis, and production ergonomics for automated manufacturing workcells.",
  },
];
