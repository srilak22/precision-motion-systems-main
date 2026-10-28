import { TOP_LEVEL_CATEGORIES } from '../src/data/productTaxonomy';
import { products, categories, productsIn, getProduct } from '../src/data/robotics';
import { getProductImageUrl } from '../src/lib/images';

console.log('=== DEEP PRODUCT CATALOGUE AUDIT ===\n');

// 1. Audit Top Level Taxonomy (8 Master Categories)
const seenIds = new Map<string, string>();
const imageStats = new Map<string, number>();
let totalMasterProducts = 0;
let missingImageCount = 0;
let fallbackCount = 0;

TOP_LEVEL_CATEGORIES.forEach((cat) => {
  console.log(`Auditing Category: ${cat.title} (${cat.id})`);
  cat.groups.forEach((group) => {
    group.items.forEach((item) => {
      totalMasterProducts++;
      if (seenIds.has(item.id)) {
        console.error(`  ❌ DUPLICATE ITEM ID DETECTED: ${item.id} in ${cat.id} (already in ${seenIds.get(item.id)})`);
      } else {
        seenIds.set(item.id, cat.id);
      }

      // Check product resolution
      const prod = getProduct(item.id);
      if (!prod) {
        console.error(`  ❌ Product not found via getProduct("${item.id}")`);
      }

      // Check image mapping
      const imgUrl = getProductImageUrl(item.id);
      if (!imgUrl) {
        missingImageCount++;
      } else if (imgUrl.includes('fallback')) {
        fallbackCount++;
      } else {
        imageStats.set(imgUrl, (imageStats.get(imgUrl) || 0) + 1);
      }
    });
  });
});

console.log(`\nMaster Taxonomy Products: ${totalMasterProducts}`);
console.log(`Unique Product IDs: ${seenIds.size}`);
console.log(`Missing Image URLs: ${missingImageCount}`);
console.log(`Fallback SVG Count: ${fallbackCount}`);
console.log(`Unique Photographic Assets Used: ${imageStats.size}`);

console.log('\n--- Asset Distribution across Catalogue ---');
for (const [img, count] of imageStats.entries()) {
  const filename = img.split('/').pop()?.split('\\').pop()?.split('?')[0];
  console.log(`  ${filename}: ${count} products`);
}

// 2. Audit Legacy products array
console.log(`\nLegacy Products in products array: ${products.length}`);
const legacySeen = new Set<string>();
products.forEach((p) => {
  if (legacySeen.has(p.id)) {
    console.error(`  ❌ Duplicate legacy product ID: ${p.id}`);
  }
  legacySeen.add(p.id);
});

console.log('\n=== AUDIT COMPLETE ===');
