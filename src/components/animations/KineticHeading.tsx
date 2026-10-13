import { Fragment, type ElementType } from "react";
import { cn } from "@/lib/cn";
import { useReveal } from "@/hooks/useReveal";
import type { CSSVars } from "@/components/animations/Reveal";

/** One visual line. A bare string is split into words on whitespace. */
export type KineticLine = string | { text: string; className?: string };

interface KineticHeadingProps {
  lines: KineticLine[];
  as?: ElementType;
  id?: string;
  className?: string;
  /** Delay before the first word moves, in milliseconds. */
  delay?: number;
  /** Added per word, so the words cascade across the whole headline. */
  stagger?: number;
  /** Override the transition duration, in milliseconds. */
  duration?: number;
}

/**
 * Animation A — kinetic hero typography (PRD §7.3).
 *
 * The headline enters **word by word**: every word sits in its own clipping
 * container and rises out of it, and the delay runs continuously across the line
 * breaks so the phrase arrives as one gesture rather than four separate ones.
 * The line breaks themselves are art direction and are supplied by the caller.
 *
 * The accessible name is derived from the words, because the visual line breaks
 * would otherwise be announced as fragments — the mask containers and their
 * contents are hidden from assistive technology in favour of that name.
 */
export function KineticHeading({
  lines,
  as = "h2",
  id,
  className,
  delay = 0,
  stagger = 70,
  duration,
}: KineticHeadingProps) {
  const ref = useReveal<HTMLElement>();
  const Tag = as as ElementType;

  const accessibleLabel = lines
    .map((line) => (typeof line === "string" ? line : line.text))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  const groupStyle: CSSVars = {};
  if (duration) groupStyle["--kinetic-duration"] = `${duration}ms`;

  let wordIndex = 0;

  return (
    <Tag
      ref={ref as never}
      id={id}
      data-kinetic="true"
      aria-label={accessibleLabel}
      style={groupStyle}
      className={className}
    >
      {lines.map((line, lineIndex) => {
        const text = typeof line === "string" ? line : line.text;
        const lineClassName = typeof line === "string" ? undefined : line.className;
        const words = text.split(/\s+/).filter(Boolean);

        return (
          <span key={lineIndex} className={cn("block", lineClassName)} aria-hidden="true">
            {words.map((word, index) => {
              const wordDelay = delay + wordIndex * stagger;
              wordIndex += 1;

              return (
                <Fragment key={`${word}-${index}`}>
                  {index > 0 && " "}
                  <span
                    className="kinetic-word"
                    style={{ "--word-delay": `${wordDelay}ms` } as CSSVars}
                  >
                    <span>{word}</span>
                  </span>
                </Fragment>
              );
            })}
          </span>
        );
      })}
    </Tag>
  );
}
