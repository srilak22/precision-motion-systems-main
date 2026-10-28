const routes = [
  '/',
  '/products',
  '/products/compare',
  '/products/motion-actuation',
  '/products/robotic-systems',
  '/products/mobility-systems',
  '/products/control-drives',
  '/products/sensing-vision',
  '/products/end-effectors',
  '/products/mechanical-components',
  '/products/safety-intelligent',
  '/products/actuators',
  '/products/precision-reducers',
  '/products/robotic-wheels',
  '/products/robotic-arms',
  '/products/industrial-robots',
  '/products/control-systems',
  '/solutions',
  '/solutions/factory-automation',
  '/solutions/robotic-automation',
  '/solutions/motion-control',
  '/solutions/mobile-robotics',
  '/solutions/smart-manufacturing',
  '/solutions/material-handling',
  '/solutions/custom-robotics',
  '/applications',
  '/applications/automotive',
  '/applications/electronics',
  '/applications/manufacturing',
  '/applications/warehousing',
  '/applications/logistics',
  '/applications/pharmaceuticals',
  '/applications/welding',
  '/applications/inspection',
  '/applications/machine-tending',
  '/applications/pick-and-place',
  '/technology',
  '/technology/calculators',
  '/technology/architecture-explorer',
  '/technology/intelligence-explorer',
  '/technology/intelligent-actuators',
  '/technology/motion-studio',
  '/technology/knowledge-graph',
  '/resources',
  '/resources/faqs',
  '/about',
  '/contact',
  '/contact/engineering-enquiry',
  '/careers',
  '/quote',
  '/book-consultation',
  '/rental',
  '/search',
];

async function validateEntireSite() {
  console.log('=================================================================');
  console.log('       INDUS ENTIRE SITE ROUTE INTEGRITY & AUDIT VALIDATION      ');
  console.log('=================================================================\n');

  let passed = 0;
  let failed = 0;
  const failures: { route: string; status: number }[] = [];

  for (const route of routes) {
    const url = `http://127.0.0.1:8080${route}`;
    try {
      const res = await fetch(url);
      if (res.ok) {
        console.log(`✅ [${res.status} OK] ${route}`);
        passed++;
      } else {
        console.error(`❌ [${res.status} FAIL] ${route}`);
        failed++;
        failures.push({ route, status: res.status });
      }
    } catch (err: any) {
      console.error(`❌ [ERROR] ${route}:`, err.message);
      failed++;
      failures.push({ route, status: 0 });
    }
  }

  console.log('\n=================================================================');
  console.log(`Summary: ${passed} passed, ${failed} failed out of ${routes.length} core routes.`);
  if (failed === 0) {
    console.log('✅ ALL TESTED SITE ROUTES RESOLVE HTTP 200 OK!');
  } else {
    console.log('Failures:', failures);
  }
}

validateEntireSite();
