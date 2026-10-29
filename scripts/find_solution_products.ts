import { products } from "../src/data/robotics";

console.log("Total products in robotics.ts:", products.length);

const categories = Array.from(new Set(products.map(p => p.categorySlug)));
console.log("Categories:", categories);

// Sample products for each domain
const domains = [
  { name: "Motion & Actuation", filter: (p: any) => p.categorySlug === "motion-actuation" },
  { name: "Robotic Systems", filter: (p: any) => p.categorySlug === "robotic-systems" },
  { name: "Control & Drives", filter: (p: any) => p.categorySlug === "control-drives" },
  { name: "End Effectors", filter: (p: any) => p.categorySlug === "end-effectors" },
  { name: "Mobility Systems", filter: (p: any) => p.categorySlug === "mobility-systems" },
  { name: "Sensing & Vision", filter: (p: any) => p.categorySlug === "sensing-vision" },
  { name: "Mechanical Components", filter: (p: any) => p.categorySlug === "mechanical-components" },
  { name: "Safety Systems", filter: (p: any) => p.categorySlug === "safety-systems" },
];

for (const d of domains) {
  const matches = products.filter(d.filter).slice(0, 4);
  console.log(`\nDomain: ${d.name}`);
  for (const m of matches) {
    console.log(`  - [${m.id}] ${m.name} -> /products/${m.categorySlug}/${m.slug}`);
  }
}
