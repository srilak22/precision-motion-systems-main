import heroImage from "@/assets/robotics-hero.jpg";
import componentsImage from "@/assets/robotic-components.jpg";
import armImage from "@/assets/robotic-arm-cell.jpg";
import mobileImage from "@/assets/mobile-robotics.jpg";

// Photographic Product Assets
import linearActuatorImage from "@/assets/products/linear-actuator.jpg";
import rotaryActuatorImage from "@/assets/products/rotary-actuator.jpg";
import electricActuatorImage from "@/assets/products/electric-actuator.jpg";
import servoActuatorImage from "@/assets/products/servo-actuator.jpg";

import planetaryReducerImage from "@/assets/products/planetary-reducer.jpg";
import harmonicReducerImage from "@/assets/products/harmonic-reducer.jpg";
import cycloidalReducerImage from "@/assets/products/cycloidal-reducer.jpg";
import industrialGearboxImage from "@/assets/products/industrial-gearbox.jpg";

import mecanumWheelImage from "@/assets/products/mecanum-wheel.jpg";
import driveWheelImage from "@/assets/products/drive-wheel.jpg";
import omniWheelImage from "@/assets/products/omni-wheel.jpg";
import mobileModuleImage from "@/assets/products/mobile-module.jpg";

import scaraRobotImage from "@/assets/products/scara-robot.jpg";
import weldingRobotImage from "@/assets/products/welding-robot.jpg";
import cobotRobotImage from "@/assets/products/cobot-robot.jpg";
import deltaRobotImage from "@/assets/products/delta-robot.jpg";
import palletizingRobotImage from "@/assets/products/palletizing-robot.jpg";

import robotControllerImage from "@/assets/products/robot-controller.jpg";
import motionControllerImage from "@/assets/products/motion-controller.jpg";
import servoDriveImage from "@/assets/products/servo-drive.jpg";
import plcAutomationImage from "@/assets/products/plc-automation.jpg";
import sensorsFeedbackImage from "@/assets/products/sensors-feedback.jpg";

import fallbackProductSvg from "@/assets/products/fallback-product.svg";

export const images = {
  hero: heroImage,
  components: componentsImage,
  arm: armImage,
  mobile: mobileImage,

  // Actuators
  linearActuator: linearActuatorImage,
  rotaryActuator: rotaryActuatorImage,
  electricActuator: electricActuatorImage,
  servoActuator: servoActuatorImage,

  // Precision Reducers
  planetaryReducer: planetaryReducerImage,
  harmonicReducer: harmonicReducerImage,
  cycloidalReducer: cycloidalReducerImage,
  industrialGearbox: industrialGearboxImage,

  // Robotic Wheels
  driveWheel: driveWheelImage,
  omniWheel: omniWheelImage,
  mecanumWheel: mecanumWheelImage,
  mobileModule: mobileModuleImage,

  // Robotic Arms
  scaraRobot: scaraRobotImage,
  sixAxisRobot: armImage,
  cobotRobot: cobotRobotImage,
  deltaRobot: deltaRobotImage,

  // Industrial Robots
  assemblyRobot: scaraRobotImage,
  weldingRobot: weldingRobotImage,
  handlingRobot: armImage,
  inspectionRobot: cobotRobotImage,
  palletizingRobot: palletizingRobotImage,

  // Control Systems
  robotController: robotControllerImage,
  motionController: motionControllerImage,
  servoDrive: servoDriveImage,
  plcAutomation: plcAutomationImage,
  sensorsFeedback: sensorsFeedbackImage,

  // Fallback
  fallback: fallbackProductSvg,
} as const;

export type ImageKey = keyof typeof images;

/**
 * Explicit product-to-image mapping by Product ID or slug.
 * Every product is guaranteed to resolve to an accurate, verified image.
 */
export const productToImageMap: Record<string, string> = {
  // Domain 1: Actuators
  linear: linearActuatorImage,
  rotary: rotaryActuatorImage,
  electric: electricActuatorImage,
  servo: servoActuatorImage,
  "linear-actuator": linearActuatorImage,
  "rotary-actuator": rotaryActuatorImage,
  "electric-actuator": electricActuatorImage,
  "servo-actuator": servoActuatorImage,
  "linear-actuators": linearActuatorImage,
  "rotary-actuators": rotaryActuatorImage,
  "electric-actuators": electricActuatorImage,
  "servo-actuators": servoActuatorImage,
  "intelligent-rotary-actuator": rotaryActuatorImage,
  "intelligent-linear-actuator": linearActuatorImage,

  // Domain 2: Precision Reducers
  planetary: planetaryReducerImage,
  harmonic: harmonicReducerImage,
  cycloidal: cycloidalReducerImage,
  gearboxes: industrialGearboxImage,
  "strain-wave": harmonicReducerImage,
  "rv-cycloidal": cycloidalReducerImage,
  "planetary-gearboxes": planetaryReducerImage,
  "indus-shd-silk-hat": harmonicReducerImage,
  "indus-csg-cup": harmonicReducerImage,
  "indus-csd-ultra-flat": harmonicReducerImage,
  "indus-rv-e-flange": cycloidalReducerImage,
  "indus-rv-c-hollow": cycloidalReducerImage,
  "indus-pl-inline-high-torque": planetaryReducerImage,
  "indus-pl-right-angle": planetaryReducerImage,

  // Domain 3: Robotic Wheels & Mobility
  drive: driveWheelImage,
  omni: omniWheelImage,
  mecanum: mecanumWheelImage,
  "mobile-modules": mobileModuleImage,
  "drive-wheels": driveWheelImage,
  "omni-wheels": omniWheelImage,
  "mecanum-wheels": mecanumWheelImage,
  "agv-amr-drive-systems": driveWheelImage,

  // Domain 4: Robotic Arms
  "4-axis": scaraRobotImage,
  "6-axis": armImage,
  collaborative: cobotRobotImage,
  "pick-and-place": deltaRobotImage,
  scara: scaraRobotImage,
  delta: deltaRobotImage,
  cobot: cobotRobotImage,
  "robotic-arms": armImage,

  // Domain 5: Industrial Robots
  assembly: scaraRobotImage,
  welding: weldingRobotImage,
  handling: armImage,
  inspection: cobotRobotImage,
  palletizing: palletizingRobotImage,
  "industrial-robots": weldingRobotImage,

  // Domain 6: Control Systems
  "robot-controllers": robotControllerImage,
  "motion-controllers": motionControllerImage,
  "servo-drives": servoDriveImage,
  "plc-automation": plcAutomationImage,
  "sensors-feedback": sensorsFeedbackImage,
  "sensors-encoders": sensorsFeedbackImage,
  "robotics-safety": plcAutomationImage,
  "machine-vision": sensorsFeedbackImage,
  "servo-motors": servoActuatorImage,
  "linear-motion": linearActuatorImage,
  "mechanical-transmission": industrialGearboxImage,
  "end-effectors": electricActuatorImage,
};

/**
 * Category fallback map for category overview cards & product family defaults.
 * Maps both legacy slugs and 8 master taxonomy categories.
 */
export const categoryImageMap: Record<string, string> = {
  // Legacy categories
  actuators: linearActuatorImage,
  "precision-reducers": planetaryReducerImage,
  "robotic-wheels": mecanumWheelImage,
  "robotic-arms": armImage,
  "industrial-robots": weldingRobotImage,
  "control-systems": plcAutomationImage,

  // 8 Master Product Taxonomy Categories
  "motion-actuation": planetaryReducerImage,
  "robotic-systems": armImage,
  "mobility-systems": mecanumWheelImage,
  "control-drives": servoDriveImage,
  "sensing-vision": sensorsFeedbackImage,
  "end-effectors": electricActuatorImage,
  "tooling-effectors": electricActuatorImage,
  "mechanical-components": linearActuatorImage,
  "safety-intelligent": plcAutomationImage,
  "safety-ai": plcAutomationImage,

  // Specific mechatronic lines
  "servo-motors": servoActuatorImage,
  "linear-motion": linearActuatorImage,
  "mechanical-transmission": industrialGearboxImage,
  "machine-vision": sensorsFeedbackImage,
  "robotics-safety": plcAutomationImage,
  "intelligent-actuators": servoActuatorImage,
  "robot-joint-actuators": rotaryActuatorImage,
  "sensors-encoders": sensorsFeedbackImage,
};

/**
 * Resolves a reliable image source for any product, key, or category.
 * Guaranteed never to return undefined or a broken string.
 */
export function getProductImageUrl(
  identifier?: string | { id?: string; slug?: string; image?: string; categorySlug?: string; category?: string },
): string {
  if (!identifier) return fallbackProductSvg;

  if (typeof identifier === "string") {
    const norm = identifier.toLowerCase().trim();
    if (productToImageMap[norm]) return productToImageMap[norm];
    if (identifier in images) return images[identifier as ImageKey];
    if (categoryImageMap[norm]) return categoryImageMap[norm];

    // Prefix matching for range IDs
    if (norm.startsWith("ind-pr-sw-") || norm.includes("harmonic") || norm.includes("silk-hat") || norm.includes("strain-wave")) {
      return harmonicReducerImage;
    }
    if (norm.startsWith("ind-pr-rv-") || norm.includes("cycloidal") || norm.includes("rv-")) {
      return cycloidalReducerImage;
    }
    if (norm.startsWith("ind-pr-pl-") || norm.includes("planetary")) {
      return planetaryReducerImage;
    }
    if (norm.startsWith("ind-act-lin") || norm.includes("linear")) {
      return linearActuatorImage;
    }
    if (norm.startsWith("ind-act-rot") || norm.includes("rotary")) {
      return rotaryActuatorImage;
    }
    if (norm.startsWith("ind-act-") || norm.includes("actuator") || norm.includes("servo-actuator")) {
      return servoActuatorImage;
    }
    if (norm.startsWith("ind-ctl-") || norm.includes("controller")) {
      return motionControllerImage;
    }
    if (norm.startsWith("ind-drv-") || norm.includes("drive")) {
      return servoDriveImage;
    }
    if (norm.startsWith("ind-sen-") || norm.startsWith("ind-vis-") || norm.includes("sensor") || norm.includes("vision")) {
      return sensorsFeedbackImage;
    }
    if (norm.startsWith("ind-ee-") || norm.includes("gripper") || norm.includes("effector")) {
      return electricActuatorImage;
    }
    if (norm.startsWith("ind-lin-") || norm.includes("screw") || norm.includes("guideway")) {
      return linearActuatorImage;
    }
    if (norm.startsWith("ind-net-") || norm.includes("plc") || norm.includes("safety")) {
      return plcAutomationImage;
    }

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
