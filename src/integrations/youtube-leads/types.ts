/**
 * INDUS Robotics — YouTube Lead & Engagement Data Schemas
 * Strictly isolated from general website telemetry and DI dealflow.
 */

export interface YouTubeAttribution {
  videoId?: string | undefined;
  channelId?: string | undefined;
  campaign?: string | undefined;
  adGroup?: string | undefined;
  utmSource: string;
  utmMedium: string;
  utmCampaign?: string | undefined;
  utmContent?: string | undefined;
  utmTerm?: string | undefined;
  landingPage: string;
  referrer: string;
  capturedAt: string;
}

export interface YouTubeLeadPayload {
  name: string;
  email: string;
  phone?: string | undefined;
  company?: string | undefined;
  productInterest?: string | undefined;
  estimatedBudget?: string | undefined;
  timeline?: string | undefined;
  requirements?: string | undefined;
  topic?: string | undefined;
  preferredContact?: string | undefined;
  labels?: string[] | undefined;
  attribution?: YouTubeAttribution | undefined;
  /** Bot honeypot field */
  _hp?: string | undefined;
}

export interface YouTubeLeadResponse {
  success: boolean;
  issueKey?: string | undefined;
  jiraKey?: string | undefined;
  projectKey: string;
  duplicate?: boolean | undefined;
  message: string;
  error?: string | undefined;
  googleSheetRecorded?: boolean | undefined;
}

/**
 * YouTube Stats Sheet Record
 */
export interface YouTubeStatsRecord {
  videoId: string;
  title: string;
  url: string;
  publishedDate: string;
  views: number;
  likes: number;
  commentCount: number;
  lastSyncTime: string;
}

/**
 * YouTube Comments Sheet Record
 */
export interface YouTubeCommentRecord {
  commentId: string;
  videoId: string;
  commentText: string;
  authorDisplayName: string;
  publishedTime: string;
  likeCount: number;
  commentUrl: string;
  followUpStatus: string;
  jiraIssueKey?: string | null;
}

/**
 * YouTube Leads Sheet Record
 */
export interface YouTubeLeadRecord {
  leadId: string;
  sourceVideo: string;
  sourceCommentOrEnquiryUrl: string;
  contactDetails: string;
  leadType: string;
  status: string;
  creationTime: string;
  jiraIssueKey: string;
}

/**
 * YouTube Sync Log Sheet Record
 */
export interface YouTubeSyncLogRecord {
  syncStatus: "Success" | "Partial" | "Configuration Required" | "Error";
  recordsProcessed:
    | {
        videoStats?: number;
        newStatsRecorded?: number;
        commentsRetrieved?: number;
        newCommentsRecorded?: number;
      }
    | string;
  errors: string;
  lastSuccessfulSync: string;
  timestamp: string;
}

export interface YouTubeSyncResponse {
  success: boolean;
  videoStatsCount?: number;
  commentsCount?: number;
  errors?: string[];
  lastSuccessfulSync?: string;
  message?: string;
  error?: string;
}

export interface YouTubeCommentEscalationPayload {
  commentId: string;
  videoId: string;
  commentText: string;
  authorDisplayName: string;
  reason?: string;
}

export interface YouTubeCommentEscalationResponse {
  success: boolean;
  issueKey: string;
  jiraKey: string;
  projectKey: string;
  followUpStatus: string;
  error?: string;
}
