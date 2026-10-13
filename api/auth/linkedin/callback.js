// INDUS Robotics — LinkedIn OAuth 2.0 Callback Endpoint
// GET /api/auth/linkedin/callback
// Validates CSRF state, exchanges authorization code for tokens, and provides zero-leakage confirmation.

import { validateOAuthState, exchangeCodeForTokens } from "../../lib/linkedin-oauth.js";

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

function renderHtmlResponse(res, statusCode, title, message, isSuccess = false, refreshToken = null, accessToken = null) {
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

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({
      success: false,
      error: "Method Not Allowed. Only GET is supported.",
    });
  }

  const { code, state, error, error_description } = req.query || {};

  if (error) {
    const errorDetails = error_description || error;
    return renderHtmlResponse(
      res,
      400,
      "LinkedIn Authorization Denied",
      `LinkedIn returned an authorization error: ${errorDetails}. Please ensure all requested permissions were approved.`,
      false,
    );
  }

  if (!code || !state) {
    return renderHtmlResponse(
      res,
      400,
      "Invalid Callback Parameters",
      "Callback was invoked without the necessary authorization code or CSRF state token.",
      false,
    );
  }

  // Validate state
  const cookies = parseCookies(req.headers.cookie);
  const cookieNonce = cookies.li_oauth_nonce || null;

  const validation = validateOAuthState(state, cookieNonce);
  if (!validation.valid) {
    return renderHtmlResponse(
      res,
      403,
      "Security Verification Failed",
      `The OAuth state verification failed: ${validation.error || "Unknown validation error"}. Please restart the authorization flow.`,
      false,
    );
  }

  // Clear cookie
  res.setHeader(
    "Set-Cookie",
    "li_oauth_nonce=; Path=/api/auth/linkedin; Max-Age=0; HttpOnly; SameSite=Lax",
  );

  try {
    const host = req.headers.host || "precision-motion-systems-main.vercel.app";
    const proto = req.headers["x-forwarded-proto"] || (host.includes("localhost") ? "http" : "https");
    const redirectUri = `${proto}://${host}/api/auth/linkedin/callback`;

    const tokenResult = await exchangeCodeForTokens(code, { redirectUri });

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
    const message = exchangeErr instanceof Error ? exchangeErr.message : "Token exchange failure";
    return renderHtmlResponse(
      res,
      500,
      "Token Exchange Error",
      `Failed to exchange authorization code for tokens: ${message}. Verify that LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET match your LinkedIn Developer Application.`,
      false,
    );
  }
}
