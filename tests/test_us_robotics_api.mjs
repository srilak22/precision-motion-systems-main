/**
 * Automated Node.js API Test Suite for US Robotics Intelligence Platform
 * INDUS Industrial Robotics | Antigravity Company Discovery System
 */

import assert from "node:assert";
import handler from "../api/intelligence.js";

async function executeMockRequest(url, method = "GET", body = null) {
  let responseData = null;
  let responseHeaders = {};
  let statusCode = 200;

  const req = {
    url,
    method,
    headers: { host: "localhost" },
    body
  };

  const res = {
    statusCode: 200,
    setHeader: (k, v) => {
      responseHeaders[k.toLowerCase()] = v;
      return res;
    },
    status: (code) => {
      statusCode = code;
      res.statusCode = code;
      return res;
    },
    json: (data) => {
      responseData = data;
      return res;
    },
    end: (content) => {
      if (content && !responseData) {
        responseData = content;
      }
    }
  };

  await handler(req, res);
  return { status: statusCode, headers: responseHeaders, data: responseData };
}

async function runApiTests() {
  console.log("======================================================================");
  console.log("  RUNNING US ROBOTICS INTELLIGENCE API AUTOMATED TESTS");
  console.log("======================================================================");

  // 1. Test Stats Endpoint
  console.log("\n[TEST 1] Testing /api/intelligence/stats...");
  const statsRes = await executeMockRequest("/api/intelligence/stats");
  assert.strictEqual(statsRes.status, 200);
  assert.strictEqual(statsRes.data.success, true);
  assert.ok(statsRes.data.summary.total_companies >= 600, `Expected >= 600 companies, got ${statsRes.data.summary.total_companies}`);
  assert.ok(statsRes.data.summary.total_products >= 500);
  assert.ok(statsRes.data.summary.total_contacts >= 500);
  assert.ok(statsRes.data.summary.total_people >= 10);
  assert.ok(Array.isArray(statsRes.data.distributions.states));
  console.log(`[PASS] Stats Endpoint Verified: ${statsRes.data.summary.total_companies} companies, ${statsRes.data.summary.total_products} products`);

  // 2. Test Companies Search & Filter Endpoint
  console.log("\n[TEST 2] Testing /api/intelligence/companies with filters...");
  const miRes = await executeMockRequest("/api/intelligence/companies?state=Michigan&limit=5");
  assert.strictEqual(miRes.status, 200);
  assert.strictEqual(miRes.data.success, true);
  assert.ok(miRes.data.pagination.total > 100, `Expected > 100 in Michigan, got ${miRes.data.pagination.total}`);
  assert.strictEqual(miRes.data.companies.length, 5);
  for (const c of miRes.data.companies) {
    assert.strictEqual(c.hq_state, "Michigan");
  }
  console.log(`[PASS] State Filter Verified: Found ${miRes.data.pagination.total} companies in Michigan`);

  // 3. Test Text Search
  console.log("\n[TEST 3] Testing text search query (q=robotics)...");
  const searchRes = await executeMockRequest("/api/intelligence/companies?q=robotics&limit=5");
  assert.strictEqual(searchRes.status, 200);
  assert.ok(searchRes.data.pagination.total > 50);
  console.log(`[PASS] Search Query Verified: Found ${searchRes.data.pagination.total} results for 'robotics'`);

  // 4. Test Single Company Detail (15-tab profile)
  console.log("\n[TEST 4] Testing /api/intelligence/company?id=...");
  const firstCompanyId = miRes.data.companies[0].company_id;
  const detailRes = await executeMockRequest(`/api/intelligence/company?id=${encodeURIComponent(firstCompanyId)}`);
  assert.strictEqual(detailRes.status, 200);
  assert.strictEqual(detailRes.data.success, true);
  assert.strictEqual(detailRes.data.company.company_id, firstCompanyId);
  assert.ok(Array.isArray(detailRes.data.products));
  assert.ok(Array.isArray(detailRes.data.people));
  assert.ok(Array.isArray(detailRes.data.contacts));
  assert.ok(Array.isArray(detailRes.data.evidence));
  console.log(`[PASS] Full Profile Verified for ${detailRes.data.company.legal_name}`);

  // 5. Test OSINT Preset Queries (Query 1: Reducers, Query 2: Specs)
  console.log("\n[TEST 5] Testing preset research queries...");
  const q1Res = await executeMockRequest("/api/intelligence/queries?preset_id=1");
  assert.strictEqual(q1Res.status, 200);
  assert.strictEqual(q1Res.data.preset_id, "1");
  assert.ok(q1Res.data.count > 0, "Expected precision reducer matches");

  const q2Res = await executeMockRequest("/api/intelligence/queries?preset_id=2");
  assert.strictEqual(q2Res.status, 200);
  assert.ok(q2Res.data.count > 0, "Expected payload and reach matches");
  console.log(`[PASS] Preset Queries Verified: Found ${q1Res.data.count} reducer suppliers, ${q2Res.data.count} spec-publishing manufacturers`);

  // 6. Test CSV and JSON Exports
  console.log("\n[TEST 6] Testing /api/intelligence/export formats...");
  const csvRes = await executeMockRequest("/api/intelligence/export?format=csv");
  assert.strictEqual(csvRes.headers["content-type"], "text/csv; charset=utf-8");
  assert.ok(typeof csvRes.data === "string" && csvRes.data.includes("Company ID"));

  const jsonRes = await executeMockRequest("/api/intelligence/export?format=json");
  assert.ok(Array.isArray(jsonRes.data));
  assert.ok(jsonRes.data.length >= 600);
  console.log(`[PASS] Export Verified: Successfully generated CSV and JSON (${jsonRes.data.length} records)`);

  console.log("\n======================================================================");
  console.log("  ALL API AUTOMATED TESTS PASSED SUCCESSFULLY! (6/6)");
  console.log("======================================================================\n");
}

runApiTests().catch((err) => {
  console.error("API Test Failure:", err);
  process.exit(1);
});
