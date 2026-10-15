import React, { useState } from "react";
import type { BookingFormData } from "@/types/consultation";
import type { BookingResponse } from "@/lib/consultation-api";
import { getGoogleCalendarLink, downloadIcsFile } from "@/lib/consultation-api";
import {
  CheckCircle2,
  Calendar,
  Clock,
  Video,
  Building2,
  Copy,
  Check,
  Download,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Mail,
  ArrowRight,
  User,
  Factory,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConsultationConfirmationProps {
  formData: BookingFormData;
  bookingResult: BookingResponse;
  onReset: () => void;
}

export function ConsultationConfirmation({
  formData,
  bookingResult,
  onReset,
}: ConsultationConfirmationProps) {
  const [copiedId, setCopiedId] = useState(false);
  const [copiedMeet, setCopiedMeet] = useState(false);

  const bookingId = bookingResult.bookingId || "INDUS-BC-CONFIRMED";
  const meetUrl = bookingResult.googleMeetUrl || "https://meet.google.com";
  const isOnline = !formData.consultationMode.includes("In-Person");
  const isQuick = formData.bookingMode === "quick";

  const copyToClipboard = (text: string, type: "id" | "meet") => {
    navigator.clipboard.writeText(text);
    if (type === "id") {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } else {
      setCopiedMeet(true);
      setTimeout(() => setCopiedMeet(false), 2000);
    }
  };

  const gCalUrl = getGoogleCalendarLink({
    title: `INDUS Robotics Consultation: ${formData.companyName} — ${formData.fullName} [${bookingId}]`,
    details: `Robotics Consultation with INDUS Industrial Robotics.\n\nBooking ID: ${bookingId}\nMode: ${formData.bookingMode.toUpperCase()}\nPurpose: ${formData.consultationPurpose}\nIndustry: ${formData.industry}\nRobot: ${formData.robotCategory || "Kinematic Architecture"}\n\nGoogle Meet: ${meetUrl}`,
    location: meetUrl,
    dateStr: formData.selectedDate,
    timeStr: formData.selectedSlot,
  });

  const handleDownloadIcs = () => {
    downloadIcsFile({
      title: `INDUS Robotics Consultation [${bookingId}]`,
      description: `Robotics Consultation session with INDUS Industrial Robotics application engineers.\n\nBooking Reference: ${bookingId}\nPurpose: ${formData.consultationPurpose}\nIndustry: ${formData.industry}\nMeeting Location: ${meetUrl}`,
      location: meetUrl,
      dateStr: formData.selectedDate,
      timeStr: formData.selectedSlot,
      bookingId: bookingId,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Success Hero Card */}
      <div className="rounded-xl border border-emerald-200 bg-gradient-to-b from-emerald-50/90 to-white p-6 sm:p-8 text-center space-y-4 shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 size={32} />
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-emerald-800">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
            <span>Google Calendar Synchronized</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 font-sans">
            Robotics Consultation Confirmed
          </h2>
          <p className="text-sm text-slate-600 max-w-lg mx-auto mt-1.5 leading-relaxed">
            Your appointment has been reserved and synchronized directly with the INDUS applications engineering desk.
            A calendar invitation has been dispatched to{" "}
            <strong className="text-slate-900 font-mono font-bold">{formData.companyEmail}</strong>.
          </p>
        </div>

        {/* Reference ID Pill */}
        <div className="inline-flex items-center gap-2.5 rounded-md border border-border bg-card px-4 py-2 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Booking ID:
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-signal tracking-wider">
            {bookingId}
          </span>
          <button
            type="button"
            onClick={() => copyToClipboard(bookingId, "id")}
            className="text-muted-foreground hover:text-signal transition-colors p-1"
            title="Copy Booking ID"
          >
            {copiedId ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
          </button>
        </div>
      </div>

      {/* Appointment Coordinates */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Date & Time */}
        <div className="rounded-md border border-border bg-card p-5 shadow-sm space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground">
            <Calendar size={16} className="text-signal" />
            <span>Scheduled Date & Time</span>
          </div>
          <div>
            <span className="block text-base font-bold text-foreground font-sans">
              {formData.selectedDate}
            </span>
            <span className="block text-sm font-bold font-mono text-signal mt-0.5">
              {formData.selectedSlot} (Asia/Kolkata IST)
            </span>
            <span className="block text-[11px] text-muted-foreground mt-1">
              Duration: 30 minutes with Senior Robotics Application Architect
            </span>
          </div>
        </div>

        {/* Meeting Link / Channel */}
        <div className="rounded-md border border-border bg-card p-5 shadow-sm space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground">
            {isOnline ? (
              <>
                <Video size={16} className="text-signal" />
                <span>Google Meet Video Room</span>
              </>
            ) : (
              <>
                <Building2 size={16} className="text-signal" />
                <span>On-Site Facility Tour</span>
              </>
            )}
          </div>

          {isOnline ? (
            <div className="space-y-2">
              <a
                href={meetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-signal hover:underline truncate max-w-full"
              >
                <span className="truncate">{meetUrl}</span>
                <ExternalLink size={12} className="shrink-0" />
              </a>
              <button
                type="button"
                onClick={() => copyToClipboard(meetUrl, "meet")}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground"
              >
                {copiedMeet ? (
                  <>
                    <Check size={12} className="text-emerald-600" />
                    <span className="text-emerald-600">Copied to clipboard</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Copy Google Meet link</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="text-xs text-slate-600 leading-relaxed">
              <span className="font-semibold text-slate-900 block">INDUS Industrial Robotics Facility</span>
              <span>Engineering Tech Center, Chennai, Tamil Nadu, India. Please report to the visitor reception upon arrival.</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons: Add to Google Calendar / Download ICS */}
      <div className="rounded-md border border-border bg-muted/40 p-5 space-y-3">
        <span className="block text-xs font-bold uppercase tracking-wider text-foreground">
          Sync with Your Personal Calendar
        </span>

        <div className="flex flex-wrap gap-2.5">
          <a
            href={gCalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-signal hover:bg-signal/90 text-signal-foreground text-xs font-bold px-4 py-2.5 transition-colors shadow-sm"
          >
            <Calendar size={14} />
            <span>Add to Google Calendar</span>
            <ExternalLink size={12} />
          </a>

          <button
            type="button"
            onClick={handleDownloadIcs}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card hover:bg-muted text-foreground text-xs font-bold px-4 py-2.5 transition-colors shadow-sm cursor-pointer"
          >
            <Download size={14} />
            <span>Download .ICS File (Outlook / Apple)</span>
          </button>

          <a
            href="https://calendar.app.google/ZMQqX8rKGyCZqtqB7"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card hover:bg-muted text-foreground text-xs font-bold px-4 py-2.5 transition-colors shadow-sm"
          >
            <span>Official Google Calendar Schedule</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* What Happens Next Timeline */}
      <div className="rounded-md border border-border bg-card p-5 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
          What Happens Next: 3-Step Execution
        </h3>

        <div className="grid gap-3 sm:grid-cols-3 text-xs text-muted-foreground">
          <div className="p-3 bg-muted/50 rounded-md space-y-1">
            <span className="font-bold text-signal text-xs block">1. Calendar Invite</span>
            <p className="leading-relaxed">
              Google Calendar invitation with Google Meet link dispatched to {formData.companyEmail}.
            </p>
          </div>

          <div className="p-3 bg-muted/50 rounded-md space-y-1">
            <span className="font-bold text-signal text-xs block">2. Kinematic Pre-Study</span>
            <p className="leading-relaxed">
              INDUS application architect reviews your parameters and generates reach simulations.
            </p>
          </div>

          <div className="p-3 bg-muted/50 rounded-md space-y-1">
            <span className="font-bold text-signal text-xs block">3. Live Review Session</span>
            <p className="leading-relaxed">
              30-minute technical session covering kinematic sizing, line balance, and CapEx ROI.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Reset Button */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs text-muted-foreground">
          Need to schedule another session for a different project?
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onReset}
        >
          <RefreshCw size={13} className="mr-1.5" />
          <span>Book Another Consultation</span>
        </Button>
      </div>
    </div>
  );
}
