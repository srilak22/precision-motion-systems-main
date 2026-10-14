import React, { useState, useRef } from "react";
import type { BookingFormData } from "@/types/consultation";
import type { BookingResponse } from "@/lib/consultation-api";
import { submitConsultationBooking } from "@/lib/consultation-api";
import { IndustryRobotStep } from "./IndustryRobotStep";
import { TechnicalSpecsStep } from "./TechnicalSpecsStep";
import { CustomerInfoStep } from "./CustomerInfoStep";
import { ScheduleStep } from "./ScheduleStep";
import { ConfirmationStep } from "./ConfirmationStep";
import { trackDigitalPresence } from "@/trackDigitalPresence";
import { trackClarityEvent } from "@/analytics/clarity";
import {
  Factory,
  Wrench,
  UserCheck,
  CalendarCheck,
  CheckCircle2,
} from "lucide-react";

const INITIAL_FORM_DATA: BookingFormData = {
  // Step 1
  industry: "Automotive and automobile manufacturing",
  specificApplication: "Spot & Laser Welding (BIW)",
  robotCategory: "Welding robots",
  projectStage: "Planning",
  preferredSolution: "New installation",

  // Step 2
  projectDescription: "",
  materialHandled: "Sheet metal body stampings",
  payloadKg: "",
  reachMm: "",
  cycleTimeSec: "",
  operatingEnvironment: "Standard industrial factory",
  accuracyRequirement: "High precision (±0.05 mm)",
  productionShifts: "Two shifts (16 hrs/day)",
  existingEquipment: "",
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
  privacyConsent: false,

  // Step 4
  selectedDate: "",
  selectedSlot: "",
  timezone: "Asia/Kolkata",
};

const STEPS = [
  { id: 1, title: "Industry & Solution", shortTitle: "Industry", icon: Factory },
  { id: 2, title: "Technical Sizing", shortTitle: "Technical", icon: Wrench },
  { id: 3, title: "Company Profile", shortTitle: "Profile", icon: UserCheck },
  { id: 4, title: "Calendar Slot", shortTitle: "Schedule", icon: CalendarCheck },
  { id: 5, title: "Confirmed", shortTitle: "Confirmation", icon: CheckCircle2 },
];

export function ConsultationWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BookingFormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [bookingResult, setBookingResult] = useState<BookingResponse | null>(null);
  const wizardContainerRef = useRef<HTMLDivElement>(null);

  const scrollToWizardTop = () => {
    if (wizardContainerRef.current) {
      wizardContainerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const updateForm = (updates: Partial<BookingFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const goToStep = (stepNumber: number) => {
    setCurrentStep(stepNumber);
    scrollToWizardTop();
    trackDigitalPresence(
      "navigation",
      "Consultation Wizard Step Change",
      `Navigated to step ${stepNumber}`,
    );
    trackClarityEvent(`consultation_step_${stepNumber}`);
  };

  const handleNext = () => {
    if (currentStep < 4) {
      goToStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      trackDigitalPresence(
        "form_submit",
        "Robotics Consultation Booking",
        `Booking attempt for ${formData.companyName} (${formData.robotCategory})`,
      );

      const result = await submitConsultationBooking(formData);

      if (result.status === "success") {
        setBookingResult(result);
        setCurrentStep(5);
        scrollToWizardTop();

        trackDigitalPresence(
          "booking_complete",
          "Robotics Consultation Confirmed",
          `Confirmed booking ${result.bookingId}`,
        );
        trackClarityEvent("booking_complete");
        trackClarityEvent("consultation_confirmed");
      } else {
        const errorText = result.message || "Failed to confirm appointment. Please choose another slot.";
        trackDigitalPresence("lead_submit_failure", "Robotics Consultation", errorText);
        setSubmitError(errorText);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Booking submission error";
      trackDigitalPresence("lead_submit_failure", "Robotics Consultation", msg);
      setSubmitError(msg);
      scrollToWizardTop();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_DATA);
    setBookingResult(null);
    setCurrentStep(1);
    scrollToWizardTop();
  };

  return (
    <div ref={wizardContainerRef} className="w-full">
      {/* Multi-Step Progress Indicator */}
      <div className="mb-10 border border-border bg-card/60 p-4 sm:p-6">
        <div className="grid grid-cols-5 gap-2 sm:gap-4">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;

            return (
              <div
                key={step.id}
                className={`relative flex flex-col items-center text-center transition-all ${
                  isActive
                    ? "text-signal"
                    : isCompleted
                    ? "text-foreground"
                    : "text-muted-foreground/40"
                }`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-none border transition-all ${
                    isActive
                      ? "border-signal bg-signal text-signal-foreground font-bold shadow-[0_0_12px_rgba(245,158,11,0.25)]"
                      : isCompleted
                      ? "border-signal bg-signal/20 text-signal"
                      : "border-border/60 bg-muted/20"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 size={18} /> : <Icon size={18} />}
                </div>

                <div className="mt-2 hidden sm:block">
                  <span className="block text-[10px] font-bold uppercase tracking-wider">
                    Step {step.id}
                  </span>
                  <span
                    className={`block font-display text-xs font-bold uppercase truncate max-w-[110px] ${
                      isActive ? "text-foreground" : ""
                    }`}
                  >
                    {step.title}
                  </span>
                </div>

                <span className="mt-1 block sm:hidden text-[9px] font-bold uppercase truncate max-w-[55px]">
                  {step.shortTitle}
                </span>

                {/* Step Connector Line */}
                {step.id < STEPS.length && (
                  <div
                    className={`hidden lg:block absolute left-[calc(50%+25px)] top-5 w-[calc(100%-50px)] h-[2px] transition-all ${
                      isCompleted ? "bg-signal" : "bg-border/60"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step View Container */}
      <div className="border border-border bg-card p-6 sm:p-10 lg:p-12 shadow-xl">
        {currentStep === 1 && (
          <IndustryRobotStep
            formData={formData}
            updateForm={updateForm}
            onNext={handleNext}
          />
        )}

        {currentStep === 2 && (
          <TechnicalSpecsStep
            formData={formData}
            updateForm={updateForm}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {currentStep === 3 && (
          <CustomerInfoStep
            formData={formData}
            updateForm={updateForm}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {currentStep === 4 && (
          <ScheduleStep
            formData={formData}
            updateForm={updateForm}
            onSubmit={handleSubmit}
            onBack={handleBack}
            isSubmitting={isSubmitting}
            submitError={submitError}
          />
        )}

        {currentStep === 5 && bookingResult && (
          <ConfirmationStep
            formData={formData}
            bookingResult={bookingResult}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
}
