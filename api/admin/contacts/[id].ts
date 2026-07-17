import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const authHeader = req.headers.authorization;

  if (!authHeader || authHeader !== `Bearer ${adminPassword}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;

  const supabase = createClient(
    process.env.VITE_SUPABASE_URL || "",
    process.env.VITE_SUPABASE_ANON_KEY || ""
  );

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
}
