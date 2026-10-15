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
        <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
          <CalendarIcon size={14} className="text-[#0052FF]" />
          <span>Select Consultation Date</span>
        </label>
        <span className="text-[11px] font-medium text-slate-500">
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
              className={`flex flex-col items-center justify-center min-w-[70px] sm:min-w-[78px] py-2.5 px-2 border rounded-lg transition-all text-center focus-visible:ring-2 focus-visible:ring-[#0052FF] ${
                isSelected
                  ? "border-[#0052FF] bg-[#0052FF] text-white font-semibold shadow-md shadow-blue-500/20"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? "text-blue-100" : "text-slate-500"}`}>
                {d.displayDay}
              </span>
              <span className="mt-0.5 text-sm sm:text-base font-bold font-sans">
                {d.displayDate}
              </span>
              {d.isToday && (
                <span className={`text-[8px] font-bold uppercase mt-1 px-1.5 py-0.2 rounded ${
                  isSelected ? "bg-white/20 text-white" : "bg-blue-50 text-[#0052FF]"
                }`}>
                  Today
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Available Slots Box */}
      <div className="border border-slate-200 bg-slate-50/70 rounded-lg p-4 sm:p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
          <div className="flex items-center gap-2">
            <Clock size={15} className="text-[#0052FF]" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
              30-Min Consultation Slots: {selectedDateMeta ? `${selectedDateMeta.displayDay}, ${selectedDateMeta.displayDate}` : selectedDate}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
            <Globe size={13} className="text-[#0052FF]" />
            <span>Timezone: <strong className="text-slate-900 font-semibold">{timezone} (IST, UTC+05:30)</strong></span>
          </div>
        </div>

        {/* Loading Spinner */}
        {loadingSlots && (
          <div className="flex flex-col items-center justify-center py-8 text-slate-500">
            <Loader2 size={22} className="animate-spin text-[#0052FF] mb-2" />
            <span className="text-xs font-medium text-slate-600">
              Querying Google Calendar Live Free/Busy Availability...
            </span>
          </div>
        )}

        {/* Error Notice */}
        {!loadingSlots && slotsError && (
          <div className="flex items-center gap-2.5 border border-amber-200 bg-amber-50 p-3 rounded-md text-xs text-amber-900">
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
                        ? "border-[#0052FF] bg-[#0052FF] text-white font-bold shadow-sm shadow-blue-500/25 ring-2 ring-[#0052FF]/30"
                        : slot.available
                        ? "border-slate-200 bg-white text-slate-800 hover:border-[#0052FF]/60 hover:bg-blue-50/40 cursor-pointer"
                        : "border-slate-200/50 bg-slate-100 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    <span className="text-xs font-semibold font-mono">
                      {slot.display.split(" - ")[0]}
                    </span>
                    <span className={`text-[10px] mt-0.5 flex items-center gap-1 ${
                      isSelected
                        ? "text-blue-100 font-medium"
                        : slot.available
                        ? "text-emerald-600 font-medium"
                        : "text-slate-400"
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
              <div className="mt-3 flex items-center justify-between bg-blue-50/80 border border-blue-200/60 rounded-md px-3 py-2 text-xs text-blue-900">
                <span className="flex items-center gap-1.5 font-medium">
                  <CalendarCheck size={14} className="text-[#0052FF]" />
                  <span>Selected Appointment: <strong>{selectedDate} at {selectedSlot} (IST)</strong></span>
                </span>
                <span className="text-[11px] text-blue-700 font-semibold uppercase tracking-wider">
                  Verified Slot
                </span>
              </div>
            )}
          </div>
        )}

        {/* Fallback to Official Google Calendar Schedule */}
        <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-slate-500">
            Need a slot outside standard hours or alternate timezone?
          </span>
          <a
            href={officialCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#0052FF] hover:text-blue-700 font-semibold transition-colors"
          >
            <span>Open Google Calendar Official Scheduler</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
