import { TOP_LEVEL_CATEGORIES } from '../src/data/productTaxonomy';
import { categories, productsIn } from '../src/data/robotics';

console.log('=== AUDITING TOP LEVEL CATEGORIES & PRODUCT FAMILIES ===');
TOP_LEVEL_CATEGORIES.forEach((cat) => {
  console.log(`\nCategory: ${cat.title} [id: ${cat.id}]`);
  console.log(`  Route: ${cat.primaryRoute}`);
  console.log(`  Engineering Standard: ${cat.engineeringStandard}`);
  console.log(`  Subfamilies / Groups (${cat.groups.length}):`);
  cat.groups.forEach((g) => {
    console.log(`    - ${g.groupName} (${g.items.length} items)`);
  });
  const products = productsIn(cat.id);
  console.log(`  Total Resolved Products in Category: ${products.length}`);
});

console.log('\n=== AUDITING LEGACY CATEGORIES ===');
categories.forEach((cat) => {
  const p = productsIn(cat.slug);
  console.log(`Legacy Category: ${cat.title} [${cat.slug}] => ${p.length} products`);
});
