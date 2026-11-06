import type {
  TrafficProfile,
  ContentAgent,
  GeneratedContentAsset,
  PublishingQueueItem,
  AttributionFunnelStage,
  ContentFormat,
} from "@/types/trafficAgents";

export const TRAFFIC_PROFILES: TrafficProfile[] = [
  {
    id: "TP-AUTO-01",
    name: "Tier-1 Automotive Gigafactory Body-in-White Assembly",
    sector: "Automotive",
    targetRole: "VP of Manufacturing & Body Shop Automation Director",
    buyingCommittee: [
      "Head of Robotics & Welding Cells",
      "Lead Controls Engineer (PLC & Safety)",
      "Procurement Director (Capital Equipment)",
    ],
    searchIntentKeywords: [
      "automotive spot welding cycle time reduction",
      "heavy payload robotic arm 500kg repeatability",
      "DIN 3990 robotic drivetrain fatigue life",
      "gigafactory battery tray laser dispensing robot",
    ],
    primaryPainPoint:
      "Cycle-time bottlenecks in structural spot welding where traditional robot wrists flex under dynamic reversing torque, reducing throughput by 1.8s per chassis.",
    technicalFriction:
      "Wrist deflection under 250kg weld gun acceleration causes weld tip misalignments, triggering automated ultrasonic inspection rejections.",
    conversionRoute: "/robotic-process-automation",
    monthlyTrafficPotential: 42000,
    avgDealSizeUsd: 650000,
    projectedConversionRate: 4.8,
    contentPillars: [
      "Multi-Axis Dynamic Wrist Torque Analysis",
      "Turnkey Spot & Arc Welding Cells",
      "100% Deterministic Kinematic Cycle Simulation",
    ],
  },
  {
    id: "TP-SEMI-02",
    name: "Semiconductor Cleanroom Sub-Micron Wafer Handling",
    sector: "Semiconductor",
    targetRole: "Cleanroom Automation Lead & Fab Equipment Architect",
    buyingCommittee: [
      "Director of Precision Motion Systems",
      "Yield Optimization Principal Engineer",
      "Cleanroom Facilities Safety Officer (ISO 14644-1)",
    ],
    searchIntentKeywords: [
      "true zero backlash robotic joint strain wave",
      "ISO Class 1 cleanroom vacuum wafer robot",
      "magnetic absolute encoder sub-arcsecond repeatability",
      "SEMI S2 S8 compliance robotic handling",
    ],
    primaryPainPoint:
      "Planetary gear backlash causing micro-vibrations and settling delays exceeding 120ms during 300mm FOUP wafer transfer, creating yield loss.",
    technicalFriction:
      "Mechanical shims degrade over 10M cycles, resulting in cumulative tooth-mesh deadband and particle shedding in Class 1 cleanrooms.",
    conversionRoute: "/video-based-robotization-calculator",
    monthlyTrafficPotential: 28000,
    avgDealSizeUsd: 820000,
    projectedConversionRate: 5.4,
    contentPillars: [
      "Strain-Wave Zero Backlash Mechanics",
      "Vibrational Settling Time Modeling",
      "Sub-Arcsecond Optical Encoder Feedback",
    ],
  },
  {
    id: "TP-AERO-03",
    name: "Aerospace 5-Axis Precision Titanium Machining Cells",
    sector: "Aerospace & Defense",
    targetRole: "Chief Manufacturing Engineer & CNC Automation VP",
    buyingCommittee: [
      "Metrology & GD&T Inspection Lead",
      "Defense Plant Operations Director",
      "Kinematic Milling Specialist",
    ],
    searchIntentKeywords: [
      "robotic drilling structural airframe titanium",
      "6-axis articulated robot overhung inertia calculation",
      "high rigidity cycloidal drive milling arm",
      "AS9100D robotic machining cell qualification",
    ],
    primaryPainPoint:
      "High cutting tool chatter and spindle backlash during 5-axis robotic edge deburring and fastener drilling of forged titanium wing spars.",
    technicalFriction:
      "Radial cutter loads produce angular torsional twist when standard articulated arms operate at extended reaches beyond 2,400mm.",
    conversionRoute: "/solutions/robotic-process-analysis-tools",
    monthlyTrafficPotential: 19500,
    avgDealSizeUsd: 1150000,
    projectedConversionRate: 3.9,
    contentPillars: [
      "Cycloidal Reducer Radial Rigidity Proofs",
      "ISO 9283 Robot Trajectory Path Accuracy",
      "Overhung Moment & Bearing Lifetime Sizing",
    ],
  },
  {
    id: "TP-LOGI-04",
    name: "Omni-Directional AMR & High-Speed Logistics Fleets",
    sector: "Warehousing & Logistics",
    targetRole: "Director of Fulfillment Engineering & Autonomous Fleet VP",
    buyingCommittee: [
      "AMR Software Architect (ROS 2 / Nav2)",
      "Warehouse Safety Director (ANSI/ITSDF B56.5)",
      "Supply Chain Maintenance Director",
    ],
    searchIntentKeywords: [
      "mecanum wheel payload 2000kg industrial AGV",
      "brushless servo drive CANopen fieldbus latency",
      "LiDAR SLAM dynamic obstacle avoidance AMR",
      "battery swap fast charge robotic logistics",
    ],
    primaryPainPoint:
      "Pallet transfer latency and wheel slippage in narrow-aisle fulfillment centers running 24/7 high-density carton sorting.",
    technicalFriction:
      "Steering drive motor overheating and low battery cycle efficiency on standard continuous duty mobile bases.",
    conversionRoute: "/solutions/warehouse-inventory-robot",
    monthlyTrafficPotential: 65000,
    avgDealSizeUsd: 380000,
    projectedConversionRate: 6.2,
    contentPillars: [
      "Heavy Payload Omni-Wheel Powertrains",
      "Sub-Millisecond TSN Fieldbus Synchronization",
      "Dynamic Stability & Overturn Safety Limits",
    ],
  },
  {
    id: "TP-HEAVY-05",
    name: "Heavy Industrial Foundry & High-Torque Die Casting",
    sector: "Heavy Industrial Machining",
    targetRole: "Plant General Manager & Foundry Operations Director",
    buyingCommittee: [
      "High-Temperature Automation Specialist",
      "EHS Foundry Safety Lead",
      "Heavy Tooling Design Engineer",
    ],
    searchIntentKeywords: [
      "IP67 harsh environment foundry robot arm",
      "die casting ladle pouring thermal protection robot",
      "high torque cycloidal reducer molten metal",
      "heavy forging manipulator shock load absorption",
    ],
    primaryPainPoint:
      "Extreme ambient temperatures (850°C thermal radiation) and abrasive silica dust destroying mechanical seals and servo feedback encoders.",
    technicalFriction:
      "Thermal expansion along cast iron arm castings causing axis seizure and encoder loss-of-sync during continuous molten metal pouring.",
    conversionRoute: "/application-finder",
    monthlyTrafficPotential: 22000,
    avgDealSizeUsd: 740000,
    projectedConversionRate: 4.1,
    contentPillars: [
      "Thermal Shielding & Pressurized Air Purge",
      "Shock Load Resilient Cycloidal Drives",
      "Explosion-Proof ATEX & IECEx Certifications",
    ],
  },
  {
    id: "TP-ELEC-06",
    name: "High-Speed Electronics SMT & Precision Dispensing",
    sector: "Electronics & SMT",
    targetRole: "Director of SMT Manufacturing & Micro-Dispensing Lead",
    buyingCommittee: [
      "High-Precision Metrology Specialist",
      "PCB Conformal Coating Process Engineer",
      "Clean Manufacturing Director",
    ],
    searchIntentKeywords: [
      "delta robot pick place 120 cycles per minute",
      "conformal coating fluid dispensing 0.01mm accuracy",
      "linear motor direct drive PCB handling",
      "high speed vision registration moving conveyor",
    ],
    primaryPainPoint:
      "Inability to exceed 80 cycles/minute without thermal drift and adhesive droplet satellite scattering on high-density smartphone boards.",
    technicalFriction:
      "Belt-driven gantries suffer from harmonic resonance, limiting acceleration to < 3G and causing settling overshoot at high cycle rates.",
    conversionRoute: "/robotic-process-automation",
    monthlyTrafficPotential: 34000,
    avgDealSizeUsd: 490000,
    projectedConversionRate: 5.7,
    contentPillars: [
      "Parallel Kinematics Delta Robot Dynamics",
      "Direct-Drive Linear Motion Actuation",
      "Jet Dispensing Sub-Millisecond Valve Control",
    ],
  },
];

export const CONTENT_AGENTS: ContentAgent[] = [
  {
    id: "AGENT-ALPHA",
    name: "Kinematics Deep-Tech Authority",
    codename: "Agent Alpha",
    role: "Physics & Mechanical Proof Synthesis",
    description:
      "Generates mathematically rigorous case studies, torque formulas, vibrational settling proofs, and DIN/ISO compliance engineering teardowns tailored to Chief Roboticists.",
    systemPrompt:
      "You are Agent Alpha, Chief Mechanical & Kinematics Engineering Writer for INDUS Robotics. Always provide physical formulas (T = J*alpha, Hertzian contact stress, ISO 9283 repeatability metrics), eliminate marketing fluff, and benchmark INDUS against German/Japanese industrial standards.",
    primaryChannel: "Engineering Case Studies & Whitepapers",
    status: "active",
    autonomyLevel: "Fully Autonomous",
    executionCadence: "Daily at 08:00 UTC",
    metrics: {
      assetsGenerated: 48,
      totalImpressions: 342000,
      inboundClicks: 16840,
      rfqsGenerated: 142,
      avgQualityScore: 97.4,
    },
  },
  {
    id: "AGENT-BETA",
    name: "LinkedIn Multi-Pillar Studio Publisher",
    codename: "Agent Beta",
    role: "Social Proof & Technical Carousel Architect",
    description:
      "Converts engineering teardowns into high-hook, swipeable carousel posts, visual architectural breakdowns, and peer-to-peer technical conversations for automation executives.",
    systemPrompt:
      "You are Agent Beta, Director of Technical Engagement for INDUS LinkedIn Studio. Format output into punchy technical hooks, 5 key engineering specifications, real factory context, and immediate call-to-actions to the INDUS Engineering portal.",
    primaryChannel: "LinkedIn Post & Visual Carousels",
    status: "active",
    autonomyLevel: "Fully Autonomous",
    executionCadence: "Twice Daily (09:30 & 15:30 IST)",
    metrics: {
      assetsGenerated: 104,
      totalImpressions: 890000,
      inboundClicks: 38200,
      rfqsGenerated: 310,
      avgQualityScore: 95.8,
    },
  },
  {
    id: "AGENT-GAMMA",
    name: "Traffic Attribution & Funnel Optimizer",
    codename: "Agent Gamma",
    role: "Inbound Intent Router & Conversion Optimizer",
    description:
      "Analyzes visitor intent, appends UTM campaign parameters, tracks tool completion rates on the Video Robotization Calculator, and dynamically tailors CTAs to maximize RFQ submissions.",
    systemPrompt:
      "You are Agent Gamma, Quantitative Traffic & Conversion Engineer. Continually analyze user interaction paths, optimize click-through parameters, and trigger automated re-engagement cadences when high-intent engineering leads land on calculator routes.",
    primaryChannel: "Dynamic Landing Pages & UTM Attribution",
    status: "active",
    autonomyLevel: "Supervised (Human-in-Loop)",
    executionCadence: "Continuous Telemetry Evaluation",
    metrics: {
      assetsGenerated: 32,
      totalImpressions: 275000,
      inboundClicks: 21900,
      rfqsGenerated: 265,
      avgQualityScore: 98.2,
    },
  },
  {
    id: "AGENT-DELTA",
    name: "Enterprise Lead Intelligence & Outreach",
    codename: "Agent Delta",
    role: "FIDO2 Verified Account Engagement",
    description:
      "Cross-references inbound company domain signals with the Lead Validation Agent (Gold Tier verification: official URL, personal LinkedIn, direct phone) and drafts custom engineering reachouts.",
    systemPrompt:
      "You are Agent Delta, Enterprise Account Solutions Architect. Audit inbound leads against rigorous Mentor Quality standards, filter out crawler junk, identify high-intent tier-1 plant accounts, and prepare customized technical proposals.",
    primaryChannel: "Direct Executive Outreach & VIP Briefs",
    status: "idle",
    autonomyLevel: "Supervised (Human-in-Loop)",
    executionCadence: "Triggered on High-Value Lead Intake",
    metrics: {
      assetsGenerated: 62,
      totalImpressions: 118000,
      inboundClicks: 9400,
      rfqsGenerated: 188,
      avgQualityScore: 99.1,
    },
  },
];

export const INITIAL_CONTENT_ASSETS: GeneratedContentAsset[] = [
  {
    id: "ASSET-INDUS-001",
    agentId: "AGENT-ALPHA",
    profileId: "TP-AUTO-01",
    format: "Kinematic Engineering Case Study",
    title: "Overcoming Wrist Deflection in 250kg Automotive Spot Welding Workcells",
    hook: "When high-speed weld gun acceleration exceeds 2.2G, standard robotic wrists flex by up to 0.45°, triggering automated weld-nugget ultrasonic inspection rejections.",
    context:
      "Modern automotive Body-in-White (BIW) lines require cycle times under 42 seconds per side-panel. Every millisecond wasted waiting for arm vibrational settling directly degrades OEM line OEE.",
    technicalProof:
      "INDUS heavy-duty articulated welding arms incorporate dual-bearing cycloidal reducers on Axes 4, 5, and 6 with torsional rigidity of 1,250 N·m/arcmin. Dynamic finite element modeling confirms that under full 250kg gun inertia, tool-center-point (TCP) deflection is maintained strictly below 0.08mm.",
    specs: [
      { label: "Rated Wrist Payload", value: "250 kg (ISO 9283)" },
      { label: "Torsional Rigidity", value: "1,250 N·m/arcmin" },
      { label: "Cycle Time Reduction", value: "1.95s per chassis side" },
      { label: "Path Repeatability", value: "± 0.05 mm" },
      { label: "Peak Operating Torque", value: "1,850 N·m (Axis 5)" },
    ],
    callToAction: {
      text: "Simulate BIW Spot Welding Cycle Times on INDUS RPA Hub",
      route: "/robotic-process-automation",
      utmParams: "utm_source=agent_alpha&utm_medium=case_study&utm_campaign=auto_biw_welding",
    },
    hashtags: ["#AutomotiveManufacturing", "#SpotWelding", "#RoboticKinematics", "#GigafactoryAutomation"],
    qualityScore: 98,
    status: "published",
    createdAt: "2026-11-06 08:30 UTC",
    projectedMetrics: {
      estimatedImpressions: 48000,
      expectedCtr: 4.6,
      attributedLeads: 24,
    },
  },
  {
    id: "ASSET-INDUS-002",
    agentId: "AGENT-BETA",
    profileId: "TP-SEMI-02",
    format: "LinkedIn Technical Teardown",
    title: "Strain Wave Gearing vs Planetary: Achieving True Zero Backlash in Wafer Handlers",
    hook: "In 300mm silicon wafer transfer, even a single arcminute of lost motion at the end-effector destroys die integrity during lithography chamber handoffs.",
    context:
      "Cleanroom fabs operating under SEMI S2/S8 standards cannot tolerate mechanical shimming or lubricants that outgas particles. True zero backlash is non-negotiable.",
    technicalProof:
      "INDUS Strain Wave Reducers utilize an elliptical wave generator driving a flexible alloy spline into continuous multi-tooth conjugate engagement. This creates zero mechanical deadband, zero backlash (< 0.1 arcmin), and reduces settling vibration to under 15ms.",
    specs: [
      { label: "Backlash Rating", value: "< 0.1 arcmin (True Zero)" },
      { label: "Cleanroom Compliance", value: "ISO 14644-1 Class 1" },
      { label: "Settling Time", value: "< 15 ms (7x faster than planetary)" },
      { label: "Reduction Ratios", value: "50:1 to 160:1" },
      { label: "Outgassing", value: "NASA SP-R-0022A Certified" },
    ],
    callToAction: {
      text: "Calculate Motion Payback on Video Robotization Suite",
      route: "/video-based-robotization-calculator",
      utmParams: "utm_source=agent_beta&utm_medium=linkedin&utm_campaign=semi_cleanroom_motion",
    },
    hashtags: ["#SemiconductorFab", "#StrainWaveGearing", "#PrecisionMotion", "#CleanroomRobotics"],
    qualityScore: 96,
    status: "published",
    createdAt: "2026-11-06 09:15 UTC",
    projectedMetrics: {
      estimatedImpressions: 62000,
      expectedCtr: 5.1,
      attributedLeads: 36,
    },
  },
  {
    id: "ASSET-INDUS-003",
    agentId: "AGENT-GAMMA",
    profileId: "TP-LOGI-04",
    format: "Multi-Slide Technical Carousel",
    title: "2,000kg Heavy Autonomous Mobile Robotics (AMR): Powertrain Stability Limits",
    hook: "Why 80% of warehouse AGV drive motors fail prematurely during high-torque turning maneuvers with max-payload pallets.",
    context:
      "High-density fulfillment centers demand dynamic omni-directional trajectory control without mechanical rollover risks or thermal shutdown on drive inverters.",
    technicalProof:
      "By integrating dual brushless permanent magnet servo drives with real-time CANopen/EtherCAT closed-loop feedback at 1kHz, INDUS AMR drive modules distribute tractive torque dynamically, reducing wheel scrub by 64% and extending tire tread life to 18,000 operating hours.",
    specs: [
      { label: "Max Payload Capacity", value: "2,000 kg" },
      { label: "Bus Sync Latency", value: "< 100 µs (TSN EtherCAT)" },
      { label: "Turning Radius", value: "Zero Radius (Omni-Directional)" },
      { label: "Tire Service Life", value: "18,000 hours continuous" },
      { label: "Safety Classification", value: "ANSI/ITSDF B56.5 Category 3" },
    ],
    callToAction: {
      text: "Explore INDUS Logistics Autonomous Fleets",
      route: "/solutions/warehouse-inventory-robot",
      utmParams: "utm_source=agent_gamma&utm_medium=carousel&utm_campaign=amr_powertrain_payload",
    },
    hashtags: ["#AutonomousMobileRobotics", "#AMR", "#Intralogistics", "#MaterialHandling"],
    qualityScore: 97,
    status: "queued",
    createdAt: "2026-11-06 11:45 UTC",
    projectedMetrics: {
      estimatedImpressions: 84000,
      expectedCtr: 6.3,
      attributedLeads: 52,
    },
  },
];

export const INITIAL_PUBLISHING_QUEUE: PublishingQueueItem[] = [
  {
    id: "QUEUE-001",
    assetId: "ASSET-INDUS-001",
    agentCodename: "Agent Alpha",
    profileName: "Tier-1 Automotive Gigafactory",
    title: "Overcoming Wrist Deflection in 250kg Automotive Spot Welding",
    channel: "LinkedIn",
    scheduledDate: "2026-11-07",
    scheduledTime: "09:30 IST",
    status: "SYNCED_TO_SHEETS",
    sheetsWebhookUrl:
      "https://script.google.com/macros/s/AKfycbw8NhfkPJGeYu4NAaisxN3FHaWmAVlZTmEO2x1CsBirRPvt5pQjI5zNv3qVXqEA2W1a/exec",
    livePostUrl: "https://www.linkedin.com/feed/update/urn:li:share:7259102488192004096",
  },
  {
    id: "QUEUE-002",
    assetId: "ASSET-INDUS-002",
    agentCodename: "Agent Beta",
    profileName: "Semiconductor Cleanroom Wafer Handling",
    title: "Strain Wave Gearing vs Planetary: True Zero Backlash in Wafer Handlers",
    channel: "LinkedIn",
    scheduledDate: "2026-11-07",
    scheduledTime: "15:30 IST",
    status: "SYNCED_TO_SHEETS",
    sheetsWebhookUrl:
      "https://script.google.com/macros/s/AKfycbw8NhfkPJGeYu4NAaisxN3FHaWmAVlZTmEO2x1CsBirRPvt5pQjI5zNv3qVXqEA2W1a/exec",
  },
  {
    id: "QUEUE-003",
    assetId: "ASSET-INDUS-003",
    agentCodename: "Agent Gamma",
    profileName: "Omni-Directional AMR Logistics Fleets",
    title: "2,000kg Heavy AMR Powertrain Stability Limits",
    channel: "LinkedIn",
    scheduledDate: "2026-11-08",
    scheduledTime: "09:30 IST",
    status: "QUEUED",
  },
  {
    id: "QUEUE-004",
    assetId: "ASSET-INDUS-004",
    agentCodename: "Agent Delta",
    profileName: "Aerospace 5-Axis Precision Machining",
    title: "Structural Airframe Titanium Deburring: Eliminating Cutter Chatter",
    channel: "Engineering Portal",
    scheduledDate: "2026-11-08",
    scheduledTime: "14:00 UTC",
    status: "QUEUED",
  },
];

export const ATTRIBUTION_FUNNEL_DATA: AttributionFunnelStage[] = [
  {
    stage: "Target Inbound Impressions",
    count: 1625000,
    conversionRate: 100,
    description: "Multi-channel technical content distributed across LinkedIn, Case Studies & Search",
  },
  {
    stage: "High-Intent Website Visits",
    count: 86340,
    conversionRate: 5.31,
    description: "Direct traffic lands on RPA, Calculator, and Engineering Solutions pages",
  },
  {
    stage: "Interactive Tool Engagements",
    count: 14210,
    conversionRate: 16.46,
    description: "Engineers run cycle time simulations and robotization ROI calculations",
  },
  {
    stage: "Qualified RFQ Inquiries",
    count: 904,
    conversionRate: 6.36,
    description: "Verified buying committee RFQs with CAD files and plant requirements submitted",
  },
  {
    stage: "Enterprise Pipeline Created",
    count: 142,
    conversionRate: 15.71,
    description: "Closed or in-procurement industrial robotics automation contracts ($74.2M)",
  },
];

/**
 * Storage helpers for browser persistence
 */
const STORAGE_QUEUE_KEY = "indus_traffic_agents_publishing_queue";
const STORAGE_ASSETS_KEY = "indus_traffic_agents_assets";

export function loadQueueFromStorage(): PublishingQueueItem[] {
  if (typeof window === "undefined") return INITIAL_PUBLISHING_QUEUE;
  try {
    const raw = localStorage.getItem(STORAGE_QUEUE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_PUBLISHING_QUEUE;
  } catch {
    return INITIAL_PUBLISHING_QUEUE;
  }
}

export function saveQueueToStorage(queue: PublishingQueueItem[]): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_QUEUE_KEY, JSON.stringify(queue));
    } catch {
      // ignore
    }
  }
}

export function loadAssetsFromStorage(): GeneratedContentAsset[] {
  if (typeof window === "undefined") return INITIAL_CONTENT_ASSETS;
  try {
    const raw = localStorage.getItem(STORAGE_ASSETS_KEY);
    return raw ? JSON.parse(raw) : INITIAL_CONTENT_ASSETS;
  } catch {
    return INITIAL_CONTENT_ASSETS;
  }
}

export function saveAssetsToStorage(assets: GeneratedContentAsset[]): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_ASSETS_KEY, JSON.stringify(assets));
    } catch {
      // ignore
    }
  }
}

/**
 * Autonomous Content Generator Engine
 * Simulates high-precision engineering generation based on Profile and Agent parameters
 */
export function generateAutonomousContentAsset(
  agentId: string,
  profileId: string,
  format: ContentFormat,
  productFocus: string
): GeneratedContentAsset {
  const profile = TRAFFIC_PROFILES.find((p) => p.id === profileId) || TRAFFIC_PROFILES[0];
  const agent = CONTENT_AGENTS.find((a) => a.id === agentId) || CONTENT_AGENTS[0];

  const assetId = `ASSET-INDUS-${Math.floor(100 + Math.random() * 900)}`;

  const titles: Record<string, string> = {
    "Automotive": `Deterministic Cycle Time Optimization in ${productFocus} for High-Volume BIW Lines`,
    "Semiconductor": `Sub-Micron Lost Motion Elimination: Benchmarking ${productFocus} in ISO Class 1 Fabs`,
    "Aerospace & Defense": `Mitigating Cutter Chatter in 5-Axis Airframe Machining via ${productFocus}`,
    "Warehousing & Logistics": `Dynamic Overturn Stability & Thermal Efficiency in ${productFocus} Fleets`,
    "Heavy Industrial Machining": `Harsh Environment IP67 Thermal Protection in ${productFocus} Foundry Cells`,
    "Electronics & SMT": `Ultra-Fast Micro-Dispensing & 3G Acceleration using ${productFocus}`,
  };

  const selectedTitle = titles[profile.sector] || `High-Precision Kinematic Optimization: ${productFocus}`;

  const generatedSpecs = [
    { label: "Target Kinematic Load", value: "Dynamic 150 kg – 500 kg" },
    { label: "Path Repeatability", value: "± 0.02 mm (ISO 9283)" },
    { label: "Cycle Acceleration", value: "Up to 3.5 G continuous" },
    { label: "Drivetrain Rigidity", value: "1,450 N·m/arcmin" },
    { label: "Calculated ROI Payback", value: "7.8 months" },
  ];

  return {
    id: assetId,
    agentId: agent.id,
    profileId: profile.id,
    format,
    title: selectedTitle,
    hook: `Why leading ${profile.targetRole}s are re-engineering their ${profile.sector.toLowerCase()} automation cells to eliminate ${profile.primaryPainPoint.toLowerCase().slice(0, 60)}...`,
    context: `In continuous 24/7 manufacturing operations, ${profile.technicalFriction}. Traditional approaches result in excessive downtime and quality reject rates.`,
    technicalProof: `By deploying ${productFocus} engineered to DIN 3990 and ISO 9283 kinematics standards, INDUS delivers deterministic repeatability, eliminating harmonic resonance and shaving up to 2.1s per cycle.`,
    specs: generatedSpecs,
    callToAction: {
      text: `Calculate Production Gains on INDUS ${profile.name.split(" ")[0]} Portal`,
      route: profile.conversionRoute,
      utmParams: `utm_source=${agent.codename.toLowerCase().replace(" ", "_")}&utm_medium=autonomous_agent&utm_campaign=${profile.id.toLowerCase()}`,
    },
    hashtags: [
      `#${profile.sector.replace(/[^a-zA-Z]/g, "")}Automation`,
      "#RoboticKinematics",
      "#INDUSRobotics",
      "#PhysicalAI",
    ],
    qualityScore: Math.floor(95 + Math.random() * 5),
    status: "draft",
    createdAt: new Date().toISOString().replace("T", " ").replace(/\..+/, " UTC"),
    projectedMetrics: {
      estimatedImpressions: Math.floor(35000 + Math.random() * 40000),
      expectedCtr: Math.round((4.2 + Math.random() * 2.5) * 10) / 10,
      attributedLeads: Math.floor(20 + Math.random() * 35),
    },
  };
}
