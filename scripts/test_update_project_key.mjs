import fs from 'node:fs';

const envContent = fs.readFileSync('.env', 'utf8');
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
const auth = Buffer.from(`${email}:${token}`).toString('base64');

async function testUpdateKey() {
  console.log('Attempting to update project 10101 key from LIL to LIT...');
  const res = await fetch(`https://${domain}/rest/api/3/project/10101`, {
    method: 'PUT',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      key: 'LIT',
    }),
  });

  console.log('Update status:', res.status, res.statusText);
  const data = await res.json();
  console.log('Response body:', data);
}

testUpdateKey().catch(console.error);
