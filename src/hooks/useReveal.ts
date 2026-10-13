import { useEffect, useRef } from "react";

interface RevealOptions {
  /** Fraction of the viewport the element must cross before revealing. */
  amount?: number;
  /** Keep observing after the first reveal. Off by default — reveals fire once. */
  repeat?: boolean;
}

/**
 * Flips `data-revealed="true"` on the returned ref once the element scrolls into
 * view. The visual transition itself lives in CSS (styles/motion.css), which
 * keeps reveal work off the main thread and — importantly — means the markup is
 * readable when JavaScript is unavailable.
 *
 * Elements are revealed immediately when IntersectionObserver is missing, so the
 * hook can never leave content permanently hidden.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>({
  amount = 0,
  repeat = false,
}: RevealOptions = {}) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (typeof IntersectionObserver === "undefined") {
      element.dataset.revealed = "true";
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            element.dataset.revealed = "true";
            if (!repeat) observer.unobserve(entry.target);
          } else if (repeat) {
            element.dataset.revealed = "false";
          }
        }
      },
      {
        // Any overlap counts (threshold 0), but the reveal waits until the
        // element is a little way into the viewport so it reads as intentional.
        threshold: amount,
        rootMargin: "0px 0px -14% 0px",
      },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [amount, repeat]);

  return ref;
}
