async function main() {
  const res = await fetch("https://precision-motion-systems-main.vercel.app/");
  const html = await res.text();
  console.log("HTML length:", html.length);
  const regex = /<script[^>]+src=["']([^"']+)["']/g;
  let m;
  const scripts = [];
  while ((m = regex.exec(html)) !== null) {
    scripts.push(m[1]);
  }
  console.log("Scripts count:", scripts.length);
  for (const s of scripts) {
    console.log("Script:", s);
  }

  // Check if "Component Discovery Platform" or "Engineering" or "Precision Reducers" is in HTML
  console.log("Includes 'Precision Reducers':", html.includes("Precision Reducers"));
  console.log("Includes 'Component Discovery Platform':", html.includes("Component Discovery Platform"));
  console.log("Includes 'Engineering':", html.includes("Engineering"));
  console.log("Includes 'nav-trigger-engineering':", html.includes("nav-trigger-engineering"));
}
main().catch(console.error);
