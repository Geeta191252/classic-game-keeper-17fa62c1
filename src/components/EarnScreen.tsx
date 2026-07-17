import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import createAdHandler from "monetag-tg-sdk";
import { useBalanceContext } from "@/contexts/BalanceContext";
import { getTelegramUser } from "@/lib/telegram";
import { Coins, Check, Gift } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://broken-bria-chetan1-ea890b93.koyeb.app/api";

// Initialize Monetag ad handler with zone ID
const adHandler = createAdHandler(10648653);

const tasks = [
  {
    title: "Watch short ads",
    subtitle: "Rewarded Interstitial",
    emoji: "🤩",
    maxAds: 5,
  },
  {
    title: "Click to get reward",
    subtitle: "Rewarded Popup",
    emoji: "😎",
    maxAds: 7,
  },
];

const getTodayKey = () => new Date().toISOString().slice(0, 10);

const loadTodayCounts = (): number[] => {
  try {
    const saved = localStorage.getItem("earn_ad_counts");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.date === getTodayKey()) return parsed.counts;
    }
  } catch {}
  return tasks.map(() => 0);
};

const saveTodayCounts = (counts: number[]) => {
  localStorage.setItem("earn_ad_counts", JSON.stringify({ date: getTodayKey(), counts }));
};

const EarnScreen = () => {
  const [adCounts, setAdCounts] = useState<number[]>(loadTodayCounts);
  const [loadingIdx, setLoadingIdx] = useState<number | null>(null);
  const { refreshBalance } = useBalanceContext();

  const handleClaim = async (idx: number) => {
    if (loadingIdx !== null) return;
    if (adCounts[idx] >= tasks[idx].maxAds) {
      toast.info("Today's limit reached! Come back tomorrow.");
      return;
    }

    setLoadingIdx(idx);
    try {
      const user = getTelegramUser();
      const userId = user?.id || "demo";

      await adHandler(String(userId));

      const newCounts = [...adCounts];
      newCounts[idx] += 1;
      setAdCounts(newCounts);
      saveTodayCounts(newCounts);

      await fetch(`${API_BASE_URL}/game/result`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          betAmount: 0,
          winAmount: 1,
          currency: "star",
          game: "ad-reward",
        }),
      });

      refreshBalance();
      toast.success(`Ad complete! +1 ⭐ earned (${newCounts[idx]}/${tasks[idx].maxAds})`);
    } catch {
      toast.info("Ad skipped or closed.");
    } finally {
      setLoadingIdx(null);
    }
  };

  const totalWatched = adCounts.reduce((a, b) => a + b, 0);

  return (
    <div className="px-4 pt-4 space-y-4 bg-[#0e131f] text-[#8e97a4] min-h-screen">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-4 flex items-center gap-3 bg-[#141b2b] border border-white/[0.02] shadow-md"
      >
        <span className="text-2xl">🎁</span>
        <div>
          <h2 className="font-extrabold text-sm text-white">Daily Tasks</h2>
          <p className="text-[10px] text-[#8e97a4] mt-0.5">Watch rewarded ads and claim bonus stars</p>
        </div>
      </motion.div>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.map((task, i) => (
          <motion.div
            key={task.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#141b2b] border border-white/[0.02] shadow-md"
          >
            <div className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0 text-xl bg-[#0d121f] border border-white/[0.01]">
              {task.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-xs truncate text-white">
                {task.title}
              </h4>
              <p className="text-[10px] truncate text-slate-400 mt-0.5">
                {task.subtitle} • {adCounts[i]}/{task.maxAds}
              </p>
            </div>
            {adCounts[i] >= task.maxAds ? (
              <span className="px-3 py-1.5 rounded-xl text-[9px] font-black uppercase shrink-0 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                Done
              </span>
            ) : (
              <button
                onClick={() => handleClaim(i)}
                disabled={loadingIdx !== null}
                className="px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wide shrink-0 transition-transform active:scale-95 bg-[#00a2e8] hover:bg-[#0091d0] text-white disabled:opacity-50"
              >
                {loadingIdx === i ? "..." : "Claim"}
              </button>
            )}
          </motion.div>
        ))}
      </div>

      <div className="bg-[#141b2b] border border-white/[0.02] rounded-2xl p-4 text-center shadow-sm">
        <p className="text-slate-400 text-[10px] mb-0.5 uppercase tracking-wider font-extrabold">Ads Watched Today</p>
        <p className="text-2xl font-black text-white">{totalWatched} <span className="text-xs font-semibold text-[#8e97a4]">/ {tasks.reduce((a, t) => a + t.maxAds, 0)}</span></p>
      </div>

      <div className="text-[10px] text-[#8e97a4] text-center px-2 space-y-1.5 pt-2 border-t border-white/[0.03]">
        <p>📌 1 ad dekhne par 1 ⭐ milega! / Watch 1 ad to earn 1 ⭐!</p>
        <p>💰 Ads se milne wale stars aapke Star wallet mein add honge.</p>
      </div>
    </div>
  );
};

export default EarnScreen;
