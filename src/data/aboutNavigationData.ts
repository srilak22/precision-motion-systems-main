/**
 * Central Navigation Architecture for INDUS About Us Mega Menu & Section Routing
 * Maps every primary card and submenu link to validated destinations:
 * - In-page anchor sections (type: "section")
 * - Dedicated application / product / solution pages (type: "page")
 */

export interface SubMenuItem {
  id: string;
  name: string;
  href: string;
  type: "page" | "section";
  badge?: string;
  description?: string;
}

export interface AboutNavCard {
  id: string;
  heading: string;
  description: string;
  href: string;
  type: "page" | "section";
  iconName:
    "overview" | "leadership" | "capabilities" | "infrastructure" | "industries" | "innovation";
  items: SubMenuItem[];
}

export const ABOUT_NAV_CARDS: AboutNavCard[] = [
  {
    id: "company-overview",
    heading: "Company Overview",
    description: "Our mission, vision, and foundational robotics engineering",
    href: "/about#overview",
    type: "section",
    iconName: "overview",
    items: [
      {
        id: "who-we-are",
        name: "Who We Are",
        href: "/about#who-we-are",
        type: "section",
        description: "Core robotics focus and kinematic actuation chain",
      },
      {
        id: "company-profile",
        name: "Company Profile",
        href: "/about#overview",
        type: "section",
        description: "Enterprise positioning & foundational pillars",
      },
      {
        id: "mission-vision",
        name: "Our Mission & Vision",
        href: "/about#mission-vision",
        type: "section",
        description: "Deterministic motion & physical AI roadmap",
      },
    ],
  },
  {
    id: "leadership-team",
    heading: "Leadership & Team",
    description: "Multidisciplinary leaders, researchers, and engineers",
    href: "/about#leadership-teams",
    type: "section",
    iconName: "leadership",
    items: [
      {
        id: "exec-leadership",
        name: "Executive Leadership",
        href: "/about#team-executive",
        type: "section",
      },
      {
        id: "advisory-board",
        name: "Advisory Board",
        href: "/about#team-advisory",
        type: "section",
      },
      {
        id: "exec-management",
        name: "Executive Management",
        href: "/about#team-management",
        type: "section",
      },
      {
        id: "physical-ai-core",
        name: "Physical AI & Humanoid Robotics",
        href: "/about#team-physical-ai",
        type: "section",
      },
      {
        id: "motion-control-eng",
        name: "Motion Control & Mechatronics",
        href: "/about#team-motion-control",
        type: "section",
      },
      {
        id: "software-infra",
        name: "Software Platform & Infrastructure",
        href: "/about#team-software",
        type: "section",
      },
      {
        id: "interns-associates",
        name: "Engineering Interns & Associates",
        href: "/about#team-interns",
        type: "section",
      },
    ],
  },
  {
    id: "engineering-capabilities",
    heading: "Engineering Capabilities",
    description: "Sub-arcminute reducers, kinematics & full-stack integration",
    href: "/about#capabilities-stack",
    type: "section",
    iconName: "capabilities",
    items: [
      {
        id: "precision-motion-eng",
        name: "Precision Motion Engineering",
        href: "/products/motion-actuation",
        type: "page",
        description: "Zero-backlash strain-wave & cycloidal reducers",
      },
      {
        id: "robotics-integration",
        name: "Robotics Integration",
        href: "/engineering-services/system-integration",
        type: "page",
        description: "Turnkey automated cells & safety perimeter",
      },
      {
        id: "automation-capabilities",
        name: "Automation Capabilities",
        href: "/engineering-services",
        type: "page",
        description: "Application sizing, kinematics simulation & FEA",
      },
    ],
  },
  {
    id: "manufacturing-infrastructure",
    heading: "Manufacturing & Infrastructure",
    description: "CMM metrology, dynamic test rigs & ISO standards",
    href: "/about#infrastructure",
    type: "section",
    iconName: "infrastructure",
    items: [
      {
        id: "mfg-capabilities",
        name: "Manufacturing Capabilities",
        href: "/about#infrastructure",
        type: "section",
        description: "Precision CNC machining & cleanroom assembly",
      },
      {
        id: "eng-infrastructure",
        name: "Engineering Infrastructure",
        href: "/about#infrastructure",
        type: "section",
        description: "High-voltage dyno test benches & burn-in",
      },
      {
        id: "quality-testing",
        name: "Quality & Testing",
        href: "/engineering-services/technical-specifications",
        type: "page",
        description: "Traceable ISO 9001:2015 & ISO 9283 metrics",
      },
    ],
  },
  {
    id: "industries-case-studies",
    heading: "Industries & Case Studies",
    description: "High-duty automation deployments across core sectors",
    href: "/industries",
    type: "page",
    iconName: "industries",
    items: [
      {
        id: "industries-served",
        name: "Industries Served",
        href: "/industries",
        type: "page",
        description: "Automotive, electronics, packaging & logistics",
      },
      {
        id: "application-areas",
        name: "Application Areas",
        href: "/applications",
        type: "page",
        description: "Welding, machine tending, pick-and-place & AMRs",
      },
      {
        id: "project-highlights",
        name: "Project Highlights",
        href: "/resources/case-studies",
        type: "page",
        description: "Real-world engineering challenges & verified outcomes",
      },
    ],
  },
  {
    id: "innovation-technology",
    heading: "Innovation & Technology",
    description: "Deterministic fieldbuses, digital twins & physical AI",
    href: "/about#presence-innovation",
    type: "section",
    iconName: "innovation",
    items: [
      {
        id: "robotics-innovation",
        name: "Robotics Innovation",
        href: "/about#presence-innovation",
        type: "section",
        description: "R&D fellowships, student labs & joint projects",
      },
      {
        id: "intelligent-automation",
        name: "Intelligent Automation",
        href: "/technology/intelligent-actuators",
        type: "page",
        description: "Smart integrated actuators with edge diagnostics",
      },
      {
        id: "future-technologies",
        name: "Future Technologies",
        href: "/technology/physical-ai",
        type: "page",
        description: "Embodied intelligence & humanoid kinematics",
      },
    ],
  },
];
