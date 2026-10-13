import { useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { cafeConfig, fullAddress, openingHours, primaryNav } from "@/data/cafe";
import { formatHoursRow } from "@/lib/format";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useScrollLock } from "@/hooks/useScrollLock";
import { getDirectionsUrl } from "@/lib/maps";
import { Wordmark } from "@/components/navigation/Wordmark";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

const LINKS = [...primaryNav, { id: "visit", label: "Visit us", href: "#visit" as const }];

/**
 * The full-screen navigation overlay (PRD FR-03).
 *
 * Uses the same focus trap as the dialogs, so keyboard focus can never escape
 * behind the overlay, and the page cannot be scrolled underneath it. All links
 * are 44px-tall rows rather than bare text, and opening/closing never depends on
 * a hover.
 */
export function MobileNav({ open, onClose }: MobileNavProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  useScrollLock(open);
  useFocusTrap(panelRef, { active: open, onEscape: onClose });

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-navigation"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[90] flex flex-col bg-espresso pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] text-ivory md:hidden"
        >
          <div className="container-sol flex h-16 shrink-0 items-center justify-between">
            <Wordmark size="sm" />
            <button
              type="button"
              onClick={onClose}
              className="inline-flex size-11 items-center justify-center rounded-full text-ivory transition-colors duration-200 hover:bg-ivory/12"
            >
              <X aria-hidden="true" className="size-5" />
              <span className="sr-only">Close menu</span>
            </button>
          </div>

          <nav aria-label="Mobile" className="container-sol flex-1 overflow-y-auto overscroll-contain pt-6 pb-10">
            <ul className="flex flex-col">
              {LINKS.map((item, index) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.06 * index }}
                  className="border-b border-ivory/12"
                >
                  <a
                    href={item.href}
                    onClick={onClose}
                    className="flex min-h-[4.25rem] items-center justify-between gap-4 py-3"
                  >
                    <span className="font-display text-[2rem] leading-none tracking-[-0.01em]">
                      {item.label}
                    </span>
                    <ArrowUpRight aria-hidden="true" className="size-5 text-ivory/70" />
                  </a>
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.34 }}
              className="mt-10 space-y-6 text-sm"
            >
              <div>
                <h2 className="text-eyebrow font-medium uppercase text-ivory/70">Find us</h2>
                <p className="mt-2 leading-relaxed text-ivory/85">{fullAddress}</p>
                <a
                  href={getDirectionsUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline mt-3 inline-flex min-h-11 items-center gap-1.5 text-ivory"
                >
                  Get directions
                  <ArrowUpRight aria-hidden="true" className="size-4" />
                </a>
              </div>

              <div>
                <h2 className="text-eyebrow font-medium uppercase text-ivory/70">Hours</h2>
                <dl className="mt-2 space-y-1 text-ivory/85">
                  {openingHours.map((row) => (
                    <div key={row.id} className="flex justify-between gap-4">
                      <dt>{row.label}</dt>
                      <dd className="numeric text-ivory/70">{formatHoursRow(row)}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <p className={cn("text-caption text-ivory/70")}>
                Demonstration content — {cafeConfig.name} is a fictional café.
              </p>
            </motion.div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
