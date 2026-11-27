import React, { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Building,
  CheckCircle2,
  ChevronRight,
  Clock,
  FlaskConical,
  Lock,
  Microscope,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  ZoomIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModals } from "@/components/modals/ModalContext";
import { buildSeoMeta } from "@/lib/seo";
import { FloatingEngineerCta } from "@/components/solutions/FloatingEngineerCta";

import healthcareHeroImg from "@/assets/solution-healthcare-robot.jpg";
import labArmImg from "@/assets/products/cobot-robot.jpg";

export const Route = createFileRoute("/solutions/healthcare-pharmaceuticals")({
  head: () =>
    buildSeoMeta({
      title:
        "Zero-Contamination Robotics for Healthcare & Pharma | INDUS Robotics",
      description:
        "Protect patients, eliminate hospital-acquired infections, and accelerate diagnostic lab turnaround with autonomous disinfection and precision lab automation.",
      path: "/solutions/healthcare-pharmaceuticals",
    }),
  component: HealthcarePharmaceuticalsPage,
});

const PATHOGEN_MARKERS = [
  { id: "bed", label: "Surgical Table", x: 24, y: 54 },
  { id: "monitor", label: "ICU Console", x: 52, y: 38 },
  { id: "airlock", label: "Sterile Airlock", x: 78, y: 62 },
];

const ROOM_CYCLES = [
  {
    id: "icu",
    label: "ICU Ward: 10 Mins",
    duration: "10 Mins",
    radius: "8.5 m",
    dosage: "254 nm • 4-Log (99.99%)",
    note: "Rapid terminal turnover between critical-care admissions with automatic PIR motion shutoff.",
  },
  {
    id: "or",
    label: "Operating Theater: 15 Mins",
    duration: "15 Mins",
    radius: "11.0 m",
    dosage: "254 nm • 5-Log (99.999%)",
    note: "Deep multi-position sweep targeting shadow zones around surgical tables and anesthesia carts.",
  },
  {
    id: "pharma",
    label: "Pharma Cleanroom: 12 Mins",
    duration: "12 Mins",
    radius: "9.5 m",
    dosage: "254 nm • GMP Grade A/B",
    note: "Chemical-free sterilization with 21 CFR Part 11 digital PDF/HL7 audit certificates.",
  },
];

const ELEVATOR_STEPS = [
  {
    step: "01",
    title: "Unlock Smart Door",
    detail:
      "Delivery bot approaches restricted pharmacy airlock and triggers automated door controller via encrypted Wi-Fi.",
    badge: "Door Triggered",
    progress: "20%",
  },
  {
    step: "02",
    title: "Autonomous Elevator Ride",
    detail:
      "Calls elevator bank, boards safely using 360° LiDAR, and rides autonomously from Basement Pharmacy to Floor 4 ICU.",
    badge: "Floor 1 → Floor 4",
    progress: "62%",
  },
  {
    step: "03",
    title: "PIN-Locked Nurse Station Handoff",
    detail:
      "Arrives at Ward 4B; nurse taps RFID badge or enters PIN to unlock Compartment B for controlled medication.",
    badge: "Custody Verified",
    progress: "100%",
  },
];

function HealthcarePharmaceuticalsPage() {
  const { openModal } = useModals();

  // Hero "Sterile-Scan" cursor sweep (0-100%)
  const [scanPercent, setScanPercent] = useState<number>(64);

  // Solution 1: Room Cycle Timer Toggle
  const [activeCycleId, setActiveCycleId] = useState<string>("icu");
  const activeCycle =
    ROOM_CYCLES.find((c) => c.id === activeCycleId) ?? ROOM_CYCLES[0];

  // Solution 2: Multi-Floor Elevator Journey
  const [elevatorStepIdx, setElevatorStepIdx] = useState<number>(1);
  const activeElevatorStep = ELEVATOR_STEPS[elevatorStepIdx];

  // Solution 3: Lab Automation Hover Zoom
  const [labZoomed, setLabZoomed] = useState<boolean>(false);

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(
      10,
      Math.min(100, ((e.clientX - rect.left) / rect.width) * 100),
    );
    setScanPercent(Math.round(pct));
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-[#0D9488] selection:text-white">
      {/* 1. INTERACTIVE HERO: "STERILE-SCAN" UV-C & LAB SIMULATOR */}
      <section className="border-b border-teal-100 bg-gradient-to-b from-cyan-50/50 via-white to-white">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-8"
          >
            <Link
              to="/solutions"
              className="hover:text-[#0D9488] transition-colors"
            >
              Solutions
            </Link>
            <ChevronRight size={14} />
            <span className="text-[#0D9488]">Healthcare & Pharmaceuticals</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#0D9488]">
                <Stethoscope size={14} />
                <span>Ultra-Sterile Clinical Automation</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-bold tracking-tight text-slate-900 leading-[1.08]">
                Zero-Contamination Robotics for Healthcare & Pharma
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                Protect patients, eliminate hospital-acquired infections, and
                accelerate diagnostic lab turnaround with autonomous
                disinfection and precision lab automation.
              </p>

              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Button
                  size="lg"
                  onClick={() => openModal("quote")}
                  className="rounded-full bg-[#0D9488] hover:bg-[#0F766E] text-white font-semibold px-7 h-12 text-sm shadow-sm cursor-pointer"
                >
                  <span>Book a Clinical Demo</span>
                  <ArrowRight size={16} className="ml-2" />
                </Button>
                <a
                  href="#clinical-solutions"
                  className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white hover:bg-teal-50 text-teal-800 font-semibold px-6 h-12 text-sm transition-colors"
                >
                  <span>Explore Clinical Robots</span>
                </a>
              </div>
            </div>

            {/* Interactive Sterile-Scan UV-C Simulator */}
            <div className="lg:col-span-6 space-y-3">
              <div
                onMouseMove={handleHeroMouseMove}
                className="relative rounded-2xl overflow-hidden border border-cyan-200 shadow-xl aspect-[16/10] bg-slate-950 cursor-ew-resize select-none"
              >
                <img
                  src={healthcareHeroImg}
                  alt="Autonomous UV-C disinfection and hospital delivery robot in a sterile corridor"
                  className="w-full h-full object-cover"
                />

                {/* Unscanned Dark Overlay on the right */}
                <div
                  className="absolute inset-0 bg-slate-950/55 transition-all duration-75"
                  style={{ clipPath: `inset(0 0 0 ${scanPercent}%)` }}
                />

                {/* Glowing Violet-Blue UV-C Disinfection Beam */}
                <div
                  className="absolute inset-y-0 w-10 -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent pointer-events-none"
                  style={{ left: `${scanPercent}%` }}
                >
                  <div className="mx-auto h-full w-0.5 bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.95)]" />
                </div>

                {/* Pathogen Markers turning into 99.99% Sterilized */}
                {PATHOGEN_MARKERS.map((marker) => {
                  const isSterilized = scanPercent >= marker.x;
                  return (
                    <div
                      key={marker.id}
                      style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-200"
                    >
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold shadow-lg backdrop-blur-xs ${
                          isSterilized
                            ? "bg-emerald-500 text-white border border-emerald-300"
                            : "bg-rose-600/95 text-white border border-rose-300 animate-pulse"
                        }`}
                      >
                        <span
                          className={`size-2 rounded-full ${
                            isSterilized ? "bg-white" : "bg-rose-200"
                          }`}
                        />
                        {isSterilized
                          ? `${marker.label}: 99.99% Sterilized`
                          : `${marker.label}: Pathogen Risk`}
                      </span>
                    </div>
                  );
                })}

                <div className="absolute top-3 left-3 rounded-full bg-slate-950/80 border border-cyan-400/40 px-3 py-1 text-[11px] font-semibold text-cyan-300 backdrop-blur-xs">
                  Move cursor or drag slider to sweep UV-C beam ({scanPercent}
                  %)
                </div>
              </div>

              <input
                type="range"
                min={10}
                max={100}
                value={scanPercent}
                onChange={(e) => setScanPercent(Number(e.target.value))}
                aria-label="Sweep UV-C sterilization beam"
                className="w-full accent-[#0D9488] cursor-pointer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE 3 CORE SOLUTIONS (WITH INTERACTIVE VISUAL TRIGGERS) */}
      <section id="clinical-solutions" className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0D9488]">
              Clinical & Pharma Robotics
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Three purpose-built systems for zero-contamination care
            </h2>
          </div>

          {/* SOLUTION 1: AUTONOMOUS UV-C DISINFECTION ROBOTS */}
          <article
            id="uvc-disinfection-robots"
            className="rounded-3xl border border-teal-100 bg-gradient-to-br from-white to-cyan-50/40 p-7 sm:p-10 shadow-xs"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 border border-teal-200 px-3 py-1 text-xs font-bold text-[#0D9488]">
                  <Sparkles size={14} />
                  <span>01 · Room Cycle Timer Simulator</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Autonomous UV-C Disinfection Robots
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Chemical-free, autonomous room sterilization with
                  motion-activated safety shutoff and automated digital
                  compliance logs.
                </p>

                {/* Room Cycle Timer Toggle */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {ROOM_CYCLES.map((cycle) => {
                    const isActive = cycle.id === activeCycle.id;
                    return (
                      <button
                        key={cycle.id}
                        type="button"
                        onClick={() => setActiveCycleId(cycle.id)}
                        className={`rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer border ${
                          isActive
                            ? "bg-[#0D9488] text-white border-[#0D9488] shadow-xs"
                            : "bg-white text-slate-700 border-teal-200 hover:bg-teal-50"
                        }`}
                      >
                        {cycle.label}
                      </button>
                    );
                  })}
                </div>

                <p className="text-xs sm:text-sm text-slate-600 bg-white rounded-xl border border-teal-100 p-4">
                  {activeCycle.note}
                </p>
              </div>

              {/* Visual UV Coverage Radius & Kill Rate Card */}
              <div className="lg:col-span-6">
                <div className="rounded-2xl bg-[#042F2E] text-white p-8 relative overflow-hidden border border-teal-700">
                  <div className="grid grid-cols-3 gap-4 relative z-10 text-center">
                    <div className="rounded-xl bg-white/10 p-4 backdrop-blur-xs">
                      <Clock size={18} className="mx-auto text-cyan-300 mb-1" />
                      <div className="text-xl font-bold">
                        {activeCycle.duration}
                      </div>
                      <div className="text-[11px] text-teal-200">
                        Cycle Time
                      </div>
                    </div>
                    <div className="rounded-xl bg-white/10 p-4 backdrop-blur-xs">
                      <ShieldCheck
                        size={18}
                        className="mx-auto text-emerald-300 mb-1"
                      />
                      <div className="text-xl font-bold">99.99%</div>
                      <div className="text-[11px] text-teal-200">Kill Rate</div>
                    </div>
                    <div className="rounded-xl bg-white/10 p-4 backdrop-blur-xs">
                      <Sparkles
                        size={18}
                        className="mx-auto text-cyan-300 mb-1"
                      />
                      <div className="text-xl font-bold">
                        {activeCycle.radius}
                      </div>
                      <div className="text-[11px] text-teal-200">UV Radius</div>
                    </div>
                  </div>
                  <div className="mt-5 text-center text-xs font-semibold text-cyan-200">
                    Output: {activeCycle.dosage} • 360° PIR Safety Shutoff Armed
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* SOLUTION 2: HOSPITAL LOGISTICS & PHARMACY DELIVERY BOTS */}
          <article
            id="hospital-delivery-bots"
            className="rounded-3xl border border-slate-200 bg-[#F8FAFC] p-7 sm:p-10 shadow-xs"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-cyan-50 border border-cyan-200 px-3 py-1 text-xs font-bold text-cyan-800">
                  <Building size={14} />
                  <span>02 · Multi-Floor Elevator Journey</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Hospital Logistics & Pharmacy Delivery Bots
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Secure, closed-loop transport for blood samples, controlled
                  medications, and surgical supplies—freeing nurses for direct
                  patient care.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {ELEVATOR_STEPS.map((s, idx) => (
                    <button
                      key={s.step}
                      type="button"
                      onClick={() => setElevatorStepIdx(idx)}
                      className={`rounded-full px-3.5 py-2 text-xs font-bold transition-all cursor-pointer border ${
                        idx === elevatorStepIdx
                          ? "bg-[#0D9488] text-white border-[#0D9488]"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {s.step}. {s.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive Elevator Journey Display */}
              <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xs space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0D9488]">
                    Step {activeElevatorStep.step} — {activeElevatorStep.title}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
                    <Lock size={12} />
                    <span>{activeElevatorStep.badge}</span>
                  </span>
                </div>

                {/* Animated Progress Bar */}
                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#0D9488] to-[#06B6D4] transition-all duration-500 rounded-full"
                    style={{ width: activeElevatorStep.progress }}
                  />
                </div>

                <p className="text-sm text-slate-700 leading-relaxed">
                  {activeElevatorStep.detail}
                </p>

                <div className="grid grid-cols-3 gap-3 pt-2 text-xs text-slate-500">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <div className="font-bold text-slate-900">RFID + PIN</div>
                    <div>2–4 Locked Bays</div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <div className="font-bold text-slate-900">&lt; 48 dBA</div>
                    <div>Whisper-Quiet</div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <div className="font-bold text-slate-900">12 Hrs</div>
                    <div>Auto-Dock Battery</div>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* SOLUTION 3: LAB AUTOMATION ARMS */}
          <article
            id="lab-automation-arms"
            className="rounded-3xl border border-teal-100 bg-white p-7 sm:p-10 shadow-xs"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 border border-teal-200 px-3 py-1 text-xs font-bold text-[#0D9488]">
                  <Microscope size={14} />
                  <span>03 · Hover-Zoom Precision Inspection</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Lab Automation Arms
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Cleanroom-certified desktop arms engineered for 24/7
                  high-throughput PCR testing, blood diagnostics, and drug
                  screening.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-4">
                    <div className="text-xs text-slate-500 font-semibold">
                      Repeatability
                    </div>
                    <div className="text-lg font-bold text-slate-900 mt-0.5">
                      ±0.015 mm
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-4">
                    <div className="text-xs text-slate-500 font-semibold">
                      Cleanroom Class
                    </div>
                    <div className="text-lg font-bold text-slate-900 mt-0.5">
                      ISO Class 4 / GMP
                    </div>
                  </div>
                </div>
              </div>

              <div
                onMouseEnter={() => setLabZoomed(true)}
                onMouseLeave={() => setLabZoomed(false)}
                className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-teal-200 aspect-[16/10] bg-slate-100 cursor-zoom-in"
              >
                <img
                  src={labArmImg}
                  alt="High-precision desktop lab automation robotic arm handling diagnostic vials"
                  className={`w-full h-full object-cover transition-transform duration-500 ${
                    labZoomed ? "scale-125" : "scale-100"
                  }`}
                />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl bg-slate-950/80 backdrop-blur-xs px-4 py-2.5 text-xs text-white">
                  <span className="flex items-center gap-2 font-semibold">
                    <FlaskConical size={14} className="text-cyan-300" />
                    <span>Zero Cross-Contamination • 384-Well Plate Sync</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-cyan-300 font-bold">
                    <ZoomIn size={14} />
                    <span>{labZoomed ? "2.0x Zoom" : "Hover to Zoom"}</span>
                  </span>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <FloatingEngineerCta />
    </div>
  );
}
