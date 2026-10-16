// INDUS Industrial Robotics — Weekly Report Endpoint
// Endpoint: /api/report-weekly
// Executes and dispatches the 7-day Weekly Commercial Digest

import { verifyCronAuth, executeScheduledReport } from "./_lib/reports.js";

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Cron-Secret, X-Vercel-Cron");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // Verify Authentication
  const auth = verifyCronAuth(req);
  if (!auth.authorized) {
    return res.status(401).json({
      success: false,
      email_sent: false,
      error: "UNAUTHORIZED",
      message: auth.reason || "Unauthorized request: Invalid or missing CRON_SECRET authentication.",
    });
  }

  try {
    const force =
      req.query?.force === "true" ||
      req.query?.force === "1" ||
      req.body?.force === true;

    const recipient = req.query?.recipient || req.body?.recipient;

    const result = await executeScheduledReport("weekly", { force, recipient });

    if (result.success) {
      return res.status(200).json(result);
    }
    if (result.error === "SMTP_CONFIG_MISSING" || result.error === "NO_VALID_RECIPIENTS") {
      return res.status(200).json(result);
    }
    if (result.error === "SMTP_AUTH_FAILED" || result.error === "SMTP_PROVIDER_ERROR") {
      return res.status(502).json(result);
    }
    if (result.error === "SMTP_TIMEOUT") {
      return res.status(504).json(result);
    }
    return res.status(500).json(result);
  } catch (err: any) {
    console.error("[Weekly Report] Unhandled error:", err);
    return res.status(500).json({
      success: false,
      email_sent: false,
      error: "INTERNAL_SERVER_ERROR",
      message: err?.message || "Internal server error occurred during weekly report execution.",
    });
  }
}
