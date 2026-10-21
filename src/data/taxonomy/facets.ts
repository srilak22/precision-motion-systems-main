/**
 * INDUS Total Robotics Taxonomy — Independent Classification Facets
 *
 * Provides the orthogonal, multi-dimensional classification taxonomy
 * allowing any robotic entity to be discovered through multiple facets
 * while maintaining a single canonical data record.
 */

export interface TaxonomyFacetOption {
  id: string;
  label: string;
  description: string;
  shortCode: string;
  badgeColor?: string;
}

export interface TaxonomyFacet {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  iconName: string;
  options: TaxonomyFacetOption[];
}

export const TAXONOMY_FACETS: Record<string, TaxonomyFacet> = {
  morphology: {
    id: "morphology",
    title: "Mechanical Morphology",
    shortTitle: "Morphology",
    description: "Physical kinematic structure, joint arrangement, and structural body configuration.",
    iconName: "Cpu",
    options: [
      {
        id: "articulated-arm",
        label: "Articulated Arm (Serial Kinematics)",
        description: "Revolute serial joints providing 4 to 7 degrees of freedom, human-arm-like dexterity.",
        shortCode: "ARM-SER",
      },
      {
        id: "scara",
        label: "SCARA (Selective Compliance)",
        description: "Two parallel revolute joints in horizontal plane plus vertical linear axis, high speed.",
        shortCode: "SCARA",
      },
      {
        id: "cartesian-gantry",
        label: "Cartesian & Gantry (Linear Axes)",
        description: "Orthogonal prismatic joints (X-Y-Z rectilinear coordinate workspace), high rigidity.",
        shortCode: "CART-GAN",
      },
      {
        id: "delta-parallel",
        label: "Delta & Parallel Kinematic Machines",
        description: "Closed-loop kinematic chains with stationary base-mounted actuators, ultra-high acceleration.",
        shortCode: "DELTA-PAR",
      },
      {
        id: "bipedal-humanoid",
        label: "Bipedal Humanoid",
        description: "Dual-leg articulated kinematic chain with torso, arms, and anthropomorphic proportions.",
        shortCode: "BIPED-HUM",
      },
      {
        id: "wheeled-humanoid",
        label: "Wheeled Humanoid",
        description: "Anthropomorphic dual-arm upper torso mounted on self-balancing or omnidirectional wheeled base.",
        shortCode: "WHEEL-HUM",
      },
      {
        id: "quadruped-legged",
        label: "Quadruped / Legged Chassis",
        description: "Four articulated multi-DoF legs enabling dynamic gait, trotting, and stair traversal.",
        shortCode: "QUAD-LEG",
      },
      {
        id: "tracked-crawler",
        label: "Tracked / Continuous Tread",
        description: "Dual continuous caterpillar treads for low ground bearing pressure over soft/rugged ground.",
        shortCode: "TRACK-CRW",
      },
      {
        id: "wheeled-platform",
        label: "Wheeled Mobile Chassis",
        description: "Differential, Ackermann, or omnidirectional Mecanum industrial mobile platform.",
        shortCode: "WHEEL-MOB",
      },
      {
        id: "multirotor-airframe",
        label: "Multirotor Airframe",
        description: "4, 6, or 8 vertical lift brushless motor rotors providing omnidirectional flight hovering.",
        shortCode: "AERO-MULTI",
      },
      {
        id: "fixed-wing-vtol",
        label: "Fixed-Wing / Hybrid VTOL",
        description: "Aerodynamic lift wings combined with vertical lift rotors for high endurance transition.",
        shortCode: "AERO-VTOL",
      },
      {
        id: "subsea-pressure-hull",
        label: "Subsea Pressure Hull & Frame",
        description: "Neutral-buoyancy syntactic foam block with tubular frame and multi-axis vectored thrusters.",
        shortCode: "SUB-HULL",
      },
      {
        id: "specialised-kinematics",
        label: "Specialised Kinematics / Mechanism",
        description: "Custom mechanisms including robotic exoskeletons, cable-driven systems, and serpentine arms.",
        shortCode: "SPEC-MECH",
      },
    ],
  },

  mobility: {
    id: "mobility",
    title: "Mobility & Locomotion",
    shortTitle: "Mobility",
    description: "Method by which the robot displaces itself or remains statically referenced in its work envelope.",
    iconName: "Move3d",
    options: [
      {
        id: "stationary-fixed",
        label: "Stationary / Fixed Base",
        description: "Bolted to floor, pedestal, wall, or ceiling; operates within fixed spherical/cylindrical envelope.",
        shortCode: "MOB-FIX",
      },
      {
        id: "linear-seventh-axis",
        label: "Track-Mounted (Linear 7th Axis)",
        description: "Mounted on high-rigidity linear transfer guide or overhead gantry track to extend reach.",
        shortCode: "MOB-7AXIS",
      },
      {
        id: "differential-drive",
        label: "Differential Wheel Drive",
        description: "Two independent drive wheels plus passive casters, rotates about central axle point.",
        shortCode: "MOB-DIFF",
      },
      {
        id: "omnidirectional-mecanum",
        label: "Omnidirectional / Mecanum Drive",
        description: "Independent 4-wheel angled rollers enabling instantaneous translation in any direction & spin.",
        shortCode: "MOB-OMNI",
      },
      {
        id: "steered-traction",
        label: "Steered Traction / Counterbalance",
        description: "Industrial drive wheel with electric steering actuator, heavy load tugger & forklift topology.",
        shortCode: "MOB-STEER",
      },
      {
        id: "dynamic-legged",
        label: "Dynamic Legged Gait (Walking / Trotting)",
        description: "Whole-body dynamic balance with ground reaction force control over stairs, rocks, and obstacles.",
        shortCode: "MOB-LEG",
      },
      {
        id: "tracked-tread",
        label: "Tracked / Continuous Crawler",
        description: "Independent left/right track skid-steering over steep inclines, mud, rubble, and pipeline risers.",
        shortCode: "MOB-TRK",
      },
      {
        id: "aerial-rotary",
        label: "Aerial Rotary Flight",
        description: "Aerodynamic thrust vectoring in 6 degrees of freedom within 3D airspace.",
        shortCode: "MOB-AIR",
      },
      {
        id: "underwater-vectored",
        label: "Subsea Vectored Thruster",
        description: "Hydrodynamic propulsion in 6-DoF utilizing bi-directional brushless magnetic thrusters.",
        shortCode: "MOB-SUB",
      },
    ],
  },

  environment: {
    id: "environment",
    title: "Operating Environment",
    shortTitle: "Environment",
    description: "Physical atmospheric and operational setting in which the system is certified to function.",
    iconName: "Factory",
    options: [
      {
        id: "factory-floor",
        label: "Industrial Factory & Production Cell",
        description: "Standard industrial ambient conditions (0–45°C, IP54/IP65, EMI industrial hardening).",
        shortCode: "ENV-FACT",
      },
      {
        id: "cleanroom-sterile",
        label: "Cleanroom & Sterile Environment",
        description: "ISO 14644-1 Class 1 to Class 5 cleanrooms, medical GMP, low-outgassing seals, food washdown.",
        shortCode: "ENV-CLN",
      },
      {
        id: "warehouse-logistics",
        label: "Indoor Warehouse & Logistics Hub",
        description: "Flat industrial concrete flooring, dynamic human/vehicle mixed traffic, rack aisle navigation.",
        shortCode: "ENV-WHS",
      },
      {
        id: "paved-outdoor",
        label: "Paved Outdoor & Industrial Campus",
        description: "Asphalt, concrete ramps, curb transitions, variable daylight, rain resistance (IP65/IP66).",
        shortCode: "ENV-OUT-PAV",
      },
      {
        id: "rugged-offroad",
        label: "Rugged Off-Road & Unstructured Terrain",
        description: "Gravel, mud, vegetation, pipeline easements, petrochemical yards, ATEX explosive zones.",
        shortCode: "ENV-RUG-OFF",
      },
      {
        id: "open-airspace",
        label: "Open Airspace & Confined Vessels",
        description: "Atmospheric wind gusts, GPS-denied boiler/tank internals, high-voltage substation vicinity.",
        shortCode: "ENV-AIR",
      },
      {
        id: "marine-subsea",
        label: "Marine & Deep Subsea",
        description: "Hyperbaric pressure up to 600 bar (6,000 m depth), saline corrosion, zero natural illumination.",
        shortCode: "ENV-SUBSEA",
      },
      {
        id: "underground-mine",
        label: "Underground Mine & Hazardous Tunnel",
        description: "Heavy dust, explosive methane/coal dust atmosphere, complete GPS deprivation, rock falls.",
        shortCode: "ENV-MINE",
      },
      {
        id: "clinical-or",
        label: "Clinical Operating Room & Patient Care",
        description: "Sterile drape interfaces, low acoustic noise, electrical isolation IEC 60601-1 CF type.",
        shortCode: "ENV-CLINIC",
      },
    ],
  },

  domain: {
    id: "domain",
    title: "Application Domain",
    shortTitle: "Domain",
    description: "Industry vertical or operational sector where the system delivers economic value.",
    iconName: "Briefcase",
    options: [
      {
        id: "manufacturing-assembly",
        label: "Manufacturing & Precision Assembly",
        description: "Automotive, electronics, metal fabrication, white goods, and high-precision assembly lines.",
        shortCode: "DOM-MFG",
      },
      {
        id: "logistics-warehousing",
        label: "Logistics, Warehousing & Fulfillment",
        description: "E-commerce fulfillment, automated pallet handling, sorting, case picking, cross-docking.",
        shortCode: "DOM-LOG",
      },
      {
        id: "inspection-maintenance",
        label: "Inspection, NDT & Asset Integrity",
        description: "Petrochemical tanks, power transmission towers, wind turbines, bridges, aerospace hulls.",
        shortCode: "DOM-INSP",
      },
      {
        id: "healthcare-surgery",
        label: "Healthcare, Surgical & Rehabilitation",
        description: "Minimally invasive laparoscopic surgery, orthopedic joint replacement, patient gait therapy.",
        shortCode: "DOM-MED",
      },
      {
        id: "agritech-forestry",
        label: "Agritech, Farming & Forestry",
        description: "Selective fruit harvesting, autonomous crop spraying, laser weeding, tree felling, dairy.",
        shortCode: "DOM-AGRI",
      },
      {
        id: "construction-mining",
        label: "Construction, Tunneling & Heavy Mining",
        description: "Autonomous haul trucks, 3D concrete printing, robotic rebar tying, explosive shotcreting.",
        shortCode: "DOM-MINE",
      },
      {
        id: "energy-subsea",
        label: "Energy, Offshore & Subsea Intervention",
        description: "Subsea wellhead valve operation, subsea cable laying, offshore wind foundation survey.",
        shortCode: "DOM-OFFSHORE",
      },
      {
        id: "defense-security",
        label: "Defense, Public Safety & Disaster Response",
        description: "EOD bomb disposal, perimeter security patrol, hazardous chemical reconnaissance.",
        shortCode: "DOM-DEF",
      },
      {
        id: "laboratory-automation",
        label: "Laboratory & High-Throughput Screening",
        description: "Pharmaceutical drug discovery, microplate handling, automated pipette fluid dispensing.",
        shortCode: "DOM-LAB",
      },
    ],
  },

  capability: {
    id: "capability",
    title: "Functional Capability",
    shortTitle: "Capability",
    description: "Primary physical action or task process executed by the robotic system.",
    iconName: "Zap",
    options: [
      {
        id: "high-speed-pick-place",
        label: "High-Speed Pick & Place / Sorting",
        description: "Cycle times <0.4s with accelerations exceeding 10g, precision delta and SCARA handling.",
        shortCode: "CAP-PICK",
      },
      {
        id: "precision-welding-dispensing",
        label: "Precision Welding & Fluid Dispensing",
        description: "Continuous trajectory path following within ±0.05 mm for seam sealing, arc/laser welding.",
        shortCode: "CAP-WELD",
      },
      {
        id: "palletising-heavy-handling",
        label: "Palletising & Heavy Payload Handling",
        description: "Multi-axis manipulation of 50 kg to 2,000 kg payloads, bag handling, depalletising.",
        shortCode: "CAP-HEAVY",
      },
      {
        id: "slam-navigation-transport",
        label: "Autonomous SLAM Navigation & Transport",
        description: "Point-to-point dynamic path planning, natural feature LiDAR localization, obstacle detour.",
        shortCode: "CAP-TRANS",
      },
      {
        id: "extreme-obstacle-traversal",
        label: "Extreme Obstacle & Rough Terrain Traversal",
        description: "Navigating stairs, mud, pipeline racks, collapsed structures, and steep rubble inclines.",
        shortCode: "CAP-ROUGH",
      },
      {
        id: "deep-water-subsea-intervention",
        label: "Deep-Water Intervention & Tooling",
        description: "Hot-stab hydraulic insertion, valve torque tool operation, CP probe cathodic testing at depth.",
        shortCode: "CAP-SUBSEA",
      },
      {
        id: "bimanual-dexterous-manipulation",
        label: "High-DoF Bi-Manual Dexterous Manipulation",
        description: "Coordinated dual-arm manipulation with tactile multi-fingered grasping of flexible objects.",
        shortCode: "CAP-DEXT",
      },
      {
        id: "micro-precision-surgery",
        label: "Micro-Precision Surgical Motion",
        description: "Sub-millimeter tremor-filtered motion scaling inside human tissue and restricted cavities.",
        shortCode: "CAP-SURG",
      },
      {
        id: "radiometric-aerial-scanning",
        label: "Radiometric & Confined-Space Aerial Scanning",
        description: "LiDAR 3D point cloud generation, photogrammetry, ultrasonic thickness inspection aloft.",
        shortCode: "CAP-SCAN",
      },
    ],
  },

  autonomy: {
    id: "autonomy",
    title: "Autonomy & Human Supervision",
    shortTitle: "Autonomy",
    description: "Level of decision-making independence and safety interaction with human operators.",
    iconName: "Shield",
    options: [
      {
        id: "teleoperated-in-loop",
        label: "Teleoperated / Human-in-the-Loop",
        description: "Real-time master-slave console or umbilical joystick control with visual & haptic feedback.",
        shortCode: "AUTO-TELE",
      },
      {
        id: "collaborative-pfl",
        label: "Collaborative (Power & Force Limited)",
        description: "ISO/TS 15066 safety contact monitoring enabling direct cageless human-robot teamwork.",
        shortCode: "AUTO-COBOT",
      },
      {
        id: "supervised-semi-autonomous",
        label: "Supervised Semi-Autonomous / Waypoints",
        description: "System plans local trajectory within predefined bounds; human supervises exceptions.",
        shortCode: "AUTO-SEMI",
      },
      {
        id: "goal-directed-autonomous",
        label: "Goal-Directed Autonomous (Dynamic SLAM)",
        description: "Accepts high-level missions (e.g. pick tote at Loc A, deliver to Loc B); plans path in real time.",
        shortCode: "AUTO-GOAL",
      },
      {
        id: "fully-autonomous-adaptive",
        label: "Fully Autonomous / Dynamic Adaptive",
        description: "Continuous real-time perception, machine learning state estimation, and dynamic re-planning.",
        shortCode: "AUTO-FULL",
      },
    ],
  },

  manipulation: {
    id: "manipulation",
    title: "Manipulation Capability",
    shortTitle: "Manipulation",
    description: "Mechanism and degrees of freedom dedicated to grasping, tooling, or physical interaction.",
    iconName: "Wrench",
    options: [
      {
        id: "iso-tool-flange",
        label: "ISO 9409-1 Robot Tool Flange",
        description: "Mechanical bolt circle with locating dowel pin for pneumatic/electric industrial grippers.",
        shortCode: "MAN-FLANGE",
      },
      {
        id: "dexterous-hand",
        label: "Anthropomorphic Dexterous Multi-Finger Hand",
        description: "3 to 5 articulated fingers with embedded tactile pressure arrays, active tendon actuation.",
        shortCode: "MAN-HAND",
      },
      {
        id: "vacuum-suction-matrix",
        label: "Vacuum Suction & Bellows Matrix",
        description: "Multi-cup venturi vacuum or high-flow regenerative turbine for porous/corrugated cartons.",
        shortCode: "MAN-VAC",
      },
      {
        id: "subsea-heavy-claw",
        label: "Subsea Rate/Master Manipulator Claw",
        description: "5 to 7-function titanium/316SS hydraulic or electric claw with high squeeze force (1.5 kN).",
        shortCode: "MAN-SUBSEA",
      },
      {
        id: "micro-surgical-wrist",
        label: "Micro-Articulated Surgical Wrist",
        description: "7-DoF EndoWrist cable-driven micro-forceps, monopolar shears, and needle drivers.",
        shortCode: "MAN-SURG",
      },
      {
        id: "non-manipulative",
        label: "Non-Manipulative / Sensor-Only Payload",
        description: "Dedicated to locomotion and perception without end-effector manipulation organs.",
        shortCode: "MAN-NONE",
      },
    ],
  },

  deployment: {
    id: "deployment",
    title: "Deployment Architecture",
    shortTitle: "Deployment",
    description: "System integration topology, communications bus, and plant-level supervisory hierarchy.",
    iconName: "Layers",
    options: [
      {
        id: "workcell-integrated",
        label: "Dedicated Workcell with Safety PLC",
        description: "Enclosed workcell with interlocked light curtains, EtherCAT/PROFINET IO, hardwired safety.",
        shortCode: "DEP-CELL",
      },
      {
        id: "fleet-managed-vda5050",
        label: "Fleet Orchestrated (VDA 5050 / WES / WMS)",
        description: "Fleet dispatcher over Wi-Fi 6 / Private 5G coordinating routes, traffic, and battery charging.",
        shortCode: "DEP-FLEET",
      },
      {
        id: "tethered-console",
        label: "Tethered Surface / Pilot Console",
        description: "High-voltage umbilical cable delivering power and fiber-optic telemetry to remote operator.",
        shortCode: "DEP-TETHER",
      },
      {
        id: "edge-ai-standalone",
        label: "Edge AI Standalone Embedded",
        description: "Self-contained onboard compute (NVIDIA Jetson / x86 RTOS) running local SLAM and safety logic.",
        shortCode: "DEP-EDGE",
      },
      {
        id: "cloud-swarm",
        label: "Cloud-Orchestrated Swarm System",
        description: "Distributed swarm agents sharing collective occupancy maps, coordinated task allocations.",
        shortCode: "DEP-SWARM",
      },
    ],
  },
};
