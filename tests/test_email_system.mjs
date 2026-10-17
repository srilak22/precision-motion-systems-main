/**
 * Comprehensive Automated Test Suite for INDUS Email Communication System
 * 
 * Verifies:
 * 1. Brand Constants, Verified Links, and XSS Sanitization
 * 2. Email Header Banner Rendering (HTML + Plain-Text)
 * 3. Email Footer Banner Rendering (HTML + Plain-Text)
 * 4. Bulletproof CTA Buttons (Primary, Blue, Dark, Outline variants)
 * 5. All 8 Reusable Email Templates (Welcome, Product, Insights, Brochure, RFQ Ack, Booking, Admin, Report)
 * 6. Vercel Serverless API Route (/api/email) - Subscribe, Brochure, Preview, and Test actions
 * 7. Security, Anti-Spam Honeypots, and Nodemailer Error Sanitization
 */

import assert from "node:assert/strict";
import {
  BRAND,
  BRAND_COLORS,
  VERIFIED_LINKS,
  EMAIL_ASSETS,
  escapeHtml,
  renderEmailHeader,
  renderEmailHeaderText,
  renderEmailFooter,
  renderEmailFooterText,
  renderCTAButton,
  renderCTAButtonText,
  wrapEmailLayout,
  renderWelcomeEmail,
  renderProductUpdateEmail,
  renderEngineeringInsightsEmail,
  renderBrochureDeliveryEmail,
  renderEnquiryAckEmail,
  renderAppointmentConfirmationEmail,
  renderAdminLeadNotificationEmail,
  renderExecutiveReportEmail,
  sendEmail,
} from "../api/_lib/email/index.js";
import emailApiHandler from "../api/email.js";

let passedCount = 0;
let failedCount = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`  ✓ PASS: ${name}`);
    passedCount++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${name}`);
    console.error(`    ${err.message}`);
    failedCount++;
  }
}

async function runAsyncTest(name, fn) {
  try {
    await fn();
    console.log(`  ✓ PASS: ${name}`);
    passedCount++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${name}`);
    console.error(`    ${err.message}`);
    failedCount++;
  }
}

console.log("\n=======================================================");
console.log(" INDUS INDUSTRIAL ROBOTICS - EMAIL SYSTEM TEST SUITE");
console.log("=======================================================\n");

// ----------------------------------------------------
// SUITE 1: Brand Constants & Security Utilities
// ----------------------------------------------------
console.log("Suite 1: Brand Constants & Security Utilities");

runTest("Brand metadata and verified endpoints are configured", () => {
  assert.strictEqual(BRAND.name, "INDUS");
  assert.strictEqual(BRAND.fullName, "INDUS Industrial Robotics");
  assert.strictEqual(BRAND.tagline, "Precision Motion. Intelligent Automation.");
  assert.strictEqual(BRAND.websiteUrl, "https://precision-motion-systems-main.vercel.app");
  assert.strictEqual(BRAND_COLORS.navyDark, "#101B35");
  assert.strictEqual(BRAND_COLORS.precisionBlue, "#246BFD");
  assert.strictEqual(BRAND_COLORS.electricCyan, "#45C8F5");
  assert.ok(VERIFIED_LINKS.products.includes("/products"));
  assert.ok(VERIFIED_LINKS.solutions.includes("/solutions"));
  assert.ok(VERIFIED_LINKS.consultation.includes("/book-consultation"));
});

runTest("escapeHtml sanitizes script injection and HTML entities", () => {
  const unsafe = `<script>alert('xss')</script> & "quotes" 'single'`;
  const sanitized = escapeHtml(unsafe);
  assert.ok(!sanitized.includes("<script>"));
  assert.ok(sanitized.includes("&lt;script&gt;"));
  assert.ok(sanitized.includes("&amp;"));
  assert.ok(sanitized.includes("&quot;"));
  assert.ok(sanitized.includes("&#39;"));
});

// ----------------------------------------------------
// SUITE 2: Email Header Banner Rendering
// ----------------------------------------------------
console.log("\nSuite 2: Email Header Banner Rendering");

runTest("Email Header renders INDUS brand mark, badge, and robotics visual", () => {
  const headerHtml = renderEmailHeader({
    badge: "Technical Bulletin",
    headline: "Advancing Industrial Motion",
    subheadline: "Precision engineering updates",
  });
  assert.ok(headerHtml.includes("INDUS"), "Contains INDUS brand mark");
  assert.ok(headerHtml.includes("Industrial Robotics"), "Contains industrial robotics label");
  assert.ok(headerHtml.includes("Technical Bulletin"), "Contains custom badge");
  assert.ok(headerHtml.includes("Advancing Industrial Motion"), "Contains custom headline");
  assert.ok(headerHtml.includes("img src="), "Contains robotics imagery");
  assert.ok(headerHtml.includes("table"), "Uses table-based layout");
});

runTest("Email Header plain text renders cleanly", () => {
  const plainText = renderEmailHeaderText({
    badge: "Quarterly Bulletin",
    headline: "Precision Motion",
  });
  assert.ok(plainText.includes("INDUS"));
  assert.ok(plainText.toUpperCase().includes("QUARTERLY BULLETIN"));
  assert.ok(plainText.includes("Precision Motion"));
});

// ----------------------------------------------------
// SUITE 3: Email Footer Banner Rendering
// ----------------------------------------------------
console.log("\nSuite 3: Email Footer Banner Rendering");

runTest("Email Footer renders dark navy background, verified contact, and links", () => {
  const footerHtml = renderEmailFooter({
    recipientEmail: "engineer@testcorp.com",
    includeUnsubscribe: true,
  });
  assert.ok(footerHtml.includes("#101B35"), "Uses deep navy background");
  assert.ok(footerHtml.includes(BRAND.email), "Contains verified engineering email");
  assert.ok(footerHtml.includes(BRAND.salesEmail), "Contains verified sales email");
  assert.ok(footerHtml.includes("Chennai Robotics Corridor"), "Contains verified facility");
  assert.ok(footerHtml.includes("unsubscribe"), "Contains unsubscribe handler");
  assert.ok(footerHtml.includes("Solutions"), "Contains solutions navigation link");
  assert.ok(footerHtml.includes("All rights reserved"), "Contains legal copyright notice");
});

runTest("Email Footer plain text generates clean contact details", () => {
  const plainText = renderEmailFooterText({
    recipientEmail: "engineer@testcorp.com",
    includeUnsubscribe: true,
  });
  assert.ok(plainText.includes("INDUS Industrial Robotics"));
  assert.ok(plainText.includes(BRAND.email));
  assert.ok(plainText.toLowerCase().includes("unsubscribe"));
});

// ----------------------------------------------------
// SUITE 4: Bulletproof Email CTA Buttons
// ----------------------------------------------------
console.log("\nSuite 4: Bulletproof Email CTA Buttons");

runTest("renderCTAButton generates valid table-based markup with contrast", () => {
  const primaryBtn = renderCTAButton("Explore Our Solutions", VERIFIED_LINKS.solutions, "primary");
  assert.ok(primaryBtn.includes("table"), "Uses table container");
  assert.ok(primaryBtn.includes("#246BFD"), "Uses precision blue background");
  assert.ok(primaryBtn.includes("Explore Our Solutions"));
  assert.ok(primaryBtn.includes(VERIFIED_LINKS.solutions));

  const blueBtn = renderCTAButton("Download Brochure", VERIFIED_LINKS.catalogue, "blue");
  assert.ok(blueBtn.includes("#246BFD"), "Uses precision blue background");
  assert.ok(blueBtn.includes("Download Brochure"));

  const darkBtn = renderCTAButton("Book Consultation", VERIFIED_LINKS.consultation, "dark");
  assert.ok(darkBtn.includes("#101B35"), "Uses dark navy background");
});

runTest("renderCTAButtonText generates clean plain text link", () => {
  const btnText = renderCTAButtonText("Explore Solutions", VERIFIED_LINKS.solutions);
  assert.strictEqual(btnText, `[ EXPLORE SOLUTIONS ] -> ${VERIFIED_LINKS.solutions}`);
});

// ----------------------------------------------------
// SUITE 5: Reusable Email Templates (All 8 Templates)
// ----------------------------------------------------
console.log("\nSuite 5: Reusable Email Templates");

runTest("Template 1: Welcome Newsletter Email renders successfully", () => {
  const { subject, html, text } = renderWelcomeEmail({
    name: "Engineering Team",
    email: "team@automation.com",
  });
  assert.ok(subject.includes("Welcome to INDUS") || subject.includes("Engineering Insights"));
  assert.ok(html.includes("Welcome to INDUS Industrial Robotics"));
  assert.ok(html.includes("What you can expect"));
  assert.ok(html.includes("Architecture Explorer"));
  assert.ok(text.includes("Welcome to INDUS Industrial Robotics"));
});

runTest("Template 2: Product Update Email renders harmonic and linear data", () => {
  const { subject, html, text } = renderProductUpdateEmail();
  assert.ok(subject.includes("Product Updates"));
  assert.ok(html.includes("Harmonic &amp; Precision Cycloidal Reducers"));
  assert.ok(html.includes("Heavy-Duty Precision Linear Actuators"));
  assert.ok(html.includes("&le; 0.5 arcmin") || html.includes("&le; 10 arc-sec"));
  assert.ok(text.includes("PRODUCT UPDATE"));
});

runTest("Template 3: Engineering Insights Email renders 4 core pillars", () => {
  const { subject, html, text } = renderEngineeringInsightsEmail();
  assert.ok(subject.includes("Engineering Insights"));
  assert.ok(html.includes("Precision Motion Systems"));
  assert.ok(html.includes("Industrial Automation Applications"));
  assert.ok(html.includes("Engineering Specifications"));
  assert.ok(html.includes("Consultation and Project Support"));
  assert.ok(text.includes("ENGINEERING INSIGHTS"));
});

runTest("Template 4: Brochure Delivery Email renders download link and specs", () => {
  const { subject, html, text } = renderBrochureDeliveryEmail({
    name: "David",
    email: "david@precision.de",
  });
  assert.ok(subject.includes("Requested Catalogue"));
  assert.ok(html.includes("Download Technical Catalogue"));
  assert.ok(html.includes("Linear &amp; Rotary Actuators"));
  assert.ok(text.includes("CATALOGUE DELIVERY"));
});

runTest("Template 5: Enquiry Acknowledgement Email renders RFQ details & SLA", () => {
  const { subject, html, text } = renderEnquiryAckEmail({
    name: "Vikram Mehta",
    company: "Automotive Precision Ltd",
    product: "Harmonic Reducers",
    jiraKey: "PMS-1042",
  });
  assert.ok(subject.includes("We Received Your Enquiry"));
  assert.ok(html.includes("Intake Record Details"));
  assert.ok(html.includes("Vikram Mehta"));
  assert.ok(html.includes("Automotive Precision Ltd"));
  assert.ok(html.includes("PMS-1042"));
  assert.ok(html.includes("Queued for Engineering Review"));
  assert.ok(text.includes("PMS-1042"));
});

runTest("Template 6: Appointment Confirmation Email renders booking details", () => {
  const { subject, html, text } = renderAppointmentConfirmationEmail({
    customerName: "Sarah Jenkins",
    companyName: "RoboLogistics Inc",
    bookingId: "INDUS-BC-20261025",
    appointmentDate: "2026-10-25",
    appointmentTime: "14:00 IST",
    consultationPurpose: "Palletizing Kinematics Review",
    googleMeetUrl: "https://meet.google.com/xyz-indus-rob",
  });
  assert.ok(subject.includes("Consultation Confirmed"));
  assert.ok(html.includes("Sarah Jenkins"));
  assert.ok(html.includes("RoboLogistics Inc"));
  assert.ok(html.includes("2026-10-25"));
  assert.ok(html.includes("14:00 IST"));
  assert.ok(html.includes("Join Google Meet Call"));
  assert.ok(text.includes("CONSULTATION CONFIRMED"));
});

runTest("Template 7: Admin Lead Notification Email formats technical enquiry", () => {
  const { subject, html, text } = renderAdminLeadNotificationEmail({
    type: "Engineering RFQ",
    name: "Alex Vance",
    email: "alex@blackmesa.org",
    phone: "+1 555-0199",
    company: "Black Mesa Robotics",
    product: "6-Axis Articulated Cobots",
    requirements: "Need 50 units for assembly line automation.",
    jiraKey: "PMS-2099",
  });
  assert.ok(subject.includes("New Website Enquiry") || subject.includes("New Quote Request"));
  assert.ok(subject.includes("Alex Vance"));
  assert.ok(html.includes("Alex Vance"));
  assert.ok(html.includes("alex@blackmesa.org"));
  assert.ok(html.includes("Black Mesa Robotics"));
  assert.ok(html.includes("PMS-2099"));
  assert.ok(text.includes("Alex Vance"));
});

runTest("Template 7b: Admin Lead Notification Email 2.0 handles missing optional fields gracefully", () => {
  const { subject, html, text } = renderAdminLeadNotificationEmail({
    name: "Jane Doe",
    email: "jane@example.com",
  });
  assert.ok(subject.includes("Jane Doe"));
  assert.ok(html.includes("Not provided"));
  assert.ok(!html.includes("undefined"));
  assert.ok(!html.includes("null"));
  assert.ok(text.includes("Jane Doe"));
  assert.ok(html.includes("LEAD ALERT"));
  assert.ok(html.includes("Contact &amp; Account Profile"));
});

runTest("Template 7c: Admin Lead Notification Email 2.0 preserves long engineering descriptions without truncation", () => {
  const longDossier = "=== ENGINEERING RFQ DOSSIER ===\n" + "Parameter line with high-precision specifications for automotive welding cell.\n".repeat(25);
  const { html, text } = renderAdminLeadNotificationEmail({
    name: "Dr. Gordon Freeman",
    email: "gordon@blackmesa.gov",
    requirements: longDossier,
  });
  assert.ok(html.includes("automotive welding cell"));
  assert.ok(text.includes("automotive welding cell"));
  assert.ok(html.includes("overflow-wrap: break-word"));
});

runTest("Template 7d: Admin Lead Notification Email 2.0 neutralizes HTML/XSS injection attempts", () => {
  const maliciousInput = {
    name: "<script>alert('XSS')</script>John",
    email: "hacker@test.com",
    company: "<b onmouseover=alert(1)>Malicious Corp</b>",
    requirements: "<img src=x onerror=alert('hack')><a href='javascript:steal()'>Click here</a>",
  };
  const { html } = renderAdminLeadNotificationEmail(maliciousInput);
  assert.ok(!html.includes("<script>alert('XSS')</script>"));
  assert.ok(!html.includes("<img src=x onerror"));
  assert.ok(!html.includes("<b onmouseover="));
  assert.ok(html.includes("&lt;script&gt;alert"));
  assert.ok(html.includes("&lt;img src=x onerror"));
});

runTest("Template 7e: Admin Lead Notification Email 2.0 determines priority levels based on business rules", () => {
  const highPriority = renderAdminLeadNotificationEmail({
    name: "Elon M",
    email: "elon@tesla.com",
    type: "Commercial RFQ",
    quantity: "50+ units (Production Batch)",
    timeline: "Immediate / Active Project 1-3 Months",
  });
  assert.ok(highPriority.html.includes("HIGH PRIORITY"));

  const reviewRequired = renderAdminLeadNotificationEmail({
    name: "Sara Connor",
    email: "sara@resistance.org",
    type: "Technical Consultation",
    requirements: "Need help sizing harmonic reducers for articulated arm.",
  });
  assert.ok(reviewRequired.html.includes("REVIEW REQUIRED"));

  const normalPriority = renderAdminLeadNotificationEmail({
    name: "Bob Builder",
    email: "bob@builder.com",
    type: "General Website Enquiry",
    requirements: "Just exploring your linear actuator catalog.",
  });
  assert.ok(normalPriority.html.includes("NORMAL PRIORITY"));
});

runTest("Template 7f: Admin Lead Notification Email 2.0 formats valid mailto, tel, and Jira Cloud CTAs", () => {
  const { html, text } = renderAdminLeadNotificationEmail({
    name: "Marcus Wright",
    email: "marcus@cyberdyne.com",
    phone: "+1 (555) 019-2834",
    company: "Cyberdyne Systems",
    jiraKey: "DI-340",
  });
  assert.ok(html.includes("mailto:marcus%40cyberdyne.com"));
  assert.ok(html.includes("tel:+15550192834"));
  assert.ok(html.includes("Discuss Your Requirements") || html.includes("REVIEW LEAD &amp; RESPOND"));
  assert.ok(html.includes("View in Jira Cloud [DI-340]") || html.includes("VIEW IN JIRA CLOUD [DI-340]"));
  assert.ok(text.includes("[ DISCUSS YOUR REQUIREMENTS ]") || text.includes("[ REVIEW LEAD & RESPOND ]"));
  assert.ok(text.includes("DI-340"));
});

runTest("Template 8: Executive Report Email adheres to dark theme requirements", () => {
  const { subject, html, text } = renderExecutiveReportEmail(
    "weekly",
    {
      summaryLabel: "WEEKLY OPERATIONS & DEALFLOW AUDIT",
      displayPeriod: "Current Operating Cycle",
      periodKey: "report_weekly_test",
    },
    {
      totalLeads: 24,
      dealflow: { websiteDI: 14, youtubeYLT: 6, linkedinLIT: 4 },
      consultations: { total: 7, confirmed: 5, rescheduled: 1, cancelled: 1 },
      sampleBookings: [],
      integrationsHealth: { jiraCloud: "HEALTHY" },
    }
  );
  assert.ok(subject.includes("[INDUS WEEKLY REPORT]"));
  assert.ok(html.includes(BRAND_COLORS.navyDeep) || html.includes("#0B1224"), "Uses dark theme background");
  assert.ok(html.includes("WEEKLY OPERATIONS INTELLIGENCE"));
  assert.ok(text.includes("WEEKLY OPERATIONS & DEALFLOW AUDIT"));
});

// ----------------------------------------------------
// SUITE 6: Vercel Serverless Endpoint (/api/email)
// ----------------------------------------------------
console.log("\nSuite 6: Vercel Serverless Endpoint (/api/email)");

function createMockReqRes(method = "POST", query = {}, body = {}) {
  const req = {
    method,
    query,
    body,
    headers: {
      "x-forwarded-for": "127.0.0.1",
      "user-agent": "automated-test-suite",
    },
  };

  let statusCode = 200;
  let responseData = null;
  let headersSent = {};

  const res = {
    status(code) {
      statusCode = code;
      return res;
    },
    setHeader(key, val) {
      headersSent[key.toLowerCase()] = val;
      return res;
    },
    json(data) {
      responseData = data;
      return res;
    },
    send(data) {
      responseData = data;
      return res;
    },
    end() {
      return res;
    },
    _getStatus: () => statusCode,
    _getData: () => responseData,
    _getHeaders: () => headersSent,
  };

  return { req, res };
}

await runAsyncTest("GET /api/email?action=preview returns rendered HTML for templates", async () => {
  const { req, res } = createMockReqRes("GET", { action: "preview", template: "insights" });
  await emailApiHandler(req, res);
  assert.strictEqual(res._getStatus(), 200);
  assert.strictEqual(res._getHeaders()["content-type"], "text/html; charset=utf-8");
  assert.ok(typeof res._getData() === "string");
  assert.ok(res._getData().includes("INDUS"));
  assert.ok(res._getData().includes("Engineering Insights"));
});

await runAsyncTest("POST /api/email?action=subscribe rejects invalid email with HTTP 400", async () => {
  const { req, res } = createMockReqRes("POST", { action: "subscribe" }, { email: "invalid-email" });
  await emailApiHandler(req, res);
  assert.strictEqual(res._getStatus(), 400);
  assert.strictEqual(res._getData().error, "INVALID_EMAIL");
});

await runAsyncTest("POST /api/email?action=subscribe detects honeypot and neutralizes bot", async () => {
  const { req, res } = createMockReqRes(
    "POST",
    { action: "subscribe" },
    { email: "bot@spammer.org", honeypot: "automated-bot-content" }
  );
  await emailApiHandler(req, res);
  assert.strictEqual(res._getStatus(), 200);
  assert.strictEqual(res._getData().success, true);
  assert.strictEqual(res._getData().status, "filtered");
});

await runAsyncTest("POST /api/email?action=subscribe accepts valid email subscription", async () => {
  const testEmail = `engineer-${Date.now()}@testcorp.com`;
  const { req, res } = createMockReqRes("POST", { action: "subscribe" }, { email: testEmail });
  await emailApiHandler(req, res);
  assert.strictEqual(res._getStatus(), 200);
  assert.strictEqual(res._getData().success, true);
  assert.strictEqual(res._getData().status, "subscribed");
  assert.ok(res._getData().correlationId);
});

await runAsyncTest("POST /api/email?action=subscribe detects duplicate subscription", async () => {
  const dupEmail = `dup-${Date.now()}@testcorp.com`;
  // First subscription
  const reqRes1 = createMockReqRes("POST", { action: "subscribe" }, { email: dupEmail });
  await emailApiHandler(reqRes1.req, reqRes1.res);
  assert.strictEqual(reqRes1.res._getStatus(), 200);

  // Duplicate subscription
  const reqRes2 = createMockReqRes("POST", { action: "subscribe" }, { email: dupEmail });
  await emailApiHandler(reqRes2.req, reqRes2.res);
  assert.strictEqual(reqRes2.res._getStatus(), 200);
  assert.strictEqual(reqRes2.res._getData().status, "already_subscribed");
});

await runAsyncTest("POST /api/email?action=brochure dispatches 2026 catalogue", async () => {
  const { req, res } = createMockReqRes(
    "POST",
    { action: "brochure" },
    { email: "director@precision.de", name: "Hans Weber" }
  );
  await emailApiHandler(req, res);
  assert.strictEqual(res._getStatus(), 200);
  assert.strictEqual(res._getData().success, true);
  assert.ok(res._getData().brochureUrl);
});

await runAsyncTest("POST /api/email?action=quote processes quote request and routes to admin", async () => {
  const { req, res } = createMockReqRes(
    "POST",
    { action: "quote" },
    {
      name: "Arthur Pendelton",
      email: "arthur@automationsys.com",
      company: "Pendelton Systems",
      product: "Harmonic Reducers",
      requirements: "Looking for 50:1 harmonic gearboxes.",
    }
  );
  await emailApiHandler(req, res);
  assert.strictEqual(res._getStatus(), 200);
  assert.strictEqual(res._getData().success, true);
  assert.strictEqual(res._getData().admin_recipient, "srilakshana.int2027g3@gmail.com");
  assert.ok(res._getData().message.includes("quote request"));
});

await runAsyncTest("POST /api/email?action=consultation processes consultation request", async () => {
  const { req, res } = createMockReqRes(
    "POST",
    { action: "consultation" },
    {
      name: "Dr. Evelyn Reed",
      email: "evelyn@reed-motion.com",
      company: "Reed Motion Dynamics",
      product: "Robotic Welding Cells",
      requirements: "Technical consultation on payload kinematics.",
    }
  );
  await emailApiHandler(req, res);
  assert.strictEqual(res._getStatus(), 200);
  assert.strictEqual(res._getData().success, true);
  assert.strictEqual(res._getData().admin_recipient, "srilakshana.int2027g3@gmail.com");
  assert.ok(res._getData().message.includes("consultation request"));
});

await runAsyncTest("POST /api/email rejects malformed name in quote request", async () => {
  const { req, res } = createMockReqRes(
    "POST",
    { action: "quote" },
    { name: "A", email: "valid@email.com" }
  );
  await emailApiHandler(req, res);
  assert.strictEqual(res._getStatus(), 400);
  assert.strictEqual(res._getData().error, "INVALID_NAME");
});

// ----------------------------------------------------
// SUITE 7: Email Delivery & Error Sanitization
// ----------------------------------------------------
console.log("\nSuite 7: Email Delivery & Error Sanitization");

await runAsyncTest("sendEmail returns graceful status when SMTP credentials are not configured", async () => {
  const savedUser = process.env.SMTP_USER;
  const savedPass = process.env.SMTP_PASS;
  delete process.env.SMTP_USER;
  delete process.env.SMTP_PASS;

  try {
    const result = await sendEmail({
      to: "client@test.com",
      subject: "Test Subject",
      html: "<p>Hello</p>",
      text: "Hello",
      templateId: "test-template",
    });
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.error, "SMTP_CONFIG_MISSING");
  } finally {
    if (savedUser) process.env.SMTP_USER = savedUser;
    if (savedPass) process.env.SMTP_PASS = savedPass;
  }
});

await runAsyncTest("sendEmail dispatches via Resend REST API when RESEND_API_KEY is configured", async () => {
  const originalFetch = globalThis.fetch;
  const savedResendKey = process.env.RESEND_API_KEY;
  process.env.RESEND_API_KEY = "re_test_mock_key_12345";

  let capturedPayload = null;
  globalThis.fetch = async (url, options) => {
    if (url === "https://api.resend.com/emails") {
      capturedPayload = JSON.parse(options.body);
      return {
        ok: true,
        status: 200,
        json: async () => ({ id: "msg_resend_mock_8899" }),
      };
    }
    return originalFetch(url, options);
  };

  try {
    const result = await sendEmail({
      to: "srilakshana.int2027g3@gmail.com",
      subject: "Test Resend Notification",
      html: "<p>Resend Delivery Test</p>",
      text: "Resend Delivery Test",
      templateId: "test-resend",
    });

    assert.strictEqual(result.success, true);
    assert.strictEqual(result.provider, "resend");
    assert.strictEqual(result.messageId, "msg_resend_mock_8899");
    assert.strictEqual(capturedPayload.to[0], "srilakshana.int2027g3@gmail.com");
  } finally {
    globalThis.fetch = originalFetch;
    if (savedResendKey) {
      process.env.RESEND_API_KEY = savedResendKey;
    } else {
      delete process.env.RESEND_API_KEY;
    }
  }
});

console.log("\n=======================================================");
console.log(` TEST SUMMARY: ${passedCount} PASSED, ${failedCount} FAILED`);
console.log("=======================================================");

if (failedCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
