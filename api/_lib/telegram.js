// INDUS Industrial Robotics — Telegram Bot Notification Integration
// api/lib/telegram.js
// Handles server-side lead dispatch to Telegram via Bot API sendMessage.
// Zero-leakage: bot credentials are never exposed to client or logs.

import dns from "node:dns";

// Ensure IPv4 resolution precedence in dual-stack Node runtimes to avoid IPv6 timeouts
if (dns && typeof dns.setDefaultResultOrder === "function") {
  try {
    dns.setDefaultResultOrder("ipv4first");
  } catch {
    // Ignore if not supported in runtime
  }
}

/**
 * Attempts to load environment variables from .env.local or .env if not yet populated.
 * Safe for serverless and local dev.
 */
function ensureEnvLoaded() {
  if (
    (!process.env.TELEGRAM_BOT_TOKEN || !process.env.JIRA_DOMAIN) &&
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

// Initialize on module load
ensureEnvLoaded();

/**
 * Checks whether Telegram bot credentials are configured on the server.
 * @returns {boolean}
 */
export function isTelegramConfigured() {
  ensureEnvLoaded();
  const token = (process.env.TELEGRAM_BOT_TOKEN || "").trim();
  const chatId = (process.env.TELEGRAM_CHAT_ID || "").trim();
  return Boolean(token && chatId);
}

/**
 * Formats lead details into a clean, professional plain-text message for Telegram.
 * Conforms to the standard INDUS lead notification schema.
 *
 * @param {Object} lead
 * @returns {string}
 */
export function formatTelegramMessage(lead = {}) {
  const name = (lead.name || "Anonymous Lead").trim();
  const email = (lead.email || "Not provided").trim();
  const phone = (lead.phone || "").trim() || "Not provided";
  const company = (lead.company || "").trim() || "Not provided";
  const interest = (
    lead.interest ||
    lead.product ||
    lead.topic ||
    "General Robotic Systems / Enquiry"
  ).trim();
  const requirement = (
    lead.requirement ||
    lead.requirements ||
    lead.details ||
    "No specific requirements specified"
  ).trim();
  const source = (
    lead.source ||
    lead.form ||
    lead.type ||
    "Website Lead Form"
  ).trim();

  let submitted = lead.submitted;
  if (!submitted) {
    const dateObj = lead.timestamp ? new Date(lead.timestamp) : new Date();
    submitted = isNaN(dateObj.getTime())
      ? new Date().toISOString().replace("T", " ").replace(/\.\d+Z$/, " UTC")
      : dateObj.toISOString().replace("T", " ").replace(/\.\d+Z$/, " UTC");
  }

  const lines = [
    "New INDUS Website Lead",
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    `Company: ${company}`,
    `Interest: ${interest}`,
    `Requirement: ${requirement}`,
    `Source: ${source}`,
    `Submitted: ${submitted}`,
  ];

  if (lead.page && lead.page !== "/") {
    lines.push(`Page: ${lead.page}`);
  }

  if (lead.jiraKey || lead.issueKey) {
    lines.push(`Jira Ticket: ${lead.jiraKey || lead.issueKey}`);
  }

  const fullMessage = lines.join("\n");

  // Enforce Telegram 4096-char ceiling with safety margin
  if (fullMessage.length > 4000) {
    return fullMessage.slice(0, 3990) + "\n[Truncated]";
  }

  return fullMessage;
}

/**
 * Sends a lead notification message to the configured Telegram bot and chat.
 * Includes timeout and automatic single retry on transient failures.
 * Does not throw uncaught exceptions to ensure lead flow is never broken.
 *
 * @param {Object} leadData Lead attributes
 * @returns {Promise<{ success: boolean, messageId?: number, duplicate?: boolean, error?: string }>}
 */
export async function sendTelegramNotification(leadData) {
  ensureEnvLoaded();

  const token = (process.env.TELEGRAM_BOT_TOKEN || "").trim();
  const chatId = (process.env.TELEGRAM_CHAT_ID || "").trim();

  if (!token || !chatId) {
    console.warn(
      "[Telegram] Warning: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing. Notification skipped.",
    );
    return {
      success: false,
      error: "Telegram credentials not configured on server",
    };
  }

  const messageText = formatTelegramMessage(leadData);

  const endpoint = `https://api.telegram.org/bot${token}/sendMessage`;
  const bodyPayload = JSON.stringify({
    chat_id: chatId,
    text: messageText,
    disable_web_page_preview: true,
  });

  // Attempt transmission with single retry on transient network/5xx errors
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: bodyPayload,
        signal: AbortSignal.timeout(7000),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          messageId: data.result?.message_id,
        };
      }

      const errText = await response.text().catch(() => "");
      console.error(
        `[Telegram] HTTP error ${response.status} on attempt ${attempt}:`,
        errText ? errText.slice(0, 200) : "No error description",
      );

      // Client errors (4xx like 400/401/403/404) are not retryable
      if (response.status >= 400 && response.status < 500) {
        return {
          success: false,
          error: `Telegram API rejected message (HTTP ${response.status})`,
        };
      }

      // If attempt 1 failed with 5xx, wait 1000ms before retry
      if (attempt === 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (err) {
      console.error(`[Telegram] Network exception on attempt ${attempt}:`, err?.message || err);
      if (attempt === 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } else {
        return {
          success: false,
          error: err?.message || "Telegram transmission failed",
        };
      }
    }
  }

  return {
    success: false,
    error: "Telegram notification failed after retry",
  };
}
