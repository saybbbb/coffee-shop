"use client";

import Image from "next/image";
import { gsap } from "gsap";

/**
 * "Our Story" — an editorial statement whose words light up as you scroll,
 * with small photos set inline in the sentence, a layered photo collage and
 * counting stats. Scroll effects are created by the home page in page order
 * via `setupStoryScroll`.
 */

type Token = { text: string } | { em: string } | { img: string; alt: string };

const STATEMENT: Token[] = [
  { text: "In a world of instant everything, we slow down for the deliberate art of" },
  { em: "small-lot roasting" },
  { img: "/story/coffee-beans.jpg", alt: "Freshly roasted beans" },
  { text: ", the patience of" },
  { em: "a proper pour" },
  { img: "/process/brewed.jpg", alt: "Espresso pouring" },
  { text: ", and the quiet warmth of" },
  { em: "real community." },
  { img: "/home/hero-bg.jpg", alt: "Inside the café" },
];

const STATS = [
  { value: 100, from: 0, suffix: "%", label: "Fair-trade sourced" },
  { value: 4, from: 0, suffix: "", label: "Origins on rotation" },
  { value: 12, from: 0, suffix: " kg", label: "Small-batch roasts" },
  { value: 2021, from: 2010, suffix: "", label: "Brewing since" },
];

const STAMP_TEXT = "SMALL BATCH • ROASTED DAILY • EST. 2021 • ";

function Statement() {
  return (
    <p
      className="story-statement text-[1.75rem] leading-[1.18] sm:text-4xl md:text-[2.6rem] lg:text-[2.75rem] md:leading-[1.14] font-bold tracking-tight"
      style={{ fontFamily: "var(--font-display)", color: "var(--color-primary)" }}
    >
      {STATEMENT.map((t, i) => {
        if ("img" in t) {
          return (
            <span key={i} className="story-word story-pill relative inline-block align-middle ml-1 mr-1 w-[1.9em] h-[1.1em] rounded-full overflow-hidden shadow-md ring-2 ring-white -translate-y-[0.06em]">
              <Image src={t.img} alt={t.alt} fill sizes="90px" className="object-cover" loading="eager" />
            </span>
          );
        }
        if ("em" in t) {
          return t.em.split(" ").map((w, j) => (
            <span
              key={`${i}-${j}`}
              className="story-word inline-block italic font-normal mr-[0.22em]"
              style={{ fontFamily: "var(--font-handwritten)", color: "var(--color-secondary)" }}
            >
              {w}
            </span>
          ));
        }
        return t.text.split(" ").map((w, j) => (
          <span key={`${i}-${j}`} className="story-word inline-block mr-[0.22em]">
            {w}
          </span>
        ));
      })}
    </p>
  );
}

/** Slowly rotating circular stamp. */
function Stamp() {
  return (
    <div className="story-stamp absolute -top-6 -left-6 md:-left-10 w-28 h-28 md:w-32 md:h-32 z-20" aria-hidden="true">
      <svg viewBox="0 0 140 140" className="w-full h-full story-stamp-spin">
        <defs>
          <path id="story-stamp-circle" d="M70 70 m -54 0 a 54 54 0 1 1 108 0 a 54 54 0 1 1 -108 0" />
        </defs>
        <circle cx="70" cy="70" r="68" fill="var(--color-primary)" />
        <text fill="#f6e0b9" fontFamily="Space Mono, monospace" fontSize="10.5">
          {/* textLength stretches the text to exactly one lap of the circle */}
          <textPath href="#story-stamp-circle" textLength="336" lengthAdjust="spacing">
            {STAMP_TEXT}
          </textPath>
        </text>
      </svg>
      <span className="absolute inset-0 flex items-center justify-center">
        <span aria-hidden="true" className="material-symbols-outlined text-3xl text-amber-200" style={{ fontVariationSettings: "'FILL' 1" }}>
          coffee
        </span>
      </span>
    </div>
  );
}

function Collage() {
  return (
    <div className="story-collage relative w-full max-w-[460px] mx-auto aspect-[4/5] md:aspect-auto md:h-[min(58vh,520px)]">
      {/* Main photo */}
      <div className="story-photo-main absolute inset-y-0 left-[6%] right-[10%] rounded-[32px] overflow-hidden shadow-2xl">
        <Image src="/story/barista2.jpg" alt="Barista crafting latte art" fill sizes="(max-width: 768px) 80vw, 380px" className="object-cover" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      </div>

      {/* Polaroid */}
      <figure className="story-photo-polaroid absolute -right-1 md:-right-4 bottom-[8%] w-[44%] bg-white p-2 pb-3 rounded-md shadow-2xl rotate-[6deg] z-10">
        <div className="relative aspect-square overflow-hidden rounded-sm">
          <Image src="/story/barista.jpg" alt="Pouring latte art" fill sizes="200px" className="object-cover" loading="eager" />
        </div>
        <figcaption
          className="text-center text-xs md:text-sm italic mt-1.5"
          style={{ fontFamily: "var(--font-handwritten)", color: "var(--color-on-surface-variant)" }}
        >
          every cup, by hand
        </figcaption>
      </figure>

      {/* Round inset */}
      <div className="story-photo-round absolute -left-2 md:-left-6 bottom-[-4%] w-[34%] aspect-square rounded-full overflow-hidden ring-[6px] ring-[var(--color-surface)] shadow-xl z-10">
        <Image src="/process/sourced.jpg" alt="Hand-picked coffee cherries" fill sizes="160px" className="object-cover" loading="eager" />
      </div>

      <Stamp />
    </div>
  );
}

export default function OurStory() {
  return (
    <section
      id="story"
      className="relative w-full md:h-screen overflow-hidden flex flex-col justify-center py-20 md:pt-24 md:pb-8"
      style={{
        backgroundColor: "var(--color-surface)",
        backgroundImage:
          "radial-gradient(ellipse at 85% 20%, color-mix(in srgb, var(--color-secondary-container) 70%, transparent) 0%, transparent 55%), radial-gradient(ellipse at 0% 100%, color-mix(in srgb, var(--color-primary-fixed) 45%, transparent) 0%, transparent 50%)",
      }}
      aria-labelledby="story-heading"
    >
      {/* Huge faint wordmark behind everything */}
      <span
        className="pointer-events-none select-none absolute -bottom-[0.2em] left-1/2 -translate-x-1/2 text-[22vw] font-black leading-none tracking-tighter whitespace-nowrap"
        style={{ fontFamily: "var(--font-display)", color: "transparent", WebkitTextStroke: "1px color-mix(in srgb, var(--color-primary) 9%, transparent)" }}
        aria-hidden="true"
      >
        Nurvaná
      </span>

      <div className="relative max-w-[1300px] mx-auto w-full px-4 sm:px-6 md:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Statement */}
          <div className="lg:col-span-7 space-y-6 md:space-y-7">
            <div className="story-kicker flex items-center gap-3 flex-wrap">
              <span
                className="inline-block text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] px-2.5 py-1 rounded-full bg-amber-900/10"
                style={{ color: "var(--color-secondary)", fontFamily: "var(--font-label)" }}
              >
                02 / Our Story
              </span>
              <h2 id="story-heading" className="text-xs font-mono uppercase tracking-[0.2em]" style={{ color: "var(--color-outline)", fontFamily: "var(--font-label)" }}>
                Brewed with intention
              </h2>
            </div>
            <Statement />
          </div>

          {/* Collage */}
          <div className="lg:col-span-5">
            <Collage />
          </div>
        </div>

        {/* Stats */}
        <dl className="story-stats mt-12 md:mt-10 grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-6 pt-6 border-t" style={{ borderColor: "var(--color-outline-variant)" }}>
          {STATS.map((s) => (
            <div key={s.label} className="story-stat">
              <dt className="sr-only">{s.label}</dt>
              <dd
                className="text-3xl md:text-4xl font-black tracking-tight"
                style={{ fontFamily: "var(--font-display)", color: "var(--color-primary)" }}
              >
                <span className="story-count" data-to={s.value} data-from={s.from}>
                  {s.value}
                </span>
                {s.suffix}
              </dd>
              <dd className="text-[11px] md:text-xs font-mono uppercase tracking-wider mt-0.5" style={{ color: "var(--color-outline)", fontFamily: "var(--font-label)" }} aria-hidden="true">
                {s.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/** Count a number up as its tween progresses (works scrubbed or in real time). */
function countUp(el: HTMLElement) {
  const to = Number(el.dataset.to);
  const from = Number(el.dataset.from ?? 0);
  const state = { v: from };
  return gsap.fromTo(
    state,
    { v: from },
    {
      v: to,
      ease: "power1.out",
      onUpdate: () => {
        el.textContent = String(Math.round(state.v));
      },
    }
  );
}

/**
 * Creates the section's scroll effects. Call inside the home page's gsap.context,
 * after the hero and before Bean to Cup, so pins are registered in page order.
 */
export function setupStoryScroll(isMobile: boolean) {
  const section = document.querySelector<HTMLElement>("#story");
  if (!section) return;
  const q = (sel: string) => gsap.utils.toArray<HTMLElement>(sel, section);
  const words = q(".story-word");
  const counts = q(".story-count");

  const tl = gsap.timeline({
    scrollTrigger: isMobile
      ? { trigger: section, start: "top 70%", end: "bottom 60%", scrub: 0.6 }
      : { id: "story-trigger", trigger: section, start: "top top", end: "+=140%", pin: true, scrub: 0.6, anticipatePin: 1 },
  });

  tl.fromTo(q(".story-kicker"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.08 }, 0)
    // Words light up one after another as you scroll
    .fromTo(words, { opacity: 0.14 }, { opacity: 1, stagger: 0.012, duration: 0.06, ease: "none" }, 0.04)
    .fromTo(q(".story-pill"), { scale: 0.6 }, { scale: 1, stagger: 0.12, duration: 0.08, ease: "back.out(2)" }, 0.08)
    // Collage drifts into place, layers at different speeds for depth
    // The main photo rises into frame from the bottom up. The clip reaches past
    // the sides and bottom so the photo's drop shadow is never cut off.
    .fromTo(
      q(".story-photo-main"),
      { y: 60, opacity: 0.4, clipPath: "inset(45% -15% -15% -15%)" },
      { y: 0, opacity: 1, clipPath: "inset(0% -15% -15% -15%)", duration: 0.4, ease: "power2.out" },
      0
    )
    .fromTo(q(".story-photo-polaroid"), { y: 140, rotate: 14 }, { y: 0, rotate: 6, duration: 0.45, ease: "power2.out" }, 0.05)
    .fromTo(q(".story-photo-round"), { y: 100, scale: 0.8 }, { y: 0, scale: 1, duration: 0.45, ease: "power2.out" }, 0.1)
    // The badge is pressed onto the collage like a stamp: it drops from above
    // the page, speeding up until it lands, instead of growing out of nothing
    .fromTo(q(".story-stamp"), { opacity: 0, scale: 1.6, rotate: -40 }, { opacity: 1, scale: 1, rotate: 0, duration: 0.14, ease: "power3.in" }, 0.22)
    // Stats rise and count up
    .fromTo(q(".story-stat"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, stagger: 0.04, duration: 0.12 }, 0.5);
  counts.forEach((el, i) => tl.add(countUp(el).duration(0.25), 0.52 + i * 0.04));

  tl.addLabel("revealed"); // nav jumps land here (see lib/scrollToSection.ts)
  // Desktop: hold the finished section for a moment before moving on
  if (!isMobile) tl.to({}, { duration: 0.2 });
}
