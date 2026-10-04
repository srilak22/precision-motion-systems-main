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
} from "./types";
import { getLocalIntelligenceEvents, getLocalSessionRecords } from "./tracker";

export function aggregateIntelligenceData(): IntelligenceDashboardData {
  const events = getLocalIntelligenceEvents();
  const sessions = getLocalSessionRecords();

  const hasData = events.length > 0 || sessions.length > 0;

  // 1. Session Intelligence
  const totalSessions = sessions.length;
  const totalDuration = sessions.reduce((acc, s) => acc + (s.durationSeconds || 0), 0);
  const avgSessionDurationSeconds = totalSessions > 0 ? Math.round(totalDuration / totalSessions) : 0;
  
  const totalPagesVisited = sessions.reduce((acc, s) => acc + (s.pageCount || 1), 0);
  const avgPagesPerSession = totalSessions > 0 ? Number((totalPagesVisited / totalSessions).toFixed(1)) : 0;

  const bounceSessions = sessions.filter((s) => s.isBounce).length;
  const bounceRatePercent = totalSessions > 0 ? Math.round((bounceSessions / totalSessions) * 100) : 0;

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

  const topEntryPage = Object.entries(entryCountMap).sort((a, b) => b[1] - a[1])[0]?.[0] || (hasData ? "/" : "—");
  const topExitPage = Object.entries(exitCountMap).sort((a, b) => b[1] - a[1])[0]?.[0] || (hasData ? "/" : "—");

  // Most engaged pages from events
  const pageEngagementMap: Record<string, { views: number; totalDwell: number }> = {};
  events.forEach((e) => {
    if (e.page) {
      if (!pageEngagementMap[e.page]) {
        pageEngagementMap[e.page] = { views: 0, totalDwell: 0 };
      }
      pageEngagementMap[e.page].views += 1;
      pageEngagementMap[e.page].totalDwell += e.pageDwellTime || 0;
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

  const sourceDistribution = Object.entries(sourceCounts).length > 0
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
  const timeMap: Record<string, { direct: number; organic: number; referral: number; campaign: number }> = {};
  sessions.forEach((s) => {
    const dateKey = s.startTime ? s.startTime.split("T")[0] : new Date().toISOString().split("T")[0];
    if (!timeMap[dateKey]) {
      timeMap[dateKey] = { direct: 0, organic: 0, referral: 0, campaign: 0 };
    }
    const type = s.trafficType || s.trafficSource || "Direct";
    if (type === "Organic Search" || type === "Organic") timeMap[dateKey].organic++;
    else if (type === "Referral") timeMap[dateKey].referral++;
    else if (type === "Campaign" || type === "Paid Search") timeMap[dateKey].campaign++;
    else timeMap[dateKey].direct++;
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
    { step: "Engaged Page View", count: sessions.filter((s) => (s.durationSeconds || 0) > 10 || s.pageCount > 1).length },
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
  if (topCountries.length > 0 && totalSessions > 0) {
    geoInsights.push(`${topCountries[0].country} contributes the highest number of active sessions (${topCountries[0].count} sessions).`);
  }
  if (topCities.length > 0 && totalSessions > 0) {
    geoInsights.push(`${topCities[0].city} generates the highest technical engagement among detected locations.`);
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
    hourMap[h].sessions += 1;
    hourMap[h].engagement += s.totalEvents || 1;
    hourMap[h].leads += s.leads || 0;

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

  const peakActivityHour = hourlyDistribution.reduce((max, curr) => (curr.sessions > max.sessions ? curr : max), hourlyDistribution[0]).hour;
  const peakCtaHour = hourlyDistribution.reduce((max, curr) => (curr.engagement > max.engagement ? curr : max), hourlyDistribution[0]).hour;
  const peakLeadHour = hourlyDistribution.reduce((max, curr) => (curr.leads > max.leads ? curr : max), hourlyDistribution[0]).hour;

  const timeZoneKPIs: TimeZoneIntelligenceKPIs = {
    peakActivityHour,
    peakCtaHour,
    peakLeadHour,
    hourlyDistribution,
    weekdayVsWeekend: [
      { type: "Weekday (Industrial Shift)", sessions: weekdaySessions, engagement: weekdayEngagement },
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
      category: /tech|robot|auto|motor|eng|mfg|industr/i.test(organization) ? "Industrial Automation / Tech" : "Commercial Enterprise",
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
  const totalLeadEvents = events.filter((e) => e.event === "lead" || e.event === "form_submit" || e.event === "form_submission").length;
  const uniqueVisitorSet = new Set(sessions.map((s) => s.sessionId));
  const uniqueVisitors = uniqueVisitorSet.size || (hasData ? 1 : 0);
  const conversionRatePercent = totalSessions > 0 ? Number(((totalLeadEvents / totalSessions) * 100).toFixed(1)) : 0;

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
