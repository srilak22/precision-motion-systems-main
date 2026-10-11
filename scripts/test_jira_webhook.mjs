/**
 * Automated Verification Suite for Jira-to-Vercel Webhook Integration (api/jira-webhook.js)
 * Tests HMAC-SHA256 signature verification, event handling, and security isolation.
 */

import { test, describe, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import webhookHandler, { verifyJiraWebhookSignature } from "../api/jira-webhook.js";

function createMockReqRes({ method = "POST", headers = {}, body = "", rawBody = null } = {}) {
  const req = {
    method,
    headers: {
      "content-type": "application/json",
      ...headers,
    },
    rawBody:
      rawBody !== null
        ? rawBody
        : typeof body === "string"
          ? Buffer.from(body, "utf8")
          : Buffer.from(JSON.stringify(body)),
    body: typeof body === "string" ? body : body,
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

function generateSignature(payloadString, secret) {
  const hmac = crypto
    .createHmac("sha256", secret)
    .update(Buffer.from(payloadString, "utf8"))
    .digest("hex");
  return `sha256=${hmac}`;
}

describe("INDUS Jira-to-Vercel Webhook Integration", () => {
  const TEST_SECRET = "test_webhook_secret_key_999";
  const originalEnv = { ...process.env };
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    process.env.JIRA_WEBHOOK_SECRET = TEST_SECRET;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    globalThis.fetch = originalFetch;
  });

  test("1. Rejects non-POST HTTP methods with 405 Method Not Allowed", async () => {
    const { req, res } = createMockReqRes({ method: "GET" });
    await webhookHandler(req, res);
    assert.equal(res.statusCode, 405);
    assert.equal(res.body.success, false);
    assert.equal(res.headers.allow, "POST, OPTIONS");
  });

  test("2. Responds to OPTIONS preflight with 204 No Content", async () => {
    const { req, res } = createMockReqRes({ method: "OPTIONS" });
    await webhookHandler(req, res);
    assert.equal(res.statusCode, 204);
  });

  test("3. Returns 500 when JIRA_WEBHOOK_SECRET is not configured on server", async () => {
    delete process.env.JIRA_WEBHOOK_SECRET;
    const { req, res } = createMockReqRes({
      headers: { "x-hub-signature": "sha256=abcdef" },
      body: JSON.stringify({ event: "test" }),
    });
    await webhookHandler(req, res);
    assert.equal(res.statusCode, 500);
    assert.equal(res.body.success, false);
    assert.match(res.body.error, /Webhook secret is not configured/);
  });

  test("4. Rejects request with missing signature header with 401 Unauthorized", async () => {
    const payloadStr = JSON.stringify({ webhookEvent: "jira:issue_created" });
    const { req, res } = createMockReqRes({
      body: payloadStr,
    });
    await webhookHandler(req, res);
    assert.equal(res.statusCode, 401);
    assert.equal(res.body.success, false);
    assert.match(res.body.error, /Missing or malformed X-Hub-Signature/);
  });

  test("5. Rejects malformed signature header format with 401 Unauthorized", async () => {
    const payloadStr = JSON.stringify({ webhookEvent: "jira:issue_created" });
    const { req, res } = createMockReqRes({
      headers: { "x-hub-signature": "invalid_format_without_prefix" },
      body: payloadStr,
    });
    await webhookHandler(req, res);
    assert.equal(res.statusCode, 401);
    assert.equal(res.body.success, false);
  });

  test("6. Rejects tampered raw payload with 401 Unauthorized", async () => {
    const originalPayload = JSON.stringify({
      webhookEvent: "jira:issue_created",
      issue: { key: "DI-10" },
    });
    const signature = generateSignature(originalPayload, TEST_SECRET);

    // Tampered payload (attacker modified payload body)
    const tamperedPayload = JSON.stringify({
      webhookEvent: "jira:issue_created",
      issue: { key: "DI-999" },
    });

    const { req, res } = createMockReqRes({
      headers: { "x-hub-signature": signature },
      body: tamperedPayload,
      rawBody: Buffer.from(tamperedPayload, "utf8"),
    });

    await webhookHandler(req, res);
    assert.equal(res.statusCode, 401);
    assert.equal(res.body.success, false);
    assert.match(res.body.error, /Invalid webhook signature/);
  });

  test("7. Rejects signature signed with incorrect secret with 401 Unauthorized", async () => {
    const payloadStr = JSON.stringify({ webhookEvent: "jira:issue_created" });
    const wrongSignature = generateSignature(payloadStr, "wrong_secret_123");

    const { req, res } = createMockReqRes({
      headers: { "x-hub-signature": wrongSignature },
      body: payloadStr,
    });

    await webhookHandler(req, res);
    assert.equal(res.statusCode, 401);
    assert.equal(res.body.success, false);
  });

  test("8. Correctly validates HMAC-SHA256 in verifyJiraWebhookSignature helper", () => {
    const rawBuf = Buffer.from('{"hello":"world"}', "utf8");
    const hmacHex = crypto.createHmac("sha256", TEST_SECRET).update(rawBuf).digest("hex");

    assert.equal(verifyJiraWebhookSignature(rawBuf, hmacHex, TEST_SECRET), true);
    assert.equal(verifyJiraWebhookSignature(rawBuf, "a".repeat(64), TEST_SECRET), false);
    assert.equal(verifyJiraWebhookSignature(rawBuf, hmacHex, "different_secret"), false);
  });

  test("9. Handles jira:issue_created event and NEVER creates an outgoing Jira issue", async () => {
    let outboundJiraFetchCalled = false;
    globalThis.fetch = async (url) => {
      if (String(url).includes("atlassian.net")) {
        outboundJiraFetchCalled = true;
      }
      return new Response(JSON.stringify({}), { status: 200 });
    };

    const payload = {
      timestamp: 1606480436302,
      webhookEvent: "jira:issue_created",
      issue_event_type_name: "issue_created",
      user: { displayName: "Sarah Chen", accountId: "557058:mock" },
      issue: {
        id: "10500",
        key: "DI-42",
        fields: {
          summary: "Automated Lead (Commercial RFQ): Apex Automation",
          project: { key: "DI" },
          issuetype: { name: "Task" },
          status: { name: "Open" },
        },
      },
    };

    const payloadStr = JSON.stringify(payload);
    const signature = generateSignature(payloadStr, TEST_SECRET);

    const { req, res } = createMockReqRes({
      headers: { "x-hub-signature": signature },
      body: payloadStr,
      rawBody: Buffer.from(payloadStr, "utf8"),
    });

    await webhookHandler(req, res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.event, "jira:issue_created");
    assert.equal(res.body.issueKey, "DI-42");
    assert.equal(res.body.projectKey, "DI");
    assert.equal(res.body.status, "Open");
    assert.equal(res.body.action, "processed");

    // CRITICAL: Must NEVER call Jira to create tasks
    assert.equal(outboundJiraFetchCalled, false, "Webhook handler must NEVER create Jira tasks");
  });

  test("10. Handles jira:issue_updated with changelog and NEVER creates an outgoing Jira issue", async () => {
    let outboundJiraFetchCalled = false;
    globalThis.fetch = async (url) => {
      if (String(url).includes("atlassian.net")) {
        outboundJiraFetchCalled = true;
      }
      return new Response(JSON.stringify({}), { status: 200 });
    };

    const payload = {
      timestamp: 1606480500000,
      webhookEvent: "jira:issue_updated",
      issue_event_type_name: "issue_updated",
      issue: {
        id: "10500",
        key: "DI-42",
        fields: {
          summary: "Automated Lead (Commercial RFQ): Apex Automation",
          project: { key: "DI" },
          status: { name: "In Progress" },
        },
      },
      changelog: {
        id: "20101",
        items: [
          {
            field: "status",
            fieldtype: "jira",
            fromString: "Open",
            toString: "In Progress",
          },
          {
            field: "assignee",
            fieldtype: "jira",
            fromString: null,
            toString: "Senior Applications Engineer",
          },
        ],
      },
    };

    const payloadStr = JSON.stringify(payload);
    const signature = generateSignature(payloadStr, TEST_SECRET);

    const { req, res } = createMockReqRes({
      headers: { "x-hub-signature": signature },
      body: payloadStr,
      rawBody: Buffer.from(payloadStr, "utf8"),
    });

    await webhookHandler(req, res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.event, "jira:issue_updated");
    assert.equal(res.body.issueKey, "DI-42");
    assert.equal(res.body.status, "In Progress");
    assert.equal(res.body.changesCount, 2);
    assert.equal(res.body.changedFields[0].field, "status");
    assert.equal(res.body.changedFields[0].toString, "In Progress");

    assert.equal(outboundJiraFetchCalled, false, "Webhook handler must NEVER create Jira tasks");
  });

  test("11. Handles unrecognized Jira events gracefully with 200 OK without side effects", async () => {
    const payload = {
      webhookEvent: "jira:version_created",
      timestamp: Date.now(),
    };
    const payloadStr = JSON.stringify(payload);
    const signature = generateSignature(payloadStr, TEST_SECRET);

    const { req, res } = createMockReqRes({
      headers: { "x-hub-signature": signature },
      body: payloadStr,
      rawBody: Buffer.from(payloadStr, "utf8"),
    });

    await webhookHandler(req, res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.action, "ignored");
  });

  test("12. Secret is never returned in response body or error messages", async () => {
    const { req, res } = createMockReqRes({
      headers: { "x-hub-signature": "sha256=invalid" },
      body: '{"test":1}',
    });

    await webhookHandler(req, res);

    const stringifiedResponse = JSON.stringify(res.body);
    assert.equal(
      stringifiedResponse.includes(TEST_SECRET),
      false,
      "Secret must NEVER be present in response",
    );
  });
});
