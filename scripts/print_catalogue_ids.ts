import { CATALOGUE_LINES } from "../src/data/productCatalogue";

const summary: Record<string, string[]> = {};
CATALOGUE_LINES.forEach((l) => {
  summary[l.id] = l.ranges.map((r) => r.id);
});
console.log(JSON.stringify(summary, null, 2));
