import { trackIntelligenceEvent } from "./lib/intelligence/tracker";

/**
 * Universal Digital Presence & 5-Layer Intelligence Tracker for INDUS
 * Enriches all user interactions with Session, Traffic, Geo, Time Zone, and Network metadata.
 * Backwards-compatible drop-in replacement.
 */
export async function trackDigitalPresence(
  event = "page_view",
  element = "",
  details = "",
  extraData = {}
) {
  try {
    await trackIntelligenceEvent(event, element, details, extraData);
  } catch (error) {
    console.error("Digital presence tracking error:", error);
  }
}
