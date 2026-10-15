"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { allItems, formatPrice, type MenuItem } from "@/data/menu";
import MenuArt from "@/components/menu/MenuArt";
import QuickAdd from "@/components/menu/QuickAdd";
import TransitionLink from "@/components/transition/TransitionLink";
import FindYourBrew from "./FindYourBrew";

/**
 * Home "Signature Lineup" as a printed café menu card: dotted leaders to the
 * price, a drink photo that floats beside the cursor on laptops, and lines
 * that expand on tap on phones. Scroll effects come from `setupMenuBoardScroll`.
 */

const COLUMNS = [
  { title: "Espresso Bar", ids: ["nurvana-classic-latte", "spanish-latte", "brown-sugar-cortado", "artisanal-espresso"] },
  { title: "Chilled & Seasonal", ids: ["iced-kyoto-matcha", "cold-brew-reserve", "iced-caramel-cloud", "honey-lavender-latte"] },
].map((c) => ({ ...c, items: c.ids.map((id) => allItems.find((i) => i.id === id)!).filter(Boolean) }));

const BOARD_ITEMS = COLUMNS.flatMap((c) => c.items);

/** True on devices with a real mouse/trackpad (where the floating photo makes sense). */
function useCanHover() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(hover: hover) and (pointer: fine)").matches,
    // The server can't know; assume touch so nothing that needs `document`
    // (the floating photo portal) renders before the browser takes over
    () => false
  );
}

/** Photo that follows the cursor and crossfades between drinks. */
function FloatingPhoto({
  activeId,
  boardRef,
  photoRef: ref,
}: {
  activeId: string | null;
  boardRef: React.RefObject<HTMLDivElement | null>;
  photoRef: React.RefObject<HTMLDivElement | null>;
}) {
  useEffect(() => {
    const el = ref.current;
    const board = boardRef.current;
    if (!el || !board) return;
    const x = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
    const y = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });
    const r = gsap.quickTo(el, "rotation", { duration: 0.6, ease: "power3" });
    let lastX = 0;
    const move = (e: PointerEvent) => {
      // Sit to the right of the cursor, or to the left near the right edge
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const right = e.clientX + 28 + w < window.innerWidth - 16;
      x(right ? e.clientX + 28 : e.clientX - 28 - w);
      y(Math.min(window.innerHeight - h - 16, Math.max(16, e.clientY - h / 2)));
      r(gsap.utils.clamp(-10, 10, (e.clientX - lastX) * 0.8));
      lastX = e.clientX;
    };
    board.addEventListener("pointermove", move);
    return () => board.removeEventListener("pointermove", move);
  }, [boardRef, ref]);

  useEffect(() => {
    gsap.to(ref.current, { opacity: activeId ? 1 : 0, scale: activeId ? 1 : 0.85, duration: 0.3, ease: "power2.out" });
  }, [activeId, ref]);

  // Rendered on <body>: a pinned section can be transformed, which would
  // throw off a position: fixed element inside it
  return createPortal(
    <div
      ref={ref}
      data-board-photo
      className="fixed top-0 left-0 z-[45] w-[230px] aspect-[4/5] rounded-[22px] overflow-hidden shadow-2xl pointer-events-none ring-4 ring-white opacity-0"
      aria-hidden="true"
    >
      {/* All photos are stacked and crossfaded, so swapping is instant. A brief
          blur while they cross melts one drink into the next instead of showing
          two photos on top of each other. */}
      {BOARD_ITEMS.map((item) => (
        <div
          key={item.id}
          className="board-photo-layer absolute inset-0"
          style={
            activeId === item.id
              ? { opacity: 1, filter: "blur(0px)", scale: "1" }
              : { opacity: 0, filter: "blur(6px)", scale: "1.06" }
          }
        >
          <MenuArt item={item} sizes="230px" iconSize="4rem" />
        </div>
      ))}
    </div>,
    document.body
  );
}

function BoardLine({
  item,
  canHover,
  expanded,
  onHover,
  onToggle,
  onOpen,
  photoRef,
}: {
  item: MenuItem;
  canHover: boolean;
  photoRef: React.RefObject<HTMLDivElement | null>;
  expanded: boolean;
  onHover: (id: string | null) => void;
  onToggle: (id: string) => void;
  onOpen: (item: MenuItem) => void;
}) {
  const artRef = useRef<HTMLDivElement>(null);

  return (
    <li className="board-line group relative" onPointerEnter={() => canHover && onHover(item.id)}>
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => (canHover ? onOpen(item) : onToggle(item.id))}
          aria-expanded={canHover ? undefined : expanded}
          className="flex-1 min-w-0 text-left py-3 cursor-pointer"
        >
          <span className="flex items-baseline gap-2">
            <span
              className="text-lg sm:text-xl font-bold tracking-tight transition-colors group-hover:text-[var(--color-secondary)]"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-primary)" }}
            >
              {item.name}
            </span>
            {item.staffPick && (
              <span className="material-symbols-outlined text-base text-amber-600" style={{ fontVariationSettings: "'FILL' 1" }} aria-label="Staff pick">
                star
              </span>
            )}
            <span className="board-leader flex-1 self-end mb-1.5" aria-hidden="true" />
            <span className="font-mono font-bold" style={{ color: "var(--color-primary)", fontFamily: "var(--font-label)" }}>
              {formatPrice(item.price)}
            </span>
          </span>
          <span className="flex items-center gap-2 mt-1">
            <span className="text-sm truncate" style={{ color: "var(--color-on-surface-variant)" }}>
              {item.description}
            </span>
          </span>
          {item.tags && (
            <span className="flex flex-wrap gap-1.5 mt-1.5">
              {item.tags.map((t) => (
                <span key={t} className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "var(--color-secondary)", fontFamily: "var(--font-label)" }}>
                  {t}
                </span>
              ))}
            </span>
          )}
        </button>
        <span className="board-add mt-3">
          {/* Laptops: the drink flies from the floating photo; phones: from the expanded photo */}
          <QuickAdd item={item} artRef={canHover ? photoRef : artRef} small />
        </span>
      </div>

      {/* Phones: tap a line to see the drink */}
      {!canHover && expanded && (
        <div className="board-expand pb-4 space-y-3">
          <div ref={artRef} className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-md">
            <MenuArt item={item} sizes="90vw" iconSize="4rem" />
          </div>
          {item.notes && (
            <div className="flex flex-wrap gap-1.5">
              {item.notes.map((n) => (
                <span key={n} className="px-2.5 py-1 rounded-full text-[11px] font-mono" style={{ backgroundColor: "var(--color-secondary-fixed)", color: "var(--color-on-secondary-fixed)" }}>
                  {n}
                </span>
              ))}
            </div>
          )}
          <button type="button" onClick={() => onOpen(item)} className="nurvana-btn-outline cursor-pointer">
            Customize
          </button>
        </div>
      )}
    </li>
  );
}

export default function MenuBoard({ onOpen }: { onOpen: (item: MenuItem) => void }) {
  const canHover = useCanHover();
  const [hovered, setHovered] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [quizOpen, setQuizOpen] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const closeQuiz = useCallback(() => setQuizOpen(false), []);

  return (
    <section
      id="menu"
      className="relative w-full md:h-screen flex flex-col justify-center overflow-hidden py-20 md:pt-24 md:pb-8"
      style={{ backgroundColor: "var(--color-surface)" }}
      aria-labelledby="menu-heading"
    >
      <div className="max-w-[1200px] mx-auto w-full px-4 sm:px-6 md:px-12">
        {/* Header */}
        <div className="board-head flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 md:mb-8">
          <div className="space-y-2">
            <span
              className="inline-block text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] px-2.5 py-1 rounded-full bg-amber-900/10"
              style={{ color: "var(--color-secondary)", fontFamily: "var(--font-label)" }}
            >
              04 / The Menu
            </span>
            <h2
              id="menu-heading"
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-primary)" }}
            >
              Signature Lineup
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => setQuizOpen(true)} className="quiz-cta group">
              <span aria-hidden="true" className="material-symbols-outlined text-lg transition-transform group-hover:rotate-12" style={{ fontVariationSettings: "'FILL' 1" }}>
                quiz
              </span>
              Not sure? <span className="underline underline-offset-4 decoration-2">Find your brew</span>
            </button>
            <TransitionLink
              href="/menu"
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-amber-900 hover:text-amber-700 transition-colors group"
              style={{ fontFamily: "var(--font-label)" }}
            >
              <span>Full menu</span>
              <span aria-hidden="true" className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </TransitionLink>
          </div>
        </div>

        {/* The menu card */}
        <div
          ref={boardRef}
          onPointerLeave={() => setHovered(null)}
          className="board-card relative rounded-[28px] p-5 sm:p-8 md:px-12 md:py-9"
        >
          <p
            className="board-title text-center italic text-xl md:text-2xl -mt-1 mb-5 md:mb-6"
            style={{ fontFamily: "var(--font-handwritten)", color: "var(--color-secondary)" }}
          >
            ~ Today&rsquo;s Signatures ~
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-6">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3
                  className="board-col-title text-[11px] font-mono uppercase tracking-[0.25em] pb-2 mb-1 border-b"
                  style={{ color: "var(--color-outline)", borderColor: "var(--color-outline-variant)", fontFamily: "var(--font-label)" }}
                >
                  {col.title}
                </h3>
                <ul className="divide-y" style={{ borderColor: "var(--color-outline-variant)" }}>
                  {col.items.map((item) => (
                    <BoardLine
                      key={item.id}
                      item={item}
                      canHover={canHover}
                      expanded={expanded === item.id}
                      onHover={setHovered}
                      onToggle={(id) => setExpanded((cur) => (cur === id ? null : id))}
                      onOpen={onOpen}
                      photoRef={photoRef}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {canHover && <FloatingPhoto activeId={hovered} boardRef={boardRef} photoRef={photoRef} />}
      {quizOpen && <FindYourBrew onClose={closeQuiz} onOpen={onOpen} />}
    </section>
  );
}

/**
 * Scroll effects for the board. Call inside the home page's gsap.context in
 * page order (after Bean to Cup, before Our Team) so its pin is measured correctly.
 */
export function setupMenuBoardScroll(isMobile: boolean) {
  const section = document.querySelector<HTMLElement>("#menu");
  if (!section) return;
  const q = (sel: string) => gsap.utils.toArray<HTMLElement>(sel, section);

  const tl = gsap.timeline({
    scrollTrigger: isMobile
      ? { trigger: section, start: "top 75%", once: true }
      : { id: "menu-trigger", trigger: section, start: "top top", end: "+=110%", pin: true, scrub: 0.6, anticipatePin: 1 },
  });

  tl.fromTo(q(".board-head"), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.15 }, 0)
    .fromTo(q(".board-card"), { opacity: 0, y: 50, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.2, ease: "power2.out" }, 0.03)
    .fromTo(q(".board-title, .board-col-title"), { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.12)
    // Lines "print" one after another
    .fromTo(q(".board-line"), { opacity: 0, x: -16 }, { opacity: 1, x: 0, stagger: 0.035, duration: 0.12, ease: "power2.out" }, 0.15)
    .fromTo(q(".board-leader"), { scaleX: 0 }, { scaleX: 1, transformOrigin: "left center", stagger: 0.035, duration: 0.12, ease: "none" }, 0.18);

  tl.addLabel("revealed"); // nav jumps land here (see lib/scrollToSection.ts)
  if (isMobile) tl.timeScale(0.6);
  else tl.to({}, { duration: 0.35 });
}
