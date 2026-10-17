// INDUS Industrial Robotics — Administrator Lead & RFQ Notification Email Template
// api/_lib/email/templates/adminLeadNotification.js

import { BRAND, BRAND_COLORS, VERIFIED_LINKS, escapeHtml } from "../constants.js";
import { renderCTAButton } from "../buttons.js";
import { wrapEmailLayout } from "../layout.js";

export function renderAdminLeadNotificationEmail(params = {}) {
  const leadName = (params.name || params.fullName || "Unspecified").trim();
  const leadEmail = (params.email || params.companyEmail || "Unspecified").trim();
  const leadPhone = (params.phone || params.phoneNumber || "Not provided").trim();
  const leadCompany = (params.company || params.companyName || "Not provided").trim();
  const leadType = params.type || params.form || "Website Intake / DealFlow";
  const productFocus = params.product || params.topic || "Precision Motion Systems";
  const requirements = params.requirements || params.details || params.projectDescription || "No additional requirements provided.";
  const jiraKey = params.jiraKey || params.jiraTicketKey || null;
  const source = params.source || params.leadSource || "Direct Website";
  const location = params.location || (params.city && params.country ? `${params.city}, ${params.country}` : "Global / Web");
  const correlationId = params.correlationId || jiraKey || `lead_${Date.now()}`;

  const isQuote =
    params.action === "quote" ||
    (leadType || "").toLowerCase().includes("quote") ||
    (productFocus || "").toLowerCase().includes("quote");

  const isConsultation =
    params.action === "consultation" ||
    (leadType || "").toLowerCase().includes("consultation") ||
    (productFocus || "").toLowerCase().includes("consultation");

  let subjectPrefix = "New Website Enquiry";
  if (isQuote) {
    subjectPrefix = "New Quote Request";
  } else if (isConsultation) {
    subjectPrefix = "New Consultation Request";
  }

  const subject = `${subjectPrefix} | INDUS Industrial Robotics — ${leadName}${leadCompany !== "Not provided" ? ` (${leadCompany})` : ""}${jiraKey ? ` [${jiraKey}]` : ""}`;

  const contentHtml = `
    <!-- HEADER ALERT STRIP -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="margin-bottom: 20px; background-color: #FEF3C7; border: 1px solid #FCD34D; border-radius: 4px;">
      <tr>
        <td style="padding: 12px 18px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; font-weight: 700; color: #92400E;">
          NEW COMMERCIAL DEALFLOW INTAKE &middot; IMMEDIATE ACTION RECOMMENDED
        </td>
      </tr>
    </table>

    <!-- LEAD PROFILE TABLE -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="margin-bottom: 20px; background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 6px;">
      <tr>
        <td style="padding: 20px 24px;">
          <h2 style="margin: 0 0 14px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 800; color: ${BRAND_COLORS.navyDark};">
            Contact &amp; Account Profile
          </h2>

          <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.8;">
            <tr>
              <td style="padding: 4px 0; width: 32%; color: #64748B; font-weight: 600;">Full Name:</td>
              <td style="padding: 4px 0; color: ${BRAND_COLORS.navyDark}; font-weight: 700;">${escapeHtml(leadName)}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748B; font-weight: 600;">Corporate Email:</td>
              <td style="padding: 4px 0;">
                <a href="mailto:${escapeHtml(leadEmail)}" style="color: ${BRAND_COLORS.industrialBlue}; font-weight: 700; text-decoration: underline;">
                  ${escapeHtml(leadEmail)}
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748B; font-weight: 600;">Telephone:</td>
              <td style="padding: 4px 0; color: ${BRAND_COLORS.navyDark}; font-weight: 600;">${escapeHtml(leadPhone)}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748B; font-weight: 600;">Company / Org:</td>
              <td style="padding: 4px 0; color: ${BRAND_COLORS.navyDark}; font-weight: 600;">${escapeHtml(leadCompany)}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748B; font-weight: 600;">Location:</td>
              <td style="padding: 4px 0; color: ${BRAND_COLORS.navyDark};">${escapeHtml(location)}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748B; font-weight: 600;">Lead Source:</td>
              <td style="padding: 4px 0; color: ${BRAND_COLORS.navyDark};">${escapeHtml(source)}</td>
            </tr>
            ${
              jiraKey
                ? `
            <tr>
              <td style="padding: 4px 0; color: #64748B; font-weight: 600;">Jira Cloud Ticket:</td>
              <td style="padding: 4px 0; font-family: monospace; font-size: 13px; font-weight: 700; color: #0284C7;">
                ${escapeHtml(jiraKey)}
              </td>
            </tr>`
                : ""
            }
          </table>
        </td>
      </tr>
    </table>

    <!-- TECHNICAL SPECIFICATIONS CARD -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="margin-bottom: 24px; background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px;">
      <tr>
        <td style="padding: 20px 24px;">
          <h3 style="margin: 0 0 10px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: ${BRAND_COLORS.navyDark};">
            Project Requirements &amp; Sizing Parameters
          </h3>
          <p style="margin: 0 0 8px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 700; color: ${BRAND_COLORS.industrialBlue};">
            Focus: ${escapeHtml(productFocus)}
          </p>
          <div style="font-family: monospace; font-size: 12px; line-height: 1.6; color: #1E293B; background-color: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 4px; padding: 14px; white-space: pre-wrap; word-break: break-word;">
${escapeHtml(requirements)}
          </div>
        </td>
      </tr>
    </table>

    <!-- QUICK ACTIONS -->
    <div style="text-align: center;">
      <a href="mailto:${escapeHtml(leadEmail)}?subject=${encodeURIComponent(`RE: INDUS Industrial Robotics Enquiry — ${leadCompany !== "Not provided" ? leadCompany : leadName}`)}" style="display: inline-block; padding: 12px 24px; background-color: ${BRAND_COLORS.industrialBlue}; color: #FFFFFF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; font-weight: 700; text-decoration: none; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.8px; margin: 0 6px 10px 6px;">
        Reply to Lead via Email &rarr;
      </a>
    </div>
  `.trim();

  const contentText = `
================================================================================
NEW COMMERCIAL LEAD NOTIFICATION — INDUS INDUSTRIAL ROBOTICS
================================================================================
Timestamp: ${new Date().toISOString()}
Correlation ID: ${correlationId}

LEAD CONTACT:
• Full Name: ${leadName}
• Email: ${leadEmail}
• Phone: ${leadPhone}
• Company: ${leadCompany}
• Location: ${location}
• Lead Type: ${leadType}
• Lead Source: ${source}
${jiraKey ? `• Jira Cloud Ticket: ${jiraKey}\n` : ""}
TECHNICAL REQUIREMENTS:
Focus: ${productFocus}

${requirements}

================================================================================
Reply to lead: ${leadEmail}
  `.trim();

  return wrapEmailLayout({
    title: subject,
    contentHtml,
    contentText,
    headerOptions: {
      badge: "ADMINISTRATIVE NOTIFICATION",
      headline: "Website Lead & Commercial RFQ Intake",
      subheadline:
        "Instant system telemetry alert dispatched to the engineering management desk.",
      compact: true,
    },
    footerOptions: {
      includeUnsubscribe: false,
      correlationId,
    },
  });
}
