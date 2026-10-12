"use client";

import { gsap } from "gsap";
import { allItems, type MenuItem } from "@/data/menu";
import { RATING, REVIEWS, type Review } from "@/data/reviews";
import { PALETTES } from "@/components/menu/MenuArt";

function Stars({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex gap-0.5 text-amber-500 ${className}`} aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
          star
        </span>
      ))}
    </span>
  );
}

function ReviewCard({ review, onOpen }: { review: Review; onOpen: (item: MenuItem) => void }) {
  const drink = allItems.find((i) => i.id === review.drink);
  const p = PALETTES[review.tint];
  return (
    <figure
      className="h-full w-[290px] sm:w-[330px] shrink-0 rounded-3xl p-5 flex flex-col gap-3 shadow-lg"
      style={{ backgroundColor: "var(--color-surface)", color: "var(--color-on-surface)" }}
    >
      <div className="flex items-center justify-between">
        <Stars />
        <span className="material-symbols-outlined text-2xl opacity-20" style={{ color: "var(--color-primary)" }} aria-hidden="true">
          format_quote
        </span>
      </div>
      <blockquote className="text-sm leading-relaxed flex-1" style={{ color: "var(--color-on-surface-variant)" }}>
        &ldquo;{review.quote}&rdquo;
      </blockquote>
      <figcaption className="flex items-center gap-3 pt-3 border-t" style={{ borderColor: "var(--color-outline-variant)" }}>
        <span
          className="w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0"
          style={{ background: `radial-gradient(circle at 30% 25%, ${p.from}, ${p.to})`, color: p.ink, fontFamily: "var(--font-display)" }}
          aria-hidden="true"
        >
          {review.name[0]}
        </span>
        <span className="flex-1 min-w-0 leading-tight">
          <span className="block font-semibold text-sm" style={{ color: "var(--color-primary)" }}>
            {review.name}
          </span>
          <span className="block text-xs" style={{ color: "var(--color-outline)" }}>
            {review.since}
          </span>
        </span>
        {drink && (
          <button
            type="button"
            onClick={() => onOpen(drink)}
            className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold cursor-pointer transition-colors hover:bg-[var(--color-primary)] hover:text-[var(--color-on-primary)]"
            style={{ backgroundColor: "var(--color-secondary-fixed)", color: "var(--color-primary)" }}
            aria-label={`${review.name} ordered ${drink.name}. View it`}
            title={drink.name}
          >
            <span className="material-symbols-outlined text-sm">local_cafe</span>
            <span className="max-w-[92px] truncate">{drink.name}</span>
          </button>
        )}
      </figcaption>
    </figure>
  );
}

/** One endlessly drifting row; the list is doubled so the loop is seamless. */
function Row({ reviews, reverse, onOpen }: { reviews: Review[]; reverse?: boolean; onOpen: (item: MenuItem) => void }) {
  return (
    <div className="reviews-row marquee relative overflow-hidden py-2">
      <div className={`marquee-track flex gap-5 w-max ${reverse ? "marquee-reverse" : ""}`}>
        {[...reviews, ...reviews].map((r, i) => (
          // Second copy is only there to make the loop seamless
          <div key={`${r.name}-${i}`} className="flex" aria-hidden={i >= reviews.length || undefined}>
            <ReviewCard review={r} onOpen={onOpen} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Reviews({ onOpen }: { onOpen: (item: MenuItem) => void }) {
  const half = Math.ceil(REVIEWS.length / 2);
  return (
    <section
      id="reviews"
      data-nav-theme="dark"
      className="relative w-full md:h-screen flex flex-col justify-center overflow-hidden py-20 md:pt-20 md:pb-6 text-[#fdf9f4]"
      style={{
        backgroundColor: "var(--color-primary)",
        backgroundImage:
          "radial-gradient(ellipse at 80% 0%, color-mix(in srgb, var(--color-primary-container) 70%, transparent) 0%, transparent 55%), radial-gradient(ellipse at 10% 100%, rgba(196,138,85,0.16) 0%, transparent 50%)",
      }}
      aria-labelledby="reviews-heading"
    >
      <div className="reviews-head max-w-[1300px] mx-auto w-full px-4 sm:px-6 md:px-16 mb-6 md:mb-8 flex flex-col md:flex-row md:items-end justify-between gap-5">
        <div className="space-y-2">
          <span
            className="inline-block text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] px-2.5 py-1 rounded-full bg-white/10 text-amber-200"
            style={{ fontFamily: "var(--font-label)" }}
          >
            06 / Kind Words
          </span>
          <h2
            id="reviews-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[0.95]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Regulars say
            <br />
            <span className="italic font-light text-amber-200" style={{ fontFamily: "var(--font-handwritten)" }}>
              it best.
            </span>
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-5xl md:text-6xl font-black tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            {RATING.score}
          </span>
          <span className="space-y-1">
            <Stars />
            <span className="block text-xs font-mono text-stone-300" style={{ fontFamily: "var(--font-label)" }}>
              from {RATING.count} reviews
            </span>
          </span>
        </div>
      </div>

      {/* Soft fade at both edges so cards drift in and out */}
      <div className="reviews-rows space-y-4 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
        <Row reviews={REVIEWS.slice(0, half)} onOpen={onOpen} />
        <Row reviews={REVIEWS.slice(half)} reverse onOpen={onOpen} />
      </div>
    </section>
  );
}

/**
 * Scroll effects for the section. Call inside the home page's gsap.context in
 * page order (after Our Team) so its pin is measured after the pins above it.
 */
export function setupReviewsScroll(isMobile: boolean) {
  const section = document.querySelector<HTMLElement>("#reviews");
  if (!section) return;
  const head = section.querySelector(".reviews-head");
  const rows = section.querySelectorAll(".reviews-row");

  if (isMobile) {
    gsap.fromTo(
      [head, ...rows],
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: section, start: "top 80%", once: true } }
    );
    return;
  }

  gsap
    .timeline({
      scrollTrigger: {
        id: "reviews-trigger",
        trigger: section,
        start: "top top",
        end: "+=90%",
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
      },
    })
    .fromTo(head, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }, 0)
    .fromTo(rows[0], { opacity: 0, xPercent: 12 }, { opacity: 1, xPercent: 0, duration: 0.35, ease: "power2.out" }, 0.05)
    .fromTo(rows[1], { opacity: 0, xPercent: -12 }, { opacity: 1, xPercent: 0, duration: 0.35, ease: "power2.out" }, 0.1)
    .to({}, { duration: 0.5 });
}
