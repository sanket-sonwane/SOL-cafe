import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { useScrollLock } from "@/hooks/useScrollLock";
import { cafeConfig } from "@/data/cafe";
import { SunRing } from "@/components/atmosphere/SunRing";

const SESSION_KEY = "sol:intro-seen";

/** Milliseconds. Kept short: a title card, not a preloader. */
const HOLD_MS = 900;
const TOTAL_MS = 1650;

/**
 * The opening title card (PRD §6.1), set at dawn — the first hour of the page.
 *
 * Design decisions worth stating:
 * - It is **decorative and self-dismissing**. It lives outside the hidden
 *   `aria-hidden` layer only as a skip control, so assistive technology is never
 *   held hostage by an animation.
 * - It mounts on the client only. A visitor whose JavaScript fails sees the
 *   fully built page immediately, never a blank curtain.
 * - It plays at most once per session, and never at all under reduced motion.
 * - While it plays it sets `data-intro="playing"` on the root, which holds the
 *   hero's own kinetic reveal at its start state so the two animations read as
 *   one continuous gesture instead of happening underneath the curtain.
 * - Clicking, tapping, or pressing Escape/Enter/Space dismisses it immediately.
 */
export function IntroSequence({ onFinish }: { onFinish?: () => void }) {
  const [playing, setPlaying] = useState(false);
  const [lifting, setLifting] = useState(false);

  const releaseGate = useCallback(() => {
    if (typeof document !== "undefined") {
      delete document.documentElement.dataset.intro;
    }
  }, []);

  const finish = useCallback(() => {
    try {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // Storage may be unavailable; the intro simply plays again next time.
    }
    releaseGate();
    setPlaying(false);
    onFinish?.();
  }, [onFinish, releaseGate]);

  // Decide before the first paint whether to play at all.
  useIsomorphicLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let seen = false;
    try {
      seen = window.sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      seen = false;
    }

    if (reduced || seen) {
      setPlaying(false);
      onFinish?.();
      return;
    }

    document.documentElement.dataset.intro = "playing";
    setPlaying(true);
  }, [onFinish]);

  // Run the timeline.
  useEffect(() => {
    if (!playing) return;

    const liftTimer = window.setTimeout(() => setLifting(true), HOLD_MS);
    const doneTimer = window.setTimeout(finish, TOTAL_MS);

    return () => {
      window.clearTimeout(liftTimer);
      window.clearTimeout(doneTimer);
    };
  }, [playing, finish]);

  // Any deliberate input dismisses it.
  useEffect(() => {
    if (!playing) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setLifting(true);
        window.setTimeout(finish, 320);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [playing, finish]);

  // Never leave the hero gated if this unmounts mid-play.
  useEffect(() => releaseGate, [releaseGate]);

  useScrollLock(playing);

  if (!playing) return null;

  const lift = (direction: "up" | "down") => ({
    animate: lifting ? { y: direction === "up" ? "-101%" : "101%" } : { y: "0%" },
    transition: { duration: 0.78, ease: [0.76, 0, 0.24, 1] as const },
  });

  return (
    <>
      <div aria-hidden="true" className="fixed inset-0 z-[95] overflow-hidden">
        <motion.div
          {...lift("up")}
          data-hour="dawn"
          className="absolute inset-x-0 top-0 h-1/2"
          initial={{ y: "0%" }}
        />
        <motion.div
          {...lift("down")}
          data-hour="dawn"
          className="absolute inset-x-0 bottom-0 h-1/2"
          initial={{ y: "0%" }}
        />

        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center gap-5"
          animate={{ opacity: lifting ? 0 : 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
            className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-ivory/25"
          >
            <SunRing className="size-[clamp(9rem,26vw,16rem)]" fraction={0.62} />
          </motion.span>

          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
            className="font-display text-[clamp(2.75rem,9vw,6rem)] leading-none tracking-[0.12em] text-ivory uppercase"
          >
            {cafeConfig.name}
          </motion.span>

          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="h-px w-[min(18rem,60vw)] origin-center bg-terracotta"
          />

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="text-micro font-medium tracking-[0.38em] text-ivory/75 uppercase"
          >
            Coffee &amp; Slow Living
          </motion.span>
        </motion.div>
      </div>

      {/* Deliberately outside the aria-hidden layer so keyboard users can skip. */}
      <AnimatePresence>
        <button
          type="button"
          onClick={() => {
            setLifting(true);
            window.setTimeout(finish, 320);
          }}
          className="sr-only-focusable rounded-full bg-ivory px-5 py-3 text-sm font-medium text-espresso shadow-lg"
        >
          Skip intro
        </button>
      </AnimatePresence>
    </>
  );
}
