import fs from 'node:fs';
import path from 'node:path';

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

async function inspectProject() {
  const res = await fetch(`https://${domain}/rest/api/3/project/10101`, {
    headers: {
      Authorization: `Basic ${auth}`,
      Accept: 'application/json',
    },
  });

  console.log('Project 10101 info status:', res.status);
  const data = await res.json();
  console.log('Project Details:', {
    id: data.id,
    key: data.key,
    name: data.name,
    issueTypes: data.issueTypes?.map(t => ({ id: t.id, name: t.name, subtask: t.subtask })),
    simplified: data.simplified,
    style: data.style,
  });

  // Let's also check if project key LIT exists or if we can update key to LIT
  const checkLit = await fetch(`https://${domain}/rest/api/3/project/LIT`, {
    headers: {
      Authorization: `Basic ${auth}`,
      Accept: 'application/json',
    },
  });
  console.log('Does project LIT exist?', checkLit.status);
  if (checkLit.ok) {
    const litData = await checkLit.json();
    console.log('LIT Project Details:', litData);
  }
}

inspectProject().catch(console.error);
