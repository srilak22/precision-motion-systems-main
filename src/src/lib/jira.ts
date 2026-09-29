import { createServerFn } from "@tanstack/react-start";

export const createJiraTask = createServerFn({ method: "POST" })
  .validator(
    (data: {
      name: string;
      company: string;
      email: string;
      phone: string;
      product: string;
      quantity: string;
      requirements: string;
    }) => data,
  )
  .handler(async ({ data }) => {
    const domain = process.env.JIRA_DOMAIN;
    const email = process.env.JIRA_EMAIL;
    const token = process.env.JIRA_API_TOKEN;
    const projectKey = process.env.JIRA_PROJECT_KEY || "KAN";

    if (!domain || !email || !token) {
      throw new Error("Jira configuration is missing");
    }

    const auth = Buffer.from(`${email}:${token}`).toString("base64");

    const description = `
Name: ${data.name}
Company: ${data.company}
Email: ${data.email}
Phone: ${data.phone}
Product: ${data.product}
Quantity: ${data.quantity}

Requirements:
${data.requirements}
    `.trim();

    const payload = {
      fields: {
        project: {
          key: projectKey,
        },
        summary: `Quote Request: ${data.name} from ${data.company}`,
        description: description,
        issuetype: {
          name: "Task",
        },
      },
    };

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
      console.error("Jira API Error:", errorText);
      throw new Error(`Failed to create Jira task: ${response.statusText}`);
    }

    const result = await response.json();
    return { success: true, issueKey: result.key, issueUrl: result.self };
  });
