// INDUS Industrial Robotics — Upgraded Premium Branded Footer Banner Component
// api/_lib/email/footer.js
// Engineered with deep dark navy surface (#0B1329), high-contrast typography,
// verified contact details, clean navigation links, and mandatory compliance/unsubscribe handles.

import { BRAND, BRAND_COLORS, VERIFIED_LINKS, escapeHtml } from "./constants.js";

/**
 * Renders the reusable Premium Deep Navy Email Footer Banner.
 *
 * @param {Object} options
 * @param {string} [options.recipientEmail] - Recipient address for personalized unsubscribe handling
 * @param {boolean} [options.includeUnsubscribe] - Whether this communication is marketing/newsletter (defaults to true)
 * @param {string} [options.correlationId] - Telemetry or event correlation ID
 * @returns {string} Email-safe HTML string
 */
export function renderEmailFooter(options = {}) {
  const recipientEmail = options.recipientEmail || "";
  const includeUnsubscribe = options.includeUnsubscribe !== false;
  const correlationId = options.correlationId || null;
  const year = new Date().getFullYear();

  return `
    <!-- ===================== FOOTER BANNER ===================== -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: ${BRAND_COLORS.navyDark}; border-top: 1px solid ${BRAND_COLORS.navyBorder};">
      <!-- TOP FOOTER BRAND & POSITIONING -->
      <tr>
        <td style="padding: 36px 32px 22px 32px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
            <tr>
              <td align="left" valign="top">
                <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: #FFFFFF; display: block;">
                  ${BRAND.fullName}
                </span>
                <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.8px; color: ${BRAND_COLORS.electricCyan}; display: block; margin-top: 3px;">
                  Precision Motion &amp; Automation Technology
                </span>
                <p style="margin: 8px 0 0 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; line-height: 1.6; color: #8A96A8; max-width: 520px;">
                  ${BRAND.subTagline}<br />
                  Specialized in zero-backlash harmonic reducers, guided linear positioners, and automated multi-axis robotic cells.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- VERIFIED CONTACT & FACILITY DETAILS -->
      <tr>
        <td style="padding: 0 32px 24px 32px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: ${BRAND_COLORS.navyDeep}; border: 1px solid ${BRAND_COLORS.navyBorder}; border-radius: 6px;">
            <tr>
              <td style="padding: 18px 22px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
                  <tr>
                    <td align="left" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; line-height: 1.7; color: #DCE3ED;">
                      <strong style="color: #FFFFFF;">Engineering Support:</strong> <a href="mailto:${BRAND.email}" style="color: ${BRAND_COLORS.electricCyan}; text-decoration: none;">${BRAND.email}</a> &nbsp;|&nbsp;
                      <strong style="color: #FFFFFF;">Sales &amp; RFQ:</strong> <a href="mailto:${BRAND.salesEmail}" style="color: ${BRAND_COLORS.electricCyan}; text-decoration: none;">${BRAND.salesEmail}</a><br />
                      <strong style="color: #FFFFFF;">Telephone:</strong> ${BRAND.phone} &nbsp;|&nbsp;
                      <strong style="color: #FFFFFF;">Operating Hours:</strong> ${BRAND.supportHours}<br />
                      <strong style="color: #FFFFFF;">Engineering Facilities:</strong> ${BRAND.facility}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- VERIFIED NAVIGATION LINKS (Solutions, Engineering Resources, Contact, Book Consultation) -->
      <tr>
        <td align="center" style="padding: 14px 32px 20px 32px; border-top: 1px solid ${BRAND_COLORS.navyBorder}; border-bottom: 1px solid ${BRAND_COLORS.navyBorder};">
          <table border="0" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; line-height: 2; text-align: center;">
                <a href="${VERIFIED_LINKS.solutions}" target="_blank" rel="noopener noreferrer" style="color: ${BRAND_COLORS.electricCyan}; text-decoration: none; margin: 0 10px;">Solutions</a> &bull;
                <a href="${VERIFIED_LINKS.resources}" target="_blank" rel="noopener noreferrer" style="color: #DCE3ED; text-decoration: none; margin: 0 10px;">Engineering Resources</a> &bull;
                <a href="${VERIFIED_LINKS.contact}" target="_blank" rel="noopener noreferrer" style="color: #DCE3ED; text-decoration: none; margin: 0 10px;">Contact</a> &bull;
                <a href="${VERIFIED_LINKS.consultation}" target="_blank" rel="noopener noreferrer" style="color: ${BRAND_COLORS.precisionBlue}; text-decoration: none; margin: 0 10px;">Book Consultation</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- LEGAL, COMPLIANCE & UNSUBSCRIBE STRIP -->
      <tr>
        <td style="padding: 24px 32px 36px 32px; text-align: center;">
          <p style="margin: 0 0 10px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; line-height: 1.5; color: #64748B;">
            &copy; ${year} ${BRAND.fullName}. All rights reserved.<br />
            ISO 9001:2015 Certified &middot; CE Compliant Industrial Robotics &middot; Factory Direct Technical Support
          </p>
          <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 10px; line-height: 1.6; color: #475569;">
            ${
              includeUnsubscribe
                ? `You are receiving this official technical communication because you subscribed or requested engineering specifications on <a href="${VERIFIED_LINKS.home}" style="color: #64748B; text-decoration: underline;">${BRAND.websiteUrl}</a>.<br />
            <a href="${VERIFIED_LINKS.unsubscribe(recipientEmail)}" style="color: #94A3B8; text-decoration: underline;">Unsubscribe from engineering updates</a> &nbsp;|&nbsp; `
                : ""
            }
            <a href="${VERIFIED_LINKS.compliance}" style="color: #94A3B8; text-decoration: underline;">Privacy Policy &amp; Terms</a>
            ${correlationId ? `<br /><span style="font-family: monospace; font-size: 9px; color: #334155;">Correlation Reference: ${escapeHtml(correlationId)}</span>` : ""}
          </p>
        </td>
      </tr>
    </table>
  `.trim();
}

/**
 * Plain-text representation of the footer
 */
export function renderEmailFooterText(options = {}) {
  const recipientEmail = options.recipientEmail || "";
  const includeUnsubscribe = options.includeUnsubscribe !== false;
  const correlationId = options.correlationId || null;
  const year = new Date().getFullYear();

  return `
================================================================================
${BRAND.fullName.toUpperCase()}
Precision Motion & Automation Technology
${BRAND.subTagline}

Official Website: ${BRAND.websiteUrl}
Engineering Support: ${BRAND.email}
Sales & RFQ: ${BRAND.salesEmail}
Phone: ${BRAND.phone}
Hours: ${BRAND.supportHours}
Facilities: ${BRAND.facility}

Key Navigation:
• Solutions: ${VERIFIED_LINKS.solutions}
• Engineering Resources: ${VERIFIED_LINKS.resources}
• Contact: ${VERIFIED_LINKS.contact}
• Book Consultation: ${VERIFIED_LINKS.consultation}

(c) ${year} ${BRAND.fullName}. All rights reserved.
${
  includeUnsubscribe
    ? `To unsubscribe from engineering newsletters, visit:
${VERIFIED_LINKS.unsubscribe(recipientEmail)}\n`
    : ""
}Privacy & Terms: ${VERIFIED_LINKS.compliance}
${correlationId ? `Correlation Reference: ${correlationId}\n` : ""}================================================================================
  `.trim();
}
