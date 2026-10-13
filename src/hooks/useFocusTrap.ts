import { useEffect, type RefObject } from "react";

/* ---------------------------------------------------------------------------
   Focus management for dialogs, sheets and the full-screen navigation.
   (PRD FR-05, FR-09, and the accessibility requirements in §12.2)
   --------------------------------------------------------------------------- */

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function focusableWithin(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (element) => element.offsetParent !== null || element === document.activeElement,
  );
}

interface FocusTrapOptions {
  active: boolean;
  onEscape?: () => void;
  /** Element to focus on open. Defaults to the first focusable descendant. */
  initialFocus?: RefObject<HTMLElement | null>;
  /** Element to restore focus to when the trap closes. */
  returnFocusTo?: RefObject<HTMLElement | null>;
}

/**
 * Traps Tab focus inside `containerRef` while `active`, closes on Escape, and
 * restores focus to the previously active element on close.
 *
 * Deliberately does not scroll-lock or manage `aria-hidden`: those are separate
 * concerns handled by useScrollLock and the dialog markup.
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  { active, onEscape, initialFocus, returnFocusTo }: FocusTrapOptions,
): void {
  useEffect(() => {
    if (!active || typeof document === "undefined") return;

    const container = containerRef.current;
    if (!container) return;

    const previouslyFocused = returnFocusTo?.current ?? (document.activeElement as HTMLElement | null);

    // Move focus in.
    const target = initialFocus?.current ?? focusableWithin(container)[0] ?? container;
    // A dialog container needs to be focusable to receive focus when it holds no
    // interactive children.
    if (target === container && !container.hasAttribute("tabindex")) {
      container.setAttribute("tabindex", "-1");
    }
    target.focus({ preventScroll: true });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onEscape?.();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = focusableWithin(container);
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const current = document.activeElement as HTMLElement | null;

      if (event.shiftKey && (current === first || !container.contains(current))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, [active, containerRef, initialFocus, onEscape, returnFocusTo]);
}
