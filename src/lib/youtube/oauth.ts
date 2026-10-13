/**
 * INDUS Robotics — YouTube Data API v3 OAuth 2.0 Integration
 * Server-side helper utilities and token rotation.
 */

export const YOUTUBE_SCOPES = ["https://www.googleapis.com/auth/youtube.readonly"] as const;

export const DEFAULT_REDIRECT_URL =
  "https://precision-motion-systems-main.vercel.app/api/auth/youtube/callback";

export interface YouTubeTokenResponse {
  accessToken: string;
  refreshToken?: string | undefined;
  expiresIn: number;
  scope: string;
  tokenType?: string | undefined;
}

export interface RefreshedAccessToken {
  accessToken: string;
  expiresIn: number;
  scope: string;
  tokenType?: string | undefined;
}

/**
 * Server-side utility: Refreshes an active access token using the dedicated
 * YOUTUBE_OAUTH_CLIENT_ID, YOUTUBE_OAUTH_CLIENT_SECRET, and provided refresh token.
 */
export async function refreshYouTubeAccessToken(
  refreshToken: string,
  options: {
    clientId?: string;
    clientSecret?: string;
    fetchImpl?: typeof fetch;
  } = {},
): Promise<RefreshedAccessToken> {
  const clientId = (options.clientId || process.env["YOUTUBE_OAUTH_CLIENT_ID"] || "").trim();
  const clientSecret = (
    options.clientSecret ||
    process.env["YOUTUBE_OAUTH_CLIENT_SECRET"] ||
    ""
  ).trim();

  if (!clientId) {
    throw new Error("Missing required environment variable: YOUTUBE_OAUTH_CLIENT_ID");
  }
  if (!clientSecret) {
    throw new Error("Missing required environment variable: YOUTUBE_OAUTH_CLIENT_SECRET");
  }
  if (!refreshToken || refreshToken.trim().length === 0) {
    throw new Error("A valid refresh token is required to refresh access token");
  }

  const tokenUrl = "https://oauth2.googleapis.com/token";
  const bodyParams = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken.trim(),
    grant_type: "refresh_token",
  });

  const fetchFn = options.fetchImpl || fetch;
  const res = await fetchFn(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: bodyParams.toString(),
  });

  let data: Record<string, unknown>;
  try {
    data = (await res.json()) as Record<string, unknown>;
  } catch {
    throw new Error(`Google token refresh returned non-JSON response with HTTP ${res.status}`);
  }

  if (!res.ok) {
    const rawError = (data["error_description"] ||
      data["error"] ||
      "Token refresh failed") as string;
    const safeError = rawError.replace(
      new RegExp(clientSecret.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
      "[REDACTED]",
    );
    throw new Error(`Google OAuth token refresh failed (${res.status}): ${safeError}`);
  }

  return {
    accessToken: String(data["access_token"]),
    expiresIn: Number(data["expires_in"]),
    scope: String(data["scope"]),
    tokenType: data["token_type"] ? String(data["token_type"]) : undefined,
  };
}

/**
 * Server-side utility: Resolves a fresh access token using the server's configured
 * YOUTUBE_REFRESH_TOKEN environment variable.
 */
export async function getYouTubeAccessToken(
  options: {
    refreshToken?: string;
    clientId?: string;
    clientSecret?: string;
    fetchImpl?: typeof fetch;
  } = {},
): Promise<RefreshedAccessToken> {
  const refreshToken = (options.refreshToken || process.env["YOUTUBE_REFRESH_TOKEN"] || "").trim();
  if (!refreshToken) {
    throw new Error("Configuration Error: No YOUTUBE_REFRESH_TOKEN configured on server.");
  }

  return refreshYouTubeAccessToken(refreshToken, options);
}
