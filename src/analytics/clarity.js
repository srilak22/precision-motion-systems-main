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

  // Ensure script is injected only once across re-renders and StrictMode
  if (isInitialized || document.getElementById("clarity-script") || (typeof window.clarity === "function" && window.clarity.q)) {
    isInitialized = true;
    return;
  }

  if (projectId) {
    try {
      Clarity.init(projectId);
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
      Clarity.event(eventName);
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
