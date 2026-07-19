import type { VercelRequest, VercelResponse } from "@vercel/node";
import { strictAuthLimiter } from "../../src/lib/rate-limit.ts";
import { authSchema } from "../../src/lib/validation.ts";

export default strictAuthLimiter.vercelHandler((req: VercelRequest, res: VercelResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const parseResult = authSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: "Validation failed", details: parseResult.error.format() });
  }

  const { password } = parseResult.data;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return res.status(500).json({ error: "Server misconfiguration" });
  }

  if (password === adminPassword) {
    return res.status(200).json({ success: true });
  } else {
    return res.status(401).json({ error: "Unauthorized" });
  }
}, () => "admin");
