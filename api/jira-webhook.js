// INDUS Robotics — Jira Cloud Webhook Receiver (api/jira-webhook.js)
// Validates HMAC-SHA256 signatures via X-Hub-Signature against JIRA_WEBHOOK_SECRET
// Handles jira:issue_created and jira:issue_updated events
// CRITICAL: Strictly NEVER creates Jira issues in response to incoming events to prevent loops or unauthorized task generation.

import crypto from "node:crypto";

/**
 * Vercel Serverless Function Configuration
 * Disables automatic body parsing so the raw byte stream is preserved for cryptographic signature verification.
 */
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Extracts and concatenates the exact raw body Buffer from the incoming request.
 */
async function getRawBody(req) {
  if (Buffer.isBuffer(req.rawBody)) {
    return req.rawBody;
  }
  if (typeof req.rawBody === "string") {
    return Buffer.from(req.rawBody, "utf8");
  }
  if (Buffer.isBuffer(req.body)) {
    return req.body;
  }
  if (typeof req.body === "string") {
    return Buffer.from(req.body, "utf8");
  }

  // Stream consumption when bodyParser is disabled
  if (
    typeof req[Symbol.asyncIterator] === "function" ||
    (typeof req.on === "function" && !req.readableEnded)
  ) {
    try {
      const chunks = [];
      let totalBytes = 0;
      const MAX_BYTES = 2 * 1024 * 1024; // 2MB safety threshold

      for await (const chunk of req) {
        const buf = typeof chunk === "string" ? Buffer.from(chunk, "utf8") : chunk;
        totalBytes += buf.length;
        if (totalBytes > MAX_BYTES) {
          throw new Error("PAYLOAD_TOO_LARGE");
        }
        chunks.push(buf);
      }

      if (chunks.length > 0) {
        return Buffer.concat(chunks);
      }
    } catch (err) {
      if (err instanceof Error && err.message === "PAYLOAD_TOO_LARGE") {
        throw err;
      }
    }
  }

  // Fallback for pre-parsed JSON objects in testing environments
  if (req.body && typeof req.body === "object") {
    return Buffer.from(JSON.stringify(req.body), "utf8");
  }

  return Buffer.from("");
}

/**
 * Extracts the hexadecimal HMAC digest from the signature header.
 * Supports standard Jira X-Hub-Signature: sha256=<hex>
 */
function extractSignatureHex(req) {
  const headers = req.headers || {};
  const rawHeader =
    headers["x-hub-signature"] ||
    headers["x-hub-signature-256"] ||
    headers["x-atlassian-webhook-signature"];

  if (!rawHeader || typeof rawHeader !== "string") {
    return null;
  }

  const trimmed = rawHeader.trim();
  if (trimmed.startsWith("sha256=")) {
    const hex = trimmed.slice(7).trim();
    return /^[a-f0-9]{64}$/i.test(hex) ? hex.toLowerCase() : null;
  }

  // Raw 64-character hex format fallback
  if (/^[a-f0-9]{64}$/i.test(trimmed)) {
    return trimmed.toLowerCase();
  }

  return null;
}

/**
 * Validates Jira Cloud HMAC-SHA256 signature against the exact raw request bytes.
 * Uses constant-time comparison to prevent timing attacks.
 */
export function verifyJiraWebhookSignature(rawBodyBuffer, signatureHex, secret) {
  if (!signatureHex || typeof signatureHex !== "string") {
    return false;
  }
  if (!secret || typeof secret !== "string") {
    return false;
  }

  const computedHex = crypto
    .createHmac("sha256", secret)
    .update(rawBodyBuffer)
    .digest("hex")
    .toLowerCase();

  const expectedBuf = Buffer.from(signatureHex.toLowerCase(), "utf8");
  const computedBuf = Buffer.from(computedHex, "utf8");

  if (expectedBuf.length !== computedBuf.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuf, computedBuf);
}

// Sliding window deduplication cache for incoming webhook deliveries (15 minute window)
const seenWebhookDeliveries = new Map();

function isDuplicateWebhookDelivery(eventId) {
  if (!eventId) return false;
  const now = Date.now();
  if (seenWebhookDeliveries.size > 2000) {
    for (const [k, ts] of seenWebhookDeliveries.entries()) {
      if (now - ts > 15 * 60 * 1000) {
        seenWebhookDeliveries.delete(k);
      }
    }
  }
  if (seenWebhookDeliveries.has(eventId)) {
    return true;
  }
  seenWebhookDeliveries.set(eventId, now);
  return false;
}

/**
 * Jira Webhook Serverless Handler
 */
export default async function handler(req, res) {
  // CORS & Preflight Handling
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, X-Hub-Signature, X-Hub-Signature-256",
  );

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // Enforce HTTP method: POST only
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(405).json({
      success: false,
      error: "Method Not Allowed. Webhook receiver only accepts POST requests.",
    });
  }

  // Verify server configuration
  const secret = process.env.JIRA_WEBHOOK_SECRET ? process.env.JIRA_WEBHOOK_SECRET.trim() : "";
  if (!secret) {
    console.error(
      "Jira webhook error: JIRA_WEBHOOK_SECRET environment variable is not configured.",
    );
    return res.status(500).json({
      success: false,
      error: "Server configuration error: Webhook secret is not configured.",
    });
  }

  // 1. Ingest raw body
  let rawBodyBuffer;
  try {
    rawBodyBuffer = await getRawBody(req);
  } catch (err) {
    if (err instanceof Error && err.message === "PAYLOAD_TOO_LARGE") {
      return res.status(413).json({
        success: false,
        error: "Payload Too Large: Webhook body exceeds 2MB limit.",
      });
    }
    return res.status(400).json({
      success: false,
      error: "Failed to read request body.",
    });
  }

  if (!rawBodyBuffer || rawBodyBuffer.length === 0) {
    return res.status(400).json({
      success: false,
      error: "Bad Request: Request body is empty.",
    });
  }

  // 2. Validate cryptographic signature or secret token
  const signatureHex = extractSignatureHex(req);
  let isAuthenticated = false;

  if (signatureHex) {
    isAuthenticated = verifyJiraWebhookSignature(rawBodyBuffer, signatureHex, secret);
  }

  let candidateSecret = null;
  // Also support token verification (e.g. Jira query param ?secret= or header X-Webhook-Secret)
  if (!isAuthenticated) {
    const urlObj = new URL(req.url || "/", "http://localhost");
    const querySecret = urlObj.searchParams.get("secret");
    const headerSecret =
      req.headers?.["x-webhook-secret"] ||
      (req.headers?.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.slice(7).trim()
        : null);

    candidateSecret = querySecret || headerSecret;
    if (candidateSecret && typeof candidateSecret === "string") {
      const candidateBuf = Buffer.from(candidateSecret);
      const secretBuf = Buffer.from(secret);
      if (candidateBuf.length === secretBuf.length && crypto.timingSafeEqual(candidateBuf, secretBuf)) {
        isAuthenticated = true;
      }
    }
  }

  if (!isAuthenticated) {
    console.warn(
      "Jira webhook warning: Webhook signature verification failed for incoming request.",
    );
    if (!signatureHex && !candidateSecret) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized: Missing or malformed X-Hub-Signature header (expected sha256=<hex>).",
      });
    }
    return res.status(401).json({
      success: false,
      error: "Unauthorized: Invalid webhook signature.",
    });
  }

  // 3. Parse and validate JSON payload
  let payload;
  try {
    payload = JSON.parse(rawBodyBuffer.toString("utf8"));
  } catch {
    return res.status(400).json({
      success: false,
      error: "Bad Request: Body contains invalid JSON.",
    });
  }

  if (!payload || typeof payload !== "object") {
    return res.status(400).json({
      success: false,
      error: "Bad Request: Payload must be a JSON object.",
    });
  }

  // 4. Process event
  const webhookEvent = String(
    payload.webhookEvent || payload.issue_event_type_name || payload.event || "unknown",
  ).trim();

  const issueKey = payload.issue?.key || null;
  const issueSummary = payload.issue?.fields?.summary || null;
  const issueStatus = payload.issue?.fields?.status?.name || null;
  const projectKey = payload.issue?.fields?.project?.key || null;
  const issueType = payload.issue?.fields?.issuetype?.name || null;
  const timestamp = payload.timestamp || Date.now();

  // Deduplication protection for webhook retries
  const deliveryIdentifier =
    req.headers?.["x-atlassian-webhook-identifier"] ||
    `${webhookEvent}:${issueKey || "none"}:${payload.timestamp || payload.issue?.id || ""}`;

  if (isDuplicateWebhookDelivery(deliveryIdentifier)) {
    return res.status(200).json({
      success: true,
      duplicate: true,
      received: true,
      event: webhookEvent,
      issueKey,
      action: "duplicate_acknowledged",
      message: "Duplicate event delivery safely acknowledged without re-processing.",
    });
  }

  // Route event safely
  switch (webhookEvent) {
    case "jira:issue_created":
    case "issue_created": {
      // NOTE: Strictly log and acknowledge. NEVER create an outgoing Jira issue.
      const result = {
        success: true,
        received: true,
        event: "jira:issue_created",
        issueKey,
        projectKey,
        issueType,
        summary: issueSummary ? issueSummary.slice(0, 100) : null,
        status: issueStatus,
        timestamp,
        action: "processed",
      };

      return res.status(200).json(result);
    }

    case "jira:issue_updated":
    case "issue_updated": {
      // Extract modified field names from changelog
      const changelogItems = Array.isArray(payload.changelog?.items) ? payload.changelog.items : [];
      const changedFields = changelogItems.map((item) => ({
        field: item.field || "unknown",
        fromString: item.fromString || null,
        toString: item.toString || null,
      }));

      const result = {
        success: true,
        received: true,
        event: "jira:issue_updated",
        issueKey,
        projectKey,
        summary: issueSummary ? issueSummary.slice(0, 100) : null,
        status: issueStatus,
        changedFields,
        changesCount: changedFields.length,
        timestamp,
        action: "processed",
      };

      return res.status(200).json(result);
    }

    default: {
      // Acknowledge other Jira events (e.g. issue_deleted, comment_created) with 200 OK so Jira doesn't retry
      return res.status(200).json({
        success: true,
        received: true,
        event: webhookEvent,
        issueKey,
        action: "ignored",
        message: `Event '${webhookEvent}' acknowledged without side effects.`,
      });
    }
  }
}
