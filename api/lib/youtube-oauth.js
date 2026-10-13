// INDUS Robotics — YouTube OAuth 2.0 & Token Management Library
// Strictly dedicated to YouTube Data API v3 channel integration.
// Compliant with CSRF protection, HMAC-SHA256 state signing, replay defense, and zero-leakage security.

import crypto from "node:crypto";

export const YOUTUBE_SCOPES = ["https://www.googleapis.com/auth/youtube.readonly"];

export const DEFAULT_REDIRECT_URL =
  "https://precision-motion-systems-main.vercel.app/api/auth/youtube/callback";

// Replay protection: tracking consumed state nonces
const consumedNonces = new Map(); // nonce -> timestamp

/**
 * Periodically purge stale consumed nonces (retention window: 30 minutes)
 */
function cleanupConsumedNonces() {
  const now = Date.now();
  const maxAge = 30 * 60 * 1000;
  for (const [nonce, ts] of consumedNonces.entries()) {
    if (now - ts > maxAge) {
      consumedNonces.delete(nonce);
    }
  }
}

/**
 * Resolves the active secret key used to sign OAuth state tokens.
 */
export function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.trim().length === 0) {
    throw new Error("Configuration Error: AUTH_SECRET is required to sign OAuth state tokens.");
  }
  return secret.trim();
}

/**
 * Generates an HMAC-SHA256 signed OAuth state token with replay prevention and expiration.
 *
 * @param {Object} [options]
 * @param {string} [options.secret] - Optional secret override (for testing)
 * @param {number} [options.ttlMs] - Time-to-live in milliseconds (default: 10 mins)
 * @returns {{ state: string, nonce: string, expiresAt: number }}
 */
export function generateOAuthState(options = {}) {
  cleanupConsumedNonces();
  const secret = options.secret || getAuthSecret();
  const ttlMs = options.ttlMs || 10 * 60 * 1000;
  const nonce = crypto.randomBytes(24).toString("hex");
  const expiresAt = Date.now() + ttlMs;

  const payload = `${nonce}:${expiresAt}`;
  const signature = crypto.createHmac("sha256", secret).update(payload).digest("hex");

  const state = `${payload}:${signature}`;

  return { state, nonce, expiresAt };
}

/**
 * Validates an incoming OAuth state string against its signature, expiration, replay cache, and cookie.
 *
 * @param {string} state - The state string from OAuth callback query.
 * @param {string|null} [cookieNonce] - The nonce stored in the user's browser session cookie.
 * @param {Object} [options]
 * @param {string} [options.secret] - Optional secret override (for testing)
 * @returns {{ valid: boolean, nonce: string, error?: string }}
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

  // 1. Verify HMAC-SHA256 signature
  const secret = options.secret || getAuthSecret();
  const payload = `${nonce}:${expiresAtStr}`;
  const expectedSignature = crypto.createHmac("sha256", secret).update(payload).digest("hex");

  const sigBufA = Buffer.from(receivedSignature, "utf8");
  const sigBufB = Buffer.from(expectedSignature, "utf8");

  if (sigBufA.length !== sigBufB.length || !crypto.timingSafeEqual(sigBufA, sigBufB)) {
    return { valid: false, nonce: "", error: "State signature verification failed" };
  }

  // 2. Expiration check
  if (Date.now() > expiresAt) {
    return { valid: false, nonce: "", error: "State parameter has expired" };
  }

  // 3. Replay prevention check
  if (consumedNonces.has(nonce)) {
    return { valid: false, nonce, error: "State replay detected: state was already consumed" };
  }

  // 4. Session cookie nonce binding (if provided)
  if (cookieNonce !== null && cookieNonce !== undefined) {
    if (cookieNonce !== nonce) {
      return { valid: false, nonce, error: "State does not match browser session cookie" };
    }
  }

  // Mark nonce as consumed
  consumedNonces.set(nonce, Date.now());

  return { valid: true, nonce };
}

/**
 * Builds the Google OAuth 2.0 authorization URL.
 * Strictly uses dedicated YOUTUBE_OAUTH_CLIENT_ID and YOUTUBE_OAUTH_REDIRECT_URL.
 *
 * @param {string} state - The signed state token.
 * @param {Object} [options]
 * @returns {string} Google Auth URL
 */
export function buildAuthorizationUrl(state, options = {}) {
  const clientId = (options.clientId || process.env.YOUTUBE_OAUTH_CLIENT_ID || "").trim();
  const redirectUri = (
    options.redirectUri ||
    process.env.YOUTUBE_OAUTH_REDIRECT_URL ||
    DEFAULT_REDIRECT_URL
  ).trim();

  if (!clientId) {
    throw new Error(
      "Configuration Error: Missing required environment variable YOUTUBE_OAUTH_CLIENT_ID.",
    );
  }

  if (!redirectUri) {
    throw new Error(
      "Configuration Error: Missing required environment variable YOUTUBE_OAUTH_REDIRECT_URL.",
    );
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: YOUTUBE_SCOPES.join(" "),
    access_type: "offline",
    prompt: "consent",
    state,
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Exchanges authorization code for access and refresh tokens.
 * Strictly uses dedicated YOUTUBE_OAUTH_CLIENT_ID and YOUTUBE_OAUTH_CLIENT_SECRET.
 *
 * @param {string} code - Authorization code from callback.
 * @param {Object} [options]
 * @returns {Promise<{ accessToken: string, refreshToken?: string, expiresIn: number, scope: string }>}
 */
export async function exchangeCodeForTokens(code, options = {}) {
  const clientId = (options.clientId || process.env.YOUTUBE_OAUTH_CLIENT_ID || "").trim();
  const clientSecret = (
    options.clientSecret ||
    process.env.YOUTUBE_OAUTH_CLIENT_SECRET ||
    ""
  ).trim();
  const redirectUri = (
    options.redirectUri ||
    process.env.YOUTUBE_OAUTH_REDIRECT_URL ||
    DEFAULT_REDIRECT_URL
  ).trim();

  if (!clientId) {
    throw new Error("Missing required environment variable: YOUTUBE_OAUTH_CLIENT_ID");
  }
  if (!clientSecret) {
    throw new Error("Missing required environment variable: YOUTUBE_OAUTH_CLIENT_SECRET");
  }
  if (!code || typeof code !== "string" || code.trim().length === 0) {
    throw new Error("Missing authorization code for token exchange");
  }

  const tokenUrl = "https://oauth2.googleapis.com/token";
  const bodyParams = new URLSearchParams({
    code: code.trim(),
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  });

  const fetchImpl = options.fetch || globalThis.fetch;
  const res = await fetchImpl(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: bodyParams.toString(),
  });

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error(`Google token exchange returned non-JSON response with HTTP ${res.status}`);
  }

  if (!res.ok) {
    // Redact client_secret if it somehow appears in upstream error messages
    const rawError = data?.error_description || data?.error || "Token exchange failed";
    const safeError = String(rawError).replace(
      new RegExp(clientSecret.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
      "[REDACTED]",
    );
    throw new Error(`Google OAuth token exchange failed (${res.status}): ${safeError}`);
  }

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token || undefined,
    expiresIn: data.expires_in,
    scope: data.scope,
    tokenType: data.token_type,
  };
}

/**
 * Refreshes an access token using an existing refresh token.
 *
 * @param {string} refreshToken
 * @param {Object} [options]
 * @returns {Promise<{ accessToken: string, expiresIn: number, scope: string }>}
 */
export async function refreshYouTubeAccessToken(refreshToken, options = {}) {
  const clientId = (options.clientId || process.env.YOUTUBE_OAUTH_CLIENT_ID || "").trim();
  const clientSecret = (
    options.clientSecret ||
    process.env.YOUTUBE_OAUTH_CLIENT_SECRET ||
    ""
  ).trim();

  if (!clientId) {
    throw new Error("Missing required environment variable: YOUTUBE_OAUTH_CLIENT_ID");
  }
  if (!clientSecret) {
    throw new Error("Missing required environment variable: YOUTUBE_OAUTH_CLIENT_SECRET");
  }
  if (!refreshToken || typeof refreshToken !== "string" || refreshToken.trim().length === 0) {
    throw new Error("A valid refresh token is required to refresh access token");
  }

  const tokenUrl = "https://oauth2.googleapis.com/token";
  const bodyParams = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken.trim(),
    grant_type: "refresh_token",
  });

  const fetchImpl = options.fetch || globalThis.fetch;
  const res = await fetchImpl(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: bodyParams.toString(),
  });

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error(`Google token refresh returned non-JSON response with HTTP ${res.status}`);
  }

  if (!res.ok) {
    const rawError = data?.error_description || data?.error || "Token refresh failed";
    const safeError = String(rawError).replace(
      new RegExp(clientSecret.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
      "[REDACTED]",
    );
    throw new Error(`Google OAuth token refresh failed (${res.status}): ${safeError}`);
  }

  return {
    accessToken: data.access_token,
    expiresIn: data.expires_in,
    scope: data.scope,
    tokenType: data.token_type,
  };
}

/**
 * Resolves an active access token using the configured YOUTUBE_REFRESH_TOKEN.
 *
 * @param {Object} [options]
 * @returns {Promise<{ accessToken: string, expiresIn: number }>}
 */
export async function getYouTubeAccessToken(options = {}) {
  const refreshToken = (options.refreshToken || process.env.YOUTUBE_REFRESH_TOKEN || "").trim();
  if (!refreshToken) {
    throw new Error("Configuration Error: No YOUTUBE_REFRESH_TOKEN configured on server.");
  }

  return refreshYouTubeAccessToken(refreshToken, options);
}

/**
 * Safe token retention helper:
 * Retains existing refresh token if Google does not return a new one on re-authorization.
 *
 * @param {string|undefined} newRefreshToken - Token returned from Google exchange (may be undefined)
 * @param {string|undefined} currentRefreshToken - Current token stored on server
 * @returns {string|undefined}
 */
export function resolveRetainedRefreshToken(newRefreshToken, currentRefreshToken) {
  if (newRefreshToken && newRefreshToken.trim().length > 0) {
    return newRefreshToken.trim();
  }
  if (currentRefreshToken && currentRefreshToken.trim().length > 0) {
    return currentRefreshToken.trim();
  }
  return undefined;
}
