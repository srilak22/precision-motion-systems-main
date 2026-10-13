/**
 * Automated Verification Suite for INDUS Robotics Website + Vercel + Jira DealFlow Integration
 * Tests all requirements using mocks without polluting production Jira.
 */

import { test, describe, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import trackHandler from "../api/track.js";

// Helper to simulate Node/Vercel HTTP req and res
function createMockReqRes({ method = "POST", headers = {}, body = {} } = {}) {
  const req = {
    method,
    headers: {
      "content-type": "application/json",
      origin: "https://precision-motion-systems-main.vercel.app",
      "x-forwarded-for": `192.168.1.${Math.floor(Math.random() * 200) + 10}`,
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

describe("INDUS Vercel & Jira Integration Security & Reliability", () => {
  const originalFetch = globalThis.fetch;
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env.NODE_ENV = "test";
    process.env.JIRA_DOMAIN = "test-mock.atlassian.net";
    process.env.JIRA_EMAIL = "test@indus-robotics.com";
    process.env.JIRA_API_TOKEN = "mock-token-secret-xyz";
    process.env.JIRA_PROJECT_KEY = "DI";
    process.env.JIRA_ASSIGNEE_ID = "712020:mock-assignee";
    delete process.env.GOOGLE_APPS_SCRIPT_URL;
    delete process.env.AIRTABLE_TOKEN;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    process.env = { ...originalEnv };
  });

  test("1. Rejects non-POST HTTP methods with 405 Method Not Allowed", async () => {
    const { req, res } = createMockReqRes({ method: "GET" });
    await trackHandler(req, res);
    assert.equal(res.statusCode, 405);
    assert.equal(res.body.success, false);
  });

  test("2. Rejects invalid non-object payload with 400 Bad Request", async () => {
    const { req, res } = createMockReqRes({ body: "invalid string" });
    await trackHandler(req, res);
    assert.equal(res.statusCode, 400);
    assert.equal(res.body.success, false);
  });

  test("3. Silently ignores bot honeypot payloads without calling Jira", async () => {
    let jiraCalled = false;
    globalThis.fetch = async () => {
      jiraCalled = true;
      return new Response(JSON.stringify({}), { status: 200 });
    };

    const { req, res } = createMockReqRes({
      body: { event: "lead", name: "Spam Bot", email: "bot@spam.com", _hp: "honeypot_value" },
    });
    await trackHandler(req, res);
    assert.equal(res.statusCode, 200);
    assert.equal(jiraCalled, false);
  });

  test("4. Server validates minimum lead name length (returns 400)", async () => {
    const { req, res } = createMockReqRes({
      body: { event: "lead", name: "A", email: "valid@company.com" },
    });
    await trackHandler(req, res);
    assert.equal(res.statusCode, 400);
    assert.match(res.body.error, /Full name must be at least 2 characters/);
  });

  test("5. Server validates email format for leads (returns 400)", async () => {
    const { req, res } = createMockReqRes({
      body: { event: "lead", name: "Valid Name", email: "not-an-email" },
    });
    await trackHandler(req, res);
    assert.equal(res.statusCode, 400);
    assert.match(res.body.error, /valid business email address is required/);
  });

  test("6. Ordinary analytics events NEVER create Jira issues", async () => {
    let jiraCalled = false;
    globalThis.fetch = async (url) => {
      if (String(url).includes("atlassian.net")) {
        jiraCalled = true;
      }
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    };

    const analyticsEvents = [
      "page_view",
      "navigation_click",
      "cta_click",
      "button_click",
      "scroll_25",
      "scroll_50",
      "form_validation_error",
      "download",
    ];

    for (const evt of analyticsEvents) {
      jiraCalled = false;
      const { req, res } = createMockReqRes({
        body: { event: evt, page: "/products", element: "Nav Button" },
      });
      await trackHandler(req, res);
      assert.equal(jiraCalled, false, `Event ${evt} must NEVER invoke Jira`);
    }
  });

  test("7. Valid enquiry form creates exactly one Jira issue with verified project key and issue type", async () => {
    let capturedJiraRequest = null;
    globalThis.fetch = async (url, opts) => {
      if (String(url).includes("atlassian.net/rest/api/2/issue")) {
        capturedJiraRequest = {
          url: String(url),
          method: opts.method,
          headers: opts.headers,
          body: JSON.parse(opts.body),
        };
        return new Response(JSON.stringify({ key: "DI-202", id: "10202", self: "..." }), {
          status: 201,
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({}), { status: 200 });
    };

    const { req, res } = createMockReqRes({
      body: {
        event: "lead",
        name: "Dr. Sarah Chen",
        company: "Apex Automation Robotics",
        email: "sarah.chen@apex-auto.com",
        phone: "+1-555-0199",
        product: "Harmonic Speed Reducer Series H",
        quantity: "50 units",
        requirements:
          "Peak torque 120Nm, zero-backlash required for 6-axis articulated arm joint 4.",
        type: "Commercial RFQ",
        labels: ["rfq", "precision-reducer"],
      },
    });

    await trackHandler(req, res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.jiraKey, "DI-202");
    assert.equal(res.body.issueKey, "DI-202");

    // Verify Jira request payload
    assert.ok(capturedJiraRequest, "Jira endpoint must have been called");
    assert.equal(capturedJiraRequest.method, "POST");
    assert.equal(capturedJiraRequest.body.fields.project.key, "DI");
    assert.equal(capturedJiraRequest.body.fields.issuetype.name, "Task");
    assert.ok(capturedJiraRequest.body.fields.summary.includes("Sarah Chen"));
    assert.ok(capturedJiraRequest.body.fields.summary.includes("Commercial RFQ"));
    assert.ok(capturedJiraRequest.body.fields.description.includes("Peak torque 120Nm"));
    assert.ok(capturedJiraRequest.body.fields.description.includes("50 units"));
    assert.ok(capturedJiraRequest.body.fields.labels.includes("dealflow"));
    assert.ok(capturedJiraRequest.body.fields.labels.includes("rfq"));
  });

  test("8. Anti-replay duplicate prevention safely blocks duplicate Jira tickets", async () => {
    let jiraCallCount = 0;
    globalThis.fetch = async (url) => {
      if (String(url).includes("atlassian.net")) {
        jiraCallCount++;
        return new Response(JSON.stringify({ key: "DI-303", id: "10303" }), {
          status: 201,
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({}), { status: 200 });
    };

    const leadPayload = {
      event: "lead",
      name: "Marcus Vance",
      company: "Vance Kinematics",
      email: "marcus@vancekinematics.com",
      requirements: "Inquiry specifications note.",
    };

    // First submission
    const clientIp = "10.0.0.88";
    const { req: req1, res: res1 } = createMockReqRes({
      headers: { "x-forwarded-for": clientIp },
      body: leadPayload,
    });
    await trackHandler(req1, res1);
    assert.equal(res1.body.jiraKey, "DI-303");
    assert.equal(jiraCallCount, 1);

    // Immediate second submission (same IP, email, name)
    const { req: req2, res: res2 } = createMockReqRes({
      headers: { "x-forwarded-for": clientIp },
      body: leadPayload,
    });
    await trackHandler(req2, res2);

    assert.equal(res2.statusCode, 200);
    assert.equal(res2.body.duplicate, true);
    assert.equal(res2.body.jiraKey, "DI-303");
    assert.equal(jiraCallCount, 1, "Jira must NOT be called twice for duplicate lead");
  });

  test("9. Handles Jira API timeout and failure gracefully without crashing", async () => {
    globalThis.fetch = async (url) => {
      if (String(url).includes("atlassian.net")) {
        // Simulate Jira failure
        return new Response("Service Unavailable", { status: 503 });
      }
      return new Response(JSON.stringify({}), { status: 200 });
    };

    const { req, res } = createMockReqRes({
      body: {
        event: "lead",
        name: "Elena Rostova",
        email: "elena@rostova-tech.com",
        requirements: "Technical consultation request.",
      },
    });

    await trackHandler(req, res);

    // If Jira fails and no other destination configured, honest 502 error
    assert.equal(res.statusCode, 502);
    assert.equal(res.body.success, false);
    assert.equal(res.body.jiraKey, undefined);
  });
});

describe("INDUS Client Bridge (createJiraTask)", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test("10. createJiraTask client validation rejects missing or invalid inputs", async () => {
    const { createJiraTask } = await import("../src/lib/jira.ts");

    await assert.rejects(
      () => createJiraTask({ data: { name: "A", email: "valid@email.com" } }),
      /Full name must be at least 2 characters long/,
    );

    await assert.rejects(
      () => createJiraTask({ data: { name: "Valid Name", email: "not-an-email" } }),
      /valid business email address is required/,
    );
  });

  test("11. createJiraTask routes lead to /api/track and returns verified issue key", async () => {
    const { createJiraTask } = await import("../src/lib/jira.ts");
    let calledUrl = null;
    let calledBody = null;

    globalThis.fetch = async (url, opts) => {
      calledUrl = String(url);
      calledBody = JSON.parse(opts.body);
      return new Response(
        JSON.stringify({
          success: true,
          jiraKey: "DI-888",
          issueKey: "DI-888",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    };

    const result = await createJiraTask({
      data: {
        name: "Hiroshi Tanaka",
        email: "hiroshi@tanaka-robotics.co.jp",
        company: "Tanaka Robotics",
        type: "Engineering Enquiry",
        requirements: "High precision harmonic drive specs.",
      },
    });

    assert.equal(calledUrl, "/api/track");
    assert.equal(calledBody.event, "lead");
    assert.equal(calledBody.name, "Hiroshi Tanaka");
    assert.equal(calledBody.company, "Tanaka Robotics");
    assert.equal(result.success, true);
    assert.equal(result.duplicate, false);
    assert.equal(result.jiraKey, "DI-888");
    assert.equal(result.issueKey, "DI-888");
  });

  test("12. createJiraTask handles duplicate submission response honestly", async () => {
    const { createJiraTask } = await import("../src/lib/jira.ts");

    globalThis.fetch = async () => {
      return new Response(
        JSON.stringify({
          success: true,
          duplicate: true,
          jiraKey: "DI-888",
          issueKey: "DI-888",
          message: "Enquiry already received. Our team will review your specifications shortly.",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    };

    const result = await createJiraTask({
      data: {
        name: "Hiroshi Tanaka",
        email: "hiroshi@tanaka-robotics.co.jp",
        requirements: "High precision harmonic drive specs.",
      },
    });

    assert.equal(result.success, true);
    assert.equal(result.duplicate, true);
    assert.equal(result.jiraKey, "DI-888");
  });

  test("13. createJiraTask throws error on backend failure and never fabricates fake ticket IDs", async () => {
    const { createJiraTask } = await import("../src/lib/jira.ts");

    globalThis.fetch = async () => {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Configured telemetry destinations could not be reached",
        }),
        { status: 502, headers: { "Content-Type": "application/json" } },
      );
    };

    await assert.rejects(
      () =>
        createJiraTask({
          data: {
            name: "Elena Rostova",
            email: "elena@rostova-tech.com",
            requirements: "Fail scenario testing.",
          },
        }),
      /Configured telemetry destinations could not be reached/,
    );
  });
});
