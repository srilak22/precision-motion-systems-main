// INDUS Robotics — YouTube OAuth 2.0 Authorization Initiation Endpoint
// GET /api/auth/youtube/start
// Generates CSRF-protected state with HMAC-SHA256 signature and directs operator to Google OAuth.

import { generateOAuthState, buildAuthorizationUrl } from "../../_lib/youtube-oauth.js";

export default async function handler(req, res) {
  // CORS & Preflight handling
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

  try {
    // 1. Generate CSRF state token and session nonce
    const { state, nonce } = generateOAuthState();

    // 2. Build authorization URL
    const authUrl = buildAuthorizationUrl(state);

    // 3. Set HttpOnly session cookie binding the nonce to this browser session
    const isHttps =
      req.headers["x-forwarded-proto"] === "https" ||
      (req.headers.host &&
        !req.headers.host.includes("localhost") &&
        !req.headers.host.includes("127.0.0.1"));

    const cookieParts = [
      `yt_oauth_nonce=${nonce}`,
      "Path=/api/auth/youtube",
      "HttpOnly",
      "SameSite=Lax",
      "Max-Age=600", // 10 minutes
    ];
    if (isHttps) {
      cookieParts.push("Secure");
    }

    res.setHeader("Set-Cookie", cookieParts.join("; "));

    // 4. Handle JSON requests or direct browser navigation
    const wantsJson =
      (req.headers.accept && req.headers.accept.includes("application/json")) ||
      (req.query && req.query.format === "json");

    if (wantsJson) {
      return res.status(200).json({
        success: true,
        authUrl,
      });
    }

    // Direct browser redirect
    res.writeHead(302, { Location: authUrl });
    return res.end();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to initiate YouTube authorization";
    return res.status(500).json({
      success: false,
      error: message,
    });
  }
}
