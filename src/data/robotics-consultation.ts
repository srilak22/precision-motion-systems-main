import type {
  IndustryCategory,
  RobotCategory,
  ProjectStage,
  PreferredSolution,
  OperatingEnvironment,
  AccuracyRequirement,
  ProductionShift,
  BudgetRange,
  ImplementationTimeline,
} from "@/types/consultation";

export interface IndustryMeta {
  id: IndustryCategory;
  title: string;
  shortName: string;
  description: string;
  iconName: string;
  recommendedRobots: RobotCategory[];
  commonApplications: string[];
}

export const INDUSTRIES: IndustryMeta[] = [
  {
    id: "Automotive and automobile manufacturing",
    title: "Automotive & Automobile Manufacturing",
    shortName: "Automotive",
    description: "High-speed spot welding, robotic seam sealing, BIW assembly, powertrain CNC tending, and robotic paint shops.",
    iconName: "Car",
    recommendedRobots: [
      "Welding robots",
      "Robotic assembly systems",
      "Machine-tending robots",
      "Articulated robotic arms",
      "Inspection and quality-control automation",
    ],
    commonApplications: [
      "Spot & Laser Welding (BIW)",
      "Powertrain Machine Tending",
      "Body Panel Sealing & Gluing",
      "Windshield & Interior Assembly",
      "End-of-Line Optical Inspection",
      "Custom Automotive Cell",
    ],
  },
  {
    id: "Electronics and electrical manufacturing",
    title: "Electronics & Electrical Manufacturing",
    shortName: "Electronics",
    description: "Sub-millimeter micro-assembly, PCB component insertion, wire bonding, cleanroom handling, and automated optical inspection (AOI).",
    iconName: "Cpu",
    recommendedRobots: [
      "SCARA robots",
      "Collaborative robots (cobots)",
      "Delta and pick-and-place robots",
      "Robotic assembly systems",
      "Inspection and quality-control automation",
    ],
    commonApplications: [
      "PCB SMT Component Placement",
      "Precision Screw Fastening",
      "Potting & Dispensing",
      "High-Speed Pick-and-Place",
      "Optical & Electrical In-Circuit Test (ICT)",
      "Wafer & Semiconductor Handling",
    ],
  },
  {
    id: "Food and beverage processing",
    title: "Food & Beverage Processing",
    shortName: "Food & Beverage",
    description: "Hygienic washdown (IP69K) handling, primary packaging, high-speed delta sorting, and high-throughput case palletizing.",
    iconName: "Utensils",
    recommendedRobots: [
      "Delta and pick-and-place robots",
      "Palletizing and depalletizing robots",
      "Collaborative robots (cobots)",
      "Cartesian and gantry robots",
      "Complete industrial automation systems",
    ],
    commonApplications: [
      "High-Speed Bakery & Snack Packing",
      "Fresh Produce Sorting & Grading",
      "Sanitary Washdown Delta Pick & Place",
      "Bottling & Can Line Palletizing",
      "Cold Storage Automated Handling",
      "Case Packing & Carton Erecting",
    ],
  },
  {
    id: "Pharmaceuticals and healthcare manufacturing",
    title: "Pharmaceuticals & Healthcare Manufacturing",
    shortName: "Pharma & MedTech",
    description: "ISO Class 3-5 cleanroom robotics, sterile vial filling, blister packaging, syringe assembly, and serialization.",
    iconName: "Pill",
    recommendedRobots: [
      "SCARA robots",
      "Collaborative robots (cobots)",
      "Inspection and quality-control automation",
      "Robotic assembly systems",
      "Delta and pick-and-place robots",
    ],
    commonApplications: [
      "Aseptic Vial Filling & Capping",
      "Syringe & Auto-Injector Assembly",
      "Blister Pack Inspection & Boxing",
      "Diagnostic Kit Reagent Pipetting",
      "Surgical Instrument Polish & Pack",
      "Track & Trace 2D DataMatrix Verification",
    ],
  },
  {
    id: "Warehousing and logistics",
    title: "Warehousing & Logistics",
    shortName: "Logistics & AMRs",
    description: "Fleet-coordinated Autonomous Mobile Robots (AMRs), Automated Guided Vehicles (AGVs), mixed-case palletizing, and parcel sorting.",
    iconName: "Boxes",
    recommendedRobots: [
      "Autonomous mobile robots (AMRs)",
      "Automated guided vehicles (AGVs)",
      "Palletizing and depalletizing robots",
      "Cartesian and gantry robots",
      "Complete industrial automation systems",
    ],
    commonApplications: [
      "Autonomous Pallet Transport (AMR)",
      "Goods-to-Person Picking Workstations",
      "Depalletizing & Induction to Sorter",
      "Mixed-SKU Pallet Building",
      "Conveyor Transfer AGVs",
      "Cross-Dock Fleet Logistics",
    ],
  },
  {
    id: "Packaging and material handling",
    title: "Packaging & Material Handling",
    shortName: "Packaging",
    description: "High-speed cartoning, shrink-wrapping, case packing, robotic de-nesting, and end-of-line pallet dispatch.",
    iconName: "Package",
    recommendedRobots: [
      "Palletizing and depalletizing robots",
      "Delta and pick-and-place robots",
      "Cartesian and gantry robots",
      "Collaborative robots (cobots)",
      "Articulated robotic arms",
    ],
    commonApplications: [
      "End-of-Line Multi-Lane Palletizing",
      "Robotic Case Packing & Taping",
      "Slip-Sheet & Tier-Sheet Insertion",
      "Robotic Tray Loading & De-nesting",
      "Heavy Barrel / Drum Handling",
      "Bale & Splicer Transfer",
    ],
  },
  {
    id: "Metal fabrication and welding",
    title: "Metal Fabrication & Welding",
    shortName: "Metal & Welding",
    description: "Automated MIG/MAG, TIG, and laser welding cells, press brake tending, CNC lathe loading, and plasma cutting.",
    iconName: "Flame",
    recommendedRobots: [
      "Welding robots",
      "Articulated robotic arms",
      "Machine-tending robots",
      "Cartesian and gantry robots",
      "Collaborative robots (cobots)",
    ],
    commonApplications: [
      "MIG/MAG Heavy Structural Welding",
      "Precision TIG / Laser Welding",
      "Press Brake Sheet Bending",
      "CNC Mill & Lathe Part Tending",
      "Fiber Laser Cutting & De-burring",
      "Robotic Grinding & Weld Seam Blending",
    ],
  },
  {
    id: "Textile manufacturing",
    title: "Textile Manufacturing",
    shortName: "Textiles",
    description: "Yarn package palletizing, automated fabric cutting, garment handling, roll transport, and automated sewing cells.",
    iconName: "Scissors",
    recommendedRobots: [
      "Cartesian and gantry robots",
      "Articulated robotic arms",
      "Automated guided vehicles (AGVs)",
      "Custom robotic solutions",
      "Autonomous mobile robots (AMRs)",
    ],
    commonApplications: [
      "Yarn Bobbin / Cone Palletizing",
      "Automated Roll Transport (AGV)",
      "Robotic Fabric Spreading & Cut Cell",
      "Automated Hemming & Seaming",
      "Finished Garment Fold & Pack",
      "Textile Dye & Weft Inspection",
    ],
  },
  {
    id: "Agriculture and farming",
    title: "Agriculture & Farming",
    shortName: "Agriculture",
    description: "Autonomous field robots, robotic harvesting, greenhouse climate manipulation, crop health vision sorting, and produce packing.",
    iconName: "Sprout",
    recommendedRobots: [
      "Autonomous mobile robots (AMRs)",
      "Custom robotic solutions",
      "Delta and pick-and-place robots",
      "Inspection and quality-control automation",
      "Cartesian and gantry robots",
    ],
    commonApplications: [
      "Greenhouse Autonomous Crop Pruning",
      "Produce Quality Grading & Sorting",
      "Orchard Mobile Harvesting Platform",
      "Automated Seedling Transplantation",
      "Targeted Micro-Spraying Robotics",
      "Post-Harvest Bulk Bin Tipping",
    ],
  },
  {
    id: "Aerospace and precision manufacturing",
    title: "Aerospace & Precision Manufacturing",
    shortName: "Aerospace",
    description: "High-rigidity drilling, countersinking, carbon composite tape layup, turbine blade polishing, and CMM laser metrology.",
    iconName: "Plane",
    recommendedRobots: [
      "Articulated robotic arms",
      "Collaborative robots (cobots)",
      "Inspection and quality-control automation",
      "SCARA robots",
      "Custom robotic solutions",
    ],
    commonApplications: [
      "Aircraft Skin Robotic Drilling & Riveting",
      "Carbon Fiber Composite Layup",
      "Turbine Blade Finishing & Peening",
      "Precision Laser Radar Metrology",
      "Clean-Room Satellite Assembly",
      "Heavy Airframe Gantry Positioning",
    ],
  },
  {
    id: "General industrial automation",
    title: "General Industrial Automation",
    shortName: "General Industry",
    description: "Multi-axis motion coordination, turnkey assembly lines, machine safety integration, and plant-wide SCADA connectivity.",
    iconName: "Cog",
    recommendedRobots: [
      "Articulated robotic arms",
      "Collaborative robots (cobots)",
      "SCARA robots",
      "Palletizing and depalletizing robots",
      "Complete industrial automation systems",
    ],
    commonApplications: [
      "Multi-Station Turnkey Assembly Line",
      "Flexible Parts Feeding & Kitting",
      "Universal Machine Tending Cell",
      "End-of-Arm Tooling (EOAT) Engineering",
      "PLC & Safety Interlock Upgrade",
      "Industrial Vision Defect Detection",
    ],
  },
  {
    id: "Other industries",
    title: "Other Specialized Industries",
    shortName: "Custom / Other",
    description: "Chemical synthesis, energy, defense, mining, consumer appliances, ceramics, and custom kinematic requirements.",
    iconName: "Compass",
    recommendedRobots: [
      "Custom robotic solutions",
      "Complete industrial automation systems",
      "Collaborative robots (cobots)",
      "Articulated robotic arms",
      "Not sure, recommend a solution",
    ],
    commonApplications: [
      "Specialty Kinematic Mechanism",
      "Hazardous Environment Tele-Operation",
      "Laboratory High-Throughput Screening",
      "Battery Cell Manufacturing",
      "R&D Prototype Development",
      "Facility-Wide Automation Roadmap",
    ],
  },
];

export interface RobotCategoryMeta {
  id: RobotCategory;
  title: string;
  badge: string;
  description: string;
  typicalPayload: string;
  typicalReach: string;
  bestFor: string;
}

export const ROBOT_CATEGORIES: RobotCategoryMeta[] = [
  {
    id: "Articulated robotic arms",
    title: "Articulated Robotic Arms (6-Axis)",
    badge: "Versatile 6-DOF",
    description: "High-inertia 6-axis industrial arms built for heavy payloads, long reach, high repeatability, and rigorous multi-axis trajectories.",
    typicalPayload: "3 kg – 800+ kg",
    typicalReach: "500 mm – 3,500 mm",
    bestFor: "Welding, heavy material handling, painting, press tending, and machine loading.",
  },
  {
    id: "Collaborative robots (cobots)",
    title: "Collaborative Robots (Cobots)",
    badge: "Safe Human Interaction",
    description: "Power-and-force-limited robots equipped with integrated torque sensors for safe collaborative operation without physical safety fencing.",
    typicalPayload: "3 kg – 35 kg",
    typicalReach: "500 mm – 1,750 mm",
    bestFor: "Screw fastening, electronics testing, palletizing, lab automation, and tight-space assembly.",
  },
  {
    id: "SCARA robots",
    title: "SCARA Robots (4-Axis)",
    badge: "Ultra-Fast Planar",
    description: "Selective Compliance Assembly Robot Arms delivering ultra-fast cycle times, rigid vertical z-axis force, and superior planar accuracy.",
    typicalPayload: "1 kg – 20 kg",
    typicalReach: "300 mm – 1,000 mm",
    bestFor: "High-speed electronics assembly, semiconductor pick-and-place, dispensing, and kitting.",
  },
  {
    id: "Cartesian and gantry robots",
    title: "Cartesian & Linear Gantry Robots",
    badge: "Large Working Envelope",
    description: "Overhead or floor-mounted orthogonal axis systems providing unlimited stroke length, massive payload capacity, and high positional stiffness.",
    typicalPayload: "10 kg – 1,500+ kg",
    typicalReach: "Up to 50+ meters stroke",
    bestFor: "Large-format CNC machine tending, warehouse layer palletizing, sheet metal transfer.",
  },
  {
    id: "Delta and pick-and-place robots",
    title: "Delta & Spider Robots",
    badge: "Up to 200 Picks/Min",
    description: "Parallel-link delta kinematic robots engineered for lightning-fast top-down picking, orientation tracking, and conveyor belt synchronization.",
    typicalPayload: "0.5 kg – 15 kg",
    typicalReach: "600 mm – 1,600 mm diameter",
    bestFor: "Food sorting, blister packaging, secondary pouch packing, and solar wafer handling.",
  },
  {
    id: "Autonomous mobile robots (AMRs)",
    title: "Autonomous Mobile Robots (AMRs)",
    badge: "Natural Feature SLAM",
    description: "Self-navigating mobile robots using 2D/3D LiDAR, SLAM algorithms, and obstacle avoidance without reflective tape or floor markers.",
    typicalPayload: "100 kg – 1,500 kg",
    typicalReach: "Facility-wide omnidirectional",
    bestFor: "Intralogistics pallet hauling, bin delivery to assembly cells, warehouse order fulfillment.",
  },
  {
    id: "Automated guided vehicles (AGVs)",
    title: "Automated Guided Vehicles (AGVs)",
    badge: "Heavy Duty Floor Transport",
    description: "Deterministic floor-guided transit vehicles (magnetic tape, QR grid, or laser) for high-tonnage material transfer and assembly lines.",
    typicalPayload: "500 kg – 5,000+ kg",
    typicalReach: "Dedicated guideway routes",
    bestFor: "Automotive engine transport, paper roll haulage, heavy chassis production indexing.",
  },
  {
    id: "Welding robots",
    title: "Robotic Welding Cells (MIG / TIG / Laser)",
    badge: "Certified Seam Quality",
    description: "Complete robotic welding packages with integrated seam-tracking sensors, water-cooled torches, wire feeders, and 2-axis positioners.",
    typicalPayload: "6 kg – 20 kg (Torch payload)",
    typicalReach: "1,400 mm – 2,200 mm",
    bestFor: "Heavy structural fabrication, exhaust systems, sheet metal enclosures, and pressure vessels.",
  },
  {
    id: "Palletizing and depalletizing robots",
    title: "Palletizing & Depalletizing Robots",
    badge: "High Throughput End-of-Line",
    description: "Specialized 4-axis or 6-axis kinematics optimized for vertical stack stability, mixed-case stacking, and heavy payload bag/box handling.",
    typicalPayload: "40 kg – 500+ kg",
    typicalReach: "1,800 mm – 3,200 mm",
    bestFor: "Beverage cases, chemical bags, carton stacking, slip-sheet placement, and stretch wrapping.",
  },
  {
    id: "Machine-tending robots",
    title: "CNC & Press Machine-Tending Robots",
    badge: "Lights-Out Machining",
    description: "Protected robots with chip-proof and coolant-resistant sealing (IP67) for loading blanks and unloading finished parts into machine tools.",
    typicalPayload: "7 kg – 70 kg",
    typicalReach: "700 mm – 2,500 mm",
    bestFor: "CNC lathes, machining centers, injection moulding presses, stamping dies, and broaching.",
  },
  {
    id: "Inspection and quality-control automation",
    title: "Inspection & Quality-Control Automation",
    badge: "Sub-Micron Optical Metrology",
    description: "Robots mounted with high-resolution telecentric lenses, 3D laser profilers, or eddy current probes for 100% automated inspection.",
    typicalPayload: "3 kg – 20 kg (Sensor payload)",
    typicalReach: "600 mm – 1,800 mm",
    bestFor: "Dimension verification, surface scratch detection, seal completeness, gap and flush checks.",
  },
  {
    id: "Robotic assembly systems",
    title: "Robotic Assembly Systems & Workcells",
    badge: "Multi-Process Workstation",
    description: "Turnkey automated assembly cells integrating multi-feeder bowl vibrators, press-fit servo presses, optical alignment, and part riveting.",
    typicalPayload: "Application specific",
    typicalReach: "Cellular layout",
    bestFor: "Automotive sub-assemblies, electronic modules, lock sets, pump impellers, and medical pens.",
  },
  {
    id: "Custom robotic solutions",
    title: "Custom Robotic & Kinematic Solutions",
    badge: "Engineered to Spec",
    description: "Bespoke kinematics engineered by INDUS application architects for non-standard environments, extreme temperatures, or proprietary processes.",
    typicalPayload: "Custom engineered",
    typicalReach: "Custom envelope",
    bestFor: "Unique manufacturing processes, proprietary tooling, space-constrained retrofit cells.",
  },
  {
    id: "Complete industrial automation systems",
    title: "Complete Industrial Automation Systems",
    badge: "Turnkey Plant Line",
    description: "Full end-to-end factory integration: robotics, conveyance, safety guard systems, PLC master controllers, SCADA, and ERP integration.",
    typicalPayload: "Entire production plant",
    typicalReach: "Plant-wide",
    bestFor: "Greenfield manufacturing plants, legacy factory retrofits, line modernization projects.",
  },
  {
    id: "Not sure, recommend a solution",
    title: "Not Sure — Recommend a Solution",
    badge: "Application Engineering Review",
    description: "Our robotics architects will analyze your throughput targets, cycle time, and payload requirements to determine the optimal kinematic solution.",
    typicalPayload: "To be calculated",
    typicalReach: "To be determined",
    bestFor: "First-time automation adopters, complex hybrid processes, exploratory capital projects.",
  },
];

export const PROJECT_STAGES: { value: ProjectStage; label: string; description: string }[] = [
  { value: "Research", label: "Research & Feasibility", description: "Evaluating whether robotics is technically viable for our process." },
  { value: "Planning", label: "Planning & Specification", description: "Writing technical specifications and defining project boundaries." },
  { value: "Budgeting", label: "Budgeting & CAPEX Approval", description: "Seeking budgetary proposals for internal financial approval." },
  { value: "Ready to Implement", label: "Ready to Implement (< 3 Months)", description: "Budget approved and looking for immediate engineering engagement." },
  { value: "Existing System Upgrade", label: "Existing System Upgrade / Retrofit", description: "Upgrading, replacing, or reprogramming an operational robotic cell." },
];

export const PREFERRED_SOLUTIONS: { value: PreferredSolution; label: string; description: string }[] = [
  { value: "New installation", label: "New Turnkey Installation", description: "Complete robotic workcell from layout to commissioning." },
  { value: "Replacement", label: "Robot Arm / Mechanism Replacement", description: "Replacing an end-of-life robot while keeping peripheral tooling." },
  { value: "Integration", label: "Sub-System Integration", description: "Adding robotics to an existing conveyor, CNC, or PLC line." },
  { value: "Upgrade", label: "Kinematic or Controls Upgrade", description: "Upgrading motors, fieldbus, end-effectors, or controller firmware." },
  { value: "Consultation only", label: "Technical Consultation Only", description: "Application sizing, simulation review, or engineering feasibility study." },
];

export const OPERATING_ENVIRONMENTS: OperatingEnvironment[] = [
  "Standard industrial factory",
  "Cleanroom (ISO Class 3-8)",
  "High temperature / Foundry",
  "Washdown / Food Grade (IP67/IP69K)",
  "Hazardous / ATEX / Explosive",
  "Cold storage (-20°C to 4°C)",
  "Outdoor / Dusty",
];

export const ACCURACY_OPTIONS: AccuracyRequirement[] = [
  "Ultra-precision (±0.02 mm or better)",
  "High precision (±0.05 mm)",
  "Standard precision (±0.1 mm - ±0.5 mm)",
  "Coarse / Handling (±1 mm or more)",
  "Not sure / To be evaluated",
];

export const PRODUCTION_SHIFTS: ProductionShift[] = [
  "Continuous 24/7 (3 shifts)",
  "Two shifts (16 hrs/day)",
  "Single shift (8 hrs/day)",
  "Batch / Intermittent run",
  "Pilot / Prototype line",
];

export const BUDGET_RANGES: BudgetRange[] = [
  "< $25,000",
  "$25,000 - $50,000",
  "$50,000 - $100,000",
  "$100,000 - $250,000",
  "> $250,000",
  "Flexible / Undetermined",
];

export const IMPLEMENTATION_TIMELINES: ImplementationTimeline[] = [
  "Immediate (< 1 month)",
  "1 - 3 months",
  "3 - 6 months",
  "6 - 12 months",
  "Exploring / Planning phase",
];

export const CONSULTATION_CONFIG = {
  DEFAULT_TIMEZONE: "Asia/Kolkata",
  TIMEZONE_LABEL: "IST (Asia/Kolkata, UTC+05:30)",
  MEETING_DURATION_MINUTES: 30,
  BUFFER_MINUTES: 15,
  BUSINESS_START_HOUR: 9, // 09:30 AM
  BUSINESS_START_MINUTE: 30,
  BUSINESS_END_HOUR: 18, // 06:00 PM
  BUSINESS_END_MINUTE: 0,
  MIN_ADVANCE_NOTICE_HOURS: 4,
  BOOKING_HORIZON_DAYS: 30,
  DAYS_OF_WEEK: [1, 2, 3, 4, 5], // Monday - Friday
};
