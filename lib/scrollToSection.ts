import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Scrolls to a home-page section. Pinned sections are scrubbed timelines, so we
 * land part-way through the pin where the content is fully visible rather than
 * at the trigger start (where it is still faded out).
 */
// Height of the floating nav plus a little breathing room
const NAV_CLEARANCE = 96;

const PIN_PROGRESS: Record<string, number> = { hero: 0, story: 0.45, process: 0, menu: 0.45, team: 0.5, reviews: 0.5, visit: 0.6 };

export function scrollToSection(id: string, opts: { immediate?: boolean } = {}) {
  // Lenis caches the page height and clamps to it; after a route change it can
  // still hold the previous page's height for a moment, so re-measure first
  window.__lenis?.resize();

  const trigger = ScrollTrigger.getById(`${id}-trigger`);
  let target: number | null = null;

  if (trigger) {
    target = trigger.start + (trigger.end - trigger.start) * (PIN_PROGRESS[id] ?? 0);
  } else {
    // Plain (unpinned) sections: put the section's heading (its [data-scroll-anchor],
    // else the section itself) just below the floating nav, skipping the top padding
    // so the previous section isn't left peeking in at the top
    const el = document.getElementById(id);
    const anchor = el?.querySelector<HTMLElement>("[data-scroll-anchor]") ?? el;
    if (anchor) target = anchor.getBoundingClientRect().top + window.scrollY - NAV_CLEARANCE;
  }
  if (target === null) return;

  if (window.__lenis) {
    window.__lenis.scrollTo(target, opts.immediate ? { immediate: true, force: true } : { duration: 1.2 });
  } else {
    window.scrollTo({ top: target, behavior: opts.immediate ? "auto" : "smooth" });
  }
}
