"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import TransitionLink from "@/components/transition/TransitionLink";
import { isPageTransitioning } from "@/components/transition/PageTransition";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { menu, formatPrice, type MenuCategory, type MenuItem, type MenuTag } from "@/data/menu";
import MenuArt from "./MenuArt";
import ItemSheet from "./ItemSheet";
import QuickAdd, { pressable } from "./QuickAdd";

/* ─── Filters ────────────────────────────────────────────────────────────── */

const FILTERS: { id: string; label: string; icon: string; match: MenuTag[] }[] = [
  { id: "all", label: "All", icon: "apps", match: [] },
  { id: "hot", label: "Hot", icon: "local_fire_department", match: ["Hot Only", "Hot or Iced"] },
  { id: "iced", label: "Iced", icon: "ac_unit", match: ["Iced Only", "Hot or Iced"] },
  { id: "vegan", label: "Vegan", icon: "eco", match: ["Vegan"] },
  { id: "seasonal", label: "Seasonal", icon: "spa", match: ["Seasonal"] },
  { id: "new", label: "New", icon: "auto_awesome", match: ["New"] },
];

function matches(item: MenuItem, filterId: string) {
  const f = FILTERS.find((x) => x.id === filterId);
  if (!f || !f.match.length) return true;
  return item.tags?.some((t) => f.match.includes(t)) ?? false;
}

/** Room to leave above a category when scrolling to it: nav + the sticky category bar. */
const MENU_SCROLL_OFFSET = 200;

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: -MENU_SCROLL_OFFSET, duration: 1.1 });
  else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - MENU_SCROLL_OFFSET, behavior: "smooth" });
}

/* ─── Shared bits ────────────────────────────────────────────────────────── */

type OpenFn = (item: MenuItem) => void;

/** Pointer-follow tilt for cards (desktop pointers only). */
function useTilt<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty("--rx", `${(-py * 6).toFixed(2)}deg`);
      el.style.setProperty("--ry", `${(px * 8).toFixed(2)}deg`);
    };
    const leave = () => {
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);
  return ref;
}

function Tags({ item }: { item: MenuItem }) {
  if (!item.tags?.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {item.tags.map((tag) => (
        <span
          key={tag}
          className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full"
          style={{
            fontFamily: "var(--font-label)",
            backgroundColor: tag === "Seasonal" || tag === "New" ? "var(--color-secondary-fixed)" : "var(--color-tertiary-fixed)",
            color: tag === "Seasonal" || tag === "New" ? "var(--color-on-secondary-fixed)" : "var(--color-on-tertiary-fixed)",
          }}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

/* ─── Cards ──────────────────────────────────────────────────────────────── */

/** Large featured card (Staff Pick spotlight) */
function FeaturedCard({ item, onOpen }: { item: MenuItem; onOpen: OpenFn }) {
  const artRef = useRef<HTMLDivElement>(null);
  return (
    <article
      {...pressable(() => onOpen(item), `Customize ${item.name}`)}
      className="menu-reveal md:col-span-7 rounded-[32px] relative overflow-hidden flex flex-col justify-end min-h-[440px] md:min-h-[520px] cursor-pointer group shadow-lg"
    >
      <div ref={artRef} className="absolute inset-0 transition-transform duration-[1.2s] ease-out group-hover:scale-105">
        <MenuArt item={item} sizes="(max-width: 768px) 100vw, 720px" iconSize="9rem" />
      </div>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(41,24,6,0.92) 0%, rgba(41,24,6,0.45) 45%, transparent 75%)" }}
      />

      <div className="relative z-10 p-7 md:p-10 max-w-lg text-white space-y-3">
        {item.staffPick && (
          <span
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider"
            style={{ backgroundColor: "var(--color-secondary-fixed)", color: "var(--color-primary)" }}
          >
            <span aria-hidden="true" className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
              star
            </span>
            Staff Pick
          </span>
        )}
        <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-none" style={{ fontFamily: "var(--font-display)" }}>
          {item.name}
        </h3>
        <p className="text-base text-white/85 leading-relaxed">{item.description}</p>
        <div className="flex items-center justify-between pt-2">
          <span className="text-2xl font-bold font-mono">{formatPrice(item.price)}</span>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs font-mono uppercase tracking-wider text-white/70 group-hover:text-white transition-colors">
              Customize →
            </span>
            <QuickAdd item={item} artRef={artRef} dark />
          </div>
        </div>
      </div>
    </article>
  );
}

/** Compact horizontal card */
function SmallCard({ item, onOpen }: { item: MenuItem; onOpen: OpenFn }) {
  const artRef = useRef<HTMLDivElement>(null);
  const tiltRef = useTilt<HTMLElement>();
  return (
    <article
      ref={tiltRef}
      {...pressable(() => onOpen(item), `Customize ${item.name}`)}
      className="menu-reveal tilt-card rounded-3xl p-5 flex items-center gap-5 cursor-pointer hover:shadow-xl group"
      style={{ backgroundColor: "var(--color-surface-container-low)" }}
    >
      <div ref={artRef} className="w-24 h-24 rounded-full overflow-hidden shrink-0 relative shadow-md">
        <MenuArt item={item} sizes="96px" iconSize="2.5rem" className="transition-transform duration-700 group-hover:scale-110" />
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <h4 className="font-bold text-lg leading-snug" style={{ color: "var(--color-primary)" }}>
          {item.name}
        </h4>
        <p className="text-sm line-clamp-2" style={{ color: "var(--color-on-surface-variant)" }}>
          {item.description}
        </p>
        <span className="text-sm font-mono font-bold" style={{ color: "var(--color-secondary)" }}>
          {formatPrice(item.price)}
        </span>
      </div>
      <QuickAdd item={item} artRef={artRef} />
    </article>
  );
}

/** Wide bento card with organic image */
function BentoCard({ item, onOpen }: { item: MenuItem; onOpen: OpenFn }) {
  const artRef = useRef<HTMLDivElement>(null);
  const tiltRef = useTilt<HTMLElement>();
  return (
    <article
      ref={tiltRef}
      {...pressable(() => onOpen(item), `Customize ${item.name}`)}
      className="menu-reveal tilt-card nurvana-bento-card rounded-3xl p-6 md:p-7 flex flex-col sm:flex-row gap-6 relative overflow-hidden group cursor-pointer hover:shadow-xl"
    >
      <div
        ref={artRef}
        className="w-full sm:w-2/5 aspect-square organic-shape overflow-hidden relative shadow-inner shrink-0"
        style={{ backgroundColor: "var(--color-secondary-fixed)" }}
      >
        <MenuArt item={item} sizes="(max-width: 640px) 100vw, 240px" iconSize="4.5rem" className="transition-transform duration-700 group-hover:scale-110" />
      </div>

      <div className="flex flex-col w-full gap-3">
        <div className="flex justify-between items-start gap-3">
          <h3 className="font-bold text-xl leading-snug" style={{ fontFamily: "var(--font-display)", color: "var(--color-primary)" }}>
            {item.name}
          </h3>
          <span className="font-mono font-bold shrink-0" style={{ color: "var(--color-secondary)" }}>
            {formatPrice(item.price)}
          </span>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: "var(--color-on-surface-variant)" }}>
          {item.description}
        </p>
        <div className="flex items-end justify-between gap-3 mt-auto pt-2">
          <Tags item={item} />
          <QuickAdd item={item} artRef={artRef} />
        </div>
      </div>
    </article>
  );
}

/** Vertical photo-first card */
function GridCard({ item, onOpen }: { item: MenuItem; onOpen: OpenFn }) {
  const artRef = useRef<HTMLDivElement>(null);
  const tiltRef = useTilt<HTMLElement>();
  return (
    <article
      ref={tiltRef}
      {...pressable(() => onOpen(item), `Customize ${item.name}`)}
      className="menu-reveal tilt-card rounded-3xl p-3 flex flex-col cursor-pointer group hover:shadow-xl glass-panel"
      style={{ backgroundColor: "var(--color-surface-container)" }}
    >
      <div ref={artRef} className="relative aspect-[4/5] rounded-2xl overflow-hidden">
        <MenuArt item={item} sizes="(max-width: 768px) 50vw, 280px" iconSize="4.5rem" className="transition-transform duration-700 group-hover:scale-110" />
      </div>
      <div className="px-2 pt-4 pb-2 flex flex-col gap-2 flex-1">
        <h3 className="font-bold text-lg leading-snug" style={{ fontFamily: "var(--font-display)", color: "var(--color-primary)" }}>
          {item.name}
        </h3>
        <p className="text-sm line-clamp-2" style={{ color: "var(--color-on-surface-variant)" }}>
          {item.description}
        </p>
        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="font-mono font-bold" style={{ color: "var(--color-secondary)" }}>
            {formatPrice(item.price)}
          </span>
          <QuickAdd item={item} artRef={artRef} />
        </div>
      </div>
    </article>
  );
}

/* ─── Sections ───────────────────────────────────────────────────────────── */

function CategoryHeader({ category, index, count }: { category: MenuCategory; index: number; count: number }) {
  return (
    <div className="menu-reveal flex flex-col md:flex-row md:items-end justify-between gap-2 md:gap-8">
      <div className="space-y-2">
        <span className="sheet-label">{String(index + 1).padStart(2, "0")} / {count} item{count === 1 ? "" : "s"}</span>
        <h2
          id={`cat-${category.id}`}
          className="text-4xl md:text-6xl font-extrabold tracking-tight leading-none"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-primary)" }}
        >
          {category.title}
        </h2>
      </div>
      <p
        className="italic text-lg md:text-xl md:text-right"
        style={{ fontFamily: "var(--font-handwritten)", color: "var(--color-on-surface-variant)" }}
      >
        {category.tagline}
      </p>
    </div>
  );
}

function CategorySection({
  category,
  items,
  index,
  onOpen,
}: {
  category: MenuCategory;
  items: MenuItem[];
  index: number;
  onOpen: OpenFn;
}) {
  let body: React.ReactNode;
  if (category.layout === "spotlight") {
    const [featured, ...rest] = items;
    body = (
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <FeaturedCard item={featured} onOpen={onOpen} />
        <div className="md:col-span-5 flex flex-col gap-6 justify-center">
          {rest.map((item) => (
            <SmallCard key={item.id} item={item} onOpen={onOpen} />
          ))}
        </div>
      </div>
    );
  } else if (category.layout === "grid") {
    body = (
      <div className={`grid grid-cols-2 gap-3 sm:gap-6 ${items.length % 3 === 0 ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}>
        {items.map((item) => (
          <GridCard key={item.id} item={item} onOpen={onOpen} />
        ))}
      </div>
    );
  } else {
    body = (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {items.map((item) => (
          <BentoCard key={item.id} item={item} onOpen={onOpen} />
        ))}
      </div>
    );
  }

  return (
    <section id={category.id} data-category data-scroll-offset={MENU_SCROLL_OFFSET} className="space-y-10 scroll-mt-40" aria-labelledby={`cat-${category.id}`}>
      <CategoryHeader category={category} index={index} count={items.length} />
      {body}
    </section>
  );
}

/* ─── Page body ──────────────────────────────────────────────────────────── */

export default function MenuExperience() {
  const [filter, setFilter] = useState("all");
  const [active, setActive] = useState(menu[0].id);
  const [openItem, setOpenItem] = useState<MenuItem | null>(null);
  const [stuck, setStuck] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  const visible = useMemo(
    () =>
      menu
        .map((c) => ({ category: c, items: c.items.filter((i) => matches(i, filter)) }))
        .filter((c) => c.items.length > 0),
    [filter]
  );

  // Intro: headline words rise in
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Arriving via the curtain? Start the intro as it lifts.
    const wait = isPageTransitioning() ? 0.75 : 0;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-word",
        { yPercent: 110, rotate: 4 },
        { yPercent: 0, rotate: 0, duration: 1, stagger: 0.08, ease: "power4.out", delay: 0.1 + wait }
      );
      gsap.fromTo(".hero-fade", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, delay: 0.5 + wait });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  // Cards rise in as they scroll into view (re-run when the filter changes the DOM)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const els = gsap.utils.toArray<HTMLElement>(".menu-reveal");
      // Animate the standalone `translate` property so it never fights the CSS tilt `transform`
      gsap.set(els, { opacity: 0, translate: "0px 50px" });
      ScrollTrigger.batch(els, {
        start: "top 90%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { opacity: 1, translate: "0px 0px", duration: 0.8, stagger: 0.08, ease: "power3.out", overwrite: true }),
      });
    }, rootRef);
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [filter]);

  // Scroll-spy for the category tabs
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("[data-category]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: "-35% 0px -60% 0px" }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [visible]);

  // Is the category bar pinned? (sentinel just above it scrolls out under the nav)
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting), { rootMargin: "-77px 0px 0px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Keep the active tab visible in the scrollable tab strip
  useEffect(() => {
    const tab = tabsRef.current?.querySelector<HTMLElement>(`[data-tab="${active}"]`);
    tab?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [active]);

  return (
    <div ref={rootRef} className="relative">
      {/* Ambient blobs — clipped in their own layer so they can't widen the page
          (an overflow-hidden ancestor would break the sticky bar) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
        <div
          className="absolute top-0 right-0 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-50 translate-x-1/3 -translate-y-1/3"
          style={{ backgroundColor: "var(--color-secondary-container)" }}
        />
        <div
          className="absolute top-[40%] left-0 w-96 h-96 rounded-full blur-3xl opacity-30 -translate-x-1/2"
          style={{ backgroundColor: "var(--color-primary-fixed-dim)" }}
        />
      </div>

      {/* ── Header ── */}
      <header className="max-w-[1200px] mx-auto px-4 md:px-12 pt-28 md:pt-36 pb-10 md:pb-14 text-center space-y-6">
        <div className="hero-fade flex justify-center">
          <TransitionLink
            href="/"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel shadow-sm text-xs font-mono uppercase tracking-wider text-stone-700 hover:text-amber-900 transition-colors"
            style={{ fontFamily: "var(--font-label)" }}
          >
            <span aria-hidden="true" className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Home</span>
          </TransitionLink>
        </div>
        <h1
          className="text-6xl sm:text-7xl md:text-9xl font-extrabold tracking-tight leading-[0.9]"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-primary)" }}
        >
          {/* Each word animates in its own box; the space keeps it reading "Our Menu" */}
          {["Our", "Menu"].map((w, i) => (
            <span key={w}>
              {i > 0 && " "}
              <span className="inline-block overflow-hidden align-bottom pb-2 mx-2">
                <span className="hero-word inline-block">{w}</span>
              </span>
            </span>
          ))}
        </h1>
        <p
          className="hero-fade italic text-xl md:text-2xl"
          style={{ fontFamily: "var(--font-handwritten)", color: "var(--color-on-surface-variant)" }}
        >
          &ldquo;Sip the Brew, Feel Brand New, Made for You.&rdquo;
        </p>
        <p className="hero-fade text-base md:text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: "var(--color-on-surface)" }}>
          Tap anything to customise it, or hit <span aria-hidden="true" className="material-symbols-outlined text-base align-middle">add</span> to drop
          it straight into your pickup order.
        </p>
      </header>

      {/* ── Sticky category + filter bar ── */}
      <div ref={sentinelRef} aria-hidden="true" />
      <div className="sticky top-[76px] z-30 px-3 md:px-12">
        {/* Fades out content scrolling under the floating nav (only once pinned) */}
        <div
          className={`absolute inset-x-0 -top-[76px] h-[120px] -z-10 pointer-events-none transition-opacity duration-300 ${
            stuck ? "opacity-100" : "opacity-0"
          }`}
          style={{ background: "linear-gradient(to bottom, var(--color-surface) 65%, transparent)" }}
          aria-hidden="true"
        />
        <div
          className="max-w-[1200px] mx-auto rounded-3xl glass-panel shadow-lg px-3 py-2.5 space-y-2"
          style={{ background: "color-mix(in srgb, var(--color-surface) 92%, transparent)" }}
        >
          <div ref={tabsRef} className="flex gap-1 overflow-x-auto no-scrollbar">
            {visible.map(({ category }) => {
              const isActive = active === category.id;
              return (
                <button
                  key={category.id}
                  data-tab={category.id}
                  onClick={() => scrollToId(category.id)}
                  className={`relative whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
                    isActive ? "" : "hover:bg-black/5"
                  }`}
                  style={{
                    fontFamily: "var(--font-display)",
                    backgroundColor: isActive ? "var(--color-primary)" : undefined,
                    color: isActive ? "var(--color-on-primary)" : "var(--color-primary)",
                  }}
                  aria-current={isActive ? "true" : undefined}
                >
                  {category.title}
                </button>
              );
            })}
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5" role="group" aria-label="Filter menu">
            {FILTERS.map((f) => (
              <button key={f.id} onClick={() => setFilter(f.id)} aria-pressed={filter === f.id} className="filter-chip">
                <span aria-hidden="true" className="material-symbols-outlined text-sm">{f.icon}</span>
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Categories ── */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-12 py-16 md:py-24 space-y-24 md:space-y-32">
        {visible.length ? (
          visible.map(({ category, items }, i) => (
            <CategorySection key={category.id} category={category} items={items} index={i} onOpen={setOpenItem} />
          ))
        ) : (
          <p className="text-center text-lg" style={{ color: "var(--color-on-surface-variant)" }}>
            Nothing matches that filter yet.
          </p>
        )}
      </div>

      {openItem && <ItemSheet item={openItem} onClose={() => setOpenItem(null)} />}
    </div>
  );
}
