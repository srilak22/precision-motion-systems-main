import { categories, getCategory, productsIn } from "../src/data/robotics";
import { TOP_LEVEL_CATEGORIES } from "../src/data/productTaxonomy";
import { CATALOGUE_LINES } from "../src/data/productCatalogue";

const allPossibleSlugs = [
  // 8 Master Categories
  "motion-actuation",
  "robotic-systems",
  "mobility-systems",
  "control-drives",
  "sensing-vision",
  "end-effectors",
  "mechanical-components",
  "safety-intelligent",

  // Legacy categories
  "actuators",
  "precision-reducers",
  "robotic-wheels",
  "robotic-arms",
  "industrial-robots",
  "control-systems",

  // 12 lines
  "servo-motors",
  "robot-joint-actuators",
  "linear-motion",
  "sensors-encoders",
  "machine-vision",
  "robot-controllers",
  "servo-drives",
  "mechanical-transmission",
  "robotics-safety",
  "networking-edge",
];

console.log("=== SLUG AUDIT ===");
allPossibleSlugs.forEach((slug) => {
  const cat = getCategory(slug);
  const prods = productsIn(slug);
  const prodIds = prods.map((p) => p.id);
  const uniqueProdIds = new Set(prodIds);
  const images = prods.map((p) => p.image);
  const uniqueImages = new Set(images);

  console.log(`\nSlug: "${slug}"`);
  console.log(`  Found category? ${Boolean(cat)} -> Title: "${cat?.title}"`);
  console.log(`  Products count: ${prods.length} (Unique IDs: ${uniqueProdIds.size})`);
  if (prods.length !== uniqueProdIds.size) {
    console.log(`  ⚠️ DUPLICATES DETECTED: total=${prods.length}, unique=${uniqueProdIds.size}`);
    // find which ids repeat
    const counts: Record<string, number> = {};
    prodIds.forEach(id => counts[id] = (counts[id] || 0) + 1);
    const repeated = Object.entries(counts).filter(([_, c]) => c > 1);
    console.log(`  Repeated IDs:`, repeated);
  }
  console.log(`  Unique image keys: ${uniqueImages.size}`, Array.from(uniqueImages));
});
