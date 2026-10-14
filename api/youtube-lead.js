// INDUS YouTube Lead Generation Endpoint (api/youtube-lead.js)
// Dedicated serverless intake strictly isolated from website telemetry & DI pipeline.
// Target Jira Project: YLT (configured via YOUTUBE_JIRA_PROJECT_KEY, defaults to YLT).

import { sendTelegramNotification } from "./_lib/telegram.js";

// Rate limit sliding window tracker (5 per minute per IP)
const youtubeIpRateLimits = new Map();

// Dedicated deduplication cache (60s sliding window)
const youtubeLeadDeduplication = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 60_000;
  const maxRequests = 5;
  const key = `yt_lead:${ip}`;

  if (youtubeIpRateLimits.size > 2000) {
    for (const [k, v] of youtubeIpRateLimits.entries()) {
      if (now - v.startTime > windowMs) {
        youtubeIpRateLimits.delete(k);
      }
    }
  }

  const record = youtubeIpRateLimits.get(key);
  if (!record || now - record.startTime > windowMs) {
    youtubeIpRateLimits.set(key, { startTime: now, count: 1 });
    return false;
  }

  record.count += 1;
  return record.count > maxRequests;
}

function checkAndRecordYouTubeDeduplication(ip, email, name) {
  const now = Date.now();
  const hashKey = `${ip}|${(email || "").toLowerCase()}|${(name || "").toLowerCase()}`;

  // Purge expired hashes (60s sliding window)
  for (const [k, record] of youtubeLeadDeduplication.entries()) {
    const ts = typeof record === "object" ? record.timestamp : record;
    if (now - ts > 60_000) {
      youtubeLeadDeduplication.delete(k);
    }
  }

  if (youtubeLeadDeduplication.has(hashKey)) {
    const record = youtubeLeadDeduplication.get(hashKey);
    return {
      isDuplicate: true,
      issueKey: typeof record === "object" ? record.issueKey : null,
    };
  }

  youtubeLeadDeduplication.set(hashKey, { timestamp: now, issueKey: null });
  return { isDuplicate: false, issueKey: null };
}

function updateYouTubeDeduplicationKey(ip, email, name, issueKey) {
  const hashKey = `${ip}|${(email || "").toLowerCase()}|${(name || "").toLowerCase()}`;
  const record = youtubeLeadDeduplication.get(hashKey);
  if (record && typeof record === "object") {
    record.issueKey = issueKey;
  }
}

// Origin validation
function isOriginAllowed(origin) {
  if (!origin) return true;
  const allowed = [
    "https://precision-motion-systems-main.vercel.app",
    "http://localhost:8080",
    "http://localhost:3000",
    "http://127.0.0.1:8080",
    "http://127.0.0.1:3000",
  ];
  if (allowed.includes(origin)) return true;
  if (/^https:\/\/precision-motion-systems-[a-zA-Z0-9_-]+\.vercel\.app$/.test(origin)) {
    return true;
  }
  return false;
}

function sanitizeField(input, maxLength) {
  if (typeof input !== "string") return "";
  const clean = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").trim();
  return clean.slice(0, maxLength);
}

function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
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

    // Bot honeypot detection
    if (payload._hp || payload.honeypot || payload.website_url || payload.company_fax) {
      return res.status(200).json({ success: true, recorded: true, deduplicated: true });
    }

    // Rate limiting
    if (isRateLimited(clientIp)) {
      return res.status(429).json({
        success: false,
        error: "Too Many Requests. Rate limit exceeded.",
      });
    }

    // Sanitize lead contact fields
    const leadName = sanitizeField(payload.name, 100);
    const leadEmail = sanitizeField(payload.email, 254);
    const leadPhone = sanitizeField(payload.phone, 30);
    const leadCompany = sanitizeField(payload.company, 100);
    const productInterest = sanitizeField(payload.productInterest || payload.product, 150);
    const estimatedBudget = sanitizeField(payload.estimatedBudget, 80);
    const timeline = sanitizeField(payload.timeline, 80);
    const leadRequirements = sanitizeField(
      payload.requirements || payload.details || payload.message || "",
      3000,
    );
    const leadTopic = sanitizeField(payload.topic, 150);
    const preferredContact = sanitizeField(payload.preferredContact, 50);

    // Validation
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

    // Extract YouTube attribution metadata
    const attr =
      payload.attribution && typeof payload.attribution === "object" ? payload.attribution : {};

    const videoId = sanitizeField(attr.videoId || payload.videoId || payload.v, 50);
    const channelId = sanitizeField(attr.channelId || payload.channelId, 100);
    const campaign = sanitizeField(attr.campaign || attr.utmCampaign || payload.campaign, 100);
    const adGroup = sanitizeField(attr.adGroup || payload.adGroup, 100);
    const utmSource = sanitizeField(attr.utmSource || payload.utmSource || "youtube", 80);
    const utmMedium = sanitizeField(attr.utmMedium || payload.utmMedium || "video", 80);
    const utmContent = sanitizeField(attr.utmContent || payload.utmContent, 100);
    const utmTerm = sanitizeField(attr.utmTerm || payload.utmTerm, 100);
    const referrer = sanitizeField(attr.referrer || req.headers?.referer || "", 500);
    const landingPage = sanitizeField(attr.landingPage || payload.page || "/", 300);

    // Isolated Deduplication Check
    const dedupeResult = checkAndRecordYouTubeDeduplication(clientIp, leadEmail, leadName);
    if (dedupeResult.isDuplicate) {
      return res.status(200).json({
        success: true,
        duplicate: true,
        recorded: true,
        projectKey: process.env.YOUTUBE_JIRA_PROJECT_KEY || "YLT",
        ...(dedupeResult.issueKey
          ? { jiraKey: dedupeResult.issueKey, issueKey: dedupeResult.issueKey }
          : {}),
        message:
          "YouTube enquiry already received. Our engineering team will review your specifications shortly.",
      });
    }

    // Target Jira Project Key — strictly isolated from DI
    const targetProjectKey = (process.env.YOUTUBE_JIRA_PROJECT_KEY || "YLT").trim();

    if (targetProjectKey === "DI") {
      console.error("Safety Violation: YouTube lead attempted to route to DI project key!");
      return res.status(500).json({
        success: false,
        error:
          "Configuration Error: YouTube leads are strictly isolated and must not target project DI.",
      });
    }

    const JIRA_DOMAIN = process.env.JIRA_DOMAIN ? process.env.JIRA_DOMAIN.trim() : "";
    const JIRA_EMAIL = process.env.JIRA_EMAIL ? process.env.JIRA_EMAIL.trim() : "";
    const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN ? process.env.JIRA_API_TOKEN.trim() : "";
    const JIRA_ASSIGNEE_ID = (
      process.env.YOUTUBE_JIRA_ASSIGNEE_ID ||
      process.env.JIRA_ASSIGNEE_ID ||
      "712020:90b59131-da57-4b30-9614-6891eff382e6"
    ).trim();

    if (!JIRA_DOMAIN || !JIRA_EMAIL || !JIRA_API_TOKEN) {
      console.error("Jira credentials missing for YouTube lead intake.");
      return res.status(503).json({
        success: false,
        error: "Jira lead integration is temporarily unconfigured on the server.",
      });
    }

    const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString("base64");
    const summary =
      `[YouTube Lead] ${leadName}${leadCompany ? ` (${leadCompany})` : ""}${campaign ? ` [${campaign}]` : ""}`.slice(
        0,
        250,
      );
    const timestamp = new Date().toISOString();

    const desc = `
==================================================
YOUTUBE CAMPAIGN LEAD INTAKE (YLT DEALFLOW)
==================================================

CONTACT INFORMATION:
• Full Name: ${leadName}
• Company: ${leadCompany || "Individual / Not Provided"}
• Email: ${leadEmail}
• Phone: ${leadPhone || "N/A"}
${preferredContact ? `• Preferred Contact Method: ${preferredContact}\n` : ""}
YOUTUBE ATTRIBUTION:
• Video ID: ${videoId || "Not Captured / Channel Landing"}
• Channel / Handle: ${channelId || "INDUS Robotics Official"}
• Campaign Name: ${campaign || "Organic / Unassigned"}
• Ad Group: ${adGroup || "N/A"}
• Traffic Source: ${utmSource}
• Traffic Medium: ${utmMedium}
${utmContent ? `• Ad Content / Link: ${utmContent}\n` : ""}${utmTerm ? `• Search Term: ${utmTerm}\n` : ""}• Initial Referrer: ${referrer || "Direct / YouTube App"}
• Landing Page: ${landingPage}

PROJECT & COMMERCIAL REQUIREMENTS:
• Product / Focus: ${productInterest || leadTopic || "General Motion Systems"}
• Estimated Budget: ${estimatedBudget || "Unspecified"}
• Timeline: ${timeline || "Immediate / Evaluation"}

SPECIFICATIONS & MESSAGE:
${leadRequirements || "Lead generated via YouTube channel enquiry."}

--------------------------------------------------
Origin: INDUS YouTube Lead Integration
Target Project: ${targetProjectKey}
Client IP: ${clientIp ? clientIp.replace(/\.\d+$/, ".xxx") : "anonymized"}
Timestamp: ${timestamp}
    `.trim();

    const baseLabels = ["youtube-lead", "video-attribution", "dealflow-ylt"];
    if (videoId) baseLabels.push(`yt-vid-${videoId.slice(0, 15)}`);
    if (campaign) {
      baseLabels.push(
        `yt-camp-${campaign
          .toLowerCase()
          .replace(/[^a-z0-9-_]/g, "-")
          .slice(0, 20)}`,
      );
    }

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
        project: { key: targetProjectKey },
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
      const jiraTicketKey = jiraData.key;
      updateYouTubeDeduplicationKey(clientIp, leadEmail, leadName, jiraTicketKey);

      // ── Dedicated Google Sheets forwarding to "YouTube Leads" tab (non-blocking) ──
      let googleSheetRecorded = false;
      const GOOGLE_APPS_SCRIPT_URL =
        process.env.GOOGLE_APPS_SCRIPT_URL ||
        (process.env.NODE_ENV !== "test"
          ? "https://script.google.com/macros/s/AKfycbyO4AzoxaoBU99WFQUDNbRV-4r6UmBTLPSsgeZiCS4T2AyObnUfNcYhLv-gcVnAMYgRKg/exec"
          : null);

      if (GOOGLE_APPS_SCRIPT_URL) {
        try {
          const leadId = `sub_yt_${Date.now()}`;
          const sourceVideo = videoId
            ? videoId.startsWith("http")
              ? videoId
              : `https://youtu.be/${videoId}`
            : "N/A";
          const sourceCommentOrEnquiryUrl =
            referrer || landingPage || (req.headers ? req.headers.referer : "") || "/";
          const contactDetails = `${leadName} <${leadEmail}>${leadPhone ? `, Phone: ${leadPhone}` : ""}${leadCompany ? `, Company: ${leadCompany}` : ""}`;

          const gasPayload = {
            // Strictly target the dedicated YouTube Leads tab
            sheet: "YouTube Leads",
            sheetName: "YouTube Leads",
            table: "YouTube Leads",
            event: "youtube_lead",
            eventType: "youtube_lead",
            timestamp,
            Timestamp: timestamp,
            // Phase 2 Required Schema Fields for YouTube Leads
            leadId,
            "Lead ID": leadId,
            sourceVideo,
            "Source Video": sourceVideo,
            sourceCommentOrEnquiryUrl,
            "Source Comment or Enquiry URL": sourceCommentOrEnquiryUrl,
            "Enquiry URL": sourceCommentOrEnquiryUrl,
            contactDetails,
            "Contact Details": contactDetails,
            leadType: "YouTube Website Lead",
            "Lead Type": "YouTube Website Lead",
            type: "YouTube Lead",
            status: "New",
            Status: "New",
            creationTime: timestamp,
            "Creation Time": timestamp,
            jiraIssueKey: jiraTicketKey,
            "Jira Issue Key": jiraTicketKey,
            jiraKey: jiraTicketKey,
            "Jira Key": jiraTicketKey,
            issueKey: jiraTicketKey,
            // Granular contact fields for standard spreadsheet column mapping
            name: leadName,
            Name: leadName,
            email: leadEmail,
            Email: leadEmail,
            phone: leadPhone || "N/A",
            Phone: leadPhone || "N/A",
            company: leadCompany || "N/A",
            Company: leadCompany || "N/A",
            product: productInterest || leadTopic || "General Motion Systems",
            Product: productInterest || leadTopic || "General Motion Systems",
            estimatedBudget: estimatedBudget || "Unspecified",
            timeline: timeline || "Immediate / Evaluation",
            requirements: leadRequirements || "YouTube channel enquiry",
            Requirement: leadRequirements || "YouTube channel enquiry",
            details: leadRequirements || "YouTube channel enquiry",
            form: "YouTube Lead Enquiry",
            "Form Name": "YouTube Lead Enquiry",
            "Form ID": "youtube-lead",
            source: "YouTube",
            trafficSource: "youtube",
            trafficChannel: "YouTube Campaign",
            trafficType: "YouTube Campaign",
            utmSource,
            utmMedium,
            utmCampaign: campaign || "Organic",
            utmContent: utmContent || "",
            utmTerm: utmTerm || "",
            videoId: videoId || "N/A",
            channelId: channelId || "INDUS Robotics Official",
            campaign: campaign || "Organic",
            adGroup: adGroup || "N/A",
            referrer: referrer || "Direct / YouTube App",
            Referrer: referrer || "Direct / YouTube App",
            page: landingPage,
            Page: landingPage,
            url: landingPage,
            URL: landingPage,
            projectKey: targetProjectKey,
            device: "N/A",
            Device: "N/A",
            maskedIp: clientIp ? clientIp.replace(/\.\d+$/, ".xxx") : "anonymized",
            preferredContact: preferredContact || "N/A",
            sessionId: `yt_${Date.now()}`,
            "Session ID": `yt_${Date.now()}`,
            submissionId: leadId,
            "Submission ID": leadId,
            "Submission Status": "Success",
            spreadsheetId:
              process.env.GOOGLE_SPREADSHEET_ID || "1S-ApP83X9Y1-nXwim0tDNGn72wuhVn4PSbaWkcXlH48",
            sheetGid: process.env.GOOGLE_SPREADSHEET_GID || "2025481644",
          };

          const gasRes = await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(gasPayload),
            signal: AbortSignal.timeout(3500),
          });

          if (gasRes.ok) {
            googleSheetRecorded = true;
          }
        } catch {
          // Google Sheets failure is non-blocking; Jira ticket was already created
        }
      }

      // ── Telegram Bot Lead Notification (non-blocking) ──
      let telegramNotified = false;
      try {
        const tgRes = await sendTelegramNotification({
          name: leadName,
          email: leadEmail,
          phone: leadPhone,
          company: leadCompany,
          interest: productInterest || leadTopic,
          requirement: leadRequirements,
          source: campaign ? `YouTube Campaign: ${campaign}` : "YouTube Lead",
          form: "YouTube Lead Enquiry",
          page: landingPage,
          timestamp,
          jiraKey: jiraTicketKey,
        });

        if (tgRes && tgRes.success) {
          telegramNotified = true;
        }
      } catch (tgErr) {
        console.error("[Telegram] YouTube lead notification error:", tgErr?.message || tgErr);
      }

      return res.status(200).json({
        success: true,
        recorded: true,
        projectKey: targetProjectKey,
        jiraKey: jiraTicketKey,
        issueKey: jiraTicketKey,
        googleSheetRecorded,
        telegramNotified,
        message: `YouTube lead successfully registered: ${jiraTicketKey}`,
      });
    } else {
      const jiraErrText = await jiraRes.text().catch(() => "");
      console.error(`Jira API returned non-OK status ${jiraRes.status}:`, jiraErrText);
      return res.status(502).json({
        success: false,
        error: `Failed to create Jira issue in project ${targetProjectKey}. Please check project setup.`,
      });
    }
  } catch (err) {
    console.error("YouTube lead request exception:", err);
    return res.status(500).json({
      success: false,
      error: "Internal server error processing YouTube lead enquiry.",
    });
  }
}
