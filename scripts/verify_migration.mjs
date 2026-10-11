const DEST_DOMAIN = process.env.JIRA_DOMAIN || "srilakshanaint2027g3-1790324760192.atlassian.net";
const EMAIL = process.env.JIRA_EMAIL || "srilakshana.int2027g3@gmail.com";
const TOKEN = process.env.JIRA_API_TOKEN || "";
const authHeader = "Basic " + Buffer.from(`${EMAIL}:${TOKEN}`).toString("base64");

async function verifyMigration() {
  console.log("=== Verifying Destination Jira Instance ===");

  // 1. Check Project Info
  const pRes = await fetch(`https://${DEST_DOMAIN}/rest/api/3/project/DI`, {
    headers: { Authorization: authHeader, Accept: "application/json" }
  });
  const proj = await pRes.json();
  console.log(`Project: ${proj.name} (${proj.key}), style: ${proj.style}`);

  // 2. Check Board Info
  const bRes = await fetch(`https://${DEST_DOMAIN}/rest/agile/1.0/board?projectKeyOrId=DI`, {
    headers: { Authorization: authHeader, Accept: "application/json" }
  });
  const boards = await bRes.json();
  const board = boards.values?.[0];
  console.log(`Board: ${board?.name} (id: ${board?.id}, type: ${board?.type})`);

  // 3. Count total issues on destination
  const searchRes = await fetch(`https://${DEST_DOMAIN}/rest/api/3/search/jql?jql=project=DI&maxResults=1`, {
    headers: { Authorization: authHeader, Accept: "application/json" }
  });
  const searchData = await searchRes.json();
  console.log(`Total issues registered in Project DI: ${searchData.total || searchData.issues?.length}`);

  // 4. Count Agile Board issues
  const bIssuesRes = await fetch(`https://${DEST_DOMAIN}/rest/agile/1.0/board/${board.id}/issue?maxResults=1`, {
    headers: { Authorization: authHeader, Accept: "application/json" }
  });
  const bIssues = await bIssuesRes.json();
  console.log(`Agile Board issues total: ${bIssues.total}`);

  // 5. Count Agile Board backlog issues
  const bBacklogRes = await fetch(`https://${DEST_DOMAIN}/rest/agile/1.0/board/${board.id}/backlog?maxResults=1`, {
    headers: { Authorization: authHeader, Accept: "application/json" }
  });
  if (bBacklogRes.ok) {
    const bBacklog = await bBacklogRes.json();
    console.log(`Agile Board backlog total: ${bBacklog.total}`);
  }

  // 6. Inspect sample issues (parents, subtasks, epic)
  console.log("\nSample Issues Verification:");
  for (const key of ["DI-1", "DI-2", "DI-48", "DI-309", "DI-310"]) {
    const iRes = await fetch(`https://${DEST_DOMAIN}/rest/api/2/issue/${key}?fields=summary,issuetype,parent,status,assignee`, {
      headers: { Authorization: authHeader, Accept: "application/json" }
    });
    if (iRes.ok) {
      const iData = await iRes.json();
      console.log(`- ${iData.key}: [${iData.fields.issuetype?.name}] "${iData.fields.summary}" | Status: ${iData.fields.status?.name} | Parent: ${iData.fields.parent?.key || "None"} | Assignee: ${iData.fields.assignee?.displayName}`);
    }
  }
}

verifyMigration();
