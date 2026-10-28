import { getRangeById } from "../src/data/productCatalogue";

export const CANONICAL_CATEGORIES_CONFIG = {
  "motion-actuation": {
    id: "motion-actuation",
    title: "Motion & Actuation",
    description: "Ultra-precision strain-wave harmonic reducers, cycloidal RV gearboxes, planetary gearheads, and high-dynamic servo joint actuators.",
    shortDescription: "Reducers, gearboxes, frameless motors, and integrated robot joint modules.",
    primaryRoute: "/products/motion-actuation",
    groups: [
      {
        groupName: "Strain-Wave Harmonic Reducers",
        itemIds: [
          "ind-pr-sw-cup-set",
          "ind-pr-sw-hollow-unit",
          "ind-pr-sw-flat-pancake",
          "ind-pr-sw-silk-hat",
          "ind-pr-sw-micro",
          "ind-pr-sw-cryo-vacuum",
        ],
      },
      {
        groupName: "RV & High-Precision Cycloidal Drives",
        itemIds: [
          "ind-pr-rv-solid-e",
          "ind-pr-rv-hollow-c",
          "ind-pr-rv-compact-n",
          "ind-pr-rv-turntable",
          "ind-pr-cyc-standard",
          "ind-pr-cyc-precision",
        ],
      },
      {
        groupName: "Precision Planetary & Hypoid Gearboxes",
        itemIds: [
          "ind-pr-pl-helical-low",
          "ind-pr-pl-right-angle",
          "ind-pr-pl-flange-output",
          "ind-pr-pl-economy",
          "ind-pr-pl-3stage-high-ratio",
          "ind-pr-pl-hygienic",
        ],
      },
      {
        groupName: "Servo Motors & Joint Actuators",
        itemIds: [
          "ind-mot-pmsm-low-inertia",
          "ind-mot-pmsm-med-inertia",
          "ind-mot-frameless-torque",
          "ind-mot-direct-drive-rotary",
          "ind-act-cobot-joint-medium",
          "ind-act-hollow-rotary-table",
        ],
      },
    ],
  },

  "robotic-systems": {
    id: "robotic-systems",
    title: "Robotic Systems",
    description: "Industrial 6-axis articulated arms, sensitive collaborative cobots, ultra-high-speed SCARA and parallel delta kinematic manipulators.",
    shortDescription: "6-axis industrial arms, cobots, SCARA, delta manipulators, and automation cells.",
    primaryRoute: "/products/robotic-systems",
    groups: [
      {
        groupName: "Articulated 6-Axis Industrial Arms",
        itemIds: [
          "ind-rob-6axis-mid",
          "ind-rob-heavy-foundry",
          "ind-rob-compact-tabletop",
          "ind-rob-long-reach",
          "ind-rob-cleanroom-iso1",
        ],
      },
      {
        groupName: "Collaborative Robots (Cobots)",
        itemIds: [
          "ind-rob-cobot-5kg",
          "ind-rob-cobot-10kg",
          "ind-rob-cobot-20kg-pallet",
          "ind-rob-cobot-mobile",
          "ind-rob-cobot-surgical",
        ],
      },
      {
        groupName: "SCARA & High-Speed Delta Robots",
        itemIds: [
          "ind-rob-scara-standard",
          "ind-rob-scara-long-reach",
          "ind-rob-delta-parallel",
          "ind-rob-delta-ip69k",
          "ind-rob-cartesian-gantry",
        ],
      },
      {
        groupName: "Turn-Key Industrial Automation Cells",
        itemIds: [
          "ind-rob-cell-welding",
          "ind-rob-cell-palletizing",
          "ind-rob-cell-assembly",
          "ind-rob-cell-machine-tending",
          "ind-rob-cell-inspection",
        ],
      },
    ],
  },

  "mobility-systems": {
    id: "mobility-systems",
    title: "Mobility Systems",
    description: "Integrated in-hub AGV traction drives, heavy-duty omnidirectional mecanum wheels, precision swerve steer assemblies, and autonomous chassis.",
    shortDescription: "AGV drive wheels, mecanum systems, swerve steer modules, and mobile robot platforms.",
    primaryRoute: "/products/mobility-systems",
    groups: [
      {
        groupName: "In-Hub AGV Drive Wheels",
        itemIds: [
          "ind-mob-drive-standard",
          "ind-mob-drive-heavy",
          "ind-mob-drive-low-profile",
          "ind-mob-drive-differential",
          "ind-mob-drive-atex",
        ],
      },
      {
        groupName: "Omnidirectional Mecanum & Omni Wheels",
        itemIds: [
          "ind-mob-mecanum-heavy",
          "ind-mob-mecanum-compact",
          "ind-mob-omni-dual-plate",
          "ind-mob-omni-precision-al",
          "ind-mob-omni-suspended",
        ],
      },
      {
        groupName: "Steering Swerve & Suspension Modules",
        itemIds: [
          "ind-mob-swerve-steer",
          "ind-mob-dual-wheel-castor",
          "ind-mob-suspension-rocker",
          "ind-mob-steering-hub",
          "ind-mob-leveling-suspension",
        ],
      },
      {
        groupName: "Autonomous Mobile Chassis & Attachments",
        itemIds: [
          "ind-mob-chassis-amr-500",
          "ind-mob-lift-scissor",
          "ind-mob-conveyor-top",
          "ind-mob-charging-inductive",
          "ind-mob-nav-autonomous-kit",
        ],
      },
    ],
  },

  "control-drives": {
    id: "control-drives",
    title: "Control & Drives",
    description: "Real-time industrial IPC motion controllers, synchronized multi-axis servo drives, Safe Motion architectures, and fieldbus interfaces.",
    shortDescription: "Real-time IPC masters, multi-axis servo drives, safe motion, and EtherCAT fieldbus nodes.",
    primaryRoute: "/products/control-drives",
    groups: [
      {
        groupName: "Multi-Axis Robot Motion Controllers",
        itemIds: [
          "ind-ctl-ipc-realtime-master",
          "ind-ctl-din-rail-embedded-motion",
          "ind-ctl-6axis-pendant-cabinet",
          "ind-ctl-open-ros2-controller",
          "ind-ctl-cnc-gcode-camming",
        ],
      },
      {
        groupName: "Synchronized Kinematics & AMR Cores",
        itemIds: [
          "ind-ctl-amr-fleet-gateway",
          "ind-ctl-64axis-ethercat-motion",
          "ind-ctl-delta-packaging-kinematics",
          "ind-ctl-multi-robot-synchronized",
          "ind-ctl-vgr-integrated-engine",
        ],
      },
      {
        groupName: "AC & Low-Voltage DC Servo Drives",
        itemIds: [
          "ind-drv-compact-48v-cobot",
          "ind-drv-400v-multi-axis-shared-bus",
          "ind-drv-high-resolution-analog-interface",
          "ind-drv-integrated-cobot-joint-dual",
          "ind-drv-sic-wide-bandgap",
        ],
      },
      {
        groupName: "Safe Motion & Specialized Amplifiers",
        itemIds: [
          "ind-drv-fsoe-safety-drive",
          "ind-drv-motor-mounted-ip65",
          "ind-drv-direct-drive-torque-amp",
          "ind-drv-linear-motor-dual-encoder",
          "ind-drv-active-brake-regen-unit",
        ],
      },
    ],
  },

  "sensing-vision": {
    id: "sensing-vision",
    title: "Sensing & Vision",
    description: "Sub-micron optical and inductive encoders, 6-DoF force/torque feedback sensors, 3D structured-light vision cameras, and smart edge sensors.",
    shortDescription: "Precision encoders, 6-DoF force/torque sensors, 3D vision systems, and AI inspection.",
    primaryRoute: "/products/sensing-vision",
    groups: [
      {
        groupName: "Rotary & Linear Encoders",
        itemIds: [
          "ind-sen-opt-hollow-24bit",
          "ind-sen-dual-track-inductive-kit",
          "ind-sen-heavy-magnetic-multiturn",
          "ind-sen-resolver-commutation-heavy",
          "ind-sen-linear-glass-scale",
        ],
      },
      {
        groupName: "Force/Torque & Industrial Proximity",
        itemIds: [
          "ind-sen-6dof-wrist-ft-sensor",
          "ind-sen-joint-torque-spoke-sensor",
          "ind-sen-dynamic-piezo-force-sensor",
          "ind-sen-tactile-matrix-fingertip",
          "ind-sen-weld-immune-inductive",
        ],
      },
      {
        groupName: "3D Vision & Spatial Perception",
        itemIds: [
          "ind-vis-3d-structured-light-binpicker",
          "ind-vis-3d-tof-camera",
          "ind-vis-3d-flash-lidar",
          "ind-vis-77ghz-industrial-radar",
          "ind-vis-telecentric-metrology-lens",
        ],
      },
      {
        groupName: "2D Inspection & Smart Edge Sensors",
        itemIds: [
          "ind-vis-2d-gige-pregius",
          "ind-vis-4k-linescan-camera",
          "ind-vis-swir-infrared-camera",
          "ind-vis-embedded-ai-smart-camera",
          "ind-vis-barcode-ocr-vision-reader",
        ],
      },
    ],
  },

  "end-effectors": {
    id: "end-effectors",
    title: "End Effectors & Tooling",
    description: "Electric parallel and centric grippers, high-flow vacuum handling tools, robotic welding guns, deburring spindles, and automatic tool changers.",
    shortDescription: "Servo grippers, vacuum handling, automatic tool changers, and process spindles.",
    primaryRoute: "/products/end-effectors",
    groups: [
      {
        groupName: "Electric Precision Grippers",
        itemIds: [
          "ind-ee-parallel-servo-gripper",
          "ind-ee-3finger-centric-chuck",
          "ind-ee-5finger-dexterous-hand",
          "ind-ee-soft-bionic-silicone-gripper",
          "ind-ee-pneumatic-expanding-mandrel",
        ],
      },
      {
        groupName: "Vacuum & Non-Contact Handling",
        itemIds: [
          "ind-ee-vacuum-bernoulli-gripper",
          "ind-ee-electrostatic-soft-gripper",
          "ind-ee-permanent-electro-magnet",
          "ind-ee-needle-porous-gripper",
          "ind-ee-cryo-specimen-vane",
        ],
      },
      {
        groupName: "Welding, Cutting & Process Tooling",
        itemIds: [
          "ind-ee-spot-weld-servo-gun",
          "ind-ee-laser-seam-tracker-head",
          "ind-ee-ultrasonic-cutting-sonotrode",
          "ind-ee-laser-cutting-slitting-head",
          "ind-ee-blind-riveting-end-effector",
        ],
      },
      {
        groupName: "Tool Changers & Material Dispensing",
        itemIds: [
          "ind-ee-auto-tool-changer-heavy",
          "ind-ee-compliance-deburring-spindle",
          "ind-ee-screwdriving-auto-feeder",
          "ind-ee-hot-melt-micro-extruder",
          "ind-ee-heavy-palletizing-fork",
        ],
      },
    ],
  },

  "mechanical-components": {
    id: "mechanical-components",
    title: "Mechanical Components",
    description: "C3/C5 ground ballscrews, caged roller linear guideways, precision crossed-roller bearings, disc couplings, and safety holding brakes.",
    shortDescription: "Linear guides, precision ballscrews, crossed-roller bearings, and zero-backlash couplings.",
    primaryRoute: "/products/mechanical-components",
    groups: [
      {
        groupName: "Linear Guidance & Drive Systems",
        itemIds: [
          "ind-lin-ground-ballscrew-c3",
          "ind-lin-roller-caged-guideway",
          "ind-lin-miniature-cross-roller-slide",
          "ind-lin-high-speed-roller-screw",
          "ind-lin-inverted-roller-actuator",
        ],
      },
      {
        groupName: "Linear Bearings & 7th-Axis Motion",
        itemIds: [
          "ind-lin-helical-rack-pinion",
          "ind-lin-recirculating-ball-rail",
          "ind-lin-stainless-washdown-guide",
          "ind-lin-aerostatic-air-bearing-stage",
          "ind-lin-telescopic-cantilever-axis",
        ],
      },
      {
        groupName: "Precision Bearings & Slew Rings",
        itemIds: [
          "ind-mec-crossed-roller-bearing",
          "ind-mec-corrosion-proof-crossed-roller",
          "ind-mec-high-speed-angular-contact-set",
          "ind-mec-slew-ring-bearing-geared",
          "ind-mec-ceramic-hybrid-spindle-bearing",
        ],
      },
      {
        groupName: "Shaft Couplings & Torque Limiting",
        itemIds: [
          "ind-mec-flexible-disc-pack",
          "ind-mec-curved-jaw-elastomer",
          "ind-mec-metal-bellows-coupling",
          "ind-mec-power-off-safety-brake",
          "ind-mec-ball-detent-torque-limiter",
        ],
      },
    ],
  },

  "safety-intelligent": {
    id: "safety-intelligent",
    title: "Safety & Intelligent Systems",
    description: "Dynamic safety laser area scanners, Type 4 light curtains, modular safety PLCs, TSN managed Ethernet switches, and industrial edge AI compute.",
    shortDescription: "Safety laser scanners, Type 4 light curtains, modular safety PLCs, and edge IIoT gateways.",
    primaryRoute: "/products/safety-intelligent",
    groups: [
      {
        groupName: "Optical Machine Safety & Scanners",
        itemIds: [
          "ind-saf-laser-scanner-dynamic",
          "ind-saf-light-curtain-type4",
          "ind-saf-safety-radar-barrier",
          "ind-saf-overhead-tof-canopy",
          "ind-saf-heavy-safety-mat",
        ],
      },
      {
        groupName: "Safety Controllers & Interlocks",
        itemIds: [
          "ind-saf-modular-safety-plc",
          "ind-saf-rfid-door-interlock",
          "ind-saf-safe-motion-monitoring-module",
          "ind-saf-force-guided-safety-relay",
          "ind-saf-wireless-estop-pendant",
        ],
      },
      {
        groupName: "Deterministic TSN & IIoT Gateways",
        itemIds: [
          "ind-net-tsn-managed-switch",
          "ind-net-io-link-master-ip67",
          "ind-net-opc-ua-tsn-edge-gateway",
          "ind-net-industrial-5g-router",
          "ind-net-wifi6-industrial-client",
        ],
      },
      {
        groupName: "Edge AI Compute & Condition Monitoring",
        itemIds: [
          "ind-net-edge-ai-inference-box",
          "ind-net-vibration-monitoring-node",
          "ind-net-motor-power-analyzer-iot",
          "ind-net-oil-debris-particle-monitor",
          "ind-net-failover-redundant-ring-switch",
        ],
      },
    ],
  },
};

console.log("=== VALIDATING CANONICAL TAXONOMY CONFIG ===");
let totalItems = 0;
let missingRanges = 0;
const allIds: string[] = [];

Object.entries(CANONICAL_CATEGORIES_CONFIG).forEach(([catId, cat]) => {
  const catItemIds: string[] = [];
  cat.groups.forEach((g) => {
    g.itemIds.forEach((id) => {
      totalItems++;
      catItemIds.push(id);
      allIds.push(id);
      const range = getRangeById(id);
      if (!range) {
        missingRanges++;
        console.log(`❌ Missing range in Catalogue: "${id}" (Group: ${g.groupName}, Cat: ${cat.title})`);
      }
    });
  });

  const uniqueInCat = new Set(catItemIds);
  console.log(`Category [${catId}] "${cat.title}": ${catItemIds.length} items (Unique: ${uniqueInCat.size})`);
  if (catItemIds.length !== uniqueInCat.size) {
    console.log(`  ⚠️ Duplicates inside category ${catId}!`);
  }
});

const globalUnique = new Set(allIds);
console.log(`\nTotal items across all 8 categories: ${totalItems}`);
console.log(`Global unique IDs: ${globalUnique.size}`);
console.log(`Missing catalogue ranges: ${missingRanges}`);
if (missingRanges === 0 && totalItems === globalUnique.size) {
  console.log(`✅ PERFECT 100% CANONICAL RESOLUTION: All ${totalItems} items exist in catalogue and are 100% distinct!`);
}
