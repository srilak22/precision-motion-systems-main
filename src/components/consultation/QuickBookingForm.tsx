import React, { useState } from "react";
import type { BookingFormData } from "@/types/consultation";
import { AppointmentSlotPicker } from "./AppointmentSlotPicker";
import {
  User,
  Mail,
  Phone,
  Building,
  Factory,
  Target,
  ArrowRight,
  Loader2,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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

const CONSULTATION_PURPOSES = [
  "Robot and Kinematic Sizing",
  "Cycle-Time and Throughput Feasibility",
  "PLC and Industrial Fieldbus Integration",
  "CAPEX and Payback Evaluation",
  "Greenfield Automation",
  "Existing Robot Retrofit",
  "Vision and Palletizing",
  "Project Bid or Tender Review",
  "On-Site Technical Inspection",
  "General Engineering Consultation",
] as const;

interface QuickBookingFormProps {
  formData: BookingFormData;
  updateForm: (updates: Partial<BookingFormData>) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  submitError: string | null;
  onFormStarted?: () => void;
}

export function QuickBookingForm({
  formData,
  updateForm,
  onSubmit,
  isSubmitting,
  submitError,
  onFormStarted,
}: QuickBookingFormProps) {
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

  // Inline Validation
  interface QuickBookingErrors {
    fullName?: string;
    companyEmail?: string;
    phoneNumber?: string;
    companyName?: string;
    industry?: string;
    consultationPurpose?: string;
    selectedDate?: string;
    selectedSlot?: string;
    privacyConsent?: string;
  }
  const errors: QuickBookingErrors = {};
  if (!formData.fullName.trim()) {
    errors.fullName = "Full name is required";
  } else if (formData.fullName.trim().length < 2) {
    errors.fullName = "Full name must be at least 2 characters";
  }

  if (!formData.companyEmail.trim()) {
    errors.companyEmail = "Business email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.companyEmail.trim())) {
    errors.companyEmail = "Please enter a valid business email address";
  }

  if (!formData.phoneNumber.trim()) {
    errors.phoneNumber = "Phone number is required";
  } else if (formData.phoneNumber.replace(/[^0-9]/g, "").length < 7) {
    errors.phoneNumber = "Please enter a valid contact phone number with country code";
  }

  if (!formData.companyName.trim()) {
    errors.companyName = "Company or facility name is required";
  }

  if (!formData.industry) {
    errors.industry = "Please select your primary industry";
  }

  if (!formData.consultationPurpose) {
    errors.consultationPurpose = "Please select your primary consultation purpose";
  }

  if (!formData.selectedDate) {
    errors.selectedDate = "Please choose a preferred consultation date";
  }

  if (!formData.selectedSlot) {
    errors.selectedSlot = "Please choose an available appointment time slot";
  }

  if (!formData.privacyConsent) {
    errors.privacyConsent = "Please agree to data processing under our NDA policy";
  }

  const isValid = Object.keys(errors).length === 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      fullName: true,
      companyEmail: true,
      phoneNumber: true,
      companyName: true,
      industry: true,
      consultationPurpose: true,
      selectedDate: true,
      selectedSlot: true,
      privacyConsent: true,
    });

    if (isValid && !isSubmitting) {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Value Banner */}
      <div className="bg-signal/10 border border-signal/25 rounded-md p-3.5 flex items-center justify-between gap-3 text-xs text-foreground">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-signal shrink-0" />
          <span>
            <strong>Direct Applications Desk:</strong> 30-min technical review synced with Google Calendar. Zero sales gatekeeping.
          </span>
        </div>
        <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider text-signal bg-signal/15 px-2 py-0.5 rounded">
          Fast Track
        </span>
      </div>

      {/* Grid: 2 Columns for Contact Fields */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
            Full Name <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              name="fullName"
              placeholder="e.g. Rajesh Sharma"
              value={formData.fullName}
              onChange={(e) => {
                notifyStart();
                updateForm({ fullName: e.target.value });
              }}
              onBlur={() => handleBlur("fullName")}
              className={`w-full rounded-md border bg-background pl-10 pr-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all ${
                touched.fullName && errors.fullName
                  ? "border-destructive focus:ring-destructive/30"
                  : "border-border hover:border-signal/50 focus:border-signal focus:ring-signal/20"
              }`}
            />
          </div>
          {touched.fullName && errors.fullName && (
            <p className="mt-1 text-[11px] text-destructive font-medium">{errors.fullName}</p>
          )}
        </div>

        {/* Business Email */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
            Business Email <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="email"
              name="companyEmail"
              placeholder="name@company.com"
              value={formData.companyEmail}
              onChange={(e) => {
                notifyStart();
                updateForm({ companyEmail: e.target.value });
              }}
              onBlur={() => handleBlur("companyEmail")}
              className={`w-full rounded-md border bg-background pl-10 pr-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all ${
                touched.companyEmail && errors.companyEmail
                  ? "border-destructive focus:ring-destructive/30"
                  : "border-border hover:border-signal/50 focus:border-signal focus:ring-signal/20"
              }`}
            />
          </div>
          {touched.companyEmail && errors.companyEmail && (
            <p className="mt-1 text-[11px] text-destructive font-medium">{errors.companyEmail}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
            Phone Number <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="tel"
              name="phoneNumber"
              placeholder="+91 98765 43210"
              value={formData.phoneNumber}
              onChange={(e) => {
                notifyStart();
                updateForm({ phoneNumber: e.target.value });
              }}
              onBlur={() => handleBlur("phoneNumber")}
              className={`w-full rounded-md border bg-background pl-10 pr-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all ${
                touched.phoneNumber && errors.phoneNumber
                  ? "border-destructive focus:ring-destructive/30"
                  : "border-border hover:border-signal/50 focus:border-signal focus:ring-signal/20"
              }`}
            />
          </div>
          {touched.phoneNumber && errors.phoneNumber ? (
            <p className="mt-1 text-[11px] text-destructive font-medium">{errors.phoneNumber}</p>
          ) : (
            <p className="mt-1 text-[10px] text-muted-foreground">Include country code (e.g. +91, +1, +49)</p>
          )}
        </div>

        {/* Company Name */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
            Company Name <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Building size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              name="companyName"
              placeholder="e.g. Tata Motors / Foxconn India"
              value={formData.companyName}
              onChange={(e) => {
                notifyStart();
                updateForm({ companyName: e.target.value });
              }}
              onBlur={() => handleBlur("companyName")}
              className={`w-full rounded-md border bg-background pl-10 pr-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all ${
                touched.companyName && errors.companyName
                  ? "border-destructive focus:ring-destructive/30"
                  : "border-border hover:border-signal/50 focus:border-signal focus:ring-signal/20"
              }`}
            />
          </div>
          {touched.companyName && errors.companyName && (
            <p className="mt-1 text-[11px] text-destructive font-medium">{errors.companyName}</p>
          )}
        </div>
      </div>

      {/* Industry Dropdown */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
          Industry Sector <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <Factory size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <select
            name="industry"
            value={formData.industry}
            onChange={(e) => {
              notifyStart();
              updateForm({ industry: e.target.value as any });
            }}
            onBlur={() => handleBlur("industry")}
            className={`w-full rounded-md border bg-background pl-10 pr-8 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 transition-all appearance-none cursor-pointer ${
              touched.industry && errors.industry
                ? "border-destructive focus:ring-destructive/30"
                : "border-border hover:border-signal/50 focus:border-signal focus:ring-signal/20"
            }`}
          >
            <option value="">Select your manufacturing / industrial sector...</option>
            {INDUSTRIES.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground text-xs">
            ▼
          </div>
        </div>
        {touched.industry && errors.industry && (
          <p className="mt-1 text-[11px] text-destructive font-medium">{errors.industry}</p>
        )}
      </div>

      {/* Consultation Purpose (Selector Chips) - Phase 5 D */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
          Consultation Purpose <span className="text-destructive">*</span>
        </label>
        <div className="grid gap-2 sm:grid-cols-2">
          {CONSULTATION_PURPOSES.map((purpose) => {
            const isSelected = formData.consultationPurpose === purpose;
            return (
              <button
                key={purpose}
                type="button"
                onClick={() => {
                  notifyStart();
                  updateForm({
                    consultationPurpose: purpose,
                    specificApplication: purpose,
                  });
                }}
                className={`p-2.5 rounded-md border text-left text-xs font-medium transition-all flex items-start gap-2 cursor-pointer ${
                  isSelected
                    ? "border-signal bg-signal/10 text-foreground font-bold shadow-sm ring-1 ring-signal"
                    : "border-border bg-card text-foreground hover:border-border hover:bg-muted"
                }`}
              >
                <Target
                  size={14}
                  className={`shrink-0 mt-0.5 ${isSelected ? "text-signal" : "text-muted-foreground"}`}
                />
                <span className="line-clamp-2 leading-tight">{purpose}</span>
              </button>
            );
          })}
        </div>
        {touched.consultationPurpose && errors.consultationPurpose && (
          <p className="mt-1 text-[11px] text-destructive font-medium">{errors.consultationPurpose}</p>
        )}
      </div>

      {/* Date & Time Picker */}
      <div className="pt-2">
        <AppointmentSlotPicker
          selectedDate={formData.selectedDate}
          selectedSlot={formData.selectedSlot}
          timezone={formData.timezone}
          onSelectDate={(date) => {
            notifyStart();
            updateForm({ selectedDate: date });
          }}
          onSelectSlot={(slot) => {
            notifyStart();
            updateForm({ selectedSlot: slot });
          }}
          compact
        />
        {touched.selectedSlot && errors.selectedSlot && (
          <p className="mt-1 text-[11px] text-destructive font-medium">{errors.selectedSlot}</p>
        )}
      </div>

      {/* Privacy Consent Checkbox */}
      <div className="pt-2 border-t border-border">
        <label className="flex items-start gap-2.5 cursor-pointer text-xs text-muted-foreground select-none">
          <input
            type="checkbox"
            name="privacyConsent"
            checked={formData.privacyConsent}
            onChange={(e) => {
              notifyStart();
              updateForm({ privacyConsent: e.target.checked });
            }}
            className="mt-0.5 size-4 rounded border-border text-signal focus:ring-signal accent-signal"
          />
          <span className="leading-relaxed">
            I agree to discuss automation requirements under standard bilateral NDA terms and consent to
            receiving calendar appointment details and engineering briefing documents from INDUS.
          </span>
        </label>
        {touched.privacyConsent && errors.privacyConsent && (
          <p className="mt-1 text-[11px] text-destructive font-medium pl-6">{errors.privacyConsent}</p>
        )}
      </div>

      {/* Submit Error Banner */}
      {submitError && (
        <div className="flex items-center gap-2 border border-destructive/30 bg-destructive/10 p-3.5 rounded-md text-xs text-destructive">
          <AlertCircle size={16} className="text-destructive shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      {/* Submit CTA Button */}
      <div className="pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          variant="default"
          size="xl"
          className="w-full shadow-[0_0_20px_rgba(245,158,11,0.25)]"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin mr-1" />
              <span>Locking Slot & Syncing Google Calendar...</span>
            </>
          ) : (
            <>
              <span>Confirm Technical Consultation</span>
              <ArrowRight size={16} />
            </>
          )}
        </Button>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          Instant Google Calendar invitation · No obligation · Non-Disclosure Guaranteed
        </p>
      </div>
    </form>
  );
}
