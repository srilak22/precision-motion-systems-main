import { categories, products, getProduct, getCategory, productsIn } from "../src/data/robotics";
import { TOP_LEVEL_CATEGORIES } from "../src/data/productTaxonomy";
import { CATALOGUE_LINES, getAllCatalogueLines } from "../src/data/productCatalogue";
import { navigationData } from "../src/data/navigation";
import { getProductImageUrl, productToImageMap, categoryImageMap, images } from "../src/lib/images";

console.log("=== PHASE 1: AUDIT RUNTIME INSPECTION ===");

// 1. Categories in robotics.ts
console.log(`\n--- Categories in robotics.ts (${categories.length}) ---`);
categories.forEach((c) => {
  const prods = productsIn(c.slug);
  console.log(`- [${c.slug}] "${c.title}": ${prods.length} products (subFamilies: ${c.subFamilies?.length || 0})`);
});

// 2. TOP_LEVEL_CATEGORIES in productTaxonomy.ts
console.log(`\n--- TOP_LEVEL_CATEGORIES in productTaxonomy.ts (${TOP_LEVEL_CATEGORIES.length}) ---`);
TOP_LEVEL_CATEGORIES.forEach((tc) => {
  const totalItems = tc.groups.reduce((acc, g) => acc + g.items.length, 0);
  console.log(`- [${tc.id}] "${tc.title}": route=${tc.primaryRoute}, groups=${tc.groups.length}, totalItems=${totalItems}`);
});

// 3. Products in robotics.ts
console.log(`\n--- Products in robotics.ts (${products.length}) ---`);
const idCounts: Record<string, number> = {};
const slugCounts: Record<string, number> = {};
const nameCounts: Record<string, number> = {};
const imageCounts: Record<string, number> = {};

products.forEach((p) => {
  idCounts[p.id] = (idCounts[p.id] || 0) + 1;
  slugCounts[p.slug] = (slugCounts[p.slug] || 0) + 1;
  nameCounts[p.name] = (nameCounts[p.name] || 0) + 1;
  imageCounts[p.image] = (imageCounts[p.image] || 0) + 1;
});

const dupIds = Object.entries(idCounts).filter(([_, count]) => count > 1);
const dupSlugs = Object.entries(slugCounts).filter(([_, count]) => count > 1);
const dupNames = Object.entries(nameCounts).filter(([_, count]) => count > 1);

console.log(`Duplicate IDs in products:`, dupIds);
console.log(`Duplicate Slugs in products:`, dupSlugs);
console.log(`Duplicate Names in products:`, dupNames);
console.log(`Images used in products:`, imageCounts);

// 4. Catalogue lines
const catLines = getAllCatalogueLines();
console.log(`\n--- CATALOGUE_LINES (${catLines.length}) ---`);
let totalCatRanges = 0;
catLines.forEach((l) => {
  totalCatRanges += l.ranges.length;
  console.log(`- Line [${l.id}] "${l.name}": ${l.ranges.length} ranges`);
});
console.log(`Total catalogue ranges: ${totalCatRanges}`);

// 5. Navigation audit for Products menu
console.log(`\n--- Navigation Products Section ---`);
const prodNav = navigationData["products"];
if (prodNav) {
  console.log(`Title: ${prodNav.title}, href: ${prodNav.href}, groups: ${prodNav.groups?.length}`);
  prodNav.groups?.forEach((g) => {
    console.log(`  Group: "${g.name}" (slug: ${g.slug}, href: ${g.href}) -> ${g.items.length} items:`);
    g.items.forEach((item) => {
      console.log(`    - "${item.name}" -> ${item.href}`);
    });
  });
}
