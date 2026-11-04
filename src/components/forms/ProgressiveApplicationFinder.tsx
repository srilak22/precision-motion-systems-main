import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Factory,
  Cpu,
  Compass,
  Boxes,
  Truck,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  Building2,
  Download,
  RotateCcw,
  Layers,
  Wrench,
  Bot,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModals } from "@/components/modals/ModalContext";
import { trackDigitalPresence } from "@/trackDigitalPresence";
import { trackClarityEvent } from "@/analytics/clarity";

interface IndustryOption {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  tag: string;
}

const INDUSTRIES: IndustryOption[] = [
  {
    id: "automotive",
    name: "Automotive & EV Mobility",
    description: "Body welding, EV battery module stacking, powertrain machining & chassis kitting.",
    icon: Factory,
    tag: "HIGH CADENCE",
  },
  {
    id: "semiconductor",
    name: "Semiconductor & Electronics",
    description: "Sub-micron wafer handling, cleanroom SMT placement, PCB test & wire bonding.",
    icon: Cpu,
    tag: "SUB-MICRON",
  },
  {
    id: "aerospace",
    name: "Aerospace & Defence",
    description: "Titanium structure drilling, composite layup, robotic riveting & laser finishing.",
    icon: Compass,
    tag: "AS9100 / RIGID",
  },
  {
    id: "machining",
    name: "Metal Fabrication & CNC",
    description: "Multi-spindle machine tending, heavy robotic welding & automated press feeding.",
    icon: Wrench,
    tag: "HEAVY DUTY",
  },
  {
    id: "logistics",
    name: "Warehousing & Logistics",
    description: "Autonomous AMRs, high-speed carton sortation, mixed palletizing & ASRS.",
    icon: Truck,
    tag: "VDA 5050 AMR",
  },
  {
    id: "packaging",
    name: "Food & Clean Packaging",
    description: "High-speed delta pick & place, sterile carton packing, hygienic stainless arms.",
    icon: Boxes,
    tag: "IP69K HYGIENIC",
  },
];

const ENVIRONMENT_CONSTRAINTS = [
  { id: "washdown", label: "IP65 / IP67 Washdown Proof", desc: "Sealed enclosures for direct water and swarf ingress" },
  { id: "cleanroom", label: "Cleanroom Certified (ISO Class 1-4)", desc: "Zero particle shedding, stainless seals & vacuum exhaust" },
  { id: "atex", label: "Explosion Proof (ATEX / IECEx Zone 1)", desc: "Intrinsically safe motors for flammable paint or solvent vapors" },
  { id: "high-shock", label: "High-Vibration & Heavy Shock Load", desc: "Cycloidal reducers rated for sudden emergency stop deceleration" },
  { id: "sub-micron", label: "Sub-Millimeter Guidance (±0.015 mm)", desc: "Optical glass scale feedback and real-time laser seam tracking" },
  { id: "collaborative", label: "Collaborative Safety (ISO 13849 PL e)", desc: "Dual-channel torque sensors with Safe Operating Stop (SOS)" },
];

export function ProgressiveApplicationFinder() {
  const { openModal } = useModals();

  // Wizard state: 1 (Industry), 2 (Kinematics), 3 (Environment), 4 (Email Gate), 5 (Results)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form selections
  const [selectedIndustry, setSelectedIndustry] = useState<string>("automotive");
  const [payloadKg, setPayloadKg] = useState<number>(50);
  const [reachMm, setReachMm] = useState<number>(1800);
  const [cycleTimeSec, setCycleTimeSec] = useState<number>(12);
  const [selectedConstraints, setSelectedConstraints] = useState<string[]>(["washdown"]);

  // Lead Gen Gate state
  const [workEmail, setWorkEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [unlockedResults, setUnlockedResults] = useState(false);

  const toggleConstraint = (id: string) => {
    setSelectedConstraints((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleSelectIndustry = (id: string) => {
    setSelectedIndustry(id);
    trackDigitalPresence("click", `Wizard Industry Select: ${id}`, "/application-finder");
    trackClarityEvent(`wizard_industry_${id}`);
    setCurrentStep(2);
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workEmail.trim()) return;

    setIsSubmitting(true);
    trackDigitalPresence("submit", `Application Finder Sizing Gate: ${workEmail}`, "/application-finder");
    trackClarityEvent("wizard_lead_gate_submitted");

    // Simulate instant deterministic calculation handshake
    setTimeout(() => {
      setIsSubmitting(false);
      setUnlockedResults(true);
      setCurrentStep(5);
    }, 600);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setUnlockedResults(false);
  };

  const selectedIndustryObj = INDUSTRIES.find((i) => i.id === selectedIndustry) || INDUSTRIES[0];

  return (
    <div className="w-full rounded-2xl border border-slate-200/90 bg-white shadow-sm overflow-hidden text-slate-900">
      {/* Wizard Progress Stepper Header */}
      <div className="bg-[#F8FAFC] border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1D4ED8]">
            PROGRESSIVE SIZING CALCULATOR // ISO 9283 METHODOLOGY
          </span>
          <div className="text-sm font-bold text-slate-900 font-mono mt-0.5">
            Step {Math.min(currentStep, 4)} of 4:{" "}
            {currentStep === 1 && "Select Industry Sector"}
            {currentStep === 2 && "Input Kinematic Requirements"}
            {currentStep === 3 && "Environmental & Ingress Constraints"}
            {currentStep >= 4 && "Architecture Calculation & CAD Package"}
          </div>
        </div>

        {/* Stepper Progress Bar */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((step) => {
            const isCompleted = currentStep > step || unlockedResults;
            const isCurrent = currentStep === step && !unlockedResults;

            return (
              <div key={step} className="flex items-center gap-1.5">
                <div
                  className={`size-7 rounded-full text-xs font-mono font-bold flex items-center justify-center transition-all ${
                    isCompleted
                      ? "bg-emerald-600 text-white"
                      : isCurrent
                        ? "bg-[#1D4ED8] text-white ring-2 ring-blue-200"
                        : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 size={14} /> : step}
                </div>
                {step < 4 && <div className="w-4 sm:w-8 h-0.5 bg-slate-200" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Multi-Step Form Stage */}
      <div className="p-6 sm:p-8 lg:p-10 min-h-[460px] flex flex-col justify-between">
        <AnimatePresence mode="wait">
          {/* =========================================================================
              STEP 1: INDUSTRY SELECTION (CSS Grid Cards)
             ========================================================================= */}
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  1. Which Manufacturing Sector Are You Automating?
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-600">
                  Select your industrial domain to calibrate initial joint inertia profiles, cycle cadences, and standard fieldbuses.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {INDUSTRIES.map((ind) => {
                  const Icon = ind.icon;
                  const isSelected = selectedIndustry === ind.id;

                  return (
                    <div
                      key={ind.id}
                      onClick={() => handleSelectIndustry(ind.id)}
                      className={`group relative p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "bg-blue-50/70 border-[#1D4ED8] ring-2 ring-blue-500/20 shadow-md"
                          : "bg-white border-slate-200 hover:border-blue-400 hover:shadow-md hover:-translate-y-0.5"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-[#1D4ED8] flex items-center justify-center group-hover:scale-105 transition-transform shadow-2xs">
                            <Icon size={20} />
                          </div>
                          <span className="text-[9px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-blue-100/70 text-[#1D4ED8]">
                            {ind.tag}
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-slate-900 group-hover:text-[#1D4ED8] transition-colors">
                          {ind.name}
                        </h4>
                        <p className="mt-1.5 text-xs text-slate-600 leading-relaxed font-normal">
                          {ind.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono font-bold text-[#1D4ED8]">
                        <span>Select Sector</span>
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* =========================================================================
              STEP 2: KINEMATIC REQUIREMENTS (Interactive Range Sliders)
             ========================================================================= */}
          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-blue-50 text-[10px] font-mono font-bold text-[#1D4ED8] uppercase mb-2">
                  <span>Sector: {selectedIndustryObj.name}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  2. Define Your Target Kinematic Envelope
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-600">
                  Slide or enter your end-of-arm tooling load, radial workcell reach, and target cycle takt.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Payload Slider */}
                <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200/90 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono font-bold text-slate-500 uppercase block">
                        TARGET PAYLOAD (EOAT + PART)
                      </span>
                      <span className="text-xs text-slate-500">Including gripper &amp; maximum workpiece mass</span>
                    </div>
                    <div className="text-2xl font-extrabold font-mono text-[#1D4ED8] bg-white px-3 py-1 rounded-xl border border-blue-200 shadow-2xs">
                      {payloadKg} kg
                    </div>
                  </div>

                  <input
                    type="range"
                    min="5"
                    max="500"
                    step="5"
                    value={payloadKg}
                    onChange={(e) => setPayloadKg(Number(e.target.value))}
                    className="w-full accent-[#1D4ED8] cursor-pointer h-2 bg-slate-200 rounded-lg"
                  />

                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>5 kg (Light SMT)</span>
                    <span>150 kg (EV Battery)</span>
                    <span>500 kg (Heavy Block)</span>
                  </div>
                </div>

                {/* Reach Slider */}
                <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200/90 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono font-bold text-slate-500 uppercase block">
                        REQUIRED RADIAL REACH
                      </span>
                      <span className="text-xs text-slate-500">Maximum spherical workcell radius from base</span>
                    </div>
                    <div className="text-2xl font-extrabold font-mono text-[#1D4ED8] bg-white px-3 py-1 rounded-xl border border-blue-200 shadow-2xs">
                      {reachMm} mm
                    </div>
                  </div>

                  <input
                    type="range"
                    min="500"
                    max="3500"
                    step="50"
                    value={reachMm}
                    onChange={(e) => setReachMm(Number(e.target.value))}
                    className="w-full accent-[#1D4ED8] cursor-pointer h-2 bg-slate-200 rounded-lg"
                  />

                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>500 mm (Bench SCARA)</span>
                    <span>2000 mm (Standard 6-Axis)</span>
                    <span>3500 mm (Long Track Gantry)</span>
                  </div>
                </div>
              </div>

              {/* Navigation Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                  className="font-mono text-xs font-bold"
                >
                  <ArrowLeft size={14} className="mr-1.5" /> Back to Sectors
                </Button>

                <Button
                  onClick={() => setCurrentStep(3)}
                  className="bg-[#1D4ED8] hover:bg-[#155EEF] text-white font-mono text-xs font-bold px-6 shadow-sm cursor-pointer"
                >
                  <span>Next: Environment Constraints</span>
                  <ArrowRight size={14} className="ml-1.5" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* =========================================================================
              STEP 3: ENVIRONMENT CONSTRAINTS (Selectable Toggle Pills)
             ========================================================================= */}
          {currentStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  3. Select Environmental &amp; Ingress Constraints
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-600">
                  Select all that apply to calibrate casting coatings, seal gaskets, and safety interlocks.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {ENVIRONMENT_CONSTRAINTS.map((item) => {
                  const isChecked = selectedConstraints.includes(item.id);

                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleConstraint(item.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isChecked
                          ? "bg-blue-50/80 border-[#1D4ED8] text-slate-900 ring-1 ring-[#1D4ED8]"
                          : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="font-bold text-xs leading-snug">{item.label}</span>
                        <div
                          className={`size-4 rounded border flex items-center justify-center shrink-0 mt-0.5 ${
                            isChecked
                              ? "bg-[#1D4ED8] border-[#1D4ED8] text-white"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {isChecked && <CheckCircle2 size={12} />}
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-normal">{item.desc}</p>
                    </div>
                  );
                })}
              </div>

              {/* Navigation Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(2)}
                  className="font-mono text-xs font-bold"
                >
                  <ArrowLeft size={14} className="mr-1.5" /> Back to Kinematics
                </Button>

                <Button
                  onClick={() => setCurrentStep(4)}
                  className="bg-[#1D4ED8] hover:bg-[#155EEF] text-white font-mono text-xs font-bold px-6 shadow-sm cursor-pointer"
                >
                  <span>Next: Calculate Architecture</span>
                  <ArrowRight size={14} className="ml-1.5" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* =========================================================================
              STEP 4: LEAD GENERATION GATE (B2B Email Form)
             ========================================================================= */}
          {currentStep === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="max-w-2xl mx-auto py-4 text-center space-y-6"
            >
              <div className="size-14 rounded-2xl bg-blue-50 border border-blue-200 text-[#1D4ED8] mx-auto flex items-center justify-center shadow-xs">
                <Sparkles size={28} />
              </div>

              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#1D4ED8] bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
                  CALCULATION COMPLETE: 3 MATCHING ARCHITECTURES FOUND
                </span>
                <h3 className="mt-4 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  We&apos;ve calculated 3 optimal kinematic architectures for your parameters.
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                  Enter your work email to view full kinematic sizing results, motor-reducer pairings, cycle takt curves, and download 3D STEP space-claim assemblies.
                </p>
              </div>

              {/* Lead Capture Card */}
              <form onSubmit={handleLeadSubmit} className="p-6 sm:p-8 rounded-2xl bg-[#F8FAFC] border border-slate-200/90 shadow-sm text-left space-y-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">
                    Corporate Work Email <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="engineer@company.com"
                      value={workEmail}
                      onChange={(e) => setWorkEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1D4ED8] focus:ring-1 focus:ring-[#1D4ED8]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">
                    Company / Facility Name
                  </label>
                  <div className="relative">
                    <Building2 size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g. Continental Automation Plant #4"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1D4ED8] focus:ring-1 focus:ring-[#1D4ED8]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 rounded-xl bg-[#1D4ED8] hover:bg-[#155EEF] text-white font-mono text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>Calculating Kinematics...</span>
                    ) : (
                      <>
                        <span>View Results &amp; Access CAD Models</span>
                        <ArrowRight size={15} />
                      </>
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-slate-500 pt-1">
                  <Lock size={12} className="text-slate-400" />
                  <span>Confidential engineering submission · Governed by bilateral NDA</span>
                </div>
              </form>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="font-mono text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  ← Edit environmental constraints
                </button>
              </div>
            </motion.div>
          )}

          {/* =========================================================================
              STEP 5: UNLOCKED SIZING ARCHITECTURES (Results View)
             ========================================================================= */}
          {currentStep === 5 && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                    ✓ FEASIBILITY VALIDATED FOR {workEmail || "YOUR SPECIFICATION"}
                  </span>
                  <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Recommended Kinematic Workcells ({selectedIndustryObj.name})
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-slate-600">
                    Calculated for {payloadKg}kg Payload, {reachMm}mm Reach, and {selectedConstraints.length} environmental ingress conditions.
                  </p>
                </div>

                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="font-mono text-xs font-bold self-start sm:self-auto"
                >
                  <RotateCcw size={13} className="mr-1.5" /> Recalculate
                </Button>
              </div>

              {/* 3 Sizing Architecture Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Architecture 1 */}
                <div className="rounded-2xl border border-blue-200 bg-white p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-[#1D4ED8]" />
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1D4ED8] bg-blue-50 px-2 py-0.5 rounded">
                      PRIMARY RECOMMENDATION
                    </span>
                    <h4 className="mt-3 text-lg font-bold text-slate-900 font-display">
                      INDUS-ARM-6AX-{Math.round(reachMm / 100) * 100}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Rigid 6-Axis Articulated Arm with dual-counterbalance cycloidal wrist.
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Payload Capacity:</span>
                        <span className="font-bold text-[#1D4ED8]">{Math.max(payloadKg + 20, 60)} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Repeatability:</span>
                        <span className="font-bold text-slate-900">±0.02 mm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Fieldbus:</span>
                        <span className="font-bold text-slate-900">EtherCAT / PROFINET</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <Button
                      onClick={() =>
                        openModal("engineer", {
                          initialMessage: `Application Sizing Request: Architecture INDUS-ARM-6AX-${reachMm} for ${workEmail}`,
                        })
                      }
                      className="w-full bg-[#1D4ED8] hover:bg-[#155EEF] text-white font-mono text-xs font-bold"
                    >
                      <Download size={13} className="mr-1.5" /> Get CAD &amp; Sizing PDF
                    </Button>
                  </div>
                </div>

                {/* Architecture 2 */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      HIGH-STROKE ALTERNATIVE
                    </span>
                    <h4 className="mt-3 text-lg font-bold text-slate-900 font-display">
                      INDUS-7TH-GANTRY-{reachMm}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Articulated manipulator mounted to dynamic linear servo track rail.
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Payload Capacity:</span>
                        <span className="font-bold text-slate-900">{payloadKg + 50} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Track Stroke:</span>
                        <span className="font-bold text-slate-900">Up to 18 meters</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Repeatability:</span>
                        <span className="font-bold text-slate-900">±0.025 mm</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <Button
                      variant="outline"
                      onClick={() =>
                        openModal("engineer", {
                          initialMessage: `Application Sizing Request: 7th-Axis Gantry for ${workEmail}`,
                        })
                      }
                      className="w-full font-mono text-xs font-bold"
                    >
                      <Download size={13} className="mr-1.5" /> Request Quotation
                    </Button>
                  </div>
                </div>

                {/* Architecture 3 */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      MOBILE AUTONOMY
                    </span>
                    <h4 className="mt-3 text-lg font-bold text-slate-900 font-display">
                      INDUS-AMR-HYBRID-{payloadKg * 2}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Autonomous Mobile Platform with synchronized manipulator top-module.
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Fleet Protocol:</span>
                        <span className="font-bold text-slate-900">VDA 5050 / ROS2</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">LiDAR Safety:</span>
                        <span className="font-bold text-emerald-600">Dual SIL 2 PL d</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Transit Velocity:</span>
                        <span className="font-bold text-slate-900">1.8 m/s</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <Button
                      variant="outline"
                      onClick={() =>
                        openModal("engineer", {
                          initialMessage: `Application Sizing Request: AMR Hybrid for ${workEmail}`,
                        })
                      }
                      className="w-full font-mono text-xs font-bold"
                    >
                      <Download size={13} className="mr-1.5" /> Consult Engineering
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
