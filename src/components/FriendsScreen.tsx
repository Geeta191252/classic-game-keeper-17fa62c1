import { motion } from "framer-motion";
import { Copy, Send, Check } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";
import { getTelegramUser, getTelegram } from "@/lib/telegram";
import { useBalance } from "@/hooks/useBalance";

const inviteTasks = [
  { title: "Invite 1st friend", reward: "5 ⭐", icon: "⭐", target: 1 },
  { title: "Invite 2nd friend", reward: "5 ⭐", icon: "⭐", target: 2 },
  { title: "Invite 3rd friend", reward: "5 ⭐", icon: "⭐", target: 3 },
];

const FriendsScreen = () => {
  const user = getTelegramUser();
  const userId = user?.id || "unknown";
  const referralLink = `https://t.me/RoyalKingGameBot?start=ref_${userId}`;
  const { data } = useBalance();
  const referralCount = data?.referralCount || 0;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast({ title: "Copied!", description: "Referral link copied to clipboard." });
  };

  return (
    <div className="px-4 pt-4 space-y-4 bg-[#0e131f] text-[#8e97a4] min-h-screen">
      
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-4 flex items-center gap-3 bg-[#141b2b] border border-white/[0.02] shadow-md"
      >
        <span className="text-2xl">👥</span>
        <div>
          <h2 className="font-extrabold text-sm text-white">Invite Friends</h2>
          <p className="text-[10px] text-[#8e97a4] mt-0.5">Share invite links to earn bonus stars</p>
        </div>
      </motion.div>

      {/* Referral Link Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#141b2b] border border-white/[0.02] rounded-2xl p-4 space-y-3 shadow-md"
      >
        <p className="text-[9px] font-extrabold tracking-wider uppercase text-slate-400">Your unique referral link</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-[#0d121f] border border-white/[0.01] rounded-xl px-3 py-2 font-mono text-[10px] text-slate-200 truncate select-all">
            {referralLink}
          </div>
          <button 
            onClick={copyLink} 
            className="h-8 w-8 rounded-xl shrink-0 bg-[#0d121f] border border-white/[0.02] flex items-center justify-center text-slate-300 hover:text-white"
          >
            <Copy className="h-4 w-4" />
          </button>
        </div>
        <button
          className="w-full rounded-xl h-10 text-xs font-black uppercase tracking-wider bg-[#00a2e8] hover:bg-[#0091d0] text-white shadow-md shadow-[#00a2e8]/20 transition-transform active:scale-97 flex items-center justify-center gap-1.5"
          onClick={() => {
            const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent("🎮 Royal King Game bot open karo, tasks pure karo aur free cash balance kamao!")}`;
            const tg = getTelegram();
            if (tg?.openTelegramLink) {
              tg.openTelegramLink(shareUrl);
            } else {
              window.open(shareUrl, "_blank");
            }
          }}
        >
          <Send className="h-3.5 w-3.5" /> Invite Friends
        </button>
      </motion.div>

      {/* Invite Tasks */}
      <div className="space-y-2">
        {inviteTasks.map((task, i) => {
          const completed = referralCount >= task.target;
          return (
            <motion.div
              key={task.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center gap-3 p-3.5 rounded-2xl border ${completed ? "bg-emerald-500/5 border-emerald-500/15" : "bg-[#141b2b] border-white/[0.02]"}`}
            >
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 text-lg ${completed ? "bg-emerald-500/10 text-emerald-400" : "bg-[#0d121f] border border-white/[0.02]"}`}>
                {completed ? <Check className="h-4 w-4 text-emerald-400" /> : "🧑‍🤝‍🧑"}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-xs text-white">{task.title}</h4>
                {completed && <p className="text-[8px] text-emerald-400 mt-0.5 uppercase font-bold">Completed</p>}
              </div>
              <span className="text-xs font-bold text-slate-200 shrink-0">{task.reward}</span>
              <span className="text-sm shrink-0 ml-1">{task.icon}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Total Referral Count */}
      <div className="bg-[#141b2b] border border-white/[0.02] rounded-2xl p-4 text-center shadow-sm">
        <p className="text-slate-400 text-[10px] mb-0.5 uppercase tracking-wider font-extrabold">Total Referrals</p>
        <p className="text-2xl font-black text-white">{referralCount}</p>
      </div>

      <div className="text-[10px] text-[#8e97a4] text-center px-2 space-y-1.5 pt-2 border-t border-white/[0.03]">
        <p>📌 Har refer par aapko 5 ⭐ milega — jab aapka friend join karega.</p>
        <p>⭐ Refer se milne wale Stars aapke Star wallet mein add honge.</p>
      </div>
    </div>
  );
};

export default FriendsScreen;
