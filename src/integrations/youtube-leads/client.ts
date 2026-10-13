/**
 * INDUS Robotics — YouTube Lead Client Bridge
 * Posts leads strictly to the dedicated /api/youtube-lead endpoint.
 * Completely isolated from src/lib/jira.ts and website-to-DI workflows.
 */

import type { YouTubeLeadPayload, YouTubeLeadResponse } from "./types.ts";
import { getYouTubeAttribution, captureYouTubeAttribution } from "./attribution.ts";

function sanitizeString(input: unknown, maxLength: number): string {
  if (typeof input !== "string") return "";
  /* eslint-disable-next-line no-control-regex */
  const cleaned = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
  return cleaned.trim().slice(0, maxLength);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Submits a YouTube-attributed lead enquiry to /api/youtube-lead.
 * Returns the confirmed Jira issue key (e.g. "YTL-12") only when verified by backend.
 */
export async function submitYouTubeLead(payload: YouTubeLeadPayload): Promise<YouTubeLeadResponse> {
  if (!payload || typeof payload !== "object") {
    throw new Error("Invalid YouTube lead payload: expected an object");
  }

  const name = sanitizeString(payload.name, 100);
  const email = sanitizeString(payload.email, 254).toLowerCase();

  if (!name || name.length < 2) {
    throw new Error("Validation error: Full name must be at least 2 characters long");
  }

  if (!email || !isValidEmail(email)) {
    throw new Error("Validation error: A valid business email address is required");
  }

  // Auto-populate attribution if not explicitly provided
  const attribution =
    payload.attribution || getYouTubeAttribution() || captureYouTubeAttribution() || undefined;

  const cleanPayload = {
    name,
    email,
    phone: sanitizeString(payload.phone, 30) || undefined,
    company: sanitizeString(payload.company, 100) || undefined,
    productInterest: sanitizeString(payload.productInterest, 150) || undefined,
    estimatedBudget: sanitizeString(payload.estimatedBudget, 80) || undefined,
    timeline: sanitizeString(payload.timeline, 80) || undefined,
    requirements: sanitizeString(payload.requirements, 3000) || undefined,
    topic: sanitizeString(payload.topic, 150) || undefined,
    preferredContact: sanitizeString(payload.preferredContact, 50) || undefined,
    labels: Array.isArray(payload.labels)
      ? payload.labels
          .map((l) =>
            typeof l === "string"
              ? l
                  .trim()
                  .toLowerCase()
                  .replace(/[^a-z0-9-_]/g, "-")
                  .slice(0, 30)
              : "",
          )
          .filter(Boolean)
          .slice(0, 10)
      : undefined,
    attribution,
    _hp: payload._hp,
  };

  try {
    const response = await fetch("/api/youtube-lead", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(cleanPayload),
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

    const targetProjectKey = responseData?.projectKey || "YLT";

    if (responseData?.duplicate) {
      const issueKey = responseData.jiraKey || responseData.issueKey || undefined;
      return {
        success: true,
        duplicate: true,
        issueKey,
        jiraKey: issueKey,
        projectKey: targetProjectKey,
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
      projectKey: targetProjectKey,
      message:
        responseData?.message ||
        `YouTube lead enquiry registered successfully: ${confirmedIssueKey}`,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network communication failure while transmitting YouTube lead.");
  }
}

/**
 * Explicitly marks a YouTube comment for Jira Project YLT follow-up.
 * Only callable by authorized team members.
 */
export async function escalateYouTubeCommentToJira(payload: {
  commentId: string;
  videoId: string;
  commentText?: string;
  authorDisplayName?: string;
  reason?: string;
}): Promise<{
  success: boolean;
  issueKey: string;
  jiraKey: string;
  projectKey: string;
  followUpStatus: string;
}> {
  if (!payload.commentId || !payload.videoId) {
    throw new Error("commentId and videoId are required for comment escalation");
  }

  const res = await fetch("/api/youtube-sync", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      action: "escalate_comment",
      ...payload,
    }),
    signal: AbortSignal.timeout(10000),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.success) {
    throw new Error(data?.error || `Comment escalation failed with status ${res.status}`);
  }

  return data;
}

/**
 * Retrieves current YouTube synchronization status.
 */
export async function fetchYouTubeSyncStatus(): Promise<Record<string, unknown>> {
  const res = await fetch("/api/youtube-sync", {
    method: "GET",
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch YouTube sync status: ${res.status}`);
  }
  return res.json();
}

/**
 * Triggers automated synchronization of YouTube statistics and comments.
 */
export async function triggerYouTubeSync(
  options: { forceSync?: boolean } = {},
): Promise<Record<string, unknown>> {
  const res = await fetch("/api/youtube-sync", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      action: "sync",
      forceSync: Boolean(options.forceSync),
    }),
    signal: AbortSignal.timeout(15000),
  });
  return res.json();
}
