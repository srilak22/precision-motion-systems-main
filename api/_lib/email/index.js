// INDUS Industrial Robotics — Unified Email Subsystem Main Entrypoint
// api/_lib/email/index.js

export * from "./constants.js";
export * from "./buttons.js";
export * from "./header.js";
export * from "./footer.js";
export * from "./layout.js";
export * from "./mailer.js";

// Template Generators
export { renderWelcomeEmail } from "./templates/welcome.js";
export { renderProductUpdateEmail } from "./templates/productUpdate.js";
export { renderEngineeringInsightsEmail } from "./templates/engineeringInsights.js";
export { renderBrochureDeliveryEmail } from "./templates/brochureDelivery.js";
export { renderEnquiryAckEmail } from "./templates/enquiryAck.js";
export { renderAppointmentConfirmationEmail } from "./templates/appointmentConfirmation.js";
export { renderAdminLeadNotificationEmail } from "./templates/adminLeadNotification.js";
export { renderExecutiveReportEmail } from "./templates/reportEmail.js";
