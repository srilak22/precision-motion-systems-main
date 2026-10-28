import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { TOP_LEVEL_CATEGORIES } from "../src/data/productTaxonomy";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determine the best image variable for each product based on category, group, name, and ID
function resolveImageVar(catId: string, groupName: string, id: string, name: string): string {
  const normId = id.toLowerCase();
  const normName = name.toLowerCase();

  // 1. Safety & Intelligent Systems
  if (catId === "safety-intelligent") {
    if (normId.includes("laser-scanner") || normName.includes("laser area scanner")) {
      return "safetyLaserScannerImage";
    }
    if (normId.includes("light-curtain") || normName.includes("light curtain")) {
      return "safetyLightCurtainImage";
    }
    if (normId.includes("radar") || normId.includes("canopy") || normId.includes("mat")) {
      return "safetyRadarSensorImage";
    }
    if (normId.includes("plc") || normId.includes("interlock") || normId.includes("monitoring-module") || normId.includes("safety-relay") || normId.includes("pendant")) {
      return "safetyPlcControllerImage";
    }
    if (normId.includes("tsn") || normId.includes("io-link") || normId.includes("opc-ua") || normId.includes("router") || normId.includes("wifi6") || normId.includes("ring-switch")) {
      return "tsnEdgeGatewayImage";
    }
    if (normId.includes("edge-ai") || normId.includes("vibration") || normId.includes("power-analyzer") || normId.includes("oil-debris")) {
      return "edgeAiComputeImage";
    }
    return "safetyPlcControllerImage";
  }

  // 2. Sensing & Vision
  if (catId === "sensing-vision") {
    if (normId.includes("encoder") || normId.includes("scale") || normId.includes("resolver")) {
      return "rotaryEncoderImage";
    }
    if (normId.includes("force") || normId.includes("torque") || normId.includes("tactile") || normId.includes("inductive")) {
      return "forceTorqueSensorImage";
    }
    if (normId.startsWith("ind-vis-")) {
      return "vision3dCameraImage";
    }
    return "sensorsFeedbackImage";
  }

  // 3. End Effectors & Tooling
  if (catId === "end-effectors") {
    if (normId.includes("vacuum") || normId.includes("bernoulli") || normId.includes("electrostatic") || normId.includes("magnet") || normId.includes("needle") || normId.includes("vane")) {
      return "vacuumGripperImage";
    }
    if (normId.includes("soft") || normId.includes("5finger") || normId.includes("bionic") || normId.includes("3finger") || normId.includes("mandrel")) {
      return "softAdaptiveGripperImage";
    }
    if (normId.includes("tool-changer") || normId.includes("spot-weld") || normId.includes("tracker") || normId.includes("cutting") || normId.includes("riveting") || normId.includes("spindle") || normId.includes("screwdriving") || normId.includes("extruder") || normId.includes("fork")) {
      return "roboticToolChangerImage";
    }
    return "roboticGripperImage";
  }

  // 4. Mechanical Components
  if (catId === "mechanical-components") {
    if (normId.includes("ballscrew") || normId.includes("roller-screw") || normId.includes("rack-pinion")) {
      return "precisionBallScrewImage";
    }
    if (normId.includes("guideway") || normId.includes("slide") || normId.includes("ball-rail") || normId.includes("washdown-guide") || normId.includes("air-bearing") || normId.includes("cantilever")) {
      return "linearGuidewayImage";
    }
    if (normId.includes("bearing") || normId.includes("slew-ring") || normId.includes("spindle-bearing")) {
      return "industrialGearboxImage";
    }
    if (normId.includes("coupling") || normId.includes("brake") || normId.includes("torque-limiter") || normId.includes("disc-pack") || normId.includes("elastomer") || normId.includes("bellows")) {
      return "industrialGearboxImage";
    }
    return "linearGuidewayImage";
  }

  // 5. Control & Drives
  if (catId === "control-drives") {
    if (normId.startsWith("ind-ctl-6axis") || normId.includes("pendant")) {
      return "robotControllerImage";
    }
    if (normId.startsWith("ind-ctl-")) {
      return "motionControllerImage";
    }
    if (normId.startsWith("ind-drv-")) {
      return "servoDriveImage";
    }
    return "motionControllerImage";
  }

  // 6. Mobility Systems
  if (catId === "mobility-systems") {
    if (normId.includes("mecanum")) {
      return "mecanumWheelImage";
    }
    if (normId.includes("omni")) {
      return "omniWheelImage";
    }
    if (normId.includes("drive")) {
      return "driveWheelImage";
    }
    if (normId.includes("chassis")) {
      return "mobileImage";
    }
    return "mobileModuleImage";
  }

  // 7. Robotic Systems
  if (catId === "robotic-systems") {
    if (normId.includes("scara")) {
      return "scaraRobotImage";
    }
    if (normId.includes("cobot")) {
      return "cobotRobotImage";
    }
    if (normId.includes("delta")) {
      return "deltaRobotImage";
    }
    if (normId.includes("welding")) {
      return "weldingRobotImage";
    }
    if (normId.includes("palletizing")) {
      return "palletizingRobotImage";
    }
    return "armImage";
  }

  // 8. Motion & Actuation
  if (catId === "motion-actuation") {
    if (normId.startsWith("ind-pr-sw-") || normName.includes("strain-wave") || normName.includes("harmonic")) {
      return "harmonicReducerImage";
    }
    if (normId.startsWith("ind-pr-rv-") || normId.startsWith("ind-pr-cyc-") || normName.includes("cycloid") || normName.includes("rv")) {
      return "cycloidalReducerImage";
    }
    if (normId.startsWith("ind-pr-pl-") || normName.includes("planetary")) {
      return "planetaryReducerImage";
    }
    if (normId.startsWith("ind-mot-direct") || normId.startsWith("ind-mot-frameless") || normId.includes("rotary")) {
      return "rotaryActuatorImage";
    }
    if (normId.startsWith("ind-mot-") || normId.startsWith("ind-act-")) {
      return "servoActuatorImage";
    }
    return "planetaryReducerImage";
  }

  return "fallbackProductSvg";
}

// Generate code
const lines: string[] = [];

lines.push(`import heroImage from "@/assets/robotics-hero.jpg";
import componentsImage from "@/assets/robotic-components.jpg";
import armImage from "@/assets/robotic-arm-cell.jpg";
import mobileImage from "@/assets/mobile-robotics.jpg";

// Photographic Product Assets - Mechanical & Motion
import linearActuatorImage from "@/assets/products/linear-actuator.jpg";
import rotaryActuatorImage from "@/assets/products/rotary-actuator.jpg";
import electricActuatorImage from "@/assets/products/electric-actuator.jpg";
import servoActuatorImage from "@/assets/products/servo-actuator.jpg";
import planetaryReducerImage from "@/assets/products/planetary-reducer.jpg";
import harmonicReducerImage from "@/assets/products/harmonic-reducer.jpg";
import cycloidalReducerImage from "@/assets/products/cycloidal-reducer.jpg";
import industrialGearboxImage from "@/assets/products/industrial-gearbox.jpg";
import linearGuidewayImage from "@/assets/products/linear-guideway.jpg";
import precisionBallScrewImage from "@/assets/products/precision-ball-screw.jpg";

// Photographic Product Assets - Mobility
import mecanumWheelImage from "@/assets/products/mecanum-wheel.jpg";
import driveWheelImage from "@/assets/products/drive-wheel.jpg";
import omniWheelImage from "@/assets/products/omni-wheel.jpg";
import mobileModuleImage from "@/assets/products/mobile-module.jpg";

// Photographic Product Assets - Robotic Arms
import scaraRobotImage from "@/assets/products/scara-robot.jpg";
import weldingRobotImage from "@/assets/products/welding-robot.jpg";
import cobotRobotImage from "@/assets/products/cobot-robot.jpg";
import deltaRobotImage from "@/assets/products/delta-robot.jpg";
import palletizingRobotImage from "@/assets/products/palletizing-robot.jpg";

// Photographic Product Assets - Controls & Electronics
import robotControllerImage from "@/assets/products/robot-controller.jpg";
import motionControllerImage from "@/assets/products/motion-controller.jpg";
import servoDriveImage from "@/assets/products/servo-drive.jpg";
import plcAutomationImage from "@/assets/products/plc-automation.jpg";

// Photographic Product Assets - Sensing & Vision
import sensorsFeedbackImage from "@/assets/products/sensors-feedback.jpg";
import vision3dCameraImage from "@/assets/products/vision-3d-camera.jpg";
import forceTorqueSensorImage from "@/assets/products/force-torque-sensor.jpg";
import rotaryEncoderImage from "@/assets/products/rotary-encoder.jpg";

// Photographic Product Assets - End Effectors & Tooling
import roboticGripperImage from "@/assets/products/robotic-gripper.jpg";
import vacuumGripperImage from "@/assets/products/vacuum-gripper.jpg";
import softAdaptiveGripperImage from "@/assets/products/soft-adaptive-gripper.jpg";
import roboticToolChangerImage from "@/assets/products/robotic-tool-changer.jpg";

// Photographic Product Assets - Safety & Intelligent Systems
import safetyLaserScannerImage from "@/assets/products/safety-laser-scanner.jpg";
import safetyLightCurtainImage from "@/assets/products/safety-light-curtain.jpg";
import safetyRadarSensorImage from "@/assets/products/safety-radar-sensor.jpg";
import safetyPlcControllerImage from "@/assets/products/safety-plc-controller.jpg";
import tsnEdgeGatewayImage from "@/assets/products/tsn-edge-gateway.jpg";
import edgeAiComputeImage from "@/assets/products/edge-ai-compute.jpg";

import fallbackProductSvg from "@/assets/products/fallback-product.svg";

export const images = {
  hero: heroImage,
  components: componentsImage,
  arm: armImage,
  mobile: mobileImage,

  // Actuators & Reducers
  linearActuator: linearActuatorImage,
  rotaryActuator: rotaryActuatorImage,
  electricActuator: electricActuatorImage,
  servoActuator: servoActuatorImage,
  planetaryReducer: planetaryReducerImage,
  harmonicReducer: harmonicReducerImage,
  cycloidalReducer: cycloidalReducerImage,
  industrialGearbox: industrialGearboxImage,
  linearGuideway: linearGuidewayImage,
  precisionBallScrew: precisionBallScrewImage,

  // Wheels & Mobility
  driveWheel: driveWheelImage,
  omniWheel: omniWheelImage,
  mecanumWheel: mecanumWheelImage,
  mobileModule: mobileModuleImage,

  // Robots
  scaraRobot: scaraRobotImage,
  sixAxisRobot: armImage,
  cobotRobot: cobotRobotImage,
  deltaRobot: deltaRobotImage,
  weldingRobot: weldingRobotImage,
  palletizingRobot: palletizingRobotImage,

  // Control & Drives
  robotController: robotControllerImage,
  motionController: motionControllerImage,
  servoDrive: servoDriveImage,
  plcAutomation: plcAutomationImage,

  // Sensing & Vision
  sensorsFeedback: sensorsFeedbackImage,
  vision3dCamera: vision3dCameraImage,
  forceTorqueSensor: forceTorqueSensorImage,
  rotaryEncoder: rotaryEncoderImage,

  // End Effectors
  roboticGripper: roboticGripperImage,
  vacuumGripper: vacuumGripperImage,
  softAdaptiveGripper: softAdaptiveGripperImage,
  roboticToolChanger: roboticToolChangerImage,

  // Safety & Intelligent Systems
  safetyLaserScanner: safetyLaserScannerImage,
  safetyLightCurtain: safetyLightCurtainImage,
  safetyRadarSensor: safetyRadarSensorImage,
  safetyPlcController: safetyPlcControllerImage,
  tsnEdgeGateway: tsnEdgeGatewayImage,
  edgeAiCompute: edgeAiComputeImage,

  fallback: fallbackProductSvg,
} as const;

export type ImageKey = keyof typeof images;

/**
 * Explicit product-to-image mapping by Product ID or slug.
 * All 164 canonical products are mapped 100% deterministically to an authentic visual.
 */
export const productToImageMap: Record<string, string> = {
  // Legacy / Direct Slug Aliases
  linear: linearActuatorImage,
  rotary: rotaryActuatorImage,
  electric: electricActuatorImage,
  servo: servoActuatorImage,
  "linear-actuator": linearActuatorImage,
  "rotary-actuator": rotaryActuatorImage,
  "electric-actuator": electricActuatorImage,
  "servo-actuator": servoActuatorImage,
  planetary: planetaryReducerImage,
  harmonic: harmonicReducerImage,
  cycloidal: cycloidalReducerImage,
  gearboxes: industrialGearboxImage,
  "strain-wave": harmonicReducerImage,
  "rv-cycloidal": cycloidalReducerImage,
  "planetary-gearboxes": planetaryReducerImage,
  drive: driveWheelImage,
  omni: omniWheelImage,
  mecanum: mecanumWheelImage,
  "mobile-modules": mobileModuleImage,
  "4-axis": scaraRobotImage,
  "6-axis": armImage,
  collaborative: cobotRobotImage,
  "pick-and-place": deltaRobotImage,
  scara: scaraRobotImage,
  delta: deltaRobotImage,
  cobot: cobotRobotImage,
  assembly: scaraRobotImage,
  welding: weldingRobotImage,
  handling: armImage,
  inspection: cobotRobotImage,
  palletizing: palletizingRobotImage,
  "robot-controllers": robotControllerImage,
  "motion-controllers": motionControllerImage,
  "servo-drives": servoDriveImage,
  "plc-automation": plcAutomationImage,
  "sensors-feedback": sensorsFeedbackImage,
  "sensors-encoders": rotaryEncoderImage,
  "machine-vision": vision3dCameraImage,
  "end-effectors": roboticGripperImage,
  "linear-motion": linearGuidewayImage,
  "mechanical-components": linearGuidewayImage,
  "robotics-safety": safetyPlcControllerImage,
`);

// Add all 164 canonical products explicitly
TOP_LEVEL_CATEGORIES.forEach((cat) => {
  lines.push(`  // Category: ${cat.title} (${cat.id})`);
  cat.groups.forEach((group) => {
    lines.push(`  // Subfamily: ${group.groupName}`);
    group.items.forEach((item) => {
      const imgVar = resolveImageVar(cat.id, group.groupName, item.id, item.name);
      lines.push(`  "${item.id}": ${imgVar},`);
    });
  });
});

lines.push(`};

/**
 * Category fallback map for category overview cards & product family defaults.
 */
export const categoryImageMap: Record<string, string> = {
  // Legacy categories
  actuators: linearActuatorImage,
  "precision-reducers": planetaryReducerImage,
  "robotic-wheels": mecanumWheelImage,
  "robotic-arms": armImage,
  "industrial-robots": weldingRobotImage,
  "control-systems": motionControllerImage,

  // 8 Master Product Taxonomy Categories
  "motion-actuation": planetaryReducerImage,
  "robotic-systems": armImage,
  "mobility-systems": driveWheelImage,
  "control-drives": servoDriveImage,
  "sensing-vision": vision3dCameraImage,
  "end-effectors": roboticGripperImage,
  "tooling-effectors": roboticGripperImage,
  "mechanical-components": linearGuidewayImage,
  "safety-intelligent": safetyLaserScannerImage,
  "safety-ai": safetyLaserScannerImage,
};

/**
 * Resolves a reliable image source for any product, key, or category.
 * Guaranteed never to return undefined or a broken string.
 */
export function getProductImageUrl(
  identifier?: string | { id?: string; slug?: string; image?: string; categorySlug?: string; category?: string; name?: string },
): string {
  if (!identifier) return fallbackProductSvg;

  if (typeof identifier === "string") {
    const norm = identifier.toLowerCase().trim();
    if (productToImageMap[norm]) return productToImageMap[norm];
    if (identifier in images) return images[identifier as ImageKey];
    if (categoryImageMap[norm]) return categoryImageMap[norm];

    // Subfamily keyword matching
    if (norm.includes("laser-scanner") || norm.includes("area-scanner")) return safetyLaserScannerImage;
    if (norm.includes("light-curtain") || norm.includes("safety-curtain")) return safetyLightCurtainImage;
    if (norm.includes("radar") || norm.includes("canopy") || norm.includes("safety-mat")) return safetyRadarSensorImage;
    if (norm.includes("safety-plc") || norm.includes("interlock") || norm.includes("safety-relay")) return safetyPlcControllerImage;
    if (norm.includes("tsn") || norm.includes("gateway") || norm.includes("5g-router") || norm.includes("wifi6")) return tsnEdgeGatewayImage;
    if (norm.includes("edge-ai") || norm.includes("vibration") || norm.includes("power-analyzer")) return edgeAiComputeImage;

    if (norm.includes("3d-vision") || norm.includes("binpicker") || norm.includes("depth-camera") || norm.includes("tof-camera")) return vision3dCameraImage;
    if (norm.includes("force-torque") || norm.includes("load-cell") || norm.includes("wrist-ft")) return forceTorqueSensorImage;
    if (norm.includes("encoder") || norm.includes("resolver") || norm.includes("glass-scale")) return rotaryEncoderImage;

    if (norm.includes("vacuum") || norm.includes("bernoulli") || norm.includes("suction")) return vacuumGripperImage;
    if (norm.includes("soft-gripper") || norm.includes("dexterous") || norm.includes("bionic")) return softAdaptiveGripperImage;
    if (norm.includes("tool-changer") || norm.includes("weld-gun") || norm.includes("spindle") || norm.includes("screwdriving")) return roboticToolChangerImage;
    if (norm.includes("gripper") || norm.includes("effector")) return roboticGripperImage;

    if (norm.includes("ballscrew") || norm.includes("roller-screw") || norm.includes("rack-pinion")) return precisionBallScrewImage;
    if (norm.includes("guideway") || norm.includes("linear-guide") || norm.includes("slide")) return linearGuidewayImage;
    if (norm.includes("coupling") || norm.includes("brake") || norm.includes("gearbox")) return industrialGearboxImage;

    if (norm.includes("scara")) return scaraRobotImage;
    if (norm.includes("cobot")) return cobotRobotImage;
    if (norm.includes("delta")) return deltaRobotImage;
    if (norm.includes("welding")) return weldingRobotImage;
    if (norm.includes("palletizing")) return palletizingRobotImage;
    if (norm.includes("robot-arm") || norm.includes("6axis") || norm.includes("articulated")) return armImage;

    if (norm.includes("mecanum")) return mecanumWheelImage;
    if (norm.includes("omni")) return omniWheelImage;
    if (norm.includes("drive-wheel") || norm.includes("wheel")) return driveWheelImage;
    if (norm.includes("chassis") || norm.includes("amr") || norm.includes("agv")) return mobileModuleImage;

    if (norm.includes("harmonic") || norm.includes("strain-wave") || norm.includes("silk-hat")) return harmonicReducerImage;
    if (norm.includes("cycloid") || norm.includes("rv-reducer") || norm.includes("pin-wheel")) return cycloidalReducerImage;
    if (norm.includes("planetary")) return planetaryReducerImage;
    if (norm.includes("actuator")) return linearActuatorImage;

    return fallbackProductSvg;
  }

  // Object lookup
  if (identifier.id) {
    const norm = identifier.id.toLowerCase().trim();
    if (productToImageMap[norm]) return productToImageMap[norm];
    const prefixImg = getProductImageUrl(norm);
    if (prefixImg !== fallbackProductSvg) return prefixImg;
  }
  if (identifier.slug) {
    const norm = identifier.slug.toLowerCase().trim();
    if (productToImageMap[norm]) return productToImageMap[norm];
    const prefixImg = getProductImageUrl(norm);
    if (prefixImg !== fallbackProductSvg) return prefixImg;
  }
  if (identifier.image && identifier.image in images) {
    return images[identifier.image as ImageKey];
  }
  if (identifier.categorySlug) {
    const norm = identifier.categorySlug.toLowerCase().trim();
    if (categoryImageMap[norm]) return categoryImageMap[norm];
  }
  if (identifier.category) {
    const norm = identifier.category.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
    if (categoryImageMap[norm]) return categoryImageMap[norm];
  }

  return fallbackProductSvg;
}
`);

const targetPath = path.join(__dirname, "../src/lib/images.ts");
fs.writeFileSync(targetPath, lines.join("\n"), "utf-8");
console.log(`Successfully generated updated images.ts with 164 canonical product mappings at: ${targetPath}`);
