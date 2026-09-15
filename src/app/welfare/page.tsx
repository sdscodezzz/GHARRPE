"use client";

import { useState } from "react";
import { Shield, Heart, Umbrella, Stethoscope, GraduationCap, HandCoins, CheckCircle2, ChevronRight, AlertTriangle, Clock, Users, TrendingUp, Award } from "lucide-react";

const WELFARE_PROGRAMS = [
  { icon: <Shield size={24} />, title: "Group Insurance", desc: "All registered workers covered under cooperative group insurance at no extra cost.", coverage: "Up to ₹5 Lakhs", status: "Active" },
  { icon: <Stethoscope size={24} />, title: "Health Coverage", desc: "Cashless medical treatment at network hospitals for workers and their families.", coverage: "₹2 Lakhs/year", status: "Active" },
  { icon: <Umbrella size={24} />, title: "Accident Protection", desc: "Coverage for work-related accidents including disability and temporary income loss.", coverage: "Up to ₹3 Lakhs", status: "Active" },
  { icon: <GraduationCap size={24} />, title: "Skill Development", desc: "Free training programs for upskilling, certification, and career advancement.", coverage: "Unlimited", status: "Enrolling" },
  { icon: <HandCoins size={24} />, title: "Emergency Fund", desc: "Quick-disbursal emergency financial assistance for registered cooperative workers.", coverage: "Up to ₹50,000", status: "Active" },
  { icon: <Heart size={24} />, title: "Pension Plan", desc: "Contributory pension scheme for long-term financial security after retirement.", coverage: "₹3,000/month", status: "Active" },
];

const INSURANCE_CLAIMS = [
  { id: "CLM-001", type: "Health", date: "2026-08-15", amount: 15000, status: "Approved", worker: "Rajesh K." },
  { id: "CLM-002", type: "Accident", date: "2026-07-20", amount: 45000, status: "Processing", worker: "Sunita D." },
  { id: "CLM-003", type: "Health", date: "2026-06-10", amount: 8500, status: "Approved", worker: "Arjun M." },
];

export default function WelfarePage() {
  const [activeTab, setActiveTab] = useState<"programs" | "insurance" | "claims">("programs");

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero */}
      <section className="py-12 sm:py-16 bg-surface relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-80 h-80 bg-accent-pink/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-pink/10 border border-accent-pink/20 text-accent-pink text-sm font-medium mb-6">
            <Heart size={16} />
            Worker Welfare
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink mb-4">
            Worker <span className="gradient-brand-text">Welfare & Insurance</span>
          </h1>
          <p className="text-ink-secondary text-lg max-w-2xl mx-auto">
            Every cooperative worker receives comprehensive welfare benefits including insurance, health coverage, skill development, and pension — at no extra cost.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Workers Insured", value: "500+", icon: <Shield size={20} />, color: "text-brand-400" },
            { label: "Claims Settled", value: "98%", icon: <CheckCircle2 size={20} />, color: "text-accent-green" },
            { label: "Total Coverage", value: "₹50L+", icon: <TrendingUp size={20} />, color: "text-accent-blue" },
            { label: "Training Hours", value: "2,400+", icon: <GraduationCap size={20} />, color: "text-accent-orange" },
          ].map((stat, i) => (
            <div key={i} className="bg-surface-card rounded-2xl border border-border p-4 text-center">
              <div className={`${stat.color} mb-2 flex justify-center`}>{stat.icon}</div>
              <div className="text-xl font-bold text-ink">{stat.value}</div>
              <div className="text-xs text-ink-secondary">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-2 mb-6 bg-surface-card rounded-xl border border-border p-1 overflow-x-auto">
          {[
            { key: "programs" as const, label: "Welfare Programs" },
            { key: "insurance" as const, label: "Insurance Coverage" },
            { key: "claims" as const, label: "Claims History" },
          ].map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${activeTab === tab.key ? "gradient-brand text-white" : "text-ink-secondary hover:text-ink"}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "programs" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {WELFARE_PROGRAMS.map((prog, i) => (
              <div key={i} className="bg-surface-card rounded-2xl border border-border p-6 hover:border-brand-400/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center text-white">{prog.icon}</div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${prog.status === "Active" ? "bg-accent-green/10 text-accent-green" : "bg-accent-orange/10 text-accent-orange"}`}>{prog.status}</span>
                </div>
                <h3 className="text-sm font-semibold text-ink mb-1">{prog.title}</h3>
                <p className="text-xs text-ink-secondary mb-3">{prog.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-ink-muted">Coverage: <span className="text-brand-400 font-medium">{prog.coverage}</span></span>
                  <ChevronRight size={14} className="text-ink-muted" />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "insurance" && (
          <div className="bg-surface-card rounded-2xl border border-border p-6">
            <h3 className="text-lg font-bold text-ink mb-4">Insurance Coverage Summary</h3>
            <div className="space-y-4">
              {[
                { type: "Group Life Insurance", provider: "National Insurance Co.", policyNo: "GRP-GP-2026-001", coverage: "₹5,00,000", premium: "Cooperative Paid", status: "Active" },
                { type: "Health Insurance", provider: "Star Health", policyNo: "HLT-GP-2026-002", coverage: "₹2,00,000/year", premium: "Cooperative Paid", status: "Active" },
                { type: "Accident Cover", provider: "New India Assurance", policyNo: "ACC-GP-2026-003", coverage: "₹3,00,000", premium: "Cooperative Paid", status: "Active" },
              ].map((policy, i) => (
                <div key={i} className="p-4 rounded-xl bg-surface border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-ink">{policy.type}</span>
                    <span className="px-2 py-0.5 rounded-full bg-accent-green/10 text-accent-green text-xs font-medium">{policy.status}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div><span className="text-ink-muted block">Provider</span><span className="text-ink">{policy.provider}</span></div>
                    <div><span className="text-ink-muted block">Policy No.</span><span className="text-ink">{policy.policyNo}</span></div>
                    <div><span className="text-ink-muted block">Coverage</span><span className="text-brand-400 font-medium">{policy.coverage}</span></div>
                    <div><span className="text-ink-muted block">Premium</span><span className="text-ink">{policy.premium}</span></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-xl bg-accent-orange/10 border border-accent-orange/20">
              <div className="flex items-start gap-2">
                <AlertTriangle size={16} className="text-accent-orange mt-0.5 shrink-0" />
                <div className="text-xs text-ink-secondary">
                  <span className="font-medium text-ink">Note:</span> All insurance premiums are paid by the cooperative federation. Workers do not contribute any amount toward insurance coverage.
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "claims" && (
          <div className="space-y-3">
            {INSURANCE_CLAIMS.map((claim) => (
              <div key={claim.id} className="bg-surface-card rounded-2xl border border-border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${claim.status === "Approved" ? "bg-accent-green/10 text-accent-green" : "bg-accent-orange/10 text-accent-orange"}`}>
                      <Shield size={18} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-ink">{claim.type} Claim</div>
                      <div className="text-xs text-ink-secondary">{claim.worker} • {claim.id}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-ink">₹{claim.amount.toLocaleString()}</div>
                    <div className={`text-xs font-medium ${claim.status === "Approved" ? "text-accent-green" : "text-accent-orange"}`}>{claim.status}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
