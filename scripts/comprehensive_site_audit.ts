import { TOP_LEVEL_CATEGORIES } from "../src/data/productTaxonomy";
import { CATALOGUE_LINES, getCatalogueLine, getRangeById } from "../src/data/productCatalogue";
import { getCategory, getProduct, productsIn } from "../src/data/robotics";
import { getProductImageUrl } from "../src/lib/images";
import { navigationData } from "../src/data/navigation";

console.log("=================================================================");
console.log("        INDUS INDUSTRIAL ROBOTICS — COMPREHENSIVE SITE AUDIT     ");
console.log("=================================================================\n");

let errorCount = 0;
let warnCount = 0;

// TEST 1: Canonical 8 Categories & Product Uniqueness
console.log("--- 1. MASTER PRODUCT TAXONOMY AUDIT ---");
const globalItemIds: string[] = [];
TOP_LEVEL_CATEGORIES.forEach((cat) => {
  const catItemIds: string[] = [];
  cat.groups.forEach((g) => {
    g.items.forEach((item) => {
      catItemIds.push(item.id);
      globalItemIds.push(item.id);

      // Verify item exists in catalogue
      const range = getRangeById(item.id);
      if (!range) {
        console.error(`❌ Missing range for item ID: "${item.id}" in group "${g.groupName}"`);
        errorCount++;
      }

      // Verify item resolves in getProduct
      const prod = getProduct(item.id);
      if (!prod) {
        console.error(`❌ getProduct failed for ID: "${item.id}"`);
        errorCount++;
      }
    });
  });

  const uniqueInCat = new Set(catItemIds);
  if (uniqueInCat.size !== catItemIds.length) {
    console.error(`❌ Category [${cat.id}] "${cat.title}" contains duplicates! Total: ${catItemIds.length}, Unique: ${uniqueInCat.size}`);
    errorCount++;
  } else {
    console.log(`  ✓ Category [${cat.id}] "${cat.title}": ${catItemIds.length} items (100% unique)`);
  }
});

const globalUniqueSet = new Set(globalItemIds);
console.log(`\nTotal items across 8 categories: ${globalItemIds.length}`);
console.log(`Global unique IDs: ${globalUniqueSet.size}`);
if (globalItemIds.length !== globalUniqueSet.size) {
  console.error(`❌ Global duplicate item IDs detected across categories!`);
  errorCount++;
} else {
  console.log(`  ✓ 100% global uniqueness across all categories.`);
}

// TEST 2: productsIn Resolution per Category
console.log("\n--- 2. CATEGORY RESOLUTION & CARD COUNTS ---");
TOP_LEVEL_CATEGORIES.forEach((cat) => {
  const products = productsIn(cat.id);
  const prodIds = products.map((p) => p.id);
  const uniqueIds = new Set(prodIds);

  if (products.length !== uniqueIds.size) {
    console.error(`❌ productsIn("${cat.id}") returned ${products.length} products but only ${uniqueIds.size} unique IDs!`);
    errorCount++;
  } else {
    console.log(`  ✓ productsIn("${cat.id}"): ${products.length} products (0 duplicate cards)`);
  }
});

// TEST 3: Photographic Image Mapping Verification
console.log("\n--- 3. IMAGE MAPPING & BROKEN ASSET REPAIR ---");
const fallbackSvgMatches: string[] = [];
globalUniqueSet.forEach((id) => {
  const imgUrl = getProductImageUrl(id);
  if (!imgUrl || imgUrl.includes("fallback-product.svg")) {
    fallbackSvgMatches.push(id);
  }
});

if (fallbackSvgMatches.length > 0) {
  console.warn(`⚠️ Warning: ${fallbackSvgMatches.length} products fell back to fallback-product.svg:`, fallbackSvgMatches.slice(0, 5));
  warnCount++;
} else {
  console.log(`  ✓ 100% of canonical products resolve to authentic photographic assets! (0 fallback svgs)`);
}

// TEST 4: Products MegaMenu & Navigation Routes
console.log("\n--- 4. NAVIGATION & DESTINATION ROUTES ---");
const navGroups = navigationData.products.groups || [];
console.log(`Products navigation groups: ${navGroups.length}`);
navGroups.forEach((g) => {
  const cat = getCategory(g.slug);
  if (!cat) {
    console.error(`❌ Navigation group "${g.name}" (slug: ${g.slug}) has no matching category!`);
    errorCount++;
  } else {
    console.log(`  ✓ Nav group "${g.name}" -> ${g.href} (Category found: "${cat.title}")`);
  }
});

// TEST 5: Catalogue Lines Integrity
console.log("\n--- 5. CATALOGUE LINES AUDIT ---");
console.log(`Catalogue Lines total: ${CATALOGUE_LINES.length}`);
let totalCatalogueRanges = 0;
const allCatalogueRangeIds: string[] = [];

CATALOGUE_LINES.forEach((l) => {
  totalCatalogueRanges += l.ranges.length;
  l.ranges.forEach((r) => {
    allCatalogueRangeIds.push(r.id);
    if (!r.name || !r.engineeringPurpose || !r.specificationSummary) {
      console.error(`❌ Incomplete range data for "${r.id}" in line "${l.id}"`);
      errorCount++;
    }
  });
});

const uniqueRangeIds = new Set(allCatalogueRangeIds);
console.log(`Total catalogue ranges: ${totalCatalogueRanges} across ${CATALOGUE_LINES.length} lines`);
if (totalCatalogueRanges !== uniqueRangeIds.size) {
  console.error(`❌ Duplicate range IDs found in CATALOGUE_LINES! Total: ${totalCatalogueRanges}, Unique: ${uniqueRangeIds.size}`);
  errorCount++;
} else {
  console.log(`  ✓ 100% unique range IDs in CATALOGUE_LINES.`);
}

console.log("\n=================================================================");
if (errorCount === 0) {
  console.log(`🎉 ALL AUDIT CHECKS PASSED WITH 0 ERRORS! (Warnings: ${warnCount})`);
} else {
  console.error(`💥 AUDIT FAILED WITH ${errorCount} ERRORS!`);
}
console.log("=================================================================\n");
