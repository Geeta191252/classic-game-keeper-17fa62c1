import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, LifeBuoy, Loader2 } from "lucide-react";
import { getTelegramUser } from "@/lib/telegram";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `${window.location.origin}/api`;

interface SupportMsg {
  _id: string;
  sender: "user" | "admin";
  text: string;
  createdAt: string;
  adminName?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

const SupportModal = ({ open, onClose }: Props) => {
  const [messages, setMessages] = useState<SupportMsg[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const user = getTelegramUser();
  const telegramId = user?.id;

  const load = useCallback(async () => {
    if (!telegramId) return;
    try {
      const res = await fetch(`${API_BASE_URL}/support/my/${telegramId}`);
      const data = await res.json();
      setMessages(data.messages || []);
    } catch { /* ignore */ }
  }, [telegramId]);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    load().finally(() => setLoading(false));
    const id = setInterval(load, 4000);
    return () => clearInterval(id);
  }, [open, load]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const clean = text.trim();
    if (!clean || sending) return;
    if (!telegramId) {
      alert("Open this inside Telegram to use support.");
      return;
    }
    setSending(true);
    // optimistic
    const optimistic: SupportMsg = {
      _id: `tmp-${Date.now()}`,
      sender: "user",
      text: clean,
      createdAt: new Date().toISOString(),
    };
    setMessages((m) => [...m, optimistic]);
    setText("");
    try {
      await fetch(`${API_BASE_URL}/support/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          telegramId,
          username: user?.username,
          firstName: user?.first_name,
          lastName: user?.last_name,
          text: clean,
        }),
      });
      load();
    } catch {
      // rollback optimistic on failure
      setMessages((m) => m.filter((x) => x._id !== optimistic._id));
      alert("Failed to send. Try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-x-0 bottom-0 z-[61] mx-auto max-w-md h-[85vh] bg-[#0e131f] border-t border-white/10 rounded-t-3xl flex flex-col shadow-2xl"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#00a2e8] to-[#0064b1] flex items-center justify-center">
                  <LifeBuoy className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Support</div>
                  <div className="text-[10px] text-slate-400">We reply as soon as possible</div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="h-9 w-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
              {loading && messages.length === 0 && (
                <div className="flex justify-center py-8 text-slate-400">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              )}
              {!loading && messages.length === 0 && (
                <div className="text-center text-slate-400 text-xs py-10 px-6">
                  <LifeBuoy className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  Send us a message — the team will reply here and in your Telegram chat.
                </div>
              )}
              {messages.map((m) => {
                const mine = m.sender === "user";
                return (
                  <div key={m._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[78%] px-3 py-2 rounded-2xl text-[12px] whitespace-pre-wrap break-words ${
                        mine
                          ? "bg-[#00a2e8] text-white rounded-br-sm"
                          : "bg-[#1a2236] text-slate-100 border border-white/5 rounded-bl-sm"
                      }`}
                    >
                      {!mine && (
                        <div className="text-[9px] font-bold uppercase text-[#4de3d3] mb-0.5">
                          {m.adminName ? "Admin" : "Support"}
                        </div>
                      )}
                      {m.text}
                      <div className={`text-[9px] mt-1 opacity-60 ${mine ? "text-white" : "text-slate-400"}`}>
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* Composer */}
            <div className="p-3 border-t border-white/10 bg-[#0b101a]">
              <div className="flex items-end gap-2">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
                  }}
                  placeholder="Type your message…"
                  rows={1}
                  className="flex-1 resize-none max-h-28 rounded-2xl bg-[#141b2b] border border-white/10 px-3 py-2 text-[12px] text-white outline-none focus:border-[#00a2e8]"
                />
                <button
                  onClick={send}
                  disabled={sending || !text.trim()}
                  className="h-10 w-10 rounded-full bg-[#00a2e8] disabled:opacity-40 flex items-center justify-center text-white"
                >
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SupportModal;
