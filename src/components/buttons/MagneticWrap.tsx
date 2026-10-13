import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useFinePointer, usePrefersReducedMotion } from "@/hooks/useMediaQuery";

interface MagneticWrapProps {
  children: ReactNode;
  /** Maximum travel in pixels. Deliberately small. */
  strength?: number;
  className?: string;
}

/**
 * Animation E — a magnetic, pointer-responsive action (PRD §7.3).
 *
 * The wrapper moves a few pixels toward the pointer, which reads as the button
 * "reaching" for the cursor. It is enabled only when all of the following hold:
 *   - the device has a precise pointer that can hover (never touch);
 *   - the visitor has not requested reduced motion.
 *
 * The travel is capped so the button can never drift away from where the visitor
 * expects to click, and an ordinary hover/press state remains sufficient on its
 * own. Initial state is untransformed, so server rendering is unaffected.
 */
export function MagneticWrap({ children, strength = 12, className }: MagneticWrapProps) {
  const hasFinePointer = useFinePointer();
  const prefersReducedMotion = usePrefersReducedMotion();
  const enabled = hasFinePointer && !prefersReducedMotion;

  const containerRef = useRef<HTMLSpanElement | null>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 220, damping: 22, mass: 0.4 });
  const y = useSpring(rawY, { stiffness: 220, damping: 22, mass: 0.4 });

  const handlePointerMove = (event: React.PointerEvent<HTMLSpanElement>) => {
    if (!enabled) return;
    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) return;

    // Offset from centre, normalised to -1…1, then scaled.
    const offsetX = (event.clientX - (bounds.left + bounds.width / 2)) / (bounds.width / 2);
    const offsetY = (event.clientY - (bounds.top + bounds.height / 2)) / (bounds.height / 2);

    rawX.set(Math.max(-1, Math.min(1, offsetX)) * strength);
    rawY.set(Math.max(-1, Math.min(1, offsetY)) * strength);
  };

  const reset = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.span
      ref={containerRef}
      className={className}
      style={{ x, y, display: "inline-block" }}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      onBlur={reset}
    >
      {children}
    </motion.span>
  );
}
