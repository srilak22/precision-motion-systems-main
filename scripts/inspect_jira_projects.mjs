import fs from 'node:fs';
import path from 'node:path';

// Read .env manually
const envPath = path.resolve('.env');
const envContent = fs.readFileSync(envPath, 'utf8');
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

const domain = env.JIRA_DOMAIN;
const email = env.JIRA_EMAIL;
const token = env.JIRA_API_TOKEN;

console.log('Jira Domain:', domain);
console.log('Jira Email:', email);
console.log('Token exists:', !!token);

const auth = Buffer.from(`${email}:${token}`).toString('base64');

async function run() {
  const res = await fetch(`https://${domain}/rest/api/3/project`, {
    headers: {
      Authorization: `Basic ${auth}`,
      Accept: 'application/json',
    },
  });

  console.log('Response status:', res.status, res.statusText);
  const data = await res.json();
  if (Array.isArray(data)) {
    console.log('Found', data.length, 'projects:');
    for (const p of data) {
      console.log(`- Key: [${p.key}], Name: "${p.name}", ID: ${p.id}, Type: ${p.projectTypeKey}`);
    }
  } else {
    console.log('Non-array response:', data);
  }
}

run().catch(console.error);
