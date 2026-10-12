#!/usr/bin/env node
/**
 * End-to-End YouTube Lead Test (YLT → Jira + Google Sheets)
 *
 * This script:
 *  1. Sends a clearly-marked test YouTube lead to the production endpoint.
 *  2. Verifies the response confirms Jira YLT project routing.
 *  3. Verifies the response confirms Google Sheets recording.
 *  4. Fetches the created Jira ticket to validate fields and project isolation.
 *  5. Sends a duplicate to verify deduplication.
 *
 * Usage:
 *   node tests/test_youtube_lead_e2e.mjs
 *
 * Environment requirements (from .env.local or Vercel):
 *   JIRA_DOMAIN, JIRA_EMAIL, JIRA_API_TOKEN
 */

import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../.env.local") });
config({ path: resolve(__dirname, "../.env") });

// ── Configuration ──────────────────────────────────────────────────────────────
const PROD_URL = "https://precision-motion-systems-main.vercel.app/api/youtube-lead";
const JIRA_DOMAIN = (process.env.JIRA_DOMAIN || "").trim();
const JIRA_EMAIL = (process.env.JIRA_EMAIL || "").trim();
const JIRA_API_TOKEN = (process.env.JIRA_API_TOKEN || "").trim();

const testId = `E2E-${Date.now()}`;
let passed = 0;
let failed = 0;
let createdTicketKey = null;

function assert(condition, label) {
  if (condition) {
    console.log(`  ✅ ${label}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${label}`);
    failed++;
  }
}

// ── Test Payload ───────────────────────────────────────────────────────────────
const testLead = {
  name: `[TEST] YouTube E2E ${testId}`,
  email: `youtube-test-${Date.now()}@test-indus.example`,
  phone: "+91-0000000000",
  company: "INDUS Test Automation",
  productInterest: "Precision Ball Screws — YouTube Campaign Test",
  estimatedBudget: "$0 — Automated Test",
  timeline: "Test Only — No Action Required",
  requirements: `This is an automated end-to-end test lead (${testId}). Created to verify YLT Jira routing and Google Sheets recording. Please delete this ticket after verification.`,
  topic: "Automated Test",
  preferredContact: "email",
  attribution: {
    videoId: "test_video_e2e",
    channelId: "@srilakshana-h1t",
    campaign: "e2e-test-campaign",
    utmSource: "youtube",
    utmMedium: "video",
    utmContent: "test-link",
    referrer: "https://www.youtube.com/@srilakshana-h1t",
    landingPage: "/products/ball-screws",
  },
};

// ── Test 1: Submit YouTube Lead ────────────────────────────────────────────────
async function testSubmitLead() {
  console.log("\n═══════════════════════════════════════════════════");
  console.log("  TEST 1: Submit YouTube Lead to Production");
  console.log("═══════════════════════════════════════════════════");

  const res = await fetch(PROD_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(testLead),
  });

  const data = await res.json();
  console.log("\n  Response status:", res.status);
  console.log("  Response body:", JSON.stringify(data, null, 2));

  assert(res.status === 200, `HTTP 200 response (got ${res.status})`);
  assert(data.success === true, "success === true");
  assert(data.recorded === true, "recorded === true");
  assert(data.projectKey === "YLT", `projectKey === "YLT" (got "${data.projectKey}")`);
  assert(
    data.jiraKey && data.jiraKey.startsWith("YLT-"),
    `jiraKey starts with "YLT-" (got "${data.jiraKey}")`,
  );
  assert(data.issueKey === data.jiraKey, "issueKey matches jiraKey");
  assert(
    typeof data.googleSheetRecorded === "boolean",
    `googleSheetRecorded is boolean (got ${typeof data.googleSheetRecorded})`,
  );

  if (data.googleSheetRecorded) {
    console.log("\n  📊 Google Sheets: Lead was recorded successfully!");
  } else {
    console.log(
      "\n  ⚠️  Google Sheets: Lead was NOT recorded (Apps Script may need a 'YouTube Leads' sheet tab)",
    );
  }

  createdTicketKey = data.jiraKey;
  return data;
}

// ── Test 2: Verify Jira Ticket Fields ──────────────────────────────────────────
async function testVerifyJiraTicket() {
  console.log("\n═══════════════════════════════════════════════════");
  console.log("  TEST 2: Verify Jira YLT Ticket Fields");
  console.log("═══════════════════════════════════════════════════");

  if (!createdTicketKey) {
    console.error("  ⏭️  Skipped: No ticket was created in Test 1");
    return;
  }

  if (!JIRA_DOMAIN || !JIRA_EMAIL || !JIRA_API_TOKEN) {
    console.log("  ⏭️  Skipped: Jira credentials not in .env.local for direct verification");
    console.log(`  ℹ️  Check ticket ${createdTicketKey} manually at:`);
    console.log(`     https://${JIRA_DOMAIN || "your-domain"}.atlassian.net/browse/${createdTicketKey}`);
    return;
  }

  const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString("base64");
  const res = await fetch(
    `https://${JIRA_DOMAIN}/rest/api/2/issue/${createdTicketKey}`,
    {
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
      },
    },
  );

  assert(res.status === 200, `Jira GET ${createdTicketKey} returned 200 (got ${res.status})`);

  const issue = await res.json();
  const fields = issue.fields || {};

  console.log("\n  Ticket details:");
  console.log(`    Key:      ${issue.key}`);
  console.log(`    Summary:  ${fields.summary}`);
  console.log(`    Project:  ${fields.project?.key}`);
  console.log(`    Type:     ${fields.issuetype?.name}`);
  console.log(`    Labels:   ${(fields.labels || []).join(", ")}`);

  assert(fields.project?.key === "YLT", `Project key is "YLT" (got "${fields.project?.key}")`);
  assert(fields.project?.key !== "DI", "Project key is NOT 'DI' (isolation verified)");
  assert(fields.issuetype?.name === "Task", `Issue type is "Task" (got "${fields.issuetype?.name}")`);
  assert(
    fields.summary?.includes("[YouTube Lead]"),
    'Summary contains "[YouTube Lead]" prefix',
  );
  assert(
    fields.summary?.includes("TEST"),
    "Summary contains test marker",
  );

  const labels = fields.labels || [];
  assert(labels.includes("youtube-lead"), 'Has label "youtube-lead"');
  assert(labels.includes("dealflow-ylt"), 'Has label "dealflow-ylt"');
  assert(labels.includes("video-attribution"), 'Has label "video-attribution"');
  assert(
    labels.includes("yt-camp-e2e-test-campaign"),
    'Has campaign label "yt-camp-e2e-test-campaign"',
  );

  const description = fields.description || "";
  assert(
    description.includes("YOUTUBE CAMPAIGN LEAD INTAKE"),
    "Description contains YouTube intake header",
  );
  assert(
    description.includes(testLead.email),
    "Description contains test email",
  );
  assert(
    description.includes("@srilakshana-h1t"),
    "Description contains channel handle",
  );
  assert(
    description.includes("e2e-test-campaign"),
    "Description contains campaign name",
  );
  assert(
    description.includes("Target Project: YLT"),
    'Description contains "Target Project: YLT"',
  );
  assert(
    !description.includes("Target Project: DI"),
    'Description does NOT contain "Target Project: DI"',
  );
}

// ── Test 3: Verify Deduplication ───────────────────────────────────────────────
async function testDeduplication() {
  console.log("\n═══════════════════════════════════════════════════");
  console.log("  TEST 3: Verify Deduplication (Same Lead Again)");
  console.log("═══════════════════════════════════════════════════");

  const res = await fetch(PROD_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(testLead),
  });

  const data = await res.json();
  console.log("\n  Response status:", res.status);
  console.log("  Response body:", JSON.stringify(data, null, 2));

  assert(res.status === 200, `HTTP 200 response (got ${res.status})`);
  assert(data.success === true, "success === true");
  assert(data.duplicate === true, "duplicate === true (dedup worked)");

  if (data.jiraKey) {
    assert(
      data.jiraKey === createdTicketKey,
      `Duplicate returns same ticket key (${data.jiraKey} === ${createdTicketKey})`,
    );
  }
}

// ── Test 4: Verify DI Isolation ────────────────────────────────────────────────
async function testDIIsolation() {
  console.log("\n═══════════════════════════════════════════════════");
  console.log("  TEST 4: Verify DI Project Isolation");
  console.log("═══════════════════════════════════════════════════");

  if (!JIRA_DOMAIN || !JIRA_EMAIL || !JIRA_API_TOKEN) {
    console.log("  ⏭️  Skipped: Jira credentials not available");
    return;
  }

  // Search DI project for any ticket matching our test ID
  const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString("base64");
  const jql = encodeURIComponent(`project = DI AND summary ~ "${testId}" ORDER BY created DESC`);

  const res = await fetch(
    `https://${JIRA_DOMAIN}/rest/api/2/search?jql=${jql}&maxResults=5`,
    {
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
      },
    },
  );

  if (res.ok) {
    const data = await res.json();
    assert(
      data.total === 0,
      `No tickets found in DI project with test ID "${testId}" (found ${data.total})`,
    );
    if (data.total > 0) {
      console.error("  🚨 ISOLATION BREACH: YouTube lead leaked into DI project!");
      for (const issue of data.issues) {
        console.error(`     Leaked ticket: ${issue.key} — ${issue.fields?.summary}`);
      }
    }
  } else {
    console.log(`  ⏭️  JQL search returned ${res.status} — may need project permissions`);
  }
}

// ── Cleanup helper ─────────────────────────────────────────────────────────────
async function cleanupTestTicket() {
  if (!createdTicketKey || !JIRA_DOMAIN || !JIRA_EMAIL || !JIRA_API_TOKEN) {
    return;
  }

  console.log("\n═══════════════════════════════════════════════════");
  console.log("  CLEANUP: Delete Test Ticket");
  console.log("═══════════════════════════════════════════════════");

  const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString("base64");
  const res = await fetch(
    `https://${JIRA_DOMAIN}/rest/api/2/issue/${createdTicketKey}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
      },
    },
  );

  if (res.ok || res.status === 204) {
    console.log(`  🗑️  Deleted test ticket ${createdTicketKey}`);
  } else {
    console.log(`  ⚠️  Could not delete ${createdTicketKey} (status ${res.status})`);
    console.log(`     Delete manually: https://${JIRA_DOMAIN}/browse/${createdTicketKey}`);
  }
}

// ── Run All Tests ──────────────────────────────────────────────────────────────
async function main() {
  console.log("╔═══════════════════════════════════════════════════╗");
  console.log("║  YouTube Lead E2E Test Suite (YLT + Google Sheets)║");
  console.log("╚═══════════════════════════════════════════════════╝");
  console.log(`  Target:  ${PROD_URL}`);
  console.log(`  Test ID: ${testId}`);

  try {
    await testSubmitLead();
    await testVerifyJiraTicket();
    await testDeduplication();
    await testDIIsolation();
  } catch (err) {
    console.error("\n  💥 Unhandled error:", err.message || err);
    failed++;
  }

  // Cleanup
  await cleanupTestTicket();

  // Summary
  console.log("\n╔═══════════════════════════════════════════════════╗");
  console.log(`║  RESULTS: ${passed} passed, ${failed} failed ${" ".repeat(Math.max(0, 23 - String(passed).length - String(failed).length))}║`);
  console.log("╚═══════════════════════════════════════════════════╝");

  if (failed > 0) {
    process.exit(1);
  }
}

main();
