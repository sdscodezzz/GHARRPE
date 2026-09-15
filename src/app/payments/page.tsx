"use client";

import { useState } from "react";
import { CreditCard, Smartphone, Building2, Wallet, CheckCircle2, ArrowRight, Receipt, Shield, Clock, Download, IndianRupee, TrendingUp, FileText, AlertCircle } from "lucide-react";

const MOCK_INVOICES = [
  { id: "INV-2026-001", worker: "Rajesh Kumar Singh", service: "Electrical Wiring", date: "2026-09-10", amount: 2800, status: "paid", paymentMethod: "UPI" },
  { id: "INV-2026-002", worker: "Sunita Devi Sharma", service: "Pipe Repair", date: "2026-09-08", amount: 1500, status: "paid", paymentMethod: "Card" },
  { id: "INV-2026-003", worker: "Arjun Menon", service: "Furniture Assembly", date: "2026-09-05", amount: 4500, status: "pending", paymentMethod: "UPI" },
  { id: "INV-2026-004", worker: "Priya Nair", service: "Interior Painting", date: "2026-09-01", amount: 8200, status: "paid", paymentMethod: "Net Banking" },
  { id: "INV-2026-005", worker: "Meena Kumari", service: "House Cleaning", date: "2026-08-28", amount: 1200, status: "refunded", paymentMethod: "UPI" },
];

const PAYMENT_METHODS = [
  { icon: <Smartphone size={24} />, name: "UPI", desc: "Google Pay, PhonePe, Paytm", popular: true },
  { icon: <CreditCard size={24} />, name: "Credit/Debit Card", desc: "Visa, Mastercard, RuPay" },
  { icon: <Building2 size={24} />, name: "Net Banking", desc: "All major banks supported" },
  { icon: <Wallet size={24} />, name: "GharPe Wallet", desc: "Pay from your wallet balance" },
];

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "invoices" | "methods">("overview");
  const [selectedInvoice, setSelectedInvoice] = useState<typeof MOCK_INVOICES[0] | null>(null);

  const totalPaid = MOCK_INVOICES.filter(i => i.status === "paid").reduce((s, i) => s + i.amount, 0);
  const pendingAmount = MOCK_INVOICES.filter(i => i.status === "pending").reduce((s, i) => s + i.amount, 0);

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero */}
      <section className="py-12 sm:py-16 bg-surface relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 right-20 w-80 h-80 bg-accent-green/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-green/10 border border-accent-green/20 text-accent-green text-sm font-medium mb-6">
            <CreditCard size={16} />
            Digital Payment Systems
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink mb-4">
            Secure <span className="gradient-brand-text">Digital Payments</span>
          </h1>
          <p className="text-ink-secondary text-lg max-w-2xl mx-auto">
            Pay seamlessly through UPI, cards, net banking, or wallet. Every transaction is secure, transparent, and generates an instant digital invoice.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Paid", value: `₹${totalPaid.toLocaleString()}`, icon: <IndianRupee size={20} />, color: "text-accent-green" },
            { label: "Pending", value: `₹${pendingAmount.toLocaleString()}`, icon: <Clock size={20} />, color: "text-accent-orange" },
            { label: "Transactions", value: MOCK_INVOICES.length.toString(), icon: <TrendingUp size={20} />, color: "text-brand-400" },
            { label: "Invoices Generated", value: MOCK_INVOICES.length.toString(), icon: <Receipt size={20} />, color: "text-accent-blue" },
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
            { key: "overview" as const, label: "Payment Overview" },
            { key: "invoices" as const, label: "Invoices" },
            { key: "methods" as const, label: "Payment Methods" },
          ].map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${activeTab === tab.key ? "gradient-brand text-white" : "text-ink-secondary hover:text-ink"}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payment Flow */}
            <div className="bg-surface-card rounded-2xl border border-border p-6">
              <h3 className="text-lg font-bold text-ink mb-4">How Payments Work</h3>
              <div className="space-y-4">
                {[
                  { step: "1", title: "Book a Service", desc: "Select a worker and confirm your booking with upfront pricing." },
                  { step: "2", title: "Service Completed", desc: "Worker completes the service. You review the work." },
                  { step: "3", title: "Choose Payment", desc: "Select UPI, card, net banking, or wallet to pay." },
                  { step: "4", title: "Instant Invoice", desc: "Receive a digital invoice automatically. Payment processed securely." },
                ].map((s, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center text-white text-sm font-bold shrink-0">{s.step}</div>
                    <div>
                      <div className="text-sm font-semibold text-ink">{s.title}</div>
                      <div className="text-xs text-ink-secondary">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Features */}
            <div className="bg-surface-card rounded-2xl border border-border p-6">
              <h3 className="text-lg font-bold text-ink mb-4">Security & Trust</h3>
              <div className="space-y-3">
                {[
                  { icon: <Shield size={18} />, title: "256-bit Encryption", desc: "All transactions are encrypted end-to-end." },
                  { icon: <CheckCircle2 size={18} />, title: "PCI DSS Compliant", desc: "Meet international payment security standards." },
                  { icon: <Receipt size={18} />, title: "Auto Invoicing", desc: "Digital invoices generated for every transaction." },
                  { icon: <AlertCircle size={18} />, title: "Dispute Resolution", desc: "Fair mediation for any payment disagreements." },
                ].map((f, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-surface">
                    <div className="text-brand-400 mt-0.5">{f.icon}</div>
                    <div>
                      <div className="text-sm font-medium text-ink">{f.title}</div>
                      <div className="text-xs text-ink-secondary">{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "invoices" && (
          <div className="space-y-4">
            {MOCK_INVOICES.map((inv) => (
              <div key={inv.id} onClick={() => setSelectedInvoice(selectedInvoice?.id === inv.id ? null : inv)}
                className={`bg-surface-card rounded-2xl border p-4 cursor-pointer transition-all ${selectedInvoice?.id === inv.id ? "border-brand-400" : "border-border hover:border-border-hover"}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400">
                      <FileText size={18} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-ink">{inv.service}</div>
                      <div className="text-xs text-ink-secondary">with {inv.worker}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-ink">₹{inv.amount.toLocaleString()}</div>
                    <div className={`text-xs font-medium ${inv.status === "paid" ? "text-accent-green" : inv.status === "pending" ? "text-accent-orange" : "text-accent-pink"}`}>
                      {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                    </div>
                  </div>
                </div>
                {selectedInvoice?.id === inv.id && (
                  <div className="mt-4 pt-4 border-t border-border animate-fade-in-up" style={{ animationDuration: "0.2s" }}>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div><span className="text-ink-muted">Invoice ID:</span> <span className="text-ink font-medium">{inv.id}</span></div>
                      <div><span className="text-ink-muted">Date:</span> <span className="text-ink font-medium">{inv.date}</span></div>
                      <div><span className="text-ink-muted">Payment:</span> <span className="text-ink font-medium">{inv.paymentMethod}</span></div>
                      <div><span className="text-ink-muted">Worker:</span> <span className="text-ink font-medium">{inv.worker}</span></div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-500/10 text-brand-400 text-xs font-medium hover:bg-brand-500/20 cursor-pointer">
                        <Download size={12} /> Download Invoice
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "methods" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PAYMENT_METHODS.map((method, i) => (
              <div key={i} className={`bg-surface-card rounded-2xl border p-6 text-center relative ${method.popular ? "border-brand-400" : "border-border"}`}>
                {method.popular && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full gradient-brand text-white text-xs font-medium">Popular</div>
                )}
                <div className="w-14 h-14 rounded-2xl gradient-brand flex items-center justify-center text-white mx-auto mb-3">{method.icon}</div>
                <div className="text-sm font-semibold text-ink mb-1">{method.name}</div>
                <div className="text-xs text-ink-secondary">{method.desc}</div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
