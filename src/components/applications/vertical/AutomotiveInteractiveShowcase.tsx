import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  BatteryCharging,
  Bot,
  Cog,
  Flame,
  Gauge,
  Move3d,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModals } from "@/components/modals/ModalContext";
import { images } from "@/lib/images";
import heroWeldingCell from "@/assets/hero/hero-welding-cell.jpg";
import heroProductionLine from "@/assets/hero/hero-production-line.jpg";

interface AutomotiveStation {
  id: string;
  label: string;
  title: string;
  robotModel: string;
  payload: string;
  repeatability: string;
  baseCycleSec: number;
  manualCycleSec: number;
  oeeGain: string;
  capexIndex: number;
  image: string;
  highlights: string[];
  icon: React.ElementType;
}

const AUTOMOTIVE_STATIONS: AutomotiveStation[] = [
  {
    id: "biw-welding",
    label: "BIW Welding",
    title: "Body-in-White 7th-Axis Laser & Spot Welding",
    robotModel: "INDUS-WELD-R210-7X",
    payload: "210 kg",
    repeatability: "±0.020 mm",
    baseCycleSec: 42,
    manualCycleSec: 78,
    oeeGain: "+34%",
    capexIndex: 1.15,
    image: heroWeldingCell,
    highlights: [
      "12m synchronized 7th-axis servo linear track",
      "Real-time laser seam tracking @ 120 FPS",
      "AWS D8.1M automotive weld quality compliance",
    ],
    icon: Flame,
  },
  {
    id: "ev-battery",
    label: "EV Battery Pack",
    title: "EV Battery Module Stacking & Busbar Assembly",
    robotModel: "INDUS-BAT-K150 (7-DOF)",
    payload: "150 kg",
    repeatability: "±0.015 mm",
    baseCycleSec: 36,
    manualCycleSec: 68,
    oeeGain: "+41%",
    capexIndex: 1.0,
    image: heroProductionLine,
    highlights: [
      "6-DOF force/torque controlled cell insertion",
      "Zero-void thermal gap-filler dispensing path",
      "High-voltage dielectric & vision verification",
    ],
    icon: BatteryCharging,
  },
  {
    id: "powertrain",
    label: "Powertrain & EDU",
    title: "Electric Drive Unit & Transmission Decking",
    robotModel: "INDUS-HD-350-6X",
    payload: "350 kg",
    repeatability: "±0.030 mm",
    baseCycleSec: 12,
    manualCycleSec: 26,
    oeeGain: "+38%",
    capexIndex: 1.25,
    image: images.arm,
    highlights: [
      "Dynamic counterbalancing for zero-shock decking",
      "Dual-pneumatic fail-safe gripper tooling",
      "Full torque & serialization logging via OPC-UA",
    ],
    icon: Cog,
  },
  {
    id: "cnc-tending",
    label: "CNC & Stamping",
    title: "24/7 Lights-Out Press & CNC Machine Tending",
    robotModel: "INDUS-TEND-180-PRO",
    payload: "180 kg",
    repeatability: "±0.020 mm",
    baseCycleSec: 8,
    manualCycleSec: 19,
    oeeGain: "+31%",
    capexIndex: 0.9,
    image: images.weldingRobot,
    highlights: [
      "Dual-part gripper cuts spindle swap under 8s",
      "IP67 coolant & metal-chip sealed wrist joints",
      "Safety laser scanner PL e zone muting",
    ],
    icon: Bot,
  },
];

export function AutomotiveInteractiveShowcase() {
  const { openModal } = useModals();
  const [selectedId, setSelectedId] = useState<string>(AUTOMOTIVE_STATIONS[0].id);
  const [jobsPerHour, setJobsPerHour] = useState<number>(45);
  const [shiftsPerDay, setShiftsPerDay] = useState<number>(2);

  const station =
    AUTOMOTIVE_STATIONS.find((s) => s.id === selectedId) || AUTOMOTIVE_STATIONS[0];

  const requiredTaktSec = Math.round(3600 / jobsPerHour);
  const robotsNeeded = Math.max(1, Math.ceil(station.baseCycleSec / requiredTaktSec));
  const annualHours = shiftsPerDay * 8 * 260;
  const annualParts = Math.round(jobsPerHour * annualHours);
  const paybackMonths = Math.max(
    6,
    Math.round((16 * station.capexIndex) / (shiftsPerDay * 0.85 + jobsPerHour / 60)),
  );
  const cycleMarginPct = Math.max(
    8,
    Math.min(
      65,
      Math.round(((requiredTaktSec * robotsNeeded - station.baseCycleSec) / (requiredTaktSec * robotsNeeded)) * 100),
    ),
  );

  return (
    <section className="bg-[#F4F7FB] border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-16">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-mono font-bold text-[#1D4ED8] uppercase mb-3">
              <Sparkles size={13} />
              Interactive Automotive Workcell Planner
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Configure Your Line Takt &amp; Robot Cell
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              Select an automotive manufacturing station and adjust your target throughput to estimate
              robot count, cycle margin, and ROI payback in real time.
            </p>
          </div>

          <Link
            to="/technology/motion-studio"
            className="inline-flex items-center gap-2 rounded-xl bg-white border border-blue-200 px-4 py-2.5 text-xs font-bold text-[#1D4ED8] hover:bg-[#1D4ED8] hover:text-white transition-all shadow-2xs shrink-0 self-start lg:self-auto"
          >
            <Move3d size={15} />
            <span>Open 3D Motion Studio</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Station Selector Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {AUTOMOTIVE_STATIONS.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === station.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedId(item.id)}
                className={`group flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "border-[#1D4ED8] bg-white shadow-md shadow-blue-500/10 -translate-y-0.5"
                    : "border-slate-200 bg-white/70 hover:bg-white hover:border-blue-300"
                }`}
              >
                <div
                  className={`size-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isActive
                      ? "bg-[#1D4ED8] text-white"
                      : "bg-blue-50 text-[#1D4ED8] group-hover:bg-[#1D4ED8] group-hover:text-white"
                  }`}
                >
                  <Icon size={17} />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">{item.label}</div>
                  <div className="text-[11px] font-mono text-slate-500 truncate">
                    {item.payload} &bull; {item.baseCycleSec}s cycle
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Interactive Panel */}
        <div className="grid lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Robot Image + Highlights */}
          <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm flex flex-col">
            <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden group">
              <img
                key={station.id}
                src={station.image}
                alt={station.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 animate-in fade-in duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="rounded-md bg-white/95 px-2.5 py-1 text-[10px] font-mono font-bold uppercase text-[#1D4ED8] shadow-xs">
                  {station.robotModel}
                </span>
                <span className="rounded-md bg-emerald-500/90 px-2.5 py-1 text-[10px] font-mono font-bold uppercase text-white">
                  {station.oeeGain} OEE
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-lg sm:text-xl font-bold leading-snug">{station.title}</h3>
                <p className="text-xs font-mono text-cyan-300 mt-1">
                  Payload: {station.payload} &bull; Repeatability: {station.repeatability}
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
              <ul className="space-y-2.5">
                {station.highlights.map((hl) => (
                  <li key={hl} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <ShieldCheck size={15} className="text-[#1D4ED8] shrink-0 mt-0.5" />
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: Interactive Sliders + Live Metrics */}
          <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm flex flex-col justify-between gap-6">
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Gauge size={14} className="text-[#1D4ED8]" />
                  Production Parameters
                </span>
                <span className="text-xs font-mono font-bold text-[#1D4ED8]">
                  Target Takt: {requiredTaktSec}s / unit
                </span>
              </div>

              {/* Slider 1: Jobs Per Hour */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-700">Target Line Throughput</span>
                  <span className="font-mono text-[#1D4ED8] font-bold">{jobsPerHour} units / hour</span>
                </div>
                <input
                  type="range"
                  min={15}
                  max={120}
                  step={5}
                  value={jobsPerHour}
                  onChange={(e) => setJobsPerHour(Number(e.target.value))}
                  aria-label="Target Line Throughput"
                  className="w-full accent-[#1D4ED8] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                  <span>15 JPH</span>
                  <span>60 JPH</span>
                  <span>120 JPH</span>
                </div>
              </div>

              {/* Shifts Selector */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-700">Daily Operating Shifts (8h/shift)</span>
                  <span className="font-mono text-[#1D4ED8] font-bold">{shiftsPerDay} Shifts / Day</span>
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  {[1, 2, 3].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setShiftsPerDay(s)}
                      className={`py-2 rounded-lg border text-xs font-mono font-bold transition-all cursor-pointer ${
                        shiftsPerDay === s
                          ? "border-[#1D4ED8] bg-blue-50 text-[#1D4ED8]"
                          : "border-slate-200 text-slate-600 hover:border-blue-300"
                      }`}
                    >
                      {s} {s === 1 ? "Shift" : "Shifts"} ({s * 8}h)
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Calculated KPI Cards */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-3.5">
                  <div className="text-[11px] font-mono text-slate-500 uppercase">Recommended Cells</div>
                  <div className="text-2xl font-extrabold font-mono text-[#1D4ED8] mt-1">
                    {robotsNeeded} {robotsNeeded === 1 ? "Robot" : "Robots"}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-3.5">
                  <div className="text-[11px] font-mono text-slate-500 uppercase">Est. Payback</div>
                  <div className="text-2xl font-extrabold font-mono text-emerald-600 mt-1 flex items-center gap-1.5">
                    <span>~{paybackMonths} mos</span>
                    <TrendingUp size={16} />
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-3.5">
                  <div className="text-[11px] font-mono text-slate-500 uppercase">Annual Output</div>
                  <div className="text-lg font-bold font-mono text-slate-900 mt-1">
                    {annualParts.toLocaleString()} units
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-3.5">
                  <div className="text-[11px] font-mono text-slate-500 uppercase">Cycle Headroom</div>
                  <div className="text-lg font-bold font-mono text-slate-900 mt-1 flex items-center gap-1.5">
                    <Activity size={15} className="text-[#1D4ED8]" />
                    <span>{cycleMarginPct}% margin</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
              <Button
                onClick={() =>
                  openModal("engineer", {
                    categoryName: station.title,
                    initialMessage: `Automotive Cell Sizing: ${station.title} (${station.robotModel}) for ${jobsPerHour} JPH, ${shiftsPerDay} shifts/day (${robotsNeeded} robot(s) estimated).`,
                  })
                }
                className="flex-1 h-11 rounded-xl bg-[#1D4ED8] hover:bg-[#1e40af] text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Request Cell Proposal <ArrowRight size={14} className="ml-1.5" />
              </Button>
              <Link
                to="/technology/motion-studio"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-xs font-bold text-slate-800 hover:border-[#1D4ED8] hover:text-[#1D4ED8] transition-colors"
              >
                3D Kinematics
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
