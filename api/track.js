const TABLES = {
  page_view: "Page Views",
  click: "Clicks",
  cta_click: "CTA Interactions",
  lead: "Leads",
  form_submit: "Form Submissions",
  download: "Downloads",
  search: "Search Activity",
  navigation: "Navigation",
  whatsapp_click: "WhatsApp Enquiries",
  product_view: "Product Interest",
  product_action: "Product Interest",
  utm_visit: "UTM Campaigns",
  error: "Errors",
  scroll: "Scroll & Engagement",
  engagement: "Scroll & Engagement",
  session_start: "Website Sessions",
};

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  try {
    const {
      AIRTABLE_TOKEN,
      AIRTABLE_BASE_ID,
      AIRTABLE_TABLE_ID,
    } = process.env;

    if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID) {
      return res.status(500).json({
        success: false,
        error: "Airtable environment variables missing",
      });
    }

    const p = req.method === "POST"
      ? req.body || {}
      : req.query || {};

    const event = p.event || "page_view";

    // Target table: try multi-table map first, or fallback to AIRTABLE_TABLE_ID or "Website Activity"
    const targetTable = TABLES[event] || AIRTABLE_TABLE_ID || "Website Activity";

    const timestamp = new Date().toISOString();

    const fields = {
      Timestamp: timestamp,
      "Session ID": p.session || p.sessionId || "",
      Page: p.page || "",
      URL: p.url || "",
      Device: p.device || "",
      Screen: p.screen || "",
      Referrer: p.referrer || "Direct",
      Event: event,
      Element: p.element || "",
      Details: p.details || "",
    };

    /*
     * Additional fields
     */
    if (p.name) fields.Name = p.name;
    if (p.email) fields.Email = p.email;
    if (p.phone) fields.Phone = p.phone;
    if (p.company) fields.Company = p.company;
    if (p.product) fields.Product = p.product;
    if (p.file) fields["File Name"] = p.file;
    if (p.form) fields["Form Name"] = p.form;
    if (p.cta) fields["CTA Name"] = p.cta;
    if (p.search) fields["Search Query"] = p.search;
    if (p.from) fields["From Page"] = p.from;
    if (p.to) fields["To Page"] = p.to;
    if (p.scroll) fields["Scroll Depth"] = Number(p.scroll);
    if (p.error) fields["Error Message"] = p.error;
    if (p.source) fields["UTM Source"] = p.source;
    if (p.medium) fields["UTM Medium"] = p.medium;
    if (p.campaign) fields["UTM Campaign"] = p.campaign;

    // Call Airtable API
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(targetTable)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AIRTABLE_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // If table name was not found (e.g. 404), attempt fallback to AIRTABLE_TABLE_ID if available
      if (response.status === 404 && AIRTABLE_TABLE_ID && targetTable !== AIRTABLE_TABLE_ID) {
        console.warn(`Table "${targetTable}" not found, retrying with default table ID "${AIRTABLE_TABLE_ID}"...`);
        const fallbackResponse = await fetch(
          `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_ID)}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${AIRTABLE_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fields,
            }),
          }
        );

        const fallbackData = await fallbackResponse.json();
        if (!fallbackResponse.ok) {
          console.error("Airtable fallback error:", fallbackData);
          return res.status(fallbackResponse.status).json({
            success: false,
            error: fallbackData,
          });
        }

        return res.status(200).json({
          success: true,
          event,
          table: AIRTABLE_TABLE_ID,
          recordId: fallbackData.id,
        });
      }

      console.error("Airtable error:", data);
      return res.status(response.status).json({
        success: false,
        error: data,
      });
    }

    return res.status(200).json({
      success: true,
      event,
      table: targetTable,
      recordId: data.id,
    });
  } catch (error) {
    console.error("Tracking error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
