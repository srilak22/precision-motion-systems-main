/**
 * INDUS Industrial Robotics — LinkedIn Lead Attribution Module
 * Captures and persists LinkedIn referrals & UTM parameters across session navigation.
 */

import type { LinkedInAttribution } from "./types.ts";

const LI_STORAGE_KEY = "__indus_li_attr";
const LINKEDIN_HOST_REGEX = /(?:^|\.)(?:linkedin\.com|lnkd\.in)$/i;

/**
 * Checks whether a given URL or referrer originated from LinkedIn
 */
export function isLinkedInReferrer(referrerUrl: string): boolean {
  if (!referrerUrl) return false;
  try {
    const parsed = new URL(referrerUrl);
    return LINKEDIN_HOST_REGEX.test(parsed.hostname);
  } catch {
    return false;
  }
}

/**
 * Captures LinkedIn attribution from current browser window, query parameters, and document referrer.
 * Stores in sessionStorage to preserve multi-page session attribution.
 */
export function captureLinkedInAttribution(): LinkedInAttribution | null {
  if (typeof window === "undefined") return null;

  try {
    const searchParams = new URLSearchParams(window.location.search);
    const referrer = typeof document !== "undefined" ? document.referrer : "";

    const utmSource = searchParams.get("utm_source") || "";
    const utmMedium = searchParams.get("utm_medium") || "";
    const utmCampaign = searchParams.get("utm_campaign") || "";
    const utmContent = searchParams.get("utm_content") || "";
    const utmTerm = searchParams.get("utm_term") || "";
    const liFatId = searchParams.get("li_fat_id") || ""; // LinkedIn first-party ad tracking

    const hasLinkedInUtm = utmSource.toLowerCase().includes("linkedin");
    const hasLinkedInReferrer = isLinkedInReferrer(referrer);
    const hasLinkedInClick = Boolean(liFatId);

    if (hasLinkedInUtm || hasLinkedInReferrer || hasLinkedInClick) {
      const isPaid = Boolean(
        /^(cpc|paid|ad|sponsored|paidsocial)$/i.test(utmMedium) ||
        /ad|paid|sponsored|promo/i.test(utmCampaign) ||
        hasLinkedInClick
      );

      const leadSource = isPaid ? "LinkedIn Sponsored / Ad" : "LinkedIn Organic";

      const attribution: LinkedInAttribution = {
        isLinkedInReferral: true,
        leadSource,
        utmSource: utmSource || "linkedin",
        utmMedium: utmMedium || (isPaid ? "cpc" : "social"),
        utmCampaign: utmCampaign || undefined,
        utmContent: utmContent || undefined,
        utmTerm: utmTerm || undefined,
        linkedinClickId: liFatId || undefined,
        referrerUrl: referrer || undefined,
        landingPage: window.location.pathname,
        timestamp: new Date().toISOString(),
      };

      sessionStorage.setItem(LI_STORAGE_KEY, JSON.stringify(attribution));
      return attribution;
    }
  } catch {
    // Non-blocking
  }

  return getLinkedInAttribution();
}

/**
 * Retrieves previously captured LinkedIn attribution from sessionStorage
 */
export function getLinkedInAttribution(): LinkedInAttribution | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(LI_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // Ignore parse error
  }
  return null;
}
