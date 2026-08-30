"use client";

import { useState, useMemo, useRef, useEffect, useCallback, Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Mail, MessageSquare, AlertCircle, Search,
  ChevronDown, CheckCircle, Shield, Heart,
  X, Send, LogIn, Loader2,
} from "lucide-react";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import { useAuth } from "@/contexts/AuthContext";
import { AccordionItem } from "@/components/Accordion";
import FormInput, { FormSelect, FormTextarea } from "@/components/FormInput";
import { faqs } from "@/data/workers";
import { Reveal, StaggerReveal } from "@/hooks/useScrollReveal";


function FAQSection() {
  const [search, setSearch] = useState("");
  const [openCategories, setOpenCategories] = useState<string[]>([]);

  const categories = useMemo(() => [...new Set(faqs.map((f) => f.category))], []);

  const filteredBySearch = useMemo(() => {
    if (!search.trim()) return faqs;
    const q = search.toLowerCase();
    return faqs.filter((f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q) || f.category.toLowerCase().includes(q));
  }, [search]);

  const groupedFaqs = useMemo(() => {
    const groups: Record<string, typeof faqs> = {};
    filteredBySearch.forEach((f) => { if (!groups[f.category]) groups[f.category] = []; groups[f.category].push(f); });
    return groups;
  }, [filteredBySearch]);

  const toggleCategory = (cat: string) => setOpenCategories((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]);

  return (
    <div>
      <div className="relative mb-6">
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search frequently asked questions..."
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-surface-muted text-ink text-sm placeholder-ink-muted focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 transition-all duration-200" />
      </div>
      {Object.keys(groupedFaqs).length === 0 ? (
        <div className="bg-surface-card border border-border rounded-2xl p-8 text-center">
          <Search size={32} className="text-ink-muted mx-auto mb-3" />
          <h3 className="text-lg font-bold text-ink mb-1">No results found</h3>
          <p className="text-sm text-ink-secondary">Try a different search term</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedFaqs).map(([category, items]) => (
            <div key={category}>
              <button onClick={() => toggleCategory(category)} className="w-full flex items-center justify-between p-3 rounded-xl bg-surface-card hover:bg-white/[0.02] border border-border transition-colors cursor-pointer mb-2">
                <h3 className="font-semibold text-ink">{category}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-ink-muted bg-white/5 rounded-full px-2 py-0.5">{items.length}</span>
                  <ChevronDown size={18} className={`text-ink-muted transition-transform ${openCategories.includes(category) || search ? "rotate-180" : ""}`} />
                </div>
              </button>
              {(openCategories.includes(category) || search) && <div className="space-y-2">{items.map((faq) => (<AccordionItem key={faq.id} title={faq.question}><p>{faq.answer}</p></AccordionItem>))}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ContactOptions({ onOpenComplaint, onOpenChat }: { onOpenComplaint: () => void; onOpenChat: () => void }) {
  const options = [
    { icon: Mail, title: "Email Support", desc: "Response within 24 hours", detail: "gharpe.help@gmail.com", color: "text-accent-green", action: undefined },
    { icon: MessageSquare, title: "Live Chat", desc: "Chat with our support team", detail: "Start Chat", color: "text-brand-400", action: onOpenChat },
    { icon: AlertCircle, title: "Raise a Complaint", desc: "Report issues with bookings", detail: "File Complaint", color: "text-accent-orange", action: onOpenComplaint },
  ];

  return (
    <StaggerReveal className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {options.map((opt) => (
        <div key={opt.title} className="bg-surface-card border border-border rounded-2xl p-5 hover:border-brand-500/20 transition-all duration-300 cursor-pointer" onClick={opt.action}>
          <div className={`w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center mb-3`}><opt.icon size={20} className={opt.color} /></div>
          <h3 className="font-semibold text-ink mb-1">{opt.title}</h3>
          <p className="text-sm text-ink-secondary mb-2">{opt.desc}</p>
          <p className={`text-sm font-medium ${opt.color}`}>{opt.detail}</p>
        </div>
      ))}
    </StaggerReveal>
  );
}

function ComplaintForm({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", bookingId: "", category: "", description: "" });

  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setLoading(true); await new Promise((r) => setTimeout(r, 1500)); setLoading(false); setSubmitted(true); };

  if (submitted) return (
    <div className="text-center py-8">
      <CheckCircle size={40} className="text-brand-400 mx-auto mb-3" />
      <h3 className="text-xl font-bold text-ink mb-2">Complaint Submitted</h3>
      <p className="text-sm text-ink-secondary mb-4">Our team will review and respond within 48 hours.</p>
      <p className="text-xs text-ink-muted">Ref: CMP-{Math.random().toString(36).substring(2, 8).toUpperCase()}</p>
      <Button onClick={onClose} className="mt-6" variant="primary">Close</Button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormInput label="Your Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter your name" required />
      <FormInput label="Booking ID" value={form.bookingId} onChange={(e) => setForm({ ...form, bookingId: e.target.value })} placeholder="e.g., GP-A3B2C1" />
      <FormSelect label="Issue Category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} options={[{value:"service-quality",label:"Service Quality"},{value:"worker-conduct",label:"Worker Conduct"},{value:"pricing",label:"Pricing Dispute"},{value:"safety",label:"Safety Concern"},{value:"cancellation",label:"Cancellation/Refund"},{value:"other",label:"Other"}]} placeholder="Select category" required />
      <FormTextarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the issue..." required />
      <Button type="submit" loading={loading} className="w-full" disabled={!form.name || !form.category || !form.description}>Submit Complaint</Button>
    </form>
  );
}

const MAX_MSG_LEN = 2000;

/** Simple HMAC-SHA256 signing via Web Crypto (browser-compatible) */
async function signPayload(payload: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

type Msg = { from: "bot" | "user" | "system"; text: string };

function ChatWidget({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [lastSentAt, setLastSentAt] = useState(0);
  const [hasSentFirstMessage, setHasSentFirstMessage] = useState(false);

  // Initialize welcome message when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        { from: "bot", text: "Hello! How can we help you today? 👋" },
      ]);
    }
  }, [isOpen, messages.length]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || sending) return;
    setError("");

    // Auth check
    if (!user) {
      setError("Please sign in to contact support.");
      return;
    }

    // Validate
    if (text.length > MAX_MSG_LEN) {
      setError(`Message must be under ${MAX_MSG_LEN} characters.`);
      return;
    }

    // Anti-spam: 3 second cooldown between sends
    const now = Date.now();
    if (now - lastSentAt < 3000) {
      setError("Please wait a few seconds before sending another message.");
      return;
    }

    // Add user message to chat
    setMessages((prev) => [...prev, { from: "user", text }]);
    setInput("");
    setSending(true);
    setLastSentAt(now);

    try {
      const timestamp = String(Date.now());
      const secret = "gharpe-support-hmac-secret-2026"; // Must match SUPPORT_HMAC_SECRET in .env.local
      const payload = `${user.name}:${user.email}:${text}:${timestamp}`;
      const signature = await signPayload(payload, secret);

      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          userName: user.name,
          userEmail: user.email,
          timestamp,
          signature,
          pageUrl: pathname,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send message.");
      }

      // Show auto-response with support info after first message only
      if (!hasSentFirstMessage) {
        setHasSentFirstMessage(true);
        setMessages((prev) => [
          ...prev,
          { from: "bot", text: "Hello! Thanks for contacting GharPe Support. 👋\n\nFor immediate assistance, please call us at 8017273136 or email us at gharpe.help@gmail.com.\n\nWe will get back to you immediately." },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { from: "bot", text: "Message sent successfully! Our support team will get back to you soon." },
        ]);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(msg);
      setMessages((prev) => [
        ...prev,
        { from: "system", text: `⚠️ ${msg}` },
      ]);
    } finally {
      setSending(false);
    }
  }, [input, sending, user, lastSentAt, pathname]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-50 w-auto sm:w-80 bg-surface-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh]">
      {/* Header */}
      <div className="gradient-brand text-white p-3 sm:p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2"><MessageSquare size={18} /><span className="font-semibold text-sm">GharPe Support</span></div>
        <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg cursor-pointer" aria-label="Close chat"><X size={16} /></button>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 h-56 sm:h-64 overflow-y-auto p-3 space-y-2 bg-surface-alt">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
              msg.from === "user"
                ? "gradient-brand text-white rounded-br-none"
                : msg.from === "system"
                  ? "bg-accent-pink/10 border border-accent-pink/20 text-accent-pink rounded-bl-none text-xs"
                  : "bg-surface-card border border-border text-ink rounded-bl-none"
            }`}>{msg.text}</div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="bg-surface-card border border-border rounded-xl rounded-bl-none px-3 py-2 flex items-center gap-2 text-sm text-ink-muted">
              <Loader2 size={14} className="animate-spin" /> Sending...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-3 border-t border-border shrink-0">
        {!user ? (
          <div className="text-center">
            <p className="text-xs text-ink-muted mb-2">Sign in to contact support</p>
            <button
              onClick={() => { onClose(); router.push("/login"); }}
              className="w-full gradient-brand text-white text-sm font-medium py-2 rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all cursor-pointer"
            ><LogIn size={14} /> Sign In</button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => { setInput(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder="Type your message..."
              disabled={sending}
              maxLength={MAX_MSG_LEN}
              className="flex-1 px-3 py-2 text-sm border border-border rounded-xl bg-surface-muted text-ink placeholder-ink-muted focus:outline-none focus:border-brand-400 disabled:opacity-50"
            />
            <button
              onClick={sendMessage}
              disabled={sending || !input.trim()}
              className="gradient-brand p-2 text-white rounded-xl hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0 min-w-[36px] min-h-[36px] flex items-center justify-center"
              aria-label="Send"
            >{sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}</button>
          </div>
        )}
        {error && user && <p className="text-xs text-accent-pink mt-1.5 px-1">{error}</p>}
        {user && <p className="text-[10px] text-ink-muted mt-1 px-1">{input.length}/{MAX_MSG_LEN}</p>}
      </div>
    </div>
  );
}

function WorkerWelfare() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-surface-card border border-border rounded-2xl p-6 md:p-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center shrink-0"><Shield size={24} className="text-brand-400" /></div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-ink mb-2">Worker Welfare & Insurance</h3>
          <p className="text-sm text-ink-secondary leading-relaxed">Every worker on GharPe is covered under the cooperative&apos;s welfare scheme — accident insurance, health coverage, and workmen&apos;s compensation.</p>
          <button onClick={() => setExpanded(!expanded)} className="mt-3 flex items-center gap-1 text-sm font-medium text-brand-400 hover:text-brand-300 cursor-pointer">
            Learn More <ChevronDown size={16} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
          </button>
          {expanded && (
            <div className="mt-4 space-y-3 text-sm text-ink-secondary leading-relaxed border-t border-border pt-4">
              <div className="flex items-start gap-3"><Heart size={16} className="text-accent-pink mt-0.5 shrink-0" /><div><strong className="text-ink">Accident Insurance:</strong> Coverage up to ₹5 lakhs for work-related accidents.</div></div>
              <div className="flex items-start gap-3"><Heart size={16} className="text-accent-pink mt-0.5 shrink-0" /><div><strong className="text-ink">Health Coverage:</strong> Annual insurance covering hospitalization and preventive checkups for worker and family.</div></div>
              <div className="flex items-start gap-3"><Heart size={16} className="text-accent-pink mt-0.5 shrink-0" /><div><strong className="text-ink">Workmen&apos;s Compensation:</strong> Compensation for workplace injuries, managed by the cooperative.</div></div>
              <p className="text-ink-muted text-xs mt-2">*Coverage varies by federation. Contact your society for details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function HelpPageContent() {
  const searchParams = useSearchParams();
  const [complaintOpen, setComplaintOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(() => searchParams.get("chat") === "1");

  return (
    <>
      <section className="relative overflow-hidden py-10 md:py-14">
        <div className="absolute inset-0 bg-[#08090D]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(124,58,237,0.1)_0%,transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-3 tracking-tight"><span className="text-ink">Help </span><span className="shimmer-text">& Support</span></h1>
          <p className="text-ink-secondary max-w-xl mx-auto">Find answers to common questions or reach out to our support team</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-surface-alt to-transparent" />
      </section>

      <section className="py-10 md:py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <Reveal><div><h2 className="text-2xl font-bold text-ink mb-6">Contact Options</h2><ContactOptions onOpenComplaint={() => setComplaintOpen(true)} onOpenChat={() => setChatOpen(true)} /></div></Reveal>
          <Reveal><div><h2 className="text-2xl font-bold text-ink mb-6">Frequently Asked Questions</h2><FAQSection /></div></Reveal>
          <Reveal><WorkerWelfare /></Reveal>
        </div>
      </section>

      {complaintOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-md" onClick={(e) => { if (e.target === e.currentTarget) setComplaintOpen(false); }}>
          <div className="bg-surface-card border border-border rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border sticky top-0 bg-surface-card z-10"><h2 className="text-lg sm:text-xl font-bold text-ink">Raise a Complaint</h2><button onClick={() => setComplaintOpen(false)} className="p-2 rounded-lg hover:bg-white/5 text-ink-muted hover:text-ink cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label="Close"><X size={20} /></button></div>
            <div className="p-4 sm:p-5"><ComplaintForm onClose={() => setComplaintOpen(false)} /></div>
          </div>
        </div>
      )}
      <ChatWidget isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
}

export default function HelpPage() {
  return (
    <Suspense fallback={null}>
      <HelpPageContent />
    </Suspense>
  );
}
