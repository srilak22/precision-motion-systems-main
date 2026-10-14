import React, { useState, useEffect } from "react";
import type { ConsultationBookingRecord, BookingStatus } from "@/types/consultation";
import {
  fetchAdminBookings,
  updateBookingStatus,
  cancelConsultationBooking,
} from "@/lib/consultation-api";
import { companyConfig } from "@/data/config";
import {
  Calendar,
  Clock,
  Search,
  Filter,
  Download,
  ExternalLink,
  Video,
  Building2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Eye,
  X,
  FileSpreadsheet,
  ShieldCheck,
  User,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  Flame,
  Layers,
  Wrench,
  ChevronDown,
  Edit3,
  Trash2,
  CalendarCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const STATUS_COLORS: Record<BookingStatus, { bg: string; text: string; border: string }> = {
  New: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30" },
  Confirmed: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" },
  "In Progress": { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" },
  Completed: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/30" },
  Cancelled: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/30" },
  Rescheduled: { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/30" },
};

export function BookingManagementDashboard() {
  const [bookings, setBookings] = useState<ConsultationBookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [industryFilter, setIndustryFilter] = useState<string>("all");

  // Modals
  const [inspectBooking, setInspectBooking] = useState<ConsultationBookingRecord | null>(null);
  const [statusModalBooking, setStatusModalBooking] = useState<ConsultationBookingRecord | null>(null);
  const [newStatus, setNewStatus] = useState<BookingStatus>("Confirmed");
  const [statusNotes, setStatusNotes] = useState("");
  const [updating, setUpdating] = useState(false);

  const [cancelModalBooking, setCancelModalBooking] = useState<ConsultationBookingRecord | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);

  const loadBookings = () => {
    setLoading(true);
    setError(null);
    fetchAdminBookings()
      .then((res) => {
        setLoading(false);
        if (res.status === "success") {
          setBookings(res.bookings || []);
        } else {
          setError(res.message || "Failed to load bookings");
        }
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message || "Failed to connect to bookings API");
      });
  };

  useEffect(() => {
    loadBookings();
  }, []);

  // Filter & Search Logic
  const filteredBookings = bookings.filter((b) => {
    // Status filter
    if (statusFilter !== "all" && b.status !== statusFilter) return false;

    // Industry filter
    if (industryFilter !== "all" && b.industry !== industryFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        b.bookingId?.toLowerCase().includes(q) ||
        b.customerName?.toLowerCase().includes(q) ||
        b.companyName?.toLowerCase().includes(q) ||
        b.customerEmail?.toLowerCase().includes(q) ||
        b.industry?.toLowerCase().includes(q) ||
        b.robotCategory?.toLowerCase().includes(q) ||
        b.specificApplication?.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  // Calculate Metrics
  const totalCount = bookings.length;
  const newCount = bookings.filter((b) => b.status === "New").length;
  const confirmedCount = bookings.filter((b) => b.status === "Confirmed").length;
  const inProgressCount = bookings.filter((b) => b.status === "In Progress").length;
  const completedCount = bookings.filter((b) => b.status === "Completed").length;
  const cancelledCount = bookings.filter((b) => b.status === "Cancelled").length;

  // Handle Status Update
  const handleUpdateStatusSubmit = async () => {
    if (!statusModalBooking) return;
    setUpdating(true);
    try {
      await updateBookingStatus(statusModalBooking.bookingId, newStatus, statusNotes);
      setStatusModalBooking(null);
      loadBookings();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  // Handle Cancel
  const handleCancelSubmit = async () => {
    if (!cancelModalBooking) return;
    setCancelling(true);
    try {
      await cancelConsultationBooking(cancelModalBooking.bookingId, cancelReason);
      setCancelModalBooking(null);
      loadBookings();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to cancel booking");
    } finally {
      setCancelling(false);
    }
  };

  // Export to CSV
  const handleExportCsv = () => {
    if (filteredBookings.length === 0) return;

    const headers = [
      "Booking Reference ID",
      "Status",
      "Appointment Date",
      "Appointment Time",
      "Timezone",
      "Customer Name",
      "Company Name",
      "Official Email",
      "Phone Number",
      "Job Title",
      "Country",
      "City",
      "Company Website",
      "Industry",
      "Robot Category",
      "Specific Application",
      "Project Stage",
      "Preferred Solution",
      "Consultation Mode",
      "Google Meet Link",
      "Material Handled",
      "Payload (kg)",
      "Reach (mm)",
      "Cycle Time (s)",
      "Operating Environment",
      "Accuracy",
      "Production Shifts",
      "Existing Equipment",
      "Budget",
      "Timeline",
      "Created At",
    ];

    const escapeCsv = (val: unknown) => {
      if (val === undefined || val === null) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = filteredBookings.map((b) => [
      escapeCsv(b.bookingId),
      escapeCsv(b.status),
      escapeCsv(b.appointmentDate),
      escapeCsv(b.appointmentTime),
      escapeCsv(b.timezone),
      escapeCsv(b.customerName),
      escapeCsv(b.companyName),
      escapeCsv(b.customerEmail),
      escapeCsv(b.phoneNumber),
      escapeCsv(b.jobTitle),
      escapeCsv(b.country),
      escapeCsv(b.city),
      escapeCsv(b.companyWebsite || ""),
      escapeCsv(b.industry),
      escapeCsv(b.robotCategory),
      escapeCsv(b.specificApplication),
      escapeCsv(b.projectStage),
      escapeCsv(b.preferredSolution),
      escapeCsv(b.consultationMode),
      escapeCsv(b.googleMeetUrl || ""),
      escapeCsv(b.materialHandled || ""),
      escapeCsv(b.payloadKg || ""),
      escapeCsv(b.reachMm || ""),
      escapeCsv(b.cycleTimeSec || ""),
      escapeCsv(b.operatingEnvironment || ""),
      escapeCsv(b.accuracyRequirement || ""),
      escapeCsv(b.productionShifts || ""),
      escapeCsv(b.existingEquipment || ""),
      escapeCsv(b.projectBudget || ""),
      escapeCsv(b.implementationTimeline || ""),
      escapeCsv(b.createdAt),
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `indus-robotics-consultations-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner & Fast Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-signal">
            <CalendarCheck size={14} />
            <span>Consultation Pipeline & Scheduling Control</span>
          </div>
          <h2 className="mt-1 font-display text-2xl font-bold uppercase text-foreground sm:text-3xl">
            Robotics Consultation Bookings
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Synchronized bidirectionally with Google Calendar and Google Sheets.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={companyConfig.appointmentSheetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs font-bold uppercase text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-400 transition-colors"
          >
            <FileSpreadsheet size={14} />
            <span>Open Google Sheet</span>
            <ExternalLink size={11} className="opacity-70" />
          </a>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            disabled={filteredBookings.length === 0}
            className="rounded-none border-border text-xs font-bold uppercase"
          >
            <Download size={13} className="mr-1.5 text-signal" />
            Export CSV ({filteredBookings.length})
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={loadBookings}
            className="rounded-none border-border text-xs font-bold uppercase"
          >
            <RefreshCw size={13} className={`mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <div className="border border-border bg-card p-4">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Total Consultations
          </span>
          <span className="mt-1 block font-display text-2xl font-bold text-foreground">
            {totalCount}
          </span>
        </div>

        <div className="border border-border bg-card p-4">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-400">
            New Leads
          </span>
          <span className="mt-1 block font-display text-2xl font-bold text-amber-400">
            {newCount}
          </span>
        </div>

        <div className="border border-border bg-card p-4">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-400">
            Confirmed
          </span>
          <span className="mt-1 block font-display text-2xl font-bold text-emerald-400">
            {confirmedCount}
          </span>
        </div>

        <div className="border border-border bg-card p-4">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-blue-400">
            In Progress
          </span>
          <span className="mt-1 block font-display text-2xl font-bold text-blue-400">
            {inProgressCount}
          </span>
        </div>

        <div className="border border-border bg-card p-4">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-purple-400">
            Completed
          </span>
          <span className="mt-1 block font-display text-2xl font-bold text-purple-400">
            {completedCount}
          </span>
        </div>

        <div className="border border-border bg-card p-4">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-rose-400">
            Cancelled
          </span>
          <span className="mt-1 block font-display text-2xl font-bold text-rose-400">
            {cancelledCount}
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="border border-border bg-card p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-3 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by company, name, email, industry, or Ref ID..."
            className="pl-9 bg-background border-border text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 border border-border bg-background px-2.5 text-xs text-foreground focus:outline-none focus:border-signal"
            >
              <option value="all">All Statuses ({totalCount})</option>
              <option value="New">New ({newCount})</option>
              <option value="Confirmed">Confirmed ({confirmedCount})</option>
              <option value="In Progress">In Progress ({inProgressCount})</option>
              <option value="Completed">Completed ({completedCount})</option>
              <option value="Cancelled">Cancelled ({cancelledCount})</option>
              <option value="Rescheduled">Rescheduled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="border border-border bg-card overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <RefreshCw size={24} className="animate-spin text-signal mb-2" />
            <span className="text-xs uppercase tracking-wider font-semibold">
              Loading Consultation Bookings...
            </span>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-destructive space-y-2">
            <AlertCircle size={24} className="mx-auto" />
            <p className="text-xs font-semibold">{error}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={loadBookings}
              className="rounded-none border-border text-xs uppercase"
            >
              Retry
            </Button>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground space-y-2">
            <Calendar size={28} className="mx-auto text-muted-foreground/60" />
            <p className="text-xs font-semibold uppercase tracking-wider">
              No consultation appointments match your current filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/40 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="py-3 px-4">Ref ID / Status</th>
                  <th className="py-3 px-4">Scheduled Date & Time</th>
                  <th className="py-3 px-4">Customer & Company</th>
                  <th className="py-3 px-4">Industry & Robot Solution</th>
                  <th className="py-3 px-4">Format</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 font-mono text-[11px]">
                {filteredBookings.map((b) => {
                  const statusStyle = STATUS_COLORS[b.status] || STATUS_COLORS.Confirmed;
                  const isOnline = !b.consultationMode?.includes("In-Person");

                  return (
                    <tr key={b.bookingId} className="hover:bg-muted/30 transition-colors">
                      {/* Ref ID & Status */}
                      <td className="py-3.5 px-4 font-sans">
                        <span className="font-mono text-xs font-bold text-foreground">
                          {b.bookingId}
                        </span>
                        <div className="mt-1">
                          <span
                            className={`inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                          >
                            {b.status}
                          </span>
                        </div>
                      </td>

                      {/* Date & Time */}
                      <td className="py-3.5 px-4 font-sans">
                        <span className="block font-bold text-xs text-foreground">
                          {b.appointmentDate}
                        </span>
                        <span className="block font-mono text-[11px] text-signal font-semibold mt-0.5">
                          {b.appointmentTime} (IST)
                        </span>
                      </td>

                      {/* Customer & Company */}
                      <td className="py-3.5 px-4 font-sans">
                        <span className="block font-bold text-xs text-foreground">
                          {b.customerName}
                        </span>
                        <span className="block text-[11px] text-muted-foreground mt-0.5">
                          {b.jobTitle ? `${b.jobTitle} · ` : ""}{b.companyName}
                        </span>
                        <span className="block font-mono text-[10px] text-muted-foreground/80 mt-0.5">
                          {b.customerEmail}
                        </span>
                      </td>

                      {/* Industry & Robot */}
                      <td className="py-3.5 px-4 font-sans">
                        <span className="block font-bold text-xs text-signal">
                          {b.robotCategory}
                        </span>
                        <span className="block text-[11px] text-muted-foreground mt-0.5">
                          {b.industry}
                        </span>
                        {b.payloadKg && (
                          <span className="block text-[10px] text-muted-foreground font-mono">
                            Payload: {b.payloadKg}kg · Reach: {b.reachMm || "N/A"}mm
                          </span>
                        )}
                      </td>

                      {/* Meeting Format */}
                      <td className="py-3.5 px-4 font-sans">
                        <div className="flex items-center gap-1.5 text-xs text-foreground">
                          {isOnline ? (
                            <>
                              <Video size={13} className="text-signal" />
                              <span>Google Meet</span>
                            </>
                          ) : (
                            <>
                              <Building2 size={13} className="text-signal" />
                              <span>On-Site</span>
                            </>
                          )}
                        </div>
                        {isOnline && b.googleMeetUrl && (
                          <a
                            href={b.googleMeetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] text-signal hover:underline mt-1"
                          >
                            <span>Open Meet</span>
                            <ExternalLink size={9} />
                          </a>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right font-sans">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setInspectBooking(b)}
                            title="Inspect Technical Specs"
                            className="h-7 rounded-none px-2 text-[10px] font-bold uppercase border-border hover:border-signal"
                          >
                            <Eye size={12} className="mr-1" /> Specs
                          </Button>

                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setStatusModalBooking(b);
                              setNewStatus(b.status);
                              setStatusNotes(b.adminNotes || "");
                            }}
                            title="Update Status"
                            className="h-7 rounded-none px-2 text-[10px] font-bold uppercase border-border hover:border-signal"
                          >
                            <Edit3 size={12} className="mr-1" /> Status
                          </Button>

                          {b.status !== "Cancelled" && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setCancelModalBooking(b);
                                setCancelReason("");
                              }}
                              title="Cancel Booking"
                              className="h-7 rounded-none px-2 text-[10px] font-bold uppercase border-border hover:border-destructive text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 size={12} />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL 1: Inspect Technical Specifications */}
      {inspectBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="max-w-2xl w-full border border-border bg-card p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-start justify-between border-b border-border/40 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-signal">
                  Technical Consultation Specification
                </span>
                <h3 className="font-display text-xl font-bold uppercase text-foreground">
                  {inspectBooking.bookingId} — {inspectBooking.companyName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectBooking(null)}
                className="text-muted-foreground hover:text-foreground p-1"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Grid */}
            <div className="grid gap-6 sm:grid-cols-2 text-xs">
              <div className="space-y-3">
                <h4 className="font-display font-bold uppercase text-signal text-xs">
                  Customer & Contact
                </h4>
                <div className="space-y-1.5 text-muted-foreground">
                  <p><strong className="text-foreground">Name:</strong> {inspectBooking.customerName}</p>
                  <p><strong className="text-foreground">Designation:</strong> {inspectBooking.jobTitle || "N/A"}</p>
                  <p><strong className="text-foreground">Company:</strong> {inspectBooking.companyName}</p>
                  <p><strong className="text-foreground">Email:</strong> {inspectBooking.customerEmail}</p>
                  <p><strong className="text-foreground">Phone:</strong> {inspectBooking.phoneNumber}</p>
                  <p><strong className="text-foreground">Location:</strong> {inspectBooking.city}, {inspectBooking.country}</p>
                  {inspectBooking.companyWebsite && (
                    <p><strong className="text-foreground">Website:</strong> {inspectBooking.companyWebsite}</p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-display font-bold uppercase text-signal text-xs">
                  Appointment & Meeting
                </h4>
                <div className="space-y-1.5 text-muted-foreground">
                  <p><strong className="text-foreground">Status:</strong> {inspectBooking.status}</p>
                  <p><strong className="text-foreground">Date:</strong> {inspectBooking.appointmentDate}</p>
                  <p><strong className="text-foreground">Time:</strong> {inspectBooking.appointmentTime} ({inspectBooking.timezone})</p>
                  <p><strong className="text-foreground">Mode:</strong> {inspectBooking.consultationMode}</p>
                  <p><strong className="text-foreground">Calendar ID:</strong> <span className="font-mono text-[10px]">{inspectBooking.calendarEventId}</span></p>
                  {inspectBooking.googleMeetUrl && (
                    <p><strong className="text-foreground">Meet Link:</strong> <a href={inspectBooking.googleMeetUrl} target="_blank" rel="noopener noreferrer" className="text-signal underline">{inspectBooking.googleMeetUrl}</a></p>
                  )}
                </div>
              </div>

              <div className="space-y-3 sm:col-span-2 border-t border-border/40 pt-4">
                <h4 className="font-display font-bold uppercase text-signal text-xs">
                  Robotics Requirement & Technical Parameters
                </h4>
                <div className="grid gap-3 sm:grid-cols-2 text-muted-foreground">
                  <p><strong className="text-foreground">Industry:</strong> {inspectBooking.industry}</p>
                  <p><strong className="text-foreground">Robot Category:</strong> {inspectBooking.robotCategory}</p>
                  <p><strong className="text-foreground">Application:</strong> {inspectBooking.specificApplication}</p>
                  <p><strong className="text-foreground">Project Stage:</strong> {inspectBooking.projectStage}</p>
                  <p><strong className="text-foreground">Solution Scope:</strong> {inspectBooking.preferredSolution}</p>
                  <p><strong className="text-foreground">Material Handled:</strong> {inspectBooking.materialHandled}</p>
                  <p><strong className="text-foreground">Payload (kg):</strong> {inspectBooking.payloadKg || "To be sized"}</p>
                  <p><strong className="text-foreground">Reach (mm):</strong> {inspectBooking.reachMm || "To be determined"}</p>
                  <p><strong className="text-foreground">Cycle Time:</strong> {inspectBooking.cycleTimeSec || "To be estimated"}</p>
                  <p><strong className="text-foreground">Environment:</strong> {inspectBooking.operatingEnvironment || "Standard"}</p>
                  <p><strong className="text-foreground">Accuracy:</strong> {inspectBooking.accuracyRequirement || "Standard"}</p>
                  <p><strong className="text-foreground">Shifts:</strong> {inspectBooking.productionShifts || "N/A"}</p>
                  <p><strong className="text-foreground">Existing PLC:</strong> {inspectBooking.existingEquipment || "None"}</p>
                  <p><strong className="text-foreground">Budget:</strong> {inspectBooking.projectBudget || "Flexible"}</p>
                  <p><strong className="text-foreground">Timeline:</strong> {inspectBooking.implementationTimeline || "N/A"}</p>
                </div>
              </div>

              {inspectBooking.projectDescription && (
                <div className="space-y-1.5 sm:col-span-2 border-t border-border/40 pt-3">
                  <h4 className="font-bold text-foreground text-xs uppercase">Project Description</h4>
                  <p className="text-xs text-muted-foreground bg-background p-3 border border-border leading-relaxed">
                    {inspectBooking.projectDescription}
                  </p>
                </div>
              )}

              {inspectBooking.additionalComments && (
                <div className="space-y-1.5 sm:col-span-2">
                  <h4 className="font-bold text-foreground text-xs uppercase">Client Additional Comments</h4>
                  <p className="text-xs text-muted-foreground bg-background p-3 border border-border leading-relaxed">
                    {inspectBooking.additionalComments}
                  </p>
                </div>
              )}

              {inspectBooking.adminNotes && (
                <div className="space-y-1.5 sm:col-span-2">
                  <h4 className="font-bold text-signal text-xs uppercase">Internal Engineering Notes</h4>
                  <p className="text-xs text-muted-foreground bg-signal/5 p-3 border border-signal/30 leading-relaxed">
                    {inspectBooking.adminNotes}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4 border-t border-border">
              <Button
                type="button"
                onClick={() => setInspectBooking(null)}
                className="rounded-none bg-signal text-xs font-bold uppercase text-signal-foreground hover:bg-signal/90"
              >
                Close Specification
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Update Status */}
      {statusModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="max-w-md w-full border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <h3 className="font-display text-base font-bold uppercase text-foreground">
                Update Booking Status
              </h3>
              <button
                type="button"
                onClick={() => setStatusModalBooking(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="block text-muted-foreground">Booking ID:</span>
                <span className="font-mono font-bold text-foreground">{statusModalBooking.bookingId}</span>
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-foreground uppercase tracking-wider text-[11px]">
                  Select New Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as BookingStatus)}
                  className="w-full h-10 border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:border-signal"
                >
                  <option value="New">New</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Rescheduled">Rescheduled</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-foreground uppercase tracking-wider text-[11px]">
                  Internal Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  placeholder="e.g. Sizing simulation reviewed; client tender deadline 25th Oct."
                  className="w-full border border-border bg-background p-2.5 text-xs text-foreground focus:outline-none focus:border-signal"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-border">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setStatusModalBooking(null)}
                className="rounded-none border-border text-xs uppercase"
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={updating}
                onClick={handleUpdateStatusSubmit}
                className="rounded-none bg-signal text-xs font-bold uppercase text-signal-foreground hover:bg-signal/90"
              >
                {updating ? "Updating..." : "Save Status"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Cancel Booking */}
      {cancelModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="max-w-md w-full border border-destructive/50 bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <h3 className="font-display text-base font-bold uppercase text-destructive">
                Cancel Consultation Appointment
              </h3>
              <button
                type="button"
                onClick={() => setCancelModalBooking(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to cancel booking <strong className="text-foreground font-mono">{cancelModalBooking.bookingId}</strong> for{" "}
              <strong className="text-foreground">{cancelModalBooking.customerName}</strong> ({cancelModalBooking.companyName})? This will update the
              Google Calendar schedule and mark the Google Sheet row as Cancelled.
            </p>

            <div className="space-y-1.5 text-xs">
              <label className="block font-bold text-foreground uppercase tracking-wider text-[11px]">
                Reason for Cancellation
              </label>
              <Input
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Rescheduled by client, Duplicate entry, Project deferred"
                className="bg-background border-border text-xs"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-border">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCancelModalBooking(null)}
                className="rounded-none border-border text-xs uppercase"
              >
                Keep Booking
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={cancelling}
                onClick={handleCancelSubmit}
                className="rounded-none bg-destructive text-xs font-bold uppercase text-white hover:bg-destructive/90"
              >
                {cancelling ? "Cancelling..." : "Confirm Cancellation"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
