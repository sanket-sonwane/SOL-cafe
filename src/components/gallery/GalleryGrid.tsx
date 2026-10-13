import { Maximize2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { getImage } from "@/lib/images";
import type { GalleryImage } from "@/types";
import { Picture } from "@/components/media/Picture";
import { Reveal } from "@/components/animations/Reveal";

interface GalleryGridProps {
  images: GalleryImage[];
  onOpen: (index: number) => void;
}

/**
 * Hand-placed positions on a four-column, four-row desktop mosaic.
 *
 * Written out explicitly rather than computed, for two reasons: it guarantees the
 * collage tiles exactly (no holes, no dense-packing surprises as the photo set
 * grows), and it makes the intended composition legible to whoever edits the
 * selection. Two large tiles anchor opposite corners, two tall tiles run beside
 * them, and four regular tiles close the rhythm. (PRD §6.8: "Avoid the appearance
 * of an automatic photo feed.")
 *
 * Mobile ignores all of this and becomes a single, deliberately ordered column.
 */
const PLACEMENT: Record<string, string> = {
  interior: "md:col-start-1 md:col-span-2 md:row-start-1 md:row-span-2",
  seating: "md:col-start-3 md:col-span-1 md:row-start-1 md:row-span-2",
  counter: "md:col-start-4 md:col-span-1 md:row-start-1 md:row-span-1",
  drinks: "md:col-start-4 md:col-span-1 md:row-start-2 md:row-span-1",
  light: "md:col-start-1 md:col-span-2 md:row-start-3 md:row-span-2",
  texture: "md:col-start-3 md:col-span-1 md:row-start-3 md:row-span-2",
  people: "md:col-start-4 md:col-span-1 md:row-start-3 md:row-span-1",
  detail: "md:col-start-4 md:col-span-1 md:row-start-4 md:row-span-1",
};

/** Fallback for a photograph added without a placement entry: flow it normally. */
const DEFAULT_PLACEMENT = "md:col-span-1 md:row-span-1";

/**
 * The asymmetric editorial gallery (PRD §6.8).
 *
 * Each tile carries one oversized button, so opening a photograph works
 * identically by pointer, touch and keyboard. Hover only ever adds a gentle scale
 * and a caption — it never gates anything — and the button is a sibling of the
 * image rather than its wrapper, which keeps the markup valid HTML.
 *
 * The whole grid collapses to one column below `md`, which the PRD explicitly
 * asks for instead of shrinking the collage into illegibility.
 */
export function GalleryGrid({ images, onOpen }: GalleryGridProps) {
  return (
    <ul className="grid list-none grid-cols-1 gap-4 p-0 md:auto-rows-[11rem] md:grid-cols-4 md:gap-5 lg:auto-rows-[13rem]">
      {images.map((image, index) => (
        <Reveal
          key={image.id}
          as="li"
          delay={index * 60}
          className={cn("relative min-h-0", PLACEMENT[image.id] ?? DEFAULT_PLACEMENT)}
        >
          <div
            className={cn(
              "group relative aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-sand",
              "md:aspect-auto md:h-full",
            )}
          >
            <Picture
              image={getImage(image.imageKey)}
              alt={image.alt}
              sizes="(min-width: 768px) 46vw, 100vw"
              className="h-full w-full bg-sand"
              imgClassName="transition-transform duration-[900ms] ease-[var(--ease-sol)] group-hover:scale-[1.05]"
            />

            {/* A legibility scrim for the caption; decorative only. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink/75 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-within:opacity-100"
            />

            <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-left text-ivory opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-within:opacity-100">
              <span className="text-caption leading-snug">{image.caption}</span>
              <Maximize2 aria-hidden="true" className="size-4 shrink-0 text-ivory/80" />
            </span>

            <button
              type="button"
              onClick={() => onOpen(index)}
              className={cn(
                "absolute inset-0 z-10 cursor-pointer rounded-[1.25rem]",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta",
              )}
            >
              <span className="sr-only">Open photograph: {image.caption}</span>
            </button>
          </div>
        </Reveal>
      ))}
    </ul>
  );
}
