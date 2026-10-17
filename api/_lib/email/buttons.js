// INDUS Industrial Robotics — Email-Safe CTA Button Components
// api/_lib/email/buttons.js
// Table-based bulletproof buttons compatible with Gmail, Apple Mail, Outlook, and mobile clients.

import { BRAND_COLORS, escapeHtml } from "./constants.js";

/**
 * Renders an email-client compatible CTA button using HTML table structure.
 * Supports primary (Signal Lime), secondary (Industrial Blue), dark (Navy), and outline variants.
 */
export function renderCTAButton(label, url, variant = "primary") {
  const safeLabel = escapeHtml(label);
  const safeUrl = escapeHtml(url);

  let bgColor = BRAND_COLORS.precisionBlue || "#246BFD";
  let textColor = "#FFFFFF";
  let borderColor = BRAND_COLORS.precisionBlue || "#246BFD";

  if (variant === "secondary" || variant === "outline") {
    bgColor = "#FFFFFF";
    textColor = BRAND_COLORS.textDark || "#172033";
    borderColor = BRAND_COLORS.borderLight || "#DCE3ED";
  } else if (variant === "dark" || variant === "navy") {
    bgColor = BRAND_COLORS.navyDark || "#101B35";
    textColor = "#FFFFFF";
    borderColor = BRAND_COLORS.navyBorder || "#1E2E56";
  } else if (variant === "cyan" || variant === "accent") {
    bgColor = BRAND_COLORS.electricCyan || "#45C8F5";
    textColor = BRAND_COLORS.navyDark || "#101B35";
    borderColor = BRAND_COLORS.electricCyan || "#45C8F5";
  } else if (variant === "blue") {
    bgColor = BRAND_COLORS.precisionBlue || "#246BFD";
    textColor = "#FFFFFF";
    borderColor = BRAND_COLORS.precisionBlue || "#246BFD";
  }

  return `
    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin: 16px 0; border-collapse: separate;">
      <tr>
        <td align="center" bgcolor="${bgColor}" style="border: 1px solid ${borderColor}; border-radius: 4px; padding: 0;">
          <a href="${safeUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 13px 26px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: ${textColor}; text-decoration: none; border-radius: 4px; line-height: 100%;">
            ${safeLabel} &rarr;
          </a>
        </td>
      </tr>
    </table>
  `.trim();
}

/**
 * Plain-text representation of a button
 */
export function renderCTAButtonText(label, url) {
  return `[ ${label.toUpperCase()} ] -> ${url}`;
}
