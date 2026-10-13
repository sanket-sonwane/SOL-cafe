import type { DietaryLabel, MenuBadge, MenuItem } from "@/types";

/* ---------------------------------------------------------------------------
   SŌL — menu data
   ⚠️  DEMONSTRATION CONTENT. Every price and description below is illustrative.

   Dietary labels are stated as verified café information and are *never* derived
   from an item's name (PRD §6.6). `imageKey` refers to a generated entry in
   src/data/images.ts; an item without one is rendered as a typographic row
   rather than an empty card.
   --------------------------------------------------------------------------- */

export const menuItems: MenuItem[] = [
  {
    id: "signature-latte",
    name: "SŌL Signature Latte",
    description:
      "Our house blend pulled short and folded into silky milk. Notes of cocoa nib, toasted almond and dried fig.",
    price: 240,
    category: "coffee",
    imageKey: "menu-latte",
    dietaryLabels: ["contains-dairy", "contains-nuts"],
    badges: ["bestseller", "signature"],
    isFeatured: true,
    isSeasonal: false,
    isAvailable: true,
  },
  {
    id: "flat-white",
    name: "Flat White",
    description:
      "A double ristretto under a thin veil of steamed milk. Small, dense and unapologetically coffee-forward.",
    price: 220,
    category: "coffee",
    imageKey: "menu-flat-white",
    dietaryLabels: ["contains-dairy"],
    badges: [],
    isFeatured: false,
    isSeasonal: false,
    isAvailable: true,
  },
  {
    id: "cortado",
    name: "Cortado",
    description:
      "Espresso cut with just enough warm milk to soften the edge. Served in glass, the way it should be.",
    price: 200,
    category: "coffee",
    dietaryLabels: ["contains-dairy"],
    badges: [],
    isFeatured: false,
    isSeasonal: false,
    isAvailable: true,
  },
  {
    id: "vanilla-bean-cold-brew",
    name: "Vanilla Bean Cold Brew",
    description:
      "Steeped for eighteen hours, finished with a whisper of Madagascan vanilla. Smooth, never sharp.",
    price: 260,
    category: "cold-drinks",
    imageKey: "menu-cold-brew",
    dietaryLabels: ["vegetarian"],
    badges: ["signature"],
    isFeatured: false,
    isSeasonal: false,
    isAvailable: true,
  },
  {
    id: "citrus-cold-brew-tonic",
    name: "Citrus Cold Brew Tonic",
    description:
      "Cold brew over tonic, a wide strip of orange peel and plenty of ice. Bright, bitter and very refreshing.",
    price: 290,
    category: "cold-drinks",
    dietaryLabels: ["vegetarian"],
    badges: ["seasonal", "new"],
    isFeatured: false,
    isSeasonal: true,
    isAvailable: true,
  },
  {
    id: "iced-matcha-latte",
    name: "Iced Matcha Latte",
    description:
      "Ceremonial-grade matcha whisked to order, poured over cold milk and ice. Grassy, sweet and vivid green.",
    price: 280,
    category: "tea",
    imageKey: "menu-matcha",
    dietaryLabels: ["vegetarian"],
    badges: [],
    isFeatured: false,
    isSeasonal: false,
    isAvailable: true,
  },
  {
    id: "masala-chai",
    name: "Masala Chai",
    description:
      "Assam leaf simmered with green cardamom, clove and fresh ginger. Poured from a small brass pot.",
    price: 180,
    category: "tea",
    dietaryLabels: ["vegetarian", "contains-dairy"],
    badges: [],
    isFeatured: false,
    isSeasonal: false,
    isAvailable: true,
  },
  {
    id: "avocado-toast",
    name: "Avocado Toast",
    description:
      "Smashed avocado on grilled sourdough with lime, chilli flakes and a scatter of toasted seeds.",
    price: 320,
    category: "food",
    imageKey: "menu-avocado-toast",
    dietaryLabels: ["vegetarian"],
    badges: [],
    isFeatured: false,
    isSeasonal: false,
    isAvailable: true,
  },
  {
    id: "butter-croissant",
    name: "Butter Croissant",
    description:
      "Laminated over three days and baked each morning until the layers shatter. Best eaten standing up.",
    price: 180,
    category: "food",
    imageKey: "menu-croissant",
    dietaryLabels: ["vegetarian", "contains-dairy"],
    badges: [],
    isFeatured: false,
    isSeasonal: false,
    isAvailable: true,
  },
  {
    id: "sourdough-and-butter",
    name: "Sourdough & Cultured Butter",
    description:
      "Two thick slices of our daily loaf, toasted, with salted cultured butter and flaky sea salt.",
    price: 160,
    category: "food",
    dietaryLabels: ["vegetarian", "contains-dairy"],
    badges: [],
    isFeatured: false,
    isSeasonal: false,
    isAvailable: true,
  },
  {
    id: "hazelnut-brownie",
    name: "Hazelnut Brownie",
    description:
      "Deeply fudgy, dark and not too sweet, with roasted hazelnuts folded through the batter.",
    price: 190,
    category: "desserts",
    imageKey: "menu-brownie",
    dietaryLabels: ["vegetarian", "contains-nuts"],
    badges: [],
    isFeatured: false,
    isSeasonal: false,
    isAvailable: true,
  },
  {
    id: "chocolate-sea-salt-cookie",
    name: "Chocolate Sea Salt Cookie",
    description:
      "Brown-butter dough, pools of dark chocolate and a pinch of flaky salt on top. Served warm.",
    price: 140,
    category: "desserts",
    imageKey: "menu-cookie",
    dietaryLabels: ["vegetarian"],
    badges: ["bestseller"],
    isFeatured: false,
    isSeasonal: false,
    isAvailable: true,
  },
  {
    id: "dark-chocolate-tart",
    name: "Dark Chocolate Tart",
    description:
      "A thin, snapping pastry shell filled with 70% chocolate ganache and a little crème fraîche.",
    price: 220,
    category: "desserts",
    dietaryLabels: ["vegetarian", "contains-dairy"],
    badges: [],
    isFeatured: false,
    // Shown intentionally unavailable, to demonstrate how the menu reports an
    // item the café cannot currently serve. (PRD §6.6)
    isSeasonal: false,
    isAvailable: false,
    availabilityNote: "Back on the counter Friday",
  },
];

/**
 * The dietary labels this build is prepared to display, in a fixed order, with
 * human-readable names.
 *
 * The renderer only ever shows labels found in this map, so a stray value in the
 * data can never produce a made-up dietary claim.
 */
export const DIETARY_LABELS: Record<DietaryLabel, string> = {
  vegetarian: "Vegetarian",
  vegan: "Vegan",
  "gluten-free": "Gluten free",
  "contains-nuts": "Contains nuts",
  "contains-dairy": "Contains dairy",
  egg: "Contains egg",
};

export const BADGE_LABELS: Record<MenuBadge, string> = {
  bestseller: "Bestseller",
  signature: "Signature",
  seasonal: "Seasonal",
  new: "New",
};
