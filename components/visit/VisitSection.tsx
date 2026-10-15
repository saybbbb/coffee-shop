"use client";

import { useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { CAFE, DIRECTIONS_URL, MAP_EMBED_URL, formatTime, fullAddress, streetAddress } from "@/data/cafe";
import TransitionLink from "@/components/transition/TransitionLink";
import OpenBadge from "./OpenBadge";
import { useOpenStatus } from "./useOpenStatus";

export default function VisitSection() {
  const status = useOpenStatus();
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(fullAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  return (
    <section
      id="visit"
      className="relative w-full py-20 md:py-0 md:pt-16 md:h-screen md:flex md:flex-col md:justify-center overflow-hidden"
      style={{ backgroundColor: "var(--color-surface)" }}
      aria-labelledby="visit-heading"
    >
      {/* Ambient glow */}
      <div
        className="absolute -bottom-32 right-0 w-[30rem] h-[30rem] rounded-full blur-3xl opacity-40 pointer-events-none"
        style={{ backgroundColor: "var(--color-secondary-container)" }}
        aria-hidden="true"
      />

      <div className="relative max-w-[1300px] mx-auto px-4 sm:px-6 md:px-16">
        {/* Header */}
        <div data-scroll-anchor className="visit-head flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 md:mb-10">
          <div className="space-y-2">
            <span
              className="inline-block text-[11px] sm:text-xs font-mono uppercase tracking-[0.16em] px-2.5 py-1 rounded-full bg-amber-900/10"
              style={{ color: "var(--color-secondary)", fontFamily: "var(--font-label)" }}
            >
              07 / Visit Us
            </span>
            <h2
              id="visit-heading"
              className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight leading-[0.95]"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-primary)" }}
            >
              Come sit a while.
            </h2>
          </div>
          <div className="flex flex-col md:items-end gap-3">
            <p
              className="italic text-lg md:text-xl max-w-sm md:text-right"
              style={{ fontFamily: "var(--font-handwritten)", color: "var(--color-on-surface-variant)" }}
            >
              A corner table, a warm cup, and nowhere you need to be.
            </p>
            <TransitionLink href="/menu" className="nurvana-btn-solid group self-start md:self-end">
              <span>Order ahead for pickup</span>
              <span aria-hidden="true" className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">arrow_forward</span>
            </TransitionLink>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Map + photo */}
          <div className="lg:col-span-7 relative pt-6 sm:pt-4">
            <div
              className="visit-map relative aspect-[4/3] sm:aspect-[16/11] rounded-[28px] overflow-hidden shadow-xl border"
              style={{ borderColor: "var(--color-outline-variant)" }}
            >
              {/* Real Google Map of the café, warmed slightly to sit in the palette */}
              <iframe
                src={MAP_EMBED_URL}
                title={`Map: ${CAFE.address.place}, ${streetAddress}`}
                className="visit-map-frame absolute inset-0 w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>

            {/* Polaroid of the interior */}
            <figure
              className="visit-photo absolute -top-1 sm:-top-4 -right-1 sm:-right-5 w-28 sm:w-44 p-1.5 sm:p-2 pb-2 sm:pb-3 bg-white shadow-2xl rounded-md pointer-events-none"
              style={{ transform: "rotate(5deg)" }}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-stone-200">
                <Image src="/home/hero-bg.jpg" alt="Inside the Nurvana roastery" fill sizes="210px" className="object-cover" />
              </div>
              <figcaption
                className="text-center text-xs sm:text-sm italic mt-1.5"
                style={{ fontFamily: "var(--font-handwritten)", color: "var(--color-on-surface-variant)" }}
              >
                inside the roastery
              </figcaption>
            </figure>
          </div>

          {/* Details */}
          <div className="lg:col-span-5 space-y-5">
            {/* Hours */}
            <div className="visit-item rounded-3xl p-5 md:p-6 glass-panel shadow-sm" style={{ backgroundColor: "var(--color-surface-container-low)" }}>
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 mb-4">
                <h3 className="sheet-label whitespace-nowrap">Opening hours</h3>
                <OpenBadge className="whitespace-nowrap" />
              </div>
              <ul className="divide-y" style={{ borderColor: "var(--color-outline-variant)" }}>
                {CAFE.hours.map((row, i) => {
                  const isToday = status?.todayIndex === i;
                  return (
                    <li
                      key={row.label}
                      className={`flex justify-between items-center py-1.5 px-3 -mx-3 rounded-xl transition-colors ${isToday ? "bg-amber-900/[0.07]" : ""}`}
                      style={{ borderColor: "var(--color-outline-variant)" }}
                    >
                      <span className="flex items-center gap-2 text-sm" style={{ color: "var(--color-on-surface-variant)" }}>
                        {row.label}
                        {isToday && (
                          <span className="text-xs md:text-[11px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "var(--color-primary)", color: "var(--color-on-primary)" }}>
                            Today
                          </span>
                        )}
                      </span>
                      <span className={`font-mono text-sm ${isToday ? "font-bold" : ""}`} style={{ color: "var(--color-primary)" }}>
                        {formatTime(row.open)} – {formatTime(row.close)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Address & contact */}
            <ul className="space-y-3">
              <li className="visit-item flex items-start gap-3">
                <span className="visit-icon" aria-hidden="true">
                  <span aria-hidden="true" className="material-symbols-outlined">location_on</span>
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold" style={{ color: "var(--color-primary)" }}>
                    {CAFE.address.place}
                  </p>
                  <p className="text-sm" style={{ color: "var(--color-on-surface-variant)" }}>
                    {streetAddress}
                  </p>
                  <a
                    href={DIRECTIONS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline"
                    style={{ color: "var(--color-secondary)" }}
                  >
                    <span aria-hidden="true" className="material-symbols-outlined text-base">
                      directions
                    </span>
                    Get directions
                  </a>
                </div>
                <button
                  type="button"
                  onClick={copyAddress}
                  className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-mono transition-colors hover:bg-black/5 cursor-pointer"
                  style={{ borderColor: "var(--color-outline-variant)", color: "var(--color-primary)", fontFamily: "var(--font-label)" }}
                  aria-label="Copy address"
                >
                  <span aria-hidden="true" className="material-symbols-outlined text-sm">{copied ? "check" : "content_copy"}</span>
                  <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
                </button>
              </li>
              {/* Phone and email share a row to keep the section on one screen */}
              <li className="visit-item flex flex-wrap items-center gap-x-6 gap-y-3">
                <span className="flex items-center gap-3">
                  <span className="visit-icon" aria-hidden="true">
                    <span className="material-symbols-outlined">call</span>
                  </span>
                  <span className="font-mono text-sm" style={{ color: "var(--color-primary)" }}>
                    {CAFE.phone}
                  </span>
                </span>
                <span className="flex items-center gap-3">
                  <span className="visit-icon" aria-hidden="true">
                    <span className="material-symbols-outlined">mail</span>
                  </span>
                  <a
                    href={`mailto:${CAFE.email}`}
                    className="font-mono text-sm underline-offset-4 hover:underline"
                    style={{ color: "var(--color-primary)" }}
                  >
                    {CAFE.email}
                  </a>
                </span>
              </li>
            </ul>

            {/* Amenities */}
            <div className="visit-item flex flex-wrap gap-2">
              {CAFE.amenities.map((a) => (
                <span
                  key={a.label}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
                  style={{ backgroundColor: "var(--color-tertiary-fixed)", color: "var(--color-on-tertiary-fixed)" }}
                >
                  <span aria-hidden="true" className="material-symbols-outlined text-sm">{a.icon}</span>
                  {a.label}
                </span>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Scroll effects for the section. Call inside the home page's gsap.context in
 * page order (last), so its pin is measured after every pin above it.
 * Desktop: pins like the other sections while the map and details reveal.
 */
export function setupVisitScroll(isMobile: boolean) {
  const section = document.querySelector<HTMLElement>("#visit");
  if (!section) return;
  const q = (sel: string) => section.querySelectorAll(sel);

  const tl = gsap.timeline({
    scrollTrigger: isMobile
      ? { trigger: section, start: "top 75%", once: true }
      : { id: "visit-trigger", trigger: section, start: "top top", end: "+=90%", pin: true, scrub: 0.6, anticipatePin: 1 },
  });

  tl.fromTo(q(".visit-head"), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" }, 0)
    .fromTo(q(".visit-map"), { opacity: 0, y: 60, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "power3.out" }, 0.05)
    .fromTo(q(".visit-photo"), { opacity: 0, y: 40, rotate: 4 }, { opacity: 1, y: 0, rotate: -5, duration: 0.3, ease: "back.out(1.6)" }, 0.3)
    .fromTo(q(".visit-item"), { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.25, stagger: 0.04, ease: "power2.out" }, 0.12);

  tl.addLabel("revealed"); // nav jumps land here (see lib/scrollToSection.ts)
  // Desktop: hold the finished layout for the rest of the pin
  if (!isMobile) tl.to({}, { duration: 0.45 });
  // Phones: the same reveal plays once in real time
  else tl.timeScale(0.4);
}
