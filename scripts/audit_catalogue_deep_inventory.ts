import fs from "fs";
import path from "path";
import { TOP_LEVEL_CATEGORIES } from "../src/data/productTaxonomy";
import { categories, products, getProduct, getCategory, productsIn } from "../src/data/robotics";
import { getRangeById, getAllCatalogueLines, getCatalogueLine } from "../src/data/productCatalogue";
import { engineeringDossiers } from "../src/data/engineeringData";
import { getIntelligentActuator } from "../src/data/intelligentActuatorsData";
import { productToImageMap } from "../src/lib/images";

interface ProductAuditReport {
  id: string;
  name: string;
  categorySlug: string;
  categoryTitle: string;
  subfamily: string;
  expectedRoute: string;
  taxonomyRoute: string;
  routeMatches: boolean;
  hasProductRecord: boolean;
  hasCatalogueRange: boolean;
  hasEngineeringDossier: boolean;
  hasIntelligentData: boolean;
  imageKeyOrFile: string;
  imageVerified: boolean;
  specCount: number;
  specs: { label: string; value: string }[];
  engineeringStandards: string[];
  applicationsCount: number;
  relatedCount: number;
  verificationStatus: string;
  technicalClaimsIssues: string[];
}

interface CategoryAuditReport {
  id: string;
  title: string;
  route: string;
  categoryResolves: boolean;
  productsInCount: number;
  expectedCount: number;
  subfamiliesCount: number;
  subfamilies: { name: string; productCount: number }[];
  engineeringStandard: string;
}

const categoryAudits: CategoryAuditReport[] = [];
const productAudits: ProductAuditReport[] = [];

console.log("Starting comprehensive product catalogue inventory and audit...");

// 1. Audit all 8 Top Level Categories
TOP_LEVEL_CATEGORIES.forEach((cat) => {
  const catObj = getCategory(cat.id);
  const prods = productsIn(cat.id);
  const subfamilies = cat.groups.map((g) => ({
    name: g.groupName,
    productCount: g.items.length,
  }));
  const expectedCount = cat.groups.reduce((acc, g) => acc + g.items.length, 0);

  categoryAudits.push({
    id: cat.id,
    title: cat.title,
    route: cat.primaryRoute,
    categoryResolves: !!catObj,
    productsInCount: prods.length,
    expectedCount,
    subfamiliesCount: cat.groups.length,
    subfamilies,
    engineeringStandard: cat.engineeringStandard,
  });

  // Audit each product item in this category
  cat.groups.forEach((g) => {
    g.items.forEach((item) => {
      const p = getProduct(item.id);
      const range = getRangeById(item.id);
      const dossier = engineeringDossiers[item.id] || engineeringDossiers[item.id.replace("ind-", "")];
      const intel = getIntelligentActuator(item.id);

      const expectedRoute = `/products/${cat.id}/${item.id}`;
      const taxonomyRoute = item.href;
      const routeMatches = expectedRoute === taxonomyRoute;

      // Specifications resolution
      const specs: { label: string; value: string }[] = [];
      if (range?.specificationSummary) {
        Object.entries(range.specificationSummary).forEach(([label, value]) => {
          specs.push({ label, value });
        });
      } else if (p?.specifications) {
        specs.push(...p.specifications);
      }

      // Standards resolution
      const standards: string[] = [];
      if (range?.engineeringStandard) standards.push(range.engineeringStandard);
      if (cat.engineeringStandard) standards.push(...cat.engineeringStandard.split(" / "));

      // Image mapping check
      const imageAsset = (productToImageMap as Record<string, unknown>)[item.id];
      const imageVerified = !!imageAsset;

      // Technical claims check
      const technicalClaimsIssues: string[] = [];
      specs.forEach((s) => {
        if (s.value.includes("[") && s.value.includes("]")) {
          technicalClaimsIssues.push(`Unverified bracketed parameter: ${s.label}=${s.value}`);
        }
        if (s.value.toLowerCase().includes("tbd") || s.value.toLowerCase().includes("request")) {
          technicalClaimsIssues.push(`Placeholder specification value: ${s.label}=${s.value}`);
        }
      });

      productAudits.push({
        id: item.id,
        name: item.name,
        categorySlug: cat.id,
        categoryTitle: cat.title,
        subfamily: g.groupName,
        expectedRoute,
        taxonomyRoute,
        routeMatches,
        hasProductRecord: !!p,
        hasCatalogueRange: !!range,
        hasEngineeringDossier: !!dossier,
        hasIntelligentData: !!intel,
        imageKeyOrFile: imageAsset ? "mapped" : "fallback",
        imageVerified,
        specCount: specs.length,
        specs,
        engineeringStandards: Array.from(new Set(standards)),
        applicationsCount: range?.typicalApplications?.length || p?.applications?.length || 0,
        relatedCount: range?.relatedComponents?.length || p?.related?.length || 0,
        verificationStatus: item.verificationStatus || range?.verificationStatus || "preliminary",
        technicalClaimsIssues,
      });
    });
  });
});

// Output Summary
console.log("\n=== AUDIT RESULTS ===");
console.log(`Categories Audited: ${categoryAudits.length}`);
categoryAudits.forEach((c) => {
  console.log(`- ${c.title} (${c.id}): resolves=${c.categoryResolves}, prods=${c.productsInCount}/${c.expectedCount}, subfamilies=${c.subfamiliesCount}`);
});

console.log(`\nTotal Products Audited: ${productAudits.length}`);
const missingProducts = productAudits.filter((p) => !p.hasProductRecord);
const missingRanges = productAudits.filter((p) => !p.hasCatalogueRange);
const routeMismatches = productAudits.filter((p) => !p.routeMatches);
const unmappedImages = productAudits.filter((p) => !p.imageVerified);
const productsWithClaimsIssues = productAudits.filter((p) => p.technicalClaimsIssues.length > 0);

console.log(`Missing Product Records: ${missingProducts.length}`);
console.log(`Missing Catalogue Ranges: ${missingRanges.length}`);
console.log(`Route Mismatches: ${routeMismatches.length}`);
console.log(`Unmapped Images: ${unmappedImages.length}`);
console.log(`Products with Technical Claims Issues: ${productsWithClaimsIssues.length}`);

// Write JSON output
const outputDir = path.resolve("./reports");
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(path.join(outputDir, "comprehensive_catalogue_audit.json"), JSON.stringify({ categoryAudits, productAudits }, null, 2));
console.log(`\nDetailed report written to: reports/comprehensive_catalogue_audit.json`);
