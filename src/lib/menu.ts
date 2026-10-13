import type { MenuCategory, MenuItem } from "@/types";

/* ---------------------------------------------------------------------------
   Menu queries (PRD FR-04).
   Pure functions so the filtering and grouping rules can be unit tested and so
   the rendering components stay declarative.
   --------------------------------------------------------------------------- */

export type MenuFilterId = MenuCategory | "all";

export interface MenuFilter {
  id: MenuFilterId;
  label: string;
}

/**
 * Categories are configuration, not an assumption about the assortment.
 * "all" is always first and always restores the complete menu.
 */
export const MENU_FILTERS: MenuFilter[] = [
  { id: "all", label: "All" },
  { id: "coffee", label: "Coffee" },
  { id: "tea", label: "Tea" },
  { id: "cold-drinks", label: "Cold drinks" },
  { id: "food", label: "Food" },
  { id: "desserts", label: "Desserts" },
];

export const CATEGORY_LABELS: Record<MenuCategory, string> = {
  coffee: "Coffee",
  tea: "Tea",
  "cold-drinks": "Cold drinks",
  food: "Food",
  desserts: "Desserts",
};

export function filterMenuItems(
  items: MenuItem[],
  filter: MenuFilterId,
  query = "",
): MenuItem[] {
  const normalisedQuery = query.trim().toLowerCase();

  return items.filter((item) => {
    if (filter !== "all" && item.category !== filter) return false;
    if (!normalisedQuery) return true;

    return (
      item.name.toLowerCase().includes(normalisedQuery) ||
      item.description.toLowerCase().includes(normalisedQuery)
    );
  });
}

/** The single large tile in the editorial grid. Only ever returns one item. */
export function pickFeaturedItem(items: MenuItem[]): MenuItem | undefined {
  return items.find((item) => item.isFeatured);
}

/** The two smaller tiles that sit beside the featured item. */
export function pickSecondaryItems(items: MenuItem[], count = 2): MenuItem[] {
  return items.filter((item) => !item.isFeatured).slice(0, count);
}

/** The remaining items, rendered as a legible list rather than more cards. */
export function pickListItems(items: MenuItem[], exclude: MenuItem[]): MenuItem[] {
  const excluded = new Set(exclude.map((item) => item.id));
  return items.filter((item) => !excluded.has(item.id));
}

/** Season specials, filtered to what is actually available right now. */
export function pickSeasonalItems(items: MenuItem[]): MenuItem[] {
  return items.filter((item) => item.isSeasonal && item.isAvailable);
}

/** True when a search or filter combination produced nothing. */
export function isEmptyResult(items: MenuItem[]): boolean {
  return items.length === 0;
}
