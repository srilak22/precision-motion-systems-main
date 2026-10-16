// INDUS Industrial Robotics — Daily Report Endpoint
// Endpoint: /api/report-daily
// Executes and dispatches the 24-hour Daily Operations & Lead Report
// Emits structured Vercel Runtime Logs for full observability

import crypto from "node:crypto";
import { verifyCronAuth, executeScheduledReport, logReportEmail } from "./reports.js";

export default async function handler(req, res) {
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

  logReportEmail("request_received", {
    correlationId,
    reportType: "daily",
  });

  // Verify Authentication
  const auth = verifyCronAuth(req);
  if (!auth.authorized) {
    logReportEmail("authentication_failed", {
      correlationId,
      reportType: "daily",
      statusCode: 401,
      errorCategory: "UNAUTHORIZED",
      message: auth.reason || "Unauthorized request: Invalid or missing CRON_SECRET authentication.",
    });
    logReportEmail("request_completed", {
      correlationId,
      reportType: "daily",
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

    const result = await executeScheduledReport("daily", { force, recipient, correlationId });
    const durationMs = Date.now() - startTime;

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
      reportType: "daily",
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
    console.error("[Daily Report] Unhandled error:", err);
    logReportEmail("request_completed", {
      correlationId,
      reportType: "daily",
      statusCode: 500,
      durationMs,
      errorCategory: "INTERNAL_SERVER_ERROR",
      message: err?.message || "Internal server error occurred during daily report execution.",
    });

    return res.status(500).json({
      success: false,
      email_sent: false,
      error: "INTERNAL_SERVER_ERROR",
      message: err?.message || "Internal server error occurred during daily report execution.",
      correlation_id: correlationId,
    });
  }
}
