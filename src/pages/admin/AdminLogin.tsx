import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ShieldCheck, Sparkles, Eye, EyeOff, Loader2 } from "lucide-react";
import { adminLogin, isAdminAuthed } from "@/lib/adminApi";
import "@/styles/admin.css";

export default function AdminLogin() {
  const nav = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("Admin@123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAdminAuthed()) nav("/admin/dashboard", { replace: true });
  }, [nav]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await adminLogin(email.trim(), password);
      nav("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-scope">
      <div className="min-h-screen flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-5xl a-card" style={{ padding: 24 }}>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left */}
            <div className="a-card" style={{ background: "linear-gradient(180deg,rgba(15,22,38,0.9),rgba(8,12,22,0.9))" }}>
              <div className="a-title">Good afternoon, Admin</div>
              <div className="a-subtitle mt-1">Admin Control Panel</div>

              <div className="mt-24 a-card-tight a-card">
                <div className="flex items-center gap-2 text-[13px]">
                  <span className="h-2 w-2 rounded-full" style={{ background: "var(--a-green)" }} />
                  Status: Control room online
                </div>
                <div className="mt-2 text-[13px]" style={{ color: "var(--a-text-dim)" }}>
                  Backend: {import.meta.env.VITE_API_BASE_URL || "local"}
                </div>
                <div className="mt-1 text-[13px]" style={{ color: "var(--a-text-dim)" }}>
                  Works in Chrome and Telegram Mini App
                </div>
              </div>

              <div className="mt-10 a-card-tight a-card flex items-center gap-3">
                <Sparkles size={14} style={{ color: "var(--a-yellow)" }} />
                <div className="text-[12px] font-semibold" style={{ letterSpacing: "0.14em" }}>THEME</div>
                <div className="flex items-center gap-2 ml-2">
                  {["#4de3d3", "#ff8a3d", "#4aa8ff"].map((c) => (
                    <span key={c} className="h-6 w-6 rounded-full" style={{ background: c, opacity: 0.85, border: "1px solid rgba(255,255,255,0.15)" }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right */}
            <form
              onSubmit={onSubmit}
              className="a-card"
              style={{ background: "linear-gradient(180deg,rgba(15,22,38,0.9),rgba(8,12,22,0.9))" }}
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center"
                     style={{ background: "rgba(77,227,211,0.12)", border: "1px solid rgba(77,227,211,0.35)" }}>
                  <ShieldCheck size={18} style={{ color: "var(--a-teal)" }} />
                </div>
                <div>
                  <div className="a-eyebrow">ADMIN ACCESS</div>
                  <div className="text-white text-[18px] font-bold">Secure login checkpoint</div>
                </div>
              </div>

              <div className="mt-6">
                <label className="a-label">Email</label>
                <input
                  className="a-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  autoComplete="username"
                  required
                />
              </div>

              <div className="mt-4">
                <label className="a-label">Password</label>
                <div className="relative">
                  <input
                    className="a-input pr-10"
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  <button type="button" onClick={() => setShowPw((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--a-text-mute)" }}>
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 rounded-lg text-[13px]"
                     style={{ background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.35)", color: "#ff9b9b" }}>
                  {error}
                </div>
              )}

              <label className="mt-4 flex items-center gap-2 text-[13px]" style={{ color: "var(--a-text-dim)" }}>
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 rounded" />
                Remember this console
              </label>

              <button
                type="submit"
                disabled={loading}
                className="a-btn a-btn-primary w-full mt-5 justify-center py-3 text-[13px] tracking-[0.2em] font-bold"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />}
                {loading ? "SIGNING IN…" : "UNLOCK CONSOLE"}
              </button>

              <div className="mt-4 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2" style={{ color: "var(--a-text-dim)" }}>
                  <Sparkles size={12} style={{ color: "var(--a-yellow)" }} /> HMAC-signed session (30d)
                </div>
                <div style={{ color: "var(--a-text-mute)", letterSpacing: "0.2em" }}>V 3.4</div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
