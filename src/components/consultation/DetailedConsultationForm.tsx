import React, { useState } from "react";
import type { BookingFormData } from "@/types/consultation";
import { AppointmentSlotPicker } from "./AppointmentSlotPicker";
import {
  User,
  Mail,
  Phone,
  Building,
  Briefcase,
  Factory,
  Globe,
  Bot,
  Wrench,
  Gauge,
  Cpu,
  Video,
  Building2,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Edit3,
  Layers,
  Clock,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const ROBOT_CATEGORIES = [
  "Articulated robotic arms",
  "Collaborative robots (cobots)",
  "SCARA robots",
  "Cartesian and gantry robots",
  "Delta and pick-and-place robots",
  "Autonomous mobile robots (AMRs)",
  "Welding robots",
  "Palletizing and depalletizing robots",
  "Machine-tending robots",
  "Inspection and quality-control automation",
  "Custom robotic solutions",
  "Complete industrial automation systems",
] as const;

const INDUSTRIES = [
  "Automotive and automobile manufacturing",
  "Electronics and electrical manufacturing",
  "Food and beverage processing",
  "Pharmaceuticals and healthcare manufacturing",
  "Warehousing and logistics",
  "Packaging and material handling",
  "Metal fabrication and welding",
  "Aerospace and precision manufacturing",
  "General industrial automation",
  "Other industries",
] as const;

const AUTOMATION_OBJECTIVES = [
  "Labor redeployment & workforce augmentation",
  "Throughput acceleration & parts-per-hour boost",
  "Sub-millimeter repeatability & zero-defect quality",
  "Ergonomics & hazardous task elimination",
  "Greenfield production cell introduction",
  "Line bottleneck resolution & cycle-time compression",
] as const;

const OPERATING_ENVIRONMENTS = [
  "Standard industrial factory",
  "Cleanroom (ISO Class 3-8)",
  "High temperature / Foundry",
  "Washdown / Food Grade (IP67/IP69K)",
  "Hazardous / ATEX / Explosive",
  "Cold storage (-20°C to 4°C)",
  "Outdoor / Dusty environment",
] as const;

const ACCURACY_REQUIREMENTS = [
  "Ultra-precision (±0.02 mm or better)",
  "High precision (±0.05 mm)",
  "Standard precision (±0.1 mm - ±0.5 mm)",
  "Coarse handling (±1 mm or more)",
  "To be evaluated by INDUS engineers",
] as const;

const BUDGET_RANGES = [
  "< $25,000",
  "$25,000 - $50,000",
  "$50,000 - $100,000",
  "$100,000 - $250,000",
  "> $250,000",
  "Flexible / CapEx Budget in Review",
] as const;

const TIMELINES = [
  "Immediate (< 1 month)",
  "1 - 3 months",
  "3 - 6 months",
  "6 - 12 months",
  "Exploratory / Feasibility Study",
] as const;

interface DetailedConsultationFormProps {
  formData: BookingFormData;
  updateForm: (updates: Partial<BookingFormData>) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  submitError: string | null;
  onFormStarted?: () => void;
}

export function DetailedConsultationForm({
  formData,
  updateForm,
  onSubmit,
  isSubmitting,
  submitError,
  onFormStarted,
}: DetailedConsultationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [hasStarted, setHasStarted] = useState(false);

  const notifyStart = () => {
    if (!hasStarted) {
      setHasStarted(true);
      onFormStarted?.();
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Step 1 Validation
  const isStep1Valid = Boolean(
    formData.fullName.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.companyEmail.trim()) &&
    formData.phoneNumber.replace(/[^0-9]/g, "").length >= 7 &&
    formData.companyName.trim().length >= 2 &&
    formData.jobTitle.trim().length >= 2 &&
    formData.industry
  );

  // Step 2 Validation
  const isStep2Valid = Boolean(
    formData.robotCategory &&
    (formData.automationObjective || formData.projectDescription.trim().length >= 5)
  );

  // Step 3 Validation
  const isStep3Valid = Boolean(
    formData.consultationPurpose &&
    formData.selectedDate &&
    formData.selectedSlot
  );

  // Conditional logic helpers
  const isWelding = formData.robotCategory.toLowerCase().includes("welding");
  const isPalletizingOrHandling =
    formData.robotCategory.toLowerCase().includes("palletizing") ||
    formData.robotCategory.toLowerCase().includes("pick-and-place") ||
    formData.robotCategory.toLowerCase().includes("mobile") ||
    formData.robotCategory.toLowerCase().includes("amr");
  const requiresKinematicSizing =
    formData.robotCategory.toLowerCase().includes("arm") ||
    formData.robotCategory.toLowerCase().includes("scara") ||
    formData.robotCategory.toLowerCase().includes("cobot") ||
    formData.robotCategory.toLowerCase().includes("welding") ||
    formData.robotCategory.toLowerCase().includes("tending");

  const handleNext = () => {
    if (currentStep === 1 && !isStep1Valid) {
      setTouched({
        fullName: true,
        companyEmail: true,
        phoneNumber: true,
        companyName: true,
        jobTitle: true,
        industry: true,
      });
      return;
    }
    if (currentStep === 2 && !isStep2Valid) {
      setTouched({
        robotCategory: true,
        automationObjective: true,
      });
      return;
    }
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const STEPS = [
    { num: 1, label: "Business", short: "Business" },
    { num: 2, label: "Project & Sizing", short: "Project" },
    { num: 3, label: "Appointment", short: "Schedule" },
    { num: 4, label: "Review & Confirm", short: "Review" },
  ];

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="border-b border-slate-200 pb-5">
        <div className="grid grid-cols-4 gap-2">
          {STEPS.map((s) => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <button
                key={s.num}
                type="button"
                onClick={() => {
                  if (s.num < currentStep) setCurrentStep(s.num);
                }}
                disabled={s.num > currentStep}
                className={`flex flex-col text-left transition-all ${
                  isCurrent
                    ? "text-[#0052FF]"
                    : isCompleted
                    ? "text-emerald-700 cursor-pointer"
                    : "text-slate-400 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div
                    className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCurrent
                        ? "bg-[#0052FF] text-white shadow-sm ring-2 ring-[#0052FF]/30"
                        : isCompleted
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 size={14} className="text-emerald-700" /> : s.num}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">
                    Step 0{s.num}
                  </span>
                </div>
                <div
                  className={`h-1 w-full rounded-full transition-all ${
                    isCurrent
                      ? "bg-[#0052FF]"
                      : isCompleted
                      ? "bg-emerald-500"
                      : "bg-slate-200"
                  }`}
                />
                <span className="text-xs font-semibold mt-1.5 truncate">
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 1: BUSINESS PROFILE */}
      {currentStep === 1 && (
        <div className="space-y-5 animate-in fade-in-50 duration-200">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0052FF]">
              Step 01 / 04 · Organizational Stakeholder
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">
              Business & Representative Coordinates
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Provide your facility contact details for appointment confirmation and NDAs.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Anand Mahindra"
                  value={formData.fullName}
                  onChange={(e) => {
                    notifyStart();
                    updateForm({ fullName: e.target.value });
                  }}
                  onBlur={() => handleBlur("fullName")}
                  className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0052FF]/20 focus:border-[#0052FF]"
                />
              </div>
              {touched.fullName && !formData.fullName.trim() && (
                <p className="mt-1 text-[11px] text-red-500 font-medium">Full name is required</p>
              )}
            </div>

            {/* Business Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                Corporate Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  placeholder="name@enterprise.com"
                  value={formData.companyEmail}
                  onChange={(e) => {
                    notifyStart();
                    updateForm({ companyEmail: e.target.value });
                  }}
                  onBlur={() => handleBlur("companyEmail")}
                  className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0052FF]/20 focus:border-[#0052FF]"
                />
              </div>
              {touched.companyEmail && !formData.companyEmail.trim() && (
                <p className="mt-1 text-[11px] text-red-500 font-medium">Corporate email is required</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                Direct Phone / Mobile <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phoneNumber}
                  onChange={(e) => {
                    notifyStart();
                    updateForm({ phoneNumber: e.target.value });
                  }}
                  onBlur={() => handleBlur("phoneNumber")}
                  className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0052FF]/20 focus:border-[#0052FF]"
                />
              </div>
              {touched.phoneNumber && !formData.phoneNumber.trim() && (
                <p className="mt-1 text-[11px] text-red-500 font-medium">Direct phone number is required</p>
              )}
            </div>

            {/* Company / Plant Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                Company / Plant Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Bosch Packaging Solutions"
                  value={formData.companyName}
                  onChange={(e) => {
                    notifyStart();
                    updateForm({ companyName: e.target.value });
                  }}
                  onBlur={() => handleBlur("companyName")}
                  className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0052FF]/20 focus:border-[#0052FF]"
                />
              </div>
              {touched.companyName && !formData.companyName.trim() && (
                <p className="mt-1 text-[11px] text-red-500 font-medium">Company name is required</p>
              )}
            </div>

            {/* Designation / Job Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                Designation / Role <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Briefcase size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. VP Operations / Automation Lead"
                  value={formData.jobTitle}
                  onChange={(e) => {
                    notifyStart();
                    updateForm({ jobTitle: e.target.value });
                  }}
                  onBlur={() => handleBlur("jobTitle")}
                  className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0052FF]/20 focus:border-[#0052FF]"
                />
              </div>
              {touched.jobTitle && !formData.jobTitle.trim() && (
                <p className="mt-1 text-[11px] text-red-500 font-medium">Designation is required</p>
              )}
            </div>

            {/* Industry */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                Industry Sector <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Factory size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <select
                  value={formData.industry}
                  onChange={(e) => {
                    notifyStart();
                    updateForm({ industry: e.target.value as any });
                  }}
                  onBlur={() => handleBlur("industry")}
                  className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-8 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0052FF]/20 focus:border-[#0052FF] appearance-none cursor-pointer"
                >
                  <option value="">Select industry sector...</option>
                  {INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                  ▼
                </div>
              </div>
              {touched.industry && !formData.industry && (
                <p className="mt-1 text-[11px] text-red-500 font-medium">Please choose an industry</p>
              )}
            </div>
          </div>

          {/* Plant Location & Website */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                Facility Location (City, Country)
              </label>
              <div className="relative">
                <Globe size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Pune, India"
                  value={formData.city ? `${formData.city}, ${formData.country || "India"}` : ""}
                  onChange={(e) => {
                    notifyStart();
                    const parts = e.target.value.split(",");
                    updateForm({
                      city: parts[0]?.trim() || "",
                      country: parts[1]?.trim() || "India",
                    });
                  }}
                  className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0052FF]/20 focus:border-[#0052FF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                Company Website (Optional)
              </label>
              <input
                type="url"
                placeholder="https://company.com"
                value={formData.companyWebsite || ""}
                onChange={(e) => {
                  notifyStart();
                  updateForm({ companyWebsite: e.target.value });
                }}
                className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0052FF]/20 focus:border-[#0052FF]"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: PROJECT & KINEMATIC SIZING */}
      {currentStep === 2 && (
        <div className="space-y-5 animate-in fade-in-50 duration-200">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0052FF]">
              Step 02 / 04 · Robotics & Kinematics
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">
              Robotics Project Scope & Engineering Requirements
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Technical sizing parameters enable immediate reach simulation and cycle-time analysis.
            </p>
          </div>

          {/* Robot Category Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
              Robotic Arm / Automation Architecture <span className="text-red-500">*</span>
            </label>
            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
              {ROBOT_CATEGORIES.map((cat) => {
                const isSelected = formData.robotCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      notifyStart();
                      updateForm({ robotCategory: cat as any });
                    }}
                    className={`p-2.5 rounded-lg border text-left text-xs transition-all flex items-start gap-2 ${
                      isSelected
                        ? "border-[#0052FF] bg-blue-50 text-blue-900 font-bold ring-1 ring-[#0052FF]"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <Bot size={15} className={`shrink-0 mt-0.5 ${isSelected ? "text-[#0052FF]" : "text-slate-400"}`} />
                    <span className="line-clamp-2 leading-tight">{cat}</span>
                  </button>
                );
              })}
            </div>
            {touched.robotCategory && !formData.robotCategory && (
              <p className="mt-1 text-[11px] text-red-500 font-medium">Please select a robot category</p>
            )}
          </div>

          {/* Automation Objective */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
              Primary Automation Objective
            </label>
            <div className="grid gap-2 sm:grid-cols-2">
              {AUTOMATION_OBJECTIVES.map((obj) => {
                const isSelected = formData.automationObjective === obj;
                return (
                  <button
                    key={obj}
                    type="button"
                    onClick={() => {
                      notifyStart();
                      updateForm({ automationObjective: obj });
                    }}
                    className={`p-2.5 rounded-lg border text-left text-xs transition-all flex items-start gap-2 ${
                      isSelected
                        ? "border-[#0052FF] bg-blue-50 text-blue-900 font-bold ring-1 ring-[#0052FF]"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <Sparkles size={14} className={`shrink-0 mt-0.5 ${isSelected ? "text-[#0052FF]" : "text-slate-400"}`} />
                    <span className="leading-tight">{obj}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current Process / Manual Workflow & Target Cycle Time */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                Current Manual Process / Bottleneck
              </label>
              <textarea
                rows={3}
                placeholder="Describe workpiece handling, current operator cycle, or line pain point..."
                value={formData.currentProcess || ""}
                onChange={(e) => {
                  notifyStart();
                  updateForm({
                    currentProcess: e.target.value,
                    projectDescription: e.target.value,
                  });
                }}
                className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0052FF]/20 focus:border-[#0052FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                Target Production Rate / Cycle Time
              </label>
              <textarea
                rows={3}
                placeholder="e.g. 120 parts per hour (PPH), 8-second robot cycle time, 2 shifts/day..."
                value={formData.productionVolume || formData.cycleTimeSec ? `${formData.cycleTimeSec || ""} ${formData.productionVolume || ""}`.trim() : ""}
                onChange={(e) => {
                  notifyStart();
                  updateForm({
                    productionVolume: e.target.value,
                    cycleTimeSec: e.target.value.replace(/[^0-9.]/g, "").slice(0, 5),
                  });
                }}
                className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0052FF]/20 focus:border-[#0052FF]"
              />
            </div>
          </div>

          {/* CONDITIONAL TECHNICAL SIZING FIELDS */}
          {requiresKinematicSizing && (
            <div className="border border-blue-100 bg-blue-50/40 rounded-lg p-4 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#0052FF]">
                <Gauge size={15} />
                <span>Kinematic Sizing & Operating Envelope (Conditional)</span>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {/* Payload */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                    Workpiece + Tooling Payload (kg)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 15 kg"
                    value={formData.payloadKg || ""}
                    onChange={(e) => updateForm({ payloadKg: e.target.value })}
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:ring-1 focus:ring-[#0052FF]"
                  />
                </div>

                {/* Reach Radius */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                    Reach Radius Envelope (mm)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1400 mm"
                    value={formData.reachMm || ""}
                    onChange={(e) => updateForm({ reachMm: e.target.value })}
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:ring-1 focus:ring-[#0052FF]"
                  />
                </div>

                {/* Accuracy / Repeatability */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                    Repeatability Precision
                  </label>
                  <select
                    value={formData.accuracyRequirement || ""}
                    onChange={(e) => updateForm({ accuracyRequirement: e.target.value as any })}
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:ring-1 focus:ring-[#0052FF]"
                  >
                    <option value="">Select tolerance...</option>
                    {ACCURACY_REQUIREMENTS.map((acc) => (
                      <option key={acc} value={acc}>
                        {acc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Operating Environment */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                  Operating Environment & Ingress Protection
                </label>
                <select
                  value={formData.operatingEnvironment || ""}
                  onChange={(e) => updateForm({ operatingEnvironment: e.target.value as any })}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:ring-1 focus:ring-[#0052FF]"
                >
                  <option value="">Select environment (Washdown IP69K, Cleanroom, etc.)...</option>
                  {OPERATING_ENVIRONMENTS.map((env) => (
                    <option key={env} value={env}>
                      {env}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Conditional Welding Specs */}
          {isWelding && (
            <div className="border border-amber-200 bg-amber-50/50 rounded-lg p-4 space-y-3">
              <span className="text-xs font-bold uppercase text-amber-900 flex items-center gap-1.5">
                <Wrench size={14} className="text-amber-600" />
                <span>Welding Process Specification</span>
              </span>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Welding Process (e.g. MIG/MAG Pulse, TIG, Laser, BIW Spot)"
                  value={formData.weldingProcess || ""}
                  onChange={(e) => updateForm({ weldingProcess: e.target.value })}
                  className="w-full rounded-md border border-amber-200 bg-white px-3 py-2 text-sm text-slate-900"
                />
                <input
                  type="text"
                  placeholder="Workpiece Material & Thickness (e.g. Mild steel 3mm)"
                  value={formData.materialHandled || ""}
                  onChange={(e) => updateForm({ materialHandled: e.target.value })}
                  className="w-full rounded-md border border-amber-200 bg-white px-3 py-2 text-sm text-slate-900"
                />
              </div>
            </div>
          )}

          {/* Existing Integration & PLC Network */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                Existing Line PLC / Fieldbus
              </label>
              <input
                type="text"
                placeholder="Siemens S7-1500 / EtherCAT / PROFINET"
                value={formData.existingEquipment || ""}
                onChange={(e) => updateForm({ existingEquipment: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0052FF]/20 focus:border-[#0052FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                Budget Allocation (Optional)
              </label>
              <select
                value={formData.projectBudget || ""}
                onChange={(e) => updateForm({ projectBudget: e.target.value as any })}
                className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0052FF]/20 focus:border-[#0052FF]"
              >
                <option value="">Select CapEx range...</option>
                {BUDGET_RANGES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                Target Timeline (Optional)
              </label>
              <select
                value={formData.implementationTimeline || ""}
                onChange={(e) => updateForm({ implementationTimeline: e.target.value as any })}
                className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0052FF]/20 focus:border-[#0052FF]"
              >
                <option value="">Select implementation horizon...</option>
                {TIMELINES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: APPOINTMENT COORDINATES */}
      {currentStep === 3 && (
        <div className="space-y-5 animate-in fade-in-50 duration-200">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0052FF]">
              Step 03 / 04 · Calendar Verification
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">
              Select Your Preferred Consultation Date & Format
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Live Google Calendar synchronization ensures no double bookings and instant calendar invitations.
            </p>
          </div>

          {/* Consultation Purpose */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
              Primary Focus of Consultation Session <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. BIW Welding Cycle Time Review & Kinematic Sizing"
              value={formData.consultationPurpose}
              onChange={(e) => {
                notifyStart();
                updateForm({
                  consultationPurpose: e.target.value,
                  specificApplication: e.target.value,
                });
              }}
              className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0052FF]/20 focus:border-[#0052FF]"
            />
          </div>

          {/* Consultation Format: Virtual vs On-Site */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
              Consultation Format & Channel
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => updateForm({ consultationMode: "Google Meet (Online Video)" })}
                className={`p-3.5 rounded-lg border text-left transition-all flex items-start gap-3 ${
                  formData.consultationMode.includes("Google Meet") || !formData.consultationMode.includes("In-Person")
                    ? "border-[#0052FF] bg-blue-50/70 text-blue-900 ring-1 ring-[#0052FF]"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Video size={18} className="text-[#0052FF] shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs font-bold uppercase">Virtual Video Session (Google Meet)</span>
                  <span className="text-[11px] text-slate-500 leading-relaxed mt-0.5 block">
                    Live 3D CAD screen share, robot reach envelope sizing, dynamic cycle time analysis.
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => updateForm({ consultationMode: "In-Person Consultation (INDUS Center)" })}
                className={`p-3.5 rounded-lg border text-left transition-all flex items-start gap-3 ${
                  formData.consultationMode.includes("In-Person")
                    ? "border-[#0052FF] bg-blue-50/70 text-blue-900 ring-1 ring-[#0052FF]"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Building2 size={18} className="text-[#0052FF] shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs font-bold uppercase">On-Site Innovation Tour (Chennai Facility)</span>
                  <span className="text-[11px] text-slate-500 leading-relaxed mt-0.5 block">
                    Inspect operational articulated arms, cobots, and AMR demonstration cells at INDUS.
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Slot Picker Component */}
          <div className="pt-2">
            <AppointmentSlotPicker
              selectedDate={formData.selectedDate}
              selectedSlot={formData.selectedSlot}
              timezone={formData.timezone}
              onSelectDate={(d) => {
                notifyStart();
                updateForm({ selectedDate: d });
              }}
              onSelectSlot={(s) => {
                notifyStart();
                updateForm({ selectedSlot: s });
              }}
            />
          </div>

          {/* Additional Requirements */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
              Additional Technical Constraints / Questions
            </label>
            <textarea
              rows={2}
              placeholder="Any specific safety barriers, washdown IP ratings, or line clearance limits..."
              value={formData.additionalComments || ""}
              onChange={(e) => updateForm({ additionalComments: e.target.value })}
              className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0052FF]/20 focus:border-[#0052FF]"
            />
          </div>
        </div>
      )}

      {/* STEP 4: REVIEW & CONFIRM */}
      {currentStep === 4 && (
        <div className="space-y-5 animate-in fade-in-50 duration-200">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0052FF]">
              Step 04 / 04 · Review & Verification
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">
              Pre-Submission Technical Briefing Summary
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Verify your consultation details before we lock the slot in Google Calendar.
            </p>
          </div>

          {/* Section 1: Business Profile Card */}
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/70 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <User size={14} className="text-[#0052FF]" />
                <span>1. Business & Contact Profile</span>
              </span>
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="text-xs font-bold text-[#0052FF] hover:text-blue-700 flex items-center gap-1"
              >
                <Edit3 size={12} />
                <span>Edit</span>
              </button>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 text-xs">
              <div>
                <span className="text-slate-500 block">Name & Role:</span>
                <span className="font-semibold text-slate-900">{formData.fullName} ({formData.jobTitle || "Representative"})</span>
              </div>
              <div>
                <span className="text-slate-500 block">Company & Industry:</span>
                <span className="font-semibold text-slate-900">{formData.companyName} · {formData.industry}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Contact Coordinates:</span>
                <span className="font-mono text-slate-900">{formData.companyEmail} · {formData.phoneNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Location:</span>
                <span className="text-slate-900">{formData.city ? `${formData.city}, ${formData.country}` : "India"}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Robotics Scope Card */}
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/70 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Bot size={14} className="text-[#0052FF]" />
                <span>2. Robotics & Automation Parameters</span>
              </span>
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="text-xs font-bold text-[#0052FF] hover:text-blue-700 flex items-center gap-1"
              >
                <Edit3 size={12} />
                <span>Edit</span>
              </button>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 text-xs">
              <div>
                <span className="text-slate-500 block">Robot Category:</span>
                <span className="font-bold text-[#0052FF]">{formData.robotCategory || "Not specified"}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Objective:</span>
                <span className="font-medium text-slate-900">{formData.automationObjective || "Automation assessment"}</span>
              </div>
              {formData.payloadKg && (
                <div>
                  <span className="text-slate-500 block">Payload Target:</span>
                  <span className="font-semibold text-slate-900">{formData.payloadKg} kg</span>
                </div>
              )}
              {formData.reachMm && (
                <div>
                  <span className="text-slate-500 block">Reach Envelope:</span>
                  <span className="font-semibold text-slate-900">{formData.reachMm} mm</span>
                </div>
              )}
              {formData.accuracyRequirement && (
                <div>
                  <span className="text-slate-500 block">Accuracy / Tolerance:</span>
                  <span className="text-slate-900">{formData.accuracyRequirement}</span>
                </div>
              )}
              {formData.existingEquipment && (
                <div>
                  <span className="text-slate-500 block">Existing Fieldbus/PLC:</span>
                  <span className="text-slate-900">{formData.existingEquipment}</span>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Appointment Slot */}
          <div className="border-2 border-[#0052FF]/30 bg-blue-50/60 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between border-b border-blue-200/60 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                <Calendar size={14} className="text-[#0052FF]" />
                <span>3. Confirmed Appointment Slot</span>
              </span>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="text-xs font-bold text-[#0052FF] hover:text-blue-700 flex items-center gap-1"
              >
                <Edit3 size={12} />
                <span>Edit</span>
              </button>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 text-xs text-blue-950">
              <div>
                <span className="text-blue-700 block text-[11px] font-bold uppercase">Scheduled Date & Time:</span>
                <span className="font-bold text-sm text-slate-900 font-sans">
                  {formData.selectedDate} at {formData.selectedSlot} (Asia/Kolkata IST)
                </span>
              </div>
              <div>
                <span className="text-blue-700 block text-[11px] font-bold uppercase">Consultation Format:</span>
                <span className="font-medium text-slate-900 flex items-center gap-1 mt-0.5">
                  {formData.consultationMode.includes("In-Person") ? (
                    <>
                      <Building2 size={13} className="text-[#0052FF]" />
                      <span>On-Site Facility Visit (Chennai Tech Center)</span>
                    </>
                  ) : (
                    <>
                      <Video size={13} className="text-[#0052FF]" />
                      <span>Google Meet Virtual Call (CAD Screen Share)</span>
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Next Steps Explanation */}
          <div className="bg-slate-100 rounded-lg p-3.5 text-xs text-slate-600 space-y-1.5">
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px] block">
              What happens after submission:
            </span>
            <ul className="space-y-1 pl-4 list-disc text-[11px]">
              <li>Google Calendar calendar invitation dispatched directly to {formData.companyEmail}.</li>
              <li>INDUS robotics application engineer prepares preliminary kinematic reach envelope.</li>
              <li>Direct 30-minute technical review conducted under mutual non-disclosure (NDA).</li>
            </ul>
          </div>

          {/* Privacy Consent Checkbox */}
          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 select-none pt-2">
            <input
              type="checkbox"
              checked={formData.privacyConsent}
              onChange={(e) => updateForm({ privacyConsent: e.target.checked })}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#0052FF] focus:ring-[#0052FF]"
            />
            <span>
              I confirm the technical requirements above and consent to processing under INDUS standard NDA terms.
            </span>
          </label>
        </div>
      )}

      {/* Submit Error Banner */}
      {submitError && (
        <div className="flex items-center gap-2 border border-red-200 bg-red-50 p-3.5 rounded-lg text-xs text-red-800">
          <AlertCircle size={16} className="text-red-600 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      {/* Navigation & Controls */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        {currentStep > 1 ? (
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={isSubmitting}
            className="border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold uppercase tracking-wider"
          >
            <ArrowLeft size={14} className="mr-1.5" />
            Back
          </Button>
        ) : (
          <div />
        )}

        {currentStep < 4 ? (
          <Button
            type="button"
            onClick={handleNext}
            className="bg-[#0052FF] hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-lg shadow-md shadow-blue-500/20"
          >
            <span>Continue to Step 0{currentStep + 1}</span>
            <ArrowRight size={14} className="ml-1.5" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting || !formData.privacyConsent}
            className="bg-[#0052FF] hover:bg-blue-700 text-white text-xs font-extrabold uppercase tracking-widest px-8 py-3 rounded-lg shadow-lg shadow-blue-500/30 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                <span>Confirming Booking...</span>
              </>
            ) : (
              <>
                <span>Confirm & Reserve Consultation Slot</span>
                <ArrowRight size={15} className="ml-2" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
