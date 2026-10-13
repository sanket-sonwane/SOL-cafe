import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { MaskedLines } from "@/components/animations/MaskedLines";

type Size = "display-1" | "display-2" | "display-3" | "title";

const SIZE_CLASSES: Record<Size, string> = {
  "display-1": "text-display-1",
  "display-2": "text-display-2",
  "display-3": "text-display-3",
  title: "text-title",
};

interface MaskedHeadingProps {
  lines: ReactNode[];
  as?: "h1" | "h2" | "h3" | "p";
  size?: Size;
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  /** Heading id, so a section can be labelled by it. */
  id?: string;
}

/**
 * A display heading whose lines rise into view.
 *
 * The visual treatment (serif, tight tracking, italic accents) comes from the
 * tokens; the caller supplies the line breaks, because line breaks in editorial
 * type are an art-direction decision rather than a wrapping coincidence.
 */
export function MaskedHeading({
  lines,
  as = "h2",
  size = "display-3",
  className,
  lineClassName,
  delay = 0,
  stagger = 90,
  id,
}: MaskedHeadingProps) {
  return (
    <MaskedLines
      as={as}
      id={id}
      lines={lines}
      delay={delay}
      stagger={stagger}
      className={cn(
        "font-display font-normal tracking-[-0.02em] text-balance",
        SIZE_CLASSES[size],
        className,
      )}
      lineClassName={cn("font-display", lineClassName)}
    />
  );
}
