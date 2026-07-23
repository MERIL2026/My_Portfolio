import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // Validate body
    const { name, email, message } = req.body || {};

    if (!name || typeof name !== "string" || name.trim().length < 2 || name.length > 100) {
      return res.status(400).json({ error: "Name must be 2-100 characters" });
    }
    if (!email || typeof email !== "string" || email.length > 150 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    if (!message || typeof message !== "string" || message.trim().length < 10 || message.length > 5000) {
      return res.status(400).json({ error: "Message must be 10-5000 characters" });
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ error: "Server misconfiguration" });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { error } = await supabase.from("contacts").insert([
      { name: name.trim(), email: email.trim(), message: message.trim() },
    ]);

    if (error) throw error;
    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error("Failed to insert contact:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
