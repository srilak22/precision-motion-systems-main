import { createServerFn } from "@tanstack/react-start";

export interface AuthSession {
  email: string;
  role: "admin" | "engineer" | "viewer";
  expiresAt: number;
}

export interface AuthStatus {
  isConfigured: boolean;
  isAuthenticated: boolean;
  user?: {
    email: string;
    role: string;
  };
}

/**
 * Validates a session signature against server-side AUTH_SECRET using Web Crypto API
 */
async function verifySignature(data: string, signature: string, secret: string): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );

    const sigBytes = Uint8Array.from(atob(signature), (c) => c.charCodeAt(0));
    return await crypto.subtle.verify("HMAC", key, sigBytes, encoder.encode(data));
  } catch {
    return false;
  }
}

/**
 * Signs session payload with server-side AUTH_SECRET
 */
async function signData(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const sigBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(sigBuffer)));
}

/**
 * Check if the dashboard authentication system is configured on the server
 */
export const getAuthStatus = createServerFn({ method: "GET" }).handler(
  async (): Promise<AuthStatus> => {
    const secret = process.env["AUTH_SECRET"];
    const adminEmail = process.env["ADMIN_EMAIL"];
    const googleClientId = process.env["GOOGLE_CLIENT_ID"];

    const isConfigured = Boolean(secret && (adminEmail || googleClientId));

    // If not configured, report configuration requirement honestly
    return {
      isConfigured,
      isAuthenticated: false,
    };
  },
);

/**
 * Pure session token verification logic (can be tested standalone or executed on server)
 */
export async function verifySessionToken(
  token: string,
  secretOverride?: string,
): Promise<{
  authorized: boolean;
  configured: boolean;
  message: string;
  email?: string;
  role?: string;
}> {
  const secret = secretOverride || process.env["AUTH_SECRET"];

  if (!secret) {
    return {
      authorized: false,
      configured: false,
      message: "Server authentication is not configured.",
    };
  }

  if (!token) {
    return {
      authorized: false,
      configured: true,
      message: "Authentication required to view private dashboard data.",
    };
  }

  try {
    const [payloadB64, signature] = token.split(".");
    if (!payloadB64 || !signature) {
      return { authorized: false, configured: true, message: "Invalid session token format." };
    }

    const serialized = atob(payloadB64);
    const isValid = await verifySignature(serialized, signature, secret);

    if (!isValid) {
      return {
        authorized: false,
        configured: true,
        message: "Session signature verification failed.",
      };
    }

    const session = JSON.parse(serialized) as AuthSession;
    if (Date.now() > session.expiresAt) {
      return {
        authorized: false,
        configured: true,
        message: "Session has expired. Please sign in again.",
      };
    }

    return {
      authorized: true,
      configured: true,
      message: "Session verified.",
      email: session.email,
      role: session.role,
    };
  } catch {
    return { authorized: false, configured: true, message: "Session token processing failed." };
  }
}

/**
 * Pure credential authentication logic
 */
export async function authenticateCredentials(
  data: { email: string; password: string },
  config?: { secret?: string; adminEmail?: string; adminPassword?: string },
): Promise<{
  success: boolean;
  configured: boolean;
  token?: string;
  message: string;
  user?: { email: string; role: string };
}> {
  const secret = config?.secret || process.env["AUTH_SECRET"];
  const adminEmail = (config?.adminEmail || process.env["ADMIN_EMAIL"] || "").toLowerCase();
  const adminPassword = config?.adminPassword || process.env["ADMIN_PASSWORD"];

  // Reject if server auth is not yet configured
  if (!secret || !adminEmail || !adminPassword) {
    return {
      success: false,
      configured: false,
      message:
        "Authentication is not yet configured on the server. Please set AUTH_SECRET, ADMIN_EMAIL, and ADMIN_PASSWORD (or GOOGLE_CLIENT_ID) in your deployment environment variables.",
    };
  }

  if (!data.email || !data.password) {
    return {
      success: false,
      configured: true,
      message: "Please enter both email address and password.",
    };
  }

  const emailMatches = data.email === adminEmail;
  const passwordMatches = data.password === adminPassword;

  if (!emailMatches || !passwordMatches) {
    return {
      success: false,
      configured: true,
      message: "Invalid administrator credentials.",
    };
  }

  // Generate secure session token signed with AUTH_SECRET
  const sessionPayload: AuthSession = {
    email: adminEmail,
    role: "admin",
    expiresAt: Date.now() + 8 * 60 * 60 * 1000, // 8 hours
  };

  const serialized = JSON.stringify(sessionPayload);
  const signature = await signData(serialized, secret);
  const token = `${btoa(serialized)}.${signature}`;

  return {
    success: true,
    configured: true,
    token,
    message: "Authentication successful.",
    user: {
      email: adminEmail,
      role: "admin",
    },
  };
}

/**
 * Server function to handle login verification safely
 * NOTE: Does NOT store credentials in browser storage or hardcode any credentials
 */
export const submitLogin = createServerFn({ method: "POST" })
  .validator((raw: unknown) => {
    if (!raw || typeof raw !== "object") {
      throw new Error("Invalid login payload");
    }
    const input = raw as Record<string, unknown>;
    const email =
      typeof input["email"] === "string" ? (input["email"] as string).trim().toLowerCase() : "";
    const password = typeof input["password"] === "string" ? (input["password"] as string) : "";

    return { email, password };
  })
  .handler(async ({ data }) => {
    return authenticateCredentials(data);
  });

/**
 * Server function to verify access to the private intelligence dashboard
 */
export const verifyDashboardAccess = createServerFn({ method: "POST" })
  .validator((token: unknown) => (typeof token === "string" ? token : ""))
  .handler(async ({ data: token }) => {
    return verifySessionToken(token);
  });
