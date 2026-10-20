/**
 * INDUS Industrial Robotics — Official Research Sources Registry
 *
 * Traceable repository of international engineering standards, official manufacturer
 * technical datasheets, and test codes backing all specifications in the catalogue.
 */

export interface ResearchSourceRecord {
  id: string; // e.g. "src:iso-9283-1998"
  title: string;
  publisherOrManufacturer: string;
  url: string;
  relevantClaimOrStandard: string;
  dateAccessed: string;
  verificationStatus: "verified" | "configurable" | "preliminary";
  applicableNodes: string[];
}

export const RESEARCH_SOURCES_REGISTRY: ResearchSourceRecord[] = [
  // INTERNATIONAL STANDARDS
  {
    id: "src:iso-9283-1998",
    title: "ISO 9283: Manipulating industrial robots — Performance criteria and related test methods",
    publisherOrManufacturer: "International Organization for Standardization (ISO)",
    url: "https://www.iso.org/standard/20264.html",
    relevantClaimOrStandard: "Positional repeatability (RP), multi-directional path accuracy (AT), and pose stabilization time under rated payload.",
    dateAccessed: "2026-03-15",
    verificationStatus: "verified",
    applicableNodes: ["line:precision-reducers", "line:servo-motors", "line:robot-joint-actuators"],
  },
  {
    id: "src:din-3990-1987",
    title: "DIN 3990: Calculation of load capacity of cylindrical gears",
    publisherOrManufacturer: "Deutsches Institut für Normung (DIN)",
    url: "https://www.din.de/en",
    relevantClaimOrStandard: "Bending fatigue limits, contact pitting stress safety factors, and scoring temperature flash limits for industrial reducers.",
    dateAccessed: "2026-03-20",
    verificationStatus: "verified",
    applicableNodes: ["line:precision-reducers", "line:mechanical-transmission"],
  },
  {
    id: "src:agma-6013-b16",
    title: "AGMA 6013-B16: Standard for Industrial Enclosed Gear Drives",
    publisherOrManufacturer: "American Gear Manufacturers Association (AGMA)",
    url: "https://www.agma.org",
    relevantClaimOrStandard: "Service factor definitions, thermal dissipation equilibrium ratings, and overload shock ratings (up to 500% momentary stall).",
    dateAccessed: "2026-03-18",
    verificationStatus: "verified",
    applicableNodes: ["line:precision-reducers"],
  },
  {
    id: "src:iec-60034-1-2022",
    title: "IEC 60034-1: Rotating electrical machines - Rating and performance",
    publisherOrManufacturer: "International Electrotechnical Commission (IEC)",
    url: "https://www.iec.ch",
    relevantClaimOrStandard: "Duty cycle classifications (S1 continuous through S8 periodic), temperature rise limits (Class F / Class H), and insulation breakdown.",
    dateAccessed: "2026-03-22",
    verificationStatus: "verified",
    applicableNodes: ["line:servo-motors", "line:robot-joint-actuators", "line:servo-drives"],
  },
  {
    id: "src:iso-13849-1-2023",
    title: "ISO 13849-1: Safety of machinery — Safety-related parts of control systems — General principles for design",
    publisherOrManufacturer: "International Organization for Standardization (ISO)",
    url: "https://www.iso.org/standard/79848.html",
    relevantClaimOrStandard: "Performance Levels (PL a to PL e), Designated Architectures (Category B, 1, 2, 3, 4), and Mean Time to Dangerous Failure (MTTFd).",
    dateAccessed: "2026-03-10",
    verificationStatus: "verified",
    applicableNodes: ["line:robotics-safety", "line:robot-controllers", "line:servo-drives"],
  },
  {
    id: "src:iec-62061-2021",
    title: "IEC 62061: Safety of machinery - Functional safety of safety-related control systems",
    publisherOrManufacturer: "International Electrotechnical Commission (IEC)",
    url: "https://www.iec.ch",
    relevantClaimOrStandard: "Safety Integrity Levels (SIL 1, SIL 2, SIL 3) for programmable electronic safety systems and Safe Motion monitoring.",
    dateAccessed: "2026-03-12",
    verificationStatus: "verified",
    applicableNodes: ["line:robotics-safety", "line:robot-controllers"],
  },
  {
    id: "src:iso-10218-1-2-2011",
    title: "ISO 10218-1 / ISO 10218-2: Robots and robotic devices — Safety requirements for industrial robots",
    publisherOrManufacturer: "International Organization for Standardization (ISO)",
    url: "https://www.iso.org/standard/51330.html",
    relevantClaimOrStandard: "Robot construction safety rules, dual-channel interlocks, dynamic axis limiting, and safeguarding integration boundaries.",
    dateAccessed: "2026-03-14",
    verificationStatus: "verified",
    applicableNodes: ["line:robot-joint-actuators", "line:robotics-safety", "line:robot-controllers"],
  },
  {
    id: "src:iso-ts-15066-2016",
    title: "ISO/TS 15066: Robots and robotic devices — Collaborative robots",
    publisherOrManufacturer: "International Organization for Standardization (ISO)",
    url: "https://www.iso.org/standard/62996.html",
    relevantClaimOrStandard: "Biomechanic biomechanical limit values for transient and quasi-static contact across 29 body regions; power and force limiting (PFL).",
    dateAccessed: "2026-03-14",
    verificationStatus: "verified",
    applicableNodes: ["line:robot-joint-actuators", "line:sensors-encoders", "line:end-effectors"],
  },
  {
    id: "src:iso-9409-1-2004",
    title: "ISO 9409-1: Manipulating industrial robots — Mechanical interfaces — Part 1: Plates",
    publisherOrManufacturer: "International Organization for Standardization (ISO)",
    url: "https://www.iso.org/standard/34327.html",
    relevantClaimOrStandard: "Standardized robot tool flange bolt circles (ISO 50, ISO 63, ISO 9409-1-50-4-M6) and center locating boss dimensions.",
    dateAccessed: "2026-03-25",
    verificationStatus: "verified",
    applicableNodes: ["line:end-effectors", "line:precision-reducers", "line:robot-joint-actuators"],
  },
  {
    id: "src:iso-3408-2006",
    title: "ISO 3408: Ball screws — Parts 1 to 5: Vocabulary, nominal dimensions, static and dynamic ratings, and acceptance conditions",
    publisherOrManufacturer: "International Organization for Standardization (ISO)",
    url: "https://www.iso.org/standard/41662.html",
    relevantClaimOrStandard: "Lead accuracy grades (C1, C3, C5), preload definitions (2% to 10% dynamic capacity), and critical whirling speed limits.",
    dateAccessed: "2026-03-20",
    verificationStatus: "verified",
    applicableNodes: ["line:linear-motion"],
  },
  {
    id: "src:din-645-linear-guides",
    title: "DIN 645: Rolling bearings — Profile rail guide systems with recirculating rolling elements",
    publisherOrManufacturer: "Deutsches Institut für Normung (DIN)",
    url: "https://www.din.de/en",
    relevantClaimOrStandard: "Dynamic load rating C, static moment capacities (Mx, My, Mz), and running parallelism tolerances for 4-row linear ball and roller guides.",
    dateAccessed: "2026-03-22",
    verificationStatus: "verified",
    applicableNodes: ["line:linear-motion"],
  },
  {
    id: "src:ieee-802-1qbv-tsn",
    title: "IEEE 802.1Qbv: Enhancements for Scheduled Traffic (Time-Sensitive Networking)",
    publisherOrManufacturer: "IEEE Standards Association",
    url: "https://standards.ieee.org/ieee/802.1Qbv/5661/",
    relevantClaimOrStandard: "Time-aware shaper (TAS) cyclic gate scheduling, sub-microsecond packet delivery latency, and deterministic Ethernet bandwidth reservation.",
    dateAccessed: "2026-03-18",
    verificationStatus: "verified",
    applicableNodes: ["line:networking-edge", "line:robot-controllers", "line:servo-drives"],
  },
  {
    id: "src:iec-61158-fieldbus",
    title: "IEC 61158: Industrial communication networks — Fieldbus specifications",
    publisherOrManufacturer: "International Electrotechnical Commission (IEC)",
    url: "https://www.iec.ch",
    relevantClaimOrStandard: "EtherCAT, PROFINET IRT, and EtherNet/IP CIP Sync protocols for real-time cyclic motion synchronization down to 250 µs.",
    dateAccessed: "2026-03-24",
    verificationStatus: "verified",
    applicableNodes: ["line:robot-controllers", "line:servo-drives", "line:networking-edge"],
  },
  {
    id: "src:emva-1288-standard",
    title: "EMVA 1288: Standard for Characterization of Image Sensors and Cameras",
    publisherOrManufacturer: "European Machine Vision Association (EMVA)",
    url: "https://www.emva.org/standards-technology/emva-1288/",
    relevantClaimOrStandard: "Quantum efficiency (QE), temporal dark noise, saturation capacity, dynamic range (dB), and signal-to-noise ratio (SNR) benchmarking.",
    dateAccessed: "2026-03-26",
    verificationStatus: "verified",
    applicableNodes: ["line:machine-vision"],
  },

  // OFFICIAL MANUFACTURER BENCHMARKS & DATASHEETS
  {
    id: "src:harmonic-drive-engineering-guide",
    title: "Harmonic Drive Engineering & Selection Manual: Strain Wave Gearing Principles",
    publisherOrManufacturer: "Harmonic Drive SE / Harmonic Drive LLC",
    url: "https://harmonicdrive.de/en/products",
    relevantClaimOrStandard: "Zero backlash mechanism (< 0.1 arcmin), lost motion hysteresis measurement protocol, and single-stage ratio range (30:1 to 160:1).",
    dateAccessed: "2026-03-25",
    verificationStatus: "verified",
    applicableNodes: ["range:ind-red-cup-strain-wave", "range:ind-red-hat-strain-wave", "range:ind-red-hollow-strain-wave"],
  },
  {
    id: "src:nabtesco-precision-rv-catalogue",
    title: "Nabtesco Precision RV Reducer Technical Design Manual",
    publisherOrManufacturer: "Nabtesco Precision Europe GmbH",
    url: "https://precision.nabtesco.com",
    relevantClaimOrStandard: "Two-stage cycloidal eccentric design, 500% emergency stop shock tolerance, and torsional rigidity exceeding 1,200 Nm/arcmin.",
    dateAccessed: "2026-03-25",
    verificationStatus: "verified",
    applicableNodes: ["range:ind-red-rv-solid-shaft", "range:ind-red-rv-hollow-shaft", "range:ind-red-rv-component-set"],
  },
  {
    id: "src:wittenstein-planetary-handbook",
    title: "Wittenstein Alpha High Performance Planetary Gearbox Technical Guide",
    publisherOrManufacturer: "Wittenstein SE",
    url: "https://www.wittenstein-alpha.de",
    relevantClaimOrStandard: "Carburized and ground helical planetary gearing, sub-arcminute backlash (< 1 arcmin), and >97% full-load transmission efficiency.",
    dateAccessed: "2026-03-25",
    verificationStatus: "verified",
    applicableNodes: ["range:ind-red-planetary-inline", "range:ind-red-planetary-flange", "range:ind-red-sub-arcmin-planetary"],
  },
  {
    id: "src:beckhoff-etg1000-ethercat",
    title: "ETG.1000 EtherCAT Specification and Real-Time Motion Protocol",
    publisherOrManufacturer: "EtherCAT Technology Group (ETG) / Beckhoff Automation",
    url: "https://www.ethercat.org",
    relevantClaimOrStandard: "Processing on the fly, distributed clocks synchronization jitter < 100 ns, and cyclic update rates down to 250 µs.",
    dateAccessed: "2026-03-20",
    verificationStatus: "verified",
    applicableNodes: ["range:ind-net-ethercat-junction-slave", "range:ind-ctl-softplc-motion-ipc", "range:ind-drv-high-density-multi-axis"],
  },
  {
    id: "src:schunk-gripper-interface-standard",
    title: "SCHUNK Mechatronic Gripper and ISO 9409 End-Effector Integration Guide",
    publisherOrManufacturer: "SCHUNK GmbH & Co. KG",
    url: "https://schunk.com",
    relevantClaimOrStandard: "Electric servo gripping force control (±1 N), IO-Link communication, and ISO 9409-1 mechanical mounting interfaces.",
    dateAccessed: "2026-03-22",
    verificationStatus: "verified",
    applicableNodes: ["line:end-effectors", "range:ind-ef-parallel-servo-gripper"],
  },
  {
    id: "src:sick-safety-laser-scanner-manual",
    title: "SICK Industrial Safety Laser Scanners — Principles and Safety Distances",
    publisherOrManufacturer: "SICK AG",
    url: "https://www.sick.com",
    relevantClaimOrStandard: "Optical time-of-flight safety scanning, 275° scanning angle, dynamic switching fields based on robot speed and payload envelope.",
    dateAccessed: "2026-03-24",
    verificationStatus: "verified",
    applicableNodes: ["line:robotics-safety", "range:ind-saf-safety-laser-scanner"],
  },
];

export const getSourceById = (id: string): ResearchSourceRecord | undefined =>
  RESEARCH_SOURCES_REGISTRY.find((s) => s.id === id);

export const getSourcesForNode = (nodeId: string): ResearchSourceRecord[] =>
  RESEARCH_SOURCES_REGISTRY.filter((s) =>
    s.applicableNodes.some((appNode) => nodeId.startsWith(appNode) || appNode === nodeId)
  );
