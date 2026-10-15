"use client";

import { useEffect, useRef, useState } from "react";

export const INTRO_KEY = "nurvana_intro_played";

/** Average colour of the intro video's first frame (it opens on near-black). */
const INTRO_BG = "#040304";

/**
 * Runs in <head> before the first paint (see app/layout.tsx) and sets
 * <html data-intro>:
 *  - "skip"    → already played this session, or reduced motion: CSS hides the overlay
 *  - "playing" → first visit: CSS hides the page *behind* the overlay and paints the
 *                background espresso, so while the full-screen video layer is still
 *                being drawn there's nothing (like the hero) to flicker through it
 */
export const INTRO_GATE_SCRIPT = `try{document.documentElement.dataset.intro=(sessionStorage.getItem("${INTRO_KEY}")||matchMedia("(prefers-reduced-motion: reduce)").matches)?"skip":"playing"}catch(e){}`;

export default function LogoRevealLoader() {
  // Rendered in the server HTML so it covers the page from the very first frame;
  // the head script hides it instantly for visitors who shouldn't see it.
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.intro === "skip") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- unmount the hidden overlay
      setIsRemoved(true);
      return;
    }

    // Hold the page still while the intro plays (Lenis is created just after this effect)
    const freeze = setTimeout(() => window.__lenis?.stop(), 0);

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      try {
        sessionStorage.setItem(INTRO_KEY, "true");
      } catch {}
      window.__lenis?.scrollTo(0, { immediate: true, force: true });
      window.__lenis?.start();
      // Reveal the page underneath first, so the overlay fades into the hero
      root.dataset.intro = "revealing";
      setIsFadingOut(true);
      setTimeout(() => {
        setIsRemoved(true);
        root.dataset.intro = "skip";
      }, 700);
    };

    // Safety timeout in case the video is slow to load or autoplay is blocked
    const timer = setTimeout(finish, 4500);
    const video = videoRef.current;
    video?.addEventListener("ended", finish);
    video?.play().catch(finish);

    return () => {
      clearTimeout(freeze);
      clearTimeout(timer);
      video?.removeEventListener("ended", finish);
    };
  }, []);

  if (isRemoved) return null;

  return (
    <div
      className={`intro-overlay fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-700 ease-in-out ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      // Matches the video's first frame (and the poster), so nothing jumps when playback starts
      style={{ backgroundColor: INTRO_BG }}
      aria-hidden="true"
    >
      <video
        ref={videoRef}
        src="/video/logo-reveal.mp4"
        poster="/video/logo-reveal-start.jpg"
        autoPlay
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover"
      />
    </div>
  );
}
