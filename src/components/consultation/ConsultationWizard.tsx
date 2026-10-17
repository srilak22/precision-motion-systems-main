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
  consultationPurpose: "Robot and Kinematic Sizing",

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

export interface ConsultationWizardProps {
  currentMode?: BookingMode;
  onModeChange?: (mode: BookingMode) => void;
  onOpenModeModal?: () => void;
}

export function ConsultationWizard({
  currentMode,
  onModeChange,
  onOpenModeModal,
}: ConsultationWizardProps = {}) {
  const [internalMode, setInternalMode] = useState<BookingMode>(currentMode || "quick");
  const mode = currentMode || internalMode;
  const [formData, setFormData] = useState<BookingFormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [bookingResult, setBookingResult] = useState<BookingResponse | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Sync mode if currentMode changes
  useEffect(() => {
    if (currentMode && currentMode !== internalMode) {
      setInternalMode(currentMode);
      setFormData((prev) => ({ ...prev, bookingMode: currentMode }));
    }
  }, [currentMode, internalMode]);

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
    setInternalMode(newMode);
    if (onModeChange) {
      onModeChange(newMode);
    }
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
    setInternalMode("quick");
    onModeChange?.("quick");
    scrollToTop();
  };

  return (
    <div
      ref={cardRef}
      className="bg-card rounded-md border border-border shadow-md p-6 sm:p-8 relative"
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
          {/* Segmented Mode Control Tabs - Phase 5 B */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Select Booking Mode
              </span>
              {onOpenModeModal && (
                <button
                  type="button"
                  onClick={onOpenModeModal}
                  className="text-[11px] font-semibold text-signal hover:text-signal/80 underline underline-offset-2 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Compare tracks</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 p-1 bg-muted/60 rounded-md border border-border">
              {/* Quick Consultation Tab */}
              <button
                type="button"
                onClick={() => handleModeChange("quick")}
                className={`flex flex-col items-center justify-center py-2.5 px-3 rounded text-center transition-all cursor-pointer ${
                  mode === "quick"
                    ? "bg-signal text-signal-foreground font-bold shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/60"
                }`}
                aria-pressed={mode === "quick"}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                  <Zap size={14} className={mode === "quick" ? "text-signal-foreground" : "text-signal"} />
                  <span>Quick Consultation</span>
                </div>
                <span className="text-[10px] opacity-80 font-normal mt-0.5">
                  Fast 60-second calendar booking
                </span>
              </button>

              {/* Detailed Project Review Tab */}
              <button
                type="button"
                onClick={() => handleModeChange("detailed")}
                className={`flex flex-col items-center justify-center py-2.5 px-3 rounded text-center transition-all cursor-pointer ${
                  mode === "detailed"
                    ? "bg-signal text-signal-foreground font-bold shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/60"
                }`}
                aria-pressed={mode === "detailed"}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                  <FileText size={14} className={mode === "detailed" ? "text-signal-foreground" : "text-signal"} />
                  <span>Detailed Project Review</span>
                </div>
                <span className="text-[10px] opacity-80 font-normal mt-0.5">
                  Complete kinematic sizing & specs
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
