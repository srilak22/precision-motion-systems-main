const TABLE_IDS = {
  page_view: "Page Views",
  click: "Clicks",
  cta_click: "CTA Interactions",
  lead: "Leads",
  form_submit: "Form Submissions",
  download: "Downloads",
  search: "Search Activity",
  navigation: "Navigation",
  whatsapp_click: "WhatsApp Enquiries",
  product_view: "Product Interest",
  product_action: "Product Interest",
  utm_visit: "UTM Campaigns",
  error: "Errors",
  scroll: "Scroll & Engagement",
  engagement: "Scroll & Engagement",
  session_start: "Website Sessions",
};

// Standardize device for select fields
function getSimpleDevice(deviceStr = "") {
  const str = String(deviceStr).toLowerCase();
  if (str.includes("mobile") || str.includes("iphone") || str.includes("android")) return "Mobile";
  if (str.includes("tablet") || str.includes("ipad")) return "Tablet";
  return "Desktop";
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  try {
    const {
      AIRTABLE_TOKEN,
      AIRTABLE_BASE_ID,
      AIRTABLE_TABLE_ID,
    } = process.env;

    const p = req.method === "POST"
      ? req.body || {}
      : req.query || {};

    const event = p.event || "page_view";
    const timestamp = new Date().toISOString();
    const sessionId = p.session || p.sessionId || `sess_${Date.now()}`;
    const page = p.page || "/";
    const url = p.url || "";
    const rawDevice = p.device || "Desktop";
    const simpleDevice = getSimpleDevice(rawDevice);
    const browser = p.browser || "Unknown";
    const operatingSystem = p.operatingSystem || "Unknown";
    const screen = p.screen || p.screen_resolution || "";
    const referrer = p.referrer !== undefined ? p.referrer : "";
    const element = p.element || "";
    const details = p.details || "";

    // 5-Layer Intelligence Attributes (Extract from payload or Vercel edge headers)
    const headerCountry = req.headers ? (req.headers["cf-ipcountry"] || req.headers["x-vercel-ip-country"] || req.headers["x-country"]) : null;
    const headerRegion = req.headers ? (req.headers["cf-region"] || req.headers["x-vercel-ip-country-region"]) : null;
    const headerCity = req.headers ? (req.headers["cf-ipcity"] || req.headers["x-vercel-ip-city"]) : null;
    const headerTimezone = req.headers ? (req.headers["x-vercel-ip-timezone"] || req.headers["cf-timezone"]) : null;
    const clientIp = req.headers ? (req.headers["x-real-ip"] || (req.headers["x-forwarded-for"] || "").split(",")[0].trim()) : "";

    const country = p.country || headerCountry || "Unknown Country";
    const region = p.region || headerRegion || "";
    const city = p.city || headerCity || "";
    const timezone = p.timezone || headerTimezone || "UTC";
    const localHour = p.localHour !== undefined ? p.localHour : new Date().getUTCHours();
    const trafficType = p.trafficType || p.trafficChannel || "Direct";
    const trafficSource = p.trafficSource || p.utmSource || (trafficType === "Direct" ? "direct" : "unknown");
    const trafficMedium = p.trafficMedium || p.utmMedium || (trafficType === "Direct" ? "none" : "unknown");
    const utmSource = p.utmSource || "";
    const utmMedium = p.utmMedium || "";
    const utmCampaign = p.utmCampaign || "";
    const utmTerm = p.utmTerm || "";
    const utmContent = p.utmContent || "";
    const networkType = p.networkType || "Broadband";
    const organization = p.organization || "";
    const ip = p.ip || clientIp || "";
    const maskedIp = p.maskedIp || (ip ? ip.replace(/\.\d+$/, ".xxx") : "anonymized");

    // Forward to Google Apps Script & Google Sheet (Awaited for reliability on serverless)
    const GOOGLE_APPS_SCRIPT_URL =
      process.env.GOOGLE_APPS_SCRIPT_URL ||
      "https://script.google.com/macros/s/AKfycbw8NhfkPJGeYu4NAaisxN3FHaWmAVlZTmEO2x1CsBirRPvt5pQjI5zNv3qVXqEA2W1a/exec";

    if (!p.skipAppsScript) {
      try {
        await fetch(GOOGLE_APPS_SCRIPT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
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
            operating_system: operatingSystem,
            Screen: screen,
            "Screen Resolution": screen,
            element,
            details,
          // Geo Intelligence
          country,
          region,
          city,
          timezone,
          localHour,
          // Traffic & UTM Intelligence
          trafficType,
          trafficChannel: trafficType,
          trafficSource,
          trafficMedium,
          utmSource,
          utmMedium,
          utmCampaign,
          utmTerm,
          utmContent,
          "Traffic Type": trafficType,
          "traffic_type": trafficType,
          "Traffic Source": trafficSource,
          "traffic_source": trafficSource,
          "Traffic Medium": trafficMedium,
          "traffic_medium": trafficMedium,
          "UTM Source": utmSource,
          "utm_source": utmSource,
          "UTM Medium": utmMedium,
          "utm_medium": utmMedium,
          "UTM Campaign": utmCampaign,
          "utm_campaign": utmCampaign,
          "UTM Term": utmTerm,
          "utm_term": utmTerm,
          "UTM Content": utmContent,
          "utm_content": utmContent,
          Referrer: referrer,
          // IP & Network Intelligence
          ip,
          maskedIp,
          networkType,
          organization,
          networkRiskSignal: p.networkRiskSignal || "Low Risk",
          // Direct Fields for Google Sheets Column Matching
          "Traffic Analysis": p["Traffic Analysis"] || p.trafficAnalysis || `${trafficType} Traffic (${trafficSource}) - ${country || "Global"} visitor on ${page}`,
          "traffic analysis": p["traffic analysis"] || p.trafficAnalysis || `${trafficType} Traffic (${trafficSource})`,
          "traffic_analysis": p.traffic_analysis || p.trafficAnalysis || `${trafficType} Traffic (${trafficSource})`,
          trafficAnalysis: p.trafficAnalysis || `${trafficType} Traffic (${trafficSource})`,

          "Traffic Intelligence": p["Traffic Intelligence"] || p.trafficIntelligence || `Channel: ${trafficType} | Source: ${trafficSource} | Medium: ${trafficMedium} | Campaign: ${utmCampaign || "none"}`,
          "traffic intelligence": p["traffic intelligence"] || p.trafficIntelligence || `Channel: ${trafficType} | Source: ${trafficSource}`,
          "traffic_intelligence": p.traffic_intelligence || p.trafficIntelligence,
          trafficIntelligence: p.trafficIntelligence || `Channel: ${trafficType} | Source: ${trafficSource}`,

          IP: ip,
          "IP Address": ip,
          ip_address: ip,
          Timestamp: timestamp,
          "Time Stamp": timestamp,
          "Date & Time": timestamp,
          timestapm: timestamp,
          TIMESTAPM: timestamp,

          // Form / Lead attributes
          name: p.name,
          email: p.email,
          phone: p.phone,
          company: p.company,
          product: p.product,
          requirements: details || p.requirements,
          spreadsheetId: "1fHcRuJnK-tF2PwcrXuVl4K_FN8Sy1dI7gtSmEVZqbEc",
          sheetGid: "2025481644",
          spreadsheetUrl: "https://docs.google.com/spreadsheets/d/1fHcRuJnK-tF2PwcrXuVl4K_FN8Sy1dI7gtSmEVZqbEc/edit?gid=2025481644#gid=2025481644",
        }),
        signal: AbortSignal.timeout(3500),
      });
    } catch (e) {
      console.error("Google Apps Script transmission error:", e);
    }

    // Automated Jira Lead Pipeline
    let jiraTicketKey = p.jiraIssueKey || null;
    const isLeadEvent =
      event === "lead" || event === "form_submit" || event === "form_submission";
    const hasContact = Boolean(p.name || p.email || p.phone);

    if (isLeadEvent && hasContact && !p.skipJira && !p.jiraIssueKey) {
      const JIRA_DOMAIN = process.env.JIRA_DOMAIN || "trustworkz.atlassian.net";
      const JIRA_EMAIL = process.env.JIRA_EMAIL || "srilakshana.int2027g3@gmail.com";
      const JIRA_API_TOKEN =
        process.env.JIRA_API_TOKEN ||
        "ATATT3xFfGF0tRU57QBkOUdnSD1oS9EuD7Iyjzu5kGpoB5rXcQ-XTj24SVG1y6nqoFF7QzSF7YJP0M1kShwlUF7WvXcb1fjeluZ3T5GhbKxrDa5hcXFOgH3ljSHGTrrhc0-_eRfhWjCcZFyrqddWw4jHlpfPw_lOOhpkG4qKnm-KKY1CoiAWlb4=D7806C85";
      const JIRA_PROJECT_KEY = process.env.JIRA_PROJECT_KEY || "DI";
      const JIRA_ASSIGNEE_ID =
        process.env.JIRA_ASSIGNEE_ID || "712020:90b59131-da57-4b30-9614-6891eff382e6";

      if (JIRA_DOMAIN && JIRA_EMAIL && JIRA_API_TOKEN) {
        try {
          const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString("base64");
          const formTitle = p.form || element || "Web Lead";
          const summary = `Automated Lead (${formTitle}): ${p.name || "Anonymous"} ${p.company ? `(${p.company})` : ""}`.slice(0, 250);

          const desc = `
==================================================
AUTOMATED WEBSITE LEAD INTAKE (TELEMETRY PIPELINE)
==================================================

CONTACT INFORMATION:
• Full Name: ${p.name || "N/A"}
• Company: ${p.company || "N/A"}
• Email: ${p.email || "N/A"}
• Phone: ${p.phone || "N/A"}

ENQUIRY CONTEXT:
• Form / Channel: ${formTitle} (${event})
• Product Focus: ${p.product || "General Precision Motion Systems"}
• Page URL: ${url || page}
• Referrer: ${referrer}

SPECIFICATIONS & MESSAGE:
${details || p.requirements || "Telemetry form submission."}

VISITOR & NETWORK INTELLIGENCE:
• Geographic Location: ${city ? `${city}, ` : ""}${region ? `${region}, ` : ""}${country || "Global"}
• Organization / Network: ${organization || "Broadband"}
• Device / Resolution: ${simpleDevice} (${screen || "N/A"})
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
            console.log(`Automated Jira lead task created: ${jiraTicketKey}`);
          }
        } catch (jiraErr) {
          console.error("Automated Jira lead creation error in /api/track:", jiraErr);
        }
      }
    }

    if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID) {
      return res.status(200).json({
        success: true,
        recorded: true,
        message: "Telemetry recorded in Google Sheet & Jira",
        sessionId,
        jiraKey: jiraTicketKey,
      });
    }

    // 1. Try to record into event-specific table
    const targetTableName = TABLE_IDS[event] || "Website Activity";
    let fields = {};

    if (targetTableName === "Page Views") {
      fields = {
        "Session ID": sessionId,
        Page: page,
        "Page Title": details || page,
        URL: url,
        Referrer: referrer,
        Device: rawDevice,
        "Screen Size": screen,
        Timestamp: timestamp,
      };
      if (p.browser) fields.Browser = p.browser;
      if (p.source) fields["UTM Source"] = p.source;
      if (p.medium) fields["UTM Medium"] = p.medium;
      if (p.campaign) fields["UTM Campaign"] = p.campaign;
    } else if (targetTableName === "Form Submissions") {
      fields = {
        "Session ID": sessionId,
        "Form Name": p.form || element || "Contact Form",
        Page: page,
        URL: url,
        "Submission Status": "Success",
        Device: rawDevice,
        Timestamp: timestamp,
      };
      if (p.name) fields.Name = p.name;
      if (p.email) fields.Email = p.email;
      if (p.phone) fields.Phone = p.phone;
      if (p.company) fields.Company = p.company;
      if (p.product) fields.Product = p.product;
      if (details) fields.Requirement = details;
    } else if (targetTableName === "Downloads") {
      fields = {
        "Session ID": sessionId,
        "File Name": p.file || element || "Spec Sheet",
        "File Type": "PDF",
        Page: page,
        URL: url,
        Device: rawDevice,
        Timestamp: timestamp,
      };
      if (p.product) fields.Product = p.product;
    } else if (targetTableName === "WhatsApp Enquiries") {
      fields = {
        "Session ID": sessionId,
        Page: page,
        "Button Name": element || "WhatsApp Chat",
        Device: rawDevice,
        Referrer: referrer,
        Timestamp: timestamp,
      };
      if (p.cta || details) fields.CTA = p.cta || details;
      if (p.product) fields.Product = p.product;
    } else if (targetTableName === "Clicks") {
      fields = {
        "Session ID": sessionId,
        Page: page,
        URL: url,
        Element: element,
        "Element Text": details,
        "Click Type": event,
        Details: details,
        Device: rawDevice,
        "Screen Size": screen,
        Timestamp: timestamp,
      };
    } else {
      // Default: Website Activity
      fields = {
        Name: `${event} - ${page}`,
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

    // Call Airtable API for target table
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(targetTableName)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AIRTABLE_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fields }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.warn(`Airtable write to "${targetTableName}" failed (${response.status}), falling back to "Website Activity"...`, data);

      // Fallback: Always write to Website Activity table (tbl6BUkalN1cSOAny)
      const fallbackFields = {
        Name: `${event} - ${page}`,
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

      const fallbackTable = AIRTABLE_TABLE_ID || "tbl6BUkalN1cSOAny";
      const fallbackResponse = await fetch(
        `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(fallbackTable)}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${AIRTABLE_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fields: fallbackFields }),
        }
      );

      const fallbackData = await fallbackResponse.json();
      if (!fallbackResponse.ok) {
        console.error("Airtable fallback error:", fallbackData);
        return res.status(fallbackResponse.status).json({
          success: false,
          error: fallbackData,
        });
      }

      return res.status(200).json({
        success: true,
        event,
        table: fallbackTable,
        recordId: fallbackData.id,
      });
    }

    return res.status(200).json({
      success: true,
      event,
      table: targetTableName,
      recordId: data.id,
    });
  } catch (error) {
    console.error("Tracking handler error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
