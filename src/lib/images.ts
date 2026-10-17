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

  // Domain 2: Precision Reducers
  planetary: planetaryReducerImage,
  harmonic: harmonicReducerImage,
  cycloidal: cycloidalReducerImage,
  gearboxes: industrialGearboxImage,

  // Domain 3: Robotic Wheels
  drive: driveWheelImage,
  omni: omniWheelImage,
  mecanum: mecanumWheelImage,
  "mobile-modules": mobileModuleImage,

  // Domain 4: Robotic Arms
  "4-axis": scaraRobotImage,
  "6-axis": armImage,
  collaborative: cobotRobotImage,
  "pick-and-place": deltaRobotImage,

  // Domain 5: Industrial Robots
  assembly: scaraRobotImage,
  welding: weldingRobotImage,
  handling: armImage,
  inspection: cobotRobotImage,
  palletizing: palletizingRobotImage,

  // Domain 6: Control Systems
  "robot-controllers": robotControllerImage,
  "motion-controllers": motionControllerImage,
  "servo-drives": servoDriveImage,
  "plc-automation": plcAutomationImage,
  "sensors-feedback": sensorsFeedbackImage,
};

/**
 * Category fallback map for category overview cards.
 */
export const categoryImageMap: Record<string, string> = {
  actuators: linearActuatorImage,
  "precision-reducers": planetaryReducerImage,
  "robotic-wheels": mecanumWheelImage,
  "robotic-arms": armImage,
  "industrial-robots": weldingRobotImage,
  "control-systems": plcAutomationImage,
};

/**
 * Resolves a reliable image source for any product, key, or category.
 * Guaranteed never to return undefined or a broken string.
 */
export function getProductImageUrl(
  identifier?: string | { id?: string; slug?: string; image?: string; categorySlug?: string },
): string {
  if (!identifier) return fallbackProductSvg;

  if (typeof identifier === "string") {
    // Check product map
    if (productToImageMap[identifier]) return productToImageMap[identifier];
    // Check images dictionary
    if (identifier in images) return images[identifier as ImageKey];
    // Check category map
    if (categoryImageMap[identifier]) return categoryImageMap[identifier];
    return fallbackProductSvg;
  }

  // Object lookup
  if (identifier.id) {
    const img = productToImageMap[identifier.id];
    if (img) return img;
  }
  if (identifier.slug) {
    const img = productToImageMap[identifier.slug];
    if (img) return img;
  }
  if (identifier.image && identifier.image in images) {
    return images[identifier.image as ImageKey];
  }
  if (identifier.categorySlug) {
    const img = categoryImageMap[identifier.categorySlug];
    if (img) return img;
  }

  return fallbackProductSvg;
}
