/**
 * Nurvana Café — "Bean to Cup" steps for the home page.
 * Steps without an `image` show an illustrated tile; drop a photo in /public/process
 * and set `image` to swap it in.
 */

import type { Tint } from "./menu";

export interface ProcessStep {
  id: string;
  title: string;
  kicker: string;
  body: string;
  facts: string[];
  image?: string;
  focus?: string;
  icon: string;
  tint: Tint;
}

export const PROCESS: ProcessStep[] = [
  {
    id: "sourced",
    title: "Sourced",
    kicker: "Small farms, fair prices",
    body:
      "We buy directly from small growers in Ethiopia, Colombia and the Benguet highlands, paying above fair-trade so the best lots come to us first.",
    facts: ["Direct trade", "1,500 m+ altitude", "Hand-picked cherries"],
    image: "/process/sourced.jpg",
    icon: "eco",
    tint: "matcha",
  },
  {
    id: "roasted",
    title: "Roasted",
    kicker: "Every morning, in small batches",
    body:
      "Our drum roaster runs at dawn in 12 kg batches. Each origin gets its own profile, tasted and adjusted until the sweetness comes through.",
    facts: ["12 kg batches", "Roasted daily", "Rested 5 days"],
    image: "/process/roasted.jpg",
    icon: "local_fire_department",
    tint: "caramel",
  },
  {
    id: "brewed",
    title: "Brewed",
    kicker: "Weighed, timed, tasted",
    body:
      "Every shift starts by dialing in the grinder. Shots are weighed to the gram and timed to the second, and milk is steamed to a silky 60°C.",
    facts: ["18 g in · 36 g out", "28-second shots", "60°C milk"],
    image: "/process/brewed.jpg",
    icon: "coffee_maker",
    tint: "mocha",
  },
  {
    id: "served",
    title: "Served",
    kicker: "Warm, and with your name on it",
    body:
      "Finished with latte art and handed over with a smile, at the counter or ready for pickup when you order ahead.",
    facts: ["Ready in ~6 min", "Order ahead", "Name on every cup"],
    image: "/process/served.jpg",
    icon: "local_cafe",
    tint: "cream",
  },
];
