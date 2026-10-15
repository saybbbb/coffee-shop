import type { Metadata } from "next";
import { Be_Vietnam_Pro, Bricolage_Grotesque, Epilogue, Space_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import LogoRevealLoader, { INTRO_GATE_SCRIPT } from "@/components/LogoRevealLoader";
import SmoothScrollProvider, { SCROLL_RESTORE_SCRIPT } from "@/components/SmoothScrollProvider";
import CartProvider from "@/components/cart/CartProvider";
import CartDrawer from "@/components/cart/CartDrawer";
import OrderStatusPill from "@/components/cart/OrderStatusPill";
import FaqBot from "@/components/faq/FaqBot";
import PageTransitionProvider from "@/components/transition/PageTransition";
import ToastProvider from "@/components/toast/Toaster";

// Fonts are downloaded at build time and served with the site (no request to
// Google, no swap from a fallback font). Each sets a CSS variable used in globals.css.
// latin-ext covers the peso sign (₱).
const display = Bricolage_Grotesque({ subsets: ["latin", "latin-ext"], axes: ["opsz"], variable: "--font-bricolage" });
const body = Be_Vietnam_Pro({ subsets: ["latin", "latin-ext"], weight: ["400", "500", "600", "700"], variable: "--font-vietnam" });
const label = Space_Mono({ subsets: ["latin", "latin-ext"], weight: ["400", "700"], style: ["normal", "italic"], variable: "--font-mono" });
const handwritten = Epilogue({ subsets: ["latin", "latin-ext"], style: ["normal", "italic"], variable: "--font-epilogue" });

/**
 * Icons are a font that turns words like "shopping_bag" into pictures. Until it
 * arrives those words would show as text, so icons stay hidden (CSS) until this
 * marks the font as loaded. Gives up waiting after 8s rather than hide icons forever.
 */
const ICONS_READY_SCRIPT = `(function(){var d=document.documentElement,t=Date.now();function done(){d.dataset.icons="ready"}function check(){if(!document.fonts||Date.now()-t>8000)return done();document.fonts.load('24px "Material Symbols Outlined"').then(function(f){f.length?done():setTimeout(check,100)},done)}check()})()`;

export const metadata: Metadata = {
  title: {
    default: "Nurvana Café — Brewed For You",
    template: "%s | Nurvana Café",
  },
  description:
    "Nurvana Café — artisanal coffee brewed for you. Small-batch roasted beans, seasonal drinks, and a warm community space.",
  // Link previews (Messenger, Facebook, Discord…). The image itself is app/opengraph-image.jpg
  // (regenerate with `npm run og:image`); on Vercel, Next fills in the site's address automatically.
  openGraph: {
    type: "website",
    siteName: "Nurvaná Café",
    locale: "en_PH",
    title: "Nurvaná Café — Sip the Brew. Feel Brand New.",
    description: "Specialty coffee and pastries at PHINMA COC, Cagayan de Oro. Browse the menu and order ahead for pickup.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nurvaná Café — Sip the Brew. Feel Brand New.",
    description: "Specialty coffee and pastries at PHINMA COC, Cagayan de Oro. Order ahead for pickup.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // The head script may set data-intro before React hydrates
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} ${label.variable} ${handwritten.variable}`}
    >
      <head>
        {/* Decide before first paint whether the intro overlay shows (no hero flash) */}
        <script dangerouslySetInnerHTML={{ __html: INTRO_GATE_SCRIPT }} />
        {/* Scroll position is restored by SmoothScrollProvider once the pinned sections exist */}
        <script dangerouslySetInnerHTML={{ __html: SCROLL_RESTORE_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: ICONS_READY_SCRIPT }} />
        <noscript>
          <style>{`.intro-overlay{display:none}.material-symbols-outlined{visibility:visible!important}`}</style>
        </noscript>
        {/* Material Symbols icon font (too large to self-host; hidden until loaded, see above) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block"
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased selection:bg-amber-900 selection:text-amber-100">
        {/* Film-grain texture overlay */}
        <div className="texture-overlay" aria-hidden="true" />

        {/* 0:00-0:04 Video Logo Reveal Loader with Session Cache */}
        <LogoRevealLoader />

        {/* Smooth Scroll Engine + GSAP ScrollTrigger Integration */}
        <SmoothScrollProvider>
          {/* Branded curtain between pages */}
          <PageTransitionProvider>
            {/* Bottom-centre notifications ("Added to order", etc.) */}
            <ToastProvider>
              {/* Prototype pickup-order cart (browser-only, no payments) */}
              <CartProvider>
                {/* Floating Minimal HUD Navbar */}
                <Navbar />

                {/* Page content */}
                <main className="flex-grow">{children}</main>

                <CartDrawer />
                <OrderStatusPill />
                {/* "Ask Nurvana" offline FAQ helper */}
                <FaqBot />
              </CartProvider>
            </ToastProvider>
          </PageTransitionProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
