import { forwardRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { Activity, Globe, Monitor, FileText, ArrowRight } from "lucide-react";

interface AnalyticsData {
  from: string;
  to: string;
  summary: {
    pageviews: number;
    visitors: number;
    avgSession: string;
  };
  timeseries: Array<{ time: string; visits: number }>;
  topPages: Array<{ route: string; count: number }>;
  topCountries: Array<{ country: string; count: number }>;
  topDevices: Array<{ device: string; count: number }>;
  topReferrers: Array<{ referrer: string; count: number }>;
}

interface AnalyticsReportLayoutProps {
  data: AnalyticsData | null;
}

const COLORS = ["#f97316", "#3b82f6", "#10b981", "#8b5cf6", "#ec4899", "#facc15"];

export const AnalyticsReportLayout = forwardRef<HTMLDivElement, AnalyticsReportLayoutProps>(
  ({ data }, ref) => {
    if (!data) return null;

    const fromDate = new Date(data.from).toLocaleDateString();
    const toDate = new Date(data.to).toLocaleDateString();

    return (
      <div
        // Positioned far off-screen — visible to html2canvas but not the user
        className="fixed top-0 pointer-events-none"
        style={{ left: "9999px", zIndex: -1 }}
      >
        <div
          ref={ref}
          className="bg-brand-black text-brand-white p-12 flex flex-col gap-10"
          style={{ width: "1200px", minHeight: "1600px" }} // Force a large A4-ish vertical ratio or just tall enough
        >
          {/* HEADER */}
          <div className="flex justify-between items-end border-b border-brand-white/10 pb-8">
            <div>
              <h1 className="font-heading text-6xl uppercase tracking-tighter text-brand-orange mb-2">
                Analytics Report
              </h1>
              <p className="text-brand-white/60 font-mono text-lg">
                merilparmar.com
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold uppercase tracking-widest text-sm text-brand-white/50 mb-1">
                Date Range
              </p>
              <p className="font-mono text-xl">
                {fromDate} <ArrowRight size={16} className="inline mx-2 text-brand-orange" /> {toDate}
              </p>
            </div>
          </div>

          {/* KPI SUMMARY */}
          <div className="grid grid-cols-3 gap-8">
            <div className="bg-brand-dark border border-brand-white/10 p-8 flex flex-col justify-center">
              <span className="text-sm font-bold uppercase tracking-widest text-brand-white/50 mb-4 flex items-center gap-2">
                <Activity size={16} className="text-brand-orange" /> Total Pageviews
              </span>
              <div className="font-heading text-7xl text-brand-white">
                {data.summary.pageviews.toLocaleString()}
              </div>
            </div>
            <div className="bg-brand-dark border border-brand-white/10 p-8 flex flex-col justify-center">
              <span className="text-sm font-bold uppercase tracking-widest text-brand-white/50 mb-4 flex items-center gap-2">
                <Globe size={16} className="text-blue-400" /> Unique Visitors
              </span>
              <div className="font-heading text-7xl text-brand-white">
                {data.summary.visitors.toLocaleString()}
              </div>
            </div>
            <div className="bg-brand-dark border border-brand-white/10 p-8 flex flex-col justify-center">
              <span className="text-sm font-bold uppercase tracking-widest text-brand-white/50 mb-4 flex items-center gap-2">
                <Monitor size={16} className="text-green-400" /> Avg. Session
              </span>
              <div className="font-heading text-7xl text-brand-white">
                {data.summary.avgSession}
              </div>
            </div>
          </div>

          {/* TREND CHART */}
          <div className="bg-brand-dark border border-brand-white/10 p-8">
            <h2 className="font-heading text-3xl uppercase tracking-tighter mb-8">Traffic Trend</h2>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.timeseries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                  <XAxis 
                    dataKey="time" 
                    stroke="rgba(255,255,255,0.5)" 
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontFamily: 'monospace', fontSize: 12 }} 
                    tickMargin={10}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.5)" 
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontFamily: 'monospace', fontSize: 12 }}
                    tickMargin={10}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', fontFamily: 'monospace' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="visits" 
                    stroke="#f97316" 
                    strokeWidth={4} 
                    dot={{ fill: '#111', stroke: '#f97316', strokeWidth: 2, r: 6 }} 
                    activeDot={{ r: 8, fill: '#f97316' }}
                    isAnimationActive={false} // Disable animation so html2canvas captures it instantly
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {/* TOP PAGES */}
            <div className="bg-brand-dark border border-brand-white/10 p-8">
              <h2 className="font-heading text-3xl uppercase tracking-tighter mb-8 flex items-center gap-3">
                <FileText size={24} className="text-brand-orange" /> Top Pages
              </h2>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.topPages} layout="vertical" margin={{ left: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
                    <XAxis type="number" stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
                    <YAxis dataKey="route" type="category" stroke="rgba(255,255,255,0.5)" tick={{ fill: '#fff', fontSize: 14 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }} />
                    <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* TOP DEVICES (DONUT) */}
            <div className="bg-brand-dark border border-brand-white/10 p-8">
              <h2 className="font-heading text-3xl uppercase tracking-tighter mb-8 flex items-center gap-3">
                <Monitor size={24} className="text-green-500" /> Devices
              </h2>
              <div className="h-[300px] w-full flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.topDevices}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="count"
                      nameKey="device"
                      isAnimationActive={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {data.topDevices.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          {/* FOOTER */}
          <div className="mt-auto pt-8 border-t border-brand-white/10 text-center text-brand-white/30 text-xs font-mono uppercase tracking-widest">
            Generated on {new Date().toLocaleString()} by Meril Parmar Portfolio Admin
          </div>
        </div>
      </div>
    );
  }
);

AnalyticsReportLayout.displayName = "AnalyticsReportLayout";
