// INDUS Industrial Robotics — Consultation Appointment Confirmation Email Template
// api/_lib/email/templates/appointmentConfirmation.js

import { BRAND, BRAND_COLORS, VERIFIED_LINKS, escapeHtml } from "../constants.js";
import { renderCTAButton } from "../buttons.js";
import { wrapEmailLayout } from "../layout.js";

export function renderAppointmentConfirmationEmail(params = {}) {
  const recipientEmail = (params.companyEmail || params.email || "").trim();
  const customerName = (params.customerName || params.fullName || params.name || "").trim();
  const companyName = (params.companyName || params.company || "").trim();
  const bookingId = params.bookingId || "INDUS-BC-CONFIRMED";
  const appointmentDate = params.appointmentDate || params.selectedDate || "Scheduled Date";
  const appointmentTime = params.appointmentTime || params.selectedSlot || "Scheduled Slot";
  const timezone = params.timezone || "Asia/Kolkata (IST)";
  const consultationMode = params.consultationMode || "Google Meet (Online Video)";
  const googleMeetUrl = params.googleMeetUrl || "https://meet.google.com";
  const consultationPurpose =
    params.consultationPurpose || params.robotCategory || "Robotics Architecture & Kinematic Sizing";
  const jiraTicketKey = params.jiraTicketKey || null;

  const subject = `Consultation Confirmed [${bookingId}]: ${appointmentDate} at ${appointmentTime} — ${BRAND.fullName}`;

  const greeting = customerName
    ? `Dear ${escapeHtml(customerName)},`
    : "Dear Engineering Partner,";

  const contentHtml = `
    <!-- GREETING -->
    <p style="margin: 0 0 16px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; font-weight: 600; color: ${BRAND_COLORS.textDark};">
      ${greeting}
    </p>

    <p style="margin: 0 0 20px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #334155;">
      Your robotics engineering consultation appointment with <strong>${BRAND.fullName}</strong> has been officially confirmed. Details and access links are provided below:
    </p>

    <!-- APPOINTMENT SPECIFICATION CARD -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="margin: 20px 0; background-color: #F8FAFC; border: 1px solid #CBD5E1; border-top: 4px solid ${BRAND_COLORS.signalLime}; border-radius: 6px;">
      <tr>
        <td style="padding: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 10px; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase; color: ${BRAND_COLORS.signalLimeHover};">
              CONFIRMED APPOINTMENT
            </span>
            <span style="font-family: monospace; font-size: 12px; font-weight: 700; color: ${BRAND_COLORS.navyDark}; background-color: #E2E8F0; padding: 3px 8px; border-radius: 4px;">
              ${escapeHtml(bookingId)}
            </span>
          </div>

          <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.8;">
            <tr>
              <td style="padding: 4px 0; width: 32%; color: #64748B; font-weight: 600;">Date:</td>
              <td style="padding: 4px 0; color: ${BRAND_COLORS.navyDark}; font-weight: 700;">${escapeHtml(appointmentDate)}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748B; font-weight: 600;">Time Slot:</td>
              <td style="padding: 4px 0; color: ${BRAND_COLORS.navyDark}; font-weight: 700;">${escapeHtml(appointmentTime)} (${escapeHtml(timezone)})</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748B; font-weight: 600;">Session Mode:</td>
              <td style="padding: 4px 0; color: ${BRAND_COLORS.navyDark}; font-weight: 600;">${escapeHtml(consultationMode)}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748B; font-weight: 600;">Meeting Link:</td>
              <td style="padding: 4px 0;">
                <a href="${escapeHtml(googleMeetUrl)}" target="_blank" rel="noopener noreferrer" style="color: ${BRAND_COLORS.industrialBlue}; font-weight: 700; text-decoration: underline; word-break: break-all;">
                  ${escapeHtml(googleMeetUrl)}
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748B; font-weight: 600;">Company:</td>
              <td style="padding: 4px 0; color: ${BRAND_COLORS.navyDark};">${escapeHtml(companyName || "Individual / Not specified")}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748B; font-weight: 600;">Consultation Focus:</td>
              <td style="padding: 4px 0; color: ${BRAND_COLORS.navyDark};">${escapeHtml(consultationPurpose)}</td>
            </tr>
            ${
              jiraTicketKey
                ? `
            <tr>
              <td style="padding: 4px 0; color: #64748B; font-weight: 600;">Jira Ticket Key:</td>
              <td style="padding: 4px 0; font-family: monospace; color: #0284C7; font-weight: 600;">${escapeHtml(jiraTicketKey)}</td>
            </tr>`
                : ""
            }
          </table>

          <div style="margin-top: 20px; text-align: left;">
            ${renderCTAButton("Join Google Meet Call", googleMeetUrl, "primary")}
          </div>
        </td>
      </tr>
    </table>

    <!-- PREPARATION GUIDELINES -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="margin: 24px 0 16px 0;">
      <tr>
        <td>
          <h3 style="margin: 0 0 10px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: ${BRAND_COLORS.navyDark};">
            How to Prepare for Your Session
          </h3>
          <ul style="margin: 0; padding-left: 18px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.6; color: #475569;">
            <li><strong>Kinematic Requirements:</strong> Have your target payload (kg), reach (mm), cycle time, and repeatability tolerances on hand.</li>
            <li><strong>Physical Envelope &amp; Mountings:</strong> If CAD models or cell drawings exist, feel free to share them during our video screen share.</li>
            <li><strong>Controls Integration:</strong> Note your preferred fieldbus protocol (EtherCAT, PROFINET, CANopen, or Ethernet/IP).</li>
          </ul>
        </td>
      </tr>
    </table>

    <p style="margin: 18px 0 0 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.6; color: #334155;">
      Need to reschedule or add colleagues? Reply directly to this email or contact us at <a href="mailto:${BRAND.email}" style="color: ${BRAND_COLORS.industrialBlue};">${BRAND.email}</a>.
    </p>
  `.trim();

  const contentText = `
${greeting}

Your robotics engineering consultation appointment with ${BRAND.fullName} has been confirmed.

APPOINTMENT CONFIRMATION:
• Booking ID: ${bookingId}
• Date: ${appointmentDate}
• Time Slot: ${appointmentTime} (${timezone})
• Mode: ${consultationMode}
• Google Meet Link: ${googleMeetUrl}
• Company: ${companyName || "Individual / Not specified"}
• Purpose: ${consultationPurpose}
${jiraTicketKey ? `• Jira Ticket Key: ${jiraTicketKey}\n` : ""}
HOW TO PREPARE:
1. Kinematic Requirements: Target payload (kg), reach (mm), cycle time, repeatability.
2. Cell Geometry: Cell drawings or mechanical CAD models.
3. Network Protocols: EtherCAT, PROFINET, CANopen, or Ethernet/IP.

Questions or rescheduling:
Email: ${BRAND.email}
Phone: ${BRAND.phone}
  `.trim();

  return wrapEmailLayout({
    title: subject,
    contentHtml,
    contentText,
    headerOptions: {
      badge: "CONSULTATION CONFIRMED",
      headline: "Robotics Architecture Consultation",
      subheadline:
        "Your technical appointment has been confirmed with INDUS systems engineering.",
    },
    footerOptions: {
      recipientEmail,
      includeUnsubscribe: false,
      correlationId: bookingId,
    },
  });
}
