"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import CartButton from "./cart/CartButton";
import OpenBadge from "./visit/OpenBadge";
import TransitionLink from "./transition/TransitionLink";
import { usePageTransition } from "./transition/PageTransition";

interface SectionItem {
  id: string;
  label: string;
  /** Shown in the top bar on large screens */
  inBar?: string;
}

const SECTIONS: SectionItem[] = [
  { id: "hero", label: "Intro" },
  { id: "story", label: "Our Story", inBar: "Story" },
  { id: "process", label: "Bean to Cup", inBar: "Bean to Cup" },
  { id: "menu", label: "The Menu", inBar: "Lineup" },
  { id: "team", label: "Our Team", inBar: "Team" },
  { id: "reviews", label: "Kind Words", inBar: "Kind Words" },
  { id: "visit", label: "Visit Us", inBar: "Visit" },
];
const BAR_LINKS = SECTIONS.filter((s) => s.inBar);

type Theme = "light" | "dark";

/** Theme of the page content at a point, ignoring the nav itself. */
function themeAt(x: number, y: number): Theme {
  for (const el of document.elementsFromPoint(x, y)) {
    if (el.closest("[data-nav-ui]")) continue;
    const t = el.closest<HTMLElement>("[data-nav-theme]")?.dataset.navTheme;
    if (t === "dark" || t === "light") return t;
    if (el.closest("main, footer")) break;
  }
  return "light";
}

/**
 * Where each home section starts, in scroll pixels. A pinned section is measured
 * by its pin spacer (the section itself sits at 0 while pinned). Trigger starts
 * aren't used because phone triggers begin early ("top 80%").
 */
function sectionStart(id: string) {
  const el = document.getElementById(id);
  if (!el) return Infinity;
  const ref = el.parentElement?.classList.contains("pin-spacer") ? el.parentElement : el;
  return ref.getBoundingClientRect().top + window.scrollY;
}

export default function MinimalNav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isMenu = pathname === "/menu";
  const [active, setActive] = useState("hero");
  const [topTheme, setTopTheme] = useState<Theme>(isHome ? "dark" : "light");
  const [sideTheme, setSideTheme] = useState<Theme>("light");
  const [progress, setProgress] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { go } = usePageTransition();

  // Track the section in view, page progress, and what's behind the nav
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const vh = window.innerHeight;
      setTopTheme(themeAt(window.innerWidth / 2, 40));
      setSideTheme(themeAt(window.innerWidth - 24, vh / 2));
      if (!isHome) return;

      const max = document.documentElement.scrollHeight - vh;
      setProgress(max > 0 ? Math.min(1, y / max) : 0);
      let current = SECTIONS[0].id;
      for (const s of SECTIONS) if (sectionStart(s.id) - vh * 0.4 <= y) current = s.id;
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    // Fallback so state stays right even if animation frames are paused
    const tick = setInterval(update, 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      cancelAnimationFrame(frame);
      clearInterval(tick);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isHome, pathname]);

  // Close the drawer on Escape
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawerOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  // On home: glide to the section. Elsewhere: curtain back to home, then land on it.
  const scrollToSection = (id: string) => go(`/#${id}`);

  // Sliding highlight behind the active bar link
  const barRef = useRef<HTMLDivElement>(null);
  const [highlight, setHighlight] = useState<{ left: number; width: number } | null>(null);
  useLayoutEffect(() => {
    const link = barRef.current?.querySelector<HTMLElement>(`[data-bar-link="${active}"]`);
    setHighlight(isHome && link ? { left: link.offsetLeft, width: link.offsetWidth } : null);
  }, [active, isHome]);

  return (
    <>
      {/* ─── Top bar ─── */}
      <header data-nav-ui data-theme={topTheme} className="nav-root fixed top-0 inset-x-0 z-40 pointer-events-none">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-3">
          {/* Logo */}
          <TransitionLink
            href="/#hero"
            className="nav-glass pointer-events-auto flex items-center gap-2 pl-1.5 pr-3.5 py-1.5 rounded-full transition-transform duration-300 hover:scale-[1.03]"
            aria-label="Nurvana Café home"
          >
            <span className="relative w-7 h-7 rounded-full overflow-hidden bg-white shrink-0 ring-1 ring-black/5">
              <Image src="/icon.jpg" alt="" fill sizes="28px" className="object-cover" unoptimized />
            </span>
            <span className="font-extrabold text-sm tracking-[0.18em] uppercase" style={{ fontFamily: "var(--font-display)" }}>
              Nurvaná
            </span>
          </TransitionLink>

          {/* Section links (large screens) */}
          <nav aria-label="Sections" className="hidden lg:block pointer-events-auto">
            <div ref={barRef} className="nav-glass relative flex items-center gap-1 p-1 rounded-full">
              <span
                className="nav-highlight absolute top-1 bottom-1 left-0 rounded-full transition-[transform,width,opacity] duration-500 ease-[var(--ease-out)]"
                style={{
                  // Slides with transform (cheap); only the width follows the link's size
                  transform: `translateX(${highlight?.left ?? 0}px)`,
                  width: highlight?.width ?? 0,
                  opacity: highlight ? 1 : 0,
                }}
                aria-hidden="true"
              />
              {BAR_LINKS.map((s) => {
                const isActive = isHome && active === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    data-bar-link={s.id}
                    onClick={() => scrollToSection(s.id)}
                    aria-current={isActive ? "true" : undefined}
                    className={`nav-link relative z-10 px-4 py-1.5 rounded-full text-[13px] font-semibold cursor-pointer transition-colors ${
                      isActive ? "is-active" : ""
                    }`}
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {s.inBar}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <TransitionLink
              href="/menu"
              aria-current={isMenu ? "page" : undefined}
              className={`nav-cta hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-transform duration-300 hover:scale-[1.03] ${
                isMenu ? "is-current" : ""
              }`}
              style={{ fontFamily: "var(--font-label)" }}
            >
              <span aria-hidden="true" className="material-symbols-outlined text-base">menu_book</span>
              Full Menu
            </TransitionLink>
            <CartButton />
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="nav-glass lg:hidden w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-105"
              aria-label="Open navigation"
              aria-expanded={drawerOpen}
            >
              <span aria-hidden="true" className="material-symbols-outlined text-xl">menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* ─── Side section tracker (home, md+) ─── */}
      {isHome && (
        <aside
          data-nav-ui
          data-theme={sideTheme}
          className="nav-root side-tracker fixed right-3 top-1/2 -translate-y-1/2 z-40 hidden md:flex items-center"
          aria-label="Page sections"
        >
          <div className="nav-glass relative flex flex-col items-center gap-3 py-3 w-7 rounded-full">
            {/* Progress line */}
            <span className="absolute top-4 bottom-4 left-1/2 -translate-x-1/2 w-px side-track" aria-hidden="true">
              <span className="absolute top-0 inset-x-0 side-fill transition-[height] duration-300" style={{ height: `${progress * 100}%` }} />
            </span>
            {SECTIONS.map((s, i) => {
              const isActive = active === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => scrollToSection(s.id)}
                  className="group relative z-10 w-5 h-5 flex items-center justify-center cursor-pointer"
                  aria-label={`${String(i + 1).padStart(2, "0")} ${s.label}`}
                  aria-current={isActive ? "true" : undefined}
                >
                  {/* Label: always shown beside the current section, on hover for the rest */}
                  {isActive ? (
                    <span
                      key={s.id}
                      className="nav-glass side-label absolute right-8 px-3 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-wider whitespace-nowrap pointer-events-none"
                      style={{ fontFamily: "var(--font-label)" }}
                      aria-hidden="true"
                    >
                      <span className="opacity-60 mr-1.5">{String(i + 1).padStart(2, "0")}</span>
                      {s.label}
                    </span>
                  ) : (
                    <span
                      className="nav-glass absolute right-8 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider whitespace-nowrap opacity-0 translate-x-1 pointer-events-none transition-[opacity,translate] duration-200 ease-[var(--ease-out)] group-hover:opacity-100 group-hover:translate-x-0"
                      style={{ fontFamily: "var(--font-label)" }}
                    >
                      {s.label}
                    </span>
                  )}
                  <span className={`side-dot block rounded-full transition-[width,height,opacity,transform,background-color,box-shadow] duration-300 ${isActive ? "is-active" : ""}`} />
                </button>
              );
            })}
          </div>
        </aside>
      )}

      {/* ─── Drawer (phones / tablets) ─── */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md"
          onClick={() => setDrawerOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
        >
          <div
            className="w-full max-w-md rounded-3xl p-7 text-white shadow-2xl relative border border-white/10"
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: "color-mix(in srgb, var(--color-primary) 94%, black)" }}
          >
            <div className="flex justify-between items-center pb-5 border-b border-white/10">
              <span className="text-xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Nurvana Café
              </span>
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                aria-label="Close navigation"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <nav className="py-5 space-y-1" aria-label="Sections">
              {SECTIONS.map((s, i) => {
                const isActive = isHome && active === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      setDrawerOpen(false);
                      scrollToSection(s.id);
                    }}
                    className={`w-full text-left text-xl font-semibold py-1.5 transition-colors flex items-center gap-3 group cursor-pointer ${
                      isActive ? "text-amber-300" : "hover:text-amber-300"
                    }`}
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    <span className="text-xs font-mono text-stone-400 w-6">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1">{s.label}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-amber-300" aria-hidden="true" />}
                  </button>
                );
              })}
            </nav>

            <TransitionLink
              href="/menu"
              onClick={() => setDrawerOpen(false)}
              className="hero-cta-primary w-full"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-lg">menu_book</span>
              Full Menu &amp; Ordering
            </TransitionLink>

            <div className="pt-5 mt-5 border-t border-white/10 text-xs text-stone-400 font-mono flex justify-between items-center gap-3">
              <span>Fair Trade &amp; Small Batch</span>
              <OpenBadge dark />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
