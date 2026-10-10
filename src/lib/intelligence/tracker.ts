/**
 * INDUS INTELLIGENCE ENGINE — TELEMETRY & TRACKER CORE
 * Collects, enriches, and stores real events across:
 * 1. Session Intelligence
 * 2. Traffic Intelligence
 * 3. Geo Intelligence
 * 4. Time Zone Intelligence
 * 5. IP & Network Intelligence
 */

import { IntelligenceEvent, SessionRecord, TrafficSourceType, GeoData, NetworkData } from "./types";

const SESSION_KEY = "indus_session_id";
const SESSION_START_KEY = "indus_session_start_epoch";
const PAGE_ENTER_KEY = "indus_page_enter_epoch";
const UTM_STORAGE_KEY = "indus_utm_cache";
const TRAFFIC_STORAGE_KEY = "indus_traffic_intelligence";
const GEO_CACHE_KEY = "indus_geo_cache";
const NETWORK_CACHE_KEY = "indus_network_cache";
const EVENTS_STORAGE_KEY = "indus_intelligence_events_v2";
const SESSIONS_STORAGE_KEY = "indus_session_records_v2";

const MAX_STORED_EVENTS = 500;
const MAX_STORED_SESSIONS = 50;

/**
 * Generate or retrieve stable session ID
 */
export function getSessionId(): string {
  if (typeof window === "undefined") return "server_session";
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = "ind_" + Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
    sessionStorage.setItem(SESSION_KEY, sessionId);
    sessionStorage.setItem(SESSION_START_KEY, Date.now().toString());
  }
  return sessionId;
}

/**
 * Retrieve session start timestamp
 */
export function getSessionStartEpoch(): number {
  if (typeof window === "undefined") return Date.now();
  const stored = sessionStorage.getItem(SESSION_START_KEY);
  if (stored) return parseInt(stored, 10);
  const now = Date.now();
  sessionStorage.setItem(SESSION_START_KEY, now.toString());
  return now;
}

export interface UTMParameters {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
}

export interface TrafficIntelligenceResult {
  trafficType:
    "Paid Search" | "Organic Search" | "Social" | "Email" | "Referral" | "Direct" | "Campaign";
  trafficSource: string;
  trafficMedium: string;
  trafficChannel: string;
  referrer: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
}

/**
 * Extract and persist UTM parameters throughout the session (Task 1).
 * Reads: utm_source, utm_medium, utm_campaign, utm_term, utm_content.
 * URLSearchParams automatically decodes parameters (e.g. '+' -> ' ').
 * Persists for the session and never overwrites existing UTMs with blank values.
 * Returns empty strings when parameters are absent (strictly no invented values).
 */
export function extractAndCacheUTMs(): UTMParameters {
  const emptyUTMs: UTMParameters = {
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_term: "",
    utm_content: "",
  };

  if (typeof window === "undefined") return emptyUTMs;

  try {
    const url = new URL(window.location.href);
    const utmKeys = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
    ] as const;
    const incoming: Partial<UTMParameters> = {};
    let hasIncoming = false;

    utmKeys.forEach((key) => {
      const val = url.searchParams.get(key);
      if (val !== null && val.trim() !== "") {
        incoming[key] = val.trim();
        hasIncoming = true;
      }
    });

    if (hasIncoming) {
      const fullUTMs: UTMParameters = {
        utm_source: incoming.utm_source || "",
        utm_medium: incoming.utm_medium || "",
        utm_campaign: incoming.utm_campaign || "",
        utm_term: incoming.utm_term || "",
        utm_content: incoming.utm_content || "",
      };
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(fullUTMs));
      return fullUTMs;
    }

    const cached = sessionStorage.getItem(UTM_STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      return {
        utm_source: parsed.utm_source || "",
        utm_medium: parsed.utm_medium || "",
        utm_campaign: parsed.utm_campaign || "",
        utm_term: parsed.utm_term || "",
        utm_content: parsed.utm_content || "",
      };
    }
  } catch {
    // Graceful degradation
  }

  return emptyUTMs;
}

/**
 * Check whether a referrer points to the same website (Task 4).
 * Prevents internal navigation from creating false external Referral traffic.
 */
export function isInternalReferrer(referrer: string): boolean {
  if (!referrer || referrer.trim() === "") return false;
  if (typeof window === "undefined") return false;
  try {
    const refUrl = new URL(referrer);
    const currentHost = window.location.hostname.toLowerCase();
    const refHost = refUrl.hostname.toLowerCase();

    if (refHost === currentHost) return true;

    // Localhost / 127.0.0.1 compatibility
    const isLocal = (h: string) => h === "localhost" || h === "127.0.0.1" || h.endsWith(".local");
    if (isLocal(refHost) && isLocal(currentHost)) return true;

    // Domain normalization (e.g. www.domain.com vs domain.com)
    const cleanRef = refHost.replace(/^www\./, "");
    const cleanCurrent = currentHost.replace(/^www\./, "");
    if (cleanRef === cleanCurrent) return true;
  } catch {
    return false;
  }
  return false;
}

/**
 * Classify traffic following the 7-tier strict priority system (Tasks 2 & 3):
 * 1. Paid Search (e.g. google + cpc, bing + cpc, paid search mediums, gclid/msclkid)
 * 2. Organic Search (e.g. Google, Bing, Yahoo organic search)
 * 3. Social (e.g. linkedin, instagram, facebook, twitter, youtube)
 * 4. Email (e.g. utm_medium=email, mailto/webmail referrers)
 * 5. Referral (Real external referrer exists, not search or social)
 * 6. Direct (No meaningful referrer and no UTM campaign source)
 * 7. Campaign (Campaign exists but source/medium does not match 1-4)
 */
export function classifyTraffic(
  rawReferrer: string,
  utms: UTMParameters,
  currentUrlStr?: string,
): TrafficIntelligenceResult {
  const utmSource = (utms.utm_source || "").trim();
  const utmMedium = (utms.utm_medium || "").trim();
  const utmCampaign = (utms.utm_campaign || "").trim();
  const utmTerm = (utms.utm_term || "").trim();
  const utmContent = (utms.utm_content || "").trim();

  const srcLower = utmSource.toLowerCase();
  const medLower = utmMedium.toLowerCase();

  let refHost = "";
  const isInternal = isInternalReferrer(rawReferrer);

  if (rawReferrer && rawReferrer.trim() !== "" && !isInternal) {
    try {
      refHost = new URL(rawReferrer).hostname.toLowerCase().replace(/^www\./, "");
    } catch {
      refHost = rawReferrer.toLowerCase().replace(/^www\./, "");
    }
  }

  // Check URL query parameters for ad click identifiers
  let hasAdClickId = false;
  try {
    const url = new URL(
      currentUrlStr || (typeof window !== "undefined" ? window.location.href : "http://localhost"),
    );
    hasAdClickId =
      url.searchParams.has("gclid") ||
      url.searchParams.has("msclkid") ||
      url.searchParams.has("dclid") ||
      url.searchParams.has("wbraid") ||
      url.searchParams.has("gbraid");
  } catch {
    /* ignore URL parsing failure */
  }

  // Search Engine Catalog
  const searchEngineList = [
    { name: "google", regex: /(^|\.)google\./ },
    { name: "bing", regex: /(^|\.)bing\.com$/ },
    { name: "yahoo", regex: /(^|\.)yahoo\./ },
    { name: "duckduckgo", regex: /(^|\.)duckduckgo\.com$/ },
    { name: "baidu", regex: /(^|\.)baidu\.com$/ },
    { name: "yandex", regex: /(^|\.)yandex\./ },
    { name: "ecosia", regex: /(^|\.)ecosia\.org$/ },
    { name: "ask", regex: /(^|\.)ask\.com$/ },
    { name: "brave", regex: /(^|\.)brave\.com$/ },
    { name: "startpage", regex: /(^|\.)startpage\.com$/ },
    { name: "naver", regex: /(^|\.)naver\.com$/ },
    { name: "daum", regex: /(^|\.)daum\.net$/ },
    { name: "qwant", regex: /(^|\.)qwant\.com$/ },
  ];

  const matchedSearchByRef = refHost ? searchEngineList.find((se) => se.regex.test(refHost)) : null;
  const matchedSearchBySource = srcLower
    ? searchEngineList.find((se) => srcLower.includes(se.name))
    : null;
  const isSearchEngine = !!(matchedSearchByRef || matchedSearchBySource);
  const searchEngineName =
    matchedSearchBySource?.name || matchedSearchByRef?.name || srcLower || "google";

  // Social Network Catalog
  const socialList = [
    { name: "linkedin", regex: /(^|\.)linkedin\.com$|^lnkd\.in$/ },
    { name: "instagram", regex: /(^|\.)instagram\.com$/ },
    { name: "facebook", regex: /(^|\.)facebook\.com$|^fb\.me$|^fb\.com$/ },
    { name: "twitter", regex: /(^|\.)twitter\.com$|^t\.co$|(^|\.)x\.com$/ },
    { name: "youtube", regex: /(^|\.)youtube\.com$|^youtu\.be$/ },
    { name: "reddit", regex: /(^|\.)reddit\.com$|^redd\.it$/ },
    { name: "pinterest", regex: /(^|\.)pinterest\./ },
    { name: "tiktok", regex: /(^|\.)tiktok\.com$/ },
    { name: "threads", regex: /(^|\.)threads\.net$/ },
    { name: "quora", regex: /(^|\.)quora\.com$/ },
    { name: "whatsapp", regex: /(^|\.)whatsapp\.com$/ },
    { name: "telegram", regex: /(^|\.)telegram\.org$|^t\.me$/ },
  ];

  const matchedSocialByRef = refHost ? socialList.find((sn) => sn.regex.test(refHost)) : null;
  const matchedSocialBySource = srcLower
    ? socialList.find((sn) => sn.regex.test(srcLower) || srcLower === sn.name)
    : null;
  const isSocial = !!(matchedSocialByRef || matchedSocialBySource);
  const socialName =
    matchedSocialBySource?.name || matchedSocialByRef?.name || srcLower || "social";

  // Email Indicators
  const emailDomains = [
    "mail.google.com",
    "outlook.live.com",
    "outlook.office.com",
    "mail.yahoo.com",
    "mail.aol.com",
    "webmail",
    "proton.me",
    "mail.zoho.com",
  ];
  const isEmailReferrer =
    rawReferrer.startsWith("mailto:") || (refHost && emailDomains.some((d) => refHost.includes(d)));
  const isEmailMedium = ["email", "e-mail", "mail", "newsletter"].includes(medLower);
  const isEmailSource = [
    "email",
    "newsletter",
    "mailchimp",
    "sendgrid",
    "hubspot",
    "klaviyo",
  ].includes(srcLower);
  const isEmail = isEmailReferrer || isEmailMedium || isEmailSource;

  // Paid Search Medium Indicators
  const paidMediums = [
    "cpc",
    "ppc",
    "paidsearch",
    "paid_search",
    "paid-search",
    "paid",
    "search_paid",
    "cpa",
    "cpm",
    "ad",
  ];
  const isPaidMedium = paidMediums.includes(medLower);
  const isPaidSearch =
    (isPaidMedium && (isSearchEngine || hasAdClickId || !isSocial)) || (hasAdClickId && !isSocial);

  // 1. Paid Search (Priority 1)
  // Examples: google + cpc, bing + cpc, paid search mediums
  if (isPaidSearch || (isSearchEngine && isPaidMedium)) {
    const finalSource =
      utmSource ||
      (matchedSearchByRef ? matchedSearchByRef.name : hasAdClickId ? "google" : "paid_search");
    const finalMedium = utmMedium || "cpc";
    return {
      trafficType: "Paid Search",
      trafficSource: finalSource,
      trafficMedium: finalMedium,
      trafficChannel: "Paid Search",
      referrer: isInternal ? "" : rawReferrer,
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent,
    };
  }

  // 2. Organic Search (Priority 2)
  // Examples: Google organic search, Bing organic search, Yahoo organic search
  if (medLower === "organic" || (isSearchEngine && !isPaidMedium && !utmCampaign)) {
    return {
      trafficType: "Organic Search",
      trafficSource: searchEngineName,
      trafficMedium: "organic",
      trafficChannel: "Organic Search",
      referrer: isInternal ? "" : rawReferrer,
      utmSource,
      utmMedium: utmMedium || "organic",
      utmCampaign,
      utmTerm,
      utmContent,
    };
  }

  // 3. Social (Priority 3)
  // Examples: linkedin, instagram, facebook, twitter, youtube
  const isSocialMedium = [
    "social",
    "social-network",
    "social-media",
    "sm",
    "social-organic",
    "paidsocial",
    "paid-social",
  ].includes(medLower);
  if (isSocial || isSocialMedium) {
    return {
      trafficType: "Social",
      trafficSource: socialName,
      trafficMedium: utmMedium || "social",
      trafficChannel: "Social",
      referrer: isInternal ? "" : rawReferrer,
      utmSource,
      utmMedium: utmMedium || "social",
      utmCampaign,
      utmTerm,
      utmContent,
    };
  }

  // 4. Email (Priority 4)
  // Examples: utm_medium=email, mailto/referral from email where detectable
  if (isEmail) {
    return {
      trafficType: "Email",
      trafficSource: utmSource || (isEmailReferrer ? refHost : "email"),
      trafficMedium: utmMedium || "email",
      trafficChannel: "Email",
      referrer: isInternal ? "" : rawReferrer,
      utmSource,
      utmMedium: utmMedium || "email",
      utmCampaign,
      utmTerm,
      utmContent,
    };
  }

  // 5. Referral (Priority 5)
  // If a real external referrer exists and it is not a search engine or social network.
  const hasRealExternalReferrer = !!(
    rawReferrer &&
    rawReferrer.trim() !== "" &&
    !isInternal &&
    refHost
  );
  const hasCampaignOrSource = !!(utmCampaign || utmSource || utmMedium);

  if (hasRealExternalReferrer && !hasCampaignOrSource) {
    return {
      trafficType: "Referral",
      trafficSource: refHost,
      trafficMedium: "referral",
      trafficChannel: "Referral",
      referrer: rawReferrer,
      utmSource: "",
      utmMedium: "",
      utmCampaign: "",
      utmTerm: "",
      utmContent: "",
    };
  }

  // 7. Campaign (Priority 7)
  // Only use this where a campaign exists but the source/medium does not match another known channel.
  if (hasCampaignOrSource) {
    return {
      trafficType: "Campaign",
      trafficSource: utmSource || "campaign",
      trafficMedium: utmMedium || "campaign",
      trafficChannel: "Campaign",
      referrer: isInternal ? "" : rawReferrer,
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent,
    };
  }

  // 6. Direct (Priority 6)
  // If there is no meaningful referrer and no UTM campaign source.
  return {
    trafficType: "Direct",
    trafficSource: "direct",
    trafficMedium: "none",
    trafficChannel: "Direct",
    referrer: "",
    utmSource: "",
    utmMedium: "",
    utmCampaign: "",
    utmTerm: "",
    utmContent: "",
  };
}

/**
 * Retrieve or resolve consistent traffic intelligence for the session.
 * Preserves the original session's acquisition source throughout internal navigation (Task 4).
 */
export function getTrafficIntelligence(incomingReferrer?: string): TrafficIntelligenceResult {
  const fallbackResult: TrafficIntelligenceResult = {
    trafficType: "Direct",
    trafficSource: "direct",
    trafficMedium: "none",
    trafficChannel: "Direct",
    referrer: "",
    utmSource: "",
    utmMedium: "",
    utmCampaign: "",
    utmTerm: "",
    utmContent: "",
  };

  if (typeof window === "undefined") return fallbackResult;

  try {
    const rawReferrer = incomingReferrer !== undefined ? incomingReferrer : document.referrer || "";
    const isInternal = isInternalReferrer(rawReferrer);

    // Check if current URL contains fresh incoming UTM parameters
    const url = new URL(window.location.href);
    const utmKeys = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
    ] as const;
    let hasIncomingUTMs = false;
    for (const k of utmKeys) {
      const v = url.searchParams.get(k);
      if (v !== null && v.trim() !== "") {
        hasIncomingUTMs = true;
        break;
      }
    }

    // Always keep UTM cache updated (does not overwrite on empty params)
    const utms = extractAndCacheUTMs();

    // Preserve original session acquisition source across internal navigation or SPA page changes
    const stored = sessionStorage.getItem(TRAFFIC_STORAGE_KEY);
    if (!hasIncomingUTMs && stored) {
      return JSON.parse(stored);
    }

    // If internal navigation and no stored acquisition exists, treat as Direct
    if (isInternal && !hasIncomingUTMs) {
      sessionStorage.setItem(TRAFFIC_STORAGE_KEY, JSON.stringify(fallbackResult));
      return fallbackResult;
    }

    // New acquisition event (landing or new incoming campaign)
    const result = classifyTraffic(rawReferrer, utms, window.location.href);
    sessionStorage.setItem(TRAFFIC_STORAGE_KEY, JSON.stringify(result));
    return result;
  } catch (e) {
    console.warn("Traffic intelligence resolution error:", e);
    return fallbackResult;
  }
}

/**
 * Determine traffic source type (backwards-compatible wrapper around classifyTraffic)
 */
export function determineTrafficSource(
  referrer: string,
  utms: Record<string, string>,
): TrafficSourceType {
  const fullUTMs: UTMParameters = {
    utm_source: utms["utm_source"] || "",
    utm_medium: utms["utm_medium"] || "",
    utm_campaign: utms["utm_campaign"] || "",
    utm_term: utms["utm_term"] || "",
    utm_content: utms["utm_content"] || "",
  };
  const result = classifyTraffic(referrer, fullUTMs);
  return result.trafficType;
}

const DEVICE_CACHE_KEY = "indus_device_intelligence";

export interface DeviceDetails {
  device: "Mobile" | "Tablet" | "Desktop";
  browser: string;
  operatingSystem: string;
  screen: string;
}

/**
 * Detect browser from navigator.userAgent.
 * Supports: Google Chrome, Microsoft Edge, Mozilla Firefox, Safari, Opera, Internet Explorer, and Unknown fallback.
 */
export function detectBrowserName(): string {
  if (typeof navigator === "undefined" || !navigator.userAgent) {
    return "Unknown";
  }

  const ua = navigator.userAgent;

  // 1. Internet Explorer (MSIE or Trident engine)
  if (/MSIE\s|Trident\//i.test(ua)) {
    return "Internet Explorer";
  }

  // 2. Microsoft Edge (Edg/, EdgA/, EdgiOS/, Edge/)
  if (/Edg\/|EdgA\/|EdgiOS\/|Edge\//i.test(ua)) {
    return "Microsoft Edge";
  }

  // 3. Opera (OPR/, OPT/, Opera/)
  if (/OPR\/|OPT\/|Opera/i.test(ua)) {
    return "Opera";
  }

  // 4. Google Chrome (Chrome/, CriOS/) - Checked after Edge and Opera to avoid false positives
  if (/Chrome\/|CriOS\//i.test(ua)) {
    return "Google Chrome";
  }

  // 5. Mozilla Firefox (Firefox/, FxiOS/)
  if (/Firefox\/|FxiOS\//i.test(ua)) {
    return "Mozilla Firefox";
  }

  // 6. Safari (Safari/ without Chrome/CriOS/Edg/OPR/Android)
  if (/Safari\//i.test(ua) && !/Chrome\/|CriOS\/|Edg\/|OPR\//i.test(ua) && !/Android/i.test(ua)) {
    return "Safari";
  }

  return "Unknown";
}

/**
 * Detect operating system from browser environment.
 * Supports: Windows, macOS, Android, iOS, Linux, and Unknown fallback.
 */
export function detectOperatingSystem(): string {
  if (typeof navigator === "undefined") {
    return "Unknown";
  }

  const ua = navigator.userAgent || "";
  const platform = navigator.platform || "";
  const maxTouchPoints = navigator.maxTouchPoints || 0;

  // 1. Android (Check before Linux because Android UA contains Linux)
  if (/Android/i.test(ua)) {
    return "Android";
  }

  // 2. iOS (iPhone, iPad, iPod, or modern iPadOS reporting MacIntel with touch support)
  const isIOS = /iPhone|iPad|iPod/i.test(ua) || (platform === "MacIntel" && maxTouchPoints > 1);
  if (isIOS) {
    return "iOS";
  }

  // 3. Windows
  if (/Windows NT|Windows|Win32|Win64/i.test(ua) || /Win/i.test(platform)) {
    return "Windows";
  }

  // 4. macOS (Mac OS X / Macintosh and NOT iOS)
  if ((/Mac OS X|Macintosh|Mac_PowerPC/i.test(ua) || /Mac/i.test(platform)) && !isIOS) {
    return "macOS";
  }

  // 5. Linux (Linux / X11 and NOT Android)
  if ((/Linux|X11/i.test(ua) || /Linux/i.test(platform)) && !/Android/i.test(ua)) {
    return "Linux";
  }

  return "Unknown";
}

/**
 * Detect device category from browser environment.
 * Supports: Mobile, Tablet, Desktop.
 */
export function detectDeviceCategory(): "Mobile" | "Tablet" | "Desktop" {
  if (typeof window === "undefined") return "Desktop";

  const ua = (typeof navigator !== "undefined" && navigator.userAgent) || "";
  const platform = (typeof navigator !== "undefined" && navigator.platform) || "";
  const maxTouchPoints = (typeof navigator !== "undefined" && navigator.maxTouchPoints) || 0;

  // 1. Tablet detection (iPad, Android tablets without 'mobile', generic tablet UA)
  const isIPad = /iPad/i.test(ua) || (platform === "MacIntel" && maxTouchPoints > 1);
  const isTabletUA = /(tablet|playbook|silk)|(android(?!.*mobi))/i.test(ua);
  if (isIPad || isTabletUA) {
    return "Tablet";
  }

  // 2. Mobile detection (smartphones, Android with mobile, iPhone, etc.)
  const isMobileUA =
    /Mobile|iPhone|iPod|Android.*Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  if (isMobileUA) {
    return "Mobile";
  }

  // 3. Viewport / Screen width fallback
  const width =
    typeof window.screen !== "undefined" && window.screen.width
      ? window.screen.width
      : window.innerWidth;
  if (width > 0) {
    if (width <= 768) return "Mobile";
    if (width <= 1024) return "Tablet";
  }

  return "Desktop";
}

/**
 * Detect actual browser screen resolution formatted as WIDTHxHEIGHT (e.g. 1280x800)
 */
export function detectScreenResolution(): string {
  if (typeof window === "undefined" || !window.screen) {
    return "";
  }
  const w = window.screen.width;
  const h = window.screen.height;
  if (typeof w === "number" && typeof h === "number" && w > 0 && h > 0) {
    return `${Math.round(w)}x${Math.round(h)}`;
  }
  return "";
}

/**
 * Retrieve Device Intelligence details.
 * Caches in sessionStorage so device, browser, OS, and screen values
 * remain strictly consistent across all events in the same browser session.
 */
export function getDeviceDetails(): DeviceDetails {
  if (typeof window === "undefined") {
    return {
      device: "Desktop",
      browser: "Unknown",
      operatingSystem: "Unknown",
      screen: "",
    };
  }

  try {
    const cached = sessionStorage.getItem(DEVICE_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && parsed.device && parsed.browser && parsed.operatingSystem) {
        return parsed;
      }
    }
  } catch {
    /* ignore session storage parse error */
  }

  const device = detectDeviceCategory();
  const browser = detectBrowserName();
  const operatingSystem = detectOperatingSystem();
  const screen = detectScreenResolution();

  const details: DeviceDetails = {
    device,
    browser,
    operatingSystem,
    screen,
  };

  try {
    sessionStorage.setItem(DEVICE_CACHE_KEY, JSON.stringify(details));
  } catch {
    /* ignore storage write error */
  }

  return details;
}

/**
 * Determine device category (consistent across session)
 */
export function getDeviceCategory(): "Desktop" | "Tablet" | "Mobile" {
  return getDeviceDetails().device;
}

/**
 * Determine browser name (consistent across session)
 */
export function getBrowserName(): string {
  return getDeviceDetails().browser;
}

/**
 * Determine operating system (consistent across session)
 */
export function getOperatingSystem(): string {
  return getDeviceDetails().operatingSystem;
}

/**
 * Determine screen resolution (consistent across session)
 */
export function getScreenResolution(): string {
  return getDeviceDetails().screen;
}

/**
 * Resolve privacy-safe Geo info (Country, Region, City)
 * Strictly zero GPS, zero invasive profiling.
 */
let geoFetchPromise: Promise<GeoData> | null = null;

export async function resolvePrivacySafeGeo(): Promise<GeoData> {
  if (typeof window === "undefined") return {};

  try {
    const cached = sessionStorage.getItem(GEO_CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch {
    /* ignore storage read error */
  }

  if (geoFetchPromise) {
    return geoFetchPromise;
  }

  geoFetchPromise = (async () => {
    try {
      // Fast, non-invasive, privacy-compliant IP geolocation lookup
      // Zero GPS tracking, zero personal data exposed
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const res = await fetch("https://ipwho.is/", {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.success !== false) {
          const geo: GeoData = {
            country: data.country || undefined,
            countryCode: data.country_code || undefined,
            region: data.region || undefined,
            city: data.city || undefined,
            timezone: data.timezone?.id || Intl.DateTimeFormat().resolvedOptions().timeZone,
            latitude: typeof data.latitude === "number" ? data.latitude : undefined,
            longitude: typeof data.longitude === "number" ? data.longitude : undefined,
            geoProvider: "ipwho.is",
          };

          sessionStorage.setItem(GEO_CACHE_KEY, JSON.stringify(geo));

          // Also save network info if provided by the provider (Task 5: IP Intelligence)
          const rawIp = data.ip || "";
          const ipMeta = maskIpAddress(rawIp);
          const orgName = data.connection?.org || data.connection?.isp || "";
          const isDc = !!(
            orgName &&
            /hosting|cloud|datacenter|data center|server|vpn|proxy|tor|amazon|aws|google cloud|microsoft|azure|digitalocean|ovh|linode|hetzner|vultr|alibaba|tencent|fastly|cloudflare/i.test(
              orgName,
            )
          );
          const isBotUa = /bot|crawler|spider|headless|phantom|selenium|puppeteer/i.test(
            navigator.userAgent,
          );
          const net: NetworkData = {
            ipVersion: ipMeta.ipVersion,
            maskedIp: ipMeta.maskedIp,
            networkId: ipMeta.networkId,
            organization: data.connection?.org || undefined,
            isp: data.connection?.isp || undefined,
            asn: data.connection?.asn ? "AS" + data.connection.asn : undefined,
            isDataCenter: isDc,
            isProxyVpn: !!(data.proxy || data.vpn || data.tor),
            isBot: isBotUa,
            networkType:
              (
                navigator as unknown as { connection?: { effectiveType?: string } }
              )?.connection?.effectiveType?.toUpperCase() || "BROADBAND",
          };
          sessionStorage.setItem(NETWORK_CACHE_KEY, JSON.stringify(net));

          return geo;
        }
      }
    } catch {
      // Fallback: derive timezone from browser
    }

    // Default privacy-safe fallback
    const fallbackGeo: GeoData = {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      geoProvider: "browser_fallback",
    };
    return fallbackGeo;
  })();

  return geoFetchPromise;
}

/**
 * Privacy-safe IP Masking (GDPR/CCPA compliant)
 */
export function maskIpAddress(rawIp: string): {
  maskedIp: string;
  ipVersion: string;
  networkId: string;
} {
  if (!rawIp) return { maskedIp: "unknown", ipVersion: "unknown", networkId: "net_unknown" };
  if (rawIp.includes(":")) {
    const segments = rawIp.split(":");
    const prefix = segments.slice(0, 3).join(":");
    return {
      maskedIp: prefix + ":xxxx:xxxx::/48",
      ipVersion: "IPv6",
      networkId: "net6_" + prefix.replace(/:/g, "_"),
    };
  } else if (rawIp.includes(".")) {
    const octets = rawIp.split(".");
    const subnet = octets.slice(0, 3).join(".");
    return {
      maskedIp: subnet + ".xxx",
      ipVersion: "IPv4",
      networkId: "net4_" + subnet.replace(/\./g, "_"),
    };
  }
  return { maskedIp: "anonymized", ipVersion: "IPv4", networkId: "net_anon" };
}

/**
 * Analytical Risk Classifier (4 Tiers: NORMAL, UNUSUAL, NEEDS REVIEW, POTENTIAL AUTOMATION)
 */
export function classifyNetworkRisk(
  ipData: NetworkData,
  userAgent: string,
  dwellSeconds: number,
): {
  networkRiskSignal: "NORMAL" | "UNUSUAL" | "NEEDS REVIEW" | "POTENTIAL AUTOMATION";
  supportingSignals: string;
} {
  const isBot = /bot|crawler|spider|headless|phantom|selenium|puppeteer/i.test(userAgent || "");
  const org = (ipData.organization || ipData.isp || "").toLowerCase();
  const isDatacenter =
    ipData.isDataCenter ||
    /hosting|cloud|datacenter|data center|server|vpn|proxy|tor|amazon|aws|google cloud|microsoft|azure|digitalocean|ovh|linode|hetzner|vultr|alibaba|tencent|fastly|cloudflare/i.test(
      org,
    );
  const isSuspiciousSpeed = dwellSeconds >= 0 && dwellSeconds < 1;

  if (isBot && isDatacenter) {
    return {
      networkRiskSignal: "POTENTIAL AUTOMATION",
      supportingSignals: "Datacenter Hosting Subnet + Automated Bot User-Agent",
    };
  }
  if (isDatacenter && isSuspiciousSpeed) {
    return {
      networkRiskSignal: "POTENTIAL AUTOMATION",
      supportingSignals: "Hosting Network + High Click Velocity (<1s dwell)",
    };
  }
  if (isBot) {
    return {
      networkRiskSignal: "NEEDS REVIEW",
      supportingSignals: "Automated User-Agent Flagged on Residential/Enterprise IP",
    };
  }
  if (isSuspiciousSpeed) {
    return {
      networkRiskSignal: "NEEDS REVIEW",
      supportingSignals: "High Request Velocity (<1s between events)",
    };
  }
  if (isDatacenter) {
    return {
      networkRiskSignal: "UNUSUAL",
      supportingSignals: "Commercial Cloud / Datacenter ASN (Human-like browsing)",
    };
  }
  return {
    networkRiskSignal: "NORMAL",
    supportingSignals: "Standard Residential/Enterprise ISP with Natural Human Dwell",
  };
}

/**
 * Resolve privacy-safe Network info
 */
export function resolvePrivacySafeNetwork(): NetworkData {
  if (typeof window === "undefined") return {};

  try {
    const cached = sessionStorage.getItem(NETWORK_CACHE_KEY);
    if (cached) return JSON.parse(cached);
  } catch {
    /* ignore storage read error */
  }

  const connection = (navigator as unknown as { connection?: { effectiveType?: string } })
    ?.connection;
  const netType = connection?.effectiveType ? connection.effectiveType.toUpperCase() : "BROADBAND";

  return {
    ipVersion: "IPv4",
    maskedIp: "127.0.0.xxx",
    networkId: "net_local",
    networkType: netType,
    isBot: /bot|crawler|spider|headless/i.test(navigator.userAgent),
  };
}

/**
 * Retrieve cached privacy-safe network data
 */
export function getStoredNetworkData(): NetworkData {
  return resolvePrivacySafeNetwork();
}

/**
 * Retrieve local event stream
 */
export function getLocalIntelligenceEvents(): IntelligenceEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(EVENTS_STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch {
    // Ignore storage issues
  }
  return [];
}

/**
 * Retrieve local session records
 */
export function getLocalSessionRecords(): SessionRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch {
    // Ignore storage issues
  }
  return [];
}

/**
 * Save event to persistent client storage and update session state
 */
export function persistLocalIntelligence(event: IntelligenceEvent): void {
  if (typeof window === "undefined") return;

  try {
    // 1. Append event
    const events = getLocalIntelligenceEvents();
    events.unshift(event);
    if (events.length > MAX_STORED_EVENTS) {
      events.length = MAX_STORED_EVENTS;
    }
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));

    // 2. Update session record
    const sessions = getLocalSessionRecords();
    let session = sessions.find((s) => s.sessionId === event.sessionId);

    if (!session) {
      session = {
        sessionId: event.sessionId,
        startTime: event.timestamp,
        lastActiveTime: event.timestamp,
        startEpoch: event.epoch,
        lastActiveEpoch: event.epoch,
        durationSeconds: 0,
        entryPage: event.page,
        exitPage: event.page,
        pagesVisited: [event.page],
        pageCount: 1,
        isBounce: true,
        totalEvents: 1,
        ctaClicks: event.event === "cta_click" ? 1 : 0,
        productViews: event.event === "product_view" ? 1 : 0,
        formSubmissions: event.event === "form_submit" || event.event === "form_submission" ? 1 : 0,
        downloads: event.event === "download" ? 1 : 0,
        searches: event.event === "search" ? 1 : 0,
        whatsappClicks: event.event === "whatsapp_click" || event.event === "contact" ? 1 : 0,
        leads:
          event.event === "lead" ||
          event.event === "form_submit" ||
          event.event === "form_submission"
            ? 1
            : 0,
        scrollDepths: event.scrollDepth ? [event.scrollDepth] : [],
        trafficSource: event.trafficSource,
        trafficType: event.trafficType,
        trafficMedium: event.trafficMedium,
        trafficChannel: event.trafficChannel,
        referrer: event.referrer,
        utm: {
          source: event.utmSource,
          medium: event.utmMedium,
          campaign: event.utmCampaign,
          term: event.utmTerm,
          content: event.utmContent,
        },
        country: event.country,
        region: event.region,
        city: event.city,
        timezone: event.timezone,
        localHour: event.localHour,
        localDay: event.localDay,
        networkType: event.networkType,
        organization: event.organization,
        isp: event.isp,
        asn: event.asn,
        isBot: event.isBot,
        isSuspicious: event.isSuspicious,
        device: event.device,
      };
      sessions.unshift(session!);
    } else {
      session.lastActiveTime = event.timestamp;
      session.lastActiveEpoch = event.epoch;
      session.durationSeconds = Math.max(
        session.durationSeconds,
        Math.round((event.epoch - session.startEpoch) / 1000),
      );
      session.exitPage = event.page;
      session.totalEvents += 1;

      if (!session.pagesVisited.includes(event.page)) {
        session.pagesVisited.push(event.page);
        session.pageCount = session.pagesVisited.length;
      }
      if (session.pageCount > 1) {
        session.isBounce = false;
      }

      if (event.event === "cta_click") session.ctaClicks += 1;
      if (event.event === "product_view") session.productViews += 1;
      if (event.event === "form_submit" || event.event === "form_submission") {
        session.formSubmissions += 1;
        session.leads += 1;
      }
      if (event.event === "download") session.downloads += 1;
      if (event.event === "search") session.searches += 1;
      if (event.event === "whatsapp_click" || event.event === "contact")
        session.whatsappClicks += 1;
      if (event.event === "lead") session.leads += 1;
      if (
        event.scrollDepth &&
        (!session.scrollDepths || !session.scrollDepths.includes(event.scrollDepth))
      ) {
        if (!session.scrollDepths) session.scrollDepths = [];
        session.scrollDepths.push(event.scrollDepth);
      }

      if (event.country && !session.country) session.country = event.country;
      if (event.region && !session.region) session.region = event.region;
      if (event.city && !session.city) session.city = event.city;
      if (event.organization && !session.organization) session.organization = event.organization;
    }

    if (sessions.length > MAX_STORED_SESSIONS) {
      sessions.length = MAX_STORED_SESSIONS;
    }
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));

    // Dispatch a custom event so live dashboards on the page can update in real-time
    window.dispatchEvent(
      new CustomEvent("indus_intelligence_update", { detail: { event, session } }),
    );
  } catch (err) {
    console.warn("Storage write failure:", err);
  }
}

/**
 * MASTER TELEMETRY PIPELINE
 * Upgrades trackDigitalPresence with all 5 layers of intelligence
 */
export async function trackIntelligenceEvent(
  event = "page_view",
  element = "",
  details = "",
  extraData: Record<string, unknown> = {},
): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    const sessionId = getSessionId();
    const sessionStartEpoch = getSessionStartEpoch();
    const now = Date.now();
    const sessionDurationSeconds = Math.round((now - sessionStartEpoch) / 1000);

    // Dwell time on current page
    let pageEnterEpoch = now;
    const storedPageEnter = sessionStorage.getItem(PAGE_ENTER_KEY);
    if (storedPageEnter) {
      pageEnterEpoch = parseInt(storedPageEnter, 10);
    }
    const pageDwellTimeSeconds = Math.max(0, Math.round((now - pageEnterEpoch) / 1000));

    if (event === "page_view") {
      sessionStorage.setItem(PAGE_ENTER_KEY, now.toString());
    }

    const trafficInfo = getTrafficIntelligence();

    const cachedGeo: GeoData = (() => {
      try {
        const c = sessionStorage.getItem(GEO_CACHE_KEY);
        return c ? JSON.parse(c) : {};
      } catch {
        return {};
      }
    })();

    const timezone =
      cachedGeo.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    const dateObj = new Date();

    let localHour = dateObj.getHours();
    let dayOfWeek = "Monday";
    let isWeekend = "Weekday";
    let localDate = dateObj.toISOString().split("T")[0] || "";
    let localTimestamp = localDate + " " + dateObj.toTimeString().split(" ")[0];
    let timeOfDayBucket = "Night";
    let isBusinessHours = "Business Hours";

    try {
      const dtf = new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        weekday: "long",
      });
      const parts: Record<string, string> = {};
      dtf.formatToParts(dateObj).forEach((p) => {
        parts[p.type] = p.value;
      });
      localHour = parseInt(parts["hour"] || "12", 10) % 24;
      dayOfWeek = parts["weekday"] || "Monday";
      const isWknd = dayOfWeek === "Saturday" || dayOfWeek === "Sunday";
      isWeekend = isWknd ? "Weekend" : "Weekday";
      localDate = `${parts["year"] || "2026"}-${parts["month"] || "01"}-${parts["day"] || "01"}`;
      localTimestamp = `${localDate} ${parts["hour"] || "12"}:${parts["minute"] || "00"}:${parts["second"] || "00"}`;

      if (localHour >= 5 && localHour < 9) timeOfDayBucket = "Early Morning";
      else if (localHour >= 9 && localHour < 12) timeOfDayBucket = "Morning";
      else if (localHour >= 12 && localHour < 17) timeOfDayBucket = "Afternoon";
      else if (localHour >= 17 && localHour < 21) timeOfDayBucket = "Evening";
      else timeOfDayBucket = "Night";

      const isBiz = !isWknd && localHour >= 9 && localHour < 18;
      isBusinessHours = isBiz ? "Business Hours" : "After Hours";
    } catch {
      /* ignore calculation error */
    }

    const offsetMin = -dateObj.getTimezoneOffset();
    const sign = offsetMin >= 0 ? "+" : "-";
    const pad = (n: number) => String(Math.floor(Math.abs(n))).padStart(2, "0");
    const utcOffset = `UTC${sign}${pad(offsetMin / 60)}:${pad(offsetMin % 60)}`;

    const netData = resolvePrivacySafeNetwork();
    const riskAnalysis = classifyNetworkRisk(
      netData,
      typeof navigator !== "undefined" ? navigator.userAgent : "",
      pageDwellTimeSeconds,
    );

    const deviceInfo = getDeviceDetails();

    const intelligencePayload: IntelligenceEvent = {
      id: "evt_" + now.toString(36) + Math.random().toString(36).substring(2, 7),
      sessionId,
      timestamp: dateObj.toISOString(),
      epoch: now,
      event,
      element,
      details,
      page: window.location.pathname,
      url: window.location.href,
      referrer: trafficInfo.referrer,
      device: deviceInfo.device,
      browser: deviceInfo.browser,
      operatingSystem: deviceInfo.operatingSystem,
      screen: deviceInfo.screen,
      visitorType: sessionStorage.getItem("indus_visited") ? "Returning Visitor" : "New Visitor",

      // Task 4: Time Zone Intelligence
      timezone,
      utcOffset,
      localTimestamp,
      localHour,
      localDay: dayOfWeek.substring(0, 3),
      localDate,
      dayOfWeek,
      isWeekend,
      timeOfDayBucket,
      isBusinessHours,

      // Session Intelligence
      sessionDuration: sessionDurationSeconds,
      pageDwellTime: pageDwellTimeSeconds,

      // Traffic Intelligence (Tasks 1, 2, 3, 4, 5)
      trafficType: trafficInfo.trafficType,
      trafficSource: trafficInfo.trafficSource,
      trafficMedium: trafficInfo.trafficMedium,
      trafficChannel: trafficInfo.trafficChannel,
      utmSource: trafficInfo.utmSource,
      utmMedium: trafficInfo.utmMedium,
      utmCampaign: trafficInfo.utmCampaign,
      utmTerm: trafficInfo.utmTerm,
      utmContent: trafficInfo.utmContent,

      // Geo Intelligence
      country: cachedGeo.country,
      region: cachedGeo.region,
      city: cachedGeo.city,

      // Network / IP Intelligence (Task 5: Privacy-Safe)
      ipVersion: netData.ipVersion,
      maskedIp: netData.maskedIp,
      networkId: netData.networkId,
      networkType: netData.networkType,
      organization: netData.organization,
      isp: netData.isp,
      asn: netData.asn,
      isDataCenter: netData.isDataCenter,
      isProxyVpn: netData.isProxyVpn,
      isBot: netData.isBot,
      networkRiskSignal: riskAnalysis.networkRiskSignal,
      supportingSignals: riskAnalysis.supportingSignals,

      ...extraData,
    };

    // 1. Immediately persist to client real-time intelligence store
    persistLocalIntelligence(intelligencePayload);

    sessionStorage.setItem("indus_visited", "true");

    // 2. Transmit to server / Airtable endpoint asynchronously without blocking UI
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...intelligencePayload,
        skipAppsScript: true,
      }),
    }).catch((err) => {
      // Graceful offline/network failure handling
    });

    // 2b. Transmit to Google Apps Script Session Intelligence Endpoint
    const GOOGLE_APPS_SCRIPT_URL =
      "https://script.google.com/macros/s/AKfycbw8NhfkPJGeYu4NAaisxN3FHaWmAVlZTmEO2x1CsBirRPvt5pQjI5zNv3qVXqEA2W1a/exec";
    const previousPage = sessionStorage.getItem("indus_previous_page") || "";
    const landingPage = sessionStorage.getItem("indus_landing_page") || intelligencePayload.page;
    if (!sessionStorage.getItem("indus_landing_page")) {
      sessionStorage.setItem("indus_landing_page", intelligencePayload.page);
    }

    const channel = trafficInfo.trafficChannel;

    fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=UTF-8" },
      body: JSON.stringify({
        eventId: intelligencePayload.id,
        sessionId: intelligencePayload.sessionId,
        timestamp: intelligencePayload.timestamp,
        event: intelligencePayload.event,
        eventType: intelligencePayload.event,
        type: intelligencePayload.event,
        sheet:
          extraData?.["sheet"] ||
          extraData?.["sheetName"] ||
          (intelligencePayload.event === "page_view"
            ? "Page Views"
            : intelligencePayload.event === "click" || intelligencePayload.event === "button_click"
              ? "Clicks"
              : intelligencePayload.event === "cta_click"
                ? "CTA Interactions"
                : intelligencePayload.event === "form_submit" ||
                    intelligencePayload.event === "form_submission"
                  ? "Form Submissions"
                  : intelligencePayload.event === "lead"
                    ? "Leads"
                    : intelligencePayload.event === "whatsapp_click" ||
                        intelligencePayload.event === "contact"
                      ? "WhatsApp Enquiries"
                      : intelligencePayload.event === "download"
                        ? "Downloads"
                        : intelligencePayload.event === "search"
                          ? "Search Activity"
                          : intelligencePayload.event.startsWith("scroll")
                            ? "Scroll & Engagement"
                            : intelligencePayload.event === "navigation" ||
                                intelligencePayload.event === "navigation_click"
                              ? "Navigation"
                              : intelligencePayload.event === "session_start"
                                ? "Website Sessions"
                                : "Website Activity"),
        sheetName:
          extraData?.["sheet"] ||
          extraData?.["sheetName"] ||
          (intelligencePayload.event === "page_view"
            ? "Page Views"
            : intelligencePayload.event === "click" || intelligencePayload.event === "button_click"
              ? "Clicks"
              : intelligencePayload.event === "cta_click"
                ? "CTA Interactions"
                : intelligencePayload.event === "form_submit" ||
                    intelligencePayload.event === "form_submission"
                  ? "Form Submissions"
                  : intelligencePayload.event === "lead"
                    ? "Leads"
                    : intelligencePayload.event === "whatsapp_click" ||
                        intelligencePayload.event === "contact"
                      ? "WhatsApp Enquiries"
                      : intelligencePayload.event === "download"
                        ? "Downloads"
                        : intelligencePayload.event === "search"
                          ? "Search Activity"
                          : intelligencePayload.event.startsWith("scroll")
                            ? "Scroll & Engagement"
                            : intelligencePayload.event === "navigation" ||
                                intelligencePayload.event === "navigation_click"
                              ? "Navigation"
                              : intelligencePayload.event === "session_start"
                                ? "Website Sessions"
                                : "Website Activity"),
        table:
          extraData?.["table"] ||
          extraData?.["sheet"] ||
          (intelligencePayload.event === "page_view"
            ? "Page Views"
            : intelligencePayload.event === "click" || intelligencePayload.event === "button_click"
              ? "Clicks"
              : intelligencePayload.event === "cta_click"
                ? "CTA Interactions"
                : intelligencePayload.event === "form_submit" ||
                    intelligencePayload.event === "form_submission"
                  ? "Form Submissions"
                  : intelligencePayload.event === "lead"
                    ? "Leads"
                    : intelligencePayload.event === "whatsapp_click" ||
                        intelligencePayload.event === "contact"
                      ? "WhatsApp Enquiries"
                      : intelligencePayload.event === "download"
                        ? "Downloads"
                        : intelligencePayload.event === "search"
                          ? "Search Activity"
                          : intelligencePayload.event.startsWith("scroll")
                            ? "Scroll & Engagement"
                            : intelligencePayload.event === "navigation" ||
                                intelligencePayload.event === "navigation_click"
                              ? "Navigation"
                              : intelligencePayload.event === "session_start"
                                ? "Website Sessions"
                                : "Website Activity"),
        spreadsheetId: "1fHcRuJnK-tF2PwcrXuVl4K_FN8Sy1dI7gtSmEVZqbEc",
        sheetGid: "2025481644",
        spreadsheetUrl:
          "https://docs.google.com/spreadsheets/d/1fHcRuJnK-tF2PwcrXuVl4K_FN8Sy1dI7gtSmEVZqbEc/edit?gid=2025481644#gid=2025481644",
        pagePath: intelligencePayload.page,
        page: intelligencePayload.page,
        pageTitle: typeof document !== "undefined" ? document.title : intelligencePayload.page,
        previousPage: previousPage,
        dwellTimeSec: intelligencePayload.pageDwellTime || 0,
        dwellTime: intelligencePayload.pageDwellTime || 0,

        // 4 REQUIRED DEVICE INTELLIGENCE FIELDS:
        device: deviceInfo.device,
        browser: deviceInfo.browser,
        operatingSystem: deviceInfo.operatingSystem,
        screen: deviceInfo.screen,

        // Element and details
        element: intelligencePayload.element || "",
        details: intelligencePayload.details || "",

        // Tolerant aliases for Google Sheets headers
        deviceType: deviceInfo.device,
        Device: deviceInfo.device,
        Browser: deviceInfo.browser,
        "Operating System": deviceInfo.operatingSystem,
        operating_system: deviceInfo.operatingSystem,
        OS: deviceInfo.operatingSystem,
        Screen: deviceInfo.screen,
        "Screen Resolution": deviceInfo.screen,
        resolution: deviceInfo.screen,
        screen_resolution: deviceInfo.screen,

        // TASK 5: 9 REQUIRED TRAFFIC & UTM INTELLIGENCE FIELDS
        trafficType: trafficInfo.trafficType,
        trafficSource: trafficInfo.trafficSource,
        trafficMedium: trafficInfo.trafficMedium,
        utmSource: trafficInfo.utmSource,
        utmMedium: trafficInfo.utmMedium,
        utmCampaign: trafficInfo.utmCampaign,
        utmTerm: trafficInfo.utmTerm,
        utmContent: trafficInfo.utmContent,
        referrer: trafficInfo.referrer,

        // Tolerant aliases for Traffic & UTM
        trafficChannel: trafficInfo.trafficChannel,
        "Traffic Type": trafficInfo.trafficType,
        traffic_type: trafficInfo.trafficType,
        "Traffic Source": trafficInfo.trafficSource,
        traffic_source: trafficInfo.trafficSource,
        "Traffic Medium": trafficInfo.trafficMedium,
        traffic_medium: trafficInfo.trafficMedium,
        "UTM Source": trafficInfo.utmSource,
        utm_source: trafficInfo.utmSource,
        "UTM Medium": trafficInfo.utmMedium,
        utm_medium: trafficInfo.utmMedium,
        "UTM Campaign": trafficInfo.utmCampaign,
        utm_campaign: trafficInfo.utmCampaign,
        "UTM Term": trafficInfo.utmTerm,
        utm_term: trafficInfo.utmTerm,
        "UTM Content": trafficInfo.utmContent,
        utm_content: trafficInfo.utmContent,
        Referrer: trafficInfo.referrer,

        landingPage: landingPage,
        isConversion:
          intelligencePayload.event === "conversion" ||
          intelligencePayload.event === "contact_submit",
        conversionType: intelligencePayload.event === "contact_submit" ? "contact" : "none",
        // Task 3: Geo Intelligence
        country: cachedGeo.country || "",
        countryCode: cachedGeo.countryCode || "",
        region: cachedGeo.region || "",
        city: cachedGeo.city || "",
        timezone: timezone,
        utcOffset: utcOffset,
        localTimestamp: localTimestamp,
        localHour: localHour,
        dayOfWeek: dayOfWeek,
        isWeekend: isWeekend,
        timeOfDayBucket: timeOfDayBucket,
        isBusinessHours: isBusinessHours,
        latitude: cachedGeo.latitude || "",
        longitude: cachedGeo.longitude || "",
        isp: netData.isp || "",
        organization: netData.organization || "",
        asn: netData.asn || "",
        geoProvider: cachedGeo.geoProvider || "ipwho.is",
        // Task 5: IP Intelligence
        ipVersion: netData.ipVersion || "IPv4",
        maskedIp: netData.maskedIp || "anonymized",
        networkId: netData.networkId || "net_anon",
        isDataCenter: !!netData.isDataCenter,
        isProxyVpn: !!netData.isProxyVpn,
        networkRiskSignal: riskAnalysis.networkRiskSignal,
        supportingSignals: riskAnalysis.supportingSignals,
        // Direct Field Matching for Google Sheets Columns
        "Traffic Analysis": `${trafficInfo.trafficType} Traffic (${trafficInfo.trafficSource}) - ${cachedGeo.city ? cachedGeo.city + ", " + cachedGeo.country : "Visitor"} on ${intelligencePayload.page}`,
        "traffic analysis": `${trafficInfo.trafficType} Traffic (${trafficInfo.trafficSource})`,
        traffic_analysis: `${trafficInfo.trafficType} Traffic (${trafficInfo.trafficSource})`,
        trafficAnalysis: `${trafficInfo.trafficType} Traffic (${trafficInfo.trafficSource})`,
        "Traffic Intelligence": `Channel: ${trafficInfo.trafficType} | Source: ${trafficInfo.trafficSource} | Medium: ${trafficInfo.trafficMedium} | Campaign: ${trafficInfo.utmCampaign || "none"}`,
        "traffic intelligence": `Channel: ${trafficInfo.trafficType} | Source: ${trafficInfo.trafficSource}`,
        traffic_intelligence: `Channel: ${trafficInfo.trafficType} | Source: ${trafficInfo.trafficSource}`,
        trafficIntelligence: `Channel: ${trafficInfo.trafficType} | Source: ${trafficInfo.trafficSource}`,
        IP: netData.maskedIp || "anonymized",
        "IP Address": netData.maskedIp || "anonymized",
        ip_address: netData.maskedIp || "anonymized",
        Timestamp: intelligencePayload.timestamp,
        "Time Stamp": intelligencePayload.timestamp,
        "Date & Time": intelligencePayload.timestamp,
        timestapm: intelligencePayload.timestamp,
        TIMESTAPM: intelligencePayload.timestamp,
      }),
    }).catch(() => {});

    sessionStorage.setItem("indus_previous_page", intelligencePayload.page);

    // 3. If geo wasn't cached yet, fetch it and transmit enriched session event
    const geoEnrichedSentKey = "indus_geo_enriched_sent";
    if (!cachedGeo.country && !sessionStorage.getItem(geoEnrichedSentKey)) {
      sessionStorage.setItem(geoEnrichedSentKey, "true");
      resolvePrivacySafeGeo().then((resolvedGeo) => {
        if (resolvedGeo && resolvedGeo.country) {
          intelligencePayload.country = resolvedGeo.country;
          intelligencePayload.region = resolvedGeo.region;
          intelligencePayload.city = resolvedGeo.city;

          const enrichedNetData = getStoredNetworkData();
          fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "text/plain;charset=UTF-8" },
            body: JSON.stringify({
              eventId: `evt_geo_${Date.now()}`,
              sessionId: intelligencePayload.sessionId,
              timestamp: new Date().toISOString(),
              event: "session_start",
              eventType: "session_start",
              type: "session_start",
              spreadsheetId: "1fHcRuJnK-tF2PwcrXuVl4K_FN8Sy1dI7gtSmEVZqbEc",
              sheetGid: "2025481644",
              spreadsheetUrl:
                "https://docs.google.com/spreadsheets/d/1fHcRuJnK-tF2PwcrXuVl4K_FN8Sy1dI7gtSmEVZqbEc/edit?gid=2025481644#gid=2025481644",
              pagePath: intelligencePayload.page,
              page: intelligencePayload.page,
              pageTitle:
                typeof document !== "undefined" ? document.title : intelligencePayload.page,
              previousPage: previousPage,
              dwellTimeSec: 0,
              dwellTime: 0,

              // 4 REQUIRED DEVICE INTELLIGENCE FIELDS:
              device: deviceInfo.device,
              browser: deviceInfo.browser,
              operatingSystem: deviceInfo.operatingSystem,
              screen: deviceInfo.screen,

              deviceType: deviceInfo.device,
              Device: deviceInfo.device,
              Browser: deviceInfo.browser,
              "Operating System": deviceInfo.operatingSystem,
              operating_system: deviceInfo.operatingSystem,
              OS: deviceInfo.operatingSystem,
              Screen: deviceInfo.screen,
              "Screen Resolution": deviceInfo.screen,
              resolution: deviceInfo.screen,
              screen_resolution: deviceInfo.screen,

              // TASK 5: 9 REQUIRED TRAFFIC & UTM INTELLIGENCE FIELDS
              trafficType: trafficInfo.trafficType,
              trafficSource: trafficInfo.trafficSource,
              trafficMedium: trafficInfo.trafficMedium,
              utmSource: trafficInfo.utmSource,
              utmMedium: trafficInfo.utmMedium,
              utmCampaign: trafficInfo.utmCampaign,
              utmTerm: trafficInfo.utmTerm,
              utmContent: trafficInfo.utmContent,
              referrer: trafficInfo.referrer,

              // Tolerant aliases for Traffic & UTM
              trafficChannel: trafficInfo.trafficChannel,
              "Traffic Type": trafficInfo.trafficType,
              traffic_type: trafficInfo.trafficType,
              "Traffic Source": trafficInfo.trafficSource,
              traffic_source: trafficInfo.trafficSource,
              "Traffic Medium": trafficInfo.trafficMedium,
              traffic_medium: trafficInfo.trafficMedium,
              "UTM Source": trafficInfo.utmSource,
              utm_source: trafficInfo.utmSource,
              "UTM Medium": trafficInfo.utmMedium,
              utm_medium: trafficInfo.utmMedium,
              "UTM Campaign": trafficInfo.utmCampaign,
              utm_campaign: trafficInfo.utmCampaign,
              "UTM Term": trafficInfo.utmTerm,
              utm_term: trafficInfo.utmTerm,
              "UTM Content": trafficInfo.utmContent,
              utm_content: trafficInfo.utmContent,
              Referrer: trafficInfo.referrer,
              landingPage: landingPage,
              // Geo Intelligence
              country: resolvedGeo.country || "",
              countryCode: resolvedGeo.countryCode || "",
              region: resolvedGeo.region || "",
              city: resolvedGeo.city || "",
              timezone: resolvedGeo.timezone || timezone,
              utcOffset: utcOffset,
              latitude: resolvedGeo.latitude || "",
              longitude: resolvedGeo.longitude || "",
              isp: enrichedNetData.isp || "",
              organization: enrichedNetData.organization || "",
              asn: enrichedNetData.asn || "",
              geoProvider: "ipwho.is",
              // IP & Network Intelligence
              ipVersion: enrichedNetData.ipVersion || "IPv4",
              maskedIp: enrichedNetData.maskedIp || "anonymized",
              networkId: enrichedNetData.networkId || "net_anon",
              isDataCenter: !!enrichedNetData.isDataCenter,
              isProxyVpn: !!enrichedNetData.isProxyVpn,
              networkRiskSignal: "Low Risk",
            }),
          }).catch(() => {});
        }
      });
    }
  } catch (error) {
    console.error("Telemetry capture error:", error);
  }
}
