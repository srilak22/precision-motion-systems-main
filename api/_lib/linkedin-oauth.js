// INDUS Robotics — LinkedIn OAuth 2.0 & Token Exchange Helper
// api/lib/linkedin-oauth.js
// Handles CSRF protection, HMAC-SHA256 state signing, replay defense, and token exchange.

import crypto from "node:crypto";
import { LINKEDIN_SCOPES, LINKEDIN_OAUTH_AUTH_URL, LINKEDIN_OAUTH_TOKEN_URL } from "./linkedin-sync.js";

export const DEFAULT_LINKEDIN_REDIRECT_URL =
  process.env.LINKEDIN_REDIRECT_URI ||
  "https://precision-motion-systems-main.vercel.app/api/linkedin-sync";

// Replay protection: tracking consumed state nonces
const consumedNonces = new Map();

function cleanupConsumedNonces() {
  const now = Date.now();
  const maxAge = 30 * 60 * 1000;
  for (const [nonce, ts] of consumedNonces.entries()) {
    if (now - ts > maxAge) {
      consumedNonces.delete(nonce);
    }
  }
}

export function getAuthSecret() {
  const secret = process.env.AUTH_SECRET || "indus-linkedin-secret-fallback-key-2026";
  return secret.trim();
}

/**
 * Generates an HMAC-SHA256 signed OAuth state token with replay prevention
 */
export function generateOAuthState(options = {}) {
  cleanupConsumedNonces();
  const secret = options.secret || getAuthSecret();
  const ttlMs = options.ttlMs || 10 * 60 * 1000; // 10 minutes
  const nonce = crypto.randomBytes(24).toString("hex");
  const expiresAt = Date.now() + ttlMs;

  const payload = `${nonce}:${expiresAt}`;
  const signature = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  const state = `${payload}:${signature}`;

  return { state, nonce, expiresAt };
}

/**
 * Validates incoming state against HMAC signature, expiry, and browser cookie nonce
 */
export function validateOAuthState(state, cookieNonce = null, options = {}) {
  cleanupConsumedNonces();

  if (!state || typeof state !== "string") {
    return { valid: false, nonce: "", error: "Missing state parameter" };
  }

  const parts = state.split(":");
  if (parts.length !== 3) {
    return { valid: false, nonce: "", error: "Malformed state parameter structure" };
  }

  const [nonce, expiresAtStr, receivedSignature] = parts;
  const expiresAt = Number.parseInt(expiresAtStr, 10);

  if (Number.isNaN(expiresAt)) {
    return { valid: false, nonce: "", error: "Invalid state timestamp" };
  }

  const secret = options.secret || getAuthSecret();
  const payload = `${nonce}:${expiresAtStr}`;
  const expectedSignature = crypto.createHmac("sha256", secret).update(payload).digest("hex");

  const sigBufA = Buffer.from(receivedSignature, "utf8");
  const sigBufB = Buffer.from(expectedSignature, "utf8");

  if (sigBufA.length !== sigBufB.length || !crypto.timingSafeEqual(sigBufA, sigBufB)) {
    return { valid: false, nonce, error: "Invalid state signature (possible tampering)" };
  }

  if (Date.now() > expiresAt) {
    return { valid: false, nonce, error: "Authorization session expired. Please start again." };
  }

  if (consumedNonces.has(nonce)) {
    return { valid: false, nonce, error: "Authorization state has already been used (replay detected)" };
  }

  if (cookieNonce && cookieNonce !== nonce) {
    return { valid: false, nonce, error: "State mismatch with browser session" };
  }

  consumedNonces.set(nonce, Date.now());
  return { valid: true, nonce };
}

/**
 * Builds the official LinkedIn OAuth 2.0 Authorization URL
 */
export function buildAuthorizationUrl(state, options = {}) {
  const clientId = (options.clientId || process.env.LINKEDIN_CLIENT_ID || "").trim();
  if (!clientId) {
    throw new Error(
      "Configuration Error: LINKEDIN_CLIENT_ID must be set in Vercel environment variables before initiating authorization.",
    );
  }

  const redirectUri = options.redirectUri || process.env.LINKEDIN_REDIRECT_URI || DEFAULT_LINKEDIN_REDIRECT_URL;
  const scopes = options.scopes || LINKEDIN_SCOPES;

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
    scope: scopes.join(" "),
  });

  return `${LINKEDIN_OAUTH_AUTH_URL}?${params.toString()}`;
}

/**
 * Exchanges authorization code for tokens via LinkedIn OAuth token endpoint
 */
export async function exchangeCodeForTokens(code, options = {}) {
  const fetchFn = options.fetchImpl || globalThis.fetch;
  const clientId = (options.clientId || process.env.LINKEDIN_CLIENT_ID || "").trim();
  const clientSecret = (options.clientSecret || process.env.LINKEDIN_CLIENT_SECRET || "").trim();
  const redirectUri = options.redirectUri || process.env.LINKEDIN_REDIRECT_URI || DEFAULT_LINKEDIN_REDIRECT_URL;

  if (!clientId || !clientSecret) {
    throw new Error("Missing LINKEDIN_CLIENT_ID or LINKEDIN_CLIENT_SECRET in environment variables.");
  }

  const bodyParams = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
    client_id: clientId,
    client_secret: clientSecret,
  });

  const res = await fetchFn(LINKEDIN_OAUTH_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: bodyParams.toString(),
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`LinkedIn token exchange failed with status ${res.status}: ${errText}`);
  }

  const tokenData = await res.json();
  return {
    accessToken: tokenData.access_token,
    expiresIn: tokenData.expires_in,
    refreshToken: tokenData.refresh_token || null,
    refreshTokenExpiresIn: tokenData.refresh_token_expires_in || null,
    scope: tokenData.scope,
  };
}
