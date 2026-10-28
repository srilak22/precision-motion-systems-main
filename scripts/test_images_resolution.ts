import { categories, productsIn } from "../src/data/robotics";
import { getProductImageUrl } from "../src/lib/images";

const slugs = [
  "motion-actuation",
  "robotic-systems",
  "mobility-systems",
  "control-drives",
  "sensing-vision",
  "end-effectors",
  "mechanical-components",
  "safety-intelligent",
];

slugs.forEach((slug) => {
  console.log(`\n================== CATEGORY: ${slug} ==================`);
  const prods = productsIn(slug);
  const imageDistribution: Record<string, number> = {};

  prods.forEach((p) => {
    const resolvedUrl = getProductImageUrl(p);
    // extract filename from path or base64/data url
    const filename = resolvedUrl.split("/").pop()?.split("?")[0] || resolvedUrl;
    imageDistribution[filename] = (imageDistribution[filename] || 0) + 1;
    // print first 3 products
    if (prods.indexOf(p) < 3) {
      console.log(`  - [${p.id}] "${p.name}" -> ${filename}`);
    }
  });

  console.log(`Image distribution (${Object.keys(imageDistribution).length} unique images for ${prods.length} products):`);
  console.log(imageDistribution);
});
