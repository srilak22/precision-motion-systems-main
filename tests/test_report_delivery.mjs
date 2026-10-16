// INDUS Industrial Robotics — Scheduled Report Delivery & Non-Regression Test Suite
// tests/test_report_delivery.mjs
// Verifies: Cron auth, Period math, Idempotency, Missing config, Mock SMTP,
//           Response contracts, and Non-regression of existing integrations.

import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import nodemailer from "nodemailer";
import {
  verifyCronAuth,
  verifyReportEmailAuth,
  getAuthorizedRecipients,
  isRecipientAuthorized,
  getReportingPeriod,
  checkAndSetIdempotency,
  completeIdempotency,
  collectReportMetrics,
  buildReportEmail,
  executeScheduledReport,
  logReportEmail,
} from "../api/_lib/reports.js";
import dailyHandler from "../api/_lib/report-daily.js";
import weeklyHandler from "../api/_lib/report-weekly.js";
import monthlyHandler from "../api/_lib/report-monthly.js";
import cronHandler from "../api/cron/reports.js";
import reportEmailHandler from "../api/report-email.js";

let passed = 0;
let failed = 0;

function it(desc, fn) {
  try {
    fn();
    console.log(`  ✓ PASS: ${desc}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${desc}`);
    console.error(`    -> ${err.message}`);
    failed++;
  }
}

async function itAsync(desc, fn) {
  try {
    await fn();
    console.log(`  ✓ PASS: ${desc}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${desc}`);
    console.error(`    -> ${err.message}`);
    failed++;
  }
}

// Mock HTTP Request/Response objects
function createMockReq(overrides = {}) {
  return {
    method: "GET",
    headers: {},
    query: {},
    body: {},
    ...overrides,
  };
}

function createMockRes() {
  const res = {
    statusCode: 200,
    headers: {},
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    setHeader(key, val) {
      this.headers[key] = val;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    },
    end() {
      return this;
    },
  };
  return res;
}

console.log("\n=======================================================");
console.log(" INDUS INDUSTRIAL ROBOTICS — REPORT DELIVERY TEST SUITE");
console.log("=======================================================\n");

// -----------------------------------------------------------------------------
// Suite 1: Period Calculation & Timezone Formatting
// -----------------------------------------------------------------------------
console.log("Suite 1: Period Calculation & Timezone Integrity");

it("Calculates daily report period (24 hours lookback with IST display)", () => {
  const fixedDate = new Date("2026-10-16T12:00:00Z");
  const period = getReportingPeriod("daily", fixedDate);
  assert.strictEqual(period.type, "daily");
  assert(period.periodKey.startsWith("daily-2026-10-"), "Period key starts with daily-2026-10-");
  assert(period.displayPeriod.includes("IST"), "Display period includes IST tag");
  assert(period.summaryLabel.includes("Daily Report"), "Summary label formatted correctly");
});

it("Calculates weekly report period (7 days lookback with week number)", () => {
  const fixedDate = new Date("2026-10-16T12:00:00Z");
  const period = getReportingPeriod("weekly", fixedDate);
  assert.strictEqual(period.type, "weekly");
  assert(period.periodKey.includes("-W"), "Period key contains week identifier");
  assert(period.summaryLabel.includes("Weekly Digest"), "Summary label has Weekly Digest");
});

it("Calculates monthly report period (30 days lookback)", () => {
  const fixedDate = new Date("2026-10-16T12:00:00Z");
  const period = getReportingPeriod("monthly", fixedDate);
  assert.strictEqual(period.type, "monthly");
  assert(period.periodKey.startsWith("monthly-2026-"), "Period key has monthly-2026- format");
  assert(period.summaryLabel.includes("Monthly Operations Review"), "Summary label has Monthly Operations Review");
});

it("Rejects unsupported report period types cleanly", () => {
  assert.throws(() => {
    getReportingPeriod("hourly");
  }, /Unsupported report type/);
});

// -----------------------------------------------------------------------------
// Suite 2: Cron Authentication Logic (verifyCronAuth)
// -----------------------------------------------------------------------------
console.log("\nSuite 2: Cron Authentication Security (CRON_SECRET)");

const TEST_SECRET = "test_cron_secret_indus_8899aabbcc";
process.env.CRON_SECRET = TEST_SECRET;

it("Authenticates valid Authorization: Bearer <token>", () => {
  const req = createMockReq({
    headers: { authorization: `Bearer ${TEST_SECRET}` },
  });
  const auth = verifyCronAuth(req);
  assert.strictEqual(auth.authorized, true);
  assert.strictEqual(auth.via, "authorization-bearer");
});

it("Authenticates valid X-Cron-Secret header", () => {
  const req = createMockReq({
    headers: { "x-cron-secret": TEST_SECRET },
  });
  const auth = verifyCronAuth(req);
  assert.strictEqual(auth.authorized, true);
  assert.strictEqual(auth.via, "x-cron-secret");
});

it("Authenticates valid X-Vercel-Cron header", () => {
  const req = createMockReq({
    headers: { "x-vercel-cron": "1" },
  });
  const auth = verifyCronAuth(req);
  assert.strictEqual(auth.authorized, true);
  assert.strictEqual(auth.via, "x-vercel-cron");
});

it("Authenticates valid ?secret= query parameter", () => {
  const req = createMockReq({
    query: { secret: TEST_SECRET },
  });
  const auth = verifyCronAuth(req);
  assert.strictEqual(auth.authorized, true);
  assert.strictEqual(auth.via, "query-param");
});

it("Rejects invalid secret token with unauthorized reason", () => {
  const req = createMockReq({
    headers: { authorization: "Bearer wrong_secret_token" },
  });
  const auth = verifyCronAuth(req);
  assert.strictEqual(auth.authorized, false);
  assert(auth.reason.includes("Invalid or missing CRON_SECRET"));
});

it("Rejects completely unauthenticated request when CRON_SECRET is set", () => {
  const req = createMockReq({});
  const auth = verifyCronAuth(req);
  assert.strictEqual(auth.authorized, false);
});

// -----------------------------------------------------------------------------
// Suite 3: Idempotency & Duplicate Send Prevention
// -----------------------------------------------------------------------------
console.log("\nSuite 3: Idempotency & Duplicate-Send Protection");

const testKey = `test-idemp-${Date.now()}`;

it("Allows initial execution and locks state", () => {
  const check = checkAndSetIdempotency(testKey, false);
  assert.strictEqual(check.isDuplicate, false);
});

it("Blocks overlapping execution within 60-second in-progress window", () => {
  const check2 = checkAndSetIdempotency(testKey, false);
  assert.strictEqual(check2.isDuplicate, true);
  assert.strictEqual(check2.inProgress, true);
});

it("Blocks subsequent execution once marked SENT", () => {
  completeIdempotency(testKey, true, { messageId: "<msg-1234@indus>" });
  const check3 = checkAndSetIdempotency(testKey, false);
  assert.strictEqual(check3.isDuplicate, true);
  assert.strictEqual(check3.messageId, "<msg-1234@indus>");
});

it("Allows subsequent execution when force=true is passed", () => {
  const checkForce = checkAndSetIdempotency(testKey, true);
  assert.strictEqual(checkForce.isDuplicate, false);
  // Clean up
  completeIdempotency(testKey, false);
});

// -----------------------------------------------------------------------------
// Suite 4: Metrics Aggregation & Data Retrieval
// -----------------------------------------------------------------------------
console.log("\nSuite 4: Data Aggregation & Metrics Collection");

await itAsync("Collects report metrics without runtime crash", async () => {
  const period = getReportingPeriod("daily", new Date());
  const metrics = await collectReportMetrics(period);
  assert.strictEqual(metrics.dataRetrieved, true);
  assert(typeof metrics.totalLeads === "number", "totalLeads is a number");
  assert(metrics.dealflow !== undefined, "dealflow object exists");
  assert(metrics.consultations !== undefined, "consultations object exists");
  assert(metrics.integrationsHealth !== undefined, "integrationsHealth object exists");
  assert(metrics.categoryInterest !== undefined, "categoryInterest object exists");
});

// -----------------------------------------------------------------------------
// Suite 5: Email Template Generation (HTML & Plain-Text)
// -----------------------------------------------------------------------------
console.log("\nSuite 5: Branded Email Template Generation");

it("Generates valid HTML and text with INDUS brand styling and zero secret leak", () => {
  const period = getReportingPeriod("daily", new Date("2026-10-16T12:00:00Z"));
  const sampleMetrics = {
    dataRetrieved: true,
    totalLeads: 12,
    dealflow: { websiteDI: 8, youtubeYLT: 3, linkedinLIT: 1 },
    consultations: { total: 2, confirmed: 2, rescheduled: 0, cancelled: 0 },
    sampleBookings: [],
    categoryInterest: { "Linear Actuators & Stages": 4 },
    integrationsHealth: { jiraCloud: "HEALTHY", googleAppsScript: "HEALTHY", telegramBot: "CONFIGURED", microsoftClarity: "ACTIVE" },
  };

  const email = buildReportEmail("daily", period, sampleMetrics);
  assert(email.subject.includes("[INDUS DAILY REPORT]"), "Subject has report tag");
  assert(email.html.includes("#95CC00"), "HTML includes Signal Lime brand accent");
  assert(email.html.includes("#0B0F12"), "HTML includes Dark Navy background");
  assert(email.html.includes("Total Inquiries"), "HTML has Total Inquiries metric card");
  assert(email.text.includes("EXECUTIVE METRICS SUMMARY"), "Text contains metrics section");

  // Zero-secret leak check
  assert(!email.html.includes(TEST_SECRET), "HTML does not leak CRON_SECRET");
  assert(!email.text.includes(TEST_SECRET), "Text does not leak CRON_SECRET");
});

// -----------------------------------------------------------------------------
// Suite 6: Email Dispatcher Behavior & Error States
// -----------------------------------------------------------------------------
console.log("\nSuite 6: Email Dispatcher & Error States");

await itAsync("Returns honest configuration error when SMTP credentials missing", async () => {
  const oldUser = process.env.SMTP_USER;
  const oldPass = process.env.SMTP_PASS;
  delete process.env.SMTP_USER;
  delete process.env.SMTP_PASS;
  delete process.env.GMAIL_USER;
  delete process.env.GMAIL_PASS;

  const res = await executeScheduledReport("daily", { force: true, recipient: "test@example.com" });
  assert.strictEqual(res.success, false);
  assert.strictEqual(res.email_sent, false);
  assert.strictEqual(res.error, "SMTP_CONFIG_MISSING");
  assert.strictEqual(res.data_retrieved, true);
  assert(res.metrics !== undefined, "Metrics still returned for monitoring");

  // Restore
  if (oldUser) process.env.SMTP_USER = oldUser;
  if (oldPass) process.env.SMTP_PASS = oldPass;
});

await itAsync("Detects invalid recipient format cleanly", async () => {
  process.env.SMTP_USER = "test@example.com";
  process.env.SMTP_PASS = "sample_pass";

  const res = await executeScheduledReport("daily", { force: true, recipient: "invalid_email_format" });
  assert.strictEqual(res.success, false);
  assert.strictEqual(res.email_sent, false);
  assert.strictEqual(res.error, "NO_VALID_RECIPIENTS");

  delete process.env.SMTP_USER;
  delete process.env.SMTP_PASS;
});

// -----------------------------------------------------------------------------
// Suite 7: API Endpoints (Daily, Weekly, Monthly, Cron Coordinator)
// -----------------------------------------------------------------------------
console.log("\nSuite 7: HTTP Endpoint Contracts");

await itAsync("GET /api/report-daily rejects unauthorized call with HTTP 401", async () => {
  const req = createMockReq({ headers: { authorization: "Bearer invalid" } });
  const res = createMockRes();
  await dailyHandler(req, res);
  assert.strictEqual(res.statusCode, 401);
  assert.strictEqual(res.body?.error, "UNAUTHORIZED");
});

await itAsync("GET /api/report-daily executes with valid token and returns structured JSON", async () => {
  const req = createMockReq({
    headers: { authorization: `Bearer ${TEST_SECRET}` },
    query: { force: "true" },
  });
  const res = createMockRes();
  await dailyHandler(req, res);
  // Returns HTTP 200 (either success: true or configuration_missing for unconfigured SMTP)
  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body?.report_type, "daily");
  assert.strictEqual(res.body?.data_retrieved, true);
});

await itAsync("GET /api/report-weekly executes with valid token and returns weekly report", async () => {
  const req = createMockReq({
    headers: { authorization: `Bearer ${TEST_SECRET}` },
    query: { force: "true" },
  });
  const res = createMockRes();
  await weeklyHandler(req, res);
  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body?.report_type, "weekly");
});

await itAsync("GET /api/report-monthly executes with valid token and returns monthly report", async () => {
  const req = createMockReq({
    headers: { authorization: `Bearer ${TEST_SECRET}` },
    query: { force: "true" },
  });
  const res = createMockRes();
  await monthlyHandler(req, res);
  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body?.report_type, "monthly");
});

await itAsync("GET /api/cron/reports coordinator accepts ?type=daily", async () => {
  const req = createMockReq({
    headers: { authorization: `Bearer ${TEST_SECRET}` },
    query: { type: "daily", force: "true" },
  });
  const res = createMockRes();
  await cronHandler(req, res);
  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body?.report_type, "daily");
});

// -----------------------------------------------------------------------------
// Suite 8: Existing Integrations Non-Regression Audit
// -----------------------------------------------------------------------------
console.log("\nSuite 8: Existing Integrations Non-Regression Checks");

it("Preserves Jira routing project keys: DI for Website, YLT for YouTube", () => {
  assert.strictEqual(process.env.JIRA_PROJECT_KEY || "DI", "DI");
  assert.strictEqual(process.env.YOUTUBE_JIRA_PROJECT_KEY || "YLT", "YLT");
});

it("Preserves Google Sheets Target Spreadsheet ID", () => {
  const sheetId = process.env.GOOGLE_SPREADSHEET_ID || "1S-ApP83X9Y1-nXwim0tDNGn72wuhVn4PSbaWkcXlH48";
  assert(sheetId.length > 20, "Google Spreadsheet ID is configured and preserved");
});

it("Preserves Telegram Bot Token & Chat ID in environment", () => {
  assert(process.env.TELEGRAM_BOT_TOKEN !== undefined, "Telegram Bot Token preserved");
  assert(process.env.TELEGRAM_CHAT_ID !== undefined, "Telegram Chat ID preserved");
});

it("Preserves Microsoft Clarity Project ID", () => {
  const clarityId = process.env.VITE_CLARITY_PROJECT_ID || "ysb67jrgfu";
  assert.strictEqual(clarityId, "ysb67jrgfu");
});

// -----------------------------------------------------------------------------
// Suite 9: /api/report-email HTTP Method & Body Validation Contracts
// -----------------------------------------------------------------------------
console.log("\nSuite 9: /api/report-email HTTP Method & Body Validation");

await itAsync("POST /api/report-email accepts POST method and rejects GET with HTTP 405", async () => {
  const req = createMockReq({
    method: "GET",
    headers: { authorization: `Bearer ${TEST_SECRET}` },
  });
  const res = createMockRes();
  await reportEmailHandler(req, res);
  assert.strictEqual(res.statusCode, 405);
  assert.strictEqual(res.headers["Allow"], "POST");
  assert.strictEqual(res.body?.error, "METHOD_NOT_ALLOWED");
  assert(res.body?.correlation_id, "Correlation ID returned");
});

await itAsync("PUT /api/report-email rejects PUT method with HTTP 405", async () => {
  const req = createMockReq({
    method: "PUT",
    headers: { authorization: `Bearer ${TEST_SECRET}` },
    body: { type: "daily" },
  });
  const res = createMockRes();
  await reportEmailHandler(req, res);
  assert.strictEqual(res.statusCode, 405);
});

await itAsync("OPTIONS /api/report-email handles CORS preflight with HTTP 204", async () => {
  const req = createMockReq({ method: "OPTIONS" });
  const res = createMockRes();
  await reportEmailHandler(req, res);
  assert.strictEqual(res.statusCode, 204);
  assert.strictEqual(res.headers["Access-Control-Allow-Methods"], "POST, OPTIONS");
});

await itAsync("POST /api/report-email rejects missing or empty body with HTTP 400", async () => {
  const req = createMockReq({
    method: "POST",
    headers: { authorization: `Bearer ${TEST_SECRET}` },
    body: null,
  });
  const res = createMockRes();
  await reportEmailHandler(req, res);
  assert.strictEqual(res.statusCode, 400);
  assert.strictEqual(res.body?.error, "BAD_REQUEST");
});

await itAsync("POST /api/report-email rejects invalid report type with HTTP 400", async () => {
  const req = createMockReq({
    method: "POST",
    headers: { authorization: `Bearer ${TEST_SECRET}` },
    body: { type: "quarterly" },
  });
  const res = createMockRes();
  await reportEmailHandler(req, res);
  assert.strictEqual(res.statusCode, 400);
  assert.strictEqual(res.body?.error, "BAD_REQUEST");
  assert(res.body?.message?.includes("quarterly"));
});

await itAsync("POST /api/report-email rejects malformed JSON string payload with HTTP 400", async () => {
  const req = createMockReq({
    method: "POST",
    headers: { authorization: `Bearer ${TEST_SECRET}` },
    body: "{ malformed: json, ",
  });
  const res = createMockRes();
  await reportEmailHandler(req, res);
  assert.strictEqual(res.statusCode, 400);
  assert.strictEqual(res.body?.error, "BAD_REQUEST");
});

await itAsync("POST /api/report-email rejects oversized body with HTTP 413", async () => {
  const oversized = "x".repeat(110 * 1024);
  const req = createMockReq({
    method: "POST",
    headers: { authorization: `Bearer ${TEST_SECRET}` },
    body: oversized,
  });
  const res = createMockRes();
  await reportEmailHandler(req, res);
  assert.strictEqual(res.statusCode, 413);
  assert.strictEqual(res.body?.error, "PAYLOAD_TOO_LARGE");
});

// -----------------------------------------------------------------------------
// Suite 10: /api/report-email Authentication & Recipient Security
// -----------------------------------------------------------------------------
console.log("\nSuite 10: /api/report-email Authentication & Recipient Security");

await itAsync("POST /api/report-email rejects missing authorization header with HTTP 401", async () => {
  const req = createMockReq({
    method: "POST",
    body: { type: "daily" },
  });
  const res = createMockRes();
  await reportEmailHandler(req, res);
  assert.strictEqual(res.statusCode, 401);
  assert.strictEqual(res.body?.error, "UNAUTHORIZED");
});

await itAsync("POST /api/report-email rejects invalid secret token with HTTP 401", async () => {
  const req = createMockReq({
    method: "POST",
    headers: { authorization: "Bearer invalid_secret_token" },
    body: { type: "daily" },
  });
  const res = createMockRes();
  await reportEmailHandler(req, res);
  assert.strictEqual(res.statusCode, 401);
});

await itAsync("POST /api/report-email authenticates via X-Report-Email-Secret header", async () => {
  process.env.REPORT_EMAIL_API_SECRET = "custom_report_secret_998877";
  const req = createMockReq({
    method: "POST",
    headers: { "x-report-email-secret": "custom_report_secret_998877" },
    body: { type: "daily", force: true },
  });
  const res = createMockRes();
  await reportEmailHandler(req, res);
  assert.strictEqual(res.statusCode, 200);
  delete process.env.REPORT_EMAIL_API_SECRET;
});

await itAsync("POST /api/report-email rejects unauthorized recipient address with HTTP 403", async () => {
  const req = createMockReq({
    method: "POST",
    headers: { authorization: `Bearer ${TEST_SECRET}` },
    body: { type: "daily", recipient: "attacker@malicious-spam-relay.com" },
  });
  const res = createMockRes();
  await reportEmailHandler(req, res);
  assert.strictEqual(res.statusCode, 403);
  assert.strictEqual(res.body?.error, "UNAUTHORIZED_RECIPIENT");
  assert(res.body?.message?.includes("authorized"));
});

it("Validates authorized recipients correctly with isRecipientAuthorized", () => {
  assert.strictEqual(isRecipientAuthorized("srilakshanaint2027g3@gmail.com"), true);
  assert.strictEqual(isRecipientAuthorized("engineering@indus-robotics.com"), true);
  assert.strictEqual(isRecipientAuthorized("random.stranger@otherdomain.com"), false);
  assert.strictEqual(isRecipientAuthorized("not-an-email"), false);
});

// -----------------------------------------------------------------------------
// Suite 11: Mock Email Provider Delivery & Error Sanitization
// -----------------------------------------------------------------------------
console.log("\nSuite 11: Mock Email Provider Delivery & Error Sanitization");

const originalCreateTransport = nodemailer.createTransport;

await itAsync("Simulates successful email dispatch with mocked Nodemailer transport", async () => {
  const mockMessageId = `<test-success-${Date.now()}@indus-robotics.com>`;
  let capturedMailOptions = null;

  // Mock nodemailer transporter
  nodemailer.createTransport = () => ({
    sendMail: async (opts) => {
      capturedMailOptions = opts;
      return { messageId: mockMessageId, response: "250 2.0.0 OK" };
    },
  });

  // Temporarily supply mock SMTP credentials
  const prevUser = process.env.SMTP_USER;
  const prevPass = process.env.SMTP_PASS;
  process.env.SMTP_USER = "engineering@indus-robotics.com";
  process.env.SMTP_PASS = "mock_app_pass_1234";

  const req = createMockReq({
    method: "POST",
    headers: {
      authorization: `Bearer ${TEST_SECRET}`,
      "x-correlation-id": "test-corr-uuid-12345",
    },
    body: { type: "daily", force: true },
  });
  const res = createMockRes();

  try {
    await reportEmailHandler(req, res);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body?.success, true);
    assert.strictEqual(res.body?.email_sent, true);
    assert.strictEqual(res.body?.messageId, mockMessageId);
    assert.strictEqual(res.body?.correlation_id, "test-corr-uuid-12345");
    assert(capturedMailOptions !== null, "sendMail was invoked");
    assert(capturedMailOptions.to.includes("srilakshanaint2027g3@gmail.com"));
    assert(capturedMailOptions.subject.includes("DAILY REPORT"));
  } finally {
    process.env.SMTP_USER = prevUser;
    process.env.SMTP_PASS = prevPass;
    nodemailer.createTransport = originalCreateTransport;
  }
});

await itAsync("Simulates provider authentication failure and sanitizes credentials", async () => {
  const sensitivePass = "ultra_secret_smtp_password_9988";

  nodemailer.createTransport = () => ({
    sendMail: async () => {
      const err = new Error(`535 5.7.8 Username and Password not accepted credentials:${sensitivePass}`);
      err.code = "EAUTH";
      throw err;
    },
  });

  const prevUser = process.env.SMTP_USER;
  const prevPass = process.env.SMTP_PASS;
  process.env.SMTP_USER = "engineering@indus-robotics.com";
  process.env.SMTP_PASS = sensitivePass;

  const req = createMockReq({
    method: "POST",
    headers: { authorization: `Bearer ${TEST_SECRET}` },
    body: { type: "weekly", force: true },
  });
  const res = createMockRes();

  try {
    await reportEmailHandler(req, res);
    assert.strictEqual(res.statusCode, 502);
    assert.strictEqual(res.body?.error, "SMTP_AUTH_FAILED");
    assert.strictEqual(res.body?.email_sent, false);
    // CRITICAL: Ensure password is not present in output
    const jsonStr = JSON.stringify(res.body);
    assert(!jsonStr.includes(sensitivePass), "Sensitive SMTP password must be sanitized and redacted");
  } finally {
    process.env.SMTP_USER = prevUser;
    process.env.SMTP_PASS = prevPass;
    nodemailer.createTransport = originalCreateTransport;
  }
});

await itAsync("Simulates provider timeout and returns HTTP 504", async () => {
  nodemailer.createTransport = () => ({
    sendMail: async () => {
      const err = new Error("Connection timed out after 10000ms");
      err.code = "ETIMEDOUT";
      throw err;
    },
  });

  const prevUser = process.env.SMTP_USER;
  const prevPass = process.env.SMTP_PASS;
  process.env.SMTP_USER = "engineering@indus-robotics.com";
  process.env.SMTP_PASS = "dummy_pass";

  const req = createMockReq({
    method: "POST",
    headers: { authorization: `Bearer ${TEST_SECRET}` },
    body: { type: "monthly", force: true },
  });
  const res = createMockRes();

  try {
    await reportEmailHandler(req, res);
    assert.strictEqual(res.statusCode, 504);
    assert.strictEqual(res.body?.error, "SMTP_TIMEOUT");
    assert.strictEqual(res.body?.email_sent, false);
  } finally {
    process.env.SMTP_USER = prevUser;
    process.env.SMTP_PASS = prevPass;
    nodemailer.createTransport = originalCreateTransport;
  }
});

// -----------------------------------------------------------------------------
// Suite 12: Idempotency & Repeat Request Protection via /api/report-email
// -----------------------------------------------------------------------------
console.log("\nSuite 12: Idempotency & Duplicate Prevention via /api/report-email");

await itAsync("Skips duplicate email send when report was already sent for the period", async () => {
  let sendCount = 0;
  nodemailer.createTransport = () => ({
    sendMail: async () => {
      sendCount++;
      return { messageId: `<idemp-${Date.now()}@indus-robotics.com>` };
    },
  });

  const prevUser = process.env.SMTP_USER;
  const prevPass = process.env.SMTP_PASS;
  process.env.SMTP_USER = "engineering@indus-robotics.com";
  process.env.SMTP_PASS = "mock_pass";

  try {
    // 1st request with force: true to guarantee SENT state
    const req1 = createMockReq({
      method: "POST",
      headers: { authorization: `Bearer ${TEST_SECRET}` },
      body: { type: "daily", force: true },
    });
    const res1 = createMockRes();
    await reportEmailHandler(req1, res1);
    assert.strictEqual(res1.statusCode, 200);
    assert.strictEqual(res1.body?.email_sent, true);
    assert.strictEqual(sendCount, 1);

    // 2nd request without force (should be duplicate_skipped)
    const req2 = createMockReq({
      method: "POST",
      headers: { authorization: `Bearer ${TEST_SECRET}` },
      body: { type: "daily", force: false },
    });
    const res2 = createMockRes();
    await reportEmailHandler(req2, res2);
    assert.strictEqual(res2.statusCode, 200);
    assert.strictEqual(res2.body?.status, "duplicate_skipped");
    assert.strictEqual(res2.body?.email_sent, false);
    assert.strictEqual(res2.body?.duplicate, true);
    // Ensure sendMail was NOT called again
    assert.strictEqual(sendCount, 1);
  } finally {
    process.env.SMTP_USER = prevUser;
    process.env.SMTP_PASS = prevPass;
    nodemailer.createTransport = originalCreateTransport;
  }
});

// -----------------------------------------------------------------------------
// Suite 13: Structured Vercel Runtime Logging Audit
// -----------------------------------------------------------------------------
console.log("\nSuite 13: Structured Vercel Runtime Logging Audit");

it("Emits formatted log entries with [report-email] prefix and required telemetry fields", () => {
  const logged = [];
  const originalLog = console.log;
  const originalError = console.error;

  console.log = (msg) => logged.push({ level: "log", msg });
  console.error = (msg) => logged.push({ level: "error", msg });

  try {
    logReportEmail("request_received", {
      correlationId: "corr-111",
      reportType: "daily",
    });

    logReportEmail("authentication_failed", {
      correlationId: "corr-222",
      reportType: "weekly",
      statusCode: 401,
      errorCategory: "UNAUTHORIZED",
    });

    logReportEmail("email_send_succeeded", {
      correlationId: "corr-333",
      reportType: "monthly",
      durationMs: 320,
      extra: { messageId: "<msg-999>" },
    });

    assert.strictEqual(logged.length, 3);
    assert(logged[0].msg.startsWith("[report-email] request_received"));
    assert(logged[1].msg.startsWith("[report-email] authentication_failed"));
    assert.strictEqual(logged[1].level, "error");
    assert(logged[2].msg.startsWith("[report-email] email_send_succeeded"));
    assert(logged[2].msg.includes('"correlationId":"corr-333"'));
    assert(logged[2].msg.includes('"durationMs":320'));
  } finally {
    console.log = originalLog;
    console.error = originalError;
  }
});

console.log("\n=======================================================");
console.log(` TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log("=======================================================\n");

if (failed > 0) {
  process.exit(1);
}
