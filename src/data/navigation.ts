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
        name: "Actuators",
        slug: "actuators",
        href: "/products/actuators",
        description: "Controlled movement where your machine needs it.",
        items: [
          {
            name: "Linear Actuators",
            href: "/products/actuators/linear",
            description: "Controlled linear movement for automation systems.",
          },
          {
            name: "Rotary Actuators",
            href: "/products/actuators/rotary",
            description: "Rotary motion for robotic joints and industrial mechanisms.",
          },
          {
            name: "Electric Actuators",
            href: "/products/actuators/electric",
            description: "Electrically controlled mechanical movement.",
          },
          {
            name: "Servo Actuators",
            href: "/products/actuators/servo",
            description: "Precision motion for demanding applications.",
          },
        ],
      },
      {
        name: "Precision Reducers",
        slug: "precision-reducers",
        href: "/products/precision-reducers",
        description: "Reduced speed, multiplied torque, controlled motion.",
        items: [
          {
            name: "Planetary Reducers",
            href: "/products/precision-reducers/planetary",
            description: "High-stiffness planetary gear units.",
          },
          {
            name: "Harmonic Reducers",
            href: "/products/precision-reducers/harmonic",
            description: "Zero-backlash strain wave gears.",
          },
          {
            name: "Cycloidal Reducers",
            href: "/products/precision-reducers/cycloidal",
            description: "Shock-resistant high-ratio reducers.",
          },
          {
            name: "Gearboxes",
            href: "/products/precision-reducers/gearboxes",
            description: "Industrial speed reduction modules.",
          },
        ],
      },
      {
        name: "Robotic Wheels",
        slug: "robotic-wheels",
        href: "/products/robotic-wheels",
        description: "Mobility for autonomous industrial platforms.",
        items: [
          {
            name: "Drive Wheels",
            href: "/products/robotic-wheels/drive",
            description: "Traction wheels for differential chassis.",
          },
          {
            name: "Omni Wheels",
            href: "/products/robotic-wheels/omni",
            description: "Multi-directional transverse rollers.",
          },
          {
            name: "Mecanum Wheels",
            href: "/products/robotic-wheels/mecanum",
            description: "Omnidirectional mobility on flat floors.",
          },
          {
            name: "Mobile Robot Modules",
            href: "/products/robotic-wheels/mobile-modules",
            description: "Complete integrated drive units for AGV/AMR.",
          },
        ],
      },
      {
        name: "Robotic Arms",
        slug: "robotic-arms",
        href: "/products/robotic-arms",
        description: "Multi-axis motion with repeatable positioning.",
        items: [
          {
            name: "4-Axis Robots",
            href: "/products/robotic-arms/4-axis",
            description: "Fast planar handling and palletizing arms.",
          },
          {
            name: "6-Axis Robots",
            href: "/products/robotic-arms/6-axis",
            description: "Articulated arms for full 6-DoF tasks.",
          },
          {
            name: "Collaborative Robots",
            href: "/products/robotic-arms/collaborative",
            description: "Power and force limited collaborative arms.",
          },
          {
            name: "Pick & Place Robots",
            href: "/products/robotic-arms/pick-and-place",
            description: "High-speed cycle pick-and-place mechanisms.",
          },
        ],
      },
      {
        name: "Industrial Robots",
        slug: "industrial-robots",
        href: "/products/industrial-robots",
        description: "Production automation built for repeatable output.",
        items: [
          {
            name: "Assembly Robots",
            href: "/products/industrial-robots/assembly",
            description: "Precision robotic work cells for component assembly.",
          },
          {
            name: "Welding Robots",
            href: "/products/industrial-robots/welding",
            description: "Continuous seam and spot welding systems.",
          },
          {
            name: "Handling Robots",
            href: "/products/industrial-robots/handling",
            description: "Heavy-duty part transfer and machine tending.",
          },
          {
            name: "Inspection Robots",
            href: "/products/industrial-robots/inspection",
            description: "Metrology and automated optical quality stations.",
          },
          {
            name: "Palletizing Robots",
            href: "/products/industrial-robots/palletizing",
            description: "End-of-line pallet and carton stacking.",
          },
        ],
      },
      {
        name: "Control Systems",
        slug: "control-systems",
        href: "/products/control-systems",
        description: "The logic that turns commands into coordinated motion.",
        items: [
          {
            name: "Robot Controllers",
            href: "/products/control-systems/robot-controllers",
            description: "Central trajectory planning and safety logic.",
          },
          {
            name: "Motion Controllers",
            href: "/products/control-systems/motion-controllers",
            description: "Deterministic multi-axis synchronization.",
          },
          {
            name: "Servo Drives",
            href: "/products/control-systems/servo-drives",
            description: "Current and position control servo amplifiers.",
          },
          {
            name: "PLC & Automation",
            href: "/products/control-systems/plc-automation",
            description: "Plant-level sequence and cell interlocks.",
          },
          {
            name: "Sensors & Feedback",
            href: "/products/control-systems/sensors-feedback",
            description: "Absolute encoders, resolvers, and torque sensors.",
          },
        ],
      },
      {
        name: "Engineering Tools",
        slug: "engineering-tools",
        href: "/products/compare",
        description: "Interactive sizing matrices and side-by-side component comparisons.",
        items: [
          {
            name: "Total Robotics Taxonomy",
            href: "/taxonomy",
            description: "8 primary pillars, 8 orthogonal facets, and ISO 8373:2021 engineering specification sheets.",
            badge: "8 Pillars",
          },
          {
            name: "Component Comparison Tool",
            href: "/products/compare",
            description: "Compare mechanical ratings, backlash, payload, and fieldbuses.",
            badge: "Interactive",
          },
          {
            name: "Robotics Intelligence Explorer",
            href: "/technology/intelligence-explorer",
            description: "Level 0–5 educational framework for robotics intelligence.",
            badge: "L0–L5",
          },
          {
            name: "Architecture Explorer",
            href: "/technology/architecture-explorer",
            description: "Interactive 5-tier industrial robotics hardware stack.",
            badge: "System",
          },
          {
            name: "Engineering Calculators",
            href: "/technology/calculators",
            description: "Ball screw, reducer inertia ratio, and wrist moment sizing.",
            badge: "Calculators",
          },
          {
            name: "Knowledge Graph & Agentic Network",
            href: "/technology/knowledge-graph",
            description: "Layer B ontology, physics compatibility rules, and Layer C agent contracts.",
            badge: "Agentic Ready",
          },
        ],
      },
      {
        name: "12 Master Product Lines",
        slug: "mechatronic-lines",
        href: "/products",
        description: "12 researched component lines containing 244 verified engineering configurations.",
        items: [
          {
            name: "Precision Reducers & Gearboxes",
            href: "/products/precision-reducers",
            description: "Zero-backlash strain-wave, RV cycloidal, and planetary gearheads.",
            badge: "Priority",
          },
          {
            name: "Servo & Precision Motors",
            href: "/products/servo-motors",
            description: "AC brushless servomotors, frameless torque kits, direct drives.",
          },
          {
            name: "Robot Joint Actuators",
            href: "/products/robot-joint-actuators",
            description: "Integrated mechatronic joint modules with dual encoders.",
          },
          {
            name: "Linear Motion Systems",
            href: "/products/linear-motion",
            description: "Ground ball screws, roller guides, and 7th-axis transfer tracks.",
          },
          {
            name: "End Effectors & Grippers",
            href: "/products/end-effectors",
            description: "Electric servo grippers, vacuum arrays, and dexterous hands.",
          },
          {
            name: "Sensors & Encoders",
            href: "/products/sensors-encoders",
            description: "Optical/magnetic encoders, 6-axis F/T cells, and linear scales.",
          },
          {
            name: "Machine Vision & Perception",
            href: "/products/machine-vision",
            description: "3D structured-light cameras, laser profile scanners, and LiDAR.",
          },
          {
            name: "Robot Controllers & Motion",
            href: "/products/robot-controllers",
            description: "Real-time IPCs, multi-axis interpolators, and teach pendants.",
          },
          {
            name: "Servo Drives & Amplifiers",
            href: "/products/servo-drives",
            description: "SiC high-frequency inverters and functional safety drives.",
          },
          {
            name: "Bearings & Transmission",
            href: "/products/mechanical-transmission",
            description: "Crossed-roller slewing rings, bellows couplings, holding brakes.",
          },
          {
            name: "Robotics Safety Components",
            href: "/products/robotics-safety",
            description: "Safety laser scanners, light curtains, and Safe Motion PLCs.",
          },
          {
            name: "Networking & Edge Intelligence",
            href: "/products/networking-edge",
            description: "TSN switches, IO-Link masters, and edge AI inference nodes.",
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
        name: "Factory Automation",
        href: "/solutions/factory-automation",
        description: "Automate repetitive and production-intensive operations.",
      },
      {
        name: "Robotic Automation",
        href: "/solutions/robotic-automation",
        description: "Integrate robotic systems into manufacturing workflows.",
      },
      {
        name: "Motion Control",
        href: "/solutions/motion-control",
        description: "Coordinate motors, actuators, drives, and feedback.",
      },
      {
        name: "Mobile Robotics",
        href: "/solutions/mobile-robotics",
        description: "Support AGV, AMR, and autonomous mobility applications.",
      },
      {
        name: "Smart Manufacturing",
        href: "/solutions/smart-manufacturing",
        description: "Connect machines, data, controls, and analytics.",
      },
      {
        name: "Material Handling",
        href: "/solutions/material-handling",
        description: "Automate movement, transfer, sorting, and handling.",
      },
      {
        name: "Custom Robotics",
        href: "/solutions/custom-robotics",
        description: "Support application-specific robotic systems.",
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
        name: "Total Robotics Taxonomy",
        href: "/taxonomy",
        description: "8 pillars, 8 orthogonal facets, and ISO 8373:2021 engineering specification sheets.",
        badge: "8 Pillars",
      },
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
