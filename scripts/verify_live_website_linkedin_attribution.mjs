/**
 * Live Verification: Website Lead Attributed to LinkedIn via UTM/Referrer -> Jira LIT Project
 */

import trackHandler from "../api/track.js";

// Load .env
if (typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile(".env.local");
  } catch {}
  try {
    process.loadEnvFile(".env");
  } catch {}
}

function createMockReqRes({ method = "POST", headers = {}, body = {} } = {}) {
  const req = {
    method,
    headers: {
      "content-type": "application/json",
      origin: "https://precision-motion-systems-main.vercel.app",
      "x-forwarded-for": `192.168.10.${Math.floor(Math.random() * 200) + 10}`,
      ...headers,
    },
    body,
  };

  const res = {
    statusCode: 200,
    headers: {},
    ended: false,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    setHeader(key, val) {
      this.headers[key.toLowerCase()] = val;
      return this;
    },
    json(data) {
      this.body = data;
      this.ended = true;
      return this;
    },
    end(data) {
      this.body = data;
      this.ended = true;
      return this;
    },
  };

  return { req, res };
}

async function verifyAttributionToLit() {
  console.log("===============================================================================");
  console.log("INDUS Robotics — Live LinkedIn Attributed Website Lead -> Jira LIT Verification");
  console.log("===============================================================================\n");

  const timestamp = Date.now();
  const testLead = {
    event: "lead",
    name: "Dr. Evelyn Reed (Synthetic Test)",
    email: `synthetic.evelyn.reed.${timestamp}@indus-robotics-test.internal`,
    phone: "+44 20 7946 0888",
    company: "Reed Photonics UK (LIT Verification)",
    details: "SYNTHETIC WEBSITE ENQUIRY attributed to LinkedIn Sponsored Ad. Testing LIT project routing.",
    product: "Sub-Micron Hexapod Positioning System",
    utmSource: "linkedin",
    utmMedium: "paidsocial",
    utmCampaign: "hexapod-launch-2026",
    referrer: "https://www.linkedin.com/feed/",
    url: "https://precision-motion-systems-main.vercel.app/products/hexapods",
  };

  console.log("Submitting LinkedIn-attributed website enquiry to /api/track...");
  const { req, res } = createMockReqRes({ body: testLead });
  await trackHandler(req, res);

  console.log("Response Status Code:", res.statusCode);
  console.log("Response Body       :", JSON.stringify(res.body, null, 2));

  if (res.statusCode !== 200 || !res.body.success) {
    console.error("[FATAL] Lead submission failed:", res.body);
    process.exit(1);
  }

  const issueKey = res.body.issueKey;
  if (!issueKey || !issueKey.startsWith("LIT-")) {
    console.error(`[FATAL] Expected Jira issue key starting with 'LIT-', but got: ${issueKey}`);
    process.exit(1);
  }

  console.log(`\n[PASS] Verified! Website lead attributed to LinkedIn routed strictly to Project LIT!`);
  console.log(`       Jira Issue Key : ${issueKey}`);
  console.log(`       Jira Issue URL : https://${process.env.JIRA_DOMAIN || "srilakshanaint2027g3-1790324760192.atlassian.net"}/browse/${issueKey}`);

  // Deduplication check: Re-submit same lead
  console.log("\nTesting deduplication on website enquiry...");
  const { req: dupReq, res: dupRes } = createMockReqRes({
    headers: { "x-forwarded-for": req.headers["x-forwarded-for"] },
    body: testLead,
  });
  await trackHandler(dupReq, dupRes);

  console.log("Duplicate Response Status:", dupRes.statusCode);
  console.log("Duplicate Response Body  :", JSON.stringify(dupRes.body, null, 2));

  if (!dupRes.body.duplicate || dupRes.body.issueKey !== issueKey) {
    console.error("[FATAL] Deduplication check failed for duplicate enquiry!");
    process.exit(1);
  }

  console.log(`[PASS] Deduplication confirmed! Preserved issue key: ${dupRes.body.issueKey}`);
}

verifyAttributionToLit().catch((err) => {
  console.error("Attribution verification failed:", err);
  process.exit(1);
});
