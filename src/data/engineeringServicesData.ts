/**
 * INDUS Industrial Robotics — Engineering Services Portfolio Data Architecture
 *
 * Defines the 7 core engineering service disciplines with rigorous technical data,
 * deterministic engineering methodologies, system components, verifiable deliverables,
 * customer input checklists, related products, and verified industrial application mappings.
 */

export interface ServiceCapability {
  title: string;
  description: string;
  engineeringDetail: string;
}

export interface ServiceSystemComponent {
  name: string;
  category: string;
  role: string;
}

export interface ServiceUseCase {
  title: string;
  industry: string;
  description: string;
  keyMetric: string;
}

export interface ServiceDeliverableGroup {
  category: string;
  items: string[];
  scopeQualification: string;
}

export interface CustomerChecklistGroup {
  category: string;
  items: string[];
}

export interface RelatedItem {
  name: string;
  path: string;
  detail: string;
}

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface EngineeringServiceItem {
  id: string;
  number: string;
  title: string;
  shortTitle: string;
  badge: string;
  summary: string;
  heroHeadline: string;
  heroSubtitle: string;
  targetAudience: string;
  problemStatement: {
    challenge: string;
    impact: string;
    technicalRisks: string[];
  };
  engineeringApproach: {
    methodology: string;
    stages: {
      step: string;
      name: string;
      focus: string;
      output: string;
    }[];
  };
  capabilities: ServiceCapability[];
  systemComponents: ServiceSystemComponent[];
  useCases: ServiceUseCase[];
  deliverables: ServiceDeliverableGroup[];
  customerChecklist: CustomerChecklistGroup[];
  relatedProducts: RelatedItem[];
  relatedApplications: RelatedItem[];
  faqs: ServiceFaq[];
}

export const ENGINEERING_SERVICES: EngineeringServiceItem[] = [
  // =========================================================================
  // SERVICE 01: Application Engineering & Feasibility
  // =========================================================================
  {
    id: "application-engineering",
    number: "01",
    title: "Application Engineering & Feasibility",
    shortTitle: "Application Feasibility",
    badge: "Feasibility & Architecture",
    summary:
      "Evaluate automation opportunities, clarify technical requirements, and compare system architectures before committing to capital equipment.",
    heroHeadline: "Deterministic Feasibility, Work-Envelope Analysis & Kinematic Selection",
    heroSubtitle:
      "Prevent costly redesigns and cycle-time failures by validating mechanical envelopes, payload dynamics, and kinematic trade-offs before equipment procurement.",
    targetAudience:
      "Manufacturing engineers, production heads, and automation project managers evaluating new or retrofit robotic lines.",
    problemStatement: {
      challenge:
        "Industrial automation initiatives often stall or exceed budget when kinematics and cycle-time requirements are estimated without rigorous dynamic modeling. Over-specifying equipment inflates capital expenditure, while under-specifying leads to premature reducer wear, motor overheating, or missed throughput targets.",
      impact:
        "Unvalidated robot selection frequently results in interference during tooling reorientation, unexpected station bottlenecks, and prolonged site commissioning.",
      technicalRisks: [
        "Inaccurate inertia ratios causing servo loop oscillation and path distortion",
        "Tooling deflection under high dynamic acceleration exceeding part tolerances",
        "Sub-optimal trajectory planning causing thermal cutouts in high-duty cycles",
        "Inadequate clearance at robot reach boundaries and singular configurations",
      ],
    },
    engineeringApproach: {
      methodology:
        "We apply a 4-phase physical simulation and engineering calculation framework to stress-test your process parameters against empirical mechanical and electrical limits.",
      stages: [
        {
          step: "01",
          name: "Process Decomposition",
          focus:
            "Break down the target cycle into discrete transfer, dwell, process, and inspection phases.",
          output: "Cycle-time budget & preliminary velocity/acceleration profiles",
        },
        {
          step: "02",
          name: "Kinematic Reach & Simulation",
          focus:
            "Model 3D reach envelopes, singularity zones, and interference with machine doors and fixtures.",
          output: "3D CAD envelope verification & obstacle avoidance paths",
        },
        {
          step: "03",
          name: "Inertia & Dynamic Sizing",
          focus:
            "Compute peak torque, RMS motor loading, and load-to-motor inertia ratio for all articulated axes.",
          output: "Dynamic torque-speed verification curves with safety margins",
        },
        {
          step: "04",
          name: "Architecture Trade-Off Review",
          focus:
            "Compare 6-axis articulated, SCARA, Cartesian, and cobot configurations across throughput, footprint, and cost.",
          output: "Final Feasibility & Architecture Decision Matrix",
        },
      ],
    },
    capabilities: [
      {
        title: "Process & Bottleneck Analysis",
        description: "Granular breakdown of production steps to identify true cycle bottlenecks.",
        engineeringDetail:
          "Calculation of takt time, transfer times, dwell durations, and pneumatic actuator stroke times.",
      },
      {
        title: "Kinematic Configuration Selection",
        description: "Matching kinematic topology to application geometry and speed requirements.",
        engineeringDetail:
          "Comparison between Articulated (6-DOF), SCARA (4-DOF), Delta parallel, and Cartesian gantries.",
      },
      {
        title: "Payload, Reach & Inertia Modeling",
        description: "Dynamic verification of end-of-arm tooling and part mass moments of inertia.",
        engineeringDetail:
          "Evaluation against wrist load curves: Jx, Jy, Jz inertia tensors and center of gravity offsets.",
      },
      {
        title: "3D Work-Envelope & Clearance Review",
        description:
          "CAD-based station layout to ensure full reach without joint limit or singularity traps.",
        engineeringDetail:
          "Checking wrist singularities (wrist-alignment, elbow-over-head) and machine entry clearances.",
      },
      {
        title: "Component Trade-Off & Selection",
        description: "Objective evaluation of reducers, servo drives, sensors, and end-effectors.",
        engineeringDetail:
          "Trade-off matrices contrasting torque density, repeatability, lead times, and total lifecycle costs.",
      },
      {
        title: "ROI Estimation from Customer Assumptions",
        description:
          "Financial and throughput modeling based on agreed customer operating assumptions.",
        engineeringDetail:
          "Deterministic payback models factoring in scrap reduction, uptime increases, and maintenance cycles.",
      },
    ],
    systemComponents: [
      {
        name: "6-Axis Articulated Robots",
        category: "Kinematics",
        role: "High-flexibility part manipulation and complex orientation",
      },
      {
        name: "Precision SCARA Arms",
        category: "Kinematics",
        role: "High-speed planar assembly and pick-and-place transfer",
      },
      {
        name: "Cartesian Linear Gantries",
        category: "Kinematics",
        role: "Heavy-payload, long-stroke machine tending and palletizing",
      },
      {
        name: "End-of-Arm Tooling (EOAT)",
        category: "Tooling",
        role: "Pneumatic, servo, or vacuum mechanical interfacing",
      },
      {
        name: "Optical Presence Sensors",
        category: "Sensing",
        role: "Part verification and fixture clamping detection",
      },
      {
        name: "Station Controller / PLC",
        category: "Controls",
        role: "Sequential handshake and safety interlock execution",
      },
    ],
    useCases: [
      {
        title: "CNC Machine Tending Automation Feasibility",
        industry: "Precision Machining & Aerospace",
        description:
          "Evaluated feasibility of replacing manual CNC lathe loading with a shared rail-mounted articulated robot.",
        keyMetric:
          "Demonstrated 28% cycle-time compression and eliminated door interlock dwell times.",
      },
      {
        title: "High-Speed Electronics Tray Packaging",
        industry: "Consumer Electronics",
        description:
          "Simulated dual-SCARA vs single 6-axis robot for PCB connector insertion and tray palletizing.",
        keyMetric:
          "Selected dual-SCARA architecture meeting 0.8s pick-and-place requirement with 35% lower cost.",
      },
      {
        title: "Heavy Castings Palletizing Cell Assessment",
        industry: "Foundry & Heavy Machinery",
        description:
          "Analyzed moment of inertia for 85 kg rough castings under 2.5 m reach constraints.",
        keyMetric:
          "Identified high wrist inertia risk, recommending custom counterbalanced EOAT to prevent reducer overload.",
      },
      {
        title: "Cleanroom Medical Vial Handling Feasibility",
        industry: "Pharmaceutical & Life Sciences",
        description:
          "Feasibility review of ISO Class 5 cleanroom manipulator for sterile vial packaging.",
        keyMetric:
          "Confirmed stainless steel smooth-body arm suitability with laminar airflow simulation.",
      },
    ],
    deliverables: [
      {
        category: "Engineering Reports",
        items: [
          "Automation Feasibility & Risk Assessment Report",
          "Cycle-Time Budget & Motion Phase Velocity Profiles",
          "Kinematic Configuration Trade-Off Evaluation",
          "ROI & Payback Model using customer baseline data",
        ],
        scopeQualification:
          "Deliverables are tailored to agreed project scope and customer data accuracy.",
      },
      {
        category: "CAD & Simulation Files",
        items: [
          "Preliminary 3D Workcell Layout Model (.STEP / .PDF)",
          "Reach envelope and clearance zone drawing package",
          "EOAT mounting interface and center-of-gravity diagram",
        ],
        scopeQualification:
          "Based on 3D CAD models of parts and machinery provided by the customer.",
      },
    ],
    customerChecklist: [
      {
        category: "Part & Process Data",
        items: [
          "CAD models or 2D dimensional drawings of all parts to be handled",
          "Part weight, center-of-gravity, material, and surface finish tolerances",
          "Target cycle time per part or hourly production quota",
          "Current manual or automated process sequence breakdown",
        ],
      },
      {
        category: "Facility & Environment",
        items: [
          "Floor space layout and ceiling height constraints in the cell area",
          "Incoming part presentation method (conveyor, tray, tote, or gravity chute)",
          "Ambient conditions: temperature range, coolant mist, dust, or cleanroom class",
          "Target integration timeline and capital expenditure parameters",
        ],
      },
    ],
    relatedProducts: [
      {
        name: "Precision Reducers & Gearboxes",
        path: "/products/precision-reducers",
        detail: "Zero-backlash strain-wave and high-rigidity cycloidal reducers",
      },
      {
        name: "Intelligent Actuator Studio",
        path: "/technology/intelligent-actuators",
        detail: "Integrated servo actuators with onboard drive telemetry",
      },
      {
        name: "Servo Drives & Motion Control",
        path: "/products/servo-drives",
        detail: "Real-time fieldbus servo drives with sub-millisecond sync",
      },
    ],
    relatedApplications: [
      {
        name: "Automotive Powertrain & Chassis",
        path: "/applications/automotive",
        sector: "Automotive",
      },
      {
        name: "Electronics & Semiconductor",
        path: "/applications/electronics",
        sector: "Electronics",
      },
      {
        name: "Metal Fabrication & Machining",
        path: "/applications/metal-machining",
        sector: "Machining",
      },
    ],
    faqs: [
      {
        question: "How long does a typical Application Engineering Feasibility study take?",
        answer:
          "For standard single-station robotic cells, a comprehensive feasibility assessment is typically completed within 5 to 10 business days following receipt of part CAD data and cycle-time parameters. Complex multi-robot lines with custom tooling may require 2 to 3 weeks.",
      },
      {
        question: "Do you provide equipment-agnostic recommendations?",
        answer:
          "Yes. Our engineering analysis evaluates kinematic requirements purely against physics, payload curves, and required fieldbus compatibility. When an off-the-shelf standard robot is the best fit, we specify exact model numbers and payload ratings.",
      },
      {
        question: "What accuracy can we expect from preliminary cycle-time simulations?",
        answer:
          "When provided with accurate acceleration profiles and pneumatic actuator switching times, our simulated cycle times typically correlate within ±5% of physical site commissioning results.",
      },
      {
        question: "Does INDUS sign Non-Disclosure Agreements (NDAs) prior to data transfer?",
        answer:
          "Yes, standard bilateral NDAs are executed before receiving any proprietary customer CAD data, tooling schematics, or production volume figures.",
      },
    ],
  },

  // =========================================================================
  // SERVICE 02: Kinematic Subsystems & Joint Actuator Engineering
  // =========================================================================
  {
    id: "kinematic-subsystems",
    number: "02",
    title: "Kinematic Subsystems & Joint Actuator Engineering",
    shortTitle: "Joint Actuators & Sizing",
    badge: "Mechatronic Sizing",
    summary:
      "Develop precision motion subsystems for machine builders and robotics OEMs, from component sizing and bearing analysis to integrated joint modules.",
    heroHeadline: "Integrated Joint Actuators, Precision Sizing & Mechatronic Packaging",
    heroSubtitle:
      "Deterministic sizing of strain-wave and cycloidal gearing, frameless motors, dual encoders, and fail-safe brakes into compact, hollow-shaft joint modules.",
    targetAudience:
      "Robotics OEMs, machine tool builders, medical device developers, and gimbal manufacturers seeking modular rotary motion packages.",
    problemStatement: {
      challenge:
        "Building high-performance robotic joints requires balancing competing physical constraints: maximizing continuous torque density while minimizing axial length, structural mass, and thermal accumulation. Off-the-shelf catalog gearmotors often suffer from excessive backlash, inadequate bearing tilt stiffness, or lack hollow-shaft space for internal wiring harnesses.",
      impact:
        "Improperly sized reducers experience rapid lost-motion degradation, fatigue pitting, and excessive thermal drift that destabilizes position control loops.",
      technicalRisks: [
        "Dynamic shock loads during emergency stops exceeding gear tooth shear limits",
        "Overheating due to inadequate thermal dissipation in sealed joint housings",
        "Angular transmission error causing high-frequency velocity ripple",
        "Cross-roller bearing deflection causing gear tooth misalignment under moment loads",
      ],
    },
    engineeringApproach: {
      methodology:
        "Our mechatronic joint engineering balances ISO 9283 positioning accuracy with DIN 3990 gear rating standards, verifying life expectations under realistic customer duty cycles.",
      stages: [
        {
          step: "01",
          name: "Duty Cycle & Load Spectrum Profiling",
          focus:
            "Extract output torque, speed, and direction cycles to calculate root-mean-square (RMS) continuous torque.",
          output: "Load spectrum histogram & equivalent operational hours",
        },
        {
          step: "02",
          name: "Reducer Technology Selection",
          focus:
            "Select between Strain-Wave (harmonic) gearing for zero backlash (<1 arcmin) or Cycloidal (RV) for extreme shock load resistance.",
          output: "Gear ratio, lost motion limit, and nominal torque selection",
        },
        {
          step: "03",
          name: "Electro-Mechanical Integration",
          focus:
            "Package frameless BLDC motor, optical/magnetic absolute encoder, spring-set brake, and cross-roller bearing.",
          output: "3D CAD joint assembly with hollow-bore routing verification",
        },
        {
          step: "04",
          name: "Bearing Life & Thermal FEA",
          focus:
            "Calculate L10h bearing life under combined radial, axial, and tilting moment loads; simulate thermal dissipation.",
          output: "L10h bearing calculation report & thermal distribution map",
        },
      ],
    },
    capabilities: [
      {
        title: "Precision Reducer Selection & Sizing",
        description:
          "Matching speed reduction technologies to dynamic stiffness and backlash targets.",
        engineeringDetail:
          "Strain-wave harmonic gearheads (ratios 30:1 to 160:1) vs cycloidal pinwheel drives for high shock resistance.",
      },
      {
        title: "Frameless BLDC Motor Matching",
        description:
          "Optimizing motor winding and electromagnetic sizing for continuous and peak torque.",
        engineeringDetail:
          "Thermal time constant analysis, copper loss (I²R) budgeting, and DC bus voltage utilization.",
      },
      {
        title: "Dual Absolute Encoder Integration",
        description: "High-resolution feedback at both motor shaft and joint output.",
        engineeringDetail:
          "Motor-side 19-bit feedback for smooth velocity loop + 21-bit output-side encoder to cancel gear backlash and deflection.",
      },
      {
        title: "Hollow-Shaft Cable Routing",
        description: "Center-bore routing for fieldbus cables, power wires, and pneumatic lines.",
        engineeringDetail:
          "Optimized bore diameters (15–60 mm) preventing harness torsion fatigue over millions of continuous flex cycles.",
      },
      {
        title: "Cross-Roller Bearing Sizing",
        description:
          "High-rigidity integrated output bearings capable of multi-directional forces.",
        engineeringDetail:
          "L10h life calculation under combined dynamic tilting moment (Mr), radial load (Fr), and axial thrust (Fa).",
      },
      {
        title: "CAD Documentation & Prototype Support",
        description: "Complete manufacturing documentation and prototype assembly procedures.",
        engineeringDetail:
          "Geometric Dimensioning and Tolerancing (GD&T) per ASME Y14.5, pilot fit tolerances, and seal design.",
      },
    ],
    systemComponents: [
      {
        name: "Strain-Wave Gearheads",
        category: "Gearing",
        role: "Zero-backlash, high-ratio reduction with compact axial depth",
      },
      {
        name: "Cycloidal (RV) Reducers",
        category: "Gearing",
        role: "Extreme shock overload capacity (up to 500% rating) and torsional stiffness",
      },
      {
        name: "Frameless BLDC Motors",
        category: "Actuation",
        role: "High-torque direct mechanical coupling with minimal rotor inertia",
      },
      {
        name: "Dual Optical/Magnetic Encoders",
        category: "Feedback",
        role: "BiSS-C / SSI absolute position feedback with multi-turn memory",
      },
      {
        name: "Spring-Applied Holding Brakes",
        category: "Safety",
        role: "Power-off fail-safe axis locking per safety standards",
      },
      {
        name: "Cross-Roller Output Bearings",
        category: "Mechanical",
        role: "High-rigidity moment support integrated into joint output flange",
      },
    ],
    useCases: [
      {
        title: "Modular 6-DOF Collaborative Robot Joint Modules",
        industry: "Robotics OEM",
        description:
          "Engineered a scalable 3-size family of joint actuators (J1/J2, J3/J4, J5/J6) with integrated hollow bores.",
        keyMetric:
          "Achieved 140 Nm/kg torque-to-weight density with <0.8 arcmin backlash and internal wiring.",
      },
      {
        title: "High-Precision Rotary Tilt Stage for Metrology",
        industry: "Semiconductor & Inspection",
        description:
          "Designed dual-axis gimbals with zero lost motion for optical surface scanning.",
        keyMetric: "Maintained <5 arcsec angular repeatability under continuous scanning duty.",
      },
      {
        title: "Mobile Robot Traction Wheel Actuator",
        industry: "Logistics & AGVs",
        description:
          "Compact in-wheel cycloidal actuator module with integrated suspension and shock absorption.",
        keyMetric:
          "Withstood 1,500 kg radial axle loads while operating over uneven floor transitions.",
      },
      {
        title: "Surgical Robot Arm Micro-Joint Sizing",
        industry: "Medical Robotics",
        description:
          "Miniaturized 25 mm diameter strain-wave actuator with low thermal rise (<15°C above ambient).",
        keyMetric:
          "Delivered ultra-smooth motion without cogging for delicate microsurgical tool manipulation.",
      },
    ],
    deliverables: [
      {
        category: "Calculation Reports",
        items: [
          "Torque RMS & Dynamic Load Profile Calculation",
          "L10h Bearing Fatigue Life & Moment Capacity Report",
          "Backlash & Lost-Motion Degradation Prediction",
          "Thermal Dissipation & Winding Temperature Simulation",
        ],
        scopeQualification: "Based on customer-defined continuous and intermittent duty cycles.",
      },
      {
        category: "CAD & Manufacturing Files",
        items: [
          "Complete 3D Assembly CAD Models (.STEP / .IGES)",
          "2D Mechanical Drawings with GD&T Tolerancing",
          "Cable Harness Routing & Flex Bend Analysis",
          "Prototype Assembly & Inspection Procedure",
        ],
        scopeQualification:
          "Fully dimensioned for standard CNC machining and precision bearing fits.",
      },
    ],
    customerChecklist: [
      {
        category: "Motion & Load Specifications",
        items: [
          "Nominal operating torque and peak acceleration torque requirements (Nm)",
          "Maximum output rotational speed (RPM or deg/s)",
          "Applied external radial, axial, and tilting moment loads",
          "Duty cycle profile: acceleration time, steady run time, deceleration, and dwell",
        ],
      },
      {
        category: "Mechanical & Electrical Constraints",
        items: [
          "Maximum allowable joint diameter and axial housing length",
          "Center hollow-bore diameter required for internal harness routing",
          "DC bus voltage available (e.g., 24V, 48V, or 380V DC)",
          "Required feedback protocol (BiSS-C, SSI, EnDat 2.2, or EtherCAT drive interface)",
        ],
      },
    ],
    relatedProducts: [
      {
        name: "Precision Reducers & Gearboxes",
        path: "/products/precision-reducers",
        detail: "Component gearsets and enclosed gearhead units",
      },
      {
        name: "Intelligent Actuator Studio",
        path: "/technology/intelligent-actuators",
        detail: "Pre-configured smart rotary joint units",
      },
      {
        name: "Kinematic Sizing Calculators",
        path: "/technology/calculators",
        detail: "Online torque, inertia, and bearing calculators",
      },
    ],
    relatedApplications: [
      {
        name: "Robotics & Collaborative Systems",
        path: "/applications/humanoid",
        sector: "Robotics",
      },
      { name: "Aerospace & Defense Systems", path: "/applications/aerospace", sector: "Aerospace" },
      {
        name: "Medical Devices & Surgical Systems",
        path: "/applications/medical",
        sector: "Healthcare",
      },
    ],
    faqs: [
      {
        question: "When should we specify strain-wave gearing versus cycloidal reducers?",
        answer:
          "Strain-wave (harmonic) gearing is ideal when zero backlash, compact axial length, and high reduction ratios in a single stage are paramount. Cycloidal (RV) reducers are preferred when high shock overload capacity (up to 500%), severe tilting moment rigidity, and long bearing life under continuous heavy loading are required.",
      },
      {
        question: "How do you avoid cable fatigue in hollow-shaft actuators?",
        answer:
          "We engineer internal cable routing using specialized high-flex spiral harnesses with low-friction PTFE sleeves, ensuring the minimum bend radius exceeds manufacturer flex ratings by at least 2.5× over the full ±360° rotational travel.",
      },
      {
        question: "Can INDUS supply prototype units or only engineering designs?",
        answer:
          "We offer end-to-end support: from sizing calculations and complete CAD drawing packages to prototype procurement, assembly, and dyno test verification in our precision motion lab.",
      },
    ],
  },

  // =========================================================================
  // SERVICE 03: Robotic Workcells & Machine Tending
  // =========================================================================
  {
    id: "robotic-workcells",
    number: "03",
    title: "Robotic Workcells & Machine Tending",
    shortTitle: "Workcells & Tending",
    badge: "Workcell Automation",
    summary:
      "Plan robotic cells around production tasks, material flow, tooling, controls, and the safety requirements of the operating environment.",
    heroHeadline: "Turnkey Robotic Workcell Architecture, Machine Tending & Tooling Integration",
    heroSubtitle:
      "Seamless integration of industrial robots, custom end-of-arm tooling, pneumatic clamping fixtures, and CNC machine interfaces for resilient 24/7 manufacturing.",
    targetAudience:
      "Production supervisors, machine shop owners, and operations managers seeking to automate CNC, press, welding, or assembly operations.",
    problemStatement: {
      challenge:
        "Stand-alone machine tools frequently underutilize spindle capacity due to manual part changeover delays, operator fatigue, and inconsistent loading techniques. Integrating a robot into an existing cell requires addressing tight physical access, coolant mist, swarf contamination, and reliable CNC door/chuck interlocking without interrupting production schedules.",
      impact:
        "Poorly engineered tending cells suffer from frequent part seating faults, sensor failures from cutting fluids, and prolonged changeover times when introducing new workpiece batches.",
      technicalRisks: [
        "Inadequate chip evacuation causing improper part seating in chuck jaws",
        "Slow EOAT swap times negating the cycle-time advantage of robotic tending",
        "CNC door interlock handshake timing conflicts causing machine emergency trips",
        "Robot arm joint collision with machine enclosures during rapid tool changes",
      ],
    },
    engineeringApproach: {
      methodology:
        "We engineer robotic workcells as cohesive, balanced production ecosystems, standardizing hardware and communication interfaces to ensure rapid installation and minimal spindle downtime.",
      stages: [
        {
          step: "01",
          name: "Station Logistics & Takt Analysis",
          focus:
            "Audit part geometry, cutting cycle times, infeed/outfeed buffering, and chip disposal requirements.",
          output: "Workcell layout footprint & buffer queue sizing",
        },
        {
          step: "02",
          name: "EOAT & Fixture Engineering",
          focus:
            "Design dual-gripper end-effectors with blow-off nozzles, optical part seating sensors, and quick-change jaws.",
          output: "Complete EOAT CAD package with pneumatic/electrical schematics",
        },
        {
          step: "03",
          name: "CNC & Cell Controller Interfacing",
          focus:
            "Configure hardware and software handshakes (Euromap, Profinet, Ethernet/IP) between robot, CNC, and peripheral PLC.",
          output: "I/O mapping table, safety zone logic, and sequencing state diagram",
        },
        {
          step: "04",
          name: "Virtual Commissioning & FAT",
          focus:
            "Simulate kinematics, verify interlocks in offline virtual environment, and execute Factory Acceptance Testing.",
          output: "FAT protocol, operator manual, and commissioning checklist",
        },
      ],
    },
    capabilities: [
      {
        title: "Workcell Layout & Material-Flow Planning",
        description:
          "Optimized floor plan balancing robot reach, operator maintenance access, and buffer capacities.",
        engineeringDetail:
          "Minimizing robot joint travel distances to reduce unclamp-to-clamp cycle times.",
      },
      {
        title: "Machine Loading & Dual-Gripper Architecture",
        description:
          "Rapid exchange of raw blanks and finished machined parts in a single spindle approach.",
        engineeringDetail:
          "Dual pneumatic/servo grippers cutting door-open dwell times from 45 seconds to under 12 seconds.",
      },
      {
        title: "Fixturing, Clamping & Swarf Management",
        description: "Zero-point clamping systems and automated air/coolant blast stations.",
        engineeringDetail:
          "High-pressure air blast integration to clear chips from reference locators prior to clamping.",
      },
      {
        title: "Robotic Welding, Assembly & Palletizing",
        description:
          "Application-specific tooling for continuous welding seams, press assembly, or pallet stacking.",
        engineeringDetail:
          "Integration of torch cleaners, seam trackers, servo press-fit heads, and vacuum palletizing grippers.",
      },
      {
        title: "Offline Programming & Virtual Commissioning",
        description:
          "Robot program generation and kinematic collision validation prior to physical equipment delivery.",
        engineeringDetail:
          "Offline simulation reduces physical floor commissioning time by up to 60%.",
      },
      {
        title: "Handover, Training & Commissioning Scope",
        description:
          "Structured operator training, preventive maintenance protocols, and production ramp-up support.",
        engineeringDetail:
          "Formal FAT (Factory Acceptance Test) and SAT (Site Acceptance Test) sign-off criteria.",
      },
    ],
    systemComponents: [
      {
        name: "6-Axis Industrial Robots (10–70 kg)",
        category: "Robotics",
        role: "High-rigidity workpiece manipulation and machine entry",
      },
      {
        name: "Dual-Gripper EOAT Assemblies",
        category: "Tooling",
        role: "Simultaneous raw blank load and finished part unload",
      },
      {
        name: "Pneumatic Clamping Vices",
        category: "Fixtures",
        role: "Repeatable zero-point workpiece holding inside machine tool",
      },
      {
        name: "Automated Chip Blow-Off Station",
        category: "Process",
        role: "Air-blast clearing of chips from chuck datums",
      },
      {
        name: "Infeed/Outfeed Part Buffers",
        category: "Logistics",
        role: "Gravity chutes, rotary indexing tables, or motorized conveyors",
      },
      {
        name: "Cell Safety Enclosure & Interlocks",
        category: "Safety",
        role: "Physical fencing, interlocked sliding access doors, and light curtains",
      },
    ],
    useCases: [
      {
        title: "Automated Dual-CNC Lathe Tending Cell",
        industry: "Automotive Precision Machining",
        description:
          "One 35 kg robot servicing two CNC turning centers producing automotive transmission shafts.",
        keyMetric:
          "Increased spindle utilization from 58% to 89% across unattended overnight shifts.",
      },
      {
        title: "Robotic MIG Welding Workcell with 2-Axis Positioner",
        industry: "Heavy Construction Equipment",
        description:
          "Articulated robot synchronized with rotary tilt-turn positioner for continuous structural welds.",
        keyMetric:
          "Eliminated weld spatter rework and achieved 100% penetration consistency per AWS D1.1.",
      },
      {
        title: "High-Mix Low-Volume Press Brake Tending",
        industry: "Sheet Metal Fabrication",
        description:
          "Robot with adaptive vacuum gripper handling sheet metal blanks from 0.5 to 8 kg.",
        keyMetric:
          "Quick-change vacuum cup array reduced batch changeover time from 40 min to under 4 min.",
      },
      {
        title: "End-of-Line Palletizing & Case Packing",
        industry: "Food & Beverage Packaging",
        description:
          "Dual-infeed robotic palletizer handling corrugated cases with layer slip-sheet placement.",
        keyMetric: "Continuous 22 picks/min throughput with automated pallet wrapping integration.",
      },
    ],
    deliverables: [
      {
        category: "Cell Layout & Mechanical Packages",
        items: [
          "Complete 3D Workcell Layout Model (.STEP / .DWG)",
          "Custom EOAT Assembly Drawings & Bill of Materials",
          "Pneumatic & Vacuum Schematic Diagrams",
          "Workpiece Fixture & Locator Tooling Drawings",
        ],
        scopeQualification:
          "Includes full installation footprint and foundation anchor bolt specifications.",
      },
      {
        category: "Control & Commissioning Documentation",
        items: [
          "Robot & CNC Interface Electrical Handshake Schematics",
          "PLC Sequence Logic State Diagrams & HMI Screen Layouts",
          "Factory Acceptance Test (FAT) & Site Acceptance Test (SAT) Protocols",
          "Operator Manual & Routine Preventive Maintenance Schedule",
        ],
        scopeQualification:
          "Aligned with customer plant safety guidelines and local electrical codes.",
      },
    ],
    customerChecklist: [
      {
        category: "Machine & Part Parameters",
        items: [
          "Machine tool make, model, CNC controller type, and automated door configuration",
          "Workpiece dimensional range (min/max length, diameter, weight, and material)",
          "Required cycle time per part or current manual loading cycle time",
          "Part clamping requirements (collet, 3-jaw chuck, magnetic, or custom vice)",
        ],
      },
      {
        category: "Facility & Utility Availability",
        items: [
          "Available floor space dimensions and overhead crane / forklift access paths",
          "Compressed air pressure (bar) and flow capacity (CFM) at the cell location",
          "Electrical supply parameters (voltage, phase, frequency, and available circuit capacity)",
          "Target buffer capacity (e.g., 2 hours, 4 hours, or full 8-hour unmanned operation)",
        ],
      },
    ],
    relatedProducts: [
      {
        name: "Robotic Arm Manipulators",
        path: "/products/precision-reducers",
        detail: "Heavy-duty articulated kinematic arms",
      },
      {
        name: "End Effectors & Tooling",
        path: "/products/end-effectors",
        detail: "Pneumatic, servo, and vacuum gripping heads",
      },
      {
        name: "Robotics Safety Enclosures",
        path: "/products/robotics-safety",
        detail: "Interlocked fencing, optoelectronic curtains, and area scanners",
      },
    ],
    relatedApplications: [
      {
        name: "Metal Fabrication & Machining",
        path: "/applications/metal-machining",
        sector: "Machining",
      },
      { name: "Automotive Manufacturing", path: "/applications/automotive", sector: "Automotive" },
      { name: "Packaging & Consumer Goods", path: "/applications/packaging", sector: "Packaging" },
    ],
    faqs: [
      {
        question: "Can our existing CNC machines be retrofitted for automated door opening?",
        answer:
          "Yes. For machines without factory automatic doors, we engineer and install certified pneumatic or electric servo door actuators integrated with safety interlocks and CNC M-code controls.",
      },
      {
        question: "How does the robot verify that a part is correctly seated in the chuck?",
        answer:
          "We use multi-stage verification: optical or tactile presence sensors mounted directly on the gripper jaws, integrated air-gap backpressure sensors on chuck locators, and CNC spindle load checks before initiation of cutting.",
      },
      {
        question: "What is the typical changeover time for high-mix low-volume parts?",
        answer:
          "With standardized quick-change gripper fingers, barcode recipe recall on the cell HMI, and pre-aligned modular infeed trays, changeovers between verified part families are typically accomplished in under 5 minutes without re-teaching robot waypoints.",
      },
    ],
  },

  // =========================================================================
  // SERVICE 04: Motion Control & Multi-Axis Synchronization
  // =========================================================================
  {
    id: "motion-control",
    number: "04",
    title: "Motion Control & Multi-Axis Synchronization",
    shortTitle: "Motion Control & Sync",
    badge: "Deterministic Control",
    summary:
      "Design coordinated motion architectures for accurate positioning, synchronized movement, and repeatable process performance.",
    heroHeadline: "Sub-Millisecond Multi-Axis Synchronization, Electronic Gearing & e-CAM",
    heroSubtitle:
      "Deterministic motion controller programming, EtherCAT/PROFINET real-time bus architecture, servo loop frequency tuning, and continuous contouring.",
    targetAudience:
      "Automation integrators, machine builders, and controls engineers requiring coordinated multi-axis interpolation and jitter-free motion.",
    problemStatement: {
      challenge:
        "High-speed multi-axis machinery requires sub-millisecond coordination between servo drives. In unoptimized architectures, network latency, jitter in distributed clocks, and improper velocity/acceleration feedforward gains introduce phase lag between axes. This manifests as corner cutting, mechanical vibration, surface finish defects, and premature gear wear.",
      impact:
        "Tracking errors during synchronized interpolation result in out-of-tolerance parts, mechanical resonance trips, and reduced machine operating speeds.",
      technicalRisks: [
        "Distributed clock drift causing phase offset in dual-drive gantry axes",
        "Mechanical resonance excitation during high jerk acceleration phases",
        "Fieldbus cycle-time overruns leading to drive watchdog communication faults",
        "Electronic camming table quantization causing high-frequency torque ripple",
      ],
    },
    engineeringApproach: {
      methodology:
        "We implement deterministic motion control architectures based on IEC 61131-3 PLCopen standards, validating system frequency responses via Bode plot analysis and on-machine telemetry.",
      stages: [
        {
          step: "01",
          name: "Kinematic & Trajectory Profiling",
          focus:
            "Define multi-axis interpolation requirements: linear, circular, spline, and electronic cam (e-CAM) profiles.",
          output: "Kinematic trajectory equations & jerk-limited S-curve profiles",
        },
        {
          step: "02",
          name: "Fieldbus Architecture & Network Topology",
          focus:
            "Select and configure deterministic real-time buses (EtherCAT, PROFINET IRT, POWERLINK) with synchronized clocks.",
          output: "Network topology diagram & bus bandwidth / cycle-time budget (<1 ms)",
        },
        {
          step: "03",
          name: "Servo Loop & Resonance Filter Tuning",
          focus:
            "Perform frequency response analysis (Bode plots), configure bi-quad notch filters, and tune velocity/current loops.",
          output: "Servo parameter set & resonance suppression frequency logs",
        },
        {
          step: "04",
          name: "Dynamic Path Verification",
          focus:
            "Track contouring accuracy, following errors, and overshoot during maximum acceleration transitions on the physical machine.",
          output: "Contouring accuracy certification & oscilloscope trace records",
        },
      ],
    },
    capabilities: [
      {
        title: "Servo Drives & Motion Controller Architecture",
        description:
          "Selection and sizing of motion controllers, digital drives, and distributed I/O blocks.",
        engineeringDetail:
          "Architecture design for IPC-based soft motion or dedicated hardware DSP controllers.",
      },
      {
        title: "Coordinated Multi-Axis Motion & Interpolation",
        description: "Linear, circular, helical, and continuous 3D spline trajectory generation.",
        engineeringDetail:
          "Look-ahead velocity smoothing and jerk limitation (5th-order polynomials) eliminating mechanical shock.",
      },
      {
        title: "Electronic Gearing & Electronic Camming (e-CAM)",
        description:
          "Master-slave electronic synchronization replacing physical mechanical line-shafts and cams.",
        engineeringDetail:
          "High-resolution master position interpolation, flying shear, and rotary knife algorithms.",
      },
      {
        title: "Real-Time Industrial Communications",
        description:
          "Deterministic bus configuration with distributed clock jitter < 1 microsecond.",
        engineeringDetail:
          "EtherCAT (CoE / CiA 402), PROFINET IRT, Ethernet/IP with CIP Motion, and CANopen.",
      },
      {
        title: "Servo Frequency Tuning & Resonance Suppression",
        description:
          "Bode analysis to identify mechanical natural frequencies and suppress resonance.",
        engineeringDetail:
          "Active vibration damping, adaptive notch filtering, and friction feedforward compensation.",
      },
      {
        title: "PLC & Robot Controller Integration",
        description: "Coordinating motion subsystems with supervisory plant PLC architectures.",
        engineeringDetail:
          "Standardized PLCopen Function Blocks (MC_MoveAbsolute, MC_CamIn, MC_GearIn).",
      },
    ],
    systemComponents: [
      {
        name: "Real-Time Industrial PCs (IPC)",
        category: "Hardware",
        role: "Hard real-time Linux/RTOS motion calculation kernel",
      },
      {
        name: "Digital AC Servo Drives",
        category: "Drives",
        role: "High-bandwidth current, velocity, and position loop execution",
      },
      {
        name: "Optical Absolute Linear Scales",
        category: "Feedback",
        role: "Sub-micron direct machine-slide position feedback",
      },
      {
        name: "High-Resolution Rotary Encoders",
        category: "Feedback",
        role: "21-bit to 24-bit motor feedback for ripple-free low-speed control",
      },
      {
        name: "EtherCAT Master Modules",
        category: "Networking",
        role: "Synchronized cyclic-sync position (CSP) bus communication",
      },
      {
        name: "Dynamic Braking Resistors",
        category: "Electrical",
        role: "Dissipation of regenerative deceleration energy",
      },
    ],
    useCases: [
      {
        title: "High-Speed Laser Cutting Dual-Gantry Synchronization",
        industry: "Laser Processing & Machine Tools",
        description:
          "Synchronized master-slave dual linear motor drives on X-axis gantry to prevent mechanical skew.",
        keyMetric:
          "Maintained <3 µm dynamic synchronization error at 3G acceleration and 120 m/min traverse speed.",
      },
      {
        title: "Continuous Web Printing Electronic Line-Shaft",
        industry: "Packaging & Converting",
        description:
          "Replaced mechanical shaft with 8-axis electronic camming and registration mark correction.",
        keyMetric:
          "Achieved ±0.05 mm print registration accuracy across speed ramp-up from 0 to 450 m/min.",
      },
      {
        title: "Flying Shear Pipe Cut-Off Machine",
        industry: "Metal Forming & Tube Mills",
        description:
          "Electronic camming cutting carriage synchronized with continuously moving extruded tube.",
        keyMetric:
          "Delivered cut length tolerance within ±0.2 mm without stopping continuous extrusion.",
      },
      {
        title: "Multi-Axis Semiconductor Wire Bonder",
        industry: "Semiconductor Assembly",
        description: "Ultra-fast XYZ positioning with active vibration suppression algorithms.",
        keyMetric:
          "Reduced settling time by 42%, enabling 24 wire bonds per second with sub-micron repeatability.",
      },
    ],
    deliverables: [
      {
        category: "Control Software & Architecture",
        items: [
          "Complete IEC 61131-3 Motion Application Source Code",
          "PLCopen Function Block Library & Motion State Machine",
          "EtherCAT / Fieldbus Network Configuration (.XML / .ESI)",
          "Electronic Cam Profile Tables & Curve Interpolation Math",
        ],
        scopeQualification: "Delivered fully commented and structured for customer PLC platform.",
      },
      {
        category: "Verification & Calibration Logs",
        items: [
          "Servo Frequency Response Bode Plots & Filter Settings",
          "Multi-Axis Contouring & Following Error Trace Logs",
          "Bus Jitter & Cyclic Transmission Health Report",
          "Axis Calibration & Commissioning Procedures",
        ],
        scopeQualification:
          "Measured on physical machinery using calibrated industrial instrumentation.",
      },
    ],
    customerChecklist: [
      {
        category: "Kinematics & Motion Specs",
        items: [
          "Total number of axes and coordination relationships (independent, interpolated, or cammed)",
          "Maximum velocity, acceleration, and allowable jerk limits per axis",
          "Required following error / contouring error tolerance (e.g., < 0.01 mm)",
          "Preferred controller platform (Beckhoff TwinCAT, Siemens S7-1500T, Omron, B&R, or Rockwell)",
        ],
      },
      {
        category: "Hardware & Electrical",
        items: [
          "Motor and drive ratings (continuous/peak current, motor inertia, winding inductance)",
          "Feedback encoder protocol (BiSS-C, EnDat, SSI, TTL incremental, or resolver)",
          "Master fieldbus standard (EtherCAT, PROFINET IRT, or Ethernet/IP)",
          "Supply voltage and available regenerative braking resistor capacity",
        ],
      },
    ],
    relatedProducts: [
      {
        name: "Servo Drives & Controllers",
        path: "/products/servo-drives",
        detail: "Multi-axis servo drives and digital amplifiers",
      },
      {
        name: "Robot Controllers & Motion IPCs",
        path: "/products/robot-controllers",
        detail: "Real-time industrial controllers with EtherCAT",
      },
      {
        name: "Interactive Sizing Calculators",
        path: "/technology/calculators",
        detail: "Motion profile and continuous torque calculators",
      },
    ],
    relatedApplications: [
      { name: "Packaging & Converting", path: "/applications/packaging", sector: "Packaging" },
      {
        name: "Semiconductor & Microelectronics",
        path: "/applications/electronics",
        sector: "Electronics",
      },
      {
        name: "Automotive Precision Assembly",
        path: "/applications/automotive",
        sector: "Automotive",
      },
    ],
    faqs: [
      {
        question: "What cycle time do you recommend for high-precision multi-axis motion?",
        answer:
          "For standard point-to-point and robotic path tracking, a 1 ms (1000 µs) bus cycle is typical. For high-speed contouring, laser synchronization, or dual-drive gantry yaw control, we configure EtherCAT distributed clock cycles at 250 µs or 500 µs.",
      },
      {
        question: "Can you tune machines with pronounced mechanical resonances?",
        answer:
          "Yes. We conduct frequency response sweeps to generate empirical Bode plots. We then implement cascade notch filters and low-pass filters in the drive velocity loop, suppressing resonance without sacrificing closed-loop bandwidth.",
      },
      {
        question: "Do you support retrofits of legacy motion systems to modern fieldbuses?",
        answer:
          "Yes. We regularly migrate legacy analog ±10V or pulse/direction systems to EtherCAT or PROFINET IRT, retaining motors where feasible while updating drives, controllers, and wiring harnesses.",
      },
    ],
  },

  // =========================================================================
  // SERVICE 05: Safety, Compliance & Risk Engineering
  // =========================================================================
  {
    id: "safety-compliance",
    number: "05",
    title: "Safety, Compliance & Risk Engineering",
    shortTitle: "Safety & Compliance",
    badge: "Functional Safety",
    summary:
      "Identify machine and robot-cell hazards, define suitable safeguards, and support validation against applicable safety requirements.",
    heroHeadline: "Functional Safety Architecture, Hazard Identification & Risk Engineering",
    heroSubtitle:
      "Task-based risk assessments, Performance Level (PLr) determination, safety PLC logic, optical protective zoning, and validation documentation for industrial robot cells.",
    targetAudience:
      "Safety directors, plant engineering managers, machine OEMs, and system integrators responsible for robotic cell safety compliance.",
    problemStatement: {
      challenge:
        "Industrial robotic cells present complex hazard profiles including high-inertia arm collisions, unexpected restart, trapping in workpiece clamps, and hazardous energy release. Designing safety systems that merely trip power often leads operators to bypass interlocks to clear jams, creating acute liability and severe accident risks.",
      impact:
        "Inadequate safety engineering leads to regulatory stop-work orders, costly redesigns during final commissioning, and catastrophic workplace injuries.",
      technicalRisks: [
        "Incorrect Performance Level (PL) calculations underestimating component failure rates",
        "Insufficient safety distance allowing operators to reach hazardous zones before motion stops",
        "Single-fault failure modes that cause interlocks to fail in an undetected dangerous state",
        "Muting configuration flaws on entry conveyors permitting human entry without stopping",
      ],
    },
    engineeringApproach: {
      methodology:
        "We engineer functional safety from initial hazard identification through to physical validation testing, adhering to ISO 12100 principles and ISO 13849-1 / IEC 62061 quantitative methodologies.",
      stages: [
        {
          step: "01",
          name: "Task-Based Hazard Identification",
          focus:
            "Examine every operating mode: automated production, teach mode, clearing jams, tool change, and preventive maintenance.",
          output: "Hazard log & initial risk score matrix (Severity, Frequency, Avoidance)",
        },
        {
          step: "02",
          name: "Performance Level (PLr) Assignment",
          focus:
            "Establish required Performance Level (PLr = c, d, or e) and Safety Integrity Level (SIL 1, 2, or 3) for each safety sub-function.",
          output: "Safety Requirements Specification (SRS)",
        },
        {
          step: "03",
          name: "Safety Architecture & Circuit Design",
          focus:
            "Design dual-channel cross-monitored circuits (Category 3 / 4) with fail-safe safety PLC and safe motion drive functions.",
          output: "Electrical safety schematics & SISTEMA calculation model",
        },
        {
          step: "04",
          name: "Validation & Fault Injection Testing",
          focus:
            "Execute physical validation protocols: stop-time measurement, optical beam testing, and intentional single-fault insertion.",
          output: "Formal Safety Validation Report & Declaration Support Package",
        },
      ],
    },
    capabilities: [
      {
        title: "Machine & Robot-Cell Hazard Identification",
        description:
          "Comprehensive review of all mechanical, electrical, and thermal hazards per ISO 12100.",
        engineeringDetail:
          "Analysis covers all operating stages: commissioning, teaching, production, cleaning, and maintenance.",
      },
      {
        title: "Risk Assessment & PLr / SIL Estimation",
        description: "Quantitative risk estimation determining necessary safety integrity levels.",
        engineeringDetail:
          "Application of ISO 13849-1 risk graphs and IEC 62061 SIL assignment methodologies.",
      },
      {
        title: "Safety Architecture & Protective Device Integration",
        description:
          "Engineering protective physical barriers, optoelectronic curtains, and area scanners.",
        engineeringDetail:
          "Calculating minimum safety distances per ISO 13855 based on measured total system stopping times.",
      },
      {
        title: "Safety PLC & Interlock Integration",
        description: "Fail-safe logic programming and interlocking guard switch implementation.",
        engineeringDetail:
          "Dual-channel pulsed test outputs, cross-fault detection, and safety network protocols (FSoE, PROFIsafe).",
      },
      {
        title: "Safe Motion Monitoring (STO, SLS, SBC)",
        description: "Configuring drive-based functional safety for safe operator intervention.",
        engineeringDetail:
          "Safe Torque Off (STO), Safely-Limited Speed (SLS), Safe Stop 1 (SS1), and Safe Brake Control (SBC).",
      },
      {
        title: "Validation Documentation & Evidence",
        description: "Compiling verifiable safety calculations and physical validation test logs.",
        engineeringDetail:
          "SISTEMA software project files documenting MTTFd, DCavg (diagnostic coverage), and CCF (common cause failure).",
      },
    ],
    systemComponents: [
      {
        name: "Fail-Safe Safety PLCs",
        category: "Controls",
        role: "Redundant dual-processor safety logic and network monitoring",
      },
      {
        name: "Safety Light Curtains",
        category: "Optoelectronics",
        role: "Point-of-operation safeguarding with automatic blanking and muting",
      },
      {
        name: "2D Safety Laser Scanners",
        category: "Optoelectronics",
        role: "Configurable warning and protective zone monitoring for mobile and static cells",
      },
      {
        name: "Interlocked RFID Guard Switches",
        category: "Mechanical",
        role: "Tamper-resistant physical guard door status monitoring with guard locking",
      },
      {
        name: "Safe Motion Servo Inverters",
        category: "Drives",
        role: "Hardware-integrated STO / SLS eliminating external contactors",
      },
      {
        name: "Illuminated E-Stop Pushbuttons",
        category: "Operator Interface",
        role: "Emergency power isolation with direct contact block monitoring",
      },
    ],
    useCases: [
      {
        title: "Collaborative Robot Assembly Workstation Safety Validation",
        industry: "Automotive Electronics",
        description:
          "Conducted biomechanical transient and quasi-static contact force testing per ISO/TS 15066.",
        keyMetric:
          "Validated robot speed and separation monitoring, keeping contact pressures well below pain thresholds.",
      },
      {
        title: "High-Speed Palletizer Perimeter Guarding & Muting",
        industry: "Consumer Goods & Warehousing",
        description:
          "Configured 4-beam optical muting array allowing pallet exit while stopping for human entry.",
        keyMetric:
          "Eliminated nuisance shutdowns while achieving certified Category 4 / PL e protection.",
      },
      {
        title: "Hydraulic Press & Robot Tending Safety Retrofit",
        industry: "Metal Stamping",
        description:
          "Replaced obsolete safety relay circuits with modern fail-safe PLC and dual monitored press safety valves.",
        keyMetric:
          "Reduced safety stopping time from 420 ms to 190 ms, allowing closer guard positioning.",
      },
      {
        title: "Autonomous Mobile Robot (AMR) Fleet Safety Zoning",
        industry: "Intralogistics",
        description:
          "Dynamic safety field switching based on vehicle speed, steering angle, and payload mass.",
        keyMetric:
          "Guaranteed complete vehicle stopping prior to obstacle contact across wet epoxy warehouse floors.",
      },
    ],
    deliverables: [
      {
        category: "Risk Assessment & Calculation Packages",
        items: [
          "Comprehensive Machine Risk Assessment Document (ISO 12100 format)",
          "Performance Level Verification Report (SISTEMA .SSM file & summary)",
          "Safety Distance Calculation Sheets per ISO 13855",
          "Safety Requirements Specification (SRS) for control system",
        ],
        scopeQualification:
          "Evidence-backed calculations referencing actual component B10d / MTTFd data.",
      },
      {
        category: "Validation & Testing Documentation",
        items: [
          "Safety System Validation Plan & Test Record Protocols",
          "Single-Fault Injection Verification & Response Log",
          "Stopping Time & Stopping Distance Measurement Certificate",
          "Operator Safety Operating Procedures & Daily Inspection Checklist",
        ],
        scopeQualification: "Never claims certification without supporting empirical test records.",
      },
    ],
    customerChecklist: [
      {
        category: "Machine Operation & Hazard History",
        items: [
          "Detailed description of machine operational modes (automatic, setup, manual jogging, cleanout)",
          "History of near-misses, operator interventions, or safety nuisance trips",
          "Target operating speeds, maximum tool masses, and material hazards",
          "Existing electrical schematics and safety circuit wiring drawings",
        ],
      },
      {
        category: "Plant Safety Standards & Personnel",
        items: [
          "Internal corporate safety standards or customer EHS guidelines",
          "Applicable local regulatory jurisdiction (OSHA, CE Machinery Directive, ANSI/RIA R15.06)",
          "Access frequency: how often operators or maintenance staff enter the cell area",
          "Availability of machine equipment for physical stopping-time validation testing",
        ],
      },
    ],
    relatedProducts: [
      {
        name: "Robotics Safety Components",
        path: "/products/robotics-safety",
        detail: "Safety PLCs, light curtains, and RFID interlocks",
      },
      {
        name: "Robot Controllers & Motion IPCs",
        path: "/products/robot-controllers",
        detail: "Controllers with integrated Safe Torque Off (STO)",
      },
      {
        name: "Robotics Standards & Compliance",
        path: "/technology/architecture-explorer",
        detail: "Reference architectures for ISO 13849 compliance",
      },
    ],
    relatedApplications: [
      {
        name: "Automotive Stamping & Assembly",
        path: "/applications/automotive",
        sector: "Automotive",
      },
      {
        name: "Heavy Machinery & Fabrication",
        path: "/applications/metal-machining",
        sector: "Manufacturing",
      },
      {
        name: "Warehousing & Mobile Robotics",
        path: "/applications/warehousing",
        sector: "Logistics",
      },
    ],
    faqs: [
      {
        question: "Does INDUS certify machines or issue CE marks directly?",
        answer:
          "We provide comprehensive functional safety engineering, risk assessments, SISTEMA calculations, and physical validation test evidence. The machine builder or end-user typically applies the final CE mark or self-declaration based on our verified technical construction file.",
      },
      {
        question: "How is the minimum safety distance calculated for light curtains?",
        answer:
          "We apply the standard formula S = (K × T) + C from ISO 13855, where K is human approach speed (typically 1600–2000 mm/s), T is total system stopping time (sensor response + safety PLC response + drive/brake stopping time), and C is optical intrusion depth.",
      },
      {
        question: "What is SISTEMA and why is it required?",
        answer:
          "SISTEMA is the international software utility published by the German IFA for modeling safety-related parts of control systems (SRP/CS) per ISO 13849-1. It calculates the achieved Performance Level (PL) mathematically using component reliability data.",
      },
    ],
  },

  // =========================================================================
  // SERVICE 06: Custom Robotics & Special-Purpose Machines
  // =========================================================================
  {
    id: "custom-robotics",
    number: "06",
    title: "Custom Robotics & Special-Purpose Machines",
    shortTitle: "Custom Robotics & SPM",
    badge: "Specialized Machinery",
    summary:
      "Explore application-specific mechanisms, tooling, and controls when standard equipment does not meet operating requirements.",
    heroHeadline: "Application-Specific Kinematics, Bespoke Mechanisms & Custom Machines",
    heroSubtitle:
      "First-principles mechanical design, specialized linkages, harsh environment hardening (cleanroom, vacuum, IP69K), and purpose-built automation rigs.",
    targetAudience:
      "R&D teams, aerospace developers, and advanced manufacturers whose specifications exceed the envelope or environmental limits of catalog robots.",
    problemStatement: {
      challenge:
        "Commercial off-the-shelf industrial robots are designed for general-purpose factory environments. When production requires operating inside high-vacuum chambers, sub-zero cryogenic freezers, washdown sanitary zones, or within extremely constrained mechanical envelopes, standard arms fail due to seal degradation, outgassing, or spatial interference.",
      impact:
        "Attempting to force standard robots into non-standard environments causes frequent joint seizure, particle contamination of clean products, and inability to meet spatial process requirements.",
      technicalRisks: [
        "Lubricant outgassing destroying high-vacuum environments (<10⁻⁶ mbar)",
        "Structural frame resonance in long-reach custom cantilever mechanisms",
        "Ingress of aggressive cleaning chemicals in IP69K food or pharmaceutical washdown",
        "Thermal expansion mismatches in bi-metallic assemblies under wide temperature swings",
      ],
    },
    engineeringApproach: {
      methodology:
        "We approach custom robotics from first principles: kinematics synthesis, finite element structural optimization, material compatibility testing, and modular electrical architecture.",
      stages: [
        {
          step: "01",
          name: "Requirements & Constraint Synthesis",
          focus:
            "Isolate non-negotiable physical constraints: envelope dimensions, environment chemistry, vacuum levels, and payload trajectories.",
          output: "Functional Specification Document & Kinematic Degree-of-Freedom (DOF) Map",
        },
        {
          step: "02",
          name: "Mechanism Synthesis & FEA Modeling",
          focus:
            "Design specialized linkages (Cartesian, parallel, SCARA, or pantograph) with FEA deflection and modal vibration analysis.",
          output: "3D CAD mechanism assembly & FEA stress/deflection report",
        },
        {
          step: "03",
          name: "Materials & Sealed Joint Engineering",
          focus:
            "Select suitable materials (316L stainless, hard anodized aluminum, titanium) and specialized sealing (rotary ferrofluidic, viton, labyrinth).",
          output: "Material specification sheet & sealing validation design",
        },
        {
          step: "04",
          name: "Prototype Assembly & Bench Qualification",
          focus:
            "Build physical prototype sub-assemblies and verify positioning accuracy, thermal rise, and sealing integrity in environmental test rig.",
          output: "Prototype functional test report & manufacturing drawing package",
        },
      ],
    },
    capabilities: [
      {
        title: "Application-Specific Mechanism Synthesis",
        description: "Kinematic synthesis of novel planar, spatial, and parallel mechanisms.",
        engineeringDetail:
          "Custom multi-bar linkages, delta configurations, and precision lead-screw/direct-drive stages.",
      },
      {
        title: "Custom Robot Joints & Compact Linkages",
        description:
          "Ultra-compact rotary and linear joints engineered for tight geometric spaces.",
        engineeringDetail:
          "Integrated frameless torque motors with custom harmonic gear mountings and hollow through-bores.",
      },
      {
        title: "Special-Purpose Tooling & Multi-Stage Grippers",
        description:
          "Complex end-effectors integrating multi-axis motions, sensors, and quick-tool changing.",
        engineeringDetail:
          "Pneumatic, servo, compliant flexure, and magnetic gripper mechanisms tailored to delicate parts.",
      },
      {
        title: "Environmental Hardening & Cleanroom Sealing",
        description:
          "Engineering systems for extreme chemical, thermal, vacuum, or radiation environments.",
        engineeringDetail:
          "ISO Class 3 cleanroom sealing, ultra-high-vacuum (UHV) grease, and IP69K sanitary enclosures.",
      },
      {
        title: "Mechanical, Electrical & Control System Integration",
        description:
          "Unified mechatronic design ensuring structural, power, and software coherence.",
        engineeringDetail:
          "Embedded real-time controller integration with distributed motor drives and sensor harnesses.",
      },
      {
        title: "Engineering Documentation & Prototype Fabrication",
        description:
          "Full production packages enabling contract manufacturing or in-house machining.",
        engineeringDetail:
          "Complete 3D CAD (.STEP), fully toleranced 2D drawings (GD&T), and detailed assembly work instructions.",
      },
    ],
    systemComponents: [
      {
        name: "Custom Welded Machine Bases",
        category: "Structural",
        role: "Stress-relieved steel and mineral-cast structural foundations",
      },
      {
        name: "Precision Linear Motor Stages",
        category: "Actuation",
        role: "Direct-drive ironless linear motors for high acceleration with zero backlash",
      },
      {
        name: "Custom Planetary & Cam Indexers",
        category: "Mechanics",
        role: "Special gear ratios and multi-station rotary indexing tables",
      },
      {
        name: "Ferrofluidic & Labyrinth Rotary Seals",
        category: "Sealing",
        role: "Hermetic sealing for vacuum chambers and aggressive washdown",
      },
      {
        name: "Specialized Compliant Flexures",
        category: "Mechanics",
        role: "Frictionless micro-positioning sub-assemblies with infinite fatigue life",
      },
      {
        name: "Modular Distributed Controllers",
        category: "Controls",
        role: "Embedded controllers mounted directly on moving machine elements",
      },
    ],
    useCases: [
      {
        title: "Ultra-High-Vacuum Semiconductor Wafer Transfer Rig",
        industry: "Semiconductor Manufacturing",
        description:
          "Engineered a 4-DOF custom transfer arm operating inside a 10⁻⁷ mbar vacuum chamber at 180°C.",
        keyMetric:
          "Zero hydrocarbon outgassing using specialized perfluoropolyether (PFPE) lubrication and magnetic couplings.",
      },
      {
        title: "IP69K High-Pressure Washdown Poultry Deboning Robot",
        industry: "Food Processing & Sanitation",
        description:
          "Custom sealed 6-axis manipulator capable of withstanding daily 100 bar, 80°C caustic chemical washdowns.",
        keyMetric: "Maintained 100% seal integrity over 24 months of continuous wet operation.",
      },
      {
        title: "Automated Micro-Optical Lens Bonding Rig",
        industry: "Aerospace & Photonics",
        description:
          "6-DOF parallel kinematic hexapod manipulator for sub-micron optical alignment with UV curing heads.",
        keyMetric:
          "Achieved ±0.2 µm spatial positioning resolution with active thermal drift compensation.",
      },
      {
        title: "Battery Cell Pouch Stacking & Tab Welding Rig",
        industry: "Clean Energy & EV Batteries",
        description:
          "Custom continuous high-speed mechanical cam-driven mechanism for stacking lithium pouch cells.",
        keyMetric:
          "Delivered 120 parts/minute throughput with precise edge alignment within ±0.1 mm.",
      },
    ],
    deliverables: [
      {
        category: "Design & Engineering Documentation",
        items: [
          "Complete 3D Assembly CAD Model Package (.STEP / Native)",
          "Fully Dimensioned 2D Manufacturing Drawings with GD&T",
          "Finite Element Analysis (FEA) Stress & Vibration Mode Report",
          "Comprehensive Bill of Materials (BOM) with COTS Supplier Part Numbers",
        ],
        scopeQualification: "All mechanical drawings ready for immediate CNC machine shop quoting.",
      },
      {
        category: "Prototype & Electrical Packages",
        items: [
          "Electrical Wiring Schematics & Pneumatic / Hydraulic Diagrams",
          "Embedded Controller Firmware / Motion Source Code",
          "Prototype Bench Testing & Environmental Qualification Report",
          "Assembly, Calibration & Preventative Maintenance Manual",
        ],
        scopeQualification: "Includes full prototype build support where commissioned by customer.",
      },
    ],
    customerChecklist: [
      {
        category: "Application & Physical Environment",
        items: [
          "Detailed explanation of why off-the-shelf catalog robots are unsuitable",
          "Operating environment: temperature range, chemical exposure, washdown pressure, vacuum levels",
          "Envelope boundaries: maximum allowable outer dimensions and weight limitations",
          "Target degrees of freedom (DOF) and trajectory motion requirements",
        ],
      },
      {
        category: "Performance & Commercial Scope",
        items: [
          "Required payload mass, center of gravity, and dynamic acceleration targets",
          "Positioning repeatability and absolute accuracy expectations",
          "Anticipated production volume (single prototype, small batch of 5–10, or series OEM build)",
          "Target development milestones and capital development budget allocation",
        ],
      },
    ],
    relatedProducts: [
      {
        name: "Intelligent Actuator Studio",
        path: "/technology/intelligent-actuators",
        detail: "Compact smart actuators for custom machine joints",
      },
      {
        name: "Precision Reducers & Gearboxes",
        path: "/products/precision-reducers",
        detail: "Strain-wave and cycloidal component sets",
      },
      {
        name: "End Effectors & Tooling",
        path: "/products/end-effectors",
        detail: "Custom mechanical and pneumatic end-of-arm tooling",
      },
    ],
    relatedApplications: [
      {
        name: "Semiconductor & Cleanroom",
        path: "/applications/electronics",
        sector: "Electronics",
      },
      { name: "Medical Devices & Life Sciences", path: "/applications/medical", sector: "Medical" },
      { name: "Aerospace & Defense Systems", path: "/applications/aerospace", sector: "Aerospace" },
    ],
    faqs: [
      {
        question: "How do you determine if a custom robot is justified over a standard arm?",
        answer:
          "We conduct a rigorous initial feasibility review. If an off-the-shelf standard robot can fulfill the requirements with minor tooling adaptations, we advise that path. We recommend custom robotics only when non-negotiable physical constraints (space, environment, degrees of freedom, or unit production cost at scale) make catalog arms impossible or uneconomical.",
      },
      {
        question: "Who retains Intellectual Property (IP) for custom machine designs?",
        answer:
          "Under our standard custom engineering contract terms, the customer owns the full application-specific CAD packages, manufacturing drawings, and bespoke firmware upon completion and final project settlement.",
      },
      {
        question:
          "Can INDUS manufacture the custom machine or do you only deliver engineering files?",
        answer:
          "We offer flexible engagement scopes: from delivering a complete manufacturing drawing package for your preferred machine shop, to turnkey prototype fabrication, assembly, wiring, and bench qualification in our facility.",
      },
    ],
  },

  // =========================================================================
  // SERVICE 07: Lifecycle & Performance Optimization
  // =========================================================================
  {
    id: "lifecycle-optimization",
    number: "07",
    title: "Lifecycle & Performance Optimization",
    shortTitle: "Lifecycle Optimization",
    badge: "Asset Reliability",
    summary:
      "Support ongoing system performance through cycle-time reduction, vibration analysis, preventive maintenance planning, and upgrade roadmaps.",
    heroHeadline: "Cycle-Time Compression, Vibration Diagnostics & Reliability Optimization",
    heroSubtitle:
      "Maximize productivity and operating life of installed automation through trajectory optimization, gearhead backlash monitoring, predictive maintenance, and controller modernization.",
    targetAudience:
      "Plant managers, maintenance directors, and continuous improvement leaders operating established robotic cells and production lines.",
    problemStatement: {
      challenge:
        "Over years of continuous industrial operation, robotic workcells experience subtle performance degradation: mechanical joint wear increases backlash, trajectory waypoints programmed during initial commissioning waste precious seconds, and unmonitored bearings suddenly fail, causing unplanned line-down emergencies. Furthermore, legacy controllers face component obsolescence with replacement parts becoming unavailable.",
      impact:
        "Unplanned robot stoppages in high-volume production can cost thousands of dollars per minute, while inefficient motion paths permanently reduce plant throughput capacity.",
      technicalRisks: [
        "Undetected gear tooth wear causing sudden catastrophic mechanical seizure",
        "Jerky point-to-point motion paths causing premature fatigue in structural castings",
        "Obsolete controller hardware failing with zero factory spare parts availability",
        "Grease degradation causing thermal runaway and servo drive overcurrent trips",
      ],
    },
    engineeringApproach: {
      methodology:
        "Our reliability engineering combines empirical vibration spectral analysis, telemetry trace logging, kinematic path smoothing, and structured preventive maintenance scheduling to extend asset life.",
      stages: [
        {
          step: "01",
          name: "On-Machine Diagnostic Health Audit",
          focus:
            "Measure mechanical backlash across all axes, record vibration spectra on reducers, and audit thermal profiles under full load.",
          output: "Baseline Joint Health & Backlash Assessment Report",
        },
        {
          step: "02",
          name: "Motion Path & Cycle-Time Profiling",
          focus:
            "Analyze robot motion programs using high-speed controller logging to identify unnecessary dwells, harsh stops, and unblended transitions.",
          output: "Cycle-Time Bottleneck Breakdown & Trajectory Optimization Map",
        },
        {
          step: "03",
          name: "Condition Monitoring Strategy Formulation",
          focus:
            "Establish vibration threshold limits (ISO 10816), grease sampling intervals, and predictive maintenance trigger points.",
          output: "Preventive Maintenance Schedule & Predictive Telemetry Strategy",
        },
        {
          step: "04",
          name: "Modernization & Upgrade Roadmap",
          focus:
            "Audit hardware obsolescence risks and outline structured retrofit plans for legacy drives, motors, and controllers.",
          output: "Obsolescence Risk Matrix & Phased Modernization Plan",
        },
      ],
    },
    capabilities: [
      {
        title: "Cycle-Time Analysis & Path Optimization",
        description:
          "Re-engineering trajectory waypoints and corner rounding to compress cycle times.",
        engineeringDetail:
          "Eliminating redundant stops, smoothing acceleration transitions, and shaving 10–25% off cycle durations.",
      },
      {
        title: "Vibration Spectral Analysis & Diagnostics",
        description:
          "FFT frequency analysis to detect early gear mesh defects, bearing fluting, and misalignment.",
        engineeringDetail:
          "Tri-axial accelerometer measurements benchmarked against ISO 10816 vibration severity standards.",
      },
      {
        title: "Reducer Backlash & Lost-Motion Audits",
        description:
          "Direct dial-indicator measurement of mechanical play in robot joints and rotary tables.",
        engineeringDetail:
          "Quantifying angular lost motion (arcmin) to predict remaining useful life (RUL) before failure.",
      },
      {
        title: "Condition-Monitoring & Lubrication Planning",
        description:
          "Designing structured lubrication protocols and grease iron-particle sampling routines.",
        engineeringDetail:
          "Defining lubricant change intervals based on operating thermal history rather than generic calendar schedules.",
      },
      {
        title: "Critical Spare-Parts Risk Planning",
        description:
          "Formulating a prioritized spare-parts inventory based on lead times and line criticality.",
        engineeringDetail:
          "Risk matrix categorizing components into Tier 1 (immediate on-site spare) to Tier 3 (standard procurement).",
      },
      {
        title: "Controller Retrofit & Upgrade Assessments",
        description:
          "Engineering transition paths from obsolete robot controllers to modern fieldbus platforms.",
        engineeringDetail:
          "Drop-in mechanical adapter plates, fieldbus gateways, and backward-compatible I/O mapping.",
      },
    ],
    systemComponents: [
      {
        name: "Tri-Axial Industrial Accelerometers",
        category: "Diagnostics",
        role: "High-frequency vibration monitoring on gearheads and bearings",
      },
      {
        name: "Optical Alignment Lasers & Dial Indicators",
        category: "Metrology",
        role: "Precision measurement of backlash, axis perpendicularity, and tram",
      },
      {
        name: "Thermal Imaging Cameras",
        category: "Diagnostics",
        role: "Detecting localized overheating in motor windings, bearings, and cables",
      },
      {
        name: "Fieldbus Protocol Gateways",
        category: "Networking",
        role: "Interfacing legacy serial/analog signals to modern EtherCAT / PROFINET networks",
      },
      {
        name: "Replacement Servo Drive Kits",
        category: "Modernization",
        role: "Modern digital drives configured for drop-in retrofit of legacy motors",
      },
      {
        name: "Industrial Edge IoT Data Loggers",
        category: "Telemetry",
        role: "Continuous telemetry capture of drive current, temperature, and cycle counts",
      },
    ],
    useCases: [
      {
        title: "Automotive Stamping Press Line Cycle Compression",
        industry: "Automotive Body Manufacturing",
        description: "Optimized trajectory paths and interlock timing for 8 heavy transfer robots.",
        keyMetric:
          "Compressed station transfer time by 2.2 seconds per press stroke, boosting plant output by 115 parts/hour.",
      },
      {
        title: "Continuous Glass Handling Reducer Predictive Health",
        industry: "Flat Glass & Solar Manufacturing",
        description:
          "Installed vibration telemetry on J1 and J2 cycloidal reducers operating in 24/7 furnace loading.",
        keyMetric:
          "Detected early gear mesh bearing spalling 6 weeks before seizure, preventing a catastrophic emergency line shutdown.",
      },
      {
        title: "Legacy 6-Axis Welding Robot Controller Modernization",
        industry: "Heavy Fabrication",
        description:
          "Replaced failing 18-year-old controller with modern IPC-based motion controller while retaining mechanical arm.",
        keyMetric:
          "Restored full spare-parts availability and eliminated intermittent communication lockups at 40% the cost of a new arm.",
      },
      {
        title: "Pharmaceutical Packaging Line Reliability Audit",
        industry: "Pharmaceutical Packaging",
        description:
          "Executed complete reliability review across 12 pick-and-place delta robot stations.",
        keyMetric:
          "Identified loose ball joints and depleted lubricant, increasing overall line OEE from 81% to 94%.",
      },
    ],
    deliverables: [
      {
        category: "Diagnostic & Optimization Reports",
        items: [
          "Cycle-Time Bottleneck Analysis & Re-Taught Path Comparison",
          "Vibration Spectral Analysis & Bearing Defect Report",
          "Mechanical Backlash & Joint Wear Measurement Audit",
          "Thermal Imaging Inspection & Motor Loading Map",
        ],
        scopeQualification: "Includes specific, quantifiable before-and-after performance metrics.",
      },
      {
        category: "Maintenance & Modernization Plans",
        items: [
          "Preventive Maintenance Schedule & Lubrication Protocol",
          "Critical Spare Parts Prioritization Risk Matrix",
          "Controller Retrofit Technical Feasibility Assessment",
          "Operator & Maintenance Technician Training Syllabus",
        ],
        scopeQualification:
          "Customized to your exact plant maintenance staff skill levels and tooling.",
      },
    ],
    customerChecklist: [
      {
        category: "Installed Base Information",
        items: [
          "Robot and machine tool makes, models, controller generations, and serial numbers",
          "Approximate accumulated operating hours and current shift schedule (e.g., 2 shifts, 24/7)",
          "Observed symptoms: unusual noise, intermittent vibration, positioning errors, or drive fault codes",
          "Current cycle time and target throughput improvement goals",
        ],
      },
      {
        category: "Maintenance History & Site Access",
        items: [
          "Historical maintenance records, recent lubricant change dates, and known repair history",
          "Availability of current robot controller backup archives and program routines",
          "Scheduled plant shutdown windows for physical on-site vibration measurement and testing",
          "List of existing on-hand spare parts and legacy component inventory",
        ],
      },
    ],
    relatedProducts: [
      {
        name: "Precision Reducers & Gearboxes",
        path: "/products/precision-reducers",
        detail: "Direct replacement gearheads and bearings",
      },
      {
        name: "Servo Drives & Controllers",
        path: "/products/servo-drives",
        detail: "Modern replacement drives for obsolete equipment",
      },
      {
        name: "Intelligent Actuator Studio",
        path: "/technology/intelligent-actuators",
        detail: "Smart actuators with onboard predictive telemetry",
      },
    ],
    relatedApplications: [
      {
        name: "Automotive Stamping & Body Assembly",
        path: "/applications/automotive",
        sector: "Automotive",
      },
      {
        name: "Metal Fabrication & Machining",
        path: "/applications/metal-machining",
        sector: "Machining",
      },
      {
        name: "Packaging & High-Speed Bottling",
        path: "/applications/packaging",
        sector: "Packaging",
      },
    ],
    faqs: [
      {
        question: "How much cycle time can realistically be saved through path optimization?",
        answer:
          "In cells that were taught quickly during initial commissioning or have evolved over time, we commonly achieve 10% to 25% cycle-time reductions. We achieve this by converting abrupt stop-and-go points into smooth blended radii, eliminating redundant sensor handshake delays, and maximizing acceleration during non-contact transfer segments.",
      },
      {
        question: "How does vibration analysis detect reducer wear before failure?",
        answer:
          "Every precision gearset has characteristic vibration frequencies determined by gear tooth count and shaft speeds (gear mesh frequency - GMF). When micro-pitting, fluting, or bearing spalling begins, distinctive sideband frequencies emerge in the FFT spectrum weeks or months before mechanical backlash increases or thermal runaway occurs.",
      },
      {
        question: "Can older robot arms be retrofitted with modern controllers?",
        answer:
          "Yes. If the mechanical castings, precision reducers, and servo motors are in sound mechanical condition, replacing an obsolete proprietary controller with a modern IPC-based controller can extend the productive life of the cell by 10+ years at a fraction of the cost of new equipment.",
      },
    ],
  },
];

/**
 * Helper to fetch a service by its slug ID.
 */
export function getEngineeringService(id: string): EngineeringServiceItem | undefined {
  return ENGINEERING_SERVICES.find((service) => service.id === id);
}

/**
 * Returns all service IDs for static path verification.
 */
export function getAllEngineeringServiceIds(): string[] {
  return ENGINEERING_SERVICES.map((service) => service.id);
}
