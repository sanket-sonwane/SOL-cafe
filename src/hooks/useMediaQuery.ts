import { useEffect, useState } from "react";

/**
 * SSR-safe media query subscription.
 *
 * The initial value is always `false` so the server-rendered markup and the
 * first client render agree (no hydration mismatch). The real value is applied
 * in an effect, which is at most one frame later.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;

    const list = window.matchMedia(query);
    const update = () => setMatches(list.matches);

    update();
    list.addEventListener("change", update);
    return () => list.removeEventListener("change", update);
  }, [query]);

  return matches;
}

/** True when the visitor has asked the operating system to reduce motion. */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/**
 * True only for devices with a precise pointer that can hover. Used to gate
 * pointer-following effects, which must never run on touch. (PRD §7.3 Animation E)
 */
export function useFinePointer(): boolean {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}

/** True from the `md` breakpoint up, matching the Tailwind `md` breakpoint. */
export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 48rem)");
}
