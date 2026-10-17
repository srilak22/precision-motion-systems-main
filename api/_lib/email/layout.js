// INDUS Industrial Robotics — Unified Email Layout Shell
// api/_lib/email/layout.js
// 680px maximum content width, cross-client responsive container, table-based layout.

import { BRAND_COLORS, escapeHtml } from "./constants.js";
import { renderEmailHeader, renderEmailHeaderText } from "./header.js";
import { renderEmailFooter, renderEmailFooterText } from "./footer.js";

/**
 * Wraps content in the branded INDUS email shell (Header + Body + Footer).
 *
 * @param {Object} args
 * @param {string} args.title - Email <title> tag and subject context
 * @param {string} args.contentHtml - Main HTML content of the email
 * @param {string} args.contentText - Main plain-text content of the email
 * @param {Object} [args.headerOptions] - Options passed to renderEmailHeader
 * @param {Object} [args.footerOptions] - Options passed to renderEmailFooter
 * @returns {{ html: string, text: string }}
 */
export function wrapEmailLayout({
  title,
  contentHtml,
  contentText,
  headerOptions = {},
  footerOptions = {},
  customHeaderHtml = null,
  customHeaderText = null,
  customFooterHtml = null,
  customFooterText = null,
  theme = "light",
}) {
  const safeTitle = escapeHtml(title);
  const isDark = theme === "dark";
  const bodyBg = isDark ? BRAND_COLORS.navyDeep : BRAND_COLORS.surfaceLight;
  const containerBg = isDark ? BRAND_COLORS.navyDark : BRAND_COLORS.surfaceWhite;
  const containerBorder = isDark ? `1px solid ${BRAND_COLORS.navyBorder}` : `1px solid ${BRAND_COLORS.borderLight}`;
  const contentBg = isDark ? BRAND_COLORS.navyDark : BRAND_COLORS.surfaceWhite;
  const textColor = isDark ? BRAND_COLORS.surfaceWhite : BRAND_COLORS.textDark;

  const headerHtml = customHeaderHtml || renderEmailHeader(headerOptions);
  const footerHtml = customFooterHtml || renderEmailFooter(footerOptions);

  const headerText = customHeaderText || renderEmailHeaderText(headerOptions);
  const footerText = customFooterText || renderEmailFooterText(footerOptions);

  const html = `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>${safeTitle}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; background-color: ${bodyBg}; }
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; max-width: 100% !important; }
      .mobile-p-16 { padding: 16px !important; }
      .mobile-stack { display: block !important; width: 100% !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: ${bodyBg}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: ${textColor};">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: ${bodyBg}; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 24px 12px 36px 12px;">
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellspacing="0" cellpadding="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
        
        <table border="0" cellpadding="0" cellspacing="0" width="100%" class="email-container" role="presentation" style="max-width: 600px; margin: 0 auto; background-color: ${containerBg}; border: ${containerBorder}; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 20px rgba(16, 27, 53, 0.08);">
          
          <!-- HEADER BANNER -->
          <tr>
            <td style="padding: 0;">
              ${headerHtml}
            </td>
          </tr>

          <!-- MAIN CONTENT BODY -->
          <tr>
            <td style="padding: 32px 32px 24px 32px; background-color: ${contentBg};" class="mobile-p-16">
              ${contentHtml}
            </td>
          </tr>

          <!-- FOOTER BANNER -->
          <tr>
            <td style="padding: 0;">
              ${footerHtml}
            </td>
          </tr>

        </table>

        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const text = `
${headerText}

${contentText}

${footerText}
  `.trim();

  return { subject: title, html, text };
}
