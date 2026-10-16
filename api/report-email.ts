// INDUS Industrial Robotics — Report Email Serverless API Endpoint
// Endpoint: POST /api/report-email
// Dispatches Scheduled Executive Reports (Daily, Weekly, Monthly)
// Emits structured Vercel Runtime Logs for full observability

import crypto from "node:crypto";
import {
  verifyReportEmailAuth,
  executeScheduledReport,
  isRecipientAuthorized,
  logReportEmail,
} from "./_lib/reports.js";

export default async function handler(req: any, res: any) {
  // CORS & Security Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Report-Email-Secret, X-Cron-Secret, X-Vercel-Cron, X-Correlation-ID, X-Request-ID",
  );

  // Handle CORS Preflight
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  const startTime = Date.now();
  const correlationId = (
    req.headers?.["x-correlation-id"] ||
    req.headers?.["x-request-id"] ||
    req.body?.correlationId ||
    crypto.randomUUID()
  ).toString();

  // 1. Reject Unsupported HTTP Methods (Accept POST only)
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    logReportEmail("validation_failed", {
      correlationId,
      statusCode: 405,
      errorCategory: "METHOD_NOT_ALLOWED",
      message: `HTTP Method ${req.method} is not supported. /api/report-email accepts POST requests only.`,
    });
    logReportEmail("request_completed", {
      correlationId,
      statusCode: 405,
      durationMs: Date.now() - startTime,
      errorCategory: "METHOD_NOT_ALLOWED",
    });
    return res.status(405).json({
      success: false,
      email_sent: false,
      error: "METHOD_NOT_ALLOWED",
      message: `HTTP Method ${req.method} is not supported. /api/report-email accepts POST requests only.`,
      correlation_id: correlationId,
    });
  }

  // 2. Safe Body Extraction & Request Size Limit
  let body = req.body;
  if (typeof body === "string") {
    if (body.length > 100 * 1024) {
      logReportEmail("validation_failed", {
        correlationId,
        statusCode: 413,
        errorCategory: "PAYLOAD_TOO_LARGE",
        message: "Request payload exceeds maximum allowed size (100KB).",
      });
      logReportEmail("request_completed", {
        correlationId,
        statusCode: 413,
        durationMs: Date.now() - startTime,
        errorCategory: "PAYLOAD_TOO_LARGE",
      });
      return res.status(413).json({
        success: false,
        email_sent: false,
        error: "PAYLOAD_TOO_LARGE",
        message: "Request payload exceeds maximum allowed size (100KB).",
        correlation_id: correlationId,
      });
    }
    try {
      body = JSON.parse(body);
    } catch {
      logReportEmail("validation_failed", {
        correlationId,
        statusCode: 400,
        errorCategory: "MALFORMED_JSON",
        message: "Request payload contains malformed JSON.",
      });
      logReportEmail("request_completed", {
        correlationId,
        statusCode: 400,
        durationMs: Date.now() - startTime,
        errorCategory: "MALFORMED_JSON",
      });
      return res.status(400).json({
        success: false,
        email_sent: false,
        error: "BAD_REQUEST",
        message: "Malformed JSON payload in request body.",
        correlation_id: correlationId,
      });
    }
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    logReportEmail("validation_failed", {
      correlationId,
      statusCode: 400,
      errorCategory: "INVALID_BODY",
      message: "Request body must be a valid JSON object.",
    });
    logReportEmail("request_completed", {
      correlationId,
      statusCode: 400,
      durationMs: Date.now() - startTime,
      errorCategory: "INVALID_BODY",
    });
    return res.status(400).json({
      success: false,
      email_sent: false,
      error: "BAD_REQUEST",
      message: "Request body must be a valid JSON object with 'type' field ('daily', 'weekly', or 'monthly').",
      correlation_id: correlationId,
    });
  }

  const rawType = (body.type || "").toString().toLowerCase().trim();

  // 3. Log Request Receipt
  logReportEmail("request_received", {
    correlationId,
    reportType: rawType || "unknown",
  });

  // 4. Verify Authentication (REPORT_EMAIL_API_SECRET / CRON_SECRET)
  const auth = verifyReportEmailAuth(req);
  if (!auth.authorized) {
    logReportEmail("authentication_failed", {
      correlationId,
      reportType: rawType || "unknown",
      statusCode: 401,
      errorCategory: "UNAUTHORIZED",
      message: auth.reason || "Unauthorized request: Invalid or missing API secret.",
    });
    logReportEmail("request_completed", {
      correlationId,
      reportType: rawType || "unknown",
      statusCode: 401,
      durationMs: Date.now() - startTime,
      errorCategory: "UNAUTHORIZED",
    });
    return res.status(401).json({
      success: false,
      email_sent: false,
      error: "UNAUTHORIZED",
      message: auth.reason || "Unauthorized request: Invalid or missing authentication secret.",
      correlation_id: correlationId,
    });
  }

  // 5. Validate Report Type
  if (!rawType || (rawType !== "daily" && rawType !== "weekly" && rawType !== "monthly")) {
    logReportEmail("validation_failed", {
      correlationId,
      reportType: rawType || "unknown",
      statusCode: 400,
      errorCategory: "INVALID_REPORT_TYPE",
      message: `Invalid or missing report type: '${rawType}'. Expected 'daily', 'weekly', or 'monthly'.`,
    });
    logReportEmail("request_completed", {
      correlationId,
      reportType: rawType || "unknown",
      statusCode: 400,
      durationMs: Date.now() - startTime,
      errorCategory: "INVALID_REPORT_TYPE",
    });
    return res.status(400).json({
      success: false,
      email_sent: false,
      error: "BAD_REQUEST",
      message: `Invalid or missing report type '${rawType}'. Expected 'daily', 'weekly', or 'monthly'.`,
      correlation_id: correlationId,
    });
  }

  // 6. Validate Recipient Address & Protect Against Arbitrary Relay
  const requestedRecipient = body.recipient;
  if (requestedRecipient) {
    if (typeof requestedRecipient !== "string" || !isRecipientAuthorized(requestedRecipient)) {
      logReportEmail("validation_failed", {
        correlationId,
        reportType: rawType,
        statusCode: 403,
        errorCategory: "UNAUTHORIZED_RECIPIENT",
        message: "Recipient address is not in the authorized recipients list.",
      });
      logReportEmail("request_completed", {
        correlationId,
        reportType: rawType,
        statusCode: 403,
        durationMs: Date.now() - startTime,
        errorCategory: "UNAUTHORIZED_RECIPIENT",
      });
      return res.status(403).json({
        success: false,
        email_sent: false,
        error: "UNAUTHORIZED_RECIPIENT",
        message: "Requested recipient address is not in the authorized report recipient list.",
        correlation_id: correlationId,
      });
    }
  }

  // 7. Execute Report Generation & Email Dispatch
  try {
    const force = body.force === true || body.force === "true" || body.force === 1;

    const result = await executeScheduledReport(rawType, {
      force,
      recipient: requestedRecipient,
      correlationId,
    });

    const durationMs = Date.now() - startTime;
    let httpStatus = 200;

    if (!result.success) {
      if (result.error === "SMTP_CONFIG_MISSING" || result.error === "NO_VALID_RECIPIENTS") {
        httpStatus = 200; // Honest configuration warning per project contract
      } else if (result.error === "SMTP_AUTH_FAILED" || result.error === "SMTP_PROVIDER_ERROR") {
        httpStatus = 502;
      } else if (result.error === "SMTP_TIMEOUT") {
        httpStatus = 504;
      } else {
        httpStatus = 500;
      }
    }

    logReportEmail("request_completed", {
      correlationId,
      reportType: rawType,
      statusCode: httpStatus,
      durationMs,
      errorCategory: result.success ? null : result.error,
    });

    return res.status(httpStatus).json({
      ...result,
      correlation_id: correlationId,
    });
  } catch (err: any) {
    const durationMs = Date.now() - startTime;
    logReportEmail("request_completed", {
      correlationId,
      reportType: rawType,
      statusCode: 500,
      durationMs,
      errorCategory: "INTERNAL_SERVER_ERROR",
      message: err?.message || "Unexpected server error",
    });

    return res.status(500).json({
      success: false,
      email_sent: false,
      error: "INTERNAL_SERVER_ERROR",
      message: "Internal server error occurred during report email execution.",
      correlation_id: correlationId,
    });
  }
}
