import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useScrollLock } from "@/hooks/useScrollLock";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  /** id of the element that names the dialog. */
  labelledBy: string;
  /** Optional id of a longer description inside the dialog. */
  describedBy?: string;
  children: ReactNode;
  /** `sheet` presents as a bottom sheet on small screens, a panel on desktop. */
  variant?: "center" | "sheet";
  className?: string;
}

/**
 * An accessible overlay used by both the menu item detail and the gallery
 * lightbox. (PRD FR-05, FR-09)
 *
 * Behaviour:
 * - portalled to <body> so no ancestor can clip or trap it;
 * - Escape closes it, Tab is trapped inside, and focus returns to the control
 *   that opened it;
 * - page scrolling is locked while open and always released on close;
 * - the backdrop is a real button, so it is operable by pointer without relying
 *   on a click handler on a bare div.
 */
export function Dialog({
  open,
  onClose,
  labelledBy,
  describedBy,
  children,
  variant = "center",
  className,
}: DialogProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  useScrollLock(open);
  useFocusTrap(panelRef, { active: open, onEscape: onClose });

  // Keep the dialog usable if the page is scrolled while it is open.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [open]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex">
          <motion.button
            type="button"
            aria-label="Close"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 h-full w-full cursor-default bg-ink/70 backdrop-blur-[2px]"
            tabIndex={-1}
          />

          <div
            className={cn(
              "relative z-10 flex w-full",
              variant === "sheet" ? "mt-auto items-end md:items-center md:justify-center" : "items-center justify-center",
              "p-0 md:p-6",
            )}
          >
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={labelledBy}
              aria-describedby={describedBy}
              initial={{ opacity: 0, y: variant === "sheet" ? 40 : 16, scale: variant === "sheet" ? 1 : 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: variant === "sheet" ? 32 : 12, scale: variant === "sheet" ? 1 : 0.99 }}
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "relative max-h-[92svh] w-full overflow-y-auto overscroll-contain bg-cream text-espresso",
                "rounded-t-[1.75rem] md:max-w-4xl md:rounded-[1.5rem]",
                "shadow-[0_30px_80px_-30px_rgba(28,21,18,0.6)]",
                // The bottom sheet sits against the edge, so it must clear the
                // device's gesture bar; a centred panel has no such contact.
                variant === "sheet" && "pb-[env(safe-area-inset-bottom)]",
                className,
              )}
            >
              <button
                type="button"
                onClick={onClose}
                className={cn(
                  "absolute top-4 right-4 z-20 inline-flex size-11 items-center justify-center rounded-full",
                  "bg-espresso/85 text-ivory transition-colors duration-200 hover:bg-espresso",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta",
                )}
              >
                <X aria-hidden="true" className="size-4" />
                <span className="sr-only">Close</span>
              </button>

              {children}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
