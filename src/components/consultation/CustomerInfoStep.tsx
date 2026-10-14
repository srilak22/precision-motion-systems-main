import React, { useState } from "react";
import type { BookingFormData, ConsultationMode } from "@/types/consultation";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Video,
  Building2,
  Mail,
  Phone,
  User,
  Globe,
  Briefcase,
  MapPin,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CustomerInfoStepProps {
  formData: BookingFormData;
  updateForm: (updates: Partial<BookingFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidPhone(phone: string): boolean {
  const clean = phone.replace(/[^0-9+]/g, "");
  return clean.length >= 7 && clean.length <= 20;
}

export function CustomerInfoStep({ formData, updateForm, onNext, onBack }: CustomerInfoStepProps) {
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const nameValid = formData.fullName.trim().length >= 2;
  const emailValid = isValidEmail(formData.companyEmail);
  const phoneValid = isValidPhone(formData.phoneNumber);
  const companyValid = formData.companyName.trim().length >= 2;
  const titleValid = formData.jobTitle.trim().length >= 2;
  const countryValid = formData.country.trim().length >= 2;
  const cityValid = formData.city.trim().length >= 2;
  const consentValid = formData.privacyConsent;

  const isComplete =
    nameValid &&
    emailValid &&
    phoneValid &&
    companyValid &&
    titleValid &&
    countryValid &&
    cityValid &&
    consentValid;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-signal">
          <span>Step 03 / 04</span>
          <span className="text-muted-foreground/40">·</span>
          <span>Contact & Meeting Coordinates</span>
        </div>
        <h2 className="mt-2 font-display text-2xl font-bold uppercase text-foreground sm:text-3xl">
          Enter Your Contact & Company Profile
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Your details are used to issue calendar invites, assign dedicated robotics application engineers,
          and ensure non-disclosure compliance.
        </p>
      </div>

      {/* Consultation Mode Selection */}
      <div className="space-y-3">
        <Label className="text-xs font-bold uppercase tracking-wider text-foreground">
          Preferred Consultation Format <span className="text-signal">*</span>
        </Label>
        <div className="grid gap-3 sm:grid-cols-2">
          {/* Google Meet Online */}
          <button
            type="button"
            onClick={() => updateForm({ consultationMode: "Google Meet (Online Video)" })}
            className={`flex items-start gap-3 p-4 text-left transition-all border ${
              formData.consultationMode === "Google Meet (Online Video)"
                ? "border-signal bg-signal/10 shadow-[0_0_15px_rgba(245,158,11,0.15)] ring-1 ring-signal"
                : "border-border bg-card hover:border-border/80"
            }`}
          >
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-none border ${
                formData.consultationMode === "Google Meet (Online Video)"
                  ? "border-signal bg-signal text-signal-foreground"
                  : "border-border bg-muted/40 text-muted-foreground"
              }`}
            >
              <Video size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-sm font-bold uppercase text-foreground">
                  Google Meet Video Call
                </span>
                <span className="bg-signal/20 text-signal text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-wider">
                  Recommended
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Live interactive screen share for CAD layout sizing, kinematic reach simulations, and BOM review.
              </p>
            </div>
          </button>

          {/* In-Person Consultation */}
          <button
            type="button"
            onClick={() => updateForm({ consultationMode: "In-Person Consultation (INDUS Center)" })}
            className={`flex items-start gap-3 p-4 text-left transition-all border ${
              formData.consultationMode === "In-Person Consultation (INDUS Center)"
                ? "border-signal bg-signal/10 shadow-[0_0_15px_rgba(245,158,11,0.15)] ring-1 ring-signal"
                : "border-border bg-card hover:border-border/80"
            }`}
          >
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-none border ${
                formData.consultationMode === "In-Person Consultation (INDUS Center)"
                  ? "border-signal bg-signal text-signal-foreground"
                  : "border-border bg-muted/40 text-muted-foreground"
              }`}
            >
              <Building2 size={18} />
            </div>
            <div>
              <span className="font-display text-sm font-bold uppercase text-foreground">
                In-Person Innovation Tour
              </span>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Visit the INDUS Industrial Robotics Automation Facility for live robot cell demonstrations.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Contact Details Grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Full Name */}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold uppercase tracking-wider text-foreground">
            Full Name <span className="text-signal">*</span>
          </Label>
          <div className="relative">
            <User size={15} className="absolute left-3 top-3 text-muted-foreground" />
            <Input
              value={formData.fullName}
              onChange={(e) => updateForm({ fullName: e.target.value })}
              onBlur={() => handleBlur("fullName")}
              placeholder="e.g. John Doe"
              className={`pl-9 bg-card border-border text-foreground text-xs ${
                touched["fullName"] && !nameValid ? "border-destructive focus:border-destructive" : ""
              }`}
            />
          </div>
          {touched["fullName"] && !nameValid && (
            <p className="text-[11px] text-destructive flex items-center gap-1">
              <AlertCircle size={11} /> Name must be at least 2 characters.
            </p>
          )}
        </div>

        {/* Company Email */}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold uppercase tracking-wider text-foreground">
            Official Company Email <span className="text-signal">*</span>
          </Label>
          <div className="relative">
            <Mail size={15} className="absolute left-3 top-3 text-muted-foreground" />
            <Input
              type="email"
              value={formData.companyEmail}
              onChange={(e) => updateForm({ companyEmail: e.target.value })}
              onBlur={() => handleBlur("companyEmail")}
              placeholder="e.g. name@company.com"
              className={`pl-9 bg-card border-border text-foreground text-xs ${
                touched["companyEmail"] && !emailValid ? "border-destructive focus:border-destructive" : ""
              }`}
            />
          </div>
          {touched["companyEmail"] && !emailValid && (
            <p className="text-[11px] text-destructive flex items-center gap-1">
              <AlertCircle size={11} /> Please enter a valid corporate email address.
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold uppercase tracking-wider text-foreground">
            Phone Number (With Country Code) <span className="text-signal">*</span>
          </Label>
          <div className="relative">
            <Phone size={15} className="absolute left-3 top-3 text-muted-foreground" />
            <Input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => updateForm({ phoneNumber: e.target.value })}
              onBlur={() => handleBlur("phoneNumber")}
              placeholder="e.g. +91 98765 43210 or +1 (555) 019-2834"
              className={`pl-9 bg-card border-border text-foreground text-xs ${
                touched["phoneNumber"] && !phoneValid ? "border-destructive focus:border-destructive" : ""
              }`}
            />
          </div>
          {touched["phoneNumber"] && !phoneValid && (
            <p className="text-[11px] text-destructive flex items-center gap-1">
              <AlertCircle size={11} /> Please include country code and at least 7 digits.
            </p>
          )}
        </div>

        {/* Company Name */}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold uppercase tracking-wider text-foreground">
            Company / Organization Name <span className="text-signal">*</span>
          </Label>
          <div className="relative">
            <Building2 size={15} className="absolute left-3 top-3 text-muted-foreground" />
            <Input
              value={formData.companyName}
              onChange={(e) => updateForm({ companyName: e.target.value })}
              onBlur={() => handleBlur("companyName")}
              placeholder="e.g. Apex Automotive Tier-1 Systems"
              className={`pl-9 bg-card border-border text-foreground text-xs ${
                touched["companyName"] && !companyValid ? "border-destructive focus:border-destructive" : ""
              }`}
            />
          </div>
          {touched["companyName"] && !companyValid && (
            <p className="text-[11px] text-destructive flex items-center gap-1">
              <AlertCircle size={11} /> Company name is required.
            </p>
          )}
        </div>

        {/* Job Title */}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold uppercase tracking-wider text-foreground">
            Job Title / Designation <span className="text-signal">*</span>
          </Label>
          <div className="relative">
            <Briefcase size={15} className="absolute left-3 top-3 text-muted-foreground" />
            <Input
              value={formData.jobTitle}
              onChange={(e) => updateForm({ jobTitle: e.target.value })}
              onBlur={() => handleBlur("jobTitle")}
              placeholder="e.g. Automation Lead / Plant Engineering Manager"
              className={`pl-9 bg-card border-border text-foreground text-xs ${
                touched["jobTitle"] && !titleValid ? "border-destructive focus:border-destructive" : ""
              }`}
            />
          </div>
        </div>

        {/* Company Website */}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold uppercase tracking-wider text-foreground">
            Company Website (Optional)
          </Label>
          <div className="relative">
            <Globe size={15} className="absolute left-3 top-3 text-muted-foreground" />
            <Input
              value={formData.companyWebsite || ""}
              onChange={(e) => updateForm({ companyWebsite: e.target.value })}
              placeholder="e.g. https://company.com"
              className="pl-9 bg-card border-border text-foreground text-xs"
            />
          </div>
        </div>

        {/* Country */}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold uppercase tracking-wider text-foreground">
            Country <span className="text-signal">*</span>
          </Label>
          <div className="relative">
            <MapPin size={15} className="absolute left-3 top-3 text-muted-foreground" />
            <Input
              value={formData.country}
              onChange={(e) => updateForm({ country: e.target.value })}
              onBlur={() => handleBlur("country")}
              placeholder="e.g. India, United States, Germany, Japan"
              className="pl-9 bg-card border-border text-foreground text-xs"
            />
          </div>
        </div>

        {/* City */}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold uppercase tracking-wider text-foreground">
            City / State <span className="text-signal">*</span>
          </Label>
          <div className="relative">
            <MapPin size={15} className="absolute left-3 top-3 text-muted-foreground" />
            <Input
              value={formData.city}
              onChange={(e) => updateForm({ city: e.target.value })}
              onBlur={() => handleBlur("city")}
              placeholder="e.g. Chennai, Pune, Stuttgart, Detroit"
              className="pl-9 bg-card border-border text-foreground text-xs"
            />
          </div>
        </div>
      </div>

      {/* Additional Comments */}
      <div className="space-y-2">
        <Label className="text-xs font-bold uppercase tracking-wider text-foreground">
          Additional Comments or Questions for the Engineering Team (Optional)
        </Label>
        <Textarea
          rows={3}
          value={formData.additionalComments || ""}
          onChange={(e) => updateForm({ additionalComments: e.target.value })}
          placeholder="e.g. Are specific safety laser scanners required? We also need to integrate with an existing MES database..."
          className="bg-card border-border text-foreground text-xs"
        />
      </div>

      {/* Privacy Consent Checkbox */}
      <div className="rounded-none border border-border bg-card/60 p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.privacyConsent}
            onChange={(e) => updateForm({ privacyConsent: e.target.checked })}
            className="mt-1 h-4 w-4 rounded-none border-border accent-signal text-signal focus:ring-signal"
          />
          <div className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-bold text-foreground">Privacy & Non-Disclosure Consent:</span> I consent to
            INDUS Industrial Robotics processing my corporate contact details and application specifications
            in accordance with the Privacy Policy for scheduling, conducting, and following up on this robotics
            consultation. All submitted technical drawings and process specifications remain strictly confidential.
          </div>
        </label>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="rounded-none border-border text-xs font-bold uppercase tracking-wider"
        >
          <ArrowLeft size={14} className="mr-2" />
          Back: Technical Specifications
        </Button>

        <Button
          type="button"
          onClick={onNext}
          disabled={!isComplete}
          className="rounded-none bg-signal px-8 text-xs font-bold uppercase tracking-wider text-signal-foreground hover:bg-signal/90 disabled:opacity-50"
        >
          Next: Schedule Consultation
          <ArrowRight size={14} className="ml-2" />
        </Button>
      </div>
    </div>
  );
}
