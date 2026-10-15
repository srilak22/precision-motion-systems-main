/**
 * Proof of Routing Isolation for Project YLT using Mocks Only
 * Strictly offline, never makes real Jira calls or creates real issues.
 */

import { test, describe, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import youtubeLeadHandler from "../api/youtube-lead.js";
import trackHandler from "../api/track.js";

function createMockReqRes({ method = "POST", headers = {}, body = {} } = {}) {
  const req = {
    method,
    headers: {
      "content-type": "application/json",
      origin: "https://precision-motion-systems-main.vercel.app",
      "x-forwarded-for": "192.168.3.45",
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

describe("Proof of DI and YLT Routing Isolation (Mocks Only)", () => {
  const originalFetch = globalThis.fetch;
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env.NODE_ENV = "test";
    process.env.JIRA_DOMAIN = "test-mock.atlassian.net";
    process.env.JIRA_EMAIL = "test@indus-robotics.com";
    process.env.JIRA_API_TOKEN = "mock-token-secret-xyz";
    process.env.JIRA_PROJECT_KEY = "DI"; // Website enquiries
    process.env.YOUTUBE_JIRA_PROJECT_KEY = "YLT"; // Configured for destination YLT
    process.env.YOUTUBE_JIRA_ASSIGNEE_ID = "712020:youtube-specialist";
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    process.env = { ...originalEnv };
  });

  test("1. A valid YouTube lead is routed strictly to project key YLT with mocks", async () => {
    let capturedJiraPayload = null;
    let mockFetchCalled = false;

    globalThis.fetch = async (url, options) => {
      const urlStr = String(url);
      if (urlStr.includes("atlassian.net")) {
        mockFetchCalled = true;
        capturedJiraPayload = JSON.parse(options.body);
        return {
          ok: true,
          status: 201,
          json: async () => ({ id: "10099", key: "YLT-1" }),
        };
      }
      return {
        ok: true,
        status: 200,
        json: async () => ({ status: "success" }),
      };
    };

    const { req, res } = createMockReqRes({
      body: {
        name: "Verified Lead",
        email: "verified.lead@domain.com",
        company: "Precision Labs",
        requirements: "Requires 6-axis stage",
        attribution: {
          videoId: "dQw4w9WgXcQ",
          campaign: "indus_robotics_test",
          utmSource: "youtube",
          utmMedium: "video",
          landingPage: "/contact/engineering-enquiry",
          referrer: "https://www.youtube.com/",
        },
      },
    });

    await youtubeLeadHandler(req, res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.projectKey, "YLT");
    assert.equal(res.body.issueKey, "YLT-1");
    assert.equal(mockFetchCalled, true);
    assert.equal(capturedJiraPayload.fields.project.key, "YLT", "Project key MUST be YLT");
    assert.notEqual(capturedJiraPayload.fields.project.key, "DI", "Project key MUST NOT be DI");
  });

  test("2. The endpoint refuses to route YouTube leads to DI (Safety Assertion)", async () => {
    process.env.YOUTUBE_JIRA_PROJECT_KEY = "DI";

    let mockFetchCalled = false;
    globalThis.fetch = async () => {
      mockFetchCalled = true;
      return { ok: true, json: async () => ({ key: "DI-999" }) };
    };

    const { req, res } = createMockReqRes({
      body: {
        name: "Test User",
        email: "test@domain.com",
      },
    });

    await youtubeLeadHandler(req, res);

    assert.equal(res.statusCode, 500);
    assert.match(res.body.error, /must not target project DI/i);
    assert.equal(mockFetchCalled, false, "Must NEVER call Jira when DI is attempted");
  });

  test("3. Normal analytics events on /api/track NEVER create Jira issues", async () => {
    let jiraCalled = false;
    globalThis.fetch = async (url) => {
      if (String(url).includes("atlassian.net")) {
        jiraCalled = true;
      }
      return { ok: true, json: async () => ({}) };
    };

    const { req, res } = createMockReqRes({
      body: {
        event: "page_view",
        page: "/contact/engineering-enquiry",
        device: "Desktop",
      },
    });

    await trackHandler(req, res);

    assert.equal(jiraCalled, false, "Ordinary analytics MUST NEVER invoke Jira");
    assert.equal(res.body?.jiraKey, undefined);
    assert.equal(res.body?.issueKey, undefined);
  });

  test("4. Existing website integration continues targeting DI and never YLT", async () => {
    let capturedJiraPayload = null;

    globalThis.fetch = async (url, options) => {
      const urlStr = String(url);
      if (urlStr.includes("atlassian.net")) {
        capturedJiraPayload = JSON.parse(options.body);
        return {
          ok: true,
          status: 201,
          json: async () => ({ id: "20001", key: "DI-42" }),
        };
      }
      return {
        ok: true,
        status: 200,
        json: async () => ({ status: "success" }),
      };
    };

    const { req, res } = createMockReqRes({
      body: {
        event: "lead",
        name: "Website Visitor",
        email: "website.visitor@domain.com",
        type: "Commercial RFQ",
      },
    });

    await trackHandler(req, res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.issueKey, "DI-42");
    assert.equal(capturedJiraPayload.fields.project.key, "DI", "Website enquiry MUST target DI");
    assert.notEqual(
      capturedJiraPayload.fields.project.key,
      "YLT",
      "Website enquiry MUST NOT target YLT",
    );
  });

  test("5. Invalid forms, honeypots, duplicates, and API failures handled safely", async () => {
    // 5a. Name < 2 chars
    const { req: r1, res: s1 } = createMockReqRes({
      body: { name: "X", email: "valid@email.com" },
    });
    await youtubeLeadHandler(r1, s1);
    assert.equal(s1.statusCode, 400);

    // 5b. Bad email
    const { req: r2, res: s2 } = createMockReqRes({
      body: { name: "Valid Name", email: "notanemail" },
    });
    await youtubeLeadHandler(r2, s2);
    assert.equal(s2.statusCode, 400);

    // 5c. Honeypot silent drop
    let fetchCalled = false;
    globalThis.fetch = async () => {
      fetchCalled = true;
      return { ok: true, json: async () => ({}) };
    };
    const { req: r3, res: s3 } = createMockReqRes({
      body: { name: "Bot", email: "bot@spam.com", _hp: "filled" },
    });
    await youtubeLeadHandler(r3, s3);
    assert.equal(s3.statusCode, 200);
    assert.equal(fetchCalled, false);

    // 5d. Duplicate submission
    globalThis.fetch = async () => ({ ok: true, json: async () => ({ key: "YLT-88" }) });
    const ip = "10.0.0.99";
    const { req: r4a, res: s4a } = createMockReqRes({
      headers: { "x-forwarded-for": ip },
      body: { name: "Dupe User", email: "dupe@domain.com" },
    });
    await youtubeLeadHandler(r4a, s4a);
    assert.equal(s4a.statusCode, 200);
    assert.equal(s4a.body.duplicate, undefined);

    const { req: r4b, res: s4b } = createMockReqRes({
      headers: { "x-forwarded-for": ip },
      body: { name: "Dupe User", email: "dupe@domain.com" },
    });
    await youtubeLeadHandler(r4b, s4b);
    assert.equal(s4b.statusCode, 200);
    assert.equal(s4b.body.duplicate, true);

    // 5e. Jira API failure (503 Service Unavailable)
    globalThis.fetch = async () => ({ ok: false, status: 503, text: async () => "Unavailable" });
    const { req: r5, res: s5 } = createMockReqRes({
      body: { name: "Normal User", email: "normal@domain.com" },
    });
    await youtubeLeadHandler(r5, s5);
    assert.equal(s5.statusCode, 502);
  });
});
