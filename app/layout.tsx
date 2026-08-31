import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import LogoRevealLoader from "@/components/LogoRevealLoader";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";

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
    <html lang="en">
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
      <body className="min-h-screen flex flex-col antialiased selection:bg-amber-900 selection:text-amber-100">
        {/* Film-grain texture overlay */}
        <div className="texture-overlay" aria-hidden="true" />

        {/* 0:00-0:04 Video Logo Reveal Loader with Session Cache */}
        <LogoRevealLoader />

        {/* Smooth Scroll Engine + GSAP ScrollTrigger Integration */}
        <SmoothScrollProvider>
          {/* Floating Minimal HUD Navbar */}
          <Navbar />

          {/* Page content */}
          <main className="flex-grow">{children}</main>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
