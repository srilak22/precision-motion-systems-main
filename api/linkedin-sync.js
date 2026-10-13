// INDUS Industrial Robotics — LinkedIn Synchronization & Lead Activity Endpoint
// GET /api/linkedin-sync  — status report / cron trigger
// POST /api/linkedin-sync — manual sync, test triggers, or lead webhook receiver

import {
  runLinkedInSync,
  resolveLinkedInCredentials,
  recordLeadToGoogleSheets,
  recordPostsToGoogleSheets,
  recordSyncLogToGoogleSheets,
  COMPANY_PAGE_URL,
  REQUIRED_SHEET_TABS,
} from "./lib/linkedin-sync.js";

function isAuthorized(req) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) return true; // Internal or unconfigured webhook permitted

  const authHeader = req.headers ? req.headers.authorization || "" : "";
  if (authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7).trim() === secret.trim();
  }

  const customKey = req.headers ? req.headers["x-sync-secret"] : "";
  if (customKey && customKey.trim() === secret.trim()) {
    return true;
  }

  return false;
}

export default async function handler(req, res) {
  // CORS & Preflight handling
  const origin = req.headers ? req.headers.origin || "" : "";
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-sync-secret");
  }

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // GET: Health / Status inspection endpoint or Cron execution
  if (req.method === "GET") {
    const isCron = Boolean(
      (req.query && (req.query.cron === "1" || req.query.trigger === "sync")) ||
        req.headers["x-vercel-cron"],
    );

    if (isCron) {
      try {
        const syncResult = await runLinkedInSync({ isCron: true });
        return res.status(200).json(syncResult);
      } catch (err) {
        return res.status(500).json({
          success: false,
          error: err instanceof Error ? err.message : "Cron execution failed",
        });
      }
    }

    const creds = resolveLinkedInCredentials();
    const isConfigured = creds.hasAccessToken || creds.hasRefreshToken;

    return res.status(200).json({
      success: true,
      service: "INDUS LinkedIn Activity Tracking & Analytics Engine",
      companyPageUrl: COMPANY_PAGE_URL,
      status: isConfigured ? "Configured & Ready" : "Awaiting Channel Authorization",
      credentials: {
        oauthConfigured: creds.hasClientId,
        accessTokenConfigured: creds.hasAccessToken,
        refreshTokenConfigured: creds.hasRefreshToken,
        organizationIdConfigured: creds.hasOrgId,
        adAccountIdConfigured: creds.hasAdAccountId,
      },
      configuredTabs: REQUIRED_SHEET_TABS,
      authorizationUrl: "/api/auth/linkedin/start",
      docs: {
        note: "To authorize company tracking, visit /api/auth/linkedin/start in your browser.",
        supportedActions: ["sync", "lead_gen", "test_lead", "test_post", "test_enquiry"],
      },
    });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST, OPTIONS");
    return res.status(405).json({
      success: false,
      error: "Method Not Allowed. Only GET and POST are supported.",
    });
  }

  if (!isAuthorized(req)) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized. Provide a valid Bearer token or x-sync-secret header.",
    });
  }

  try {
    let payload = req.body;
    if (typeof payload === "string") {
      try {
        payload = JSON.parse(payload);
      } catch {
        return res.status(400).json({ success: false, error: "Invalid JSON payload" });
      }
    }

    if (!payload || typeof payload !== "object") {
      return res.status(400).json({ success: false, error: "Body must be a JSON object" });
    }

    const action = String(payload.action || "sync").toLowerCase().trim();

    // 1. Full Synchronization Execution
    if (action === "sync") {
      const syncResult = await runLinkedInSync({
        forceSync: Boolean(payload.forceSync),
        triggerSource: "MANUAL",
      });

      return res.status(syncResult.success ? 200 : 207).json(syncResult);
    }

    // 2. LinkedIn Lead Gen Form Webhook Receiver
    if (action === "lead_gen" || action === "webhook") {
      const leadData = payload.data || payload.lead || payload;
      const recorded = await recordLeadToGoogleSheets(leadData);

      await recordSyncLogToGoogleSheets({
        service: "LinkedIn Lead Gen Forms",
        action: "Webhook Received",
        status: recorded ? "SUCCESS" : "ERROR",
        recordsProcessed: "1",
        details: `Received lead submission: ${leadData.fullName || leadData.name || "Lead"} (${leadData.email || "No email"})`,
        triggerSource: "WEBHOOK",
      });

      return res.status(recorded ? 200 : 502).json({
        success: recorded,
        message: recorded
          ? "LinkedIn Lead Gen Form response successfully recorded to Google Sheets."
          : "Failed to persist lead record to Google Sheets.",
      });
    }

    // 3. Manual Test Lead Trigger (End-to-end verification option)
    if (action === "test_lead") {
      const mockLead = {
        leadId: `test_lead_${Date.now()}`,
        submittedAt: new Date().toISOString(),
        fullName: payload.fullName || "Aditya Sharma (Test Lead)",
        email: payload.email || "aditya.sharma@example.com",
        phone: payload.phone || "+91 98765 43210",
        company: payload.company || "Precision Dynamics Ltd",
        jobTitle: payload.jobTitle || "Head of Automation",
        formName: payload.formName || "INDUS Industrial Robotics Sizing Inquiry",
        campaignName: payload.campaignName || "Precision Robotics Q4 Campaign",
        linkedinProfileUrl: "https://www.linkedin.com/in/test-lead",
        status: "Test Verified",
      };

      const recorded = await recordLeadToGoogleSheets(mockLead);
      return res.status(recorded ? 200 : 500).json({
        success: recorded,
        action: "test_lead",
        lead: mockLead,
        message: recorded
          ? "Test lead successfully recorded to Google Sheets 'Leads' tab."
          : "Failed to record test lead.",
      });
    }

    // 4. Manual Test Post Trigger
    if (action === "test_post") {
      const mockPost = [
        {
          postUrn: payload.postUrn || `urn:li:share:test_${Date.now()}`,
          postUrl: `https://www.linkedin.com/feed/update/urn:li:share:test_${Date.now()}`,
          author: "urn:li:organization:indus-industrial-robotics",
          publishedDate: new Date().toISOString(),
          content: payload.content || "INDUS SCARA & Delta Precision Motion Systems deployment update.",
          impressions: payload.impressions || 1250,
          uniqueImpressions: payload.uniqueImpressions || 980,
          reactions: payload.reactions || 84,
          comments: payload.comments || 16,
          shares: payload.shares || 12,
          clicks: payload.clicks || 142,
          engagementRate: "20.32%",
        },
      ];

      const count = await recordPostsToGoogleSheets(mockPost);
      return res.status(count > 0 ? 200 : 500).json({
        success: count > 0,
        action: "test_post",
        postsRecorded: count,
        message: count > 0
          ? "Test post metrics recorded to Google Sheets 'Posts' tab."
          : "Failed to record test post.",
      });
    }

    return res.status(400).json({
      success: false,
      error: `Unknown action: "${action}". Supported actions are: sync, lead_gen, test_lead, test_post.`,
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Internal error executing LinkedIn sync";
    return res.status(500).json({
      success: false,
      error: errorMsg,
    });
  }
}
