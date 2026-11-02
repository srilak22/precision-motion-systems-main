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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModals } from "@/components/modals/ModalContext";
import { companyConfig } from "@/data/config";
import { buildSeoMeta } from "@/lib/seo";
import { CtaBanner } from "@/components/common/CtaBanner";

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

  const activeAxisData = telemetry.find((a) => a.axis === selectedAxis) || telemetry[0];

  return (
    <div className="min-h-screen bg-[#0B111E] text-slate-100 font-sans selection:bg-[#16C7E8] selection:text-[#0B111E]">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden border-b border-white/10 pt-24 pb-20 px-5 lg:px-10">
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(35,136,255,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(35,136,255,0.2) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-1/4 -right-40 w-96 h-96 bg-[#16C7E8]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-[1440px]">
          <nav className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400 mb-6">
            <Link to="/" className="hover:text-[#16C7E8] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/technology" className="hover:text-[#16C7E8] transition-colors">
              Technology Stack
            </Link>
            <span>/</span>
            <span className="text-[#16C7E8]">Digital Twin</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16C7E8]/10 border border-[#16C7E8]/30 text-[#16C7E8] text-xs font-mono uppercase tracking-widest mb-4">
            <Radio size={13} className="text-[#16C7E8] animate-pulse" />
            <span>Industrial Digital Twin &amp; Telemetry Environment</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold uppercase tracking-tight text-white leading-none">
            INDUS Digital Twin &amp; Predictive Maintenance
          </h1>
          <p className="text-xl sm:text-2xl font-light text-[#16C7E8] mt-3 font-display uppercase tracking-widest">
            Virtual Workcell Simulation &bull; ISO 10816 Vibration Diagnostics
          </p>

          <p className="mt-6 max-w-3xl text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Mirror physical manufacturing cells in real-time. By continuously monitoring high-frequency
            vibration harmonics, reducer wear degradation, lubricant dielectric condition, and AMR fleet
            utilization, INDUS prevents catastrophic machine failures before they impact cycle takt.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              onClick={() => openModal("engineer", { categoryName: "Digital Twin & Telemetry Sizing" })}
              className="h-11 rounded-none bg-[#16C7E8] text-[#0B111E] font-bold uppercase hover:bg-[#16C7E8]/90 text-xs px-6 tracking-wider cursor-pointer"
            >
              <Cpu className="mr-2 size-4" /> Request Digital Twin Gateway Demo
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-11 rounded-none border-white/20 bg-white/5 text-white hover:bg-white/10 text-xs uppercase font-bold tracking-wider"
            >
              <Link to="/technology/motion-studio">
                <Move3d className="mr-2 size-4 text-[#2388FF]" /> Launch Motion Studio
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 2. TABBED TWIN WORKSPACE */}
      <section className="py-16 px-5 lg:px-10 border-b border-white/10 bg-[#0F172A]/70">
        <div className="mx-auto max-w-[1440px]">
          {/* Module Switcher Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 mb-8">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("workcell")}
                className={`px-4 py-2 text-xs font-mono font-bold uppercase rounded-md transition-colors cursor-pointer flex items-center gap-2 ${
                  activeTab === "workcell"
                    ? "bg-[#16C7E8] text-[#0B111E]"
                    : "bg-white/5 text-slate-400 hover:text-white"
                }`}
              >
                <Move3d size={14} /> 3D Virtual Workcell
              </button>
              <button
                onClick={() => setActiveTab("predictive")}
                className={`px-4 py-2 text-xs font-mono font-bold uppercase rounded-md transition-colors cursor-pointer flex items-center gap-2 ${
                  activeTab === "predictive"
                    ? "bg-[#16C7E8] text-[#0B111E]"
                    : "bg-white/5 text-slate-400 hover:text-white"
                }`}
              >
                <Activity size={14} /> Predictive Vibration &amp; Wear
              </button>
              <button
                onClick={() => setActiveTab("fleet")}
                className={`px-4 py-2 text-xs font-mono font-bold uppercase rounded-md transition-colors cursor-pointer flex items-center gap-2 ${
                  activeTab === "fleet"
                    ? "bg-[#16C7E8] text-[#0B111E]"
                    : "bg-white/5 text-slate-400 hover:text-white"
                }`}
              >
                <Warehouse size={14} /> AMR Fleet Telemetry
              </button>
            </div>

            {/* Live Streaming Toggle */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-slate-400">
                Mode: <strong className="text-emerald-400">Simulated Edge Stream (OPC UA TSN)</strong>
              </span>
              <button
                onClick={() => setIsStreaming(!isStreaming)}
                className="px-3 py-1.5 text-xs font-mono font-bold uppercase rounded bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {isStreaming ? <Pause size={13} /> : <Play size={13} />}
                <span>{isStreaming ? "Pause Ticker" : "Resume Ticker"}</span>
              </button>
            </div>
          </div>

          {/* TAB 1: 3D VIRTUAL WORKCELL VIEW (IMAGE 3 REPLICA) */}
          {activeTab === "workcell" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-8 rounded-xl border border-white/10 bg-[#080D1A] p-4 relative overflow-hidden min-h-[460px] flex flex-col justify-between">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <span className="size-2 rounded-full bg-emerald-400 animate-ping" /> CELL A-04 SYNCHRONIZED
                    </span>
                    <span>Kinematic State: Trajectory Step 4/8</span>
                  </div>
                  <span className="text-slate-500">ISO 9283 Pose Repeatability Envelope</span>
                </div>

                {/* Isometric SVG Workcell Representation */}
                <div className="relative my-auto flex items-center justify-center py-6">
                  <svg viewBox="0 0 650 320" className="w-full max-w-2xl h-auto select-none">
                    {/* Isometric Safety Fencing Enclosure */}
                    <path
                      d="M 60 220 L 220 280 L 580 210 L 420 150 Z"
                      fill="#0F172A"
                      stroke="#334155"
                      strokeWidth="1.5"
                    />
                    {/* Mesh fence lines */}
                    <g stroke="#1E293B" strokeWidth="0.75" strokeDasharray="3 3">
                      <line x1="60" y1="220" x2="60" y2="160" />
                      <line x1="220" y1="280" x2="220" y2="220" />
                      <line x1="580" y1="210" x2="580" y2="150" />
                      <line x1="420" y1="150" x2="420" y2="90" />
                      <line x1="60" y1="160" x2="220" y2="220" />
                      <line x1="220" y1="220" x2="580" y2="150" />
                    </g>

                    {/* Pallet Staging Area with Multi-color Boxes matching Image 3 */}
                    <g transform="translate(140, 180)">
                      <rect x="0" y="0" width="35" height="25" fill="#EAB308" stroke="#CA8A04" />
                      <rect x="38" y="0" width="35" height="25" fill="#3B82F6" stroke="#2563EB" />
                      <rect x="0" y="28" width="35" height="25" fill="#EC4899" stroke="#DB2777" />
                      <rect x="38" y="28" width="35" height="25" fill="#10B981" stroke="#059669" />
                      {/* Top tier stacked */}
                      <rect x="18" y="-22" width="35" height="20" fill="#8B5CF6" stroke="#7C3AED" />
                    </g>

                    {/* Robot Pedestal & 6-Axis Arm */}
                    <g transform="translate(340, 190)">
                      {/* Heavy Pedestal Base */}
                      <cylinder />
                      <rect x="-24" y="-10" width="48" height="20" fill="#1E293B" stroke="#475569" strokeWidth="2" rx="4" />
                      {/* Articulated Yellow/Cyan Robot Arm */}
                      <path
                        d="M 0 -10 L -20 -60 L 40 -110 L 80 -80"
                        fill="none"
                        stroke="#FACC15"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {/* Joint Markers */}
                      <circle cx="0" cy="-10" r="7" fill="#0B111E" stroke="#16C7E8" strokeWidth="2.5" />
                      <circle cx="-20" cy="-60" r="6" fill="#0B111E" stroke="#16C7E8" strokeWidth="2.5" />
                      <circle cx="40" cy="-110" r="5" fill="#0B111E" stroke="#16C7E8" strokeWidth="2" />
                      {/* Gripper Tool Flange */}
                      <circle cx="80" cy="-80" r="4" fill="#16C7E8" />
                      <rect x="76" y="-76" width="8" height="18" fill="#16C7E8" rx="1" />
                      {/* Held Payload Box */}
                      <rect x="72" y="-58" width="22" height="18" fill="#10B981" stroke="#059669" />
                    </g>

                    {/* Laser Safety Scanner Radial Arc */}
                    <path
                      d="M 60 220 Q 200 180 340 190"
                      fill="none"
                      stroke="#16C7E8"
                      strokeWidth="1.5"
                      strokeDasharray="4 2"
                      opacity="0.6"
                    />
                  </svg>
                </div>

                {/* Bottom Workcell Telemetry Band */}
                <div className="rounded-lg border border-white/10 bg-[#0F172A]/90 p-4 font-mono text-xs flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Workcell Efficiency (OEE)</span>
                    <span className="text-emerald-400 text-lg font-bold">94.8%</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Mean Cycle Takt</span>
                    <span className="text-white text-lg font-bold">4.2s (±0.04s)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Safety Zone Interlock</span>
                    <span className="text-[#16C7E8] text-lg font-bold">Clear / Active</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Shift Output Count</span>
                    <span className="text-white text-lg font-bold">1,842 units</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Joint Health Selector */}
              <div className="lg:col-span-4 rounded-xl border border-white/10 bg-[#080D1A] p-5 space-y-4">
                <span className="text-xs font-mono font-bold uppercase text-[#16C7E8] block border-b border-white/10 pb-2">
                  Joint Health Status Matrix (J1–J6)
                </span>

                <div className="space-y-2">
                  {telemetry.map((ax) => (
                    <button
                      key={ax.axis}
                      onClick={() => setSelectedAxis(ax.axis)}
                      className={`w-full text-left p-3 rounded-lg border text-xs font-mono transition-all cursor-pointer flex items-center justify-between ${
                        selectedAxis === ax.axis
                          ? "bg-[#1E293B] border-[#16C7E8] text-white"
                          : "bg-[#0F172A]/70 border-white/5 text-slate-300 hover:border-white/20"
                      }`}
                    >
                      <div>
                        <div className="font-bold">{ax.axis}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Temp: {ax.temperatureC}°C &bull; Vib: {ax.vibrationRms} mm/s
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-emerald-400">{ax.healthScore}%</span>
                        <span className="block text-[9px] text-slate-500 uppercase">Health</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="p-3.5 rounded-lg border border-white/5 bg-[#0F172A] text-xs font-mono space-y-1.5">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Active Joint Sizing Margin</div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Backlash Degradation:</span>
                    <span className="text-emerald-400">{activeAxisData.backlashArcmin} arcmin (&lt; 1.0 limit)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Motor Current Draw:</span>
                    <span className="text-white">{activeAxisData.currentA} A</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PREDICTIVE VIBRATION & WEAR */}
          {activeTab === "predictive" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-xl border border-white/10 bg-[#080D1A] p-5 space-y-2">
                  <span className="text-xs font-mono font-bold uppercase text-[#16C7E8] block">
                    Vibration Severity (ISO 10816-3)
                  </span>
                  <div className="text-3xl font-display font-bold text-emerald-400">
                    {activeAxisData.vibrationRms} mm/s RMS
                  </div>
                  <p className="text-xs text-slate-400">
                    Zone A (Good): Velocity RMS remains well below the 2.8 mm/s alarm threshold for rigid industrial frames.
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#080D1A] p-5 space-y-2">
                  <span className="text-xs font-mono font-bold uppercase text-amber-400 block">
                    Reducer Backlash Index
                  </span>
                  <div className="text-3xl font-display font-bold text-white">
                    {activeAxisData.backlashArcmin} arcmin
                  </div>
                  <p className="text-xs text-slate-400">
                    Zero-backlash strain-wave gearing degradation model estimates <strong>8,420 hours</strong> of remaining useful life.
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#080D1A] p-5 space-y-2">
                  <span className="text-xs font-mono font-bold uppercase text-purple-400 block">
                    Lubricant Dielectric &amp; Wear Particles
                  </span>
                  <div className="text-3xl font-display font-bold text-white">
                    12 ppm Fe
                  </div>
                  <p className="text-xs text-slate-400">
                    Inductive particle counter shows normal running wear; no abrasive spalling detected. Next grease purge: 4,000 hrs.
                  </p>
                </div>
              </div>

              {/* Spectral Harmonic FFT Chart */}
              <div className="rounded-xl border border-white/10 bg-[#080D1A] p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <h3 className="font-display font-bold text-lg uppercase text-white">
                      Real-Time FFT Vibration Harmonic Spectrum ({selectedAxis})
                    </h3>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">
                      10 Hz – 2,000 Hz Acceleration Spectral Density &bull; Bearing Fault Frequency Tracking (BPFI / BPFO)
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/30">
                    No Bearing Anomalies
                  </span>
                </div>

                {/* SVG Simulated FFT Bars */}
                <div className="h-44 w-full flex items-end gap-1 px-2 pt-6">
                  {Array.from({ length: 48 }).map((_, idx) => {
                    const heightPct = Math.max(8, Math.sin(idx * 0.3) * 35 + (idx % 7 === 0 ? 55 : 15));
                    return (
                      <div
                        key={idx}
                        className="flex-1 bg-gradient-to-t from-[#2388FF] to-[#16C7E8] rounded-t-xs transition-all duration-300 opacity-80 hover:opacity-100"
                        style={{ height: `${heightPct}%` }}
                        title={`Bin ${idx * 40} Hz: ${(heightPct * 0.05).toFixed(2)} mm/s²`}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-500 border-t border-white/10 pt-2">
                  <span>10 Hz</span>
                  <span>500 Hz (1X Running Speed)</span>
                  <span>1,000 Hz (Gear Mesh)</span>
                  <span>2,000 Hz (High Frequency Roller Echo)</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AMR FLEET TELEMETRY */}
          {activeTab === "fleet" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {FLEET_ITEMS.map((amr) => (
                  <div key={amr.id} className="rounded-xl border border-white/10 bg-[#080D1A] p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#16C7E8]">{amr.id}</span>
                      <span
                        className={`text-[9.5px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                          amr.status.includes("Active")
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : amr.status.includes("Docked")
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            : "bg-slate-700 text-slate-300"
                        }`}
                      >
                        {amr.status.split("/")[0]}
                      </span>
                    </div>

                    <div className="font-bold text-sm text-white">{amr.name}</div>

                    <div className="space-y-1 font-mono text-xs">
                      <div className="flex justify-between text-slate-400">
                        <span>Battery State:</span>
                        <span className="font-bold text-white">{amr.batteryPct}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-400 h-full rounded-full"
                          style={{ width: `${amr.batteryPct}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-slate-400 pt-1">
                        <span>Speed:</span>
                        <span className="text-white">{amr.speed}</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 border-t border-white/5 pt-2 line-clamp-2">
                      Mission: {amr.mission}
                    </p>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-white/10 bg-[#080D1A] p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h4 className="font-display font-bold text-lg uppercase text-white">
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
