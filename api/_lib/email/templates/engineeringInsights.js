// INDUS Industrial Robotics — Engineering Insights Newsletter Template
// api/_lib/email/templates/engineeringInsights.js

import { BRAND, BRAND_COLORS, VERIFIED_LINKS, escapeHtml } from "../constants.js";
import { renderCTAButton } from "../buttons.js";
import { wrapEmailLayout } from "../layout.js";

export function renderEngineeringInsightsEmail(params = {}) {
  const recipientEmail = (params.email || "").trim();
  const correlationId = params.correlationId || null;

  const subject = `Engineering Insights from ${BRAND.fullName}`;

  const contentHtml = `
    <!-- INTRO STATEMENT -->
    <p style="margin: 0 0 16px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #334155;">
      Discover engineering insights, industrial automation solutions, and precision motion technologies designed to help manufacturers improve operational efficiency, repeatability, and production quality.
    </p>

    <!-- CONTENT CARDS (4 STRUCTURED PILLARS FROM PHASE 3 SPECIFICATION) -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="margin: 24px 0 16px 0;">
      
      <!-- CARD 1: PRECISION MOTION SYSTEMS -->
      <tr>
        <td style="padding-bottom: 16px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: #FFFFFF; border: 1px solid #E2E8F0; border-left: 4px solid ${BRAND_COLORS.industrialBlue}; border-radius: 4px;">
            <tr>
              <td style="padding: 18px 20px;">
                <h3 style="margin: 0 0 6px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; font-weight: 700; color: ${BRAND_COLORS.navyDark};">
                  1. Precision Motion Systems
                </h3>
                <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.6; color: #475569;">
                  Explore motion control technologies and engineering approaches for accurate, reliable industrial movement. Learn how zero-backlash gearing and multi-axis trajectory planning minimize vibration and enhance cycle repeatability.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- CARD 2: INDUSTRIAL AUTOMATION APPLICATIONS -->
      <tr>
        <td style="padding-bottom: 16px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: #FFFFFF; border: 1px solid #E2E8F0; border-left: 4px solid ${BRAND_COLORS.signalLimeHover}; border-radius: 4px;">
            <tr>
              <td style="padding: 18px 20px;">
                <h3 style="margin: 0 0 6px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; font-weight: 700; color: ${BRAND_COLORS.navyDark};">
                  2. Industrial Automation Applications
                </h3>
                <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.6; color: #475569;">
                  Discover how robotics and automation can support material handling, assembly, inspection, and production workflows. Case architectures cover automotive body-in-white (BIW), electronics cleanrooms, and automated palletizing lines.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- CARD 3: ENGINEERING SPECIFICATIONS -->
      <tr>
        <td style="padding-bottom: 16px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: #FFFFFF; border: 1px solid #E2E8F0; border-left: 4px solid #F59E0B; border-radius: 4px;">
            <tr>
              <td style="padding: 18px 20px;">
                <h3 style="margin: 0 0 6px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; font-weight: 700; color: ${BRAND_COLORS.navyDark};">
                  3. Engineering Specifications
                </h3>
                <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.6; color: #475569;">
                  Explore relevant technical specifications, application requirements, integration considerations, and use cases. Utilize our online engineering calculators to verify torque margins, payload inertia, and kinematics constraints.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- CARD 4: CONSULTATION AND PROJECT SUPPORT -->
      <tr>
        <td>
          <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: #FFFFFF; border: 1px solid #E2E8F0; border-left: 4px solid ${BRAND_COLORS.navyDark}; border-radius: 4px;">
            <tr>
              <td style="padding: 18px 20px;">
                <h3 style="margin: 0 0 6px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; font-weight: 700; color: ${BRAND_COLORS.navyDark};">
                  4. Consultation and Project Support
                </h3>
                <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.6; color: #475569;">
                  Connect with our systems engineering team to discuss application requirements, technical questions, and potential automation opportunities. We provide direct kinematic sizing and system architecture reviews.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- DUAL CTA BUTTONS -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="margin-top: 24px;">
      <tr>
        <td align="center">
          <table border="0" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td style="padding: 0 8px;">
                ${renderCTAButton("View Engineering Insights", VERIFIED_LINKS.resources, "primary")}
              </td>
              <td style="padding: 0 8px;">
                ${renderCTAButton("Book a Consultation", VERIFIED_LINKS.consultation, "blue")}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `.trim();

  const contentText = `
${subject}
Headline: Advancing Industrial Automation with Precision Engineering

Discover engineering insights, industrial automation solutions, and precision motion technologies designed to help manufacturers improve operational efficiency, repeatability, and production quality.

1. PRECISION MOTION SYSTEMS
Explore motion control technologies and engineering approaches for accurate, reliable industrial movement. Learn how zero-backlash gearing and multi-axis trajectory planning minimize vibration and enhance cycle repeatability.

2. INDUSTRIAL AUTOMATION APPLICATIONS
Discover how robotics and automation can support material handling, assembly, inspection, and production workflows. Case architectures cover automotive body-in-white (BIW), electronics cleanrooms, and automated palletizing lines.

3. ENGINEERING SPECIFICATIONS
Explore relevant technical specifications, application requirements, integration considerations, and use cases. Utilize our online engineering calculators to verify torque margins, payload inertia, and kinematics constraints.

4. CONSULTATION AND PROJECT SUPPORT
Connect with our systems engineering team to discuss application requirements, technical questions, and potential automation opportunities. We provide direct kinematic sizing and system architecture reviews.

EXPLORE ONLINE:
• Engineering Insights & Resources: ${VERIFIED_LINKS.resources}
• Interactive Physics Calculators: ${VERIFIED_LINKS.calculators}
• Book Technical Consultation: ${VERIFIED_LINKS.consultation}
  `.trim();

  return wrapEmailLayout({
    title: subject,
    contentHtml,
    contentText,
    headerOptions: {
      badge: "ENGINEERING INSIGHTS",
      headline: "Advancing Industrial Automation with Precision Engineering",
      subheadline:
        "Technical analysis, kinematics architectures, and application reviews from INDUS engineering.",
    },
    footerOptions: {
      recipientEmail,
      includeUnsubscribe: true,
      correlationId,
    },
  });
}
