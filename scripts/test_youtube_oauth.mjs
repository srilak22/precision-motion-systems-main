/**
 * Automated Verification Suite: INDUS Robotics YouTube OAuth 2.0 Integration
 * Covers: State validation, replay protection, callback errors, token exchange,
 * refresh token handling, missing configuration, and secret zero-leakage.
 *
 * ZERO real Google calls, ZERO real Jira calls, ZERO real Google Sheets calls.
 */

import { test, describe, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";

import {
  generateOAuthState,
  validateOAuthState,
  buildAuthorizationUrl,
  exchangeCodeForTokens,
  refreshYouTubeAccessToken,
  getYouTubeAccessToken,
  resolveRetainedRefreshToken,
  YOUTUBE_SCOPES,
  DEFAULT_REDIRECT_URL,
} from "../api/lib/youtube-oauth.js";

import startHandler from "../api/auth/youtube/start.js";
import callbackHandler from "../api/auth/youtube/callback.js";

function createMockReqRes({
  method = "GET",
  headers = {},
  query = {},
  url = "/",
} = {}) {
  const req = {
    method,
    headers: {
      origin: "https://precision-motion-systems-main.vercel.app",
      host: "precision-motion-systems-main.vercel.app",
      ...headers,
    },
    query,
    url,
  };

  const res = {
    statusCode: 200,
    headers: {},
    ended: false,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    setHeader(key, val) {
      this.headers[key.toLowerCase()] = val;
      return this;
    },
    writeHead(code, headers = {}) {
      this.statusCode = code;
      for (const [k, v] of Object.entries(headers)) {
        this.headers[k.toLowerCase()] = v;
      }
      return this;
    },
    json(data) {
      this.body = data;
      this.ended = true;
      return this;
    },
    end(data) {
      this.body = data;
      this.ended = true;
      return this;
    },
  };

  return { req, res };
}

describe("INDUS YouTube OAuth 2.0 Integration Suite", () => {
  const originalFetch = globalThis.fetch;
  const originalEnv = { ...process.env };

  const MOCK_AUTH_SECRET = "super-secret-hmac-test-key-32-chars-long";
  const MOCK_CLIENT_ID = "mock-yt-client-id-12345.apps.googleusercontent.com";
  const MOCK_CLIENT_SECRET = "GOCSPX-mockClientSecret999";
  const MOCK_REDIRECT_URL = "https://precision-motion-systems-main.vercel.app/api/auth/youtube/callback";

  beforeEach(() => {
    process.env = { ...originalEnv };
    process.env.NODE_ENV = "test";
    process.env.AUTH_SECRET = MOCK_AUTH_SECRET;
    process.env.YOUTUBE_OAUTH_CLIENT_ID = MOCK_CLIENT_ID;
    process.env.YOUTUBE_OAUTH_CLIENT_SECRET = MOCK_CLIENT_SECRET;
    process.env.YOUTUBE_OAUTH_REDIRECT_URL = MOCK_REDIRECT_URL;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    process.env = { ...originalEnv };
  });

  // ─────────────────────────────────────────────────────────────
  // 1. State Generation, Signature, and Nonce Tests
  // ─────────────────────────────────────────────────────────────
  describe("State Token Cryptographic Security", () => {
    test("Generates structured state with 3 colon-separated parts", () => {
      const { state, nonce, expiresAt } = generateOAuthState();
      assert.ok(state);
      assert.ok(nonce);
      assert.ok(expiresAt > Date.now());

      const parts = state.split(":");
      assert.equal(parts.length, 3);
      assert.equal(parts[0], nonce);
      assert.equal(parts[1], String(expiresAt));
      assert.ok(parts[2].length >= 32); // HMAC hex string
    });

    test("Throws if AUTH_SECRET is not configured", () => {
      delete process.env.AUTH_SECRET;
      assert.throws(
        () => generateOAuthState(),
        /AUTH_SECRET is required/,
      );
    });

    test("Successfully validates a freshly generated state", () => {
      const { state, nonce } = generateOAuthState();
      const result = validateOAuthState(state, nonce);
      assert.equal(result.valid, true);
      assert.equal(result.nonce, nonce);
    });

    test("Rejects a tampered state signature", () => {
      const { state, nonce } = generateOAuthState();
      const parts = state.split(":");
      const tampered = `${parts[0]}:${parts[1]}:badf00d${parts[2].slice(7)}`;

      const result = validateOAuthState(tampered, nonce);
      assert.equal(result.valid, false);
      assert.match(result.error, /signature verification failed/i);
    });

    test("Rejects state if payload parameters were altered", () => {
      const { state, nonce } = generateOAuthState();
      const parts = state.split(":");
      const altered = `alteredNonce123:${parts[1]}:${parts[2]}`;

      const result = validateOAuthState(altered, nonce);
      assert.equal(result.valid, false);
      assert.match(result.error, /signature verification failed/i);
    });

    test("Rejects an expired state token", () => {
      // Generate with ttlMs in the past
      const { state, nonce } = generateOAuthState({ ttlMs: -1000 });
      const result = validateOAuthState(state, nonce);
      assert.equal(result.valid, false);
      assert.match(result.error, /expired/i);
    });

    test("Rejects state if session cookie nonce does not match", () => {
      const { state } = generateOAuthState();
      const result = validateOAuthState(state, "attacker-mismatched-nonce");
      assert.equal(result.valid, false);
      assert.match(result.error, /does not match browser session cookie/i);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 2. Replay Protection Tests
  // ─────────────────────────────────────────────────────────────
  describe("State Replay Protection", () => {
    test("Strictly blocks replaying the same state token a second time", () => {
      const { state, nonce } = generateOAuthState();

      // First validation: Success
      const firstCheck = validateOAuthState(state, nonce);
      assert.equal(firstCheck.valid, true);

      // Replay attempt: Must fail
      const replayCheck = validateOAuthState(state, nonce);
      assert.equal(replayCheck.valid, false);
      assert.match(replayCheck.error, /replay detected/i);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 3. Authorization Start Endpoint Tests
  // ─────────────────────────────────────────────────────────────
  describe("Authorization Start Endpoint (/api/auth/youtube/start)", () => {
    test("Fails with 500 when YOUTUBE_OAUTH_CLIENT_ID is missing (no silent fallback to admin SSO)", async () => {
      delete process.env.YOUTUBE_OAUTH_CLIENT_ID;
      process.env.GOOGLE_CLIENT_ID = "admin-sso-id-which-must-never-be-used";

      const { req, res } = createMockReqRes({ method: "GET" });
      await startHandler(req, res);

      assert.equal(res.statusCode, 500);
      assert.match(res.body.error, /YOUTUBE_OAUTH_CLIENT_ID/);
    });

    test("Redirects with 302 and sets secure cookie with nonce", async () => {
      const { req, res } = createMockReqRes({ method: "GET" });
      await startHandler(req, res);

      assert.equal(res.statusCode, 302);
      const location = res.headers.location;
      assert.ok(location);
      assert.match(location, /^https:\/\/accounts\.google\.com\/o\/oauth2\/v2\/auth\?/);

      const url = new URL(location);
      assert.equal(url.searchParams.get("client_id"), MOCK_CLIENT_ID);
      assert.equal(url.searchParams.get("redirect_uri"), MOCK_REDIRECT_URL);
      assert.equal(url.searchParams.get("response_type"), "code");
      assert.equal(url.searchParams.get("access_type"), "offline");
      assert.equal(url.searchParams.get("prompt"), "consent");
      assert.equal(url.searchParams.get("scope"), YOUTUBE_SCOPES.join(" "));
      assert.ok(url.searchParams.get("state"));

      // Check cookie
      const cookieHeader = res.headers["set-cookie"];
      assert.ok(cookieHeader);
      assert.match(cookieHeader, /yt_oauth_nonce=[a-f0-9]{48}/);
      assert.match(cookieHeader, /HttpOnly/i);
      assert.match(cookieHeader, /SameSite=Lax/i);
    });

    test("Returns JSON with authUrl when format=json query parameter is passed", async () => {
      const { req, res } = createMockReqRes({
        method: "GET",
        query: { format: "json" },
      });
      await startHandler(req, res);

      assert.equal(res.statusCode, 200);
      assert.equal(res.body.success, true);
      assert.ok(res.body.authUrl);
      assert.match(res.body.authUrl, /accounts\.google\.com/);
    });

    test("Rejects non-GET methods with 405 Method Not Allowed", async () => {
      const { req, res } = createMockReqRes({ method: "POST" });
      await startHandler(req, res);

      assert.equal(res.statusCode, 405);
      assert.equal(res.body.success, false);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 4. Callback Endpoint Tests
  // ─────────────────────────────────────────────────────────────
  describe("Callback Endpoint (/api/auth/youtube/callback)", () => {
    test("Handles user declining OAuth consent (error=access_denied)", async () => {
      const { req, res } = createMockReqRes({
        method: "GET",
        query: {
          error: "access_denied",
          error_description: "The user denied the request to read channel data.",
          format: "json",
        },
      });

      await callbackHandler(req, res);

      assert.equal(res.statusCode, 400);
      assert.equal(res.body.success, false);
      assert.match(res.body.error, /consent denied/i);
    });

    test("Returns 400 if authorization code is missing", async () => {
      const { state } = generateOAuthState();
      const { req, res } = createMockReqRes({
        method: "GET",
        query: { state, format: "json" },
      });

      await callbackHandler(req, res);
      assert.equal(res.statusCode, 400);
      assert.match(res.body.error, /authorization code/i);
    });

    test("Returns 400 if state parameter is missing", async () => {
      const { req, res } = createMockReqRes({
        method: "GET",
        query: { code: "4/0AeanS0somecode", format: "json" },
      });

      await callbackHandler(req, res);
      assert.equal(res.statusCode, 400);
      assert.match(res.body.error, /state parameter/i);
    });

    test("Returns 400 if state validation fails (tampered state)", async () => {
      const { req, res } = createMockReqRes({
        method: "GET",
        query: {
          code: "valid-auth-code",
          state: "tampered:12345678:invalid-signature",
          format: "json",
        },
      });

      await callbackHandler(req, res);
      assert.equal(res.statusCode, 400);
      assert.match(res.body.error, /Security Validation Error/i);
    });

    test("Handles Google token exchange failure (502 error, zero secret leakage)", async () => {
      const { state, nonce } = generateOAuthState();

      // Mock fetch failure from Google
      globalThis.fetch = async () => ({
        ok: false,
        status: 400,
        async json() {
          return {
            error: "invalid_grant",
            error_description: `Bad code for secret ${MOCK_CLIENT_SECRET}`,
          };
        },
      });

      const { req, res } = createMockReqRes({
        method: "GET",
        headers: {
          cookie: `yt_oauth_nonce=${nonce}`,
        },
        query: {
          code: "expired-or-invalid-code",
          state,
          format: "json",
        },
      });

      await callbackHandler(req, res);

      assert.equal(res.statusCode, 502);
      assert.equal(res.body.success, false);
      assert.match(res.body.error, /Google OAuth token exchange failed/i);
      // Zero leakage check
      assert.doesNotMatch(res.body.error, new RegExp(MOCK_CLIENT_SECRET));
      assert.match(res.body.error, /\[REDACTED\]/);
    });

    test("Successfully completes code exchange and returns ZERO-LEAKAGE response", async () => {
      const { state, nonce } = generateOAuthState();
      const mockAccessToken = "ya29.mock-super-sensitive-access-token-123";
      const mockRefreshToken = "1//mock-super-sensitive-refresh-token-456";

      // Mock successful Google token endpoint
      globalThis.fetch = async (url, options) => {
        assert.equal(url, "https://oauth2.googleapis.com/token");
        const body = new URLSearchParams(options.body);
        assert.equal(body.get("grant_type"), "authorization_code");
        assert.equal(body.get("client_id"), MOCK_CLIENT_ID);
        assert.equal(body.get("client_secret"), MOCK_CLIENT_SECRET);
        assert.equal(body.get("code"), "valid-google-auth-code");

        return {
          ok: true,
          status: 200,
          async json() {
            return {
              access_token: mockAccessToken,
              refresh_token: mockRefreshToken,
              expires_in: 3599,
              scope: YOUTUBE_SCOPES[0],
              token_type: "Bearer",
            };
          },
        };
      };

      const { req, res } = createMockReqRes({
        method: "GET",
        headers: {
          cookie: `yt_oauth_nonce=${nonce}`,
        },
        query: {
          code: "valid-google-auth-code",
          state,
          format: "json",
        },
      });

      await callbackHandler(req, res);

      assert.equal(res.statusCode, 200);
      assert.equal(res.body.success, true);
      assert.equal(res.body.channelConnected, true);
      assert.equal(res.body.hasRefreshToken, true);

      // ZERO-LEAKAGE VERIFICATION:
      const serialized = JSON.stringify(res.body);
      assert.ok(!serialized.includes(mockAccessToken), "Access token must NEVER be returned in response!");
      assert.ok(!serialized.includes(mockRefreshToken), "Refresh token must NEVER be returned in response!");
      assert.ok(!serialized.includes(MOCK_CLIENT_SECRET), "Client secret must NEVER be returned in response!");
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 5. Token Refresh & Token Retention Tests
  // ─────────────────────────────────────────────────────────────
  describe("Token Refresh & Retention Logic", () => {
    test("refreshYouTubeAccessToken succeeds with mocked Google response", async () => {
      const newAccessToken = "ya29.new-mock-access-token-789";

      globalThis.fetch = async (url, options) => {
        assert.equal(url, "https://oauth2.googleapis.com/token");
        const body = new URLSearchParams(options.body);
        assert.equal(body.get("grant_type"), "refresh_token");
        assert.equal(body.get("refresh_token"), "valid-stored-refresh-token");
        assert.equal(body.get("client_id"), MOCK_CLIENT_ID);
        assert.equal(body.get("client_secret"), MOCK_CLIENT_SECRET);

        return {
          ok: true,
          status: 200,
          async json() {
            return {
              access_token: newAccessToken,
              expires_in: 3600,
              scope: YOUTUBE_SCOPES[0],
              token_type: "Bearer",
            };
          },
        };
      };

      const refreshed = await refreshYouTubeAccessToken("valid-stored-refresh-token");
      assert.equal(refreshed.accessToken, newAccessToken);
      assert.equal(refreshed.expiresIn, 3600);
    });

    test("refreshYouTubeAccessToken throws when missing credentials", async () => {
      delete process.env.YOUTUBE_OAUTH_CLIENT_SECRET;
      await assert.rejects(
        () => refreshYouTubeAccessToken("some-token"),
        /YOUTUBE_OAUTH_CLIENT_SECRET/,
      );
    });

    test("getYouTubeAccessToken throws when YOUTUBE_REFRESH_TOKEN is not set", async () => {
      delete process.env.YOUTUBE_REFRESH_TOKEN;
      await assert.rejects(
        () => getYouTubeAccessToken(),
        /No YOUTUBE_REFRESH_TOKEN configured/,
      );
    });

    test("resolveRetainedRefreshToken retains current token if Google does not return a new one", () => {
      const existingToken = "1//existing-valid-refresh-token";
      const result = resolveRetainedRefreshToken(undefined, existingToken);
      assert.equal(result, existingToken);
    });

    test("resolveRetainedRefreshToken updates token when Google provides a new one", () => {
      const existingToken = "1//existing-valid-refresh-token";
      const newToken = "1//newly-returned-refresh-token";
      const result = resolveRetainedRefreshToken(newToken, existingToken);
      assert.equal(result, newToken);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 6. Security Isolation & Zero-Interference Guarantees
  // ─────────────────────────────────────────────────────────────
  describe("Security Isolation Guarantees", () => {
    test("Strictly does NOT fall back to GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET", async () => {
      delete process.env.YOUTUBE_OAUTH_CLIENT_ID;
      delete process.env.YOUTUBE_OAUTH_CLIENT_SECRET;
      process.env.GOOGLE_CLIENT_ID = "fallback-client-id-must-be-ignored";
      process.env.GOOGLE_CLIENT_SECRET = "fallback-client-secret-must-be-ignored";

      assert.throws(
        () => buildAuthorizationUrl("mock-state"),
        /YOUTUBE_OAUTH_CLIENT_ID/,
      );

      await assert.rejects(
        () => exchangeCodeForTokens("mock-code"),
        /YOUTUBE_OAUTH_CLIENT_ID/,
      );
    });

    test("Guarantees only minimal read-only scope is requested", () => {
      assert.deepEqual(YOUTUBE_SCOPES, [
        "https://www.googleapis.com/auth/youtube.readonly",
      ]);
      const url = buildAuthorizationUrl("mock-state");
      assert.ok(url.includes("https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube.readonly"));
      // Ensure no write or upload scopes exist
      assert.ok(!url.includes("youtube.upload"));
      assert.ok(!url.includes("youtube.force-ssl"));
    });
  });
});
