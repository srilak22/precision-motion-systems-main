// INDUS Industrial Robotics — Enquiry & RFQ Acknowledgement Email Template
// api/_lib/email/templates/enquiryAck.js

import { BRAND, BRAND_COLORS, VERIFIED_LINKS, escapeHtml } from "../constants.js";
import { renderCTAButton } from "../buttons.js";
import { wrapEmailLayout } from "../layout.js";

export function renderEnquiryAckEmail(params = {}) {
  const recipientEmail = (params.email || "").trim();
  const recipientName = (params.name || "").trim();
  const companyName = (params.company || "").trim();
  const enquiryType = params.type || "Commercial RFQ & Technical Sizing";
  const productFocus = params.product || params.topic || "Precision Motion Systems";
  const jiraKey = params.jiraKey || null;
  const correlationId = params.correlationId || jiraKey || null;

  const subject = "We Received Your Enquiry | INDUS Industrial Robotics";

  const greeting = recipientName
    ? `Dear ${escapeHtml(recipientName)},`
    : "Dear Engineering Colleague,";

  const contentHtml = `
    <!-- GREETING -->
    <p style="margin: 0 0 16px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; font-weight: 600; color: ${BRAND_COLORS.textDark};">
      ${greeting}
    </p>

    <p style="margin: 0 0 18px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #334155;">
      Thank you for submitting your engineering inquiry to <strong>${BRAND.fullName}</strong>. Our technical applications team has received your specifications and is evaluating your project requirements.
    </p>

    <!-- INTAKE RECEIPT DETAILS CARD -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="margin: 20px 0; background-color: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 6px;">
      <tr>
        <td style="padding: 20px 24px;">
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase; color: ${BRAND_COLORS.industrialBlue}; margin-bottom: 8px;">
            Intake Record Details
          </div>
          
          <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.6;">
            ${
              jiraKey
                ? `
            <tr>
              <td style="padding: 6px 0; width: 35%; color: #64748B; font-weight: 600;">Tracking Reference:</td>
              <td style="padding: 6px 0; color: ${BRAND_COLORS.navyDark}; font-weight: 700; font-family: monospace;">${escapeHtml(jiraKey)}</td>
            </tr>`
                : ""
            }
            <tr>
              <td style="padding: 6px 0; width: 35%; color: #64748B; font-weight: 600;">Enquiry Type:</td>
              <td style="padding: 6px 0; color: ${BRAND_COLORS.navyDark}; font-weight: 600;">${escapeHtml(enquiryType)}</td>
            </tr>
            ${
              companyName
                ? `
            <tr>
              <td style="padding: 6px 0; color: #64748B; font-weight: 600;">Company / Facility:</td>
              <td style="padding: 6px 0; color: ${BRAND_COLORS.navyDark};">${escapeHtml(companyName)}</td>
            </tr>`
                : ""
            }
            <tr>
              <td style="padding: 6px 0; color: #64748B; font-weight: 600;">Product / Domain:</td>
              <td style="padding: 6px 0; color: ${BRAND_COLORS.navyDark};">${escapeHtml(productFocus)}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748B; font-weight: 600;">Status:</td>
              <td style="padding: 6px 0; color: ${BRAND_COLORS.precisionBlue}; font-weight: 600;">Received &amp; Queued for Engineering Review</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- NEXT STEPS TIMELINE -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="margin: 24px 0 16px 0;">
      <tr>
        <td>
          <h3 style="margin: 0 0 10px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: ${BRAND_COLORS.navyDark};">
            What Happens Next
          </h3>
          <ol style="margin: 0; padding-left: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.6; color: #475569;">
            <li style="margin-bottom: 6px;"><strong>Kinematic &amp; Payload Verification:</strong> Our application engineers review your load, speed, duty cycle, and mounting geometry.</li>
            <li style="margin-bottom: 6px;"><strong>Formal Proposal &amp; Sizing Sheet:</strong> We prepare motor-reducer sizing sheets, 3D envelope references, and formal commercial pricing.</li>
            <li><strong>Direct Engineering Coordination:</strong> If needed, an application architect will reach out to discuss custom integration requirements.</li>
          </ol>
        </td>
      </tr>
    </table>

    <!-- EXPLORE WHILE WAITING -->
    <p style="margin: 20px 0 0 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.6; color: #334155;">
      In the meantime, you can explore our complete product catalogue or run physics sizing calculations:
    </p>

    <div style="text-align: center; margin-top: 16px;">
      ${renderCTAButton("Explore Our Solutions", VERIFIED_LINKS.solutions, "primary")}
    </div>
  `.trim();

  const contentText = `
${greeting}

Thank you for submitting your engineering inquiry to ${BRAND.fullName}. Our technical applications team has received your specifications and is evaluating your project requirements.

INTAKE DETAILS:
${jiraKey ? `• Tracking Reference: ${jiraKey}\n` : ""}• Enquiry Type: ${enquiryType}
${companyName ? `• Company / Facility: ${companyName}\n` : ""}• Product / Domain: ${productFocus}
• Status: Received & Queued for Engineering Review

WHAT HAPPENS NEXT:
1. Kinematic & Payload Verification: Our application engineers review your specifications.
2. Formal Proposal & Sizing Sheet: We provide sizing calculation sheets and commercial quotes.
3. Direct Engineering Coordination: An application architect will coordinate via email or phone.

Direct Engineering Office:
Email: ${BRAND.email} | ${BRAND.salesEmail}
Phone: ${BRAND.phone}
Website: ${BRAND.websiteUrl}
  `.trim();

  return wrapEmailLayout({
    title: subject,
    contentHtml,
    contentText,
    headerOptions: {
      badge: "ENQUIRY RECEIVED",
      headline: "Engineering Sizing & Proposal Intake",
      subheadline:
        "Your project specifications have been logged with the INDUS engineering applications desk.",
    },
    footerOptions: {
      recipientEmail,
      includeUnsubscribe: false,
      correlationId,
    },
  });
}
