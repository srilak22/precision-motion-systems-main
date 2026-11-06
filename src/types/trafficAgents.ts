export type IndustrySector =
  | "Automotive"
  | "Semiconductor"
  | "Aerospace & Defense"
  | "Warehousing & Logistics"
  | "Heavy Industrial Machining"
  | "Electronics & SMT";

export type ContentFormat =
  | "LinkedIn Technical Teardown"
  | "Kinematic Engineering Case Study"
  | "Executive ROI Whitepaper"
  | "Multi-Slide Technical Carousel"
  | "Video Script & Motion Prompt"
  | "Email Nurture Sequence";

export type AgentStatus = "active" | "idle" | "generating" | "paused";

export interface TrafficProfile {
  id: string;
  name: string;
  sector: IndustrySector;
  targetRole: string;
  buyingCommittee: string[];
  searchIntentKeywords: string[];
  primaryPainPoint: string;
  technicalFriction: string;
  conversionRoute: string;
  monthlyTrafficPotential: number;
  avgDealSizeUsd: number;
  projectedConversionRate: number;
  contentPillars: string[];
}

export interface ContentAgent {
  id: string;
  name: string;
  codename: string;
  role: string;
  description: string;
  systemPrompt: string;
  primaryChannel: string;
  status: AgentStatus;
  autonomyLevel: "Fully Autonomous" | "Supervised (Human-in-Loop)";
  executionCadence: string;
  metrics: {
    assetsGenerated: number;
    totalImpressions: number;
    inboundClicks: number;
    rfqsGenerated: number;
    avgQualityScore: number;
  };
}

export interface TechnicalSpecItem {
  label: string;
  value: string;
}

export interface GeneratedContentAsset {
  id: string;
  agentId: string;
  profileId: string;
  format: ContentFormat;
  title: string;
  hook: string;
  context: string;
  technicalProof: string;
  specs: TechnicalSpecItem[];
  callToAction: {
    text: string;
    route: string;
    utmParams: string;
  };
  hashtags: string[];
  qualityScore: number;
  status: "published" | "queued" | "draft";
  createdAt: string;
  projectedMetrics: {
    estimatedImpressions: number;
    expectedCtr: number;
    attributedLeads: number;
  };
}

export interface PublishingQueueItem {
  id: string;
  assetId: string;
  agentCodename: string;
  profileName: string;
  title: string;
  channel: "LinkedIn" | "Engineering Portal" | "Email Campaign" | "YouTube / Video";
  scheduledDate: string;
  scheduledTime: string;
  status: "QUEUED" | "SYNCED_TO_SHEETS" | "PUBLISHED" | "FAILED";
  sheetsWebhookUrl?: string;
  livePostUrl?: string;
}

export interface AttributionFunnelStage {
  stage: string;
  count: number;
  conversionRate: number;
  description: string;
}
