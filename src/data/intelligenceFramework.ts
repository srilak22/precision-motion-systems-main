/**
 * INDUS Robotics Intelligence Educational Framework (Level 0 to Level 5)
 * 
 * IMPORTANT NOTICE:
 * This 6-tier classification is an INDUS educational framework designed for
 * mechatronic understanding, component selection, and system scoping. It is NOT
 * a universally standardized ISO/IEC classification. Deterministic safety-rated
 * systems (ISO 13849-1 / IEC 62061) operate orthogonally across all levels.
 */

export interface IntelligenceLevelDefinition {
  levelNumber: number;
  levelCode: string;
  title: string;
  subtitle: string;
  purposeAndCapabilities: string;
  kinematicAndAlgorithmicRole: string;
  requiredComponents: string[];
  inputSignals: {
    signal: string;
    type: string;
    typicalBandwidth: string;
    protocol: string;
  }[];
  outputSignals: {
    signal: string;
    type: string;
    typicalBandwidth: string;
    protocol: string;
  }[];
  exampleIndustrialTasks: string[];
  exampleSystemArchitecture: {
    sensorInput: string;
    processingUnit: string;
    actuatorOutput: string;
    latencyBudget: string;
  };
  dependenciesAndLimitations: string[];
  relatedProductRanges: { name: string; href: string }[];
  relevantApplicationAreas: { name: string; href: string }[];
  safetyInteraction: string;
}

export const INTELLIGENCE_LEVELS: IntelligenceLevelDefinition[] = [
  {
    levelNumber: 0,
    levelCode: "Level 0",
    title: "Mechanical Transmission & Structural Rigidity",
    subtitle: "Pure physics, mechanical force transmission, and zero algorithmic computation",
    purposeAndCapabilities:
      "Transmits mechanical power, scales rotational speed and torque, supports radial/axial shaft moments, and determines the fundamental geometric precision and mechanical backlash of the system without software intervention.",
    kinematicAndAlgorithmicRole:
      "Deterministic mechanical physics. Governed by Hertzian contact stresses, elastic tooth deflection, friction coefficients, and thermal expansion. Has zero latency and infinite mechanical reliability up to yield stress.",
    requiredComponents: [
      "Strain-wave flexsplines & circular splines",
      "RV cycloidal pin-wheel assemblies",
      "Ground helical and planetary gear stages",
      "Precision preloaded crossed-roller bearings",
      "Elastomer and disc pack backlash-free couplings",
      "Linear guideways and ground ball screws",
    ],
    inputSignals: [
      {
        signal: "Mechanical Input Torque & Angular Velocity",
        type: "Mechanical Power (N·m, rad/s)",
        typicalBandwidth: "Instantaneous physical transmission",
        protocol: "Physical shaft key / clamping hub coupling",
      },
    ],
    outputSignals: [
      {
        signal: "Reduced Speed, Multiplied Output Torque & Reaction Moments",
        type: "Mechanical Kinetic Output (N·m, N)",
        typicalBandwidth: "Instantaneous physical transmission",
        protocol: "Output flange / solid shaft DIN ISO 9409-1",
      },
    ],
    exampleIndustrialTasks: [
      "Rigid position holding at wrist joint against 250 kg gravity moment",
      "Zero-backlash reversal during micro-dispensing adhesive bead paths",
      "Absorbing 400% momentary shock impact on spot welding gun closure",
    ],
    exampleSystemArchitecture: {
      sensorInput: "None (passive mechanical structure)",
      processingUnit: "None (strain and gear mesh physics)",
      actuatorOutput: "Transmitted torque to robot link arm",
      latencyBudget: "0 µs (speed of sound in steel ~5,000 m/s)",
    },
    dependenciesAndLimitations: [
      "Cannot compensate for mechanical manufacturing tolerances or wear through software",
      "Subject to torsional wind-up under dynamic torque acceleration spikes",
      "Thermal expansion alters tooth backlash and grease viscosity over extended shifts",
    ],
    relatedProductRanges: [
      { name: "Precision Reducers & Gearboxes", href: "/products/precision-reducers" },
      { name: "Bearings & Mechanical Transmission", href: "/products/mechanical" },
    ],
    relevantApplicationAreas: [
      { name: "Automotive Manufacturing", href: "/applications/automotive" },
      { name: "Metal Fabrication & Machining", href: "/applications/metalMachining" },
      { name: "Aerospace & Defence", href: "/applications/aerospace" },
    ],
    safetyInteraction:
      "Provides mechanical holding torque during e-stop; fail-safe electromagnetic holding brakes physically lock the shaft independent of software state.",
  },
  {
    levelNumber: 1,
    levelCode: "Level 1",
    title: "Actuation & Controlled Motion",
    subtitle: "Electromechanical energy conversion, current loops, and flux-vector regulation",
    purposeAndCapabilities:
      "Converts electrical current into calibrated dynamic Lorentz magnetic forces. Closes inner high-speed current (torque) loops and commutates brushless motors using field-oriented control (FOC).",
    kinematicAndAlgorithmicRole:
      "Inner loop deterministic electrical regulation. Eliminates torque ripple, regulates d-axis and q-axis stator currents, and performs space-vector pulse-width modulation (SVPWM) switching at high frequencies.",
    requiredComponents: [
      "Frameless brushless DC / AC synchronous motors",
      "Silicon carbide (SiC) or GaN power inverter stages",
      "Hall effect phase current transducers",
      "Motor shaft incremental resolvers / magnetic Hall sensors",
      "Dynamic regenerative braking dump resistors",
    ],
    inputSignals: [
      {
        signal: "Torque Setpoint (Iq reference) or Velocity Command",
        type: "Digital Setpoint Vector",
        typicalBandwidth: "1 kHz to 10 kHz loop update",
        protocol: "EtherCAT CoE (CiA 402) / CANopen",
      },
      {
        signal: "DC Bus High-Voltage DC Supply (24V - 800V)",
        type: "Electrical Power",
        typicalBandwidth: "Continuous DC bus capacitor reservoir",
        protocol: "Heavy DC bus busbars / cables",
      },
    ],
    outputSignals: [
      {
        signal: "3-Phase Pulse-Width Modulated Motor Voltages (U, V, W)",
        type: "High-Frequency Switched High-Current Power",
        typicalBandwidth: "16 kHz to 32 kHz PWM switching frequency",
        protocol: "Direct shielded stator windings",
      },
    ],
    exampleIndustrialTasks: [
      "High-cadence pick-and-place motor torque acceleration up to 25g",
      "Micro-stepping positioning on optical linear stages",
      "Quasi-direct drive (QDD) dynamic transparency on legged robot hips",
    ],
    exampleSystemArchitecture: {
      sensorInput: "Phase shunt current sensors + motor rotor magnetic pole resolver",
      processingUnit: "FPGA / DSP Field-Oriented Control (FOC) current regulator",
      actuatorOutput: "3-Phase stator current exciting rotor permanent magnets",
      latencyBudget: "< 31.25 µs current loop execution cycle",
    },
    dependenciesAndLimitations: [
      "Depends strictly on clean, low-jitter motor shaft angle feedback for commutation",
      "Limited by motor winding thermal saturation (I²R copper losses and iron eddy losses)",
      "Cannot detect external tool collisions without secondary sensor feedback",
    ],
    relatedProductRanges: [
      { name: "Servo and Precision Motors", href: "/products/motors" },
      { name: "Servo Drives and Motor Drives", href: "/products/drives" },
      { name: "Integrated Robot Actuators", href: "/products/actuators" },
    ],
    relevantApplicationAreas: [
      { name: "Electronics & Semiconductor", href: "/applications/electronics" },
      { name: "Humanoid & Mobile Robotics", href: "/applications/humanoid" },
      { name: "Packaging & Consumer Goods", href: "/applications/packaging" },
    ],
    safetyInteraction:
      "Integrates certified Safe Torque Off (STO SIL 3 / PLe) disconnecting gate driver power pulses to the inverter bridge, guaranteeing zero torque generation without cutting main DC bus.",
  },
  {
    levelNumber: 2,
    levelCode: "Level 2",
    title: "Sensing & State Feedback",
    subtitle: "High-resolution kinematic position, force-torque, and environmental state estimation",
    purposeAndCapabilities:
      "Measures true physical states (joint angles, gearbox output deflection, tool contact forces, motor winding temperatures, and line voltages) and converts analog physics into digital feedback packets.",
    kinematicAndAlgorithmicRole:
      "Physical state observation and error estimation. Enables closed-loop feedback control by continuously calculating the error between commanded trajectory and actual physical pose.",
    requiredComponents: [
      "Absolute multi-turn optical and magnetic encoders (up to 24-bit)",
      "Multi-axis strain-gauge force-torque sensors (wrist F/T)",
      "Laser displacement triangulation sensors",
      "Thermal RTD (Pt100/Pt1000) winding sensors",
      "Inductive and capacitive proximity limit sensors",
    ],
    inputSignals: [
      {
        signal: "Physical displacement, strain, magnetic flux, or light interference",
        type: "Physical Analog Phenomenon",
        typicalBandwidth: "Continuous physical modulation",
        protocol: "Diffraction grating / strain bridge / optical disc",
      },
    ],
    outputSignals: [
      {
        signal: "Absolute Angular Position / Joint Force-Torque State",
        type: "Synchronous Serial Digital Telemetry",
        typicalBandwidth: "Up to 10 MHz serial clock, 1 µs latency",
        protocol: "BiSS-C, EnDat 2.2, SSI, HIPERFACE DSL",
      },
    ],
    exampleIndustrialTasks: [
      "Dual-encoder compensation measuring gearbox flexspline torsional deflection",
      "Sub-millinewton contact force sensing during delicate medical vial insertion",
      "Measuring thermal drift on machine tool spindles down to 0.5 µm",
    ],
    exampleSystemArchitecture: {
      sensorInput: "Photodiode array scanning etched chrome glass disc tracks",
      processingUnit: "Dedicated mixed-signal ASIC interpolator (4,096x interpolation)",
      actuatorOutput: "High-speed serial position telegram to servo drive controller",
      latencyBudget: "< 2.5 µs point-in-time position sampling",
    },
    dependenciesAndLimitations: [
      "Subject to optical disc contamination from oil droplets or moisture if not IP67 sealed",
      "Magnetic encoders susceptible to strong stray fields from resistance spot welders",
      "Strain gauges require continuous thermal zero-point drift recalibration",
    ],
    relatedProductRanges: [
      { name: "Sensors and Encoders", href: "/products/sensors" },
      { name: "Bearings & Mechanical Transmission", href: "/products/mechanical" },
    ],
    relevantApplicationAreas: [
      { name: "Medical Devices & Healthcare", href: "/applications/medical" },
      { name: "Pharmaceuticals & Life Sciences", href: "/applications/pharma" },
      { name: "Education, Research & Laboratories", href: "/applications/education" },
    ],
    safetyInteraction:
      "Redundant safety encoders with dual independent sensing tracks supply Safe Position (SLP) and Safe Speed (SLS) verification to safety controllers.",
  },
  {
    levelNumber: 3,
    levelCode: "Level 3",
    title: "Programmed Control & Coordinated Motion",
    subtitle: "Deterministic multi-axis kinematics, trajectory interpolation, and real-time fieldbuses",
    purposeAndCapabilities:
      "Computes 6-DOF forward and inverse kinematics, interpolates smooth linear/circular Cartesian paths, executes electronic camming, and coordinates multiple robot axes with microsecond-level synchronization.",
    kinematicAndAlgorithmicRole:
      "Deterministic trajectory calculation and closed-loop position/velocity control. Follows pre-programmed, repeatable mathematical instructions. Zero nondeterministic jitter, zero AI hallucinations.",
    requiredComponents: [
      "Multi-core industrial PC (IPC) with real-time Linux (PREEMPT_RT) or VxWorks",
      "EtherCAT / PROFINET IRT deterministic master controller",
      "Programmable Logic Controller (IEC 61131-3 PLC runtime)",
      "Dedicated motion coprocessor for kinematic Jacobian transformations",
      "Teach pendant with certified 3-position deadman enabling switch",
    ],
    inputSignals: [
      {
        signal: "Multi-Axis Encoder Feedback Frames & I/O Status",
        type: "Deterministic Synchronous Data Frames",
        typicalBandwidth: "250 µs to 1 ms cycle time (< 1 µs jitter)",
        protocol: "EtherCAT Distributed Clock / PROFINET IRT",
      },
    ],
    outputSignals: [
      {
        signal: "Synchronized Cyclic Synchronous Position (CSP) or Torque (CST) Vectors",
        type: "Coordinated Joint Commands",
        typicalBandwidth: "Synchronous 1 kHz update rate across all joints",
        protocol: "EtherCAT CiA 402 drive profile",
      },
    ],
    exampleIndustrialTasks: [
      "Continuous path seam welding following pre-taught 3D CAD spline curve",
      "High-speed Delta robot conveyor belt tracking with part synchronizer",
      "Coordinated dual-robot handling of large 150 kg automotive stampings",
    ],
    exampleSystemArchitecture: {
      sensorInput: "6 joint absolute encoder positions via EtherCAT ring topology",
      processingUnit: "Real-time 64-bit kinematic engine solving inverse Jacobian matrix",
      actuatorOutput: "Coordinated cyclic position setpoints to 6 servo drive axes",
      latencyBudget: "500 µs deterministic calculation window",
    },
    dependenciesAndLimitations: [
      "Completely blind to unexpected workspace changes; will collide if an unmodeled obstacle is present",
      "Requires manual teaching, CAD-to-path programming, or offline simulation",
      "Cannot adapt process parameters if incoming workpieces have dimensional variations",
    ],
    relatedProductRanges: [
      { name: "Robot Controllers and Motion Control", href: "/products/control-systems" },
      { name: "Servo Drives and Motor Drives", href: "/products/drives" },
      { name: "Integrated Robot Actuators", href: "/products/actuators" },
    ],
    relevantApplicationAreas: [
      { name: "Automotive Manufacturing", href: "/applications/automotive" },
      { name: "Warehousing and Intralogistics", href: "/applications/warehousing" },
      { name: "Metal Fabrication & Machining", href: "/applications/metalMachining" },
    ],
    safetyInteraction:
      "Monitored by safety PLC running parallel Safe Motion functions (Safe Operating Stop, Safe Limited Increment, Safely-Limited Speed according to EN ISO 13849-1 Cat 4 / PLe).",
  },
  {
    levelNumber: 4,
    levelCode: "Level 4",
    title: "Perception & Contextual Interpretation",
    subtitle: "Machine vision, point-cloud segmentation, defect grading, and environmental modeling",
    purposeAndCapabilities:
      "Extracts semantic meaning from high-dimensional sensor data (RGB cameras, structured light 3D cameras, LiDAR, and acoustic arrays). Identifies part location, class, orientation, defects, and obstacle boundaries.",
    kinematicAndAlgorithmicRole:
      "Perceptual interpretation and state estimation. Bridges the raw physical environment and the deterministic motion controller. Transforms pixel grids and point clouds into structured coordinate frames and classification labels.",
    requiredComponents: [
      "High-resolution industrial CMOS cameras (GigE Vision / USB3 Vision)",
      "Structured light stereo 3D depth sensors or time-of-flight (ToF) cameras",
      "Edge AI GPU inference accelerator (NVIDIA Jetson / x86 AI coprocessor)",
      "Narrow-band structured LED / laser illumination projectors",
      "3D LiDAR scanner arrays for spatial volumetric mapping",
    ],
    inputSignals: [
      {
        signal: "Raw 2D/3D Image Frames, Spatial Point Clouds, Acoustic Spectrograms",
        type: "High-Bandwidth Uncompressed Streaming Data",
        typicalBandwidth: "1 Gbps to 10 Gbps (30 - 60 FPS)",
        protocol: "GigE Vision, GenICam, USB3 Vision, MIPI CSI-2",
      },
    ],
    outputSignals: [
      {
        signal: "Part 6-DOF Grasp Pose (x, y, z, roll, pitch, yaw) & Quality Pass/Fail Labels",
        type: "Structured Metadata Packet",
        typicalBandwidth: "10 Hz to 60 Hz inference rate",
        protocol: "TCP/IP, gRPC, ROS 2 topics, OPC UA",
      },
    ],
    exampleIndustrialTasks: [
      "Random bin-picking of jumbled forging blanks from bulk pallets",
      "Inline surface crack detection on polished automotive cylinder heads",
      "LiDAR SLAM natural feature localization for autonomous mobile robots",
    ],
    exampleSystemArchitecture: {
      sensorInput: "Structured light 3D point cloud of open wire mesh container",
      processingUnit: "Edge GPU executing 3D Convolutional Neural Network / PointNet",
      actuatorOutput: "6-DOF target grasp coordinates sent to Level 3 Robot Controller",
      latencyBudget: "50 ms to 150 ms perception inference cycle",
    },
    dependenciesAndLimitations: [
      "Vulnerable to optical glare, reflections off oiled metals, and variable lighting",
      "Inference latency is non-deterministic and cannot directly drive inner motor current loops",
      "Requires large representative training datasets and edge-case validation",
    ],
    relatedProductRanges: [
      { name: "Machine Vision and Perception", href: "/products/vision" },
      { name: "Industrial Networking & Edge Computing", href: "/products/networking" },
      { name: "Sensors and Encoders", href: "/products/sensors" },
    ],
    relevantApplicationAreas: [
      { name: "Electronics and Semiconductor", href: "/applications/electronics" },
      { name: "Food and Beverage Processing", href: "/applications/foodBeverage" },
      { name: "Agriculture and Agri-Tech", href: "/applications/agriculture" },
    ],
    safetyInteraction:
      "Perception algorithms are typically NOT safety-rated; workcell safety must be independently guaranteed by certified optical light curtains, safety scanners (IEC 61496), or safe radar barriers.",
  },
  {
    levelNumber: 5,
    levelCode: "Level 5",
    title: "Adaptive Planning & Autonomous Behaviour",
    subtitle: "Dynamic path re-planning, whole-body impedance control, and autonomous decision-making",
    purposeAndCapabilities:
      "Generates real-time obstacle avoidance trajectories, computes whole-body balance and impedance adaptation, handles unexpected task exceptions, and orchestrates fleet missions autonomously without fixed human step-by-step programming.",
    kinematicAndAlgorithmicRole:
      "High-level decision making and dynamic optimization. Continuously solves Model Predictive Control (MPC), nonlinear trajectory optimization, or reinforcement learning policies to achieve mission goals in unconstrained, variable environments.",
    requiredComponents: [
      "High-performance heterogeneous edge server (multi-core CPU + Tensor Core GPU)",
      "Real-time middleware stack (ROS 2 / micro-ROS / custom zero-copy IPC)",
      "High-bandwidth 5G private wireless or Wi-Fi 6E telemetry link",
      "Distributed fleet orchestration & digital twin simulation server",
      "Multi-modal sensor fusion board (IMU + LiDAR + Vision + Odometry)",
    ],
    inputSignals: [
      {
        signal: "Multi-Modal Perceptual World Model + Fleet Mission Goals",
        type: "Dynamic Environmental Occupancy Grid & Goal Topology",
        typicalBandwidth: "10 Hz to 100 Hz state fusion loop",
        protocol: "Zero-copy shared memory, ROS 2 DDS, WebSockets",
      },
    ],
    outputSignals: [
      {
        signal: "Dynamic Re-Planned Kinematic Trajectory & Whole-Body Impedance Gains",
        type: "Cartesian Waypoint Trajectories & Impedance Vectors",
        typicalBandwidth: "100 Hz to 500 Hz re-planning rate",
        protocol: "Fast IPC pipe to Level 3 Controller",
      },
    ],
    exampleIndustrialTasks: [
      "Dynamic bipedal humanoid walking over loose gravel, adapting to foot slip",
      "Autonomous Mobile Robot fleet dynamically re-routing around temporary aisle blockage",
      "Adaptive robot force compliance polishing airplane engine turbine blades",
    ],
    exampleSystemArchitecture: {
      sensorInput: "360° LiDAR point cloud + wrist 6-axis F/T sensor + joint states",
      processingUnit: "Nonlinear Model Predictive Control (NMPC) running on multicore ARM/x86",
      actuatorOutput: "Adjusted joint torque & trajectory parameters dispatched to Level 3",
      latencyBudget: "5 ms to 20 ms optimization cycle",
    },
    dependenciesAndLimitations: [
      "Heavy reliance on lower tiers: a Level 5 planner cannot compensate for a loose Level 0 gearbox",
      "High computational power consumption (up to 300W onboard AI compute)",
      "Mathematical convergence is not guaranteed in non-convex multi-obstacle scenarios",
    ],
    relatedProductRanges: [
      { name: "Robot Controllers and Motion Control", href: "/products/control-systems" },
      { name: "Industrial Networking & Edge Computing", href: "/products/networking" },
      { name: "End Effectors and Gripping Systems", href: "/products/end-effectors" },
    ],
    relevantApplicationAreas: [
      { name: "Humanoid, Service & Mobile Robotics", href: "/applications/humanoid" },
      { name: "Mining and Heavy Industries", href: "/applications/mining" },
      { name: "Construction & Building Materials", href: "/applications/construction" },
    ],
    safetyInteraction:
      "Autonomous planners operate within strict physical safety envelopes bounded by SIL 3 / PLe hardware safety supervisors; if an autonomous trajectory violates a safe speed or zone, hardware intervention stops the machine instantly.",
  },
];

export interface ControlDistinctionItem {
  concept: string;
  governingPrinciple: string;
  typicalFrequency: string;
  determinismGuarantee: string;
  canReplaceSafetyCircuit: boolean;
  commonIndustrialRole: string;
}

export const CONTROL_DISTINCTIONS: ControlDistinctionItem[] = [
  {
    concept: "Deterministic Kinematic Control",
    governingPrinciple: "Pre-computed trajectory math, inverse Jacobian kinematics, linear/spline interpolation.",
    typicalFrequency: "1 kHz (1,000 Hz) fixed cycle",
    determinismGuarantee: "Strict mathematical guarantee: maximum jitter < 1 µs under real-time OS.",
    canReplaceSafetyCircuit: false,
    commonIndustrialRole: "Interpolating robot wrist paths during precision MIG/laser welding and dispensing.",
  },
  {
    concept: "Closed-Loop Feedback Control",
    governingPrinciple: "Proportional-Integral-Derivative (PID), state-space observers, field-oriented current control.",
    typicalFrequency: "10 kHz to 32 kHz current loop; 1 kHz position loop",
    determinismGuarantee: "High determinism within servo drive hardware; instantaneous response to tracking error.",
    canReplaceSafetyCircuit: false,
    commonIndustrialRole: "Holding commanded motor position against external load disturbance and gravity moments.",
  },
  {
    concept: "AI Perception & Segmentation",
    governingPrinciple: "Deep neural networks (CNNs, Vision Transformers, PointNet) processing raw sensor frames.",
    typicalFrequency: "10 Hz to 60 Hz inference rate",
    determinismGuarantee: "Probabilistic: outputs confidence scores, processing time varies with scene complexity.",
    canReplaceSafetyCircuit: false,
    commonIndustrialRole: "Identifying picking points for random cast parts in deep logistics totes.",
  },
  {
    concept: "Adaptive Impedance Planning",
    governingPrinciple: "Online optimization, Model Predictive Control (MPC), dynamic admittance adaptation.",
    typicalFrequency: "50 Hz to 500 Hz re-planning rate",
    determinismGuarantee: "Bounded optimization time with fallback default behaviors if solver does not converge.",
    canReplaceSafetyCircuit: false,
    commonIndustrialRole: "Regulating contact pressure during composite polishing without gouging workpiece.",
  },
  {
    concept: "Autonomous Mission Decision-Making",
    governingPrinciple: "Behavior trees, high-level task planners, fleet dispatching, semantic SLAM.",
    typicalFrequency: "0.1 Hz to 5 Hz asynchronous decisions",
    determinismGuarantee: "Heuristic and probabilistic; relies on lower deterministic layers for physical execution.",
    canReplaceSafetyCircuit: false,
    commonIndustrialRole: "Routing 40 AMRs across a 50,000 m² warehouse to optimize order picking throughput.",
  },
];
