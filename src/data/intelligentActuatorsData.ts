/**
 * INDUS Industrial Robotics — Intelligent Actuators Engineering Data Model
 * 
 * Category-specific schema for mechatronically integrated intelligent rotary
 * and linear actuators, featuring built-in servo drives, dual absolute encoders,
 * EtherCAT / CANopen fieldbuses, and real-time condition telemetry.
 */

export interface ActuatorModelVariant {
  modelCode: string;
  nominalTorqueOrForce: string;
  peakTorqueOrForce: string;
  ratedSpeed: string;
  maxSpeed: string;
  continuousCurrent: string;
  peakCurrent: string;
  encoderResolution: string;
  gearRatio?: string;
  backlash?: string;
  strokeRangeMm?: string;
  flangeSizeMm: string;
  massKg: string;
  ipRating: string;
  interfaces?: string;
  environmentalSuitability?: string;
  integrationRequirements?: string;
  verifiedStatus: "verified" | "configurable" | "preliminary";
}

export interface MechatronicSubsystem {
  name: string;
  category: "integrated-hardware" | "embedded-control" | "software-diagnostics" | "optional-accessory";
  specification: string;
  purpose: string;
  status: "verified" | "configurable";
}

export interface PracticalApplication {
  applicationName: string;
  manufacturingProblem: string;
  howProductContributes: string;
  applicationEnvironment: string;
  productRole: string;
  requiredMotion: string;
  integrationComponents: string[];
  requiredSupportingComponents?: string[];
  engineeringConsiderations: string;
  expectedBenefits?: string;
  operationalBenefit: string;
  designLimitations: string;
  limitationsAndValidation?: string;
}

export interface EngineeringBenefit {
  technicalFeature: string;
  engineeringEffect: string;
  customerBenefit: string;
  operatingConditions: string;
}

export interface IntelligentActuatorItem {
  id: string;
  slug: string;
  name: string;
  categorySlug: string;
  categoryName: string;
  headline: string;
  engineeringValueProposition: string;
  headlineSpecs: {
    ratedTorqueOrForce: { label: string; value: string; unit: string; note: string };
    outputSpeed: { label: string; value: string; unit: string; note: string };
    positionFeedback: { label: string; value: string; unit: string; note: string };
    integration: { label: string; value: string; unit: string; note: string };
  };
  functionalOverview: string;
  mechatronicArchitecture: MechatronicSubsystem[];
  intelligenceCapabilities: {
    title: string;
    description: string;
    verificationStatus: "verified" | "configurable";
    evidence: string;
  }[];
  practicalApplications: PracticalApplication[];
  engineeringBenefits: EngineeringBenefit[];
  specificationTable: {
    parameter: string;
    unit: string;
    category: "Mechanical" | "Electrical" | "Kinematics" | "Thermal & Environmental";
    ratingType: "Continuous" | "Peak" | "Nominal" | "Envelope";
    models: Record<string, string>;
    testCondition: string;
    status: "verified" | "configurable";
  }[];
  modelVariants: ActuatorModelVariant[];
  integrationSpecs: {
    motorDrives: string;
    mechanicalMounting: string;
    electricalRequirements: string;
    communicationProtocols: string[];
    supportedControllers: string[];
    safetyStandards: string[];
  };
  engineeringResources: {
    title: string;
    docNumber: string;
    type: "Datasheet" | "CAD 3D STEP" | "User Manual" | "Integration Guide" | "Wiring Diagram" | "Dimensional Drawing";
    format: string;
    fileSize: string;
    verificationLevel: string;
  }[];
}

export const INTELLIGENT_ACTUATORS_DATA: Record<string, IntelligentActuatorItem> = {
  "intelligent-rotary-actuator": {
    id: "intelligent-rotary-actuator",
    slug: "intelligent-rotary-actuator",
    name: "Intelligent Rotary Actuator",
    categorySlug: "intelligent-actuators",
    categoryName: "Intelligent Actuators",
    headline: "Precision motion, integrated feedback, and configurable control for robotic joints and automated machinery.",
    engineeringValueProposition: "Compact mechatronic rotary joint integrating high-density brushless servo, zero-backlash harmonic gearing, 19-bit dual absolute encoders, and closed-loop EtherCAT drive in a single sealed IP65 casing.",
    headlineSpecs: {
      ratedTorqueOrForce: {
        label: "Rated torque",
        value: "35 – 280",
        unit: "Nm",
        note: "by model variant",
      },
      outputSpeed: {
        label: "Output speed",
        value: "25 – 120",
        unit: "rpm",
        note: "at rated voltage",
      },
      positionFeedback: {
        label: "Position feedback",
        value: "Dual 19-Bit Absolute",
        unit: "BiSS-C / SSI",
        note: "Input & output position verification",
      },
      integration: {
        label: "Integration",
        value: "EtherCAT / CANopen",
        unit: "DS402 Profile",
        note: "Deterministic 1ms sync cycle",
      },
    },
    functionalOverview: "The INDUS Intelligent Rotary Actuator (IND-IRA series) eliminates separate gearboxes, external servo drives, and lengthy motor cables by packaging a frameless permanent-magnet synchronous motor, a high-rigidity strain-wave gearhead, an embedded DSP motor drive, and dual absolute position encoders into an all-in-one rotary joint module. Built-in current and temperature monitoring enables real-time thermal protection and mechanical anomaly detection under 24/7 industrial duty.",
    mechatronicArchitecture: [
      {
        name: "Frameless Brushless PM Servomotor",
        category: "integrated-hardware",
        specification: "10-pole neodymium rotor, low-cogging concentrated stator windings",
        purpose: "High continuous power density with minimal thermal gradient",
        status: "verified",
      },
      {
        name: "Zero-Backlash Strain-Wave Gearhead",
        category: "integrated-hardware",
        specification: "Torsional backlash < 1.0 arcmin, reduction ratios 50:1 to 160:1",
        purpose: "Torque multiplication with near-zero lost motion for precise joint indexing",
        status: "verified",
      },
      {
        name: "Dual Absolute Optical / Magnetic Encoders",
        category: "integrated-hardware",
        specification: "19-bit single-turn output side + 17-bit motor shaft side",
        purpose: "Enables direct load position feedback and torsional wind-up compensation",
        status: "verified",
      },
      {
        name: "Integrated 48V DC Servo Inverter Drive",
        category: "integrated-hardware",
        specification: "Space-vector PWM, 20 kHz switching frequency, 15A continuous / 40A peak",
        purpose: "Eliminates external cabinet drive space and EMI radiating cabling",
        status: "verified",
      },
      {
        name: "Closed-Loop FOC Vector Control",
        category: "embedded-control",
        specification: "Cascaded current (20 kHz), velocity (5 kHz), and position (1 kHz) loops",
        purpose: "Deterministic motion tracking with dynamic anti-vibration notch filters",
        status: "verified",
      },
      {
        name: "Real-time Telemetry & Thermal Monitoring",
        category: "embedded-control",
        specification: "Calibrated winding thermistors and MOSFET temperature sensors with automatic derating",
        purpose: "Prevents insulation breakdown and premature mechanical failure",
        status: "verified",
      },
      {
        name: "Industrial Fieldbus Protocol Stack",
        category: "embedded-control",
        specification: "EtherCAT (CoE) CiA 402 or CANopen DS402 with <1 ms jitter",
        purpose: "Seamless cyclic synchronous position (CSP) integration with Beckhoff, Omron, and CODESYS controllers",
        status: "verified",
      },
      {
        name: "Spring-Applied Mechanical Holding Brake",
        category: "optional-accessory",
        specification: "24V DC failsafe electromagnetic brake with zero-power gravity holding",
        purpose: "Prevents arm droop on emergency stop or primary power interruption",
        status: "configurable",
      },
    ],
    intelligenceCapabilities: [
      {
        title: "Closed-Loop Position, Velocity & Torque Control",
        description: "Embedded field-oriented control executes sub-millisecond cascaded loops locally inside the actuator casing, reducing fieldbus bus bandwidth and latency.",
        verificationStatus: "verified",
        evidence: "Verified on INDUS Dyno Bench TB-04 under 100% continuous rated torque at 20°C ambient.",
      },
      {
        title: "Dual-Encoder Torsional Wind-Up Compensation",
        description: "By reading position at both the motor shaft and the gearhead output flange, the actuator measures and counteracts structural gear deflection under heavy payload.",
        verificationStatus: "verified",
        evidence: "Documented in Whitepaper WP-IRA-2026 'Kinematic Compliance in Hollow-Shaft Joint Actuators'.",
      },
      {
        title: "Continuous Motor & Inverter Thermal Derating",
        description: "On-board temperature sensors sample winding and power-stage heat every 10 ms. The drive applies controlled current tapering before safety trip threshold is reached.",
        verificationStatus: "verified",
        evidence: "Tested against IEC 60034-1 thermal equilibrium standards.",
      },
      {
        title: "Dynamic Tracking Error & Anomaly Reporting",
        description: "Monitors following error against velocity profile. Alerts host PLC via EtherCAT Emergency Objects if mechanical jamming, bearing wear, or load spikes occur.",
        verificationStatus: "verified",
        evidence: "Adheres to CiA 402 drive profile error state machine.",
      },
      {
        title: "Operating Cycle & Energy Telemetry",
        description: "Persistent non-volatile memory logs cumulative rotational cycles, running hours, and peak mechanical loads for scheduled preventive maintenance.",
        verificationStatus: "verified",
        evidence: "Non-volatile EEPROM event journal traceable across firmware revisions.",
      },
    ],
    practicalApplications: [
      {
        applicationName: "Collaborative Robot Joint Articulation (J1–J6 Axes)",
        manufacturingProblem: "Excessive joint backlash, heavy distal arm inertia, and multi-conductor wire routing bottlenecks inside articulating collaborative robot arms.",
        howProductContributes: "Combines frameless brushless motor, zero-backlash harmonic drive, dual 19-bit absolute encoders, and DSP servo drive into a compact hollow-shaft joint module with deterministic 1ms EtherCAT CSP control.",
        applicationEnvironment: "Automated Electronics Assembly & Screwdriving Workcell (Clean indoor shopfloor, 15°C to 30°C).",
        productRole: "Direct articulating joint module for J1 through J6 axes in 6-DOF cobot arm.",
        requiredMotion: "Continuous smooth rotary indexing with ±0.01° angular repeatability and synchronized multi-axis trajectory.",
        integrationComponents: ["Master EtherCAT PLC", "48V DC Regulated Power Supply", "Cat5e Industrial Ethernet M12"],
        requiredSupportingComponents: [
          "Beckhoff TwinCAT 3 / CODESYS SoftPLC Master",
          "48V DC Regulated Industrial Power Supply (DIN Rail)",
          "M12 Cat5e Shielded Industrial Ethernet Bus Cables",
          "Optional 24V Failsafe Holding Brake",
        ],
        engineeringConsiderations: "Calculate dynamic overhung moment and torsional deflection at maximum arm extension; ensure bus voltage ripple remains below 2% at peak acceleration.",
        operationalBenefit: "Eliminates external motor drives and reduces robot hollow arm harness by 70%.",
        expectedBenefits: "Eliminates external cabinet drives, shrinks internal robot wiring loom by 70%, and achieves repeatable positioning within ±10 arcsec.",
        designLimitations: "Not suitable for continuous stall operation above rated continuous holding torque without thermal cooling.",
        limitationsAndValidation: "Continuous thermal equilibrium must be maintained; continuous holding torque beyond rated S1 envelope requires external thermal dissipation or convective airflow.",
      },
      {
        applicationName: "Precision CNC Rotary Indexing Table & Tool Turret",
        manufacturingProblem: "Backlash wear, station indexing delays, and machining chatter on worm-gear CNC tool changers.",
        howProductContributes: "Direct-drive harmonic gearing provides zero-backlash torque transmission with high torsional rigidity, enabling rapid 90° indexing in under 180 ms.",
        applicationEnvironment: "Metal Cutting & Machining Center (Oil mist, metal chips, ambient vibrations, IP65 enclosure).",
        productRole: "Direct-drive CNC indexing table and multi-position rotary tool changer.",
        requiredMotion: "Rapid 90° indexing in <180 ms with zero mechanical play and rigid position clamping.",
        integrationComponents: ["Fanuc / Siemens CNC I/O Interface", "External 24V Brake Release Relay", "Sealed IP65 M12 Connectors"],
        requiredSupportingComponents: [
          "Siemens SINUMERIK / Fanuc 31i CNC I/O Interface",
          "External 24V DC Brake Release Relay",
          "IP65 Heavy-Duty M12 Power & Feedback Cabling",
        ],
        engineeringConsiderations: "Verify that peak cutting reaction forces do not exceed allowable radial bearing load (Fr = 3200 N for size 090); decouple high-vibration cutting coolant from seal interfaces.",
        operationalBenefit: "Reduces station change cycle from 1.2s to 0.4s while dampening machining vibrations.",
        expectedBenefits: "Cuts tool change cycle time from 1.2s to 0.4s and eliminates mechanical backlash adjustments over 20,000 operating hours.",
        designLimitations: "Radial cutting forces must not exceed allowable moment load on output bearing.",
        limitationsAndValidation: "Radial cutting reaction forces must remain strictly within envelope limits; not rated for submerged coolant operations without secondary IP67 enclosure.",
      },
      {
        applicationName: "Pharmaceutical & Semiconductor Vision Inspection Spindle",
        manufacturingProblem: "Thermal drift, rotational jitter, and encoder synchronization lag causing blurred barcode and defect detection on high-speed bottling carousels.",
        howProductContributes: "Low-cogging permanent-magnet rotor paired with 19-bit optical encoder delivers ultra-smooth sub-rpm velocity stability and zero-jitter camera trigger synchronization.",
        applicationEnvironment: "High-Speed Pharmaceutical Bottling Line (Cleanroom Grade B / washdown fringe, 18°C to 25°C).",
        productRole: "Precision rotary orientation spindle for bottle neck barcode inspection.",
        requiredMotion: "360° continuous rotation synchronized with upstream camera trigger at up to 120 rpm.",
        integrationComponents: ["Machine Vision Trigger Sensor", "Beckhoff TwinCAT 3 SoftPLC", "48V DC Battery / Bus"],
        requiredSupportingComponents: [
          "High-Speed Machine Vision Camera & Optical Trigger",
          "Industrial PC Running EtherCAT Master",
          "Regulated 48V DC Battery Bus or Low-Noise Power Supply",
        ],
        engineeringConsiderations: "Ambient cleanroom temperature must be maintained between 15°C and 30°C; electromagnetic interference on adjacent vision cables must be mitigated by shielded twisted-pair routing.",
        operationalBenefit: "Sub-millisecond synchronization ensures 100% inspection yield at 300 bottles/minute.",
        expectedBenefits: "Guarantees 100% inline quality verification at throughputs up to 300 bottles per minute with zero motion blur.",
        designLimitations: "Ambient temperature must remain between 0°C and +45°C. Direct steam cleaning requires washdown boot.",
        limitationsAndValidation: "Direct steam or harsh caustic washdown cleaning requires optional PTFE IP67 seal package.",
      },
    ],
    specificationTable: [
      {
        parameter: "Rated Continuous Torque",
        unit: "Nm",
        category: "Mechanical",
        ratingType: "Continuous",
        models: { "IND-IRA-070": "35", "IND-IRA-090": "85", "IND-IRA-115": "175", "IND-IRA-142": "280" },
        testCondition: "At 25°C ambient, S1 continuous duty, motor winding ≤ 105°C",
        status: "verified",
      },
      {
        parameter: "Peak Acceleration Torque",
        unit: "Nm",
        category: "Mechanical",
        ratingType: "Peak",
        models: { "IND-IRA-070": "90", "IND-IRA-090": "210", "IND-IRA-115": "420", "IND-IRA-142": "700" },
        testCondition: "Duration ≤ 1.0 sec, duty factor ≤ 10%",
        status: "verified",
      },
      {
        parameter: "Rated Output Speed",
        unit: "rpm",
        category: "Kinematics",
        ratingType: "Continuous",
        models: { "IND-IRA-070": "45", "IND-IRA-090": "35", "IND-IRA-115": "30", "IND-IRA-142": "25" },
        testCondition: "At 48V DC nominal bus supply voltage",
        status: "verified",
      },
      {
        parameter: "Maximum Output Speed",
        unit: "rpm",
        category: "Kinematics",
        ratingType: "Peak",
        models: { "IND-IRA-070": "90", "IND-IRA-090": "70", "IND-IRA-115": "60", "IND-IRA-142": "50" },
        testCondition: "Intermittent duty at max inverter commutation frequency",
        status: "verified",
      },
      {
        parameter: "Positioning Repeatability",
        unit: "arcsec",
        category: "Kinematics",
        ratingType: "Nominal",
        models: { "IND-IRA-070": "±15", "IND-IRA-090": "±12", "IND-IRA-115": "±10", "IND-IRA-142": "±10" },
        testCondition: "ISO 230-2 bilateral repeatability on optical encoder bench",
        status: "verified",
      },
      {
        parameter: "Gearhead Backlash",
        unit: "arcmin",
        category: "Mechanical",
        ratingType: "Nominal",
        models: { "IND-IRA-070": "< 1.0", "IND-IRA-090": "< 1.0", "IND-IRA-115": "< 0.8", "IND-IRA-142": "< 0.8" },
        testCondition: "At ±3% of rated torque applied to output shaft",
        status: "verified",
      },
      {
        parameter: "Nominal DC Bus Voltage",
        unit: "V DC",
        category: "Electrical",
        ratingType: "Nominal",
        models: { "IND-IRA-070": "48", "IND-IRA-090": "48", "IND-IRA-115": "48", "IND-IRA-142": "48" },
        testCondition: "Permissible range 24V to 56V DC",
        status: "verified",
      },
      {
        parameter: "Rated Continuous Current",
        unit: "A rms",
        category: "Electrical",
        ratingType: "Continuous",
        models: { "IND-IRA-070": "6.5", "IND-IRA-090": "11.0", "IND-IRA-115": "18.5", "IND-IRA-142": "26.0" },
        testCondition: "Sine-wave vector commutation at 20 kHz PWM",
        status: "verified",
      },
      {
        parameter: "Allowable Radial Load (Fr)",
        unit: "N",
        category: "Mechanical",
        ratingType: "Envelope",
        models: { "IND-IRA-070": "1800", "IND-IRA-090": "3200", "IND-IRA-115": "5400", "IND-IRA-142": "8200" },
        testCondition: "Applied at midpoint of output flange, L10h bearing life ≥ 20,000h",
        status: "verified",
      },
      {
        parameter: "Allowable Axial Load (Fa)",
        unit: "N",
        category: "Mechanical",
        ratingType: "Envelope",
        models: { "IND-IRA-070": "1400", "IND-IRA-090": "2600", "IND-IRA-115": "4500", "IND-IRA-142": "6800" },
        testCondition: "Static axial thrust limit",
        status: "verified",
      },
      {
        parameter: "Ingress Protection (IP)",
        unit: "Rating",
        category: "Thermal & Environmental",
        ratingType: "Nominal",
        models: { "IND-IRA-070": "IP65", "IND-IRA-090": "IP65", "IND-IRA-115": "IP65", "IND-IRA-142": "IP65" },
        testCondition: "IEC 60529 dust tight and protected against water jets",
        status: "verified",
      },
    ],
    modelVariants: [
      {
        modelCode: "IND-IRA-070-50",
        nominalTorqueOrForce: "35 Nm",
        peakTorqueOrForce: "90 Nm",
        ratedSpeed: "45 rpm",
        maxSpeed: "90 rpm",
        continuousCurrent: "6.5 A",
        peakCurrent: "18.0 A",
        encoderResolution: "19-bit Absolute BiSS-C",
        gearRatio: "50:1",
        backlash: "< 1.0 arcmin",
        flangeSizeMm: "Ø70 mm",
        massKg: "1.85 kg",
        ipRating: "IP65",
        interfaces: "EtherCAT CoE / CANopen DS402 (M12) · 48V DC Bus",
        environmentalSuitability: "IP65 Enclosure · 0°C to +50°C Ambient · Natural Convection",
        integrationRequirements: "ISO 9409-1-50 Flange · Ø14mm Center Bore · Optional 24V Brake",
        verifiedStatus: "verified",
      },
      {
        modelCode: "IND-IRA-090-80",
        nominalTorqueOrForce: "85 Nm",
        peakTorqueOrForce: "210 Nm",
        ratedSpeed: "35 rpm",
        maxSpeed: "70 rpm",
        continuousCurrent: "11.0 A",
        peakCurrent: "28.0 A",
        encoderResolution: "19-bit Absolute BiSS-C",
        gearRatio: "80:1",
        backlash: "< 1.0 arcmin",
        flangeSizeMm: "Ø90 mm",
        massKg: "3.40 kg",
        ipRating: "IP65",
        interfaces: "EtherCAT CoE / CANopen DS402 (M12) · 48V DC Bus",
        environmentalSuitability: "IP65 Enclosure · 0°C to +50°C Ambient · Flange Conduction",
        integrationRequirements: "ISO 9409-1-63 Flange · Ø20mm Center Bore · Optional 24V Brake",
        verifiedStatus: "verified",
      },
      {
        modelCode: "IND-IRA-115-100",
        nominalTorqueOrForce: "175 Nm",
        peakTorqueOrForce: "420 Nm",
        ratedSpeed: "30 rpm",
        maxSpeed: "60 rpm",
        continuousCurrent: "18.5 A",
        peakCurrent: "45.0 A",
        encoderResolution: "19-bit Absolute BiSS-C",
        gearRatio: "100:1",
        backlash: "< 0.8 arcmin",
        flangeSizeMm: "Ø115 mm",
        massKg: "6.20 kg",
        ipRating: "IP65",
        interfaces: "EtherCAT CoE / CANopen DS402 (M12) · 48V DC Bus",
        environmentalSuitability: "IP65 Enclosure · 0°C to +45°C Ambient · Forced Air / Flange Sink",
        integrationRequirements: "ISO 9409-1-80 Flange · Ø25mm Center Bore · Optional 24V Brake",
        verifiedStatus: "verified",
      },
      {
        modelCode: "IND-IRA-142-120",
        nominalTorqueOrForce: "280 Nm",
        peakTorqueOrForce: "700 Nm",
        ratedSpeed: "25 rpm",
        maxSpeed: "50 rpm",
        continuousCurrent: "26.0 A",
        peakCurrent: "65.0 A",
        encoderResolution: "19-bit Absolute BiSS-C",
        gearRatio: "120:1",
        backlash: "< 0.8 arcmin",
        flangeSizeMm: "Ø142 mm",
        massKg: "10.8 kg",
        ipRating: "IP65",
        interfaces: "EtherCAT CoE / CANopen DS402 (M12) · 48V DC Bus",
        environmentalSuitability: "IP65 Enclosure · 0°C to +45°C Ambient · Forced Air / Flange Sink",
        integrationRequirements: "ISO 9409-1-100 Flange · Ø32mm Center Bore · Optional 24V Brake",
        verifiedStatus: "verified",
      },
    ],
    engineeringBenefits: [
      {
        technicalFeature: "Dual 19-Bit Absolute Optical / Magnetic Encoders",
        engineeringEffect: "Directly measures gearhead output deflection and dynamic torsional wind-up under varying payload.",
        customerBenefit: "Maintains ±10 arcsec positional repeatability, preventing cumulative kinematic drift and reducing scrap in precision assembly.",
        operatingConditions: "Valid within rated continuous torque envelope (≤175 Nm on IND-IRA-115) and ambient temperatures between 10°C and 45°C.",
      },
      {
        technicalFeature: "Zero-Backlash Strain-Wave Gearhead (< 1.0 arcmin)",
        engineeringEffect: "Eliminates gear teeth clearance and reversal deadband during high-speed directional changes.",
        customerBenefit: "Enables smooth micro-stepping and vibration-free motion tracking during continuous contouring and dispensing paths.",
        operatingConditions: "Continuous lubrication with factory synthetic grease; input speed ≤ 3000 rpm.",
      },
      {
        technicalFeature: "Integrated 48V DC FOC Vector Drive & Space-Vector Inverter",
        engineeringEffect: "Eliminates long motor power and feedback wiring, executing 20 kHz current loops directly adjacent to motor windings.",
        customerBenefit: "Shrinks machine electrical cabinet footprint by 80%, cuts cabling harness mass by 70%, and minimizes electromagnetic interference (EMI).",
        operatingConditions: "Requires stabilized 48V DC bus (ripple < 2%) and adequate thermal conduction to machine mounting structure.",
      },
      {
        technicalFeature: "On-Board Stator & Inverter Real-Time Thermal Sensing",
        engineeringEffect: "Continuously monitors winding thermistors and MOSFET temperatures, applying graceful algorithmic current derating.",
        customerBenefit: "Prevents catastrophic motor burnout and unexpected mid-shift shutdowns during hot summer production runs.",
        operatingConditions: "Ambient temperature ≤ 50°C; maximum allowable internal winding temperature 115°C.",
      },
      {
        technicalFeature: "High-Density Concentrated Neodymium Rotor Design",
        engineeringEffect: "Yields high continuous torque-to-weight ratio (up to 25.9 Nm/kg) with minimal rotor inertia.",
        customerBenefit: "Allows higher joint acceleration without motor overheating, directly shortening cycle time in pick-and-place tasks.",
        operatingConditions: "Peak duty factor ≤ 10% with acceleration duration ≤ 1.0 second.",
      },
    ],
    integrationSpecs: {
      motorDrives: "Integrated on-board DSP servo drive with field-oriented vector control. Requires external 48V DC bus.",
      mechanicalMounting: "ISO 9409-1 robot flange compatible tapped face. Center through-hole for internal cable routing.",
      electricalRequirements: "48V DC nominal (24V–56V DC range). Separate 24V logic/brake supply recommended.",
      communicationProtocols: ["EtherCAT (CoE / CiA 402)", "CANopen (DS402)", "Modbus RTU (Service / Config)"],
      supportedControllers: ["Beckhoff TwinCAT", "Omron NJ/NX", "CODESYS V3.5", "Siemens S7-1500 (via Gateway)"],
      safetyStandards: ["EN ISO 13849-1 (Safe Torque Off SIL2 / PLd)", "IEC 60204-1 Machine Safety", "CE Low Voltage Directive"],
    },
    engineeringResources: [
      {
        title: "Intelligent Rotary Actuator Complete Engineering Datasheet",
        docNumber: "DS-IND-IRA-2026-REV4",
        type: "Datasheet",
        format: "PDF",
        fileSize: "4.8 MB",
        verificationLevel: "Verified Specification (ISO 230-2 Lab Audited)",
      },
      {
        title: "3D CAD STEP Geometric Assembly Model (All Flange Sizes)",
        docNumber: "CAD-IND-IRA-PKG-STEP",
        type: "CAD 3D STEP",
        format: "STEP / AP214",
        fileSize: "38.2 MB",
        verificationLevel: "Accurate C.G. and Inertia Matrix Verified",
      },
      {
        title: "Hardware Integration & EtherCAT Commissioning Manual",
        docNumber: "MAN-IND-IRA-ETH-2026",
        type: "User Manual",
        format: "PDF",
        fileSize: "7.1 MB",
        verificationLevel: "Official Documentation",
      },
      {
        title: "CiA 402 Object Dictionary & ESI Configuration File",
        docNumber: "APP-IND-IRA-XML-ESI",
        type: "Integration Guide",
        format: "XML / ESI",
        fileSize: "142 KB",
        verificationLevel: "TwinCAT & CODESYS Validated",
      },
      {
        title: "Electrical Interface & M12 Pinout Schematic",
        docNumber: "WD-IND-IRA-ELEC-REV2",
        type: "Wiring Diagram",
        format: "PDF",
        fileSize: "1.4 MB",
        verificationLevel: "Audited Pinout & STO Directive",
      },
      {
        title: "2D Flange Dimensional Drawings (DXF & PDF)",
        docNumber: "DWG-IND-IRA-FLANGE-2D",
        type: "Dimensional Drawing",
        format: "DXF / PDF",
        fileSize: "3.2 MB",
        verificationLevel: "ISO 9409-1 Flange Patterns",
      },
    ],
  },
  "intelligent-linear-actuator": {
    id: "intelligent-linear-actuator",
    slug: "intelligent-linear-actuator",
    name: "Intelligent Linear Actuator",
    categorySlug: "intelligent-actuators",
    categoryName: "Intelligent Actuators",
    headline: "Closed-loop guided linear displacement with embedded servo drive and absolute stroke feedback.",
    engineeringValueProposition: "Compact electro-mechanical linear slide module combining precision ball screw, linear guides, integrated 48V servo motor, and EtherCAT fieldbus for automated assembly and inspection.",
    headlineSpecs: {
      ratedTorqueOrForce: {
        label: "Rated thrust force",
        value: "650 – 3800",
        unit: "N",
        note: "continuous S1 rating",
      },
      outputSpeed: {
        label: "Linear velocity",
        value: "200 – 1200",
        unit: "mm/s",
        note: "configurable lead screw",
      },
      positionFeedback: {
        label: "Linear repeatability",
        value: "±0.008",
        unit: "mm",
        note: "with magnetic scale",
      },
      integration: {
        label: "Stroke range",
        value: "100 – 1800",
        unit: "mm",
        note: "custom lengths available",
      },
    },
    functionalOverview: "The INDUS Intelligent Linear Actuator (IND-ILA series) replaces multi-component pneumatic and belt cylinders with a fully digitized, programmable electric linear drive. Operating directly on 48V DC, it integrates a high-precision rolled/ground C5 ball screw, dual recirculating ball rails, high-resolution optical scale, and on-board closed-loop vector controller.",
    mechatronicArchitecture: [
      {
        name: "Integrated C5 Precision Ball Screw",
        category: "integrated-hardware",
        specification: "16mm / 20mm screw diameter, 5mm, 10mm, or 20mm lead pitch",
        purpose: "High mechanical efficiency (>90%) and rigid dynamic thrust transfer",
        status: "verified",
      },
      {
        name: "Dual Linear Recirculating Ball Guides",
        category: "integrated-hardware",
        specification: "Gothic arch profile with preloaded bearing blocks",
        purpose: "High yaw, pitch, and roll moment load capacity across entire stroke",
        status: "verified",
      },
      {
        name: "Integrated High-Torque AC Servo Motor",
        category: "integrated-hardware",
        specification: "Direct inline or parallel fold-back coupling with synchronous belt",
        purpose: "Zero backlash motor-to-screw drive transmission",
        status: "verified",
      },
      {
        name: "Linear Absolute Feedback Scale",
        category: "integrated-hardware",
        specification: "1 µm resolution magnetic or optical readhead along extrusion",
        purpose: "Eliminates thermal expansion error and mechanical backlash compensation",
        status: "verified",
      },
    ],
    intelligenceCapabilities: [
      {
        title: "Programmable Force Limiting & Push Mode",
        description: "Controls pressing force dynamically for press-fit assembly, crimping, and delicate packaging without mechanical load cells.",
        verificationStatus: "verified",
        evidence: "Force measurement repeatability tested within ±2.5% of nominal thrust.",
      },
      {
        title: "Adaptive S-Curve & Jerk Limiting Profiles",
        description: "On-board trajectory generation creates smooth acceleration profiles that prevent sloshing of liquids or workpiece vibration.",
        verificationStatus: "verified",
        evidence: "Compliant with ISO 18431 mechanical vibration profiles.",
      },
    ],
    practicalApplications: [
      {
        applicationName: "EV Battery Cell Stacking & Tab Crimping Press",
        manufacturingProblem: "Pneumatic cylinder air leaks, inconsistent press depths, and high compressed air energy consumption.",
        howProductContributes: "Closed-loop electric servo control with programmable thrust push mode guarantees uniform pressure without external load cells.",
        applicationEnvironment: "Automotive Battery Cell Assembly (Dry room cleanroom environment, dew point -40°C).",
        productRole: "Precision cell pressing, electrode stacking, and tab folding slide.",
        requiredMotion: "Controlled 250mm stroke with exact 1200 N press-force dwell for 500 ms.",
        integrationComponents: ["EtherCAT PLC Master", "48V 20A Power Supply", "Emergency Stop Circuit"],
        requiredSupportingComponents: [
          "Beckhoff TwinCAT 3 PLC",
          "Regulated 48V DC 20A Power Supply",
          "Shielded M12 EtherCAT & Power Bus Cabling",
        ],
        engineeringConsiderations: "Verify lead screw critical whirling speed over long stroke; account for dry-room bearing grease degradation.",
        operationalBenefit: "Reduces energy consumption by 82% compared to pneumatics with 100% force data logging.",
        expectedBenefits: "Cuts operating energy costs by 82%, eliminates air compressor maintenance, and provides 100% traceable force/displacement records.",
        designLimitations: "Stroke speed must be limited when operating near screw critical whirling velocity.",
        limitationsAndValidation: "Long stroke units (>1000mm) must be verified against screw critical resonance speed charts under maximum acceleration.",
      },
      {
        applicationName: "High-Speed Vision Inspection Pick-and-Place Gantry",
        manufacturingProblem: "Belt stretch and vibration ringing causing settling delays and blurred camera frames at gantry inspection stations.",
        howProductContributes: "Rigid recirculating linear ball guides paired with 1 µm absolute optical scale eliminate mechanical stretch and achieve sub-millisecond settling.",
        applicationEnvironment: "Electronics SMT & PCB Optical Inspection Line (Clean industrial room).",
        productRole: "X/Y axis overhead scanning slide carrying telecentric camera lens.",
        requiredMotion: "800mm high-speed traverse at 1000 mm/s with ±0.005mm bilateral stop repeatability.",
        integrationComponents: ["High-Resolution Vision Camera", "TwinCAT EtherCAT Master", "24V Logic Bus"],
        requiredSupportingComponents: [
          "Industrial PC with Real-Time Fieldbus Card",
          "M12 Feedback Interface Cable",
          "Dynamic Cable Drag Chain Package",
        ],
        engineeringConsiderations: "Calculate overhung moment load on carriage bearing blocks during maximum Y-axis acceleration.",
        operationalBenefit: "Increases PCB panel inspection throughput by 40% with zero settling overshoot.",
        expectedBenefits: "Shortens position settling time from 120 ms to 15 ms, directly increasing inspection yield and throughput by 40%.",
        designLimitations: "Carriage cantilevers exceeding 250mm require counterbalancing or secondary outboard idler rail.",
        limitationsAndValidation: "Moment loads must not exceed dynamic allowable ratings (My, Mp, Mr) of recirculating guide blocks.",
      },
    ],
    specificationTable: [
      {
        parameter: "Continuous Rated Thrust",
        unit: "N",
        category: "Mechanical",
        ratingType: "Continuous",
        models: { "IND-ILA-050": "650", "IND-ILA-080": "1600", "IND-ILA-110": "3800" },
        testCondition: "At 25°C ambient, S1 duty cycle",
        status: "verified",
      },
      {
        parameter: "Max Acceleration Thrust",
        unit: "N",
        category: "Mechanical",
        ratingType: "Peak",
        models: { "IND-ILA-050": "1400", "IND-ILA-080": "3500", "IND-ILA-110": "7800" },
        testCondition: "Duration ≤ 0.5 sec",
        status: "verified",
      },
      {
        parameter: "Max Linear Speed",
        unit: "mm/s",
        category: "Kinematics",
        ratingType: "Peak",
        models: { "IND-ILA-050": "1200", "IND-ILA-080": "1000", "IND-ILA-110": "800" },
        testCondition: "Lead 20mm screw at 3000 rpm motor speed",
        status: "verified",
      },
      {
        parameter: "Repeatability (Bilateral)",
        unit: "mm",
        category: "Kinematics",
        ratingType: "Nominal",
        models: { "IND-ILA-050": "±0.008", "IND-ILA-080": "±0.005", "IND-ILA-110": "±0.005" },
        testCondition: "ISO 230-2 test standard with linear glass scale",
        status: "verified",
      },
    ],
    modelVariants: [
      {
        modelCode: "IND-ILA-050-B10",
        nominalTorqueOrForce: "650 N",
        peakTorqueOrForce: "1400 N",
        ratedSpeed: "600 mm/s",
        maxSpeed: "1200 mm/s",
        continuousCurrent: "5.5 A",
        peakCurrent: "14.0 A",
        encoderResolution: "1 µm Linear Scale",
        strokeRangeMm: "100 – 800 mm",
        flangeSizeMm: "55 x 65 mm",
        massKg: "3.2 kg + 0.35kg/100mm",
        ipRating: "IP54 / IP65 sealed",
        verifiedStatus: "verified",
      },
      {
        modelCode: "IND-ILA-080-B16",
        nominalTorqueOrForce: "1600 N",
        peakTorqueOrForce: "3500 N",
        ratedSpeed: "500 mm/s",
        maxSpeed: "1000 mm/s",
        continuousCurrent: "9.5 A",
        peakCurrent: "24.0 A",
        encoderResolution: "1 µm Linear Scale",
        strokeRangeMm: "100 – 1400 mm",
        flangeSizeMm: "80 x 95 mm",
        massKg: "6.8 kg + 0.65kg/100mm",
        ipRating: "IP54 / IP65 sealed",
        verifiedStatus: "verified",
      },
      {
        modelCode: "IND-ILA-110-B25",
        nominalTorqueOrForce: "3800 N",
        peakTorqueOrForce: "7800 N",
        ratedSpeed: "400 mm/s",
        maxSpeed: "800 mm/s",
        continuousCurrent: "16.0 A",
        peakCurrent: "38.0 A",
        encoderResolution: "0.5 µm Linear Scale",
        strokeRangeMm: "150 – 1800 mm",
        flangeSizeMm: "110 x 125 mm",
        massKg: "12.5 kg + 1.1kg/100mm",
        ipRating: "IP54 / IP65 sealed",
        verifiedStatus: "verified",
      },
    ],
    engineeringBenefits: [
      {
        technicalFeature: "Integrated C5 Precision Ground Ball Screw & Direct Servo Coupling",
        engineeringEffect: "Eliminates belt compliance and pneumatic compressibility, delivering rigid mechanical drive with >90% power efficiency.",
        customerBenefit: "Enables precise programmable position and thrust control with ±0.005mm bilateral repeatability.",
        operatingConditions: "Lubricated with synthetic grease every 5000 km travel; linear speed ≤ 1200 mm/s.",
      },
      {
        technicalFeature: "Dual Gothic-Arch Recirculating Linear Ball Guides",
        engineeringEffect: "Provides high dynamic yaw, pitch, and roll moment load resistance across strokes up to 1800mm.",
        customerBenefit: "Allows direct mounting of heavy tooling or grippers without requiring auxiliary external guide shafts.",
        operatingConditions: "Applied moments must remain within dynamic catalog limits: My ≤ 280 Nm, Mp ≤ 280 Nm, Mr ≤ 340 Nm (Size 110).",
      },
      {
        technicalFeature: "1 µm High-Resolution Absolute Optical Linear Scale",
        engineeringEffect: "Directly samples carriage linear position, bypassing screw thermal expansion and mechanical lead errors.",
        customerBenefit: "Guarantees sub-micron positioning accuracy in high-yield semiconductor and EV battery assembly.",
        operatingConditions: "Ambient operating temperature between 15°C and 35°C; optical scale protected by IP54 magnetic stainless seal band.",
      },
    ],
    integrationSpecs: {
      motorDrives: "Integrated 48V DC brushless servo drive inside base extrusion housing.",
      mechanicalMounting: "T-slot nut channels along bottom and sides; metric dowel pin bores.",
      electricalRequirements: "48V DC main power + 24V DC logic supply.",
      communicationProtocols: ["EtherCAT (CoE)", "CANopen", "IO-Link (Status / Config)"],
      supportedControllers: ["TwinCAT", "Siemens TIA", "Rockwell Studio 5000 via Gateway"],
      safetyStandards: ["ISO 13849-1 STO", "IEC 61800-5-2"],
    },
    engineeringResources: [
      {
        title: "Intelligent Linear Actuator Full Datasheet & Sizing Charts",
        docNumber: "DS-IND-ILA-2026-REV2",
        type: "Datasheet",
        format: "PDF",
        fileSize: "5.1 MB",
        verificationLevel: "Verified Specification",
      },
      {
        title: "Configurable 3D CAD STEP Solid Geometry",
        docNumber: "CAD-IND-ILA-VAR-STEP",
        type: "CAD 3D STEP",
        format: "STEP",
        fileSize: "28.4 MB",
        verificationLevel: "Parametric CAD",
      },
    ],
  },
};

export function getIntelligentActuator(slug: string): IntelligentActuatorItem | undefined {
  const norm = slug.toLowerCase().trim();
  return (
    INTELLIGENT_ACTUATORS_DATA[norm] ||
    Object.values(INTELLIGENT_ACTUATORS_DATA).find(
      (a) => a.id === norm || a.slug === norm || a.name.toLowerCase().includes(norm)
    )
  );
}

export function getAllIntelligentActuators(): IntelligentActuatorItem[] {
  return Object.values(INTELLIGENT_ACTUATORS_DATA);
}
