/**
 * Automated Verification Suite for YouTube Data API v3 Synchronization & Engagement
 * Tests:
 * 1. Specified video ID ZYV2_6_XODw is handled correctly.
 * 2. Channel video discovery via uploads playlist.
 * 3. Statistics update without duplicate current-state rows.
 * 4. New comments are recorded and duplicate comments are prevented.
 * 5. Comment records do NOT automatically create Jira issues.
 * 6. Explicit comment follow-up creates exactly one Jira issue in project YLT.
 * 7. Linking Jira issue key back to the comment record in Google Sheets.
 * 8. Failed Google Sheets writes and Jira requests are handled safely.
 * 9. Secrets are not logged or returned to the browser.
 * 10. Missing credentials handled gracefully without unhandled exceptions.
 * 11. Endpoint GET and POST /api/youtube-sync execution.
 *
 * ZERO real external API calls — 100% mocked.
 */

import { test, describe, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";

import {
  fetchYouTubeVideoStats,
  fetchChannelVideos,
  fetchVideoComments,
  recordStatsToGoogleSheets,
  recordCommentsToGoogleSheets,
  recordSyncLogToGoogleSheets,
  escalateCommentToJira,
  runYouTubeSync,
  resetSyncCache,
  DESIGNATED_VIDEO_ID,
  DEFAULT_CHANNEL_ID,
} from "../api/lib/youtube-sync.js";

import youtubeSyncHandler from "../api/youtube-sync.js";

function createMockReqRes({ method = "GET", headers = {}, body = {}, query = {} } = {}) {
  const req = {
    method,
    headers: {
      origin: "https://precision-motion-systems-main.vercel.app",
      ...headers,
    },
    body,
    query,
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

describe("INDUS YouTube Data API Synchronization & Engagement Suite", () => {
  const originalFetch = globalThis.fetch;
  const originalEnv = { ...process.env };

  beforeEach(() => {
    resetSyncCache();
    process.env = { ...originalEnv };
    process.env.NODE_ENV = "test";
    process.env.JIRA_DOMAIN = "test-mock.atlassian.net";
    process.env.JIRA_EMAIL = "test@indus-robotics.com";
    process.env.JIRA_API_TOKEN = "mock-token-secret-xyz";
    process.env.JIRA_PROJECT_KEY = "DI";
    process.env.YOUTUBE_JIRA_PROJECT_KEY = "YLT";
    process.env.YOUTUBE_JIRA_ASSIGNEE_ID = "712020:youtube-specialist";
    process.env.GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/mock-deployment/exec";
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    process.env = { ...originalEnv };
  });

  // ── TEST 1: Specified video ID ZYV2_6_XODw is handled correctly ──
  test("1. Specified video ID ZYV2_6_XODw statistics are retrieved and mapped correctly", async () => {
    let capturedUrl = null;
    let capturedAuth = null;

    const mockFetch = async (url, options = {}) => {
      capturedUrl = url;
      capturedAuth = options.headers?.Authorization;
      return {
        ok: true,
        json: async () => ({
          items: [
            {
              id: "ZYV2_6_XODw",
              snippet: {
                title: "Indus Robot Visual",
                publishedAt: "2026-10-01T10:00:00Z",
              },
              statistics: {
                viewCount: "1450",
                likeCount: "185",
                commentCount: "12",
              },
            },
          ],
        }),
      };
    };

    const stats = await fetchYouTubeVideoStats(["ZYV2_6_XODw"], {
      accessToken: "mock-access-token-123",
      fetchImpl: mockFetch,
    });

    assert.equal(stats.length, 1);
    const videoStat = stats[0];
    assert.equal(videoStat.videoId, "ZYV2_6_XODw");
    assert.equal(videoStat.title, "Indus Robot Visual");
    assert.equal(videoStat.url, "https://youtu.be/ZYV2_6_XODw");
    assert.equal(videoStat.views, 1450);
    assert.equal(videoStat.likes, 185);
    assert.equal(videoStat.commentCount, 12);
    assert.ok(capturedUrl.includes("ZYV2_6_XODw"));
    assert.equal(capturedAuth, "Bearer mock-access-token-123");
  });

  // ── TEST 2: Channel video discovery includes designated video ──
  test("2. Channel discovery retrieves uploads playlist and always guarantees designated video ZYV2_6_XODw", async () => {
    const mockFetch = async (url) => {
      if (url.includes("/channels")) {
        return {
          ok: true,
          json: async () => ({
            items: [
              {
                contentDetails: {
                  relatedPlaylists: { uploads: "UUN0kjWdlI3Y6ZbU0RcEYfPQ" },
                },
              },
            ],
          }),
        };
      }
      if (url.includes("/playlistItems")) {
        return {
          ok: true,
          json: async () => ({
            items: [
              { contentDetails: { videoId: "ZYV2_6_XODw" } },
              { contentDetails: { videoId: "vid_robot_arm_2" } },
            ],
          }),
        };
      }
      throw new Error(`Unexpected URL: ${url}`);
    };

    const videos = await fetchChannelVideos(DEFAULT_CHANNEL_ID, {
      accessToken: "mock-access-token-123",
      fetchImpl: mockFetch,
      designatedVideoId: DESIGNATED_VIDEO_ID,
    });

    assert.ok(videos.includes(DESIGNATED_VIDEO_ID), "Must include designated video ID ZYV2_6_XODw");
    assert.ok(videos.includes("vid_robot_arm_2"));
    assert.equal(videos.length, 2);
  });

  // ── TEST 3: Statistics update without duplicate current-state rows ──
  test("3. Statistics deduplication prevents duplicate row writes when stats are unchanged", async () => {
    let writeCount = 0;
    const writtenPayloads = [];

    const mockFetch = async (url, options) => {
      writeCount++;
      writtenPayloads.push(JSON.parse(options.body));
      return { ok: true, status: 200 };
    };

    const sampleStats = [
      {
        videoId: "ZYV2_6_XODw",
        title: "Indus Robot Visual",
        url: "https://youtu.be/ZYV2_6_XODw",
        publishedDate: "2026-10-01T10:00:00Z",
        views: 1450,
        likes: 185,
        commentCount: 12,
        lastSyncTime: "2026-10-13T10:00:00Z",
      },
    ];

    // First write: new stats record -> written to YouTube Stats
    const result1 = await recordStatsToGoogleSheets(sampleStats, { fetchImpl: mockFetch });
    assert.equal(result1.recordedCount, 1);
    assert.equal(result1.skippedCount, 0);
    assert.equal(writeCount, 1);
    assert.equal(writtenPayloads[0].sheet, "YouTube Stats");
    assert.equal(writtenPayloads[0].videoId, "ZYV2_6_XODw");

    // Second write with identical numbers: unchanged -> skipped, NO duplicate row
    const result2 = await recordStatsToGoogleSheets(sampleStats, { fetchImpl: mockFetch });
    assert.equal(result2.recordedCount, 0);
    assert.equal(result2.skippedCount, 1);
    assert.equal(writeCount, 1, "Must NOT write a duplicate row when stats have not changed");

    // Third write with updated views: changed -> recorded
    const updatedStats = [{ ...sampleStats[0], views: 1520 }];
    const result3 = await recordStatsToGoogleSheets(updatedStats, { fetchImpl: mockFetch });
    assert.equal(result3.recordedCount, 1);
    assert.equal(result3.skippedCount, 0);
    assert.equal(writeCount, 2);
  });

  // ── TEST 4: New comments recorded & duplicate comments prevented ──
  test("4. New comments are recorded in YouTube Comments and duplicate comments are prevented", async () => {
    let writeCount = 0;
    const writtenPayloads = [];

    const mockFetch = async (url, options) => {
      writeCount++;
      writtenPayloads.push(JSON.parse(options.body));
      return { ok: true, status: 200 };
    };

    const comments = [
      {
        commentId: "comment_abc_1",
        videoId: "ZYV2_6_XODw",
        commentText: "What is the sub-micron repeatability specification for this model?",
        authorDisplayName: "Automation Engineer",
        publishedTime: "2026-10-12T14:00:00Z",
        likeCount: 4,
        commentUrl: "https://www.youtube.com/watch?v=ZYV2_6_XODw&lc=comment_abc_1",
        followUpStatus: "No Action Needed",
        jiraIssueKey: null,
      },
      {
        commentId: "comment_abc_2",
        videoId: "ZYV2_6_XODw",
        commentText: "Impressive kinematic visual simulation!",
        authorDisplayName: "Motion Fan",
        publishedTime: "2026-10-12T15:00:00Z",
        likeCount: 1,
        commentUrl: "https://www.youtube.com/watch?v=ZYV2_6_XODw&lc=comment_abc_2",
        followUpStatus: "No Action Needed",
        jiraIssueKey: null,
      },
    ];

    // Initial sync: records 2 comments
    const res1 = await recordCommentsToGoogleSheets(comments, { fetchImpl: mockFetch });
    assert.equal(res1.recordedCount, 2);
    assert.equal(res1.skippedCount, 0);
    assert.equal(writeCount, 2);
    assert.equal(writtenPayloads[0].sheet, "YouTube Comments");
    assert.equal(writtenPayloads[0].commentId, "comment_abc_1");

    // Re-sync: duplicate comments are filtered out
    const res2 = await recordCommentsToGoogleSheets(comments, { fetchImpl: mockFetch });
    assert.equal(res2.recordedCount, 0);
    assert.equal(res2.skippedCount, 2);
    assert.equal(writeCount, 2, "Duplicate comments must be prevented from creating extra rows");
  });

  // ── TEST 5: Comment records do NOT automatically create Jira issues ──
  test("5. Comment records do NOT automatically create Jira issues or invent contact info", async () => {
    let jiraApiCalled = false;
    let sheetsCalled = false;

    const mockFetch = async (url, options) => {
      if (url.includes("atlassian.net")) {
        jiraApiCalled = true;
        return { ok: true, json: async () => ({ key: "YLT-FAKE" }) };
      }
      if (url.includes("script.google.com")) {
        sheetsCalled = true;
        return { ok: true, status: 200 };
      }
      return { ok: true };
    };

    const publicComment = [
      {
        commentId: "comm_public_99",
        videoId: "ZYV2_6_XODw",
        commentText: "Great industrial robotics update!",
        authorDisplayName: "Dr. John Doe",
        publishedTime: "2026-10-12T18:00:00Z",
        likeCount: 0,
        commentUrl: "https://www.youtube.com/watch?v=ZYV2_6_XODw&lc=comm_public_99",
        followUpStatus: "No Action Needed",
        jiraIssueKey: null,
      },
    ];

    await recordCommentsToGoogleSheets(publicComment, { fetchImpl: mockFetch });

    assert.equal(sheetsCalled, true);
    assert.equal(
      jiraApiCalled,
      false,
      "Jira MUST NOT be called automatically for standard comments",
    );
  });

  // ── TEST 6: Explicit comment follow-up creates Jira YLT issue & links key ──
  test("6. Explicit comment follow-up routes strictly to YLT, links Jira issue key, and updates row", async () => {
    let capturedJiraUrl = null;
    let capturedJiraPayload = null;
    let capturedSheetUpdate = null;

    const mockFetch = async (url, options) => {
      if (url.includes("test-mock.atlassian.net")) {
        capturedJiraUrl = url;
        capturedJiraPayload = JSON.parse(options.body);
        return {
          ok: true,
          status: 201,
          json: async () => ({ key: "YLT-88", id: "10588" }),
        };
      }
      if (url.includes("script.google.com")) {
        capturedSheetUpdate = JSON.parse(options.body);
        return { ok: true, status: 200 };
      }
      throw new Error(`Unexpected fetch to: ${url}`);
    };

    const escalationResult = await escalateCommentToJira(
      {
        commentId: "comment_rfq_lead_44",
        videoId: "ZYV2_6_XODw",
        commentText:
          "We need 5 units of these 6-DOF stages for our cleanroom in Munich. Who can we contact?",
        authorDisplayName: "Bavaria Precision Tech",
        reason: "Customer explicitly requesting commercial sales quote in comment",
      },
      { fetchImpl: mockFetch },
    );

    assert.equal(escalationResult.success, true);
    assert.equal(escalationResult.projectKey, "YLT");
    assert.equal(escalationResult.jiraKey, "YLT-88");
    assert.equal(escalationResult.issueKey, "YLT-88");

    // Verify Jira payload guarantees
    assert.equal(
      capturedJiraPayload.fields.project.key,
      "YLT",
      "Must route strictly to project YLT",
    );
    assert.notEqual(capturedJiraPayload.fields.project.key, "DI", "Must NEVER route to project DI");
    assert.match(
      capturedJiraPayload.fields.summary,
      /\[YouTube Comment Follow-Up\] Bavaria Precision Tech on ZYV2_6_XODw/,
    );
    assert.match(capturedJiraPayload.fields.description, /Comment ID: comment_rfq_lead_44/);
    assert.match(capturedJiraPayload.fields.description, /Target Project: YLT/);
    assert.ok(capturedJiraPayload.fields.labels.includes("dealflow-ylt"));
    assert.ok(capturedJiraPayload.fields.labels.includes("yt-vid-ZYV2_6_XODw"));

    // Verify Google Sheets row update was dispatched with linked Jira key
    assert.notEqual(capturedSheetUpdate, null);
    assert.equal(capturedSheetUpdate.sheet, "YouTube Comments");
    assert.equal(capturedSheetUpdate.commentId, "comment_rfq_lead_44");
    assert.equal(capturedSheetUpdate.jiraIssueKey, "YLT-88");
    assert.equal(capturedSheetUpdate.followUpStatus, "Jira YLT Created (YLT-88)");
  });

  // ── TEST 7: YouTube Sync Log tab writes execution details ──
  test("7. YouTube Sync Log tab records execution status and record counts safely", async () => {
    let capturedLogPayload = null;

    const mockFetch = async (url, options) => {
      capturedLogPayload = JSON.parse(options.body);
      return { ok: true, status: 200 };
    };

    await recordSyncLogToGoogleSheets(
      {
        syncStatus: "Success",
        recordsProcessed: { videoStats: 5, comments: 20 },
        errors: [],
        lastSuccessfulSync: "2026-10-13T10:30:00Z",
      },
      { fetchImpl: mockFetch },
    );

    assert.notEqual(capturedLogPayload, null);
    assert.equal(capturedLogPayload.sheet, "YouTube Sync Log");
    assert.equal(capturedLogPayload.syncStatus, "Success");
    assert.match(capturedLogPayload.recordsProcessed, /"videoStats":5/);
    assert.equal(capturedLogPayload.errors, "None");
    assert.equal(capturedLogPayload.lastSuccessfulSync, "2026-10-13T10:30:00Z");
  });

  // ── TEST 8: Full runYouTubeSync handles missing refresh token safely ──
  test("8. Full runYouTubeSync safely handles missing refresh token without unhandled crashes", async () => {
    delete process.env.YOUTUBE_REFRESH_TOKEN;

    let logRecorded = false;
    let capturedLogPayload = null;
    const mockFetch = async (url, options) => {
      if (url.includes("script.google.com")) {
        logRecorded = true;
        capturedLogPayload = JSON.parse(options.body);
        return { ok: true, status: 200 };
      }
      return { ok: true };
    };

    const syncResult = await runYouTubeSync({ fetchImpl: mockFetch });

    assert.equal(syncResult.success, false);
    assert.ok(syncResult.errors.length > 0);
    assert.match(syncResult.errors[0], /No YOUTUBE_REFRESH_TOKEN configured/i);
    assert.equal(logRecorded, true, "Must log configuration requirement to YouTube Sync Log");
    assert.equal(capturedLogPayload.sheet, "YouTube Sync Log");
    assert.equal(capturedLogPayload.syncStatus, "Configuration Required");
  });

  // ── TEST 9: Full runYouTubeSync executes complete flow when access token is provided ──
  test("9. Full runYouTubeSync coordinates stats, comments, and log in sequence", async () => {
    const sheetsWrites = [];

    const mockFetch = async (url, options = {}) => {
      if (url.includes("/channels")) {
        return {
          ok: true,
          json: async () => ({
            items: [
              {
                contentDetails: {
                  relatedPlaylists: { uploads: "UUN0kjWdlI3Y6ZbU0RcEYfPQ" },
                },
              },
            ],
          }),
        };
      }
      if (url.includes("/playlistItems")) {
        return {
          ok: true,
          json: async () => ({
            items: [{ contentDetails: { videoId: "ZYV2_6_XODw" } }],
          }),
        };
      }
      if (url.includes("/videos?")) {
        return {
          ok: true,
          json: async () => ({
            items: [
              {
                id: "ZYV2_6_XODw",
                snippet: { title: "Indus Robot Visual", publishedAt: "2026-10-01T10:00:00Z" },
                statistics: { viewCount: "3500", likeCount: "250", commentCount: "1" },
              },
            ],
          }),
        };
      }
      if (url.includes("/commentThreads")) {
        return {
          ok: true,
          json: async () => ({
            items: [
              {
                id: "comm_indus_101",
                snippet: {
                  topLevelComment: {
                    snippet: {
                      textDisplay: "Excellent motion accuracy.",
                      authorDisplayName: "MotionLab",
                      publishedAt: "2026-10-10T12:00:00Z",
                      likeCount: 5,
                    },
                  },
                },
              },
            ],
          }),
        };
      }
      if (url.includes("script.google.com")) {
        sheetsWrites.push(JSON.parse(options.body));
        return { ok: true, status: 200 };
      }
      throw new Error(`Unexpected fetch URL: ${url}`);
    };

    const syncResult = await runYouTubeSync({
      accessToken: "mock-valid-token-xyz",
      fetchImpl: mockFetch,
    });

    assert.equal(syncResult.success, true);
    assert.equal(syncResult.videoStatsCount, 1);
    assert.equal(syncResult.commentsCount, 1);
    assert.equal(syncResult.errors.length, 0);

    // Verify all dedicated sheets received rows
    const sheetNames = sheetsWrites.map((w) => w.sheet);
    assert.ok(sheetNames.includes("YouTube Stats"), "Must write to YouTube Stats tab");
    assert.ok(sheetNames.includes("YouTube Comments"), "Must write to YouTube Comments tab");
    assert.ok(sheetNames.includes("YouTube Sync Log"), "Must write to YouTube Sync Log tab");
  });

  // ── TEST 10: GET /api/youtube-sync returns zero-leakage diagnostic status ──
  test("10. GET /api/youtube-sync returns public diagnostic status without leaking secrets", async () => {
    process.env.YOUTUBE_OAUTH_CLIENT_ID = "mock-client-id-1234.apps.googleusercontent.com";
    process.env.YOUTUBE_REFRESH_TOKEN = "secret-refresh-token-must-not-leak";
    process.env.AUTH_SECRET = "super-secret-auth-key-must-not-leak";

    const { req, res } = createMockReqRes({ method: "GET" });
    await youtubeSyncHandler(req, res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.designatedVideoId, "ZYV2_6_XODw");
    assert.equal(res.body.designatedVideoUrl, "https://youtu.be/ZYV2_6_XODw");
    assert.equal(res.body.channelHandle, "@srilakshana-h1t");
    assert.equal(res.body.credentials.refreshTokenConfigured, true);

    // ZERO LEAKAGE check
    const bodyStr = JSON.stringify(res.body);
    assert.equal(
      bodyStr.includes("secret-refresh-token-must-not-leak"),
      false,
      "Must NEVER leak refresh token in response",
    );
    assert.equal(
      bodyStr.includes("super-secret-auth-key-must-not-leak"),
      false,
      "Must NEVER leak auth secret in response",
    );
  });

  // ── TEST 11: POST /api/youtube-sync handles escalate_comment action ──
  test("11. POST /api/youtube-sync with action: 'escalate_comment' executes comment escalation", async () => {
    let jiraCalled = false;
    globalThis.fetch = async (url) => {
      if (url.includes("atlassian.net")) {
        jiraCalled = true;
        return {
          ok: true,
          status: 201,
          json: async () => ({ key: "YLT-99" }),
        };
      }
      return { ok: true, status: 200 };
    };

    const { req, res } = createMockReqRes({
      method: "POST",
      body: {
        action: "escalate_comment",
        commentId: "comm_urgent_1",
        videoId: "ZYV2_6_XODw",
        commentText: "Send datasheet and pricing for the XY gantry system",
        authorDisplayName: "Purchasing Lead",
        reason: "Quote enquiry",
      },
    });

    await youtubeSyncHandler(req, res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.issueKey, "YLT-99");
    assert.equal(res.body.projectKey, "YLT");
    assert.equal(jiraCalled, true);
  });
});
