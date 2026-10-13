/**
 * INDUS Industrial Robotics — LinkedIn Attribution Types
 */

export interface LinkedInAttribution {
  isLinkedInReferral: boolean;
  leadSource: "LinkedIn Sponsored / Ad" | "LinkedIn Organic" | "Direct / Website" | string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  linkedinClickId?: string; // li_fat_id
  referrerUrl?: string;
  landingPage?: string;
  timestamp: string;
}
