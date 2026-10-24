/**
 * INDUS Industrial Robotics — Robotics Guide & Intelligent Product Discovery Types
 * Grounded in verified engineering data models, ISO/DIN standards, and Application Finder schema.
 */

export interface ProductCardData {
  id: string;
  name: string;
  modelCode: string;
  category: string;
  categorySlug: string;
  slug: string;
  valueProp: string;
  specs: { label: string; value: string; unit?: string }[];
  application: string;
  detailUrl: string;
  compareId?: string;
}

export interface ComparisonRow {
  parameter: string;
  unit: string;
  modelAVal: string;
  modelBVal: string;
  difference: string;
  missing?: boolean;
}

export interface ComparisonTableData {
  title: string;
  modelA: { name: string; code: string; url?: string };
  modelB: { name: string; code: string; url?: string };
  rows: ComparisonRow[];
  engineeringInsight: string;
  missingDataNotes?: string[];
}

export interface ApplicationFinderTransferPayload {
  category: string; // "robot" | "rotary-actuator" | "linear-actuator" | "gearbox"
  applicationCategory: string; // e.g. "machine-tending", "robotic-handling", "precision-assembly"
  automationGoal: string;
  industry: string;
  payloadKg?: string;
  reachMm?: string;
  cycleTimeSec?: string;
  thrustForceN?: string;
  strokeMm?: string;
  continuousTorqueNm?: string;
  summary: string;
  source: "INDUS Robotics Guide";
}

export interface GuideActionLink {
  label: string;
  url: string;
  icon?: "arrow" | "calendar" | "form" | "whatsapp" | "phone" | "compare" | "finder";
  isModal?: string;
}

export interface GuideMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
  intent?: "discovery" | "explanation" | "comparison" | "application" | "handoff" | "human" | "greeting";
  quickReplies?: string[];
  products?: ProductCardData[];
  comparison?: ComparisonTableData;
  handoff?: ApplicationFinderTransferPayload;
  actionLinks?: GuideActionLink[];
  progressStep?: { currentStep: number; totalSteps: number; stepName: string };
  requiresEngineeringSignOff?: boolean;
}

export interface ApplicationDiscoveryState {
  step: number; // 0 = inactive, 1..6 = questions, 7 = ready for handoff
  applicationType?: string;
  payloadKg?: string;
  dimensionsMm?: string;
  cycleTimeSec?: string;
  reachMm?: string;
  shiftsPerDay?: string;
  gripperType?: string;
  machineInterface?: string;
  safetyConstraints?: string;
}
