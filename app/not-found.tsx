import type { Metadata } from "next";
import TransitionLink from "@/components/transition/TransitionLink";
import MenuArt from "@/components/menu/MenuArt";
import Footer from "@/components/Footer";
import { allItems, formatPrice } from "@/data/menu";

export const metadata: Metadata = {
  title: "Page not found",
};

const POPULAR = ["iced-kyoto-matcha", "spanish-latte", "butter-croissant"]
  .map((id) => allItems.find((i) => i.id === id))
  .filter((i) => i !== undefined);

/** Top-down empty cup: saucer, cup, and the coffee ring left at the bottom. */
function EmptyCup() {
  return (
    <svg viewBox="0 0 220 200" className="w-48 md:w-56 mx-auto" aria-hidden="true">
      <defs>
        <filter id="nf-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#291806" floodOpacity="0.22" />
        </filter>
      </defs>
      <g className="empty-cup">
        <circle cx="105" cy="105" r="86" fill="#fffaf3" filter="url(#nf-shadow)" />
        <circle cx="105" cy="105" r="72" fill="none" stroke="#eadfce" strokeWidth="1.5" />
        <rect x="160" y="94" width="38" height="24" rx="12" fill="#fff" stroke="#eadfce" />
        <circle cx="105" cy="105" r="60" fill="#fff" stroke="#eadfce" />
        <circle cx="105" cy="105" r="51" fill="#f7efe4" />
        {/* the last sip: a dried coffee ring and a few drops */}
        <circle cx="105" cy="105" r="44" fill="none" stroke="#c48a55" strokeOpacity="0.35" strokeWidth="2.5" strokeDasharray="60 8 30 12 90 6" />
        <circle cx="122" cy="124" r="4" fill="#8a5226" fillOpacity="0.45" />
        <circle cx="131" cy="114" r="2" fill="#8a5226" fillOpacity="0.35" />
        <circle cx="90" cy="88" r="2.5" fill="#8a5226" fillOpacity="0.25" />
      </g>
    </svg>
  );
}

export default function NotFound() {
  return (
    <>
      <section className="relative min-h-[100dvh] flex items-center overflow-hidden px-4 pt-28 pb-20" aria-labelledby="nf-heading">
        <div
          className="absolute inset-0 -z-10 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 80% 10%, color-mix(in srgb, var(--color-secondary-container) 60%, transparent) 0%, transparent 55%), radial-gradient(ellipse at 10% 90%, color-mix(in srgb, var(--color-primary-fixed) 40%, transparent) 0%, transparent 50%)",
          }}
        />
        <div className="max-w-2xl mx-auto w-full text-center space-y-6">
          <EmptyCup />
          <p
            className="text-xs md:text-[11px] font-mono uppercase tracking-[0.2em]"
            style={{ color: "var(--color-secondary)", fontFamily: "var(--font-label)" }}
          >
            Error 404 · page not found
          </p>
          <h1
            id="nf-heading"
            className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[0.95]"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-primary)" }}
          >
            This cup is empty.
          </h1>
          <p className="italic text-lg md:text-xl" style={{ fontFamily: "var(--font-handwritten)", color: "var(--color-on-surface-variant)" }}>
            The page you&rsquo;re looking for was finished already &mdash; or never brewed.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <TransitionLink href="/" className="nurvana-btn-solid">
              <span aria-hidden="true" className="material-symbols-outlined text-lg">
                home
              </span>
              Back home
            </TransitionLink>
            <TransitionLink href="/menu" className="nurvana-btn-outline">
              Browse the menu
            </TransitionLink>
          </div>

          {/* A little temptation to stay */}
          <div className="pt-8 space-y-3">
            <p className="sheet-label">Popular right now</p>
            <ul className="flex flex-wrap justify-center gap-3">
              {POPULAR.map((item) => (
                <li key={item.id}>
                  <TransitionLink
                    href="/menu"
                    className="flex items-center gap-3 pl-2 pr-4 py-2 rounded-full border transition-transform hover:-translate-y-0.5"
                    style={{ borderColor: "var(--color-outline-variant)", backgroundColor: "var(--color-surface-container-low)" }}
                  >
                    <span className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                      <MenuArt item={item} sizes="40px" iconSize="1.2rem" />
                    </span>
                    <span className="text-left leading-tight">
                      <span className="block text-sm font-semibold" style={{ color: "var(--color-primary)" }}>
                        {item.name}
                      </span>
                      <span className="block text-xs font-mono" style={{ color: "var(--color-secondary)", fontFamily: "var(--font-label)" }}>
                        {formatPrice(item.price)}
                      </span>
                    </span>
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
