// INDUS Industrial Robotics — Robotics Guide AI Assistant Endpoint
// Endpoint: /api/chat
// Description: Secure server-side gateway for AI provider connectivity, rate limiting,
//              multimodal image analysis, request validation, and grounded fallback discovery.

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
      version: "4.5.0",
      aiProviderConfigured: hasGemini || hasOpenAI || hasAnthropic,
      activeMode: hasGemini || hasOpenAI || hasAnthropic ? "live_llm" : "guided_grounded",
      multimodalSupported: hasGemini,
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
    const { message, imageData, history, sessionId } = req.body || {};

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({ error: "Message content is required." });
    }

    if (message.length > 2500) {
      return res.status(400).json({
        error: "Message exceeds 2500 character limit. Please shorten your query.",
      });
    }

    // Validate optional image upload
    let parsedImage = null;
    if (imageData) {
      if (typeof imageData !== "string") {
        return res.status(400).json({ error: "Invalid image format." });
      }
      const match = imageData.match(/^data:(image\/(png|jpeg|jpg|webp));base64,(.+)$/);
      if (!match) {
        return res.status(400).json({
          error: "Unsupported image format. Please upload PNG, JPEG, or WebP images.",
        });
      }
      const mimeType = match[1];
      const base64Data = match[3];
      // Size estimation: base64 length * 0.75 ≈ byte size (max 5MB = 5 * 1024 * 1024 bytes = 5,242,880 bytes)
      const approxBytes = base64Data.length * 0.75;
      if (approxBytes > 5 * 1024 * 1024) {
        return res.status(400).json({
          error: "Image exceeds maximum allowed size of 5MB.",
        });
      }
      parsedImage = { mimeType, base64Data };
    }

    // Check if an AI provider is configured in environment
    const geminiKey = process.env.GEMINI_API_KEY;

    if (geminiKey) {
      // Grounded Industrial Engineering System Instruction
      const systemInstruction = `You are INDUS Robotics Guide, the senior industrial engineering assistant for INDUS Industrial Robotics (Chennai, India).
You provide precise, technically rigorous engineering guidance for industrial automation, precision motion control, and robotic subsystems.

VERIFIED PRODUCT KNOWLEDGE BASE:
1. Intelligent Rotary Actuators (IND-IRA Series):
   - Integrated frameless BLDC motor, precision strain-wave reducer (<1 arcmin backlash), dual absolute 19-bit optical encoders, integrated servo drive, electromagnetic holding brake.
   - Frame Sizes: 70mm, 90mm, 115mm, 142mm.
   - Continuous Torque: 35 Nm to 280 Nm; Peak Torque: 90 Nm to 700 Nm.
   - Bus Voltage: 48V DC nominal (24-60V range). Communications: EtherCAT CoE (CiA 402), CANopen DS402. Safety: STO (Safe Torque Off) SIL3 / PLe.

2. Intelligent Linear Actuators (IND-ILA Series):
   - High-rigidity planetary roller screw or ground ball screw, integrated servo motor, absolute feedback, inline or parallel motor configuration.
   - Frame Sizes: 50mm, 75mm, 95mm, 110mm.
   - Rated Thrust: 1,500 N to 12,000 N. Repeatability: ±0.005mm. Speed: Up to 1.2 m/s. 48V DC bus.

3. Precision Reducers:
   - Strain-Wave (Harmonic) Gears: Zero-backlash (<1 arcmin), ratios 30:1 to 160:1, high torque density for robotic joints (J1-J6).
   - RV Cycloidal Reducers: High radial/axial rigidity, 5x shock load capacity, lost motion <1 arcmin, used for high-payload robot bases and positioners.
   - Precision Helical Planetary Reducers: DIN 3990 gear quality, backlash <3 arcmin, efficiency >96%, ratios 3:1 to 100:1.

4. Turnkey Robotics & Automation Systems:
   - 6-Axis Articulated Robots (welding, painting, heavy handling, 6kg-500kg payload).
   - SCARA Robots (high-speed pick & place, assembly, cycle time <0.38s).
   - Delta Robots (high-speed sorting, food/pharma packaging, 150-200 picks/min).
   - Collaborative Robots / Cobots (ISO 10218-1/2, ISO/TS 15066 power and force limiting, payload 3-20kg).
   - Intralogistics: Autonomous Mobile Robots (AMRs), Automated Guided Vehicles (AGVs) with LiDAR SLAM and safe fleet management.

5. Key Navigation Destinations:
   - For interactive component sizing: direct user to Application Finder (/application-finder).
   - For custom system design: direct user to Book an Engineering Consultation (/book-consultation).
   - For full specifications: direct user to Product Explorer (/products) or Solutions (/solutions).
   - For technical articles: direct user to Engineering Intelligence (/engineering-intelligence).

STRICT RULES:
- Never fabricate specifications, pricing, certifications, or stock availability.
- When evaluating user-provided images, describe visible components (e.g., motor frame, reducer type, robotic wrist assembly) with engineering precision, but state that exact model confirmation requires verification against engineering nameplates or CAD files.
- Keep responses professional, well-structured (use bullet points for parameters), and concise (under 250 words unless doing a detailed sizing calculation).`;

      // Build Gemini parts payload (supporting text and image)
      const userParts = [{ text: `${systemInstruction}\n\nUser Question: ${message}` }];
      if (parsedImage) {
        userParts.unshift({
          inline_data: {
            mime_type: parsedImage.mimeType,
            data: parsedImage.base64Data,
          },
        });
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: userParts,
              },
            ],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 750,
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
      } else {
        const errData = await response.json().catch(() => ({}));
        console.error("[Gemini API Error]:", errData);
      }
    }

    // Default / Fallback Mode: Grounded guided flow
    // Returns signal to client to execute deterministic catalog navigation
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
