// INDUS Robotics — YouTube Synchronization & Comment Escalation Endpoint
// POST /api/youtube-sync — triggers sync or explicit comment escalation
// GET /api/youtube-sync — returns read-only sync status (zero secret leakage)

import {
  runYouTubeSync,
  escalateCommentToJira,
  isQualifyingComment,
  DESIGNATED_VIDEO_ID,
  DEFAULT_CHANNEL_HANDLE,
  DEFAULT_CHANNEL_ID,
} from "./lib/youtube-sync.js";

export { isQualifyingComment };

function isAuthorized(req) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) return true; // If AUTH_SECRET is not configured, permit internal invocations

  const authHeader = req.headers ? req.headers.authorization || "" : "";
  if (authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7).trim() === secret.trim();
  }

  // Check custom sync secret header
  const customKey = req.headers ? req.headers["x-sync-secret"] : "";
  if (customKey && customKey.trim() === secret.trim()) {
    return true;
  }

  return false;
}

export default async function handler(req, res) {
  // CORS Handling
  const origin = req.headers ? req.headers.origin || "" : "";
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-sync-secret");
  }

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // GET: Health / Status inspection endpoint or Cron execution
  if (req.method === "GET") {
    const isCron = Boolean(
      (req.query && (req.query.cron === "1" || req.query.trigger === "sync")) ||
        req.headers["x-vercel-cron"],
    );

    if (isCron) {
      try {
        const syncResult = await runYouTubeSync();
        return res.status(200).json(syncResult);
      } catch (err) {
        return res.status(500).json({
          success: false,
          error: err instanceof Error ? err.message : "Cron sync execution failed",
        });
      }
    }

    const hasRefreshToken = Boolean(
      process.env.YOUTUBE_REFRESH_TOKEN && process.env.YOUTUBE_REFRESH_TOKEN.trim().length > 0,
    );
    const hasOAuthClientId = Boolean(
      process.env.YOUTUBE_OAUTH_CLIENT_ID && process.env.YOUTUBE_OAUTH_CLIENT_ID.trim().length > 0,
    );

    return res.status(200).json({
      success: true,
      service: "INDUS YouTube Data API Sync & Engagement Engine",
      status: hasRefreshToken ? "Configured & Ready" : "Awaiting Channel Authorization",
      designatedVideoId: DESIGNATED_VIDEO_ID,
      designatedVideoUrl: `https://youtu.be/${DESIGNATED_VIDEO_ID}`,
      channelHandle: DEFAULT_CHANNEL_HANDLE,
      channelId: DEFAULT_CHANNEL_ID,
      credentials: {
        oauthConfigured: hasOAuthClientId,
        refreshTokenConfigured: hasRefreshToken,
      },
      tabsConfigured: ["YouTube Stats", "YouTube Comments", "YouTube Leads", "YouTube Sync Log"],
      jiraProject: process.env.YOUTUBE_JIRA_PROJECT_KEY || "YLT",
    });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST, OPTIONS");
    return res.status(405).json({
      success: false,
      error: "Method Not Allowed. Only GET and POST are supported.",
    });
  }

  try {
    let payload = req.body;
    if (typeof payload === "string") {
      try {
        payload = JSON.parse(payload);
      } catch {
        return res.status(400).json({ success: false, error: "Invalid JSON payload" });
      }
    }

    if (!payload || typeof payload !== "object") {
      return res.status(400).json({ success: false, error: "Body must be a JSON object" });
    }

    const action = String(payload.action || "sync")
      .toLowerCase()
      .trim();

    // 1. Explicit comment follow-up escalation
    if (action === "escalate_comment" || action === "escalate") {
      const { commentId, videoId, commentText, authorDisplayName, reason } = payload;
      if (!commentId || !videoId) {
        return res.status(400).json({
          success: false,
          error: "Missing required parameters: commentId and videoId are required for escalation.",
        });
      }

      const result = await escalateCommentToJira({
        commentId,
        videoId,
        commentText: commentText || "",
        authorDisplayName: authorDisplayName || "YouTube User",
        reason: reason || "Explicit comment follow-up requested",
      });

      return res.status(200).json(result);
    }

    // 2. Full synchronization execution
    if (action === "sync") {
      const forceSync = Boolean(payload.forceSync);
      const syncResult = await runYouTubeSync({ forceSync });

      const statusCode = syncResult.success ? 200 : 207; // 207 Multi-Status if partial
      return res.status(statusCode).json({
        success: syncResult.success,
        videoStatsCount: syncResult.videoStatsCount,
        commentsCount: syncResult.commentsCount,
        errors: syncResult.errors,
        lastSuccessfulSync: syncResult.lastSuccessfulSync,
        message: syncResult.success
          ? "YouTube channel statistics and comments synchronized successfully."
          : "YouTube sync completed with warnings or missing credentials.",
      });
    }

    return res.status(400).json({
      success: false,
      error: `Unknown action: "${action}". Valid actions are "sync" and "escalate_comment".`,
    });
  } catch (err) {
    const safeError = err instanceof Error ? err.message : "Internal error executing YouTube sync";
    return res.status(500).json({
      success: false,
      error: safeError,
    });
  }
}
