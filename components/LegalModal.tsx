"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";

export type LegalKind = "privacy" | "terms";

const CONTENT: Record<LegalKind, { title: string; points: { heading: string; body: string }[] }> = {
  privacy: {
    title: "Privacy",
    points: [
      {
        heading: "This is a prototype",
        body: "Nurvana Café's website was built as a student business project. Nothing you do here is sent to a server.",
      },
      {
        heading: "What stays in your browser",
        body: "Your order and whether you've seen the intro are saved only in this browser, so a refresh doesn't lose them. Clearing your browser data removes them.",
      },
      {
        heading: "No payments, no accounts",
        body: "Pickup orders are a demonstration. We never ask for payment details, and newsletter sign-ups aren't stored anywhere.",
      },
    ],
  },
  terms: {
    title: "Terms",
    points: [
      {
        heading: "Demo orders",
        body: "Orders placed on this site are simulated and won't be prepared. Order numbers and pickup times are for demonstration only.",
      },
      {
        heading: "Menu & prices",
        body: "Items, prices and hours are part of the Nurvana Café business concept and may change as the project develops.",
      },
      {
        heading: "Photos",
        body: "Product and café imagery is illustrative and was created for this project.",
      },
    ],
  },
};

export default function LegalModal({ kind, onClose }: { kind: LegalKind; onClose: () => void }) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const { title, points } = CONTENT[kind];

  useEffect(() => {
    window.__lenis?.stop();
    gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 });
    gsap.fromTo(panelRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" });
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.__lenis?.start();
    };
  }, [onClose]);

  // Portal to <body>: the footer is its own stacking context, which would put
  // the modal underneath the floating nav
  return createPortal(
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-title"
    >
      <div
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent
        className="w-full max-w-lg max-h-[85dvh] overflow-y-auto rounded-[28px] p-7 md:p-9 shadow-2xl"
        style={{ backgroundColor: "var(--color-surface)", color: "var(--color-on-surface)" }}
      >
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <p className="sheet-label">Nurvana Café</p>
            <h2
              id="legal-title"
              className="text-3xl font-extrabold tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-primary)" }}
            >
              {title}
            </h2>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center hover:bg-black/5 cursor-pointer"
            aria-label="Close"
          >
            <span aria-hidden="true" className="material-symbols-outlined" style={{ color: "var(--color-primary)" }}>
              close
            </span>
          </button>
        </div>
        <ul className="space-y-5">
          {points.map((p) => (
            <li key={p.heading} className="space-y-1">
              <h3 className="font-semibold" style={{ color: "var(--color-primary)" }}>
                {p.heading}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-on-surface-variant)" }}>
                {p.body}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-7 text-xs font-mono" style={{ color: "var(--color-outline)", fontFamily: "var(--font-label)" }}>
          Last updated October 2026
        </p>
      </div>
    </div>,
    document.body
  );
}
