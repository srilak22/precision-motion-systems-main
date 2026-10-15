import React, { useState, useEffect } from "react";
import type { ConsultationSlot } from "@/types/consultation";
import { fetchConsultationSlots } from "@/lib/consultation-api";
import {
  Calendar as CalendarIcon,
  Clock,
  Globe,
  Loader2,
  Check,
  AlertCircle,
  ExternalLink,
  CalendarCheck,
} from "lucide-react";

interface AppointmentSlotPickerProps {
  selectedDate: string;
  selectedSlot: string;
  timezone?: string;
  onSelectDate: (date: string) => void;
  onSelectSlot: (slot: string) => void;
  officialCalendarUrl?: string;
  compact?: boolean;
}

export function AppointmentSlotPicker({
  selectedDate,
  selectedSlot,
  timezone = "Asia/Kolkata",
  onSelectDate,
  onSelectSlot,
  officialCalendarUrl = "https://calendar.app.google/ZMQqX8rKGyCZqtqB7",
  compact = false,
}: AppointmentSlotPickerProps) {
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slots, setSlots] = useState<ConsultationSlot[]>([]);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  // Generate next 20 business days (Mon - Fri)
  const availableDates: { dateStr: string; displayDay: string; displayDate: string; isToday: boolean }[] = [];
  const today = new Date();

  for (let i = 0; availableDates.length < 20 && i < 40; i++) {
    const d = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
    const dayOfWeek = d.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
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

  // Ensure an initial date is selected
  useEffect(() => {
    if (!selectedDate && availableDates.length > 0 && availableDates[0]) {
      onSelectDate(availableDates[0].dateStr);
    }
  }, [selectedDate, availableDates, onSelectDate]);

  // Fetch slots whenever selectedDate changes
  useEffect(() => {
    if (!selectedDate) return;

    let active = true;
    setLoadingSlots(true);
    setSlotsError(null);

    fetchConsultationSlots(selectedDate, timezone)
      .then((res) => {
        if (!active) return;
        setLoadingSlots(false);
        if (res.status === "success") {
          setSlots(res.slots || []);
        } else {
          setSlotsError(res.message || "Unable to check slot availability.");
        }
      })
      .catch((err) => {
        if (!active) return;
        setLoadingSlots(false);
        setSlotsError(err instanceof Error ? err.message : "Failed to load slots");
      });

    return () => {
      active = false;
    };
  }, [selectedDate, timezone]);

  const selectedDateMeta = availableDates.find((d) => d.dateStr === selectedDate);

  return (
    <div className="space-y-4">
      {/* Date Carousel Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
          <CalendarIcon size={14} className="text-signal" />
          <span>Select Consultation Date</span>
        </label>
        <span className="text-[11px] font-medium text-muted-foreground">
          Mon – Fri (Live Verified)
        </span>
      </div>

      {/* Date Horizontal Carousel */}
      <div className="flex gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth">
        {availableDates.map((d) => {
          const isSelected = selectedDate === d.dateStr;
          return (
            <button
              key={d.dateStr}
              type="button"
              onClick={() => {
                onSelectDate(d.dateStr);
                onSelectSlot("");
              }}
              className={`flex flex-col items-center justify-center min-w-[70px] sm:min-w-[78px] py-2.5 px-2 border rounded-md transition-all text-center focus-visible:ring-2 focus-visible:ring-signal cursor-pointer ${
                isSelected
                  ? "border-signal bg-signal text-signal-foreground font-semibold shadow-sm"
                  : "border-border bg-card text-foreground hover:border-border hover:bg-muted"
              }`}
            >
              <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? "text-signal-foreground/90" : "text-muted-foreground"}`}>
                {d.displayDay}
              </span>
              <span className="mt-0.5 text-sm sm:text-base font-bold font-sans">
                {d.displayDate}
              </span>
              {d.isToday && (
                <span className={`text-[8px] font-bold uppercase mt-1 px-1.5 py-0.2 rounded ${
                  isSelected ? "bg-signal-foreground/20 text-signal-foreground" : "bg-signal/15 text-signal"
                }`}>
                  Today
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Available Slots Box */}
      <div className="border border-border bg-muted/40 rounded-md p-4 sm:p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Clock size={15} className="text-signal" />
            <span className="text-xs font-bold uppercase tracking-wider text-foreground">
              30-Min Slots: {selectedDateMeta ? `${selectedDateMeta.displayDay}, ${selectedDateMeta.displayDate}` : selectedDate}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Globe size={13} className="text-signal" />
            <span>Timezone: <strong className="text-foreground font-semibold">{timezone} (IST, UTC+05:30)</strong></span>
          </div>
        </div>

        {/* Loading Spinner */}
        {loadingSlots && (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Loader2 size={22} className="animate-spin text-signal mb-2" />
            <span className="text-xs font-medium text-foreground">
              Querying Google Calendar Live Free/Busy Availability...
            </span>
          </div>
        )}

        {/* Error Notice */}
        {!loadingSlots && slotsError && (
          <div className="flex items-center gap-2.5 border border-amber-300 bg-amber-50 p-3 rounded-md text-xs text-amber-900">
            <AlertCircle size={15} className="text-amber-600 shrink-0" />
            <span>{slotsError} — You can also book directly via the official Google Calendar link below.</span>
          </div>
        )}

        {/* Slots Grid */}
        {!loadingSlots && !slotsError && (
          <div>
            <div className={`grid gap-2 ${compact ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"}`}>
              {slots.map((slot) => {
                const slotFull = `${slot.time} - ${slot.endTime}`;
                const isSelected = selectedSlot === slotFull;

                return (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={!slot.available}
                    onClick={() => onSelectSlot(slotFull)}
                    className={`relative flex flex-col items-center justify-center py-2.5 px-2 rounded-md border text-center transition-all ${
                      isSelected
                        ? "border-signal bg-signal text-signal-foreground font-bold shadow-sm ring-2 ring-signal/30"
                        : slot.available
                        ? "border-border bg-card text-foreground hover:border-signal/60 hover:bg-surface-elevated/10 cursor-pointer"
                        : "border-border/40 bg-muted/70 text-muted-foreground/60 cursor-not-allowed"
                    }`}
                  >
                    <span className="text-xs font-semibold font-mono">
                      {slot.display.split(" - ")[0]}
                    </span>
                    <span className={`text-[10px] mt-0.5 flex items-center gap-1 ${
                      isSelected
                        ? "text-signal-foreground/90 font-medium"
                        : slot.available
                        ? "text-emerald-700 font-medium"
                        : "text-muted-foreground/60"
                    }`}>
                      {isSelected ? (
                        <>
                          <Check size={11} className="inline" />
                          <span>Selected</span>
                        </>
                      ) : slot.available ? (
                        "Available"
                      ) : (
                        slot.reason || "Reserved"
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            {selectedSlot && (
              <div className="mt-3 flex items-center justify-between bg-signal/10 border border-signal/30 rounded-md px-3 py-2 text-xs text-foreground">
                <span className="flex items-center gap-1.5 font-medium">
                  <CalendarCheck size={14} className="text-signal" />
                  <span>Selected Appointment: <strong>{selectedDate} at {selectedSlot} (IST)</strong></span>
                </span>
                <span className="text-[11px] text-signal font-bold uppercase tracking-wider">
                  Verified Slot
                </span>
              </div>
            )}
          </div>
        )}

        {/* Fallback to Official Google Calendar Schedule */}
        <div className="pt-2 border-t border-border flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-muted-foreground">
            Need a slot outside standard hours or alternate timezone?
          </span>
          <a
            href={officialCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-signal hover:underline font-semibold transition-colors"
          >
            <span>Open Google Calendar Official Scheduler</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
