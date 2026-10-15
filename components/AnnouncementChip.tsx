"use client";

import { ANNOUNCEMENT } from "@/data/cafe";
import TransitionLink from "@/components/transition/TransitionLink";

/** Frosted "New season · …" pill above the hero headline; links to the menu. */
export default function AnnouncementChip() {
  if (!ANNOUNCEMENT) return null;
  const { label, text, short, href } = ANNOUNCEMENT;

  return (
    <TransitionLink
      href={href}
      className="announce-chip group inline-flex items-center gap-2.5 max-w-full pl-1.5 pr-3.5 py-1.5 rounded-full bg-black/35 backdrop-blur-md border border-hairline text-[#fdf9f4] text-xs sm:text-sm shadow-lg transition-colors hover:bg-black/50 hover:border-hairline-strong"
    >
      <span
        className="announce-badge relative overflow-hidden shrink-0 px-2.5 py-1 rounded-full text-xs md:text-[11px] font-mono font-bold uppercase tracking-wider"
        style={{ backgroundColor: "var(--color-secondary-fixed)", color: "var(--color-primary)", fontFamily: "var(--font-label)" }}
      >
        {label}
      </span>
      <span className="truncate">
        <span className="sm:hidden">{short}</span>
        <span className="hidden sm:inline">{text}</span>
      </span>
      <span className="material-symbols-outlined text-base shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true">
        arrow_forward
      </span>
    </TransitionLink>
  );
}
