import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { score, review } = req.body || {};

    if (typeof score !== "number" || !Number.isInteger(score) || score < 1 || score > 5) {
      return res.status(400).json({ error: "Score must be an integer between 1 and 5" });
    }
    if (review !== undefined && review !== null && (typeof review !== "string" || review.length > 500)) {
      return res.status(400).json({ error: "Review must be 500 characters or less" });
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ error: "Server misconfiguration" });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { error } = await supabase.from("ratings").insert([{ score, review: review || null }]);

    if (error) throw error;
    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error("Failed to insert rating:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
