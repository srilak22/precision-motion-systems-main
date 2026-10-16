// INDUS Industrial Robotics — Scheduled Report Engine & Email Delivery Service
// api/_lib/reports.js
// Handles: Data Aggregation, Period Calculation, Metric Computations,
//          Idempotency Locking, Branded HTML/Plain-Text Templates, and Nodemailer SMTP Delivery.

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import dns from "node:dns";
import crypto from "node:crypto";
import nodemailer from "nodemailer";

// Ensure IPv4 resolution priority to avoid dual-stack timeouts on serverless runtimes
if (dns && typeof dns.setDefaultResultOrder === "function") {
  try {
    dns.setDefaultResultOrder("ipv4first");
  } catch {
    // Ignore runtime exceptions
  }
}

/**
 * Attempts to load environment variables safely from .env.local or .env
 */
export function ensureEnvLoaded() {
  if (
    (!process.env.SMTP_USER ||
      !process.env.ADMIN_EMAIL ||
      !process.env.CRON_SECRET ||
      !process.env.REPORT_EMAIL_API_SECRET) &&
    typeof process.loadEnvFile === "function"
  ) {
    try {
      process.loadEnvFile(".env.local");
    } catch {}
    try {
      process.loadEnvFile(".env");
    } catch {}
  }
}
ensureEnvLoaded();

// File persistence paths for state & idempotency
const DATA_DIR =
  process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME
    ? path.join(os.tmpdir(), "indus_reports_data")
    : path.resolve(process.cwd(), ".data");
const IDEMPOTENCY_FILE = path.join(DATA_DIR, "reports_idempotency.json");
const LOG_FILE = path.join(DATA_DIR, "reports_history.json");
const CONSULTATIONS_FILE = path.join(DATA_DIR, "consultations.json");

function ensureStorageDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.warn("[Reports Storage] Initialization warning:", err.message);
  }
}

/**
 * Emits structured server-side logs for the report email lifecycle.
 * Log entries are prefixed with [report-email] <event_name> followed by JSON payload.
 * Visible in Vercel Runtime Logs dashboard when filtering by "report-email".
 */
export function logReportEmail(eventName, payload = {}) {
  const timestamp = new Date().toISOString();
  const data = {
    event: eventName,
    timestamp,
    correlationId: payload.correlationId || null,
    reportType: payload.reportType || payload.type || null,
    statusCode: payload.statusCode || null,
    durationMs: payload.durationMs != null ? Math.round(payload.durationMs) : null,
    errorCategory: payload.errorCategory || null,
    message: payload.message || null,
  };

  // Add safe metadata (avoid sensitive data)
  if (payload.extra && typeof payload.extra === "object") {
    for (const [k, v] of Object.entries(payload.extra)) {
      if (!/pass|secret|token|auth|key|body|html|credential/i.test(k)) {
        data[k] = v;
      }
    }
  }

  const logMessage = `[report-email] ${eventName} ${JSON.stringify(data)}`;

  if (
    eventName.includes("failed") ||
    payload.errorCategory ||
    (payload.statusCode && payload.statusCode >= 500)
  ) {
    console.error(logMessage);
  } else {
    console.log(logMessage);
  }
}

/**
 * Resolves the configured list of authorized report recipients.
 * Defaults to verified project management & engineering addresses.
 */
export function getAuthorizedRecipients() {
  ensureEnvLoaded();
  const configured = [
    process.env.REPORT_EMAIL_TO,
    process.env.REPORT_EMAIL,
    process.env.ADMIN_EMAIL,
    "srilakshanaint2027g3@gmail.com",
    "management@indus-robotics.com",
  ]
    .filter(Boolean)
    .flatMap((s) => s.split(","))
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));

  return Array.from(new Set(configured));
}

/**
 * Validates whether a given recipient address is authorized to receive executive reports.
 * Prevents malicious or unauthenticated callers from using the endpoint as an open email relay.
 */
export function isRecipientAuthorized(recipient) {
  if (!recipient || typeof recipient !== "string") return false;
  const normalized = recipient.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) return false;

  const allowedList = getAuthorizedRecipients();
  if (allowedList.includes(normalized)) return true;

  // Also permit addresses under verified company domain indus-robotics.com
  if (normalized.endsWith("@indus-robotics.com")) return true;

  return false;
}

/**
 * Authenticates internal, scheduled, or webhook requests against REPORT_EMAIL_API_SECRET or CRON_SECRET.
 * Supports Authorization: Bearer <secret>, X-Report-Email-Secret, X-Cron-Secret, and x-vercel-cron.
 * Prevents arbitrary unauthenticated callers from triggering report dispatches.
 */
export function verifyReportEmailAuth(req) {
  ensureEnvLoaded();
  const validSecrets = [
    process.env.REPORT_EMAIL_API_SECRET,
    process.env.CRON_SECRET,
  ]
    .map((s) => (s || "").trim())
    .filter(Boolean);

  // If secret is not configured in development, permit requests with a notice
  if (validSecrets.length === 0) {
    if (process.env.NODE_ENV === "development" || !process.env.VERCEL) {
      return {
        authorized: true,
        isDev: true,
        warning: "REPORT_EMAIL_API_SECRET / CRON_SECRET is not configured on this environment.",
      };
    }
    return {
      authorized: false,
      reason: "Server configuration error: REPORT_EMAIL_API_SECRET / CRON_SECRET is not set.",
    };
  }

  // 1. Vercel internal cron header check
  const vercelCronHeader = req.headers?.["x-vercel-cron"];
  if (vercelCronHeader === "1" || vercelCronHeader === "true") {
    return { authorized: true, via: "x-vercel-cron" };
  }

  // 2. Authorization: Bearer <secret>
  const authHeader = req.headers?.["authorization"] || "";
  if (authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7).trim();
    if (validSecrets.includes(token)) {
      return { authorized: true, via: "authorization-bearer" };
    }
  }

  // 3. x-report-email-secret or x-cron-secret header
  const customHeader = (
    req.headers?.["x-report-email-secret"] ||
    req.headers?.["x-cron-secret"] ||
    ""
  ).trim();
  if (validSecrets.includes(customHeader)) {
    return { authorized: true, via: "custom-header" };
  }

  return { authorized: false, reason: "Unauthorized: Invalid or missing authentication secret." };
}

/**
 * Verifies request authentication against CRON_SECRET or REPORT_EMAIL_API_SECRET
 * Supports Authorization header, x-cron-secret header, Vercel cron header, and query param
 */
export function verifyCronAuth(req) {
  ensureEnvLoaded();
  const validSecrets = [
    process.env.CRON_SECRET,
    process.env.REPORT_EMAIL_API_SECRET,
  ]
    .map((s) => (s || "").trim())
    .filter(Boolean);

  // If secret is not configured in development, permit requests with a notice
  if (validSecrets.length === 0) {
    if (process.env.NODE_ENV === "development" || !process.env.VERCEL) {
      return { authorized: true, isDev: true, warning: "CRON_SECRET is not configured on this environment." };
    }
    return { authorized: false, reason: "Server configuration error: CRON_SECRET is not set." };
  }

  // 1. Vercel internal cron header check
  const vercelCronHeader = req.headers?.["x-vercel-cron"];
  if (vercelCronHeader === "1" || vercelCronHeader === "true") {
    return { authorized: true, via: "x-vercel-cron" };
  }

  // 2. Authorization: Bearer <secret>
  const authHeader = req.headers?.["authorization"] || "";
  if (authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7).trim();
    if (validSecrets.includes(token)) {
      return { authorized: true, via: "authorization-bearer" };
    }
  }

  // 3. x-cron-secret or x-report-email-secret header
  const customHeader = (
    req.headers?.["x-cron-secret"] ||
    req.headers?.["x-report-email-secret"] ||
    ""
  ).trim();
  if (validSecrets.includes(customHeader)) {
    return { authorized: true, via: "x-cron-secret" };
  }

  // 4. Query parameter ?secret=... or ?key=...
  const querySecret = (req.query?.secret || req.query?.key || "").toString().trim();
  if (querySecret && validSecrets.includes(querySecret)) {
    return { authorized: true, via: "query-param" };
  }

  return { authorized: false, reason: "Unauthorized: Invalid or missing CRON_SECRET." };
}

/**
 * Calculates start and end timestamps and human-readable labels for the reporting period
 */
export function getReportingPeriod(type = "daily", referenceDate = new Date()) {
  const ref = new Date(referenceDate);

  // Timezone conversions for Asia/Kolkata (IST = UTC+5:30)
  const istFormatter = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const istDateOnly = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const currentDateIst = istDateOnly.format(ref); // YYYY-MM-DD in IST

  if (type === "daily") {
    // Last 24 Hours in IST
    const start = new Date(ref.getTime() - 24 * 60 * 60 * 1000);
    const end = ref;
    const periodKey = `daily-${currentDateIst}`;
    return {
      type: "daily",
      periodKey,
      startIso: start.toISOString(),
      endIso: end.toISOString(),
      displayPeriod: `${istFormatter.format(start)} to ${istFormatter.format(end)} (IST)`,
      summaryLabel: `Daily Report for ${currentDateIst}`,
    };
  }

  if (type === "weekly") {
    // Last 7 days in IST
    const start = new Date(ref.getTime() - 7 * 24 * 60 * 60 * 1000);
    const end = ref;
    // Calculate week number
    const startYear = new Date(ref.getFullYear(), 0, 1);
    const weekNumber = Math.ceil(((ref.getTime() - startYear.getTime()) / 86400000 + startYear.getDay() + 1) / 7);
    const periodKey = `weekly-${ref.getFullYear()}-W${String(weekNumber).padStart(2, "0")}`;
    return {
      type: "weekly",
      periodKey,
      startIso: start.toISOString(),
      endIso: end.toISOString(),
      displayPeriod: `${istFormatter.format(start)} to ${istFormatter.format(end)} (IST)`,
      summaryLabel: `Weekly Digest — Week ${weekNumber}, ${ref.getFullYear()}`,
    };
  }

  if (type === "monthly") {
    // 30 days lookback or previous calendar month
    const start = new Date(ref.getTime() - 30 * 24 * 60 * 60 * 1000);
    const end = ref;
    const monthName = ref.toLocaleString("en-US", { month: "long", timeZone: "Asia/Kolkata" });
    const periodKey = `monthly-${ref.getFullYear()}-${String(ref.getMonth() + 1).padStart(2, "0")}`;
    return {
      type: "monthly",
      periodKey,
      startIso: start.toISOString(),
      endIso: end.toISOString(),
      displayPeriod: `${istFormatter.format(start)} to ${istFormatter.format(end)} (IST)`,
      summaryLabel: `Monthly Operations Review — ${monthName} ${ref.getFullYear()}`,
    };
  }

  throw new Error(`Unsupported report type: "${type}". Expected daily, weekly, or monthly.`);
}

/**
 * Manages persistent idempotency state to avoid duplicate email sends
 */
export function checkAndSetIdempotency(periodKey, force = false) {
  ensureStorageDir();
  let store = {};

  try {
    if (fs.existsSync(IDEMPOTENCY_FILE)) {
      store = JSON.parse(fs.readFileSync(IDEMPOTENCY_FILE, "utf8"));
    }
  } catch {
    store = {};
  }

  const existing = store[periodKey];
  const now = Date.now();

  if (existing && !force) {
    // If successfully sent, reject duplicate
    if (existing.status === "SENT") {
      return {
        isDuplicate: true,
        sentAt: existing.sentAt,
        messageId: existing.messageId,
        recipients: existing.recipients,
      };
    }

    // If an execution is in progress started less than 60 seconds ago, prevent concurrent run
    if (existing.status === "IN_PROGRESS" && now - existing.startedAt < 60_000) {
      return {
        isDuplicate: true,
        inProgress: true,
        startedAt: existing.startedAt,
      };
    }
  }

  // Set IN_PROGRESS lock
  store[periodKey] = {
    status: "IN_PROGRESS",
    startedAt: now,
  };

  try {
    fs.writeFileSync(IDEMPOTENCY_FILE, JSON.stringify(store, null, 2), "utf8");
  } catch (err) {
    console.warn("[Idempotency] Could not write lock state:", err.message);
  }

  return { isDuplicate: false };
}

/**
 * Updates idempotency record once email provider accepts or rejects delivery
 */
export function completeIdempotency(periodKey, success, meta = {}) {
  ensureStorageDir();
  try {
    let store = {};
    if (fs.existsSync(IDEMPOTENCY_FILE)) {
      store = JSON.parse(fs.readFileSync(IDEMPOTENCY_FILE, "utf8"));
    }

    if (success) {
      store[periodKey] = {
        status: "SENT",
        sentAt: new Date().toISOString(),
        messageId: meta.messageId || null,
        recipientsCount: meta.recipientsCount || 1,
      };
    } else {
      delete store[periodKey]; // Release lock on failure so subsequent attempts can proceed
    }

    fs.writeFileSync(IDEMPOTENCY_FILE, JSON.stringify(store, null, 2), "utf8");
  } catch (err) {
    console.warn("[Idempotency] Could not update completion state:", err.message);
  }
}

/**
 * Appends execution log to persistent history
 */
export function logReportExecution(entry) {
  ensureStorageDir();
  try {
    let history = [];
    if (fs.existsSync(LOG_FILE)) {
      history = JSON.parse(fs.readFileSync(LOG_FILE, "utf8"));
    }
    history.push({
      ...entry,
      loggedAt: new Date().toISOString(),
    });
    // Keep last 100 entries
    if (history.length > 100) {
      history = history.slice(-100);
    }
    fs.writeFileSync(LOG_FILE, JSON.stringify(history, null, 2), "utf8");
  } catch (err) {
    console.warn("[Reports Log] Could not append log entry:", err.message);
  }
}

/**
 * Aggregates live system data from local storage, Jira Cloud API, and Google Sheets
 */
export async function collectReportMetrics(period) {
  ensureEnvLoaded();
  const startTime = new Date(period.startIso).getTime();
  const endTime = new Date(period.endIso).getTime();

  // 1. Collect Consultation Bookings from local store
  let storedBookings = [];
  try {
    if (fs.existsSync(CONSULTATIONS_FILE)) {
      storedBookings = JSON.parse(fs.readFileSync(CONSULTATIONS_FILE, "utf8"));
    }
  } catch {
    storedBookings = [];
  }

  const periodBookings = storedBookings.filter((b) => {
    const t = new Date(b.createdAt || b.appointmentDate || 0).getTime();
    return t >= startTime && t <= endTime;
  });

  const confirmedBookings = periodBookings.filter((b) => b.status === "Confirmed").length;
  const rescheduledBookings = periodBookings.filter((b) => b.status === "Rescheduled").length;
  const cancelledBookings = periodBookings.filter((b) => b.status === "Cancelled").length;

  // 2. Query Atlassian Jira Cloud (if configured)
  const jiraDomain = (process.env.JIRA_DOMAIN || "").trim();
  const jiraEmail = (process.env.JIRA_EMAIL || "").trim();
  const jiraToken = (process.env.JIRA_API_TOKEN || "").trim();
  const websiteProject = (process.env.JIRA_PROJECT_KEY || "DI").trim();
  const youtubeProject = (process.env.YOUTUBE_JIRA_PROJECT_KEY || "YLT").trim();
  const linkedinProject = (process.env.LINKEDIN_JIRA_PROJECT_KEY || "LIT").trim();

  let jiraConnected = false;
  let websiteLeadsCount = 0;
  let youtubeLeadsCount = 0;
  let linkedinLeadsCount = 0;
  let recentJiraIssues = [];

  if (jiraDomain && jiraEmail && jiraToken) {
    try {
      const auth = Buffer.from(`${jiraEmail}:${jiraToken}`).toString("base64");
      // Search Jira issues created in reporting period
      const jql = `project in (${websiteProject}, ${youtubeProject}, ${linkedinProject}) AND created >= "${period.startIso.slice(0, 10)}" ORDER BY created DESC`;
      const jiraUrl = `https://${jiraDomain}/rest/api/2/search?jql=${encodeURIComponent(jql)}&maxResults=50&fields=summary,project,created,issuetype,status`;

      const jiraRes = await fetch(jiraUrl, {
        method: "GET",
        headers: {
          Authorization: `Basic ${auth}`,
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(8000),
      });

      if (jiraRes.ok) {
        jiraConnected = true;
        const jData = await jiraRes.json();
        const issues = Array.isArray(jData.issues) ? jData.issues : [];

        for (const issue of issues) {
          const pKey = issue.fields?.project?.key;
          if (pKey === websiteProject) websiteLeadsCount++;
          else if (pKey === youtubeProject) youtubeLeadsCount++;
          else if (pKey === linkedinProject) linkedinLeadsCount++;

          if (recentJiraIssues.length < 5) {
            recentJiraIssues.push({
              key: issue.key,
              summary: issue.fields?.summary || "Lead intake",
              project: pKey,
              created: issue.fields?.created,
            });
          }
        }
      }
    } catch (jiraErr) {
      console.warn("[Reports Data] Jira metrics retrieval notice:", jiraErr.message);
    }
  }

  // Fallback estimates if Jira has 0 or unavailable
  if (websiteLeadsCount === 0 && periodBookings.length > 0) {
    websiteLeadsCount = periodBookings.filter((b) => !b.source?.includes("YouTube")).length;
    youtubeLeadsCount = periodBookings.filter((b) => b.source?.includes("YouTube")).length;
  }

  // 3. Inspect Google Sheets & Apps Script connection status
  let gasConnected = false;
  const gasUrl = (process.env.GOOGLE_APPS_SCRIPT_URL || "").trim();
  if (gasUrl) {
    try {
      const gasRes = await fetch(`${gasUrl}?action=status`, {
        method: "GET",
        signal: AbortSignal.timeout(6000),
      });
      if (gasRes.ok) {
        gasConnected = true;
      }
    } catch {
      // Handled cleanly
    }
  }

  // 4. Product category distribution from bookings and inquiries
  const categoryCounts = {
    "Linear Actuators & Stages": 0,
    "Harmonic & Precision Reducers": 0,
    "Articulated 6-Axis Robots": 0,
    "Autonomous Mobile Robots (AMR)": 0,
    "Multi-Axis Motion Controllers": 0,
    "Mecanum & Omni Wheels": 0,
  };

  periodBookings.forEach((b) => {
    const cat = b.robotCategory || "";
    if (/actuator|stage|ball screw/i.test(cat)) categoryCounts["Linear Actuators & Stages"]++;
    else if (/harmonic|reducer|cycloidal/i.test(cat)) categoryCounts["Harmonic & Precision Reducers"]++;
    else if (/6-axis|arm|scara|cobot/i.test(cat)) categoryCounts["Articulated 6-Axis Robots"]++;
    else if (/agv|amr|mobile|forklift/i.test(cat)) categoryCounts["Autonomous Mobile Robots (AMR)"]++;
    else if (/wheel|mecanum|omni/i.test(cat)) categoryCounts["Mecanum & Omni Wheels"]++;
    else categoryCounts["Multi-Axis Motion Controllers"]++;
  });

  const totalLeads = websiteLeadsCount + youtubeLeadsCount + linkedinLeadsCount;

  return {
    dataRetrieved: true,
    totalLeads,
    dealflow: {
      websiteDI: websiteLeadsCount,
      youtubeYLT: youtubeLeadsCount,
      linkedinLIT: linkedinLeadsCount,
    },
    consultations: {
      total: periodBookings.length,
      confirmed: confirmedBookings,
      rescheduled: rescheduledBookings,
      cancelled: cancelledBookings,
    },
    sampleBookings: periodBookings.slice(0, 5).map((b) => ({
      bookingId: b.bookingId,
      customer: b.customerName,
      company: b.companyName,
      purpose: b.consultationPurpose,
      date: b.appointmentDate,
      time: b.appointmentTime,
      mode: b.consultationMode,
    })),
    recentIssues: recentJiraIssues,
    categoryInterest: categoryCounts,
    integrationsHealth: {
      jiraCloud: jiraConnected ? "HEALTHY" : jiraDomain ? "UNREACHABLE" : "NOT_CONFIGURED",
      googleAppsScript: gasConnected ? "HEALTHY" : gasUrl ? "UNREACHABLE" : "NOT_CONFIGURED",
      telegramBot: Boolean(process.env.TELEGRAM_BOT_TOKEN) ? "CONFIGURED" : "NOT_CONFIGURED",
      microsoftClarity: Boolean(process.env.VITE_CLARITY_PROJECT_ID) ? "ACTIVE" : "NOT_CONFIGURED",
    },
  };
}

/**
 * Builds high-fidelity HTML and Plain-Text emails following INDUS Brand Design System
 */
export function buildReportEmail(type, period, metrics) {
  const brandNavy = "#0B0F12";
  const brandDarkCard = "#111A30";
  const brandAccent = "#95CC00"; // Signal Lime
  const brandAmber = "#F59E0B";
  const textWhite = "#FFFFFF";
  const textMuted = "#9CA3AF";

  const typeLabel = type.toUpperCase();
  const subject = `🤖 [INDUS ${typeLabel} REPORT] ${period.summaryLabel} — ${metrics.totalLeads} Leads, ${metrics.consultations.total} Consultations`;

  // HTML Template
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${brandNavy}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: ${textWhite}; -webkit-font-smoothing: antialiased;">
  <div style="max-width: 680px; margin: 24px auto; background-color: #0d1319; border: 1px solid #1f2937; border-top: 4px solid ${brandAccent}; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
    
    <!-- HEADER -->
    <div style="padding: 24px 32px; background-color: ${brandDarkCard}; border-bottom: 1px solid #1f2937;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 11px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: ${brandAccent};">INDUS Industrial Robotics</span>
        <span style="background-color: rgba(149, 204, 0, 0.15); color: ${brandAccent}; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 4px; border: 1px solid rgba(149, 204, 0, 0.3); text-transform: uppercase;">
          ${typeLabel} REPORT
        </span>
      </div>
      <h1 style="margin: 12px 0 6px 0; font-size: 22px; font-weight: 700; color: ${textWhite};">${period.summaryLabel}</h1>
      <p style="margin: 0; font-size: 13px; color: ${textMuted};">Reporting Period: <strong style="color: #E5E7EB;">${period.displayPeriod}</strong></p>
    </div>

    <!-- METRICS CARDS -->
    <div style="padding: 24px 32px 12px 32px;">
      <table style="width: 100%; border-collapse: separate; border-spacing: 12px 0; margin-left: -12px; margin-right: -12px;">
        <tr>
          <td style="width: 25%; background-color: #131b26; border: 1px solid #243042; padding: 16px; border-radius: 6px; text-align: center;">
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: ${textMuted}; font-weight: 600;">Total Inquiries</div>
            <div style="font-size: 28px; font-weight: 800; color: ${brandAccent}; margin-top: 6px;">${metrics.totalLeads}</div>
            <div style="font-size: 10px; color: #6B7280; margin-top: 4px;">All Channels</div>
          </td>
          <td style="width: 25%; background-color: #131b26; border: 1px solid #243042; padding: 16px; border-radius: 6px; text-align: center;">
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: ${textMuted}; font-weight: 600;">Website (DI)</div>
            <div style="font-size: 28px; font-weight: 800; color: #60A5FA; margin-top: 6px;">${metrics.dealflow.websiteDI}</div>
            <div style="font-size: 10px; color: #6B7280; margin-top: 4px;">Direct DealFlow</div>
          </td>
          <td style="width: 25%; background-color: #131b26; border: 1px solid #243042; padding: 16px; border-radius: 6px; text-align: center;">
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: ${textMuted}; font-weight: 600;">YouTube (YLT)</div>
            <div style="font-size: 28px; font-weight: 800; color: #F87171; margin-top: 6px;">${metrics.dealflow.youtubeYLT}</div>
            <div style="font-size: 10px; color: #6B7280; margin-top: 4px;">Video Attribution</div>
          </td>
          <td style="width: 25%; background-color: #131b26; border: 1px solid #243042; padding: 16px; border-radius: 6px; text-align: center;">
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: ${textMuted}; font-weight: 600;">Consultations</div>
            <div style="font-size: 28px; font-weight: 800; color: ${brandAmber}; margin-top: 6px;">${metrics.consultations.total}</div>
            <div style="font-size: 10px; color: #6B7280; margin-top: 4px;">${metrics.consultations.confirmed} Confirmed</div>
          </td>
        </tr>
      </table>
    </div>

    <!-- PIPELINE BREAKDOWN TABLE -->
    <div style="padding: 12px 32px;">
      <h3 style="font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; color: ${brandAccent}; margin: 16px 0 8px 0;">
        1. Multi-Channel Lead Distribution
      </h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; border: 1px solid #1f2937;">
        <tr style="background-color: #16202c; border-bottom: 1px solid #1f2937; color: ${textMuted};">
          <th style="padding: 10px 14px; text-align: left;">Intake Channel</th>
          <th style="padding: 10px 14px; text-align: left;">Jira Target Project</th>
          <th style="padding: 10px 14px; text-align: right;">Count</th>
          <th style="padding: 10px 14px; text-align: right;">Share</th>
        </tr>
        <tr style="border-bottom: 1px solid #1f2937;">
          <td style="padding: 10px 14px; font-weight: 600;">Direct Website RFQ & Sizing</td>
          <td style="padding: 10px 14px; font-family: monospace; color: #60A5FA;">DI (DealFlow)</td>
          <td style="padding: 10px 14px; text-align: right; font-weight: 700;">${metrics.dealflow.websiteDI}</td>
          <td style="padding: 10px 14px; text-align: right; color: ${textMuted};">${metrics.totalLeads > 0 ? Math.round((metrics.dealflow.websiteDI / metrics.totalLeads) * 100) : 0}%</td>
        </tr>
        <tr style="border-bottom: 1px solid #1f2937;">
          <td style="padding: 10px 14px; font-weight: 600;">YouTube Technical Inquiries</td>
          <td style="padding: 10px 14px; font-family: monospace; color: #F87171;">YLT (YouTube Leads)</td>
          <td style="padding: 10px 14px; text-align: right; font-weight: 700;">${metrics.dealflow.youtubeYLT}</td>
          <td style="padding: 10px 14px; text-align: right; color: ${textMuted};">${metrics.totalLeads > 0 ? Math.round((metrics.dealflow.youtubeYLT / metrics.totalLeads) * 100) : 0}%</td>
        </tr>
        <tr>
          <td style="padding: 10px 14px; font-weight: 600;">LinkedIn Campaign Referrals</td>
          <td style="padding: 10px 14px; font-family: monospace; color: #34D399;">LIT (LinkedIn Leads)</td>
          <td style="padding: 10px 14px; text-align: right; font-weight: 700;">${metrics.dealflow.linkedinLIT}</td>
          <td style="padding: 10px 14px; text-align: right; color: ${textMuted};">${metrics.totalLeads > 0 ? Math.round((metrics.dealflow.linkedinLIT / metrics.totalLeads) * 100) : 0}%</td>
        </tr>
      </table>
    </div>

    <!-- CONSULTATIONS SECTION -->
    <div style="padding: 12px 32px;">
      <h3 style="font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; color: ${brandAccent}; margin: 16px 0 8px 0;">
        2. Technical Consultations & Visits
      </h3>
      ${
        metrics.sampleBookings.length > 0
          ? `
      <table style="width: 100%; border-collapse: collapse; font-size: 12px; border: 1px solid #1f2937;">
        <tr style="background-color: #16202c; border-bottom: 1px solid #1f2937; color: ${textMuted};">
          <th style="padding: 8px 12px; text-align: left;">Booking ID</th>
          <th style="padding: 8px 12px; text-align: left;">Customer & Company</th>
          <th style="padding: 8px 12px; text-align: left;">Purpose</th>
          <th style="padding: 8px 12px; text-align: left;">Date & Time</th>
          <th style="padding: 8px 12px; text-align: left;">Mode</th>
        </tr>
        ${metrics.sampleBookings
          .map(
            (b) => `
        <tr style="border-bottom: 1px solid #1f2937;">
          <td style="padding: 8px 12px; font-family: monospace; color: ${brandAmber};">${b.bookingId}</td>
          <td style="padding: 8px 12px; font-weight: 600;">${b.customer}<br><span style="font-size: 11px; color: ${textMuted};">${b.company || "Individual"}</span></td>
          <td style="padding: 8px 12px; color: #D1D5DB;">${b.purpose}</td>
          <td style="padding: 8px 12px; white-space: nowrap;">${b.date} ${b.time}</td>
          <td style="padding: 8px 12px; font-size: 11px; color: ${textMuted};">${b.mode}</td>
        </tr>`,
          )
          .join("")}
      </table>`
          : `<p style="font-size: 13px; color: ${textMuted}; margin: 0; padding: 12px; background-color: #131b26; border: 1px dashed #243042; text-align: center;">No new bookings registered during this specific reporting period.</p>`
      }
    </div>

    <!-- SYSTEM HEALTH MONITOR -->
    <div style="padding: 12px 32px 24px 32px;">
      <h3 style="font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; color: ${brandAccent}; margin: 16px 0 8px 0;">
        3. Backend Integrations & Sinks Health
      </h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 12px; border: 1px solid #1f2937;">
        <tr style="background-color: #16202c; border-bottom: 1px solid #1f2937; color: ${textMuted};">
          <th style="padding: 8px 12px; text-align: left;">Integration Endpoint</th>
          <th style="padding: 8px 12px; text-align: left;">Scope</th>
          <th style="padding: 8px 12px; text-align: right;">Status</th>
        </tr>
        <tr style="border-bottom: 1px solid #1f2937;">
          <td style="padding: 8px 12px; font-weight: 600;">Atlassian Jira Cloud</td>
          <td style="padding: 8px 12px; color: ${textMuted};">Automated Lead Tasks & Subtasks (DI, YLT, LIT)</td>
          <td style="padding: 8px 12px; text-align: right; color: ${metrics.integrationsHealth.jiraCloud === "HEALTHY" ? brandAccent : "#F59E0B"}; font-weight: 700;">
            ● ${metrics.integrationsHealth.jiraCloud}
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #1f2937;">
          <td style="padding: 8px 12px; font-weight: 600;">Google Sheets & Apps Script</td>
          <td style="padding: 8px 12px; color: ${textMuted};">Enquiry Tabs & Calendar Sync</td>
          <td style="padding: 8px 12px; text-align: right; color: ${metrics.integrationsHealth.googleAppsScript === "HEALTHY" ? brandAccent : "#F59E0B"}; font-weight: 700;">
            ● ${metrics.integrationsHealth.googleAppsScript}
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #1f2937;">
          <td style="padding: 8px 12px; font-weight: 600;">Telegram Bot Alerts</td>
          <td style="padding: 8px 12px; color: ${textMuted};">Instant Mobile Alerts (@BotFather)</td>
          <td style="padding: 8px 12px; text-align: right; color: ${metrics.integrationsHealth.telegramBot === "CONFIGURED" ? brandAccent : "#6B7280"}; font-weight: 700;">
            ● ${metrics.integrationsHealth.telegramBot}
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; font-weight: 600;">Microsoft Clarity</td>
          <td style="padding: 8px 12px; color: ${textMuted};">User Experience & Heatmap Telemetry</td>
          <td style="padding: 8px 12px; text-align: right; color: ${metrics.integrationsHealth.microsoftClarity === "ACTIVE" ? brandAccent : "#6B7280"}; font-weight: 700;">
            ● ${metrics.integrationsHealth.microsoftClarity}
          </td>
        </tr>
      </table>
    </div>

    <!-- FOOTER WITH QUICK LINKS -->
    <div style="background-color: ${brandDarkCard}; padding: 24px 32px; border-top: 1px solid #1f2937; text-align: center; font-size: 11px; color: #6B7280; line-height: 1.6;">
      <p style="margin: 0 0 12px 0;">
        <strong style="color: #9CA3AF;">INDUS Industrial Robotics Platform</strong> · Automated Executive Telemetry Service<br>
        Delivered directly via Vercel Serverless Backend with Node.js & Nodemailer SMTP
      </p>
      <div style="margin: 12px 0;">
        <a href="https://precision-motion-systems-main.vercel.app/" style="color: ${brandAccent}; text-decoration: none; margin: 0 8px; font-weight: 600;">Live Website</a> ·
        <a href="https://precision-motion-systems-main.vercel.app/technology/architecture-explorer" style="color: #60A5FA; text-decoration: none; margin: 0 8px;">Architecture Explorer</a> ·
        <a href="https://precision-motion-systems-main.vercel.app/technology/calculators" style="color: #60A5FA; text-decoration: none; margin: 0 8px;">Engineering Calculators</a> ·
        <a href="https://precision-motion-systems-main.vercel.app/products/compare" style="color: #60A5FA; text-decoration: none; margin: 0 8px;">Component Matrix</a>
      </div>
      <p style="margin: 8px 0 0 0; font-size: 10px; color: #4B5563;">
        Execution Timestamp: ${new Date().toISOString()} | Ref: ${period.periodKey}
      </p>
    </div>

  </div>
</body>
</html>
  `.trim();

  // Plain-Text Template
  const text = `
================================================================================
INDUS INDUSTRIAL ROBOTICS — ${typeLabel} OPERATIONS & EXECUTIVE REPORT
================================================================================
Report Title: ${period.summaryLabel}
Reporting Period: ${period.displayPeriod}
Generated: ${new Date().toISOString()}

--------------------------------------------------------------------------------
1. EXECUTIVE METRICS SUMMARY
--------------------------------------------------------------------------------
• Total Inquiries & DealFlow: ${metrics.totalLeads}
• Direct Website Leads (DI):  ${metrics.dealflow.websiteDI}
• YouTube Attributed (YLT):   ${metrics.dealflow.youtubeYLT}
• LinkedIn Leads (LIT):       ${metrics.dealflow.linkedinLIT}
• Technical Consultations:    ${metrics.consultations.total} (${metrics.consultations.confirmed} Confirmed, ${metrics.consultations.rescheduled} Rescheduled)

--------------------------------------------------------------------------------
2. INTEGRATIONS & SYSTEM HEALTH
--------------------------------------------------------------------------------
• Jira Cloud API:         ${metrics.integrationsHealth.jiraCloud}
• Google Sheets Sync:     ${metrics.integrationsHealth.googleAppsScript}
• Telegram Bot Alerts:    ${metrics.integrationsHealth.telegramBot}
• Microsoft Clarity:      ${metrics.integrationsHealth.microsoftClarity}

--------------------------------------------------------------------------------
3. CONSULTATION APPOINTMENTS
--------------------------------------------------------------------------------
${
  metrics.sampleBookings.length > 0
    ? metrics.sampleBookings
        .map(
          (b) =>
            `• [${b.bookingId}] ${b.customer} (${b.company || "Individual"}) - ${b.purpose} | ${b.date} ${b.time} | Mode: ${b.mode}`,
        )
        .join("\n")
    : "No new consultations registered during this period."
}

================================================================================
Platform: https://precision-motion-systems-main.vercel.app/
Architecture Explorer: https://precision-motion-systems-main.vercel.app/technology/architecture-explorer
Calculators: https://precision-motion-systems-main.vercel.app/technology/calculators
Reference Key: ${period.periodKey}
================================================================================
`.trim();

  return { subject, html, text };
}

/**
 * Main Report Runner: Orchestrates Data Collection, Formatting, Idempotency, and SMTP Dispatch
 */
export async function executeScheduledReport(type = "daily", options = {}) {
  const startTime = Date.now();
  ensureEnvLoaded();

  const correlationId =
    options.correlationId ||
    (crypto.randomUUID
      ? crypto.randomUUID()
      : `rep_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);

  const period = getReportingPeriod(type, options.referenceDate);
  const force = Boolean(options.force || options.forceSend);

  // 1. Idempotency Check
  const idemp = checkAndSetIdempotency(period.periodKey, force);
  if (idemp.isDuplicate && !force) {
    return {
      status: "duplicate_skipped",
      success: true,
      email_sent: false,
      duplicate: true,
      message: idemp.inProgress
        ? "Report generation is currently in-progress by an overlapping execution."
        : `Report for period "${period.periodKey}" was already successfully delivered at ${idemp.sentAt}.`,
      reporting_period: period.displayPeriod,
      report_type: type,
      period_key: period.periodKey,
      previous_sent_at: idemp.sentAt || null,
      previous_message_id: idemp.messageId || null,
      correlation_id: correlationId,
    };
  }

  // 2. Data Retrieval
  let metrics;
  try {
    metrics = await collectReportMetrics(period);
  } catch (err) {
    completeIdempotency(period.periodKey, false);
    const executionMs = Date.now() - startTime;
    logReportExecution({
      type,
      period: period.periodKey,
      success: false,
      dataRetrieved: false,
      error: `Data retrieval failed: ${err.message}`,
      durationMs: executionMs,
    });
    return {
      status: "data_retrieval_failure",
      success: false,
      email_sent: false,
      error: "DATA_RETRIEVAL_FAILED",
      message: `Failed to collect report metrics: ${err.message}`,
      report_type: type,
      reporting_period: period.displayPeriod,
      execution_time_ms: executionMs,
      correlation_id: correlationId,
    };
  }

  // 3. Build Email Template
  const emailContent = buildReportEmail(type, period, metrics);

  // 4. Resolve and Validate Email Recipients
  let recipientList = [];
  if (options.recipient) {
    if (typeof options.recipient === "string") {
      recipientList = options.recipient
        .split(",")
        .map((r) => r.trim())
        .filter((r) => r.length > 0);
    } else if (Array.isArray(options.recipient)) {
      recipientList = options.recipient
        .map((r) => String(r).trim())
        .filter((r) => r.length > 0);
    }
  } else {
    recipientList = getAuthorizedRecipients();
  }

  // Enforce valid email format (and authorization check if explicitly requested)
  const validRecipients = recipientList.filter(
    (r) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r) &&
      (options.validateRecipient ? isRecipientAuthorized(r) : true),
  );

  if (validRecipients.length === 0) {
    completeIdempotency(period.periodKey, false);
    const executionMs = Date.now() - startTime;
    logReportEmail("email_send_failed", {
      correlationId,
      reportType: type,
      durationMs: executionMs,
      errorCategory: "NO_VALID_RECIPIENTS",
      message: "No valid and authorized recipient addresses found.",
    });
    return {
      status: "recipient_error",
      success: false,
      email_sent: false,
      error: "NO_VALID_RECIPIENTS",
      message: "No valid and authorized recipient email address found in REPORT_EMAIL or ADMIN_EMAIL.",
      report_type: type,
      reporting_period: period.displayPeriod,
      data_retrieved: true,
      execution_time_ms: executionMs,
      correlation_id: correlationId,
      metrics,
    };
  }

  // 5. Inspect SMTP Credentials
  const smtpUser = (process.env.SMTP_USER || process.env.GMAIL_USER || "").trim();
  const smtpPass = (process.env.SMTP_PASS || process.env.GMAIL_PASS || process.env.GMAIL_APP_PASSWORD || "").trim();

  // If SMTP is not configured, return honest configuration error without claiming sent
  if (!smtpUser || !smtpPass) {
    completeIdempotency(period.periodKey, false);
    const executionMs = Date.now() - startTime;
    const configError = {
      status: "configuration_missing",
      success: false,
      email_sent: false,
      error: "SMTP_CONFIG_MISSING",
      message: "SMTP_USER or SMTP_PASS (Gmail App Password) is not configured in Vercel environment variables.",
      report_type: type,
      reporting_period: period.displayPeriod,
      data_retrieved: true,
      recipients_count: validRecipients.length,
      execution_time_ms: executionMs,
      correlation_id: correlationId,
      metrics,
    };

    logReportEmail("email_send_failed", {
      correlationId,
      reportType: type,
      durationMs: executionMs,
      errorCategory: "SMTP_CONFIG_MISSING",
      message: "SMTP credentials not configured in environment variables.",
    });

    logReportExecution({
      type,
      period: period.periodKey,
      success: false,
      dataRetrieved: true,
      emailSent: false,
      error: "SMTP_CONFIG_MISSING",
      durationMs: executionMs,
    });

    return configError;
  }

  // 6. Dispatch via Nodemailer (Gmail SMTP)
  try {
    logReportEmail("email_send_started", {
      correlationId,
      reportType: type,
      extra: {
        recipientsCount: validRecipients.length,
      },
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });

    const fromAddress = (
      process.env.REPORT_EMAIL_FROM ||
      options.from ||
      `"INDUS Industrial Robotics" <${smtpUser}>`
    ).trim();

    const mailOptions = {
      from: fromAddress.includes("<") ? fromAddress : `"INDUS Industrial Robotics" <${fromAddress}>`,
      to: validRecipients.join(", "),
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html,
      replyTo: "engineering@indus-robotics.com",
    };

    const info = await transporter.sendMail(mailOptions);
    const executionMs = Date.now() - startTime;

    // Mark successful send in idempotency tracker
    completeIdempotency(period.periodKey, true, {
      messageId: info.messageId,
      recipientsCount: validRecipients.length,
    });

    logReportEmail("email_send_succeeded", {
      correlationId,
      reportType: type,
      durationMs: executionMs,
      extra: {
        messageId: info.messageId,
        recipientsCount: validRecipients.length,
      },
    });

    logReportExecution({
      type,
      period: period.periodKey,
      success: true,
      dataRetrieved: true,
      emailSent: true,
      messageId: info.messageId,
      recipientsCount: validRecipients.length,
      durationMs: executionMs,
    });

    return {
      status: "success",
      success: true,
      email_sent: true,
      messageId: info.messageId,
      report_type: type,
      reporting_period: period.displayPeriod,
      period_key: period.periodKey,
      recipients_count: validRecipients.length,
      data_retrieved: true,
      execution_time_ms: executionMs,
      correlation_id: correlationId,
      metrics,
    };
  } catch (smtpErr) {
    completeIdempotency(period.periodKey, false);
    const executionMs = Date.now() - startTime;

    // Sanitize error message to prevent any password or credential exposure
    let sanitizedError = smtpErr?.message || "Unknown SMTP error";
    if (smtpPass && smtpPass.length > 0) {
      sanitizedError = sanitizedError.split(smtpPass).join("[REDACTED]");
    }

    const isAuthFailure =
      smtpErr?.code === "EAUTH" ||
      /invalid login|credentials|username and password not accepted/i.test(sanitizedError);

    const isTimeout =
      smtpErr?.code === "ETIMEDOUT" ||
      /timeout|timed out/i.test(sanitizedError);

    const failureResponse = {
      status: isAuthFailure ? "authentication_failed" : isTimeout ? "smtp_timeout" : "provider_error",
      success: false,
      email_sent: false,
      error: isAuthFailure ? "SMTP_AUTH_FAILED" : isTimeout ? "SMTP_TIMEOUT" : "SMTP_PROVIDER_ERROR",
      message: isAuthFailure
        ? "Gmail SMTP authentication rejected credentials. Verify SMTP_USER and Gmail App Password (SMTP_PASS)."
        : isTimeout
        ? "SMTP provider connection timed out. Do not blindly retry."
        : `Email provider error: ${sanitizedError}`,
      report_type: type,
      reporting_period: period.displayPeriod,
      data_retrieved: true,
      recipients_count: validRecipients.length,
      execution_time_ms: executionMs,
      correlation_id: correlationId,
      metrics,
    };

    logReportEmail("email_send_failed", {
      correlationId,
      reportType: type,
      durationMs: executionMs,
      errorCategory: failureResponse.error,
      message: sanitizedError,
    });

    logReportExecution({
      type,
      period: period.periodKey,
      success: false,
      dataRetrieved: true,
      emailSent: false,
      error: failureResponse.error,
      details: failureResponse.message,
      durationMs: executionMs,
    });

    return failureResponse;
  }
}
