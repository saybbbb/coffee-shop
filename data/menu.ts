/**
 * Nurvana Café — Menu Data
 * Edit prices/descriptions/images here — the menu page reads from this file.
 *
 * Items without an `image` render as an illustrated tile using `icon`.
 * Drop a photo into /public/menu and set `image` to swap it in.
 */

export type MenuTag =
  | "Hot or Iced"
  | "Iced Only"
  | "Hot Only"
  | "Seasonal"
  | "Vegan"
  | "Staff Pick"
  | "New";

export type Tint = "cream" | "caramel" | "matcha" | "peach" | "lavender" | "mocha";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;          // USD, base (Regular size)
  image?: string;         // path relative to /public
  focus?: string;         // CSS object-position for cropping, e.g. "25% 50%" (default centre)
  icon?: string;          // Material Symbol shown when there is no image
  tint?: Tint;            // colour of the illustrated tile
  notes?: string[];       // tasting notes shown in the detail sheet
  tags?: MenuTag[];
  staffPick?: boolean;
  sizes?: boolean;        // offer Small / Regular / Large
  milk?: boolean;         // offer milk choices
}

export interface MenuCategory {
  id: string;
  title: string;
  tagline: string;
  layout: "bento" | "spotlight" | "grid";
  items: MenuItem[];
}

export interface SizeOption {
  id: string;
  label: string;
  oz: string;
  delta: number;
}

export interface MilkOption {
  id: string;
  label: string;
  delta: number;
}

export const SIZES: SizeOption[] = [
  { id: "small", label: "Small", oz: "8 oz", delta: -0.5 },
  { id: "regular", label: "Regular", oz: "12 oz", delta: 0 },
  { id: "large", label: "Large", oz: "16 oz", delta: 0.75 },
];

export const MILKS: MilkOption[] = [
  { id: "whole", label: "Whole", delta: 0 },
  { id: "oat", label: "Oat", delta: 0.6 },
  { id: "almond", label: "Almond", delta: 0.6 },
  { id: "none", label: "No milk", delta: 0 },
];

export const menu: MenuCategory[] = [
  {
    id: "signature-brews",
    title: "Signature Brews",
    tagline: "The cups that built the house.",
    layout: "bento",
    items: [
      {
        id: "nurvana-classic-latte",
        name: "Nurvana Classic Latte",
        description:
          "Expertly brewed for a rich and comforting taste. Espresso pulled over silky steamed milk with our signature house-made vanilla bean syrup.",
        price: 5.5,
        image: "/menu/latte.jpg",
        notes: ["Vanilla bean", "Caramelized sugar", "Velvet body"],
        tags: ["Hot or Iced"],
        sizes: true,
        milk: true,
      },
      {
        id: "artisanal-espresso",
        name: "Artisanal Espresso",
        description:
          "A double shot of our meticulously sourced single-origin Ethiopian beans. Bright, complex, with notes of dark chocolate and berry.",
        price: 3.5,
        image: "/menu/espresso.jpg",
        notes: ["Dark chocolate", "Wild berry", "Bright finish"],
        tags: ["Hot Only"],
      },
      {
        id: "brown-sugar-cortado",
        name: "Brown Sugar Cortado",
        description:
          "Equal parts espresso and warm milk, sweetened with muscovado and a pinch of sea salt. Small cup, big character.",
        price: 4.75,
        image: "/menu/cortado.jpg",
        icon: "coffee",
        tint: "caramel",
        notes: ["Muscovado", "Sea salt", "Toasted nut"],
        tags: ["Hot Only", "New"],
        milk: true,
      },
      {
        id: "spanish-latte",
        name: "Spanish Latte",
        description:
          "Our espresso softened with condensed milk for a creamy, gently sweet cup — a regulars' favourite.",
        price: 5.25,
        image: "/menu/spanish-latte.jpg",
        icon: "local_cafe",
        tint: "cream",
        notes: ["Condensed milk", "Cocoa", "Round & creamy"],
        tags: ["Hot or Iced"],
        sizes: true,
        milk: true,
      },
    ],
  },
  {
    id: "chilled-blends",
    title: "Chilled Blends",
    tagline: "Slow-steeped, ice-cold, never rushed.",
    layout: "spotlight",
    items: [
      {
        id: "iced-kyoto-matcha",
        name: "Iced Kyoto Matcha",
        description:
          "A smooth, chilled blend you'll keep coming back for. Ceremonial grade matcha whisked to perfection over creamy oat milk.",
        price: 6.0,
        image: "/menu/matcha.jpg",
        icon: "emoji_food_beverage",
        tint: "matcha",
        notes: ["Grassy umami", "Sweet cream", "Clean finish"],
        tags: ["Iced Only", "Vegan"],
        staffPick: true,
        sizes: true,
        milk: true,
      },
      {
        id: "cold-brew-reserve",
        name: "Cold Brew Reserve",
        description: "Steeped for 24 hours for ultimate smoothness.",
        price: 5.0,
        image: "/menu/cold-brew.jpg",
        notes: ["Molasses", "Stone fruit", "Low acidity"],
        tags: ["Iced Only", "Vegan"],
        sizes: true,
      },
      {
        id: "iced-caramel-cloud",
        name: "Iced Caramel Cloud",
        description: "Espresso over milk with house caramel drizzle.",
        price: 5.75,
        image: "/menu/iced-macchiato.jpg",
        notes: ["Burnt caramel", "Cream", "Espresso layers"],
        tags: ["Iced Only"],
        sizes: true,
        milk: true,
      },
    ],
  },
  {
    id: "seasonal",
    title: "Seasonal Specials",
    tagline: "Here for a little while. Worth the visit.",
    layout: "grid",
    items: [
      {
        id: "pumpkin-chai-latte",
        name: "Pumpkin Spice Chai",
        description:
          "Masala chai steeped in-house, folded with roasted pumpkin, cinnamon and a whisper of clove.",
        price: 5.95,
        image: "/menu/pumpkin-chai.jpg",
        icon: "spa",
        tint: "peach",
        notes: ["Cinnamon", "Roasted pumpkin", "Clove"],
        tags: ["Seasonal", "Hot or Iced"],
        sizes: true,
        milk: true,
      },
      {
        id: "honey-lavender-latte",
        name: "Honey Lavender Latte",
        description:
          "Wildflower honey and dried lavender syrup over a double shot. Floral, calm, and just sweet enough.",
        price: 6.25,
        image: "/menu/lavender-latte.jpg",
        icon: "local_florist",
        tint: "lavender",
        notes: ["Wildflower honey", "Lavender", "Silky milk"],
        tags: ["Seasonal", "New"],
        sizes: true,
        milk: true,
      },
      {
        id: "orange-espresso-tonic",
        name: "Orange Espresso Tonic",
        description:
          "Sparkling tonic over ice, a splash of blood orange, and a floating shot of espresso.",
        price: 5.5,
        image: "/menu/espresso-tonic.jpg",
        focus: "25% 50%",
        icon: "sunny",
        tint: "peach",
        notes: ["Blood orange", "Bitter-sweet", "Effervescent"],
        tags: ["Seasonal", "Iced Only", "Vegan"],
      },
    ],
  },
  {
    id: "pastries",
    title: "From the Oven",
    tagline: "Baked at dawn by our pastry kitchen.",
    layout: "grid",
    items: [
      {
        id: "butter-croissant",
        name: "Butter Croissant",
        description: "Seventy-two hour laminated dough, shattering crust, honeycomb crumb.",
        price: 3.75,
        image: "/menu/croissant.jpg",
        icon: "bakery_dining",
        tint: "cream",
        notes: ["Cultured butter", "Flaky", "Golden"],
        tags: ["Staff Pick"],
      },
      {
        id: "ube-ensaymada",
        name: "Ube Ensaymada",
        description: "Pillowy brioche swirled with ube halaya, topped with butter, sugar and aged cheese.",
        price: 4.25,
        image: "/menu/ensaymada.jpg",
        icon: "cake",
        tint: "lavender",
        notes: ["Ube", "Buttery", "Salty-sweet"],
        tags: ["New"],
      },
      {
        id: "sea-salt-cookie",
        name: "Sea Salt Choco Cookie",
        description: "Brown butter dough, dark chocolate puddles, flaky salt. Best with an espresso.",
        price: 3.25,
        image: "/menu/cookie.jpg",
        icon: "cookie",
        tint: "mocha",
        notes: ["Brown butter", "70% cacao", "Flaky salt"],
      },
      {
        id: "banana-loaf",
        name: "Banana Walnut Loaf",
        description: "Moist, dark and crackly-topped. Made with overripe bananas and toasted walnuts.",
        price: 3.95,
        image: "/menu/banana-loaf.jpg",
        icon: "breakfast_dining",
        tint: "caramel",
        notes: ["Caramelized banana", "Walnut", "Spice"],
        tags: ["Vegan"],
      },
    ],
  },
];

export const allItems = menu.flatMap((c) => c.items);

export function formatPrice(n: number) {
  return `$${n.toFixed(2)}`;
}
