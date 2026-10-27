import { getApplication, applicationsData } from "../src/data/applications";

console.log("==================================================================");
console.log("APPLICATION RESOLUTION & CAPABILITIES AUDIT SUITE");
console.log("==================================================================\n");

const REQUIRED_CATEGORIES = [
  { slug: "machine-tending", expectedTitle: "Machine Tending" },
  { slug: "pick-and-place", expectedTitle: "Pick and Place" },
  { slug: "assembly-automation", expectedTitle: "Assembly Automation" },
  { slug: "material-handling", expectedTitle: "Material Handling" },
  { slug: "machine-vision-inspection", expectedTitle: "Machine Vision Inspection" },
  { slug: "palletizing-depalletizing", expectedTitle: "Palletizing and Depalletizing" },
  { slug: "welding", expectedTitle: "Welding & Fabrication" },
  { slug: "surface-finishing", expectedTitle: "Surface Finishing" },
];

const ALIASES_TO_TEST = [
  { alias: "assembly", target: "Assembly Automation" },
  { alias: "palletizing", target: "Palletizing and Depalletizing" },
  { alias: "inspection", target: "Machine Vision Inspection" },
  { alias: "robotic-welding", target: "Welding & Fabrication" },
];

let passed = 0;
let failed = 0;

function assert(condition: boolean, msg: string) {
  if (condition) {
    console.log(`[PASS] ${msg}`);
    passed++;
  } else {
    console.error(`[FAIL] ${msg}`);
    failed++;
  }
}

console.log("--- 1. Testing Core 8 Application Categories Resolution ---");
for (const item of REQUIRED_CATEGORIES) {
  const app = getApplication(item.slug);
  assert(!!app, `Slug '${item.slug}' resolves to an ApplicationItem`);
  if (app) {
    assert(app.title === item.expectedTitle, `'${item.slug}' has expected title '${item.expectedTitle}' (got '${app.title}')`);
    assert(!!app.shortDescription && app.shortDescription.length > 20, `'${item.slug}' has descriptive shortDescription`);
    assert(!!app.industryOverview && app.industryOverview.length > 50, `'${item.slug}' has detailed industryOverview`);
    assert(app.automationChallenges.points.length >= 3, `'${item.slug}' has at least 3 automation challenges`);
    assert(app.roboticOpportunity.points.length >= 3, `'${item.slug}' has at least 3 robotic opportunities`);
    assert(app.systemArchitecture.length === 4, `'${item.slug}' has 4-step system architecture`);
    assert(app.relevantProducts.length >= 3, `'${item.slug}' has at least 3 relevant products`);
    assert(app.relevantProducts.every((p) => p.href.startsWith("/products/")), `'${item.slug}' all relevantProducts have valid /products/... paths`);
  }
}

console.log("\n--- 2. Testing Aliases & Route Permutations ---");
for (const item of ALIASES_TO_TEST) {
  const app = getApplication(item.alias);
  assert(!!app, `Alias '${item.alias}' resolves`);
  if (app) {
    assert(app.title === item.target, `Alias '${item.alias}' maps to title '${item.target}' (got '${app.title}')`);
  }
}

console.log(`\n==================================================================`);
console.log(`RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log(`==================================================================`);

if (failed > 0) {
  process.exit(1);
}
