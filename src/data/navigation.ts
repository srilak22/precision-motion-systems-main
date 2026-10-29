/**
 * Central Navigation Configuration for INDUS Industrial Robotics
 * Drives Header Mega Menus, Mobile Drawer, Breadcrumbs, and Footer links.
 */

export interface NavSubItem {
  name: string;
  href: string;
  description?: string;
  badge?: string;
}

export interface NavGroup {
  name: string;
  slug: string;
  href: string;
  description?: string;
  items: NavSubItem[];
}

export interface NavSection {
  title: string;
  href: string;
  featuredHref?: string;
  featuredLabel?: string;
  groups?: NavGroup[];
  items?: NavSubItem[];
}

export const navigationData: Record<string, NavSection> = {
  products: {
    title: "Products",
    href: "/products",
    featuredHref: "/products",
    featuredLabel: "View All Products →",
    groups: [
      {
        name: "Motion & Actuation",
        slug: "motion-actuation",
        href: "/products/motion-actuation",
        description: "Zero-backlash strain-wave gearheads, RV cycloidal drives, planetary gearboxes, and servomotors.",
        items: [
          {
            name: "Strain-Wave Harmonic Reducers",
            href: "/products/motion-actuation",
            description: "Zero-backlash flexspline gearing for precision joints.",
          },
          {
            name: "RV Cycloidal & High-Torque Drives",
            href: "/products/motion-actuation",
            description: "High-rigidity cycloidal reducers for high-payload axes.",
          },
          {
            name: "Precision Planetary Gearboxes",
            href: "/products/motion-actuation",
            description: "Sub-arcminute helical planetary inline and right-angle heads.",
          },
          {
            name: "Servo Motors & Joint Actuators",
            href: "/products/motion-actuation",
            description: "Low-inertia AC servomotors and frameless torque kits.",
          },
        ],
      },
      {
        name: "Robotic Systems",
        slug: "robotic-systems",
        href: "/products/robotic-systems",
        description: "Industrial 6-axis articulated arms, cobots, SCARA, delta manipulators, and workcells.",
        items: [
          {
            name: "Articulated 6-Axis Arms",
            href: "/products/robotic-systems",
            description: "Payload capacities from 3kg tabletop to 250kg heavy foundry.",
          },
          {
            name: "Collaborative Cobots",
            href: "/products/robotic-systems",
            description: "Power and force limited human-robot collaborative arms.",
          },
          {
            name: "SCARA & Delta Manipulators",
            href: "/products/robotic-systems",
            description: "High-speed pick-and-place packaging and micro-assembly robots.",
          },
          {
            name: "Turn-Key Automation Cells",
            href: "/products/robotic-systems",
            description: "Engineered robotic welding, palletizing, and machine tending cells.",
          },
        ],
      },
      {
        name: "Mobility Systems",
        slug: "mobility-systems",
        href: "/products/mobility-systems",
        description: "In-hub AGV drive wheels, mecanum wheels, swerve steer modules, and mobile chassis.",
        items: [
          {
            name: "In-Hub AGV Drive Wheels",
            href: "/products/mobility-systems",
            description: "Integrated brushless traction units up to 3000kg payload.",
          },
          {
            name: "Omnidirectional Mecanum & Omni",
            href: "/products/mobility-systems",
            description: "Full planar mobility wheels for tight factory aisles.",
          },
          {
            name: "Steering Swerve & Suspension",
            href: "/products/mobility-systems",
            description: "Active coaxial steering castors and rocker bogies.",
          },
          {
            name: "Autonomous Mobile Chassis",
            href: "/products/mobility-systems",
            description: "500kg AMR platforms, pallet lifts, and wireless charging.",
          },
        ],
      },
      {
        name: "Control & Drives",
        slug: "control-drives",
        href: "/products/control-drives",
        description: "Real-time industrial IPC motion controllers, synchronized multi-axis servo drives, and fieldbuses.",
        items: [
          {
            name: "Robot Motion Controllers",
            href: "/products/control-drives",
            description: "Real-time IPC masters and DIN-rail embedded motion controllers.",
          },
          {
            name: "Synchronized Kinematics Cores",
            href: "/products/control-drives",
            description: "64-axis EtherCAT controllers and fleet AMR gateways.",
          },
          {
            name: "AC & Low-Voltage DC Drives",
            href: "/products/control-drives",
            description: "48V compact cobot joint drives and 400V shared-bus inverters.",
          },
          {
            name: "Safe Motion Amplifiers",
            href: "/products/control-drives",
            description: "FSoE certified functional safety drives with STO, SLS, and SBC.",
          },
        ],
      },
      {
        name: "Sensing & Vision",
        slug: "sensing-vision",
        href: "/products/sensing-vision",
        description: "Sub-micron optical and inductive encoders, 6-DoF force/torque feedback sensors, and 3D vision.",
        items: [
          {
            name: "Rotary & Linear Encoders",
            href: "/products/sensing-vision",
            description: "24-bit optical hollow-shaft kits and sub-micron glass scales.",
          },
          {
            name: "Force/Torque & Proximity",
            href: "/products/sensing-vision",
            description: "6-DoF wrist force/torque sensors and weld-immune proximity.",
          },
          {
            name: "3D Vision & Spatial Perception",
            href: "/products/sensing-vision",
            description: "Structured-light bin pickers, ToF cameras, and flash LiDAR.",
          },
          {
            name: "2D Inspection & Smart Cameras",
            href: "/products/sensing-vision",
            description: "GigE line-scan cameras and embedded edge AI inspection.",
          },
        ],
      },
      {
        name: "End Effectors & Tooling",
        slug: "end-effectors",
        href: "/products/end-effectors",
        description: "Electric parallel and centric grippers, vacuum handling tools, and automatic tool changers.",
        items: [
          {
            name: "Electric Precision Grippers",
            href: "/products/end-effectors",
            description: "Servo parallel grippers and 5-finger dexterous hands.",
          },
          {
            name: "Vacuum & Non-Contact Handling",
            href: "/products/end-effectors",
            description: "Bernoulli non-contact cups and electro-permanent magnets.",
          },
          {
            name: "Welding & Process Tooling",
            href: "/products/end-effectors",
            description: "Spot weld servo guns and ultrasonic cutting heads.",
          },
          {
            name: "Tool Changers & Spindles",
            href: "/products/end-effectors",
            description: "Payload tool changers and compliance deburring spindles.",
          },
        ],
      },
      {
        name: "Mechanical Components",
        slug: "mechanical-components",
        href: "/products/mechanical-components",
        description: "C3/C5 ground ballscrews, roller linear guideways, crossed-roller bearings, and zero-backlash couplings.",
        items: [
          {
            name: "Linear Guidance & Drive",
            href: "/products/mechanical-components",
            description: "Ground ballscrews, roller caged rails, and roller screws.",
          },
          {
            name: "Linear Bearings & 7th-Axis",
            href: "/products/mechanical-components",
            description: "Helical rack and pinion 7th-axis robot transfer tracks.",
          },
          {
            name: "Precision Bearings & Slew Rings",
            href: "/products/mechanical-components",
            description: "Crossed-roller slewing rings and ceramic hybrid spindle bearings.",
          },
          {
            name: "Couplings & Safety Brakes",
            href: "/products/mechanical-components",
            description: "Zero-backlash disc couplings and power-off holding brakes.",
          },
        ],
      },
      {
        name: "Safety & Intelligent Systems",
        slug: "safety-intelligent",
        href: "/products/safety-intelligent",
        description: "Dynamic safety laser area scanners, Type 4 light curtains, modular safety PLCs, and edge IIoT gateways.",
        items: [
          {
            name: "Optical Safety & Scanners",
            href: "/products/safety-intelligent",
            description: "SIL 2 / PLd dynamic field scanners and Type 4 light curtains.",
          },
          {
            name: "Safety Controllers & Interlocks",
            href: "/products/safety-intelligent",
            description: "Modular safety PLCs and RFID non-contact interlocks.",
          },
          {
            name: "Deterministic TSN & IIoT",
            href: "/products/safety-intelligent",
            description: "TSN managed switches, IO-Link masters, and 5G routers.",
          },
          {
            name: "Edge AI & Condition Monitoring",
            href: "/products/safety-intelligent",
            description: "Fanless edge AI compute boxes and vibration diagnostic nodes.",
          },
        ],
      },
    ],
  },
  solutions: {
    title: "Solutions",
    href: "/solutions",
    featuredHref: "/solutions",
    featuredLabel: "Explore All Solutions →",
    items: [
      {
        name: "Motion Control",
        href: "/solutions/motion-control",
        description: "Multi-axis kinematics and deterministic trajectory synchronization.",
      },
      {
        name: "Robotic Automation",
        href: "/solutions/robotic-automation",
        description: "Turnkey articulated robotic cells, machine tending, and collaborative assembly.",
      },
      {
        name: "Machine Integration",
        href: "/solutions/machine-integration",
        description: "End-to-end plant cell automation and deterministic fieldbus master loops.",
      },
      {
        name: "Material Handling",
        href: "/solutions/material-handling",
        description: "High-throughput carton sorting, robotic palletizing, and AMR logistics.",
      },
      {
        name: "Precision Positioning",
        href: "/solutions/precision-positioning",
        description: "Sub-micron direct-drive rotary stages and metrology indexing.",
      },
      {
        name: "Custom Engineering",
        href: "/solutions/custom-engineering",
        description: "Engineered-to-order robotic joint modules and tailored OEM drivetrains.",
      },
    ],
  },
  applications: {
    title: "Applications",
    href: "/applications",
    featuredHref: "/applications",
    featuredLabel: "Explore All 18 Applications →",
    items: [
      {
        name: "Automotive Manufacturing",
        href: "/applications/automotive",
        description: "Body welding, sub-assembly, EV battery modules, and powertrain lines.",
      },
      {
        name: "Electronics & Semiconductor",
        href: "/applications/electronics",
        description: "Micro-placement, cleanroom handling, wafer metrology, and wire bonding.",
      },
      {
        name: "Aerospace & Defence",
        href: "/applications/aerospace",
        description: "Fuselage drilling, titanium machining, composite preform layup, and NDT.",
      },
      {
        name: "Metal Fabrication & Machining",
        href: "/applications/metal-fabrication-machining",
        description: "CNC machine tending, heavy forging, laser beveling, and grinding.",
      },
      {
        name: "Warehousing & Intralogistics",
        href: "/applications/warehousing-intralogistics",
        description: "Automated storage, high-speed parcel induction, and AMR mobile transport fleets.",
      },
      {
        name: "Food & Beverage Processing",
        href: "/applications/food-beverage",
        description: "Hygienic washdown pick-and-place, aseptic packaging, and palletizing.",
      },
      {
        name: "Pharmaceuticals & Life Sciences",
        href: "/applications/pharma-lifesciences",
        description: "Sterile vial filling, lyophilizer loading, and cleanroom isolators.",
      },
      {
        name: "Medical Devices & Healthcare",
        href: "/applications/medical-devices",
        description: "Catheter bonding, orthopedic implant polishing, and surgical robotics.",
      },
      {
        name: "Plastics & Rubber",
        href: "/applications/plastics-rubber",
        description: "Injection molding side-entry unloading, deflashing, and mold insert loading.",
      },
      {
        name: "Packaging & Consumer Goods",
        href: "/applications/packaging",
        description: "High-speed carton erecting, case packing, flow wrapping, and palletizing.",
      },
      {
        name: "Agriculture & Agri-Tech",
        href: "/applications/agriculture",
        description: "Autonomous greenhouse harvesting, vineyard weeding, and field crop spraying.",
      },
      {
        name: "Construction & Building",
        href: "/applications/construction",
        description: "3D concrete printing, precast panel rebar tying, and facade drilling crawlers.",
      },
      {
        name: "Energy & Utilities",
        href: "/applications/energy-utilities",
        description: "Wind turbine blade inspection crawlers, subsea ROVs, and solar farm cleaning.",
      },
      {
        name: "Chemicals & Process",
        href: "/applications/chemicals-process",
        description: "Corrosive chemical drum filling, reactor vessel inspection, and hazardous sampling.",
      },
      {
        name: "Textiles & Apparel",
        href: "/applications/textiles",
        description: "3D composite fabric layup, ultrasonic slitting, automated sewing, and shoe lasting.",
      },
      {
        name: "Mining & Heavy Industry",
        href: "/applications/mining",
        description: "Underground autonomous LHD haulage, SAG mill relining, and blast hole priming.",
      },
      {
        name: "Education, Research & Labs",
        href: "/applications/education",
        description: "High-throughput chemical screening, synchrotron stages, and open research arms.",
      },
      {
        name: "Humanoid & Mobile Robotics",
        href: "/applications/humanoid",
        description: "Bipedal humanoid actuators, dexterous hands, AMR drive pods, and exoskeletons.",
      },
    ],
  },
  technology: {
    title: "Technology",
    href: "/technology",
    featuredHref: "/technology",
    featuredLabel: "Explore Technology Stack →",
    items: [
      {
        name: "Intelligence Explorer (Level 0–5)",
        href: "/technology/intelligence-explorer",
        description: "Educational framework: mechanical transmission to adaptive planning.",
        badge: "Level 0-5",
      },
      {
        name: "Architecture Explorer",
        href: "/technology/architecture-explorer",
        description: "Interactive 5-tier industrial robotics hardware & fieldbus stack.",
        badge: "Interactive",
      },
      {
        name: "Knowledge Graph & Agentic Network",
        href: "/technology/knowledge-graph",
        description: "Layer B ontology, mechatronic validation rules, and Layer C agent contracts.",
        badge: "Agentic Ready",
      },
      {
        name: "Engineering Calculators",
        href: "/technology/calculators",
        description: "Kinematic ball screw, reducer inertia ratio, and wrist moment sizing.",
        badge: "Formulas",
      },
      {
        name: "Robotics",
        href: "/technology/robotics",
        description: "Kinematics, joint dynamics, and multi-axis manipulators.",
      },
      {
        name: "Motion Control",
        href: "/technology/motion-control",
        description: "Real-time trajectory generation and path interpolation.",
      },
      {
        name: "Servo Technology",
        href: "/technology/servo",
        description: "Closed-loop torque control and advanced commutations.",
      },
      {
        name: "Industrial Automation",
        href: "/technology/automation",
        description: "Deterministic fieldbuses, safety PLCs, and SCADA.",
      },
      {
        name: "Sensors & Feedback",
        href: "/technology/sensors",
        description: "Optical/magnetic encoders, torque transducers, 3D vision.",
      },
      {
        name: "AI & Intelligent Robotics",
        href: "/technology/ai-robotics",
        description: "Computer vision, adaptive trajectory, and obstacle avoidance.",
      },
      {
        name: "Industry 4.0",
        href: "/technology/industry-4",
        description: "Edge telemetry, digital twin, and predictive maintenance.",
      },
    ],
  },
  resources: {
    title: "Resources",
    href: "/engineering-intelligence",
    featuredHref: "/engineering-intelligence",
    featuredLabel: "Visit Engineering Intelligence Center →",
    items: [
      {
        name: "Engineering Intelligence Center",
        href: "/engineering-intelligence",
        description: "Central technical destination for articles, verified datasheets, CAD, and applications.",
        badge: "Flagship",
      },
      {
        name: "Engineering Knowledge Hub",
        href: "/engineering-intelligence?section=knowledge",
        description: "Peer-reviewed papers on robotics fundamentals, FOC, fieldbuses, and reducers.",
      },
      {
        name: "Technical Resource Library",
        href: "/engineering-intelligence?section=resources",
        description: "Search and filter verified datasheets, 2D drawings, 3D CAD, and manuals.",
      },
      {
        name: "Application Problem Library",
        href: "/engineering-intelligence?section=applications",
        description: "Organized by industry sector and mechanical constraint challenges.",
      },
      {
        name: "Product Catalogue & Datasheets",
        href: "/resources",
        description: "Comprehensive mechanical specifications, catalogue, and dimension sheets.",
      },
      {
        name: "Engineering FAQs",
        href: "/resources/faqs",
        description: "Direct engineering answers to frequently asked technical questions.",
      },
    ],
  },
  about: {
    title: "About",
    href: "/about",
    items: [
      {
        name: "About INDUS",
        href: "/about",
        description: "Our engineering mission, values, and industrial presence.",
      },
      {
        name: "Careers & Opportunities",
        href: "/careers",
        description: "Join the engineering team building next-generation motion systems.",
      },
      {
        name: "Industries We Serve",
        href: "/applications",
        description: "Key manufacturing sectors empowered by INDUS automation.",
      },
      {
        name: "Contact & Locations",
        href: "/contact",
        description: "Connect with application engineers and regional support.",
      },
    ],
  },
};
