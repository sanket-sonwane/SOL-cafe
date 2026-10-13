import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatINR } from "@/lib/format";
import { getImage, hasImage } from "@/lib/images";
import type { MenuItem } from "@/types";
import { Picture } from "@/components/media/Picture";
import { MenuBadges } from "@/components/menu/MenuBadges";
import { DietaryLabels, UnavailableNote } from "@/components/menu/DietaryLabels";

interface MenuItemCardProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
  /** The large editorial tile. Spans two columns on desktop. */
  featured?: boolean;
  /** `sizes` hint for the responsive image, based on where the card is placed. */
  imageSizes?: string;
}

/**
 * A menu item as an editorial tile (PRD §6.6).
 *
 * A photograph-free item is still a first-class tile: it falls back to a warm
 * sand surface with the typography doing the work, so no empty image frame is
 * ever left in the grid.
 *
 * Interaction note: the whole tile is one oversized button. Hover adds a subtle
 * zoom and arrow, but nothing is *only* available on hover — the detail overlay
 * is reachable by tap and keyboard, and the tile itself is the control.
 */
export function MenuItemCard({ item, onSelect, featured = false, imageSizes }: MenuItemCardProps) {
  const image = getImage(item.imageKey);
  const showPhoto = hasImage(item.imageKey);

  return (
    <article
      className={cn(
        "group relative flex overflow-hidden rounded-[1.25rem] border bg-cream",
        "transition-[border-color,box-shadow] duration-300 ease-[var(--ease-sol)]",
        "hover:border-espresso/25 hover:shadow-[0_24px_50px_-32px_rgba(48,35,29,0.45)]",
        item.isAvailable ? "border-espresso/10" : "border-espresso/10",
        featured ? "flex-col sm:col-span-2 sm:flex-row" : "flex-col",
      )}
    >
      {showPhoto ? (
        <Picture
          image={image}
          alt={item.name}
          aspect={featured ? "16 / 11" : "4 / 5"}
          sizes={imageSizes}
          className={cn(
            "shrink-0 bg-sand",
            featured ? "sm:aspect-auto sm:w-1/2 sm:self-stretch" : "w-full",
            !item.isAvailable && "opacity-70 saturate-50",
          )}
          imgClassName="transition-transform duration-[900ms] ease-[var(--ease-sol)] group-hover:scale-[1.045]"
        />
      ) : (
        <div
          aria-hidden="true"
          className={cn(
            "shrink-0 bg-[linear-gradient(140deg,#efe7db_0%,#e2d6c5_55%,#cdbca6_100%)]",
            featured ? "h-24 sm:h-auto sm:w-1/4" : "h-16 w-full",
          )}
        />
      )}

      <div className={cn("flex flex-1 flex-col gap-3 p-5 md:p-6", featured && "sm:justify-center")}>
        <div className="flex items-start justify-between gap-5">
          <h3
            className={cn(
              "font-display leading-[1.1] tracking-[-0.01em]",
              featured ? "text-[clamp(1.5rem,2.6vw,2.1rem)]" : "text-[1.3125rem]",
            )}
          >
            {item.name}
          </h3>
          <p className="numeric shrink-0 pt-1 text-[0.9375rem] font-medium text-coffee">
            {formatINR(item.price)}
          </p>
        </div>

        <p className={cn("text-espresso/75", featured ? "text-[0.9375rem]" : "text-sm")}>
          {item.description}
        </p>

        <div className="mt-auto flex flex-col gap-3 pt-1">
          <MenuBadges badges={item.badges} />
          <DietaryLabels labels={item.dietaryLabels} />
          {!item.isAvailable && <UnavailableNote note={item.availabilityNote} />}

          <span
            aria-hidden="true"
            className="mt-1 inline-flex items-center gap-1.5 text-micro font-medium tracking-[0.16em] text-espresso/70 uppercase transition-colors duration-300 group-hover:text-espresso"
          >
            {item.isAvailable ? "View details" : "Details"}
            <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>

      {/*
        A sibling overlay rather than a wrapper: it keeps the markup valid (no
        block elements inside a <button>) while still giving the tile a single,
        generously sized control with a correct accessible name.
      */}
      <button
        type="button"
        onClick={() => onSelect(item)}
        className={cn(
          "absolute inset-0 z-10 cursor-pointer rounded-[1.25rem]",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta",
        )}
      >
        <span className="sr-only">
          {item.isAvailable ? `View details for ${item.name}` : `${item.name} — currently unavailable`}
        </span>
      </button>
    </article>
  );
}
