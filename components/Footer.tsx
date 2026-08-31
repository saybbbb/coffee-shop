"use client";

import Link from "next/link";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      if (window.__lenis) {
        window.__lenis.scrollTo(0, { duration: 1.4 });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const scrollToSection = (id: string) => {
    if (typeof window !== "undefined") {
      const el = document.getElementById(id);
      if (el) {
        if (window.__lenis) {
          window.__lenis.scrollTo(el, { offset: -20, duration: 1.2 });
        } else {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  return (
    <footer
      id="footer"
      className="w-full relative z-20 overflow-hidden text-stone-200"
      style={{
        backgroundColor: "var(--color-primary, #291806)",
        backgroundImage:
          "radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--color-primary-container) 40%, transparent) 0%, transparent 70%)",
      }}
    >
      {/* Top subtle decorative gradient line */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-amber-700/40 to-transparent" />

      <div className="max-w-[1300px] mx-auto px-6 md:px-12 lg:px-16 pt-20 pb-12">
        {/* ─── Top Row: Newsletter & Tasting Club Bar ─── */}
        <div
          className="rounded-3xl p-8 md:p-10 mb-16 border border-amber-900/40 relative overflow-hidden"
          style={{
            backgroundColor: "color-mix(in srgb, var(--color-primary-container) 35%, black)",
          }}
        >
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-2">
              <span
                className="text-[11px] font-mono uppercase tracking-[0.2em] text-amber-300 font-semibold inline-block"
                style={{ fontFamily: "var(--font-label)" }}
              >
                Seasonal Bean Drops
              </span>
              <h3
                className="text-2xl md:text-3xl font-bold text-white tracking-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Join the Nurvana Tasting Club
              </h3>
              <p
                className="text-sm text-stone-300/80 max-w-md font-light"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Receive rare single-origin releases, brewing guides from our master roasters, and invites to private cupping sessions.
              </p>
            </div>

            <div className="lg:col-span-6">
              {subscribed ? (
                <div className="p-4 rounded-2xl bg-amber-900/40 border border-amber-700/50 flex items-center gap-3 text-amber-200">
                  <span className="material-symbols-outlined text-xl text-amber-300">check_circle</span>
                  <span className="text-sm font-mono tracking-wide">
                    Welcome to the club! Check your inbox for our seasonal origins guide.
                  </span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-grow px-5 py-3.5 rounded-full bg-black/40 border border-amber-900/60 text-white placeholder-stone-400 text-sm focus:outline-none focus:border-amber-400/80 transition-colors font-mono"
                    style={{ fontFamily: "var(--font-body)" }}
                  />
                  <button
                    type="submit"
                    className="px-7 py-3.5 rounded-full text-xs font-mono uppercase tracking-wider font-semibold transition-all duration-300 hover:scale-105 shrink-0 shadow-lg cursor-pointer flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: "var(--color-secondary-fixed, #f6e0b9)",
                      color: "var(--color-primary, #33210d)",
                      fontFamily: "var(--font-label)",
                    }}
                  >
                    <span>Subscribe</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* ─── Main 4-Column Footer Grid ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-16 border-b border-amber-900/30">
          {/* Column 1: Brand Info (5 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <h2
                className="text-2xl md:text-3xl font-extrabold tracking-tight text-white uppercase"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Nurvana
              </h2>
              <span
                className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full font-semibold"
                style={{
                  backgroundColor: "var(--color-secondary-fixed, #f6e0b9)",
                  color: "var(--color-primary, #33210d)",
                }}
              >
                Café &amp; Roastery
              </span>
            </div>

            <p
              className="text-base italic text-amber-200/90 font-light max-w-sm leading-relaxed"
              style={{ fontFamily: "var(--font-handwritten)" }}
            >
              &ldquo;We&apos;re not just serving coffee — we&apos;re serving moments, hot or cold. Made for you.&rdquo;
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono text-stone-400">
              <span className="px-3 py-1 rounded-full bg-amber-900/30 border border-amber-800/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                100% Fair Trade
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-900/30 border border-amber-800/30">
                Small Batch Roasted
              </span>
            </div>

            {/* Social / Media Links */}
            <div className="pt-3 flex items-center gap-3">
              {[
                { name: "Instagram", icon: "photo_camera", href: "#" },
                { name: "Spotify Playlist", icon: "graphic_eq", href: "#" },
                { name: "Location", icon: "map", href: "#" },
              ].map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  aria-label={s.name}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-amber-950/60 border border-amber-800/40 text-stone-300 hover:text-amber-200 hover:border-amber-500/50 transition-all duration-300 hover:scale-110"
                >
                  <span className="material-symbols-outlined text-lg">{s.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Hours & Status (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h3
              className="text-xs font-mono uppercase tracking-[0.2em] text-amber-300 font-semibold"
              style={{ fontFamily: "var(--font-label)" }}
            >
              Roastery Hours
            </h3>

            <div className="space-y-2.5 text-sm text-stone-300 font-mono">
              <div className="flex justify-between items-center py-1 border-b border-amber-950/80">
                <span className="text-stone-400">Mon — Fri</span>
                <span className="font-semibold text-white">7:00 AM – 8:00 PM</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-amber-950/80">
                <span className="text-stone-400">Saturday</span>
                <span className="font-semibold text-white">8:00 AM – 9:00 PM</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-amber-950/80">
                <span className="text-stone-400">Sunday</span>
                <span className="font-semibold text-white">8:00 AM – 7:00 PM</span>
              </div>
            </div>

            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/50 text-[11px] font-mono text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Espresso Bar Open Daily</span>
              </div>
            </div>
          </div>

          {/* Column 3: Location & Contact (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h3
              className="text-xs font-mono uppercase tracking-[0.2em] text-amber-300 font-semibold"
              style={{ fontFamily: "var(--font-label)" }}
            >
              The Neighborhood
            </h3>

            <div className="space-y-3 text-sm text-stone-300">
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-amber-400 text-lg shrink-0 mt-0.5">
                  location_on
                </span>
                <p className="text-stone-300 font-light leading-snug">
                  142 Artisan Alley, Roast District
                  <br />
                  <span className="text-xs text-stone-400 font-mono">Corner of Bean &amp; Steam</span>
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-amber-400 text-lg shrink-0">
                  mail
                </span>
                <a
                  href="mailto:hello@nurvanacafe.com"
                  className="text-stone-300 hover:text-amber-200 font-mono text-xs transition-colors underline-offset-4 hover:underline"
                >
                  hello@nurvanacafe.com
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-amber-400 text-lg shrink-0">
                  call
                </span>
                <span className="text-stone-300 font-mono text-xs">
                  +1 (555) 234-5678
                </span>
              </div>
            </div>
          </div>

          {/* Column 4: Quick Navigation (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h3
              className="text-xs font-mono uppercase tracking-[0.2em] text-amber-300 font-semibold"
              style={{ fontFamily: "var(--font-label)" }}
            >
              Navigation
            </h3>

            <ul className="space-y-2 text-xs font-mono uppercase tracking-wider text-stone-300">
              <li>
                <button
                  onClick={() => scrollToSection("hero")}
                  className="hover:text-amber-200 transition-colors cursor-pointer text-left"
                >
                  01. Intro
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("story")}
                  className="hover:text-amber-200 transition-colors cursor-pointer text-left"
                >
                  02. Our Story
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("menu")}
                  className="hover:text-amber-200 transition-colors cursor-pointer text-left"
                >
                  03. The Menu
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("team")}
                  className="hover:text-amber-200 transition-colors cursor-pointer text-left"
                >
                  04. Our Team
                </button>
              </li>
              <li className="pt-1">
                <Link
                  href="/menu"
                  className="text-amber-300 hover:text-white transition-colors inline-flex items-center gap-1 font-bold"
                >
                  <span>Interactive Menu</span>
                  <span className="material-symbols-outlined text-xs">arrow_outward</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* ─── Bottom Bar: Copyright, Legal & Back-To-Top ─── */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-xs font-mono text-stone-400 text-center sm:text-left">
            <span>© 2026 Nurvana Café. All rights reserved.</span>
            <span className="hidden sm:inline opacity-40">•</span>
            <span className="text-amber-200/60">Crafted with intention &amp; brewed for community.</span>
          </div>

          <div className="flex items-center gap-6 text-xs font-mono text-stone-400">
            <a href="#" className="hover:text-amber-200 transition-colors underline-offset-4 hover:underline">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-amber-200 transition-colors underline-offset-4 hover:underline">
              Terms of Service
            </a>

            {/* Back to top button */}
            <button
              onClick={scrollToTop}
              className="px-3.5 py-1.5 rounded-full bg-amber-950/80 border border-amber-800/40 text-stone-300 hover:text-white hover:border-amber-400 transition-all flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider cursor-pointer group"
              aria-label="Back to top"
            >
              <span>Top</span>
              <span className="material-symbols-outlined text-xs transition-transform group-hover:-translate-y-0.5">
                arrow_upward
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
