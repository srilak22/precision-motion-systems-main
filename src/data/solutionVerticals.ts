import mfgAutoImg from "@/assets/solution-manufacturing-auto.jpg";
import warehouseImg from "@/assets/solution-warehouse-logistics.jpg";
import healthcareImg from "@/assets/solution-healthcare-robot.jpg";
import agricultureImg from "@/assets/solution-agriculture-robot.jpg";
import hospitalityImg from "@/assets/solution-hospitality-robot.jpg";

export interface RobotSpecMetric {
  label: string;
  value: string;
}

export interface VerticalRobotDetail {
  id: string;
  name: string;
  tagline: string;
  description: string;
  applications: string[];
  specs: RobotSpecMetric[];
  compliance: string;
}

export interface CapabilityTab {
  id: string;
  label: string;
  headline: string;
  description: string;
  highlights: string[];
  metricLabel: string;
  metricValue: string;
}

export interface EcosystemCard {
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
}

export interface SolutionVerticalData {
  id: string;
  slug: string;
  title: string;
  shortLabel: string;
  heroHeadline: string;
  heroSubtitle: string;
  targetClients: string[];
  image: string;
  imageAlt: string;
  heroMetrics: { label: string; value: string }[];
  introHeadline: string;
  introDescription: string;
  capabilities: CapabilityTab[];
  robots: VerticalRobotDetail[];
  ecosystem: EcosystemCard[];
  testimonial: {
    quote: string;
    author: string;
    role: string;
    company: string;
  };
}

export const SOLUTION_VERTICALS_DATA: SolutionVerticalData[] = [
  {
    id: "manufacturing-automotive",
    slug: "manufacturing-automotive",
    title: "Manufacturing & Automotive",
    shortLabel: "Manufacturing & Auto",
    heroHeadline: "High-uptime robotics for modern factories & EV lines",
    heroSubtitle:
      "Ensure reliable manufacturing operations, eliminate ergonomic bottlenecks, and scale throughput with 6-axis articulated arms, cobots, and ultra-fast SCARA & Delta cells.",
    targetClients: [
      "Automotive Tier-1 & OEM Suppliers",
      "CNC & Metal Fabrication Workshops",
      "Electronics & PCB Assemblers",
      "Contract Manufacturing Plants",
    ],
    image: mfgAutoImg,
    imageAlt:
      "6-axis articulated industrial robots performing spot welding on an EV chassis",
    heroMetrics: [
      { label: "Repeatability", value: "±0.02 mm" },
      { label: "Line Uptime", value: "99.4%" },
      { label: "Avg. Payback", value: "14 Mos" },
    ],
    introHeadline: "Accelerate factory floor transformation",
    introDescription:
      "From heavy body-in-white spot welding to cage-free human-robot CNC tending and sub-second electronics pick-and-place, INDUS workcells integrate natively with your existing PLC, MES, and quality systems.",
    capabilities: [
      {
        id: "welding-joining",
        label: "Welding & Joining",
        headline: "Consistent weld penetration at 24/7 production speed",
        description:
          "Synchronized 6-axis paths paired with seam-tracking vision eliminate spatter, rework, and operator heat exposure across steel and aluminum assemblies.",
        highlights: [
          "Laser & arc seam tracking with real-time path compensation",
          "Multi-robot coordinated motion on dual-axis positioners",
          "Automated torch cleaning and tip-wear calibration",
        ],
        metricLabel: "Weld Defect Reduction",
        metricValue: "-68%",
      },
      {
        id: "human-robot-cobot",
        label: "Cage-Free Collaboration",
        headline: "Safe, rapid-deploy cobots right beside your machinists",
        description:
          "Force-limited collaborative arms handle repetitive screwdriving, adhesive dispensing, and CNC machine tending without bulky safety fencing.",
        highlights: [
          "ISO/TS 15066 power & force limiting with instant collision stop",
          "Hand-guided waypoint teaching in under 15 minutes",
          "Dual-gripper CNC tending cuts spindle idle time by up to 45%",
        ],
        metricLabel: "CNC Utilization Gain",
        metricValue: "+42%",
      },
      {
        id: "high-speed-assembly",
        label: "High-Speed Assembly",
        headline: "Sub-second pick-and-place for dense electronics lines",
        description:
          "SCARA and Delta kinematics deliver blistering cycle rates for PCB insertion, connector seating, and blister packaging with 2D/3D vision verification.",
        highlights: [
          "Up to 150 picks per minute with conveyor tracking",
          "ESD-safe and cleanroom ISO Class 5 configurations",
          "Inline AOI camera check before final placement",
        ],
        metricLabel: "Cycle Rate",
        metricValue: "150 PPM",
      },
      {
        id: "fleet-telemetry",
        label: "MES & Digital Twin",
        headline: "Live OEE telemetry and predictive joint maintenance",
        description:
          "Stream torque, thermal, and cycle-time diagnostics directly into your plant SCADA/MES so maintenance teams act before unplanned stops occur.",
        highlights: [
          "Native EtherCAT, PROFINET, and OPC-UA interfaces",
          "Predictive gearbox backlash & servo thermal alerts",
          "Offline cell simulation prior to floor commissioning",
        ],
        metricLabel: "Unplanned Downtime",
        metricValue: "-55%",
      },
    ],
    robots: [
      {
        id: "6-axis-articulated-robots",
        name: "6-Axis Articulated Robots",
        tagline: "Heavy-duty welding, painting & high-payload handling",
        description:
          "Heavy-duty welding, painting, and material handling engineered for continuous 3-shift automotive and metalworking duty.",
        applications: [
          "Spot & MIG/TIG Arc Welding",
          "Automotive Spray Painting & Coating",
          "Heavy Die-Casting & Press Tending",
          "Chassis & Battery Pack Transfer",
        ],
        specs: [
          { label: "Payload Capacity", value: "20 kg – 500 kg" },
          { label: "Max Reach", value: "1,650 – 3,200 mm" },
          { label: "Repeatability", value: "±0.03 – ±0.08 mm" },
          { label: "Protection Rating", value: "IP67 (Wrist) / IP65 (Body)" },
          { label: "Fieldbus", value: "EtherCAT / PROFINET / EtherNet/IP" },
          { label: "Mounting", value: "Floor, Inverted, Angle" },
        ],
        compliance: "ISO 10218-1, CE, UL 1740",
      },
      {
        id: "collaborative-robots",
        name: "Collaborative Robots (Cobots)",
        tagline: "Safe, cage-free human-robot teamwork for SMEs",
        description:
          "Safe, cage-free human-robot assembly, screwdriving, and CNC machine tending with intuitive drag-and-drop programming.",
        applications: [
          "CNC Lathe & Mill Machine Tending",
          "Precision Torque Screwdriving",
          "Automated Gluing & Gasket Dispensing",
          "End-of-Line Quality Inspection",
        ],
        specs: [
          { label: "Payload Capacity", value: "5 kg – 25 kg" },
          { label: "Max Reach", value: "850 – 1,750 mm" },
          { label: "Repeatability", value: "±0.02 – ±0.03 mm" },
          { label: "Force Sensing", value: "6-Axis Joint Torque + Wrist F/T" },
          { label: "Power Input", value: "110–240 VAC Single Phase" },
          { label: "Protection Rating", value: "IP65 / Cleanroom ISO 5" },
        ],
        compliance: "ISO/TS 15066, ISO 13849-1 PLd Cat 3",
      },
      {
        id: "scara-delta-robots",
        name: "SCARA & Delta Robots",
        tagline: "Ultra-fast pick-and-place & electronics packaging",
        description:
          "High-speed pick-and-place sorting and precision electronics packaging with dynamic conveyor tracking.",
        applications: [
          "PCB Component Insertion & Soldering",
          "High-Speed Blister & Tray Packaging",
          "Small-Part Vision Sorting",
          "Battery Cell Tab Assembly",
        ],
        specs: [
          { label: "Payload Capacity", value: "1 kg – 20 kg" },
          { label: "Cycle Time", value: "0.28 – 0.42 sec" },
          { label: "Repeatability", value: "±0.01 – ±0.02 mm" },
          { label: "Work Envelope", value: "400 – 1,300 mm" },
          { label: "Vision Sync", value: "2D/3D GigE Conveyor Tracking" },
          { label: "ESD / Cleanroom", value: "ESD-Safe, ISO Class 4/5" },
        ],
        compliance: "ISO 10218-1, RoHS, CE",
      },
    ],
    ecosystem: [
      {
        title: "Turnkey Workcell Kit",
        description:
          "Pre-engineered robot, safety scanner, riser, and PLC interface ready to bolt down and run.",
        ctaLabel: "Explore Products",
        href: "/products",
      },
      {
        title: "INDUS Motion Studio",
        description:
          "Simulate cycle times, check reach envelopes, and validate collision-free paths before deployment.",
        ctaLabel: "Open Studio",
        href: "/technology/motion-studio",
      },
      {
        title: "Certified Tooling Partners",
        description:
          "Seamlessly pair servo grippers, weld power sources, and 3D vision cameras.",
        ctaLabel: "View Integration",
        href: "/engineering-services/system-integration",
      },
      {
        title: "Lifecycle Engineering",
        description:
          "24/7 remote diagnostics, preventive maintenance, and on-site commissioning support.",
        ctaLabel: "Book Consultation",
        href: "/book-consultation",
      },
    ],
    testimonial: {
      quote:
        "Deploying INDUS 6-axis welding cells and cobot CNC tenders across two shifts cut our rework rate by 64% and paid back the capital investment in just over a year.",
      author: "Vikram Deshmukh",
      role: "VP of Manufacturing Operations",
      company: "Precision AutoComponents Ltd.",
    },
  },
  {
    id: "warehousing-ecommerce-logistics",
    slug: "warehousing-ecommerce-logistics",
    title: "Warehousing & E-Commerce Logistics",
    shortLabel: "Warehousing & Logistics",
    heroHeadline: "Autonomous fulfillment from dock to pallet rack",
    heroSubtitle:
      "Keep goods moving faster with LiDAR-guided AMRs, unmanned autonomous forklifts, and vision-driven robotic palletizers built for high-volume distribution.",
    targetClients: [
      "E-Commerce Fulfillment Centers",
      "Third-Party Logistics (3PL) Providers",
      "Cold Storage & Chilled Warehouses",
      "Regional Distribution Hubs",
    ],
    image: warehouseImg,
    imageAlt:
      "Autonomous mobile robots and unmanned forklift operating in a high-bay fulfillment warehouse",
    heroMetrics: [
      { label: "Pick Rate Boost", value: "2.8x" },
      { label: "Dock-to-Stock", value: "-46%" },
      { label: "Fleet Uptime", value: "99.1%" },
    ],
    introHeadline: "Eliminate bottlenecks across every aisle",
    introDescription:
      "Unstructured peak seasons and labor shortages strain fulfillment SLAs. INDUS warehouse robots dynamically route around workers, automate heavy pallet moves, and palletize mixed-SKU cases without re-laying your floor.",
    capabilities: [
      {
        id: "goods-to-person",
        label: "Goods-to-Person AMRs",
        headline: "Cut operator walking distance by up to 75%",
        description:
          "LiDAR SLAM mobile robots bring inventory shelves and totes directly to ergonomic pick stations, boosting lines picked per hour.",
        highlights: [
          "Dynamic obstacle avoidance around forklifts and associates",
          "Opportunity charging keeps fleets running 24/7",
          "Direct REST/WMS integration with SAP, Manhattan, and Blue Yonder",
        ],
        metricLabel: "Walking Reduction",
        metricValue: "-75%",
      },
      {
        id: "autonomous-pallets",
        label: "Autonomous Pallet Flow",
        headline: "Unmanned reach forklifts for high-bay & cross-dock moves",
        description:
          "Convert repetitive dock-to-rack and line-feed pallet transfers into predictable, collision-monitored autonomous missions.",
        highlights: [
          "360° safety LiDAR curtains with ISO 3691-4 compliance",
          "Pallet pocket & overhang detection via 3D depth cameras",
          "Cold-storage variants rated down to -25°C",
        ],
        metricLabel: "Pallet Move Capacity",
        metricValue: "2,000 kg",
      },
      {
        id: "mixed-palletizing",
        label: "Vision Palletizing",
        headline: "High-reach vacuum arms for mixed-SKU case stacking",
        description:
          "3D vision measures incoming cartons on the fly and calculates optimal interlocking pallet patterns for maximum cube utilization.",
        highlights: [
          "Handles corrugated, shrink-wrapped, and polybagged cases",
          "Automatic slip-sheet and empty-pallet dispensing",
          "Up to 18 cases per minute dual-zone palletizing",
        ],
        metricLabel: "Cube Density",
        metricValue: "+22%",
      },
      {
        id: "fleet-orchestration",
        label: "Fleet Orchestration",
        headline: "Traffic-free coordination for 10 to 500+ mobile units",
        description:
          "Centralized fleet management balances battery state, aisle congestion, and priority wave orders in real time.",
        highlights: [
          "Deadlock-free multi-aisle traffic scheduling",
          "Heatmaps of pick density and travel bottlenecks",
          "Instant over-the-air map updates when racking changes",
        ],
        metricLabel: "Order Accuracy",
        metricValue: "99.95%",
      },
    ],
    robots: [
      {
        id: "autonomous-mobile-robots",
        name: "Autonomous Mobile Robots (AMRs)",
        tagline: 'Smart, self-navigating carts for "goods-to-person" picking',
        description:
          'Smart, self-navigating carts for "goods-to-person" order picking and internal tote transport without floor magnets or tape.',
        applications: [
          "Goods-to-Person Pod & Tote Picking",
          "Zone-to-Zone Putwall Replenishment",
          "Sortation & Returns Processing",
          "Kitting & Value-Added Packing",
        ],
        specs: [
          { label: "Payload Capacity", value: "300 kg – 1,500 kg" },
          { label: "Max Travel Speed", value: "2.0 m/s (Unloaded)" },
          { label: "Navigation", value: "360° Dual LiDAR + Visual SLAM" },
          { label: "Runtime / Charge", value: "8–10 hrs (15-min Auto-Dock)" },
          { label: "Aisle Width Min.", value: "1,100 mm" },
          { label: "WMS Integration", value: "REST API / VDA 5050" },
        ],
        compliance: "ISO 3691-4, ANSI/RIA R15.08, CE",
      },
      {
        id: "autonomous-forklifts-agvs",
        name: "Autonomous Forklifts & AGVs",
        tagline: "Unmanned heavy pallet transport across warehouse floors",
        description:
          "Unmanned heavy pallet transport across warehouse floors, staging lanes, and multi-tier racking systems.",
        applications: [
          "Dock-to-Rack Pallet Putaway",
          "High-Bay Selective Racking",
          "Production Line-Side Material Feed",
          "Cold-Chain (-25°C) Pallet Shuttle",
        ],
        specs: [
          { label: "Load Capacity", value: "1,400 kg – 2,500 kg" },
          { label: "Lift Height", value: "Up to 8,500 mm" },
          { label: "Positioning Accuracy", value: "±10 mm" },
          { label: "Safety Architecture", value: "3x Safety LiDAR + Fork Sensors" },
          { label: "Battery Chemistry", value: "48V LiFePO4 Fast-Charge" },
          { label: "Operating Temp", value: "-25°C to +45°C (Cold Option)" },
        ],
        compliance: "ISO 3691-4, EN 1525, UL 583",
      },
      {
        id: "robotic-palletizers",
        name: "Robotic Palletizers",
        tagline: "Vision-guided arms for automated box stacking & unloading",
        description:
          "Vision-guided arms equipped with vacuum grippers for automated box stacking, depalletizing, and trailer unloading.",
        applications: [
          "End-of-Line Case Palletizing",
          "Mixed-SKU Rainbow Pallet Building",
          "Inbound De-Palletizing",
          "Automated Slip-Sheet Placement",
        ],
        specs: [
          { label: "Payload Capacity", value: "50 kg – 180 kg" },
          { label: "Max Stack Height", value: "2,400 mm" },
          { label: "Throughput", value: "Up to 1,080 cases/hr" },
          { label: "Gripper Type", value: "Multi-Zone Vacuum / Servo Clamp" },
          { label: "Vision System", value: "3D ToF + RGB Carton Recognition" },
          { label: "Footprint", value: "Compact Dual-Pallet Cell" },
        ],
        compliance: "ISO 10218-2, OSHA, CE",
      },
    ],
    ecosystem: [
      {
        title: "WMS Connector Suite",
        description:
          "Pre-built adapters for SAP EWM, Manhattan, Oracle, and custom REST fulfillment APIs.",
        ctaLabel: "View Integration",
        href: "/engineering-services/system-integration",
      },
      {
        title: "VDA 5050 Fleet Control",
        description:
          "Unified traffic orchestration across mixed AMR and autonomous forklift fleets.",
        ctaLabel: "Explore Tech",
        href: "/technology/digital-twin",
      },
      {
        title: "Cold-Chain Readiness",
        description:
          "Heated enclosures and LiFePO4 packs validated for chilled and deep-freeze hubs.",
        ctaLabel: "Explore Products",
        href: "/products",
      },
      {
        title: "ROI & Throughput Audit",
        description:
          "Model your exact SKU profile, aisle geometry, and payback period with our engineers.",
        ctaLabel: "Book Consultation",
        href: "/book-consultation",
      },
    ],
    testimonial: {
      quote:
        "Adding 24 INDUS AMRs and two vision palletizers doubled our peak-season dispatch capacity without expanding our warehouse footprint.",
      author: "Meera Krishnan",
      role: "Director of Fulfillment Engineering",
      company: "SwiftCart 3PL Logistics",
    },
  },
  {
    id: "healthcare-pharmaceuticals",
    slug: "healthcare-pharmaceuticals",
    title: "Healthcare & Pharmaceuticals",
    shortLabel: "Healthcare & Pharma",
    heroHeadline: "Sterile, reliable automation for clinical & lab teams",
    heroSubtitle:
      "Protect patients and free clinical staff from routine transport and sterilization with autonomous UV-C disinfection bots, locked pharmacy couriers, and precision lab arms.",
    targetClients: [
      "Multi-Specialty Hospitals & ICUs",
      "Diagnostic & Pathology Laboratories",
      "Pharmaceutical & Biopharma Plants",
      "Eldercare & Rehabilitation Centers",
    ],
    image: healthcareImg,
    imageAlt:
      "Autonomous hospital delivery robot and UV-C disinfection robot in a modern hospital corridor",
    heroMetrics: [
      { label: "Pathogen Kill Rate", value: "99.99%" },
      { label: "Room Turnaround", value: "10 Min" },
      { label: "Chain of Custody", value: "100%" },
    ],
    introHeadline: "Clinical safety meets autonomous precision",
    introDescription:
      "Every minute nurses spend walking lab samples or waiting on manual room turnover is time away from patient care. INDUS healthcare robots navigate elevators, log every badge-authenticated handoff, and sterilize rooms with zero chemical residue.",
    capabilities: [
      {
        id: "uvc-sterilization",
        label: "UV-C Sterilization",
        headline: "Hospital-grade 254 nm disinfection in 10 minutes",
        description:
          "High-output UV-C arrays autonomously map operating rooms and isolation wards, neutralizing pathogens without harsh chemical downtime.",
        highlights: [
          "99.99% reduction of MRSA, C. diff, and airborne/surface viruses",
          "360° PIR motion sensors immediately pause lamps if staff enter",
          "Automated PDF/HL7 compliance logs for infection control audits",
        ],
        metricLabel: "Log Reduction",
        metricValue: "4-Log+",
      },
      {
        id: "secure-delivery",
        label: "Inter-Floor Couriers",
        headline: "RFID-locked pharmacy & lab sample transport",
        description:
          "Multi-compartment mobile bots call elevators, open automatic doors, and deliver medications or stat samples directly to nursing stations.",
        highlights: [
          "Biometric / RFID badge unlock per compartment",
          "Native elevator & automatic door controller integration",
          "Shock-damped trays for fragile vials and blood bags",
        ],
        metricLabel: "Staff Steps Saved",
        metricValue: "14 km/day",
      },
      {
        id: "lab-pipetting",
        label: "Lab Sample Handling",
        headline: "Zero-contamination desktop arms for diagnostics",
        description:
          "Compact cleanroom-rated arms automate tube decapping, barcode scanning, centrifuge loading, and high-throughput microplate sorting.",
        highlights: [
          "Sub-millimeter repeatability for 96/384-well plates",
          "ISO Class 4 cleanroom and biosafety cabinet compatible",
          "21 CFR Part 11 audit-ready motion & sample logs",
        ],
        metricLabel: "Throughput Gain",
        metricValue: "3.2x",
      },
      {
        id: "infection-audit",
        label: "Audit & Compliance",
        headline: "Automated traceability for GMP & JCI standards",
        description:
          "Every disinfection dosage, delivery timestamp, and lab transfer is encrypted and stored for effortless regulatory inspection.",
        highlights: [
          "Real-time UV-C dosimeter verification per room zone",
          "HIPAA-conscious privacy-preserving navigation sensors",
          "Centralized nursing & facility dashboard alerts",
        ],
        metricLabel: "Audit Readiness",
        metricValue: "100%",
      },
    ],
    robots: [
      {
        id: "uvc-disinfection-robots",
        name: "UV-C Disinfection Robots",
        tagline: "Chemical-free, autonomous room sterilization",
        description:
          "Chemical-free, autonomous room sterilization for operating theaters, ICUs, cleanrooms, and diagnostic labs.",
        applications: [
          "Operating Theater Terminal Cleaning",
          "Isolation Ward & ICU Decontamination",
          "Pharma Cleanroom Airlock Sterilization",
          "Outpatient Clinic Overnight Cycles",
        ],
        specs: [
          { label: "UV-C Wavelength", value: "254 nm High-Output Amalgam" },
          { label: "Efficacy", value: "99.99% (4-Log Pathogen Reduction)" },
          { label: "Cycle Duration", value: "8 – 15 min per room" },
          { label: "Safety Interlocks", value: "4x PIR Motion + Emergency Stop" },
          { label: "Navigation", value: "LiDAR SLAM + Obstacle Avoidance" },
          { label: "Reporting", value: "Automated Cloud & PDF Audit Logs" },
        ],
        compliance: "IEC 60601-1, EPA / CE Medical Grade",
      },
      {
        id: "hospital-delivery-bots",
        name: "Hospital Delivery Bots",
        tagline: "Secure, locked mobile couriers for medicines & samples",
        description:
          "Secure, locked mobile couriers for medicines, lab samples, surgical kits, and linens between floors autonomously.",
        applications: [
          "Central Pharmacy-to-Ward Medication Runs",
          "Stat Pathology & Blood Sample Transport",
          "Sterile Supply & Surgical Kit Delivery",
          "Dietary & Linen Logistics",
        ],
        specs: [
          { label: "Compartments", value: "2 – 4 Independent Locked Bays" },
          { label: "Payload Capacity", value: "60 kg – 120 kg" },
          { label: "Access Control", value: "RFID Staff Badge + PIN" },
          { label: "Elevator Control", value: "Wireless API / Dry-Contact Bridge" },
          { label: "Noise Level", value: "< 48 dBA (Whisper-Quiet)" },
          { label: "Battery Runtime", value: "12 hrs + Auto-Charging Dock" },
        ],
        compliance: "ISO 13482, HIPAA-Safe Navigation, CE",
      },
      {
        id: "lab-automation-arms",
        name: "Lab Automation Arms",
        tagline: "High-precision desktop arms for testing & sample sorting",
        description:
          "High-precision desktop arms for automated sample sorting, liquid handling, plate tending, and diagnostic testing.",
        applications: [
          "Tube Decapping, Recapping & Sorting",
          "96/384-Well Microplate Handling",
          "Automated PCR & Analyzer Tending",
          "Pharma Vial Inspection & Labeling",
        ],
        specs: [
          { label: "Payload Capacity", value: "0.5 kg – 5 kg" },
          { label: "Repeatability", value: "±0.015 mm" },
          { label: "Reach", value: "450 – 850 mm" },
          { label: "Cleanroom Class", value: "ISO Class 4 / GMP Grade A-B" },
          { label: "Surface Finish", value: "H2O2 & IPA Wipe-Down Resistant" },
          { label: "Interfaces", value: "SiLA 2 / OPC-UA / Python SDK" },
        ],
        compliance: "21 CFR Part 11 Ready, ISO 14644-1, CE",
      },
    ],
    ecosystem: [
      {
        title: "Elevator & Door Bridge",
        description:
          "Plug-and-play integration with Otis, Schindler, KONE, and hospital automatic doors.",
        ctaLabel: "View Integration",
        href: "/engineering-services/system-integration",
      },
      {
        title: "Infection Control Logs",
        description:
          "Automated UV-C dosage certificates and delivery custody trails for hospital QA.",
        ctaLabel: "Explore Tech",
        href: "/technology/digital-twin",
      },
      {
        title: "GMP & Cleanroom Hardware",
        description:
          "Sealed, wipe-down-ready surfaces engineered for sterile pharma and clinical zones.",
        ctaLabel: "Explore Products",
        href: "/products",
      },
      {
        title: "Clinical Deployment Team",
        description:
          "Zero-disruption hospital floor mapping and nursing workflow onboarding.",
        ctaLabel: "Book Consultation",
        href: "/book-consultation",
      },
    ],
    testimonial: {
      quote:
        "Our pharmacy and lab delivery bots eliminated over 180 manual courier trips a day, giving nurses back hours of bedside focus every shift.",
      author: "Dr. Ananya Rao",
      role: "Chief Medical Operations Officer",
      company: "MedCare Multispecialty Network",
    },
  },
  {
    id: "agriculture-food-processing",
    slug: "agriculture-food-processing",
    title: "Agriculture & Food Processing",
    shortLabel: "Agriculture & Food",
    heroHeadline: "Smart field autonomy & hygienic washdown food robotics",
    heroSubtitle:
      "Increase crop yields, slash chemical usage, and automate sanitary food handling with AI-guided field rovers, IP69K stainless-steel cobots, and delicate harvesting arms.",
    targetClients: [
      "Commercial Farms & Orchards",
      "High-Tech Hydroponic Greenhouses",
      "Dairy & Beverage Processing Plants",
      "Packaged Food & Bakery Factories",
    ],
    image: agricultureImg,
    imageAlt:
      "Autonomous agricultural rover with vision-guided harvesting arm inside a modern greenhouse",
    heroMetrics: [
      { label: "Chemical Savings", value: "-60%" },
      { label: "Washdown Rating", value: "IP69K" },
      { label: "Produce Damage", value: "< 1.2%" },
    ],
    introHeadline: "From open-field rows to washdown packaging lines",
    introDescription:
      "Labor scarcity and strict food-safety mandates demand purpose-built robotics. INDUS pairs multispectral field autonomy with USDA/EHEDG-grade stainless-steel cobots that withstand high-pressure caustic washdowns.",
    capabilities: [
      {
        id: "precision-ag",
        label: "Precision Crop Care",
        headline: "Target weeds and pests down to the individual plant",
        description:
          "Autonomous rovers and drones fuse RTK-GPS with multispectral vision to spot early disease stress and micro-spray only where needed.",
        highlights: [
          "Sub-2 cm RTK-GPS row-following autonomy",
          "AI weed-vs-crop classification reduces herbicide use up to 60%",
          "Automated yield estimation and canopy health mapping",
        ],
        metricLabel: "Herbicide Reduction",
        metricValue: "-60%",
      },
      {
        id: "washdown-hygiene",
        label: "IP69K Washdown",
        headline: "316L stainless-steel cobots built for daily sanitization",
        description:
          "Sealed, smooth-contour arms resist high-pressure, high-temperature caustic washdowns in dairy, meat, and ready-meal lines.",
        highlights: [
          "IP69K protection against 80°C high-pressure spray jets",
          "Food-grade NSF H1 lubrication throughout all joints",
          "FDA-compliant soft silicone grippers for delicate items",
        ],
        metricLabel: "Sanitation Rating",
        metricValue: "IP69K",
      },
      {
        id: "vision-harvesting",
        label: "Gentle Harvesting",
        headline: "Ripeness-sensing vision with bruise-free soft grippers",
        description:
          "Stereo RGB-D cameras evaluate fruit color, size, and stem angle in milliseconds, guiding compliant fingers to pick at peak ripeness.",
        highlights: [
          "Day/night greenhouse operation with active LED illumination",
          "Force-controlled stem twist/snip without bruising",
          "Direct crate placement and yield weight logging",
        ],
        metricLabel: "Pick Accuracy",
        metricValue: "96.5%",
      },
      {
        id: "cold-packaging",
        label: "Primary Packaging",
        headline: "High-speed sorting, slicing & flow-wrap loading",
        description:
          "Automate repetitive chilled-room tray loading, bakery pick-and-place, and carton packing at consistent line speeds.",
        highlights: [
          "Operates reliably in 0°C to +40°C chilled food rooms",
          "Quick-release hygienic grippers for rapid SKU changeovers",
          "Vision-guided rejection of misshapen or underweight portions",
        ],
        metricLabel: "Line Throughput",
        metricValue: "+38%",
      },
    ],
    robots: [
      {
        id: "field-rovers-drones",
        name: "Field Rovers & Drones",
        tagline: "AI-guided precision spraying, weeding & crop monitoring",
        description:
          "AI-guided precision spraying, mechanical/spot weed removal, and multispectral crop health monitoring across farms and orchards.",
        applications: [
          "Targeted Spot Spraying & Weeding",
          "Multispectral NDVI Crop Health Mapping",
          "Greenhouse & Vineyard Scouting",
          "Autonomous Cover-Crop Seeding",
        ],
        specs: [
          { label: "Navigation", value: "RTK-GPS (±1.5 cm) + 3D LiDAR" },
          { label: "Drive System", value: "4WD All-Terrain Electric Hub" },
          { label: "Payload / Tank", value: "120 kg / 80 L Precision Boom" },
          { label: "Vision Suite", value: "Multispectral + Stereo RGB-D" },
          { label: "Ingress Protection", value: "IP66 Weatherproof" },
          { label: "Runtime", value: "6 – 8 hrs Swappable LiFePO4" },
        ],
        compliance: "ISO 18497 (Ag Autonomy), FAA Part 107 Ready",
      },
      {
        id: "washdown-food-cobots",
        name: "Washdown Food Cobots",
        tagline: "IP67/IP69K stainless-steel arms for hygienic packaging",
        description:
          "Waterproof, hygienic 316L stainless-steel arms with food-grade soft grippers for sorting, slicing, and primary food packaging.",
        applications: [
          "Primary Meat, Dairy & Cheese Packaging",
          "Bakery & Confectionery Tray Loading",
          "High-Pressure Washdown Line Tending",
          "Chilled Ready-Meal Assembly",
        ],
        specs: [
          { label: "Body Material", value: "316L Electropolished Stainless" },
          { label: "Washdown Rating", value: "IP67 / IP69K (80°C High-Pressure)" },
          { label: "Lubrication", value: "NSF H1 Food-Grade" },
          { label: "Payload Capacity", value: "6 kg – 15 kg" },
          { label: "Repeatability", value: "±0.03 mm" },
          { label: "Ambient Temp", value: "0°C to +45°C" },
        ],
        compliance: "EHEDG, FDA 21 CFR, NSF H1, ISO/TS 15066",
      },
      {
        id: "harvesting-robots",
        name: "Harvesting Robots",
        tagline: "Vision-guided arms for picking delicate fruits & vegetables",
        description:
          "Vision-guided arms capable of identifying ripe produce and picking delicate fruits or vegetables without bruising.",
        applications: [
          "Greenhouse Tomato & Pepper Picking",
          "Berry & Soft-Fruit Harvesting",
          "Automated De-Leafing & Pollination",
          "In-Row Crate Sorting & Grading",
        ],
        specs: [
          { label: "Vision System", value: "Dual Stereo RGB-D + Ripeness AI" },
          { label: "End Effector", value: "Compliant Soft Silicone + Cutter" },
          { label: "Cycle Speed", value: "3.5 – 5.0 sec per fruit" },
          { label: "Reach", value: "1,100 mm Multi-Axis Arm" },
          { label: "Bruise Rate", value: "< 1.2%" },
          { label: "Track Compatibility", value: "Pipe-Rail & Soil Row Mobile" },
        ],
        compliance: "CE, IP65 Greenhouse-Rated",
      },
    ],
    ecosystem: [
      {
        title: "Hygienic Gripper Library",
        description:
          "FDA-compliant soft fingers, vacuum cups, and washdown tool changers.",
        ctaLabel: "Explore Products",
        href: "/products",
      },
      {
        title: "Agronomy AI Analytics",
        description:
          "Turn rover & drone imagery into actionable yield and stress heatmaps.",
        ctaLabel: "Explore Tech",
        href: "/technology/physical-ai",
      },
      {
        title: "Food-Line Integration",
        description:
          "Sanitary conveyor synchronization, checkweighers, and vision reject gates.",
        ctaLabel: "View Integration",
        href: "/engineering-services/system-integration",
      },
      {
        title: "Seasonal Trial Program",
        description:
          "Pilot harvesting or washdown cells directly in your greenhouse or plant.",
        ctaLabel: "Book Consultation",
        href: "/book-consultation",
      },
    ],
    testimonial: {
      quote:
        "Switching our chilled packaging line to INDUS IP69K stainless cobots cut sanitation turnaround in half and boosted daily tray output by 36%.",
      author: "Rohan Kulkarni",
      role: "Head of Plant Engineering",
      company: "FreshValley Dairy & Foods",
    },
  },
  {
    id: "hospitality-retail-facility-management",
    slug: "hospitality-retail-facility-management",
    title: "Hospitality, Retail & Facility Management",
    shortLabel: "Hospitality & Retail",
    heroHeadline: "Autonomous guest service, cleaning & 24/7 facility patrol",
    heroSubtitle:
      "Elevate guest satisfaction and maintain spotless, secure commercial spaces with scheduled autonomous floor scrubbers, concierge delivery bots, and RFID/security patrol rovers.",
    targetClients: [
      "Hotels, Resorts & Convention Centers",
      "Shopping Malls & Retail Chains",
      "International Airports & Transit Hubs",
      "Corporate Campuses & Restaurants",
    ],
    image: hospitalityImg,
    imageAlt:
      "Autonomous commercial floor-cleaning robot operating in a modern airport concourse",
    heroMetrics: [
      { label: "Cleaning Coverage", value: "3,200 m²/hr" },
      { label: "Shelf Audit Speed", value: "5x Faster" },
      { label: "Patrol Uptime", value: "24/7" },
    ],
    introHeadline: "Smart autonomy built for public spaces",
    introDescription:
      "Commercial teams face constant pressure to keep large venues spotless, stocked, and secure around the clock. INDUS commercial robots operate safely alongside guests and shoppers with polite obstacle avoidance and zero-supervision scheduling.",
    capabilities: [
      {
        id: "autonomous-cleaning",
        label: "Scheduled Floor Care",
        headline: "Map once, clean every concourse and lobby overnight",
        description:
          "Large-scale autonomous scrubbers and vacuums auto-empty dirty water, recharge, and deliver verified square-meter cleaning reports.",
        highlights: [
          "Scrubs, sweeps, and vacuums marble, terrazzo, carpet, and concrete",
          "Auto-fill/auto-drain docking station for multi-day autonomy",
          "Edge-cleaning side brushes reach within 10 mm of walls",
        ],
        metricLabel: "Coverage Rate",
        metricValue: "3,200 m²/hr",
      },
      {
        id: "guest-delivery",
        label: "Guest & Dining Service",
        headline: "Seamless food runners and elevator-riding room service",
        description:
          "Tray-based restaurant bots and enclosed hotel concierge units navigate crowded dining rooms and call guest elevators automatically.",
        highlights: [
          "Voice prompts, touchscreen UI, and spill-proof suspension",
          "Automatic phone-call alert when arriving at guest room door",
          "Multi-table bussing and dish-return workflows",
        ],
        metricLabel: "Deliveries / Shift",
        metricValue: "220+",
      },
      {
        id: "retail-inventory",
        label: "Retail Shelf Scanning",
        headline: "Real-time RFID & vision audits for out-of-stock alerts",
        description:
          "Autonomous aisle rovers scan thousands of SKUs per hour, flagging missing items, price-tag mismatches, and planogram gaps.",
        highlights: [
          "99% RFID read accuracy across apparel and hardline aisles",
          "High-resolution optical shelf cameras detect low-stock facings",
          "Automated replenishment tasks pushed to store associates",
        ],
        metricLabel: "Audit Accuracy",
        metricValue: "99.1%",
      },
      {
        id: "security-patrol",
        label: "24/7 Perimeter Patrol",
        headline: "Thermal, 360° video & anomaly alerts for corporate sites",
        description:
          "Autonomous patrol rovers monitor parking decks, lobbies, and outdoor perimeters—streaming live video to SOC teams on exception.",
        highlights: [
          "360° PTZ + thermal camera with two-way audio intercom",
          "Detects unlocked doors, water leaks, and unauthorized access",
          "All-weather IP65 chassis with autonomous charging dock",
        ],
        metricLabel: "Patrol Coverage",
        metricValue: "24/7",
      },
    ],
    robots: [
      {
        id: "autonomous-floor-scrubbers",
        name: "Autonomous Floor Scrubbers",
        tagline: "Self-navigating commercial cleaners for malls & airports",
        description:
          "Self-navigating commercial cleaners that map buildings and scrub, sweep, or vacuum floors overnight with zero supervision.",
        applications: [
          "Airport Concourses & Terminal Gates",
          "Shopping Mall Atriums & Corridors",
          "Corporate Office Lobbies & Cafeterias",
          "Convention Centers & Event Halls",
        ],
        specs: [
          { label: "Cleaning Efficiency", value: "2,200 – 3,200 m²/hr" },
          { label: "Scrubbing Width", value: "700 – 850 mm" },
          { label: "Solution / Recovery", value: "75 L / 75 L (Auto-Dock Option)" },
          { label: "Navigation", value: "3D LiDAR + RGB-D + Cliff Sensors" },
          { label: "Noise Level", value: "58 dBA Eco-Quiet Mode" },
          { label: "Runtime", value: "4.5 hrs Continuous Scrubbing" },
        ],
        compliance: "IEC 63327, UL 583, CE Commercial",
      },
      {
        id: "service-delivery-bots",
        name: "Service & Delivery Bots",
        tagline: "Tray-based food runners & hotel concierge bots",
        description:
          "Tray-based food runners for busy restaurants and elevator-integrated concierge robots for hotel room service.",
        applications: [
          "Restaurant Table Delivery & Bussing",
          "Hotel 24/7 Room Service & Amenities",
          "Airport Lounge Refreshment Service",
          "Corporate Mailroom & Pantry Runs",
        ],
        specs: [
          { label: "Configurations", value: "4-Tier Open Tray / 2-Bay Locked" },
          { label: "Total Payload", value: "40 kg (10 kg per tray)" },
          { label: "Min. Passage Width", value: "650 mm" },
          { label: "Elevator Integration", value: "IoT Cloud & Local Controller" },
          { label: "Battery Runtime", value: "10 – 12 hrs" },
          { label: "Guest Interface", value: "10.1\" HD Touch + Voice" },
        ],
        compliance: "ISO 13482, FCC, CE",
      },
      {
        id: "inventory-security-patrol-bots",
        name: "Inventory & Security Patrol Bots",
        tagline: "Autonomous rovers for shelf scanning & 24/7 security",
        description:
          "Autonomous rovers equipped with RFID/cameras to scan retail shelves for out-of-stock items or patrol perimeters 24/7.",
        applications: [
          "Retail Aisle Out-of-Stock & Planogram Scan",
          "RFID Apparel & Warehouse Inventory Audit",
          "24/7 Corporate Campus & Parking Patrol",
          "Thermal & Door-Status Anomaly Checks",
        ],
        specs: [
          { label: "Sensors", value: "UHF RFID + 360° 4K + Thermal" },
          { label: "Scan Mast Height", value: "Up to 2,200 mm" },
          { label: "Patrol Speed", value: "1.2 – 1.8 m/s" },
          { label: "Connectivity", value: "Wi-Fi 6 + 5G LTE Failover" },
          { label: "Weather Rating", value: "IP65 (Patrol Model)" },
          { label: "VMS / ERP Sync", value: "ONVIF / REST Webhook API" },
        ],
        compliance: "NDAA-Compliant Optics Option, CE, FCC",
      },
    ],
    ecosystem: [
      {
        title: "Multi-Site Fleet Portal",
        description:
          "Track cleaning proof-of-service, battery health, and patrol alerts across all properties.",
        ctaLabel: "Explore Tech",
        href: "/technology/digital-twin",
      },
      {
        title: "Auto-Docking Stations",
        description:
          "Hands-free water refill, waste drain, and rapid inductive/contact charging.",
        ctaLabel: "Explore Products",
        href: "/products",
      },
      {
        title: "PMS & POS Integrations",
        description:
          "Connect concierge bots to hotel PMS, elevator banks, and restaurant POS queues.",
        ctaLabel: "View Integration",
        href: "/engineering-services/system-integration",
      },
      {
        title: "Managed RaaS Plans",
        description:
          "Flexible Robotics-as-a-Service subscriptions with full maintenance included.",
        ctaLabel: "Book Consultation",
        href: "/book-consultation",
      },
    ],
    testimonial: {
      quote:
        "Deploying INDUS floor scrubbers and concierge delivery bots across our 400-room property freed our hospitality staff to focus on high-touch guest experiences.",
      author: "Nadia Al-Mansoor",
      role: "VP of Facilities & Guest Experience",
      company: "Meridian Grand Hotels",
    },
  },
];

export function getSolutionVerticalBySlug(
  slug: string,
): SolutionVerticalData | undefined {
  return SOLUTION_VERTICALS_DATA.find((item) => item.slug === slug);
}
