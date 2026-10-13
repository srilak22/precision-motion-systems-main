// INDUS Industrial Robotics — Telegram Bot Integration Test Suite
// scripts/test_telegram_integration.mjs

import { formatTelegramMessage, sendTelegramNotification, isTelegramConfigured } from "../api/lib/telegram.js";
import trackHandler from "../api/track.js";
import youtubeLeadHandler from "../api/youtube-lead.js";

// Mock Express-like req/res objects for testing serverless handlers
function createMockReqRes(body, headers = {}) {
  const req = {
    method: "POST",
    headers: {
      origin: "https://precision-motion-systems-main.vercel.app",
      "x-forwarded-for": `198.51.100.${Math.floor(Math.random() * 200) + 1}`,
      ...headers,
    },
    body,
  };

  let statusCode = 200;
  let responseData = null;
  const resHeaders = {};

  const res = {
    statusCode: 200,
    setHeader: (k, v) => {
      resHeaders[k] = v;
    },
    status: (code) => {
      statusCode = code;
      res.statusCode = code;
      return res;
    },
    json: (data) => {
      responseData = data;
      return res;
    },
    end: () => res,
  };

  return { req, res, getStatus: () => statusCode, getData: () => responseData };
}

async function runTests() {
  console.log("============================================================");
  console.log("  INDUS Industrial Robotics — Telegram Integration Test Suite");
  console.log("============================================================\n");

  let passes = 0;
  let failures = 0;

  // 1. Verify Configuration
  console.log("[Test 1] Checking Telegram environment configuration...");
  const configured = isTelegramConfigured();
  if (configured) {
    console.log("  ✔ TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID are properly set.");
    passes++;
  } else {
    console.error("  ✖ Telegram credentials missing from environment.");
    failures++;
  }

  // 2. Verify Message Formatting
  console.log("\n[Test 2] Validating message format conforming to specification...");
  const sampleLead = {
    name: "Dr. Elena Rostova",
    email: "elena.rostova@quantum-robotics.de",
    phone: "+49 89 1234 5678",
    company: "Quantum Robotics GmbH",
    interest: "Ultra-Flat Strain Wave Harmonic Gears",
    requirements: "Need custom ratio 100:1 with cross roller bearings for collaborative robot wrist.",
    source: "Request a Quote (Commercial RFQ)",
    page: "/products/strain-wave-gears",
    jiraKey: "DI-999",
    timestamp: "2026-10-13T10:00:00Z",
  };

  const formattedMsg = formatTelegramMessage(sampleLead);
  console.log("  Generated message format preview:\n----------------------------------------");
  console.log(formattedMsg);
  console.log("----------------------------------------");

  const expectedHeadings = [
    "New INDUS Website Lead",
    "Name: Dr. Elena Rostova",
    "Email: elena.rostova@quantum-robotics.de",
    "Phone: +49 89 1234 5678",
    "Company: Quantum Robotics GmbH",
    "Interest: Ultra-Flat Strain Wave Harmonic Gears",
    "Requirement: Need custom ratio 100:1 with cross roller bearings for collaborative robot wrist.",
    "Source: Request a Quote (Commercial RFQ)",
    "Page: /products/strain-wave-gears",
    "Jira Ticket: DI-999",
  ];

  let formatOk = true;
  for (const h of expectedHeadings) {
    if (!formattedMsg.includes(h)) {
      console.error(`  ✖ Missing expected line: "${h}"`);
      formatOk = false;
    }
  }

  if (formatOk) {
    console.log("  ✔ Message format strictly matches user requirement.");
    passes++;
  } else {
    failures++;
  }

  // 3. Direct Telegram Bot Transmission
  console.log("\n[Test 3] Testing direct Telegram Bot sendMessage...");
  const directResult = await sendTelegramNotification({
    ...sampleLead,
    name: "Dr. Elena Rostova [Direct Test]",
    source: "Automated Test Runner",
  });

  if (directResult.success && directResult.messageId) {
    console.log(`  ✔ Telegram message delivered successfully (message_id: ${directResult.messageId}).`);
    passes++;
  } else {
    console.error(`  ✖ Telegram transmission failed: ${directResult.error}`);
    failures++;
  }

  // 4. Test Serverless /api/track with Quote Lead
  console.log("\n[Test 4] Testing /api/track with Request a Quote lead...");
  const uniqueId = Date.now().toString(36);
  const quoteEmail = `lead_${uniqueId}@aeromotion-tech.com`;
  const quoteLeadPayload = {
    event: "lead",
    name: "Marcus Vance",
    email: quoteEmail,
    company: "AeroMotion Dynamics",
    phone: "+1 650 555 0192",
    product: "Planetary Reduction Gearbox PX-80",
    quantity: "25 units",
    requirements: "Requires IP67 ingress protection for external antenna gimbal.",
    type: "Commercial RFQ",
    form: "Request a Quote",
    page: "/products/planetary-gearbox-px80",
  };

  const { req: qReq, res: qRes, getStatus: qStatus, getData: qData } = createMockReqRes(quoteLeadPayload);
  await trackHandler(qReq, qRes);

  if (qStatus() === 200 && qData()?.success) {
    console.log(`  ✔ /api/track succeeded (Jira: ${qData().jiraKey || "N/A"}, Telegram notified: ${qData().telegramNotified}).`);
    passes++;
  } else {
    console.error(`  ✖ /api/track failed: status ${qStatus()}, data:`, qData());
    failures++;
  }

  // 5. Test Deduplication (Submit identical lead immediately)
  console.log("\n[Test 5] Testing lead deduplication (prevents duplicate Telegram alerts)...");
  const { req: dupReq, res: dupRes, getStatus: dupStatus, getData: dupData } = createMockReqRes(quoteLeadPayload, {
    "x-forwarded-for": qReq.headers["x-forwarded-for"], // identical IP
  });
  await trackHandler(dupReq, dupRes);

  if (dupStatus() === 200 && dupData()?.duplicate === true) {
    console.log("  ✔ Duplicate submission was successfully intercepted and deduplicated.");
    passes++;
  } else {
    console.error("  ✖ Deduplication check failed:", dupData());
    failures++;
  }

  // 6. Test Input Validation (Rejection of invalid name and email)
  console.log("\n[Test 6] Testing validation: invalid lead must be rejected...");
  const { req: invReq1, res: invRes1, getStatus: invStatus1 } = createMockReqRes({
    event: "lead",
    name: "A", // too short
    email: "valid@email.com",
  });
  await trackHandler(invReq1, invRes1);

  const { req: invReq2, res: invRes2, getStatus: invStatus2 } = createMockReqRes({
    event: "lead",
    name: "Marcus Vance",
    email: "not-an-email", // invalid email format
  });
  await trackHandler(invReq2, invRes2);

  if (invStatus1() === 400 && invStatus2() === 400) {
    console.log("  ✔ Both invalid leads rejected with HTTP 400 (no Telegram alert triggered).");
    passes++;
  } else {
    console.error(`  ✖ Validation error: status1=${invStatus1()}, status2=${invStatus2()}`);
    failures++;
  }

  // 7. Test Honeypot Rejection
  console.log("\n[Test 7] Testing spam bot honeypot protection...");
  const { req: hpReq, res: hpRes, getStatus: hpStatus, getData: hpData } = createMockReqRes({
    event: "lead",
    name: "Bot Spammer",
    email: "bot@spam.com",
    _hp: "I am a hidden bot input",
  });
  await trackHandler(hpReq, hpRes);

  if (hpStatus() === 200 && hpData()?.deduplicated === true) {
    console.log("  ✔ Spam bot silently dropped without notifying Telegram.");
    passes++;
  } else {
    console.error("  ✖ Honeypot did not filter correctly:", hpData());
    failures++;
  }

  // 8. Test Career Profile with nested JSON in details
  console.log("\n[Test 8] Testing Career Profile submission (nested JSON unpack)...");
  const careerUniqueId = Date.now().toString(36);
  const careerPayload = {
    event: "lead",
    element: "Career Profile Submission",
    details: JSON.stringify({
      name: "Siddharth Menon",
      email: `sid_${careerUniqueId}@robotics-iit.edu`,
      phone: "+91 99887 76655",
      company: "Career Candidate",
      product: "Motion Control Firmware Engineer",
      details: "Education: M.Tech Mechatronics | Experience: 4 years EtherCAT / CANopen | File: resume.pdf",
    }),
    page: "/careers",
  };

  const { req: cReq, res: cRes, getStatus: cStatus, getData: cData } = createMockReqRes(careerPayload);
  await trackHandler(cReq, cRes);

  if (cStatus() === 200 && cData()?.success) {
    console.log(`  ✔ Career candidate profile unpacked and processed (Jira: ${cData().jiraKey || "N/A"}, Telegram notified: ${cData().telegramNotified}).`);
    passes++;
  } else {
    console.error("  ✖ Career profile processing failed:", cData());
    failures++;
  }

  // 9. Summary
  console.log("\n============================================================");
  console.log(`Test Execution Finished: ${passes} Passed, ${failures} Failed`);
  console.log("============================================================\n");

  if (failures > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Unhandled test suite exception:", err);
  process.exit(1);
});
