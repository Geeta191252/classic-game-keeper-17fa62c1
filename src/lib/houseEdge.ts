// Global house-edge controller.
// Target: 80% of played rounds must end in a player loss (owner profit).

export const HOUSE_LOSS_RATE = 0.8;

/** True when the current round must end as a loss for the player. */
export function shouldForceLoss(rate: number = HOUSE_LOSS_RATE): boolean {
  return Math.random() < rate;
}

export type LossPlan = {
  /** Round is pre-decided as a loss. */
  loss: boolean;
  /** Number of safe steps allowed before the forced crash. */
  crashAfter: number;
};

export const NO_LOSS_PLAN: LossPlan = { loss: false, crashAfter: Number.POSITIVE_INFINITY };

/**
 * Build a loss plan for multi-step games (mines, towers, chicken road, twist...).
 * On losing rounds the crash happens after 0..maxSafeSteps safe steps so the
 * player can never build a big multiplier.
 */
export function createLossPlan(maxSafeSteps: number = 2, rate: number = HOUSE_LOSS_RATE): LossPlan {
  const loss = shouldForceLoss(rate);
  return {
    loss,
    crashAfter: loss ? Math.floor(Math.random() * (maxSafeSteps + 1)) : Number.POSITIVE_INFINITY,
  };
}
