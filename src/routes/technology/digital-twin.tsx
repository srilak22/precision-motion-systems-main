import React, { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Activity,
  Cpu,
  Layers,
  Gauge,
  Radio,
  Play,
  Pause,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  RotateCcw,
  Bot,
  Warehouse,
  ShieldCheck,
  Zap,
  BarChart3,
  Thermometer,
  Wrench,
  Boxes,
  Move3d,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModals } from "@/components/modals/ModalContext";
import { companyConfig } from "@/data/config";
import { buildSeoMeta } from "@/lib/seo";
import { CtaBanner } from "@/components/common/CtaBanner";
import { DigitalTwin3DWorkcell } from "@/components/technology/DigitalTwin3DWorkcell";

export const Route = createFileRoute("/technology/digital-twin")({
  head: () =>
    buildSeoMeta({
      title: "INDUS Digital Twin & Predictive Maintenance Platform",
      description:
        "Virtual robotic workcell simulation, ISO 10816 vibration FFT diagnostics, reducer wear indices, and AMR fleet tracking. Digital twin intelligence for zero unplanned downtime.",
      path: "/technology/digital-twin",
    }),
  component: DigitalTwinPage,
});

interface RobotTelemetryState {
  axis: string;
  temperatureC: number;
  vibrationRms: number; // mm/s
  currentA: number;
  backlashArcmin: number;
  healthScore: number;
}

const INITIAL_AXES: RobotTelemetryState[] = [
  { axis: "J1 — Base Slewing (RV-110)", temperatureC: 42.1, vibrationRms: 0.82, currentA: 14.2, backlashArcmin: 0.65, healthScore: 98 },
  { axis: "J2 — Shoulder Boom (RV-90)", temperatureC: 48.5, vibrationRms: 1.15, currentA: 18.7, backlashArcmin: 0.72, healthScore: 95 },
  { axis: "J3 — Elbow Linkage (Harmonic 32)", temperatureC: 44.2, vibrationRms: 0.94, currentA: 11.3, backlashArcmin: 0.58, healthScore: 97 },
  { axis: "J4 — Forearm Roll (Harmonic 25)", temperatureC: 39.8, vibrationRms: 0.65, currentA: 7.8, backlashArcmin: 0.45, healthScore: 99 },
  { axis: "J5 — Wrist Pitch (Harmonic 20)", temperatureC: 41.0, vibrationRms: 0.71, currentA: 6.2, backlashArcmin: 0.49, healthScore: 98 },
  { axis: "J6 — Tool Flange Roll (Harmonic 17)", temperatureC: 38.6, vibrationRms: 0.55, currentA: 4.5, backlashArcmin: 0.42, healthScore: 99 },
];

interface AmrFleetItem {
  id: string;
  name: string;
  batteryPct: number;
  mission: string;
  speed: string;
  status: "Active / Moving" | "Docked / Charging" | "Standby";
}

const FLEET_ITEMS: AmrFleetItem[] = [
  { id: "AMR-01", name: "INDUS Transporter 500", batteryPct: 88, mission: "Pallet Transfer Cell B → Packaging Line 2", speed: "1.2 m/s", status: "Active / Moving" },
  { id: "AMR-02", name: "INDUS Transporter 1000", batteryPct: 94, mission: "Sheet Metal Stamping Bay 4 Delivery", speed: "0.9 m/s", status: "Active / Moving" },
  { id: "AMR-03", name: "INDUS Tug 1500", batteryPct: 28, mission: "Autonomous Opportunity Fast-Charge Station #2", speed: "0.0 m/s", status: "Docked / Charging" },
  { id: "AMR-04", name: "INDUS Cart 300", batteryPct: 76, mission: "Awaiting Next Dispatch Queue Trigger", speed: "0.0 m/s", status: "Standby" },
];

function DigitalTwinPage() {
  const { openModal } = useModals();
  const [telemetry, setTelemetry] = useState<RobotTelemetryState[]>(INITIAL_AXES);
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [selectedAxis, setSelectedAxis] = useState<string>("J1 — Base Slewing (RV-110)");
  const [activeTab, setActiveTab] = useState<"workcell" | "predictive" | "fleet">("workcell");

  // Simulated telemetry ticker with realistic physical micro-variations
  useEffect(() => {
    if (!isStreaming) return;
    const timer = setInterval(() => {
      setTelemetry((prev) =>
        prev.map((ax) => ({
          ...ax,
          temperatureC: +(ax.temperatureC + (Math.random() * 0.4 - 0.2)).toFixed(1),
          vibrationRms: +(ax.vibrationRms + (Math.random() * 0.04 - 0.02)).toFixed(2),
          currentA: +(ax.currentA + (Math.random() * 0.6 - 0.3)).toFixed(1),
        }))
      );
    }, 1000);
    return () => clearInterval(timer);
  }, [isStreaming]);

  const activeAxisIndex = Math.max(
    0,
    telemetry.findIndex((a) => a.axis === selectedAxis),
  );
  const activeAxisData = telemetry[activeAxisIndex] || telemetry[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      {/* 1. HERO SECTION (LIGHT ENTERPRISE THEME) */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white pt-16 pb-16 px-5 lg:px-10">
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(21,94,239,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(21,94,239,0.06) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative mx-auto max-w-[1440px]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#155EEF] text-xs font-mono font-semibold uppercase tracking-widest mb-4">
            <Radio size={13} className="animate-pulse" />
            <span>Digital Twin &amp; Predictive Telemetry</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-slate-900 leading-none">
            INDUS Digital Twin &amp; Predictive Maintenance
          </h1>
          <p className="text-lg sm:text-xl font-medium text-[#155EEF] mt-3 font-display uppercase tracking-wider">
            Virtual Workcell Simulation &bull; ISO 10816 Vibration Diagnostics
          </p>

          <p className="mt-5 max-w-3xl text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Mirror physical manufacturing cells in real time. Continuously monitor high-frequency
            vibration harmonics, reducer wear degradation, lubricant condition, and AMR fleet
            utilization to prevent unplanned downtime.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              onClick={() => openModal("engineer", { categoryName: "Digital Twin & Telemetry Sizing" })}
              className="h-11 rounded-lg bg-[#155EEF] text-white font-bold uppercase hover:bg-[#1047BF] text-xs px-6 tracking-wider cursor-pointer"
            >
              <Cpu className="mr-2 size-4" /> Request Digital Twin Demo
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-11 rounded-lg border-slate-300 bg-white text-slate-800 hover:border-[#155EEF] hover:text-[#155EEF] text-xs uppercase font-bold tracking-wider"
            >
              <Link to="/technology/motion-studio">
                <Move3d className="mr-2 size-4 text-[#155EEF]" /> Launch Motion Studio
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 2. TABBED TWIN WORKSPACE */}
      <section className="py-16 px-5 lg:px-10 border-b border-slate-200 bg-[#F4F7FB]">
        <div className="mx-auto max-w-[1440px]">
          {/* Module Switcher Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4 mb-8">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTab("workcell")}
                className={`px-4 py-2 text-xs font-mono font-bold uppercase rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
                  activeTab === "workcell"
                    ? "bg-[#155EEF] text-white shadow-xs"
                    : "bg-white border border-slate-200 text-slate-700 hover:border-[#155EEF]"
                }`}
              >
                <Move3d size={14} /> 3D Virtual Workcell
              </button>
              <button
                onClick={() => setActiveTab("predictive")}
                className={`px-4 py-2 text-xs font-mono font-bold uppercase rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
                  activeTab === "predictive"
                    ? "bg-[#155EEF] text-white shadow-xs"
                    : "bg-white border border-slate-200 text-slate-700 hover:border-[#155EEF]"
                }`}
              >
                <Activity size={14} /> Predictive Vibration &amp; Wear
              </button>
              <button
                onClick={() => setActiveTab("fleet")}
                className={`px-4 py-2 text-xs font-mono font-bold uppercase rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
                  activeTab === "fleet"
                    ? "bg-[#155EEF] text-white shadow-xs"
                    : "bg-white border border-slate-200 text-slate-700 hover:border-[#155EEF]"
                }`}
              >
                <Warehouse size={14} /> AMR Fleet Telemetry
              </button>
            </div>

            {/* Live Streaming Toggle */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-slate-600">
                Stream: <strong className="text-emerald-700">OPC UA TSN</strong>
              </span>
              <button
                onClick={() => setIsStreaming(!isStreaming)}
                className="px-3.5 py-2 text-xs font-mono font-bold uppercase rounded-lg border border-slate-300 bg-white hover:border-[#155EEF] hover:text-[#155EEF] text-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                {isStreaming ? <Pause size={13} /> : <Play size={13} />}
                <span>{isStreaming ? "Pause Ticker" : "Resume Ticker"}</span>
              </button>
            </div>
          </div>

          {/* TAB 1: 3D VIRTUAL WORKCELL VIEW */}
          {activeTab === "workcell" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col justify-between gap-4">
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-600 px-1">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
                      <span className="size-2 rounded-full bg-emerald-500 animate-ping" /> CELL A-04 SYNCHRONIZED
                    </span>
                    <span className="text-slate-500">Selected: {selectedAxis.split("—")[0]}</span>
                  </div>
                  <span className="text-slate-500">ISO 9283 Pose Repeatability Envelope</span>
                </div>

                {/* Real Interactive 3D Workcell */}
                <DigitalTwin3DWorkcell
                  isStreaming={isStreaming}
                  selectedAxisIndex={activeAxisIndex}
                />

                {/* Bottom Workcell Telemetry Band */}
                <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-4 font-mono text-xs grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Workcell OEE</span>
                    <span className="text-emerald-700 text-lg font-bold">94.8%</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Mean Cycle Takt</span>
                    <span className="text-slate-900 text-lg font-bold">4.2s (±0.04s)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Safety Interlock</span>
                    <span className="text-[#155EEF] text-lg font-bold">Clear / Active</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Shift Output</span>
                    <span className="text-slate-900 text-lg font-bold">1,842 units</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Joint Health Selector */}
              <div className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                <span className="text-xs font-mono font-bold uppercase text-[#155EEF] block border-b border-slate-100 pb-2.5">
                  Joint Health Matrix (J1–J6)
                </span>

                <div className="space-y-2">
                  {telemetry.map((ax) => (
                    <button
                      key={ax.axis}
                      onClick={() => setSelectedAxis(ax.axis)}
                      className={`w-full text-left p-3 rounded-xl border text-xs font-mono transition-all cursor-pointer flex items-center justify-between ${
                        selectedAxis === ax.axis
                          ? "bg-blue-50 border-[#155EEF] text-slate-900 shadow-2xs"
                          : "bg-[#F8FAFC] border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300"
                      }`}
                    >
                      <div>
                        <div className="font-bold text-slate-900">{ax.axis}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Temp: {ax.temperatureC}°C &bull; Vib: {ax.vibrationRms} mm/s
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-emerald-700">{ax.healthScore}%</span>
                        <span className="block text-[9px] text-slate-400 uppercase">Health</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-[#F8FAFC] text-xs font-mono space-y-1.5">
                  <div className="text-slate-500 text-[10px] uppercase font-bold">Active Joint Margin</div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Backlash:</span>
                    <span className="text-emerald-700 font-bold">{activeAxisData.backlashArcmin} arcmin</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Motor Current:</span>
                    <span className="text-slate-900 font-bold">{activeAxisData.currentA} A</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PREDICTIVE VIBRATION & WEAR */}
          {activeTab === "predictive" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-2">
                  <span className="text-xs font-mono font-bold uppercase text-[#155EEF] block">
                    Vibration Severity (ISO 10816-3)
                  </span>
                  <div className="text-3xl font-display font-bold text-emerald-700">
                    {activeAxisData.vibrationRms} mm/s RMS
                  </div>
                  <p className="text-xs text-slate-600">
                    Zone A (Good): Velocity RMS remains well below the 2.8 mm/s alarm threshold for rigid industrial frames.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-2">
                  <span className="text-xs font-mono font-bold uppercase text-amber-700 block">
                    Reducer Backlash Index
                  </span>
                  <div className="text-3xl font-display font-bold text-slate-900">
                    {activeAxisData.backlashArcmin} arcmin
                  </div>
                  <p className="text-xs text-slate-600">
                    Zero-backlash strain-wave gearing degradation model estimates <strong>8,420 hours</strong> of remaining useful life.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-2">
                  <span className="text-xs font-mono font-bold uppercase text-indigo-700 block">
                    Lubricant Dielectric &amp; Wear Particles
                  </span>
                  <div className="text-3xl font-display font-bold text-slate-900">
                    12 ppm Fe
                  </div>
                  <p className="text-xs text-slate-600">
                    Inductive particle counter shows normal running wear; no abrasive spalling detected. Next grease purge: 4,000 hrs.
                  </p>
                </div>
              </div>

              {/* Spectral Harmonic FFT Chart */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-display font-bold text-lg uppercase text-slate-900">
                      Real-Time FFT Vibration Harmonic Spectrum ({selectedAxis})
                    </h3>
                    <p className="text-xs font-mono text-slate-500 mt-0.5">
                      10 Hz – 2,000 Hz Acceleration Spectral Density &bull; Bearing Fault Frequency Tracking
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 text-xs font-mono font-bold border border-emerald-200">
                    No Bearing Anomalies
                  </span>
                </div>

                {/* Live FFT Bars */}
                <div className="h-44 w-full flex items-end gap-1 px-2 pt-6 bg-[#F8FAFC] rounded-xl border border-slate-100 pb-2">
                  {Array.from({ length: 48 }).map((_, idx) => {
                    const vibFactor = activeAxisData.vibrationRms / 0.85;
                    const heightPct = Math.min(
                      96,
                      Math.max(10, (Math.sin(idx * 0.35 + activeAxisIndex) * 28 + (idx % 7 === 0 ? 52 : 18)) * vibFactor),
                    );
                    return (
                      <div
                        key={idx}
                        className="flex-1 bg-gradient-to-t from-[#155EEF] to-[#0EA5E9] rounded-t-xs transition-all duration-300 opacity-85 hover:opacity-100"
                        style={{ height: `${heightPct}%` }}
                        title={`Bin ${idx * 40} Hz: ${(heightPct * 0.05).toFixed(2)} mm/s²`}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-1">
                  <span>10 Hz</span>
                  <span>500 Hz (1X Running Speed)</span>
                  <span>1,000 Hz (Gear Mesh)</span>
                  <span>2,000 Hz (Roller Echo)</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AMR FLEET TELEMETRY */}
          {activeTab === "fleet" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {FLEET_ITEMS.map((amr) => (
                  <div key={amr.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#155EEF]">{amr.id}</span>
                      <span
                        className={`text-[9.5px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                          amr.status.includes("Active")
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : amr.status.includes("Docked")
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {amr.status.split("/")[0]}
                      </span>
                    </div>

                    <div className="font-bold text-sm text-slate-900">{amr.name}</div>

                    <div className="space-y-1 font-mono text-xs">
                      <div className="flex justify-between text-slate-600">
                        <span>Battery State:</span>
                        <span className="font-bold text-slate-900">{amr.batteryPct}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full"
                          style={{ width: `${amr.batteryPct}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-slate-600 pt-1">
                        <span>Speed:</span>
                        <span className="font-semibold text-slate-900">{amr.speed}</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 border-t border-slate-100 pt-2 line-clamp-2">
                      Mission: {amr.mission}
                    </p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h4 className="font-display font-bold text-lg uppercase text-slate-900">
                    Need Fleet Management API Integration?
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                    INDUS Autonomous Mobile Robots support standard VDA 5050 communication protocols,
                    enabling plug-and-play fleet management integration with SAP EWM, Manhattan Associates, and custom factory MES.
                  </p>
                </div>
                <Button
                  onClick={() => openModal("engineer", { categoryName: "VDA 5050 Fleet API Integration" })}
                  className="rounded-none bg-[#16C7E8] text-[#0B111E] font-bold uppercase text-xs hover:bg-[#16C7E8]/90 shrink-0"
                >
                  Request VDA 5050 Specs
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. CONNECTED CTA BANNER */}
      <div className="mx-auto max-w-[1440px] px-5 lg:px-10 py-12">
        <CtaBanner
          variant="precision"
          badge="PREDICTIVE MAINTENANCE COMMISSIONING"
          headline="Eliminate Unplanned Factory Stoppages with INDUS Twin"
          description="Schedule an engineering session with our telemetry specialists to review vibration sensor mounting locations, FFT alarm thresholds, and OPC UA edge gateway deployment."
          ctaPrimary={{
            label: "Book Engineering Consultation",
            href: "/book-consultation",
          }}
          ctaSecondary={{
            label: "Open Motion Studio",
            href: "/technology/motion-studio",
          }}
        />
      </div>
    </div>
  );
}
