"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { gsap } from "gsap";
import { MILKS, SIZES, type MenuItem } from "@/data/menu";
import { useToast } from "@/components/toast/Toaster";

/**
 * Prototype cart — everything lives in the browser. No payments, no backend.
 */

export interface CartLine {
  key: string;            // itemId + options, so identical configs stack
  itemId: string;
  name: string;
  image?: string;
  focus?: string;
  icon?: string;
  tint?: MenuItem["tint"];
  size?: string;          // size id
  milk?: string;          // milk id
  qty: number;
  unitPrice: number;
}

export interface PlacedOrder {
  number: string;
  name: string;
  pickup: string;
  lines: CartLine[];
  total: number;
  placedAt: number;
  readyInMin: number;
}

interface AddOptions {
  size?: string;
  milk?: string;
  qty?: number;
  /** Element to animate a "flying" copy from, towards the cart button */
  from?: HTMLElement | null;
}

interface CartContextValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  bump: number;
  lastOrder: PlacedOrder | null;
  open: () => void;
  close: () => void;
  add: (item: MenuItem, opts?: AddOptions) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  placeOrder: (name: string, pickup: string) => PlacedOrder;
  startNewOrder: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

// v2: prices switched from USD to PHP, so carts saved with dollar amounts are discarded
const STORAGE_KEY = "nurvana_cart_v2";

export function unitPriceFor(item: MenuItem, size?: string, milk?: string) {
  const s = SIZES.find((x) => x.id === size)?.delta ?? 0;
  const m = MILKS.find((x) => x.id === milk)?.delta ?? 0;
  return Math.max(0, item.price + s + m);
}

export function describeOptions(line: Pick<CartLine, "size" | "milk">) {
  const parts: string[] = [];
  const size = SIZES.find((s) => s.id === line.size);
  const milk = MILKS.find((m) => m.id === line.milk);
  if (size) parts.push(`${size.label} · ${size.oz}`);
  if (milk) parts.push(milk.id === "none" ? "No milk" : `${milk.label} milk`);
  return parts.join(" · ");
}

/** Animates a clone of `from` into the cart button, then resolves. */
function flyToCart(from: HTMLElement) {
  return new Promise<void>((resolve) => {
    const target = document.querySelector<HTMLElement>("[data-cart-target]");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!target || reduced) return resolve();

    const a = from.getBoundingClientRect();
    const b = target.getBoundingClientRect();
    const size = Math.min(a.width, a.height, 160);

    const ghost = from.cloneNode(true) as HTMLElement;
    Object.assign(ghost.style, {
      position: "fixed",
      left: `${a.left + a.width / 2 - size / 2}px`,
      top: `${a.top + a.height / 2 - size / 2}px`,
      width: `${size}px`,
      height: `${size}px`,
      margin: "0",
      borderRadius: "9999px",
      overflow: "hidden",
      zIndex: "200",
      pointerEvents: "none",
      boxShadow: "0 20px 40px -10px rgba(51,33,13,0.5)",
    });
    document.body.appendChild(ghost);

    const dx = b.left + b.width / 2 - (a.left + a.width / 2);
    const dy = b.top + b.height / 2 - (a.top + a.height / 2);

    gsap
      .timeline({
        onComplete: () => {
          ghost.remove();
          resolve();
        },
      })
      .to(ghost, { scale: 1.08, duration: 0.15, ease: "power1.out" })
      .to(ghost, { x: dx, duration: 0.75, ease: "power2.inOut" }, ">")
      // Separate y tween with a different ease gives the arc
      .to(ghost, { y: dy, duration: 0.75, ease: "back.in(1.6)" }, "<")
      .to(ghost, { scale: 0.12, opacity: 0.6, duration: 0.75, ease: "power2.in" }, "<");
  });
}

export default function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [bump, setBump] = useState(0);
  const [lastOrder, setLastOrder] = useState<PlacedOrder | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Restore cart for this browser (per-viewer convenience only)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // Reading browser storage after mount keeps SSR markup identical
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setLines(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {}
  }, [lines, hydrated]);

  // Freeze smooth scroll behind the drawer
  useEffect(() => {
    if (isOpen) window.__lenis?.stop();
    else window.__lenis?.start();
  }, [isOpen]);

  const notify = useToast();
  const open = useCallback(() => setIsOpen(true), []);

  const add = useCallback((item: MenuItem, opts: AddOptions = {}) => {
    const size = item.sizes ? opts.size ?? "regular" : undefined;
    const milk = item.milk ? opts.milk ?? "whole" : undefined;
    const qty = opts.qty ?? 1;
    const key = [item.id, size, milk].filter(Boolean).join("|");

    const commit = () => {
      setLines((prev) => {
        const existing = prev.find((l) => l.key === key);
        if (existing) {
          return prev.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l));
        }
        return [
          ...prev,
          {
            key,
            itemId: item.id,
            name: item.name,
            image: item.image,
            focus: item.focus,
            icon: item.icon,
            tint: item.tint,
            size,
            milk,
            qty,
            unitPrice: unitPriceFor(item, size, milk),
          },
        ];
      });
      setBump((b) => b + 1);
      notify({
        message: qty > 1 ? `${qty}× ${item.name} added` : `${item.name} added`,
        detail: describeOptions({ size, milk }) || undefined,
        icon: "local_cafe",
        action: { label: "View order", onClick: () => setIsOpen(true) },
      });
    };

    if (opts.from) {
      // Land the item when the animation finishes — but never later than 1.2s,
      // so the cart can't depend on animation frames (e.g. a backgrounded tab)
      Promise.race([flyToCart(opts.from), new Promise((r) => setTimeout(r, 1200))]).then(commit);
    } else commit();
  }, [notify]);

  const setQty = useCallback((key: string, qty: number) => {
    setLines((prev) =>
      qty <= 0 ? prev.filter((l) => l.key !== key) : prev.map((l) => (l.key === key ? { ...l, qty } : l))
    );
  }, []);

  const remove = useCallback((key: string) => {
    setLines((prev) => prev.filter((l) => l.key !== key));
  }, []);

  const subtotal = useMemo(() => lines.reduce((s, l) => s + l.unitPrice * l.qty, 0), [lines]);
  const count = useMemo(() => lines.reduce((s, l) => s + l.qty, 0), [lines]);

  const placeOrder = useCallback(
    (name: string, pickup: string) => {
      const order: PlacedOrder = {
        number: String(Math.floor(Math.random() * 900) + 100),
        name,
        pickup,
        lines,
        total: subtotal,
        placedAt: Date.now(),
        readyInMin: Math.min(12, 4 + count),
      };
      setLastOrder(order);
      setLines([]);
      return order;
    },
    [lines, subtotal, count]
  );

  const startNewOrder = useCallback(() => setLastOrder(null), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value: CartContextValue = {
    lines,
    count,
    subtotal,
    isOpen,
    bump,
    lastOrder,
    open,
    close,
    add,
    setQty,
    remove,
    placeOrder,
    startNewOrder,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
