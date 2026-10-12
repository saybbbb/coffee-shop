"use client";

import TransitionLink from "@/components/transition/TransitionLink";
import { usePageTransition } from "@/components/transition/PageTransition";
import OpenBadge from "@/components/visit/OpenBadge";
import LegalModal, { type LegalKind } from "@/components/LegalModal";
import { useToast } from "@/components/toast/Toaster";
import { CAFE, formatTime } from "@/data/cafe";
import { useCallback, useState } from "react";

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

  // Works from any page: glides on home, curtains over from elsewhere
  const { go } = usePageTransition();
  const scrollToSection = (id: string) => go(`/#${id}`);

  const notify = useToast();
  const [legal, setLegal] = useState<LegalKind | null>(null);
  const closeLegal = useCallback(() => setLegal(null), []);

  // Social channels aren't live yet, so say so instead of linking somewhere fake
  const socials = [
    {
      name: "Instagram",
      icon: "photo_camera",
      onClick: () => notify({ message: "@nurvanacafe is brewing", detail: "Our Instagram launches with the café", icon: "photo_camera" }),
    },
    {
      name: "Café playlist",
      icon: "graphic_eq",
      onClick: () => notify({ message: "The café playlist is coming soon", detail: "Lo-fi, jazz and slow mornings", icon: "graphic_eq" }),
    },
    { name: "Find us", icon: "map", onClick: () => scrollToSection("visit") },
  ];

  return (
    <footer
      id="footer"
      data-nav-theme="dark"
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
              {socials.map((s) => (
                <button
                  key={s.name}
                  type="button"
                  onClick={s.onClick}
                  aria-label={s.name}
                  title={s.name}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-amber-950/60 border border-amber-800/40 text-stone-300 hover:text-amber-200 hover:border-amber-500/50 transition-all duration-300 hover:scale-110 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">{s.icon}</span>
                </button>
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
              {CAFE.hours.map((row) => (
                <div key={row.label} className="flex justify-between items-center py-1 border-b border-amber-950/80">
                  <span className="text-stone-400">{row.label}</span>
                  <span className="font-semibold text-white">
                    {formatTime(row.open)} – {formatTime(row.close)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <OpenBadge dark />
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
                  {CAFE.address.street}, {CAFE.address.district}
                  <br />
                  <span className="text-xs text-stone-400 font-mono">{CAFE.address.note}</span>
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-amber-400 text-lg shrink-0">
                  mail
                </span>
                <a
                  href={`mailto:${CAFE.email}`}
                  className="text-stone-300 hover:text-amber-200 font-mono text-xs transition-colors underline-offset-4 hover:underline"
                >
                  {CAFE.email}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-amber-400 text-lg shrink-0">
                  call
                </span>
                <span className="text-stone-300 font-mono text-xs">
                  {CAFE.phone}
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
                  onClick={() => scrollToSection("process")}
                  className="hover:text-amber-200 transition-colors cursor-pointer text-left"
                >
                  03. Bean to Cup
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("menu")}
                  className="hover:text-amber-200 transition-colors cursor-pointer text-left"
                >
                  04. The Menu
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("team")}
                  className="hover:text-amber-200 transition-colors cursor-pointer text-left"
                >
                  05. Our Team
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("reviews")}
                  className="hover:text-amber-200 transition-colors cursor-pointer text-left"
                >
                  06. Kind Words
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("visit")}
                  className="hover:text-amber-200 transition-colors cursor-pointer text-left"
                >
                  07. Visit Us
                </button>
              </li>
              <li className="pt-1">
                <TransitionLink
                  href="/menu"
                  className="text-amber-300 hover:text-white transition-colors inline-flex items-center gap-1 font-bold"
                >
                  <span>Interactive Menu</span>
                  <span className="material-symbols-outlined text-xs">arrow_outward</span>
                </TransitionLink>
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
            <button
              type="button"
              onClick={() => setLegal("privacy")}
              className="hover:text-amber-200 transition-colors underline-offset-4 hover:underline cursor-pointer"
            >
              Privacy
            </button>
            <button
              type="button"
              onClick={() => setLegal("terms")}
              className="hover:text-amber-200 transition-colors underline-offset-4 hover:underline cursor-pointer"
            >
              Terms
            </button>

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
      {legal && <LegalModal kind={legal} onClose={closeLegal} />}
    </footer>
  );
}
