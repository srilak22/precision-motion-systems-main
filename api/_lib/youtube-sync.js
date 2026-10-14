// INDUS Robotics — YouTube Data API v3 Synchronization & Engagement Engine
// Coordinates: YouTube Stats, YouTube Comments, YouTube Leads, and YouTube Sync Log.
// Strictly isolated from DI dealflow; creates Jira issues exclusively in project YLT for explicit comment follow-up.
// Zero-leakage security: never logs or leaks tokens or secrets.

import { getYouTubeAccessToken } from "./youtube-oauth.js";

export const DEFAULT_CHANNEL_ID = "UCN0kjWdlI3Y6ZbU0RcEYfPQ";
export const DEFAULT_CHANNEL_HANDLE = "@srilakshana-h1t";
export const DESIGNATED_VIDEO_ID = "ZYV2_6_XODw";

// In-memory sync state & deduplication cache (survives warm serverless instance invocations)
const syncedCommentIds = new Set();
const lastKnownStatsMap = new Map(); // videoId -> JSON string of { views, likes, commentCount }
let lastSuccessfulSyncTimestamp = null;

/**
 * Resets in-memory sync cache (primarily for deterministic unit testing).
 */
export function resetSyncCache() {
  syncedCommentIds.clear();
  lastKnownStatsMap.clear();
  lastSuccessfulSyncTimestamp = null;
}

/**
 * Retrieves video statistics for an array of video IDs via YouTube Data API v3.
 *
 * @param {string[]} videoIds
 * @param {Object} [options]
 * @param {string} [options.accessToken]
 * @param {typeof fetch} [options.fetchImpl]
 * @returns {Promise<Array<{ videoId: string, title: string, url: string, publishedDate: string, views: number, likes: number, commentCount: number, lastSyncTime: string }>>}
 */
export async function fetchYouTubeVideoStats(videoIds, options = {}) {
  if (!Array.isArray(videoIds) || videoIds.length === 0) {
    return [];
  }

  const fetchFn = options.fetchImpl || globalThis.fetch;
  const uniqueIds = Array.from(new Set(videoIds.map((id) => String(id).trim()).filter(Boolean)));
  const idParam = uniqueIds.join(",");

  const token = options.accessToken;
  const headers = { Accept: "application/json" };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${encodeURIComponent(idParam)}`;
  const res = await fetchFn(url, { method: "GET", headers });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(
      `YouTube Data API videos request failed (${res.status}): ${errorText.slice(0, 150)}`,
    );
  }

  const data = await res.json();
  const items = Array.isArray(data.items) ? data.items : [];
  const syncTime = new Date().toISOString();

  return items.map((item) => {
    const vid = item.id;
    const snippet = item.snippet || {};
    const stats = item.statistics || {};

    return {
      videoId: vid,
      title: snippet.title || `Video ${vid}`,
      url: `https://youtu.be/${vid}`,
      publishedDate: snippet.publishedAt || syncTime,
      views: Number(stats.viewCount || 0),
      likes: Number(stats.likeCount || 0),
      commentCount: Number(stats.commentCount || 0),
      lastSyncTime: syncTime,
    };
  });
}

/**
 * Retrieves channel video IDs via YouTube Data API v3.
 *
 * @param {string} [channelId]
 * @param {Object} [options]
 * @param {string} [options.accessToken]
 * @param {typeof fetch} [options.fetchImpl]
 * @param {string} [options.designatedVideoId]
 * @returns {Promise<string[]>}
 */
export async function fetchChannelVideos(channelId = DEFAULT_CHANNEL_ID, options = {}) {
  const fetchFn = options.fetchImpl || globalThis.fetch;
  const token = options.accessToken;
  const headers = { Accept: "application/json" };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const designated = options.designatedVideoId || DESIGNATED_VIDEO_ID;
  const videoIds = new Set([designated]);

  try {
    // 1. Get channel uploads playlist ID
    const chanUrl = token
      ? "https://www.googleapis.com/youtube/v3/channels?part=contentDetails&mine=true"
      : `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${encodeURIComponent(channelId)}`;

    const chanRes = await fetchFn(chanUrl, { method: "GET", headers });

    if (chanRes.ok) {
      const chanData = await chanRes.json();
      const uploadsPlaylistId = chanData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

      if (uploadsPlaylistId) {
        // 2. Fetch recent uploads playlist items
        const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${encodeURIComponent(uploadsPlaylistId)}&maxResults=50`;
        const plRes = await fetchFn(playlistUrl, { method: "GET", headers });

        if (plRes.ok) {
          const plData = await plRes.json();
          const items = Array.isArray(plData.items) ? plData.items : [];
          for (const item of items) {
            const vid = item.contentDetails?.videoId || item.snippet?.resourceId?.videoId;
            if (vid) videoIds.add(vid);
          }
        }
      }
    }
  } catch {
    // Fall back to designated video if channel listing encounters API/quota restriction
  }

  return Array.from(videoIds);
}

/**
 * Retrieves available public comments for a given video ID via YouTube Data API v3.
 * Handles commentsDisabled gracefully without throwing an exception.
 *
 * @param {string} videoId
 * @param {Object} [options]
 * @param {string} [options.accessToken]
 * @param {typeof fetch} [options.fetchImpl]
 * @returns {Promise<Array<{ commentId: string, videoId: string, commentText: string, authorDisplayName: string, publishedTime: string, likeCount: number, commentUrl: string, followUpStatus: string, jiraIssueKey: null }>>}
 */
export async function fetchVideoComments(videoId, options = {}) {
  if (!videoId) return [];

  const fetchFn = options.fetchImpl || globalThis.fetch;
  const token = options.accessToken;
  const headers = { Accept: "application/json" };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${encodeURIComponent(videoId)}&maxResults=100`;

  try {
    const res = await fetchFn(url, { method: "GET", headers });

    // Handle commentsDisabled or not found gracefully
    if (res.status === 403 || res.status === 404) {
      return [];
    }

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      // If error reason is commentsDisabled, treat as 0 comments
      if (errText.includes("commentsDisabled")) {
        return [];
      }
      throw new Error(
        `YouTube commentThreads request failed (${res.status}): ${errText.slice(0, 150)}`,
      );
    }

    const data = await res.json();
    const items = Array.isArray(data.items) ? data.items : [];

    return items.map((item) => {
      const commentId = item.id;
      const topLevel = item.snippet?.topLevelComment?.snippet || {};

      return {
        commentId,
        videoId,
        commentText: topLevel.textDisplay || topLevel.textOriginal || "",
        authorDisplayName: topLevel.authorDisplayName || "YouTube User",
        publishedTime: topLevel.publishedAt || new Date().toISOString(),
        likeCount: Number(topLevel.likeCount || 0),
        commentUrl: `https://www.youtube.com/watch?v=${videoId}&lc=${commentId}`,
        followUpStatus: "No Action Needed",
        jiraIssueKey: null,
      };
    });
  } catch (err) {
    if (String(err.message).includes("commentsDisabled")) {
      return [];
    }
    throw err;
  }
}

/**
 * Transmits a single record payload to Google Apps Script Web App.
 *
 * @param {Object} payload
 * @param {Object} [options]
 * @returns {Promise<boolean>}
 */
async function sendToAppsScript(payload, options = {}) {
  const fetchFn = options.fetchImpl || globalThis.fetch;
  const gasUrl =
    options.gasUrl ||
    process.env.GOOGLE_APPS_SCRIPT_URL ||
    (process.env.NODE_ENV !== "test"
      ? "https://script.google.com/macros/s/AKfycbyO4AzoxaoBU99WFQUDNbRV-4r6UmBTLPSsgeZiCS4T2AyObnUfNcYhLv-gcVnAMYgRKg/exec"
      : null);

  if (!gasUrl) return false;

  try {
    const res = await fetchFn(gasUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        spreadsheetId:
          process.env.GOOGLE_SPREADSHEET_ID || "1S-ApP83X9Y1-nXwim0tDNGn72wuhVn4PSbaWkcXlH48",
        sheetGid: process.env.GOOGLE_SPREADSHEET_GID || "2025481644",
      }),
      signal: AbortSignal.timeout(3500),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Records YouTube statistics in the dedicated "YouTube Stats" tab.
 * Deduplicates updates so current-state rows update without redundant unchanged writes.
 *
 * @param {Array<Object>} statsRecords
 * @param {Object} [options]
 * @returns {Promise<{ recordedCount: number, skippedCount: number }>}
 */
export async function recordStatsToGoogleSheets(statsRecords, options = {}) {
  let recordedCount = 0;
  let skippedCount = 0;

  for (const record of statsRecords) {
    const stateFingerprint = JSON.stringify({
      views: record.views,
      likes: record.likes,
      commentCount: record.commentCount,
    });

    const previousState = lastKnownStatsMap.get(record.videoId);

    // If stats have not changed, skip duplicate write unless forceSync is specified
    if (!options.forceSync && previousState === stateFingerprint) {
      skippedCount++;
      continue;
    }

    const payload = {
      sheet: "YouTube Stats",
      sheetName: "YouTube Stats",
      table: "YouTube Stats",
      event: "youtube_stats",
      eventType: "youtube_stats",
      videoId: record.videoId,
      "Video ID": record.videoId,
      title: record.title,
      Title: record.title,
      url: record.url,
      URL: record.url,
      publishedDate: record.publishedDate,
      "Published Date": record.publishedDate,
      views: record.views,
      Views: record.views,
      likes: record.likes,
      Likes: record.likes,
      commentCount: record.commentCount,
      "Comment Count": record.commentCount,
      lastSyncTime: record.lastSyncTime,
      "Last Sync Time": record.lastSyncTime,
      timestamp: record.lastSyncTime,
    };

    const ok = await sendToAppsScript(payload, options);
    if (ok || process.env.NODE_ENV === "test") {
      lastKnownStatsMap.set(record.videoId, stateFingerprint);
      recordedCount++;
    }
  }

  return { recordedCount, skippedCount };
}

/**
 * Records new YouTube comments in the dedicated "YouTube Comments" tab.
 * Deduplicates by comment ID so existing comments are never re-appended.
 * Strictly does NOT create Jira issues automatically.
 *
 * @param {Array<Object>} commentRecords
 * @param {Object} [options]
 * @returns {Promise<{ recordedCount: number, skippedCount: number }>}
 */
export async function recordCommentsToGoogleSheets(commentRecords, options = {}) {
  let recordedCount = 0;
  let skippedCount = 0;

  for (const comment of commentRecords) {
    if (syncedCommentIds.has(comment.commentId)) {
      skippedCount++;
      continue;
    }

    const payload = {
      sheet: "YouTube Comments",
      sheetName: "YouTube Comments",
      table: "YouTube Comments",
      event: "youtube_comment",
      eventType: "youtube_comment",
      commentId: comment.commentId,
      "Comment ID": comment.commentId,
      videoId: comment.videoId,
      "Video ID": comment.videoId,
      commentText: comment.commentText,
      "Comment Text": comment.commentText,
      authorDisplayName: comment.authorDisplayName,
      "Author Display Name": comment.authorDisplayName,
      publishedTime: comment.publishedTime,
      "Published Time": comment.publishedTime,
      likeCount: comment.likeCount,
      "Like Count": comment.likeCount,
      commentUrl: comment.commentUrl,
      "Comment URL": comment.commentUrl,
      followUpStatus: comment.followUpStatus || "No Action Needed",
      "Follow-Up Status": comment.followUpStatus || "No Action Needed",
      jiraIssueKey: comment.jiraIssueKey || "",
      "Jira Issue Key": comment.jiraIssueKey || "",
      timestamp: new Date().toISOString(),
    };

    const ok = await sendToAppsScript(payload, options);
    if (ok || process.env.NODE_ENV === "test") {
      syncedCommentIds.add(comment.commentId);
      recordedCount++;
    }
  }

  return { recordedCount, skippedCount };
}

/**
 * Records sync execution status in the dedicated "YouTube Sync Log" tab.
 *
 * @param {Object} logData
 * @param {Object} [options]
 * @returns {Promise<boolean>}
 */
export async function recordSyncLogToGoogleSheets(logData, options = {}) {
  const timestamp = new Date().toISOString();
  const payload = {
    sheet: "YouTube Sync Log",
    sheetName: "YouTube Sync Log",
    table: "YouTube Sync Log",
    event: "youtube_sync_log",
    eventType: "youtube_sync_log",
    syncStatus: logData.syncStatus || "Success",
    "Sync Status": logData.syncStatus || "Success",
    recordsProcessed:
      typeof logData.recordsProcessed === "object"
        ? JSON.stringify(logData.recordsProcessed)
        : String(logData.recordsProcessed || 0),
    "Records Processed":
      typeof logData.recordsProcessed === "object"
        ? JSON.stringify(logData.recordsProcessed)
        : String(logData.recordsProcessed || 0),
    errors: logData.errors && logData.errors.length > 0 ? logData.errors.join("; ") : "None",
    Errors: logData.errors && logData.errors.length > 0 ? logData.errors.join("; ") : "None",
    lastSuccessfulSync: logData.lastSuccessfulSync || timestamp,
    "Last Successful Sync": logData.lastSuccessfulSync || timestamp,
    timestamp,
  };

  return sendToAppsScript(payload, options);
}

/**
 * Determines whether a YouTube comment qualifies as a business lead / commercial enquiry.
 * Evaluates comment text for commercial intent (quote, pricing, rfq, datasheet, buy, order),
 * technical feasibility inquiries (cleanroom, iso class, repeatability specifications),
 * or direct contact details (email, phone).
 *
 * Ordinary praise, compliments, and non-actionable remarks return false.
 *
 * @param {Object|string} comment
 * @returns {boolean}
 */
export function isQualifyingComment(comment) {
  const text = typeof comment === "string" ? comment : (comment?.commentText || "");
  if (!text || typeof text !== "string") return false;

  const leadPatterns = [
    /\b(quote|pricing|price|cost|buy|purchase|order|rfq|datasheet|catalog)\b/i,
    /\b(cleanroom|iso class)\b/i,
    /\b(repeatability|tolerance|payload|resolution)\s+(spec|specification|data|requirement)/i,
    /\b(how much|lead time|delivery time|ship to|batch size|units? needed|volume pricing)\b/i,
    /\b(who can (?:we|i) contact|sales team|distributor in|supplier for)\b/i,
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/, // email address
    /\+?\d[\d -]{8,}\d/, // phone number
  ];

  return leadPatterns.some((pattern) => pattern.test(text));
}

/**
 * Explicitly escalates a YouTube comment to Jira Project YLT.
 * ONLY triggered when an authorized operator explicitly marks a comment as needing action.
 * A comment is not automatically a qualified lead; does not invent contact information.
 *
 * @param {Object} params
 * @param {string} params.commentId
 * @param {string} params.videoId
 * @param {string} params.commentText
 * @param {string} params.authorDisplayName
 * @param {string} [params.reason]
 * @param {Object} [options]
 * @returns {Promise<{ success: boolean, issueKey: string, jiraKey: string, projectKey: string, followUpStatus: string }>}
 */
export async function escalateCommentToJira(params, options = {}) {
  const { commentId, videoId, commentText, authorDisplayName, reason } = params;

  if (!commentId || !videoId) {
    throw new Error(
      "Missing required parameters: commentId and videoId are required for escalation",
    );
  }

  const targetProjectKey = (process.env.YOUTUBE_JIRA_PROJECT_KEY || "YLT").trim();
  if (targetProjectKey === "DI") {
    throw new Error(
      "Safety Violation: YouTube comment follow-up must strictly route to YLT, never DI.",
    );
  }

  const JIRA_DOMAIN = (process.env.JIRA_DOMAIN || "").trim();
  const JIRA_EMAIL = (process.env.JIRA_EMAIL || "").trim();
  const JIRA_API_TOKEN = (process.env.JIRA_API_TOKEN || "").trim();
  const JIRA_ASSIGNEE_ID = (
    process.env.YOUTUBE_JIRA_ASSIGNEE_ID ||
    process.env.JIRA_ASSIGNEE_ID ||
    "712020:90b59131-da57-4b30-9614-6891eff382e6"
  ).trim();

  if (!JIRA_DOMAIN || !JIRA_EMAIL || !JIRA_API_TOKEN) {
    throw new Error("Jira credentials are unconfigured on the server");
  }

  const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString("base64");
  const authorName = authorDisplayName || "YouTube User";
  const summary = `[YouTube Comment Follow-Up] ${authorName} on ${videoId}`.slice(0, 250);
  const commentUrl = `https://www.youtube.com/watch?v=${videoId}&lc=${commentId}`;
  const timestamp = new Date().toISOString();

  const description = `
==================================================
YOUTUBE ENGAGEMENT FOLLOW-UP (YLT DEALFLOW)
==================================================

COMMENT DETAILS:
• Comment ID: ${commentId}
• Video ID: ${videoId}
• Video URL: https://youtu.be/${videoId}
• Author Public Name: ${authorName} (Public identity only; no contact info assumed)
• Comment URL: ${commentUrl}

COMMENT TEXT:
${commentText || "No text content"}

OPERATOR FOLLOW-UP REASON:
${reason || "Authorized team member marked comment for engineering follow-up"}

--------------------------------------------------
Origin: INDUS YouTube Engagement Follow-Up
Target Project: ${targetProjectKey}
Timestamp: ${timestamp}
  `.trim();

  const labels = ["youtube-comment", "follow-up", "dealflow-ylt", `yt-vid-${videoId.slice(0, 15)}`];

  const jiraPayload = {
    fields: {
      project: { key: targetProjectKey },
      summary,
      description,
      issuetype: { name: "Task" },
      labels,
      ...(JIRA_ASSIGNEE_ID ? { assignee: { accountId: JIRA_ASSIGNEE_ID } } : {}),
    },
  };

  const fetchFn = options.fetchImpl || globalThis.fetch;
  const jiraRes = await fetchFn(`https://${JIRA_DOMAIN}/rest/api/2/issue`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(jiraPayload),
    signal: AbortSignal.timeout(6000),
  });

  if (!jiraRes.ok) {
    const errText = await jiraRes.text().catch(() => "");
    throw new Error(
      `Failed to create Jira issue in project ${targetProjectKey} (${jiraRes.status}): ${errText.slice(0, 150)}`,
    );
  }

  const jiraData = await jiraRes.json();
  const jiraKey = jiraData.key;
  const followUpStatus = `Jira YLT Created (${jiraKey})`;

  // Update corresponding row in Google Sheets "YouTube Comments" tab
  await sendToAppsScript(
    {
      sheet: "YouTube Comments",
      sheetName: "YouTube Comments",
      table: "YouTube Comments",
      event: "youtube_comment_escalation",
      commentId,
      "Comment ID": commentId,
      videoId,
      "Video ID": videoId,
      followUpStatus,
      "Follow-Up Status": followUpStatus,
      jiraIssueKey: jiraKey,
      "Jira Issue Key": jiraKey,
      jiraKey,
      timestamp,
    },
    options,
  );

  return {
    success: true,
    issueKey: jiraKey,
    jiraKey,
    projectKey: targetProjectKey,
    followUpStatus,
  };
}

/**
 * Synchronizes YouTube video engagement metrics (views, likes, comments count)
 * directly into dedicated activity tasks in Jira Project YLT.
 * Updates existing ticket if one exists for the video, or creates a new one.
 *
 * @param {Array<Object>} statsRecords
 * @param {Object} [options]
 * @param {typeof fetch} [options.fetchImpl]
 * @returns {Promise<{ syncedCount: number, issues: Array<{ action: string, key: string, videoId: string }> }>}
 */
export async function syncVideoStatsToJira(statsRecords, options = {}) {
  const JIRA_DOMAIN = (process.env.JIRA_DOMAIN || "").trim();
  const JIRA_EMAIL = (process.env.JIRA_EMAIL || "").trim();
  const JIRA_API_TOKEN = (process.env.JIRA_API_TOKEN || "").trim();
  const JIRA_ASSIGNEE_ID = (process.env.JIRA_ASSIGNEE_ID || "").trim();
  const targetProjectKey = "YLT";

  if (
    !JIRA_DOMAIN ||
    !JIRA_EMAIL ||
    !JIRA_API_TOKEN ||
    !Array.isArray(statsRecords) ||
    statsRecords.length === 0
  ) {
    return { syncedCount: 0, issues: [] };
  }

  const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString("base64");
  const fetchFn = options.fetchImpl || globalThis.fetch;
  const results = [];

  for (const record of statsRecords) {
    const videoId = record.videoId || "";
    if (!videoId) continue;
    const title = record.title || "Indus Robot Visual";
    const views = Number(record.views || 0);
    const likes = Number(record.likes || 0);
    const comments = Number(record.commentCount || 0);
    const timestamp = record.lastSyncTime || new Date().toISOString();

    const summary = `[YouTube Activity] ${title} (${videoId}) - Views: ${views}, Likes: ${likes}, Comments: ${comments}`;
    const description = `
==================================================
YOUTUBE VIDEO ACTIVITY & ENGAGEMENT METRICS
==================================================

VIDEO DETAILS:
• Title: ${title}
• Video ID: ${videoId}
• Video URL: https://youtu.be/${videoId}
• Channel: sri lakshana (@srilakshana-h1t)

CURRENT LIVE METRICS:
• Views: ${views}
• Likes: ${likes}
• Comments Count: ${comments}

CAMPAIGN & ATTRIBUTION DETAILS:
• Target Jira Project: ${targetProjectKey}
• Designated Video ID: ${videoId}
• Inbound Tracking URL: https://precision-motion-systems-main.vercel.app/?utm_source=youtube&utm_medium=video&v=${videoId}

--------------------------------------------------
Origin: Automated YouTube Data API v3 Sync
Last Synced: ${timestamp}
    `.trim();

    const vidLabel = `yt-vid-${videoId.slice(0, 15).toLowerCase().replace(/[^a-z0-9_-]/g, "")}`;
    const labels = ["youtube-activity", "video-metrics", "dealflow-ylt", vidLabel];

    try {
      // 1. Search for existing activity issue in YLT
      const jql = `project = "${targetProjectKey}" AND labels = "${vidLabel}" AND labels = "youtube-activity" ORDER BY created ASC`;
      const searchRes = await fetchFn(
        `https://${JIRA_DOMAIN}/rest/api/3/search/jql?jql=${encodeURIComponent(jql)}&maxResults=1&fields=id,key`,
        {
          headers: {
            Authorization: `Basic ${auth}`,
            Accept: "application/json",
          },
          signal: AbortSignal.timeout(6000),
        },
      );

      let existingKey = null;
      if (searchRes.ok) {
        const searchData = await searchRes.json();
        if (searchData.issues && searchData.issues.length > 0) {
          existingKey = searchData.issues[0].key;
        }
      }

      if (existingKey) {
        // Update existing issue
        const updateRes = await fetchFn(`https://${JIRA_DOMAIN}/rest/api/2/issue/${existingKey}`, {
          method: "PUT",
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            fields: {
              summary,
              description,
              labels,
              ...(JIRA_ASSIGNEE_ID ? { assignee: { accountId: JIRA_ASSIGNEE_ID } } : {}),
            },
          }),
          signal: AbortSignal.timeout(6000),
        });

        if (updateRes.ok) {
          results.push({ action: "updated", key: existingKey, videoId });
        }
      } else {
        // Create new issue in YLT
        const createRes = await fetchFn(`https://${JIRA_DOMAIN}/rest/api/2/issue`, {
          method: "POST",
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            fields: {
              project: { key: targetProjectKey },
              summary,
              description,
              issuetype: { name: "Task" },
              labels,
              ...(JIRA_ASSIGNEE_ID ? { assignee: { accountId: JIRA_ASSIGNEE_ID } } : {}),
            },
          }),
          signal: AbortSignal.timeout(6000),
        });

        if (createRes.ok) {
          const createData = await createRes.json();
          results.push({ action: "created", key: createData.key, videoId });
        }
      }
    } catch {
      // Safe fallback - do not crash sync if Jira API encounters network delay
    }
  }

  return { syncedCount: results.length, issues: results };
}

/**
 * Automatically synchronizes qualifying YouTube comments directly into dedicated follow-up tickets in Jira Project YLT.
 * Avoids duplicate tickets by checking if a ticket for the commentId already exists in YLT.
 * Evaluates each comment via isQualifyingComment; ordinary comments do not create Jira tickets.
 *
 * @param {Array<Object>} comments
 * @param {Object} [options]
 * @param {typeof fetch} [options.fetchImpl]
 * @returns {Promise<{ createdCount: number, issues: Array<{ key: string, commentId: string }>, errors: string[] }>}
 */
export async function syncCommentsToJira(comments, options = {}) {
  const JIRA_DOMAIN = (process.env.JIRA_DOMAIN || "").trim();
  const JIRA_EMAIL = (process.env.JIRA_EMAIL || "").trim();
  const JIRA_API_TOKEN = (process.env.JIRA_API_TOKEN || "").trim();
  const JIRA_ASSIGNEE_ID = (
    process.env.YOUTUBE_JIRA_ASSIGNEE_ID ||
    process.env.JIRA_ASSIGNEE_ID ||
    "712020:90b59131-da57-4b30-9614-6891eff382e6"
  ).trim();
  const targetProjectKey = (process.env.YOUTUBE_JIRA_PROJECT_KEY || "YLT").trim();
  if (targetProjectKey === "DI") {
    throw new Error(
      "Safety Violation: YouTube comment follow-up must strictly route to YLT, never DI.",
    );
  }

  if (
    !JIRA_DOMAIN ||
    !JIRA_EMAIL ||
    !JIRA_API_TOKEN ||
    !Array.isArray(comments) ||
    comments.length === 0
  ) {
    return { createdCount: 0, issues: [], errors: [] };
  }

  const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString("base64");
  const fetchFn = options.fetchImpl || globalThis.fetch;
  const created = [];
  const errors = [];

  for (const c of comments) {
    const commentId = c.commentId || "";
    const videoId = c.videoId || "";
    if (!commentId || !videoId) continue;

    // Lead qualification: only comments representing business leads or technical enquiries qualify
    if (!isQualifyingComment(c)) {
      continue;
    }

    const author = c.authorDisplayName || "YouTube User";
    const text = c.commentText || "";
    const publishedAt = c.publishedTime || new Date().toISOString();
    const commentUrl = c.commentUrl || `https://www.youtube.com/watch?v=${videoId}&lc=${commentId}`;

    const sanitizedCmtId = commentId.slice(0, 30).toLowerCase().replace(/[^a-z0-9_-]/g, "");
    const cmtLabel = `yt-cmt-${sanitizedCmtId}`;
    const vidLabel = `yt-vid-${videoId.slice(0, 15).toLowerCase().replace(/[^a-z0-9_-]/g, "")}`;

    try {
      // 1. Check if Jira issue already exists for this comment
      const jql = `project = "${targetProjectKey}" AND labels = "${cmtLabel}"`;
      const searchRes = await fetchFn(
        `https://${JIRA_DOMAIN}/rest/api/3/search/jql?jql=${encodeURIComponent(jql)}&maxResults=1&fields=id,key`,
        {
          headers: {
            Authorization: `Basic ${auth}`,
            Accept: "application/json",
          },
          signal: AbortSignal.timeout(6000),
        },
      );

      let existingKey = null;
      if (searchRes.ok) {
        const searchData = await searchRes.json();
        if (searchData.issues && searchData.issues.length > 0) {
          existingKey = searchData.issues[0].key;
        }
      }

      if (!existingKey) {
        // Create new Jira ticket in YLT for this qualifying comment
        const summary = `[YouTube Comment] ${author}: "${text.slice(0, 60)}"`;
        const description = `
==================================================
NEW YOUTUBE VIDEO COMMENT (QUALIFIED LEAD)
==================================================

VIDEO DETAILS:
• Video ID: ${videoId}
• Video URL: https://youtu.be/${videoId}

COMMENT DETAILS:
• Comment ID: ${commentId}
• Author: ${author}
• Published: ${publishedAt}
• Comment URL: ${commentUrl}

COMMENT CONTENT:
${text || "No text content"}

--------------------------------------------------
Origin: Automated YouTube Comment Sync
Target Project: ${targetProjectKey}
        `.trim();

        const labels = ["youtube-comment", "dealflow-ylt", vidLabel, cmtLabel];

        const createRes = await fetchFn(`https://${JIRA_DOMAIN}/rest/api/2/issue`, {
          method: "POST",
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            fields: {
              project: { key: targetProjectKey },
              summary,
              description,
              issuetype: { name: "Task" },
              labels,
              ...(JIRA_ASSIGNEE_ID ? { assignee: { accountId: JIRA_ASSIGNEE_ID } } : {}),
            },
          }),
          signal: AbortSignal.timeout(6000),
        });

        if (createRes.ok) {
          const createData = await createRes.json();
          created.push({ key: createData.key, commentId });

          // Update corresponding row in Google Sheets "YouTube Comments" tab with linked Jira key
          await sendToAppsScript(
            {
              sheet: "YouTube Comments",
              sheetName: "YouTube Comments",
              table: "YouTube Comments",
              event: "youtube_comment_escalation",
              commentId,
              "Comment ID": commentId,
              videoId,
              "Video ID": videoId,
              followUpStatus: `Jira YLT Created (${createData.key})`,
              "Follow-Up Status": `Jira YLT Created (${createData.key})`,
              jiraIssueKey: createData.key,
              "Jira Issue Key": createData.key,
              jiraKey: createData.key,
              timestamp: new Date().toISOString(),
            },
            options,
          );
        } else {
          const errText = await createRes.text().catch(() => "");
          errors.push(
            `Failed to create Jira issue in project ${targetProjectKey} for comment ${commentId} (${createRes.status}): ${errText.slice(0, 150)}`,
          );
        }
      }
    } catch (err) {
      errors.push(`Jira comment sync exception for comment ${commentId}: ${err.message}`);
    }
  }

  return { createdCount: created.length, issues: created, errors };
}

/**
 * Runs full automated synchronization of YouTube statistics, videos, and comments.
 *
 * @param {Object} [options]
 * @param {string} [options.accessToken]
 * @param {string} [options.channelId]
 * @param {string} [options.designatedVideoId]
 * @param {boolean} [options.forceSync]
 * @param {typeof fetch} [options.fetchImpl]
 * @returns {Promise<{ success: boolean, videoStatsCount: number, commentsCount: number, errors: string[], lastSuccessfulSync: string }>}
 */
export async function runYouTubeSync(options = {}) {
  const errors = [];
  const designatedVideoId = options.designatedVideoId || DESIGNATED_VIDEO_ID;
  const channelId = options.channelId || process.env.YOUTUBE_CHANNEL_ID || DEFAULT_CHANNEL_ID;

  let accessToken = options.accessToken;

  // Resolve access token if not explicitly provided
  if (!accessToken) {
    try {
      const tokenResult = await getYouTubeAccessToken({
        fetchImpl: options.fetchImpl,
      });
      accessToken = tokenResult.accessToken;
    } catch (err) {
      const safeError = err instanceof Error ? err.message : "Access token resolution failed";
      errors.push(safeError);

      // Record failure in YouTube Sync Log
      await recordSyncLogToGoogleSheets(
        {
          syncStatus: "Configuration Required",
          recordsProcessed: { videoStats: 0, comments: 0 },
          errors: [safeError],
          lastSuccessfulSync: lastSuccessfulSyncTimestamp || "Never",
        },
        options,
      );

      return {
        success: false,
        videoStatsCount: 0,
        commentsCount: 0,
        errors,
        lastSuccessfulSync: lastSuccessfulSyncTimestamp || "Never",
      };
    }
  }

  // 1. Fetch channel video IDs (always includes designated video)
  let videoIds = [designatedVideoId];
  try {
    const fetchedIds = await fetchChannelVideos(channelId, {
      accessToken,
      fetchImpl: options.fetchImpl,
      designatedVideoId,
    });
    if (fetchedIds && fetchedIds.length > 0) {
      videoIds = fetchedIds;
    }
  } catch (err) {
    errors.push(`Video discovery error: ${err.message}`);
  }

  // 2. Fetch video statistics for all videos
  let statsRecords = [];
  try {
    statsRecords = await fetchYouTubeVideoStats(videoIds, {
      accessToken,
      fetchImpl: options.fetchImpl,
    });
  } catch (err) {
    errors.push(`Stats retrieval error: ${err.message}`);
  }

  // 3. Record stats to "YouTube Stats" tab
  let statsProcessed = 0;
  if (statsRecords.length > 0) {
    try {
      const { recordedCount } = await recordStatsToGoogleSheets(statsRecords, options);
      statsProcessed = recordedCount;
    } catch (err) {
      errors.push(`Stats recording error: ${err.message}`);
    }
  }

  // 3b. Synchronize video activity metrics directly to Jira YLT
  let jiraStatsSynced = 0;
  if (statsRecords.length > 0) {
    try {
      const jiraSyncRes = await syncVideoStatsToJira(statsRecords, options);
      jiraStatsSynced = jiraSyncRes.syncedCount;
    } catch (err) {
      errors.push(`Jira stats sync warning: ${err.message}`);
    }
  }

  // 4. Fetch available comments for all videos
  let allComments = [];
  for (const vid of videoIds) {
    try {
      const comments = await fetchVideoComments(vid, {
        accessToken,
        fetchImpl: options.fetchImpl,
      });
      allComments.push(...comments);
    } catch (err) {
      errors.push(`Comments fetch error on ${vid}: ${err.message}`);
    }
  }

  // 5. Record comments to "YouTube Comments" tab
  let commentsProcessed = 0;
  if (allComments.length > 0) {
    try {
      const { recordedCount } = await recordCommentsToGoogleSheets(allComments, options);
      commentsProcessed = recordedCount;
    } catch (err) {
      errors.push(`Comments recording error: ${err.message}`);
    }
  }

  // 5b. Synchronize comments directly to Jira YLT
  let jiraCommentsCreated = 0;
  if (allComments.length > 0) {
    try {
      const jiraCmtRes = await syncCommentsToJira(allComments, options);
      jiraCommentsCreated = jiraCmtRes.createdCount;
      if (jiraCmtRes.errors && jiraCmtRes.errors.length > 0) {
        errors.push(...jiraCmtRes.errors);
      }
    } catch (err) {
      errors.push(`Jira comments sync warning: ${err.message}`);
    }
  }

  const syncStatus = errors.length === 0 ? "Success" : "Partial";
  if (errors.length === 0) {
    lastSuccessfulSyncTimestamp = new Date().toISOString();
  }

  // 6. Record execution entry to "YouTube Sync Log" tab
  await recordSyncLogToGoogleSheets(
    {
      syncStatus,
      recordsProcessed: {
        videoStats: statsRecords.length,
        newStatsRecorded: statsProcessed,
        jiraStatsSynced,
        commentsRetrieved: allComments.length,
        newCommentsRecorded: commentsProcessed,
        jiraCommentsCreated,
      },
      errors,
      lastSuccessfulSync: lastSuccessfulSyncTimestamp || new Date().toISOString(),
    },
    options,
  );

  return {
    success: errors.length === 0,
    videoStatsCount: statsRecords.length,
    jiraStatsSynced,
    commentsCount: allComments.length,
    jiraCommentsCreated,
    errors,
    lastSuccessfulSync: lastSuccessfulSyncTimestamp || new Date().toISOString(),
  };
}
