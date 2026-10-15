"use client";

import { useEffect, useRef, useState } from "react";
import TransitionLink from "@/components/transition/TransitionLink";
import AnnouncementChip from "@/components/AnnouncementChip";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type MenuItem } from "@/data/menu";
import MenuBoard, { setupMenuBoardScroll } from "@/components/menuBoard/MenuBoard";
import ItemSheet from "@/components/menu/ItemSheet";
import VisitSection, { setupVisitScroll } from "@/components/visit/VisitSection";
import Reviews, { setupReviewsScroll } from "@/components/reviews/Reviews";
import BeanToCup, { setupBeanToCupScroll } from "@/components/process/BeanToCup";
import OurStory, { setupStoryScroll } from "@/components/story/OurStory";
import { usePageTransition } from "@/components/transition/PageTransition";
import Footer from "@/components/Footer";
import TeamStrips, { setupTeamScroll } from "@/components/team/TeamStrips";


export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const heroVideoRef = useRef<HTMLDivElement>(null);
  const [openItem, setOpenItem] = useState<MenuItem | null>(null);
  const { go } = usePageTransition();

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;

    if (prefersReducedMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      // 1. HERO PIN & 3D DISSOLVE
      if (heroRef.current && heroContentRef.current) {
        gsap.timeline({
          scrollTrigger: {
            id: "hero-trigger",
            trigger: heroRef.current,
            start: "top top",
            end: isMobile ? "+=50%" : "+=90%",
            pin: !isMobile,
            scrub: 0.6,
            anticipatePin: 1,
          },
        })
          .to(
            heroContentRef.current,
            {
              scale: 0.9,
              z: -120,
              opacity: 0,
              y: -40,
              ease: "power1.inOut",
            },
            0
          )
          .to(
            heroVideoRef.current,
            {
              scale: 1.05,
              opacity: 0.35,
              ease: "power1.inOut",
            },
            0
          );
      }

      // 2. OUR STORY — editorial statement + collage (pinned on desktop)
      setupStoryScroll(isMobile);

      // 2b. BEAN TO CUP — pinned sideways scroll (registered here to keep pins in page order)
      setupBeanToCupScroll(isMobile);

      // 3. SIGNATURE LINEUP — printed menu board (pinned on desktop)
      setupMenuBoardScroll(isMobile);

      // 4. OUR TEAM — expanding portrait strips (pinned on desktop)
      setupTeamScroll(isMobile);

      // 5. KIND WORDS + 6. VISIT US — registered last, in page order
      setupReviewsScroll(isMobile);
      setupVisitScroll(isMobile);
    }, containerRef);

    // Refresh ScrollTrigger to calculate accurate start/end positions
    ScrollTrigger.refresh();

    return () => {
      ctx.revert();
    };
  }, []);


  return (
    <div ref={containerRef} className="w-full relative overflow-x-hidden bg-[#fdf9f4]">
      {/* ─── SECTION 1: HERO (0:04–end video background) ─────────────────── */}
      <section
        id="hero"
        ref={heroRef}
        className="relative w-full min-h-[100dvh] flex flex-col justify-between overflow-hidden perspective-container"
        aria-label="Nurvana Café Hero"
        data-nav-theme="dark"
      >
        {/* Full-bleed muted looping video background */}
        <div ref={heroVideoRef} className="absolute inset-0 z-0 will-change-transform-opacity">
          <video
            src="/video/hero-pour.mp4"
            poster="/video/hero-pour-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
          {/* Subtle cinematic gradient vignette */}
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at center, transparent 30%, rgba(51, 33, 13, 0.45) 85%, rgba(51, 33, 13, 0.75) 100%)",
            }}
          />
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, rgba(51,33,13,0.3) 0%, transparent 40%, rgba(51,33,13,0.65) 100%)",
            }}
          />
          {/* Soft dark glow behind the headline so it reads over any frame of the video */}
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 58% 46% at 50% 50%, rgba(28,16,6,0.62) 0%, rgba(28,16,6,0.38) 55%, transparent 100%)",
            }}
          />
        </div>

        {/* Clean top spacer without overlapping badge */}
        <div className="h-16 w-full z-20 pointer-events-none" />

        {/* Center/Hero Content with 3D Depth */}
        <div
          ref={heroContentRef}
          className="relative z-20 max-w-[1300px] mx-auto px-4 sm:px-6 md:px-16 w-full text-center preserve-3d will-change-transform-opacity py-8 md:py-12"
        >
          {/* max-w-5xl lets "Feel Brand New." sit on one line at the largest size */}
          <div className="max-w-5xl mx-auto space-y-4 md:space-y-6">
            {/* Seasonal announcement (content in data/cafe.ts) */}
            <div className="flex justify-center">
              <AnnouncementChip />
            </div>

            <h1
              className="hero-title text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tight text-[#fdf9f4] leading-[0.95]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Sip the Brew.
              <br />
              <span
                className="italic font-normal text-amber-200"
                style={{ fontFamily: "var(--font-handwritten)" }}
              >
                Feel Brand New.
              </span>
            </h1>

            <p
              className="inline-block text-[11px] sm:text-sm font-mono tracking-[0.18em] uppercase text-amber-50 px-4 py-2 rounded-2xl sm:rounded-full bg-black/35 backdrop-blur-md border border-hairline"
              style={{ fontFamily: "var(--font-label)" }}
            >
              Artisanal single-origin • Small batch roasted • Daily crafted
            </p>

            {/* Calls to action */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 md:pt-4">
              <TransitionLink href="/menu" className="hero-cta-primary group w-full max-w-[290px] sm:w-auto">
                <span aria-hidden="true" className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                  local_mall
                </span>
                <span>Order for Pickup</span>
                <span aria-hidden="true" className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </TransitionLink>
              <button type="button" onClick={() => go("/#menu")} className="hero-cta-secondary w-full max-w-[290px] sm:w-auto">
                See the Lineup
              </button>
            </div>
          </div>
        </div>

        {/* Minimal Scroll Hint Indicator */}
        <div className="pb-8 md:pb-10 z-20 flex flex-col items-center justify-center gap-2 pointer-events-none">
          <span
            className="text-xs md:text-[11px] font-mono uppercase tracking-[0.2em] text-amber-100/90 drop-shadow"
            style={{ fontFamily: "var(--font-label)" }}
          >
            Scroll to Explore
          </span>
          <div className="w-[1px] h-6 md:h-8 bg-gradient-to-b from-amber-200 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ─── SECTION 2: OUR STORY (editorial statement, pinned on desktop) ── */}
      <OurStory />

      {/* ─── SECTION 3: BEAN TO CUP (pinned sideways scroll on desktop) ───── */}
      <BeanToCup />

      {/* ─── SECTION 4: SIGNATURE LINEUP (menu board + Find your brew quiz) ── */}
      <MenuBoard onOpen={setOpenItem} />

      {/* ─── SECTION 5: OUR TEAM (expanding portrait strips) ────────────── */}
      <TeamStrips onOpen={setOpenItem} />

      {/* ─── KIND WORDS (customer quotes) ───────────────────────────────── */}
      <Reviews onOpen={setOpenItem} />

      {/* ─── SECTION 5: VISIT US (map, live hours, contact) ───────────── */}
      <VisitSection />

      {/* ─── SECTION 6: FOOTER (Enhanced Roastery Experience) ─────────── */}
      <Footer />

      {openItem && <ItemSheet item={openItem} onClose={() => setOpenItem(null)} />}
    </div>
  );
}
