import fs from "fs";
import path from "path";
import { categories, products } from "../src/data/robotics";
import { solutionsData } from "../src/data/solutions";
import { applicationsData } from "../src/data/applications";
import { technologiesData } from "../src/data/technologies";
import { navigationData } from "../src/data/navigation";

// Build complete valid internal URL set
const validUrls = new Set<string>([
  "/",
  "/about",
  "/about/",
  "/about/engineering",
  "/applications",
  "/applications/",
  "/careers",
  "/careers/",
  "/contact",
  "/contact/",
  "/contact/engineering-enquiry",
  "/products",
  "/products/",
  "/resources",
  "/resources/",
  "/resources/faqs",
  "/solutions",
  "/solutions/",
  "/technology",
  "/technology/",
  "/search",
  "/login",
  "/login/",
  "/intelligence",
  "/intelligence/",
  // TanStack Route template IDs
  "/products/$category",
  "/products/$category/$id",
  "/solutions/$solutionId",
  "/applications/$applicationId",
  "/technology/$techId",
]);

// Categories
for (const cat of categories) {
  validUrls.add(`/products/${cat.slug}`);
  validUrls.add(`/products/${cat.slug}/`);
}

// Products
for (const prod of products) {
  const catSlug =
    prod.categorySlug ||
    categories.find((c) => c.title.toLowerCase() === prod.category.toLowerCase())?.slug;
  if (catSlug) {
    validUrls.add(`/products/${catSlug}/${prod.slug}`);
    validUrls.add(`/products/${catSlug}/${prod.slug}/`);
    validUrls.add(`/products/${catSlug}/${prod.id}`);
    validUrls.add(`/products/${catSlug}/${prod.id}/`);
  }
}

// Solutions
for (const sol of solutionsData) {
  validUrls.add(`/solutions/${sol.id}`);
  validUrls.add(`/solutions/${sol.id}/`);
}

// Applications
for (const app of applicationsData) {
  validUrls.add(`/applications/${app.id}`);
  validUrls.add(`/applications/${app.id}/`);
}

// Technologies
for (const tech of technologiesData) {
  validUrls.add(`/technology/${tech.id}`);
  validUrls.add(`/technology/${tech.id}/`);
}

console.log(`Total valid dynamic target URLs: ${validUrls.size}`);

// Helper to check url
function checkUrl(url: string, source: string): boolean {
  if (!url) return true;
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("mailto:") ||
    url.startsWith("tel:") ||
    url.startsWith("#")
  ) {
    return true;
  }
  // Strip query params and hashes
  const cleanUrl = url.split("?")[0].split("#")[0];
  if (!validUrls.has(cleanUrl)) {
    console.log(`[INVALID LINK] ${source} -> "${url}" (clean: "${cleanUrl}")`);
    return false;
  }
  return true;
}

// Check navigationData
console.log("\n--- AUDITING navigation.ts ---");
let totalNavIssues = 0;
for (const [secKey, section] of Object.entries(navigationData)) {
  if (!checkUrl(section.href, `navigation.${secKey}.href`)) totalNavIssues++;
  if (section.featuredHref && !checkUrl(section.featuredHref, `navigation.${secKey}.featuredHref`))
    totalNavIssues++;
  if (section.groups) {
    for (const group of section.groups) {
      if (!checkUrl(group.href, `navigation.${secKey}.group.${group.slug}.href`)) totalNavIssues++;
      for (const item of group.items) {
        if (!checkUrl(item.href, `navigation.${secKey}.group.${group.slug}.item.${item.name}`))
          totalNavIssues++;
      }
    }
  }
  if (section.items) {
    for (const item of section.items) {
      if (!checkUrl(item.href, `navigation.${secKey}.item.${item.name}`)) totalNavIssues++;
    }
  }
}

// Check all source files for <Link to="..." or href="..."
console.log("\n--- SCANNING ALL SOURCE FILES FOR EMBEDDED LINKS ---");
function scanDirectory(dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (
        entry.name !== "node_modules" &&
        entry.name !== ".git" &&
        entry.name !== ".output" &&
        entry.name !== ".vinxi"
      ) {
        scanDirectory(fullPath);
      }
    } else if (entry.isFile() && (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts"))) {
      scanFile(fullPath);
    }
  }
}

let totalSourceIssues = 0;
function scanFile(filePath: string) {
  const content = fs.readFileSync(filePath, "utf-8");
  const relPath = path.relative(process.cwd(), filePath);

  // Find to="..." or to={'...'} or to={"..."}
  const toRegex = /\bto=(?:\{["'`]([^"'`]+)["'`]\}|["']([^"']+)["'])/g;
  let match;
  while ((match = toRegex.exec(content)) !== null) {
    const target = match[1] || match[2];
    if (target && !target.includes("${") && !target.startsWith("http")) {
      if (!checkUrl(target, `${relPath} (to)`)) {
        totalSourceIssues++;
      }
    }
  }

  // Find href="..." in internal links
  const hrefRegex = /\bhref=["'](\/[^"']*)["']/g;
  while ((match = hrefRegex.exec(content)) !== null) {
    const target = match[1];
    if (target && !target.startsWith("//") && !target.startsWith("/#") && target !== "#") {
      if (!checkUrl(target, `${relPath} (href)`)) {
        totalSourceIssues++;
      }
    }
  }
}

scanDirectory(path.join(process.cwd(), "src"));

console.log(
  `\nAudit Complete: navigation issues: ${totalNavIssues}, source code issues: ${totalSourceIssues}`,
);
