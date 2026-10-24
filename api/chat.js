// INDUS Industrial Robotics — Robotics Guide AI Assistant Endpoint
// Endpoint: /api/chat
// Description: Secure server-side gateway for AI provider connectivity, rate limiting,
//              request validation, and grounded fallback discovery.

import fs from "node:fs";
import path from "node:path";

// Ensure local environment variables are loaded
function ensureEnvLoaded() {
  if (!process.env.AUTH_SECRET && typeof process.loadEnvFile === "function") {
    try {
      process.loadEnvFile(".env.local");
    } catch {}
    try {
      process.loadEnvFile(".env");
    } catch {}
  }
}
ensureEnvLoaded();

// Rate limiting in-memory map
const ipRateLimits = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 30; // max 30 chat queries per minute

  const record = ipRateLimits.get(ip) || { count: 0, resetAt: now + windowMs };
  if (now > record.resetAt) {
    record.count = 1;
    record.resetAt = now + windowMs;
  } else {
    record.count += 1;
  }
  ipRateLimits.set(ip, record);

  // Periodically clean up
  if (ipRateLimits.size > 2000) {
    for (const [k, v] of ipRateLimits.entries()) {
      if (now > v.resetAt) ipRateLimits.delete(k);
    }
  }

  return record.count > maxRequests;
}

export default async function handler(req, res) {
  // CORS & Methods
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS, GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    // Health check and provider availability report
    const hasGemini = Boolean(process.env.GEMINI_API_KEY);
    const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);
    const hasAnthropic = Boolean(process.env.ANTHROPIC_API_KEY);

    return res.status(200).json({
      status: "online",
      assistantName: "INDUS Robotics Guide",
      version: "4.0.0",
      aiProviderConfigured: hasGemini || hasOpenAI || hasAnthropic,
      activeMode: hasGemini || hasOpenAI || hasAnthropic ? "live_llm" : "guided_grounded",
      catalogSource: "INDUS Verified Motion Systems Dataset (ISO 9283 / DIN 3990)",
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const clientIp =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    "127.0.0.1";

  if (isRateLimited(clientIp)) {
    return res.status(429).json({
      error: "Rate limit exceeded. Please wait a moment before sending another message.",
      retryAfterSeconds: 60,
    });
  }

  try {
    const { message, history, sessionId } = req.body || {};

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({ error: "Message content is required." });
    }

    if (message.length > 2000) {
      return res.status(400).json({
        error: "Message exceeds 2000 character limit. Please shorten your query.",
      });
    }

    // Check if an AI provider is configured in environment
    const geminiKey = process.env.GEMINI_API_KEY;
    const openAiKey = process.env.OPENAI_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    if (geminiKey) {
      // Secure server-side call to Google Gemini with grounded system instructions
      const systemInstruction = `You are the INDUS Robotics Guide, an engineering discovery assistant for INDUS Industrial Robotics (Chennai, India).
Always ground technical answers in verified catalogue parameters:
- Intelligent Rotary Actuators (IND-IRA): 70–142mm frames, 35–280 Nm continuous torque, 90–700 Nm peak, <1.0 arcmin backlash, 48V DC, EtherCAT / CANopen DS402.
- Intelligent Linear Actuators (IND-ILA): 50–110mm frames, 1500–12000 N rated thrust, ±0.005mm repeatability, 48V DC.
- Precision Reducers: Zero-backlash strain-wave (<1 arcmin), RV Cycloidal high-stiffness, and Precision Helical Planetary (DIN 3990).
Never invent model codes, torque ratings, or certifications. If specifications are missing or unverified, state that explicitly and offer an engineering consultation (/book-consultation) or the Application Finder (/application-finder).`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: `${systemInstruction}\n\nUser Question: ${message}` }],
              },
            ],
            generationConfig: {
              temperature: 0.2, // low temperature for engineering precision
              maxOutputTokens: 600,
            },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const replyText =
          data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          "Could not generate answer from AI model.";

        return res.status(200).json({
          status: "success",
          provider: "gemini",
          reply: replyText,
        });
      }
    }

    // Default / Fallback Mode: Grounded guided flow
    // Instructs client to process via deterministic engineering retrieval engine
    return res.status(200).json({
      status: "guided_grounded",
      provider: null,
      message:
        "External AI provider key not configured. Using INDUS deterministic verified catalogue engine.",
    });
  } catch (error) {
    console.error("[Robotics Guide Chat API Error]:", error);
    return res.status(500).json({
      error: "An internal server error occurred while processing your request.",
    });
  }
}
