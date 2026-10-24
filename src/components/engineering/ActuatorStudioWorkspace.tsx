import React, { useState, useEffect, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  Gauge,
  Thermometer,
  Zap,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Sliders,
  Cpu,
  Wifi,
  Radio,
  FileCheck,
  Play,
  Pause,
  ShieldAlert,
  ShieldCheck,
  Compass,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Layers,
  Wrench,
  MessageSquare,
  RefreshCw,
  Filter,
  Check,
  ChevronRight,
  ExternalLink,
  Info,
  Calendar,
  X,
  AlertCircle,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModals } from "@/components/modals/ModalContext";
import { companyConfig } from "@/data/config";
import {
  INTELLIGENT_ACTUATORS_DATA,
  getAllIntelligentActuators,
  type ActuatorModelVariant,
  type IntelligentActuatorItem,
} from "@/data/intelligentActuatorsData";
import { ActuatorAIActions, transferActuatorToFinder } from "@/services/roboticsGuide/actuatorBridge";

/* =========================================================================
   TYPES & TELEMETRY INTERFACES
   ========================================================================= */

export type StudioTab = "comparison" | "telemetry" | "diagnostics" | "control-guidance" | "sizing-handoff";

export type TelemetryConditionState =
  | "normal"
  | "thermal-warning"
  | "tracking-error-alarm"
  | "stale-data-timeout"
  | "sto-tripped";

interface TelemetryPoint {
  time: number;
  commandedPos: number;
  actualPos: number;
  velocity: number;
  torqueOrForce: number;
  current: number;
  temperature: number;
  trackingError: number;
  timestamp: string;
}

export function ActuatorStudioWorkspace({
  initialTab = "comparison",
  initialCategory = "rotary",
}: {
  initialTab?: StudioTab;
  initialCategory?: "rotary" | "linear";
}) {
  const { openModal } = useModals();
  const [activeTab, setActiveTab] = useState<StudioTab>(initialTab);
  const [actuatorCategory, setActuatorCategory] = useState<"rotary" | "linear">(initialCategory);

  // Model Selection for Comparison Workspace
  const rotaryData = INTELLIGENT_ACTUATORS_DATA["intelligent-rotary-actuator"];
  const linearData = INTELLIGENT_ACTUATORS_DATA["intelligent-linear-actuator"];

  const [selectedRotaryModels, setSelectedRotaryModels] = useState<string[]>([
    "IND-IRA-070-50",
    "IND-IRA-090-80",
    "IND-IRA-115-100",
  ]);

  const [selectedLinearModels, setSelectedLinearModels] = useState<string[]>([
    "IND-ILA-050-B10",
    "IND-ILA-080-B16",
    "IND-ILA-110-B25",
  ]);

  // Telemetry Dashboard State
  const [isPlaying, setIsPlaying] = useState(true);
  const [telemetryModel, setTelemetryModel] = useState<string>("IND-IRA-090-80");
  const [controlMode, setControlMode] = useState<"CSP" | "CSV" | "CST">("CSP");
  const [conditionScenario, setConditionScenario] = useState<TelemetryConditionState>("normal");
  const [activeVisualization, setActiveVisualization] = useState<
    "position" | "velocity" | "torque" | "temperature" | "tracking" | "alarms"
  >("position");

  const [tick, setTick] = useState(0);
  const [dataHistory, setDataHistory] = useState<TelemetryPoint[]>([]);
  const [currentSample, setCurrentSample] = useState<TelemetryPoint>({
    time: 0,
    commandedPos: 0,
    actualPos: 0,
    velocity: 0,
    torqueOrForce: 0,
    current: 0,
    temperature: 38.4,
    trackingError: 0.002,
    timestamp: new Date().toISOString(),
  });

  const [operatingCycles, setOperatingCycles] = useState(148293);
  const [runningHours, setRunningHours] = useState(1248.5);
  const [staleSeconds, setStaleSeconds] = useState(0);

  // Anomaly & Alarm Counters
  const [alarmStats] = useState({
    thermalWarnings24h: 2,
    trackingSpikes24h: 1,
    stoTrips7d: 0,
    fieldbusSyncLoss7d: 1,
    lastMaintenanceDaysAgo: 42,
  });

  // Simulated Telemetry Engine
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      // If stale-data scenario is active, simulate frozen data stream with growing latency
      if (conditionScenario === "stale-data-timeout") {
        setStaleSeconds((s) => s + 0.3);
        return;
      } else {
        setStaleSeconds(0);
      }

      setTick((prev) => {
        const nextTick = prev + 1;
        const t = nextTick * 0.06;

        const isLinear = telemetryModel.includes("ILA");

        // 1. Position Trajectory
        let commanded = 0;
        let actual = 0;
        let trackingErr = 0;

        if (isLinear) {
          // Linear stroke 0 - 350 mm
          commanded = 175 + Math.sin(t * 0.6) * 160;
          const mechanicalLag = conditionScenario === "tracking-error-alarm" ? 0.045 : 0.003;
          actual = commanded - mechanicalLag + (Math.random() - 0.5) * 0.002;
          trackingErr = Math.abs(commanded - actual) * 1000; // in µm
        } else {
          // Rotary angular travel -180° to +180°
          commanded = Math.sin(t * 0.7) * 170;
          const deflection = conditionScenario === "tracking-error-alarm" ? 0.28 : 0.015;
          actual = commanded - deflection + (Math.random() - 0.5) * 0.004;
          trackingErr = Math.abs(commanded - actual) * 60; // in arcmin
        }

        // 2. Velocity
        const velocity = isLinear
          ? Math.cos(t * 0.6) * 450
          : Math.cos(t * 0.7) * 35;

        // 3. Torque or Force & Current
        let dynamicTorque = 0;
        let dynamicCurrent = 0;

        if (conditionScenario === "sto-tripped") {
          dynamicTorque = 0;
          dynamicCurrent = 0;
        } else if (isLinear) {
          // Force in N (up to 1600 N continuous)
          const baseForce = Math.abs(Math.sin(t * 0.6) * 980) + 120;
          dynamicTorque = conditionScenario === "thermal-warning" ? baseForce * 1.55 : baseForce;
          dynamicCurrent = (dynamicTorque / 1600) * 9.5 + 0.8;
        } else {
          // Torque in Nm (up to 85 Nm continuous)
          const baseTorque = Math.abs(Math.sin(t * 0.7) * 55) + 12;
          dynamicTorque = conditionScenario === "thermal-warning" ? baseTorque * 1.6 : baseTorque;
          dynamicCurrent = (dynamicTorque / 85) * 11.0 + 1.2;
        }

        // 4. Stator Temperature
        let temp = 38.2;
        if (conditionScenario === "thermal-warning") {
          temp = 88.6 + Math.sin(t * 0.08) * 2.4; // Exceeds 85°C derating threshold
        } else if (conditionScenario === "sto-tripped") {
          temp = 32.1;
        } else {
          temp = 38.0 + (dynamicCurrent / 12.0) * 4.5 + Math.sin(t * 0.04) * 1.2;
        }

        const newPoint: TelemetryPoint = {
          time: nextTick,
          commandedPos: Number(commanded.toFixed(2)),
          actualPos: Number(actual.toFixed(2)),
          velocity: Number(velocity.toFixed(1)),
          torqueOrForce: Number(dynamicTorque.toFixed(1)),
          current: Number(dynamicCurrent.toFixed(2)),
          temperature: Number(temp.toFixed(1)),
          trackingError: Number(trackingErr.toFixed(2)),
          timestamp: new Date().toLocaleTimeString(),
        };

        setCurrentSample(newPoint);
        setDataHistory((prevHistory) => {
          const updated = [...prevHistory, newPoint];
          return updated.slice(-26); // Keep last 26 points
        });

        if (nextTick % 40 === 0) {
          setOperatingCycles((c) => c + 1);
        }

        return nextTick;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isPlaying, telemetryModel, conditionScenario]);

  // Model comparison helpers
  const activeProductData = actuatorCategory === "rotary" ? rotaryData : linearData;
  const activeVariants = activeProductData.modelVariants;

  const selectedVariantCodes =
    actuatorCategory === "rotary" ? selectedRotaryModels : selectedLinearModels;

  const comparedVariants = useMemo(() => {
    return activeVariants.filter((v) => selectedVariantCodes.includes(v.modelCode));
  }, [activeVariants, selectedVariantCodes]);

  const toggleModelSelection = (code: string) => {
    if (actuatorCategory === "rotary") {
      if (selectedRotaryModels.includes(code)) {
        if (selectedRotaryModels.length > 1) {
          setSelectedRotaryModels((m) => m.filter((x) => x !== code));
        }
      } else {
        setSelectedRotaryModels((m) => [...m, code]);
      }
    } else {
      if (selectedLinearModels.includes(code)) {
        if (selectedLinearModels.length > 1) {
          setSelectedLinearModels((m) => m.filter((x) => x !== code));
        }
      } else {
        setSelectedLinearModels((m) => [...m, code]);
      }
    }
  };

  const handleWhatsApp = () => {
    window.open(companyConfig.getWhatsAppUrl({ type: "general" }), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="w-full">
      {/* =========================================================================
          PERSISTENT LABELLING MANDATE (PROMPT SECTION 3)
         ========================================================================= */}
      <div className="mb-6 rounded-xl border border-[#FDA29B] bg-[#FFFBFA] p-3.5 sm:p-4 text-xs shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 text-[#B42318] font-bold uppercase tracking-wider text-[11px]">
            <AlertTriangle size={15} className="shrink-0 text-[#D92D20]" />
            <span className="font-mono">DEMO DATA · NOT CONNECTED TO LIVE HARDWARE</span>
          </div>
          <span className="text-[11px] font-mono text-[#7A271A]">
            DSP Drive Vector Simulation · Grounded in ISO/DIN Bench Calibrations
          </span>
        </div>
        <p className="mt-1 text-[11.5px] text-[#5E241C] leading-relaxed">
          Measurements, waveforms, and diagnostic flags below reflect calibrated laboratory test profiles on INDUS actuators. They are not readings from a physically connected customer machine, nor do they represent a hardware failure on production equipment.
        </p>
      </div>

      {/* =========================================================================
          STUDIO NAVIGATION TAB BAR
         ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-[#E5EAF1]">
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#F2F4F7] border border-[#E5EAF1]">
          <button
            type="button"
            onClick={() => setActiveTab("comparison")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "comparison"
                ? "bg-white text-[#155EEF] shadow-xs"
                : "text-[#475467] hover:text-[#172033]"
            }`}
          >
            1. Model Comparison Workspace
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("telemetry")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "telemetry"
                ? "bg-white text-[#155EEF] shadow-xs"
                : "text-[#475467] hover:text-[#172033]"
            }`}
          >
            <Activity size={13} className="text-[#155EEF]" />
            <span>2. Monitoring &amp; Waveforms</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("diagnostics")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "diagnostics"
                ? "bg-white text-[#155EEF] shadow-xs"
                : "text-[#475467] hover:text-[#172033]"
            }`}
          >
            <ShieldAlert size={13} className="text-[#B42318]" />
            <span>3. Intelligent Diagnostics</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("control-guidance")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "control-guidance"
                ? "bg-white text-[#155EEF] shadow-xs"
                : "text-[#475467] hover:text-[#172033]"
            }`}
          >
            4. Control &amp; Fieldbus Guidelines
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("sizing-handoff")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "sizing-handoff"
                ? "bg-[#155EEF] text-white shadow-xs"
                : "text-[#155EEF] bg-[#EFF6FF] hover:bg-[#D1E0FF]"
            }`}
          >
            <Sliders size={13} />
            <span>5. Configure My Actuator</span>
          </button>
        </div>

        {/* Global Assistant Quick Trigger */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              ActuatorAIActions.requestEngineeringAssistance(
                telemetryModel,
                "Intelligent Actuator Studio exploration"
              )
            }
            className="h-8 text-xs font-semibold border-[#D0D5DD] bg-white text-[#344054]"
          >
            <Sparkles size={13} className="mr-1.5 text-[#155EEF]" /> Ask Robotics AI
          </Button>

          <Button
            size="sm"
            onClick={() => openModal("quote", { categoryName: "Intelligent Actuators" })}
            className="h-8 text-xs font-bold bg-[#155EEF] hover:bg-[#1047BF] text-white"
          >
            Request Official Quote
          </Button>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: MODEL COMPARISON WORKSPACE (PROMPT SECTION 2)
         ========================================================================= */}
      {activeTab === "comparison" && (
        <div className="space-y-6">
          {/* Category Switcher & Model Multi-select */}
          <div className="rounded-2xl border border-[#E5EAF1] bg-white p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5EAF1]">
              <div>
                <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-[#155EEF] block">
                  Product Family Selector
                </span>
                <h3 className="text-lg font-bold text-[#172033] mt-0.5">
                  Verified Actuator Family Records
                </h3>
              </div>

              {/* Rotary vs Linear Toggle */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-[#F8FAFC] border border-[#E5EAF1] text-xs">
                <button
                  type="button"
                  onClick={() => setActuatorCategory("rotary")}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    actuatorCategory === "rotary"
                      ? "bg-[#155EEF] text-white shadow-xs"
                      : "text-[#667085] hover:text-[#172033]"
                  }`}
                >
                  <RotateCw size={13} />
                  <span>Rotary Joints (IND-IRA)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActuatorCategory("linear")}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    actuatorCategory === "linear"
                      ? "bg-[#155EEF] text-white shadow-xs"
                      : "text-[#667085] hover:text-[#172033]"
                  }`}
                >
                  <Compass size={13} />
                  <span>Linear Slides (IND-ILA)</span>
                </button>
              </div>
            </div>

            {/* Selectable Model Variants Pill Selector */}
            <div className="mt-4">
              <span className="text-xs text-[#667085] block mb-2 font-medium">
                Select models to compare side-by-side (minimum 2 models):
              </span>
              <div className="flex flex-wrap gap-2">
                {activeVariants.map((v) => {
                  const isChecked = selectedVariantCodes.includes(v.modelCode);
                  return (
                    <button
                      key={v.modelCode}
                      type="button"
                      onClick={() => toggleModelSelection(v.modelCode)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border flex items-center gap-1.5 cursor-pointer ${
                        isChecked
                          ? "border-[#155EEF] bg-[#EFF6FF] text-[#155EEF] font-bold shadow-2xs"
                          : "border-[#E5EAF1] bg-[#F8FAFC] text-[#667085] hover:bg-[#F2F4F7]"
                      }`}
                    >
                      <span
                        className={`size-3.5 rounded grid place-items-center text-[10px] ${
                          isChecked ? "bg-[#155EEF] text-white" : "border border-[#D0D5DD] bg-white"
                        }`}
                      >
                        {isChecked && <Check size={10} />}
                      </span>
                      <span>{v.modelCode}</span>
                      <span className="text-[10px] opacity-75">
                        ({v.nominalTorqueOrForce})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Model Comparison Table */}
          <div className="rounded-2xl border border-[#E5EAF1] bg-white shadow-xs overflow-hidden">
            <div className="p-4 bg-[#F8FAFC] border-b border-[#E5EAF1] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#172033]">
                  Comparing {comparedVariants.length} Verified Configurations
                </span>
                <span className="text-[10.5px] font-mono text-[#16A34A] bg-[#ECFDF3] border border-[#A6F4C5] px-2 py-0.5 rounded">
                  ISO 230-2 Verified Lab Records
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono text-[#667085]">
                <span className="flex items-center gap-1">
                  <span className="size-2 rounded-full bg-[#155EEF]" /> Continuous Rating
                </span>
                <span className="flex items-center gap-1">
                  <span className="size-2 rounded-full bg-[#F79009]" /> Peak Rating
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E5EAF1] bg-[#FCFDFE]">
                    <th className="p-3.5 font-bold text-[#172033] w-52 sticky left-0 bg-[#FCFDFE] z-10 border-r border-[#E5EAF1]">
                      Engineering Parameter
                    </th>
                    {comparedVariants.map((v) => (
                      <th key={v.modelCode} className="p-3.5 font-bold text-[#172033] min-w-[190px]">
                        <div className="font-mono text-sm text-[#155EEF]">{v.modelCode}</div>
                        <span className="text-[10.5px] font-mono text-[#667085] font-normal block mt-0.5">
                          Status: Verified Record
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5EAF1]">
                  {/* Category-Specific Rows */}
                  {actuatorCategory === "rotary" ? (
                    <>
                      {/* Rated Continuous Torque */}
                      <tr>
                        <td className="p-3.5 font-semibold text-[#344054] sticky left-0 bg-white z-10 border-r border-[#E5EAF1]">
                          Rated Continuous Torque
                          <span className="text-[10px] text-[#667085] block font-mono">S1 Duty Cycle</span>
                        </td>
                        {comparedVariants.map((v) => (
                          <td key={v.modelCode} className="p-3.5 font-mono text-[#172033] font-bold">
                            <span className="text-base text-[#155EEF]">{v.nominalTorqueOrForce}</span>
                          </td>
                        ))}
                      </tr>

                      {/* Peak Acceleration Torque */}
                      <tr className="bg-[#FFFAEB]/30">
                        <td className="p-3.5 font-semibold text-[#344054] sticky left-0 bg-[#FFFAEB]/40 z-10 border-r border-[#E5EAF1]">
                          Peak Acceleration Torque
                          <span className="text-[10px] text-[#B54708] block font-mono">Duration ≤ 1.0s</span>
                        </td>
                        {comparedVariants.map((v) => (
                          <td key={v.modelCode} className="p-3.5 font-mono text-[#B54708] font-bold">
                            {v.peakTorqueOrForce}
                          </td>
                        ))}
                      </tr>

                      {/* Rated & Max Output Speed */}
                      <tr>
                        <td className="p-3.5 font-semibold text-[#344054] sticky left-0 bg-white z-10 border-r border-[#E5EAF1]">
                          Rated / Max Output Speed
                        </td>
                        {comparedVariants.map((v) => (
                          <td key={v.modelCode} className="p-3.5 font-mono text-[#172033]">
                            {v.ratedSpeed} / {v.maxSpeed}
                          </td>
                        ))}
                      </tr>

                      {/* Angular Travel */}
                      <tr>
                        <td className="p-3.5 font-semibold text-[#344054] sticky left-0 bg-white z-10 border-r border-[#E5EAF1]">
                          Angular Travel
                        </td>
                        {comparedVariants.map((v) => (
                          <td key={v.modelCode} className="p-3.5 font-mono text-[#172033]">
                            360° Continuous Rotation
                          </td>
                        ))}
                      </tr>

                      {/* Gearhead Backlash */}
                      <tr>
                        <td className="p-3.5 font-semibold text-[#344054] sticky left-0 bg-white z-10 border-r border-[#E5EAF1]">
                          Strain-Wave Backlash
                        </td>
                        {comparedVariants.map((v) => (
                          <td key={v.modelCode} className="p-3.5 font-mono text-[#16A34A] font-semibold">
                            {v.backlash || "< 1.0 arcmin"}
                          </td>
                        ))}
                      </tr>

                      {/* Position Feedback */}
                      <tr>
                        <td className="p-3.5 font-semibold text-[#344054] sticky left-0 bg-white z-10 border-r border-[#E5EAF1]">
                          Position Feedback
                        </td>
                        {comparedVariants.map((v) => (
                          <td key={v.modelCode} className="p-3.5 font-mono text-[#172033]">
                            {v.encoderResolution}
                          </td>
                        ))}
                      </tr>

                      {/* Current Requirements */}
                      <tr>
                        <td className="p-3.5 font-semibold text-[#344054] sticky left-0 bg-white z-10 border-r border-[#E5EAF1]">
                          Current (Continuous / Peak)
                        </td>
                        {comparedVariants.map((v) => (
                          <td key={v.modelCode} className="p-3.5 font-mono text-[#172033]">
                            {v.continuousCurrent} / {v.peakCurrent}
                          </td>
                        ))}
                      </tr>

                      {/* Flange Dimensions & Mass */}
                      <tr>
                        <td className="p-3.5 font-semibold text-[#344054] sticky left-0 bg-white z-10 border-r border-[#E5EAF1]">
                          Flange Size / Total Mass
                        </td>
                        {comparedVariants.map((v) => (
                          <td key={v.modelCode} className="p-3.5 font-mono text-[#172033]">
                            {v.flangeSizeMm} · {v.massKg}
                          </td>
                        ))}
                      </tr>

                      {/* Environmental & Enclosure */}
                      <tr>
                        <td className="p-3.5 font-semibold text-[#344054] sticky left-0 bg-white z-10 border-r border-[#E5EAF1]">
                          Ingress Rating &amp; Temp
                        </td>
                        {comparedVariants.map((v) => (
                          <td key={v.modelCode} className="p-3.5 font-mono text-[#172033]">
                            {v.ipRating} · 0°C to +50°C
                          </td>
                        ))}
                      </tr>

                      {/* Mechanical Interface */}
                      <tr>
                        <td className="p-3.5 font-semibold text-[#344054] sticky left-0 bg-white z-10 border-r border-[#E5EAF1]">
                          Mechanical Output Interface
                        </td>
                        {comparedVariants.map((v) => (
                          <td key={v.modelCode} className="p-3.5 text-xs text-[#475467]">
                            {v.integrationRequirements || "ISO 9409-1 Flange Pattern"}
                          </td>
                        ))}
                      </tr>
                    </>
                  ) : (
                    <>
                      {/* Linear: Continuous Thrust Force */}
                      <tr>
                        <td className="p-3.5 font-semibold text-[#344054] sticky left-0 bg-white z-10 border-r border-[#E5EAF1]">
                          Continuous Thrust Force
                          <span className="text-[10px] text-[#667085] block font-mono">S1 Linear Push</span>
                        </td>
                        {comparedVariants.map((v) => (
                          <td key={v.modelCode} className="p-3.5 font-mono text-[#172033] font-bold">
                            <span className="text-base text-[#155EEF]">{v.nominalTorqueOrForce}</span>
                          </td>
                        ))}
                      </tr>

                      {/* Peak Thrust Force */}
                      <tr className="bg-[#FFFAEB]/30">
                        <td className="p-3.5 font-semibold text-[#344054] sticky left-0 bg-[#FFFAEB]/40 z-10 border-r border-[#E5EAF1]">
                          Peak Acceleration Thrust
                          <span className="text-[10px] text-[#B54708] block font-mono">Duration ≤ 0.5s</span>
                        </td>
                        {comparedVariants.map((v) => (
                          <td key={v.modelCode} className="p-3.5 font-mono text-[#B54708] font-bold">
                            {v.peakTorqueOrForce}
                          </td>
                        ))}
                      </tr>

                      {/* Linear Velocity */}
                      <tr>
                        <td className="p-3.5 font-semibold text-[#344054] sticky left-0 bg-white z-10 border-r border-[#E5EAF1]">
                          Linear Speed (Rated / Max)
                        </td>
                        {comparedVariants.map((v) => (
                          <td key={v.modelCode} className="p-3.5 font-mono text-[#172033]">
                            {v.ratedSpeed} / {v.maxSpeed}
                          </td>
                        ))}
                      </tr>

                      {/* Stroke Range */}
                      <tr>
                        <td className="p-3.5 font-semibold text-[#344054] sticky left-0 bg-white z-10 border-r border-[#E5EAF1]">
                          Available Stroke Range
                        </td>
                        {comparedVariants.map((v) => (
                          <td key={v.modelCode} className="p-3.5 font-mono text-[#172033]">
                            {v.strokeRangeMm || "100 – 1400 mm"}
                          </td>
                        ))}
                      </tr>

                      {/* Optical Feedback Scale */}
                      <tr>
                        <td className="p-3.5 font-semibold text-[#344054] sticky left-0 bg-white z-10 border-r border-[#E5EAF1]">
                          Direct Linear Feedback
                        </td>
                        {comparedVariants.map((v) => (
                          <td key={v.modelCode} className="p-3.5 font-mono text-[#16A34A] font-semibold">
                            {v.encoderResolution}
                          </td>
                        ))}
                      </tr>

                      {/* Profile & Mass */}
                      <tr>
                        <td className="p-3.5 font-semibold text-[#344054] sticky left-0 bg-white z-10 border-r border-[#E5EAF1]">
                          Extrusion Profile &amp; Mass
                        </td>
                        {comparedVariants.map((v) => (
                          <td key={v.modelCode} className="p-3.5 font-mono text-[#172033]">
                            {v.flangeSizeMm} · {v.massKg}
                          </td>
                        ))}
                      </tr>

                      {/* Ingress Protection */}
                      <tr>
                        <td className="p-3.5 font-semibold text-[#344054] sticky left-0 bg-white z-10 border-r border-[#E5EAF1]">
                          Ingress Protection
                        </td>
                        {comparedVariants.map((v) => (
                          <td key={v.modelCode} className="p-3.5 font-mono text-[#172033]">
                            {v.ipRating}
                          </td>
                        ))}
                      </tr>
                    </>
                  )}

                  {/* Actions Row */}
                  <tr className="bg-[#F8FAFC]">
                    <td className="p-3.5 font-bold text-[#172033] sticky left-0 bg-[#F8FAFC] z-10 border-r border-[#E5EAF1]">
                      Configuration Actions
                    </td>
                    {comparedVariants.map((v) => (
                      <td key={v.modelCode} className="p-3.5 space-y-2">
                        <Button
                          size="sm"
                          className="w-full h-8 text-[11px] font-bold bg-[#155EEF] hover:bg-[#1047BF] text-white"
                          onClick={() => {
                            transferActuatorToFinder({
                              category: actuatorCategory === "rotary" ? "rotary-actuator" : "linear-actuator",
                              modelCode: v.modelCode,
                              continuousTorqueOrForce: v.nominalTorqueOrForce,
                              peakTorqueOrForce: v.peakTorqueOrForce,
                              ratedSpeed: v.ratedSpeed,
                              strokeMm: v.strokeRangeMm,
                              flangeSize: v.flangeSizeMm,
                            });
                          }}
                        >
                          Configure in Application Finder
                        </Button>

                        <div className="flex items-center gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 h-7 text-[10.5px] border-[#D0D5DD] text-[#344054]"
                            onClick={() =>
                              ActuatorAIActions.explainSpecification(
                                "Continuous Torque / Thrust",
                                v.nominalTorqueOrForce,
                                v.modelCode
                              )
                            }
                          >
                            Ask AI
                          </Button>

                          <Link
                            to={`/products/${activeProductData.categorySlug}/${activeProductData.slug}`}
                            className="inline-flex items-center justify-center h-7 px-2.5 rounded-md border border-[#D0D5DD] bg-white text-[10.5px] font-medium text-[#155EEF] hover:bg-[#F2F4F7]"
                          >
                            Dossier
                          </Link>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: ACTUATOR MONITORING DASHBOARD & VISUALIZATIONS (PROMPT SECTION 3 & 4)
         ========================================================================= */}
      {activeTab === "telemetry" && (
        <div className="space-y-6">
          {/* Dashboard Control Bar */}
          <div className="rounded-2xl border border-[#D1E0FF] bg-white p-5 sm:p-6 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#E5EAF1]">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`flex size-2 rounded-full ${
                      conditionScenario === "normal"
                        ? "bg-[#16A34A] animate-pulse"
                        : conditionScenario === "stale-data-timeout"
                        ? "bg-[#F79009]"
                        : "bg-[#D92D20] animate-ping"
                    }`}
                  />
                  <span
                    className={`text-[11px] font-mono font-bold uppercase tracking-wider ${
                      conditionScenario === "normal"
                        ? "text-[#16A34A]"
                        : conditionScenario === "stale-data-timeout"
                        ? "text-[#B54708]"
                        : "text-[#B42318]"
                    }`}
                  >
                    {conditionScenario === "normal"
                      ? "Telemetry Stream Active (Simulated Demo)"
                      : conditionScenario === "stale-data-timeout"
                      ? "Fieldbus Stream Stale (Timeout Alert)"
                      : "Anomaly Condition Triggered"}
                  </span>
                  <span className="text-[#D0D5DD]">•</span>
                  <span className="text-[11px] font-mono font-bold text-[#155EEF]">
                    {telemetryModel}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#172033] mt-1">
                  Closed-Loop Actuator Telemetry &amp; Vector DSP Monitoring
                </h3>
                <p className="text-xs text-[#667085] mt-0.5">
                  Synchronous multi-axis DSP vector data, dual-encoder tracking error, and thermal equilibrium monitoring.
                </p>
              </div>

              {/* Controls & Mode Selectors */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                {/* Active Model Selector */}
                <select
                  aria-label="Active Model Selector"
                  value={telemetryModel}
                  onChange={(e) => setTelemetryModel(e.target.value)}
                  className="h-8 rounded-lg border border-[#D0D5DD] bg-white px-2.5 text-xs font-mono font-bold text-[#172033] cursor-pointer"
                >
                  <option value="IND-IRA-070-50">IND-IRA-070 (35 Nm)</option>
                  <option value="IND-IRA-090-80">IND-IRA-090 (85 Nm)</option>
                  <option value="IND-IRA-115-100">IND-IRA-115 (175 Nm)</option>
                  <option value="IND-ILA-080-B16">IND-ILA-080 (1600 N Slide)</option>
                </select>

                {/* CiA 402 Mode Selector */}
                <div className="flex items-center rounded-lg border border-[#E5EAF1] bg-[#F8FAFC] p-1 text-xs">
                  {(["CSP", "CSV", "CST"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setControlMode(m)}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                        controlMode === m
                          ? "bg-[#155EEF] text-white font-bold"
                          : "text-[#667085] hover:text-[#172033]"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                {/* Play/Pause */}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="h-8 border-[#E5EAF1] text-xs font-semibold"
                >
                  {isPlaying ? (
                    <>
                      <Pause size={12} className="mr-1 text-[#667085]" /> Pause
                    </>
                  ) : (
                    <>
                      <Play size={12} className="mr-1 text-[#155EEF]" /> Resume
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Simulated Anomaly State Switcher (Demonstrating Stale & Error States) */}
            <div className="mt-4 pt-3 border-t border-[#E5EAF1] flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="font-semibold text-[#475467] flex items-center gap-1.5">
                <Sliders size={13} className="text-[#155EEF]" />
                <span>Simulate Real Factory Telemetry Scenarios:</span>
              </span>

              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: "normal", label: "Normal (Healthy)", color: "text-[#16A34A]" },
                  { id: "thermal-warning", label: "High Thermal Load (>85°C)", color: "text-[#B54708]" },
                  { id: "tracking-error-alarm", label: "Following Error Spike (>12')", color: "text-[#D92D20]" },
                  { id: "stale-data-timeout", label: "Fieldbus Stale (Timeout)", color: "text-[#B54708]" },
                  { id: "sto-tripped", label: "STO Safety Interlock Tripped", color: "text-[#D92D20]" },
                ].map((sc) => (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => setConditionScenario(sc.id as TelemetryConditionState)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors cursor-pointer border ${
                      conditionScenario === sc.id
                        ? "border-[#155EEF] bg-[#EFF6FF] text-[#155EEF] font-bold"
                        : "border-[#E5EAF1] bg-[#F8FAFC] text-[#667085] hover:bg-white"
                    }`}
                  >
                    {sc.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Stale Data Warning Banner */}
            {conditionScenario === "stale-data-timeout" && (
              <div className="mt-4 rounded-xl border border-[#F79009] bg-[#FFFAEB] p-3 text-xs text-[#B54708] flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>
                    <strong>FIELDBUS TIMEOUT · TELEMETRY STALE:</strong> Last valid cyclic synchronous frame received {staleSeconds.toFixed(1)}s ago. Diagnostic flags marked invalid.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setConditionScenario("normal")}
                  className="font-bold underline cursor-pointer"
                >
                  Reset Stream
                </button>
              </div>
            )}
          </div>

          {/* Top Metric KPI Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
            {/* Position */}
            <div className="rounded-xl border border-[#E5EAF1] bg-white p-4 shadow-2xs">
              <div className="flex items-center justify-between text-[#667085] text-xs">
                <span className="font-medium">Output Position</span>
                <RotateCw size={14} className="text-[#155EEF]" />
              </div>
              <div className="mt-1.5 flex items-baseline gap-1.5">
                <span className="font-mono text-2xl font-black text-[#172033]">
                  {currentSample.actualPos >= 0 ? `+${currentSample.actualPos}` : currentSample.actualPos}
                </span>
                <span className="text-xs font-mono text-[#667085]">
                  {telemetryModel.includes("ILA") ? "mm" : "deg"}
                </span>
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[10.5px] font-mono text-[#667085]">
                <span>Cmd: {currentSample.commandedPos}</span>
                <span className="text-[#155EEF]">Dual Absolute</span>
              </div>
            </div>

            {/* Velocity */}
            <div className="rounded-xl border border-[#E5EAF1] bg-white p-4 shadow-2xs">
              <div className="flex items-center justify-between text-[#667085] text-xs">
                <span className="font-medium">Shaft Velocity</span>
                <Gauge size={14} className="text-[#155EEF]" />
              </div>
              <div className="mt-1.5 flex items-baseline gap-1.5">
                <span className="font-mono text-2xl font-black text-[#172033]">
                  {Math.abs(currentSample.velocity)}
                </span>
                <span className="text-xs font-mono text-[#667085]">
                  {telemetryModel.includes("ILA") ? "mm/s" : "rpm"}
                </span>
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[10.5px] font-mono text-[#667085]">
                <span>{controlMode} Profile Active</span>
                <span className="text-[#16A34A]">Nominal</span>
              </div>
            </div>

            {/* Torque / Current */}
            <div className="rounded-xl border border-[#E5EAF1] bg-white p-4 shadow-2xs">
              <div className="flex items-center justify-between text-[#667085] text-xs">
                <span className="font-medium">Dynamic Torque / Current</span>
                <Zap size={14} className="text-[#155EEF]" />
              </div>
              <div className="mt-1.5 flex items-baseline gap-1.5">
                <span className="font-mono text-2xl font-black text-[#172033]">
                  {currentSample.torqueOrForce}
                </span>
                <span className="text-xs font-mono text-[#667085]">
                  {telemetryModel.includes("ILA") ? "N" : "Nm"} ({currentSample.current}A)
                </span>
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[10.5px] font-mono text-[#667085]">
                <span>48V DC Supply Bus</span>
                <span
                  className={
                    conditionScenario === "thermal-warning" ? "text-[#B54708] font-bold" : "text-[#16A34A]"
                  }
                >
                  {conditionScenario === "thermal-warning" ? "Derating" : "S1 Safe"}
                </span>
              </div>
            </div>

            {/* Temperature */}
            <div className="rounded-xl border border-[#E5EAF1] bg-white p-4 shadow-2xs">
              <div className="flex items-center justify-between text-[#667085] text-xs">
                <span className="font-medium">Stator Temperature</span>
                <Thermometer size={14} className="text-[#155EEF]" />
              </div>
              <div className="mt-1.5 flex items-baseline gap-1.5">
                <span
                  className={`font-mono text-2xl font-black ${
                    currentSample.temperature > 85 ? "text-[#D92D20]" : "text-[#172033]"
                  }`}
                >
                  {currentSample.temperature}
                </span>
                <span className="text-xs font-mono text-[#667085]">°C</span>
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[10.5px] font-mono text-[#667085]">
                <span>Derate: 85°C / Trip: 115°C</span>
                <span
                  className={
                    currentSample.temperature > 85 ? "text-[#D92D20] font-bold" : "text-[#16A34A]"
                  }
                >
                  {currentSample.temperature > 85 ? "Limit Warning" : "Equilibrium"}
                </span>
              </div>
            </div>
          </div>

          {/* Visualization Selector Tabs */}
          <div className="rounded-2xl border border-[#E5EAF1] bg-white p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-[#E5EAF1]">
              <div>
                <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-[#155EEF] block">
                  Engineering Visualizations
                </span>
                <h4 className="text-base font-bold text-[#172033]">
                  Synchronous Waveforms &amp; Dynamic Tracking Error
                </h4>
              </div>

              <div className="flex flex-wrap gap-1 text-xs">
                {[
                  { id: "position", label: "Position Tracking" },
                  { id: "velocity", label: "Velocity Envelope" },
                  { id: "torque", label: "Dynamic Torque/Thrust" },
                  { id: "temperature", label: "Thermal Trends" },
                  { id: "tracking", label: "Following Error Window" },
                  { id: "alarms", label: "Alarm Event Counts" },
                ].map((vis) => (
                  <button
                    key={vis.id}
                    type="button"
                    onClick={() => setActiveVisualization(vis.id as any)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                      activeVisualization === vis.id
                        ? "bg-[#155EEF] text-white font-bold"
                        : "text-[#667085] hover:bg-[#F2F4F7]"
                    }`}
                  >
                    {vis.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Waveform Trace Render Pane */}
            <div className="rounded-xl border border-[#E5EAF1] bg-[#FBFDFE] p-4">
              {activeVisualization === "position" && (
                <div>
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#172033] uppercase tracking-wider text-[11px]">
                        Position Trajectory (Command vs Output Flange Encoder)
                      </span>
                      <span className="text-[10px] font-mono text-[#667085] bg-white border border-[#E5EAF1] px-1.5 py-0.5 rounded">
                        Sample: 200ms
                      </span>
                    </div>
                    <div className="flex items-center gap-4 font-mono text-[11px]">
                      <span className="flex items-center gap-1 text-[#155EEF] font-semibold">
                        <span className="size-2 rounded-full bg-[#155EEF]" /> Commanded Target
                      </span>
                      <span className="flex items-center gap-1 text-[#16A34A] font-semibold">
                        <span className="size-2 rounded-full bg-[#16A34A]" /> Flange Encoder Actual
                      </span>
                    </div>
                  </div>

                  <div className="h-44 w-full relative">
                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 260 100">
                      <line x1="0" y1="20" x2="260" y2="20" stroke="#E5EAF1" strokeDasharray="3 3" />
                      <line x1="0" y1="50" x2="260" y2="50" stroke="#E5EAF1" strokeWidth="1.5" />
                      <line x1="0" y1="80" x2="260" y2="80" stroke="#E5EAF1" strokeDasharray="3 3" />

                      {dataHistory.length > 1 && (
                        <polyline
                          fill="none"
                          stroke="#155EEF"
                          strokeWidth="2"
                          strokeDasharray="4 2"
                          points={dataHistory
                            .map((p, idx) => {
                              const x = (idx / 25) * 260;
                              const y = 50 - (p.commandedPos / 180) * 40;
                              return `${x},${y}`;
                            })
                            .join(" ")}
                        />
                      )}

                      {dataHistory.length > 1 && (
                        <polyline
                          fill="none"
                          stroke="#16A34A"
                          strokeWidth="2.5"
                          points={dataHistory
                            .map((p, idx) => {
                              const x = (idx / 25) * 260;
                              const y = 50 - (p.actualPos / 180) * 40;
                              return `${x},${y}`;
                            })
                            .join(" ")}
                        />
                      )}
                    </svg>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[#E5EAF1] text-xs text-[#667085] leading-relaxed">
                    <strong>Engineering Relevance:</strong> In high-precision robotic joints, comparing motor-side and output flange encoders reveals mechanical compliance and torsional windup under dynamic payload acceleration. The dual-encoder feedback loop actively cancels this elastic deflection.
                  </div>
                </div>
              )}

              {activeVisualization === "velocity" && (
                <div>
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="font-bold text-[#172033] uppercase tracking-wider text-[11px]">
                      Velocity Envelope &amp; S-Curve Acceleration Profile
                    </span>
                    <span className="font-mono text-[11px] text-[#155EEF]">
                      Nominal: {telemetryModel.includes("ILA") ? "500 mm/s" : "35 rpm"}
                    </span>
                  </div>

                  <div className="h-44 w-full relative">
                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 260 100">
                      <line x1="0" y1="20" x2="260" y2="20" stroke="#E5EAF1" strokeDasharray="3 3" />
                      <line x1="0" y1="50" x2="260" y2="50" stroke="#CBD5E1" strokeWidth="1" />
                      <line x1="0" y1="80" x2="260" y2="80" stroke="#E5EAF1" strokeDasharray="3 3" />

                      {dataHistory.length > 1 && (
                        <polyline
                          fill="none"
                          stroke="#155EEF"
                          strokeWidth="2.5"
                          points={dataHistory
                            .map((p, idx) => {
                              const x = (idx / 25) * 260;
                              const y = 50 - (p.velocity / 60) * 35;
                              return `${x},${y}`;
                            })
                            .join(" ")}
                        />
                      )}
                    </svg>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[#E5EAF1] text-xs text-[#667085] leading-relaxed">
                    <strong>Engineering Relevance:</strong> Evaluates velocity smoothness and settling jitter. S-curve polynomial profile generation limits jerk, mitigating mechanical vibration during high-speed pick-and-place indexing.
                  </div>
                </div>
              )}

              {activeVisualization === "torque" && (
                <div>
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="font-bold text-[#172033] uppercase tracking-wider text-[11px]">
                      Dynamic Torque/Thrust vs S1 Continuous Safe Envelope
                    </span>
                    <div className="flex items-center gap-3 font-mono text-[11px]">
                      <span className="text-[#16A34A]">Continuous S1 Limit</span>
                      <span className="text-[#D92D20]">Peak Acceleration Limit</span>
                    </div>
                  </div>

                  <div className="h-44 w-full relative">
                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 260 100">
                      {/* S1 Continuous Threshold Line */}
                      <line x1="0" y1="40" x2="260" y2="40" stroke="#16A34A" strokeDasharray="4 2" strokeWidth="1.5" />
                      {/* Peak Trip Line */}
                      <line x1="0" y1="12" x2="260" y2="12" stroke="#FDA29B" strokeDasharray="2 2" strokeWidth="1.5" />

                      {dataHistory.length > 1 && (
                        <polyline
                          fill="none"
                          stroke="#155EEF"
                          strokeWidth="2.5"
                          points={dataHistory
                            .map((p, idx) => {
                              const x = (idx / 25) * 260;
                              const y = 90 - (p.torqueOrForce / 120) * 75;
                              return `${x},${y}`;
                            })
                            .join(" ")}
                        />
                      )}
                    </svg>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[#E5EAF1] text-xs text-[#667085] leading-relaxed">
                    <strong>Engineering Relevance:</strong> Operating within the green S1 envelope guarantees 24/7 continuous duty without thermal derating. Transient peaks during acceleration must stay below the red line and not exceed 10% duty factor.
                  </div>
                </div>
              )}

              {activeVisualization === "temperature" && (
                <div>
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="font-bold text-[#172033] uppercase tracking-wider text-[11px]">
                      Winding &amp; Power Inverter Thermal Equilibrium Trend
                    </span>
                    <span className="font-mono text-[11px] text-[#B54708]">
                      Derate Warning: 85°C · Hardware Cut-off: 115°C
                    </span>
                  </div>

                  <div className="h-44 w-full relative">
                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 260 100">
                      <line x1="0" y1="35" x2="260" y2="35" stroke="#F79009" strokeDasharray="4 2" strokeWidth="1.5" />
                      <line x1="0" y1="15" x2="260" y2="15" stroke="#D92D20" strokeWidth="1.5" />

                      {dataHistory.length > 1 && (
                        <polyline
                          fill="none"
                          stroke="#7A271A"
                          strokeWidth="2.5"
                          points={dataHistory
                            .map((p, idx) => {
                              const x = (idx / 25) * 260;
                              const y = 95 - (p.temperature / 120) * 80;
                              return `${x},${y}`;
                            })
                            .join(" ")}
                        />
                      )}
                    </svg>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[#E5EAF1] text-xs text-[#667085] leading-relaxed">
                    <strong>Engineering Relevance:</strong> Thermistor telemetry confirms that convective heat dissipation through the mounting flange is adequate. Approaching 85°C triggers automatic closed-loop current limiting to preserve winding insulation.
                  </div>
                </div>
              )}

              {activeVisualization === "tracking" && (
                <div>
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="font-bold text-[#172033] uppercase tracking-wider text-[11px]">
                      Following Error Deviation Window (arcmin / µm)
                    </span>
                    <span className="font-mono text-[11px] text-[#667085]">
                      Tolerance Limit: ±12.0 arcmin
                    </span>
                  </div>

                  <div className="h-44 w-full relative">
                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 260 100">
                      <line x1="0" y1="25" x2="260" y2="25" stroke="#FDA29B" strokeDasharray="2 2" />
                      <line x1="0" y1="50" x2="260" y2="50" stroke="#CBD5E1" strokeWidth="1" />
                      <line x1="0" y1="75" x2="260" y2="75" stroke="#FDA29B" strokeDasharray="2 2" />

                      {dataHistory.length > 1 && (
                        <polyline
                          fill="none"
                          stroke="#B42318"
                          strokeWidth="2"
                          points={dataHistory
                            .map((p, idx) => {
                              const x = (idx / 25) * 260;
                              const y = 50 - (p.trackingError / 20) * 35;
                              return `${x},${y}`;
                            })
                            .join(" ")}
                        />
                      )}
                    </svg>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[#E5EAF1] text-xs text-[#667085] leading-relaxed">
                    <strong>Engineering Relevance:</strong> Following error reveals transmission play, payload inertia mismatch, or mechanical binding. Sudden spikes indicate collision, external jamming, or worn bearing raceways.
                  </div>
                </div>
              )}

              {activeVisualization === "alarms" && (
                <div>
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="font-bold text-[#172033] uppercase tracking-wider text-[11px]">
                      Historical Event &amp; Alarm Journal (EEPROM Non-Volatile Log)
                    </span>
                    <span className="font-mono text-[11px] text-[#16A34A]">
                      Cumulative Operating Cycles: {operatingCycles.toLocaleString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
                    <div className="bg-white p-3 rounded-lg border border-[#E5EAF1]">
                      <span className="text-[#667085] text-[11px] block">Thermal Warning Events (24h)</span>
                      <strong className="text-xl font-mono text-[#172033] block mt-1">
                        {alarmStats.thermalWarnings24h}
                      </strong>
                      <span className="text-[10px] text-[#16A34A]">Self-cleared after dwell</span>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-[#E5EAF1]">
                      <span className="text-[#667085] text-[11px] block">Tracking Error Spikes (24h)</span>
                      <strong className="text-xl font-mono text-[#172033] block mt-1">
                        {alarmStats.trackingSpikes24h}
                      </strong>
                      <span className="text-[10px] text-[#B54708]">Acceleration transient</span>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-[#E5EAF1]">
                      <span className="text-[#667085] text-[11px] block">STO E-Stop Actuations (7d)</span>
                      <strong className="text-xl font-mono text-[#16A34A] block mt-1">
                        {alarmStats.stoTrips7d}
                      </strong>
                      <span className="text-[10px] text-[#16A34A]">Zero safety faults</span>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-[#E5EAF1]">
                      <span className="text-[#667085] text-[11px] block">Running Hours</span>
                      <strong className="text-xl font-mono text-[#172033] block mt-1">
                        {runningHours} h
                      </strong>
                      <span className="text-[10px] text-[#667085]">Scheduled PM at 20,000h</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[#E5EAF1] text-xs text-[#667085] leading-relaxed">
                    <strong>Engineering Relevance:</strong> Traceable non-volatile event logging conforms to CiA 402 error history registers (0x1003). Preserves machine diagnostic history across power cycles without requiring external database servers.
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Statusword Strip */}
            <div className="mt-4 pt-3 border-t border-[#E5EAF1] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="flex items-center gap-2 text-[#475467]">
                <Wifi size={14} className="text-[#155EEF]" />
                <span>
                  CiA 402 Statusword: <strong className="font-mono text-[#172033]">0x0237 (Operation Enabled)</strong>
                </span>
              </div>
              <div className="flex items-center gap-2 text-[#475467]">
                <CheckCircle2 size={14} className="text-[#16A34A]" />
                <span>
                  Sync Jitter: <strong className="font-mono text-[#172033]">&lt; 0.8 µs (DC Active)</strong>
                </span>
              </div>
              <div className="flex items-center gap-2 text-[#475467]">
                <ShieldCheck size={14} className="text-[#16A34A]" />
                <span>
                  STO Channel: <strong className="font-mono text-[#16A34A]">Dual 24V Closed (SIL2 Safe)</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: INTELLIGENT DIAGNOSTICS & CONDITION MONITORING (PROMPT SECTION 6)
         ========================================================================= */}
      {activeTab === "diagnostics" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#E5EAF1] bg-white p-5 sm:p-6 shadow-xs">
            <div className="max-w-3xl mb-6">
              <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-[#155EEF] block mb-1">
                Embedded Drive Diagnostic Rules
              </span>
              <h3 className="text-xl font-bold text-[#172033]">
                Monitored Fault &amp; Condition Rules Matrix
              </h3>
              <p className="text-xs text-[#667085] mt-1 leading-relaxed">
                Adhering to verified physical threshold limits. Detects thermal drift, following error deviation, over-current draw, and communication delays before mechanical damage occurs.
              </p>
            </div>

            <div className="space-y-4">
              {/* Diagnostic Condition 1 */}
              <div className="rounded-xl border border-[#FDA29B] bg-[#FFFBFA] p-4 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 mb-2 border-b border-[#FDA29B]/40">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-[#FEE4E2] text-[#B42318] px-2 py-0.5 font-mono text-[10.5px] font-bold">
                      CONDITION 01 · THERMAL EXCEEDANCE
                    </span>
                    <strong className="text-sm font-bold text-[#172033]">
                      Stator / Inverter Over-Temperature Derate
                    </strong>
                  </div>
                  <span className="text-[11px] font-mono text-[#B42318]">
                    Observed: 88.6°C (Rule: Derate at 85.0°C / Trip at 115.0°C)
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 text-[#475467] leading-relaxed">
                  <div>
                    <span className="font-semibold text-[#172033] block mb-1">Possible Engineering Causes:</span>
                    <ul className="list-disc pl-4 space-y-0.5 text-[11.5px]">
                      <li>Continuous duty cycle exceeding rated S1 continuous torque envelope.</li>
                      <li>Mounting plate thickness &lt;15mm or insufficient chassis thermal conductivity.</li>
                      <li>Ambient workcell temperature exceeding rated +40°C threshold.</li>
                    </ul>
                  </div>

                  <div>
                    <span className="font-semibold text-[#172033] block mb-1">Recommended Investigation:</span>
                    <ul className="list-disc pl-4 space-y-0.5 text-[11.5px]">
                      <li>Measure continuous RMS current to verify load remains within nominal envelope.</li>
                      <li>Inspect mounting face thermal paste and verify contact flatness.</li>
                      <li>Consult Whitepaper WP-IRA-2026 for duty cycle derating curves.</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#FDA29B]/40 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[10.5px] font-mono text-[#667085]">
                    Doc Reference: DS-IND-IRA-2026 Sec 4.2 · IEC 60034-1 Thermal Standard
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-[11px] border-[#D0D5DD] bg-white text-[#344054]"
                      onClick={() =>
                        ActuatorAIActions.explainDiagnosticIndicator(
                          "Stator Over-Temperature",
                          "88.6°C",
                          "85.0°C Derate / 115.0°C Trip"
                        )
                      }
                    >
                      Ask AI Guide to Explain Condition
                    </Button>
                    <Button
                      size="sm"
                      className="h-7 text-[11px] bg-[#155EEF] text-white font-semibold"
                      onClick={() => openModal("engineer", { categoryName: "Intelligent Actuators" })}
                    >
                      Request Engineering Review
                    </Button>
                  </div>
                </div>
              </div>

              {/* Diagnostic Condition 2 */}
              <div className="rounded-xl border border-[#FEDF89] bg-[#FFFCF5] p-4 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 mb-2 border-b border-[#FEDF89]/60">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-[#FEF0C7] text-[#B54708] px-2 py-0.5 font-mono text-[10.5px] font-bold">
                      CONDITION 02 · KINEMATIC COMPLIANCE
                    </span>
                    <strong className="text-sm font-bold text-[#172033]">
                      Dynamic Following Error Window Exceeded
                    </strong>
                  </div>
                  <span className="text-[11px] font-mono text-[#B54708]">
                    Observed: 14.8 arcmin (Rule: Warning &gt;12.0 arcmin)
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 text-[#475467] leading-relaxed">
                  <div>
                    <span className="font-semibold text-[#172033] block mb-1">Possible Engineering Causes:</span>
                    <ul className="list-disc pl-4 space-y-0.5 text-[11.5px]">
                      <li>External mechanical binding or collision during motion trajectory.</li>
                      <li>Payload inertia ratio exceeds recommended 10:1 matching limit.</li>
                      <li>Position loop gain (Kp) or velocity feedforward requires retuning.</li>
                    </ul>
                  </div>

                  <div>
                    <span className="font-semibold text-[#172033] block mb-1">Recommended Investigation:</span>
                    <ul className="list-disc pl-4 space-y-0.5 text-[11.5px]">
                      <li>Rotate output flange with power removed to check for mechanical binding.</li>
                      <li>Verify dual-encoder calibration offset in drive object dictionary.</li>
                      <li>Run auto-tuning routine via TwinCAT / CODESYS commissioning tool.</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#FEDF89]/60 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[10.5px] font-mono text-[#667085]">
                    Doc Reference: MAN-IND-IRA-ETH-2026 Chapter 6 'CiA 402 Gain Tuning'
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-[11px] border-[#D0D5DD] bg-white text-[#344054]"
                    onClick={() =>
                      ActuatorAIActions.explainDiagnosticIndicator(
                        "Following Error Window",
                        "14.8 arcmin",
                        "12.0 arcmin"
                      )
                    }
                  >
                    Ask AI Guide to Explain Condition
                  </Button>
                </div>
              </div>

              {/* Diagnostic Condition 3 */}
              <div className="rounded-xl border border-[#B2CCFF] bg-[#F5F8FF] p-4 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 mb-2 border-b border-[#B2CCFF]/60">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-[#EFF6FF] text-[#155EEF] px-2 py-0.5 font-mono text-[10.5px] font-bold">
                      CONDITION 03 · COMMUNICATION
                    </span>
                    <strong className="text-sm font-bold text-[#172033]">
                      EtherCAT Distributed Clocks Jitter / Packet Loss
                    </strong>
                  </div>
                  <span className="text-[11px] font-mono text-[#155EEF]">
                    Observed: Jitter &gt;25 µs (Rule: Limit &lt;1.0 µs DC Sync)
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 text-[#475467] leading-relaxed">
                  <div>
                    <span className="font-semibold text-[#172033] block mb-1">Possible Engineering Causes:</span>
                    <ul className="list-disc pl-4 space-y-0.5 text-[11.5px]">
                      <li>Unshielded patch cables or EMI noise from adjacent inverter power lines.</li>
                      <li>Host PLC / IPC task overrun or competing non-real-time CPU load.</li>
                      <li>Damaged M12 industrial connector shielding termination.</li>
                    </ul>
                  </div>

                  <div>
                    <span className="font-semibold text-[#172033] block mb-1">Recommended Investigation:</span>
                    <ul className="list-disc pl-4 space-y-0.5 text-[11.5px]">
                      <li>Ensure Cat5e shielded twisted pair cabling with 360° shield ground clamp.</li>
                      <li>Verify host PLC cycle time is set to integer 1.0 ms or 500 µs interval.</li>
                      <li>Review EtherCAT master diagnostic packet error counter.</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#B2CCFF]/60 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[10.5px] font-mono text-[#667085]">
                    Doc Reference: APP-IND-IRA-XML-ESI 'EtherCAT Distributed Clocks Guide'
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-[11px] border-[#D0D5DD] bg-white text-[#344054]"
                    onClick={() =>
                      ActuatorAIActions.explainDiagnosticIndicator(
                        "EtherCAT DC Sync Jitter",
                        "28 µs",
                        "1.0 µs"
                      )
                    }
                  >
                    Ask AI Guide to Explain Condition
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: CONTROL & INTEGRATION GUIDELINES (PROMPT SECTION 5)
         ========================================================================= */}
      {activeTab === "control-guidance" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#E5EAF1] bg-white p-5 sm:p-7 shadow-xs">
            <div className="max-w-3xl mb-8">
              <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-[#155EEF] block mb-1">
                Engineering Integration Manual
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#172033]">
                Control Architecture, Fieldbuses &amp; Functional Safety
              </h3>
              <p className="text-xs sm:text-sm text-[#667085] mt-1 leading-relaxed">
                Technical principles and confirmed specifications for integrating INDUS intelligent actuators into Beckhoff, Siemens, Omron, and CODESYS automation systems.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Pillar 1: Open vs Closed Loop */}
              <div className="rounded-xl border border-[#E5EAF1] bg-[#F8FAFC] p-5">
                <div className="flex items-center gap-2 mb-2 font-bold text-[#172033] text-sm">
                  <Cpu size={16} className="text-[#155EEF]" />
                  <h4>Open-Loop vs. Closed-Loop FOC Vector Control</h4>
                </div>
                <p className="text-xs text-[#667085] leading-relaxed">
                  Open-loop stepper systems suffer from lost steps under unexpected load spikes and high thermal dissipation at standstill. INDUS actuators implement 20 kHz field-oriented vector control (FOC) with space-vector PWM. Commutation current is dynamically metered to match actual mechanical load resistance, running cooler and ensuring 100% trajectory fidelity.
                </p>
                <div className="mt-3 pt-2.5 border-t border-[#E5EAF1] text-[11px] font-mono text-[#155EEF]">
                  Verified: 20 kHz current loop, 5 kHz velocity loop, 1 kHz position loop.
                </div>
              </div>

              {/* Pillar 2: Dual Absolute Encoders */}
              <div className="rounded-xl border border-[#E5EAF1] bg-[#F8FAFC] p-5">
                <div className="flex items-center gap-2 mb-2 font-bold text-[#172033] text-sm">
                  <Compass size={16} className="text-[#155EEF]" />
                  <h4>Dual 19-Bit Absolute Feedback Architecture</h4>
                </div>
                <p className="text-xs text-[#667085] leading-relaxed">
                  Conventional actuators sample position only at the motor shaft, leaving them blind to gear compliance and strain-wave deflection. INDUS incorporates a primary 17-bit commutation encoder on the motor shaft plus a secondary 19-bit (524,288 cts/rev) optical encoder directly on the output flange. The embedded DSP drive counteracts joint deflection in real time.
                </p>
                <div className="mt-3 pt-2.5 border-t border-[#E5EAF1] text-[11px] font-mono text-[#155EEF]">
                  Verified: BiSS-C synchronous serial interface with battery-less multi-turn memory.
                </div>
              </div>

              {/* Pillar 3: Servo Drives (Integrated vs Centralized) */}
              <div className="rounded-xl border border-[#E5EAF1] bg-[#F8FAFC] p-5">
                <div className="flex items-center gap-2 mb-2 font-bold text-[#172033] text-sm">
                  <Zap size={16} className="text-[#155EEF]" />
                  <h4>Embedded Servo Drive vs. Cabinet Drive Racks</h4>
                </div>
                <p className="text-xs text-[#667085] leading-relaxed">
                  Centralized drive racks require 15m+ of shielded motor power and feedback cabling per axis, producing EMI radiation and occupying valuable control cabinet space. INDUS houses high-efficiency GaN/MOSFET power stages directly inside the actuator casing, eliminating bulky external motor drives and reducing robot cable bundles by 70%.
                </p>
                <div className="mt-3 pt-2.5 border-t border-[#E5EAF1] text-[11px] font-mono text-[#155EEF]">
                  Verified: 48V DC bus operation (24V–56V range) with daisy-chained M12 industrial connectors.
                </div>
              </div>

              {/* Pillar 4: Fieldbus Integration */}
              <div className="rounded-xl border border-[#E5EAF1] bg-[#F8FAFC] p-5">
                <div className="flex items-center gap-2 mb-2 font-bold text-[#172033] text-sm">
                  <Wifi size={16} className="text-[#155EEF]" />
                  <h4>PLC &amp; Robot Controller Fieldbus Protocols</h4>
                </div>
                <p className="text-xs text-[#667085] leading-relaxed">
                  Every INDUS actuator functions as a standard EtherCAT (CoE) slave with Distributed Clocks (DC) or CANopen (DS402) node. Certified ESI XML device description files allow instant axis commissioning in Beckhoff TwinCAT 3, Siemens S7-1500 (via PN/EtherCAT gateway), Omron Sysmac Studio, and CODESYS V3.5 soft-PLCs.
                </p>
                <div className="mt-3 pt-2.5 border-t border-[#E5EAF1] text-[11px] font-mono text-[#155EEF]">
                  Verified: Cyclic Synchronous Position (CSP) with deterministic 1.0 ms sync cycle.
                </div>
              </div>

              {/* Pillar 5: Homing & Motion Profiles */}
              <div className="rounded-xl border border-[#E5EAF1] bg-[#F8FAFC] p-5">
                <div className="flex items-center gap-2 mb-2 font-bold text-[#172033] text-sm">
                  <Sliders size={16} className="text-[#155EEF]" />
                  <h4>CiA 402 Motion Profiles &amp; Homing Methods</h4>
                </div>
                <p className="text-xs text-[#667085] leading-relaxed">
                  Supports Cyclic Synchronous Position (CSP), Velocity (CSV), and Torque (CST) operating modes. On-board trajectory generator executes 5th-order polynomial splines with jerk limiting. Absolute encoders eliminate the need for mechanical homing cycles upon boot, though mechanical hardstop homing and index pulse homing are supported.
                </p>
                <div className="mt-3 pt-2.5 border-t border-[#E5EAF1] text-[11px] font-mono text-[#155EEF]">
                  Verified: 0x6040 Controlword &amp; 0x6041 Statusword state machine compliance.
                </div>
              </div>

              {/* Pillar 6: Functional Safety & STO */}
              <div className="rounded-xl border border-[#E5EAF1] bg-[#F8FAFC] p-5">
                <div className="flex items-center gap-2 mb-2 font-bold text-[#172033] text-sm">
                  <ShieldCheck size={16} className="text-[#155EEF]" />
                  <h4>Safe Torque Off (STO SIL2 / PLd) &amp; Mechanical Mounting</h4>
                </div>
                <p className="text-xs text-[#667085] leading-relaxed">
                  Dual-channel Safe Torque Off (STO) hardware cut-off isolates the gate drivers, preventing shaft torque generation in accordance with EN ISO 13849-1 and IEC 61800-5-2. Mechanical interfaces feature standard ISO 9409-1 robot flanges with dowel alignment bores and hollow center pass-throughs for internal pneumatic lines.
                </p>
                <div className="mt-3 pt-2.5 border-t border-[#E5EAF1] text-[11px] font-mono text-[#155EEF]">
                  Verified: Dual redundant 24V STO channels with diagnostic test pulse filtering.
                </div>
              </div>
            </div>

            {/* Quick Action Bar */}
            <div className="mt-8 pt-6 border-t border-[#E5EAF1] flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-[#667085]">
                Need official ESI XML files, TwinCAT project templates, or 3D STEP models?
              </div>
              <div className="flex items-center gap-2.5">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleWhatsApp}
                  className="h-9 text-xs border-[#D0D5DD] bg-white text-[#344054]"
                >
                  <MessageSquare size={14} className="mr-1.5 text-[#16A34A]" /> WhatsApp Engineering Desk
                </Button>
                <Button
                  size="sm"
                  onClick={() => openModal("engineer", { categoryName: "Intelligent Actuators" })}
                  className="h-9 text-xs bg-[#155EEF] hover:bg-[#1047BF] text-white font-bold"
                >
                  <Wrench size={14} className="mr-1.5" /> Book 1-on-1 Engineering Review
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: CONFIGURE MY ACTUATOR & APPLICATION FINDER HANDOFF (SECTION 7)
         ========================================================================= */}
      {activeTab === "sizing-handoff" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#D1E0FF] bg-white p-6 sm:p-8 shadow-xs">
            <div className="max-w-2xl mb-8">
              <span className="rounded bg-[#EFF6FF] px-2.5 py-1 text-[11px] font-mono font-bold uppercase text-[#155EEF] border border-[#B2CCFF]">
                Seamless Application Handoff
              </span>
              <h3 className="text-2xl font-bold text-[#172033] mt-2">
                Configure Your Actuator for Application Sizing
              </h3>
              <p className="text-xs sm:text-sm text-[#667085] mt-1 leading-relaxed">
                Select your intended automation application and actuator family below. We will transfer your specifications into the interactive Application Finder Wizard where our kinematics solver will evaluate inertia matching and thermal margins.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Rotary Actuator Option */}
              <div className="rounded-xl border border-[#E5EAF1] bg-[#F8FAFC] p-6 hover:border-[#155EEF] transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-[#EFF6FF] px-2 py-0.5 text-xs font-mono font-bold text-[#155EEF]">
                      Rotary Articulation
                    </span>
                    <span className="text-xs font-semibold text-[#16A34A]">IND-IRA Series</span>
                  </div>
                  <h4 className="text-lg font-bold text-[#172033] mt-3">
                    Intelligent Rotary Joint Module
                  </h4>
                  <p className="text-xs text-[#667085] mt-1.5 leading-relaxed">
                    Designed for cobot arm joints (J1–J6), CNC precision indexing tables, and machine vision inspection spindles. Rated continuous torque up to 280 Nm with dual 19-bit feedback.
                  </p>

                  <div className="my-4 p-3 bg-white rounded-lg border border-[#E5EAF1] text-xs font-mono space-y-1">
                    <div>Continuous Torque: 35 – 280 Nm</div>
                    <div>Output Speed: 25 – 120 rpm</div>
                    <div>Interface: ISO 9409-1 Flange · EtherCAT CSP</div>
                  </div>
                </div>

                <Button
                  className="w-full h-10 bg-[#155EEF] hover:bg-[#1047BF] text-white font-bold text-xs"
                  onClick={() => {
                    transferActuatorToFinder({
                      category: "rotary-actuator",
                      modelCode: "IND-IRA-090-80",
                      continuousTorqueOrForce: "85 Nm",
                      peakTorqueOrForce: "210 Nm",
                      ratedSpeed: "35 rpm",
                      fieldbus: "EtherCAT (CoE / CiA 402)",
                      applicationGoal: "Articulated robot joint or precision indexing table",
                    });
                  }}
                >
                  Configure Rotary Actuator in Finder <ArrowRight size={13} className="ml-1.5" />
                </Button>
              </div>

              {/* Linear Actuator Option */}
              <div className="rounded-xl border border-[#E5EAF1] bg-[#F8FAFC] p-6 hover:border-[#155EEF] transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-[#EFF6FF] px-2 py-0.5 text-xs font-mono font-bold text-[#155EEF]">
                      Linear Displacement
                    </span>
                    <span className="text-xs font-semibold text-[#16A34A]">IND-ILA Series</span>
                  </div>
                  <h4 className="text-lg font-bold text-[#172033] mt-3">
                    Intelligent Linear Slide Module
                  </h4>
                  <p className="text-xs text-[#667085] mt-1.5 leading-relaxed">
                    Designed for EV battery cell stacking, tab crimping presses, Cartesian pick-and-place gantries, and optical scanning stages. Continuous thrust up to 3800 N with optical linear scale.
                  </p>

                  <div className="my-4 p-3 bg-white rounded-lg border border-[#E5EAF1] text-xs font-mono space-y-1">
                    <div>Continuous Thrust: 650 – 3800 N</div>
                    <div>Stroke Length: 100 – 1800 mm</div>
                    <div>Repeatability: ±0.005 mm (Optical Scale)</div>
                  </div>
                </div>

                <Button
                  className="w-full h-10 bg-[#155EEF] hover:bg-[#1047BF] text-white font-bold text-xs"
                  onClick={() => {
                    transferActuatorToFinder({
                      category: "linear-actuator",
                      modelCode: "IND-ILA-080-B16",
                      continuousTorqueOrForce: "1600 N",
                      peakTorqueOrForce: "3500 N",
                      ratedSpeed: "500 mm/s",
                      strokeMm: "450 mm",
                      fieldbus: "EtherCAT (CoE / CiA 402)",
                      applicationGoal: "Precision press-fit or high-speed linear gantry slide",
                    });
                  }}
                >
                  Configure Linear Actuator in Finder <ArrowRight size={13} className="ml-1.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
