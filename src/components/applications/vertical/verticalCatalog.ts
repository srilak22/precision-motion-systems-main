import { images } from "@/lib/images";
import heroWeldingCell from "@/assets/hero/hero-welding-cell.jpg";
import heroProductionLine from "@/assets/hero/hero-production-line.jpg";
import { Clock, Crosshair, Weight, ShieldCheck } from "lucide-react";
import { GalleryApplicationCard } from "./VerticalUseCasesGrid";
import { ConfigOption } from "./VerticalConfigurator";

export interface VerticalPresetData {
  heroTagline: string;
  heroImage: string;
  workcellName: string;
  metrics: { id: string; label: string; value: string; sublabel: string; badge: string; icon?: any }[];
  galleryCards: GalleryApplicationCard[];
  configOptions: ConfigOption[];
}

export const VERTICAL_PRESETS: Record<string, VerticalPresetData> = {
  automotive: {
    heroTagline: "High-Throughput Robotic Workcells & 7th-Axis Mechatronics",
    heroImage: heroWeldingCell,
    workcellName: "7-AXIS LINEAR GANTRY WELDING CELL",
    metrics: [
      {
        id: "takt",
        value: "< 42s",
        label: "Takt Time Reduction",
        sublabel: "Down from 78s baseline on EV battery chassis trays",
        badge: "TAKT CYCLE",
        icon: Clock,
      },
      {
        id: "accuracy",
        value: "±0.02 mm",
        label: "Sub-Millimeter Precision",
        sublabel: "Closed-loop laser triangulation seam tracking guidance",
        badge: "ISO 9283",
        icon: Crosshair,
      },
      {
        id: "payload",
        value: "210 kg",
        label: "Max Dynamic Payload",
        sublabel: "Rigid heavy-duty articulated arm and gantry tooling",
        badge: "HIGH RIGIDITY",
        icon: Weight,
      },
      {
        id: "uptime",
        value: "99.98%",
        label: "Defect Interception & Uptime",
        sublabel: "Zero unplanned line shutdowns across continuous 24/7 duty",
        badge: "SIX SIGMA",
        icon: ShieldCheck,
      },
    ],
    galleryCards: [
      {
        id: "battery-assembly",
        title: "EV Battery Pack Module Assembly Cell",
        deploymentBadge: "AUTOMATED ASSEMBLY",
        image: heroProductionLine,
        description:
          "Automated robotic cell executing prismatic and pouch battery cell stacking, busbar laser welding, thermal paste dispensing, and high-voltage isolation testing.",
        kpiImpact: "Cuts module kitting cycle time by 46% while ensuring 100% thermal gap-filler uniformity.",
        specs: { payload: "150 kg", repeatability: "±0.015 mm", cycleTime: "< 42 sec" },
        techStack: ["ROS2 Kinematics", "OpenCV 3D", "Force-Torque Regulated", "EtherCAT CoE"],
        expandedDetails: {
          kinematics: "Dual 6-Axis Articulated Arms + Synchronized Cartesian Dispense Rail",
          fieldbus: "EtherCAT Master (Beckhoff TwinCAT 3) @ 250 µs cycle time",
          safetyCompliance: "ISO 13849-1 (Category 4, PL e) with laser safety zones",
          roiSummary: "Prevents battery thermal paste voiding; payback achieved in 8.4 months",
        },
      },
      {
        id: "body-welding",
        title: "Body-in-White 7th-Axis Gantry Welding",
        deploymentBadge: "ROBOTIC WELDING ARMS",
        image: heroWeldingCell,
        description:
          "7th-axis linear track robotic spot welding and fiber laser seam joining for automotive body-in-white (BIW) framing and high-strength aluminum door apertures.",
        kpiImpact: "Delivers 99.98% leak-proof weld seam integrity with automated real-time spatter suppression.",
        specs: { payload: "210 kg", repeatability: "±0.02 mm", cycleTime: "< 48 sec" },
        techStack: ["Laser Seam Triangulation", "MoveIt2 Motion", "Beckhoff CX2040", "PROFINET IRT"],
        expandedDetails: {
          kinematics: "6-Axis Heavy Articulated Arm on 12-Meter Servo Linear Track",
          fieldbus: "PROFINET IRT with closed-loop medium-frequency DC weld gun control",
          safetyCompliance: "AWS D8.1M Automotive Welding Specification compliant",
          roiSummary: "Reduced chassis framing takt time from 78s to 48s",
        },
      },
      {
        id: "powertrain-handling",
        title: "Powertrain & Gearbox Articulated Handling",
        deploymentBadge: "HEAVY MATERIAL HANDLING",
        image: images.arm,
        description:
          "High-torque articulated handling arms automating engine decking, electric drive unit (EDU) stator-rotor insertion, and transmission pallet transfer.",
        kpiImpact: "Achieves 12-second decking takt time with zero mechanical shock and complete torque telemetry logging.",
        specs: { payload: "350 kg", repeatability: "±0.03 mm", cycleTime: "< 12 sec" },
        techStack: ["6-DOF Force Control", "Dual Pneumatic Gripper", "SIL 3 Safety PLC", "OPC-UA UNS"],
        expandedDetails: {
          kinematics: "Rigid Articulated 6-Axis Kinematics with dynamic counterbalancing",
          fieldbus: "EtherNet/IP CIP Safety & OPC-UA Unified Namespace bridge",
          safetyCompliance: "Safe Torque Off (STO), Safe Stop 1 (SS1), Safe Operating Stop (SOS)",
          roiSummary: "Zero dropped component incidents across 3.2 million duty cycles",
        },
      },
      {
        id: "machine-tending",
        title: "Dual-Gripper CNC Machine Tending Cell",
        deploymentBadge: "CNC TENDING AUTOMATION",
        image: images.weldingRobot,
        description:
          "Turnkey robotic tending cell loading and unloading high-tonnage stamping presses and multi-axis CNC milling centers with pneumatic zero-point fixtures.",
        kpiImpact: "Elevates spindle utilization from 62% to 96.4% via continuous 24/7 lights-out machining.",
        specs: { payload: "180 kg", repeatability: "±0.02 mm", cycleTime: "< 8s swap" },
        techStack: ["Siemens S7-1500", "Zero-Point Clamping", "IO-Link Sensors", "VDA 5050"],
        expandedDetails: {
          kinematics: "Pedestal-Mounted 6-Axis Manipulator with dual pneumatic tooling",
          fieldbus: "Siemens PROFINET with PROFIsafe wireless tool changer link",
          safetyCompliance: "Dual-channel light curtains + dynamic muting radar sensors",
          roiSummary: "Finished-to-raw pallet part swap completed in under 8 seconds per cycle",
        },
      },
    ],
    configOptions: [
      {
        id: "battery-kitting",
        tabLabel: "Battery Module Kitting",
        badge: "CARTESIAN & ARTICULATED WORKCELL",
        modelName: "INDUS-BAT-K150 (7-DOF)",
        kinematicsType: "6-Axis Articulated Arm + Synchronized Cartesian Dispense Rail",
        image: heroProductionLine,
        description:
          "Engineered specifically for prismatic cell stacking, busbar tightening, and high-voltage module casing insertion with constant 6-DOF force/torque regulation.",
        specs: {
          payload: "150 kg dynamic",
          reach: "2,650 mm radius",
          repeatability: "±0.015 mm",
          axes: "6 + 1 Auxiliary",
          ipRating: "IP65 (Clean Enclosure)",
          fieldbus: "EtherCAT CoE / TwinCAT 3",
        },
        keyFeatures: [
          "Integrated laser triangulation seam height profiling",
          "Dynamic anti-vibration damping on sudden deceleration",
          "Zero-backlash cycloidal joints with torque telemetry",
          "Automated high-voltage insulation dielectric check",
        ],
        cadFilename: "INDUS_BAT_K150_3D_ASSEMBLY.STEP",
        datasheetFilename: "INDUS_BAT_K150_Datasheet_2026.pdf",
      },
      {
        id: "laser-welding",
        tabLabel: "Adaptive Laser Seam Welding",
        badge: "7TH-AXIS LINEAR WELDING CELL",
        modelName: "INDUS-WELD-R210-7X",
        kinematicsType: "High-Payload 6-Axis Manipulator on 12m Servo Linear Track",
        image: heroWeldingCell,
        description:
          "Purpose-built for automotive BIW structural framing, battery tray leak-tight perimeter welding, and exhaust hydroformed component joining.",
        specs: {
          payload: "210 kg dynamic",
          reach: "3,100 mm + 12m Rail",
          repeatability: "±0.020 mm",
          axes: "7 Continuous Coordinated",
          ipRating: "IP67 (Spatter Shielded)",
          fieldbus: "PROFINET IRT / Beckhoff EtherCAT",
        },
        keyFeatures: [
          "Sub-pixel optical seam following @ 120 FPS camera sync",
          "Multi-layer laser power closed-loop regulation",
          "Dual safety laser scanner safety zone muting",
          "Automatic torch cleaner and nozzle reamer cycle",
        ],
        cadFilename: "INDUS_WELD_R210_7X_3D_STEP.zip",
        datasheetFilename: "INDUS_WELD_R210_Specifications.pdf",
      },
      {
        id: "cnc-tending",
        tabLabel: "CNC Machine Tending",
        badge: "HEAVY ARTICULATED TENDING",
        modelName: "INDUS-TEND-HD350",
        kinematicsType: "Heavy-Duty Pedestal Articulated Robotic Arm",
        image: images.arm,
        description:
          "Built to withstand continuous coolant spray, high-temperature forged billet loading, and dual-gripper pneumatic pallet exchanges for machining centers.",
        specs: {
          payload: "350 kg dynamic",
          reach: "2,850 mm radius",
          repeatability: "±0.025 mm",
          axes: "6-Axis Articulated",
          ipRating: "IP67 / Wrist IP69K",
          fieldbus: "Siemens PROFIsafe / EtherNet/IP",
        },
        keyFeatures: [
          "Dual pneumatic gripper for sub-8s finished-to-raw part swap",
          "Air-purge pressurized arm casting for hostile swarf",
          "Direct handshake with Siemens 840D / Fanuc CNC controllers",
          "Integrated machine door and pneumatic clamp interlocks",
        ],
        cadFilename: "INDUS_TEND_HD350_CAD_MODEL.STEP",
        datasheetFilename: "INDUS_TEND_HD350_Technical_Data.pdf",
      },
    ],
  },
  semiconductor: {
    heroTagline: "Sub-Micron Cleanroom Handling & Deep Optical Vision Inspection",
    heroImage: images.scaraRobot,
    workcellName: "CLEANROOM SCARA & WAFER HANDLING CELL",
    metrics: [
      { id: "prec", value: "±15 µm", label: "Placement Accuracy", sublabel: "Sub-pixel telecentric vision calibration", badge: "SEMI S2/S8" },
      { id: "takt", value: "1,200 PPH", label: "Takt Output Rate", sublabel: "Continuous high-speed SMT assembly velocity", badge: "HIGH-SPEED" },
      { id: "clean", value: "ISO Class 1", label: "Cleanroom Standard", sublabel: "Particle-free sealed grease & stainless seals", badge: "CERTIFIED" },
      { id: "aoi", value: "99.98%", label: "Defect Interception", sublabel: "Deep CNN sub-pixel solder bridging classification", badge: "INSPECTION" },
    ],
    galleryCards: [
      {
        id: "scara-smt",
        title: "High-Speed SCARA PCB Component Placement",
        deploymentBadge: "CLEANROOM SCARA ARMS",
        image: images.scaraRobot,
        description: "Direct-drive SCARA robots placing micro-fasteners, shielded connectors, and delicate 01005 chips at high cycle frequencies.",
        kpiImpact: "Multiplies component assembly throughput by 2.4x with zero electrostatic discharge (ESD) events.",
        specs: { payload: "12 kg", repeatability: "±0.010 mm", cycleTime: "0.28 sec" },
        techStack: ["OpenCV Vision", "SCARA Direct Drive", "ESD Safe", "EtherCAT CoE"],
        expandedDetails: {
          kinematics: "4-Axis Direct Drive High-Speed SCARA",
          fieldbus: "Deterministic EtherCAT Master @ 125 µs cycle rate",
          safetyCompliance: "SEMI S2 / S8 cleanroom equipment safety certified",
          roiSummary: "Reduces component misplacement scrap by $180,000 annually",
        },
      },
      {
        id: "wafer-foup",
        title: "Automated Wafer FOUP & Pod Transfer Manipulators",
        deploymentBadge: "WAFER HANDLING ARMS",
        image: images.vision3dCamera,
        description: "Precision dual-arm Bernoulli and vacuum end-effectors transferring 300mm silicon wafers between cassette pods and lithography stages.",
        kpiImpact: "Achieves zero edge-chipping across 5,000,000 wafer transfer cycles.",
        specs: { payload: "6 kg", repeatability: "±0.005 mm", cycleTime: "< 3.2 sec" },
        techStack: ["Bernoulli Gripper", "Sub-Micron Laser", "SECS/GEM", "ISO Class 1"],
        expandedDetails: {
          kinematics: "Dual-Arm Planar Cleanroom Manipulator with vacuum lift",
          fieldbus: "SECS/GEM & OPC-UA unified semiconductor fab bridge",
          safetyCompliance: "Full ESD-safe conductive coatings & nitrogen purge",
          roiSummary: "Guarantees zero particle shedding in high-yield sub-3nm nodes",
        },
      },
    ],
    configOptions: [
      {
        id: "scara-high-speed",
        tabLabel: "Cleanroom SCARA",
        badge: "SEMI CLASS 1 SCARA",
        modelName: "INDUS-SCARA-S12",
        kinematicsType: "4-Axis Cleanroom Direct-Drive SCARA",
        image: images.scaraRobot,
        description: "Engineered for high-frequency micro-pick and place in semiconductor packaging and consumer electronics SMT lines.",
        specs: { payload: "12 kg", reach: "800 mm", repeatability: "±0.010 mm", axes: "4-Axis", ipRating: "ISO Class 1", fieldbus: "EtherCAT" },
        keyFeatures: ["Harmonic drive wrist with zero backlash", "Integrated telecentric vision flange", "Sealed vacuum internally routed"],
        cadFilename: "INDUS_SCARA_S12_3D.STEP",
        datasheetFilename: "INDUS_SCARA_S12_Datasheet.pdf",
      },
    ],
  },
  packaging: {
    heroTagline: "High-Speed Delta Kinematics & Autonomous Mobile Intralogistics",
    heroImage: heroProductionLine,
    workcellName: "AUTONOMOUS AMR & PALLETIZING CELL",
    metrics: [
      { id: "pick", value: "140 P/min", label: "Pick Velocity", sublabel: "Continuous high-speed delta kitting and carton packing", badge: "HIGH-TAKT" },
      { id: "payload", value: "1,200 kg", label: "AMR Fleet Payload", sublabel: "Heavy pallet autonomous transit between dock and ASRS", badge: "AMR FLEET" },
      { id: "acc", value: "99.8%", label: "Sorting Accuracy", sublabel: "3D vision barcode and dimension classification", badge: "DYNAMIC" },
      { id: "uptime", value: "99.95%", label: "Fleet Availability", sublabel: "Continuous automatic fast inductive opportunity charging", badge: "24/7 FLEET" },
    ],
    galleryCards: [
      {
        id: "amr-fleet",
        title: "Autonomous Mobile Robots (AMRs) Intralogistics",
        deploymentBadge: "AMR & AGV FLEETS",
        image: heroProductionLine,
        description: "Autonomous LiDAR-guided mobile robots coordinating pallet transit, tote haulage, and dynamic line-side replenishments.",
        kpiImpact: "Eliminates warehouse forklift bottlenecks and reduces product transit damage by 99.8%.",
        specs: { payload: "1,200 kg", repeatability: "±5 mm", cycleTime: "Continuous" },
        techStack: ["ROS2 Nav2", "LiDAR SLAM", "VDA 5050", "Fleet Manager"],
        expandedDetails: {
          kinematics: "Differential / Omnidirectional Autonomous Mobile Platform",
          fieldbus: "Wi-Fi 6 / 5G Industrial VDA 5050 Fleet Telemetry Protocol",
          safetyCompliance: "ISO 3691-4 industrial driverless truck safety certified",
          roiSummary: "Slashes internal transit cycle times by 55% across 200,000 sq ft plants",
        },
      },
      {
        id: "delta-pack",
        title: "High-Speed Delta Carton Pick & Packing",
        deploymentBadge: "HIGH-SPEED DELTA ROBOTS",
        image: images.deltaRobot,
        description: "Parallel delta manipulators executing visual tracking, conveyor belt sync, and dynamic carton packing of diverse SKUs.",
        kpiImpact: "Sustains 140 picks per minute per cell without operator fatigue.",
        specs: { payload: "15 kg", repeatability: "±0.05 mm", cycleTime: "140 P/min" },
        techStack: ["Delta Parallel Kinematics", "Conveyor Tracking", "Vision AI", "EtherCAT"],
        expandedDetails: {
          kinematics: "3-DOF + 1 Rotary High-Speed Parallel Delta Arm",
          fieldbus: "EtherCAT with synchronized incremental encoder tracking",
          safetyCompliance: "Light curtains and interlocked polycarbonate cell enclosure",
          roiSummary: "Eliminates end-of-line packaging bottlenecks; payback in 7.2 months",
        },
      },
    ],
    configOptions: [
      {
        id: "amr-1200",
        tabLabel: "AMR Heavy Hauler",
        badge: "VDA 5050 AMR",
        modelName: "INDUS-AMR-1200",
        kinematicsType: "Autonomous Mobile Platform with Integrated Roller Bed",
        image: heroProductionLine,
        description: "Heavy pallet autonomous transit vehicle equipped with 360-degree LiDAR safety curtains and dynamic slam re-routing.",
        specs: { payload: "1,200 kg", reach: "Ground", repeatability: "±5 mm", axes: "Mobile", ipRating: "IP54", fieldbus: "VDA 5050" },
        keyFeatures: ["Dual safety LiDAR scanners (SIL 2 / PL d)", "Automatic docking and opportunity charging", "Seamless WMS / ERP integration"],
        cadFilename: "INDUS_AMR_1200_CAD.STEP",
        datasheetFilename: "INDUS_AMR_1200_Datasheet.pdf",
      },
    ],
  },
};

export function getVerticalPreset(applicationId: string): VerticalPresetData {
  const norm = applicationId.toLowerCase();
  if (norm.includes("auto")) return VERTICAL_PRESETS.automotive;
  if (norm.includes("semi") || norm.includes("elec")) return VERTICAL_PRESETS.semiconductor;
  if (norm.includes("pack") || norm.includes("logis") || norm.includes("warehous")) return VERTICAL_PRESETS.packaging;
  // Default to Automotive preset customized with fallback
  return VERTICAL_PRESETS.automotive;
}
