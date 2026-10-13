import { useEffect, useState } from "react";

/**
 * Tracks whether the page has scrolled past a threshold.
 *
 * State only changes when the derived boolean flips, so this never causes a
 * render per animation frame. (PRD §12.1)
 */
export function useScrolled(threshold = 32): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const update = () => setScrolled(window.scrollY > threshold);

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [threshold]);

  return scrolled;
}
