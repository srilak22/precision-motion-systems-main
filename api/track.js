// INDUS Telemetry & Analytics Endpoint (api/track.js)
// Phase 1 Security Hardened: Input Validation, Serverless Rate Limiting, CORS, Redaction, Jira Lead Protection

import { sendTelegramNotification } from "./_lib/telegram.js";

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

  // Purge expired hashes (60s sliding window)
  for (const [k, record] of recentLeadHashes.entries()) {
    const ts = typeof record === "object" ? record.timestamp : record;
    if (now - ts > 60_000) {
      recentLeadHashes.delete(k);
    }
  }

  if (recentLeadHashes.has(hashKey)) {
    const record = recentLeadHashes.get(hashKey);
    return {
      isDuplicate: true,
      issueKey: typeof record === "object" ? record.issueKey : null,
    };
  }

  recentLeadHashes.set(hashKey, { timestamp: now, issueKey: null });
  return { isDuplicate: false, issueKey: null };
}

function updateLeadDeduplicationKey(ip, email, name, issueKey) {
  const hashKey = `${ip}|${(email || "").toLowerCase()}|${(name || "").toLowerCase()}`;
  const record = recentLeadHashes.get(hashKey);
  if (record && typeof record === "object") {
    record.issueKey = issueKey;
  }
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
    const details = sanitizeField(payload.details || payload.requirements || "", 3000);
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

    // Extract and sanitize lead fields early
    let jiraTicketKey = null;
    const isExplicitLead = event === "lead";
    let leadName = sanitizeField(payload.name, 100);
    let leadEmail = sanitizeField(payload.email, 254);
    let leadPhone = sanitizeField(payload.phone, 30);
    let leadCompany = sanitizeField(payload.company, 100);
    let leadProduct = sanitizeField(payload.product, 150);
    let leadQuantity = sanitizeField(payload.quantity, 100);
    let leadRequirements = sanitizeField(
      payload.requirements || payload.details || details || "",
      3000,
    );
    let leadTopic = sanitizeField(payload.topic, 150);
    let leadType = sanitizeField(
      payload.type || payload.form || element || "Business Enquiry",
      80,
    );
    let leadPreferredContact = sanitizeField(payload.preferredContact || "", 50);

    // Support nested JSON in details (e.g. Careers candidate submissions)
    if (
      (!leadName || !leadEmail) &&
      typeof payload.details === "string" &&
      payload.details.trim().startsWith("{")
    ) {
      try {
        const parsed = JSON.parse(payload.details);
        if (parsed && typeof parsed === "object") {
          if (!leadName && parsed.name) leadName = sanitizeField(parsed.name, 100);
          if (!leadEmail && parsed.email) leadEmail = sanitizeField(parsed.email, 254);
          if (!leadPhone && parsed.phone) leadPhone = sanitizeField(parsed.phone, 30);
          if (!leadCompany && parsed.company) leadCompany = sanitizeField(parsed.company, 100);
          if (!leadProduct && parsed.product) leadProduct = sanitizeField(parsed.product, 150);
          if (parsed.details) leadRequirements = sanitizeField(parsed.details, 3000);
          if (parsed.position || parsed.areaOfInterest) {
            leadProduct = sanitizeField(parsed.position || parsed.areaOfInterest, 150);
          }
        }
      } catch {}
    }

    // Strict early server-side input validation for lead enquiries
    if (isExplicitLead) {
      if (!leadName || leadName.length < 2) {
        return res.status(400).json({
          success: false,
          error: "Validation error: Full name must be at least 2 characters long",
        });
      }
      if (!leadEmail || !isValidEmail(leadEmail)) {
        return res.status(400).json({
          success: false,
          error: "Validation error: A valid business email address is required",
        });
      }
    }

    // Track status of downstream destinations
    const destinations = {
      googleSheet: false,
      airtable: false,
      jira: false,
      telegram: false,
    };

    // 1. Forward to Google Apps Script (if configured)
    const GOOGLE_APPS_SCRIPT_URL =
      process.env.GOOGLE_APPS_SCRIPT_URL ||
      (process.env.NODE_ENV !== "test"
        ? "https://script.google.com/macros/s/AKfycbyO4AzoxaoBU99WFQUDNbRV-4r6UmBTLPSsgeZiCS4T2AyObnUfNcYhLv-gcVnAMYgRKg/exec"
        : null);

    if (GOOGLE_APPS_SCRIPT_URL && !payload.skipAppsScript && !isExplicitLead) {
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
            process.env.GOOGLE_SPREADSHEET_ID || "1S-ApP83X9Y1-nXwim0tDNGn72wuhVn4PSbaWkcXlH48",
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

    // 2. Protected Lead Deduplication & Jira Lead Creation
    if (isExplicitLead) {
      const dedupeResult = checkAndRecordLeadDeduplication(clientIp, leadEmail, leadName);

      if (dedupeResult.isDuplicate) {
        return res.status(200).json({
          success: true,
          duplicate: true,
          recorded: true,
          sessionId,
          ...(dedupeResult.issueKey
            ? { jiraKey: dedupeResult.issueKey, issueKey: dedupeResult.issueKey }
            : {}),
          message: "Enquiry already received. Our team will review your specifications shortly.",
        });
      }
    }

    if (isExplicitLead && !payload.skipJira) {
      const isLinkedInReferral = Boolean(
        payload.isLinkedInReferral ||
        (utmSource && utmSource.toLowerCase().includes("linkedin")) ||
        (trafficSource && trafficSource.toLowerCase().includes("linkedin")) ||
        (referrer && (referrer.toLowerCase().includes("linkedin.com") || referrer.toLowerCase().includes("lnkd.in")))
      );

      let derivedLeadSource = "Direct / Website";
      if (isLinkedInReferral) {
        const isPaid = Boolean(
          (utmMedium && /^(cpc|paid|ad|sponsored|paidsocial)$/i.test(utmMedium)) ||
          (utmCampaign && /ad|paid|sponsored|promo/i.test(utmCampaign))
        );
        derivedLeadSource = isPaid ? "LinkedIn Sponsored / Ad" : "LinkedIn Organic";
      } else if (utmSource) {
        derivedLeadSource = `${utmSource}${utmMedium ? ` / ${utmMedium}` : ""}`;
      } else if (referrer) {
        try {
          const parsedRef = new URL(referrer);
          derivedLeadSource = `Referral (${parsedRef.hostname})`;
        } catch {
          derivedLeadSource = "Referral";
        }
      }

      const JIRA_DOMAIN = process.env.JIRA_DOMAIN ? process.env.JIRA_DOMAIN.trim() : "";
      const JIRA_EMAIL = process.env.JIRA_EMAIL ? process.env.JIRA_EMAIL.trim() : "";
      const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN ? process.env.JIRA_API_TOKEN.trim() : "";
      const JIRA_PROJECT_KEY = isLinkedInReferral
        ? (process.env.LINKEDIN_JIRA_PROJECT_KEY || "LIT").trim()
        : process.env.JIRA_PROJECT_KEY
          ? process.env.JIRA_PROJECT_KEY.trim()
          : "DI";
      const JIRA_ASSIGNEE_ID = (
        (isLinkedInReferral ? process.env.LINKEDIN_JIRA_ASSIGNEE_ID : null) ||
        process.env.JIRA_ASSIGNEE_ID ||
        ""
      ).trim();

      if (!JIRA_DOMAIN || !JIRA_EMAIL || !JIRA_API_TOKEN) {
        console.error(
          "Jira integration error: Required server environment variables (JIRA_DOMAIN, JIRA_EMAIL, JIRA_API_TOKEN) are missing.",
        );
        return res.status(503).json({
          success: false,
          error: "Jira lead integration is temporarily unconfigured on the server.",
        });
      }

      try {
        const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString("base64");
        const summary = isLinkedInReferral
          ? `LinkedIn Lead (${leadType || derivedLeadSource}): ${leadName}${leadCompany ? ` (${leadCompany})` : ""}`.slice(0, 250)
          : `Automated Lead (${leadType}): ${leadName}${leadCompany ? ` (${leadCompany})` : ""}`.slice(0, 250);

        const desc = `
==================================================
${isLinkedInReferral ? "LINKEDIN ATTRIBUTED LEAD INTAKE (LIT DEALFLOW)" : "AUTOMATED WEBSITE LEAD INTAKE (DEALFLOW PIPELINE)"}
==================================================

CONTACT INFORMATION:
• Full Name: ${leadName}
• Company: ${leadCompany || "N/A"}
• Email: ${leadEmail}
• Phone: ${leadPhone || "N/A"}
${leadPreferredContact ? `• Preferred Contact: ${leadPreferredContact}\n` : ""}
ENQUIRY CONTEXT:
• Category / Type: ${leadType}
• Lead Source: ${derivedLeadSource}
• Product / Focus: ${leadProduct || leadTopic || "General Precision Motion Systems"}
• Quantity / Batch: ${leadQuantity || "Unspecified"}
• Page URL: ${url || page}
• Referrer: ${referrer || "N/A"}
• UTM Source: ${utmSource || "N/A"}
• UTM Medium: ${utmMedium || "N/A"}
• UTM Campaign: ${utmCampaign || "N/A"}

SPECIFICATIONS & MESSAGE:
${leadRequirements || "Telemetry form submission."}

VISITOR & NETWORK INTELLIGENCE:
• Geographic Location: ${city ? `${city}, ` : ""}${region ? `${region}, ` : ""}${country || "Global"}
• Organization / Network: ${organization || "Broadband"}
• Device: ${simpleDevice} (${screen || "N/A"})
• Traffic Source: ${trafficSource}
• Session ID: ${sessionId}

--------------------------------------------------
Origin: ${isLinkedInReferral ? "INDUS LinkedIn Lead Integration" : "INDUS Automated Lead Pipeline"}
Project Key: ${JIRA_PROJECT_KEY}
Timestamp: ${timestamp}
        `.trim();

        const baseLabels = isLinkedInReferral
          ? ["linkedin-lead", "dealflow-lit", "website-attribution"]
          : ["automated-lead", "website-intake", "dealflow"];
        const customLabels = Array.isArray(payload.labels)
          ? payload.labels
              .map((l) =>
                String(l)
                  .trim()
                  .toLowerCase()
                  .replace(/[^a-z0-9-_]/g, "-")
                  .slice(0, 30),
              )
              .filter(Boolean)
          : [];
        const jiraLabels = Array.from(new Set([...baseLabels, ...customLabels])).slice(0, 10);

        const jiraPayload = {
          fields: {
            project: { key: JIRA_PROJECT_KEY },
            summary,
            description: desc,
            issuetype: { name: "Task" },
            labels: jiraLabels,
            ...(JIRA_ASSIGNEE_ID ? { assignee: { accountId: JIRA_ASSIGNEE_ID } } : {}),
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
          signal: AbortSignal.timeout(6000),
        });

        if (jiraRes.ok) {
          const jiraData = await jiraRes.json();
          jiraTicketKey = jiraData.key;
          destinations.jira = true;
          updateLeadDeduplicationKey(clientIp, leadEmail, leadName, jiraTicketKey);
        } else {
          const jiraErrText = await jiraRes.text().catch(() => "");
          console.error(`Jira API returned non-OK status ${jiraRes.status}:`, jiraErrText);
          return res.status(502).json({
            success: false,
            error: "Failed to create Jira issue. Please try again or contact support.",
          });
        }
      } catch (err) {
        console.error("Jira request exception:", err);
        return res.status(502).json({
          success: false,
          error: "Jira service communication failure or timeout. Please try again.",
        });
      }
    }

    // 3. Telegram Bot Lead Notification (Sent automatically for all valid website leads)
    if (isExplicitLead && !payload.skipTelegram) {
      try {
        const tgRes = await sendTelegramNotification({
          name: leadName,
          email: leadEmail,
          phone: leadPhone,
          company: leadCompany,
          interest: leadProduct || leadTopic,
          requirement: leadRequirements,
          source: leadType,
          form: payload.form || leadType,
          page,
          url,
          timestamp,
          jiraKey: jiraTicketKey,
        });

        if (tgRes && tgRes.success) {
          destinations.telegram = true;
        }
      } catch (tgErr) {
        console.error("[Telegram] Lead notification exception:", tgErr?.message || tgErr);
      }
    }

    // 3b. Record Website Enquiry to Google Sheets ("Website Enquiries" & "Sync Logs" Tabs)
    if (isExplicitLead && GOOGLE_APPS_SCRIPT_URL && !payload.skipAppsScript) {
      try {
        const isLinkedInReferral = Boolean(
          (utmSource && utmSource.toLowerCase().includes("linkedin")) ||
          (trafficSource && trafficSource.toLowerCase().includes("linkedin")) ||
          (referrer && (referrer.toLowerCase().includes("linkedin.com") || referrer.toLowerCase().includes("lnkd.in")))
        );

        let derivedLeadSource = "Direct / Website";
        if (isLinkedInReferral) {
          const isPaid = Boolean(
            (utmMedium && /^(cpc|paid|ad|sponsored|paidsocial)$/i.test(utmMedium)) ||
            (utmCampaign && /ad|paid|sponsored|promo/i.test(utmCampaign))
          );
          derivedLeadSource = isPaid ? "LinkedIn Sponsored / Ad" : "LinkedIn Organic";
        } else if (utmSource) {
          derivedLeadSource = `${utmSource}${utmMedium ? ` / ${utmMedium}` : ""}`;
        } else if (referrer) {
          try {
            const parsedRef = new URL(referrer);
            derivedLeadSource = `Referral (${parsedRef.hostname})`;
          } catch {
            derivedLeadSource = "Referral";
          }
        }

        const targetSheet = "Website Enquiries";
        const enquiryPayload = {
          // Direct legacy Google Apps Script properties (writes to live Form Submissions tab)
          name: leadName,
          Name: leadName,
          email: leadEmail,
          Email: leadEmail,
          phone: leadPhone || "Not Provided",
          Phone: leadPhone || "Not Provided",
          company: leadCompany || "Not Specified",
          Company: leadCompany || "Not Specified",
          subject: `${leadType || "Commercial RFQ / Engineering Enquiry"}${jiraTicketKey ? ` (${jiraTicketKey})` : ""}`,
          Subject: `${leadType || "Commercial RFQ / Engineering Enquiry"}${jiraTicketKey ? ` (${jiraTicketKey})` : ""}`,
          product: leadProduct || leadTopic || "Industrial Robotics Consultation",
          Product: leadProduct || leadTopic || "Industrial Robotics Consultation",
          message: `${leadRequirements || details || ""}${jiraTicketKey ? `\n\nJira Ticket: ${jiraTicketKey}` : ""}`,
          Message: `${leadRequirements || details || ""}${jiraTicketKey ? `\n\nJira Ticket: ${jiraTicketKey}` : ""}`,
          formName: payload.form || leadType || "Website Contact Form",
          page: url || page,
          url: url || page,
          referrer: referrer || "",
          sessionId: sessionId || "",
          device: simpleDevice || "",
          browser: browser || "",
          screen: screen || "",

          // Modular Google Apps Script properties (writes to Website Enquiries tab)
          sheet: targetSheet,
          sheetName: targetSheet,
          table: targetSheet,
          event: "website_enquiry",
          submissionId,
          "Submission ID": submissionId,
          leadId: submissionId,
          "Lead ID": submissionId,
          timestamp,
          Timestamp: timestamp,
          createdAt: timestamp,
          "Created At": timestamp,
          fullName: leadName,
          "Full Name": leadName,
          emailAddress: leadEmail,
          "Email Address": leadEmail,
          phoneNumber: leadPhone || "Not Provided",
          "Phone Number": leadPhone || "Not Provided",
          companyName: leadCompany || "Not Specified",
          "Company Name": leadCompany || "Not Specified",
          productServiceInterest: leadProduct || leadTopic || "Industrial Robotics Consultation",
          "Product / Service Interest": leadProduct || leadTopic || "Industrial Robotics Consultation",
          requirementsMessage: `${leadRequirements || details || ""}${jiraTicketKey ? `\n\nJira Ticket: ${jiraTicketKey}` : ""}`,
          "Requirements / Message": `${leadRequirements || details || ""}${jiraTicketKey ? `\n\nJira Ticket: ${jiraTicketKey}` : ""}`,
          enquiryDetails: `${leadRequirements || details || ""}${jiraTicketKey ? `\n\nJira Ticket: ${jiraTicketKey}` : ""}`,
          "Enquiry Details": `${leadRequirements || details || ""}${jiraTicketKey ? `\n\nJira Ticket: ${jiraTicketKey}` : ""}`,
          leadSource: derivedLeadSource,
          "Lead Source": derivedLeadSource,
          isLinkedInReferral: isLinkedInReferral ? "Yes" : "No",
          "Is LinkedIn Referral": isLinkedInReferral ? "Yes" : "No",
          referrerUrl: referrer,
          "Referrer URL": referrer,
          landingPageUrl: url || page,
          "Landing Page URL": url || page,
          landingPage: url || page,
          "Landing Page": url || page,
          campaign: utmCampaign || "",
          "Campaign": utmCampaign || "",
          utmSource,
          "UTM Source": utmSource,
          utmMedium,
          "UTM Medium": utmMedium,
          utmCampaign,
          "UTM Campaign": utmCampaign,
          utmContent,
          "UTM Content": utmContent,
          utmTerm,
          "UTM Term": utmTerm,
          jiraTicketKey: jiraTicketKey || "",
          "Jira Ticket Key": jiraTicketKey || "",
          jiraIssueKey: jiraTicketKey || "",
          "Jira Issue Key": jiraTicketKey || "",
          jiraIssueUrl: jiraTicketKey
            ? `https://${process.env.JIRA_DOMAIN || "srilakshanaint2027g3-1790324760192.atlassian.net"}/browse/${jiraTicketKey}`
            : "",
          "Jira Issue URL": jiraTicketKey
            ? `https://${process.env.JIRA_DOMAIN || "srilakshanaint2027g3-1790324760192.atlassian.net"}/browse/${jiraTicketKey}`
            : "",
          jiraSyncStatus: jiraTicketKey ? "SUCCESS" : "FAILED",
          "Jira Sync Status": jiraTicketKey ? "SUCCESS" : "FAILED",
          leadStatus: "New Lead",
          "Lead Status": "New Lead",
          jiraKey: jiraTicketKey || "",
          syncedAt: timestamp,
          "Synced At": timestamp,
          lastUpdated: timestamp,
          "Last Updated": timestamp,
          spreadsheetId:
            process.env.GOOGLE_SPREADSHEET_ID || "1S-ApP83X9Y1-nXwim0tDNGn72wuhVn4PSbaWkcXlH48",
        };

        const enquiryRes = await fetch(GOOGLE_APPS_SCRIPT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(enquiryPayload),
          signal: AbortSignal.timeout(3500),
        });

        if (enquiryRes.ok) {
          destinations.googleSheet = true;
        }

        // If LinkedIn referral detected, also mirror lead to Leads tab and log to Sync Logs
        if (isLinkedInReferral) {
          const leadsPayload = {
            sheet: "Leads",
            sheetName: "Leads",
            table: "Leads",
            leadId: submissionId,
            "Lead ID": submissionId,
            submittedAt: timestamp,
            "Submitted At": timestamp,
            fullName: leadName,
            "Full Name": leadName,
            emailAddress: leadEmail,
            "Email Address": leadEmail,
            phoneNumber: leadPhone || "Not Provided",
            "Phone Number": leadPhone || "Not Provided",
            companyName: leadCompany || "Not Specified",
            "Company Name": leadCompany || "Not Specified",
            jobTitle: leadType || "Engineering Enquiry",
            "Job Title": leadType || "Engineering Enquiry",
            formName: payload.form || leadType || "Website Contact Form",
            "Form Name": payload.form || leadType || "Website Contact Form",
            formId: "engineering-enquiry",
            "Form ID": "engineering-enquiry",
            campaignName: utmCampaign || "engineering_future",
            "Campaign Name": utmCampaign || "engineering_future",
            creativeId: utmContent || "activity_7515805418544091136",
            "Creative ID": utmContent || "activity_7515805418544091136",
            leadStatus: "New Lead",
            "Lead Status": "New Lead",
            syncedAt: timestamp,
            "Synced At": timestamp,
            spreadsheetId:
              process.env.GOOGLE_SPREADSHEET_ID || "1S-ApP83X9Y1-nXwim0tDNGn72wuhVn4PSbaWkcXlH48",
          };

          await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(leadsPayload),
            signal: AbortSignal.timeout(3000),
          }).catch(() => {});

          const syncLogPayload = {
            sheet: "Sync Logs",
            table: "Sync Logs",
            logId: `log_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            timestamp,
            Timestamp: timestamp,
            service: "Website Enquiry Attribution",
            "Service / Module": "Website Enquiry Attribution",
            action: "LinkedIn Attributed Lead",
            "Action / Trigger": "LinkedIn Attributed Lead",
            status: "SUCCESS",
            Status: "SUCCESS",
            recordsProcessed: "1",
            "Records Processed": "1",
            details: `Captured website lead via ${derivedLeadSource}: ${leadName} (${leadEmail}) [Campaign: ${utmCampaign || "none"}, Creative: ${utmContent || "none"}, Page: ${page}]`,
            "Details / Error Message": `Captured website lead via ${derivedLeadSource}: ${leadName} (${leadEmail}) [Campaign: ${utmCampaign || "none"}, Creative: ${utmContent || "none"}, Page: ${page}]`,
            durationMs: 0,
            "Duration (ms)": 0,
            triggerSource: "FORM",
            "Trigger Source": "FORM",
            spreadsheetId:
              process.env.GOOGLE_SPREADSHEET_ID || "1S-ApP83X9Y1-nXwim0tDNGn72wuhVn4PSbaWkcXlH48",
          };

          await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(syncLogPayload),
            signal: AbortSignal.timeout(3000),
          }).catch(() => {});
        }
      } catch {
        // Non-blocking transmission error
      }
    }

    // 4. Airtable Integration (if configured)
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
        if (leadQuantity) fields.Quantity = leadQuantity;
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
      GOOGLE_APPS_SCRIPT_URL ||
        (AIRTABLE_TOKEN && AIRTABLE_BASE_ID) ||
        process.env.JIRA_API_TOKEN ||
        process.env.TELEGRAM_BOT_TOKEN,
    );
    const anyDestinationSucceeded =
      destinations.googleSheet ||
      destinations.airtable ||
      destinations.jira ||
      destinations.telegram;

    if (anyDestinationConfigured && !anyDestinationSucceeded) {
      return res.status(502).json({
        success: false,
        recorded: false,
        message: "Configured telemetry destinations could not be reached",
      });
    }

    if (isExplicitLead && !jiraTicketKey && !payload.skipJira && process.env.JIRA_API_TOKEN) {
      return res.status(502).json({
        success: false,
        recorded: false,
        error: "Lead enquiry received, but Jira ticket creation was not confirmed.",
      });
    }

    return res.status(200).json({
      success: true,
      recorded: anyDestinationSucceeded,
      sessionId,
      ...(jiraTicketKey ? { jiraKey: jiraTicketKey, issueKey: jiraTicketKey } : {}),
      telegramNotified: destinations.telegram,
    });
  } catch {
    return res.status(500).json({
      success: false,
      recorded: false,
      error: "Internal server error",
    });
  }
}
