/**
 * =============================================================================
 * INDUS Industrial Robotics — Google Calendar to Google Sheets Synchronization
 * =============================================================================
 * Purpose:
 *   Automatically synchronizes Google Calendar Appointment Schedule bookings
 *   into a dedicated "Appointment Bookings" tab in Google Sheets.
 *
 * Features:
 *   1. Extracts booking details: Event ID, Customer Name, Email, Company,
 *      Appointment Purpose, Date, Time, Status, Creation Timestamp, Meeting Link.
 *   2. Deduplication: Primary key matching on Event ID prevents duplicate rows.
 *   3. Handles cancellations (sets Status to "Cancelled") and rescheduling
 *      (updates Date/Time and sets Status to "Rescheduled").
 *   4. Customer confirmation preservation: Never sends duplicate emails to
 *      customers (handled natively by Google Calendar).
 *   5. Admin notification: Sends exactly ONE email to the admin per new booking
 *      and tracks notification state in the sheet to prevent duplicates.
 *   6. Automated setup: Creates the tab, formats headers, and installs a
 *      5-minute time-driven trigger automatically.
 * =============================================================================
 */

// CONFIGURATION
const CONFIG = {
  SPREADSHEET_ID: "1S-ApP83X9Y1-nXwim0tDNGn72wuhVn4PSbaWkcXlH48",
  SHEET_TAB_NAME: "Appointment Bookings",
  ADMIN_EMAIL: "srilakshanaint2027g3@gmail.com",
  CALENDAR_SCHEDULE_TITLE: "INDUSTRY VISIT",
  LOOKBACK_DAYS: 30,
  LOOKAHEAD_DAYS: 180,
  TRIGGER_FREQUENCY_MINUTES: 5,
};

// HEADERS SCHEMA (Columns A to L)
const HEADERS = [
  "Event ID",
  "Customer Name",
  "Customer Email",
  "Company",
  "Appointment Purpose",
  "Date",
  "Time",
  "Status",
  "Creation Timestamp",
  "Meeting Location / Link",
  "Admin Notified",
  "Last Synced Timestamp",
];

/**
 * One-click Setup Function:
 * 1. Creates and formats the "Appointment Bookings" tab.
 * 2. Installs a 5-minute time-driven trigger for automatic syncing.
 * 3. Performs an immediate synchronization run.
 */
function setupAppointmentSync() {
  const ss = getTargetSpreadsheet();
  const sheet = getOrCreateBookingsSheet(ss);
  
  // Install trigger if not already present
  installSyncTrigger();

  // Run initial synchronization
  const result = syncCalendarAppointments();
  Logger.log("Setup complete. Initial sync result: " + JSON.stringify(result));
  return { status: "success", message: "Setup completed successfully", syncResult: result };
}

/**
 * Main Synchronization Function (Called by time-driven trigger every 5 minutes)
 */
function syncCalendarAppointments() {
  const ss = getTargetSpreadsheet();
  const sheet = getOrCreateBookingsSheet(ss);
  const now = new Date();

  const startDate = new Date(now.getTime() - CONFIG.LOOKBACK_DAYS * 24 * 60 * 60 * 1000);
  const endDate = new Date(now.getTime() + CONFIG.LOOKAHEAD_DAYS * 24 * 60 * 60 * 1000);

  // Retrieve calendar events
  const calendar = CalendarApp.getDefaultCalendar();
  const events = calendar.getEvents(startDate, endDate);

  // Filter for appointment schedule events (matching title or appointment booking markers)
  const appointmentEvents = events.filter(isAppointmentEvent);

  // Load existing sheet data into memory map keyed by Event ID
  const lastRow = sheet.getLastRow();
  const existingRecords = new Map(); // eventId -> { rowIndex, rowData }

  if (lastRow > 1) {
    const rangeData = sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
    for (let i = 0; i < rangeData.length; i++) {
      const row = rangeData[i];
      const eventId = String(row[0] || "").trim();
      if (eventId) {
        existingRecords.set(eventId, {
          rowIndex: i + 2,
          data: row,
        });
      }
    }
  }

  const seenEventIdsInCalendar = new Set();
  let createdCount = 0;
  let updatedCount = 0;
  let cancelledCount = 0;
  const newBookingsToNotify = [];

  // Process all active calendar events
  for (const event of appointmentEvents) {
    const eventId = event.getId();
    seenEventIdsInCalendar.add(eventId);

    const bookingDetails = extractBookingDetails(event);
    const existing = existingRecords.get(eventId);

    if (!existing) {
      // 1. NEW BOOKING -> Append row
      const newRow = [
        eventId,
        bookingDetails.customerName,
        bookingDetails.customerEmail,
        bookingDetails.company,
        bookingDetails.purpose,
        bookingDetails.dateStr,
        bookingDetails.timeStr,
        "Confirmed",
        bookingDetails.createdTimestamp,
        bookingDetails.meetingLink,
        "No", // Admin Notified
        formatIso(now), // Last Synced
      ];

      sheet.appendRow(newRow);
      createdCount++;

      // Track for admin notification
      newBookingsToNotify.push({
        rowIndex: sheet.getLastRow(),
        details: bookingDetails,
      });
    } else {
      // 2. EXISTING BOOKING -> Check for rescheduling or status changes
      const prevRow = existing.data;
      const prevDate = String(prevRow[5] || "");
      const prevTime = String(prevRow[6] || "");
      const prevStatus = String(prevRow[7] || "");
      let needsUpdate = false;
      let newStatus = prevStatus;

      // Check if rescheduled
      if (prevDate !== bookingDetails.dateStr || prevTime !== bookingDetails.timeStr) {
        newStatus = "Rescheduled";
        needsUpdate = true;
      } else if (prevStatus === "Cancelled") {
        newStatus = "Confirmed";
        needsUpdate = true;
      }

      if (needsUpdate) {
        sheet.getRange(existing.rowIndex, 6).setValue(bookingDetails.dateStr);
        sheet.getRange(existing.rowIndex, 7).setValue(bookingDetails.timeStr);
        sheet.getRange(existing.rowIndex, 8).setValue(newStatus);
        sheet.getRange(existing.rowIndex, 10).setValue(bookingDetails.meetingLink);
        sheet.getRange(existing.rowIndex, 12).setValue(formatIso(now));
        updatedCount++;
      } else {
        // Just touch the last synced timestamp periodically
        sheet.getRange(existing.rowIndex, 12).setValue(formatIso(now));
      }
    }
  }

  // 3. CANCELLATION DETECTION
  // If an existing row with status Confirmed/Rescheduled is within the sync window
  // but is NO LONGER present in the calendar, mark it as Cancelled
  for (const [eventId, record] of existingRecords.entries()) {
    const status = String(record.data[7] || "");
    const dateStr = String(record.data[5] || "");
    const eventDate = new Date(dateStr);

    if ((status === "Confirmed" || status === "Rescheduled") && !seenEventIdsInCalendar.has(eventId)) {
      // Check if event falls inside our active sync window
      if (eventDate >= startDate && eventDate <= endDate) {
        sheet.getRange(record.rowIndex, 8).setValue("Cancelled");
        sheet.getRange(record.rowIndex, 12).setValue(formatIso(now));
        cancelledCount++;
      }
    }
  }

  // 4. ADMIN EMAIL NOTIFICATIONS (ONE per new booking, duplicate-protected)
  for (const item of newBookingsToNotify) {
    try {
      sendAdminNotification(item.details);
      sheet.getRange(item.rowIndex, 11).setValue("Yes"); // Mark Admin Notified
    } catch (emailErr) {
      Logger.log("Failed to send admin notification for row " + item.rowIndex + ": " + emailErr.message);
    }
  }

  const summary = {
    timestamp: formatIso(now),
    eventsScanned: appointmentEvents.length,
    created: createdCount,
    updated: updatedCount,
    cancelled: cancelledCount,
    notificationsSent: newBookingsToNotify.length,
  };

  Logger.log("Sync completed: " + JSON.stringify(summary));
  return summary;
}

/**
 * Checks whether an event is from Google Calendar Appointment Schedules
 */
function isAppointmentEvent(event) {
  const title = (event.getTitle() || "").toUpperCase();
  const desc = event.getDescription() || "";

  // 1. Matches configured schedule title
  if (title.indexOf(CONFIG.CALENDAR_SCHEDULE_TITLE.toUpperCase()) !== -1) {
    return true;
  }

  // 2. Google Appointment Schedule signatures in description
  if (
    desc.indexOf("calendar.google.com/appointments") !== -1 ||
    desc.indexOf("Booked by:") !== -1 ||
    desc.indexOf("Booking details:") !== -1 ||
    desc.indexOf("google.com/calendar/appointments") !== -1
  ) {
    return true;
  }

  // 3. Has external attendee / guest list
  const guests = event.getGuestList();
  if (guests && guests.length > 0) {
    return true;
  }

  return false;
}

/**
 * Extracts structured details from Google Calendar Appointment Event
 */
function extractBookingDetails(event) {
  const desc = event.getDescription() || "";
  const title = event.getTitle() || "";
  const guests = event.getGuestList();
  const startTime = event.getStartTime();
  const endTime = event.getEndTime();
  let created = new Date();
  try {
    if (typeof event.getDateCreated === "function") {
      created = event.getDateCreated() || new Date();
    }
  } catch (e) {
    created = new Date();
  }

  // 1. Customer Name & Email
  let customerName = "";
  let customerEmail = "";

  // Check guest list
  if (guests && guests.length > 0) {
    const primaryGuest = guests[0];
    customerEmail = primaryGuest.getEmail() || "";
    customerName = primaryGuest.getName() || "";
  }

  // Regex fallback in description for Appointment Schedule fields
  if (!customerName) {
    const nameMatch = desc.match(/(?:Booked by|Customer Name|Name):\s*([^\n\r<]+)/i);
    if (nameMatch) customerName = nameMatch[1].trim();
  }
  if (!customerEmail) {
    const emailMatch = desc.match(/(?:Email|Customer Email):\s*([^\n\r<\s]+@[^\n\r<\s]+)/i);
    if (emailMatch) customerEmail = emailMatch[1].trim();
  }

  // If still no name, derive from title: "INDUSTRY VISIT - John Doe" or "John Doe and Sri Lakshana"
  if (!customerName) {
    if (title.indexOf(" - ") !== -1) {
      customerName = title.split(" - ")[1].trim();
    } else if (title.indexOf(" and ") !== -1) {
      customerName = title.split(" and ")[0].trim();
    } else {
      customerName = title.replace(CONFIG.CALENDAR_SCHEDULE_TITLE, "").trim() || "Customer";
    }
  }

  // 2. Company
  let company = "Not Specified";
  const companyMatch = desc.match(/(?:Company|Company Name|Organization|Org):\s*([^\n\r<]+)/i);
  if (companyMatch) {
    company = companyMatch[1].trim();
  }

  // 3. Appointment Purpose
  let purpose = CONFIG.CALENDAR_SCHEDULE_TITLE;
  const purposeMatch = desc.match(
    /(?:Purpose|Requirement|Reason|Notes|Topic|Tell us about your requirement|Project description):\s*([^\n\r<]+)/i
  );
  if (purposeMatch) {
    purpose = purposeMatch[1].trim();
  }

  // 4. Date and Time Formatting
  const timeZone = Session.getScriptTimeZone();
  const dateStr = Utilities.formatDate(startTime, timeZone, "yyyy-MM-dd");
  const startTimeStr = Utilities.formatDate(startTime, timeZone, "HH:mm");
  const endTimeStr = Utilities.formatDate(endTime, timeZone, "HH:mm");
  const timeStr = startTimeStr + " - " + endTimeStr + " (" + timeZone + ")";

  // 5. Meeting Location / Video Link
  let meetingLink = "";
  try {
    if (typeof event.getLocation === "function") {
      meetingLink = event.getLocation() || "";
    }
  } catch (e) {
    meetingLink = "";
  }
  if (!meetingLink) {
    const linkMatch = desc.match(/(https:\/\/(?:meet\.google\.com|teams\.microsoft\.com|zoom\.us)[^\s<"']+)/i);
    if (linkMatch) {
      meetingLink = linkMatch[1];
    }
  }
  if (!meetingLink) {
    meetingLink = "INDUS Robotics Facility / Virtual";
  }

  return {
    customerName: customerName,
    customerEmail: customerEmail,
    company: company,
    purpose: purpose,
    dateStr: dateStr,
    timeStr: timeStr,
    createdTimestamp: formatIso(created),
    meetingLink: meetingLink,
  };
}

/**
 * Sends a single admin notification email for a newly registered appointment
 */
function sendAdminNotification(details) {
  const adminEmail = CONFIG.ADMIN_EMAIL;
  const subject = "🗓️ [New Booking] " + details.customerName + " — " + details.purpose + " (" + details.dateStr + ")";

  const sheetUrl = "https://docs.google.com/spreadsheets/d/" + CONFIG.SPREADSHEET_ID + "/edit";

  const htmlBody = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0d1114; color: #f3f4f6; border: 1px solid #f59e0b; padding: 24px;">
      <div style="border-bottom: 2px solid #f59e0b; padding-bottom: 12px; margin-bottom: 20px;">
        <span style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; color: #f59e0b;">INDUS Industrial Robotics</span>
        <h2 style="margin: 6px 0 0; color: #ffffff; font-size: 20px;">New Appointment Scheduled</h2>
      </div>

      <p style="font-size: 14px; line-height: 1.5; color: #d1d5db;">
        A new booking has been confirmed via Google Calendar Appointment Schedule and synchronized to Google Sheets.
      </p>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
        <tr style="border-bottom: 1px solid #1f2937;">
          <td style="padding: 10px 0; font-weight: bold; color: #9ca3af; width: 140px;">Customer Name:</td>
          <td style="padding: 10px 0; color: #ffffff; font-weight: 600;">${details.customerName}</td>
        </tr>
        <tr style="border-bottom: 1px solid #1f2937;">
          <td style="padding: 10px 0; font-weight: bold; color: #9ca3af;">Customer Email:</td>
          <td style="padding: 10px 0; color: #60a5fa;"><a href="mailto:${details.customerEmail}" style="color: #60a5fa; text-decoration: none;">${details.customerEmail}</a></td>
        </tr>
        <tr style="border-bottom: 1px solid #1f2937;">
          <td style="padding: 10px 0; font-weight: bold; color: #9ca3af;">Company / Org:</td>
          <td style="padding: 10px 0; color: #ffffff;">${details.company}</td>
        </tr>
        <tr style="border-bottom: 1px solid #1f2937;">
          <td style="padding: 10px 0; font-weight: bold; color: #9ca3af;">Appointment Purpose:</td>
          <td style="padding: 10px 0; color: #f59e0b; font-weight: 600;">${details.purpose}</td>
        </tr>
        <tr style="border-bottom: 1px solid #1f2937;">
          <td style="padding: 10px 0; font-weight: bold; color: #9ca3af;">Scheduled Date:</td>
          <td style="padding: 10px 0; color: #ffffff;">${details.dateStr}</td>
        </tr>
        <tr style="border-bottom: 1px solid #1f2937;">
          <td style="padding: 10px 0; font-weight: bold; color: #9ca3af;">Scheduled Time:</td>
          <td style="padding: 10px 0; color: #ffffff;">${details.timeStr}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; font-weight: bold; color: #9ca3af;">Location / Link:</td>
          <td style="padding: 10px 0; color: #d1d5db;">${details.meetingLink}</td>
        </tr>
      </table>

      <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #374151; text-align: center;">
        <a href="${sheetUrl}" style="background-color: #f59e0b; color: #000000; font-weight: bold; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; padding: 10px 20px; text-decoration: none; display: inline-block;">
          Open Appointment Bookings Sheet →
        </a>
      </div>
    </div>
  `;

  MailApp.sendEmail({
    to: adminEmail,
    subject: subject,
    htmlBody: htmlBody,
    noReply: true,
  });
}

/**
 * Ensures the "Appointment Bookings" tab exists without modifying any existing tabs
 */
function getOrCreateBookingsSheet(ss) {
  let sheet = ss.getSheetByName(CONFIG.SHEET_TAB_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_TAB_NAME);

    // Write header row
    const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange.setValues([HEADERS]);

    // Format headers with brand style
    headerRange.setBackground("#0D1114");
    headerRange.setFontColor("#F59E0B");
    headerRange.setFontWeight("bold");
    headerRange.setFontSize(10);
    headerRange.setHorizontalAlignment("center");

    // Freeze header row
    sheet.setFrozenRows(1);

    // Set column widths
    const columnWidths = [180, 160, 220, 160, 200, 110, 160, 110, 170, 220, 110, 170];
    for (let c = 0; c < columnWidths.length; c++) {
      sheet.setColumnWidth(c + 1, columnWidths[c]);
    }

    Logger.log("Created separate sheet tab: " + CONFIG.SHEET_TAB_NAME);
  }

  return sheet;
}

/**
 * Retrieves the target spreadsheet by ID or active spreadsheet
 */
function getTargetSpreadsheet() {
  try {
    return SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  } catch (err) {
    return SpreadsheetApp.getActiveSpreadsheet();
  }
}

/**
 * Installs time-driven trigger running syncCalendarAppointments every 5 minutes
 */
function installSyncTrigger() {
  const functionName = "syncCalendarAppointments";
  const existingTriggers = ScriptApp.getProjectTriggers();

  for (const trigger of existingTriggers) {
    if (trigger.getHandlerFunction() === functionName) {
      Logger.log("Trigger for " + functionName + " already exists.");
      return;
    }
  }

  ScriptApp.newTrigger(functionName)
    .timeBased()
    .everyMinutes(CONFIG.TRIGGER_FREQUENCY_MINUTES)
    .create();

  Logger.log("Created time-driven trigger for " + functionName + " every " + CONFIG.TRIGGER_FREQUENCY_MINUTES + " minutes.");
}

/**
 * Helper to format ISO date string
 */
function formatIso(d) {
  return Utilities.formatDate(d, "UTC", "yyyy-MM-dd'T'HH:mm:ss'Z'");
}

/**
 * Web App HTTP GET Handler (Optional manual trigger or status check)
 */
function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || "status";

  if (action === "sync") {
    const summary = syncCalendarAppointments();
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      action: "sync",
      summary: summary,
    })).setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput(JSON.stringify({
    status: "ok",
    service: "INDUS Robotics Appointment Sync Engine",
    spreadsheetId: CONFIG.SPREADSHEET_ID,
    tabName: CONFIG.SHEET_TAB_NAME,
    timestamp: new Date().toISOString(),
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Web App HTTP POST Handler (Optional webhook trigger)
 */
function doPost(e) {
  const summary = syncCalendarAppointments();
  return ContentService.createTextOutput(JSON.stringify({
    status: "success",
    action: "webhook_sync",
    summary: summary,
  })).setMimeType(ContentService.MimeType.JSON);
}
