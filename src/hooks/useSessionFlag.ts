import { useCallback, useEffect, useState } from "react";

/**
 * A boolean remembered for the duration of the browser session.
 *
 * Used for the introductory sequence so a returning visitor — including someone
 * navigating back to the page — is not made to sit through it twice. (PRD §6.1)
 *
 * Storage failures (private mode, disabled cookies) are treated as "not seen",
 * which degrades to showing the intro rather than breaking.
 */
export function useSessionFlag(key: string): { value: boolean; mark: () => void } {
  const [value, setValue] = useState(false);

  useEffect(() => {
    try {
      setValue(window.sessionStorage.getItem(key) === "1");
    } catch {
      setValue(false);
    }
  }, [key]);

  const mark = useCallback(() => {
    try {
      window.sessionStorage.setItem(key, "1");
    } catch {
      // Ignore: the flag simply will not persist.
    }
    setValue(true);
  }, [key]);

  return { value, mark };
}
