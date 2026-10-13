import type { CSSProperties, ElementType, ReactNode } from "react";
import { useReveal } from "@/hooks/useReveal";

/** Style object that also accepts CSS custom properties. */
export type CSSVars = CSSProperties & Record<`--${string}`, string | number>;

interface RevealProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** Delay before the transition starts, in milliseconds. */
  delay?: number;
  /** Override the default travel distance. */
  distance?: "sm" | "default" | "lg";
  /** Override the transition duration, in milliseconds. */
  duration?: number;
}

/**
 * A single element that fades and drifts into view once scrolled to.
 *
 * The animation is a CSS transition (see styles/motion.css); this component only
 * supplies the observer and the timing custom properties. Use `Reveal` for
 * blocks and `MaskedLines` for display headings.
 */
export function Reveal({
  children,
  className,
  as,
  delay = 0,
  distance = "default",
  duration,
}: RevealProps) {
  const ref = useReveal<HTMLElement>();
  const Tag = (as ?? "div") as ElementType;

  const style: CSSVars = {};
  if (delay) style["--reveal-delay"] = `${delay}ms`;
  if (duration) style["--reveal-duration"] = `${duration}ms`;

  return (
    <Tag
      ref={ref as never}
      className={className}
      data-reveal="true"
      data-reveal-distance={distance === "default" ? undefined : distance}
      style={style}
    >
      {children}
    </Tag>
  );
}
