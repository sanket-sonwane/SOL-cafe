import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useFinePointer, usePrefersReducedMotion } from "@/hooks/useMediaQuery";

/** Anything the visitor can act on — the ring responds to all of it. */
const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, select, textarea, summary, [data-cursor-label]';

/**
 * A pointer accent: a small terracotta ring with a soft, warm presence glow that
 * trails the cursor and opens up over anything interactive.
 *
 * Deliberately restrained and entirely optional:
 *  - it never replaces the native cursor, so the visitor's expected pointer is
 *    always where they left it (the PRD forbids moving a target away from the
 *    expected click location);
 *  - it runs only on a precise, hovering pointer and only without reduced motion;
 *  - it is `pointer-events: none`, decorative and `aria-hidden`;
 *  - it renders nothing at all on the server or on touch, so it cannot shift the
 *    layout or interfere with a tap.
 */
export function CursorAccent() {
  const hasFinePointer = useFinePointer();
  const prefersReducedMotion = usePrefersReducedMotion();
  const enabled = hasFinePointer && !prefersReducedMotion;

  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const springX = useSpring(x, { stiffness: 460, damping: 42, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 460, damping: 42, mass: 0.5 });

  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const handleMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };

    const handleOver = (event: PointerEvent) => {
      const target = event.target as Element | null;
      setHovering(Boolean(target?.closest(INTERACTIVE_SELECTOR)));
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("pointerover", handleOver, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerover", handleOver);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[80]"
      style={{ x: springX, y: springY }}
    >
      <motion.span
        className="absolute rounded-full"
        style={{
          width: 340,
          height: 340,
          marginLeft: -170,
          marginTop: -170,
          background: "radial-gradient(circle, rgba(255, 214, 150, 0.22), transparent 62%)",
          mixBlendMode: "soft-light",
        }}
        animate={{ opacity: hovering ? 0.9 : 0.5, scale: hovering ? 1.06 : 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      />

      <motion.span
        className="absolute rounded-full border border-terracotta/70"
        style={{ width: 24, height: 24, marginLeft: -12, marginTop: -12 }}
        animate={{
          scale: hovering ? 1.9 : 1,
          opacity: hovering ? 1 : 0.55,
        }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      />
    </motion.div>
  );
}
