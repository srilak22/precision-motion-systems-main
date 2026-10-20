export type IntelligenceLevel =
  | "Level 0: Mechanical Transmission"
  | "Level 1: Actuation & Controlled Motion"
  | "Level 2: Sensing & Feedback"
  | "Level 3: Programmed Control & Coordinated Motion"
  | "Level 4: Perception & Contextual Interpretation"
  | "Level 5: Adaptive Planning & Autonomous Behaviour";

export interface IndustrialUseCase {
  id: string;
  title: string;
  applicationId: string;
  applicationTitle: string;
  industrialProblem: string;
  taskAndEnvironment: string;
  robotOrArchitecture: string;
  relevantComponents: string[];
  sensingAndControl: string;
  intelligenceLevel: IntelligenceLevel;
  safetyAndIntegration: string;
  expectedOperationalBenefit: string;
  suitablePerformanceMetrics: string[];
  relevantProductLinks: { name: string; href: string }[];
  researchReferences: string;
}

export interface ApplicationArea {
  id: string;
  title: string;
  slug: string;
  heroSubtitle: string;
  shortDescription: string;
  overview: string;
  keyChallenges: string[];
  automationOpportunities: string[];
  standardsAndDirectives: string[];
  useCases: IndustrialUseCase[];
}
