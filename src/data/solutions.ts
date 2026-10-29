/**
 * Solutions Data Layer for INDUS Industrial Robotics
 * 
 * 6 Canonical Industrial Solutions:
 * 1. Motion Control (/solutions/motion-control)
 * 2. Robotic Automation (/solutions/robotic-automation)
 * 3. Machine Integration (/solutions/machine-integration)
 * 4. Material Handling (/solutions/material-handling)
 * 5. Precision Positioning (/solutions/precision-positioning)
 * 6. Custom Engineering (/solutions/custom-engineering)
 * 
 * Includes backwards-compatible aliases for legacy routes (factory-automation, custom-robotics, etc.)
 */

export interface SolutionArchitectureStep {
  step: string;
  title: string;
  description: string;
  signalFlow?: string;
}

export interface SolutionSpecification {
  label: string;
  value: string;
  standard: string;
  notes: string;
}

export interface SolutionCustomerInput {
  parameter: string;
  description: string;
  impactOnDesign: string;
}

export interface SolutionTestingPhase {
  phase: string;
  name: string;
  description: string;
  acceptanceCriteria: string;
}

export interface SolutionFaq {
  question: string;
  answer: string;
}

export interface SolutionItem {
  id: string;
  title: string;
  shortDescription: string;
  heroSubtitle: string;
  badge: string;
  systemScope: {
    included: string[];
    plantInterfaceRequired: string[];
  };
  challenge: {
    title: string;
    description: string;
    bulletPoints: string[];
  };
  approach: {
    title: string;
    description: string;
    bulletPoints: string[];
  };
  technologiesUsed: string[];
  systemArchitecture: SolutionArchitectureStep[];
  technicalSpecs: SolutionSpecification[];
  engineeringInputs: SolutionCustomerInput[];
  testingAndValidation: SolutionTestingPhase[];
  typicalApplications: string[];
  benefits: {
    title: string;
    description: string;
  }[];
  relatedProducts: {
    name: string;
    category: string;
    href: string;
    specs: string;
  }[];
  relatedIndustries: {
    name: string;
    slug: string;
    href: string;
    applicationExample: string;
  }[];
  resources: {
    title: string;
    type: string;
    href: string;
    description?: string;
  }[];
  faqs: SolutionFaq[];
}

export const canonicalSolutionsData: SolutionItem[] = [
  // 1. MOTION CONTROL
  {
    id: "motion-control",
    title: "Motion Control",
    badge: "Multi-Axis Kinematics & Deterministic Synchronization",
    heroSubtitle: "Sub-microsecond bus synchronization, dynamic trajectory generation, and closed-loop position control for high-speed automated machinery.",
    shortDescription: "Coordinate multi-axis servo drives, frameless torque motors, and high-resolution absolute encoders into a unified deterministic motion subsystem.",
    systemScope: {
      included: [
        "Multi-axis master motion controllers (IPC / embedded DIN-rail)",
        "Digital servo amplifiers with dual-loop load feedback support",
        "Absolute optical and magnetic rotary/linear encoders (up to 24-bit)",
        "Zero-backlash strain-wave harmonic and planetary gearheads",
        "Deterministic fieldbus network master stacks (EtherCAT CoE / PROFINET IRT)",
        "Dynamic trajectory filters (S-curve jerk limiting, notch filtering, feedforward)",
      ],
      plantInterfaceRequired: [
        "Three-phase AC power feed (230 VAC / 400 VAC ±10%) with upstream breaker",
        "Clean, low-noise earth ground with isolated shield grounding bar",
        "Upstream line master PLC or supervisory SCADA communication interface",
        "Physical space allocation in IP54/IP65 electrical control enclosure",
      ],
    },
    challenge: {
      title: "The Industrial Motion Challenge",
      description:
        "High-throughput packaging, CNC machining, and semiconductor assembly systems demand aggressive acceleration rates without introducing structural vibrations, contouring errors, or settling delays. When axes are loosely synchronized over non-deterministic networks, phase lag creates mechanical binding, surface finish ripple, and excessive component wear.",
      bulletPoints: [
        "Contour tracking errors during multi-axis circular and helical interpolation",
        "Settling time delays caused by drivetrain compliance and mechanical resonance",
        "Microsecond jitter across distributed drive nodes causing velocity ripple",
        "Thermal expansion of ballscrews causing cumulative linear positioning drift",
        "Complex gain tuning across changing mechanical inertia ratios (> 10:1 mismatch)",
      ],
    },
    approach: {
      title: "Our Engineering Approach",
      description:
        "INDUS designs motion subsystems using deterministic EtherCAT distributed clocks (DC) that synchronize all drives to within 1 microsecond. We implement 7th-order polynomial and jerk-limited trajectory profiles, coupled with automated frequency-domain anti-resonance notch filters to suppress mechanical vibration modes.",
      bulletPoints: [
        "Hardware-synchronized Distributed Clocks with bus jitter under 1 µs",
        "Dual-encoder closed loop: motor encoder for velocity, load scale for position",
        "Real-time electronic camming (E-CAM) and electronic gearing (E-Gear)",
        "Bode plot frequency analysis and bi-quad digital notch filters to cancel resonance",
        "Integrated Functional Safety: Safe Torque Off (STO) and Safely-Limited Speed (SLS)",
      ],
    },
    technologiesUsed: [
      "EtherCAT CoE (CiA 402)",
      "High-Resolution 24-Bit Optical Encoders",
      "Bi-Quad Anti-Resonance Filters",
      "Jerk-Limited S-Curve Profiling",
      "Harmonic Zero-Backlash Reducers",
      "Dual-Loop Load Position Feedback",
    ],
    systemArchitecture: [
      {
        step: "01",
        title: "Trajectory Computation & Kinematics",
        description: "Master motion IPC computes 3D path curves, jerk-limited velocity profiles, and axis transformation matrices every 250 µs.",
        signalFlow: "IPC CPU -> Motion Kernel -> CiA 402 Position Target (Cyclic Synchronous Position - CSP)",
      },
      {
        step: "02",
        title: "Deterministic Fieldbus Distribution",
        description: "EtherCAT master broadcasts synchronized setpoints to all servo nodes using Distributed Clocks (DC) to latch values simultaneously.",
        signalFlow: "Master EtherCAT Port -> Cat6A Shielded Bus -> Slave Servo Amplifiers (Jitter < 1 µs)",
      },
      {
        step: "03",
        title: "High-Bandwidth Current & Velocity Loops",
        description: "Digital servo amplifiers close the current loop at 20–32 kHz and velocity loop at 4–8 kHz using advanced observer algorithms.",
        signalFlow: "PWM Bridge -> FOC Current Loop (32 kHz) -> Motor Windings -> Back-EMF Compensation",
      },
      {
        step: "04",
        title: "Direct Load Metrology Feedback",
        description: "Absolute linear or rotary scales mounted directly to the moving payload close the outer position loop, eliminating transmission backlash.",
        signalFlow: "Optical Scale (BiSS-C / EnDat 2.2) -> Outer Position Loop (1–4 kHz) -> Error Nulling",
      },
    ],
    technicalSpecs: [
      {
        label: "Fieldbus Synchronization Jitter",
        value: "< 1.0 µs",
        standard: "IEC 61158 Type 12 (EtherCAT DC)",
        notes: "Verified across up to 32 synchronized drive nodes in cyclic synchronous mode.",
      },
      {
        label: "Master Cycle Rate",
        value: "250 µs – 1.0 ms",
        standard: "CiA 402 Drive Profile",
        notes: "Configurable based on trajectory complexity and axis count.",
      },
      {
        label: "Feedback Resolution",
        value: "Up to 24-bit (16,777,216 counts/rev)",
        standard: "EnDat 2.2 / BiSS-C",
        notes: "Pure serial digital feedback immune to EMI noise over long cable runs.",
      },
      {
        label: "Current Loop Frequency",
        value: "32 kHz (31.25 µs)",
        standard: "Field-Oriented Control (FOC)",
        notes: "Space-vector PWM switching with low acoustic motor noise.",
      },
      {
        label: "Gear Backlash Threshold",
        value: "< 0.1 arcmin (< 6 arcsec)",
        standard: "DIN 3990 / ISO 6336",
        notes: "Zero lost motion achieved via flexspline harmonic gearing.",
      },
      {
        label: "Functional Safety Rating",
        value: "SIL 3 / Cat 4 PLe",
        standard: "IEC 61800-5-2 / ISO 13849-1",
        notes: "Safe Torque Off (STO) hardwired dual-channel or FailSafe over EtherCAT (FSoE).",
      },
    ],
    engineeringInputs: [
      {
        parameter: "Kinematic Architecture & Axis Count",
        description: "Number of linear, rotary, and coupled axes requiring coordinated interpolation.",
        impactOnDesign: "Determines motion processor core allocation and fieldbus cycle rate.",
      },
      {
        parameter: "Payload Mass & Drivetrain Inertia Ratio",
        description: "Moving mass, center of gravity offset, and motor-to-load reflected inertia ratio (JL / JM).",
        impactOnDesign: "Guides motor frame selection, gearbox ratio sizing, and loop bandwidth tuning.",
      },
      {
        parameter: "Required In-Position Settling Time",
        description: "Maximum allowable window for position error to settle within tolerance after a move.",
        impactOnDesign: "Dictates feedforward gains, notch filter requirements, and mechanical frame stiffness.",
      },
      {
        parameter: "Ambient Operating Conditions",
        description: "Ambient temperature range, vibration, and presence of conductive dust or liquids.",
        impactOnDesign: "Determines drive enclosure thermal management and IP-rating requirements.",
      },
    ],
    testingAndValidation: [
      {
        phase: "Phase 1",
        name: "Frequency-Domain Resonance Identification",
        description: "Chirp and step response excitation to identify mechanical anti-resonance and compliance frequencies.",
        acceptanceCriteria: "Bode magnitude peaks identified; notch filters attenuating structural resonance by ≥ 18 dB.",
      },
      {
        phase: "Phase 2",
        name: "Contour Error & Dynamic Tracking Audit",
        description: "Laser interferometer and circular ballbar measurement during continuous 2D/3D interpolated motion.",
        acceptanceCriteria: "Radial contouring deviation within agreed micron tolerance across full velocity range.",
      },
      {
        phase: "Phase 3",
        name: "Thermal Drift & Continuous Duty Stress",
        description: "Continuous 8-hour cyclic move profile measuring motor winding temperature and drivetrain growth.",
        acceptanceCriteria: "Winding temperature rise under rated limits (ΔT < 60°C); thermal expansion mapped or compensated.",
      },
      {
        phase: "Phase 4",
        name: "Factory Acceptance Testing (FAT)",
        description: "Full-speed multi-axis cycle running customer-specified motion recipes with safety validation.",
        acceptanceCriteria: "100% pass on STO trip time (< 20 ms), position repeatability, and continuous cycle completion.",
      },
    ],
    typicalApplications: [
      "High-speed Cartesian pick-and-place gantries",
      "Multi-axis CNC milling, grinding, and laser cutting heads",
      "Electronic line shafting and continuous rotary printing",
      "Semiconductor wafer inspection stages",
      "Synchronized winding, tension control, and spooling machinery",
    ],
    benefits: [
      {
        title: "Microsecond Contouring Precision",
        description: "Deterministic synchronization eliminates path distortion during complex multi-axis curves.",
      },
      {
        title: "Aggressive Cycle Compression",
        description: "Jerk-limited profiling allows maximum acceleration without tripping vibration-induced safety limits.",
      },
      {
        title: "Direct-Drive Elimination of Backlash",
        description: "Dual-loop encoder architecture corrects for gear compliance, thermal growth, and mechanical wear.",
      },
    ],
    relatedProducts: [
      {
        name: "64-Axis Deterministic EtherCAT Motion Controller",
        category: "Control & Drives",
        href: "/products/control-drives/ind-ctl-64axis-ethercat-motion",
        specs: "Up to 64 physical axes • 250 µs cycle • Intel Core i7",
      },
      {
        name: "High-Performance IPC Robot Controller",
        category: "Control & Drives",
        href: "/products/control-drives/ind-ctl-ipc-realtime-master",
        specs: "Deterministic RT-Linux • Dual EtherCAT Masters • 24V DC",
      },
      {
        name: "IND-PR-SW100 Cup Harmonic Reducer",
        category: "Motion & Actuation",
        href: "/products/motion-actuation/ind-pr-sw-cup-set",
        specs: "Zero backlash • Ratios 50:1 to 160:1 • High torsional rigidity",
      },
      {
        name: "IND-PR-RVE Solid-Output RV Reducer",
        category: "Motion & Actuation",
        href: "/products/motion-actuation/ind-pr-rv-solid-e",
        specs: "Rated torque up to 3,200 Nm • High shock load capacity",
      },
    ],
    relatedIndustries: [
      {
        name: "Electronics & Semiconductor",
        slug: "electronics",
        href: "/applications/electronics",
        applicationExample: "High-speed wire bonding and wafer positioning gantries.",
      },
      {
        name: "Automotive Manufacturing",
        slug: "automotive",
        href: "/applications/automotive",
        applicationExample: "Synchronized transfer presses and powertrain machining spindles.",
      },
      {
        name: "Metal Machining",
        slug: "metalMachining",
        href: "/applications/metalMachining",
        applicationExample: "5-axis simultaneous CNC milling heads and rotary indexing tables.",
      },
    ],
    resources: [
      {
        title: "Deterministic Motion Synchronization Handbook",
        type: "Engineering Whitepaper",
        href: "/resources?type=whitepaper",
        description: "Technical guide on EtherCAT Distributed Clocks, jitter budgets, and dual-loop feedback.",
      },
      {
        title: "Servo Loop Tuning & Resonance Mitigation Guide",
        type: "Application Note",
        href: "/resources?type=app-note",
        description: "Practical procedures for Bode analysis, low-pass filtering, and notch tuning.",
      },
    ],
    faqs: [
      {
        question: "How do you achieve < 1 µs synchronization across multiple remote servo drives?",
        answer: "We utilize EtherCAT Distributed Clocks (DC). A reference clock in the first slave continuously measures propagation delays to all downstream nodes and calculates individual transmission offsets. Setpoint latching is triggered by local hardware timers synchronized to the system time, eliminating communication jitter.",
      },
      {
        question: "What is the difference between single-loop and dual-loop encoder feedback?",
        answer: "In a single-loop system, position is measured at the motor shaft; any backlash, torsional compliance, or thermal expansion in the gearbox or ballscrew is invisible to the controller. In a dual-loop system, the motor encoder provides high-speed velocity feedback, while an external optical linear scale or direct rotary encoder on the load provides absolute position feedback, eliminating mechanical transmission error.",
      },
      {
        question: "Can INDUS motion subsystems interface with existing plant PLCs from Siemens or Rockwell?",
        answer: "Yes. Our master controllers support multi-protocol fieldbus communication. While EtherCAT is used for the sub-millisecond drive loop, the controller can simultaneously communicate with plant master PLCs via PROFINET, EtherNet/IP, or Modbus TCP using dedicated gateway ports without degrading motion loop determinism.",
      },
      {
        question: "What information is needed to size motors and drives for a motion control project?",
        answer: "We require moving mass, transmission type (ballscrew, rack and pinion, direct drive, reducer), desired move distance, allowable move time, in-position tolerance, external friction/machining forces, and supply voltage. We then model dynamic torque, thermal continuous RMS torque, and load-to-motor inertia ratio.",
      },
    ],
  },

  // 2. ROBOTIC AUTOMATION
  {
    id: "robotic-automation",
    title: "Robotic Automation",
    badge: "Turnkey Robotic Cells, Tooling & Functional Safety",
    heroSubtitle: "Engineered-to-order industrial robotic cells, application kinematics, custom end-of-arm tooling, and certified ISO 10218 safety integration.",
    shortDescription: "Turnkey articulated, SCARA, and collaborative robotic cells engineered for automated welding, machine tending, precision dispensing, and assembly.",
    systemScope: {
      included: [
        "Robotic manipulator selection (4-axis SCARA, 6-axis articulated, high-speed delta, cobot)",
        "Application-specific End-of-Arm Tooling (EOAT: electric servo, pneumatic, vacuum, magnetic)",
        "Industrial robot controller cabinet with safety teach pendant and remote I/O",
        "Cell fencing, interlocking safety gates, optical light curtains, and area scanners",
        "Master cell PLC integration and touch HMI with recipe and cycle diagnostics",
        "Offline simulation, 3D kinematic reach studies, and collision zone verification",
      ],
      plantInterfaceRequired: [
        "Level reinforced concrete foundation capable of absorbing dynamic robot overturning moments",
        "Clean, dry pneumatic supply (6–8 bar, ISO 8573-1 Class 2:4:2) for pneumatic grippers",
        "Primary electrical disconnect with plant emergency interlock interface",
        "Incoming and outgoing part delivery conveyors or docking stations",
      ],
    },
    challenge: {
      title: "The Industrial Robotic Challenge",
      description:
        "Implementing robotic automation involves significant operational and technical risks. Sizing errors can lead to wrist motor overheating, unexpected cycle-time overruns, or joint singular regions where the robot cannot reach workpiece corners. Furthermore, complex part presentation and lack of robust safety zoning can compromise operator safety and cause chronic nuisance cell stoppages.",
      bulletPoints: [
        "Inadequate payload margin when accounting for EOAT weight, hoses, and dynamic inertia",
        "Wrist singularity points causing unexpected decelerations during linear weld paths",
        "Inconsistent manual part staging causing gripper pickup misalignments and dropped components",
        "Poorly planned safety interlocks that halt entire lines when operators replenish stock",
        "Complex cell programming that creates plant dependency on external programmers for minor recipe tweaks",
      ],
    },
    approach: {
      title: "Our Engineering Approach",
      description:
        "INDUS approaches robotic automation through rigorous upfront application engineering. We conduct 3D kinematic reach studies, calculate dynamic moments of inertia at wrist flanges, and simulate exact cycle times before freezing cell design. Cells are engineered according to ISO 10218-2 with dual-channel safety architecture and standardized operator HMI workflows.",
      bulletPoints: [
        "Full 3D physics-based cycle simulation verifying reach, cycle takt, and obstacle clearance",
        "Custom EOAT designed with integrated part-present sensors and quick automatic tool changers",
        "Dual-channel safety circuits complying with ISO 13849-1 Performance Level e (PLe)",
        "Standardized operator HMI with graphical step-by-step part changeover routines",
        "Virtual commissioning to debug PLC and robot code prior to physical cell assembly",
      ],
    },
    technologiesUsed: [
      "6-Axis Articulated Robots",
      "High-Speed 4-Axis SCARA Manipulators",
      "Custom Electric & Vacuum EOAT",
      "ISO 13849-1 SIL 3 Safety Systems",
      "Dynamic 3D Kinematic Simulation",
      "Machine Vision Guidance (2D/3D)",
    ],
    systemArchitecture: [
      {
        step: "01",
        title: "Part Presentation & Staging",
        description: "Components enter the cell via indexed conveyors, vibratory trays, or pallet fixtures; optical sensors verify part readiness.",
        signalFlow: "Part Present Sensor -> Cell I/O Block -> Safety PLC -> Robot Start Permissive",
      },
      {
        step: "02",
        title: "Kinematic Grip & Validation",
        description: "Robot articulates along pre-computed collision-free trajectories to engage the part with force-monitored gripper jaws.",
        signalFlow: "Robot Controller -> EOAT Valve Bank / Servo Axis -> Gripper Clamped Sensor -> Motion Resume",
      },
      {
        step: "03",
        title: "Process Execution (Welding / Tending / Dispense)",
        description: "Robot executes deterministic process path while coordinating auxiliary positioners or machine tool door interlocks.",
        signalFlow: "CNC Machine Ready Interlock <-> Robot Controller Fieldbus <-> Dispense Spindle Controller",
      },
      {
        step: "04",
        title: "Inspection & Discharge",
        description: "Post-process inspection verifies dimensional integrity or seal continuity before placing part on exit conveyor.",
        signalFlow: "Vision Trigger -> 2D/3D Inspection Camera -> Pass/Fail Signal -> Sorted Discharge Lane",
      },
    ],
    technicalSpecs: [
      {
        label: "Kinematic Repeatability",
        value: "±0.02 mm – ±0.05 mm",
        standard: "ISO 9283 (Manipulating Industrial Robots)",
        notes: "Verified across multi-axis dynamic trajectories under full rated payload.",
      },
      {
        label: "Payload Capacity Range",
        value: "3 kg – 210 kg",
        standard: "Rated Wrist Flange Load",
        notes: "Accounts for tooling center of gravity (CoG) and dynamic inertial moment limits.",
      },
      {
        label: "Working Reach Envelope",
        value: "400 mm – 3,100 mm",
        standard: "Spherical Geometric Radius",
        notes: "Extended reach options available with 7th-axis floor linear transfer track.",
      },
      {
        label: "Safety Integrity Level",
        value: "ISO 13849-1 Cat 4 PLe / SIL 3",
        standard: "ISO 10218-1/2 & IEC 62061",
        notes: "Hardware dual-channel monitored safety circuits with integrated STO and SLS.",
      },
      {
        label: "Wrist Ingress Protection",
        value: "IP65 / IP67 Washdown",
        standard: "IEC 60529",
        notes: "Fully sealed wrist joints for harsh welding, casting, and machining environments.",
      },
      {
        label: "Tool Flange Interface",
        value: "ISO 9409-1-50 / 9409-1-100",
        standard: "ISO 9409-1 Standard",
        notes: "Standardized mechanical bolt pattern and electrical slip-ring pass-through.",
      },
    ],
    engineeringInputs: [
      {
        parameter: "Workpiece Geometry & Mass Properties",
        description: "3D CAD model, mass, center of gravity, surface finish, and rigidity under grip pressure.",
        impactOnDesign: "Determines robot payload margin, reach envelope, and EOAT gripper finger contours.",
      },
      {
        parameter: "Takt Time Target & Process Duration",
        description: "Target cycle time per finished component, including load, process, inspect, and unload times.",
        impactOnDesign: "Determines whether a single articulated robot or multiple synchronized arms/SCARAs are required.",
      },
      {
        parameter: "Cell Footprint & Operator Interaction",
        description: "Available plant floor dimensions, ceiling clearance, and frequency of operator loading/replenishment.",
        impactOnDesign: "Dictates safety guarding strategy: full physical fence enclosure vs. collaborative optical zoning.",
      },
      {
        parameter: "Upstream / Downstream Machine Interfaces",
        description: "Machine tool makes, door automation mechanisms, chuck clamping sensors, and fieldbus protocol.",
        impactOnDesign: "Defines electrical interface boundaries and interlock handshaking protocols.",
      },
    ],
    testingAndValidation: [
      {
        phase: "Phase 1",
        name: "3D Kinematic Simulation & Reach Freeze",
        description: "Simulation of all robot poses, tool clearances, wrist singularity avoidance, and cable dress pack flex.",
        acceptanceCriteria: "Zero singularities, minimum 100 mm safety clearance from all static frame members.",
      },
      {
        phase: "Phase 2",
        name: "EOAT Grip Force & Dynamic Retention Audit",
        description: "Testing gripper holding force under 2.5x maximum dynamic emergency stop deceleration forces.",
        acceptanceCriteria: "Zero workpiece slippage; sensor verification of part presence across 500 consecutive cycles.",
      },
      {
        phase: "Phase 3",
        name: "Factory Acceptance Testing (FAT)",
        description: "Continuous 50-cycle pre-production run in INDUS integration facility with customer workpieces.",
        acceptanceCriteria: "100% adherence to takt time, zero dropped parts, and complete safety interlock trip verification.",
      },
      {
        phase: "Phase 4",
        name: "Site Acceptance Testing (SAT) & Handover",
        description: "On-site installation, mechanical anchoring, laser leveling, utility hookup, and production ramp-up.",
        acceptanceCriteria: "Customer sign-off on 8-hour continuous production run without unassisted cell stops.",
      },
    ],
    typicalApplications: [
      "CNC machining center automated load and unload (machine tending)",
      "Automotive robotic MIG/TIG and laser seam welding cells",
      "Battery module precision sealant dispensing and screw fastening",
      "Consumer electronics high-speed insertion and casing assembly",
      "Metal casting deburring, grinding, and surface polishing",
    ],
    benefits: [
      {
        title: "Guaranteed Takt Predictability",
        description: "Consistent mechanical pacing eliminates shift-to-shift operator variations and output dips.",
      },
      {
        title: "Total Operator Protection",
        description: "Engineered safety zoning allows safe part loading while the robot continues internal tasks.",
      },
      {
        title: "Rapid Part Variant Changeover",
        description: "Digital recipe storage and quick-change gripper fingers enable changeovers in under 4 minutes.",
      },
    ],
    relatedProducts: [
      {
        name: "Heavy Palletizing Cobot Arm (20kg Payload)",
        category: "Robotic Systems",
        href: "/products/robotic-systems/ind-rob-cobot-20kg-pallet",
        specs: "20 kg payload • 1,700 mm reach • ISO 10218-1 certified",
      },
      {
        name: "High-Speed 4-Axis SCARA Manipulator",
        category: "Robotic Systems",
        href: "/products/robotic-systems/ind-rob-scara-standard",
        specs: "Payload 3-10 kg • Reach 400-800 mm • Cycle time < 0.35s",
      },
      {
        name: "Multi-Axis Cartesian Linear Gantry Robot",
        category: "Robotic Systems",
        href: "/products/robotic-systems/ind-rob-cartesian-gantry",
        specs: "Stroke up to 30,000 mm • Payloads 100-500 kg",
      },
      {
        name: "6-Axis Robot Controller Cabinet with Teach Pendant",
        category: "Control & Drives",
        href: "/products/control-drives/ind-ctl-6axis-pendant-cabinet",
        specs: "10.1\" IPS Touchscreen • ISO 13849-1 Cat 4 / PLe",
      },
    ],
    relatedIndustries: [
      {
        name: "Automotive Manufacturing",
        slug: "automotive",
        href: "/applications/automotive",
        applicationExample: "Robotic welding cells and automated powertrain assembly stations.",
      },
      {
        name: "Metal Machining",
        slug: "metalMachining",
        href: "/applications/metalMachining",
        applicationExample: "Automated machine tending for CNC lathe and milling centers.",
      },
      {
        name: "Aerospace & Defense",
        slug: "aerospace",
        href: "/applications/aerospace",
        applicationExample: "Precision drilling, riveting, and composite adhesive laying.",
      },
    ],
    resources: [
      {
        title: "Robotic Cell Kinematics & Sizing Guide",
        type: "Technical Dossier",
        href: "/resources?type=datasheet",
        description: "Engineering formulas for wrist moment calculation, reach margins, and cycle takt.",
      },
      {
        title: "Industrial vs Collaborative Robotics Safety Matrix",
        type: "Safety Standard Brief",
        href: "/resources?type=app-note",
        description: "Comparison of ISO 10218-1/2 vs ISO/TS 15066 power and force limiting parameters.",
      },
    ],
    faqs: [
      {
        question: "How do you verify robot reach and cycle time before building the physical cell?",
        answer: "We develop complete 3D kinematic digital twins using calibrated CAD models of the robot, EOAT, fixtures, and machine doors. The simulation uses real joint acceleration limits and trajectory planners to verify reach without joint singularities and compute cycle time within ±5% accuracy.",
      },
      {
        question: "Can an INDUS robotic cell handle multiple workpiece variants without mechanical retooling?",
        answer: "Yes. We engineer multi-variant cells using servo-electric grippers with programmable stroke and grip force, automatic tool changers (ATCs) that switch end effectors in under 10 seconds, or quick-release jaw inserts with optical barcode or RFID recipe verification.",
      },
      {
        question: "What safety standards govern INDUS robotic automation systems?",
        answer: "All cells are engineered in strict compliance with ISO 10218-1 (Robot Safety), ISO 10218-2 (Robot Integration), and ISO 13849-1 (Safety-Related Parts of Control Systems). We conduct formal risk assessments to define performance levels (typically Cat 4 PLe) and install monitored dual-channel safety devices.",
      },
      {
        question: "What training and ongoing support do you provide after cell commissioning?",
        answer: "Every project includes comprehensive documentation (EPLAN electrical drawings, pneumatics schematics, robot maintenance manuals) and on-site operator/maintenance training covering pendant jogging, zero-point calibration, recipe selection, and basic troubleshooting.",
      },
    ],
  },

  // 3. MACHINE INTEGRATION
  {
    id: "machine-integration",
    title: "Machine Integration",
    badge: "Plant Cell Coordination, Fieldbus Bridging & Legacy Retrofits",
    heroSubtitle: "Interfacing standalone production machinery, robotics, sensors, and legacy controllers into deterministic, high-throughput manufacturing cells.",
    shortDescription: "Unify disparate OEM machines, PLCs, robotic cells, and safety loops into a synchronized plant subsystem with centralized HMI and MES telemetry.",
    systemScope: {
      included: [
        "Multi-vendor PLC interfacing (Siemens S7, Rockwell ControlLogix, Beckhoff, Omron)",
        "Industrial communication fieldbus gateways (EtherCAT, PROFINET IRT, EtherNet/IP, Modbus TCP)",
        "Hardware safety circuit bridging and emergency interlock coordination",
        "Centralized operator HMI panel PCs with unified recipe management and fault diagnostics",
        "Edge IIoT gateways for OPC UA and MQTT telemetry streaming to SCADA / MES",
        "Legacy machine retrofit kits (optical sensor integration, spindle monitoring, digital I/O isolation)",
      ],
      plantInterfaceRequired: [
        "Access to existing machine electrical cabinets and OEM PLC schematics/source code",
        "Dedicated industrial Ethernet switch ports on customer plant network (IT/OT boundary)",
        "Designated machine maintenance window for physical sensor installation and signal wiring",
        "Customer automation engineer sign-off on machine cycle handshake timing",
      ],
    },
    challenge: {
      title: "The Industrial Integration Challenge",
      description:
        "Most manufacturing plants operate a patchwork of isolated machines delivered by different OEMs across different decades. These islands of automation speak incompatible communication protocols, use contradictory safety interlock schemes, and lack coordinated pacing. The result is continuous line starvation, manual handling bottlenecks, and zero centralized visibility into production bottlenecks.",
      bulletPoints: [
        "Incompatible fieldbus networks (e.g. PROFINET on CNC vs EtherNet/IP on stamping press)",
        "Asynchronous machine cycles causing buffer overflow or upstream line starvation",
        "Fragmented emergency stops where tripping one machine leaves adjacent conveyors running",
        "Lack of centralized recipe distribution requiring manual parameter entry on every machine",
        "Zero real-time data capture for overall equipment effectiveness (OEE) and preventative maintenance",
      ],
    },
    approach: {
      title: "Our Engineering Approach",
      description:
        "INDUS integrates production lines by establishing clean, deterministic architectural boundaries. We deploy multi-protocol fieldbus gateways and modular safety PLCs that coordinate handshakes without modifying certified OEM internal logic. Central touch HMIs provide plant floor operators with intuitive line overview, while edge nodes expose standardized OPC UA information models to enterprise systems.",
      bulletPoints: [
        "Deterministic protocol bridging using dedicated hardware couplers (EtherCAT <-> PROFINET <-> EtherNet/IP)",
        "Failsafe hardware interlocks: dual-channel safety relays coordinating emergency stop perimeters",
        "Unified HMI platform standardizing alarm visualization, scrap counters, and recipe selection",
        "Optically isolated discrete I/O interfaces for legacy machinery lacking network communication",
        "Secure IEC 62443 compliant edge telemetry architecture separating machine network from plant IT",
      ],
    },
    technologiesUsed: [
      "Multi-Protocol Fieldbus Gateways",
      "Modular Safety PLCs (SIL 3)",
      "OPC UA (IEC 62541) Telemetry",
      "Isolated Industrial Signal Conditioning",
      "Centralized Multi-Touch IPC HMIs",
      "Time-Sensitive Networking (TSN)",
    ],
    systemArchitecture: [
      {
        step: "01",
        title: "Interface Boundary Definition",
        description: "Map all machine electrical I/O, OEM safety circuits, and digital registers; define safe handshaking state machines.",
        signalFlow: "Machine Cycle Ready Signal -> Optical Isolator -> Integration PLC Input Register",
      },
      {
        step: "02",
        title: "Fieldbus Bridging & Deterministic Master Loop",
        description: "Hardware couplers exchange cyclic process data across different network domains in under 2 ms.",
        signalFlow: "CNC PROFINET Master <-> Anybus/Beckhoff Gateway <-> Assembly Cell EtherCAT Master",
      },
      {
        step: "03",
        title: "Safety Loop Synchronization",
        description: "Central safety controller monitors all cell E-Stops and light curtains, transmitting Safe Torque Off commands to all sub-units.",
        signalFlow: "Cell E-Stop Button Tripped -> Dual-Channel Safety Bus -> Simultaneous Machine STO (< 20 ms)",
      },
      {
        step: "04",
        title: "Unified Supervisory Control & Edge Telemetry",
        description: "Central operator HMI coordinates recipe parameters; edge gateway streams OEE telemetry to plant SCADA via OPC UA.",
        signalFlow: "Recipe Selected on HMI -> Distributed Parameters to Sub-Controllers -> OPC UA Edge Broker",
      },
    ],
    technicalSpecs: [
      {
        label: "Inter-Network Handshake Latency",
        value: "< 2.0 ms",
        standard: "Real-Time Fieldbus Couplers",
        notes: "Deterministic cyclic data exchange across independent protocol domains.",
      },
      {
        label: "Supported Industrial Protocols",
        value: "EtherCAT, PROFINET, EtherNet/IP, Modbus TCP",
        standard: "IEC 61158 & IEEE 802.3",
        notes: "Native driver support for Siemens, Rockwell, Beckhoff, Omron, and Schneider controllers.",
      },
      {
        label: "Safety Interlock Response",
        value: "< 15 ms",
        standard: "ISO 13849-1 Cat 4 PLe",
        notes: "Total time from peripheral safety trip to power cutoff on hazardous motion axes.",
      },
      {
        label: "Data Telemetry Protocol",
        value: "OPC UA / MQTT with Sparkplug B",
        standard: "IEC 62541 Standard",
        notes: "TLS 1.3 encrypted data channel with certificate-based authentication.",
      },
      {
        label: "Legacy Signal Isolation",
        value: "2,500 VRMS Galvanic Isolation",
        standard: "DIN EN 60747-5-2",
        notes: "Protects modern PLC modules from voltage spikes or ground loops in older machines.",
      },
      {
        label: "HMI Enclosure Rating",
        value: "IP65 Front Bezel / NEMA 4X",
        standard: "IEC 60529",
        notes: "Resistant to coolant spray, oil mist, and industrial cleaning solvents.",
      },
    ],
    engineeringInputs: [
      {
        parameter: "Machine Inventory & Controller Makes",
        description: "List of all machinery to be linked, including PLC models, software versions, and communication cards.",
        impactOnDesign: "Determines gateway hardware selection, driver configurations, and licensing requirements.",
      },
      {
        parameter: "Electrical & Signal Schematics",
        description: "OEM wiring schematics showing existing emergency stop circuits, control voltages, and spare I/O terminals.",
        impactOnDesign: "Enables engineering of non-invasive interlock tapping and isolated interface panels.",
      },
      {
        parameter: "Production Sequence & Interlock Logic",
        description: "Exact step-by-step logic detailing when a machine can open doors, accept parts, or start cycles.",
        impactOnDesign: "Forms the basis for the integration state machine software and fault recovery sequences.",
      },
      {
        parameter: "Plant IT/OT Cybersecurity Architecture",
        description: "Plant network IP scheme, firewall constraints, VLAN assignments, and SCADA database endpoints.",
        impactOnDesign: "Guides edge gateway configuration, subnet routing, and certificate provisioning.",
      },
    ],
    testingAndValidation: [
      {
        phase: "Phase 1",
        name: "I/O Loop & Signal Verification",
        description: "Point-to-point electrical ringing of all discrete and network interface points between machines.",
        acceptanceCriteria: "100% correct signal mapping, zero ground loop noise, verified galvanic isolation.",
      },
      {
        phase: "Phase 2",
        name: "Handshake State Machine Testing",
        description: "Simulating normal operating cycles, part present variations, and buffer full conditions.",
        acceptanceCriteria: "Zero deadlock states; deterministic cycle handshakes completed within allocated timing window.",
      },
      {
        phase: "Phase 3",
        name: "Fault Injection & Emergency Stop Audit",
        description: "Intentional triggering of peripheral E-Stops, door interlocks, and network disconnections.",
        acceptanceCriteria: "Controlled safe stop on all coordinated axes; zero tool collisions or uncontrolled coasting.",
      },
      {
        phase: "Phase 4",
        name: "Site Acceptance Testing (SAT)",
        description: "Live production run integrating all upstream and downstream machines under full factory load.",
        acceptanceCriteria: "Target line takt achieved; real-time OEE and fault metrics verified in plant SCADA system.",
      },
    ],
    typicalApplications: [
      "Linking CNC milling centers with robotic tending arms and wash stations",
      "Automotive stamping press to assembly conveyor interlocked synchronization",
      "Retrofitting legacy packaging machinery with modern recipe control and telemetry",
      "Multi-cell safety perimeter consolidation in plastics injection molding plants",
      "Factory-wide MES data collection and OEE visualization across legacy lines",
    ],
    benefits: [
      {
        title: "Elimination of Line Starvation",
        description: "Dynamic buffer management and synchronized cycle handshakes keep bottleneck machines fed.",
      },
      {
        title: "Non-Invasive OEM Integration",
        description: "Interface gateways connect machines without voiding original OEM warranties or modifying core logic.",
      },
      {
        title: "Factory-Wide OEE Visibility",
        description: "Real-time edge telemetry provides actionable insight into micro-stoppages and equipment availability.",
      },
    ],
    relatedProducts: [
      {
        name: "High-Performance IPC Robot Controller",
        category: "Control & Drives",
        href: "/products/control-drives/ind-ctl-ipc-realtime-master",
        specs: "Multi-Fieldbus Gateway • 250 µs Cycle • Intel Core i7",
      },
      {
        name: "Autonomous Mobile Robot Navigation & Fleet Gateway",
        category: "Control & Drives",
        href: "/products/control-drives/ind-ctl-amr-fleet-gateway",
        specs: "VDA 5050 v2.0 • Natural Feature SLAM • Dual CAN-FD",
      },
      {
        name: "6-Axis Robot Controller Cabinet with Teach Pendant",
        category: "Control & Drives",
        href: "/products/control-drives/ind-ctl-6axis-pendant-cabinet",
        specs: "Integrated Safety PLC • Dual EtherCAT • Touch Pendant",
      },
      {
        name: "Multi-Axis Cartesian Linear Gantry Robot",
        category: "Robotic Systems",
        href: "/products/robotic-systems/ind-rob-cartesian-gantry",
        specs: "Line-linking transfer • Payloads 100-500 kg",
      },
    ],
    relatedIndustries: [
      {
        name: "Automotive Manufacturing",
        slug: "automotive",
        href: "/applications/automotive",
        applicationExample: "Coordinating multi-vendor welding, stamping, and transfer press lines.",
      },
      {
        name: "Metal Machining",
        slug: "metalMachining",
        href: "/applications/metalMachining",
        applicationExample: "Automated cell integration between CNC machines, CMMs, and wash booths.",
      },
      {
        name: "Electronics & Semiconductor",
        slug: "electronics",
        href: "/applications/electronics",
        applicationExample: "Cleanroom machine-to-machine SECS/GEM and SMEMA interlock coordination.",
      },
    ],
    resources: [
      {
        title: "Heterogeneous Fieldbus Integration Architecture",
        type: "Engineering Architecture Note",
        href: "/resources?type=app-note",
        description: "Technical guide on bridging EtherCAT, PROFINET, and EtherNet/IP without latency jitter.",
      },
      {
        title: "Legacy Machinery Safety Retrofit Guide",
        type: "Compliance Whitepaper",
        href: "/resources?type=whitepaper",
        description: "Methods for bringing pre-2000 industrial equipment into ISO 13849-1 Cat 3/4 compliance.",
      },
    ],
    faqs: [
      {
        question: "Do we need the original PLC source code from machine builders to integrate equipment?",
        answer: "Not necessarily. While having source code simplifies internal register mapping, INDUS regularly integrates machinery non-invasively using external deterministic fieldbus couplers, discrete optocoupled I/O, or standard industrial protocol interfaces (such as SECS/GEM, Euromap 67, or OPC UA) without altering OEM program code.",
      },
      {
        question: "How do you handle safety integration between machines from different manufacturers?",
        answer: "We deploy an overarching modular safety PLC that monitors all perimeter emergency stops, light curtains, and gate switches. Safe state outputs are routed to each machine's dedicated hardware dual-channel emergency stop input or STO circuit, ensuring that tripping one safety device immediately and safely shuts down all coordinated hazards.",
      },
      {
        question: "What industrial communication protocols do you support for factory integration?",
        answer: "We have native hardware and software solutions for EtherCAT, PROFINET IRT, EtherNet/IP, Modbus TCP, CC-Link IE, and traditional serial protocols (Modbus RTU, RS-485). For enterprise connectivity, we implement standard OPC UA, MQTT, and REST endpoints.",
      },
      {
        question: "Will plant integration cause extended downtime on our active production line?",
        answer: "No. We minimize production disruption through extensive pre-engineering, off-site panel testing, and virtual simulation. Mechanical mounting and sensor pre-wiring are completed during scheduled shift shutdowns, with final live commissioning and verification typically executed during a single planned weekend window.",
      },
    ],
  },

  // 4. MATERIAL HANDLING
  {
    id: "material-handling",
    title: "Material Handling",
    badge: "Robotic Palletizing, High-Speed Sorting & AMR Logistics",
    heroSubtitle: "High-throughput robotic carton sorting, heavy-payload palletizing, conveyor transfer coordination, and Autonomous Mobile Robot (AMR) material logistics.",
    shortDescription: "Automate palletizing, carton manipulation, bin picking, and warehouse intralogistics with high-speed robotics, custom vacuum EOAT, and AMR fleets.",
    systemScope: {
      included: [
        "High-payload 4-axis and 6-axis articulated palletizing robots (up to 800 kg capacity)",
        "Custom vacuum foam grippers, mechanical clamp arms, and pneumatic bag grippers",
        "Pallet handling equipment: automatic pallet dispensers, roller conveyors, slip-sheet inserters",
        "In-feed case singulators, barcode scanners, and dynamic weigh-in-motion checkweighers",
        "Autonomous Mobile Robots (AMRs) for line-side raw material delivery and pallet transport",
        "Fleet management software coordinating AMR missions, traffic control, and VDA 5050 interfaces",
      ],
      plantInterfaceRequired: [
        "Reinforced industrial slab capable of supporting loaded pallet weights and dynamic robot tipping loads",
        "Continuous pneumatic air supply (6–8 bar, high flow rate > 250 NL/min for vacuum ejectors)",
        "Clean, unobstructed aisleways and floor docking zones mapped for AMR laser navigation",
        "Plant WMS / ERP network endpoint for real-time pallet tracking and inventory logging",
      ],
    },
    challenge: {
      title: "The Material Handling Challenge",
      description:
        "Warehouses and high-volume factories struggle with palletizing bottlenecks, erratic manual handling, high product damage rates, and ergonomic injuries from lifting heavy cartons. Variations in packaging materials (recycled corrugated cardboard, plastic crates, foil-wrapped bundles) frequently cause vacuum loss and dropped loads when handled by rigid, non-adaptive automation.",
      bulletPoints: [
        "Dropped cartons caused by vacuum leakage on porous or uneven corrugated cardboard",
        "Takt bottlenecks at end-of-line packaging lines causing upstream processing shutdowns",
        "Unstable pallet stack patterns leading to transit tipping and costly transport claims",
        "High changeover time between different carton SKU dimensions requiring manual rail readjustment",
        "Forklift traffic congestion on production floors creating safety hazards for operators",
      ],
    },
    approach: {
      title: "Our Engineering Approach",
      description:
        "INDUS designs material handling systems starting from physical packaging mechanics. We engineer multi-chamber vacuum foam grippers with high-flow check valves that maintain vacuum even when partially covering odd-shaped boxes. Our robotic palletizers utilize algorithmic pattern optimization for interlocked columnar stability, while natural-feature LiDAR AMRs handle line-to-warehouse transport without floor reflectors.",
      bulletPoints: [
        "Multi-zone vacuum grippers with auto-closing check valves preventing vacuum loss on partial picks",
        "Algorithmic pattern generator software creating interlocked, high-density pallet recipes in minutes",
        "Dynamic layer-card and slip-sheet placement integrated directly into the robot end effector",
        "Natural-feature LiDAR SLAM navigation on AMRs for flexible, dynamic obstacle avoidance",
        "High-speed optical scanning verifying 1D/2D barcodes on cartons prior to pallet placement",
      ],
    },
    technologiesUsed: [
      "High-Payload 4-Axis Palletizers",
      "Multi-Zone Vacuum Foam EOAT",
      "LiDAR SLAM Autonomous Mobile Robots",
      "Algorithmic Pallet Pattern Software",
      "In-Line Checkweighers & Barcode Scanners",
      "VDA 5050 Fleet Management Systems",
    ],
    systemArchitecture: [
      {
        step: "01",
        title: "In-Feed Conveyance & Verification",
        description: "Cartons travel on powered roller conveyors; barcode scanners read SKU data and checkweighers verify unit weight.",
        signalFlow: "Barcode Scanner -> PLC Registry -> Palletizing Recipe Lookup -> In-Feed Gate Index",
      },
      {
        step: "02",
        title: "Robotic Pick & Layer Compilation",
        description: "Robot articulates with multi-zone vacuum gripper to pick single or multi-carton batches according to pattern recipe.",
        signalFlow: "Vacuum Pressure Sensor -> Digital OK Signal -> Robot Trajectory Execute -> Pallet Base Pose",
      },
      {
        step: "03",
        title: "Slip-Sheet Insertion & Stacking",
        description: "Auxiliary vacuum suction cups on the robot wrist pick cardboard slip-sheets between layers to stabilize high stacks.",
        signalFlow: "Layer Complete Flag -> Slip-Sheet Magazine Pick -> Interlayer Placement -> Resume Stacking",
      },
      {
        step: "04",
        title: "AMR Pallet Extraction & WMS Log",
        description: "Full pallet is discharged onto transfer conveyor or picked directly by an AMR for warehouse rack staging.",
        signalFlow: "Pallet Complete Trigger -> WMS REST API -> AMR Dispatch Mission (VDA 5050) -> Transport",
      },
    ],
    technicalSpecs: [
      {
        label: "Throughput / Pick Rate",
        value: "Up to 1,200 cartons/hour",
        standard: "Multi-Pick Tooling Protocol",
        notes: "Single-pick rates up to 18–22 cycles/min; multi-box pick up to 4 units simultaneously.",
      },
      {
        label: "Maximum Pallet Payload",
        value: "Up to 800 kg per transfer",
        standard: "Rated Payload at Flange",
        notes: "Heavy-duty 4-axis articulated structure with high-inertia wrist gears.",
      },
      {
        label: "Maximum Pallet Stack Height",
        value: "Up to 2,400 mm",
        standard: "Including Standard EUR/ISO Pallet",
        notes: "Full reach capability with vertical kinematic linear extension.",
      },
      {
        label: "AMR Payload Capacity",
        value: "500 kg – 1,200 kg",
        standard: "Industrial Floor Slab Duty",
        notes: "Heavy steel chassis with integrated electric scissor or roller lift decks.",
      },
      {
        label: "AMR Docking Repeatability",
        value: "±5.0 mm / ±0.2°",
        standard: "Optical Target Alignment",
        notes: "Enables seamless automatic transfer to fixed plant roller conveyor docks.",
      },
      {
        label: "Vacuum Gripper Efficiency",
        value: "> 85% Vacuum at 6 Bar",
        standard: "Venturi Multistage Ejector",
        notes: "Integrated air-saving valves shut off compressed air once vacuum threshold is reached.",
      },
    ],
    engineeringInputs: [
      {
        parameter: "Workpiece Dimensions & Mass Range",
        description: "Minimum, maximum, and average carton/tote dimensions (L × W × H) and gross unit weights.",
        impactOnDesign: "Determines vacuum gripper plate surface area, zone valving, and robot payload sizing.",
      },
      {
        parameter: "Packaging Material & Surface Properties",
        description: "Material type (corrugated, plastic, shrink-wrap), porosity, tape placement, and top surface flatness.",
        impactOnDesign: "Dictates vacuum foam seal type, suction cup durometer, and blower vs. venturi ejector selection.",
      },
      {
        parameter: "Pallet Type & Stack Constraints",
        description: "Pallet dimensions (EUR, US standard 48x40, custom), maximum stack height, overhang limits, and slip-sheet specs.",
        impactOnDesign: "Determines robot vertical reach, pedestal riser height, and recipe pattern programming.",
      },
      {
        parameter: "Plant Layout & Logistics Flow",
        description: "Available floor footprint, in-feed conveyor orientation, stretch-wrapper interface, and AMR path clearance.",
        impactOnDesign: "Guides layout safety fencing design, conveyor transfer geometry, and AMR fleet pathing.",
      },
    ],
    testingAndValidation: [
      {
        phase: "Phase 1",
        name: "Vacuum Seal & Porosity Audit",
        description: "Bench testing customer carton samples with various vacuum flow rates and foam seal densities.",
        acceptanceCriteria: "Minimum 2.5x safety retention factor under maximum dynamic tilt and acceleration.",
      },
      {
        phase: "Phase 2",
        name: "Full-Rate Dry Cycle & Pattern Check",
        description: "Executing complete 2,400 mm pallet stacking routines with empty and loaded test boxes.",
        acceptanceCriteria: "Zero carton collisions, stable interlocked layer pattern, and cycle takt matching specification.",
      },
      {
        phase: "Phase 3",
        name: "AMR Docking & Navigation Verification",
        description: "Autonomous navigation through congested path with dynamic human and obstacle avoidance.",
        acceptanceCriteria: "100% successful docks within ±5 mm tolerance; zero safety laser stop failures.",
      },
      {
        phase: "Phase 4",
        name: "Site Acceptance Testing (SAT)",
        description: "Live end-of-line production shift test running continuous factory output into automated warehouse.",
        acceptanceCriteria: "8-hour continuous run meeting target throughput with zero dropped boxes and clean WMS logging.",
      },
    ],
    typicalApplications: [
      "End-of-line mixed-SKU carton palletizing and layer card insertion",
      "Automated depalletizing and singulation for e-commerce fulfillment centers",
      "Machine tool blank loading from heavy steel stillages and wire baskets",
      "AMR line-side delivery of tote boxes and sub-assemblies in automotive plants",
      "High-speed food carton sorting and case packing into corrugated shippers",
    ],
    benefits: [
      {
        title: "Ergonomic Elimination of Injury",
        description: "Replaces heavy manual lifting of 20–50 kg cartons with continuous 24/7 automated robotic pacing.",
      },
      {
        title: "Interlocked Pallet Stability",
        description: "Optimized software stacking patterns eliminate package overhang and transport load shifts.",
      },
      {
        title: "Autonomous Floor Logistics",
        description: "AMR transfer eliminates busy forklift traffic in narrow assembly aisles, improving shopfloor safety.",
      },
    ],
    relatedProducts: [
      {
        name: "Heavy Palletizing Cobot Arm (20kg Payload)",
        category: "Robotic Systems",
        href: "/products/robotic-systems/ind-rob-cobot-20kg-pallet",
        specs: "20 kg payload • 1,700 mm reach • Rapid deployment",
      },
      {
        name: "500kg Omnidirectional AMR Mobile Chassis Platform",
        category: "Mobility Systems",
        href: "/products/mobility-systems/ind-mob-chassis-amr-500",
        specs: "500 kg payload • Natural LiDAR SLAM • Omnidirectional drive",
      },
      {
        name: "Electric Scissor Pallet Lift Module (1200kg)",
        category: "Mobility Systems",
        href: "/products/mobility-systems/ind-mob-lift-scissor",
        specs: "1,200 kg capacity • 120 mm lift • Integrated roller deck",
      },
      {
        name: "Autonomous Mobile Robot Navigation & Fleet Gateway",
        category: "Control & Drives",
        href: "/products/control-drives/ind-ctl-amr-fleet-gateway",
        specs: "VDA 5050 v2.0 • Fleet Manager API • Sub-millimeter docking",
      },
    ],
    relatedIndustries: [
      {
        name: "Warehouse & Logistics",
        slug: "warehousing",
        href: "/applications/warehousing",
        applicationExample: "High-throughput palletizing cells and AMR automated cross-dock transport.",
      },
      {
        name: "Packaging & Consumer Goods",
        slug: "packaging",
        href: "/applications/packaging",
        applicationExample: "High-speed case packing, carton accumulation, and pallet wrapping.",
      },
      {
        name: "Food & Beverage",
        slug: "foodBeverage",
        href: "/applications/foodBeverage",
        applicationExample: "Washdown palletizing of beverage cases and bulk ingredient sack handling.",
      },
    ],
    resources: [
      {
        title: "Robotic Palletizing Sizing & Reach Calculator Guide",
        type: "Engineering Application Note",
        href: "/resources?type=app-note",
        description: "How to calculate robot wrist moment, stack envelope, and throughput for carton palletizers.",
      },
      {
        title: "Industrial AMR Fleet Deployment Architecture (VDA 5050)",
        type: "Technical Whitepaper",
        href: "/resources?type=whitepaper",
        description: "Standards and network prerequisites for managing multi-vendor AMR fleets on factory floors.",
      },
    ],
    faqs: [
      {
        question: "How do your vacuum grippers handle porous or taped corrugated cartons without dropping them?",
        answer: "We engineer multi-zone vacuum heads utilizing high-flow venturi multistage generators combined with integrated self-closing check valves. When a suction zone is uncovered or encounters porosity, its valve automatically chokes flow, preventing system-wide vacuum loss and maintaining full retention on the gripped zones.",
      },
      {
        question: "Can our plant operators create new pallet patterns without calling a robot programmer?",
        answer: "Yes. Our systems feature an intuitive graphical pallet pattern generator running directly on the cell HMI. Operators simply enter box length, width, height, and desired pallet layout. The software automatically computes layer interlocking, robot approach vectors, and gripper clearance without manual coordinate teaching.",
      },
      {
        question: "How do your AMRs navigate without magnetic floor tape or wall reflectors?",
        answer: "Our AMRs utilize natural-feature LiDAR SLAM (Simultaneous Localization and Mapping) combined with wheel odometry and IMU sensors. The robot creates a digital map of permanent facility walls and pillars, continuously updating its relative position in real-time and dynamically routing around unexpected obstacles like dropped boxes or people.",
      },
      {
        question: "What payload sizes can your robotic material handling systems accommodate?",
        answer: "Our standard cell architectures accommodate carton payloads from 2 kg up to 50 kg in high-speed case handling, and bulk heavy palletizing payloads up to 800 kg per pick cycle using heavy-duty 4-axis industrial articulated arms.",
      },
    ],
  },

  // 5. PRECISION POSITIONING
  {
    id: "precision-positioning",
    title: "Precision Positioning",
    badge: "Direct-Drive Stages, Sub-Micron Metrology & Optical Alignment",
    heroSubtitle: "High-stiffness rotary indexing tables, direct-drive linear stages, and optical metrology positioning with verified repeatability.",
    shortDescription: "Sub-micron direct-drive linear stages, air-bearing gantries, and zero-backlash rotary indexing tables engineered for semiconductor, optics, and metrology.",
    systemScope: {
      included: [
        "Direct-drive brushless rotary tables (frameless torque motors with precision cross-roller bearings)",
        "Ironless linear motor direct-drive stages with zero cogging and rapid step-and-settle response",
        "High-resolution absolute optical linear and circular scales (sub-nanometer interpolation resolution)",
        "Precision metrology granite bases, meehanite castings, and passive/active vibration isolation mounts",
        "Advanced digital servo drives with cogging torque compensation and friction feedforward tables",
        "Factory calibration reports with laser interferometer pitch, yaw, and straightness error maps",
      ],
      plantInterfaceRequired: [
        "Temperature-stabilized environment (ideally ±1.0°C or cleaner for sub-micron verification)",
        "Vibration-isolated foundation (VC-A through VC-E rating depending on precision class)",
        "Clean, dry instrument air supply (0.5–0.7 MPa, oil-free Class 1:2:1) if utilizing air bearings",
        "Cleanroom-compatible utility connections and high-flex shielded encoder cabling",
      ],
    },
    challenge: {
      title: "The Precision Positioning Challenge",
      description:
        "High-technology manufacturing in semiconductor wafer inspection, flat-panel lithography, laser micromachining, and optical fiber alignment requires position repeatability measured in microns or sub-microns. Traditional mechanical drivetrains (such as ball screws, timing belts, and worm gearboxes) suffer from backlash, torsional windup, stick-slip friction, Abbe angular error, and thermal elongation.",
      bulletPoints: [
        "Backlash and lost motion when reversing direction in mechanical gearboxes and leadscrews",
        "Stick-slip friction at low micro-stepping velocities causing erratic velocity ripple",
        "Abbe error: small angular pitch/yaw tilts amplified into large linear measurement errors at the workpiece",
        "Thermal expansion of mechanical drivetrains during high-duty continuous operation",
        "Long settling times (> 100 ms) delaying inspection camera acquisition cycles",
      ],
    },
    approach: {
      title: "Our Engineering Approach",
      description:
        "INDUS eliminates mechanical transmission error by utilizing direct-drive architecture. Ironless linear motors and frameless brushless torque motors transmit force directly to the moving payload without intervening gears or screws. We align measurement scales collinear with the motion axis to minimize Abbe errors, mount stages on high-damping granite bases, and apply digital error-mapping matrices.",
      bulletPoints: [
        "Direct-drive ironless linear motors providing zero cogging force and frictionless acceleration",
        "Absolute optical scales providing up to 1 nm linear resolution and 0.01 arcsec rotary resolution",
        "Strict adherence to Abbe alignment principles to prevent angular tilt error magnification",
        "Laser interferometer calibration mapping 21 geometric error parameters directly into drive firmware",
        "High-bandwidth digital servo loops achieving settling times under 15 ms within a 50 nm window",
      ],
    },
    technologiesUsed: [
      "Direct-Drive Brushless Torque Motors",
      "Ironless Linear Motors (Zero Cogging)",
      "Sub-Nanometer Optical Linear Scales",
      "Laser Interferometer Metrology",
      "Precision Crossed-Roller Bearings",
      "Dynamic Friction & Cogging Feedforward",
    ],
    systemArchitecture: [
      {
        step: "01",
        title: "Metrology Base & Mechanical Guidance",
        description: "Natural granite or stress-relieved casting provides high thermal inertia; precision linear rails or air bearings guide motion.",
        signalFlow: "Rigid Base -> Low-Friction Rail -> Moving Carriage -> Collinear Scale Alignment",
      },
      {
        step: "02",
        title: "Direct-Drive Electromagnetic Actuation",
        description: "Ironless coils interact with rare-earth permanent magnet tracks, generating force directly in the line of travel with zero wear.",
        signalFlow: "Servo PWM Bridge -> 3-Phase Sinusoidal Current -> Lorentz Force Direct Drive",
      },
      {
        step: "03",
        title: "Ultra-High-Resolution Optical Feedback",
        description: "Pure serial optical readheads detect holographic scale gratings, outputting position updates to the drive at multi-megahertz rates.",
        signalFlow: "Optical Scale Grating -> BiSS-C Serial Interface -> Servo Position Loop (4 kHz)",
      },
      {
        step: "04",
        title: "Error-Compensated Trajectory Execution",
        description: "Controller applies 2D geometric error lookup tables and advanced notch filters to execute moves with minimal settling time.",
        signalFlow: "Target Position -> 21-DOF Error Matrix Offset -> Feedforward Filter -> Motor Power Null",
      },
    ],
    technicalSpecs: [
      {
        label: "Bidirectional Repeatability",
        value: "±0.25 µm (Linear) / ±1.0 arcsec (Rotary)",
        standard: "ISO 230-2 (Machine Tool Accuracy)",
        notes: "Verified via multi-pass laser interferometer testing across full working stroke.",
      },
      {
        label: "Feedback Resolution",
        value: "Up to 1.0 nm (Linear) / 0.01 arcsec (Rotary)",
        standard: "Holographic Optical Scale",
        notes: "Real-time digital interpolation with zero phase lag.",
      },
      {
        label: "Settling Time Envelope",
        value: "< 15 ms (within ±50 nm band)",
        standard: "Step-and-Settle Benchmark",
        notes: "Enabled by high mechanical natural frequency and tuned notch filtering.",
      },
      {
        label: "Velocity Stability (Ripple)",
        value: "< 0.05% at 50 mm/s",
        standard: "Ironless Linear Motor Standard",
        notes: "Zero magnetic cogging ensures smooth scanning without velocity fluctuations.",
      },
      {
        label: "Wobble & Runout (Rotary)",
        value: "< 1.5 µm Radial / Axial Runout",
        standard: "ISO 230-7 (Axis of Rotation)",
        notes: "Precision preloaded cross-roller bearing arrangement.",
      },
      {
        label: "Thermal Expansion Management",
        value: "Zero-CTE Invar Scale Mounts",
        standard: "Metrology Laboratory Class",
        notes: "Minimizes structural expansion under continuous electrical coil dissipation.",
      },
    ],
    engineeringInputs: [
      {
        parameter: "Stroke Length / Angular Travel Range",
        description: "Total linear travel distance (mm) or continuous rotary angle required for the application.",
        impactOnDesign: "Determines magnet track length, bearing spacing, and overall granite base dimensions.",
      },
      {
        parameter: "Payload Mass & Center of Gravity Location",
        description: "Weight and spatial dimensions of workpiece, fixture, optics, or sensors mounted to carriage.",
        impactOnDesign: "Influences bearing sizing, dynamic pitch/yaw moment stiffness, and motor continuous force rating.",
      },
      {
        parameter: "Allowable In-Position Tolerance & Settling Window",
        description: "Required positional accuracy window (e.g. ±100 nm) and maximum allowable settling duration.",
        impactOnDesign: "Guides encoder resolution selection, drive current loop bandwidth, and base vibration isolation.",
      },
      {
        parameter: "Thermal & Vibration Operating Environment",
        description: "Ambient temperature fluctuations (°C/hour), cleanroom class, and floor vibration spectrum (VC curves).",
        impactOnDesign: "Dictates whether passive elastomeric or active pneumatic vibration dampers are required.",
      },
    ],
    testingAndValidation: [
      {
        phase: "Phase 1",
        name: "Laser Interferometer Geometric Calibration",
        description: "Measuring linear positioning, pitch, yaw, roll, straightness, and squareness over full stroke.",
        acceptanceCriteria: "Full calibration certificate documenting ISO 230-2 mean positional error and bidirectional repeatability.",
      },
      {
        phase: "Phase 2",
        name: "Dynamic Step-and-Settle Verification",
        description: "High-bandwidth capacitive sensor measuring settling time during rapid 10 mm step-and-hold profiles.",
        acceptanceCriteria: "Carriage settles within ±50 nm deadband in under 15 ms without lingering oscillatory ringing.",
      },
      {
        phase: "Phase 3",
        name: "Constant Velocity Scanning Stability",
        description: "Laser Doppler vibrometer tracking carriage velocity ripple during low-speed scanning.",
        acceptanceCriteria: "Velocity ripple < 0.05% RMS across full test trajectory.",
      },
      {
        phase: "Phase 4",
        name: "Factory Acceptance Testing (FAT)",
        description: "Customer witness testing of stage operating with customer sample fixtures and metrology software.",
        acceptanceCriteria: "100% sign-off on repeatability certificates, thermal stability run, and cleanroom packaging.",
      },
    ],
    typicalApplications: [
      "Semiconductor wafer defect inspection and metrology stages",
      "Laser micro-machining, stent cutting, and PCB via drilling",
      "Optical component alignment and fiber optic active coupling",
      "Coordinate Measuring Machine (CMM) high-precision probe indexing",
      "Diamond turning and ultra-precision surface profilometry",
    ],
    benefits: [
      {
        title: "Zero Mechanical Backlash",
        description: "Direct-drive coupling provides infinite bi-directional resolution without gear play or lost motion.",
      },
      {
        title: "Ultra-Fast Step & Settle",
        description: "High system stiffness and low moving mass enable inspection cameras to capture images faster.",
      },
      {
        title: "Maintenance-Free Lifetime",
        description: "Non-contact electromagnetic motor coils eliminate wear, particulate generation, and periodic relubrication.",
      },
    ],
    relatedProducts: [
      {
        name: "IND-PR-SW100 Cup Harmonic Reducer",
        category: "Motion & Actuation",
        href: "/products/motion-actuation/ind-pr-sw-cup-set",
        specs: "Zero backlash • High torsional stiffness • Compact hollow bore",
      },
      {
        name: "High-Performance IPC Robot Controller",
        category: "Control & Drives",
        href: "/products/control-drives/ind-ctl-ipc-realtime-master",
        specs: "250 µs deterministic loop • Multi-axis trajectory engine",
      },
      {
        name: "64-Axis Deterministic EtherCAT Motion Controller",
        category: "Control & Drives",
        href: "/products/control-drives/ind-ctl-64axis-ethercat-motion",
        specs: "Sub-microsecond synchronization • Advanced trajectory generator",
      },
      {
        name: "Multi-Axis Cartesian Linear Gantry Robot",
        category: "Robotic Systems",
        href: "/products/robotic-systems/ind-rob-cartesian-gantry",
        specs: "High-rigidity gantry stages • Precision linear guidance",
      },
    ],
    relatedIndustries: [
      {
        name: "Electronics & Semiconductor",
        slug: "electronics",
        href: "/applications/electronics",
        applicationExample: "Wafer inspection stages and automated die bonding positioning.",
      },
      {
        name: "Aerospace & Defense",
        slug: "aerospace",
        href: "/applications/aerospace",
        applicationExample: "Precision optical mirror positioning and gyro sensor calibration.",
      },
      {
        name: "Medical Devices",
        slug: "medical",
        href: "/applications/medical",
        applicationExample: "Laser catheter micromachining and automated laboratory metrology.",
      },
    ],
    resources: [
      {
        title: "Direct-Drive Stage Metrology & Abbe Error Handbook",
        type: "Technical Whitepaper",
        href: "/resources?type=whitepaper",
        description: "Comprehensive engineering breakdown of Abbe offset, geometric error compensation, and laser calibration.",
      },
      {
        title: "Sub-Micron Motion Tuning & Frequency Analysis",
        type: "Application Note",
        href: "/resources?type=app-note",
        description: "Methods for tuning ironless linear motors, settling time optimization, and notch filter setup.",
      },
    ],
    faqs: [
      {
        question: "What is the difference between accuracy, repeatability, and resolution in positioning systems?",
        answer: "Resolution is the smallest detectable movement increment reported by the scale (e.g. 1 nm). Repeatability is the system's ability to return to the exact same commanded position multiple times under identical conditions (typically ±0.25 µm). Absolute accuracy is the true geometric correspondence between commanded distance and actual physical distance traveled across the full stroke after laser calibration.",
      },
      {
        question: "How do you minimize Abbe error in multi-axis precision stages?",
        answer: "Abbe error occurs when the measurement scale is offset laterally from the point of interest (workpiece), causing tiny angular tilts (pitch, yaw) to be amplified into significant linear position errors. We design stages so that optical scales are mounted collinear with the load whenever possible, utilize wide-stance crossed-roller bearings to maximize angular stiffness, and map remaining angular errors into compensation firmware.",
      },
      {
        question: "Can direct-drive stages operate in cleanroom vacuum environments?",
        answer: "Yes. We offer vacuum-prepared stages compatible with high-vacuum (HV) and ultra-high-vacuum (UHV, down to 10⁻⁷ mbar) environments. These configurations feature vacuum-degassed epoxy coils, stainless steel magnet tracks, low-outgassing cabling, and cleanroom-certified lubricants.",
      },
      {
        question: "Why are granite bases preferred over welded steel or aluminum for metrology stages?",
        answer: "Granite possesses exceptional structural properties for precision positioning: it has a very low coefficient of thermal expansion, high internal damping that attenuates mechanical vibrations, and zero internal stresses, preventing the gradual geometric warping that affects welded metal structures.",
      },
    ],
  },

  // 6. CUSTOM ENGINEERING
  {
    id: "custom-engineering",
    title: "Custom Engineering",
    badge: "Engineered-to-Order Subsystems & Specialized OEM Drivetrains",
    heroSubtitle: "Engineered-to-order robotic joint modules, custom actuation, specialized mechanical fixturing, and tailored OEM drivetrains.",
    shortDescription: "Design, FEA simulation, prototyping, and turnkey manufacturing of custom robotic drivetrains and specialized automation hardware.",
    systemScope: {
      included: [
        "Mechanical and electrical requirements discovery and kinematic feasibility analysis",
        "3D CAD design, Finite Element Analysis (FEA) structural stiffness, and thermal dissipation modeling",
        "Engineered-to-order robotic joint modules (frameless motors + harmonic gearing + dual encoders)",
        "Custom end-of-arm tooling, vacuum manifolds, and specialized robotic fixtures",
        "Physical prototype machining, dynamic dynamometer testing, and environmental burn-in",
        "Comprehensive documentation: 3D STEP models, EPLAN schematics, BOM, and FAT/SAT test records",
      ],
      plantInterfaceRequired: [
        "Detailed CAD space envelope (STEP model) defining customer mounting boundaries and keep-out zones",
        "Explicit operating duty cycle, continuous and peak torque/force envelopes, and life expectation",
        "Customer electrical bus voltage, communication protocol preference, and connector pinouts",
        "Customer sign-off on engineering milestone design reviews (PDR, CDR, and FAT protocols)",
      ],
    },
    challenge: {
      title: "The Custom Engineering Challenge",
      description:
        "Off-the-shelf catalogue components are designed for general applications and often fail to satisfy extreme dimensional restrictions, unusual high-temperature or vacuum environments, or specialized weight constraints. Forcing catalogue hardware into tight OEM machines results in compromised payload capacity, overheating, inefficient power draw, and expensive packaging workarounds.",
      bulletPoints: [
        "Rigid catalogue dimensions exceeding allowable space claims in proprietary machines",
        "Excessive weight of standard components limiting dynamic acceleration on moving robot wrists",
        "Inadequate environmental ratings for high-vacuum, cryogenic, or aggressive chemical washdown",
        "Non-standard bus voltages (e.g. 24V/48V mobile DC vs standard 400V industrial AC)",
        "Suppliers unwilling to provide tailored gear ratios, custom motor windings, or integrated sensors",
      ],
    },
    approach: {
      title: "Our Engineering Approach",
      description:
        "INDUS bridges the gap between catalog hardware and custom machine requirements through a disciplined, stage-gated engineering process. We design purpose-built mechatronic assemblies that integrate frameless torque motors, zero-backlash harmonic reducers, and high-resolution encoders into ultra-compact, lightweight housings tailored to your space claim.",
      bulletPoints: [
        "Stage-Gated Engineering Lifecycle: Discovery -> PDR -> CDR -> Prototyping -> FAT Validation",
        "Finite Element Analysis (FEA) optimizing structural rigidity while minimizing moving mass",
        "Custom electromagnetic motor winding designs matching exact voltage and speed requirements",
        "Precision CNC machining in aerospace-grade aluminum and stainless alloys with strict CMM inspection",
        "Full transparent engineering deliverables: CAD models, test data, and certification documentation",
      ],
    },
    technologiesUsed: [
      "FEA Structural & Thermal Simulation",
      "Frameless Brushless Torque Kits",
      "Tailored Harmonic & Cycloidal Gearing",
      "Aerospace-Grade Alloy Machining",
      "Integrated Dual-Encoder Feedback",
      "Stage-Gated Project Management",
    ],
    systemArchitecture: [
      {
        step: "01",
        title: "Requirements Discovery & Boundary Definition",
        description: "Analyze space claims, dynamic loading profiles, power constraints, and environmental requirements.",
        signalFlow: "Customer Spec -> Kinematic Model -> Torque-Speed-Inertia Matching Matrix",
      },
      {
        step: "02",
        title: "Detailed 3D CAD & FEA Simulation",
        description: "Design structural housings, shaft interfaces, and thermal heatsinks; verify structural deflections under load.",
        signalFlow: "Parametric 3D CAD -> Ansys FEA Simulation -> Thermal Dissipation Verification",
      },
      {
        step: "03",
        title: "Precision Machining & Assembly",
        description: "Manufacture components via 5-axis CNC machining, assemble in cleanroom cell with calibrated preload.",
        signalFlow: "CNC Fabrication -> CMM Dimensional Inspection -> Precision Cleanroom Assembly",
      },
      {
        step: "04",
        title: "Dynamometer Testing & Validation",
        description: "Subject completed module to dynamic dynamometer loading, thermal continuous runs, and FAT protocol sign-off.",
        signalFlow: "Dynamometer Test Bench -> Real-Time Torque Curve Logging -> FAT Sign-Off",
      },
    ],
    technicalSpecs: [
      {
        label: "Torque Density Ratio",
        value: "Up to 120 Nm/kg",
        standard: "Optimized Hollow-Shaft Joint",
        notes: "Combines frameless torque motor and integrated harmonic gearing in lightweight housing.",
      },
      {
        label: "FEA Structural Rigidity",
        value: "< 5.0 µm Deflection under Load",
        standard: "Finite Element Analysis (FEA)",
        notes: "Verified at maximum dynamic rated overturning moment.",
      },
      {
        label: "Operating Temperature Range",
        value: "-40°C to +85°C (Custom Available)",
        standard: "Aerospace / Industrial Range",
        notes: "Specialized cryogenic, radiation-tolerant, and high-vacuum configurations on request.",
      },
      {
        label: "Feedback Integration",
        value: "Dual Absolute Encoders",
        standard: "BiSS-C / SSI Interface",
        notes: "Input motor speed feedback + output direct joint position feedback.",
      },
      {
        label: "Bearing Arrangement",
        value: "Integrated Preloaded Cross-Roller",
        standard: "High Moment Rigidity",
        notes: "Absorbs simultaneous radial, axial, and tilting moment loads.",
      },
      {
        label: "Design Deliverables",
        value: "Full STEP Models & Test Dossier",
        standard: "ISO 9001 Traceability",
        notes: "Complete manufacturing drawings, BOM, and individual test calibration reports.",
      },
    ],
    engineeringInputs: [
      {
        parameter: "Geometric Space Envelope (CAD Claim)",
        description: "3D STEP CAD model defining allowable physical boundaries, bolt patterns, and shaft centerlines.",
        impactOnDesign: "Constrains overall module diameter, length, and hollow-bore routing dimensions.",
      },
      {
        parameter: "Torque, Velocity & Duty Cycle Profile",
        description: "Continuous rated torque, peak acceleration torque, maximum RPM, and duty cycle (time on vs time off).",
        impactOnDesign: "Determines motor electromagnetic sizing, gear module reduction ratio, and heatsink area.",
      },
      {
        parameter: "Power Supply & Bus Constraints",
        description: "Available DC bus voltage (e.g. 24V, 48V, 320V) and maximum allowable current draw.",
        impactOnDesign: "Guides custom motor winding resistance (R) and inductance (L) optimization.",
      },
      {
        parameter: "Project Milestones & Production Quantities",
        description: "Target prototype delivery schedule, design review gates, and forecasted annual production volumes.",
        impactOnDesign: "Influences manufacturing tooling choices (additive vs billet machining vs casting tooling).",
      },
    ],
    testingAndValidation: [
      {
        phase: "Phase 1",
        name: "Preliminary Design Review (PDR)",
        description: "Presentation of concept kinematics, preliminary 3D models, FEA deflection, and torque calculations.",
        acceptanceCriteria: "Customer engineering sign-off on space claim, electrical interfaces, and performance envelope.",
      },
      {
        phase: "Phase 2",
        name: "Critical Design Review (CDR)",
        description: "Final manufacturing drawings freeze, full thermal simulation, BOM lock, and component procurement release.",
        acceptanceCriteria: "Customer freeze on all manufacturing drawings and agreed FAT test protocols.",
      },
      {
        phase: "Phase 3",
        name: "Dynamometer & Functional Burn-In",
        description: "Testing physical prototype on computer-controlled dynamometer test bench across full torque-speed curve.",
        acceptanceCriteria: "Module delivers rated torque without exceeding thermal limits; continuous 24-hour burn-in verified.",
      },
      {
        phase: "Phase 4",
        name: "Factory Acceptance Testing (FAT)",
        description: "Customer witness testing of completed custom assembly checking dimensions, noise, and backlash.",
        acceptanceCriteria: "Full compliance with agreed specification document and delivery of engineering dossier.",
      },
    ],
    typicalApplications: [
      "Custom robotic arm joint actuators with integrated hollow bores for surgical tools",
      "Specialized high-torque rotary indexers for downhole and subsea inspection tools",
      "Compact motorized gimbal mounts for aerospace optical surveillance pods",
      "Custom electric wheel drives for specialized AGV platforms with tight height constraints",
      "Application-specific end effectors with tailored gripping fingers and embedded sensors",
    ],
    benefits: [
      {
        title: "Exact Spatial Compliance",
        description: "Modules fit precisely into your existing machine envelope without bulky adapters or compromises.",
      },
      {
        title: "Optimized Power-to-Weight",
        description: "FEA mass optimization reduces inertias, allowing smaller motors and higher operating accelerations.",
      },
      {
        title: "Intellectual Property Protection",
        description: "Purpose-built proprietary designs provide competitive differentiation and secure supply chains.",
      },
    ],
    relatedProducts: [
      {
        name: "IND-PR-SW100 Cup Harmonic Reducer",
        category: "Motion & Actuation",
        href: "/products/motion-actuation/ind-pr-sw-cup-set",
        specs: "Zero backlash • Customizable reduction ratios • High torque density",
      },
      {
        name: "High-Performance IPC Robot Controller",
        category: "Control & Drives",
        href: "/products/control-drives/ind-ctl-ipc-realtime-master",
        specs: "Custom kinematics support • RT-Linux • Multiple fieldbuses",
      },
      {
        name: "6-Axis Robot Controller Cabinet with Teach Pendant",
        category: "Control & Drives",
        href: "/products/control-drives/ind-ctl-6axis-pendant-cabinet",
        specs: "Custom teach pendant software • Modular safety I/O",
      },
      {
        name: "IND-PR-RVE Solid-Output RV Reducer",
        category: "Motion & Actuation",
        href: "/products/motion-actuation/ind-pr-rv-solid-e",
        specs: "Heavy shock load resistance • Zero backlash",
      },
    ],
    relatedIndustries: [
      {
        name: "Aerospace & Defense",
        slug: "aerospace",
        href: "/applications/aerospace",
        applicationExample: "Custom lightweight actuator pods and radar gimbal drives.",
      },
      {
        name: "Medical Devices",
        slug: "medical",
        href: "/applications/medical",
        applicationExample: "Custom surgical robot joint actuators with microsecond haptic feedback.",
      },
      {
        name: "Automotive Manufacturing",
        slug: "automotive",
        href: "/applications/automotive",
        applicationExample: "Custom multi-spindle nutrunners and specialized robotic press fixtures.",
      },
    ],
    resources: [
      {
        title: "Engineered-to-Order Drivetrain Design Methodology",
        type: "Engineering Process Brief",
        href: "/resources?type=whitepaper",
        description: "Overview of INDUS stage-gated custom development, FEA guidelines, and dynamometer qualification.",
      },
      {
        title: "Thermal Management in Compact Robotic Joint Modules",
        type: "Application Note",
        href: "/resources?type=app-note",
        description: "Thermal modeling techniques for enclosed brushless frameless motors and harmonic reducers.",
      },
    ],
    faqs: [
      {
        question: "What is the typical development timeline for a custom engineering actuator project?",
        answer: "A standard custom mechatronic project proceeds through four phases: Discovery & PDR (weeks 1–3), Detailed Design & CDR (weeks 4–6), Prototype Machining & Assembly (weeks 7–11), and Dynamometer Testing & FAT (weeks 12–14). Critical fast-track projects can be compressed depending on component availability.",
      },
      {
        question: "What minimum order quantities (MOQ) do you require for custom engineering?",
        answer: "We support prototype quantities starting from a single unit (N=1) for initial customer R&D and qualification, with a structured pathway scaling to pre-series (10–50 units) and annual serial production runs (100–1,000+ units/year).",
      },
      {
        question: "Who retains intellectual property (IP) rights for custom-engineered components?",
        answer: "Custom project agreements clearly delineate IP boundaries. Any client-specific machine interfaces, custom fixturing geometries, and proprietary process parameters remain 100% the intellectual property of the customer, while INDUS background design know-how is licensed for your application.",
      },
      {
        question: "What engineering deliverables are provided upon project completion?",
        answer: "We provide a complete engineering dossier including 3D STEP models, 2D manufacturing drawings, EPLAN electrical schematics, thermal simulation and FEA reports, complete bill of materials (BOM), and certified dynamometer test run data with individual calibration sheets.",
      },
    ],
  },
];

// Backwards-compatible aliases mapping legacy route slugs to canonical solutions
export const SOLUTION_ALIASES: Record<string, string> = {
  "factory-automation": "machine-integration",
  "smart-manufacturing": "machine-integration",
  "mobile-robotics": "material-handling",
  "custom-robotics": "custom-engineering",
  "motion-control": "motion-control",
  "robotic-automation": "robotic-automation",
  "machine-integration": "machine-integration",
  "material-handling": "material-handling",
  "precision-positioning": "precision-positioning",
  "custom-engineering": "custom-engineering",
};

export const solutionsData: SolutionItem[] = canonicalSolutionsData;

import { getSegmentSolution } from "./segmentsData";

export const getSolution = (id: string): SolutionItem | undefined => {
  // 1. Direct match in canonical solutions
  const directMatch = canonicalSolutionsData.find((s) => s.id === id);
  if (directMatch) return directMatch;

  // 2. Alias resolution for legacy routes
  const aliasId = SOLUTION_ALIASES[id];
  if (aliasId) {
    const aliasMatch = canonicalSolutionsData.find((s) => s.id === aliasId);
    if (aliasMatch) return aliasMatch;
  }

  // 3. Segment solution fallback
  const segment = getSegmentSolution(id);
  if (!segment) return undefined;

  return {
    id: segment.id,
    title: segment.title,
    badge: segment.badge,
    shortDescription: segment.overview,
    heroSubtitle: segment.subtitle,
    systemScope: {
      included: segment.productionTasks.map((t) => t.taskName),
      plantInterfaceRequired: [
        segment.systemLevelArchitecture.fieldbusTopology,
        segment.systemLevelArchitecture.safetyIntegrity,
      ],
    },
    challenge: {
      title: `${segment.title} Engineering Constraints`,
      description: segment.overview,
      bulletPoints: segment.productionTasks.map((t) => `${t.taskName}: ${t.mechanicalConstraints}`),
    },
    approach: {
      title: "Deterministic Robotic Execution",
      description: `Integrated motion control and precision kinematics engineered for ${segment.badge}.`,
      bulletPoints: segment.productionTasks.map((t) => `${t.taskName}: ${t.motionRequirements}`),
    },
    technologiesUsed: Array.from(new Set(segment.productionTasks.flatMap((t) => t.requiredTechnology))),
    systemArchitecture: segment.productionTasks.map((t, idx) => ({
      step: `0${idx + 1}`,
      title: t.taskName,
      description: `${t.motionRequirements} Control: ${t.controlArchitecture}. Verification: ${t.verificationMethod}`,
      signalFlow: `${t.controlArchitecture} -> ${t.verificationMethod}`,
    })),
    technicalSpecs: [
      {
        label: "Kinematic Target",
        value: segment.systemLevelArchitecture.throughputTarget,
        standard: "ISO 9283 / Cell Spec",
        notes: segment.systemLevelArchitecture.mechanicalEnvelope,
      },
      {
        label: "Fieldbus Architecture",
        value: segment.systemLevelArchitecture.fieldbusTopology,
        standard: "Real-Time Industrial Ethernet",
        notes: "Synchronized cycle integration",
      },
      {
        label: "Safety Integrity",
        value: segment.systemLevelArchitecture.safetyIntegrity,
        standard: "ISO 13849-1 / ISO 10218",
        notes: "Dual-channel safety circuits",
      },
    ],
    engineeringInputs: [
      {
        parameter: "Production Task Requirements",
        description: "Process cycle times, component tolerances, and inspection requirements.",
        impactOnDesign: "Determines robot kinematic reach, payload, and tool changers.",
      },
    ],
    testingAndValidation: [
      {
        phase: "Phase 1",
        name: "Kinematic Verification",
        description: "Validating multi-axis trajectory and mechanical stiffness under full payload.",
        acceptanceCriteria: "ISO 9283 compliance with agreed repeatability tolerances.",
      },
    ],
    typicalApplications: segment.productionTasks.map((t) => t.taskName),
    benefits: [
      {
        title: "Mechanical Precision & Rigidity",
        description: segment.systemLevelArchitecture.mechanicalEnvelope,
      },
      {
        title: "Deterministic Fieldbus Synchronization",
        description: segment.systemLevelArchitecture.fieldbusTopology,
      },
      {
        title: "Certified Safety Architecture",
        description: segment.systemLevelArchitecture.safetyIntegrity,
      },
      {
        title: "Automated Throughput Benchmark",
        description: segment.systemLevelArchitecture.throughputTarget,
      },
    ],
    relatedProducts: [
      {
        name: "6-Axis Heavy Payload Robot",
        category: "Robotic Systems",
        href: "/products/robotic-systems/ind-rob-cobot-20kg-pallet",
        specs: "High payload • ISO 10218-1 certified",
      },
      {
        name: "Cycloidal Pin-Wheel Reducer",
        category: "Motion & Actuation",
        href: "/products/motion-actuation/ind-pr-rv-solid-e",
        specs: "High torsional rigidity • Zero backlash",
      },
      {
        name: "High-Performance IPC Controller",
        category: "Control & Drives",
        href: "/products/control-drives/ind-ctl-ipc-realtime-master",
        specs: "Intel Core i7 • Deterministic EtherCAT",
      },
    ],
    relatedIndustries: [
      {
        name: segment.title,
        slug: segment.slug,
        href: `/applications/${segment.slug}`,
        applicationExample: segment.subtitle,
      },
    ],
    resources: [
      {
        title: `${segment.title} Engineering Blueprint`,
        type: "Datasheet",
        href: "/resources",
      },
      {
        title: "Motion Controller Telemetry Guide",
        type: "Application Note",
        href: "/resources",
      },
    ],
    faqs: [
      {
        question: `How does INDUS deploy ${segment.title} solutions?`,
        answer: `We utilize our modular automation architecture to configure kinematics, fieldbuses, and tooling tailored directly to ${segment.title} requirements.`,
      },
    ],
  };
};
