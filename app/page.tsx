import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Nurvana Café — Brewed For You",
  description:
    "Artisanal coffee brewed for you. Small-batch roasted beans, seasonal drinks, and a warm community space.",
};

export default function Home() {
  return (
    <>
      {/* ─── Hero Section ─────────────────────────────────────────────── */}
      <section
        className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden"
        aria-labelledby="hero-heading"
      >
        {/* Background image */}
        <div className="absolute inset-0 -z-10">
          <div
            className="absolute inset-0 z-10"
            style={{
              background:
                "linear-gradient(to bottom, transparent 0%, color-mix(in srgb, var(--color-background) 90%, transparent) 100%)",
            }}
          />
          <Image
            src="/home/hero-bg.jpg"
            alt="Warm, inviting artisan cafe interior with steam rising from a ceramic latte mug"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>

        {/* Content */}
        <div className="max-w-[1200px] mx-auto px-4 md:px-12 w-full z-20 flex flex-col md:flex-row items-center gap-12 py-20 md:py-0">
          {/* Left: text */}
          <div className="w-full md:w-1/2 space-y-6">
            <div
              className="inline-block px-4 py-1.5 rounded-full text-sm border"
              style={{
                fontFamily: "var(--font-label)",
                fontSize: "14px",
                letterSpacing: "0.05em",
                backgroundColor: "color-mix(in srgb, var(--color-secondary-fixed) 50%, transparent)",
                backdropFilter: "blur(4px)",
                color: "var(--color-primary)",
                borderColor: "color-mix(in srgb, var(--color-primary) 10%, transparent)",
              }}
            >
              Artisanal &amp; Local
            </div>

            <h1
              id="hero-heading"
              className="text-5xl md:text-[64px] font-extrabold leading-tight tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-primary)" }}
            >
              Sip the Brew,<br />Feel Brand New.
            </h1>

            <p
              className="max-w-md"
              style={{
                fontFamily: "var(--font-handwritten)",
                fontSize: "24px",
                lineHeight: "32px",
                fontWeight: "300",
                color: "var(--color-primary-container)",
              }}
            >
              We&apos;re not just serving coffee—we&apos;re serving moments, hot or cold. Made for you.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/menu"
                className="px-8 py-4 rounded-xl text-sm font-medium shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 duration-300"
                style={{
                  fontFamily: "var(--font-label)",
                  fontSize: "14px",
                  letterSpacing: "0.05em",
                  backgroundColor: "var(--color-primary)",
                  color: "var(--color-on-primary)",
                }}
              >
                View The Menu
              </Link>
              <button
                className="px-8 py-4 rounded-xl text-sm font-medium border-2 transition-colors hover:opacity-80"
                style={{
                  fontFamily: "var(--font-label)",
                  fontSize: "14px",
                  letterSpacing: "0.05em",
                  borderColor: "var(--color-primary)",
                  color: "var(--color-primary)",
                }}
              >
                Find a Table
              </button>
            </div>
          </div>

          {/* Right: hero drinks image */}
          <div className="w-full md:w-1/2 relative mt-8 md:mt-0">
            <div className="relative w-full aspect-square max-w-[500px] mx-auto organic-clip">
              <Image
                src="/home/hero-drinks.jpg"
                alt="Three signature drinks: iced latte, matcha, and a hot cappuccino with fern latte art"
                fill
                className="object-cover rounded-2xl shadow-2xl"
                sizes="(max-width: 768px) 100vw, 500px"
                priority
              />
            </div>

            {/* Floating badge — "Expertly brewed." */}
            <div
              className="absolute -bottom-4 -left-4 md:bottom-4 md:-left-8 p-4 rounded-xl shadow-lg border -rotate-6 hidden sm:block"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-surface-variant)",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-handwritten)",
                  fontSize: "14px",
                  color: "var(--color-secondary)",
                }}
              >
                Expertly brewed.
              </p>
            </div>

            {/* Coffee maker icon badge */}
            <div
              className="absolute -top-4 -right-4 md:-top-6 md:-right-6 p-4 rounded-full shadow-lg h-20 w-20 md:h-24 md:w-24 flex items-center justify-center rotate-12 hidden sm:flex"
              style={{ backgroundColor: "var(--color-secondary-fixed)" }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "36px", color: "var(--color-primary)" }}
              >
                coffee_maker
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Our Story Section ─────────────────────────────────────────── */}
      <section
        className="py-24 relative"
        style={{ backgroundColor: "var(--color-surface-container-low)" }}
        aria-labelledby="story-heading"
      >
        <div className="max-w-[1200px] mx-auto px-4 md:px-12 relative z-10">
          <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-center">
            {/* Left: images */}
            <div className="w-full md:w-1/2 relative">
              <div className="aspect-[4/5] w-full max-w-[450px] mx-auto organic-clip-alt overflow-hidden relative">
                <Image
                  src="/story/barista.jpg"
                  alt="Skilled barista carefully pouring steamed milk to create latte art"
                  fill
                  className="object-cover shadow-xl"
                  sizes="(max-width: 768px) 100vw, 450px"
                />
              </div>

              {/* Overlapping accent image */}
              <div
                className="absolute -bottom-10 -right-2 md:-bottom-12 md:-right-4 w-44 h-44 md:w-48 md:h-48 border-4 rounded-xl overflow-hidden shadow-lg hidden md:block"
                style={{ borderColor: "var(--color-surface-container-low)" }}
              >
                <Image
                  src="/story/coffee-beans.jpg"
                  alt="Fresh roasted coffee beans spilling from a burlap sack"
                  fill
                  className="object-cover"
                  sizes="192px"
                />
              </div>
            </div>

            {/* Right: text */}
            <div className="w-full md:w-1/2 space-y-8">
              <div>
                <span
                  className="uppercase tracking-widest mb-2 block text-sm"
                  style={{
                    fontFamily: "var(--font-label)",
                    fontSize: "14px",
                    letterSpacing: "0.1em",
                    color: "var(--color-secondary)",
                  }}
                >
                  Our Story
                </span>
                <h2
                  id="story-heading"
                  className="text-3xl md:text-4xl font-bold mb-6"
                  style={{ fontFamily: "var(--font-display)", color: "var(--color-primary)" }}
                >
                  Brewed with intention,<br className="hidden md:block" /> crafted for community.
                </h2>
              </div>

              <div className="space-y-4" style={{ color: "var(--color-on-surface-variant)" }}>
                <p className="text-lg leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                  Nurvana Café began with a simple belief: coffee shouldn&apos;t be rushed. In a world
                  of instant everything, we built a space dedicated to the slow, deliberate art of
                  extraction and the quiet moments in between.
                </p>
                <p className="text-lg leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                  We source our beans from small-lot farmers who share our commitment to quality, and
                  roast them in-house in small batches. Every cup we serve is a testament to the
                  tactile, sensory experience of true artisanal brewing.
                </p>
              </div>

              {/* Stats */}
              <div
                className="grid grid-cols-2 gap-6 pt-6 border-t"
                style={{ borderColor: "var(--color-outline-variant)" }}
              >
                <div>
                  <span
                    className="block text-4xl font-bold mb-1"
                    style={{ fontFamily: "var(--font-display)", color: "var(--color-secondary)" }}
                  >
                    100%
                  </span>
                  <span
                    className="text-sm"
                    style={{ fontFamily: "var(--font-label)", color: "var(--color-on-surface-variant)" }}
                  >
                    Fair Trade Sourced
                  </span>
                </div>
                <div>
                  <span
                    className="block text-4xl font-bold mb-1"
                    style={{ fontFamily: "var(--font-display)", color: "var(--color-secondary)" }}
                  >
                    Small
                  </span>
                  <span
                    className="text-sm"
                    style={{ fontFamily: "var(--font-label)", color: "var(--color-on-surface-variant)" }}
                  >
                    Batch Roasted
                  </span>
                </div>
              </div>

              {/* CTA link */}
              <button
                className="nurvana-story-link flex items-center gap-2 text-sm font-medium transition-colors group mt-2"
                style={{ fontFamily: "var(--font-label)" }}
              >
                Read full story
                <span
                  className="material-symbols-outlined transition-transform group-hover:translate-x-1"
                  style={{ fontSize: "18px" }}
                >
                  arrow_forward
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
