"use client";

import { useEffect, useRef, useState } from "react";
import TransitionLink from "@/components/transition/TransitionLink";
import { gsap } from "gsap";
import { formatPrice } from "@/data/menu";
import MenuArt from "@/components/menu/MenuArt";
import { describeOptions, useCart, type PlacedOrder } from "./CartProvider";
import { STAGES, useOrderStage } from "./orderStages";

const PICKUP = ["ASAP", "In 15 min", "In 30 min"];

export default function CartDrawer() {
  const cart = useCart();
  const { isOpen, close, lines, subtotal, count, lastOrder } = cart;
  const [placing, setPlacing] = useState(false);
  const [name, setName] = useState("");
  const [pickup, setPickup] = useState(PICKUP[0]);
  const rootRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  const stage = lastOrder ? "placed" : placing ? "placing" : "cart";

  // Stays mounted; slides in/out and is hidden (autoAlpha) while closed
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (!isOpen) {
      gsap.to(backdropRef.current, { opacity: 0, duration: 0.3 });
      gsap.to(panelRef.current, {
        x: "100%",
        duration: 0.4,
        ease: "power3.in",
        onComplete: () => gsap.set(root, { autoAlpha: 0 }),
      });
      return;
    }
    gsap.set(root, { autoAlpha: 1 });
    gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    gsap.fromTo(panelRef.current, { x: "100%" }, { x: 0, duration: 0.55, ease: "power3.out" });
    gsap.fromTo(
      ".cart-line",
      { opacity: 0, x: 30 },
      { opacity: 1, x: 0, stagger: 0.05, delay: 0.2, duration: 0.4, ease: "power2.out" }
    );
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lines.length) return;
    setPlacing(true);
    // Pretend the café is receiving it
    setTimeout(() => {
      cart.placeOrder(name.trim() || "Friend", pickup);
      setPlacing(false);
    }, 2200);
  };

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[70]"
      style={{ visibility: "hidden", opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label="Your order"
      aria-hidden={!isOpen}
    >
      <div ref={backdropRef} className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={close} />
      <aside
        ref={panelRef}
        data-lenis-prevent
        className="absolute right-0 top-0 h-full w-full sm:w-[440px] flex flex-col shadow-2xl translate-x-full"
        style={{ backgroundColor: "var(--color-surface)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: "var(--color-outline-variant)" }}>
          <div>
            <p className="sheet-label">{stage === "placed" ? "Order confirmed" : "Pickup order"}</p>
            <h2
              className="text-2xl font-extrabold tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-primary)" }}
            >
              {stage === "placed" ? "See you soon" : "Your Order"}
            </h2>
          </div>
          <button
            onClick={close}
            className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-colors hover:bg-black/5"
            aria-label="Close order"
          >
            <span aria-hidden="true" className="material-symbols-outlined" style={{ color: "var(--color-primary)" }}>
              close
            </span>
          </button>
        </div>

        {stage === "placing" && <Brewing />}
        {stage === "placed" && lastOrder && (
          <Confirmation
            order={lastOrder}
            onDone={() => {
              cart.startNewOrder();
              close();
            }}
          />
        )}

        {stage === "cart" && (
          <>
            {lines.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-8 gap-4">
                <div
                  className="w-28 h-28 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "var(--color-secondary-fixed)" }}
                >
                  <span aria-hidden="true" className="material-symbols-outlined text-5xl" style={{ color: "var(--color-primary)" }}>
                    coffee
                  </span>
                </div>
                <p
                  className="text-xl font-bold"
                  style={{ fontFamily: "var(--font-display)", color: "var(--color-primary)" }}
                >
                  Your cup is empty.
                </p>
                <p className="text-sm" style={{ color: "var(--color-on-surface-variant)" }}>
                  Pick something warm, cold, or freshly baked.
                </p>
                <TransitionLink href="/menu" onClick={close} className="nurvana-btn-outline mt-2">
                  Browse the Menu
                </TransitionLink>
              </div>
            ) : (
              <form onSubmit={submit} className="flex-1 flex flex-col min-h-0">
                <ul className="flex-1 overflow-y-auto px-6 py-4 space-y-4" data-lenis-prevent>
                  {lines.map((l) => (
                    <li key={l.key} className="cart-line flex gap-4 items-center">
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0">
                        <MenuArt item={{ id: l.itemId, name: l.name, image: l.image, focus: l.focus, icon: l.icon, tint: l.tint }} sizes="64px" iconSize="1.8rem" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate" style={{ color: "var(--color-primary)" }}>
                          {l.name}
                        </p>
                        {describeOptions(l) && (
                          <p className="text-xs truncate" style={{ color: "var(--color-on-surface-variant)" }}>
                            {describeOptions(l)}
                          </p>
                        )}
                        <div className="flex items-center gap-1 mt-1.5">
                          <QtyButton icon={l.qty === 1 ? "delete" : "remove"} label="Decrease" onClick={() => cart.setQty(l.key, l.qty - 1)} />
                          <span className="w-6 text-center text-sm font-mono font-bold">{l.qty}</span>
                          <QtyButton icon="add" label="Increase" onClick={() => cart.setQty(l.key, l.qty + 1)} />
                        </div>
                      </div>
                      <span className="font-mono font-bold text-sm" style={{ color: "var(--color-secondary)" }}>
                        {formatPrice(l.unitPrice * l.qty)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="px-6 py-5 space-y-4 border-t" style={{ borderColor: "var(--color-outline-variant)", backgroundColor: "var(--color-surface-container-low)" }}>
                  <label className="block space-y-1.5">
                    <span className="sheet-label">Name for the cup</span>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sam"
                      maxLength={20}
                      className="w-full rounded-full px-4 py-2.5 text-sm outline-none border focus:ring-2"
                      style={{ borderColor: "var(--color-outline-variant)", backgroundColor: "var(--color-surface)" }}
                    />
                  </label>
                  <fieldset className="space-y-1.5">
                    <legend className="sheet-label">Pickup</legend>
                    <div className="grid grid-cols-3 gap-2">
                      {PICKUP.map((p) => (
                        <button
                          type="button"
                          key={p}
                          onClick={() => setPickup(p)}
                          aria-pressed={pickup === p}
                          className="option-chip py-2 text-xs"
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  <div className="flex justify-between items-baseline pt-1">
                    <span className="text-sm" style={{ color: "var(--color-on-surface-variant)" }}>
                      {count} item{count === 1 ? "" : "s"}
                    </span>
                    <span
                      className="text-2xl font-extrabold"
                      style={{ fontFamily: "var(--font-display)", color: "var(--color-primary)" }}
                    >
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <button type="submit" className="nurvana-btn-solid w-full justify-center">
                    <span>Place Pickup Order</span>
                    <span aria-hidden="true" className="material-symbols-outlined text-lg">arrow_forward</span>
                  </button>
                  <p className="text-[11px] text-center" style={{ color: "var(--color-outline)" }}>
                    Pay at the counter when you collect.
                  </p>
                </div>
              </form>
            )}
          </>
        )}
      </aside>
    </div>
  );
}

function QtyButton({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-colors hover:bg-black/5 border"
      style={{ borderColor: "var(--color-outline-variant)", color: "var(--color-primary)" }}
    >
      <span aria-hidden="true" className="material-symbols-outlined text-base">{icon}</span>
    </button>
  );
}

/** Cup that fills while the order "sends". */
function Brewing() {
  const fillRef = useRef<SVGRectElement>(null);
  useEffect(() => {
    gsap.fromTo(fillRef.current, { attr: { y: 120, height: 0 } }, { attr: { y: 46, height: 74 }, duration: 2, ease: "power1.inOut" });
    gsap.fromTo(".brew-steam path", { opacity: 0, y: 8 }, { opacity: 0.6, y: -4, duration: 1, stagger: 0.25, repeat: -1, yoyo: true, ease: "sine.inOut" });
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8 text-center">
      <svg width="140" height="150" viewBox="0 0 140 150" aria-hidden="true">
        <g className="brew-steam" fill="none" stroke="var(--color-secondary)" strokeWidth="3" strokeLinecap="round">
          <path d="M45 30 C 38 20, 52 14, 45 2" />
          <path d="M65 30 C 58 20, 72 14, 65 2" />
          <path d="M85 30 C 78 20, 92 14, 85 2" />
        </g>
        <defs>
          <clipPath id="cup-clip">
            <path d="M22 44 H108 L100 118 Q98 128 88 128 H42 Q32 128 30 118 Z" />
          </clipPath>
        </defs>
        <g clipPath="url(#cup-clip)">
          <rect x="0" y="0" width="140" height="150" fill="var(--color-surface-container-high)" />
          <rect ref={fillRef} x="0" y="120" width="140" height="0" fill="var(--color-primary-container)" />
        </g>
        <path d="M22 44 H108 L100 118 Q98 128 88 128 H42 Q32 128 30 118 Z" fill="none" stroke="var(--color-primary)" strokeWidth="4" strokeLinejoin="round" />
        <path d="M106 60 Q128 62 124 82 Q120 98 102 98" fill="none" stroke="var(--color-primary)" strokeWidth="4" strokeLinecap="round" />
        <ellipse cx="65" cy="138" rx="52" ry="6" fill="var(--color-outline-variant)" opacity="0.6" />
      </svg>
      <div className="space-y-1">
        <p className="text-xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--color-primary)" }}>
          Sending to the bar…
        </p>
        <p className="text-sm" style={{ color: "var(--color-on-surface-variant)" }}>
          Our baristas are getting your order.
        </p>
      </div>
    </div>
  );
}


function Confirmation({ order, onDone }: { order: PlacedOrder; onDone: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".confirm-stamp", { scale: 0, rotate: -30 }, { scale: 1, rotate: -8, duration: 0.7, ease: "back.out(2)" });
      gsap.fromTo(".confirm-reveal", { opacity: 0, y: 16 }, { opacity: 1, y: 0, stagger: 0.08, delay: 0.25, duration: 0.5, ease: "power2.out" });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const { current } = useOrderStage(order);
  const ready = new Date(order.placedAt + order.readyInMin * 60_000).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div ref={rootRef} className="flex-1 overflow-y-auto px-6 py-6 space-y-6" data-lenis-prevent>
      {/* Ticket */}
      <div
        className="relative rounded-3xl p-6 text-center overflow-hidden"
        style={{ backgroundColor: "var(--color-primary)", color: "var(--color-on-primary)" }}
      >
        <div
          className="confirm-stamp absolute -top-3 -right-3 w-24 h-24 rounded-full flex items-center justify-center border-2 border-dashed text-[10px] font-mono uppercase tracking-widest leading-tight"
          style={{ borderColor: "var(--color-secondary-fixed-dim)", color: "var(--color-secondary-fixed-dim)" }}
        >
          Nurvana
          <br />
          Approved
        </div>
        <p className="confirm-reveal text-[11px] font-mono uppercase tracking-[0.2em] text-amber-200/80">Order number</p>
        <p className="confirm-reveal text-7xl font-black tracking-tight my-1" style={{ fontFamily: "var(--font-display)" }}>
          #{order.number}
        </p>
        <p className="confirm-reveal text-lg" style={{ fontFamily: "var(--font-handwritten)" }}>
          Thanks, {order.name}! ☕
        </p>
        <p className="confirm-reveal mt-3 text-xs font-mono uppercase tracking-wider text-amber-100/80">
          {current === STAGES.length - 1
            ? "Ready now · pickup counter"
            : order.pickup === "ASAP"
              ? `Ready around ${ready}`
              : `Pickup ${order.pickup.toLowerCase()}`}
        </p>
      </div>

      {/* Progress */}
      <ol className="confirm-reveal relative flex justify-between">
        <div className="absolute top-5 left-[16%] right-[16%] h-0.5" style={{ backgroundColor: "var(--color-outline-variant)" }} />
        <div
          className="absolute top-5 left-[16%] h-0.5 transition-all duration-700"
          style={{ backgroundColor: "var(--color-primary)", width: `${(current / (STAGES.length - 1)) * 68}%` }}
        />
        {STAGES.map((s, i) => {
          const done = i <= current;
          return (
            <li key={s.label} className="relative z-10 flex flex-col items-center gap-2 w-1/3">
              <span
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                  i === current && i < STAGES.length - 1 ? "animate-pulse" : ""
                }`}
                style={{
                  backgroundColor: done ? "var(--color-primary)" : "var(--color-surface-container-high)",
                  color: done ? "var(--color-on-primary)" : "var(--color-outline)",
                  transform: i === current ? "scale(1.1)" : "scale(1)",
                }}
              >
                <span aria-hidden="true" className="material-symbols-outlined text-lg">{s.icon}</span>
              </span>
              <span className="text-xs font-mono uppercase tracking-wider" style={{ color: done ? "var(--color-primary)" : "var(--color-outline)" }}>
                {s.label}
              </span>
            </li>
          );
        })}
      </ol>

      {current === STAGES.length - 1 && (
        <p className="text-center text-sm font-semibold" style={{ color: "var(--color-tertiary-container)" }}>
          Your order is ready at the pickup counter!
        </p>
      )}

      {/* Receipt */}
      <div className="confirm-reveal rounded-2xl p-5 space-y-2 receipt-edge" style={{ backgroundColor: "var(--color-surface-container)" }}>
        {order.lines.map((l) => (
          <div key={l.key} className="flex justify-between text-sm gap-3">
            <span className="truncate" style={{ color: "var(--color-on-surface)" }}>
              {l.qty}× {l.name}
            </span>
            <span className="font-mono shrink-0">{formatPrice(l.unitPrice * l.qty)}</span>
          </div>
        ))}
        <div className="flex justify-between pt-2 mt-2 border-t border-dashed font-bold" style={{ borderColor: "var(--color-outline)" }}>
          <span>Total · pay at pickup</span>
          <span className="font-mono">{formatPrice(order.total)}</span>
        </div>
      </div>

      <button onClick={onDone} className="confirm-reveal nurvana-btn-outline w-full text-center">
        Start a New Order
      </button>
    </div>
  );
}
