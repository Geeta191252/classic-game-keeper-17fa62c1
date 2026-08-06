// Shared currency helpers used across all game pages so that the
// $ / ₹ / ★ chips behave identically everywhere (like Aviator Fun).

export const INR_RATE = 85; // used only for UPI/legacy exchange displays

export type GameCurrencyMode = "USD" | "INR" | "STAR";
export type WalletKind = "dollar" | "rupee" | "star";

export const modeToWallet = (mode: GameCurrencyMode): WalletKind =>
  mode === "STAR" ? "star" : mode === "INR" ? "rupee" : "dollar";

// Convert a UI/display amount into the native wallet unit. INR is its own wallet.
export const toNativeAmount = (displayVal: number, mode: GameCurrencyMode): number =>
  displayVal;

// Convert a native wallet amount to what should be shown in the current mode.
export const toDisplayAmount = (nativeVal: number, mode: GameCurrencyMode): number =>
  nativeVal;

export const formatAmount = (val: number, mode: GameCurrencyMode): string => {
  if (mode === "STAR") return `★${Math.floor(val).toLocaleString()}`;
  if (mode === "INR") return `₹${val.toFixed(2)}`;
  return `💎${val.toFixed(2)}`;
};

export const currencySymbol = (mode: GameCurrencyMode): string =>
  mode === "STAR" ? "★" : mode === "INR" ? "₹" : "💎";

// ---- Global bet limits (min bet: 0.20 TON / 10 ⭐) ----
export const MIN_BET: Record<GameCurrencyMode, number> = { USD: 0.2, INR: 20, STAR: 10 };
export const BET_STEP: Record<GameCurrencyMode, number> = { USD: 0.2, INR: 20, STAR: 10 };
export const MAX_BET: Record<GameCurrencyMode, number> = { USD: 1000, INR: 100000, STAR: 100000 };

export const minBet = (mode: GameCurrencyMode) => MIN_BET[mode];
export const betStep = (mode: GameCurrencyMode) => BET_STEP[mode];

export const roundBet = (v: number) => Math.round(v * 100) / 100;

export const clampBet = (v: number, mode: GameCurrencyMode) =>
  roundBet(Math.min(MAX_BET[mode], Math.max(MIN_BET[mode], isFinite(v) ? v : MIN_BET[mode])));

// step the bet up/down by one increment for the given mode
export const stepBet = (v: number, mode: GameCurrencyMode, dir: 1 | -1) =>
  clampBet(v + dir * BET_STEP[mode], mode);

export const BET_PRESETS_BY_MODE: Record<GameCurrencyMode, number[]> = {
  USD: [0.2, 0.5, 1, 5, 10],
  INR: [20, 50, 100, 500, 1000],
  STAR: [10, 50, 100, 500, 1000],
};

export const betPresets = (mode: GameCurrencyMode) => BET_PRESETS_BY_MODE[mode];

export const formatBet = (v: number, mode: GameCurrencyMode) =>
  mode === "STAR" ? `${roundBet(v)} ⭐` : `${currencySymbol(mode)}${v.toFixed(2)}`;
