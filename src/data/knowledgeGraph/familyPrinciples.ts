/**
 * INDUS Industrial Robotics — Product-Family Operating Principles & Mechanical Sequences
 *
 * Provides specialized, grounded physics and mechatronic sequence models for each of the
 * 12 product lines, showing input -> transformation -> output signal and load states.
 */

export interface OperatingSequenceStep {
  stepNumber: number;
  title: string;
  description: string;
  inputSignalOrState: string;
  transformation: string;
  outputSignalOrState: string;
}

export interface ProductFamilyPrinciple {
  familyId: string; // matches product line ID, e.g. "precision-reducers"
  familyName: string;
  physicsPrinciple: string;
  primarySubsystem: string;
  sequenceSteps: OperatingSequenceStep[];
  diagnosticCheckpoints: string[];
  alternativeTechnologies: {
    technologyName: string;
    engineeringTradeOff: string;
  }[];
}

export const PRODUCT_FAMILY_PRINCIPLES: Record<string, ProductFamilyPrinciple> = {
  "precision-reducers": {
    familyId: "precision-reducers",
    familyName: "Precision Reducers and Gearboxes",
    physicsPrinciple: "Kinematic speed reduction and torque multiplication via elastic flexspline deformation or multi-pin cycloidal eccentricity.",
    primarySubsystem: "Robot Joint Articulation (J1 through J6) & Rotary Positioning Stages",
    sequenceSteps: [
      {
        stepNumber: 1,
        title: "Motor High-Speed Rotation Input",
        description: "Motor input shaft delivers high rotational velocity (2,000 - 6,000 RPM) with low mechanical torque to the reducer input hub.",
        inputSignalOrState: "High-speed electrical rotation (Omega_in, Tau_in)",
        transformation: "Direct rigid or clamp coupling to input wave generator or eccentric shaft",
        outputSignalOrState: "Transferred angular momentum into reducer input assembly",
      },
      {
        stepNumber: 2,
        title: "Multi-Tooth Conjugate Meshing",
        description: "Input assembly continuously deflects flexible or cycloidal gear elements, causing simultaneous conjugate meshing across 30%+ of teeth without backlash.",
        inputSignalOrState: "Eccentric or elliptical rotating radial force vector",
        transformation: "Elastic flexspline tooth deflection or cycloidal needle-pin rolling contact",
        outputSignalOrState: "Differential tooth progress (typically 2 teeth per revolution difference)",
      },
      {
        stepNumber: 3,
        title: "Low-Backlash Multiplied Torque Output",
        description: "Output cross-roller bearing delivers high continuous torque (Tau_out = Tau_in * ratio * efficiency) with sub-arcminute lost motion.",
        inputSignalOrState: "Reduced velocity output rotation (Omega_in / ratio)",
        transformation: "High-rigidity crossed-roller bearing reacting radial, axial, and tilting moment loads",
        outputSignalOrState: "Calibrated joint articulation with repeatability < 0.1 arcmin",
      },
    ],
    diagnosticCheckpoints: [
      "Lost motion hysteresis curve under bidirectional torque reversal",
      "Continuous torsional stiffness gradient (Nm/arcmin)",
      "Crossed-roller bearing axial runout under maximum tilting moment",
    ],
    alternativeTechnologies: [
      { technologyName: "Direct Drive Frameless Motors", engineeringTradeOff: "Zero mechanical backlash but requires significantly larger motor volume, higher continuous power, and active cooling to achieve equivalent joint torque." },
      { technologyName: "Planetary Gearheads", engineeringTradeOff: "Higher mechanical efficiency and shock capacity, but exhibits 1-3 arcmin backlash compared to true zero-backlash strain-wave units." },
    ],
  },

  "servo-motors": {
    familyId: "servo-motors",
    familyName: "Servo and Precision Motors",
    physicsPrinciple: "Lorentz electromagnetic force generation via Field-Oriented Control (FOC) of 3-phase stator currents in permanent magnet synchronous rotors.",
    primarySubsystem: "Joint Actuation Powertrain & Linear Feed Drives",
    sequenceSteps: [
      {
        stepNumber: 1,
        title: "Inverter 3-Phase Current Injection",
        description: "High-frequency PWM inverter switches 3-phase sinusoidal voltages into stator windings based on absolute encoder rotor angle feedback.",
        inputSignalOrState: "DC bus link voltage + PWM gating signals (10–20 kHz)",
        transformation: "Clark/Park transformation aligning stator current vector (Iq) in quadrature with rotor permanent magnets",
        outputSignalOrState: "Rotating magnetic stator flux vector (B_stator)",
      },
      {
        stepNumber: 2,
        title: "Electromagnetic Torque Generation",
        description: "Neodymium-iron-boron (NdFeB) high-energy rotor magnets interact with stator flux, producing Lorentz torque proportional to quadrature current Iq.",
        inputSignalOrState: "Stator quadrature current Iq * Flux linkage Psi_m",
        transformation: "Electromagnetic shear stress across air gap (typically 0.5–1.0 mm air gap)",
        outputSignalOrState: "Mechanical electromagnetic torque Tau_em = 1.5 * p * Psi_m * Iq",
      },
      {
        stepNumber: 3,
        title: "Rotor Acceleration & Closed-Loop Motion",
        description: "Low-inertia rotor accelerates with minimal cogging torque, transmitting calibrated angular velocity to the driven transmission stage.",
        inputSignalOrState: "Tau_em minus mechanical friction and viscous damping",
        transformation: "Newtonian angular acceleration: alpha = (Tau_em - Tau_load) / J_total",
        outputSignalOrState: "Smooth mechanical rotation with speed ripple < 0.2%",
      },
    ],
    diagnosticCheckpoints: [
      "Rotor back-EMF sinusoidal balance across U-V-W phases",
      "Stator thermal rise (Class F <= 105K rise above 40°C ambient)",
      "Cogging torque peak-to-peak amplitude (< 1.5% rated torque)",
    ],
    alternativeTechnologies: [
      { technologyName: "Stepper Motors", engineeringTradeOff: "Lower cost without requiring encoder feedback, but suffers from step resonance, high heat at standstill, and loss of synchronization under unexpected shock loads." },
      { technologyName: "Induction Motors", engineeringTradeOff: "Rugged and low-cost for continuous pumps/fans, but lacks the high power density and rapid acceleration dynamics required for 6-axis robotics." },
    ],
  },

  "linear-motion": {
    familyId: "linear-motion",
    familyName: "Linear Motion Systems",
    physicsPrinciple: "Deterministic rotary-to-linear kinematic conversion using recirculating ball or planetary roller rolling contacts.",
    primarySubsystem: "Cartesian Gantries, CNC Machine Tool Axes & 7th-Axis Robot Transfer Tracks",
    sequenceSteps: [
      {
        stepNumber: 1,
        title: "Spindle Precision Angular Rotation",
        description: "Ground screw shaft is driven by direct-coupled servo motor, supported by high-rigidity angular contact thrust bearings.",
        inputSignalOrState: "Motor driving torque and controlled angular velocity (RPM)",
        transformation: "Thrust bearing pack preloading eliminating axial end-play",
        outputSignalOrState: "Precision rotation of precision-ground helical Gothic-arch screw groove",
      },
      {
        stepNumber: 2,
        title: "Recirculating Rolling Element Kinematics",
        description: "Hardened bearing balls or threaded planetary rollers circulate through the nut, transferring axial thrust while preventing sliding friction.",
        inputSignalOrState: "Screw rotation engaging circulating rolling elements",
        transformation: "Pure rolling contact with coefficient of friction mu < 0.005",
        outputSignalOrState: "Axial translation: Stroke = (theta / 2*pi) * Lead",
      },
      {
        stepNumber: 3,
        title: "Guided Carriage Translation",
        description: "Linear ball or roller profile rails absorb heavy multi-axis moment loads (Mx, My, Mz), ensuring straightness and parallelism under 5 µm.",
        inputSignalOrState: "Axial nut thrust + external workpiece gravitational/cutting loads",
        transformation: "Recirculating 4-row profile rail carriages reacting side moments",
        outputSignalOrState: "Deterministic linear translation with repeatability down to ±0.003 mm",
      },
    ],
    diagnosticCheckpoints: [
      "Cumulative lead error (ISO 3408-3 Class C3: <= 8 µm per 300 mm)",
      "Nut axial preload drag torque consistency",
      "Critical screw whirling resonance speed margin (>= 20% above max operating RPM)",
    ],
    alternativeTechnologies: [
      { technologyName: "Linear Direct-Drive Motors", engineeringTradeOff: "Higher acceleration (> 10G) and zero mechanical wear, but requires magnetic track along entire stroke, generates heavy heat, and lacks mechanical self-locking or power-off holding." },
      { technologyName: "Timing Belt Actuators", engineeringTradeOff: "Fast long-stroke motion (> 5 m/s) at low cost, but suffers from belt stretch elasticity, lower load capacity, and backlash under load reversals." },
    ],
  },

  "end-effectors": {
    familyId: "end-effectors",
    familyName: "End Effectors and Gripping Systems",
    physicsPrinciple: "Calibrated workpiece clamping force, compliant passive/active centering, and pneumatic vacuum suction generation.",
    primarySubsystem: "Robot Wrist Tooling & Workpiece Manipulation Interface",
    sequenceSteps: [
      {
        stepNumber: 1,
        title: "Tool Command & Part Position Sensing",
        description: "Robot controller transmits target gripping width and calibrated force limit over IO-Link, fieldbus, or discrete 24V I/O.",
        inputSignalOrState: "Target grip force (N), target finger position (mm), or vacuum enable",
        transformation: "Local microprocessor trajectory planning and current setpoint calculation",
        outputSignalOrState: "Motor current drive or solenoid valve actuation",
      },
      {
        stepNumber: 2,
        title: "Kinematic Finger Articulation or Vacuum Pull",
        description: "Synchronized dual-finger wedge mechanisms or multi-stage Venturi vacuum ejectors translate actuator input into workpiece contact.",
        inputSignalOrState: "Rack-and-pinion finger travel or compressed air expansion",
        transformation: "Mechanical wedge cam ratio or supersonic Venturi pressure drop (-85 kPa)",
        outputSignalOrState: "Controlled clamping contact with workpiece outer/inner envelope",
      },
      {
        stepNumber: 3,
        title: "Grip Verification & Part Holding Confirmation",
        description: "Current feedback, optical distance sensing, or vacuum pressure threshold sensors confirm secure part acquisition before robot arm motion begins.",
        inputSignalOrState: "Measured gripping force feedback or vacuum switch threshold",
        transformation: "Threshold verification against tolerance band",
        outputSignalOrState: "'Part Gripped' digital interlock signal transmitted to robot safety controller",
      },
    ],
    diagnosticCheckpoints: [
      "Finger clamping force repeatability under continuous cycle testing",
      "Vacuum decay rate under workpiece seal test",
      "Jaw guide play and backlash under lateral dynamic inertia forces",
    ],
    alternativeTechnologies: [
      { technologyName: "Pneumatic Clamping Grippers", engineeringTradeOff: "Higher force-to-weight ratio and low initial cost, but lacks intermediate finger positioning, force programmability, and energy efficiency." },
      { technologyName: "Magnetic Grippers", engineeringTradeOff: "Instantaneous grip for sheet metal without custom jaws, but only works on ferromagnetic metals and can attract grinding chips/debris." },
    ],
  },

  "sensors-encoders": {
    familyId: "sensors-encoders",
    familyName: "Sensors and Encoders",
    physicsPrinciple: "High-resolution optical diffractive, magnetic Hall-array, or strain-gauge piezoresistive physical state observation.",
    primarySubsystem: "Closed-Loop Feedback, Tool Center Point Metrology & Compliance",
    sequenceSteps: [
      {
        stepNumber: 1,
        title: "Physical State Perturbation",
        description: "Mechanical shaft rotation, structural joint deflection, or applied force perturbs optical gratings, magnetic flux poles, or foil strain gauges.",
        inputSignalOrState: "Shaft angle theta, deflection delta-x, or applied force F",
        transformation: "Optical interference modulation, Hall voltage variation, or Wheatstone bridge resistance shift",
        outputSignalOrState: "Differential analog micro-signals (sin/cos or millivolt bridge output)",
      },
      {
        stepNumber: 2,
        title: "Conditioning & High-Speed Interpolation",
        description: "Internal ASIC amplifies, temperature-compensates, and interpolates analog signals up to 26-bit resolution (67 million counts/rev).",
        inputSignalOrState: "Differential analog signals + internal temperature sensor",
        transformation: "Flash ADC sampling, look-up table calibration, and electronic angle interpolation",
        outputSignalOrState: "High-precision digital absolute position word and multi-turn count",
      },
      {
        stepNumber: 3,
        title: "Deterministic Serial Transmission",
        description: "Encoder transmits cyclic position and diagnostic telemetry to servo drive over shielded BiSS-C or EnDat 2.2 point-to-point buses.",
        inputSignalOrState: "Drive clock pulse train (MA clock up to 10 MHz)",
        transformation: "Manchester or NRZ serial data stream with CRC-6 error checking",
        outputSignalOrState: "Absolute position updated every drive current loop (e.g. 50 µs cycle)",
      },
    ],
    diagnosticCheckpoints: [
      "Cyclic error (sub-divisional error - SDE) < ±15 arcsec",
      "Transmission signal jitter under 100% servo motor PWM noise",
      "Multi-turn battery backup voltage / energy harvesting gear integrity",
    ],
    alternativeTechnologies: [
      { technologyName: "Brushless Resolvers", engineeringTradeOff: "Extreme shock, temperature, and radiation immunity for heavy mining/nuclear, but lower resolution (12-14 bit) and requires analog RDC converter." },
      { technologyName: "Magnetic Encoders", engineeringTradeOff: "Compact, dirt-resistant, and low cost, but susceptible to external stray electromagnetic fields from high-power welding cables." },
    ],
  },

  "machine-vision": {
    familyId: "machine-vision",
    familyName: "Machine Vision and Perception",
    physicsPrinciple: "Optoelectronic photon sensing, active structured-light pattern triangulation, and neural tensor feature extraction.",
    primarySubsystem: "Autonomous Bin Picking, Inline Metrology & Defect Classification",
    sequenceSteps: [
      {
        stepNumber: 1,
        title: "Illuminated Photon Capture",
        description: "Synchronized strobe lighting or laser fringe projector illuminates work envelope, with CMOS sensor integrating photons across global shutter array.",
        inputSignalOrState: "Reflected optical photons from workpiece surfaces",
        transformation: "Photodiode array converting photons to electron charge packets (Quantum Efficiency > 70%)",
        outputSignalOrState: "Raw digital pixel matrix (Monochrome, RGB, or Phase-Shifted Patterns)",
      },
      {
        stepNumber: 2,
        title: "3D Geometric Reconstruction",
        description: "Vision processor triangulates phase shifts or computes Time-of-Flight (ToF) depth per pixel, generating dense 3D point cloud.",
        inputSignalOrState: "Multi-frame phase images + calibrated stereo baseline",
        transformation: "Epipolar geometric rectification, disparity mapping, and coordinate transformation",
        outputSignalOrState: "Calibrated (X, Y, Z, Nx, Ny, Nz) point cloud in robot base coordinate frame",
      },
      {
        stepNumber: 3,
        title: "6-DOF Grasp Pose & Defect Output",
        description: "Embedded AI model matches CAD templates, checks collision-free grasp orientations, and transmits 6-DOF pick pose to robot controller.",
        inputSignalOrState: "Segmented 3D point cloud + CAD model mesh",
        transformation: "ICP (Iterative Closest Point) pose optimization and collision bounding box check",
        outputSignalOrState: "Tool Center Point (TCP) target pose matrix [X, Y, Z, Roll, Pitch, Yaw] sent via GigE Vision",
      },
    ],
    diagnosticCheckpoints: [
      "Spatial calibration error (RMS re-projection error < 0.1 pixel)",
      "Point cloud density and outlier noise on highly reflective metal surfaces",
      "Inference and pose estimation latency budget (< 50 ms per cycle)",
    ],
    alternativeTechnologies: [
      { technologyName: "2D Camera with Optical Backlight", engineeringTradeOff: "Fastest cycle time (< 5 ms) and sub-pixel edge accuracy for flat planar parts, but cannot measure height, tilt, or pick randomly piled bin parts." },
      { technologyName: "Tactile Probing", engineeringTradeOff: "Sub-micron accuracy for CMM metrology, but extremely slow point-by-point contact unsuitable for high-cadence production lines." },
    ],
  },

  "robot-controllers": {
    familyId: "robot-controllers",
    familyName: "Robot Controllers and Motion Control",
    physicsPrinciple: "Deterministic real-time numerical solving of Forward/Inverse Kinematics, trajectory filtering, and multi-axis fieldbus master synchronization.",
    primarySubsystem: "Central Motion Brain, Trajectory Interpolator & System Coordinator",
    sequenceSteps: [
      {
        stepNumber: 1,
        title: "Trajectory Setpoint Generation",
        description: "Motion planner computes path segments (linear, circular, spline) in Cartesian space, applying jerk-limited S-curve acceleration profiles.",
        inputSignalOrState: "Programmed target waypoint, blend radius, and velocity constraint",
        transformation: "Polynomial 7th-order jerk filtering generating smooth continuous path profiles",
        outputSignalOrState: "Cyclic Cartesian tool setpoint vector [X(t), Y(t), Z(t), Q(t)]",
      },
      {
        stepNumber: 2,
        title: "Real-Time Inverse Kinematics Solving",
        description: "Kinematics engine evaluates geometric DH parameters, transforming Cartesian setpoints into individual joint angles theta_1 through theta_6.",
        inputSignalOrState: "Cartesian pose setpoint + current joint configuration state",
        transformation: "Inverse Kinematic algebraic/numerical Jacobian solver handling kinematic singularities",
        outputSignalOrState: "Synchronized target joint positions for all axes every 250 µs",
      },
      {
        stepNumber: 3,
        title: "Deterministic Fieldbus Telegram Broadcast",
        description: "Controller transmits synchronized cyclic setpoints over EtherCAT or TSN to all servo drives with sub-microsecond time-stamping.",
        inputSignalOrState: "Target joint position, velocity feedforward, and torque offset words",
        transformation: "EtherCAT Distributed Clocks frame broadcast with hardware timing latching",
        outputSignalOrState: "Coordinated motion execution across entire robotic workcell",
      },
    ],
    diagnosticCheckpoints: [
      "Real-time task jitter (< 1 µs on dedicated RTOS core)",
      "Kinematic singularity proximity warnings (wrist and elbow alignment)",
      "Fieldbus cyclic packet drop counter (must remain 0 during continuous operation)",
    ],
    alternativeTechnologies: [
      { technologyName: "Dedicated Hardware CNC Controllers", engineeringTradeOff: "Ultra-high toolpath block processing for 5-axis milling, but lacks the flexible Kinematic transform library needed for arbitrary 6-axis articulated robots." },
      { technologyName: "Standard Industrial PLCs", engineeringTradeOff: "Robust sequential logic and wide plant integration, but standard PLCs lack multi-axis 6-DOF robot kinematics and sub-millisecond trajectory blending." },
    ],
  },

  "servo-drives": {
    familyId: "servo-drives",
    familyName: "Servo Drives and Motor Drives",
    physicsPrinciple: "High-bandwidth cascaded closed-loop control (Current, Velocity, Position) with Wide-Bandgap (SiC/GaN) inverter modulation.",
    primarySubsystem: "Power Conversion, Dynamic Motor Regulation & Functional Safe Torque Off",
    sequenceSteps: [
      {
        stepNumber: 1,
        title: "Fieldbus Setpoint Latching",
        description: "Drive receives target position and velocity feedforward from motion controller over EtherCAT / PROFINET IRT.",
        inputSignalOrState: "Cyclic target position telegram + timing sync pulse",
        transformation: "Position loop comparator calculating position error: e_pos = target_pos - actual_pos",
        outputSignalOrState: "Target velocity command to velocity loop filter",
      },
      {
        stepNumber: 2,
        title: "Cascaded Velocity & Current Regulation",
        description: "PI velocity controller and high-frequency Field-Oriented Current loop (10-20 kHz) calculate required stator voltage vectors.",
        inputSignalOrState: "Velocity error + phase current shunt/Hall feedback",
        transformation: "Clark/Park dq-axis transformations and active anti-resonance notch filtering",
        outputSignalOrState: "Space Vector PWM gating duty cycles (Vd, Vq)",
      },
      {
        stepNumber: 3,
        title: "Inverter Power Stage Modulation",
        description: "Silicon Carbide (SiC) MOSFET bridge switches DC bus voltage into high-current 3-phase motor windings with minimal thermal loss.",
        inputSignalOrState: "PWM gate driver signals (dead-time compensated)",
        transformation: "Solid-state bridge switching modulated 400V/48V 3-phase power",
        outputSignalOrState: "Calibrated motor phase currents driving joint rotation",
      },
    ],
    diagnosticCheckpoints: [
      "Current loop bandwidth (-3dB cutoff frequency > 2.5 kHz)",
      "DC bus voltage ripple under regenerative braking deceleration",
      "Dual-channel Safe Torque Off (STO) diagnostic integrity",
    ],
    alternativeTechnologies: [
      { technologyName: "Variable Frequency Drives (VFD)", engineeringTradeOff: "Economical for open-loop induction motor pump/fan speed control, but cannot achieve the microsecond dynamic positioning needed for robotics." },
      { technologyName: "Analog Servo Amplifiers", engineeringTradeOff: "Zero digital processing latency, but suffers from thermal drift, lack of fieldbus telemetry, and cannot store multi-axis digital filter parameters." },
    ],
  },

  "mechanical-transmission": {
    familyId: "mechanical-transmission",
    familyName: "Bearings, Couplings and Mechanical Transmission",
    physicsPrinciple: "Mechanical torque transmission, shaft misalignment compensation, structural load reaction, and elastomeric vibration damping.",
    primarySubsystem: "Drivetrain Mechanical Coupling, Structural Turntables & Power-Off Brakes",
    sequenceSteps: [
      {
        stepNumber: 1,
        title: "Shaft Misalignment & Torque Reception",
        description: "Stainless steel bellows or curved jaw coupling receives driving torque from motor shaft, isolating axial, angular, and parallel misalignments.",
        inputSignalOrState: "Motor driving torque with minor thermal/assembly shaft misalignments",
        transformation: "Elastic flexure of corrugated bellows or preloaded polyurethane spider",
        outputSignalOrState: "Zero-backlash angular torque transmission into gearbox input",
      },
      {
        stepNumber: 2,
        title: "Structural Moment Load Reaction",
        description: "Heavy-duty crossed-roller or 4-point contact slewing bearing carries combined radial, axial, and tilting moment loads directly into machine base.",
        inputSignalOrState: "Overturning moments from cantilevered robot arm links",
        transformation: "Alternating 90° cylindrical rollers in V-groove raceways distributing contact stress",
        outputSignalOrState: "Rigid turntable rotation with runout under 5 µm",
      },
      {
        stepNumber: 3,
        title: "Fail-Safe Spring-Applied Braking",
        description: "In the event of power interruption or emergency stop, preloaded mechanical springs instantly clamp friction discs to prevent gravity drop.",
        inputSignalOrState: "24V DC solenoid coil de-energization",
        transformation: "Helical spring pack driving armature against high-friction ceramic/organic lining",
        outputSignalOrState: "Positive holding torque locking robot joint within 30 ms",
      },
    ],
    diagnosticCheckpoints: [
      "Bellows coupling torsional deflection under peak acceleration torque",
      "Slewing bearing axial clearance and grease lubrication cleanliness",
      "Brake engagement response time and friction pad wear indicator",
    ],
    alternativeTechnologies: [
      { technologyName: "Rigid Sleeve Couplings", engineeringTradeOff: "Highest torsional stiffness at lowest cost, but transmits severe bending stresses to motor bearings if shafts are even slightly misaligned." },
      { technologyName: "Hydraulic Clamping Brakes", engineeringTradeOff: "Immense holding force in compact envelope, but requires external hydraulic pump pack and carries leakage risks in clean automation plants." },
    ],
  },

  "robotics-safety": {
    familyId: "robotics-safety",
    familyName: "Industrial Robotics Safety Components",
    physicsPrinciple: "Redundant dual-channel optical, mechanical, or electromechanical sensing with fail-safe cross-monitoring adhering to ISO 13849-1 Cat 4 / PLe.",
    primarySubsystem: "Emergency Stop Circuitry, Cell Safeguarding & Safe Motion Supervision",
    sequenceSteps: [
      {
        stepNumber: 1,
        title: "Hazardous Intrusion Sensing",
        description: "Safety laser scanner, light curtain, or RFID interlock detects human operator breaching the designated warning or protective cell boundary.",
        inputSignalOrState: "Optical beam interruption or infrared ToF distance measurement breach",
        transformation: "Dual microprocessors evaluating time-of-flight or beam matrix state independently",
        outputSignalOrState: "De-energization of dual safety OSSD (Output Signal Switching Device) solid-state outputs",
      },
      {
        stepNumber: 2,
        title: "Cross-Monitored Logic Evaluation",
        description: "Safety PLC or safety relay evaluates dual inputs, testing for contact weld, wire short-circuits, and discrepancy time limits (< 100 ms).",
        inputSignalOrState: "Dual OSSD low-level signals into safety controller",
        transformation: "Hardware-redundant voting logic asserting Safe Motion control function",
        outputSignalOrState: "Certified Safe Stop command (STO, SS1, or SLS)",
      },
      {
        stepNumber: 3,
        title: "Safe Deceleration & Energy Disconnection",
        description: "Servo drives ramp robot to zero speed under active Safe Stop 1 (SS1), followed by mechanical brake drop and Safe Torque Off (STO) power cut.",
        inputSignalOrState: "Safe Stop digital request to drive safety core",
        transformation: "Hardware optocoupler cut-off to inverter gate drivers, disconnecting motor flux",
        outputSignalOrState: "Robot guaranteed standstill preventing operator injury",
      },
    ],
    diagnosticCheckpoints: [
      "Safety function response time from sensor trip to zero motion (< 80 ms total)",
      "Dual-channel discrepancy timer and contact weld monitoring",
      "Protective field cleanliness and optical window dust degradation warning",
    ],
    alternativeTechnologies: [
      { technologyName: "Physical Perimeter Fencing", engineeringTradeOff: "100% passive mechanical containment with zero software complexity, but consumes large factory floor footprint and prevents collaborative operator loading." },
      { technologyName: "Standard Non-Safety Sensors", engineeringTradeOff: "Low cost for general part detection, but illegal and life-threatening to deploy for personnel safety because single component failures can leave hazardous motion active." },
    ],
  },

  "networking-edge": {
    familyId: "networking-edge",
    familyName: "Industrial Networking, Edge Computing and Intelligent Monitoring",
    physicsPrinciple: "Deterministic Time-Sensitive Networking (IEEE 802.1Qbv), galvanic serial bus isolation, and edge neural inference compute.",
    primarySubsystem: "Workcell Deterministic Fieldbus Backbone, Edge AI & Cloud Telemetry",
    sequenceSteps: [
      {
        stepNumber: 1,
        title: "OT/IT Traffic Convergence & Ingestion",
        description: "Managed TSN switch receives high-priority real-time servo drive frames, IO-Link sensor packets, and asynchronous vision streams.",
        inputSignalOrState: "Multi-vendor Ethernet frames (EtherCAT, PROFINET, MQTT, GigE Vision)",
        transformation: "VLAN tag priority inspection (IEEE 802.1Q priority mapping 0 through 7)",
        outputSignalOrState: "Queued packets sorted into dedicated hardware egress buffers",
      },
      {
        stepNumber: 2,
        title: "Scheduled Time-Aware Gating",
        description: "Hardware Time-Aware Shaper (TAS) opens transmission gates exclusively for real-time motion packets during scheduled time windows, blocking best-effort traffic.",
        inputSignalOrState: "IEEE 802.1AS synchronized global nanosecond clock",
        transformation: "Hardware gate state machine opening/closing prioritized queues",
        outputSignalOrState: "Deterministic, zero-jitter packet delivery across shared factory backbone",
      },
      {
        stepNumber: 3,
        title: "Edge AI Anomaly Inference & Cloud Export",
        description: "Fanless edge computer processes vibration spectra and power telemetry locally, predicting reducer gear wear and exporting metrics via OPC UA.",
        inputSignalOrState: "Real-time vibration, torque, and temperature data streams",
        transformation: "Embedded TensorRT inference model detecting anomalous harmonic signatures",
        outputSignalOrState: "Predictive maintenance alert + semantic OPC UA telemetry published to MES",
      },
    ],
    diagnosticCheckpoints: [
      "Time-aware shaper schedule synchronization error (< 100 ns)",
      "Packet drop rate and buffer queue overflow telemetry",
      "Edge computer thermal core temperature under 100% continuous AI inference",
    ],
    alternativeTechnologies: [
      { technologyName: "Standard Commercial Office Ethernet Switches", engineeringTradeOff: "Cheap and widely available, but causes unpredictable packet delay, lacks industrial vibration/temperature ratings, and drops critical robot motion packets." },
      { technologyName: "Direct Cloud Streaming", engineeringTradeOff: "Centralized big data analytics, but latency (> 100 ms) and internet outage risks make it impossible to use for real-time robotic closed-loop decisions." },
    ],
  },
};

export const getFamilyPrinciple = (familyId: string): ProductFamilyPrinciple | undefined =>
  PRODUCT_FAMILY_PRINCIPLES[familyId];
