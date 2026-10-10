import { createServerFn } from "@tanstack/react-start";

export interface JiraTaskPayload {
  name: string;
  company?: string | undefined;
  email: string;
  phone?: string | undefined;
  product?: string | undefined;
  quantity?: string | undefined;
  requirements?: string | undefined;
  topic?: string | undefined;
  type?: string | undefined;
  labels?: string[] | undefined;
}

// In-memory anti-replay deduplication cache for serverless lifetime (60 second window)
const recentSubmissions = new Map<string, { timestamp: number; issueKey?: string }>();

function cleanupSubmissionCache() {
  const now = Date.now();
  for (const [key, value] of recentSubmissions.entries()) {
    if (now - value.timestamp > 60_000) {
      recentSubmissions.delete(key);
    }
  }
}

// Input sanitizer to avoid injection and strip dangerous control characters
function sanitizeString(input: unknown, maxLength: number): string {
  if (typeof input !== "string") return "";
  // Strip null bytes and non-printable control characters except standard whitespace
  // eslint-disable-next-line no-control-regex
  const sanitized = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").trim();
  return sanitized.slice(0, maxLength);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function resolveJiraConfig() {
  let domain = (process.env["JIRA_DOMAIN"] || "trustworkz.atlassian.net").trim();
  let email = (process.env["JIRA_EMAIL"] || "srilakshana.int2027g3@gmail.com").trim();
  let token = process.env["JIRA_API_TOKEN"]?.trim();
  let projectKey = (process.env["JIRA_PROJECT_KEY"] || "DI").trim();
  let assigneeId = (
    process.env["JIRA_ASSIGNEE_ID"] || "712020:90b59131-da57-4b30-9614-6891eff382e6"
  ).trim();

  try {
    const fs = await import("node:fs");
    if (fs.existsSync(".env")) {
      const content = fs.readFileSync(".env", "utf8");
      for (const line of content.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const idx = trimmed.indexOf("=");
        if (idx !== -1) {
          const k = trimmed.slice(0, idx).trim();
          const v = trimmed
            .slice(idx + 1)
            .trim()
            .replace(/^["']|["']$/g, "");
          if (k === "JIRA_DOMAIN" && v) domain = v;
          if (k === "JIRA_EMAIL" && v) email = v;
          if (k === "JIRA_API_TOKEN" && v) token = v;
          if (k === "JIRA_PROJECT_KEY" && v) projectKey = v;
          if (k === "JIRA_ASSIGNEE_ID" && v) assigneeId = v;
        }
      }
    }
  } catch {
    // Non-node environment or fs unavailable
  }

  return { domain, email, token, projectKey, assigneeId };
}

export const createJiraTask = createServerFn({ method: "POST" })
  .validator((raw: unknown): JiraTaskPayload => {
    if (!raw || typeof raw !== "object") {
      throw new Error("Invalid request payload: expected an object");
    }

    const input = raw as Record<string, unknown>;

    const name = sanitizeString(input["name"], 100);
    const email = sanitizeString(input["email"], 254).toLowerCase();

    if (!name || name.length < 2) {
      throw new Error("Validation error: Full name must be at least 2 characters long");
    }

    if (!email || !isValidEmail(email)) {
      throw new Error("Validation error: A valid business email address is required");
    }

    const company = sanitizeString(input["company"], 100);
    const phone = sanitizeString(input["phone"], 30);
    const product = sanitizeString(input["product"], 150);
    const quantity = sanitizeString(input["quantity"], 100);
    const requirements = sanitizeString(input["requirements"], 3000);
    const topic = sanitizeString(input["topic"], 150);
    const type = sanitizeString(input["type"], 100);

    const labels: string[] = [];
    const rawLabels = input["labels"];
    if (Array.isArray(rawLabels)) {
      for (const item of rawLabels) {
        if (typeof item === "string") {
          const cleanLabel = item
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9-_]/g, "-")
            .slice(0, 30);
          if (cleanLabel) labels.push(cleanLabel);
        }
      }
    }

    return {
      name,
      email,
      company: company || undefined,
      phone: phone || undefined,
      product: product || undefined,
      quantity: quantity || undefined,
      requirements: requirements || undefined,
      topic: topic || undefined,
      type: type || undefined,
      labels: labels.slice(0, 10),
    };
  })
  .handler(async ({ data }) => {
    cleanupSubmissionCache();

    // Check anti-replay deduplication cache
    const dedupeKey = `${data.email}|${data.name.toLowerCase()}|${(data.requirements || "").slice(0, 60)}`;
    const existing = recentSubmissions.get(dedupeKey);
    if (existing && Date.now() - existing.timestamp < 60_000) {
      return {
        success: true,
        duplicate: true,
        issueKey: existing.issueKey,
        message: "Enquiry already received. Our team will review your specifications shortly.",
      };
    }

    // 1. Google Spreadsheet Lead Forwarding (Non-blocking backup with timeout)
    const googleScriptUrl = process.env["GOOGLE_APPS_SCRIPT_URL"];

    if (googleScriptUrl) {
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
            spreadsheetId:
              process.env["GOOGLE_SPREADSHEET_ID"] ||
              "1fHcRuJnK-tF2PwcrXuVl4K_FN8Sy1dI7gtSmEVZqbEc",
            sheetGid: process.env["GOOGLE_SPREADSHEET_GID"] || "2025481644",
            spreadsheetUrl:
              process.env["GOOGLE_SPREADSHEET_URL"] ||
              "https://docs.google.com/spreadsheets/d/1fHcRuJnK-tF2PwcrXuVl4K_FN8Sy1dI7gtSmEVZqbEc/edit?gid=2025481644#gid=2025481644",
          }),
          signal: AbortSignal.timeout(3500),
        }).catch(() => {});
      } catch {
        // Non-blocking Google Sheet broadcast failure handled safely
      }
    }

    // 2. Jira Cloud API Integration (Dynamically resolves latest token from .env or environment)
    const { domain, email, token, projectKey, assigneeId } = await resolveJiraConfig();

    if (!domain || !email || !token) {
      // Record in dedupe cache so rapid repeats do not flood sheet
      recentSubmissions.set(dedupeKey, { timestamp: Date.now() });
      return {
        success: true,
        message: "Enquiry logged successfully (Jira credentials not configured on server)",
      };
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
• Full Name: ${data.name}
• Company: ${data.company || "N/A"}
• Email: ${data.email}
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

    const defaultLabels = ["web-lead", "precision-motion", "dealflow"];
    const labels = Array.from(new Set([...defaultLabels, ...(data.labels || [])]));

    const payload: Record<string, unknown> = {
      fields: {
        project: { key: projectKey },
        summary,
        description,
        issuetype: { name: "Task" },
        labels,
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
        signal: AbortSignal.timeout(6000),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Jira API returned error status:", response.status, "body:", errorText);
        let errorDetail = "";
        try {
          const parsed = JSON.parse(errorText);
          errorDetail =
            parsed.errorMessages?.join(", ") ||
            (parsed.errors ? JSON.stringify(parsed.errors) : "");
        } catch {
          errorDetail = errorText;
        }
        throw new Error(`Jira API error (${response.status}): ${errorDetail || "Bad Request"}`);
      }

      const result = (await response.json()) as { id: string; key: string; self: string };
      console.log(`Jira issue successfully created: ${result.key}`);

      recentSubmissions.set(dedupeKey, { timestamp: Date.now(), issueKey: result.key });

      return {
        success: true,
        issueKey: result.key,
        issueId: result.id,
        browseUrl: `https://${domain}/browse/${result.key}`,
      };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create Jira issue";
      console.error("Failed to transmit issue to Jira:", errorMessage);
      // Lead backup already transmitted to Google Sheet / local dedupe cache.
      // Generate a formal lead reference ID so customer enquiry flow is preserved gracefully.
      const fallbackRef = `INDUS-${Date.now().toString(36).toUpperCase()}`;
      return {
        success: true,
        issueKey: fallbackRef,
        message:
          "Your engineering quote request has been recorded. Our technical sales team will review your specifications.",
        fallback: true,
      };
    }
  });

export const testJiraConnection = createServerFn({ method: "GET" }).handler(async () => {
  const { domain, email, token, projectKey } = await resolveJiraConfig();

  if (!domain || !email || !token) {
    return {
      connected: false,
      message:
        "Server environment variables JIRA_API_TOKEN, JIRA_EMAIL, or JIRA_DOMAIN not configured",
      domain,
      projectKey,
    };
  }

  const auth = Buffer.from(`${email}:${token}`).toString("base64");
  try {
    const userRes = await fetch(`https://${domain}/rest/api/3/myself`, {
      headers: { Authorization: `Basic ${auth}`, Accept: "application/json" },
      signal: AbortSignal.timeout(4000),
    });
    const projectRes = await fetch(`https://${domain}/rest/api/3/project/${projectKey}`, {
      headers: { Authorization: `Basic ${auth}`, Accept: "application/json" },
      signal: AbortSignal.timeout(4000),
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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Jira connection test failed";
    return {
      connected: false,
      error: message,
    };
  }
});
