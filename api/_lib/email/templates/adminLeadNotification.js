// INDUS Industrial Robotics — Premium Industrial Lead Notification Email Template (Physiomatics Model)
// api/_lib/email/templates/adminLeadNotification.js
// Modeled directly on the Physiomatics clinical/executive email architecture:
// 1. 3-Column Top Header (Hardware Thumbnail + Centered Brand Lockup + Tinted Badge Card)
// 2. Full-Width Dark Navy Tagline Ribbon Bar
// 3. Salutation, Bold Executive Headline, and 2 Well-Spaced Narrative Paragraphs
// 4. "Four Key Technical & Commercial Sizing Parameters" (4 White Rounded Cards with Left Icons)
// 5. Highlighted Callout Box with Left Accent Border & Full Engineering Dossier
// 6. Dual Side-by-Side CTAs (Solid Precision Blue + Outline) with Direct Phone & Green WhatsApp Link
// 7. Executive Sign-Off ("Sincerely, Commercial Applications & Engineering Desk")
// 8. Dark Navy Footer with Pill Buttons, Verified Contact, Legal Links, and Sizing Disclaimer.

import { BRAND, BRAND_COLORS, EMAIL_ASSETS, VERIFIED_LINKS, escapeHtml } from "../constants.js";
import { wrapEmailLayout } from "../layout.js";

/**
 * Determines lead priority based on verifiable submission parameters.
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
 * Renders the Premium Industrial Lead Notification Email Template modeled after the reference.
 *
 * @param {Object} params
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

  const priority = determineLeadPriority({
    type: leadType,
    requirements,
    quantity: leadQuantity,
    timeline: leadTimeline,
    action: params.action,
  });

  const replySubject = encodeURIComponent(
    `RE: INDUS Industrial Robotics Enquiry — ${leadCompany !== "Not provided" ? leadCompany : leadName}${jiraKey ? ` [${jiraKey}]` : ""}`
  );
  const replyMailtoUrl = `mailto:${encodeURIComponent(leadEmail)}?subject=${replySubject}`;

  // =========================================================================
  // 1. TOP 3-COLUMN HEADER + DARK TAGLINE RIBBON BAR (Reference Model)
  // =========================================================================
  const customHeaderHtml = `
    <!-- TOP 3-COLUMN BRAND HEADER -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: #FFFFFF; border-bottom: 1px solid #DCE3ED;">
      <tr>
        <td style="padding: 18px 24px 14px 24px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
            <tr>
              <!-- LEFT: HARDWARE VISUAL THUMBNAIL -->
              <td width="130" valign="middle" style="padding-right: 14px;">
                <img src="${EMAIL_ASSETS.roboticArmCell}" alt="INDUS Precision Motion Cell" width="130" height="74" style="display: block; width: 130px; height: 74px; object-fit: cover; border-radius: 6px; border: 1px solid #DCE3ED; background-color: #101B35;" />
              </td>

              <!-- CENTER: BRAND LOCKUP -->
              <td valign="middle" align="center" style="padding: 0 8px;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" align="center">
                  <tr>
                    <td align="center">
                      <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                        <tr>
                          <td style="width: 28px; height: 28px; background-color: #101B35; border: 1.5px solid #246BFD; border-radius: 4px; text-align: center; vertical-align: middle;">
                            <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 15px; font-weight: 900; color: #45C8F5; line-height: 28px; display: inline-block;">&Delta;</span>
                          </td>
                          <td style="padding-left: 8px; vertical-align: middle;">
                            <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 19px; font-weight: 900; letter-spacing: 1.2px; text-transform: uppercase; color: #101B35; line-height: 1;">
                              ${BRAND.name}
                            </span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding-top: 4px;">
                      <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 8.5px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #5B6577;">
                        INDUSTRIAL ROBOTICS &bull; MOTION SYSTEMS
                      </span>
                    </td>
                  </tr>
                </table>
              </td>

              <!-- RIGHT: TINTED STATUS CARD -->
              <td width="145" valign="middle" align="right" style="padding-left: 8px;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #F3F6FA; border: 1px solid #DCE3ED; border-radius: 6px; width: 100%;">
                  <tr>
                    <td style="padding: 8px 10px; text-align: left;">
                      <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 10.5px; font-weight: 800; color: #101B35; display: block; line-height: 1.2;">
                        Commercial RFQ Desk
                      </span>
                      <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 9px; font-weight: 700; color: #246BFD; display: block; margin-top: 2px;">
                        LEAD ALERT &bull; Intake Review
                      </span>
                      <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 8px; color: #5B6577; display: block; margin-top: 3px;">
                        &bull; DealFlow &bull; Sizing Verified
                      </span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- FULL-WIDTH DARK NAVY RIBBON BAR (Reference Model) -->
      <tr>
        <td align="center" style="background-color: #101B35; padding: 10px 18px; border-bottom: 2px solid #246BFD;">
          <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 10.5px; font-weight: 800; letter-spacing: 0.8px; text-transform: uppercase; color: #FFFFFF;">
            From Precision Engineering to Factory Automation &bull; Measurable Industrial Reliability
          </span>
        </td>
      </tr>
    </table>
  `.trim();

  // =========================================================================
  // 2. MAIN BODY CONTENT (Reference Model: Intro + 4 Cards + Callout + CTAs)
  // =========================================================================
  const contentHtml = `
    <!-- SALUTATION -->
    <p style="margin: 0 0 14px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; font-weight: 600; color: #172033;">
      Hi ${leadName !== "Unspecified" ? escapeHtml(leadName) : "Engineering Team"},
    </p>

    <!-- EXECUTIVE HEADLINE -->
    <h1 style="margin: 0 0 16px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 22px; font-weight: 800; line-height: 1.3; color: #101B35; letter-spacing: -0.2px;">
      Enhancing Automation Precision: Industrial RFQ &amp; Sizing Dossier for ${escapeHtml(leadCompany !== "Not provided" ? leadCompany : leadName)}
    </h1>

    <!-- EXECUTIVE CONTEXT PARAGRAPHS -->
    <p style="margin: 0 0 14px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #334155;">
      Managing high-precision multi-axis motion and automated machine cycle times is one of the most critical aspects of modern industrial engineering. When evaluating robotic arms, linear positioners, and zero-backlash reducers, assessing kinematic repeatability, torque margins, and plant network fieldbus integration remains paramount.
    </p>

    <p style="margin: 0 0 24px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #334155;">
      <strong>INDUS Industrial Robotics</strong> was built to empower factory automation teams with validated motion hardware and turnkey sizing architecture. By leveraging high-torque harmonic gearing and real-time fieldbus synchronization, the platform gives engineering managers verified telemetry without lengthy commissioning cycles.
    </p>

    <!-- 4 STRUCTURED SPECIFICATION CARDS SECTION (Reference Model) -->
    <h3 style="margin: 0 0 14px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; font-weight: 800; color: #101B35;">
      Four Key Technical &amp; Commercial Sizing Parameters:
    </h3>

    <!-- CARD 1: CONTACT & COMMERCIAL CREDENTIALS -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="margin-bottom: 12px; background-color: #FFFFFF; border: 1px solid #DCE3ED; border-radius: 8px; box-shadow: 0 1px 3px rgba(16, 27, 53, 0.04);">
      <tr>
        <td style="padding: 16px 20px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
            <tr>
              <td width="42" valign="top" style="padding-right: 14px;">
                <div style="width: 38px; height: 38px; background-color: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 6px; text-align: center; vertical-align: middle;">
                  <span style="font-size: 18px; line-height: 38px; display: inline-block;">&#128100;</span>
                </div>
              </td>
              <td valign="top">
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; font-weight: 800; color: #246BFD; margin-bottom: 4px;">
                  Contact &amp; Account Profile
                </div>
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; line-height: 1.5; color: #5B6577;">
                  <strong>${escapeHtml(leadName)}</strong> from <strong>${escapeHtml(leadCompany)}</strong> (${escapeHtml(location)}).<br />
                  Email: <a href="mailto:${escapeHtml(leadEmail)}" style="color: #246BFD; font-weight: 600; text-decoration: none;">${escapeHtml(leadEmail)}</a>
                  ${cleanPhone ? ` &bull; Phone: <a href="tel:${escapeHtml(cleanPhone)}" style="color: #172033; font-weight: 600; text-decoration: none;">${escapeHtml(leadPhone)}</a>` : ""} &bull; Source: ${escapeHtml(source)}.
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- CARD 2: TARGET SOLUTION & HARDWARE FOCUS -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="margin-bottom: 12px; background-color: #FFFFFF; border: 1px solid #DCE3ED; border-radius: 8px; box-shadow: 0 1px 3px rgba(16, 27, 53, 0.04);">
      <tr>
        <td style="padding: 16px 20px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
            <tr>
              <td width="42" valign="top" style="padding-right: 14px;">
                <div style="width: 38px; height: 38px; background-color: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 6px; text-align: center; vertical-align: middle;">
                  <span style="font-size: 18px; line-height: 38px; display: inline-block;">&#9881;&#65039;</span>
                </div>
              </td>
              <td valign="top">
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; font-weight: 800; color: #246BFD; margin-bottom: 4px;">
                  Target Solution &amp; Hardware Category
                </div>
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; line-height: 1.5; color: #5B6577;">
                  Product Focus: <strong>${escapeHtml(productFocus)}</strong>.<br />
                  ${leadCategory ? `Category: <strong>${escapeHtml(leadCategory)}</strong> &bull; ` : ""}
                  ${leadIndustry ? `Industry: <strong>${escapeHtml(leadIndustry)}</strong> &bull; ` : ""}
                  Quantity: <strong>${escapeHtml(leadQuantity || "Pilot evaluation / Custom")}</strong>.
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- CARD 3: TIMELINE & QUALIFICATION STATUS -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="margin-bottom: 12px; background-color: #FFFFFF; border: 1px solid #DCE3ED; border-radius: 8px; box-shadow: 0 1px 3px rgba(16, 27, 53, 0.04);">
      <tr>
        <td style="padding: 16px 20px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
            <tr>
              <td width="42" valign="top" style="padding-right: 14px;">
                <div style="width: 38px; height: 38px; background-color: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 6px; text-align: center; vertical-align: middle;">
                  <span style="font-size: 18px; line-height: 38px; display: inline-block;">&#9201;&#65039;</span>
                </div>
              </td>
              <td valign="top">
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; font-weight: 800; color: #246BFD; margin-bottom: 4px;">
                  Timeline &amp; Qualification Status
                </div>
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; line-height: 1.5; color: #5B6577;">
                  Implementation Timeline: <strong>${escapeHtml(leadTimeline || "Standard industrial schedule")}</strong>.<br />
                  Status: <strong>${escapeHtml(priority.label.toUpperCase())}</strong> &mdash; ${escapeHtml(priority.description)}<br />
                  <span style="font-size: 11px; color: #8A96A8;">Received at ${escapeHtml(submissionTime)}</span>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- CARD 4: SYSTEM INTEGRATION & JIRA DEALFLOW -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="margin-bottom: 18px; background-color: #FFFFFF; border: 1px solid #DCE3ED; border-radius: 8px; box-shadow: 0 1px 3px rgba(16, 27, 53, 0.04);">
      <tr>
        <td style="padding: 16px 20px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
            <tr>
              <td width="42" valign="top" style="padding-right: 14px;">
                <div style="width: 38px; height: 38px; background-color: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 6px; text-align: center; vertical-align: middle;">
                  <span style="font-size: 18px; line-height: 38px; display: inline-block;">&#128737;&#65039;</span>
                </div>
              </td>
              <td valign="top">
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; font-weight: 800; color: #246BFD; margin-bottom: 4px;">
                  System Architecture &amp; DealFlow
                </div>
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; line-height: 1.5; color: #5B6577;">
                  ${jiraKey ? `Jira Cloud Lead: <a href="${escapeHtml(jiraUrl)}" target="_blank" rel="noopener noreferrer" style="color: #246BFD; font-family: monospace; font-weight: 700; text-decoration: none;"><strong>${escapeHtml(jiraKey)}</strong> &nearr;</a> &bull; ` : ""}
                  Verified against ISO 9001:2015 and CE industrial standards. All telemetry streams encrypted in transit.
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- HIGHLIGHTED CALLOUT / SPECIFICATION DOSSIER BOX (Reference Model) -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="margin: 20px 0 24px 0; background-color: #F8FAFC; border: 1px solid #E2E8F0; border-left: 4px solid #246BFD; border-radius: 6px;">
      <tr>
        <td style="padding: 18px 22px;">
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; font-weight: 800; color: #101B35; margin-bottom: 6px;">
            Engineering Dossier &amp; Sizing Notes
          </div>
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; line-height: 1.6; color: #334155; margin-bottom: 10px;">
            Every manufacturing facility has unique motion requirements. Below are the specific technical sizing parameters captured for this submission:
          </div>
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12.5px; line-height: 1.6; color: #172033; background-color: #FFFFFF; border: 1px solid #DCE3ED; border-radius: 4px; padding: 14px 16px; white-space: pre-wrap; word-break: break-word; overflow-wrap: break-word;">
${escapeHtml(requirements)}
          </div>
        </td>
      </tr>
    </table>

    <!-- DUAL ACTION BUTTONS (Reference Model: Solid + Outline) -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="margin-bottom: 14px;">
      <tr>
        <td align="center">
          <table border="0" cellpadding="0" cellspacing="0" role="presentation" align="center">
            <tr>
              <!-- PRIMARY BUTTON: DISCUSS YOUR REQUIREMENTS -->
              <td align="center" style="padding: 0 8px 10px 8px;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td align="center" bgcolor="#246BFD" style="border-radius: 6px; padding: 0;">
                      <a href="${escapeHtml(replyMailtoUrl)}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 14px 28px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: #FFFFFF; text-decoration: none; border-radius: 6px; line-height: 100%;">
                        Discuss Your Requirements &rarr;
                      </a>
                    </td>
                  </tr>
                </table>
              </td>

              <!-- SECONDARY BUTTON: JIRA TICKET / REQUEST A DEMO -->
              <td align="center" style="padding: 0 8px 10px 8px;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td align="center" bgcolor="#FFFFFF" style="border: 1.5px solid #246BFD; border-radius: 6px; padding: 0;">
                      <a href="${escapeHtml(jiraUrl || VERIFIED_LINKS.consultation)}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 12.5px 22px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: #246BFD; text-decoration: none; border-radius: 6px; line-height: 100%;">
                        ${jiraKey ? `View in Jira Cloud [${escapeHtml(jiraKey)}]` : "Request a Demo"}
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <!-- DIRECT CONTACT LINE WITH PHONE & GREEN WHATSAPP LINK (Reference Model) -->
      <tr>
        <td align="center" style="padding-top: 4px;">
          <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: #5B6577;">
            Direct line for engineering coordination: <a href="tel:+18005550199" style="color: #246BFD; font-weight: 700; text-decoration: none;">${BRAND.phone}</a> or <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" style="color: #10B981; font-weight: 700; text-decoration: none;">WhatsApp Us</a>
          </p>
        </td>
      </tr>
    </table>

    <!-- SIGN-OFF (Reference Model) -->
    <div style="margin: 28px 0 6px 0; border-top: 1px solid #E2E8F0; padding-top: 20px;">
      <p style="margin: 0 0 4px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; color: #5B6577;">
        Sincerely,
      </p>
      <p style="margin: 0 0 2px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; font-weight: 800; color: #101B35;">
        Commercial Applications &amp; Engineering Desk
      </p>
      <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: #246BFD; font-weight: 600;">
        INDUS Industrial Robotics &bull; Precision Motion Systems
      </p>
    </div>
  `.trim();

  // =========================================================================
  // 3. DARK NAVY FOOTER WITH PILL BUTTONS (Reference Model)
  // =========================================================================
  const year = new Date().getFullYear();
  const customFooterHtml = `
    <!-- DARK NAVY BRAND FOOTER -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: #101B35; border-top: 1px solid #1E2E56;">
      <!-- BRAND TITLE & TAGLINE -->
      <tr>
        <td style="padding: 30px 24px 16px 24px; text-align: center;">
          <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 16px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; color: #FFFFFF; display: block;">
            ${BRAND.name}
          </span>
          <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.8px; color: #45C8F5; display: block; margin-top: 4px;">
            Precision Motion &bull; Intelligent Automation
          </span>
          <p style="margin: 8px auto 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11.5px; line-height: 1.6; color: #8A96A8; max-width: 480px;">
            ${BRAND.email} &bull; ${BRAND.phone} &bull; <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" style="color: #10B981; font-weight: 700; text-decoration: none;">WhatsApp</a>
          </p>
        </td>
      </tr>

      <!-- ROW OF PILL BUTTONS (Reference Model) -->
      <tr>
        <td align="center" style="padding: 0 24px 18px 24px;">
          <table border="0" cellpadding="0" cellspacing="0" role="presentation" align="center">
            <tr>
              <td style="padding: 0 4px;">
                <a href="${VERIFIED_LINKS.home}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 6px 14px; background-color: #162344; border: 1px solid #1E2E56; border-radius: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 10.5px; font-weight: 700; color: #FFFFFF; text-decoration: none;">
                  Website
                </a>
              </td>
              <td style="padding: 0 4px;">
                <a href="${VERIFIED_LINKS.solutions}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 6px 14px; background-color: #162344; border: 1px solid #1E2E56; border-radius: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 10.5px; font-weight: 700; color: #45C8F5; text-decoration: none;">
                  Solutions
                </a>
              </td>
              <td style="padding: 0 4px;">
                <a href="${VERIFIED_LINKS.resources}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 6px 14px; background-color: #162344; border: 1px solid #1E2E56; border-radius: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 10.5px; font-weight: 700; color: #FFFFFF; text-decoration: none;">
                  Resources
                </a>
              </td>
              <td style="padding: 0 4px;">
                <a href="${VERIFIED_LINKS.consultation}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 6px 14px; background-color: #162344; border: 1px solid #246BFD; border-radius: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 10.5px; font-weight: 700; color: #45C8F5; text-decoration: none;">
                  Book Consultation
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- LEGAL LINKS & SIZING DISCLAIMER -->
      <tr>
        <td style="padding: 16px 24px 26px 24px; text-align: center; border-top: 1px solid #1E2E56;">
          <p style="margin: 0 0 8px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 10px; font-weight: 600; color: #64748B;">
            <a href="${VERIFIED_LINKS.compliance}" style="color: #8A96A8; text-decoration: none; margin: 0 6px;">Privacy Policy</a> &bull;
            <a href="${VERIFIED_LINKS.compliance}" style="color: #8A96A8; text-decoration: none; margin: 0 6px;">Terms of Use</a> &bull;
            <a href="${VERIFIED_LINKS.contact}" style="color: #8A96A8; text-decoration: none; margin: 0 6px;">Contact Us</a> &bull;
            <a href="${VERIFIED_LINKS.unsubscribe("")}" style="color: #8A96A8; text-decoration: none; margin: 0 6px;">Unsubscribe</a>
          </p>
          <p style="margin: 0 0 6px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 9.5px; line-height: 1.5; color: #475569; max-width: 500px; margin-left: auto; margin-right: auto;">
            INDUS Industrial Robotics provides precision motion equipment and automation hardware. System sizing parameters are subject to final kinematic, payload, and thermal validation by factory engineering.
          </p>
          <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 10px; color: #64748B;">
            &copy; ${year} ${BRAND.fullName}. All rights reserved.
          </p>
          ${
            correlationId
              ? `<span style="font-family: monospace; font-size: 8.5px; color: #334155; display: block; margin-top: 4px;">Correlation Reference: ${escapeHtml(correlationId)}</span>`
              : ""
          }
        </td>
      </tr>
    </table>
  `.trim();

  // =========================================================================
  // 4. PLAIN-TEXT ALTERNATIVE
  // =========================================================================
  const contentText = `
================================================================================
INDUS INDUSTRIAL ROBOTICS — NEW LEAD NOTIFICATION
================================================================================
Hi ${leadName !== "Unspecified" ? leadName : "Engineering Team"},

Enhancing Automation Precision: Industrial RFQ & Sizing Dossier for ${leadCompany !== "Not provided" ? leadCompany : leadName}

Managing high-precision multi-axis motion and automated machine cycle times is one of the most critical aspects of modern industrial engineering.

INDUS Industrial Robotics was built to empower factory automation teams with validated motion hardware and turnkey sizing architecture.

FOUR KEY TECHNICAL & COMMERCIAL SIZING PARAMETERS:
1. Contact & Commercial Credentials:
   ${leadName} from ${leadCompany} (${location})
   Email: ${leadEmail} | Phone: ${leadPhone} | Source: ${source}

2. Target Solution & Hardware Category:
   Product Focus: ${productFocus}
   ${leadCategory ? `Category: ${leadCategory}\n` : ""}${leadIndustry ? `Industry: ${leadIndustry}\n` : ""}Quantity: ${leadQuantity || "Pilot evaluation / Custom"}

3. Timeline & Qualification Status:
   Timeline: ${leadTimeline || "Standard industrial schedule"}
   Status: ${priority.label} (${priority.description})
   Timestamp: ${submissionTime}

4. System Architecture & DealFlow:
   ${jiraKey ? `Jira Cloud Ticket: ${jiraKey} (${jiraUrl})\n` : ""}ISO 9001:2015 & CE compliant motion systems.

ENGINEERING DOSSIER & SIZING NOTES:
${requirements}

ACTIONS:
[ DISCUSS YOUR REQUIREMENTS ] -> mailto:${leadEmail}
${jiraKey ? `[ VIEW IN JIRA CLOUD ] -> ${jiraUrl}\n` : ""}
Direct line for engineering coordination: ${BRAND.phone} or WhatsApp

Sincerely,
Commercial Applications & Engineering Desk
INDUS Industrial Robotics · Precision Motion Systems
================================================================================
  `.trim();

  return wrapEmailLayout({
    title: subject,
    contentHtml,
    contentText,
    customHeaderHtml,
    customFooterHtml,
  });
}
