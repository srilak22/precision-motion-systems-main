import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { TOP_LEVEL_CATEGORIES } from "../src/data/productTaxonomy";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read images.ts as text
const imagesTsContent = fs.readFileSync(path.join(__dirname, "../src/lib/images.ts"), "utf-8");

// Extract productToImageMap
const mapBlockMatch = imagesTsContent.match(/export const productToImageMap: Record<string, string> = {([\s\S]*?)};/);
if (!mapBlockMatch) {
  console.error("Could not find productToImageMap in src/lib/images.ts");
  process.exit(1);
}

const mapLines = mapBlockMatch[1].split("\n");
const mapping: Record<string, string> = {};

for (const line of mapLines) {
  const match = line.match(/"([^"]+)":\s*([a-zA-Z0-9_]+),/);
  if (match) {
    mapping[match[1]] = match[2];
  }
}

interface ProductImageAudit {
  id: string;
  name: string;
  category: string;
  subfamily: string;
  mappedAssetVar: string;
}

const auditList: ProductImageAudit[] = [];
const subfamilyImageMap: Record<string, Set<string>> = {};
const unmappedProducts: string[] = [];

TOP_LEVEL_CATEGORIES.forEach((cat) => {
  cat.groups.forEach((group) => {
    const key = `${cat.id} :: ${group.groupName}`;
    subfamilyImageMap[key] = new Set<string>();

    group.items.forEach((item) => {
      const assetVar = mapping[item.id];
      if (!assetVar) {
        unmappedProducts.push(item.id);
      } else {
        auditList.push({
          id: item.id,
          name: item.name,
          category: cat.title,
          subfamily: group.groupName,
          mappedAssetVar: assetVar,
        });
        subfamilyImageMap[key].add(assetVar);
      }
    });
  });
});

console.log("=== PRODUCT IMAGE AUDIT & MAPPING VERIFICATION ===");
console.log(`Total Products Audited: ${auditList.length}`);
console.log(`Unmapped Canonical Products: ${unmappedProducts.length}`);
console.log(`Total Subfamilies Audited: ${Object.keys(subfamilyImageMap).length}`);

const uniqueAssetVars = new Set(auditList.map((a) => a.mappedAssetVar));
console.log(`Distinct Visual Asset Variables Employed: ${uniqueAssetVars.size}`);

console.log("\n--- Subfamily Distinct Images Breakdown ---");
TOP_LEVEL_CATEGORIES.forEach((cat) => {
  console.log(`\nCategory: [${cat.title}]`);
  cat.groups.forEach((group) => {
    const key = `${cat.id} :: ${group.groupName}`;
    const imgs = Array.from(subfamilyImageMap[key] || []);
    console.log(`  Subfamily: "${group.groupName}" (${group.items.length} products)`);
    console.log(`    Mapped Assets: ${imgs.join(", ")}`);
  });
});

const outPath = path.join(__dirname, "../reports/subfamily_image_audit.json");
fs.writeFileSync(outPath, JSON.stringify(auditList, null, 2), "utf-8");
console.log(`\nSaved verification report to: ${outPath}`);
