// INDUS Industrial Robotics — Technical Brochure & Catalogue Delivery Email Template
// api/_lib/email/templates/brochureDelivery.js

import { BRAND, BRAND_COLORS, VERIFIED_LINKS, EMAIL_ASSETS, escapeHtml } from "../constants.js";
import { renderCTAButton } from "../buttons.js";
import { wrapEmailLayout } from "../layout.js";

export function renderBrochureDeliveryEmail(params = {}) {
  const recipientEmail = (params.email || "").trim();
  const recipientName = (params.name || "").trim();
  const requestedItem =
    params.itemTitle || "INDUS Master Robotics Product Catalogue (2026 Edition)";
  const correlationId = params.correlationId || null;

  const subject = `Your Requested Catalogue: ${requestedItem} — ${BRAND.fullName}`;

  const greeting = recipientName
    ? `Dear ${escapeHtml(recipientName)},`
    : "Dear Engineering Colleague,";

  const contentHtml = `
    <!-- GREETING -->
    <p style="margin: 0 0 16px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; font-weight: 600; color: ${BRAND_COLORS.textDark};">
      ${greeting}
    </p>

    <p style="margin: 0 0 18px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #334155;">
      Thank you for your interest in <strong>${BRAND.fullName}</strong>. Your requested technical documentation is available for immediate download below:
    </p>

    <!-- BROCHURE / CATALOGUE ASSET CARD -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="margin: 20px 0; background-color: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 6px;">
      <tr>
        <td style="padding: 24px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
            <tr>
              <td valign="top" style="padding-right: 16px;">
                <span style="display: inline-block; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 10px; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase; color: ${BRAND_COLORS.industrialBlue}; background-color: #DBEAFE; padding: 3px 8px; border-radius: 3px; margin-bottom: 8px;">
                  TECHNICAL SPECIFICATION &middot; PDF
                </span>
                <h2 style="margin: 0 0 8px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 17px; font-weight: 700; color: ${BRAND_COLORS.navyDark};">
                  ${escapeHtml(requestedItem)}
                </h2>
                <p style="margin: 0 0 14px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.5; color: #475569;">
                  Comprehensive engineering reference detailing mechanical CAD dimensions, joint torque-speed curves, rated repeatability, thermal ratings, and pinout schematics across all product lines.
                </p>
                <div style="font-family: monospace; font-size: 11px; color: #64748B; margin-bottom: 16px;">
                  Format: High-Res PDF &middot; Edition: 2026 &middot; Direct Digital Access
                </div>
                ${renderCTAButton("Download Technical Catalogue", VERIFIED_LINKS.catalogue, "primary")}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- INCLUDED DOMAINS -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="margin: 24px 0 16px 0;">
      <tr>
        <td>
          <h3 style="margin: 0 0 10px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: ${BRAND_COLORS.navyDark};">
            Included Product Families &amp; Technical Coverage:
          </h3>
          <ul style="margin: 0; padding-left: 18px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.6; color: #475569;">
            <li><strong>Linear &amp; Rotary Actuators:</strong> Ball screw, belt driven, and integrated servo joint modules.</li>
            <li><strong>Precision Reducers:</strong> Zero-backlash harmonic drive and high-shock cycloidal speed reducers.</li>
            <li><strong>Robotic Drive Wheels:</strong> Mecanum and omnidirectional AGV drive wheel assemblies.</li>
            <li><strong>Robotic Arms &amp; Cobots:</strong> 6-axis articulated arms and lightweight collaborative robots.</li>
            <li><strong>Multi-Axis Motion Controllers:</strong> EtherCAT / CANopen networked motion controllers and PLCs.</li>
          </ul>
        </td>
      </tr>
    </table>

    <!-- NEXT STEPS -->
    <p style="margin: 20px 0 0 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.6; color: #334155;">
      Need application-specific sizing or CAD 3D step files for your ongoing machine design? Connect with our systems architects directly or book a sizing review:
    </p>

    <div style="text-align: center; margin-top: 16px;">
      ${renderCTAButton("Book a Consultation", VERIFIED_LINKS.consultation, "blue")}
    </div>
  `.trim();

  const contentText = `
${greeting}

Thank you for your interest in ${BRAND.fullName}. Your requested technical documentation is available for immediate download:

REQUESTED DOCUMENT:
${requestedItem}
Format: High-Resolution PDF
Verified Download Link: ${VERIFIED_LINKS.catalogue}

INCLUDED PRODUCT FAMILIES:
1. Linear & Rotary Actuators (Ball screw & belt driven)
2. Precision Reducers (Zero-backlash harmonic & cycloidal)
3. Robotic Drive Wheels (Mecanum & AGV drive modules)
4. Robotic Arms & Cobots (6-axis articulated & collaborative)
5. Multi-Axis Motion Controllers (EtherCAT & CANopen)

Need application-specific sizing or CAD models?
Schedule an engineering consultation: ${VERIFIED_LINKS.consultation}
Direct Contact: ${BRAND.email} | ${BRAND.phone}
  `.trim();

  return wrapEmailLayout({
    title: subject,
    contentHtml,
    contentText,
    headerOptions: {
      badge: "CATALOGUE DELIVERY",
      headline: "Technical Brochure & Master Catalogue",
      subheadline:
        "Official engineering documentation and product specifications delivered from INDUS Robotics.",
    },
    footerOptions: {
      recipientEmail,
      includeUnsubscribe: false,
      correlationId,
    },
  });
}
