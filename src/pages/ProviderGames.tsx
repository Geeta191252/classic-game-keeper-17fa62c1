import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { useBalanceContext } from "@/contexts/BalanceContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `${window.location.origin}/api`;

type ProviderGame = {
  gameId: number;
  gameUid: string;
  name: string;
  provider?: string;
  category?: string;
  logo?: string;
  rtp?: number | string;
};

const ProviderGames = () => {
  const navigate = useNavigate();
  const { currencyDisplay } = useBalanceContext();
  const [games, setGames] = useState<ProviderGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [enabled, setEnabled] = useState(true);
  const [query, setQuery] = useState("");
  const [launching, setLaunching] = useState<string | null>(null);
  const [gameUrl, setGameUrl] = useState<string | null>(null);

  const userId = (window as any).Telegram?.WebApp?.initDataUnsafe?.user?.id;

  useEffect(() => {
    let alive = true;
    fetch(`${API_BASE_URL}/igaming/games`)
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return;
        setEnabled(d.enabled !== false);
        setGames(Array.isArray(d.games) ? d.games : []);
      })
      .catch(() => alive && setEnabled(false))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return games;
    return games.filter((g) => g.name?.toLowerCase().includes(q));
  }, [games, query]);

  const launch = async (game: ProviderGame) => {
    if (!userId) {
      toast.error("Open inside Telegram to play");
      return;
    }
    setLaunching(game.gameUid);
    try {
      const res = await fetch(`${API_BASE_URL}/igaming/launch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          gameUid: game.gameUid,
          gameName: game.name,
          currency: currencyDisplay === "INR" ? "rupee" : "dollar",
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Launch failed");
      setGameUrl(data.url);
    } catch (e: any) {
      toast.error(e.message || "Could not open game");
    } finally {
      setLaunching(null);
    }
  };

  const closeGame = async () => {
    setGameUrl(null);
    if (userId) {
      fetch(`${API_BASE_URL}/igaming/close`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      }).catch(() => {});
    }
  };

  if (gameUrl) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col">
        <button
          onClick={closeGame}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary-foreground bg-primary"
        >
          <ArrowLeft className="w-4 h-4" /> Back to lobby
        </button>
        <iframe
          src={gameUrl}
          title="Provider game"
          className="flex-1 w-full border-0"
          allow="autoplay; fullscreen; clipboard-write"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      <header className="sticky top-0 z-10 bg-card/95 backdrop-blur border-b border-border px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1 rounded-md hover:bg-muted">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-base font-bold">Provider Games</h1>
        <span className="ml-auto text-xs text-muted-foreground">
          {currencyDisplay} · {games.length} games
        </span>
      </header>

      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search games..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-muted text-sm outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : !enabled ? (
        <p className="px-4 py-10 text-center text-sm text-muted-foreground">
          Provider games are not configured yet.
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-2 px-3">
          {filtered.map((g) => (
            <button
              key={g.gameUid}
              onClick={() => launch(g)}
              className="rounded-xl overflow-hidden bg-card border border-border text-left active:scale-95 transition"
            >
              <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                {g.logo ? (
                  <img src={g.logo} alt={g.name} loading="lazy" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-lg font-bold text-muted-foreground">
                    {g.name?.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="p-1.5">
                <p className="text-[11px] font-semibold leading-tight line-clamp-2">{g.name}</p>
                {g.rtp ? <p className="text-[10px] text-muted-foreground">RTP {g.rtp}%</p> : null}
              </div>
              {launching === g.gameUid && (
                <div className="flex items-center justify-center py-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProviderGames;
