import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { TOP_LEVEL_CATEGORIES } from "../src/data/productTaxonomy";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const output: string[] = [];

for (const cat of TOP_LEVEL_CATEGORIES) {
  output.push(`\n=== CATEGORY: ${cat.title} (${cat.id}) ===`);
  for (const g of cat.groups) {
    output.push(`  Subfamily: ${g.groupName} (${g.items.length} products)`);
    for (const item of g.items) {
      output.push(`    - [${item.id}] ${item.name} | Spec: ${item.specHighlight}`);
    }
  }
}

const outStr = output.join("\n");
console.log(outStr);

fs.writeFileSync(path.join(__dirname, "../reports/taxonomy_dump.txt"), outStr, "utf-8");
