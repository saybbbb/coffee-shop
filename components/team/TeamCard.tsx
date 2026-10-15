"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";
import { allItems, type MenuItem } from "@/data/menu";
import { initials, type TeamMember } from "@/data/team";
import { PALETTES } from "@/components/menu/MenuArt";

/** Widest the initials may be (in SVG units) to sit comfortably inside the foam. */
const MAX_INITIALS_WIDTH = 38;
const BASE_FONT_SIZE = 30;

/** Top-down latte with the person's initials in the foam and a small role badge. */
function LattePortrait({ member }: { member: TeamMember }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const p = PALETTES[member.tint];
  const textRef = useRef<SVGTextElement>(null);
  const [fontSize, setFontSize] = useState(BASE_FONT_SIZE);

  // Shrink wide initials (e.g. "MW") so they always stay inside the foam.
  // Re-measure once web fonts load, since the fallback font has different widths.
  useLayoutEffect(() => {
    const fit = () => {
      const el = textRef.current;
      if (!el) return;
      el.setAttribute("font-size", String(BASE_FONT_SIZE));
      const width = el.getComputedTextLength();
      setFontSize(width > MAX_INITIALS_WIDTH ? (BASE_FONT_SIZE * MAX_INITIALS_WIDTH) / width : BASE_FONT_SIZE);
    };
    fit();
    document.fonts?.ready.then(fit).catch(() => {});
  }, [member.name]);

  return (
    <div
      className="relative aspect-square w-full rounded-2xl overflow-hidden"
      style={{ background: `radial-gradient(circle at 30% 25%, ${p.from} 0%, ${p.to} 100%)` }}
      role="img"
      aria-label={`Latte art portrait with the initials ${initials(member.name)}`}
    >
      {/* Steam */}
      <svg
        className="absolute top-[5%] left-1/2 -translate-x-1/2 w-[20%] opacity-50 menu-art-steam"
        viewBox="0 0 60 40"
        fill="none"
        stroke={p.ink}
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M15 38 C 8 28, 22 22, 15 10" />
        <path d="M30 38 C 23 26, 37 20, 30 4" />
        <path d="M45 38 C 38 28, 52 22, 45 10" />
      </svg>

      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full" aria-hidden="true">
        <defs>
          <radialGradient id={`${id}-coffee`} cx="45%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#b97a45" />
            <stop offset="55%" stopColor="#8a5226" />
            <stop offset="100%" stopColor="#5a3214" />
          </radialGradient>
          <radialGradient id={`${id}-foam`} cx="45%" cy="40%" r="70%">
            <stop offset="0%" stopColor="#fffaf2" />
            <stop offset="100%" stopColor="#f1dfc4" />
          </radialGradient>
          <filter id={`${id}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#291806" floodOpacity="0.28" />
          </filter>
        </defs>

        <g className="latte-cup" style={{ transformOrigin: "100px 112px" }}>
          {/* Saucer */}
          <circle cx="100" cy="112" r="74" fill="#fdf9f4" filter={`url(#${id}-shadow)`} />
          <circle cx="100" cy="112" r="62" fill="none" stroke="#eadfce" strokeWidth="1.5" />
          {/* Handle */}
          <rect x="146" y="102" width="30" height="20" rx="10" fill="#ffffff" stroke="#eadfce" />
          {/* Cup */}
          <circle cx="100" cy="112" r="52" fill="#ffffff" stroke="#eadfce" />
          {/* Coffee */}
          <circle cx="100" cy="112" r="44" fill={`url(#${id}-coffee)`} />
          {/* Ring pour: a thin band of foam around the centre */}
          <circle cx="100" cy="112" r="36" fill="none" stroke="#f3e2c9" strokeOpacity="0.55" strokeWidth="2.5" />
          {/* Foam disc with a crisp crema edge */}
          <circle cx="100" cy="112" r="28" fill={`url(#${id}-foam)`} stroke="#c48a55" strokeOpacity="0.55" strokeWidth="1.5" />
          {/* Initials, auto-fitted to the foam */}
          <text
            ref={textRef}
            x="100"
            y="113"
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="Bricolage Grotesque, system-ui, sans-serif"
            fontWeight="800"
            fontSize={fontSize}
            fill="#4a2810"
            letterSpacing="-0.5"
          >
            {initials(member.name)}
          </text>
          {/* Little heart on the ring, like a latte-art tail */}
          <path d="M100 143 c -2.6 -3.4 -7.8 -2.6 -7.8 1.6 c 0 3.4 4.3 5.2 7.8 7.8 c 3.5 -2.6 7.8 -4.4 7.8 -7.8 c 0 -4.2 -5.2 -5 -7.8 -1.6 z" fill="#fdf6ea" />
        </g>
      </svg>

      {/* Role badge */}
      <span
        className="absolute bottom-2.5 right-2.5 w-9 h-9 rounded-full flex items-center justify-center shadow-md"
        style={{ backgroundColor: "var(--color-primary)", color: "var(--color-secondary-fixed)" }}
        aria-hidden="true"
      >
        <span aria-hidden="true" className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
          {member.icon}
        </span>
      </span>
    </div>
  );
}

export default function TeamCard({ member, onOpen }: { member: TeamMember; onOpen: (item: MenuItem) => void }) {
  const drink = allItems.find((i) => i.id === member.goTo);

  return (
    <article
      className="team-scrolly-card snap-center shrink-0 w-[70vw] max-w-[240px] md:w-auto md:max-w-none group rounded-3xl p-3 glass-panel hover:shadow-xl transition-[box-shadow] duration-300 flex flex-col preserve-3d will-change-transform-opacity"
      style={{ backgroundColor: "var(--color-surface-container)" }}
    >
      <LattePortrait member={member} />

      <div className="px-2 pt-4 pb-2 flex flex-col gap-1.5 flex-1 text-center">
        <h3
          className="font-bold text-sm sm:text-base leading-snug"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-primary)" }}
        >
          {member.name}
        </h3>
        <p
          className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-amber-900/80"
          style={{ fontFamily: "var(--font-label)" }}
        >
          {member.role}
        </p>
        <p
          className="italic text-sm leading-snug"
          style={{ fontFamily: "var(--font-handwritten)", color: "var(--color-on-surface-variant)" }}
        >
          {member.line}
        </p>

        {drink && (
          <button
            type="button"
            onClick={() => onOpen(drink)}
            className="mt-auto pt-3 group/btn inline-flex flex-col items-center gap-0.5 cursor-pointer"
            aria-label={`${member.name.split(" ")[0]}'s go-to order: ${drink.name}`}
          >
            <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-stone-500" style={{ fontFamily: "var(--font-label)" }}>
              Go-to order
            </span>
            <span
              className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors group-hover/btn:bg-[var(--color-primary)] group-hover/btn:text-[var(--color-on-primary)]"
              style={{ backgroundColor: "var(--color-secondary-fixed)", color: "var(--color-primary)" }}
            >
              <span aria-hidden="true" className="material-symbols-outlined text-sm">local_cafe</span>
              {drink.name}
            </span>
          </button>
        )}
      </div>
    </article>
  );
}
