import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import { looseAuthLimiter } from "../../../src/lib/rate-limit";
import { idSchema } from "../../../src/lib/validation";

export default looseAuthLimiter.vercelHandler(async (req: VercelRequest, res: VercelResponse) => {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return res.status(500).json({ error: "Server misconfiguration" });
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || authHeader !== `Bearer ${adminPassword}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const parseResult = idSchema.safeParse({ id: req.query.id });
  if (!parseResult.success) {
    return res.status(400).json({ error: "Validation failed", details: parseResult.error.format() });
  }

  const { id } = parseResult.data;

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: "Server misconfiguration" });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { error } = await supabase
      .from("contacts")
      .delete()
      .eq("id", id as string);

    if (error) throw error;
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Failed to delete contact", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
