import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { getImage } from "@/lib/images";
import type { GalleryImage } from "@/types";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useScrollLock } from "@/hooks/useScrollLock";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { Picture } from "@/components/media/Picture";

interface LightboxProps {
  images: GalleryImage[];
  /** Index of the open photograph, or `null` when the viewer is closed. */
  index: number | null;
  onClose: () => void;
  onChange: (index: number) => void;
}

/**
 * The gallery viewer (PRD §6.8).
 *
 * Deliberately its own component rather than a reuse of `Dialog`: this surface is
 * full-bleed and dark, and it needs prev/next controls and arrow-key navigation
 * that have no place in the item detail sheet.
 *
 * Accessibility:
 * - it is a modal dialog with a trapped focus, so Tab can never wander behind it;
 * - Escape closes it, ArrowLeft/ArrowRight move between photographs, and both are
 *   advertised with visible buttons as well as keys — nothing is keyboard-only;
 * - focus is returned to the tile that opened it when it closes;
 * - the counter and caption are real text, not image-of-text, and the image on
 *   screen is the only `priority` image so it appears without a lazy-load delay.
 *
 * Touch: a horizontal swipe moves between photographs. It is an addition, never
 * the only way to reach the controls.
 */
export function Lightbox({ images, index, onClose, onChange }: LightboxProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const touchStartX = useRef<number | null>(null);

  const open = index !== null;
  const total = images.length;
  const current = index !== null ? images[index] : undefined;
  const prefersReducedMotion = usePrefersReducedMotion();

  useScrollLock(open);
  useFocusTrap(panelRef, { active: open, onEscape: onClose, initialFocus: closeRef });

  const goTo = useCallback(
    (next: number) => {
      if (total === 0) return;
      onChange(((next % total) + total) % total);
    },
    [onChange, total],
  );

  // Arrow-key navigation. Escape and Tab are owned by the focus trap.
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goTo((index ?? 0) + 1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        goTo((index ?? 0) - 1);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, index, goTo]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && current && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[110] flex flex-col bg-ink/97 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] text-ivory"
        >
          <button
            type="button"
            aria-label="Close photograph viewer"
            tabIndex={-1}
            onClick={onClose}
            className="absolute inset-0 h-full w-full cursor-default"
          />

          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Photograph ${(index ?? 0) + 1} of ${total}: ${current.caption}`}
            className="relative z-10 flex h-full flex-col"
          >
            <div className="container-sol flex h-16 shrink-0 items-center justify-between gap-4 md:h-20">
              <p className="numeric text-caption tracking-[0.14em] text-ivory/70 uppercase">
                {(index ?? 0) + 1} <span aria-hidden="true">/</span> {total}
              </p>

              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="inline-flex size-11 items-center justify-center rounded-full text-ivory transition-colors duration-200 hover:bg-ivory/12 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ivory"
              >
                <X aria-hidden="true" className="size-5" />
                <span className="sr-only">Close photograph viewer</span>
              </button>
            </div>

            <div className="container-sol relative flex min-h-0 flex-1 items-center justify-center pb-3">
              <button
                type="button"
                onClick={() => goTo((index ?? 0) - 1)}
                className={cn(
                  "absolute left-1 z-10 inline-flex size-11 items-center justify-center rounded-full md:left-4",
                  "bg-ivory/12 text-ivory backdrop-blur-sm transition-colors duration-200 hover:bg-ivory/22",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ivory",
                )}
              >
                <ArrowLeft aria-hidden="true" className="size-5" />
                <span className="sr-only">Previous photograph</span>
              </button>

              <div
                className="flex max-h-full w-full items-center justify-center"
                onTouchStart={(event) => {
                  touchStartX.current = event.touches[0]?.clientX ?? null;
                }}
                onTouchEnd={(event) => {
                  const start = touchStartX.current;
                  touchStartX.current = null;
                  if (start === null) return;

                  const delta = (event.changedTouches[0]?.clientX ?? start) - start;
                  if (Math.abs(delta) < 48) return;
                  goTo((index ?? 0) + (delta < 0 ? 1 : -1));
                }}
              >
                <Picture
                  key={current.id}
                  image={getImage(current.imageKey)}
                  alt={current.alt}
                  sizes="(min-width: 1024px) 72vw, 92vw"
                  priority
                  className="h-[56svh] w-full rounded-[1rem] bg-espresso md:h-[68svh]"
                  imgClassName="object-contain"
                />
              </div>

              <button
                type="button"
                onClick={() => goTo((index ?? 0) + 1)}
                className={cn(
                  "absolute right-1 z-10 inline-flex size-11 items-center justify-center rounded-full md:right-4",
                  "bg-ivory/12 text-ivory backdrop-blur-sm transition-colors duration-200 hover:bg-ivory/22",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ivory",
                )}
              >
                <ArrowRight aria-hidden="true" className="size-5" />
                <span className="sr-only">Next photograph</span>
              </button>
            </div>

            <div className="container-sol shrink-0 pb-6 md:pb-8">
              <p className="mx-auto max-w-xl text-center text-caption text-ivory/70">
                {current.caption}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
