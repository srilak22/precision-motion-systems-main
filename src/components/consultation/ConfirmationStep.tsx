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
  ArrowRight,
  RefreshCw,
  Mail,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

interface ConfirmationStepProps {
  formData: BookingFormData;
  bookingResult: BookingResponse;
  onReset: () => void;
}

export function ConfirmationStep({ formData, bookingResult, onReset }: ConfirmationStepProps) {
  const [copiedId, setCopiedId] = useState(false);
  const [copiedMeet, setCopiedMeet] = useState(false);

  const bookingId = bookingResult.bookingId || "INDUS-BC-CONFIRMED";
  const meetUrl = bookingResult.googleMeetUrl || "https://meet.google.com";
  const isOnline = !formData.consultationMode.includes("In-Person");

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
    details: `Robotics Consultation with INDUS Industrial Robotics.\n\nBooking ID: ${bookingId}\nIndustry: ${formData.industry}\nRobot Category: ${formData.robotCategory}\nApplication: ${formData.specificApplication}\n\nGoogle Meet: ${meetUrl}`,
    location: meetUrl,
    dateStr: formData.selectedDate,
    timeStr: formData.selectedSlot,
  });

  const handleDownloadIcs = () => {
    downloadIcsFile({
      title: `INDUS Robotics Consultation [${bookingId}]`,
      description: `Robotics Consultation session with INDUS Industrial Robotics application engineers.\n\nBooking Reference: ${bookingId}\nIndustry: ${formData.industry}\nRobot: ${formData.robotCategory}\nGoogle Meet: ${meetUrl}`,
      location: meetUrl,
      dateStr: formData.selectedDate,
      timeStr: formData.selectedSlot,
      bookingId: bookingId,
    });
  };

  return (
    <div className="space-y-10">
      {/* Success Hero Badge */}
      <div className="border-2 border-signal bg-surface-dark p-8 sm:p-10 text-center text-surface-foreground relative overflow-hidden">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-signal/20 text-signal mb-4">
          <CheckCircle2 size={36} />
        </div>

        <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-signal">
          Google Calendar Synchronized
        </span>

        <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-white sm:text-4xl">
          Robotics Consultation Confirmed
        </h2>

        <p className="mt-3 max-w-xl mx-auto text-sm text-surface-foreground/80 leading-relaxed">
          Your technical consultation session has been reserved and synchronized directly with the INDUS
          application engineering calendar. A confirmation invitation has been dispatched to{" "}
          <strong className="text-white font-mono">{formData.companyEmail}</strong>.
        </p>

        {/* Reference ID Pill */}
        <div className="mt-6 inline-flex items-center gap-3 border border-signal/60 bg-black/40 px-5 py-2.5">
          <span className="text-xs uppercase font-bold tracking-wider text-muted-foreground">
            Booking Reference ID:
          </span>
          <span className="font-mono text-base font-extrabold text-signal tracking-wider">
            {bookingId}
          </span>
          <button
            type="button"
            onClick={() => copyToClipboard(bookingId, "id")}
            className="text-muted-foreground hover:text-signal transition-colors ml-1"
            title="Copy Reference ID"
          >
            {copiedId ? <Check size={16} className="text-signal" /> : <Copy size={16} />}
          </button>
        </div>
      </div>

      {/* Appointment Coordinates Cards */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Date & Time Card */}
        <div className="border border-border bg-card p-6 space-y-3">
          <div className="flex items-center gap-2 text-signal">
            <Calendar size={18} />
            <h3 className="font-display text-sm font-bold uppercase text-foreground">
              Confirmed Schedule
            </h3>
          </div>

          <div className="space-y-2 pt-2">
            <div>
              <span className="block text-[10px] font-bold uppercase text-muted-foreground">Appointment Date</span>
              <span className="font-display text-lg font-bold text-foreground">
                {formData.selectedDate}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase text-muted-foreground">Consultation Time</span>
              <span className="font-mono text-sm font-bold text-signal">
                {formData.selectedSlot} (Asia/Kolkata IST)
              </span>
              <span className="block text-[11px] text-muted-foreground mt-0.5">
                Duration: 30 minutes with dedicated robotics applications engineer
              </span>
            </div>
          </div>
        </div>

        {/* Location & Video Link Card */}
        <div className="border border-border bg-card p-6 space-y-3">
          <div className="flex items-center gap-2 text-signal">
            {isOnline ? <Video size={18} /> : <Building2 size={18} />}
            <h3 className="font-display text-sm font-bold uppercase text-foreground">
              {isOnline ? "Virtual Meeting Coordinates" : "Facility Location"}
            </h3>
          </div>

          <div className="space-y-3 pt-2">
            {isOnline ? (
              <>
                <div>
                  <span className="block text-[10px] font-bold uppercase text-muted-foreground">Google Meet Link</span>
                  <div className="flex items-center gap-2 mt-1">
                    <a
                      href={meetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-signal underline hover:text-signal/80 truncate max-w-[280px]"
                    >
                      {meetUrl}
                    </a>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(meetUrl, "meet")}
                      className="text-muted-foreground hover:text-foreground shrink-0"
                      title="Copy Google Meet Link"
                    >
                      {copiedMeet ? <Check size={14} className="text-signal" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

                <Button
                  asChild
                  className="w-full rounded-none bg-signal text-xs font-bold uppercase text-signal-foreground hover:bg-signal/90"
                >
                  <a href={meetUrl} target="_blank" rel="noopener noreferrer">
                    Join Google Meet Session
                    <ExternalLink size={13} className="ml-1.5" />
                  </a>
                </Button>
              </>
            ) : (
              <div>
                <span className="block text-[10px] font-bold uppercase text-muted-foreground">On-Site Facility</span>
                <span className="block font-bold text-sm text-foreground mt-1">
                  INDUS Industrial Robotics Automation Facility
                </span>
                <span className="block text-xs text-muted-foreground mt-1 leading-relaxed">
                  Industrial Automation Park, Tech Corridor. Our engineering team will welcome you at reception.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add To Calendar Actions */}
      <div className="border border-border bg-card/60 p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="font-display text-sm font-bold uppercase text-foreground">
            Synchronize to Your Personal Calendar
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Add this confirmed consultation directly to Google Calendar, Outlook, or Apple Calendar.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            asChild
            variant="outline"
            className="rounded-none border-border text-xs font-bold uppercase"
          >
            <a href={gCalUrl} target="_blank" rel="noopener noreferrer">
              <Calendar size={14} className="mr-1.5 text-signal" />
              Add to Google Calendar
            </a>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleDownloadIcs}
            className="rounded-none border-border text-xs font-bold uppercase"
          >
            <Download size={14} className="mr-1.5 text-signal" />
            Download .ICS File
          </Button>
        </div>
      </div>

      {/* Engineering Consultation Next Steps */}
      <div className="border border-border/80 bg-surface-dark/40 p-6 space-y-4">
        <h4 className="font-display text-sm font-bold uppercase text-foreground flex items-center gap-2">
          <ShieldCheck size={16} className="text-signal" />
          <span>What Happens Next</span>
        </h4>

        <div className="grid gap-4 sm:grid-cols-3 text-xs leading-relaxed text-muted-foreground">
          <div className="border-l-2 border-signal pl-3">
            <span className="block font-bold uppercase text-foreground text-[11px] mb-1">
              1. Engineering Briefing
            </span>
            Our application engineering team will review your payload, reach, environment, and cycle time targets before the call.
          </div>

          <div className="border-l-2 border-signal pl-3">
            <span className="block font-bold uppercase text-foreground text-[11px] mb-1">
              2. Live Consultation Session
            </span>
            We will conduct a 30-minute technical session covering kinematic sizing, component selection, fieldbus integration, and layout.
          </div>

          <div className="border-l-2 border-signal pl-3">
            <span className="block font-bold uppercase text-foreground text-[11px] mb-1">
              3. Proposal & Simulation
            </span>
            Following the call, we provide a formal kinematic simulation video, component specification BOM, and budgetary proposal.
          </div>
        </div>
      </div>

      {/* Return Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
        <Button
          type="button"
          variant="outline"
          onClick={onReset}
          className="rounded-none border-border text-xs font-bold uppercase tracking-wider"
        >
          <RefreshCw size={13} className="mr-2" />
          Book Another Consultation
        </Button>

        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="outline"
            className="rounded-none border-border text-xs font-bold uppercase"
          >
            <Link to="/products">
              Explore Products
              <ArrowRight size={13} className="ml-1.5" />
            </Link>
          </Button>

          <Button
            asChild
            className="rounded-none bg-signal text-xs font-bold uppercase text-signal-foreground hover:bg-signal/90"
          >
            <Link to="/">
              <Home size={13} className="mr-1.5" />
              Return to Homepage
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
