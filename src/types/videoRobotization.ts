export type IndustrialVideoCategory =
  | "automotive_battery"
  | "electronics_pcb"
  | "metal_stamping"
  | "medical_packaging";

export interface MtmMotionElement {
  code: "MTM-R" | "MTM-G" | "MTM-M" | "MTM-P" | "MTM-RL" | "MTM-D";
  name: string;
  category: "reach" | "grasp" | "move" | "position" | "release" | "process_dwell";
  startSec: number;
  endSec: number;
  durationSec: number;
  humanTimeSec: number;
  robotTimeSec: number;
  timeSavedPercent: number;
  description: string;
}

export interface VideoDatasetPreset {
  id: string;
  title: string;
  subtitle: string;
  category: IndustrialVideoCategory;
  industryLabel: string;
  durationSec: number;
  fps: number;
  manualTaktTimeSec: number;
  operatorCount: number;
  observedErgoRisk: "Low Risk" | "Medium Risk" | "High Risk" | "Severe Hazard";
  ergoRulaScore: number; // 1 - 7 (7 = severe risk)
  spatialEnvelopeMm: {
    reachX: number;
    reachY: number;
    strokeZ: number;
  };
  workpieceWeightKg: number;
  mtmBreakdown: MtmMotionElement[];
  recommendedRobot: string;
  recommendedEndEffector: string;
  projectedRobotCycleTimeSec: number;
  description: string;
}

export interface VideoAnalysisResult {
  presetId: string;
  manualCycleTimeSec: number;
  projectedRobotCycleTimeSec: number;
  cycleTimeReductionSec: number;
  speedupMultiplier: number;
  throughputHourlyManual: number;
  throughputHourlyRobotic: number;
  throughputGainPercent: number;
  ergoRiskReductionPercent: number;
  recommendedRobotModel: string;
  recommendedEndEffector: string;
  estimatedCapitalCostUsd: number;
  annualLaborSavingsUsd: number;
  paybackMonths: number;
}
