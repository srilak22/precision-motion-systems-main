import Clarity from "@microsoft/clarity";

const projectId = import.meta.env.VITE_CLARITY_PROJECT_ID || "ysb67jrgfu";

let isInitialized = false;

/**
 * Initialize Microsoft Clarity once.
 * Protected against SSR (window undefined) and React StrictMode duplicate calls.
 * Uses fallback project ID "ysb67jrgfu" if env is not defined.
 */
export function initClarity() {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  // If already initialized by this helper, no-op
  if (isInitialized) {
    return;
  }

  // Grant consent explicitly (passing true ensures Clarity records without pending state)
  try {
    if (typeof window.clarity === "function") {
      window.clarity("consent", true);
    }
  } catch {}

  // If script tag already exists or clarity queue is active, mark initialized
  if (
    document.querySelector('script[src*="clarity.ms"]') ||
    document.getElementById("clarity-script") ||
    (typeof window.clarity === "function" && (window.clarity.q || window.clarity.v))
  ) {
    isInitialized = true;
    return;
  }

  if (projectId) {
    try {
      Clarity.init(projectId);
      if (typeof window.clarity === "function") {
        window.clarity("consent", true);
      }
      isInitialized = true;
    } catch (error) {
      console.warn("Microsoft Clarity initialization failed:", error);
    }
  }
}

/**
 * Safely send a custom event to Microsoft Clarity.
 *
 * @param {string} eventName - Meaningful event identifier (e.g. "request_quote", "whatsapp_click")
 */
export function trackClarityEvent(eventName) {
  if (typeof window === "undefined" || !eventName) {
    return;
  }

  try {
    if (typeof window.clarity === "function") {
      window.clarity("event", eventName);
    }
  } catch (error) {
    console.warn(`Microsoft Clarity event tracking error for "${eventName}":`, error);
  }
}

// Automatically initialize when loaded on client if project ID is present
if (typeof window !== "undefined") {
  initClarity();
}

export default Clarity;
