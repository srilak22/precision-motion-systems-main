import heroImage from "@/assets/robotics-hero.jpg";
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
  assemblyRobot: scaraRobotImage,
  inspectionRobot: cobotRobotImage,
  handlingRobot: armImage,

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

  // Category: Motion & Actuation (motion-actuation)
  // Subfamily: Strain-Wave Harmonic Reducers
  "ind-pr-sw-cup-set": harmonicReducerImage,
  "ind-pr-sw-hollow-unit": harmonicReducerImage,
  "ind-pr-sw-flat-pancake": harmonicReducerImage,
  "ind-pr-sw-silk-hat": harmonicReducerImage,
  "ind-pr-sw-micro": harmonicReducerImage,
  "ind-pr-sw-cryo-vacuum": harmonicReducerImage,
  // Subfamily: RV & High-Precision Cycloidal Drives
  "ind-pr-rv-solid-e": cycloidalReducerImage,
  "ind-pr-rv-hollow-c": cycloidalReducerImage,
  "ind-pr-rv-compact-n": cycloidalReducerImage,
  "ind-pr-rv-turntable": cycloidalReducerImage,
  "ind-pr-cyc-standard": cycloidalReducerImage,
  "ind-pr-cyc-precision": cycloidalReducerImage,
  // Subfamily: Precision Planetary & Hypoid Gearboxes
  "ind-pr-pl-helical-low": planetaryReducerImage,
  "ind-pr-pl-right-angle": planetaryReducerImage,
  "ind-pr-pl-flange-output": planetaryReducerImage,
  "ind-pr-pl-economy": planetaryReducerImage,
  "ind-pr-pl-3stage-high-ratio": planetaryReducerImage,
  "ind-pr-pl-hygienic": planetaryReducerImage,
  // Subfamily: Servo Motors & Joint Actuators
  "ind-mot-pmsm-low-inertia": cycloidalReducerImage,
  "ind-mot-pmsm-med-inertia": cycloidalReducerImage,
  "ind-mot-frameless-torque": rotaryActuatorImage,
  "ind-mot-direct-drive-rotary": rotaryActuatorImage,
  "ind-act-cobot-joint-medium": servoActuatorImage,
  "ind-act-hollow-rotary-table": rotaryActuatorImage,
  // Category: Robotic Systems (robotic-systems)
  // Subfamily: Articulated 6-Axis Industrial Arms
  "ind-rob-6axis-mid": armImage,
  "ind-rob-heavy-foundry": armImage,
  "ind-rob-compact-tabletop": armImage,
  "ind-rob-long-reach": armImage,
  "ind-rob-cleanroom-iso1": armImage,
  // Subfamily: Collaborative Robots (Cobots)
  "ind-rob-cobot-5kg": cobotRobotImage,
  "ind-rob-cobot-10kg": cobotRobotImage,
  "ind-rob-cobot-20kg-pallet": cobotRobotImage,
  "ind-rob-cobot-mobile": cobotRobotImage,
  "ind-rob-cobot-surgical": cobotRobotImage,
  // Subfamily: SCARA & High-Speed Delta Robots
  "ind-rob-scara-standard": scaraRobotImage,
  "ind-rob-scara-long-reach": scaraRobotImage,
  "ind-rob-delta-parallel": deltaRobotImage,
  "ind-rob-delta-ip69k": deltaRobotImage,
  "ind-rob-cartesian-gantry": armImage,
  // Subfamily: Turn-Key Industrial Automation Cells
  "ind-rob-cell-welding": weldingRobotImage,
  "ind-rob-cell-palletizing": palletizingRobotImage,
  "ind-rob-cell-assembly": armImage,
  "ind-rob-cell-machine-tending": armImage,
  "ind-rob-cell-inspection": armImage,
  // Category: Mobility Systems (mobility-systems)
  // Subfamily: In-Hub AGV Drive Wheels
  "ind-mob-drive-standard": driveWheelImage,
  "ind-mob-drive-heavy": driveWheelImage,
  "ind-mob-drive-low-profile": driveWheelImage,
  "ind-mob-drive-differential": driveWheelImage,
  "ind-mob-drive-atex": driveWheelImage,
  // Subfamily: Omnidirectional Mecanum & Omni Wheels
  "ind-mob-mecanum-heavy": mecanumWheelImage,
  "ind-mob-mecanum-compact": mecanumWheelImage,
  "ind-mob-omni-dual-plate": omniWheelImage,
  "ind-mob-omni-precision-al": omniWheelImage,
  "ind-mob-omni-suspended": omniWheelImage,
  // Subfamily: Steering Swerve & Suspension Modules
  "ind-mob-swerve-steer": mobileModuleImage,
  "ind-mob-dual-wheel-castor": mobileModuleImage,
  "ind-mob-suspension-rocker": mobileModuleImage,
  "ind-mob-steering-hub": mobileModuleImage,
  "ind-mob-leveling-suspension": mobileModuleImage,
  // Subfamily: Autonomous Mobile Chassis & Attachments
  "ind-mob-chassis-amr-500": mobileImage,
  "ind-mob-lift-scissor": mobileModuleImage,
  "ind-mob-conveyor-top": mobileModuleImage,
  "ind-mob-charging-inductive": mobileModuleImage,
  "ind-mob-nav-autonomous-kit": mobileModuleImage,
  // Category: Control & Drives (control-drives)
  // Subfamily: Multi-Axis Robot Motion Controllers
  "ind-ctl-ipc-realtime-master": motionControllerImage,
  "ind-ctl-din-rail-embedded-motion": motionControllerImage,
  "ind-ctl-6axis-pendant-cabinet": robotControllerImage,
  "ind-ctl-open-ros2-controller": motionControllerImage,
  "ind-ctl-cnc-gcode-camming": motionControllerImage,
  // Subfamily: Synchronized Kinematics & AMR Cores
  "ind-ctl-amr-fleet-gateway": motionControllerImage,
  "ind-ctl-64axis-ethercat-motion": motionControllerImage,
  "ind-ctl-delta-packaging-kinematics": motionControllerImage,
  "ind-ctl-multi-robot-synchronized": motionControllerImage,
  "ind-ctl-vgr-integrated-engine": motionControllerImage,
  // Subfamily: AC & Low-Voltage DC Servo Drives
  "ind-drv-compact-48v-cobot": servoDriveImage,
  "ind-drv-400v-multi-axis-shared-bus": servoDriveImage,
  "ind-drv-high-resolution-analog-interface": servoDriveImage,
  "ind-drv-integrated-cobot-joint-dual": servoDriveImage,
  "ind-drv-sic-wide-bandgap": servoDriveImage,
  // Subfamily: Safe Motion & Specialized Amplifiers
  "ind-drv-fsoe-safety-drive": servoDriveImage,
  "ind-drv-motor-mounted-ip65": servoDriveImage,
  "ind-drv-direct-drive-torque-amp": servoDriveImage,
  "ind-drv-linear-motor-dual-encoder": servoDriveImage,
  "ind-drv-active-brake-regen-unit": servoDriveImage,
  // Category: Sensing & Vision (sensing-vision)
  // Subfamily: Rotary & Linear Encoders
  "ind-sen-opt-hollow-24bit": sensorsFeedbackImage,
  "ind-sen-dual-track-inductive-kit": forceTorqueSensorImage,
  "ind-sen-heavy-magnetic-multiturn": sensorsFeedbackImage,
  "ind-sen-resolver-commutation-heavy": rotaryEncoderImage,
  "ind-sen-linear-glass-scale": rotaryEncoderImage,
  // Subfamily: Force/Torque & Industrial Proximity
  "ind-sen-6dof-wrist-ft-sensor": sensorsFeedbackImage,
  "ind-sen-joint-torque-spoke-sensor": forceTorqueSensorImage,
  "ind-sen-dynamic-piezo-force-sensor": forceTorqueSensorImage,
  "ind-sen-tactile-matrix-fingertip": forceTorqueSensorImage,
  "ind-sen-weld-immune-inductive": forceTorqueSensorImage,
  // Subfamily: 3D Vision & Spatial Perception
  "ind-vis-3d-structured-light-binpicker": vision3dCameraImage,
  "ind-vis-3d-tof-camera": vision3dCameraImage,
  "ind-vis-3d-flash-lidar": vision3dCameraImage,
  "ind-vis-77ghz-industrial-radar": vision3dCameraImage,
  "ind-vis-telecentric-metrology-lens": vision3dCameraImage,
  // Subfamily: 2D Inspection & Smart Edge Sensors
  "ind-vis-2d-gige-pregius": vision3dCameraImage,
  "ind-vis-4k-linescan-camera": vision3dCameraImage,
  "ind-vis-swir-infrared-camera": vision3dCameraImage,
  "ind-vis-embedded-ai-smart-camera": vision3dCameraImage,
  "ind-vis-barcode-ocr-vision-reader": vision3dCameraImage,
  // Category: End Effectors & Tooling (end-effectors)
  // Subfamily: Electric Precision Grippers
  "ind-ee-parallel-servo-gripper": roboticGripperImage,
  "ind-ee-3finger-centric-chuck": softAdaptiveGripperImage,
  "ind-ee-5finger-dexterous-hand": softAdaptiveGripperImage,
  "ind-ee-soft-bionic-silicone-gripper": softAdaptiveGripperImage,
  "ind-ee-pneumatic-expanding-mandrel": softAdaptiveGripperImage,
  // Subfamily: Vacuum & Non-Contact Handling
  "ind-ee-vacuum-bernoulli-gripper": vacuumGripperImage,
  "ind-ee-electrostatic-soft-gripper": vacuumGripperImage,
  "ind-ee-permanent-electro-magnet": vacuumGripperImage,
  "ind-ee-needle-porous-gripper": vacuumGripperImage,
  "ind-ee-cryo-specimen-vane": vacuumGripperImage,
  // Subfamily: Welding, Cutting & Process Tooling
  "ind-ee-spot-weld-servo-gun": roboticToolChangerImage,
  "ind-ee-laser-seam-tracker-head": roboticToolChangerImage,
  "ind-ee-ultrasonic-cutting-sonotrode": roboticToolChangerImage,
  "ind-ee-laser-cutting-slitting-head": roboticToolChangerImage,
  "ind-ee-blind-riveting-end-effector": roboticToolChangerImage,
  // Subfamily: Tool Changers & Material Dispensing
  "ind-ee-auto-tool-changer-heavy": roboticToolChangerImage,
  "ind-ee-compliance-deburring-spindle": roboticToolChangerImage,
  "ind-ee-screwdriving-auto-feeder": roboticToolChangerImage,
  "ind-ee-hot-melt-micro-extruder": roboticToolChangerImage,
  "ind-ee-heavy-palletizing-fork": roboticToolChangerImage,
  // Category: Mechanical Components (mechanical-components)
  // Subfamily: Linear Guidance & Drive Systems
  "ind-lin-ground-ballscrew-c3": precisionBallScrewImage,
  "ind-lin-roller-caged-guideway": linearGuidewayImage,
  "ind-lin-miniature-cross-roller-slide": linearGuidewayImage,
  "ind-lin-high-speed-roller-screw": precisionBallScrewImage,
  "ind-lin-inverted-roller-actuator": linearGuidewayImage,
  // Subfamily: Linear Bearings & 7th-Axis Motion
  "ind-lin-helical-rack-pinion": precisionBallScrewImage,
  "ind-lin-recirculating-ball-rail": linearGuidewayImage,
  "ind-lin-stainless-washdown-guide": linearGuidewayImage,
  "ind-lin-aerostatic-air-bearing-stage": linearGuidewayImage,
  "ind-lin-telescopic-cantilever-axis": linearGuidewayImage,
  // Subfamily: Precision Bearings & Slew Rings
  "ind-mec-crossed-roller-bearing": industrialGearboxImage,
  "ind-mec-corrosion-proof-crossed-roller": linearGuidewayImage,
  "ind-mec-high-speed-angular-contact-set": linearGuidewayImage,
  "ind-mec-slew-ring-bearing-geared": industrialGearboxImage,
  "ind-mec-ceramic-hybrid-spindle-bearing": industrialGearboxImage,
  // Subfamily: Shaft Couplings & Torque Limiting
  "ind-mec-flexible-disc-pack": industrialGearboxImage,
  "ind-mec-curved-jaw-elastomer": industrialGearboxImage,
  "ind-mec-metal-bellows-coupling": industrialGearboxImage,
  "ind-mec-power-off-safety-brake": industrialGearboxImage,
  "ind-mec-ball-detent-torque-limiter": industrialGearboxImage,
  // Category: Safety & Intelligent Systems (safety-intelligent)
  // Subfamily: Optical Machine Safety & Scanners
  "ind-saf-laser-scanner-dynamic": safetyLaserScannerImage,
  "ind-saf-light-curtain-type4": safetyLightCurtainImage,
  "ind-saf-safety-radar-barrier": safetyRadarSensorImage,
  "ind-saf-overhead-tof-canopy": safetyRadarSensorImage,
  "ind-saf-heavy-safety-mat": safetyRadarSensorImage,
  // Subfamily: Safety Controllers & Interlocks
  "ind-saf-modular-safety-plc": safetyPlcControllerImage,
  "ind-saf-rfid-door-interlock": safetyPlcControllerImage,
  "ind-saf-safe-motion-monitoring-module": safetyPlcControllerImage,
  "ind-saf-force-guided-safety-relay": safetyPlcControllerImage,
  "ind-saf-wireless-estop-pendant": safetyPlcControllerImage,
  // Subfamily: Deterministic TSN & IIoT Gateways
  "ind-net-tsn-managed-switch": tsnEdgeGatewayImage,
  "ind-net-io-link-master-ip67": tsnEdgeGatewayImage,
  "ind-net-opc-ua-tsn-edge-gateway": tsnEdgeGatewayImage,
  "ind-net-industrial-5g-router": tsnEdgeGatewayImage,
  "ind-net-wifi6-industrial-client": tsnEdgeGatewayImage,
  // Subfamily: Edge AI Compute & Condition Monitoring
  "ind-net-edge-ai-inference-box": edgeAiComputeImage,
  "ind-net-vibration-monitoring-node": edgeAiComputeImage,
  "ind-net-motor-power-analyzer-iot": edgeAiComputeImage,
  "ind-net-oil-debris-particle-monitor": edgeAiComputeImage,
  "ind-net-failover-redundant-ring-switch": tsnEdgeGatewayImage,
};

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
