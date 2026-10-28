const categories = [
  'motion-actuation',
  'robotic-systems',
  'mobility-systems',
  'control-drives',
  'sensing-vision',
  'end-effectors',
  'mechanical-components',
  'safety-intelligent',
  'actuators',
  'precision-reducers',
  'robotic-wheels',
  'robotic-arms',
  'industrial-robots',
  'control-systems',
];

async function checkCategories() {
  console.log('Testing category routes against http://127.0.0.1:8080/products/...\n');
  let passed = 0;
  let failed = 0;

  for (const slug of categories) {
    const url = `http://127.0.0.1:8080/products/${slug}`;
    try {
      const res = await fetch(url);
      if (res.ok) {
        console.log(`✅ [200 OK] /products/${slug}`);
        passed++;
      } else {
        console.error(`❌ [${res.status}] /products/${slug}`);
        failed++;
      }
    } catch (err: any) {
      console.error(`❌ [FETCH ERROR] /products/${slug}:`, err.message);
      failed++;
    }
  }

  console.log(`\nResults: ${passed} passed, ${failed} failed out of ${categories.length} categories.`);
}

checkCategories();
