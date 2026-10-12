"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { gsap } from "gsap";

export interface ToastInput {
  message: string;
  detail?: string;
  icon?: string;
  action?: { label: string; onClick: () => void };
}

interface Toast extends ToastInput {
  id: number;
}

const ToastContext = createContext<((t: ToastInput) => void) | null>(null);

/** Single bottom-centre toast; a new one replaces the current one. */
export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const elRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);

  const dismiss = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    const el = elRef.current;
    if (!el) return setToast(null);
    gsap.to(el, { y: 24, opacity: 0, duration: 0.25, ease: "power2.in", onComplete: () => setToast(null) });
    // Never leave a toast stuck if animation frames are paused
    timer.current = setTimeout(() => setToast(null), 400);
  }, []);

  const notify = useCallback(
    (t: ToastInput) => {
      if (timer.current) clearTimeout(timer.current);
      setToast({ ...t, id: nextId.current++ });
      timer.current = setTimeout(dismiss, t.action ? 4200 : 3000);
    },
    [dismiss]
  );

  // Pop in each new toast
  useEffect(() => {
    if (!toast || !elRef.current) return;
    gsap.fromTo(elRef.current, { y: 30, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.8)" });
  }, [toast]);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div className="toast-dock fixed inset-x-0 bottom-5 z-[90] flex justify-center px-4 pointer-events-none" aria-live="polite" role="status">
        {toast && (
          <div
            key={toast.id}
            ref={elRef}
            className="pointer-events-auto flex items-center gap-3 max-w-md w-full sm:w-auto pl-3 pr-2 py-2 rounded-full shadow-2xl"
            style={{ backgroundColor: "var(--color-primary)", color: "var(--color-on-primary)" }}
          >
            <span
              className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "var(--color-secondary-fixed)", color: "var(--color-primary)" }}
              aria-hidden="true"
            >
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                {toast.icon ?? "check"}
              </span>
            </span>
            <span className="flex-1 min-w-0 leading-tight">
              <span className="block text-sm font-semibold truncate">{toast.message}</span>
              {toast.detail && <span className="block text-xs text-amber-100/70 truncate">{toast.detail}</span>}
            </span>
            {toast.action ? (
              <button
                type="button"
                onClick={() => {
                  toast.action!.onClick();
                  dismiss();
                }}
                className="shrink-0 px-4 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-wider cursor-pointer transition-colors hover:bg-white"
                style={{ backgroundColor: "var(--color-secondary-fixed)", color: "var(--color-primary)", fontFamily: "var(--font-label)" }}
              >
                {toast.action.label}
              </button>
            ) : (
              <button
                type="button"
                onClick={dismiss}
                className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 cursor-pointer"
                aria-label="Dismiss"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            )}
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const notify = useContext(ToastContext);
  if (!notify) throw new Error("useToast must be used inside <ToastProvider>");
  return notify;
}
