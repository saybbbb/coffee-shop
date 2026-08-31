"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface SectionItem {
  id: string;
  label: string;
}

const SECTIONS: SectionItem[] = [
  { id: "hero", label: "Intro" },
  { id: "story", label: "Our Story" },
  { id: "menu", label: "The Menu" },
  { id: "team", label: "Our Team" },
];

export default function MinimalNav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [scrolledPastHero, setScrolledPastHero] = useState<boolean>(!isHome);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    if (!isHome) {
      setScrolledPastHero(true);
      return;
    }

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      setScrolledPastHero(scrollY > windowHeight * 0.35);

      // Determine active section using ScrollTrigger positions or element bounds
      const heroTrigger = ScrollTrigger.getById("hero-trigger");
      const storyTrigger = ScrollTrigger.getById("story-trigger");
      const menuTrigger = ScrollTrigger.getById("menu-trigger");
      const teamTrigger = ScrollTrigger.getById("team-trigger");

      if (teamTrigger && scrollY >= teamTrigger.start - 50) {
        setActiveSection("team");
      } else if (menuTrigger && scrollY >= menuTrigger.start - 50) {
        setActiveSection("menu");
      } else if (storyTrigger && scrollY >= storyTrigger.start - 50) {
        setActiveSection("story");
      } else {
        setActiveSection("hero");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isHome]);

  const scrollToSection = (id: string) => {
    if (!isHome) {
      window.location.href = `/#${id}`;
      return;
    }

    // Scroll to the exact progress point of the ScrollTrigger where elements are 100% visible
    const trigger = ScrollTrigger.getById(`${id}-trigger`);
    let targetScrollY = 0;

    if (trigger) {
      if (id === "hero") {
        targetScrollY = trigger.start;
      } else if (id === "story") {
        // Target 45% into the pinned timeline where story is in full focus and 100% opacity
        targetScrollY = trigger.start + (trigger.end - trigger.start) * 0.45;
      } else if (id === "menu") {
        // Target 45% into the pinned timeline where menu cards are in full focus and 100% opacity
        targetScrollY = trigger.start + (trigger.end - trigger.start) * 0.45;
      } else if (id === "team") {
        // Target 50% into the pinned timeline where team is in full focus and 100% opacity
        targetScrollY = trigger.start + (trigger.end - trigger.start) * 0.5;
      }
    } else {
      const el = document.getElementById(id);
      if (el) {
        targetScrollY = el.getBoundingClientRect().top + window.scrollY;
      }
    }

    if (window.__lenis) {
      window.__lenis.scrollTo(targetScrollY, { duration: 1.2 });
    } else {
      window.scrollTo({ top: targetScrollY, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* ─── Top Floating Header (Fade-in on scroll past Hero) ─── */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 pointer-events-none ${
          scrolledPastHero ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 py-5 flex justify-between items-center">
          {/* Minimal Logo Mark */}
          <Link
            href="/#hero"
            onClick={(e) => {
              if (isHome) {
                e.preventDefault();
                scrollToSection("hero");
              }
            }}
            className="pointer-events-auto flex items-center gap-2 group px-4 py-2 rounded-full glass-panel shadow-md transition-all duration-300 hover:scale-105"
          >
            <span
              className="font-bold text-sm tracking-widest uppercase"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-primary)" }}
            >
              Nurvaná
            </span>
            <span
              className="text-[10px] tracking-wider px-1.5 py-0.5 rounded-full font-mono uppercase"
              style={{
                backgroundColor: "var(--color-secondary-fixed)",
                color: "var(--color-primary)",
              }}
            >
              Café
            </span>
          </Link>

          {/* Quick Menu Button */}
          <button
            onClick={() => setMenuOpen(true)}
            className="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-full glass-panel shadow-md transition-all duration-300 hover:scale-105 text-xs uppercase font-mono tracking-wider cursor-pointer"
            style={{
              color: "var(--color-primary)",
              fontFamily: "var(--font-label)",
            }}
            aria-label="Open Navigation Menu"
          >
            <span className="w-2 h-2 rounded-full bg-amber-700 animate-pulse" />
            <span>Menu</span>
          </button>
        </div>
      </header>

      {/* ─── Right-side Minimal Dot Tracker (Only on Home) ─── */}
      {isHome && (
        <aside
          className={`fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-end gap-5 transition-all duration-500 ${
            scrolledPastHero ? "opacity-100 translate-x-0" : "opacity-75 translate-x-0"
          }`}
          aria-label="Page navigation tracker"
        >
          <div className="flex flex-col items-center gap-4 py-4 px-2.5 rounded-full glass-panel shadow-md">
            {SECTIONS.map((sec) => {
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className="group relative flex items-center justify-center p-1.5 focus:outline-none cursor-pointer"
                  aria-label={`Scroll to ${sec.label}`}
                >
                  {/* Tooltip on hover */}
                  <span
                    className="absolute right-8 px-2.5 py-1 rounded-md text-[11px] font-mono tracking-wider uppercase opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 glass-panel shadow-md whitespace-nowrap"
                    style={{
                      color: "var(--color-primary)",
                      fontFamily: "var(--font-label)",
                    }}
                  >
                    {sec.label}
                  </span>

                  {/* Dot indicator */}
                  <span
                    className={`block rounded-full transition-all duration-300 ${
                      isActive
                        ? "w-2.5 h-6 bg-amber-900 rounded-full shadow-md scale-110"
                        : "w-2 h-2 bg-amber-900/30 group-hover:bg-amber-900/70 group-hover:scale-125"
                    }`}
                    style={{
                      backgroundColor: isActive
                        ? "var(--color-primary)"
                        : "color-mix(in srgb, var(--color-primary) 30%, transparent)",
                    }}
                  />
                </button>
              );
            })}
          </div>
        </aside>
      )}

      {/* ─── Minimal Drawer Overlay ─── */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md transition-all duration-300 animate-fadeIn"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl p-8 glass-panel-dark text-white shadow-2xl relative border border-white/10"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "color-mix(in srgb, var(--color-primary) 94%, black)",
            }}
          >
            {/* Header */}
            <div className="flex justify-between items-center pb-6 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span
                  className="text-xl font-bold tracking-tight"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Nurvana Café
                </span>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            {/* Navigation links */}
            <nav className="py-8 space-y-4">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  scrollToSection("hero");
                }}
                className="w-full text-left text-2xl font-semibold hover:text-amber-300 transition-colors flex items-center justify-between group cursor-pointer"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <span>01. Intro</span>
                <span className="text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                  View
                </span>
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  scrollToSection("story");
                }}
                className="w-full text-left text-2xl font-semibold hover:text-amber-300 transition-colors flex items-center justify-between group cursor-pointer"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <span>02. Our Story</span>
                <span className="text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                  View
                </span>
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  scrollToSection("menu");
                }}
                className="w-full text-left text-2xl font-semibold hover:text-amber-300 transition-colors flex items-center justify-between group cursor-pointer"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <span>03. The Menu</span>
                <span className="text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                  View
                </span>
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  scrollToSection("team");
                }}
                className="w-full text-left text-2xl font-semibold hover:text-amber-300 transition-colors flex items-center justify-between group cursor-pointer"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <span>04. Our Team</span>
                <span className="text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                  View
                </span>
              </button>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <Link
                  href="/menu"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex items-center gap-2 text-sm font-mono uppercase tracking-wider text-amber-200 hover:text-white transition-colors"
                >
                  <span>Full Interactive Menu</span>
                  <span className="material-symbols-outlined text-sm">arrow_outward</span>
                </Link>
              </div>
            </nav>

            {/* Footer details */}
            <div className="pt-4 border-t border-white/10 text-xs text-stone-400 font-mono flex justify-between items-center">
              <span>Fair Trade &amp; Small Batch</span>
              <span>Daily 7AM - 8PM</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
