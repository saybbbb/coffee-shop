/**
 * "Find your brew" quiz: three questions scored against a small taste
 * profile per drink. Temperature comes from the menu's own tags.
 */

import { allItems, type MenuItem } from "@/data/menu";

export type Temp = "hot" | "iced" | "either";
export type Taste = "sweet" | "bold" | "light";
export type Milk = "milk" | "plant" | "none";

export interface QuizAnswers {
  temp?: Temp;
  taste?: Taste;
  milk?: Milk;
}

export const QUESTIONS = [
  {
    key: "temp",
    title: "Hot or iced?",
    options: [
      { value: "hot", label: "Hot", hint: "Warm and cozy", icon: "local_fire_department" },
      { value: "iced", label: "Iced", hint: "Cold and refreshing", icon: "ac_unit" },
      { value: "either", label: "Either", hint: "Surprise me", icon: "shuffle" },
    ],
  },
  {
    key: "taste",
    title: "What are you in the mood for?",
    options: [
      { value: "sweet", label: "Sweet & creamy", hint: "Smooth, dessert-like", icon: "icecream" },
      { value: "bold", label: "Bold & strong", hint: "Proper coffee kick", icon: "bolt" },
      { value: "light", label: "Light & bright", hint: "Fresh, floral, fruity", icon: "spa" },
    ],
  },
  {
    key: "milk",
    title: "How about milk?",
    options: [
      { value: "milk", label: "Classic milk", hint: "Creamy and rich", icon: "water_drop" },
      { value: "plant", label: "Plant-based", hint: "Oat or almond", icon: "eco" },
      { value: "none", label: "No milk", hint: "Keep it pure", icon: "do_not_disturb_on" },
    ],
  },
] as const;

/** Taste profile per drink (pastries aren't part of the quiz). */
const PROFILE: Record<string, { taste: Taste[]; milk: Milk[] }> = {
  "nurvana-classic-latte": { taste: ["sweet"], milk: ["milk", "plant"] },
  "spanish-latte": { taste: ["sweet"], milk: ["milk"] },
  "brown-sugar-cortado": { taste: ["bold", "sweet"], milk: ["milk", "plant"] },
  "artisanal-espresso": { taste: ["bold"], milk: ["none"] },
  "iced-kyoto-matcha": { taste: ["light", "sweet"], milk: ["plant", "milk"] },
  "cold-brew-reserve": { taste: ["bold"], milk: ["none", "plant"] },
  "iced-caramel-cloud": { taste: ["sweet"], milk: ["milk", "plant"] },
  "pumpkin-chai-latte": { taste: ["sweet"], milk: ["milk", "plant"] },
  "honey-lavender-latte": { taste: ["light", "sweet"], milk: ["milk", "plant"] },
  "orange-espresso-tonic": { taste: ["light", "bold"], milk: ["none"] },
};

function temperatureOf(item: MenuItem): Temp {
  if (item.tags?.includes("Iced Only")) return "iced";
  if (item.tags?.includes("Hot Only")) return "hot";
  return "either";
}

/** Best match first, then a runner-up. Ties keep menu order, so results are stable. */
export function findYourBrew(a: Required<QuizAnswers>) {
  const scored = allItems
    .filter((i) => PROFILE[i.id])
    .map((item) => {
      const p = PROFILE[item.id];
      const t = temperatureOf(item);
      let score = 0;
      if (a.temp === "either" || t === "either" || t === a.temp) score += a.temp === t ? 3 : 2;
      else score -= 4; // never suggest a hot-only drink to someone who wants iced
      if (p.taste[0] === a.taste) score += 3;
      else if (p.taste.includes(a.taste)) score += 1.5;
      if (p.milk[0] === a.milk) score += 2;
      else if (p.milk.includes(a.milk)) score += 1;
      if (item.staffPick) score += 0.25;
      return { item, score };
    })
    .sort((x, y) => y.score - x.score);
  return { best: scored[0].item, runnerUp: scored[1]?.item };
}

/** Short "why it matches" line for the result. */
export function describeMatch(a: Required<QuizAnswers>) {
  const temp = { hot: "Hot", iced: "Iced", either: "Any temperature" }[a.temp];
  const taste = { sweet: "sweet & creamy", bold: "bold & strong", light: "light & bright" }[a.taste];
  const milk = { milk: "with classic milk", plant: "with plant milk", none: "no milk" }[a.milk];
  return `${temp} · ${taste} · ${milk}`;
}
