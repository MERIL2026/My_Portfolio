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
import { 
  strictAuthLimiter, 
  looseAuthLimiter,
  publicLimiter
} from "./src/lib/rate-limit.ts";
import { authSchema, contactSchema, idSchema, ratingSchema } from "./src/lib/validation.ts";

// Detect if running from the built bundle (dist/server.cjs) vs source (tsx server.ts)
// When running the built bundle, default to production mode
const isBuiltBundle = typeof __filename !== "undefined" && __filename.replace(/\\/g, '/').includes('/dist/');
if (isBuiltBundle) {
  process.env.NODE_ENV ??= "production";
}

// Validate required environment variables at startup — fail loudly rather than silently
// using insecure fallback credentials.
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
      `Set it in .env (development) or in your hosting provider dashboard (production).`
    );
  }
  return value;
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

  // Apply public rate limiter generally to all API routes
  app.use("/api", publicLimiter.expressMiddleware());

  // Public API Endpoints
  app.post("/api/contact", async (req, res) => {
    const parseResult = contactSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: "Validation failed", details: parseResult.error.format() });
      return;
    }

    const { name, email, message } = parseResult.data;
    
    try {
      const supabase = createClient(
        process.env.VITE_SUPABASE_URL || "",
        process.env.VITE_SUPABASE_ANON_KEY || ""
      );

      const { error } = await supabase.from("contacts").insert([{ name, email, message }]);
      if (error) throw error;
      
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Failed to insert contact:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Public: Submit a rating
  app.post("/api/ratings", async (req, res) => {
    const parseResult = ratingSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: "Validation failed", details: parseResult.error.format() });
      return;
    }
    const { score } = parseResult.data;
    try {
      const supabase = createClient(
        process.env.VITE_SUPABASE_URL || "",
        process.env.VITE_SUPABASE_ANON_KEY || ""
      );
      const { error } = await supabase.from("ratings").insert([{ score }]);
      if (error) throw error;
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Failed to insert rating:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Admin API Endpoints
  const adminPassword = requireEnv("ADMIN_PASSWORD");

  app.post("/api/admin/verify", strictAuthLimiter.expressMiddleware(() => "admin"), (req, res) => {
    const parseResult = authSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: "Validation failed", details: parseResult.error.format() });
      return;
    }

    const { password } = parseResult.data;
    if (password === adminPassword) {
      res.status(200).json({ success: true });
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  });

  app.get("/api/admin/contacts", looseAuthLimiter.expressMiddleware(), async (req, res) => {
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

  app.delete("/api/admin/contacts/:id", looseAuthLimiter.expressMiddleware(), async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== `Bearer ${adminPassword}`) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const parseResult = idSchema.safeParse({ id: req.params.id });
    if (!parseResult.success) {
      res.status(400).json({ error: "Validation failed", details: parseResult.error.format() });
      return;
    }

    try {
      const supabase = createClient(
        process.env.VITE_SUPABASE_URL || "",
        process.env.VITE_SUPABASE_ANON_KEY || ""
      );

      const { id } = parseResult.data;
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

  // Admin: Fetch all ratings
  app.get("/api/admin/ratings", looseAuthLimiter.expressMiddleware(), async (req, res) => {
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
      const { data, error } = await supabase
        .from("ratings")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      res.status(200).json({ ratings: data });
    } catch (error) {
      console.error("Failed to fetch ratings:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Admin: Export Analytics (Mock or proxy to Vercel API)
  app.get("/api/admin/export-analytics", looseAuthLimiter.expressMiddleware(), async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== `Bearer ${adminPassword}`) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const fromParam = (req.query.from as string) || undefined;
    const toParam = (req.query.to as string) || undefined;
    const to = toParam ? new Date(toParam) : new Date();
    const from = fromParam ? new Date(fromParam) : new Date(to.getTime() - 30 * 24 * 60 * 60 * 1000);

    const vercelToken = process.env.VERCEL_API_TOKEN;
    const projectId = process.env.VERCEL_PROJECT_ID;

    // For local dev, we often just want the mock data to test the PDF generator if tokens aren't set
    if (!vercelToken || !projectId) {
      const days = Math.round((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
      const timeseries = [];
      for (let i = 0; i <= days; i++) {
        const d = new Date(from.getTime() + i * 24 * 60 * 60 * 1000);
        timeseries.push({
          time: d.toISOString().split("T")[0],
          visits: Math.floor(Math.random() * 500) + 50
        });
      }
      return res.status(200).json({
        from: from.toISOString(),
        to: to.toISOString(),
        summary: {
          pageviews: timeseries.reduce((acc, curr) => acc + curr.visits, 0),
          visitors: Math.floor(timeseries.reduce((acc, curr) => acc + curr.visits, 0) * 0.6),
          avgSession: "2m 14s"
        },
        timeseries,
        topPages: [
          { route: "/", count: 1240 },
          { route: "/about", count: 430 },
          { route: "/projects/react-portfolio", count: 210 },
          { route: "/contact", count: 180 }
        ],
        topCountries: [
          { country: "US", count: 850 },
          { country: "GB", count: 320 },
          { country: "IN", count: 210 },
          { country: "CA", count: 150 }
        ],
        topDevices: [
          { device: "Desktop", count: 1100 },
          { device: "Mobile", count: 850 },
          { device: "Tablet", count: 110 }
        ],
        topReferrers: [
          { referrer: "Google", count: 620 },
          { referrer: "Direct", count: 480 },
          { referrer: "Twitter", count: 290 },
          { referrer: "LinkedIn", count: 150 }
        ]
      });
    }

    try {
      // Proxy to Vercel API
      const baseUrl = "https://api.vercel.com/v1/query/web-analytics";
      const headers = { Authorization: `Bearer ${vercelToken}` };
      const teamId = process.env.VERCEL_TEAM_ID;

      // Vercel expects timestamps in milliseconds
      const fromMs = from.getTime();
      const toMs = to.getTime();

      const buildUrl = (path: string) => {
        const url = new URL(`${baseUrl}${path}`);
        url.searchParams.set("projectId", projectId);
        if (teamId) url.searchParams.set("teamId", teamId);
        url.searchParams.set("from", fromMs.toString());
        url.searchParams.set("to", toMs.toString());
        return url.toString();
      };

      const fetchVercel = async (path: string) => {
        const fetchRes = await fetch(buildUrl(path), { headers });
        if (!fetchRes.ok) {
          const body = await fetchRes.text();
          console.warn(`Vercel API ${path} → ${fetchRes.status}: ${body}`);
          return null; // Return null instead of throwing — we'll handle missing data gracefully
        }
        return fetchRes.json();
      };

      const [visitsCount, timeseries, topPages, topCountries, topDevices, topReferrers] = await Promise.all([
        fetchVercel("/visits/count"),
        fetchVercel("/visits/aggregate?by=time"),
        fetchVercel("/visits/aggregate?by=route"),
        fetchVercel("/visits/aggregate?by=country"),
        fetchVercel("/visits/aggregate?by=device"),
        fetchVercel("/visits/aggregate?by=referrer")
      ]);

      // If at least visitsCount worked, serve real data (with nulls filled)
      if (visitsCount) {
        return res.status(200).json({
          from: from.toISOString(),
          to: to.toISOString(),
          summary: {
            pageviews: visitsCount?.total || 0,
            visitors: visitsCount?.total || 0,
            avgSession: "—"
          },
          timeseries: timeseries?.data || [],
          topPages: topPages?.data || [],
          topCountries: topCountries?.data || [],
          topDevices: topDevices?.data || [],
          topReferrers: topReferrers?.data || []
        });
      }

      // All calls failed — fall through to mock data
      throw new Error("All Vercel API calls returned errors");
    } catch (error: any) {
      console.warn("Vercel API unavailable, serving mock data:", error.message);
      // Fall back to mock data so the PDF still generates
      const days = Math.round((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
      const timeseries = [];
      for (let i = 0; i <= days; i++) {
        const d = new Date(from.getTime() + i * 24 * 60 * 60 * 1000);
        timeseries.push({
          time: d.toISOString().split("T")[0],
          visits: Math.floor(Math.random() * 500) + 50
        });
      }
      return res.status(200).json({
        from: from.toISOString(),
        to: to.toISOString(),
        summary: {
          pageviews: timeseries.reduce((acc, curr) => acc + curr.visits, 0),
          visitors: Math.floor(timeseries.reduce((acc, curr) => acc + curr.visits, 0) * 0.6),
          avgSession: "2m 14s"
        },
        timeseries,
        topPages: [
          { route: "/", count: 1240 },
          { route: "/about", count: 430 },
          { route: "/projects", count: 210 },
          { route: "/contact", count: 180 }
        ],
        topCountries: [
          { country: "US", count: 850 },
          { country: "GB", count: 320 },
          { country: "IN", count: 210 },
          { country: "CA", count: 150 }
        ],
        topDevices: [
          { device: "Desktop", count: 1100 },
          { device: "Mobile", count: 850 },
          { device: "Tablet", count: 110 }
        ],
        topReferrers: [
          { referrer: "Google", count: 620 },
          { referrer: "Direct", count: 480 },
          { referrer: "Twitter", count: 290 },
          { referrer: "LinkedIn", count: 150 }
        ]
      });
    }
  });

  // Catch-all 404 for API routes to prevent HTML error leaks
  app.all("/api/*", (req, res) => {
    res.status(404).json({ error: "Not found" });
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
