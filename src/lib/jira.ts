import { createServerFn } from "@tanstack/react-start";

export interface JiraTaskPayload {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  product?: string;
  quantity?: string;
  requirements?: string;
  topic?: string;
  type?: string;
  labels?: string[];
}

export const createJiraTask = createServerFn({ method: "POST" })
  .validator((data: JiraTaskPayload) => data)
  .handler(async ({ data }) => {
    // 1. Google Spreadsheet Lead Forwarding (Non-blocking backup)
    const googleScriptUrl =
      process.env.GOOGLE_APPS_SCRIPT_URL ||
      "https://script.google.com/macros/s/AKfycbw8NhfkPJGeYu4NAaisxN3FHaWmAVlZTmEO2x1CsBirRPvt5pQjI5zNv3qVXqEA2W1a/exec";

    try {
      fetch(googleScriptUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "form_submit",
          eventType: "form_submit",
          sessionId: `sess_lead_${Date.now()}`,
          form: data.type || "Commercial RFQ / Engineering Enquiry",
          timestamp: new Date().toISOString(),
          name: data.name,
          company: data.company || "",
          email: data.email,
          phone: data.phone || "",
          product: data.product || data.topic || "",
          quantity: data.quantity || "",
          requirements: data.requirements || "",
          spreadsheetId: "1fHcRuJnK-tF2PwcrXuVl4K_FN8Sy1dI7gtSmEVZqbEc",
          sheetGid: "2025481644",
          spreadsheetUrl:
            "https://docs.google.com/spreadsheets/d/1fHcRuJnK-tF2PwcrXuVl4K_FN8Sy1dI7gtSmEVZqbEc/edit?gid=2025481644#gid=2025481644",
        }),
      }).catch(() => {});
    } catch (e) {
      // Non-blocking Google Sheet broadcast
    }

    // 2. Jira Cloud API Integration
    const domain = process.env.JIRA_DOMAIN || "trustworkz.atlassian.net";
    const email = process.env.JIRA_EMAIL || "srilakshana.int2027g3@gmail.com";
    const token =
      process.env.JIRA_API_TOKEN ||
      "ATATT3xFfGF0tRU57QBkOUdnSD1oS9EuD7Iyjzu5kGpoB5rXcQ-XTj24SVG1y6nqoFF7QzSF7YJP0M1kShwlUF7WvXcb1fjeluZ3T5GhbKxrDa5hcXFOgH3ljSHGTrrhc0-_eRfhWjCcZFyrqddWw4jHlpfPw_lOOhpkG4qKnm-KKY1CoiAWlb4=D7806C85";
    const projectKey = process.env.JIRA_PROJECT_KEY || "DI";
    const assigneeId =
      process.env.JIRA_ASSIGNEE_ID || "712020:90b59131-da57-4b30-9614-6891eff382e6";

    if (!domain || !email || !token) {
      return { success: true, message: "Logged to Google Sheet (Jira config skipped)" };
    }

    const auth = Buffer.from(`${email}:${token}`).toString("base64");

    const summaryTitle = data.type || "Lead Enquiry";
    const summary = (
      data.company
        ? `${summaryTitle}: ${data.name} (${data.company})`
        : `${summaryTitle}: ${data.name}`
    ).slice(0, 250);

    const description = `
==================================================
INDUS B2B LEAD INTAKE / JIRA TICKET
==================================================

CONTACT INFORMATION:
• Full Name: ${data.name || "N/A"}
• Company: ${data.company || "N/A"}
• Email: ${data.email || "N/A"}
• Phone: ${data.phone || "N/A"}

ENQUIRY DETAILS:
• Category / Type: ${data.type || "Quote / Technical Enquiry"}
• Product / Focus: ${data.product || data.topic || "General Robotic Systems"}
• Quantity / Batch: ${data.quantity || "Not specified"}

TECHNICAL REQUIREMENTS & MESSAGE:
${data.requirements || "No additional notes provided."}

--------------------------------------------------
Origin: INDUS Precision Motion Systems Web Application
Project Key: ${projectKey}
Timestamp: ${new Date().toISOString()}
    `.trim();

    // Clean labels for Jira (alphanumeric and dashes only, no spaces)
    const customLabels = (data.labels || [])
      .map((l) => l.trim().toLowerCase().replace(/[^a-z0-9-_]/g, "-"))
      .filter(Boolean);
    const defaultLabels = ["web-lead", "precision-motion", "dealflow"];
    const labels = Array.from(new Set([...defaultLabels, ...customLabels]));

    const payload: Record<string, any> = {
      fields: {
        project: {
          key: projectKey,
        },
        summary: summary,
        description: description,
        issuetype: {
          name: "Task",
        },
        labels: labels,
        ...(assigneeId ? { assignee: { accountId: assigneeId } } : {}),
      },
    };

    try {
      const response = await fetch(`https://${domain}/rest/api/2/issue`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Jira API Error Response:", response.status, errorText);
        throw new Error(`Jira API returned ${response.status}: ${errorText}`);
      }

      const result = (await response.json()) as { id: string; key: string; self: string };
      console.log(`Jira issue successfully created: ${result.key} in project ${projectKey}`);

      return {
        success: true,
        issueKey: result.key,
        issueId: result.id,
        browseUrl: `https://${domain}/browse/${result.key}`,
      };
    } catch (err: any) {
      console.error("Failed to transmit issue to Jira:", err);
      throw new Error(err.message || "Failed to create Jira issue");
    }
  });

export const testJiraConnection = createServerFn({ method: "GET" }).handler(async () => {
  const domain = process.env.JIRA_DOMAIN || "trustworkz.atlassian.net";
  const email = process.env.JIRA_EMAIL || "srilakshana.int2027g3@gmail.com";
  const token =
    process.env.JIRA_API_TOKEN ||
    "ATATT3xFfGF0tRU57QBkOUdnSD1oS9EuD7Iyjzu5kGpoB5rXcQ-XTj24SVG1y6nqoFF7QzSF7YJP0M1kShwlUF7WvXcb1fjeluZ3T5GhbKxrDa5hcXFOgH3ljSHGTrrhc0-_eRfhWjCcZFyrqddWw4jHlpfPw_lOOhpkG4qKnm-KKY1CoiAWlb4=D7806C85";
  const projectKey = process.env.JIRA_PROJECT_KEY || "DI";

  const auth = Buffer.from(`${email}:${token}`).toString("base64");
  try {
    const userRes = await fetch(`https://${domain}/rest/api/3/myself`, {
      headers: { Authorization: `Basic ${auth}`, Accept: "application/json" },
    });
    const projectRes = await fetch(`https://${domain}/rest/api/3/project/${projectKey}`, {
      headers: { Authorization: `Basic ${auth}`, Accept: "application/json" },
    });

    if (!userRes.ok || !projectRes.ok) {
      return {
        connected: false,
        status: `${userRes.status}/${projectRes.status}`,
        domain,
        projectKey,
      };
    }

    const userData = (await userRes.json()) as { displayName?: string; emailAddress?: string };
    const projectData = (await projectRes.json()) as { name?: string };

    return {
      connected: true,
      domain,
      projectKey,
      projectName: projectData.name,
      userDisplayName: userData.displayName,
      userEmail: userData.emailAddress,
    };
  } catch (error: any) {
    return {
      connected: false,
      error: error.message,
    };
  }
});
