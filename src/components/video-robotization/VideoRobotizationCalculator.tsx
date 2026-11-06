"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  Video,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  TrendingUp,
  Clock,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Cpu,
  Layers,
  ArrowRight,
  Download,
  Share2,
  Calendar,
  MessageSquare,
  Sparkles,
  Zap,
  Target,
  Maximize2,
  Activity,
  FileText,
  Boxes,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useModals } from "@/components/modals/ModalContext";
import { companyConfig } from "@/data/config";
import { VIDEO_PRESETS, calculateVideoRobotization } from "@/data/mockVideoRobotizationData";
import type { VideoDatasetPreset } from "@/types/videoRobotization";

export function VideoRobotizationCalculator() {
  const { openModal } = useModals();

  // Active Video Preset
  const [activePresetId, setActivePresetId] = useState<string>("vid-ev-battery");

  // Video playback simulation state
  const [currentPlaybackSec, setCurrentPlaybackSec] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // Financial Sizing Sliders
  const [shiftsPerDay, setShiftsPerDay] = useState<number>(2);
  const [laborHourlyRate, setLaborHourlyRate] = useState<number>(36);

  // Selected Preset
  const activePreset = useMemo(() => {
    return VIDEO_PRESETS.find((p) => p.id === activePresetId) || VIDEO_PRESETS[0];
  }, [activePresetId]);

  // Computed Video Robotization Output
  const analysisOutput = useMemo(() => {
    return calculateVideoRobotization(activePreset, shiftsPerDay, laborHourlyRate);
  }, [activePreset, shiftsPerDay, laborHourlyRate]);

  // Active MTM Phase based on current video timestamp
  const activeMtmPhase = useMemo(() => {
    return (
      activePreset.mtmBreakdown.find(
        (m) => currentPlaybackSec >= m.startSec && currentPlaybackSec < m.endSec,
      ) || activePreset.mtmBreakdown[0]
    );
  }, [activePreset, currentPlaybackSec]);

  // Playback loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentPlaybackSec((prev) => {
        const next = Number((prev + 0.1).toFixed(1));
        if (next >= activePreset.durationSec) {
          return 0;
        }
        return next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying, activePreset.durationSec]);

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.success(`Video Uploaded: ${file.name}`, {
        description: "AI Optical Flow & Skeletal Keypoint Trajectory model initialized. Analyzing manufacturing motions...",
      });
    }
  };

  const handleExportProposal = () => {
    const proposal = {
      timestamp: new Date().toISOString(),
      datasetTitle: activePreset.title,
      videoMetrics: {
        durationSec: activePreset.durationSec,
        observedManualCycleTimeSec: activePreset.manualTaktTimeSec,
        projectedRobotCycleTimeSec: activePreset.projectedRobotCycleTimeSec,
        speedupMultiplier: `${analysisOutput.speedupMultiplier}x`,
      },
      kinematicEnvelope: activePreset.spatialEnvelopeMm,
      recommendedHardware: {
        robotModel: analysisOutput.recommendedRobotModel,
        endEffector: analysisOutput.recommendedEndEffector,
      },
      economics: {
        annualLaborSavingsUsd: `$${analysisOutput.annualLaborSavingsUsd.toLocaleString()}`,
        estimatedCapitalCostUsd: `$${analysisOutput.estimatedCapitalCostUsd.toLocaleString()}`,
        paybackPeriodMonths: `${analysisOutput.paybackMonths} Months`,
        throughputExpansionPercent: `+${analysisOutput.throughputGainPercent}%`,
      },
    };

    navigator.clipboard.writeText(JSON.stringify(proposal, null, 2));
    toast.success("Video-Based Robotization Engineering Proposal copied to clipboard", {
      description: "ISO 10218-2 kinematic conversion data ready for executive review.",
    });
  };

  const handleWhatsApp = () => {
    window.open(companyConfig.getWhatsAppUrl({ type: "general" }), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="w-full bg-slate-50 text-slate-900 min-h-screen">
      {/* =========================================================================
          HERO BANNER: Video-Based Robotization Calculator
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
          {/* Breadcrumb strip */}
          <div className="flex items-center gap-2 mb-3">
            <Link
              to="/robotic-process-automation"
              className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 hover:underline"
            >
              RPA Architecture
            </Link>
            <span className="text-slate-600">/</span>
            <Link
              to="/robotic-process-analysis-tools"
              className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 hover:underline"
            >
              Analysis Tools
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-xs font-mono text-cyan-300 uppercase font-bold">
              Video AI Calculator
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-mono uppercase tracking-wider">
                <Video size={13} className="text-cyan-400" />
                <span>Computer Vision Motion Ingestion &bull; MTM Deconstruction &bull; ISO 10218-2</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-display font-bold uppercase text-white tracking-tight leading-[1.05]">
                Video-Based <span className="text-cyan-400">Robotization</span> Calculation Tools
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                Ingest manual assembly footage or test against pre-recorded factory video streams. AI optical tracking extracts human hand trajectories, decomposes Methods-Time Measurement (MTM) micro-phases, and calculates exact robotic cell sizing, cycle time speedup, and capital ROI.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
              <Button
                onClick={handleExportProposal}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase px-5 py-2.5 rounded-xl shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2"
              >
                <Download size={14} />
                Export Sizing Proposal (JSON)
              </Button>
              <Button
                variant="outline"
                onClick={() => openModal("engineer")}
                className="border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold text-xs uppercase px-5 py-2.5 rounded-xl flex items-center justify-center gap-2"
              >
                <Calendar size={14} className="text-cyan-400" />
                Review Video With Robotics Lead
              </Button>
            </div>
          </div>

          {/* KPI Highlight Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-10 pt-6 border-t border-slate-800">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-[10px] font-mono text-cyan-400 uppercase">Kinematic Speedup</div>
              <div className="text-2xl sm:text-3xl font-display font-bold text-white mt-0.5">
                {analysisOutput.speedupMultiplier}x Faster
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                {activePreset.manualTaktTimeSec}s &rarr; {activePreset.projectedRobotCycleTimeSec}s
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-[10px] font-mono text-emerald-400 uppercase">Hourly Output</div>
              <div className="text-2xl sm:text-3xl font-display font-bold text-emerald-400 mt-0.5">
                +{analysisOutput.throughputGainPercent}%
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                {analysisOutput.throughputHourlyRobotic} units / hour
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-[10px] font-mono text-amber-400 uppercase">Ergonomic Relief</div>
              <div className="text-2xl sm:text-3xl font-display font-bold text-amber-300 mt-0.5">
                100% Risk Eliminated
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                RULA Score {activePreset.ergoRulaScore}/7 &rarr; Zero Hazard
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-[10px] font-mono text-blue-400 uppercase">Payback Horizon</div>
              <div className="text-2xl sm:text-3xl font-display font-bold text-cyan-300 mt-0.5">
                {analysisOutput.paybackMonths} Months
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                ${analysisOutput.annualLaborSavingsUsd.toLocaleString()} / year net
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          MAIN INTERACTIVE SECTION: VIDEO PLAYER & CV TRACKING SIMULATOR
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Dataset Preset Selector Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-mono text-xs font-semibold mb-2">
              <Sparkles size={13} />
              <span>Select Manufacturing Video Stream</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 uppercase">
              Factory Video Ingestion &amp; Trajectory Mapping
            </h2>
          </div>

          {/* Upload Custom Video Button */}
          <div className="flex items-center gap-2">
            <label className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 shadow-xs transition-colors">
              <Upload size={14} className="text-blue-600" />
              <span>Upload Custom Video (.mp4 / .mov)</span>
              <input
                type="file"
                accept="video/*"
                onChange={handleCustomUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Preset Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {VIDEO_PRESETS.map((preset) => {
            const isSelected = preset.id === activePresetId;
            return (
              <button
                key={preset.id}
                onClick={() => {
                  setActivePresetId(preset.id);
                  setCurrentPlaybackSec(0);
                }}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? "bg-blue-600 text-white border-blue-700 shadow-lg shadow-blue-600/20 scale-[1.02]"
                    : "bg-white text-slate-800 border-slate-200 hover:border-blue-300 hover:bg-blue-50/50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                      isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {preset.industryLabel}
                  </span>
                  <span
                    className={`font-mono text-xs font-bold ${
                      isSelected ? "text-cyan-200" : "text-blue-600"
                    }`}
                  >
                    {preset.manualTaktTimeSec}s
                  </span>
                </div>
                <h4 className="font-bold text-xs uppercase tracking-wide truncate">
                  {preset.title}
                </h4>
                <p
                  className={`text-[11px] mt-1 line-clamp-2 leading-relaxed ${
                    isSelected ? "text-blue-100" : "text-slate-500"
                  }`}
                >
                  {preset.subtitle}
                </p>
              </button>
            );
          })}
        </div>

        {/* Video Player & Optical Tracking Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Simulated Video Player with CV Overlay (Left Column) */}
          <div className="lg:col-span-7 bg-[#050C1A] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col justify-between">
            {/* Viewport Header */}
            <div className="px-4 py-3 bg-[#0A1325] border-b border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-rose-500 animate-pulse" />
                <span className="font-bold text-white uppercase tracking-wider">
                  CV STREAM: {activePreset.title}
                </span>
              </div>
              <span className="text-cyan-400 font-bold">{activePreset.fps} FPS &bull; Optical Flow ACTIVE</span>
            </div>

            {/* Video Viewport Simulated Canvas */}
            <div className="relative w-full aspect-video bg-gradient-to-b from-[#091124] to-[#040814] flex items-center justify-center overflow-hidden select-none p-6">
              {/* Grid Background Pattern */}
              <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(#38BDF8 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />

              {/* Simulated Workstation Table Graphics */}
              <div className="relative w-full h-full border border-cyan-500/30 rounded-2xl bg-cyan-950/10 flex flex-col justify-between p-4">
                {/* Top Corner Calibration Crosshairs */}
                <div className="flex justify-between items-start text-[9px] font-mono text-cyan-500/70">
                  <span>[0, 0, 0] MM CALIB</span>
                  <span>CAM_01: 3D_STEREO_1080P</span>
                </div>

                {/* Simulated Bounding Boxes Over Operator & Workpiece */}
                <div className="relative flex items-center justify-center my-auto">
                  {/* Left Hand Tracker */}
                  <div className="absolute -left-4 -top-6 p-2 rounded border border-cyan-400 bg-cyan-500/10 text-[10px] font-mono text-cyan-300 animate-pulse">
                    <div className="font-bold">Operator_Hand_L</div>
                    <div className="text-[8px] text-cyan-200">CONF: 98.8% | VEL: 0.72 m/s</div>
                  </div>

                  {/* Workpiece Target Bounding Box */}
                  <div className="p-8 rounded-xl border-2 border-dashed border-emerald-400 bg-emerald-500/15 text-center text-xs font-mono text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                    <div className="font-bold uppercase tracking-wider">
                      Workpiece Target: {activePreset.workpieceWeightKg} kg
                    </div>
                    <div className="text-[10px] text-emerald-200 mt-1">
                      Envelope: {activePreset.spatialEnvelopeMm.reachX}mm &times; {activePreset.spatialEnvelopeMm.reachY}mm
                    </div>
                    <div className="text-[9px] text-cyan-300 mt-1 font-bold">
                      Current MTM Action: {activeMtmPhase.name}
                    </div>
                  </div>

                  {/* Right Hand / Tooling Tracker */}
                  <div className="absolute -right-4 -bottom-6 p-2 rounded border border-amber-400 bg-amber-500/10 text-[10px] font-mono text-amber-300">
                    <div className="font-bold">Operator_Hand_R</div>
                    <div className="text-[8px] text-amber-200">CONF: 99.4% | Z-STROKE: {activePreset.spatialEnvelopeMm.strokeZ}mm</div>
                  </div>
                </div>

                {/* Bottom Center Active Phase Overlay */}
                <div className="flex justify-between items-end text-[10px] font-mono text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-white font-bold">
                      MTM PHASE: {activeMtmPhase.code} ({activeMtmPhase.shortName || activeMtmPhase.category.toUpperCase()})
                    </span>
                  </div>
                  <span className="text-cyan-400 font-bold">
                    {currentPlaybackSec}s / {activePreset.durationSec}s
                  </span>
                </div>
              </div>
            </div>

            {/* Playback Controls & Scrubber */}
            <div className="px-6 py-4 bg-[#0A1325] border-t border-slate-800 space-y-3">
              <input
                type="range"
                min="0"
                max={activePreset.durationSec}
                step="0.1"
                value={currentPlaybackSec}
                onChange={(e) => {
                  setCurrentPlaybackSec(Number(e.target.value));
                  setIsPlaying(false);
                }}
                className="w-full accent-cyan-400 cursor-pointer"
              />

              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="size-8 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-colors"
                  >
                    {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPlaybackSec(0)}
                    className="size-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
                    title="Reset to frame 0"
                  >
                    <RotateCcw size={14} />
                  </button>
                  <span className="text-slate-400 ml-1">
                    Frame {Math.round(currentPlaybackSec * activePreset.fps)} /{" "}
                    {Math.round(activePreset.durationSec * activePreset.fps)}
                  </span>
                </div>

                <div className="text-slate-300">
                  Observed Takt: <strong className="text-white">{activePreset.manualTaktTimeSec}s</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Computer Vision Extraction Analytics (Right Column) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Extracted Kinematic Envelope Box */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-mono font-bold uppercase text-blue-700">
                  Extracted Kinematic Envelope
                </span>
                <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                  Skeletal Tracking Locked
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] font-mono text-slate-500 uppercase">Max Reach X</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">
                    {activePreset.spatialEnvelopeMm.reachX} mm
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] font-mono text-slate-500 uppercase">Max Reach Y</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">
                    {activePreset.spatialEnvelopeMm.reachY} mm
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] font-mono text-slate-500 uppercase">Z-Stroke</div>
                  <div className="text-lg font-bold text-blue-600 mt-0.5">
                    {activePreset.spatialEnvelopeMm.strokeZ} mm
                  </div>
                </div>
              </div>

              {/* Recommended Robot Hardware */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-mono font-bold uppercase text-slate-700">
                  Recommended Automated Cell Kinematics:
                </div>
                <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs space-y-1">
                  <div className="font-bold text-blue-900">{analysisOutput.recommendedRobotModel}</div>
                  <div className="text-slate-600 text-[11px]">
                    Tooling: {analysisOutput.recommendedEndEffector}
                  </div>
                </div>
              </div>

              {/* RULA Ergonomic Hazard Assessment */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400 uppercase">Manual Posture Ergonomic Risk:</span>
                  <span className="text-rose-400 font-bold">{activePreset.observedErgoRisk} (RULA {activePreset.ergoRulaScore}/7)</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Repetitive wrist deviation and forward neck bending detected. Transitioning to INDUS automated robotics eliminates operator exposure to repetitive strain injury (RSI) completely.
                </p>
              </div>
            </div>

            {/* Financial ROI Feasibility Card */}
            <div className="bg-[#0A1120] text-white p-6 sm:p-7 rounded-3xl border border-slate-800 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-mono text-cyan-400 uppercase font-bold">
                  Economic Feasibility
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  {analysisOutput.paybackMonths} Mo Payback
                </span>
              </div>

              {/* Sliders for Shift & Wage */}
              <div className="space-y-3 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Operating Shifts:</span>
                  <span className="font-bold text-white">{shiftsPerDay} Shifts/Day</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setShiftsPerDay(s)}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-all border ${
                        shiftsPerDay === s
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                      }`}
                    >
                      {s} Shift{s > 1 ? "s" : ""}
                    </button>
                  ))}
                </div>

                <div className="flex justify-between pt-2">
                  <span className="text-slate-400">Labor Rate ($/hr):</span>
                  <span className="font-bold text-emerald-400">${laborHourlyRate}/hr</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="65"
                  step="1"
                  value={laborHourlyRate}
                  onChange={(e) => setLaborHourlyRate(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              {/* Financial Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">
                    Annual Labor Saved
                  </div>
                  <div className="text-lg font-mono font-bold text-white mt-0.5">
                    ${analysisOutput.annualLaborSavingsUsd.toLocaleString()}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">
                    Turnkey Cell Budget
                  </div>
                  <div className="text-lg font-mono font-bold text-cyan-300 mt-0.5">
                    ${analysisOutput.estimatedCapitalCostUsd.toLocaleString()}
                  </div>
                </div>
              </div>

              <Button
                onClick={() => openModal("engineer")}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase py-2.5 rounded-xl shadow-lg shadow-blue-600/30"
              >
                Request Video-to-Robotics Sizing Proposal
              </Button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            METHODS-TIME MEASUREMENT (MTM) MICRO-MOTION BREAKDOWN TABLE
           ========================================================================= */}
        <div className="mt-12 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                Methods-Time Measurement (MTM) Decomposition
              </span>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-slate-900 uppercase mt-2">
                Human vs. Robotic Micro-Motion Takt Comparison
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Every video frame is decomposed into standard MTM industrial work elements to quantify time reclaimed at each physical trajectory segment.
              </p>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-mono text-slate-500 uppercase block">
                Total Net Cycle Time:
              </span>
              <span className="text-lg font-mono font-bold text-slate-900">
                <span className="line-through text-slate-400 mr-2">{activePreset.manualTaktTimeSec}s</span>
                <span className="text-emerald-600">{activePreset.projectedRobotCycleTimeSec}s</span>
              </span>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-mono text-[11px] uppercase border-y border-slate-200">
                <tr>
                  <th className="py-3 px-3">Element Code</th>
                  <th className="py-3 px-3">Motion Description</th>
                  <th className="py-3 px-3">Human Takt</th>
                  <th className="py-3 px-3">Robotic Cell</th>
                  <th className="py-3 px-3">Time Saved</th>
                  <th className="py-3 px-3 text-right">Kinematic Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {activePreset.mtmBreakdown.map((elem, idx) => {
                  const isActive = activeMtmPhase.name === elem.name;
                  return (
                    <tr
                      key={idx}
                      className={`transition-colors ${
                        isActive ? "bg-blue-50/80 font-bold" : "hover:bg-slate-50/70"
                      }`}
                    >
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
                          {elem.code}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-sans">
                        <div className="font-bold text-slate-900">{elem.name}</div>
                        <div className="text-[11px] text-slate-500 font-normal">{elem.description}</div>
                      </td>
                      <td className="py-3.5 px-3 text-slate-700">{elem.humanTimeSec}s</td>
                      <td className="py-3.5 px-3 text-blue-600 font-bold">{elem.robotTimeSec}s</td>
                      <td className="py-3.5 px-3 text-emerald-600 font-bold">
                        -{elem.timeSavedPercent}% ({(elem.humanTimeSec - elem.robotTimeSec).toFixed(2)}s)
                      </td>
                      <td className="py-3.5 px-3 text-right text-slate-500">
                        {elem.category.toUpperCase()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* =========================================================================
          BOTTOM CALL TO ACTION & CONSULTATION BAR
         ========================================================================= */}
      <section className="bg-[#0A1120] text-white py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-mono uppercase tracking-wider">
            <ShieldCheck size={14} className="text-cyan-400" />
            <span>INDUS Digital Engineering Laboratory</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-bold text-white uppercase tracking-tight">
            Want to Analyze Footage of Your Factory Operation?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Upload your shop-floor MP4 recordings securely under mutual NDA. Our computer vision automation engineers will run full 3D skeletal tracking, MTM deconstruction, and deliver a turn-key cell proposal.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              onClick={() => openModal("engineer")}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-blue-600/30 uppercase text-xs tracking-wider"
            >
              <Calendar size={14} className="mr-1.5" />
              Schedule Video Analysis Session
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
