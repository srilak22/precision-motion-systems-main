import {
  ALL_18_APPLICATIONS,
  getApplicationBySlug,
  APPLICATION_ALIASES,
  type IndustrialUseCase,
  type ApplicationArea,
} from "./applicationsUniverse";

export interface ApplicationItem {
  id: string;
  title: string;
  shortDescription: string;
  heroSubtitle: string;
  industryOverview: string;
  automationChallenges: {
    title: string;
    description: string;
    points: string[];
  };
  roboticOpportunity: {
    title: string;
    description: string;
    points: string[];
  };
  recommendedTechnologies: string[];
  typicalApplications: string[];
  systemArchitecture: {
    step: string;
    title: string;
    description: string;
  }[];
  relevantProducts: {
    name: string;
    category: string;
    href: string;
    description: string;
  }[];
  technicalResources: {
    title: string;
    type: string;
    href: string;
  }[];
  useCases?: IndustrialUseCase[];
  // Enhanced Step 4 specifications
  workpieceType?: string;
  payloadRequirements?: string;
  positioningRepeatability?: string;
  operatingEnvironment?: string;
  cycleTimeConsiderations?: string;
  sensingControlRequirements?: string;
  technicalConsiderations?: {
    title: string;
    description: string;
    points: string[];
  };
  safetyRequirements?: {
    title: string;
    standards: string[];
    guidelines: string[];
  };
  faqs?: {
    question: string;
    answer: string;
  }[];
}

export const applicationsData: ApplicationItem[] = [
  {
    id: "automotive",
    title: "Automotive",
    shortDescription:
      "Body welding, component assembly, powertrain handling, and battery pack lines.",
    heroSubtitle:
      "High-precision robotics meeting the extreme uptime and sub-millimeter tolerances of modern EV & automotive production.",
    industryOverview:
      "The automotive sector demands continuous, high-volume production with zero unplanned downtime. As manufacturing shifts rapidly toward electric vehicle architectures, body-in-white structures, high-voltage battery assemblies, and tight powertrain integration require extreme stiffness, multi-axis reach, and rapid tool changing capabilities.",
    automationChallenges: {
      title: "Manufacturing Hurdles in Modern Automotive Plants",
      description:
        "Automotive assembly lines operate at takt times under 60 seconds. Mechanical drivetrains must endure continuous high-payload spot welding and rapid acceleration without thermal drift or joint backlash.",
      points: [
        "High continuous mechanical shock from spot-welding guns and heavy sheet metal handling",
        "Stringent safety regulations for shared human-robot zones along final trim and chassis dress",
        "Complex thermal management required inside high-density EV battery module assembly",
        "Rigorous quality auditing requiring continuous torque and position data logging",
      ],
    },
    roboticOpportunity: {
      title: "Where Robotic Automation Excels",
      description:
        "Articulated industrial robots coupled with zero-backlash reducers deliver repeatable welding bead quality, micro-precision adhesive dispensing, and automated heavy door and chassis decking.",
      points: [
        "Heavy payload handling up to 300kg with repeatable positioning within ±0.04mm",
        "Synchronized dual-arm coordination for complex frame manipulation",
        "Automated mobile robots (AMRs) feeding sub-assemblies directly to line-side stations",
        "Deterministic fieldbus integration directly into automotive plant DCS/MES networks",
      ],
    },
    recommendedTechnologies: [
      "6-Axis Articulated Robots",
      "High-Torque Cycloidal Reducers",
      "Servo Welding Controllers",
      "Heavy AMR Transporters",
      "3D Seam Tracking Vision",
    ],
    typicalApplications: [
      "Body-in-white spot and laser welding",
      "EV battery module insertion and laser busbar welding",
      "Powertrain robotic machining tending",
      "Windshield and panoramic roof urethane dispensing",
      "End-of-line vehicle inspection and door gap measurement",
    ],
    systemArchitecture: [
      {
        step: "01",
        title: "Part Decking & Fixturing",
        description:
          "Automated clamps lock sheet metal stampings into position with pneumatic interlocks.",
      },
      {
        step: "02",
        title: "Robotic Arc / Spot Process",
        description:
          "High-payload robot executes pre-programmed weld sequence with active current feedback.",
      },
      {
        step: "03",
        title: "Vision Inspection",
        description: "In-line 3D laser sensor inspects weld seam integrity and bead height.",
      },
      {
        step: "04",
        title: "Line Transfer",
        description:
          "Conveyor or AMR transfers vehicle shell to next station within synchronized takt time.",
      },
    ],
    relevantProducts: [
      {
        name: "6-Axis Robotic Arm",
        category: "Robotic Arms",
        href: "/products/robotic-arms",
        description: "High-stiffness articulated arm for body assembly and welding.",
      },
      {
        name: "Precision Robotic Reducer",
        category: "Precision Reducers",
        href: "/products/precision-reducers",
        description: "Low-backlash cycloidal reducers for high-torque robotic joints.",
      },
      {
        name: "AMR Drive Wheel Unit",
        category: "Robotic Wheels",
        href: "/products/robotic-wheels",
        description: "High-capacity traction units for automotive line-side material AGVs.",
      },
    ],
    technicalResources: [
      {
        title: "Automotive Welding Robotic Sizing Matrix",
        type: "Datasheet",
        href: "/resources?type=datasheet",
      },
      {
        title: "EV Battery Pack Assembly Automation",
        type: "Application Note",
        href: "/resources?type=app-note",
      },
    ],
  },
  {
    id: "electronics",
    title: "Electronics",
    shortDescription:
      "Precision assembly, cleanroom component handling, PCB testing, and micro-dispensing.",
    heroSubtitle:
      "Sub-micron repeatability and cleanroom-compliant automation for high-density electronic assemblies.",
    industryOverview:
      "Consumer electronics and semiconductor manufacturing demand microscopic precision, electrostatic discharge (ESD) protection, and high-speed cycle times. Robotic systems must assemble delicate micro-connectors, dispense thermal adhesives with exact bead volumes, and manipulate silicon wafers without contamination.",
    automationChallenges: {
      title: "Assembly Challenges at the Micro Scale",
      description:
        "Miniaturization leaves zero room for error. Component fragility means mechanical overshoot can crush fragile silicon chips, while trace particulate contamination destroys cleanroom yields.",
      points: [
        "Fragile micro-components damaged by unregulated insertion forces",
        "Electrostatic discharge (ESD) risks destroying sensitive semiconductor ICs",
        "Cleanroom contamination limits (ISO 4 to ISO 6) requiring specialized materials and seals",
        "High-density PCBs requiring precision optical alignment prior to placement",
      ],
    },
    roboticOpportunity: {
      title: "Ultra-Precision Robotic Solutions",
      description:
        "Compact 4-axis SCARA and precision collaborative robots equipped with sub-micron encoders and sensitive force feedback achieve repeatable assembly at speeds up to 120 cycles per minute.",
      points: [
        "Force-controlled insertion preventing micro-connector pin bending",
        "ESD-safe coatings and cleanroom-sealed joint housings",
        "Sub-10 micron placement accuracy enabled by direct-drive rotary actuators",
        "High-speed optical vision integration for fly-by component inspection",
      ],
    },
    recommendedTechnologies: [
      "Direct-Drive Actuators",
      "Cleanroom Harmonic Reducers",
      "High-Speed SCARA Arms",
      "Force-Torque End Effectors",
      "2D/3D Telecentric Vision",
    ],
    typicalApplications: [
      "PCB micro-component pick and place",
      "Thermal paste and underfill dispensing",
      "Smartphone housing screwdriving and snap-fit assembly",
      "Wafer handling inside vacuum load locks",
      "Automated optical inspection (AOI) of solder joints",
    ],
    systemArchitecture: [
      {
        step: "01",
        title: "Wafer / PCB Infeed",
        description:
          "Cleanroom SMIF pod or magazine loader presents board to anti-static conveyor.",
      },
      {
        step: "02",
        title: "Fiducial Recognition",
        description:
          "High-magnification camera registers board fiducial marks to correct offsets in <15ms.",
      },
      {
        step: "03",
        title: "Controlled Insertion",
        description:
          "Precision actuator places component with active force monitoring (<0.5 N threshold).",
      },
      {
        step: "04",
        title: "Solder Inspection",
        description: "3D AOI camera inspects solder wetting and joint coplanarity.",
      },
    ],
    relevantProducts: [
      {
        name: "Integrated Servo Actuator",
        category: "Actuators",
        href: "/products/actuators",
        description:
          "Ultra-compact rotary actuator with integrated feedback for micro-positioning.",
      },
      {
        name: "Linear Positioning Actuator",
        category: "Actuators",
        href: "/products/actuators",
        description: "High-accuracy guided linear axis for wafer and board handling.",
      },
      {
        name: "Coordinated Motion Controller",
        category: "Control Systems",
        href: "/products/control-systems",
        description: "High-speed multi-axis controller with microsecond loop response.",
      },
    ],
    technicalResources: [
      {
        title: "Cleanroom Robotic Standards & ESD Guidelines",
        type: "Technical Article",
        href: "/resources?type=article",
      },
      {
        title: "Micro-Dispensing Motion Tuning Notes",
        type: "Application Note",
        href: "/resources?type=app-note",
      },
    ],
  },
  {
    id: "manufacturing",
    title: "Manufacturing",
    shortDescription:
      "CNC machine tending, stamping, casting, forging, and finished part deburring.",
    heroSubtitle:
      "Rugged robotic automation engineered for high-uptime machine tending and harsh factory environments.",
    industryOverview:
      "General precision manufacturing relies heavily on CNC milling machines, metal stamping presses, and die-casting cells. Automating the loading, unloading, deburring, and inspection of machined parts increases machine tool utilization from 60% to over 90% while keeping workers safe from chips, cutting fluids, and heavy blanks.",
    automationChallenges: {
      title: "Harsh Environmental Realities on the Machine Floor",
      description:
        "Machine tending environments expose robotic equipment to harsh metal chips, aggressive coolant mist, high thermal cycles from forging dies, and heavy, unbalanced metal billets.",
      points: [
        "Aggressive coolant fluids degrading mechanical seals and electrical cables",
        "Abrasive metal chips interfering with linear guides and exposed gearing",
        "High machine tool downtime while waiting for manual operator loading",
        "Ergonomic hazards from handling hot, sharp-edged machined cast parts",
      ],
    },
    roboticOpportunity: {
      title: "Ruggedized Machine Tending & Finishing",
      description:
        "Robotic arms protected up to IP67 with pressurized joint cavities handle billet loading, part blowing, and dual-gripper swaps inside CNC machines in under 12 seconds.",
      points: [
        "Rapid dual-gripper swaps (load new blank, unload finished part in one approach)",
        "Automated deburring and grinding with constant surface contact pressure",
        "Integration with CNC door interlocks and hydraulic chuck clamp signals",
        "Standardized mobile robot tending units serving multiple CNC machines",
      ],
    },
    recommendedTechnologies: [
      "IP67 Articulated Robots",
      "Dual Pneumatic Grippers",
      "Cycloidal Joint Reducers",
      "Pneumatic Blast Modules",
      "Laser Tool Setters",
    ],
    typicalApplications: [
      "5-axis CNC machining center tending",
      "Hydraulic stamping press loading and blank destacking",
      "Die cast part extraction and quench tank dipping",
      "Robotic deburring, chamfering, and weld bead grinding",
      "CMM coordinate measuring machine loading",
    ],
    systemArchitecture: [
      {
        step: "01",
        title: "Blank Staging",
        description: "Raw billets arranged on indexing pallet or incoming gravity feeder.",
      },
      {
        step: "02",
        title: "CNC Door Access",
        description:
          "Robot exchanges safety signals with CNC controller and enters machine envelope.",
      },
      {
        step: "03",
        title: "Dual Gripper Swap",
        description: "Robot unloads finished part, blows chips from chuck, and loads fresh blank.",
      },
      {
        step: "04",
        title: "Deburr & Discharge",
        description:
          "Robot guides finished part across deburring spindle and places in output tray.",
      },
    ],
    relevantProducts: [
      {
        name: "Industrial Handling Robot",
        category: "Industrial Robots",
        href: "/products/industrial-robots",
        description: "Heavy-duty robot designed for continuous machine tending cycles.",
      },
      {
        name: "Precision Robotic Reducer",
        category: "Precision Reducers",
        href: "/products/precision-reducers",
        description: "Robust zero-backlash gearing resistant to shock loads.",
      },
      {
        name: "Integrated Servo Actuator",
        category: "Actuators",
        href: "/products/actuators",
        description: "Compact actuator for custom chuck clamping and indexing tables.",
      },
    ],
    technicalResources: [
      {
        title: "CNC Machine Tending Safety & Interlock Guide",
        type: "Application Note",
        href: "/resources?type=app-note",
      },
      {
        title: "Coolant & IP Sealing Selection Criteria",
        type: "Technical Article",
        href: "/resources?type=article",
      },
    ],
  },
  {
    id: "warehousing",
    title: "Warehousing",
    shortDescription:
      "Automated storage and retrieval (ASRS), case picking, sorting, and buffer management.",
    heroSubtitle:
      "High-density dynamic automation transforming modern distribution centers and fulfillment hubs.",
    industryOverview:
      "E-commerce expansion and labor shortages have put immense pressure on warehousing facilities to fulfill orders with shorter lead times. Robotic systems automate goods-to-person workflows, high-density tote handling, and mixed-case palletizing.",
    automationChallenges: {
      title: "Fulfillment Pressures in High-Velocity Warehouses",
      description:
        "Managing thousands of unpredictable SKUs, fluctuating peak seasons, and narrow warehouse aisles requires flexible mobile and stationary robotic platforms that integrate directly into Warehouse Management Systems (WMS).",
      points: [
        "Unpredictable SKU packaging dimensions, weights, and fragile surfaces",
        "Narrow aisles and high rack vertical storage limiting manual reach",
        "Seasonal peak spikes requiring rapid scaling without proportional headcount growth",
        "Stringent safety needs when operating alongside human pickers in aisle zones",
      ],
    },
    roboticOpportunity: {
      title: "Intelligent Warehouse Automation",
      description:
        "Deploying autonomous mobile robots, automated pallet shuttles, and vision-guided piece-picking arms creates high-density, lights-out storage capable of continuous 24/7 fulfillment.",
      points: [
        "Dynamic AMR fleets navigating narrow rack corridors via LiDAR SLAM",
        "AI vision-guided suction arms picking unstructured items directly from bins",
        "High-density automated shuttles maximizing cube storage volume by up to 60%",
        "Seamless API bridges to enterprise WMS and ERP inventory databases",
      ],
    },
    recommendedTechnologies: [
      "Omnidirectional Mecanum Wheels",
      "Differential AMR Drives",
      "Vacuum Suction Tooling",
      "3D Item Identification Cameras",
      "Fleet Management Software",
    ],
    typicalApplications: [
      "Goods-to-person tote transportation",
      "Piece picking from unstructured SKU totes",
      "High-speed conveyor induction and sorting",
      "Mixed-case palletizing for retail replenishment",
      "Automated empty pallet handling and dispensing",
    ],
    systemArchitecture: [
      {
        step: "01",
        title: "Order Induction",
        description: "WMS transmits pick list to warehouse fleet controller.",
      },
      {
        step: "02",
        title: "AMR Tote Retrieval",
        description:
          "Mobile robot navigates rack corridor, lifts target shelf pod, and transports to station.",
      },
      {
        step: "03",
        title: "Robotic Item Pick",
        description:
          "3D vision guided robotic arm identifies item, picks via vacuum, and deposits into shipping bin.",
      },
      {
        step: "04",
        title: "Dispatch Consolidation",
        description: "Conveyor routes completed bin to automated weighing and label applicators.",
      },
    ],
    relevantProducts: [
      {
        name: "AMR Drive Wheel Unit",
        category: "Robotic Wheels",
        href: "/products/robotic-wheels",
        description: "Differential drive unit engineered for warehouse AGV/AMR transport.",
      },
      {
        name: "Mecanum Drive Module",
        category: "Robotic Wheels",
        href: "/products/robotic-wheels",
        description: "Omnidirectional wheel module for tight-docking mobile fulfillment robots.",
      },
      {
        name: "Coordinated Motion Controller",
        category: "Control Systems",
        href: "/products/control-systems",
        description: "Supervisory controller for multi-axis sorting and palletizing cells.",
      },
    ],
    technicalResources: [
      {
        title: "AMR Traction & Battery Life Engineering Guide",
        type: "Datasheet",
        href: "/resources?type=datasheet",
      },
      {
        title: "High-Density ASRS Shuttle Drivetrain Design",
        type: "Application Note",
        href: "/resources?type=app-note",
      },
    ],
  },
  {
    id: "logistics",
    title: "Logistics",
    shortDescription:
      "Intralogistics transport fleets, cross-docking, sortation, and autonomous material flow.",
    heroSubtitle:
      "Autonomous mobile platforms linking production, assembly lines, and logistics shipping docks.",
    industryOverview:
      "Intralogistics links every department of modern production. Instead of fixed, inflexible roller conveyors dividing plant floors, modern factories deploy agile fleets of Automated Guided Vehicles (AGVs) and Autonomous Mobile Robots (AMRs) that adapt their routes to plant demands.",
    automationChallenges: {
      title: "Dynamic Floor Challenges in Factory Logistics",
      description:
        "Factory floors feature dynamic traffic of forklifts, pedestrians, spills, floor expansion seams, and changing pallet drop zones. Mobility hardware must provide rugged traction and absolute safety.",
      points: [
        "Unpredictable obstacle navigation in shared forklift and pedestrian pathways",
        "Floor transitions, expansion joints, and threshold ramps causing wheel slip",
        "Battery recharge management requiring continuous opportunity charging",
        "Fleet orchestration avoiding deadlocks at high-traffic intersections",
      ],
    },
    roboticOpportunity: {
      title: "Agile Fleet Intralogistics",
      description:
        "Robust drive wheels with integrated suspension, precision encoders, and certified safety electronics enable mobile robots to haul pallets up to 1500kg safely across manufacturing campuses.",
      points: [
        "Rugged polyurethane wheel treads with high coefficient of friction on epoxy floors",
        "Certified Safe Torque Off (STO) and dual-safety laser zone deceleration",
        "Sub-centimeter docking precision using secondary optical or magnetic fiducials",
        "Centralized fleet scheduling coordinating hundreds of simultaneous transport missions",
      ],
    },
    recommendedTechnologies: [
      "Spring-Suspension Drive Units",
      "Polyurethane Traction Wheels",
      "Safety Encoders",
      "Wireless Opportunity Charging",
      "Industrial Fleet Gateways",
    ],
    typicalApplications: [
      "Raw material line-side delivery from warehouse to assembly",
      "Finished goods transfer from production to shipping staging",
      "Heavy die and tooling transport to stamping presses",
      "Automated trash and scrap bin evacuation",
      "Cross-docking pallet consolidation",
    ],
    systemArchitecture: [
      {
        step: "01",
        title: "Call Button / Sensor Trigger",
        description: "Assembly line sensor signals buffer exhaustion to fleet management server.",
      },
      {
        step: "02",
        title: "Mission Dispatch",
        description: "Fleet software assigns closest idle AMR with adequate battery state.",
      },
      {
        step: "03",
        title: "Autonomous Transit",
        description:
          "AMR navigates plant aisles using LiDAR SLAM, dynamically detouring around obstacles.",
      },
      {
        step: "04",
        title: "Precision Docking",
        description:
          "Vehicle docks into line-side roller bed and mechanically transfers pallet payload.",
      },
    ],
    relevantProducts: [
      {
        name: "AMR Drive Wheel Unit",
        category: "Robotic Wheels",
        href: "/products/robotic-wheels",
        description: "Heavy-duty traction wheel with integrated gearbox and brake.",
      },
      {
        name: "Mecanum Drive Module",
        category: "Robotic Wheels",
        href: "/products/robotic-wheels",
        description: "Enables agile transverse crabbing for compact mobile transfers.",
      },
      {
        name: "Coordinated Motion Controller",
        category: "Control Systems",
        href: "/products/control-systems",
        description: "Supervises multi-wheel steering and synchronization.",
      },
    ],
    technicalResources: [
      {
        title: "Industrial Flooring & Wheel Friction Analysis",
        type: "Technical Article",
        href: "/resources?type=article",
      },
      {
        title: "AGV vs AMR Mobility Sizing Calculator",
        type: "Datasheet",
        href: "/resources?type=datasheet",
      },
    ],
  },
  {
    id: "food-packaging",
    title: "Food & Packaging",
    shortDescription:
      "Hygienic handling, high-speed sorting, primary bagging, and carton palletizing.",
    heroSubtitle:
      "Washdown-ready components and gentle high-speed handling compliant with global sanitary standards.",
    industryOverview:
      "Food processing and packaging environments operate under strict sanitary guidelines (FDA, EHEDG) requiring washdown with caustic chemicals and high-pressure water. Robotic automation must combine delicate, high-speed picking of fragile food products with corrosion-proof mechanical design.",
    automationChallenges: {
      title: "Sanitary Demands & High Speeds",
      description:
        "Robots handling food products directly must avoid crevices where bacteria can harbor, withstand daily washdowns with aggressive cleaning agents, and handle delicate bakery or produce items without bruising.",
      points: [
        "Caustic washdown chemicals causing corrosion in standard aluminum drivetrains",
        "High-pressure washdown (IP69K) ingress risks in cable glands and joints",
        "Fragile, non-uniform natural products requiring gentle, adaptive gripping",
        "Extremely high speeds (up to 150 picks per minute on delta and SCARA arms)",
      ],
    },
    roboticOpportunity: {
      title: "Hygienic High-Speed Packaging",
      description:
        "Stainless steel actuators, IP69K sealed robotic joints, and food-grade lubrication enable fast delta and collaborative robots to package goods reliably while meeting every sanitary audit.",
      points: [
        "Smooth stainless steel 316L housings with zero horizontal water-pooling surfaces",
        "NSF H1 food-grade registered greases and lubricants throughout all gearing",
        "Soft pneumatic and silicone suction grippers adapting to delicate fruits and pastries",
        "Integrated color and spectral vision detecting foreign bodies and burnt items",
      ],
    },
    recommendedTechnologies: [
      "Stainless Steel Actuators",
      "IP69K Sealed Reducers",
      "High-Speed Delta Arms",
      "Food-Grade Lubricants",
      "Hyperspectral Vision Systems",
    ],
    typicalApplications: [
      "High-speed primary packaging (picking chocolates into blister trays)",
      "Flow wrapper and bagging machine robotic infeed",
      "Carton erection, product packing, and carton sealing",
      "Secondary tray packing of bottles, cans, and cartons",
      "End-of-line washdown palletizing cells in dairy and meat plants",
    ],
    systemArchitecture: [
      {
        step: "01",
        title: "Random Infeed",
        description:
          "Sanitary blue belt conveyor carries unstructured baked goods into vision tunnel.",
      },
      {
        step: "02",
        title: "Belt Tracking & Vision",
        description:
          "Camera tracks item coordinates, orientation, and quality attributes on moving belt.",
      },
      {
        step: "03",
        title: "High-Speed Pick",
        description:
          "Delta robot synchronizes kinematics with belt speed and picks item in <300ms.",
      },
      {
        step: "04",
        title: "Blister Tray Placement",
        description:
          "Part is deposited into indexed blister packaging with controlled gentle deceleration.",
      },
    ],
    relevantProducts: [
      {
        name: "Integrated Servo Actuator",
        category: "Actuators",
        href: "/products/actuators",
        description: "IP-sealed rotary actuator with smooth sanitary profile.",
      },
      {
        name: "Linear Positioning Actuator",
        category: "Actuators",
        href: "/products/actuators",
        description: "Corrosion-resistant linear axis for carton pusher systems.",
      },
      {
        name: "Industrial Handling Robot",
        category: "Industrial Robots",
        href: "/products/industrial-robots",
        description: "Palletizing robot with food-grade lubricant options.",
      },
    ],
    technicalResources: [
      {
        title: "Sanitary Robot Design & Washdown IP69K Guidelines",
        type: "Technical Article",
        href: "/resources?type=article",
      },
      {
        title: "Food-Grade Lubricant Specifications",
        type: "Datasheet",
        href: "/resources?type=datasheet",
      },
    ],
  },
  {
    id: "pharmaceuticals",
    title: "Pharmaceuticals",
    shortDescription:
      "Sterile inspection, vial handling, cleanroom filling, and serialized blister packaging.",
    heroSubtitle:
      "Validated, cleanroom-certified robotic automation meeting strict FDA 21 CFR Part 11 requirements.",
    industryOverview:
      "Pharmaceutical and biotechnology production requires sterile, contamination-free processing with complete data integrity. Robotic automation minimizes human presence inside isolators and RABS (Restricted Access Barrier Systems), preventing particulate contamination during sterile liquid filling and cytotoxic compound handling.",
    automationChallenges: {
      title: "Regulatory Rigor & Contamination Risks",
      description:
        "Human operators are the primary source of cleanroom contamination. Automation systems inside aseptic zones must tolerate vaporized hydrogen peroxide (VHP) decontamination and comply with complete 21 CFR Part 11 audit trails.",
      points: [
        "Vaporized Hydrogen Peroxide (VHP) sterilizing gas eroding standard elastomers and seals",
        "Aseptic cleanroom grade A/B requirements prohibiting particulate generation",
        "Mandatory 21 CFR Part 11 audit logging of every motion and parameter change",
        "Zero margin for liquid fill volume errors in high-potency drug vials",
      ],
    },
    roboticOpportunity: {
      title: "Aseptic & Isolator Robotics",
      description:
        "Hermetically sealed cleanroom robotic arms with mirror-polished stainless housings and VHP-resistant fluoropolymer seals operate safely inside isolators, handling syringe filling and capping without human contact.",
      points: [
        "VHP-resistant surface coatings and continuous positive air pressurization",
        "ISO 4 cleanroom certified joint mechanics with sealed internal cable looms",
        "Integrated electronic records and cryptographic signatures for all motion setpoints",
        "Non-destructive 100% tare and gross weight verification on precision load cells",
      ],
    },
    recommendedTechnologies: [
      "VHP-Resistant Robot Arms",
      "Cleanroom Harmonic Gearing",
      "Precision Syringe Actuators",
      "Laser Headspace Analyzers",
      "Audit-Trail PLCs",
    ],
    typicalApplications: [
      "Aseptic vial and syringe liquid filling inside isolators",
      "Automated optical inspection of particle contamination in ampoules",
      "Handling cytotoxic active pharmaceutical ingredients (API)",
      "Packaging serialization and 2D barcode aggregation",
      "Cold-chain biobank vial automated retrieval",
    ],
    systemArchitecture: [
      {
        step: "01",
        title: "Sterile Infeed",
        description: "Depyrogenated vials enter isolator via aseptic transfer port.",
      },
      {
        step: "02",
        title: "Robotic Tare & Fill",
        description:
          "Precision actuator actuates rotary piston pump to dispense exact micro-liter dose.",
      },
      {
        step: "03",
        title: "Stoppering & Capping",
        description:
          "Robot places elastomer stopper and crimps aluminum seal with calibrated torque.",
      },
      {
        step: "04",
        title: "Inspection & Serialization",
        description: "Optical sensors verify cap integrity and laser-etches 2D Datamatrix.",
      },
    ],
    relevantProducts: [
      {
        name: "Integrated Servo Actuator",
        category: "Actuators",
        href: "/products/actuators",
        description: "Sealed rotary actuator for precision dosing and capping axes.",
      },
      {
        name: "Linear Positioning Actuator",
        category: "Actuators",
        href: "/products/actuators",
        description: "High-accuracy guided linear axis with cleanroom particle sealing.",
      },
      {
        name: "Coordinated Motion Controller",
        category: "Control Systems",
        href: "/products/control-systems",
        description: "Deterministic motion controller with audit logging support.",
      },
    ],
    technicalResources: [
      {
        title: "Aseptic Isolator Automation & VHP Compatibility",
        type: "Application Note",
        href: "/resources?type=app-note",
      },
      {
        title: "21 CFR Part 11 Motion Control Compliance Guide",
        type: "Technical Article",
        href: "/resources?type=article",
      },
    ],
  },
  {
    id: "welding",
    title: "Welding & Fabrication",
    shortDescription:
      "Robotic arc welding, spot welding, laser seam tracking, and heavy plate cutting.",
    heroSubtitle:
      "Continuous-path precision and thermal durability for heavy structural and sheet metal fabrication.",
    industryOverview:
      "Structural steel, pressure vessels, and agricultural machinery manufacturing rely on heavy-duty welding processes. Skilled manual welders are increasingly scarce, making automated robotic welding essential for high-integrity seams, consistent weld penetration, and operator protection from intense ultraviolet radiation and toxic fumes.",
    automationChallenges: {
      title: "Thermal Distortion & Process Hostility",
      description:
        "Welding environments generate extreme electrical spatter, strong electromagnetic interference (EMI) from high-amperage arcs, and intense heat radiation that can degrade encoder electronics and cables.",
      points: [
        "Heavy electromagnetic interference (EMI) corrupting digital control signals",
        "Molten spatter damaging robot wrist seals and protective cable conduits",
        "Part fabrication tolerance variations requiring real-time seam tracking",
        "Distortion and warping of large weldments under intense thermal input",
      ],
    },
    roboticOpportunity: {
      title: "Precision Robotic Welding Workcells",
      description:
        "Articulated welding robots combined with multi-axis positioners and through-the-arc seam tracking achieve continuous, spatter-free welds with consistent throat thickness across long production runs.",
      points: [
        "Hollow-wrist robot arm design routing torch cables internally away from spatter",
        "Through-the-Arc Seam Tracking (TAST) dynamically compensating for joint fit-up gaps",
        "Coordinated motion with 2-axis positioner tables keeping weld puddle in horizontal position",
        "Pre-programmed weaving patterns (trapezoidal, sinusoidal) for multi-pass heavy joints",
      ],
    },
    recommendedTechnologies: [
      "Hollow-Wrist 6-Axis Robots",
      "Heavy Multi-Axis Positioners",
      "Laser Seam Tracking Sensors",
      "Pulse Arc Welding Power Sources",
      "Automated Torch Cleaners",
    ],
    typicalApplications: [
      "Automotive chassis and exhaust robotic MIG/MAG welding",
      "Heavy structural steel beam fabrication and gusset welding",
      "Pressure vessel circumferential seam submerged arc welding",
      "Sheet metal spot welding on commercial vehicle cabs",
      "Laser cutting and weld bevel preparation on thick plates",
    ],
    systemArchitecture: [
      {
        step: "01",
        title: "Part Clamping",
        description:
          "Pneumatic/hydraulic clamps secure weldment onto 2-axis tilt-rotate positioner.",
      },
      {
        step: "02",
        title: "Seam Location Touch-Sense",
        description:
          "Robot gas nozzle or laser sensor performs tactile touch-sensing to find weld start.",
      },
      {
        step: "03",
        title: "Coordinated Arc Weld",
        description:
          "Robot and positioner move in coordinated interpolation while power source fires pulse arc.",
      },
      {
        step: "04",
        title: "Torch Reaming & Tip Service",
        description:
          "Robot automatically cycles through torch cleaning and anti-spatter spray station.",
      },
    ],
    relevantProducts: [
      {
        name: "6-Axis Robotic Arm",
        category: "Robotic Arms",
        href: "/products/robotic-arms",
        description: "Articulated arm with hollow wrist for welding torch integration.",
      },
      {
        name: "Precision Robotic Reducer",
        category: "Precision Reducers",
        href: "/products/precision-reducers",
        description: "High-stiffness reduction gearboxes for heavy-duty positioner axes.",
      },
      {
        name: "Coordinated Motion Controller",
        category: "Control Systems",
        href: "/products/control-systems",
        description: "Central controller coordinating robot arm and workpiece positioner.",
      },
    ],
    technicalResources: [
      {
        title: "Robotic Arc Welding Seam Tracking Algorithms",
        type: "Technical Article",
        href: "/resources?type=article",
      },
      {
        title: "Welding Workcell Positioner Sizing Math",
        type: "Datasheet",
        href: "/resources?type=datasheet",
      },
    ],
  },
  {
    id: "inspection",
    title: "Machine Vision Inspection",
    shortDescription:
      "3D laser profilometry, coordinate metrology, automated optical inspection, and leak testing.",
    heroSubtitle:
      "Micron-level automated metrology and closed-loop quality verification for zero-defect production.",
    industryOverview:
      "High-consequence manufacturing (aerospace, automotive safety, medical implants) cannot rely on manual batch sampling. Automated robotic inspection brings coordinate measuring machine (CMM) precision directly into production lines, performing 100% automated dimensional and surface defect verification at cycle speeds.",
    automationChallenges: {
      title: "Metrology Accuracy on the Factory Floor",
      description:
        "Ambient factory floor vibration, fluctuating shop temperatures, and complex contoured geometries challenge traditional inspection tools, causing measurement noise and false reject calls.",
      points: [
        "Shop floor vibration and thermal expansion skewing micron-level optical measurements",
        "Complex organic curved surfaces requiring full 6-axis camera orientation to maintain focal depth",
        "Inspection bottlenecking production when cycle times exceed line takt time",
        "Need for automated closed-loop tool wear compensation back to upstream CNCs",
      ],
    },
    roboticOpportunity: {
      title: "In-Line Robotic Metrology",
      description:
        "Equipping high-repeatability robotic arms with 3D blue-light scanners, laser profilometers, and telecentric cameras allows comprehensive part digitization in under 30 seconds.",
      points: [
        "Full 3D point cloud generation comparing physical parts directly to CAD nominals",
        "Optical non-contact measurement avoiding surface scratching on polished parts",
        "Dynamic tool wear compensation sending automatic offset corrections to CNC machines",
        "Automated statistical process control (SPC) charts detecting process drift in real time",
      ],
    },
    recommendedTechnologies: [
      "High-Repeatability 6-Axis Arms",
      "Blue-Light 3D Scanners",
      "Telecentric Optical Gauges",
      "Thermal Compensation Sensors",
      "Metrology SPC Software",
    ],
    typicalApplications: [
      "Automotive stamped door and hood gap-and-flush optical inspection",
      "Aerospace turbine blade 3D airfoil profile scanning",
      "Machined transmission housing bore diameter and roundness checking",
      "Medical implant surface roughness and defect scanning",
      "Automated helium leak detection on refrigeration coils",
    ],
    systemArchitecture: [
      {
        step: "01",
        title: "Part Presentation",
        description:
          "Conveyor indexes manufactured component into light-controlled inspection booth.",
      },
      {
        step: "02",
        title: "Multi-Angle 3D Scan",
        description:
          "Robot guides 3D blue-light scanner around part, capturing point cloud in calibrated poses.",
      },
      {
        step: "03",
        title: "CAD Deviation Analysis",
        description:
          "Software aligns point cloud to CAD model and computes geometric dimensioning (GD&T).",
      },
      {
        step: "04",
        title: "Sorting & Feedback",
        description:
          "Pass parts continue to packing; rejects are diverted to quarantine with defect heatmaps.",
      },
    ],
    relevantProducts: [
      {
        name: "6-Axis Robotic Arm",
        category: "Robotic Arms",
        href: "/products/robotic-arms",
        description: "High-accuracy articulated robot with sub-millimeter path repeatability.",
      },
      {
        name: "Precision Robotic Reducer",
        category: "Precision Reducers",
        href: "/products/precision-reducers",
        description: "Zero-backlash strain wave gears for ultra-stable inspection poses.",
      },
      {
        name: "Coordinated Motion Controller",
        category: "Control Systems",
        href: "/products/control-systems",
        description: "Synchronizes robot motion with high-speed camera exposure triggers.",
      },
    ],
    technicalResources: [
      {
        title: "Automated 3D Metrology vs Offline CMM Economics",
        type: "Case Study",
        href: "/resources?type=case-study",
      },
      {
        title: "Optical Inspection Lighting & Lens Selection",
        type: "Application Note",
        href: "/resources?type=app-note",
      },
    ],
    workpieceType: "Machined housings, turbine airfoils, electronic boards, and stamped panels",
    payloadRequirements: "1 kg to 5 kg (sensor / camera end-of-arm tooling)",
    positioningRepeatability: "±0.01 mm for stable camera positioning and laser profiling",
    operatingEnvironment: "Light-controlled inspection cell, vibration-isolated mounting",
    cycleTimeConsiderations: "In-line 100% inspection at conveyor line speed (< 100 ms per image acquisition)",
    sensingControlRequirements: "Trigger synchronization with robot encoder positions, optical strobe lighting",
    technicalConsiderations: {
      title: "Vision & Motion Synchronization Considerations",
      description: "Critical factors when integrating machine vision cameras onto robotic articulation arms.",
      points: [
        "Position-synchronized exposure triggers: Generating hardware pulses from robot axis encoders to capture blur-free frames at precise spatial coordinates.",
        "Optical focal depth and lighting: Maintaining constant working distance and utilizing polarized or diffuse multi-spectrum lighting to eliminate glare on machined surfaces.",
        "Point cloud coordinate transformation: Hand-eye calibration linking camera reference frames directly to the robot tool center point (TCP).",
        "Deterministic pass/fail gating: Direct fieldbus signaling to reject diversions within line takt time constraints.",
      ],
    },
    safetyRequirements: {
      title: "Metrology Workcell Safety & Compliance",
      standards: ["ISO 10218-1/2 (Robot Safety)", "IEC 62471 (Photobiological Safety of Lamps and Lamp Systems)", "ISO 13849-1 PL d"],
      guidelines: [
        "Enclosed inspection booth shielding workers from high-intensity strobe illumination and Class 3R/3B laser beams",
        "Interlocked access doors with automatic laser blanking upon door opening",
        "Emergency Stop pushbuttons accessible at infeed and outfeed operator stations",
      ],
    },
    faqs: [
      {
        question: "Can robotic vision inspect 3D dimensions as accurately as a CMM?",
        answer: "Modern blue-light optical scanners and 3D laser profilers mounted on high-repeatability robots achieve measurement accuracies down to ±10–25 µm, which is suitable for 100% in-line production auditing, while traditional CMMs remain the offline reference standard for sub-micron master calibration.",
      },
      {
        question: "How does the system handle part-to-part variation on raw conveyors?",
        answer: "A wide-field 2D overview camera detects incoming part orientation (X, Y, theta) and dynamically offsets the 6-axis robot inspection trajectory to align with the actual part pose.",
      },
    ],
  },
  {
    id: "machine-tending",
    title: "Machine Tending",
    shortDescription:
      "Autonomous CNC machine tool loading, unloading, billet feeding, and cycle optimization.",
    heroSubtitle:
      "Eliminate spindle downtime with robotic 6-axis machine tending, dual-gripper part exchanges, and coolant-sealed IP67 articulation.",
    industryOverview:
      "Computer Numerical Control (CNC) machining centers, lathes, and stamping presses represent major capital investments whose financial return depends directly on spindle cutting hours. Manual machine tending exposes human operators to repetitive ergonomic strain, sharp metal swarf, and atomized coolant mist, while introducing avoidable spindle idle time during part transfers. Robotic machine tending workcells automate raw billet infeed, chuck clamping verification, precision part extraction, and chip blow-off, delivering 24/7 autonomous lights-out manufacturing with consistent part placement.",
    automationChallenges: {
      title: "CNC Machining Hurdles & Spindle Idle Bottlenecks",
      description:
        "Machine tools operate in harsh wet-coolant environments with tight internal working envelopes, requiring deterministic interlocks and rugged mechanical protection.",
      points: [
        "Spindle downtime during manual loading and unloading dragging machine utilization below 55%",
        "Abrasive chips and high-pressure coolant mist penetrating mechanical joints and encoder seals",
        "Improper workpiece seating in chuck or fixture jaws causing scrap and catastrophic tool breakage",
        "Heavy raw billet and casting manipulation causing operator fatigue and ergonomics injuries",
      ],
    },
    roboticOpportunity: {
      title: "Robotic Machine Tending Integration",
      description:
        "Deploying high-rigidity 6-axis articulated robots with dual-action end effectors enables rapid part exchange in under 8 seconds.",
      points: [
        "Dual pneumatic/electric grippers exchanging finished and raw parts in a single door cycle",
        "IP67 sealed wrist and arm construction withstanding direct cutting fluid washdown",
        "Direct CNC machine interface via discrete I/O, Ethernet/IP, or Profinet M-code handshakes",
        "Integrated air blast nozzles for automated chuck cleaning and optical seating confirmation",
      ],
    },
    recommendedTechnologies: [
      "6-Axis Articulated Robots",
      "RV Cycloidal Reducers",
      "Dual-Station Pneumatic Grippers",
      "CNC Machine Interface IO",
      "Safety Light Curtains",
      "Automated Chuck Seating Sensors",
    ],
    typicalApplications: [
      "CNC lathe billet loading and turned shaft extraction",
      "Vertical machining center (VMC) multi-fixture pallet tending",
      "Stamping press sheet blank feeding and stamped part stacking",
      "Horizontal machining center (HMC) tombstone loading",
      "In-line post-machining air blow-off and coordinate gauging",
    ],
    systemArchitecture: [
      {
        step: "01",
        title: "Billet Infeed & Presence Sensing",
        description: "Raw billets indexed on gravity infeed tray or drawer system with optical confirmation.",
      },
      {
        step: "02",
        title: "CNC Door Open & Dual-Gripper Entry",
        description: "Robot enters machine envelope immediately upon M-code spindle stop signal.",
      },
      {
        step: "03",
        title: "Part Exchange & Chuck Blow-Off",
        description: "Empty gripper removes finished part; air blast clears jaws; second gripper seats raw blank.",
      },
      {
        step: "04",
        title: "Cycle Start & Post-Op Inspection",
        description: "Robot exits, CNC door closes and machining starts while robot presents finished part to gauge.",
      },
    ],
    relevantProducts: [
      {
        name: "6-Axis Industrial Robot",
        category: "Industrial Robots",
        href: "/products/industrial-robots",
        description: "High-stiffness articulated arm with IP67 wrist protection for machine tool tending.",
      },
      {
        name: "Precision RV Reducers",
        category: "Precision Reducers",
        href: "/products/precision-reducers",
        description: "High shock-load capacity reduction gears for rigid, vibration-free arm positioning.",
      },
      {
        name: "End Effectors & Tooling",
        category: "End Effectors",
        href: "/products/end-effectors",
        description: "Dual-gripper mechanical and pneumatic end effectors for rapid part swap.",
      },
      {
        name: "Coordinated Motion Controller",
        category: "Control Systems",
        href: "/products/control-systems",
        description: "Central controller for deterministic CNC handshakes and safety interlocks.",
      },
    ],
    technicalResources: [
      {
        title: "Machine Tending ROI & Spindle Utilization Calculator",
        type: "Application Note",
        href: "/resources?type=app-note",
      },
      {
        title: "CNC Interface Protocols: M-Code Handshake Specification",
        type: "Technical Article",
        href: "/resources?type=article",
      },
    ],
    workpieceType: "Turned shafts, milled aluminum housings, iron castings, and stamped blanks",
    payloadRequirements: "7 kg to 35 kg handling capacity including dual-gripper tooling weight",
    positioningRepeatability: "±0.03 mm for accurate chuck jaw seating without jaw collision",
    operatingEnvironment: "IP67 sealed wrist against water-soluble coolant, cutting oil, and hot metal swarf",
    cycleTimeConsiderations: "Dual-gripper part exchange cycle within 6–10 seconds to maximize spindle run time",
    sensingControlRequirements: "Chuck clamp confirmation, seat back-pressure sensing, and optical part presence",
    technicalConsiderations: {
      title: "Engineering & Integration Considerations",
      description: "Key integration factors when deploying robotic machine tending cells adjacent to CNC machine tools.",
      points: [
        "Machine tool interface: Establishing deterministic discrete I/O or fieldbus (Profinet/EthernetIP) handshakes for door actuation, chuck clamp/unclamp, and cycle start.",
        "Chuck seating verification: Using differential pneumatic back-pressure sensing to ensure raw parts seat flush against chuck locators before spindle start.",
        "Payload and moment of inertia: Sizing robot wrist capacity to account for total dual-gripper weight, pneumatic valves, sensors, and two workpieces simultaneously.",
        "Cable dress packs: Enclosing pneumatic tubes and signal wires within protective, coolant-resistant flex-conduits routed away from spindle cutting paths.",
      ],
    },
    safetyRequirements: {
      title: "Safety Standards & Cell Protection",
      standards: [
        "ISO 10218-1/2 (Industrial Robot Safety)",
        "ISO 13849-1 PL d / Cat 3 (Safety of Machinery)",
        "ANSI/RIA R15.06 (Industrial Robots Safety)",
      ],
      guidelines: [
        "Physical perimeter fencing with safety interlock switches on maintenance access doors",
        "Optical safety light curtains or area laser scanners safeguarding infeed/outfeed stations",
        "Dual-channel hardwired Emergency Stop integrated with CNC emergency stop circuit",
        "Low-speed manual teach mode (≤ 250 mm/s) with 3-position deadman enabling device",
      ],
    },
    faqs: [
      {
        question: "Can a single robot tend multiple CNC machines?",
        answer: "Yes. Using a 7th-axis linear transfer track or a center-island cell layout, an articulated robot can tend two to four CNC machines, scheduling part exchanges based on cycle-time overlap.",
      },
      {
        question: "How does the robot verify that a workpiece is properly clamped?",
        answer: "Workpiece seating is confirmed through pneumatic back-pressure sensors in the chuck jaws, gripper-mounted tactile sensors, and spindle interlock signals before rotation is authorized.",
      },
      {
        question: "What happens if a part is misaligned on the raw infeed tray?",
        answer: "Optical or laser distance sensors on the gripper detect misalignment before pick. If a part exceeds allowable tolerance, the robot skips it and alerts the line operator without halting the machining cycle.",
      },
    ],
  },
  {
    id: "pick-and-place",
    title: "Pick and Place",
    shortDescription:
      "High-speed kinematic component transfer, sorting, and packaging across moving conveyors and matrix trays.",
    heroSubtitle:
      "Sub-second transfer cycles, dynamic conveyor tracking, and vibration-damped placement for high-throughput lines.",
    industryOverview:
      "High-speed transfer operations form the backbone of modern packaging, consumer electronics, and discrete parts manufacturing. Traditional manual pick-and-place cannot match modern line rates and leads to ergonomic repetitive strain injuries. Utilizing delta robots, SCARA kinematics, and multi-axis linear gantries equipped with vacuum or mechanical tooling, automated pick-and-place cells achieve rates exceeding 80 to 120 cycles per minute while gently handling delicate workpieces.",
    automationChallenges: {
      title: "Kinematic Inertia & Dynamic Tracking Hurdles",
      description:
        "High cycle rates generate extreme centrifugal loads and dynamic vibrations that can degrade placement repeatability and cause part slippage.",
      points: [
        "High acceleration forces (up to 10G) requiring rigid, ultra-low inertia mechanical links",
        "Conveyor velocity fluctuations necessitating real-time encoder tracking and visual registration",
        "Delicate workpiece surfaces susceptible to mechanical damage from abrupt gripper deceleration",
        "Rapid changeovers between varied SKU sizes without lengthy mechanical retooling",
      ],
    },
    roboticOpportunity: {
      title: "Kinematic Performance & Vision-Guided Picking",
      description:
        "Parallel-link delta mechanisms and high-speed SCARA arms paired with line-scan vision achieve smooth, deterministic trajectories.",
      points: [
        "Delta kinematics delivering cycle times down to 0.40 seconds per standard pick-and-place move",
        "Dynamic conveyor tracking synchronizing robot TCP velocity with moving belt surfaces",
        "High-flow vacuum ejectors with quick-release valves ensuring crisp part release",
        "Low-backlash harmonic and planetary gearing preventing overshoot on rapid stops",
      ],
    },
    recommendedTechnologies: [
      "Parallel Delta Robots",
      "High-Speed SCARA Arms",
      "Dynamic Conveyor Encoders",
      "Venturi Vacuum Grippers",
      "High-Resolution 2D Machine Vision",
      "Direct-Drive Rotary Joints",
    ],
    typicalApplications: [
      "Primary packaging carton loading and flow-wrapper feeding",
      "SMT circuit board tray sorting and pin insertion",
      "Pharmaceutical blister pack transfer and cartoner collation",
      "Plastic bottle cap sorting and container orientation",
      "Food product kitting and bakery tray depanning",
    ],
    systemArchitecture: [
      {
        step: "01",
        title: "Conveyor Registration",
        description: "Belt encoder and vision camera log part position, orientation, and conveyor speed.",
      },
      {
        step: "02",
        title: "Fly-By Trajectory Generation",
        description: "Robot controller plans cubic spline curve matching moving part velocity vector.",
      },
      {
        step: "03",
        title: "Vacuum Pick & Ascent",
        description: "End effector engages vacuum suction and lifts part along smooth parabolic arc.",
      },
      {
        step: "04",
        title: "Synchronized Placement",
        description: "Part placed into moving blister pocket or target fixture with positive blow-off release.",
      },
    ],
    relevantProducts: [
      {
        name: "Delta & SCARA Robots",
        category: "Industrial Robots",
        href: "/products/industrial-robots",
        description: "High-speed parallel and horizontal articulated robots for rapid pick and place.",
      },
      {
        name: "Precision Linear Actuators",
        category: "Actuators",
        href: "/products/actuators",
        description: "Belt and ballscrew driven high-acceleration linear transfer modules.",
      },
      {
        name: "End Effectors & Tooling",
        category: "End Effectors",
        href: "/products/end-effectors",
        description: "Custom vacuum cups, magnetic grippers, and high-speed pneumatic tooling.",
      },
      {
        name: "Servo Motors & Drives",
        category: "Motors and Drives",
        href: "/products/servo-motors",
        description: "Low-inertia AC servomotors engineered for rapid reversing dynamics.",
      },
    ],
    technicalResources: [
      {
        title: "Conveyor Tracking Dynamics & Encoder Synchronization",
        type: "Application Note",
        href: "/resources?type=app-note",
      },
      {
        title: "Delta Robot Acceleration Sizing Guide",
        type: "Datasheet",
        href: "/resources?type=datasheet",
      },
    ],
    workpieceType: "Cartons, blister packs, electronic PCBs, injection-molded caps, and vials",
    payloadRequirements: "0.5 kg to 10 kg handling capacity optimized for high acceleration",
    positioningRepeatability: "±0.02 mm placement precision onto moving packaging fixtures",
    operatingEnvironment: "Clean, dry factory floors; optional IP65/IP69K washdown for food lines",
    cycleTimeConsiderations: "0.40s to 0.85s per pick-and-place cycle (up to 80–120 picks/min)",
    sensingControlRequirements: "Line encoder tracking, visual part pose recognition, vacuum level pressure switches",
    technicalConsiderations: {
      title: "Kinematic & Vacuum Integration Considerations",
      description: "Essential sizing calculations and integration parameters for high-throughput picking.",
      points: [
        "Inertia ratio matching: Sizing servo motors and gearheads so that reflected load inertia remains within 5:1 of motor rotor inertia for sharp settle times.",
        "Vacuum response timing: Using decentralized fast-switching solenoid valves directly on the robot wrist to reduce pneumatic response latency to under 15 ms.",
        "Conveyor tracking limits: Accounting for maximum conveyor speed variations and camera latency in the motion controller's tracking window.",
        "Structural frame stiffness: Mounting the robot to heavy tubular steel frames with high natural frequencies to prevent resonance oscillation during peak accelerations.",
      ],
    },
    safetyRequirements: {
      title: "High-Speed Cell Safety Architecture",
      standards: [
        "ISO 10218-1/2 (Robot Safety)",
        "ISO 13849-1 PL d (Performance Level)",
        "EN 619 (Continuous Handling Equipment Safety)",
      ],
      guidelines: [
        "Full interlocked polycarbonate enclosure preventing operator reach into the rapid kinematic zone",
        "Conveyor tunnel safety baffles preventing hand access along belt entry/exit ports",
        "Zero-energy state pneumatic dump valves discharging stored vacuum and air pressure upon E-stop",
      ],
    },
    faqs: [
      {
        question: "How does the robot track parts moving at variable belt speeds?",
        answer: "A quadrature incremental encoder on the conveyor drive shaft feeds pulses directly into the motion controller's high-speed counter, dynamically updating the robot trajectory in real time.",
      },
      {
        question: "Can multiple robots share the same conveyor line?",
        answer: "Yes. Distributed vision controllers assign parts sequentially across two or more delta robots, balancing workload dynamically based on queue density.",
      },
    ],
  },
  {
    id: "assembly-automation",
    title: "Assembly Automation",
    shortDescription:
      "Precision component insertion, robotic screwdriving, and force-guided mechanical sub-assembly.",
    heroSubtitle:
      "Micro-tolerance mechanical fastening, closed-loop tactile force feedback, and high-yield electronic/mechanical assembly.",
    industryOverview:
      "Discrete manufacturing assembly demands micro-scale repeatability, regulated insertion forces, and comprehensive traceability. From inserting fragile flex-PCBs and press-fitting miniature bearings to multi-axis screwdriving on automotive sub-assemblies, modern automated assembly eliminates human variability and defects. Leveraging collaborative robots (cobots), SCARA manipulators, and 6-axis articulated arms integrated with 6-DoF force-torque sensing, INDUS automation components deliver deterministic precision and continuous torque logging.",
    automationChallenges: {
      title: "Assembly Tolerance Stacks & Component Jamming",
      description:
        "Rigid parts with sub-20 micron clearances will wedge or cross-thread if mechanical alignment is purely positional without compliance.",
      points: [
        "Part jamming and galling during tight-tolerance cylindrical or splined insertions",
        "Cross-threading and stripped threads during automated micro-screw driving",
        "Flexible circuit and ribbon cable manipulation without kinking or tear damage",
        "Shared human-robot assembly stations requiring certified collaborative power and force limiting",
      ],
    },
    roboticOpportunity: {
      title: "Active Force Control & Precision Insertion",
      description:
        "Equipping robots with multi-axis force-torque feedback and compliant joint actuators enables search-and-insert algorithms mimicking human touch.",
      points: [
        "6-DoF wrist force sensors dynamically modulating robot velocity to maintain target insertion forces",
        "Automated torque-angle screwdriving modules recording tightening curves for every fastener",
        "Sub-micron linear positioning stages and zero-backlash strain-wave reducers for stable poses",
        "Collaborative force and speed monitoring adhering to ISO/TS 15066 standards",
      ],
    },
    recommendedTechnologies: [
      "Collaborative Robots (Cobots)",
      "Intelligent Joint Actuators",
      "6-DoF Multi-Axis Force-Torque Sensors",
      "Electric Screwdriving Spindles",
      "Precision Ball Screw Modules",
      "Tactile Grippers",
    ],
    typicalApplications: [
      "Automotive powertrain gear and needle bearing press-fit",
      "Electronic consumer device housing screwdriving and snap-fit",
      "Medical syringe plunger insertion and valve assembly",
      "EV battery pack busbar fastening and wire harness routing",
      "Aerospace electrical connector pinning and torque auditing",
    ],
    systemArchitecture: [
      {
        step: "01",
        title: "Part Locating & Grip",
        description: "Robot picks precision component from feeder tray with tactile centering verification.",
      },
      {
        step: "02",
        title: "Approach & Hole Search",
        description: "End effector approaches mating feature; spiral search algorithm identifies hole center by force drop.",
      },
      {
        step: "03",
        title: "Controlled Insertion",
        description: "Linear downward motion regulated to stay below preset contact force threshold (e.g. < 25 N).",
      },
      {
        step: "04",
        title: "Fastening & Torque Logging",
        description: "Automatic screwdriver torques fastener to calibrated Nm target with full angle-time trace logging.",
      },
    ],
    relevantProducts: [
      {
        name: "Intelligent Joint Actuators",
        category: "Actuators",
        href: "/products/intelligent-actuators",
        description: "Integrated joint modules with dual encoders and torque sensing for compliant assembly.",
      },
      {
        name: "Cobots & Industrial Robots",
        category: "Industrial Robots",
        href: "/products/industrial-robots",
        description: "Precision collaborative and SCARA robots for fine mechanical assembly.",
      },
      {
        name: "Linear Motion Systems",
        category: "Linear Motion",
        href: "/products/linear-motion",
        description: "High-precision ball screw and linear motor stages for micrometer insertion.",
      },
      {
        name: "Control Systems",
        category: "Control Systems",
        href: "/products/control-systems",
        description: "Motion controllers supporting real-time force loop feedback via EtherCAT.",
      },
    ],
    technicalResources: [
      {
        title: "Active Force-Torque Control Algorithms in Robotic Assembly",
        type: "Technical Article",
        href: "/resources?type=article",
      },
      {
        title: "ISO/TS 15066 Collaborative Power and Force Limiting Guide",
        type: "Application Note",
        href: "/resources?type=app-note",
      },
    ],
    workpieceType: "Bearings, gears, electronic enclosures, fasteners, medical cartridges, and flex-PCBs",
    payloadRequirements: "3 kg to 20 kg handling capacity with low moment of inertia",
    positioningRepeatability: "±0.01 mm with active force-guided search compliance down to 10 µm fit",
    operatingEnvironment: "Clean, temperature-regulated assembly cells, ESD-safe workstations",
    cycleTimeConsiderations: "Controlled insertion velocity (10–50 mm/s) ensuring zero impact spikes",
    sensingControlRequirements: "6-axis force-torque sensor, screwdriving current/torque feedback, optical verification",
    technicalConsiderations: {
      title: "Assembly Integration & Compliant Motion Considerations",
      description: "Critical factors when engineering high-yield automated insertion and assembly workstations.",
      points: [
        "Force control loop latency: Keeping the EtherCAT bus cycle time below 500 µs to ensure the controller reacts to contact forces before mechanical wedging occurs.",
        "Tool center point (TCP) stiffness: Balancing mechanical stiffness for positioning accuracy against compliance needed to avoid part damage during insertion.",
        "Screw feeder integration: Designing jam-free blow-feed or pick-and-present screw delivery channels with optical screw-present confirmation.",
        "Traceability database logging: Linking every screw tightening angle, peak torque, and insertion force curve to the product serial number for MES compliance.",
      ],
    },
    safetyRequirements: {
      title: "Assembly Cell Safety & Collaborative Standards",
      standards: [
        "ISO 10218-1/2 (Robot Safety)",
        "ISO/TS 15066 (Collaborative Robots)",
        "ISO 13849-1 PL d (Safety Architecture)",
      ],
      guidelines: [
        "Collaborative force and pressure limiting verified via calibrated bio-fidelic crush test meters",
        "Ergonomic dual-hand safety switches for manual part load/unload stations",
        "Light curtains or laser area scanners muting robot speed when operators approach",
      ],
    },
    faqs: [
      {
        question: "Can a robot insert a peg into a hole with less than 20 µm clearance?",
        answer: "Yes. By executing a high-frequency spiral search pattern while monitoring 6-DoF wrist forces, the robot senses the chamfer edge and aligns the mating axis smoothly without binding.",
      },
      {
        question: "How does the system ensure screws are not cross-threaded?",
        answer: "The screwdriving spindle begins with a brief reverse rotation until the thread drop is detected, then tightens forward while verifying that the torque vs. angle curve stays within calibrated upper/lower limits.",
      },
    ],
  },
  {
    id: "material-handling",
    title: "Material Handling",
    shortDescription:
      "Autonomous movement, transfer, and line-side positioning of raw stock, totes, and pallets across manufacturing facilities.",
    heroSubtitle:
      "Deterministic intralogistics, automated mobile robotics, and high-payload workpiece transfer.",
    industryOverview:
      "Internal factory logistics and material handling traditionally account for up to 25% of operational manufacturing costs. Transporting raw stampings from receiving to stamping lines, transferring engine blocks between machining cells, and moving finished assemblies to buffer areas requires continuous, safe material flow. Autonomous Mobile Robots (AMRs), Automated Guided Vehicles (AGVs), and heavy articulated transfer arms eliminate manual forklift traffic and streamline intralogistics with deterministic tracking.",
    automationChallenges: {
      title: "Dynamic Factory Traffic & Heavy Payload Shock",
      description:
        "Factory aisles feature dynamic obstacles, uneven floor expansion joints, and changing pedestrian traffic that challenge mobile robots.",
      points: [
        "Navigation through congested aisles shared with forklifts, operators, and manual carts",
        "Heavy shock and vibration transferred to drivetrain wheel modules over dock plates and floor cracks",
        "Battery runtime constraints requiring opportunistic rapid charging without stopping production",
        "Accurate docking precision (sub-5mm) required when interfacing with conveyors or CNC loading stands",
      ],
    },
    roboticOpportunity: {
      title: "Autonomous Navigation & Omnidirectional Mobility",
      description:
        "Equipping mobile bases with LiDAR SLAM, Mecanum wheels, and planetary wheel hub drives delivers 360-degree mobility in tight aisles.",
      points: [
        "Natural feature LiDAR SLAM navigation operating without magnetic tape or floor reflectors",
        "Omnidirectional Mecanum wheel drivetrains enabling sideways crabbing in narrow machining aisles",
        "High-density planetary wheel hub gearboxes delivering high torque in compact hub envelopes",
        "Certified safety laser scanners dynamically adjusting safety protective fields based on speed",
      ],
    },
    recommendedTechnologies: [
      "Autonomous Mobile Robots (AMRs)",
      "Mecanum & Omni Wheels",
      "Planetary Wheel Hub Drives",
      "Safety Laser Scanners (LiDAR)",
      "Automated Battery Docking Contacts",
      "Fleet Management Software",
    ],
    typicalApplications: [
      "Warehouse-to-line tote transport for automotive assembly lines",
      "Heavy coil and sheet metal transfer in stamping plants",
      "Cleanroom wafer pod transport via sealed SMIF AMRs",
      "Finished goods pallet transport from packing to stretch wrapper",
      "Automated trash and metal scrap bin disposal runs",
    ],
    systemArchitecture: [
      {
        step: "01",
        title: "Dispatch & Task Assignment",
        description: "Central fleet software receives MES material call and dispatches closest idle AMR.",
      },
      {
        step: "02",
        title: "Autonomous Navigation",
        description: "AMR navigates aisles using 2D/3D LiDAR SLAM, dynamically avoiding temporary obstacles.",
      },
      {
        step: "03",
        title: "Precision Docking",
        description: "Optical docking camera or ultrasonic locators guide AMR within ±3 mm of station conveyor.",
      },
      {
        step: "04",
        title: "Transfer & Handshake",
        description: "Motorized roller deck transfers tote to line; wireless safety handshake confirms clear transfer.",
      },
    ],
    relevantProducts: [
      {
        name: "Robotic Wheels & AGV Modules",
        category: "Robotic Wheels",
        href: "/products/robotic-wheels",
        description: "Heavy-duty Mecanum wheels, polyurethane drive wheels, and integrated steering modules.",
      },
      {
        name: "Industrial Robots & Arms",
        category: "Industrial Robots",
        href: "/products/industrial-robots",
        description: "High-payload articulated arms for heavy transfer and pallet loading.",
      },
      {
        name: "Planetary Reducers",
        category: "Precision Reducers",
        href: "/products/precision-reducers",
        description: "Compact in-hub planetary gearboxes for AGV traction drivetrains.",
      },
      {
        name: "Sensors & Control Systems",
        category: "Control Systems",
        href: "/products/control-systems",
        description: "Navigation controllers and safety PLC interfaces for autonomous mobile bases.",
      },
    ],
    technicalResources: [
      {
        title: "ISO 3691-4 Safety Guidelines for Autonomous Industrial Mobile Robots",
        type: "Application Note",
        href: "/resources?type=app-note",
      },
      {
        title: "AGV Drive Wheel Sizing & Traction Friction Modeling",
        type: "Technical Article",
        href: "/resources?type=article",
      },
    ],
    workpieceType: "Totes, pallets, sheet metal coils, engine blocks, and raw material bins",
    payloadRequirements: "50 kg to 1,200 kg mobile payload capacity across varied chassis designs",
    positioningRepeatability: "±3 mm to ±5 mm docking precision at conveyor transfer stations",
    operatingEnvironment: "Indoor industrial warehouses, concrete factory floors, ambient 0°C to 45°C",
    cycleTimeConsiderations: "Continuous 24/7 duty cycle supported by automated fast-charging battery docks",
    sensingControlRequirements: "Dual safety LiDAR scanners, 3D obstacle avoidance cameras, wheel encoders",
    technicalConsiderations: {
      title: "Mobile Drive & Docking Integration Considerations",
      description: "Engineering requirements for high-uptime mobile intralogistics fleets.",
      points: [
        "Wheel suspension and floor compliance: Incorporating spring-damped rocker suspensions to maintain drive wheel traction over floor unevenness.",
        "Torque and brake sizing: Ensuring wheel hub gearboxes have adequate holding brake torque to stop the vehicle on maximum rated floor slopes.",
        "Wireless safety communication: Implementing fail-safe industrial Wi-Fi or 5G protocol handshakes (e.g. PROFIsafe over wireless) during station transfers.",
        "Thermal dissipation in wheel hubs: Designing planetary gearheads with low churning losses for continuous high-load traversing.",
      ],
    },
    safetyRequirements: {
      title: "Mobile Robot Safety & Fleet Compliance",
      standards: [
        "ISO 3691-4 (Driverless Industrial Trucks and Their Systems)",
        "ANSI/ITSDF B56.5 (Safety Standard for Guided Industrial Vehicles)",
        "ISO 13849-1 PL d (Functional Safety of Safety Functions)",
      ],
      guidelines: [
        "Dual Class 1 eye-safe safety laser scanners providing 360-degree obstacle detection",
        "Speed-dependent protective safety zones dynamically switching fields during turning or high-speed runs",
        "Flashing amber safety beacon and audible motion buzzer operating during movement",
        "Prominent emergency stop pushbuttons on all four corners of the chassis",
      ],
    },
    faqs: [
      {
        question: "How does the mobile robot avoid collisions with pedestrians in shared aisles?",
        answer: "Certified safety laser scanners scan 360 degrees around the base. When an obstacle enters the warning zone, the robot slows down; if it breaches the stop zone, the robot executes a fail-safe Category 0/1 stop.",
      },
      {
        question: "What is the typical battery charging strategy for continuous 24/7 operation?",
        answer: "AMRs use high-rate lithium-iron-phosphate (LFP) batteries with opportunistic charging: whenever a robot is waiting at an infeed or outfeed station, it docks against floor charge contacts for 3–5 minutes.",
      },
    ],
  },
  {
    id: "machine-vision-inspection",
    title: "Machine Vision Inspection",
    shortDescription:
      "Automated in-line metrology, 3D laser profilometry, defect detection, and optical quality verification.",
    heroSubtitle:
      "Contactless dimensional auditing and sub-millimeter defect detection at production line speeds.",
    industryOverview:
      "Modern high-precision manufacturing leaves no margin for defective parts reaching downstream assembly. Traditional manual inspection is labor-intensive, subject to operator fatigue, and limited to statistical batch sampling. Automated robotic inspection pairs articulated robots and multi-axis positioning stages with high-speed 3D laser scanners, telecentric optical sensors, and AI neural classifiers to perform 100% in-line dimensional auditing, surface scratch detection, and assembly verification at takt time.",
    automationChallenges: {
      title: "Metrology Accuracy on the Factory Floor",
      description:
        "Factory ambient vibration, variable lighting, and complex contoured geometries challenge traditional optical tools, causing measurement noise and false reject calls.",
      points: [
        "Shop floor vibration and thermal expansion skewing micron-level optical measurements",
        "Complex organic curved surfaces requiring full 6-axis camera orientation to maintain focal depth",
        "Inspection bottlenecking production when cycle times exceed line takt time",
        "Need for automated closed-loop tool wear compensation back to upstream CNCs",
      ],
    },
    roboticOpportunity: {
      title: "In-Line Robotic Metrology",
      description:
        "Equipping high-repeatability robotic arms with 3D blue-light scanners, laser profilometers, and telecentric cameras allows comprehensive part digitization in under 30 seconds.",
      points: [
        "Full 3D point cloud generation comparing physical parts directly to CAD nominals",
        "Optical non-contact measurement avoiding surface scratching on polished parts",
        "Dynamic tool wear compensation sending automatic offset corrections to CNC machines",
        "Automated statistical process control (SPC) charts detecting process drift in real time",
      ],
    },
    recommendedTechnologies: [
      "High-Repeatability 6-Axis Arms",
      "Blue-Light 3D Scanners",
      "Telecentric Optical Gauges",
      "Thermal Compensation Sensors",
      "Metrology SPC Software",
      "Coordinated Motion Controllers",
    ],
    typicalApplications: [
      "Automotive stamped door and hood gap-and-flush optical inspection",
      "Aerospace turbine blade 3D airfoil profile scanning",
      "Machined transmission housing bore diameter and roundness checking",
      "Medical implant surface roughness and defect scanning",
      "Electronic PCB solder joint and component presence inspection",
    ],
    systemArchitecture: [
      {
        step: "01",
        title: "Part Presentation",
        description: "Conveyor indexes manufactured component into light-controlled inspection booth.",
      },
      {
        step: "02",
        title: "Multi-Angle 3D Scan",
        description: "Robot guides 3D blue-light scanner around part, capturing point cloud in calibrated poses.",
      },
      {
        step: "03",
        title: "CAD Deviation Analysis",
        description: "Software aligns point cloud to CAD model and computes geometric dimensioning (GD&T).",
      },
      {
        step: "04",
        title: "Sorting & Feedback",
        description: "Pass parts continue to packing; rejects are diverted to quarantine with defect heatmaps.",
      },
    ],
    relevantProducts: [
      {
        name: "6-Axis Robotic Arm",
        category: "Robotic Arms",
        href: "/products/industrial-robots",
        description: "High-accuracy articulated robot with sub-millimeter path repeatability.",
      },
      {
        name: "Precision Robotic Reducer",
        category: "Precision Reducers",
        href: "/products/precision-reducers",
        description: "Zero-backlash strain wave gears for ultra-stable inspection poses.",
      },
      {
        name: "Coordinated Motion Controller",
        category: "Control Systems",
        href: "/products/control-systems",
        description: "Synchronizes robot motion with high-speed camera exposure triggers.",
      },
      {
        name: "Actuators & Motion Systems",
        category: "Actuators",
        href: "/products/actuators",
        description: "Direct-drive rotary tables for 360-degree part inspection.",
      },
    ],
    technicalResources: [
      {
        title: "Automated 3D Metrology vs Offline CMM Economics",
        type: "Case Study",
        href: "/resources?type=case-study",
      },
      {
        title: "Optical Inspection Lighting & Lens Selection",
        type: "Application Note",
        href: "/resources?type=app-note",
      },
    ],
    workpieceType: "Machined housings, turbine airfoils, electronic boards, and stamped panels",
    payloadRequirements: "1 kg to 5 kg (sensor / camera end-of-arm tooling)",
    positioningRepeatability: "±0.01 mm for stable camera positioning and laser profiling",
    operatingEnvironment: "Light-controlled inspection cell, vibration-isolated mounting",
    cycleTimeConsiderations: "In-line 100% inspection at conveyor line speed (< 100 ms per image acquisition)",
    sensingControlRequirements: "Trigger synchronization with robot encoder positions, optical strobe lighting",
    technicalConsiderations: {
      title: "Vision & Motion Synchronization Considerations",
      description: "Critical factors when integrating machine vision cameras onto robotic articulation arms.",
      points: [
        "Position-synchronized exposure triggers: Generating hardware pulses from robot axis encoders to capture blur-free frames at precise spatial coordinates.",
        "Optical focal depth and lighting: Maintaining constant working distance and utilizing polarized or diffuse multi-spectrum lighting to eliminate glare on machined surfaces.",
        "Point cloud coordinate transformation: Hand-eye calibration linking camera reference frames directly to the robot tool center point (TCP).",
        "Deterministic pass/fail gating: Direct fieldbus signaling to reject diversions within line takt time constraints.",
      ],
    },
    safetyRequirements: {
      title: "Metrology Workcell Safety & Compliance",
      standards: [
        "ISO 10218-1/2 (Robot Safety)",
        "IEC 62471 (Photobiological Safety of Lamps and Lamp Systems)",
        "ISO 13849-1 PL d",
      ],
      guidelines: [
        "Enclosed inspection booth shielding workers from high-intensity strobe illumination and Class 3R/3B laser beams",
        "Interlocked access doors with automatic laser blanking upon door opening",
        "Emergency Stop pushbuttons accessible at infeed and outfeed operator stations",
      ],
    },
    faqs: [
      {
        question: "Can robotic vision inspect 3D dimensions as accurately as a CMM?",
        answer: "Modern blue-light optical scanners and 3D laser profilers mounted on high-repeatability robots achieve measurement accuracies down to ±10–25 µm, which is suitable for 100% in-line production auditing, while traditional CMMs remain the offline reference standard for sub-micron master calibration.",
      },
      {
        question: "How does the system handle part-to-part variation on raw conveyors?",
        answer: "A wide-field 2D overview camera detects incoming part orientation (X, Y, theta) and dynamically offsets the 6-axis robot inspection trajectory to align with the actual part pose.",
      },
    ],
  },
  {
    id: "palletizing-depalletizing",
    title: "Palletizing and Depalletizing",
    shortDescription:
      "Automated stacking and destacking of cases, crates, and shipping containers onto pallets with flexible layer patterns.",
    heroSubtitle:
      "Heavy-payload articulated stacking, multi-line case accumulation, and automated slip-sheet handling.",
    industryOverview:
      "End-of-line packaging operations demand heavy lifting, high continuous duty cycles, and adaptable layer formation. Manual palletizing represents one of the leading causes of musculoskeletal injuries in food, beverage, chemical, and consumer goods plants. Dedicated 4-axis and 6-axis palletizing robots equipped with high-capacity vacuum foam grippers or mechanical clamp tooling automate single or multi-line palletizing, handling up to 180 kg payloads at rates of 15 to 28 cycles per minute with automated slip-sheet insertion.",
    automationChallenges: {
      title: "Heavy Payload Torques & SKU Pattern Flexibility",
      description:
        "Palletizing involves large operating envelopes (up to 3.1 m reach), high overhung wrist moments, and frequent carton dimension changes.",
      points: [
        "Extreme overhung moments on robot wrists during full-reach pallet layer placement",
        "Frequent SKU changeovers requiring dynamic pattern recalculation without manual robot reteaching",
        "Fragile carton walls susceptible to crushing under excessive mechanical clamp force",
        "Pallet height variations requiring continuous optical top-of-stack height sensing",
      ],
    },
    roboticOpportunity: {
      title: "High-Throughput Articulated Palletizing",
      description:
        "4-axis parallel-link and 6-axis articulated palletizers deliver rigid vertical stability and rapid multi-case picking.",
      points: [
        "Multi-case vacuum grid grippers picking entire rows or layers in a single cycle",
        "High-torque RV cycloidal reducers on base and shoulder joints withstanding continuous reversing inertia",
        "Parametric pattern generation software allowing operators to build new pallet layers in minutes",
        "Integrated vacuum cup auxiliary tooling for automated slip-sheet and wooden pallet dispensing",
      ],
    },
    recommendedTechnologies: [
      "4-Axis High-Reach Palletizing Robots",
      "Heavy-Duty RV Cycloidal Reducers",
      "Area Vacuum Foam Grippers",
      "High-Torque Servo Drives",
      "Pallet Pattern Generation Software",
      "Safety Optical Muting Curtains",
    ],
    typicalApplications: [
      "Beverage crate and carton multi-line palletizing",
      "Food packaging corrugated case stacking onto CHEP pallets",
      "Chemical bag and pail palletizing with layer press leveling",
      "Depalletizing empty cans and bottles into filling lines",
      "Cold-storage packaging cell palletizing down to -25°C",
    ],
    systemArchitecture: [
      {
        step: "01",
        title: "Case Infeed & Metering",
        description: "Infeed conveyor collates and turns cartons into programmed pick orientation.",
      },
      {
        step: "02",
        title: "Multi-Case Vacuum Grip",
        description: "Robot positions vacuum grid gripper over carton group and engages high-flow vacuum.",
      },
      {
        step: "03",
        title: "Layer Stacking Trajectory",
        description: "Robot executes smooth high-reach trajectory to pallet position, compensating for stack height.",
      },
      {
        step: "04",
        title: "Slip-Sheet & Pallet Discharge",
        description: "Auxiliary suction cups place cardboard slip-sheet; completed pallet discharges to wrapper.",
      },
    ],
    relevantProducts: [
      {
        name: "Palletizing Robots",
        category: "Industrial Robots",
        href: "/products/industrial-robots",
        description: "High-reach 4-axis and 6-axis robots with payload capacities up to 180 kg.",
      },
      {
        name: "Precision Reducers",
        category: "Precision Reducers",
        href: "/products/precision-reducers",
        description: "Ultra-heavy-duty RV cycloidal gearboxes engineered for high tilting moment loads.",
      },
      {
        name: "End Effectors & Tooling",
        category: "End Effectors",
        href: "/products/end-effectors",
        description: "Vacuum foam grid grippers and mechanical clamp tooling for diverse carton SKUs.",
      },
      {
        name: "Servo Motors & Drives",
        category: "Motors and Drives",
        href: "/products/servo-motors",
        description: "High-torque synchronous servomotors with integrated dynamic braking.",
      },
    ],
    technicalResources: [
      {
        title: "Palletizing Wrist Overhung Moment & Payload Sizing Calculation",
        type: "Application Note",
        href: "/resources?type=app-note",
      },
      {
        title: "Vacuum Grid vs Mechanical Clamp Gripper Selection Guide",
        type: "Technical Article",
        href: "/resources?type=article",
      },
    ],
    workpieceType: "Corrugated cases, plastic crates, multi-wall paper bags, and plastic pails",
    payloadRequirements: "50 kg to 180 kg continuous handling capacity including gripper tooling",
    positioningRepeatability: "±0.5 mm stacking accuracy across pallet layers up to 2.4 m height",
    operatingEnvironment: "Ambient packaging floors, dusty chemical lines, or cold storage (-25°C to 40°C)",
    cycleTimeConsiderations: "15 to 28 cycles/minute; multi-case picking yields up to 60+ cases/minute",
    sensingControlRequirements: "Pallet presence photoeyes, ultrasonic stack height sensor, vacuum pressure switches",
    technicalConsiderations: {
      title: "Pallet Cell Kinematic & Payload Sizing Considerations",
      description: "Critical engineering calculations when sizing high-reach palletizing workcells.",
      points: [
        "Wrist tilting moment calculations: Verifying that product center-of-gravity offsets and acceleration torques do not exceed manufacturer allowable wrist moment (Nm).",
        "Vacuum air consumption sizing: Selecting regenerative vacuum blowers capable of maintaining holding force even when 25% of foam area is uncovered on partial picks.",
        "Pallet dispenser interfacing: Coordinating pneumatic stops and chain conveyor transfers with the palletizing robot controller via discrete safety interlocks.",
        "Cycle-time optimization: Utilizing parabolic s-curve trajectories that avoid sharp jerks while minimizing transit time between infeed and pallet stack.",
      ],
    },
    safetyRequirements: {
      title: "Palletizing Workcell Safety Standards",
      standards: [
        "ISO 10218-1/2 (Industrial Robot Safety)",
        "ISO 13849-1 PL d / Cat 3 (Machinery Safety)",
        "EN 415-4 (Packaging Machines: Palletizers and Depalletizers Safety)",
      ],
      guidelines: [
        "Interlocked perimeter fencing at least 2.0 m high enclosing the entire pallet swing envelope",
        "Optical safety light curtains with muting sensors for pallet discharge openings allowing pallet exit while blocking human entry",
        "Pneumatic air dump valves ensuring zero residual energy in gripper upon E-stop activation",
      ],
    },
    faqs: [
      {
        question: "Can the robot palletize multiple production lines simultaneously?",
        answer: "Yes. Dual-pallet cells allow one robot to palletize two different product lines side-by-side onto separate pallets, alternating cycles based on case accumulation sensors.",
      },
      {
        question: "What happens if a box has weak cardboard that deforms under vacuum?",
        answer: "Area foam grippers distribute vacuum pressure across a wide surface area, drastically reducing PSI concentration compared to standard suction cups and preventing carton wall collapse.",
      },
    ],
  },
  {
    id: "surface-finishing",
    title: "Surface Finishing",
    shortDescription:
      "Force-controlled deburring, grinding, sanding, and polishing for consistent surface roughness on complex 3D contours.",
    heroSubtitle:
      "Active force compliance, automated spindle tool changing, and closed-loop contact force regulation.",
    industryOverview:
      "Surface finishing operations—such as deburring casting flash, grinding weld seams, blending turbine blade airfoils, and mirror-polishing sanitary fixtures—are traditionally among the most hazardous and inconsistent manual tasks in manufacturing. Workers face severe vibration fatigue (white-finger syndrome), abrasive dust exposure, and high scrap rates from uneven human pressure. Robotic surface finishing integrates active force-compliance devices with high-speed spindles and abrasive tool changers to maintain constant contact force along complex 3D paths.",
    automationChallenges: {
      title: "Force Regulation & Contoured Tool Wear",
      description:
        "Rigid position control gouges workpieces or burns abrasive discs when casting dimensions or parting lines vary.",
      points: [
        "Part-to-part dimensional variations causing inconsistent material removal under rigid trajectories",
        "Abrasive wheel and belt wear constantly changing tool diameter and contact pressure",
        "Severe airborne grinding dust and slurry requiring IP65/IP67 mechanical joint sealing",
        "Complex organic free-form surfaces requiring coordinated 6-axis surface normal vector tracking",
      ],
    },
    roboticOpportunity: {
      title: "Closed-Loop Active Force Compliance",
      description:
        "Pneumatic or electric active compliance heads decouple contact force control from robot arm mass, responding in milliseconds.",
      points: [
        "Active force control maintaining constant contact pressure (5 N to 150 N) within ±1 N regardless of robot path error",
        "Automatic tool changers swapping worn grinding discs and scotch-brite belts without operator intervention",
        "Zero-backlash precision reducers eliminating joint chatter marks on mirror-polished surfaces",
        "Laser tool measurement sensors updating tool diameter compensation offsets dynamically",
      ],
    },
    recommendedTechnologies: [
      "Active Force-Compliance Actuators",
      "High-Frequency Electric Spindles",
      "Zero-Backlash Harmonic Reducers",
      "Automatic Tool Changer Stations",
      "Laser Tool Presetter Gauges",
      "Dust-Sealed IP67 Robot Wrists",
    ],
    typicalApplications: [
      "Die-cast aluminum engine housing parting line deburring",
      "Aerospace titanium turbine blade leading-edge contour polishing",
      "Automotive stamped body panel weld seam blending",
      "Sanitary bathroom faucet and sink brass polishing",
      "Foundry iron casting riser cutoff and gate grinding",
    ],
    systemArchitecture: [
      {
        step: "01",
        title: "Workpiece Clamping & Tool Check",
        description: "Part clamped in rigid fixture; robot checks spindle tool diameter via optical laser gauge.",
      },
      {
        step: "02",
        title: "Rough Gate / Flash Grinding",
        description: "High-power electric spindle grinds heavy parting flash with regulated 80 N normal force.",
      },
      {
        step: "03",
        title: "Fine Deburring & Contour Blending",
        description: "Robot changes to rotary deburring tool and traces complex edges with compliant 15 N force.",
      },
      {
        step: "04",
        title: "Surface Inspection & Discharge",
        description: "Optical profilometer confirms edge radius and surface roughness (Ra) before release.",
      },
    ],
    relevantProducts: [
      {
        name: "Articulated Industrial Robots",
        category: "Industrial Robots",
        href: "/products/industrial-robots",
        description: "High-stiffness articulated robots with dust-sealed IP67 wrist protection.",
      },
      {
        name: "Precision Reducers",
        category: "Precision Reducers",
        href: "/products/precision-reducers",
        description: "Zero-backlash harmonic and cycloidal reducers preventing surface chatter vibrations.",
      },
      {
        name: "Actuators & Motion Systems",
        category: "Actuators",
        href: "/products/actuators",
        description: "High-frequency electric grinding spindles and compliant pneumatic actuators.",
      },
      {
        name: "Control Systems",
        category: "Control Systems",
        href: "/products/control-systems",
        description: "Motion controllers supporting real-time analog force sensor compensation loops.",
      },
    ],
    technicalResources: [
      {
        title: "Active Force Control vs Passive Compliance in Robotic Deburring",
        type: "Technical Article",
        href: "/resources?type=article",
      },
      {
        title: "Spindle Power & Abrasive Grain Sizing for Titanium Grinding",
        type: "Application Note",
        href: "/resources?type=app-note",
      },
    ],
    workpieceType: "Cast aluminum, forged steel, titanium airfoils, composite panels, and brass fixtures",
    payloadRequirements: "10 kg to 50 kg handling capacity accommodating spindle motor and compliance unit",
    positioningRepeatability: "±0.03 mm with active contact force compliance regulated within ±1 N",
    operatingEnvironment: "Abrasive dust, metallic grindings, coolant mist, noise-isolated enclosure",
    cycleTimeConsiderations: "Material removal rate matched to surface roughness Ra specifications",
    sensingControlRequirements: "Closed-loop normal force sensor, spindle load current monitor, laser tool wear presetter",
    technicalConsiderations: {
      title: "Finishing Cell Kinematics & Force Control Considerations",
      description: "Critical engineering calculations when configuring automated grinding and deburring workcells.",
      points: [
        "Force loop reaction time: Utilizing high-bandwidth active force actuators (≥ 50 Hz response) to react to surface bumps faster than the heavy robot arm kinematics can decelerate.",
        "Spindle power and torque curves: Ensuring electric spindles maintain constant RPM under variable grinding loads to prevent surface burning.",
        "Dust extraction integration: Designing high-velocity localized downdraft hoods adjacent to the grinding contact point to capture airborne combustible metallic dust.",
        "Vibration isolation: Mounting workpieces on rigid hydraulic damping fixtures to prevent chatter harmonics from imprinting on finished surfaces.",
      ],
    },
    safetyRequirements: {
      title: "Finishing Cell Safety & Environmental Standards",
      standards: [
        "ISO 10218-1/2 (Robot Safety)",
        "NFPA 484 / ATEX Directives (Combustible Dust Protection)",
        "ISO 13849-1 PL d",
      ],
      guidelines: [
        "Fully enclosed acoustic containment booth with interlocked doors reducing noise below 75 dBA",
        "Explosion-proof dust collection and wet scrubber ducting for reactive metal dust (aluminum/titanium)",
        "Automatic spindle stop interlocked with emergency stop and enclosure access doors",
      ],
    },
    faqs: [
      {
        question: "How does the robot compensate as the grinding disc wears down?",
        answer: "A non-contact optical laser sensor periodically measures the grinding disc diameter after a set number of parts, and the robot controller automatically adjusts the tool center point (TCP) offset.",
      },
      {
        question: "Can the robot finish both flat surfaces and curved edges?",
        answer: "Yes. By coordinating the 6-axis robot trajectory with the active compliance tool normal vector, the robot maintains continuous perpendicular contact across complex organic 3D contours.",
      },
    ],
  },
];

function mapAreaToItem(area: ApplicationArea): ApplicationItem {
  return {
    id: area.id,
    title: area.title,
    shortDescription: area.shortDescription,
    heroSubtitle: area.heroSubtitle,
    industryOverview: area.overview,
    automationChallenges: {
      title: `${area.title} Automation Hurdles`,
      description:
        "Demanding environmental conditions, high-speed cycle times, and precision limits dictate deterministic robotics.",
      points: area.keyChallenges,
    },
    roboticOpportunity: {
      title: "Robotic Automation Potential",
      description:
        "High-stiffness mechanical transmission, multi-axis sensory feedback, and real-time motion control.",
      points: area.automationOpportunities,
    },
    recommendedTechnologies: area.standardsAndDirectives,
    typicalApplications: area.useCases.slice(0, 5).map((u) => u.title),
    systemArchitecture: [
      {
        step: "01",
        title: "Infeed & Sensing",
        description: "Optical/tactile detection and pose estimation.",
      },
      {
        step: "02",
        title: "Kinematic Motion",
        description: "Deterministic multi-axis trajectory execution with zero backlash.",
      },
      {
        step: "03",
        title: "Process Execution",
        description: "Closed-loop force, torque, and speed regulation.",
      },
      {
        step: "04",
        title: "Quality Validation",
        description: "Continuous process logging and dimensional verification.",
      },
    ],
    relevantProducts: [
      {
        name: "Precision Reducers",
        category: "Reducers",
        href: "/products/precision-reducers",
        description: "Zero-backlash strain-wave and RV cycloidal drives.",
      },
      {
        name: "Coordinated Motion Controllers",
        category: "Controllers",
        href: "/products/control-systems",
        description: "Deterministic multi-axis trajectory control.",
      },
    ],
    technicalResources: [
      {
        title: `${area.title} Automation Engineering Guide`,
        type: "Technical Guide",
        href: "/resources",
      },
    ],
    useCases: area.useCases,
  };
}

export const all18ApplicationsData: ApplicationItem[] = ALL_18_APPLICATIONS.map((area) => {
  const existing = applicationsData.find((a) => a.id === area.id || a.id === area.slug);
  if (existing) {
    return { ...existing, useCases: area.useCases };
  }
  return mapAreaToItem(area);
});

export const getApplication = (id: string): ApplicationItem | undefined => {
  const normalizedId = id.toLowerCase().trim();

  // 1. Direct match in applicationsData
  const directMatch = applicationsData.find(
    (a) => a.id.toLowerCase() === normalizedId || a.id.toLowerCase().replace(/-/g, "") === normalizedId.replace(/-/g, "")
  );
  if (directMatch) {
    const area = getApplicationBySlug(id);
    return { ...directMatch, useCases: directMatch.useCases || area?.useCases || [] };
  }

  // 2. Check alias in APPLICATION_ALIASES
  const aliasedId = APPLICATION_ALIASES[normalizedId];
  if (aliasedId) {
    const aliasedMatch = applicationsData.find(
      (a) => a.id.toLowerCase() === aliasedId.toLowerCase() || a.id.toLowerCase().replace(/-/g, "") === aliasedId.toLowerCase().replace(/-/g, "")
    );
    if (aliasedMatch) {
      const area = getApplicationBySlug(aliasedId);
      return { ...aliasedMatch, useCases: aliasedMatch.useCases || area?.useCases || [] };
    }
  }

  // 3. Check in all 18 mapped applications
  const foundInAll18 = all18ApplicationsData.find(
    (a) => a.id.toLowerCase() === normalizedId || a.id.toLowerCase().replace(/-/g, "") === normalizedId.replace(/-/g, "")
  );
  if (foundInAll18) return foundInAll18;

  // 4. Fallback to area mapper
  const area = getApplicationBySlug(id);
  if (area) {
    return mapAreaToItem(area);
  }

  return undefined;
};

