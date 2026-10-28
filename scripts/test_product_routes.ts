import { TOP_LEVEL_CATEGORIES } from "../src/data/productTaxonomy";
import { getCategory, getProduct } from "../src/data/robotics";

console.log("=== TESTING ALL 164 CANONICAL PRODUCT ROUTES ===");
let resolvedCount = 0;
let failedCount = 0;

TOP_LEVEL_CATEGORIES.forEach((cat) => {
  const catObj = getCategory(cat.id);
  if (!catObj) {
    console.error(`❌ Category not found: ${cat.id}`);
    failedCount++;
    return;
  }

  cat.groups.forEach((g) => {
    g.items.forEach((item) => {
      const prod = getProduct(item.id);
      if (!prod) {
        console.error(`❌ Product not found: ${item.id} in ${cat.id}`);
        failedCount++;
      } else {
        resolvedCount++;
      }
    });
  });
});

console.log(`\nResults:`);
console.log(`  Resolved canonical products: ${resolvedCount} / 164`);
console.log(`  Failed canonical products: ${failedCount}`);

if (resolvedCount === 164 && failedCount === 0) {
  console.log(`✅ 100% CANONICAL ROUTES PASS: Every single product detail page resolves flawlessly!`);
}
