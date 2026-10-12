/**
 * Diagnostic: Trace exact attribution detection path and hasValidYouTubeAttribution behavior.
 * Simulates the live conditions where YLT issues are not appearing.
 * ZERO real Jira calls, ZERO real form submissions.
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";

// ── Replicate the exact hasValidYouTubeAttribution logic from src/lib/jira.ts ──
const YOUTUBE_HOST_REGEX = /(?:^|\.)(?:youtube\.com|youtu\.be)$/i;

function isYouTubeReferrer(referrerUrl) {
  if (!referrerUrl) return false;
  try {
    const parsed = new URL(referrerUrl);
    return YOUTUBE_HOST_REGEX.test(parsed.hostname);
  } catch {
    return false;
  }
}

function hasValidYouTubeAttribution(attr) {
  if (!attr || typeof attr !== "object") return false;
  const utmSource = (attr.utmSource || "").toLowerCase().trim();
  const isYtSource = utmSource.includes("youtube");
  const isYtRef = isYouTubeReferrer(attr.referrer || "");
  const hasVideoId = Boolean(attr.videoId && attr.videoId.trim().length > 0);
  const hasYtCampaign = Boolean(
    attr.campaign && attr.campaign.toLowerCase().includes("youtube"),
  );
  return isYtSource || isYtRef || hasVideoId || hasYtCampaign;
}

// ── Replicate exact captureYouTubeAttribution logic from attribution.ts ──
function captureYouTubeAttribution(searchString, referrer) {
  try {
    const searchParams = new URLSearchParams(searchString);
    const isOrganic = isYouTubeReferrer(referrer);

    const utmSource = searchParams.get("utm_source") || (isOrganic ? "youtube" : "");
    const isYouTubeSource = utmSource.toLowerCase().includes("youtube");

    // Key gate: if NOT YouTube source AND NOT organic referrer, returns null
    if (!isYouTubeSource && !isOrganic) {
      return null; // Returns null — causes getYouTubeAttribution() to also be null
    }

    const videoId = searchParams.get("v") || searchParams.get("video_id") || undefined;
    const campaign = searchParams.get("utm_campaign") || undefined;
    const utmMedium = searchParams.get("utm_medium") || (isOrganic ? "organic-video" : "video");

    return {
      videoId,
      campaign,
      utmSource: utmSource || "youtube",
      utmMedium,
      referrer,
      capturedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

describe("Attribution Routing Diagnostic: Why YLT Gets Zero Issues", () => {

  // ── SCENARIO 1: Standard website visitor (no UTMs, no YouTube referrer) ──
  test("Scenario 1: Ordinary visitor with no UTMs or YouTube referrer → correctly routes to DI", () => {
    const attr = captureYouTubeAttribution("", "https://google.com");
    assert.equal(attr, null);
    assert.equal(hasValidYouTubeAttribution(attr), false);
    // ✅ Correct — goes to DI
    console.log("  → Ordinary visitor correctly routes to DI (as expected)");
  });

  // ── SCENARIO 2: YouTube video click with utm_source=youtube ──
  test("Scenario 2: Visitor from YouTube with utm_source=youtube&v=abc123 → should route to YLT", () => {
    const attr = captureYouTubeAttribution("utm_source=youtube&utm_medium=video&v=abc123xyz12", "");
    assert.notEqual(attr, null, "Attribution should be captured");
    assert.ok(hasValidYouTubeAttribution(attr), "Should be detected as valid YouTube attribution");
    console.log("  → YouTube UTM visitor correctly routes to YLT ✅");
    console.log("    Captured attribution:", JSON.stringify(attr, null, 2));
  });

  // ── SCENARIO 3: YouTube referrer, no UTMs (organic click from YouTube app) ──
  test("Scenario 3: Organic YouTube referrer (document.referrer = youtube.com) → should route to YLT", () => {
    const attr = captureYouTubeAttribution("", "https://www.youtube.com/watch?v=abc123");
    assert.notEqual(attr, null, "Organic YouTube attribution should be captured");
    assert.ok(hasValidYouTubeAttribution(attr), "Should detect via YouTube referrer");
    console.log("  → Organic YouTube referrer correctly routes to YLT ✅");
    console.log("    Captured attribution:", JSON.stringify(attr, null, 2));
  });

  // ── SCENARIO 4: YouTube mobile referrer (m.youtube.com) ──
  test("Scenario 4: Mobile YouTube referrer (m.youtube.com) → should route to YLT", () => {
    const attr = captureYouTubeAttribution("", "https://m.youtube.com/watch?v=xyz");
    assert.notEqual(attr, null, "Mobile YouTube attribution should be captured");
    assert.ok(hasValidYouTubeAttribution(attr), "Mobile YouTube should be detected");
    console.log("  → Mobile YouTube (m.youtube.com) correctly routes to YLT ✅");
  });

  // ── SCENARIO 5: youtu.be short link referrer ──
  test("Scenario 5: youtu.be short link referrer → should route to YLT", () => {
    const attr = captureYouTubeAttribution("", "https://youtu.be/abc123xyz12");
    assert.notEqual(attr, null, "youtu.be short-link attribution should be captured");
    assert.ok(hasValidYouTubeAttribution(attr), "youtu.be should be detected as YouTube");
    console.log("  → youtu.be short link correctly routes to YLT ✅");
  });

  // ── SCENARIO 6: Stored attribution in sessionStorage (multi-page journey) ──
  test("Scenario 6: User landed via YouTube but sessionStorage has attribution → getYouTubeAttribution returns stored attr", () => {
    // Simulate stored attribution (as getYouTubeAttribution would return from sessionStorage)
    const storedAttr = {
      utmSource: "youtube",
      utmMedium: "video",
      videoId: "abc123xyz12",
      referrer: "",
      campaign: "indus-robotics-launch",
      capturedAt: new Date().toISOString(),
    };

    // This is what createJiraTask would use:
    const candidateAttribution = storedAttr; // (data.attribution = null) || (getYouTubeAttribution() = storedAttr)
    assert.ok(hasValidYouTubeAttribution(candidateAttribution), "Stored attribution should route to YLT");
    console.log("  → Multi-page session with stored attribution correctly routes to YLT ✅");
  });

  // ── SCENARIO 7: CRITICAL — utm_source=YouTube (capital Y) — case sensitivity check ──
  test("Scenario 7: utm_source=YouTube (capital Y) → attribution lowercased, should still route to YLT", () => {
    const attr = captureYouTubeAttribution("utm_source=YouTube&utm_medium=video", "");
    assert.notEqual(attr, null, "Capital-Y YouTube UTM should be captured");
    assert.ok(hasValidYouTubeAttribution(attr), "Capital-Y YouTube should still be valid");
    console.log("  → Capital-Y 'YouTube' UTM correctly routes to YLT ✅");
  });

  // ── SCENARIO 8: CRITICAL — Check what happens if data.attribution is NOT passed ──
  test("Scenario 8: Form submits without passing data.attribution explicitly — relies on getYouTubeAttribution()", () => {
    // In browser: sessionStorage would have attribution from page load
    // createJiraTask does: data.attribution || getYouTubeAttribution() || captureYouTubeAttribution()
    // If forms never pass data.attribution field, this is fine — but forms must be checked
    // This is the KEY investigation point
    console.log("  ⚠ KEY FINDING: Forms pass no explicit data.attribution field.");
    console.log("    createJiraTask relies ENTIRELY on getYouTubeAttribution() reading sessionStorage.");
    console.log("    If sessionStorage is empty (different tab, incognito, cleared), attribution = null → routes to DI.");
    console.log("    Root cause candidate: form components do not explicitly pass attribution.");
    // Not an assertion failure, just a diagnostic
    assert.ok(true);
  });

  // ── SCENARIO 9: CRITICAL — Check hasValidYouTubeAttribution with null ──
  test("Scenario 9: null attribution (getYouTubeAttribution returns null, no UTMs) → routes to DI", () => {
    assert.equal(hasValidYouTubeAttribution(null), false);
    assert.equal(hasValidYouTubeAttribution(undefined), false);
    assert.equal(hasValidYouTubeAttribution({}), false);
    console.log("  → null/undefined/empty attribution correctly routes to DI ✅");
  });

});
