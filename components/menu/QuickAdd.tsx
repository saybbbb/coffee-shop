"use client";

import { useState } from "react";
import type { MenuItem } from "@/data/menu";
import { useCart } from "@/components/cart/CartProvider";

/** Round "+" button that drops the item (default options) straight into the order. */
export default function QuickAdd({
  item,
  artRef,
  dark,
  small,
}: {
  item: MenuItem;
  artRef: React.RefObject<HTMLElement | null>;
  dark?: boolean;
  small?: boolean;
}) {
  const { add } = useCart();
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        add(item, { from: artRef.current });
        setDone(true);
        setTimeout(() => setDone(false), 1400);
      }}
      onKeyDown={(e) => e.stopPropagation()}
      className={`relative ${small ? "w-9 h-9" : "w-11 h-11"} rounded-full flex items-center justify-center shrink-0 cursor-pointer shadow-md transition-all duration-300 hover:scale-110 active:scale-95 ${
        done ? "rotate-[360deg]" : ""
      }`}
      style={{
        backgroundColor: dark ? "var(--color-on-primary)" : "var(--color-primary)",
        color: dark ? "var(--color-primary)" : "var(--color-on-primary)",
      }}
      aria-label={`Quick add ${item.name} to order`}
    >
      <span className={`material-symbols-outlined ${small ? "text-lg" : "text-xl"}`}>{done ? "check" : "add"}</span>
    </button>
  );
}

/** Makes a card open on click and on Enter/Space, so it works from the keyboard too. */
export function pressable(onActivate: () => void, label: string) {
  return {
    role: "button" as const,
    tabIndex: 0,
    "aria-label": label,
    onClick: onActivate,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onActivate();
      }
    },
  };
}
