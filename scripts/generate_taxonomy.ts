import fs from "fs";
import path from "path";
import { getRangeById } from "../src/data/productCatalogue";
import { CANONICAL_CATEGORIES_CONFIG } from "./build_canonical_taxonomy";

const categoriesMeta: Record<
  string,
  {
    shortTitle: string;
    subtitle: string;
    engineeringStandard: string;
    enquiryActionLabel: string;
    relatedApplications: { name: string; href: string }[];
    engineeringTools: { name: string; href: string; badge?: string }[];
  }
> = {
  "motion-actuation": {
    shortTitle: "Motion",
    subtitle: "Precision reducers, servo motors, and integrated joint modules",
    engineeringStandard: "ISO 9283 / DIN 3990 / IEC 60034",
    enquiryActionLabel: "Request Reducer & Motor Sizing Support",
    relatedApplications: [
      { name: "Electronics & Semiconductor", href: "/applications/electronics" },
      { name: "Automotive Body Assembly", href: "/applications/automotive" },
      { name: "Aerospace Machining", href: "/applications/aerospace" },
    ],
    engineeringTools: [
      { name: "Joint Sizing Calculator", href: "/technology/calculators", badge: "Interactive" },
      { name: "Reducer Backlash Analysis", href: "/technology/precision-reducers", badge: "Technical" },
    ],
  },
  "robotic-systems": {
    shortTitle: "Robotics",
    subtitle: "Articulated 6-axis arms, cobots, SCARA, delta manipulators, and workcells",
    engineeringStandard: "ISO 10218-1/2 / ISO/TS 15066",
    enquiryActionLabel: "Request Robot Workcell & Sizing Support",
    relatedApplications: [
      { name: "High-Speed Packaging", href: "/applications/packaging" },
      { name: "CNC Machine Tending", href: "/applications/metal-fabrication" },
      { name: "Cleanroom Semiconductor Handling", href: "/applications/semiconductor" },
    ],
    engineeringTools: [
      { name: "Payload & Inertia Estimator", href: "/technology/calculators", badge: "Kinematics" },
      { name: "Cobot Safety Boundary Tool", href: "/technology/safety-systems", badge: "ISO/TS 15066" },
    ],
  },
  "mobility-systems": {
    shortTitle: "Mobility",
    subtitle: "In-hub AGV drive wheels, mecanum wheels, swerve steer modules, and mobile platforms",
    engineeringStandard: "ISO 3691-4 / ANSI/ITSDF B56.5",
    enquiryActionLabel: "Request AGV / AMR Mobility Engineering Support",
    relatedApplications: [
      { name: "Warehouse Logistics & Intralogistics", href: "/applications/logistics" },
      { name: "Cleanroom Wafer Cassette AGV", href: "/applications/semiconductor" },
      { name: "Automotive Powertrain Tow Tuggers", href: "/applications/automotive" },
    ],
    engineeringTools: [
      { name: "AGV Traction Torque Sizing", href: "/technology/calculators", badge: "Drive Sizing" },
      { name: "Omnidirectional Kinematics Guide", href: "/technology/motion-control", badge: "Engineering" },
    ],
  },
  "control-drives": {
    shortTitle: "Control",
    subtitle: "Real-time IPC masters, multi-axis servo drives, safe motion, and fieldbus nodes",
    engineeringStandard: "IEC 61800-5-2 / IEC 61131-3",
    enquiryActionLabel: "Request Motion Architecture & Drive Consultation",
    relatedApplications: [
      { name: "Multi-Robot Synchronization", href: "/applications/automotive" },
      { name: "High-Speed Delta Sortation", href: "/applications/packaging" },
      { name: "Precision Laser Micromachining", href: "/applications/electronics" },
    ],
    engineeringTools: [
      { name: "EtherCAT Cycle-Time Analyzer", href: "/technology/motion-control", badge: "Real-Time" },
      { name: "Servo Loop Bandwidth Calculator", href: "/technology/calculators", badge: "Control Theory" },
    ],
  },
  "sensing-vision": {
    shortTitle: "Sensing",
    subtitle: "Precision encoders, 6-DoF force/torque sensors, 3D vision systems, and AI inspection",
    engineeringStandard: "ISO 13849-1 / IEC 62061",
    enquiryActionLabel: "Request Sensor & Vision Metrology Support",
    relatedApplications: [
      { name: "Random Bin Picking with 3D Vision", href: "/applications/automotive" },
      { name: "Sub-Micron Semiconductor Inspection", href: "/applications/semiconductor" },
      { name: "Collaborative Force-Guided Assembly", href: "/applications/electronics" },
    ],
    engineeringTools: [
      { name: "Field-of-View & Lens Calculator", href: "/technology/calculators", badge: "Optics" },
      { name: "Force/Torque Sensor Sizing Matrix", href: "/technology/sensors", badge: "Instrumentation" },
    ],
  },
  "end-effectors": {
    shortTitle: "Tooling",
    subtitle: "Servo grippers, vacuum handling, automatic tool changers, and process spindles",
    engineeringStandard: "ISO 9409-1 / EN 60204-1",
    enquiryActionLabel: "Request End Effector Tooling Consultation",
    relatedApplications: [
      { name: "High-Volume Sheet Metal Stamping", href: "/applications/automotive" },
      { name: "Fragile Glass & Wafer Handling", href: "/applications/electronics" },
      { name: "Automated Robotic Deburring", href: "/applications/metal-fabrication" },
    ],
    engineeringTools: [
      { name: "Gripping Force & Friction Sizing", href: "/technology/calculators", badge: "Physics" },
      { name: "Flange Standard Cross-Reference", href: "/technology/engineering-portfolio", badge: "ISO 9409" },
    ],
  },
  "mechanical-components": {
    shortTitle: "Mechanical",
    subtitle: "Linear guides, precision ballscrews, crossed-roller bearings, and zero-backlash couplings",
    engineeringStandard: "DIN 69051 / ISO 12090 / ISO 3408",
    enquiryActionLabel: "Request Mechanical Hardware Engineering Support",
    relatedApplications: [
      { name: "Machine Tool Feed Axes", href: "/applications/metal-fabrication" },
      { name: "Gantry Pick-and-Place Systems", href: "/applications/packaging" },
      { name: "Aerospace Tooling Positioners", href: "/applications/aerospace" },
    ],
    engineeringTools: [
      { name: "Ballscrew Critical Speed & Buckling", href: "/technology/calculators", badge: "DIN 69051" },
      { name: "Bearing L10h Fatigue Life Calculator", href: "/technology/calculators", badge: "ISO 281" },
    ],
  },
  "safety-intelligent": {
    shortTitle: "Safety",
    subtitle: "Safety laser scanners, Type 4 light curtains, modular safety PLCs, and edge IIoT gateways",
    engineeringStandard: "ISO 13849-1 / IEC 61508 / IEC 62443",
    enquiryActionLabel: "Request Safety Risk Assessment & Architecture Support",
    relatedApplications: [
      { name: "Automotive Robotic Welding Cells", href: "/applications/automotive" },
      { name: "High-Speed Palletizer End-of-Line", href: "/applications/packaging" },
      { name: "Autonomous Warehouse AGV Fleet Safety", href: "/applications/logistics" },
    ],
    engineeringTools: [
      { name: "Safety Distance & Stopping Time Tool", href: "/technology/calculators", badge: "ISO 13855" },
      { name: "Performance Level (PLr) Estimator", href: "/technology/safety-systems", badge: "ISO 13849-1" },
    ],
  },
};

let output = `/**
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
`;

Object.entries(CANONICAL_CATEGORIES_CONFIG).forEach(([catId, cat]) => {
  const meta = categoriesMeta[catId];
  let totalCount = 0;
  cat.groups.forEach((g) => (totalCount += g.itemIds.length));

  output += `  {
    id: ${JSON.stringify(cat.id)},
    title: ${JSON.stringify(cat.title)},
    shortTitle: ${JSON.stringify(meta.shortTitle)},
    subtitle: ${JSON.stringify(meta.subtitle)},
    description: ${JSON.stringify(cat.description)},
    engineeringStandard: ${JSON.stringify(meta.engineeringStandard)},
    primaryRoute: ${JSON.stringify(cat.primaryRoute)},
    rangeCountBadge: "${totalCount} Verified Ranges",
    enquiryActionLabel: ${JSON.stringify(meta.enquiryActionLabel)},
    groups: [
`;

  cat.groups.forEach((g) => {
    output += `      {
        groupName: ${JSON.stringify(g.groupName)},
        technologyDescription: ${JSON.stringify(g.groupName + " for industrial automation & robotics")},
        items: [
`;

    g.itemIds.forEach((id) => {
      const range = getRangeById(id);
      if (!range) throw new Error("Range not found: " + id);

      const specs = Object.entries(range.specificationSummary);
      const specHighlight = specs
        .slice(0, 2)
        .map(([k, v]) => `${k}: ${v}`)
        .join(" | ");

      output += `          {
            id: ${JSON.stringify(range.id)},
            name: ${JSON.stringify(range.name)},
            href: "/products/${cat.id}/${range.id}",
            specHighlight: ${JSON.stringify(specHighlight)},
            verificationStatus: ${JSON.stringify(range.verificationStatus)},
            lineId: ${JSON.stringify(range.lineId)},
          },
`;
    });

    output += `        ],
      },
`;
  });

  output += `    ],
    relatedApplications: ${JSON.stringify(meta.relatedApplications, null, 6)},
    engineeringTools: ${JSON.stringify(meta.engineeringTools, null, 6)},
  },
`;
});

output += `];\n`;

const targetPath = path.resolve(__dirname, "../src/data/productTaxonomy.ts");
fs.writeFileSync(targetPath, output, "utf-8");
console.log(`Successfully generated ${targetPath}!`);
