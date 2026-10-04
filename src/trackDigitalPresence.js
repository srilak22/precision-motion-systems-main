const SESSION_KEY = "indus_session_id";

function getSessionId() {
  let sessionId = sessionStorage.getItem(SESSION_KEY);

  if (!sessionId) {
    sessionId =
      Date.now().toString(36) +
      Math.random().toString(36).substring(2, 10);

    sessionStorage.setItem(SESSION_KEY, sessionId);
  }

  return sessionId;
}

const DEVICE_CACHE_KEY = "indus_device_intelligence";

function detectBrowserName() {
  if (typeof navigator === "undefined" || !navigator.userAgent) return "Unknown";
  const ua = navigator.userAgent;
  if (/MSIE\s|Trident\//i.test(ua)) return "Internet Explorer";
  if (/Edg\/|EdgA\/|EdgiOS\/|Edge\//i.test(ua)) return "Microsoft Edge";
  if (/OPR\/|OPT\/|Opera/i.test(ua)) return "Opera";
  if (/Chrome\/|CriOS\//i.test(ua)) return "Google Chrome";
  if (/Firefox\/|FxiOS\//i.test(ua)) return "Mozilla Firefox";
  if (/Safari\//i.test(ua) && !/Chrome\/|CriOS\/|Edg\/|OPR\//i.test(ua) && !/Android/i.test(ua)) return "Safari";
  return "Unknown";
}

function detectOperatingSystem() {
  if (typeof navigator === "undefined") return "Unknown";
  const ua = navigator.userAgent || "";
  const platform = navigator.platform || "";
  const maxTouchPoints = navigator.maxTouchPoints || 0;

  if (/Android/i.test(ua)) return "Android";
  const isIOS = /iPhone|iPad|iPod/i.test(ua) || (platform === "MacIntel" && maxTouchPoints > 1);
  if (isIOS) return "iOS";
  if (/Windows NT|Windows|Win32|Win64/i.test(ua) || /Win/i.test(platform)) return "Windows";
  if ((/Mac OS X|Macintosh|Mac_PowerPC/i.test(ua) || /Mac/i.test(platform)) && !isIOS) return "macOS";
  if ((/Linux|X11/i.test(ua) || /Linux/i.test(platform)) && !/Android/i.test(ua)) return "Linux";
  return "Unknown";
}

function detectDeviceCategory() {
  if (typeof window === "undefined") return "Desktop";
  const ua = (typeof navigator !== "undefined" && navigator.userAgent) || "";
  const platform = (typeof navigator !== "undefined" && navigator.platform) || "";
  const maxTouchPoints = (typeof navigator !== "undefined" && navigator.maxTouchPoints) || 0;

  const isIPad = /iPad/i.test(ua) || (platform === "MacIntel" && maxTouchPoints > 1);
  const isTabletUA = /(tablet|playbook|silk)|(android(?!.*mobi))/i.test(ua);
  if (isIPad || isTabletUA) return "Tablet";

  const isMobileUA = /Mobile|iPhone|iPod|Android.*Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  if (isMobileUA) return "Mobile";

  const width = (typeof window.screen !== "undefined" && window.screen.width) ? window.screen.width : window.innerWidth;
  if (width > 0) {
    if (width <= 768) return "Mobile";
    if (width <= 1024) return "Tablet";
  }
  return "Desktop";
}

function detectScreenResolution() {
  if (typeof window === "undefined" || !window.screen) return "";
  const w = window.screen.width;
  const h = window.screen.height;
  if (typeof w === "number" && typeof h === "number" && w > 0 && h > 0) {
    return `${Math.round(w)}x${Math.round(h)}`;
  }
  return "";
}

function getDeviceDetails() {
  try {
    const cached = sessionStorage.getItem(DEVICE_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && parsed.device && parsed.browser && parsed.operatingSystem) {
        return parsed;
      }
    }
  } catch {}

  const details = {
    device: detectDeviceCategory(),
    browser: detectBrowserName(),
    operatingSystem: detectOperatingSystem(),
    screen: detectScreenResolution(),
  };

  try {
    sessionStorage.setItem(DEVICE_CACHE_KEY, JSON.stringify(details));
  } catch {}

  return details;
}

export async function trackDigitalPresence(
  event = "page_view",
  element = "",
  details = ""
) {
  try {
    const dev = getDeviceDetails();
    await fetch("/api/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        page: window.location.pathname,
        url: window.location.href,
        event,
        element,
        details,
        device: dev.device,
        browser: dev.browser,
        operatingSystem: dev.operatingSystem,
        screen: dev.screen,
        sessionId: getSessionId(),
        referrer: document.referrer,
        visitorType: sessionStorage.getItem("indus_visited")
          ? "Returning Visitor"
          : "New Visitor",
      }),
    });

    sessionStorage.setItem("indus_visited", "true");
  } catch (error) {
    console.error("Digital presence tracking failed:", error);
  }
}
