import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const authHeader = req.headers.authorization;

  if (!authHeader || authHeader !== `Bearer ${adminPassword}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const supabase = createClient(
    process.env.VITE_SUPABASE_URL || "",
    process.env.VITE_SUPABASE_ANON_KEY || ""
  );

  try {
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return res.status(200).json({ contacts: data });
  } catch (error) {
    console.error("Failed to fetch contacts", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
