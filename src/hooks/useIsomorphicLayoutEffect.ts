import { useEffect, useLayoutEffect } from "react";

/**
 * `useLayoutEffect` on the client, `useEffect` on the server.
 *
 * Used wherever a client-only decision must be made *before* the first paint —
 * for example, deciding whether the introductory sequence will play — without
 * triggering React's server-rendering warning.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
