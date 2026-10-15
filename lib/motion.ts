import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";

/**
 * Shared motion curves for panels, toasts and buttons, so everything that
 * opens and closes feels like it belongs to the same café.
 * The same curves exist in CSS as --ease-out / --ease-drawer (globals.css).
 */
gsap.registerPlugin(CustomEase);

/** Strong ease-out: starts fast, settles softly. Entrances and exits. */
export const EASE_OUT = CustomEase.create("nurvana-out", "0.23, 1, 0.32, 1");

/** Strong ease-in-out: things moving or being revealed on screen. */
export const EASE_IN_OUT = CustomEase.create("nurvana-in-out", "0.77, 0, 0.175, 1");

/** iOS-like drawer curve for things that slide in from an edge. */
export const EASE_DRAWER = CustomEase.create("nurvana-drawer", "0.32, 0.72, 0, 1");

/** True when the visitor asked their device for less motion. */
export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
