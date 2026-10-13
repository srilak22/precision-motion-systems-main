/**
 * INDUS Robotics — YouTube Lead Attribution Module
 * Strictly isolated storage & query detection for YouTube campaigns.
 */

import type { YouTubeAttribution } from "./types.ts";

const YT_STORAGE_KEY = "__indus_yt_attr";
const YOUTUBE_HOST_REGEX = /(?:^|\.)(?:youtube\.com|youtu\.be)$/i;

/**
 * Checks whether a given URL/referrer originated from YouTube.
 */
export function isYouTubeReferrer(referrerUrl: string): boolean {
  if (!referrerUrl) return false;
  try {
    const parsed = new URL(referrerUrl);
    return YOUTUBE_HOST_REGEX.test(parsed.hostname);
  } catch {
    return false;
  }
}

/**
 * Extracts YouTube video ID from a URL query string or standard YouTube URL format.
 */
export function extractYouTubeVideoId(urlOrSearch: string): string | undefined {
  if (!urlOrSearch) return undefined;
  try {
    // Attempt standard URL parse or search params
    const searchParams = urlOrSearch.includes("?")
      ? new URLSearchParams(urlOrSearch.split("?")[1])
      : new URLSearchParams(urlOrSearch);

    const paramId =
      searchParams.get("v") ||
      searchParams.get("yt_video_id") ||
      searchParams.get("videoId") ||
      searchParams.get("video_id");

    if (paramId) return paramId.trim();

    // Try parsing short url format e.g. youtu.be/<id>
    if (urlOrSearch.includes("youtu.be/")) {
      const match = urlOrSearch.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
      if (match) return match[1];
    }
  } catch {
    // Ignore parsing errors
  }
  return undefined;
}

/**
 * Captures YouTube attribution from the current browser location and referrer.
 * Stores attribution in session storage so it persists across multi-page navigation.
 */
export function captureYouTubeAttribution(): YouTubeAttribution | null {
  if (typeof window === "undefined") return null;

  try {
    const searchParams = new URLSearchParams(window.location.search);
    const referrer = document.referrer || "";
    const isOrganic = isYouTubeReferrer(referrer);

    const utmSource = searchParams.get("utm_source") || (isOrganic ? "youtube" : "");
    const isYouTubeSource = utmSource.toLowerCase().includes("youtube");

    // Only attribute if source is YouTube or referrer is from YouTube
    if (!isYouTubeSource && !isOrganic) {
      return getYouTubeAttribution(); // Return previously captured attribution if present
    }

    const videoId =
      extractYouTubeVideoId(window.location.search) || extractYouTubeVideoId(referrer) || undefined;

    const channelId =
      searchParams.get("channel_id") ||
      searchParams.get("channelId") ||
      searchParams.get("yt_channel") ||
      undefined;

    const campaign =
      searchParams.get("utm_campaign") ||
      searchParams.get("yt_campaign") ||
      searchParams.get("campaign") ||
      undefined;

    const adGroup =
      searchParams.get("yt_adgroup") ||
      searchParams.get("adgroup") ||
      searchParams.get("ad_group") ||
      undefined;

    const utmMedium = searchParams.get("utm_medium") || (isOrganic ? "organic-video" : "video");
    const utmCampaign = searchParams.get("utm_campaign") || campaign;
    const utmContent = searchParams.get("utm_content") || undefined;
    const utmTerm = searchParams.get("utm_term") || undefined;

    const attribution: YouTubeAttribution = {
      videoId,
      channelId,
      campaign,
      adGroup,
      utmSource: utmSource || "youtube",
      utmMedium,
      utmCampaign,
      utmContent,
      utmTerm,
      landingPage: window.location.pathname + window.location.search,
      referrer,
      capturedAt: new Date().toISOString(),
    };

    sessionStorage.setItem(YT_STORAGE_KEY, JSON.stringify(attribution));
    return attribution;
  } catch {
    return null;
  }
}

/**
 * Retrieves currently cached YouTube attribution from session storage.
 */
export function getYouTubeAttribution(): YouTubeAttribution | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(YT_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as YouTubeAttribution;
  } catch {
    return null;
  }
}

/**
 * Returns true if the current session has active YouTube attribution.
 */
export function isYouTubeAttributed(): boolean {
  return getYouTubeAttribution() !== null;
}

/**
 * Clears YouTube attribution from session storage.
 */
export function clearYouTubeAttribution(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(YT_STORAGE_KEY);
  } catch {
    // Ignore error
  }
}
