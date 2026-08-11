/**
 * Nurvana Café — Menu Data
 * Edit prices/descriptions/images here — the menu page reads from this file.
 */

export type MenuTag =
  | "Hot or Iced"
  | "Iced Only"
  | "Hot Only"
  | "Seasonal"
  | "Vegan"
  | "Staff Pick"
  | "New";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;          // USD
  image: string;          // path relative to /public
  tags?: MenuTag[];
  staffPick?: boolean;
}

export interface MenuCategory {
  id: string;
  title: string;
  items: MenuItem[];
}

export const menu: MenuCategory[] = [
  {
    id: "signature-brews",
    title: "Signature Brews",
    items: [
      {
        id: "nurvana-classic-latte",
        name: "Nurvana Classic Latte",
        description:
          "Expertly brewed for a rich and comforting taste. Espresso pulled over silky steamed milk with our signature house-made vanilla bean syrup.",
        price: 5.5,
        image: "/menu/latte.jpg",
        tags: ["Hot or Iced"],
      },
      {
        id: "artisanal-espresso",
        name: "Artisanal Espresso",
        description:
          "A double shot of our meticulously sourced single-origin Ethiopian beans. Bright, complex, with notes of dark chocolate and berry.",
        price: 3.5,
        image: "/menu/espresso.jpg",
        tags: ["Hot Only"],
      },
    ],
  },
  {
    id: "chilled-blends",
    title: "Chilled Blends",
    items: [
      {
        id: "iced-kyoto-matcha",
        name: "Iced Kyoto Matcha",
        description:
          "A smooth, chilled blend you'll keep coming back for. Ceremonial grade matcha whisked to perfection over creamy oat milk.",
        price: 6.0,
        image: "/menu/cold-brew.jpg", // using cold brew as fallback for matcha
        tags: ["Iced Only", "Vegan"],
        staffPick: true,
      },
      {
        id: "cold-brew-reserve",
        name: "Cold Brew Reserve",
        description: "Steeped for 24 hours for ultimate smoothness.",
        price: 5.0,
        image: "/menu/cold-brew.jpg",
        tags: ["Iced Only"],
      },
      {
        id: "iced-caramel-cloud",
        name: "Iced Caramel Cloud",
        description: "Espresso over milk with house caramel drizzle.",
        price: 5.75,
        image: "/menu/iced-macchiato.jpg",
        tags: ["Iced Only"],
      },
    ],
  },
];
