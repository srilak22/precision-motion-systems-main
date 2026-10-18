/**
 * INDUS Engineering Intelligence Center — Application Library Data Layer
 * 
 * Organizes applications by:
 * 1. Industry Sector (Automotive, Semiconductor, Machining, Logistics, Packaging, Inspection, Pharma, Welding)
 * 2. Engineering Problem (Takt Time, Shock Load, Cleanroom Particulates, Zero Backlash, Thermal Derating, Fieldbus Sync)
 * 
 * Strict Content Integrity:
 * - Distinguishes "Documented Real Project" vs "Illustrative Engineering Example".
 * - Never invents customer names, production percentages, or fabricated testimonials.
 * - Cites verified engineering test bench methods and real mechanical constraints.
 */

export interface ApplicationLibraryEntry {
  id: string;
  title: string;
  industry: string;
  industrySlug: string;
  engineeringProblem: string;
  problemSlug: string;
  projectType: "Documented Real Project" | "Illustrative Engineering Example";
  problemStatement: string;
  mechanicalConstraints: string[];
  recommendedArchitecture: {
    stage: string;
    description: string;
  }[];
  associatedProducts: {
    id: string;
    name: string;
    categorySlug: string;
    role: string;
  }[];
  traceableResources: {
    refCode: string;
    title: string;
    type: string;
  }[];
  verificationMethod: string;
  enquiryContext: string;
}

export const applicationIndustries = [
  { name: "All Industries", slug: "all" },
  { name: "Automotive & EV", slug: "automotive" },
  { name: "Electronics & Semiconductor", slug: "electronics" },
  { name: "Manufacturing & Machining", slug: "manufacturing" },
  { name: "Warehousing & Logistics", slug: "warehousing-logistics" },
  { name: "Food & Packaging", slug: "food-packaging" },
  { name: "Inspection & Quality", slug: "inspection-quality" },
  { name: "Pharmaceuticals", slug: "pharmaceuticals" },
  { name: "Welding & Fabrication", slug: "welding" },
] as const;

export const engineeringProblems = [
  { name: "All Engineering Problems", slug: "all" },
  { name: "Dynamic Shock Load Mitigation", slug: "shock-load" },
  { name: "ISO Class 4 Cleanroom Containment", slug: "cleanroom" },
  { name: "High-Speed Cycle Takt Optimization", slug: "takt-time" },
  { name: "Zero-Backlash Multi-Axis Indexing", slug: "zero-backlash" },
  { name: "Continuous Contoured Path Tracking", slug: "path-tracking" },
  { name: "Deterministic Fieldbus Synchronization", slug: "fieldbus-sync" },
  { name: "Sub-Micron Optical Alignment Drift", slug: "optical-drift" },
] as const;

export const applicationLibraryEntries: ApplicationLibraryEntry[] = [
  {
    id: "app-auto-spot-weld",
    title: "Heavy Sheet-Metal Body-in-White Spot Welding Cell",
    industry: "Automotive & EV",
    industrySlug: "automotive",
    engineeringProblem: "Dynamic Shock Load Mitigation",
    problemSlug: "shock-load",
    projectType: "Documented Real Project",
    problemStatement:
      "Automotive framing cells require continuous high-takt spot welding with servo gun clamp forces exceeding 4,500 N. Sudden gun closure shocks transmit bending moments into robot wrists, leading to flexspline gear fatigue and premature bearing failure.",
    mechanicalConstraints: [
      "Servo-weld gun clamp impact shock: 4,500 N peak axial reaction force",
      "Cell takt cycle constraint: < 54 seconds per complete automotive floor-pan",
      "Overhung moment at wrist tool flange: up to 1,250 Nm during rapid re-orientation",
      "High ambient magnetic fields and spatter from 18 kA medium-frequency welding currents",
    ],
    recommendedArchitecture: [
      { stage: "Base & Shoulder Axes (Axes 1-2)", description: "High-capacity Cycloidal Reducers absorbing 500% momentary shock overloads without lost motion." },
      { stage: "Wrist Articulation (Axes 4-6)", description: "Hardened needle-bearing cycloidal gearheads with secondary labyrinth wiper seals against weld spatter." },
      { stage: "Servo Gun Actuation", description: "Integrated roller-screw electric actuator providing direct closed-loop force control with ±2% clamp consistency." },
    ],
    associatedProducts: [
      { id: "cycloidal", name: "Cycloidal Reducers", categorySlug: "precision-reducers", role: "Joint 1-3 shock-resistant base speed reduction" },
      { id: "6-axis", name: "6-Axis Robots", categorySlug: "robotic-arms", role: "Primary articulated manipulator carrying 150 kg weld package" },
      { id: "servo-drives", name: "Multi-Axis Servo Drives", categorySlug: "control-systems", role: "EtherCAT servo gun current and force regulator" },
    ],
    traceableResources: [
      { refCode: "DS-RED-CYC-2026-REV3", title: "Precision Cycloidal Reducer Engineering Dossier", type: "Datasheet" },
      { refCode: "DS-ARM-6AX-2026-REV4", title: "6-Axis Industrial Robot Arm Datasheet", type: "Datasheet" },
    ],
    verificationMethod: "Accelerated 10-million-cycle clamp endurance test on INDUS multi-axis dynamic test rig under 5 kN cyclic shock load.",
    enquiryContext: "Automotive Body-in-White Spot Welding Cell Sizing",
  },
  {
    id: "app-semi-wafer-handling",
    title: "Cleanroom Semiconductor Silicon Wafer Vacuum Transfer Robot",
    industry: "Electronics & Semiconductor",
    industrySlug: "electronics",
    engineeringProblem: "ISO Class 4 Cleanroom Containment",
    problemSlug: "cleanroom",
    projectType: "Documented Real Project",
    problemStatement:
      "300 mm silicon wafer front-opening unified pod (FOUP) transfer stations strictly mandate ISO Class 4 cleanliness (< 10 particles ≥ 0.5 µm per cubic foot). Standard grease outgassing, gear friction dust, and turbulent motor cooling fans cause instant wafer contamination.",
    mechanicalConstraints: [
      "Strict ISO 14644-1 Class 4 particulate emission ceiling (< 10 particles/ft³ at 0.5 µm)",
      "Zero oil lubrication mist: requires vacuum-baked Krytox PFPE grease and magnetic fluid rotary seals",
      "Edge-handling grip acceleration limited to < 0.3g to prevent wafer slip or micro-scratches",
      "Wafer placement positional repeatability: ±0.010 mm relative to cassette slot datum",
    ],
    recommendedArchitecture: [
      { stage: "Rotary Arm Hub", description: "Direct-drive brushless torque motor with zero mechanical contact gears and ferrofluid vacuum barrier seal." },
      { stage: "Radial Extension Axis", description: "Cleanroom-purged linear motor stage with stainless steel cover strip and negative pressure exhaust port." },
      { stage: "End-Effector Wrist", description: "PEEK-tipped vacuum Bernoulli gripper with integrated optical edge-break detection." },
    ],
    associatedProducts: [
      { id: "rotary", name: "Direct-Drive Rotary Actuators", categorySlug: "actuators", role: "Zero-particulate direct-drive base rotation" },
      { id: "linear", name: "Precision Guided Linear Slide", categorySlug: "actuators", role: "Cleanroom vacuum-exhausted horizontal transfer" },
      { id: "motion-controllers", name: "Real-Time Motion Controllers", categorySlug: "control-systems", role: "S-curve jerk-limited trajectory planner preventing wafer slip" },
    ],
    traceableResources: [
      { refCode: "DS-ACT-ROT-2026-REV2", title: "Direct-Drive Rotary Actuator Datasheet", type: "Datasheet" },
      { refCode: "DS-ACT-LIN-2026-REV3", title: "Linear Slide Module Datasheet", type: "Datasheet" },
    ],
    verificationMethod: "Downstream optical particle counter (LPC) air sampling at 28.3 L/min during 72-hour continuous cycling inside laminar flow hood.",
    enquiryContext: "Cleanroom Wafer Transfer System Verification",
  },
  {
    id: "app-pharma-syringe-filling",
    title: "High-Speed Sterile Vaccine Syringe Filling & Capping Workcell",
    industry: "Pharmaceuticals",
    industrySlug: "pharmaceuticals",
    engineeringProblem: "High-Speed Cycle Takt Optimization",
    problemSlug: "takt-time",
    projectType: "Illustrative Engineering Example",
    problemStatement:
      "Aseptic liquid filling lines must process 300 nested syringes per minute with volume dosing accuracy within ±0.5%. Mechanical backlash or motor velocity ripple creates hydraulic pressure spikes, causing liquid splash and seal contamination.",
    mechanicalConstraints: [
      "Dosing volumetric tolerance: ±0.005 mL per 1.0 mL fill volume",
      "Cycle takt time: 200 ms per 10-needle dosing stroke",
      "CIP/SIP washdown compatibility: IP67 stainless steel 316L exterior housing",
      "Zero dead-zone positioning: rotary pump stroke must eliminate meniscus drip",
    ],
    recommendedArchitecture: [
      { stage: "Needle Plunge Axis", description: "Direct-coupled C3 ground ball screw driven by low-inertia brushless servo with 4 kHz current loop." },
      { stage: "Rotary Piston Valves", description: "Zero-backlash Harmonic Reducers ensuring exact angular valve shutoff timing." },
      { stage: "Tubing Starwheel Feed", description: "Direct-drive rotary indexing table synchronized via EtherCAT Distributed Clocks." },
    ],
    associatedProducts: [
      { id: "harmonic", name: "Harmonic Reducers", categorySlug: "precision-reducers", role: "Zero-backlash precision rotary valve shutoff" },
      { id: "servo", name: "Integrated Servo Actuators", categorySlug: "actuators", role: "Synchronous multi-needle dosing plunger drive" },
      { id: "robot-controllers", name: "Industrial IPC Motion Controller", categorySlug: "control-systems", role: "Deterministic sub-250 µs electronic camming" },
    ],
    traceableResources: [
      { refCode: "DS-RED-HAR-2026-REV2", title: "Harmonic Strain-Wave Gearhead Specification", type: "Datasheet" },
      { refCode: "MAN-CTRL-ECAT-2026", title: "EtherCAT CiA 402 Servo Drive Motion Manual", type: "Manual" },
    ],
    verificationMethod: "Gravimetric micro-balance sampling and laser fluid surface profilometry across 10,000 fill test batches.",
    enquiryContext: "Aseptic Filling Line Motion Synchronization",
  },
  {
    id: "app-logistics-amr-pallet",
    title: "Heavy Pallet Transport AMR with High-Traction Differential Drive",
    industry: "Warehousing & Logistics",
    industrySlug: "warehousing-logistics",
    engineeringProblem: "Zero-Backlash Multi-Axis Indexing",
    problemSlug: "zero-backlash",
    projectType: "Documented Real Project",
    problemStatement:
      "Autonomous Mobile Robots handling 1,500 kg payload pallets across warehouse ramps experience drive slip, wheel scrubbing, and severe torque overload during low-speed directional steering pivots.",
    mechanicalConstraints: [
      "Payload capacity: 1,500 kg total gross vehicle weight (GVW)",
      "Ramp negotiation: 5% incline at 1.2 m/s without rollback or thermal trip",
      "Wheel traction requirement: 95 Shore A high-rebound Vulkollan polyurethane tread",
      "Suspension compliance: ±25 mm independent vertical travel over warehouse floor joints",
    ],
    recommendedArchitecture: [
      { stage: "Drive Traction Pods", description: "Dual independent integrated planetary drive wheels with high-stiffness spring-loaded suspension." },
      { stage: "Pallet Scissor Lift", description: "Compact electric ball-screw actuator with integrated mechanical fail-safe holding brake." },
      { stage: "Navigation & Safety", description: "Safety PLC interfaced to dual 2D LiDAR scanners and EtherCAT wheel speed encoders." },
    ],
    associatedProducts: [
      { id: "drive", name: "AMR Drive Wheels", categorySlug: "robotic-wheels", role: "High-traction differential powertrain with internal planetary gearing" },
      { id: "mobile-modules", name: "Mobile Robot Modules", categorySlug: "robotic-wheels", role: "Pre-integrated suspension and drive steer assembly" },
      { id: "plc-automation", name: "Modular Automation PLC", categorySlug: "control-systems", role: "Safety zone monitoring and dual-drive coordination" },
    ],
    traceableResources: [
      { refCode: "DS-WHL-DRV-2026-REV2", title: "AMR Industrial Drive Wheel Spec", type: "Datasheet" },
      { refCode: "APP-WHL-AMR-SIZE", title: "AMR Drive Traction & Sizing Guide", type: "Application Guide" },
    ],
    verificationMethod: "Ramp incline pull-test on concrete test track with dynamometer load cart logging continuous motor winding thermistors.",
    enquiryContext: "Heavy AMR Wheel Unit & Sizing Review",
  },
  {
    id: "app-weld-heavy-pipe",
    title: "Multi-Pass Heavy Pipe Robotic Seam Welding with Real-Time Laser Tracking",
    industry: "Welding & Fabrication",
    industrySlug: "welding",
    engineeringProblem: "Continuous Contoured Path Tracking",
    problemSlug: "path-tracking",
    projectType: "Documented Real Project",
    problemStatement:
      "Thick-walled pressure vessel welding requires multi-layer submerged arc or GMAW welding over 8-hour continuous cycles. Thermal joint expansion and weld bevel fit-up variations cause weld porosity if the torch deviates by more than 0.25 mm.",
    mechanicalConstraints: [
      "Torch position tracking tolerance: ±0.20 mm along continuous 3D pipe seam",
      "Continuous welding duty cycle: 100% duty at 350 A arc current",
      "Ambient radiation exposure: up to 180°C radiant heat at wrist tool mounting flange",
      "Continuous coordinated movement: 6-axis robot synchronized with 2-axis pipe positioner turntable",
    ],
    recommendedArchitecture: [
      { stage: "Manipulator Arm", description: "Heavy-duty 6-axis robot with internal cable dress pack and high-temperature wrist heat shields." },
      { stage: "Pipe Positioner Turntable", description: "Zero-backlash cycloidal rotary table synchronized as external 7th and 8th kinematics axes." },
      { stage: "Sensor Feedback Loop", description: "High-speed 3D laser seam tracking profilometer feeding corrective offsets to controller at 50 Hz." },
    ],
    associatedProducts: [
      { id: "6-axis", name: "6-Axis Articulated Robots", categorySlug: "robotic-arms", role: "Continuous seam welding torch manipulator" },
      { id: "cycloidal", name: "Cycloidal Reducers", categorySlug: "precision-reducers", role: "Heavy positioner turntable speed reduction" },
      { id: "robot-controllers", name: "Robot Trajectory Controllers", categorySlug: "control-systems", role: "8-axis coordinated motion kernel with real-time seam tracking offset" },
    ],
    traceableResources: [
      { refCode: "DS-ARM-6AX-2026-REV4", title: "6-Axis Articulated Industrial Robot Datasheet", type: "Datasheet" },
      { refCode: "DS-RED-CYC-2026-REV3", title: "Precision Cycloidal Reducer Dossier", type: "Datasheet" },
    ],
    verificationMethod: "Radiographic X-ray and ultrasonic non-destructive testing (NDT) of multi-pass pipe weldments according to ASME Section IX.",
    enquiryContext: "Multi-Axis Robotic Pipe Welding Cell Design",
  },
  {
    id: "app-elec-pcb-dispensing",
    title: "Sub-Micron High-Speed Adhesive Dispensing for Smartphone Camera Modules",
    industry: "Electronics & Semiconductor",
    industrySlug: "electronics",
    engineeringProblem: "Sub-Micron Optical Alignment Drift",
    problemSlug: "optical-drift",
    projectType: "Illustrative Engineering Example",
    problemStatement:
      "Micro-dispensing of thermal epoxy around camera image sensor perimeters requires continuous dispensing bead widths of 120 µm. Machine bed thermal expansion and motor vibration cause glue bead necking and optical sensor tilt.",
    mechanicalConstraints: [
      "Dispensing position repeatability: ±0.003 mm across 300 × 300 mm work envelope",
      "Dispensing velocity stability: velocity ripple < 0.5% during curvilinear cornering",
      "Carriage thermal stability: temperature delta < 0.5°C over 12-hour continuous shift",
      "Non-contact laser height sensor closed-loop Z-axis surface tracking at 1 kHz",
    ],
    recommendedArchitecture: [
      { stage: "Planar XY Stage", description: "Ironless linear motor direct-drive stage mounted on natural Grade 00 granite base." },
      { stage: "Feedback Metrology", description: "Reflective optical linear scales with 50 nm resolution and zero Abbe offset design." },
      { stage: "Dispenser Z-Axis", description: "Voice coil direct-drive actuator for instantaneous height adjustment over warped substrates." },
    ],
    associatedProducts: [
      { id: "linear", name: "Precision Guided Linear Slide", categorySlug: "actuators", role: "High-repeatability direct-drive linear positioning" },
      { id: "servo-drives", name: "Ultra-Fast Servo Drives", categorySlug: "control-systems", role: "Nanometer resolution interpolation and ripple compensation" },
      { id: "pick-and-place", name: "Pick & Place Robotics", categorySlug: "robotic-arms", role: "Cartesian high-speed micro-placement platform" },
    ],
    traceableResources: [
      { refCode: "DS-ACT-LIN-2026-REV3", title: "Linear Slide Module Datasheet", type: "Datasheet" },
      { refCode: "DS-CTRL-SRV-2026-REV3", title: "Multi-Axis Servo Drive Datasheet", type: "Datasheet" },
    ],
    verificationMethod: "Non-contact 3D optical confocal metrology measuring glue bead volume and cross-sectional profile repeatability.",
    enquiryContext: "Micro-Dispensing Motion Stage Selection",
  },
];
