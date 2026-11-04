import React, { useState } from "react";
import {
  Hospital,
  FlaskConical,
  Pill,
  Activity,
  HeartHandshake,
  Droplets,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

interface SectorApplication {
  id: string;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  description: string;
  environmentAdaptations: string[];
  keyBenefits: string[];
  recommendedDeployment: string;
}

const HOSPITAL_APPLICATIONS: SectorApplication[] = [
  {
    id: "multi-wing-hospitals",
    icon: Hospital,
    title: "Multi-Wing Tertiary Hospitals",
    subtitle: "Inpatient Towers, ICU & Emergency Pavilions",
    description:
      "Large acute care hospitals with sprawling multi-story layouts where routine nurse foot messenger errands create massive fatigue and delay urgent medication administration.",
    environmentAdaptations: [
      "BACnet elevator integration navigating across 10+ tower stories",
      "Dynamic costmaps detouring around floor cleaning and bed transit",
      "Hospital-wide geofencing and automatic door release interlocks",
    ],
    keyBenefits: [
      "Reclaims hundreds of daily nursing hours for direct bedside care",
      "Cuts average STAT medication delivery times to under 15 minutes",
      "Eliminates late-night porter staffing shortages in inpatient wards",
    ],
    recommendedDeployment: "1 unit per 80–120 operational beds",
  },
  {
    id: "pathology-labs",
    icon: FlaskConical,
    title: "Diagnostic & Pathology Laboratories",
    subtitle: "Central Hematology, Biopsy & Clinical Labs",
    description:
      "Laboratories requiring continuous, reliable specimen transport from emergency departments, outpatient clinics, and surgical suites without sample degradation.",
    environmentAdaptations: [
      "Active vibration-dampened suspension preventing hemolysis of blood tubes",
      "Sealed biosafety secondary containment pods resistant to liquid leaks",
      "Immediate STAT specimen prioritization with automatic lab door trigger",
    ],
    keyBenefits: [
      "Accelerates critical lab report turnaround times (TAT) for ER patients",
      "Provides cryptographic digital chain-of-custody tracking for all samples",
      "Prevents misplacement of delicate biopsy and pathology specimens",
    ],
    recommendedDeployment: "2–4 units connecting main labs to clinics",
  },
  {
    id: "central-pharmacy",
    icon: Pill,
    title: "Centralized Hospital Pharmacies",
    subtitle: "Inpatient Pharmacy Dispense & IV Cleanrooms",
    description:
      "Hospital pharmacies dispensing thousands of daily medication doses, IV bags, and controlled substances requiring strict custody verification and timely ward delivery.",
    environmentAdaptations: [
      "Multi-tier electronic smart lockers with independent nurse access codes",
      "Barcode verification before locker latch release and loading confirmation",
      "Cleanroom ISO Class 6 operational compatibility outside IV cleanroom",
    ],
    keyBenefits: [
      "Reduces medication delivery bottlenecks during scheduled 2 PM shift changes",
      "Provides DEA-compliant audit logging for controlled substance transit",
      "Eliminates dependence on crowded pneumatic tube delivery networks",
    ],
    recommendedDeployment: "3–6 units dedicated to pharmacy dispatch",
  },
  {
    id: "surgical-centers",
    icon: Activity,
    title: "Surgical Suites & Operating Rooms",
    subtitle: "Pre-Op, Sterile Processing & Recovery Wings",
    description:
      "High-acuity surgical environments demanding sterile material delivery, surgical implant transport, and rapid replenishment of surgical supplies.",
    environmentAdaptations: [
      "Sterile corridor airlock door wireless triggering without touching panels",
      "Antimicrobial chassis exterior resistant to hospital disinfectant wipes",
      "Ultra-quiet brushless motor operation (<48 dB) preventing surgeon distraction",
    ],
    keyBenefits: [
      "Rapid on-demand transit of supplemental surgical implants and sutures",
      "Frees surgical tech staff to remain scrubbed inside the operative suite",
      "Preserves strict airflow zoning and sterile pressure differentials",
    ],
    recommendedDeployment: "1–2 units per surgical suite cluster",
  },
  {
    id: "long-term-care",
    icon: HeartHandshake,
    title: "Rehabilitation & Long-Term Care",
    subtitle: "Geriatric Units, Hospices & Sub-Acute Centers",
    description:
      "Extended care facilities where caregivers spend substantial time transporting daily oral medicines, patient records, and specialized dietary supplements.",
    environmentAdaptations: [
      "Gentle visual and polite chime cues designed for elderly patient comfort",
      "Wide hallway SLAM navigation maintaining generous clearance around walkers",
      "Low profile chassis designed not to intimidate frail or dementia residents",
    ],
    keyBenefits: [
      "Allows nursing staff to dedicate full attention to resident interactions",
      "Guarantees punctuality for multi-patient medication administration passes",
      "Provides reliable support during night shifts with reduced staffing",
    ],
    recommendedDeployment: "1 unit per 50 resident beds",
  },
  {
    id: "blood-banks",
    icon: Droplets,
    title: "Blood Banks & Transfusion Centers",
    subtitle: "Packed RBC, Plasma & Platelet Transport",
    description:
      "Specialized transfusion centers transporting temperature-sensitive blood units from centralized storage to trauma bays and intensive care units.",
    environmentAdaptations: [
      "Optional active thermal regulation (2°C to 8°C) with continuous logging",
      "AABB and FDA-aligned digital custody verification and transport logging",
      "Rapid preemption protocol clearing elevator path for massive transfusion orders",
    ],
    keyBenefits: [
      "Safeguards irreplaceable blood products from thermal degradation in transit",
      "Delivers trauma blood units directly to resuscitation bays within minutes",
      "Immutable audit record of every transfusion release event",
    ],
    recommendedDeployment: "1–2 units connecting blood bank to trauma/ICU",
  },
];

export function HospitalApplications() {
  const [activeSectorId, setActiveSectorId] = useState<string>("multi-wing-hospitals");

  const activeSector =
    HOSPITAL_APPLICATIONS.find((s) => s.id === activeSectorId) || HOSPITAL_APPLICATIONS[0];
  const ActiveIcon = activeSector.icon;

  return (
    <section className="relative bg-white text-slate-900 py-16 sm:py-24 px-4 lg:px-8 border-b border-slate-200">
      <div className="relative mx-auto max-w-[1440px]">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider text-[#155EEF] mb-4">
            <Hospital size={13} className="text-[#155EEF]" />
            <span>Healthcare Operating Domains</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-slate-900 leading-tight">
            Clinical Environments &amp; <br />
            <span className="text-[#155EEF]">Specialized Adaptations</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Whether deployed across a 1,000-bed academic medical center or a specialized regional
            pathology laboratory, the INDUS Hospital Delivery platform configures to meet strict
            clinical hygiene and speed requirements.
          </p>
        </div>

        {/* Sector Tabs Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {HOSPITAL_APPLICATIONS.map((sector) => {
            const Icon = sector.icon;
            const isSelected = sector.id === activeSectorId;

            return (
              <button
                key={sector.id}
                onClick={() => setActiveSectorId(sector.id)}
                className={`p-4 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? "border-[#155EEF] bg-blue-50 shadow-sm ring-1 ring-[#155EEF]"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div
                  className={`size-10 rounded-lg flex items-center justify-center mb-3 transition-colors ${
                    isSelected ? "bg-[#155EEF] text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <Icon size={20} />
                </div>
                <div className="text-xs font-bold text-slate-900 leading-snug">
                  {sector.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Sector Deep-Dive Card */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 sm:p-8 lg:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Context & Overview */}
            <div className="lg:col-span-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="size-12 rounded-xl bg-[#155EEF]/10 border border-[#155EEF]/20 flex items-center justify-center text-[#155EEF]">
                  <ActiveIcon size={24} />
                </div>
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF]">
                    Clinical Environment
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {activeSector.title}
                  </h3>
                </div>
              </div>

              <div className="text-sm font-semibold text-slate-700 mb-3">
                {activeSector.subtitle}
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                {activeSector.description}
              </p>

              {/* Recommended Deployment */}
              <div className="rounded-xl bg-white border border-slate-200 p-4">
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Typical Clinical Sizing
                </div>
                <div className="text-base font-bold font-mono text-[#155EEF]">
                  {activeSector.recommendedDeployment}
                </div>
              </div>
            </div>

            {/* Right Column: Adaptations & Benefits */}
            <div className="lg:col-span-6 space-y-6">
              {/* Adaptations */}
              <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-2xs">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                  <ShieldCheck size={14} className="text-[#155EEF]" />
                  <span>Engineering &amp; Protocol Adaptations</span>
                </h4>
                <div className="space-y-2">
                  {activeSector.environmentAdaptations.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 text-xs text-slate-700"
                    >
                      <span className="size-1.5 rounded-full bg-[#155EEF] shrink-0 mt-1.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Operational Benefits */}
              <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-2xs">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 mb-3 flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span>Clinical &amp; Operational Value</span>
                </h4>
                <div className="space-y-2">
                  {activeSector.keyBenefits.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 text-xs text-slate-700"
                    >
                      <CheckCircle2
                        size={14}
                        className="text-emerald-500 shrink-0 mt-0.5"
                      />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
