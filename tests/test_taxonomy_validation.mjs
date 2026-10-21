/**
 * Automated Verification Test for Total Robotics Taxonomy
 * Validates:
 * 1. 8 Master Pillars existence and complete metadata
 * 2. Independent 8 Classification Facets
 * 3. Research Register (ISO 8373:2021, IFR Industrial, IFR Service)
 * 4. Knowledge Graph integrity: 0 duplicate IDs, 0 dangling references, PASS status
 */

import { TOTAL_ROBOTICS_PILLARS, getAllSubcategories } from "../src/data/taxonomy/roboticsTaxonomyData.js";
import { TAXONOMY_FACETS } from "../src/data/taxonomy/facets.js";
import { RESEARCH_REGISTER } from "../src/data/taxonomy/researchRegister.js";
import { validateTaxonomyGraph } from "../src/data/taxonomy/agenticRelations.js";

console.log("==================================================================");
console.log("INDUS TOTAL ROBOTICS TAXONOMY — AUTOMATED VERIFICATION SUITE");
console.log("==================================================================\n");

let passedTests = 0;
let failedTests = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`[FAIL] ${testName}`);
    failedTests++;
  }
}

// TEST 1: Eight Primary Pillars
console.log("--- 1. Testing Eight Primary Pillars ---");
assert(TOTAL_ROBOTICS_PILLARS.length === 8, `Exactly 8 pillars defined (found: ${TOTAL_ROBOTICS_PILLARS.length})`);
const expectedPillarIds = [
  "pillar:humanoid-robots",
  "pillar:industrial-robots",
  "pillar:mobile-driverless-robots",
  "pillar:robotic-mules-ugvs",
  "pillar:aerial-robotics",
  "pillar:underwater-robotics",
  "pillar:logistics-supply-chain",
  "pillar:autonomous-specialised",
];
for (const pId of expectedPillarIds) {
  const p = TOTAL_ROBOTICS_PILLARS.find((pillar) => pillar.id === pId);
  assert(!!p, `Pillar ${pId} exists and has category number ${p?.categoryNumber}`);
}

// TEST 2: Independent Classification Facets
console.log("\n--- 2. Testing 8 Independent Classification Facets ---");
const expectedFacets = ["morphology", "mobility", "environment", "domain", "capability", "autonomy", "manipulation", "deployment"];
assert(Object.keys(TAXONOMY_FACETS).length === 8, `All 8 independent classification facets defined`);
for (const fKey of expectedFacets) {
  const facet = TAXONOMY_FACETS[fKey];
  assert(facet && facet.options.length > 0, `Facet '${fKey}' has ${facet?.options.length} options`);
}

// TEST 3: Research Register & Standards Ground Truth
console.log("\n--- 3. Testing Research Register & ISO/IFR Standards ---");
assert(RESEARCH_REGISTER.length >= 8, `Research register has ${RESEARCH_REGISTER.length} verified standards`);
const hasIso8373 = RESEARCH_REGISTER.some((r) => r.id === "src:iso-8373-2021");
assert(hasIso8373, "ISO 8373:2021 Vocabulary standard registered");
const hasIfrInd = RESEARCH_REGISTER.some((r) => r.id === "src:ifr-industrial-2024");
assert(hasIfrInd, "IFR Industrial Robot classification registered");
const hasIfrSrv = RESEARCH_REGISTER.some((r) => r.id === "src:ifr-service-2024");
assert(hasIfrSrv, "IFR Service Robotics classification registered");

// TEST 4: Subcategories and SI Engineering Specifications
console.log("\n--- 4. Testing Canonical Subcategories and SI Specifications ---");
const subcategories = getAllSubcategories();
assert(subcategories.length >= 8, `Total subcategories defined: ${subcategories.length}`);
for (const sub of subcategories) {
  assert(sub.specifications.length >= 4, `${sub.title} has ${sub.specifications.length} engineering specifications`);
  assert(sub.configurations.length >= 1, `${sub.title} has ${sub.configurations.length} architectural configurations`);
  assert(sub.compatibleComponents.length >= 1, `${sub.title} has linked catalogue components`);
}

// TEST 5: Knowledge Graph Integrity Audit
console.log("\n--- 5. Testing Knowledge Graph & Agentic Network Integrity ---");
const report = validateTaxonomyGraph();
console.log(`- Total Graph Nodes: ${report.totalNodes}`);
console.log(`- Total Explicit Edges: ${report.totalEdges}`);
console.log(`- Duplicate IDs: ${report.duplicateIds.length}`);
console.log(`- Dangling Edges: ${report.danglingEdges.length}`);
console.log(`- Status: ${report.status}`);

assert(report.status === "PASS", `Graph validation status is PASS`);
assert(report.duplicateIds.length === 0, `Zero duplicate IDs across all nodes`);
assert(report.danglingEdges.length === 0, `Zero dangling edge references`);
assert(report.missingParents.length === 0, `Zero missing parent pillar linkages`);

console.log("\n==================================================================");
console.log(`SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED`);
console.log("==================================================================");

if (failedTests > 0) {
  process.exit(1);
}
