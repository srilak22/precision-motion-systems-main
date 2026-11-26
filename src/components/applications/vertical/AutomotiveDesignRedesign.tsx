import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  BatteryCharging,
  Bot,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Cog,
  Flame,
  Gauge,
  Move3d,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  AlertOctagon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModals } from "@/components/modals/ModalContext";
import { RelatedContent } from "@/components/common/RelatedContent";
import { applicationsData } from "@/data/applications";
type ApplicationData = (typeof applicationsData)[number];
import { images } from "@/lib/images";
import heroWeldingCell from "@/assets/hero/hero-welding-cell.jpg";
import heroProductionLine from "@/assets/hero/hero-production-line.jpg";

interface StationSpec {
  id: string;
  navLabel: string;
  category: string;
  title: string;
  model: string;
  summary: string;
  image: string;
  payload: string;
  repeatability: string;
  cycleSec: number;
  safety: string;
  oeeLift: string;
  capexFactor: number;
  capabilities: string[];
  icon: React.ElementType;
}

const STATIONS: StationSpec[] = [
  {
    id: "biw-welding",
    navLabel: "Body-in-White Welding",
    category: "7th-Axis Linear Track",
    title: "Adaptive Laser & Spot Welding Cell",
    model: "INDUS-WELD-R210-7X",
    summary:
      "Synchronized 6-axis manipulators on a 12m servo track for high-strength steel and aluminum BIW framing with closed-loop optical seam tracking.",
    image: heroWeldingCell,
    payload: "210 kg",
    repeatability: "±0.020 mm",
    cycleSec: 42,
    safety: "ISO 13849-1 PL e",
    oeeLift: "+34% OEE",
    capexFactor: 1.15,
    capabilities: [
      "120 FPS laser seam triangulation & spatter control",
      "PROFINET IRT / EtherCAT deterministic weld gun sync",
      "AWS D8.1M automotive structural weld compliance",
    ],
    icon: Flame,
  },
  {
    id: "ev-battery",
    navLabel: "EV Battery Pack Assembly",
    category: "Clean Precision Workcell",
    title: "Cell Stacking, Busbar & Thermal Dispense",
    model: "INDUS-BAT-K150",
    summary:
      "6-DOF force-controlled prismatic and pouch module insertion paired with void-free thermal gap-filler dispensing and HV dielectric verification.",
    image: heroProductionLine,
    payload: "150 kg",
    repeatability: "±0.015 mm",
    cycleSec: 36,
    safety: "HV Safe + PL e",
    oeeLift: "+41% OEE",
    capexFactor: 1.0,
    capabilities: [
      "Constant 6-DOF force/torque regulated cell insertion",
      "Zero-void thermal interface material path control",
      "Automated busbar laser weld & vision inspection",
    ],
    icon: BatteryCharging,
  },
  {
    id: "powertrain",
    navLabel: "Powertrain & EDU Decking",
    category: "Heavy Articulated Handling",
    title: "Electric Drive Unit & Transmission Transfer",
    model: "INDUS-HD-350-6X",
    summary:
      "High-torque articulated arms automating stator-rotor mating, gearbox decking, and sub-frame bolting with full torque-angle traceability.",
    image: images.arm,
    payload: "350 kg",
    repeatability: "±0.030 mm",
    cycleSec: 12,
    safety: "SIL 3 / STO",
    oeeLift: "+38% OEE",
    capexFactor: 1.25,
    capabilities: [
      "Dynamic counterbalancing for zero-shock mating",
      "Dual-pneumatic fail-safe gripper architecture",
      "OPC-UA Unified Namespace torque telemetry",
    ],
    icon: Cog,
  },
  {
    id: "cnc-tending",
    navLabel: "CNC & Stamping Tending",
    category: "24/7 Lights-Out Tending",
    title: "High-Speed Press & Multi-Axis Machine Tending",
    model: "INDUS-TEND-180",
    summary:
      "IP67 coolant-sealed tending robots with dual-part grippers that eliminate spindle idle time across stamping presses and CNC machining centers.",
    image: images.weldingRobot,
    payload: "180 kg",
    repeatability: "±0.020 mm",
    cycleSec: 8,
    safety: "Laser Zone Muting",
    oeeLift: "96.4% Spindle",
    capexFactor: 0.9,
    capabilities: [
      "Sub-8s dual-gripper part swap inside CNC enclosure",
      "IP67 sealed wrist against coolant & metal chips",
      "Zero-point pneumatic fixture interface",
    ],
    icon: Bot,
  },
];

const HERO_GALLERY = [
  { label: "BIW Welding", image: heroWeldingCell, tag: "7th-Axis Track" },
  { label: "EV Battery", image: heroProductionLine, tag: "Force-Controlled" },
  { label: "Powertrain", image: images.arm, tag: "350 kg Payload" },
];

export function AutomotiveDesignRedesign({ application }: { application: ApplicationData }) {
  const { openModal } = useModals();
  const [heroIdx, setHeroIdx] = useState(0);
  const [activeStationId, setActiveStationId] = useState(STATIONS[0].id);
  const [jobsPerHour, setJobsPerHour] = useState(45);
  const [shifts, setShifts] = useState(2);

  const station = STATIONS.find((s) => s.id === activeStationId) || STATIONS[0];
  const heroSlide = HERO_GALLERY[heroIdx];

  const taktSec = Math.round(3600 / jobsPerHour);
  const robotsNeeded = Math.max(1, Math.ceil(station.cycleSec / taktSec));
  const paybackMonths = Math.max(
    6,
    Math.round((16 * station.capexFactor) / (shifts * 0.85 + jobsPerHour / 60)),
  );
  const annualOutput = Math.round(jobsPerHour * shifts * 8 * 260);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 antialiased selection:bg-[#155EEF] selection:text-white">
      {/* 1. EDITORIAL SPLIT HERO */}
      <section className="bg-white border-b border-slate-200/80 pt-8 pb-14 lg:pt-12 lg:pb-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-mono text-slate-500">
            <Link to="/" className="hover:text-[#155EEF] transition-colors">
              Home
            </Link>
            <ChevronRight size={12} className="text-slate-400" />
            <Link to="/applications" className="hover:text-[#155EEF] transition-colors">
              Applications
            </Link>
            <ChevronRight size={12} className="text-slate-400" />
            <span className="text-slate-900 font-semibold">Automotive Robotics</span>
          </nav>

          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF]">
                <span className="size-2 rounded-full bg-[#155EEF] animate-pulse" />
                Automotive &amp; EV Manufacturing
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-slate-900 leading-[1.05]">
                Deterministic Robotics for{" "}
                <span className="text-[#155EEF]">Automotive &amp; EV Lines</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                Turnkey 7th-axis welding, EV battery module assembly, and high-payload powertrain
                workcells engineered for sub-millimeter repeatability and 99.98% line uptime.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Button
                  onClick={() =>
                    openModal("engineer", {
                      categoryName: "Automotive Robotics",
                      initialMessage: "Sizing Proposal Request: Automotive & EV Robotic Workcells",
                    })
                  }
                  className="h-12 rounded-xl bg-[#155EEF] hover:bg-[#1047BF] text-white font-bold text-xs uppercase tracking-wider px-6 shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  Request Sizing Proposal <ArrowRight size={15} className="ml-2" />
                </Button>

                <Link
                  to="/technology/motion-studio"
                  className="inline-flex h-12 items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 text-xs font-bold uppercase tracking-wider text-slate-800 hover:border-[#155EEF] hover:text-[#155EEF] transition-all"
                >
                  <Move3d size={15} className="text-[#155EEF]" />
                  <span>3D Motion Studio</span>
                </Link>
              </div>

              {/* Minimal 4-KPI Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
                {[
                  { label: "Repeatability", value: "±0.015 mm" },
                  { label: "Max Payload", value: "350 kg" },
                  { label: "Line Uptime", value: "99.98%" },
                  { label: "Safety Rating", value: "PL e / SIL 3" },
                ].map((kpi) => (
                  <div key={kpi.label} className="rounded-xl bg-[#F8FAFC] border border-slate-200/80 p-3">
                    <div className="text-[10px] font-mono uppercase text-slate-500">{kpi.label}</div>
                    <div className="text-base font-extrabold font-mono text-slate-900 mt-0.5">
                      {kpi.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Visual Stage */}
            <div className="lg:col-span-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
              <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-lg shadow-slate-200/60">
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-900 group">
                  <img
                    key={heroSlide.label}
                    src={heroSlide.image}
                    alt={heroSlide.label}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 animate-in fade-in duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute top-3 right-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-mono font-bold uppercase text-[#155EEF] shadow-xs">
                    {heroSlide.tag}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-300">
                        Active Cell Preview
                      </span>
                      <div className="text-lg font-bold">{heroSlide.label} Workcell</div>
                    </div>
                  </div>
                </div>

                {/* Clean Pill Switcher */}
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {HERO_GALLERY.map((slide, idx) => (
                    <button
                      key={slide.label}
                      type="button"
                      onClick={() => setHeroIdx(idx)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        idx === heroIdx
                          ? "bg-[#155EEF] text-white shadow-xs"
                          : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {slide.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. UNIFIED INTERACTIVE WORKCELL & ROI STUDIO */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-2xl">
            <span className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-[#155EEF]">
              Interactive Architecture &amp; Sizing
            </span>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Select a Station &amp; Model Your Line Output
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              Switch between automotive workcells to inspect robot specs and calculate cell count and
              payback for your target takt.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-6 items-start">
            {/* Left Rail: 4 Station Tabs */}
            <div className="lg:col-span-4 space-y-2.5">
              {STATIONS.map((item) => {
                const Icon = item.icon;
                const active = item.id === station.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveStationId(item.id)}
                    className={`w-full flex items-center gap-3.5 p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                      active
                        ? "bg-white border-[#155EEF] shadow-md shadow-blue-500/10 translate-x-1"
                        : "bg-white/70 border-slate-200 hover:bg-white hover:border-blue-300"
                    }`}
                  >
                    <div
                      className={`size-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        active ? "bg-[#155EEF] text-white" : "bg-blue-50 text-[#155EEF]"
                      }`}
                    >
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-mono uppercase text-slate-500">
                        {item.category}
                      </div>
                      <div className="text-sm font-bold text-slate-900 truncate">{item.navLabel}</div>
                    </div>
                    <ChevronRight
                      size={16}
                      className={`shrink-0 transition-transform ${
                        active ? "text-[#155EEF] translate-x-0.5" : "text-slate-400"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Right Stage: Unified Spec + Live ROI Card */}
            <div className="lg:col-span-8 rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
              <div className="grid md:grid-cols-12">
                {/* Image Column */}
                <div className="md:col-span-5 relative min-h-[260px] bg-slate-900 overflow-hidden group">
                  <img
                    key={station.id}
                    src={station.image}
                    alt={station.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 animate-in fade-in duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="rounded-md bg-white/95 px-2.5 py-1 text-[10px] font-mono font-bold text-[#155EEF]">
                      {station.model}
                    </span>
                    <span className="rounded-md bg-emerald-500 px-2.5 py-1 text-[10px] font-mono font-bold text-white">
                      {station.oeeLift}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-lg font-bold leading-snug">{station.title}</h3>
                  </div>
                </div>

                {/* Details + Live Estimator Column */}
                <div className="md:col-span-7 p-6 sm:p-7 flex flex-col justify-between gap-5">
                  <div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {station.summary}
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
                      {[
                        { k: "Payload", v: station.payload },
                        { k: "Precision", v: station.repeatability },
                        { k: "Cycle", v: `${station.cycleSec}s` },
                        { k: "Safety", v: station.safety },
                      ].map((spec) => (
                        <div key={spec.k} className="rounded-xl bg-[#F8FAFC] border border-slate-200/80 p-2.5">
                          <div className="text-[10px] font-mono uppercase text-slate-500">{spec.k}</div>
                          <div className="text-xs font-bold font-mono text-slate-900 mt-0.5">{spec.v}</div>
                        </div>
                      ))}
                    </div>

                    <ul className="mt-4 space-y-2">
                      {station.capabilities.map((cap) => (
                        <li key={cap} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 size={14} className="text-[#155EEF] shrink-0 mt-0.5" />
                          <span>{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Compact Live ROI Bar */}
                  <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold uppercase text-[#155EEF] flex items-center gap-1.5">
                        <Gauge size={13} />
                        Line Takt Estimator
                      </span>
                      <span className="font-mono font-bold text-slate-700">
                        {jobsPerHour} JPH &bull; {shifts} {shifts === 1 ? "Shift" : "Shifts"}
                      </span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3 items-center">
                      <input
                        type="range"
                        min={15}
                        max={120}
                        step={5}
                        value={jobsPerHour}
                        onChange={(e) => setJobsPerHour(Number(e.target.value))}
                        aria-label="Target jobs per hour"
                        className="w-full accent-[#155EEF] cursor-pointer"
                      />
                      <div className="flex gap-1.5">
                        {[1, 2, 3].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setShifts(s)}
                            className={`flex-1 py-1.5 rounded-lg text-[11px] font-mono font-bold border transition-colors cursor-pointer ${
                              shifts === s
                                ? "bg-[#155EEF] text-white border-[#155EEF]"
                                : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
                            }`}
                          >
                            {s}x8h
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-blue-200/60 text-center">
                      <div>
                        <div className="text-[10px] font-mono text-slate-500 uppercase">Cells</div>
                        <div className="text-sm font-extrabold font-mono text-[#155EEF]">
                          {robotsNeeded} {robotsNeeded === 1 ? "Robot" : "Robots"}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-mono text-slate-500 uppercase">Payback</div>
                        <div className="text-sm font-extrabold font-mono text-emerald-600 inline-flex items-center gap-1">
                          ~{paybackMonths}m <TrendingUp size={12} />
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-mono text-slate-500 uppercase">Annual</div>
                        <div className="text-sm font-extrabold font-mono text-slate-900">
                          {(annualOutput / 1000).toFixed(0)}k units
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    <Button
                      onClick={() =>
                        openModal("engineer", {
                          categoryName: station.title,
                          initialMessage: `Automotive Proposal: ${station.title} (${station.model}) for ${jobsPerHour} JPH, ${shifts} shifts/day (${robotsNeeded} robot(s)).`,
                        })
                      }
                      className="flex-1 h-10 rounded-xl bg-[#155EEF] hover:bg-[#1047BF] text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Request Cell Proposal <ArrowRight size={14} className="ml-1.5" />
                    </Button>
                    <Link
                      to="/technology/motion-studio"
                      className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-xs font-bold text-slate-800 hover:border-[#155EEF] hover:text-[#155EEF] transition-colors"
                    >
                      3D Simulator
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. LEGACY LINE VS INDUS WORKCELL COMPARISON */}
      <section className="bg-white border-y border-slate-200 px-4 sm:px-6 lg:px-8 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-2xl">
            <span className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-[#155EEF]">
              Operational Impact
            </span>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-slate-900">
              Solving Automotive Line Bottlenecks
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-7">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 border border-amber-200 px-3 py-1 text-[10px] font-mono font-bold uppercase text-amber-800">
                <AlertOctagon size={13} className="text-amber-600" />
                Conventional Bottlenecks
              </span>
              <h3 className="mt-4 text-xl font-bold text-slate-900">
                {application.automationChallenges.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                {application.automationChallenges.description}
              </p>
              <ul className="mt-5 pt-5 border-t border-slate-200 space-y-2.5">
                {application.automationChallenges.points.map((pt) => (
                  <li key={pt} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <span className="mt-1.5 size-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative rounded-2xl border border-blue-200 bg-white p-7 shadow-sm overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1 bg-[#155EEF]" />
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 border border-blue-200 px-3 py-1 text-[10px] font-mono font-bold uppercase text-[#155EEF]">
                <Activity size={13} />
                INDUS Deterministic Workcell
              </span>
              <h3 className="mt-4 text-xl font-bold text-slate-900">
                {application.roboticOpportunity.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                {application.roboticOpportunity.description}
              </p>
              <ul className="mt-5 pt-5 border-t border-slate-100 space-y-2.5">
                {application.roboticOpportunity.points.map((pt) => (
                  <li key={pt} className="flex items-start gap-2.5 text-xs sm:text-sm font-medium text-slate-800">
                    <CheckCircle2 size={15} className="mt-0.5 text-[#155EEF] shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CLEAN CTA + RELATED VERTICALS */}
      <section className="px-4 sm:px-6 lg:px-8 py-14">
        <div className="mx-auto max-w-7xl rounded-3xl border border-blue-200 bg-white p-8 sm:p-10 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF]">
              <Sparkles size={13} />
              Engineering Consultation
            </span>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
              Ready to Automate Your Automotive Line?
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Review cycle takt, 3D reach envelopes, and safety compliance directly with our
              automotive robotics engineers.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Button
              asChild
              className="h-11 rounded-xl bg-[#155EEF] hover:bg-[#1047BF] text-white text-xs font-bold uppercase tracking-wider px-6"
            >
              <Link to="/book-consultation">
                <Calendar size={14} className="mr-2" />
                Book Consultation
              </Link>
            </Button>
            <Button
              variant="outline"
              onClick={() => openModal("quote")}
              className="h-11 rounded-xl border-slate-300 text-slate-800 hover:border-[#155EEF] hover:text-[#155EEF] text-xs font-bold uppercase tracking-wider px-6 cursor-pointer"
            >
              Request Quote <ArrowRight size={14} className="ml-1.5" />
            </Button>
          </div>
        </div>
      </section>

      <div className="bg-white border-t border-slate-200">
        <RelatedContent
          title="Other Manufacturing Sectors"
          items={[
            {
              sectionTitle: "Related Industrial Sectors",
              links: applicationsData
                .filter((a) => a.id !== application.id)
                .slice(0, 3)
                .map((a) => ({
                  title: a.title,
                  description: a.heroSubtitle,
                  href: `/applications/${a.id}`,
                })),
            },
          ]}
        />
      </div>
    </div>
  );
}
