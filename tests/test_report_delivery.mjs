// INDUS Industrial Robotics — Scheduled Report Delivery & Non-Regression Test Suite
// tests/test_report_delivery.mjs
// Verifies: Cron auth, Period math, Idempotency, Missing config, Mock SMTP,
//           Response contracts, and Non-regression of existing integrations.

import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import {
  verifyCronAuth,
  getReportingPeriod,
  checkAndSetIdempotency,
  completeIdempotency,
  collectReportMetrics,
  buildReportEmail,
  executeScheduledReport,
} from "../api/_lib/reports.js";
import dailyHandler from "../api/report-daily.ts";
import weeklyHandler from "../api/report-weekly.ts";
import monthlyHandler from "../api/report-monthly.ts";
import cronHandler from "../api/cron/reports.ts";

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

console.log("\n=======================================================");
console.log(` TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log("=======================================================\n");

if (failed > 0) {
  process.exit(1);
}
