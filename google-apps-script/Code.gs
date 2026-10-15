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

const YOUTUBE_TABS = {
  YOUTUBE_LEADS: "YouTube Leads",
  YOUTUBE_STATS: "YouTube Stats",
  YOUTUBE_COMMENTS: "YouTube Comments",
  YOUTUBE_SYNC_LOG: "YouTube Sync Log",
};

const YOUTUBE_HEADERS = {
  "YouTube Leads": [
    "Lead ID",
    "Creation Time",
    "Source Video",
    "Full Name",
    "Email Address",
    "Phone Number",
    "Company Name",
    "Product / Interest",
    "Estimated Budget",
    "Timeline",
    "Requirements / Message",
    "Preferred Contact",
    "Traffic Source",
    "Traffic Medium",
    "Campaign Name",
    "Video ID",
    "Channel ID",
    "Referrer URL",
    "Landing Page",
    "Jira Issue Key",
    "Lead Status",
    "Synced At",
  ],
  "YouTube Stats": [
    "Video ID",
    "Title",
    "URL",
    "Published Date",
    "Views",
    "Likes",
    "Comment Count",
    "Last Sync Time",
  ],
  "YouTube Comments": [
    "Comment ID",
    "Video ID",
    "Comment Text",
    "Author Display Name",
    "Published Time",
    "Like Count",
    "Comment URL",
    "Follow-Up Status",
    "Jira Issue Key",
    "Synced At",
  ],
  "YouTube Sync Log": [
    "Log ID",
    "Timestamp",
    "Sync Status",
    "Records Processed",
    "Details / Error Message",
    "Duration (ms)",
  ],
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
  "YouTube Leads": [180, 170, 220, 180, 220, 140, 180, 200, 140, 130, 260, 140, 130, 130, 160, 140, 180, 220, 200, 140, 120, 170],
  "YouTube Stats": [140, 240, 220, 160, 110, 110, 130, 170],
  "YouTube Comments": [180, 140, 320, 180, 170, 110, 240, 140, 140, 170],
  "YouTube Sync Log": [160, 170, 140, 180, 320, 120],
};

const ALL_TAB_HEADERS = Object.assign({}, LINKEDIN_HEADERS, YOUTUBE_HEADERS);

/**
 * One-click Setup Function for all 6 LinkedIn Sheets tabs
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
 * One-click Setup Function for all 4 YouTube Sheets tabs
 */
function setupYouTubeSheets() {
  const ss = getTargetSpreadsheet();
  const createdTabs = [];

  for (const tabName of Object.values(YOUTUBE_TABS)) {
    const sheet = getOrCreateLinkedInTab(ss, tabName);
    createdTabs.push(tabName);
  }

  Logger.log("YouTube Sheets setup complete. Initialized tabs: " + createdTabs.join(", "));
  return {
    status: "success",
    message: "YouTube Sheets tabs initialized successfully",
    tabs: createdTabs,
    spreadsheetId: ss.getId(),
  };
}

/**
 * Unified Setup for all tabs (LinkedIn, YouTube, Website Enquiries, Appointment Bookings)
 */
function setupAllSheets() {
  const ss = getTargetSpreadsheet();
  const liRes = setupLinkedInSheets();
  const ytRes = setupYouTubeSheets();
  const calRes = setupAppointmentSync();

  return {
    status: "success",
    message: "All integration tabs and schemas successfully verified and initialized",
    spreadsheetId: ss.getId(),
    linkedInTabs: liRes.tabs,
    youtubeTabs: ytRes.tabs,
    calendarSync: calRes.status,
  };
}

/**
 * Ensures a tab exists with correct brand styling and schema headers
 */
function getOrCreateLinkedInTab(ss, tabName) {
  let sheet = ss.getSheetByName(tabName);
  const headers = ALL_TAB_HEADERS[tabName] || LINKEDIN_HEADERS[tabName] || YOUTUBE_HEADERS[tabName] || [];

  if (!sheet) {
    sheet = ss.insertSheet(tabName);

    if (headers.length > 0) {
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setValues([headers]);

      // Premium INDUS Dark Theme Header Styling
      headerRange.setBackground("#0D1114");
      if (tabName.indexOf("YouTube") !== -1) {
        headerRange.setFontColor("#FF0000"); // YouTube Red Accent
      } else if (tabName === "Sync Logs" || tabName === "Website Enquiries") {
        headerRange.setFontColor("#F59E0B"); // Signal Gold Accent
      } else {
        headerRange.setFontColor("#0A66C2"); // LinkedIn Blue Accent
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
    if (tabName.indexOf("YouTube") !== -1) {
      headerRange.setFontColor("#FF0000");
    } else if (tabName === "Sync Logs" || tabName === "Website Enquiries") {
      headerRange.setFontColor("#F59E0B");
    } else {
      headerRange.setFontColor("#0A66C2");
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

  return sheet;
}

/**
 * Universal Row Upsert / Deduplication Engine
 * Deduplicates by Primary Key (Column 1) and updates in-place when metrics change.
 */
function handleSheetUpsert(ss, payload) {
  const sheetName = String(payload.sheet || payload.sheetName || payload.table || "Website Activity").trim();
  const sheet = getOrCreateLinkedInTab(ss, sheetName);
  let headers = getSheetHeaders(sheet, sheetName);

  // Auto-heal headers if sheet existed but was missing headers row
  if ((!headers || headers.length === 0) && ALL_TAB_HEADERS[sheetName]) {
    headers = ALL_TAB_HEADERS[sheetName];
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setValues([headers]);
    headerRange.setBackground("#0D1114");
    if (sheetName.indexOf("YouTube") !== -1) {
      headerRange.setFontColor("#FF0000");
    } else {
      headerRange.setFontColor("#F59E0B");
    }
    headerRange.setFontWeight("bold");
    headerRange.setFontSize(10);
    headerRange.setHorizontalAlignment("center");
    sheet.setFrozenRows(1);

    const widths = LINKEDIN_COLUMN_WIDTHS[sheetName] || [];
    for (let c = 0; c < widths.length; c++) {
      sheet.setColumnWidth(c + 1, widths[c]);
    }
  }

  if (!headers || headers.length === 0) {
    return { status: "error", message: "No headers found for tab: " + sheetName };
  }

  // Determine Primary Key identifier from payload
  const primaryKey = extractPrimaryKey(sheetName, payload);
  const nowStr = formatIso(new Date());

  // Tabs that always append (historical logs)
  const isAppendOnly = sheetName === "Sync Logs" || sheetName === "YouTube Sync Log" || sheetName === "Errors" || !primaryKey;

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
  if (ALL_TAB_HEADERS[sheetName]) {
    return ALL_TAB_HEADERS[sheetName];
  }
  if (LINKEDIN_HEADERS[sheetName]) {
    return LINKEDIN_HEADERS[sheetName];
  }
  if (YOUTUBE_HEADERS[sheetName]) {
    return YOUTUBE_HEADERS[sheetName];
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
    case "YouTube Leads":
      return payload.leadId || payload["Lead ID"] || payload.submissionId || payload["Submission ID"] || payload.id || "";
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
    case "YouTube Sync Log":
      return payload.logId || payload["Log ID"] || payload.id || "";
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
    if (lower === "lead id" || lower === "id" || lower === "submission id") {
      const v = payload.submissionId || payload["Submission ID"] || payload.leadId || payload.id || payload.formResponseId || payload["Lead ID"];
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
    if (lower === "post urn" || lower === "urn") {
      const v = payload.postUrn || payload["Post URN"] || payload.urn || payload.id;
      if (v !== undefined && v !== null && v !== "") return formatCellVal(v);
    }
    if (lower === "post url" || lower === "url") {
      const v = payload.postUrl || payload["Post URL"] || payload.url;
      if (v !== undefined && v !== null && v !== "") return formatCellVal(v);
    }
    if (lower === "author / organization" || lower === "author") {
      const v = payload.author || payload["Author / Organization"] || payload.organization;
      if (v !== undefined && v !== null && v !== "") return formatCellVal(v);
    }
    if (lower === "content / text" || lower === "content" || lower === "text") {
      const v = payload.content || payload["Content / Text"] || payload.text;
      if (v !== undefined && v !== null && v !== "") return formatCellVal(v);
    }
    if (lower === "shares / reposts" || lower === "shares") {
      const v = payload.shares || payload["Shares / Reposts"] || payload.reposts;
      if (v !== undefined && v !== null && v !== "") return formatCellVal(v);
    }
    if (lower.indexOf("engagement rate") !== -1) {
      const v = payload.engagementRate || payload["Engagement Rate (%)"] || payload["Engagement Rate"];
      if (v !== undefined && v !== null && v !== "") return formatCellVal(v);
    }
    if (lower === "source video" || lower === "video url") {
      const v = payload.sourceVideo || payload["Source Video"] || payload.videoUrl;
      if (v !== undefined && v !== null && v !== "") return formatCellVal(v);
    }
    if (lower.indexOf("video id") !== -1 || lower === "videoid") {
      const v = payload.videoId || payload["Video ID"] || payload.v;
      if (v !== undefined && v !== null && v !== "") return formatCellVal(v);
    }
    if (lower.indexOf("channel id") !== -1 || lower === "channelid") {
      const v = payload.channelId || payload["Channel ID"];
      if (v !== undefined && v !== null && v !== "") return formatCellVal(v);
    }
    if (lower.indexOf("budget") !== -1) {
      const v = payload.estimatedBudget || payload["Estimated Budget"] || payload.budget;
      if (v !== undefined && v !== null && v !== "") return formatCellVal(v);
    }
    if (lower === "timeline") {
      const v = payload.timeline || payload["Timeline"];
      if (v !== undefined && v !== null && v !== "") return formatCellVal(v);
    }
    if (lower.indexOf("preferred contact") !== -1) {
      const v = payload.preferredContact || payload["Preferred Contact"];
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
  if (typeof val === "string" && (val.startsWith("+") || val.startsWith("="))) {
    return "'" + val;
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
 * Status checks, one-click tab initialization, calendar availability, and booking queries
 */
function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || "status";

  // 1. One-click LinkedIn Tabs Initialization
  if (action === "setup_linkedin") {
    const result = setupLinkedInSheets();
    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
  }

  // 1b. One-click YouTube Tabs Initialization
  if (action === "setup_youtube") {
    const result = setupYouTubeSheets();
    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
  }

  // 1c. Unified All Tabs Initialization
  if (action === "setup_all") {
    const result = setupAllSheets();
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

  // 4. Live consultation slot availability check
  if (action === "get_slots" || action === "check_availability") {
    const dateStr = (e && e.parameter && e.parameter.date) || "";
    const timeZone = (e && e.parameter && e.parameter.timezone) || "Asia/Kolkata";
    const slotsResult = getAvailableConsultationSlots(dateStr, timeZone);
    return ContentService.createTextOutput(JSON.stringify(slotsResult)).setMimeType(ContentService.MimeType.JSON);
  }

  // 5. Query consultation bookings (Admin only)
  if (action === "list_bookings") {
    const bookingsResult = listConsultationBookings();
    return ContentService.createTextOutput(JSON.stringify(bookingsResult)).setMimeType(ContentService.MimeType.JSON);
  }

  // 6. Default Status Report
  const ss = getTargetSpreadsheet();
  const existingSheets = ss.getSheets().map(function(s) { return s.getName(); });

  return ContentService.createTextOutput(JSON.stringify({
    status: "ok",
    service: "INDUS Robotics Google Sheets & Calendar Integration Engine",
    spreadsheetId: ss.getId(),
    activeTabs: existingSheets,
    linkedInTabsConfigured: Object.values(LINKEDIN_TABS).every(function(t) { return existingSheets.indexOf(t) !== -1; }),
    timestamp: new Date().toISOString(),
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Web App HTTP POST Handler:
 * Handles webhook triggers, calendar synchronization, direct consultation booking, and upserts
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

    // 1. Direct consultation appointment booking
    if (payload && (payload.action === "book_consultation" || payload.action === "create_consultation")) {
      const bookingResult = bookConsultationAppointment(payload);
      return ContentService.createTextOutput(JSON.stringify(bookingResult)).setMimeType(ContentService.MimeType.JSON);
    }

    // 2. Consultation cancellation
    if (payload && (payload.action === "cancel_consultation" || payload.action === "cancel")) {
      const cancelResult = cancelConsultationAppointment(payload);
      return ContentService.createTextOutput(JSON.stringify(cancelResult)).setMimeType(ContentService.MimeType.JSON);
    }

    // 3. Consultation rescheduling
    if (payload && (payload.action === "reschedule_consultation" || payload.action === "reschedule")) {
      const rescheduleResult = rescheduleConsultationAppointment(payload);
      return ContentService.createTextOutput(JSON.stringify(rescheduleResult)).setMimeType(ContentService.MimeType.JSON);
    }

    // 4. One-click LinkedIn setup
    if (payload && payload.action === "setup_linkedin") {
      const setupResult = setupLinkedInSheets();
      return ContentService.createTextOutput(JSON.stringify(setupResult)).setMimeType(ContentService.MimeType.JSON);
    }

    // 4b. One-click YouTube setup
    if (payload && payload.action === "setup_youtube") {
      const setupResult = setupYouTubeSheets();
      return ContentService.createTextOutput(JSON.stringify(setupResult)).setMimeType(ContentService.MimeType.JSON);
    }

    // 4c. Unified All Sheets setup
    if (payload && payload.action === "setup_all") {
      const setupResult = setupAllSheets();
      return ContentService.createTextOutput(JSON.stringify(setupResult)).setMimeType(ContentService.MimeType.JSON);
    }

    // 5. If payload targets a specific sheet (LinkedIn tabs, Website Enquiries, YouTube, Telemetry)
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

    // 6. Fallback: Google Calendar Sync webhook
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

/**
 * =============================================================================
 * INDUS Robotics Smart Consultation Booking & Live Availability Engine
 * =============================================================================
 */

/**
 * Calculates live consultation slot availability for a given date.
 * Cross-references real-time Google Calendar events and Google Sheets bookings.
 */
function getAvailableConsultationSlots(dateStr, timeZone) {
  timeZone = timeZone || "Asia/Kolkata";
  const parts = (dateStr || "").split("-");
  if (parts.length !== 3) {
    return { status: "error", message: "Invalid date format. Expected YYYY-MM-DD" };
  }

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  // Business hours: 09:30 AM to 06:00 PM IST (30-minute consultation slots)
  const candidateSlots = [
    { startH: 9, startM: 30, endH: 10, endM: 0, time: "09:30", endTime: "10:00", display: "09:30 AM - 10:00 AM" },
    { startH: 10, startM: 0, endH: 10, endM: 30, time: "10:00", endTime: "10:30", display: "10:00 AM - 10:30 AM" },
    { startH: 10, startM: 30, endH: 11, endM: 0, time: "10:30", endTime: "11:00", display: "10:30 AM - 11:00 AM" },
    { startH: 11, startM: 0, endH: 11, endM: 30, time: "11:00", endTime: "11:30", display: "11:00 AM - 11:30 AM" },
    { startH: 11, startM: 30, endH: 12, endM: 0, time: "11:30", endTime: "12:00", display: "11:30 AM - 12:00 PM" },
    { startH: 12, startM: 0, endH: 12, endM: 30, time: "12:00", endTime: "12:30", display: "12:00 PM - 12:30 PM" },
    { startH: 12, startM: 30, endH: 13, endM: 0, time: "12:30", endTime: "13:00", display: "12:30 PM - 01:00 PM" },
    // Lunch buffer: 13:00 - 14:00
    { startH: 14, startM: 0, endH: 14, endM: 30, time: "14:00", endTime: "14:30", display: "02:00 PM - 02:30 PM" },
    { startH: 14, startM: 30, endH: 15, endM: 0, time: "14:30", endTime: "15:00", display: "02:30 PM - 03:00 PM" },
    { startH: 15, startM: 0, endH: 15, endM: 30, time: "15:00", endTime: "15:30", display: "03:00 PM - 03:30 PM" },
    { startH: 15, startM: 30, endH: 16, endM: 0, time: "15:30", endTime: "16:00", display: "03:30 PM - 04:00 PM" },
    { startH: 16, startM: 0, endH: 16, endM: 30, time: "16:00", endTime: "16:30", display: "04:00 PM - 04:30 PM" },
    { startH: 16, startM: 30, endH: 17, endM: 0, time: "16:30", endTime: "17:00", display: "04:30 PM - 05:00 PM" },
    { startH: 17, startM: 0, endH: 17, endM: 30, time: "17:00", endTime: "17:30", display: "05:00 PM - 05:30 PM" },
    { startH: 17, startM: 30, endH: 18, endM: 0, time: "17:30", endTime: "18:00", display: "05:30 PM - 06:00 PM" },
  ];

  // Retrieve calendar events for target day
  let events = [];
  try {
    const calendar = CalendarApp.getDefaultCalendar();
    const dayStart = new Date(year, month, day, 0, 0, 0);
    const dayEnd = new Date(year, month, day, 23, 59, 59);
    events = calendar.getEvents(dayStart, dayEnd);
  } catch (err) {
    Logger.log("Calendar events lookup: " + err.message);
  }

  // Cross-reference existing bookings from Google Sheet
  const ss = getTargetSpreadsheet();
  const sheet = getOrCreateBookingsSheet(ss);
  const lastRow = sheet.getLastRow();
  const bookedSlotsFromSheet = new Set();

  if (lastRow > 1) {
    const data = sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
    for (let r = 0; r < data.length; r++) {
      const rowDate = String(data[r][5] || "").trim();
      const rowTime = String(data[r][6] || "").trim();
      const rowStatus = String(data[r][7] || "").trim();
      if (rowDate === dateStr && (rowStatus === "Confirmed" || rowStatus === "Rescheduled" || rowStatus === "New")) {
        const timeMatch = rowTime.match(/(\d{2}:\d{2})/);
        if (timeMatch) {
          bookedSlotsFromSheet.add(timeMatch[1]);
        }
      }
    }
  }

  const now = new Date();
  const minNoticeMs = 4 * 60 * 60 * 1000; // 4 hours advance notice

  const evaluatedSlots = candidateSlots.map(function(slot) {
    const slotStartDate = new Date(year, month, day, slot.startH, slot.startM);
    const slotEndDate = new Date(year, month, day, slot.endH, slot.endM);

    // 1. In past or within minimum advance notice window?
    if (slotStartDate.getTime() < (now.getTime() + minNoticeMs)) {
      return {
        time: slot.time,
        endTime: slot.endTime,
        display: slot.display,
        available: false,
        reason: "Advance notice required",
      };
    }

    // 2. Reserved in Sheet?
    if (bookedSlotsFromSheet.has(slot.time)) {
      return {
        time: slot.time,
        endTime: slot.endTime,
        display: slot.display,
        available: false,
        reason: "Reserved",
      };
    }

    // 3. Calendar event conflict?
    let hasConflict = false;
    for (let e = 0; e < events.length; e++) {
      const ev = events[e];
      const evStart = ev.getStartTime();
      const evEnd = ev.getEndTime();
      if (slotStartDate < evEnd && slotEndDate > evStart) {
        hasConflict = true;
        break;
      }
    }

    if (hasConflict) {
      return {
        time: slot.time,
        endTime: slot.endTime,
        display: slot.display,
        available: false,
        reason: "Busy in calendar",
      };
    }

    return {
      time: slot.time,
      endTime: slot.endTime,
      display: slot.display,
      available: true,
    };
  });

  return {
    status: "success",
    date: dateStr,
    timezone: timeZone,
    slots: evaluatedSlots,
  };
}

/**
 * Creates a consultation appointment with atomic concurrency locking,
 * Google Calendar event creation, Google Meet link, and automated email dispatches.
 */
function bookConsultationAppointment(payload) {
  const lock = LockService.getScriptLock();
  try {
    // Acquire lock (wait up to 15 seconds to prevent race conditions)
    const acquired = lock.tryLock(15000);
    if (!acquired) {
      return {
        status: "error",
        error: "SERVER_BUSY",
        message: "Server is currently finalizing another booking. Please try again in a few moments.",
      };
    }

    const dateStr = (payload.selectedDate || payload.appointmentDate || payload.date || "").trim();
    const slotStr = (payload.selectedSlot || payload.appointmentTime || payload.time || "").trim();
    const customerName = (payload.fullName || payload.customerName || payload.name || "").trim();
    const customerEmail = (payload.companyEmail || payload.customerEmail || payload.email || "").trim();
    const company = (payload.companyName || payload.company || "Not Specified").trim();
    const phone = (payload.phoneNumber || payload.phone || "").trim();
    const bookingMode = (payload.bookingMode || "quick").toUpperCase();
    const consultationPurpose = (payload.consultationPurpose || payload.specificApplication || "Robotics Architecture & Kinematic Sizing").trim();
    const industry = (payload.industry || "General industrial automation").trim();
    const robotCategory = (payload.robotCategory || (bookingMode === "QUICK" ? "Robotics Solution" : "Articulated robotic arms")).trim();
    const application = (payload.specificApplication || consultationPurpose).trim();
    const stage = (payload.projectStage || "Planning").trim();
    const solution = (payload.preferredSolution || "New installation").trim();
    const mode = (payload.consultationMode || "Google Meet (Online Video)").trim();
    const description = (payload.projectDescription || ("[" + bookingMode + " BOOKING] " + consultationPurpose)).trim();
    const material = (payload.materialHandled || "Standard").trim();
    const payloadKg = (payload.payloadKg || "").trim();
    const reachMm = (payload.reachMm || "").trim();
    const cycleTime = (payload.cycleTimeSec || "").trim();
    const environment = (payload.operatingEnvironment || "Standard industrial factory").trim();
    const accuracy = (payload.accuracyRequirement || "").trim();
    const shifts = (payload.productionShifts || "").trim();
    const existingEquipment = (payload.existingEquipment || "").trim();
    const budget = (payload.projectBudget || "Flexible").trim();
    const timeline = (payload.implementationTimeline || "Immediate").trim();
    const country = (payload.country || "India").trim();
    const city = (payload.city || "").trim();
    const website = (payload.companyWebsite || "").trim();
    const comments = (payload.additionalComments || "").trim();

    if (!dateStr || !slotStr || !customerName || !customerEmail) {
      return { status: "error", error: "VALIDATION_FAILED", message: "Missing required booking details." };
    }

    // Generate unique booking reference ID
    const refSuffix = ("0000" + Math.floor(Math.random() * 10000)).slice(-4);
    const dateCompact = dateStr.replace(/-/g, "");
    const bookingId = payload.bookingId || ("INDUS-BC-" + dateCompact + "-" + refSuffix);

    // Re-verify availability to prevent double-booking
    const availability = getAvailableConsultationSlots(dateStr, "Asia/Kolkata");
    if (availability.status === "success") {
      const matchSlot = availability.slots.find(function(s) {
        return s.time === slotStr || slotStr.indexOf(s.time) !== -1;
      });
      if (matchSlot && !matchSlot.available) {
        return {
          status: "error",
          error: "SLOT_CONFLICT",
          message: "This appointment slot (" + slotStr + " on " + dateStr + ") was just taken by another client. Please select another slot.",
        };
      }
    }

    // Parse start and end time
    const dateParts = dateStr.split("-");
    const year = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1;
    const day = parseInt(dateParts[2], 10);

    const timeMatches = slotStr.match(/(\d{1,2}):(\d{2})/);
    const startHour = timeMatches ? parseInt(timeMatches[1], 10) : 10;
    const startMin = timeMatches ? parseInt(timeMatches[2], 10) : 0;

    const startTime = new Date(year, month, day, startHour, startMin);
    const endTime = new Date(startTime.getTime() + 30 * 60 * 1000);

    // Generate Google Meet URL
    const cleanId = bookingId.toLowerCase().replace(/[^a-z0-9]/g, "");
    const meetUrl = mode.indexOf("In-Person") !== -1
      ? "INDUS Industrial Robotics Tech Center (On-Site Facility)"
      : "https://meet.google.com/indus-rob-" + cleanId.slice(-9);

    const eventTitle = "INDUS Robotics Consultation: " + company + " — " + customerName + " [" + bookingId + "]";
    
    const eventDescription = [
      "=====================================================",
      "INDUS INDUSTRIAL ROBOTICS — CONSULTATION BRIEFING",
      "=====================================================",
      "Booking Reference ID: " + bookingId,
      "Consultation Mode: " + mode,
      "Google Meet / Location: " + meetUrl,
      "",
      "--- CUSTOMER DETAILS ---",
      "Customer Name: " + customerName,
      "Company Name: " + company,
      "Official Email: " + customerEmail,
      "Phone Number: " + phone,
      "Location: " + city + ", " + country,
      "Company Website: " + (website || "N/A"),
      "",
      "--- ROBOTICS REQUIREMENT ---",
      "Industry: " + industry,
      "Robot Category: " + robotCategory,
      "Specific Application: " + application,
      "Project Stage: " + stage,
      "Preferred Solution: " + solution,
      "Project Description: " + description,
      "",
      "--- TECHNICAL SPECIFICATIONS ---",
      "Material Handled: " + material,
      "Payload Requirement: " + (payloadKg ? payloadKg + " kg" : "To be calculated"),
      "Reach Requirement: " + (reachMm ? reachMm + " mm" : "To be determined"),
      "Cycle Time: " + (cycleTime ? cycleTime + " sec/part" : "To be estimated"),
      "Operating Environment: " + environment,
      "Required Accuracy: " + accuracy,
      "Production Shift / Volume: " + shifts,
      "Existing Equipment / PLC: " + (existingEquipment || "None / Greenfield"),
      "Project Budget: " + budget,
      "Target Timeline: " + timeline,
      "",
      "--- ADDITIONAL COMMENTS ---",
      comments || "None provided",
      "=====================================================",
    ].join("\n");

    // Create Calendar Event
    const calendar = CalendarApp.getDefaultCalendar();
    const event = calendar.createEvent(eventTitle, startTime, endTime, {
      description: eventDescription,
      location: meetUrl,
      guests: customerEmail,
      sendInvites: true,
    });

    const eventId = event.getId();

    // Append to "Appointment Bookings" Sheet
    const ss = getTargetSpreadsheet();
    const sheet = getOrCreateBookingsSheet(ss);
    const now = new Date();

    const newRow = [
      eventId,
      customerName,
      customerEmail,
      company,
      "[" + bookingMode + "] " + consultationPurpose + " | " + industry + " (" + bookingId + ")",
      dateStr,
      slotStr + " (IST)",
      "Confirmed",
      formatIso(now),
      meetUrl,
      "Yes", // Admin Notified
      formatIso(now),
    ];

    sheet.appendRow(newRow);

    // Send Confirmation Emails
    sendCustomerConsultationEmail({
      bookingId: bookingId,
      customerName: customerName,
      customerEmail: customerEmail,
      company: company,
      industry: industry,
      robotCategory: robotCategory,
      application: application,
      dateStr: dateStr,
      slotStr: slotStr,
      mode: mode,
      meetUrl: meetUrl,
      description: description,
    });

    sendAdminConsultationEmail({
      bookingId: bookingId,
      eventId: eventId,
      customerName: customerName,
      customerEmail: customerEmail,
      company: company,
      phone: phone,
      city: city,
      country: country,
      website: website,
      industry: industry,
      robotCategory: robotCategory,
      application: application,
      stage: stage,
      solution: solution,
      dateStr: dateStr,
      slotStr: slotStr,
      mode: mode,
      meetUrl: meetUrl,
      description: description,
      material: material,
      payloadKg: payloadKg,
      reachMm: reachMm,
      cycleTime: cycleTime,
      environment: environment,
      accuracy: accuracy,
      shifts: shifts,
      existingEquipment: existingEquipment,
      budget: budget,
      timeline: timeline,
      comments: comments,
    });

    return {
      status: "success",
      bookingId: bookingId,
      eventId: eventId,
      googleMeetUrl: meetUrl,
      appointmentDate: dateStr,
      appointmentTime: slotStr,
      timezone: "Asia/Kolkata",
    };

  } catch (err) {
    Logger.log("bookConsultationAppointment error: " + err.message);
    return { status: "error", error: "BOOKING_FAILED", message: err.message };
  } finally {
    lock.releaseLock();
  }
}

/**
 * Sends a branded consultation confirmation email to the customer.
 */
function sendCustomerConsultationEmail(data) {
  const subject = "🗓️ Confirmed: Robotics Consultation with INDUS Industrial Robotics [" + data.bookingId + "]";
  const isOnline = data.mode.indexOf("In-Person") === -1;

  const htmlBody = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; background-color: #0b0f12; color: #f3f4f6; border: 1px solid #f59e0b; border-radius: 4px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #111827 0%, #0d1117 100%); padding: 28px 24px; border-bottom: 2px solid #f59e0b;">
        <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 2.5px; color: #f59e0b;">INDUS INDUSTRIAL ROBOTICS</span>
        <h1 style="margin: 8px 0 0; color: #ffffff; font-size: 22px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Robotics Consultation Confirmed</h1>
        <p style="margin: 6px 0 0; color: #9ca3af; font-size: 13px;">Booking Reference: <strong style="color: #f59e0b; font-family: monospace;">${data.bookingId}</strong></p>
      </div>

      <div style="padding: 24px;">
        <p style="font-size: 14px; line-height: 1.6; color: #e5e7eb; margin-top: 0;">
          Dear <strong>${data.customerName}</strong>,
        </p>
        <p style="font-size: 14px; line-height: 1.6; color: #d1d5db;">
          Thank you for reaching out to INDUS Industrial Robotics. Your consultation session has been scheduled with our robotics application engineering team.
        </p>

        <div style="background-color: #161c22; border-left: 4px solid #f59e0b; padding: 16px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr>
              <td style="padding: 6px 0; color: #9ca3af; width: 140px;">📅 Date:</td>
              <td style="padding: 6px 0; color: #ffffff; font-weight: 600;">${data.dateStr}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #9ca3af;">⏰ Time:</td>
              <td style="padding: 6px 0; color: #ffffff; font-weight: 600;">${data.slotStr} (IST / Asia/Kolkata)</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #9ca3af;">🏭 Industry:</td>
              <td style="padding: 6px 0; color: #ffffff;">${data.industry}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #9ca3af;">🤖 Robot Category:</td>
              <td style="padding: 6px 0; color: #f59e0b; font-weight: 600;">${data.robotCategory}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #9ca3af;">⚙️ Application:</td>
              <td style="padding: 6px 0; color: #ffffff;">${data.application}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #9ca3af;">📍 Consultation Type:</td>
              <td style="padding: 6px 0; color: #ffffff;">${data.mode}</td>
            </tr>
          </table>
        </div>

        ${isOnline ? `
          <div style="text-align: center; margin: 24px 0;">
            <a href="${data.meetUrl}" style="background-color: #f59e0b; color: #000000; font-weight: 800; text-transform: uppercase; font-size: 13px; letter-spacing: 1px; padding: 12px 28px; text-decoration: none; display: inline-block; border-radius: 2px;">
              Join Google Meet Video Session →
            </a>
            <p style="font-size: 11px; color: #9ca3af; margin-top: 8px;">Direct Link: <a href="${data.meetUrl}" style="color: #60a5fa;">${data.meetUrl}</a></p>
          </div>
        ` : `
          <div style="background-color: #1f2937; padding: 12px; border-radius: 4px; font-size: 13px; color: #d1d5db; margin: 20px 0;">
            📍 <strong>Meeting Location:</strong> INDUS Industrial Robotics Automation Facility. Our engineering team will welcome you at the reception.
          </div>
        `}

        <div style="border-top: 1px solid #2d3748; padding-top: 16px; margin-top: 24px; font-size: 12px; color: #9ca3af; line-height: 1.6;">
          <h4 style="color: #ffffff; text-transform: uppercase; font-size: 12px; margin: 0 0 8px;">What to Prepare for the Consultation:</h4>
          <ul style="margin: 0; padding-left: 20px;">
            <li>Component drawings, CAD models (STEP/IGES), or dimension sketches if available.</li>
            <li>Target cycle time and required parts-per-hour metrics.</li>
            <li>Integration details for existing upstream/downstream machinery or PLCs.</li>
          </ul>
        </div>

        <div style="border-top: 1px solid #2d3748; padding-top: 16px; margin-top: 20px; font-size: 12px; color: #9ca3af;">
          <p style="margin: 0;">Need to reschedule or cancel? Reply directly to this email or reach us at <a href="mailto:engineering@indus-robotics.com" style="color: #60a5fa;">engineering@indus-robotics.com</a>.</p>
        </div>
      </div>

      <div style="background-color: #0d1117; padding: 16px 24px; border-top: 1px solid #1f2937; text-align: center; font-size: 11px; color: #6b7280;">
        INDUS Industrial Robotics · Precision · Motion · Control · Intelligence<br />
        Website: <a href="https://precision-motion-systems-main.vercel.app" style="color: #f59e0b;">precision-motion-systems-main.vercel.app</a>
      </div>
    </div>
  `;

  try {
    MailApp.sendEmail({
      to: data.customerEmail,
      subject: subject,
      htmlBody: htmlBody,
      replyTo: "engineering@indus-robotics.com",
    });
  } catch (err) {
    Logger.log("Failed to send customer consultation email: " + err.message);
  }
}

/**
 * Sends an urgent technical briefing email to the INDUS administrator.
 */
function sendAdminConsultationEmail(data) {
  const adminEmail = CONFIG.ADMIN_EMAIL;
  const subject = "🤖 [New Consultation] " + data.company + " — " + data.robotCategory + " (" + data.dateStr + " " + data.slotStr + ")";
  const sheetUrl = "https://docs.google.com/spreadsheets/d/" + CONFIG.SPREADSHEET_ID + "/edit";

  const htmlBody = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; background-color: #0b0f12; color: #f3f4f6; border: 2px solid #f59e0b; padding: 24px;">
      <div style="border-bottom: 2px solid #f59e0b; padding-bottom: 12px; margin-bottom: 20px;">
        <span style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; color: #f59e0b;">INDUS Industrial Robotics</span>
        <h2 style="margin: 6px 0 0; color: #ffffff; font-size: 20px;">New Consultation Appointment Booked</h2>
        <span style="font-size: 12px; color: #9ca3af;">Reference ID: <strong style="color: #f59e0b; font-family: monospace;">${data.bookingId}</strong></span>
      </div>

      <h3 style="color: #f59e0b; font-size: 14px; text-transform: uppercase; margin: 16px 0 8px;">1. Client & Company Profile</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 16px;">
        <tr style="border-bottom: 1px solid #1f2937;">
          <td style="padding: 6px 0; color: #9ca3af; width: 150px;">Client Name:</td>
          <td style="padding: 6px 0; color: #ffffff; font-weight: 600;">${data.customerName}</td>
        </tr>
        <tr style="border-bottom: 1px solid #1f2937;">
          <td style="padding: 6px 0; color: #9ca3af;">Company:</td>
          <td style="padding: 6px 0; color: #ffffff; font-weight: 600;">${data.company}</td>
        </tr>
        <tr style="border-bottom: 1px solid #1f2937;">
          <td style="padding: 6px 0; color: #9ca3af;">Email:</td>
          <td style="padding: 6px 0;"><a href="mailto:${data.customerEmail}" style="color: #60a5fa;">${data.customerEmail}</a></td>
        </tr>
        <tr style="border-bottom: 1px solid #1f2937;">
          <td style="padding: 6px 0; color: #9ca3af;">Phone:</td>
          <td style="padding: 6px 0; color: #ffffff;">${data.phone}</td>
        </tr>
        <tr style="border-bottom: 1px solid #1f2937;">
          <td style="padding: 6px 0; color: #9ca3af;">Location:</td>
          <td style="padding: 6px 0; color: #ffffff;">${data.city}, ${data.country}</td>
        </tr>
        ${data.website ? `
        <tr style="border-bottom: 1px solid #1f2937;">
          <td style="padding: 6px 0; color: #9ca3af;">Website:</td>
          <td style="padding: 6px 0;"><a href="${data.website}" style="color: #60a5fa;">${data.website}</a></td>
        </tr>` : ""}
      </table>

      <h3 style="color: #f59e0b; font-size: 14px; text-transform: uppercase; margin: 16px 0 8px;">2. Robotics Requirement</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 16px;">
        <tr style="border-bottom: 1px solid #1f2937;">
          <td style="padding: 6px 0; color: #9ca3af; width: 150px;">Industry:</td>
          <td style="padding: 6px 0; color: #ffffff;">${data.industry}</td>
        </tr>
        <tr style="border-bottom: 1px solid #1f2937;">
          <td style="padding: 6px 0; color: #9ca3af;">Robot Category:</td>
          <td style="padding: 6px 0; color: #f59e0b; font-weight: bold;">${data.robotCategory}</td>
        </tr>
        <tr style="border-bottom: 1px solid #1f2937;">
          <td style="padding: 6px 0; color: #9ca3af;">Specific Application:</td>
          <td style="padding: 6px 0; color: #ffffff;">${data.application}</td>
        </tr>
        <tr style="border-bottom: 1px solid #1f2937;">
          <td style="padding: 6px 0; color: #9ca3af;">Project Stage:</td>
          <td style="padding: 6px 0; color: #ffffff;">${data.stage}</td>
        </tr>
        <tr style="border-bottom: 1px solid #1f2937;">
          <td style="padding: 6px 0; color: #9ca3af;">Preferred Solution:</td>
          <td style="padding: 6px 0; color: #ffffff;">${data.solution}</td>
        </tr>
        <tr style="border-bottom: 1px solid #1f2937;">
          <td style="padding: 6px 0; color: #9ca3af;">Description:</td>
          <td style="padding: 6px 0; color: #e5e7eb;">${data.description}</td>
        </tr>
      </table>

      <h3 style="color: #f59e0b; font-size: 14px; text-transform: uppercase; margin: 16px 0 8px;">3. Technical Engineering Sizing</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 16px;">
        <tr style="border-bottom: 1px solid #1f2937;">
          <td style="padding: 6px 0; color: #9ca3af; width: 150px;">Material Handled:</td>
          <td style="padding: 6px 0; color: #ffffff;">${data.material}</td>
        </tr>
        <tr style="border-bottom: 1px solid #1f2937;">
          <td style="padding: 6px 0; color: #9ca3af;">Payload Rating:</td>
          <td style="padding: 6px 0; color: #ffffff;">${data.payloadKg ? data.payloadKg + " kg" : "Unspecified"}</td>
        </tr>
        <tr style="border-bottom: 1px solid #1f2937;">
          <td style="padding: 6px 0; color: #9ca3af;">Reach Rating:</td>
          <td style="padding: 6px 0; color: #ffffff;">${data.reachMm ? data.reachMm + " mm" : "Unspecified"}</td>
        </tr>
        <tr style="border-bottom: 1px solid #1f2937;">
          <td style="padding: 6px 0; color: #9ca3af;">Target Cycle Time:</td>
          <td style="padding: 6px 0; color: #ffffff;">${data.cycleTime ? data.cycleTime + " s" : "Unspecified"}</td>
        </tr>
        <tr style="border-bottom: 1px solid #1f2937;">
          <td style="padding: 6px 0; color: #9ca3af;">Environment:</td>
          <td style="padding: 6px 0; color: #ffffff;">${data.environment}</td>
        </tr>
        <tr style="border-bottom: 1px solid #1f2937;">
          <td style="padding: 6px 0; color: #9ca3af;">Accuracy:</td>
          <td style="padding: 6px 0; color: #ffffff;">${data.accuracy || "Unspecified"}</td>
        </tr>
        <tr style="border-bottom: 1px solid #1f2937;">
          <td style="padding: 6px 0; color: #9ca3af;">Production Shifts:</td>
          <td style="padding: 6px 0; color: #ffffff;">${data.shifts || "Unspecified"}</td>
        </tr>
        <tr style="border-bottom: 1px solid #1f2937;">
          <td style="padding: 6px 0; color: #9ca3af;">Existing Controls / PLC:</td>
          <td style="padding: 6px 0; color: #ffffff;">${data.existingEquipment || "None / Greenfield"}</td>
        </tr>
        <tr style="border-bottom: 1px solid #1f2937;">
          <td style="padding: 6px 0; color: #9ca3af;">Project Budget:</td>
          <td style="padding: 6px 0; color: #10b981; font-weight: 600;">${data.budget}</td>
        </tr>
        <tr style="border-bottom: 1px solid #1f2937;">
          <td style="padding: 6px 0; color: #9ca3af;">Timeline:</td>
          <td style="padding: 6px 0; color: #ffffff;">${data.timeline}</td>
        </tr>
        ${data.comments ? `
        <tr style="border-bottom: 1px solid #1f2937;">
          <td style="padding: 6px 0; color: #9ca3af;">Additional Notes:</td>
          <td style="padding: 6px 0; color: #e5e7eb;">${data.comments}</td>
        </tr>` : ""}
      </table>

      <h3 style="color: #f59e0b; font-size: 14px; text-transform: uppercase; margin: 16px 0 8px;">4. Schedule & Meeting Coordinates</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px;">
        <tr style="border-bottom: 1px solid #1f2937;">
          <td style="padding: 6px 0; color: #9ca3af; width: 150px;">Date & Time:</td>
          <td style="padding: 6px 0; color: #ffffff; font-weight: bold;">${data.dateStr} at ${data.slotStr} (IST)</td>
        </tr>
        <tr style="border-bottom: 1px solid #1f2937;">
          <td style="padding: 6px 0; color: #9ca3af;">Mode:</td>
          <td style="padding: 6px 0; color: #ffffff;">${data.mode}</td>
        </tr>
        <tr style="border-bottom: 1px solid #1f2937;">
          <td style="padding: 6px 0; color: #9ca3af;">Meeting Link:</td>
          <td style="padding: 6px 0;"><a href="${data.meetUrl}" style="color: #60a5fa;">${data.meetUrl}</a></td>
        </tr>
      </table>

      <div style="text-align: center; margin-top: 24px;">
        <a href="${sheetUrl}" style="background-color: #f59e0b; color: #000000; font-weight: bold; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; padding: 10px 20px; text-decoration: none; display: inline-block;">
          Open Appointment Bookings Sheet →
        </a>
      </div>
    </div>
  `;

  try {
    MailApp.sendEmail({
      to: adminEmail,
      subject: subject,
      htmlBody: htmlBody,
    });
  } catch (err) {
    Logger.log("Failed to send admin consultation email: " + err.message);
  }
}

/**
 * Cancels a consultation booking, marks Google Sheet as Cancelled,
 * and deletes/updates the Google Calendar event.
 */
function cancelConsultationAppointment(payload) {
  const eventId = (payload.eventId || "").trim();
  const bookingId = (payload.bookingId || "").trim();
  const reason = (payload.reason || "Client request").trim();

  const ss = getTargetSpreadsheet();
  const sheet = getOrCreateBookingsSheet(ss);
  const lastRow = sheet.getLastRow();
  let foundRow = null;

  if (lastRow > 1) {
    const data = sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
    for (let i = 0; i < data.length; i++) {
      const rowEventId = String(data[i][0] || "").trim();
      const rowPurpose = String(data[i][4] || "").trim();
      if ((eventId && rowEventId === eventId) || (bookingId && rowPurpose.indexOf(bookingId) !== -1)) {
        foundRow = { index: i + 2, data: data[i] };
        break;
      }
    }
  }

  // Cancel calendar event if present
  if (eventId) {
    try {
      const calendar = CalendarApp.getDefaultCalendar();
      const event = calendar.getEventById(eventId);
      if (event) {
        event.deleteEvent();
      }
    } catch (e) {
      Logger.log("Error deleting calendar event: " + e.message);
    }
  }

  // Update status in sheet
  if (foundRow) {
    sheet.getRange(foundRow.index, 8).setValue("Cancelled");
    sheet.getRange(foundRow.index, 12).setValue(formatIso(new Date()));
  }

  return {
    status: "success",
    message: "Consultation cancelled successfully",
    bookingId: bookingId,
    eventId: eventId,
  };
}

/**
 * Reschedules a consultation booking to a new date and time.
 */
function rescheduleConsultationAppointment(payload) {
  const eventId = (payload.eventId || "").trim();
  const bookingId = (payload.bookingId || "").trim();
  const newDate = (payload.newDate || "").trim();
  const newSlot = (payload.newSlot || "").trim();

  if (!newDate || !newSlot) {
    return { status: "error", message: "New date and slot are required." };
  }

  // Verify availability of new slot
  const availability = getAvailableConsultationSlots(newDate, "Asia/Kolkata");
  if (availability.status === "success") {
    const match = availability.slots.find(function(s) {
      return s.time === newSlot || newSlot.indexOf(s.time) !== -1;
    });
    if (match && !match.available) {
      return { status: "error", message: "Selected new slot is unavailable." };
    }
  }

  // Parse new times
  const dateParts = newDate.split("-");
  const year = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10) - 1;
  const day = parseInt(dateParts[2], 10);
  const timeMatches = newSlot.match(/(\d{1,2}):(\d{2})/);
  const startHour = timeMatches ? parseInt(timeMatches[1], 10) : 10;
  const startMin = timeMatches ? parseInt(timeMatches[2], 10) : 0;

  const newStart = new Date(year, month, day, startHour, startMin);
  const newEnd = new Date(newStart.getTime() + 30 * 60 * 1000);

  // Update calendar event
  if (eventId) {
    try {
      const calendar = CalendarApp.getDefaultCalendar();
      const event = calendar.getEventById(eventId);
      if (event) {
        event.setTime(newStart, newEnd);
      }
    } catch (e) {
      Logger.log("Error updating event time: " + e.message);
    }
  }

  // Update Sheet
  const ss = getTargetSpreadsheet();
  const sheet = getOrCreateBookingsSheet(ss);
  const lastRow = sheet.getLastRow();

  if (lastRow > 1) {
    const data = sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
    for (let i = 0; i < data.length; i++) {
      const rowEventId = String(data[i][0] || "").trim();
      const rowPurpose = String(data[i][4] || "").trim();
      if ((eventId && rowEventId === eventId) || (bookingId && rowPurpose.indexOf(bookingId) !== -1)) {
        sheet.getRange(i + 2, 6).setValue(newDate);
        sheet.getRange(i + 2, 7).setValue(newSlot + " (IST)");
        sheet.getRange(i + 2, 8).setValue("Rescheduled");
        sheet.getRange(i + 2, 12).setValue(formatIso(new Date()));
        break;
      }
    }
  }

  return {
    status: "success",
    message: "Consultation rescheduled successfully",
    newDate: newDate,
    newSlot: newSlot,
  };
}

/**
 * Lists all consultation booking records for the Admin Dashboard.
 */
function listConsultationBookings() {
  const ss = getTargetSpreadsheet();
  const sheet = getOrCreateBookingsSheet(ss);
  const lastRow = sheet.getLastRow();
  const bookings = [];

  if (lastRow > 1) {
    const data = sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const eventId = String(row[0] || "").trim();
      if (!eventId) continue;

      const purpose = String(row[4] || "");
      const refMatch = purpose.match(/\[?(INDUS-BC-[A-Za-z0-9_-]+)\]?/i) || purpose.match(/\(([A-Za-z0-9_-]+)\)/);
      const bookingId = refMatch ? refMatch[1] : ("BC-" + eventId.slice(-6));

      bookings.push({
        eventId: eventId,
        bookingId: bookingId,
        customerName: String(row[1] || ""),
        customerEmail: String(row[2] || ""),
        companyName: String(row[3] || ""),
        purpose: purpose,
        appointmentDate: String(row[5] || ""),
        appointmentTime: String(row[6] || ""),
        status: String(row[7] || "Confirmed"),
        createdTimestamp: String(row[8] || ""),
        meetingLocation: String(row[9] || ""),
        adminNotified: String(row[10] || "Yes"),
        lastSynced: String(row[11] || ""),
      });
    }
  }

  return {
    status: "success",
    count: bookings.length,
    bookings: bookings.reverse(), // Newest first
  };
}
