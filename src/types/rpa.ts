export type RpaIndustry =
  | "all"
  | "automotive_ev"
  | "electronics_semiconductor"
  | "pharma_medical"
  | "food_packaging"
  | "machining_metal";

export interface RpaWorkflowStage {
  id: string;
  stepNumber: number;
  name: string;
  shortName: string;
  category: "perception" | "planning" | "execution" | "inspection" | "dispatch";
  cycleTimeMs: number;
  repeatabilityMm: number;
  description: string;
  detailedSpecs: {
    fieldbus: string;
    refreshRate: string;
    accuracy: string;
    safetyStandard: string;
  };
  hardwareComponents: string[];
  telemetryMetrics: {
    tcpVelocity: string;
    dynamicTorque: string;
    powerDrawKw: number;
    status: "OPTIMAL" | "STANDBY" | "PROCESSING" | "VERIFIED";
  };
}

export interface RpaSolutionCell {
  id: string;
  title: string;
  subtitle: string;
  industry: RpaIndustry;
  industryLabel: string;
  robotType: "6-Axis Articulated" | "SCARA High-Speed" | "Delta Parallel" | "Cartesian Gantry" | "Cobot Hybrid";
  payloadKg: number;
  reachMm: number;
  cycleTimeSec: number;
  repeatabilityMm: number;
  throughputPerHour: number;
  roiMonths: number;
  tag: string;
  description: string;
  keyFeatures: string[];
  targetApplications: string[];
  hardwareBom: {
    component: string;
    spec: string;
    indusModel: string;
  }[];
  standards: string[];
}

export interface RpaStackLayer {
  tierNumber: number;
  tierCode: string;
  name: string;
  headline: string;
  description: string;
  protocols: string[];
  hardwareHighlight: string;
  keyMetrics: { label: string; value: string }[];
  bulletPoints: string[];
}

export interface RpaAssessmentInputs {
  partWeightCategory: "micro" | "light" | "medium" | "heavy";
  cycleTimeTarget: "ultra_fast" | "fast" | "moderate" | "standard";
  environmentRating: "cleanroom" | "standard_factory" | "harsh_ip67" | "sterile_fda";
  batchMixType: "high_volume_low_mix" | "medium_mix" | "high_mix_low_volume";
}

export interface RpaAssessmentResult {
  feasibilityScore: number;
  feasibilityTier: "High Feasibility" | "Moderate Feasibility" | "Complex Architecture";
  recommendedKinematics: string;
  recommendedGripper: string;
  estimatedCycleTimeSec: number;
  estimatedThroughputPerHour: number;
  estimatedRoiMonths: number;
  keyRecommendations: string[];
  complianceNotes: string;
}
