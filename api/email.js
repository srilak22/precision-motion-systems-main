// INDUS Industrial Robotics — Unified Email API Serverless Endpoint
// Endpoint: /api/email
// Actions:
//   - POST /api/email?action=subscribe   (Trigger A: Newsletter Subscription & Welcome Email)
//   - POST /api/email?action=brochure    (Trigger C: Brochure / Catalogue Delivery)
//   - GET  /api/email?action=preview     (Visual Inspection of any rendered email template)
//   - POST /api/email?action=test        (Authenticated test send to verified administrator)

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";
import {
  BRAND,
  VERIFIED_LINKS,
  sendBrandedEmail,
  getAdminEmail,
  logEmailDelivery,
  renderWelcomeEmail,
  renderProductUpdateEmail,
  renderEngineeringInsightsEmail,
  renderBrochureDeliveryEmail,
  renderEnquiryAckEmail,
  renderAppointmentConfirmationEmail,
  renderAdminLeadNotificationEmail,
  renderExecutiveReportEmail,
} from "./_lib/email/index.js";

// Storage path for newsletter subscriptions
const DATA_DIR =
  process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME
    ? path.join(os.tmpdir(), "indus_email_data")
    : path.resolve(process.cwd(), ".data");
const SUBSCRIBERS_FILE = path.join(DATA_DIR, "newsletter_subscribers.json");

function ensureStorageDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch {}
}

function readSubscribers() {
  ensureStorageDir();
  try {
    if (fs.existsSync(SUBSCRIBERS_FILE)) {
      const raw = fs.readFileSync(SUBSCRIBERS_FILE, "utf8");
      return JSON.parse(raw);
    }
  } catch {}
  return [];
}

function saveSubscriber(record) {
  ensureStorageDir();
  try {
    const list = readSubscribers();
    const existing = list.find((s) => s.email.toLowerCase() === record.email.toLowerCase());
    if (existing) {
      existing.updatedAt = new Date().toISOString();
      existing.active = true;
    } else {
      list.push(record);
    }
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(list, null, 2), "utf8");
    return true;
  } catch (err) {
    console.warn("[Email API] Subscriber storage warning:", err.message);
    return false;
  }
}

// In-memory rate limiting sliding window (60s)
const ipRateLimits = new Map();
function isRateLimited(ip, maxRequests = 10) {
  const now = Date.now();
  const windowMs = 60_000;
  if (ipRateLimits.size > 2000) {
    for (const [k, v] of ipRateLimits.entries()) {
      if (now - v.startTime > windowMs) ipRateLimits.delete(k);
    }
  }
  const record = ipRateLimits.get(ip);
  if (!record || now - record.startTime > windowMs) {
    ipRateLimits.set(ip, { startTime: now, count: 1 });
    return false;
  }
  record.count += 1;
  return record.count > maxRequests;
}

export default async function handler(req, res) {
  // CORS & Security Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Correlation-ID, X-Request-ID, X-Report-Email-Secret, X-Cron-Secret",
  );

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  const startTime = Date.now();
  const rawForwarded = req.headers ? req.headers["x-forwarded-for"] || "" : "";
  const clientIp = (
    rawForwarded.split(",")[0].trim() ||
    (req.headers && req.headers["x-real-ip"]) ||
    "127.0.0.1"
  ).slice(0, 45);

  const urlObj = new URL(req.url, `http://${req.headers?.host || "localhost"}`);
  const action = (urlObj.searchParams.get("action") || req.query?.action || "").toLowerCase().trim();

  const correlationId = (
    req.headers?.["x-correlation-id"] ||
    req.headers?.["x-request-id"] ||
    req.body?.correlationId ||
    `eml_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
  ).toString();

  // Rate Limiting (except visual previews)
  if (action !== "preview" && isRateLimited(clientIp, 10)) {
    logEmailDelivery("rate_limited", { correlationId, errorCategory: "TOO_MANY_REQUESTS" });
    return res.status(429).json({
      success: false,
      error: "TOO_MANY_REQUESTS",
      message: "Too many email requests from this network. Please wait a minute before retrying.",
    });
  }

  // =========================================================================
  // 1. GET /api/email?action=preview (HTML Visual Inspection of Templates)
  // =========================================================================
  if (req.method === "GET" && action === "preview") {
    const templateName = (urlObj.searchParams.get("template") || "welcome").toLowerCase().trim();
    let rendered = null;

    switch (templateName) {
      case "welcome":
        rendered = renderWelcomeEmail({
          email: "engineer@precision-robotics.com",
          name: "Dr. Alexander Wright",
          correlationId: "preview-welcome-sample",
        });
        break;
      case "product-update":
      case "product":
        rendered = renderProductUpdateEmail({
          email: "systems@industrial-motion.com",
          correlationId: "preview-product-update",
        });
        break;
      case "engineering-insights":
      case "insights":
      case "newsletter":
        rendered = renderEngineeringInsightsEmail({
          email: "automation-lead@factory.org",
          correlationId: "preview-insights-sample",
        });
        break;
      case "brochure":
      case "catalogue":
        rendered = renderBrochureDeliveryEmail({
          email: "procurement@ev-manufacturing.com",
          name: "Sarah Chen",
          itemTitle: "INDUS Master Robotics Product Catalogue (2026 Edition)",
          correlationId: "preview-brochure-sample",
        });
        break;
      case "enquiry-ack":
      case "rfq":
        rendered = renderEnquiryAckEmail({
          email: "lead.engineer@tier1-auto.com",
          name: "Vikram Malhotra",
          company: "Apex Precision Drives",
          type: "7-Section Engineering Enquiry & Kinematic Sizing",
          product: "Linear Actuators & Harmonic Reducers",
          jiraKey: "DI-342",
          correlationId: "preview-enquiry-ack",
        });
        break;
      case "appointment":
      case "consultation":
        rendered = renderAppointmentConfirmationEmail({
          customerName: "Sri Lakshana",
          companyEmail: "srilakshana.int2027g3@gmail.com",
          companyName: "Precision Motion Tech Industries",
          bookingId: "INDUS-BC-20261026-9XYZ",
          appointmentDate: "2026-10-26",
          appointmentTime: "11:00 - 11:30",
          timezone: "Asia/Kolkata (IST)",
          consultationMode: "Google Meet (Online Video)",
          googleMeetUrl: "https://meet.google.com/ind-us-r-ob-610269xyz",
          consultationPurpose: "Automated Robotic Welding Cell Kinematic Sizing",
          jiraTicketKey: "DI-345",
        });
        break;
      case "admin-lead":
      case "admin":
        rendered = renderAdminLeadNotificationEmail({
          name: "David H. Miller",
          email: "d.miller@aerospace-motion.com",
          phone: "+1 (415) 555-8921",
          company: "Miller Aerospace Precision",
          type: "Commercial RFQ Submission",
          product: "Zero-Backlash Harmonic Reducers (50:1 Ratio)",
          requirements: "Requires 6 units of 50:1 harmonic gearboxes with hollow-shaft configuration for 6-axis joint articulation. Repeatability target: <= 0.03 mm.",
          jiraKey: "DI-346",
          source: "Direct Website / Sizing Calculator",
          location: "Detroit, United States",
          correlationId: "preview-admin-lead",
        });
        break;
      case "report-daily":
      case "report-weekly":
      case "report-monthly":
      case "report": {
        const repType = templateName.includes("monthly")
          ? "monthly"
          : templateName.includes("weekly")
            ? "weekly"
            : "daily";
        rendered = renderExecutiveReportEmail(
          repType,
          {
            summaryLabel: `${repType.toUpperCase()} OPERATIONS & DEALFLOW AUDIT`,
            displayPeriod: "Current Operating Cycle",
            periodKey: `report_${repType}_sample`,
          },
          {
            totalLeads: 24,
            dealflow: { websiteDI: 14, youtubeYLT: 6, linkedinLIT: 4 },
            consultations: { total: 7, confirmed: 5, rescheduled: 1, cancelled: 1 },
            sampleBookings: [
              {
                bookingId: "INDUS-BC-20261026-9XYZ",
                customer: "Sri Lakshana",
                company: "Precision Motion Tech",
                purpose: "Robotic Welding Sizing",
                date: "2026-10-26",
                time: "11:00 - 11:30",
                mode: "Google Meet",
              },
            ],
            integrationsHealth: {
              jiraCloud: "HEALTHY",
              googleAppsScript: "HEALTHY",
              telegramBot: "CONFIGURED",
              microsoftClarity: "ACTIVE",
            },
          },
        );
        break;
      }
      default:
        rendered = renderWelcomeEmail({
          email: "visitor@industry.com",
          name: "Engineering Colleague",
        });
    }

    if (urlObj.searchParams.get("format") === "text") {
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      return res.status(200).send(rendered.text);
    }

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(200).send(rendered.html);
  }

  // Parse JSON Body for POST actions
  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ success: false, error: "BAD_REQUEST", message: "Malformed JSON payload." });
    }
  }
  body = body && typeof body === "object" ? body : {};

  // Bot Protection (silent rejection for honeypot traps)
  if (body._hp || body.honeypot || body.website_url || body.company_fax) {
    return res.status(200).json({
      success: true,
      status: "filtered",
      recorded: true,
      message: "Subscription recorded.",
    });
  }

  // =========================================================================
  // 2. POST /api/email?action=subscribe (Newsletter Subscription & Welcome Email)
  // =========================================================================
  if (req.method === "POST" && action === "subscribe") {
    const rawEmail = (body.email || "").toString().trim().toLowerCase();
    const name = (body.name || "").toString().trim();

    if (!rawEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail)) {
      return res.status(400).json({
        success: false,
        error: "INVALID_EMAIL",
        errorCategory: "INVALID_EMAIL",
        message: "Please enter a valid engineering or corporate email address.",
      });
    }

    // Check duplicate subscription in storage
    const subscribers = readSubscribers();
    const existing = subscribers.find((s) => s.email.toLowerCase() === rawEmail);
    const isNew = !existing;

    saveSubscriber({
      email: rawEmail,
      name,
      subscribedAt: existing?.subscribedAt || new Date().toISOString(),
      source: body.source || "Website Footer Newsletter",
      active: true,
    });

    // Render Welcome Email
    const template = renderWelcomeEmail({
      email: rawEmail,
      name,
      correlationId,
    });

    // Dispatch via Nodemailer
    const delivery = await sendBrandedEmail({
      to: rawEmail,
      subject: `Welcome to Engineering Insights from ${BRAND.fullName}`,
      html: template.html,
      text: template.text,
      templateId: "welcome",
      recipientCategory: "newsletter_subscriber",
      correlationId,
    });

    // Send Administrator Notification for Newsletter Subscription Event
    const adminEmail = getAdminEmail();
    if (adminEmail) {
      const adminTemplate = renderAdminLeadNotificationEmail({
        name: name || "Website Visitor",
        email: rawEmail,
        phone: "Not Provided",
        company: body.company || "Not Specified",
        type: "Newsletter Subscription",
        product: "INDUS Engineering Insights & Motion Technology Updates",
        requirements: `New subscriber registered for INDUS engineering updates.\nSubscription Source: ${body.source || "Website Footer Newsletter"}\nStatus: ${isNew ? "New Subscriber" : "Re-subscribed / Updated"}`,
        source: body.source || "Website Footer Newsletter",
        location: clientIp !== "127.0.0.1" ? `IP: ${clientIp}` : "Website Visitor",
        correlationId,
      });

      sendBrandedEmail({
        to: adminEmail,
        subject: `New Newsletter Subscription | INDUS Industrial Robotics — ${name || rawEmail}`,
        html: adminTemplate.html,
        text: adminTemplate.text,
        templateId: "admin-lead-notification",
        recipientCategory: "administrator_alert",
        correlationId,
      }).catch((err) => console.warn("[Email API] Admin subscription alert notice:", err.message));
    }

    return res.status(200).json({
      success: true,
      email_sent: delivery.success,
      already_subscribed: !isNew,
      status: isNew ? "subscribed" : "already_subscribed",
      provider_message_id: delivery.messageId || null,
      message: isNew
        ? "Thank you for subscribing! Your welcome engineering guide has been dispatched."
        : "You are already an active subscriber. Welcome guide re-sent.",
      correlationId: correlationId,
      correlation_id: correlationId,
    });
  }

  // =========================================================================
  // 3. POST /api/email?action=brochure (Brochure / Catalogue Delivery)
  // =========================================================================
  if (req.method === "POST" && action === "brochure") {
    const rawEmail = (body.email || "").toString().trim().toLowerCase();
    const name = (body.name || "").toString().trim();
    const itemTitle = (body.itemTitle || body.title || "INDUS Master Robotics Product Catalogue").toString().trim();

    if (!rawEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail)) {
      return res.status(400).json({
        success: false,
        error: "INVALID_EMAIL",
        errorCategory: "INVALID_EMAIL",
        message: "Please enter a valid corporate or engineering email address.",
      });
    }

    const template = renderBrochureDeliveryEmail({
      email: rawEmail,
      name,
      itemTitle,
      correlationId,
    });

    const delivery = await sendBrandedEmail({
      to: rawEmail,
      subject: `Your Requested Catalogue: ${itemTitle} — ${BRAND.fullName}`,
      html: template.html,
      text: template.text,
      templateId: "brochure-delivery",
      recipientCategory: "brochure_requester",
      correlationId,
    });

    // Send Administrator Notification for Brochure Download Event
    const adminEmail = getAdminEmail();
    if (adminEmail) {
      const adminTemplate = renderAdminLeadNotificationEmail({
        name: name || "Technical Catalogue Requester",
        email: rawEmail,
        phone: "Not Provided",
        company: body.company || "Not Specified",
        type: "Brochure Download Request",
        product: itemTitle,
        requirements: `Requested technical catalogue: ${itemTitle}\nDirect Access Link: ${VERIFIED_LINKS.catalogue}`,
        source: "Brochure Modal / Technical Downloads",
        location: clientIp !== "127.0.0.1" ? `IP: ${clientIp}` : "Website Visitor",
        correlationId,
      });

      sendBrandedEmail({
        to: adminEmail,
        subject: `New Brochure Request | INDUS Industrial Robotics — ${name || rawEmail} (${itemTitle})`,
        html: adminTemplate.html,
        text: adminTemplate.text,
        templateId: "admin-lead-notification",
        recipientCategory: "administrator_alert",
        correlationId,
      }).catch((err) => console.warn("[Email API] Admin brochure alert notice:", err.message));
    }

    return res.status(200).json({
      success: true,
      email_sent: delivery.success,
      brochureUrl: VERIFIED_LINKS.catalogue,
      download_url: VERIFIED_LINKS.catalogue,
      provider_message_id: delivery.messageId || null,
      message: "The requested technical catalogue has been dispatched to your email address.",
      correlationId: correlationId,
      correlation_id: correlationId,
    });
  }

  // =========================================================================
  // 4. POST /api/email?action=test (Authenticated Test Dispatch to Admin)
  // =========================================================================
  if (req.method === "POST" && action === "test") {
    // Secret authentication check
    const secret =
      req.headers?.["x-report-email-secret"] ||
      req.headers?.["x-cron-secret"] ||
      (req.headers?.authorization || "").replace(/^Bearer\s+/i, "") ||
      body.secret;

    const validSecret =
      process.env.REPORT_EMAIL_API_SECRET || process.env.CRON_SECRET || "indus-admin-key";
    if (secret !== validSecret && process.env.NODE_ENV !== "test") {
      return res.status(401).json({
        success: false,
        error: "UNAUTHORIZED",
        message: "Invalid or missing administrative secret token.",
      });
    }

    const adminEmail = getAdminEmail();
    const testTemplateName = (body.template || "welcome").toLowerCase().trim();
    const template = renderWelcomeEmail({
      email: adminEmail,
      name: "INDUS Administrator",
      correlationId: `test_${Date.now()}`,
    });

    const delivery = await sendBrandedEmail({
      to: adminEmail,
      subject: `[TEST RUN] ${testTemplateName.toUpperCase()} — ${BRAND.fullName}`,
      html: template.html,
      text: template.text,
      templateId: `test-${testTemplateName}`,
      recipientCategory: "administrator_test",
      correlationId,
    });

    return res.status(delivery.success ? 200 : 502).json({
      success: delivery.success,
      email_sent: delivery.success,
      recipient: adminEmail,
      provider_message_id: delivery.messageId || null,
      error: delivery.error || null,
      message: delivery.message || "Test email dispatched successfully.",
      correlation_id: correlationId,
    });
  }

  // =========================================================================
  // 5. POST /api/email?action=quote | consultation | lead | enquiry | contact | send-email
  //    (Direct form submissions or redirected /api/send-email)
  // =========================================================================
  const isEnquiryAction =
    action === "quote" ||
    action === "consultation" ||
    action === "lead" ||
    action === "enquiry" ||
    action === "contact" ||
    action === "send-email" ||
    action === "" ||
    !action;

  if (req.method === "POST" && isEnquiryAction) {
    const rawEmail = (body.email || body.companyEmail || "").toString().trim().toLowerCase();
    const rawName = (body.name || body.fullName || "").toString().trim();
    const phone = (body.phone || body.phoneNumber || "").toString().trim();
    const company = (body.company || body.companyName || "").toString().trim();
    const product = (body.product || body.service || body.topic || "Precision Motion Systems").toString().trim();
    const requirements = (body.requirements || body.message || body.details || body.projectDescription || "").toString().trim();
    const leadType = (body.type || (action === "quote" ? "Quote Request" : action === "consultation" ? "Consultation Request" : "Website Commercial Enquiry")).toString().trim();

    if (!rawName || rawName.length < 2) {
      return res.status(400).json({
        success: false,
        error: "INVALID_NAME",
        message: "Full name must be at least 2 characters long.",
      });
    }

    if (!rawEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail)) {
      return res.status(400).json({
        success: false,
        error: "INVALID_EMAIL",
        message: "Please enter a valid corporate or engineering email address.",
      });
    }

    const adminEmail = getAdminEmail();
    const isQuote = action === "quote" || leadType.toLowerCase().includes("quote");
    const isConsultation = action === "consultation" || leadType.toLowerCase().includes("consultation");

    // 1. Render Admin Notification
    const adminTemplate = renderAdminLeadNotificationEmail({
      name: rawName,
      email: rawEmail,
      phone,
      company,
      type: leadType,
      product,
      requirements: requirements || "No additional requirements provided.",
      source: body.source || "Website Direct Submission",
      location: clientIp !== "127.0.0.1" ? `IP: ${clientIp}` : "Website Visitor",
      correlationId,
      action: isQuote ? "quote" : isConsultation ? "consultation" : "lead",
    });

    // 2. Dispatch to Admin (srilakshana.int2027g3@gmail.com)
    const adminDelivery = await sendBrandedEmail({
      to: adminEmail,
      subject: adminTemplate.subject || (isQuote ? `New Quote Request | INDUS Industrial Robotics — ${rawName}` : isConsultation ? `New Consultation Request | INDUS Industrial Robotics — ${rawName}` : `New Website Enquiry | INDUS Industrial Robotics — ${rawName}`),
      html: adminTemplate.html,
      text: adminTemplate.text,
      templateId: isQuote ? "admin-quote-notification" : isConsultation ? "admin-consultation-notification" : "admin-lead-notification",
      recipientCategory: "administrator_alert",
      correlationId,
    });

    // 3. Render Customer Acknowledgement
    const ackTemplate = renderEnquiryAckEmail({
      name: rawName,
      email: rawEmail,
      company,
      type: leadType,
      product,
      correlationId,
    });

    // 4. Dispatch Acknowledgement to Visitor
    const ackDelivery = await sendBrandedEmail({
      to: rawEmail,
      subject: "We Received Your Enquiry | INDUS Industrial Robotics",
      html: ackTemplate.html,
      text: ackTemplate.text,
      templateId: "enquiry-ack",
      recipientCategory: "lead_prospect",
      correlationId,
    });

    return res.status(200).json({
      success: true,
      email_sent: adminDelivery.success,
      admin_recipient: adminEmail,
      customer_ack_sent: ackDelivery.success,
      provider_message_id: adminDelivery.messageId || null,
      message: isQuote
        ? "Your quote request has been received. Our engineering team will review your specifications."
        : isConsultation
          ? "Your consultation request has been received. Our team will contact you to coordinate."
          : "Your enquiry has been received. Our engineering team will review your requirements.",
      correlationId,
      correlation_id: correlationId,
    });
  }

  return res.status(400).json({
    success: false,
    error: "INVALID_ACTION",
    message: "Invalid action. Supported actions: 'subscribe', 'brochure', 'quote', 'consultation', 'lead', 'preview', 'test'.",
  });
}
