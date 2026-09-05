"use client";

import { useRouter } from "next/navigation";
import { Mail, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import Button from "@/components/Button";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const initial = user.name.trim().charAt(0).toUpperCase() || "?";

  return (
    <section className="relative overflow-hidden min-h-[80vh] flex items-center justify-center py-12">
      <div className="absolute inset-0 bg-[#08090D]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(124,58,237,0.1)_0%,transparent_60%)]" />

      <div className="relative w-full max-w-md mx-auto px-4 z-10">
        <div className="bg-surface-card border border-border rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl gradient-brand text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-500/20 text-xl font-bold">
              {initial}
            </div>
            <h1 className="text-2xl font-bold text-ink mb-2">{t("nav.profile")}</h1>
            <p className="text-sm text-ink-secondary">Your GharPe account details</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl border border-border bg-surface-muted px-4 py-3">
              <User size={16} className="text-ink-muted shrink-0" />
              <div className="min-w-0">
                <div className="text-xs text-ink-muted">Name</div>
                <div className="text-sm font-medium text-ink truncate">{user.name}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border bg-surface-muted px-4 py-3">
              <Mail size={16} className="text-ink-muted shrink-0" />
              <div className="min-w-0">
                <div className="text-xs text-ink-muted">Email</div>
                <div className="text-sm font-medium text-ink truncate">{user.email}</div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Button variant="danger" className="w-full" onClick={handleLogout} icon={<LogOut size={16} />}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
