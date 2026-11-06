import type {
  RpaWorkflowStage,
  RpaSolutionCell,
  RpaStackLayer,
  RpaAssessmentInputs,
  RpaAssessmentResult,
} from "@/types/rpa";

export const RPA_WORKFLOW_STAGES: RpaWorkflowStage[] = [
  {
    id: "stage-1",
    stepNumber: 1,
    name: "3D Vision Ingestion & Part Pose Estimation",
    shortName: "Vision Pose",
    category: "perception",
    cycleTimeMs: 42,
    repeatabilityMm: 0.015,
    description:
      "Dual ToF and structured-light 3D sensors capture point-cloud coordinate matrices. Edge AI inferencing calculates 6-DoF spatial centroid with sub-pixel rectification in < 45 ms.",
    detailedSpecs: {
      fieldbus: "GigE Vision / TSN IEEE 802.1Qbv",
      refreshRate: "120 FPS Real-Time Stream",
      accuracy: "±0.012 mm Point Density",
      safetyStandard: "ISO 13849-1 Cat 4 / PL e",
    },
    hardwareComponents: [
      "INDUS OptiScan-3D ToF Perception Head",
      "Jetson AGX Orin Edge Tensor Engine",
      "High-Intensity 850nm Stroboscopic Ring Light",
    ],
    telemetryMetrics: {
      tcpVelocity: "0.00 m/s (Stationary Capture)",
      dynamicTorque: "0.0 Nm",
      powerDrawKw: 0.18,
      status: "OPTIMAL",
    },
  },
  {
    id: "stage-2",
    stepNumber: 2,
    name: "Kinematic Trajectory Generation & Jerk Minimization",
    shortName: "Trajectory Gen",
    category: "planning",
    cycleTimeMs: 18,
    repeatabilityMm: 0.005,
    description:
      "Deterministic 5th-order polynomial splines dynamically plan optimal collision-free Tool Center Point (TCP) pathing with continuous jerk limitation to prevent payload shear stress.",
    detailedSpecs: {
      fieldbus: "EtherCAT Distributed Clocks (DC)",
      refreshRate: "1.000 kHz Deterministic Interpolation",
      accuracy: "Zero Singularities Avoidance Matrix",
      safetyStandard: "ISO 10218-1 Clause 5.4.2",
    },
    hardwareComponents: [
      "INDUS EtherCAT Real-Time Motion Core",
      "TwinCAT / Codesys IEC 61131-3 Runtime",
      "DSP Dynamic Kinematic Co-Processor",
    ],
    telemetryMetrics: {
      tcpVelocity: "2.85 m/s (Interpolating)",
      dynamicTorque: "42.6 Nm (Peak Acceleration)",
      powerDrawKw: 1.45,
      status: "PROCESSING",
    },
  },
  {
    id: "stage-3",
    stepNumber: 3,
    name: "Dynamic Torque Compliance & Vacuum Gripping",
    shortName: "Adaptive Grip",
    category: "execution",
    cycleTimeMs: 95,
    repeatabilityMm: 0.008,
    description:
      "6-axis force-torque sensor at robot wrist regulates contact force down to 0.1 N while multi-chamber smart vacuum cups or electric micro-fingers secure part without cosmetic marring.",
    detailedSpecs: {
      fieldbus: "IO-Link Wireless Class B / PROFINET",
      refreshRate: "2.500 kHz Force Feedback Loop",
      accuracy: "0.05 N Sensitivity Threshold",
      safetyStandard: "ISO/TS 15066 Power & Force Limiting",
    },
    hardwareComponents: [
      "INDUS SensForce-6D Wrist Metrology Flange",
      "Micro-Piezo Venturi Vacuum Generator",
      "Harmonic Reducer Joint Actuator J6",
    ],
    telemetryMetrics: {
      tcpVelocity: "0.45 m/s (Contact Approach)",
      dynamicTorque: "18.2 Nm (Stable Clamping)",
      powerDrawKw: 0.62,
      status: "VERIFIED",
    },
  },
  {
    id: "stage-4",
    stepNumber: 4,
    name: "In-Line Laser Metrology & Optical Defect Screening",
    shortName: "Metrology Q/A",
    category: "inspection",
    cycleTimeMs: 65,
    repeatabilityMm: 0.002,
    description:
      "High-speed 405nm blue laser triangulation scanner measures critical dimensions, planar flatness, and seam gap tolerances, rejecting non-conforming parts to quarantine buffer.",
    detailedSpecs: {
      fieldbus: "OPC UA Pub/Sub TSN Over UDP",
      refreshRate: "4.000 kHz Laser Sampling",
      accuracy: "±0.002 mm (2 Microns) Resolution",
      safetyStandard: "FDA CDRH Class 2M Laser Safety",
    },
    hardwareComponents: [
      "INDUS UltraGauge Blue-Laser Triangulator",
      "In-Line Calibration Ceramic Sphere Artifact",
      "Automated Scrap Diverter Solenoid Gate",
    ],
    telemetryMetrics: {
      tcpVelocity: "1.10 m/s (Inspection Scan)",
      dynamicTorque: "12.4 Nm",
      powerDrawKw: 0.35,
      status: "OPTIMAL",
    },
  },
  {
    id: "stage-5",
    stepNumber: 5,
    name: "Deterministic Conveyor / AMR Handoff & Dispatch",
    shortName: "Handoff / AMR",
    category: "dispatch",
    cycleTimeMs: 130,
    repeatabilityMm: 0.01,
    description:
      "Synchronized conveyor tracking or Autonomous Mobile Robot (AMR) docking interface transfers completed assembly into downstream packaging cell with zero production line stall.",
    detailedSpecs: {
      fieldbus: "OPC UA Field eXchange (FX) / EtherNet/IP",
      refreshRate: "500 Hz Conveyor Encoder Tracking",
      accuracy: "±0.05 mm Rotary Alignment",
      safetyStandard: "ISO 3691-4 Industrial Mobile Safety",
    },
    hardwareComponents: [
      "INDUS SyncDrive Line-Tracking Optical Encoder",
      "Docking Magnetic Pin Alignment Subsystem",
      "Automated AMR Fleet Dispatch Gateway",
    ],
    telemetryMetrics: {
      tcpVelocity: "0.85 m/s (Release)",
      dynamicTorque: "6.8 Nm",
      powerDrawKw: 0.48,
      status: "STANDBY",
    },
  },
];

export const RPA_SOLUTION_CELLS: RpaSolutionCell[] = [
  {
    id: "cell-ev-battery",
    title: "EV Battery Module Ultrasonic Welding & Busbar Cell",
    subtitle: "Turnkey automated cell for high-voltage automotive battery pack assembly and tab interconnection.",
    industry: "automotive_ev",
    industryLabel: "Automotive & EV",
    robotType: "6-Axis Articulated",
    payloadKg: 35,
    reachMm: 1850,
    cycleTimeSec: 2.8,
    repeatabilityMm: 0.012,
    throughputPerHour: 1280,
    roiMonths: 7.5,
    tag: "High-Current Battery Pack",
    description:
      "Fully integrated cell featuring synchronized ultrasonic wire bonding, laser busbar welding, and in-line thermal imaging for prismatic and cylindrical EV lithium-ion battery modules.",
    keyFeatures: [
      "Sub-millimeter weld bead geometry verification with confocal blue laser",
      "Continuous electrical resistance micro-ohm testing during clamp phase",
      "Integrated nitrogen gas inert purge chamber with automatic door interlocks",
      "Automated electrode cleaning wheel and tip dressing station",
    ],
    targetApplications: [
      "Prismatic battery pack busbar laser welding",
      "Cylindrical 4680 cell ribbon bonding",
      "Module thermal gap filler automated dispensing",
    ],
    hardwareBom: [
      { component: "Primary Articulated Robot", spec: "6-DoF, 35 kg Payload, IP67 Arm", indusModel: "INDUS-ARM-35-185" },
      { component: "Rotary Joint Reducer (J1-J3)", spec: "Zero-Backlash Cycloidal Reducer", indusModel: "INDUS-CYC-220-CR" },
      { component: "High-Frequency Ultrasonic Welder", spec: "20 kHz, 4.0 kW Generator", indusModel: "INDUS-WELD-US-40" },
      { component: "Vision Inspection Sensor", spec: "3D Structured Light 5 MP", indusModel: "INDUS-VIS-3D-500" },
    ],
    standards: ["ISO 10218-2", "DIN EN 61010-1", "ISO 13849-1 PL d"],
  },
  {
    id: "cell-electronics-assembly",
    title: "High-Speed SMT Electronic Screwdriving & Dispensing Cell",
    subtitle: "Precision micro-assembly for smartphones, medical electronics, and server motherboard sub-assemblies.",
    industry: "electronics_semiconductor",
    industryLabel: "Electronics & SMT",
    robotType: "SCARA High-Speed",
    payloadKg: 6,
    reachMm: 700,
    cycleTimeSec: 0.45,
    repeatabilityMm: 0.006,
    throughputPerHour: 3400,
    roiMonths: 6.2,
    tag: "Ultra-High Speed SCARA",
    description:
      "Engineered for high-mix consumer electronics manufacturing. Combines torque-monitored electric screwdriving (M1.0 to M3.0) with automated conformal coating dispensing and AOI inspection.",
    keyFeatures: [
      "Torque curve signature analysis with 0.001 Nm resolver feedback",
      "Dual-head tool changer switching between vacuum nozzle and electric screwdriver",
      "Piezoelectric jetting valve for 200 Hz adhesive micro-droplet dispensing",
      "Closed-loop optical screw depth verification prevents cross-threading",
    ],
    targetApplications: [
      "Smartphone chassis screw fastening",
      "Automotive ECU conformal coating dispensing",
      "Wearable sensor micro-assembly and flex PCB insertion",
    ],
    hardwareBom: [
      { component: "High-Speed SCARA Mechanism", spec: "4-Axis, 0.38s Standard Cycle", indusModel: "INDUS-SCARA-06-70" },
      { component: "Harmonic Strain-Wave Gear (J4)", spec: "Ratio 1:100, Repeatability ±0.005mm", indusModel: "INDUS-HRG-14-100" },
      { component: "Electric Screwdriver Spindle", spec: "0.02 - 1.2 Nm Closed-Loop Brushless", indusModel: "INDUS-TORQ-MICRO-12" },
      { component: "AOI Optical Inspection", spec: "Sub-pixel Telecentric Lens 12 MP", indusModel: "INDUS-AOI-TELE-12" },
    ],
    standards: ["IPC-A-610 Class 3", "ISO 9001:2015", "ESD S20.20"],
  },
  {
    id: "cell-semiconductor-wafer",
    title: "ISO Class 3 Semiconductor 300mm Wafer Transfer Cell",
    subtitle: "Cleanroom robotic handling of silicon wafers and photolithography reticle cassettes with zero vibration.",
    industry: "electronics_semiconductor",
    industryLabel: "Semiconductor Cleanroom",
    robotType: "SCARA High-Speed",
    payloadKg: 4,
    reachMm: 950,
    cycleTimeSec: 1.1,
    repeatabilityMm: 0.003,
    throughputPerHour: 1800,
    roiMonths: 9.0,
    tag: "Cleanroom ISO Class 3",
    description:
      "Ultra-clean atmospheric and vacuum-compatible wafer transfer robot with dual carbon-fiber end-effectors, electrostatic dissipative coatings, and dynamic trajectory damping for 200mm / 300mm wafers.",
    keyFeatures: [
      "Zero particle emission certified under ISO 14644-1 Class 3 standards",
      "Non-contact Bernoulli and edge-grip vacuum chucks for fragile 50 µm wafers",
      "Active vibration cancellation algorithms suppress resonance below 0.002 G",
      "Integrated wafer notch and laser flat alignment within 50 milliseconds",
    ],
    targetApplications: [
      "Front Opening Unified Pod (FOUP) load port loading",
      "Chemical Mechanical Planarization (CMP) cassette transfer",
      "Metrology station wafer positioning and defect mapping",
    ],
    hardwareBom: [
      { component: "Cleanroom Dual-Arm Scara", spec: "ISO Class 3, Direct Drive Motors", indusModel: "INDUS-CLEAN-SCARA-300" },
      { component: "Carbon Fiber End-Effector", spec: "PEEK Contact Pads, Integrated Vacuum Channels", indusModel: "INDUS-WFR-EF-CARBON" },
      { component: "Laser Notch Optical Aligner", spec: "Resolution ±0.001 mm, 360° Rotary", indusModel: "INDUS-NOTCH-ALIGN-40" },
      { component: "Ionizer Neutralization Bar", spec: "Self-Balancing AC Discharge", indusModel: "INDUS-ION-BAR-200" },
    ],
    standards: ["SEMI S2 / S8", "ISO 14644-1 Class 3", "CE Machinery Directive"],
  },
  {
    id: "cell-delta-packaging",
    title: "High-Speed Delta Secondary Packaging & Case Packing Cell",
    subtitle: "Parallel kinematics robot cell for ultra-rapid pick, orientation, and carton boxing operations.",
    industry: "food_packaging",
    industryLabel: "Food & Packaging",
    robotType: "Delta Parallel",
    payloadKg: 8,
    reachMm: 1200,
    cycleTimeSec: 0.28,
    repeatabilityMm: 0.02,
    throughputPerHour: 4800,
    roiMonths: 5.8,
    tag: "Ultra-High Pick Rate",
    description:
      "Designed for high-speed primary and secondary food, confectionery, and pharmaceutical packaging. Delivers up to 180 picks per minute with dynamic conveyor tracking and FDA-compliant materials.",
    keyFeatures: [
      "Titanium arm linkages with hollow carbon-fiber composite struts",
      "Washdown IP69K construction withstands high-pressure caustic clean-in-place (CIP)",
      "Multi-head vacuum cup arrays with instantaneous blow-off pneumatic valves",
      "3D vision conveyor tracker matches conveyor speeds up to 1.8 m/sec seamlessly",
    ],
    targetApplications: [
      "Flow-wrapped snack food collation and case boxing",
      "Bottle capping and secondary carton grouping",
      "Blister pack sorting into corrugated shippers",
    ],
    hardwareBom: [
      { component: "Delta Parallel Kinematics", spec: "4-Axis, IP69K Washdown, 180 PPM", indusModel: "INDUS-DELTA-08-120" },
      { component: "Direct Servo Actuators (3x)", spec: "Low-Inertia Synchronous Servo Motor", indusModel: "INDUS-SRV-DRV-150" },
      { component: "Pneumatic Ejector Array", spec: "FDA Food-Grade Silicone Suction Cups", indusModel: "INDUS-VAC-FDA-SIL" },
      { component: "Linear Tracking Encoder", spec: "Incremental Optical Line Tracer", indusModel: "INDUS-ENC-LINE-500" },
    ],
    standards: ["FDA 21 CFR 177", "3-A Sanitary Standards", "ISO 10218-1"],
  },
  {
    id: "cell-pharma-sterile",
    title: "Sterile Medical Syringe Vial Filling & Vision Inspection Cell",
    subtitle: "RABS & Isolator-compatible automation cell for aseptic liquid filling, rubber stoppering, and crimping.",
    industry: "pharma_medical",
    industryLabel: "Pharma & Medical",
    robotType: "Cobot Hybrid",
    payloadKg: 10,
    reachMm: 1050,
    cycleTimeSec: 1.4,
    repeatabilityMm: 0.008,
    throughputPerHour: 2200,
    roiMonths: 8.8,
    tag: "Sterile Cleanroom GMP",
    description:
      "Engineered for pharmaceutical aseptic processing suites. Operates inside Restricted Access Barrier Systems (RABS) and isolators with hydrogen peroxide (VHP) decontamination resistance.",
    keyFeatures: [
      "Vaporized Hydrogen Peroxide (VHP) compatible special anodized enclosure",
      "Peristaltic micro-dosing pump accuracy of ±0.5% fill volume (0.1 ml to 50 ml)",
      "Vision check for particle contamination, fill level, and aluminum crimp integrity",
      "FDA 21 CFR Part 11 compliant audit trail and encrypted batch genealogy logging",
    ],
    targetApplications: [
      "Injectable vaccine vial liquid filling and rubber stoppering",
      "Pre-filled syringe plunger rod automated insertion",
      "Sterile diagnostic cartridge micro-pipetting",
    ],
    hardwareBom: [
      { component: "Cleanroom VHP Cobot Arm", spec: "6-Axis, Smooth Sealed Outer Housing", indusModel: "INDUS-MED-COBOT-10" },
      { component: "Ceramic Rotary Piston Pump", spec: "Zero-Drip High-Accuracy Dispenser", indusModel: "INDUS-PHARM-PUMP-05" },
      { component: "High-Resolution Vision Verifier", spec: "Liquid Meniscus & Particle Scanner", indusModel: "INDUS-VIS-PART-300" },
      { component: "Stainless Steel Tool Coupler", spec: "316L Pharmaceutical Grade Auto-Coupler", indusModel: "INDUS-CPL-316L-QC" },
    ],
    standards: ["EU GMP Annex 1", "FDA 21 CFR Part 11", "ISO 13485:2016"],
  },
  {
    id: "cell-cnc-tending",
    title: "Dual-Spindle CNC Machine Tending & Robotic Deburring Cell",
    subtitle: "Heavy-duty automated raw billet loading, finished part extraction, and in-cell robotic deburring.",
    industry: "machining_metal",
    industryLabel: "Machining & Precision Metal",
    robotType: "Cartesian Gantry",
    payloadKg: 50,
    reachMm: 2400,
    cycleTimeSec: 4.5,
    repeatabilityMm: 0.015,
    throughputPerHour: 640,
    roiMonths: 8.1,
    tag: "Heavy Machining & Deburring",
    description:
      "Automates round-the-clock spindle utilization across two CNC horizontal milling machines. Features dual-gripper exchange for simultaneous rough billet infeed and finished machined part outfeed.",
    keyFeatures: [
      "Dual 3-jaw concentric pneumatic chucks cut spindle idle swap time to under 6 seconds",
      "Robotic deburring spindle with compliance toolholder for consistent edge chamfering",
      "In-line high-pressure coolant wash and air-knife drying station",
      "Automated blow-off nozzle clears CNC chuck chips before part seating",
    ],
    targetApplications: [
      "Automotive transmission gear blank CNC tending",
      "Aerospace titanium bracket milling and deburring",
      "Precision valve body multi-axis turning loading",
    ],
    hardwareBom: [
      { component: "Heavy Overhead Cartesian Gantry", spec: "3-Axis Servo, 50 kg Payload, 2.4m Stroke", indusModel: "INDUS-GANTRY-50-24" },
      { component: "Rotary Wrist Module", spec: "Continuous 360° Planetary Reducer", indusModel: "INDUS-PLN-120-ROT" },
      { component: "Dual 3-Jaw Concentric Chuck", spec: "High-Pressure Hydraulic / Pneumatic", indusModel: "INDUS-GRP-3JAW-DUAL" },
      { component: "Deburring High-Speed Spindle", spec: "40,000 RPM Air-Turbine Spindle", indusModel: "INDUS-SPNDL-40K-AIR" },
    ],
    standards: ["ISO 10218-2", "DIN 66025 (G-Code)", "OSHA 1910.212"],
  },
];

export const RPA_STACK_LAYERS: RpaStackLayer[] = [
  {
    tierNumber: 1,
    tierCode: "TIER-01",
    name: "Deterministic Real-Time Motion & Kinematics Control",
    headline: "1 Millisecond Cycle Jitter • SafeMotion SIL 3 / PL e",
    description:
      "The deterministic backbone synchronizing all robot axes, linear rail gantries, and peripheral tooling via EtherCAT / TSN with sub-microsecond clock jitter.",
    protocols: ["EtherCAT DC", "PROFINET IRT", "TSN IEEE 802.1Qbv", "CANopen / CiA 402"],
    hardwareHighlight: "INDUS Master Motion Core with Quad-Core ARM Real-Time Co-Processor",
    keyMetrics: [
      { label: "Cycle Jitter", value: "< 0.8 µs" },
      { label: "Loop Frequency", value: "4.000 kHz" },
      { label: "Synchronized Axes", value: "Up to 64" },
      { label: "Safety Rating", value: "SIL 3 / PL e Cat 4" },
    ],
    bulletPoints: [
      "Coordinated 6-DoF forward and inverse kinematic solvers with obstacle avoidance",
      "Continuous jerk limitation and torque feed-forward compensation for reducer longevity",
      "Integrated Safe Torque Off (STO), Safe Stop 1/2, and Safely-Limited Speed (SLS)",
    ],
  },
  {
    tierNumber: 2,
    tierCode: "TIER-02",
    name: "High-Precision Flange Reducers & End-Effectors",
    headline: "Zero Backlash (< 0.1 arcmin) • 25,000h Continuous L10h Life",
    description:
      "Custom precision strain wave and cycloidal reducers paired with multi-axis force-torque wrist flanges for tactile compliance during micron-level insertions.",
    protocols: ["IO-Link Wireless", "RS-485 Modbus RTU", "Deterministic Analog ±10V"],
    hardwareHighlight: "INDUS Hollow-Shaft Reducer with Integrated 19-Bit Absolute Optical Encoders",
    keyMetrics: [
      { label: "Backlash Lost Motion", value: "< 0.1 Arcmin" },
      { label: "Wrist Force Sensitivity", value: "0.05 Newtons" },
      { label: "Torque Density", value: "320 Nm / kg" },
      { label: "Service Life (L10h)", value: "≥ 25,000 Hours" },
    ],
    bulletPoints: [
      "Hollow-bore central aperture allows clean internal cabling for air lines and GigE cables",
      "Dynamic load sharing gears engineered from aerospace-grade nitrided alloy steel",
      "Fast-acting piezo-controlled vacuum release reduces pick-to-drop lag to < 20 ms",
    ],
  },
  {
    tierNumber: 3,
    tierCode: "TIER-03",
    name: "Edge AI Machine Vision & In-Line Metrology",
    headline: "120 FPS Real-Time Inference • 2-Micron Laser Profiling",
    description:
      "Combines deep learning spatial object localization with calibrated blue-laser triangulation for simultaneous part acquisition and 100% quality gatekeeper inspection.",
    protocols: ["GigE Vision 2.0", "GenICam", "OPC UA Pub/Sub", "TensorRT Acceleration"],
    hardwareHighlight: "INDUS OptiScan-3D Dual ToF Sensor with Embedded Jetson Orin AI Accelerator",
    keyMetrics: [
      { label: "Perception Latency", value: "18 ms" },
      { label: "Metrology Accuracy", value: "± 0.002 mm" },
      { label: "Classification Models", value: "YOLOv10 / ResNet" },
      { label: "Defect Catch Rate", value: "99.98%" },
    ],
    bulletPoints: [
      "Auto-calibrating eye-in-hand and stationary multi-camera stereoscopic setups",
      "Point cloud segmentation filters reflections, shadows, and oily metallic sheen",
      "Automatic dynamic trajectory correction for parts shifted on incoming conveyor belts",
    ],
  },
  {
    tierNumber: 4,
    tierCode: "TIER-04",
    name: "Industry 4.0 MES, SCADA & Digital Twin Telemetry",
    headline: "Cloud & On-Premises Telemetry • Full Batch Traceability",
    description:
      "Seamlessly connects every RPA workcell into factory-wide Manufacturing Execution Systems (MES), SCADA monitoring dashboards, and 3D digital twin simulators.",
    protocols: ["OPC UA Client/Server", "MQTT Sparkplug B", "SECS / GEM 300", "REST Webhooks"],
    hardwareHighlight: "INDUS Edge Gateway TSN with Hardware-Encrypted TPM 2.0 Cryptographic Chip",
    keyMetrics: [
      { label: "Telemetry Telemetry Rate", value: "100 Hz Streaming" },
      { label: "Batch Traceability", value: "100% Serialization" },
      { label: "MTBF Predictive Alert", value: "72 Hours Advance" },
      { label: "Cloud Connectors", value: "AWS / Azure / On-Prem" },
    ],
    bulletPoints: [
      "Complete cryptographic audit logging of every screw torque curve, weld pulse, and inspection image",
      "Predictive vibration frequency analysis identifies reducer bearing wear before failure occurs",
      "Bi-directional digital twin synchronizes simulated robot kinematics with physical workcell",
    ],
  },
];

export const RPA_CASE_STUDIES = [
  {
    client: "Tier-1 Automotive Propulsion Systems",
    facility: "Munich, Germany",
    cellType: "EV Inverter Power Electronics Screwdriving & Potting Cell",
    challenge:
      "Manual tightening of 36 micro-screws per inverter caused operator carpal fatigue, variable torque consistency (±18%), and 3.2% rework rate.",
    solution:
      "Dual INDUS SCARA cells with 0.001 Nm closed-loop electric drivers, automated optical depth checking, and dynamic thermal silicone potting.",
    results: {
      cycleTimeReduction: "- 62% Cycle Time (from 48s to 18s)",
      scrapReduction: "0.02% Scrap Rate (99.4% drop)",
      paybackPeriod: "6.8 Months Full Payback",
      throughputGain: "+ 240% Daily Unit Output",
    },
  },
  {
    client: "Global Semiconductor Packaging Leader",
    facility: "Singapore Wafer Hub",
    cellType: "Cleanroom 300mm Silicon Wafer Carrier Transfer Cell",
    challenge:
      "Airborne particulate contamination and micro-vibrations during manual wafer carrier handoffs caused micro-cracking in 7nm test wafers.",
    solution:
      "INDUS ISO Class 3 Cleanroom robotic cells with carbon-fiber Bernoulli end-effectors and active vibration suppression.",
    results: {
      cycleTimeReduction: "- 45% Handling Transfer Time",
      scrapReduction: "Zero Wafer Breakage across 1.2M Transfers",
      paybackPeriod: "8.2 Months Full Payback",
      throughputGain: "+ 180 Wafers / Hour",
    },
  },
  {
    client: "Medical Device Diagnostic Producer",
    facility: "Bengaluru Technology Corridor",
    cellType: "Sterile Covid/Flu Diagnostic Cartridge Dispensing & Sealing",
    challenge:
      "Strict FDA 21 CFR Part 11 requirements required 100% video traceability of chemical reagent volume and hermetic foil seal inspection.",
    solution:
      "INDUS Collaborative Medical Robot Cell with micro-pipetting ceramic pump, high-speed vision inspection, and serialized blockchain audit logging.",
    results: {
      cycleTimeReduction: "- 70% Sterile Processing Cycle",
      scrapReduction: "100% Automated Batch Serialization",
      paybackPeriod: "7.1 Months Full Payback",
      throughputGain: "3,600 Cartridges / Hour",
    },
  },
];

/**
 * Dynamic ROI calculation for industrial RPA deployment
 */
export function calculateRpaRoi(params: {
  shiftsPerDay: number; // 1, 2, or 3
  manualCycleTimeSec: number; // e.g. 15s
  laborHourlyRate: number; // e.g. $35/hr
  dailyProductionVolume: number; // e.g. 1500 parts
  scrapRatePercent: number; // e.g. 3.5%
  avgPartValue: number; // e.g. $45
}) {
  const operatingHoursPerShift = 7.5;
  const totalDailyHours = params.shiftsPerDay * operatingHoursPerShift;
  const annualOperatingDays = 250;
  const annualOperatingHours = totalDailyHours * annualOperatingDays;

  // Manual Costs
  // Number of operators needed = (dailyVolume * manualCycleTime / 3600) / totalDailyHours
  const totalDailyManualHoursNeeded = (params.dailyProductionVolume * params.manualCycleTimeSec) / 3600;
  const operatorsRequired = Math.max(1, Math.ceil(totalDailyManualHoursNeeded / totalDailyHours));
  const annualManualLaborCost = operatorsRequired * annualOperatingHours * params.laborHourlyRate;

  // Annual Scrap Cost Manual
  const annualVolume = params.dailyProductionVolume * annualOperatingDays;
  const annualManualScrapCost = annualVolume * (params.scrapRatePercent / 100) * params.avgPartValue;

  // Robotic System Improvements:
  // RPA reduces cycle time by ~55% and scrap by ~92%
  const roboticCycleTimeSec = Math.max(0.4, Number((params.manualCycleTimeSec * 0.42).toFixed(2)));
  const roboticScrapPercent = Math.max(0.05, Number((params.scrapRatePercent * 0.08).toFixed(2)));
  const annualRoboticScrapCost = annualVolume * (roboticScrapPercent / 100) * params.avgPartValue;

  // Robotic maintenance and electricity (~$8,500/yr per cell)
  const annualRpaMaintenanceCost = 8500 * Math.max(1, Math.ceil(operatorsRequired / 2));

  // Estimated Turnkey Cell Capital Investment ($75k - $185k depending on complexity)
  const estimatedCapitalInvestment = 85000 + (operatorsRequired - 1) * 45000;

  // Annual Net Savings
  const annualGrossSavings = annualManualLaborCost + (annualManualScrapCost - annualRoboticScrapCost);
  const annualNetSavings = annualGrossSavings - annualRpaMaintenanceCost;

  // Payback period in months
  const paybackMonths = Math.max(2.5, Number(((estimatedCapitalInvestment / annualNetSavings) * 12).toFixed(1)));

  // 5-Year Cumulative Net Present Value (NPV at 8% discount)
  let fiveYearNetBenefit = -estimatedCapitalInvestment;
  for (let year = 1; year <= 5; year++) {
    fiveYearNetBenefit += annualNetSavings / Math.pow(1.08, year);
  }

  // Throughput gain
  const potentialHourlyRoboticThroughput = Math.round(3600 / roboticCycleTimeSec);
  const manualHourlyThroughput = Math.round(3600 / params.manualCycleTimeSec);
  const throughputGainPercent = Math.round(
    ((potentialHourlyRoboticThroughput - manualHourlyThroughput) / manualHourlyThroughput) * 100,
  );

  return {
    operatorsSaved: operatorsRequired,
    annualLaborSavings: Math.round(annualManualLaborCost),
    annualScrapSavings: Math.round(annualManualScrapCost - annualRoboticScrapCost),
    annualNetSavings: Math.round(annualNetSavings),
    roboticCycleTimeSec,
    paybackMonths,
    estimatedCapitalInvestment: Math.round(estimatedCapitalInvestment),
    fiveYearNetBenefit: Math.round(fiveYearNetBenefit),
    throughputGainPercent,
    potentialHourlyThroughput: potentialHourlyRoboticThroughput,
  };
}

/**
 * Evaluates an industrial process feasibility assessment
 */
export function evaluateRpaAssessment(inputs: RpaAssessmentInputs): RpaAssessmentResult {
  let score = 92;
  const recommendations: string[] = [];

  // 1. Part Weight
  let kinematics = "6-Axis Articulated Robot";
  let gripper = "Electric Parallel Servo Gripper with Torque Sensor";
  if (inputs.partWeightCategory === "micro") {
    score += 4;
    kinematics = "High-Speed SCARA or Parallel Delta";
    gripper = "Piezoelectric Micro-Vacuum Chuck with Force Limiting";
    recommendations.push("Recommended Kinematics: High-Speed 4-Axis SCARA with Harmonic Strain Wave Reducer (Ratio 1:80).");
  } else if (inputs.partWeightCategory === "light") {
    score += 2;
    kinematics = "SCARA or 6-Axis Articulated Cobot";
    gripper = "Fast-Acting Smart Vacuum Venturi Array";
    recommendations.push("Ideal for dual-head pick-and-place with pneumatic blow-off release.");
  } else if (inputs.partWeightCategory === "heavy") {
    score -= 6;
    kinematics = "Heavy-Duty Cartesian Gantry or High-Payload 6-Axis (≥50 kg)";
    gripper = "High-Clamping Hydraulic / 3-Jaw Concentric Pneumatic Chuck";
    recommendations.push("Requires reinforced floor foundation and cycloidal heavy reducer gearing (INDUS-CYC series).");
  }

  // 2. Cycle Time Target
  let estCycleTime = 1.8;
  if (inputs.cycleTimeTarget === "ultra_fast") {
    score += 2;
    estCycleTime = 0.45;
    recommendations.push("Target cycle time < 1.0s requires carbon-fiber linkages and 4.0 kHz EtherCAT DC interpolation.");
  } else if (inputs.cycleTimeTarget === "fast") {
    estCycleTime = 1.2;
    recommendations.push("Standard industrial fast pick-and-place achievable with off-the-shelf INDUS joint actuators.");
  } else if (inputs.cycleTimeTarget === "standard") {
    estCycleTime = 3.5;
  }

  // 3. Environment
  let compliance = "Compliant with ISO 10218-1 Industrial Safety & CE Machinery Directives.";
  if (inputs.environmentRating === "cleanroom") {
    score -= 4;
    compliance = "Requires ISO 14644-1 Class 3-5 cleanroom enclosure, stainless hardware, and zero-outgassing seals.";
    recommendations.push("Use INDUS Cleanroom Series with PTFE wiring harnesses and negative-pressure vacuum exhaust.");
  } else if (inputs.environmentRating === "harsh_ip67") {
    compliance = "Requires IP67/IP69K washdown seals, Viton gaskets, and corrosion-resistant nickel-plated reducers.";
    recommendations.push("Deploy pressurized air-purge housing to prevent coolant ingress into joint bearings.");
  } else if (inputs.environmentRating === "sterile_fda") {
    compliance = "Compliant with FDA 21 CFR Part 11, EU GMP Annex 1, and 316L electropolished stainless finish.";
    recommendations.push("Specify vaporized hydrogen peroxide (VHP) resistant anodizing.");
  }

  // 4. Batch Mix
  let roiMonths = 7.2;
  if (inputs.batchMixType === "high_mix_low_volume") {
    score -= 5;
    roiMonths = 9.8;
    recommendations.push("Deploy AI-powered 3D vision object recognition to eliminate physical fixture changeovers.");
  } else {
    recommendations.push("High-volume tooling enables dedicated nesting dies with sub-10ms pneumatic release.");
  }

  const normalizedScore = Math.max(58, Math.min(99, score));
  let tier: RpaAssessmentResult["feasibilityTier"] = "High Feasibility";
  if (normalizedScore < 75) {
    tier = "Complex Architecture";
  } else if (normalizedScore < 85) {
    tier = "Moderate Feasibility";
  }

  return {
    feasibilityScore: normalizedScore,
    feasibilityTier: tier,
    recommendedKinematics: kinematics,
    recommendedGripper: gripper,
    estimatedCycleTimeSec: estCycleTime,
    estimatedThroughputPerHour: Math.round(3600 / estCycleTime),
    estimatedRoiMonths: roiMonths,
    keyRecommendations: recommendations,
    complianceNotes: compliance,
  };
}
