// Shared currency helpers used across all game pages so that the
// $ / ₹ / ★ chips behave identically everywhere (like Aviator Fun).

export const INR_RATE = 85; // 1 USD = 85 INR (display-only scaling over the dollar wallet)

export type GameCurrencyMode = "USD" | "INR" | "STAR";
export type WalletKind = "dollar" | "star";

export const modeToWallet = (mode: GameCurrencyMode): WalletKind =>
  mode === "STAR" ? "star" : "dollar";

// Convert a UI/display amount into the native wallet unit that the
// backend + local balance adjustments expect. INR is scaled down to $.
export const toNativeAmount = (displayVal: number, mode: GameCurrencyMode): number =>
  mode === "INR" ? displayVal / INR_RATE : displayVal;

// Convert a native wallet amount to what should be shown in the current mode.
export const toDisplayAmount = (nativeVal: number, mode: GameCurrencyMode): number =>
  mode === "INR" ? nativeVal * INR_RATE : nativeVal;

export const formatAmount = (val: number, mode: GameCurrencyMode): string => {
  if (mode === "STAR") return `★${Math.floor(val).toLocaleString()}`;
  if (mode === "INR") return `₹${val.toFixed(2)}`;
  return `$${val.toFixed(2)}`;
};

export const currencySymbol = (mode: GameCurrencyMode): string =>
  mode === "STAR" ? "★" : mode === "INR" ? "₹" : "$";
