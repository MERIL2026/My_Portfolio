import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import { publicLimiter } from "../src/lib/rate-limit";
import { ratingSchema } from "../src/lib/validation";

export default publicLimiter.vercelHandler(async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const parseResult = ratingSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: "Validation failed", details: parseResult.error.format() });
  }

  const { score } = parseResult.data;

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: "Server misconfiguration" });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { error } = await supabase.from("ratings").insert([{ score }]);
    if (error) throw error;
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Failed to insert rating:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
