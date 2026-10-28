import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { TOP_LEVEL_CATEGORIES } from "../src/data/productTaxonomy";
import { CATALOGUE_LINES, getCatalogueLine, getRangeById } from "../src/data/productCatalogue";
import { categories as legacyCategories, products as legacyProducts } from "../src/data/robotics";
import { engineeringDossiers } from "../src/data/engineeringData";
import { getAllIntelligentActuators, getIntelligentActuator } from "../src/data/intelligentActuatorsData";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inventory data collection
interface ProductInventoryItem {
  id: string;
  name: string;
  categorySlug: string;
  categoryTitle: string;
  family: string;
  url: string;
  specCount: number;
  specCompleteness: "complete" | "partial" | "placeholder";
  descriptionCompleteness: "complete" | "partial" | "generic";
  applicationsCount: number;
  relatedCount: number;
  enquirySupported: boolean;
  requiredCorrections: string[];
  verificationStatus: string;
}

const inventory: ProductInventoryItem[] = [];

// 1. Process 164 Canonical Products from TOP_LEVEL_CATEGORIES
TOP_LEVEL_CATEGORIES.forEach((cat) => {
  cat.groups.forEach((group) => {
    group.items.forEach((item) => {
      const range = getRangeById(item.id);
      const dossier = engineeringDossiers[item.id] || engineeringDossiers[item.id.replace("ind-", "")];
      const intel = getIntelligentActuator(item.id);
      
      const corrections: string[] = [];

      // Check specs
      let specCount = 0;
      let specCompleteness: "complete" | "partial" | "placeholder" = "complete";
      if (range && range.specificationSummary) {
        specCount = Object.keys(range.specificationSummary).length;
        if (specCount < 3) {
          specCompleteness = "partial";
          corrections.push("Insufficient specification fields (<3)");
        }
      } else if (dossier && dossier.parameters) {
        specCount = dossier.parameters.length;
      } else if (intel && intel.specificationTable) {
        specCount = intel.specificationTable.length;
      } else {
        specCompleteness = "placeholder";
        corrections.push("Missing structured technical specifications");
      }

      // Check description
      let descriptionCompleteness: "complete" | "partial" | "generic" = "complete";
      const desc = range?.engineeringPurpose || dossier?.functionalOverview || intel?.headline;
      if (!desc || desc.length < 30) {
        descriptionCompleteness = "generic";
        corrections.push("Short or generic overview description");
      }

      // Check applications
      const apps = range?.typicalApplications || (intel ? intel.practicalApplications.map((a) => a.applicationName) : []);
      if (apps.length === 0) {
        corrections.push("No specific applications mapped");
      }

      // Check related
      const related = range?.relatedComponents || dossier?.relatedProductIds || (intel ? ["rotary", "linear"] : []);
      if (related.length === 0) {
        corrections.push("No related products linked");
      }

      inventory.push({
        id: item.id,
        name: item.name,
        categorySlug: cat.id,
        categoryTitle: cat.title,
        family: group.groupName,
        url: item.href,
        specCount,
        specCompleteness,
        descriptionCompleteness,
        applicationsCount: apps.length,
        relatedCount: related.length,
        enquirySupported: true,
        requiredCorrections: corrections,
        verificationStatus: range?.verificationStatus || (dossier ? "verified" : "preliminary"),
      });
    });
  });
});

console.log(`Inventory generated: ${inventory.length} canonical products.`);

// Summary by category
const catStats: Record<string, { total: number; completeSpecs: number; partialSpecs: number; placeholderSpecs: number }> = {};
inventory.forEach((item) => {
  if (!catStats[item.categoryTitle]) {
    catStats[item.categoryTitle] = { total: 0, completeSpecs: 0, partialSpecs: 0, placeholderSpecs: 0 };
  }
  catStats[item.categoryTitle].total++;
  if (item.specCompleteness === "complete") catStats[item.categoryTitle].completeSpecs++;
  if (item.specCompleteness === "partial") catStats[item.categoryTitle].partialSpecs++;
  if (item.specCompleteness === "placeholder") catStats[item.categoryTitle].placeholderSpecs++;
});

console.log("\nCategory Statistics:");
console.table(catStats);

// Write JSON report
const outputPath = path.join(__dirname, "../reports/product_inventory.json");
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(inventory, null, 2), "utf8");
console.log(`\nWritten inventory to: ${outputPath}`);
