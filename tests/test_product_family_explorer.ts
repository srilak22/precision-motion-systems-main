import { getCategory } from "../src/data/robotics";
import { images } from "../src/lib/images";

console.log("==================================================================");
console.log("PRODUCT FAMILY EXPLORER — AUTOMATED VERIFICATION SUITE");
console.log("==================================================================\n");

const PRODUCT_FAMILIES_TO_TEST = [
  { id: "precision-reducers", name: "Precision Reducers", route: "/products/precision-reducers", slug: "precision-reducers", imageKey: "harmonicReducer" },
  { id: "actuators", name: "Actuators and Motion Systems", route: "/products/actuators", slug: "actuators", imageKey: "linearActuator" },
  { id: "motors-drives", name: "Motors and Drives", route: "/products/servo-motors", slug: "servo-motors", imageKey: "servoDrive" },
  { id: "robotic-joints", name: "Robotic Joints", route: "/products/intelligent-actuators", slug: "intelligent-actuators", imageKey: "servoActuator" },
  { id: "sensors-control", name: "Sensors and Control", route: "/products/control-systems", slug: "control-systems", imageKey: "sensorsFeedback" },
  { id: "linear-motion", name: "Linear Motion Systems", route: "/products/linear-motion", slug: "linear-motion", imageKey: "electricActuator" },
  { id: "end-effectors", name: "End Effectors", route: "/products/end-effectors", slug: "end-effectors", imageKey: "components" },
  { id: "integrated-systems", name: "Integrated Robotic Systems", route: "/products/industrial-robots", slug: "industrial-robots", imageKey: "weldingRobot" },
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

console.log("--- 1. Testing Category Data Resolution for All 8 Families ---");
for (const family of PRODUCT_FAMILIES_TO_TEST) {
  const cat = getCategory(family.slug);
  assert(!!cat, `Category '${family.name}' (slug: '${family.slug}') resolves to a valid Category object`);
  if (cat) {
    assert(!!cat.title, `Category '${family.name}' has non-empty title: '${cat.title}'`);
    assert(!!cat.intro || !!cat.positioning, `Category '${family.name}' has valid technical description`);
  }
}

console.log("\n--- 2. Testing Product Image Assets ---");
for (const family of PRODUCT_FAMILIES_TO_TEST) {
  const img = (images as any)[family.imageKey];
  assert(!!img && typeof img === "string" && img.length > 0, `Image asset for '${family.name}' (${family.imageKey}) exists: ${typeof img}`);
}

console.log("\n--- 3. Testing Category Slugs Aliases ---");
const testAliases = [
  { input: "robotic-joints", expectedMatches: true },
  { input: "motors-drives", expectedMatches: true },
  { input: "sensors-control", expectedMatches: true },
  { input: "linear-motion-systems", expectedMatches: true },
  { input: "end-effectors", expectedMatches: true },
];

for (const alias of testAliases) {
  const cat = getCategory(alias.input);
  assert(!!cat, `Alias '${alias.input}' properly maps and resolves without 404`);
}

console.log("\n==================================================================");
console.log(`RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log("==================================================================");

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
