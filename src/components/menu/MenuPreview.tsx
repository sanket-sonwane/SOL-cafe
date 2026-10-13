import { AnimatePresence, motion } from "motion/react";
import { getImage, hasImage } from "@/lib/images";
import { CATEGORY_LABELS } from "@/lib/menu";
import type { MenuItem } from "@/types";
import { Picture } from "@/components/media/Picture";

const FALLBACK_GRADIENT = "linear-gradient(140deg,#efe7db 0%,#e2d6c5 55%,#cdbca6 100%)";

/**
 * The photograph that accompanies the menu list on large screens.
 *
 * A sticky panel that cross-fades to whichever item is currently under the
 * pointer or keyboard focus, defaulting to the featured item. It is a
 * *decoration* on top of a list that is already complete and readable — the same
 * photograph is available in the item's detail overlay — so no information is
 * ever locked behind hovering.
 */
export function MenuPreview({ item, className }: { item?: MenuItem; className?: string }) {
  const image = getImage(item?.imageKey);
  const showPhoto = hasImage(item?.imageKey);
  const key = item?.id ?? "empty";

  return (
    <div className={className}>
      <div className="sticky top-28">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-sand">
          <AnimatePresence initial={false}>
            <motion.div
              key={key}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {item && showPhoto ? (
                <Picture
                  image={image}
                  alt={item.name}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="h-full w-full"
                  imgClassName="object-cover"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="h-full w-full"
                  style={{ background: FALLBACK_GRADIENT }}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* A soft base so the panel never reads as a bare rectangle, and so the
              overlaid item name keeps its contrast over any crop. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/90 via-ink/50 to-transparent"
          />

          {item && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-baseline justify-between gap-4 p-6 text-ivory">
              <p className="font-display text-[1.375rem] leading-tight">{item.name}</p>
              <p className="numeric shrink-0 text-sm">{CATEGORY_LABELS[item.category]}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
