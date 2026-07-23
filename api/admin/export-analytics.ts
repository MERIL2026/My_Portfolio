import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const adminPassword = process.env.ADMIN_PASSWORD;
    const authHeader = req.headers.authorization;
    if (!adminPassword || !authHeader || authHeader !== `Bearer ${adminPassword}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const vercelToken = process.env.VERCEL_API_TOKEN;
    const projectId = process.env.VERCEL_PROJECT_ID;
    const teamId = process.env.VERCEL_TEAM_ID;

    const fromParam = (req.query.from as string) || undefined;
    const toParam = (req.query.to as string) || undefined;

    const to = toParam ? new Date(toParam) : new Date();
    const from = fromParam ? new Date(fromParam) : new Date(to.getTime() - 30 * 24 * 60 * 60 * 1000);

    if (!vercelToken || !projectId) {
      // Return mock data when tokens aren't configured
      return res.status(200).json(getMockData(from, to));
    }

    try {
      const baseUrl = "https://api.vercel.com/v1/query/web-analytics";
      const headers = { Authorization: `Bearer ${vercelToken}` };
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
          console.warn(`Vercel API ${path} → ${fetchRes.status}`);
          return null;
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

      throw new Error("All Vercel API calls returned errors");
    } catch (error: any) {
      console.warn("Vercel API unavailable, serving mock data:", error.message);
      return res.status(200).json(getMockData(from, to));
    }
  } catch (err: any) {
    console.error("export-analytics handler error:", err);
    return res.status(500).json({ error: "Internal server error", message: err?.message });
  }
}

function getMockData(from: Date, to: Date) {
  const days = Math.round((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
  const timeseries = [];
  for (let i = 0; i <= days; i++) {
    const d = new Date(from.getTime() + i * 24 * 60 * 60 * 1000);
    timeseries.push({
      time: d.toISOString().split("T")[0],
      visits: Math.floor(Math.random() * 500) + 50
    });
  }

  return {
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
  };
}
