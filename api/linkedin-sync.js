// INDUS Industrial Robotics — LinkedIn Synchronization & Activity Engine
// GET /api/linkedin-sync             — status inspection
// GET /api/linkedin-sync?auth=start  — initiates OAuth 2.0 flow
// GET /api/linkedin-sync?code=...    — handles OAuth 2.0 callback and token delivery
// GET /api/linkedin-sync?cron=1      — scheduled sync execution
// POST /api/linkedin-sync            — manual sync, lead webhook, or test trigger

import {
  runLinkedInSync,
  resolveLinkedInCredentials,
  recordLeadToGoogleSheets,
  recordPostsToGoogleSheets,
  recordSyncLogToGoogleSheets,
  processLinkedInLead,
  COMPANY_PAGE_URL,
  REQUIRED_SHEET_TABS,
} from "./_lib/linkedin-sync.js";
import {
  generateOAuthState,
  validateOAuthState,
  buildAuthorizationUrl,
  exchangeCodeForTokens,
  DEFAULT_LINKEDIN_REDIRECT_URL,
} from "./_lib/linkedin-oauth.js";

function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader || typeof cookieHeader !== "string") return cookies;
  for (const part of cookieHeader.split(";")) {
    const [key, ...vals] = part.trim().split("=");
    if (key) {
      cookies[key.trim()] = decodeURIComponent(vals.join("=").trim());
    }
  }
  return cookies;
}

function renderHtmlResponse(
  res,
  statusCode,
  title,
  message,
  isSuccess = false,
  refreshToken = null,
  accessToken = null,
  extraHtml = "",
) {
  const brandColor = isSuccess ? "#0A66C2" : "#ef4444";
  const statusBadge = isSuccess ? "LINKEDIN AUTHORIZED" : "AUTHORIZATION FAILED";

  const tokenBoxHtml = (refreshToken || accessToken)
    ? `<div style="background: #1f2937; border: 1px solid #374151; border-radius: 8px; padding: 16px; margin: 0 0 20px 0; text-align: left;">
      <div style="font-size: 11px; text-transform: uppercase; color: #60a5fa; font-weight: bold; margin-bottom: 8px;">
        ${refreshToken ? "LinkedIn Refresh Token (Valid 365 Days):" : "LinkedIn Access Token (Valid 60 Days):"}
      </div>
      <div style="display: flex; gap: 8px;">
        <input type="text" id="rtInput" value="${refreshToken || accessToken}" readonly style="flex: 1; background: #030712; color: #93c5fd; font-family: monospace; font-size: 12px; padding: 8px; border: 1px solid #4b5563; border-radius: 4px;" />
        <button onclick="navigator.clipboard.writeText(document.getElementById('rtInput').value); this.innerText='Copied!';" style="background: #0A66C2; color: #fff; border: none; padding: 8px 14px; border-radius: 4px; font-weight: 600; cursor: pointer; white-space: nowrap;">
          Copy Token
        </button>
      </div>
      <div style="font-size: 11px; color: #9ca3af; margin-top: 8px; line-height: 1.4;">
        Paste this token into <b>Vercel Project Settings → Environment Variables → ${refreshToken ? "LINKEDIN_REFRESH_TOKEN" : "LINKEDIN_ACCESS_TOKEN"}</b>.
      </div>
    </div>`
    : "";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | INDUS Robotics</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #090d16;
      color: #f3f4f6;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }
    .card {
      background: #111827;
      border: 1px solid #1f2937;
      border-radius: 12px;
      padding: 32px;
      max-width: 540px;
      width: 90%;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
    }
    .badge {
      display: inline-block;
      font-size: 11px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      font-weight: 700;
      padding: 4px 8px;
      border-radius: 4px;
      background: ${brandColor}22;
      color: ${brandColor};
      border: 1px solid ${brandColor}44;
      margin-bottom: 16px;
    }
    h1 {
      font-size: 20px;
      margin: 0 0 12px 0;
      color: #ffffff;
    }
    p {
      color: #9ca3af;
      font-size: 14px;
      line-height: 1.6;
      margin: 0 0 20px 0;
    }
    .btn {
      display: inline-block;
      background: #0A66C2;
      color: white;
      text-decoration: none;
      font-size: 13px;
      font-weight: 600;
      padding: 10px 18px;
      border-radius: 6px;
      transition: background 0.15s ease;
    }
    .btn:hover {
      background: #004182;
    }
    .steps {
      background: #0d121f;
      border: 1px solid #1e293b;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 20px;
      font-size: 12px;
      color: #cbd5e1;
      line-height: 1.6;
    }
    .steps ol {
      margin: 8px 0 0 0;
      padding-left: 20px;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">${statusBadge}</div>
    <h1>${title}</h1>
    <p>${message}</p>
    ${tokenBoxHtml}
    ${extraHtml}
    ${
      isSuccess
        ? `<div class="steps">
        <b>Final Activation Steps:</b>
        <ol>
          <li>Copy the token above.</li>
          <li>Open your Vercel Dashboard → <b>Settings</b> → <b>Environment Variables</b>.</li>
          <li>Add or update <code>LINKEDIN_REFRESH_TOKEN</code> or <code>LINKEDIN_ACCESS_TOKEN</code>.</li>
          <li>Trigger a test sync at <code>/api/linkedin-sync</code>.</li>
        </ol>
      </div>`
        : ""
    }
    <div style="display: flex; gap: 12px; align-items: center;">
      <a href="/api/linkedin-sync" class="btn">View Sync Status</a>
      <a href="https://precision-motion-systems-main.vercel.app" style="color: #9ca3af; font-size: 13px; text-decoration: none;">Return to Website →</a>
    </div>
  </div>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  return res.status(statusCode).send(html);
}

function isAuthorized(req) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) return true;

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
  const origin = req.headers ? req.headers.origin || "" : "";
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-sync-secret");
  }

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // GET Requests: Status, OAuth Start, OAuth Callback, or Cron
  if (req.method === "GET") {
    const query = req.query || {};

    // 1. OAuth Initiation Flow: /api/linkedin-sync?auth=start
    if (query.auth === "start" || query.action === "start") {
      try {
        const { state, nonce } = generateOAuthState();
        const host = req.headers.host || "precision-motion-systems-main.vercel.app";
        const proto = req.headers["x-forwarded-proto"] || (host.includes("localhost") ? "http" : "https");
        const redirectUri = `${proto}://${host}/api/linkedin-sync`;

        const isOrgMode = query.mode === "full" || query.mode === "org" || query.mode === "organization";
        const selectedMode = isOrgMode ? "organization" : "standard";
        const authUrl = buildAuthorizationUrl(state, { redirectUri, mode: selectedMode });

        const isHttps = proto === "https";
        const cookieParts = [
          `li_oauth_nonce=${nonce}`,
          "Path=/api/linkedin-sync",
          "HttpOnly",
          "SameSite=Lax",
          "Max-Age=600",
        ];
        if (isHttps) cookieParts.push("Secure");

        res.setHeader("Set-Cookie", cookieParts.join("; "));

        if (query.format === "json" || (req.headers.accept && req.headers.accept.includes("application/json"))) {
          return res.status(200).json({ success: true, mode: selectedMode, authUrl });
        }

        res.writeHead(302, { Location: authUrl });
        return res.end();
      } catch (err) {
        return res.status(500).json({
          success: false,
          error: err instanceof Error ? err.message : "Failed to initiate LinkedIn authorization",
        });
      }
    }

    // 2. OAuth Callback Flow: /api/linkedin-sync?code=...
    if (query.code || query.error) {
      if (query.error) {
        const errDetail = query.error_description || query.error;
        const isScopeError =
          String(query.error).includes("unauthorized_scope") ||
          String(errDetail).includes("scope") ||
          String(errDetail).includes("unauthorized");

        if (isScopeError) {
          const clientId = process.env.LINKEDIN_CLIENT_ID || "86kd0ocxlvd511";
          const scopeErrorHtml = `
            <div class="steps" style="border-left: 3px solid #f59e0b; background: #0f172a; margin-bottom: 20px;">
              <b style="color: #f59e0b; font-size: 13px;">Why did this error happen?</b>
              <p style="margin: 8px 0 12px 0; font-size: 13px; color: #cbd5e1; line-height: 1.5;">
                LinkedIn rejected the organization permissions because the required API products are not yet active on your Developer Application (Client ID: <code>${clientId}</code>).
              </p>
              <b style="color: #e2e8f0; font-size: 12px;">How to enable full company tracking in LinkedIn:</b>
              <ol style="margin: 8px 0 12px 0; padding-left: 20px; font-size: 12px; color: #94a3b8; line-height: 1.6;">
                <li>Open <a href="https://www.linkedin.com/developers/apps/${clientId}/products" target="_blank" style="color: #60a5fa; text-decoration: underline;">LinkedIn Developer Portal → Products ↗</a>.</li>
                <li>Request access to <b>Community Management API</b> (company posts, interactions, page analytics).</li>
                <li>Request access to <b>Lead Sync</b> (Lead Gen forms).</li>
              </ol>
            </div>
            <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
              <a href="/api/linkedin-sync?auth=start" class="btn" style="text-align: center; padding: 12px; font-size: 13px; background: #0A66C2;">
                ⚡ Connect with Active Permissions Now (Instant) →
              </a>
              <a href="https://www.linkedin.com/developers/apps/${clientId}/products" target="_blank" style="text-align: center; padding: 10px; border: 1px solid #334155; border-radius: 6px; color: #94a3b8; text-decoration: none; font-size: 12px;">
                Open LinkedIn Developer Products Tab ↗
              </a>
            </div>
          `;
          return renderHtmlResponse(
            res,
            400,
            "LinkedIn Permissions Setup Required",
            "Organization permissions are not yet approved on your developer application. You can connect with currently approved permissions right now, or enable the products in the developer portal.",
            false,
            null,
            null,
            scopeErrorHtml,
          );
        }

        return renderHtmlResponse(
          res,
          400,
          "LinkedIn Authorization Denied",
          `LinkedIn returned an authorization error: ${errDetail}. Please ensure requested permissions are approved.`,
          false,
        );
      }

      const cookies = parseCookies(req.headers.cookie);
      const cookieNonce = cookies.li_oauth_nonce || null;

      const validation = validateOAuthState(query.state, cookieNonce);
      if (!validation.valid) {
        return renderHtmlResponse(
          res,
          403,
          "Security Verification Failed",
          `The OAuth state verification failed: ${validation.error || "Unknown validation error"}. Please restart via /api/linkedin-sync?auth=start.`,
          false,
        );
      }

      res.setHeader(
        "Set-Cookie",
        "li_oauth_nonce=; Path=/api/linkedin-sync; Max-Age=0; HttpOnly; SameSite=Lax",
      );

      try {
        const host = req.headers.host || "precision-motion-systems-main.vercel.app";
        const proto = req.headers["x-forwarded-proto"] || (host.includes("localhost") ? "http" : "https");
        const redirectUri = `${proto}://${host}/api/linkedin-sync`;

        const tokenResult = await exchangeCodeForTokens(query.code, { redirectUri });

        return renderHtmlResponse(
          res,
          200,
          "LinkedIn Account Successfully Connected",
          "INDUS Industrial Robotics has been authorized to synchronize company posts, interactions, follower growth, and Lead Gen forms to Google Sheets.",
          true,
          tokenResult.refreshToken,
          tokenResult.accessToken,
        );
      } catch (exchangeErr) {
        return renderHtmlResponse(
          res,
          500,
          "Token Exchange Error",
          `Failed to exchange authorization code for tokens: ${exchangeErr.message}. Verify that LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET match your LinkedIn Developer Application.`,
          false,
        );
      }
    }

    // 3. Scheduled Cron Sync: /api/linkedin-sync?cron=1
    const isCron = Boolean(
      query.cron === "1" || query.trigger === "sync" || req.headers["x-vercel-cron"],
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

    // 4. Default Diagnostic Status Report
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
      jiraDestination: {
        domainConfigured: Boolean(process.env.JIRA_DOMAIN),
        emailConfigured: Boolean(process.env.JIRA_EMAIL),
        tokenConfigured: Boolean(process.env.JIRA_API_TOKEN),
        spaceName: "Linked In Leads",
        projectKey: (process.env.LINKEDIN_JIRA_PROJECT_KEY || "LIT").trim(),
        issueType: "Task",
      },
      spreadsheetDestination: {
        spreadsheetId: (process.env.GOOGLE_SPREADSHEET_ID || "1S-ApP83X9Y1-nXwim0tDNGn72wuhVn4PSbaWkcXlH48").trim(),
        targetWorksheet: "LinkedIn Leads",
        appsScriptConfigured: Boolean(process.env.GOOGLE_APPS_SCRIPT_URL),
      },
      configuredTabs: REQUIRED_SHEET_TABS,
      authorizationUrls: {
        instantActive: "/api/linkedin-sync?auth=start",
        organizationFull: "/api/linkedin-sync?auth=start&mode=full",
      },
      activePostTracking: {
        postUrn: "urn:li:activity:7515805418544091136",
        postUrl: "https://www.linkedin.com/feed/update/urn:li:activity:7515805418544091136",
        attributedLink:
          "https://precision-motion-systems-main.vercel.app?utm_source=linkedin&utm_medium=post&utm_campaign=engineering_future&utm_content=activity_7515805418544091136",
        productsLink:
          "https://precision-motion-systems-main.vercel.app/products?utm_source=linkedin&utm_medium=post&utm_campaign=engineering_future&utm_content=activity_7515805418544091136",
        quoteLink:
          "https://precision-motion-systems-main.vercel.app/contact?utm_source=linkedin&utm_medium=post&utm_campaign=engineering_future&utm_content=activity_7515805418544091136",
      },
      developerPortalProductsUrl: `https://www.linkedin.com/developers/apps/${process.env.LINKEDIN_CLIENT_ID || "86kd0ocxlvd511"}/products`,
      docs: {
        note: "To authorize channel tracking, visit /api/linkedin-sync?auth=start in your browser.",
        supportedActions: ["sync", "lead_gen", "test_lead", "test_post", "register_post", "test_enquiry"],
      },
    });
  }

  // POST Requests: Manual Actions and Webhooks
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
      const result = await processLinkedInLead(leadData, {
        triggerSource: "WEBHOOK",
        forceSync: Boolean(payload.forceSync),
        skipJira: Boolean(payload.skipJira),
        skipSheets: Boolean(payload.skipSheets),
      });

      return res.status(result.success ? 200 : 502).json(result);
    }

    // 3. Manual Test Lead Trigger (End-to-end verification option)
    if (action === "test_lead") {
      const mockLead = {
        leadId: payload.leadId || `test_lead_${Date.now()}`,
        submittedAt: payload.submittedAt || new Date().toISOString(),
        fullName: payload.fullName || "Aditya Sharma (Test Lead)",
        email: payload.email || "aditya.sharma@example.com",
        phone: payload.phone || "+91 98765 43210",
        company: payload.company || "Precision Dynamics Ltd",
        jobTitle: payload.jobTitle || "Head of Automation",
        formName: payload.formName || "INDUS Industrial Robotics Sizing Inquiry",
        campaignName: payload.campaignName || "Precision Robotics Q4 Campaign",
        linkedinProfileUrl: payload.linkedinProfileUrl || "https://www.linkedin.com/in/test-lead",
        status: payload.status || "Test Verified",
        enquiryDetails: payload.enquiryDetails || payload.requirements || "Synthetic test lead for LIT pipeline validation.",
      };

      const result = await processLinkedInLead(mockLead, {
        triggerSource: "TEST_LEAD",
        forceSync: Boolean(payload.forceSync),
        skipJira: Boolean(payload.skipJira),
        skipSheets: Boolean(payload.skipSheets),
      });

      return res.status(result.success ? 200 : 500).json(result);
    }

    // 4. Manual Test Post Trigger
    if (action === "test_post") {
      const mockPost = [
        {
          postUrn: payload.postUrn || `urn:li:share:test_${Date.now()}`,
          postUrl: `https://www.linkedin.com/feed/update/urn:li:share:test_${Date.now()}`,
          author: "urn:li:organization:106489371",
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

    // 5. Register Specific Post (e.g. urn:li:activity:7515805418544091136)
    if (action === "register_post" || action === "track_post") {
      const postUrn = payload.postUrn || payload.urn || "urn:li:activity:7515805418544091136";
      const postUrl = payload.postUrl || `https://www.linkedin.com/feed/update/${postUrn}`;
      const content =
        payload.content || "🤖 ENGINEERING THE FUTURE OF ROBOTICS | INDUS ROBOTICS";

      const postData = [
        {
          postUrn,
          postUrl,
          author:
            payload.author ||
            `urn:li:organization:${process.env.LINKEDIN_ORGANIZATION_ID || "106489371"}`,
          publishedDate: payload.publishedDate || new Date().toISOString(),
          content,
          impressions: payload.impressions || 1,
          uniqueImpressions: payload.uniqueImpressions || 1,
          reactions: payload.reactions || 1,
          comments: payload.comments || 0,
          shares: payload.shares || 0,
          clicks: payload.clicks || 0,
          engagementRate: payload.engagementRate || "0.00%",
        },
      ];

      const count = await recordPostsToGoogleSheets(postData);
      return res.status(count > 0 ? 200 : 500).json({
        success: count > 0,
        action: "register_post",
        postUrn,
        postUrl,
        trackingLinks: {
          homepage: `https://precision-motion-systems-main.vercel.app?utm_source=linkedin&utm_medium=post&utm_campaign=engineering_future&utm_content=${encodeURIComponent(postUrn)}`,
          products: `https://precision-motion-systems-main.vercel.app/products?utm_source=linkedin&utm_medium=post&utm_campaign=engineering_future&utm_content=${encodeURIComponent(postUrn)}`,
          contact: `https://precision-motion-systems-main.vercel.app/contact?utm_source=linkedin&utm_medium=post&utm_campaign=engineering_future&utm_content=${encodeURIComponent(postUrn)}`,
        },
        message: "Post registered and tracked in Google Sheets 'Posts' tab.",
      });
    }

    return res.status(400).json({
      success: false,
      error: `Unknown action: "${action}". Supported actions are: sync, lead_gen, test_lead, test_post, register_post.`,
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Internal error executing LinkedIn sync";
    return res.status(500).json({
      success: false,
      error: errorMsg,
    });
  }
}
