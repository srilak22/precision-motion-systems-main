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
function getTargetSpreadsheet(overrideId) {
  if (overrideId) {
    try {
      return SpreadsheetApp.openById(overrideId);
    } catch (err) {
      Logger.log("Could not open override spreadsheet ID " + overrideId + ": " + err.message);
    }
  }
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
 * =============================================================================
 * INDUS Industrial Robotics — LinkedIn Activity Tracking & Multi-Tab Router
 * =============================================================================
 * Supported Tabs:
 *   1. Leads             — LinkedIn Lead Gen Forms & Webhook Submissions
 *   2. Posts             — Company Updates, Impressions, Reactions, Comments, Shares
 *   3. Interactions      — Individual Comments & Reactions (when authorized)
 *   4. Page Analytics    — Follower Growth, Page Views, Unique Visitors
 *   5. Website Enquiries — Website Forms with LinkedIn Referral Attribution & UTMs
 *   6. Sync Logs         — Timestamped Synchronization Audit Logs
 * =============================================================================
 */

const LINKEDIN_TABS = {
  LINKEDIN_LEADS: "LinkedIn Leads",
  LEADS: "Leads",
  POSTS: "Posts",
  INTERACTIONS: "Interactions",
  PAGE_ANALYTICS: "Page Analytics",
  WEBSITE_ENQUIRIES: "Website Enquiries",
  SYNC_LOGS: "Sync Logs",
};

const LINKEDIN_HEADERS = {
  "LinkedIn Leads": [
    "Lead ID",
    "Created At",
    "Lead Source",
    "Full Name",
    "Email",
    "Phone",
    "Company",
    "Job Title",
    "Campaign",
    "Landing Page",
    "UTM Source",
    "UTM Medium",
    "UTM Campaign",
    "Enquiry Details",
    "Jira Issue Key",
    "Jira Issue URL",
    "Jira Sync Status",
    "Lead Status",
    "Last Updated",
  ],
  Leads: [
    "Lead ID",
    "Submitted At",
    "Full Name",
    "Email Address",
    "Phone Number",
    "Company Name",
    "Job Title",
    "Form Name",
    "Form ID",
    "Campaign Name",
    "Campaign ID",
    "Creative ID",
    "LinkedIn Profile URL",
    "Lead Status",
    "Synced At",
  ],
  Posts: [
    "Post URN",
    "Post URL",
    "Author / Organization",
    "Published Date",
    "Content / Text",
    "Impressions",
    "Unique Impressions",
    "Reactions",
    "Comments",
    "Shares / Reposts",
    "Clicks",
    "Engagement Rate (%)",
    "Last Updated At",
  ],
  Interactions: [
    "Interaction ID",
    "Post URN",
    "Post URL",
    "Interaction Type",
    "Member Name / Actor",
    "Member Profile / Headline",
    "Reaction Type",
    "Comment Text",
    "Interaction Timestamp",
    "Synced At",
  ],
  "Page Analytics": [
    "Date",
    "Total Followers",
    "Organic Follower Gain",
    "Paid Follower Gain",
    "Total Page Views",
    "Desktop Page Views",
    "Mobile Page Views",
    "Total Unique Visitors",
    "Desktop Unique Visitors",
    "Mobile Unique Visitors",
    "Custom Button Clicks",
    "Last Updated At",
  ],
  "Website Enquiries": [
    "Submission ID",
    "Timestamp",
    "Full Name",
    "Email Address",
    "Phone Number",
    "Company Name",
    "Product / Service Interest",
    "Requirements / Message",
    "Lead Source",
    "Is LinkedIn Referral",
    "Referrer URL",
    "Landing Page URL",
    "UTM Source",
    "UTM Medium",
    "UTM Campaign",
    "UTM Content",
    "UTM Term",
    "Jira Ticket Key",
    "Synced At",
  ],
  "Sync Logs": [
    "Log ID",
    "Timestamp",
    "Service / Module",
    "Action / Trigger",
    "Status",
    "Records Processed",
    "Details / Error Message",
    "Duration (ms)",
    "Trigger Source",
  ],
};

const LINKEDIN_COLUMN_WIDTHS = {
  "LinkedIn Leads": [180, 160, 160, 160, 220, 140, 180, 160, 180, 180, 120, 120, 140, 260, 130, 240, 130, 120, 170],
  Leads: [180, 160, 160, 220, 140, 180, 160, 180, 140, 180, 140, 140, 240, 120, 170],
  Posts: [220, 260, 180, 160, 300, 110, 130, 100, 100, 120, 100, 140, 170],
  Interactions: [200, 200, 240, 120, 160, 220, 120, 300, 170, 170],
  "Page Analytics": [120, 130, 150, 150, 130, 150, 140, 150, 160, 150, 150, 170],
  "Website Enquiries": [160, 160, 160, 220, 140, 180, 200, 260, 170, 140, 220, 220, 120, 120, 140, 120, 120, 130, 170],
  "Sync Logs": [160, 170, 180, 160, 110, 140, 320, 110, 120],
};

/**
 * One-click Setup Function for all 6 LinkedIn Sheets tabs:
 * Creates tabs if they don't exist, formats headers with dark theme and brand accents,
 * and sets optimal column widths.
 */
function setupLinkedInSheets() {
  const ss = getTargetSpreadsheet();
  const createdTabs = [];

  for (const tabName of Object.values(LINKEDIN_TABS)) {
    const sheet = getOrCreateLinkedInTab(ss, tabName);
    createdTabs.push(tabName);
  }

  Logger.log("LinkedIn Sheets setup complete. Initialized tabs: " + createdTabs.join(", "));
  return {
    status: "success",
    message: "LinkedIn Sheets tabs initialized successfully",
    tabs: createdTabs,
    spreadsheetId: ss.getId(),
  };
}

/**
 * Ensures a LinkedIn tab exists with correct brand styling and schema headers
 */
function getOrCreateLinkedInTab(ss, tabName) {
  let sheet = ss.getSheetByName(tabName);
  const headers = LINKEDIN_HEADERS[tabName] || [];

  if (!sheet) {
    sheet = ss.insertSheet(tabName);

    if (headers.length > 0) {
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setValues([headers]);

      // Premium INDUS Dark Theme Header Styling
      headerRange.setBackground("#0D1114");
      headerRange.setFontColor("#0A66C2"); // LinkedIn Blue Accent
      if (tabName === "Sync Logs" || tabName === "Website Enquiries") {
        headerRange.setFontColor("#F59E0B"); // Signal Gold Accent
      }
      headerRange.setFontWeight("bold");
      headerRange.setFontSize(10);
      headerRange.setHorizontalAlignment("center");

      sheet.setFrozenRows(1);

      const widths = LINKEDIN_COLUMN_WIDTHS[tabName] || [];
      for (let c = 0; c < widths.length; c++) {
        sheet.setColumnWidth(c + 1, widths[c]);
      }
    }
    Logger.log("Created sheet tab: " + tabName);
  } else if (sheet.getLastRow() === 0 && headers.length > 0) {
    // If sheet exists but is empty, populate headers
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setValues([headers]);
    headerRange.setBackground("#0D1114");
    headerRange.setFontColor("#0A66C2");
    headerRange.setFontWeight("bold");
    headerRange.setFontSize(10);
    headerRange.setHorizontalAlignment("center");
    sheet.setFrozenRows(1);
  }

  return sheet;
}

/**
 * Universal Row Upsert / Deduplication Engine
 * Deduplicates by Primary Key (Column 1) and updates in-place when metrics change.
 */
function handleSheetUpsert(ss, payload) {
  const sheetName = String(payload.sheet || payload.sheetName || payload.table || "Website Activity").trim();
  const sheet = getOrCreateLinkedInTab(ss, sheetName);
  const headers = getSheetHeaders(sheet, sheetName);

  if (!headers || headers.length === 0) {
    return { status: "error", message: "No headers found for tab: " + sheetName };
  }

  // Determine Primary Key identifier from payload
  const primaryKey = extractPrimaryKey(sheetName, payload);
  const nowStr = formatIso(new Date());

  // Tabs that always append (historical logs)
  const isAppendOnly = sheetName === "Sync Logs" || sheetName === "Errors" || !primaryKey;

  if (isAppendOnly) {
    const rowValues = mapPayloadToRow(headers, payload, nowStr);
    sheet.appendRow(rowValues);
    return { status: "success", action: "appended", sheet: sheetName, row: sheet.getLastRow() };
  }

  // Look for existing row with primaryKey in Column 1
  const lastRow = sheet.getLastRow();
  let existingRowIndex = -1;

  if (lastRow > 1) {
    const pkValues = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
    const targetKeyStr = String(primaryKey).trim().toLowerCase();

    for (let i = 0; i < pkValues.length; i++) {
      const cellVal = String(pkValues[i][0] || "").trim().toLowerCase();
      if (cellVal === targetKeyStr) {
        existingRowIndex = i + 2;
        break;
      }
    }
  }

  const rowValues = mapPayloadToRow(headers, payload, nowStr);

  if (existingRowIndex !== -1) {
    // IN-PLACE UPDATE: Update existing row with new metrics
    const range = sheet.getRange(existingRowIndex, 1, 1, headers.length);
    range.setValues([rowValues]);
    return { status: "success", action: "updated", sheet: sheetName, row: existingRowIndex, key: primaryKey };
  } else {
    // INSERT NEW RECORD
    sheet.appendRow(rowValues);
    return { status: "success", action: "inserted", sheet: sheetName, row: sheet.getLastRow(), key: primaryKey };
  }
}

/**
 * Resolves sheet headers from active row or schema definitions
 */
function getSheetHeaders(sheet, sheetName) {
  if (LINKEDIN_HEADERS[sheetName]) {
    return LINKEDIN_HEADERS[sheetName];
  }
  const lastCol = sheet.getLastColumn();
  if (lastCol > 0) {
    return sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(String);
  }
  return [];
}

/**
 * Extracts Primary Key value based on tab schema
 */
function extractPrimaryKey(sheetName, payload) {
  switch (sheetName) {
    case "Posts":
      return payload.postUrn || payload["Post URN"] || payload.urn || payload.id || "";
    case "LinkedIn Leads":
    case "Leads":
      return payload.leadId || payload["Lead ID"] || payload.formResponseId || payload.id || "";
    case "Interactions":
      return payload.interactionId || payload["Interaction ID"] || payload.commentUrn || payload.reactionUrn || payload.id || "";
    case "Page Analytics":
      return payload.date || payload["Date"] || "";
    case "Website Enquiries":
      return payload.submissionId || payload["Submission ID"] || payload.id || "";
    case "YouTube Stats":
      return payload.videoId || payload["Video ID"] || "";
    case "YouTube Comments":
      return payload.commentId || payload["Comment ID"] || "";
    case "Appointment Bookings":
      return payload.eventId || payload["Event ID"] || "";
    default:
      return payload.id || payload.primaryKey || "";
  }
}

/**
 * Maps incoming object fields to ordered sheet row values matching headers
 */
function mapPayloadToRow(headers, payload, nowStr) {
  return headers.map(function(headerName) {
    // Direct match with exact header name
    if (payload[headerName] !== undefined && payload[headerName] !== null) {
      return formatCellVal(payload[headerName]);
    }

    // Normalized camelCase match
    const camel = toCamelCase(headerName);
    if (payload[camel] !== undefined && payload[camel] !== null) {
      return formatCellVal(payload[camel]);
    }

    // Common fallback aliases
    const lower = headerName.toLowerCase();
    if (lower.indexOf("last updated") !== -1 || lower.indexOf("synced at") !== -1) {
      return payload.lastUpdated || payload.syncedAt || nowStr;
    }
    if (lower === "created at" || lower === "submitted at") {
      return payload.createdAt || payload.submittedAt || payload.timestamp || nowStr;
    }
    if (lower === "timestamp") {
      return payload.timestamp || payload.createdAt || payload.submittedAt || nowStr;
    }

    // Robust semantic aliases for common lead/form fields
    if (lower.indexOf("name") !== -1 && lower.indexOf("company") === -1 && lower.indexOf("form") === -1 && lower.indexOf("campaign") === -1) {
      const v = payload.fullName || payload.name || payload.customerName || payload["Full Name"] || payload["Name"];
      if (v !== undefined && v !== null && v !== "") return formatCellVal(v);
    }
    if (lower.indexOf("email") !== -1) {
      const v = payload.email || payload.emailAddress || payload.customerEmail || payload["Email"] || payload["Email Address"];
      if (v !== undefined && v !== null && v !== "") return formatCellVal(v);
    }
    if (lower.indexOf("phone") !== -1) {
      const v = payload.phone || payload.phoneNumber || payload["Phone"] || payload["Phone Number"];
      if (v !== undefined && v !== null && v !== "") return formatCellVal(v);
    }
    if (lower.indexOf("company") !== -1 || lower.indexOf("organization") !== -1) {
      const v = payload.company || payload.companyName || payload.organization || payload["Company"] || payload["Company Name"];
      if (v !== undefined && v !== null && v !== "") return formatCellVal(v);
    }
    if (lower === "job title" || lower === "title") {
      const v = payload.jobTitle || payload.title || payload["Job Title"];
      if (v !== undefined && v !== null && v !== "") return formatCellVal(v);
    }
    if (lower === "lead id" || lower === "id") {
      const v = payload.leadId || payload.id || payload.formResponseId || payload["Lead ID"];
      if (v !== undefined && v !== null && v !== "") return formatCellVal(v);
    }
    if (lower === "landing page" || lower === "landing page url") {
      const v = payload.landingPage || payload.landingPageUrl || payload.page || payload["Landing Page"] || payload["Landing Page URL"];
      if (v !== undefined && v !== null && v !== "") return formatCellVal(v);
    }
    if (lower === "campaign" || lower === "campaign name") {
      const v = payload.campaign || payload.campaignName || payload["Campaign"] || payload["Campaign Name"];
      if (v !== undefined && v !== null && v !== "") return formatCellVal(v);
    }
    if (lower === "utm source") {
      const v = payload.utmSource || payload["UTM Source"];
      if (v !== undefined && v !== null && v !== "") return formatCellVal(v);
    }
    if (lower === "utm medium") {
      const v = payload.utmMedium || payload["UTM Medium"];
      if (v !== undefined && v !== null && v !== "") return formatCellVal(v);
    }
    if (lower === "utm campaign") {
      const v = payload.utmCampaign || payload["UTM Campaign"];
      if (v !== undefined && v !== null && v !== "") return formatCellVal(v);
    }
    if (lower.indexOf("enquiry") !== -1 || lower.indexOf("requirement") !== -1 || lower.indexOf("message") !== -1 || lower === "details") {
      const v = payload.enquiryDetails || payload.requirementsMessage || payload.requirements || payload.message || payload.details || payload["Enquiry Details"] || payload["Requirements / Message"];
      if (v !== undefined && v !== null && v !== "") return formatCellVal(v);
    }
    if (lower === "jira issue key" || lower === "jira ticket key" || lower === "jira key") {
      const v = payload.jiraIssueKey || payload.jiraTicketKey || payload.jiraKey || payload.issueKey || payload["Jira Issue Key"] || payload["Jira Ticket Key"];
      if (v !== undefined && v !== null && v !== "") return formatCellVal(v);
    }
    if (lower === "jira issue url" || lower === "jira url") {
      const v = payload.jiraIssueUrl || payload.jiraUrl || payload["Jira Issue URL"];
      if (v !== undefined && v !== null && v !== "") return formatCellVal(v);
    }
    if (lower === "jira sync status" || lower === "sync status") {
      const v = payload.jiraSyncStatus || payload.syncStatus || payload["Jira Sync Status"];
      if (v !== undefined && v !== null && v !== "") return formatCellVal(v);
    }
    if (lower === "lead status" || lower === "status") {
      const v = payload.leadStatus || payload.status || payload["Lead Status"] || "New";
      if (v !== undefined && v !== null && v !== "") return formatCellVal(v);
    }
    if (lower.indexOf("interest") !== -1 || lower.indexOf("product") !== -1) {
      const v = payload.productServiceInterest || payload.product || payload.interest || payload["Product / Service Interest"] || payload["Product"];
      if (v !== undefined && v !== null && v !== "") return formatCellVal(v);
    }
    if (lower.indexOf("source") !== -1) {
      const v = payload.leadSource || payload.source || payload.utmSource || payload["Lead Source"];
      if (v !== undefined && v !== null && v !== "") return formatCellVal(v);
    }

    return "";
  });
}

function formatCellVal(val) {
  if (typeof val === "object") {
    try {
      return JSON.stringify(val);
    } catch (e) {
      return String(val);
    }
  }
  return val;
}

function toCamelCase(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/[\s\-_/()]+/g, "");
}

/**
 * Web App HTTP GET Handler:
 * Status checks, one-click tab initialization, and manual synchronization
 */
function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || "status";

  // 1. One-click LinkedIn Tabs Initialization
  if (action === "setup_linkedin") {
    const result = setupLinkedInSheets();
    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
  }

  // 2. Calendar appointment setup
  if (action === "setup_calendar") {
    const result = setupAppointmentSync();
    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
  }

  // 3. Calendar appointment synchronization
  if (action === "sync" || action === "calendar_sync") {
    const summary = syncCalendarAppointments();
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      action: "calendar_sync",
      summary: summary,
    })).setMimeType(ContentService.MimeType.JSON);
  }

  // 4. Default Status Report
  const ss = getTargetSpreadsheet();
  const existingSheets = ss.getSheets().map(function(s) { return s.getName(); });

  return ContentService.createTextOutput(JSON.stringify({
    status: "ok",
    service: "INDUS Robotics Google Sheets Integration Engine",
    spreadsheetId: ss.getId(),
    activeTabs: existingSheets,
    linkedInTabsConfigured: Object.values(LINKEDIN_TABS).every(function(t) { return existingSheets.indexOf(t) !== -1; }),
    timestamp: new Date().toISOString(),
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Web App HTTP POST Handler:
 * Handles webhook triggers, calendar synchronization, and upsert writes across all tabs
 */
function doPost(e) {
  try {
    let payload = null;
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        payload = null;
      }
    }

    // 1. If payload contains action === "setup_linkedin"
    if (payload && payload.action === "setup_linkedin") {
      const setupResult = setupLinkedInSheets();
      return ContentService.createTextOutput(JSON.stringify(setupResult)).setMimeType(ContentService.MimeType.JSON);
    }

    // 2. If payload targets a specific sheet (LinkedIn tabs, Website Enquiries, YouTube, Telemetry)
    const targetSheet = payload && (payload.sheet || payload.sheetName || payload.table || (payload.name || payload.email || payload.fullName ? "Website Enquiries" : null));
    if (payload && targetSheet) {
      const ss = getTargetSpreadsheet(payload.spreadsheetId);

      // Support batch records
      if (Array.isArray(payload.records)) {
        const results = [];
        for (let i = 0; i < payload.records.length; i++) {
          const rec = payload.records[i];
          rec.sheet = targetSheet;
          results.push(handleSheetUpsert(ss, rec));
        }
        return ContentService.createTextOutput(JSON.stringify({
          status: "success",
          action: "batch_upsert",
          sheet: targetSheet,
          processed: results.length,
          results: results,
        })).setMimeType(ContentService.MimeType.JSON);
      }

      payload.sheet = targetSheet;
      const upsertResult = handleSheetUpsert(ss, payload);
      return ContentService.createTextOutput(JSON.stringify(upsertResult)).setMimeType(ContentService.MimeType.JSON);
    }

    // 3. Fallback: Google Calendar Sync webhook
    const summary = syncCalendarAppointments();
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      action: "calendar_sync",
      summary: summary,
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    Logger.log("doPost Error: " + err.message);
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      error: err.message,
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
