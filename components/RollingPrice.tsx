"use client";

import { useState, type CSSProperties } from "react";
import { formatPrice } from "@/data/menu";

/**
 * A peso amount whose digits roll when it changes: up when it goes up, down
 * when it goes down. Only the digits that actually changed move, and the first
 * render doesn't animate. The text stays the plain price for screen readers and tests.
 */
export default function RollingPrice({ value, className = "", style }: { value: number; className?: string; style?: CSSProperties }) {
  const text = formatPrice(value);
  const chars = [...text];
  // Key each character by its place counted from the right (so ones stay ones
  // when ₱980 becomes ₱1,020) plus the character, so a changed digit is a new element
  const keys = chars.map((c, i) => `${chars.length - 1 - i}:${c}`);

  const [prev, setPrev] = useState({ value, keys });
  const [fresh, setFresh] = useState<{ keys: Set<string>; dir: "up" | "down" }>({ keys: new Set(), dir: "up" });
  if (value !== prev.value) {
    // Adjusting state during render: React re-renders straight away, before painting
    setFresh({ keys: new Set(keys.filter((k) => !prev.keys.includes(k))), dir: value > prev.value ? "up" : "down" });
    setPrev({ value, keys });
  }

  return (
    <span className={`rolling-price ${className}`} data-dir={fresh.dir} style={style}>
      {chars.map((c, i) => (
        <span key={keys[i]} className={fresh.keys.has(keys[i]) ? "is-new" : undefined}>
          {c}
        </span>
      ))}
    </span>
  );
}
