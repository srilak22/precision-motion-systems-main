import React, { useState, useEffect } from "react";
import type { BookingFormData, ConsultationSlot } from "@/types/consultation";
import { fetchConsultationSlots } from "@/lib/consultation-api";
import {
  Calendar as CalendarIcon,
  Clock,
  Globe,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Video,
  Building2,
  User,
  Mail,
  Phone,
  Building,
  Wrench,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScheduleStepProps {
  formData: BookingFormData;
  updateForm: (updates: Partial<BookingFormData>) => void;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
  submitError: string | null;
}

export function ScheduleStep({
  formData,
  updateForm,
  onSubmit,
  onBack,
  isSubmitting,
  submitError,
}: ScheduleStepProps) {
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slots, setSlots] = useState<ConsultationSlot[]>([]);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  // Generate the next 30 days of business dates (excluding weekends)
  const availableDates: { dateStr: string; displayDay: string; displayDate: string; isToday: boolean }[] = [];
  const today = new Date();

  for (let i = 0; availableDates.length < 20 && i < 40; i++) {
    const d = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
    const dayOfWeek = d.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      // Mon - Fri
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;
      const displayDay = d.toLocaleDateString("en-US", { weekday: "short" });
      const displayDate = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      availableDates.push({
        dateStr,
        displayDay,
        displayDate,
        isToday: i === 0,
      });
    }
  }

  // Set default date if none selected
  useEffect(() => {
    if (!formData.selectedDate && availableDates.length > 0 && availableDates[0]) {
      updateForm({ selectedDate: availableDates[0].dateStr });
    }
  }, []);

  // Fetch slots whenever selectedDate changes
  useEffect(() => {
    if (!formData.selectedDate) return;

    let active = true;
    setLoadingSlots(true);
    setSlotsError(null);

    fetchConsultationSlots(formData.selectedDate, formData.timezone || "Asia/Kolkata")
      .then((res) => {
        if (!active) return;
        setLoadingSlots(false);
        if (res.status === "success") {
          setSlots(res.slots || []);
        } else {
          setSlotsError(res.message || "Failed to retrieve available slots");
        }
      })
      .catch((err) => {
        if (!active) return;
        setLoadingSlots(false);
        setSlotsError(err.message || "Network error checking calendar slots");
      });

    return () => {
      active = false;
    };
  }, [formData.selectedDate, formData.timezone]);

  const handleSelectSlot = (slot: ConsultationSlot) => {
    if (!slot.available) return;
    updateForm({ selectedSlot: `${slot.time} - ${slot.endTime}` });
  };

  const selectedDateMeta = availableDates.find((d) => d.dateStr === formData.selectedDate);

  const canSubmit = Boolean(
    formData.selectedDate &&
    formData.selectedSlot &&
    !isSubmitting,
  );

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-signal">
          <span>Step 04 / 04</span>
          <span className="text-muted-foreground/40">·</span>
          <span>Live Calendar Synchronization</span>
        </div>
        <h2 className="mt-2 font-display text-2xl font-bold uppercase text-foreground sm:text-3xl">
          Select Your Consultation Date & Time
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Slots are verified directly against Google Calendar with double-booking prevention.
          Default timezone is <strong>IST (Asia/Kolkata, UTC+05:30)</strong>. Meeting duration is 30 minutes.
        </p>
      </div>

      {/* Date Carousel / Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
            <CalendarIcon size={14} className="text-signal" />
            <span>Select Consultation Date</span>
          </label>
          <span className="text-[11px] text-muted-foreground">Mon – Fri (30-day booking horizon)</span>
        </div>

        <div className="flex gap-2.5 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth">
          {availableDates.map((d) => {
            const isSelected = formData.selectedDate === d.dateStr;
            return (
              <button
                key={d.dateStr}
                type="button"
                onClick={() => updateForm({ selectedDate: d.dateStr, selectedSlot: "" })}
                className={`flex flex-col items-center justify-center min-w-[76px] py-3 px-2 border transition-all rounded-none ${
                  isSelected
                    ? "border-signal bg-signal text-signal-foreground font-bold shadow-[0_0_12px_rgba(245,158,11,0.25)]"
                    : "border-border bg-card text-muted-foreground hover:border-signal/50 hover:text-foreground"
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  {d.displayDay}
                </span>
                <span className="mt-1 font-display text-base font-bold">
                  {d.displayDate}
                </span>
                {d.isToday && (
                  <span className={`text-[8px] font-bold uppercase mt-1 px-1 py-0.2 ${
                    isSelected ? "bg-black/20 text-signal-foreground" : "text-signal"
                  }`}>
                    Today
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slots Area */}
      <div className="rounded-none border border-border bg-card/60 p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/40 pb-3">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-signal" />
            <h3 className="font-display text-sm font-bold uppercase text-foreground">
              Available 30-Minute Slots for {selectedDateMeta ? `${selectedDateMeta.displayDay}, ${selectedDateMeta.displayDate}` : formData.selectedDate}
            </h3>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Globe size={13} className="text-signal" />
            <span>Timezone: <strong className="text-foreground">Asia/Kolkata (IST, UTC+05:30)</strong></span>
          </div>
        </div>

        {/* Loading Spinner */}
        {loadingSlots && (
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
            <Loader2 size={24} className="animate-spin text-signal mb-2" />
            <span className="text-xs uppercase tracking-wider font-semibold">
              Querying Google Calendar Live Free/Busy Availability...
            </span>
          </div>
        )}

        {/* Error Banner */}
        {!loadingSlots && slotsError && (
          <div className="flex items-center gap-2 border border-destructive/50 bg-destructive/10 p-4 text-xs text-destructive">
            <AlertCircle size={15} className="shrink-0" />
            <span>{slotsError}</span>
          </div>
        )}

        {/* Slots Grid */}
        {!loadingSlots && !slotsError && (
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {slots.map((slot) => {
              const slotFull = `${slot.time} - ${slot.endTime}`;
              const isSelected = formData.selectedSlot === slotFull;

              return (
                <button
                  key={slot.time}
                  type="button"
                  disabled={!slot.available}
                  onClick={() => handleSelectSlot(slot)}
                  className={`group relative flex flex-col items-center justify-center p-3 border text-center transition-all ${
                    isSelected
                      ? "border-signal bg-signal text-signal-foreground font-bold shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                      : slot.available
                      ? "border-border bg-background text-foreground hover:border-signal/80 hover:bg-card cursor-pointer"
                      : "border-border/40 bg-muted/20 text-muted-foreground/40 cursor-not-allowed"
                  }`}
                >
                  <span className="font-mono text-xs font-semibold">
                    {slot.display.split(" - ")[0]}
                  </span>
                  <span className={`text-[10px] mt-0.5 ${
                    isSelected
                      ? "text-signal-foreground/80 font-medium"
                      : slot.available
                      ? "text-signal"
                      : "text-muted-foreground/40"
                  }`}>
                    {isSelected ? "Selected" : slot.available ? "Available" : slot.reason || "Unavailable"}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Review Summary Card */}
      <div className="rounded-none border-2 border-signal/40 bg-surface-dark/95 p-6 text-surface-foreground space-y-4">
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-signal" />
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              Consultation Briefing Summary
            </h3>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-signal">
            Final Pre-Submission Review
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-xs">
          <div>
            <span className="block text-[10px] font-bold uppercase text-muted-foreground">Industry & Scope</span>
            <span className="font-bold text-foreground">{formData.industry || "Not selected"}</span>
            <span className="block text-[11px] text-muted-foreground mt-0.5">{formData.specificApplication}</span>
          </div>

          <div>
            <span className="block text-[10px] font-bold uppercase text-muted-foreground">Robot Requirement</span>
            <span className="font-bold text-signal">{formData.robotCategory || "Not selected"}</span>
            <span className="block text-[11px] text-muted-foreground mt-0.5">{formData.projectStage} · {formData.preferredSolution}</span>
          </div>

          <div>
            <span className="block text-[10px] font-bold uppercase text-muted-foreground">Consultation Mode</span>
            <span className="font-bold text-foreground flex items-center gap-1.5 mt-0.5">
              {formData.consultationMode.includes("In-Person") ? (
                <>
                  <Building2 size={13} className="text-signal" />
                  <span>On-Site Innovation Tour</span>
                </>
              ) : (
                <>
                  <Video size={13} className="text-signal" />
                  <span>Google Meet Video Call</span>
                </>
              )}
            </span>
          </div>

          <div>
            <span className="block text-[10px] font-bold uppercase text-muted-foreground">Contact Representative</span>
            <span className="font-bold text-foreground">{formData.fullName}</span>
            <span className="block text-[11px] text-muted-foreground mt-0.5">{formData.jobTitle} at {formData.companyName}</span>
          </div>

          <div>
            <span className="block text-[10px] font-bold uppercase text-muted-foreground">Contact Coordinates</span>
            <span className="font-mono text-[11px] text-foreground">{formData.companyEmail}</span>
            <span className="block font-mono text-[11px] text-muted-foreground">{formData.phoneNumber}</span>
          </div>

          <div className="border border-signal/40 bg-signal/10 p-2.5">
            <span className="block text-[10px] font-bold uppercase text-signal">Selected Appointment Slot</span>
            <span className="font-display text-sm font-bold text-white">
              {formData.selectedDate || "—"}
            </span>
            <span className="block font-mono text-xs text-signal font-bold mt-0.5">
              {formData.selectedSlot ? `${formData.selectedSlot} (IST)` : "No slot chosen"}
            </span>
          </div>
        </div>
      </div>

      {/* Submit Error */}
      {submitError && (
        <div className="flex items-center gap-2 border border-destructive bg-destructive/10 p-4 text-xs text-destructive">
          <AlertCircle size={16} className="shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
          className="rounded-none border-border text-xs font-bold uppercase tracking-wider"
        >
          <ArrowLeft size={14} className="mr-2" />
          Back: Customer Info
        </Button>

        <Button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit}
          className="rounded-none bg-signal px-9 py-6 text-xs font-extrabold uppercase tracking-widest text-signal-foreground hover:bg-signal/90 disabled:opacity-50 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin mr-2" />
              Confirming & Syncing with Google Calendar...
            </>
          ) : (
            <>
              Confirm & Book Robotics Consultation
              <ArrowRight size={14} className="ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
