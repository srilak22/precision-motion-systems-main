"use client";

import React, { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  Gauge,
  Sliders,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Zap,
  Target,
  Layers,
  ArrowRight,
  Download,
  Share2,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Wrench,
  Boxes,
  Cpu,
  BarChart3,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useModals } from "@/components/modals/ModalContext";
import { companyConfig } from "@/data/config";
import {
  ROBOT_SPECS_DATABASE,
  INITIAL_CYCLE_PHASES,
  calculateCycleBreakdown,
  calculateWristLoading,
  calculateOee,
  getTrajectoryComparison,
} from "@/data/mockRpaAnalysisData";
import type {
  RobotArmClass,
  CyclePhaseTiming,
  WristLoadingInput,
  OeeAnalysisInput,
} from "@/types/rpaAnalysis";

export function RoboticProcessAnalysisTools() {
  const { openModal } = useModals();

  // Active Tool Module Tab
  const [activeTool, setActiveTool] = useState<
    "cycle_bottleneck" | "wrist_loading" | "oee_diagnostics" | "trajectory_jerk"
  >("cycle_bottleneck");

  // 1. Cycle Time State
  const [cyclePhases, setCyclePhases] = useState<CyclePhaseTiming[]>(INITIAL_CYCLE_PHASES);
  const [applyOptimizations, setApplyOptimizations] = useState<boolean>(false);

  // 2. Wrist Loading State
  const [wristInput, setWristInput] = useState<WristLoadingInput>({
    robotClass: "INDUS-ARM-12 (12kg / 1300mm)",
    endEffectorMassKg: 3.2,
    workpieceMassKg: 4.8,
    cogOffsetXmm: 45,
    cogOffsetYmm: 20,
    cogOffsetZmm: 135,
    maxAccelerationG: 1.2,
  });

  // 3. OEE Diagnostics State
  const [oeeInput, setOeeInput] = useState<OeeAnalysisInput>({
    plannedShiftHours: 8.0,
    plannedMaintenanceMins: 25,
    unplannedDowntimeMins: 40,
    idealCycleTimeSec: 2.4,
    totalPartsProduced: 8600,
    defectPartsCount: 95,
  });

  // 4. Trajectory Profile State
  const [trajDistanceMm, setTrajDistanceMm] = useState<number>(650);
  const [trajMaxVelocityMps, setTrajMaxVelocityMps] = useState<number>(2.2);

  // Computed Cycle Metrics
  const cycleMetrics = useMemo(() => {
    return calculateCycleBreakdown(cyclePhases, applyOptimizations);
  }, [cyclePhases, applyOptimizations]);

  // Computed Wrist Loading Metrics
  const wristMetrics = useMemo(() => {
    return calculateWristLoading(wristInput);
  }, [wristInput]);

  // Computed OEE Metrics
  const oeeMetrics = useMemo(() => {
    return calculateOee(oeeInput);
  }, [oeeInput]);

  // Computed Trajectory Profiles
  const trajectoryProfiles = useMemo(() => {
    return getTrajectoryComparison(trajDistanceMm, trajMaxVelocityMps);
  }, [trajDistanceMm, trajMaxVelocityMps]);

  const handlePhaseDurationChange = (id: string, newDuration: number) => {
    setCyclePhases((prev) =>
      prev.map((p) => (p.id === id ? { ...p, durationSec: newDuration } : p)),
    );
  };

  const handleExportReport = () => {
    const payload = {
      timestamp: new Date().toISOString(),
      cycleAnalysis: {
        totalCycleTimeSec: cycleMetrics.totalCycleTimeSec,
        hourlyThroughput: cycleMetrics.hourlyThroughput,
        bottleneck: cycleMetrics.bottleneckPhase?.name,
      },
      wristLoading: {
        robotClass: wristInput.robotClass,
        safetyFactor: wristMetrics.safetyFactor,
        status: wristMetrics.status,
        torqueUtilization: `${wristMetrics.payloadUtilizationPercent}%`,
      },
      oeeAudit: {
        overallOeePercent: `${oeeMetrics.overallOeePercent}%`,
        status: oeeMetrics.status,
        topLoss: oeeMetrics.topLossCategory,
      },
    };

    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    toast.success("Process Engineering Diagnostic Audit exported to clipboard", {
      description: "ISO 9283 / DIN 3990 calculation audit data ready for CAD/MES review.",
    });
  };

  const handleWhatsApp = () => {
    window.open(companyConfig.getWhatsAppUrl({ type: "general" }), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="w-full bg-slate-50 text-slate-900 min-h-screen">
      {/* =========================================================================
          HERO BANNER: Process Analysis Tools
         ========================================================================= */}
      <section className="relative overflow-hidden bg-[#0A1120] text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: "radial-gradient(#2388FF 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative max-w-7xl mx-auto">
          {/* Breadcrumbs / Subhead */}
          <div className="flex items-center gap-2 mb-3">
            <Link
              to="/robotic-process-automation"
              className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 hover:underline"
            >
              RPA Solutions
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-xs font-mono text-slate-400 uppercase">Process Engineering</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-mono uppercase tracking-wider">
                <Activity size={13} className="text-cyan-400" />
                <span>Kinematic Physics &amp; OEE Optimization Suite &bull; DIN 3990 / ISO 9283</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-display font-bold uppercase text-white tracking-tight leading-[1.05]">
                Robotic Process <span className="text-cyan-400">Analysis Tools</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                Identify microscopic cycle time bottlenecks, prevent motor torque overloads, diagnose OEE availability losses, and optimize trajectory jerk profiles with verified industrial mathematics.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
              <Button
                onClick={handleExportReport}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase px-5 py-2.5 rounded-xl shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2"
              >
                <Download size={14} />
                Export Audit Report (JSON)
              </Button>
              <Button
                variant="outline"
                onClick={() => openModal("engineer")}
                className="border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold text-xs uppercase px-5 py-2.5 rounded-xl flex items-center justify-center gap-2"
              >
                <Calendar size={14} className="text-cyan-400" />
                Review With Applications Lead
              </Button>
            </div>
          </div>

          {/* Module Selector Navigation Tabs */}
          <div className="mt-10 pt-6 border-t border-slate-800 flex flex-wrap items-center gap-2">
            {[
              {
                id: "cycle_bottleneck",
                label: "Cycle Time & Bottleneck Waterfall",
                icon: Clock,
                badge: `${cycleMetrics.totalCycleTimeSec}s`,
              },
              {
                id: "wrist_loading",
                label: "Wrist Torque & Overhung Inertia",
                icon: Gauge,
                badge: `SF ${wristMetrics.safetyFactor}`,
              },
              {
                id: "oee_diagnostics",
                label: "OEE & Root-Cause Loss Diagnostics",
                icon: BarChart3,
                badge: `${oeeMetrics.overallOeePercent}%`,
              },
              {
                id: "trajectory_jerk",
                label: "Trajectory Profiling & Settling Time",
                icon: TrendingUp,
                badge: "S-Curve vs Trap",
              },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTool === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTool(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold"
                      : "bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-slate-800"
                  }`}
                >
                  <Icon size={14} className={isActive ? "text-white" : "text-cyan-400"} />
                  <span>{tab.label}</span>
                  <span
                    className={`ml-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      isActive ? "bg-white/20 text-white" : "bg-slate-800 text-cyan-300"
                    }`}
                  >
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          MODULE 1: CYCLE TIME BREAKDOWN & BOTTLENECK WATERFALL ANALYZER
         ========================================================================= */}
      {activeTool === "cycle_bottleneck" && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-mono text-xs font-semibold mb-2">
                <Clock size={13} />
                <span>Microsecond-Precision Cycle Audit</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-display font-bold text-slate-900 uppercase">
                Kinematic Cycle Breakdown &amp; Bottleneck Waterfall
              </h2>
              <p className="text-sm text-slate-600 mt-1 max-w-2xl">
                Deconstruct complete pick, process, and handoff sequences. Identify the critical-path bottleneck and simulate seconds reclaimed via AI pre-sighting and quick-exhaust vacuum valves.
              </p>
            </div>

            {/* AI Optimization Simulation Switch */}
            <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-700">Simulate INDUS Optimizations:</span>
              <button
                type="button"
                onClick={() => setApplyOptimizations(!applyOptimizations)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  applyOptimizations ? "bg-emerald-600" : "bg-slate-300"
                }`}
              >
                <span
                  className={`inline-block size-4 transform rounded-full bg-white transition-transform ${
                    applyOptimizations ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span className="text-xs font-mono font-bold text-emerald-600">
                {applyOptimizations ? "- 1.95s Saved" : "Off"}
              </span>
            </div>
          </div>

          {/* Metric Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-[11px] font-mono text-slate-500 uppercase">Total Cycle Time</div>
              <div className="text-2xl sm:text-3xl font-display font-bold text-blue-600 mt-1">
                {cycleMetrics.totalCycleTimeSec}s
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-1">
                {applyOptimizations ? "Optimized Pipeline" : "Standard Baseline"}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-[11px] font-mono text-slate-500 uppercase">Hourly Output</div>
              <div className="text-2xl sm:text-3xl font-display font-bold text-emerald-600 mt-1">
                {cycleMetrics.hourlyThroughput.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-1">Parts / Workcell Hour</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-[11px] font-mono text-slate-500 uppercase">Critical Bottleneck</div>
              <div className="text-lg sm:text-xl font-bold text-rose-600 mt-1 truncate">
                {cycleMetrics.bottleneckPhase?.shortName}
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-1">
                {cycleMetrics.bottleneckPhase?.percentage}% of total cycle
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-[11px] font-mono text-slate-500 uppercase">Reclaimable Headroom</div>
              <div className="text-2xl sm:text-3xl font-display font-bold text-cyan-600 mt-1">
                {cycleMetrics.potentialSavingsSec}s
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-1">
                + {Math.round((cycleMetrics.potentialSavingsSec / cycleMetrics.totalCycleTimeSec) * 100)}% Throughput Gain
              </div>
            </div>
          </div>

          {/* Interactive Phase Sliders & Waterfall Visualizer */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-base font-bold text-slate-900 uppercase font-mono flex items-center justify-between">
                <span>Phase Duration Tuning (Seconds):</span>
                <button
                  type="button"
                  onClick={() => setCyclePhases(INITIAL_CYCLE_PHASES)}
                  className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                >
                  <RotateCcw size={12} />
                  Reset Defaults
                </button>
              </h3>

              <div className="space-y-4">
                {cycleMetrics.phases.map((phase) => (
                  <div
                    key={phase.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      phase.isBottleneck
                        ? "bg-rose-50/50 border-rose-300 ring-1 ring-rose-300"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 uppercase">
                          {phase.name}
                        </span>
                        {phase.isBottleneck && (
                          <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-mono text-[9px] font-bold uppercase tracking-wider">
                            Bottleneck ({phase.percentage}%)
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-xs font-bold text-blue-700">
                        {phase.durationSec}s
                      </span>
                    </div>

                    <input
                      type="range"
                      min="0.1"
                      max="3.5"
                      step="0.05"
                      value={phase.durationSec}
                      onChange={(e) =>
                        handlePhaseDurationChange(phase.id, Number(e.target.value))
                      }
                      className="w-full accent-blue-600 cursor-pointer"
                    />

                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mt-1">
                      <span>{phase.description}</span>
                      <span className="text-emerald-600 font-bold">
                        Opt Potential: -{phase.optimizationPotentialSec}s
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Waterfall Breakdown Chart (Right Column) */}
            <div className="lg:col-span-4 bg-[#0B132B] text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-mono font-bold uppercase text-cyan-300">
                    Cycle Time Distribution
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">100% Sequence</span>
                </div>

                <div className="space-y-3.5 my-6">
                  {cycleMetrics.phases.map((p) => (
                    <div key={p.id} className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-300 truncate">{p.shortName}</span>
                        <span className={p.isBottleneck ? "text-rose-400 font-bold" : "text-slate-400"}>
                          {p.percentage}% ({p.durationSec}s)
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            p.isBottleneck ? "bg-rose-500" : "bg-blue-500"
                          }`}
                          style={{ width: `${Math.max(5, p.percentage)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-1.5">
                  <div className="font-bold text-cyan-300 font-mono uppercase">
                    Optimization Recommendation:
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    The primary bottleneck is <strong>{cycleMetrics.bottleneckPhase?.name}</strong>. Re-programming trajectory to S-Curve and upgrading to piezoresistive vacuum sensors can reclaim{" "}
                    <span className="text-emerald-400 font-bold">
                      {cycleMetrics.bottleneckPhase?.optimizationPotentialSec} seconds
                    </span>.
                  </p>
                </div>
              </div>

              <Button
                onClick={() => openModal("engineer")}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase py-2.5 rounded-xl mt-4"
              >
                Request Kinematic Optimization Audit
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          MODULE 2: MULTI-AXIS WRIST TORQUE & OVERHUNG INERTIA MARGIN ANALYZER
         ========================================================================= */}
      {activeTool === "wrist_loading" && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-mono text-xs font-semibold mb-2">
              <Gauge size={13} />
              <span>ISO 9283 / DIN 3990 Dynamic Stress Validation</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-slate-900 uppercase">
              Wrist Torque &amp; Overhung Moment Safety Margin Analyzer
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Calculate dynamic inertial moments and static gravity loads across the wrist flange. Prevents joint reducer gear tooth stripping, motor driver overcurrent trips, and trajectory overshoot.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Input Controls (Left Column) */}
            <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-base font-bold text-slate-900 uppercase font-mono flex items-center gap-2">
                <Sliders size={16} className="text-blue-600" />
                Physical Tooling &amp; Motion Parameters:
              </h3>

              {/* Robot Class Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-700 uppercase block">
                  Select Robot Arm Model:
                </label>
                <select
                  value={wristInput.robotClass}
                  onChange={(e) =>
                    setWristInput({ ...wristInput, robotClass: e.target.value as RobotArmClass })
                  }
                  className="w-full h-11 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold font-mono text-slate-900 focus:outline-none focus:border-blue-500"
                >
                  {Object.keys(ROBOT_SPECS_DATABASE).map((arm) => (
                    <option key={arm} value={arm}>
                      {arm}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mass Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono font-bold">
                    <span className="text-slate-700">End-Effector Mass:</span>
                    <span className="text-blue-600">{wristInput.endEffectorMassKg} kg</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="20"
                    step="0.1"
                    value={wristInput.endEffectorMassKg}
                    onChange={(e) =>
                      setWristInput({
                        ...wristInput,
                        endEffectorMassKg: Number(e.target.value),
                      })
                    }
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono font-bold">
                    <span className="text-slate-700">Workpiece Mass:</span>
                    <span className="text-blue-600">{wristInput.workpieceMassKg} kg</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="30"
                    step="0.1"
                    value={wristInput.workpieceMassKg}
                    onChange={(e) =>
                      setWristInput({
                        ...wristInput,
                        workpieceMassKg: Number(e.target.value),
                      })
                    }
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>
              </div>

              {/* Center of Gravity Offsets */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="text-xs font-mono font-bold text-slate-700 uppercase">
                  Tool Center of Gravity (CoG) Offset:
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-600">Offset X:</span>
                    <span className="font-bold text-slate-900">{wristInput.cogOffsetXmm} mm</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="300"
                    step="5"
                    value={wristInput.cogOffsetXmm}
                    onChange={(e) =>
                      setWristInput({ ...wristInput, cogOffsetXmm: Number(e.target.value) })
                    }
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-600">Offset Y:</span>
                    <span className="font-bold text-slate-900">{wristInput.cogOffsetYmm} mm</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="300"
                    step="5"
                    value={wristInput.cogOffsetYmm}
                    onChange={(e) =>
                      setWristInput({ ...wristInput, cogOffsetYmm: Number(e.target.value) })
                    }
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-600">Offset Z (Overhung Reach):</span>
                    <span className="font-bold text-blue-600">{wristInput.cogOffsetZmm} mm</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="500"
                    step="5"
                    value={wristInput.cogOffsetZmm}
                    onChange={(e) =>
                      setWristInput({ ...wristInput, cogOffsetZmm: Number(e.target.value) })
                    }
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>
              </div>

              {/* Acceleration G */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <div className="flex justify-between text-xs font-mono font-bold">
                  <span className="text-slate-700">Peak TCP Acceleration:</span>
                  <span className="text-amber-600">{wristInput.maxAccelerationG} G ({Math.round(wristInput.maxAccelerationG * 9.81)} m/s&sup2;)</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3.0"
                  step="0.1"
                  value={wristInput.maxAccelerationG}
                  onChange={(e) =>
                    setWristInput({ ...wristInput, maxAccelerationG: Number(e.target.value) })
                  }
                  className="w-full accent-amber-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Output Calculation Dashboard (Right Column) */}
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-[#0A1120] text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6">
                {/* Header Status Badge */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-mono text-cyan-400 uppercase font-bold">
                      Wrist Stress Safety Factor
                    </span>
                    <div className="text-4xl sm:text-5xl font-display font-bold text-white mt-1">
                      SF {wristMetrics.safetyFactor}
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1.5 rounded-full font-mono text-xs font-bold uppercase tracking-wider ${
                      wristMetrics.status === "SAFE"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : wristMetrics.status === "MARGINAL"
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                    }`}
                  >
                    {wristMetrics.status} LOAD
                  </span>
                </div>

                {/* Metrics Breakdown Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                    <div className="text-[11px] font-mono text-slate-400 uppercase">
                      Total Payload Mass
                    </div>
                    <div className="text-xl font-mono font-bold text-white mt-1">
                      {wristMetrics.totalPayloadKg} kg{" "}
                      <span className="text-xs text-slate-400">/ {wristMetrics.ratedPayloadKg}kg</span>
                    </div>
                    <div className="text-[10px] text-cyan-300 font-mono mt-0.5">
                      {wristMetrics.payloadUtilizationPercent}% of rated payload
                    </div>
                  </div>

                  <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                    <div className="text-[11px] font-mono text-slate-400 uppercase">
                      Total Combined Torque
                    </div>
                    <div className="text-xl font-mono font-bold text-cyan-300 mt-1">
                      {wristMetrics.totalEquivalentTorqueNm} Nm
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Limit: {wristMetrics.allowableTorqueNm} Nm
                    </div>
                  </div>

                  <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                    <div className="text-[11px] font-mono text-slate-400 uppercase">
                      Overhung Moment
                    </div>
                    <div className="text-xl font-mono font-bold text-amber-300 mt-1">
                      {wristMetrics.overhungMomentNm} Nm
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Limit: {wristMetrics.allowableOverhungMomentNm} Nm ({wristMetrics.momentUtilizationPercent}%)
                    </div>
                  </div>

                  <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                    <div className="text-[11px] font-mono text-slate-400 uppercase">
                      Static vs Dynamic Load
                    </div>
                    <div className="text-xs font-mono font-bold text-slate-200 mt-1 space-y-0.5">
                      <div>Gravity: {wristMetrics.staticTorqueNm} Nm</div>
                      <div>Inertial: {wristMetrics.dynamicInertialTorqueNm} Nm</div>
                    </div>
                  </div>
                </div>

                {/* Sizing Advisory */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
                  <div className="font-bold text-cyan-300 font-mono uppercase mb-1">
                    Kinematic Safety Verdict:
                  </div>
                  {wristMetrics.status === "SAFE" ? (
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      All joint reducers operate within certified continuous duty (L10h &ge; 25,000h) envelope. Safe for full-speed 24/7 manufacturing without thermal throttling.
                    </p>
                  ) : wristMetrics.status === "MARGINAL" ? (
                    <p className="text-amber-300 text-[11px] leading-relaxed">
                      Overhung moment is near 85% threshold. Recommend trimming Z-axis extension by 25mm or reducing TCP acceleration to 1.0G to avoid accelerated reducer backlash development.
                    </p>
                  ) : (
                    <p className="text-rose-300 text-[11px] leading-relaxed">
                      CRITICAL OVERLOAD: The combined payload and dynamic moment exceed ISO 9283 rated specifications. Upgrade to next frame size or redesign tooling with lightweight carbon fiber.
                    </p>
                  )}
                </div>

                <Button
                  onClick={() => openModal("engineer")}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase py-2.5 rounded-xl"
                >
                  Verify Flange CAD With INDUS Engineering
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          MODULE 3: OEE & ROOT-CAUSE LOSS DIAGNOSTIC SIMULATOR
         ========================================================================= */}
      {activeTool === "oee_diagnostics" && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-mono text-xs font-semibold mb-2">
              <BarChart3 size={13} />
              <span>Semiconductor / Automotive Grade OEE Model</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-slate-900 uppercase">
              Overall Equipment Effectiveness (OEE) Loss Diagnostics
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Unpack availability, operating performance, and quality yield losses. Pinpoint root causes dragging down factory productivity and reclaim lost daily unit capacity.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Input Parameters (Left Column) */}
            <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-base font-bold text-slate-900 uppercase font-mono flex items-center gap-2">
                <Sliders size={16} className="text-blue-600" />
                Shift Production Inputs:
              </h3>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono font-bold">
                  <span className="text-slate-700">Planned Shift Hours:</span>
                  <span className="text-blue-600">{oeeInput.plannedShiftHours} Hours</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="12"
                  step="0.5"
                  value={oeeInput.plannedShiftHours}
                  onChange={(e) =>
                    setOeeInput({ ...oeeInput, plannedShiftHours: Number(e.target.value) })
                  }
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono font-bold">
                  <span className="text-slate-700">Unplanned Downtime (Faults / Minor Stops):</span>
                  <span className="text-rose-600">{oeeInput.unplannedDowntimeMins} Minutes</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="120"
                  step="5"
                  value={oeeInput.unplannedDowntimeMins}
                  onChange={(e) =>
                    setOeeInput({ ...oeeInput, unplannedDowntimeMins: Number(e.target.value) })
                  }
                  className="w-full accent-rose-600 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono font-bold">
                  <span className="text-slate-700">Ideal Engineering Cycle Time:</span>
                  <span className="text-blue-600">{oeeInput.idealCycleTimeSec} Seconds</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="10"
                  step="0.1"
                  value={oeeInput.idealCycleTimeSec}
                  onChange={(e) =>
                    setOeeInput({ ...oeeInput, idealCycleTimeSec: Number(e.target.value) })
                  }
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono font-bold">
                  <span className="text-slate-700">Actual Total Parts Produced:</span>
                  <span className="text-slate-900">{oeeInput.totalPartsProduced.toLocaleString()} Parts</span>
                </div>
                <input
                  type="range"
                  min="2000"
                  max="20000"
                  step="200"
                  value={oeeInput.totalPartsProduced}
                  onChange={(e) =>
                    setOeeInput({ ...oeeInput, totalPartsProduced: Number(e.target.value) })
                  }
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono font-bold">
                  <span className="text-slate-700">Defective / Scrapped Parts:</span>
                  <span className="text-amber-600">{oeeInput.defectPartsCount} Parts</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="400"
                  step="5"
                  value={oeeInput.defectPartsCount}
                  onChange={(e) =>
                    setOeeInput({ ...oeeInput, defectPartsCount: Number(e.target.value) })
                  }
                  className="w-full accent-amber-600 cursor-pointer"
                />
              </div>
            </div>

            {/* OEE Scorecard (Right Column) */}
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-[#0A1120] text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-mono text-cyan-400 uppercase font-bold">
                      Calculated Workcell OEE Score
                    </span>
                    <div className="text-4xl sm:text-5xl font-display font-bold text-white mt-1">
                      {oeeMetrics.overallOeePercent}%
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1.5 rounded-full font-mono text-xs font-bold uppercase tracking-wider ${
                      oeeMetrics.status === "WORLD_CLASS"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : oeeMetrics.status === "GOOD"
                        ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    }`}
                  >
                    {oeeMetrics.status.replace("_", " ")}
                  </span>
                </div>

                {/* 3 Pillars: Availability, Performance, Quality */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Availability</div>
                    <div className="text-xl sm:text-2xl font-mono font-bold text-white mt-1">
                      {oeeMetrics.availabilityPercent}%
                    </div>
                    <div className="text-[9px] text-slate-400 mt-0.5">Uptime ratio</div>
                  </div>

                  <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Performance</div>
                    <div className="text-xl sm:text-2xl font-mono font-bold text-cyan-300 mt-1">
                      {oeeMetrics.performancePercent}%
                    </div>
                    <div className="text-[9px] text-slate-400 mt-0.5">Speed efficiency</div>
                  </div>

                  <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Quality</div>
                    <div className="text-xl sm:text-2xl font-mono font-bold text-emerald-400 mt-1">
                      {oeeMetrics.qualityPercent}%
                    </div>
                    <div className="text-[9px] text-slate-400 mt-0.5">First-pass yield</div>
                  </div>
                </div>

                {/* Root Cause Loss Category */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400 uppercase">Primary Loss Driver:</span>
                    <span className="text-rose-400 font-bold">{oeeMetrics.topLossCategory}</span>
                  </div>
                  <div className="text-xs text-slate-300 space-y-1">
                    {oeeMetrics.actionableInsights.map((ins, i) => (
                      <div key={i} className="flex items-start gap-2 text-[11px] leading-relaxed">
                        <CheckCircle2 size={13} className="text-cyan-400 shrink-0 mt-0.5" />
                        <span>{ins}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => openModal("quote")}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase py-2.5 rounded-xl"
                >
                  Schedule Line Diagnostic Consultation
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          MODULE 4: TRAJECTORY PROFILING & VIBRATION SETTLING TIME SIMULATOR
         ========================================================================= */}
      {activeTool === "trajectory_jerk" && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 font-mono text-xs font-semibold mb-2">
                <TrendingUp size={13} />
                <span>Jerk Minimization &amp; Resonant Mode Damping</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-display font-bold text-slate-900 uppercase">
                Trajectory Profile &amp; Vibration Settling Time Analysis
              </h2>
              <p className="text-sm text-slate-600 mt-1 max-w-2xl">
                Compare classic Trapezoidal (Bang-Bang), Jerk-Limited S-Curve, and Minimum-Jerk Quintic Spline motion profiles. Minimize post-stop settling chatter to protect fragile workpieces and extend reducer life.
              </p>
            </div>

            {/* Distance & Speed Tuning */}
            <div className="flex flex-wrap items-center gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-xs font-mono">
                <span className="text-slate-500">Distance: </span>
                <span className="font-bold text-blue-600">{trajDistanceMm} mm</span>
              </div>
              <div className="text-xs font-mono">
                <span className="text-slate-500">Max Velocity: </span>
                <span className="font-bold text-blue-600">{trajMaxVelocityMps} m/s</span>
              </div>
            </div>
          </div>

          {/* Side by Side Profile Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trajectoryProfiles.map((prof, idx) => (
              <div
                key={idx}
                className={`bg-white rounded-3xl border p-6 sm:p-8 flex flex-col justify-between transition-all shadow-sm hover:shadow-xl ${
                  prof.profileType.includes("S-Curve")
                    ? "border-blue-500 ring-2 ring-blue-500/20"
                    : "border-slate-200"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold uppercase text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                      Tier {idx + 1}
                    </span>
                    {prof.profileType.includes("S-Curve") && (
                      <span className="text-[10px] font-mono font-bold uppercase text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        Recommended
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-display font-bold text-slate-900 uppercase">
                    {prof.profileType}
                  </h3>

                  <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Trajectory Time:</span>
                      <span className="font-bold text-slate-900">{prof.trajectoryDurationSec}s</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">Settling Delay:</span>
                      <span
                        className={`font-bold ${
                          prof.vibrationalSettlingTimeMs > 100 ? "text-rose-600" : "text-emerald-600"
                        }`}
                      >
                        {prof.vibrationalSettlingTimeMs} ms
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">Peak Jerk ($m/s^3$):</span>
                      <span className="font-bold text-slate-900">{prof.peakJerkMps3} m/s&sup3;</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">Total Stop Time:</span>
                      <span className="font-bold text-blue-600 text-sm">
                        {prof.totalCycleTimeSec}s
                      </span>
                    </div>

                    <div className="flex justify-between pt-2 border-t border-slate-200">
                      <span className="text-slate-500">L10h Bearing Life:</span>
                      <span className="font-bold text-emerald-700">
                        {prof.estimatedL10hLifeHours.toLocaleString()} Hours
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <div className="text-[10px] font-mono text-slate-400 mb-2">
                    Reducer Stress Index:
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-4">
                    <div
                      className={`h-full rounded-full ${
                        prof.reducerStressIndex > 75
                          ? "bg-rose-500"
                          : prof.reducerStressIndex > 35
                          ? "bg-blue-500"
                          : "bg-emerald-500"
                      }`}
                      style={{ width: `${prof.reducerStressIndex}%` }}
                    />
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      toast.success(`Configuring ${prof.profileType} Kinematic Spline`, {
                        description: `EtherCAT motion controller profile parameters updated for ${trajDistanceMm}mm stroke.`,
                      });
                    }}
                    className="w-full text-xs font-semibold border-slate-300"
                  >
                    Select This Profile
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          BOTTOM CALL TO ACTION & CONSULTATION BAR
         ========================================================================= */}
      <section className="bg-[#0A1120] text-white py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-mono uppercase tracking-wider">
            <ShieldCheck size={14} className="text-cyan-400" />
            <span>Applications Engineering Center of Excellence</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-bold text-white uppercase tracking-tight">
            Have a Specific Process Sizing Challenge?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Send our robotics applications team your CAD step files, target takt times, and payload dimensions for a free comprehensive kinematic and torque margin audit.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              onClick={() => openModal("engineer")}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-blue-600/30 uppercase text-xs tracking-wider"
            >
              <Calendar size={14} className="mr-1.5" />
              Schedule Engineering Session
            </Button>
            <Button
              variant="outline"
              onClick={handleWhatsApp}
              className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 font-bold px-6 py-3 rounded-xl text-xs uppercase"
            >
              <MessageSquare size={14} className="mr-1.5 text-emerald-400" />
              WhatsApp Engineer
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
