/**
 * INDUS Total Robotics Taxonomy — Official Research Register & Classification Ground Truth
 *
 * Traceable repository of authoritative robotics standards, international classification
 * bodies (ISO, IFR), and manufacturer documentation establishing the engineering foundation
 * for the INDUS Total Robotics Taxonomy.
 *
 * Grounded in:
 * - ISO 8373:2021 (Robotics Vocabulary: Industrial vs Service, Autonomy, Manipulator)
 * - IFR Industrial Robots (Classified by mechanical kinematic structure & axes)
 * - IFR Service Robots (Classified by application domain & locomotion type)
 * - ISO 10218-1/2 & ISO/TS 15066 (Industrial & collaborative robot safety)
 * - ISO 3691-4:2023 & VDA 5050 (Driverless industrial trucks & AGV/AMR interoperability)
 * - DNV-RP-0417 & IMCA R004 (Subsea Remotely Operated Vehicles & AUVs)
 */

export interface ResearchSourceRecord {
  id: string; // e.g. "src:iso-8373-2021"
  title: string;
  publisherOrManufacturer: string;
  url: string;
  relevantClaimOrStandard: string;
  verificationStatus: "verified" | "configurable" | "preliminary";
  scope: "international-standard" | "industry-consortium" | "manufacturer-benchmark";
  keyDistinctions: string;
  dateAccessed: string;
}

export const RESEARCH_REGISTER: ResearchSourceRecord[] = [
  {
    id: "src:iso-8373-2021",
    title: "ISO 8373:2021 — Robotics — Vocabulary",
    publisherOrManufacturer: "International Organization for Standardization (ISO / TC 299)",
    url: "https://www.iso.org/standard/75539.html",
    relevantClaimOrStandard:
      "Defines 'robot' (Clause 3.1) as actuated mechanism programmable in two or more axes with a degree of autonomy. Defines 'industrial robot' (Clause 3.6) as automatically controlled, reprogrammable, multipurpose manipulator in 3+ axes, fixed or mobile. Defines 'service robot' (Clause 3.7) as performing useful tasks for humans/equipment excluding industrial automation.",
    verificationStatus: "verified",
    scope: "international-standard",
    keyDistinctions:
      "Establishes strict division: Industrial robots are defined by multipurpose manipulative capability in automation; Service robots are defined by application purpose and excluded from classical factory automation.",
    dateAccessed: "2026-10-20",
  },
  {
    id: "src:ifr-industrial-2024",
    title: "IFR Industrial Robot Definitions & Kinematic Classification",
    publisherOrManufacturer: "International Federation of Robotics (IFR)",
    url: "https://ifr.org/industrial-robots",
    relevantClaimOrStandard:
      "Classifies industrial robots into technical kinematic types: Articulated / Anthropomorphic robots, SCARA robots, Cartesian / Gantry robots, Parallel / Delta robots, Cylindrical robots, and Polar robots. Categorises collaborative robots (cobots) under power and force limiting (PFL) and speed and separation monitoring (SSM).",
    verificationStatus: "verified",
    scope: "industry-consortium",
    keyDistinctions:
      "Industrial robot classification is strictly morphology-driven (mechanical kinematics, axis arrangement, coordinate frame).",
    dateAccessed: "2026-10-20",
  },
  {
    id: "src:ifr-service-2024",
    title: "IFR Service Robotics Classification by Application & Locomotion",
    publisherOrManufacturer: "International Federation of Robotics (IFR)",
    url: "https://ifr.org/service-robots",
    relevantClaimOrStandard:
      "Classifies service robotics by operational domain and movement mode: Professional service robots (Logistics/AGVs/AMRs, Inspection & Maintenance, Medical/Surgical, Agriculture & Forestry, Defense & Security, Underwater/Marine, Construction & Mining, Cleaning) and Personal/Domestic service robots.",
    verificationStatus: "verified",
    scope: "industry-consortium",
    keyDistinctions:
      "Service robot taxonomy is application- and locomotion-driven rather than manipulator axis-driven. Mobile driverless units and subsea crawlers are service systems even when operating in logistics plants.",
    dateAccessed: "2026-10-20",
  },
  {
    id: "src:iso-10218-2011",
    title: "ISO 10218-1 & ISO 10218-2: Safety Requirements for Industrial Robots and Robot Systems",
    publisherOrManufacturer: "International Organization for Standardization (ISO / TC 299)",
    url: "https://www.iso.org/standard/51330.html",
    relevantClaimOrStandard:
      "Specifies functional safety architectures (Category 3 / 4, PL d / PL e per ISO 13849-1), protective stop categories (IEC 60204-1 Stop 0/1/2), speed and position limiting, and integration safeguarded perimeter requirements.",
    verificationStatus: "verified",
    scope: "international-standard",
    keyDistinctions:
      "Mandates safety boundary criteria and dual-channel monitoring for all stationary and mobile industrial manipulators.",
    dateAccessed: "2026-10-20",
  },
  {
    id: "src:iso-ts-15066-2016",
    title: "ISO/TS 15066:2016 — Collaborative Robots & Biomechanical Thresholds",
    publisherOrManufacturer: "International Organization for Standardization (ISO / TC 299)",
    url: "https://www.iso.org/standard/62996.html",
    relevantClaimOrStandard:
      "Defines the four modes of collaborative operation: Safety-rated monitored stop (SRMS), Hand guiding (HG), Speed and separation monitoring (SSM), and Power and force limiting (PFL) with quantitative maximum permissible contact pressure and force across 29 body areas.",
    verificationStatus: "verified",
    scope: "international-standard",
    keyDistinctions:
      "Establishes difference between conventional cased industrial robots and collaborative systems equipped with joint torque sensing and smooth radii.",
    dateAccessed: "2026-10-20",
  },
  {
    id: "src:iso-3691-4-2023",
    title: "ISO 3691-4:2023 — Driverless Industrial Trucks and Their Systems",
    publisherOrManufacturer: "International Organization for Standardization (ISO / TC 110)",
    url: "https://www.iso.org/standard/83647.html",
    relevantClaimOrStandard:
      "Defines safety-related parts of control systems (SRP/CS) for AGVs and AMRs: non-contact safety protection fields (laser scanners, 3D ToF), dynamic field switching based on speed and steering angle, braking distance calculation, and emergency stop interlocks.",
    verificationStatus: "verified",
    scope: "international-standard",
    keyDistinctions:
      "Defines functional safety rules specifically for mobile driverless robots in industrial environments, distinct from stationary robot arms.",
    dateAccessed: "2026-10-20",
  },
  {
    id: "src:vda-5050-v21",
    title: "VDA 5050 v2.1.0 — AGV / AMR Communication Interface",
    publisherOrManufacturer: "German Association of the Automotive Industry (VDA) & VDMA",
    url: "https://github.com/vda5050/vda5050",
    relevantClaimOrStandard:
      "Standardizes MQTT/JSON schema for master control systems and autonomous mobile robot fleets: order management, trajectory nodes/edges, state estimation, load handling, and fleet interoperability.",
    verificationStatus: "verified",
    scope: "industry-consortium",
    keyDistinctions:
      "Vendor-neutral standard enabling mixed-fleet operation across AMRs, tuggers, forklifts, and AGVs under a single factory dispatch controller.",
    dateAccessed: "2026-10-20",
  },
  {
    id: "src:imca-r004-subsea",
    title: "IMCA R 004 — Code of Practice for the Safe and Efficient Operation of Remotely Operated Vehicles",
    publisherOrManufacturer: "International Marine Contractors Association (IMCA)",
    url: "https://www.imca-int.com",
    relevantClaimOrStandard:
      "Classifies subsea ROVs into Class I (Pure Observation), Class II (Observation with Payload Option), Class III (Work-Class ROVs with >75 kW hydraulic power & dual manipulators), Class IV (Towed & Bottom-Crawling Vehicles), and Class V (Prototype & Autonomous AUVs).",
    verificationStatus: "verified",
    scope: "industry-consortium",
    keyDistinctions:
      "Defines hydrodynamic, buoyancy, tether handling (TMS), and pressure-balanced oil-filled (PBOF) criteria for deep-sea intervention systems.",
    dateAccessed: "2026-10-20",
  },
  {
    id: "src:faa-part-107-astm-f38",
    title: "ASTM F38 Committee Standards & FAA Part 107 / EASA UAS Specific Category",
    publisherOrManufacturer: "ASTM International & European Union Aviation Safety Agency (EASA)",
    url: "https://www.astm.org/committee-f38.html",
    relevantClaimOrStandard:
      "Specifies airworthiness, detect-and-avoid (DAA), geofencing, command-and-control (C2) link loss failsafes, MTOW categories (<25 kg vs heavy-lift >25 kg), and confined-space cage airframes for industrial inspection.",
    verificationStatus: "verified",
    scope: "international-standard",
    keyDistinctions:
      "Establishes strict flight mode, altitude boundaries, kinetic energy thresholds, and GPS-denied navigation requirements for industrial UAVs.",
    dateAccessed: "2026-10-20",
  },
  {
    id: "src:iec-80601-2-77",
    title: "IEC 80601-2-77:2019 — Medical Electrical Equipment — Robotically Assisted Surgical Equipment (RASE)",
    publisherOrManufacturer: "International Electrotechnical Commission (IEC / ISO JWG 35)",
    url: "https://www.iso.org/standard/67913.html",
    relevantClaimOrStandard:
      "Specifies basic safety and essential performance of robotically assisted surgical equipment: master-slave motion scaling, haptic tremor filtering, instrument tip force thresholds, single-fault containment, and emergency mechanical decoupling.",
    verificationStatus: "verified",
    scope: "international-standard",
    keyDistinctions:
      "Establishes surgical robotics as specialized mechanical systems subject to Medical Device Regulation (MDR) and bi-directional teleoperation integrity.",
    dateAccessed: "2026-10-20",
  },
];
