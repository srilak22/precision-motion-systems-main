// INDUS Industrial Robotics — Product Updates Email Template
// api/_lib/email/templates/productUpdate.js

import { BRAND, BRAND_COLORS, VERIFIED_LINKS, EMAIL_ASSETS, escapeHtml } from "../constants.js";
import { renderCTAButton } from "../buttons.js";
import { wrapEmailLayout } from "../layout.js";

export function renderProductUpdateEmail(params = {}) {
  const recipientEmail = (params.email || "").trim();
  const correlationId = params.correlationId || null;

  const subject = `Precision Motion Product Updates — High-Rigidity Harmonic Reducers & Linear Actuators`;

  const contentHtml = `
    <!-- INTRO -->
    <p style="margin: 0 0 16px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #334155;">
      Our latest engineering release focuses on increasing torque density, reducing mechanical backlash, and extending thermal duty cycles across our core industrial motion families.
    </p>

    <!-- PRODUCT CARD 1: HARMONIC & PRECISION REDUCERS -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="margin: 20px 0; background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 6px; overflow: hidden;">
      <tr>
        <td style="padding: 0; line-height: 0;">
          <img src="${EMAIL_ASSETS.harmonicReducer}" alt="Harmonic Precision Reducer" width="680" style="width: 100%; max-width: 680px; height: auto; display: block; border: 0;" />
        </td>
      </tr>
      <tr>
        <td style="padding: 20px 24px;">
          <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 10px; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase; color: ${BRAND_COLORS.signalLimeHover};">
            Motion Transmission
          </span>
          <h2 style="margin: 4px 0 8px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 700; color: ${BRAND_COLORS.navyDark};">
            Harmonic &amp; Precision Cycloidal Reducers
          </h2>
          <p style="margin: 0 0 14px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.6; color: #475569;">
            Engineered for robotic joints requiring zero-backlash, high torque capacity, and compact axial length. Available in gear ratios from 30:1 to 160:1 with verified repeatability for precision positioning.
          </p>
          <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; border-collapse: collapse; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; margin-bottom: 14px;">
            <tr style="background-color: #F8FAFC;">
              <td style="padding: 6px 10px; border: 1px solid #E2E8F0; font-weight: 600; color: #334155;">Backlash Rating:</td>
              <td style="padding: 6px 10px; border: 1px solid #E2E8F0; color: #64748B;">&le; 10 arc-sec (Zero Backlash)</td>
              <td style="padding: 6px 10px; border: 1px solid #E2E8F0; font-weight: 600; color: #334155;">Ratios:</td>
              <td style="padding: 6px 10px; border: 1px solid #E2E8F0; color: #64748B;">30:1 &ndash; 160:1</td>
            </tr>
          </table>
          <a href="${VERIFIED_LINKS.products}" target="_blank" rel="noopener noreferrer" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 700; color: ${BRAND_COLORS.industrialBlue}; text-decoration: none;">
            View Technical Reducer Specs &rarr;
          </a>
        </td>
      </tr>
    </table>

    <!-- PRODUCT CARD 2: LINEAR ACTUATORS & STAGES -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="margin: 20px 0; background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 6px; overflow: hidden;">
      <tr>
        <td style="padding: 0; line-height: 0;">
          <img src="${EMAIL_ASSETS.linearActuator}" alt="Linear Actuator Stage" width="680" style="width: 100%; max-width: 680px; height: auto; display: block; border: 0;" />
        </td>
      </tr>
      <tr>
        <td style="padding: 20px 24px;">
          <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 10px; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase; color: ${BRAND_COLORS.industrialBlue};">
            Linear Motion
          </span>
          <h2 style="margin: 4px 0 8px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 700; color: ${BRAND_COLORS.navyDark};">
            Heavy-Duty Precision Linear Actuators &amp; Guided Stages
          </h2>
          <p style="margin: 0 0 14px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.6; color: #475569;">
            Ball screw and belt driven configurations designed for factory transfer axes, pick-and-place gantries, and cleanroom positioning. Features integrated recirculating linear guides for moment rigidity.
          </p>
          <a href="${VERIFIED_LINKS.products}" target="_blank" rel="noopener noreferrer" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 700; color: ${BRAND_COLORS.industrialBlue}; text-decoration: none;">
            View Linear Motion Models &rarr;
          </a>
        </td>
      </tr>
    </table>

    <!-- CTA ACTION -->
    <div style="text-align: center; margin-top: 24px;">
      ${renderCTAButton("Explore Our Solutions", VERIFIED_LINKS.solutions, "primary")}
    </div>
  `.trim();

  const contentText = `
${subject}

Our latest engineering release focuses on increasing torque density, reducing mechanical backlash, and extending thermal duty cycles across our core industrial motion families.

1. HARMONIC & PRECISION REDUCERS
• Application: Robotic joints requiring zero-backlash, high torque capacity, and compact axial length.
• Backlash Rating: <= 10 arc-sec (Zero Backlash)
• Ratios: 30:1 to 160:1
• Specifications: ${VERIFIED_LINKS.products}

2. HEAVY-DUTY LINEAR ACTUATORS & GUIDED STAGES
• Application: Factory transfer axes, pick-and-place gantries, and cleanroom positioning.
• Mechanisms: Ball screw and belt driven with recirculating linear guides.
• Specifications: ${VERIFIED_LINKS.products}

Explore all product families and download CAD geometries at:
${VERIFIED_LINKS.products}
  `.trim();

  return wrapEmailLayout({
    title: subject,
    contentHtml,
    contentText,
    headerOptions: {
      badge: "PRODUCT UPDATE",
      headline: "Precision Motion & Component Innovations",
      subheadline:
        "Technical releases for industrial robotics, motion reducers, and automated linear transfer axes.",
    },
    footerOptions: {
      recipientEmail,
      includeUnsubscribe: true,
      correlationId,
    },
  });
}
