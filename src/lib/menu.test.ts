import { describe, expect, it } from "vitest";
import { menuItems } from "@/data/menu";
import {
  CATEGORY_LABELS,
  filterMenuItems,
  isEmptyResult,
  MENU_FILTERS,
  pickFeaturedItem,
  pickListItems,
  pickSeasonalItems,
} from "@/lib/menu";

describe("MENU_FILTERS", () => {
  it("starts with an All state that always restores the whole menu", () => {
    expect(MENU_FILTERS[0].id).toBe("all");
    expect(filterMenuItems(menuItems, "all")).toHaveLength(menuItems.length);
  });

  it("offers a label for every category that appears in the data", () => {
    for (const item of menuItems) {
      expect(CATEGORY_LABELS[item.category]).toBeTruthy();
    }
  });
});

describe("filterMenuItems", () => {
  it("filters by category", () => {
    const coffee = filterMenuItems(menuItems, "coffee");
    expect(coffee.length).toBeGreaterThan(0);
    expect(coffee.every((item) => item.category === "coffee")).toBe(true);
  });

  it("matches the search term against names and descriptions, case-insensitively", () => {
    const byName = filterMenuItems(menuItems, "all", "LATTE");
    expect(byName.map((item) => item.id)).toContain("signature-latte");

    const byDescription = filterMenuItems(menuItems, "all", "cardamom");
    expect(byDescription.map((item) => item.id)).toContain("masala-chai");
  });

  it("combines a category and a search term", () => {
    const result = filterMenuItems(menuItems, "coffee", "sourdough");
    expect(result).toHaveLength(0);
    expect(isEmptyResult(result)).toBe(true);
  });

  it("ignores surrounding whitespace in the query", () => {
    expect(filterMenuItems(menuItems, "all", "  cortado  ")).toHaveLength(1);
  });
});

describe("menu selections", () => {
  it("finds the single featured item", () => {
    const featured = pickFeaturedItem(menuItems);
    expect(featured?.isFeatured).toBe(true);
  });

  it("never includes an unavailable item in the seasonal strip", () => {
    const seasonal = pickSeasonalItems(menuItems);
    expect(seasonal.every((item) => item.isAvailable)).toBe(true);
  });

  it("returns the items that the tiles did not already show", () => {
    const featured = pickFeaturedItem(menuItems);
    const rest = pickListItems(menuItems, featured ? [featured] : []);
    expect(rest).toHaveLength(menuItems.length - 1);
    expect(rest.some((item) => item.id === featured?.id)).toBe(false);
  });
});
