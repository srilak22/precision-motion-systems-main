import type {
  RobotArmClass,
  CyclePhaseTiming,
  WristLoadingInput,
  WristLoadingOutput,
  OeeAnalysisInput,
  OeeAnalysisOutput,
  TrajectoryProfileComparison,
} from "@/types/rpaAnalysis";

export const ROBOT_SPECS_DATABASE: Record<
  RobotArmClass,
  {
    ratedPayloadKg: number;
    maxReachMm: number;
    allowableTorqueNm: number;
    allowableMomentNm: number;
    baseWeightKg: number;
    repeatabilityMm: number;
  }
> = {
  "INDUS-ARM-06 (6kg / 900mm)": {
    ratedPayloadKg: 6,
    maxReachMm: 900,
    allowableTorqueNm: 24,
    allowableMomentNm: 42,
    baseWeightKg: 28,
    repeatabilityMm: 0.01,
  },
  "INDUS-ARM-12 (12kg / 1300mm)": {
    ratedPayloadKg: 12,
    maxReachMm: 1300,
    allowableTorqueNm: 52,
    allowableMomentNm: 95,
    baseWeightKg: 54,
    repeatabilityMm: 0.015,
  },
  "INDUS-ARM-25 (25kg / 1750mm)": {
    ratedPayloadKg: 25,
    maxReachMm: 1750,
    allowableTorqueNm: 125,
    allowableMomentNm: 210,
    baseWeightKg: 110,
    repeatabilityMm: 0.02,
  },
  "INDUS-ARM-50 (50kg / 2100mm)": {
    ratedPayloadKg: 50,
    maxReachMm: 2100,
    allowableTorqueNm: 280,
    allowableMomentNm: 480,
    baseWeightKg: 240,
    repeatabilityMm: 0.03,
  },
  "INDUS-SCARA-06 (6kg / 700mm)": {
    ratedPayloadKg: 6,
    maxReachMm: 700,
    allowableTorqueNm: 18,
    allowableMomentNm: 35,
    baseWeightKg: 22,
    repeatabilityMm: 0.006,
  },
  "INDUS-DELTA-08 (8kg / 1200mm)": {
    ratedPayloadKg: 8,
    maxReachMm: 1200,
    allowableTorqueNm: 22,
    allowableMomentNm: 40,
    baseWeightKg: 45,
    repeatabilityMm: 0.02,
  },
};

export const INITIAL_CYCLE_PHASES: CyclePhaseTiming[] = [
  {
    id: "p1",
    name: "Gross Kinematic Approach Move",
    shortName: "Approach",
    durationSec: 1.25,
    percentage: 24.5,
    isBottleneck: false,
    category: "kinematic_motion",
    optimizationPotentialSec: 0.35,
    description: "Robot arm traverses from home wait position to part acquisition staging point.",
  },
  {
    id: "p2",
    name: "3D Vision Perception & Pose Sighting",
    shortName: "Vision Pose",
    durationSec: 0.65,
    percentage: 12.7,
    isBottleneck: false,
    category: "sensing_vision",
    optimizationPotentialSec: 0.45,
    description: "ToF sensor capture, point-cloud rectification, and target centroid coordinate computation.",
  },
  {
    id: "p3",
    name: "End-Effector Dwell & Gripper Vacuum Actuation",
    shortName: "Grip Dwell",
    durationSec: 0.55,
    percentage: 10.8,
    isBottleneck: false,
    category: "tooling_actuation",
    optimizationPotentialSec: 0.35,
    description: "Venturi vacuum generation, pressure switch verification, and tactile force settling.",
  },
  {
    id: "p4",
    name: "Primary Robotic Process Execution (Weld / Fasten / Dispense)",
    shortName: "Process Exec",
    durationSec: 1.85,
    percentage: 36.3,
    isBottleneck: true,
    category: "process_execution",
    optimizationPotentialSec: 0.45,
    description: "Continuous trajectory tool path execution (high-frequency seam welding or micro-screwdriving).",
  },
  {
    id: "p5",
    name: "Retract Move to Safe Clearance Boundary",
    shortName: "Retract",
    durationSec: 0.45,
    percentage: 8.8,
    isBottleneck: false,
    category: "kinematic_motion",
    optimizationPotentialSec: 0.15,
    description: "Z-axis rapid vertical clearance to avoid collision with fixture clamp pins.",
  },
  {
    id: "p6",
    name: "Conveyor Handoff & Pneumatic Blow-Off Release",
    shortName: "Handoff Release",
    durationSec: 0.35,
    percentage: 6.9,
    isBottleneck: false,
    category: "tooling_actuation",
    optimizationPotentialSec: 0.20,
    description: "Direct ejection onto downstream indexer with synchronized optical encoder tracking.",
  },
];

/**
 * Calculates cycle breakdown metrics with optional AI-pipeline optimization
 */
export function calculateCycleBreakdown(
  phases: CyclePhaseTiming[],
  applyOptimizations: boolean = false,
) {
  let totalSec = 0;
  const processed = phases.map((p) => {
    const activeDuration = applyOptimizations
      ? Math.max(0.1, Number((p.durationSec - p.optimizationPotentialSec).toFixed(2)))
      : p.durationSec;
    totalSec += activeDuration;
    return {
      ...p,
      durationSec: activeDuration,
    };
  });

  // Calculate percentages and bottleneck
  let maxDuration = 0;
  let bottleneckId = "";
  processed.forEach((p) => {
    if (p.durationSec > maxDuration) {
      maxDuration = p.durationSec;
      bottleneckId = p.id;
    }
  });

  const finalPhases = processed.map((p) => ({
    ...p,
    percentage: Number(((p.durationSec / totalSec) * 100).toFixed(1)),
    isBottleneck: p.id === bottleneckId,
  }));

  const potentialSavingsSec = phases.reduce((acc, p) => acc + p.optimizationPotentialSec, 0);

  return {
    phases: finalPhases,
    totalCycleTimeSec: Number(totalSec.toFixed(2)),
    hourlyThroughput: Math.round(3600 / totalSec),
    bottleneckPhase: finalPhases.find((p) => p.isBottleneck),
    potentialSavingsSec: Number(potentialSavingsSec.toFixed(2)),
  };
}

/**
 * Calculates wrist torque loading and overhung moment margin
 */
export function calculateWristLoading(input: WristLoadingInput): WristLoadingOutput {
  const specs = ROBOT_SPECS_DATABASE[input.robotClass];
  const totalPayloadKg = Number((input.endEffectorMassKg + input.workpieceMassKg).toFixed(2));
  const payloadUtilization = Number(((totalPayloadKg / specs.ratedPayloadKg) * 100).toFixed(1));

  // Center of Gravity distance in meters from wrist flange
  const rMeters =
    Math.sqrt(
      Math.pow(input.cogOffsetXmm, 2) +
        Math.pow(input.cogOffsetYmm, 2) +
        Math.pow(input.cogOffsetZmm, 2),
    ) / 1000;

  // Static gravity torque (T_stat = m * g * r)
  const g = 9.81;
  const staticTorque = totalPayloadKg * g * rMeters;

  // Dynamic inertial torque (T_dyn = m * a * r + I * alpha)
  const linearAccMps2 = input.maxAccelerationG * g;
  const dynamicTorque = totalPayloadKg * linearAccMps2 * rMeters;

  const totalTorque = Number((staticTorque + dynamicTorque).toFixed(2));

  // Overhung moment (M = F * L_z)
  const overhungMoment = Number((totalPayloadKg * (g + linearAccMps2) * (input.cogOffsetZmm / 1000)).toFixed(2));

  const safetyFactor = Number((specs.allowableTorqueNm / totalTorque).toFixed(2));
  const momentUtilization = Number(((overhungMoment / specs.allowableMomentNm) * 100).toFixed(1));

  let status: WristLoadingOutput["status"] = "SAFE";
  if (safetyFactor < 1.0 || payloadUtilization > 100 || momentUtilization > 100) {
    status = "OVERLOADED";
  } else if (safetyFactor < 1.3 || payloadUtilization > 85 || momentUtilization > 85) {
    status = "MARGINAL";
  }

  return {
    totalPayloadKg,
    ratedPayloadKg: specs.ratedPayloadKg,
    payloadUtilizationPercent: payloadUtilization,
    staticTorqueNm: Number(staticTorque.toFixed(2)),
    dynamicInertialTorqueNm: Number(dynamicTorque.toFixed(2)),
    totalEquivalentTorqueNm: totalTorque,
    allowableTorqueNm: specs.allowableTorqueNm,
    safetyFactor,
    status,
    overhungMomentNm: overhungMoment,
    allowableOverhungMomentNm: specs.allowableMomentNm,
    momentUtilizationPercent: momentUtilization,
  };
}

/**
 * Calculates Overall Equipment Effectiveness (OEE) and identifies primary loss mode
 */
export function calculateOee(input: OeeAnalysisInput): OeeAnalysisOutput {
  const totalPlannedMins = input.plannedShiftHours * 60;
  const netPlannedProductionMins = Math.max(1, totalPlannedMins - input.plannedMaintenanceMins);

  // Operating Time = Net Planned - Unplanned Downtime
  const operatingTimeMins = Math.max(0, netPlannedProductionMins - input.unplannedDowntimeMins);

  // Availability = Operating Time / Net Planned Time
  const availability = Math.min(1, Math.max(0, operatingTimeMins / netPlannedProductionMins));

  // Performance = (Total Parts * Ideal Cycle Time Sec) / (Operating Time in Sec)
  const operatingTimeSec = operatingTimeMins * 60;
  const idealProductionSec = input.totalPartsProduced * input.idealCycleTimeSec;
  const performance = operatingTimeSec > 0 ? Math.min(1, Math.max(0, idealProductionSec / operatingTimeSec)) : 0;

  // Quality = (Total Parts - Defect Parts) / Total Parts
  const goodParts = Math.max(0, input.totalPartsProduced - input.defectPartsCount);
  const quality = input.totalPartsProduced > 0 ? Math.min(1, Math.max(0, goodParts / input.totalPartsProduced)) : 0;

  const oee = availability * performance * quality;

  const availabilityPercent = Number((availability * 100).toFixed(1));
  const performancePercent = Number((performance * 100).toFixed(1));
  const qualityPercent = Number((quality * 100).toFixed(1));
  const overallOeePercent = Number((oee * 100).toFixed(1));

  // Lost Production Units = What could have been produced in 100% ideal state minus actual good parts
  const potentialParts = Math.floor((netPlannedProductionMins * 60) / input.idealCycleTimeSec);
  const lostProductionUnits = Math.max(0, potentialParts - goodParts);

  // Determine top loss mode
  const availabilityLoss = 100 - availabilityPercent;
  const performanceLoss = 100 - performancePercent;
  const qualityLoss = 100 - qualityPercent;

  let topLossCategory: OeeAnalysisOutput["topLossCategory"] = "Performance Loss (Speed)";
  if (availabilityLoss >= performanceLoss && availabilityLoss >= qualityLoss) {
    topLossCategory = "Availability Loss (Downtime)";
  } else if (qualityLoss >= performanceLoss && qualityLoss >= availabilityLoss) {
    topLossCategory = "Quality Loss (Defects)";
  }

  let status: OeeAnalysisOutput["status"] = "GOOD";
  if (overallOeePercent >= 85) status = "WORLD_CLASS";
  else if (overallOeePercent < 65) status = "CRITICAL";
  else if (overallOeePercent < 75) status = "REQUIRES_OPTIMIZATION";

  const insights: string[] = [];
  if (availabilityPercent < 90) {
    insights.push(`Unplanned downtime (${input.unplannedDowntimeMins} mins) accounts for ${Math.round((input.unplannedDowntimeMins * 60) / input.idealCycleTimeSec)} lost workpieces. Recommend pre-flight sensor checks.`);
  }
  if (performancePercent < 88) {
    insights.push(`Operating speed is lagging ideal benchmark by ${(100 - performancePercent).toFixed(1)}%. Upgrade trajectory interpolator to S-Curve profiles to avoid trajectory deceleration damping.`);
  }
  if (qualityPercent < 98) {
    insights.push(`Part scrap rate (${input.defectPartsCount} units) detected. Integrate wrist laser metrology to weed out defective raw stock before expensive weld operations.`);
  }
  if (insights.length === 0) {
    insights.push("Workcell is running at world-class OEE efficiency (>85%). Continue predictive vibration monitoring on J1-J3 reducers.");
  }

  return {
    operatingTimeMins,
    availabilityPercent,
    performancePercent,
    qualityPercent,
    overallOeePercent,
    status,
    lostProductionUnits,
    topLossCategory,
    actionableInsights: insights,
  };
}

/**
 * Returns dynamic trajectory profile comparison
 */
export function getTrajectoryComparison(
  distanceMm: number,
  maxVelocityMps: number,
): TrajectoryProfileComparison[] {
  const distM = distanceMm / 1000;
  const vMax = maxVelocityMps;

  // Trapezoidal
  const trapAcc = 9.81 * 1.5; // 1.5G
  const trapTime = distM / vMax + vMax / trapAcc;
  const trapSettling = 145; // ms due to jerk excitation

  // S-Curve
  const scurveAcc = 9.81 * 1.2;
  const scurveTime = (distM / vMax + vMax / scurveAcc) * 1.08;
  const scurveSettling = 22; // ms - quick settling

  // Quintic
  const quinticTime = (distM / vMax + vMax / scurveAcc) * 1.14;
  const quinticSettling = 8; // near-zero residual vibration

  return [
    {
      profileType: "Trapezoidal (Bang-Bang)",
      peakAccelerationMps2: Number(trapAcc.toFixed(1)),
      peakJerkMps3: 450, // Infinite theoretical jerk, high practical peak
      trajectoryDurationSec: Number(trapTime.toFixed(2)),
      vibrationalSettlingTimeMs: trapSettling,
      totalCycleTimeSec: Number((trapTime + trapSettling / 1000).toFixed(2)),
      reducerStressIndex: 92,
      estimatedL10hLifeHours: 14500,
    },
    {
      profileType: "S-Curve (Jerk-Limited)",
      peakAccelerationMps2: Number(scurveAcc.toFixed(1)),
      peakJerkMps3: 35,
      trajectoryDurationSec: Number(scurveTime.toFixed(2)),
      vibrationalSettlingTimeMs: scurveSettling,
      totalCycleTimeSec: Number((scurveTime + scurveSettling / 1000).toFixed(2)),
      reducerStressIndex: 42,
      estimatedL10hLifeHours: 24800,
    },
    {
      profileType: "Quintic Spline (Minimum-Jerk)",
      peakAccelerationMps2: Number((scurveAcc * 0.95).toFixed(1)),
      peakJerkMps3: 18,
      trajectoryDurationSec: Number(quinticTime.toFixed(2)),
      vibrationalSettlingTimeMs: quinticSettling,
      totalCycleTimeSec: Number((quinticTime + quinticSettling / 1000).toFixed(2)),
      reducerStressIndex: 26,
      estimatedL10hLifeHours: 32000,
    },
  ];
}
