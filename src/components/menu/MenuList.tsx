import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatINR } from "@/lib/format";
import { getImage, hasImage } from "@/lib/images";
import { CATEGORY_LABELS } from "@/lib/menu";
import type { MenuItem } from "@/types";
import { Picture } from "@/components/media/Picture";
import { MenuBadges } from "@/components/menu/MenuBadges";
import { DietaryLabels, UnavailableNote } from "@/components/menu/DietaryLabels";

interface MenuListProps {
  items: MenuItem[];
  onSelect: (item: MenuItem) => void;
  /** Reports the row under the pointer or keyboard focus; `null` clears it. */
  onPreview: (id: string | null) => void;
  activeId?: string | null;
}

/**
 * The secondary menu, as a legible typographic list (PRD §6.6).
 *
 * The PRD asks for a flexible editorial grid rather than identical cards
 * everywhere: the featured and secondary items keep their photographic tiles,
 * and everything else reads as a list where typography carries the layout and
 * prices stay easy to scan.
 *
 * Interaction is deliberately layered so nothing essential depends on hover:
 *  - the whole row is one generously sized control (a sibling overlay button, so
 *    the page keeps valid markup and a correct accessible name);
 *  - hovering or focusing a row *asks the preview panel* to show that item's
 *    photograph — a decoration, never the only route to any information;
 *  - activating a row opens the full detail overlay, by pointer or keyboard.
 */
export function MenuList({ items, onSelect, onPreview, activeId }: MenuListProps) {
  return (
    <ul className="flex list-none flex-col border-t border-espresso/12 p-0">
      {items.map((item) => {
        const image = getImage(item.imageKey);
        const showPhoto = hasImage(item.imageKey);

        return (
          <li key={item.id}>
            <article
              onMouseEnter={() => onPreview(item.id)}
              onMouseLeave={() => onPreview(null)}
              onFocus={() => onPreview(item.id)}
              className={cn(
                "group relative flex items-start gap-4 border-b border-espresso/12 py-5 transition-colors duration-300 sm:gap-6",
                activeId === item.id && "border-espresso/30",
              )}
            >
              {/* A thumbnail is only needed where there is no preview panel. */}
              <div className="w-16 shrink-0 overflow-hidden rounded-xl bg-sand sm:w-20 lg:hidden">
                <div className="aspect-square">
                  {showPhoto ? (
                    <Picture
                      image={image}
                      alt=""
                      sizes="80px"
                      className="h-full w-full"
                      imgClassName={cn("object-cover", !item.isAvailable && "opacity-70 saturate-50")}
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      className="h-full w-full bg-[linear-gradient(140deg,#efe7db_0%,#e2d6c5_55%,#cdbca6_100%)]"
                    />
                  )}
                </div>
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-[1.25rem] leading-tight tracking-[-0.01em] sm:text-[1.375rem]">
                    {item.name}
                  </h3>
                  <span className="numeric shrink-0 text-coffee">{formatINR(item.price)}</span>
                </div>

                <p className="line-clamp-2 text-sm text-espresso/75 lg:line-clamp-none">
                  {item.description}
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span className="text-micro tracking-[0.16em] text-espresso/70 uppercase">
                    {CATEGORY_LABELS[item.category]}
                  </span>
                  <MenuBadges badges={item.badges} />
                  <DietaryLabels labels={item.dietaryLabels} />
                  {!item.isAvailable && <UnavailableNote note={item.availabilityNote} />}
                </div>
              </div>

              <span
                aria-hidden="true"
                className="hidden self-center text-espresso/30 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-terracotta lg:block"
              >
                <ArrowUpRight className="size-4" />
              </span>

              <button
                type="button"
                onClick={() => onSelect(item)}
                className="absolute inset-0 z-10 cursor-pointer rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
              >
                <span className="sr-only">
                  {item.isAvailable
                    ? `View details for ${item.name}`
                    : `${item.name} — currently unavailable`}
                </span>
              </button>
            </article>
          </li>
        );
      })}
    </ul>
  );
}
