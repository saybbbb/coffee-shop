/**
 * Nurvana Café — team shown on the home page.
 * Each card shows a "latte portrait" (initials poured into the foam) instead of a photo.
 * `goTo` must be a menu item id from data/menu.ts.
 */

import type { Tint } from "./menu";

export interface TeamMember {
  name: string;
  role: string;
  line: string;
  goTo: string;
  tint: Tint;
  icon: string; // Material Symbol shown as a small role badge on the portrait
}

export const TEAM: TeamMember[] = [
  {
    name: "Sent Japhet M. Cagas",
    role: "Head Roaster & Founder",
    line: "Sources and roasts every bean we pour.",
    goTo: "artisanal-espresso",
    tint: "caramel",
    icon: "local_fire_department",
  },
  {
    name: "Honeylyn Faith R. Delsocora",
    role: "Master Barista",
    line: "Pours the rosettas you'll want to photograph.",
    goTo: "nurvana-classic-latte",
    tint: "peach",
    icon: "coffee_maker",
  },
  {
    name: "Charles B. Henares",
    role: "Pastry Chef",
    line: "In the kitchen before sunrise, every day.",
    goTo: "butter-croissant",
    tint: "cream",
    icon: "bakery_dining",
  },
  {
    name: "Lourence D. Labe",
    role: "Coffee Sommelier",
    line: "Pairs every origin with the right brew.",
    goTo: "cold-brew-reserve",
    tint: "mocha",
    icon: "wine_bar",
  },
  {
    name: "Desiree Ann Saducas",
    role: "General Manager",
    line: "Keeps the café running and the regulars smiling.",
    goTo: "iced-kyoto-matcha",
    tint: "matcha",
    icon: "storefront",
  },
];

/** "Sent Japhet M. Cagas" → "SC" */
export function initials(name: string) {
  const parts = name.split(/\s+/).filter((p) => !p.endsWith("."));
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
