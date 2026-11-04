import React, { useState } from "react";
import {
  Lock,
  Compass,
  Building,
  Activity,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Sparkles,
  Network,
} from "lucide-react";

interface HospitalComponent {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  tag: string;
  description: string;
  subComponents: string[];
  keySpecs: { label: string; value: string }[];
  workingMechanism: string;
}

const HOSPITAL_COMPONENTS: HospitalComponent[] = [
  {
    id: "autonomous-base",
    number: "01",
    title: "Cleanroom Mobile Drive Base",
    subtitle: "Whisper-Quiet Omnidirectional Motion",
    icon: Compass,
    tag: "Mobility & Motion",
    description:
      "Engineered specifically for clinical corridors with zero-turning-radius capability, non-marking medical polyurethane casters, and ultra-quiet brushless direct-drive motors operating below 48 dB.",
    subComponents: [
      "Zero-turning-radius differential drive chassis",
      "Antimicrobial floor wheels with electrostatic discharge (ESD) protection",
      "Smart suspension absorbing corridor thresholds and elevator sill transitions",
    ],
    keySpecs: [
      { label: "Acoustic Noise", value: "<48 dB (Silent)" },
      { label: "Max Speed", value: "1.2 m/s Governed" },
      { label: "Turning Radius", value: "0 mm (In-Place)" },
    ],
    workingMechanism:
      "Receives high-frequency path coordinates from the ROS2 Nav2 stack, maintaining smooth acceleration profiles to protect delicate liquid medicines and blood vials.",
  },
  {
    id: "secure-lockers",
    number: "02",
    title: "Secure Multi-Tier Smart Lockers",
    subtitle: "Biometric & RFID Access Compartments",
    icon: Lock,
    tag: "Chain of Custody",
    description:
      "Modular, independently lockable compartments with digital solenoid latches prevent unauthorized access to schedule medications, narcotics, and confidential patient records during transit.",
    subComponents: [
      "Staff hospital badge (RFID / NFC) and 6-digit PIN keypad unlocking",
      "Tamper-evident electronic sensors and forced-entry audible alarm",
      "Optional temperature-regulated compartment for biologicals (2°C to 8°C)",
    ],
    keySpecs: [
      { label: "Payload Capacity", value: "Up to 50 kg" },
      { label: "Compartments", value: "2 to 4 Modular Tiers" },
      { label: "Locking Latency", value: "<0.3 sec Response" },
    ],
    workingMechanism:
      "Compartment opens only when the designated nurse scans their credentials at the destination ward, automatically logging the exact delivery timestamp and badge ID.",
  },
  {
    id: "perception-safety",
    number: "03",
    title: "360° LiDAR & Patient Safety Suite",
    subtitle: "Hospital-Grade Collision Prevention",
    icon: ShieldCheck,
    tag: "Functional Safety",
    description:
      "Multi-layered sensory array featuring dual safety-rated planar LiDARs, 3D time-of-flight depth cameras, and ultrasonic foot-level bumpers ensures gentle navigation around patients, IV poles, and wheelchairs.",
    subComponents: [
      "Dual SIL-2 / ISO 3691-4 certified safety LiDARs",
      "Wide-angle 3D depth cameras detecting overhead IV stands and bed sills",
      "Tactile 360° soft silicone emergency bumper with instantaneous motor brake",
    ],
    keySpecs: [
      { label: "Detection Field", value: "360° Continuous" },
      { label: "Safety Stop Distance", value: "<0.25 m at 1 m/s" },
      { label: "Compliance", value: "ISO 13849-1 (PLd)" },
    ],
    workingMechanism:
      "Projects dynamic virtual safety envelopes around the robot; gracefully yields to passing doctors and patient gurneys with courteous voice guidance.",
  },
  {
    id: "elevator-integration",
    number: "04",
    title: "Elevator & Automatic Door IoT Gateway",
    subtitle: "Seamless Multi-Floor Interfacing",
    icon: Building,
    tag: "Facility Integration",
    description:
      "Dedicated wireless communication bridge interfaces with hospital elevator dispatch systems (Otis, Schindler, KONE, ThyssenKrupp) and motorized airlock doors without human intervention.",
    subComponents: [
      "Wireless BACnet / Modbus / MQTT elevator controller relay",
      "Automated floor selection and priority car summoning",
      "Corridor automatic fire and cleanroom airlock door triggering",
    ],
    keySpecs: [
      { label: "Elevator Protocol", value: "BACnet IP / API" },
      { label: "Door Range", value: "8–12 meters Wireless" },
      { label: "Floor Transition", value: "Autonomous" },
    ],
    workingMechanism:
      "Sends encrypted floor dispatch requests via local Wi-Fi, waits for car arrival confirmation, boards safely, commands destination floor, and exits upon door opening.",
  },
  {
    id: "workflow-ehr-bridge",
    number: "05",
    title: "Hospital Workflow & EHR Integration",
    subtitle: "Pharmacy Dispense & HIS Compatibility",
    icon: Network,
    tag: "Healthcare Informatics",
    description:
      "Standardized integration layer compatible with hospital information systems (Epic, Cerner, Meditech) and pharmacy dispensing workflows via HL7 / FHIR messaging standards.",
    subComponents: [
      "Automated transport order creation from pharmacy dispense verification",
      "Real-time SMS / hospital Vocera / Ascom pager arrival alerts for nurses",
      "Full digital audit trail logging origin, route, duration, and recipient sign-off",
    ],
    keySpecs: [
      { label: "Data Protocol", value: "HL7 v2.x / FHIR R4" },
      { label: "Audit Resolution", value: "Millisecond Logging" },
      { label: "Encryption", value: "TLS 1.3 / HIPAA Compliant" },
    ],
    workingMechanism:
      "When pharmacy pharmacists package a medication order, a delivery mission is triggered automatically. Destination ward charge nurses receive arrival notifications upon arrival.",
  },
  {
    id: "antimicrobial-shell",
    number: "06",
    title: "Cleanroom Antimicrobial Chassis",
    subtitle: "Infection Control & Easy Sanitation",
    icon: Sparkles,
    tag: "Hygiene Architecture",
    description:
      "Constructed with medical-grade antimicrobial ABS polymer housing sealed against disinfectant ingress. Surfaces withstand daily wipe-downs with hospital-grade quaternary ammonium and bleach solutions.",
    subComponents: [
      "IP54 ingress protection against spills and disinfectant wipes",
      "Non-porous, smooth exterior eliminating dust traps and biofilm buildup",
      "Optional internal UV-C germicidal sanitation cycle between mission dispatches",
    ],
    keySpecs: [
      { label: "Cleanroom Standard", value: "ISO Class 6 Compatible" },
      { label: "Ingress Rating", value: "IP54 Fluid Sealed" },
      { label: "Sanitizer Tolerance", value: "Bleach / Quat / IPA" },
    ],
    workingMechanism:
      "Enables continuous operation in sensitive environments like bone marrow transplant units, surgical preparation corridors, and oncology pavilions without biocontamination risk.",
  },
];

export function HospitalOverview() {
  const [activeComponentId, setActiveComponentId] = useState<string>("secure-lockers");

  const activeComponent =
    HOSPITAL_COMPONENTS.find((c) => c.id === activeComponentId) || HOSPITAL_COMPONENTS[1];
  const ActiveIcon = activeComponent.icon;

  return (
    <section className="relative bg-white text-slate-900 py-16 sm:py-24 px-4 lg:px-8 border-b border-slate-200">
      <div className="relative mx-auto max-w-[1440px]">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider text-[#155EEF] mb-4">
            <Zap size={13} className="text-[#155EEF]" />
            <span>Integrated Clinical Hardware &amp; Software</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-slate-900 leading-tight">
            How The Hospital Delivery Robot <br />
            <span className="text-[#155EEF]">Functions as a Clinical Assistant</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Engineered exclusively for active healthcare facilities, the INDUS Hospital Delivery
            Robot coordinates silent mobility, certified patient safety, encrypted chain of
            custody, and autonomous multi-floor transit.
          </p>
        </div>

        {/* 6 Components Interactive Selector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Component List */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            {HOSPITAL_COMPONENTS.map((comp) => {
              const Icon = comp.icon;
              const isSelected = comp.id === activeComponentId;

              return (
                <button
                  key={comp.id}
                  onClick={() => setActiveComponentId(comp.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-start gap-3.5 cursor-pointer ${
                    isSelected
                      ? "border-[#155EEF] bg-blue-50/70 shadow-sm ring-1 ring-[#155EEF]"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70"
                  }`}
                >
                  <div
                    className={`size-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? "bg-[#155EEF] text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <Icon size={20} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                        {comp.number} · {comp.tag}
                      </span>
                      {isSelected && (
                        <span className="size-2 rounded-full bg-[#155EEF] shrink-0" />
                      )}
                    </div>
                    <div className="text-sm font-bold text-slate-900 truncate">
                      {comp.title}
                    </div>
                    <div className="text-xs text-slate-500 truncate mt-0.5">
                      {comp.subtitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Deep-Dive Component Inspector */}
          <div className="lg:col-span-7 bg-slate-900 rounded-2xl border border-slate-800 text-white p-6 sm:p-8 lg:p-10 shadow-xl">
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-cyan-400">
                  <ActiveIcon size={24} />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                    Subsystem {activeComponent.number} // {activeComponent.tag}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    {activeComponent.title}
                  </h3>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-mono text-emerald-400">
                <CheckCircle2 size={13} />
                <span>Hospital Validated</span>
              </span>
            </div>

            {/* Description */}
            <p className="mt-6 text-sm sm:text-base text-slate-300 leading-relaxed">
              {activeComponent.description}
            </p>

            {/* Sub-Components Checklist */}
            <div className="mt-6">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-3">
                Core Medical Engineering Modules
              </h4>
              <div className="space-y-2">
                {activeComponent.subComponents.map((sub, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80"
                  >
                    <CheckCircle2 size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                    <span>{sub}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Specs Matrix */}
            <div className="mt-6 pt-6 border-t border-slate-800">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-3">
                Clinical Operational Specifications
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {activeComponent.keySpecs.map((spec, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg bg-slate-950 p-3 border border-slate-800/80 text-center"
                  >
                    <div className="text-[11px] font-mono text-slate-400 uppercase">
                      {spec.label}
                    </div>
                    <div className="text-sm sm:text-base font-bold font-mono text-cyan-400 mt-1">
                      {spec.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* How it collaborates */}
            <div className="mt-6 rounded-xl bg-gradient-to-r from-blue-950/40 via-slate-950/60 to-blue-950/40 p-4 border border-blue-900/40">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-1">
                Clinical Workflow Execution
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeComponent.workingMechanism}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
