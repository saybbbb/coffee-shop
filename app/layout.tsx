import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: {
    default: "Nurvana Café — Brewed For You",
    template: "%s | Nurvana Café",
  },
  description:
    "Nurvana Café — artisanal coffee brewed for you. Small-batch roasted beans, seasonal drinks, and a warm community space.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Google Fonts preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* Nurvana Café fonts */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,700;12..96,800&family=Epilogue:ital,wght@0,300;1,300&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap"
        />
        {/* Material Symbols icon font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        {/* Film-grain texture overlay */}
        <div className="texture-overlay" aria-hidden="true" />

        {/* Persistent navbar */}
        <Navbar />

        {/* Page content */}
        <main className="flex-grow">{children}</main>

        {/* Footer */}
        <footer
          className="py-12"
          style={{ backgroundColor: "var(--color-primary)", color: "var(--color-on-primary)" }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center w-full px-4 md:px-12 max-w-[1200px] mx-auto gap-6">
            {/* Brand */}
            <div className="text-center md:text-left">
              <h2
                className="text-2xl md:text-3xl font-bold mb-2 tracking-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Nurvana Café
              </h2>
              <p
                className="text-lg italic"
                style={{
                  fontFamily: "var(--font-handwritten)",
                  color: "color-mix(in srgb, var(--color-on-primary) 80%, transparent)",
                }}
              >
                We&apos;re not just serving coffee — we&apos;re serving moments.
              </p>
            </div>

            {/* Links */}
            <nav aria-label="Footer links">
              <ul className="flex flex-wrap justify-center gap-6 text-sm">
                {["Privacy Policy", "Terms of Service", "Contact Us", "Careers"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="transition-all hover:underline underline-offset-4"
                        style={{
                          fontFamily: "var(--font-label)",
                          fontSize: "14px",
                          letterSpacing: "0.05em",
                          color: "color-mix(in srgb, var(--color-on-primary) 80%, transparent)",
                          textDecorationColor: "var(--color-secondary-fixed)",
                        }}
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </nav>

            {/* Copyright */}
            <p
              className="text-sm text-center md:text-right mt-4 md:mt-0"
              style={{
                fontFamily: "var(--font-label)",
                fontSize: "12px",
                color: "color-mix(in srgb, var(--color-on-primary) 60%, transparent)",
              }}
            >
              © 2024 Nurvana Café. Brewed for you with love.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
