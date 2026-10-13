// INDUS Industrial Robotics — LinkedIn Synchronization & Sheets Test Suite
// scripts/test_linkedin_sync.mjs
// Comprehensive test suite validating LinkedIn activity tracking, OAuth security,
// lead normalization, post deduplication, page analytics, and Google Sheets schema.

import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import {
  resolveLinkedInCredentials,
  normalizeLeadGenRecord,
  fetchCompanyPosts,
  fetchPostAnalytics,
  fetchPageAnalytics,
  fetchPostInteractions,
  recordPostsToGoogleSheets,
  recordInteractionsToGoogleSheets,
  recordPageAnalyticsToGoogleSheets,
  recordLeadToGoogleSheets,
  recordSyncLogToGoogleSheets,
  runLinkedInSync,
  COMPANY_PAGE_URL,
  REQUIRED_SHEET_TABS,
} from "../api/lib/linkedin-sync.js";
import {
  generateOAuthState,
  validateOAuthState,
  buildAuthorizationUrl,
  exchangeCodeForTokens,
} from "../api/lib/linkedin-oauth.js";

console.log("===============================================================================");
console.log("INDUS Industrial Robotics — LinkedIn Tracking & Google Sheets Test Suite");
console.log("===============================================================================\n");

async function runTestSuite() {
  let passed = 0;
  let total = 0;

  function test(name, fn) {
    total++;
    try {
      fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${name}`);
      console.error(`       Error: ${err.message}`);
    }
  }

  async function asyncTest(name, fn) {
    total++;
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${name}`);
      console.error(`       Error: ${err.message}`);
    }
  }

  // ---------------------------------------------------------------------------
  // 1. Credentials Resolution & Secret Protection
  // ---------------------------------------------------------------------------
  test("Credentials resolution never exposes raw secrets and correctly flags presence", () => {
    const mockEnv = {
      LINKEDIN_CLIENT_ID: "client_12345",
      LINKEDIN_CLIENT_SECRET: "secret_super_classified",
      LINKEDIN_ORGANIZATION_ID: "106489371",
      LINKEDIN_REFRESH_TOKEN: "refresh_token_xyz987",
      LINKEDIN_AD_ACCOUNT_ID: "504938210",
    };

    const creds = resolveLinkedInCredentials(mockEnv);
    assert.strictEqual(creds.hasClientId, true);
    assert.strictEqual(creds.hasClientSecret, true);
    assert.strictEqual(creds.hasOrgId, true);
    assert.strictEqual(creds.hasRefreshToken, true);
    assert.strictEqual(creds.hasAdAccountId, true);
    assert.strictEqual(creds.orgId, "106489371");
    // Ensure raw secrets are NEVER exposed in the returned object
    assert.strictEqual(creds.clientSecret, undefined);
    assert.strictEqual(creds.refreshToken, undefined);
  });

  // ---------------------------------------------------------------------------
  // 2. OAuth 2.0 Security, CSRF Tokens & State Verification
  // ---------------------------------------------------------------------------
  test("OAuth state generator produces HMAC-SHA256 signature and prevents replays", () => {
    const { state, nonce } = generateOAuthState({ secret: "test-auth-secret-12345" });
    assert(state.includes(":"), "State must contain nonce and timestamp delimiters");

    // Valid state verification with matching cookie nonce
    const validResult = validateOAuthState(state, nonce, { secret: "test-auth-secret-12345" });
    assert.strictEqual(validResult.valid, true);
    assert.strictEqual(validResult.nonce, nonce);

    // Replay attack prevention: second validation of the same state MUST fail
    const replayResult = validateOAuthState(state, nonce, { secret: "test-auth-secret-12345" });
    assert.strictEqual(replayResult.valid, false);
    assert(replayResult.error.includes("replay detected"));

    // Cookie nonce mismatch prevention
    const { state: state2 } = generateOAuthState({ secret: "test-auth-secret-12345" });
    const mismatchResult = validateOAuthState(state2, "wrong_cookie_nonce", {
      secret: "test-auth-secret-12345",
    });
    assert.strictEqual(mismatchResult.valid, false);
    assert(mismatchResult.error.includes("State mismatch"));
  });

  test("buildAuthorizationUrl constructs authorized LinkedIn OAuth URL with required scopes", () => {
    const authUrl = buildAuthorizationUrl("mock_state_123", {
      clientId: "mock_client_id",
      redirectUri: "https://precision-motion-systems-main.vercel.app/api/auth/linkedin/callback",
    });

    assert(authUrl.startsWith("https://www.linkedin.com/oauth/v2/authorization"));
    assert(authUrl.includes("client_id=mock_client_id"));
    assert(authUrl.includes("response_type=code"));
    assert(authUrl.includes("r_organization_social"));
    assert(authUrl.includes("r_organization_admin"));
    assert(authUrl.includes("r_ads_leadgen_automation"));
  });

  await asyncTest("exchangeCodeForTokens executes authorization code exchange", async () => {
    const mockFetch = async (url, opts) => {
      assert.strictEqual(url, "https://www.linkedin.com/oauth/v2/accessToken");
      assert(opts.body.includes("grant_type=authorization_code"));
      assert(opts.body.includes("code=valid_auth_code"));
      return {
        ok: true,
        json: async () => ({
          access_token: "mock_access_token_123",
          expires_in: 5184000,
          refresh_token: "mock_refresh_token_456",
          refresh_token_expires_in: 31536000,
          scope: "r_organization_social,r_organization_admin",
        }),
      };
    };

    const tokens = await exchangeCodeForTokens("valid_auth_code", {
      clientId: "cid_123",
      clientSecret: "sec_123",
      fetchImpl: mockFetch,
    });

    assert.strictEqual(tokens.accessToken, "mock_access_token_123");
    assert.strictEqual(tokens.refreshToken, "mock_refresh_token_456");
    assert.strictEqual(tokens.expiresIn, 5184000);
  });

  // ---------------------------------------------------------------------------
  // 3. Lead Gen Form Normalization (Webhooks and API responses)
  // ---------------------------------------------------------------------------
  test("normalizeLeadGenRecord standardizes diverse webhook and nested form answers", () => {
    const rawWebhookPayload = {
      id: "urn:li:leadGenResponse:847291823",
      submittedAt: "2026-10-13T12:00:00Z",
      formName: "INDUS SCARA Robot Application Sizing",
      formId: "form_scara_01",
      campaignName: "High-Speed SMT Automation Q4",
      answers: {
        full_name: "Karthik Subramanian",
        work_email: "karthik.s@bharat-dynamics.in",
        phone: "+91 99887 76655",
        company: "Bharat Dynamics & Robotics",
        title: "Principal Automation Architect",
        profile: "https://www.linkedin.com/in/karthik-subramanian",
      },
    };

    const normalized = normalizeLeadGenRecord(rawWebhookPayload);
    assert.strictEqual(normalized.leadId, "urn:li:leadGenResponse:847291823");
    assert.strictEqual(normalized.fullName, "Karthik Subramanian");
    assert.strictEqual(normalized.emailAddress, "karthik.s@bharat-dynamics.in");
    assert.strictEqual(normalized.phoneNumber, "+91 99887 76655");
    assert.strictEqual(normalized.companyName, "Bharat Dynamics & Robotics");
    assert.strictEqual(normalized.jobTitle, "Principal Automation Architect");
    assert.strictEqual(normalized.linkedinProfileUrl, "https://www.linkedin.com/in/karthik-subramanian");
    assert.strictEqual(normalized.leadStatus, "New Lead");
  });

  // ---------------------------------------------------------------------------
  // 4. Company Posts & Post Analytics Engine
  // ---------------------------------------------------------------------------
  await asyncTest("fetchCompanyPosts and fetchPostAnalytics accurately retrieve posts and compute engagement rate", async () => {
    const mockPostsFetch = async (url) => {
      if (url.includes("/posts?")) {
        return {
          ok: true,
          json: async () => ({
            elements: [
              {
                id: "urn:li:share:7192837461928",
                publishedAt: 1728820800000,
                commentary: "Deploying 4-Axis SCARA industrial robots for aerospace precision assembly.",
              },
            ],
          }),
        };
      }
      return { ok: false, status: 404 };
    };

    const posts = await fetchCompanyPosts("mock_token", "106489371", { fetchImpl: mockPostsFetch });
    assert.strictEqual(posts.length, 1);
    assert.strictEqual(posts[0].postUrn, "urn:li:share:7192837461928");
    assert.strictEqual(
      posts[0].postUrl,
      "https://www.linkedin.com/feed/update/urn:li:share:7192837461928",
    );
    assert.strictEqual(posts[0].author, "urn:li:organization:106489371");

    // Post Analytics
    const mockStatsFetch = async (url) => {
      return {
        ok: true,
        json: async () => ({
          elements: [
            {
              share: "urn:li:share:7192837461928",
              totalShareStatistics: {
                impressionCount: 2500,
                uniqueImpressionsCount: 1980,
                likeCount: 120,
                commentCount: 25,
                shareCount: 15,
                clickCount: 190,
              },
            },
          ],
        }),
      };
    };

    const statsMap = await fetchPostAnalytics("mock_token", "106489371", [posts[0].postUrn], {
      fetchImpl: mockStatsFetch,
    });
    const stats = statsMap.get("urn:li:share:7192837461928");
    assert(stats !== undefined);
    assert.strictEqual(stats.impressions, 2500);
    assert.strictEqual(stats.reactions, 120);
    assert.strictEqual(stats.comments, 25);
    assert.strictEqual(stats.shares, 15);
    assert.strictEqual(stats.clicks, 190);
    // (120 + 25 + 15 + 190) / 2500 * 100 = 350 / 2500 * 100 = 14.00%
    assert.strictEqual(stats.engagementRate, "14.00%");
  });

  // ---------------------------------------------------------------------------
  // 5. Interactions Handling (Handling 403 Forbidden Community Management API)
  // ---------------------------------------------------------------------------
  await asyncTest("fetchPostInteractions handles restricted Community Management API without throwing", async () => {
    const mockForbiddenFetch = async () => ({
      ok: false,
      status: 403,
      statusText: "Forbidden",
    });

    const result = await fetchPostInteractions("mock_token", "urn:li:share:7192837461928", {
      fetchImpl: mockForbiddenFetch,
    });

    assert.strictEqual(result.supported, false);
    assert(result.reason.includes("Community Management API"));
    assert.strictEqual(result.interactions.length, 0);
  });

  await asyncTest("fetchPostInteractions parses individual comments and reactions when authorized", async () => {
    const mockAuthorizedFetch = async (url) => {
      if (url.includes("/comments")) {
        return {
          ok: true,
          json: async () => ({
            elements: [
              {
                id: "urn:li:comment:1001",
                actor: { name: "Rajesh Kumar", vanityName: "rajesh-kumar-eng" },
                message: { text: "What is the repeatability rating on this SCARA arm?" },
                created: { time: 1728822000000 },
              },
            ],
          }),
        };
      }
      if (url.includes("/likes")) {
        return {
          ok: true,
          json: async () => ({
            elements: [
              {
                actor: { name: "Ananya Iyer", urn: "urn:li:person:992211" },
                reactionType: "PRAISE",
              },
            ],
          }),
        };
      }
      return { ok: false, status: 404 };
    };

    const result = await fetchPostInteractions("mock_token", "urn:li:share:7192837461928", {
      fetchImpl: mockAuthorizedFetch,
    });

    assert.strictEqual(result.supported, true);
    assert.strictEqual(result.interactions.length, 2);
    const comment = result.interactions.find((i) => i.interactionType === "Comment");
    const reaction = result.interactions.find((i) => i.interactionType === "Reaction");
    assert.strictEqual(comment.memberName, "Rajesh Kumar");
    assert.strictEqual(comment.commentText, "What is the repeatability rating on this SCARA arm?");
    assert.strictEqual(reaction.memberName, "Ananya Iyer");
    assert.strictEqual(reaction.reactionType, "PRAISE");
  });

  // ---------------------------------------------------------------------------
  // 6. Page Follower & Visitor Analytics
  // ---------------------------------------------------------------------------
  await asyncTest("fetchPageAnalytics compiles follower growth and unique visitor metrics", async () => {
    const mockAnalyticsFetch = async (url) => {
      if (url.includes("organizationalEntityFollowerStatistics")) {
        return {
          ok: true,
          json: async () => ({
            elements: [
              {
                followerGains: { organicFollowerGain: 48, paidFollowerGain: 12 },
                totalFollowerCount: 1450,
              },
            ],
          }),
        };
      }
      if (url.includes("organizationPageStatistics")) {
        return {
          ok: true,
          json: async () => ({
            elements: [
              {
                totalPageStatistics: {
                  views: {
                    allPageViews: { pageViews: 1250, uniquePageViews: 890 },
                    desktopPageViews: { pageViews: 750, uniquePageViews: 540 },
                    mobilePageViews: { pageViews: 500, uniquePageViews: 350 },
                  },
                  clicks: { careersPageClicks: 35, overviewPageClicks: 85 },
                },
              },
            ],
          }),
        };
      }
      return { ok: false, status: 404 };
    };

    const analytics = await fetchPageAnalytics("mock_token", "106489371", {
      fetchImpl: mockAnalyticsFetch,
    });

    assert.strictEqual(analytics.totalFollowers, 1450);
    assert.strictEqual(analytics.organicFollowerGain, 48);
    assert.strictEqual(analytics.paidFollowerGain, 12);
    assert.strictEqual(analytics.totalPageViews, 1250);
    assert.strictEqual(analytics.desktopPageViews, 750);
    assert.strictEqual(analytics.mobilePageViews, 500);
    assert.strictEqual(analytics.totalUniqueVisitors, 890);
    assert.strictEqual(analytics.desktopUniqueVisitors, 540);
    assert.strictEqual(analytics.mobileUniqueVisitors, 350);
  });

  // ---------------------------------------------------------------------------
  // 7. Google Sheets Tab Records Formatting & Deduplication Payloads
  // ---------------------------------------------------------------------------
  await asyncTest("recordPostsToGoogleSheets formats payload with Post URN primary key", async () => {
    const sentPayloads = [];
    const mockGasFetch = async (url, opts) => {
      sentPayloads.push(JSON.parse(opts.body));
      return { ok: true };
    };

    const postData = [
      {
        postUrn: "urn:li:share:998877",
        postUrl: "https://www.linkedin.com/feed/update/urn:li:share:998877",
        author: "urn:li:organization:106489371",
        publishedDate: "2026-10-13T10:00:00Z",
        content: "INDUS Precision Motion Systems update",
        impressions: 1200,
        reactions: 45,
        comments: 6,
        shares: 4,
        clicks: 78,
        engagementRate: "11.08%",
      },
    ];

    const count = await recordPostsToGoogleSheets(postData, { fetchImpl: mockGasFetch });
    assert.strictEqual(count, 1);
    assert.strictEqual(sentPayloads.length, 1);
    assert.strictEqual(sentPayloads[0].sheet, "Posts");
    assert.strictEqual(sentPayloads[0].postUrn, "urn:li:share:998877");
    assert.strictEqual(sentPayloads[0].impressions, 1200);
  });

  await asyncTest("recordPageAnalyticsToGoogleSheets formats payload with Date primary key", async () => {
    const sentPayloads = [];
    const mockGasFetch = async (url, opts) => {
      sentPayloads.push(JSON.parse(opts.body));
      return { ok: true };
    };

    const analyticsData = {
      date: "2026-10-13",
      totalFollowers: 1450,
      organicFollowerGain: 48,
      paidFollowerGain: 12,
      totalPageViews: 1250,
      desktopPageViews: 750,
      mobilePageViews: 500,
      totalUniqueVisitors: 890,
      desktopUniqueVisitors: 540,
      mobileUniqueVisitors: 350,
      customButtonClicks: 120,
      lastUpdatedAt: new Date().toISOString(),
    };

    const ok = await recordPageAnalyticsToGoogleSheets(analyticsData, { fetchImpl: mockGasFetch });
    assert.strictEqual(ok, true);
    assert.strictEqual(sentPayloads[0].sheet, "Page Analytics");
    assert.strictEqual(sentPayloads[0].date, "2026-10-13");
    assert.strictEqual(sentPayloads[0].totalFollowers, 1450);
  });

  await asyncTest("recordLeadToGoogleSheets formats payload with Lead ID primary key", async () => {
    const sentPayloads = [];
    const mockGasFetch = async (url, opts) => {
      sentPayloads.push(JSON.parse(opts.body));
      return { ok: true };
    };

    const leadData = {
      id: "lead_test_5544",
      fullName: "Siddharth Verma",
      email: "siddharth.v@precision-eng.com",
      phone: "+91 98112 23344",
      company: "Precision Engineering Corp",
      jobTitle: "Operations Director",
    };

    const ok = await recordLeadToGoogleSheets(leadData, { fetchImpl: mockGasFetch });
    assert.strictEqual(ok, true);
    assert.strictEqual(sentPayloads[0].sheet, "Leads");
    assert.strictEqual(sentPayloads[0].leadId, "lead_test_5544");
    assert.strictEqual(sentPayloads[0].fullName, "Siddharth Verma");
  });

  await asyncTest("recordSyncLogToGoogleSheets appends timestamped log with status and duration", async () => {
    const sentPayloads = [];
    const mockGasFetch = async (url, opts) => {
      sentPayloads.push(JSON.parse(opts.body));
      return { ok: true };
    };

    const ok = await recordSyncLogToGoogleSheets(
      {
        service: "LinkedIn Activity Tracking",
        action: "Scheduled Sync",
        status: "SUCCESS",
        recordsProcessed: { posts: 5, analytics: 1 },
        details: "Synchronized 5 company posts and daily visitor analytics",
        durationMs: 420,
        triggerSource: "CRON",
      },
      { fetchImpl: mockGasFetch },
    );

    assert.strictEqual(ok, true);
    assert.strictEqual(sentPayloads[0].sheet, "Sync Logs");
    assert.strictEqual(sentPayloads[0].status, "SUCCESS");
    assert.strictEqual(sentPayloads[0].durationMs, 420);
    assert.strictEqual(sentPayloads[0].triggerSource, "CRON");
  });

  // ---------------------------------------------------------------------------
  // 8. Website Form Submission & LinkedIn Referral Attribution (api/track.js)
  // ---------------------------------------------------------------------------
  test("LinkedIn referral logic accurately identifies UTMs, lnkd.in, and linkedin.com referrers", () => {
    function evaluateReferral(utmSource, utmMedium, utmCampaign, referrer) {
      const isLinkedInReferral = Boolean(
        (utmSource && utmSource.toLowerCase().includes("linkedin")) ||
        (referrer && (referrer.toLowerCase().includes("linkedin.com") || referrer.toLowerCase().includes("lnkd.in")))
      );

      let derivedLeadSource = "Direct / Website";
      if (isLinkedInReferral) {
        const isPaid = Boolean(
          (utmMedium && /^(cpc|paid|ad|sponsored|paidsocial)$/i.test(utmMedium)) ||
          (utmCampaign && /ad|paid|sponsored|promo/i.test(utmCampaign))
        );
        derivedLeadSource = isPaid ? "LinkedIn Sponsored / Ad" : "LinkedIn Organic";
      } else if (utmSource) {
        derivedLeadSource = `${utmSource}${utmMedium ? ` / ${utmMedium}` : ""}`;
      } else if (referrer) {
        try {
          const parsed = new URL(referrer);
          derivedLeadSource = `Referral (${parsed.hostname})`;
        } catch {
          derivedLeadSource = "Referral";
        }
      }

      return { isLinkedInReferral, derivedLeadSource };
    }

    // Case A: Sponsored LinkedIn ad click
    const resA = evaluateReferral("linkedin", "cpc", "precision_robotics_q4", "https://www.linkedin.com/");
    assert.strictEqual(resA.isLinkedInReferral, true);
    assert.strictEqual(resA.derivedLeadSource, "LinkedIn Sponsored / Ad");

    // Case B: Organic post click from company page feed
    const resB = evaluateReferral("linkedin", "organic", "", "https://www.linkedin.com/feed/");
    assert.strictEqual(resB.isLinkedInReferral, true);
    assert.strictEqual(resB.derivedLeadSource, "LinkedIn Organic");

    // Case C: Mobile shortlink referral via lnkd.in
    const resC = evaluateReferral("", "", "", "https://lnkd.in/eXYZ123");
    assert.strictEqual(resC.isLinkedInReferral, true);
    assert.strictEqual(resC.derivedLeadSource, "LinkedIn Organic");

    // Case D: Non-LinkedIn direct traffic
    const resD = evaluateReferral("", "", "", "");
    assert.strictEqual(resD.isLinkedInReferral, false);
    assert.strictEqual(resD.derivedLeadSource, "Direct / Website");
  });

  // ---------------------------------------------------------------------------
  // 9. Master Synchronizer Orchestration & Fallback Grace
  // ---------------------------------------------------------------------------
  await asyncTest("runLinkedInSync gracefully logs notice when awaiting authorization", async () => {
    const logsSent = [];
    const mockGasFetch = async (url, opts) => {
      logsSent.push(JSON.parse(opts.body));
      return { ok: true };
    };

    const emptyEnv = {};
    const result = await runLinkedInSync({
      env: emptyEnv,
      fetchImpl: mockGasFetch,
      triggerSource: "MANUAL",
    });

    assert.strictEqual(result.success, false);
    assert.strictEqual(result.status, "Awaiting Channel Authorization");
    assert.strictEqual(logsSent.length, 1);
    assert.strictEqual(logsSent[0].sheet, "Sync Logs");
    assert.strictEqual(logsSent[0].status, "WARNING");
    assert(logsSent[0].details.includes("Awaiting LinkedIn API authorization"));
  });

  // ---------------------------------------------------------------------------
  // 10. Google Apps Script Code.gs Schema & Tabs Completeness
  // ---------------------------------------------------------------------------
  test("google-apps-script/Code.gs contains all 6 required tabs, primary keys, and setup function", () => {
    const codeGsPath = path.resolve("google-apps-script/Code.gs");
    const content = fs.readFileSync(codeGsPath, "utf-8");

    for (const tab of REQUIRED_SHEET_TABS) {
      assert(content.includes(`"${tab}"`), `Code.gs must define tab: ${tab}`);
    }

    assert(content.includes("setupLinkedInSheets"), "Code.gs must define setupLinkedInSheets()");
    assert(content.includes("handleSheetUpsert"), "Code.gs must define handleSheetUpsert()");
    assert(content.includes("LINKEDIN_HEADERS"), "Code.gs must define LINKEDIN_HEADERS schema");
    assert(content.includes("extractPrimaryKey"), "Code.gs must define extractPrimaryKey()");
    assert(content.includes("syncCalendarAppointments"), "Code.gs must preserve Calendar sync");
  });

  console.log("\n===============================================================================");
  console.log(`Test Execution Summary: ${passed} / ${total} tests passed successfully.`);
  console.log("===============================================================================");

  if (passed !== total) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error("Test execution fatal error:", err);
  process.exit(1);
});
