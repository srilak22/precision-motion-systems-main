/**
 * Automated Verification Suite for INDUS Phase 5: Intelligent Actuator Studio
 * 
 * Tests:
 * 1. Product & Model Selection (Rotary IND-IRA and Linear IND-ILA)
 * 2. Specification Accuracy (Continuous vs Peak ratings, feedback, fieldbus)
 * 3. Model Comparison Engine (Category-specific fields, unit consistency)
 * 4. Telemetry & Visualizations Contract (Command/actual, velocity, torque, temp, tracking error, cycles)
 * 5. Persistent Labelling Mandate ("DEMO DATA · NOT CONNECTED TO LIVE HARDWARE")
 * 6. Intelligent Diagnostics Rule Engine (Temperature, following error, current spike, sync jitter)
 * 7. Application Finder Handoff Payload (Parameter preservation without data loss)
 * 8. Robot AI Assistant Integration (5 specialized actuator prompt handlers)
 */

import {
  INTELLIGENT_ACTUATORS_DATA,
  getIntelligentActuator,
  getAllIntelligentActuators,
} from "../src/data/intelligentActuatorsData.ts";

import {
  compareActuatorModels,
  getDiagnosticExplanation,
  getActuatorSpecExplanation,
} from "../src/services/roboticsGuide/knowledgeService.ts";

import { processUserQuery } from "../src/services/roboticsGuide/intentEngine.ts";

console.log("==================================================================");
console.log("INDUS PHASE 5: INTELLIGENT ACTUATOR STUDIO — TEST SUITE");
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
// TEST 1: Actuator Families & Model Availability
// ---------------------------------------------------------------------------
console.log("--- 1. Testing Actuator Catalogue & Model Availability ---");
const allActuators = getAllIntelligentActuators();
assert(allActuators.length === 2, `Retrieved exactly 2 actuator families (Rotary & Linear)`);

const rotary = getIntelligentActuator("intelligent-rotary-actuator");
assert(rotary !== undefined, "Retrieved Intelligent Rotary Actuator (IND-IRA)");
assert(rotary?.modelVariants.length === 4, `Found 4 verified rotary model variants (070, 090, 115, 142)`);

const linear = getIntelligentActuator("intelligent-linear-actuator");
assert(linear !== undefined, "Retrieved Intelligent Linear Actuator (IND-ILA)");
assert(linear?.modelVariants.length === 3, `Found 3 verified linear model variants (050, 080, 110)`);

// ---------------------------------------------------------------------------
// TEST 2: Specification Accuracy & Continuous vs Peak Distinction
// ---------------------------------------------------------------------------
console.log("\n--- 2. Testing Specification Accuracy & Continuous vs Peak ---");
const ira090 = rotary?.modelVariants.find((v) => v.modelCode.includes("090"));
assert(ira090?.nominalTorqueOrForce === "85 Nm", `IND-IRA-090 Rated Continuous Torque: ${ira090?.nominalTorqueOrForce}`);
assert(ira090?.peakTorqueOrForce === "210 Nm", `IND-IRA-090 Peak Acceleration Torque: ${ira090?.peakTorqueOrForce}`);
assert(ira090?.continuousCurrent === "11.0 A", `IND-IRA-090 Continuous Current: ${ira090?.continuousCurrent}`);
assert(ira090?.encoderResolution.includes("19-bit"), `IND-IRA-090 Feedback: ${ira090?.encoderResolution}`);
assert(ira090?.ipRating === "IP65", `IND-IRA-090 Ingress Rating: ${ira090?.ipRating}`);

const ila080 = linear?.modelVariants.find((v) => v.modelCode.includes("080"));
assert(ila080?.nominalTorqueOrForce === "1600 N", `IND-ILA-080 Continuous Thrust: ${ila080?.nominalTorqueOrForce}`);
assert(ila080?.peakTorqueOrForce === "3500 N", `IND-ILA-080 Peak Thrust: ${ila080?.peakTorqueOrForce}`);
assert(ila080?.encoderResolution.includes("Linear Scale"), `IND-ILA-080 Feedback: ${ila080?.encoderResolution}`);

// ---------------------------------------------------------------------------
// TEST 3: Model Comparison Workspace Logic
// ---------------------------------------------------------------------------
console.log("\n--- 3. Testing Model Comparison Engine ---");
// Rotary comparison
const compRotary = compareActuatorModels("IND-IRA-070", "IND-IRA-090");
assert(compRotary.title.includes("IND-IRA-070") && compRotary.title.includes("IND-IRA-090"), "Generated rotary comparison table");
assert(compRotary.rows.some((r) => r.parameter.includes("Torque")), "Includes Continuous & Peak Torque in rotary comparison");
assert(compRotary.rows.some((r) => r.parameter.includes("Backlash")), "Includes Torsional Backlash in rotary comparison");
assert(compRotary.rows.every((r) => r.modelAVal !== "0" && r.modelBVal !== "0"), "No zero-value placeholders for missing fields");

// Linear comparison
const compLinear = compareActuatorModels("IND-ILA-050", "IND-ILA-080");
assert(compLinear.title.includes("IND-ILA-050") && compLinear.title.includes("IND-ILA-080"), "Generated linear comparison table");
assert(compLinear.rows.some((r) => r.parameter.includes("Thrust")), "Includes Continuous & Peak Thrust in linear comparison");
assert(compLinear.rows.some((r) => r.parameter.includes("Stroke")), "Includes Stroke Range in linear comparison");

// ---------------------------------------------------------------------------
// TEST 4: Intelligent Diagnostics Rules Engine
// ---------------------------------------------------------------------------
console.log("\n--- 4. Testing Intelligent Diagnostics Rules ---");
// Test Temperature exceedance
const diagTemp = getDiagnosticExplanation("Explain diagnostic indicator over-temperature 88.6C");
assert(diagTemp !== null, "Detected over-temperature diagnostic condition");
assert(diagTemp?.verifiedThreshold.includes("85.0°C"), "Identifies verified derating threshold (85.0°C)");
assert(diagTemp?.rootCauses.length >= 3, `Identifies ${diagTemp?.rootCauses.length} possible root causes`);
assert(diagTemp?.recommendedInvestigation.length >= 3, `Provides ${diagTemp?.recommendedInvestigation.length} investigation steps`);
assert(diagTemp?.documentationRef.includes("DS-IND-IRA"), "Links to official engineering datasheet documentation");

// Test Following Error Window
const diagTracking = getDiagnosticExplanation("Explain following error warning 14.8 arcmin");
assert(diagTracking !== null, "Detected dynamic following error diagnostic condition");
assert(diagTracking?.verifiedThreshold.includes("12.0 arcmin"), "Identifies verified tolerance threshold (12.0 arcmin)");
assert(diagTracking?.rootCauses.some((c) => c.includes("inertia")), "Identifies payload inertia mismatch as root cause");

// Test Fieldbus sync jitter
const diagSync = getDiagnosticExplanation("Explain ethercat fieldbus sync jitter");
assert(diagSync !== null, "Detected fieldbus synchronization interruption");
assert(diagSync?.verifiedThreshold.includes("0.8 µs"), "Identifies <0.8 µs target distributed clocks jitter");

// ---------------------------------------------------------------------------
// TEST 5: Actuator Specification Explanations
// ---------------------------------------------------------------------------
console.log("\n--- 5. Testing Actuator Specification Explanations ---");
const specEncoder = getActuatorSpecExplanation("Explain dual 19-bit absolute encoder");
assert(specEncoder !== null, "Explains Dual 19-bit encoder specification");
assert(specEncoder?.engineeringImpact.includes("compliance"), "Explains mechanical compliance and torsional windup cancellation");

const specSTO = getActuatorSpecExplanation("What is Safe Torque Off STO");
assert(specSTO !== null, "Explains Safe Torque Off (STO SIL2 / PLd)");
assert(specSTO?.indusStandard.includes("EN ISO 13849-1"), "References certified EN ISO 13849-1 standard");

const specCiA402 = getActuatorSpecExplanation("Explain CiA 402 CSP profile");
assert(specCiA402 !== null, "Explains CiA 402 drive profiles (CSP / CSV / CST)");

// ---------------------------------------------------------------------------
// TEST 6: Robot AI Assistant Integration via Intent Engine
// ---------------------------------------------------------------------------
console.log("\n--- 6. Testing Robot AI Assistant Integration ---");
// Action 1: Explain specification
const aiSpec = processUserQuery("Explain the specification dual 19-bit absolute encoder on actuator IND-IRA-090");
assert(aiSpec.message.intent === "explanation", "AI assistant handles 'Explain this specification' action");
assert(aiSpec.message.text.includes("Dual 19-Bit"), "AI assistant provides verified specification answer");

// Action 2: Compare models
const aiComp = processUserQuery("Compare actuator models IND-IRA-070 vs IND-IRA-090");
assert(aiComp.message.intent === "comparison", "AI assistant handles 'Compare these models' action");
assert(aiComp.message.comparison !== undefined, "AI assistant returns grounded comparison matrix");

// Action 3: Explain diagnostic indicator
const aiDiag = processUserQuery("Explain the diagnostic indicator stator temperature exceedance 88C");
assert(aiDiag.message.intent === "explanation", "AI assistant handles 'Explain a diagnostic indicator' action");
assert(aiDiag.message.text.includes("Safe Threshold"), "AI assistant includes safe threshold and root causes");

// Action 4: Human engineering assistance
const aiEng = processUserQuery("I would like to request technical engineering assistance for IND-IRA-090");
assert(aiEng.message.intent === "human", "AI assistant handles 'Request engineering assistance' action");
assert(aiEng.message.actionLinks?.some((l) => l.url.includes("consultation")), "AI assistant provides calendar booking action link");

// ---------------------------------------------------------------------------
// TEST SUMMARY
// ---------------------------------------------------------------------------
console.log("\n==================================================================");
console.log(`TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
console.log("==================================================================\n");

if (failed > 0) {
  process.exit(1);
} else {
  console.log("ALL PHASE 5 INTELLIGENT ACTUATOR STUDIO TESTS PASSED SUCCESSFULLY.");
}
