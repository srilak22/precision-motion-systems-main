export default async function handler(req, res) {
  // Allow requests from your website
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle browser preflight request
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const {
      page = "/",
      url = "",
      event = "page_view",
      element = "",
      details = "",
      device = "Unknown",
      screen = "",
      sessionId = "",
      referrer = "",
      visitorType = "Unknown",
    } = req.body || {};

    const airtableUrl =
      `https://api.airtable.com/v0/` +
      `${process.env.AIRTABLE_BASE_ID}/` +
      `${process.env.AIRTABLE_TABLE_ID}`;

    const response = await fetch(airtableUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        records: [
          {
            fields: {
              Name: `${event} - ${page}`,
              Timestamp: new Date().toISOString(),
              Page: page,
              URL: url,
              "Activity Type": event,
              Element: element,
              Details: details,
              Device: device,
              "Screen Size": screen,
              "Session ID": sessionId,
              Referrer: referrer,
              "Visitor Type": visitorType,
              Status: "Success",
            },
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        airtableError: data,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Activity recorded",
      data,
    });
  } catch (error) {
    console.error("Tracking error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}
