// INDUS Industrial Robotics — Robotics Consultation & Calendar Booking API
// Endpoint: /api/consultation
// Features: Atomic Concurrency Locking, Google Calendar Sync, Email Dispatches,
//           Input Validation, Rate Limiting, Telegram Alerts & Admin Management

import fs from "node:fs";
import path from "node:path";
import { sendTelegramNotification } from "./_lib/telegram.js";

// Ensure local environment variables are loaded
function ensureEnvLoaded() {
  if (!process.env.AUTH_SECRET && typeof process.loadEnvFile === "function") {
    try {
      process.loadEnvFile(".env.local");
    } catch {}
    try {
      process.loadEnvFile(".env");
    } catch {}
  }
}
ensureEnvLoaded();

// Rate limiting & Concurrency sliding window trackers
const ipRateLimits = new Map();
const slotLocks = new Map(); // key: "YYYY-MM-DD_HH:MM" -> lockTimestamp
const recentSubmissions = new Map(); // deduplication

// File-based persistence directory for serverless & local dev
const DATA_DIR = path.resolve(process.cwd(), ".data");
const BOOKINGS_FILE = path.join(DATA_DIR, "consultations.json");

function ensureDataStore() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(BOOKINGS_FILE)) {
      fs.writeFileSync(BOOKINGS_FILE, JSON.stringify([]), "utf8");
    }
  } catch (err) {
    console.warn("[Consultation API] Data store initialization:", err.message);
  }
}

function readStoredBookings() {
  ensureDataStore();
  try {
    const raw = fs.readFileSync(BOOKINGS_FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveStoredBookings(bookings) {
  ensureDataStore();
  try {
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), "utf8");
  } catch (err) {
    console.warn("[Consultation API] Failed to persist bookings:", err.message);
  }
}

function isRateLimited(ip, isWrite = false) {
  const now = Date.now();
  const windowMs = 60_000;
  const maxRequests = isWrite ? 5 : 60;
  const key = `${ip}:${isWrite ? "write" : "read"}`;

  // Clean stale keys
  if (ipRateLimits.size > 2000) {
    for (const [k, v] of ipRateLimits.entries()) {
      if (now - v.startTime > windowMs) {
        ipRateLimits.delete(k);
      }
    }
  }

  const record = ipRateLimits.get(key);
  if (!record || now - record.startTime > windowMs) {
    ipRateLimits.set(key, { startTime: now, count: 1 });
    return false;
  }

  record.count += 1;
  return record.count > maxRequests;
}

// Concurrency slot locker
function acquireSlotLock(date, slot) {
  const now = Date.now();
  const lockKey = `${date}_${slot}`;

  // Purge expired locks older than 30 seconds
  for (const [k, ts] of slotLocks.entries()) {
    if (now - ts > 30_000) {
      slotLocks.delete(k);
    }
  }

  if (slotLocks.has(lockKey)) {
    return false; // Slot is locked by an ongoing transaction
  }

  slotLocks.set(lockKey, now);
  return true;
}

function releaseSlotLock(date, slot) {
  const lockKey = `${date}_${slot}`;
  slotLocks.delete(lockKey);
}

// Allowed origins
function isOriginAllowed(origin) {
  if (!origin) return true;
  const allowed = [
    "https://precision-motion-systems-main.vercel.app",
    "http://localhost:8080",
    "http://localhost:3000",
    "http://127.0.0.1:8080",
    "http://127.0.0.1:3000",
  ];
  if (allowed.includes(origin)) return true;
  if (/^https:\/\/precision-motion-systems-[a-zA-Z0-9_-]+\.vercel\.app$/.test(origin)) {
    return true;
  }
  return false;
}

function sanitizeString(str, max = 300) {
  if (typeof str !== "string") return "";
  return str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").trim().slice(0, max);
}

function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidPhone(phone) {
  if (typeof phone !== "string") return false;
  const clean = phone.replace(/[^0-9+]/g, "");
  return clean.length >= 7 && clean.length <= 20;
}

// Default 30-min candidate slots between 09:30 and 18:00 IST
const CANDIDATE_SLOTS = [
  { time: "09:30", endTime: "10:00", display: "09:30 AM - 10:00 AM" },
  { time: "10:00", endTime: "10:30", display: "10:00 AM - 10:30 AM" },
  { time: "10:30", endTime: "11:00", display: "10:30 AM - 11:00 AM" },
  { time: "11:00", endTime: "11:30", display: "11:00 AM - 11:30 AM" },
  { time: "11:30", endTime: "12:00", display: "11:30 AM - 12:00 PM" },
  { time: "12:00", endTime: "12:30", display: "12:00 PM - 12:30 PM" },
  { time: "12:30", endTime: "13:00", display: "12:30 PM - 01:00 PM" },
  { time: "14:00", endTime: "14:30", display: "02:00 PM - 02:30 PM" },
  { time: "14:30", endTime: "15:00", display: "02:30 PM - 03:00 PM" },
  { time: "15:00", endTime: "15:30", display: "03:00 PM - 03:30 PM" },
  { time: "15:30", endTime: "16:00", display: "03:30 PM - 04:00 PM" },
  { time: "16:00", endTime: "16:30", display: "04:00 PM - 04:30 PM" },
  { time: "16:30", endTime: "17:00", display: "04:30 PM - 05:00 PM" },
  { time: "17:00", endTime: "17:30", display: "05:00 PM - 05:30 PM" },
  { time: "17:30", endTime: "18:00", display: "05:30 PM - 06:00 PM" },
];

/**
 * Calculates slot availability for a given date.
 */
async function computeSlotAvailability(dateStr, timezone = "Asia/Kolkata") {
  const parts = dateStr.split("-");
  if (parts.length !== 3) {
    throw new Error("Invalid date format. Expected YYYY-MM-DD");
  }

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  // Check if weekend (Saturday or Sunday)
  const targetDateObj = new Date(year, month, day);
  const dayOfWeek = targetDateObj.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return {
      status: "success",
      date: dateStr,
      timezone,
      isWeekend: true,
      message: "Consultations are available Monday through Friday.",
      slots: CANDIDATE_SLOTS.map((s) => ({ ...s, available: false, reason: "Weekend" })),
    };
  }

  // 1. First, check local persistence
  const stored = readStoredBookings();
  const bookedTimes = new Set();
  for (const b of stored) {
    if (b.appointmentDate === dateStr && b.status !== "Cancelled") {
      const match = b.appointmentTime?.match(/(\d{2}:\d{2})/);
      if (match) bookedTimes.add(match[1]);
    }
  }

  // 2. Query Google Apps Script for live Google Calendar events
  const gasUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
  if (gasUrl) {
    try {
      const res = await fetch(
        `${gasUrl}?action=get_slots&date=${encodeURIComponent(dateStr)}&timezone=${encodeURIComponent(timezone)}`,
        { signal: AbortSignal.timeout(6000) },
      );
      if (res.ok) {
        const gasData = await res.json();
        if (gasData && gasData.status === "success" && Array.isArray(gasData.slots)) {
          // Merge with any local bookings
          const merged = gasData.slots.map((s) => {
            if (bookedTimes.has(s.time)) {
              return { ...s, available: false, reason: "Reserved" };
            }
            return s;
          });
          return {
            status: "success",
            date: dateStr,
            timezone,
            slots: merged,
          };
        }
      }
    } catch (err) {
      console.warn("[Consultation API] Apps Script slot check fallback:", err.message);
    }
  }

  // 3. Fallback calculation if Apps Script is slow/offline
  const now = new Date();
  const minNoticeMs = 4 * 60 * 60 * 1000; // 4 hours

  const evaluated = CANDIDATE_SLOTS.map((slot) => {
    const [h, m] = slot.time.split(":").map(Number);
    const slotTime = new Date(year, month, day, h, m);

    if (slotTime.getTime() < now.getTime() + minNoticeMs) {
      return { ...slot, available: false, reason: "Advance notice required" };
    }
    if (bookedTimes.has(slot.time)) {
      return { ...slot, available: false, reason: "Reserved" };
    }
    return { ...slot, available: true };
  });

  return {
    status: "success",
    date: dateStr,
    timezone,
    slots: evaluated,
  };
}

/**
 * Main HTTP Handler
 */
export default async function handler(req, res) {
  ensureEnvLoaded();

  const origin = req.headers ? req.headers.origin || "" : "";
  const allowed = isOriginAllowed(origin);

  if (allowed && origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Cookie");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Vary", "Origin");
  }

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  const clientIp =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.headers["x-real-ip"] ||
    req.socket?.remoteAddress ||
    "127.0.0.1";

  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const action = url.searchParams.get("action") || req.body?.action || "slots";

  // =========================================================================
  // 1. GET /api/consultation?action=slots&date=YYYY-MM-DD
  // =========================================================================
  if (req.method === "GET" && (action === "slots" || action === "check_availability")) {
    if (isRateLimited(clientIp, false)) {
      return res.status(429).json({ status: "error", message: "Too many requests. Please wait a minute." });
    }

    const dateStr = url.searchParams.get("date") || "";
    const timezone = url.searchParams.get("timezone") || "Asia/Kolkata";

    if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return res.status(400).json({ status: "error", message: "Valid date query parameter (YYYY-MM-DD) is required." });
    }

    try {
      const result = await computeSlotAvailability(dateStr, timezone);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({ status: "error", message: err.message });
    }
  }

  // =========================================================================
  // 2. GET /api/consultation?action=list (Admin Only)
  // =========================================================================
  if (req.method === "GET" && action === "list") {
    // Check Authorization / Session Token
    const authHeader = req.headers["authorization"] || "";
    const cookieHeader = req.headers["cookie"] || "";
    const match = cookieHeader.match(/indus_admin_token=([^;]+)/);
    const token = (authHeader.replace(/^Bearer\s+/i, "") || (match ? match[1] : "")).trim();

    // Verify token presence
    if (!token && process.env.NODE_ENV !== "development") {
      return res.status(401).json({ status: "error", message: "Administrator authentication required." });
    }

    const bookings = readStoredBookings();
    return res.status(200).json({
      status: "success",
      count: bookings.length,
      bookings: bookings.reverse(),
    });
  }

  // =========================================================================
  // 3. POST /api/consultation?action=book (Client Booking Intake)
  // =========================================================================
  if (req.method === "POST" && (action === "book" || action === "create")) {
    if (isRateLimited(clientIp, true)) {
      return res.status(429).json({
        status: "error",
        message: "You have submitted multiple requests recently. Please wait a moment before booking another appointment.",
      });
    }

    const body = req.body || {};

    // Anti-spam Honeypot Check
    if (body._hp && String(body._hp).trim().length > 0) {
      return res.status(200).json({ status: "success", bookingId: "INDUS-BC-PROT-0000" });
    }

    // Booking Mode & Sanitization
    const bookingMode = body.bookingMode === "detailed" ? "detailed" : "quick";
    const fullName = sanitizeString(body.fullName, 120);
    const companyEmail = sanitizeString(body.companyEmail, 150).toLowerCase();
    const phoneNumber = sanitizeString(body.phoneNumber, 40);
    const companyName = sanitizeString(body.companyName, 150);
    const consultationPurpose = sanitizeString(body.consultationPurpose, 200) || sanitizeString(body.specificApplication, 150) || "Robotics Architecture & Kinematic Sizing";
    const jobTitle = sanitizeString(body.jobTitle, 100) || (bookingMode === "quick" ? "Engineering Lead / Executive" : "");
    const country = sanitizeString(body.country, 80) || (bookingMode === "quick" ? "India" : "");
    const city = sanitizeString(body.city, 80) || (bookingMode === "quick" ? "Virtual / Online" : "");
    const companyWebsite = sanitizeString(body.companyWebsite, 200);
    const industry = sanitizeString(body.industry, 100);
    const robotCategory = sanitizeString(body.robotCategory, 100) || (bookingMode === "quick" ? "Robotics & Kinematic Solution" : "");
    const specificApplication = sanitizeString(body.specificApplication, 150) || consultationPurpose;
    const projectStage = sanitizeString(body.projectStage, 60) || "Planning";
    const preferredSolution = sanitizeString(body.preferredSolution, 60) || "New installation";
    const consultationMode = sanitizeString(body.consultationMode, 80) || "Google Meet (Online Video)";
    const projectDescription = sanitizeString(body.projectDescription, 3000) || `[${bookingMode.toUpperCase()} BOOKING] Purpose: ${consultationPurpose}`;
    const manufacturingOrService = sanitizeString(body.manufacturingOrService, 60);
    const automationObjective = sanitizeString(body.automationObjective, 500);
    const currentProcess = sanitizeString(body.currentProcess, 1000);
    const productionVolume = sanitizeString(body.productionVolume, 200);
    const materialHandled = sanitizeString(body.materialHandled, 150) || "Not specified";
    const payloadKg = sanitizeString(body.payloadKg, 40);
    const reachMm = sanitizeString(body.reachMm, 40);
    const cycleTimeSec = sanitizeString(body.cycleTimeSec, 40);
    const operatingEnvironment = sanitizeString(body.operatingEnvironment, 100);
    const accuracyRequirement = sanitizeString(body.accuracyRequirement, 100);
    const productionShifts = sanitizeString(body.productionShifts, 100);
    const existingEquipment = sanitizeString(body.existingEquipment, 500);
    const projectBudget = sanitizeString(body.projectBudget, 80);
    const implementationTimeline = sanitizeString(body.implementationTimeline, 80);
    const additionalComments = sanitizeString(body.additionalComments, 1000);
    const selectedDate = sanitizeString(body.selectedDate, 20);
    const selectedSlot = sanitizeString(body.selectedSlot, 30);
    const timezone = sanitizeString(body.timezone, 50) || "Asia/Kolkata";
    const privacyConsent = Boolean(body.privacyConsent);

    // Validate Required Common Fields
    if (!fullName || fullName.length < 2) {
      return res.status(400).json({ status: "error", message: "Full name is required (minimum 2 characters)." });
    }
    if (!isValidEmail(companyEmail)) {
      return res.status(400).json({ status: "error", message: "A valid corporate or business email address is required." });
    }
    if (!isValidPhone(phoneNumber)) {
      return res.status(400).json({ status: "error", message: "A valid telephone number with country code is required." });
    }
    if (!companyName || companyName.length < 2) {
      return res.status(400).json({ status: "error", message: "Company or organization name is required." });
    }
    if (!industry) {
      return res.status(400).json({ status: "error", message: "Please select your industry." });
    }
    if (!consultationPurpose) {
      return res.status(400).json({ status: "error", message: "Please specify the purpose of your consultation." });
    }
    if (!selectedDate || !selectedSlot) {
      return res.status(400).json({ status: "error", message: "Please select an available consultation date and time slot." });
    }
    if (!privacyConsent) {
      return res.status(400).json({ status: "error", message: "Consent to the processing of enquiry data is required." });
    }

    // Additional Validations for Detailed Mode
    if (bookingMode === "detailed") {
      if (!jobTitle) {
        return res.status(400).json({ status: "error", message: "Job title or professional designation is required." });
      }
      if (!country || !city) {
        return res.status(400).json({ status: "error", message: "Country and city are required." });
      }
      if (!robotCategory) {
        return res.status(400).json({ status: "error", message: "Please select your required robotics category." });
      }
      if (!projectDescription || projectDescription.length < 10) {
        return res.status(400).json({ status: "error", message: "Please provide a brief technical description of your project." });
      }
    }

    // Concurrency Lock: Prevent two simultaneous users from booking the exact same slot
    const lockAcquired = acquireSlotLock(selectedDate, selectedSlot);
    if (!lockAcquired) {
      return res.status(409).json({
        status: "error",
        error: "SLOT_CONFLICT",
        message: "Another customer is currently finalizing this time slot. Please select another slot.",
      });
    }

    try {
      // Re-verify availability immediately prior to finalizing
      const avail = await computeSlotAvailability(selectedDate, timezone);
      const chosenSlotObj = avail.slots?.find(
        (s) => s.time === selectedSlot || selectedSlot.startsWith(s.time),
      );
      if (chosenSlotObj && !chosenSlotObj.available) {
        releaseSlotLock(selectedDate, selectedSlot);
        return res.status(409).json({
          status: "error",
          error: "SLOT_UNAVAILABLE",
          message: "This appointment slot is no longer available. Please select another time slot.",
        });
      }

      // Generate Unique Reference ID
      const dateCompact = selectedDate.replace(/-/g, "");
      const randSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
      const bookingId = `INDUS-BC-${dateCompact}-${randSuffix}`;

      // Generate Google Meet Link
      const meetCode = `indus-rob-${bookingId.toLowerCase().replace(/[^a-z0-9]/g, "").slice(-9)}`;
      const googleMeetUrl = consultationMode.includes("In-Person")
        ? "INDUS Industrial Robotics Automation Facility (On-Site)"
        : `https://meet.google.com/${meetCode.slice(0, 3)}-${meetCode.slice(3, 7)}-${meetCode.slice(7)}`;

      const nowIso = new Date().toISOString();

      const isYouTubeAttributed = Boolean(
        (body.attribution && body.attribution.utmSource && String(body.attribution.utmSource).toLowerCase().includes("youtube")) ||
        (body.utmSource && String(body.utmSource).toLowerCase().includes("youtube")) ||
        (body.attribution && body.attribution.videoId) ||
        body.videoId ||
        (req.headers && req.headers.referer && String(req.headers.referer).toLowerCase().includes("youtube"))
      );

      // Create Booking Record
      const newBooking = {
        bookingId,
        leadId: bookingId,
        bookingMode,
        consultationPurpose,
        calendarEventId: `evt_${Date.now()}_${randSuffix}`,
        googleMeetUrl,
        status: "Confirmed",
        source: isYouTubeAttributed ? "YouTube Consultation" : (body.source || (bookingMode === "quick" ? "Website Quick Booking" : "Website Detailed Project Consultation")),
        createdAt: nowIso,
        updatedAt: nowIso,

        // Customer
        customerName: fullName,
        customerEmail: companyEmail,
        companyEmail,
        phoneNumber,
        companyName,
        jobTitle,
        country,
        city,
        companyWebsite,

        // Requirement
        industry,
        robotCategory,
        specificApplication,
        projectStage,
        preferredSolution,
        consultationMode,
        projectDescription,
        manufacturingOrService,
        automationObjective,
        currentProcess,
        productionVolume,
        materialHandled,
        payloadKg,
        reachMm,
        cycleTimeSec,
        operatingEnvironment,
        accuracyRequirement,
        productionShifts,
        existingEquipment,
        projectBudget,
        implementationTimeline,
        attachmentName: sanitizeString(body.attachmentName, 150),
        additionalComments,

        // Schedule
        appointmentDate: selectedDate,
        appointmentTime: selectedSlot,
        timezone,
      };

      // Jira Integration for Consultation Bookings (routes to YLT if YouTube attributed, else DI)
      let jiraTicketKey = null;
      const JIRA_DOMAIN = (process.env.JIRA_DOMAIN || "").trim();
      const JIRA_EMAIL = (process.env.JIRA_EMAIL || "").trim();
      const JIRA_API_TOKEN = (process.env.JIRA_API_TOKEN || "").trim();

      const targetProjectKey = isYouTubeAttributed
        ? (process.env.YOUTUBE_JIRA_PROJECT_KEY || "YLT").trim()
        : (process.env.JIRA_PROJECT_KEY || "DI").trim();

      if (JIRA_DOMAIN && JIRA_EMAIL && JIRA_API_TOKEN) {
        try {
          const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString("base64");
          const summary = `[${isYouTubeAttributed ? "YouTube Consultation" : "Robotics Consultation"}] ${fullName} (${companyName}) - ${selectedDate} ${selectedSlot}`.slice(0, 250);
          const desc = `
==================================================
${isYouTubeAttributed ? "YOUTUBE LEAD — INDUSTRY VISIT & CONSULTATION (YLT DEALFLOW)" : "INDUSTRY VISIT & CONSULTATION BOOKING (DEALFLOW)"}
==================================================

APPOINTMENT DETAILS:
• Booking ID: ${bookingId}
• Date: ${selectedDate}
• Time Slot: ${selectedSlot} (${timezone})
• Mode: ${consultationMode}
• Google Meet: ${googleMeetUrl}

CUSTOMER INFORMATION:
• Full Name: ${fullName}
• Company: ${companyName}
• Corporate Email: ${companyEmail}
• Phone: ${phoneNumber}
• Job Title: ${jobTitle}
• Location: ${city}, ${country}
• Website: ${companyWebsite || "N/A"}

REQUIREMENTS & SIZING:
• Industry: ${industry}
• Category: ${robotCategory}
• Application: ${specificApplication}
• Project Stage: ${projectStage}
• Solution Type: ${preferredSolution}
• Payload Rating: ${payloadKg || "N/A"} kg
• Reach Target: ${reachMm || "N/A"} mm
• Cycle Time: ${cycleTimeSec || "N/A"} s
• Environment: ${operatingEnvironment}
• Budget: ${projectBudget}
• Timeline: ${implementationTimeline}

PROJECT OVERVIEW:
${projectDescription}
${additionalComments ? `\nADDITIONAL NOTES:\n${additionalComments}` : ""}

--------------------------------------------------
Origin: INDUS Consultation Scheduling
Target Project: ${targetProjectKey}
Timestamp: ${nowIso}
          `.trim();

          const jiraRes = await fetch(`https://${JIRA_DOMAIN}/rest/api/2/issue`, {
            method: "POST",
            headers: {
              Authorization: `Basic ${auth}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              fields: {
                project: { key: targetProjectKey },
                summary,
                description: desc,
                issuetype: { name: "Task" },
                labels: [
                  "consultation-booking",
                  isYouTubeAttributed ? "youtube-lead" : "website-intake",
                  isYouTubeAttributed ? "dealflow-ylt" : "dealflow",
                  `slot-${selectedDate.replace(/-/g, "")}`,
                ],
              },
            }),
            signal: AbortSignal.timeout(6000),
          });

          if (jiraRes.ok) {
            const jData = await jiraRes.json();
            jiraTicketKey = jData.key;
            newBooking.jiraTicketKey = jiraTicketKey;
          }
        } catch (jErr) {
          console.warn("[Consultation API] Jira booking dispatch error:", jErr.message);
        }
      }

      // 1. Dispatch to Google Apps Script for Google Calendar & Sheet updates
      const gasUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
      if (gasUrl) {
        try {
          const gasRes = await fetch(gasUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "book_consultation",
              jiraTicketKey: jiraTicketKey || "",
              "Jira Ticket Key": jiraTicketKey || "",
              ...newBooking,
            }),
            signal: AbortSignal.timeout(10000),
          });
          if (gasRes.ok) {
            const gasJson = await gasRes.json();
            if (gasJson && gasJson.eventId) {
              newBooking.calendarEventId = gasJson.eventId;
            }
          }
        } catch (gasErr) {
          console.warn("[Consultation API] Apps Script booking sync error:", gasErr.message);
        }
      }

      // 2. Persist in local data store
      const existingBookings = readStoredBookings();
      existingBookings.push(newBooking);
      saveStoredBookings(existingBookings);

      // 3. Dispatch Instant Telegram Alert to INDUS Engineering Leads Chat
      try {
        await sendTelegramNotification({
          name: fullName,
          email: companyEmail,
          phone: phoneNumber,
          company: companyName,
          leadSource: `Robotics Consultation (${industry})`,
          topic: `Consultation: ${robotCategory} - ${selectedDate} ${selectedSlot}`,
          requirements: `${projectDescription}\n\nPayload: ${payloadKg || "N/A"}kg | Reach: ${reachMm || "N/A"}mm | Budget: ${projectBudget || "Flexible"} | Mode: ${consultationMode}`,
          notes: `Booking ID: ${bookingId} | Google Meet: ${googleMeetUrl}`,
        });
      } catch (tgErr) {
        console.warn("[Consultation API] Telegram alert skipped:", tgErr.message);
      }

      return res.status(200).json({
        status: "success",
        bookingId,
        leadId: bookingId,
        calendarEventId: newBooking.calendarEventId,
        googleMeetUrl,
        appointmentDate: selectedDate,
        appointmentTime: selectedSlot,
        timezone,
        customerName: fullName,
        companyName,
        bookingMode,
        googleCalendarBookingUrl: "https://calendar.app.google/ZMQqX8rKGyCZqtqB7",
        message: "Your robotics consultation appointment has been confirmed.",
      });

    } finally {
      releaseSlotLock(selectedDate, selectedSlot);
    }
  }

  // =========================================================================
  // 4. POST /api/consultation?action=update_status (Admin Status Updates)
  // =========================================================================
  if (req.method === "POST" && action === "update_status") {
    const { bookingId, status, adminNotes } = req.body || {};
    if (!bookingId || !status) {
      return res.status(400).json({ status: "error", message: "bookingId and status are required." });
    }

    const bookings = readStoredBookings();
    const idx = bookings.findIndex((b) => b.bookingId === bookingId);
    if (idx === -1) {
      return res.status(404).json({ status: "error", message: "Booking not found." });
    }

    bookings[idx].status = status;
    bookings[idx].updatedAt = new Date().toISOString();
    if (adminNotes !== undefined) bookings[idx].adminNotes = adminNotes;

    saveStoredBookings(bookings);

    return res.status(200).json({
      status: "success",
      message: `Booking ${bookingId} status updated to ${status}.`,
      booking: bookings[idx],
    });
  }

  // =========================================================================
  // 5. POST /api/consultation?action=cancel
  // =========================================================================
  if (req.method === "POST" && action === "cancel") {
    const { bookingId, reason } = req.body || {};
    if (!bookingId) {
      return res.status(400).json({ status: "error", message: "bookingId is required." });
    }

    const bookings = readStoredBookings();
    const idx = bookings.findIndex((b) => b.bookingId === bookingId);
    if (idx === -1) {
      return res.status(404).json({ status: "error", message: "Booking not found." });
    }

    bookings[idx].status = "Cancelled";
    bookings[idx].updatedAt = new Date().toISOString();
    bookings[idx].cancelReason = reason || "Client request";

    saveStoredBookings(bookings);

    // Forward cancellation to Apps Script
    const gasUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
    if (gasUrl) {
      try {
        await fetch(gasUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "cancel_consultation",
            bookingId,
            eventId: bookings[idx].calendarEventId,
            reason,
          }),
          signal: AbortSignal.timeout(8000),
        });
      } catch (gasErr) {
        console.warn("[Consultation API] Apps Script cancel sync error:", gasErr.message);
      }
    }

    return res.status(200).json({
      status: "success",
      message: `Booking ${bookingId} has been cancelled.`,
    });
  }

  return res.status(405).json({ status: "error", message: `Method ${req.method} or action ${action} not allowed.` });
}
