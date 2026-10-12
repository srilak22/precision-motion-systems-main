/**
 * Automated Verification Suite for YouTube-Attributed Lead Routing in Website Forms
 * Tests attribution detection, client bridge routing, duplicate handling, and strict routing isolation.
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
        mockStorage.set(key, String(value));
      },
      removeItem(key) {
        mockStorage.delete(key);
      },
      clear() {
        mockStorage.clear();
      },
    };

    globalThis.window = {
      location: {
        pathname: "/products",
        search: "",
        href: "https://precision-motion-systems-main.vercel.app/products",
      },
    };

    globalThis.document = {
      referrer: "",
    };
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    globalThis.window = originalWindow;
    globalThis.document = originalDocument;
    globalThis.sessionStorage = originalSessionStorage;
  });

  /* -----------------------------------------------------------
     1. Unit Tests for hasValidYouTubeAttribution
  ----------------------------------------------------------- */
  test("1. hasValidYouTubeAttribution correctly recognizes YouTube attributions and rejects others", () => {
    // Valid cases
    assert.equal(hasValidYouTubeAttribution({ utmSource: "youtube", utmMedium: "video", landingPage: "/", referrer: "", capturedAt: "" }), true);
    assert.equal(hasValidYouTubeAttribution({ utmSource: "YouTube_Ad", utmMedium: "cpc", landingPage: "/", referrer: "", capturedAt: "" }), true);
    assert.equal(hasValidYouTubeAttribution({ utmSource: "", utmMedium: "", landingPage: "/", referrer: "https://www.youtube.com/watch?v=abc", capturedAt: "" }), true);
    assert.equal(hasValidYouTubeAttribution({ utmSource: "", utmMedium: "", landingPage: "/", referrer: "https://youtu.be/abc", capturedAt: "" }), true);
    assert.equal(hasValidYouTubeAttribution({ videoId: "dQw4w9WgXcQ", utmSource: "", utmMedium: "", landingPage: "/", referrer: "", capturedAt: "" }), true);
    assert.equal(hasValidYouTubeAttribution({ campaign: "youtube_q4_promo", utmSource: "", utmMedium: "", landingPage: "/", referrer: "", capturedAt: "" }), true);

    // Invalid / Non-YouTube cases
    assert.equal(hasValidYouTubeAttribution(null), false);
    assert.equal(hasValidYouTubeAttribution(undefined), false);
    assert.equal(hasValidYouTubeAttribution({}), false);
    assert.equal(hasValidYouTubeAttribution({ utmSource: "google", utmMedium: "organic", landingPage: "/", referrer: "https://www.google.com/", capturedAt: "" }), false);
    assert.equal(hasValidYouTubeAttribution({ utmSource: "linkedin", utmMedium: "cpc", landingPage: "/", referrer: "https://www.linkedin.com/", capturedAt: "" }), false);
    assert.equal(hasValidYouTubeAttribution({ utmSource: "direct", utmMedium: "none", landingPage: "/", referrer: "", capturedAt: "" }), false);
  });

  /* -----------------------------------------------------------
     2. Form Routing: Direct YouTube UTM Attribution -> YLT
  ----------------------------------------------------------- */
  test("2. YouTube-attributed enquiry routes exclusively to /api/youtube-lead (Project YLT) and never /api/track", async () => {
    const calledEndpoints = [];
    let capturedPayload = null;

    globalThis.fetch = async (url, opts) => {
      const urlStr = String(url);
      calledEndpoints.push(urlStr);
      capturedPayload = JSON.parse(opts.body);

      if (urlStr.includes("/api/youtube-lead")) {
        return new Response(
          JSON.stringify({
            success: true,
            recorded: true,
            projectKey: "YLT",
            jiraKey: "YLT-101",
            issueKey: "YLT-101",
            message: "YouTube lead successfully registered: YLT-101",
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }

      throw new Error(`Unexpected endpoint called: ${urlStr}`);
    };

    const result = await createJiraTask({
      data: {
        name: "Marcus Vance",
        email: "m.vance@robotics-corp.com",
        company: "Vance Automation",
        phone: "+1-555-0199",
        product: "Harmonic Reducers",
        quantity: "15 units",
        requirements: "Need custom gear ratio 1:50",
        attribution: {
          utmSource: "youtube",
          utmMedium: "video",
          campaign: "gearbox_teardown",
          videoId: "dQw4w9WgXcQ",
          landingPage: "/products",
          referrer: "https://www.youtube.com/",
          capturedAt: new Date().toISOString(),
        },
      },
    });

    // Verification
    assert.equal(calledEndpoints.length, 1, "Exactly one endpoint must be called");
    assert.equal(calledEndpoints[0], "/api/youtube-lead", "Must call /api/youtube-lead");
    assert.ok(!calledEndpoints.includes("/api/track"), "Must NEVER call /api/track");

    assert.equal(result.success, true);
    assert.equal(result.projectKey, "YLT", "Project key must be YLT");
    assert.equal(result.issueKey, "YLT-101");
    assert.equal(result.jiraKey, "YLT-101");
    assert.equal(result.duplicate, false);

    assert.equal(capturedPayload.name, "Marcus Vance");
    assert.equal(capturedPayload.productInterest, "Harmonic Reducers");
    assert.equal(capturedPayload.attribution.videoId, "dQw4w9WgXcQ");
  });

  /* -----------------------------------------------------------
     3. Form Routing: Organic YouTube Referrer -> YLT
  ----------------------------------------------------------- */
  test("3. Enquiry from organic YouTube referrer routes to /api/youtube-lead (Project YLT)", async () => {
    globalThis.document.referrer = "https://www.youtube.com/watch?v=testVideo123";

    const calledEndpoints = [];

    globalThis.fetch = async (url) => {
      const urlStr = String(url);
      calledEndpoints.push(urlStr);
      return new Response(
        JSON.stringify({
          success: true,
          projectKey: "YLT",
          issueKey: "YLT-202",
          jiraKey: "YLT-202",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    };

    const result = await createJiraTask({
      data: {
        name: "Sarah Chen",
        email: "sarah@chen-robotics.com",
        company: "Chen Robotics",
        requirements: "SCARA arm payload query",
      },
    });

    assert.equal(calledEndpoints.length, 1);
    assert.equal(calledEndpoints[0], "/api/youtube-lead");
    assert.equal(result.projectKey, "YLT");
    assert.equal(result.issueKey, "YLT-202");
  });

  /* -----------------------------------------------------------
     4. Form Routing: Stored Session Attribution -> YLT
  ----------------------------------------------------------- */
  test("4. Multi-page session persists YouTube attribution and routes quote modal to YLT", async () => {
    // Visitor landed on / with YouTube UTM earlier in session
    globalThis.sessionStorage.setItem(
      "__indus_yt_attr",
      JSON.stringify({
        utmSource: "youtube",
        utmMedium: "cpc",
        campaign: "indus_q4_industrial",
        landingPage: "/",
        referrer: "https://www.youtube.com/",
        capturedAt: new Date().toISOString(),
      }),
    );

    // Visitor is now on /contact without query parameters
    globalThis.window.location.search = "";
    globalThis.document.referrer = "";

    const calledEndpoints = [];

    globalThis.fetch = async (url) => {
      calledEndpoints.push(String(url));
      return new Response(
        JSON.stringify({
          success: true,
          projectKey: "YLT",
          issueKey: "YLT-303",
          jiraKey: "YLT-303",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    };

    const result = await createJiraTask({
      data: {
        name: "David Kim",
        email: "david.kim@kim-mech.com",
        requirements: "Direct drive motor specifications",
      },
    });

    assert.equal(calledEndpoints[0], "/api/youtube-lead");
    assert.equal(result.projectKey, "YLT");
    assert.equal(result.issueKey, "YLT-303");
  });

  /* -----------------------------------------------------------
     5. Ordinary Website Enquiry -> DI (No YouTube attribution)
  ----------------------------------------------------------- */
  test("5. Ordinary website enquiry with no attribution routes strictly to /api/track (Project DI)", async () => {
    const calledEndpoints = [];
    let capturedPayload = null;

    globalThis.fetch = async (url, opts) => {
      const urlStr = String(url);
      calledEndpoints.push(urlStr);
      capturedPayload = JSON.parse(opts.body);
      return new Response(
        JSON.stringify({
          success: true,
          jiraKey: "DI-501",
          issueKey: "DI-501",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    };

    const result = await createJiraTask({
      data: {
        name: "Ordinary Visitor",
        email: "visitor@industry-corp.de",
        company: "Industry Corp",
        requirements: "Standard conveyor stage enquiry",
      },
    });

    assert.equal(calledEndpoints.length, 1);
    assert.equal(calledEndpoints[0], "/api/track", "Must call /api/track");
    assert.ok(!calledEndpoints.includes("/api/youtube-lead"), "Must NEVER call /api/youtube-lead");

    assert.equal(result.success, true);
    assert.equal(result.projectKey, "DI", "Ordinary enquiry must have projectKey DI");
    assert.equal(result.issueKey, "DI-501");
    assert.equal(capturedPayload.event, "lead");
    assert.equal(capturedPayload.name, "Ordinary Visitor");
  });

  /* -----------------------------------------------------------
     6. Non-YouTube Campaign -> DI
  ----------------------------------------------------------- */
  test("6. Non-YouTube campaign (e.g. Google Search, LinkedIn) routes to /api/track (Project DI)", async () => {
    const calledEndpoints = [];

    globalThis.fetch = async (url) => {
      calledEndpoints.push(String(url));
      return new Response(
        JSON.stringify({
          success: true,
          jiraKey: "DI-602",
          issueKey: "DI-602",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    };

    const result = await createJiraTask({
      data: {
        name: "Google Ad Lead",
        email: "lead@google-search.com",
        attribution: {
          utmSource: "google",
          utmMedium: "cpc",
          campaign: "precision_search",
          landingPage: "/search",
          referrer: "https://www.google.com/",
          capturedAt: new Date().toISOString(),
        },
      },
    });

    assert.equal(calledEndpoints[0], "/api/track");
    assert.equal(result.projectKey, "DI");
    assert.equal(result.issueKey, "DI-602");
  });

  /* -----------------------------------------------------------
     7. Form Validation Failures Block Both Endpoints
  ----------------------------------------------------------- */
  test("7. Client-side validation errors reject immediately without calling any endpoint", async () => {
    let fetchCalled = false;
    globalThis.fetch = async () => {
      fetchCalled = true;
      return new Response("{}", { status: 200 });
    };

    // Missing / short name
    await assert.rejects(
      () => createJiraTask({ data: { name: "X", email: "valid@email.com" } }),
      /Full name must be at least 2 characters long/,
    );

    // Invalid email
    await assert.rejects(
      () => createJiraTask({ data: { name: "Valid Name", email: "bad-email" } }),
      /valid business email address is required/,
    );

    // Non-object data
    await assert.rejects(
      () => createJiraTask({ data: null }),
      /Invalid enquiry payload/,
    );

    assert.equal(fetchCalled, false, "Fetch must NEVER be called on validation failure");
  });

  /* -----------------------------------------------------------
     8. Duplicate Handling for YouTube Leads
  ----------------------------------------------------------- */
  test("8. Duplicate YouTube lead returns duplicate: true and preserves existing issueKey", async () => {
    globalThis.fetch = async () => {
      return new Response(
        JSON.stringify({
          success: true,
          duplicate: true,
          projectKey: "YLT",
          issueKey: "YLT-777",
          jiraKey: "YLT-777",
          message: "YouTube enquiry already received.",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    };

    const result = await createJiraTask({
      data: {
        name: "Repeated Lead",
        email: "repeat@domain.com",
        attribution: { utmSource: "youtube", utmMedium: "video", landingPage: "/", referrer: "", capturedAt: "" },
      },
    });

    assert.equal(result.success, true);
    assert.equal(result.duplicate, true);
    assert.equal(result.issueKey, "YLT-777");
    assert.equal(result.projectKey, "YLT");
  });

  /* -----------------------------------------------------------
     9. Backend Error Handling Propagation
  ----------------------------------------------------------- */
  test("9. Backend failure throws exact server error message and never fabricates fake issueKey", async () => {
    globalThis.fetch = async () => {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Jira lead integration is temporarily unconfigured on the server.",
        }),
        { status: 503, headers: { "Content-Type": "application/json" } },
      );
    };

    await assert.rejects(
      () =>
        createJiraTask({
          data: {
            name: "Error Scenario",
            email: "error@domain.com",
            attribution: { utmSource: "youtube", utmMedium: "video", landingPage: "/", referrer: "", capturedAt: "" },
          },
        }),
      /Jira lead integration is temporarily unconfigured on the server/,
    );
  });
});
