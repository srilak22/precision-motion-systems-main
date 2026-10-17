// INDUS Industrial Robotics — Upgraded Welcome Newsletter Subscriber Email Template
// api/_lib/email/templates/welcome.js
// Engineered for maximum readability, high contrast, verified technical features, and clear CTAs.

import { BRAND, BRAND_COLORS, VERIFIED_LINKS, escapeHtml } from "../constants.js";
import { renderCTAButton } from "../buttons.js";
import { wrapEmailLayout } from "../layout.js";

export function renderWelcomeEmail(params = {}) {
  const recipientEmail = (params.email || "").trim();
  const recipientName = (params.name || "").trim();
  const correlationId = params.correlationId || null;

  const subject = `Welcome to INDUS Industrial Robotics — Engineering Insights & Precision Motion`;

  const salutation = recipientName
    ? `Dear ${escapeHtml(recipientName)},`
    : "Dear Subscriber,";

  const contentHtml = `
    <!-- MAIN TITLE -->
    <h2 style="margin: 0 0 16px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 20px; font-weight: 800; color: ${BRAND_COLORS.navyDark}; line-height: 1.3;">
      Welcome to INDUS Industrial Robotics
    </h2>

    <!-- SALUTATION & OPENING -->
    <p style="margin: 0 0 16px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 600; color: ${BRAND_COLORS.textDark};">
      ${salutation}
    </p>

    <p style="margin: 0 0 24px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #334155;">
      Thank you for connecting with <strong>${BRAND.fullName}</strong>. We share engineering insights, industrial automation applications, and precision motion technologies relevant to modern manufacturing.
    </p>

    <!-- WHAT YOU CAN EXPECT (HIGHLIGHT BOX) -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="margin: 0 0 28px 0; background-color: #F8FAFC; border: 1px solid #E2E8F0; border-left: 4px solid ${BRAND_COLORS.industrialBlue}; border-radius: 4px;">
      <tr>
        <td style="padding: 20px 24px;">
          <h3 style="margin: 0 0 12px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: ${BRAND_COLORS.navyDark};">
            What you can expect
          </h3>
          <ul style="margin: 0; padding-left: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.65; color: #475569;">
            <li style="margin-bottom: 6px;">Engineering calculators and technical resources, where available.</li>
            <li style="margin-bottom: 6px;">Industrial robotics applications and automation use cases.</li>
            <li style="margin-bottom: 6px;">Engineering specifications and integration considerations.</li>
            <li>Relevant product updates and consultation opportunities.</li>
          </ul>
        </td>
      </tr>
    </table>

    <!-- EXPLORE OUR ENGINEERING RESOURCES SECTION -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="margin: 0 0 20px 0;">
      <tr>
        <td style="padding-bottom: 14px;">
          <h3 style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: ${BRAND_COLORS.navyDark};">
            Explore our engineering resources
          </h3>
        </td>
      </tr>
      <tr>
        <td>
          <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
            <!-- RESOURCE CARD 1: CALCULATORS -->
            <tr>
              <td style="padding: 16px 20px; background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 6px; margin-bottom: 12px;">
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.2px; color: ${BRAND_COLORS.industrialBlue}; margin-bottom: 4px;">
                  Online Sizing Tools
                </div>
                <h4 style="margin: 0 0 6px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 700; color: ${BRAND_COLORS.navyDark};">
                  Interactive Engineering Calculators
                </h4>
                <p style="margin: 0 0 10px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; line-height: 1.5; color: #64748B;">
                  Calculate joint torque, motor power requirements, cycle times, and mechanical inertia for your multi-axis robotics cells.
                </p>
                <a href="${VERIFIED_LINKS.calculators}" target="_blank" rel="noopener noreferrer" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 700; color: ${BRAND_COLORS.industrialBlue}; text-decoration: none;">
                  Launch Engineering Calculators &rarr;
                </a>
              </td>
            </tr>

            <tr><td style="height: 12px; font-size: 0; line-height: 0;">&nbsp;</td></tr>

            <!-- RESOURCE CARD 2: ARCHITECTURE EXPLORER -->
            <tr>
              <td style="padding: 16px 20px; background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 6px; margin-bottom: 12px;">
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.2px; color: ${BRAND_COLORS.signalLimeHover}; margin-bottom: 4px;">
                  System Kinematics
                </div>
                <h4 style="margin: 0 0 6px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 700; color: ${BRAND_COLORS.navyDark};">
                  5-Tier Architecture Explorer
                </h4>
                <p style="margin: 0 0 10px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; line-height: 1.5; color: #64748B;">
                  Explore integration across physical mechanics, drive electronics, motion controllers, and industrial fieldbus protocols.
                </p>
                <a href="${VERIFIED_LINKS.architectureExplorer}" target="_blank" rel="noopener noreferrer" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 700; color: ${BRAND_COLORS.industrialBlue}; text-decoration: none;">
                  Explore 5-Tier Architecture &rarr;
                </a>
              </td>
            </tr>

            <tr><td style="height: 12px; font-size: 0; line-height: 0;">&nbsp;</td></tr>

            <!-- RESOURCE CARD 3: AUTOMATION SOLUTIONS -->
            <tr>
              <td style="padding: 16px 20px; background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 6px;">
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.2px; color: #D97706; margin-bottom: 4px;">
                  Production Systems
                </div>
                <h4 style="margin: 0 0 6px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 700; color: ${BRAND_COLORS.navyDark};">
                  Robotics Applications &amp; Automated Cells
                </h4>
                <p style="margin: 0 0 10px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; line-height: 1.5; color: #64748B;">
                  Review turnkey automation solutions for robotic welding cells, high-speed palletizing systems, and cleanroom semiconductor assembly.
                </p>
                <a href="${VERIFIED_LINKS.solutions}" target="_blank" rel="noopener noreferrer" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 700; color: ${BRAND_COLORS.industrialBlue}; text-decoration: none;">
                  View Industrial Solutions &rarr;
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- PROMINENT PRIMARY CTA + SECONDARY LINK -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="margin: 28px 0 12px 0;">
      <tr>
        <td align="center">
          ${renderCTAButton("Explore Our Solutions", VERIFIED_LINKS.solutions, "primary")}
          <p style="margin: 8px 0 0 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; color: #64748B;">
            Need application sizing support? <a href="${VERIFIED_LINKS.consultation}" target="_blank" rel="noopener noreferrer" style="color: ${BRAND_COLORS.industrialBlue}; font-weight: 600; text-decoration: underline;">Book an Engineering Consultation &rarr;</a>
          </p>
        </td>
      </tr>
    </table>
  `.trim();

  const contentText = `
Welcome to INDUS Industrial Robotics

${salutation}

Thank you for connecting with INDUS Industrial Robotics. We share engineering insights, industrial automation applications, and precision motion technologies relevant to modern manufacturing.

WHAT YOU CAN EXPECT:
• Engineering calculators and technical resources, where available.
• Industrial robotics applications and automation use cases.
• Engineering specifications and integration considerations.
• Relevant product updates and consultation opportunities.

EXPLORE OUR ENGINEERING RESOURCES:
1. Interactive Engineering Calculators: ${VERIFIED_LINKS.calculators}
   Calculate joint torque, motor power requirements, cycle times, and mechanical inertia.

2. 5-Tier Architecture Explorer: ${VERIFIED_LINKS.architectureExplorer}
   Explore integration across physical mechanics, drive electronics, and motion controllers.

3. Robotics Applications & Automated Cells: ${VERIFIED_LINKS.solutions}
   Review automated robotic welding cells, high-speed palletizing, and assembly solutions.

PRIMARY ACTION:
Explore Our Solutions: ${VERIFIED_LINKS.solutions}
Book an Engineering Consultation: ${VERIFIED_LINKS.consultation}

Connect with our engineering architects anytime at ${BRAND.email} or call ${BRAND.phone}.
  `.trim();

  return wrapEmailLayout({
    title: subject,
    contentHtml,
    contentText,
    headerOptions: {
      badge: "NEWSLETTER WELCOME",
      headline: "Advancing Industrial Automation with Precision Engineering",
      subheadline:
        "Explore precision motion technologies, industrial robotics applications, and engineering insights for modern manufacturing.",
      showCta: true,
      ctaText: "EXPLORE OUR SOLUTIONS",
      ctaUrl: VERIFIED_LINKS.solutions,
    },
    footerOptions: {
      recipientEmail,
      includeUnsubscribe: true,
      correlationId,
    },
  });
}
