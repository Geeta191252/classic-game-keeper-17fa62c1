/**
 * iGamingAPI / SoftAPI (igamingapis.live) seamless-wallet integration.
 *
 * Flow:
 *  1. Frontend asks for the provider game list  -> GET  /api/igaming/games
 *  2. Frontend launches a game                  -> POST /api/igaming/launch
 *     We send the player's current wallet balance to SoftAPI (AES-256-ECB payload).
 *  3. SoftAPI POSTs every bet/settle to         -> POST /api/igaming/notify
 *     `credit_amount` is the authoritative balance after the round, so we apply the
 *     delta to the user's wallet and log bet/win transactions.
 */

const crypto = require("crypto");

const API_URL = process.env.IGAMING_API_URL || "https://igamingapis.live/api/v1";
const TOKEN = process.env.IGAMING_TOKEN || "";
const SECRET = process.env.IGAMING_SECRET || "";

const IgamingSession = require("./models/IgamingSession");
const IgamingRound = require("./models/IgamingRound");

const isConfigured = () => Boolean(TOKEN && SECRET && SECRET.length === 32);

// ---------- AES-256-ECB + PKCS7, base64 ----------
function encryptPayload(obj) {
  if (SECRET.length !== 32) throw new Error("IGAMING_SECRET must be exactly 32 characters");
  const json = Buffer.from(JSON.stringify(obj), "utf8");
  const pad = 16 - (json.length % 16);
  const padded = Buffer.concat([json, Buffer.alloc(pad, pad)]);
  const cipher = crypto.createCipheriv("aes-256-ecb", Buffer.from(SECRET, "utf8"), null);
  cipher.setAutoPadding(false);
  return Buffer.concat([cipher.update(padded), cipher.final()]).toString("base64");
}

function decryptPayload(b64) {
  const decipher = crypto.createDecipheriv("aes-256-ecb", Buffer.from(SECRET, "utf8"), null);
  decipher.setAutoPadding(false);
  const raw = Buffer.concat([decipher.update(Buffer.from(b64, "base64")), decipher.final()]);
  const pad = raw[raw.length - 1];
  const clean = pad > 0 && pad <= 16 ? raw.subarray(0, raw.length - pad) : raw;
  return JSON.parse(clean.toString("utf8"));
}

// ---------- small in-memory cache for list APIs ----------
const cache = new Map();
async function cachedJson(url, ttlMs = 5 * 60 * 1000) {
  const hit = cache.get(url);
  if (hit && Date.now() - hit.at < ttlMs) return hit.data;
  const res = await fetch(url);
  const data = await res.json();
  cache.set(url, { at: Date.now(), data });
  return data;
}

const CURRENCY_CODE = { rupee: "INR", dollar: "USD" };

function registerIgaming(app, { User, Transaction, getBackendUrl, notifyOwner }) {
  const callbackUrl = () => `${getBackendUrl()}/api/igaming/notify`;
  const returnUrl = () => `${getBackendUrl()}/`;

  // ---------------- Providers ----------------
  app.get("/api/igaming/providers", async (req, res) => {
    if (!isConfigured()) return res.json({ enabled: false, providers: [] });
    try {
      const json = await cachedJson(`${API_URL}/providers?token=${encodeURIComponent(TOKEN)}`);
      return res.json({ enabled: true, providers: json?.data?.providers || [] });
    } catch (e) {
      console.error("[igaming] providers error:", e.message);
      return res.status(502).json({ error: "Failed to load providers" });
    }
  });

  // ---------------- Games ----------------
  app.get("/api/igaming/games", async (req, res) => {
    if (!isConfigured()) return res.json({ enabled: false, games: [] });
    try {
      const brandId = req.query.brand_id;
      const limit = Math.min(Number(req.query.limit) || 200, 500);
      let brands = [];
      if (brandId) {
        brands = [Number(brandId)];
      } else {
        const p = await cachedJson(`${API_URL}/providers?token=${encodeURIComponent(TOKEN)}`);
        brands = (p?.data?.providers || []).map((x) => x.brand_id);
      }
      const games = [];
      for (const b of brands) {
        const j = await cachedJson(
          `${API_URL}/games?token=${encodeURIComponent(TOKEN)}&brand_id=${b}&limit=${limit}&offset=0`
        );
        for (const g of j?.data?.games || []) {
          games.push({
            gameId: g.game_id,
            gameUid: String(g.game_uid),
            name: g.name,
            provider: g.provider || j?.data?.brand_name,
            category: g.category,
            logo: g.logo,
            rtp: g.rtp,
          });
        }
      }
      return res.json({ enabled: true, games });
    } catch (e) {
      console.error("[igaming] games error:", e.message);
      return res.status(502).json({ error: "Failed to load games" });
    }
  });

  // ---------------- Launch ----------------
  app.post("/api/igaming/launch", async (req, res) => {
    if (!isConfigured()) {
      return res.status(503).json({ error: "Provider not configured" });
    }
    try {
      const { userId, gameUid, currency = "rupee", gameName, language = "en" } = req.body || {};
      const numericId = Number(userId);
      if (!numericId || !gameUid) return res.status(400).json({ error: "Missing userId or gameUid" });
      if (!CURRENCY_CODE[currency]) return res.status(400).json({ error: "Unsupported currency" });

      const user = await User.findOne({ telegramId: numericId });
      if (!user) return res.status(404).json({ error: "User not found" });

      const depositField = currency === "rupee" ? "rupeeBalance" : "dollarBalance";
      const winField = currency === "rupee" ? "rupeeWinning" : "dollarWinning";
      const balance = Math.floor(((user[depositField] || 0) + (user[winField] || 0)) * 100) / 100;

      if (balance <= 0) return res.status(400).json({ error: "Insufficient balance" });

      // Close any stale sessions for this player so notifies map to the new one.
      await IgamingSession.updateMany({ telegramId: numericId, active: true }, { $set: { active: false } });
      const session = await IgamingSession.create({
        telegramId: numericId,
        currency,
        currencyCode: CURRENCY_CODE[currency],
        gameUid: String(gameUid),
        gameName: gameName || "",
        startBalance: balance,
        lastBalance: balance,
        active: true,
      });

      const payload = {
        user_id: numericId,
        balance,
        game_uid: String(gameUid),
        token: TOKEN,
        timestamp: Date.now(),
        return: returnUrl(),
        callback: callbackUrl(),
        currency_code: CURRENCY_CODE[currency],
        language,
      };

      const upstream = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ token: TOKEN, payload: encryptPayload(payload) }),
      });
      const json = await upstream.json().catch(() => ({}));

      if (Number(json?.code) !== 0 || !json?.data?.url) {
        session.active = false;
        await session.save();
        console.error("[igaming] launch failed:", upstream.status, JSON.stringify(json));
        return res.status(502).json({
          error: json?.msg || "Launch failed",
          status: upstream.status,
          details: json,
        });
      }

      return res.json({ url: json.data.url, sessionId: session._id, balance });
    } catch (e) {
      console.error("[igaming] launch error:", e);
      return res.status(500).json({ error: e.message });
    }
  });

  // ---------------- Callback (bet / settle notify) ----------------
  app.post("/api/igaming/notify", async (req, res) => {
    // SoftAPI needs a fast HTTP 200 — always answer OK unless the body is unusable.
    let body = req.body || {};
    try {
      if (body.payload && typeof body.payload === "string") body = decryptPayload(body.payload);
    } catch (e) {
      console.error("[igaming] notify decrypt failed:", e.message);
      return res.status(200).send("OK");
    }

    res.status(200).send("OK");

    try {
      const serial = String(body.serial_number || "");
      const telegramId = Number(body.member_account);
      if (!serial || !telegramId) return;

      // Idempotency
      const exists = await IgamingRound.findOne({ serialNumber: serial }).lean();
      if (exists) return;

      const session =
        (await IgamingSession.findOne({ telegramId, active: true }).sort({ createdAt: -1 })) ||
        (await IgamingSession.findOne({ telegramId }).sort({ createdAt: -1 }));
      if (!session) {
        console.warn("[igaming] notify without session for", telegramId);
        return;
      }

      const credit = Number(body.credit_amount);
      const betAmount = Number(body.bet_amount) || 0;
      const winAmount = Number(body.win_amount) || 0;
      const delta = Number.isFinite(credit)
        ? Math.round((credit - session.lastBalance) * 100) / 100
        : Math.round((winAmount - betAmount) * 100) / 100;

      await IgamingRound.create({
        serialNumber: serial,
        telegramId,
        gameUid: String(body.game_uid || session.gameUid || ""),
        gameName: body.game_name || session.gameName,
        gameRound: String(body.game_round || ""),
        currency: session.currency,
        betAmount,
        winAmount,
        creditAmount: Number.isFinite(credit) ? credit : 0,
        delta,
      });

      const user = await User.findOne({ telegramId });
      if (!user) return;

      const depositField = session.currency === "rupee" ? "rupeeBalance" : "dollarBalance";
      const winField = session.currency === "rupee" ? "rupeeWinning" : "dollarWinning";
      const gameLabel = body.game_name || session.gameName || "Provider game";

      if (delta > 0) {
        user[winField] = Math.round(((user[winField] || 0) + delta) * 100) / 100;
      } else if (delta < 0) {
        let remaining = -delta;
        const fromDeposit = Math.min(user[depositField] || 0, remaining);
        user[depositField] = Math.round(((user[depositField] || 0) - fromDeposit) * 100) / 100;
        remaining = Math.round((remaining - fromDeposit) * 100) / 100;
        if (remaining > 0) {
          user[winField] = Math.max(0, Math.round(((user[winField] || 0) - remaining) * 100) / 100);
        }
      }
      await user.save();

      session.lastBalance = Number.isFinite(credit) ? credit : session.lastBalance + delta;
      session.totalBet = Math.round((session.totalBet + betAmount) * 100) / 100;
      session.totalWin = Math.round((session.totalWin + winAmount) * 100) / 100;
      await session.save();

      if (betAmount > 0) {
        await Transaction.create({
          telegramId,
          type: "bet",
          currency: session.currency,
          amount: -betAmount,
          status: "completed",
          game: gameLabel,
          description: `${gameLabel} bet`,
        });
      }
      if (winAmount > 0) {
        await Transaction.create({
          telegramId,
          type: "win",
          currency: session.currency,
          amount: winAmount,
          status: "completed",
          game: gameLabel,
          description: `${gameLabel} win`,
        });
      }
    } catch (e) {
      console.error("[igaming] notify error:", e);
    }
  });

  // ---------------- Session close (player returned to lobby) ----------------
  app.post("/api/igaming/close", async (req, res) => {
    try {
      const numericId = Number(req.body?.userId);
      if (!numericId) return res.status(400).json({ error: "Missing userId" });
      await IgamingSession.updateMany({ telegramId: numericId, active: true }, { $set: { active: false } });
      return res.json({ ok: true });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  });

  // ---------------- Admin: GGR wallet + status ----------------
  app.get("/api/igaming/status", async (req, res) => {
    if (!isConfigured()) {
      return res.json({ enabled: false, reason: "IGAMING_TOKEN / IGAMING_SECRET missing (secret must be 32 chars)" });
    }
    try {
      const j = await cachedJson(`${API_URL}/ggr-balance?token=${encodeURIComponent(TOKEN)}`, 60 * 1000);
      return res.json({ enabled: true, ggrWallet: j?.data?.wallet ?? null, callback: callbackUrl() });
    } catch (e) {
      return res.status(502).json({ enabled: true, error: e.message });
    }
  });

  console.log(
    isConfigured()
      ? "✅ iGamingAPI provider integration enabled"
      : "⚠️  iGamingAPI disabled — set IGAMING_TOKEN and 32-char IGAMING_SECRET"
  );
}

module.exports = { registerIgaming, isConfigured, encryptPayload, decryptPayload };
