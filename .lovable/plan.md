# Admin Panel — Real Data + Universal Login

Aapke Koyeb backend (Node + MongoDB) ke saath admin panel connect karunga. Sirf real data — koi dummy nahi. Login browser aur Telegram mini app dono mein chalega.

---

## 1. Backend — naye admin API endpoints (`backend/src/index.js`)

Ek `ADMIN_TOKEN` env variable use hoga (Koyeb env mein set karenge). Har admin request `Authorization: Bearer <token>` header bhejegi.

Naye endpoints:

| Route | Kaam | Data source |
|---|---|---|
| `POST /api/admin/login` | email+password check → token return | env `ADMIN_EMAIL` / `ADMIN_PASSWORD` |
| `GET /api/admin/dashboard` | totals: users, deposits, withdrawals, revenue, active players | `User`, `Transaction`, `GameBet` aggregate |
| `GET /api/admin/users` | list + search + pagination | `User` |
| `GET /api/admin/users/:id` | single user detail + balance + tx history | `User` + `Transaction` |
| `POST /api/admin/wallet-adjust` | admin adds/removes balance | `User.update` + `Transaction.insert` |
| `GET /api/admin/deposits` | filter by status/date | `Transaction` where type=deposit |
| `GET /api/admin/withdrawals` | + approve/reject actions | `Transaction` where type=withdraw |
| `POST /api/admin/withdrawals/:id/approve` | mark completed | `Transaction.update` |
| `POST /api/admin/withdrawals/:id/reject` | refund + reject | `Transaction.update` + `User.update` |
| `GET /api/admin/games` | per-game bet totals + revenue | `GameBet` aggregate |
| `GET /api/admin/transactions` | full ledger with filters | `Transaction` |
| `GET /api/admin/settings` / `POST /api/admin/settings` | read/write config | `Setting` |
| `GET /api/admin/analytics?range=7d` | day-wise deposits/withdrawals/bets | aggregate |

Un pages ke liye jinke liye backend collections abhi exist nahi karte (MLM Plans, Salary Plans, Rank Plans, Bonus Settings, Aviator Bucket, Cron Management, Gift Codes, Site & Logo, User Theme, Announcements, Moderators, Support tickets, Forgotten Passwords, Spare Wallet, Bonus & Income Report, Financials Report, Daily Analytics, Deposit Type/Min, Withdraw Limit) — inke liye 2 options:

**A.** Naye Mongo models banau (`Announcement`, `GiftCode`, `Moderator`, `SupportTicket`, `MLMPlan`, etc.) — bahut kaam, aur aapke actual app mein yeh features abhi hain hi nahi.
**B.** In pages ko "Coming soon — feature not enabled in backend" state dikhau, taaki koi fake data na dikhe.

Main **B** recommend karta hu (aapne bola "fake data nahi chahiye"). Jab kabhi feature enable karna ho, tab schema + endpoint add kar denge.

---

## 2. Frontend — real API integration

**Naya file `src/lib/adminApi.ts`:**
- `adminLogin(email, password)` → token localStorage mein save
- `adminFetch(path, options)` → `Authorization` header attach karta hu, 401 pe login pe redirect
- Har endpoint ke liye typed helper: `getDashboard()`, `listUsers()`, `adjustWallet()`, etc.

**`src/pages/admin/AdminLogin.tsx`:**
- Real form submit → `adminLogin()` call → token store → `/admin/dashboard` redirect
- Error toast on wrong credentials

**Auth guard:** `AdminLayout` mein `useEffect` check karega token; nahi hai to `/admin` login pe bhejega. Yeh browser + Telegram mini app dono mein same tarah kaam karega (localStorage dono mein available hai).

**Pages jinme real data lagega:**
- Dashboard → live stats cards + recent activity
- Users → real user list, search, click → detail drawer
- Wallet Adjust → user select + amount + currency → real balance update
- Deposits / Withdrawals → real transactions, approve/reject buttons
- Transactions / Analytics → real filtered lists + charts
- Games → real per-game revenue table
- Settings → real DB-backed config editor

**Pages jo abhi backend mein exist nahi karte:** unme ek clean "Feature not connected yet" empty state (dummy tables hata denge). Aapko batayi jaayegi list ke saath kya-kya baad mein add karna hai.

---

## 3. Mini app compatibility

- Admin login page ko Telegram webview mein bhi khulne dena hai. Current mini app entry `Index.tsx` par redirect karta hai; main check add karunga: agar URL `/admin*` hai to Telegram wrapper skip karke seedhe admin route render kare.
- Telegram webview mein `localStorage` supported hai, so token-based auth chalega.

---

## 4. Deployment steps (aapko karna hoga)

1. Koyeb dashboard mein env vars add karo:
   - `ADMIN_EMAIL=admin@gmail.com`
   - `ADMIN_PASSWORD=Admin@123` (baad mein change kar dena)
   - `ADMIN_TOKEN_SECRET=<random 32 char>` (main `generate_secret`-style random suggest karunga)
2. Backend redeploy karo Koyeb pe (naya code push karke).
3. Lovable app auto-deploy ho jayegi.

---

## Technical details

- Token = HMAC-signed JSON (no external JWT lib needed) OR simple random token stored in memory / small `AdminSession` collection. Main **stateless HMAC token** use karunga — koi DB overhead nahi.
- All admin endpoints ek `requireAdmin(req, res, next)` middleware se pass honge.
- CORS already open hai backend mein, so browser fetch chalega.
- Rate limit: 5 login attempts / minute per IP (basic in-memory).

---

## Not in scope (confirm karo agar chahiye)

- Password reset flow for admin
- Multiple admin accounts / role-based permissions (abhi single admin)
- Real-time updates (websockets) — abhi manual refresh / polling
- MLM/Salary/Rank/Bonus schemas — jab actual feature banao tab

**Confirm karo — start karu?**
