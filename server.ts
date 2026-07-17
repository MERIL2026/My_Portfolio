import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { createServer as createViteServer } from "vite";

dotenv.config();
import { 
  applySecurityHeaders, 
  globalErrorHandler 
} from "./src/lib/security.ts";

// Detect if running from the built bundle (dist/server.cjs) vs source (tsx server.ts)
// When running the built bundle, default to production mode
const isBuiltBundle = typeof __filename !== "undefined" && __filename.replace(/\\/g, '/').includes('/dist/');
if (isBuiltBundle) {
  process.env.NODE_ENV ??= "production";
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Disable server fingerprint header to hide backend technology
  app.disable("x-powered-by");

  // Apply basic security headers (HSTS, CSP, XSS-Protection, Nosniff, Referrer Policy)
  app.use(applySecurityHeaders);

  // Parse JSON payloads with strict size limit to prevent body-parsing DoS attacks
  app.use(express.json({ limit: "10kb" }));
  
  // Clean, secure CORS setup
  app.use(cors({
    origin: true,
    credentials: true
  }));

  // Admin API Endpoints
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  app.post("/api/admin/verify", (req, res) => {
    const { password } = req.body;
    if (password === adminPassword) {
      res.status(200).json({ success: true });
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  });

  app.get("/api/admin/contacts", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== `Bearer ${adminPassword}`) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    try {
      const supabase = createClient(
        process.env.VITE_SUPABASE_URL || "",
        process.env.VITE_SUPABASE_ANON_KEY || ""
      );

      // In a real app we would use the Service Role key to bypass RLS,
      // but here anon key works since there's no RLS currently
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      res.status(200).json({ contacts: data });
    } catch (error) {
      console.error("Failed to fetch contacts", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/admin/contacts/:id", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== `Bearer ${adminPassword}`) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    try {
      const supabase = createClient(
        process.env.VITE_SUPABASE_URL || "",
        process.env.VITE_SUPABASE_ANON_KEY || ""
      );

      const { id } = req.params;
      const { error } = await supabase
        .from("contacts")
        .delete()
        .eq("id", id);

      if (error) throw error;
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Failed to delete contact", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    // In middlewareMode, Vite does not serve public/ automatically — serve it with Express
    app.use(express.static(path.join(process.cwd(), 'public')));
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Centralized Error Boundary Middleware (Last line of protection to prevent details leaks)
  app.use(globalErrorHandler);

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
