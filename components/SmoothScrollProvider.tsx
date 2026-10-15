"use client";

import { useEffect, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

/**
 * Runs in <head> (see app/layout.tsx): stops the browser restoring scroll on
 * reload by itself. It does that before the pinned sections exist, which made
 * a reload on Our Team land back on Bean to Cup; we restore it ourselves below.
 */
export const SCROLL_RESTORE_SCRIPT = `try{history.scrollRestoration="manual"}catch(e){}`;

const scrollKey = (path: string) => `nurvana_scroll:${path}`;

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined" && window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: true });
    }
  }, [pathname]);
  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    });

    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const tickerCb = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCb);
    gsap.ticker.lagSmoothing(0);

    return () => {
      window.__lenis = undefined;
      gsap.ticker.remove(tickerCb);
      lenis.destroy();
    };
  }, []);

  // Put the visitor back where they were after a reload or back/forward —
  // after the page's pinned sections exist (this effect runs after the page's
  // own effects), and once more when images/fonts finish loading.
  useEffect(() => {
    const path = window.location.pathname;
    // Read the path at save time: after curtain navigations it differs from the first page
    const save = () => {
      try {
        sessionStorage.setItem(scrollKey(window.location.pathname), String(Math.round(window.scrollY)));
      } catch {}
    };
    window.addEventListener("pagehide", save);

    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    let saved = 0;
    try {
      saved = Number(sessionStorage.getItem(scrollKey(path)) ?? 0);
    } catch {}
    if (!saved || !nav || (nav.type !== "reload" && nav.type !== "back_forward")) {
      return () => window.removeEventListener("pagehide", save);
    }

    // Stop re-applying once the visitor scrolls on their own
    let userScrolled = false;
    const markUser = () => (userScrolled = true);
    const userEvents = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
    userEvents.forEach((ev) => window.addEventListener(ev, markUser, { passive: true }));

    const restore = () => {
      if (userScrolled) return;
      ScrollTrigger.refresh();
      if (window.__lenis) {
        window.__lenis.resize();
        window.__lenis.scrollTo(saved, { immediate: true, force: true });
      } else {
        window.scrollTo(0, saved);
      }
    };
    restore();
    if (document.readyState !== "complete") window.addEventListener("load", restore, { once: true });
    const late = setTimeout(restore, 600); // fonts/images can shift the layout a little after load

    return () => {
      clearTimeout(late);
      window.removeEventListener("pagehide", save);
      window.removeEventListener("load", restore);
      userEvents.forEach((ev) => window.removeEventListener(ev, markUser));
    };
  }, []);

  return <>{children}</>;
}
