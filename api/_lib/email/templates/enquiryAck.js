// INDUS Industrial Robotics — Customer Enquiry & RFQ Acknowledgement Email Template
// api/_lib/email/templates/enquiryAck.js
// Modeled directly on the Physiomatics clinical/executive email architecture:
// 1. 3-Column Top Header (Hardware Thumbnail + Centered Brand Lockup + Tinted Status Card)
// 2. Full-Width Dark Navy Tagline Ribbon Bar
// 3. Salutation, Bold Headline, and 2 Well-Spaced Narrative Paragraphs
// 4. "Four Steps in Your Engineering Evaluation" (4 White Rounded Cards with Left Icons)
// 5. Shaded Callout Box with Left Accent Border & Sizing Review Commitment
// 6. Dual Side-by-Side CTAs (Solid Precision Blue + Outline) with Direct Phone & Green WhatsApp Link
// 7. Executive Sign-Off ("Sincerely, Commercial Applications & Engineering Desk")
// 8. Dark Navy Footer with Pill Buttons, Verified Contact, Legal Links, and Sizing Disclaimer.

import { BRAND, BRAND_COLORS, EMAIL_ASSETS, VERIFIED_LINKS, escapeHtml } from "../constants.js";
import { wrapEmailLayout } from "../layout.js";

/**
 * Renders the Customer Enquiry Acknowledgement Email Template.
 *
 * @param {Object} params
 * @param {string} [params.email] - Recipient corporate email
 * @param {string} [params.name] - Recipient full name
 * @param {string} [params.company] - Company or organization name
 * @param {string} [params.type] - Enquiry or RFQ type
 * @param {string} [params.product] - Product focus or topic
 * @param {string} [params.jiraKey] - Jira Cloud issue key (e.g. DI-339)
 * @param {string} [params.correlationId] - Telemetry correlation ID
 * @returns {{ subject: string, html: string, text: string }}
 */
export function renderEnquiryAckEmail(params = {}) {
  const recipientEmail = (params.email || "").trim();
  const recipientName = (params.name || "").trim();
  const companyName = (params.company || "").trim();
  const enquiryType = params.type || "Commercial RFQ & Technical Sizing";
  const productFocus = params.product || params.topic || "Precision Motion Systems";
  const jiraKey = params.jiraKey || null;
  const correlationId = params.correlationId || jiraKey || null;

  const subject = "We Received Your Enquiry | INDUS Industrial Robotics";

  const greeting = recipientName ? `Hi ${escapeHtml(recipientName)},` : "Hi there,";

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
                        Receipt Confirmed
                      </span>
                      <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 9px; font-weight: 700; color: #246BFD; display: block; margin-top: 2px;">
                        Queued for Engineering Review
                      </span>
                      <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 8px; color: #5B6577; display: block; margin-top: 3px;">
                        &bull; ${jiraKey ? escapeHtml(jiraKey) : "Intake Logged"} &bull; Priority Queued
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
            From Technical Specification to Factory Automation &bull; Measurable Industrial Reliability
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
      ${greeting}
    </p>

    <!-- EXECUTIVE HEADLINE -->
    <h1 style="margin: 0 0 16px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 22px; font-weight: 800; line-height: 1.3; color: #101B35; letter-spacing: -0.2px;">
      Engineering Quotation Request Received for ${escapeHtml(companyName || productFocus)}
    </h1>

    <!-- EXECUTIVE CONTEXT PARAGRAPHS -->
    <p style="margin: 0 0 14px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #334155;">
      Thank you for submitting your technical sizing requirements to <strong>${BRAND.fullName}</strong>. Selecting the proper motion components, reduction ratios, and payload kinematics is critical to ensuring zero-backlash reliability and meeting target cycle times in production environments.
    </p>

    <p style="margin: 0 0 24px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #334155;">
      Our commercial applications desk has queued your enquiry for kinematics review. Below is an overview of how our engineering team processes your specifications to deliver an itemized proposal:
    </p>

    <!-- 4 SPECIFICATION CARDS SECTION (Reference Model) -->
    <h3 style="margin: 0 0 14px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; font-weight: 800; color: #101B35;">
      Four Steps in Your Engineering Evaluation:
    </h3>

    <!-- CARD 1: INTAKE CREDENTIALS & TRACKING -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="margin-bottom: 12px; background-color: #FFFFFF; border: 1px solid #DCE3ED; border-radius: 8px; box-shadow: 0 1px 3px rgba(16, 27, 53, 0.04);">
      <tr>
        <td style="padding: 16px 20px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
            <tr>
              <td width="42" valign="top" style="padding-right: 14px;">
                <div style="width: 38px; height: 38px; background-color: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 6px; text-align: center; vertical-align: middle;">
                  <span style="font-size: 18px; line-height: 38px; display: inline-block;">&#128203;</span>
                </div>
              </td>
              <td valign="top">
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; font-weight: 800; color: #246BFD; margin-bottom: 4px;">
                  Intake Record Details &amp; Account Profile
                </div>
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; line-height: 1.5; color: #5B6577;">
                  Tracking ID: <strong style="font-family: monospace; color: #101B35;">${jiraKey ? escapeHtml(jiraKey) : "DI-Recorded"}</strong> &bull;
                  ${companyName ? `Facility: <strong>${escapeHtml(companyName)}</strong> &bull; ` : ""}
                  Enquiry Type: <strong>${escapeHtml(enquiryType)}</strong>.
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- CARD 2: KINEMATIC & PAYLOAD VERIFICATION -->
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
                  Kinematic Sizing &amp; Hardware Selection
                </div>
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; line-height: 1.5; color: #5B6577;">
                  Solution Focus: <strong>${escapeHtml(productFocus)}</strong>.<br />
                  Our engineers verify motor inertia matching, torque capacity, and axis speed curves to safeguard your machine takt time.
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- CARD 3: 3D CAD & PROPOSAL PREPARATION -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="margin-bottom: 12px; background-color: #FFFFFF; border: 1px solid #DCE3ED; border-radius: 8px; box-shadow: 0 1px 3px rgba(16, 27, 53, 0.04);">
      <tr>
        <td style="padding: 16px 20px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
            <tr>
              <td width="42" valign="top" style="padding-right: 14px;">
                <div style="width: 38px; height: 38px; background-color: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 6px; text-align: center; vertical-align: middle;">
                  <span style="font-size: 18px; line-height: 38px; display: inline-block;">&#128202;</span>
                </div>
              </td>
              <td valign="top">
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; font-weight: 800; color: #246BFD; margin-bottom: 4px;">
                  Itemized Proposal &amp; Technical Dossier
                </div>
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; line-height: 1.5; color: #5B6577;">
                  You will receive verified motor-reducer sizing sheets, 3D envelope references, and formal commercial pricing delivered straight to your inbox.
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- CARD 4: DIRECT ARCHITECT COORDINATION -->
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
                  Direct Engineering Desk Coordination
                </div>
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; line-height: 1.5; color: #5B6577;">
                  If custom mounting flanges, hollow-shaft cabling, or specialized fieldbus integrations are required, an applications specialist is on standby to assist.
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- HIGHLIGHTED CALLOUT BOX (Reference Model) -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="margin: 20px 0 24px 0; background-color: #F8FAFC; border: 1px solid #E2E8F0; border-left: 4px solid #246BFD; border-radius: 6px;">
      <tr>
        <td style="padding: 18px 22px;">
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; font-weight: 800; color: #101B35; margin-bottom: 6px;">
            Collaborate on Your Machine Requirements
          </div>
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; line-height: 1.6; color: #334155;">
            Every manufacturing cell has unique kinematics. If you have urgent production deadlines or need immediate technical clarification, our engineering desk is directly accessible via phone or WhatsApp.
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
                      <a href="${VERIFIED_LINKS.solutions}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 14px 28px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: #FFFFFF; text-decoration: none; border-radius: 6px; line-height: 100%;">
                        Explore Our Solutions &rarr;
                      </a>
                    </td>
                  </tr>
                </table>
              </td>

              <!-- SECONDARY BUTTON: BOOK CONSULTATION -->
              <td align="center" style="padding: 0 8px 10px 8px;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td align="center" bgcolor="#FFFFFF" style="border: 1.5px solid #246BFD; border-radius: 6px; padding: 0;">
                      <a href="${VERIFIED_LINKS.consultation}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 12.5px 22px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: #246BFD; text-decoration: none; border-radius: 6px; line-height: 100%;">
                        Book a Video Consultation
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
            <a href="${VERIFIED_LINKS.unsubscribe(recipientEmail)}" style="color: #8A96A8; text-decoration: none; margin: 0 6px;">Unsubscribe</a>
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
WE RECEIVED YOUR ENQUIRY | INDUS INDUSTRIAL ROBOTICS
================================================================================
${greeting}

Thank you for submitting your engineering inquiry to ${BRAND.fullName}.

INTAKE RECORD DETAILS:
${jiraKey ? `• Tracking Reference: ${jiraKey}\n` : ""}• Enquiry Type: ${enquiryType}
${companyName ? `• Company / Facility: ${companyName}\n` : ""}• Product Focus: ${productFocus}
• Status: Received & Queued for Engineering Kinematic Review

FOUR STEPS IN YOUR EVALUATION:
1. Intake Reference & Account Profile
2. Kinematic Sizing & Hardware Selection
3. Itemized Proposal & Technical Dossier
4. Direct Engineering Desk Coordination

Direct Engineering Office:
Email: ${BRAND.email} | Phone: ${BRAND.phone} | Website: ${BRAND.websiteUrl}

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
