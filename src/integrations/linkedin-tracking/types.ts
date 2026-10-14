/**
 * INDUS Industrial Robotics — LinkedIn Attribution Types
 */

export interface LinkedInAttribution {
  isLinkedInReferral: boolean;
  leadSource: "LinkedIn Sponsored / Ad" | "LinkedIn Organic" | "Direct / Website" | string;
  utmSource?: string | undefined;
  utmMedium?: string | undefined;
  utmCampaign?: string | undefined;
  utmContent?: string | undefined;
  utmTerm?: string | undefined;
  linkedinClickId?: string | undefined; // li_fat_id
  referrerUrl?: string | undefined;
  landingPage?: string | undefined;
  timestamp: string;
}
