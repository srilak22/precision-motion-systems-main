import fs from 'node:fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
for (const line of envContent.split('\n')) {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    env[match[1]] = value.trim();
  }
}

async function checkGoogleToken() {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: env.YOUTUBE_OAUTH_CLIENT_ID,
      client_secret: env.YOUTUBE_OAUTH_CLIENT_SECRET,
      refresh_token: env.YOUTUBE_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  });

  console.log('Refresh status:', res.status);
  const data = await res.json();
  if (data.access_token) {
    console.log('Access token obtained!');
    const infoRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${data.access_token}`);
    const info = await infoRes.json();
    console.log('Token info scopes:', info.scope);

    // Let's test if this token has access to Google Sheets API!
    const sheetRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/1S-ApP83X9Y1-nXwim0tDNGn72wuhVn4PSbaWkcXlH48`, {
      headers: { Authorization: `Bearer ${data.access_token}` }
    });
    console.log('Direct Google Sheets API test status:', sheetRes.status);
    if (sheetRes.ok) {
      const sheetData = await sheetRes.json();
      console.log('Sheet title:', sheetData.properties?.title);
      console.log('Tabs:', sheetData.sheets?.map(s => s.properties?.title));
    } else {
      console.log('Sheet error:', await sheetRes.text());
    }
  } else {
    console.log('Refresh error:', data);
  }
}

checkGoogleToken().catch(console.error);
