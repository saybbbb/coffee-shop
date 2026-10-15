"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useCart } from "./CartProvider";
import { STAGES, useOrderStage } from "./orderStages";
import { useToast } from "@/components/toast/Toaster";

/**
 * Floating "Order #293 · Brewing…" pill in the bottom-right corner while a placed
 * order is in progress. Tapping it reopens the order ticket.
 */
export default function OrderStatusPill() {
  const { lastOrder, isOpen, open } = useCart();
  const { current, ready } = useOrderStage(lastOrder);
  const notify = useToast();
  const pillRef = useRef<HTMLButtonElement>(null);
  const announced = useRef<string | null>(null);

  const visible = !!lastOrder && !isOpen;

  // Slide in when it appears
  useEffect(() => {
    if (!visible || !pillRef.current) return;
    gsap.fromTo(pillRef.current, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "back.out(1.8)" });
  }, [visible]);

  // Tell the visitor when it's ready if they're off browsing
  useEffect(() => {
    if (!lastOrder || !ready || announced.current === lastOrder.number) return;
    announced.current = lastOrder.number;
    if (isOpen) return; // they're already looking at the ticket
    notify({
      message: `Order #${lastOrder.number} is ready`,
      detail: "Pick it up at the counter",
      icon: "done_all",
      action: { label: "View", onClick: open },
    });
    if (pillRef.current) gsap.fromTo(pillRef.current, { scale: 1.12 }, { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.4)" });
  }, [ready, lastOrder, isOpen, notify, open]);

  if (!visible) return null;
  const stage = STAGES[current];
  const progress = (current / (STAGES.length - 1)) * 100;

  return (
    <button
      ref={pillRef}
      type="button"
      data-order-pill
      onClick={open}
      className="fixed bottom-5 right-4 sm:right-6 z-[55] flex items-center gap-2.5 pl-2 pr-4 py-2 rounded-full shadow-xl cursor-pointer transition-transform hover:scale-[1.03] overflow-hidden" /* z-55: above the page, below sheets and modals */
      style={{
        backgroundColor: ready ? "#14532d" : "var(--color-primary)",
        color: "var(--color-on-primary)",
        transition: "background-color 0.5s ease, transform 0.2s ease",
      }}
      aria-label={`Order ${lastOrder.number}: ${stage.label}. Open order ticket`}
    >
      <span
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${ready ? "" : "animate-pulse"}`}
        style={{ backgroundColor: ready ? "#bbf7d0" : "var(--color-secondary-fixed)", color: ready ? "#14532d" : "var(--color-primary)" }}
        aria-hidden="true"
      >
        <span aria-hidden="true" className="material-symbols-outlined text-base">{stage.icon}</span>
      </span>
      <span className="flex flex-col items-start leading-tight">
        <span className="text-xs md:text-[11px] font-mono uppercase tracking-wider opacity-70" style={{ fontFamily: "var(--font-label)" }}>
          Order #{lastOrder.number}
        </span>
        <span className="text-sm font-semibold">{ready ? "Ready for pickup" : `${stage.label}…`}</span>
      </span>
      {/* Thin progress line along the bottom */}
      <span className="absolute left-0 bottom-0 h-[2px] bg-amber-200/80 transition-[width] duration-700" style={{ width: `${progress}%` }} aria-hidden="true" />
    </button>
  );
}
