/**
 * Offline FAQ engine for the "Ask Nurvana" helper.
 *
 * No AI service: questions are matched to intents by keywords (with light
 * fuzzy matching for typos), and every answer is built from the site's own
 * data, so it always agrees with the menu, hours and contact details shown
 * on the page.
 */

import { CAFE, DIRECTIONS_URL, formatTime, getOpenStatus, streetAddress } from "@/data/cafe";
import { MILKS, SIZES, allItems, formatPrice, menu, type MenuItem } from "@/data/menu";
import { PROCESS } from "@/data/process";
import { TEAM } from "@/data/team";

export type BotAction =
  | { kind: "go"; label: string; href: string; icon?: string }
  | { kind: "item"; label: string; itemId: string; icon?: string };

export interface BotReply {
  text: string;
  bullets?: string[];
  items?: MenuItem[];
  actions?: BotAction[];
  followUps?: string[];
}

export const STARTER_QUESTIONS = [
  "Are you open now?",
  "What's vegan?",
  "What do you recommend?",
  "How does pickup work?",
  "Where are you?",
  "Do you have Wi-Fi?",
];

/* ─── Text helpers ───────────────────────────────────────────────────────── */

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // café → cafe
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Edit distance, for forgiving typos like "capuccino" or "maccha". */
function distance(a: string, b: string) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return dp[a.length][b.length];
}

function wordMatches(word: string, key: string) {
  if (word === key) return true;
  // Only forgive typos in longer words, so "there" doesn't count as "where"
  if (key.length >= 6 && word.length >= 5) return distance(word, key) <= (key.length >= 8 ? 2 : 1);
  return false;
}

/** Score how strongly a question mentions a set of keywords (phrases count double). */
function score(q: string, words: string[], keys: string[]) {
  let s = 0;
  for (const k of keys) {
    if (k.includes(" ")) {
      if (q.includes(k)) s += 2;
    } else if (words.some((w) => wordMatches(w, k))) {
      s += 1;
    }
  }
  return s;
}

/* ─── Menu item lookup ───────────────────────────────────────────────────── */

// Words too generic to identify an item ("nurvana" is the café, not just the Classic Latte)
const STOP = new Set(["the", "and", "of", "with", "a", "latte", "iced", "reserve", "nurvana", "cafe"]);

/** Distinctive words per item, e.g. "Iced Kyoto Matcha" → matcha, kyoto. */
const ITEM_KEYS = allItems.map((item) => ({
  item,
  keys: normalize(item.name)
    .split(" ")
    .filter((w) => w.length > 2 && !STOP.has(w)),
}));

function findItems(words: string[]) {
  const scored = ITEM_KEYS.map(({ item, keys }) => ({
    item,
    hits: keys.filter((k) => words.some((w) => wordMatches(w, k))).length,
  })).filter((s) => s.hits > 0);
  const best = Math.max(0, ...scored.map((s) => s.hits));
  return scored.filter((s) => s.hits === best).map((s) => s.item);
}

const DAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

const byId = (id: string) => allItems.find((i) => i.id === id);
const withTag = (tag: string) => allItems.filter((i) => i.tags?.some((t) => t === tag));
const priceOf = (i: MenuItem) => formatPrice(i.price);

/* ─── Intents ────────────────────────────────────────────────────────────── */

interface Intent {
  id: string;
  keys: string[];
  answer: (ctx: { q: string; words: string[]; items: MenuItem[] }) => BotReply;
}

const INTENTS: Intent[] = [
  {
    id: "hours",
    keys: ["open", "opening", "close", "closing", "hours", "time", "today", "tomorrow", "weekend", "now", "schedule", ...DAYS],
    answer: ({ words }) => {
      // "What time do you open on Sunday?" → answer for that day
      const day = DAYS.findIndex((d) => words.some((w) => w === d || w === d.slice(0, 3)));
      if (day >= 0) {
        const row = CAFE.hours.find((h) => h.days.includes(day))!;
        return {
          text: `On ${DAYS[day][0].toUpperCase() + DAYS[day].slice(1)} we're open ${formatTime(row.open)} – ${formatTime(row.close)}.`,
          followUps: ["Are you open now?", "Where are you?"],
        };
      }
      const status = getOpenStatus(new Date());
      return {
        text: `${status.open ? "Yes! " : ""}${status.text}. Here are our hours:`,
        bullets: CAFE.hours.map((h) => `${h.label}: ${formatTime(h.open)} – ${formatTime(h.close)}`),
        actions: [{ kind: "go", label: "Find us", href: "/#visit", icon: "map" }],
        followUps: ["Where are you?", "How does pickup work?"],
      };
    },
  },
  {
    id: "location",
    keys: ["where", "address", "location", "located", "directions", "find", "map", "station", "parking", "near", "train", "get there"],
    answer: () => ({
      text: `You'll find us at ${CAFE.address.place}, ${streetAddress}.`,
      actions: [
        { kind: "go", label: "See the map", href: "/#visit", icon: "map" },
        { kind: "go", label: "Get directions", href: DIRECTIONS_URL, icon: "directions" },
      ],
      followUps: ["Are you open now?", "Is it pet-friendly?"],
    }),
  },
  {
    id: "vegan",
    keys: ["vegan", "dairy", "lactose", "plant", "plant based", "dairy free", "milk free", "vegetarian"],
    answer: () => ({
      text: "These are vegan as they come, and any milk drink can be made with oat or almond milk:",
      items: withTag("Vegan"),
      followUps: ["What milk options do you have?", "What do you recommend?"],
    }),
  },
  {
    id: "milk",
    keys: ["milk", "oat", "almond", "soy", "whole milk", "non dairy", "milks"],
    answer: () => ({
      text: "You can choose your milk on any milk-based drink:",
      bullets: MILKS.map((m) => `${m.label}${m.delta ? ` (+${formatPrice(m.delta)})` : ""}`),
      followUps: ["What's vegan?", "What sizes are there?"],
    }),
  },
  {
    id: "sizes",
    keys: ["size", "sizes", "small", "large", "big", "oz", "ounce", "regular"],
    answer: () => ({
      text: "Most drinks come in three sizes:",
      bullets: SIZES.map((s) => `${s.label} · ${s.oz}${s.delta ? ` (${s.delta > 0 ? "+" : "−"}${formatPrice(Math.abs(s.delta))})` : ""}`),
      followUps: ["What milk options do you have?", "What's the cheapest drink?"],
    }),
  },
  {
    id: "price",
    keys: ["price", "prices", "cost", "costs", "how much", "cheap", "cheapest", "expensive", "budget", "afford"],
    answer: ({ items }) => {
      if (items.length) {
        return {
          text: items.length === 1 ? `${items[0].name} is ${priceOf(items[0])}.` : "Here's what those cost:",
          items,
          followUps: ["What sizes are there?", "What do you recommend?"],
        };
      }
      const sorted = [...allItems].sort((a, b) => a.price - b.price);
      return {
        text: `Everything on the menu is between ${priceOf(sorted[0])} and ${priceOf(sorted[sorted.length - 1])}. The best-value picks:`,
        items: sorted.slice(0, 3),
        actions: [{ kind: "go", label: "Full menu", href: "/menu", icon: "menu_book" }],
      };
    },
  },
  {
    id: "recommend",
    keys: ["recommend", "recommendation", "best", "popular", "favorite", "favourite", "suggest", "should i get", "what should", "signature", "staff pick", "try", "good"],
    answer: () => {
      const picks = [...allItems.filter((i) => i.staffPick), byId("nurvana-classic-latte"), byId("spanish-latte")].filter(
        (i, idx, arr): i is MenuItem => !!i && arr.indexOf(i) === idx
      );
      const pair = picks[0]?.pairsWith ? byId(picks[0].pairsWith) : undefined;
      return {
        text: `Our team's favourites right now${pair ? ` — and the ${picks[0].name} goes beautifully with a ${pair.name}` : ""}:`,
        items: picks.slice(0, 3),
        followUps: ["What's seasonal?", "What pastries do you have?"],
      };
    },
  },
  {
    id: "iced",
    keys: ["cold", "iced", "ice", "chilled", "refreshing", "hot day", "cool down"],
    answer: () => ({
      text: "Something to cool you down:",
      items: allItems.filter((i) => i.tags?.some((t) => t === "Iced Only" || t === "Hot or Iced")).slice(0, 5),
      followUps: ["What's vegan?", "What sizes are there?"],
    }),
  },
  {
    id: "hot",
    keys: ["hot", "warm", "warming", "cozy", "rainy"],
    answer: () => ({
      text: "Something warm to wrap your hands around:",
      items: allItems.filter((i) => i.tags?.some((t) => t === "Hot Only" || t === "Hot or Iced")).slice(0, 5),
      followUps: ["What pastries do you have?", "What do you recommend?"],
    }),
  },
  {
    id: "seasonal",
    keys: ["seasonal", "season", "new", "special", "specials", "limited", "pumpkin", "autumn", "fall"],
    answer: () => ({
      text: "Here for a little while:",
      items: menu.find((c) => c.id === "seasonal")?.items ?? withTag("Seasonal"),
      actions: [{ kind: "go", label: "Seasonal menu", href: "/menu#seasonal", icon: "spa" }],
    }),
  },
  {
    id: "pastries",
    keys: ["pastry", "pastries", "food", "eat", "snack", "bread", "cake", "baked", "bakery", "dessert", "breakfast", "hungry", "sweet"],
    answer: () => ({
      text: "Baked at dawn by our pastry kitchen:",
      items: menu.find((c) => c.id === "pastries")?.items ?? [],
      followUps: ["What goes well with a latte?", "What's vegan?"],
    }),
  },
  {
    id: "order",
    keys: ["order", "ordering", "pickup", "pick up", "ahead", "takeaway", "take out", "to go"],
    answer: () => ({
      text: "Ordering ahead takes a minute: pick your drinks on the menu, tap + (or customise size and milk), then place a pickup order with your name. We'll have it ready in about 6 minutes, and you pay at the counter when you collect.",
      bullets: ["No account needed", "Track your order from the pill in the corner", "Delivery isn't available yet — pickup only"],
      actions: [{ kind: "go", label: "Start an order", href: "/menu", icon: "local_mall" }],
    }),
  },
  {
    id: "payment",
    keys: ["pay", "payment", "cash", "card", "gcash", "credit", "debit", "online payment", "charge", "charged"],
    answer: () => ({
      text: "You pay at the counter when you pick up your order — nothing is charged online.",
      actions: [{ kind: "go", label: "Start an order", href: "/menu", icon: "local_mall" }],
      followUps: ["How does pickup work?", "Are you open now?"],
    }),
  },
  {
    id: "delivery",
    keys: ["deliver", "delivery", "delivered", "grab", "foodpanda", "ship", "send"],
    answer: () => ({
      text: "We don't deliver yet — but you can order ahead for pickup and skip the line. It's usually ready in about 6 minutes.",
      actions: [{ kind: "go", label: "Order for pickup", href: "/menu", icon: "local_mall" }],
      followUps: ["Where are you?", "Are you open now?"],
    }),
  },
  {
    id: "wifi",
    keys: ["wifi", "wi fi", "internet", "work", "study", "laptop", "outlet", "outlets", "plug", "charge", "remote"],
    answer: () => ({
      text: "Yes — it's a great spot to work or study:",
      bullets: CAFE.amenities.map((a) => a.label),
      followUps: ["Are you open now?", "Is it pet-friendly?"],
    }),
  },
  {
    id: "pets",
    keys: ["pet", "pets", "dog", "dogs", "cat", "animal", "patio", "outdoor", "outside"],
    answer: () => ({
      text: "Our patio is pet-friendly, and there's always a water bowl out for four-legged regulars.",
      followUps: ["Do you have Wi-Fi?", "Where are you?"],
    }),
  },
  {
    id: "beans",
    keys: ["bean", "beans", "origin", "origins", "roast", "roasted", "roasting", "sourced", "farm", "fair trade", "single origin", "where coffee", "ethiopia", "colombia", "benguet"],
    answer: () => ({
      text: "From farm to cup:",
      bullets: PROCESS.map((p) => `${p.title} — ${p.kicker.toLowerCase()}`),
      actions: [{ kind: "go", label: "Bean to Cup story", href: "/#process", icon: "eco" }],
    }),
  },
  {
    id: "decaf",
    keys: ["decaf", "decaffeinated", "caffeine", "caffeine free", "no caffeine"],
    answer: () => ({
      text: "We don't list decaf on the menu right now. For something caffeine-light, try a pastry with one of our seasonal drinks — or ask the barista at the counter.",
      followUps: ["What's seasonal?", "What pastries do you have?"],
    }),
  },
  {
    id: "contact",
    keys: ["contact", "phone", "call", "email", "mail", "reach", "number", "message"],
    answer: () => ({
      text: `You can call us on ${CAFE.phone} or email ${CAFE.email}.`,
      actions: [{ kind: "go", label: "Visit us", href: "/#visit", icon: "storefront" }],
    }),
  },
  {
    id: "team",
    keys: ["team", "staff", "owner", "founder", "barista", "who", "chef", "manager", "people", "roaster", "sommelier"],
    answer: ({ words }) => {
      // "Who's the founder / pastry chef?" → name that person
      const roleWords = ["founder", "roaster", "barista", "chef", "pastry", "sommelier", "manager"];
      const asked = words.includes("owner") ? "founder" : roleWords.find((r) => words.includes(r));
      const person = asked ? TEAM.find((m) => m.role.toLowerCase().includes(asked)) : undefined;
      if (person) {
        return {
          text: `That's ${person.name}, our ${person.role}. ${person.line}`,
          actions: [{ kind: "go", label: "Meet the team", href: "/#team", icon: "group" }],
        };
      }
      return {
        text: "Meet the people behind the bar:",
        bullets: TEAM.map((m) => `${m.name} — ${m.role}`),
        actions: [{ kind: "go", label: "Meet the team", href: "/#team", icon: "group" }],
      };
    },
  },
  {
    id: "pairing",
    keys: ["pair", "pairs", "pairing", "goes with", "go with", "goes well", "match", "with my"],
    answer: ({ items }) => {
      const base = items[0] ?? byId("nurvana-classic-latte")!;
      const pair = base.pairsWith ? byId(base.pairsWith) : undefined;
      return pair
        ? { text: `${base.name} pairs beautifully with our ${pair.name}.`, items: [base, pair] }
        : { text: "Most of our drinks pair well with a butter croissant.", items: [byId("butter-croissant")!] };
    },
  },
  {
    id: "thanks",
    keys: ["thanks", "thank", "thank you", "salamat", "awesome", "perfect"],
    answer: () => ({ text: "Anytime! ☕ Anything else I can help with?", followUps: STARTER_QUESTIONS.slice(0, 3) }),
  },
  {
    id: "hello",
    keys: ["hi", "hello", "hey", "good morning", "good afternoon", "good evening", "kumusta"],
    answer: () => ({
      text: "Hi there! I can help with our menu, hours, pickup orders and finding the café. What would you like to know?",
      followUps: STARTER_QUESTIONS.slice(0, 4),
    }),
  },
];

/* ─── Main entry ─────────────────────────────────────────────────────────── */

export function answer(question: string): BotReply {
  const q = normalize(question);
  const words = q.split(" ");
  const items = findItems(words);

  let best: { intent: Intent; s: number } | null = null;
  for (const intent of INTENTS) {
    const s = score(q, words, intent.keys);
    if (s > 0 && (!best || s > best.s)) best = { intent, s };
  }

  // A question about specific items ("is the matcha vegan?", "how much is a croissant")
  if (items.length && items.length <= 3) {
    if (best?.intent.id === "vegan") {
      return {
        text: items
          .map((i) =>
            i.tags?.includes("Vegan")
              ? `Yes — the ${i.name} is vegan.`
              : i.milk
                ? `The ${i.name} is vegan with oat or almond milk.`
                : `The ${i.name} isn't vegan, sorry.`
          )
          .join(" "),
        items,
      };
    }
    if (best && ["price", "pairing"].includes(best.intent.id)) return best.intent.answer({ q, words, items });
    // "Something cold" matched Cold Brew by the word "cold" alone; "cold brew" names it fully
    const matchedOnlyByTemperature = items.every((i) => {
      const keys = ITEM_KEYS.find((k) => k.item === i)!.keys;
      const hits = keys.filter((k) => words.some((w) => wordMatches(w, k)));
      return hits.length === 1 && ["cold", "hot", "iced"].includes(hits[0]);
    });
    const generalRequest = best && ["iced", "hot"].includes(best.intent.id) && matchedOnlyByTemperature;
    if (!generalRequest && (!best || best.s <= 1 || ["recommend", "seasonal", "pastries"].includes(best.intent.id))) {
      const one = items[0];
      return {
        text:
          items.length === 1
            ? `${one.name} — ${one.description} ${priceOf(one)}${one.tags?.length ? ` · ${one.tags.join(" · ")}` : ""}.`
            : "Here's what I found on the menu:",
        items,
        followUps: one.pairsWith ? [`What goes well with the ${one.name}?`, "What sizes are there?"] : ["What do you recommend?"],
      };
    }
  }

  if (best) return best.intent.answer({ q, words, items });

  return {
    text: `I'm not sure about that one — I'm a simple helper that knows our menu, hours, pickup orders and location. For anything else, email ${CAFE.email}.`,
    followUps: STARTER_QUESTIONS.slice(0, 4),
  };
}
