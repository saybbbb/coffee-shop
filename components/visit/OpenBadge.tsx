"use client";

import { useOpenStatus } from "./useOpenStatus";

/** Pill with a pulsing dot: "Open now · until 8:00 PM" / "Closed · opens 7:00 AM". */
export default function OpenBadge({ dark, className = "" }: { dark?: boolean; className?: string }) {
  const status = useOpenStatus();
  const open = status?.open ?? true;

  const palette = open
    ? dark
      ? "bg-emerald-950/60 border-emerald-800/50 text-emerald-300"
      : "bg-emerald-50 border-emerald-200 text-emerald-800"
    : dark
      ? "bg-amber-950/60 border-amber-800/50 text-amber-300"
      : "bg-amber-50 border-amber-200 text-amber-900";

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-mono tracking-wide ${palette} ${className}`}
      style={{ fontFamily: "var(--font-label)" }}
      aria-live="polite"
    >
      <span className="relative flex w-2 h-2">
        {open && <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />}
        <span className={`relative w-2 h-2 rounded-full ${open ? "bg-emerald-500" : "bg-amber-500"}`} />
      </span>
      {/* Server render shows a neutral label until the visitor's clock is known */}
      <span>{status?.text ?? "Open daily"}</span>
    </span>
  );
}
