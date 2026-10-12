import assert from "node:assert";

async function main() {
  const base = "https://precision-motion-systems-main.vercel.app";
  const res = await fetch(base);
  const html = await res.text();
  console.log("Status:", res.status);

  // Find all script tags
  const regex = /<script[^>]+src=["']([^"']+)["']/g;
  let m;
  const scripts = [];
  while ((m = regex.exec(html)) !== null) {
    scripts.push(m[1]);
  }
  console.log("Scripts found:", scripts);

  // Check each script for "youtube-lead" or "captureYouTubeAttribution" or "YLT"
  for (const src of scripts) {
    const fullUrl = src.startsWith("http") ? src : base + src;
    try {
      const sRes = await fetch(fullUrl);
      const code = await sRes.text();
      const hasYtLead = code.includes("/api/youtube-lead");
      const hasYtAttr = code.includes("__indus_yt_attr");
      const hasYlt = code.includes("YLT");
      console.log(`Script ${src}: has /api/youtube-lead? ${hasYtLead}, has __indus_yt_attr? ${hasYtAttr}, has YLT? ${hasYlt}`);
    } catch (e) {
      console.error("Error fetching", src, e.message);
    }
  }
}

main().catch(console.error);
