/**
 * TYPES FOR INDUS WEBSITE INTELLIGENCE SYSTEM
 * 5 Core Layers: Session, Traffic, Geo, Time Zone, IP/Network
 */

export type TrafficSourceType =
  | "Paid Search"
  | "Organic Search"
  | "Social"
  | "Email"
  | "Referral"
  | "Direct"
  | "Campaign"
  | string;

export interface GeoData {
  country?: string | undefined;
  countryCode?: string | undefined;
  region?: string | undefined;
  city?: string | undefined;
  timezone?: string | undefined;
  latitude?: number | undefined;
  longitude?: number | undefined;
  geoProvider?: string | undefined;
}

export interface NetworkData {
  ipVersion?: string | undefined; // IPv4 | IPv6
  maskedIp?: string | undefined; // 192.168.1.xxx (GDPR-safe)
  networkId?: string | undefined; // Subnet identifier
  networkType?: string | undefined; // 4G, 5G, WiFi, Broadband, Ethernet
  organization?: string | undefined;
  isp?: string | undefined;
  asn?: string | undefined;
  isDataCenter?: boolean | undefined;
  isProxyVpn?: boolean | undefined;
  isBot?: boolean | undefined;
  networkRiskSignal?: ("NORMAL" | "UNUSUAL" | "NEEDS REVIEW" | "POTENTIAL AUTOMATION") | undefined;
  supportingSignals?: string | undefined;
}

export interface IntelligenceEvent {
  id: string;
  sessionId: string;
  timestamp: string; // ISO 8601
  epoch: number;
  event: string; // page_view, cta_click, form_submit, lead, download, search, whatsapp_click, scroll, etc.
  element?: string | undefined;
  details?: string | undefined;
  scrollDepth?: number | undefined;
  page: string;
  url: string;
  referrer: string;
  device: "Desktop" | "Tablet" | "Mobile";
  browser?: string | undefined;
  operatingSystem?: string | undefined;
  screen: string;
  visitorType: "New Visitor" | "Returning Visitor";

  // Time Zone Intelligence
  timezone: string;
  utcOffset?: string | undefined;
  localTimestamp?: string | undefined;
  localHour: number; // 0 - 23
  localDay: string; // Mon, Tue, etc.
  localDate: string; // YYYY-MM-DD
  dayOfWeek?: string | undefined;
  isWeekend?: string | undefined;
  timeOfDayBucket?: string | undefined;
  isBusinessHours?: string | undefined;

  // Session Intelligence
  sessionDuration: number; // in seconds
  pageDwellTime: number; // in seconds

  // Traffic Intelligence
  trafficType?: string | undefined;
  trafficSource: TrafficSourceType;
  trafficMedium?: string | undefined;
  trafficChannel?: string | undefined;
  utmSource?: string | undefined;
  utmMedium?: string | undefined;
  utmCampaign?: string | undefined;
  utmTerm?: string | undefined;
  utmContent?: string | undefined;

  // Geo Intelligence (Privacy-Safe: Country, Region, City)
  country?: string | undefined;
  countryCode?: string | undefined;
  region?: string | undefined;
  city?: string | undefined;
  latitude?: number | undefined;
  longitude?: number | undefined;
  geoProvider?: string | undefined;

  // Network / IP Intelligence (Privacy-Safe: No Raw IPs)
  ipVersion?: string | undefined;
  maskedIp?: string | undefined;
  networkId?: string | undefined;
  networkType?: string | undefined;
  organization?: string | undefined;
  isp?: string | undefined;
  asn?: string | undefined;
  isDataCenter?: boolean | undefined;
  isProxyVpn?: boolean | undefined;
  isBot?: boolean | undefined;
  isSuspicious?: boolean | undefined;
  networkRiskSignal?: string | undefined;
  supportingSignals?: string | undefined;
}

export interface SessionRecord {
  sessionId: string;
  startTime: string;
  lastActiveTime: string;
  startEpoch: number;
  lastActiveEpoch: number;
  durationSeconds: number;
  entryPage: string;
  exitPage: string;
  pagesVisited: string[];
  pageCount: number;
  isBounce: boolean;
  totalEvents: number;
  ctaClicks: number;
  productViews: number;
  formSubmissions: number;
  downloads: number;
  searches: number;
  whatsappClicks: number;
  leads: number;
  scrollDepths: number[];

  // Traffic
  trafficType?: string | undefined;
  trafficSource: TrafficSourceType;
  trafficMedium?: string | undefined;
  trafficChannel?: string | undefined;
  referrer: string;
  utm: {
    source?: string | undefined;
    medium?: string | undefined;
    campaign?: string | undefined;
    term?: string | undefined;
    content?: string | undefined;
  };

  // Geo
  country?: string | undefined;
  region?: string | undefined;
  city?: string | undefined;

  // Time
  timezone: string;
  localHour: number;
  localDay: string;

  // Network
  networkType?: string | undefined;
  organization?: string | undefined;
  isp?: string | undefined;
  asn?: string | undefined;
  isBot?: boolean | undefined;
  isSuspicious?: boolean | undefined;
  device: "Desktop" | "Tablet" | "Mobile";
}

export interface SessionIntelligenceKPIs {
  totalSessions: number;
  avgSessionDurationSeconds: number;
  avgPagesPerSession: number;
  bounceRatePercent: number;
  topEntryPage: string;
  topExitPage: string;
  userJourneys: { path: string; count: number }[];
  mostEngagedPages: { page: string; views: number; avgDwellTimeSeconds: number }[];
}

export interface TrafficIntelligenceKPIs {
  totalTraffic: number;
  organic: number;
  direct: number;
  referral: number;
  campaign: number;
  sourceDistribution: { source: string; count: number; percentage: number }[];
  trafficOverTime: {
    date: string;
    direct: number;
    organic: number;
    referral: number;
    campaign: number;
    total: number;
  }[];
  campaignPerformance: { campaign: string; source: string; sessions: number; leads: number }[];
  funnel: { step: string; count: number; dropoff?: number }[];
}

export interface GeoIntelligenceKPIs {
  topCountries: { country: string; count: number; percentage: number }[];
  topRegions: { region: string; country: string; count: number }[];
  topCities: { city: string; region: string; count: number; engagementScore: number }[];
  regionalConversion: { region: string; sessions: number; leads: number; rate: number }[];
  insights: string[];
}

export interface TimeZoneIntelligenceKPIs {
  peakActivityHour: number;
  peakCtaHour: number;
  peakLeadHour: number;
  hourlyDistribution: {
    hour: number;
    hourLabel: string;
    sessions: number;
    engagement: number;
    leads: number;
  }[];
  weekdayVsWeekend: { type: string; sessions: number; engagement: number }[];
  timezones: { timezone: string; count: number }[];
}

export interface NetworkIntelligenceKPIs {
  enterpriseNetworkSignals: number;
  suspiciousTraffic: number;
  botSignals: number;
  networkTypes: { type: string; count: number; percentage: number }[];
  topOrganizations: { organization: string; count: number; category: string }[];
  ispDistribution: { isp: string; count: number }[];
}

export interface IntelligenceDashboardData {
  totalSessions: number;
  uniqueVisitors: number;
  avgSessionTimeSeconds: number;
  bounceRatePercent: number;
  totalTraffic: number;
  ctaClicks: number;
  leads: number;
  conversionRatePercent: number;

  session: SessionIntelligenceKPIs;
  traffic: TrafficIntelligenceKPIs;
  geo: GeoIntelligenceKPIs;
  timeZone: TimeZoneIntelligenceKPIs;
  network: NetworkIntelligenceKPIs;

  recentEvents: IntelligenceEvent[];
  hasData: boolean;
}
