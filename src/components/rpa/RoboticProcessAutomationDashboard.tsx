"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  Cpu,
  Bot,
  CircuitBoard,
  Gauge,
  Layers,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  MessageSquare,
  FileText,
  Sliders,
  DollarSign,
  TrendingUp,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Download,
  Share2,
  ChevronRight,
  SlidersHorizontal,
  ExternalLink,
  Target,
  Settings2,
  Boxes,
  Factory,
  ChevronDown,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useModals } from "@/components/modals/ModalContext";
import { companyConfig } from "@/data/config";
import {
  RPA_WORKFLOW_STAGES,
  RPA_SOLUTION_CELLS,
  RPA_STACK_LAYERS,
  RPA_CASE_STUDIES,
  calculateRpaRoi,
  evaluateRpaAssessment,
} from "@/data/mockRpaData";
import type {
  RpaIndustry,
  RpaWorkflowStage,
  RpaSolutionCell,
  RpaAssessmentInputs,
} from "@/types/rpa";

export function RoboticProcessAutomationDashboard() {
  const { openModal } = useModals();

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<
    "pipeline" | "cells" | "calculator" | "stack" | "wizard"
  >("pipeline");

  // Pipeline simulation state
  const [activeStageId, setActiveStageId] = useState<string>("stage-1");
  const [isPlayingPipeline, setIsPlayingPipeline] = useState<boolean>(true);

  // Industry filter state for Turnkey cells
  const [selectedIndustry, setSelectedIndustry] = useState<RpaIndustry>("all");
  const [expandedCellId, setExpandedCellId] = useState<string | null>("cell-ev-battery");

  // ROI Calculator State
  const [shiftsPerDay, setShiftsPerDay] = useState<number>(2);
  const [manualCycleTimeSec, setManualCycleTimeSec] = useState<number>(14);
  const [laborHourlyRate, setLaborHourlyRate] = useState<number>(38);
  const [dailyVolume, setDailyVolume] = useState<number>(2200);
  const [scrapRatePercent, setScrapRatePercent] = useState<number>(3.2);

  // Wizard state
  const [wizardInputs, setWizardInputs] = useState<RpaAssessmentInputs>({
    partWeightCategory: "light",
    cycleTimeTarget: "fast",
    environmentRating: "standard_factory",
    batchMixType: "medium_mix",
  });

  // Calculate dynamic ROI results
  const roiResults = useMemo(() => {
    return calculateRpaRoi({
      shiftsPerDay,
      manualCycleTimeSec,
      laborHourlyRate,
      dailyProductionVolume: dailyVolume,
      scrapRatePercent,
      avgPartValue: 42,
    });
  }, [shiftsPerDay, manualCycleTimeSec, laborHourlyRate, dailyVolume, scrapRatePercent]);

  // Calculate dynamic Feasibility Wizard result
  const assessmentResult = useMemo(() => {
    return evaluateRpaAssessment(wizardInputs);
  }, [wizardInputs]);

  // Filtered Turnkey cells
  const filteredCells = useMemo(() => {
    if (selectedIndustry === "all") return RPA_SOLUTION_CELLS;
    return RPA_SOLUTION_CELLS.filter((cell) => cell.industry === selectedIndustry);
  }, [selectedIndustry]);

  // Active stage details
  const activeStage = useMemo(() => {
    return RPA_WORKFLOW_STAGES.find((s) => s.id === activeStageId) || RPA_WORKFLOW_STAGES[0];
  }, [activeStageId]);

  // Automated pipeline progression loop
  useEffect(() => {
    if (!isPlayingPipeline) return;
    const interval = setInterval(() => {
      setActiveStageId((prevId) => {
        const currentIndex = RPA_WORKFLOW_STAGES.findIndex((s) => s.id === prevId);
        const nextIndex = (currentIndex + 1) % RPA_WORKFLOW_STAGES.length;
        return RPA_WORKFLOW_STAGES[nextIndex].id;
      });
    }, 3200);
    return () => clearInterval(interval);
  }, [isPlayingPipeline]);

  const handleWhatsApp = () => {
    window.open(companyConfig.getWhatsAppUrl({ type: "general" }), "_blank", "noopener,noreferrer");
  };

  const handleDownloadSpec = (cellTitle: string) => {
    toast.success(`Exporting Technical Datasheet & CAD BOM for: ${cellTitle}`, {
      description: "ISO 10218-2 compliance packet generated. Download starting...",
    });
  };

  return (
    <div className="w-full bg-slate-50 text-slate-900 min-h-screen">
      {/* =========================================================================
          1. HERO SECTION: Physical AI & Industrial RPA Workcell Platform
         ========================================================================= */}
      <section className="relative overflow-hidden bg-[#0A1120] text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: "radial-gradient(#2388FF 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute -top-32 -right-32 size-96 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 size-96 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          {/* Eyebrow Label */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-mono uppercase tracking-wider mb-4">
            <Cpu size={14} className="text-cyan-400" />
            <span>Physical AI & Industrial RPA Workcell Architecture &bull; ISO 10218-2</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight text-white uppercase leading-[1.05]">
                Robotic Process <span className="text-cyan-400">Automation</span> (RPA)
              </h1>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                Replace rigid, manual manufacturing bottlenecks with sub-millimeter precision, 24/7 deterministic workcells, and adaptive AI machine vision. Engineered for high-mix electronic assembly, EV battery welding, sterile pharma packaging, and heavy machine tending.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  onClick={() => setActiveTab("pipeline")}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-lg shadow-lg shadow-blue-600/25 flex items-center gap-2"
                >
                  <Play size={15} />
                  Simulate Live Workcell
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("calculator")}
                  className="border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold px-5 py-2.5 rounded-lg flex items-center gap-2"
                >
                  <DollarSign size={15} className="text-emerald-400" />
                  Calculate ROI & Payback
                </Button>
                <Button
                  variant="outline"
                  onClick={() => openModal("engineer")}
                  className="border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold px-5 py-2.5 rounded-lg flex items-center gap-2"
                >
                  <Calendar size={15} className="text-cyan-400" />
                  Consult Robotics Engineer
                </Button>
              </div>
            </div>

            {/* Live KPI Metric Cards */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mb-1">
                  <span>THROUGHPUT</span>
                  <TrendingUp size={14} />
                </div>
                <div className="text-2xl sm:text-3xl font-display font-bold text-white">+ 340%</div>
                <p className="text-[11px] text-slate-400 mt-1">Average production rate amplification</p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="flex items-center justify-between text-xs font-mono text-blue-400 mb-1">
                  <span>CYCLE TIME</span>
                  <Clock size={14} />
                </div>
                <div className="text-2xl sm:text-3xl font-display font-bold text-white">&lt; 0.35s</div>
                <p className="text-[11px] text-slate-400 mt-1">Pick-and-place standard kinematic cycle</p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="flex items-center justify-between text-xs font-mono text-emerald-400 mb-1">
                  <span>ACCURACY</span>
                  <Target size={14} />
                </div>
                <div className="text-2xl sm:text-3xl font-display font-bold text-white">&plusmn; 0.008 mm</div>
                <p className="text-[11px] text-slate-400 mt-1">Zero-backlash harmonic precision</p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="flex items-center justify-between text-xs font-mono text-amber-400 mb-1">
                  <span>CAPITAL PAYBACK</span>
                  <Zap size={14} />
                </div>
                <div className="text-2xl sm:text-3xl font-display font-bold text-white">7.4 Mo</div>
                <p className="text-[11px] text-slate-400 mt-1">Full capital ROI break-even timeline</p>
              </div>
            </div>
          </div>

          {/* Quick Navigation Toolbar */}
          <div className="mt-10 pt-6 border-t border-slate-800 flex flex-wrap items-center gap-2">
            {[
              { id: "pipeline", label: "Interactive Workcell Pipeline", icon: Play },
              { id: "cells", label: "Turnkey Industrial Cells (6)", icon: Boxes },
              { id: "calculator", label: "ROI & Payback Calculator", icon: DollarSign },
              { id: "stack", label: "Physical AI Architecture Stack", icon: Layers },
              { id: "wizard", label: "RPA Feasibility Assessment", icon: SlidersHorizontal },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold"
                      : "bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-slate-800"
                  }`}
                >
                  <Icon size={14} className={isActive ? "text-white" : "text-cyan-400"} />
                  <span>{tab.label}</span>
                </button>
              );
            })}

            <Link
              to="/robotic-process-analysis-tools"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 ml-auto"
            >
              <Activity size={14} className="text-emerald-400" />
              <span>Process Analysis Tools &rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          TAB 1: INTERACTIVE WORKCELL PIPELINE SIMULATOR
         ========================================================================= */}
      {activeTab === "pipeline" && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-mono text-xs font-semibold mb-2">
                <Sparkles size={13} />
                <span>Deterministic Step Execution</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-display font-bold text-slate-900 uppercase">
                Interactive RPA Workcell Pipeline
              </h2>
              <p className="text-sm text-slate-600 mt-1 max-w-2xl">
                Observe the deterministic, 5-stage closed-loop automation cycle. Select any step to introspect real-time telemetry, trajectory splines, and hardware componentry.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPlayingPipeline(!isPlayingPipeline)}
                className="bg-white border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold"
              >
                {isPlayingPipeline ? (
                  <>
                    <Pause size={13} className="mr-1 text-amber-600" />
                    Pause Simulation
                  </>
                ) : (
                  <>
                    <Play size={13} className="mr-1 text-emerald-600" />
                    Auto-Run Pipeline
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveStageId("stage-1")}
                className="bg-white border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold"
              >
                <RotateCcw size={13} className="mr-1 text-blue-600" />
                Reset Step
              </Button>
            </div>
          </div>

          {/* Stepper Progression Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-8">
            {RPA_WORKFLOW_STAGES.map((stage) => {
              const isCurrent = stage.id === activeStageId;
              return (
                <button
                  key={stage.id}
                  onClick={() => {
                    setActiveStageId(stage.id);
                    setIsPlayingPipeline(false);
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    isCurrent
                      ? "bg-blue-600 text-white border-blue-700 shadow-xl shadow-blue-600/20 scale-[1.02]"
                      : "bg-white text-slate-800 border-slate-200 hover:border-blue-300 hover:bg-blue-50/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`size-6 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                        isCurrent ? "bg-white text-blue-700" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {stage.stepNumber}
                    </span>
                    <span
                      className={`font-mono text-[11px] font-bold ${
                        isCurrent ? "text-cyan-200" : "text-blue-600"
                      }`}
                    >
                      {stage.cycleTimeMs} ms
                    </span>
                  </div>
                  <h4 className="font-bold text-xs uppercase tracking-wide truncate">
                    {stage.shortName}
                  </h4>
                  <p
                    className={`text-[11px] mt-1 line-clamp-1 ${
                      isCurrent ? "text-blue-100" : "text-slate-500"
                    }`}
                  >
                    {stage.name}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Detailed Selected Stage Inspection Console */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            {/* Left Column: Stage Architecture & Protocol Info */}
            <div className="lg:col-span-7 p-6 sm:p-8 space-y-6 border-b lg:border-b-0 lg:border-r border-slate-200">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-bold uppercase">
                  Stage {activeStage.stepNumber} &bull; {activeStage.category.toUpperCase()}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {activeStage.telemetryMetrics.status}
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-display font-bold text-slate-900 uppercase">
                  {activeStage.name}
                </h3>
                <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                  {activeStage.description}
                </p>
              </div>

              {/* Protocol & Determinism Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase">Fieldbus Sync</div>
                  <div className="text-xs font-bold text-slate-800 truncate mt-0.5">
                    {activeStage.detailedSpecs.fieldbus}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase">Loop Rate</div>
                  <div className="text-xs font-bold text-slate-800 truncate mt-0.5">
                    {activeStage.detailedSpecs.refreshRate}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase">Repeatability</div>
                  <div className="text-xs font-bold text-slate-800 truncate mt-0.5">
                    &plusmn; {activeStage.repeatabilityMm} mm
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase">Safety Rating</div>
                  <div className="text-xs font-bold text-slate-800 truncate mt-0.5">
                    {activeStage.detailedSpecs.safetyStandard}
                  </div>
                </div>
              </div>

              {/* Hardware Subsystems */}
              <div>
                <h4 className="text-xs font-mono font-bold uppercase text-slate-700 mb-2">
                  Engineered Subsystems:
                </h4>
                <ul className="space-y-1.5">
                  {activeStage.hardwareComponents.map((comp, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100"
                    >
                      <CheckCircle2 size={14} className="text-blue-600 shrink-0" />
                      <span>{comp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column: Simulated Live Telemetry Oscilloscope */}
            <div className="lg:col-span-5 bg-[#0B132B] text-white p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-cyan-400 animate-ping" />
                    <span className="text-xs font-mono font-bold uppercase text-cyan-300">
                      Live Telemetry Stream
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">1.000 kHz EtherCAT DC</span>
                </div>

                {/* Simulated Telemetry Readings */}
                <div className="space-y-4 my-6">
                  <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                    <div className="text-[11px] font-mono text-slate-400 uppercase">
                      TCP Velocity Profile
                    </div>
                    <div className="text-xl font-mono font-bold text-white mt-1">
                      {activeStage.telemetryMetrics.tcpVelocity}
                    </div>
                  </div>

                  <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                    <div className="text-[11px] font-mono text-slate-400 uppercase">
                      Joint Torque Output
                    </div>
                    <div className="text-xl font-mono font-bold text-cyan-400 mt-1">
                      {activeStage.telemetryMetrics.dynamicTorque}
                    </div>
                  </div>

                  <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                    <div className="text-[11px] font-mono text-slate-400 uppercase">
                      Electrical Power Draw
                    </div>
                    <div className="text-xl font-mono font-bold text-emerald-400 mt-1">
                      {activeStage.telemetryMetrics.powerDrawKw} kW
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                <Button
                  onClick={() => openModal("engineer")}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase py-2.5 rounded-xl"
                >
                  Configure This Pipeline
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDownloadSpec(activeStage.name)}
                  className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 text-xs px-3 py-2.5 rounded-xl"
                  title="Download stage schematic"
                >
                  <Download size={14} />
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          TAB 2: TURNKEY INDUSTRIAL APPLICATION CELLS
         ========================================================================= */}
      {activeTab === "cells" && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-mono text-xs font-semibold mb-2">
                <Boxes size={13} />
                <span>Pre-Engineered Turnkey Workcells</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-display font-bold text-slate-900 uppercase">
                Standardized Industrial RPA Cells
              </h2>
              <p className="text-sm text-slate-600 mt-1 max-w-2xl">
                Field-tested automated workcells equipped with pre-certified mechanical flanges, deterministic kinematics controllers, and safety light curtains.
              </p>
            </div>

            {/* Industry Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 bg-white p-1 rounded-2xl border border-slate-200 shadow-xs">
              {[
                { id: "all", label: "All Sectors" },
                { id: "automotive_ev", label: "Automotive & EV" },
                { id: "electronics_semiconductor", label: "Electronics" },
                { id: "food_packaging", label: "Food & Pkg" },
                { id: "pharma_medical", label: "Pharma/Medical" },
                { id: "machining_metal", label: "Machining" },
              ].map((ind) => (
                <button
                  key={ind.id}
                  onClick={() => setSelectedIndustry(ind.id as RpaIndustry)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedIndustry === ind.id
                      ? "bg-blue-600 text-white font-bold shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {ind.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cells Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCells.map((cell) => {
              const isExpanded = expandedCellId === cell.id;
              return (
                <div
                  key={cell.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between"
                >
                  <div className="p-6 sm:p-8">
                    {/* Header Tags */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-mono font-bold uppercase">
                        {cell.industryLabel}
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-mono font-semibold">
                        {cell.robotType}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-display font-bold text-slate-900 uppercase">
                      {cell.title}
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed">
                      {cell.description}
                    </p>

                    {/* Specification Highlights Grid */}
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 my-5 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                      <div className="p-1.5">
                        <div className="text-[10px] font-mono text-slate-500 uppercase">Payload</div>
                        <div className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
                          {cell.payloadKg} kg
                        </div>
                      </div>
                      <div className="p-1.5">
                        <div className="text-[10px] font-mono text-slate-500 uppercase">Reach</div>
                        <div className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
                          {cell.reachMm} mm
                        </div>
                      </div>
                      <div className="p-1.5">
                        <div className="text-[10px] font-mono text-slate-500 uppercase">Cycle Time</div>
                        <div className="text-xs sm:text-sm font-bold text-blue-600 mt-0.5">
                          {cell.cycleTimeSec} s
                        </div>
                      </div>
                      <div className="p-1.5">
                        <div className="text-[10px] font-mono text-slate-500 uppercase">Repeatability</div>
                        <div className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
                          &plusmn;{cell.repeatabilityMm}mm
                        </div>
                      </div>
                      <div className="p-1.5">
                        <div className="text-[10px] font-mono text-slate-500 uppercase">Output/Hr</div>
                        <div className="text-xs sm:text-sm font-bold text-emerald-600 mt-0.5">
                          {cell.throughputPerHour}
                        </div>
                      </div>
                      <div className="p-1.5">
                        <div className="text-[10px] font-mono text-slate-500 uppercase">ROI Period</div>
                        <div className="text-xs sm:text-sm font-bold text-amber-600 mt-0.5">
                          {cell.roiMonths} Mo
                        </div>
                      </div>
                    </div>

                    {/* Key Engineering Features */}
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-mono font-bold uppercase text-slate-500 mb-1">
                        Cell Capabilities:
                      </div>
                      {cell.keyFeatures.slice(0, 3).map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 size={13} className="text-blue-600 mt-0.5 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>

                    {/* Expandable Bill of Materials (BOM) */}
                    {isExpanded && (
                      <div className="mt-5 pt-4 border-t border-slate-200 space-y-3">
                        <div className="text-xs font-mono font-bold uppercase text-slate-800">
                          Standard Bill of Materials (BOM):
                        </div>
                        <div className="space-y-2">
                          {cell.hardwareBom.map((item, idx) => (
                            <div
                              key={idx}
                              className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                            >
                              <div>
                                <div className="font-semibold text-slate-900">{item.component}</div>
                                <div className="text-[11px] text-slate-500">{item.spec}</div>
                              </div>
                              <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">
                                {item.indusModel}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Standards */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-2">
                          <span className="text-[10px] font-mono text-slate-500">Compliance:</span>
                          {cell.standards.map((std, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-mono bg-slate-200/70 text-slate-700 px-2 py-0.5 rounded"
                            >
                              {std}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Cell Card Actions */}
                  <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setExpandedCellId(isExpanded ? null : cell.id)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                    >
                      <span>{isExpanded ? "Hide Bill of Materials" : "Inspect BOM & Sensors"}</span>
                      <ChevronDown
                        size={14}
                        className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </button>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadSpec(cell.title)}
                        className="bg-white border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold"
                      >
                        <Download size={13} className="mr-1 text-slate-500" />
                        Datasheet
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => openModal("quote")}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                      >
                        Request Cell RFQ
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* =========================================================================
          TAB 3: INTERACTIVE REAL-TIME ROI CALCULATOR
         ========================================================================= */}
      {activeTab === "calculator" && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-mono text-xs font-semibold mb-2">
              <DollarSign size={13} />
              <span>Investment Justification & Payback</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-slate-900 uppercase">
              Industrial RPA Economic Feasibility Calculator
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Model production economics across single, dual, or continuous 3-shift manufacturing runs. Values reflect audited industrial robotic deployments.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Input Controls (Left Column) */}
            <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-base font-bold text-slate-900 uppercase font-mono flex items-center gap-2">
                <Sliders size={16} className="text-blue-600" />
                Workcell Operating Parameters:
              </h3>

              {/* Slider 1: Shifts Per Day */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono font-bold">
                  <span className="text-slate-700 uppercase">Operational Shifts Per Day:</span>
                  <span className="text-blue-600 text-sm">{shiftsPerDay} Shifts ({shiftsPerDay * 7.5} hrs/day)</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((shift) => (
                    <button
                      key={shift}
                      type="button"
                      onClick={() => setShiftsPerDay(shift)}
                      className={`py-2 rounded-xl text-xs font-bold font-mono transition-all border ${
                        shiftsPerDay === shift
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {shift} {shift === 1 ? "Shift" : "Shifts"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider 2: Current Manual Cycle Time */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono font-bold">
                  <span className="text-slate-700 uppercase">Manual Operation Cycle Time:</span>
                  <span className="text-blue-600 text-sm">{manualCycleTimeSec} Seconds</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="45"
                  step="1"
                  value={manualCycleTimeSec}
                  onChange={(e) => setManualCycleTimeSec(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>Fast (4s)</span>
                  <span>Moderate (20s)</span>
                  <span>Complex (45s)</span>
                </div>
              </div>

              {/* Slider 3: Labor Hourly Rate */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono font-bold">
                  <span className="text-slate-700 uppercase">Fully Burdened Hourly Labor Rate:</span>
                  <span className="text-emerald-600 text-sm">${laborHourlyRate} / Hour</span>
                </div>
                <input
                  type="range"
                  min="18"
                  max="75"
                  step="1"
                  value={laborHourlyRate}
                  onChange={(e) => setLaborHourlyRate(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>$18 / hr</span>
                  <span>$45 / hr</span>
                  <span>$75 / hr</span>
                </div>
              </div>

              {/* Slider 4: Daily Volume */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono font-bold">
                  <span className="text-slate-700 uppercase">Daily Part Production Target:</span>
                  <span className="text-blue-600 text-sm">{dailyVolume.toLocaleString()} Parts</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="100"
                  value={dailyVolume}
                  onChange={(e) => setDailyVolume(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>500 parts/day</span>
                  <span>5,000 parts/day</span>
                  <span>10,000 parts/day</span>
                </div>
              </div>

              {/* Slider 5: Current Defect / Scrap Rate */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono font-bold">
                  <span className="text-slate-700 uppercase">Current Manual Defect Rate:</span>
                  <span className="text-amber-600 text-sm">{scrapRatePercent}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="8.0"
                  step="0.1"
                  value={scrapRatePercent}
                  onChange={(e) => setScrapRatePercent(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>0.5% (Low scrap)</span>
                  <span>4.0%</span>
                  <span>8.0% (High scrap)</span>
                </div>
              </div>
            </div>

            {/* Calculated Output Cards (Right Column) */}
            <div className="lg:col-span-6 space-y-6">
              {/* Primary Highlights Card */}
              <div className="bg-[#0A1120] text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-mono text-cyan-400 uppercase font-bold">
                      Calculated Annual Net Economic Gain
                    </span>
                    <div className="text-3xl sm:text-5xl font-display font-bold text-white mt-1">
                      ${roiResults.annualNetSavings.toLocaleString()}
                      <span className="text-xs font-normal text-slate-400 ml-1">/ Year</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block">
                      Payback Period
                    </span>
                    <div className="text-2xl sm:text-3xl font-display font-bold text-emerald-400">
                      {roiResults.paybackMonths} Months
                    </div>
                  </div>
                </div>

                {/* Secondary Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                    <div className="text-[11px] font-mono text-slate-400 uppercase">
                      5-Year Net Present Value (NPV)
                    </div>
                    <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-300 mt-1">
                      ${roiResults.fiveYearNetBenefit.toLocaleString()}
                    </div>
                  </div>

                  <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                    <div className="text-[11px] font-mono text-slate-400 uppercase">
                      Throughput Expansion
                    </div>
                    <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 mt-1">
                      + {roiResults.throughputGainPercent}%
                    </div>
                  </div>

                  <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                    <div className="text-[11px] font-mono text-slate-400 uppercase">
                      Annual Scrap Cost Avoidance
                    </div>
                    <div className="text-xl sm:text-2xl font-bold font-mono text-amber-300 mt-1">
                      ${roiResults.annualScrapSavings.toLocaleString()}
                    </div>
                  </div>

                  <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                    <div className="text-[11px] font-mono text-slate-400 uppercase">
                      Robotic Cycle Time
                    </div>
                    <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">
                      {roiResults.roboticCycleTimeSec}s{" "}
                      <span className="text-xs text-slate-400 font-normal">
                        (vs {manualCycleTimeSec}s)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Row */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <Button
                    onClick={() => openModal("engineer")}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase px-6 py-2.5 rounded-xl shadow-lg shadow-blue-600/30"
                  >
                    Request Certified ROI Audit
                  </Button>
                  <button
                    type="button"
                    onClick={() => {
                      toast.success("ROI Financial Assessment Model exported to clipboard");
                      navigator.clipboard.writeText(
                        JSON.stringify(roiResults, null, 2),
                      );
                    }}
                    className="text-xs font-mono text-slate-400 hover:text-white underline cursor-pointer"
                  >
                    Export Model JSON
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          TAB 4: PHYSICAL AI ARCHITECTURE STACK
         ========================================================================= */}
      {activeTab === "stack" && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-mono text-xs font-semibold mb-2">
              <Layers size={13} />
              <span>Modular Technology Stack</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-slate-900 uppercase">
              The 4-Tier Physical AI &amp; RPA Stack
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              How INDUS unifies deterministic real-time motion, zero-backlash gearing, edge AI machine vision, and factory-wide MES/SCADA integration into a single architecture.
            </p>
          </div>

          <div className="space-y-6">
            {RPA_STACK_LAYERS.map((layer) => (
              <div
                key={layer.tierNumber}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 hover:border-blue-300 transition-all"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  <div className="lg:col-span-8 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                        {layer.tierCode}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-500 uppercase">
                        {layer.headline}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-display font-bold text-slate-900 uppercase">
                      {layer.name}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{layer.description}</p>

                    <div className="space-y-1.5 pt-1">
                      {layer.bulletPoints.map((bp, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 size={13} className="text-blue-600 mt-0.5 shrink-0" />
                          <span>{bp}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 pt-2">
                      <span className="text-[11px] font-mono text-slate-500 uppercase">
                        Protocols:
                      </span>
                      {layer.protocols.map((proto, i) => (
                        <span
                          key={i}
                          className="text-[11px] font-mono font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200"
                        >
                          {proto}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Layer Metrics Grid */}
                  <div className="lg:col-span-4 bg-slate-50 p-5 rounded-2xl border border-slate-200 grid grid-cols-2 gap-3">
                    {layer.keyMetrics.map((met, i) => (
                      <div key={i} className="p-2 bg-white rounded-xl border border-slate-100">
                        <div className="text-[10px] font-mono text-slate-500 uppercase">
                          {met.label}
                        </div>
                        <div className="text-xs sm:text-sm font-mono font-bold text-slate-900 mt-0.5">
                          {met.value}
                        </div>
                      </div>
                    ))}
                    <div className="col-span-2 pt-2 text-center">
                      <span className="text-[10px] font-mono text-blue-700 font-semibold truncate block">
                        Hardware: {layer.hardwareHighlight}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          TAB 5: RPA FEASIBILITY ASSESSMENT WIZARD
         ========================================================================= */}
      {activeTab === "wizard" && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 font-mono text-xs font-semibold mb-2">
              <SlidersHorizontal size={13} />
              <span>Interactive Engineering Tool</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-slate-900 uppercase">
              RPA Cell Feasibility Assessment Wizard
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Configure your workpiece characteristics, speed target, and cleanroom conditions to receive an automated kinematic topology sizing report.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Step Selection Form (Left Column) */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              {/* Question 1: Part Weight & Material */}
              <div className="space-y-2.5">
                <label className="text-xs font-mono font-bold uppercase text-slate-700 block">
                  1. Workpiece Mass &amp; Fragility Profile:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "micro", label: "Micro / Delicate", desc: "< 0.5 kg (Die, Wafer, PCB)" },
                    { id: "light", label: "Light Industrial", desc: "0.5 - 5.0 kg (Bottles, Valves)" },
                    { id: "medium", label: "Medium Assembly", desc: "5.0 - 25 kg (Battery, Motors)" },
                    { id: "heavy", label: "Heavy Castings", desc: "> 25 kg (Engine, Tooling)" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() =>
                        setWizardInputs({ ...wizardInputs, partWeightCategory: opt.id as any })
                      }
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        wizardInputs.partWeightCategory === opt.id
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                          : "bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <div className="font-bold text-xs">{opt.label}</div>
                      <div
                        className={`text-[10px] mt-0.5 ${
                          wizardInputs.partWeightCategory === opt.id
                            ? "text-blue-100"
                            : "text-slate-500"
                        }`}
                      >
                        {opt.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2: Cycle Time Target */}
              <div className="space-y-2.5">
                <label className="text-xs font-mono font-bold uppercase text-slate-700 block">
                  2. Required Kinematic Cycle Time:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "ultra_fast", label: "Ultra High-Speed", desc: "< 0.5s (Delta / SCARA)" },
                    { id: "fast", label: "Fast Assembly", desc: "0.5 - 2.0s (Pick & Screwdrive)" },
                    { id: "moderate", label: "Standard In-Line", desc: "2.0 - 5.0s (Welding / Inspection)" },
                    { id: "standard", label: "Heavy Machine Cycle", desc: "> 5.0s (CNC Tending / Gantry)" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() =>
                        setWizardInputs({ ...wizardInputs, cycleTimeTarget: opt.id as any })
                      }
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        wizardInputs.cycleTimeTarget === opt.id
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                          : "bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <div className="font-bold text-xs">{opt.label}</div>
                      <div
                        className={`text-[10px] mt-0.5 ${
                          wizardInputs.cycleTimeTarget === opt.id
                            ? "text-blue-100"
                            : "text-slate-500"
                        }`}
                      >
                        {opt.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 3: Environment */}
              <div className="space-y-2.5">
                <label className="text-xs font-mono font-bold uppercase text-slate-700 block">
                  3. Cleanliness &amp; Operating Environment:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "cleanroom", label: "ISO Cleanroom", desc: "ISO Class 3-5 (Zero Dust)" },
                    { id: "standard_factory", label: "Standard Factory Floor", desc: "Industrial Ambient (IP54)" },
                    { id: "harsh_ip67", label: "Harsh / Wet IP67", desc: "Coolant & Dust Ingress" },
                    { id: "sterile_fda", label: "Sterile FDA / GMP", desc: "VHP Washdown Resistant" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() =>
                        setWizardInputs({ ...wizardInputs, environmentRating: opt.id as any })
                      }
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        wizardInputs.environmentRating === opt.id
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                          : "bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <div className="font-bold text-xs">{opt.label}</div>
                      <div
                        className={`text-[10px] mt-0.5 ${
                          wizardInputs.environmentRating === opt.id
                            ? "text-blue-100"
                            : "text-slate-500"
                        }`}
                      >
                        {opt.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 4: Batch Mix */}
              <div className="space-y-2.5">
                <label className="text-xs font-mono font-bold uppercase text-slate-700 block">
                  4. Production Batch Variation:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "high_volume_low_mix", label: "High Volume", desc: "Single SKU dedicated" },
                    { id: "medium_mix", label: "Medium Mix", desc: "5-15 Family SKUs" },
                    { id: "high_mix_low_volume", label: "High Mix", desc: "> 50 dynamic SKUs" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() =>
                        setWizardInputs({ ...wizardInputs, batchMixType: opt.id as any })
                      }
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        wizardInputs.batchMixType === opt.id
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                          : "bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <div className="font-bold text-xs">{opt.label}</div>
                      <div
                        className={`text-[10px] mt-0.5 ${
                          wizardInputs.batchMixType === opt.id
                            ? "text-blue-100"
                            : "text-slate-500"
                        }`}
                      >
                        {opt.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Generated Engineering Assessment Report (Right Column) */}
            <div className="lg:col-span-5 bg-[#0B132B] text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[11px] font-mono text-cyan-400 uppercase font-bold">
                      Automation Feasibility
                    </span>
                    <div className="text-4xl font-display font-bold text-white mt-1 flex items-baseline gap-2">
                      <span>{assessmentResult.feasibilityScore}%</span>
                      <span className="text-xs font-mono text-emerald-400 font-semibold">
                        {assessmentResult.feasibilityTier}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sizing Recommendations */}
                <div className="space-y-4 my-6">
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">
                      Recommended Robot Topology
                    </div>
                    <div className="text-sm font-bold text-cyan-300 mt-0.5">
                      {assessmentResult.recommendedKinematics}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">
                      Recommended End-Effector
                    </div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      {assessmentResult.recommendedGripper}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="text-[10px] font-mono text-slate-400 uppercase">
                        Est. Cycle Time
                      </div>
                      <div className="text-lg font-mono font-bold text-emerald-400 mt-0.5">
                        {assessmentResult.estimatedCycleTimeSec}s
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="text-[10px] font-mono text-slate-400 uppercase">
                        Hourly Output
                      </div>
                      <div className="text-lg font-mono font-bold text-white mt-0.5">
                        {assessmentResult.estimatedThroughputPerHour} / hr
                      </div>
                    </div>
                  </div>

                  {/* Engineering Recommendations */}
                  <div className="space-y-1.5 pt-2">
                    <div className="text-[11px] font-mono font-bold text-slate-400 uppercase">
                      Application Notes:
                    </div>
                    {assessmentResult.keyRecommendations.map((rec, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 size={13} className="text-cyan-400 mt-0.5 shrink-0" />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
                <Button
                  onClick={() => openModal("engineer")}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase py-2.5 rounded-xl"
                >
                  Confirm Assessment With Applications Lead
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          AUDITED CASE STUDIES CAROUSEL / SECTION
         ========================================================================= */}
      <section className="bg-white border-t border-slate-200 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Audited Case Studies
            </span>
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-slate-900 uppercase mt-3">
              Proven Manufacturing Transformations
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Explore how automotive battery suppliers, semiconductor facilities, and medical diagnostic plants scaled throughput with INDUS RPA systems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {RPA_CASE_STUDIES.map((cs, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:shadow-lg transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                    <span>{cs.facility}</span>
                    <span className="font-bold text-blue-600">VERIFIED</span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-slate-900 uppercase">
                    {cs.client}
                  </h3>
                  <div className="text-xs font-semibold text-blue-700 bg-blue-100/60 p-2 rounded-xl">
                    {cs.cellType}
                  </div>

                  <div className="text-xs text-slate-600 pt-2 space-y-1">
                    <strong className="text-slate-800 block">Challenge:</strong>
                    <p>{cs.challenge}</p>
                  </div>

                  <div className="text-xs text-slate-600 pt-1 space-y-1">
                    <strong className="text-slate-800 block">Solution:</strong>
                    <p>{cs.solution}</p>
                  </div>
                </div>

                {/* Results Metrics */}
                <div className="mt-6 pt-4 border-t border-slate-200 space-y-1.5">
                  <div className="text-[11px] font-mono font-bold text-emerald-700">
                    &bull; {cs.results.cycleTimeReduction}
                  </div>
                  <div className="text-[11px] font-mono font-bold text-blue-700">
                    &bull; {cs.results.throughputGain}
                  </div>
                  <div className="text-[11px] font-mono font-bold text-slate-800">
                    &bull; {cs.results.paybackPeriod}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          FINAL CALL TO ACTION
         ========================================================================= */}
      <section className="bg-[#0A1120] text-white py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-mono uppercase tracking-wider">
            <ShieldCheck size={14} className="text-cyan-400" />
            Applications Engineering Hotline Active
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-bold text-white uppercase tracking-tight">
            Ready to Automate Your Manufacturing Workcell?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Connect directly with an INDUS robotics automation specialist to review your part CAD models, verify cycle times, and receive a turnkey cell proposal.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              onClick={() => openModal("engineer")}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-blue-600/30 uppercase text-xs tracking-wider"
            >
              <Calendar size={14} className="mr-1.5" />
              Book Engineering Consultation
            </Button>
            <Button
              variant="outline"
              onClick={handleWhatsApp}
              className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 font-bold px-6 py-3 rounded-xl text-xs uppercase"
            >
              <MessageSquare size={14} className="mr-1.5 text-emerald-400" />
              WhatsApp Specialist
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
