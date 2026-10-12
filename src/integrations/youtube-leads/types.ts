/**
 * INDUS Robotics — YouTube Lead Integration Data Schemas
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
}
