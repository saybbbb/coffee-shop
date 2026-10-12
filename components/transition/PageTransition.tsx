"use client";

import { createContext, useCallback, useContext, useEffect, useRef, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollToSection } from "@/lib/scrollToSection";

/**
 * Branded page transition: a caramel + espresso "pour" rises over the page,
 * shows where you're headed, the route changes underneath, then the pour
 * drains off the top to reveal the new page.
 */

const LABELS: Record<string, string> = {
  "/": "Welcome back",
  "/menu": "Our Menu",
};

interface TransitionContextValue {
  /** Navigate with the curtain. `href` may include a #section for the home page. */
  go: (href: string) => void;
}

const TransitionContext = createContext<TransitionContextValue | null>(null);

/** Lets pages delay their intro animations until the curtain lifts. */
export function isPageTransitioning() {
  return typeof document !== "undefined" && document.documentElement.dataset.transitioning === "true";
}

export default function PageTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const caramelRef = useRef<HTMLDivElement>(null);
  const espressoRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const pending = useRef<{ path: string; hash: string } | null>(null);
  const busy = useRef(false);

  const go = useCallback(
    (href: string) => {
      const [path, hash = ""] = href.split("#");
      const targetPath = path || "/";

      // Same page: just glide to the section
      if (targetPath === pathname) {
        if (hash) scrollToSection(hash);
        else if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.2 });
        else window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      if (busy.current) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        router.push(href);
        return;
      }

      busy.current = true;
      pending.current = { path: targetPath, hash };
      document.documentElement.dataset.transitioning = "true";
      window.__lenis?.stop();
      if (labelRef.current) labelRef.current.textContent = LABELS[targetPath] ?? "";

      // Navigate when the cover finishes — or after 1s regardless, so a stalled
      // animation (e.g. backgrounded tab) can never block navigation
      let pushed = false;
      const push = () => {
        if (pushed) return;
        pushed = true;
        router.push(href, { scroll: false });
      };
      setTimeout(push, 1000);

      const curve = "50% 50% 0 0 / 12vh 12vh 0 0";
      gsap
        .timeline({ onComplete: push })
        .set(rootRef.current, { autoAlpha: 1 })
        .fromTo(
          caramelRef.current,
          { yPercent: 100, borderRadius: curve },
          { yPercent: 0, borderRadius: "0% 0% 0 0 / 0vh 0vh 0 0", duration: 0.6, ease: "power3.inOut" }
        )
        .fromTo(
          espressoRef.current,
          { yPercent: 100, borderRadius: curve },
          { yPercent: 0, borderRadius: "0% 0% 0 0 / 0vh 0vh 0 0", duration: 0.6, ease: "power3.inOut" },
          0.1
        )
        .fromTo(
          contentRef.current!.children,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.45, stagger: 0.08, ease: "power2.out" },
          0.45
        );
    },
    [pathname, router]
  );

  // Park both layers below the viewport
  useEffect(() => {
    gsap.set([caramelRef.current, espressoRef.current], { yPercent: 100 });
  }, []);

  // Route has changed underneath the curtain → settle the new page, then reveal it
  useEffect(() => {
    const p = pending.current;
    if (!p || p.path !== pathname) return;
    pending.current = null;

    let cancelled = false;
    let fallback: ReturnType<typeof setTimeout> | undefined;
    // Give the new page a moment to mount its own ScrollTriggers and paint
    const t = setTimeout(() => {
      if (cancelled) return;
      ScrollTrigger.refresh();
      window.__lenis?.start();
      if (p.hash) scrollToSection(p.hash, { immediate: true });
      else if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true, force: true });
      else window.scrollTo(0, 0);

      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        gsap.set(rootRef.current, { autoAlpha: 0 });
        delete document.documentElement.dataset.transitioning;
        busy.current = false;
        window.dispatchEvent(new Event("nurvana:page-revealed"));
      };
      // Same safety net as the cover: never leave the curtain stuck down
      fallback = setTimeout(finish, 1500);

      const curve = "0 0 50% 50% / 0 0 12vh 12vh";
      gsap
        .timeline({ onComplete: finish })
        .to(contentRef.current!.children, { opacity: 0, y: -20, duration: 0.3, stagger: 0.05, ease: "power2.in" })
        .to(espressoRef.current, { yPercent: -100, borderRadius: curve, duration: 0.7, ease: "power3.inOut" }, 0.15)
        .to(caramelRef.current, { yPercent: -100, borderRadius: curve, duration: 0.7, ease: "power3.inOut" }, 0.25);
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(t);
      clearTimeout(fallback);
    };
  }, [pathname]);

  return (
    <TransitionContext.Provider value={{ go }}>
      {children}

      <div
        ref={rootRef}
        className="fixed inset-0 z-[150] pointer-events-auto"
        style={{ visibility: "hidden", opacity: 0 }}
        aria-hidden="true"
      >
        <div
          ref={caramelRef}
          className="absolute inset-0"
          style={{ backgroundColor: "#c48a55" }}
        />
        <div
          ref={espressoRef}
          className="absolute inset-0 overflow-hidden"
          style={{
            backgroundColor: "var(--color-primary)",
            backgroundImage:
              "radial-gradient(ellipse at 50% 120%, color-mix(in srgb, var(--color-primary-container) 80%, transparent) 0%, transparent 60%)",
          }}
        >
          <div ref={contentRef} className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center px-6">
            <svg width="56" height="40" viewBox="0 0 60 40" fill="none" stroke="#e1c1a4" strokeWidth="2.5" strokeLinecap="round" className="menu-art-steam">
              <path d="M15 38 C 8 28, 22 22, 15 10" />
              <path d="M30 38 C 23 26, 37 20, 30 4" />
              <path d="M45 38 C 38 28, 52 22, 45 10" />
            </svg>
            <span
              className="text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tight leading-none"
              style={{ fontFamily: "var(--font-display)", color: "#fdf9f4" }}
            >
              Nurvaná
            </span>
            <span
              ref={labelRef}
              className="italic text-xl md:text-2xl"
              style={{ fontFamily: "var(--font-handwritten)", color: "#e1c1a4" }}
            />
          </div>
        </div>
      </div>
    </TransitionContext.Provider>
  );
}

export function usePageTransition() {
  const ctx = useContext(TransitionContext);
  if (!ctx) throw new Error("usePageTransition must be used inside <PageTransitionProvider>");
  return ctx;
}
