import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import { publicLimiter } from "../src/lib/rate-limit.ts";
import { contactSchema } from "../src/lib/validation.ts";

export default publicLimiter.vercelHandler(async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // 1. Strict Input Validation
  const parseResult = contactSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ 
      error: "Validation failed", 
      details: parseResult.error.format() 
    });
  }

  const { name, email, message } = parseResult.data;

  // 2. Insert into Supabase
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL || "",
    process.env.VITE_SUPABASE_ANON_KEY || ""
  );

  try {
    const { error } = await supabase.from("contacts").insert([
      { name, email, message },
    ]);

    if (error) throw error;
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Failed to insert contact:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
