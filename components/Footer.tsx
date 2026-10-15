"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import TransitionLink from "@/components/transition/TransitionLink";
import { usePageTransition } from "@/components/transition/PageTransition";
import OpenBadge from "@/components/visit/OpenBadge";
import LegalModal, { type LegalKind } from "@/components/LegalModal";
import { useToast } from "@/components/toast/Toaster";
import { FacebookIcon, InstagramIcon } from "@/components/SocialIcons";
import { CAFE, SOCIALS, streetAddress } from "@/data/cafe";

type SocialKey = keyof typeof SOCIALS;
const SOCIAL_ICONS: Record<SocialKey, typeof InstagramIcon> = { instagram: InstagramIcon, facebook: FacebookIcon };

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [legal, setLegal] = useState<LegalKind | null>(null);
  const closeLegal = useCallback(() => setLegal(null), []);
  const notify = useToast();
  // Works from any page: glides on home, curtains over from elsewhere
  const { go } = usePageTransition();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  const scrollToTop = () => {
    if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.4 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /** Social links open in a new tab; until a link is set, say so rather than link somewhere wrong. */
  const socialProps = (key: SocialKey) => {
    const s = SOCIALS[key];
    return s.url
      ? { href: s.url, target: "_blank", rel: "noopener noreferrer" }
      : {
          href: "#",
          onClick: (e: React.MouseEvent) => {
            e.preventDefault();
            notify({ message: `Our ${s.label} link is coming soon`, detail: "Check back after launch", icon: "favorite" });
          },
        };
  };

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
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-amber-700/40 to-transparent" />

      <div className="max-w-[1300px] mx-auto px-6 md:px-12 lg:px-16 pt-20">
        {/* ─── Tasting Club ─── */}
        <div
          className="rounded-3xl p-8 md:p-10 mb-14 border border-hairline relative overflow-hidden"
          style={{ backgroundColor: "color-mix(in srgb, var(--color-primary-container) 35%, black)" }}
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-2">
              <span className="text-xs md:text-[11px] font-mono uppercase tracking-[0.16em] text-amber-300 font-semibold inline-block" style={{ fontFamily: "var(--font-label)" }}>
                Seasonal Bean Drops
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Join the Nurvana Tasting Club
              </h3>
              <p className="text-sm text-stone-300/80 max-w-md font-light">
                Receive rare single-origin releases, brewing guides from our master roasters, and invites to private cupping sessions.
              </p>
            </div>
            <div className="lg:col-span-6">
              {subscribed ? (
                <div className="p-4 rounded-2xl bg-amber-900/40 border border-hairline-strong flex items-center gap-3 text-amber-200">
                  <span aria-hidden="true" className="material-symbols-outlined text-xl text-amber-300">
                    check_circle
                  </span>
                  <span className="text-sm font-mono tracking-wide">Welcome to the club! Check your inbox for our seasonal origins guide.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    aria-label="Email address"
                    className="flex-grow px-5 py-3.5 rounded-full bg-black/40 border border-hairline-strong text-white placeholder-stone-400 text-sm focus:outline-none focus:border-amber-400/80 transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-7 py-3.5 rounded-full text-xs font-mono uppercase tracking-wider font-semibold transition-[scale] duration-200 ease-[var(--ease-out)] hover:scale-105 active:scale-[0.97] shrink-0 shadow-lg cursor-pointer flex items-center justify-center gap-2"
                    style={{ backgroundColor: "var(--color-secondary-fixed, #f6e0b9)", color: "var(--color-primary, #33210d)", fontFamily: "var(--font-label)" }}
                  >
                    <span>Subscribe</span>
                    <span aria-hidden="true" className="material-symbols-outlined text-sm">
                      arrow_forward
                    </span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* ─── Columns ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-5 space-y-4">
            <p className="text-lg italic text-amber-200/90 font-light max-w-sm leading-relaxed" style={{ fontFamily: "var(--font-handwritten)" }}>
              &ldquo;We&apos;re not just serving coffee — we&apos;re serving moments, hot or cold. Made for you.&rdquo;
            </p>
            <div className="flex flex-wrap gap-2 text-xs font-mono text-stone-400">
              <span className="px-3 py-1 rounded-full bg-amber-900/30 border border-hairline flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                100% Fair Trade
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-900/30 border border-hairline">Small Batch Roasted</span>
            </div>

            {/* Socials */}
            <div className="pt-2 space-y-2.5">
              <p className="text-xs md:text-[11px] font-mono uppercase tracking-[0.16em] text-amber-300" style={{ fontFamily: "var(--font-label)" }}>
                Follow us{SOCIALS.instagram.handle && <span className="normal-case tracking-normal text-stone-300"> · {SOCIALS.instagram.handle}</span>}
              </p>
              <div className="flex flex-wrap gap-2.5">
                {(Object.keys(SOCIALS) as SocialKey[]).map((key) => {
                  const Icon = SOCIAL_ICONS[key];
                  return (
                    <a
                      key={key}
                      {...socialProps(key)}
                      className={`social-pill social-${key}`}
                      aria-label={`${SOCIALS[key].label}${SOCIALS[key].url ? " (opens in a new tab)" : ""}`}
                    >
                      <Icon className="w-[18px] h-[18px]" />
                      <span>{SOCIALS[key].label}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Visit */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-[0.16em] text-amber-300 font-semibold" style={{ fontFamily: "var(--font-label)" }}>
              Visit
            </h3>
            <div className="space-y-3 text-sm text-stone-300">
              <OpenBadge dark />
              <p className="flex items-start gap-2.5 font-light leading-snug">
                <span aria-hidden="true" className="material-symbols-outlined text-amber-400 text-lg shrink-0">
                  location_on
                </span>
                <span>
                  {CAFE.address.place}
                  <br />
                  <span className="text-xs text-stone-400 font-mono">{streetAddress}</span>
                </span>
              </p>
              <p className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-mono">
                <a href={`mailto:${CAFE.email}`} className="inline-flex items-center gap-2 hover:text-amber-200 transition-colors underline-offset-4 hover:underline">
                  <span aria-hidden="true" className="material-symbols-outlined text-amber-400 text-base">
                    mail
                  </span>
                  {CAFE.email}
                </a>
                <span className="inline-flex items-center gap-2">
                  <span aria-hidden="true" className="material-symbols-outlined text-amber-400 text-base">
                    call
                  </span>
                  {CAFE.phone}
                </span>
              </p>
              <button
                type="button"
                onClick={() => go("/#visit")}
                className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-amber-300 hover:text-white transition-colors cursor-pointer"
              >
                Hours &amp; map
                <span aria-hidden="true" className="material-symbols-outlined text-sm">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>

          {/* Quick links */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-[0.16em] text-amber-300 font-semibold" style={{ fontFamily: "var(--font-label)" }}>
              Quick links
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <TransitionLink href="/menu" className="footer-link">
                  Full menu &amp; ordering
                </TransitionLink>
              </li>
              <li>
                <button type="button" onClick={() => go("/#menu")} className="footer-link">
                  Signature lineup
                </button>
              </li>
              <li>
                <button type="button" onClick={() => go("/#visit")} className="footer-link">
                  Visit us
                </button>
              </li>
              <li>
                <button type="button" onClick={() => window.dispatchEvent(new Event("nurvana:open-faq"))} className="footer-link">
                  Ask Nurvana
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ─── Sign-off ─── */}
      <div className="relative border-t border-hairline">
        <div className="max-w-[1300px] mx-auto px-6 md:px-12 lg:px-16 pt-10 text-center">
          <p className="italic text-xl md:text-2xl text-amber-200/90" style={{ fontFamily: "var(--font-handwritten)" }}>
            Sip the Brew. Feel Brand New.
          </p>
        </div>
        <div className="flex items-center justify-center gap-[2vw] px-4 -mb-[0.12em] select-none" aria-hidden="true">
          <span className="relative w-[9vw] max-w-[110px] aspect-square rounded-full overflow-hidden bg-white shrink-0 ring-4 ring-amber-900/40">
            <Image src="/icon.jpg" alt="" fill sizes="110px" className="object-cover" unoptimized />
          </span>
          <span className="footer-wordmark font-black leading-[0.85] tracking-tighter text-[18vw] lg:text-[15rem]" style={{ fontFamily: "var(--font-display)" }}>
            Nurvaná
          </span>
        </div>
      </div>

      {/* ─── Bottom bar ─── */}
      <div className="relative bg-black/25">
        <div className="max-w-[1300px] mx-auto px-6 md:px-12 lg:px-16 py-6 flex flex-col md:flex-row justify-between items-center gap-5">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-xs font-mono text-stone-400 text-center sm:text-left">
            <span>© 2026 Nurvana Café. All rights reserved.</span>
            <span className="hidden sm:inline opacity-40">•</span>
            <span className="text-amber-200/60">Crafted with intention &amp; brewed for community.</span>
          </div>
          <div className="flex items-center gap-6 text-xs font-mono text-stone-400">
            <button type="button" onClick={() => setLegal("privacy")} className="hover:text-amber-200 transition-colors underline-offset-4 hover:underline cursor-pointer">
              Privacy
            </button>
            <button type="button" onClick={() => setLegal("terms")} className="hover:text-amber-200 transition-colors underline-offset-4 hover:underline cursor-pointer">
              Terms
            </button>
            <button
              onClick={scrollToTop}
              className="px-3.5 py-1.5 rounded-full bg-amber-950/80 border border-hairline text-stone-300 hover:text-white hover:border-amber-400 transition-colors flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider cursor-pointer group"
              aria-label="Back to top"
            >
              <span>Top</span>
              <span aria-hidden="true" className="material-symbols-outlined text-xs transition-transform group-hover:-translate-y-0.5">
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
