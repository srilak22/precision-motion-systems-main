import React from "react";
import {
  Lock,
  Building,
  ShieldCheck,
  Sparkles,
  Zap,
  Thermometer,
  FileCheck2,
  Network,
  CheckCircle2,
} from "lucide-react";

interface HospitalFeature {
  id: string;
  icon: React.ElementType;
  title: string;
  category: string;
  description: string;
  highlights: string[];
  specs: string;
}

const HOSPITAL_FEATURES: HospitalFeature[] = [
  {
    id: "multi-tier-lockers",
    icon: Lock,
    title: "Multi-Tier PIN & RFID Smart Lockers",
    category: "Chain of Custody",
    description:
      "Independently locked modular compartments with electronic solenoid deadbolts and tamper detection protect schedule medications, chemotherapy, and patient charts.",
    highlights: [
      "Staff hospital badge (RFID / NFC) and 6-digit PIN unlocking",
      "Tier isolation ensures nurse accesses only their unit's medication",
      "Electronic tamper sensors trigger audible alerts and dispatch flags",
    ],
    specs: "Up to 50 kg Across 4 Modular Tiers",
  },
  {
    id: "elevator-interfacing",
    icon: Building,
    title: "Autonomous Elevator & Door Interfacing",
    category: "Multi-Floor IoT",
    description:
      "Wireless BACnet/Modbus IoT bridge communicates directly with Otis, Schindler, KONE, and ThyssenKrupp elevator banks and automatic cleanroom airlock doors.",
    highlights: [
      "Zero human assistance required for vertical inter-floor transit",
      "Dynamic car reservation preventing passenger overcrowding",
      "Automated wireless opening of fire doors and surgical airlocks",
    ],
    specs: "BACnet IP / Modbus Multi-Vendor Bridge",
  },
  {
    id: "lidar-safety",
    icon: ShieldCheck,
    title: "360° LiDAR & Patient Clearance Suite",
    category: "Functional Safety",
    description:
      "Dual safety-rated planar LiDAR scanners paired with 3D time-of-flight depth cameras ensure safe operation around wheelchairs, IV poles, and patient gurneys.",
    highlights: [
      "ISO 3691-4 industrial and medical AGV safety compliance",
      "Gentle speed governor with acoustic whisper chime in patient wings",
      "Instant mechanical contact bumper safety cutoff",
    ],
    specs: "ISO 13849-1 PLd Certified Safety",
  },
  {
    id: "antimicrobial-shell",
    icon: Sparkles,
    title: "Antimicrobial Cleanroom Enclosure",
    category: "Infection Control",
    description:
      "Constructed from medical-grade antimicrobial ABS polymer housing sealed against disinfectant ingress. Surfaces withstand daily hospital-grade chemical wipe-downs.",
    highlights: [
      "Compatible with bleach, quaternary ammonium, and IPA wipes",
      "IP54 fluid-sealed seams eliminating dust traps and biofilm growth",
      "Cleanroom ISO Class 6 operational compatibility",
    ],
    specs: "IP54 Fluid Sealed · ISO Class 6",
  },
  {
    id: "stat-priority",
    icon: Zap,
    title: "STAT Emergency Priority Dispatch",
    category: "Fleet Optimization",
    description:
      "Emergency medication orders for the ICU, ER, or cardiac units preempt routine supply runs, calculating the fastest unobstructed corridor path.",
    highlights: [
      "Instant preemption of routine linen or supply missions",
      "Priority elevator summoning for emergency clinical orders",
      "Average STAT pharmacy-to-ICU transit reduced to <15 minutes",
    ],
    specs: "<15 min STAT Delivery Turnaround",
  },
  {
    id: "temp-monitoring",
    icon: Thermometer,
    title: "Temperature-Monitored Biological Transit",
    category: "Specimen Security",
    description:
      "Optional active thermal telemetry compartment maintains calibrated refrigeration (2°C to 8°C) for blood products, pathology biopsies, and specialized vaccines.",
    highlights: [
      "Continuous digital temperature logging with out-of-range alarms",
      "Insulated thermal bay with passive gel-pack or active Peltier cooling",
      "CAP / CLIA regulatory compliance for diagnostic specimens",
    ],
    specs: "Calibrated 2°C – 8°C Thermal Logging",
  },
  {
    id: "chain-of-custody",
    icon: FileCheck2,
    title: "Cryptographic Chain-of-Custody Audit",
    category: "Regulatory Compliance",
    description:
      "Millisecond-precision immutable event logging tracking loading technician, transit route, door seal verification, and receiving nurse digital signatures.",
    highlights: [
      "Full HIPAA, JCAHO, and DEA-aligned digital compliance records",
      "Exportable PDF and CSV transport audit certificates",
      "Eliminates lost-medication investigations and misplaced specimen disputes",
    ],
    specs: "100% Digital Custody Auditability",
  },
  {
    id: "ehr-integration",
    icon: Network,
    title: "Hospital EHR & Pharmacy Workflow Bridge",
    category: "Clinical Informatics",
    description:
      "Direct API and HL7 / FHIR interfaces integrate with hospital information systems (Epic, Cerner, Meditech) and automated pharmacy dispensing carousels.",
    highlights: [
      "Automated mission triggers from pharmacy dispense barcode verification",
      "Direct nurse arrival notifications via Vocera, Ascom, or workstation UI",
      "Cloud fleet dashboard for centralized biomedical engineering oversight",
    ],
    specs: "HL7 v2.x / FHIR R4 / Epic & Cerner Ready",
  },
];

export function HospitalFeatures() {
  return (
    <section className="relative bg-white text-slate-900 py-16 sm:py-24 px-4 lg:px-8 border-b border-slate-200">
      <div className="relative mx-auto max-w-[1440px]">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider text-[#155EEF] mb-4">
            <Sparkles size={13} className="text-[#155EEF]" />
            <span>Clinical Capabilities</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-slate-900 leading-tight">
            Key Features Engineered for <br />
            <span className="text-[#155EEF]">Demanding Hospital Operations</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Every subsystem is built to rigorous clinical standards, prioritizing patient comfort,
            biochemical containment, data security, and seamless multi-floor transit.
          </p>
        </div>

        {/* 8 Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOSPITAL_FEATURES.map((feature, idx) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.id}
                className="group relative rounded-xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:border-[#155EEF] hover:shadow-xl hover:shadow-blue-500/5 flex flex-col justify-between"
              >
                <div>
                  {/* Top category & icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="size-11 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#155EEF] group-hover:bg-[#155EEF] group-hover:text-white transition-colors">
                      <Icon size={20} />
                    </div>
                    <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      0{idx + 1}
                    </span>
                  </div>

                  {/* Category Pill */}
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#155EEF] mb-1.5">
                    {feature.category}
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-[#155EEF] transition-colors leading-snug">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {feature.description}
                  </p>

                  {/* Bullet Highlights */}
                  <div className="space-y-1.5 mb-5">
                    {feature.highlights.map((h, hIdx) => (
                      <div
                        key={hIdx}
                        className="flex items-start gap-1.5 text-[11px] text-slate-700 leading-tight"
                      >
                        <CheckCircle2
                          size={12}
                          className="text-[#155EEF] shrink-0 mt-0.5"
                        />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Spec Badge */}
                <div className="pt-3 border-t border-slate-100">
                  <span className="inline-block font-mono text-[11px] font-semibold text-slate-500 bg-slate-50 border border-slate-200/80 rounded px-2 py-0.5 w-full text-center">
                    {feature.specs}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
