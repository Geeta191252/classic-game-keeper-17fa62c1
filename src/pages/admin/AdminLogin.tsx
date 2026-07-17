import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ShieldCheck, Sparkles, Eye, EyeOff } from "lucide-react";
import "@/styles/admin.css";

export default function AdminLogin() {
  const nav = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);

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
                <div className="mt-2 text-[13px]" style={{ color: "var(--a-text-dim)" }}>Last security sweep: 4 mins ago</div>
                <div className="mt-1 text-[13px]" style={{ color: "var(--a-text-dim)" }}>Whitelisted devices: 14</div>
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
              onSubmit={(e) => { e.preventDefault(); nav("/admin/dashboard"); }}
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
                <div className="flex items-baseline justify-between"><label className="a-label">Email</label><span className="text-[11px]" style={{ color: "var(--a-text-mute)" }}>Use your control room email</span></div>
                <input className="a-input" placeholder="admin@example.com" defaultValue="admin@gmail.com" />
              </div>

              <div className="mt-4">
                <div className="flex items-baseline justify-between"><label className="a-label">Password</label><span className="text-[11px]" style={{ color: "var(--a-text-mute)" }}>Code optional; password or code suffices</span></div>
                <div className="relative">
                  <input className="a-input pr-10" type={showPw ? "text" : "password"} defaultValue="Admin@123" />
                  <button type="button" onClick={() => setShowPw((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--a-text-mute)" }}>
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-baseline justify-between"><label className="a-label">One-time code (optional)</label><span className="text-[11px]" style={{ color: "var(--a-text-mute)" }}>6-digit or recovery code if you use 2FA</span></div>
                <input className="a-input" placeholder="6-digit code" />
              </div>

              <label className="mt-4 flex items-center gap-2 text-[13px]" style={{ color: "var(--a-text-dim)" }}>
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)}
                       className="h-4 w-4 rounded" />
                Remember this console
              </label>

              <button type="submit" className="a-btn a-btn-primary w-full mt-5 justify-center py-3 text-[13px] tracking-[0.2em] font-bold">
                <Lock size={14} /> UNLOCK CONSOLE
              </button>

              <div className="mt-4 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2" style={{ color: "var(--a-text-dim)" }}>
                  <Sparkles size={12} style={{ color: "var(--a-yellow)" }} /> Protected by biometric confirm
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
