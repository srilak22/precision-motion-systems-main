/**
 * Automated Verification Suite for YouTube-Attributed Lead Routing in Website Forms
 * Tests attribution detection, client bridge routing, explicit pass-through, duplicate
 * handling, routing isolation, and known limitations.
 *
 * ZERO real Jira calls. ZERO form submissions to live endpoints.
 */

import { test, describe, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { createJiraTask, hasValidYouTubeAttribution } from "../src/lib/jira.ts";

describe("YouTube Lead Attribution & Form Routing Isolation", () => {
  const originalFetch = globalThis.fetch;
  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;
  const originalSessionStorage = globalThis.sessionStorage;

  let mockStorage = new Map();

  beforeEach(() => {
    mockStorage = new Map();

    globalThis.sessionStorage = {
      getItem(key) {
        return mockStorage.get(key) || null;
      },
      setItem(key, value) {
        mockStorage.set(key, value);
      },
      removeItem(key) {
        mockStorage.delete(key);
      },
      clear() {
        mockStorage.clear();
      },
    };

    globalThis.window = {
      location: { pathname: "/", search: "", href: "https://precision-motion-systems-main.vercel.app/" },
    };
    globalThis.document = { referrer: "" };
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    globalThis.window = originalWindow;
    globalThis.document = originalDocument;
    globalThis.sessionStorage = originalSessionStorage;
  });

  // â”€â”€â”€ UNIT TESTS FOR hasValidYouTubeAttribution â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  test("1. hasValidYouTubeAttribution correctly recognizes YouTube attributions and rejects others", () => {
    // Valid YouTube attributions
    assert.ok(hasValidYouTubeAttribution({ utmSource: "youtube", referrer: "" }));
    assert.ok(hasValidYouTubeAttribution({ utmSource: "YouTube", referrer: "" }));
    assert.ok(hasValidYouTubeAttribution({ utmSource: "", referrer: "https://www.youtube.com/watch?v=xyz" }));
    assert.ok(hasValidYouTubeAttribution({ utmSource: "", referrer: "https://m.youtube.com/" }));
    assert.ok(hasValidYouTubeAttribution({ utmSource: "", referrer: "https://youtu.be/abc" }));
    assert.ok(hasValidYouTubeAttribution({ utmSource: "", referrer: "", videoId: "abc123xyz12" }));
    assert.ok(hasValidYouTubeAttribution({ utmSource: "", referrer: "", campaign: "youtube-launch" }));

    // Invalid / non-YouTube
    assert.equal(hasValidYouTubeAttribution(null), false);
    assert.equal(hasValidYouTubeAttribution(undefined), false);
    assert.equal(hasValidYouTubeAttribution({}), false);
    assert.equal(hasValidYouTubeAttribution({ utmSource: "google" }), false);
    assert.equal(hasValidYouTubeAttribution({ utmSource: "linkedin" }), false);
    assert.equal(hasValidYouTubeAttribution({ utmSource: "", referrer: "https://google.com" }), false);
    assert.equal(hasValidYouTubeAttribution({ utmSource: "", referrer: "", campaign: "spring-sale" }), false);
  });

  // â”€â”€â”€ DIRECT YOUTUBE UTM ROUTING â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  test("2. YouTube-attributed enquiry routes exclusively to /api/youtube-lead (Project YLT) and never /api/track", async () => {
    let ytCalled = false;
    let trackCalled = false;

    globalThis.fetch = async (url, options) => {
      const body = JSON.parse(options.body);
      if (url === "/api/youtube-lead") {
        ytCalled = true;
        assert.ok(!trackCalled, "DI track must NOT be called alongside YLT");
        assert.equal(body.name, "Akiko Tanaka");
        assert.equal(body.email, "akiko@indus-example.com");
        return { ok: true, json: async () => ({ success: true, jiraKey: "YLT-42", projectKey: "YLT" }) };
      }
      if (url === "/api/track" || String(url).includes("/api/track")) {
        trackCalled = true;
        throw new Error("DI track must NOT be called for YouTube-attributed leads");
      }
      throw new Error(`Unexpected fetch to: ${url}`);
    };

    // Populate sessionStorage with YouTube attribution (simulates captureYouTubeAttribution() on page load)
    mockStorage.set("__indus_yt_attr", JSON.stringify({
      utmSource: "youtube",
      utmMedium: "video",
      videoId: "abc123xyz12",
      referrer: "",
      capturedAt: new Date().toISOString(),
    }));

    const result = await createJiraTask({
      data: { name: "Akiko Tanaka", email: "akiko@indus-example.com" },
    });

    assert.ok(ytCalled, "/api/youtube-lead must be called");
    assert.equal(trackCalled, false, "/api/track must NOT be called");
    assert.equal(result.projectKey, "YLT");
    assert.equal(result.issueKey, "YLT-42");
  });

  // â”€â”€â”€ EXPLICIT ATTRIBUTION PASS-THROUGH (OPTION B HARDENING) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  test("3. Explicit attribution field in data overrides sessionStorage absence â€” same-session hardening", async () => {
    let ytCalled = false;

    globalThis.fetch = async (url, options) => {
      if (url === "/api/youtube-lead") {
        ytCalled = true;
        return { ok: true, json: async () => ({ success: true, jiraKey: "YLT-99", projectKey: "YLT" }) };
      }
      throw new Error(`Unexpected fetch: ${url}`);
    };

    // sessionStorage is EMPTY â€” no prior captureYouTubeAttribution() call
    // But form explicitly passes attribution (Option B hardening)
    const result = await createJiraTask({
      data: {
        name: "Bjorn Larsen",
        email: "bjorn@indus-example.com",
        attribution: {
          utmSource: "youtube",
          utmMedium: "video",
          videoId: "zyx987",
          referrer: "",
          capturedAt: new Date().toISOString(),
        },
      },
    });

    assert.ok(ytCalled, "/api/youtube-lead must be called when explicit attribution is passed");
    assert.equal(result.projectKey, "YLT");
  });

  // â”€â”€â”€ ORGANIC YOUTUBE REFERRER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  test("4. Enquiry from organic YouTube referrer routes to /api/youtube-lead (Project YLT)", async () => {
    let ytCalled = false;

    globalThis.fetch = async (url) => {
      if (url === "/api/youtube-lead") {
        ytCalled = true;
        return { ok: true, json: async () => ({ success: true, jiraKey: "YLT-43", projectKey: "YLT" }) };
      }
      throw new Error(`Unexpected fetch: ${url}`);
    };

    mockStorage.set("__indus_yt_attr", JSON.stringify({
      utmSource: "youtube",
      utmMedium: "organic-video",
      referrer: "https://www.youtube.com/watch?v=test123",
      capturedAt: new Date().toISOString(),
    }));

    const result = await createJiraTask({
      data: { name: "Chen Wei", email: "chen@indus-example.com" },
    });

    assert.ok(ytCalled);
    assert.equal(result.projectKey, "YLT");
  });

  // â”€â”€â”€ MULTI-PAGE SESSION PERSISTENCE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  test("5. Multi-page session persists YouTube attribution and routes quote modal to YLT", async () => {
    let ytCalled = false;

    globalThis.fetch = async (url) => {
      if (url === "/api/youtube-lead") {
        ytCalled = true;
        return { ok: true, json: async () => ({ success: true, jiraKey: "YLT-44", projectKey: "YLT" }) };
      }
      throw new Error(`Unexpected fetch: ${url}`);
    };

    // Attribution stored on landing, still present 3 pages later
    mockStorage.set("__indus_yt_attr", JSON.stringify({
      utmSource: "youtube",
      videoId: "vid9876",
      referrer: "",
      landingPage: "/",
      capturedAt: new Date(Date.now() - 180_000).toISOString(), // 3 min ago
    }));

    // User navigated to /products page before submitting
    globalThis.window = {
      location: { pathname: "/products/servo-drives/sd-200", search: "", href: "https://example.com/products/servo-drives/sd-200" },
    };

    const result = await createJiraTask({
      data: { name: "Sara Ahmed", email: "sara@indus-example.com" },
    });

    assert.ok(ytCalled);
    assert.equal(result.projectKey, "YLT");
  });

  // â”€â”€â”€ ORDINARY WEBSITE ENQUIRY â†’ DI â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  test("6. Ordinary website enquiry with no attribution routes strictly to /api/track (Project DI)", async () => {
    let trackCalled = false;

    globalThis.fetch = async (url, options) => {
      const body = JSON.parse(options.body);
      if (String(url).includes("/api/track")) {
        trackCalled = true;
        assert.equal(body.event, "lead");
        return { ok: true, json: async () => ({ success: true, issueKey: "DI-100", projectKey: "DI" }) };
      }
      if (url === "/api/youtube-lead") {
        throw new Error("YLT endpoint must NOT be called for ordinary website leads");
      }
      throw new Error(`Unexpected fetch: ${url}`);
    };

    // sessionStorage is empty, no attribution
    const result = await createJiraTask({
      data: { name: "Tom Reynolds", email: "tom@indus-example.com" },
    });

    assert.ok(trackCalled, "/api/track must be called for ordinary leads");
    // Note: projectKey from /api/track response â†’ "DI"
    assert.equal(result.projectKey, "DI");
  });

  // â”€â”€â”€ NON-YOUTUBE CAMPAIGN â†’ DI â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  test("7. Non-YouTube campaign (Google Search, LinkedIn) routes to /api/track (Project DI)", async () => {
    let trackCalled = false;

    globalThis.fetch = async (url) => {
      if (String(url).includes("/api/track")) {
        trackCalled = true;
        return { ok: true, json: async () => ({ success: true, issueKey: "DI-101", projectKey: "DI" }) };
      }
      throw new Error(`Unexpected fetch: ${url}`);
    };

    for (const nonYtSource of ["google", "linkedin", "twitter", "email", "direct"]) {
      mockStorage.clear();
      mockStorage.set("__indus_yt_attr", JSON.stringify({
        utmSource: nonYtSource,
        referrer: "https://google.com",
        capturedAt: new Date().toISOString(),
      }));

      await createJiraTask({
        data: { name: "Lisa Park", email: "lisa@indus-example.com" },
      });
    }

    assert.ok(trackCalled);
  });

  // â”€â”€â”€ CLIENT-SIDE VALIDATION SHORT-CIRCUIT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  test("8. Client-side validation errors reject immediately without calling any endpoint", async () => {
    globalThis.fetch = async () => {
      throw new Error("fetch must NOT be called when validation fails");
    };

    await assert.rejects(
      () => createJiraTask({ data: { name: "A", email: "not-valid-email" } }),
      /Validation error/,
    );
    await assert.rejects(
      () => createJiraTask({ data: { name: "", email: "test@example.com" } }),
      /Validation error/,
    );
  });

  // â”€â”€â”€ DUPLICATE YOUTUBE LEAD â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  test("9. Duplicate YouTube lead returns duplicate: true and preserves existing issueKey", async () => {
    globalThis.fetch = async (url) => {
      if (url === "/api/youtube-lead") {
        return {
          ok: true,
          json: async () => ({
            success: true,
            duplicate: true,
            jiraKey: "YLT-50",
            issueKey: "YLT-50",
            projectKey: "YLT",
            message: "YouTube enquiry already received.",
          }),
        };
      }
      throw new Error(`Unexpected fetch: ${url}`);
    };

    mockStorage.set("__indus_yt_attr", JSON.stringify({
      utmSource: "youtube",
      videoId: "vid-dup",
      referrer: "",
      capturedAt: new Date().toISOString(),
    }));

    const result = await createJiraTask({
      data: { name: "Miguel Santos", email: "miguel@indus-example.com" },
    });

    assert.ok(result.duplicate);
    assert.equal(result.issueKey, "YLT-50");
    assert.equal(result.projectKey, "YLT");
  });

  // â”€â”€â”€ BACKEND ERROR PROPAGATION â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  test("10. Backend failure throws exact server error message and never fabricates fake issueKey", async () => {
    globalThis.fetch = async (url) => {
      if (url === "/api/youtube-lead") {
        return {
          ok: false,
          status: 502,
          json: async () => ({ error: "Jira API returned 403: Forbidden â€” check project permissions for YLT" }),
        };
      }
      throw new Error(`Unexpected fetch: ${url}`);
    };

    mockStorage.set("__indus_yt_attr", JSON.stringify({
      utmSource: "youtube",
      videoId: "abc123",
      referrer: "",
      capturedAt: new Date().toISOString(),
    }));

    await assert.rejects(
      () => createJiraTask({ data: { name: "Elena Popova", email: "elena@indus-example.com" } }),
      /Jira API returned 403: Forbidden/,
    );
  });

  // â”€â”€â”€ ROUTING ISOLATION: YLT NEVER TOUCHES /api/track â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  test("11. Routing isolation: YLT-attributed lead NEVER touches /api/track endpoint", async () => {
    let trackCalled = false;

    globalThis.fetch = async (url) => {
      if (String(url).includes("/api/track")) {
        trackCalled = true;
        throw new Error("ISOLATION VIOLATION: /api/track must never be called for YouTube leads");
      }
      if (url === "/api/youtube-lead") {
        return { ok: true, json: async () => ({ success: true, jiraKey: "YLT-55", projectKey: "YLT" }) };
      }
      throw new Error(`Unexpected fetch: ${url}`);
    };

    mockStorage.set("__indus_yt_attr", JSON.stringify({
      utmSource: "youtube",
      videoId: "iso-test",
      referrer: "",
      capturedAt: new Date().toISOString(),
    }));

    await createJiraTask({ data: { name: "Isolation Test", email: "iso@indus-example.com" } });
    assert.equal(trackCalled, false, "/api/track must never be called for YouTube-attributed leads");
  });

  // â”€â”€â”€ ROUTING ISOLATION: DI NEVER TOUCHES /api/youtube-lead â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  test("12. Routing isolation: ordinary DI lead NEVER touches /api/youtube-lead endpoint", async () => {
    let ytCalled = false;

    globalThis.fetch = async (url, options) => {
      if (url === "/api/youtube-lead") {
        ytCalled = true;
        throw new Error("ISOLATION VIOLATION: /api/youtube-lead must never be called for ordinary leads");
      }
      if (String(url).includes("/api/track")) {
        return { ok: true, json: async () => ({ success: true, issueKey: "DI-200", projectKey: "DI" }) };
      }
      throw new Error(`Unexpected fetch: ${url}`);
    };

    // No sessionStorage attribution at all
    await createJiraTask({ data: { name: "Ordinary Lead", email: "ordinary@indus-example.com" } });
    assert.equal(ytCalled, false, "/api/youtube-lead must never be called for ordinary website leads");
  });

  // â”€â”€â”€ KNOWN LIMITATION: NO CROSS-SESSION RECOVERY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  test("13. Known limitation: attribution from a different tab/session is NOT recoverable (routes to DI)", async () => {
    let trackCalled = false;

    globalThis.fetch = async (url) => {
      if (String(url).includes("/api/track")) {
        trackCalled = true;
        return { ok: true, json: async () => ({ success: true, issueKey: "DI-300", projectKey: "DI" }) };
      }
      throw new Error(`Unexpected fetch: ${url}`);
    };

    // sessionStorage is EMPTY â€” simulates incognito tab or new browser tab
    // Even if user clicked YouTube link in another tab, this session has no attribution.
    // This is the known limitation: attribution is scoped to sessionStorage (tab + session).
    const result = await createJiraTask({
      data: {
        name: "New Tab User",
        email: "newtab@indus-example.com",
        // No explicit attribution passed â€” simulates old form behavior
      },
    });

    assert.ok(trackCalled);
    assert.equal(result.projectKey, "DI"); // Routes to DI â€” expected known limitation
    // This test DOCUMENTS the limitation, not a bug.
    console.log("    â„¹ Known limitation confirmed: new-tab/incognito visitors route to DI (expected)");
  });
});
