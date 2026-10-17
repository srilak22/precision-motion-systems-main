// INDUS Industrial Robotics — Premium Email Header Banner Component
// api/_lib/email/header.js
// Engineered with top branding bar, high-resolution robotics visual, solid deep navy hero block,
// strong typography, and primary 'EXPLORE OUR SOLUTIONS' CTA button.

import { BRAND, BRAND_COLORS, EMAIL_ASSETS, VERIFIED_LINKS, escapeHtml } from "./constants.js";
import { renderCTAButton } from "./buttons.js";

/**
 * Renders the reusable Premium Email Header Banner.
 *
 * @param {Object} options
 * @param {string} [options.badge] - Contextual pill badge (e.g., "ENGINEERING INSIGHTS", "NEWSLETTER WELCOME")
 * @param {string} [options.headline] - Hero headline (defaults to "Advancing Industrial Automation with Precision Engineering")
 * @param {string} [options.subheadline] - Supporting copy
 * @param {string} [options.bannerImageUrl] - Custom robotics photograph URL (defaults to verified GitHub raw asset)
 * @param {string} [options.bannerImageAlt] - Alt text for robotics image
 * @param {boolean} [options.showCta=true] - Whether to render the primary CTA in the hero banner
 * @param {string} [options.ctaText="EXPLORE OUR SOLUTIONS"] - CTA button label
 * @param {string} [options.ctaUrl] - Target destination URL
 * @param {boolean} [options.compact=false] - Compact mode without photograph (used for dense reports)
 * @returns {string} Email-safe HTML string
 */
export function renderEmailHeader(options = {}) {
  const badge = options.badge || "ENGINEERING INSIGHTS";
  const headline =
    options.headline || "Advancing Industrial Automation with Precision Engineering";
  const subheadline =
    options.subheadline ||
    "Explore precision motion technologies, industrial robotics applications, and engineering insights for modern manufacturing.";
  const bannerImageUrl = options.bannerImageUrl || EMAIL_ASSETS.headerBanner;
  const bannerImageAlt =
    options.bannerImageAlt ||
    "INDUS Industrial Robotics — Precision Motion Systems & Automated Production Cells";
  const isCompact = Boolean(options.compact);
  const showCta = options.showCta !== false;
  const ctaText = options.ctaText || "EXPLORE OUR SOLUTIONS";
  const ctaUrl = options.ctaUrl || VERIFIED_LINKS.solutions;

  return `
    <!-- ===================== HEADER TOP BAR ===================== -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: ${BRAND_COLORS.surfaceWhite}; border-bottom: 2px solid ${BRAND_COLORS.industrialBlue};">
      <tr>
        <td style="padding: 20px 32px 18px 32px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
            <tr>
              <!-- LOGO MARK & BRAND IDENTITY -->
              <td align="left" valign="middle">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <!-- Iconic 3D Axis Delta Glyph Box -->
                    <td style="width: 34px; height: 34px; background-color: ${BRAND_COLORS.navyDark}; border-radius: 4px; text-align: center; vertical-align: middle; border: 1px solid ${BRAND_COLORS.electricCyan};">
                       <span style="font-family: monospace; font-size: 16px; font-weight: 900; color: ${BRAND_COLORS.electricCyan}; line-height: 34px; display: inline-block;">&Delta;</span>
                    </td>
                    <td style="padding-left: 12px; vertical-align: middle;">
                      <a href="${BRAND.websiteUrl}" target="_blank" rel="noopener noreferrer" style="text-decoration: none; display: block;">
                        <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: ${BRAND_COLORS.navyDark}; line-height: 1.1; display: block;">
                          ${BRAND.name}
                        </span>
                        <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 1.2px; text-transform: uppercase; color: ${BRAND_COLORS.textMuted}; display: block; margin-top: 2px;">
                          Industrial Robotics &middot; Motion Systems
                        </span>
                      </a>
                    </td>
                  </tr>
                </table>
              </td>

              <!-- COMPACT NEWSLETTER / CONTEXTUAL BADGE -->
              <td align="right" valign="middle">
                <span style="display: inline-block; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; color: ${BRAND_COLORS.industrialBlue}; background-color: #EFF6FF; border: 1px solid #BFDBFE; padding: 5px 12px; border-radius: 4px;">
                  ${escapeHtml(badge)}
                </span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    ${
      !isCompact
        ? `
    <!-- ===================== HIGH-RESOLUTION ROBOTICS PHOTOGRAPH ===================== -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: ${BRAND_COLORS.navyDark};">
      <tr>
        <td style="padding: 0; line-height: 0; background-color: ${BRAND_COLORS.navyDark};">
          <a href="${BRAND.websiteUrl}" target="_blank" rel="noopener noreferrer" style="text-decoration: none; display: block;">
            <img src="${escapeHtml(bannerImageUrl)}" alt="${escapeHtml(bannerImageAlt)}" width="600" style="display: block; width: 100%; max-width: 600px; height: auto; border: 0; outline: none; text-decoration: none; background-color: ${BRAND_COLORS.navyDark}; color: #8A96A8; font-size: 12px; font-family: sans-serif; -ms-interpolation-mode: bicubic;" />
          </a>
        </td>
      </tr>
      <!-- SOLID DEEP NAVY TEXT & CTA AREA -->
      <tr>
        <td style="padding: 28px 32px; background-color: ${BRAND_COLORS.navyDark}; border-bottom: 3px solid ${BRAND_COLORS.precisionBlue};">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
            <tr>
              <td>
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; font-weight: 800; letter-spacing: 1.8px; text-transform: uppercase; color: ${BRAND_COLORS.electricCyan}; margin-bottom: 8px;">
                  ${BRAND.tagline}
                </div>
                <h1 style="margin: 0 0 10px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 23px; font-weight: 800; letter-spacing: -0.3px; color: #FFFFFF; line-height: 1.25;">
                  ${escapeHtml(headline)}
                </h1>
                <p style="margin: 0 0 ${showCta ? "20px" : "0"} 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.55; color: #DCE3ED;">
                  ${escapeHtml(subheadline)}
                </p>
                ${
                  showCta
                    ? `
                <!-- PRIMARY CTA BUTTON -->
                <div style="text-align: left;">
                  ${renderCTAButton(ctaText, ctaUrl, "primary")}
                </div>
                `
                    : ""
                }
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    `
        : `
    <!-- COMPACT TITLE STRIP (Dense Reports & Administrative Notices) -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color: ${BRAND_COLORS.navyCard}; border-bottom: 3px solid ${BRAND_COLORS.precisionBlue};">
      <tr>
        <td style="padding: 20px 32px;">
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: ${BRAND_COLORS.electricCyan}; margin-bottom: 4px;">
            ${BRAND.tagline}
          </div>
          <h1 style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 20px; font-weight: 800; color: #FFFFFF; line-height: 1.3;">
            ${escapeHtml(headline)}
          </h1>
        </td>
      </tr>
    </table>
    `
    }
  `.trim();
}

/**
 * Plain-text representation of the header
 */
export function renderEmailHeaderText(options = {}) {
  const badge = options.badge || "ENGINEERING INSIGHTS";
  const headline =
    options.headline || "Advancing Industrial Automation with Precision Engineering";
  const subheadline =
    options.subheadline ||
    "Explore precision motion technologies, industrial robotics applications, and engineering insights for modern manufacturing.";

  return `
================================================================================
${BRAND.fullName.toUpperCase()}
${BRAND.tagline}
--------------------------------------------------------------------------------
[${badge.toUpperCase()}]
${headline}
${subheadline}
================================================================================
  `.trim();
}
