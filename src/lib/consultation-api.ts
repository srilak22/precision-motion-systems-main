import type {
  BookingFormData,
  ConsultationSlot,
  ConsultationBookingRecord,
  BookingStatus,
} from "@/types/consultation";

const API_BASE = "/api/consultation";

export interface SlotsResponse {
  status: "success" | "error";
  date: string;
  timezone: string;
  slots: ConsultationSlot[];
  message?: string | undefined;
}

export interface BookingResponse {
  status: "success" | "error";
  bookingId?: string | undefined;
  calendarEventId?: string | undefined;
  googleMeetUrl?: string | undefined;
  appointmentDate?: string | undefined;
  appointmentTime?: string | undefined;
  timezone?: string | undefined;
  customerName?: string | undefined;
  companyName?: string | undefined;
  message?: string | undefined;
  error?: string | undefined;
}

/**
 * Retrieves live slot availability for a specified date.
 */
export async function fetchConsultationSlots(
  date: string,
  timezone: string = "Asia/Kolkata",
): Promise<SlotsResponse> {
  try {
    const res = await fetch(
      `${API_BASE}?action=slots&date=${encodeURIComponent(date)}&timezone=${encodeURIComponent(timezone)}`,
      {
        headers: { Accept: "application/json" },
      },
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to fetch slots (HTTP ${res.status})`);
    }

    return await res.json();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to load appointment slots";
    return {
      status: "error",
      date,
      timezone,
      slots: [],
      message: msg,
    };
  }
}

/**
 * Submits the complete robotics consultation enquiry and confirms the calendar appointment.
 */
export async function submitConsultationBooking(data: BookingFormData): Promise<BookingResponse> {
  const res = await fetch(`${API_BASE}?action=book`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json.message || json.error || `Booking submission failed (HTTP ${res.status})`);
  }

  return json as BookingResponse;
}

/**
 * Admin: Fetches all consultation bookings.
 */
export async function fetchAdminBookings(token?: string): Promise<{
  status: string;
  count?: number | undefined;
  bookings: ConsultationBookingRecord[];
  message?: string | undefined;
}> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}?action=list`, {
    headers,
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to fetch bookings (HTTP ${res.status})`);
  }

  return await res.json();
}

/**
 * Admin: Updates the status of a consultation booking.
 */
export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus,
  adminNotes?: string,
): Promise<{ status: string; message: string }> {
  const res = await fetch(`${API_BASE}?action=update_status`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    credentials: "include",
    body: JSON.stringify({ bookingId, status, adminNotes }),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.message || `Failed to update status (HTTP ${res.status})`);
  }
  return json;
}

/**
 * Cancels a booking.
 */
export async function cancelConsultationBooking(
  bookingId: string,
  reason?: string,
): Promise<{ status: string; message: string }> {
  const res = await fetch(`${API_BASE}?action=cancel`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    credentials: "include",
    body: JSON.stringify({ bookingId, reason }),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.message || `Failed to cancel booking (HTTP ${res.status})`);
  }
  return json;
}

/**
 * Generates an instant "Add to Google Calendar" web link.
 */
export function getGoogleCalendarLink(params: {
  title: string;
  details: string;
  location?: string | undefined;
  dateStr: string; // YYYY-MM-DD
  timeStr: string; // e.g. "10:00" or "10:00 - 10:30"
}): string {
  const [year, month, day] = params.dateStr.split("-").map(Number);
  const timeMatch = params.timeStr.match(/(\d{1,2}):(\d{2})/);
  const hour = timeMatch ? Number(timeMatch[1]) : 10;
  const minute = timeMatch ? Number(timeMatch[2]) : 0;

  // Assume IST (+05:30)
  // Format as UTC ISO: YYYYMMDDTHHmmSSZ
  const istOffsetMs = 5.5 * 60 * 60 * 1000;
  const localUtcMs = Date.UTC(year || 2026, (month || 1) - 1, day || 1, hour, minute) - istOffsetMs;
  const startIso = new Date(localUtcMs).toISOString().replace(/-|:|\.\d+/g, "");
  const endIso = new Date(localUtcMs + 30 * 60 * 1000).toISOString().replace(/-|:|\.\d+/g, "");

  const base = "https://calendar.google.com/calendar/render?action=TEMPLATE";
  const query = new URLSearchParams({
    text: params.title,
    dates: `${startIso}/${endIso}`,
    details: params.details,
    location: params.location || "",
  });

  return `${base}&${query.toString()}`;
}

/**
 * Downloads a universal .ICS calendar file (for Apple Calendar, Outlook, Office 365).
 */
export function downloadIcsFile(params: {
  title: string;
  description: string;
  location?: string | undefined;
  dateStr: string;
  timeStr: string;
  bookingId: string;
}): void {
  const [year, month, day] = params.dateStr.split("-").map(Number);
  const timeMatch = params.timeStr.match(/(\d{1,2}):(\d{2})/);
  const hour = timeMatch ? Number(timeMatch[1]) : 10;
  const minute = timeMatch ? Number(timeMatch[2]) : 0;

  const istOffsetMs = 5.5 * 60 * 60 * 1000;
  const localUtcMs = Date.UTC(year || 2026, (month || 1) - 1, day || 1, hour, minute) - istOffsetMs;
  const startIso = new Date(localUtcMs).toISOString().replace(/-|:|\.\d+/g, "");
  const endIso = new Date(localUtcMs + 30 * 60 * 1000).toISOString().replace(/-|:|\.\d+/g, "");

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//INDUS Industrial Robotics//Robotics Consultation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${params.bookingId}@indus-robotics.com`,
    `DTSTAMP:${new Date().toISOString().replace(/-|:|\.\d+/g, "")}`,
    `DTSTART:${startIso}`,
    `DTEND:${endIso}`,
    `SUMMARY:${params.title.replace(/\n/g, " ")}`,
    `DESCRIPTION:${params.description.replace(/\n/g, "\\n")}`,
    `LOCATION:${(params.location || "").replace(/\n/g, " ")}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute("download", `indus-consultation-${params.bookingId}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
