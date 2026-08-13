"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { label: "Our Story", href: "/" },
  { label: "The Menu", href: "/menu" },
];

const teamMembers = [
  { name: "Sent Japhet M. Cagas", role: "Head Roaster & Founder", icon: "badge" },
  { name: "Honeylyn Faith R. Delsocora", role: "Master Barista", icon: "local_cafe" },
  { name: "Charles B. Henares", role: "Pastry Chef", icon: "bakery_dining" },
  { name: "Lourence D. Labe", role: "Coffee Sommelier", icon: "workspace_premium" },
  { name: "Desire Ann Saducas", role: "General Manager", icon: "storefront" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [teamDropdownOpen, setTeamDropdownOpen] = useState(false);
  const [mobileTeamOpen, setMobileTeamOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-40 w-full backdrop-blur-md shadow-sm"
      style={{
        backgroundColor:
          "color-mix(in srgb, var(--color-surface-container-low) 80%, transparent)",
      }}
    >
      <nav className="flex justify-between items-center w-full px-4 md:px-12 py-4 max-w-[1200px] mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl md:text-3xl font-bold tracking-tight transition-opacity hover:opacity-80"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-primary)",
          }}
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
                    borderBottomColor: isActive
                      ? "var(--color-primary)"
                      : "transparent",
                    backgroundColor: isActive ? "transparent" : undefined,
                  }}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}

          {/* The Team dropdown menu */}
          <li
            className="relative"
            onMouseEnter={() => setTeamDropdownOpen(true)}
            onMouseLeave={() => setTeamDropdownOpen(false)}
          >
            <button
              onClick={() => setTeamDropdownOpen((prev) => !prev)}
              className="px-3 py-2 rounded-lg text-sm transition-all duration-200 font-medium tracking-wide flex items-center gap-1 hover:opacity-80 cursor-pointer"
              style={{
                fontFamily: "var(--font-label)",
                fontSize: "14px",
                letterSpacing: "0.05em",
                color: teamDropdownOpen
                  ? "var(--color-primary)"
                  : "var(--color-on-surface-variant)",
              }}
              aria-expanded={teamDropdownOpen}
            >
              Our Team
              <span
                className="material-symbols-outlined transition-transform duration-200"
                style={{
                  fontSize: "18px",
                  transform: teamDropdownOpen
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                }}
              >
                expand_more
              </span>
            </button>

            {/* Dropdown Card */}
            {teamDropdownOpen && (
              <div
                className="absolute top-full left-0 mt-1 w-72 rounded-xl p-3 shadow-xl border backdrop-blur-lg duration-200"
                style={{
                  backgroundColor: "var(--color-surface-container-lowest)",
                  borderColor: "var(--color-outline-variant)",
                }}
              >
                <div
                  className="px-3 py-2 mb-2 rounded-lg text-xs font-semibold uppercase tracking-wider border-b"
                  style={{
                    fontFamily: "var(--font-label)",
                    color: "var(--color-primary)",
                    borderColor: "var(--color-surface-variant)",
                  }}
                >
                  Group Members
                </div>
                <div className="space-y-1">
                  {teamMembers.map((member, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-[color-mix(in_srgb,var(--color-primary)_6%,transparent)]"
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                        style={{
                          backgroundColor: "var(--color-secondary-container)",
                          color: "var(--color-on-secondary-container)",
                        }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                          {member.icon}
                        </span>
                      </div>
                      <div className="overflow-hidden">
                        <div
                          className="text-sm font-semibold truncate"
                          style={{ color: "var(--color-on-surface)" }}
                        >
                          {member.name}
                        </div>
                        <div
                          className="text-xs truncate"
                          style={{ color: "var(--color-on-surface-variant)" }}
                        >
                          {member.role}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </li>
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <button
            className="hidden md:block px-6 py-2.5 rounded-full text-sm font-medium shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 duration-200 cursor-pointer"
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
            className="p-2 rounded-full transition-all hover:scale-110 duration-200 cursor-pointer"
            style={{ color: "var(--color-primary)" }}
            aria-label="Shopping bag"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>
              shopping_bag
            </span>
          </button>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-full transition-colors cursor-pointer"
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

          {/* Mobile Team Accordion */}
          <div className="pt-1">
            <button
              onClick={() => setMobileTeamOpen((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer"
              style={{
                fontFamily: "var(--font-label)",
                fontSize: "14px",
                color: "var(--color-on-surface-variant)",
              }}
            >
              <span>Group Members</span>
              <span
                className="material-symbols-outlined transition-transform duration-200"
                style={{
                  fontSize: "18px",
                  transform: mobileTeamOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                expand_more
              </span>
            </button>
            {mobileTeamOpen && (
              <div
                className="ml-4 mt-1 pl-2 border-l-2 space-y-2 py-1"
                style={{ borderColor: "var(--color-outline-variant)" }}
              >
                {teamMembers.map((member, index) => (
                  <div key={index} className="px-3 py-1.5 rounded-md flex items-center gap-2">
                    <span className="material-symbols-outlined text-xs" style={{ fontSize: "16px", color: "var(--color-primary)" }}>
                      {member.icon}
                    </span>
                    <div>
                      <div className="text-sm font-semibold" style={{ color: "var(--color-on-surface)" }}>
                        {member.name}
                      </div>
                      <div className="text-xs" style={{ color: "var(--color-on-surface-variant)" }}>
                        {member.role}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            className="w-full mt-2 px-6 py-3 rounded-full text-sm font-medium cursor-pointer"
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

