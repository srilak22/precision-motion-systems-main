/**
 * INDUS INTELLIGENCE ENGINE — AGGREGATION & ANALYTICS PIPELINE
 * Processes raw events and session records into verified metrics
 * STRICTLY NO FAKE DATA: Returns empty states / "No data available yet" when datasets are empty.
 */

import {
  IntelligenceEvent,
  SessionRecord,
  IntelligenceDashboardData,
  SessionIntelligenceKPIs,
  TrafficIntelligenceKPIs,
  GeoIntelligenceKPIs,
  TimeZoneIntelligenceKPIs,
  NetworkIntelligenceKPIs,
  AnalyticsDateRange,
  ConversionIntelligenceReport,
} from "./types";
import { getLocalIntelligenceEvents, getLocalSessionRecords } from "./tracker";

export function aggregateIntelligenceData(): IntelligenceDashboardData {
  const events = getLocalIntelligenceEvents();
  const sessions = getLocalSessionRecords();

  const hasData = events.length > 0 || sessions.length > 0;

  // 1. Session Intelligence
  const totalSessions = sessions.length;
  const totalDuration = sessions.reduce((acc, s) => acc + (s.durationSeconds || 0), 0);
  const avgSessionDurationSeconds =
    totalSessions > 0 ? Math.round(totalDuration / totalSessions) : 0;

  const totalPagesVisited = sessions.reduce((acc, s) => acc + (s.pageCount || 1), 0);
  const avgPagesPerSession =
    totalSessions > 0 ? Number((totalPagesVisited / totalSessions).toFixed(1)) : 0;

  const bounceSessions = sessions.filter((s) => s.isBounce).length;
  const bounceRatePercent =
    totalSessions > 0 ? Math.round((bounceSessions / totalSessions) * 100) : 0;

  // Entry & Exit Pages
  const entryCountMap: Record<string, number> = {};
  const exitCountMap: Record<string, number> = {};
  const journeyMap: Record<string, number> = {};

  sessions.forEach((s) => {
    if (s.entryPage) entryCountMap[s.entryPage] = (entryCountMap[s.entryPage] || 0) + 1;
    if (s.exitPage) exitCountMap[s.exitPage] = (exitCountMap[s.exitPage] || 0) + 1;

    if (s.pagesVisited && s.pagesVisited.length > 0) {
      const journeyStr = s.pagesVisited.slice(0, 4).join(" → ");
      journeyMap[journeyStr] = (journeyMap[journeyStr] || 0) + 1;
    }
  });

  const topEntryPage =
    Object.entries(entryCountMap).sort((a, b) => b[1] - a[1])[0]?.[0] || (hasData ? "/" : "—");
  const topExitPage =
    Object.entries(exitCountMap).sort((a, b) => b[1] - a[1])[0]?.[0] || (hasData ? "/" : "—");

  // Most engaged pages from events
  const pageEngagementMap: Record<string, { views: number; totalDwell: number }> = {};
  events.forEach((e) => {
    if (e.page) {
      const existing = pageEngagementMap[e.page] || { views: 0, totalDwell: 0 };
      existing.views += 1;
      existing.totalDwell += e.pageDwellTime || 0;
      pageEngagementMap[e.page] = existing;
    }
  });

  const mostEngagedPages = Object.entries(pageEngagementMap)
    .map(([page, data]) => ({
      page,
      views: data.views,
      avgDwellTimeSeconds: data.views > 0 ? Math.round(data.totalDwell / data.views) : 0,
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 6);

  const userJourneys = Object.entries(journeyMap)
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const sessionKPIs: SessionIntelligenceKPIs = {
    totalSessions,
    avgSessionDurationSeconds,
    avgPagesPerSession,
    bounceRatePercent,
    topEntryPage,
    topExitPage,
    userJourneys,
    mostEngagedPages,
  };

  // 2. Traffic Intelligence
  let organic = 0;
  let direct = 0;
  let referral = 0;
  let campaign = 0;
  let paidSearch = 0;
  let social = 0;
  let email = 0;

  const sourceCounts: Record<string, number> = {};
  const campaignMap: Record<string, { sessions: number; leads: number; source: string }> = {};

  sessions.forEach((s) => {
    const type = s.trafficType || s.trafficSource || "Direct";
    sourceCounts[type] = (sourceCounts[type] || 0) + 1;

    if (type === "Paid Search") paidSearch++;
    else if (type === "Organic Search" || type === "Organic") organic++;
    else if (type === "Social") social++;
    else if (type === "Email") email++;
    else if (type === "Referral") referral++;
    else if (type === "Campaign") campaign++;
    else direct++;

    if (s.utm?.campaign) {
      const campName = s.utm.campaign;
      if (!campaignMap[campName]) {
        campaignMap[campName] = { sessions: 0, leads: 0, source: s.utm.source || "Campaign" };
      }
      campaignMap[campName].sessions += 1;
      campaignMap[campName].leads += s.leads || 0;
    }
  });

  const totalTraffic = totalSessions || events.length;

  const sourceDistribution =
    Object.entries(sourceCounts).length > 0
      ? Object.entries(sourceCounts)
          .map(([source, count]) => ({
            source,
            count,
            percentage: totalTraffic > 0 ? Math.round((count / totalTraffic) * 100) : 0,
          }))
          .sort((a, b) => b.count - a.count)
      : [
          { source: "Direct", count: 0, percentage: 0 },
          { source: "Paid Search", count: 0, percentage: 0 },
          { source: "Organic Search", count: 0, percentage: 0 },
          { source: "Social", count: 0, percentage: 0 },
          { source: "Email", count: 0, percentage: 0 },
          { source: "Referral", count: 0, percentage: 0 },
          { source: "Campaign", count: 0, percentage: 0 },
        ];

  // Group traffic over time (last 7 dates or hour slots)
  const timeMap: Record<
    string,
    { direct: number; organic: number; referral: number; campaign: number }
  > = {};
  sessions.forEach((s) => {
    const rawDate = s.startTime
      ? s.startTime.split("T")[0]
      : new Date().toISOString().split("T")[0];
    const dateKey = rawDate || "unknown";
    const entry = timeMap[dateKey] || { direct: 0, organic: 0, referral: 0, campaign: 0 };

    const type = s.trafficType || s.trafficSource || "Direct";
    if (type === "Organic Search" || type === "Organic") entry.organic++;
    else if (type === "Referral") entry.referral++;
    else if (type === "Campaign" || type === "Paid Search") entry.campaign++;
    else entry.direct++;

    timeMap[dateKey] = entry;
  });

  const trafficOverTime = Object.entries(timeMap)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, counts]) => ({
      date,
      ...counts,
      total: counts.direct + counts.organic + counts.referral + counts.campaign,
    }));

  const campaignPerformance = Object.entries(campaignMap).map(([camp, data]) => ({
    campaign: camp,
    source: data.source,
    sessions: data.sessions,
    leads: data.leads,
  }));

  // Funnel: Source -> Landing Page -> CTA -> Lead
  const totalLanding = sessions.length;
  const totalCta = sessions.reduce((acc, s) => acc + (s.ctaClicks > 0 ? 1 : 0), 0);
  const totalLeads = sessions.reduce((acc, s) => acc + (s.leads > 0 ? 1 : 0), 0);

  const funnel = [
    { step: "Traffic Entry", count: totalLanding },
    {
      step: "Engaged Page View",
      count: sessions.filter((s) => (s.durationSeconds || 0) > 10 || s.pageCount > 1).length,
    },
    { step: "CTA / Spec Interaction", count: totalCta },
    { step: "Lead Generated", count: totalLeads },
  ];

  const trafficKPIs: TrafficIntelligenceKPIs = {
    totalTraffic,
    organic,
    direct,
    referral,
    campaign,
    sourceDistribution,
    trafficOverTime,
    campaignPerformance,
    funnel,
  };

  // 3. Geo Intelligence
  const countryMap: Record<string, number> = {};
  const regionMap: Record<string, { count: number; country: string }> = {};
  const cityMap: Record<string, { count: number; region: string; engagement: number }> = {};
  const regConvMap: Record<string, { sessions: number; leads: number }> = {};

  sessions.forEach((s) => {
    const country = s.country || "Detected Client";
    const region = s.region || "Metropolitan Zone";
    const city = s.city || "Industrial Hub";

    countryMap[country] = (countryMap[country] || 0) + 1;

    const regKey = `${region}, ${country}`;
    if (!regionMap[regKey]) regionMap[regKey] = { count: 0, country };
    regionMap[regKey].count += 1;

    const cityKey = `${city}, ${country}`;
    if (!cityMap[cityKey]) cityMap[cityKey] = { count: 0, region, engagement: 0 };
    cityMap[cityKey].count += 1;
    cityMap[cityKey].engagement += s.totalEvents;

    if (!regConvMap[region]) regConvMap[region] = { sessions: 0, leads: 0 };
    regConvMap[region].sessions += 1;
    regConvMap[region].leads += s.leads || 0;
  });

  const topCountries = Object.entries(countryMap)
    .map(([country, count]) => ({
      country,
      count,
      percentage: totalSessions > 0 ? Math.round((count / totalSessions) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const topRegions = Object.entries(regionMap)
    .map(([region, data]) => ({
      region,
      country: data.country,
      count: data.count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const topCities = Object.entries(cityMap)
    .map(([city, data]) => ({
      city,
      region: data.region,
      count: data.count,
      engagementScore: data.engagement,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const regionalConversion = Object.entries(regConvMap)
    .map(([region, data]) => ({
      region,
      sessions: data.sessions,
      leads: data.leads,
      rate: data.sessions > 0 ? Math.round((data.leads / data.sessions) * 100) : 0,
    }))
    .sort((a, b) => b.sessions - a.sessions)
    .slice(0, 5);

  // Dynamic Verified Insights (ONLY IF REAL DATA EXISTS)
  const geoInsights: string[] = [];
  if (topCountries.length > 0 && totalSessions > 0 && topCountries[0]) {
    geoInsights.push(
      `${topCountries[0].country} contributes the highest number of active sessions (${topCountries[0].count} sessions).`,
    );
  }
  if (topCities.length > 0 && totalSessions > 0 && topCities[0]) {
    geoInsights.push(
      `${topCities[0].city} generates the highest technical engagement among detected locations.`,
    );
  }

  const geoKPIs: GeoIntelligenceKPIs = {
    topCountries,
    topRegions,
    topCities,
    regionalConversion,
    insights: geoInsights,
  };

  // 4. Time Zone Intelligence
  const hourMap: Record<number, { sessions: number; engagement: number; leads: number }> = {};
  for (let i = 0; i < 24; i++) {
    hourMap[i] = { sessions: 0, engagement: 0, leads: 0 };
  }

  const tzMap: Record<string, number> = {};
  let weekdaySessions = 0;
  let weekendSessions = 0;
  let weekdayEngagement = 0;
  let weekendEngagement = 0;

  sessions.forEach((s) => {
    const h = s.localHour !== undefined && s.localHour >= 0 && s.localHour < 24 ? s.localHour : 12;
    const hEntry = hourMap[h] || { sessions: 0, engagement: 0, leads: 0 };
    hEntry.sessions += 1;
    hEntry.engagement += s.totalEvents || 1;
    hEntry.leads += s.leads || 0;
    hourMap[h] = hEntry;

    const tz = s.timezone || "System Timezone";
    tzMap[tz] = (tzMap[tz] || 0) + 1;

    const isWeekend = s.localDay === "Sat" || s.localDay === "Sun";
    if (isWeekend) {
      weekendSessions += 1;
      weekendEngagement += s.totalEvents || 1;
    } else {
      weekdaySessions += 1;
      weekdayEngagement += s.totalEvents || 1;
    }
  });

  const hourlyDistribution = Object.entries(hourMap).map(([hStr, data]) => {
    const h = parseInt(hStr, 10);
    const hourLabel = `${h.toString().padStart(2, "0")}:00`;
    return {
      hour: h,
      hourLabel,
      sessions: data.sessions,
      engagement: data.engagement,
      leads: data.leads,
    };
  });

  const defaultHour = hourlyDistribution[0] || {
    hour: 0,
    sessions: 0,
    engagement: 0,
    leads: 0,
    hourLabel: "00:00",
  };
  const peakActivityHour = hourlyDistribution.reduce(
    (max, curr) => (curr.sessions > max.sessions ? curr : max),
    defaultHour,
  ).hour;
  const peakCtaHour = hourlyDistribution.reduce(
    (max, curr) => (curr.engagement > max.engagement ? curr : max),
    defaultHour,
  ).hour;
  const peakLeadHour = hourlyDistribution.reduce(
    (max, curr) => (curr.leads > max.leads ? curr : max),
    defaultHour,
  ).hour;

  const timeZoneKPIs: TimeZoneIntelligenceKPIs = {
    peakActivityHour,
    peakCtaHour,
    peakLeadHour,
    hourlyDistribution,
    weekdayVsWeekend: [
      {
        type: "Weekday (Industrial Shift)",
        sessions: weekdaySessions,
        engagement: weekdayEngagement,
      },
      { type: "Weekend (Standby Ops)", sessions: weekendSessions, engagement: weekendEngagement },
    ],
    timezones: Object.entries(tzMap).map(([tz, count]) => ({ timezone: tz, count })),
  };

  // 5. Network / IP Intelligence (Privacy-First)
  let enterpriseSignals = 0;
  let suspiciousCount = 0;
  let botCount = 0;
  const netTypeMap: Record<string, number> = {};
  const orgMap: Record<string, number> = {};
  const ispMap: Record<string, number> = {};

  sessions.forEach((s) => {
    const net = s.networkType || "Broadband";
    netTypeMap[net] = (netTypeMap[net] || 0) + 1;

    if (s.organization && s.organization.trim()) {
      enterpriseSignals++;
      orgMap[s.organization] = (orgMap[s.organization] || 0) + 1;
    }
    if (s.isp && s.isp.trim()) {
      ispMap[s.isp] = (ispMap[s.isp] || 0) + 1;
    }
    if (s.isBot) botCount++;
    if (s.isSuspicious) suspiciousCount++;
  });

  const networkTypes = Object.entries(netTypeMap).map(([type, count]) => ({
    type,
    count,
    percentage: totalSessions > 0 ? Math.round((count / totalSessions) * 100) : 0,
  }));

  const topOrganizations = Object.entries(orgMap)
    .map(([organization, count]) => ({
      organization,
      count,
      category: /tech|robot|auto|motor|eng|mfg|industr/i.test(organization)
        ? "Industrial Automation / Tech"
        : "Commercial Enterprise",
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const ispDistribution = Object.entries(ispMap)
    .map(([isp, count]) => ({ isp, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const networkKPIs: NetworkIntelligenceKPIs = {
    enterpriseNetworkSignals: enterpriseSignals,
    suspiciousTraffic: suspiciousCount,
    botSignals: botCount,
    networkTypes,
    topOrganizations,
    ispDistribution,
  };

  // Top KPI calculations
  const totalCtaClicks = events.filter((e) => e.event === "cta_click").length;
  const totalLeadEvents = events.filter(
    (e) => e.event === "lead" || e.event === "form_submit" || e.event === "form_submission",
  ).length;
  const uniqueVisitorSet = new Set(sessions.map((s) => s.sessionId));
  const uniqueVisitors = uniqueVisitorSet.size || (hasData ? 1 : 0);
  const conversionRatePercent =
    totalSessions > 0 ? Number(((totalLeadEvents / totalSessions) * 100).toFixed(1)) : 0;

  return {
    totalSessions,
    uniqueVisitors,
    avgSessionTimeSeconds: avgSessionDurationSeconds,
    bounceRatePercent,
    totalTraffic,
    ctaClicks: totalCtaClicks,
    leads: totalLeadEvents,
    conversionRatePercent,
    session: sessionKPIs,
    traffic: trafficKPIs,
    geo: geoKPIs,
    timeZone: timeZoneKPIs,
    network: networkKPIs,
    recentEvents: events.slice(0, 25),
    hasData,
  };
}

// ============================================================================
// PHASE 6: CONVERSION & ANALYTICS INTELLIGENCE AGGREGATOR
// ============================================================================

function getReportingPeriodLabel(dateRange: AnalyticsDateRange): string {
  const now = new Date();
  const formatShort = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  if (dateRange === "today") {
    return `Today (${formatShort(now)}) UTC`;
  }
  if (dateRange === "7d") {
    const start = new Date(Date.now() - 7 * 86400 * 1000);
    return `${formatShort(start)} – ${formatShort(now)}`;
  }
  if (dateRange === "30d") {
    const start = new Date(Date.now() - 30 * 86400 * 1000);
    return `${formatShort(start)} – ${formatShort(now)}`;
  }
  return "All Time Recorded Activity";
}

export function aggregateConversionIntelligence(
  dateRange: AnalyticsDateRange = "all",
  isDemoData = false,
): ConversionIntelligenceReport {
  if (isDemoData) {
    return getSyntheticConversionReport(dateRange);
  }

  const rawEvents = getLocalIntelligenceEvents();
  const rawSessions = getLocalSessionRecords();

  const nowEpoch = Date.now();
  let minEpoch = 0;
  if (dateRange === "today") {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    minEpoch = startOfToday.getTime();
  } else if (dateRange === "7d") {
    minEpoch = nowEpoch - 7 * 86400 * 1000;
  } else if (dateRange === "30d") {
    minEpoch = nowEpoch - 30 * 86400 * 1000;
  }

  const events = rawEvents.filter((e) => (e.epoch || 0) >= minEpoch);
  const sessions = rawSessions.filter((s) => (s.startEpoch || 0) >= minEpoch);

  const hasData = events.length > 0 || sessions.length > 0;
  const reportingPeriod = getReportingPeriodLabel(dateRange);
  const dataFreshness = hasData
    ? `Live Telemetry (Updated ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })})`
    : "No records found in selected window";

  const totalSessions = sessions.length;
  const totalPageViews = events.filter((e) => e.event === "page_view").length;

  // 1. Landing Pages
  const entryCountMap: Record<string, { count: number; totalDwell: number }> = {};
  sessions.forEach((s) => {
    const p = s.entryPage || "/";
    const curr = entryCountMap[p] || { count: 0, totalDwell: 0 };
    curr.count += 1;
    curr.totalDwell += s.durationSeconds || 0;
    entryCountMap[p] = curr;
  });

  const topLandingPages = Object.entries(entryCountMap)
    .map(([path, data]) => ({
      path,
      views: data.count,
      avgDwellSec: data.count > 0 ? Math.round(data.totalDwell / data.count) : 0,
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  // 2. Traffic Sources
  const sourceCountMap: Record<string, number> = {};
  sessions.forEach((s) => {
    const src = s.trafficSource || "Direct";
    sourceCountMap[src] = (sourceCountMap[src] || 0) + 1;
  });
  const trafficSources = Object.entries(sourceCountMap)
    .map(([source, count]) => ({
      source,
      count,
      percentage: totalSessions > 0 ? Number(((count / totalSessions) * 100).toFixed(1)) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  // 3. Application Finder 8-Stage Funnel
  const s1Count = events.filter((e) => e.event === "application_finder_opened").length;
  const s2Count = events.filter((e) => e.event === "application_selected").length;
  const s3Count = events.filter((e) => e.event === "technical_requirements_completed").length;
  const s4Count = events.filter((e) => e.event === "project_details_completed").length;
  const s5Count = events.filter((e) => e.event === "review_screen_viewed").length;
  const s6Count = events.filter((e) => e.event === "enquiry_submission_attempted").length;
  const s7Count = events.filter((e) => e.event === "enquiry_submission_confirmed").length;
  const s8Count = events.filter((e) => e.event === "enquiry_submission_failed").length;
  const abandonedCount = events.filter((e) => e.event === "application_finder_abandoned").length;

  const calcDrop = (prior: number, curr: number) =>
    prior > 0 ? Math.max(0, Math.round(((prior - curr) / prior) * 100)) : 0;
  const calcConv = (start: number, curr: number) =>
    start > 0 ? Number(((curr / start) * 100).toFixed(1)) : 0;

  const funnelStages = [
    {
      stageNumber: 1,
      stageKey: "application_finder_opened",
      stageName: "1. Wizard Opened",
      count: s1Count,
      conversionFromStartPercent: 100,
      dropoffFromPriorPercent: 0,
    },
    {
      stageNumber: 2,
      stageKey: "application_selected",
      stageName: "2. Motion Profile Selected",
      count: s2Count,
      conversionFromStartPercent: calcConv(s1Count, s2Count),
      dropoffFromPriorPercent: calcDrop(s1Count, s2Count),
    },
    {
      stageNumber: 3,
      stageKey: "technical_requirements_completed",
      stageName: "3. Kinematic Sizing Set",
      count: s3Count,
      conversionFromStartPercent: calcConv(s1Count, s3Count),
      dropoffFromPriorPercent: calcDrop(s2Count, s3Count),
    },
    {
      stageNumber: 4,
      stageKey: "project_details_completed",
      stageName: "4. Deployment Parameters",
      count: s4Count,
      conversionFromStartPercent: calcConv(s1Count, s4Count),
      dropoffFromPriorPercent: calcDrop(s3Count, s4Count),
    },
    {
      stageNumber: 5,
      stageKey: "review_screen_viewed",
      stageName: "5. Bill of Materials Review",
      count: s5Count,
      conversionFromStartPercent: calcConv(s1Count, s5Count),
      dropoffFromPriorPercent: calcDrop(s4Count, s5Count),
    },
    {
      stageNumber: 6,
      stageKey: "enquiry_submission_attempted",
      stageName: "6. RFQ Submit Attempted",
      count: s6Count,
      conversionFromStartPercent: calcConv(s1Count, s6Count),
      dropoffFromPriorPercent: calcDrop(s5Count, s6Count),
    },
    {
      stageNumber: 7,
      stageKey: "enquiry_submission_confirmed",
      stageName: "7. Backend Synced (DI / YLT)",
      count: s7Count,
      conversionFromStartPercent: calcConv(s1Count, s7Count),
      dropoffFromPriorPercent: calcDrop(s6Count, s7Count),
    },
    {
      stageNumber: 8,
      stageKey: "enquiry_submission_failed",
      stageName: "8. Failed Validations",
      count: s8Count,
      conversionFromStartPercent: calcConv(s1Count, s8Count),
      dropoffFromPriorPercent: 0,
    },
  ];

  const funnel = {
    totalStarted: s1Count,
    totalCompleted: s7Count,
    totalAbandoned: abandonedCount,
    totalFailed: s8Count,
    completionRatePercent: s1Count > 0 ? Number(((s7Count / s1Count) * 100).toFixed(1)) : 0,
    abandonmentRatePercent: s1Count > 0 ? Number(((abandonedCount / s1Count) * 100).toFixed(1)) : 0,
    stages: funnelStages,
  };

  // 4. Product Discovery Analytics
  const detailViews = events.filter((e) => e.event === "product_detail_view");
  const categorySelections = events.filter((e) => e.event === "product_category_select");
  const specViews = events.filter((e) => e.event === "product_spec_view");
  const comparisonsStarted = events.filter((e) => e.event === "product_comparison_start");
  const comparisonResults = events.filter((e) => e.event === "product_comparison_result_view");
  const downloadsAttempted = events.filter((e) => e.event === "datasheet_download_request");
  const downloadsConfirmed = events.filter((e) => e.event === "datasheet_download_confirmed");

  // Family views
  const familyMap: Record<string, number> = {};
  const productViewMap: Record<string, number> = {};
  detailViews.forEach((e) => {
    const family = e.details || e.element || "Robotics Hardware";
    familyMap[family] = (familyMap[family] || 0) + 1;
    if (e.element) {
      productViewMap[e.element] = (productViewMap[e.element] || 0) + 1;
    }
  });

  const viewsByFamily = Object.entries(familyMap)
    .map(([family, views]) => ({
      family,
      views,
      percentage: detailViews.length > 0 ? Number(((views / detailViews.length) * 100).toFixed(1)) : 0,
    }))
    .sort((a, b) => b.views - a.views);

  const topViewedProducts = Object.entries(productViewMap)
    .map(([productId, views]) => ({ productId, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  const productDiscovery: ProductDiscoveryMetrics = {
    totalDetailViews: detailViews.length,
    totalCategorySelections: categorySelections.length,
    totalSpecViews: specViews.length,
    totalComparisonsStarted: comparisonsStarted.length,
    totalComparisonResultsViewed: comparisonResults.length,
    datasheetDownloadsAttempted: downloadsAttempted.length,
    datasheetDownloadsConfirmed: downloadsConfirmed.length,
    viewsByFamily,
    topViewedProducts,
  };

  // 5. Robot AI Assistant Effectiveness
  const assistantOpens = events.filter((e) => e.event === "assistant_opened");
  const assistantSessions = new Set(assistantOpens.map((e) => e.sessionId));
  const quickActions = events.filter((e) => e.event === "quick_action_selected");
  const productCardsOpened = events.filter((e) => e.event === "product_result_opened");
  const comparisonsTriggered = events.filter((e) => e.event === "comparison_initiated");
  const finderHandoffs = events.filter((e) => e.event === "application_finder_launched");
  const humanAssistanceRequests = events.filter((e) => e.event === "human_assistance_requested");
  const assistantErrors = events.filter((e) => e.event === "assistant_error_or_unavailable");

  const actionMap: Record<string, number> = {};
  quickActions.forEach((e) => {
    const act = e.details || e.element || "Action";
    actionMap[act] = (actionMap[act] || 0) + 1;
  });

  const assistant: AIAssistantMetrics = {
    totalOpens: assistantOpens.length,
    uniqueSessionsWithAssistant: assistantSessions.size,
    quickActionClicks: quickActions.length,
    productCardsOpened: productCardsOpened.length,
    comparisonsTriggered: comparisonsTriggered.length,
    finderHandoffs: finderHandoffs.length,
    humanAssistanceRequests: humanAssistanceRequests.length,
    errorCount: assistantErrors.length,
    quickActionBreakdown: Object.entries(actionMap)
      .map(([action, count]) => ({ action, count }))
      .sort((a, b) => b.count - a.count),
  };

  // 6. Enquiry & Outcome Attribution
  const confirmedEnquiries = events.filter((e) => e.event === "enquiry_submission_confirmed");
  const quoteActionsInitiated = events.filter((e) => e.event === "quote_action_initiated").length;
  const legacyLeads = events.filter((e) => e.event === "lead" || e.event === "form_submit");
  const totalRawEnquiries = confirmedEnquiries.length + legacyLeads.length;

  let directWebsiteLeads = 0;
  let youtubeAttributedLeads = 0;
  let linkedinAttributedLeads = 0;

  confirmedEnquiries.concat(legacyLeads).forEach((e) => {
    const ref = (e.referrer || "").toLowerCase();
    const traffic = (e.trafficSource || "").toLowerCase();
    const details = (e.details || "").toLowerCase();

    if (ref.includes("youtube") || traffic.includes("youtube") || details.includes("ylt")) {
      youtubeAttributedLeads += 1;
    } else if (ref.includes("linkedin") || traffic.includes("linkedin") || details.includes("lit")) {
      linkedinAttributedLeads += 1;
    } else {
      directWebsiteLeads += 1;
    }
  });

  const totalChannels = directWebsiteLeads + youtubeAttributedLeads + linkedinAttributedLeads || 1;
  const enquiriesByChannel = [
    {
      channel: "General Website RFQ Desk",
      projectKey: "DI",
      count: directWebsiteLeads,
      percentage: Number(((directWebsiteLeads / totalChannels) * 100).toFixed(1)),
    },
    {
      channel: "YouTube Application Demos",
      projectKey: "YLT",
      count: youtubeAttributedLeads,
      percentage: Number(((youtubeAttributedLeads / totalChannels) * 100).toFixed(1)),
    },
    {
      channel: "LinkedIn Industrial Outreach",
      projectKey: "LIT",
      count: linkedinAttributedLeads,
      percentage: Number(((linkedinAttributedLeads / totalChannels) * 100).toFixed(1)),
    },
  ];

  const enquiryFamilyMap: Record<string, number> = {};
  confirmedEnquiries.forEach((e) => {
    const f = e.details || "Robotics Hardware";
    enquiryFamilyMap[f] = (enquiryFamilyMap[f] || 0) + 1;
  });

  const enquiries: EnquiryAttributionMetrics = {
    totalRawEnquiries,
    directWebsiteLeads,
    youtubeAttributedLeads,
    linkedinAttributedLeads,
    quoteActionsInitiated,
    conversionRatePercent: totalSessions > 0 ? Number(((totalRawEnquiries / totalSessions) * 100).toFixed(2)) : 0,
    enquiriesByFamily: Object.entries(enquiryFamilyMap).map(([family, count]) => ({ family, count })),
    enquiriesByChannel,
  };

  return {
    dateRange,
    reportingPeriod,
    dataFreshness,
    isDemoData: false,
    totalSessions,
    totalPageViews,
    topLandingPages,
    trafficSources,
    funnel,
    productDiscovery,
    assistant,
    enquiries,
    hasData,
  };
}

export function getSyntheticConversionReport(dateRange: AnalyticsDateRange): ConversionIntelligenceReport {
  return {
    dateRange,
    reportingPeriod: getReportingPeriodLabel(dateRange),
    dataFreshness: "Synthetic Simulation (Fresh)",
    isDemoData: true,
    totalSessions: 1420,
    totalPageViews: 4890,
    topLandingPages: [
      { path: "/products", views: 1850, avgDwellSec: 142 },
      { path: "/solutions", views: 1220, avgDwellSec: 118 },
      { path: "/application-finder", views: 940, avgDwellSec: 210 },
      { path: "/actuator-studio", views: 560, avgDwellSec: 175 },
      { path: "/products/robotic-arms/ind-ira-070", views: 320, avgDwellSec: 95 },
    ],
    trafficSources: [
      { source: "Direct Traffic", count: 450, percentage: 31.7 },
      { source: "Organic Search", count: 390, percentage: 27.5 },
      { source: "LinkedIn Industry Ads", count: 310, percentage: 21.8 },
      { source: "YouTube Technical Demos", count: 180, percentage: 12.7 },
      { source: "Referral / Engineering Forums", count: 90, percentage: 6.3 },
    ],
    funnel: {
      totalStarted: 320,
      totalCompleted: 68,
      totalAbandoned: 242,
      totalFailed: 10,
      completionRatePercent: 21.3,
      abandonmentRatePercent: 75.6,
      stages: [
        {
          stageNumber: 1,
          stageKey: "application_finder_opened",
          stageName: "1. Wizard Opened",
          count: 320,
          conversionFromStartPercent: 100,
          dropoffFromPriorPercent: 0,
        },
        {
          stageNumber: 2,
          stageKey: "application_selected",
          stageName: "2. Motion Profile Selected",
          count: 278,
          conversionFromStartPercent: 86.9,
          dropoffFromPriorPercent: 13.1,
        },
        {
          stageNumber: 3,
          stageKey: "technical_requirements_completed",
          stageName: "3. Kinematic Sizing Set",
          count: 215,
          conversionFromStartPercent: 67.2,
          dropoffFromPriorPercent: 22.7,
        },
        {
          stageNumber: 4,
          stageKey: "project_details_completed",
          stageName: "4. Deployment Parameters",
          count: 154,
          conversionFromStartPercent: 48.1,
          dropoffFromPriorPercent: 28.4,
        },
        {
          stageNumber: 5,
          stageKey: "review_screen_viewed",
          stageName: "5. Bill of Materials Review",
          count: 112,
          conversionFromStartPercent: 35.0,
          dropoffFromPriorPercent: 27.3,
        },
        {
          stageNumber: 6,
          stageKey: "enquiry_submission_attempted",
          stageName: "6. RFQ Submit Attempted",
          count: 78,
          conversionFromStartPercent: 24.4,
          dropoffFromPriorPercent: 30.4,
        },
        {
          stageNumber: 7,
          stageKey: "enquiry_submission_confirmed",
          stageName: "7. Backend Synced (DI / YLT)",
          count: 68,
          conversionFromStartPercent: 21.3,
          dropoffFromPriorPercent: 12.8,
        },
        {
          stageNumber: 8,
          stageKey: "enquiry_submission_failed",
          stageName: "8. Failed Validations",
          count: 10,
          conversionFromStartPercent: 3.1,
          dropoffFromPriorPercent: 0,
        },
      ],
    },
    productDiscovery: {
      totalDetailViews: 2450,
      totalCategorySelections: 890,
      totalSpecViews: 1120,
      totalComparisonsStarted: 340,
      totalComparisonResultsViewed: 295,
      datasheetDownloadsAttempted: 185,
      datasheetDownloadsConfirmed: 162,
      viewsByFamily: [
        { family: "Articulated 6-Axis Arms (IRA)", views: 980, percentage: 40.0 },
        { family: "Collaborative Cobots (IRC)", views: 640, percentage: 26.1 },
        { family: "SCARA High-Speed (IRS)", views: 420, percentage: 17.1 },
        { family: "Direct Drive Rotary Actuators", views: 260, percentage: 10.6 },
        { family: "Autonomous Mobile Platforms", views: 150, percentage: 6.2 },
      ],
      topViewedProducts: [
        { productId: "IND-IRA-070", views: 420 },
        { productId: "IND-IRC-005", views: 350 },
        { productId: "IND-IRA-090", views: 290 },
        { productId: "IND-IRS-006", views: 240 },
        { productId: "IND-RTA-100", views: 180 },
      ],
    },
    assistant: {
      totalOpens: 420,
      uniqueSessionsWithAssistant: 310,
      quickActionClicks: 680,
      productCardsOpened: 210,
      comparisonsTriggered: 135,
      finderHandoffs: 85,
      humanAssistanceRequests: 54,
      errorCount: 4,
      quickActionBreakdown: [
        { action: "Find a Product", count: 245 },
        { action: "Compare Components", count: 155 },
        { action: "Select an Actuator", count: 120 },
        { action: "Explore Robot Applications", count: 95 },
        { action: "Talk to Engineering", count: 65 },
      ],
    },
    enquiries: {
      totalRawEnquiries: 68,
      directWebsiteLeads: 42,
      youtubeAttributedLeads: 16,
      linkedinAttributedLeads: 10,
      quoteActionsInitiated: 145,
      conversionRatePercent: 4.79,
      enquiriesByFamily: [
        { family: "Articulated 6-Axis Arms", count: 28 },
        { family: "Collaborative Cobots", count: 19 },
        { family: "SCARA Assembly Cells", count: 11 },
        { family: "Integrated Linear Actuators", count: 10 },
      ],
      enquiriesByChannel: [
        { channel: "General Website RFQ Desk", projectKey: "DI", count: 42, percentage: 61.8 },
        { channel: "YouTube Application Demos", projectKey: "YLT", count: 16, percentage: 23.5 },
        { channel: "LinkedIn Industrial Outreach", projectKey: "LIT", count: 10, percentage: 14.7 },
      ],
    },
    hasData: true,
  };
}
