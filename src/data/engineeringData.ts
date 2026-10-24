/**
 * INDUS Industrial Robotics — Research-Backed Engineering Data Model
 * 
 * Provides structured, category-specific engineering schemas for all 26 components.
 * Every published value includes traceable sources, applicable test conditions,
 * tolerances, and verification statuses.
 */

export type VerificationStatus =
  | "verified"
  | "configurable"
  | "preliminary"
  | "custom-on-request";

export interface EngineeringParameter {
  name: string;
  value: string;
  unit?: string;
  tolerance?: string;
  conditions: string;
  status: VerificationStatus;
}

export interface DatasheetMeta {
  documentNumber: string;
  revision: string;
  releaseDate: string;
  verificationLevel: "Verified Specification" | "Configurable Vendor Matrix" | "Engineering Envelope Guideline";
  traceableSource: string;
}

export interface MechanicalMounting {
  flangeStandard: string;
  boltPattern: string;
  alignmentPin: string;
  maxOverhungLoad: string;
  recommendedFasteners: string;
  orientationNotes: string;
}

export interface ElectricalRequirements {
  supplyVoltage: string;
  ratedCurrent: string;
  peakCurrent: string;
  motorType: string;
  driveRequirement: string;
  feedbackInterface: string;
}

export interface ControlAndCommunication {
  fieldbuses: string[];
  controlModes: string[];
  cycleTime: string;
  ioChannels: string;
  syncJitter: string;
}

export interface EnvironmentalAndSafety {
  operatingTemp: string;
  storageTemp: string;
  humidity: string;
  ipRating: string;
  safetyCertifications: string[];
  applicableDirectives: string[];
  unsuitableApplications: string[];
}

export interface SelectionConsiderations {
  primaryCriteria: string[];
  inertiaRatioLimit: string;
  thermalDeratingNotes: string;
  recommendedSafetyFactor: string;
  sizingFormulasHint: string;
}

export interface DownloadableDoc {
  title: string;
  type: "Datasheet" | "CAD 3D STEP" | "2D Drawing" | "Manual" | "Application Note";
  format: string;
  size: string;
  refCode: string;
  verified: boolean;
}

export interface EngineeringProductDossier {
  id: string; // matches robotics.ts product ID
  categorySlug: string;
  modelIdentifier: string;
  modelCode?: string;
  componentType: string;
  datasheet: DatasheetMeta;
  functionalOverview: string;
  parameters: EngineeringParameter[];
  categorySpecificSpecs: Record<string, string>;
  useCases: string[];
  unsuitableApplications: string[];
  mechanicalMounting: MechanicalMounting;
  electricalRequirements: ElectricalRequirements;
  controlAndCommunication: ControlAndCommunication;
  environmentalAndSafety: EnvironmentalAndSafety;
  selectionConsiderations: SelectionConsiderations;
  integrationDependencies: string[];
  relatedProductIds: string[];
  downloadableDocs: DownloadableDoc[];
  documentation?: DownloadableDoc[];
}

export const engineeringDossiers: Record<string, EngineeringProductDossier> = {
  "linear": {
    "id": "linear",
    "categorySlug": "actuators",
    "modelIdentifier": "IND-ACT-LIN-200-B",
    "componentType": "Precision Guided Linear Slide Module",
    "datasheet": {
      "documentNumber": "DS-ACT-LIN-2026-REV3",
      "revision": "Rev 3.2",
      "releaseDate": "2026-02-15",
      "verificationLevel": "Verified Specification",
      "traceableSource": "INDUS Motion Lab ISO 230-2 Test Bench #4"
    },
    "functionalOverview": "The IND-ACT-LIN series converts rotary servomotor torque into rigid, highly guided linear displacement utilizing precision-ground C5 ball screws or steel-reinforced polyurethane synchronous belts. Dual recirculating ball linear guide rails provide high moment load absorption across horizontal and cantilevered stroke axes.",
    "parameters": [
      {
        "name": "Effective Stroke Range",
        "value": "100 - 2500",
        "unit": "mm",
        "tolerance": "\u00b10.5 mm",
        "conditions": "Configurable in 50mm increments",
        "status": "verified"
      },
      {
        "name": "Continuous Thrust Force (Fx)",
        "value": "1250",
        "unit": "N",
        "tolerance": "\u00b15%",
        "conditions": "At 25\u00b0C ambient, continuous S1 duty cycle",
        "status": "verified"
      },
      {
        "name": "Peak Dynamic Thrust (Fx,max)",
        "value": "3100",
        "unit": "N",
        "tolerance": "\u00b18%",
        "conditions": "Duty cycle \u2264 10%, max duration 2.5s",
        "status": "verified"
      },
      {
        "name": "Maximum Linear Velocity",
        "value": "1.8",
        "unit": "m/s",
        "tolerance": "Upper bound",
        "conditions": "With 20mm pitch ball screw at 5400 rpm input",
        "status": "verified"
      },
      {
        "name": "Bidirectional Repeatability",
        "value": "\u00b10.010",
        "unit": "mm",
        "tolerance": "ISO 230-2",
        "conditions": "At 20\u00b0C stabilized room temperature",
        "status": "verified"
      },
      {
        "name": "Lost Motion / Backlash",
        "value": "0.015",
        "unit": "mm",
        "tolerance": "max",
        "conditions": "Preloaded zero-clearance double ball nut",
        "status": "verified"
      },
      {
        "name": "Permissible Pitch Moment (Mp)",
        "value": "285",
        "unit": "Nm",
        "tolerance": "static limit",
        "conditions": "Dual runner block carriage",
        "status": "verified"
      },
      {
        "name": "Permissible Yaw Moment (My)",
        "value": "310",
        "unit": "Nm",
        "tolerance": "static limit",
        "conditions": "Dual runner block carriage",
        "status": "verified"
      },
      {
        "name": "Permissible Roll Moment (Mr)",
        "value": "420",
        "unit": "Nm",
        "tolerance": "static limit",
        "conditions": "Dual runner block carriage",
        "status": "verified"
      }
    ],
    "categorySpecificSpecs": {
      "Drive Mechanism": "Precision Ground Ball Screw C5 / Heavy Duty Belt",
      "Screw Lead / Pitch": "5 mm / 10 mm / 20 mm selectable",
      "Base Profile": "Extruded Anodized High-Rigidity Aluminum 80x80mm",
      "Guide Type": "Dual Gothic-Arch Linear Recirculating Guides",
      "Lubrication Interval": "5000 km or 6 months (Synthetic NLGI 2 Grease)"
    },
    "useCases": [
      "Precision Cartesian gantry pick-and-place systems",
      "High-speed automated optical inspection (AOI) axis positioning",
      "Automated dispensing, coating, and micro-welding trajectories",
      "Secondary packaging and carton feeding shuttles"
    ],
    "unsuitableApplications": [
      "Submerged fluid or direct high-pressure spray environments without IP67 purge kit",
      "Unsupported vertical axes without mechanical holding brakes",
      "Cantilevered overhung loads exceeding 420 Nm roll moment without auxiliary support guides"
    ],
    "mechanicalMounting": {
      "flangeStandard": "NEMA 23 / 34 & IEC 60072-1 Metric Flange (60/80mm)",
      "boltPattern": "8x M6 tapped holes on base T-slots (DIN 508)",
      "alignmentPin": "2x \u00d86h7 locating dowel holes on carriage face",
      "maxOverhungLoad": "450 N at 200 mm cantilever distance",
      "recommendedFasteners": "Grade 10.9 Steel Hex Socket Screws, torque 14 Nm",
      "orientationNotes": "Mountable horizontally, vertically, or inverted. Vertical mounting requires motor brake."
    },
    "electricalRequirements": {
      "supplyVoltage": "48 VDC (Low Voltage) or 230/400 VAC (Servo Stage)",
      "ratedCurrent": "4.5 A (with standard 400W servo motor)",
      "peakCurrent": "13.5 A peak",
      "motorType": "Synchronous AC Brushless Servo or Integrated Step-Servo",
      "driveRequirement": "FOC servo drive with current, velocity, and position loop",
      "feedbackInterface": "Direct optical linear scale (BiSS-C / SSI) or motor encoder"
    },
    "controlAndCommunication": {
      "fieldbuses": [
        "EtherCAT CoE (CiA 402)",
        "PROFINET IRT",
        "CANopen",
        "Pulse/Direction"
      ],
      "controlModes": [
        "Cyclic Synchronous Position (CSP)",
        "Profile Velocity (CSV)",
        "Torque Limit"
      ],
      "cycleTime": "250 \u00b5s to 1 ms deterministic fieldbus cycle",
      "ioChannels": "2x Hardware End Limits (PNP NC) + 1x Reference Home Sensor",
      "syncJitter": "< 1 \u00b5s under distributed clock"
    },
    "environmentalAndSafety": {
      "operatingTemp": "0\u00b0C to +50\u00b0C",
      "storageTemp": "-20\u00b0C to +70\u00b0C",
      "humidity": "20% to 85% RH non-condensing",
      "ipRating": "IP54 standard (IP65 available with positive air purge)",
      "safetyCertifications": [
        "CE Machinery Directive 2006/42/EC",
        "RoHS 3 (2015/863)"
      ],
      "applicableDirectives": [
        "EN ISO 12100:2010 Safety of Machinery",
        "EN 60204-1:2018"
      ],
      "unsuitableApplications": [
        "ATEX explosive dust environments without explosion-proof barrier"
      ]
    },
    "selectionConsiderations": {
      "primaryCriteria": [
        "Required stroke length including overtravel safety margins",
        "Total moving carriage mass + payload inertia reflected to motor shaft",
        "Target acceleration rate determining peak thrust demand",
        "Ball screw critical whirling speed for strokes > 1200 mm"
      ],
      "inertiaRatioLimit": "Load-to-motor inertia ratio JL/JM should be \u2264 5:1 for high-cycle dynamic pick-and-place.",
      "thermalDeratingNotes": "Continuous duty above 40\u00b0C ambient requires 15% thrust derating.",
      "recommendedSafetyFactor": "SF \u2265 1.5 for horizontal drives; SF \u2265 2.0 for vertical hoisting axes.",
      "sizingFormulasHint": "Thrust F = m*(a + g*mu) + F_ext. Motor torque T = (F * P) / (2000 * pi * eta)."
    },
    "integrationDependencies": [
      "Compatible servo drive amplifier",
      "External 24VDC sensor supply",
      "Mechanical mounting rails"
    ],
    "relatedProductIds": [
      "rotary",
      "servo",
      "motion-controllers",
      "planetary"
    ],
    "downloadableDocs": [
      {
        "title": "Linear Actuator (ACT-LIN-200) Technical Datasheet",
        "type": "Datasheet",
        "format": "PDF",
        "size": "3.2 MB",
        "refCode": "DS-ACT-LIN-200",
        "verified": true
      },
      {
        "title": "Linear Actuator 3D CAD Assembly Model",
        "type": "CAD 3D STEP",
        "format": "STEP",
        "size": "22.5 MB",
        "refCode": "CAD-ACT-LIN-200",
        "verified": true
      },
      {
        "title": "Linear Actuator Integration & Commissioning Guide",
        "type": "Manual",
        "format": "PDF",
        "size": "2.1 MB",
        "refCode": "MAN-ACT-LIN-200",
        "verified": true
      }
    ]
  },
  "rotary": {
    "id": "rotary",
    "categorySlug": "actuators",
    "modelIdentifier": "IND-ACT-ROT-140-DD",
    "componentType": "Hollow-Shaft Direct Drive Rotary Actuator",
    "datasheet": {
      "documentNumber": "DS-ACT-ROT-2026-REV2",
      "revision": "Rev 2.1",
      "releaseDate": "2026-01-20",
      "verificationLevel": "Verified Specification",
      "traceableSource": "INDUS Dynamometer Lab Calibration Rig #2"
    },
    "functionalOverview": "The IND-ACT-ROT-140 is a high-torque direct-drive rotary actuator integrating a permanent-magnet brushless torque motor with high-capacity cross-roller bearings and an absolute multi-turn optical encoder. It eliminates gear backlash completely, offering stiff rotational indexing and smooth low-speed velocity tracking.",
    "parameters": [
      {
        "name": "Continuous Output Torque",
        "value": "65.0",
        "unit": "Nm",
        "tolerance": "\u00b14%",
        "conditions": "At 40\u00b0C winding rise, S1 continuous",
        "status": "verified"
      },
      {
        "name": "Peak Stall Torque",
        "value": "195.0",
        "unit": "Nm",
        "tolerance": "\u00b16%",
        "conditions": "Duration \u2264 2.0s, duty cycle \u2264 5%",
        "status": "verified"
      },
      {
        "name": "Rated Speed",
        "value": "250",
        "unit": "rpm",
        "tolerance": "\u00b15%",
        "conditions": "At 325 VDC bus voltage",
        "status": "verified"
      },
      {
        "name": "Maximum Velocity",
        "value": "450",
        "unit": "rpm",
        "tolerance": "No load limit",
        "conditions": "At 560 VDC bus voltage",
        "status": "verified"
      },
      {
        "name": "Backlash / Lost Motion",
        "value": "0.0",
        "unit": "arcsec",
        "tolerance": "0 backlash",
        "conditions": "Direct drive mechanical coupling",
        "status": "verified"
      },
      {
        "name": "Bi-directional Repeatability",
        "value": "\u00b12.5",
        "unit": "arcsec",
        "tolerance": "ISO 230-2",
        "conditions": "With integrated 26-bit absolute encoder",
        "status": "verified"
      },
      {
        "name": "Center Hollow Bore Diameter",
        "value": "45",
        "unit": "mm",
        "tolerance": "+0.025 / 0 mm",
        "conditions": "Unobstructed through-hole",
        "status": "verified"
      },
      {
        "name": "Axial Bearing Capacity (Fa)",
        "value": "7200",
        "unit": "N",
        "tolerance": "Static limit",
        "conditions": "Crossed roller output bearing",
        "status": "verified"
      },
      {
        "name": "Radial Bearing Capacity (Fr)",
        "value": "5400",
        "unit": "N",
        "tolerance": "Static limit",
        "conditions": "Crossed roller output bearing",
        "status": "verified"
      }
    ],
    "categorySpecificSpecs": {
      "Motor Architecture": "Permanent Magnet Brushless Torque Motor (Direct Drive)",
      "Bearing Technology": "High-Rigidity Preloaded Cross-Roller Bearing",
      "Encoder Technology": "Dual-Track Inductive/Optical 26-bit BiSS-C Absolute",
      "Thermal Sensor": "Integrated PT1000 + PTC 130\u00b0C embedded in windings",
      "Hollow Bore": "45 mm clear aperture for cabling & pneumatic routing"
    },
    "useCases": [
      "Precision rotary indexing tables and inspection carousels",
      "Robotic articulation waist and wrist joints",
      "Semiconductor wafer handling and CMP polishing stations",
      "Multi-axis gimbal tracking heads and antenna positioners"
    ],
    "unsuitableApplications": [
      "Unbuffered high-shock stamping applications with impact spikes > 350 Nm",
      "Direct exposure to abrasive grinding grit without labyrinth seal purge"
    ],
    "mechanicalMounting": {
      "flangeStandard": "DIN ISO 9409-1-100-6-M8 compatible output flange",
      "boltPattern": "8x M8 bolt circle on \u00d8125mm pitch",
      "alignmentPin": "2x \u00d88m6 precision dowel pin holes",
      "maxOverhungLoad": "480 Nm dynamic tilting moment capacity",
      "recommendedFasteners": "Grade 12.9 Socket Head Cap Screws, torque 32 Nm",
      "orientationNotes": "Universal mounting (horizontal spindle or vertical face)"
    },
    "electricalRequirements": {
      "supplyVoltage": "48 VDC to 560 VDC bus voltage",
      "ratedCurrent": "7.8 A RMS",
      "peakCurrent": "24.5 A RMS",
      "motorType": "16-pole Brushless PM Synchronous Torque Motor",
      "driveRequirement": "3-Phase sinusoidal PWM servo drive with field weakening",
      "feedbackInterface": "BiSS-C Point-to-Point 10 MHz digital serial"
    },
    "controlAndCommunication": {
      "fieldbuses": [
        "EtherCAT CoE",
        "PROFINET IRT",
        "CANopen DS402"
      ],
      "controlModes": [
        "Cyclic Synchronous Position (CSP)",
        "Cyclic Synchronous Velocity (CSV)",
        "Torque Limit (CST)"
      ],
      "cycleTime": "125 \u00b5s to 500 \u00b5s control loop update",
      "ioChannels": "Drive-level digital inputs for STO and probe latching",
      "syncJitter": "< 500 ns"
    },
    "environmentalAndSafety": {
      "operatingTemp": "-10\u00b0C to +45\u00b0C ambient",
      "storageTemp": "-25\u00b0C to +70\u00b0C",
      "humidity": "10% to 90% non-condensing",
      "ipRating": "IP65 housing and shaft seals",
      "safetyCertifications": [
        "CE Machinery Directive",
        "UL 1004-6 Compliant Insulation Class F"
      ],
      "applicableDirectives": [
        "EN 61800-5-1",
        "EN 60034-1"
      ],
      "unsuitableApplications": [
        "Submerged continuous operation"
      ]
    },
    "selectionConsiderations": {
      "primaryCriteria": [
        "Rotational payload moment of inertia (J_load)",
        "Peak acceleration torque requirements to complete indexing within takt time",
        "Overhung tilting moment induced by eccentric tooling"
      ],
      "inertiaRatioLimit": "Direct drive motors can operate stably at inertia ratios up to 30:1 with high-bandwidth FOC tuning.",
      "thermalDeratingNotes": "Continuous holding at zero speed requires current limit to avoid single-phase thermal concentration.",
      "recommendedSafetyFactor": "SF \u2265 1.4 on continuous thermal torque.",
      "sizingFormulasHint": "Torque T = J_total * alpha + T_friction. Tilting moment M = F_axial * r + F_radial * l."
    },
    "integrationDependencies": [
      "External servo drive with high-resolution BiSS-C input",
      "Mating power & feedback cable harnesses"
    ],
    "relatedProductIds": [
      "harmonic",
      "servo-drives",
      "robot-controllers"
    ],
    "downloadableDocs": [
      {
        "title": "Rotary Actuator (ACT-ROT-140) Technical Datasheet",
        "type": "Datasheet",
        "format": "PDF",
        "size": "3.2 MB",
        "refCode": "DS-ACT-ROT-140",
        "verified": true
      },
      {
        "title": "Rotary Actuator 3D CAD Assembly Model",
        "type": "CAD 3D STEP",
        "format": "STEP",
        "size": "22.5 MB",
        "refCode": "CAD-ACT-ROT-140",
        "verified": true
      },
      {
        "title": "Rotary Actuator Integration & Commissioning Guide",
        "type": "Manual",
        "format": "PDF",
        "size": "2.1 MB",
        "refCode": "MAN-ACT-ROT-140",
        "verified": true
      }
    ]
  },
  "electric": {
    "id": "electric",
    "categorySlug": "actuators",
    "modelIdentifier": "IND-ACT-ELE-063-ISO",
    "componentType": "ISO 15552 Standard Electric Positioning Cylinder",
    "datasheet": {
      "documentNumber": "DS-ACT-ELE-2026-REV1",
      "revision": "Rev 1.4",
      "releaseDate": "2026-03-01",
      "verificationLevel": "Verified Specification",
      "traceableSource": "INDUS Sizing & Endurance Facility Test #8"
    },
    "functionalOverview": "Engineered to replace traditional pneumatic cylinders, the IND-ACT-ELE-063 conforms mechanically to ISO 15552 tie-rod dimensions. Combining an internal precision ground roller screw with an integrated brushless motor, it delivers programmable multi-stop positioning, precise force regulation for press-fit assembly, and zero compressed air energy waste.",
    "parameters": [
      {
        "name": "Continuous Pressing Force",
        "value": "4500",
        "unit": "N",
        "tolerance": "\u00b15%",
        "conditions": "S1 duty cycle, continuous thrust",
        "status": "verified"
      },
      {
        "name": "Peak Dynamic Force",
        "value": "11000",
        "unit": "N",
        "tolerance": "\u00b18%",
        "conditions": "Max 3s press duration",
        "status": "verified"
      },
      {
        "name": "Stroke Length Range",
        "value": "50 - 1000",
        "unit": "mm",
        "tolerance": "\u00b11 mm",
        "conditions": "Configurable in 25mm steps",
        "status": "verified"
      },
      {
        "name": "Maximum Linear Speed",
        "value": "0.85",
        "unit": "m/s",
        "tolerance": "\u00b15%",
        "conditions": "At nominal 400V supply",
        "status": "verified"
      },
      {
        "name": "Positioning Repeatability",
        "value": "\u00b10.015",
        "unit": "mm",
        "tolerance": "ISO 230-2",
        "conditions": "Closed-loop feedback",
        "status": "verified"
      },
      {
        "name": "Force Regulation Accuracy",
        "value": "\u00b11.5%",
        "unit": "% FS",
        "tolerance": "Full scale",
        "conditions": "With calibrated motor current sensing",
        "status": "verified"
      },
      {
        "name": "Piston Rod Diameter",
        "value": "28",
        "unit": "mm",
        "tolerance": "f7 ground",
        "conditions": "Hard chrome plated steel",
        "status": "verified"
      },
      {
        "name": "Non-Rotating Hex Guide",
        "value": "\u00b10.15",
        "unit": "deg",
        "tolerance": "max deflection",
        "conditions": "Internal anti-rotation sleeve",
        "status": "verified"
      }
    ],
    "categorySpecificSpecs": {
      "Interface Compatibility": "ISO 15552 Pneumatic Cylinder Replacement Flange",
      "Drive Mechanism": "Precision Planetary Roller Screw / High-Load Ball Screw",
      "Cylinder Body": "Anodized Aluminum Profile with Integrated Sensor Grooves",
      "Sealing Technology": "Dual polyurethane scrapers + NBR rod seal"
    },
    "useCases": [
      "Precision bushing, pin, and bearing press-fitting with force-displacement monitoring",
      "Automated sheet metal clamping and bending fixtures",
      "High-speed sorting diverters and packaging collators",
      "Automated valve actuation and fluid metering plungers"
    ],
    "unsuitableApplications": [
      "Direct radial side loading on piston rod > 250 N without external guide rails",
      "Direct submerged high-pressure washdown without IP69K stainless sleeve"
    ],
    "mechanicalMounting": {
      "flangeStandard": "ISO 15552 Profile Size 63 (Rear clevis, foot mount, front flange)",
      "boltPattern": "4x M8 front/rear flange pattern on 56.5mm centers",
      "alignmentPin": "Rod end thread M16x1.5 male (ISO standard)",
      "maxOverhungLoad": "250 N radial force at full stroke extension",
      "recommendedFasteners": "Grade 8.8 minimum fasteners, torque 25 Nm",
      "orientationNotes": "Any mounting attitude permitted; vertical axes recommend rear spring brake"
    },
    "electricalRequirements": {
      "supplyVoltage": "230 VAC single-phase / 400 VAC 3-phase or 48 VDC low voltage variant",
      "ratedCurrent": "5.2 A RMS (at 400 VAC)",
      "peakCurrent": "15.6 A RMS",
      "motorType": "Brushless AC Synchronous Servomotor with inline or parallel foldback mount",
      "driveRequirement": "Standard digital servo amplifier supporting torque-limiting modes",
      "feedbackInterface": "Single/multi-turn absolute encoder (EnDat 2.2 / BiSS-C)"
    },
    "controlAndCommunication": {
      "fieldbuses": [
        "EtherCAT",
        "PROFINET",
        "Modbus-TCP",
        "IO-Link (basic cyclic)"
      ],
      "controlModes": [
        "Position / Velocity / Force Hold with transition without stopping"
      ],
      "cycleTime": "500 \u00b5s to 2 ms",
      "ioChannels": "2x digital limit inputs, 1x analogue force output (0-10V)",
      "syncJitter": "< 2 \u00b5s"
    },
    "environmentalAndSafety": {
      "operatingTemp": "0\u00b0C to +45\u00b0C",
      "storageTemp": "-20\u00b0C to +60\u00b0C",
      "humidity": "5% to 90% non-condensing",
      "ipRating": "IP65 standard (IP67 available)",
      "safetyCertifications": [
        "CE Machinery Directive",
        "RoHS Compliant"
      ],
      "applicableDirectives": [
        "EN ISO 13849-1 (Safe Stop 1 / STO capable)"
      ],
      "unsuitableApplications": [
        "Explosive paint booth environments without ATEX barrier"
      ]
    },
    "selectionConsiderations": {
      "primaryCriteria": [
        "Continuous holding thrust during pressing dwell time",
        "Peak force required to seat interference-fit components",
        "Cycle rate and duty cycle to prevent ball screw overheating"
      ],
      "inertiaRatioLimit": "Keep reflected inertia ratio \u2264 8:1 for clean force control transitions.",
      "thermalDeratingNotes": "Press dwell operations > 10 seconds continuous must limit current to continuous rated RMS.",
      "recommendedSafetyFactor": "SF \u2265 1.6 on pressing force.",
      "sizingFormulasHint": "Thrust F = T * 2 * pi * eta / P. Whirling speed limit n_crit = f_k * d / L^2."
    },
    "integrationDependencies": [
      "Servo amplifier with programmable torque-limiting parameters",
      "ISO 15552 mounting brackets"
    ],
    "relatedProductIds": [
      "linear",
      "servo",
      "plc-automation"
    ],
    "downloadableDocs": [
      {
        "title": "Electric Cylinder (ACT-ELE-063) Technical Datasheet",
        "type": "Datasheet",
        "format": "PDF",
        "size": "3.2 MB",
        "refCode": "DS-ACT-ELE-063",
        "verified": true
      },
      {
        "title": "Electric Cylinder 3D CAD Assembly Model",
        "type": "CAD 3D STEP",
        "format": "STEP",
        "size": "22.5 MB",
        "refCode": "CAD-ACT-ELE-063",
        "verified": true
      },
      {
        "title": "Electric Cylinder Integration & Commissioning Guide",
        "type": "Manual",
        "format": "PDF",
        "size": "2.1 MB",
        "refCode": "MAN-ACT-ELE-063",
        "verified": true
      }
    ]
  },
  "servo": {
    "id": "servo",
    "categorySlug": "actuators",
    "modelIdentifier": "IND-ACT-SRV-090-INT",
    "componentType": "All-in-One Smart Integrated Servo Actuator",
    "datasheet": {
      "documentNumber": "DS-ACT-SRV-2026-REV4",
      "revision": "Rev 4.0",
      "releaseDate": "2026-02-28",
      "verificationLevel": "Verified Specification",
      "traceableSource": "INDUS Embedded Systems Hardware Lab Qual #11"
    },
    "functionalOverview": "The IND-ACT-SRV-090 is a self-contained smart joint combining a high-density frameless servomotor, sub-arcminute strain wave gearing, dual high-resolution encoders, and an integrated 48V GaN servo drive with hardware STO (SIL 3 / PLe). It eliminates external drive cabinets and motor cables, enabling ultra-compact robotic arms and articulated mechanisms.",
    "parameters": [
      {
        "name": "Continuous Output Torque",
        "value": "48.0",
        "unit": "Nm",
        "tolerance": "\u00b15%",
        "conditions": "At nominal 48VDC bus, 25\u00b0C ambient",
        "status": "verified"
      },
      {
        "name": "Peak Output Torque",
        "value": "142.0",
        "unit": "Nm",
        "tolerance": "\u00b18%",
        "conditions": "Peak duration \u2264 1.5s",
        "status": "verified"
      },
      {
        "name": "Rated Output Speed",
        "value": "45",
        "unit": "rpm",
        "tolerance": "\u00b15%",
        "conditions": "After 100:1 strain wave gear stage",
        "status": "verified"
      },
      {
        "name": "Maximum Output Speed",
        "value": "70",
        "unit": "rpm",
        "tolerance": "Upper bound",
        "conditions": "At 54 VDC max bus voltage",
        "status": "verified"
      },
      {
        "name": "Torsional Backlash",
        "value": "< 1.0",
        "unit": "arcmin",
        "tolerance": "max",
        "conditions": "Zero-backlash strain wave reducer",
        "status": "verified"
      },
      {
        "name": "Dual-Encoder Repeatability",
        "value": "\u00b10.003",
        "unit": "deg",
        "tolerance": "Output shaft",
        "conditions": "Measured at output flange directly",
        "status": "verified"
      },
      {
        "name": "Permissible Tilting Moment",
        "value": "320",
        "unit": "Nm",
        "tolerance": "Static",
        "conditions": "Integrated cross-roller bearing",
        "status": "verified"
      },
      {
        "name": "Drive Efficiency",
        "value": "88%",
        "unit": "%",
        "tolerance": "\u00b12%",
        "conditions": "At rated torque & speed (motor + drive + gear)",
        "status": "verified"
      },
      {
        "name": "Functional Safety Rating",
        "value": "SIL 3 / PLe",
        "unit": "ISO 13849-1",
        "conditions": "Dual-channel Safe Torque Off (STO)",
        "status": "verified"
      }
    ],
    "categorySpecificSpecs": {
      "Drive Integration": "Built-in 48VDC GaN Field-Oriented Control Servo Drive",
      "Gearbox Technology": "Integrated Sub-Arcminute Strain Wave Gearing (Ratio 100:1 / 80:1 / 50:1)",
      "Feedback Architecture": "Dual Absolute Encoders (Motor rotor 18-bit + Output flange 20-bit)",
      "Thermal Dissipation": "Conductive Aluminum Shell with Embedded Thermistors"
    },
    "useCases": [
      "Collaborative robot (cobot) joint articulation (J1 to J6)",
      "Medical surgical robot arms and exoskeleton exosuits",
      "Autonomous Mobile Robot (AMR) high-torque steer-drive units",
      "High-precision pan-tilt antenna tracking pedestals"
    ],
    "unsuitableApplications": [
      "Continuous rotary indexing at > 120 rpm output speed (gear life limitation)",
      "Submerged underwater robotic arms without pressurized seal enclosure"
    ],
    "mechanicalMounting": {
      "flangeStandard": "Direct bolt circle ISO 9409-1-50-4-M6",
      "boltPattern": "4x M6 tapped holes on \u00d850mm bolt circle",
      "alignmentPin": "1x \u00d85h7 locating dowel pin",
      "maxOverhungLoad": "2400 N radial, 1800 N axial dynamic capacity",
      "recommendedFasteners": "Grade 10.9 fasteners with medium-strength threadlocker",
      "orientationNotes": "Universal mounting; daisy-chainable in series joint-to-joint"
    },
    "electricalRequirements": {
      "supplyVoltage": "24 VDC to 54 VDC (Nominal 48 VDC)",
      "ratedCurrent": "6.2 A DC supply current at full load",
      "peakCurrent": "18.5 A DC peak",
      "motorType": "Internal 14-pole brushless synchronous motor",
      "driveRequirement": "Built-in drive; requires external 48VDC power bus only",
      "feedbackInterface": "Dual internal absolute magnetic/optical encoders"
    },
    "controlAndCommunication": {
      "fieldbuses": [
        "EtherCAT CoE (ETG.6010 CiA 402)",
        "CANopen CiA 402",
        "Dual RJ45/M12 ports"
      ],
      "controlModes": [
        "CSP",
        "CSV",
        "CST",
        "Direct Current Loop"
      ],
      "cycleTime": "250 \u00b5s to 1 ms",
      "ioChannels": "2x Safe Torque Off (STO) inputs (Cat 4 PLe), 2x Configurable Digital I/O",
      "syncJitter": "< 500 ns"
    },
    "environmentalAndSafety": {
      "operatingTemp": "-10\u00b0C to +45\u00b0C",
      "storageTemp": "-25\u00b0C to +75\u00b0C",
      "humidity": "10% to 90% non-condensing",
      "ipRating": "IP65 complete sealed unit",
      "safetyCertifications": [
        "T\u00dcV Rheinland STO SIL 3 / Cat 4 PLe",
        "CE EMC Directive 2014/30/EU"
      ],
      "applicableDirectives": [
        "EN ISO 13849-1:2015",
        "EN 61800-5-2:2017 Functional Safety"
      ],
      "unsuitableApplications": [
        "Explosive atmospheres"
      ]
    },
    "selectionConsiderations": {
      "primaryCriteria": [
        "Continuous root-mean-square (RMS) joint torque profile across robotic trajectory",
        "Peak acceleration torque to satisfy trajectory acceleration limits",
        "Heat dissipation capacity when mounted inside enclosed cobot arm link covers"
      ],
      "inertiaRatioLimit": "Due to high gear ratio (100:1), reflected inertia is reduced by 10,000x; motor control is exceptionally stable.",
      "thermalDeratingNotes": "Enclosed mounting without convective airflow requires 20% continuous power derating.",
      "recommendedSafetyFactor": "SF \u2265 1.5 against peak torque.",
      "sizingFormulasHint": "RMS Torque T_rms = sqrt(sum(T_i^2 * t_i) / T_total)."
    },
    "integrationDependencies": [
      "Regulated 48VDC power supply with regenerative braking shunt",
      "EtherCAT master controller"
    ],
    "relatedProductIds": [
      "rotary",
      "robot-controllers",
      "collaborative",
      "6-axis"
    ],
    "downloadableDocs": [
      {
        "title": "Servo Actuator (ACT-SRV-090) Technical Datasheet",
        "type": "Datasheet",
        "format": "PDF",
        "size": "3.2 MB",
        "refCode": "DS-ACT-SRV-090",
        "verified": true
      },
      {
        "title": "Servo Actuator 3D CAD Assembly Model",
        "type": "CAD 3D STEP",
        "format": "STEP",
        "size": "22.5 MB",
        "refCode": "CAD-ACT-SRV-090",
        "verified": true
      },
      {
        "title": "Servo Actuator Integration & Commissioning Guide",
        "type": "Manual",
        "format": "PDF",
        "size": "2.1 MB",
        "refCode": "MAN-ACT-SRV-090",
        "verified": true
      }
    ]
  },
  "planetary": {
    "id": "planetary",
    "categorySlug": "precision-reducers",
    "modelIdentifier": "IND-RED-PLN-090-P1",
    "componentType": "Precision Inline Planetary Gearbox",
    "datasheet": {
      "documentNumber": "DS-RED-PLN-2026-REV3",
      "revision": "Rev 3.1",
      "releaseDate": "2026-02-10",
      "verificationLevel": "Verified Specification",
      "traceableSource": "INDUS Gear Metrology Zeiss Klingelnberg Test #5"
    },
    "functionalOverview": "The IND-RED-PLN-090 series provides torque multiplication and speed reduction with low backlash (< 1 arcmin in P1 precision class). Built with helical carburized alloy steel gears (DIN 3962 Quality 5) and supported by heavy-duty taper roller bearings, it handles high radial and axial loads on dynamic servomotor axes.",
    "parameters": [
      {
        "name": "Available Reduction Ratios",
        "value": "3:1 to 100:1",
        "unit": "ratio",
        "tolerance": "Exact integer",
        "conditions": "1-stage (3-10:1), 2-stage (15-100:1)",
        "status": "verified"
      },
      {
        "name": "Rated Output Torque (T2N)",
        "value": "185.0",
        "unit": "Nm",
        "tolerance": "\u00b15%",
        "conditions": "At 10:1 ratio, 3000 rpm input, L10h = 20,000h",
        "status": "verified"
      },
      {
        "name": "Peak Acceleration Torque (T2B)",
        "value": "320.0",
        "unit": "Nm",
        "tolerance": "\u00b18%",
        "conditions": "1000 cycles/hour max",
        "status": "verified"
      },
      {
        "name": "Emergency Stop Torque (T2NOT)",
        "value": "550.0",
        "unit": "Nm",
        "tolerance": "Permissible max",
        "conditions": "Max 1000 events across gear life",
        "status": "verified"
      },
      {
        "name": "Torsional Backlash (Precision Class P1)",
        "value": "< 1.0",
        "unit": "arcmin",
        "tolerance": "ISO class 1",
        "conditions": "At 2% rated torque",
        "status": "verified"
      },
      {
        "name": "Standard Backlash (Class P2)",
        "value": "< 3.0",
        "unit": "arcmin",
        "tolerance": "ISO class 2",
        "conditions": "Standard catalog variant",
        "status": "verified"
      },
      {
        "name": "Mechanical Efficiency",
        "value": "\u2265 97%",
        "unit": "%",
        "tolerance": "1-stage",
        "conditions": "\u2265 94% on 2-stage at nominal speed",
        "status": "verified"
      },
      {
        "name": "Nominal Input Speed",
        "value": "3500",
        "unit": "rpm",
        "tolerance": "Continuous S1",
        "conditions": "Max input speed 6000 rpm",
        "status": "verified"
      },
      {
        "name": "Max Permissible Radial Force (Fr)",
        "value": "4800",
        "unit": "N",
        "tolerance": "At shaft midpoint",
        "conditions": "Output shaft taper roller bearings",
        "status": "verified"
      },
      {
        "name": "Max Permissible Axial Force (Fa)",
        "value": "3900",
        "unit": "N",
        "tolerance": "At shaft axis",
        "conditions": "Output shaft taper roller bearings",
        "status": "verified"
      },
      {
        "name": "Torsional Rigidity",
        "value": "18.5",
        "unit": "Nm/arcmin",
        "tolerance": "\u00b110%",
        "conditions": "Measured at output shaft",
        "status": "verified"
      }
    ],
    "categorySpecificSpecs": {
      "Gearing Topology": "Helical Carburized Planetary Gears (DIN 3962 Class 5)",
      "Lubrication": "Synthetic High-Temperature NLGI 00 Grease (Maintenance-Free Lifetime)",
      "Motor Adapter Flange": "Universal Clamping Hub compatible with NEMA / IEC servo flanges",
      "Protection Rating": "IP65 standard output shaft seal"
    },
    "useCases": [
      "Machine tool rack-and-pinion feed axes",
      "Cartesian gantry X/Y/Z high-speed transfers",
      "Rotary indexing tables and packaging pouch indexers",
      "Industrial printing and converting line synchronized drives"
    ],
    "unsuitableApplications": [
      "Direct zero-backlash robotic arm joints requiring < 0.1 arcmin (recommend Harmonic)",
      "Severe shock reversing operations where peak torque exceeds 550 Nm"
    ],
    "mechanicalMounting": {
      "flangeStandard": "Square Output Flange 90x90mm / Round Pilot \u00d880h7",
      "boltPattern": "4x \u00d89mm through-holes on \u00d8100mm bolt circle",
      "alignmentPin": "Precision pilot spigot \u00d880h7 (depth 4mm)",
      "maxOverhungLoad": "4800 N radial load at 25mm from flange face",
      "recommendedFasteners": "Grade 10.9 M8 Cap Screws, tightening torque 28 Nm",
      "orientationNotes": "Universal mounting orientation (horizontal, vertical shaft up/down)"
    },
    "electricalRequirements": {
      "supplyVoltage": "Passive mechanical gearbox; driven by external servo motor",
      "ratedCurrent": "N/A (Mechanical)",
      "peakCurrent": "N/A (Mechanical)",
      "motorType": "Compatible with 400W to 1.5kW AC brushless servomotors",
      "driveRequirement": "External servo drive matched to driving motor",
      "feedbackInterface": "Motor encoder on drive shaft; optional output resolver"
    },
    "controlAndCommunication": {
      "fieldbuses": [
        "N/A - Mechanical Component"
      ],
      "controlModes": [
        "Controlled by upstream servo drive"
      ],
      "cycleTime": "N/A",
      "ioChannels": "N/A",
      "syncJitter": "N/A"
    },
    "environmentalAndSafety": {
      "operatingTemp": "-20\u00b0C to +90\u00b0C housing temperature",
      "storageTemp": "-30\u00b0C to +95\u00b0C",
      "humidity": "Up to 95% RH non-condensing",
      "ipRating": "IP65 with double lip output shaft oil seals",
      "safetyCertifications": [
        "ATEX Zone 2 / 22 available on request",
        "CE Machinery Directive"
      ],
      "applicableDirectives": [
        "DIN 3990 Gear Calculation Standard"
      ],
      "unsuitableApplications": [
        "Direct chemical submersion without secondary enclosure"
      ]
    },
    "selectionConsiderations": {
      "primaryCriteria": [
        "Continuous operating torque T2N vs application duty cycle",
        "Peak acceleration torque T2B during emergency stops or rapid indexing",
        "Inertia matching: gearbox reflects load inertia as J_load / ratio^2"
      ],
      "inertiaRatioLimit": "Target reflected inertia ratio JL/JM between 3:1 and 8:1 for optimal servo loop gains.",
      "thermalDeratingNotes": "Input speeds sustained above 4000 rpm generate thermal rise; verify thermal power limit P_th.",
      "recommendedSafetyFactor": "SF \u2265 1.5 on rated torque; SF \u2265 1.2 on peak torque.",
      "sizingFormulasHint": "Reflected inertia J_ref = J_load / i^2. Output torque T_out = T_motor * i * eta."
    },
    "integrationDependencies": [
      "Servo motor with compatible shaft diameter and pilot flange",
      "Flexible clamping collar"
    ],
    "relatedProductIds": [
      "linear",
      "harmonic",
      "servo-drives"
    ],
    "downloadableDocs": [
      {
        "title": "Planetary Reducer (RED-PLN-090) Technical Datasheet",
        "type": "Datasheet",
        "format": "PDF",
        "size": "3.2 MB",
        "refCode": "DS-RED-PLN-090",
        "verified": true
      },
      {
        "title": "Planetary Reducer 3D CAD Assembly Model",
        "type": "CAD 3D STEP",
        "format": "STEP",
        "size": "22.5 MB",
        "refCode": "CAD-RED-PLN-090",
        "verified": true
      },
      {
        "title": "Planetary Reducer Integration & Commissioning Guide",
        "type": "Manual",
        "format": "PDF",
        "size": "2.1 MB",
        "refCode": "MAN-RED-PLN-090",
        "verified": true
      }
    ]
  },
  "harmonic": {
    "id": "harmonic",
    "categorySlug": "precision-reducers",
    "modelIdentifier": "IND-RED-HMC-025-CS",
    "componentType": "Zero-Backlash Strain Wave Gear Reducer",
    "datasheet": {
      "documentNumber": "DS-RED-HMC-2026-REV5",
      "revision": "Rev 5.2",
      "releaseDate": "2026-03-05",
      "verificationLevel": "Verified Specification",
      "traceableSource": "INDUS Precision Metrology Hysteresis Rig #1"
    },
    "functionalOverview": "The IND-RED-HMC-025 is a true zero-backlash strain wave reducer engineered for robotic arm articulation and metrology equipment. Comprising a Wave Generator elliptical cam, a thin-walled flexible cup (Flexspline), and a rigid internal gear ring (Circular Spline), it delivers high single-stage reduction (up to 160:1) with sub-arcminute transmission error and exceptional positional repeatability.",
    "parameters": [
      {
        "name": "Single-Stage Reduction Ratios",
        "value": "50:1 / 80:1 / 100:1 / 120:1 / 160:1",
        "unit": "ratio",
        "tolerance": "Exact",
        "conditions": "Single-stage strain wave mechanism",
        "status": "verified"
      },
      {
        "name": "Rated Output Torque (50:1)",
        "value": "78.0",
        "unit": "Nm",
        "tolerance": "\u00b15%",
        "conditions": "At 2000 rpm input, L10 life 15,000h",
        "status": "verified"
      },
      {
        "name": "Rated Output Torque (100:1)",
        "value": "105.0",
        "unit": "Nm",
        "tolerance": "\u00b15%",
        "conditions": "At 2000 rpm input, L10 life 15,000h",
        "status": "verified"
      },
      {
        "name": "Permissible Peak Torque (T_peak)",
        "value": "245.0",
        "unit": "Nm",
        "tolerance": "\u00b18%",
        "conditions": "Acceleration / deceleration peak",
        "status": "verified"
      },
      {
        "name": "Momentary Peak Torque (T_stop)",
        "value": "480.0",
        "unit": "Nm",
        "tolerance": "Max limit",
        "conditions": "Emergency stop events (< 1000 total life)",
        "status": "verified"
      },
      {
        "name": "Torsional Backlash",
        "value": "0.0",
        "unit": "arcmin",
        "tolerance": "Absolute Zero",
        "conditions": "Preloaded tooth engagement",
        "status": "verified"
      },
      {
        "name": "Transmission Error",
        "value": "< 35",
        "unit": "arcsec",
        "tolerance": "Peak-to-peak",
        "conditions": "Full 360\u00b0 output rotation",
        "status": "verified"
      },
      {
        "name": "Hysteresis Loss",
        "value": "< 1.5",
        "unit": "arcmin",
        "tolerance": "Max",
        "conditions": "Measured between \u00b1 rated torque",
        "status": "verified"
      },
      {
        "name": "Center Hollow Bore Diameter",
        "value": "25",
        "unit": "mm",
        "tolerance": "+0.03 / 0 mm",
        "conditions": "Hollow shaft variant for internal cables",
        "status": "verified"
      },
      {
        "name": "Mechanical Efficiency",
        "value": "78% - 86%",
        "unit": "%",
        "tolerance": "Speed & ratio dependent",
        "conditions": "At 20\u00b0C stabilized operating temp",
        "status": "verified"
      }
    ],
    "categorySpecificSpecs": {
      "Technology Type": "Cup-Style / Component-Set Strain Wave Gearing",
      "Flexspline Material": "High-Fatigue Vacuum-Melted 40CrMoV Alloy Steel",
      "Cross-Roller Output Bearing": "Integrated Ultra-Rigid Crossed Roller Bearing",
      "Lubrication": "Dedicated Harmonic Synthetic Grease (SK-1A / SK-2)"
    },
    "useCases": [
      "Articulated robot arm wrist and elbow joints (Cobots & 6-Axis)",
      "High-precision semiconductor wafer handling robot arms",
      "Optical telescope drive mounts and camera tracking gimbals",
      "Surgical robotics and haptic feedback manipulators"
    ],
    "unsuitableApplications": [
      "Heavy continuous shock grinding axes exceeding 480 Nm tooth ratcheting limit",
      "High continuous input speeds > 4500 rpm for extended periods (thermal fatigue)"
    ],
    "mechanicalMounting": {
      "flangeStandard": "Standard Robot Wrist Output Flange (ISO 9409-1-50-4-M6)",
      "boltPattern": "8x M5 mounting holes on Circular Spline \u00d895mm pitch",
      "alignmentPin": "2x \u00d84h7 dowel pin holes for repeatable wrist indexing",
      "maxOverhungLoad": "1850 N radial, 2400 N axial dynamic capacity",
      "recommendedFasteners": "Grade 12.9 Socket Head Screws, torque 12 Nm",
      "orientationNotes": "Universal mounting; requires proper grease retention barrier"
    },
    "electricalRequirements": {
      "supplyVoltage": "Passive mechanical reducer driven by frameless or framed servo motor",
      "ratedCurrent": "N/A",
      "peakCurrent": "N/A",
      "motorType": "Pairs with frameless torque motor or compact brushless AC servo",
      "driveRequirement": "Drive with smooth sinusoidal commutation to avoid torque ripple",
      "feedbackInterface": "Dual-encoder setup recommended (motor rotor + reducer output)"
    },
    "controlAndCommunication": {
      "fieldbuses": [
        "N/A - Mechanical Reducer"
      ],
      "controlModes": [
        "Controlled by servo drive"
      ],
      "cycleTime": "N/A",
      "ioChannels": "N/A",
      "syncJitter": "N/A"
    },
    "environmentalAndSafety": {
      "operatingTemp": "-10\u00b0C to +80\u00b0C housing temperature",
      "storageTemp": "-25\u00b0C to +85\u00b0C",
      "humidity": "Up to 90% RH non-condensing",
      "ipRating": "IP54 component set; IP65 when integrated in sealed robot casting",
      "safetyCertifications": [
        "RoHS 3 Compliant",
        "CE Machinery Directive"
      ],
      "applicableDirectives": [
        "ISO 10218-1 Industrial Robot Design Reference"
      ],
      "unsuitableApplications": [
        "Direct chemical washdown without enclosure"
      ]
    },
    "selectionConsiderations": {
      "primaryCriteria": [
        "Continuous RMS torque calculation against Flexspline fatigue limit",
        "Ratcheting torque margin: peak impact must remain < 70% of ratcheting threshold",
        "Thermal duty cycle: verify average input speed and housing heat dissipation"
      ],
      "inertiaRatioLimit": "Due to high reduction ratio (80:1 to 160:1), reflected inertia is negligible. Focus on torsional stiffness.",
      "thermalDeratingNotes": "Operate below 80\u00b0C to preserve specialized grease lubricant viscosity.",
      "recommendedSafetyFactor": "SF \u2265 2.0 on ratcheting torque; SF \u2265 1.5 on continuous fatigue torque.",
      "sizingFormulasHint": "Fatigue Life L10 = 7000 * (T_rated / T_rms)^3 * (n_rated / n_avg) hours."
    },
    "integrationDependencies": [
      "Frameless motor stator/rotor kit or motor adapter",
      "Sealed joint housing with grease seals"
    ],
    "relatedProductIds": [
      "cycloidal",
      "rotary",
      "servo",
      "collaborative"
    ],
    "downloadableDocs": [
      {
        "title": "Harmonic Reducer (RED-HMC-025) Technical Datasheet",
        "type": "Datasheet",
        "format": "PDF",
        "size": "3.2 MB",
        "refCode": "DS-RED-HMC-025",
        "verified": true
      },
      {
        "title": "Harmonic Reducer 3D CAD Assembly Model",
        "type": "CAD 3D STEP",
        "format": "STEP",
        "size": "22.5 MB",
        "refCode": "CAD-RED-HMC-025",
        "verified": true
      },
      {
        "title": "Harmonic Reducer Integration & Commissioning Guide",
        "type": "Manual",
        "format": "PDF",
        "size": "2.1 MB",
        "refCode": "MAN-RED-HMC-025",
        "verified": true
      }
    ]
  },
  "cycloidal": {
    "id": "cycloidal",
    "categorySlug": "precision-reducers",
    "modelIdentifier": "IND-RED-CYC-160-RV",
    "componentType": "High-Shock Cycloidal Pin-Wheel Speed Reducer",
    "datasheet": {
      "documentNumber": "DS-RED-CYC-2026-REV2",
      "revision": "Rev 2.0",
      "releaseDate": "2026-01-15",
      "verificationLevel": "Verified Specification",
      "traceableSource": "INDUS Heavy Drive Test Bay #3 (High-Shock Dynamometer)"
    },
    "functionalOverview": "The IND-RED-CYC-160 is a heavy-duty cycloidal pin-wheel speed reducer designed for the base, shoulder, and elbow axes of high-payload industrial robots. Unlike standard involute gears, cycloidal drive discs share contact across 30% of their profile simultaneously, allowing the unit to absorb extreme shock loads (up to 500% of rated torque) without tooth breakage.",
    "parameters": [
      {
        "name": "Available Reduction Ratios",
        "value": "41:1 / 81:1 / 121:1 / 161:1",
        "unit": "ratio",
        "tolerance": "Exact integer",
        "conditions": "2-stage cycloidal disc configuration",
        "status": "verified"
      },
      {
        "name": "Rated Output Torque (T2N)",
        "value": "1250",
        "unit": "Nm",
        "tolerance": "\u00b15%",
        "conditions": "At 15 rpm output, 6000h continuous S1 life",
        "status": "verified"
      },
      {
        "name": "Acceleration / Deceleration Torque (T2B)",
        "value": "2800",
        "unit": "Nm",
        "tolerance": "\u00b18%",
        "conditions": "Duty cycle \u2264 20%, max duration 2.0s",
        "status": "verified"
      },
      {
        "name": "Shock / Emergency Stop Torque",
        "value": "6250",
        "unit": "Nm",
        "tolerance": "Peak survival",
        "conditions": "500% rated torque shock absorption",
        "status": "verified"
      },
      {
        "name": "Torsional Backlash",
        "value": "< 1.0",
        "unit": "arcmin",
        "tolerance": "ISO class 1",
        "conditions": "At \u00b13% rated torque reversal",
        "status": "verified"
      },
      {
        "name": "Torsional Rigidity",
        "value": "115.0",
        "unit": "Nm/arcmin",
        "tolerance": "\u00b18%",
        "conditions": "Ultra-high rigidity for heavy robot arms",
        "status": "verified"
      },
      {
        "name": "Maximum Input Speed",
        "value": "3000",
        "unit": "rpm",
        "tolerance": "Intermittent",
        "conditions": "Nominal input speed 1500 rpm",
        "status": "verified"
      },
      {
        "name": "Permissible Bending Moment (Mc)",
        "value": "5400",
        "unit": "Nm",
        "tolerance": "Static limit",
        "conditions": "Large internal main angular roller bearings",
        "status": "verified"
      },
      {
        "name": "Center Through-Hole Option",
        "value": "55",
        "unit": "mm",
        "tolerance": "\u00b10.1 mm",
        "conditions": "Hollow-bore version for cable looms",
        "status": "verified"
      },
      {
        "name": "Mechanical Efficiency",
        "value": "85% - 90%",
        "unit": "%",
        "tolerance": "\u00b13%",
        "conditions": "At rated torque and input speed",
        "status": "verified"
      }
    ],
    "categorySpecificSpecs": {
      "Mechanism Architecture": "Dual Opposed Cycloid Discs with Pin-Ring Gear & Spur Pre-Stage",
      "Main Bearings": "Integrated High-Capacity Angular Contact Roller Bearings",
      "Shock Withstand Capacity": "Up to 500% of nominal rated torque without mechanical failure",
      "Lubrication": "Dedicated Synthetic Fluid Grease (Molykote / Kl\u00fcber)"
    },
    "useCases": [
      "Heavy industrial articulated robots (Axes J1, J2, and J3)",
      "Automotive body-in-white welding positioners and turntables",
      "High-tonnage stamping press load and unload robots",
      "CNC heavy rotary tilt tables and milling spindles"
    ],
    "unsuitableApplications": [
      "Ultra-compact cobot wrists requiring total unit weight < 1.5 kg (use Harmonic)",
      "Continuous ultra-high input speed > 4000 rpm (causes high churning heat)"
    ],
    "mechanicalMounting": {
      "flangeStandard": "Robot Base Flange / Hollow Output Pilot \u00d8190h7",
      "boltPattern": "12x M10 high-tensile bolt pattern on \u00d8220mm circle",
      "alignmentPin": "3x \u00d810m6 precision reamed dowel holes",
      "maxOverhungLoad": "14,500 N radial, 18,000 N axial dynamic capacity",
      "recommendedFasteners": "Grade 12.9 Socket Head Screws, torque 85 Nm with calibrated torque wrench",
      "orientationNotes": "Universal mounting; ensure grease drain/fill plugs remain accessible"
    },
    "electricalRequirements": {
      "supplyVoltage": "Passive speed reducer driven by 1.5kW to 7.5kW servo motor",
      "ratedCurrent": "N/A",
      "peakCurrent": "N/A",
      "motorType": "Medium/high-inertia industrial AC servomotors",
      "driveRequirement": "Drive amplifier with active vibration damping algorithms",
      "feedbackInterface": "Resolver or multi-turn absolute encoder on motor shaft"
    },
    "controlAndCommunication": {
      "fieldbuses": [
        "N/A - Mechanical Reducer"
      ],
      "controlModes": [
        "Controlled by servo drive"
      ],
      "cycleTime": "N/A",
      "ioChannels": "N/A",
      "syncJitter": "N/A"
    },
    "environmentalAndSafety": {
      "operatingTemp": "-10\u00b0C to +85\u00b0C",
      "storageTemp": "-30\u00b0C to +90\u00b0C",
      "humidity": "Up to 95% RH non-condensing",
      "ipRating": "IP65 with oil-resistant shaft and flange seals",
      "safetyCertifications": [
        "CE Machinery Directive",
        "ISO 10218-1 Compliance"
      ],
      "applicableDirectives": [
        "EN ISO 12100"
      ],
      "unsuitableApplications": [
        "Direct chemical washdown without anti-corrosion coating"
      ]
    },
    "selectionConsiderations": {
      "primaryCriteria": [
        "Dynamic tilting moment (Mc) generated during rapid arm acceleration with full payload",
        "Emergency stop deceleration torque: ensure reducer absorbs emergency brake stop",
        "L10h bearing life calculation under combined radial and thrust forces"
      ],
      "inertiaRatioLimit": "Cycloidal reducers handle load-to-motor inertia ratios up to 10:1 comfortably due to high torsional stiffness.",
      "thermalDeratingNotes": "Sustained high-velocity cycling requires monitoring grease temperature; keep casing < 75\u00b0C.",
      "recommendedSafetyFactor": "SF \u2265 1.5 on nominal torque; SF \u2265 1.3 on shock torque.",
      "sizingFormulasHint": "Tilting moment Mc = F_radial * y + F_axial * x. Life L10 = (C / P)^3.33 * (10^6 / (60 * n))."
    },
    "integrationDependencies": [
      "Servo motor with matching pinion/coupling flange",
      "Rigid robot base frame structure"
    ],
    "relatedProductIds": [
      "harmonic",
      "planetary",
      "welding",
      "handling"
    ],
    "downloadableDocs": [
      {
        "title": "Cycloidal Reducer (RED-CYC-160) Technical Datasheet",
        "type": "Datasheet",
        "format": "PDF",
        "size": "3.2 MB",
        "refCode": "DS-RED-CYC-160",
        "verified": true
      },
      {
        "title": "Cycloidal Reducer 3D CAD Assembly Model",
        "type": "CAD 3D STEP",
        "format": "STEP",
        "size": "22.5 MB",
        "refCode": "CAD-RED-CYC-160",
        "verified": true
      },
      {
        "title": "Cycloidal Reducer Integration & Commissioning Guide",
        "type": "Manual",
        "format": "PDF",
        "size": "2.1 MB",
        "refCode": "MAN-RED-CYC-160",
        "verified": true
      }
    ]
  },
  "gearboxes": {
    "id": "gearboxes",
    "categorySlug": "precision-reducers",
    "modelIdentifier": "IND-RED-IND-220-RA",
    "componentType": "Right-Angle Helical-Bevel Industrial Servo Gearbox",
    "datasheet": {
      "documentNumber": "DS-RED-IND-2026-REV2",
      "revision": "Rev 2.0",
      "releaseDate": "2026-02-18",
      "verificationLevel": "Verified Specification",
      "traceableSource": "INDUS Heavy Industrial Drive Test Cell #6"
    },
    "functionalOverview": "The IND-RED-IND-220 is a right-angle servo gearbox combining high-precision spiral bevel gears with an inline planetary output stage. Designed for space-constrained industrial machinery requiring right-angle motor configuration, it delivers low backlash (< 2 arcmin), high thermal power capacity, and rugged cast-iron housing stiffness.",
    "parameters": [
      {
        "name": "Reduction Ratios Available",
        "value": "6:1 to 150:1",
        "unit": "ratio",
        "tolerance": "Exact",
        "conditions": "2-stage (bevel + planetary)",
        "status": "verified"
      },
      {
        "name": "Nominal Output Torque",
        "value": "680.0",
        "unit": "Nm",
        "tolerance": "\u00b15%",
        "conditions": "At 1500 rpm input, S1 duty",
        "status": "verified"
      },
      {
        "name": "Peak Acceleration Torque",
        "value": "1350.0",
        "unit": "Nm",
        "tolerance": "\u00b18%",
        "conditions": "Cyclic reversing peak",
        "status": "verified"
      },
      {
        "name": "Emergency Stop Torque",
        "value": "2200.0",
        "unit": "Nm",
        "tolerance": "Max limit",
        "conditions": "Max 500 events over lifetime",
        "status": "verified"
      },
      {
        "name": "Torsional Backlash",
        "value": "< 2.0",
        "unit": "arcmin",
        "tolerance": "Precision grade",
        "conditions": "Class P1 standard (< 4 arcmin P2)",
        "status": "verified"
      },
      {
        "name": "Right-Angle Mechanical Efficiency",
        "value": "\u2265 94%",
        "unit": "%",
        "tolerance": "\u00b12%",
        "conditions": "At nominal operating temperature",
        "status": "verified"
      },
      {
        "name": "Max Input Speed",
        "value": "4500",
        "unit": "rpm",
        "tolerance": "Peak",
        "conditions": "Continuous input 2500 rpm",
        "status": "verified"
      },
      {
        "name": "Shaft Configurations",
        "value": "Solid Shaft / Hollow Bore with Shrink Disc",
        "unit": "option",
        "tolerance": "ISO h6",
        "conditions": "Keyed or smooth shaft",
        "status": "verified"
      }
    ],
    "categorySpecificSpecs": {
      "Gearing Stages": "Hypoid / Spiral Bevel Stage + Precision Planetary Output Stage",
      "Housing Material": "High-Grade Ductile Cast Iron (EN-GJS-400-15)",
      "Shaft Options": "Hollow shaft with shrink disc / Double-extended solid shaft",
      "Lubrication": "Synthetic Polyalphaolefin (PAO) Gear Oil ISO VG 220"
    },
    "useCases": [
      "Overhead gantry drive axes with limited vertical clearance",
      "Continuous rotary web converting and slitting machines",
      "Heavy-duty pallet conveyor indexers and transfer tables",
      "Automated material staging shuttles and rail bogies"
    ],
    "unsuitableApplications": [
      "Ultra-light cobot wrist axes requiring weight < 2 kg",
      "Zero-backlash metrology arms requiring < 0.1 arcmin"
    ],
    "mechanicalMounting": {
      "flangeStandard": "Universal Flange or Foot Mount Housing (B5 / B14)",
      "boltPattern": "8x M12 tapped holes on output face \u00d8175mm",
      "alignmentPin": "Pilot diameter \u00d8150h7",
      "maxOverhungLoad": "8500 N radial load at 50mm shaft midpoint",
      "recommendedFasteners": "Grade 10.9 M12 Hex Bolts, torque 110 Nm",
      "orientationNotes": "Universal mounting; sight glass and breather orientation configured per order"
    },
    "electricalRequirements": {
      "supplyVoltage": "Passive mechanical gearbox; driven by servo or induction motor",
      "ratedCurrent": "N/A",
      "peakCurrent": "N/A",
      "motorType": "1.5 kW to 7.5 kW AC servomotors",
      "driveRequirement": "Standard digital servo inverter",
      "feedbackInterface": "Motor feedback on drive unit"
    },
    "controlAndCommunication": {
      "fieldbuses": [
        "N/A - Mechanical Component"
      ],
      "controlModes": [
        "Controlled by servo drive"
      ],
      "cycleTime": "N/A",
      "ioChannels": "N/A",
      "syncJitter": "N/A"
    },
    "environmentalAndSafety": {
      "operatingTemp": "-20\u00b0C to +85\u00b0C oil bath temp",
      "storageTemp": "-30\u00b0C to +90\u00b0C",
      "humidity": "Up to 95% non-condensing",
      "ipRating": "IP65 with FKM double-lip viton seals",
      "safetyCertifications": [
        "CE Machinery Directive",
        "ATEX 2014/34/EU Cat II 2GD available"
      ],
      "applicableDirectives": [
        "AGMA / ISO 6336 Rating"
      ],
      "unsuitableApplications": [
        "Direct food contact zones without food-grade NSF H1 oil option"
      ]
    },
    "selectionConsiderations": {
      "primaryCriteria": [
        "Thermal power capacity P_th vs actual motor mechanical throughput",
        "Overhung radial load on output shaft caused by sprockets or pinions",
        "Right-angle mounting envelope and motor orientation clearance"
      ],
      "inertiaRatioLimit": "Keep load-to-motor inertia ratio \u2264 6:1 for responsive dynamic control.",
      "thermalDeratingNotes": "Ambient temperature above 35\u00b0C requires 12% thermal power derating without external fan cooling.",
      "recommendedSafetyFactor": "SF \u2265 1.5 on nominal power; SF \u2265 2.0 for heavy shock applications.",
      "sizingFormulasHint": "Thermal check: P_continuous <= P_thermal * f_temp * f_altitude."
    },
    "integrationDependencies": [
      "Servo motor with keyed or smooth shaft",
      "Rigid machine foundation plate"
    ],
    "relatedProductIds": [
      "planetary",
      "cycloidal",
      "linear"
    ],
    "downloadableDocs": [
      {
        "title": "Industrial Gearbox (RED-IND-220) Technical Datasheet",
        "type": "Datasheet",
        "format": "PDF",
        "size": "3.2 MB",
        "refCode": "DS-RED-IND-220",
        "verified": true
      },
      {
        "title": "Industrial Gearbox 3D CAD Assembly Model",
        "type": "CAD 3D STEP",
        "format": "STEP",
        "size": "22.5 MB",
        "refCode": "CAD-RED-IND-220",
        "verified": true
      },
      {
        "title": "Industrial Gearbox Integration & Commissioning Guide",
        "type": "Manual",
        "format": "PDF",
        "size": "2.1 MB",
        "refCode": "MAN-RED-IND-220",
        "verified": true
      }
    ]
  },
  "drive": {
    "id": "drive",
    "categorySlug": "robotic-wheels",
    "modelIdentifier": "IND-WHL-DRV-200-BLDC",
    "componentType": "Integrated In-Hub AGV Drive Wheel Unit",
    "datasheet": {
      "documentNumber": "DS-WHL-DRV-2026-REV3",
      "revision": "Rev 3.0",
      "releaseDate": "2026-02-05",
      "verificationLevel": "Verified Specification",
      "traceableSource": "INDUS Mobile Robotics Dynamometer Rig #1"
    },
    "functionalOverview": "The IND-WHL-DRV-200 is an integrated traction drive wheel combining a high-efficiency 48V brushless permanent magnet motor, a multi-stage high-torque planetary gearbox, an electromagnetic parking/safety brake, and a high-load 95 Shore A polyurethane tire into a single compact hub. Engineered specifically for automated guided vehicles (AGVs) and warehouse AMRs.",
    "parameters": [
      {
        "name": "Wheel Outer Diameter",
        "value": "200",
        "unit": "mm",
        "tolerance": "\u00b10.5 mm",
        "conditions": "Standard polyurethane tread",
        "status": "verified"
      },
      {
        "name": "Tread Width",
        "value": "75",
        "unit": "mm",
        "tolerance": "\u00b10.5 mm",
        "conditions": "Ground contact patch",
        "status": "verified"
      },
      {
        "name": "Max Static Radial Load",
        "value": "850",
        "unit": "kg",
        "tolerance": "Per wheel",
        "conditions": "At zero velocity",
        "status": "verified"
      },
      {
        "name": "Rated Dynamic Payload",
        "value": "500",
        "unit": "kg",
        "tolerance": "Per wheel",
        "conditions": "Continuous rolling at 1.5 m/s",
        "status": "verified"
      },
      {
        "name": "Continuous Traction Force",
        "value": "620",
        "unit": "N",
        "tolerance": "\u00b15%",
        "conditions": "S1 continuous at 48VDC",
        "status": "verified"
      },
      {
        "name": "Peak Acceleration Force",
        "value": "1450",
        "unit": "N",
        "tolerance": "\u00b18%",
        "conditions": "Duration \u2264 3.0s",
        "status": "verified"
      },
      {
        "name": "Rated Travel Velocity",
        "value": "1.8",
        "unit": "m/s",
        "tolerance": "\u00b15%",
        "conditions": "At 175 rpm wheel speed",
        "status": "verified"
      },
      {
        "name": "Maximum Velocity",
        "value": "2.4",
        "unit": "m/s",
        "tolerance": "Level surface",
        "conditions": "Concrete warehouse floor",
        "status": "verified"
      },
      {
        "name": "Holding Brake Torque",
        "value": "18.0",
        "unit": "Nm",
        "tolerance": "\u00b110%",
        "conditions": "Spring-applied 24V release brake",
        "status": "verified"
      },
      {
        "name": "Tire Tread Material",
        "value": "Vulkollan / Polyurethane 95 Shore A",
        "unit": "durometer",
        "tolerance": "\u00b12 Sh A",
        "conditions": "Low rolling resistance compound",
        "status": "verified"
      }
    ],
    "categorySpecificSpecs": {
      "Motor Type": "Internal 48V BLDC Synchronous Motor with Hall & Encoder",
      "Gearbox": "Integrated 2-Stage High-Efficiency Planetary Reducer (Ratio 21:1)",
      "Brake Mechanism": "Electromagnetic Spring-Applied Safety Parking Brake (24VDC Release)",
      "Tire Hardness": "95 Shore A (Non-marking industrial polyurethane)"
    },
    "useCases": [
      "Warehouse Autonomous Mobile Robots (AMRs) carrying totes and pallets",
      "Automated Guided Vehicles (AGVs) on industrial factory floors",
      "Autonomous tuggers towing multi-cart logistics trains",
      "Mobile hospital delivery carts and cleanroom transporters"
    ],
    "unsuitableApplications": [
      "Rough outdoor terrain with continuous debris or gravel > 15 mm",
      "Continuous chemical washdown with solvents that degrade polyurethane"
    ],
    "mechanicalMounting": {
      "flangeStandard": "Rigid Chassis Mounting Bracket (4-Point Flange)",
      "boltPattern": "4x M10 tapped holes on 110x90mm rectangle",
      "alignmentPin": "2x \u00d88h7 locating dowels on bracket face",
      "maxOverhungLoad": "8500 N total radial static capacity per hub",
      "recommendedFasteners": "Grade 10.9 M10 Hex Head Bolts, torque 55 Nm",
      "orientationNotes": "Vertical suspension mount with optional spring damper kit"
    },
    "electricalRequirements": {
      "supplyVoltage": "24 VDC to 48 VDC nominal battery bus",
      "ratedCurrent": "14.5 A continuous (at 48 VDC, 650W)",
      "peakCurrent": "42.0 A peak dynamic current",
      "motorType": "Brushless PM DC Motor (8-pole)",
      "driveRequirement": "Dedicated dual-channel or single-channel AMR low-voltage servo drive",
      "feedbackInterface": "Integrated dual Hall sensors + 2048-line incremental encoder"
    },
    "controlAndCommunication": {
      "fieldbuses": [
        "CANopen (CiA 402)",
        "EtherCAT",
        "RS-485 / Modbus"
      ],
      "controlModes": [
        "Profile Velocity (CSV)",
        "Torque Limit",
        "Electronic Differential Speed"
      ],
      "cycleTime": "1 ms to 5 ms",
      "ioChannels": "Brake release control wire, motor temperature sensor (PTC)",
      "syncJitter": "< 5 \u00b5s"
    },
    "environmentalAndSafety": {
      "operatingTemp": "-10\u00b0C to +40\u00b0C",
      "storageTemp": "-20\u00b0C to +60\u00b0C",
      "humidity": "10% to 90% non-condensing",
      "ipRating": "IP54 drive unit; IP65 sealed motor casing",
      "safetyCertifications": [
        "ISO 3691-4 AGV/AMR Safety Standard Compliance",
        "CE EMC Directive"
      ],
      "applicableDirectives": [
        "EN 1175 Safety of Industrial Trucks"
      ],
      "unsuitableApplications": [
        "Direct wet washdown without protective splash shroud"
      ]
    },
    "selectionConsiderations": {
      "primaryCriteria": [
        "Gross Vehicle Weight (GVW) including payload and chassis mass",
        "Maximum incline gradient (%) requiring peak traction torque",
        "Warehouse floor surface friction coefficient mu (typically 0.6 on polished concrete)"
      ],
      "inertiaRatioLimit": "Differential drive AGVs control velocity loops; ensure motor current limits match wheel traction limits.",
      "thermalDeratingNotes": "Continuous heavy towing on grades > 5% requires thermal monitoring of hub winding.",
      "recommendedSafetyFactor": "SF \u2265 1.5 on total continuous traction thrust.",
      "sizingFormulasHint": "Traction force F_tract = GVW * (f_roll + sin(theta) + a/g)."
    },
    "integrationDependencies": [
      "48VDC Lithium / AGM battery pack",
      "AMR drive controller with electronic differential"
    ],
    "relatedProductIds": [
      "omni",
      "mecanum",
      "mobile-modules",
      "servo-drives"
    ],
    "downloadableDocs": [
      {
        "title": "Drive Wheel (WHL-DRV-200) Technical Datasheet",
        "type": "Datasheet",
        "format": "PDF",
        "size": "3.2 MB",
        "refCode": "DS-WHL-DRV-200",
        "verified": true
      },
      {
        "title": "Drive Wheel 3D CAD Assembly Model",
        "type": "CAD 3D STEP",
        "format": "STEP",
        "size": "22.5 MB",
        "refCode": "CAD-WHL-DRV-200",
        "verified": true
      },
      {
        "title": "Drive Wheel Integration & Commissioning Guide",
        "type": "Manual",
        "format": "PDF",
        "size": "2.1 MB",
        "refCode": "MAN-WHL-DRV-200",
        "verified": true
      }
    ]
  },
  "omni": {
    "id": "omni",
    "categorySlug": "robotic-wheels",
    "modelIdentifier": "IND-WHL-OMN-150-SS",
    "componentType": "All-Directional Stainless Heavy-Duty Omni Wheel",
    "datasheet": {
      "documentNumber": "DS-WHL-OMN-2026-REV2",
      "revision": "Rev 2.0",
      "releaseDate": "2026-01-25",
      "verificationLevel": "Verified Specification",
      "traceableSource": "INDUS Multidirectional Platform Dynamometer #2"
    },
    "functionalOverview": "The IND-WHL-OMN-150 is a multi-directional wheel engineered with two rows of staggered barrel rollers angled at 90\u00b0 to the primary wheel hub. Driven directly, it provides forward/reverse traction while allowing free low-friction lateral slip. This enables holonomic 3-DoF mobile chassis maneuvering in cramped factory aisles.",
    "parameters": [
      {
        "name": "Wheel Outer Diameter",
        "value": "152",
        "unit": "mm",
        "tolerance": "\u00b10.5 mm",
        "conditions": "Roller outer envelope",
        "status": "verified"
      },
      {
        "name": "Hub Width",
        "value": "48",
        "unit": "mm",
        "tolerance": "\u00b10.5 mm",
        "conditions": "Axial bore length",
        "status": "verified"
      },
      {
        "name": "Max Static Radial Payload",
        "value": "350",
        "unit": "kg",
        "tolerance": "Per wheel",
        "conditions": "At zero motion",
        "status": "verified"
      },
      {
        "name": "Rated Dynamic Payload",
        "value": "200",
        "unit": "kg",
        "tolerance": "Per wheel",
        "conditions": "Continuous operation at 1.2 m/s",
        "status": "verified"
      },
      {
        "name": "Perimeter Roller Quantity",
        "value": "14",
        "unit": "rollers",
        "tolerance": "Exact",
        "conditions": "Dual staggered row design",
        "status": "verified"
      },
      {
        "name": "Roller Material",
        "value": "Polyurethane 90 Shore A on Stainless Shaft",
        "unit": "material",
        "tolerance": "\u00b12 Sh A",
        "conditions": "Dual sealed precision ball bearings",
        "status": "verified"
      },
      {
        "name": "Axial Rolling Resistance Coefficient",
        "value": "0.018",
        "unit": "coefficient",
        "tolerance": "\u00b110%",
        "conditions": "Smooth industrial epoxy floor",
        "status": "verified"
      },
      {
        "name": "Maximum Operating Speed",
        "value": "2.0",
        "unit": "m/s",
        "tolerance": "Max",
        "conditions": "Continuous rolling",
        "status": "verified"
      }
    ],
    "categorySpecificSpecs": {
      "Hub Structure": "CNC Machined High-Strength 6061-T6 Aluminum Anodized",
      "Roller Sub-Assemblies": "14 Polyurethane Rollers on Hardened 304 Stainless Axles",
      "Bearing Configuration": "2x Sealed Deep-Groove Ball Bearings per Roller",
      "Bore Option": "Keyed Bore \u00d819mm / \u00d824mm / Hex Bore 1/2-inch"
    },
    "useCases": [
      "Holonomic 3-wheel or 4-wheel mobile industrial transfer platforms",
      "Robotic arm mobile bases requiring zero-turn radius in tight workstations",
      "Conveyor multi-directional transfer tables and package sorters",
      "Heavy load positioning jigs in aerospace assembly fixtures"
    ],
    "unsuitableApplications": [
      "Floors with expansion gaps > 8 mm or floor steps > 5 mm (causes roller impact)",
      "High-speed outdoor transit over uneven asphalt"
    ],
    "mechanicalMounting": {
      "flangeStandard": "Direct Keyed Shaft Bore (DIN 6885 Keyway)",
      "boltPattern": "4x M5 face mounting tapped holes on \u00d860mm circle",
      "alignmentPin": "Standard ISO H7 shaft tolerance with feather key",
      "maxOverhungLoad": "2500 N radial load at wheel centerline",
      "recommendedFasteners": "M6 shaft clamping collar / Grade 8.8 bolts",
      "orientationNotes": "Typically mounted in 3-wheel (120\u00b0) or 4-wheel (90\u00b0) radial configurations"
    },
    "electricalRequirements": {
      "supplyVoltage": "Passive mechanical wheel; driven by external gearmotor",
      "ratedCurrent": "N/A",
      "peakCurrent": "N/A",
      "motorType": "Pairs with 200W-500W planetary gearmotors or servo hubs",
      "driveRequirement": "Multi-axis kinematics controller with omni-drive inverse matrix",
      "feedbackInterface": "Encoder on driving motor shaft"
    },
    "controlAndCommunication": {
      "fieldbuses": [
        "Controlled via central chassis motion controller"
      ],
      "controlModes": [
        "Kinematic matrix transformation (Vx, Vy, Omega)"
      ],
      "cycleTime": "N/A",
      "ioChannels": "N/A",
      "syncJitter": "N/A"
    },
    "environmentalAndSafety": {
      "operatingTemp": "-10\u00b0C to +50\u00b0C",
      "storageTemp": "-20\u00b0C to +70\u00b0C",
      "humidity": "Up to 90% non-condensing",
      "ipRating": "IP54 mechanical assembly",
      "safetyCertifications": [
        "RoHS Compliant",
        "CE Machinery Directive"
      ],
      "applicableDirectives": [
        "ISO 3691-4 Mobile Platform Safety Guidelines"
      ],
      "unsuitableApplications": [
        "Submerged continuous operation"
      ]
    },
    "selectionConsiderations": {
      "primaryCriteria": [
        "Total chassis mass distributed across omni contact points",
        "Floor flatness: ensure all 3 or 4 wheels maintain continuous ground contact",
        "Inverse kinematic velocity vectors during simultaneous translation and rotation"
      ],
      "inertiaRatioLimit": "Ensure chassis traction motor drives have synchronized speed loops to prevent wheel scrub.",
      "thermalDeratingNotes": "Polyurethane rollers may build heat if continuous lateral slip exceeds 1.5 m/s for > 30 minutes.",
      "recommendedSafetyFactor": "SF \u2265 1.6 on dynamic payload rating.",
      "sizingFormulasHint": "3-Wheel Omni Kinematics: V_wheel_i = -Vx*sin(theta_i) + Vy*cos(theta_i) + L*omega."
    },
    "integrationDependencies": [
      "Driven shaft with DIN 6885 keyway",
      "Independent suspension springs recommended for 4-wheel setups"
    ],
    "relatedProductIds": [
      "drive",
      "mecanum",
      "mobile-modules",
      "motion-controllers"
    ],
    "downloadableDocs": [
      {
        "title": "Omni Wheel (WHL-OMN-150) Technical Datasheet",
        "type": "Datasheet",
        "format": "PDF",
        "size": "3.2 MB",
        "refCode": "DS-WHL-OMN-150",
        "verified": true
      },
      {
        "title": "Omni Wheel 3D CAD Assembly Model",
        "type": "CAD 3D STEP",
        "format": "STEP",
        "size": "22.5 MB",
        "refCode": "CAD-WHL-OMN-150",
        "verified": true
      },
      {
        "title": "Omni Wheel Integration & Commissioning Guide",
        "type": "Manual",
        "format": "PDF",
        "size": "2.1 MB",
        "refCode": "MAN-WHL-OMN-150",
        "verified": true
      }
    ]
  },
  "mecanum": {
    "id": "mecanum",
    "categorySlug": "robotic-wheels",
    "modelIdentifier": "IND-WHL-MEC-204-HD",
    "componentType": "Precision Heavy-Duty 45\u00b0 Mecanum Wheel Set",
    "datasheet": {
      "documentNumber": "DS-WHL-MEC-2026-REV3",
      "revision": "Rev 3.1",
      "releaseDate": "2026-02-12",
      "verificationLevel": "Verified Specification",
      "traceableSource": "INDUS Omni-Platform Motion Analysis Test Bed #1"
    },
    "functionalOverview": "The IND-WHL-MEC-204 is a heavy-duty industrial Mecanum wheel featuring peripheral rollers mounted at 45\u00b0 to the wheel plane. By independently varying the speed and rotational direction of four Mecanum wheels on a chassis, the vehicle generates net force vectors in any horizontal direction\u2014moving forward, sideways (strafing), diagonally, or spinning on its center point without steering linkages.",
    "parameters": [
      {
        "name": "Wheel Outer Diameter",
        "value": "203",
        "unit": "mm",
        "tolerance": "\u00b10.5 mm",
        "conditions": "Standard 8-inch industrial size",
        "status": "verified"
      },
      {
        "name": "Overall Wheel Width",
        "value": "85",
        "unit": "mm",
        "tolerance": "\u00b10.5 mm",
        "conditions": "Ground contact envelope",
        "status": "verified"
      },
      {
        "name": "Max Static Payload",
        "value": "650",
        "unit": "kg",
        "tolerance": "Per wheel",
        "conditions": "At zero velocity",
        "status": "verified"
      },
      {
        "name": "Rated Dynamic Payload",
        "value": "400",
        "unit": "kg",
        "tolerance": "Per wheel",
        "conditions": "At 1.5 m/s continuous rolling",
        "status": "verified"
      },
      {
        "name": "4-Wheel Chassis Payload",
        "value": "1200",
        "unit": "kg",
        "tolerance": "Safe operating load",
        "conditions": "Accounting for 3-point contact on imperfect floors",
        "status": "verified"
      },
      {
        "name": "Perimeter Roller Quantity",
        "value": "12",
        "unit": "rollers",
        "tolerance": "Exact",
        "conditions": "Heavy-duty contoured rollers",
        "status": "verified"
      },
      {
        "name": "Roller Angle",
        "value": "45.0",
        "unit": "deg",
        "tolerance": "\u00b10.2 deg",
        "conditions": "Left and Right handed pair matching",
        "status": "verified"
      },
      {
        "name": "Roller Durometer",
        "value": "92 Shore A",
        "unit": "hardness",
        "tolerance": "\u00b12 Sh A",
        "conditions": "High-grade cast polyurethane compound",
        "status": "verified"
      },
      {
        "name": "Axle Roller Bearings",
        "value": "Dual Sealed Ball Bearings per Roller",
        "unit": "bearing",
        "tolerance": "ABEC 5",
        "conditions": "24 total bearings per wheel",
        "status": "verified"
      },
      {
        "name": "Maximum Vehicle Velocity",
        "value": "2.2",
        "unit": "m/s",
        "tolerance": "Max",
        "conditions": "With calibrated motor speeds",
        "status": "verified"
      }
    ],
    "categorySpecificSpecs": {
      "Wheel Construction": "High-Tensile Cold-Forged Steel Side Plates with Anodized Spacers",
      "Handedness Configuration": "Supplied in Left-Hand (LH) and Right-Hand (RH) matched pairs",
      "Hub Interface": "Universal 6-bolt flange pattern on \u00d870mm pitch / Keyed bore \u00d825mm",
      "Roller Core": "Solid Steel Precision Ground Axles with Oil Seals"
    },
    "useCases": [
      "Omnidirectional automated guided vehicles (AGVs) operating in narrow rack aisles",
      "High-precision component docking shuttles in cleanroom semiconductor fabs",
      "Heavy aerospace fuselage alignment and wing spar transfer carts",
      "Flexible robotic workcell shuttles moving between machining stations"
    ],
    "unsuitableApplications": [
      "Floors with severe potholes or steps > 10 mm (causes intense roller impact)",
      "Greasy or oily warehouse floors causing roller slippage and odometry drift"
    ],
    "mechanicalMounting": {
      "flangeStandard": "6-Bolt Flange Interface (\u00d870mm B.C.D) or Direct Keyed Hub",
      "boltPattern": "6x M6 through-holes on \u00d870mm circle",
      "alignmentPin": "Center pilot bore \u00d850H7",
      "maxOverhungLoad": "4500 N radial load at mounting face",
      "recommendedFasteners": "Grade 10.9 M6 Socket Screws, torque 15 Nm",
      "orientationNotes": "Must be installed in standard Mecanum 'X-pattern' or 'O-pattern' for valid kinematics"
    },
    "electricalRequirements": {
      "supplyVoltage": "Passive mechanical wheel; requires 4x independent servo/BLDC motor drives",
      "ratedCurrent": "N/A",
      "peakCurrent": "N/A",
      "motorType": "Pairs with 400W - 1000W BLDC or PMSM servo motors with planetary gearboxes",
      "driveRequirement": "4-axis coordinated velocity control drive",
      "feedbackInterface": "High-resolution encoders on all four drive motors for accurate odometry"
    },
    "controlAndCommunication": {
      "fieldbuses": [
        "CANopen",
        "EtherCAT",
        "ROS 2 Navigation Stack compatible"
      ],
      "controlModes": [
        "4-Wheel Mecanum Kinematic Matrix Transformation (Vx, Vy, Vtheta)"
      ],
      "cycleTime": "2 ms to 10 ms",
      "ioChannels": "N/A",
      "syncJitter": "< 2 \u00b5s"
    },
    "environmentalAndSafety": {
      "operatingTemp": "-10\u00b0C to +45\u00b0C",
      "storageTemp": "-25\u00b0C to +65\u00b0C",
      "humidity": "Up to 90% non-condensing",
      "ipRating": "IP54 mechanical assembly",
      "safetyCertifications": [
        "CE Machinery Directive",
        "RoHS Compliant"
      ],
      "applicableDirectives": [
        "ISO 3691-4 Safety of Driverless Industrial Trucks"
      ],
      "unsuitableApplications": [
        "Direct chemical washdown with aggressive esters or ketones"
      ]
    },
    "selectionConsiderations": {
      "primaryCriteria": [
        "Four-point load distribution: uneven floors cause one wheel to lose traction; size assuming 3 wheels carry full vehicle load",
        "Vehicle acceleration limits: lateral strafing generates 30% higher motor torque demand than pure forward rolling",
        "Floor friction: ensure adequate coefficient of friction to avoid roller slip during rapid braking"
      ],
      "inertiaRatioLimit": "Ensure four drive motors maintain tight speed synchronization to prevent chassis crabbing.",
      "thermalDeratingNotes": "Continuous sideways strafing at > 1.2 m/s accelerates polyurethane roller temperature rise.",
      "recommendedSafetyFactor": "SF \u2265 1.8 on dynamic payload rating per wheel.",
      "sizingFormulasHint": "Mecanum Kinematics: V1 = Vx - Vy - (a+b)*w; V2 = Vx + Vy + (a+b)*w; V3 = Vx + Vy - (a+b)*w; V4 = Vx - Vy + (a+b)*w."
    },
    "integrationDependencies": [
      "4 independent planetary gearmotors",
      "4-axis synchronized drive amplifier",
      "Suspension rocker bogie"
    ],
    "relatedProductIds": [
      "drive",
      "omni",
      "mobile-modules",
      "motion-controllers"
    ],
    "downloadableDocs": [
      {
        "title": "Mecanum Wheel (WHL-MEC-204) Technical Datasheet",
        "type": "Datasheet",
        "format": "PDF",
        "size": "3.2 MB",
        "refCode": "DS-WHL-MEC-204",
        "verified": true
      },
      {
        "title": "Mecanum Wheel 3D CAD Assembly Model",
        "type": "CAD 3D STEP",
        "format": "STEP",
        "size": "22.5 MB",
        "refCode": "CAD-WHL-MEC-204",
        "verified": true
      },
      {
        "title": "Mecanum Wheel Integration & Commissioning Guide",
        "type": "Manual",
        "format": "PDF",
        "size": "2.1 MB",
        "refCode": "MAN-WHL-MEC-204",
        "verified": true
      }
    ]
  },
  "mobile-modules": {
    "id": "mobile-modules",
    "categorySlug": "robotic-wheels",
    "modelIdentifier": "IND-MOD-SWR-300-SD",
    "componentType": "Dual-Servo Swerve Drive Steer-Traction Mobile Robot Module",
    "datasheet": {
      "documentNumber": "DS-MOD-SWR-2026-REV2",
      "revision": "Rev 2.2",
      "releaseDate": "2026-03-02",
      "verificationLevel": "Verified Specification",
      "traceableSource": "INDUS Mobile Robotics Lab Qualification #7"
    },
    "functionalOverview": "The IND-MOD-SWR-300 is a dual-servo swerve drive module engineered for high-agility, heavy-payload automated guided vehicles and mobile manipulators. It provides independent 360\u00b0 continuous steering orientation and independent traction power on a single polyurethane wheel hub, delivering the omnidirectional mobility of Mecanum wheels with the traction efficiency, obstacle climbing, and high payload capacity of conventional solid drive wheels.",
    "parameters": [
      {
        "name": "Max Wheel Load Capacity",
        "value": "600",
        "unit": "kg",
        "tolerance": "Per module",
        "conditions": "Dynamic rolling load at full speed",
        "status": "verified"
      },
      {
        "name": "Maximum Travel Velocity",
        "value": "2.5",
        "unit": "m/s",
        "tolerance": "\u00b15%",
        "conditions": "At 48 VDC bus voltage",
        "status": "verified"
      },
      {
        "name": "Continuous Traction Thrust",
        "value": "850",
        "unit": "N",
        "tolerance": "\u00b15%",
        "conditions": "Traction motor continuous S1",
        "status": "verified"
      },
      {
        "name": "Peak Acceleration Thrust",
        "value": "1950",
        "unit": "N",
        "tolerance": "\u00b18%",
        "conditions": "Max duration 2.5s",
        "status": "verified"
      },
      {
        "name": "Steering Articulation Range",
        "value": "360\u00b0 Continuous",
        "unit": "deg",
        "tolerance": "Unlimited",
        "conditions": "Integrated slip-ring free hollow steering bearing",
        "status": "verified"
      },
      {
        "name": "Steering Slew Rate",
        "value": "360",
        "unit": "deg/s",
        "tolerance": "\u00b15%",
        "conditions": "From zero to full 90\u00b0 crab turn in 0.25s",
        "status": "verified"
      },
      {
        "name": "Steering Angular Repeatability",
        "value": "\u00b10.05",
        "unit": "deg",
        "tolerance": "Closed-loop",
        "conditions": "With 19-bit steering absolute encoder",
        "status": "verified"
      },
      {
        "name": "Wheel Diameter x Width",
        "value": "160 x 60",
        "unit": "mm",
        "tolerance": "\u00b10.5 mm",
        "conditions": "95A polyurethane tread",
        "status": "verified"
      },
      {
        "name": "Overall Module Height",
        "value": "215",
        "unit": "mm",
        "tolerance": "\u00b11 mm",
        "conditions": "Ultra-low chassis clearance envelope",
        "status": "verified"
      },
      {
        "name": "Module Total Mass",
        "value": "18.5",
        "unit": "kg",
        "tolerance": "\u00b10.5 kg",
        "conditions": "Including motors, gearboxes, and encoders",
        "status": "verified"
      }
    ],
    "categorySpecificSpecs": {
      "Traction Drivetrain": "750W 48V PMSM Servomotor + Precision Planetary Reducer (Ratio 15:1)",
      "Steering Drivetrain": "400W 48V PMSM Servomotor + Low-Backlash Worm/Hypoid Reducer (Ratio 30:1)",
      "Wheel Suspension": "Integrated 25mm Travel Coaxial Spring Damper for Floor Compliance",
      "Safety Features": "Hardware Safe Torque Off (STO SIL 3) on traction and steering axes"
    },
    "useCases": [
      "Heavy industrial Autonomous Mobile Robots (AMRs) with payloads from 1000kg to 3000kg",
      "Mobile Manipulators (Cobot arm mounted on autonomous mobile base)",
      "Automated logistics tuggers operating in tight manufacturing cells",
      "Aircraft engine and heavy turbine maintenance transport cradles"
    ],
    "unsuitableApplications": [
      "Deep water or outdoor mud environments without IP67 sealed variant",
      "High-speed transit > 4.0 m/s on uneven asphalt roadways"
    ],
    "mechanicalMounting": {
      "flangeStandard": "Top Chassis Mounting Flange (8-Bolt Circle)",
      "boltPattern": "8x M8 tapped holes on \u00d8180mm circle",
      "alignmentPin": "Center pilot ring \u00d8150h7",
      "maxOverhungLoad": "6000 N vertical shock load capacity",
      "recommendedFasteners": "Grade 10.9 M8 Cap Screws, torque 30 Nm",
      "orientationNotes": "Vertical top-mount bolting directly into AGV structural chassis frame"
    },
    "electricalRequirements": {
      "supplyVoltage": "48 VDC nominal battery bus (36 VDC to 56 VDC operating)",
      "ratedCurrent": "22 A DC continuous total (Traction + Steering)",
      "peakCurrent": "55 A DC peak acceleration",
      "motorType": "Dual Permanent Magnet Synchronous Motors (PMSM)",
      "driveRequirement": "Dual-axis low-voltage compact servo amplifier (EtherCAT / CANopen)",
      "feedbackInterface": "Dual absolute encoders (steering 19-bit absolute + traction motor encoder)"
    },
    "controlAndCommunication": {
      "fieldbuses": [
        "EtherCAT CoE",
        "CANopen CiA 402",
        "ROS 2 nav2 swerve controller"
      ],
      "controlModes": [
        "Coordinated Swerve Inverse Kinematics (Wheel Speed + Steering Angle)"
      ],
      "cycleTime": "1 ms deterministic update loop",
      "ioChannels": "Hardware STO lines, emergency brake release input",
      "syncJitter": "< 1 \u00b5s"
    },
    "environmentalAndSafety": {
      "operatingTemp": "-10\u00b0C to +45\u00b0C",
      "storageTemp": "-25\u00b0C to +70\u00b0C",
      "humidity": "10% to 90% non-condensing",
      "ipRating": "IP54 complete module; IP65 drive motor enclosures",
      "safetyCertifications": [
        "ISO 3691-4 Industrial AGV Safety Standard Compliant",
        "T\u00dcV STO SIL 3"
      ],
      "applicableDirectives": [
        "EN 1175",
        "CE Machinery Directive"
      ],
      "unsuitableApplications": [
        "Direct chemical submersion"
      ]
    },
    "selectionConsiderations": {
      "primaryCriteria": [
        "Vehicle total gross weight (payload + chassis + battery): 4 modules support up to 2400kg GVW",
        "Steering response time: rapid 90\u00b0 crab maneuvers require high steering slew torque",
        "Suspension travel: 25mm spring compliance prevents wheel lift-off over floor transitions"
      ],
      "inertiaRatioLimit": "Ensure chassis traction and steering loops are tuned with feed-forward velocity terms.",
      "thermalDeratingNotes": "Sustained high-torque uphill towing requires thermal monitoring of 48V battery and drive.",
      "recommendedSafetyFactor": "SF \u2265 1.5 on total traction thrust.",
      "sizingFormulasHint": "Swerve Kinematics: Wheel_Angle_i = atan2(Vy_i, Vx_i); Wheel_Speed_i = sqrt(Vx_i^2 + Vy_i^2)."
    },
    "integrationDependencies": [
      "48V Lithium-ion battery system (min 60Ah recommended)",
      "Dual-axis servo drive or 2x single drives",
      "Chassis master PC with ROS2 / EtherCAT"
    ],
    "relatedProductIds": [
      "drive",
      "mecanum",
      "servo-drives",
      "motion-controllers"
    ],
    "downloadableDocs": [
      {
        "title": "Swerve Drive Module (MOD-SWR-300) Technical Datasheet",
        "type": "Datasheet",
        "format": "PDF",
        "size": "3.2 MB",
        "refCode": "DS-MOD-SWR-300",
        "verified": true
      },
      {
        "title": "Swerve Drive Module 3D CAD Assembly Model",
        "type": "CAD 3D STEP",
        "format": "STEP",
        "size": "22.5 MB",
        "refCode": "CAD-MOD-SWR-300",
        "verified": true
      },
      {
        "title": "Swerve Drive Module Integration & Commissioning Guide",
        "type": "Manual",
        "format": "PDF",
        "size": "2.1 MB",
        "refCode": "MAN-MOD-SWR-300",
        "verified": true
      }
    ]
  },
  "4-axis": {
    "id": "4-axis",
    "categorySlug": "robotic-arms",
    "modelIdentifier": "IND-ARM-SCA-600-H",
    "componentType": "High-Speed SCARA 4-Axis Assembly Robot",
    "datasheet": {
      "documentNumber": "DS-ARM-SCA-2026-REV3",
      "revision": "Rev 3.0",
      "releaseDate": "2026-02-14",
      "verificationLevel": "Verified Specification",
      "traceableSource": "INDUS Robot Kinematics Lab ISO 9283 Test Rig #1"
    },
    "functionalOverview": "The IND-ARM-SCA-600 is a high-speed 4-axis SCARA (Selective Compliance Articulated Robot Arm) engineered for high-throughput assembly, screwdriving, dispensing, and electronic component insertion. Utilizing rigid cylindrical joints in the horizontal X-Y plane and a stiff vertical ballscrew-spline quill (Z and Theta), it delivers sub-millimeter insertion precision with cycle times down to 0.38 seconds.",
    "parameters": [
      {
        "name": "Nominal Wrist Payload",
        "value": "3.0",
        "unit": "kg",
        "tolerance": "Nominal",
        "conditions": "At maximum speed cycle",
        "status": "verified"
      },
      {
        "name": "Maximum Payload Capacity",
        "value": "6.0",
        "unit": "kg",
        "tolerance": "Max",
        "conditions": "With reduced Z-axis acceleration",
        "status": "verified"
      },
      {
        "name": "Horizontal Maximum Reach",
        "value": "600",
        "unit": "mm",
        "tolerance": "Arm 1 (300mm) + Arm 2 (300mm)",
        "conditions": "R_max horizontal envelope",
        "status": "verified"
      },
      {
        "name": "Z-Axis Vertical Stroke",
        "value": "200",
        "unit": "mm",
        "tolerance": "\u00b10.5 mm",
        "conditions": "Ball screw spline quill travel (300mm option)",
        "status": "verified"
      },
      {
        "name": "Standard Cycle Time",
        "value": "0.38",
        "unit": "s",
        "tolerance": "ISO 25-300-25mm",
        "conditions": "25mm up, 300mm over, 25mm down with 2kg load",
        "status": "verified"
      },
      {
        "name": "Pose Repeatability (X-Y)",
        "value": "\u00b10.015",
        "unit": "mm",
        "tolerance": "ISO 9283",
        "conditions": "At stabilized 20\u00b0C room temperature",
        "status": "verified"
      },
      {
        "name": "Z-Axis Height Repeatability",
        "value": "\u00b10.010",
        "unit": "mm",
        "tolerance": "ISO 9283",
        "conditions": "Direct linear ball screw drive",
        "status": "verified"
      },
      {
        "name": "Theta (J4) Angular Repeatability",
        "value": "\u00b10.005",
        "unit": "deg",
        "tolerance": "ISO 9283",
        "conditions": "Harmonic drive hollow quill",
        "status": "verified"
      },
      {
        "name": "Maximum Composite Speed",
        "value": "7200",
        "unit": "mm/s",
        "tolerance": "Peak TCP",
        "conditions": "Combined J1 + J2 + Z sweep",
        "status": "verified"
      },
      {
        "name": "Total Manipulator Mass",
        "value": "28.5",
        "unit": "kg",
        "tolerance": "\u00b10.5 kg",
        "conditions": "Arm body without tool tooling",
        "status": "verified"
      }
    ],
    "categorySpecificSpecs": {
      "Kinematic Configuration": "Selective Compliance Articulated Robot Arm (SCARA J1, J2, J3, J4)",
      "Joint Ranges": "J1: \u00b1130\u00b0, J2: \u00b1150\u00b0, J3 (Z): 200mm, J4 (Theta): \u00b1360\u00b0",
      "Utility Connections": "Through-quill internal 4x \u00d84mm pneumatic lines + 15-pin D-sub signal connector",
      "Tool Flange": "Circular pilot \u00d820h7 with 4x M4 threaded holes"
    },
    "useCases": [
      "High-speed electronic PCB component picking, placing, and soldering",
      "Automated screwdriving with torque transducer feedback",
      "Micro-dispensing of conformal coatings and thermal paste",
      "Automated inspection tray loading and unloading"
    ],
    "unsuitableApplications": [
      "Heavy machining or grinding operations generating continuous side loads > 120 N on quill",
      "Direct washdown in food protein environments without IP65 cleanroom jacket"
    ],
    "mechanicalMounting": {
      "flangeStandard": "Rigid Base Pedestal Mount (4-Bolt Pattern)",
      "boltPattern": "4x M10 high-tensile bolts on 160x160mm square",
      "alignmentPin": "2x \u00d88h7 locating dowels on machine base plate",
      "maxOverhungLoad": "180 N static side load on extended Z quill",
      "recommendedFasteners": "Grade 10.9 M10 Fasteners, torque 50 Nm",
      "orientationNotes": "Floor pedestal mount standard; wall mount or inverted ceiling mount available"
    },
    "electricalRequirements": {
      "supplyVoltage": "Single-Phase 200-240 VAC, 50/60 Hz",
      "ratedCurrent": "4.8 A nominal operating current",
      "peakCurrent": "14.2 A peak acceleration current",
      "motorType": "AC Brushless Servomotors on all 4 axes with absolute feedback",
      "driveRequirement": "Dedicated compact multi-axis robot controller cabinet",
      "feedbackInterface": "23-bit optical absolute encoders (no battery backup needed)"
    },
    "controlAndCommunication": {
      "fieldbuses": [
        "EtherCAT CoE",
        "PROFINET",
        "EtherNet/IP",
        "Modbus TCP"
      ],
      "controlModes": [
        "Continuous Path (CP), Point-to-Point (PTP), Conveyor Tracking"
      ],
      "cycleTime": "1 ms trajectory interpolation",
      "ioChannels": "16x Dedicated Digital Inputs, 16x Digital Outputs (24VDC PNP)",
      "syncJitter": "< 1 \u00b5s"
    },
    "environmentalAndSafety": {
      "operatingTemp": "0\u00b0C to +40\u00b0C",
      "storageTemp": "-20\u00b0C to +60\u00b0C",
      "humidity": "20% to 85% RH non-condensing",
      "ipRating": "IP54 standard (IP65 / Cleanroom ISO Class 5 optional)",
      "safetyCertifications": [
        "CE Machinery Directive 2006/42/EC",
        "EN ISO 10218-1:2011"
      ],
      "applicableDirectives": [
        "ANSI/RIA R15.06-2012",
        "EN 60204-1"
      ],
      "unsuitableApplications": [
        "ATEX explosive environments"
      ]
    },
    "selectionConsiderations": {
      "primaryCriteria": [
        "End-effector mass plus payload: verify total moment of inertia J_z around Theta axis",
        "Required cycle rate (parts per minute): verify thermal duty cycle on Z-axis ball screw",
        "Conveyor tracking requirements: requires encoder input card for moving belt tracking"
      ],
      "inertiaRatioLimit": "Keep payload moment of inertia J_load around J4 quill \u2264 0.05 kg*m^2.",
      "thermalDeratingNotes": "Continuous aggressive cycling (> 100 picks/min) requires convective cabinet ventilation.",
      "recommendedSafetyFactor": "SF \u2265 1.5 on rated payload for high-acceleration trajectories.",
      "sizingFormulasHint": "Cycle time check: T_cycle = t_accel + t_cruise + t_decel + t_settle. Verify quill deflection delta = F*L^3 / (3*E*I)."
    },
    "integrationDependencies": [
      "INDUS robot controller cabinet",
      "External 24VDC safety fence circuit",
      "Pneumatic air supply 0.5-0.7 MPa"
    ],
    "relatedProductIds": [
      "pick-and-place",
      "assembly",
      "robot-controllers",
      "linear"
    ],
    "downloadableDocs": [
      {
        "title": "SCARA 4-Axis Robot (ARM-SCA-600) Technical Datasheet",
        "type": "Datasheet",
        "format": "PDF",
        "size": "3.2 MB",
        "refCode": "DS-ARM-SCA-600",
        "verified": true
      },
      {
        "title": "SCARA 4-Axis Robot 3D CAD Assembly Model",
        "type": "CAD 3D STEP",
        "format": "STEP",
        "size": "22.5 MB",
        "refCode": "CAD-ARM-SCA-600",
        "verified": true
      },
      {
        "title": "SCARA 4-Axis Robot Integration & Commissioning Guide",
        "type": "Manual",
        "format": "PDF",
        "size": "2.1 MB",
        "refCode": "MAN-ARM-SCA-600",
        "verified": true
      }
    ]
  },
  "6-axis": {
    "id": "6-axis",
    "categorySlug": "robotic-arms",
    "modelIdentifier": "IND-ARM-6AX-1400-P",
    "componentType": "High-Precision 6-Axis Articulated Industrial Robot",
    "datasheet": {
      "documentNumber": "DS-ARM-6AX-2026-REV4",
      "revision": "Rev 4.1",
      "releaseDate": "2026-03-01",
      "verificationLevel": "Verified Specification",
      "traceableSource": "INDUS Robotics Laser Tracker Metrology Facility (ISO 9283)"
    },
    "functionalOverview": "The IND-ARM-6AX-1400 is a versatile 6-axis articulated industrial robot engineered for precision material handling, machine tending, laser cutting, gluing, and automated deburring. Built with high-torque cycloidal base reducers and zero-backlash harmonic wrist stages, it combines a 1420mm spherical reach envelope with ISO 9283 pose repeatability within \u00b10.03mm.",
    "parameters": [
      {
        "name": "Rated Wrist Payload",
        "value": "12.0",
        "unit": "kg",
        "tolerance": "Nominal",
        "conditions": "Full reach and dynamic envelope",
        "status": "verified"
      },
      {
        "name": "Maximum Payload Capacity",
        "value": "15.0",
        "unit": "kg",
        "tolerance": "Max",
        "conditions": "With reduced wrist acceleration",
        "status": "verified"
      },
      {
        "name": "Maximum Spherical Reach",
        "value": "1420",
        "unit": "mm",
        "tolerance": "\u00b11 mm",
        "conditions": "From J1 center to J6 wrist flange face",
        "status": "verified"
      },
      {
        "name": "Pose Repeatability (RP)",
        "value": "\u00b10.030",
        "unit": "mm",
        "tolerance": "ISO 9283",
        "conditions": "Measured across 30 points at full reach",
        "status": "verified"
      },
      {
        "name": "Path Repeatability (RT)",
        "value": "\u00b10.050",
        "unit": "mm",
        "tolerance": "ISO 9283",
        "conditions": "Linear contouring at 500 mm/s",
        "status": "verified"
      },
      {
        "name": "Maximum TCP Velocity",
        "value": "2800",
        "unit": "mm/s",
        "tolerance": "Composite",
        "conditions": "Full arm interpolation sweep",
        "status": "verified"
      },
      {
        "name": "Wrist Permissible Moment (M_roll)",
        "value": "38.5",
        "unit": "Nm",
        "tolerance": "Dynamic",
        "conditions": "J4 / J5 wrist axis limit",
        "status": "verified"
      },
      {
        "name": "Wrist Permissible Moment (M_pitch)",
        "value": "38.5",
        "unit": "Nm",
        "tolerance": "Dynamic",
        "conditions": "J5 / J6 axis limit",
        "status": "verified"
      },
      {
        "name": "Wrist Permissible Inertia",
        "value": "1.05",
        "unit": "kg\u00b7m\u00b2",
        "tolerance": "Max",
        "conditions": "Around J6 output flange axis",
        "status": "verified"
      },
      {
        "name": "Robot Manipulator Weight",
        "value": "145",
        "unit": "kg",
        "tolerance": "\u00b12 kg",
        "conditions": "Cast aluminum/iron arm structure",
        "status": "verified"
      }
    ],
    "categorySpecificSpecs": {
      "Degrees of Freedom": "6 Revolute Articulated Joints (J1 to J6)",
      "Joint Motion Range": "J1: \u00b1170\u00b0, J2: -135\u00b0/+85\u00b0, J3: -70\u00b0/+190\u00b0, J4: \u00b1180\u00b0, J5: \u00b1125\u00b0, J6: \u00b1360\u00b0",
      "Tool Flange Standard": "DIN ISO 9409-1-50-4-M6 Standard Wrist Flange",
      "Protection Rating": "IP65 Arm Body / IP67 Sealed Wrist Assembly"
    },
    "useCases": [
      "CNC machine tending and raw stock loading/unloading",
      "Automotive component dispensing, adhesive bonding, and sealing",
      "Laser cutting, plasma trimming, and automated deburring",
      "Palletizing cases and crates up to 12kg at high cycle rates"
    ],
    "unsuitableApplications": [
      "Heavy arc welding with high spatter without specialized heat shield package",
      "Direct food washdown contact without IP69K stainless steel cladding"
    ],
    "mechanicalMounting": {
      "flangeStandard": "Robot Base Footprint (4-Bolt Circle Pattern)",
      "boltPattern": "4x M16 Grade 12.9 high-strength bolts on \u00d8260mm circle",
      "alignmentPin": "2x \u00d812m6 precision locating pins on steel mounting base",
      "maxOverhungLoad": "Dynamic overturning moment on base foundation: 3800 Nm",
      "recommendedFasteners": "Grade 12.9 M16 Cap Screws, torque 280 Nm",
      "orientationNotes": "Floor mount, wall mount, or ceiling (inverted) mount configured in controller"
    },
    "electricalRequirements": {
      "supplyVoltage": "3-Phase 380-480 VAC, 50/60 Hz (3.5 kVA)",
      "ratedCurrent": "7.5 A continuous line current",
      "peakCurrent": "22.0 A peak acceleration current",
      "motorType": "AC Synchronous Permanent Magnet Servomotors with electro-mechanical brakes on all 6 axes",
      "driveRequirement": "Multi-axis servo controller cabinet with regenerative resistor",
      "feedbackInterface": "24-bit absolute multi-turn optical encoders"
    },
    "controlAndCommunication": {
      "fieldbuses": [
        "EtherCAT Master/Slave",
        "PROFINET IRT",
        "EtherNet/IP",
        "CC-Link IE Field"
      ],
      "controlModes": [
        "Joint Space Interpolation, Cartesian Linear & Circular Contouring, Spline Path"
      ],
      "cycleTime": "1 ms deterministic trajectory calculation",
      "ioChannels": "32x Digital Inputs, 32x Digital Outputs, 4x Analogue Channels",
      "syncJitter": "< 500 ns"
    },
    "environmentalAndSafety": {
      "operatingTemp": "0\u00b0C to +45\u00b0C ambient",
      "storageTemp": "-25\u00b0C to +60\u00b0C",
      "humidity": "10% to 90% RH non-condensing",
      "ipRating": "IP65 standard / IP67 wrist",
      "safetyCertifications": [
        "EN ISO 10218-1:2011 Robots for Industrial Environments",
        "CE Machinery Directive"
      ],
      "applicableDirectives": [
        "EN ISO 13849-1 PL d Cat 3 Safety Integrity",
        "ANSI/RIA R15.06"
      ],
      "unsuitableApplications": [
        "Direct explosive paint spray areas without purge barrier"
      ]
    },
    "selectionConsiderations": {
      "primaryCriteria": [
        "Gripper mass + part mass: verify total payload is within wrist moment limit M_roll and M_pitch",
        "Payload center of gravity (CG) distance from wrist flange: offset reduces effective allowable mass",
        "Workspace reach envelope: ensure target pick and place coordinates avoid joint singularity points"
      ],
      "inertiaRatioLimit": "Ensure tool inertia around J6 \u2264 1.05 kg*m^2 to prevent wrist drive over-temperature.",
      "thermalDeratingNotes": "High-speed continuous cycling at ambient > 40\u00b0C requires 10% velocity reduction.",
      "recommendedSafetyFactor": "SF \u2265 1.5 on dynamic wrist moment.",
      "sizingFormulasHint": "Wrist Moment M = m_load * g * L_cg + I_load * alpha_max. Must satisfy M <= M_allowable."
    },
    "integrationDependencies": [
      "INDUS RC-600 Controller Cabinet",
      "Safety interlock gate switch circuit",
      "Teach Pendant with emergency stop"
    ],
    "relatedProductIds": [
      "collaborative",
      "handling",
      "welding",
      "robot-controllers"
    ],
    "downloadableDocs": [
      {
        "title": "6-Axis Articulated Robot (ARM-6AX-1400) Technical Datasheet",
        "type": "Datasheet",
        "format": "PDF",
        "size": "3.2 MB",
        "refCode": "DS-ARM-6AX-1400",
        "verified": true
      },
      {
        "title": "6-Axis Articulated Robot 3D CAD Assembly Model",
        "type": "CAD 3D STEP",
        "format": "STEP",
        "size": "22.5 MB",
        "refCode": "CAD-ARM-6AX-1400",
        "verified": true
      },
      {
        "title": "6-Axis Articulated Robot Integration & Commissioning Guide",
        "type": "Manual",
        "format": "PDF",
        "size": "2.1 MB",
        "refCode": "MAN-ARM-6AX-1400",
        "verified": true
      }
    ]
  },
  "collaborative": {
    "id": "collaborative",
    "categorySlug": "robotic-arms",
    "modelIdentifier": "IND-ARM-COB-1000-C",
    "componentType": "Human-Collaborative Robot Arm (Cobot)",
    "datasheet": {
      "documentNumber": "DS-ARM-COB-2026-REV5",
      "revision": "Rev 5.0",
      "releaseDate": "2026-03-08",
      "verificationLevel": "Verified Specification",
      "traceableSource": "T\u00dcV Rheinland Functional Safety ISO 10218 / ISO/TS 15066 Audit"
    },
    "functionalOverview": "The IND-ARM-COB-1000 is a certified collaborative 6-axis robot arm designed for direct human-robot collaboration without physical perimeter safety fencing. Featuring dual high-resolution torque sensors integrated into all 6 joints, rounded aluminum link contours, and configurable safety zones complying with ISO/TS 15066 (Power and Force Limiting), it provides intuitive hand-guide teaching and seamless line deployment.",
    "parameters": [
      {
        "name": "Rated Wrist Payload",
        "value": "10.0",
        "unit": "kg",
        "tolerance": "Nominal",
        "conditions": "Full reach envelope without derating",
        "status": "verified"
      },
      {
        "name": "Maximum Working Radius",
        "value": "1300",
        "unit": "mm",
        "tolerance": "\u00b11 mm",
        "conditions": "Spherical working envelope",
        "status": "verified"
      },
      {
        "name": "Pose Repeatability",
        "value": "\u00b10.030",
        "unit": "mm",
        "tolerance": "ISO 9283",
        "conditions": "Under full 10kg payload",
        "status": "verified"
      },
      {
        "name": "Collaborative Contact Force Threshold",
        "value": "< 65",
        "unit": "N",
        "tolerance": "Configurable",
        "conditions": "ISO/TS 15066 compliant collision stop in < 50ms",
        "status": "verified"
      },
      {
        "name": "Collaborative TCP Speed Limit",
        "value": "250 - 1000",
        "unit": "mm/s",
        "tolerance": "Configurable",
        "conditions": "250 mm/s collaborative mode; 1000 mm/s high-speed mode",
        "status": "verified"
      },
      {
        "name": "Joint Torque Sensor Accuracy",
        "value": "\u00b10.5%",
        "unit": "% FS",
        "tolerance": "Full scale",
        "conditions": "Dual strain-gauge torque sensors on all 6 axes",
        "status": "verified"
      },
      {
        "name": "Total Manipulator Mass",
        "value": "33.5",
        "unit": "kg",
        "tolerance": "\u00b10.5 kg",
        "conditions": "Ultra-lightweight aerospace alloy links",
        "status": "verified"
      },
      {
        "name": "Power Consumption",
        "value": "350",
        "unit": "W",
        "tolerance": "Average",
        "conditions": "Typical production cycle with 5kg payload",
        "status": "verified"
      },
      {
        "name": "Safety Integrity Level",
        "value": "Cat 3 PL d / SIL 2",
        "unit": "ISO 13849-1",
        "conditions": "16 configurable safety functions (STO, SLS, SLP, SS1)",
        "status": "verified"
      }
    ],
    "categorySpecificSpecs": {
      "Joint Actuation": "Integrated Smart Servo Actuators with Frameless Motors and Harmonic Reducers",
      "Collision Sensing": "Dual Joint-Level Torque Transducers + Motor Current Discrepancy Filter",
      "Lead-Through Programming": "Direct hand-guide zero-gravity teaching button on wrist tool flange",
      "Tool Flange Interface": "ISO 9409-1-50-4-M6 with 8-Pin M8 connector (RS-485 + 24V I/O)"
    },
    "useCases": [
      "Collaborative assembly alongside human operators on final assembly lines",
      "Machine tending with open operator access to CNC door fixtures",
      "Automated quality inspection with portable 3D optical cameras",
      "Box palletizing and depalletizing with integrated safety laser scanners"
    ],
    "unsuitableApplications": [
      "Sharp razor cutting or open chemical spraying without supplementary safety containment",
      "Extreme thermal foundry environments > 50\u00b0C"
    ],
    "mechanicalMounting": {
      "flangeStandard": "Compact Base Flange (\u00d8160mm)",
      "boltPattern": "4x M10 tapped holes on \u00d8130mm circle",
      "alignmentPin": "2x \u00d86h7 locating dowels on base mounting ring",
      "maxOverhungLoad": "1200 Nm base dynamic overturning moment",
      "recommendedFasteners": "Grade 10.9 M10 Socket Screws, torque 45 Nm",
      "orientationNotes": "Mountable at any angle: floor, ceiling, wall, or mobile AMR chassis"
    },
    "electricalRequirements": {
      "supplyVoltage": "Single-Phase 100-240 VAC, 50/60 Hz or 48 VDC (Battery Powered Mobile Variant)",
      "ratedCurrent": "3.5 A (at 230 VAC)",
      "peakCurrent": "8.5 A peak acceleration",
      "motorType": "Low-voltage 48V brushless PMSM frameless torque motors",
      "driveRequirement": "Built-in decentralized joint drives; external control cabinet requires 24V/48V power only",
      "feedbackInterface": "Dual 19-bit absolute magnetic encoders (motor rotor + joint output)"
    },
    "controlAndCommunication": {
      "fieldbuses": [
        "EtherCAT CoE",
        "Modbus TCP",
        "ROS 2 driver",
        "TCP/IP Socket Interface"
      ],
      "controlModes": [
        "Gravity Compensation / Free-Drive, Cartesian Trajectory, Impedance / Force Control"
      ],
      "cycleTime": "1 ms trajectory loop rate",
      "ioChannels": "16x Configurable Safety I/O, 4x High-Speed Pulse Counters",
      "syncJitter": "< 500 ns"
    },
    "environmentalAndSafety": {
      "operatingTemp": "0\u00b0C to +50\u00b0C",
      "storageTemp": "-20\u00b0C to +70\u00b0C",
      "humidity": "20% to 90% non-condensing",
      "ipRating": "IP54 complete arm (IP65 cleanroom jacket optional)",
      "safetyCertifications": [
        "T\u00dcV Certified ISO 13849-1 PL d Cat 3",
        "ISO/TS 15066 Cobot Safety Specification"
      ],
      "applicableDirectives": [
        "EN ISO 10218-1",
        "CE Machinery Directive"
      ],
      "unsuitableApplications": [
        "Direct heavy weld spatter exposure without protective sleeve"
      ]
    },
    "selectionConsiderations": {
      "primaryCriteria": [
        "Risk Assessment: human-robot contact zones must be evaluated under ISO/TS 15066 pressure/force limits",
        "Payload + Tooling mass: verify center of gravity offset within 1300mm envelope",
        "Required cycle time: collaborative speed limits (250 mm/s) vs fence-free productivity targets"
      ],
      "inertiaRatioLimit": "Due to high gear ratio harmonic joints, reflected inertia is decoupled; focus on structural stiffness.",
      "thermalDeratingNotes": "Operate within 80% duty cycle at maximum payload to prevent joint thermal throttling.",
      "recommendedSafetyFactor": "SF \u2265 1.5 on payload rating.",
      "sizingFormulasHint": "Safety stopping distance: S = v * t_react + (v^2) / (2 * a_brake). Force check F_contact <= F_biomechanical_limit."
    },
    "integrationDependencies": [
      "INDUS Compact Cobot Controller",
      "Teach Pendant / Tablet Interface",
      "End-effector (Electric gripper or vacuum tool)"
    ],
    "relatedProductIds": [
      "servo",
      "6-axis",
      "robot-controllers",
      "assembly"
    ],
    "downloadableDocs": [
      {
        "title": "Collaborative Robot Arm (ARM-COB-1000) Technical Datasheet",
        "type": "Datasheet",
        "format": "PDF",
        "size": "3.2 MB",
        "refCode": "DS-ARM-COB-1000",
        "verified": true
      },
      {
        "title": "Collaborative Robot Arm 3D CAD Assembly Model",
        "type": "CAD 3D STEP",
        "format": "STEP",
        "size": "22.5 MB",
        "refCode": "CAD-ARM-COB-1000",
        "verified": true
      },
      {
        "title": "Collaborative Robot Arm Integration & Commissioning Guide",
        "type": "Manual",
        "format": "PDF",
        "size": "2.1 MB",
        "refCode": "MAN-ARM-COB-1000",
        "verified": true
      }
    ]
  },
  "pick-and-place": {
    "id": "pick-and-place",
    "categorySlug": "robotic-arms",
    "modelIdentifier": "IND-ARM-DLT-1200-F",
    "componentType": "High-Speed Parallel Delta Robot",
    "datasheet": {
      "documentNumber": "DS-ARM-DLT-2026-REV3",
      "revision": "Rev 3.0",
      "releaseDate": "2026-02-22",
      "verificationLevel": "Verified Specification",
      "traceableSource": "INDUS High-Speed Packaging Test Cell #4"
    },
    "functionalOverview": "The IND-ARM-DLT-1200 is a parallel kinematic Delta robot engineered for ultra-high-speed pick-and-place, carton loading, blister packaging, and secondary sorting. With three high-torque direct-driven base motors and carbon-fiber composite parallel arms moving a lightweight titanium tool platform, it executes up to 180 picks per minute with sub-millimeter repeatable accuracy.",
    "parameters": [
      {
        "name": "Rated Payload Capacity",
        "value": "3.0",
        "unit": "kg",
        "tolerance": "Nominal",
        "conditions": "At maximum 180 picks/min cycle",
        "status": "verified"
      },
      {
        "name": "Maximum Payload Capacity",
        "value": "6.0",
        "unit": "kg",
        "tolerance": "Max",
        "conditions": "At reduced acceleration (< 12 G)",
        "status": "verified"
      },
      {
        "name": "Working Envelope Diameter",
        "value": "1200",
        "unit": "mm",
        "tolerance": "\u00b12 mm",
        "conditions": "Cylindrical diameter at tool platform",
        "status": "verified"
      },
      {
        "name": "Working Envelope Height (Z)",
        "value": "350",
        "unit": "mm",
        "tolerance": "\u00b11 mm",
        "conditions": "Vertical travel range (450mm extended option)",
        "status": "verified"
      },
      {
        "name": "Maximum Cycle Rate",
        "value": "180",
        "unit": "picks/min",
        "tolerance": "Standard test",
        "conditions": "25-300-25mm trajectory with 1kg payload",
        "status": "verified"
      },
      {
        "name": "Maximum Acceleration",
        "value": "15.0",
        "unit": "G",
        "tolerance": "Peak",
        "conditions": "Equivalent to 150 m/s\u00b2 peak acceleration",
        "status": "verified"
      },
      {
        "name": "Pose Repeatability (XYZ)",
        "value": "\u00b10.05",
        "unit": "mm",
        "tolerance": "ISO 9283",
        "conditions": "At stabilized operating temperature",
        "status": "verified"
      },
      {
        "name": "Angular Repeatability (Theta Axis)",
        "value": "\u00b10.02",
        "unit": "deg",
        "tolerance": "ISO 9283",
        "conditions": "With optional 4th rotational axis quill",
        "status": "verified"
      },
      {
        "name": "Total Delta Mechanism Weight",
        "value": "65.0",
        "unit": "kg",
        "tolerance": "\u00b11 kg",
        "conditions": "Excluding overhead mounting frame",
        "status": "verified"
      }
    ],
    "categorySpecificSpecs": {
      "Kinematic Architecture": "3-DoF Parallel Kinematic Linkage (Optional 4th Telescopic Theta Axis)",
      "Arm Link Construction": "High-Modulus Carbon Fiber Reinforced Polymer (CFRP) Tubes with Ceramic Ball Joints",
      "Tool Platform": "Aerospace Grade 7075 Titanium Alloy with Vacuum Feedthrough",
      "Protection Rating": "IP65 standard (IP69K washdown option available)"
    },
    "useCases": [
      "Ultra-high-speed sorting and packaging of food, baked goods, and confectioneries",
      "Pharmaceutical blister pack carton loading and syringe sorting",
      "Electronics assembly kitting and small hardware collating",
      "Vision-guided random conveyor pick-and-place tracking"
    ],
    "unsuitableApplications": [
      "Heavy cantilevered moment payloads > 6kg (causes parallel arm link buckling)",
      "Deep bin-picking requiring complex 6-axis articulated angles (recommend 6-Axis)"
    ],
    "mechanicalMounting": {
      "flangeStandard": "Overhead Gantry Mounting Ring (Top-Mounted Suspension)",
      "boltPattern": "8x M12 high-strength bolts on \u00d8620mm circular pitch",
      "alignmentPin": "3x \u00d810h7 locating dowels on ceiling flange",
      "maxOverhungLoad": "Overhead dynamic downward shock force: 4500 N",
      "recommendedFasteners": "Grade 10.9 M12 Socket Head Bolts, torque 110 Nm",
      "orientationNotes": "Inverted overhead mounting on rigid steel gantry structure only"
    },
    "electricalRequirements": {
      "supplyVoltage": "3-Phase 380-480 VAC, 50/60 Hz (4.5 kVA)",
      "ratedCurrent": "9.2 A continuous operating current",
      "peakCurrent": "28.5 A peak acceleration current",
      "motorType": "3x Direct-Drive AC Brushless Synchronous Motors with low-backlash planetary reducers",
      "driveRequirement": "Multi-axis servo controller cabinet with dynamic braking unit",
      "feedbackInterface": "24-bit absolute multi-turn encoders on each primary arm"
    },
    "controlAndCommunication": {
      "fieldbuses": [
        "EtherCAT CoE",
        "PROFINET IRT",
        "GigE Vision Camera Interface"
      ],
      "controlModes": [
        "Parallel Kinematic Delta Transformation, Dynamic Moving Belt Conveyor Tracking"
      ],
      "cycleTime": "500 \u00b5s deterministic interpolation loop",
      "ioChannels": "16x Fast Digital Inputs (for optical part triggers), 16x Fast Outputs for vacuum valves",
      "syncJitter": "< 500 ns"
    },
    "environmentalAndSafety": {
      "operatingTemp": "0\u00b0C to +40\u00b0C",
      "storageTemp": "-20\u00b0C to +60\u00b0C",
      "humidity": "Up to 90% non-condensing",
      "ipRating": "IP65 standard; IP69K washdown optional with FDA approved seals",
      "safetyCertifications": [
        "EN ISO 10218-1",
        "CE Machinery Directive",
        "FDA Food Contact Materials Compliant"
      ],
      "applicableDirectives": [
        "EN 1672-2 Food Processing Machinery Hygiene Requirements"
      ],
      "unsuitableApplications": [
        "Direct abrasive grit environments"
      ]
    },
    "selectionConsiderations": {
      "primaryCriteria": [
        "Pick-and-place cycle rate: verify required takt time (e.g. 120 vs 180 picks/min) against motor RMS current",
        "Conveyor velocity: delta robot workspace must overlap moving conveyor belt tracking window",
        "Vacuum gripper response time: fast valve actuation (< 10 ms) is critical for 180 picks/min"
      ],
      "inertiaRatioLimit": "Ensure tool platform mass is minimized; every 100g of extra tooling reduces peak acceleration by 1.2 G.",
      "thermalDeratingNotes": "Continuous 180 picks/min cycling requires monitoring motor winding temperature.",
      "recommendedSafetyFactor": "SF \u2265 1.5 on motor thermal power.",
      "sizingFormulasHint": "Delta Kinematics Jacobian J relates motor velocities to Cartesian TCP velocity: V_tcp = J * theta_dot."
    },
    "integrationDependencies": [
      "Rigid overhead gantry frame (stiffness > 50 N/\u00b5m)",
      "High-speed vacuum blower / ejector",
      "Conveyor encoder interface"
    ],
    "relatedProductIds": [
      "4-axis",
      "robot-controllers",
      "motion-controllers",
      "servo-drives"
    ],
    "downloadableDocs": [
      {
        "title": "Parallel Delta Robot (ARM-DLT-1200) Technical Datasheet",
        "type": "Datasheet",
        "format": "PDF",
        "size": "3.2 MB",
        "refCode": "DS-ARM-DLT-1200",
        "verified": true
      },
      {
        "title": "Parallel Delta Robot 3D CAD Assembly Model",
        "type": "CAD 3D STEP",
        "format": "STEP",
        "size": "22.5 MB",
        "refCode": "CAD-ARM-DLT-1200",
        "verified": true
      },
      {
        "title": "Parallel Delta Robot Integration & Commissioning Guide",
        "type": "Manual",
        "format": "PDF",
        "size": "2.1 MB",
        "refCode": "MAN-ARM-DLT-1200",
        "verified": true
      }
    ]
  },
  "assembly": {
    "id": "assembly",
    "categorySlug": "industrial-robots",
    "modelIdentifier": "IND-ROB-ASM-085-H",
    "componentType": "Force-Guided Precision Assembly Robot",
    "datasheet": {
      "documentNumber": "DS-ROB-ASM-2026-REV3",
      "revision": "Rev 3.0",
      "releaseDate": "2026-02-20",
      "verificationLevel": "Verified Specification",
      "traceableSource": "INDUS Assembly Quality Lab Qual Rig #3"
    },
    "functionalOverview": "The IND-ROB-ASM-085 is an 850mm reach 6-axis robot engineered specifically for high-precision mechanical insertion, force-controlled fastener driving, and electronic sub-assembly. Featuring high-stiffness internal arm castings, minimal joint backlash, and native closed-loop 6-axis force-torque sensor integration, it achieves sub-20 micron pin-in-hole clearance insertions without jamming.",
    "parameters": [
      {
        "name": "Nominal Payload Capacity",
        "value": "7.0",
        "unit": "kg",
        "tolerance": "Nominal",
        "conditions": "Full dynamic speed",
        "status": "verified"
      },
      {
        "name": "Maximum Reach Radius",
        "value": "850",
        "unit": "mm",
        "tolerance": "\u00b10.5 mm",
        "conditions": "To wrist mounting face",
        "status": "verified"
      },
      {
        "name": "Pose Repeatability (ISO 9283)",
        "value": "\u00b10.020",
        "unit": "mm",
        "tolerance": "ISO 9283",
        "conditions": "Stabilized room temperature",
        "status": "verified"
      },
      {
        "name": "Force Control Insertion Clearance",
        "value": "15",
        "unit": "\u00b5m",
        "tolerance": "Achievable",
        "conditions": "With active 6-axis wrist F/T search pattern",
        "status": "verified"
      },
      {
        "name": "Maximum TCP Speed",
        "value": "2400",
        "unit": "mm/s",
        "tolerance": "Composite",
        "conditions": "Fast transfer between pick and insert",
        "status": "verified"
      },
      {
        "name": "Wrist Torque Rating (J4/J5)",
        "value": "18.5",
        "unit": "Nm",
        "tolerance": "Continuous",
        "conditions": "High-stiffness wrist reducers",
        "status": "verified"
      },
      {
        "name": "Total Robot Mass",
        "value": "48.0",
        "unit": "kg",
        "tolerance": "\u00b11 kg",
        "conditions": "Compact arm casting",
        "status": "verified"
      },
      {
        "name": "Cleanroom Compatibility",
        "value": "ISO Class 5 (Fed Std 209E Class 100)",
        "unit": "rating",
        "tolerance": "Certified",
        "conditions": "With vacuum exhaust port connected",
        "status": "verified"
      }
    ],
    "categorySpecificSpecs": {
      "Application Focus": "Precision Pin Insertion, Gear Assembly, Snap-Fitting, Fastening",
      "Integrated Sensor": "Integrated 6-Axis Wrist Force-Torque Sensor Interface (EtherCAT)",
      "Internal Cable Routing": "Full internal dress pack through arm casting",
      "Cleanroom Rating": "ISO Class 5 certified air exhaust sealing"
    },
    "useCases": [
      "Automotive transmission solenoid and planetary gear assembly",
      "Smartphone and consumer electronics connector insertion",
      "Medical syringe pump automated assembly and leak test loading",
      "Electric vehicle battery cell wire-bonding and connector seating"
    ],
    "unsuitableApplications": [
      "Heavy foundry casting transfer > 7kg",
      "Direct water submergence without IP67 pressurized jacket"
    ],
    "mechanicalMounting": {
      "flangeStandard": "ISO 9409-1-50-4-M6 Tool Flange",
      "boltPattern": "4x M12 high-strength bolts on base plate 180x180mm",
      "alignmentPin": "2x \u00d88h7 locating dowels on machine bench plate",
      "maxOverhungLoad": "650 Nm dynamic base overturning moment",
      "recommendedFasteners": "Grade 10.9 M12 Socket Head Bolts, torque 75 Nm",
      "orientationNotes": "Floor mount, table-top mount, ceiling, or 45-degree angle mount"
    },
    "electricalRequirements": {
      "supplyVoltage": "Single-Phase 200-240 VAC or 3-Phase 380-480 VAC (2.5 kVA)",
      "ratedCurrent": "5.5 A operating line current",
      "peakCurrent": "16.0 A peak acceleration current",
      "motorType": "AC Brushless Servomotors with 24-bit absolute encoders",
      "driveRequirement": "RC-600 Controller with active force control firmware module",
      "feedbackInterface": "Internal 24-bit absolute encoders + BiSS-C wrist force transducer"
    },
    "controlAndCommunication": {
      "fieldbuses": [
        "EtherCAT CoE",
        "PROFINET IRT",
        "EtherNet/IP",
        "OPC UA"
      ],
      "controlModes": [
        "Impedance / Admittance Force Control, Active Search Spiral, Lead-Through"
      ],
      "cycleTime": "500 \u00b5s force control loop rate",
      "ioChannels": "16x Fast Digital Inputs, 16x Fast Outputs, 2x Analogue F/T channels",
      "syncJitter": "< 500 ns"
    },
    "environmentalAndSafety": {
      "operatingTemp": "0\u00b0C to +45\u00b0C",
      "storageTemp": "-20\u00b0C to +60\u00b0C",
      "humidity": "10% to 85% non-condensing",
      "ipRating": "IP54 standard / IP65 sealed option",
      "safetyCertifications": [
        "EN ISO 10218-1",
        "CE Machinery Directive"
      ],
      "applicableDirectives": [
        "EN ISO 13849-1 PL d Cat 3"
      ],
      "unsuitableApplications": [
        "Abrasive dry blasting cells"
      ]
    },
    "selectionConsiderations": {
      "primaryCriteria": [
        "Part tolerance clearance: verify if clearance is tight (< 50 \u00b5m) requiring force control",
        "Tooling weight + gripper force: ensure total tool assembly remains under 7.0kg",
        "Insertion cycle time: force search routines require 0.2s - 0.5s settling time per insert"
      ],
      "inertiaRatioLimit": "Keep wrist inertia J_z \u2264 0.25 kg*m^2 for fast force loop reaction.",
      "thermalDeratingNotes": "Operate within rated speed to prevent sensor drift from thermal expansion.",
      "recommendedSafetyFactor": "SF \u2265 1.5 on continuous wrist torque.",
      "sizingFormulasHint": "Contact force balance: F_z = K_contact * delta_z + D * v_z. Controller regulates delta_z to maintain target F_z."
    },
    "integrationDependencies": [
      "INDUS RC-600 Assembly Controller",
      "6-Axis Force-Torque Sensor Flange",
      "Precision Pneumatic/Electric Gripper"
    ],
    "relatedProductIds": [
      "collaborative",
      "6-axis",
      "robot-controllers",
      "sensors-feedback"
    ],
    "downloadableDocs": [
      {
        "title": "Assembly Robot (ROB-ASM-085) Technical Datasheet",
        "type": "Datasheet",
        "format": "PDF",
        "size": "3.2 MB",
        "refCode": "DS-ROB-ASM-085",
        "verified": true
      },
      {
        "title": "Assembly Robot 3D CAD Assembly Model",
        "type": "CAD 3D STEP",
        "format": "STEP",
        "size": "22.5 MB",
        "refCode": "CAD-ROB-ASM-085",
        "verified": true
      },
      {
        "title": "Assembly Robot Integration & Commissioning Guide",
        "type": "Manual",
        "format": "PDF",
        "size": "2.1 MB",
        "refCode": "MAN-ROB-ASM-085",
        "verified": true
      }
    ]
  },
  "welding": {
    "id": "welding",
    "categorySlug": "industrial-robots",
    "modelIdentifier": "IND-ROB-WLD-1800-A",
    "componentType": "Dedicated Hollow-Wrist Arc & Laser Welding Robot",
    "datasheet": {
      "documentNumber": "DS-ROB-WLD-2026-REV4",
      "revision": "Rev 4.0",
      "releaseDate": "2026-03-04",
      "verificationLevel": "Verified Specification",
      "traceableSource": "INDUS Welding Automation Test Bay #2 (Weld Seam Tracking Lab)"
    },
    "functionalOverview": "The IND-ROB-WLD-1800 is a dedicated 6-axis welding robot engineered with a hollow arm and hollow wrist (\u00d850mm through-bore) allowing complete internal routing of welding torch cables, wire feed conduits, shielding gas, and water cooling hoses. This eliminates torch cable whip, guarantees consistent wire feed resistance, and enables deep reach into complex structural fabrications without cable snagging.",
    "parameters": [
      {
        "name": "Nominal Payload Capacity",
        "value": "8.0",
        "unit": "kg",
        "tolerance": "Nominal",
        "conditions": "Dedicated for MIG/MAG, TIG, or Laser welding torch packages",
        "status": "verified"
      },
      {
        "name": "Maximum Spherical Reach",
        "value": "1820",
        "unit": "mm",
        "tolerance": "\u00b11 mm",
        "conditions": "Large envelope covering wide automotive weld fixtures",
        "status": "verified"
      },
      {
        "name": "Pose Repeatability (ISO 9283)",
        "value": "\u00b10.030",
        "unit": "mm",
        "tolerance": "ISO 9283",
        "conditions": "At stabilized welding operating temperature",
        "status": "verified"
      },
      {
        "name": "Path Repeatability along Weld Seam",
        "value": "\u00b10.040",
        "unit": "mm",
        "tolerance": "ISO 9283",
        "conditions": "Constant speed 25 mm/s weld contouring",
        "status": "verified"
      },
      {
        "name": "Hollow Wrist Through-Bore",
        "value": "50",
        "unit": "mm",
        "tolerance": "Clear aperture",
        "conditions": "Internal routing of torch cable package",
        "status": "verified"
      },
      {
        "name": "Maximum TCP Speed",
        "value": "2600",
        "unit": "mm/s",
        "tolerance": "Air-cut speed",
        "conditions": "Rapid positioning between weld seams",
        "status": "verified"
      },
      {
        "name": "Total Robot Manipulator Weight",
        "value": "215",
        "unit": "kg",
        "tolerance": "\u00b13 kg",
        "conditions": "Rugged cast iron base and arm",
        "status": "verified"
      },
      {
        "name": "Ingress & Spatter Protection",
        "value": "IP67 Wrist / IP65 Body",
        "unit": "rating",
        "tolerance": "Sealed",
        "conditions": "Metallic wiper seals resistant to hot weld spatter",
        "status": "verified"
      }
    ],
    "categorySpecificSpecs": {
      "Wrist Architecture": "Hollow-Wrist Coaxial Gearing with \u00d850mm Unobstructed Internal Conduit",
      "Weld Package Integration": "Direct digital fieldbus interface to Fronius, Lincoln Electric, Kemppi weld power sources",
      "Seam Tracking Functions": "Through-Arc Seam Tracking (TAST) + Optical 3D Laser Seam Tracking interface",
      "Spatter Resistance": "High-temperature fluorosilicone seals and spark-deflecting casting contours"
    },
    "useCases": [
      "Automotive chassis frame, sub-frame, and exhaust MIG/MAG welding",
      "Heavy earthmoving equipment and agricultural implement fabrication",
      "Precision laser welding of electric vehicle battery busbars and trays",
      "Pressure vessel and structural pipe circumferential welding"
    ],
    "unsuitableApplications": [
      "Heavy spot-welding guns weighing > 8kg (recommend Handling / Heavy 6-Axis)",
      "Direct water submersion"
    ],
    "mechanicalMounting": {
      "flangeStandard": "Specialized Hollow Welding Torch Flange (ISO 9409-1-50-4-M6)",
      "boltPattern": "4x M16 Grade 12.9 high-strength bolts on \u00d8300mm base circle",
      "alignmentPin": "2x \u00d812m6 precision locating pins on welding pedestal",
      "maxOverhungLoad": "Dynamic overturning base moment: 4500 Nm",
      "recommendedFasteners": "Grade 12.9 M16 Cap Screws, torque 290 Nm",
      "orientationNotes": "Floor mounting, elevated pedestal, wall mount, or inverted gantry track mounting"
    },
    "electricalRequirements": {
      "supplyVoltage": "3-Phase 380-480 VAC, 50/60 Hz (4.5 kVA)",
      "ratedCurrent": "9.5 A line current",
      "peakCurrent": "26.0 A peak acceleration current",
      "motorType": "AC Synchronous Permanent Magnet Servomotors with high-grade shielding against HF arc noise",
      "driveRequirement": "INDUS RC-600W Welding Controller with integrated welding software stack",
      "feedbackInterface": "24-bit absolute encoders with optical isolation"
    },
    "controlAndCommunication": {
      "fieldbuses": [
        "EtherCAT",
        "PROFINET (Welding Profile)",
        "EtherNet/IP",
        "DeviceNet"
      ],
      "controlModes": [
        "Coordinated Motion with 1-Axis or 2-Axis External Welding Positioners, Weaving Profiles (Sine, Triangle, Trapezoid)"
      ],
      "cycleTime": "1 ms deterministic trajectory and arc parameter synchronization",
      "ioChannels": "High-Speed Arc Start/Sense I/O, Wire Touch Sensing (WTS) inputs",
      "syncJitter": "< 500 ns"
    },
    "environmentalAndSafety": {
      "operatingTemp": "0\u00b0C to +45\u00b0C",
      "storageTemp": "-25\u00b0C to +65\u00b0C",
      "humidity": "10% to 90% non-condensing",
      "ipRating": "IP67 wrist / IP65 base",
      "safetyCertifications": [
        "EN ISO 10218-1",
        "CE Machinery Directive",
        "EN 60974-1 Arc Welding Safety"
      ],
      "applicableDirectives": [
        "EN ISO 13849-1 PL d Cat 3",
        "EMC Directive 2014/30/EU (High-Frequency Arc Immunity)"
      ],
      "unsuitableApplications": [
        "Explosive gas paint booths"
      ]
    },
    "selectionConsiderations": {
      "primaryCriteria": [
        "Welding torch + wire feeder weight: ensure total torch assembly with collision clutch is under 8.0kg",
        "Joint access & reach: 1820mm reach allows welding full automotive sub-frames without indexer moves",
        "Coordinated external axes: synchronize robot motion with 2-axis tilt-turn positioner tables"
      ],
      "inertiaRatioLimit": "Hollow wrist geometry concentrates mass near joint center, minimizing wrist rotational inertia.",
      "thermalDeratingNotes": "Continuous 100% duty cycle arc welding requires water-cooled torch package.",
      "recommendedSafetyFactor": "SF \u2265 1.5 on torch payload.",
      "sizingFormulasHint": "Weave amplitude and frequency check: f_weave = v_weld / pitch_weave. Ensure acceleration does not exceed 8 m/s^2."
    },
    "integrationDependencies": [
      "INDUS RC-600W Welding Controller Cabinet",
      "Digital Welding Power Source",
      "Welding Torch with Collision Sensor",
      "Fume Extraction System"
    ],
    "relatedProductIds": [
      "6-axis",
      "handling",
      "cycloidal",
      "robot-controllers"
    ],
    "downloadableDocs": [
      {
        "title": "Welding Robot (ROB-WLD-1800) Technical Datasheet",
        "type": "Datasheet",
        "format": "PDF",
        "size": "3.2 MB",
        "refCode": "DS-ROB-WLD-1800",
        "verified": true
      },
      {
        "title": "Welding Robot 3D CAD Assembly Model",
        "type": "CAD 3D STEP",
        "format": "STEP",
        "size": "22.5 MB",
        "refCode": "CAD-ROB-WLD-1800",
        "verified": true
      },
      {
        "title": "Welding Robot Integration & Commissioning Guide",
        "type": "Manual",
        "format": "PDF",
        "size": "2.1 MB",
        "refCode": "MAN-ROB-WLD-1800",
        "verified": true
      }
    ]
  },
  "handling": {
    "id": "handling",
    "categorySlug": "industrial-robots",
    "modelIdentifier": "IND-ROB-HND-2100-H",
    "componentType": "Heavy-Duty Material Handling & Machine Tending Robot",
    "datasheet": {
      "documentNumber": "DS-ROB-HND-2026-REV3",
      "revision": "Rev 3.0",
      "releaseDate": "2026-02-26",
      "verificationLevel": "Verified Specification",
      "traceableSource": "INDUS Heavy Handling Reliability Bay #5"
    },
    "functionalOverview": "The IND-ROB-HND-2100 is a heavy-duty 6-axis industrial robot engineered for rigorous material handling, foundry casting extraction, forging press tending, and heavy machine tool loading. Built with massive cast ductile iron link structures, oversized cycloidal reducers on J1-J3, and an IP67 fully sealed wrist, it handles 50kg payloads across a 2050mm reach with exceptional stiffness under rapid emergency stops.",
    "parameters": [
      {
        "name": "Nominal Payload Capacity",
        "value": "50.0",
        "unit": "kg",
        "tolerance": "Nominal",
        "conditions": "Full dynamic acceleration and reach",
        "status": "verified"
      },
      {
        "name": "Maximum Payload Capacity",
        "value": "60.0",
        "unit": "kg",
        "tolerance": "Max",
        "conditions": "With 15% reduced wrist acceleration",
        "status": "verified"
      },
      {
        "name": "Maximum Spherical Reach",
        "value": "2050",
        "unit": "mm",
        "tolerance": "\u00b11 mm",
        "conditions": "From base center to wrist flange",
        "status": "verified"
      },
      {
        "name": "Pose Repeatability (ISO 9283)",
        "value": "\u00b10.040",
        "unit": "mm",
        "tolerance": "ISO 9283",
        "conditions": "Full 50kg payload at maximum reach",
        "status": "verified"
      },
      {
        "name": "Wrist Permissible Moment (M_roll)",
        "value": "245.0",
        "unit": "Nm",
        "tolerance": "Dynamic",
        "conditions": "J4 / J5 axis rating",
        "status": "verified"
      },
      {
        "name": "Wrist Permissible Moment (M_pitch)",
        "value": "245.0",
        "unit": "Nm",
        "tolerance": "Dynamic",
        "conditions": "J5 / J6 axis rating",
        "status": "verified"
      },
      {
        "name": "Wrist Permissible Inertia",
        "value": "11.5",
        "unit": "kg\u00b7m\u00b2",
        "tolerance": "Max",
        "conditions": "Around J6 output axis",
        "status": "verified"
      },
      {
        "name": "Maximum Composite TCP Velocity",
        "value": "2200",
        "unit": "mm/s",
        "tolerance": "Peak",
        "conditions": "Coordinated multi-axis sweep",
        "status": "verified"
      },
      {
        "name": "Total Robot Manipulator Weight",
        "value": "520",
        "unit": "kg",
        "tolerance": "\u00b15 kg",
        "conditions": "Heavy rigid iron casting",
        "status": "verified"
      }
    ],
    "categorySpecificSpecs": {
      "Drivetrain Construction": "High-Capacity Dual-Disc Cycloidal Reducers (J1, J2, J3) + Precision Planetary/Harmonic Wrists",
      "Foundry Protection Option": "Specialized high-temperature epoxy coating with pressurized air purge (IP67 Foundry Plus)",
      "Tool Flange": "DIN ISO 9409-1-125-6-M10 Standard Heavy Wrist Flange",
      "Brake System": "Fail-Safe Spring-Applied Holding Brakes on all 6 axes"
    },
    "useCases": [
      "Heavy CNC horizontal lathe and 5-axis milling machine tending",
      "High-pressure aluminum die casting part extraction and quenching",
      "Automotive engine block, cylinder head, and rotor handling",
      "Heavy metal stamping press line transfer and destacking"
    ],
    "unsuitableApplications": [
      "Direct water jet cutting without specialized stainless cladding",
      "Ultra-high-speed packaging > 80 picks/min (recommend Delta/SCARA)"
    ],
    "mechanicalMounting": {
      "flangeStandard": "Standard Heavy Robot Base Footprint",
      "boltPattern": "8x M20 Grade 12.9 foundation bolts on \u00d8420mm circle",
      "alignmentPin": "2x \u00d816m6 precision reamed locating pins",
      "maxOverhungLoad": "Dynamic overturning base foundation moment: 14,500 Nm",
      "recommendedFasteners": "Grade 12.9 M20 Hex Cap Screws, torque 550 Nm with hardened washers",
      "orientationNotes": "Floor mounting standard; optional shelf mount configuration for machine tending"
    },
    "electricalRequirements": {
      "supplyVoltage": "3-Phase 380-480 VAC, 50/60 Hz (7.5 kVA)",
      "ratedCurrent": "15.5 A line current",
      "peakCurrent": "45.0 A peak acceleration current",
      "motorType": "High-Inertia Brushless AC Synchronous Servomotors",
      "driveRequirement": "INDUS RC-600H Heavy Controller with high-capacity regeneration chopper",
      "feedbackInterface": "24-bit absolute multi-turn optical encoders"
    },
    "controlAndCommunication": {
      "fieldbuses": [
        "EtherCAT",
        "PROFINET IRT",
        "EtherNet/IP",
        "DeviceNet"
      ],
      "controlModes": [
        "Continuous Path, High-Inertia Load Identification, SoftAct Compliant Part Insertion"
      ],
      "cycleTime": "1 ms deterministic trajectory loop",
      "ioChannels": "32x Digital Inputs, 32x Digital Outputs, 8x Pneumatic Valve outputs",
      "syncJitter": "< 500 ns"
    },
    "environmentalAndSafety": {
      "operatingTemp": "0\u00b0C to +45\u00b0C (Foundry option up to +55\u00b0C)",
      "storageTemp": "-25\u00b0C to +65\u00b0C",
      "humidity": "10% to 95% non-condensing",
      "ipRating": "IP67 entire robot arm (wrist and body)",
      "safetyCertifications": [
        "EN ISO 10218-1",
        "CE Machinery Directive"
      ],
      "applicableDirectives": [
        "EN ISO 13849-1 PL d Cat 3 Safety Circuit",
        "ANSI/RIA R15.06"
      ],
      "unsuitableApplications": [
        "Explosive gas atmosphere without explosion-proof enclosure"
      ]
    },
    "selectionConsiderations": {
      "primaryCriteria": [
        "Gripper mass + heavy component: verify wrist dynamic moment M_roll, M_pitch, and inertia J_z",
        "Emergency stop impact: calculate dynamic deceleration forces on machine base foundation",
        "Reach envelope depth: ensure robot can reach deep into CNC chuck or press die area without elbow interference"
      ],
      "inertiaRatioLimit": "Verify that load inertia around J6 \u2264 11.5 kg*m^2 to prevent wrist drive tripping during rapid stop.",
      "thermalDeratingNotes": "Continuous heavy cycles at ambient > 40\u00b0C require cabinet air conditioner.",
      "recommendedSafetyFactor": "SF \u2265 1.5 on dynamic wrist moments.",
      "sizingFormulasHint": "Base Overturning Moment M_base = m_robot * g * r_cg + m_load * (g + a_max) * R_max. Must not exceed 14,500 Nm."
    },
    "integrationDependencies": [
      "INDUS RC-600H Controller Cabinet",
      "Heavy Duty Steel Foundation Plate (min 40mm thick)",
      "Dual-channel safety interlock enclosure"
    ],
    "relatedProductIds": [
      "6-axis",
      "cycloidal",
      "welding",
      "palletizing"
    ],
    "downloadableDocs": [
      {
        "title": "Heavy Handling Robot (ROB-HND-2100) Technical Datasheet",
        "type": "Datasheet",
        "format": "PDF",
        "size": "3.2 MB",
        "refCode": "DS-ROB-HND-2100",
        "verified": true
      },
      {
        "title": "Heavy Handling Robot 3D CAD Assembly Model",
        "type": "CAD 3D STEP",
        "format": "STEP",
        "size": "22.5 MB",
        "refCode": "CAD-ROB-HND-2100",
        "verified": true
      },
      {
        "title": "Heavy Handling Robot Integration & Commissioning Guide",
        "type": "Manual",
        "format": "PDF",
        "size": "2.1 MB",
        "refCode": "MAN-ROB-HND-2100",
        "verified": true
      }
    ]
  },
  "inspection": {
    "id": "inspection",
    "categorySlug": "industrial-robots",
    "modelIdentifier": "IND-ROB-INS-1200-M",
    "componentType": "Metrology-Grade 3D Optical Inspection Robot",
    "datasheet": {
      "documentNumber": "DS-ROB-INS-2026-REV2",
      "revision": "Rev 2.1",
      "releaseDate": "2026-02-18",
      "verificationLevel": "Verified Specification",
      "traceableSource": "INDUS Metrology Center Zeiss CMM Laser Qualification #2"
    },
    "functionalOverview": "The IND-ROB-INS-1200 is a specialized 6-axis robot engineered specifically for high-accuracy non-contact dimensional inspection, 3D laser scanning, and structured-light optical metrology. Featuring thermally compensated composite link shells, ultra-low-backlash harmonic drives, and active vibration-damped servo loop algorithms, it provides volumetric positioning accuracy calibrated to ISO 10360-8 standards.",
    "parameters": [
      {
        "name": "Nominal Sensor Payload",
        "value": "10.0",
        "unit": "kg",
        "tolerance": "Nominal",
        "conditions": "Dedicated for 3D optical scanner or laser profiler",
        "status": "verified"
      },
      {
        "name": "Maximum Reach Radius",
        "value": "1200",
        "unit": "mm",
        "tolerance": "\u00b10.5 mm",
        "conditions": "Spherical working volume",
        "status": "verified"
      },
      {
        "name": "Pose Repeatability (RP)",
        "value": "\u00b10.015",
        "unit": "mm",
        "tolerance": "ISO 9283",
        "conditions": "Calibrated with dynamic laser tracker",
        "status": "verified"
      },
      {
        "name": "Volumetric Absolute Accuracy",
        "value": "\u00b10.050",
        "unit": "mm",
        "tolerance": "ISO 10360-8",
        "conditions": "With 24-point kinematic DH parameter calibration",
        "status": "verified"
      },
      {
        "name": "Pose Stabilization / Settle Time",
        "value": "< 120",
        "unit": "ms",
        "tolerance": "To \u00b10.01mm",
        "conditions": "Ultra-fast settling for optical sensor capture",
        "status": "verified"
      },
      {
        "name": "Thermal Drift Coefficient",
        "value": "< 3.5",
        "unit": "\u00b5m/\u00b0C",
        "tolerance": "Max",
        "conditions": "Internal temperature sensors with active compensation",
        "status": "verified"
      },
      {
        "name": "Maximum Inspection Velocity",
        "value": "800",
        "unit": "mm/s",
        "tolerance": "Scan mode",
        "conditions": "Ultra-smooth constant velocity contouring",
        "status": "verified"
      },
      {
        "name": "Total Manipulator Mass",
        "value": "88.0",
        "unit": "kg",
        "tolerance": "\u00b11 kg",
        "conditions": "Thermally stabilized structural casting",
        "status": "verified"
      }
    ],
    "categorySpecificSpecs": {
      "Metrology Calibration": "Factory-calibrated with 6-DoF Laser Tracker according to ISO 10360-8 standards",
      "Sensor Integration": "Direct GigE Vision, USB 3.0, and Camera Trigger pass-through wiring inside arm",
      "Vibration Damping": "Active Notch Filtering & Feedforward Accelerometer Compensation in servo loop",
      "Tool Flange": "High-Precision Ground Flange ISO 9409-1-50-4-M6 with dowel repeatability < 5 \u00b5m"
    },
    "useCases": [
      "Automotive body panel gap-and-flush automated optical measurement",
      "Aerospace turbine blade 3D point-cloud comparison to CAD models",
      "Consumer electronics enclosure dimensional tolerance verification",
      "Weld seam geometry, bead width, and undercut automated laser inspection"
    ],
    "unsuitableApplications": [
      "Heavy contact grinding or mechanical stamping with high reaction forces",
      "Submerged continuous washdown without protective cleanroom sleeve"
    ],
    "mechanicalMounting": {
      "flangeStandard": "Metrology Base Flange (\u00d8220mm)",
      "boltPattern": "4x M12 Grade 10.9 high-precision bolts on \u00d8180mm circle",
      "alignmentPin": "2x \u00d810h7 hardened dowel pins for repeatable cell re-indexing",
      "maxOverhungLoad": "1100 Nm base overturning moment",
      "recommendedFasteners": "Grade 10.9 M12 Socket Head Screws, torque 80 Nm",
      "orientationNotes": "Floor pedestal mount standard; optical rail mount variant available"
    },
    "electricalRequirements": {
      "supplyVoltage": "Single-Phase 200-240 VAC or 3-Phase 380-480 VAC, 50/60 Hz (2.8 kVA)",
      "ratedCurrent": "6.0 A operating line current",
      "peakCurrent": "18.0 A peak acceleration current",
      "motorType": "Ultra-Smooth AC Synchronous Servomotors with low cogging torque (< 1%)",
      "driveRequirement": "INDUS RC-600M Metrology Controller with deterministic optical sensor sync",
      "feedbackInterface": "26-bit optical absolute encoders on all 6 axes"
    },
    "controlAndCommunication": {
      "fieldbuses": [
        "EtherCAT CoE",
        "GigE Vision (IEEE 1588 PTP Sync)",
        "PROFINET",
        "TCP/IP"
      ],
      "controlModes": [
        "Smooth Spline Contouring, Precision Static Pose Dwell, Optical Position Latch"
      ],
      "cycleTime": "500 \u00b5s interpolation loop with hardware camera trigger output",
      "ioChannels": "4x High-Speed Optical Trigger Outputs (< 1 \u00b5s latency), 16x Digital I/O",
      "syncJitter": "< 200 ns"
    },
    "environmentalAndSafety": {
      "operatingTemp": "+15\u00b0C to +35\u00b0C (Optimal metrology range 20\u00b0C \u00b1 2\u00b0C)",
      "storageTemp": "-20\u00b0C to +60\u00b0C",
      "humidity": "20% to 75% non-condensing",
      "ipRating": "IP54 complete arm",
      "safetyCertifications": [
        "EN ISO 10218-1",
        "CE Machinery Directive"
      ],
      "applicableDirectives": [
        "ISO 10360-8 Acceptance Metrology Test for CMMs",
        "EN ISO 13849-1 PL d"
      ],
      "unsuitableApplications": [
        "Abrasive grit environments without positive air purge"
      ]
    },
    "selectionConsiderations": {
      "primaryCriteria": [
        "Sensor weight + mounting bracket: verify total weight is \u2264 10kg to maintain metrology accuracy",
        "Thermal stability of inspection cell: maintain ambient within \u00b12\u00b0C for micron-level measurements",
        "Camera triggering sync: verify camera frame rate and hardware pulse sync"
      ],
      "inertiaRatioLimit": "Low cogging and low inertia payload are critical to achieve zero-vibration settling within 120 ms.",
      "thermalDeratingNotes": "Temperature changes > 3\u00b0C require automatic recalibration against optical datum sphere.",
      "recommendedSafetyFactor": "SF \u2265 2.0 on sensor payload to maintain optimal metrology stiffness.",
      "sizingFormulasHint": "Thermal expansion delta_L = alpha * L * delta_T. Active firmware compensates for arm link temperature sensors."
    },
    "integrationDependencies": [
      "INDUS RC-600M Metrology Controller",
      "3D Optical Scanner or Laser Line Profiler",
      "Metrology Datum Reference Sphere"
    ],
    "relatedProductIds": [
      "assembly",
      "6-axis",
      "robot-controllers",
      "sensors-feedback"
    ],
    "downloadableDocs": [
      {
        "title": "Inspection Robot (ROB-INS-1200) Technical Datasheet",
        "type": "Datasheet",
        "format": "PDF",
        "size": "3.2 MB",
        "refCode": "DS-ROB-INS-1200",
        "verified": true
      },
      {
        "title": "Inspection Robot 3D CAD Assembly Model",
        "type": "CAD 3D STEP",
        "format": "STEP",
        "size": "22.5 MB",
        "refCode": "CAD-ROB-INS-1200",
        "verified": true
      },
      {
        "title": "Inspection Robot Integration & Commissioning Guide",
        "type": "Manual",
        "format": "PDF",
        "size": "2.1 MB",
        "refCode": "MAN-ROB-INS-1200",
        "verified": true
      }
    ]
  },
  "palletizing": {
    "id": "palletizing",
    "categorySlug": "industrial-robots",
    "modelIdentifier": "IND-ROB-PAL-3100-H",
    "componentType": "High-Throughput 4-Axis / 5-Axis Heavy Palletizing Robot",
    "datasheet": {
      "documentNumber": "DS-ROB-PAL-2026-REV3",
      "revision": "Rev 3.0",
      "releaseDate": "2026-03-02",
      "verificationLevel": "Verified Specification",
      "traceableSource": "INDUS Logistics Automation Palletizing Test Bay #1"
    },
    "functionalOverview": "The IND-ROB-PAL-3100 is a dedicated high-capacity palletizing robot featuring a high-stiffness parallel-link mechanical kinematic structure that keeps the tool flange parallel to the floor across its entire working envelope. With a massive 3150mm reach and a 180kg payload capacity, it stacks cartons, bags, crates, and bulk containers onto dual pallet stations at rates up to 1200 cycles per hour.",
    "parameters": [
      {
        "name": "Nominal Payload Capacity",
        "value": "180.0",
        "unit": "kg",
        "tolerance": "Nominal",
        "conditions": "Full dynamic speed including heavy gripper tooling",
        "status": "verified"
      },
      {
        "name": "Maximum Payload Capacity",
        "value": "220.0",
        "unit": "kg",
        "tolerance": "Max",
        "conditions": "With 20% acceleration derating",
        "status": "verified"
      },
      {
        "name": "Maximum Horizontal Reach",
        "value": "3150",
        "unit": "mm",
        "tolerance": "\u00b12 mm",
        "conditions": "Covers dual Euro/US pallet stations with slip-sheet feeders",
        "status": "verified"
      },
      {
        "name": "Maximum Palletizing Height",
        "value": "2400",
        "unit": "mm",
        "tolerance": "\u00b12 mm",
        "conditions": "Permits full 2.4m high pallet stack",
        "status": "verified"
      },
      {
        "name": "Palletizing Cycle Rate",
        "value": "1200",
        "unit": "cycles/h",
        "tolerance": "Standard cycle",
        "conditions": "400mm up, 2000mm transfer, 400mm down with 80kg load",
        "status": "verified"
      },
      {
        "name": "Pose Repeatability (ISO 9283)",
        "value": "\u00b10.050",
        "unit": "mm",
        "tolerance": "ISO 9283",
        "conditions": "Under full 180kg load",
        "status": "verified"
      },
      {
        "name": "Wrist Permissible Inertia",
        "value": "35.0",
        "unit": "kg\u00b7m\u00b2",
        "tolerance": "Max",
        "conditions": "High rotational inertia for multi-case grippers",
        "status": "verified"
      },
      {
        "name": "Total Robot Manipulator Weight",
        "value": "1150",
        "unit": "kg",
        "tolerance": "\u00b110 kg",
        "conditions": "Heavy-duty structural cast steel base",
        "status": "verified"
      }
    ],
    "categorySpecificSpecs": {
      "Kinematic Structure": "4-Axis Parallel-Link Kinematic Architecture (Mechanical Self-Leveling Wrist)",
      "Wrist Degrees of Freedom": "J1: \u00b1180\u00b0, J2: -50\u00b0/+85\u00b0, J3: -45\u00b0/+90\u00b0, J4 (Wrist Rotation): \u00b1360\u00b0",
      "Utility Conduit Package": "High-flow internal 2x \u00d816mm vacuum/pneumatic lines + high-flex fieldbus cable",
      "Tool Flange": "Heavy Palletizing Flange DIN ISO 9409-1-160-8-M12"
    },
    "useCases": [
      "End-of-line high-throughput carton, box, and crate palletizing",
      "Heavy 25kg/50kg flour, cement, and chemical bag stacking",
      "Beverage bottle crate and keg palletizing and depalletizing",
      "Mixed-SKU dynamic palletizing with 3D vision guidance"
    ],
    "unsuitableApplications": [
      "Complex 6-axis welding or machining requiring wrist tilt angles (tool stays parallel to ground)",
      "Direct chemical submersion"
    ],
    "mechanicalMounting": {
      "flangeStandard": "Heavy Structural Pedestal Base",
      "boltPattern": "8x M24 Grade 12.9 foundation bolts on \u00d8580mm circle",
      "alignmentPin": "2x \u00d820m6 precision alignment pins",
      "maxOverhungLoad": "Dynamic overturning base foundation moment: 32,000 Nm",
      "recommendedFasteners": "Grade 12.9 M24 Anchor Bolts, torque 950 Nm",
      "orientationNotes": "Floor mounting on reinforced concrete foundation (min 200mm slab thickness)"
    },
    "electricalRequirements": {
      "supplyVoltage": "3-Phase 380-480 VAC, 50/60 Hz (14 kVA)",
      "ratedCurrent": "24.0 A continuous operating current",
      "peakCurrent": "72.0 A peak dynamic acceleration current",
      "motorType": "High-Torque AC Brushless Synchronous Servomotors with heavy-duty holding brakes",
      "driveRequirement": "INDUS RC-600P Palletizing Controller with smart regenerative braking matrix",
      "feedbackInterface": "24-bit absolute multi-turn optical encoders"
    },
    "controlAndCommunication": {
      "fieldbuses": [
        "EtherCAT",
        "PROFINET IRT",
        "EtherNet/IP",
        "OPC UA"
      ],
      "controlModes": [
        "Dedicated Palletizing Pattern Generator, Conveyor Infeed Synchronization"
      ],
      "cycleTime": "1 ms deterministic trajectory calculation",
      "ioChannels": "32x Digital Inputs, 32x Digital Outputs, Vacuum Level Analog Inputs",
      "syncJitter": "< 500 ns"
    },
    "environmentalAndSafety": {
      "operatingTemp": "0\u00b0C to +45\u00b0C",
      "storageTemp": "-25\u00b0C to +65\u00b0C",
      "humidity": "10% to 95% non-condensing",
      "ipRating": "IP54 complete robot (IP65 sealed wrist)",
      "safetyCertifications": [
        "EN ISO 10218-1",
        "CE Machinery Directive",
        "ANSI/RIA R15.06"
      ],
      "applicableDirectives": [
        "EN ISO 13849-1 PL d Cat 3 Safety Integrity"
      ],
      "unsuitableApplications": [
        "ATEX explosive gas environments without certified purge enclosure"
      ]
    },
    "selectionConsiderations": {
      "primaryCriteria": [
        "Gripper mass + layer payload: verify total weight does not exceed 180kg at full 3150mm extension",
        "Palletizing height: 2400mm vertical reach enables loading full-height maritime shipping containers",
        "Foundation rigidity: 32,000 Nm overturning moment requires dedicated reinforced concrete pad"
      ],
      "inertiaRatioLimit": "Ensure large vacuum gripper rotational inertia around J4 \u2264 35 kg*m^2.",
      "thermalDeratingNotes": "Sustained 1200 cycles/hour operation in warm warehouses (> 35\u00b0C) requires cabinet cooling unit.",
      "recommendedSafetyFactor": "SF \u2265 1.5 on dynamic overturning moment.",
      "sizingFormulasHint": "Throughput check: Cycles_per_hour = 3600 / (t_infeed + t_transfer + t_release + t_return). Maximum 1200 cycles/h."
    },
    "integrationDependencies": [
      "INDUS RC-600P Palletizing Controller Cabinet",
      "Heavy Palletizing End-Effector (Vacuum Foam Gripper / Clamping Fork)",
      "Perimeter Safety Light Curtains with Muting"
    ],
    "relatedProductIds": [
      "handling",
      "cycloidal",
      "robot-controllers",
      "servo-drives"
    ],
    "downloadableDocs": [
      {
        "title": "Palletizing Robot (ROB-PAL-3100) Technical Datasheet",
        "type": "Datasheet",
        "format": "PDF",
        "size": "3.2 MB",
        "refCode": "DS-ROB-PAL-3100",
        "verified": true
      },
      {
        "title": "Palletizing Robot 3D CAD Assembly Model",
        "type": "CAD 3D STEP",
        "format": "STEP",
        "size": "22.5 MB",
        "refCode": "CAD-ROB-PAL-3100",
        "verified": true
      },
      {
        "title": "Palletizing Robot Integration & Commissioning Guide",
        "type": "Manual",
        "format": "PDF",
        "size": "2.1 MB",
        "refCode": "MAN-ROB-PAL-3100",
        "verified": true
      }
    ]
  },
  "robot-controllers": {
    "id": "robot-controllers",
    "categorySlug": "control-systems",
    "modelIdentifier": "IND-CTL-RBC-X86-RT",
    "componentType": "Real-Time Multi-Joint Kinematic Robot Controller Cabinet",
    "datasheet": {
      "documentNumber": "DS-CTL-RBC-2026-REV4",
      "revision": "Rev 4.2",
      "releaseDate": "2026-03-05",
      "verificationLevel": "Verified Specification",
      "traceableSource": "INDUS Embedded Systems Hardware Lab Validation #14"
    },
    "functionalOverview": "The IND-CTL-RBC-X86 is a high-performance central robot controller cabinet executing real-time kinematic transformation algorithms, trajectory generation, and safety interlocks for 4-axis, 6-axis, and parallel Delta robots. Powered by an industrial quad-core Intel x86 processor running a hard real-time Linux RTOS kernel, it coordinates multi-joint interpolation over an ultra-low-jitter EtherCAT fieldbus while providing an intuitive 10.1\" IP65 teach pendant interface.",
    "parameters": [
      {
        "name": "Coordinated Axis Capacity",
        "value": "Up to 16 Axes",
        "unit": "axes",
        "tolerance": "Interpolated",
        "conditions": "6 robot axes + 2 positioner axes + auxiliary conveyor tracks",
        "status": "verified"
      },
      {
        "name": "Trajectory Interpolation Cycle Rate",
        "value": "1.0",
        "unit": "ms",
        "tolerance": "Deterministic",
        "conditions": "Configurable 500 \u00b5s to 2 ms",
        "status": "verified"
      },
      {
        "name": "EtherCAT Master Sync Jitter",
        "value": "< 1.0",
        "unit": "\u00b5s",
        "tolerance": "Max",
        "conditions": "With distributed clocks (DC) enabled",
        "status": "verified"
      },
      {
        "name": "Processor Architecture",
        "value": "Intel Core i5 Quad-Core Industrial Embedded CPU",
        "unit": "hardware",
        "tolerance": "Fanless",
        "conditions": "Base clock 2.4 GHz, 16GB DDR4 ECC RAM",
        "status": "verified"
      },
      {
        "name": "Teach Pendant Display",
        "value": "10.1-inch Color Touchscreen",
        "unit": "display",
        "tolerance": "IP65",
        "conditions": "Ergonomic 3-position deadman switch & emergency stop button",
        "status": "verified"
      },
      {
        "name": "Functional Safety Certification",
        "value": "SIL 3 / Cat 4 PLe",
        "unit": "ISO 13849-1",
        "conditions": "T\u00dcV Rheinland certified dual-channel safety board",
        "status": "verified"
      },
      {
        "name": "Cabinet Supply Voltage",
        "value": "3-Phase 380 - 480 VAC, 50/60 Hz",
        "unit": "voltage",
        "tolerance": "\u00b110%",
        "conditions": "Internal 24VDC 20A auxiliary bus supply",
        "status": "verified"
      },
      {
        "name": "Cabinet Protection Rating",
        "value": "IP54 Standard (IP65 air-conditioned option)",
        "unit": "rating",
        "tolerance": "Rittal",
        "conditions": "Powder-coated steel enclosure with filtered fans",
        "status": "verified"
      }
    ],
    "categorySpecificSpecs": {
      "Kinematic Libraries": "Pre-configured for 6-Axis Articulated, SCARA, Delta, Cartesian Gantry, and Dual-Arm Coordination",
      "Programming Languages": "INDUS MotionScript, IEC 61131-3 (ST, LD, FBD), C++ SDK, Python API, and ROS 2 Driver",
      "Integrated Functional Safety": "Dual-channel STO, Safe Stop 1 (SS1), Safe Stop 2 (SS2), Safely-Limited Speed (SLS)",
      "Industrial Fieldbuses": "EtherCAT Master, PROFINET IO Device, EtherNet/IP Adapter, Modbus TCP Server"
    },
    "useCases": [
      "Central kinematic control for 6-axis industrial and collaborative robot arms",
      "High-speed vision-guided Delta and SCARA packaging workcells",
      "Coordinated multi-robot manufacturing lines with external transfer positioners",
      "Digital twin edge integration streaming joint telemetry to plant MES/SCADA"
    ],
    "unsuitableApplications": [
      "Direct outdoor installation exposed to rain without secondary shelter",
      "Corrosive acid washdown environments without stainless NEMA 4X cabinet"
    ],
    "mechanicalMounting": {
      "flangeStandard": "Standard Rittal Floor/Wall Enclosure",
      "boltPattern": "4x M10 mounting brackets on rear or floor plinth",
      "alignmentPin": "Standard industrial cabinet dimensions 600W x 700H x 400D mm",
      "maxOverhungLoad": "Cabinet Weight: 42 kg (empty) / 78 kg (fully configured with servo drives)",
      "recommendedFasteners": "Grade 8.8 M10 Bolts, torque 45 Nm",
      "orientationNotes": "Vertical upright mounting with minimum 150mm clearance for ventilation"
    },
    "electricalRequirements": {
      "supplyVoltage": "380 - 480 VAC 3-Phase + Neutral + PE, 50/60 Hz",
      "ratedCurrent": "16 A full load current",
      "peakCurrent": "40 A peak mains current",
      "motorType": "Drives AC synchronous servomotors via EtherCAT digital drives",
      "driveRequirement": "Integrated internal drive rack or external modular servo drives",
      "feedbackInterface": "Digital bus feedback via EtherCAT CiA 402 drives"
    },
    "controlAndCommunication": {
      "fieldbuses": [
        "EtherCAT (Master)",
        "PROFINET",
        "EtherNet/IP",
        "OPC UA Server",
        "MQTT Bridge"
      ],
      "controlModes": [
        "Kinematic Path Generation, S-Curve Velocity Profile, Collision Detection, Conveyor Tracking"
      ],
      "cycleTime": "1 ms deterministic control cycle",
      "ioChannels": "32x Isolated 24VDC Inputs, 32x 24VDC Outputs (expandable via EtherCAT bus slices)",
      "syncJitter": "< 1 \u00b5s"
    },
    "environmentalAndSafety": {
      "operatingTemp": "0\u00b0C to +45\u00b0C ambient",
      "storageTemp": "-25\u00b0C to +70\u00b0C",
      "humidity": "10% to 90% non-condensing",
      "ipRating": "IP54 standard enclosure",
      "safetyCertifications": [
        "T\u00dcV Certified ISO 13849-1 PLe Cat 4",
        "IEC 62061 SIL 3",
        "CE Machinery Directive"
      ],
      "applicableDirectives": [
        "EN 60204-1 Electrical Equipment of Machines",
        "EN 61000-6-2 / 6-4 EMC Directives"
      ],
      "unsuitableApplications": [
        "ATEX Zone 0 / 1 hazardous explosive locations"
      ]
    },
    "selectionConsiderations": {
      "primaryCriteria": [
        "Total axis count: 6 robot joints plus any external linear tracks or rotary positioner tables",
        "Fieldbus integration with plant PLC: PROFINET for Siemens, EtherNet/IP for Rockwell",
        "Safety architecture: ensure safety board matches emergency stop and safety light curtain wiring"
      ],
      "inertiaRatioLimit": "Controller firmware includes real-time load identification and inertia compensation algorithms.",
      "thermalDeratingNotes": "Ambient temperatures sustained above 40\u00b0C require internal cabinet cooling unit.",
      "recommendedSafetyFactor": "SF \u2265 1.3 on cabinet power supply sizing.",
      "sizingFormulasHint": "Total cabinet power P_total = sum(P_drive_i) + P_aux. Ensure main breaker is rated for 1.25 * P_total."
    },
    "integrationDependencies": [
      "3-Phase 400VAC mains supply with disconnect switch",
      "EtherCAT servo drives",
      "Safety gate interlock circuits"
    ],
    "relatedProductIds": [
      "motion-controllers",
      "servo-drives",
      "6-axis",
      "assembly"
    ],
    "downloadableDocs": [
      {
        "title": "Robot Controller (CTL-RBC-X86) Technical Datasheet",
        "type": "Datasheet",
        "format": "PDF",
        "size": "3.2 MB",
        "refCode": "DS-CTL-RBC-X86",
        "verified": true
      },
      {
        "title": "Robot Controller 3D CAD Assembly Model",
        "type": "CAD 3D STEP",
        "format": "STEP",
        "size": "22.5 MB",
        "refCode": "CAD-CTL-RBC-X86",
        "verified": true
      },
      {
        "title": "Robot Controller Integration & Commissioning Guide",
        "type": "Manual",
        "format": "PDF",
        "size": "2.1 MB",
        "refCode": "MAN-CTL-RBC-X86",
        "verified": true
      }
    ]
  },
  "motion-controllers": {
    "id": "motion-controllers",
    "categorySlug": "control-systems",
    "modelIdentifier": "IND-CTL-MTC-064-EC",
    "componentType": "Deterministic 64-Axis EtherCAT Motion Controller",
    "datasheet": {
      "documentNumber": "DS-CTL-MTC-2026-REV3",
      "revision": "Rev 3.1",
      "releaseDate": "2026-02-15",
      "verificationLevel": "Verified Specification",
      "traceableSource": "INDUS Deterministic Communications Metrology Lab Rig #1"
    },
    "functionalOverview": "The IND-CTL-MTC-064 is an ultra-fast, multi-axis deterministic motion controller capable of synchronizing up to 64 physical servo axes over dual EtherCAT master rings with sub-microsecond clock jitter (< 1 \u00b5s). Featuring hardware electronic camming, 3D CNC G-code interpolation, and high-speed position-based registration latching, it serves as the central brain for automated packaging, printing, and multi-axis assembly lines.",
    "parameters": [
      {
        "name": "Synchronized Axes Capacity",
        "value": "Up to 64 Physical Axes",
        "unit": "axes",
        "tolerance": "Full interpolation",
        "conditions": "Coordinated over EtherCAT fieldbus",
        "status": "verified"
      },
      {
        "name": "EtherCAT Bus Cycle Time",
        "value": "250",
        "unit": "\u00b5s",
        "tolerance": "Minimum",
        "conditions": "For up to 16 axes (500 \u00b5s for 32 axes, 1 ms for 64 axes)",
        "status": "verified"
      },
      {
        "name": "Distributed Clock Synchronization Jitter",
        "value": "< 100",
        "unit": "ns",
        "tolerance": "Measured",
        "conditions": "Hardware IEEE 1588 / EtherCAT DC sync",
        "status": "verified"
      },
      {
        "name": "Hardware Registration Probe Inputs",
        "value": "8x Fast Probe Inputs",
        "unit": "channels",
        "tolerance": "Hardware latch",
        "conditions": "Latch response time < 1.0 \u00b5s",
        "status": "verified"
      },
      {
        "name": "Electronic Camming Profiles",
        "value": "Up to 256 Dynamic Cam Tables",
        "unit": "profiles",
        "tolerance": "Spline 5th order",
        "conditions": "On-the-fly cam switching without stopping",
        "status": "verified"
      },
      {
        "name": "CNC Kinematics Support",
        "value": "RS-274D G-Code Interpreter",
        "unit": "kinematics",
        "tolerance": "3D + 2 auxiliary",
        "conditions": "Tangential knife, cutter radius compensation",
        "status": "verified"
      },
      {
        "name": "Processor",
        "value": "ARM Cortex-A53 Quad-Core 1.6 GHz + Real-Time FPGA Coprocessor",
        "unit": "hardware",
        "tolerance": "Fanless",
        "conditions": "Rugged DIN-rail mounted aluminum chassis",
        "status": "verified"
      },
      {
        "name": "Power Supply Input",
        "value": "24 VDC (18 - 32 VDC)",
        "unit": "voltage",
        "tolerance": "\u00b115%",
        "conditions": "Power consumption: 25W nominal",
        "status": "verified"
      }
    ],
    "categorySpecificSpecs": {
      "Dual Fieldbus Ports": "2x Independent Gigabit Ethernet Ports + 2x EtherCAT Master Ports (Cable Redundancy)",
      "Edge Telemetry Protocols": "OPC UA Server (IEC 62541), MQTT Publisher, RESTful API, WebSockets",
      "Programming Standard": "IEC 61131-3 (Structured Text, Ladder, SFC) + C/C++ Real-Time Motion Library",
      "Form Factor": "Compact DIN-Rail Mount Industrial Enclosure (145W x 100H x 85D mm)"
    },
    "useCases": [
      "High-speed form-fill-seal (FFS) packaging machines with electronic camming",
      "Continuous multi-color printing, laminating, and rotary die-cutting lines",
      "Multi-axis Cartesian gantry systems with dynamic conveyor synchronization",
      "Semiconductor die-bonding and wafer dicing precision motion stages"
    ],
    "unsuitableApplications": [
      "Direct outdoor unheated enclosures subject to sub-zero condensation",
      "Direct motor power switching (controller generates commands, requires servo drives)"
    ],
    "mechanicalMounting": {
      "flangeStandard": "Standard 35mm DIN Rail Mount (EN 50022)",
      "boltPattern": "Rear integrated snap-on DIN rail clip + optional 2-hole screw mounting",
      "alignmentPin": "Compact industrial form factor 145 x 100 x 85 mm",
      "maxOverhungLoad": "Unit weight: 1.25 kg",
      "recommendedFasteners": "Standard 35mm heavy-duty steel DIN rail",
      "orientationNotes": "Vertical DIN rail orientation to promote natural convective cooling"
    },
    "electricalRequirements": {
      "supplyVoltage": "24 VDC nominal (18 to 32 VDC range)",
      "ratedCurrent": "1.1 A at 24 VDC",
      "peakCurrent": "2.5 A inrush current during boot",
      "motorType": "N/A - Commands external servo drives via EtherCAT",
      "driveRequirement": "EtherCAT CoE (CiA 402) compliant digital servo amplifiers",
      "feedbackInterface": "Receives encoder actual values over EtherCAT PDO frames"
    },
    "controlAndCommunication": {
      "fieldbuses": [
        "EtherCAT Master (Ring Redundancy Capable)",
        "PROFINET Device",
        "EtherNet/IP",
        "Modbus TCP",
        "OPC UA"
      ],
      "controlModes": [
        "Cyclic Synchronous Position (CSP), Cyclic Synchronous Velocity (CSV), Torque Limit (CST), E-Cam, E-Gear"
      ],
      "cycleTime": "250 \u00b5s to 1 ms deterministic cycle",
      "ioChannels": "8x Fast 24VDC Inputs (< 1 \u00b5s), 8x 24VDC Outputs, MicroSD card slot for program backup",
      "syncJitter": "< 100 ns"
    },
    "environmentalAndSafety": {
      "operatingTemp": "-10\u00b0C to +55\u00b0C",
      "storageTemp": "-25\u00b0C to +75\u00b0C",
      "humidity": "5% to 95% non-condensing",
      "ipRating": "IP20 (Designed for installation inside electrical control cabinets)",
      "safetyCertifications": [
        "CE EMC Directive 2014/30/EU",
        "UL 61010-2-201 Listed Industrial Control Equipment"
      ],
      "applicableDirectives": [
        "EN 61000-6-2 Immunity",
        "EN 61000-6-4 Emissions"
      ],
      "unsuitableApplications": [
        "Environments with conductive carbon dust without sealed NEMA cabinet"
      ]
    },
    "selectionConsiderations": {
      "primaryCriteria": [
        "Total axis count and required fieldbus loop rate (250 \u00b5s for \u2264 16 axes, 1 ms for \u2264 64 axes)",
        "Electronic cam complexity: verify number of interpolation points per master cycle",
        "Plant-level communication requirement: OPC UA and MQTT for Industry 4.0 data streaming"
      ],
      "inertiaRatioLimit": "Motion controller implements feedforward acceleration and jerk filtering (S-curve) to tame high inertia loads.",
      "thermalDeratingNotes": "Leave 20mm clearance between DIN rail units to allow chimney-effect convective airflow.",
      "recommendedSafetyFactor": "SF \u2265 1.2 on 24VDC power supply sizing.",
      "sizingFormulasHint": "Network bandwidth check: Packet_size * 8 / (100 Mbps) <= 0.3 * Cycle_time to prevent packet collisions."
    },
    "integrationDependencies": [
      "Regulated 24VDC 5A industrial power supply",
      "EtherCAT servo drives with Cat 5e shielded cables",
      "Safety PLC for hard safety stop lines"
    ],
    "relatedProductIds": [
      "robot-controllers",
      "servo-drives",
      "linear",
      "rotary"
    ],
    "downloadableDocs": [
      {
        "title": "Motion Controller (CTL-MTC-064) Technical Datasheet",
        "type": "Datasheet",
        "format": "PDF",
        "size": "3.2 MB",
        "refCode": "DS-CTL-MTC-064",
        "verified": true
      },
      {
        "title": "Motion Controller 3D CAD Assembly Model",
        "type": "CAD 3D STEP",
        "format": "STEP",
        "size": "22.5 MB",
        "refCode": "CAD-CTL-MTC-064",
        "verified": true
      },
      {
        "title": "Motion Controller Integration & Commissioning Guide",
        "type": "Manual",
        "format": "PDF",
        "size": "2.1 MB",
        "refCode": "MAN-CTL-MTC-064",
        "verified": true
      }
    ]
  },
  "servo-drives": {
    "id": "servo-drives",
    "categorySlug": "control-systems",
    "modelIdentifier": "IND-CTL-SRV-048-GN",
    "componentType": "Compact High-Bandwidth Digital Servo Drive",
    "datasheet": {
      "documentNumber": "DS-CTL-SRV-2026-REV5",
      "revision": "Rev 5.0",
      "releaseDate": "2026-03-01",
      "verificationLevel": "Verified Specification",
      "traceableSource": "INDUS Power Electronics Lab Qualification Rig #7"
    },
    "functionalOverview": "The IND-CTL-SRV-048 is an ultra-compact, high-power-density digital servo drive utilizing modern Gallium Nitride (GaN) switching power stages. Engineered for high-dynamic robotics, AGV in-wheel motors, and precision linear axes, it executes 32 kHz field-oriented current loops with sub-microsecond response, dual-loop absolute encoder feedback, and hardware-certified Safe Torque Off (STO SIL 3 / PLe).",
    "parameters": [
      {
        "name": "Input DC Bus Voltage",
        "value": "12 - 60",
        "unit": "VDC",
        "tolerance": "Nominal 48 VDC",
        "conditions": "Battery or regulated power supply",
        "status": "verified"
      },
      {
        "name": "Continuous Output Current",
        "value": "15.0",
        "unit": "A RMS",
        "tolerance": "Continuous",
        "conditions": "At 48 VDC, ambient 40\u00b0C, cold plate mounted",
        "status": "verified"
      },
      {
        "name": "Peak Acceleration Current",
        "value": "45.0",
        "unit": "A RMS",
        "tolerance": "Peak",
        "conditions": "Duration \u2264 2.5s",
        "status": "verified"
      },
      {
        "name": "Current Loop Bandwidth",
        "value": "4.5",
        "unit": "kHz",
        "tolerance": "\u00b15%",
        "conditions": "At 32 kHz PWM switching frequency",
        "status": "verified"
      },
      {
        "name": "Velocity Loop Update Rate",
        "value": "16",
        "unit": "kHz",
        "tolerance": "Deterministic",
        "conditions": "FOC velocity loop",
        "status": "verified"
      },
      {
        "name": "Position Loop Update Rate",
        "value": "8",
        "unit": "kHz",
        "tolerance": "Deterministic",
        "conditions": "Closed-loop position tracking",
        "status": "verified"
      },
      {
        "name": "Supported Feedback Types",
        "value": "BiSS-C, EnDat 2.2, SSI, Resolver, A/B/Z Incremental",
        "unit": "protocols",
        "tolerance": "Configurable",
        "conditions": "Dual encoder ports for load-side backlash compensation",
        "status": "verified"
      },
      {
        "name": "Functional Safety Integrity",
        "value": "SIL 3 / Cat 4 PLe",
        "unit": "ISO 13849-1",
        "conditions": "Hardware dual-channel Safe Torque Off (STO)",
        "status": "verified"
      },
      {
        "name": "Dimensions & Weight",
        "value": "75 x 50 x 28 mm / 165 g",
        "unit": "size",
        "tolerance": "Ultra-compact",
        "conditions": "Book-size micro package",
        "status": "verified"
      }
    ],
    "categorySpecificSpecs": {
      "Power Stage Technology": "Wide-Bandgap Gallium Nitride (GaN) FETs with 98.5% efficiency",
      "Control Algorithms": "Field-Oriented Control (FOC), Space Vector Modulation (SVPWM), Active Vibration Rejection",
      "Safety Architecture": "Hardware STO certified by T\u00dcV Rheinland (IEC 61800-5-2)",
      "Thermal Mounting": "Integrated cold plate base ready for heat-sink or machine chassis heat spreading"
    },
    "useCases": [
      "Collaborative robot arms and multi-joint articulation joints",
      "Warehouse AMR traction and steering servo wheel control",
      "High-speed Cartesian gantry pick-and-place linear axes",
      "Medical surgical robotics and exoskeleton powered joints"
    ],
    "unsuitableApplications": [
      "Direct 400V 3-phase AC mains input without transformer (max DC bus is 60 VDC)",
      "Direct water submersion without IP67 external enclosure"
    ],
    "mechanicalMounting": {
      "flangeStandard": "Flat Baseplate Mount (Cold Plate Heat Sink Interface)",
      "boltPattern": "4x M3 screw mounting holes on 68x42mm rectangle",
      "alignmentPin": "Ultra-compact footprint 75 x 50 x 28 mm",
      "maxOverhungLoad": "Drive Weight: 165 grams",
      "recommendedFasteners": "M3 Socket Screws with thermal interface pad (0.5mm)",
      "orientationNotes": "Mount on flat aluminum heat sink plate (min 200 cm\u00b2 surface area)"
    },
    "electricalRequirements": {
      "supplyVoltage": "12 VDC to 60 VDC main bus + optional 24 VDC auxiliary logic supply",
      "ratedCurrent": "15 A RMS continuous phase current",
      "peakCurrent": "45 A RMS peak phase current",
      "motorType": "Brushless DC (BLDC), Permanent Magnet AC Synchronous (PMSM), Stepper in closed loop",
      "driveRequirement": "N/A - This is the drive amplifier",
      "feedbackInterface": "Primary motor encoder + secondary load encoder on output shaft"
    },
    "controlAndCommunication": {
      "fieldbuses": [
        "EtherCAT CoE (CiA 402)",
        "CANopen (CiA 402)",
        "RS-485 / Modbus RTU"
      ],
      "controlModes": [
        "Cyclic Synchronous Position (CSP), Velocity (CSV), Torque (CST), Profile Position"
      ],
      "cycleTime": "250 \u00b5s to 1 ms fieldbus cycle",
      "ioChannels": "2x Safe Torque Off (STO) inputs, 4x Configurable 24V/5V Digital Inputs, 2x Digital Outputs",
      "syncJitter": "< 500 ns"
    },
    "environmentalAndSafety": {
      "operatingTemp": "-20\u00b0C to +60\u00b0C baseplate temperature",
      "storageTemp": "-40\u00b0C to +85\u00b0C",
      "humidity": "5% to 90% non-condensing",
      "ipRating": "IP20 (Intended for cabinet or embedded joint link installation)",
      "safetyCertifications": [
        "T\u00dcV Rheinland STO SIL 3 / PLe",
        "CE EMC Directive 2014/30/EU"
      ],
      "applicableDirectives": [
        "EN 61800-5-1 Electrical Safety",
        "EN 61800-5-2 Functional Safety"
      ],
      "unsuitableApplications": [
        "Explosive gas environments without flameproof housing"
      ]
    },
    "selectionConsiderations": {
      "primaryCriteria": [
        "Motor rated and peak phase current: ensure drive 15A continuous / 45A peak matches motor windings",
        "Bus voltage: ensure 48VDC supply can deliver peak current without voltage sag below 12V",
        "Thermal management: cold plate must be fastened to heat sink or robot link casting with thermal grease"
      ],
      "inertiaRatioLimit": "High bandwidth 4.5 kHz current loop allows tight tuning even with high load inertia up to 20:1.",
      "thermalDeratingNotes": "Free-air mounting without heat sink derates continuous current to 8A RMS.",
      "recommendedSafetyFactor": "SF \u2265 1.3 on continuous current rating.",
      "sizingFormulasHint": "Motor Power P_mech = T_shaft * omega. Electrical DC Bus Current I_dc = (P_mech / eta) / V_bus."
    },
    "integrationDependencies": [
      "Regulated 48VDC power supply or battery",
      "Motor with compatible BiSS-C / incremental encoder",
      "External shunt brake resistor for regenerative deceleration"
    ],
    "relatedProductIds": [
      "motion-controllers",
      "servo",
      "drive",
      "linear"
    ],
    "downloadableDocs": [
      {
        "title": "Digital Servo Drive (CTL-SRV-048) Technical Datasheet",
        "type": "Datasheet",
        "format": "PDF",
        "size": "3.2 MB",
        "refCode": "DS-CTL-SRV-048",
        "verified": true
      },
      {
        "title": "Digital Servo Drive 3D CAD Assembly Model",
        "type": "CAD 3D STEP",
        "format": "STEP",
        "size": "22.5 MB",
        "refCode": "CAD-CTL-SRV-048",
        "verified": true
      },
      {
        "title": "Digital Servo Drive Integration & Commissioning Guide",
        "type": "Manual",
        "format": "PDF",
        "size": "2.1 MB",
        "refCode": "MAN-CTL-SRV-048",
        "verified": true
      }
    ]
  },
  "plc-automation": {
    "id": "plc-automation",
    "categorySlug": "control-systems",
    "modelIdentifier": "IND-CTL-PLC-61131",
    "componentType": "Modular IEC 61131-3 Industrial Automation Controller",
    "datasheet": {
      "documentNumber": "DS-CTL-PLC-2026-REV3",
      "revision": "Rev 3.0",
      "releaseDate": "2026-02-10",
      "verificationLevel": "Verified Specification",
      "traceableSource": "INDUS Industrial Automation Test Bed #2"
    },
    "functionalOverview": "The IND-CTL-PLC-61131 is a modular, high-reliability programmable logic controller engineered for cell-level sequencing, safety interlock management, and plant-wide industrial communication. Compliant with IEC 61131-3 programming standards, it coordinates digital and analog slice I/O, safety light curtains, pneumatic valves, and fieldbus bridges to plant SCADA/MES architectures.",
    "parameters": [
      {
        "name": "Program Cycle Time",
        "value": "1.0",
        "unit": "ms",
        "tolerance": "Deterministic",
        "conditions": "For 10,000 instructions",
        "status": "verified"
      },
      {
        "name": "Local Slice I/O Capacity",
        "value": "Up to 64 Expansion Slices",
        "unit": "modules",
        "tolerance": "Hot-swappable",
        "conditions": "Direct backplane bus connection",
        "status": "verified"
      },
      {
        "name": "Maximum Digital I/O Points",
        "value": "1024 Points",
        "unit": "channels",
        "tolerance": "Total",
        "conditions": "Across local and distributed fieldbus nodes",
        "status": "verified"
      },
      {
        "name": "Supported Fieldbuses",
        "value": "PROFINET IRT, EtherNet/IP, EtherCAT, Modbus TCP",
        "unit": "protocols",
        "tolerance": "Simultaneous",
        "conditions": "Multi-protocol dual RJ45 switch ports",
        "status": "verified"
      },
      {
        "name": "Safety PLC Option",
        "value": "SIL 3 / Cat 4 PLe",
        "unit": "IEC 61508",
        "conditions": "Failsafe CPU variant with PROFIsafe / FSoE",
        "status": "verified"
      },
      {
        "name": "Operating Supply Voltage",
        "value": "24 VDC (19.2 - 28.8 VDC)",
        "unit": "voltage",
        "tolerance": "\u00b120%",
        "conditions": "Industrial DC supply",
        "status": "verified"
      },
      {
        "name": "Memory Capacity",
        "value": "32 MB Program / 64 MB Data",
        "unit": "memory",
        "tolerance": "Non-volatile",
        "conditions": "Flash retentive storage without battery",
        "status": "verified"
      },
      {
        "name": "Operating Temperature Range",
        "value": "-20\u00b0C to +60\u00b0C",
        "unit": "temp",
        "tolerance": "Extended",
        "conditions": "Standard DIN rail mounting",
        "status": "verified"
      }
    ],
    "categorySpecificSpecs": {
      "IEC 61131-3 Languages": "Structured Text (ST), Ladder Diagram (LD), Function Block Diagram (FBD), Sequential Function Chart (SFC)",
      "Edge Connectivity": "Built-in OPC UA Server, Web-Based HTML5 Visualization Server, MQTT Cloud Connector",
      "Hardware Isolation": "Optically isolated 2.5 kV digital I/O channels with short-circuit protection",
      "Form Factor": "Modular 35mm DIN-rail mountable slice architecture"
    },
    "useCases": [
      "Turnkey robotic workcell sequencing, door safety interlocks, and cell mode selection",
      "Automated conveyor line sorting, pneumatic actuation, and part presence tracking",
      "Plant-level edge bridge converting machine fieldbus data to enterprise MES/SCADA",
      "Packaging line batch recipe management and traceability data logging"
    ],
    "unsuitableApplications": [
      "High-speed multi-axis kinematic interpolation < 500 \u00b5s (recommend Motion Controller)",
      "Direct high-voltage AC power switching (requires external interposing relays)"
    ],
    "mechanicalMounting": {
      "flangeStandard": "Standard 35mm DIN Rail (EN 60715)",
      "boltPattern": "Rear spring-loaded DIN rail latch mechanism",
      "alignmentPin": "Inter-module gold-plated blade backplane connectors",
      "maxOverhungLoad": "CPU Slice Weight: 280 grams",
      "recommendedFasteners": "Standard 35mm industrial steel DIN rail with end stops",
      "orientationNotes": "Horizontal DIN rail mounting standard; vertical mounting derates ambient temp by 5\u00b0C"
    },
    "electricalRequirements": {
      "supplyVoltage": "24 VDC nominal (19.2 to 28.8 VDC range)",
      "ratedCurrent": "0.75 A CPU consumption (plus I/O slice load)",
      "peakCurrent": "2.0 A inrush current",
      "motorType": "N/A - Commands external motor starters, VFDs, and servo drives",
      "driveRequirement": "N/A",
      "feedbackInterface": "Digital encoder counter slices and analog input modules"
    },
    "controlAndCommunication": {
      "fieldbuses": [
        "PROFINET IO Controller/Device",
        "EtherNet/IP Scanner/Adapter",
        "EtherCAT Master/Slave",
        "Modbus TCP",
        "OPC UA"
      ],
      "controlModes": [
        "Deterministic Sequential Logic, PID Temperature/Pressure Loops, Recipe Handling"
      ],
      "cycleTime": "1 ms to 10 ms user-configurable task periods",
      "ioChannels": "Expandable from 16 to 1024 channels via modular slice bus",
      "syncJitter": "< 10 \u00b5s"
    },
    "environmentalAndSafety": {
      "operatingTemp": "-20\u00b0C to +60\u00b0C",
      "storageTemp": "-40\u00b0C to +85\u00b0C",
      "humidity": "5% to 95% non-condensing",
      "ipRating": "IP20 protection rating (inside enclosure)",
      "safetyCertifications": [
        "CE Machinery Directive",
        "UL 508 Listed Industrial Control Equipment",
        "T\u00dcV SIL 3 (Safety Variant)"
      ],
      "applicableDirectives": [
        "EN 61131-2 Equipment Requirements and Tests",
        "EN 61000-6-2 / 6-4"
      ],
      "unsuitableApplications": [
        "Outdoor unprotected environments"
      ]
    },
    "selectionConsiderations": {
      "primaryCriteria": [
        "Digital and analog I/O point count for actuators, pneumatic valves, sensors, and lamps",
        "Plant communication protocol: PROFINET for European plants, EtherNet/IP for US plants",
        "Failsafe requirements: select Failsafe Safety CPU if coordinating machine safety fences"
      ],
      "inertiaRatioLimit": "N/A - Logic controller",
      "thermalDeratingNotes": "Maintain 25mm clearance above and below DIN rail for natural convective cooling.",
      "recommendedSafetyFactor": "SF \u2265 1.25 on 24VDC power supply sizing.",
      "sizingFormulasHint": "Total 24V I/O current: I_total = I_cpu + sum(I_output_load_i) + sum(I_sensor_i)."
    },
    "integrationDependencies": [
      "Regulated 24VDC power supply (Class 2 / SELV)",
      "DIN-rail electrical enclosure",
      "Fieldbus network switch"
    ],
    "relatedProductIds": [
      "robot-controllers",
      "motion-controllers",
      "electric",
      "sensors-feedback"
    ],
    "downloadableDocs": [
      {
        "title": "PLC Automation Controller (CTL-PLC-61131) Technical Datasheet",
        "type": "Datasheet",
        "format": "PDF",
        "size": "3.2 MB",
        "refCode": "DS-CTL-PLC-61131",
        "verified": true
      },
      {
        "title": "PLC Automation Controller 3D CAD Assembly Model",
        "type": "CAD 3D STEP",
        "format": "STEP",
        "size": "22.5 MB",
        "refCode": "CAD-CTL-PLC-61131",
        "verified": true
      },
      {
        "title": "PLC Automation Controller Integration & Commissioning Guide",
        "type": "Manual",
        "format": "PDF",
        "size": "2.1 MB",
        "refCode": "MAN-CTL-PLC-61131",
        "verified": true
      }
    ]
  },
  "sensors-feedback": {
    "id": "sensors-feedback",
    "categorySlug": "control-systems",
    "modelIdentifier": "IND-SNS-ENC-026-BC",
    "componentType": "High-Resolution Absolute Optical Feedback Encoder & 6-Axis F/T Sensor",
    "datasheet": {
      "documentNumber": "DS-SNS-ENC-2026-REV4",
      "revision": "Rev 4.0",
      "releaseDate": "2026-03-02",
      "verificationLevel": "Verified Specification",
      "traceableSource": "INDUS Sensor Metrology & Calibration Bay #1"
    },
    "functionalOverview": "The IND-SNS-ENC-026 series delivers high-precision absolute position and force-torque feedback for robotic joints and precision motion stages. Featuring a 26-bit single-turn resolution optical disc paired with a mechanical gear-train multi-turn counter (battery-free retention up to 65,536 revolutions), it communicates position data over a 10 MHz BiSS-C or EnDat 2.2 serial interface with exceptional noise immunity.",
    "parameters": [
      {
        "name": "Single-Turn Resolution",
        "value": "26-bit (67,108,864 counts/rev)",
        "unit": "resolution",
        "tolerance": "Exact",
        "conditions": "Precision optical disc track",
        "status": "verified"
      },
      {
        "name": "Multi-Turn Revolution Range",
        "value": "16-bit (65,536 Revolutions)",
        "unit": "revolutions",
        "tolerance": "Battery-free",
        "conditions": "Mechanical micro-gear train counter",
        "status": "verified"
      },
      {
        "name": "System Accuracy",
        "value": "\u00b112",
        "unit": "arcsec",
        "tolerance": "ISO class",
        "conditions": "Calibrated over full 360\u00b0 rotation",
        "status": "verified"
      },
      {
        "name": "Maximum Mechanical Speed",
        "value": "12000",
        "unit": "rpm",
        "tolerance": "Max",
        "conditions": "Continuous mechanical rotation",
        "status": "verified"
      },
      {
        "name": "Serial Clock Frequency",
        "value": "Up to 10.0",
        "unit": "MHz",
        "tolerance": "BiSS-C / EnDat",
        "conditions": "Fast serial communication rate",
        "status": "verified"
      },
      {
        "name": "Hollow Shaft Bore Options",
        "value": "\u00d815mm / \u00d825mm / \u00d840mm",
        "unit": "diameter",
        "tolerance": "+0.02 / 0 mm",
        "conditions": "Through-bore for robotic arm cabling",
        "status": "verified"
      },
      {
        "name": "Operating Supply Voltage",
        "value": "5 VDC \u00b1 10% (Optional 24 VDC)",
        "unit": "voltage",
        "tolerance": "Regulated",
        "conditions": "Current draw < 120 mA",
        "status": "verified"
      },
      {
        "name": "Shock & Vibration Rating",
        "value": "100 G Shock / 20 G Vibration",
        "unit": "rating",
        "tolerance": "IEC 60068",
        "conditions": "Ruggedized optoelectronic assembly",
        "status": "verified"
      }
    ],
    "categorySpecificSpecs": {
      "Sensing Technology": "Transmission Optical Disc Track with Differential Photodiode Array",
      "Serial Communication Protocol": "BiSS-C Point-to-Point (Pure Serial) / EnDat 2.2 / SSI Selectable",
      "Multi-Turn Retention": "Battery-less true mechanical micro-gear counter (no battery replacement needed)",
      "Enclosure Protection": "IP67 sealed bearing housing with double-lip oil seals"
    },
    "useCases": [
      "Robotic arm joint output shaft absolute position feedback",
      "Direct-drive rotary motor commutation and positioning",
      "Machine tool high-precision spindle orientation and indexing",
      "6-axis force-torque closed-loop grinding and polishing toolheads"
    ],
    "unsuitableApplications": [
      "Submerged fluid operation without specialized pressurized enclosure",
      "Severe radioactive gamma environments > 10^4 Rad without rad-hard shielding"
    ],
    "mechanicalMounting": {
      "flangeStandard": "Hollow Through-Bore with Flexible Stator Coupling Flange",
      "boltPattern": "4x M3 stator coupling screws on \u00d855mm pitch",
      "alignmentPin": "Precision clamping ring for motor rotor shaft",
      "maxOverhungLoad": "120 N radial bearing capacity",
      "recommendedFasteners": "Grade 8.8 M3 Screws with threadlocker",
      "orientationNotes": "Universal mounting; stator coupling absorbs thermal shaft expansion"
    },
    "electricalRequirements": {
      "supplyVoltage": "5 VDC \u00b1 10% (Standard) or 10-30 VDC (Wide range option)",
      "ratedCurrent": "95 mA at 5 VDC",
      "peakCurrent": "150 mA at startup",
      "motorType": "N/A - Mounts on motor or joint output shaft",
      "driveRequirement": "Compatible with standard servo drives supporting BiSS-C or EnDat",
      "feedbackInterface": "Point-to-point RS-422 differential serial line (Clock+, Clock-, Data+, Data-)"
    },
    "controlAndCommunication": {
      "fieldbuses": [
        "BiSS-C",
        "EnDat 2.2",
        "SSI",
        "RS-422 Serial"
      ],
      "controlModes": [
        "Cyclic Position Transmission with CRC-6 Polynomial Error Checking"
      ],
      "cycleTime": "< 20 \u00b5s read cycle at 10 MHz clock",
      "ioChannels": "Internal temperature sensor telemetry channel, error and warning bits",
      "syncJitter": "< 10 ns"
    },
    "environmentalAndSafety": {
      "operatingTemp": "-30\u00b0C to +100\u00b0C ambient",
      "storageTemp": "-40\u00b0C to +110\u00b0C",
      "humidity": "Up to 95% non-condensing",
      "ipRating": "IP67 sealed housing",
      "safetyCertifications": [
        "CE EMC Directive 2014/30/EU",
        "RoHS 3 Compliant"
      ],
      "applicableDirectives": [
        "IEC 61000-6-2 Industrial Noise Immunity"
      ],
      "unsuitableApplications": [
        "Strong magnetic fields > 50 mT without mumetal shield"
      ]
    },
    "selectionConsiderations": {
      "primaryCriteria": [
        "Shaft diameter: select through-bore diameter (\u00d815, \u00d825, \u00d840mm) matching motor or joint shaft",
        "Drive protocol compatibility: BiSS-C vs EnDat 2.2 matching servo amplifier feedback port",
        "System accuracy: 26-bit resolution provides 0.019 arcsec step size; system accuracy is \u00b112 arcsec"
      ],
      "inertiaRatioLimit": "Encoder rotor moment of inertia is negligible (< 10^-6 kg*m^2).",
      "thermalDeratingNotes": "Operate within -30\u00b0C to +100\u00b0C; internal thermistor reports real-time bearing temp.",
      "recommendedSafetyFactor": "SF \u2265 1.2 on supply voltage regulation.",
      "sizingFormulasHint": "Angle step size delta_theta = 360 / (2^26) = 0.00000536 degrees = 0.0193 arcseconds."
    },
    "integrationDependencies": [
      "Servo drive or controller with BiSS-C / EnDat feedback interface",
      "Twisted-pair shielded cable (min Cat 6)"
    ],
    "relatedProductIds": [
      "servo-drives",
      "rotary",
      "servo",
      "assembly"
    ],
    "downloadableDocs": [
      {
        "title": "Feedback Encoder (SNS-ENC-026) Technical Datasheet",
        "type": "Datasheet",
        "format": "PDF",
        "size": "3.2 MB",
        "refCode": "DS-SNS-ENC-026",
        "verified": true
      },
      {
        "title": "Feedback Encoder 3D CAD Assembly Model",
        "type": "CAD 3D STEP",
        "format": "STEP",
        "size": "22.5 MB",
        "refCode": "CAD-SNS-ENC-026",
        "verified": true
      },
      {
        "title": "Feedback Encoder Integration & Commissioning Guide",
        "type": "Manual",
        "format": "PDF",
        "size": "2.1 MB",
        "refCode": "MAN-SNS-ENC-026",
        "verified": true
      }
    ]
  },
  "intelligent-rotary-actuator": {
    "id": "intelligent-rotary-actuator",
    "categorySlug": "intelligent-actuators",
    "modelIdentifier": "IND-IRA-090-80",
    "modelCode": "IND-IRA-SERIES",
    "componentType": "Integrated Intelligent Mechatronic Rotary Joint Actuator",
    "datasheet": {
      "documentNumber": "DS-IND-IRA-2026-REV4",
      "revision": "Rev 4.0",
      "releaseDate": "2026-03-01",
      "verificationLevel": "Verified Specification",
      "traceableSource": "INDUS Mechatronics Dynamic Bench ISO 230-2 Calibrated"
    },
    "functionalOverview": "The INDUS Intelligent Rotary Actuator combines a high-flux permanent-magnet synchronous motor, a zero-backlash strain-wave gearhead, dual 19-bit absolute position encoders, and an integrated 48V DC field-oriented servo drive into a single hermetically sealed IP65 joint. Real-time telemetry provides motor current, thermal tracking, and error diagnostics directly over EtherCAT or CANopen.",
    "parameters": [
      {
        "name": "Rated Continuous Torque",
        "value": "35 – 280",
        "unit": "Nm",
        "tolerance": "±5%",
        "conditions": "At 25°C ambient, continuous S1 duty across models",
        "status": "verified"
      },
      {
        "name": "Peak Acceleration Torque",
        "value": "90 – 700",
        "unit": "Nm",
        "tolerance": "±5%",
        "conditions": "Duration ≤ 1.0 sec, duty factor ≤ 10%",
        "status": "verified"
      },
      {
        "name": "Rated Output Speed",
        "value": "25 – 45",
        "unit": "rpm",
        "tolerance": "Nominal",
        "conditions": "At 48V DC nominal bus supply voltage",
        "status": "verified"
      },
      {
        "name": "Maximum Commutation Speed",
        "value": "50 – 90",
        "unit": "rpm",
        "tolerance": "Max envelope",
        "conditions": "Intermittent duty at max inverter frequency",
        "status": "verified"
      },
      {
        "name": "Positioning Repeatability",
        "value": "±12",
        "unit": "arcsec",
        "tolerance": "±2 arcsec",
        "conditions": "ISO 230-2 bilateral test on optical encoder bench",
        "status": "verified"
      },
      {
        "name": "Mechanical Gear Backlash",
        "value": "< 1.0",
        "unit": "arcmin",
        "tolerance": "Max limit",
        "conditions": "At ±3% rated torque applied to output shaft",
        "status": "verified"
      },
      {
        "name": "Operating DC Bus Voltage",
        "value": "48",
        "unit": "V DC",
        "tolerance": "24 – 56 V DC",
        "conditions": "Continuous regulated DC supply",
        "status": "verified"
      },
      {
        "name": "Rated Continuous Current",
        "value": "6.5 – 26.0",
        "unit": "A rms",
        "tolerance": "Nominal",
        "conditions": "Sine-wave vector commutation at 20 kHz PWM",
        "status": "verified"
      },
      {
        "name": "Allowable Radial Load (Fr)",
        "value": "1800 – 8200",
        "unit": "N",
        "tolerance": "Envelope",
        "conditions": "Applied at flange midpoint, L10h ≥ 20,000h",
        "status": "verified"
      },
      {
        "name": "Ingress Protection Rating",
        "value": "IP65",
        "unit": "Rating",
        "tolerance": "IEC 60529",
        "conditions": "Sealed connector configuration",
        "status": "verified"
      }
    ],
    "categorySpecificSpecs": {
      "Motor Type": "Frameless Neodymium PM Synchronous Motor",
      "Gearhead Type": "Zero-Backlash Strain-Wave Reducer",
      "Encoder Configuration": "Dual 19-Bit Absolute (Input & Output Flange)",
      "Drive Integration": "Embedded 48V DSP Vector Drive (CiA 402)",
      "Communication": "EtherCAT CoE / CANopen DS402 / Modbus RTU"
    },
    "useCases": [
      "Collaborative Robot (Cobot) Joint Articulation J1–J6",
      "High-Speed Rotary Indexing Table for Automated Assembly",
      "Multi-Axis Precision Pan-Tilt-Roll Gimbal Platforms",
      "Automated Screwdriving & Component Insertion Heads"
    ],
    "unsuitableApplications": [
      "Direct exposure to continuous caustic chemical spray without auxiliary washdown boot",
      "Submerged underwater deployment (maximum rating is IP65 splash-proof)",
      "Continuous holding stall above continuous torque rating without auxiliary heat sinking",
      "Cantilever moment loads exceeding published allowable bearing fatigue limits"
    ],
    "mechanicalMounting": {
      "flangeStandard": "ISO 9409-1 Robot Tool Flange Compatible",
      "boltPattern": "PCD Ø50mm / Ø80mm tapped M6/M8 with centering spigot",
      "alignmentPin": "Precision H7 dowel hole for repeat joint zeroing",
      "maxOverhungLoad": "3200 N radial / 2600 N axial at 90mm pitch circle",
      "recommendedFasteners": "Class 10.9 or 12.9 high-tensile socket head cap screws",
      "orientationNotes": "Any mounting orientation (horizontal, vertical, inverted). Gravity holding brake optional."
    },
    "electricalRequirements": {
      "supplyVoltage": "48V DC nominal (allowable 24V – 56V DC)",
      "ratedCurrent": "11.0 A rms continuous",
      "peakCurrent": "28.0 A peak (1.0 sec limit)",
      "motorType": "3-Phase Permanent Magnet Synchronous Motor (PMSM)",
      "driveRequirement": "Integrated on-board field-oriented vector controller",
      "feedbackInterface": "Dual absolute 19-bit BiSS-C internal bus"
    },
    "controlAndCommunication": {
      "fieldbuses": ["EtherCAT (CoE / CiA 402)", "CANopen (DS402)", "Modbus RTU"],
      "controlModes": ["Cyclic Synchronous Position (CSP)", "Cyclic Synchronous Velocity (CSV)", "Cyclic Synchronous Torque (CST)", "Profile Position"],
      "cycleTime": "< 1.0 ms deterministic sync",
      "ioChannels": "2x 24V digital inputs (limit/home), 1x brake control output",
      "syncJitter": "< 1 µs distributed clock synchronization"
    },
    "environmentalAndSafety": {
      "operatingTemp": "-10°C to +45°C ambient (winding limit 115°C)",
      "storageTemp": "-25°C to +70°C",
      "humidity": "5% to 85% RH non-condensing",
      "ipRating": "IP65 (dust tight and water jet protected)",
      "safetyCertifications": ["EN ISO 13849-1 STO (SIL2 / PLd)", "IEC 61800-5-2", "CE Machinery Directive 2006/42/EC"],
      "applicableDirectives": ["2014/30/EU (EMC)", "2014/35/EU (LVD)", "2011/65/EU (RoHS 3)"],
      "unsuitableApplications": [
        "Continuous stall over 85 Nm without external thermal heatsink",
        "ATEX Zone 0 explosive atmospheres without purge enclosure"
      ]
    },
    "selectionConsiderations": {
      "primaryCriteria": [
        "Verify continuous RMS joint torque against thermal limit",
        "Select gear ratio based on required output angular velocity vs acceleration torque",
        "Ensure reflected inertia ratio JL/JM ≤ 10:1 for responsive dynamic tuning",
        "Specify failsafe holding brake for vertical gravity-loaded joints"
      ],
      "inertiaRatioLimit": "Recommended JL / JM ≤ 8:1 (max 10:1 with advanced notch filtering)",
      "thermalDeratingNotes": "Derate continuous torque by 1.5% per °C above 40°C ambient",
      "recommendedSafetyFactor": "K ≥ 1.5 for steady automation; K ≥ 2.0 for rapid reversing pick-and-place",
      "sizingFormulasHint": "T_rms = sqrt((T1²*t1 + T2²*t2 + ... + Tn*tn) / T_total) ≤ T_rated"
    },
    "integrationDependencies": [
      "48V DC regulated industrial power supply with regenerative braking shunt",
      "Shielded industrial Ethernet Cat5e cabling with M12 D-coded connectors",
      "EtherCAT master controller (Beckhoff TwinCAT, Omron NJ/NX, CODESYS, or LinuxCNC)"
    ],
    "relatedProductIds": [
      "intelligent-linear-actuator",
      "rotary",
      "servo-drives",
      "motion-controllers",
      "harmonic"
    ],
    "downloadableDocs": [
      {
        "title": "Intelligent Rotary Actuator Complete Engineering Datasheet",
        "type": "Datasheet",
        "format": "PDF",
        "size": "4.8 MB",
        "refCode": "DS-IND-IRA-2026-REV4",
        "verified": true
      },
      {
        "title": "3D CAD STEP Geometric Assembly Model (All Flange Sizes)",
        "type": "CAD 3D STEP",
        "format": "STEP",
        "size": "38.2 MB",
        "refCode": "CAD-IND-IRA-PKG-STEP",
        "verified": true
      },
      {
        "title": "Hardware Integration & EtherCAT Commissioning Manual",
        "type": "Manual",
        "format": "PDF",
        "size": "7.1 MB",
        "refCode": "MAN-IND-IRA-ETH-2026",
        "verified": true
      }
    ]
  },
  "intelligent-linear-actuator": {
    "id": "intelligent-linear-actuator",
    "categorySlug": "intelligent-actuators",
    "modelIdentifier": "IND-ILA-080-B16",
    "modelCode": "IND-ILA-SERIES",
    "componentType": "Integrated Intelligent Mechatronic Linear Actuator Module",
    "datasheet": {
      "documentNumber": "DS-IND-ILA-2026-REV2",
      "revision": "Rev 2.1",
      "releaseDate": "2026-03-01",
      "verificationLevel": "Verified Specification",
      "traceableSource": "INDUS Linear Motion Test Bench ISO 230-2"
    },
    "functionalOverview": "The INDUS Intelligent Linear Actuator combines an integrated 48V servo motor, a ground C5 ball screw, dual recirculating ball guides, an embedded closed-loop vector drive, and an absolute linear scale into a rigid aluminum extrusion module with built-in push-mode and force control.",
    "parameters": [
      {
        "name": "Continuous Rated Thrust",
        "value": "650 – 3800",
        "unit": "N",
        "tolerance": "±5%",
        "conditions": "At 25°C ambient, S1 duty cycle across models",
        "status": "verified"
      },
      {
        "name": "Peak Dynamic Thrust",
        "value": "1400 – 7800",
        "unit": "N",
        "tolerance": "±5%",
        "conditions": "Duration ≤ 0.5 sec, duty factor ≤ 10%",
        "status": "verified"
      },
      {
        "name": "Maximum Linear Velocity",
        "value": "800 – 1200",
        "unit": "mm/s",
        "tolerance": "Nominal",
        "conditions": "Based on screw lead pitch and motor RPM limit",
        "status": "verified"
      },
      {
        "name": "Bilateral Repeatability",
        "value": "±0.005",
        "unit": "mm",
        "tolerance": "±0.002 mm",
        "conditions": "ISO 230-2 bilateral test with linear glass scale",
        "status": "verified"
      },
      {
        "name": "Available Stroke Range",
        "value": "100 – 1800",
        "unit": "mm",
        "tolerance": "Configurable in 50mm increments",
        "conditions": "Standard catalogue lengths",
        "status": "verified"
      },
      {
        "name": "Operating Bus Voltage",
        "value": "48",
        "unit": "V DC",
        "tolerance": "24 – 56 V DC",
        "conditions": "Continuous DC supply",
        "status": "verified"
      }
    ],
    "categorySpecificSpecs": {
      "Transmission": "Precision C5 Ground Ball Screw",
      "Guide Type": "Dual Gothic Arch Linear Guide Blocks",
      "Drive Unit": "Integrated 48V Brushless Servo with FOC vector control",
      "Feedback": "Integrated 1 µm Optical Linear Absolute Scale",
      "Fieldbus": "EtherCAT (CoE) / CANopen"
    },
    "useCases": [
      "Precision Electric Press-Fit & Force-Dwell Staking",
      "High-Speed Cartesian Pick-and-Place Transfer Gantries",
      "Automated Battery Cell Assembly & Dispensing Slides",
      "Optics & Laser Inspection Automated Scanning Stages"
    ],
    "unsuitableApplications": [
      "Direct washdown in high-pressure steam without IP67 seal option",
      "Operation exceeding screw critical whirling speed for long unsupported strokes",
      "Cantilever moment loads beyond dual guide rail dynamic envelope"
    ],
    "mechanicalMounting": {
      "flangeStandard": "Standard T-slot nut channels with metric dowel hole grid",
      "boltPattern": "M6 / M8 T-nuts along extrusion body and carriage tapped holes",
      "alignmentPin": "Ground locating bores on carriage top plate",
      "maxOverhungLoad": "650 Nm dynamic pitch moment, 480 Nm roll moment",
      "recommendedFasteners": "Steel 8.8 minimum zinc-plated cap screws",
      "orientationNotes": "Horizontal, vertical, or side-wall mounting. Vertical axes require mechanical brake."
    },
    "electricalRequirements": {
      "supplyVoltage": "48V DC nominal",
      "ratedCurrent": "9.5 A rms continuous",
      "peakCurrent": "24.0 A peak",
      "motorType": "Brushless DC / AC Synchronous Servo Motor",
      "driveRequirement": "Integrated internal vector drive",
      "feedbackInterface": "Direct internal linear encoder interface"
    },
    "controlAndCommunication": {
      "fieldbuses": ["EtherCAT (CoE)", "CANopen", "IO-Link"],
      "controlModes": ["Cyclic Position", "Profile Velocity", "Dynamic Force Push Mode"],
      "cycleTime": "< 1.0 ms",
      "ioChannels": "2x Digital input, 1x Digital output",
      "syncJitter": "< 1 µs"
    },
    "environmentalAndSafety": {
      "operatingTemp": "0°C to +40°C",
      "storageTemp": "-20°C to +65°C",
      "humidity": "10% to 80% non-condensing",
      "ipRating": "IP54 standard / IP65 sealed strip option",
      "safetyCertifications": ["EN ISO 13849-1 STO", "CE Machinery Directive"],
      "applicableDirectives": ["2014/30/EU", "2014/35/EU"],
      "unsuitableApplications": ["Explosive gas atmospheres"]
    },
    "selectionConsiderations": {
      "primaryCriteria": [
        "Verify dynamic thrust against continuous duty cycle",
        "Check screw critical whirling speed for long strokes (>1000mm)",
        "Select screw lead pitch to balance thrust force vs required traverse speed",
        "Calculate guide rail moment loads for offset or cantilever payloads"
      ],
      "inertiaRatioLimit": "Reflected load inertia ratio ≤ 5:1 for dynamic positioning",
      "thermalDeratingNotes": "Maintain ambient under 40°C for rated continuous thrust",
      "recommendedSafetyFactor": "K ≥ 1.5 for horizontal slides; K ≥ 2.5 for vertical press axes",
      "sizingFormulasHint": "F_thrust = m * a + mu * m * g + F_process"
    },
    "integrationDependencies": [
      "48V DC power supply with dynamic brake resistor",
      "EtherCAT master PLC or fieldbus motion controller",
      "Standard M12 industrial power and communications cables"
    ],
    "relatedProductIds": [
      "intelligent-rotary-actuator",
      "linear",
      "servo-drives",
      "motion-controllers"
    ],
    "downloadableDocs": [
      {
        "title": "Intelligent Linear Actuator Full Datasheet & Sizing Charts",
        "type": "Datasheet",
        "format": "PDF",
        "size": "5.1 MB",
        "refCode": "DS-IND-ILA-2026-REV2",
        "verified": true
      },
      {
        "title": "Configurable 3D CAD STEP Solid Geometry",
        "type": "CAD 3D STEP",
        "format": "STEP",
        "size": "28.4 MB",
        "refCode": "CAD-IND-ILA-VAR-STEP",
        "verified": true
      }
    ]
  }
};

export const getEngineeringDossier = (id: string): EngineeringProductDossier | undefined => {
  return engineeringDossiers[id];
};

export const getAllEngineeringDossiers = (): EngineeringProductDossier[] => {
  return Object.values(engineeringDossiers);
};
