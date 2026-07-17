import { ReactNode } from "react";
import {
  ArrowDownToLine, ArrowUpFromLine, Users as UsersIcon, DollarSign, ChevronLeft, ChevronRight,
  Filter, Plus, Search, Download, MoreHorizontal, TrendingUp, TrendingDown, Activity,
  Wallet, Sparkles, Gamepad2, ShieldCheck, MessageSquare, Megaphone, KeyRound,
  Palette, Clock, Ticket, Plane, Gift, Settings as SettingsIcon, Layers, MinusCircle,
  UserCircle2, Type, ShieldAlert, Crown, Target, CalendarClock, PiggyBank,
  LineChart, Network, BarChart3, Coins, Edit3, Trash2, Play, Pause, Copy, Check
} from "lucide-react";

/* ============= Shared primitives ============= */

export function StatCard({
  label, value, hint, icon, tone = "teal",
}: { label: string; value: string; hint?: string; icon: ReactNode; tone?: "teal"|"blue"|"purple"|"pink"|"red"|"green"|"yellow" }) {
  const toneColor: Record<string,string> = {
    teal: "var(--a-teal)", blue: "var(--a-blue)", purple: "var(--a-purple)",
    pink: "var(--a-pink)", red: "var(--a-red)", green: "var(--a-green)", yellow: "var(--a-yellow)",
  };
  return (
    <div className="a-card">
      <div className="flex items-start justify-between">
        <div className="a-stat-label">{label}</div>
        <div className="h-8 w-8 rounded-lg flex items-center justify-center"
             style={{ background: `color-mix(in oklab, ${toneColor[tone]} 12%, transparent)`, color: toneColor[tone] }}>
          {icon}
        </div>
      </div>
      <div className="a-stat-num mt-2">{value}</div>
      {hint && <div className="a-stat-hint">{hint}</div>}
    </div>
  );
}

export function Section({
  eyebrow, title, right, children,
}: { eyebrow?: string; title: string; right?: ReactNode; children: ReactNode }) {
  return (
    <section className="mt-6">
      <div className="flex items-end justify-between mb-3">
        <div>
          {eyebrow && <div className="a-eyebrow a-eyebrow-dim">{eyebrow}</div>}
          <div className="text-white text-[18px] font-bold mt-1">{title}</div>
        </div>
        {right}
      </div>
      {children}
    </section>
  );
}

export function Toolbar({ placeholder = "Search…", actions }: { placeholder?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <div className="flex-1 min-w-[240px] flex items-center gap-2 px-3 py-2 rounded-xl"
           style={{ background: "rgba(10,15,26,0.7)", border: "1px solid var(--a-border)" }}>
        <Search size={14} style={{ color: "var(--a-text-mute)" }} />
        <input className="bg-transparent outline-none text-[13px] w-full placeholder:text-[var(--a-text-mute)]" placeholder={placeholder} />
      </div>
      <button className="a-btn"><Filter size={14} /> Filters</button>
      {actions}
    </div>
  );
}

export function Pager({ total = 15 }: { total?: number }) {
  return (
    <div className="flex items-center justify-between mt-4">
      <div className="text-[12px]" style={{ color: "var(--a-text-dim)" }}>
        Showing <select className="a-select inline-block w-16 py-1 px-2 ml-1 mr-1"><option>20</option><option>50</option></select> of {total} entries
      </div>
      <div className="flex items-center gap-2">
        <button className="h-8 w-8 rounded-lg flex items-center justify-center a-btn a-btn-sm"><ChevronLeft size={14} /></button>
        <div className="text-[12px]" style={{ color: "var(--a-text-dim)" }}>Page 1 of 1</div>
        <button className="h-8 w-8 rounded-lg flex items-center justify-center a-btn a-btn-sm"><ChevronRight size={14} /></button>
      </div>
    </div>
  );
}

/* ============= Dashboard ============= */

const USERS_SAMPLE = [
  { name: "admin3", earn: 0, game: 0, role: "admin" },
  { name: "Rahul", earn: 0, game: 0, role: "player" },
  { name: "Beant Kaur", earn: 1.96, game: 0, role: "player" },
  { name: "admin2", earn: 0, game: 0, role: "admin" },
  { name: "Anil kumar", earn: 0, game: 0, role: "player" },
  { name: "test user", earn: 0, game: 0, role: "player" },
  { name: "test", earn: 0, game: 1000, role: "player" },
  { name: "Pawan Kumar", earn: 0, game: 0, role: "player" },
];

export function Dashboard() {
  return (
    <>
      <Section eyebrow="USERS" title="Realtime user intelligence">
        <div className="grid md:grid-cols-3 gap-4">
          <StatCard label="Total users" value="15" hint="ALL TIME" icon={<UsersIcon size={16} />} tone="blue" />
          <StatCard label="Active" value="15" hint="CURRENT ACTIVE STATUS" icon={<Activity size={16} />} tone="teal" />
          <StatCard label="Suspended" value="0" hint="MANUAL OR AUTO FLAGS" icon={<ShieldAlert size={16} />} tone="red" />
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div className="a-card">
            <div className="text-white text-[14px] font-semibold">Status distribution</div>
            <div className="mt-4 space-y-3">
              <div>
                <div className="flex justify-between text-[12px]"><span style={{ color: "var(--a-text-dim)" }}>Active</span><span className="text-white font-semibold">15</span></div>
                <div className="a-bar-track mt-1"><div className="a-bar-fill" style={{ width: "100%" }} /></div>
              </div>
              <div>
                <div className="flex justify-between text-[12px]"><span style={{ color: "var(--a-text-dim)" }}>Suspended</span><span className="text-white font-semibold">0</span></div>
                <div className="a-bar-track mt-1"><div className="a-bar-fill" style={{ width: "0%" }} /></div>
              </div>
            </div>
          </div>

          <div className="a-card">
            <div className="flex justify-between items-center">
              <div className="text-white text-[14px] font-semibold">Latest cohorts</div>
              <div className="a-eyebrow">SYNCED LIVE</div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3">
              {USERS_SAMPLE.map((u) => (
                <div key={u.name} className="a-card-tight a-card">
                  <div className="flex justify-between items-start">
                    <div className="text-[13px] font-semibold text-white">{u.name}</div>
                    <span className="a-chip a-chip-active">ACTIVE</span>
                  </div>
                  <div className="flex justify-between items-end mt-1">
                    <div className="text-[11px]" style={{ color: "var(--a-text-dim)" }}>Earning: ₹{u.earn} | Game: ₹{u.game}</div>
                    <span className={`a-chip ${u.role === "admin" ? "a-chip-admin" : "a-chip-role"}`} style={{ padding: "1px 8px" }}>{u.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section eyebrow="WALLET & TREASURY" title="Capital posture">
        <div className="grid md:grid-cols-2 gap-4">
          <StatCard label="Total deposited" value="₹33,440" hint="REALTIME" icon={<DollarSign size={16} />} tone="green" />
          <StatCard label="Total withdrawn" value="₹0" hint="REALTIME" icon={<ArrowUpFromLine size={16} />} tone="pink" />
        </div>
        <div className="a-card mt-4">
          <div className="flex justify-between items-center">
            <div className="text-white text-[14px] font-semibold">Pending finance actions</div>
            <div className="text-[11px]" style={{ color: "var(--a-text-dim)" }}>Deposits 13 · Withdrawals 0</div>
          </div>
          <div className="grid md:grid-cols-2 gap-3 mt-3">
            <div className="a-card-tight a-card">
              <div className="text-[13px] text-white font-semibold">Deposits</div>
              <div className="a-stat-hint">AWAITING APPROVAL</div>
              <div className="a-stat-num mt-1">13</div>
            </div>
            <div className="a-card-tight a-card">
              <div className="text-[13px] text-white font-semibold">Withdrawals</div>
              <div className="a-stat-hint">AWAITING APPROVAL</div>
              <div className="a-stat-num mt-1">0</div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

/* ============= Users ============= */

const USERS_TABLE = [
  { n: "admin3", e: "sales3.brt@gmail.com", p: "9876456745", d: "7/17/2026", r: "admin", earn: 0, game: 0, m: 0 },
  { n: "Rahul", e: "rahuljaiswal07565@gmail.com", p: "+918127639913", d: "7/16/2026", r: "player", earn: 0, game: 0, m: 0 },
  { n: "Beant Kaur", e: "brainu1999@gmail.com", p: "+917065651713", d: "7/6/2026", r: "player", earn: 1.96, game: 27, m: 0 },
  { n: "admin2", e: "admin2@123", p: "7523456765", d: "7/4/2026", r: "admin", earn: 0, game: 0, m: 0 },
  { n: "Anil kumar", e: "anilbaghel5553@gmail.com", p: "+919760969394", d: "7/3/2026", r: "player", earn: 0, game: 0, m: 0 },
  { n: "test user", e: "dev@gmail.com", p: "+919416983818", d: "6/29/2026", r: "player", earn: 0, game: 550, m: 0 },
  { n: "test", e: "atest@gmail.com", p: "+919999991111", d: "6/3/2026", r: "player", earn: 0, game: 1272, m: 0 },
  { n: "Pawan Kumar", e: "kingtrade234@gmail.com", p: "+919216072234", d: "4/7/2026", r: "player", earn: 0, game: 50, m: 0 },
  { n: "King game", e: "asifraza1989786@gmail.com", p: "+917696730592", d: "4/7/2026", r: "player", earn: 146.32, game: 0, m: 0 },
  { n: "Rajkhan", e: "fbagam75@gmail.com", p: "+918054550405", d: "4/7/2026", r: "player", earn: 0, game: 50, m: 0 },
  { n: "Abhishek", e: "abhisir882@gmail.com", p: "+918948137777", d: "4/7/2026", r: "player", earn: 53.58, game: 50, m: 2 },
  { n: "Abhi", e: "abhisir883@gmail.com", p: "+919415608615", d: "4/7/2026", r: "player", earn: 8.67, game: 0, m: 3 },
  { n: "New User", e: "new@gmail.com", p: "+919999999999", d: "4/2/2026", r: "player", earn: 9892.883, game: 5497, m: 0 },
  { n: "parent", e: "parent@gmail.com", p: "9999999900", d: "4/1/2026", r: "player", earn: 5536.698, game: 0, m: 5 },
  { n: "Admin", e: "admin@gmail.com", p: "1234567890", d: "4/1/2026", r: "admin", earn: 1796.88, game: 0, m: 12 },
];

export function UsersPage() {
  return (
    <div className="a-card">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="a-eyebrow a-eyebrow-dim">USER MANAGEMENT</div>
          <div className="text-white text-[18px] font-bold mt-1">Complete User Directory</div>
        </div>
        <div className="text-[12px]" style={{ color: "var(--a-text-dim)" }}>Total: 15 users</div>
      </div>
      <Toolbar placeholder="Search by fullname, email, or phone…" />
      <div className="overflow-x-auto a-scroll">
        <table className="a-table min-w-[900px]">
          <thead><tr>
            <th>User</th><th>Created</th><th>Roles</th><th>Wallet balance</th><th>Status</th><th>Total members</th><th>Login</th><th>Details</th>
          </tr></thead>
          <tbody>
            {USERS_TABLE.map((u) => (
              <tr key={u.e}>
                <td>
                  <div className="text-[13px] font-semibold text-white">{u.n}</div>
                  <div className="text-[11.5px]" style={{ color: "var(--a-text-dim)" }}>{u.e}</div>
                  <div className="text-[11.5px]" style={{ color: "var(--a-text-mute)" }}>{u.p}</div>
                </td>
                <td className="text-[12.5px]" style={{ color: "var(--a-text-dim)" }}>{u.d}</td>
                <td><span className={`a-chip ${u.r === "admin" ? "a-chip-admin" : "a-chip-role"}`}>{u.r}</span></td>
                <td>
                  <div className="text-[12.5px]">Earning: ₹{u.earn}</div>
                  <div className="text-[12.5px]">Gaming: ₹{u.game}</div>
                </td>
                <td><span className="a-chip a-chip-active">Active</span></td>
                <td className="text-white font-semibold">{u.m}</td>
                <td><button className="a-btn a-btn-primary a-btn-sm">Login</button></td>
                <td><button className="a-btn a-btn-purple a-btn-sm">View Details</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pager total={15} />
    </div>
  );
}

/* ============= Generic list/table page ============= */

function GenericTable({
  eyebrow, title, right, headers, rows, note,
}: {
  eyebrow: string; title: string; right?: ReactNode;
  headers: string[]; rows: ReactNode[][]; note?: string;
}) {
  return (
    <div className="a-card">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="a-eyebrow a-eyebrow-dim">{eyebrow}</div>
          <div className="text-white text-[18px] font-bold mt-1">{title}</div>
          {note && <div className="text-[12px] mt-1" style={{ color: "var(--a-text-dim)" }}>{note}</div>}
        </div>
        {right}
      </div>
      <Toolbar />
      <div className="overflow-x-auto a-scroll">
        <table className="a-table min-w-[720px]">
          <thead><tr>{headers.map((h) => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}
          </tbody>
        </table>
      </div>
      <Pager total={rows.length} />
    </div>
  );
}

const money = (n: number) => `₹${n.toLocaleString()}`;

/* ============= Games ============= */
const GAMES = [
  "Aviator", "Aviator Fun", "Mines", "Mines Classic", "Dice Master", "Carnival Spin",
  "Greedy King", "Plinko", "Chicken Road", "Chicken Classic", "JetX", "Twist", "Goblin Tower",
];
export function GamesPage() {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {GAMES.map((g, i) => (
        <div key={g} className="a-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(74,168,255,0.12)", color: "var(--a-blue)" }}>
                <Gamepad2 size={18} />
              </div>
              <div>
                <div className="text-white text-[14px] font-semibold">{g}</div>
                <div className="text-[11px]" style={{ color: "var(--a-text-mute)" }}>slug: {g.toLowerCase().replace(/\s+/g, "-")}</div>
              </div>
            </div>
            <div className="a-toggle on" />
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="a-card-tight a-card"><div className="text-[10.5px]" style={{ color: "var(--a-text-mute)" }}>PLAYS</div><div className="text-white font-semibold">{(i+1)*127}</div></div>
            <div className="a-card-tight a-card"><div className="text-[10.5px]" style={{ color: "var(--a-text-mute)" }}>RTP</div><div className="text-white font-semibold">{92 + (i%6)}%</div></div>
            <div className="a-card-tight a-card"><div className="text-[10.5px]" style={{ color: "var(--a-text-mute)" }}>MARGIN</div><div className="text-white font-semibold">{5 + (i%4)}%</div></div>
          </div>
          <div className="flex gap-2 mt-4">
            <button className="a-btn a-btn-sm flex-1 justify-center"><Edit3 size={12} /> Edit</button>
            <button className="a-btn a-btn-sm flex-1 justify-center a-btn-primary">Configure</button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============= Banners ============= */
export function BannersPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="a-eyebrow a-eyebrow-dim">HOMEPAGE ASSETS</div>
          <div className="text-white text-[18px] font-bold mt-1">Banners</div>
        </div>
        <button className="a-btn a-btn-primary"><Plus size={14} /> Add Banner</button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {[1,2,3,4].map((i) => (
          <div key={i} className="a-card">
            <div className="h-40 rounded-xl mb-3"
                 style={{ background: `linear-gradient(135deg, hsl(${i*70},70%,45%), hsl(${i*70+40},70%,35%))` }} />
            <div className="flex justify-between items-center">
              <div>
                <div className="text-white text-[14px] font-semibold">Promotion Banner #{i}</div>
                <div className="text-[11px]" style={{ color: "var(--a-text-mute)" }}>Position: home_hero_{i}</div>
              </div>
              <div className="flex gap-2">
                <button className="a-btn a-btn-sm"><Edit3 size={12} /></button>
                <button className="a-btn a-btn-sm"><Trash2 size={12} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============= Moderators ============= */
export function ModeratorsPage() {
  return GenericTable({
    eyebrow: "TEAM", title: "Moderators",
    right: <button className="a-btn a-btn-primary"><Plus size={14} /> Add Moderator</button>,
    headers: ["Name","Email","Role","Permissions","Last active","Status","Actions"],
    rows: [
      ["Riya Sharma","riya@thekinggame.online",<span key="1" className="a-chip a-chip-admin">super-admin</span>,"All","2m ago",<span key="2" className="a-chip a-chip-active">Online</span>,<button key="3" className="a-btn a-btn-sm"><MoreHorizontal size={12} /></button>],
      ["Amit Verma","amit@thekinggame.online",<span key="1" className="a-chip a-chip-role">finance</span>,"Deposits, Withdrawals","1h ago",<span key="2" className="a-chip a-chip-active">Online</span>,<button key="3" className="a-btn a-btn-sm"><MoreHorizontal size={12} /></button>],
      ["Neha Gupta","neha@thekinggame.online",<span key="1" className="a-chip a-chip-role">support</span>,"Tickets, Users","yesterday",<span key="2" className="a-chip a-chip-warn">Away</span>,<button key="3" className="a-btn a-btn-sm"><MoreHorizontal size={12} /></button>],
      ["Karan Malhotra","karan@thekinggame.online",<span key="1" className="a-chip a-chip-role">games</span>,"Games, Aviator Bucket","3d ago",<span key="2" className="a-chip a-chip-danger">Offline</span>,<button key="3" className="a-btn a-btn-sm"><MoreHorizontal size={12} /></button>],
    ],
  });
}

/* ============= Support ============= */
export function SupportPage() {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="md:col-span-1 a-card">
        <div className="text-white text-[14px] font-semibold mb-3">Open tickets</div>
        <div className="space-y-2">
          {[
            {u:"Rahul", s:"Deposit not credited", t:"3m ago", p:"high"},
            {u:"Beant Kaur", s:"Withdraw stuck", t:"12m ago", p:"medium"},
            {u:"Anil kumar", s:"KYC verification", t:"1h ago", p:"low"},
            {u:"test user", s:"Aviator round issue", t:"3h ago", p:"medium"},
            {u:"parent", s:"Referral bonus", t:"yesterday", p:"low"},
          ].map((t,i) => (
            <div key={i} className={`a-card-tight a-card cursor-pointer ${i===0 ? "" : ""}`}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-white text-[13px] font-semibold">{t.u}</div>
                  <div className="text-[11.5px]" style={{ color: "var(--a-text-dim)" }}>{t.s}</div>
                </div>
                <span className={`a-chip ${t.p==="high"?"a-chip-danger":t.p==="medium"?"a-chip-warn":"a-chip-role"}`}>{t.p}</span>
              </div>
              <div className="text-[11px] mt-1" style={{ color: "var(--a-text-mute)" }}>{t.t}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="md:col-span-2 a-card">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-white text-[14px] font-semibold">Rahul — Deposit not credited</div>
            <div className="text-[11.5px]" style={{ color: "var(--a-text-mute)" }}>Ticket #4821 · opened 3m ago</div>
          </div>
          <div className="flex gap-2">
            <button className="a-btn a-btn-sm">Assign</button>
            <button className="a-btn a-btn-sm a-btn-primary">Resolve</button>
          </div>
        </div>
        <div className="space-y-3 max-h-[420px] overflow-y-auto a-scroll pr-1">
          <div className="a-card-tight a-card"><div className="text-[11px]" style={{ color: "var(--a-text-mute)" }}>Rahul · 3m ago</div><div className="text-[13px] mt-1">Bhai maine 500 rs deposit kiya UTR 33218812, abhi tak add nahi hua wallet mein.</div></div>
          <div className="a-card-tight a-card" style={{ background: "rgba(77,227,211,0.06)", border: "1px solid rgba(77,227,211,0.15)" }}>
            <div className="text-[11px]" style={{ color: "var(--a-teal)" }}>Support · 2m ago</div>
            <div className="text-[13px] mt-1">Rahul ji, aapka payment gateway se pending status aa raha hai. 5 minute mein credit ho jayega, hum monitor kar rahe hain.</div>
          </div>
          <div className="a-card-tight a-card"><div className="text-[11px]" style={{ color: "var(--a-text-mute)" }}>Rahul · 1m ago</div><div className="text-[13px] mt-1">Ok bhai wait kar raha hu.</div></div>
        </div>
        <div className="mt-3 flex gap-2">
          <input className="a-input" placeholder="Type your reply…" />
          <button className="a-btn a-btn-primary">Send</button>
        </div>
      </div>
    </div>
  );
}

/* ============= Announcements ============= */
export function AnnouncementsPage() {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="md:col-span-2 space-y-3">
        {[
          {t:"System maintenance", d:"Sunday 3AM–4AM IST. Wallet withdrawals will be paused during this window.", tag:"scheduled"},
          {t:"Diwali bonus event", d:"Get up to 50% bonus on deposits above ₹500. Valid till 15 Nov.", tag:"active"},
          {t:"New game: Goblin Tower", d:"Climb the tower and win up to 100x. Now live in the games lobby.", tag:"active"},
        ].map((a,i) => (
          <div key={i} className="a-card">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-white text-[14px] font-semibold">{a.t}</div>
                <div className="text-[12.5px] mt-1" style={{ color: "var(--a-text-dim)" }}>{a.d}</div>
              </div>
              <span className={`a-chip ${a.tag==="active"?"a-chip-active":"a-chip-warn"}`}>{a.tag}</span>
            </div>
            <div className="flex gap-2 mt-3">
              <button className="a-btn a-btn-sm"><Edit3 size={12} /> Edit</button>
              <button className="a-btn a-btn-sm"><Trash2 size={12} /> Delete</button>
            </div>
          </div>
        ))}
      </div>
      <div className="a-card">
        <div className="text-white text-[14px] font-semibold mb-3">Post announcement</div>
        <label className="a-label">Title</label><input className="a-input" placeholder="Title" />
        <label className="a-label mt-3">Message</label><textarea className="a-textarea" rows={5} placeholder="Message body…" />
        <label className="a-label mt-3">Audience</label>
        <select className="a-select"><option>All users</option><option>Players only</option><option>Admins only</option></select>
        <button className="a-btn a-btn-primary w-full mt-4 justify-center"><Megaphone size={14} /> Publish</button>
      </div>
    </div>
  );
}

/* ============= Forgotten passwords ============= */
export function ForgottenPasswordsPage() {
  return GenericTable({
    eyebrow: "SECURITY", title: "Password reset requests",
    headers: ["User","Email","Requested at","Status","Method","Actions"],
    rows: [
      ["Rahul","rahul@x.com","3m ago",<span key="1" className="a-chip a-chip-warn">pending</span>,"email",<button key="2" className="a-btn a-btn-sm a-btn-primary">Reset</button>],
      ["Beant Kaur","brainu@x.com","1h ago",<span key="1" className="a-chip a-chip-active">verified</span>,"otp",<button key="2" className="a-btn a-btn-sm a-btn-primary">Reset</button>],
      ["Anil kumar","anil@x.com","yesterday",<span key="1" className="a-chip a-chip-danger">expired</span>,"email",<button key="2" className="a-btn a-btn-sm">Retry</button>],
      ["parent","parent@x.com","2d ago",<span key="1" className="a-chip a-chip-active">resolved</span>,"otp","—"],
    ],
  });
}

/* ============= Deposits / Withdrawals ============= */
function payRow(u:string,a:number,m:string,st:"pending"|"approved"|"rejected") {
  const chip = st==="approved" ? "a-chip-active" : st==="pending" ? "a-chip-warn" : "a-chip-danger";
  return [u,money(a),m,<span key="s" className={`a-chip ${chip}`}>{st}</span>,"18 Jul 2026",
    <div key="a" className="flex gap-2"><button className="a-btn a-btn-sm a-btn-primary">Approve</button><button className="a-btn a-btn-sm">Reject</button></div>];
}
export function DepositsPage() {
  return GenericTable({
    eyebrow: "FINANCIAL", title: "Deposits", note: "13 awaiting approval · ₹33,440 total lifetime",
    right: <button className="a-btn"><Download size={14} /> Export CSV</button>,
    headers: ["User","Amount","Method","Status","When","Actions"],
    rows: [
      payRow("Rahul", 500, "UPI", "pending"),
      payRow("Beant Kaur", 250, "UPI", "approved"),
      payRow("Anil kumar", 1000, "Bank", "pending"),
      payRow("New User", 2500, "UPI", "approved"),
      payRow("parent", 100, "UPI", "rejected"),
      payRow("Pawan Kumar", 500, "USDT", "pending"),
      payRow("King game", 1500, "UPI", "approved"),
    ],
  });
}
export function WithdrawalsPage() {
  return GenericTable({
    eyebrow: "FINANCIAL", title: "Withdrawals", note: "0 awaiting approval",
    right: <button className="a-btn"><Download size={14} /> Export CSV</button>,
    headers: ["User","Amount","Destination","Status","When","Actions"],
    rows: [
      ["parent", money(1200), "UPI · rahul@paytm", <span key="s" className="a-chip a-chip-active">approved</span>, "17 Jul 2026", <button key="a" className="a-btn a-btn-sm">Details</button>],
      ["New User", money(500), "Bank · HDFC •• 8821", <span key="s" className="a-chip a-chip-active">approved</span>, "16 Jul 2026", <button key="a" className="a-btn a-btn-sm">Details</button>],
      ["Rahul", money(300), "USDT · TRC20", <span key="s" className="a-chip a-chip-warn">processing</span>, "16 Jul 2026", <button key="a" className="a-btn a-btn-sm">Details</button>],
    ],
  });
}

/* ============= Wallet Adjust ============= */
export function WalletAdjustPage() {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="md:col-span-1 a-card">
        <div className="text-white text-[14px] font-semibold">Adjust user wallet</div>
        <label className="a-label mt-3">User</label>
        <select className="a-select"><option>Select user…</option>{USERS_TABLE.map((u) => <option key={u.e}>{u.n}</option>)}</select>
        <label className="a-label mt-3">Wallet</label>
        <select className="a-select"><option>Rupee (₹)</option><option>Dollar ($)</option><option>Star (★)</option></select>
        <label className="a-label mt-3">Type</label>
        <select className="a-select"><option>Credit</option><option>Debit</option></select>
        <label className="a-label mt-3">Amount</label>
        <input className="a-input" placeholder="0.00" />
        <label className="a-label mt-3">Reason</label>
        <textarea className="a-textarea" rows={3} placeholder="Note visible in audit log…" />
        <button className="a-btn a-btn-primary w-full mt-4 justify-center"><Wallet size={14} /> Apply adjustment</button>
      </div>
      <div className="md:col-span-2 a-card">
        <div className="flex justify-between items-center mb-3">
          <div className="text-white text-[14px] font-semibold">Recent adjustments</div>
          <div className="text-[11px]" style={{ color: "var(--a-text-mute)" }}>Audit trail</div>
        </div>
        <table className="a-table">
          <thead><tr><th>User</th><th>Wallet</th><th>Type</th><th>Amount</th><th>Reason</th><th>By</th></tr></thead>
          <tbody>
            {[
              {u:"Rahul",w:"₹",t:"credit",a:100,r:"Missed deposit compensation"},
              {u:"parent",w:"₹",t:"debit",a:50,r:"Reverse bonus abuse"},
              {u:"Beant Kaur",w:"$",t:"credit",a:5,r:"Support goodwill"},
              {u:"New User",w:"★",t:"credit",a:500,r:"Event reward"},
            ].map((x,i) => (
              <tr key={i}>
                <td>{x.u}</td><td>{x.w}</td>
                <td><span className={`a-chip ${x.t==="credit"?"a-chip-active":"a-chip-danger"}`}>{x.t}</span></td>
                <td>{x.w}{x.a}</td>
                <td className="text-[12px]" style={{ color: "var(--a-text-dim)" }}>{x.r}</td>
                <td>Admin</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ============= Analytics / charts (SVG placeholders) ============= */
function LineChartSVG() {
  return (
    <svg viewBox="0 0 400 140" className="w-full h-40">
      <defs>
        <linearGradient id="lg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#4de3d3" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#4de3d3" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0,110 L40,90 L80,100 L120,60 L160,70 L200,40 L240,55 L280,30 L320,45 L360,20 L400,35 L400,140 L0,140 Z" fill="url(#lg)" />
      <path d="M0,110 L40,90 L80,100 L120,60 L160,70 L200,40 L240,55 L280,30 L320,45 L360,20 L400,35" fill="none" stroke="#4de3d3" strokeWidth="2" />
    </svg>
  );
}
function BarChartSVG() {
  const bars = [40,60,35,80,55,90,70,50,85,65,45,75];
  return (
    <svg viewBox="0 0 400 140" className="w-full h-40">
      {bars.map((v,i) => (
        <rect key={i} x={i*32+6} y={140-v} width="22" height={v} rx="4"
              fill={`url(#bg${i%2})`} />
      ))}
      <defs>
        <linearGradient id="bg0" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#4aa8ff" /><stop offset="1" stopColor="#4de3d3" /></linearGradient>
        <linearGradient id="bg1" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#a06bff" /><stop offset="1" stopColor="#4aa8ff" /></linearGradient>
      </defs>
    </svg>
  );
}
function DonutSVG() {
  return (
    <svg viewBox="0 0 120 120" className="w-40 h-40">
      <circle cx="60" cy="60" r="45" stroke="rgba(90,120,170,0.2)" strokeWidth="14" fill="none" />
      <circle cx="60" cy="60" r="45" stroke="#4de3d3" strokeWidth="14" fill="none"
              strokeDasharray="180 283" strokeLinecap="round" transform="rotate(-90 60 60)" />
      <text x="60" y="65" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="700">64%</text>
    </svg>
  );
}

export function AnalyticsPage() {
  return (
    <>
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard label="DAU" value="1,284" hint="LAST 24H" icon={<UsersIcon size={16} />} tone="teal" />
        <StatCard label="GGR" value="₹1,20,450" hint="THIS WEEK" icon={<TrendingUp size={16} />} tone="green" />
        <StatCard label="NGR" value="₹84,200" hint="THIS WEEK" icon={<DollarSign size={16} />} tone="blue" />
        <StatCard label="Bet volume" value="₹9.4L" hint="THIS WEEK" icon={<Activity size={16} />} tone="purple" />
      </div>
      <div className="grid md:grid-cols-3 gap-4 mt-4">
        <div className="md:col-span-2 a-card">
          <div className="flex justify-between mb-3"><div className="text-white text-[14px] font-semibold">Revenue trend</div><span className="a-chip a-chip-live">30d</span></div>
          <LineChartSVG />
        </div>
        <div className="a-card">
          <div className="text-white text-[14px] font-semibold mb-3">Player retention</div>
          <div className="flex justify-center"><DonutSVG /></div>
        </div>
      </div>
      <div className="a-card mt-4">
        <div className="flex justify-between mb-3"><div className="text-white text-[14px] font-semibold">Bets by game</div><span className="a-chip">Weekly</span></div>
        <BarChartSVG />
      </div>
    </>
  );
}

/* ============= Spare wallet / daily analytics ============= */
export function SpareWalletPage() {
  return GenericTable({
    eyebrow: "TREASURY", title: "Spare wallet · Wingo, K3, TRX, 5D",
    headers: ["Game","Period","Total bet","Total win","Margin","Balance"],
    rows: [
      ["Wingo 30s","last 24h", money(120450), money(96430), "20%", money(24020)],
      ["Wingo 1m","last 24h", money(88300), money(72100), "18%", money(16200)],
      ["K3","last 24h", money(45210), money(37800), "16%", money(7410)],
      ["TRX","last 24h", money(31200), money(25900), "17%", money(5300)],
      ["5D","last 24h", money(19800), money(15450), "22%", money(4350)],
    ],
  });
}
export function DailyAnalyticsPage() {
  return (
    <>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="a-card"><div className="text-white text-[14px] font-semibold mb-3">Wingo — daily P/L</div><BarChartSVG /></div>
        <div className="a-card"><div className="text-white text-[14px] font-semibold mb-3">K3 — daily P/L</div><LineChartSVG /></div>
      </div>
      <div className="a-card mt-4">
        <div className="text-white text-[14px] font-semibold mb-3">Daily breakdown</div>
        <table className="a-table">
          <thead><tr><th>Date</th><th>Bets</th><th>Wins</th><th>Net</th><th>Users</th><th>New users</th></tr></thead>
          <tbody>{[0,1,2,3,4,5,6].map((i) => (
            <tr key={i}><td>{`${18-i} Jul 2026`}</td><td>{money(120000-i*8200)}</td><td>{money(96000-i*7000)}</td><td className="text-[color:var(--a-green)] font-semibold">+{money(24000-i*1200)}</td><td>{1284-i*32}</td><td>{42-i*3}</td></tr>
          ))}</tbody>
        </table>
      </div>
    </>
  );
}

/* ============= Bonus / Financials report ============= */
export function BonusIncomeReportPage() {
  return GenericTable({
    eyebrow: "MLM INSIGHTS", title: "Bonus & income report",
    headers: ["User","Direct bonus","Level bonus","Salary","Rank reward","Total"],
    rows: [
      ["parent", money(4500), money(1200), money(1000), money(500), money(7200)],
      ["Abhi", money(1200), money(300), "—", "—", money(1500)],
      ["Abhishek", money(800), money(150), "—", "—", money(950)],
      ["New User", money(300), "—", "—", "—", money(300)],
    ],
  });
}
export function FinancialsReportPage() {
  return (
    <>
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard label="Deposits" value={money(33440)} icon={<ArrowDownToLine size={16} />} tone="green" />
        <StatCard label="Withdrawals" value={money(2000)} icon={<ArrowUpFromLine size={16} />} tone="pink" />
        <StatCard label="Bonuses paid" value={money(9950)} icon={<Gift size={16} />} tone="yellow" />
        <StatCard label="Net treasury" value={money(21490)} icon={<Wallet size={16} />} tone="teal" />
      </div>
      <div className="a-card mt-4">
        <div className="text-white text-[14px] font-semibold mb-3">Monthly ledger</div>
        <LineChartSVG />
      </div>
    </>
  );
}

/* ============= User theme ============= */
export function UserThemePage() {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {[
        {n:"Midnight", c:["#0a0f1e","#4de3d3","#4aa8ff"]},
        {n:"Sunset", c:["#1a0a1f","#ff6ea8","#ff8a3d"]},
        {n:"Forest", c:["#08130f","#33d69f","#4de3d3"]},
        {n:"Royal", c:["#0e0a20","#a06bff","#6a5bff"]},
        {n:"Crimson", c:["#1a0808","#ff5b6a","#ff8a3d"]},
        {n:"Ocean", c:["#061020","#4aa8ff","#4de3d3"]},
      ].map((t,i) => (
        <div key={t.n} className="a-card">
          <div className="h-24 rounded-xl mb-3" style={{ background: `linear-gradient(135deg, ${t.c[0]}, ${t.c[1]}, ${t.c[2]})` }} />
          <div className="flex justify-between items-center">
            <div>
              <div className="text-white text-[14px] font-semibold">{t.n}</div>
              <div className="text-[11px]" style={{ color: "var(--a-text-mute)" }}>Active users: {(i+1)*217}</div>
            </div>
            <div className="flex gap-1">{t.c.map((c) => <span key={c} className="h-5 w-5 rounded-full" style={{ background: c, border:"1px solid rgba(255,255,255,0.1)" }} />)}</div>
          </div>
          <button className={`a-btn a-btn-sm w-full justify-center mt-3 ${i===0 ? "a-btn-primary" : ""}`}>{i===0 ? "Default theme" : "Set as default"}</button>
        </div>
      ))}
    </div>
  );
}

/* ============= MLM Plans ============= */
export function DepositPlansPage() {
  return GenericTable({
    eyebrow: "MLM PLANS", title: "Deposit plans",
    right: <button className="a-btn a-btn-primary"><Plus size={14} /> New plan</button>,
    headers: ["Plan","Min deposit","Max deposit","Bonus %","Direct %","Level %","Status"],
    rows: [
      ["Bronze", money(100), money(999), "5%", "5%", "1%", <span key="1" className="a-chip a-chip-active">active</span>],
      ["Silver", money(1000), money(9999), "8%", "7%", "1.5%", <span key="1" className="a-chip a-chip-active">active</span>],
      ["Gold", money(10000), money(49999), "10%", "10%", "2%", <span key="1" className="a-chip a-chip-active">active</span>],
      ["Platinum", money(50000), money(199999), "12%", "12%", "3%", <span key="1" className="a-chip a-chip-warn">draft</span>],
      ["Diamond", money(200000), "∞", "15%", "15%", "4%", <span key="1" className="a-chip a-chip-active">active</span>],
    ],
  });
}
export function BetPlansPage() {
  return GenericTable({
    eyebrow: "MLM PLANS", title: "Bet plans",
    right: <button className="a-btn a-btn-primary"><Plus size={14} /> New plan</button>,
    headers: ["Plan","Min bet","Max bet","Cashback %","Weekly cap","Status"],
    rows: [
      ["Starter", money(10), money(499), "1%", money(500), <span key="1" className="a-chip a-chip-active">active</span>],
      ["Regular", money(500), money(4999), "2%", money(2500), <span key="1" className="a-chip a-chip-active">active</span>],
      ["VIP", money(5000), money(49999), "3.5%", money(15000), <span key="1" className="a-chip a-chip-active">active</span>],
      ["High Roller", money(50000), "∞", "5%", money(75000), <span key="1" className="a-chip a-chip-warn">invite</span>],
    ],
  });
}
export function SalaryIncomePage() {
  return GenericTable({
    eyebrow: "MLM PLANS", title: "Salary income",
    headers: ["Rank","Team size","Team business","Monthly salary","Reward","Status"],
    rows: [
      ["Executive", "10", money(50000), money(1000), "T-shirt", <span key="1" className="a-chip a-chip-active">active</span>],
      ["Manager", "25", money(200000), money(5000), "Smart watch", <span key="1" className="a-chip a-chip-active">active</span>],
      ["Director", "100", money(1000000), money(25000), "Phone", <span key="1" className="a-chip a-chip-active">active</span>],
      ["President", "500", money(5000000), money(100000), "Bike", <span key="1" className="a-chip a-chip-active">active</span>],
      ["Crown", "2000", money(25000000), money(500000), "Car", <span key="1" className="a-chip a-chip-active">active</span>],
    ],
  });
}
export function RankSystemPage() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {[
        {r:"Executive", b:money(500), req:"₹10K team business"},
        {r:"Manager", b:money(2500), req:"₹50K team business"},
        {r:"Director", b:money(10000), req:"₹2L team business"},
        {r:"President", b:money(50000), req:"₹10L team business"},
        {r:"Crown", b:money(200000), req:"₹50L team business"},
        {r:"Diamond Crown", b:money(1000000), req:"₹2Cr team business"},
      ].map((x, i) => (
        <div key={x.r} className="a-card">
          <div className="flex justify-between">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl flex items-center justify-center" style={{ background: "rgba(160,107,255,0.15)", color: "var(--a-purple)" }}>
                <Crown size={20} />
              </div>
              <div>
                <div className="text-white text-[15px] font-bold">{x.r}</div>
                <div className="text-[11.5px]" style={{ color: "var(--a-text-dim)" }}>Rank #{i+1}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white text-[14px] font-semibold">{x.b}</div>
              <div className="text-[11px]" style={{ color: "var(--a-text-mute)" }}>one-time bonus</div>
            </div>
          </div>
          <div className="mt-3 text-[12.5px]" style={{ color: "var(--a-text-dim)" }}>Requirement: {x.req}</div>
        </div>
      ))}
    </div>
  );
}

/* ============= Configuration pages ============= */
function ToggleRow({ label, desc, on = true }: { label:string; desc:string; on?:boolean }) {
  return (
    <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: "var(--a-border)" }}>
      <div>
        <div className="text-white text-[13.5px] font-semibold">{label}</div>
        <div className="text-[12px]" style={{ color: "var(--a-text-dim)" }}>{desc}</div>
      </div>
      <div className={`a-toggle ${on ? "on" : ""}`} />
    </div>
  );
}
export function SystemControlsPage() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="a-card">
        <div className="text-white text-[14px] font-semibold mb-2">Platform switches</div>
        <ToggleRow label="Site online" desc="Enable player access to lobby & games" on />
        <ToggleRow label="Deposits enabled" desc="Allow new deposits from all methods" on />
        <ToggleRow label="Withdrawals enabled" desc="Process withdrawal queue" on />
        <ToggleRow label="Signup open" desc="Accept new player registrations" on />
        <ToggleRow label="KYC required" desc="Force KYC before first withdrawal" on={false} />
        <ToggleRow label="Maintenance mode" desc="Shows maintenance banner to all users" on={false} />
      </div>
      <div className="a-card">
        <div className="text-white text-[14px] font-semibold mb-2">Safeguards</div>
        <ToggleRow label="Auto-suspend on VPN" desc="Block suspicious IPs automatically" on />
        <ToggleRow label="Rate limit deposits" desc="Max 5 attempts / hour / user" on />
        <ToggleRow label="Multi-account detection" desc="Flag matching device fingerprints" on />
        <ToggleRow label="Bonus abuse guard" desc="Block bonuses on flagged wallets" on />
        <ToggleRow label="Withdrawal 4-eye approval" desc="Two moderators must approve" on={false} />
      </div>
    </div>
  );
}
export function SiteLogoPage() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="a-card">
        <div className="text-white text-[14px] font-semibold mb-3">Site identity</div>
        <label className="a-label">Site name</label><input className="a-input" defaultValue="TheKingGame" />
        <label className="a-label mt-3">Tagline</label><input className="a-input" defaultValue="Play. Win. Repeat." />
        <label className="a-label mt-3">Support email</label><input className="a-input" defaultValue="support@thekinggame.online" />
        <label className="a-label mt-3">Support phone</label><input className="a-input" defaultValue="+91 99999 99999" />
      </div>
      <div className="a-card">
        <div className="text-white text-[14px] font-semibold mb-3">Logo & favicon</div>
        <div className="a-card-tight a-card flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#4de3d3,#4aa8ff)", color:"#04070d" }}><Sparkles size={22} /></div>
            <div>
              <div className="text-white text-[13px] font-semibold">Primary logo</div>
              <div className="text-[11px]" style={{ color: "var(--a-text-mute)" }}>256×256 · PNG</div>
            </div>
          </div>
          <button className="a-btn a-btn-sm">Replace</button>
        </div>
        <div className="a-card-tight a-card mt-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-xl flex items-center justify-center" style={{ background: "rgba(30,42,68,0.6)" }}><Type size={18} /></div>
            <div>
              <div className="text-white text-[13px] font-semibold">Favicon</div>
              <div className="text-[11px]" style={{ color: "var(--a-text-mute)" }}>32×32 · ICO</div>
            </div>
          </div>
          <button className="a-btn a-btn-sm">Replace</button>
        </div>
      </div>
    </div>
  );
}
export function BonusSettingsPage() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="a-card">
        <div className="text-white text-[14px] font-semibold mb-3">Signup & referral</div>
        <label className="a-label">Signup bonus (₹)</label><input className="a-input" defaultValue="50" />
        <label className="a-label mt-3">Referral bonus for inviter (₹)</label><input className="a-input" defaultValue="100" />
        <label className="a-label mt-3">Referral bonus for invitee (₹)</label><input className="a-input" defaultValue="50" />
        <label className="a-label mt-3">Min deposit to unlock (₹)</label><input className="a-input" defaultValue="200" />
      </div>
      <div className="a-card">
        <div className="text-white text-[14px] font-semibold mb-3">Deposit bonus tiers</div>
        <table className="a-table">
          <thead><tr><th>Tier</th><th>Min ₹</th><th>Bonus %</th><th></th></tr></thead>
          <tbody>
            {[{t:"T1",m:100,b:5},{t:"T2",m:500,b:8},{t:"T3",m:1000,b:10},{t:"T4",m:5000,b:15}].map((x)=>(
              <tr key={x.t}><td>{x.t}</td><td><input className="a-input" defaultValue={x.m} /></td><td><input className="a-input" defaultValue={x.b} /></td><td><button className="a-btn a-btn-sm"><Trash2 size={12} /></button></td></tr>
            ))}
          </tbody>
        </table>
        <button className="a-btn a-btn-primary w-full mt-3 justify-center"><Plus size={14} /> Add tier</button>
      </div>
    </div>
  );
}
export function AviatorBucketPage() {
  return (
    <>
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard label="Current pool" value={money(184200)} hint="LIVE" icon={<Plane size={16} />} tone="teal" />
        <StatCard label="Target margin" value="50%" hint="OWNER PROFIT" icon={<Target size={16} />} tone="green" />
        <StatCard label="Round #" value="4,821" hint="TODAY" icon={<Activity size={16} />} tone="blue" />
        <StatCard label="Last crash" value="2.14x" hint="42s AGO" icon={<TrendingDown size={16} />} tone="red" />
      </div>
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div className="a-card">
          <div className="text-white text-[14px] font-semibold mb-3">Bucket controls</div>
          <label className="a-label">Owner profit %</label><input className="a-input" defaultValue="50" />
          <label className="a-label mt-3">Min crash multiplier</label><input className="a-input" defaultValue="1.00" />
          <label className="a-label mt-3">Max crash multiplier</label><input className="a-input" defaultValue="100.00" />
          <label className="a-label mt-3">Round interval (sec)</label><input className="a-input" defaultValue="6" />
          <button className="a-btn a-btn-primary w-full mt-4 justify-center">Save bucket</button>
        </div>
        <div className="a-card">
          <div className="text-white text-[14px] font-semibold mb-3">Recent rounds</div>
          <div className="grid grid-cols-6 gap-2">
            {[1.24,3.87,1.02,12.4,2.14,1.55,4.20,1.11,7.8,2.9,1.87,3.32,1.02,5.6,2.14,1.09,8.4,3.1].map((v,i)=>(
              <div key={i} className="a-card-tight a-card text-center">
                <div className={`text-[13px] font-bold ${v<2?"text-[color:var(--a-red)]":v<5?"text-[color:var(--a-yellow)]":"text-[color:var(--a-green)]"}`}>{v}x</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
export function CronManagementPage() {
  return GenericTable({
    eyebrow: "SCHEDULER", title: "Cron management",
    right: <button className="a-btn a-btn-primary"><Plus size={14} /> New cron</button>,
    headers: ["Job","Schedule","Last run","Next run","Status","Actions"],
    rows: [
      ["Daily rollup","0 1 * * *","today 01:00","tomorrow 01:00",<span key="1" className="a-chip a-chip-active">healthy</span>,
        <div key="a" className="flex gap-1"><button className="a-btn a-btn-sm"><Play size={12} /></button><button className="a-btn a-btn-sm"><Pause size={12} /></button></div>],
      ["Salary payout","0 0 1 * *","01 Jul 00:00","01 Aug 00:00",<span key="1" className="a-chip a-chip-active">healthy</span>,
        <div key="a" className="flex gap-1"><button className="a-btn a-btn-sm"><Play size={12} /></button><button className="a-btn a-btn-sm"><Pause size={12} /></button></div>],
      ["Bonus expiry","*/15 * * * *","2m ago","13m","...",<div key="a" className="flex gap-1"><button className="a-btn a-btn-sm"><Play size={12} /></button><button className="a-btn a-btn-sm"><Pause size={12} /></button></div>],
      ["Withdraw retry","*/5 * * * *","1m ago","4m",<span key="1" className="a-chip a-chip-warn">retrying</span>,
        <div key="a" className="flex gap-1"><button className="a-btn a-btn-sm"><Play size={12} /></button><button className="a-btn a-btn-sm"><Pause size={12} /></button></div>],
    ],
  });
}
export function GiftCodesPage() {
  return GenericTable({
    eyebrow: "PROMOTIONS", title: "Gift codes",
    right: <button className="a-btn a-btn-primary"><Plus size={14} /> Generate code</button>,
    headers: ["Code","Value","Max uses","Used","Expires","Status","Actions"],
    rows: [
      [<code key="c" className="text-[13px] text-white">DIWALI500</code>, money(500), "1000","842", "15 Nov 2026", <span key="s" className="a-chip a-chip-active">active</span>, <div key="a" className="flex gap-1"><button className="a-btn a-btn-sm"><Copy size={12} /></button><button className="a-btn a-btn-sm"><Trash2 size={12} /></button></div>],
      [<code key="c" className="text-[13px] text-white">WELCOME50</code>, money(50), "∞","3218", "never", <span key="s" className="a-chip a-chip-active">active</span>, <div key="a" className="flex gap-1"><button className="a-btn a-btn-sm"><Copy size={12} /></button><button className="a-btn a-btn-sm"><Trash2 size={12} /></button></div>],
      [<code key="c" className="text-[13px] text-white">VIP2000</code>, money(2000), "50","12", "31 Dec 2026", <span key="s" className="a-chip a-chip-active">active</span>, <div key="a" className="flex gap-1"><button className="a-btn a-btn-sm"><Copy size={12} /></button><button className="a-btn a-btn-sm"><Trash2 size={12} /></button></div>],
      [<code key="c" className="text-[13px] text-white">HOLI200</code>, money(200), "500","500", "expired", <span key="s" className="a-chip a-chip-danger">exhausted</span>, <div key="a" className="flex gap-1"><button className="a-btn a-btn-sm"><Copy size={12} /></button><button className="a-btn a-btn-sm"><Trash2 size={12} /></button></div>],
    ],
  });
}
export function SettingsPage() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="a-card">
        <div className="text-white text-[14px] font-semibold mb-3">General</div>
        <label className="a-label">Default currency</label>
        <select className="a-select"><option>INR (₹)</option><option>USD ($)</option><option>Star (★)</option></select>
        <label className="a-label mt-3">Timezone</label>
        <select className="a-select"><option>Asia/Kolkata (IST)</option><option>UTC</option></select>
        <label className="a-label mt-3">Language</label>
        <select className="a-select"><option>English</option><option>Hindi</option></select>
      </div>
      <div className="a-card">
        <div className="text-white text-[14px] font-semibold mb-3">Notifications</div>
        <ToggleRow label="Email alerts on deposit" desc="Notify finance moderators" on />
        <ToggleRow label="Telegram alerts on withdrawal" desc="Instant ping to admin group" on />
        <ToggleRow label="Suspicious activity SMS" desc="Push to on-call number" on={false} />
      </div>
      <div className="a-card">
        <div className="text-white text-[14px] font-semibold mb-3">Integrations</div>
        {["Razorpay","PhonePe","UPI Intent","USDT (TRC-20)","Telegram Bot","Firebase FCM"].map((n) => (
          <div key={n} className="flex items-center justify-between py-2 border-b" style={{ borderColor: "var(--a-border)" }}>
            <div className="text-[13px]">{n}</div>
            <span className="a-chip a-chip-active"><Check size={10} /> connected</span>
          </div>
        ))}
      </div>
      <div className="a-card">
        <div className="text-white text-[14px] font-semibold mb-3">Danger zone</div>
        <button className="a-btn w-full justify-center mt-2" style={{ color: "var(--a-red)", borderColor: "rgba(255,91,106,0.35)" }}>Clear cache</button>
        <button className="a-btn w-full justify-center mt-2" style={{ color: "var(--a-red)", borderColor: "rgba(255,91,106,0.35)" }}>Reset admin sessions</button>
      </div>
    </div>
  );
}
export function DepositTypePage() {
  return GenericTable({
    eyebrow: "CONFIGURATION", title: "Deposit types & minimums",
    right: <button className="a-btn a-btn-primary"><Plus size={14} /> Add method</button>,
    headers: ["Method","Min","Max","Fee %","Status","Actions"],
    rows: [
      ["UPI", money(100), money(100000), "0%", <span key="1" className="a-chip a-chip-active">enabled</span>, <button key="2" className="a-btn a-btn-sm"><Edit3 size={12} /></button>],
      ["Bank transfer", money(500), money(500000), "0%", <span key="1" className="a-chip a-chip-active">enabled</span>, <button key="2" className="a-btn a-btn-sm"><Edit3 size={12} /></button>],
      ["USDT TRC-20", "$5", "$5000", "1%", <span key="1" className="a-chip a-chip-active">enabled</span>, <button key="2" className="a-btn a-btn-sm"><Edit3 size={12} /></button>],
      ["Cards", money(200), money(50000), "2%", <span key="1" className="a-chip a-chip-warn">beta</span>, <button key="2" className="a-btn a-btn-sm"><Edit3 size={12} /></button>],
    ],
  });
}
export function WithdrawLimitPage() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="a-card">
        <div className="text-white text-[14px] font-semibold mb-3">Global withdraw limits</div>
        <label className="a-label">Min withdraw (₹)</label><input className="a-input" defaultValue="200" />
        <label className="a-label mt-3">Max per transaction (₹)</label><input className="a-input" defaultValue="50000" />
        <label className="a-label mt-3">Max per day (₹)</label><input className="a-input" defaultValue="200000" />
        <label className="a-label mt-3">Max per month (₹)</label><input className="a-input" defaultValue="2000000" />
        <label className="a-label mt-3">Withdraw window</label>
        <select className="a-select"><option>24 × 7</option><option>10:00 – 22:00 IST</option></select>
        <button className="a-btn a-btn-primary w-full mt-4 justify-center">Save limits</button>
      </div>
      <div className="a-card">
        <div className="text-white text-[14px] font-semibold mb-3">Per-rank overrides</div>
        <table className="a-table">
          <thead><tr><th>Rank</th><th>Min ₹</th><th>Daily cap ₹</th></tr></thead>
          <tbody>
            {[{r:"Player",m:200,c:50000},{r:"VIP",m:200,c:200000},{r:"Executive",m:200,c:500000},{r:"Crown",m:200,c:2000000}].map((x)=>(
              <tr key={x.r}><td>{x.r}</td><td><input className="a-input" defaultValue={x.m} /></td><td><input className="a-input" defaultValue={x.c} /></td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export function ProfilePage() {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="a-card md:col-span-1 text-center">
        <div className="h-24 w-24 rounded-2xl mx-auto flex items-center justify-center text-[36px] font-bold" style={{ background:"linear-gradient(135deg,#4de3d3,#4aa8ff)", color:"#04070d" }}>A</div>
        <div className="text-white text-[16px] font-bold mt-3">Admin</div>
        <div className="text-[12px]" style={{ color: "var(--a-text-dim)" }}>admin@gmail.com</div>
        <span className="a-chip a-chip-admin mt-3 inline-flex">super-admin</span>
        <div className="grid grid-cols-2 gap-2 mt-4 text-left">
          <div className="a-card-tight a-card"><div className="text-[11px]" style={{ color: "var(--a-text-mute)" }}>SESSIONS</div><div className="text-white font-semibold">14</div></div>
          <div className="a-card-tight a-card"><div className="text-[11px]" style={{ color: "var(--a-text-mute)" }}>ACTIONS</div><div className="text-white font-semibold">1,284</div></div>
        </div>
      </div>
      <div className="md:col-span-2 a-card">
        <div className="text-white text-[14px] font-semibold mb-3">Account details</div>
        <div className="grid md:grid-cols-2 gap-3">
          <div><label className="a-label">Full name</label><input className="a-input" defaultValue="Admin" /></div>
          <div><label className="a-label">Username</label><input className="a-input" defaultValue="admin" /></div>
          <div><label className="a-label">Email</label><input className="a-input" defaultValue="admin@gmail.com" /></div>
          <div><label className="a-label">Phone</label><input className="a-input" defaultValue="1234567890" /></div>
          <div><label className="a-label">New password</label><input className="a-input" type="password" placeholder="••••••" /></div>
          <div><label className="a-label">Confirm password</label><input className="a-input" type="password" placeholder="••••••" /></div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button className="a-btn">Cancel</button>
          <button className="a-btn a-btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  );
}
