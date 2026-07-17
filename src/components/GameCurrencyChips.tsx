import { GameCurrencyMode } from "@/lib/gameCurrency";
import { useBalanceContext } from "@/contexts/BalanceContext";
import { INR_RATE } from "@/lib/gameCurrency";

interface Props {
  mode: GameCurrencyMode;
  onChange: (mode: GameCurrencyMode) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Compact 3-chip currency selector ($ / ₹ / ★) used in every game.
 * Kept small (h-7) so it fits on mobile game HUDs.
 */
const GameCurrencyChips = ({ mode, onChange, disabled, className = "" }: Props) => {
  const { dollarBalance, starBalance, dollarWinning, starWinning } = useBalanceContext();
  const totalDollar = dollarBalance + dollarWinning;
  const totalStar = starBalance + starWinning;

  const chips: Array<{
    id: GameCurrencyMode;
    label: string;
    value: string;
    activeBg: string;
    activeText: string;
  }> = [
    {
      id: "USD",
      label: "$",
      value: `$${totalDollar.toFixed(2)}`,
      activeBg: "bg-sky-500",
      activeText: "text-white",
    },
    {
      id: "INR",
      label: "₹",
      value: `₹${(totalDollar * INR_RATE).toFixed(0)}`,
      activeBg: "bg-emerald-500",
      activeText: "text-white",
    },
    {
      id: "STAR",
      label: "★",
      value: `${totalStar.toLocaleString()}`,
      activeBg: "bg-amber-500",
      activeText: "text-black",
    },
  ];

  return (
    <div className={`inline-flex items-center gap-1 rounded-full bg-black/40 p-0.5 backdrop-blur-sm ${className}`}>
      {chips.map((c) => {
        const active = mode === c.id;
        return (
          <button
            key={c.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(c.id)}
            className={`flex items-center gap-1 rounded-full px-2 h-7 text-[10px] font-bold transition-all ${
              active ? `${c.activeBg} ${c.activeText} shadow` : "text-white/70 hover:text-white"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <span className="text-xs leading-none">{c.label}</span>
            <span className="leading-none">{c.value}</span>
          </button>
        );
      })}
    </div>
  );
};

export default GameCurrencyChips;
