"use client";

import { useEffect, useState } from "react";
import type { PlacedOrder } from "./CartProvider";

/** Demo pacing: the order moves through these in a few seconds so it can be shown live. */
export const STAGES = [
  { label: "Received", icon: "receipt_long", at: 0 },
  { label: "Brewing", icon: "coffee_maker", at: 3500 },
  { label: "Ready", icon: "done_all", at: 9000 },
];

/** Index into STAGES for an order, updating live until it's ready. */
export function useOrderStage(order: PlacedOrder | null) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!order) return;
    const t = setInterval(() => {
      setNow(Date.now());
      if (Date.now() - order.placedAt > STAGES[STAGES.length - 1].at) clearInterval(t);
    }, 250);
    return () => clearInterval(t);
  }, [order]);

  if (!order) return { current: 0, ready: false };
  const elapsed = Math.max(0, now - order.placedAt);
  const current = STAGES.reduce((acc, s, i) => (elapsed >= s.at ? i : acc), 0);
  return { current, ready: current === STAGES.length - 1 };
}
