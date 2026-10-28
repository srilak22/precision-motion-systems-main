import { TOP_LEVEL_CATEGORIES } from "../src/data/productTaxonomy";
import { CATALOGUE_LINES } from "../src/data/productCatalogue";
import { solutionsData } from "../src/data/solutions";
import { applicationsData } from "../src/data/applications";
import { technologiesData } from "../src/data/technologies";
import { engineeringServices } from "../src/data/engineeringServicesData";

const BASE_URL = "http://127.0.0.1:8080";

// Inventory of all routes
const routesToAudit: { path: string; type: string; category?: string }[] = [
  // Static Routes
  { path: "/", type: "Home" },
  { path: "/about", type: "Company" },
  { path: "/careers", type: "Company" },
  { path: "/contact", type: "Company" },
  { path: "/contact/engineering-enquiry", type: "Company" },
  { path: "/book-consultation", type: "Interactive" },
  { path: "/quote", type: "Interactive" },
  { path: "/rental", type: "Commercial" },
  { path: "/search", type: "Search" },
  { path: "/application-finder", type: "Interactive" },
  { path: "/login", type: "System" },

  // Products
  { path: "/products", type: "Products Index" },
  { path: "/products/compare", type: "Products Compare" },
  // 8 Category pages
  { path: "/products/motion-actuation", type: "Product Category", category: "Motion & Actuation" },
  { path: "/products/robotic-systems", type: "Product Category", category: "Robotic Systems" },
  { path: "/products/mobility-systems", type: "Product Category", category: "Mobility Systems" },
  { path: "/products/control-drives", type: "Product Category", category: "Control & Drives" },
  { path: "/products/sensing-vision", type: "Product Category", category: "Sensing & Vision" },
  { path: "/products/end-effectors", type: "Product Category", category: "End Effectors & Tooling" },
  { path: "/products/mechanical-components", type: "Product Category", category: "Mechanical Components" },
  { path: "/products/safety-intelligent", type: "Product Category", category: "Safety & Intelligent Systems" },

  // Legacy Category routes
  { path: "/products/actuators", type: "Legacy Product Category", category: "Actuators" },
  { path: "/products/precision-reducers", type: "Legacy Product Category", category: "Precision Reducers" },
  { path: "/products/robotic-wheels", type: "Legacy Product Category", category: "Robotic Wheels" },
  { path: "/products/robotic-arms", type: "Legacy Product Category", category: "Robotic Arms" },
  { path: "/products/industrial-robots", type: "Legacy Product Category", category: "Industrial Robots" },
  { path: "/products/control-systems", type: "Legacy Product Category", category: "Control Systems" },

  // Solutions
  { path: "/solutions", type: "Solutions Index" },
  ...solutionsData.map((s) => ({ path: `/solutions/${s.id}`, type: "Solution Detail", category: s.title })),

  // Industries / Applications
  { path: "/applications", type: "Applications Index" },
  ...applicationsData.map((a) => ({ path: `/applications/${a.id}`, type: "Application Detail", category: a.title })),

  // Engineering & Technology
  { path: "/technology", type: "Technology Index" },
  { path: "/technology/architecture-explorer", type: "Engineering Tool" },
  { path: "/technology/calculators", type: "Engineering Tool" },
  { path: "/technology/intelligence-explorer", type: "Engineering Tool" },
  { path: "/technology/intelligent-actuators", type: "Engineering Tool" },
  { path: "/technology/knowledge-graph", type: "Engineering Tool" },
  { path: "/technology/motion-studio", type: "Engineering Tool" },
  { path: "/taxonomy", type: "Engineering Taxonomy" },
  ...technologiesData.map((t) => ({ path: `/technology/${t.id}`, type: "Technology Detail", category: t.title })),

  // Engineering Services
  { path: "/engineering-services", type: "Engineering Services Index" },
  ...engineeringServices.map((es) => ({ path: `/engineering-services/${es.id}`, type: "Engineering Service Detail", category: es.title })),

  // Engineering Intelligence
  { path: "/engineering-intelligence", type: "Engineering Intelligence Index" },

  // Intelligence
  { path: "/intelligence", type: "Intelligence Index" },
  { path: "/intelligence/bookings", type: "Intelligence" },
  { path: "/intelligence/content-audit", type: "Intelligence" },
  { path: "/intelligence/us-robotics", type: "Intelligence" },

  // Resources
  { path: "/resources", type: "Resources Index" },
  { path: "/resources/faqs", type: "Resources FAQ" },
];

async function crawl() {
  console.log(`Starting crawl of ${routesToAudit.length} registered routes against ${BASE_URL}...`);
  const results: { path: string; status: number; ok: boolean; title?: string; error?: string }[] = [];

  for (const r of routesToAudit) {
    try {
      const res = await fetch(`${BASE_URL}${r.path}`, {
        headers: { Accept: "text/html" },
      });
      const html = await res.text();
      // extract title tag
      const match = html.match(/<title>([^<]*)<\/title>/i);
      const title = match ? match[1] : undefined;
      results.push({
        path: r.path,
        status: res.status,
        ok: res.ok,
        title,
      });
      if (!res.ok) {
        console.log(`❌ [${res.status}] ${r.path} - ${title || "No Title"}`);
      }
    } catch (err: any) {
      results.push({
        path: r.path,
        status: 0,
        ok: false,
        error: err.message,
      });
      console.log(`💥 ERROR ${r.path}: ${err.message}`);
    }
  }

  const passed = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok).length;
  console.log(`\nCrawl complete: ${passed} OK, ${failed} Failed out of ${results.length} routes.`);
}

crawl();
