"use client";

import { useState } from "react";
import { LayoutDashboard, Users, Briefcase, CheckCircle2, XCircle, Clock, TrendingUp, BarChart3, Settings, Eye, ChevronRight, Shield, AlertTriangle, Calendar, MapPin } from "lucide-react";

const DASHBOARD_STATS = [
  { label: "Total Workers", value: "523", change: "+12%", icon: <Users size={20} />, color: "text-brand-400" },
  { label: "Active Bookings", value: "89", change: "+5%", icon: <Briefcase size={20} />, color: "text-accent-blue" },
  { label: "Pending Verification", value: "17", change: "-3%", icon: <Clock size={20} />, color: "text-accent-orange" },
  { label: "Completed Services", value: "1,247", change: "+18%", icon: <CheckCircle2 size={20} />, color: "text-accent-green" },
];

const PENDING_VERIFICATIONS = [
  { name: "Kumar Rajan", profession: "Electrician", date: "2026-09-14", city: "Mumbai", docs: 3 },
  { name: "Priyanka Sharma", profession: "Plumber", date: "2026-09-13", city: "Delhi", docs: 2 },
  { name: "Amit Patel", profession: "Carpenter", date: "2026-09-12", city: "Pune", docs: 4 },
  { name: "Rina Das", profession: "Painter", date: "2026-09-11", city: "Kolkata", docs: 3 },
  { name: "Sunil Kumar", profession: "Technician", date: "2026-09-10", city: "Hyderabad", docs: 2 },
];

const RECENT_BOOKINGS = [
  { customer: "Rahul Mehta", worker: "Rajesh K.", service: "Wiring", date: "2026-09-15", amount: 2800, status: "completed" },
  { customer: "Neha Gupta", worker: "Sunita D.", service: "Pipe Repair", date: "2026-09-15", amount: 1500, status: "in-progress" },
  { customer: "Arun Singh", worker: "Arjun M.", service: "Furniture", date: "2026-09-14", amount: 4500, status: "completed" },
  { customer: "Meera Nair", worker: "Priya N.", service: "Painting", date: "2026-09-14", amount: 8200, status: "pending" },
  { customer: "Vikash Kumar", worker: "Deepak V.", service: "AC Repair", date: "2026-09-13", amount: 1200, status: "completed" },
];

const REVENUE_DATA = [
  { month: "Apr", amount: 45000 }, { month: "May", amount: 52000 }, { month: "Jun", amount: 48000 },
  { month: "Jul", amount: 61000 }, { month: "Aug", amount: 73000 }, { month: "Sep", amount: 68000 },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "workers" | "bookings" | "analytics">("overview");

  const maxRevenue = Math.max(...REVENUE_DATA.map(d => d.amount));

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <section className="py-8 bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <LayoutDashboard size={24} className="text-brand-400" />
            <h1 className="text-2xl sm:text-3xl font-bold text-ink">Cooperative Admin Dashboard</h1>
          </div>
          <p className="text-ink-secondary text-sm">Mumbai Labour Cooperative Federation — Admin Panel</p>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {DASHBOARD_STATS.map((stat, i) => (
            <div key={i} className="bg-surface-card rounded-2xl border border-border p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`${stat.color}`}>{stat.icon}</div>
                <span className={`text-xs font-medium ${stat.change.startsWith("+") ? "text-accent-green" : "text-accent-pink"}`}>{stat.change}</span>
              </div>
              <div className="text-xl font-bold text-ink">{stat.value}</div>
              <div className="text-xs text-ink-secondary">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="flex gap-2 mb-6 bg-surface-card rounded-xl border border-border p-1 overflow-x-auto">
          {[
            { key: "overview" as const, label: "Overview" },
            { key: "workers" as const, label: "Workers" },
            { key: "bookings" as const, label: "Bookings" },
            { key: "analytics" as const, label: "Analytics" },
          ].map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${activeTab === tab.key ? "gradient-brand text-white" : "text-ink-secondary hover:text-ink"}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pending Verifications */}
            <div className="bg-surface-card rounded-2xl border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-ink flex items-center gap-2">
                  <Shield size={16} className="text-accent-orange" /> Pending Verifications
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-accent-orange/10 text-accent-orange text-xs font-medium">{PENDING_VERIFICATIONS.length}</span>
              </div>
              <div className="space-y-3">
                {PENDING_VERIFICATIONS.map((w, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-surface">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center text-white text-xs font-bold">
                        {w.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-ink">{w.name}</div>
                        <div className="text-xs text-ink-secondary">{w.profession} • {w.city}</div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button className="w-8 h-8 rounded-lg bg-accent-green/10 flex items-center justify-center text-accent-green hover:bg-accent-green/20 cursor-pointer">
                        <CheckCircle2 size={14} />
                      </button>
                      <button className="w-8 h-8 rounded-lg bg-accent-pink/10 flex items-center justify-center text-accent-pink hover:bg-accent-pink/20 cursor-pointer">
                        <XCircle size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-surface-card rounded-2xl border border-border p-6">
              <h3 className="text-sm font-semibold text-ink flex items-center gap-2 mb-4">
                <Briefcase size={16} className="text-brand-400" /> Recent Bookings
              </h3>
              <div className="space-y-3">
                {RECENT_BOOKINGS.map((b, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-surface">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-400 text-xs font-bold">
                        {b.customer.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-ink">{b.service} — {b.worker}</div>
                        <div className="text-xs text-ink-secondary">{b.customer} • {b.date}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-ink">₹{b.amount.toLocaleString()}</div>
                      <div className={`text-xs font-medium ${b.status === "completed" ? "text-accent-green" : b.status === "in-progress" ? "text-accent-blue" : "text-accent-orange"}`}>
                        {b.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "workers" && (
          <div className="bg-surface-card rounded-2xl border border-border p-6">
            <h3 className="text-sm font-semibold text-ink mb-4">Worker Management</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-xs text-ink-muted font-medium">Worker</th>
                    <th className="text-left py-3 px-2 text-xs text-ink-muted font-medium">Profession</th>
                    <th className="text-left py-3 px-2 text-xs text-ink-muted font-medium">City</th>
                    <th className="text-left py-3 px-2 text-xs text-ink-muted font-medium">Status</th>
                    <th className="text-left py-3 px-2 text-xs text-ink-muted font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {PENDING_VERIFICATIONS.map((w, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td className="py-3 px-2 font-medium text-ink">{w.name}</td>
                      <td className="py-3 px-2 text-ink-secondary">{w.profession}</td>
                      <td className="py-3 px-2 text-ink-secondary flex items-center gap-1"><MapPin size={10} /> {w.city}</td>
                      <td className="py-3 px-2"><span className="px-2 py-0.5 rounded-full bg-accent-orange/10 text-accent-orange text-xs">Pending</span></td>
                      <td className="py-3 px-2">
                        <div className="flex gap-1">
                          <button className="px-2 py-1 rounded-lg bg-accent-green/10 text-accent-green text-xs cursor-pointer hover:bg-accent-green/20">Approve</button>
                          <button className="px-2 py-1 rounded-lg bg-accent-pink/10 text-accent-pink text-xs cursor-pointer hover:bg-accent-pink/20">Reject</button>
                          <button className="px-2 py-1 rounded-lg bg-brand-500/10 text-brand-400 text-xs cursor-pointer hover:bg-brand-500/20"><Eye size={10} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "bookings" && (
          <div className="bg-surface-card rounded-2xl border border-border p-6">
            <h3 className="text-sm font-semibold text-ink mb-4">All Bookings</h3>
            <div className="space-y-3">
              {RECENT_BOOKINGS.map((b, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-surface border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center text-white text-xs font-bold">
                      {b.customer.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-ink">{b.customer} → {b.worker}</div>
                      <div className="text-xs text-ink-secondary">{b.service} • {b.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-ink">₹{b.amount.toLocaleString()}</div>
                    <div className={`text-xs font-medium ${b.status === "completed" ? "text-accent-green" : b.status === "in-progress" ? "text-accent-blue" : "text-accent-orange"}`}>{b.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-6">
            {/* Revenue Chart */}
            <div className="bg-surface-card rounded-2xl border border-border p-6">
              <h3 className="text-sm font-semibold text-ink mb-4 flex items-center gap-2">
                <BarChart3 size={16} className="text-brand-400" /> Monthly Revenue
              </h3>
              <div className="flex items-end gap-3 h-48">
                {REVENUE_DATA.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs font-medium text-ink">₹{(d.amount / 1000).toFixed(0)}K</span>
                    <div className="w-full rounded-t-lg gradient-brand transition-all" style={{ height: `${(d.amount / maxRevenue) * 100}%`, minHeight: "20px" }} />
                    <span className="text-xs text-ink-muted">{d.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Distribution */}
            <div className="bg-surface-card rounded-2xl border border-border p-6">
              <h3 className="text-sm font-semibold text-ink mb-4">Service Distribution</h3>
              <div className="space-y-3">
                {[
                  { name: "Electrical", count: 156, pct: 30 },
                  { name: "Plumbing", count: 124, pct: 24 },
                  { name: "Carpentry", count: 98, pct: 19 },
                  { name: "Painting", count: 67, pct: 13 },
                  { name: "Domestic Help", count: 45, pct: 9 },
                  { name: "Others", count: 33, pct: 5 },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-ink">{s.name}</span>
                      <span className="text-xs text-ink-secondary">{s.count} ({s.pct}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-surface-muted">
                      <div className="h-full rounded-full gradient-brand" style={{ width: `${s.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
