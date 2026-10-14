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

async function testCreateIssue() {
  const payload = {
    fields: {
      project: { key: 'LIT' },
      summary: 'LinkedIn Lead - Test Automation Co (Diagnostic Test)',
      description: `
==================================================
LINKEDIN LEAD INTAKE (LIT PIPELINE)
==================================================
• Full Name: Diagnostic Test Lead
• Email: diagnostic-test@example.com
• Company: Test Automation Co
• Source: LinkedIn Test Verification
• Timestamp: ${new Date().toISOString()}
      `.trim(),
      issuetype: { name: 'Task' },
      labels: ['linkedin-lead', 'dealflow-lit', 'test-diagnostic'],
    },
  };

  const res = await fetch(`https://${domain}/rest/api/2/issue`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  console.log('Jira issue creation status:', res.status, res.statusText);
  const data = await res.json();
  console.log('Created issue result:', data);
  if (data.key) {
    console.log(`Issue URL: https://${domain}/browse/${data.key}`);
  }
}

testCreateIssue().catch(console.error);
