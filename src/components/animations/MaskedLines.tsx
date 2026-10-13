import { isValidElement, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useReveal } from "@/hooks/useReveal";
import type { CSSVars } from "@/components/animations/Reveal";

interface MaskedLinesProps {
  /** One entry per visual line. Line breaks are intentional, not automatic. */
  lines: ReactNode[];
  className?: string;
  /** Applied to each line rather than the group — for per-line colour or weight. */
  lineClassName?: string;
  as?: ElementType;
  /** Delay before the first line moves, in milliseconds. */
  delay?: number;
  /** Delay added per line, in milliseconds. */
  stagger?: number;
  /** Override the transition duration, in milliseconds. */
  duration?: number;
  /** Optional id, so a section can reference the heading for labelling. */
  id?: string;
  /** Override the accessible name. Derived from the lines when not given. */
  srLabel?: string;
}

/**
 * The readable text of one line, skipping decorative (aria-hidden) subtrees.
 *
 * The visual line breaks are art direction — "A little / Slower." is one
 * sentence to a reader but four blocks in the DOM. Deriving an accessible name
 * from the lines means assistive technology announces the heading as the
 * sentence it actually is, rather than running the fragments together.
 */
function lineText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(lineText).join(" ");
  if (isValidElement(node)) {
    const props = node.props as { children?: ReactNode; "aria-hidden"?: boolean | string };
    if (props["aria-hidden"] === true || props["aria-hidden"] === "true") return "";
    return lineText(props.children);
  }
  return "";
}

/**
 * The editorial text reveal: each line sits inside an overflow-hidden container
 * and slides up from below it, staggered.
 *
 * A single IntersectionObserver watches the whole group and CSS staggers the
 * lines, so a 4-line headline costs one observer rather than four.
 */
export function MaskedLines({
  lines,
  className,
  lineClassName,
  as,
  delay = 0,
  stagger = 90,
  duration,
  id,
  srLabel,
}: MaskedLinesProps) {
  const ref = useReveal<HTMLElement>();
  const Tag = (as ?? "span") as ElementType;

  const groupStyle: CSSVars = {};
  if (duration) groupStyle["--reveal-duration"] = `${duration}ms`;

  const derivedLabel = lines
    .map(lineText)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  const accessibleLabel = (srLabel ?? derivedLabel) || undefined;

  return (
    <Tag
      ref={ref as never}
      id={id}
      className={className}
      data-reveal-lines="true"
      style={groupStyle}
      {...(accessibleLabel ? { "aria-label": accessibleLabel } : {})}
    >
      {lines.map((line, index) => (
        <span className="mask-line" key={index} aria-hidden={accessibleLabel ? true : undefined}>
          <span
            className={cn("block", lineClassName)}
            style={{ "--line-delay": `${delay + index * stagger}ms` } as CSSVars}
          >
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
