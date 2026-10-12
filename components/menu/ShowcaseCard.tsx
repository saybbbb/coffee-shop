"use client";

import { useRef } from "react";
import { formatPrice, type MenuItem } from "@/data/menu";
import MenuArt from "./MenuArt";
import QuickAdd, { pressable } from "./QuickAdd";

/** Home-page "Signature Lineup" card: tap to customise, + to quick add. */
export default function ShowcaseCard({ item, onOpen }: { item: MenuItem; onOpen: (item: MenuItem) => void }) {
  const artRef = useRef<HTMLDivElement>(null);

  return (
    <div
      {...pressable(() => onOpen(item), `Customize ${item.name}`)}
      className="menu-scrolly-card snap-center shrink-0 w-[78vw] max-w-[280px] md:w-auto md:max-w-none group rounded-2xl p-4 sm:p-5 flex flex-col justify-between glass-panel hover:shadow-xl hover:-translate-y-1 transition-[box-shadow,translate] duration-300 preserve-3d will-change-transform-opacity min-h-[310px] sm:min-h-[330px] md:min-h-[340px] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-amber-800"
      style={{ backgroundColor: "var(--color-surface-container)" }}
    >
      {/* Top Image Preview */}
      <div ref={artRef} className="relative aspect-square w-full rounded-xl overflow-hidden mb-3 md:mb-4 shadow-sm bg-stone-200">
        <MenuArt
          item={item}
          className="group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 260px, 220px"
        />
        {item.staffPick && (
          <span
            className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider shadow-sm"
            style={{ backgroundColor: "var(--color-primary)", color: "var(--color-on-primary)" }}
          >
            Staff Pick
          </span>
        )}
        {/* Hover hint */}
        <span
          className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider glass-panel opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 whitespace-nowrap"
          style={{ color: "var(--color-primary)", fontFamily: "var(--font-label)" }}
          aria-hidden="true"
        >
          Tap to customize
        </span>
      </div>

      {/* Details */}
      <div className="space-y-1.5">
        <h3
          className="font-bold text-sm sm:text-base leading-snug line-clamp-2"
          style={{ fontFamily: "var(--font-body)", color: "var(--color-primary)" }}
        >
          {item.name}
        </h3>
        <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
          {item.description}
        </p>
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-0.5">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-mono px-2 py-0.5 rounded-full whitespace-nowrap"
                style={{ backgroundColor: "var(--color-secondary-fixed)", color: "var(--color-on-secondary-fixed)" }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Price + quick add */}
      <div className="pt-3 flex items-center justify-between gap-2 mt-auto">
        <span className="font-mono font-bold text-base text-amber-900" style={{ fontFamily: "var(--font-label)" }}>
          {formatPrice(item.price)}
        </span>
        <QuickAdd item={item} artRef={artRef} small />
      </div>
    </div>
  );
}
