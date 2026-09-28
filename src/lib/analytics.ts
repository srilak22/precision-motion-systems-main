const GOOGLE_SCRIPT_URL =
  import.meta.env.VITE_GOOGLE_SCRIPT_URL;

const SESSION_KEY = "indus_session_id";

function getSessionId() {
  let sessionId =
    sessionStorage.getItem(SESSION_KEY);

  if (!sessionId) {
    sessionId =
      Date.now().toString(36) +
      Math.random()
        .toString(36)
        .substring(2);

    sessionStorage.setItem(
      SESSION_KEY,
      sessionId
    );
  }

  return sessionId;
}

export function trackDigitalPresence(
  eventName: string = "page_view",
  element: string = "",
  details: string = ""
) {
  if (!GOOGLE_SCRIPT_URL) {
    return;
  }

  const params = new URLSearchParams({
    page:
      document.title ||
      "INDUS Industrial Robotics",

    url:
      window.location.href,

    event:
      eventName,

    element,

    details,

    device:
      /Mobi|Android/i.test(
        navigator.userAgent
      )
        ? "Mobile"
        : "Desktop",

    screen:
      `${window.innerWidth}x${window.innerHeight}`,

    referrer:
      document.referrer ||
      "Direct",

    session:
      getSessionId(),
  });

  const trackingUrl =
    `${GOOGLE_SCRIPT_URL}?${params.toString()}`;

  fetch(trackingUrl, {
    method: "GET",
    mode: "no-cors",
    keepalive: true,
    credentials: "omit",
  }).catch(() => {
    // Tracking failure should never affect the website.
  });
}