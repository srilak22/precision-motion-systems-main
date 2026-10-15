import heroImage from "@/assets/robotics-hero.jpg";
import componentsImage from "@/assets/robotic-components.jpg";
import armImage from "@/assets/robotic-arm-cell.jpg";
import mobileImage from "@/assets/mobile-robotics.jpg";

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

export const images = {
  hero: heroImage,
  components: componentsImage,
  arm: armImage,
  mobile: mobileImage,
  linearActuator: linearActuatorImage,
  rotaryActuator: rotaryActuatorImage,
  planetaryReducer: planetaryReducerImage,
  harmonicReducer: harmonicReducerImage,
  cycloidalReducer: cycloidalReducerImage,
  mecanumWheel: mecanumWheelImage,
  driveWheel: driveWheelImage,
  scaraRobot: scaraRobotImage,
  weldingRobot: weldingRobotImage,
  cobotRobot: cobotRobotImage,
  deltaRobot: deltaRobotImage,
  palletizingRobot: palletizingRobotImage,
  plcAutomation: plcAutomationImage,
} as const;

export type ImageKey = keyof typeof images;

