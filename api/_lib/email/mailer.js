// INDUS Industrial Robotics — Unified Secure Nodemailer Email Dispatcher
// api/_lib/email/mailer.js
// Features: IPv4 DNS priority, connection timeouts, credential sanitization,
//           structured runtime telemetry logging, and safe test mocking.

import dns from "node:dns";
import nodemailer from "nodemailer";
import { BRAND } from "./constants.js";

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
export function ensureEmailEnvLoaded() {
  if (
    (!process.env.SMTP_USER || !process.env.ADMIN_EMAIL) &&
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
ensureEmailEnvLoaded();

/**
 * Emits structured server-side logs for the email delivery lifecycle.
 * Filterable in Vercel Runtime Logs dashboard via "[email-delivery]".
 */
export function logEmailDelivery(eventName, payload = {}) {
  const timestamp = new Date().toISOString();
  const data = {
    event: eventName,
    timestamp,
    correlationId: payload.correlationId || null,
    templateId: payload.templateId || null,
    recipientCategory: payload.recipientCategory || null,
    statusCode: payload.statusCode || null,
    durationMs: payload.durationMs != null ? Math.round(payload.durationMs) : null,
    messageId: payload.messageId || null,
    errorCategory: payload.errorCategory || null,
    message: payload.message || null,
  };

  const logMessage = `[email-delivery] ${eventName} ${JSON.stringify(data)}`;

  if (eventName.includes("failed") || payload.errorCategory) {
    console.error(logMessage);
  } else {
    console.log(logMessage);
  }
}

/**
 * Sanitizes sensitive credentials out of error messages
 */
function sanitizeErrorMessage(rawMsg = "") {
  let clean = String(rawMsg);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (user && user.length > 2) {
    clean = clean.replaceAll(user, "[REDACTED_USER]");
  }
  if (pass && pass.length > 2) {
    clean = clean.replaceAll(pass, "[REDACTED_PASS]");
  }
  return clean.slice(0, 500);
}

/**
 * Resolves verified administrative inbox
 */
export function getAdminEmail() {
  ensureEmailEnvLoaded();
  return (
    process.env.EMAIL_TO ||
    process.env.ADMIN_EMAIL ||
    process.env.REPORT_EMAIL_TO ||
    "srilakshana.int2027g3@gmail.com"
  ).trim();
}

/**
 * Creates a configured Nodemailer SMTP Transporter
 */
export function createEmailTransporter() {
  ensureEmailEnvLoaded();
  const smtpUser = (process.env.SMTP_USER || "").trim();
  const smtpPass = (process.env.SMTP_PASS || "").trim();

  if (!smtpUser || !smtpPass) {
    return {
      configured: false,
      transporter: null,
      error: "SMTP_CONFIG_MISSING",
      message: "SMTP credentials (SMTP_USER, SMTP_PASS) are not configured in environment variables.",
    };
  }

  const isGmail = smtpUser.includes("@gmail.com");
  const transportConfig = isGmail
    ? {
        service: "gmail",
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
      }
    : {
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
      };

  const transporter = nodemailer.createTransport(transportConfig);
  return { configured: true, transporter, smtpUser };
}

/**
 * Sends a branded email using the configured email provider.
 * Supports Resend API (via RESEND_API_KEY) and Nodemailer SMTP (via SMTP_USER, SMTP_PASS).
 *
 * @param {Object} args
 * @param {string|string[]} args.to - Recipient email address(es)
 * @param {string} args.subject - Email subject line
 * @param {string} args.html - Rendered HTML content
 * @param {string} [args.text] - Plain text version
 * @param {string} [args.templateId] - Template identifier (e.g., 'welcome', 'product-update')
 * @param {string} [args.recipientCategory] - Category (e.g., 'subscriber', 'lead', 'administrator')
 * @param {string} [args.correlationId] - Correlation / tracking ID
 * @param {string} [args.from] - Optional custom from header
 * @returns {Promise<{ success: boolean, messageId?: string, error?: string, message?: string, provider?: string }>}
 */
export async function sendBrandedEmail({
  to,
  subject,
  html,
  text,
  templateId = "generic",
  recipientCategory = "subscriber",
  correlationId = null,
  from = null,
}) {
  const startTime = Date.now();
  ensureEmailEnvLoaded();

  const recipients = Array.isArray(to) ? to : [to].filter(Boolean);
  const normalizedRecipients = recipients
    .flatMap((s) => (typeof s === "string" ? s.split(",") : []))
    .map((e) => e.trim().toLowerCase())
    .filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));

  if (normalizedRecipients.length === 0) {
    logEmailDelivery("validation_failed", {
      correlationId,
      templateId,
      errorCategory: "NO_VALID_RECIPIENTS",
      message: "No valid recipient email addresses were provided.",
    });
    return {
      success: false,
      error: "NO_VALID_RECIPIENTS",
      message: "No valid recipient email addresses provided.",
    };
  }

  // 1. Transactional Provider: Resend REST API (if RESEND_API_KEY is configured)
  const resendApiKey = (process.env.RESEND_API_KEY || "").trim();
  if (resendApiKey) {
    let resendFrom = (
      from ||
      process.env.EMAIL_FROM ||
      process.env.REPORT_EMAIL_FROM ||
      `"${BRAND.fullName}" <onboarding@resend.dev>`
    ).toString().trim();

    // If configured EMAIL_FROM is a consumer domain (e.g. gmail.com) that cannot be DNS-verified on Resend,
    // fallback automatically to onboarding@resend.dev to prevent Resend 403 validation errors.
    if (/@(gmail|yahoo|outlook|hotmail|icloud)\.com/i.test(resendFrom)) {
      resendFrom = `"${BRAND.fullName}" <onboarding@resend.dev>`;
    } else if (!resendFrom.includes("<") && resendFrom.includes("@")) {
      resendFrom = `"${BRAND.fullName}" <${resendFrom}>`;
    }

    logEmailDelivery("email_send_started", {
      correlationId,
      templateId,
      recipientCategory,
      provider: "resend",
    });

    try {
      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: resendFrom,
          to: normalizedRecipients,
          subject,
          html,
          text: text || "This email requires an HTML-capable email viewer.",
          headers: {
            "X-Entity-Ref-ID": correlationId || `indus_${Date.now()}`,
            "X-Mailer": "INDUS Industrial Robotics Mailer 2.0 (Resend)",
          },
        }),
        signal: AbortSignal.timeout(12000),
      });

      const resData = await resendRes.json().catch(() => ({}));
      const durationMs = Date.now() - startTime;

      if (resendRes.ok && resData.id) {
        logEmailDelivery("email_send_succeeded", {
          correlationId,
          templateId,
          recipientCategory,
          durationMs,
          messageId: resData.id,
          provider: "resend",
        });

        return {
          success: true,
          messageId: resData.id,
          recipients: normalizedRecipients,
          durationMs,
          provider: "resend",
        };
      }

      const rawError = resData.message || `Resend API returned status ${resendRes.status}`;
      const sanitizedError = sanitizeErrorMessage(rawError);

      logEmailDelivery("email_send_failed", {
        correlationId,
        templateId,
        recipientCategory,
        durationMs,
        errorCategory: "RESEND_PROVIDER_ERROR",
        message: sanitizedError,
        provider: "resend",
      });

      return {
        success: false,
        error: "RESEND_PROVIDER_ERROR",
        message: sanitizedError,
        durationMs,
        provider: "resend",
      };
    } catch (err) {
      const durationMs = Date.now() - startTime;
      const sanitizedError = sanitizeErrorMessage(err?.message || "Resend connection error");

      logEmailDelivery("email_send_failed", {
        correlationId,
        templateId,
        recipientCategory,
        durationMs,
        errorCategory: "RESEND_NETWORK_ERROR",
        message: sanitizedError,
        provider: "resend",
      });

      return {
        success: false,
        error: "RESEND_NETWORK_ERROR",
        message: sanitizedError,
        durationMs,
        provider: "resend",
      };
    }
  }

  // 2. Primary / Fallback: Nodemailer SMTP
  const { configured, transporter, smtpUser, error, message } = createEmailTransporter();

  if (!configured) {
    logEmailDelivery("email_send_failed", {
      correlationId,
      templateId,
      recipientCategory,
      errorCategory: error || "SMTP_CONFIG_MISSING",
      message: message || "Email delivery provider is unconfigured. Set RESEND_API_KEY or SMTP credentials.",
    });
    return {
      success: false,
      error: error || "SMTP_CONFIG_MISSING",
      message: message || "Email delivery provider is unconfigured. Set RESEND_API_KEY or SMTP credentials.",
    };
  }

  const defaultFrom =
    process.env.REPORT_EMAIL_FROM ||
    `"${BRAND.fullName}" <${smtpUser}>`;

  const mailOptions = {
    from: from || defaultFrom,
    to: normalizedRecipients.join(", "),
    subject,
    html,
    text: text || "This email requires an HTML-capable email viewer.",
    headers: {
      "X-Entity-Ref-ID": correlationId || `indus_${Date.now()}`,
      "X-Mailer": "INDUS Industrial Robotics Mailer 2.0",
      "X-Auto-Response-Suppress": "All",
    },
  };

  logEmailDelivery("email_send_started", {
    correlationId,
    templateId,
    recipientCategory,
  });

  try {
    const info = await transporter.sendMail(mailOptions);
    const durationMs = Date.now() - startTime;

    logEmailDelivery("email_send_succeeded", {
      correlationId,
      templateId,
      recipientCategory,
      durationMs,
      messageId: info?.messageId || null,
    });

    return {
      success: true,
      messageId: info?.messageId || `msg_${Date.now()}`,
      recipients: normalizedRecipients,
      durationMs,
    };
  } catch (err) {
    const durationMs = Date.now() - startTime;
    const rawError = err?.message || "Unknown SMTP provider error";
    const sanitizedError = sanitizeErrorMessage(rawError);

    let errorCategory = "SMTP_PROVIDER_ERROR";
    if (err?.code === "EAUTH" || /auth|password|credentials/i.test(rawError)) {
      errorCategory = "SMTP_AUTH_FAILED";
    } else if (err?.code === "ETIMEDOUT" || err?.code === "ESOCKET" || /timeout/i.test(rawError)) {
      errorCategory = "SMTP_TIMEOUT";
    }

    logEmailDelivery("email_send_failed", {
      correlationId,
      templateId,
      recipientCategory,
      durationMs,
      errorCategory,
      message: sanitizedError,
    });

    return {
      success: false,
      error: errorCategory,
      message: sanitizedError,
      durationMs,
    };
  }
}

export { sendBrandedEmail as sendEmail };
