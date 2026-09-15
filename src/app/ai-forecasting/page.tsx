"use client";

import { useState } from "react";
import { Brain, TrendingUp, BarChart3, Calendar, MapPin, Users, Zap, Clock, Target, ArrowUpRight, ArrowDownRight, Sparkles, Settings, Cpu, Database, Cloud } from "lucide-react";

const DEMAND_DATA = [
  { day: "Mon", demand: 85, supply: 90 }, { day: "Tue", demand: 72, supply: 85 },
  { day: "Wed", demand: 90, supply: 88 }, { day: "Thu", demand: 65, supply: 80 },
  { day: "Fri", demand: 95, supply: 92 }, { day: "Sat", demand: 110, supply: 95 },
  { day: "Sun", demand: 45, supply: 60 },
];

const FORECASTS = [
  { category: "Electrical", trend: "up", predicted: "+23%", confidence: 92, reason: "Monsoon season — increased electrical repairs" },
  { category: "Plumbing", trend: "up", predicted: "+18%", confidence: 88, reason: "Weather-related pipe damage spikes" },
  { category: "Carpentry", trend: "stable", predicted: "+5%", confidence: 85, reason: "Steady demand for furniture repair" },
  { category: "Painting", trend: "down", predicted: "-12%", confidence: 79, reason: "Post-monsoon preferred season ending" },
  { category: "Cleaning", trend: "up", predicted: "+31%", confidence: 94, reason: "Festival season cleaning demand" },
];

const WORKER_ALLOCATIONS = [
  { worker: "Rajesh K.", profession: "Electrician", area: "Andheri West", predicted: 8, allocated: 6, status: "Optimized" },
  { worker: "Sunita D.", profession: "Plumber", area: "Lajpat Nagar", predicted: 6, allocated: 5, status: "Optimized" },
  { worker: "Arjun M.", profession: "Carpenter", area: "Koramangala", predicted: 4, allocated: 4, status: "Matched" },
  { worker: "Priya N.", profession: "Painter", area: "Kothrud", predicted: 3, allocated: 2, status: "Under-allocated" },
  { worker: "Deepak V.", profession: "Technician", area: "Dwarka", predicted: 7, allocated: 5, status: "Optimized" },
];

const AI_FEATURES = [
  { icon: <Brain size={24} />, title: "Demand Prediction", desc: "ML models analyze historical data, weather, and trends to forecast service demand." },
  { icon: <Users size={24} />, title: "Workforce Allocation", desc: "AI optimally distributes workers based on predicted demand and availability." },
  { icon: <MapPin size={24} />, title: "Location Intelligence", desc: "Geo-spatial analysis identifies high-demand zones for proactive worker deployment." },
  { icon: <TrendingUp size={24} />, title: "Trend Analysis", desc: "Identifies seasonal patterns and emerging service trends across regions." },
  { icon: <Clock size={24} />, title: "Peak Hour Optimization", desc: "Predicts peak hours and adjusts worker scheduling for maximum efficiency." },
  { icon: <Target size={24} />, title: "Accuracy Scoring", desc: "Confidence scores for each prediction help prioritize resource allocation." },
];

export default function AIForecastingPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  const maxDemand = Math.max(...DEMAND_DATA.map(d => Math.max(d.demand, d.supply)));

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero */}
      <section className="py-12 sm:py-16 bg-surface relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 right-20 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-72 h-72 bg-accent-blue/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium mb-6">
            <Sparkles size={16} />
            Artificial Intelligence
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink mb-4">
            AI-Powered <span className="gradient-brand-text">Demand Forecasting</span>
          </h1>
          <p className="text-ink-secondary text-lg max-w-2xl mx-auto mb-8">
            Machine learning models analyze historical service data, weather patterns, and regional trends to predict demand and optimize workforce allocation across cooperative networks.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { icon: <Cpu size={16} />, label: "ML Models" },
              { icon: <Database size={16} />, label: "Historical Data" },
              { icon: <Cloud size={16} />, label: "Cloud Computing" },
              { icon: <MapPin size={16} />, label: "Geo-Spatial AI" },
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-card border border-border text-xs text-ink-secondary">
                {t.icon} {t.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {AI_FEATURES.map((f, i) => (
            <div key={i} className="bg-surface-card rounded-2xl border border-border p-5 hover:border-brand-400/30 transition-colors">
              <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center text-white mb-3">{f.icon}</div>
              <h3 className="text-sm font-semibold text-ink mb-1">{f.title}</h3>
              <p className="text-xs text-ink-secondary">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Demand Chart */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-surface-card rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold text-ink flex items-center gap-2">
              <BarChart3 size={16} className="text-brand-400" /> Demand vs Supply Forecast
            </h3>
            <div className="flex gap-2">
              {["week", "month", "quarter"].map((p) => (
                <button key={p} onClick={() => setSelectedPeriod(p)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer ${selectedPeriod === p ? "gradient-brand text-white" : "bg-surface-muted text-ink-secondary"}`}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-end gap-2 h-48 mb-4">
            {DEMAND_DATA.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex gap-0.5 items-end" style={{ height: "140px" }}>
                  <div className="flex-1 rounded-t-lg bg-brand-400/60 transition-all" style={{ height: `${(d.demand / maxDemand) * 100}%` }} />
                  <div className="flex-1 rounded-t-lg bg-accent-green/60 transition-all" style={{ height: `${(d.supply / maxDemand) * 100}%` }} />
                </div>
                <span className="text-xs text-ink-muted">{d.day}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 text-xs text-ink-secondary">
            <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-brand-400/60" /> Predicted Demand</span>
            <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-accent-green/60" /> Available Supply</span>
          </div>
        </div>
      </section>

      {/* Forecast Table */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-surface-card rounded-2xl border border-border p-6">
          <h3 className="text-sm font-semibold text-ink mb-4 flex items-center gap-2">
            <Brain size={16} className="text-brand-400" /> AI Category Forecasts
          </h3>
          <div className="space-y-3">
            {FORECASTS.map((f, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-surface">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${f.trend === "up" ? "bg-accent-green/10 text-accent-green" : f.trend === "down" ? "bg-accent-pink/10 text-accent-pink" : "bg-accent-blue/10 text-accent-blue"}`}>
                    {f.trend === "up" ? <ArrowUpRight size={14} /> : f.trend === "down" ? <ArrowDownRight size={14} /> : <TrendingUp size={14} />}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-ink">{f.category}</div>
                    <div className="text-xs text-ink-secondary">{f.reason}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-bold ${f.trend === "up" ? "text-accent-green" : f.trend === "down" ? "text-accent-pink" : "text-accent-blue"}`}>{f.predicted}</div>
                  <div className="text-xs text-ink-muted">{f.confidence}% confidence</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Worker Allocation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-surface-card rounded-2xl border border-border p-6">
          <h3 className="text-sm font-semibold text-ink mb-4 flex items-center gap-2">
            <Users size={16} className="text-brand-400" /> AI Workforce Allocation
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 text-xs text-ink-muted font-medium">Worker</th>
                  <th className="text-left py-3 px-2 text-xs text-ink-muted font-medium">Area</th>
                  <th className="text-center py-3 px-2 text-xs text-ink-muted font-medium">Predicted</th>
                  <th className="text-center py-3 px-2 text-xs text-ink-muted font-medium">Allocated</th>
                  <th className="text-left py-3 px-2 text-xs text-ink-muted font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {WORKER_ALLOCATIONS.map((w, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-3 px-2">
                      <div className="font-medium text-ink">{w.worker}</div>
                      <div className="text-xs text-ink-secondary">{w.profession}</div>
                    </td>
                    <td className="py-3 px-2 text-ink-secondary flex items-center gap-1"><MapPin size={10} /> {w.area}</td>
                    <td className="py-3 px-2 text-center text-ink font-medium">{w.predicted}</td>
                    <td className="py-3 px-2 text-center text-brand-400 font-medium">{w.allocated}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${w.status === "Optimized" ? "bg-accent-green/10 text-accent-green" : w.status === "Matched" ? "bg-accent-blue/10 text-accent-blue" : "bg-accent-orange/10 text-accent-orange"}`}>{w.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-12 bg-surface-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-ink mb-6">Technology Stack</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {["Machine Learning", "Time Series Analysis", "Cloud Computing", "Geo-Spatial AI", "Real-Time Data", "Predictive Analytics", "Neural Networks", "Big Data Processing"].map((t, i) => (
              <div key={i} className="px-4 py-2 rounded-xl bg-surface-card border border-border text-sm text-ink-secondary">{t}</div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
