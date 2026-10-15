import React, { useState, useRef, useEffect } from "react";
import type { BookingFormData, BookingMode } from "@/types/consultation";
import type { BookingResponse } from "@/lib/consultation-api";
import { submitConsultationBooking } from "@/lib/consultation-api";
import { QuickBookingForm } from "./QuickBookingForm";
import { DetailedConsultationForm } from "./DetailedConsultationForm";
import { ConsultationConfirmation } from "./ConsultationConfirmation";
import { trackDigitalPresence } from "@/trackDigitalPresence";
import { trackClarityEvent } from "@/analytics/clarity";
import { Zap, FileText, CheckCircle2 } from "lucide-react";

const INITIAL_FORM_DATA: BookingFormData = {
  bookingMode: "quick",
  consultationPurpose: "Kinematic Sizing & Robot Selection",

  // Step 1
  industry: "Automotive and automobile manufacturing",
  specificApplication: "Spot & Laser Welding (BIW)",
  robotCategory: "Articulated robotic arms",
  projectStage: "Planning",
  preferredSolution: "New installation",

  // Step 2
  manufacturingOrService: "Manufacturing",
  automationObjective: "Labor redeployment & workforce augmentation",
  currentProcess: "",
  productionVolume: "",
  projectDescription: "",
  materialHandled: "Sheet metal body stampings",
  payloadKg: "20",
  reachMm: "1650",
  cycleTimeSec: "12",
  operatingEnvironment: "Standard industrial factory",
  accuracyRequirement: "High precision (±0.05 mm)",
  productionShifts: "Two shifts (16 hrs/day)",
  existingEquipment: "Siemens S7-1500 / PROFINET",
  projectBudget: "$50,000 - $100,000",
  implementationTimeline: "1 - 3 months",

  // Step 3
  fullName: "",
  companyEmail: "",
  phoneNumber: "",
  companyName: "",
  jobTitle: "",
  country: "India",
  city: "Chennai",
  companyWebsite: "",
  consultationMode: "Google Meet (Online Video)",
  additionalComments: "",
  privacyConsent: true,

  // Step 4
  selectedDate: "",
  selectedSlot: "",
  timezone: "Asia/Kolkata",
  bookingMethod: "in_app",
};

export function ConsultationWizard() {
  const [mode, setMode] = useState<BookingMode>("quick");
  const [formData, setFormData] = useState<BookingFormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [bookingResult, setBookingResult] = useState<BookingResponse | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Track initial booking view
  useEffect(() => {
    trackDigitalPresence("booking_view", "Consultation Wizard", "Robotics booking funnel loaded");
    trackClarityEvent("booking_view");
  }, []);

  const scrollToTop = () => {
    if (cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const updateForm = (updates: Partial<BookingFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleModeChange = (newMode: BookingMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    updateForm({ bookingMode: newMode });
    setSubmitError(null);

    trackDigitalPresence("booking_mode_selected", "Consultation Mode Switch", `Switched to ${newMode}`);
    trackClarityEvent(`booking_mode_${newMode}`);
  };

  const handleFormStarted = () => {
    if (!hasStarted) {
      setHasStarted(true);
      trackDigitalPresence("booking_started", "Consultation Wizard Interaction", `Interaction started in ${mode} mode`);
      trackClarityEvent("booking_started");
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    trackDigitalPresence("booking_submitted", "Consultation Booking Submission", `Mode: ${mode}`);
    trackClarityEvent("booking_submitted");

    try {
      const payload: BookingFormData = {
        ...formData,
        bookingMode: mode,
      };

      const result = await submitConsultationBooking(payload);

      if (result.status === "success") {
        setBookingResult(result);
        setIsConfirmed(true);
        scrollToTop();

        trackDigitalPresence(
          "booking_confirmed",
          "Robotics Consultation Confirmed",
          `Confirmed booking reference ${result.bookingId}`,
        );
        trackClarityEvent("booking_confirmed");
      } else {
        const errorText = result.message || "Failed to confirm appointment. Please choose another slot.";
        trackDigitalPresence("booking_failed", "Robotics Consultation Error", errorText);
        trackClarityEvent("booking_failed");
        setSubmitError(errorText);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Appointment booking failed. Please try again.";
      trackDigitalPresence("booking_failed", "Robotics Consultation Network Error", msg);
      trackClarityEvent("booking_failed");
      setSubmitError(msg);
      scrollToTop();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_DATA);
    setBookingResult(null);
    setIsConfirmed(false);
    setSubmitError(null);
    setHasStarted(false);
    setMode("quick");
    scrollToTop();
  };

  return (
    <div
      ref={cardRef}
      className="bg-white rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-6 sm:p-8 relative"
    >
      {/* Honeypot anti-spam field */}
      <input
        type="text"
        name="_hp"
        value={formData._hp || ""}
        onChange={(e) => updateForm({ _hp: e.target.value })}
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      {/* CONFIRMED STATE */}
      {isConfirmed && bookingResult ? (
        <ConsultationConfirmation
          formData={formData}
          bookingResult={bookingResult}
          onReset={handleReset}
        />
      ) : (
        <div className="space-y-6">
          {/* Segmented Mode Control Tabs */}
          <div className="space-y-2">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Select Booking Mode
            </span>

            <div className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-xl border border-slate-200/70">
              {/* Quick Booking Tab */}
              <button
                type="button"
                onClick={() => handleModeChange("quick")}
                className={`flex items-center justify-center gap-2 py-3 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  mode === "quick"
                    ? "bg-[#0052FF] text-white shadow-md shadow-blue-500/25"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                }`}
              >
                <Zap size={15} className={mode === "quick" ? "text-amber-300" : "text-slate-400"} />
                <span>Quick Booking</span>
                <span
                  className={`hidden sm:inline-block text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                    mode === "quick" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
                  }`}
                >
                  60 Sec
                </span>
              </button>

              {/* Detailed Project Consultation Tab */}
              <button
                type="button"
                onClick={() => handleModeChange("detailed")}
                className={`flex items-center justify-center gap-2 py-3 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  mode === "detailed"
                    ? "bg-[#0052FF] text-white shadow-md shadow-blue-500/25"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                }`}
              >
                <FileText size={15} className={mode === "detailed" ? "text-blue-100" : "text-slate-400"} />
                <span>Detailed Project</span>
                <span
                  className={`hidden sm:inline-block text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                    mode === "detailed" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
                  }`}
                >
                  4 Steps
                </span>
              </button>
            </div>
          </div>

          {/* Form Mode Content */}
          {mode === "quick" ? (
            <QuickBookingForm
              formData={formData}
              updateForm={updateForm}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              submitError={submitError}
              onFormStarted={handleFormStarted}
            />
          ) : (
            <DetailedConsultationForm
              formData={formData}
              updateForm={updateForm}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              submitError={submitError}
              onFormStarted={handleFormStarted}
            />
          )}
        </div>
      )}
    </div>
  );
}
