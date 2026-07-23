import type { VercelRequest, VercelResponse } from "@vercel/node";

// Simple in-memory rate limiting for serverless (per cold-start instance)
const attempts = new Map<string, { count: number; resetTime: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 60_000;

function getClientIp(req: VercelRequest): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    return (typeof forwarded === "string" ? forwarded : forwarded[0]).split(",")[0].trim();
  }
  return "unknown";
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // Rate limiting
    const ip = getClientIp(req);
    const now = Date.now();
    const record = attempts.get(ip);

    if (record && now < record.resetTime && record.count >= MAX_ATTEMPTS) {
      return res.status(429).json({ error: "Too many attempts. Please try again later." });
    }

    if (!record || now >= record.resetTime) {
      attempts.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    } else {
      record.count++;
    }

    // Validate body
    const { password } = req.body || {};
    if (!password || typeof password !== "string" || password.length > 100) {
      return res.status(400).json({ error: "Invalid request" });
    }

    // Check env var
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      console.error("ADMIN_PASSWORD env var is not set!");
      return res.status(500).json({ error: "Server misconfiguration: ADMIN_PASSWORD not set" });
    }

    const cleanAdminPassword = adminPassword.replace(/^["']|["']$/g, "").trim();
    const cleanUserPassword = password.replace(/^["']|["']$/g, "").trim();

    if (cleanUserPassword === cleanAdminPassword) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(401).json({ 
        error: "Unauthorized", 
        debugInfo: `Password length mismatch or incorrect chars. Received ${cleanUserPassword.length} chars, Expected ${cleanAdminPassword.length} chars.`
      });
    }
  } catch (err: any) {
    console.error("verify handler error:", err);
    return res.status(500).json({ error: "Internal server error", message: err?.message });
  }
}
