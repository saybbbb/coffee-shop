"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useCart } from "./CartProvider";

export default function CartButton() {
  const { count, bump, open } = useCart();
  const btnRef = useRef<HTMLButtonElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);

  // Wobble the cup + pop the badge whenever something lands in the cart
  useEffect(() => {
    if (!bump) return;
    gsap.fromTo(
      btnRef.current,
      { rotate: 0 },
      { keyframes: { rotate: [0, -14, 10, -6, 0] }, duration: 0.6, ease: "power1.out" }
    );
    gsap.fromTo(badgeRef.current, { scale: 1.8 }, { scale: 1, duration: 0.5, ease: "back.out(3)" });
  }, [bump]);

  return (
    <button
      ref={btnRef}
      data-cart-target
      onClick={open}
      className="pointer-events-auto relative flex items-center gap-2 px-4 py-2 rounded-full glass-panel shadow-md transition-transform duration-300 hover:scale-105 text-xs uppercase font-mono tracking-wider cursor-pointer"
      style={{ color: "var(--color-primary)", fontFamily: "var(--font-label)" }}
      aria-label={`Open your order, ${count} item${count === 1 ? "" : "s"}`}
    >
      <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
        local_mall
      </span>
      <span className="hidden sm:inline">Order</span>
      <span
        ref={badgeRef}
        className={`min-w-5 h-5 px-1 rounded-full items-center justify-center text-[11px] font-bold ${
          count ? "flex" : "hidden"
        }`}
        style={{ backgroundColor: "var(--color-primary)", color: "var(--color-on-primary)" }}
        aria-hidden="true"
      >
        {count}
      </span>
    </button>
  );
}
