"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { menu } from "@/data/menu";

const teamMembers = [
  { name: "Sent Japhet M. Cagas", role: "Head Roaster & Founder", icon: "badge" },
  { name: "Honeylyn Faith R. Delsocora", role: "Master Barista", icon: "local_cafe" },
  { name: "Charles B. Henares", role: "Pastry Chef", icon: "bakery_dining" },
  { name: "Lourence D. Labe", role: "Coffee Sommelier", icon: "workspace_premium" },
  { name: "Desire Ann Saducas", role: "General Manager", icon: "storefront" },
];

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const heroVideoRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLElement>(null);
  const storyVisualRef = useRef<HTMLDivElement>(null);
  const storyTextRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const menuCardsRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLElement>(null);
  const teamGridRef = useRef<HTMLDivElement>(null);

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

      // 2. OUR STORY PIN & 3D PARALLAX
      if (storyRef.current && storyVisualRef.current && storyTextRef.current) {
        const storyTl = gsap.timeline({
          scrollTrigger: {
            id: "story-trigger",
            trigger: storyRef.current,
            start: isMobile ? "top 80%" : "top top",
            end: isMobile ? "bottom 20%" : "+=130%",
            pin: !isMobile,
            scrub: 0.6,
            anticipatePin: 1,
          },
        });

        if (!isMobile) {
          storyTl
            .fromTo(
              storyVisualRef.current,
              { opacity: 0, scale: 0.88, rotateY: 8, z: -80, x: -30 },
              { opacity: 1, scale: 1, rotateY: 0, z: 0, x: 0, ease: "power2.out", duration: 0.35 },
              0
            )
            .fromTo(
              storyTextRef.current,
              { opacity: 0, y: 50, z: -50 },
              { opacity: 1, y: 0, z: 0, ease: "power2.out", duration: 0.35 },
              0.05
            )
            .to({}, { duration: 0.4 })
            .to(
              [storyVisualRef.current, storyTextRef.current],
              { opacity: 0, y: -40, scale: 0.94, z: -80, ease: "power1.in", duration: 0.25 }
            );
        } else {
          storyTl
            .fromTo(
              [storyVisualRef.current, storyTextRef.current],
              { opacity: 0.3, y: 30 },
              { opacity: 1, y: 0, stagger: 0.1, duration: 1, ease: "power2.out" }
            );
        }
      }

      // 3. THE MENU SHOWCASE PIN & 3D BENTO
      if (menuRef.current && menuCardsRef.current) {
        const menuTl = gsap.timeline({
          scrollTrigger: {
            id: "menu-trigger",
            trigger: menuRef.current,
            start: isMobile ? "top 80%" : "top top",
            end: isMobile ? "bottom 20%" : "+=140%",
            pin: !isMobile,
            scrub: 0.6,
            anticipatePin: 1,
          },
        });

        const cards = menuCardsRef.current.querySelectorAll(".menu-scrolly-card");

        if (!isMobile) {
          menuTl
            .fromTo(
              cards,
              { opacity: 0, y: 70, scale: 0.9, rotateX: 12, z: -60 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                rotateX: 0,
                z: 0,
                stagger: 0.04,
                ease: "power2.out",
                duration: 0.35,
              },
              0
            )
            .to({}, { duration: 0.4 })
            .to(cards, {
              scale: 0.94,
              opacity: 0,
              z: -100,
              stagger: 0.03,
              ease: "power1.in",
              duration: 0.25,
            });
        } else {
          menuTl.fromTo(
            cards,
            { opacity: 0.4, y: 20 },
            { opacity: 1, y: 0, stagger: 0.08, duration: 0.8, ease: "power2.out" }
          );
        }
      }

      // 4. OUR TEAM PIN & 3D CARDS REVEAL
      if (teamRef.current && teamGridRef.current) {
        const teamTl = gsap.timeline({
          scrollTrigger: {
            id: "team-trigger",
            trigger: teamRef.current,
            start: isMobile ? "top 80%" : "top top",
            end: isMobile ? "bottom 20%" : "+=100%",
            pin: !isMobile,
            scrub: 0.6,
            anticipatePin: 1,
          },
        });

        const teamCards = teamGridRef.current.querySelectorAll(".team-scrolly-card");

        if (!isMobile) {
          teamTl
            .fromTo(
              teamCards,
              { opacity: 0, scale: 0.85, y: 50, z: -80 },
              {
                opacity: 1,
                scale: 1,
                y: 0,
                z: 0,
                stagger: 0.04,
                ease: "power2.out",
                duration: 0.4,
              },
              0
            )
            .to({}, { duration: 0.6 });
        } else {
          teamTl.fromTo(
            teamCards,
            { opacity: 0.4, y: 20 },
            { opacity: 1, y: 0, stagger: 0.06, duration: 0.8, ease: "power2.out" }
          );
        }
      }
    }, containerRef);

    // Refresh ScrollTrigger to calculate accurate start/end positions
    ScrollTrigger.refresh();

    return () => {
      ctx.revert();
    };
  }, []);

  // All menu items across categories for home showcase
  const featuredMenuItems = menu.flatMap((c) => c.items);

  return (
    <div ref={containerRef} className="w-full relative overflow-x-hidden bg-[#fdf9f4]">
      {/* ─── SECTION 1: HERO (0:04–end video background) ─────────────────── */}
      <section
        id="hero"
        ref={heroRef}
        className="relative w-full min-h-[100dvh] flex flex-col justify-between overflow-hidden perspective-container"
        aria-label="Nurvana Café Hero"
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
        </div>

        {/* Clean top spacer without overlapping badge */}
        <div className="h-16 w-full z-20 pointer-events-none" />

        {/* Center/Hero Content with 3D Depth */}
        <div
          ref={heroContentRef}
          className="relative z-20 max-w-[1300px] mx-auto px-4 sm:px-6 md:px-16 w-full text-center preserve-3d will-change-transform-opacity py-8 md:py-12"
        >
          <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
            <h1
              className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tight text-[#fdf9f4] drop-shadow-lg leading-[0.95]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Sip the Brew.
              <br />
              <span
                className="italic font-light text-amber-200"
                style={{ fontFamily: "var(--font-handwritten)" }}
              >
                Feel Brand New.
              </span>
            </h1>

            <p
              className="text-xs sm:text-sm md:text-base font-mono tracking-widest uppercase text-amber-100/90 max-w-xl mx-auto drop-shadow"
              style={{ fontFamily: "var(--font-label)" }}
            >
              Artisanal single-origin • Small batch roasted • Daily crafted
            </p>
          </div>
        </div>

        {/* Minimal Scroll Hint Indicator */}
        <div className="pb-8 md:pb-10 z-20 flex flex-col items-center justify-center gap-2 pointer-events-none">
          <span
            className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.25em] text-amber-100/90 drop-shadow"
            style={{ fontFamily: "var(--font-label)" }}
          >
            Scroll to Explore
          </span>
          <div className="w-[1px] h-6 md:h-8 bg-gradient-to-b from-amber-200 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ─── SECTION 2: OUR STORY (3D Parallax & Depth) ───────────────────── */}
      <section
        id="story"
        ref={storyRef}
        className="relative w-full min-h-[100dvh] py-16 md:py-0 md:h-screen flex items-center justify-center overflow-hidden perspective-container"
        style={{ backgroundColor: "var(--color-surface-container-low)" }}
        aria-label="Our Story"
      >
        {/* Ambient subtle light glow */}
        <div
          className="absolute top-1/4 right-10 w-96 h-96 rounded-full blur-3xl opacity-40 pointer-events-none -z-10"
          style={{ backgroundColor: "var(--color-secondary-fixed)" }}
        />

        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 md:px-16 w-full relative z-10 preserve-3d">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 lg:gap-16 items-center">
            {/* Visuals Column with Layered Parallax */}
            <div ref={storyVisualRef} className="lg:col-span-6 relative preserve-3d">
              <div className="relative aspect-[16/10] sm:aspect-[4/3] md:aspect-[4/5] max-w-[440px] mx-auto rounded-2xl md:rounded-3xl overflow-hidden shadow-xl border border-stone-200">
                <Image
                  src="/story/barista2.jpg"
                  alt="Barista crafting milk latte art"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 440px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Floating 3D Accent Image */}
              <div
                className="absolute -bottom-6 -right-2 sm:-right-6 w-32 h-32 sm:w-44 sm:h-44 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border-4 border-[#fdf9f4] hidden sm:block will-change-transform-opacity"
                style={{ transform: "translateZ(50px)" }}
              >
                <Image
                  src="/story/coffee-beans.jpg"
                  alt="Freshly roasted whole coffee beans"
                  fill
                  className="object-cover"
                  sizes="180px"
                />
              </div>

              {/* Minimal floating badge */}
              <div
                className="absolute top-4 left-4 sm:top-6 sm:left-6 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full glass-panel shadow-md text-[10px] sm:text-xs font-mono tracking-wider uppercase text-[#33210d]"
                style={{ transform: "translateZ(70px)" }}
              >
                Direct Origin
              </div>
            </div>

            {/* Content Column with Sculptural Typography */}
            <div ref={storyTextRef} className="lg:col-span-6 space-y-4 md:space-y-6 preserve-3d">
              <div className="space-y-2">
                <span
                  className="inline-block text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] px-2.5 py-1 rounded-full bg-amber-900/10"
                  style={{
                    color: "var(--color-secondary)",
                    fontFamily: "var(--font-label)",
                  }}
                >
                  02 / Our Story
                </span>
                <h2
                  className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight leading-tight"
                  style={{ fontFamily: "var(--font-display)", color: "var(--color-primary)" }}
                >
                  Brewed with intention.
                  <br />
                  <span
                    className="italic font-normal"
                    style={{
                      fontFamily: "var(--font-handwritten)",
                      color: "var(--color-primary-container)",
                    }}
                  >
                    Crafted for community.
                  </span>
                </h2>
              </div>

              {/* Punchy stripped copy */}
              <p
                className="text-sm sm:text-base md:text-lg leading-relaxed max-w-lg font-light text-stone-700"
                style={{ fontFamily: "var(--font-body)" }}
              >
                In a world of instant everything, we slow down for the deliberate art of small-lot
                roasting and the quiet warmth of real community.
              </p>

              {/* Large Minimal Stat Callouts */}
              <div
                className="grid grid-cols-2 gap-4 sm:gap-8 pt-4 sm:pt-6 border-t border-stone-300/80"
                style={{ borderColor: "var(--color-outline-variant)" }}
              >
                <div>
                  <span
                    className="block text-3xl sm:text-4xl md:text-6xl font-black tracking-tight"
                    style={{ fontFamily: "var(--font-display)", color: "var(--color-primary)" }}
                  >
                    100%
                  </span>
                  <span
                    className="text-[11px] sm:text-xs md:text-sm font-mono uppercase tracking-wider block mt-0.5 text-stone-600"
                    style={{ fontFamily: "var(--font-label)" }}
                  >
                    Fair Trade Sourced
                  </span>
                </div>

                <div>
                  <span
                    className="block text-3xl sm:text-4xl md:text-6xl font-black tracking-tight"
                    style={{ fontFamily: "var(--font-display)", color: "var(--color-primary)" }}
                  >
                    Small
                  </span>
                  <span
                    className="text-[11px] sm:text-xs md:text-sm font-mono uppercase tracking-wider block mt-0.5 text-stone-600"
                    style={{ fontFamily: "var(--font-label)" }}
                  >
                    Batch Roasted
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 3: THE MENU SHOWCASE (Responsive 3D Bento & Mobile Carousel) ─ */}
      <section
        id="menu"
        ref={menuRef}
        className="relative w-full min-h-[100dvh] py-16 md:py-0 md:h-screen flex flex-col justify-center overflow-hidden perspective-container"
        style={{ backgroundColor: "var(--color-surface)" }}
        aria-label="The Menu Showcase"
      >
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 md:px-16 w-full preserve-3d">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 md:mb-8 gap-2">
            <div>
              <span
                className="inline-block text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] px-2.5 py-1 rounded-full bg-amber-900/10 mb-1 md:mb-2"
                style={{
                  color: "var(--color-secondary)",
                  fontFamily: "var(--font-label)",
                }}
              >
                03 / The Menu
              </span>
              <h2
                className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight"
                style={{ fontFamily: "var(--font-display)", color: "var(--color-primary)" }}
              >
                Signature Lineup
              </h2>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4">
              <span className="text-[11px] font-mono text-stone-500 md:hidden">
                Swipe to view 5 items →
              </span>
              <Link
                href="/menu"
                className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-amber-900 hover:text-amber-700 transition-colors group"
                style={{ fontFamily: "var(--font-label)" }}
              >
                <span>Full Menu</span>
                <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </Link>
            </div>
          </div>

          {/* Cards Container: Horizontal Scroll on Mobile, 5-col Grid on Desktop */}
          <div
            ref={menuCardsRef}
            className="flex md:grid md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory py-2 px-1 no-scrollbar touch-pan-x preserve-3d"
          >
            {featuredMenuItems.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="menu-scrolly-card snap-center shrink-0 w-[78vw] max-w-[280px] md:w-auto md:max-w-none group rounded-2xl p-4 sm:p-5 flex flex-col justify-between glass-panel hover:shadow-xl transition-all duration-300 preserve-3d will-change-transform-opacity min-h-[310px] sm:min-h-[330px] md:min-h-[340px]"
                style={{
                  backgroundColor: "var(--color-surface-container)",
                }}
              >
                {/* Top Image Preview */}
                <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3 md:mb-4 shadow-sm bg-stone-200">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 260px, 220px"
                  />
                  {item.staffPick && (
                    <span
                      className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider shadow-sm"
                      style={{
                        backgroundColor: "var(--color-primary)",
                        color: "var(--color-on-primary)",
                      }}
                    >
                      Staff Pick
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-1">
                  <div className="flex justify-between items-baseline gap-2">
                    <h3
                      className="font-bold text-sm sm:text-base leading-snug line-clamp-1"
                      style={{
                        fontFamily: "var(--font-body)",
                        color: "var(--color-primary)",
                      }}
                    >
                      {item.name}
                    </h3>
                    <span
                      className="font-mono font-bold text-sm text-amber-900 shrink-0"
                      style={{ fontFamily: "var(--font-label)" }}
                    >
                      ${item.price.toFixed(2)}
                    </span>
                  </div>

                  <p
                    className="text-xs text-stone-600 line-clamp-2 leading-relaxed"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {item.description}
                  </p>
                </div>

                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                  <div className="pt-2 md:pt-3 flex flex-wrap gap-1 mt-auto">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: "var(--color-secondary-fixed)",
                          color: "var(--color-on-secondary-fixed)",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: OUR TEAM (Responsive Showcase & Mobile Carousel) ──── */}
      <section
        id="team"
        ref={teamRef}
        className="relative w-full min-h-[100dvh] py-16 md:py-0 md:h-screen flex flex-col justify-center overflow-hidden perspective-container"
        style={{ backgroundColor: "var(--color-surface-container-low)" }}
        aria-label="Our Team"
      >
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 md:px-16 w-full preserve-3d">
          <div className="text-center max-w-2xl mx-auto mb-6 md:mb-10 space-y-1.5 md:space-y-2">
            <span
              className="inline-block text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] px-2.5 py-1 rounded-full bg-amber-900/10"
              style={{
                color: "var(--color-secondary)",
                fontFamily: "var(--font-label)",
              }}
            >
              04 / Our Team
            </span>
            <h2
              className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-primary)" }}
            >
              The Craftsmen &amp; Visionaries
            </h2>
            <p className="text-[11px] font-mono text-stone-500 md:hidden pt-1">
              Swipe to view all 5 team members →
            </p>
          </div>

          {/* Cards Container: Horizontal Scroll on Mobile, 5-col Grid on Desktop */}
          <div
            ref={teamGridRef}
            className="flex md:grid md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory py-2 px-1 no-scrollbar touch-pan-x preserve-3d"
          >
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="team-scrolly-card snap-center shrink-0 w-[68vw] max-w-[220px] md:w-auto md:max-w-none group rounded-2xl p-5 sm:p-6 glass-panel hover:shadow-xl transition-all duration-300 text-center flex flex-col items-center justify-center space-y-3 sm:space-y-4 preserve-3d will-change-transform-opacity min-h-[190px] sm:min-h-[210px]"
                style={{
                  backgroundColor: "var(--color-surface-container)",
                }}
              >
                {/* Icon Badge */}
                <div
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300"
                  style={{
                    backgroundColor: "var(--color-secondary-fixed)",
                    color: "var(--color-primary)",
                  }}
                >
                  <span className="material-symbols-outlined text-2xl">{member.icon}</span>
                </div>

                {/* Member Info */}
                <div className="space-y-1">
                  <h3
                    className="font-bold text-sm sm:text-base leading-snug"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "var(--color-primary)",
                    }}
                  >
                    {member.name}
                  </h3>
                  <p
                    className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-amber-900/80"
                    style={{ fontFamily: "var(--font-label)" }}
                  >
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 5: FOOTER (Clean, Grounded Release) ────────────────── */}
      <footer
        id="footer"
        className="w-full py-16 text-stone-200 relative z-20"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        <div className="max-w-[1300px] mx-auto px-6 md:px-16 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left space-y-2">
            <h2
              className="text-3xl font-extrabold tracking-tight text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Nurvana Café
            </h2>
            <p
              className="text-lg italic text-amber-200/90 font-light"
              style={{ fontFamily: "var(--font-handwritten)" }}
            >
              &ldquo;We&apos;re not just serving coffee — we&apos;re serving moments.&rdquo;
            </p>
          </div>

          <nav aria-label="Footer Navigation">
            <ul className="flex flex-wrap justify-center gap-6 text-xs font-mono uppercase tracking-wider text-amber-100/70">
              {["Privacy Policy", "Terms of Service", "Contact", "Careers"].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-amber-200 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <p className="text-xs font-mono text-stone-400 text-center md:text-right">
            © 2024 Nurvana Café. Handcrafted with intention.
          </p>
        </div>
      </footer>
    </div>
  );
}
