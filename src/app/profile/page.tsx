"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { User, Mail, Phone, MapPin, Calendar, Briefcase, Star, Clock, CheckCircle2, XCircle, ChevronRight, Edit3, LogOut, Shield, Award, Settings, Package, TrendingUp, CreditCard, Camera, Save, X } from "lucide-react";

interface OrderDisplay {
  id: string;
  worker: string;
  profession: string;
  service: string;
  date: string;
  amount: number;
  rating: number;
  status: "completed" | "upcoming" | "cancelled";
}

const MOCK_COMPLETED_ORDERS: OrderDisplay[] = [
  { id: "ORD-001", worker: "Rajesh Kumar Singh", profession: "Electrician", service: "Electrical Wiring", date: "2026-09-10", amount: 2800, rating: 5, status: "completed" },
  { id: "ORD-002", worker: "Sunita Devi Sharma", profession: "Plumber", service: "Pipe Repair", date: "2026-09-08", amount: 1500, rating: 4, status: "completed" },
  { id: "ORD-003", worker: "Arjun Menon", profession: "Carpenter", service: "Furniture Assembly", date: "2026-09-05", amount: 4500, rating: 5, status: "completed" },
];

// ── Settings Tab with fully functional modals ──
function SettingsTab({ user, updateProfile, handleLogout }: { user: any; updateProfile: (u: any) => void; handleLogout: () => void }) {
  const router = useRouter();
  const [modal, setModal] = useState<
    | null
    | "password"
    | "notifications"
    | "privacy"
    | "linked"
    | "2fa"
    | "login-history"
    | "sessions"
    | "delete"
  >(null);
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
  const [pwSaved, setPwSaved] = useState(false);
  const [notifs, setNotifs] = useState({ email: true, push: false, sms: false, bookingUpdates: true, promotions: false, weeklyDigest: true });
  const [privacy, setPrivacy] = useState({ profileVisible: true, phoneVisible: false, addressVisible: false, activityVisible: true });
  const [twoFA, setTwoFA] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  const loginHistory = [
    { device: "Chrome on macOS", ip: "192.168.1.***", time: "2 minutes ago", current: true },
    { device: "Safari on iPhone", ip: "10.0.0.***", time: "3 hours ago", current: false },
    { device: "Chrome on Windows", ip: "172.16.0.***", time: "Yesterday, 9:15 PM", current: false },
    { device: "Firefox on Linux", ip: "192.168.2.***", time: "Sep 10, 2026", current: false },
  ];

  const activeSessions = [
    { device: "MacBook Pro — Chrome", location: "Mumbai, India", lastActive: "Now", current: true },
    { device: "iPhone 15 — Safari", location: "Mumbai, India", lastActive: "3 hours ago", current: false },
  ];

  const Toggle = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button onClick={onToggle}
      className={`relative inline-flex items-center rounded-full transition-colors duration-200 cursor-pointer ${enabled ? "bg-brand-400" : "bg-border"}`}
      style={{ width: '40px', height: '22px', minHeight: '22px' }}>
      <span className={`inline-block h-[18px] w-[18px] rounded-full bg-white shadow-sm transition-transform duration-200 ${enabled ? "translate-x-[20px]" : "translate-x-[2px]"}`} />
    </button>
  );

  const ModalWrapper = ({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-surface-card rounded-2xl border border-border p-6 w-full max-w-md max-h-[85vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-ink">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-surface-muted cursor-pointer"><X size={18} className="text-ink-muted" /></button>
        </div>
        {children}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Account Settings */}
      <div className="bg-surface-card rounded-2xl border border-border p-6">
        <h3 className="text-sm font-semibold text-ink mb-4 flex items-center gap-2"><Settings size={16} className="text-brand-400" /> Account Settings</h3>
        <div className="space-y-3">
          <button onClick={() => setModal("password")} className="w-full flex items-center justify-between p-3 rounded-xl bg-surface hover:bg-surface-alt transition-colors cursor-pointer">
            <div className="text-left"><div className="text-sm font-medium text-ink">Change Password</div><div className="text-xs text-ink-secondary">Update your account password</div></div>
            <ChevronRight size={16} className="text-ink-muted" />
          </button>
          <button onClick={() => setModal("notifications")} className="w-full flex items-center justify-between p-3 rounded-xl bg-surface hover:bg-surface-alt transition-colors cursor-pointer">
            <div className="text-left"><div className="text-sm font-medium text-ink">Notification Preferences</div><div className="text-xs text-ink-secondary">Manage email and push notifications</div></div>
            <ChevronRight size={16} className="text-ink-muted" />
          </button>
          <button onClick={() => setModal("privacy")} className="w-full flex items-center justify-between p-3 rounded-xl bg-surface hover:bg-surface-alt transition-colors cursor-pointer">
            <div className="text-left"><div className="text-sm font-medium text-ink">Privacy Settings</div><div className="text-xs text-ink-secondary">Control who can see your profile</div></div>
            <ChevronRight size={16} className="text-ink-muted" />
          </button>
          <button onClick={() => setModal("linked")} className="w-full flex items-center justify-between p-3 rounded-xl bg-surface hover:bg-surface-alt transition-colors cursor-pointer">
            <div className="text-left"><div className="text-sm font-medium text-ink">Linked Accounts</div><div className="text-xs text-ink-secondary">Manage connected social accounts</div></div>
            <ChevronRight size={16} className="text-ink-muted" />
          </button>
        </div>
      </div>

      {/* Security */}
      <div className="bg-surface-card rounded-2xl border border-border p-6">
        <h3 className="text-sm font-semibold text-ink mb-4 flex items-center gap-2"><Shield size={16} className="text-accent-green" /> Security</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-surface">
            <div><div className="text-sm font-medium text-ink">Two-Factor Authentication</div><div className="text-xs text-ink-secondary">Add an extra layer of security</div></div>
            <Toggle enabled={twoFA} onToggle={() => setTwoFA(!twoFA)} />
          </div>
          <button onClick={() => setModal("login-history")} className="w-full flex items-center justify-between p-3 rounded-xl bg-surface hover:bg-surface-alt transition-colors cursor-pointer">
            <div className="text-left"><div className="text-sm font-medium text-ink">Login History</div><div className="text-xs text-ink-secondary">View recent login activity</div></div>
            <ChevronRight size={16} className="text-ink-muted" />
          </button>
          <button onClick={() => setModal("sessions")} className="w-full flex items-center justify-between p-3 rounded-xl bg-surface hover:bg-surface-alt transition-colors cursor-pointer">
            <div className="text-left"><div className="text-sm font-medium text-ink">Active Sessions</div><div className="text-xs text-ink-secondary">Manage devices where you're logged in</div></div>
            <ChevronRight size={16} className="text-ink-muted" />
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-surface-card rounded-2xl border border-accent-pink/20 p-6">
        <h3 className="text-sm font-semibold text-accent-pink mb-2">Danger Zone</h3>
        <p className="text-xs text-ink-secondary mb-4">Permanently delete your account and all associated data.</p>
        <button onClick={() => setModal("delete")} className="px-4 py-2 rounded-xl border border-accent-pink/30 text-accent-pink text-sm font-medium cursor-pointer hover:bg-accent-pink/10">Delete Account</button>
      </div>

      <button onClick={handleLogout} className="w-full px-4 py-3 rounded-xl bg-accent-pink/10 text-accent-pink text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer hover:bg-accent-pink/20 transition-colors">
        <LogOut size={16} /> Sign Out
      </button>

      {/* ── Change Password Modal ── */}
      {modal === "password" && (
        <ModalWrapper title="Change Password" onClose={() => { setModal(null); setPwSaved(false); }}>
          {pwSaved ? (
            <div className="text-center py-6"><CheckCircle2 size={48} className="text-accent-green mx-auto mb-3" /><p className="text-sm font-semibold text-ink">Password updated successfully!</p></div>
          ) : (
            <div className="space-y-4">
              <div><label className="text-xs text-ink-secondary mb-1 block">Current Password</label>
                <input type="password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-ink text-sm outline-none focus:border-brand-400" /></div>
              <div><label className="text-xs text-ink-secondary mb-1 block">New Password</label>
                <input type="password" value={passwords.newPass} onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-ink text-sm outline-none focus:border-brand-400" /></div>
              <div><label className="text-xs text-ink-secondary mb-1 block">Confirm New Password</label>
                <input type="password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-ink text-sm outline-none focus:border-brand-400" /></div>
              <button onClick={() => { if (passwords.current && passwords.newPass && passwords.newPass === passwords.confirm) setPwSaved(true); }} className="w-full px-4 py-2.5 rounded-xl gradient-brand text-white text-sm font-semibold cursor-pointer hover:opacity-90">Update Password</button>
            </div>
          )}
        </ModalWrapper>
      )}

      {/* ── Notification Preferences Modal ── */}
      {modal === "notifications" && (
        <ModalWrapper title="Notification Preferences" onClose={() => setModal(null)}>
          <div className="space-y-4">
            {([
              ["email", "Email Notifications", "Receive updates via email"],
              ["push", "Push Notifications", "Browser push alerts"],
              ["sms", "SMS Notifications", "Text message alerts"],
              ["bookingUpdates", "Booking Updates", "Status changes for your bookings"],
              ["promotions", "Promotions", "Deals and special offers"],
              ["weeklyDigest", "Weekly Digest", "Summary of platform activity"],
            ] as const).map(([key, label, desc]) => (
              <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-surface">
                <div><div className="text-sm font-medium text-ink">{label}</div><div className="text-xs text-ink-secondary">{desc}</div></div>
                <Toggle enabled={notifs[key]} onToggle={() => setNotifs({ ...notifs, [key]: !notifs[key] })} />
              </div>
            ))}
          </div>
        </ModalWrapper>
      )}

      {/* ── Privacy Settings Modal ── */}
      {modal === "privacy" && (
        <ModalWrapper title="Privacy Settings" onClose={() => setModal(null)}>
          <div className="space-y-4">
            {([
              ["profileVisible", "Profile Visible", "Others can see your profile"],
              ["phoneVisible", "Phone Visible", "Show phone number to workers"],
              ["addressVisible", "Address Visible", "Show address in bookings"],
              ["activityVisible", "Activity Visible", "Show booking history on profile"],
            ] as const).map(([key, label, desc]) => (
              <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-surface">
                <div><div className="text-sm font-medium text-ink">{label}</div><div className="text-xs text-ink-secondary">{desc}</div></div>
                <Toggle enabled={privacy[key]} onToggle={() => setPrivacy({ ...privacy, [key]: !privacy[key] })} />
              </div>
            ))}
          </div>
        </ModalWrapper>
      )}

      {/* ── Linked Accounts Modal ── */}
      {modal === "linked" && (
        <ModalWrapper title="Linked Accounts" onClose={() => setModal(null)}>
          <div className="space-y-3">
            {[{ name: "Google", icon: "G", connected: true }, { name: "Facebook", icon: "f", connected: false }, { name: "Apple", icon: "🍎", connected: false }].map((acc) => (
              <div key={acc.name} className="flex items-center justify-between p-3 rounded-xl bg-surface">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-muted flex items-center justify-center text-ink font-bold text-sm">{acc.icon}</div>
                  <div><div className="text-sm font-medium text-ink">{acc.name}</div><div className="text-xs text-ink-secondary">{acc.connected ? "Connected" : "Not connected"}</div></div>
                </div>
                <button className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${acc.connected ? "bg-accent-green/10 text-accent-green" : "bg-brand-500/10 text-brand-400 hover:bg-brand-500/20"}`}>
                  {acc.connected ? "Connected" : "Connect"}
                </button>
              </div>
            ))}
          </div>
        </ModalWrapper>
      )}

      {/* ── Login History Modal ── */}
      {modal === "login-history" && (
        <ModalWrapper title="Login History" onClose={() => setModal(null)}>
          <div className="space-y-3">
            {loginHistory.map((login, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-surface">
                <div>
                  <div className="text-sm font-medium text-ink flex items-center gap-2">{login.device} {login.current && <span className="px-1.5 py-0.5 rounded bg-accent-green/10 text-accent-green text-[10px]">Current</span>}</div>
                  <div className="text-xs text-ink-secondary">{login.ip} • {login.time}</div>
                </div>
                {!login.current && <button className="text-xs text-accent-pink cursor-pointer hover:underline">Revoke</button>}
              </div>
            ))}
          </div>
        </ModalWrapper>
      )}

      {/* ── Active Sessions Modal ── */}
      {modal === "sessions" && (
        <ModalWrapper title="Active Sessions" onClose={() => setModal(null)}>
          <div className="space-y-3">
            {activeSessions.map((s, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-surface">
                <div>
                  <div className="text-sm font-medium text-ink flex items-center gap-2">{s.device} {s.current && <span className="px-1.5 py-0.5 rounded bg-accent-green/10 text-accent-green text-[10px]">This Device</span>}</div>
                  <div className="text-xs text-ink-secondary">{s.location} • Last active: {s.lastActive}</div>
                </div>
                {!s.current && <button className="text-xs text-accent-pink cursor-pointer hover:underline">Terminate</button>}
              </div>
            ))}
          </div>
        </ModalWrapper>
      )}

      {/* ── Delete Account Modal ── */}
      {modal === "delete" && (
        <ModalWrapper title="Delete Account" onClose={() => { setModal(null); setDeleteConfirm(""); }}>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-accent-pink/10 border border-accent-pink/20">
              <p className="text-sm text-ink font-medium mb-1">This action is permanent and cannot be undone.</p>
              <p className="text-xs text-ink-secondary">All your data, bookings, and profile information will be permanently deleted.</p>
            </div>
            <div><label className="text-xs text-ink-secondary mb-1 block">Type <span className="font-bold text-ink">DELETE</span> to confirm</label>
              <input type="text" value={deleteConfirm} onChange={(e) => setDeleteConfirm(e.target.value)} placeholder="DELETE" className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-ink text-sm outline-none focus:border-accent-pink" /></div>
            <button disabled={deleteConfirm !== "DELETE"} onClick={() => { localStorage.clear(); router.push("/"); }} className="w-full px-4 py-2.5 rounded-xl bg-accent-pink text-white text-sm font-semibold cursor-pointer hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed">Permanently Delete Account</button>
          </div>
        </ModalWrapper>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, logout, bookings, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "bookings" | "history" | "settings">("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", phone: "", address: "" });

  // Redirect if not logged in (only after loading is complete)
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  // Initialize edit form when user data loads
  useEffect(() => {
    if (user) {
      setEditForm({ name: user.name, phone: user.phone || "", address: user.address || "" });
    }
  }, [user]);

  if (isLoading) return null;
  if (!user) return null;

  const upcomingBookings = bookings.filter((b) => b.status === "upcoming");
  const completedBookings = bookings.filter((b) => b.status === "completed");
  const cancelledBookings = bookings.filter((b) => b.status === "cancelled");
  const mappedBookings: OrderDisplay[] = completedBookings.map((b) => ({
    id: b.id, worker: b.workerName, profession: b.workerProfession, service: b.workerProfession + " Service",
    date: b.date, amount: b.price, rating: 5, status: "completed",
  }));
  const allOrders: OrderDisplay[] = [...MOCK_COMPLETED_ORDERS, ...mappedBookings];

  const handleSaveProfile = () => {
    updateProfile(editForm);
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <section className="py-8 sm:py-12 bg-surface relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-72 h-72 bg-accent-blue/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative group">
              {user.profilePhoto ? (
                <img src={user.profilePhoto} alt={user.name} className="w-24 h-24 rounded-2xl object-cover border-2 border-brand-400/30" />
              ) : (
                <div className="w-24 h-24 rounded-2xl gradient-brand flex items-center justify-center text-white text-3xl font-bold border-2 border-brand-400/30">
                  {getInitials(user.name)}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-accent-green border-2 border-surface flex items-center justify-center">
                <CheckCircle2 size={12} className="text-white" />
              </div>
            </div>

            {/* Info */}
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-ink mb-1">{user.name}</h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-sm text-ink-secondary mb-2">
                <span className="flex items-center gap-1"><Mail size={14} /> {user.email}</span>
                {user.phone && <span className="flex items-center gap-1"><Phone size={14} /> {user.phone}</span>}
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-medium capitalize">
                  {user.accountType || "Customer"}
                </span>
                {user.profession && (
                  <span className="px-3 py-1 rounded-full bg-accent-blue/10 text-accent-blue text-xs font-medium">{user.profession}</span>
                )}
                <span className="px-3 py-1 rounded-full bg-surface-muted text-ink-muted text-xs font-medium flex items-center gap-1">
                  <Calendar size={10} /> Joined {user.registrationDate ? new Date(user.registrationDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "Recently"}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 rounded-xl border border-border text-ink-secondary text-sm font-medium hover:bg-surface-card transition-colors cursor-pointer flex items-center gap-1.5">
                <Edit3 size={14} /> Edit Profile
              </button>
              <button onClick={handleLogout}
                className="px-4 py-2 rounded-xl bg-accent-pink/10 text-accent-pink text-sm font-medium hover:bg-accent-pink/20 transition-colors cursor-pointer flex items-center gap-1.5">
                <LogOut size={14} /> Logout
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Upcoming", value: upcomingBookings.length + 1, icon: <Clock size={18} />, color: "text-accent-blue" },
            { label: "Completed", value: allOrders.length, icon: <CheckCircle2 size={18} />, color: "text-accent-green" },
            { label: "Total Spent", value: `₹${allOrders.reduce((s, o) => s + o.amount, 0).toLocaleString()}`, icon: <CreditCard size={18} />, color: "text-brand-400" },
            { label: "Cancelled", value: cancelledBookings.length, icon: <XCircle size={18} />, color: "text-accent-pink" },
          ].map((stat, i) => (
            <div key={i} className="bg-surface-card rounded-2xl border border-border p-4 text-center">
              <div className={`${stat.color} mb-2 flex justify-center`}>{stat.icon}</div>
              <div className="text-lg font-bold text-ink">{stat.value}</div>
              <div className="text-xs text-ink-secondary">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setIsEditing(false)}>
          <div className="bg-surface-card rounded-2xl border border-border p-6 w-full max-w-md animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-ink">Edit Profile</h3>
              <button onClick={() => setIsEditing(false)} className="p-1 rounded-lg hover:bg-surface-muted cursor-pointer"><X size={18} className="text-ink-muted" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-ink-secondary mb-1 block">Full Name</label>
                <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-ink text-sm outline-none focus:border-brand-400" />
              </div>
              <div>
                <label className="text-xs text-ink-secondary mb-1 block">Phone</label>
                <input type="tel" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-ink text-sm outline-none focus:border-brand-400" />
              </div>
              <div>
                <label className="text-xs text-ink-secondary mb-1 block">Address</label>
                <textarea value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} rows={2}
                  className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-ink text-sm outline-none focus:border-brand-400 resize-none" />
              </div>
              <div className="flex gap-2">
                <button onClick={handleSaveProfile}
                  className="flex-1 px-4 py-2.5 rounded-xl gradient-brand text-white text-sm font-semibold flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-90">
                  <Save size={14} /> Save Changes
                </button>
                <button onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 rounded-xl border border-border text-ink-secondary text-sm font-medium cursor-pointer">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-2 mb-6 bg-surface-card rounded-xl border border-border p-1 overflow-x-auto">
          {[
            { key: "overview" as const, label: "Overview", icon: <User size={14} /> },
            { key: "bookings" as const, label: "Upcoming", icon: <Clock size={14} />, count: upcomingBookings.length + 1 },
            { key: "history" as const, label: "History", icon: <Package size={14} />, count: allOrders.length },
            { key: "settings" as const, label: "Settings", icon: <Settings size={14} /> },
          ].map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${activeTab === tab.key ? "gradient-brand text-white" : "text-ink-secondary hover:text-ink"}`}>
              {tab.icon} {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${activeTab === tab.key ? "bg-white/20" : "bg-surface-muted"}`}>{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Personal Info */}
            <div className="bg-surface-card rounded-2xl border border-border p-6">
              <h3 className="text-sm font-semibold text-ink mb-4 flex items-center gap-2">
                <User size={16} className="text-brand-400" /> Personal Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Full Name", value: user.name, icon: <User size={14} /> },
                  { label: "Email", value: user.email, icon: <Mail size={14} /> },
                  { label: "Phone", value: user.phone || "Not provided", icon: <Phone size={14} /> },
                  { label: "Address", value: user.address || "Not provided", icon: <MapPin size={14} /> },
                  { label: "Language", value: user.language || "English", icon: <Award size={14} /> },
                  { label: "Account Type", value: user.accountType || "Customer", icon: <Shield size={14} /> },
                ].map((field, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-surface">
                    <div className="text-brand-400 mt-0.5">{field.icon}</div>
                    <div>
                      <div className="text-xs text-ink-muted">{field.label}</div>
                      <div className="text-sm font-medium text-ink">{field.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Worker Profile (if applicable) */}
            {user.accountType === "worker" && (
              <div className="bg-surface-card rounded-2xl border border-border p-6">
                <h3 className="text-sm font-semibold text-ink mb-4 flex items-center gap-2">
                  <Briefcase size={16} className="text-accent-blue" /> Worker Profile
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {user.profession && (
                    <div className="p-3 rounded-xl bg-surface">
                      <div className="text-xs text-ink-muted">Profession</div>
                      <div className="text-sm font-medium text-ink capitalize">{user.profession}</div>
                    </div>
                  )}
                  {user.experience && (
                    <div className="p-3 rounded-xl bg-surface">
                      <div className="text-xs text-ink-muted">Experience</div>
                      <div className="text-sm font-medium text-ink">{user.experience} years</div>
                    </div>
                  )}
                  {user.city && (
                    <div className="p-3 rounded-xl bg-surface">
                      <div className="text-xs text-ink-muted">City</div>
                      <div className="text-sm font-medium text-ink">{user.city}</div>
                    </div>
                  )}
                  {user.serviceRadius && (
                    <div className="p-3 rounded-xl bg-surface">
                      <div className="text-xs text-ink-muted">Service Radius</div>
                      <div className="text-sm font-medium text-ink">Within {user.serviceRadius} km</div>
                    </div>
                  )}
                </div>
                {user.skills && user.skills.length > 0 && (
                  <div className="mt-4">
                    <div className="text-xs text-ink-muted mb-2">Skills</div>
                    <div className="flex flex-wrap gap-2">
                      {user.skills.map((s) => (
                        <span key={s} className="px-2.5 py-1 rounded-lg bg-brand-500/10 text-brand-400 text-xs font-medium">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                {user.availableDays && user.availableDays.length > 0 && (
                  <div className="mt-4">
                    <div className="text-xs text-ink-muted mb-2">Availability</div>
                    <div className="flex flex-wrap gap-2">
                      {user.availableDays.map((d) => (
                        <span key={d} className="px-2.5 py-1 rounded-lg bg-accent-green/10 text-accent-green text-xs font-medium">{d}</span>
                      ))}
                    </div>
                    {user.startTime && user.endTime && (
                      <div className="text-xs text-ink-secondary mt-1">{user.startTime} — {user.endTime}</div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Recent Activity */}
            <div className="bg-surface-card rounded-2xl border border-border p-6">
              <h3 className="text-sm font-semibold text-ink mb-4 flex items-center gap-2">
                <TrendingUp size={16} className="text-accent-orange" /> Recent Activity
              </h3>
              {allOrders.length > 0 ? (
                <div className="space-y-3">
                  {allOrders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-surface">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center text-white text-xs font-bold">
                          {order.worker.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-ink">{order.service}</div>
                          <div className="text-xs text-ink-secondary">{order.worker} • {order.date}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-ink">₹{order.amount.toLocaleString()}</div>
                        <div className="flex items-center gap-0.5 justify-end">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={10} className={s <= order.rating ? "text-accent-orange fill-accent-orange" : "text-ink-muted"} />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-ink-muted text-center py-4">No activity yet. Book a service to get started!</p>
              )}
            </div>
          </div>
        )}

        {/* Upcoming Bookings Tab */}
        {activeTab === "bookings" && (
          <div className="space-y-4">
            {/* Mock upcoming booking */}
            <div className="bg-surface-card rounded-2xl border border-brand-400/30 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center text-white font-bold">RK</div>
                  <div>
                    <div className="text-sm font-semibold text-ink">Rajesh Kumar Singh</div>
                    <div className="text-xs text-brand-400">Electrician</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-accent-blue/10 text-accent-blue text-xs font-medium">Upcoming</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                <div><span className="text-ink-muted">Date:</span> <span className="text-ink font-medium">18 September 2026</span></div>
                <div><span className="text-ink-muted">Time:</span> <span className="text-ink font-medium">10:30 AM</span></div>
                <div><span className="text-ink-muted">Service:</span> <span className="text-ink font-medium">Electrical Wiring</span></div>
                <div><span className="text-ink-muted">Amount:</span> <span className="text-ink font-medium">₹2,800</span></div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 rounded-xl gradient-brand text-white text-xs font-semibold cursor-pointer hover:opacity-90">Contact Worker</button>
                <button className="px-3 py-2 rounded-xl border border-accent-pink/30 text-accent-pink text-xs font-medium cursor-pointer hover:bg-accent-pink/10">Cancel</button>
              </div>
            </div>

            {upcomingBookings.map((booking) => (
              <div key={booking.id} className="bg-surface-card rounded-2xl border border-border p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center text-white font-bold">
                      {booking.workerName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-ink">{booking.workerName}</div>
                      <div className="text-xs text-brand-400">{booking.workerProfession}</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-accent-blue/10 text-accent-blue text-xs font-medium">Upcoming</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                  <div><span className="text-ink-muted">Date:</span> <span className="text-ink font-medium">{booking.date}</span></div>
                  <div><span className="text-ink-muted">Time:</span> <span className="text-ink font-medium">{booking.time}</span></div>
                  <div><span className="text-ink-muted">Amount:</span> <span className="text-ink font-medium">₹{booking.price.toLocaleString()}</span></div>
                  {booking.note && <div className="col-span-2"><span className="text-ink-muted">Note:</span> <span className="text-ink font-medium">{booking.note}</span></div>}
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 rounded-xl gradient-brand text-white text-xs font-semibold cursor-pointer hover:opacity-90">Contact Worker</button>
                  <button className="px-3 py-2 rounded-xl border border-accent-pink/30 text-accent-pink text-xs font-medium cursor-pointer hover:bg-accent-pink/10">Cancel</button>
                </div>
              </div>
            ))}

            {upcomingBookings.length === 0 && (
              <div className="text-center py-12 bg-surface-card rounded-2xl border border-border">
                <Clock size={40} className="text-ink-muted mx-auto mb-3" />
                <h3 className="text-lg font-bold text-ink mb-1">No Upcoming Bookings</h3>
                <p className="text-sm text-ink-secondary mb-4">Browse services and book a verified worker.</p>
                <a href="/services" className="px-6 py-2.5 rounded-xl gradient-brand text-white text-sm font-semibold inline-block hover:opacity-90">Find a Service</a>
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div className="space-y-4">
            {allOrders.map((order) => (
              <div key={order.id} className="bg-surface-card rounded-2xl border border-border p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center text-white font-bold">
                      {order.worker.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-ink">{order.worker}</div>
                      <div className="text-xs text-brand-400">{order.profession} • {order.service}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-ink">₹{order.amount.toLocaleString()}</div>
                    <div className="flex items-center gap-0.5 justify-end">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={10} className={s <= order.rating ? "text-accent-orange fill-accent-orange" : "text-ink-muted"} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-ink-muted">
                  <span>{order.date}</span>
                  <span className="flex items-center gap-1 text-accent-green"><CheckCircle2 size={12} /> Completed</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <SettingsTab user={user} updateProfile={updateProfile} handleLogout={handleLogout} />
        )}
      </section>
    </div>
  );
}
