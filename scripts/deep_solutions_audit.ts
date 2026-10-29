import { solutionsData, getSolution } from "../src/data/solutions";
import { navigationData } from "../src/data/navigation";
import { products } from "../src/data/robotics";
import { segmentsData } from "../src/data/segmentsData";

const TARGET_SOLUTIONS = [
  "motion-control",
  "robotic-automation",
  "machine-integration",
  "material-handling",
  "precision-positioning",
  "custom-engineering"
];

const LEGACY_SOLUTIONS = [
  "factory-automation",
  "mobile-robotics",
  "smart-manufacturing",
  "custom-robotics"
];

console.log("=== TARGET 6 SOLUTIONS AUDIT ===");
for (const slug of TARGET_SOLUTIONS) {
  const sol = getSolution(slug);
  console.log(`\n-----------------------------------------`);
  console.log(`Target Slug: /solutions/${slug}`);
  if (!sol) {
    console.log(`STATUS: MISSING in solutionsData! (getSolution returned undefined)`);
  } else {
    console.log(`STATUS: Found in data`);
    console.log(`Title: ${sol.title}`);
    console.log(`Subtitle: ${sol.heroSubtitle}`);
    console.log(`Short Description: ${sol.shortDescription}`);
    console.log(`Technologies:`, sol.technologiesUsed?.join(", "));
    console.log(`Architecture Steps:`, sol.systemArchitecture?.length || 0);
    console.log(`Typical Applications:`, sol.typicalApplications?.join("; "));
    console.log(`Related Products:`, sol.relatedProducts?.map(p => `${p.name} (${p.href})`).join(", "));
    console.log(`Resources:`, sol.resources?.map(r => `${r.title} (${r.href})`).join(", "));
  }
}

console.log(`\n=== LEGACY SLUGS CHECK ===`);
for (const slug of LEGACY_SOLUTIONS) {
  const sol = getSolution(slug);
  console.log(`Legacy Slug: /solutions/${slug} -> Found: ${!!sol} (Title: ${sol?.title})`);
}

console.log(`\n=== SEGMENTS DATA SLUGS (for cross-linking) ===`);
console.log(Object.keys(segmentsData).join(", "));
