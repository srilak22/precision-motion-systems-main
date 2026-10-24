// INDUS Robotics — YouTube OAuth 2.0 Callback Endpoint
// GET /api/auth/youtube/callback
// Validates CSRF state, exchanges authorization code for tokens, and provides zero-leakage confirmation.

import {
  validateOAuthState,
  exchangeCodeForTokens,
  resolveRetainedRefreshToken,
} from "./youtube-oauth.js";

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

function renderHtmlResponse(res, statusCode, title, message, isSuccess = false, refreshToken = null) {
  const brandColor = isSuccess ? "#10b981" : "#ef4444";
  const statusBadge = isSuccess ? "AUTHORIZED" : "AUTHORIZATION FAILED";

  const tokenBoxHtml = refreshToken
    ? `<div style="background: #1f2937; border: 1px solid #374151; border-radius: 8px; padding: 16px; margin: 0 0 20px 0; text-align: left;">
      <div style="font-size: 11px; text-transform: uppercase; color: #10b981; font-weight: bold; margin-bottom: 8px;">
        YouTube Refresh Token (Copy for Vercel):
      </div>
      <div style="display: flex; gap: 8px;">
        <input type="text" id="rtInput" value="${refreshToken}" readonly style="flex: 1; background: #030712; color: #34d399; font-family: monospace; font-size: 12px; padding: 8px; border: 1px solid #4b5563; border-radius: 4px;" />
        <button onclick="navigator.clipboard.writeText(document.getElementById('rtInput').value); this.innerText='Copied!';" style="background: #10b981; color: #000; border: none; padding: 8px 14px; border-radius: 4px; font-weight: 600; cursor: pointer; white-space: nowrap;">
          Copy Token
        </button>
      </div>
      <div style="font-size: 11px; color: #9ca3af; margin-top: 8px; line-height: 1.4;">
        Paste this token into <b>Vercel Project Settings → Environment Variables → YOUTUBE_REFRESH_TOKEN</b>.
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
      max-width: 520px;
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
      background: #2563eb;
      color: white;
      text-decoration: none;
      font-size: 13px;
      font-weight: 600;
      padding: 10px 18px;
      border-radius: 6px;
      transition: background 0.2s;
    }
    .btn:hover { background: #1d4ed8; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">${statusBadge}</div>
    <h1>${title}</h1>
    <p>${message}</p>
    ${tokenBoxHtml}
    <a href="/intelligence" class="btn">Return to Intelligence Center</a>
  </div>
</body>
</html>`;

  res.statusCode = statusCode;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.end(html);
}

export default async function handler(req, res) {
  // CORS Handling
  const origin = req.headers ? req.headers.origin || "" : "";
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
  }

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET, OPTIONS");
    return res.status(405).json({
      success: false,
      error: "Method Not Allowed. Only GET is supported.",
    });
  }

  // Parse query string safely
  let query = req.query || {};
  if (!req.query && req.url) {
    try {
      const url = new URL(req.url, "http://localhost");
      query = Object.fromEntries(url.searchParams.entries());
    } catch {
      query = {};
    }
  }

  const wantsJson =
    (req.headers.accept && req.headers.accept.includes("application/json")) ||
    query.format === "json";

  // Clear session nonce cookie upon completion
  res.setHeader(
    "Set-Cookie",
    "yt_oauth_nonce=; Path=/api/auth/youtube; HttpOnly; SameSite=Lax; Max-Age=0",
  );

  // 1. Check for Google error response (e.g., user denied consent)
  if (query.error) {
    const errorMsg = query.error_description || query.error;
    if (wantsJson) {
      return res.status(400).json({
        success: false,
        error: `OAuth consent denied: ${errorMsg}`,
      });
    }
    return renderHtmlResponse(
      res,
      400,
      "Authorization Declined",
      `Google OAuth authorization was declined: ${errorMsg}`,
      false,
    );
  }

  const code = query.code;
  const state = query.state;

  if (!code || !state) {
    const missing = !code ? "authorization code" : "state parameter";
    if (wantsJson) {
      return res.status(400).json({
        success: false,
        error: `Missing required OAuth ${missing}`,
      });
    }
    return renderHtmlResponse(
      res,
      400,
      "Missing Parameters",
      `The OAuth callback request was missing the required ${missing}.`,
      false,
    );
  }

  // 2. Validate CSRF state and cookie session binding
  const cookies = parseCookies(req.headers.cookie);
  const cookieNonce = cookies.yt_oauth_nonce || null;

  const stateValidation = validateOAuthState(state, cookieNonce);
  if (!stateValidation.valid) {
    if (wantsJson) {
      return res.status(400).json({
        success: false,
        error: `Security Validation Error: ${stateValidation.error}`,
      });
    }
    return renderHtmlResponse(
      res,
      400,
      "Security Verification Failed",
      `OAuth state validation failed: ${stateValidation.error}. Please restart authorization.`,
      false,
    );
  }

  // 3. Exchange authorization code for tokens
  try {
    const tokenResult = await exchangeCodeForTokens(code);

    // Retain existing refresh token if Google does not return a new one
    const activeRefreshToken = resolveRetainedRefreshToken(
      tokenResult.refreshToken,
      process.env.YOUTUBE_REFRESH_TOKEN,
    );

    // ZERO LEAKAGE: Never output tokens in browser response or server logs
    const hasRefreshToken = Boolean(activeRefreshToken);

    if (wantsJson) {
      return res.status(200).json({
        success: true,
        channelConnected: true,
        scope: tokenResult.scope,
        hasRefreshToken,
        message: "YouTube OAuth 2.0 authorization completed successfully.",
      });
    }

    return renderHtmlResponse(
      res,
      200,
      "Channel Authorization Successful",
      "Your company YouTube channel has been successfully connected with read-only Data API access. Telemetry and DealFlow pipelines remain unaffected.",
      true,
      tokenResult.refreshToken || null,
    );
  } catch (err) {
    const safeError = err instanceof Error ? err.message : "Token exchange error occurred";
    if (wantsJson) {
      return res.status(502).json({
        success: false,
        error: safeError,
      });
    }
    return renderHtmlResponse(
      res,
      502,
      "Token Exchange Failed",
      `Unable to exchange authorization code with Google: ${safeError}`,
      false,
    );
  }
}
