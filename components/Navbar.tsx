"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { label: "Our Story", href: "/" },
  { label: "The Menu", href: "/menu" },
  { label: "Loyalty", href: "/loyalty" },
  { label: "Locations", href: "/locations" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md shadow-sm"
      style={{ backgroundColor: "color-mix(in srgb, var(--color-surface-container-low) 80%, transparent)" }}>
      <nav className="flex justify-between items-center w-full px-4 md:px-12 py-4 max-w-[1200px] mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl md:text-3xl font-bold tracking-tight transition-opacity hover:opacity-80"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-primary)" }}
        >
          Nurvana Café
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={[
                    "px-3 py-2 rounded-lg text-sm transition-all duration-200",
                    "font-medium tracking-wide",
                    isActive
                      ? "font-bold border-b-2 pb-1 rounded-none"
                      : "hover:opacity-80",
                  ].join(" ")}
                  style={{
                    fontFamily: "var(--font-label)",
                    fontSize: "14px",
                    letterSpacing: "0.05em",
                    color: isActive
                      ? "var(--color-primary)"
                      : "var(--color-on-surface-variant)",
                    borderBottomColor: isActive ? "var(--color-primary)" : "transparent",
                    backgroundColor: isActive ? "transparent" : undefined,
                  }}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <button
            className="hidden md:block px-6 py-2.5 rounded-full text-sm font-medium shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 duration-200"
            style={{
              fontFamily: "var(--font-label)",
              fontSize: "14px",
              letterSpacing: "0.05em",
              backgroundColor: "var(--color-primary)",
              color: "var(--color-on-primary)",
            }}
          >
            Order Now
          </button>

          <button
            className="p-2 rounded-full transition-all hover:scale-110 duration-200"
            style={{ color: "var(--color-primary)" }}
            aria-label="Shopping bag"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>
              shopping_bag
            </span>
          </button>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-full transition-colors"
            style={{ color: "var(--color-primary)" }}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>
              {mobileOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div
          className="md:hidden border-t px-4 py-4 space-y-1"
          style={{
            backgroundColor: "var(--color-surface-container-low)",
            borderTopColor: "var(--color-outline-variant)",
          }}
        >
          {navLinks.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                style={{
                  fontFamily: "var(--font-label)",
                  fontSize: "14px",
                  color: isActive ? "var(--color-primary)" : "var(--color-on-surface-variant)",
                  backgroundColor: isActive ? "color-mix(in srgb, var(--color-primary) 8%, transparent)" : "transparent",
                  fontWeight: isActive ? "700" : "400",
                }}
              >
                {link.label}
              </Link>
            );
          })}
          <button
            className="w-full mt-2 px-6 py-3 rounded-full text-sm font-medium"
            style={{
              fontFamily: "var(--font-label)",
              backgroundColor: "var(--color-primary)",
              color: "var(--color-on-primary)",
            }}
          >
            Order Now
          </button>
        </div>
      )}
    </header>
  );
}
