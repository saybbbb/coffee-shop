import Image from "next/image";
import type { MenuItem, Tint } from "@/data/menu";

/** Palettes for illustrated tiles. */
const PALETTES: Record<Tint, { from: string; to: string; ink: string }> = {
  cream: { from: "#faecd6", to: "#dcc0a0", ink: "#4b3621" },
  caramel: { from: "#f3d9b5", to: "#c48a55", ink: "#3d230d" },
  matcha: { from: "#e4efcf", to: "#9fb97f", ink: "#26381a" },
  peach: { from: "#fbe0cc", to: "#e0976b", ink: "#5a2a12" },
  lavender: { from: "#ece2f3", to: "#ad97c4", ink: "#3d2a4d" },
  mocha: { from: "#e3cdb8", to: "#8b664a", ink: "#2a1708" },
};

/**
 * Renders a menu item's photo, or an illustrated tile when no photo exists yet.
 * Fills its (relatively positioned) parent.
 */
export default function MenuArt({
  item,
  sizes,
  className = "",
  iconSize = "3.5rem",
  priority,
}: {
  item: Pick<MenuItem, "id" | "name" | "image" | "icon" | "tint" | "focus">;
  sizes: string;
  className?: string;
  iconSize?: string;
  priority?: boolean;
}) {
  if (item.image) {
    return (
      <Image
        src={item.image}
        alt={item.name}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover ${className}`}
        style={item.focus ? { objectPosition: item.focus } : undefined}
      />
    );
  }

  const p = PALETTES[item.tint ?? "cream"];
  return (
    <div
      role="img"
      aria-label={item.name}
      className={`absolute inset-0 flex items-center justify-center overflow-hidden ${className}`}
      style={{ background: `radial-gradient(circle at 30% 25%, ${p.from} 0%, ${p.to} 100%)` }}
    >
      {/* Soft halo */}
      <div
        className="absolute w-[70%] aspect-square rounded-full blur-2xl opacity-60"
        style={{ backgroundColor: p.from }}
      />
      {/* Steam wisps */}
      <svg
        className="absolute top-[14%] w-[30%] opacity-40 menu-art-steam"
        viewBox="0 0 60 40"
        fill="none"
        stroke={p.ink}
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M15 38 C 8 28, 22 22, 15 10" />
        <path d="M30 38 C 23 26, 37 20, 30 4" />
        <path d="M45 38 C 38 28, 52 22, 45 10" />
      </svg>
      <span
        className="material-symbols-outlined relative drop-shadow-sm"
        style={{ fontSize: iconSize, color: p.ink, fontVariationSettings: "'FILL' 1, 'wght' 300" }}
        aria-hidden="true"
      >
        {item.icon ?? "local_cafe"}
      </span>
    </div>
  );
}
