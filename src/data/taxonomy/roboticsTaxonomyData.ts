/**
 * INDUS Total Robotics Taxonomy — Core Data Model & Canonical Entity Store
 *
 * Grounded in:
 * - ISO 8373:2021 (Robotics Vocabulary)
 * - IFR Classification of Industrial & Service Robots
 * - ISO 10218-1/2, ISO/TS 15066, ISO 3691-4:2023, VDA 5050
 *
 * Implements the mentor's Eight Pillars:
 * 01. Humanoid Robots
 * 02. Industrial Robots
 * 03. Mobile Driverless Robots
 * 04. Robotic Mules and Legged/Heavy-Duty UGVs
 * 05. Aerial Robotics
 * 06. Underwater Robotics
 * 07. Logistics and Supply-Chain Robots
 * 08. Autonomous and Specialised Mechanical Systems
 */

const humanoidImg = "/assets/taxonomy/pillar-humanoid.jpg";
const industrialImg = "/assets/taxonomy/pillar-industrial.jpg";
const mobileImg = "/assets/taxonomy/pillar-mobile.jpg";
const leggedMuleImg = "/assets/taxonomy/pillar-legged-mule.jpg";
const aerialImg = "/assets/taxonomy/pillar-aerial.jpg";
const underwaterImg = "/assets/taxonomy/pillar-underwater.jpg";
const logisticsImg = "/assets/taxonomy/pillar-logistics.jpg";
const specialisedImg = "/assets/taxonomy/pillar-specialised.jpg";

export type VerificationState = "verified" | "not-verified" | "not-applicable";

export type ComponentRelationship =
  | "verified compatibility"
  | "general engineering relevance"
  | "requiring validation";

export interface SpecItem {
  parameter: string;
  value: string;
  unit: string;
  operatingConditions: string;
  source: string;
  verificationStatus: VerificationState;
  applicableConfiguration: string;
  subject:
    | "Overview"
    | "Physical Architecture"
    | "Mobility"
    | "Manipulation"
    | "Payload and Performance"
    | "Sensors and Perception"
    | "Control System"
    | "Autonomy"
    | "Power and Energy"
    | "Operating Environment"
    | "Safety and Compliance"
    | "Integration"
    | "Applications"
    | "Resources";
}

export interface ConfigurationVariant {
  configId: string;
  configName: string;
  description: string;
  targetPayload: string;
  primaryDrivetrain: string;
  powerSource: string;
  keyTradeoff: string;
}

export interface OperatingPrincipleData {
  kinematicChain: string;
  actuationTechnology: string;
  controlLoopFrequency: string;
  sensorFusionPipeline: string;
  mathematicalFoundation: string;
  failureModesAndFailsafes: string;
}

export interface LinkedCatalogueComponent {
  componentId: string;
  lineId: string;
  name: string;
  relationshipType: ComponentRelationship;
  notes: string;
}

export interface LinkedApplication {
  applicationId: string;
  name: string;
  domain: string;
  deploymentNotes: string;
}

export interface TaxonomyResource {
  title: string;
  type: "ISO Standard" | "Engineering Guide" | "CAD Specification" | "Whitepaper";
  referenceId: string;
  href?: string;
}

export interface TaxonomySubcategory {
  id: string; // e.g. "subcat:bipedal-humanoid"
  pillarId: string; // e.g. "pillar:humanoid-robots"
  title: string;
  shortTitle: string;
  summary: string;
  definition: string;
  ifrClassification: "Industrial Robot" | "Service Robot - Professional" | "Service Robot - Specialized";
  isoStandardRef: string;
  facets: {
    morphology: string[];
    mobility: string[];
    environment: string[];
    domain: string[];
    capability: string[];
    autonomy: string[];
    manipulation: string[];
    deployment: string[];
  };
  representativeProducts: string[];
  engineeringConsiderations: string[];
  specifications: SpecItem[];
  configurations: ConfigurationVariant[];
  operatingPrinciple: OperatingPrincipleData;
  compatibleComponents: LinkedCatalogueComponent[];
  applications: LinkedApplication[];
  resources: TaxonomyResource[];
}

export interface TaxonomyPillar {
  id: string; // e.g. "pillar:humanoid-robots"
  categoryNumber: string; // "01" through "08"
  title: string;
  shortTitle: string;
  tagline: string;
  definition: string;
  governingStandards: string[];
  image: string;
  representativeTypes: string[];
  typicalEngineeringConsiderations: string[];
  subcategories: TaxonomySubcategory[];
}

export const TOTAL_ROBOTICS_PILLARS: TaxonomyPillar[] = [
  // ==========================================
  // PILLAR 01: HUMANOID ROBOTS
  // ==========================================
  {
    id: "pillar:humanoid-robots",
    categoryNumber: "01",
    title: "Humanoid Robots",
    shortTitle: "Humanoid",
    tagline: "Anthropomorphic bipedal, wheeled, and upper-body dexterous manipulation platforms",
    definition:
      "Robots exhibiting anthropomorphic morphology comprising head, torso, multi-DoF arms, and either bipedal legs or a mobile base. Designed to operate in unstructured environments engineered for human anatomy, utilizing whole-body balance control and high-DoF dexterous manipulation.",
    governingStandards: ["ISO 8373:2021", "ISO 13482:2014", "IEEE 1872-2015"],
    image: humanoidImg,
    representativeTypes: [
      "Bipedal Humanoids",
      "Wheeled Humanoids",
      "Upper-Body / Torso Humanoids",
      "Social & Interactive Robots",
      "Teleoperated Humanoids",
      "Dexterous Manipulation Systems",
    ],
    typicalEngineeringConsiderations: [
      "Whole-body dynamic balance and Zero Moment Point (ZMP) control",
      "Actuator torque density vs thermal dissipation in confined joint housings",
      "Tendon-driven vs direct-drive dexterous tactile hands",
      "Real-time visual-inertial odometry and terrain height-map generation",
      "Battery power density and hot-swappable dual-pack architectures",
    ],
    subcategories: [
      {
        id: "subcat:bipedal-humanoid",
        pillarId: "pillar:humanoid-robots",
        title: "Bipedal Humanoid Robot",
        shortTitle: "Bipedal",
        summary: "Dual-leg articulated kinematic chain with whole-body dynamic walking and bi-manual manipulation.",
        definition:
          "Full-stature autonomous or semi-autonomous bipedal robot featuring 28 to 44 degrees of freedom, dynamic walking gait, active foot compliance, and dual 7-DoF arms with dexterous tactile hands.",
        ifrClassification: "Service Robot - Professional",
        isoStandardRef: "ISO 8373:2021 Clause 3.1 & ISO 13482",
        facets: {
          morphology: ["bipedal-humanoid"],
          mobility: ["dynamic-legged"],
          environment: ["factory-floor", "warehouse-logistics", "paved-outdoor"],
          domain: ["manufacturing-assembly", "logistics-warehousing", "defense-security"],
          capability: ["bimanual-dexterous-manipulation", "extreme-obstacle-traversal"],
          autonomy: ["goal-directed-autonomous", "fully-autonomous-adaptive"],
          manipulation: ["dexterous-hand"],
          deployment: ["edge-ai-standalone", "fleet-managed-vda5050"],
        },
        representativeProducts: ["Figure 02", "Boston Dynamics Atlas", "Tesla Optimus Gen 2", "Agility Digit"],
        engineeringConsiderations: [
          "Torque density requirements exceed 50 Nm/kg at knee and hip pitch joints",
          "Centroidal dynamics state estimation loop must run at >= 1 kHz",
          "Foot strike ground-reaction force absorption via compliant series-elastic actuation",
        ],
        specifications: [
          {
            parameter: "Total Degrees of Freedom (DoF)",
            value: "32–44",
            unit: "DoF",
            operatingConditions: "Including dual 7-DoF arms and multi-articulated hands",
            source: "src:iso-8373-2021",
            verificationStatus: "verified",
            applicableConfiguration: "Full Anthropomorphic",
            subject: "Physical Architecture",
          },
          {
            parameter: "Standing Height",
            value: "1650–1750",
            unit: "mm",
            operatingConditions: "Standard upright human posture",
            source: "src:iso-8373-2021",
            verificationStatus: "verified",
            applicableConfiguration: "Standard Human Stature",
            subject: "Physical Architecture",
          },
          {
            parameter: "Total System Mass",
            value: "55–70",
            unit: "kg",
            operatingConditions: "Including battery pack and structural carbon fairings",
            source: "src:iso-8373-2021",
            verificationStatus: "verified",
            applicableConfiguration: "Standard Battery",
            subject: "Physical Architecture",
          },
          {
            parameter: "Walking Velocity",
            value: "1.2–1.8",
            unit: "m/s",
            operatingConditions: "Flat concrete floor, nominal gait cycle",
            source: "src:iso-8373-2021",
            verificationStatus: "verified",
            applicableConfiguration: "Continuous Walking",
            subject: "Mobility",
          },
          {
            parameter: "Stair Climbing Incline",
            value: "Up to 35",
            unit: "deg",
            operatingConditions: "Standard architectural riser (180 mm rise, 280 mm run)",
            source: "src:iso-8373-2021",
            verificationStatus: "verified",
            applicableConfiguration: "Dynamic Stair Gait",
            subject: "Mobility",
          },
          {
            parameter: "Payload per Arm (Continuous)",
            value: "5.0–12.0",
            unit: "kg",
            operatingConditions: "Full arm extension (750 mm reach) throughout workspace",
            source: "src:iso-8373-2021",
            verificationStatus: "verified",
            applicableConfiguration: "Bi-manual Manipulation",
            subject: "Payload and Performance",
          },
          {
            parameter: "Wrist Maximum Torque",
            value: "25–40",
            unit: "Nm",
            operatingConditions: "Peak continuous torque at wrist yaw/roll",
            source: "src:iso-8373-2021",
            verificationStatus: "verified",
            applicableConfiguration: "Heavy Tooling",
            subject: "Manipulation",
          },
          {
            parameter: "Grip Finger Force",
            value: "50–80",
            unit: "N",
            operatingConditions: "Normal force per fingertip with tactile array",
            source: "src:iso-8373-2021",
            verificationStatus: "verified",
            applicableConfiguration: "Dexterous Hand",
            subject: "Manipulation",
          },
          {
            parameter: "Main Controller Architecture",
            value: "Dual Heterogeneous SoC + Real-Time FPGA",
            unit: "Architecture",
            operatingConditions: "RTOS determinism <100 µs jitter for motor commutations",
            source: "src:iso-8373-2021",
            verificationStatus: "verified",
            applicableConfiguration: "Standard Compute",
            subject: "Control System",
          },
          {
            parameter: "Onboard Battery Energy",
            value: "1.8–2.4",
            unit: "kWh",
            operatingConditions: "Lithium NMC / Solid-state pack, 48V–100V DC bus",
            source: "src:iso-8373-2021",
            verificationStatus: "verified",
            applicableConfiguration: "Standard Li-Ion",
            subject: "Power and Energy",
          },
          {
            parameter: "Continuous Operational Run-Time",
            value: "2.5–4.5",
            unit: "hours",
            operatingConditions: "Mixed duty cycle (50% walking, 50% manipulation)",
            source: "src:iso-8373-2021",
            verificationStatus: "verified",
            applicableConfiguration: "Mixed Work Cycle",
            subject: "Power and Energy",
          },
          {
            parameter: "Safety Standard Adherence",
            value: "ISO 13482 / ISO 13849 PL d",
            unit: "Standard",
            operatingConditions: "Personal care & collaborative robot safety requirements",
            source: "src:iso-10218-2011",
            verificationStatus: "verified",
            applicableConfiguration: "Industrial Safe Zone",
            subject: "Safety and Compliance",
          },
        ],
        configurations: [
          {
            configId: "cfg:hum-biped-std",
            configName: "Standard Industrial Biped",
            description: "Balanced for logistics tote handling, assembly station tending, and walking along aisles.",
            targetPayload: "10 kg per arm",
            primaryDrivetrain: "Frameless PMSM + High-ratio planetary / strain-wave reducers",
            powerSource: "2.1 kWh 52V Lithium-ion pack",
            keyTradeoff: "Optimized for 4-hour runtime at moderate payload.",
          },
          {
            configId: "cfg:hum-biped-heavy",
            configName: "Heavy-Duty Dual-Arm Manipulator",
            description: "High-torque cycloidal joint reducers at shoulder and torso for 20 kg handling.",
            targetPayload: "20 kg per arm",
            primaryDrivetrain: "High-torque cycloidal drives + liquid-cooled motor stators",
            powerSource: "3.2 kWh high-discharge pack",
            keyTradeoff: "Higher mass (78 kg) reduces runtime to 2 hours.",
          },
        ],
        operatingPrinciple: {
          kinematicChain: "Closed and open kinematic chains dynamically alternating during single and double support phases.",
          actuationTechnology: "Brushless permanent-magnet synchronous motors (PMSM) paired with zero-backlash strain-wave and planetary reducers.",
          controlLoopFrequency: "1 kHz Whole-Body Control (WBC) + Model Predictive Control (MPC) trajectory planning at 100 Hz.",
          sensorFusionPipeline: "Stereo depth cameras + Solid-state 3D LiDAR + Dual 6-axis IMU + Joint torque sensors in each axis.",
          mathematicalFoundation: "Centroidal momentum matrix optimization subjected to contact friction cone constraints.",
          failureModesAndFailsafes: "Emergency controlled crumple crouch with power cut-off to prevent uncontrolled tipping upon bus failure.",
        },
        compatibleComponents: [
          {
            componentId: "ind-pr-sw-hollow-unit",
            lineId: "precision-reducers",
            name: "Hollow-Bore Strain-Wave Reducer (SW-200)",
            relationshipType: "verified compatibility",
            notes: "Directly used in shoulder and elbow rotary joints for internal cable routing.",
          },
          {
            componentId: "line:servo-motors",
            lineId: "servo-motors",
            name: "Frameless Direct-Torque PMSM Kits",
            relationshipType: "verified compatibility",
            notes: "High torque density motor kits integrated inside humanoid joint link castings.",
          },
          {
            componentId: "line:sensors-encoders",
            lineId: "sensors-encoders",
            name: "Dual Absolute Joint Encoders (BiSS-C / SSI)",
            relationshipType: "verified compatibility",
            notes: "Measures pre- and post-reducer position to eliminate joint deflection errors.",
          },
          {
            componentId: "line:end-effectors",
            lineId: "end-effectors",
            name: "Dexterous 5-Finger Tactile Gripper Hands",
            relationshipType: "verified compatibility",
            notes: "End-effector interface via quick-connect wrist tool flange.",
          },
        ],
        applications: [
          {
            applicationId: "warehousing",
            name: "Warehousing & Fulfillment",
            domain: "Logistics",
            deploymentNotes: "Unloading tote totes, picking irregular retail items, and loading autonomous mobile pallets.",
          },
          {
            applicationId: "automotive",
            name: "Automotive Manufacturing",
            domain: "Industrial Manufacturing",
            deploymentNotes: "Tending trim assembly stations and delivering sub-assemblies inside vehicle passenger compartments.",
          },
          {
            applicationId: "humanoid",
            name: "Humanoid R&D & Field Deployment",
            domain: "Robotics Research",
            deploymentNotes: "Embodied AI training environments and human-robot collaborative ergonomics verification.",
          },
        ],
        resources: [
          {
            title: "ISO 13482 Safety of Personal Care and Mobile Manipulators",
            type: "ISO Standard",
            referenceId: "src:iso-10218-2011",
          },
          {
            title: "Humanoid Joint Actuator Thermal Dissipation & Sizing Guide",
            type: "Engineering Guide",
            referenceId: "guide:humanoid-thermal-sizing",
          },
        ],
      },
      {
        id: "subcat:wheeled-humanoid",
        pillarId: "pillar:humanoid-robots",
        title: "Wheeled Humanoid Robot",
        shortTitle: "Wheeled Humanoid",
        summary: "Anthropomorphic dual-arm upper torso mounted on self-balancing or omnidirectional mobile chassis.",
        definition:
          "Hybrid robot combining the high-DoF bi-manual dexterity of an anthropomorphic upper body with the energy efficiency and stability of a wheeled mobile base (e.g., differential, Mecanum, or ball-balancing inverse pendulum).",
        ifrClassification: "Service Robot - Professional",
        isoStandardRef: "ISO 8373:2021 & ISO 3691-4:2023",
        facets: {
          morphology: ["wheeled-humanoid"],
          mobility: ["omnidirectional-mecanum", "differential-drive"],
          environment: ["factory-floor", "warehouse-logistics", "cleanroom-sterile"],
          domain: ["manufacturing-assembly", "logistics-warehousing", "healthcare-surgery"],
          capability: ["bimanual-dexterous-manipulation", "slam-navigation-transport"],
          autonomy: ["goal-directed-autonomous"],
          manipulation: ["dexterous-hand", "iso-tool-flange"],
          deployment: ["fleet-managed-vda5050", "workcell-integrated"],
        },
        representativeProducts: ["Toyota T-HR3", "Sanctuary AI Phoenix (Wheeled)", "PAL Robotics TIAGo"],
        engineeringConsiderations: [
          "Eliminates dynamic bipedal gait instability while preserving 8+ hours runtime",
          "Torso pitch acceleration must be counter-balanced by wheel acceleration",
          "Workspace envelope extends vertically via telescopic prismatic spine",
        ],
        specifications: [
          {
            parameter: "Base Mobility Drive",
            value: "Dual Independent Differential or 4-Wheel Mecanum",
            unit: "Topology",
            operatingConditions: "Smooth industrial epoxy / concrete floors",
            source: "src:iso-3691-4-2023",
            verificationStatus: "verified",
            applicableConfiguration: "Omnidirectional",
            subject: "Mobility",
          },
          {
            parameter: "Maximum Mobile Velocity",
            value: "2.0",
            unit: "m/s",
            operatingConditions: "Autonomous obstacle avoidance active",
            source: "src:iso-3691-4-2023",
            verificationStatus: "verified",
            applicableConfiguration: "High-Speed Transit",
            subject: "Mobility",
          },
          {
            parameter: "Upper Body Degrees of Freedom",
            value: "14–22",
            unit: "DoF",
            operatingConditions: "Dual 7-DoF arms + 2-DoF neck + optional prismatic torso lift",
            source: "src:iso-8373-2021",
            verificationStatus: "verified",
            applicableConfiguration: "Standard Upper Body",
            subject: "Physical Architecture",
          },
          {
            parameter: "Combined Dual-Arm Payload",
            value: "15.0",
            unit: "kg",
            operatingConditions: "Both arms grasping shared rigid payload",
            source: "src:iso-8373-2021",
            verificationStatus: "verified",
            applicableConfiguration: "Heavy Dual-Arm",
            subject: "Payload and Performance",
          },
          {
            parameter: "Operational Run-Time",
            value: "8.0–12.0",
            unit: "hours",
            operatingConditions: "Continuous industrial material handling with opportunity docking",
            source: "src:iso-3691-4-2023",
            verificationStatus: "verified",
            applicableConfiguration: "Industrial Shift",
            subject: "Power and Energy",
          },
        ],
        configurations: [
          {
            configId: "cfg:hum-wheel-mfg",
            configName: "Precision Assembly Wheeled Manipulator",
            description: "Designed for cleanroom electronics kitting and precision PCB testing.",
            targetPayload: "8 kg total",
            primaryDrivetrain: "Ultra-quiet brushless planetary hub wheels + zero-backlash arm joints",
            powerSource: "48V 1.5 kWh LiFePO4 pack",
            keyTradeoff: "Limited to flat indoor floor profiles (max threshold 15 mm).",
          },
        ],
        operatingPrinciple: {
          kinematicChain: "Serial manipulators connected to mobile platform base frame.",
          actuationTechnology: "Brushless wheel in-hub servo motors combined with harmonic wrist drives.",
          controlLoopFrequency: "500 Hz coordinated mobile base and arm trajectory interpolation.",
          sensorFusionPipeline: "Dual 2D safety laser scanners + RGB-D head cameras + wheel encoders.",
          mathematicalFoundation: "Mobile manipulator redundancy resolution and velocity manipulability ellipsoid maximization.",
          failureModesAndFailsafes: "Dynamic obstacle detection safety zones triggering safe monitored stop (Category 1).",
        },
        compatibleComponents: [
          {
            componentId: "line:precision-reducers",
            lineId: "precision-reducers",
            name: "Harmonic Reducers for Upper-Body Joints",
            relationshipType: "verified compatibility",
            notes: "Delivers zero-backlash positioning for delicate sub-assembly tasks.",
          },
          {
            componentId: "line:robotics-safety",
            lineId: "robotics-safety",
            name: "Dual Safety Laser Scanners (PL d / Cat 3)",
            relationshipType: "verified compatibility",
            notes: "Meets ISO 3691-4 requirement for bidirectional mobile base protection.",
          },
        ],
        applications: [
          {
            applicationId: "electronics",
            name: "Electronics & Semiconductor",
            domain: "High-Tech Manufacturing",
            deploymentNotes: "Wafers handling and cleanroom circuit board transfer between test chambers.",
          },
        ],
        resources: [
          {
            title: "ISO 3691-4 Industrial Mobile Trucks Compliance Guidelines",
            type: "ISO Standard",
            referenceId: "src:iso-3691-4-2023",
          },
        ],
      },
    ],
  },

  // ==========================================
  // PILLAR 02: INDUSTRIAL ROBOTS
  // ==========================================
  {
    id: "pillar:industrial-robots",
    categoryNumber: "02",
    title: "Industrial Robots",
    shortTitle: "Industrial",
    tagline: "High-rigidity articulated arms, SCARA, Cartesian, delta, and collaborative manipulators",
    definition:
      "Automatically controlled, reprogrammable, multipurpose manipulators programmable in three or more axes, fixed in place or mobile, for use in industrial automation applications (ISO 8373:2021). Classified by kinematic topology into Articulated, SCARA, Cartesian/Gantry, Parallel/Delta, and Collaborative formats.",
    governingStandards: ["ISO 8373:2021", "ISO 10218-1:2011", "ISO 10218-2:2011", "ISO/TS 15066:2016", "ISO 9283:1998"],
    image: industrialImg,
    representativeTypes: [
      "Articulated Arms (6-Axis & 7-Axis)",
      "SCARA Robots",
      "Cartesian & Gantry Systems",
      "Delta / Parallel Kinematics",
      "Collaborative Robots (Cobots)",
      "Specialised Foundry & Press Manipulators",
    ],
    typicalEngineeringConsiderations: [
      "Pose repeatability (ISO 9283 RP) down to ±0.01 mm under full dynamic load",
      "Cycloidal RV reducers for base/shoulder axes; strain-wave harmonic gears for wrist axes",
      "Torsional stiffness and moment of inertia matching between payload and gearbox",
      "Deterministic fieldbus control over EtherCAT, PROFINET IRT, or CC-Link IE TSN",
      "Protective coatings for IP67 washdown or IP69K aggressive chemical exposure",
    ],
    subcategories: [
      {
        id: "subcat:articulated-arm-6axis",
        pillarId: "pillar:industrial-robots",
        title: "Articulated Industrial Robot Arm (6-Axis)",
        shortTitle: "6-Axis Articulated",
        summary: "Universal serial kinematic manipulator with six revolute joints delivering spherical reach.",
        definition:
          "The definitive industrial manipulator configured with six serial revolute joints (waist, shoulder, elbow, wrist pitch, wrist yaw, wrist roll). Capable of positioning an end-effector at any 3D coordinate with arbitrary angular orientation within its working envelope.",
        ifrClassification: "Industrial Robot",
        isoStandardRef: "ISO 8373:2021 Clause 3.6 & ISO 10218-1",
        facets: {
          morphology: ["articulated-arm"],
          mobility: ["stationary-fixed", "linear-seventh-axis"],
          environment: ["factory-floor", "cleanroom-sterile"],
          domain: ["manufacturing-assembly", "inspection-maintenance"],
          capability: ["precision-welding-dispensing", "palletising-heavy-handling"],
          autonomy: ["goal-directed-autonomous"],
          manipulation: ["iso-tool-flange"],
          deployment: ["workcell-integrated"],
        },
        representativeProducts: ["KUKA KR QUANTEC", "FANUC M-2000iA", "ABB IRB 6700", "Yaskawa GP280"],
        engineeringConsiderations: [
          "Wrist torque and inertia limits dictate max speed when carrying heavy offset weld guns",
          "Axis 1–3 use cycloidal RV reducers to resist bending moments up to 25,000 Nm",
          "Dynamic path accuracy under varying payload requires feedforward inertia decoupling",
        ],
        specifications: [
          {
            parameter: "Rated Payload Capacity",
            value: "6 to 1,200",
            unit: "kg",
            operatingConditions: "At nominal center of gravity distance from wrist flange",
            source: "src:ifr-industrial-2024",
            verificationStatus: "verified",
            applicableConfiguration: "Catalogue Range",
            subject: "Payload and Performance",
          },
          {
            parameter: "Maximum Radial Reach",
            value: "900 to 3,900",
            unit: "mm",
            operatingConditions: "From J1 center to J6 tool center point",
            source: "src:ifr-industrial-2024",
            verificationStatus: "verified",
            applicableConfiguration: "Standard Arm",
            subject: "Physical Architecture",
          },
          {
            parameter: "Pose Repeatability (ISO 9283 RP)",
            value: "±0.02 to ±0.08",
            unit: "mm",
            operatingConditions: "At rated payload and maximum reach velocity",
            source: "src:iso-9283-1998",
            verificationStatus: "verified",
            applicableConfiguration: "Precision Mode",
            subject: "Payload and Performance",
          },
          {
            parameter: "Number of Motion Axes",
            value: "6 (Revolute Serial)",
            unit: "Axes",
            operatingConditions: "Standard 6-axis anthropomorphic wrist",
            source: "src:iso-8373-2021",
            verificationStatus: "verified",
            applicableConfiguration: "6-DoF",
            subject: "Physical Architecture",
          },
          {
            parameter: "Main Drive Gearbox Architecture",
            value: "Axes 1–3 RV Cycloidal / Axes 4–6 Strain-Wave",
            unit: "Mechanism",
            operatingConditions: "Continuous industrial duty cycle S1",
            source: "src:din-3990-1987",
            verificationStatus: "verified",
            applicableConfiguration: "Industrial Drivetrain",
            subject: "Physical Architecture",
          },
          {
            parameter: "Fieldbus Communication Protocol",
            value: "EtherCAT / PROFINET IRT / CC-Link IE TSN",
            unit: "Protocol",
            operatingConditions: "Cycle time <= 1 ms with < 1 µs synchronization jitter",
            source: "src:iso-10218-2011",
            verificationStatus: "verified",
            applicableConfiguration: "Real-Time Fieldbus",
            subject: "Control System",
          },
          {
            parameter: "Ingress Protection Rating",
            value: "IP65 body / IP67 wrist",
            unit: "IP Code",
            operatingConditions: "Dust tight and water immersion resistant at wrist",
            source: "src:iso-10218-2011",
            verificationStatus: "verified",
            applicableConfiguration: "Standard Industrial",
            subject: "Operating Environment",
          },
        ],
        configurations: [
          {
            configId: "cfg:art-6ax-med",
            configName: "Medium Payload Arc Welding & Handling Arm",
            description: "20–60 kg payload, 2,000 mm reach, hollow wrist for integrated welding torch dressing.",
            targetPayload: "20–60 kg",
            primaryDrivetrain: "RV cycloid drives + PMSM high-response servos",
            powerSource: "3-Phase 400V AC industrial mains",
            keyTradeoff: "Balanced for spot welding and continuous laser path tracking.",
          },
          {
            configId: "cfg:art-6ax-heavy",
            configName: "Heavy Palletising & Press-Tending Arm",
            description: "250–500 kg payload, reinforced casting, external cooling fans.",
            targetPayload: "250–500 kg",
            primaryDrivetrain: "Heavy cycloidal units with dual planetary input stages",
            powerSource: "3-Phase 480V AC industrial mains",
            keyTradeoff: "High inertia limits max acceleration to 4 m/s².",
          },
        ],
        operatingPrinciple: {
          kinematicChain: "6-DoF open serial kinematic chain computed via Denavit-Hartenberg parameters.",
          actuationTechnology: "Low-inertia AC permanent-magnet synchronous servomotors with holding brakes on all axes.",
          controlLoopFrequency: "Current loop 16 kHz, Velocity loop 4 kHz, Position / Trajectory loop 1 kHz.",
          sensorFusionPipeline: "24-bit multi-turn absolute optical encoders + motor winding thermal sensors.",
          mathematicalFoundation: "Inverse kinematics solved analytically via Pieper's criterion for spherical wrist geometry.",
          failureModesAndFailsafes: "Spring-applied electromagnetic holding brakes engage within 15 ms upon protective stop.",
        },
        compatibleComponents: [
          {
            componentId: "ind-pr-sw-silk-hat",
            lineId: "precision-reducers",
            name: "High-Torque Silk-Hat Strain Wave Reducer",
            relationshipType: "verified compatibility",
            notes: "Used in wrist axis 5 and 6 for ultra-compact high-torque rotation.",
          },
          {
            componentId: "line:robot-controllers",
            lineId: "robot-controllers",
            name: "Multi-Axis Motion Controller & Safe PLC",
            relationshipType: "verified compatibility",
            notes: "Executes trajectory interpolation and safety monitoring.",
          },
          {
            componentId: "line:end-effectors",
            lineId: "end-effectors",
            name: "Pneumatic & Electric Tooling Quick-Changers",
            relationshipType: "verified compatibility",
            notes: "ISO 9409-1 flange coupling for spot weld guns and vacuum grippers.",
          },
        ],
        applications: [
          {
            applicationId: "automotive",
            name: "Automotive Body-in-White",
            domain: "Automotive",
            deploymentNotes: "High-speed spot welding, structural adhesive dispensing, and chassis framing.",
          },
          {
            applicationId: "aerospace",
            name: "Aerospace Structural Drilling",
            domain: "Aerospace",
            deploymentNotes: "Drilling and countersinking carbon-fiber fuselage skins to ±0.03 mm tolerance.",
          },
        ],
        resources: [
          {
            title: "ISO 9283 Robot Performance Criteria & Testing Standard",
            type: "ISO Standard",
            referenceId: "src:iso-9283-1998",
          },
          {
            title: "Industrial Robot Wrist Torque & Moment Sizing Calculator",
            type: "CAD Specification",
            referenceId: "calc:wrist-moment-inertia",
          },
        ],
      },
      {
        id: "subcat:scara-robot",
        pillarId: "pillar:industrial-robots",
        title: "SCARA Robot (Selective Compliance Articulated Robot Arm)",
        shortTitle: "SCARA",
        summary: "4-axis planar articulated robot arm optimized for high-speed pick-and-place and screwdriving.",
        definition:
          "Robot manipulator with two parallel revolute joints providing compliance in the horizontal X-Y plane, coupled with a rigid vertical prismatic Z-axis and rotary quill. Designed for ultra-fast, repeatable assembly in electronic and medical manufacturing.",
        ifrClassification: "Industrial Robot",
        isoStandardRef: "ISO 8373:2021 & ISO 10218-1",
        facets: {
          morphology: ["scara"],
          mobility: ["stationary-fixed"],
          environment: ["factory-floor", "cleanroom-sterile"],
          domain: ["manufacturing-assembly", "laboratory-automation"],
          capability: ["high-speed-pick-place"],
          autonomy: ["goal-directed-autonomous"],
          manipulation: ["iso-tool-flange"],
          deployment: ["workcell-integrated"],
        },
        representativeProducts: ["Epson G-Series", "Yamaha YK-X", "Stäubli TS2", "Denso LPH"],
        engineeringConsiderations: [
          "Ball screw / spline combination shaft delivers simultaneous vertical stroke and rotation",
          "Horizontal compliance prevents jamming during delicate pin-in-hole insertion",
          "Cycle times as low as 0.28 seconds for 25x300x25 mm standard Adept cycle",
        ],
        specifications: [
          {
            parameter: "Rated Payload",
            value: "1.0 to 20.0",
            unit: "kg",
            operatingConditions: "Nominal quill loading",
            source: "src:ifr-industrial-2024",
            verificationStatus: "verified",
            applicableConfiguration: "All Ranges",
            subject: "Payload and Performance",
          },
          {
            parameter: "Horizontal Reach",
            value: "350 to 1,000",
            unit: "mm",
            operatingConditions: "J1 + J2 full arm extension",
            source: "src:ifr-industrial-2024",
            verificationStatus: "verified",
            applicableConfiguration: "Reach Spec",
            subject: "Physical Architecture",
          },
          {
            parameter: "Z-Axis Quill Stroke",
            value: "150 to 400",
            unit: "mm",
            operatingConditions: "Vertical linear travel",
            source: "src:ifr-industrial-2024",
            verificationStatus: "verified",
            applicableConfiguration: "Standard Quill",
            subject: "Physical Architecture",
          },
          {
            parameter: "Standard Cycle Time (Adept 25-300-25 mm)",
            value: "0.28 to 0.45",
            unit: "seconds",
            operatingConditions: "1 kg payload, full acceleration curve",
            source: "src:iso-9283-1998",
            verificationStatus: "verified",
            applicableConfiguration: "High-Speed Cycle",
            subject: "Payload and Performance",
          },
          {
            parameter: "Repeatability (X-Y Plane)",
            value: "±0.010 to ±0.015",
            unit: "mm",
            operatingConditions: "At rated payload after thermal equilibrium",
            source: "src:iso-9283-1998",
            verificationStatus: "verified",
            applicableConfiguration: "Precision Grade",
            subject: "Payload and Performance",
          },
        ],
        configurations: [
          {
            configId: "cfg:scara-cleanroom",
            configName: "Cleanroom ISO Class 3 SCARA",
            description: "Equipped with internal vacuum suction channel to vent particulate matter.",
            targetPayload: "3–6 kg",
            primaryDrivetrain: "Zero-backlash strain-wave gearheads + precision ball screw spline",
            powerSource: "230V Single-phase AC",
            keyTradeoff: "Cleanroom vacuum exhaust required.",
          },
        ],
        operatingPrinciple: {
          kinematicChain: "R-R-P-R serial kinematic structure operating in cylindrical coordinate workspace.",
          actuationTechnology: "Direct drive and high-speed strain-wave reducers paired with ground ball screw splines.",
          controlLoopFrequency: "2 kHz real-time trajectory interpolation.",
          sensorFusionPipeline: "Absolute optical encoders on motor shafts + 2D machine vision part recognition.",
          mathematicalFoundation: "Planar 2-link trigonometry for X-Y with decoupled vertical axis.",
          failureModesAndFailsafes: "Z-axis brake prevents gravity drop during power loss.",
        },
        compatibleComponents: [
          {
            componentId: "ind-pr-sw-flat-pancake",
            lineId: "precision-reducers",
            name: "Ultra-Flat Pancake Strain-Wave Reducer",
            relationshipType: "verified compatibility",
            notes: "Enables ultra-low profile shoulder and elbow joint geometry.",
          },
          {
            componentId: "line:linear-motion",
            lineId: "linear-motion",
            name: "Precision Ground Ball Screw Spline Shafts",
            relationshipType: "verified compatibility",
            notes: "Provides combined linear stroke and rotation for SCARA quill.",
          },
        ],
        applications: [
          {
            applicationId: "electronics",
            name: "Electronics Assembly",
            domain: "Semiconductor & SMT",
            deploymentNotes: "High-speed surface mount packaging, battery cell insertion, and screw fastening.",
          },
        ],
        resources: [
          {
            title: "SCARA Kinematics and High-Speed Cycle Sizing Guide",
            type: "Engineering Guide",
            referenceId: "guide:scara-cycle-sizing",
          },
        ],
      },
      {
        id: "subcat:collaborative-cobot",
        pillarId: "pillar:industrial-robots",
        title: "Collaborative Robot Arm (Cobot)",
        shortTitle: "Cobot",
        summary: "Power and force limited articulated arm with joint torque sensors for safe cageless human teamwork.",
        definition:
          "Industrial robot specifically designed to work directly alongside human operators without perimeter safety fencing, adhering to ISO/TS 15066 through integrated joint torque sensing, rounded geometry, and safety-rated monitored stopping.",
        ifrClassification: "Industrial Robot",
        isoStandardRef: "ISO 10218-1 & ISO/TS 15066",
        facets: {
          morphology: ["articulated-arm"],
          mobility: ["stationary-fixed", "wheeled-platform"],
          environment: ["factory-floor", "cleanroom-sterile", "laboratory-automation"],
          domain: ["manufacturing-assembly", "inspection-maintenance"],
          capability: ["precision-welding-dispensing", "high-speed-pick-place"],
          autonomy: ["collaborative-pfl"],
          manipulation: ["iso-tool-flange"],
          deployment: ["workcell-integrated"],
        },
        representativeProducts: ["Universal Robots UR20", "KUKA LBR iiwa", "FANUC CRX-25iA", "ABB GoFa"],
        engineeringConsiderations: [
          "Dual-channel joint torque sensors in every axis detect accidental human contact in <10 ms",
          "Maximum permissible contact forces calibrated to ISO/TS 15066 body biomechanical limits (e.g. 140 N chest)",
          "Lead-through hand guiding allows zero-programming intuitive point teaching",
        ],
        specifications: [
          {
            parameter: "Rated Payload",
            value: "3 to 30",
            unit: "kg",
            operatingConditions: "At rated reach",
            source: "src:iso-ts-15066-2016",
            verificationStatus: "verified",
            applicableConfiguration: "All Cobot Models",
            subject: "Payload and Performance",
          },
          {
            parameter: "Reach Envelope",
            value: "500 to 1,750",
            unit: "mm",
            operatingConditions: "Radius from base mounting center",
            source: "src:iso-ts-15066-2016",
            verificationStatus: "verified",
            applicableConfiguration: "Standard Reach",
            subject: "Physical Architecture",
          },
          {
            parameter: "Safety Reaction Time",
            value: "<10",
            unit: "ms",
            operatingConditions: "From contact threshold detection to dynamic stop command",
            source: "src:iso-ts-15066-2016",
            verificationStatus: "verified",
            applicableConfiguration: "Safety Circuit",
            subject: "Safety and Compliance",
          },
          {
            parameter: "Safety Architecture Compliance",
            value: "Category 3, PL d (ISO 13849-1)",
            unit: "Performance Level",
            operatingConditions: "Safety-rated soft axis and space limiting (SLS, SLP)",
            source: "src:iso-10218-2011",
            verificationStatus: "verified",
            applicableConfiguration: "Safety Kernel",
            subject: "Safety and Compliance",
          },
        ],
        configurations: [
          {
            configId: "cfg:cobot-highpayload",
            configName: "High-Payload Palletising Cobot (20–30 kg)",
            description: "Reinforced joint modules with high-stiffness hollow-bore strain-wave reducers.",
            targetPayload: "20–30 kg",
            primaryDrivetrain: "Frameless PMSM + strain-wave gearing with dual absolute encoders",
            powerSource: "100–240V AC universal single phase",
            keyTradeoff: "Reduced maximum collaborative speed when operating in close proximity mode.",
          },
        ],
        operatingPrinciple: {
          kinematicChain: "6-DoF or 7-DoF redundant serial kinematics allowing obstacle avoidance in collaborative space.",
          actuationTechnology: "Integrated joint actuators with hollow shafts, frameless motors, and dual-encoder feedback.",
          controlLoopFrequency: "1 kHz safety task cycle; 20 kHz torque monitoring.",
          sensorFusionPipeline: "Dual strain-gauge torque sensors per joint + tool-flange 6-axis F/T sensor.",
          mathematicalFoundation: "Momentum observer-based external collision detection algorithm without external sensors.",
          failureModesAndFailsafes: "Power and force limiting triggers Category 1 controlled decelerated stop.",
        },
        compatibleComponents: [
          {
            componentId: "ind-pr-sw-cup-set",
            lineId: "precision-reducers",
            name: "Zero-Backlash Cup Strain-Wave Reducer",
            relationshipType: "verified compatibility",
            notes: "Provides ultra-smooth torque transmission required for delicate force-guided assembly.",
          },
          {
            componentId: "line:sensors-encoders",
            lineId: "sensors-encoders",
            name: "Dual Multi-Turn Absolute Joint Encoders",
            relationshipType: "verified compatibility",
            notes: "Safety-certified position monitoring across gear reduction.",
          },
        ],
        applications: [
          {
            applicationId: "packaging",
            name: "Packaging & Palletising",
            domain: "Consumer Goods",
            deploymentNotes: "Cageless pallet stacking in tight factory layouts shared with manual forklift traffic.",
          },
        ],
        resources: [
          {
            title: "ISO/TS 15066 Biomechanical Limit Thresholds Reference",
            type: "ISO Standard",
            referenceId: "src:iso-ts-15066-2016",
          },
        ],
      },
    ],
  },

  // ==========================================
  // PILLAR 03: MOBILE DRIVERLESS ROBOTS
  // ==========================================
  {
    id: "pillar:mobile-driverless-robots",
    categoryNumber: "03",
    title: "Mobile Driverless Robots",
    shortTitle: "Mobile Driverless",
    tagline: "Autonomous Mobile Robots (AMRs), AGVs, autonomous forklifts, and mobile manipulators",
    definition:
      "Self-propelled industrial driverless transport vehicles operating under automatic control to move materials without continuous human driver presence. Classified by guidance system (AGV with physical guides vs AMR with natural-feature SLAM) and chassis mechanics (pallet truck, counterbalance forklift, tugger, mobile manipulator).",
    governingStandards: ["ISO 3691-4:2023", "VDA 5050 v2.1.0", "ANSI/ITSDF B56.5", "ISO 8373:2021"],
    image: mobileImg,
    representativeTypes: [
      "Autonomous Mobile Robots (AMRs)",
      "Automated Guided Vehicles (AGVs)",
      "Autonomous Counterbalance Forklifts",
      "Autonomous Pallet Trucks & Lifters",
      "Autonomous Tow Tractors & Tuggers",
      "Mobile Manipulators (AMR + Articulated Arm)",
    ],
    typicalEngineeringConsiderations: [
      "LiDAR natural-feature SLAM navigation vs QR grid vs magnetic tape reliability",
      "Dynamic safety field switching per ISO 3691-4 based on payload mass and braking velocity",
      "In-hub drive wheel electric steering actuators and high-traction polyurethane tires",
      "Fleet coordination under VDA 5050 over private industrial Wi-Fi 6 / 5G networks",
      "Opportunity inductive / fast DC charging with LiFePO4 battery management systems",
    ],
    subcategories: [
      {
        id: "subcat:amr-indoor",
        pillarId: "pillar:mobile-driverless-robots",
        title: "Autonomous Mobile Robot (AMR)",
        shortTitle: "Indoor AMR",
        summary: "Natural feature SLAM navigation mobile platform for dynamic factory and warehouse transport.",
        definition:
          "Driverless transport robot utilizing onboard LiDAR, depth cameras, and IMU sensor fusion to map environments in real time, localize without fixed floor infrastructure, and dynamically calculate obstacle detours.",
        ifrClassification: "Service Robot - Professional",
        isoStandardRef: "ISO 3691-4:2023 & VDA 5050",
        facets: {
          morphology: ["wheeled-platform"],
          mobility: ["differential-drive", "omnidirectional-mecanum"],
          environment: ["warehouse-logistics", "factory-floor"],
          domain: ["logistics-warehousing", "manufacturing-assembly"],
          capability: ["slam-navigation-transport"],
          autonomy: ["goal-directed-autonomous"],
          manipulation: ["non-manipulative"],
          deployment: ["fleet-managed-vda5050"],
        },
        representativeProducts: ["MiR250 / MiR600 / MiR1200", "OTTO 100 / 1500", "Fetch Freight100", "Omron LD-90"],
        engineeringConsiderations: [
          "Braking distance at full payload (1,200 kg) requires dynamic expansion of safety protective laser field",
          "Floor friction coefficient variations (wet vs dry concrete) alter stopping distance by up to 40%",
          "Differential drive with dual sprung casters maintains tire contact on uneven floor joints",
        ],
        specifications: [
          {
            parameter: "Rated Payload Capacity",
            value: "100 to 1,500",
            unit: "kg",
            operatingConditions: "Centered payload over drive wheel axis",
            source: "src:iso-3691-4-2023",
            verificationStatus: "verified",
            applicableConfiguration: "Platform Series",
            subject: "Payload and Performance",
          },
          {
            parameter: "Maximum Forward Speed",
            value: "1.5 to 2.2",
            unit: "m/s",
            operatingConditions: "Unobstructed clear straightway corridor",
            source: "src:iso-3691-4-2023",
            verificationStatus: "verified",
            applicableConfiguration: "Max Speed Mode",
            subject: "Mobility",
          },
          {
            parameter: "Localization Accuracy (Natural Feature SLAM)",
            value: "±5 to ±10",
            unit: "mm",
            operatingConditions: "At dedicated docking station target",
            source: "src:iso-3691-4-2023",
            verificationStatus: "verified",
            applicableConfiguration: "Precision Docking",
            subject: "Sensors and Perception",
          },
          {
            parameter: "Fleet Interface Protocol",
            value: "VDA 5050 v2.1.0 over MQTT / WebSockets",
            unit: "Standard",
            operatingConditions: "Vendor-neutral fleet manager dispatching orders",
            source: "src:vda-5050-v21",
            verificationStatus: "verified",
            applicableConfiguration: "Fleet Dispatch",
            subject: "Integration",
          },
          {
            parameter: "Battery Chemistry & Voltage",
            value: "LiFePO4 / NMC (48V nominal)",
            unit: "Volts",
            operatingConditions: "Fast opportunity charging (up to 1C charge rate)",
            source: "src:iso-3691-4-2023",
            verificationStatus: "verified",
            applicableConfiguration: "Power Subsystem",
            subject: "Power and Energy",
          },
        ],
        configurations: [
          {
            configId: "cfg:amr-mid-payload",
            configName: "Mid-Payload Warehouse AMR (600 kg)",
            description: "Equipped with integrated top-mounted electric lift pin for EU/US pallets.",
            targetPayload: "600 kg",
            primaryDrivetrain: "Dual brushless servo hub wheels + 4 passive heavy-duty casters",
            powerSource: "48V 40Ah Lithium Iron Phosphate battery",
            keyTradeoff: "10-hour runtime with 10-minute fast opportunity charging every 2 hours.",
          },
        ],
        operatingPrinciple: {
          kinematicChain: "Differential drive non-holonomic mobile platform with zero turning radius.",
          actuationTechnology: "Brushless DC high-torque drive wheels with integrated planetary gear reduction and electromagnetic brakes.",
          controlLoopFrequency: "50 Hz trajectory planner; 500 Hz motor velocity control.",
          sensorFusionPipeline: "Dual 270° safety laser scanners (front & rear) + 3D depth cameras + wheel odometry + 6-axis IMU.",
          mathematicalFoundation: "Extended Kalman Filter (EKF) / Particle Filter localization on 2D occupancy grid.",
          failureModesAndFailsafes: "Loss of safety scanner connection triggers fail-safe emergency stop within 30 ms.",
        },
        compatibleComponents: [
          {
            componentId: "line:robotic-wheels",
            lineId: "robotic-wheels",
            name: "High-Load Polyurethane Servo Drive Wheels",
            relationshipType: "verified compatibility",
            notes: "Delivers traction on industrial epoxy floors up to 1,500 kg total vehicle weight.",
          },
          {
            componentId: "line:robotics-safety",
            lineId: "robotics-safety",
            name: "Safety Laser Scanners with Dynamic Field Switching",
            relationshipType: "verified compatibility",
            notes: "Meets ISO 3691-4 protective stop requirement.",
          },
        ],
        applications: [
          {
            applicationId: "warehousing",
            name: "Automated Fulfillment Centers",
            domain: "Logistics",
            deploymentNotes: "Transporting tote racks from automated storage to manual picking stations.",
          },
        ],
        resources: [
          {
            title: "VDA 5050 AMR Fleet Interoperability Standard Specification",
            type: "ISO Standard",
            referenceId: "src:vda-5050-v21",
          },
        ],
      },
      {
        id: "subcat:mobile-manipulator",
        pillarId: "pillar:mobile-driverless-robots",
        title: "Mobile Manipulator (AMR + Articulated Arm)",
        shortTitle: "Mobile Manipulator",
        summary: "Combined autonomous mobile platform with multi-axis articulated arm for untethered manipulation.",
        definition:
          "Hybrid robotic system mounting a 6-DoF or 7-DoF industrial or collaborative robot arm onto an autonomous mobile platform, enabling physical grasping, machine tending, and inspection tasks across an entire facility.",
        ifrClassification: "Service Robot - Professional",
        isoStandardRef: "ISO 3691-4:2023 & ISO 10218-1",
        facets: {
          morphology: ["wheeled-platform", "articulated-arm"],
          mobility: ["omnidirectional-mecanum", "differential-drive"],
          environment: ["factory-floor", "cleanroom-sterile"],
          domain: ["manufacturing-assembly", "inspection-maintenance"],
          capability: ["slam-navigation-transport", "high-speed-pick-place"],
          autonomy: ["goal-directed-autonomous"],
          manipulation: ["iso-tool-flange", "dexterous-hand"],
          deployment: ["fleet-managed-vda5050"],
        },
        representativeProducts: ["KUKA KMR iiwa", "Fetch Mobile Manipulator", "Boston Dynamics Stretch", "Omron MoMa"],
        engineeringConsiderations: [
          "Arm dynamic motion creates significant tilting moment on mobile chassis; requires dynamic tipping margin calculation",
          "Shared battery bus must manage simultaneous arm joint peak acceleration and base traction draw",
          "Hand-eye camera calibration transforms base SLAM map coordinate frame to arm tool center point",
        ],
        specifications: [
          {
            parameter: "Arm Payload Capacity",
            value: "5 to 25",
            unit: "kg",
            operatingConditions: "At full reach with platform stationary and stabilized",
            source: "src:iso-8373-2021",
            verificationStatus: "verified",
            applicableConfiguration: "Arm Payload",
            subject: "Payload and Performance",
          },
          {
            parameter: "Base Mobile Payload",
            value: "200 to 800",
            unit: "kg",
            operatingConditions: "Including arm weight and carried cargo",
            source: "src:iso-3691-4-2023",
            verificationStatus: "verified",
            applicableConfiguration: "Mobile Platform",
            subject: "Physical Architecture",
          },
          {
            parameter: "Coordinated Transit Velocity",
            value: "1.2 to 1.8",
            unit: "m/s",
            operatingConditions: "Arm in secure low-CG tuck pose with dynamic safety scanning active",
            source: "src:iso-3691-4-2023",
            verificationStatus: "verified",
            applicableConfiguration: "Safe Transit",
            subject: "Mobility",
          },
          {
            parameter: "Total Combined System DoF",
            value: "9 to 10",
            unit: "Degrees of Freedom",
            operatingConditions: "Planar 3-DoF mobile platform plus 6-DoF or 7-DoF articulated arm",
            source: "src:iso-8373-2021",
            verificationStatus: "verified",
            applicableConfiguration: "Full System",
            subject: "Physical Architecture",
          },
        ],
        configurations: [
          {
            configId: "cfg:moma-cnctending",
            configName: "Machine Tending Mobile Manipulator",
            description: "Automates workpiece loading and unloading across multiple CNC machining centers.",
            targetPayload: "12 kg at tool tip",
            primaryDrivetrain: "Omnidirectional Mecanum mobile base + 6-DoF cobot arm",
            powerSource: "48V 2.5 kWh industrial battery",
            keyTradeoff: "Requires precise dock docking markers at each machine tool.",
          },
        ],
        operatingPrinciple: {
          kinematicChain: "Serial arm kinematic chain attached to planar 3-DoF mobile base (total 9-DoF system).",
          actuationTechnology: "Hollow-bore strain-wave joint actuators coupled with brushless mobile wheel servos.",
          controlLoopFrequency: "Coordinated whole-body trajectory control at 250 Hz.",
          sensorFusionPipeline: "Base safety LiDARs + 3D vision on wrist for workpiece pose estimation (6D pose).",
          mathematicalFoundation: "Task-priority inverse kinematics managing mobile base position and arm reach simultaneously.",
          failureModesAndFailsafes: "Arm parks in low center-of-gravity tuck position during rapid platform transit.",
        },
        compatibleComponents: [
          {
            componentId: "line:robot-controllers",
            lineId: "robot-controllers",
            name: "Integrated Cobot & AMR Fleet Motion Controller",
            relationshipType: "verified compatibility",
            notes: "Synchronizes arm motion commands with VDA 5050 mobile dispatch.",
          },
        ],
        applications: [
          {
            applicationId: "metalMachining",
            name: "Metal Fabrication & CNC Machining",
            domain: "Industrial Manufacturing",
            deploymentNotes: "Autonomous loading of raw billets and unloading of finished milled components across 12 CNC cells.",
          },
        ],
        resources: [
          {
            title: "Mobile Manipulator Tipping Stability Analysis",
            type: "Engineering Guide",
            referenceId: "guide:moma-tipping-stability",
          },
        ],
      },
    ],
  },

  // ==========================================
  // PILLAR 04: ROBOTIC MULES & LEGGED/HEAVY UGVs
  // ==========================================
  {
    id: "pillar:robotic-mules-ugvs",
    categoryNumber: "04",
    title: "Robotic Mules and Legged/Heavy-Duty UGVs",
    shortTitle: "Robotic Mules & UGVs",
    tagline: "Quadruped robots, tracked vehicles, rugged wheeled carriers, and off-road inspection platforms",
    definition:
      "All-terrain unmanned ground vehicles (UGVs) and legged dynamic systems engineered for unstructured, hazardous, or off-road environments inaccessible to wheeled indoor platforms. Features high-clearance suspension, continuous tracks, or multi-DoF articulated legs for traversing gravel, mud, rubble, and industrial stairs.",
    governingStandards: ["ISO 8373:2021", "ATEX Directive 2014/34/EU", "IECEx", "MIL-STD-810H"],
    image: leggedMuleImg,
    representativeTypes: [
      "Quadruped Legged Robots (Robot Dogs)",
      "Heavy-Duty Autonomous Load Mules",
      "Tracked All-Terrain Inspection UGVs",
      "Multi-Wheel Rugged Carriers",
      "ATEX Zone 1/2 Certified Hazard Crawlers",
      "Off-Road Pipeline & Substation Patrol Robots",
    ],
    typicalEngineeringConsiderations: [
      "Dynamic gait stabilization over unstable gravel, wet metal stairs, and slippery pipes",
      "High-power density quasi-direct-drive (QDD) actuators with low gear reduction for force transparency",
      "Thermal management in sealed IP67 enclosures operating in direct sunlight or freezing rain",
      "ATEX / IECEx explosive atmosphere intrinsic safety engineering for petrochemical yards",
      "Long-range encrypted radio telemetry / private LTE / satellite link backhaul",
    ],
    subcategories: [
      {
        id: "subcat:quadruped-ugv",
        pillarId: "pillar:robotic-mules-ugvs",
        title: "Quadruped Inspection Robot",
        shortTitle: "Quadruped Robot",
        summary: "Four-legged dynamic walking robot for autonomous inspection in complex industrial facilities.",
        definition:
          "Dynamic legged ground robot featuring four 3-DoF articulated legs (12 active joints) capable of trotting, stair climbing, autonomous path planning over gravel and grating, and carrying thermal/gas/acoustic payloads.",
        ifrClassification: "Service Robot - Professional",
        isoStandardRef: "ISO 8373:2021 & IEC 60529 (IP67)",
        facets: {
          morphology: ["quadruped-legged"],
          mobility: ["dynamic-legged"],
          environment: ["rugged-offroad", "factory-floor", "underground-mine"],
          domain: ["inspection-maintenance", "energy-subsea", "defense-security"],
          capability: ["extreme-obstacle-traversal"],
          autonomy: ["goal-directed-autonomous"],
          manipulation: ["non-manipulative", "iso-tool-flange"],
          deployment: ["edge-ai-standalone"],
        },
        representativeProducts: ["Boston Dynamics Spot", "ANYbotics ANYmal X", "Unitree B2", "Ghost Robotics Vision 60"],
        engineeringConsiderations: [
          "Quasi-direct-drive actuators with gear ratio <10:1 provide high backdrivability for shock absorption",
          "Stair climbing requires active pitch adjustment and 3D visual perception of step edges",
          "Payload mounting rail must preserve center-of-gravity limits for dynamic trotting stability",
        ],
        specifications: [
          {
            parameter: "Payload Capacity (Walking)",
            value: "10.0 to 20.0",
            unit: "kg",
            operatingConditions: "Mounted on dorsal structural accessory rail",
            source: "src:iso-8373-2021",
            verificationStatus: "verified",
            applicableConfiguration: "Inspection Payload",
            subject: "Payload and Performance",
          },
          {
            parameter: "Maximum Forward Speed",
            value: "1.6 to 2.0",
            unit: "m/s",
            operatingConditions: "Flat terrain dynamic trotting gait",
            source: "src:iso-8373-2021",
            verificationStatus: "verified",
            applicableConfiguration: "Trotting Mode",
            subject: "Mobility",
          },
          {
            parameter: "Maximum Stair Angle",
            value: "Up to 35",
            unit: "deg",
            operatingConditions: "Standard industrial open-grate and concrete stairs",
            source: "src:iso-8373-2021",
            verificationStatus: "verified",
            applicableConfiguration: "Stair Mode",
            subject: "Mobility",
          },
          {
            parameter: "Environmental Ingress Protection",
            value: "IP67 (Submersible to 1m)",
            unit: "IP Rating",
            operatingConditions: "Heavy rain, salt fog, dust immersion",
            source: "src:iso-8373-2021",
            verificationStatus: "verified",
            applicableConfiguration: "Rugged Chassis",
            subject: "Operating Environment",
          },
          {
            parameter: "Continuous Operating Runtime",
            value: "90 to 150",
            unit: "minutes",
            operatingConditions: "Continuous walking with 10 kg sensor payload",
            source: "src:iso-8373-2021",
            verificationStatus: "verified",
            applicableConfiguration: "Single Battery",
            subject: "Power and Energy",
          },
        ],
        configurations: [
          {
            configId: "cfg:quad-atex",
            configName: "ATEX Zone 1 Certified Hazardous Quadruped",
            description: "Encapsulated flameproof housings, non-sparking foot pads, and gas detection sensors.",
            targetPayload: "15 kg dorsal rail",
            primaryDrivetrain: "Custom hermetic planetary QDD actuators",
            powerSource: "Intrinsically safe sealed Li-ion pack",
            keyTradeoff: "Heavy shielding increases total mass to 52 kg.",
          },
        ],
        operatingPrinciple: {
          kinematicChain: "Four 3-DoF serial legs (hip abduction, hip pitch, knee pitch).",
          actuationTechnology: "Low-gear-ratio planetary quasi-direct-drive brushless actuators with phase torque sensing.",
          controlLoopFrequency: "Model Predictive Control (MPC) running at 250 Hz; Joint PD control at 1 kHz.",
          sensorFusionPipeline: "Front and rear 3D depth cameras + Solid-state 360° LiDAR + 6-axis IMU in each foot pad.",
          mathematicalFoundation: "Convex MPC for contact force distribution across support polygon.",
          failureModesAndFailsafes: "Controlled sit-down descent upon sudden actuator over-temperature or comms loss.",
        },
        compatibleComponents: [
          {
            componentId: "line:servo-motors",
            lineId: "servo-motors",
            name: "High-Torque-Density Frameless Torque Motors",
            relationshipType: "verified compatibility",
            notes: "Used in knee and hip joint housings for maximum torque-to-weight ratio.",
          },
          {
            componentId: "line:machine-vision",
            lineId: "machine-vision",
            name: "Industrial Radiometric Thermal & PTZ Cameras",
            relationshipType: "verified compatibility",
            notes: "Inspection payload for overheating bearings and electrical hot spots.",
          },
        ],
        applications: [
          {
            applicationId: "energy",
            name: "Energy & Utilities",
            domain: "Petrochemical & Power",
            deploymentNotes: "Autonomous thermal inspection of oil refineries, high-voltage transformers, and offshore platforms.",
          },
        ],
        resources: [
          {
            title: "ATEX Certified Robotics Guidelines for Explosive Atmospheres",
            type: "Whitepaper",
            referenceId: "whitepaper:atex-robotics-guide",
          },
        ],
      },
    ],
  },

  // ==========================================
  // PILLAR 05: AERIAL ROBOTICS
  // ==========================================
  {
    id: "pillar:aerial-robotics",
    categoryNumber: "05",
    title: "Aerial Robotics",
    shortTitle: "Aerial Robotics",
    tagline: "Multirotor drones, fixed-wing UAVs, hybrid VTOL, and cage-protected inspection systems",
    definition:
      "Unmanned Aircraft Systems (UAS) and aerial robotic platforms equipped with autonomous flight controllers, collision avoidance, and specialized sensor or manipulation payloads. Operates in low-altitude airspace and GPS-denied confined industrial assets (storage tanks, boilers, bridges).",
    governingStandards: ["ISO 21384-3:2023", "ASTM F38", "FAA Part 107 / EASA UAS Specific"],
    image: aerialImg,
    representativeTypes: [
      "Multirotor Drones (Hexacopters & Octocopters)",
      "Fixed-Wing Autonomous UAVs",
      "Hybrid VTOL (Vertical Take-Off & Landing) Platforms",
      "Confined-Space Cage-Protected Inspection Drones",
      "Agricultural Spraying & Multispectral UAVs",
      "Aerial Manipulation Drones with Grasping Arms",
    ],
    typicalEngineeringConsiderations: [
      "Power-to-weight ratio and aerodynamic motor efficiency (g/W) for flight endurance",
      "GPS-denied visual-inertial odometry (VIO) inside metallic vessels and under bridges",
      "Collision-tolerant carbon-fiber roll-cages for enclosed tank inspection",
      "Gimbal-stabilized dual radiometric thermal and high-magnification optical zoom payloads",
      "Automated parachute deployment and motor-loss redundancy failsafe logic",
    ],
    subcategories: [
      {
        id: "subcat:drone-confined-inspection",
        pillarId: "pillar:aerial-robotics",
        title: "Confined-Space Industrial Inspection Drone",
        shortTitle: "Confined-Space Drone",
        summary: "Collision-resilient cage-protected multirotor for GPS-denied boilers, pipes, and tanks.",
        definition:
          "Specialized multirotor aerial robot encased in a carbon-fiber protective collision cage with integrated LiDAR, 4K camera, thermal sensor, and ultrasonic thickness gauge. Navigates metallic tanks without human line-of-sight.",
        ifrClassification: "Service Robot - Professional",
        isoStandardRef: "ISO 21384-3:2023 & ASTM F38",
        facets: {
          morphology: ["multirotor-airframe"],
          mobility: ["aerial-rotary"],
          environment: ["open-airspace", "factory-floor", "underground-mine"],
          domain: ["inspection-maintenance", "energy-subsea"],
          capability: ["radiometric-aerial-scanning"],
          autonomy: ["supervised-semi-autonomous"],
          manipulation: ["non-manipulative"],
          deployment: ["edge-ai-standalone"],
        },
        representativeProducts: ["Flyability Elios 3", "DJI Matrice 350 RTK", "Skydio X10", "Volocopter Industrial"],
        engineeringConsiderations: [
          "Carbon cage rolls along walls without propeller strikes",
          "Dust-penetrating pulsed LiDAR builds 3D metric maps in zero-visibility smoke/steam",
          "10,000 lumen oblique lighting reveals micro-cracks and corrosion pitting on steel surfaces",
        ],
        specifications: [
          {
            parameter: "Maximum Takeoff Weight (MTOW)",
            value: "2.3",
            unit: "kg",
            operatingConditions: "Including battery, carbon cage, and sensor payload",
            source: "src:faa-part-107-astm-f38",
            verificationStatus: "verified",
            applicableConfiguration: "All-in-One Cage",
            subject: "Physical Architecture",
          },
          {
            parameter: "Flight Endurance",
            value: "12.5 to 14.0",
            unit: "minutes",
            operatingConditions: "Hovering inside tank with full 10,000 lm lighting active",
            source: "src:faa-part-107-astm-f38",
            verificationStatus: "verified",
            applicableConfiguration: "Standard LiPo",
            subject: "Power and Energy",
          },
          {
            parameter: "Localization in GPS-Denied Space",
            value: "Dual SLAM LiDAR + Optical Flow + IMU",
            unit: "Sensor Suite",
            operatingConditions: "Complete dark steel boiler interior",
            source: "src:faa-part-107-astm-f38",
            verificationStatus: "verified",
            applicableConfiguration: "GPS-Denied SLAM",
            subject: "Sensors and Perception",
          },
          {
            parameter: "Illumination Flux",
            value: "10,000",
            unit: "lumens",
            operatingConditions: "Dimmable oblique LED array for surface defect contrast",
            source: "src:faa-part-107-astm-f38",
            verificationStatus: "verified",
            applicableConfiguration: "Lighting System",
            subject: "Physical Architecture",
          },
        ],
        configurations: [
          {
            configId: "cfg:drone-ndt",
            configName: "Ultrasonic Thickness (UT) Payload Drone",
            description: "Equipped with extending arm probe with gel dispenser for steel wall thickness measurement.",
            targetPayload: "0.5 kg probe",
            primaryDrivetrain: "High-efficiency brushless motors with carbon-fiber propellers",
            powerSource: "6S High-C LiPo flight battery",
            keyTradeoff: "Reduced flight endurance to 10 minutes.",
          },
        ],
        operatingPrinciple: {
          kinematicChain: "Quadrotor / hexarotor thrust vectoring in 6-DoF.",
          actuationTechnology: "Direct-drive brushless outrunner motors with electronic speed controllers (ESCs).",
          controlLoopFrequency: "Attitude rate loop 1 kHz; Navigation position loop 100 Hz.",
          sensorFusionPipeline: "3D LiDAR point cloud matching + Visual-Inertial Odometry (VIO) + Barometer.",
          mathematicalFoundation: "Quaternion-based attitude dynamics and non-linear SE(3) geometric tracking.",
          failureModesAndFailsafes: "Loss of telemetry triggers automated reverse-path retreat along incoming flight path.",
        },
        compatibleComponents: [
          {
            componentId: "line:machine-vision",
            lineId: "machine-vision",
            name: "Micro Radiometric Thermal Sensor Core",
            relationshipType: "verified compatibility",
            notes: "High-resolution thermal camera for vessel wall insulation and refractory lining inspection.",
          },
        ],
        applications: [
          {
            applicationId: "energy",
            name: "Energy & Petrochemical Boilers",
            domain: "Asset Inspection",
            deploymentNotes: "Eliminates dangerous scaffolding inside 50-meter-tall power generation boilers.",
          },
        ],
        resources: [
          {
            title: "Confined Space Drone Inspection Engineering Manual",
            type: "Engineering Guide",
            referenceId: "guide:confined-drone-inspection",
          },
        ],
      },
    ],
  },

  // ==========================================
  // PILLAR 06: UNDERWATER ROBOTICS
  // ==========================================
  {
    id: "pillar:underwater-robotics",
    categoryNumber: "06",
    title: "Underwater Robotics",
    shortTitle: "Underwater Robotics",
    tagline: "Work-class ROVs, autonomous AUVs, hybrid crawlers, and deep-sea manipulators",
    definition:
      "Submersible robotic systems operating in marine, coastal, and offshore environments. Includes Remotely Operated Vehicles (ROVs) controlled via armored umbilical cables, Autonomous Underwater Vehicles (AUVs) executing pre-programmed acoustic surveys, and benthic crawling platforms equipped with subsea manipulators.",
    governingStandards: ["IMCA R 004", "DNV-RP-0417", "ISO 13628-8", "ISO 8373:2021"],
    image: underwaterImg,
    representativeTypes: [
      "Work-Class ROVs (75–150 kW)",
      "Observation & Light Intervention ROVs",
      "Autonomous Underwater Vehicles (AUVs)",
      "Hybrid Underwater Vehicles (HUVs)",
      "Benthic Seabed Crawlers & Trenchers",
      "Subsea Hydraulic & Electric Manipulators",
    ],
    typicalEngineeringConsiderations: [
      "Hydrostatic pressure ratings up to 600 bar (6,000 meters ocean depth)",
      "Syntactic foam buoyancy blocks balanced for neutral trim in saline seawater",
      "Pressure-balanced oil-filled (PBOF) electronics enclosures preventing water ingress",
      "Vectored thruster arrangements delivering full 6-DoF station-keeping in 3-knot cross-currents",
      "Acoustic USBL (Ultra-Short Baseline) positioning and Doppler Velocity Log (DVL) navigation",
    ],
    subcategories: [
      {
        id: "subcat:work-class-rov",
        pillarId: "pillar:underwater-robotics",
        title: "Work-Class Remotely Operated Vehicle (ROV)",
        shortTitle: "Work-Class ROV",
        summary: "Heavy subsea intervention platform with dual manipulators and hydraulic tooling skids.",
        definition:
          "Heavy-duty marine robot connected to a surface support vessel via an armored umbilical and Tether Management System (TMS). Delivers 100 to 150 kW of electro-hydraulic power for operating subsea wellheads, pipeline hot-stabs, and heavy bolt torque tools at depths to 3,000 meters.",
        ifrClassification: "Service Robot - Professional",
        isoStandardRef: "IMCA R 004 & DNV-RP-0417",
        facets: {
          morphology: ["subsea-pressure-hull"],
          mobility: ["underwater-vectored"],
          environment: ["marine-subsea"],
          domain: ["energy-subsea"],
          capability: ["deep-water-subsea-intervention"],
          autonomy: ["teleoperated-in-loop"],
          manipulation: ["subsea-heavy-claw"],
          deployment: ["tethered-console"],
        },
        representativeProducts: ["Saab Seaeye Leopard", "Schilling Robotics HD", "Oceaneering Millennium", "FMC Technologies Schilling"],
        engineeringConsiderations: [
          "Umbilical fiber-optic link conveys multi-channel gigabit video and sensor telemetry at 3,000 V AC surface supply",
          "Dual manipulators (7-function rate arm + 7-function master-slave spatial arm) perform complex valve operations",
          "Hydraulic power unit (HPU) supplies 150 L/min at 210 bar for external subsea torque tools",
        ],
        specifications: [
          {
            parameter: "Maximum Operating Depth Rating",
            value: "3,000",
            unit: "meters (MSW)",
            operatingConditions: "Deep ocean hydro-static pressure (approx. 300 bar)",
            source: "src:imca-r004-subsea",
            verificationStatus: "verified",
            applicableConfiguration: "Deep Ocean Rating",
            subject: "Operating Environment",
          },
          {
            parameter: "Total Shaft Propulsion Power",
            value: "100 to 150",
            unit: "kW",
            operatingConditions: "Continuous electro-hydraulic or full electric thruster array",
            source: "src:imca-r004-subsea",
            verificationStatus: "verified",
            applicableConfiguration: "High Power Pack",
            subject: "Power and Energy",
          },
          {
            parameter: "Forward Bollard Pull",
            value: "7.5 to 11.0",
            unit: "kN",
            operatingConditions: "Station-keeping in 3-knot ocean currents",
            source: "src:imca-r004-subsea",
            verificationStatus: "verified",
            applicableConfiguration: "Maximum Thrust",
            subject: "Payload and Performance",
          },
          {
            parameter: "Manipulator Configuration",
            value: "Dual (7-Function Spatial + 5-Function Grabber)",
            unit: "Arms",
            operatingConditions: "Titanium construction with master-slave force feedback",
            source: "src:imca-r004-subsea",
            verificationStatus: "verified",
            applicableConfiguration: "Dual Manipulator Skid",
            subject: "Manipulation",
          },
        ],
        configurations: [
          {
            configId: "cfg:rov-electric",
            configName: "All-Electric Work-Class ROV",
            description: "Replaces noisy hydraulic thrusters with magnetically coupled high-efficiency electric thrusters.",
            targetPayload: "300 kg tooling payload",
            primaryDrivetrain: "Permanent magnet brushless electric thrusters (oil filled)",
            powerSource: "3,000V AC 3-Phase umbilical from vessel",
            keyTradeoff: "Higher electrical efficiency, eliminates environmental hydraulic oil spill risk.",
          },
        ],
        operatingPrinciple: {
          kinematicChain: "Floating 6-DoF rigid body propelled by 7 to 8 vectored thrusters.",
          actuationTechnology: "Brushless AC electric thrusters with pressure-compensated magnetic couplings.",
          controlLoopFrequency: "Dynamic station-keeping loop 50 Hz.",
          sensorFusionPipeline: "Doppler Velocity Log (DVL) + Fiber-Optic Gyroscope (FOG) + Multibeam Sonar + Altimeter.",
          mathematicalFoundation: "Hydrodynamic drag and added-mass matrices integrated into 6-DoF Kalman filter.",
          failureModesAndFailsafes: "Deadman circuit drops buoyancy ballast weights to surface vehicle upon umbilical sever.",
        },
        compatibleComponents: [
          {
            componentId: "line:servo-drives",
            lineId: "servo-drives",
            name: "Pressure-Tolerant Deep-Sea Servo Drives",
            relationshipType: "verified compatibility",
            notes: "Subsea oil-filled servo controllers rated for 300 bar ambient pressure.",
          },
        ],
        applications: [
          {
            applicationId: "energy",
            name: "Offshore Energy & Subsea Infrastructure",
            domain: "Offshore Marine",
            deploymentNotes: "Subsea wellhead tie-ins, pipeline survey, and offshore wind farm cable laying.",
          },
        ],
        resources: [
          {
            title: "IMCA R 004 Subsea ROV Operations & Safety Code",
            type: "ISO Standard",
            referenceId: "src:imca-r004-subsea",
          },
        ],
      },
    ],
  },

  // ==========================================
  // PILLAR 07: LOGISTICS & SUPPLY-CHAIN ROBOTS
  // ==========================================
  {
    id: "pillar:logistics-supply-chain",
    categoryNumber: "07",
    title: "Logistics and Supply-Chain Robots",
    shortTitle: "Logistics & Supply-Chain",
    tagline: "Automated storage and retrieval systems (AS/RS), shuttles, sorting robots, and automated palletising",
    definition:
      "Integrated robotic and automation machinery engineered for high-density warehouse storage, item singulation, high-speed parcel sortation, and automated pallet building. Combines robotic cube grids, autonomous rail-guided shuttles, cross-belt sorters, and high-speed gantry depalletisers.",
    governingStandards: ["ISO 3691-4:2023", "FEM 9.831 / FEM 9.832", "EN 528", "ISO 8373:2021"],
    image: logisticsImg,
    representativeTypes: [
      "Automated Storage & Retrieval Systems (AS/RS Cube & Crane)",
      "High-Density Shuttle Systems (Carton & Pallet)",
      "Autonomous Goods-to-Person Mobile Racks",
      "High-Speed Cross-Belt Sorting Robot Fleets",
      "Automated Mixed-Case Palletising Cells",
      "Autonomous Inventory Scanning Drones & Robots",
    ],
    typicalEngineeringConsiderations: [
      "Throughput picks per hour (PPH) and system availability targets exceeding 99.8%",
      "Volumetric storage density optimization through ultra-narrow aisle and cubic grid configurations",
      "Dynamic acceleration profiles up to 3 m/s² with anti-sway motion control algorithms",
      "WMS / WES enterprise software interface latency and real-time inventory synchronization",
      "Continuous duty mechanical reliability (MTBF > 50,000 hours) for 24/7/365 distribution centers",
    ],
    subcategories: [
      {
        id: "subcat:asrs-cube-grid",
        pillarId: "pillar:logistics-supply-chain",
        title: "Automated Storage & Retrieval Cube Grid (AS/RS)",
        shortTitle: "Cube Grid AS/RS",
        summary: "Ultra-high-density storage grid with autonomous top-running robots retrieving nested bins.",
        definition:
          "Modular aluminum cubic storage framework where high-density plastic bins are stacked vertically without access aisles. A fleet of autonomous battery-powered robots moves along the top grid in X and Y directions, lowering winches to retrieve bins and delivering them to ergonomic pick stations.",
        ifrClassification: "Service Robot - Professional",
        isoStandardRef: "FEM 9.831 & EN 528",
        facets: {
          morphology: ["cartesian-gantry", "wheeled-platform"],
          mobility: ["omnidirectional-mecanum"],
          environment: ["warehouse-logistics"],
          domain: ["logistics-warehousing"],
          capability: ["high-speed-pick-place"],
          autonomy: ["goal-directed-autonomous"],
          manipulation: ["vacuum-suction-matrix", "non-manipulative"],
          deployment: ["cloud-swarm"],
        },
        representativeProducts: ["AutoStore Red Line / Black Line", "Geek+ RoboShuttle", "Symbotic System", "KION Dematic"],
        engineeringConsiderations: [
          "Eliminates empty aisle space to achieve up to 400% higher storage density than traditional shelving",
          "Swarm intelligence algorithms continuously reorganize inventory, keeping high-frequency items on top",
          "Robots use regenerative braking to recharge supercapacitors or lithium battery cells during descent",
        ],
        specifications: [
          {
            parameter: "Bin Retrieval Cycle Time",
            value: "25 to 35",
            unit: "seconds",
            operatingConditions: "Average depth of 8 bins in 16-bin high grid",
            source: "src:ifr-service-2024",
            verificationStatus: "verified",
            applicableConfiguration: "Fast Bin Fetch",
            subject: "Payload and Performance",
          },
          {
            parameter: "Grid Top Robot Velocity",
            value: "3.1 to 4.0",
            unit: "m/s",
            operatingConditions: "Unladen transit across aluminum grid rails",
            source: "src:ifr-service-2024",
            verificationStatus: "verified",
            applicableConfiguration: "Top-Running Robot",
            subject: "Mobility",
          },
          {
            parameter: "Maximum Bin Weight",
            value: "30.0",
            unit: "kg",
            operatingConditions: "Standard injection-molded HDPE tote bin",
            source: "src:ifr-service-2024",
            verificationStatus: "verified",
            applicableConfiguration: "Standard Tote",
            subject: "Payload and Performance",
          },
          {
            parameter: "Storage Volumetric Efficiency",
            value: "Up to 85%",
            unit: "Volume Ratio",
            operatingConditions: "Compared to traditional forklift pallet racking",
            source: "src:ifr-service-2024",
            verificationStatus: "verified",
            applicableConfiguration: "High Density",
            subject: "Physical Architecture",
          },
        ],
        configurations: [
          {
            configId: "cfg:asrs-frozen",
            configName: "Deep-Freeze Cold Storage AS/RS (-25°C)",
            description: "Low-temperature synthetic lubricants, heated battery compartments, and frost-free seals.",
            targetPayload: "30 kg bins",
            primaryDrivetrain: "Cold-rated brushless servo motors with IP65 seals",
            powerSource: "Continuous bus-bar power or low-temp Lithium cells",
            keyTradeoff: "Reduced maximum acceleration to prevent condensation slip on grid rails.",
          },
        ],
        operatingPrinciple: {
          kinematicChain: "X-Y top-grid planar travel with Z-axis 4-wire motorized hoist.",
          actuationTechnology: "Brushless wheel servos with integrated multi-axis gear reducers and motorized hoisting drums.",
          controlLoopFrequency: "Grid traffic optimizer running at 10 Hz; Robot motor control at 1 kHz.",
          sensorFusionPipeline: "Rail optical sensors + wheel encoders + tote height limit switches.",
          mathematicalFoundation: "Multi-agent pathfinding (MAPF) and dynamic routing to prevent grid congestion.",
          failureModesAndFailsafes: "Broken hoist cable detection locks mechanical safety dog into grid uprights.",
        },
        compatibleComponents: [
          {
            componentId: "line:servo-motors",
            lineId: "servo-motors",
            name: "High-Efficiency Brushless DC Servomotors",
            relationshipType: "verified compatibility",
            notes: "Drives top-running grid wheels and hoisting winch drum.",
          },
          {
            componentId: "line:mechanical-transmission",
            lineId: "mechanical-transmission",
            name: "Precision Timing Belts & Wire Hoist Mechanisms",
            relationshipType: "verified compatibility",
            notes: "Smooth vertical hoisting of heavy tote bins.",
          },
        ],
        applications: [
          {
            applicationId: "warehousing",
            name: "E-Commerce & Retail Fulfillment",
            domain: "Warehousing",
            deploymentNotes: "High-throughput pharmaceutical, apparel, and consumer goods micro-fulfillment centers.",
          },
        ],
        resources: [
          {
            title: "Automated Storage and Retrieval Systems (AS/RS) FEM Standard",
            type: "ISO Standard",
            referenceId: "src:iso-3691-4-2023",
          },
        ],
      },
    ],
  },

  // ==========================================
  // PILLAR 08: AUTONOMOUS & SPECIALISED SYSTEMS
  // ==========================================
  {
    id: "pillar:autonomous-specialised",
    categoryNumber: "08",
    title: "Autonomous and Specialised Mechanical Systems",
    shortTitle: "Autonomous & Specialised",
    tagline: "Agricultural, surgical, rehabilitation, mining, construction, and laboratory robotics",
    definition:
      "Domain-specific robotic machinery engineered for highly constrained, regulated, or extreme operating environments. Encompasses precision surgical master-slave systems, agricultural crop harvesting, construction 3D concrete printing, rehabilitation exoskeletons, and laboratory liquid handling workstations.",
    governingStandards: ["IEC 80601-2-77", "ISO 13485", "ISO 18497:2018 (Agricultural tractors & machinery)", "ISO 8373:2021"],
    image: specialisedImg,
    representativeTypes: [
      "Robotic Surgery Platforms (Multi-Arm Laparoscopic)",
      "Robotic Rehabilitation & Powered Exoskeletons",
      "Autonomous Agricultural Harvesting & Weeding Robots",
      "Construction & 3D Concrete Printing Systems",
      "Autonomous Mining Haulage & Drilling Rigs",
      "Commercial Façade & Solar Panel Cleaning Robots",
      "Laboratory Automation & High-Throughput Screening Workstations",
      "Space & Planetary Rover Mechanisms",
    ],
    typicalEngineeringConsiderations: [
      "Medical regulatory compliance (FDA 510(k), CE MDR Class IIb/III, IEC 60601-1)",
      "Sub-millimeter motion scaling with haptic tremor filtering and zero mechanical backlash",
      "Sterile drape interfaces, autoclavable instrument wrists, and single-fault containment",
      "Agricultural RTK-GNSS sub-inch positioning with AI weed detection in direct sunlight",
      "Ultra-high reliability and functional isolation preventing uncontrolled actuator excursions",
    ],
    subcategories: [
      {
        id: "subcat:surgical-robotics",
        pillarId: "pillar:autonomous-specialised",
        title: "Robotic Surgical System (Multi-Arm Laparoscopic)",
        shortTitle: "Surgical Robot",
        summary: "Master-slave teleoperated surgical console with articulated micro-instruments for minimally invasive surgery.",
        definition:
          "Robotically assisted surgical system comprising a surgeon control console with 3D high-definition stereoscopic viewer, master manipulators with haptic feedback, and a multi-arm patient cart holding micro-articulated EndoWrist surgical instruments.",
        ifrClassification: "Service Robot - Specialized",
        isoStandardRef: "IEC 80601-2-77:2019 & ISO 13485",
        facets: {
          morphology: ["articulated-arm", "specialised-kinematics"],
          mobility: ["stationary-fixed"],
          environment: ["clinical-or"],
          domain: ["healthcare-surgery"],
          capability: ["micro-precision-surgery"],
          autonomy: ["teleoperated-in-loop"],
          manipulation: ["micro-surgical-wrist"],
          deployment: ["workcell-integrated"],
        },
        representativeProducts: ["Intuitive Surgical da Vinci Xi", "Medtronic Hugo RAS", "CMR Surgical Versius", "Asensus Senhance"],
        engineeringConsiderations: [
          "Master-slave motion scaling (e.g. 3:1 or 5:1 ratio) translates surgeon hand movements into micro-scale tissue dissection",
          "Active digital filtering eliminates physiological hand tremor (6–12 Hz band)",
          "Cable-driven 7-DoF micro-wrists must withstand repeated autoclaving or operate as single-use sterile cartridges",
        ],
        specifications: [
          {
            parameter: "Instrument Tip Degrees of Freedom",
            value: "7 (Including wrist roll, pitch, yaw, and grip)",
            unit: "DoF",
            operatingConditions: "Within confined laparoscopic cavity through 8 mm trocar port",
            source: "src:iec-80601-2-77",
            verificationStatus: "verified",
            applicableConfiguration: "EndoWrist Tooling",
            subject: "Manipulation",
          },
          {
            parameter: "Motion Scaling Ratios",
            value: "1:1, 2:1, 3:1, and 5:1",
            unit: "Ratio",
            operatingConditions: "Configurable by operating surgeon at console",
            source: "src:iec-80601-2-77",
            verificationStatus: "verified",
            applicableConfiguration: "Surgeon Console",
            subject: "Control System",
          },
          {
            parameter: "Tremor Rejection Frequency Band",
            value: "6 to 12",
            unit: "Hz",
            operatingConditions: "Continuous digital low-pass and notch filtering",
            source: "src:iec-80601-2-77",
            verificationStatus: "verified",
            applicableConfiguration: "Tremor Filter",
            subject: "Control System",
          },
          {
            parameter: "Stereoscopic Endoscope Resolution",
            value: "Dual 1080p / 4K 3D at 60 fps",
            unit: "Resolution",
            operatingConditions: "Latency <15 ms from camera sensor to surgeon eye piece",
            source: "src:iec-80601-2-77",
            verificationStatus: "verified",
            applicableConfiguration: "Vision System",
            subject: "Sensors and Perception",
          },
          {
            parameter: "Medical Device Regulatory Classification",
            value: "FDA Class II / EU MDR Class IIb / Class III",
            unit: "Regulatory Class",
            operatingConditions: "Full clinical trial validation and software lifecycle IEC 62304",
            source: "src:iec-80601-2-77",
            verificationStatus: "verified",
            applicableConfiguration: "Medical Clearance",
            subject: "Safety and Compliance",
          },
        ],
        configurations: [
          {
            configId: "cfg:surg-quad-arm",
            configName: "4-Arm Patient Cart System",
            description: "Three instrument arms plus one 3D endoscopic camera arm mounted on overhead boom.",
            targetPayload: "0.8 kg tool tip force limit",
            primaryDrivetrain: "Zero-backlash miniature brushless servomotors + precision tungsten cable capstans",
            powerSource: "Isolated medical-grade AC mains with backup UPS",
            keyTradeoff: "Requires specialized cleanroom assembly and strict sterile draping protocols.",
          },
        ],
        operatingPrinciple: {
          kinematicChain: "Remotely actuated cable-driven serial micro-manipulators passing through stationary remote center of motion (RCM).",
          actuationTechnology: "High-precision coreless DC and brushless servomotors with optical encoders and tension monitoring.",
          controlLoopFrequency: "Master-slave bilateral teleoperation control running at 1.5 kHz.",
          sensorFusionPipeline: "Console ergonomic hand controllers + 3D endoscope + instrument force sensors.",
          mathematicalFoundation: "Remote Center of Motion (RCM) kinematic invariant preventing tearing of abdominal wall incision.",
          failureModesAndFailsafes: "Redundant dual-channel encoders; emergency mechanical instrument release lever.",
        },
        compatibleComponents: [
          {
            componentId: "ind-pr-sw-sealed-mini",
            lineId: "precision-reducers",
            name: "Miniature Sealed Strain-Wave Reducer (SW-500)",
            relationshipType: "verified compatibility",
            notes: "Used in surgeon console master input arms for zero-backlash haptic tracking.",
          },
          {
            componentId: "line:sensors-encoders",
            lineId: "sensors-encoders",
            name: "Sub-Micron High-Resolution Encoders",
            relationshipType: "verified compatibility",
            notes: "Provides precise position feedback required for microscopic tissue manipulation.",
          },
        ],
        applications: [
          {
            applicationId: "medical",
            name: "Minimally Invasive Surgery & Healthcare",
            domain: "Clinical Medicine",
            deploymentNotes: "Urological prostatectomies, gynecological procedures, cardiothoracic, and general surgery.",
          },
        ],
        resources: [
          {
            title: "IEC 80601-2-77 Medical Robotically Assisted Surgical Equipment Standard",
            type: "ISO Standard",
            referenceId: "src:iec-80601-2-77",
          },
        ],
      },
      {
        id: "subcat:agri-harvesting-robot",
        pillarId: "pillar:autonomous-specialised",
        title: "Autonomous Agricultural Harvesting & Weeding Robot",
        shortTitle: "Agricultural Robot",
        summary: "All-terrain autonomous field vehicle equipped with multi-spectral vision and high-speed weed targeting.",
        definition:
          "Autonomous agricultural machine operating in outdoor farm fields, using RTK-GPS and AI multispectral cameras to identify individual weeds and crops, applying micro-doses of herbicide or targeted laser ablation while navigating crop rows.",
        ifrClassification: "Service Robot - Professional",
        isoStandardRef: "ISO 18497:2018 & ISO 8373:2021",
        facets: {
          morphology: ["wheeled-platform"],
          mobility: ["steered-traction", "tracked-tread"],
          environment: ["rugged-offroad"],
          domain: ["agritech-forestry"],
          capability: ["slam-navigation-transport", "high-speed-pick-place"],
          autonomy: ["goal-directed-autonomous"],
          manipulation: ["iso-tool-flange"],
          deployment: ["edge-ai-standalone"],
        },
        representativeProducts: ["Carbon Robotics LaserWeeder", "John Deere See & Spray", "Agrobot E-Series", "Naïo Technologies"],
        engineeringConsiderations: [
          "Operates in continuous direct solar radiation, dust, mud, and vibration",
          "Sub-inch RTK-GNSS positioning keeps heavy wheels strictly inside furrow lanes to avoid soil compaction",
          "Edge AI inference must classify up to 5,000 plants per minute on the fly",
        ],
        specifications: [
          {
            parameter: "Field Processing Rate",
            value: "1.5 to 3.0",
            unit: "hectares/hour",
            operatingConditions: "Standard 40-foot boom width over commercial row crops",
            source: "src:ifr-service-2024",
            verificationStatus: "verified",
            applicableConfiguration: "Commercial Boom",
            subject: "Payload and Performance",
          },
          {
            parameter: "Navigation Accuracy (RTK-GNSS)",
            value: "±20",
            unit: "mm",
            operatingConditions: "Clear sky dual-frequency satellite lock",
            source: "src:ifr-service-2024",
            verificationStatus: "verified",
            applicableConfiguration: "RTK Mode",
            subject: "Sensors and Perception",
          },
          {
            parameter: "Weed Detection Precision",
            value: ">98.5%",
            unit: "Classification Accuracy",
            operatingConditions: "Daylight and night operation with strobe LED arrays",
            source: "src:ifr-service-2024",
            verificationStatus: "verified",
            applicableConfiguration: "AI Model",
            subject: "Sensors and Perception",
          },
          {
            parameter: "Portal Axle Ground Clearance",
            value: "800 to 1,200",
            unit: "mm",
            operatingConditions: "Over mature row crop canopies (corn, cotton, brassicas)",
            source: "src:ifr-service-2024",
            verificationStatus: "verified",
            applicableConfiguration: "High-Clearance Chassis",
            subject: "Physical Architecture",
          },
          {
            parameter: "Continuous Daily Field Endurance",
            value: "14.0 to 18.0",
            unit: "hours",
            operatingConditions: "Diesel-electric hybrid or swappable high-capacity battery bank",
            source: "src:ifr-service-2024",
            verificationStatus: "verified",
            applicableConfiguration: "Continuous Operation",
            subject: "Power and Energy",
          },
        ],
        configurations: [
          {
            configId: "cfg:agri-laser",
            configName: "High-Power Laser Weeding Configuration",
            description: "High-speed CO2 or fiber laser galvo scanners targeting plant meristem tissue.",
            targetPayload: "30 laser modules",
            primaryDrivetrain: "High-clearance portal axles with hydraulic or electric hub motors",
            powerSource: "Diesel generator hybrid or 48V solar-assisted battery bank",
            keyTradeoff: "Requires active laser safety shroud enclosure.",
          },
        ],
        operatingPrinciple: {
          kinematicChain: "Four-wheel independent steer and drive portal chassis with high ground clearance (up to 1.2 m).",
          actuationTechnology: "Brushless planetary hub drives with sealed IP67 electric steering actuators.",
          controlLoopFrequency: "50 Hz furrow tracking navigation; 120 Hz vision plant classification.",
          sensorFusionPipeline: "Dual RTK-GNSS antennas + IMU + 12 downward-facing multispectral cameras.",
          mathematicalFoundation: "Dubins curve path planning within headland turnaround zones.",
          failureModesAndFailsafes: "Front ultrasonic obstacle bar immediately halts vehicle upon detecting livestock or humans.",
        },
        compatibleComponents: [
          {
            componentId: "line:machine-vision",
            lineId: "machine-vision",
            name: "High-Speed Multispectral Machine Vision Cameras",
            relationshipType: "verified compatibility",
            notes: "Used for real-time vegetative index (NDVI) crop and weed discrimination.",
          },
        ],
        applications: [
          {
            applicationId: "agriculture",
            name: "Agritech & Sustainable Agriculture",
            domain: "Agriculture",
            deploymentNotes: "Eliminates chemical herbicide spraying through non-chemical robotic laser weeding.",
          },
        ],
        resources: [
          {
            title: "ISO 18497 Agricultural Machinery & Tractors Safety Standard",
            type: "ISO Standard",
            referenceId: "src:iso-3691-4-2023",
          },
        ],
      },
    ],
  },
];

/**
 * Quick access helpers and canonical lookup functions
 */
export function getAllPillars(): TaxonomyPillar[] {
  return TOTAL_ROBOTICS_PILLARS;
}

export function getPillarById(pillarId: string): TaxonomyPillar | undefined {
  return TOTAL_ROBOTICS_PILLARS.find((p) => p.id === pillarId);
}

export function getAllSubcategories(): TaxonomySubcategory[] {
  return TOTAL_ROBOTICS_PILLARS.flatMap((p) => p.subcategories);
}

export function getSubcategoryById(subcatId: string): TaxonomySubcategory | undefined {
  for (const pillar of TOTAL_ROBOTICS_PILLARS) {
    const found = pillar.subcategories.find((s) => s.id === subcatId);
    if (found) return found;
  }
  return undefined;
}
