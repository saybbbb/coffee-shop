"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { MILKS, SIZES, formatPrice, type MenuItem } from "@/data/menu";
import { useCart, unitPriceFor } from "@/components/cart/CartProvider";
import MenuArt from "./MenuArt";

/** Detail + customise sheet. Bottom sheet on mobile, centred card on desktop. */
export default function ItemSheet({ item, onClose }: { item: MenuItem; onClose: () => void }) {
  const { add } = useCart();
  const [size, setSize] = useState("regular");
  const [milk, setMilk] = useState("whole");
  const [qty, setQty] = useState(1);
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const artRef = useRef<HTMLDivElement>(null);

  const unit = unitPriceFor(item, item.sizes ? size : undefined, item.milk ? milk : undefined);

  const close = () => {
    const isMobile = window.innerWidth < 768;
    gsap.to(backdropRef.current, { opacity: 0, duration: 0.25 });
    gsap.to(panelRef.current, {
      ...(isMobile ? { y: "100%" } : { y: 30, opacity: 0, scale: 0.97 }),
      duration: 0.3,
      ease: "power2.in",
      onComplete: onClose,
    });
  };

  useEffect(() => {
    window.__lenis?.stop();
    const isMobile = window.innerWidth < 768;
    gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    gsap.fromTo(
      panelRef.current,
      isMobile ? { y: "100%" } : { y: 40, opacity: 0, scale: 0.96 },
      { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" }
    );

    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.__lenis?.start();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = () => {
    add(item, { size, milk, qty, from: artRef.current });
    close();
  };

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-black/55 backdrop-blur-sm md:p-6"
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label={item.name}
    >
      <div
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent
        className="w-full md:max-w-4xl max-h-[92dvh] overflow-y-auto rounded-t-[28px] md:rounded-[32px] shadow-2xl grid md:grid-cols-2"
        style={{ backgroundColor: "var(--color-surface)" }}
      >
        {/* Art */}
        <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[520px] overflow-hidden">
          <div ref={artRef} className="absolute inset-0">
            <MenuArt item={item} sizes="(max-width: 768px) 100vw, 450px" iconSize="7rem" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />
          <button
            onClick={close}
            className="absolute top-4 right-4 md:left-4 md:right-auto w-10 h-10 rounded-full glass-panel flex items-center justify-center shadow-md cursor-pointer hover:scale-105 transition-transform"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-xl" style={{ color: "var(--color-primary)" }}>
              close
            </span>
          </button>
          {item.notes && (
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-1.5">
              {item.notes.map((n) => (
                <span
                  key={n}
                  className="px-2.5 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider glass-panel"
                  style={{ color: "var(--color-primary)", fontFamily: "var(--font-label)" }}
                >
                  {n}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="p-6 md:p-10 flex flex-col gap-6">
          <div className="space-y-3">
            {item.tags && (
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: "var(--color-secondary-fixed)",
                      color: "var(--color-on-secondary-fixed)",
                      fontFamily: "var(--font-label)",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
            <h2
              className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-primary)" }}
            >
              {item.name}
            </h2>
            <p className="text-base leading-relaxed" style={{ color: "var(--color-on-surface-variant)" }}>
              {item.description}
            </p>
          </div>

          {item.sizes && (
            <fieldset className="space-y-2">
              <legend className="sheet-label">Size</legend>
              <div className="grid grid-cols-3 gap-2">
                {SIZES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSize(s.id)}
                    aria-pressed={size === s.id}
                    className="option-chip flex flex-col items-center py-3"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: s.id === "small" ? 18 : s.id === "regular" ? 22 : 26 }}>
                      local_cafe
                    </span>
                    <span className="text-sm font-semibold mt-1">{s.label}</span>
                    <span className="text-[11px] opacity-70 font-mono">{s.oz}</span>
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          {item.milk && (
            <fieldset className="space-y-2">
              <legend className="sheet-label">Milk</legend>
              <div className="flex flex-wrap gap-2">
                {MILKS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMilk(m.id)}
                    aria-pressed={milk === m.id}
                    className="option-chip px-4 py-2 text-sm"
                  >
                    {m.label}
                    {m.delta > 0 && <span className="opacity-60 font-mono text-xs ml-1">+{formatPrice(m.delta)}</span>}
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          <div className="mt-auto pt-4 flex items-center gap-3 border-t" style={{ borderColor: "var(--color-outline-variant)" }}>
            <div className="flex items-center rounded-full border" style={{ borderColor: "var(--color-outline-variant)" }}>
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-11 h-11 flex items-center justify-center cursor-pointer"
                aria-label="Decrease quantity"
              >
                <span className="material-symbols-outlined text-lg">remove</span>
              </button>
              <span className="w-6 text-center font-mono font-bold" aria-live="polite">
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => Math.min(20, q + 1))}
                className="w-11 h-11 flex items-center justify-center cursor-pointer"
                aria-label="Increase quantity"
              >
                <span className="material-symbols-outlined text-lg">add</span>
              </button>
            </div>
            <button onClick={handleAdd} className="nurvana-btn-solid flex-1 justify-between">
              <span>Add to Order</span>
              <span className="font-mono">{formatPrice(unit * qty)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
