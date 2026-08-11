import { useEffect, useRef, useState, useCallback } from "react";
import { LifeBuoy, Send, RefreshCw, Loader2, Trash2, MessageSquare } from "lucide-react";
import {
  listSupportThreads, getSupportThread, replySupport, deleteSupportThread,
  type SupportThread, type SupportMsg,
} from "@/lib/adminApi";

export default function SupportPage() {
  const [threads, setThreads] = useState<SupportThread[]>([]);
  const [active, setActive] = useState<SupportThread | null>(null);
  const [messages, setMessages] = useState<SupportMsg[]>([]);
  const [text, setText] = useState("");
  const [loadingThreads, setLoadingThreads] = useState(false);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadThreads = useCallback(async () => {
    setLoadingThreads(true);
    try {
      const { threads } = await listSupportThreads();
      setThreads(threads);
    } catch { /* noop */ } finally { setLoadingThreads(false); }
  }, []);

  const loadThread = useCallback(async (t: SupportThread) => {
    setActive(t);
    setLoadingMsgs(true);
    try {
      const { messages } = await getSupportThread(t.telegramId);
      setMessages(messages);
    } catch { /* noop */ } finally { setLoadingMsgs(false); }
  }, []);

  useEffect(() => { loadThreads(); }, [loadThreads]);
  useEffect(() => {
    const id = setInterval(() => {
      loadThreads();
      if (active) getSupportThread(active.telegramId).then((d) => setMessages(d.messages)).catch(() => {});
    }, 6000);
    return () => clearInterval(id);
  }, [loadThreads, active]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async () => {
    if (!active || !text.trim() || sending) return;
    setSending(true);
    const clean = text.trim();
    setText("");
    try {
      await replySupport(active.telegramId, clean);
      const { messages } = await getSupportThread(active.telegramId);
      setMessages(messages);
      loadThreads();
    } catch (e: any) {
      alert(e?.message || "Failed to send reply");
    } finally { setSending(false); }
  };

  const remove = async () => {
    if (!active) return;
    if (!confirm(`Delete entire support thread for user ${active.telegramId}?`)) return;
    try {
      await deleteSupportThread(active.telegramId);
      setActive(null); setMessages([]); loadThreads();
    } catch (e: any) { alert(e?.message || "Failed"); }
  };

  const label = (t: SupportThread) => t.firstName || t.username || `User ${t.telegramId}`;

  return (
    <div className="a-card p-0 overflow-hidden" style={{ height: "calc(100vh - 180px)" }}>
      <div className="grid grid-cols-12 h-full">
        {/* Threads list */}
        <div className="col-span-4 border-r flex flex-col" style={{ borderColor: "var(--a-border)" }}>
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--a-border)" }}>
            <div className="flex items-center gap-2">
              <LifeBuoy size={16} style={{ color: "var(--a-teal)" }} />
              <div className="text-white text-sm font-bold">Support Threads</div>
            </div>
            <button
              onClick={loadThreads}
              className="h-8 w-8 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(30,42,68,0.5)", border: "1px solid var(--a-border)" }}
              title="Refresh"
            >
              {loadingThreads ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {threads.length === 0 && !loadingThreads && (
              <div className="text-center text-slate-400 text-xs py-10 px-4">
                <MessageSquare size={24} className="mx-auto mb-2 opacity-40" />
                No support conversations yet.
              </div>
            )}
            {threads.map((t) => {
              const isActive = active?.telegramId === t.telegramId;
              return (
                <button
                  key={t.telegramId}
                  onClick={() => loadThread(t)}
                  className={`w-full text-left px-4 py-3 border-b hover:bg-white/[0.03] transition ${isActive ? "bg-white/[0.05]" : ""}`}
                  style={{ borderColor: "var(--a-border)" }}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-white text-[13px] font-bold truncate">{label(t)}</div>
                    {t.unread > 0 && (
                      <span className="text-[9px] font-black bg-red-500 text-white rounded-full px-1.5 py-0.5">
                        {t.unread}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    ID {t.telegramId} · {new Date(t.lastAt).toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-1">
                    <span className="opacity-60">{t.lastSender === "admin" ? "You: " : ""}</span>
                    {t.lastText}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Conversation */}
        <div className="col-span-8 flex flex-col">
          {!active ? (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
              Select a thread on the left to reply.
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--a-border)" }}>
                <div>
                  <div className="text-white text-sm font-bold">
                    @{label(active)} <span className="text-slate-400 font-normal">· {active.telegramId}</span>
                  </div>
                  <div className="text-[10px] text-slate-500">Tag & reply — message is delivered to their Telegram DM.</div>
                </div>
                <button
                  onClick={remove}
                  className="h-9 px-3 rounded-lg flex items-center gap-1.5 text-[11px] text-red-400"
                  style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-black/20">
                {loadingMsgs && messages.length === 0 && (
                  <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-slate-400" /></div>
                )}
                {messages.map((m) => {
                  const admin = m.sender === "admin";
                  return (
                    <div key={m._id} className={`flex ${admin ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] px-3 py-2 rounded-2xl text-[13px] whitespace-pre-wrap break-words ${
                        admin ? "bg-[#00a2e8] text-white rounded-br-sm" : "bg-[#1a2236] text-slate-100 border border-white/5 rounded-bl-sm"
                      }`}>
                        <div className={`text-[9px] font-bold uppercase mb-0.5 ${admin ? "text-white/70" : "text-[#4de3d3]"}`}>
                          {admin ? (m.adminName || "Admin") : label(active)}
                        </div>
                        {m.image && (
                          <img
                            src={m.image}
                            alt="Support attachment"
                            loading="lazy"
                            onClick={() => window.open(m.image, "_blank")}
                            className="mb-1 max-h-60 rounded-xl cursor-pointer"
                          />
                        )}
                        {m.text}
                        <div className={`text-[9px] mt-1 opacity-60 ${admin ? "text-white" : "text-slate-400"}`}>
                          {new Date(m.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              <div className="p-3 border-t flex items-end gap-2" style={{ borderColor: "var(--a-border)" }}>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                  placeholder={`Reply to @${label(active)}…`}
                  rows={2}
                  className="flex-1 resize-none max-h-32 rounded-xl bg-[#0a0f1a] border px-3 py-2 text-[13px] text-white outline-none"
                  style={{ borderColor: "var(--a-border)" }}
                />
                <button
                  onClick={send}
                  disabled={sending || !text.trim()}
                  className="h-11 px-4 rounded-xl flex items-center gap-2 text-[12px] font-bold text-white disabled:opacity-40"
                  style={{ background: "linear-gradient(135deg,#4de3d3,#4aa8ff)", color: "#04070d" }}
                >
                  {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  Send
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
