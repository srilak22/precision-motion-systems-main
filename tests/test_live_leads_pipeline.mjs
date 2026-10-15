import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env
try {
  const content = readFileSync(resolve(__dirname, "..", ".env"), "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
} catch (e) {
  console.error("Could not load .env:", e.message);
}

import trackHandler from "../api/track.js";
import youtubeLeadHandler from "../api/youtube-lead.js";

function createMockReqRes({ method = "POST", headers = {}, body = {} } = {}) {
  const req = {
    method,
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": `192.168.1.${Math.floor(Math.random() * 200) + 10}`,
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

async function runLivePipelineTests() {
  console.log("\n=======================================================");
  console.log("  TESTING LIVE LEADS PIPELINE: JIRA & GOOGLE SHEETS");
  console.log("=======================================================\n");

  const runId = Date.now();
  let diTicket = null;
  let yltTicket = null;

  // 1. Direct Website Enquiry to /api/track -> Should create ticket in DI
  console.log("[1] Submitting direct website enquiry to /api/track...");
  const directEnquiryBody = {
    event: "lead",
    name: `Direct Website Lead ${runId}`,
    email: `direct-lead-${runId}@example.com`,
    phone: "+91 9876543210",
    company: "Automated Pipeline Test Corp",
    type: "Commercial RFQ / Engineering Enquiry",
    topic: "Precision Ball Screws & Actuators",
    product: "Precision Ball Screws & Actuators",
    details: "Automated integration test for Direct Website enquiry sync to Jira (DI) and Google Sheets.",
    requirements: "Automated integration test for Direct Website enquiry sync to Jira (DI) and Google Sheets.",
    page: "/contact",
    url: "https://precision-motion-systems-main.vercel.app/contact",
    referrer: "",
  };

  const { req: req1, res: res1 } = createMockReqRes({ body: directEnquiryBody });
  await trackHandler(req1, res1);

  console.log("  Status Code:", res1.statusCode);
  console.log("  Response Body:", JSON.stringify(res1.body, null, 2));

  if (res1.statusCode === 200 && res1.body?.jiraKey) {
    diTicket = res1.body.jiraKey;
    console.log(`  ✓ SUCCESS: Jira ticket created in project DI: ${diTicket}`);
    if (res1.body.jiraKey.startsWith("DI-")) {
      console.log(`  ✓ Project Key verified: DI (Correct for direct website lead)`);
    } else {
      console.warn(`  ⚠ Warning: Ticket key does not start with DI-: ${res1.body.jiraKey}`);
    }
  } else {
    console.error("  ✗ FAILED to create direct website lead ticket in DI");
  }

  // 2. YouTube Lead to /api/youtube-lead -> Should create ticket in YLT
  console.log("\n[2] Submitting YouTube lead to /api/youtube-lead...");
  const ytEnquiryBody = {
    name: `YouTube Lead ${runId}`,
    email: `yt-lead-${runId}@example.com`,
    phone: "+91 9123456789",
    company: "YouTube Lead Gen Co",
    productInterest: "6-Axis Articulated Robots",
    estimatedBudget: "$25,000 - $50,000",
    timeline: "Immediate / 1 month",
    requirements: "Enquiry from YouTube video 6a0xBo_uJWI for 6-Axis robot cell.",
    topic: "6-Axis Articulated Robots",
    preferredContact: "Email",
    attribution: {
      videoId: "6a0xBo_uJWI",
      channelId: "@srilakshana-h1t",
      campaign: "youtube_video_6a0xBo_uJWI",
      utmSource: "youtube",
      utmMedium: "video",
      referrer: "https://www.youtube.com/watch?v=6a0xBo_uJWI",
      landingPage: "/contact",
    },
  };

  const { req: req2, res: res2 } = createMockReqRes({ body: ytEnquiryBody });
  await youtubeLeadHandler(req2, res2);

  console.log("  Status Code:", res2.statusCode);
  console.log("  Response Body:", JSON.stringify(res2.body, null, 2));

  if (res2.statusCode === 200 && res2.body?.issueKey) {
    yltTicket = res2.body.issueKey;
    console.log(`  ✓ SUCCESS: Jira ticket created in project YLT: ${yltTicket}`);
    if (res2.body.issueKey.startsWith("YLT-")) {
      console.log(`  ✓ Project Key verified: YLT (Correct for YouTube lead)`);
    } else {
      console.warn(`  ⚠ Warning: Ticket key does not start with YLT-: ${res2.body.issueKey}`);
    }
  } else {
    console.error("  ✗ FAILED to create YouTube lead ticket in YLT");
  }

  console.log("\n=======================================================");
  console.log("  SUMMARY:");
  console.log(`  Direct Lead Jira Ticket: ${diTicket || "NONE"}`);
  console.log(`  YouTube Lead Jira Ticket: ${yltTicket || "NONE"}`);
  console.log("  Google Sheets Target: 1S-ApP83X9Y1-nXwim0tDNGn72wuhVn4PSbaWkcXlH48");
  console.log("=======================================================\n");

  if (!diTicket || !yltTicket) {
    process.exit(1);
  }
}

runLivePipelineTests().catch((err) => {
  console.error("Exception in test run:", err);
  process.exit(1);
});
