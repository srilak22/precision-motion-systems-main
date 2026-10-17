// INDUS Industrial Robotics — Administrator Lead & RFQ Notification Email Template 2.0
// api/_lib/email/templates/adminLeadNotification.js
// Premium Industrial Automation Design: Confident Engineering Hierarchy,
// Navy #101B35 Branding, Precision Blue #246BFD CTAs, Electric Cyan #45C8F5 Accents,
// Table-Based Bulletproof Architecture, and Comprehensive Lead Parameter Display.

import { BRAND, BRAND_COLORS, EMAIL_ASSETS, VERIFIED_LINKS, escapeHtml } from "../constants.js";
import { wrapEmailLayout } from "../layout.js";

/**
 * Determines lead priority based on verifiable submission parameters.
 * Does not artificially label every enquiry as urgent.
 */
function determineLeadPriority(params = {}) {
  const type = String(params.type || params.form || "").toLowerCase();
  const reqs = String(params.requirements || params.details || "").toLowerCase();
  const quantity = String(params.quantity || "").toLowerCase();
  const timeline = String(params.timeline || "").toLowerCase();

  const isUrgentTimeline =
    timeline.includes("immediate") ||
    timeline.includes("active") ||
    timeline.includes("1-3") ||
    timeline.includes("urgent");

  const isHighVolume =
    quantity.includes("production") ||
    quantity.includes("50+") ||
    quantity.includes("10-50") ||
    quantity.includes("batch") ||
    quantity.includes("pilot");

  const isDirectRfq =
    type.includes("quote") ||
    type.includes("rfq") ||
    reqs.includes("sizing parameters") ||
    params.action === "quote";

  const isConsultation =
    type.includes("consultation") ||
    reqs.includes("consultation") ||
    params.action === "consultation";

  if (isHighVolume || (isDirectRfq && isUrgentTimeline)) {
    return {
      label: "High Priority",
      badgeColor: "#246BFD",
      borderColor: "#246BFD",
      bgColor: "#F3F6FA",
      description: "Direct commercial RFQ submitted with active production implementation timeline.",
    };
  }

  if (isConsultation || isDirectRfq) {
    return {
      label: "Review Required",
      badgeColor: "#246BFD",
      borderColor: "#246BFD",
      bgColor: "#F3F6FA",
      description: "Technical parameters submitted for engineering feasibility review and quotation.",
    };
  }

  return {
    label: "Normal Priority",
    badgeColor: "#5B6577",
    borderColor: "#DCE3ED",
    bgColor: "#F3F6FA",
    description: "Standard website commercial enquiry received for engineering desk follow-up.",
  };
}

/**
 * Formats a clean date/time string from ISO or timestamp.
 */
function formatSubmissionTimestamp(rawTimestamp) {
  try {
    const d = rawTimestamp ? new Date(rawTimestamp) : new Date();
    if (isNaN(d.getTime())) return new Date().toUTCString();
    return d.toUTCString();
  } catch {
    return new Date().toUTCString();
  }
}

/**
 * Cleans phone numbers for clickable tel: links.
 */
function sanitizePhoneNumber(phone) {
  if (!phone || typeof phone !== "string") return null;
  const digits = phone.replace(/[^0-9+]/g, "");
  return digits.length >= 7 ? digits : null;
}

/**
 * Renders the Premium Industrial Lead Notification Email Template (Template 2.0).
 *
 * @param {Object} params
 * @param {string} [params.name] - Prospect's full name
 * @param {string} [params.email] - Corporate email address
 * @param {string} [params.phone] - Phone number
 * @param {string} [params.company] - Company or organization name
 * @param {string} [params.type] - Category / Lead type (e.g. Commercial RFQ)
 * @param {string} [params.product] - Product focus or topic
 * @param {string} [params.category] - Product category
 * @param {string} [params.quantity] - Batch or unit quantity
 * @param {string} [params.timeline] - Project timeline
 * @param {string} [params.industry] - Target industry
 * @param {string} [params.requirements] - Detailed engineering specifications
 * @param {string} [params.jiraKey] - Jira Cloud issue key (e.g. DI-339)
 * @param {string} [params.jiraDomain] - Jira Cloud domain for direct ticket linking
 * @param {string} [params.source] - Lead attribution source
 * @param {string} [params.location] - Geographical location or IP
 * @param {string} [params.timestamp] - Submission ISO timestamp
 * @param {string} [params.correlationId] - Telemetry correlation ID
 * @returns {{ subject: string, html: string, text: string }}
 */
export function renderAdminLeadNotificationEmail(params = {}) {
  const leadName = (params.name || params.fullName || "Unspecified").trim();
  const leadEmail = (params.email || params.companyEmail || "Unspecified").trim();
  const rawPhone = (params.phone || params.phoneNumber || "").trim();
  const leadPhone = rawPhone || "Not provided";
  const cleanPhone = sanitizePhoneNumber(rawPhone);
  const leadCompany = (params.company || params.companyName || "Not provided").trim();
  const leadType = params.type || params.form || "Commercial RFQ / Engineering Intake";
  const productFocus = params.product || params.topic || "Precision Motion Systems";
  const leadCategory = params.category ? String(params.category).trim() : null;
  const leadQuantity = params.quantity ? String(params.quantity).trim() : null;
  const leadTimeline = params.timeline ? String(params.timeline).trim() : null;
  const leadIndustry = params.industry ? String(params.industry).trim() : null;
  const requirements = (
    params.requirements ||
    params.details ||
    params.projectDescription ||
    "No additional requirements provided."
  ).trim();
  const jiraKey = params.jiraKey || params.jiraTicketKey || null;
  const jiraDomain = params.jiraDomain || process.env.JIRA_DOMAIN || "precision-motion.atlassian.net";
  const jiraUrl = jiraKey ? `https://${jiraDomain}/browse/${jiraKey}` : null;
  const source = params.source || params.leadSource || "Direct Website (Commercial Intake)";
  const location = params.location || (params.city && params.country ? `${params.city}, ${params.country}` : "Global / Web");
  const submissionTime = formatSubmissionTimestamp(params.timestamp);
  const correlationId = params.correlationId || jiraKey || `lead_${Date.now()}`;

  const isQuote =
    params.action === "quote" ||
    leadType.toLowerCase().includes("quote") ||
    productFocus.toLowerCase().includes("quote");

  const isConsultation =
    params.action === "consultation" ||
    leadType.toLowerCase().includes("consultation") ||
    productFocus.toLowerCase().includes("consultation");

  let subjectPrefix = "New Website Enquiry";
  if (isQuote) {
    subjectPrefix = "New Quote Request";
  } else if (isConsultation) {
    subjectPrefix = "New Consultation Request";
  }

  const companySegment = leadCompany !== "Not provided" ? ` (${leadCompany})` : "";
  const ticketSegment = jiraKey ? ` [${jiraKey}]` : "";
  const subject = `${subjectPrefix} | INDUS Industrial Robotics — ${leadName}${companySegment}${ticketSegment}`;

  // Evaluate lead priority according to verified business rules
  const priority = determineLeadPriority({
    type: leadType,
    requirements,
    quantity: leadQuantity,
    timeline: leadTimeline,
    action: params.action,
  });

  // Construct mailto reply link
  const replySubject = encodeURIComponent(
    `RE: INDUS Industrial Robotics Enquiry — ${leadCompany !== "Not provided" ? leadCompany : leadName}${jiraKey ? ` [${jiraKey}]` : ""}`
  );
  const replyMailtoUrl = `mailto:${encodeURIComponent(leadEmail)}?subject=${replySubject}`;

  // =========================================================================
  // 1. BRAND HEADER LOCKUP (Section 3)
  // Strong Navy #101B35, Delta Axis Emblem, Restrained LEAD ALERT Badge
  // =========================================================================
  const customHeaderHtml = `
    <!-- TOP BRAND HEADER LOCKUP -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: ${BRAND_COLORS.navyDark}; border-bottom: 2px solid ${BRAND_COLORS.precisionBlue};">
      <tr>
        <td style="padding: 22px 30px 18px 30px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
            <tr>
              <!-- BRAND IDENTITY -->
              <td align="left" valign="middle">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <!-- Iconic 3D Axis Delta Glyph Emblem -->
                    <td style="width: 36px; height: 36px; background-color: #162344; border: 1.5px solid ${BRAND_COLORS.electricCyan}; border-radius: 6px; text-align: center; vertical-align: middle;">
                      <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 900; color: ${BRAND_COLORS.electricCyan}; line-height: 36px; display: inline-block;">&Delta;</span>
                    </td>
                    <td style="padding-left: 12px; vertical-align: middle;">
                      <a href="${BRAND.websiteUrl}" target="_blank" rel="noopener noreferrer" style="text-decoration: none; display: block;">
                        <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 17px; font-weight: 800; letter-spacing: 1.4px; text-transform: uppercase; color: #FFFFFF; line-height: 1.1; display: block;">
                          ${BRAND.name}
                        </span>
                        <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 1.2px; text-transform: uppercase; color: ${BRAND_COLORS.electricCyan}; display: block; margin-top: 2px;">
                          Industrial Robotics &middot; Precision Motion
                        </span>
                      </a>
                    </td>
                  </tr>
                </table>
              </td>

              <!-- RESTRAINED LEAD ALERT BADGE -->
              <td align="right" valign="middle">
                <span style="display: inline-block; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.4px; color: ${BRAND_COLORS.electricCyan}; background-color: #162344; border: 1px solid #1E2E56; padding: 5px 12px; border-radius: 4px;">
                  LEAD ALERT
                </span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- INDUSTRIAL HERO SECTION (Section 4) -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: ${BRAND_COLORS.navyDark}; border-bottom: 1px solid #1E2E56;">
      <tr>
        <td style="padding: 26px 30px 20px 30px;">
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 10px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: ${BRAND_COLORS.electricCyan}; margin-bottom: 8px;">
            PRECISION MOTION &middot; INTELLIGENT AUTOMATION
          </div>
          <h1 style="margin: 0 0 10px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 22px; font-weight: 800; letter-spacing: -0.3px; color: #FFFFFF; line-height: 1.3;">
            A new industrial enquiry needs your attention.
          </h1>
          <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.6; color: #DCE3ED;">
            A prospective client has submitted technical sizing parameters and commercial requirements through the INDUS commercial desk for engineering review.
          </p>
        </td>
      </tr>
      <!-- REFINED INDUSTRIAL ROBOTICS HERO VISUAL -->
      <tr>
        <td style="padding: 0 30px 24px 30px;">
          <img src="${EMAIL_ASSETS.headerBanner}" alt="INDUS Industrial Robotics — Automated Production Cell" width="540" height="150" style="display: block; width: 100%; max-width: 540px; height: 150px; object-fit: cover; border-radius: 4px; border: 1px solid #1E2E56; background-color: #162344;" />
        </td>
      </tr>
    </table>
  `.trim();

  // =========================================================================
  // 2. MAIN BODY CONTENT (Sections 5, 6, 7, 8)
  // Lead-Status Banner, Contact Profile Card, Project Sizing Card, Action CTAs
  // =========================================================================
  const contentHtml = `
    <!-- LEAD STATUS BANNER (Section 5 — Replaces Old Warning Strip) -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="margin-bottom: 22px; background-color: ${priority.bgColor}; border: 1px solid ${BRAND_COLORS.borderLight}; border-left: 4px solid ${priority.borderColor}; border-radius: 4px;">
      <tr>
        <td style="padding: 13px 18px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
            <tr>
              <td valign="middle">
                <span style="display: inline-block; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: ${priority.badgeColor}; margin-right: 8px;">
                  &bull; ${escapeHtml(priority.label.toUpperCase())}
                </span>
                <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; color: ${BRAND_COLORS.textMuted}; line-height: 1.4;">
                  ${escapeHtml(priority.description)}
                </span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- CONTACT INFORMATION CARD (Section 6) -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="margin-bottom: 22px; background-color: #FFFFFF; border: 1px solid ${BRAND_COLORS.borderLight}; border-radius: 6px; box-shadow: 0 1px 3px rgba(16, 27, 53, 0.04);">
      <tr>
        <td style="padding: 22px 24px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="margin-bottom: 12px; border-bottom: 1px solid #F3F6FA; padding-bottom: 10px;">
            <tr>
              <td align="left">
                <h2 style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: ${BRAND_COLORS.navyDark};">
                  Contact &amp; Account Profile
                </h2>
              </td>
              ${
                jiraKey
                  ? `
              <td align="right">
                <span style="font-family: monospace; font-size: 12px; font-weight: 700; color: ${BRAND_COLORS.precisionBlue}; background-color: #EFF6FF; border: 1px solid #BFDBFE; padding: 3px 8px; border-radius: 3px;">
                  ${escapeHtml(jiraKey)}
                </span>
              </td>`
                  : ""
              }
            </tr>
          </table>

          <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.65;">
            <tr>
              <td style="padding: 5px 0; width: 34%; color: ${BRAND_COLORS.textMuted}; font-weight: 600;">Full Name:</td>
              <td style="padding: 5px 0; color: ${BRAND_COLORS.textDark}; font-weight: 700;">${escapeHtml(leadName)}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: ${BRAND_COLORS.textMuted}; font-weight: 600;">Company / Org:</td>
              <td style="padding: 5px 0; color: ${BRAND_COLORS.textDark}; font-weight: 600;">${escapeHtml(leadCompany)}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: ${BRAND_COLORS.textMuted}; font-weight: 600;">Corporate Email:</td>
              <td style="padding: 5px 0;">
                ${
                  leadEmail !== "Unspecified"
                    ? `<a href="mailto:${escapeHtml(leadEmail)}" style="color: ${BRAND_COLORS.precisionBlue}; font-weight: 700; text-decoration: none;">${escapeHtml(leadEmail)}</a>`
                    : `<span style="color: ${BRAND_COLORS.textMuted};">Not provided</span>`
                }
              </td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: ${BRAND_COLORS.textMuted}; font-weight: 600;">Telephone:</td>
              <td style="padding: 5px 0;">
                ${
                  cleanPhone
                    ? `<a href="tel:${escapeHtml(cleanPhone)}" style="color: ${BRAND_COLORS.textDark}; font-weight: 600; text-decoration: none;">${escapeHtml(leadPhone)}</a>`
                    : `<span style="color: ${BRAND_COLORS.textMuted};">Not provided</span>`
                }
              </td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: ${BRAND_COLORS.textMuted}; font-weight: 600;">Location:</td>
              <td style="padding: 5px 0; color: ${BRAND_COLORS.textDark};">${escapeHtml(location)}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: ${BRAND_COLORS.textMuted}; font-weight: 600;">Lead Source:</td>
              <td style="padding: 5px 0; color: ${BRAND_COLORS.textDark};">${escapeHtml(source)}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: ${BRAND_COLORS.textMuted}; font-weight: 600;">Submission Time:</td>
              <td style="padding: 5px 0; color: ${BRAND_COLORS.textMuted}; font-size: 12px;">${escapeHtml(submissionTime)}</td>
            </tr>
            ${
              jiraKey
                ? `
            <tr>
              <td style="padding: 5px 0; color: ${BRAND_COLORS.textMuted}; font-weight: 600;">Jira Cloud Ticket:</td>
              <td style="padding: 5px 0;">
                <a href="${escapeHtml(jiraUrl)}" target="_blank" rel="noopener noreferrer" style="color: ${BRAND_COLORS.precisionBlue}; font-family: monospace; font-weight: 700; text-decoration: none;">
                  ${escapeHtml(jiraKey)} &nearr;
                </a>
              </td>
            </tr>`
                : ""
            }
          </table>
        </td>
      </tr>
    </table>

    <!-- PROJECT REQUIREMENTS & SIZING PARAMETERS CARD (Section 7) -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="margin-bottom: 24px; background-color: ${BRAND_COLORS.surfaceLight}; border: 1px solid ${BRAND_COLORS.borderLight}; border-radius: 6px;">
      <tr>
        <td style="padding: 22px 24px;">
          <h3 style="margin: 0 0 12px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: ${BRAND_COLORS.navyDark};">
            Technical Sizing &amp; Project Requirements
          </h3>

          <!-- Structured Summary Parameters -->
          <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="margin-bottom: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px;">
            <tr>
              <td style="padding: 4px 0; width: 34%; color: ${BRAND_COLORS.textMuted}; font-weight: 600;">Product / Focus:</td>
              <td style="padding: 4px 0; color: ${BRAND_COLORS.precisionBlue}; font-weight: 700;">${escapeHtml(productFocus)}</td>
            </tr>
            ${
              leadCategory
                ? `
            <tr>
              <td style="padding: 4px 0; color: ${BRAND_COLORS.textMuted}; font-weight: 600;">Category:</td>
              <td style="padding: 4px 0; color: ${BRAND_COLORS.textDark}; font-weight: 600;">${escapeHtml(leadCategory)}</td>
            </tr>`
                : ""
            }
            ${
              leadQuantity
                ? `
            <tr>
              <td style="padding: 4px 0; color: ${BRAND_COLORS.textMuted}; font-weight: 600;">Quantity / Batch:</td>
              <td style="padding: 4px 0; color: ${BRAND_COLORS.textDark}; font-weight: 600;">${escapeHtml(leadQuantity)}</td>
            </tr>`
                : ""
            }
            ${
              leadTimeline
                ? `
            <tr>
              <td style="padding: 4px 0; color: ${BRAND_COLORS.textMuted}; font-weight: 600;">Timeline:</td>
              <td style="padding: 4px 0; color: ${BRAND_COLORS.textDark}; font-weight: 600;">${escapeHtml(leadTimeline)}</td>
            </tr>`
                : ""
            }
            ${
              leadIndustry
                ? `
            <tr>
              <td style="padding: 4px 0; color: ${BRAND_COLORS.textMuted}; font-weight: 600;">Target Industry:</td>
              <td style="padding: 4px 0; color: ${BRAND_COLORS.textDark}; font-weight: 600;">${escapeHtml(leadIndustry)}</td>
            </tr>`
                : ""
            }
          </table>

          <!-- Engineering Dossier / Full Specifications Container -->
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: ${BRAND_COLORS.textMuted}; margin-bottom: 6px;">
            Project Description &amp; Engineering Specifications
          </div>
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.6; color: ${BRAND_COLORS.textDark}; background-color: #FFFFFF; border: 1px solid ${BRAND_COLORS.borderLight}; border-radius: 4px; padding: 16px; white-space: pre-wrap; word-break: break-word; overflow-wrap: break-word;">
${escapeHtml(requirements)}
          </div>
        </td>
      </tr>
    </table>

    <!-- PRIMARY & SECONDARY ACTION CTAS (Section 8) -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="margin-bottom: 6px;">
      <tr>
        <td align="center">
          <table border="0" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <!-- PRIMARY BUTTON: REVIEW LEAD & RESPOND -->
              <td align="center" style="padding: 0 6px 10px 6px;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td align="center" bgcolor="${BRAND_COLORS.precisionBlue}" style="border-radius: 4px; padding: 0;">
                      <a href="${escapeHtml(replyMailtoUrl)}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 14px 26px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: #FFFFFF; text-decoration: none; border-radius: 4px; line-height: 100%;">
                        REVIEW LEAD &amp; RESPOND &rarr;
                      </a>
                    </td>
                  </tr>
                </table>
              </td>

              <!-- SECONDARY BUTTON: VIEW IN JIRA CLOUD (If Jira Ticket Exists) -->
              ${
                jiraKey
                  ? `
              <td align="center" style="padding: 0 6px 10px 6px;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td align="center" bgcolor="#FFFFFF" style="border: 1px solid ${BRAND_COLORS.borderLight}; border-radius: 4px; padding: 0;">
                      <a href="${escapeHtml(jiraUrl)}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 14px 22px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: ${BRAND_COLORS.textDark}; text-decoration: none; border-radius: 4px; line-height: 100%;">
                        VIEW IN JIRA CLOUD [${escapeHtml(jiraKey)}]
                      </a>
                    </td>
                  </tr>
                </table>
              </td>`
                  : ""
              }
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `.trim();

  // =========================================================================
  // 3. UPGRADED NAVY FOOTER (Section 9)
  // Deep Navy #101B35, Verified Contact Details, Navigation, Privacy & Copyright
  // =========================================================================
  const year = new Date().getFullYear();
  const customFooterHtml = `
    <!-- UPGRADED NAVY FOOTER -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: ${BRAND_COLORS.navyDark}; border-top: 1px solid #1E2E56;">
      <!-- BRAND STATEMENT -->
      <tr>
        <td style="padding: 30px 30px 18px 30px;">
          <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase; color: #FFFFFF; display: block;">
            ${BRAND.fullName}
          </span>
          <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.8px; color: ${BRAND_COLORS.electricCyan}; display: block; margin-top: 3px;">
            Precision Motion &amp; Automation Technology
          </span>
          <p style="margin: 8px 0 0 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; line-height: 1.6; color: #8A96A8; max-width: 520px;">
            INDUS designs and manufactures high-precision industrial robotics, multi-axis motion controllers, and precision reducers for automated manufacturing.
          </p>
        </td>
      </tr>

      <!-- VERIFIED CONTACT CHANNELS -->
      <tr>
        <td style="padding: 0 30px 18px 30px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: #0B1224; border: 1px solid #1E2E56; border-radius: 6px;">
            <tr>
              <td style="padding: 14px 18px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; line-height: 1.7; color: #DCE3ED;">
                <strong style="color: #FFFFFF;">Official Website:</strong> <a href="${BRAND.websiteUrl}" style="color: ${BRAND_COLORS.electricCyan}; text-decoration: none;">${BRAND.websiteUrl}</a> &nbsp;|&nbsp;
                <strong style="color: #FFFFFF;">Engineering Support:</strong> <a href="mailto:${BRAND.email}" style="color: ${BRAND_COLORS.electricCyan}; text-decoration: none;">${BRAND.email}</a><br />
                <strong style="color: #FFFFFF;">Commercial Desk:</strong> ${BRAND.phone} &nbsp;|&nbsp;
                <strong style="color: #FFFFFF;">Operating Hours:</strong> ${BRAND.supportHours}
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- CLEAN NAVIGATION LINKS -->
      <tr>
        <td align="center" style="padding: 12px 30px 16px 30px; border-top: 1px solid #1E2E56; border-bottom: 1px solid #1E2E56;">
          <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #DCE3ED;">
            <a href="${VERIFIED_LINKS.solutions}" target="_blank" rel="noopener noreferrer" style="color: ${BRAND_COLORS.electricCyan}; text-decoration: none; margin: 0 8px;">Solutions</a> &bull;
            <a href="${VERIFIED_LINKS.resources}" target="_blank" rel="noopener noreferrer" style="color: #DCE3ED; text-decoration: none; margin: 0 8px;">Engineering Resources</a> &bull;
            <a href="${VERIFIED_LINKS.contact}" target="_blank" rel="noopener noreferrer" style="color: #DCE3ED; text-decoration: none; margin: 0 8px;">Contact</a> &bull;
            <a href="${VERIFIED_LINKS.consultation}" target="_blank" rel="noopener noreferrer" style="color: ${BRAND_COLORS.precisionBlue}; text-decoration: none; margin: 0 8px;">Book Consultation</a>
          </span>
        </td>
      </tr>

      <!-- COPYRIGHT & TELEMETRY -->
      <tr>
        <td style="padding: 18px 30px 26px 30px; text-align: center;">
          <p style="margin: 0 0 6px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; line-height: 1.5; color: ${BRAND_COLORS.textMuted};">
            &copy; ${year} ${BRAND.fullName}. All rights reserved. &middot; <a href="${VERIFIED_LINKS.compliance}" style="color: ${BRAND_COLORS.textMuted}; text-decoration: underline;">Privacy Policy &amp; Terms</a>
          </p>
          ${
            correlationId
              ? `<span style="font-family: monospace; font-size: 9px; color: #334155;">Correlation Reference: ${escapeHtml(correlationId)}</span>`
              : ""
          }
        </td>
      </tr>
    </table>
  `.trim();

  // =========================================================================
  // 4. PLAIN-TEXT ALTERNATIVE
  // Complete, structured ASCII formatting for plain-text email clients
  // =========================================================================
  const contentText = `
================================================================================
INDUS INDUSTRIAL ROBOTICS — NEW LEAD NOTIFICATION
================================================================================
Status: ${priority.label.toUpperCase()} (${priority.description})
Timestamp: ${submissionTime}
Correlation Reference: ${correlationId}

CONTACT & COMMERCIAL PROFILE:
• Full Name: ${leadName}
• Company: ${leadCompany}
• Corporate Email: ${leadEmail}
• Telephone: ${leadPhone}
• Location: ${location}
• Lead Type: ${leadType}
• Lead Source: ${source}
${jiraKey ? `• Jira Cloud Ticket: ${jiraKey} (${jiraUrl})\n` : ""}
TECHNICAL SIZING & PROJECT REQUIREMENTS:
• Product Focus: ${productFocus}
${leadCategory ? `• Category: ${leadCategory}\n` : ""}${leadQuantity ? `• Quantity / Batch: ${leadQuantity}\n` : ""}${leadTimeline ? `• Timeline: ${leadTimeline}\n` : ""}${leadIndustry ? `• Target Industry: ${leadIndustry}\n` : ""}
SPECIFICATIONS & PROJECT DESCRIPTION:
${requirements}

ACTIONS:
[ REVIEW LEAD & RESPOND ] -> mailto:${leadEmail}
${jiraKey ? `[ VIEW IN JIRA CLOUD ] -> ${jiraUrl}\n` : ""}
================================================================================
INDUS Industrial Robotics · Precision Motion & Automation Technology
Website: ${BRAND.websiteUrl} | Support: ${BRAND.email} | Phone: ${BRAND.phone}
  `.trim();

  return wrapEmailLayout({
    title: subject,
    contentHtml,
    contentText,
    customHeaderHtml,
    customFooterHtml,
  });
}
