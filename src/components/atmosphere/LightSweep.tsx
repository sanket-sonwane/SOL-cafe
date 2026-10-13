import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/cn";

interface LightSweepProps {
  className?: string;
  /** The colour of the travelling light band. */
  color?: string;
  /** Where the band sits at the start and end of the element's transit. */
  from?: string;
  to?: string;
}

/**
 * A decorative band of light that drifts across a surface as it moves through
 * the viewport, so the eye reads a fixed photograph as lit by a passing sun
 * rather than as a flat fill.
 *
 * Driven by the element's own scroll progress, blended with `soft-light` so it
 * lifts the underlying image instead of washing it out. Purely decorative
 * (`aria-hidden`), and it fades to nothing under reduced motion via `.light-sweep`
 * in styles/motion.css.
 */
export function LightSweep({ className, color, from = "16%", to = "84%" }: LightSweepProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const lightX = useTransform(scrollYProgress, [0, 1], [from, to]);

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      className={cn("light-sweep pointer-events-none absolute inset-0", className)}
      style={
        {
          "--light-x": lightX,
          ...(color ? { "--light-color": color } : {}),
        } as never
      }
    />
  );
}
