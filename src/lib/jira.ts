import type { YouTubeAttribution } from "../integrations/youtube-leads/types.ts";
import type { LinkedInAttribution } from "../integrations/linkedin-tracking/types.ts";
import { submitYouTubeLead } from "../integrations/youtube-leads/client.ts";
import {
  getYouTubeAttribution,
  captureYouTubeAttribution,
  isYouTubeReferrer,
} from "../integrations/youtube-leads/attribution.ts";
import {
  getLinkedInAttribution,
  captureLinkedInAttribution,
  isLinkedInReferrer,
} from "../integrations/linkedin-tracking/attribution.ts";

export interface JiraTaskPayload {
  name: string;
  company?: string | undefined;
  email: string;
  phone?: string | undefined;
  product?: string | undefined;
  quantity?: string | undefined;
  requirements?: string | undefined;
  topic?: string | undefined;
  type?: string | undefined;
  labels?: string[] | undefined;
  preferredContact?: string | undefined;
  attribution?: YouTubeAttribution | undefined;
  linkedinAttribution?: LinkedInAttribution | undefined;
  _hp?: string | undefined;
}

export interface JiraTaskResult {
  success: boolean;
  issueKey?: string | undefined;
  jiraKey?: string | undefined;
  projectKey?: string | undefined;
  duplicate?: boolean | undefined;
  message?: string | undefined;
  fallback?: boolean | undefined;
}

// Client-side sanitization
function sanitizeString(input: unknown, maxLength: number): string {
  if (typeof input !== "string") return "";
  // Strip control characters except standard whitespace
  // eslint-disable-next-line no-control-regex
  const sanitized = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").trim();
  return sanitized.slice(0, maxLength);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Determines whether the given attribution represents a valid YouTube campaign or referrer.
 */
export function hasValidYouTubeAttribution(attr: YouTubeAttribution | null | undefined): boolean {
  if (!attr || typeof attr !== "object") return false;
  const utmSource = (attr.utmSource || "").toLowerCase().trim();
  const isYtSource = utmSource.includes("youtube");
  const isYtRef = isYouTubeReferrer(attr.referrer || "");
  const hasVideoId = Boolean(attr.videoId && attr.videoId.trim().length > 0);
  const hasYtCampaign = Boolean(attr.campaign && attr.campaign.toLowerCase().includes("youtube"));
  return isYtSource || isYtRef || hasVideoId || hasYtCampaign;
}

/**
 * Determines whether the given attribution represents a valid LinkedIn campaign or referral.
 */
export function hasValidLinkedInAttribution(attr: LinkedInAttribution | null | undefined): boolean {
  if (!attr || typeof attr !== "object") return false;
  const utmSource = (attr.utmSource || "").toLowerCase().trim();
  const isLiSource = utmSource.includes("linkedin");
  const isLiRef = isLinkedInReferrer(attr.referrerUrl || "");
  const hasLiClick = Boolean(attr.linkedinClickId);
  return Boolean(attr.isLinkedInReferral || isLiSource || isLiRef || hasLiClick);
}

/**
 * Creates a Jira task DealFlow lead via the Vercel backend (/api/track).
 * Returns the confirmed Jira issue key (e.g. "DI-42") ONLY when Jira confirms creation.
 * Never invents fake IDs and prevents accidental client-side token exposure.
 */
export async function createJiraTask(args: { data: JiraTaskPayload }): Promise<JiraTaskResult> {
  const { data } = args;

  if (!data || typeof data !== "object") {
    throw new Error("Invalid enquiry payload: expected an object");
  }

  const name = sanitizeString(data.name, 100);
  const email = sanitizeString(data.email, 254).toLowerCase();

  if (!name || name.length < 2) {
    throw new Error("Validation error: Full name must be at least 2 characters long");
  }

  if (!email || !isValidEmail(email)) {
    throw new Error("Validation error: A valid business email address is required");
  }

  const company = sanitizeString(data.company, 100);
  const phone = sanitizeString(data.phone, 30);
  const product = sanitizeString(data.product, 150);
  const quantity = sanitizeString(data.quantity, 100);
  const requirements = sanitizeString(data.requirements, 3000);
  const topic = sanitizeString(data.topic, 150);
  const type = sanitizeString(data.type, 100);
  const preferredContact = sanitizeString(data.preferredContact, 50);

  const cleanLabels: string[] = [];
  if (Array.isArray(data.labels)) {
    for (const item of data.labels) {
      if (typeof item === "string") {
        const clean = item
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9-_]/g, "-")
          .slice(0, 30);
        if (clean) cleanLabels.push(clean);
      }
    }
  }

  // 1. YouTube Attribution Detection & Routing Isolation
  const candidateAttribution =
    data.attribution || getYouTubeAttribution() || captureYouTubeAttribution();

  if (hasValidYouTubeAttribution(candidateAttribution)) {
    // ROUTE EXCLUSIVELY TO JIRA PROJECT YLT VIA /api/youtube-lead
    const ytResult = await submitYouTubeLead({
      name,
      email,
      phone: phone || undefined,
      company: company || undefined,
      productInterest: product || topic || undefined,
      requirements: requirements || undefined,
      topic: topic || undefined,
      preferredContact: preferredContact || undefined,
      labels: cleanLabels.length > 0 ? cleanLabels : undefined,
      attribution: candidateAttribution || undefined,
      _hp: data._hp,
    });

    const confirmedKey = ytResult.issueKey || ytResult.jiraKey;
    return {
      success: true,
      duplicate: Boolean(ytResult.duplicate),
      issueKey: confirmedKey,
      jiraKey: confirmedKey,
      projectKey: ytResult.projectKey || "YLT",
      message: ytResult.message || `YouTube lead enquiry registered successfully: ${confirmedKey}`,
    };
  }

  // 2. STANDARD WEBSITE ENQUIRY ROUTING (ROUTES TO LIT IF LINKEDIN ATTRIBUTED, OTHERWISE DI)
  const page = typeof window !== "undefined" ? window.location.pathname : "/";
  const url = typeof window !== "undefined" ? window.location.href : "";
  const referrer = typeof document !== "undefined" ? document.referrer : "";
  const liAttr =
    data.linkedinAttribution ||
    getLinkedInAttribution() ||
    captureLinkedInAttribution();
  const isLinkedIn = hasValidLinkedInAttribution(liAttr);

  const payload = {
    event: "lead",
    name,
    email,
    company: company || undefined,
    phone: phone || undefined,
    product: product || undefined,
    quantity: quantity || undefined,
    requirements: requirements || undefined,
    details: requirements || undefined,
    topic: topic || undefined,
    type: type || "Commercial RFQ / Engineering Enquiry",
    form: type || "Commercial RFQ / Engineering Enquiry",
    preferredContact: preferredContact || undefined,
    labels: cleanLabels.slice(0, 10),
    page,
    url,
    referrer: referrer || liAttr?.referrerUrl || undefined,
    utmSource: liAttr?.utmSource,
    utmMedium: liAttr?.utmMedium,
    utmCampaign: liAttr?.utmCampaign,
    utmContent: liAttr?.utmContent,
    utmTerm: liAttr?.utmTerm,
    isLinkedInReferral: isLinkedIn,
  };

  try {
    const response = await fetch("/api/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
    });

    const responseData = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage =
        responseData?.error ||
        responseData?.message ||
        `Backend submission failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    const resolvedProjectKey = responseData?.projectKey || (isLinkedIn ? "LIT" : "DI");

    if (responseData?.duplicate) {
      const confirmedKey = responseData.jiraKey || responseData.issueKey || undefined;
      return {
        success: true,
        duplicate: true,
        issueKey: confirmedKey,
        jiraKey: confirmedKey,
        projectKey: resolvedProjectKey,
        message:
          responseData.message ||
          "Enquiry already received. Our engineering team will review your specifications shortly.",
      };
    }

    const confirmedIssueKey = responseData?.jiraKey || responseData?.issueKey || undefined;

    if (!confirmedIssueKey) {
      throw new Error(
        responseData?.error ||
          responseData?.message ||
          "Jira issue creation could not be confirmed by the server.",
      );
    }

    return {
      success: true,
      duplicate: false,
      issueKey: confirmedIssueKey,
      jiraKey: confirmedIssueKey,
      projectKey: resolvedProjectKey,
      message: responseData?.message || `Jira issue created successfully: ${confirmedIssueKey}`,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network communication failure while transmitting enquiry to Vercel.");
  }
}

/**
 * Diagnostic helper to verify Jira status without leaking credentials.
 */
export async function testJiraConnection(): Promise<{
  connected: boolean;
  projectKey: string;
  message?: string;
  error?: string;
}> {
  try {
    const res = await fetch("/api/track", {
      method: "OPTIONS",
      signal: AbortSignal.timeout(4000),
    });
    return {
      connected: res.ok,
      projectKey: "DI",
      message: res.ok
        ? "Vercel /api/track endpoint reached and responding."
        : `Endpoint responded with status ${res.status}`,
    };
  } catch (err) {
    return {
      connected: false,
      projectKey: "DI",
      error: err instanceof Error ? err.message : "Connection failed",
    };
  }
}
