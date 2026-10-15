"use client";

import { useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { allItems, type MenuItem } from "@/data/menu";
import { TEAM, initials, type TeamMember } from "@/data/team";
import { PALETTES } from "@/components/menu/MenuArt";

/**
 * "Our Team" as expanding portrait strips. Laptops: strips sit side by side
 * and the hovered/focused one widens. Phones: strips stack and tapping one
 * expands it. Scroll effects come from `setupTeamScroll`.
 */

function Portrait({ member, active }: { member: TeamMember; active: boolean }) {
  if (member.photo) {
    return (
      <Image
        src={member.photo}
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 640px"
        className={`object-cover object-[50%_25%] transition-transform duration-[1.2s] ease-out ${active ? "scale-100" : "scale-110"}`}
      />
    );
  }
  // No photo yet: warm gradient with big initials
  const p = PALETTES[member.tint];
  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ background: `radial-gradient(circle at 30% 25%, ${p.from}, ${p.to})` }}>
      <span className="text-7xl font-black" style={{ fontFamily: "var(--font-display)", color: p.ink }}>
        {initials(member.name)}
      </span>
    </div>
  );
}

function Strip({
  member,
  index,
  active,
  onActivate,
  onOpen,
}: {
  member: TeamMember;
  index: number;
  active: boolean;
  onActivate: () => void;
  onOpen: (item: MenuItem) => void;
}) {
  const drink = allItems.find((i) => i.id === member.goTo);
  const firstName = member.name.split(" ")[0];

  return (
    <article
      className={`team-strip relative overflow-hidden rounded-[26px] shadow-lg ${active ? "is-active" : ""}`}
      onPointerEnter={(e) => e.pointerType === "mouse" && onActivate()}
    >
      <Portrait member={member} active={active} />

      {/* Shade: light when open, deeper when collapsed so the spine label reads */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: "linear-gradient(to top, rgba(28,16,6,0.88) 0%, rgba(28,16,6,0.35) 45%, rgba(28,16,6,0.05) 75%)",
        }}
      />
      <div className={`absolute inset-0 bg-[rgba(28,16,6,0.45)] transition-opacity duration-500 ${active ? "opacity-0" : "opacity-100"}`} />

      {/* Whole strip is the toggle (focus/tap/click); the go-to button sits above it */}
      <button
        type="button"
        onClick={onActivate}
        onFocus={onActivate}
        aria-expanded={active}
        aria-label={`${member.name}, ${member.role}`}
        className="absolute inset-0 z-10 cursor-pointer rounded-[26px] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-[-6px] focus-visible:outline-amber-200"
      />

      {/* Role badge (always visible) */}
      <span
        className="absolute top-4 left-4 z-20 w-10 h-10 rounded-full flex items-center justify-center shadow-md pointer-events-none"
        style={{ backgroundColor: "var(--color-secondary-fixed)", color: "var(--color-primary)" }}
        aria-hidden="true"
      >
        <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
          {member.icon}
        </span>
      </span>

      {/* Collapsed: name runs up the spine (laptops) */}
      <span
        className={`team-spine absolute bottom-6 left-1/2 z-20 pointer-events-none whitespace-nowrap text-lg font-bold text-[#fdf9f4] transition-opacity duration-300 ${
          active ? "opacity-0" : "opacity-100"
        }`}
        style={{ fontFamily: "var(--font-display)" }}
        aria-hidden="true"
      >
        {firstName}
      </span>

      {/* Collapsed (phones): name + role across the band */}
      <span
        className={`team-band-label absolute left-16 right-4 top-1/2 -translate-y-1/2 z-20 pointer-events-none text-[#fdf9f4] transition-opacity duration-300 ${
          active ? "opacity-0" : "opacity-100"
        }`}
        aria-hidden="true"
      >
        <span className="block font-bold leading-tight" style={{ fontFamily: "var(--font-display)" }}>
          {member.name}
        </span>
        <span className="block text-[11px] font-mono uppercase tracking-wider text-amber-200/90" style={{ fontFamily: "var(--font-label)" }}>
          {member.role}
        </span>
      </span>

      {/* Expanded details */}
      <div className={`team-details absolute inset-x-0 bottom-0 z-20 p-5 md:p-7 text-[#fdf9f4] pointer-events-none ${active ? "is-shown" : ""}`}>
        <p className="text-xs font-mono text-amber-200/80 mb-1" style={{ fontFamily: "var(--font-label)" }}>
          {String(index + 1).padStart(2, "0")} — {member.role}
        </p>
        <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight" style={{ fontFamily: "var(--font-display)" }}>
          {member.name}
        </h3>
        <p className="italic text-base md:text-lg text-amber-100/90 mt-1" style={{ fontFamily: "var(--font-handwritten)" }}>
          {member.line}
        </p>
        {drink && (
          <button
            type="button"
            tabIndex={active ? 0 : -1}
            onClick={() => onOpen(drink)}
            className="pointer-events-auto mt-4 inline-flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full text-sm font-semibold cursor-pointer transition-transform hover:scale-[1.03]"
            style={{ backgroundColor: "var(--color-secondary-fixed)", color: "var(--color-primary)" }}
            aria-label={`${firstName}'s go-to order: ${drink.name}`}
          >
            <span className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--color-primary)", color: "var(--color-secondary-fixed)" }} aria-hidden="true">
              <span className="material-symbols-outlined text-base">local_cafe</span>
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider opacity-70" style={{ fontFamily: "var(--font-label)" }}>
              Go-to
            </span>
            {drink.name}
          </button>
        )}
      </div>
    </article>
  );
}

export default function TeamStrips({ onOpen }: { onOpen: (item: MenuItem) => void }) {
  const [active, setActive] = useState(0);

  return (
    <section
      id="team"
      className="relative w-full md:h-screen flex flex-col justify-center overflow-hidden py-20 md:pt-24 md:pb-8"
      style={{ backgroundColor: "var(--color-surface-container-low)" }}
      aria-labelledby="team-heading"
    >
      <div className="max-w-[1300px] mx-auto w-full px-4 sm:px-6 md:px-16">
        <div className="team-head flex flex-col md:flex-row md:items-end justify-between gap-3 mb-6 md:mb-8">
          <div className="space-y-2">
            <span
              className="inline-block text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] px-2.5 py-1 rounded-full bg-amber-900/10"
              style={{ color: "var(--color-secondary)", fontFamily: "var(--font-label)" }}
            >
              05 / Our Team
            </span>
            <h2
              id="team-heading"
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-primary)" }}
            >
              The Craftsmen &amp; Visionaries
            </h2>
          </div>
          <p className="italic text-lg max-w-sm md:text-right" style={{ fontFamily: "var(--font-handwritten)", color: "var(--color-on-surface-variant)" }}>
            <span className="hidden md:inline">Hover to meet the people behind the bar.</span>
            <span className="md:hidden">Tap to meet the people behind the bar.</span>
          </p>
        </div>

        <div className="team-strips flex flex-col md:flex-row gap-3 md:gap-4 md:h-[min(58vh,520px)]">
          {TEAM.map((member, i) => (
            <Strip key={member.name} member={member} index={i} active={active === i} onActivate={() => setActive(i)} onOpen={onOpen} />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Scroll effects. Call inside the home page's gsap.context in page order
 * (after the Signature Lineup, before Kind Words) so its pin is measured correctly.
 */
export function setupTeamScroll(isMobile: boolean) {
  const section = document.querySelector<HTMLElement>("#team");
  if (!section) return;
  const q = (sel: string) => gsap.utils.toArray<HTMLElement>(sel, section);

  const tl = gsap.timeline({
    scrollTrigger: isMobile
      ? { trigger: section, start: "top 75%", once: true }
      : { id: "team-trigger", trigger: section, start: "top top", end: "+=100%", pin: true, scrub: 0.6, anticipatePin: 1 },
  });
  tl.fromTo(q(".team-head"), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.2 }, 0)
    // Strips rise in one after another
    .fromTo(q(".team-strip"), { opacity: 0, yPercent: 18 }, { opacity: 1, yPercent: 0, stagger: 0.06, duration: 0.3, ease: "power3.out" }, 0.05);

  if (isMobile) tl.timeScale(0.6);
  else tl.to({}, { duration: 0.45 });
}
