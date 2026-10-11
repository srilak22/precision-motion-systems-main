import fs from "fs";

const DEST_DOMAIN = process.env.JIRA_DOMAIN || "srilakshanaint2027g3-1790324760192.atlassian.net";
const EMAIL = process.env.JIRA_EMAIL || "srilakshana.int2027g3@gmail.com";
const TOKEN = process.env.JIRA_API_TOKEN || "";
const SRI_ACCOUNT_ID = process.env.JIRA_ASSIGNEE_ID || "712020:90b59131-da57-4b30-9614-6891eff382e6";
const authHeader = "Basic " + Buffer.from(`${EMAIL}:${TOKEN}`).toString("base64");

const STATE_FILE = "scripts/migration_state.json";
const ISSUES_FILE = "scripts/exported_di_issues.json";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getKeyNum(key) {
  return parseInt(key.replace(/^DI-/, ""), 10);
}

async function createIssueWithRetry(issue, keyMap, maxRetries = 5) {
  const isSubtask = !!issue.fields.parent;
  const isEpic = issue.fields.issuetype?.name === "Epic";
  const issueTypeName = isSubtask ? "Sub-task" : isEpic ? "Epic" : "Task";

  let desc = issue.fields.description || "";
  const metaLines = [
    "",
    "--------------------------------------------------",
    `📦 Original Key: ${issue.key} (trustworkz.atlassian.net)`,
    `👤 Original Assignee: ${issue.fields.assignee ? issue.fields.assignee.displayName : "Unassigned"}`,
    `🏷️ Priority: ${issue.fields.priority?.name || "Medium"}`,
    `📅 Original Created: ${issue.fields.created || "N/A"}`
  ];
  const fullDesc = (desc + "\n" + metaLines.join("\n")).trim();

  const labels = (issue.fields.labels || []).map(l =>
    String(l).trim().replace(/\s+/g, "-").slice(0, 50)
  ).filter(Boolean);

  const fields = {
    project: { key: "DI" },
    summary: issue.fields.summary,
    description: fullDesc,
    issuetype: { name: issueTypeName }
  };

  if (labels.length > 0) {
    fields.labels = labels;
  }

  // Assign to Sri Lakshana if originally assigned
  if (issue.fields.assignee) {
    fields.assignee = { accountId: SRI_ACCOUNT_ID };
  }

  // Priority mapping
  if (issue.fields.priority?.name) {
    fields.priority = { name: issue.fields.priority.name };
  }

  // Link subtask to migrated parent
  if (isSubtask) {
    const parentOldKey = issue.fields.parent.key;
    const parentNewKey = keyMap[parentOldKey];
    if (!parentNewKey) {
      throw new Error(`Cannot find migrated parent key for old parent ${parentOldKey} (child: ${issue.key})`);
    }
    fields.parent = { key: parentNewKey };
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(`https://${DEST_DOMAIN}/rest/api/2/issue`, {
        method: "POST",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({ fields })
      });

      if (res.status === 429) {
        const retryAfter = parseInt(res.headers.get("retry-after") || "2", 10);
        console.warn(`[429 Rate Limit] Retrying in ${retryAfter}s (attempt ${attempt}/${maxRetries})...`);
        await sleep(retryAfter * 1000);
        continue;
      }

      if (!res.ok) {
        const errText = await res.text();
        if (attempt < maxRetries) {
          console.warn(`[Attempt ${attempt}] Failed ${issue.key}: ${res.status} ${errText}. Retrying in ${attempt * 1000}ms...`);
          await sleep(attempt * 1000);
          continue;
        }
        throw new Error(`Failed to create issue ${issue.key}: ${res.status} ${errText}`);
      }

      const data = await res.json();
      return data.key;
    } catch (err) {
      if (attempt >= maxRetries) throw err;
      console.warn(`[Attempt ${attempt}] Network error ${issue.key}: ${err.message}. Retrying...`);
      await sleep(attempt * 1000);
    }
  }
}

async function runMigration() {
  console.log("=== Starting Jira Lead Migration ===");
  console.log(`Source: trustworkz.atlassian.net (Project DI)`);
  console.log(`Destination: https://${DEST_DOMAIN} (Project DI)`);

  const rawIssues = JSON.parse(fs.readFileSync(ISSUES_FILE, "utf-8"));
  rawIssues.sort((a, b) => getKeyNum(a.key) - getKeyNum(b.key));
  console.log(`Loaded ${rawIssues.length} issues to migrate.`);

  let state = {
    completed: {}, // oldKey -> newKey
    errors: {}     // oldKey -> error
  };

  if (fs.existsSync(STATE_FILE)) {
    try {
      state = JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"));
      console.log(`Found existing state with ${Object.keys(state.completed).length} already completed.`);
    } catch (e) {
      console.warn("Could not parse existing state, starting fresh.");
    }
  }

  const startTime = Date.now();
  let count = 0;

  for (let i = 0; i < rawIssues.length; i++) {
    const issue = rawIssues[i];
    const index = i + 1;

    if (state.completed[issue.key]) {
      // Already migrated
      continue;
    }

    try {
      const newKey = await createIssueWithRetry(issue, state.completed);
      state.completed[issue.key] = newKey;
      count++;

      const isSub = !!issue.fields.parent;
      const typeStr = isSub ? `Sub-task (parent: ${state.completed[issue.fields.parent.key]})` : (issue.fields.issuetype?.name || "Task");
      console.log(`[${index}/${rawIssues.length}] ${issue.key} -> ${newKey} [${typeStr}] "${issue.fields.summary.slice(0, 50)}"`);

      // Save state every 10 issues
      if (count % 10 === 0) {
        fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
      }

      // Small throttle to avoid hitting Jira rate limits
      await sleep(120);
    } catch (err) {
      console.error(`ERROR migrating ${issue.key}:`, err.message);
      state.errors[issue.key] = err.message;
      fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
      // Stop on fatal error
      break;
    }
  }

  // Final save
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n=== Migration Finished in ${elapsed}s ===`);
  console.log(`Total Completed: ${Object.keys(state.completed).length} / ${rawIssues.length}`);
  console.log(`Errors: ${Object.keys(state.errors).length}`);
}

runMigration();
