import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Lock, Mail, Activity, BarChart, Download, LogOut, Search, ExternalLink, RefreshCw, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { data } from "../data";

// Note: Admin dashboard logic
// The dashboard relies on client-side password authentication for simplicity.
// For production security, RLS (Row Level Security) and Supabase Auth should be used.

export function Admin() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "contacts" | "analytics">("overview");

  // Data state
  const [contacts, setContacts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);

  // Check auth state on load
  useEffect(() => {
    const authStatus = localStorage.getItem("admin_auth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
      fetchContacts();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // In a real app, this would be a secure API call to verify the password against an env var.
    // For this portfolio demo, we are checking an endpoint we will build.
    try {
      const response = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        localStorage.setItem("admin_auth", "true");
        localStorage.setItem("admin_token", password); // Store temporarily for API calls
        setError("");
        fetchContacts(password);
      } else {
        setError("Invalid password");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("admin_auth");
    localStorage.removeItem("admin_token");
    setPassword("");
  };

  const fetchContacts = async (token?: string) => {
    setIsLoading(true);
    const authToken = token || localStorage.getItem("admin_token");

    try {
      const response = await fetch("/api/admin/contacts", {
        headers: {
          "Authorization": `Bearer ${authToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setContacts(data.contacts || []);
      } else if (response.status === 401) {
        handleLogout();
      }
    } catch (error) {
      console.error("Failed to fetch contacts", error);
    } finally {
      setIsLoading(false);
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
        headers: {
          "Authorization": `Bearer ${authToken}`
        }
      });
      
      if (response.ok) {
        setContacts(contacts.filter(c => c.id !== id));
      } else if (response.status === 401) {
        handleLogout();
      }
    } catch (error) {
      console.error("Failed to delete contact", error);
    } finally {
      setIsLoading(false);
      setContactToDelete(null);
    }
  };

  const exportCSV = () => {
    if (contacts.length === 0) return;

    const headers = ["ID", "Name", "Email", "Message", "Date"];
    const csvContent = [
      headers.join(","),
      ...contacts.map(c =>
        `"${c.id}","${c.name}","${c.email}","${c.message.replace(/"/g, '""')}","${new Date(c.created_at).toLocaleString()}"`
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `contacts_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter contacts
  const filteredContacts = contacts.filter(c =>
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.message?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center p-6 text-brand-white relative overflow-hidden">
        {/* Background effects */}
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

  return (
    <div className="min-h-screen bg-brand-black text-brand-white">
      {/* Delete Confirmation Modal */}
      {contactToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-black/80 backdrop-blur-sm">
          <div className="bg-brand-dark border border-brand-orange/50 p-6 md:p-8 max-w-sm w-full">
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
          </div>
        </div>
      )}

      {/* Admin Header */}
      <header className="bg-brand-dark border-b border-brand-white/10 px-6 py-4 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-brand-orange flex items-center justify-center font-black text-brand-black">A</div>
          <span className="font-heading text-2xl uppercase tracking-tighter">Dashboard</span>
        </div>
        <div className="flex items-center gap-6">
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
            className={`flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors whitespace-nowrap ${activeTab === 'overview' ? 'bg-brand-white/10 text-brand-orange border-l-2 border-brand-orange' : 'text-brand-white/60 hover:bg-brand-white/5 hover:text-brand-white'}`}
          >
            <Activity size={16} /> Overview
          </button>
          <button
            onClick={() => setActiveTab("contacts")}
            className={`flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors whitespace-nowrap ${activeTab === 'contacts' ? 'bg-brand-white/10 text-brand-orange border-l-2 border-brand-orange' : 'text-brand-white/60 hover:bg-brand-white/5 hover:text-brand-white'}`}
          >
            <Mail size={16} /> Contacts
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors whitespace-nowrap ${activeTab === 'analytics' ? 'bg-brand-white/10 text-brand-orange border-l-2 border-brand-orange' : 'text-brand-white/60 hover:bg-brand-white/5 hover:text-brand-white'}`}
          >
            <BarChart size={16} /> Analytics
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
                    <Activity size={16} className="text-brand-blue" />
                  </div>
                  <div className="font-heading text-5xl">
                    {contacts.filter(c => new Date(c.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
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

              <div className="bg-brand-dark border border-brand-white/10 p-6">
                <h3 className="font-heading text-2xl uppercase tracking-tighter mb-6 border-b border-brand-white/10 pb-4">Latest Message</h3>
                {contacts.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <div className="font-bold text-lg">{contacts[0].name} <span className="text-sm font-normal text-brand-white/50 ml-2">&lt;{contacts[0].email}&gt;</span></div>
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
                    onClick={() => fetchContacts()}
                    className="flex items-center gap-2 bg-brand-dark border border-brand-white/20 text-brand-white px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-brand-white/10 transition-colors"
                  >
                    <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} /> Refresh
                  </button>
                  <button
                    onClick={exportCSV}
                    className="flex items-center gap-2 bg-brand-white text-brand-black px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-brand-orange hover:text-brand-white transition-colors"
                  >
                    <Download size={14} /> Export CSV
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
                          <td colSpan={3} className="p-8 text-center text-brand-white/50 font-mono text-xs">Loading...</td>
                        </tr>
                      ) : filteredContacts.length > 0 ? (
                        filteredContacts.map((contact, i) => (
                          <tr key={contact.id || i} className="border-b border-brand-white/5 hover:bg-brand-white/5 transition-colors group">
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
                              <a href={`mailto:${contact.email}`} className="text-xs text-brand-blue hover:underline break-all">{contact.email}</a>
                            </td>
                            <td className="p-4 align-top">
                              <p className="text-sm text-brand-white/80 line-clamp-2 group-hover:line-clamp-none transition-all duration-300 bg-brand-black/30 p-3">
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
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="p-8 text-center text-brand-white/50 font-mono text-xs">No matching contacts found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB: ANALYTICS */}
          {activeTab === "analytics" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
              <h2 className="font-heading text-4xl uppercase tracking-tighter">Site Analytics</h2>

              <div className="bg-brand-dark border border-brand-white/10 p-8 flex flex-col items-center justify-center text-center min-h-[400px]">
                <BarChart size={48} className="text-brand-orange mb-6 opacity-50" />
                <h3 className="font-heading text-2xl uppercase mb-4">Vercel Analytics Integrated</h3>
                <p className="max-w-md text-brand-white/60 mb-8">
                  Your portfolio is currently using Vercel Analytics and Speed Insights.
                  To view detailed visitor charts, geographic data, and performance metrics,
                  please check your Vercel Dashboard.
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

        </main>
      </div>
    </div>
  );
}
