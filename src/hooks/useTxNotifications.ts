import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchTransactions } from "@/lib/telegram";

type Tx = {
  type: string;
  game?: string;
  amount: string;
  currency: string;
  time: string;
  status?: string;
};

const STORAGE_KEY = "tx_notif_seen";
const currencySymbol = (c: string) =>
  c === "dollar" ? "$" : c === "rupee" ? "₹" : c === "star" ? "⭐" : c === "ton" ? "TON" : c;

export const useTxNotifications = () => {
  const seenRef = useRef<Set<string>>(new Set());
  const initedRef = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) seenRef.current = new Set(JSON.parse(raw));
    } catch {
      /* noop */
    }
  }, []);

  const { data } = useQuery({
    queryKey: ["tx-notifications"],
    queryFn: fetchTransactions,
    refetchInterval: 5000,
    refetchIntervalInBackground: false,
    staleTime: 0,
  });

  useEffect(() => {
    if (!Array.isArray(data)) return;
    const txs = data as Tx[];

    const relevant = txs.filter((t) => {
      const type = (t.type || "").toLowerCase();
      return (
        type.includes("deposit") ||
        type.includes("withdraw") ||
        type === "bonus" ||
        type === "referral"
      );
    });

    if (!initedRef.current) {
      // First load: mark existing as seen so we don't spam past transactions.
      relevant.forEach((t) => seenRef.current.add(`${t.time}|${t.type}|${t.amount}|${t.currency}`));
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...seenRef.current].slice(-200)));
      } catch {
        /* noop */
      }
      initedRef.current = true;
      return;
    }

    const fresh: Tx[] = [];
    for (const t of relevant) {
      const key = `${t.time}|${t.type}|${t.amount}|${t.currency}`;
      if (!seenRef.current.has(key)) {
        seenRef.current.add(key);
        fresh.push(t);
      }
    }

    if (fresh.length) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...seenRef.current].slice(-200)));
      } catch {
        /* noop */
      }
      for (const t of fresh) {
        const type = (t.type || "").toLowerCase();
        const sym = currencySymbol(t.currency);
        const amt = `${sym}${t.amount}`.replace(/^\$-/, "-$").replace(/^₹-/, "-₹");
        if (type.includes("deposit")) {
          toast.success("Deposit Successful", { description: `${amt} added to your wallet` });
        } else if (type.includes("withdraw")) {
          toast.success("Withdrawal Successful", { description: `${amt} withdrawn from your wallet` });
        } else if (type === "referral") {
          toast.success("Referral Reward", { description: `You earned ${amt}` });
        } else if (type === "bonus") {
          toast.success("Bonus Credited", { description: `${amt} bonus received` });
        }
      }
    }
  }, [data]);
};
