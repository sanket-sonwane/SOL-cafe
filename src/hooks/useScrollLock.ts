import { useEffect } from "react";

/**
 * Locks page scrolling while an overlay is open, by marking the root element
 * with a data attribute that globals.css turns into `overflow: hidden`.
 *
 * The attribute goes on `documentElement`, not `body`: in a standards-mode
 * document the *root* element is the scrolling element, so `body { overflow:
 * hidden }` alone still lets the page scroll behind the overlay.
 *
 * A data attribute is used rather than writing inline styles so that two
 * overlapping overlays (for example the mobile nav and the menu sheet) cannot
 * clobber each other's inline styles.
 *
 * No scroll position is stored: unlike a fixed-position lock, `overflow: hidden`
 * keeps the document height and the scroll offset, so the page never jumps.
 * `scrollbar-gutter: stable` on the root keeps the reserved scrollbar space from
 * collapsing when the bar disappears, so locking causes no layout shift.
 * (PRD FR-03: no persistent scroll lock — the attribute is always removed on
 * unmount.)
 */
export function useScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked || typeof document === "undefined") return;

    const root = document.documentElement;
    const previous = root.dataset.scrollLocked;

    root.dataset.scrollLocked = "true";

    return () => {
      if (previous === undefined) {
        delete root.dataset.scrollLocked;
      } else {
        root.dataset.scrollLocked = previous;
      }
    };
  }, [locked]);
}
