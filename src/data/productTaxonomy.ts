/**
 * INDUS Industrial Robotics — 8 Master Product Navigation Categories
 * 
 * Rebuilt canonical product taxonomy:
 * 1. Motion & Actuation (24 ranges)
 * 2. Robotic Systems (20 ranges)
 * 3. Mobility Systems (20 ranges)
 * 4. Control & Drives (20 ranges)
 * 5. Sensing & Vision (20 ranges)
 * 6. End Effectors & Tooling (20 ranges)
 * 7. Mechanical Components (20 ranges)
 * 8. Safety & Intelligent Systems (20 ranges)
 * 
 * Total: 164 verified, 100% unique product ranges.
 * Every item corresponds directly to a verified catalogue range in productCatalogue.ts.
 */

export interface TaxonomyRangeItem {
  id: string;
  name: string;
  href: string;
  specHighlight: string;
  verificationStatus: "verified" | "configurable" | "preliminary" | "custom-on-request";
  lineId: string;
}

export interface TaxonomyGroup {
  groupName: string;
  technologyDescription: string;
  items: TaxonomyRangeItem[];
}

export interface TopLevelCategory {
  id: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  description: string;
  engineeringStandard: string;
  primaryRoute: string;
  rangeCountBadge: string;
  enquiryActionLabel: string;
  groups: TaxonomyGroup[];
  relatedApplications: { name: string; href: string }[];
  engineeringTools: { name: string; href: string; badge?: string }[];
}

export const TOP_LEVEL_CATEGORIES: TopLevelCategory[] = [
  {
    id: "motion-actuation",
    title: "Motion & Actuation",
    shortTitle: "Motion",
    subtitle: "Precision reducers, servo motors, and integrated joint modules",
    description: "Ultra-precision strain-wave harmonic reducers, cycloidal RV gearboxes, planetary gearheads, and high-dynamic servo joint actuators.",
    engineeringStandard: "ISO 9283 / DIN 3990 / IEC 60034",
    primaryRoute: "/products/motion-actuation",
    rangeCountBadge: "24 Verified Ranges",
    enquiryActionLabel: "Request Reducer & Motor Sizing Support",
    groups: [
      {
        groupName: "Strain-Wave Harmonic Reducers",
        technologyDescription: "Strain-Wave Harmonic Reducers for industrial automation & robotics",
        items: [
          {
            id: "ind-pr-sw-cup-set",
            name: "IND-PR-SW100 Cup Component Set",
            href: "/products/motion-actuation/ind-pr-sw-cup-set",
            specHighlight: "Rated Torque: 48 - 147 Nm | Gear Ratios: 50:1, 80:1, 100:1, 120:1, 160:1",
            verificationStatus: "verified",
            lineId: "precision-reducers",
          },
          {
            id: "ind-pr-sw-hollow-unit",
            name: "IND-PR-SW200 Hollow-Bore Gear Unit",
            href: "/products/motion-actuation/ind-pr-sw-hollow-unit",
            specHighlight: "Rated Torque: 75 - 280 Nm | Gear Ratios: 50:1, 80:1, 100:1, 160:1",
            verificationStatus: "verified",
            lineId: "precision-reducers",
          },
          {
            id: "ind-pr-sw-flat-pancake",
            name: "IND-PR-SW300 Ultra-Flat Pancake Reducer",
            href: "/products/motion-actuation/ind-pr-sw-flat-pancake",
            specHighlight: "Rated Torque: 25 - 110 Nm | Gear Ratios: 50:1, 80:1, 100:1",
            verificationStatus: "verified",
            lineId: "precision-reducers",
          },
          {
            id: "ind-pr-sw-silk-hat",
            name: "IND-PR-SW400 High-Torque Silk-Hat Gearhead",
            href: "/products/motion-actuation/ind-pr-sw-silk-hat",
            specHighlight: "Rated Torque: 90 - 450 Nm | Gear Ratios: 50:1, 80:1, 100:1, 120:1, 160:1",
            verificationStatus: "verified",
            lineId: "precision-reducers",
          },
          {
            id: "ind-pr-sw-micro",
            name: "IND-PR-SW600 Miniature Strain-Wave Drive",
            href: "/products/motion-actuation/ind-pr-sw-micro",
            specHighlight: "Rated Torque: 0.8 - 6.5 Nm | Gear Ratios: 30:1, 50:1, 80:1, 100:1",
            verificationStatus: "verified",
            lineId: "precision-reducers",
          },
          {
            id: "ind-pr-sw-cryo-vacuum",
            name: "IND-PR-SW500 Cryogenic Vacuum Strain-Wave Reducer",
            href: "/products/motion-actuation/ind-pr-sw-cryo-vacuum",
            specHighlight: "Rated Torque: 15 - 85 Nm | Gear Ratios: 50:1, 80:1, 100:1",
            verificationStatus: "verified",
            lineId: "precision-reducers",
          },
        ],
      },
      {
        groupName: "RV & High-Precision Cycloidal Drives",
        technologyDescription: "RV & High-Precision Cycloidal Drives for industrial automation & robotics",
        items: [
          {
            id: "ind-pr-rv-solid-e",
            name: "IND-PR-RVE Solid-Output Precision RV Reducer",
            href: "/products/motion-actuation/ind-pr-rv-solid-e",
            specHighlight: "Rated Torque: 290 - 3,200 Nm | Gear Ratios: 31:1, 41:1, 81:1, 105:1, 153:1",
            verificationStatus: "verified",
            lineId: "precision-reducers",
          },
          {
            id: "ind-pr-rv-hollow-c",
            name: "IND-PR-RVC Hollow-Center RV Reducer",
            href: "/products/motion-actuation/ind-pr-rv-hollow-c",
            specHighlight: "Rated Torque: 350 - 2,500 Nm | Gear Ratios: 41:1, 81:1, 121:1, 161:1, 192:1",
            verificationStatus: "verified",
            lineId: "precision-reducers",
          },
          {
            id: "ind-pr-rv-compact-n",
            name: "IND-PR-RVN Compact Slimline RV Reducer",
            href: "/products/motion-actuation/ind-pr-rv-compact-n",
            specHighlight: "Rated Torque: 180 - 1,450 Nm | Gear Ratios: 41:1, 61:1, 81:1, 121:1",
            verificationStatus: "verified",
            lineId: "precision-reducers",
          },
          {
            id: "ind-pr-rv-turntable",
            name: "IND-PR-RVT Heavy Turntable RV Reducer",
            href: "/products/motion-actuation/ind-pr-rv-turntable",
            specHighlight: "Rated Torque: 3,200 - 18,000 Nm | Gear Ratios: 81:1, 121:1, 161:1, 201:1",
            verificationStatus: "verified",
            lineId: "precision-reducers",
          },
          {
            id: "ind-pr-cyc-standard",
            name: "IND-PR-CYC100 Pure Cycloidal Drive",
            href: "/products/motion-actuation/ind-pr-cyc-standard",
            specHighlight: "Rated Torque: 120 - 4,800 Nm | Gear Ratios: 11:1, 17:1, 29:1, 35:1, 43:1, 59:1, 71:1, 87:1, 119:1",
            verificationStatus: "verified",
            lineId: "precision-reducers",
          },
          {
            id: "ind-pr-cyc-precision",
            name: "IND-PR-CYC200 Precision Pin-Wheel Cycloid",
            href: "/products/motion-actuation/ind-pr-cyc-precision",
            specHighlight: "Rated Torque: 180 - 2,100 Nm | Gear Ratios: 29:1, 43:1, 59:1, 87:1, 119:1",
            verificationStatus: "verified",
            lineId: "precision-reducers",
          },
        ],
      },
      {
        groupName: "Precision Planetary & Hypoid Gearboxes",
        technologyDescription: "Precision Planetary & Hypoid Gearboxes for industrial automation & robotics",
        items: [
          {
            id: "ind-pr-pl-helical-low",
            name: "IND-PR-PL100 Ultra-Precision Helical Planetary",
            href: "/products/motion-actuation/ind-pr-pl-helical-low",
            specHighlight: "Rated Torque: 25 - 650 Nm | Gear Ratios: 3:1, 4:1, 5:1, 7:1, 10:1 (Stage 1); 16:1, 20:1, 25:1, 35:1, 50:1, 70:1, 100:1 (Stage 2)",
            verificationStatus: "verified",
            lineId: "precision-reducers",
          },
          {
            id: "ind-pr-pl-right-angle",
            name: "IND-PR-PL300 Right-Angle Bevel Planetary Gearbox",
            href: "/products/motion-actuation/ind-pr-pl-right-angle",
            specHighlight: "Rated Torque: 35 - 750 Nm | Gear Ratios: 3:1, 4:1, 5:1, 7:1, 10:1 (Stage 1); 16:1, 20:1, 25:1, 50:1, 100:1 (Stage 2)",
            verificationStatus: "verified",
            lineId: "precision-reducers",
          },
          {
            id: "ind-pr-pl-flange-output",
            name: "IND-PR-PL200 Flange-Output Planetary Gearbox",
            href: "/products/motion-actuation/ind-pr-pl-flange-output",
            specHighlight: "Rated Torque: 65 - 1,200 Nm | Gear Ratios: 4:1, 5:1, 7:1, 10:1 (Stage 1); 16:1, 25:1, 50:1, 100:1 (Stage 2)",
            verificationStatus: "verified",
            lineId: "precision-reducers",
          },
          {
            id: "ind-pr-pl-economy",
            name: "IND-PR-PL400 High-Speed Economy Planetary",
            href: "/products/motion-actuation/ind-pr-pl-economy",
            specHighlight: "Rated Torque: 18 - 380 Nm | Gear Ratios: 3:1, 4:1, 5:1, 7:1, 10:1 (Stage 1); 15:1, 20:1, 25:1, 50:1, 100:1 (Stage 2)",
            verificationStatus: "verified",
            lineId: "precision-reducers",
          },
          {
            id: "ind-pr-pl-3stage-high-ratio",
            name: "IND-PR-PL700 Multi-Stage High-Ratio Planetary",
            href: "/products/motion-actuation/ind-pr-pl-3stage-high-ratio",
            specHighlight: "Rated Torque: 120 - 1,800 Nm | Gear Ratios: 125:1, 200:1, 350:1, 500:1, 700:1, 1000:1",
            verificationStatus: "verified",
            lineId: "precision-reducers",
          },
          {
            id: "ind-pr-pl-hygienic",
            name: "IND-PR-PL500 Stainless IP69K Hygienic Planetary",
            href: "/products/motion-actuation/ind-pr-pl-hygienic",
            specHighlight: "Rated Torque: 20 - 280 Nm | Gear Ratios: 3:1, 5:1, 7:1, 10:1 (Stage 1); 15:1, 25:1, 50:1 (Stage 2)",
            verificationStatus: "verified",
            lineId: "precision-reducers",
          },
        ],
      },
      {
        groupName: "Servo Motors & Joint Actuators",
        technologyDescription: "Servo Motors & Joint Actuators for industrial automation & robotics",
        items: [
          {
            id: "ind-mot-pmsm-low-inertia",
            name: "Low-Inertia AC Brushless Servomotor",
            href: "/products/motion-actuation/ind-mot-pmsm-low-inertia",
            specHighlight: "Rated Power: 100W - 3kW | Rated Speed: 3,000 - 6,000 RPM",
            verificationStatus: "verified",
            lineId: "servo-motors",
          },
          {
            id: "ind-mot-pmsm-med-inertia",
            name: "Medium-Inertia High-Torque Servomotor",
            href: "/products/motion-actuation/ind-mot-pmsm-med-inertia",
            specHighlight: "Rated Power: 1.5kW - 15kW | Rated Speed: 2,000 - 3,000 RPM",
            verificationStatus: "verified",
            lineId: "servo-motors",
          },
          {
            id: "ind-mot-frameless-torque",
            name: "Frameless Torque Motor Rotor/Stator Kit",
            href: "/products/motion-actuation/ind-mot-frameless-torque",
            specHighlight: "Continuous Torque: 1.8 - 145 Nm | Peak Torque: 5.4 - 435 Nm",
            verificationStatus: "verified",
            lineId: "servo-motors",
          },
          {
            id: "ind-mot-direct-drive-rotary",
            name: "Direct-Drive Rotary (DDR) Motor",
            href: "/products/motion-actuation/ind-mot-direct-drive-rotary",
            specHighlight: "Peak Torque: 12 - 450 Nm | Max Speed: 300 - 1,200 RPM",
            verificationStatus: "verified",
            lineId: "servo-motors",
          },
          {
            id: "ind-act-cobot-joint-medium",
            name: "Medium Modular Cobot Joint (Axes 2-3)",
            href: "/products/motion-actuation/ind-act-cobot-joint-medium",
            specHighlight: "Rated Torque: 145 Nm | Peak Torque: 320 Nm",
            verificationStatus: "verified",
            lineId: "robot-joint-actuators",
          },
          {
            id: "ind-act-hollow-rotary-table",
            name: "Hollow-Bore Rotary Actuator Table",
            href: "/products/motion-actuation/ind-act-hollow-rotary-table",
            specHighlight: "Table Diameter: 130 - 320 mm | Through Bore: 35 - 120 mm",
            verificationStatus: "verified",
            lineId: "robot-joint-actuators",
          },
        ],
      },
    ],
    relatedApplications: [
      {
            "name": "Electronics & Semiconductor",
            "href": "/applications/electronics"
      },
      {
            "name": "Automotive Body Assembly",
            "href": "/applications/automotive"
      },
      {
            "name": "Aerospace Machining",
            "href": "/applications/aerospace"
      }
],
    engineeringTools: [
      {
            "name": "Joint Sizing Calculator",
            "href": "/technology/calculators",
            "badge": "Interactive"
      },
      {
            "name": "Reducer Backlash Analysis",
            "href": "/technology/precision-reducers",
            "badge": "Technical"
      }
],
  },
  {
    id: "robotic-systems",
    title: "Robotic Systems",
    shortTitle: "Robotics",
    subtitle: "Articulated 6-axis arms, cobots, SCARA, delta manipulators, and workcells",
    description: "Industrial 6-axis articulated arms, sensitive collaborative cobots, ultra-high-speed SCARA and parallel delta kinematic manipulators.",
    engineeringStandard: "ISO 10218-1/2 / ISO/TS 15066",
    primaryRoute: "/products/robotic-systems",
    rangeCountBadge: "20 Verified Ranges",
    enquiryActionLabel: "Request Robot Workcell & Sizing Support",
    groups: [
      {
        groupName: "Articulated 6-Axis Industrial Arms",
        technologyDescription: "Articulated 6-Axis Industrial Arms for industrial automation & robotics",
        items: [
          {
            id: "ind-rob-6axis-mid",
            name: "Articulated 6-Axis Industrial Arm (10–25kg)",
            href: "/products/robotic-systems/ind-rob-6axis-mid",
            specHighlight: "Payload: 10 - 25 kg | Reach: 1,450 - 1,820 mm",
            verificationStatus: "verified",
            lineId: "robotic-systems",
          },
          {
            id: "ind-rob-heavy-foundry",
            name: "Heavy-Duty Foundry & Stamping 6-Axis Arm (50–250kg)",
            href: "/products/robotic-systems/ind-rob-heavy-foundry",
            specHighlight: "Payload: 50 - 250 kg | Reach: 2,050 - 2,700 mm",
            verificationStatus: "verified",
            lineId: "robotic-systems",
          },
          {
            id: "ind-rob-compact-tabletop",
            name: "Compact Tabletop Precision 6-Axis Arm (3–7kg)",
            href: "/products/robotic-systems/ind-rob-compact-tabletop",
            specHighlight: "Payload: 3 - 7 kg | Reach: 550 - 700 mm",
            verificationStatus: "verified",
            lineId: "robotic-systems",
          },
          {
            id: "ind-rob-long-reach",
            name: "Extended-Reach Logistics Articulated Arm (Reach >2500mm)",
            href: "/products/robotic-systems/ind-rob-long-reach",
            specHighlight: "Reach: 2,650 - 3,100 mm | Payload: 20 - 45 kg",
            verificationStatus: "verified",
            lineId: "robotic-systems",
          },
          {
            id: "ind-rob-cleanroom-iso1",
            name: "Cleanroom Class 1 (ISO 14644-1) Articulated Arm",
            href: "/products/robotic-systems/ind-rob-cleanroom-iso1",
            specHighlight: "Cleanroom Grade: ISO Class 1 / FED STD 209E Class 1 | Surface Resistivity: 10^6 - 10^9 Ω",
            verificationStatus: "verified",
            lineId: "robotic-systems",
          },
        ],
      },
      {
        groupName: "Collaborative Robots (Cobots)",
        technologyDescription: "Collaborative Robots (Cobots) for industrial automation & robotics",
        items: [
          {
            id: "ind-rob-cobot-5kg",
            name: "Collaborative Cobot Arm (5kg Payload)",
            href: "/products/robotic-systems/ind-rob-cobot-5kg",
            specHighlight: "Payload: 5 kg | Reach: 850 mm",
            verificationStatus: "verified",
            lineId: "robotic-systems",
          },
          {
            id: "ind-rob-cobot-10kg",
            name: "Dual-Torque Sensing Cobot (10kg Payload)",
            href: "/products/robotic-systems/ind-rob-cobot-10kg",
            specHighlight: "Payload: 10 kg | Reach: 1,300 mm",
            verificationStatus: "verified",
            lineId: "robotic-systems",
          },
          {
            id: "ind-rob-cobot-20kg-pallet",
            name: "Heavy Palletizing Cobot Arm (20kg Payload)",
            href: "/products/robotic-systems/ind-rob-cobot-20kg-pallet",
            specHighlight: "Payload: 20 kg | Reach: 1,700 mm",
            verificationStatus: "verified",
            lineId: "robotic-systems",
          },
          {
            id: "ind-rob-cobot-mobile",
            name: "Autonomous Mobile Manipulator (Cobot + AMR)",
            href: "/products/robotic-systems/ind-rob-cobot-mobile",
            specHighlight: "Arm Payload: 5 - 10 kg | Mobile Payload: 300 - 600 kg",
            verificationStatus: "verified",
            lineId: "robotic-systems",
          },
          {
            id: "ind-rob-cobot-surgical",
            name: "Surgical & Medical Certified Collaborative Arm",
            href: "/products/robotic-systems/ind-rob-cobot-surgical",
            specHighlight: "Cartesian Accuracy: < 0.1 mm | Haptic Latency: < 1 ms",
            verificationStatus: "verified",
            lineId: "robotic-systems",
          },
        ],
      },
      {
        groupName: "SCARA & High-Speed Delta Robots",
        technologyDescription: "SCARA & High-Speed Delta Robots for industrial automation & robotics",
        items: [
          {
            id: "ind-rob-scara-standard",
            name: "High-Speed 4-Axis SCARA Manipulator",
            href: "/products/robotic-systems/ind-rob-scara-standard",
            specHighlight: "Payload: 3 - 10 kg | Arm Reach: 400 - 800 mm",
            verificationStatus: "verified",
            lineId: "robotic-systems",
          },
          {
            id: "ind-rob-scara-long-reach",
            name: "Extended-Radius SCARA Assembly Robot",
            href: "/products/robotic-systems/ind-rob-scara-long-reach",
            specHighlight: "Reach: 1,000 - 1,200 mm | Payload: 10 - 20 kg",
            verificationStatus: "verified",
            lineId: "robotic-systems",
          },
          {
            id: "ind-rob-delta-parallel",
            name: "High-Speed Parallel Delta Pick-and-Place Robot",
            href: "/products/robotic-systems/ind-rob-delta-parallel",
            specHighlight: "Pick Rate: Up to 180 picks/min | Payload: 1.5 - 6 kg",
            verificationStatus: "verified",
            lineId: "robotic-systems",
          },
          {
            id: "ind-rob-delta-ip69k",
            name: "IP69K Food-Grade Washdown Delta Robot",
            href: "/products/robotic-systems/ind-rob-delta-ip69k",
            specHighlight: "Protection: IP69K / IP67 | Housing: 316L Stainless Steel",
            verificationStatus: "verified",
            lineId: "robotic-systems",
          },
          {
            id: "ind-rob-cartesian-gantry",
            name: "Multi-Axis Cartesian Linear Gantry Robot",
            href: "/products/robotic-systems/ind-rob-cartesian-gantry",
            specHighlight: "X-Stroke: Up to 30,000 mm | Payload: 100 - 500 kg",
            verificationStatus: "verified",
            lineId: "robotic-systems",
          },
        ],
      },
      {
        groupName: "Turn-Key Industrial Automation Cells",
        technologyDescription: "Turn-Key Industrial Automation Cells for industrial automation & robotics",
        items: [
          {
            id: "ind-rob-cell-welding",
            name: "Robotic Arc & Laser Welding Workcell",
            href: "/products/robotic-systems/ind-rob-cell-welding",
            specHighlight: "Cell Size: 3.5m x 4.0m enclosed | Positioner Load: 500 - 2,000 kg",
            verificationStatus: "verified",
            lineId: "robotic-systems",
          },
          {
            id: "ind-rob-cell-palletizing",
            name: "End-of-Line Automated Palletizing Cell",
            href: "/products/robotic-systems/ind-rob-cell-palletizing",
            specHighlight: "Throughput: 18 - 25 boxes/min | Pallet Formats: Euro (1200x800) & US (48x40)",
            verificationStatus: "verified",
            lineId: "robotic-systems",
          },
          {
            id: "ind-rob-cell-assembly",
            name: "Precision Electronic Micro-Assembly Workcell",
            href: "/products/robotic-systems/ind-rob-cell-assembly",
            specHighlight: "Footprint: 1.2m x 1.0m | Cleanliness: ISO Class 5",
            verificationStatus: "verified",
            lineId: "robotic-systems",
          },
          {
            id: "ind-rob-cell-machine-tending",
            name: "Automated CNC Machine Tending Cell",
            href: "/products/robotic-systems/ind-rob-cell-machine-tending",
            specHighlight: "Turnaround Time: 5.5 seconds | Stocker Capacity: Up to 120 raw parts",
            verificationStatus: "verified",
            lineId: "robotic-systems",
          },
          {
            id: "ind-rob-cell-inspection",
            name: "Automated Optical 3D Quality Inspection Cell",
            href: "/products/robotic-systems/ind-rob-cell-inspection",
            specHighlight: "Measurement Accuracy: ±12 µm | Scan Rate: 5,000,000 points/sec",
            verificationStatus: "verified",
            lineId: "robotic-systems",
          },
        ],
      },
    ],
    relatedApplications: [
      {
            "name": "High-Speed Packaging",
            "href": "/applications/packaging"
      },
      {
            "name": "CNC Machine Tending",
            "href": "/applications/metal-fabrication"
      },
      {
            "name": "Cleanroom Semiconductor Handling",
            "href": "/applications/semiconductor"
      }
],
    engineeringTools: [
      {
            "name": "Payload & Inertia Estimator",
            "href": "/technology/calculators",
            "badge": "Kinematics"
      },
      {
            "name": "Cobot Safety Boundary Tool",
            "href": "/technology/safety-systems",
            "badge": "ISO/TS 15066"
      }
],
  },
  {
    id: "mobility-systems",
    title: "Mobility Systems",
    shortTitle: "Mobility",
    subtitle: "In-hub AGV drive wheels, mecanum wheels, swerve steer modules, and mobile platforms",
    description: "Integrated in-hub AGV traction drives, heavy-duty omnidirectional mecanum wheels, precision swerve steer assemblies, and autonomous chassis.",
    engineeringStandard: "ISO 3691-4 / ANSI/ITSDF B56.5",
    primaryRoute: "/products/mobility-systems",
    rangeCountBadge: "20 Verified Ranges",
    enquiryActionLabel: "Request AGV / AMR Mobility Engineering Support",
    groups: [
      {
        groupName: "In-Hub AGV Drive Wheels",
        technologyDescription: "In-Hub AGV Drive Wheels for industrial automation & robotics",
        items: [
          {
            id: "ind-mob-drive-standard",
            name: "In-Hub High-Torque AGV Drive Wheel (Drive-100)",
            href: "/products/mobility-systems/ind-mob-drive-standard",
            specHighlight: "Rated Load: 1,000 kg / wheel | Speed: Up to 2.2 m/s",
            verificationStatus: "verified",
            lineId: "mobility-systems",
          },
          {
            id: "ind-mob-drive-heavy",
            name: "Heavy-Payload Cast-Iron Drive Unit (3000kg)",
            href: "/products/mobility-systems/ind-mob-drive-heavy",
            specHighlight: "Payload: 3,000 kg / wheel | Peak Torque: 1,200 Nm",
            verificationStatus: "verified",
            lineId: "mobility-systems",
          },
          {
            id: "ind-mob-drive-low-profile",
            name: "Low-Profile Sub-Floor AMR Drive Unit (<160mm)",
            href: "/products/mobility-systems/ind-mob-drive-low-profile",
            specHighlight: "Total Height: 152 mm | Rated Load: 800 kg / wheel",
            verificationStatus: "verified",
            lineId: "mobility-systems",
          },
          {
            id: "ind-mob-drive-differential",
            name: "Dual-Motor Differential Drive Chassis Assembly",
            href: "/products/mobility-systems/ind-mob-drive-differential",
            specHighlight: "Total Load: 1,200 kg total base | Turning Radius: Zero (spins on center)",
            verificationStatus: "verified",
            lineId: "mobility-systems",
          },
          {
            id: "ind-mob-drive-atex",
            name: "ATEX / IECEx Zone 1 Explosion-Proof Wheel",
            href: "/products/mobility-systems/ind-mob-drive-atex",
            specHighlight: "ATEX Rating: II 2G Ex db IIB T4 Gb | Static Dissipation: < 10^6 Ω",
            verificationStatus: "verified",
            lineId: "mobility-systems",
          },
        ],
      },
      {
        groupName: "Omnidirectional Mecanum & Omni Wheels",
        technologyDescription: "Omnidirectional Mecanum & Omni Wheels for industrial automation & robotics",
        items: [
          {
            id: "ind-mob-mecanum-heavy",
            name: "Heavy-Duty Industrial Mecanum Wheel Set (4-Pack)",
            href: "/products/mobility-systems/ind-mob-mecanum-heavy",
            specHighlight: "Wheel Set Load: Up to 4,000 kg | Wheel Diameter: Ø250 - Ø305 mm",
            verificationStatus: "verified",
            lineId: "mobility-systems",
          },
          {
            id: "ind-mob-mecanum-compact",
            name: "Compact Agile Mecanum Wheel (Ø152mm)",
            href: "/products/mobility-systems/ind-mob-mecanum-compact",
            specHighlight: "Diameter: Ø152 mm (6 inches) | Load / Wheel: 250 kg",
            verificationStatus: "verified",
            lineId: "mobility-systems",
          },
          {
            id: "ind-mob-omni-dual-plate",
            name: "Transverse Roller Dual-Plate Omni Wheel",
            href: "/products/mobility-systems/ind-mob-omni-dual-plate",
            specHighlight: "Diameter: Ø100 - Ø200 mm | Load Capacity: 150 - 500 kg / wheel",
            verificationStatus: "verified",
            lineId: "mobility-systems",
          },
          {
            id: "ind-mob-omni-precision-al",
            name: "High-Precision 7075 Aluminum Hub Omni Wheel",
            href: "/products/mobility-systems/ind-mob-omni-precision-al",
            specHighlight: "Material: 7075-T6 Aircraft Billet | Diameter: Ø160 mm",
            verificationStatus: "verified",
            lineId: "mobility-systems",
          },
          {
            id: "ind-mob-omni-suspended",
            name: "Heavy-Duty Sprung Suspended Omni Castor",
            href: "/products/mobility-systems/ind-mob-omni-suspended",
            specHighlight: "Preload Travel: 25 mm dynamic stroke | Rated Load: 1,000 kg",
            verificationStatus: "verified",
            lineId: "mobility-systems",
          },
        ],
      },
      {
        groupName: "Steering Swerve & Suspension Modules",
        technologyDescription: "Steering Swerve & Suspension Modules for industrial automation & robotics",
        items: [
          {
            id: "ind-mob-swerve-steer",
            name: "Coaxial Dual-Axis Swerve Steer Drive Module",
            href: "/products/mobility-systems/ind-mob-swerve-steer",
            specHighlight: "Steer Range: Continuous 360° | Traction Power: 1.5 kW (48V DC)",
            verificationStatus: "verified",
            lineId: "mobility-systems",
          },
          {
            id: "ind-mob-dual-wheel-castor",
            name: "Dual-Wheel Active Steering Castor Unit",
            href: "/products/mobility-systems/ind-mob-dual-wheel-castor",
            specHighlight: "Configuration: Twin wheels with differential | Tire Contact Area: +85% vs single wheel",
            verificationStatus: "verified",
            lineId: "mobility-systems",
          },
          {
            id: "ind-mob-suspension-rocker",
            name: "Independent Articulated Rocker Suspension Bogie",
            href: "/products/mobility-systems/ind-mob-suspension-rocker",
            specHighlight: "Articulation: ±12° vertical deflection | Load Equalization: 50% / 50% dynamic balance",
            verificationStatus: "verified",
            lineId: "mobility-systems",
          },
          {
            id: "ind-mob-steering-hub",
            name: "Integrated Absolute Steer Encoder Bearing Hub",
            href: "/products/mobility-systems/ind-mob-steering-hub",
            specHighlight: "Resolution: 19-bit True Absolute | Center Bore: Ø50 - Ø120 mm",
            verificationStatus: "verified",
            lineId: "mobility-systems",
          },
          {
            id: "ind-mob-leveling-suspension",
            name: "Hydraulic / Electro-Mechanical Self-Leveling Strut",
            href: "/products/mobility-systems/ind-mob-leveling-suspension",
            specHighlight: "Stroke: 100 mm | Leveling Force: 15,000 N per strut",
            verificationStatus: "verified",
            lineId: "mobility-systems",
          },
        ],
      },
      {
        groupName: "Autonomous Mobile Chassis & Attachments",
        technologyDescription: "Autonomous Mobile Chassis & Attachments for industrial automation & robotics",
        items: [
          {
            id: "ind-mob-chassis-amr-500",
            name: "500kg Omnidirectional AMR Mobile Chassis Platform",
            href: "/products/mobility-systems/ind-mob-chassis-amr-500",
            specHighlight: "Payload: 500 kg | Dimensions: 800 x 600 x 280 mm",
            verificationStatus: "verified",
            lineId: "mobility-systems",
          },
          {
            id: "ind-mob-lift-scissor",
            name: "Electric Scissor Pallet Lift Module (1200kg)",
            href: "/products/mobility-systems/ind-mob-lift-scissor",
            specHighlight: "Lift Capacity: 1,200 kg | Lift Height: 120 mm",
            verificationStatus: "verified",
            lineId: "mobility-systems",
          },
          {
            id: "ind-mob-conveyor-top",
            name: "Powered Roller Top-Deck AMR Transfer Module",
            href: "/products/mobility-systems/ind-mob-conveyor-top",
            specHighlight: "Roller Width: 450 - 650 mm | Speed: 0.2 - 1.5 m/s",
            verificationStatus: "verified",
            lineId: "mobility-systems",
          },
          {
            id: "ind-mob-charging-inductive",
            name: "10kW Industrial Inductive Wireless Charging System",
            href: "/products/mobility-systems/ind-mob-charging-inductive",
            specHighlight: "Power: 10 kW Continuous | Efficiency: 93% across air gap",
            verificationStatus: "verified",
            lineId: "mobility-systems",
          },
          {
            id: "ind-mob-nav-autonomous-kit",
            name: "Autonomous Navigation Hardware Core (LiDAR + SLAM)",
            href: "/products/mobility-systems/ind-mob-nav-autonomous-kit",
            specHighlight: "Range: 30 meters radius | Localization Accuracy: ±5 mm / ±0.1°",
            verificationStatus: "verified",
            lineId: "mobility-systems",
          },
        ],
      },
    ],
    relatedApplications: [
      {
            "name": "Warehouse Logistics & Intralogistics",
            "href": "/applications/logistics"
      },
      {
            "name": "Cleanroom Wafer Cassette AGV",
            "href": "/applications/semiconductor"
      },
      {
            "name": "Automotive Powertrain Tow Tuggers",
            "href": "/applications/automotive"
      }
],
    engineeringTools: [
      {
            "name": "AGV Traction Torque Sizing",
            "href": "/technology/calculators",
            "badge": "Drive Sizing"
      },
      {
            "name": "Omnidirectional Kinematics Guide",
            "href": "/technology/motion-control",
            "badge": "Engineering"
      }
],
  },
  {
    id: "control-drives",
    title: "Control & Drives",
    shortTitle: "Control",
    subtitle: "Real-time IPC masters, multi-axis servo drives, safe motion, and fieldbus nodes",
    description: "Real-time industrial IPC motion controllers, synchronized multi-axis servo drives, Safe Motion architectures, and fieldbus interfaces.",
    engineeringStandard: "IEC 61800-5-2 / IEC 61131-3",
    primaryRoute: "/products/control-drives",
    rangeCountBadge: "20 Verified Ranges",
    enquiryActionLabel: "Request Motion Architecture & Drive Consultation",
    groups: [
      {
        groupName: "Multi-Axis Robot Motion Controllers",
        technologyDescription: "Multi-Axis Robot Motion Controllers for industrial automation & robotics",
        items: [
          {
            id: "ind-ctl-ipc-realtime-master",
            name: "High-Performance Industrial PC (IPC) Robot Controller",
            href: "/products/control-drives/ind-ctl-ipc-realtime-master",
            specHighlight: "CPU: Intel Core i7 12-Core / 24-Thread | Cycle Time: 250 µs synchronous",
            verificationStatus: "verified",
            lineId: "robot-controllers",
          },
          {
            id: "ind-ctl-din-rail-embedded-motion",
            name: "Micro-Footprint DIN-Rail Embedded Motion Controller",
            href: "/products/control-drives/ind-ctl-din-rail-embedded-motion",
            specHighlight: "Axes: 4 - 8 Stepper/Servo Axes | Enclosure: 35 mm DIN-rail mount",
            verificationStatus: "verified",
            lineId: "robot-controllers",
          },
          {
            id: "ind-ctl-6axis-pendant-cabinet",
            name: "6-Axis Articulated Robot Controller Cabinet with Teach Pendant",
            href: "/products/control-drives/ind-ctl-6axis-pendant-cabinet",
            specHighlight: "Pendant: 10.1\" IPS Touchscreen with physical E-Stop & Deadman | Safety Rating: ISO 13849-1 Cat 4 / PLe",
            verificationStatus: "verified",
            lineId: "robot-controllers",
          },
          {
            id: "ind-ctl-open-ros2-controller",
            name: "Open-Architecture ROS 2 / C++ Robotic Controller Board",
            href: "/products/control-drives/ind-ctl-open-ros2-controller",
            specHighlight: "API Latency: < 100 µs user-space to motor drive | Interfaces: Dual EtherCAT Master, 4x CAN-FD, 4x GigE Vision",
            verificationStatus: "verified",
            lineId: "robot-controllers",
          },
          {
            id: "ind-ctl-cnc-gcode-camming",
            name: "Multi-Axis CNC G-Code & Electronic Camming Controller",
            href: "/products/control-drives/ind-ctl-cnc-gcode-camming",
            specHighlight: "Look-Ahead: 1,024 blocks ahead | Path Interpolation: 3D Spline & NURBS (Nano-smoothing)",
            verificationStatus: "verified",
            lineId: "robot-controllers",
          },
        ],
      },
      {
        groupName: "Synchronized Kinematics & AMR Cores",
        technologyDescription: "Synchronized Kinematics & AMR Cores for industrial automation & robotics",
        items: [
          {
            id: "ind-ctl-amr-fleet-gateway",
            name: "Autonomous Mobile Robot (AMR) Navigation & Fleet Gateway",
            href: "/products/control-drives/ind-ctl-amr-fleet-gateway",
            specHighlight: "Fleet Standard: VDA 5050 v2.0 Compliant | Navigation: LiDAR / Vision Natural Feature SLAM",
            verificationStatus: "verified",
            lineId: "robot-controllers",
          },
          {
            id: "ind-ctl-64axis-ethercat-motion",
            name: "64-Axis Deterministic EtherCAT Motion Controller",
            href: "/products/control-drives/ind-ctl-64axis-ethercat-motion",
            specHighlight: "Coordinated Axes: Up to 64 physical axes | Cycle Rate: 1.0 ms (64 axes) / 250 µs (16 axes)",
            verificationStatus: "verified",
            lineId: "robot-controllers",
          },
          {
            id: "ind-ctl-delta-packaging-kinematics",
            name: "High-Speed Delta & Parallel Kinematics Motion Controller",
            href: "/products/control-drives/ind-ctl-delta-packaging-kinematics",
            specHighlight: "Pick Rate: Up to 200 picks/min | Conveyor Tracking: Up to 4 simultaneous moving belts",
            verificationStatus: "verified",
            lineId: "robot-controllers",
          },
          {
            id: "ind-ctl-multi-robot-synchronized",
            name: "Multi-Robot Synchronized Workcell Workgroup Controller",
            href: "/products/control-drives/ind-ctl-multi-robot-synchronized",
            specHighlight: "Synchronized Robots: Up to 4 arms (24 axes total) | Relative Tool Accuracy: ±0.05 mm during coordinated moves",
            verificationStatus: "verified",
            lineId: "robot-controllers",
          },
          {
            id: "ind-ctl-vgr-integrated-engine",
            name: "Vision-Guided Robotics (VGR) Integrated Motion Engine",
            href: "/products/control-drives/ind-ctl-vgr-integrated-engine",
            specHighlight: "Latency: < 12 ms visual feedback loop | Calibration: Automated 6-DOF Hand-Eye Calibration",
            verificationStatus: "verified",
            lineId: "robot-controllers",
          },
        ],
      },
      {
        groupName: "AC & Low-Voltage DC Servo Drives",
        technologyDescription: "AC & Low-Voltage DC Servo Drives for industrial automation & robotics",
        items: [
          {
            id: "ind-drv-compact-48v-cobot",
            name: "Ultra-Compact Low-Voltage DC Servo Drive (12 - 60V DC)",
            href: "/products/control-drives/ind-drv-compact-48v-cobot",
            specHighlight: "Input Voltage: 12 - 60V DC (Battery compatible) | Continuous Current: 15 - 30A RMS",
            verificationStatus: "verified",
            lineId: "servo-drives",
          },
          {
            id: "ind-drv-400v-multi-axis-shared-bus",
            name: "Multi-Axis High-Voltage AC Servo System with Common DC Bus",
            href: "/products/control-drives/ind-drv-400v-multi-axis-shared-bus",
            specHighlight: "AC Supply: 3-Phase 380 - 480V AC | DC Bus: 650V DC Shared",
            verificationStatus: "verified",
            lineId: "servo-drives",
          },
          {
            id: "ind-drv-high-resolution-analog-interface",
            name: "Ultra-Fast Analog Torque / Velocity Commanded Servo Drive",
            href: "/products/control-drives/ind-drv-high-resolution-analog-interface",
            specHighlight: "Command Input: ±10V Differential Analog (16-bit ADC) | Step Response: < 0.5 ms to 90% torque",
            verificationStatus: "verified",
            lineId: "servo-drives",
          },
          {
            id: "ind-drv-integrated-cobot-joint-dual",
            name: "Dual-Axis Integrated Cobot Joint Servo Drive Board",
            href: "/products/control-drives/ind-drv-integrated-cobot-joint-dual",
            specHighlight: "Channels: 2 Independent BLDC/PMSM Axes | Dimensions: Circular Ø 65 mm x 15 mm height",
            verificationStatus: "verified",
            lineId: "servo-drives",
          },
          {
            id: "ind-drv-sic-wide-bandgap",
            name: "Silicon Carbide (SiC) High-Frequency Inverter Servo Drive",
            href: "/products/control-drives/ind-drv-sic-wide-bandgap",
            specHighlight: "PWM Switching: Up to 100 kHz | Efficiency: > 98.5%",
            verificationStatus: "verified",
            lineId: "servo-drives",
          },
        ],
      },
      {
        groupName: "Safe Motion & Specialized Amplifiers",
        technologyDescription: "Safe Motion & Specialized Amplifiers for industrial automation & robotics",
        items: [
          {
            id: "ind-drv-fsoe-safety-drive",
            name: "Dual-Channel Functional Safety Servo Drive (FSoE / PROFIsafe)",
            href: "/products/control-drives/ind-drv-fsoe-safety-drive",
            specHighlight: "Safety Integrity: SIL 3 (IEC 62061) / PLe Cat 4 (ISO 13849-1) | Safe Functions: STO, SS1, SS2, SLS, SLP, SDI, SBC",
            verificationStatus: "verified",
            lineId: "servo-drives",
          },
          {
            id: "ind-drv-motor-mounted-ip65",
            name: "Decentralized Motor-Mounted IP65 Servo Drive",
            href: "/products/control-drives/ind-drv-motor-mounted-ip65",
            specHighlight: "Protection: IP65 / IP67 Sealed | Power Range: 250W - 3 kW",
            verificationStatus: "verified",
            lineId: "servo-drives",
          },
          {
            id: "ind-drv-direct-drive-torque-amp",
            name: "High-Peak-Current Direct-Drive Torque Motor Amplifier",
            href: "/products/control-drives/ind-drv-direct-drive-torque-amp",
            specHighlight: "Continuous Current: 30 - 60A RMS | Peak Current: 90 - 150A RMS",
            verificationStatus: "verified",
            lineId: "servo-drives",
          },
          {
            id: "ind-drv-linear-motor-dual-encoder",
            name: "Dual-Encoder Feedback Linear Motor Servo Amplifier",
            href: "/products/control-drives/ind-drv-linear-motor-dual-encoder",
            specHighlight: "Encoder Inputs: Dual 1Vpp / EnDat / BiSS-C inputs | Gantry Sync: Sub-micron master-slave skew compensation",
            verificationStatus: "verified",
            lineId: "servo-drives",
          },
          {
            id: "ind-drv-active-brake-regen-unit",
            name: "Active Regenerative Line Braking & Power Quality Unit",
            href: "/products/control-drives/ind-drv-active-brake-regen-unit",
            specHighlight: "Regen Power: 15 - 120 kW continuous | Grid Feedback THD: < 3% (Complies with IEEE 519)",
            verificationStatus: "verified",
            lineId: "servo-drives",
          },
        ],
      },
    ],
    relatedApplications: [
      {
            "name": "Multi-Robot Synchronization",
            "href": "/applications/automotive"
      },
      {
            "name": "High-Speed Delta Sortation",
            "href": "/applications/packaging"
      },
      {
            "name": "Precision Laser Micromachining",
            "href": "/applications/electronics"
      }
],
    engineeringTools: [
      {
            "name": "EtherCAT Cycle-Time Analyzer",
            "href": "/technology/motion-control",
            "badge": "Real-Time"
      },
      {
            "name": "Servo Loop Bandwidth Calculator",
            "href": "/technology/calculators",
            "badge": "Control Theory"
      }
],
  },
  {
    id: "sensing-vision",
    title: "Sensing & Vision",
    shortTitle: "Sensing",
    subtitle: "Precision encoders, 6-DoF force/torque sensors, 3D vision systems, and AI inspection",
    description: "Sub-micron optical and inductive encoders, 6-DoF force/torque feedback sensors, 3D structured-light vision cameras, and smart edge sensors.",
    engineeringStandard: "ISO 13849-1 / IEC 62061",
    primaryRoute: "/products/sensing-vision",
    rangeCountBadge: "20 Verified Ranges",
    enquiryActionLabel: "Request Sensor & Vision Metrology Support",
    groups: [
      {
        groupName: "Rotary & Linear Encoders",
        technologyDescription: "Rotary & Linear Encoders for industrial automation & robotics",
        items: [
          {
            id: "ind-sen-opt-hollow-24bit",
            name: "24-Bit Hollow-Shaft Optical Absolute Rotary Encoder",
            href: "/products/sensing-vision/ind-sen-opt-hollow-24bit",
            specHighlight: "Resolution: 24-bit Singleturn + 16-bit Multiturn | Hollow Bore: 30 - 80 mm",
            verificationStatus: "verified",
            lineId: "sensors-encoders",
          },
          {
            id: "ind-sen-dual-track-inductive-kit",
            name: "Dual-Track Inductive Absolute Joint Kit Encoder",
            href: "/products/sensing-vision/ind-sen-dual-track-inductive-kit",
            specHighlight: "Thickness: 6.8 mm | Resolution: 19 - 21 bits",
            verificationStatus: "verified",
            lineId: "sensors-encoders",
          },
          {
            id: "ind-sen-heavy-magnetic-multiturn",
            name: "IP67 Heavy-Duty Magnetic Absolute Multiturn Encoder",
            href: "/products/sensing-vision/ind-sen-heavy-magnetic-multiturn",
            specHighlight: "Multiturn System: Wiegand Wire (Zero battery maintenance) | Protection: IP67 / IP69K",
            verificationStatus: "verified",
            lineId: "sensors-encoders",
          },
          {
            id: "ind-sen-resolver-commutation-heavy",
            name: "High-Temperature Frameless Brushless Resolver",
            href: "/products/sensing-vision/ind-sen-resolver-commutation-heavy",
            specHighlight: "Temperature Rating: -55°C to +155°C | Radiation Tolerance: > 10^7 Rads",
            verificationStatus: "verified",
            lineId: "sensors-encoders",
          },
          {
            id: "ind-sen-linear-glass-scale",
            name: "High-Accuracy Optical Linear Glass Scale",
            href: "/products/sensing-vision/ind-sen-linear-glass-scale",
            specHighlight: "Accuracy Grade: ±3 µm / meter | Resolution: Down to 1 nm",
            verificationStatus: "verified",
            lineId: "sensors-encoders",
          },
        ],
      },
      {
        groupName: "Force/Torque & Industrial Proximity",
        technologyDescription: "Force/Torque & Industrial Proximity for industrial automation & robotics",
        items: [
          {
            id: "ind-sen-6dof-wrist-ft-sensor",
            name: "6-Axis Force-Torque Wrist Sensor (Fx, Fy, Fz, Mx, My, Mz)",
            href: "/products/sensing-vision/ind-sen-6dof-wrist-ft-sensor",
            specHighlight: "Force Range: ±150 N to ±1,500 N | Torque Range: ±10 Nm to ±120 Nm",
            verificationStatus: "verified",
            lineId: "sensors-encoders",
          },
          {
            id: "ind-sen-joint-torque-spoke-sensor",
            name: "Integrated Robot Joint Torque Sensor Ring",
            href: "/products/sensing-vision/ind-sen-joint-torque-spoke-sensor",
            specHighlight: "Nominal Torque: 20 - 350 Nm | Linearity: ±0.1% Full Scale",
            verificationStatus: "verified",
            lineId: "sensors-encoders",
          },
          {
            id: "ind-sen-dynamic-piezo-force-sensor",
            name: "High-Bandwidth Piezoelectric Dynamic Force Ring",
            href: "/products/sensing-vision/ind-sen-dynamic-piezo-force-sensor",
            specHighlight: "Rigidity: High (> 1,000 N/µm) | Resonant Frequency: 65 kHz",
            verificationStatus: "verified",
            lineId: "sensors-encoders",
          },
          {
            id: "ind-sen-tactile-matrix-fingertip",
            name: "High-Density Piezoresistive Tactile Sensor Array",
            href: "/products/sensing-vision/ind-sen-tactile-matrix-fingertip",
            specHighlight: "Taxel Resolution: 2.0 mm grid pitch (64 taxels/pad) | Force Sensitivity: 0.01 - 15 N",
            verificationStatus: "verified",
            lineId: "sensors-encoders",
          },
          {
            id: "ind-sen-weld-immune-inductive",
            name: "High-Pressure Weld-Field Immune Inductive Proximity Sensor",
            href: "/products/sensing-vision/ind-sen-weld-immune-inductive",
            specHighlight: "Operating Field Immunity: Immune to 250 mT (no false trips during weld pulse) | Sensing Distance: 2 - 15 mm",
            verificationStatus: "verified",
            lineId: "sensors-encoders",
          },
        ],
      },
      {
        groupName: "3D Vision & Spatial Perception",
        technologyDescription: "3D Vision & Spatial Perception for industrial automation & robotics",
        items: [
          {
            id: "ind-vis-3d-structured-light-binpicker",
            name: "High-Resolution 3D Structured-Light Stereo Depth Camera",
            href: "/products/sensing-vision/ind-vis-3d-structured-light-binpicker",
            specHighlight: "Working Distance: 600 - 2,500 mm | Z-Resolution: 0.05 mm @ 1m",
            verificationStatus: "verified",
            lineId: "machine-vision",
          },
          {
            id: "ind-vis-3d-tof-camera",
            name: "Industrial Time-of-Flight (ToF) 3D Area Camera",
            href: "/products/sensing-vision/ind-vis-3d-tof-camera",
            specHighlight: "Range: 0.3 - 8.0 m | Frame Rate: 60 FPS (real-time depth)",
            verificationStatus: "verified",
            lineId: "machine-vision",
          },
          {
            id: "ind-vis-3d-flash-lidar",
            name: "Solid-State 3D Flash LiDAR Spatial Mapping Sensor",
            href: "/products/sensing-vision/ind-vis-3d-flash-lidar",
            specHighlight: "Points Per Second: 750,000 points/sec | Range: 0.1 - 40 m",
            verificationStatus: "verified",
            lineId: "machine-vision",
          },
          {
            id: "ind-vis-77ghz-industrial-radar",
            name: "77 GHz FMCW Industrial Radar Perception Sensor",
            href: "/products/sensing-vision/ind-vis-77ghz-industrial-radar",
            specHighlight: "Frequency Band: 76 - 81 GHz | Operating Range: 0.2 - 100 m",
            verificationStatus: "verified",
            lineId: "machine-vision",
          },
          {
            id: "ind-vis-telecentric-metrology-lens",
            name: "Bilateral Telecentric Optical Metrology Lens",
            href: "/products/sensing-vision/ind-vis-telecentric-metrology-lens",
            specHighlight: "Telecentricity Error: < 0.02° | Distortion: < 0.03%",
            verificationStatus: "verified",
            lineId: "machine-vision",
          },
        ],
      },
      {
        groupName: "2D Inspection & Smart Edge Sensors",
        technologyDescription: "2D Inspection & Smart Edge Sensors for industrial automation & robotics",
        items: [
          {
            id: "ind-vis-2d-gige-pregius",
            name: "High-Resolution 2D GigE Area-Scan Industrial Camera",
            href: "/products/sensing-vision/ind-vis-2d-gige-pregius",
            specHighlight: "Resolution: 5.1 MP - 31.4 MP | Sensor Type: Global Shutter CMOS",
            verificationStatus: "verified",
            lineId: "machine-vision",
          },
          {
            id: "ind-vis-4k-linescan-camera",
            name: "High-Speed 4K / 8K Line-Scan Industrial Camera",
            href: "/products/sensing-vision/ind-vis-4k-linescan-camera",
            specHighlight: "Line Rate: Up to 140 kHz | Pixel Count: 4,096 - 16,384 pixels",
            verificationStatus: "verified",
            lineId: "machine-vision",
          },
          {
            id: "ind-vis-swir-infrared-camera",
            name: "Short-Wave Infrared (SWIR) InGaAs Inspection Camera",
            href: "/products/sensing-vision/ind-vis-swir-infrared-camera",
            specHighlight: "Spectral Band: 0.9 - 1.7 µm (SWIR) | Resolution: 640 x 512 / 1280 x 1024",
            verificationStatus: "verified",
            lineId: "machine-vision",
          },
          {
            id: "ind-vis-embedded-ai-smart-camera",
            name: "Edge AI Embedded Smart Vision Sensor with NPU",
            href: "/products/sensing-vision/ind-vis-embedded-ai-smart-camera",
            specHighlight: "AI Acceleration: 6 TOPS dedicated NPU | Lens: Integrated Liquid Lens (Fast Autofocus)",
            verificationStatus: "verified",
            lineId: "machine-vision",
          },
          {
            id: "ind-vis-barcode-ocr-vision-reader",
            name: "High-Speed Direct Part Mark (DPM) 2D Barcode & OCR Reader",
            href: "/products/sensing-vision/ind-vis-barcode-ocr-vision-reader",
            specHighlight: "Decode Rate: Up to 90 reads/sec | Code Types: DataMatrix, QR, DotCode, OCR-A/B",
            verificationStatus: "verified",
            lineId: "machine-vision",
          },
        ],
      },
    ],
    relatedApplications: [
      {
            "name": "Random Bin Picking with 3D Vision",
            "href": "/applications/automotive"
      },
      {
            "name": "Sub-Micron Semiconductor Inspection",
            "href": "/applications/semiconductor"
      },
      {
            "name": "Collaborative Force-Guided Assembly",
            "href": "/applications/electronics"
      }
],
    engineeringTools: [
      {
            "name": "Field-of-View & Lens Calculator",
            "href": "/technology/calculators",
            "badge": "Optics"
      },
      {
            "name": "Force/Torque Sensor Sizing Matrix",
            "href": "/technology/sensors",
            "badge": "Instrumentation"
      }
],
  },
  {
    id: "end-effectors",
    title: "End Effectors & Tooling",
    shortTitle: "Tooling",
    subtitle: "Servo grippers, vacuum handling, automatic tool changers, and process spindles",
    description: "Electric parallel and centric grippers, high-flow vacuum handling tools, robotic welding guns, deburring spindles, and automatic tool changers.",
    engineeringStandard: "ISO 9409-1 / EN 60204-1",
    primaryRoute: "/products/end-effectors",
    rangeCountBadge: "20 Verified Ranges",
    enquiryActionLabel: "Request End Effector Tooling Consultation",
    groups: [
      {
        groupName: "Electric Precision Grippers",
        technologyDescription: "Electric Precision Grippers for industrial automation & robotics",
        items: [
          {
            id: "ind-ee-parallel-servo-gripper",
            name: "Precision 2-Finger Parallel Electric Servo Gripper",
            href: "/products/end-effectors/ind-ee-parallel-servo-gripper",
            specHighlight: "Grip Force: 5 - 250 N (programmable ±1 N) | Stroke: 30 - 120 mm",
            verificationStatus: "verified",
            lineId: "end-effectors",
          },
          {
            id: "ind-ee-3finger-centric-chuck",
            name: "3-Finger Concentric Self-Centering Gripper",
            href: "/products/end-effectors/ind-ee-3finger-centric-chuck",
            specHighlight: "Centering Repeatability: ±0.008 mm | Clamping Force: 1,500 - 18,000 N",
            verificationStatus: "verified",
            lineId: "end-effectors",
          },
          {
            id: "ind-ee-5finger-dexterous-hand",
            name: "Anthropomorphic 5-Finger Dexterous Robotic Hand",
            href: "/products/end-effectors/ind-ee-5finger-dexterous-hand",
            specHighlight: "Degrees of Freedom: 16 Active + 4 Passive | Fingertip Force: 25 N per finger",
            verificationStatus: "verified",
            lineId: "end-effectors",
          },
          {
            id: "ind-ee-soft-bionic-silicone-gripper",
            name: "Bionic Soft Silicone Fluidic PneuNet Gripper",
            href: "/products/end-effectors/ind-ee-soft-bionic-silicone-gripper",
            specHighlight: "Food Contact: FDA 21 CFR Compliant | Finger Count: 2, 3, or 4 bionic digits",
            verificationStatus: "verified",
            lineId: "end-effectors",
          },
          {
            id: "ind-ee-pneumatic-expanding-mandrel",
            name: "Internal Pneumatic Expanding Mandrel Coil Gripper",
            href: "/products/end-effectors/ind-ee-pneumatic-expanding-mandrel",
            specHighlight: "Core Diameters: 50 - 300 mm | Grip Force: Up to 8,500 N radial",
            verificationStatus: "verified",
            lineId: "end-effectors",
          },
        ],
      },
      {
        groupName: "Vacuum & Non-Contact Handling",
        technologyDescription: "Vacuum & Non-Contact Handling for industrial automation & robotics",
        items: [
          {
            id: "ind-ee-vacuum-bernoulli-gripper",
            name: "Bernoulli Non-Contact Wafer & Glass Gripper",
            href: "/products/end-effectors/ind-ee-vacuum-bernoulli-gripper",
            specHighlight: "Contact Area: Zero on active surface | Air Gap: 0.8 ± 0.2 mm",
            verificationStatus: "verified",
            lineId: "end-effectors",
          },
          {
            id: "ind-ee-electrostatic-soft-gripper",
            name: "Electroadhesion Soft Gripper for Flexible Materials",
            href: "/products/end-effectors/ind-ee-electrostatic-soft-gripper",
            specHighlight: "Adhesion Pressure: 0.8 - 3.5 N/cm² | Release Latency: < 30 ms",
            verificationStatus: "verified",
            lineId: "end-effectors",
          },
          {
            id: "ind-ee-permanent-electro-magnet",
            name: "Permanent-Electro Magnetic Gripper",
            href: "/products/end-effectors/ind-ee-permanent-electro-magnet",
            specHighlight: "Holding Force: 2,000 - 45,000 N | Power Pulse: 500 ms switch time (0W static power)",
            verificationStatus: "verified",
            lineId: "end-effectors",
          },
          {
            id: "ind-ee-needle-porous-gripper",
            name: "Pneumatic Interlocking Needle Gripper for Porous Media",
            href: "/products/end-effectors/ind-ee-needle-porous-gripper",
            specHighlight: "Needle Penetration: Adjustable 0.5 - 15 mm | Needle Count: 8 - 32 needles per module",
            verificationStatus: "verified",
            lineId: "end-effectors",
          },
          {
            id: "ind-ee-cryo-specimen-vane",
            name: "Cryogenic Specimen High-Vacuum Cold Vane Gripper",
            href: "/products/end-effectors/ind-ee-cryo-specimen-vane",
            specHighlight: "Temperature Range: 77 K to 420 K | Vacuum Rating: 10^-10 Torr (UHV)",
            verificationStatus: "verified",
            lineId: "end-effectors",
          },
        ],
      },
      {
        groupName: "Welding, Cutting & Process Tooling",
        technologyDescription: "Welding, Cutting & Process Tooling for industrial automation & robotics",
        items: [
          {
            id: "ind-ee-spot-weld-servo-gun",
            name: "Integrated Lightweight Servo Spot-Welding Gun (X / C Type)",
            href: "/products/end-effectors/ind-ee-spot-weld-servo-gun",
            specHighlight: "Weld Force: 1.5 - 8.0 kN ±2% | Gun Weight: 72 kg",
            verificationStatus: "verified",
            lineId: "end-effectors",
          },
          {
            id: "ind-ee-laser-seam-tracker-head",
            name: "Laser Seam Tracking & Optical Welding Head",
            href: "/products/end-effectors/ind-ee-laser-seam-tracker-head",
            specHighlight: "Measurement Frequency: 100 - 500 Hz | Gap Width Detection: 0.1 - 10 mm",
            verificationStatus: "verified",
            lineId: "end-effectors",
          },
          {
            id: "ind-ee-ultrasonic-cutting-sonotrode",
            name: "Robotic 35 kHz Ultrasonic Cutting Sonotrode Tool",
            href: "/products/end-effectors/ind-ee-ultrasonic-cutting-sonotrode",
            specHighlight: "Frequency: 35 kHz ± 500 Hz | Amplitude: 60 µm peak-to-peak",
            verificationStatus: "verified",
            lineId: "end-effectors",
          },
          {
            id: "ind-ee-laser-cutting-slitting-head",
            name: "Fiber Laser 3D Profile Cutting Head with Capacitive Height Sensor",
            href: "/products/end-effectors/ind-ee-laser-cutting-slitting-head",
            specHighlight: "Laser Power: Up to 6 kW | Standoff Accuracy: ±0.02 mm at 1.5 m/s",
            verificationStatus: "verified",
            lineId: "end-effectors",
          },
          {
            id: "ind-ee-blind-riveting-end-effector",
            name: "Robotic Blind Rivet & Structural Fastener Head",
            href: "/products/end-effectors/ind-ee-blind-riveting-end-effector",
            specHighlight: "Pulling Force: 5 - 28 kN | Rivet Diameter: 3.2 - 6.4 mm",
            verificationStatus: "verified",
            lineId: "end-effectors",
          },
        ],
      },
      {
        groupName: "Tool Changers & Material Dispensing",
        technologyDescription: "Tool Changers & Material Dispensing for industrial automation & robotics",
        items: [
          {
            id: "ind-ee-auto-tool-changer-heavy",
            name: "Automatic Robot Tool Changer (ISO 9409-1 Flange)",
            href: "/products/end-effectors/ind-ee-auto-tool-changer-heavy",
            specHighlight: "Payload Class: 150 - 1,200 kg | Lock Repeatability: ±0.005 mm",
            verificationStatus: "verified",
            lineId: "end-effectors",
          },
          {
            id: "ind-ee-compliance-deburring-spindle",
            name: "Radial / Axial Compliance Robotic Deburring Spindle",
            href: "/products/end-effectors/ind-ee-compliance-deburring-spindle",
            specHighlight: "Spindle Speed: Up to 50,000 RPM | Compliance Force: 5 - 75 N (regulated via proportional air)",
            verificationStatus: "verified",
            lineId: "end-effectors",
          },
          {
            id: "ind-ee-screwdriving-auto-feeder",
            name: "Torque-Angle Monitored Automated Screwdriving Spindle",
            href: "/products/end-effectors/ind-ee-screwdriving-auto-feeder",
            specHighlight: "Torque Range: 0.2 - 60 Nm | Torque Accuracy: ±1.0% (Cm/Cmk > 1.67)",
            verificationStatus: "verified",
            lineId: "end-effectors",
          },
          {
            id: "ind-ee-hot-melt-micro-extruder",
            name: "High-Precision 3D Hot-Melt Adhesive Dispensing Extruder",
            href: "/products/end-effectors/ind-ee-hot-melt-micro-extruder",
            specHighlight: "Extrusion Temperature: Up to 230°C ±1°C | Flow Rate: 0.5 - 250 mL/min",
            verificationStatus: "verified",
            lineId: "end-effectors",
          },
          {
            id: "ind-ee-heavy-palletizing-fork",
            name: "Heavy-Duty Bag & Carton Palletizing Clamp Tool",
            href: "/products/end-effectors/ind-ee-heavy-palletizing-fork",
            specHighlight: "Payload: Up to 120 kg | Speed: Up to 1,400 bags/hour",
            verificationStatus: "verified",
            lineId: "end-effectors",
          },
        ],
      },
    ],
    relatedApplications: [
      {
            "name": "High-Volume Sheet Metal Stamping",
            "href": "/applications/automotive"
      },
      {
            "name": "Fragile Glass & Wafer Handling",
            "href": "/applications/electronics"
      },
      {
            "name": "Automated Robotic Deburring",
            "href": "/applications/metal-fabrication"
      }
],
    engineeringTools: [
      {
            "name": "Gripping Force & Friction Sizing",
            "href": "/technology/calculators",
            "badge": "Physics"
      },
      {
            "name": "Flange Standard Cross-Reference",
            "href": "/technology/engineering-portfolio",
            "badge": "ISO 9409"
      }
],
  },
  {
    id: "mechanical-components",
    title: "Mechanical Components",
    shortTitle: "Mechanical",
    subtitle: "Linear guides, precision ballscrews, crossed-roller bearings, and zero-backlash couplings",
    description: "C3/C5 ground ballscrews, caged roller linear guideways, precision crossed-roller bearings, disc couplings, and safety holding brakes.",
    engineeringStandard: "DIN 69051 / ISO 12090 / ISO 3408",
    primaryRoute: "/products/mechanical-components",
    rangeCountBadge: "20 Verified Ranges",
    enquiryActionLabel: "Request Mechanical Hardware Engineering Support",
    groups: [
      {
        groupName: "Linear Guidance & Drive Systems",
        technologyDescription: "Linear Guidance & Drive Systems for industrial automation & robotics",
        items: [
          {
            id: "ind-lin-ground-ballscrew-c3",
            name: "High-Precision Ground Ball Screw (C3 / C5 Class)",
            href: "/products/mechanical-components/ind-lin-ground-ballscrew-c3",
            specHighlight: "Lead Accuracy: C3 (±8 µm/300 mm) | Diameter: 16 - 63 mm",
            verificationStatus: "verified",
            lineId: "linear-motion",
          },
          {
            id: "ind-lin-roller-caged-guideway",
            name: "Ultra-High-Rigidity Cylindrical Roller Guideway",
            href: "/products/mechanical-components/ind-lin-roller-caged-guideway",
            specHighlight: "Elastic Deflection: 50% lower than ball rails | Dynamic Rating: 45 - 580 kN",
            verificationStatus: "verified",
            lineId: "linear-motion",
          },
          {
            id: "ind-lin-miniature-cross-roller-slide",
            name: "Miniature Cross-Roller Precision Linear Slide",
            href: "/products/mechanical-components/ind-lin-miniature-cross-roller-slide",
            specHighlight: "Straightness: 0.5 µm / 50 mm | Cage Design: Anti-cage creep rack pinion",
            verificationStatus: "verified",
            lineId: "linear-motion",
          },
          {
            id: "ind-lin-high-speed-roller-screw",
            name: "Planetary Roller Screw Actuator",
            href: "/products/mechanical-components/ind-lin-high-speed-roller-screw",
            specHighlight: "Peak Thrust: 25 - 350 kN | Acceleration: Up to 35 m/s²",
            verificationStatus: "verified",
            lineId: "linear-motion",
          },
          {
            id: "ind-lin-inverted-roller-actuator",
            name: "Inverted Roller Screw Integrated Actuator",
            href: "/products/mechanical-components/ind-lin-inverted-roller-actuator",
            specHighlight: "Stroke: 100 - 600 mm | Continuous Force: 8 - 80 kN",
            verificationStatus: "verified",
            lineId: "linear-motion",
          },
        ],
      },
      {
        groupName: "Linear Bearings & 7th-Axis Motion",
        technologyDescription: "Linear Bearings & 7th-Axis Motion for industrial automation & robotics",
        items: [
          {
            id: "ind-lin-helical-rack-pinion",
            name: "Ground Helical Rack and Pinion Drive Module",
            href: "/products/mechanical-components/ind-lin-helical-rack-pinion",
            specHighlight: "Module: M2, M3, M4, M5, M6, M8 | Total Pitch Error: < 12 µm / 1,000 mm",
            verificationStatus: "verified",
            lineId: "linear-motion",
          },
          {
            id: "ind-lin-recirculating-ball-rail",
            name: "Heavy-Duty Recirculating Ball Linear Guide",
            href: "/products/mechanical-components/ind-lin-recirculating-ball-rail",
            specHighlight: "Rail Width: 15 - 65 mm | Dynamic Load: 12 - 240 kN",
            verificationStatus: "verified",
            lineId: "linear-motion",
          },
          {
            id: "ind-lin-stainless-washdown-guide",
            name: "Corrosion-Proof 440C Stainless Linear Guide",
            href: "/products/mechanical-components/ind-lin-stainless-washdown-guide",
            specHighlight: "Material: AISI 440C Stainless Steel | Lubrication: NSF H1 Food-Grade Synthetic",
            verificationStatus: "verified",
            lineId: "linear-motion",
          },
          {
            id: "ind-lin-aerostatic-air-bearing-stage",
            name: "Porous Carbon Aerostatic Air Bearing Linear Stage",
            href: "/products/mechanical-components/ind-lin-aerostatic-air-bearing-stage",
            specHighlight: "Friction: Absolute Zero Static Friction | Straightness: < 0.1 µm / 100 mm",
            verificationStatus: "verified",
            lineId: "linear-motion",
          },
          {
            id: "ind-lin-telescopic-cantilever-axis",
            name: "Telescopic Dual-Stroke Linear Cantilever Axis",
            href: "/products/mechanical-components/ind-lin-telescopic-cantilever-axis",
            specHighlight: "Stroke: 800 - 2,200 mm | Take-Out Cycle: < 0.6 s",
            verificationStatus: "verified",
            lineId: "linear-motion",
          },
        ],
      },
      {
        groupName: "Precision Bearings & Slew Rings",
        technologyDescription: "Precision Bearings & Slew Rings for industrial automation & robotics",
        items: [
          {
            id: "ind-mec-crossed-roller-bearing",
            name: "High-Rigidity Preloaded Crossed-Roller Bearing (CRBH / RU Series)",
            href: "/products/mechanical-components/ind-mec-crossed-roller-bearing",
            specHighlight: "Roller Arrangement: 90° Cross-roller array | Runout Accuracy: P4 / P2 class (< 2.5 µm)",
            verificationStatus: "verified",
            lineId: "mechanical-transmission",
          },
          {
            id: "ind-mec-corrosion-proof-crossed-roller",
            name: "All-Stainless 316L Crossed-Roller Slewing Bearing",
            href: "/products/mechanical-components/ind-mec-corrosion-proof-crossed-roller",
            specHighlight: "Material: AISI 316L Stainless Steel + Si3N4 Ceramic Rollers | Corrosion Resistance: > 2,000 hrs salt spray",
            verificationStatus: "verified",
            lineId: "mechanical-transmission",
          },
          {
            id: "ind-mec-high-speed-angular-contact-set",
            name: "High-Precision Angular Contact Ball Bearing Sets (7000 / 7200 Series)",
            href: "/products/mechanical-components/ind-mec-high-speed-angular-contact-set",
            specHighlight: "Contact Angles: 15°, 25°, 40° | Precision Grade: P4 / P2 (ABEC 7/9)",
            verificationStatus: "verified",
            lineId: "mechanical-transmission",
          },
          {
            id: "ind-mec-slew-ring-bearing-geared",
            name: "Heavy-Duty Slew Ring Bearing with Integral Gear (External / Internal)",
            href: "/products/mechanical-components/ind-mec-slew-ring-bearing-geared",
            specHighlight: "Outer Diameter: Ø 500 - 3,500 mm | Axial Load: Up to 6,500 kN",
            verificationStatus: "verified",
            lineId: "mechanical-transmission",
          },
          {
            id: "ind-mec-ceramic-hybrid-spindle-bearing",
            name: "Ultra-High-Speed Ceramic Hybrid Spindle Bearings (Si3N4)",
            href: "/products/mechanical-components/ind-mec-ceramic-hybrid-spindle-bearing",
            specHighlight: "Max Speed Factor: 2.8 x 10^6 mm·RPM | Ball Material: Silicon Nitride Ceramic (Si3N4)",
            verificationStatus: "verified",
            lineId: "mechanical-transmission",
          },
        ],
      },
      {
        groupName: "Shaft Couplings & Torque Limiting",
        technologyDescription: "Shaft Couplings & Torque Limiting for industrial automation & robotics",
        items: [
          {
            id: "ind-mec-flexible-disc-pack",
            name: "Torsionally Stiff Double-Flex Disc Pack Coupling",
            href: "/products/mechanical-components/ind-mec-flexible-disc-pack",
            specHighlight: "Misalignment: Compensates up to 1.5° angular and 2 mm axial | Material: High-tensile 301 Stainless Disc Packs",
            verificationStatus: "verified",
            lineId: "mechanical-transmission",
          },
          {
            id: "ind-mec-curved-jaw-elastomer",
            name: "Vibration-Damping Backlash-Free Curved-Jaw Elastomer Coupling",
            href: "/products/mechanical-components/ind-mec-curved-jaw-elastomer",
            specHighlight: "Shore Hardness: 92 Sh-A (Damping) / 98 Sh-A (Stiffness) | Backlash: Zero under preloaded jaws",
            verificationStatus: "verified",
            lineId: "mechanical-transmission",
          },
          {
            id: "ind-mec-metal-bellows-coupling",
            name: "Zero-Backlash Stainless Steel Metal Bellows Coupling",
            href: "/products/mechanical-components/ind-mec-metal-bellows-coupling",
            specHighlight: "Torsional Backlash: Zero (Torsionally rigid) | Bellows: Multi-ply AISI 304 Stainless",
            verificationStatus: "verified",
            lineId: "mechanical-transmission",
          },
          {
            id: "ind-mec-power-off-safety-brake",
            name: "Electromagnetic Power-Off Spring-Applied Safety Brake",
            href: "/products/mechanical-components/ind-mec-power-off-safety-brake",
            specHighlight: "Holding Torque: 1.5 - 600 Nm | Engagement Time: < 18 ms with fast-switch circuit",
            verificationStatus: "verified",
            lineId: "mechanical-transmission",
          },
          {
            id: "ind-mec-ball-detent-torque-limiter",
            name: "Precision Ball-Detent Safety Torque Limiter Clutch",
            href: "/products/mechanical-components/ind-mec-ball-detent-torque-limiter",
            specHighlight: "Disengagement Time: < 2 ms upon overload | Setting Range: 2 - 5,000 Nm",
            verificationStatus: "verified",
            lineId: "mechanical-transmission",
          },
        ],
      },
    ],
    relatedApplications: [
      {
            "name": "Machine Tool Feed Axes",
            "href": "/applications/metal-fabrication"
      },
      {
            "name": "Gantry Pick-and-Place Systems",
            "href": "/applications/packaging"
      },
      {
            "name": "Aerospace Tooling Positioners",
            "href": "/applications/aerospace"
      }
],
    engineeringTools: [
      {
            "name": "Ballscrew Critical Speed & Buckling",
            "href": "/technology/calculators",
            "badge": "DIN 69051"
      },
      {
            "name": "Bearing L10h Fatigue Life Calculator",
            "href": "/technology/calculators",
            "badge": "ISO 281"
      }
],
  },
  {
    id: "safety-intelligent",
    title: "Safety & Intelligent Systems",
    shortTitle: "Safety",
    subtitle: "Safety laser scanners, Type 4 light curtains, modular safety PLCs, and edge IIoT gateways",
    description: "Dynamic safety laser area scanners, Type 4 light curtains, modular safety PLCs, TSN managed Ethernet switches, and industrial edge AI compute.",
    engineeringStandard: "ISO 13849-1 / IEC 61508 / IEC 62443",
    primaryRoute: "/products/safety-intelligent",
    rangeCountBadge: "20 Verified Ranges",
    enquiryActionLabel: "Request Safety Risk Assessment & Architecture Support",
    groups: [
      {
        groupName: "Optical Machine Safety & Scanners",
        technologyDescription: "Optical Machine Safety & Scanners for industrial automation & robotics",
        items: [
          {
            id: "ind-saf-laser-scanner-dynamic",
            name: "Safety Laser Area Scanner with Dynamic Field Switching (Type 3 / SIL 2 / PLd)",
            href: "/products/safety-intelligent/ind-saf-laser-scanner-dynamic",
            specHighlight: "Protective Range: 3.0 - 9.0 meters (70 mm object resolution) | Scanning Angle: 275°",
            verificationStatus: "verified",
            lineId: "robotics-safety",
          },
          {
            id: "ind-saf-light-curtain-type4",
            name: "Optical Safety Light Curtain (Type 4 / SIL 3 / PLe with Integrated Muting)",
            href: "/products/safety-intelligent/ind-saf-light-curtain-type4",
            specHighlight: "Resolution: 14 mm (Finger) / 30 mm (Hand) | Safety Level: Type 4 (IEC 61496-1) / PLe Cat 4 (ISO 13849-1)",
            verificationStatus: "verified",
            lineId: "robotics-safety",
          },
          {
            id: "ind-saf-safety-radar-barrier",
            name: "Industrial 60 GHz Safety Radar Presence Sensor (Immune to Dust & Sparks)",
            href: "/products/safety-intelligent/ind-saf-safety-radar-barrier",
            specHighlight: "Frequency: 60 GHz Millimeter Wave Radar | Safety Level: SIL 2 / PLd Category 3",
            verificationStatus: "verified",
            lineId: "robotics-safety",
          },
          {
            id: "ind-saf-overhead-tof-canopy",
            name: "Overhead 3D Volumetric Time-of-Flight Safety Protective Canopy",
            href: "/products/safety-intelligent/ind-saf-overhead-tof-canopy",
            specHighlight: "Monitored Volume: Up to 6 x 6 x 4 meters per sensor | Field Rate: 30 Hz 3D volume scan",
            verificationStatus: "verified",
            lineId: "robotics-safety",
          },
          {
            id: "ind-saf-heavy-safety-mat",
            name: "Heavy-Duty Pressure-Sensitive Industrial Safety Floor Mat",
            href: "/products/safety-intelligent/ind-saf-heavy-safety-mat",
            specHighlight: "Actuation Weight: > 35 kg foot point load | Drive-Over Resistance: Handles 5,000 kg forklift wheels",
            verificationStatus: "verified",
            lineId: "robotics-safety",
          },
        ],
      },
      {
        groupName: "Safety Controllers & Interlocks",
        technologyDescription: "Safety Controllers & Interlocks for industrial automation & robotics",
        items: [
          {
            id: "ind-saf-modular-safety-plc",
            name: "Modular Industrial Safety Integrated PLC Controller (FSoE Master)",
            href: "/products/safety-intelligent/ind-saf-modular-safety-plc",
            specHighlight: "Safety Standard: IEC 61508 SIL 3 / ISO 13849-1 PLe Cat 4 | Cycle Time: Safe logic cycle < 4 ms",
            verificationStatus: "verified",
            lineId: "robotics-safety",
          },
          {
            id: "ind-saf-rfid-door-interlock",
            name: "Non-Contact RFID Safety Door Interlock Switch (High Coding / PLe)",
            href: "/products/safety-intelligent/ind-saf-rfid-door-interlock",
            specHighlight: "Coding Level: High Coding (ISO 14119 Level 4) | Safety Rating: ISO 13849-1 PLe Cat 4 / SIL 3",
            verificationStatus: "verified",
            lineId: "robotics-safety",
          },
          {
            id: "ind-saf-safe-motion-monitoring-module",
            name: "Stand-Alone Safe Motion Speed & Position Monitoring Module",
            href: "/products/safety-intelligent/ind-saf-safe-motion-monitoring-module",
            specHighlight: "Safe Functions: SLS, SOS, SSM, SDI, SSR | Encoder Support: Dual Sin/Cos 1Vpp, TTL, HTL",
            verificationStatus: "verified",
            lineId: "robotics-safety",
          },
          {
            id: "ind-saf-force-guided-safety-relay",
            name: "Dual-Channel Safety Evaluation Relay with Force-Guided Contacts",
            href: "/products/safety-intelligent/ind-saf-force-guided-safety-relay",
            specHighlight: "Contacts: 3 Safe NO contacts + 1 Auxiliary NC contact | Safety Rating: PLe (ISO 13849-1) / SIL 3 (IEC 62061)",
            verificationStatus: "verified",
            lineId: "robotics-safety",
          },
          {
            id: "ind-saf-wireless-estop-pendant",
            name: "Wireless Industrial Emergency Stop & Jogging Pendant (SIL 3)",
            href: "/products/safety-intelligent/ind-saf-wireless-estop-pendant",
            specHighlight: "Wireless Protocol: 2.4 GHz FHSS Black Channel (SIL 3) | Safe Response: < 45 ms wireless stop",
            verificationStatus: "verified",
            lineId: "robotics-safety",
          },
        ],
      },
      {
        groupName: "Deterministic TSN & IIoT Gateways",
        technologyDescription: "Deterministic TSN & IIoT Gateways for industrial automation & robotics",
        items: [
          {
            id: "ind-net-tsn-managed-switch",
            name: "Time-Sensitive Networking (TSN) Managed Ethernet Switch",
            href: "/products/safety-intelligent/ind-net-tsn-managed-switch",
            specHighlight: "Ports: 8x 10/100/1000Base-T + 2x 10G SFP+ | Jitter: < 100 ns",
            verificationStatus: "verified",
            lineId: "networking-edge",
          },
          {
            id: "ind-net-io-link-master-ip67",
            name: "Machine-Mount IP67 IO-Link Master Block",
            href: "/products/safety-intelligent/ind-net-io-link-master-ip67",
            specHighlight: "Ports: 8x M12 IO-Link Master Ports | Class: 4x Class A + 4x Class B",
            verificationStatus: "verified",
            lineId: "networking-edge",
          },
          {
            id: "ind-net-opc-ua-tsn-edge-gateway",
            name: "OPC UA over TSN Industrial Edge Gateway",
            href: "/products/safety-intelligent/ind-net-opc-ua-tsn-edge-gateway",
            specHighlight: "Pub/Sub Rate: Up to 50,000 tags/sec | Security: X.509 certificate management",
            verificationStatus: "verified",
            lineId: "networking-edge",
          },
          {
            id: "ind-net-industrial-5g-router",
            name: "Ruggedized Industrial 5G / Private Cellular Gateway",
            href: "/products/safety-intelligent/ind-net-industrial-5g-router",
            specHighlight: "Latency: < 12 ms (5G SA) | Throughput: Up to 2.1 Gbps DL / 450 Mbps UL",
            verificationStatus: "verified",
            lineId: "networking-edge",
          },
          {
            id: "ind-net-wifi6-industrial-client",
            name: "Industrial Wi-Fi 6 (802.11ax) AMR Client & Roaming Bridge",
            href: "/products/safety-intelligent/ind-net-wifi6-industrial-client",
            specHighlight: "Roaming Handover: < 10 ms | Throughput: Up to 1.2 Gbps PHY rate",
            verificationStatus: "verified",
            lineId: "networking-edge",
          },
        ],
      },
      {
        groupName: "Edge AI Compute & Condition Monitoring",
        technologyDescription: "Edge AI Compute & Condition Monitoring for industrial automation & robotics",
        items: [
          {
            id: "ind-net-edge-ai-inference-box",
            name: "Fanless Industrial Edge AI Computer (NVIDIA Jetson / x86)",
            href: "/products/safety-intelligent/ind-net-edge-ai-inference-box",
            specHighlight: "Inference Power: Up to 275 TOPS | Cameras: 4x PoE GigE + 4x GMSL2",
            verificationStatus: "verified",
            lineId: "networking-edge",
          },
          {
            id: "ind-net-vibration-monitoring-node",
            name: "Triaxial Wireless Condition Monitoring Vibration Node",
            href: "/products/safety-intelligent/ind-net-vibration-monitoring-node",
            specHighlight: "Bandwidth: 10 Hz to 10 kHz (±3 dB) | Axes: X, Y, Z + Surface Temp",
            verificationStatus: "verified",
            lineId: "networking-edge",
          },
          {
            id: "ind-net-motor-power-analyzer-iot",
            name: "High-Speed Motor Current & Power Signature Analyzer",
            href: "/products/safety-intelligent/ind-net-motor-power-analyzer-iot",
            specHighlight: "Voltage: Up to 690 VAC 3-Phase | Current: 50 A to 2,000 A via Rogowski",
            verificationStatus: "verified",
            lineId: "networking-edge",
          },
          {
            id: "ind-net-oil-debris-particle-monitor",
            name: "Inline Lubricant Debris & Ferrous Wear Particle Sensor",
            href: "/products/safety-intelligent/ind-net-oil-debris-particle-monitor",
            specHighlight: "Sensitivity: Fe ≥ 40 µm, Non-Fe ≥ 135 µm | Pressure: Up to 20 bar",
            verificationStatus: "verified",
            lineId: "networking-edge",
          },
          {
            id: "ind-net-failover-redundant-ring-switch",
            name: "High-Availability Dual-Ring Redundant Industrial Switch",
            href: "/products/safety-intelligent/ind-net-failover-redundant-ring-switch",
            specHighlight: "Ring Recovery: < 3 ms (EtherNet/IP DLR) | Ports: 16x 100/1000Base-T + 4x 1000Base-X SFP",
            verificationStatus: "verified",
            lineId: "networking-edge",
          },
        ],
      },
    ],
    relatedApplications: [
      {
            "name": "Automotive Robotic Welding Cells",
            "href": "/applications/automotive"
      },
      {
            "name": "High-Speed Palletizer End-of-Line",
            "href": "/applications/packaging"
      },
      {
            "name": "Autonomous Warehouse AGV Fleet Safety",
            "href": "/applications/logistics"
      }
],
    engineeringTools: [
      {
            "name": "Safety Distance & Stopping Time Tool",
            "href": "/technology/calculators",
            "badge": "ISO 13855"
      },
      {
            "name": "Performance Level (PLr) Estimator",
            "href": "/technology/safety-systems",
            "badge": "ISO 13849-1"
      }
],
  },
];
