import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { menu, type MenuItem, type MenuCategory } from "@/data/menu";

export const metadata: Metadata = {
  title: "The Menu",
  description:
    "Explore Nurvana Café's full menu — signature brews, chilled blends, and seasonal specials made with locally sourced beans.",
};

/* ─── Sub-components ─────────────────────────────────────────────────────── */

function CategoryDivider({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="h-px flex-grow" style={{ backgroundColor: "var(--color-outline-variant)" }} />
      <h2
        className="text-2xl md:text-4xl font-bold whitespace-nowrap"
        style={{ fontFamily: "var(--font-display)", color: "var(--color-primary)" }}
      >
        {title}
      </h2>
      <div className="h-px flex-grow" style={{ backgroundColor: "var(--color-outline-variant)" }} />
    </div>
  );
}

/** Large featured card (Staff Pick spotlight) */
function FeaturedCard({ item }: { item: MenuItem }) {
  return (
    <div
      className="md:col-span-7 rounded-[32px] p-8 md:p-12 relative overflow-hidden flex flex-col justify-end min-h-[400px]"
      style={{
        backgroundColor: "color-mix(in srgb, var(--color-secondary-fixed) 30%, transparent)",
      }}
    >
      {/* Background image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover opacity-80"
          sizes="(max-width: 768px) 100vw, 720px"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, var(--color-surface-container) 0%, color-mix(in srgb, var(--color-surface-container) 50%, transparent) 50%, transparent 100%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-md">
        {item.staffPick && (
          <span
            className="inline-block px-3 py-1 rounded-full text-xs mb-4"
            style={{
              fontFamily: "var(--font-label)",
              fontSize: "14px",
              letterSpacing: "0.05em",
              backgroundColor: "var(--color-primary)",
              color: "var(--color-on-primary)",
            }}
          >
            Staff Pick
          </span>
        )}
        <h3
          className="text-2xl md:text-4xl font-bold mb-2"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-primary)" }}
        >
          {item.name}
        </h3>
        <p
          className="mb-6 font-medium text-base"
          style={{ fontFamily: "var(--font-body)", color: "var(--color-on-surface)" }}
        >
          {item.description}
        </p>
        <div className="flex items-center gap-4">
          <span
            className="text-lg font-bold"
            style={{ fontFamily: "var(--font-body)", color: "var(--color-primary)" }}
          >
            ${item.price.toFixed(2)}
          </span>
          <span
            className="nurvana-btn-outline cursor-pointer select-none"
            role="button"
            tabIndex={0}
          >
            Add to Order
          </span>
        </div>
      </div>
    </div>
  );
}

/** Small compact card */
function SmallCard({ item }: { item: MenuItem }) {
  return (
    <div
      className="rounded-xl p-6 flex items-center gap-6 transition-shadow hover:shadow-md"
      style={{ backgroundColor: "var(--color-surface-container-low)" }}
    >
      <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0 relative">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          sizes="96px"
        />
      </div>
      <div>
        <h4
          className="font-bold text-lg mb-1"
          style={{ fontFamily: "var(--font-body)", color: "var(--color-primary)" }}
        >
          {item.name}
        </h4>
        <p
          className="text-sm mb-2"
          style={{ fontFamily: "var(--font-body)", color: "var(--color-on-surface-variant)" }}
        >
          {item.description}
        </p>
        <span
          className="text-sm font-medium"
          style={{ fontFamily: "var(--font-label)", color: "var(--color-secondary)" }}
        >
          ${item.price.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

/** Standard bento card for "Signature Brews" */
function BentoCard({ item }: { item: MenuItem }) {
  return (
    <div
      className="nurvana-bento-card rounded-xl p-6 md:p-8 flex flex-col md:flex-row gap-6 relative overflow-hidden group transition-colors duration-300"
    >
      {/* Image */}
      <div
        className="w-full md:w-1/3 aspect-square organic-shape overflow-hidden relative shadow-inner flex-shrink-0"
        style={{ backgroundColor: "var(--color-secondary-fixed)" }}
      >
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, 200px"
        />
      </div>

      {/* Text */}
      <div className="flex flex-col justify-center w-full md:w-2/3">
        <div className="flex justify-between items-start mb-2">
          <h3
            className="font-bold text-lg"
            style={{ fontFamily: "var(--font-body)", color: "var(--color-primary)" }}
          >
            {item.name}
          </h3>
          <span
            className="font-bold ml-4 flex-shrink-0"
            style={{
              fontFamily: "var(--font-label)",
              fontSize: "14px",
              color: "var(--color-secondary)",
            }}
          >
            ${item.price.toFixed(2)}
          </span>
        </div>
        <p
          className="text-base mb-4"
          style={{ fontFamily: "var(--font-body)", color: "var(--color-on-surface-variant)" }}
        >
          {item.description}
        </p>
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-auto">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full"
                style={{
                  fontFamily: "var(--font-label)",
                  fontSize: "12px",
                  backgroundColor: "var(--color-tertiary-fixed)",
                  color: "var(--color-on-tertiary-fixed)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/** Renders a category section based on category id */
function CategorySection({ category }: { category: MenuCategory }) {
  if (category.id === "chilled-blends") {
    const [featured, ...rest] = category.items;
    return (
      <section className="space-y-10" aria-labelledby={`cat-${category.id}`}>
        <CategoryDivider title={category.title} />
        {/* Asymmetric bento layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <FeaturedCard item={featured} />
          <div className="md:col-span-5 flex flex-col gap-6">
            {rest.map((item) => (
              <SmallCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Default: two-column bento grid
  return (
    <section className="space-y-10" aria-labelledby={`cat-${category.id}`}>
      <CategoryDivider title={category.title} />
      <div className="relative">
        {/* Decorative scribble */}
        <div
          className="absolute -top-10 -left-6 opacity-30 hidden md:block pointer-events-none"
          style={{ color: "var(--color-secondary)" }}
        >
          <svg width="60" height="60" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10,50 Q30,10 50,50 T90,50" />
            <path d="M20,60 Q40,20 60,60 T100,60" />
          </svg>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {category.items.map((item) => (
            <BentoCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function MenuPage() {
  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 md:px-12 py-12 md:py-24 space-y-24 overflow-hidden relative">
      {/* Abstract blurred bg blobs */}
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-50 -z-10 translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ backgroundColor: "var(--color-secondary-container)", mixBlendMode: "multiply" }}
      />
      <div
        className="absolute bottom-1/3 left-0 w-96 h-96 rounded-full blur-3xl opacity-30 -z-10 -translate-x-1/2 pointer-events-none"
        style={{ backgroundColor: "var(--color-primary-fixed-dim)", mixBlendMode: "multiply" }}
      />

      {/* ── Header ── */}
      <section className="text-center space-y-6 max-w-3xl mx-auto pt-6">
        <div className="flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel shadow-sm text-xs font-mono uppercase tracking-wider text-stone-700 hover:text-amber-900 transition-colors"
            style={{ fontFamily: "var(--font-label)" }}
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Back to 3D Experience</span>
          </Link>
        </div>
        <h1
          className="text-5xl md:text-6xl font-extrabold inline-block sketch-underline"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-primary)" }}
        >
          Our Menu
        </h1>
        <p
          className="italic mt-4"
          style={{
            fontFamily: "var(--font-handwritten)",
            fontSize: "24px",
            lineHeight: "32px",
            fontWeight: "300",
            color: "var(--color-on-surface-variant)",
          }}
        >
          &ldquo;Sip the Brew, Feel Brand New, Made for You.&rdquo;
        </p>
        <p
          className="text-lg leading-relaxed mt-6 max-w-2xl mx-auto"
          style={{ fontFamily: "var(--font-body)", color: "var(--color-on-surface)" }}
        >
          Carefully crafted with locally sourced beans and organic ingredients. Experience the
          tactile warmth of a true neighborhood roastery in every cup.
        </p>
      </section>

      {/* ── Menu Categories (data-driven) ── */}
      {menu.map((category) => (
        <CategorySection key={category.id} category={category} />
      ))}
    </div>
  );
}
