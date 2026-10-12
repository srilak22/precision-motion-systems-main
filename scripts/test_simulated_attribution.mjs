/**
 * Verification test for simulated YouTube Campaign Attribution.
 * URL: https://precision-motion-systems-main.vercel.app/contact/engineering-enquiry?utm_source=youtube&utm_medium=video&utm_campaign=indus_robotics_test&utm_content=robotics_demo_test
 */

import { test, describe, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";

describe("Simulated YouTube Campaign Attribution Verification", () => {
  let mockSessionStorage;
  let attributionModule;

  beforeEach(async () => {
    // Mock sessionStorage
    const store = new Map();
    mockSessionStorage = {
      getItem: (key) => store.get(key) || null,
      setItem: (key, val) => store.set(key, String(val)),
      removeItem: (key) => store.delete(key),
      clear: () => store.clear(),
      _store: store,
    };

    // Setup browser globals
    globalThis.sessionStorage = mockSessionStorage;
    globalThis.window = {
      location: {
        pathname: "/contact/engineering-enquiry",
        search: "?utm_source=youtube&utm_medium=video&utm_campaign=indus_robotics_test&utm_content=robotics_demo_test",
        href: "https://precision-motion-systems-main.vercel.app/contact/engineering-enquiry?utm_source=youtube&utm_medium=video&utm_campaign=indus_robotics_test&utm_content=robotics_demo_test",
      },
    };
    globalThis.document = {
      referrer: "https://www.youtube.com/",
    };

    attributionModule = await import("../src/integrations/youtube-leads/attribution.ts");
  });

  afterEach(() => {
    delete globalThis.sessionStorage;
    delete globalThis.window;
    delete globalThis.document;
  });

  test("1. Successfully captures simulated UTM parameters and YouTube referrer", () => {
    const { captureYouTubeAttribution, getYouTubeAttribution, isYouTubeAttributed } = attributionModule;

    const captured = captureYouTubeAttribution();
    assert.ok(captured, "Attribution should be captured");
    assert.equal(captured.utmSource, "youtube");
    assert.equal(captured.utmMedium, "video");
    assert.equal(captured.utmCampaign, "indus_robotics_test");
    assert.equal(captured.utmContent, "robotics_demo_test");
    assert.equal(captured.referrer, "https://www.youtube.com/");
    assert.equal(
      captured.landingPage,
      "/contact/engineering-enquiry?utm_source=youtube&utm_medium=video&utm_campaign=indus_robotics_test&utm_content=robotics_demo_test",
    );

    // Verify stored in isolated sessionStorage
    assert.ok(mockSessionStorage._store.has("__indus_yt_attr"), "Must store in __indus_yt_attr");
    assert.equal(isYouTubeAttributed(), true);

    const fromStorage = getYouTubeAttribution();
    assert.deepEqual(fromStorage, JSON.parse(JSON.stringify(captured)));
  });

  test("2. Preserves captured attribution across internal navigation", () => {
    const { captureYouTubeAttribution, getYouTubeAttribution } = attributionModule;

    // First touch
    captureYouTubeAttribution();

    // User navigates internally to a product page with no UTMs and internal referrer
    globalThis.window.location.pathname = "/products/hexapod-stages";
    globalThis.window.location.search = "";
    globalThis.window.location.href = "https://precision-motion-systems-main.vercel.app/products/hexapod-stages";
    globalThis.document.referrer = "https://precision-motion-systems-main.vercel.app/contact/engineering-enquiry";

    // Re-check attribution on new page
    const persisted = captureYouTubeAttribution();
    assert.ok(persisted, "Should preserve attribution from session");
    assert.equal(persisted.utmCampaign, "indus_robotics_test");
    assert.equal(persisted.utmContent, "robotics_demo_test");
    assert.equal(persisted.utmSource, "youtube");

    const retrieved = getYouTubeAttribution();
    assert.equal(retrieved.utmCampaign, "indus_robotics_test");
  });

  test("3. Clears attribution when explicitly requested", () => {
    const { captureYouTubeAttribution, getYouTubeAttribution, isYouTubeAttributed, clearYouTubeAttribution } =
      attributionModule;

    captureYouTubeAttribution();
    assert.equal(isYouTubeAttributed(), true);

    clearYouTubeAttribution();
    assert.equal(isYouTubeAttributed(), false);
    assert.equal(getYouTubeAttribution(), null);
  });
});
