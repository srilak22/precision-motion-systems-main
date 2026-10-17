import heroImage from "@/assets/robotics-hero.jpg";
import componentsImage from "@/assets/robotic-components.jpg";
import armImage from "@/assets/robotic-arm-cell.jpg";
import mobileImage from "@/assets/mobile-robotics.jpg";

// Photographic Product Assets
import linearActuatorImage from "@/assets/products/linear-actuator.jpg";
import rotaryActuatorImage from "@/assets/products/rotary-actuator.jpg";
import planetaryReducerImage from "@/assets/products/planetary-reducer.jpg";
import harmonicReducerImage from "@/assets/products/harmonic-reducer.jpg";
import cycloidalReducerImage from "@/assets/products/cycloidal-reducer.jpg";
import mecanumWheelImage from "@/assets/products/mecanum-wheel.jpg";
import driveWheelImage from "@/assets/products/drive-wheel.jpg";
import scaraRobotImage from "@/assets/products/scara-robot.jpg";
import weldingRobotImage from "@/assets/products/welding-robot.jpg";
import cobotRobotImage from "@/assets/products/cobot-robot.jpg";
import deltaRobotImage from "@/assets/products/delta-robot.jpg";
import palletizingRobotImage from "@/assets/products/palletizing-robot.jpg";
import plcAutomationImage from "@/assets/products/plc-automation.jpg";

// Dedicated Engineering Vector Assets (eliminating generic placeholder reuse)
import omniWheelSvg from "@/assets/products/omni-wheel.svg";
import servoDriveSvg from "@/assets/products/servo-drive.svg";
import electricActuatorSvg from "@/assets/products/electric-actuator.svg";
import servoActuatorSvg from "@/assets/products/servo-actuator.svg";
import industrialGearboxSvg from "@/assets/products/industrial-gearbox.svg";
import mobileModuleSvg from "@/assets/products/mobile-module.svg";
import sensorsFeedbackSvg from "@/assets/products/sensors-feedback.svg";
import robotControllerSvg from "@/assets/products/robot-controller.svg";
import motionControllerSvg from "@/assets/products/motion-controller.svg";
import fallbackProductSvg from "@/assets/products/fallback-product.svg";

export const images = {
  hero: heroImage,
  components: componentsImage,
  arm: armImage,
  mobile: mobileImage,
  
  // Actuators
  linearActuator: linearActuatorImage,
  rotaryActuator: rotaryActuatorImage,
  electricActuator: electricActuatorSvg,
  servoActuator: servoActuatorSvg,
  
  // Precision Reducers
  planetaryReducer: planetaryReducerImage,
  harmonicReducer: harmonicReducerImage,
  cycloidalReducer: cycloidalReducerImage,
  industrialGearbox: industrialGearboxSvg,
  
  // Robotic Wheels
  driveWheel: driveWheelImage,
  omniWheel: omniWheelSvg,
  mecanumWheel: mecanumWheelImage,
  mobileModule: mobileModuleSvg,
  
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
  robotController: robotControllerSvg,
  motionController: motionControllerSvg,
  servoDrive: servoDriveSvg,
  plcAutomation: plcAutomationImage,
  sensorsFeedback: sensorsFeedbackSvg,
  
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
  electric: electricActuatorSvg,
  servo: servoActuatorSvg,

  // Domain 2: Precision Reducers
  planetary: planetaryReducerImage,
  harmonic: harmonicReducerImage,
  cycloidal: cycloidalReducerImage,
  gearboxes: industrialGearboxSvg,

  // Domain 3: Robotic Wheels
  drive: driveWheelImage,
  omni: omniWheelSvg,
  mecanum: mecanumWheelImage,
  "mobile-modules": mobileModuleSvg,

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
  "robot-controllers": robotControllerSvg,
  "motion-controllers": motionControllerSvg,
  "servo-drives": servoDriveSvg,
  "plc-automation": plcAutomationImage,
  "sensors-feedback": sensorsFeedbackSvg,
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
