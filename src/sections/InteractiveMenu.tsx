import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { menuItems } from "@/data/menu";
import {
  filterMenuItems,
  isEmptyResult,
  pickFeaturedItem,
  pickListItems,
  pickSecondaryItems,
  pickSeasonalItems,
  type MenuFilterId,
} from "@/lib/menu";
import type { MenuItem } from "@/types";
import { Section } from "@/components/layout/Section";
import { Eyebrow } from "@/components/typography/Eyebrow";
import { MaskedHeading } from "@/components/typography/MaskedHeading";
import { Reveal } from "@/components/animations/Reveal";
import { HourMark } from "@/components/atmosphere/HourMark";
import { SunRing } from "@/components/atmosphere/SunRing";
import { CategoryFilter } from "@/components/menu/CategoryFilter";
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { MenuList } from "@/components/menu/MenuList";
import { MenuPreview } from "@/components/menu/MenuPreview";
import { MenuItemDialog } from "@/components/menu/MenuItemDialog";
import { Button } from "@/components/buttons/Button";

/**
 * Section F — the interactive menu (PRD §6.6), at 16:20. Late afternoon.
 *
 * The PRD asks for a flexible editorial grid rather than identical cards
 * everywhere, so the "All" view is a composition:
 *
 *   1. one large featured item, with two smaller tiles beside it;
 *   2. then a clean typographic list for everything else, paired with a sticky
 *      preview panel that shows the photograph of the row under the pointer or
 *      keyboard focus.
 *
 * Filtering a category that has no featured item simply falls through to the
 * list, so the layout never invents an arbitrary "featured" tile. The preview
 * panel is decoration: every item is complete and actionable in the list, and
 * the photograph is also available in the detail overlay.
 *
 * The section clips horizontally with `overflow-x-clip` rather than
 * `overflow-hidden`, because `hidden` would turn the section into a scroll
 * container and silently break the sticky preview.
 */
export function InteractiveMenu() {
  const [activeFilter, setActiveFilter] = useState<MenuFilterId>("all");
  const [query, setQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);

  const visibleItems = useMemo(
    () => filterMenuItems(menuItems, activeFilter, query),
    [activeFilter, query],
  );

  const seasonalItems = useMemo(() => pickSeasonalItems(menuItems), []);
  const showSeasonalStrip = activeFilter === "all" && query.trim() === "" && seasonalItems.length > 0;

  // The editorial composition only makes sense in the full, unfiltered view.
  const showEditorial = activeFilter === "all" && query.trim() === "";

  const featuredItem = showEditorial ? pickFeaturedItem(visibleItems) : undefined;
  const secondaryItems = showEditorial ? pickSecondaryItems(visibleItems, 2) : [];
  const listItems = pickListItems(visibleItems, [
    ...(featuredItem ? [featuredItem] : []),
    ...secondaryItems,
  ]);

  const previewItem =
    visibleItems.find((item) => item.id === previewId) ?? featuredItem ?? visibleItems[0];

  const resetFilters = () => {
    setActiveFilter("all");
    setQuery("");
  };

  return (
    <Section
      id="menu"
      tone="ivory"
      hour="afternoon"
      labelledBy="menu-heading"
      className="overflow-x-clip"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <SunRing
          className="absolute -right-[10%] -bottom-[16%] size-[46vw] text-espresso/[0.06]"
          fraction={0.58}
        />
      </div>

      <div className="container-sol">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal className="flex flex-col gap-6">
            <HourMark time="16:20" label="Something to savour" className="text-coffee" />
            <MaskedHeading
              id="menu-heading"
              as="h2"
              size="display-2"
              lines={["YOUR NEXT", "FAVOURITE."]}
              className="max-w-[14ch]"
            />
          </Reveal>

          <Reveal delay={140} className="max-w-sm md:pb-2">
            <p className="text-espresso/75">
              Everything is made to order, so a short wait is part of the deal. Ask us anything about
              an item — ingredients, allergens, or what to pair it with.
            </p>
          </Reveal>
        </div>

        <div className="mt-10 md:mt-14">
          <CategoryFilter
            active={activeFilter}
            onChange={setActiveFilter}
            query={query}
            onQueryChange={setQuery}
            resultsId="menu-results-count"
            resultCount={visibleItems.length}
          />
        </div>

        {showSeasonalStrip && (
          <Reveal className="mt-10">
            <div className="grain flex flex-col gap-5 rounded-[1.25rem] bg-sand px-6 py-7 md:flex-row md:items-center md:justify-between md:px-9">
              <div>
                <Eyebrow tone="espresso">ON THE COUNTER NOW</Eyebrow>
                <h3 className="mt-2 font-display text-[1.5rem] leading-tight">
                  A short season, worth catching.
                </h3>
              </div>
              <ul className="flex flex-col gap-3 md:items-end">
                {seasonalItems.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedItem(item)}
                      className="group inline-flex min-h-11 items-center gap-3 text-left"
                    >
                      <span className="font-display text-[1.125rem]">{item.name}</span>
                      <span className="numeric text-sm text-coffee">₹{item.price}</span>
                      <span className="link-underline text-micro tracking-[0.16em] text-espresso/70 uppercase group-hover:text-espresso">
                        Details
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        )}

        {isEmptyResult(visibleItems) ? (
          <div className="mt-14 flex flex-col items-start gap-5 rounded-[1.25rem] border border-dashed border-espresso/20 px-6 py-12 md:px-10">
            <h3 className="font-display text-[1.5rem]">Nothing matches that yet.</h3>
            <p className="max-w-md text-espresso/75">
              Try another category, or clear the search to see the whole menu again.
            </p>
            <Button variant="outline" onClick={resetFilters}>
              Show everything
            </Button>
          </div>
        ) : (
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {featuredItem || secondaryItems.length > 0 ? (
              <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
                {featuredItem && (
                  <MenuItemCard
                    item={featuredItem}
                    onSelect={setSelectedItem}
                    featured
                    imageSizes="(min-width: 1024px) 620px, 100vw"
                  />
                )}
                {secondaryItems.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onSelect={setSelectedItem}
                    imageSizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                  />
                ))}
              </div>
            ) : null}

            <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-16">
              <Reveal className="lg:col-span-7">
                <MenuList
                  items={listItems}
                  onSelect={setSelectedItem}
                  onPreview={setPreviewId}
                  activeId={previewId}
                />
              </Reveal>

              <Reveal delay={160} className="hidden lg:col-span-5 lg:block">
                <MenuPreview item={previewItem} />
              </Reveal>
            </div>
          </motion.div>
        )}
      </div>

      <MenuItemDialog item={selectedItem} onClose={() => setSelectedItem(null)} />
    </Section>
  );
}
