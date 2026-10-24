// INDUS Industrial Robotics — Scheduled Cron Report Coordinator
// Endpoint: /api/cron/reports
// Supports query: ?type=daily | ?type=weekly | ?type=monthly & ?force=true & ?secret=...
// Emits structured Vercel Runtime Logs for full observability

import crypto from "node:crypto";
import { verifyCronAuth, executeScheduledReport, logReportEmail } from "../_lib/reports.js";
import reportEmailHandler from "../_lib/report-email.js";

export default async function handler(req, res) {
  // If POST request without cron param (such as /api/report-email), delegate to reportEmailHandler
  if (req.method === "POST" && req.body && (!req.query || (!req.query.cron && !req.query.schedule))) {
    return reportEmailHandler(req, res);
  }
  // CORS Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Cron-Secret, X-Report-Email-Secret, X-Vercel-Cron, X-Correlation-ID",
  );

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  const startTime = Date.now();
  const correlationId = (
    req.headers?.["x-correlation-id"] ||
    req.headers?.["x-request-id"] ||
    req.query?.correlationId ||
    req.body?.correlationId ||
    crypto.randomUUID()
  ).toString();

  // 1. Resolve Report Type
  let type = (req.query?.type || req.body?.type || "").toLowerCase().trim();

  // Auto-detect based on current UTC schedule if not provided
  if (!type || (type !== "daily" && type !== "weekly" && type !== "monthly")) {
    const now = new Date();
    const dayOfMonth = now.getUTCDate();
    const dayOfWeek = now.getUTCDay(); // 0 = Sunday, 1 = Monday
    const hour = now.getUTCHours();

    // Check for Monthly (1st day of month around 03:30 UTC = 09:00 AM IST)
    if (dayOfMonth === 1 && hour >= 3 && hour <= 4) {
      type = "monthly";
    }
    // Check for Weekly (Monday around 03:30 UTC = 09:00 AM IST)
    else if (dayOfWeek === 1 && hour >= 3 && hour <= 4) {
      type = "weekly";
    }
    // Default to Daily
    else {
      type = "daily";
    }
  }

  // 2. Log Request Receipt
  logReportEmail("request_received", {
    correlationId,
    reportType: type,
  });

  // 3. Verify Authentication against CRON_SECRET / REPORT_EMAIL_API_SECRET
  const auth = verifyCronAuth(req);
  if (!auth.authorized) {
    logReportEmail("authentication_failed", {
      correlationId,
      reportType: type,
      statusCode: 401,
      errorCategory: "UNAUTHORIZED",
      message: auth.reason || "Unauthorized request: Invalid or missing CRON_SECRET authentication.",
    });
    logReportEmail("request_completed", {
      correlationId,
      reportType: type,
      statusCode: 401,
      durationMs: Date.now() - startTime,
      errorCategory: "UNAUTHORIZED",
    });
    return res.status(401).json({
      success: false,
      email_sent: false,
      error: "UNAUTHORIZED",
      message: auth.reason || "Unauthorized request: Invalid or missing CRON_SECRET authentication.",
      correlation_id: correlationId,
    });
  }

  try {
    const force =
      req.query?.force === "true" ||
      req.query?.force === "1" ||
      req.body?.force === true;

    const recipient = req.query?.recipient || req.body?.recipient;

    // 4. Execute Report Delivery
    const result = await executeScheduledReport(type, { force, recipient, correlationId });
    const durationMs = Date.now() - startTime;

    // Determine appropriate HTTP Status
    let httpStatus = 200;
    if (result.success) {
      httpStatus = 200;
    } else if (result.error === "SMTP_CONFIG_MISSING" || result.error === "NO_VALID_RECIPIENTS") {
      httpStatus = 200;
    } else if (result.error === "SMTP_AUTH_FAILED" || result.error === "SMTP_PROVIDER_ERROR") {
      httpStatus = 502;
    } else if (result.error === "SMTP_TIMEOUT") {
      httpStatus = 504;
    } else {
      httpStatus = 500;
    }

    logReportEmail("request_completed", {
      correlationId,
      reportType: type,
      statusCode: httpStatus,
      durationMs,
      errorCategory: result.success ? null : result.error,
    });

    return res.status(httpStatus).json({
      ...result,
      correlation_id: correlationId,
    });
  } catch (err) {
    const durationMs = Date.now() - startTime;
    console.error("[Cron Reports] Unhandled execution error:", err);
    logReportEmail("request_completed", {
      correlationId,
      reportType: type,
      statusCode: 500,
      durationMs,
      errorCategory: "INTERNAL_SERVER_ERROR",
      message: err?.message || "Internal server error occurred during scheduled report execution.",
    });

    return res.status(500).json({
      success: false,
      email_sent: false,
      error: "INTERNAL_SERVER_ERROR",
      message: err?.message || "Internal server error occurred during scheduled report execution.",
      correlation_id: correlationId,
    });
  }
}
