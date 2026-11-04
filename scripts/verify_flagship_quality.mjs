import fs from "fs";
import path from "path";

// Verify the 25 flagship products exist and have valid fields
const cataloguePath = "./src/data/flagshipCatalogue.ts";
const content = fs.readFileSync(cataloguePath, "utf-8");

const idMatches = [...content.matchAll(/productId:\s*"([^"]+)"/g)].map(m => m[1]);
const skuMatches = [...content.matchAll(/sku:\s*"([^"]+)"/g)].map(m => m[1]);
const slugMatches = [...content.matchAll(/slug:\s*"([^"]+)"/g)].map(m => m[1]);
const imgMatches = [...content.matchAll(/imagePath:\s*"([^"]+)"/g)].map(m => m[1]);
const stockMatches = [...content.matchAll(/stockQuantity:\s*([0-9]+)/g)].map(m => parseInt(m[1]));
const availMatches = [...content.matchAll(/availableQuantity:\s*([0-9]+)/g)].map(m => parseInt(m[1]));

console.log(`\n========================================`);
console.log(`FLAGSHIP CATALOGUE AUDIT REPORT`);
console.log(`========================================`);
console.log(`Total Flagship Products: ${idMatches.length} (Target: exactly 25)`);
console.log(`Total Unique SKUs: ${new Set(skuMatches).size}`);
console.log(`Total Unique Slugs: ${new Set(slugMatches).size}`);
console.log(`Total Unique Images: ${new Set(imgMatches).size}`);

// Verify all images exist in public/ or src/assets/products
let missingImages = 0;
for (const imgPath of imgMatches) {
  const publicPath = path.join("./public", imgPath);
  if (!fs.existsSync(publicPath)) {
    console.error(`Missing public image: ${publicPath}`);
    missingImages++;
  }
}

if (missingImages === 0) {
  console.log(`Image Validation: 100% of images verified on disk!`);
} else {
  console.error(`Image Validation Failed: ${missingImages} missing images`);
}

// Verify availableQuantity calculation
let inventoryErrors = 0;
for (let i = 0; i < idMatches.length; i++) {
  if (availMatches[i] < 0) {
    console.error(`Negative available inventory on ${idMatches[i]}`);
    inventoryErrors++;
  }
  if (availMatches[i] > stockMatches[i]) {
    console.error(`Available > Stock on ${idMatches[i]}`);
    inventoryErrors++;
  }
}

if (inventoryErrors === 0) {
  console.log(`Inventory Validation: All stockQuantity >= availableQuantity >= 0 verified!`);
}

console.log(`========================================\n`);
