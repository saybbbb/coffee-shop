import { useEffect, useRef, type RefObject } from "react";
import { gsap } from "gsap";
import { EASE_DRAWER } from "@/lib/motion";

interface Options {
  /** "y" = drag down to close (bottom sheet), "x" = drag right to close (side drawer) */
  axis: "x" | "y";
  /** Called when the swipe should close the panel; it animates out from where the finger left it */
  onDismiss: () => void;
  /** Only listen while this is true (e.g. while the drawer is open) */
  enabled?: boolean;
  /** Only on screens narrower than this (px), where the panel is a phone-style sheet */
  maxWidth?: number;
}

/** A fast flick closes it even if it only moved a little (px per ms) */
const FLICK_VELOCITY = 0.11;
/** Or drag it this fraction of its size */
const DISTANCE_RATIO = 0.3;

/**
 * Touch drag-to-dismiss for a sheet or drawer, like a native app:
 * - follows the finger 1:1 toward closing, with rising resistance the other way
 * - a quick flick is enough; otherwise it springs back
 * - for bottom sheets it only takes over when the content is scrolled to the top,
 *   so normal scrolling inside the sheet still works
 */
export function useSwipeToDismiss(panelRef: RefObject<HTMLElement | null>, { axis, onDismiss, enabled = true, maxWidth }: Options) {
  // Latest callback without re-binding the listeners (which would reset a drag in progress)
  const dismissRef = useRef(onDismiss);
  useEffect(() => {
    dismissRef.current = onDismiss;
  });

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel || !enabled) return;

    let startX = 0;
    let startY = 0;
    let startTime = 0;
    let amount = 0;
    // null = not decided yet, true = we're dragging the panel, false = let the page scroll
    let dragging: boolean | null = null;

    // Is anything between the finger and the panel scrolled down? Then a downward
    // swipe should scroll the content back up, not close the sheet.
    const contentScrolled = (target: EventTarget | null) => {
      for (let el = target as HTMLElement | null; el && el !== panel.parentElement; el = el.parentElement) {
        if (el.scrollTop > 0) return true;
        if (el === panel) break;
      }
      return false;
    };

    const onStart = (e: TouchEvent) => {
      if (e.touches.length > 1 || (maxWidth && window.innerWidth >= maxWidth)) {
        dragging = false;
        return;
      }
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startTime = performance.now();
      amount = 0;
      dragging = axis === "y" && contentScrolled(e.target) ? false : null;
    };

    const onMove = (e: TouchEvent) => {
      // A second finger mid-drag shouldn't make the panel jump
      if (dragging === false || e.touches.length > 1) return;
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;
      const along = axis === "y" ? dy : dx;
      const across = axis === "y" ? dx : dy;

      if (dragging === null) {
        // Hold the browser off while we decide, or it starts scrolling and won't
        // let go. Only a downward start on a sheet needs this; a side drawer
        // tells the browser up front that horizontal moves are ours (touch-action).
        if (axis === "y" && dy > 0 && e.cancelable) e.preventDefault();
        if (Math.abs(along) < 6 && Math.abs(across) < 6) return;
        // Only a swipe mainly along the closing direction grabs the panel
        dragging = Math.abs(along) > Math.abs(across) && along > 0;
        if (!dragging) return;
        gsap.killTweensOf(panel);
        // Restart from here so the panel doesn't jump by the 6px dead zone
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        startTime = performance.now();
        return;
      }

      if (e.cancelable) e.preventDefault();
      const raw = axis === "y" ? dy : dx;
      // Toward closing: follow the finger. The other way: resist more the further it goes.
      amount = raw >= 0 ? raw : -Math.sqrt(-raw) * 2;
      gsap.set(panel, { [axis]: amount });
    };

    const onEnd = () => {
      if (!dragging) {
        dragging = null;
        return;
      }
      dragging = null;
      const size = axis === "y" ? panel.offsetHeight : panel.offsetWidth;
      const velocity = amount / Math.max(1, performance.now() - startTime);
      if (amount > 0 && (amount > size * DISTANCE_RATIO || velocity > FLICK_VELOCITY)) {
        dismissRef.current();
      } else {
        gsap.to(panel, { [axis]: 0, duration: 0.45, ease: EASE_DRAWER });
      }
    };

    // Side drawer: the browser keeps vertical scrolling, horizontal swipes come to us
    const prevTouchAction = panel.style.touchAction;
    if (axis === "x") panel.style.touchAction = "pan-y";

    panel.addEventListener("touchstart", onStart, { passive: true });
    // Not passive: once we own the drag we stop the page from scrolling too
    panel.addEventListener("touchmove", onMove, { passive: false });
    panel.addEventListener("touchend", onEnd);
    panel.addEventListener("touchcancel", onEnd);
    return () => {
      panel.style.touchAction = prevTouchAction;
      panel.removeEventListener("touchstart", onStart);
      panel.removeEventListener("touchmove", onMove);
      panel.removeEventListener("touchend", onEnd);
      panel.removeEventListener("touchcancel", onEnd);
    };
  }, [panelRef, axis, enabled, maxWidth]);
}
