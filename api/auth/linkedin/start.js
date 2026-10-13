// INDUS Robotics — LinkedIn OAuth 2.0 Authorization Initiation Endpoint
// GET /api/auth/linkedin/start
// Generates CSRF-protected state with HMAC-SHA256 signature and directs operator to LinkedIn OAuth.

import { generateOAuthState, buildAuthorizationUrl } from "../../lib/linkedin-oauth.js";

export default async function handler(req, res) {
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
    const { state, nonce } = generateOAuthState();

    const host = req.headers.host || "precision-motion-systems-main.vercel.app";
    const proto = req.headers["x-forwarded-proto"] || (host.includes("localhost") ? "http" : "https");
    const redirectUri = `${proto}://${host}/api/auth/linkedin/callback`;

    const authUrl = buildAuthorizationUrl(state, { redirectUri });

    const isHttps = proto === "https";
    const cookieParts = [
      `li_oauth_nonce=${nonce}`,
      "Path=/api/auth/linkedin",
      "HttpOnly",
      "SameSite=Lax",
      "Max-Age=600", // 10 minutes
    ];
    if (isHttps) {
      cookieParts.push("Secure");
    }

    res.setHeader("Set-Cookie", cookieParts.join("; "));

    const wantsJson =
      (req.headers.accept && req.headers.accept.includes("application/json")) ||
      (req.query && req.query.format === "json");

    if (wantsJson) {
      return res.status(200).json({
        success: true,
        authUrl,
      });
    }

    res.writeHead(302, { Location: authUrl });
    return res.end();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to initiate LinkedIn authorization";
    return res.status(500).json({
      success: false,
      error: message,
    });
  }
}
