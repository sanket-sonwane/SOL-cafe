import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const RADIUS = 46;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface SunRingProps {
  className?: string;
  /** Centred content — used to seat a section or chapter number in the ring. */
  children?: ReactNode;
  /** How much of the accent arc is drawn, 0–1. */
  fraction?: number;
  /** Adds the dot at the top of the ring, echoing the Ō in the wordmark. */
  dot?: boolean;
}

/**
 * The SŌL sun ring.
 *
 * A single drawn motif, not an illustration: a faint full circle with a partial
 * accent arc and the wordmark's dot, so the identity's one recurring graphic can
 * appear as a chapter marker, a section index or a decorative accent. Colour and
 * size come entirely from the caller (`currentColor` + a size class), so it
 * adopts the hour it is placed in.
 */
export function SunRing({ className, children, fraction = 0.72, dot = true }: SunRingProps) {
  return (
    <span className={cn("relative inline-grid place-items-center", className)}>
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
        focusable="false"
      >
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.22}
          strokeWidth={0.8}
        />
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeDasharray={`${(CIRCUMFERENCE * fraction).toFixed(2)} ${CIRCUMFERENCE.toFixed(2)}`}
          transform="rotate(-90 50 50)"
        />
        {dot && <circle cx="50" cy="4" r="2.8" fill="currentColor" />}
      </svg>

      {children && <span className="numeric relative">{children}</span>}
    </span>
  );
}
