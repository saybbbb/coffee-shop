"use client";

import { useEffect, useRef, useState } from "react";

export default function LogoRevealLoader() {
  const [shouldShow, setShouldShow] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // 1. Check if reduced motion is preferred
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 2. Check if already played in this browser session
    const hasSeenIntro = sessionStorage.getItem("nurvana_intro_played");

    if (prefersReducedMotion || hasSeenIntro) {
      setIsRemoved(true);
      return;
    }

    // Show loader for first time visitor
    setShouldShow(true);

    const handleFinish = () => {
      sessionStorage.setItem("nurvana_intro_played", "true");
      setIsFadingOut(true);
      setTimeout(() => {
        setIsRemoved(true);
      }, 700);
    };

    // Safety timeout in case video loading is slow or autoplay fails
    const timer = setTimeout(() => {
      handleFinish();
    }, 4500);

    const videoEl = videoRef.current;
    if (videoEl) {
      videoEl.play().catch(() => {
        // Autoplay may be restricted; end early
        handleFinish();
      });
    }

    return () => {
      clearTimeout(timer);
    };
  }, []);

  if (isRemoved || !shouldShow) {
    return null;
  }

  const handleVideoEnded = () => {
    sessionStorage.setItem("nurvana_intro_played", "true");
    setIsFadingOut(true);
    setTimeout(() => {
      setIsRemoved(true);
    }, 700);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#33210d] transition-opacity duration-700 ease-in-out ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{ backgroundColor: "var(--color-primary, #33210d)" }}
      aria-hidden="true"
    >
      <video
        ref={videoRef}
        src="/video/logo-reveal.mp4"
        poster="/video/logo-reveal-poster.jpg"
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnded}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
