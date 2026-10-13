/**
 * Local Helper: Exchange Google Authorization Code for Refresh Token
 * Strictly runs locally on the operator's machine — never exposes tokens to the browser.
 * Reads credentials from .env.local and securely writes YOUTUBE_REFRESH_TOKEN to .env.local.
 *
 * Usage:
 *   node scripts/exchange_code_locally.mjs "YOUR_AUTHORIZATION_CODE"
 *   OR
 *   node scripts/exchange_code_locally.mjs "FULL_REDIRECT_URL"
 */

import fs from "node:fs";
import path from "node:path";
import { exchangeCodeForTokens } from "../api/_lib/youtube-oauth.js";

// Load .env.local manually
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

async function main() {
  const arg = process.argv[2];
  if (!arg) {
    console.error("\n❌ Error: Please provide the authorization code or the full redirect URL.");
    console.log('\nUsage:');
    console.log('  node scripts/exchange_code_locally.mjs "YOUR_AUTHORIZATION_CODE"');
    console.log('  OR');
    console.log('  node scripts/exchange_code_locally.mjs "https://precision-motion-systems-main.vercel.app/api/auth/youtube/callback?code=...&state=..."\n');
    process.exit(1);
  }

  let code = arg.trim();
  if (code.includes("code=")) {
    try {
      const parsed = new URL(code.startsWith("http") ? code : `https://example.com/?${code}`);
      code = parsed.searchParams.get("code") || code;
    } catch {
      const match = code.match(/code=([^&]+)/);
      if (match) code = decodeURIComponent(match[1]);
    }
  }

  console.log("\nExchanging authorization code with Google OAuth...");

  try {
    const tokenResult = await exchangeCodeForTokens(code);

    if (!tokenResult.refreshToken) {
      console.warn("\n⚠️ Google did not return a new refresh token.");
      console.warn("Reason: You may have already authorized this app previously.");
      console.warn("Fix: Go to https://myaccount.google.com/permissions, remove access for this app, and try again.\n");
      process.exit(1);
    }

    const refreshToken = tokenResult.refreshToken;

    // Securely update .env.local
    let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
    if (envContent.includes("YOUTUBE_REFRESH_TOKEN=")) {
      envContent = envContent.replace(/YOUTUBE_REFRESH_TOKEN=.*/g, `YOUTUBE_REFRESH_TOKEN=${refreshToken}`);
    } else {
      envContent += `\nYOUTUBE_REFRESH_TOKEN=${refreshToken}\n`;
    }
    fs.writeFileSync(envPath, envContent, "utf8");

    console.log("\n=======================================================");
    console.log("  ✅ SUCCESS! YouTube Refresh Token Received & Saved");
    console.log("=======================================================");
    console.log("\nSaved to .env.local: YOUTUBE_REFRESH_TOKEN");
    console.log("\n📋 COPY THIS VALUE FOR VERCEL:");
    console.log(`\n${refreshToken}\n`);
    console.log("Steps for Vercel:");
    console.log("1. Open Vercel Project Settings → Environment Variables.");
    console.log("2. Add Key: YOUTUBE_REFRESH_TOKEN with the value above.");
    console.log("3. Select Production, Preview, Development and click Save.\n");
  } catch (err) {
    console.error(`\n❌ Token Exchange Failed: ${err.message}\n`);
    process.exit(1);
  }
}

main();
