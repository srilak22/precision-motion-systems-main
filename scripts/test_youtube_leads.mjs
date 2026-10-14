/**
 * Automated Verification Suite for INDUS Robotics YouTube Lead Generation
 * Tests all requirements, isolation guarantees, and Jira YLT routing using mocks.
 */

import { test, describe, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import youtubeLeadHandler from "../api/youtube-lead.js";
import trackHandler from "../api/track.js";

// Helper to simulate Node/Vercel HTTP req and res
function createMockReqRes({ method = "POST", headers = {}, body = {} } = {}) {
  const req = {
    method,
    headers: {
      "content-type": "application/json",
      origin: "https://precision-motion-systems-main.vercel.app",
      "x-forwarded-for": `192.168.2.${Math.floor(Math.random() * 200) + 10}`,
      ...headers,
    },
    body,
  };

  const res = {
    statusCode: 200,
    headers: {},
    ended: false,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    setHeader(key, val) {
      this.headers[key.toLowerCase()] = val;
      return this;
    },
    json(data) {
      this.body = data;
      this.ended = true;
      return this;
    },
    end(data) {
      this.body = data;
      this.ended = true;
      return this;
    },
  };

  return { req, res };
}

describe("INDUS YouTube Lead Generation & YLT Routing Suite", () => {
  const originalFetch = globalThis.fetch;
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env.NODE_ENV = "test";
    process.env.JIRA_DOMAIN = "test-mock.atlassian.net";
    process.env.JIRA_EMAIL = "test@indus-robotics.com";
    process.env.JIRA_API_TOKEN = "mock-token-secret-xyz";
    process.env.JIRA_PROJECT_KEY = "DI"; // Website enquiries
    process.env.YOUTUBE_JIRA_PROJECT_KEY = "YLT"; // YouTube enquiries
    process.env.YOUTUBE_JIRA_ASSIGNEE_ID = "712020:youtube-specialist";
    delete process.env.TELEGRAM_BOT_TOKEN;
    delete process.env.TELEGRAM_CHAT_ID;
    delete process.env.GOOGLE_APPS_SCRIPT_URL;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    process.env = { ...originalEnv };
  });

  test("1. Rejects non-POST HTTP methods with 405 Method Not Allowed", async () => {
    const { req, res } = createMockReqRes({ method: "GET" });
    await youtubeLeadHandler(req, res);
    assert.equal(res.statusCode, 405);
    assert.equal(res.body.success, false);
  });

  test("2. Responds to OPTIONS preflight with 204 No Content", async () => {
    const { req, res } = createMockReqRes({ method: "OPTIONS" });
    await youtubeLeadHandler(req, res);
    assert.equal(res.statusCode, 204);
  });

  test("3. Rejects invalid non-object payload with 400 Bad Request", async () => {
    const { req, res } = createMockReqRes({ body: "invalid string" });
    await youtubeLeadHandler(req, res);
    assert.equal(res.statusCode, 400);
    assert.equal(res.body.success, false);
  });

  test("4. Silently ignores bot honeypot payloads without calling Jira", async () => {
    let jiraCalled = false;
    globalThis.fetch = async () => {
      jiraCalled = true;
      return { ok: true, json: async () => ({ key: "YLT-999" }) };
    };

    const { req, res } = createMockReqRes({
      body: {
        name: "Spam Bot",
        email: "bot@spamcorp.com",
        _hp: "bot_filled_trap",
      },
    });

    await youtubeLeadHandler(req, res);
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.success, true);
    assert.equal(jiraCalled, false, "Jira must NEVER be called for bot submissions");
  });

  test("5. Server validates minimum lead name length (returns 400)", async () => {
    const { req, res } = createMockReqRes({
      body: {
        name: "X",
        email: "engineer@precision.com",
      },
    });

    await youtubeLeadHandler(req, res);
    assert.equal(res.statusCode, 400);
    assert.match(res.body.error, /Full name must be at least 2 characters/i);
  });

  test("6. Server validates email format for leads (returns 400)", async () => {
    const { req, res } = createMockReqRes({
      body: {
        name: "Dr. Vikram Sarabhai",
        email: "not-a-valid-email",
      },
    });

    await youtubeLeadHandler(req, res);
    assert.equal(res.statusCode, 400);
    assert.match(res.body.error, /valid business email address is required/i);
  });

  test("7. Valid YouTube lead routes strictly to Jira Project YLT and NEVER to DI", async () => {
    let capturedJiraUrl = null;
    let capturedJiraPayload = null;

    globalThis.fetch = async (url, options) => {
      capturedJiraUrl = url;
      capturedJiraPayload = JSON.parse(options.body);
      return {
        ok: true,
        status: 201,
        json: async () => ({ id: "10550", key: "YLT-1" }),
      };
    };

    const { req, res } = createMockReqRes({
      body: {
        name: "Dr. Alistair Vance",
        email: "a.vance@quantum-motion.co.uk",
        company: "Vance Precision Dynamics",
        phone: "+44 20 7946 0912",
        productInterest: "6-DOF Hexapod Positioning Stage",
        estimatedBudget: "$50,000 - $100,000",
        timeline: "Q3 Delivery",
        requirements: "Sub-micron repeatability required for synchrotron beamline experiments.",
        attribution: {
          videoId: "dQw4w9WgXcQ",
          channelId: "UC_indus_robotics",
          campaign: "synchrotron-launch-2026",
          adGroup: "precision-stages",
          utmSource: "youtube",
          utmMedium: "video",
          utmContent: "card-link-timestamp-0214",
          landingPage: "/products/hexapods",
          referrer: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        },
      },
    });

    await youtubeLeadHandler(req, res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.issueKey, "YLT-1");
    assert.equal(res.body.projectKey, "YLT");

    // Verify Jira payload guarantees
    assert.ok(capturedJiraUrl.includes("test-mock.atlassian.net"));
    assert.equal(capturedJiraPayload.fields.project.key, "YLT", "Lead MUST route to project YLT");
    assert.notEqual(
      capturedJiraPayload.fields.project.key,
      "DI",
      "Lead MUST NEVER route to project DI",
    );
    assert.equal(capturedJiraPayload.fields.issuetype.name, "Task");
    assert.equal(capturedJiraPayload.fields.assignee.accountId, "712020:youtube-specialist");

    // Verify summary & description
    assert.match(capturedJiraPayload.fields.summary, /\[YouTube Lead\] Dr\. Alistair Vance/);
    assert.match(capturedJiraPayload.fields.description, /Video ID: dQw4w9WgXcQ/);
    assert.match(capturedJiraPayload.fields.description, /Target Project: YLT/);
    assert.match(capturedJiraPayload.fields.description, /synchrotron-launch-2026/);

    // Verify labels
    assert.ok(capturedJiraPayload.fields.labels.includes("youtube-lead"));
    assert.ok(capturedJiraPayload.fields.labels.includes("video-attribution"));
    assert.ok(capturedJiraPayload.fields.labels.includes("dealflow-ylt"));
    assert.ok(capturedJiraPayload.fields.labels.includes("yt-vid-dQw4w9WgXcQ"));
  });

  test("8. Defaults to YLT even when YOUTUBE_JIRA_PROJECT_KEY is not configured in env", async () => {
    delete process.env.YOUTUBE_JIRA_PROJECT_KEY;

    let capturedJiraPayload = null;
    globalThis.fetch = async (url, options) => {
      capturedJiraPayload = JSON.parse(options.body);
      return {
        ok: true,
        status: 201,
        json: async () => ({ id: "10551", key: "YLT-2" }),
      };
    };

    const { req, res } = createMockReqRes({
      body: {
        name: "Default Routing User",
        email: "default.routing@example.com",
      },
    });

    await youtubeLeadHandler(req, res);
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.projectKey, "YLT");
    assert.equal(
      capturedJiraPayload.fields.project.key,
      "YLT",
      "Must default to YLT when env is omitted",
    );
  });

  test("9. Safety check: rejects execution if configured to target DI", async () => {
    process.env.YOUTUBE_JIRA_PROJECT_KEY = "DI";

    const { req, res } = createMockReqRes({
      body: {
        name: "Test User",
        email: "test@domain.com",
      },
    });

    await youtubeLeadHandler(req, res);
    assert.equal(res.statusCode, 500);
    assert.match(res.body.error, /must not target project DI/i);
  });

  test("10. Isolated deduplication blocks duplicates without affecting website leads", async () => {
    let fetchCount = 0;
    globalThis.fetch = async () => {
      fetchCount += 1;
      return {
        ok: true,
        json: async () => ({ key: `YLT-${fetchCount}` }),
      };
    };

    const fixedIp = "10.0.0.55";
    const leadEmail = "duplicate.test@company.com";
    const leadName = "Repeat Visitor";

    // 1st YouTube submission -> creates issue
    const { req: req1, res: res1 } = createMockReqRes({
      headers: { "x-forwarded-for": fixedIp },
      body: { name: leadName, email: leadEmail },
    });
    await youtubeLeadHandler(req1, res1);
    assert.equal(res1.statusCode, 200);
    assert.equal(res1.body.duplicate, undefined);
    assert.equal(res1.body.issueKey, "YLT-1");
    assert.equal(fetchCount, 1);

    // 2nd identical YouTube submission within 60s -> deduplicated
    const { req: req2, res: res2 } = createMockReqRes({
      headers: { "x-forwarded-for": fixedIp },
      body: { name: leadName, email: leadEmail },
    });
    await youtubeLeadHandler(req2, res2);
    assert.equal(res2.statusCode, 200);
    assert.equal(res2.body.duplicate, true);
    assert.equal(res2.body.issueKey, "YLT-1");
    assert.equal(fetchCount, 1, "Jira must not be called a second time for duplicate lead");

    // CRITICAL ISOLATION CHECK:
    // A website lead to /api/track with the exact same name/email/IP must NOT be blocked by YouTube deduplication!
    let websiteFetchCount = 0;
    globalThis.fetch = async (url) => {
      if (url && typeof url === "string" && url.includes("atlassian.net")) {
        websiteFetchCount += 1;
        return {
          ok: true,
          json: async () => ({ key: "DI-888" }),
        };
      }
      return { ok: true, json: async () => ({ ok: true }) };
    };

    const { req: reqWeb, res: resWeb } = createMockReqRes({
      headers: { "x-forwarded-for": fixedIp },
      body: {
        event: "lead",
        name: leadName,
        email: leadEmail,
      },
    });
    await trackHandler(reqWeb, resWeb);
    assert.equal(resWeb.statusCode, 200);
    assert.equal(
      resWeb.body.duplicate,
      undefined,
      "Website lead must NOT be deduplicated by YouTube cache",
    );
    assert.equal(resWeb.body.issueKey, "DI-888");
    assert.equal(websiteFetchCount, 1);
  });

  test("11. Handles Jira service failure gracefully with 502 Bad Gateway", async () => {
    globalThis.fetch = async () => ({
      ok: false,
      status: 503,
      text: async () => "Jira Cloud Maintenance",
    });

    const { req, res } = createMockReqRes({
      body: {
        name: "Test Engineer",
        email: "test.engineer@space-aerospace.com",
      },
    });

    await youtubeLeadHandler(req, res);
    assert.equal(res.statusCode, 502);
    assert.equal(res.body.success, false);
    assert.match(res.body.error, /Failed to create Jira issue/i);
  });

  test("16. Forwards lead record strictly to dedicated 'YouTube Leads' sheet tab with all Phase 2 schema fields", async () => {
    process.env.GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/mock-deployment/exec";
    let capturedGasPayload = null;

    globalThis.fetch = async (url, options) => {
      if (url.includes("atlassian.net")) {
        return {
          ok: true,
          status: 201,
          json: async () => ({ id: "10599", key: "YLT-77" }),
        };
      }
      if (url.includes("script.google.com")) {
        capturedGasPayload = JSON.parse(options.body);
        return { ok: true, status: 200 };
      }
      throw new Error(`Unexpected URL: ${url}`);
    };

    const { req, res } = createMockReqRes({
      body: {
        name: "Elena Rostova",
        email: "elena.rostova@quantum-optics.ch",
        company: "Geneva Optics Ltd",
        phone: "+41 22 555 0199",
        productInterest: "Precision Rotary Stages",
        estimatedBudget: "$35,000",
        timeline: "Immediate",
        requirements: "Interferometry beam stabilization",
        attribution: {
          videoId: "ZYV2_6_XODw",
          channelId: "@srilakshana-h1t",
          campaign: "synchrotron-launch",
          landingPage: "/products/rotary",
          referrer: "https://www.youtube.com/watch?v=ZYV2_6_XODw",
        },
      },
    });

    await youtubeLeadHandler(req, res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.issueKey, "YLT-77");
    assert.equal(res.body.googleSheetRecorded, true);

    // Verify Google Sheets target is strictly "YouTube Leads"
    assert.notEqual(capturedGasPayload, null, "Google Apps Script must be called");
    assert.equal(
      capturedGasPayload.sheet,
      "YouTube Leads",
      "Must target dedicated YouTube Leads tab",
    );
    assert.equal(capturedGasPayload.sheetName, "YouTube Leads");
    assert.notEqual(
      capturedGasPayload.sheet,
      "Form Submissions",
      "Must NEVER target Form Submissions",
    );

    // Verify Phase 2 schema fields
    assert.ok(capturedGasPayload.leadId && capturedGasPayload.leadId.startsWith("sub_yt_"));
    assert.equal(capturedGasPayload.sourceVideo, "https://youtu.be/ZYV2_6_XODw");
    assert.ok(capturedGasPayload.sourceCommentOrEnquiryUrl.includes("ZYV2_6_XODw"));
    assert.match(
      capturedGasPayload.contactDetails,
      /Elena Rostova <elena\.rostova@quantum-optics\.ch>/,
    );
    assert.match(capturedGasPayload.contactDetails, /Geneva Optics Ltd/);
    assert.equal(capturedGasPayload.leadType, "YouTube Website Lead");
    assert.equal(capturedGasPayload.status, "New");
    assert.ok(capturedGasPayload.creationTime);
    assert.equal(capturedGasPayload.jiraIssueKey, "YLT-77");
  });

  test("17. Google Sheets write timeout or network failure is handled safely without failing lead registration", async () => {
    globalThis.fetch = async (url) => {
      if (url.includes("atlassian.net")) {
        return {
          ok: true,
          status: 201,
          json: async () => ({ id: "10600", key: "YLT-78" }),
        };
      }
      if (url.includes("script.google.com")) {
        throw new Error("Google Apps Script network timeout");
      }
      throw new Error(`Unexpected URL: ${url}`);
    };

    const { req, res } = createMockReqRes({
      body: {
        name: "Resilient Lead User",
        email: "resilient@aerospace.io",
      },
    });

    await youtubeLeadHandler(req, res);

    // Lead still succeeds because Jira ticket was successfully created!
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.issueKey, "YLT-78");
    assert.equal(res.body.googleSheetRecorded, false);
  });
});

describe("INDUS YouTube Lead Client Bridge (submitYouTubeLead)", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test("12. Client validation rejects missing or invalid inputs", async () => {
    const { submitYouTubeLead } = await import("../src/integrations/youtube-leads/client.ts");

    await assert.rejects(
      () => submitYouTubeLead({ name: "A", email: "valid@email.com" }),
      /Full name must be at least 2 characters long/i,
    );

    await assert.rejects(
      () => submitYouTubeLead({ name: "Valid Name", email: "invalid-email" }),
      /A valid business email address is required/i,
    );
  });

  test("13. Routes lead to /api/youtube-lead and returns verified issue key", async () => {
    const { submitYouTubeLead } = await import("../src/integrations/youtube-leads/client.ts");

    let requestedEndpoint = null;
    let sentMethod = null;
    let sentBody = null;

    globalThis.fetch = async (url, options) => {
      requestedEndpoint = url;
      sentMethod = options.method;
      sentBody = JSON.parse(options.body);

      return {
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          projectKey: "YLT",
          jiraKey: "YLT-42",
          issueKey: "YLT-42",
          message: "YouTube lead registered",
        }),
      };
    };

    const result = await submitYouTubeLead({
      name: "Marcus Aurelius",
      email: "marcus@rome-dynamics.it",
      company: "Rome Dynamics",
      productInterest: "High-load Goniometer",
      attribution: {
        videoId: "abc123xyz78",
        utmSource: "youtube",
        utmMedium: "video",
        landingPage: "/products/goniometers",
        referrer: "https://www.youtube.com/",
        capturedAt: new Date().toISOString(),
      },
    });

    assert.equal(requestedEndpoint, "/api/youtube-lead");
    assert.equal(sentMethod, "POST");
    assert.equal(sentBody.name, "Marcus Aurelius");
    assert.equal(sentBody.attribution.videoId, "abc123xyz78");

    assert.equal(result.success, true);
    assert.equal(result.issueKey, "YLT-42");
    assert.equal(result.projectKey, "YLT");
    assert.equal(result.duplicate, false);
  });

  test("14. Handles duplicate submission response honestly", async () => {
    const { submitYouTubeLead } = await import("../src/integrations/youtube-leads/client.ts");

    globalThis.fetch = async () => ({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        duplicate: true,
        projectKey: "YLT",
        issueKey: "YLT-42",
        message: "YouTube enquiry already received.",
      }),
    });

    const result = await submitYouTubeLead({
      name: "Marcus Aurelius",
      email: "marcus@rome-dynamics.it",
    });

    assert.equal(result.success, true);
    assert.equal(result.duplicate, true);
    assert.equal(result.issueKey, "YLT-42");
    assert.match(result.message, /already received/i);
  });

  test("15. Throws error on backend failure and never fabricates fake ticket IDs", async () => {
    const { submitYouTubeLead } = await import("../src/integrations/youtube-leads/client.ts");

    globalThis.fetch = async () => ({
      ok: false,
      status: 502,
      json: async () => ({
        success: false,
        error: "Jira service communication failure",
      }),
    });

    await assert.rejects(
      () =>
        submitYouTubeLead({
          name: "Dr. Failure Test",
          email: "fail@domain.com",
        }),
      /Jira service communication failure/i,
    );
  });
});
