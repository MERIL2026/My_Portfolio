import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      console.error("ADMIN_PASSWORD env var is not set!");
      return res.status(500).json({ error: "Server misconfiguration" });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader.trim() !== `Bearer ${adminPassword.trim()}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.method !== "DELETE") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // Validate ID
    const id = req.query.id;
    if (!id || typeof id !== "string" || id.length > 64 || !/^[a-zA-Z0-9-]+$/.test(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ error: "Server misconfiguration: Supabase not configured" });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { error } = await supabase
      .from("contacts")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error("Failed to delete contact:", error);
    return res.status(500).json({ error: "Internal server error", message: error?.message });
  }
}
