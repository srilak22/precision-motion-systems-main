// Live SEO Verification Script
// Tests actual rendered HTML for metadata, canonicals, OG tags, schemas, and indexing directives

const BASE = "http://localhost:8080";

const TEST_ROUTES = [
  { path: "/", expectedTitle: "INDUS Industrial Robotics", canonical: "https://precision-motion-systems-main.vercel.app/", indexable: true, checkSchema: "Organization" },
  { path: "/about", expectedTitle: "About INDUS", canonical: "https://precision-motion-systems-main.vercel.app/about", indexable: true },
  { path: "/about/engineering", expectedTitle: "Engineering Approach", canonical: "https://precision-motion-systems-main.vercel.app/about/engineering", indexable: true },
  { path: "/products", expectedTitle: "Industrial Robotics Product Portfolio", canonical: "https://precision-motion-systems-main.vercel.app/products", indexable: true },
  { path: "/products/actuators", expectedTitle: "Actuators", canonical: "https://precision-motion-systems-main.vercel.app/products/actuators", indexable: true },
  { path: "/products/actuators/linear", expectedTitle: "Linear Actuators", canonical: "https://precision-motion-systems-main.vercel.app/products/actuators/linear", indexable: true, checkSchema: "Product" },
  { path: "/solutions", expectedTitle: "Industrial Automation Solutions", canonical: "https://precision-motion-systems-main.vercel.app/solutions", indexable: true },
  { path: "/solutions/factory-automation", expectedTitle: "Factory Automation", canonical: "https://precision-motion-systems-main.vercel.app/solutions/factory-automation", indexable: true },
  { path: "/applications", expectedTitle: "Industrial Applications", canonical: "https://precision-motion-systems-main.vercel.app/applications", indexable: true },
  { path: "/applications/automotive", expectedTitle: "Automotive", canonical: "https://precision-motion-systems-main.vercel.app/applications/automotive", indexable: true },
  { path: "/technology", expectedTitle: "Technology Stack", canonical: "https://precision-motion-systems-main.vercel.app/technology", indexable: true },
  { path: "/technology/robotics", expectedTitle: "Robotics", canonical: "https://precision-motion-systems-main.vercel.app/technology/robotics", indexable: true },
  { path: "/resources", expectedTitle: "Engineering Resource Center", canonical: "https://precision-motion-systems-main.vercel.app/resources", indexable: true },
  { path: "/resources/faqs", expectedTitle: "Technical FAQs", canonical: "https://precision-motion-systems-main.vercel.app/resources/faqs", indexable: true },
  { path: "/careers", expectedTitle: "Submit Your Profile", canonical: "https://precision-motion-systems-main.vercel.app/careers", indexable: true },
  { path: "/contact", expectedTitle: "Contact Hub", canonical: "https://precision-motion-systems-main.vercel.app/contact", indexable: true },
  { path: "/contact/engineering-enquiry", expectedTitle: "Detailed Engineering Enquiry", canonical: "https://precision-motion-systems-main.vercel.app/contact/engineering-enquiry", indexable: true },
  // Non-indexable routes
  { path: "/login", expectedTitle: "Sign In", indexable: false },
  { path: "/search", expectedTitle: "Search", indexable: false },
  { path: "/intelligence", expectedTitle: "Website Intelligence", indexable: false },
];

async function run() {
  console.log("=== STARTING LIVE SEO AUDIT AGAINST " + BASE + " ===\n");
  let passed = 0;
  let failed = 0;

  for (const r of TEST_ROUTES) {
    try {
      const res = await fetch(BASE + r.path);
      if (!res.ok) {
        console.error(`❌ [${r.path}] HTTP ${res.status}`);
        failed++;
        continue;
      }
      const html = await res.text();

      // Check title
      const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
      const title = titleMatch ? titleMatch[1] : "";
      if (!title.toLowerCase().includes(r.expectedTitle.toLowerCase())) {
        console.error(`❌ [${r.path}] Title mismatch. Got: "${title}", Expected to include: "${r.expectedTitle}"`);
        failed++;
        continue;
      }

      // Check canonical
      const canonicalMatches = [...html.matchAll(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/gi)];
      if (r.indexable) {
        if (canonicalMatches.length !== 1) {
          console.error(`❌ [${r.path}] Expected exactly 1 canonical tag, found ${canonicalMatches.length}`);
          failed++;
          continue;
        }
        if (canonicalMatches[0][1] !== r.canonical) {
          console.error(`❌ [${r.path}] Canonical URL mismatch. Got: "${canonicalMatches[0][1]}", Expected: "${r.canonical}"`);
          failed++;
          continue;
        }
      }

      // Check robots noindex on private pages
      const robotsMatch = html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i);
      if (!r.indexable) {
        if (!robotsMatch || !robotsMatch[1].includes("noindex")) {
          console.error(`❌ [${r.path}] Expected robots noindex tag, found: "${robotsMatch ? robotsMatch[1] : 'none'}"`);
          failed++;
          continue;
        }
      } else {
        if (robotsMatch && robotsMatch[1].includes("noindex")) {
          console.error(`❌ [${r.path}] Accidental noindex found on public route!`);
          failed++;
          continue;
        }
      }

      // Check schema if requested
      if (r.checkSchema) {
        if (!html.includes(`"@type":"${r.checkSchema}"`) && !html.includes(`"@type": "${r.checkSchema}"`)) {
          console.error(`❌ [${r.path}] Schema.org @type "${r.checkSchema}" not found in JSON-LD scripts.`);
          failed++;
          continue;
        }
      }

      console.log(`✅ [${r.path}] Title: "${title.slice(0, 42)}..." | Canonical: ${r.canonical || 'None (noindex)'}`);
      passed++;
    } catch (e) {
      console.error(`❌ [${r.path}] Request failed:`, e.message);
      failed++;
    }
  }

  console.log(`\n=== AUDIT FINISHED: ${passed} PASSED, ${failed} FAILED ===\n`);
  if (failed > 0) process.exit(1);
}

run();
