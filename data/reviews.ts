/**
 * Nurvana Café — customer quotes for the home page.
 * Written for the business concept; `drink` should be a menu item id from data/menu.ts.
 */

import type { Tint } from "./menu";

export interface Review {
  name: string;
  since: string;
  quote: string;
  drink: string;
  tint: Tint;
}

export const RATING = { score: 4.9, count: "1,200+" };

export const REVIEWS: Review[] = [
  {
    name: "Mika R.",
    since: "Regular since 2024",
    quote: "The Spanish latte is dangerously good. I come for one and somehow leave with an ensaymada every time.",
    drink: "spanish-latte",
    tint: "peach",
  },
  {
    name: "Paolo D.",
    since: "Remote worker",
    quote: "Outlets at every table, fast Wi-Fi and a cold brew that actually tastes like coffee. My second office.",
    drink: "cold-brew-reserve",
    tint: "mocha",
  },
  {
    name: "Bea S.",
    since: "Weekend regular",
    quote: "Ordered ahead on my way in and my matcha was waiting with my name on it. Zero queue, all smiles.",
    drink: "iced-kyoto-matcha",
    tint: "matcha",
  },
  {
    name: "Carlo M.",
    since: "Espresso snob",
    quote: "A properly pulled double shot. Bright, chocolatey, no bitterness. You can tell they weigh everything.",
    drink: "artisanal-espresso",
    tint: "caramel",
  },
  {
    name: "Ysabel G.",
    since: "First visit",
    quote: "Came for the latte art, stayed for the croissant. It shatters exactly the way a croissant should.",
    drink: "butter-croissant",
    tint: "cream",
  },
  {
    name: "Nico V.",
    since: "Regular since 2025",
    quote: "The honey lavender latte is my calm-down drink. The staff remember my order, which is a small miracle.",
    drink: "honey-lavender-latte",
    tint: "lavender",
  },
  {
    name: "Andrea L.",
    since: "Student",
    quote: "Cozy corner tables, good music and the best brown sugar cortado in town. My favorite study spot.",
    drink: "brown-sugar-cortado",
    tint: "caramel",
  },
  {
    name: "Jo-Ann T.",
    since: "Brings her dog",
    quote: "Pet-friendly patio, water bowls out, and a pumpkin chai that tastes like a hug. We're here every Sunday.",
    drink: "pumpkin-chai-latte",
    tint: "peach",
  },
];
