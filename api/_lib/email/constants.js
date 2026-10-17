// INDUS Industrial Robotics — Unified Email System Constants & Brand Specifications
// api/_lib/email/constants.js

export const BRAND = {
  name: "INDUS",
  fullName: "INDUS Industrial Robotics",
  tagline: "Precision Motion. Intelligent Automation.",
  subTagline: "Engineering reliable motion. Enabling smarter automation.",
  supportHours: "Mon – Fri: 08:00 – 18:00 (EST)",
  facility: "Chennai Robotics Corridor & North America Engineering Center",
  email: "engineering@indus-robotics.com",
  salesEmail: "rfq@indus-robotics.com",
  phone: "+1 (800) 555-0199",
  websiteUrl: "https://precision-motion-systems-main.vercel.app",
};

export const BRAND_COLORS = {
  navyDark: "#101B35",        // Primary industrial navy for footers, headers & authority surfaces
  navyDeep: "#0B1224",        // Outer backdrop
  navyCard: "#162344",        // Elevated dark surfaces
  navyBorder: "#1E2E56",      // Border for dark components
  industrialBlue: "#246BFD",  // Precision blue
  precisionBlue: "#246BFD",   // Precision blue
  electricCyan: "#45C8F5",    // Electric cyan accent
  accentCyan: "#45C8F5",      // Electric cyan accent
  accentBlue: "#45C8F5",      // Accent highlight
  signalLime: "#246BFD",      // Primary action blue
  signalLimeHover: "#1A56D6", // Darker blue
  amber: "#F59E0B",           // Accent warning / highlight
  surfaceLight: "#F3F6FA",    // Secondary section background
  surfaceWhite: "#FFFFFF",    // Main content background
  textDark: "#172033",        // Primary readable text
  textMuted: "#5B6577",       // Secondary text
  textLight: "#F3F6FA",       // Light text on navy
  textSubtle: "#8A96A8",      // Subtle text on navy
  borderLight: "#DCE3ED",     // Borders and dividers
};

export const VERIFIED_LINKS = {
  home: `${BRAND.websiteUrl}/`,
  products: `${BRAND.websiteUrl}/products`,
  solutions: `${BRAND.websiteUrl}/solutions`,
  architectureExplorer: `${BRAND.websiteUrl}/technology/architecture-explorer`,
  calculators: `${BRAND.websiteUrl}/technology/calculators`,
  resources: `${BRAND.websiteUrl}/resources`,
  catalogue: `${BRAND.websiteUrl}/resources?type=catalogue`,
  consultation: `${BRAND.websiteUrl}/book-consultation`,
  engineeringEnquiry: `${BRAND.websiteUrl}/contact/engineering-enquiry`,
  contact: `${BRAND.websiteUrl}/contact`,
  about: `${BRAND.websiteUrl}/about`,
  compliance: `${BRAND.websiteUrl}/about#compliance`,
  unsubscribe: (email = "") =>
    `${BRAND.websiteUrl}/contact?action=unsubscribe${email ? `&email=${encodeURIComponent(email)}` : ""}`,
};

export const DEFAULT_ADMIN_EMAIL = "srilakshana.int2027g3@gmail.com";

// Verified permanent public CDN assets (Hosted on GitHub master branch with guaranteed HTTP 200 and image/jpeg Content-Type)
const GITHUB_ASSETS_BASE =
  "https://raw.githubusercontent.com/srilak22/precision-motion-systems-main/master";

export const EMAIL_ASSETS = {
  headerBanner: `${GITHUB_ASSETS_BASE}/src/assets/robotics-hero.jpg`,
  roboticArmCell: `${GITHUB_ASSETS_BASE}/src/assets/robotic-arm-cell.jpg`,
  componentsBanner: `${GITHUB_ASSETS_BASE}/src/assets/robotic-components.jpg`,
  harmonicReducer: `${GITHUB_ASSETS_BASE}/src/assets/products/harmonic-reducer.jpg`,
  linearActuator: `${GITHUB_ASSETS_BASE}/src/assets/products/linear-actuator.jpg`,
  weldingRobot: `${GITHUB_ASSETS_BASE}/src/assets/products/welding-robot.jpg`,
  mobileRobotics: `${GITHUB_ASSETS_BASE}/src/assets/mobile-robotics.jpg`,
};

export function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
