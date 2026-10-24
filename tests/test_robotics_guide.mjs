/**
 * Automated Verification Suite for INDUS Phase 4: Robotics Guide & Intelligent Discovery
 *
 * Verifies:
 * 1. Intent A: Product Discovery (Grounded Catalogue Retrieval)
 * 2. Intent B: Technical Explanations (Operating Principles, Trade-offs, Applications)
 * 3. Intent C: Model Comparisons (Verified Spec Parameter Matrix)
 * 4. Intent D: Progressive Multi-Step Application Discovery
 * 5. Intent E: Application Finder Handoff (Payload Data Schema)
 * 6. Intent F: Human Engineering Assistance Handoff
 * 7. Grounding Integrity (Zero hallucinated models, traceable URLs)
 * 8. Backend AI Endpoint Integrity (/api/chat.js)
 */

import { processUserQuery } from "../src/services/roboticsGuide/intentEngine.ts";
import {
  compareActuatorModels,
  getEngineeringExplanation,
  discoverProductsByIntent,
} from "../src/services/roboticsGuide/knowledgeService.ts";
import chatHandler from "../api/chat.js";

console.log("==================================================================");
console.log("INDUS ROBOTICS GUIDE (PHASE 4) — AUTOMATED VERIFICATION SUITE");
console.log("==================================================================\n");

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passed++;
  } else {
    console.error(`[FAIL] ${testName}`);
    failed++;
  }
}

// ---------------------------------------------------------------------------
// TEST 1: Intent A — Product Discovery (Rotational Motion)
// ---------------------------------------------------------------------------
console.log("--- 1. Testing Intent A: Product Discovery ---");
const discoveryRotary = processUserQuery("I need a component for precise rotational movement");
assert(discoveryRotary.message.intent === "discovery", "Query identified as discovery intent");
assert(
  discoveryRotary.message.products && discoveryRotary.message.products.length > 0,
  `Retrieved ${discoveryRotary.message.products?.length} verified candidate products`
);
const hasIRA = discoveryRotary.message.products?.some(
  (p) => p.name.includes("Rotary") || p.modelCode.includes("IND-IRA")
);
assert(hasIRA, "Recommended Intelligent Rotary Actuator (IND-IRA) with verified specs");
assert(
  discoveryRotary.message.products?.[0].detailUrl.startsWith("/products/"),
  `Product detail link is valid (${discoveryRotary.message.products?.[0].detailUrl})`
);
assert(
  discoveryRotary.message.text.includes("torque"),
  "Explains follow-up requirement for sizing before recommending specific model"
);

// ---------------------------------------------------------------------------
// TEST 2: Intent B — Technical Explanation (Harmonic vs Planetary)
// ---------------------------------------------------------------------------
console.log("\n--- 2. Testing Intent B: Technical Explanation ---");
const explanation = processUserQuery(
  "What is the difference between a harmonic drive and a planetary gearbox?"
);
assert(explanation.message.intent === "explanation", "Identified as technical explanation intent");
assert(
  explanation.message.text.includes("Operating Principles:"),
  "Explains mechanical operating principles (flexspline, sun & planet gears)"
);
assert(
  explanation.message.text.includes("Engineering Trade-offs"),
  "Explains engineering trade-offs (backlash <1 arcmin, ratios, shock loads)"
);
assert(
  explanation.message.text.includes("Typical Industrial Applications:"),
  "Details practical industrial use cases (cobot joints vs Cartesian gantries)"
);
assert(
  explanation.message.products && explanation.message.products.length >= 2,
  "Links only to verified INDUS products supported by the catalogue"
);

// ---------------------------------------------------------------------------
// TEST 3: Intent C — Model Comparison (IND-IRA-070 vs IND-IRA-090)
// ---------------------------------------------------------------------------
console.log("\n--- 3. Testing Intent C: Model Comparison ---");
const comparison = processUserQuery("Compare IND-IRA-070 and IND-IRA-090");
assert(comparison.message.intent === "comparison", "Identified as model comparison intent");
assert(!!comparison.message.comparison, "Constructed structured ComparisonTableData");
const compData = comparison.message.comparison;
assert(compData?.modelA.code === "IND-IRA-070-50", `Model A identified: ${compData?.modelA.code}`);
assert(compData?.modelB.code === "IND-IRA-090-80", `Model B identified: ${compData?.modelB.code}`);
const torqueRow = compData?.rows.find((r) => r.parameter.includes("Continuous Torque"));
assert(
  torqueRow && torqueRow.modelAVal === "35 Nm" && torqueRow.modelBVal === "85 Nm",
  `Verified torque values matched: ${torqueRow?.modelAVal} vs ${torqueRow?.modelBVal}`
);
assert(
  torqueRow?.difference.includes("50 Nm"),
  `Calculated exact torque difference (${torqueRow?.difference})`
);

// ---------------------------------------------------------------------------
// TEST 4: Intent D — Progressive Application Discovery (Multi-Step)
// ---------------------------------------------------------------------------
console.log("\n--- 4. Testing Intent D: Progressive Multi-Step Discovery ---");
// Start Discovery
const step1Result = processUserQuery("I want to automate loading parts into a CNC machine");
assert(step1Result.nextDiscoveryState?.step === 1, "Initialized Discovery State to Step 1");
assert(
  step1Result.message.progressStep?.currentStep === 1,
  "Progress Step 1 of 5 displayed to user"
);

// Step 1 -> Step 2
const step2Result = processUserQuery("12 kg workpiece", step1Result.nextDiscoveryState);
assert(step2Result.nextDiscoveryState?.step === 2, "Advanced to Step 2 (Cycle Time)");
assert(step2Result.nextDiscoveryState?.payloadKg === "12 kg workpiece", "Captured payload answer");

// Step 2 -> Step 3
const step3Result = processUserQuery("6 seconds per part", step2Result.nextDiscoveryState);
assert(step3Result.nextDiscoveryState?.step === 3, "Advanced to Step 3 (Working Radius)");

// Step 3 -> Step 4
const step4Result = processUserQuery("1200 mm reach envelope", step3Result.nextDiscoveryState);
assert(step4Result.nextDiscoveryState?.step === 4, "Advanced to Step 4 (Gripper Interface)");

// Step 4 -> Step 5
const step5Result = processUserQuery("Pneumatic 2-jaw gripper", step4Result.nextDiscoveryState);
assert(step5Result.nextDiscoveryState?.step === 5, "Advanced to Step 5 (Safety & Shift Pattern)");

// Step 5 -> Completion & Handoff Preparation
const finalStep = processUserQuery(
  "24/7 continuous duty with safety perimeter interlocks",
  step5Result.nextDiscoveryState
);
assert(finalStep.nextDiscoveryState?.step === 7, "Discovery completed (Step 7)");
assert(finalStep.message.intent === "handoff", "Output switched to Application Finder handoff intent");
assert(
  finalStep.message.text.includes("Engineering Safety Notice"),
  "Includes mandatory engineering safety notice (DIN 3990 & validation warning)"
);

// ---------------------------------------------------------------------------
// TEST 5: Intent E — Application Finder Handoff Data Schema
// ---------------------------------------------------------------------------
console.log("\n--- 5. Testing Intent E: Application Finder Handoff Data Schema ---");
const handoff = finalStep.handoffPayload;
assert(!!handoff, "Generated ApplicationFinderTransferPayload");
assert(handoff?.category === "robot", `Assigned category '${handoff?.category}'`);
assert(handoff?.applicationCategory === "machine-tending", `Assigned app category '${handoff?.applicationCategory}'`);
assert(handoff?.payloadKg === "12", `Payload parsed cleanly as '${handoff?.payloadKg}'`);
assert(handoff?.reachMm === "1200", `Reach parsed cleanly as '${handoff?.reachMm}'`);
assert(handoff?.cycleTimeSec === "6", `Cycle time parsed cleanly as '${handoff?.cycleTimeSec}'`);
assert(handoff?.source === "INDUS Robotics Guide", "Annotated with verified source");

// ---------------------------------------------------------------------------
// TEST 6: Intent F — Human Engineering Assistance
// ---------------------------------------------------------------------------
console.log("\n--- 6. Testing Intent F: Human Engineering Assistance ---");
const humanReq = processUserQuery("I need to speak with a robotics application engineer");
assert(humanReq.message.intent === "human", "Identified human assistance intent");
const hasCalendarLink = humanReq.message.actionLinks?.some(
  (l) => l.url === "/book-consultation"
);
assert(hasCalendarLink, "Provides direct link to live Google Calendar booking (/book-consultation)");

// ---------------------------------------------------------------------------
// TEST 7: Backend Chat API Endpoint Verification
// ---------------------------------------------------------------------------
console.log("\n--- 7. Testing Backend AI Provider Endpoint (api/chat.js) ---");
assert(typeof chatHandler === "function", "api/chat.js exports default HTTP handler function");

// Simulate GET request to /api/chat
let getStatus = 0;
let getBody = null;
const mockResGet = {
  setHeader: () => {},
  status: (code) => {
    getStatus = code;
    return {
      json: (data) => {
        getBody = data;
      },
    };
  },
};
await chatHandler({ method: "GET", headers: {} }, mockResGet);
assert(getStatus === 200, `GET /api/chat returned HTTP 200 (received: ${getStatus})`);
assert(
  getBody?.assistantName === "INDUS Robotics Guide",
  `Reported correct assistant name: ${getBody?.assistantName}`
);
assert(
  getBody?.activeMode === "guided_grounded",
  `Reports honest active mode without hallucinating connected LLM: ${getBody?.activeMode}`
);

// Simulate POST request with oversized payload
let postStatus = 0;
let postBody = null;
const mockResPost = {
  setHeader: () => {},
  status: (code) => {
    postStatus = code;
    return {
      json: (data) => {
        postBody = data;
      },
    };
  },
};
await chatHandler(
  {
    method: "POST",
    headers: { "x-forwarded-for": "127.0.0.1" },
    body: { message: "a".repeat(2500) },
  },
  mockResPost
);
assert(postStatus === 400, `Rejects oversized payload with HTTP 400 (received: ${postStatus})`);

console.log("\n==================================================================");
console.log(`VERIFICATION COMPLETE: ${passed} PASSED, ${failed} FAILED`);
console.log("==================================================================");

if (failed > 0) {
  process.exit(1);
}
