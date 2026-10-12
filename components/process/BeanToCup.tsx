"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROCESS } from "@/data/process";
import MenuArt from "@/components/menu/MenuArt";
import TransitionLink from "@/components/transition/TransitionLink";

/**
 * "Bean to Cup" — on desktop the section pins and the four steps scroll
 * sideways; on phones they stack. The scroll effects are created by the home
 * page (see `setupBeanToCupScroll`) so they're registered in page order
 * between Our Story and The Menu, which pinning depends on.
 */
export default function BeanToCup() {
  return (
    <section
      id="process"
      className="process-section relative w-full md:h-screen overflow-hidden text-[#fdf9f4]"
      style={{
        backgroundColor: "var(--color-primary)",
        backgroundImage:
          "radial-gradient(ellipse at 20% 0%, color-mix(in srgb, var(--color-primary-container) 70%, transparent) 0%, transparent 55%), radial-gradient(ellipse at 90% 100%, rgba(196,138,85,0.18) 0%, transparent 50%)",
      }}
      aria-labelledby="process-heading"
    >
      {/* Header + progress (fixed in place while the steps slide past) */}
      <div className="relative md:absolute md:top-0 md:inset-x-0 z-10 max-w-[1300px] mx-auto px-4 sm:px-6 md:px-16 pt-20 md:pt-24 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <span
            className="inline-block text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] px-2.5 py-1 rounded-full bg-white/10 text-amber-200"
            style={{ fontFamily: "var(--font-label)" }}
          >
            03 / Bean to Cup
          </span>
          <h2
            id="process-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[0.95]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            From the farm
            <br />
            <span className="italic font-light text-amber-200" style={{ fontFamily: "var(--font-handwritten)" }}>
              to your hands.
            </span>
          </h2>
        </div>

        {/* Step progress (desktop) */}
        <ol className="hidden md:flex items-center gap-0 w-[420px]" aria-hidden="true">
          {PROCESS.map((step, i) => (
            <li key={step.id} className="flex-1 flex flex-col gap-2">
              <span
                data-process-tick={i}
                className="process-tick text-[11px] font-mono uppercase tracking-wider"
                style={{ fontFamily: "var(--font-label)" }}
              >
                {String(i + 1).padStart(2, "0")} {step.title}
              </span>
              <span className="relative h-[3px] rounded-full bg-white/15 overflow-hidden mr-2">
                <span data-process-fill={i} className="absolute inset-0 origin-left scale-x-0 bg-amber-300 rounded-full" />
              </span>
            </li>
          ))}
        </ol>
      </div>

      {/* Steps */}
      <div className="process-viewport md:h-full md:overflow-x-auto no-scrollbar">
        <div className="process-track flex flex-col md:flex-row md:h-full md:w-max md:items-end gap-16 md:gap-[6vw] px-4 sm:px-6 md:pl-16 md:pr-[12vw] pt-12 pb-20 md:pt-0 md:pb-[9vh]">
          {PROCESS.map((step, i) => (
            <article
              key={step.id}
              className="process-panel md:w-[min(78vw,1000px)] shrink-0 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-6 md:gap-12 items-center"
            >
              {/* Photo with parallax inner layer */}
              <div className="relative aspect-[4/3] md:aspect-auto md:h-[58vh] rounded-[28px] overflow-hidden shadow-2xl ring-1 ring-white/10">
                <div className="process-photo absolute inset-y-0 -inset-x-[10%]">
                  <MenuArt
                    item={{ id: step.id, name: `${step.title}: ${step.kicker}`, image: step.image, icon: step.icon, tint: step.tint, focus: step.focus }}
                    sizes="(max-width: 768px) 100vw, 560px"
                    iconSize="7rem"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />
                <span
                  className="absolute bottom-4 left-4 px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider bg-black/35 backdrop-blur-sm"
                  style={{ fontFamily: "var(--font-label)" }}
                >
                  Step {i + 1} of {PROCESS.length}
                </span>
              </div>

              {/* Copy */}
              <div className="process-copy space-y-4 md:space-y-5">
                <span
                  className="block text-7xl md:text-[9rem] font-black leading-none tracking-tighter text-transparent"
                  style={{ fontFamily: "var(--font-display)", WebkitTextStroke: "1.5px rgba(246,224,185,0.45)" }}
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                  {step.title}
                </h3>
                <p className="italic text-lg md:text-xl text-amber-200" style={{ fontFamily: "var(--font-handwritten)" }}>
                  {step.kicker}
                </p>
                <p className="text-sm md:text-base leading-relaxed text-stone-300 max-w-md">{step.body}</p>
                <ul className="flex flex-wrap gap-2 pt-1">
                  {step.facts.map((f) => (
                    <li
                      key={f}
                      className="px-3 py-1 rounded-full text-xs font-mono border border-amber-200/25 text-amber-100"
                      style={{ fontFamily: "var(--font-label)" }}
                    >
                      {f}
                    </li>
                  ))}
                </ul>
                {i === PROCESS.length - 1 && (
                  <div className="pt-3">
                    <TransitionLink href="/menu" className="hero-cta-primary group">
                      <span>Taste it yourself</span>
                      <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">
                        arrow_forward
                      </span>
                    </TransitionLink>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Creates the section's scroll effects. Call inside the home page's gsap.context,
 * after Our Story's pin and before The Menu's, so pins are registered in page order.
 */
export function setupBeanToCupScroll(isMobile: boolean) {
  const section = document.querySelector<HTMLElement>("#process");
  const viewport = section?.querySelector<HTMLElement>(".process-viewport");
  const track = section?.querySelector<HTMLElement>(".process-track");
  if (!section || !viewport || !track) return;

  const panels = gsap.utils.toArray<HTMLElement>(".process-panel", section);

  if (isMobile) {
    panels.forEach((panel) => {
      gsap.fromTo(
        panel,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: panel, start: "top 85%", once: true } }
      );
    });
    return;
  }

  // Sideways scroll replaces native overflow scrolling
  gsap.set(viewport, { overflow: "hidden" });
  const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

  const slide = gsap.to(track, {
    x: () => -distance(),
    ease: "none",
    scrollTrigger: {
      id: "process-trigger",
      trigger: section,
      start: "top top",
      end: () => `+=${distance()}`,
      pin: true,
      scrub: 0.6,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  panels.forEach((panel, i) => {
    // Progress bar segment for this step fills as the panel crosses the screen
    const fill = section.querySelector(`[data-process-fill="${i}"]`);
    const tick = section.querySelector(`[data-process-tick="${i}"]`);
    if (fill) {
      gsap.to(fill, {
        scaleX: 1,
        ease: "none",
        // The last panel stops short of the screen edge, so it completes earlier
        scrollTrigger: {
          trigger: panel,
          containerAnimation: slide,
          start: "left 70%",
          end: i === panels.length - 1 ? "right 92%" : "right 70%",
          scrub: true,
        },
      });
    }
    ScrollTrigger.create({
      trigger: panel,
      containerAnimation: slide,
      start: "left 60%",
      end: "right 60%",
      onToggle: (self) => tick?.classList.toggle("is-active", self.isActive),
    });

    // Photo drifts against the scroll for depth
    const photo = panel.querySelector(".process-photo");
    if (photo) {
      gsap.fromTo(
        photo,
        { xPercent: 6 },
        {
          xPercent: -6,
          ease: "none",
          scrollTrigger: { trigger: panel, containerAnimation: slide, start: "left right", end: "right left", scrub: true },
        }
      );
    }

    // Copy rises in as each panel arrives (the first is already in view)
    if (i > 0) {
      const copy = panel.querySelector(".process-copy");
      gsap.fromTo(
        copy,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          ease: "power2.out",
          scrollTrigger: { trigger: panel, containerAnimation: slide, start: "left 85%", end: "left 45%", scrub: true },
        }
      );
    }
  });
}
