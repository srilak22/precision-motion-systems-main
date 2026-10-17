// INDUS Industrial Robotics — Executive Scheduled Report Email Template Wrapper
// api/_lib/email/templates/reportEmail.js
// Integrates with daily, weekly, and monthly operational reports

import { BRAND, BRAND_COLORS, VERIFIED_LINKS, escapeHtml } from "../constants.js";
import { wrapEmailLayout } from "../layout.js";

export function renderExecutiveReportEmail(type, period, metrics) {
  const brandNavy = "#0B0F12";
  const brandDarkCard = BRAND_COLORS.navyCard;
  const brandAccent = "#95CC00";
  const brandAmber = BRAND_COLORS.amber;
  const textWhite = "#FFFFFF";
  const textMuted = "#94A3B8";

  const typeLabel = (type || "daily").toUpperCase();
  const subject = `🤖 [INDUS ${typeLabel} REPORT] ${period.summaryLabel} — ${metrics.totalLeads} Leads, ${metrics.consultations.total} Consultations`;

  const contentHtml = `
    <!-- REPORT METRICS HEADER STRIP -->
    <div style="margin-bottom: 24px; padding: 18px 24px; background-color: ${brandDarkCard}; border-radius: 6px; border: 1px solid #1E293B;">
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: ${brandAccent}; margin-bottom: 4px;">
        ${typeLabel} OPERATIONS INTELLIGENCE
      </div>
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 20px; font-weight: 800; color: #FFFFFF; line-height: 1.3;">
        ${escapeHtml(period.summaryLabel)}
      </div>
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; color: ${textMuted}; margin-top: 4px;">
        Reporting Window: <strong style="color: #F1F5F9;">${escapeHtml(period.displayPeriod)}</strong>
      </div>
    </div>

    <!-- 4 HIGH-LEVEL KPI METRIC BOXES -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="margin-bottom: 24px;">
      <tr>
        <td width="23%" valign="top" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; padding: 16px 12px; border-radius: 6px; text-align: center;">
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #64748B; font-weight: 700;">Total Inquiries</div>
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 26px; font-weight: 800; color: ${BRAND_COLORS.navyDark}; margin-top: 4px;">${metrics.totalLeads}</div>
          <div style="font-size: 10px; color: #94A3B8; margin-top: 2px;">All Channels</div>
        </td>
        <td width="2%">&nbsp;</td>
        <td width="23%" valign="top" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; padding: 16px 12px; border-radius: 6px; text-align: center;">
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #64748B; font-weight: 700;">Website (DI)</div>
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 26px; font-weight: 800; color: ${BRAND_COLORS.industrialBlue}; margin-top: 4px;">${metrics.dealflow.websiteDI}</div>
          <div style="font-size: 10px; color: #94A3B8; margin-top: 2px;">Direct DealFlow</div>
        </td>
        <td width="2%">&nbsp;</td>
        <td width="23%" valign="top" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; padding: 16px 12px; border-radius: 6px; text-align: center;">
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #64748B; font-weight: 700;">YouTube (YLT)</div>
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 26px; font-weight: 800; color: #DC2626; margin-top: 4px;">${metrics.dealflow.youtubeYLT}</div>
          <div style="font-size: 10px; color: #94A3B8; margin-top: 2px;">Video Leads</div>
        </td>
        <td width="2%">&nbsp;</td>
        <td width="23%" valign="top" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; padding: 16px 12px; border-radius: 6px; text-align: center;">
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #64748B; font-weight: 700;">Consultations</div>
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 26px; font-weight: 800; color: #D97706; margin-top: 4px;">${metrics.consultations.total}</div>
          <div style="font-size: 10px; color: #94A3B8; margin-top: 2px;">${metrics.consultations.confirmed} Confirmed</div>
        </td>
      </tr>
    </table>

    <!-- 1. MULTI-CHANNEL DISTRIBUTION TABLE -->
    <div style="margin-bottom: 24px;">
      <h3 style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; text-transform: uppercase; letter-spacing: 1.2px; color: ${BRAND_COLORS.navyDark}; margin: 0 0 10px 0;">
        1. Multi-Channel Lead Distribution
      </h3>
      <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="border-collapse: collapse; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; border: 1px solid #CBD5E1;">
        <tr style="background-color: #F1F5F9; color: #475569; font-weight: 700; border-bottom: 1px solid #CBD5E1;">
          <th style="padding: 10px 14px; text-align: left;">Intake Channel</th>
          <th style="padding: 10px 14px; text-align: left;">Jira Target Project</th>
          <th style="padding: 10px 14px; text-align: right;">Count</th>
          <th style="padding: 10px 14px; text-align: right;">Share</th>
        </tr>
        <tr style="border-bottom: 1px solid #E2E8F0;">
          <td style="padding: 10px 14px; font-weight: 600; color: #1E293B;">Direct Website RFQ &amp; Sizing</td>
          <td style="padding: 10px 14px; font-family: monospace; color: ${BRAND_COLORS.industrialBlue}; font-weight: 700;">DI (DealFlow)</td>
          <td style="padding: 10px 14px; text-align: right; font-weight: 700; color: #0F172A;">${metrics.dealflow.websiteDI}</td>
          <td style="padding: 10px 14px; text-align: right; color: #64748B;">${metrics.totalLeads > 0 ? Math.round((metrics.dealflow.websiteDI / metrics.totalLeads) * 100) : 0}%</td>
        </tr>
        <tr style="border-bottom: 1px solid #E2E8F0;">
          <td style="padding: 10px 14px; font-weight: 600; color: #1E293B;">YouTube Technical Inquiries</td>
          <td style="padding: 10px 14px; font-family: monospace; color: #DC2626; font-weight: 700;">YLT (YouTube Leads)</td>
          <td style="padding: 10px 14px; text-align: right; font-weight: 700; color: #0F172A;">${metrics.dealflow.youtubeYLT}</td>
          <td style="padding: 10px 14px; text-align: right; color: #64748B;">${metrics.totalLeads > 0 ? Math.round((metrics.dealflow.youtubeYLT / metrics.totalLeads) * 100) : 0}%</td>
        </tr>
        <tr>
          <td style="padding: 10px 14px; font-weight: 600; color: #1E293B;">LinkedIn Campaign Referrals</td>
          <td style="padding: 10px 14px; font-family: monospace; color: #059669; font-weight: 700;">LIT (LinkedIn Leads)</td>
          <td style="padding: 10px 14px; text-align: right; font-weight: 700; color: #0F172A;">${metrics.dealflow.linkedinLIT}</td>
          <td style="padding: 10px 14px; text-align: right; color: #64748B;">${metrics.totalLeads > 0 ? Math.round((metrics.dealflow.linkedinLIT / metrics.totalLeads) * 100) : 0}%</td>
        </tr>
      </table>
    </div>

    <!-- 2. TECHNICAL CONSULTATIONS TABLE -->
    <div style="margin-bottom: 24px;">
      <h3 style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; text-transform: uppercase; letter-spacing: 1.2px; color: ${BRAND_COLORS.navyDark}; margin: 0 0 10px 0;">
        2. Technical Consultations &amp; Visits
      </h3>
      ${
        metrics.sampleBookings.length > 0
          ? `
      <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="border-collapse: collapse; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; border: 1px solid #CBD5E1;">
        <tr style="background-color: #F1F5F9; color: #475569; font-weight: 700; border-bottom: 1px solid #CBD5E1;">
          <th style="padding: 8px 12px; text-align: left;">Booking ID</th>
          <th style="padding: 8px 12px; text-align: left;">Customer &amp; Company</th>
          <th style="padding: 8px 12px; text-align: left;">Purpose</th>
          <th style="padding: 8px 12px; text-align: left;">Date &amp; Time</th>
          <th style="padding: 8px 12px; text-align: left;">Mode</th>
        </tr>
        ${metrics.sampleBookings
          .map(
            (b) => `
        <tr style="border-bottom: 1px solid #E2E8F0;">
          <td style="padding: 8px 12px; font-family: monospace; color: #B45309; font-weight: 700;">${escapeHtml(b.bookingId)}</td>
          <td style="padding: 8px 12px; font-weight: 600; color: #0F172A;">${escapeHtml(b.customer)}<br><span style="font-size: 11px; color: #64748B;">${escapeHtml(b.company || "Individual")}</span></td>
          <td style="padding: 8px 12px; color: #334155;">${escapeHtml(b.purpose)}</td>
          <td style="padding: 8px 12px; white-space: nowrap; color: #0F172A;">${escapeHtml(b.date)} ${escapeHtml(b.time)}</td>
          <td style="padding: 8px 12px; font-size: 11px; color: #64748B;">${escapeHtml(b.mode)}</td>
        </tr>`,
          )
          .join("")}
      </table>`
          : `<p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; color: #64748B; margin: 0; padding: 14px; background-color: #F8FAFC; border: 1px dashed #CBD5E1; text-align: center; border-radius: 4px;">No new bookings registered during this specific reporting period.</p>`
      }
    </div>

    <!-- 3. BACKEND INTEGRATIONS HEALTH MONITOR -->
    <div style="margin-bottom: 16px;">
      <h3 style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; text-transform: uppercase; letter-spacing: 1.2px; color: ${BRAND_COLORS.navyDark}; margin: 0 0 10px 0;">
        3. Backend Integrations &amp; Telemetry Sinks Health
      </h3>
      <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="border-collapse: collapse; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; border: 1px solid #CBD5E1;">
        <tr style="background-color: #F1F5F9; color: #475569; font-weight: 700; border-bottom: 1px solid #CBD5E1;">
          <th style="padding: 8px 12px; text-align: left;">Integration Endpoint</th>
          <th style="padding: 8px 12px; text-align: left;">Scope</th>
          <th style="padding: 8px 12px; text-align: right;">Status</th>
        </tr>
        <tr style="border-bottom: 1px solid #E2E8F0;">
          <td style="padding: 8px 12px; font-weight: 600; color: #0F172A;">Atlassian Jira Cloud</td>
          <td style="padding: 8px 12px; color: #64748B;">Automated Lead Tasks &amp; Subtasks (DI, YLT, LIT)</td>
          <td style="padding: 8px 12px; text-align: right; color: ${metrics.integrationsHealth.jiraCloud === "HEALTHY" ? "#16A34A" : "#D97706"}; font-weight: 700;">
            ● ${metrics.integrationsHealth.jiraCloud}
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #E2E8F0;">
          <td style="padding: 8px 12px; font-weight: 600; color: #0F172A;">Google Sheets &amp; Apps Script</td>
          <td style="padding: 8px 12px; color: #64748B;">Enquiry Tabs &amp; Calendar Sync</td>
          <td style="padding: 8px 12px; text-align: right; color: ${metrics.integrationsHealth.googleAppsScript === "HEALTHY" ? "#16A34A" : "#D97706"}; font-weight: 700;">
            ● ${metrics.integrationsHealth.googleAppsScript}
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #E2E8F0;">
          <td style="padding: 8px 12px; font-weight: 600; color: #0F172A;">Telegram Bot Alerts</td>
          <td style="padding: 8px 12px; color: #64748B;">Instant Mobile Alerts (@BotFather)</td>
          <td style="padding: 8px 12px; text-align: right; color: ${metrics.integrationsHealth.telegramBot === "CONFIGURED" ? "#16A34A" : "#94A3B8"}; font-weight: 700;">
            ● ${metrics.integrationsHealth.telegramBot}
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; font-weight: 600; color: #0F172A;">Microsoft Clarity</td>
          <td style="padding: 8px 12px; color: #64748B;">User Experience &amp; Heatmap Telemetry</td>
          <td style="padding: 8px 12px; text-align: right; color: ${metrics.integrationsHealth.microsoftClarity === "ACTIVE" ? "#16A34A" : "#94A3B8"}; font-weight: 700;">
            ● ${metrics.integrationsHealth.microsoftClarity}
          </td>
        </tr>
      </table>
    </div>
  `.trim();

  const contentText = `
================================================================================
INDUS INDUSTRIAL ROBOTICS — ${typeLabel} OPERATIONS & EXECUTIVE REPORT
================================================================================
Report Title: ${period.summaryLabel}
Reporting Period: ${period.displayPeriod}
Generated: ${new Date().toISOString()}

--------------------------------------------------------------------------------
1. EXECUTIVE METRICS SUMMARY
--------------------------------------------------------------------------------
• Total Inquiries & DealFlow: ${metrics.totalLeads}
• Direct Website Leads (DI):  ${metrics.dealflow.websiteDI}
• YouTube Attributed (YLT):   ${metrics.dealflow.youtubeYLT}
• LinkedIn Leads (LIT):       ${metrics.dealflow.linkedinLIT}
• Technical Consultations:    ${metrics.consultations.total} (${metrics.consultations.confirmed} Confirmed, ${metrics.consultations.rescheduled} Rescheduled)

--------------------------------------------------------------------------------
2. INTEGRATIONS & SYSTEM HEALTH
--------------------------------------------------------------------------------
• Jira Cloud API:         ${metrics.integrationsHealth.jiraCloud}
• Google Sheets Sync:     ${metrics.integrationsHealth.googleAppsScript}
• Telegram Bot Alerts:    ${metrics.integrationsHealth.telegramBot}
• Microsoft Clarity:      ${metrics.integrationsHealth.microsoftClarity}

--------------------------------------------------------------------------------
3. CONSULTATION APPOINTMENTS
--------------------------------------------------------------------------------
${
  metrics.sampleBookings.length > 0
    ? metrics.sampleBookings
        .map(
          (b) =>
            `• [${b.bookingId}] ${b.customer} (${b.company || "Individual"}) - ${b.purpose} | ${b.date} ${b.time} | Mode: ${b.mode}`,
        )
        .join("\n")
    : "No new consultations registered during this period."
}
================================================================================
  `.trim();

  const rendered = wrapEmailLayout({
    title: subject,
    contentHtml,
    contentText,
    headerOptions: {
      badge: `${typeLabel} EXECUTIVE REPORT`,
      headline: period.summaryLabel,
      subheadline: `Operations Telemetry & DealFlow Audit for ${period.displayPeriod}`,
      compact: false,
    },
    footerOptions: {
      includeUnsubscribe: false,
      correlationId: period.periodKey,
    },
    theme: "dark",
  });

  return {
    subject,
    html: rendered.html,
    text: rendered.text,
  };
}
