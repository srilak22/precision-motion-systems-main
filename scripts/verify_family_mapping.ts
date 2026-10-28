import { TOP_LEVEL_CATEGORIES } from '../src/data/productTaxonomy';
import { productsIn } from '../src/data/robotics';

let totalTested = 0;
let unmatched = 0;

TOP_LEVEL_CATEGORIES.forEach((cat) => {
  const prods = productsIn(cat.id);
  prods.forEach((p) => {
    totalTested++;
    const group = cat.groups.find((g) => g.items.some((i) => i.id === p.id || i.id === p.slug));
    if (!group) {
      console.log(`Unmatched product in ${cat.id}: id=${p.id}, slug=${p.slug}`);
      unmatched++;
    }
  });
});

console.log(`RESULTS: Total Tested: ${totalTested}, Unmatched: ${unmatched}`);
