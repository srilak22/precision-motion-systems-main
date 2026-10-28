import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { TOP_LEVEL_CATEGORIES } from "../src/data/productTaxonomy";
import { getProductImageUrl } from "../src/lib/images";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ProductImageAuditRecord {
  id: string;
  name: string;
  category: string;
  family: string;
  mappedImage: string;
  isFallback: boolean;
}

const auditRecords: ProductImageAuditRecord[] = [];
const imageUsageCount: Record<string, number> = {};
const categoryImages: Record<string, Set<string>> = {};

TOP_LEVEL_CATEGORIES.forEach((cat) => {
  categoryImages[cat.title] = new Set<string>();
  cat.groups.forEach((group) => {
    group.items.forEach((item) => {
      const img = getProductImageUrl({ id: item.id, name: item.name, categorySlug: cat.id, category: cat.title });
      const imgName = typeof img === "string" ? img.split("/").pop() || img : "unknown";
      
      const isFallback = imgName.includes("fallback-product.svg");
      auditRecords.push({
        id: item.id,
        name: item.name,
        category: cat.title,
        family: group.groupName,
        mappedImage: imgName,
        isFallback
      });

      imageUsageCount[imgName] = (imageUsageCount[imgName] || 0) + 1;
      categoryImages[cat.title].add(imgName);
    });
  });
});

console.log("=== PRODUCT IMAGE AUDIT REPORT ===");
console.log(`Total Products Audited: ${auditRecords.length}`);
console.log("\n--- Unique Images Used & Usage Counts ---");
Object.entries(imageUsageCount)
  .sort((a, b) => b[1] - a[1])
  .forEach(([img, count]) => {
    console.log(`  ${img}: ${count} products`);
  });

console.log("\n--- Category Image Distribution ---");
Object.entries(categoryImages).forEach(([catTitle, imgs]) => {
  console.log(`\nCategory: ${catTitle} (${imgs.size} distinct image assets):`);
  imgs.forEach(i => console.log(`   - ${i}`));
});

const reportPath = path.join(__dirname, "../reports/image_audit_deep.json");
fs.writeFileSync(reportPath, JSON.stringify(auditRecords, null, 2), "utf-8");
console.log(`\nSaved deep image audit to: ${reportPath}`);
