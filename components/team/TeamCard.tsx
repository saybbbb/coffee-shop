"use client";

import { useId } from "react";
import { allItems, type MenuItem } from "@/data/menu";
import { initials, type TeamMember } from "@/data/team";
import { PALETTES } from "@/components/menu/MenuArt";

/** Top-down latte with the person's initials poured into the crema. */
function LattePortrait({ member }: { member: TeamMember }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const p = PALETTES[member.tint];
  return (
    <div
      className="relative aspect-square w-full rounded-2xl overflow-hidden"
      style={{ background: `radial-gradient(circle at 30% 25%, ${p.from} 0%, ${p.to} 100%)` }}
      role="img"
      aria-label={`Latte art portrait with the initials ${initials(member.name)}`}
    >
      {/* Steam */}
      <svg
        className="absolute top-[6%] left-1/2 -translate-x-1/2 w-[22%] opacity-50 menu-art-steam"
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
          <radialGradient id={`${id}-foam`} cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#fdf6ea" />
            <stop offset="70%" stopColor="#f3e2c9" />
            <stop offset="100%" stopColor="#f3e2c9" stopOpacity="0" />
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
          {/* Coffee + crema */}
          <circle cx="100" cy="112" r="44" fill={`url(#${id}-coffee)`} />
          <circle cx="100" cy="112" r="44" fill="none" stroke="#c48a55" strokeOpacity="0.5" strokeWidth="2" />
          {/* Foam bloom */}
          <ellipse cx="100" cy="113" rx="26" ry="23" fill={`url(#${id}-foam)`} opacity="0.9" />
          {/* Initials "poured" into the foam */}
          <text
            x="100"
            y="110"
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="Epilogue, serif"
            fontStyle="italic"
            fontSize="32"
            fontWeight="400"
            fill="#4a2810"
            letterSpacing="1"
          >
            {initials(member.name)}
          </text>
          {/* Little heart tail */}
          <path d="M100 136 c -3 -4 -9 -3 -9 2 c 0 4 5 6 9 9 c 4 -3 9 -5 9 -9 c 0 -5 -6 -6 -9 -2 z" fill="#fdf6ea" opacity="0.85" />
        </g>
      </svg>
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
              <span className="material-symbols-outlined text-sm">local_cafe</span>
              {drink.name}
            </span>
          </button>
        )}
      </div>
    </article>
  );
}
