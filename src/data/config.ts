/**
 * Global Configuration for INDUS Industrial Robotics
 * Centralizes company metadata, contact channels, and WhatsApp messaging.
 *
 * NOTE: Contact details below contain placeholder configurations that require
 * final business confirmation from the project owner.
 */

export const companyConfig = {
  brandName: "INDUS",
  fullName: "INDUS Industrial Robotics",
  tagline: "Precision · Motion · Control · Reliability · Automation · Intelligence",

  // =========================================================================
  // CONTACT DETAILS REQUIRING USER CONFIRMATION
  // =========================================================================
  // [CONFIRMATION NEEDED] Set to official WhatsApp business number (digits only with country code, e.g. "+15550199")
  whatsAppNumber: "+1234567890",
  displayWhatsApp: "+1 (234) 567-890",

  // [CONFIRMATION NEEDED] Set to official engineering and sales email inboxes
  email: "engineering@indus-robotics.com",
  salesEmail: "rfq@indus-robotics.com",

  // [CONFIRMATION NEEDED] Set to official corporate phone number
  phone: "+1 (800) 555-0199",

  // [CONFIRMATION NEEDED] Set to official physical headquarters / manufacturing facility address
  headquarters: "Industrial Automation Park, Tech Corridor",
  supportHours: "Mon – Fri: 08:00 – 18:00 (EST)",

  // Unified contact object for components accessing structured contact props
  contact: {
    phone: {
      raw: "+18005550199",
      display: "+1 (800) 555-0199",
    },
    email: {
      general: "engineering@indus-robotics.com",
      sales: "rfq@indus-robotics.com",
    },
    address: "Industrial Automation Park, Tech Corridor",
    hours: "Mon – Fri: 08:00 – 18:00 (EST)",
  },

  // =========================================================================
  // GOOGLE SPREADSHEET & ANALYTICS CONNECTION (Preserved Intact)
  // =========================================================================
  googleSheetUrl:
    "https://docs.google.com/spreadsheets/d/1fHcRuJnK-tF2PwcrXuVl4K_FN8Sy1dI7gtSmEVZqbEc/edit?gid=2025481644#gid=2025481644",
  googleSpreadsheetId: "1fHcRuJnK-tF2PwcrXuVl4K_FN8Sy1dI7gtSmEVZqbEc",
  googleSpreadsheetGid: "2025481644",
  googleAppsScriptUrl:
    "https://script.google.com/macros/s/AKfycbw8NhfkPJGeYu4NAaisxN3FHaWmAVlZTmEO2x1CsBirRPvt5pQjI5zNv3qVXqEA2W1a/exec",

  // =========================================================================
  // SAFE CONTEXTUAL WHATSAPP URL GENERATOR
  // =========================================================================
  getWhatsAppUrl: (context?: {
    type?: "general" | "product" | "application" | "solution" | "custom" | undefined;
    name?: string | undefined;
  }) => {
    let message =
      "Hello INDUS team, I would like to know more about your industrial robotics solutions.";

    if (context?.type === "product" && context.name) {
      message = `Hello INDUS team, I am interested in ${context.name}. I would like more technical information.`;
    } else if (context?.type === "application" && context.name) {
      message = `Hello INDUS team, I am exploring robotics solutions for ${context.name}. I would like to discuss my requirement.`;
    } else if (context?.type === "solution" && context.name) {
      message = `Hello INDUS team, I would like to discuss implementing ${context.name} for our facility.`;
    } else if (context?.type === "custom" && context.name) {
      message = context.name;
    }

    // Clean phone number safely for WhatsApp link
    const cleanNumber = (companyConfig.whatsAppNumber || "").replace(/[^0-9]/g, "");
    if (!cleanNumber) {
      return `mailto:${companyConfig.email}?subject=${encodeURIComponent("INDUS Robotics Enquiry")}&body=${encodeURIComponent(message)}`;
    }
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
  },
};
