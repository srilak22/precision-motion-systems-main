// INDUS Telemetry & Analytics Endpoint (api/track.js)
// Phase 1 Security Hardened: Input Validation, Serverless Rate Limiting, CORS, Redaction, Jira Lead Protection

const TABLE_IDS = {
  page_view: "Page Views",
  click: "Clicks",
  button_click: "Clicks",
  cta_click: "CTA Interactions",
  lead: "Leads",
  form_submit: "Form Submissions",
  form_submission: "Form Submissions",
  download: "Downloads",
  search: "Search Activity",
  navigation: "Navigation",
  navigation_click: "Navigation",
  whatsapp_click: "WhatsApp Enquiries",
  contact: "WhatsApp Enquiries",
  external_link_click: "Clicks",
  product_view: "Product Interest",
  product_action: "Product Interest",
  utm_visit: "UTM Campaigns",
  error: "Errors",
  scroll: "Scroll & Engagement",
  scroll_25: "Scroll & Engagement",
  scroll_50: "Scroll & Engagement",
  scroll_75: "Scroll & Engagement",
  scroll_100: "Scroll & Engagement",
  engagement: "Scroll & Engagement",
  session_start: "Website Sessions",
  dwell: "Scroll & Engagement",
};

const ALLOWED_EVENTS = new Set(Object.keys(TABLE_IDS));

// Rate limit sliding window trackers for serverless instance lifetime
// Telemetry: 60/minute per IP; Lead/Form: 5/minute per IP
const ipRateLimits = new Map();
const recentLeadHashes = new Map();

function isRateLimited(ip, isLead = false) {
  const now = Date.now();
  const windowMs = 60_000;
  const maxRequests = isLead ? 5 : 60;
  const key = `${ip}:${isLead ? "lead" : "track"}`;

  // Clean stale keys periodically
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

function checkAndRecordLeadDeduplication(ip, email, name) {
  const now = Date.now();
  const hashKey = `${ip}|${(email || "").toLowerCase()}|${(name || "").toLowerCase()}`;

  // Purge expired hashes
  for (const [k, timestamp] of recentLeadHashes.entries()) {
    if (now - timestamp > 60_000) {
      recentLeadHashes.delete(k);
    }
  }

  if (recentLeadHashes.has(hashKey)) {
    return true; // Is duplicate
  }

  recentLeadHashes.set(hashKey, now);
  return false;
}

// Origin validation
function isOriginAllowed(origin) {
  if (!origin) return true; // Same-origin or non-browser client
  const allowed = [
    "https://precision-motion-systems-main.vercel.app",
    "http://localhost:8080",
    "http://localhost:3000",
    "http://127.0.0.1:8080",
    "http://127.0.0.1:3000",
  ];
  if (allowed.includes(origin)) return true;
  // Match Vercel deployment preview domains: https://precision-motion-systems-*.vercel.app
  if (/^https:\/\/precision-motion-systems-[a-zA-Z0-9_-]+\.vercel\.app$/.test(origin)) {
    return true;
  }
  return false;
}

// Safe string sanitation & length trimming
function sanitizeField(input, maxLength) {
  if (typeof input !== "string") return "";
  // Strip control characters
  const clean = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").trim();
  return clean.slice(0, maxLength);
}

function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// Standardize device string safely
function getSimpleDevice(deviceStr = "") {
  const str = String(deviceStr).toLowerCase();
  if (str.includes("mobile") || str.includes("iphone") || str.includes("android")) return "Mobile";
  if (str.includes("tablet") || str.includes("ipad")) return "Tablet";
  return "Desktop";
}

export default async function handler(req, res) {
  const origin = req.headers ? req.headers.origin || "" : "";
  const allowed = isOriginAllowed(origin);

  if (allowed && origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
    res.setHeader("Vary", "Origin");
  }

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // Enforce HTTP method: POST only
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(405).json({
      success: false,
      error: "Method Not Allowed. Only POST requests are supported.",
    });
  }

  // Extract client IP address safely
  const rawForwarded = req.headers ? req.headers["x-forwarded-for"] || "" : "";
  const clientIp = (
    rawForwarded.split(",")[0].trim() ||
    (req.headers && req.headers["x-real-ip"]) ||
    "127.0.0.1"
  ).slice(0, 45);

  try {
    // Validate request body
    let payload = req.body;
    if (typeof payload === "string") {
      try {
        if (payload.length > 16384) {
          return res.status(413).json({ success: false, error: "Payload Too Large (Max 16KB)" });
        }
        payload = JSON.parse(payload);
      } catch {
        return res.status(400).json({ success: false, error: "Invalid JSON payload" });
      }
    }

    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid request: body must be a JSON object" });
    }

    // Bot honeypot detection (reject silently without logging or notifying bot)
    if (payload._hp || payload.honeypot || payload.website_url || payload.company_fax) {
      return res.status(200).json({ success: true, recorded: true, deduplicated: true });
    }

    // Rate limit check
    const rawEvent = sanitizeField(payload.event || payload.eventType || "page_view", 50);
    const isLeadRequest =
      rawEvent === "lead" || rawEvent === "form_submit" || rawEvent === "form_submission";

    if (isRateLimited(clientIp, isLeadRequest)) {
      return res.status(429).json({
        success: false,
        error: "Too Many Requests. Rate limit exceeded.",
      });
    }

    // Validate event name against allowed whitelist
    const event = ALLOWED_EVENTS.has(rawEvent) ? rawEvent : "page_view";

    // Sanitize and constrain payload fields
    const page = sanitizeField(payload.page || payload.pagePath || "/", 300);
    const url = sanitizeField(payload.url || "", 500);
    const rawDevice = sanitizeField(payload.device || "Desktop", 50);
    const simpleDevice = getSimpleDevice(rawDevice);
    const browser = sanitizeField(payload.browser || "Unknown", 50);
    const operatingSystem = sanitizeField(payload.operatingSystem || "Unknown", 50);
    const screen = sanitizeField(payload.screen || payload.screen_resolution || "", 50);
    const referrer = sanitizeField(payload.referrer || "", 500);
    const element = sanitizeField(payload.element || "", 150);
    const details = sanitizeField(payload.details || payload.requirements || "", 1000);
    const timestamp = new Date().toISOString();
    const sessionId = sanitizeField(
      payload.session || payload.sessionId || `sess_${Date.now()}`,
      100,
    );

    // Geo metadata from edge headers
    const headerCountry = req.headers
      ? req.headers["cf-ipcountry"] ||
        req.headers["x-vercel-ip-country"] ||
        req.headers["x-country"]
      : null;
    const headerRegion = req.headers
      ? req.headers["cf-region"] || req.headers["x-vercel-ip-country-region"]
      : null;
    const headerCity = req.headers
      ? req.headers["cf-ipcity"] || req.headers["x-vercel-ip-city"]
      : null;
    const headerTimezone = req.headers
      ? req.headers["x-vercel-ip-timezone"] || req.headers["cf-timezone"]
      : null;

    const country = sanitizeField(payload.country || headerCountry || "Global", 80);
    const region = sanitizeField(payload.region || headerRegion || "", 80);
    const city = sanitizeField(payload.city || headerCity || "", 80);
    const timezone = sanitizeField(payload.timezone || headerTimezone || "UTC", 60);
    const localHour =
      typeof payload.localHour === "number"
        ? Math.min(23, Math.max(0, payload.localHour))
        : new Date().getUTCHours();

    // Traffic metadata
    const trafficType = sanitizeField(
      payload.trafficType || payload.trafficChannel || "Direct",
      50,
    );
    const trafficSource = sanitizeField(
      payload.trafficSource ||
        payload.utmSource ||
        (trafficType === "Direct" ? "direct" : "unknown"),
      80,
    );
    const trafficMedium = sanitizeField(
      payload.trafficMedium || payload.utmMedium || (trafficType === "Direct" ? "none" : "unknown"),
      80,
    );
    const utmSource = sanitizeField(payload.utmSource || "", 80);
    const utmMedium = sanitizeField(payload.utmMedium || "", 80);
    const utmCampaign = sanitizeField(payload.utmCampaign || "", 80);
    const utmTerm = sanitizeField(payload.utmTerm || "", 80);
    const utmContent = sanitizeField(payload.utmContent || "", 80);
    const networkType = sanitizeField(payload.networkType || "Broadband", 50);
    const organization = sanitizeField(payload.organization || "", 100);

    const maskedIp = clientIp ? clientIp.replace(/\.\d+$/, ".xxx") : "anonymized";

    // Track status of downstream destinations
    const destinations = {
      googleSheet: false,
      airtable: false,
      jira: false,
    };

    // 1. Forward to Google Apps Script (if configured)
    const GOOGLE_APPS_SCRIPT_URL =
      process.env.GOOGLE_APPS_SCRIPT_URL ||
      "https://script.google.com/macros/s/AKfycbw8NhfkPJGeYu4NAaisxN3FHaWmAVlZTmEO2x1CsBirRPvt5pQjI5zNv3qVXqEA2W1a/exec";

    if (GOOGLE_APPS_SCRIPT_URL && !payload.skipAppsScript) {
      try {
        const gasPayload = {
          sheet: TABLE_IDS[event] || "Website Activity",
          sheetName: TABLE_IDS[event] || "Website Activity",
          table: TABLE_IDS[event] || "Website Activity",
          event,
          eventType: event,
          sessionId,
          timestamp,
          page,
          url,
          referrer,
          device: simpleDevice,
          browser,
          operatingSystem,
          screen,
          deviceType: simpleDevice,
          Device: simpleDevice,
          Browser: browser,
          "Operating System": operatingSystem,
          Screen: screen,
          element,
          details,
          country,
          region,
          city,
          timezone,
          localHour,
          trafficType,
          trafficChannel: trafficType,
          trafficSource,
          trafficMedium,
          utmSource,
          utmMedium,
          utmCampaign,
          utmTerm,
          utmContent,
          maskedIp,
          networkType,
          organization,
          networkRiskSignal: sanitizeField(payload.networkRiskSignal || "Low Risk", 30),
          spreadsheetId:
            process.env.GOOGLE_SPREADSHEET_ID || "1fHcRuJnK-tF2PwcrXuVl4K_FN8Sy1dI7gtSmEVZqbEc",
          sheetGid: process.env.GOOGLE_SPREADSHEET_GID || "2025481644",
          spreadsheetUrl:
            process.env.GOOGLE_SPREADSHEET_URL ||
            "https://docs.google.com/spreadsheets/d/1fHcRuJnK-tF2PwcrXuVl4K_FN8Sy1dI7gtSmEVZqbEc/edit?gid=2025481644#gid=2025481644",
        };

        const gasRes = await fetch(GOOGLE_APPS_SCRIPT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(gasPayload),
          signal: AbortSignal.timeout(3500),
        });

        if (gasRes.ok) {
          destinations.googleSheet = true;
        }
      } catch {
        // Non-blocking transmission failure handled safely without breaking analytics
      }
    }

    // 2. Protected Jira Lead Creation (STRICTLY for validated lead submissions only)
    let jiraTicketKey = null;
    const isExplicitLead = event === "lead";
    const leadName = sanitizeField(payload.name, 100);
    const leadEmail = sanitizeField(payload.email, 254);
    const leadPhone = sanitizeField(payload.phone, 30);
    const leadCompany = sanitizeField(payload.company, 100);
    const leadProduct = sanitizeField(payload.product, 150);
    const hasValidLeadData = isExplicitLead && leadName.length >= 2 && isValidEmail(leadEmail);

    if (hasValidLeadData && !payload.skipJira) {
      const isDuplicate = checkAndRecordLeadDeduplication(clientIp, leadEmail, leadName);

      if (!isDuplicate) {
        const JIRA_DOMAIN = process.env.JIRA_DOMAIN || "trustworkz.atlassian.net";
        const JIRA_EMAIL = process.env.JIRA_EMAIL || "srilakshana.int2027g3@gmail.com";
        const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN; // Read ONLY from environment variable
        const JIRA_PROJECT_KEY = process.env.JIRA_PROJECT_KEY || "DI";
        const JIRA_ASSIGNEE_ID =
          process.env.JIRA_ASSIGNEE_ID || "712020:90b59131-da57-4b30-9614-6891eff382e6";

        if (JIRA_DOMAIN && JIRA_EMAIL && JIRA_API_TOKEN) {
          try {
            const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString("base64");
            const formTitle = sanitizeField(payload.form || element || "Web Lead", 60);
            const summary =
              `Automated Lead (${formTitle}): ${leadName} ${leadCompany ? `(${leadCompany})` : ""}`.slice(
                0,
                250,
              );

            const desc = `
==================================================
AUTOMATED WEBSITE LEAD INTAKE (TELEMETRY PIPELINE)
==================================================

CONTACT INFORMATION:
• Full Name: ${leadName}
• Company: ${leadCompany || "N/A"}
• Email: ${leadEmail}
• Phone: ${leadPhone || "N/A"}

ENQUIRY CONTEXT:
• Form / Channel: ${formTitle}
• Product Focus: ${leadProduct || "General Precision Motion Systems"}
• Page URL: ${url || page}
• Referrer: ${referrer || "N/A"}

SPECIFICATIONS & MESSAGE:
${details || "Telemetry form submission."}

VISITOR & NETWORK INTELLIGENCE:
• Geographic Location: ${city ? `${city}, ` : ""}${region ? `${region}, ` : ""}${country || "Global"}
• Organization / Network: ${organization || "Broadband"}
• Device: ${simpleDevice} (${screen || "N/A"})
• Traffic Source: ${trafficSource}
• Session ID: ${sessionId}

--------------------------------------------------
Origin: INDUS Automated Lead Pipeline
Project Key: ${JIRA_PROJECT_KEY}
Timestamp: ${timestamp}
            `.trim();

            const jiraPayload = {
              fields: {
                project: { key: JIRA_PROJECT_KEY },
                summary,
                description: desc,
                issuetype: { name: "Task" },
                labels: ["automated-lead", "website-intake", "dealflow"],
                assignee: { accountId: JIRA_ASSIGNEE_ID },
              },
            };

            const jiraRes = await fetch(`https://${JIRA_DOMAIN}/rest/api/2/issue`, {
              method: "POST",
              headers: {
                Authorization: `Basic ${auth}`,
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify(jiraPayload),
              signal: AbortSignal.timeout(4000),
            });

            if (jiraRes.ok) {
              const jiraData = await jiraRes.json();
              jiraTicketKey = jiraData.key;
              destinations.jira = true;
            }
          } catch {
            // Jira failure handled safely without crashing
          }
        }
      }
    }

    // 3. Airtable Integration (if configured)
    const { AIRTABLE_TOKEN, AIRTABLE_BASE_ID, AIRTABLE_TABLE_ID } = process.env;

    if (AIRTABLE_TOKEN && AIRTABLE_BASE_ID) {
      const targetTableName = TABLE_IDS[event] || "Website Activity";
      let fields = {};

      if (targetTableName === "Page Views") {
        fields = {
          "Session ID": sessionId,
          Page: page,
          "Page Title": details || page,
          URL: url,
          Referrer: referrer,
          Device: simpleDevice,
          "Screen Size": screen,
          Timestamp: timestamp,
          Browser: browser,
        };
      } else if (targetTableName === "Form Submissions" || targetTableName === "Leads") {
        fields = {
          "Session ID": sessionId,
          "Form Name": sanitizeField(payload.form || element || "Contact Form", 60),
          Page: page,
          URL: url,
          "Submission Status": "Success",
          Device: simpleDevice,
          Timestamp: timestamp,
        };
        if (leadName) fields.Name = leadName;
        if (leadEmail) fields.Email = leadEmail;
        if (leadPhone) fields.Phone = leadPhone;
        if (leadCompany) fields.Company = leadCompany;
        if (leadProduct) fields.Product = leadProduct;
        if (details) fields.Requirement = details;
      } else {
        fields = {
          Name: `${event} - ${page}`.slice(0, 100),
          "Activity Type": event,
          Timestamp: timestamp,
          Page: page,
          URL: url,
          Device: simpleDevice,
          "Screen Size": screen,
          "Session ID": sessionId,
          Referrer: referrer,
          Details: details,
          Element: element,
        };
      }

      try {
        const atRes = await fetch(
          `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(targetTableName)}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${AIRTABLE_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ fields }),
            signal: AbortSignal.timeout(3500),
          },
        );

        if (atRes.ok) {
          destinations.airtable = true;
        } else if (AIRTABLE_TABLE_ID) {
          // Fallback table attempt
          const fallbackRes = await fetch(
            `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_ID)}`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${AIRTABLE_TOKEN}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                fields: {
                  Name: `${event} - ${page}`.slice(0, 100),
                  "Activity Type": event,
                  Timestamp: timestamp,
                  Page: page,
                  URL: url,
                  Device: simpleDevice,
                  "Session ID": sessionId,
                },
              }),
              signal: AbortSignal.timeout(3500),
            },
          );
          if (fallbackRes.ok) {
            destinations.airtable = true;
          }
        }
      } catch {
        // Airtable failure handled safely
      }
    }

    // Truthful status response: Check if at least one destination recorded or succeeded
    const anyDestinationConfigured = Boolean(
      GOOGLE_APPS_SCRIPT_URL || (AIRTABLE_TOKEN && AIRTABLE_BASE_ID) || process.env.JIRA_API_TOKEN,
    );
    const anyDestinationSucceeded =
      destinations.googleSheet || destinations.airtable || destinations.jira;

    if (anyDestinationConfigured && !anyDestinationSucceeded) {
      return res.status(502).json({
        success: false,
        recorded: false,
        message: "Configured telemetry destinations could not be reached",
      });
    }

    return res.status(200).json({
      success: true,
      recorded: anyDestinationSucceeded,
      sessionId,
      ...(jiraTicketKey ? { jiraKey: jiraTicketKey } : {}),
    });
  } catch {
    return res.status(500).json({
      success: false,
      recorded: false,
      error: "Internal server error",
    });
  }
}
