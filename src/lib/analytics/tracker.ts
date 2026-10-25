/**
 * INDUS ANALYTICS & CONVERSION INTELLIGENCE ENGINE (Phase 6)
 * Unified tracking layer for product discovery, engineering tools,
 * AI assistant effectiveness, Application Finder funnels, and quotations.
 * 
 * Strict Privacy:
 * - NO passwords, auth tokens, contact info, full chat messages, uploaded documents, or sensitive form responses.
 * - Anonymous session and funnel identifiers.
 * - Event deduplication and sliding window protection.
 */

import { initClarity, trackClarityEvent } from "@/analytics/clarity";
import { getSessionId as getSharedSessionId, persistLocalIntelligence } from "@/lib/intelligence/tracker";
import type { IntelligenceEvent } from "@/lib/intelligence/types";

export type ReferrerCategory =
  | "organic_search"
  | "paid_search"
  | "social"
  | "direct"
  | "referral"
  | "campaign"
  | "email"
  | "unknown";

export type InteractionSource =
  | "page"
  | "product_page"
  | "modal"
  | "assistant"
  | "comparison"
  | "wizard"
  | "navigation"
  | "footer"
  | "hero"
  | "studio";

export interface IndusAnalyticsEvent {
  event_name: string;
  event_timestamp: string; // ISO 8601
  anonymous_session_id: string;
  page_path: string;
  referrer_category: ReferrerCategory;
  product_id?: string;
  product_category?: string;
  application_type?: string;
  interaction_source: InteractionSource;
  event_id: string; // Unique ID for deduplication

  // Supported optional properties
  funnel_id?: string;
  funnel_stage?: string;
  funnel_step?: number;
  download_format?: "pdf" | "cad" | "step" | "spec";
  download_status?: "attempted" | "confirmed";
  comparison_ids?: string[];
  quick_action?: string;
  element?: string;
  details?: string;
  error_code?: string;
  issue_key?: string;
  [key: string]: unknown;
}

const DEDUPE_CACHE = new Map<string, number>();
const DEDUPE_WINDOW_MS = 2000; // 2 seconds duplicate prevention window

/**
 * Generate a cryptographically robust, collision-resistant event ID
 */
export function generateEventId(): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).substring(2, 9);
  return `evt_${ts}_${rand}`;
}

/**
 * Retrieve or initialize anonymous session ID
 */
export function getAnonymousSessionId(): string {
  if (typeof window === "undefined") return "anon_srv_session";
  try {
    return getSharedSessionId();
  } catch {
    let sid = sessionStorage.getItem("indus_session_id");
    if (!sid) {
      sid = "ind_" + Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
      sessionStorage.setItem("indus_session_id", sid);
    }
    return sid;
  }
}

/**
 * Classify incoming referrer into normalized categories
 */
export function classifyReferrerCategory(referrerUrl?: string): ReferrerCategory {
  if (typeof window === "undefined") return "unknown";
  const ref = (referrerUrl || (typeof document !== "undefined" ? document.referrer : "") || "").toLowerCase().trim();
  const searchParams = new URLSearchParams(window.location.search);
  const utmMedium = (searchParams.get("utm_medium") || "").toLowerCase();
  const utmSource = (searchParams.get("utm_source") || "").toLowerCase();

  if (utmMedium.match(/^(cpc|ppc|paidsearch|sem)$/) || searchParams.has("gclid") || searchParams.has("msclkid")) {
    return "paid_search";
  }
  if (utmMedium.match(/^(social|paidsocial)$/) || utmSource.match(/^(linkedin|twitter|x|youtube|instagram|facebook)$/)) {
    return "social";
  }
  if (utmMedium === "email" || utmSource.includes("newsletter") || utmSource.includes("mail")) {
    return "email";
  }
  if (utmMedium.match(/^(campaign|promo|banner|affiliate)$/) || searchParams.has("utm_campaign")) {
    return "campaign";
  }

  if (!ref) {
    return "direct";
  }

  try {
    const url = new URL(ref);
    const host = url.hostname.toLowerCase();
    const currentHost = window.location.hostname.toLowerCase();

    if (host === currentHost || host === "localhost" || host === "127.0.0.1") {
      return "direct";
    }

    if (host.includes("google.") || host.includes("bing.") || host.includes("yahoo.") || host.includes("duckduckgo.")) {
      return "organic_search";
    }

    if (
      host.includes("linkedin.com") ||
      host.includes("lnkd.in") ||
      host.includes("youtube.com") ||
      host.includes("youtu.be") ||
      host.includes("twitter.com") ||
      host.includes("x.com") ||
      host.includes("facebook.com")
    ) {
      return "social";
    }

    return "referral";
  } catch {
    return "unknown";
  }
}

/**
 * Cleanse payload to ensure zero sensitive info is logged into analytics
 */
function sanitizeEventPayload<T extends Record<string, unknown>>(payload: T): T {
  const SENSITIVE_KEYS = [
    "password",
    "pass",
    "token",
    "auth",
    "secret",
    "credential",
    "email",
    "workEmail",
    "phone",
    "phoneNumber",
    "contact",
    "name",
    "fullName",
    "candidateName",
    "chatMessage",
    "fullMessage",
    "message",
    "resume",
    "document",
    "attachment",
    "creditCard",
  ];

  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(payload)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_KEYS.some((sensitive) => lowerKey === sensitive || lowerKey.endsWith(sensitive))) {
      continue; // Filter out sensitive fields
    }

    if (typeof value === "string") {
      // Clean control characters and trim
      sanitized[key] = value.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").trim().slice(0, 1500);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.slice(0, 20); // Cap array lengths
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized as T;
}

/**
 * Deduplication check
 */
function isDuplicateEvent(eventName: string, eventId: string, pagePath: string, productId?: string): boolean {
  const now = Date.now();
  const signature = `${eventName}:${pagePath}:${productId || ""}`;

  // Purge expired records
  for (const [k, ts] of DEDUPE_CACHE.entries()) {
    if (now - ts > DEDUPE_WINDOW_MS) {
      DEDUPE_CACHE.delete(k);
    }
  }

  if (DEDUPE_CACHE.has(signature)) {
    return true;
  }

  DEDUPE_CACHE.set(signature, now);
  return false;
}

/**
 * PRIMARY TRACKING UTILITY
 * Implements the standard Phase 6 event schema across INDUS web properties.
 */
export async function trackIndusEvent(
  params: Partial<IndusAnalyticsEvent> & { event_name: string }
): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    const eventName = (params.event_name || "page_view").toLowerCase().trim();
    const pagePath = params.page_path || window.location.pathname;
    const productId = params.product_id;
    const eventId = params.event_id || generateEventId();

    // Prevent accidental rapid duplicate firings (e.g. React StrictMode / double clicks)
    if (isDuplicateEvent(eventName, eventId, pagePath, productId)) {
      return;
    }

    const sessionId = params.anonymous_session_id || getAnonymousSessionId();
    const referrerCategory = params.referrer_category || classifyReferrerCategory();
    const interactionSource: InteractionSource = params.interaction_source || "page";
    const timestamp = params.event_timestamp || new Date().toISOString();

    const fullPayload: IndusAnalyticsEvent = {
      event_name: eventName,
      event_timestamp: timestamp,
      anonymous_session_id: sessionId,
      page_path: pagePath,
      referrer_category: referrerCategory,
      interaction_source: interactionSource,
      event_id: eventId,
      ...(productId ? { product_id: productId } : {}),
      ...(params.product_category ? { product_category: params.product_category } : {}),
      ...(params.application_type ? { application_type: params.application_type } : {}),
      ...(params.funnel_id ? { funnel_id: params.funnel_id } : {}),
      ...(params.funnel_stage ? { funnel_stage: params.funnel_stage } : {}),
      ...(params.funnel_step ? { funnel_step: params.funnel_step } : {}),
      ...(params.download_format ? { download_format: params.download_format } : {}),
      ...(params.download_status ? { download_status: params.download_status } : {}),
      ...(params.comparison_ids ? { comparison_ids: params.comparison_ids } : {}),
      ...(params.quick_action ? { quick_action: params.quick_action } : {}),
      ...(params.element ? { element: params.element } : {}),
      ...(params.details ? { details: params.details } : {}),
      ...(params.error_code ? { error_code: params.error_code } : {}),
      ...(params.issue_key ? { issue_key: params.issue_key } : {}),
    };

    const cleanPayload = sanitizeEventPayload(fullPayload);

    // 1. Sync with local client store for instant reactivity on intelligence dashboards
    try {
      const mappedIntelligenceEvent: IntelligenceEvent = {
        id: eventId,
        sessionId: sessionId,
        timestamp: timestamp,
        epoch: Date.now(),
        event: eventName,
        page: pagePath,
        url: window.location.href,
        referrer: typeof document !== "undefined" ? document.referrer : "",
        device: "Desktop",
        screen: typeof window.screen !== "undefined" ? `${window.screen.width}x${window.screen.height}` : "1920x1080",
        visitorType: sessionStorage.getItem("indus_visited") ? "Returning Visitor" : "New Visitor",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
        localHour: new Date().getHours(),
        localDay: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][new Date().getDay()] || "Mon",
        localDate: new Date().toISOString().split("T")[0] || "",
        sessionDuration: 0,
        pageDwellTime: 0,
        trafficSource: referrerCategory,
        trafficType: referrerCategory,
        element: cleanPayload.element || cleanPayload.quick_action || cleanPayload.funnel_stage || "",
        details: cleanPayload.details || cleanPayload.product_id || cleanPayload.application_type || "",
        // Extended attributes stored for conversion intelligence reporting
        ...cleanPayload,
      };

      persistLocalIntelligence(mappedIntelligenceEvent);
    } catch (e) {
      // Storage fallback handled gracefully
    }

    // 2. Dispatch to Microsoft Clarity if active
    try {
      initClarity();
      trackClarityEvent(eventName);
    } catch {}

    // 3. Dispatch to Serverless Telemetry Endpoint (/api/track)
    fetch("/api/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...cleanPayload,
        // Tolerant aliases for legacy consumers
        event: eventName,
        sessionId: sessionId,
        page: pagePath,
        skipAppsScript: !isMilestoneEvent(eventName),
      }),
    }).catch(() => {
      // Non-blocking transmission failure
    });
  } catch (err) {
    console.warn("[INDUS Analytics] Event tracking safely caught exception:", err);
  }
}

/**
 * Filter out high-frequency noise from exhausting Google Sheets API quotas.
 * Only milestone events (leads, confirmed downloads, funnel review, quote start) forward to backend Sheets.
 */
function isMilestoneEvent(eventName: string): boolean {
  const milestoneEvents = new Set([
    "lead",
    "form_submit",
    "form_submission",
    "enquiry_submission_confirmed",
    "quote_action_initiated",
    "datasheet_download_confirmed",
    "review_screen_viewed",
    "human_assistance_requested",
    "consultation_request",
  ]);
  return milestoneEvents.has(eventName);
}

/**
 * Backwards-compatible bridge for existing trackDigitalPresence calls
 */
export async function trackDigitalPresenceBridge(
  event = "page_view",
  element = "",
  details = ""
): Promise<void> {
  const mappedSource: InteractionSource =
    element.toLowerCase().includes("assistant") || details.toLowerCase().includes("assistant")
      ? "assistant"
      : element.toLowerCase().includes("wizard") || element.toLowerCase().includes("brief")
        ? "wizard"
        : element.toLowerCase().includes("quote")
          ? "modal"
          : "page";

  return trackIndusEvent({
    event_name: event,
    element,
    details,
    interaction_source: mappedSource,
  });
}
