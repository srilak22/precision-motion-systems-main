import { solutionsData } from "../src/data/solutions";
import { navigationData } from "../src/data/navigation";

console.log("=== SOLUTIONS IN solutionsData ===");
solutionsData.forEach((s) => {
  console.log(`- ID: "${s.id}", Title: "${s.title}", Subtitle: "${s.heroSubtitle?.slice(0, 50)}..."`);
  console.log(`  Related products: ${s.relatedProducts?.length || 0}, Resources: ${s.resources?.length || 0}`);
});

console.log("\n=== SOLUTIONS IN navigationData['solutions'] ===");
const solNav = navigationData["solutions"];
if (solNav) {
  console.log("Nav Title:", solNav.title, "Href:", solNav.href);
  solNav.groups?.forEach((g) => {
    console.log(`  Group: "${g.name}" (slug: ${g.slug}, href: ${g.href}) -> ${g.items.length} items:`);
    g.items.forEach((item) => {
      console.log(`    - "${item.name}" -> ${item.href}`);
    });
  });
}
