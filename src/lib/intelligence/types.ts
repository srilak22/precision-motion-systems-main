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
  country?: string;
  countryCode?: string;
  region?: string;
  city?: string;
  timezone?: string;
  latitude?: number;
  longitude?: number;
  geoProvider?: string;
}

export interface NetworkData {
  ipVersion?: string; // IPv4 | IPv6
  maskedIp?: string; // 192.168.1.xxx (GDPR-safe)
  networkId?: string; // Subnet identifier
  networkType?: string; // 4G, 5G, WiFi, Broadband, Ethernet
  organization?: string;
  isp?: string;
  asn?: string;
  isDataCenter?: boolean;
  isProxyVpn?: boolean;
  isBot?: boolean;
  networkRiskSignal?: "NORMAL" | "UNUSUAL" | "NEEDS REVIEW" | "POTENTIAL AUTOMATION";
  supportingSignals?: string;
}

export interface IntelligenceEvent {
  id: string;
  sessionId: string;
  timestamp: string; // ISO 8601
  epoch: number;
  event: string; // page_view, cta_click, form_submit, lead, download, search, whatsapp_click, scroll, etc.
  element?: string;
  details?: string;
  page: string;
  url: string;
  referrer: string;
  device: "Desktop" | "Tablet" | "Mobile";
  browser?: string;
  operatingSystem?: string;
  screen: string;
  visitorType: "New Visitor" | "Returning Visitor";
  
  // Time Zone Intelligence
  timezone: string;
  utcOffset?: string;
  localTimestamp?: string;
  localHour: number; // 0 - 23
  localDay: string; // Mon, Tue, etc.
  localDate: string; // YYYY-MM-DD
  dayOfWeek?: string;
  isWeekend?: string;
  timeOfDayBucket?: string;
  isBusinessHours?: string;
  
  // Session Intelligence
  sessionDuration: number; // in seconds
  pageDwellTime: number; // in seconds
  
  // Traffic Intelligence
  trafficType?: string;
  trafficSource: TrafficSourceType;
  trafficMedium?: string;
  trafficChannel?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;

  // Geo Intelligence (Privacy-Safe: Country, Region, City)
  country?: string;
  countryCode?: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  geoProvider?: string;

  // Network / IP Intelligence (Privacy-Safe: No Raw IPs)
  ipVersion?: string;
  maskedIp?: string;
  networkId?: string;
  networkType?: string;
  organization?: string;
  isp?: string;
  asn?: string;
  isDataCenter?: boolean;
  isProxyVpn?: boolean;
  isBot?: boolean;
  networkRiskSignal?: string;
  supportingSignals?: string;
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
  trafficType?: string;
  trafficSource: TrafficSourceType;
  trafficMedium?: string;
  trafficChannel?: string;
  referrer: string;
  utm: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };

  // Geo
  country?: string;
  region?: string;
  city?: string;

  // Time
  timezone: string;
  localHour: number;
  localDay: string;

  // Network
  networkType?: string;
  organization?: string;
  isp?: string;
  asn?: string;
  isBot?: boolean;
  isSuspicious?: boolean;
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
  trafficOverTime: { date: string; direct: number; organic: number; referral: number; campaign: number; total: number }[];
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
  hourlyDistribution: { hour: number; hourLabel: string; sessions: number; engagement: number; leads: number }[];
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
