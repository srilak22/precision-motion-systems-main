export type RobotArmClass =
  | "INDUS-ARM-06 (6kg / 900mm)"
  | "INDUS-ARM-12 (12kg / 1300mm)"
  | "INDUS-ARM-25 (25kg / 1750mm)"
  | "INDUS-ARM-50 (50kg / 2100mm)"
  | "INDUS-SCARA-06 (6kg / 700mm)"
  | "INDUS-DELTA-08 (8kg / 1200mm)";

export interface CyclePhaseTiming {
  id: string;
  name: string;
  shortName: string;
  durationSec: number;
  percentage: number;
  isBottleneck: boolean;
  category: "kinematic_motion" | "sensing_vision" | "tooling_actuation" | "process_execution";
  optimizationPotentialSec: number;
  description: string;
}

export interface WristLoadingInput {
  robotClass: RobotArmClass;
  endEffectorMassKg: number;
  workpieceMassKg: number;
  cogOffsetXmm: number;
  cogOffsetYmm: number;
  cogOffsetZmm: number;
  maxAccelerationG: number;
}

export interface WristLoadingOutput {
  totalPayloadKg: number;
  ratedPayloadKg: number;
  payloadUtilizationPercent: number;
  staticTorqueNm: number;
  dynamicInertialTorqueNm: number;
  totalEquivalentTorqueNm: number;
  allowableTorqueNm: number;
  safetyFactor: number;
  status: "SAFE" | "MARGINAL" | "OVERLOADED";
  overhungMomentNm: number;
  allowableOverhungMomentNm: number;
  momentUtilizationPercent: number;
}

export interface OeeAnalysisInput {
  plannedShiftHours: number; // e.g. 8.0
  plannedMaintenanceMins: number; // e.g. 30
  unplannedDowntimeMins: number; // e.g. 45
  idealCycleTimeSec: number; // e.g. 2.5
  totalPartsProduced: number; // e.g. 8200
  defectPartsCount: number; // e.g. 110
}

export interface OeeAnalysisOutput {
  operatingTimeMins: number;
  availabilityPercent: number;
  performancePercent: number;
  qualityPercent: number;
  overallOeePercent: number;
  status: "WORLD_CLASS" | "GOOD" | "REQUIRES_OPTIMIZATION" | "CRITICAL";
  lostProductionUnits: number;
  topLossCategory: "Availability Loss (Downtime)" | "Performance Loss (Speed)" | "Quality Loss (Defects)";
  actionableInsights: string[];
}

export interface TrajectoryProfileComparison {
  profileType: "Trapezoidal (Bang-Bang)" | "S-Curve (Jerk-Limited)" | "Quintic Spline (Minimum-Jerk)";
  peakAccelerationMps2: number;
  peakJerkMps3: number;
  trajectoryDurationSec: number;
  vibrationalSettlingTimeMs: number;
  totalCycleTimeSec: number;
  reducerStressIndex: number; // 0 - 100
  estimatedL10hLifeHours: number;
}
