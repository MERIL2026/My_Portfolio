import { useState, useEffect, useRef } from "react";
import { Lock, Mail, Activity, BarChart, Download, LogOut, Search, ExternalLink, RefreshCw, Trash2, Bell, FileText, Star } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { data } from "../data";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


export function Admin() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "contacts" | "analytics" | "ratings">("overview");

  // Data state
  const [contacts, setContacts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);

  // Ratings state
  const [ratings, setRatings] = useState<any[]>([]);
  const [ratingsLoading, setRatingsLoading] = useState(false);

  // Notification state — track new contacts arriving since last visit
  const [lastSeenCount, setLastSeenCount] = useState(0);
  const prevContactsRef = useRef<any[]>([]);

  // Analytics Export state
  const [analyticsDays, setAnalyticsDays] = useState(30);
  const [analyticsExporting, setAnalyticsExporting] = useState(false);

  // Check auth state on load
  useEffect(() => {
    const authStatus = localStorage.getItem("admin_auth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
      fetchContacts();
      fetchRatings();
    }
    const saved = localStorage.getItem("admin_last_seen_count");
    if (saved) setLastSeenCount(parseInt(saved, 10));
  }, []);

  // Detect new contacts and fire a toast notification
  useEffect(() => {
    if (!isAuthenticated || contacts.length === 0) return;
    const prev = prevContactsRef.current;
    if (prev.length > 0 && contacts.length > prev.length) {
      const newOnes = contacts.length - prev.length;
      toast.success(`${newOnes} new message${newOnes > 1 ? "s" : ""} received!`, {
        description: `From: ${contacts[0].name} <${contacts[0].email}>`,
        duration: 6000,
        icon: <Bell size={16} />,
      });
    }
    prevContactsRef.current = contacts;
  }, [contacts, isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (response.ok) {
        setIsAuthenticated(true);
        localStorage.setItem("admin_auth", "true");
        localStorage.setItem("admin_token", password);
        setError("");
        toast.success("Logged in successfully");
        fetchContacts(password);
        fetchRatings(password);
      } else {
        setError("Invalid password");
        toast.error("Authentication failed", { description: "Check your password and try again." });
      }
    } catch {
      setError("Server error. Please try again.");
      toast.error("Server error", { description: "Could not reach the server." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("admin_auth");
    localStorage.removeItem("admin_token");
    setPassword("");
    toast("Logged out");
  };

  const fetchContacts = async (token?: string) => {
    setIsLoading(true);
    const authToken = token || localStorage.getItem("admin_token");
    try {
      const response = await fetch("/api/admin/contacts", {
        headers: { "Authorization": `Bearer ${authToken}` },
      });
      if (response.ok) {
        const res = await response.json();
        const fetched = res.contacts || [];
        setContacts(fetched);
        // Mark unread count
        const saved = parseInt(localStorage.getItem("admin_last_seen_count") || "0", 10);
        if (fetched.length > saved) {
          setLastSeenCount(fetched.length);
          localStorage.setItem("admin_last_seen_count", String(fetched.length));
        }
      } else if (response.status === 401) {
        handleLogout();
      }
    } catch {
      toast.error("Failed to fetch contacts");
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualRefresh = async () => {
    await fetchContacts();
    toast.success("Contacts refreshed");
  };

  const fetchRatings = async (token?: string) => {
    setRatingsLoading(true);
    const authToken = token || localStorage.getItem("admin_token");
    try {
      const response = await fetch("/api/admin/ratings", {
        headers: { "Authorization": `Bearer ${authToken}` },
      });
      if (response.ok) {
        const res = await response.json();
        setRatings(res.ratings || []);
      } else if (response.status === 401) {
        handleLogout();
      }
    } catch {
      toast.error("Failed to fetch ratings");
    } finally {
      setRatingsLoading(false);
    }
  };

  const handleExportAnalytics = async () => {
    setAnalyticsExporting(true);
    const authToken = localStorage.getItem("admin_token");
    const to = new Date();
    const from = new Date(to.getTime() - analyticsDays * 24 * 60 * 60 * 1000);
    const fromStr = from.toISOString().split("T")[0];
    const toStr = to.toISOString().split("T")[0];

    toast.info("Generating analytics report...", { id: "analytics-export" });
    try {
      const response = await fetch(
        `/api/admin/export-analytics?from=${from.toISOString()}&to=${to.toISOString()}`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      if (!response.ok) throw new Error(`Server error ${response.status}: ${await response.text()}`);
      const d = await response.json();

      // --- Build PDF directly with jsPDF (no DOM capture needed) ---
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const W = pdf.internal.pageSize.getWidth();
      let y = 0;

      // Header bar
      pdf.setFillColor(249, 115, 22); // orange
      pdf.rect(0, 0, W, 28, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(22);
      pdf.setFont("helvetica", "bold");
      pdf.text("ANALYTICS REPORT", 14, 18);
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.text(`merilparmar.com  |  ${fromStr}  →  ${toStr}`, W - 14, 18, { align: "right" });
      y = 38;

      // KPI row
      pdf.setTextColor(30, 30, 30);
      const kpis = [
        { label: "Pageviews", value: (d.summary?.pageviews ?? 0).toLocaleString() },
        { label: "Unique Visitors", value: (d.summary?.visitors ?? 0).toLocaleString() },
        { label: "Avg Session", value: d.summary?.avgSession ?? "—" },
      ];
      const boxW = (W - 28 - 8) / 3;
      kpis.forEach((k, i) => {
        const bx = 14 + i * (boxW + 4);
        pdf.setFillColor(245, 245, 245);
        pdf.roundedRect(bx, y, boxW, 22, 2, 2, "F");
        pdf.setFontSize(7);
        pdf.setTextColor(120, 120, 120);
        pdf.text(k.label.toUpperCase(), bx + boxW / 2, y + 7, { align: "center" });
        pdf.setFontSize(16);
        pdf.setTextColor(30, 30, 30);
        pdf.setFont("helvetica", "bold");
        pdf.text(k.value, bx + boxW / 2, y + 17, { align: "center" });
        pdf.setFont("helvetica", "normal");
      });
      y += 30;

      // Section: Traffic Trend (as simple bar chart drawn with jsPDF)
      pdf.setFontSize(11);
      pdf.setTextColor(249, 115, 22);
      pdf.setFont("helvetica", "bold");
      pdf.text("TRAFFIC TREND", 14, y);
      y += 4;
      pdf.setDrawColor(249, 115, 22);
      pdf.setLineWidth(0.4);
      pdf.line(14, y, W - 14, y);
      y += 5;

      const ts = (d.timeseries || []).slice(-30);
      if (ts.length > 0) {
        const maxV = Math.max(...ts.map((t: any) => t.visits || 0), 1);
        const chartH = 35;
        const chartW = W - 28;
        const barW = Math.max(1, chartW / ts.length - 1);
        ts.forEach((pt: any, i: number) => {
          const barH = ((pt.visits || 0) / maxV) * chartH;
          pdf.setFillColor(59, 130, 246); // blue bars
          pdf.rect(14 + i * (barW + 1), y + chartH - barH, barW, barH, "F");
        });
        // x-axis labels (first, middle, last)
        pdf.setFontSize(6);
        pdf.setTextColor(100, 100, 100);
        pdf.setFont("helvetica", "normal");
        if (ts[0]) pdf.text(ts[0].time?.slice(5) || "", 14, y + chartH + 5);
        if (ts[Math.floor(ts.length / 2)]) pdf.text(ts[Math.floor(ts.length / 2)].time?.slice(5) || "", W / 2, y + chartH + 5, { align: "center" });
        if (ts[ts.length - 1]) pdf.text(ts[ts.length - 1].time?.slice(5) || "", W - 14, y + chartH + 5, { align: "right" });
        y += chartH + 12;
      } else {
        pdf.setFontSize(8); pdf.setTextColor(150, 150, 150);
        pdf.text("No timeseries data available.", 14, y + 8);
        y += 16;
      }

      // Section: Top Pages
      pdf.setFontSize(11);
      pdf.setTextColor(249, 115, 22);
      pdf.setFont("helvetica", "bold");
      pdf.text("TOP PAGES", 14, y);
      y += 4;
      pdf.line(14, y, W - 14, y);
      y += 3;
      autoTable(pdf, {
        startY: y,
        head: [["Page", "Views"]],
        body: (d.topPages || []).slice(0, 8).map((p: any) => [p.route || p.path || "—", (p.count || 0).toString()]),
        theme: "striped",
        headStyles: { fillColor: [30, 30, 30], textColor: [255, 255, 255], fontSize: 8, fontStyle: "bold" },
        bodyStyles: { fontSize: 8, textColor: [40, 40, 40] },
        alternateRowStyles: { fillColor: [248, 248, 248] },
        margin: { left: 14, right: 14 },
        columnStyles: { 1: { halign: "right", cellWidth: 20 } },
      });
      y = (pdf as any).lastAutoTable.finalY + 8;

      // Section: Countries + Devices side by side
      const halfW = (W - 28 - 6) / 2;

      pdf.setFontSize(11);
      pdf.setTextColor(249, 115, 22);
      pdf.setFont("helvetica", "bold");
      pdf.text("TOP COUNTRIES", 14, y);
      pdf.text("DEVICES", 14 + halfW + 6, y);
      y += 4;
      pdf.line(14, y, 14 + halfW, y);
      pdf.line(14 + halfW + 6, y, W - 14, y);
      y += 3;

      autoTable(pdf, {
        startY: y,
        head: [["Country", "Visits"]],
        body: (d.topCountries || []).slice(0, 6).map((c: any) => [c.country || "—", (c.count || 0).toString()]),
        theme: "striped",
        headStyles: { fillColor: [30, 30, 30], textColor: 255, fontSize: 8, fontStyle: "bold" },
        bodyStyles: { fontSize: 8 },
        margin: { left: 14, right: 14 + halfW + 6 },
        columnStyles: { 1: { halign: "right", cellWidth: 18 } },
      });
      const countryFinalY = (pdf as any).lastAutoTable.finalY;

      autoTable(pdf, {
        startY: y,
        head: [["Device", "Visits"]],
        body: (d.topDevices || []).slice(0, 6).map((dv: any) => [dv.device || "—", (dv.count || 0).toString()]),
        theme: "striped",
        headStyles: { fillColor: [30, 30, 30], textColor: 255, fontSize: 8, fontStyle: "bold" },
        bodyStyles: { fontSize: 8 },
        margin: { left: 14 + halfW + 6, right: 14 },
        columnStyles: { 1: { halign: "right", cellWidth: 18 } },
      });
      const deviceFinalY = (pdf as any).lastAutoTable.finalY;
      y = Math.max(countryFinalY, deviceFinalY) + 8;

      // Section: Top Referrers
      pdf.setFontSize(11);
      pdf.setTextColor(249, 115, 22);
      pdf.setFont("helvetica", "bold");
      pdf.text("TOP REFERRERS", 14, y);
      y += 4;
      pdf.line(14, y, W - 14, y);
      y += 3;
      autoTable(pdf, {
        startY: y,
        head: [["Source", "Visits"]],
        body: (d.topReferrers || []).slice(0, 6).map((r: any) => [r.referrer || "Direct", (r.count || 0).toString()]),
        theme: "striped",
        headStyles: { fillColor: [30, 30, 30], textColor: 255, fontSize: 8, fontStyle: "bold" },
        bodyStyles: { fontSize: 8 },
        margin: { left: 14, right: 14 },
        columnStyles: { 1: { halign: "right", cellWidth: 20 } },
      });

      // Footer
      const pageCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(7);
        pdf.setTextColor(160, 160, 160);
        pdf.setFont("helvetica", "normal");
        pdf.text(
          `Generated ${new Date().toLocaleString()} by Meril Parmar Admin  |  Page ${i} of ${pageCount}`,
          W / 2, pdf.internal.pageSize.getHeight() - 6,
          { align: "center" }
        );
      }

      pdf.save(`analytics-report-${fromStr}-to-${toStr}.pdf`);
      toast.success("Analytics report downloaded!", { id: "analytics-export" });
    } catch (err: any) {
      console.error("Export failed:", err);
      toast.error("Export failed", { description: err.message, id: "analytics-export" });
    } finally {
      setAnalyticsExporting(false);
    }
  };

  const confirmDelete = async () => {
    if (!contactToDelete) return;
    const id = contactToDelete;
    setIsLoading(true);
    const authToken = localStorage.getItem("admin_token");
    try {
      const response = await fetch(`/api/admin/contacts/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${authToken}` },
      });
      if (response.ok) {
        setContacts((prev) => prev.filter((c) => c.id !== id));
        toast.success("Message deleted", { icon: <Trash2 size={16} /> });
      } else if (response.status === 401) {
        handleLogout();
      } else {
        toast.error("Failed to delete message");
      }
    } catch {
      toast.error("Network error while deleting");
    } finally {
      setIsLoading(false);
      setContactToDelete(null);
    }
  };

  // ── PDF EXPORT ──────────────────────────────────────────────────────────────
  const exportPDF = () => {
    if (contacts.length === 0) {
      toast.error("No contacts to export");
      return;
    }

    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    const today = new Date().toLocaleDateString("en-IN", {
      year: "numeric", month: "long", day: "numeric",
    });

    // ── Header bar ────────────────────────────────────────────────────────────
    doc.setFillColor(255, 87, 34); // brand-orange
    doc.rect(0, 0, pageW, 20, "F");

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("MERIL PARMAR — Contact Submissions", 14, 13);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Exported: ${today}  |  Total: ${contacts.length}`, pageW - 14, 13, { align: "right" });

    // ── Table ─────────────────────────────────────────────────────────────────
    autoTable(doc, {
      startY: 26,
      head: [["#", "Date", "Name", "Email", "Message"]],
      body: contacts.map((c, i) => [
        i + 1,
        new Date(c.created_at).toLocaleString("en-IN", {
          day: "2-digit", month: "short", year: "numeric",
          hour: "2-digit", minute: "2-digit",
        }),
        c.name || "—",
        c.email || "—",
        c.message || "—",
      ]),
      headStyles: {
        fillColor: [30, 30, 30],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 9,
        halign: "left",
      },
      bodyStyles: {
        fontSize: 8.5,
        textColor: [30, 30, 30],
        valign: "top",
      },
      alternateRowStyles: { fillColor: [248, 248, 248] },
      columnStyles: {
        0: { cellWidth: 10, halign: "center" },
        1: { cellWidth: 38 },
        2: { cellWidth: 36 },
        3: { cellWidth: 58 },
        4: { cellWidth: "auto", cellPadding: { top: 3, bottom: 3, left: 3, right: 3 } },
      },
      didDrawPage: (hookData) => {
        // Footer on every page
        const pCount = (doc as any).internal.getNumberOfPages();
        doc.setFontSize(7);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Page ${hookData.pageNumber} of ${pCount}  —  Meril Parmar Admin Dashboard`,
          pageW / 2,
          doc.internal.pageSize.getHeight() - 6,
          { align: "center" }
        );
      },
      margin: { left: 14, right: 14 },
      styles: { overflow: "linebreak", cellPadding: 3 },
    });

    const filename = `contacts_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(filename);
    toast.success("PDF exported!", {
      description: `Saved as ${filename}`,
      icon: <FileText size={16} />,
    });
  };

  // ── Filter contacts ─────────────────────────────────────────────────────────
  const filteredContacts = contacts.filter(
    (c) =>
      c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.message?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ───────────────────────────────────────────────────────────────────────────
  // LOGIN SCREEN
  // ───────────────────────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center p-6 text-brand-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-orange/10 via-brand-black to-brand-black pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-brand-dark p-8 md:p-12 border border-brand-white/10 relative z-10 shadow-2xl shadow-brand-orange/5"
        >
          <div className="flex justify-center mb-8 text-brand-orange">
            <Lock size={48} strokeWidth={1.5} />
          </div>
          <h1 className="font-heading text-4xl uppercase text-center tracking-tighter mb-2">Admin Access</h1>
          <p className="text-center text-xs font-mono text-brand-white/50 mb-8 uppercase tracking-widest">Restricted Area</p>

          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="ENTER PASSWORD"
                className="bg-transparent border-b-2 border-brand-white/20 py-3 focus:outline-none focus:border-brand-orange transition-colors font-mono text-center tracking-[0.3em]"
                required
              />
            </div>
            {error && <p className="text-brand-orange text-xs font-mono text-center">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="bg-brand-white text-brand-black py-4 font-bold uppercase tracking-widest hover:bg-brand-orange hover:text-brand-white transition-colors duration-300 disabled:opacity-50 mt-2"
            >
              {isLoading ? "Authenticating..." : "Login"}
            </button>
            <a href="/" className="text-center text-[10px] uppercase tracking-widest font-mono text-brand-white/40 hover:text-brand-white transition-colors">
              Return to Site
            </a>
          </form>
        </motion.div>
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // DASHBOARD
  // ───────────────────────────────────────────────────────────────────────────
  const newMsgCount = Math.max(0, contacts.length - lastSeenCount);

  return (
    <div className="min-h-screen bg-brand-black text-brand-white">

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {contactToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="bg-brand-dark border border-brand-orange/50 p-6 md:p-8 max-w-sm w-full"
            >
              <h3 className="font-heading text-2xl uppercase tracking-tighter mb-4 text-brand-orange">Confirm Deletion</h3>
              <p className="text-brand-white/80 text-sm mb-8">
                Are you sure you want to permanently delete this message? This action cannot be undone.
              </p>
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => setContactToDelete(null)}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-brand-white/60 hover:text-brand-white transition-colors"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="bg-brand-orange text-brand-black px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-brand-white transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Header */}
      <header className="bg-brand-dark border-b border-brand-white/10 px-6 py-4 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-brand-orange flex items-center justify-center font-black text-brand-black">A</div>
          <span className="font-heading text-2xl uppercase tracking-tighter">Dashboard</span>
        </div>
        <div className="flex items-center gap-6">
          {/* Notification bell */}
          <button
            onClick={() => {
              setActiveTab("contacts");
              setLastSeenCount(contacts.length);
              localStorage.setItem("admin_last_seen_count", String(contacts.length));
            }}
            className="relative text-brand-white/60 hover:text-brand-orange transition-colors"
            title="New messages"
          >
            <Bell size={20} />
            {newMsgCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-orange rounded-full text-[9px] font-black text-brand-black flex items-center justify-center">
                {newMsgCount > 9 ? "9+" : newMsgCount}
              </span>
            )}
          </button>
          <a href="/" className="text-xs font-bold uppercase tracking-widest hover:text-brand-orange transition-colors hidden sm:block">View Site</a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-white/60 hover:text-brand-orange transition-colors"
          >
            <LogOut size={14} /> <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row min-h-[calc(100vh-65px)]">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 bg-brand-dark/50 border-r border-brand-white/5 p-6 flex flex-row md:flex-col gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors whitespace-nowrap ${activeTab === "overview" ? "bg-brand-white/10 text-brand-orange border-l-2 border-brand-orange" : "text-brand-white/60 hover:bg-brand-white/5 hover:text-brand-white"}`}
          >
            <Activity size={16} /> Overview
          </button>
          <button
            onClick={() => {
              setActiveTab("contacts");
              setLastSeenCount(contacts.length);
              localStorage.setItem("admin_last_seen_count", String(contacts.length));
            }}
            className={`relative flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors whitespace-nowrap ${activeTab === "contacts" ? "bg-brand-white/10 text-brand-orange border-l-2 border-brand-orange" : "text-brand-white/60 hover:bg-brand-white/5 hover:text-brand-white"}`}
          >
            <Mail size={16} /> Contacts
            {newMsgCount > 0 && (
              <span className="ml-auto bg-brand-orange text-brand-black text-[9px] font-black px-1.5 py-0.5 rounded-full">
                {newMsgCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors whitespace-nowrap ${activeTab === "analytics" ? "bg-brand-white/10 text-brand-orange border-l-2 border-brand-orange" : "text-brand-white/60 hover:bg-brand-white/5 hover:text-brand-white"}`}
          >
            <BarChart size={16} /> Analytics
          </button>
          <button
            onClick={() => setActiveTab("ratings")}
            className={`flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors whitespace-nowrap ${activeTab === "ratings" ? "bg-brand-white/10 text-brand-orange border-l-2 border-brand-orange" : "text-brand-white/60 hover:bg-brand-white/5 hover:text-brand-white"}`}
          >
            <Star size={16} /> Ratings
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10 overflow-hidden">

          {/* TAB: OVERVIEW */}
          {activeTab === "overview" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
              <h2 className="font-heading text-4xl uppercase tracking-tighter">System Overview</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-brand-dark border border-brand-white/10 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-brand-white/50">Total Messages</span>
                    <Mail size={16} className="text-brand-orange" />
                  </div>
                  <div className="font-heading text-5xl">{contacts.length}</div>
                </div>

                <div className="bg-brand-dark border border-brand-white/10 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-brand-white/50">Recent 7 Days</span>
                    <Activity size={16} className="text-blue-400" />
                  </div>
                  <div className="font-heading text-5xl">
                    {contacts.filter((c) => new Date(c.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                  </div>
                </div>

                <div className="bg-brand-dark border border-brand-white/10 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-brand-white/50">Projects</span>
                    <BarChart size={16} className="text-green-500" />
                  </div>
                  <div className="font-heading text-5xl">{data.projects.length}</div>
                </div>
              </div>

              {/* New messages notification banner */}
              {newMsgCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-4 bg-brand-orange/10 border border-brand-orange/40 p-4"
                >
                  <Bell size={18} className="text-brand-orange flex-shrink-0" />
                  <p className="text-sm font-bold text-brand-white">
                    You have <span className="text-brand-orange">{newMsgCount} new message{newMsgCount > 1 ? "s" : ""}</span> since your last visit.
                  </p>
                  <button
                    onClick={() => {
                      setActiveTab("contacts");
                      setLastSeenCount(contacts.length);
                      localStorage.setItem("admin_last_seen_count", String(contacts.length));
                    }}
                    className="ml-auto text-xs font-bold uppercase tracking-widest text-brand-orange hover:underline whitespace-nowrap"
                  >
                    View Now →
                  </button>
                </motion.div>
              )}

              <div className="bg-brand-dark border border-brand-white/10 p-6">
                <h3 className="font-heading text-2xl uppercase tracking-tighter mb-6 border-b border-brand-white/10 pb-4">Latest Message</h3>
                {contacts.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <div className="font-bold text-lg">
                        {contacts[0].name}
                        <span className="text-sm font-normal text-brand-white/50 ml-2">&lt;{contacts[0].email}&gt;</span>
                      </div>
                      <div className="text-xs font-mono text-brand-orange">{new Date(contacts[0].created_at).toLocaleString()}</div>
                    </div>
                    <p className="bg-brand-black p-4 text-sm text-brand-white/80 whitespace-pre-wrap">{contacts[0].message}</p>
                    <button
                      onClick={() => setActiveTab("contacts")}
                      className="text-xs font-bold uppercase tracking-widest text-brand-orange self-start mt-2 hover:underline"
                    >
                      View All Messages &rarr;
                    </button>
                  </div>
                ) : (
                  <p className="text-brand-white/50 italic text-sm">No messages received yet.</p>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB: CONTACTS */}
          {activeTab === "contacts" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6 h-full">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <h2 className="font-heading text-4xl uppercase tracking-tighter">Contact Submissions</h2>
                <div className="flex gap-2">
                  <button
                    onClick={handleManualRefresh}
                    className="flex items-center gap-2 bg-brand-dark border border-brand-white/20 text-brand-white px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-brand-white/10 transition-colors"
                  >
                    <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} /> Refresh
                  </button>
                  <button
                    onClick={exportPDF}
                    disabled={contacts.length === 0}
                    className="flex items-center gap-2 bg-brand-white text-brand-black px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-brand-orange hover:text-brand-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Download size={14} /> Export PDF
                  </button>
                </div>
              </div>

              <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-white/50" />
                <input
                  type="text"
                  placeholder="SEARCH MESSAGES..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-brand-dark border border-brand-white/10 py-3 pl-12 pr-4 text-sm font-mono focus:outline-none focus:border-brand-orange transition-colors"
                />
              </div>

              <div className="flex-1 bg-brand-dark border border-brand-white/10 overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-brand-white/10 text-xs font-bold uppercase tracking-widest text-brand-white/50 bg-brand-black/50">
                        <th className="p-4 w-48">Date</th>
                        <th className="p-4 w-48">Name</th>
                        <th className="p-4">Message</th>
                        <th className="p-4 w-12"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-brand-white/50 font-mono text-xs">
                            Loading...
                          </td>
                        </tr>
                      ) : filteredContacts.length > 0 ? (
                        filteredContacts.map((contact, i) => (
                          <motion.tr
                            key={contact.id || i}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.03 }}
                            className="border-b border-brand-white/5 hover:bg-brand-white/5 transition-colors group"
                          >
                            <td className="p-4 align-top">
                              <div className="text-xs font-mono text-brand-orange">
                                {new Date(contact.created_at).toLocaleDateString()}
                              </div>
                              <div className="text-[10px] font-mono text-brand-white/40">
                                {new Date(contact.created_at).toLocaleTimeString()}
                              </div>
                            </td>
                            <td className="p-4 align-top">
                              <div className="font-bold text-sm mb-1">{contact.name}</div>
                              <a href={`mailto:${contact.email}`} className="text-xs text-blue-400 hover:underline break-all">
                                {contact.email}
                              </a>
                            </td>
                            <td className="p-4 align-top">
                              <p className="text-sm text-brand-white/80 line-clamp-2 group-hover:line-clamp-none transition-all duration-300 bg-brand-black/30 p-3 whitespace-pre-wrap">
                                {contact.message}
                              </p>
                            </td>
                            <td className="p-4 align-top text-right">
                              <button
                                onClick={() => setContactToDelete(contact.id)}
                                className="text-brand-white/40 hover:text-brand-orange transition-colors"
                                title="Delete Message"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </motion.tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-brand-white/50 font-mono text-xs">
                            No matching contacts found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {filteredContacts.length > 0 && (
                <div className="flex items-center justify-between text-xs font-mono text-brand-white/40">
                  <span>{filteredContacts.length} message{filteredContacts.length !== 1 ? "s" : ""} {searchQuery ? "matching" : "total"}</span>
                  <button
                    onClick={exportPDF}
                    className="flex items-center gap-1.5 text-brand-orange hover:underline"
                  >
                    <FileText size={12} /> Download as PDF
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB: ANALYTICS */}
          {activeTab === "analytics" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <h2 className="font-heading text-4xl uppercase tracking-tighter">Site Analytics</h2>
                <div className="flex gap-0 items-stretch border border-brand-white/20 overflow-hidden">
                  <select
                    value={analyticsDays}
                    onChange={(e) => setAnalyticsDays(Number(e.target.value))}
                    className="bg-brand-dark text-brand-white text-xs font-mono px-4 py-3 focus:outline-none border-r border-brand-white/20 cursor-pointer appearance-none pr-8"
                    style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center" }}
                    disabled={analyticsExporting}
                  >
                    <option value={7} style={{ background: "#1a1a1a", color: "#ffffff" }}>Last 7 Days</option>
                    <option value={30} style={{ background: "#1a1a1a", color: "#ffffff" }}>Last 30 Days</option>
                    <option value={90} style={{ background: "#1a1a1a", color: "#ffffff" }}>Last 90 Days</option>
                  </select>
                  <button
                    onClick={handleExportAnalytics}
                    disabled={analyticsExporting}
                    className="flex items-center gap-2 bg-brand-white text-brand-black px-5 py-3 text-xs font-bold uppercase tracking-widest hover:bg-brand-orange hover:text-brand-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {analyticsExporting ? (
                      <RefreshCw size={14} className="animate-spin" />
                    ) : (
                      <Download size={14} />
                    )}
                    Export PDF
                  </button>
                </div>
              </div>


              <div className="bg-brand-dark border border-brand-white/10 p-8 flex flex-col items-center justify-center text-center min-h-[400px]">
                <BarChart size={48} className="text-brand-orange mb-6 opacity-50" />
                <h3 className="font-heading text-2xl uppercase mb-4">Vercel Analytics Integrated</h3>
                <p className="max-w-md text-brand-white/60 mb-8">
                  Your portfolio is currently using Vercel Analytics and Speed Insights.
                  Use the Export button above to generate a comprehensive PDF report combining
                  Vercel's real-time traffic data, or view your live dashboard on Vercel.
                </p>
                <a
                  href="https://vercel.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-brand-white text-brand-black px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-brand-orange hover:text-brand-white transition-colors"
                >
                  Open Vercel Dashboard <ExternalLink size={14} className="inline ml-1 -mt-1" />
                </a>
              </div>
            </motion.div>
          )}

          {/* TAB: RATINGS */}
          {activeTab === "ratings" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <h2 className="font-heading text-4xl uppercase tracking-tighter">Portfolio Ratings</h2>
                <button
                  onClick={() => fetchRatings()}
                  className="flex items-center gap-2 bg-brand-dark border border-brand-white/20 text-brand-white px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-brand-white/10 transition-colors"
                >
                  <RefreshCw size={14} className={ratingsLoading ? "animate-spin" : ""} /> Refresh
                </button>
              </div>

              {(() => {
                const total = ratings.length;
                const avg = total > 0 ? (ratings.reduce((acc, r) => acc + r.score, 0) / total).toFixed(1) : "0.0";
                const distribution = [5, 4, 3, 2, 1].map(score => ({
                  score,
                  count: ratings.filter(r => r.score === score).length,
                }));

                return (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-brand-dark border border-brand-white/10 p-6 flex flex-col items-center justify-center">
                        <span className="text-xs font-bold uppercase tracking-widest text-brand-white/50 mb-2">Average Score</span>
                        <div className="font-heading text-7xl text-brand-orange">{avg}</div>
                        <div className="flex gap-1 mt-2 text-brand-orange">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={16} fill={s <= Math.round(parseFloat(avg)) ? "currentColor" : "transparent"} strokeWidth={1} />
                          ))}
                        </div>
                        <span className="text-xs font-mono text-brand-white/40 mt-4">Based on {total} ratings</span>
                      </div>

                      <div className="md:col-span-2 bg-brand-dark border border-brand-white/10 p-6">
                        <span className="text-xs font-bold uppercase tracking-widest text-brand-white/50 mb-6 block">Score Distribution</span>
                        <div className="flex flex-col gap-3">
                          {distribution.map(({ score, count }) => {
                            const percent = total > 0 ? (count / total) * 100 : 0;
                            return (
                              <div key={score} className="flex items-center gap-4">
                                <div className="flex items-center gap-1 w-12 text-sm font-mono text-brand-white/60">
                                  <span>{score}</span> <Star size={12} className="text-brand-orange" />
                                </div>
                                <div className="flex-1 h-2 bg-brand-black overflow-hidden relative rounded-full">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percent}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="absolute inset-y-0 left-0 bg-brand-orange"
                                  />
                                </div>
                                <div className="w-10 text-right text-xs font-mono">{count}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="bg-brand-dark border border-brand-white/10 p-6 mt-2">
                      <span className="text-xs font-bold uppercase tracking-widest text-brand-white/50 mb-4 block">Recent Submissions</span>
                      <div className="flex flex-col gap-2">
                        {ratings.length > 0 ? (
                          ratings.slice(0, 10).map((r, i) => (
                            <div key={i} className="flex flex-col gap-2 p-3 bg-brand-black/50 border border-brand-white/5">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2 text-brand-orange">
                                  {[...Array(r.score)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                                </div>
                                <span className="text-xs font-mono text-brand-white/40">
                                  {new Date(r.created_at).toLocaleString()}
                                </span>
                              </div>
                              {r.review && (
                                <p className="text-xs text-brand-white/70 italic bg-brand-dark/50 p-2 border-l-2 border-brand-orange mt-1 whitespace-pre-wrap">
                                  "{r.review}"
                                </p>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="text-xs font-mono text-brand-white/30 p-4 text-center">No ratings yet</div>
                        )}
                        {ratings.length > 10 && (
                          <div className="text-center text-xs font-mono text-brand-white/30 pt-2">+ {ratings.length - 10} more</div>
                        )}
                      </div>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          )}

        </main>
      </div>
    </div>
  );
}
