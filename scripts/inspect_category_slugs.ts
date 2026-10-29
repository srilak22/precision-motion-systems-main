import { productsIn } from "../src/data/robotics";
import { TOP_LEVEL_CATEGORIES } from "../src/data/productTaxonomy";

console.log("=== Category Slugs in productsIn ===");
TOP_LEVEL_CATEGORIES.forEach((cat) => {
  const prods = productsIn(cat.id);
  const sample = prods.slice(0, 3).map((p) => `${p.id} (categorySlug: ${p.categorySlug})`);
  console.log(`[${cat.id}]:`, sample.join(", "));
});
