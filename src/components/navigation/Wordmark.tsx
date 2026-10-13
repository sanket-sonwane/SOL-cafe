import type { ElementType } from "react";
import { cn } from "@/lib/cn";
import { cafeConfig } from "@/data/cafe";

type Size = "sm" | "md" | "lg" | "xl";

const SIZE_CLASSES: Record<Size, string> = {
  sm: "text-[1.15rem] tracking-[0.16em]",
  md: "text-[1.5rem] tracking-[0.14em]",
  lg: "text-[2.25rem] tracking-[0.1em]",
  xl: "text-[clamp(3.5rem,14vw,13rem)] tracking-[0.06em] leading-[0.85]",
};

interface WordmarkProps {
  className?: string;
  size?: Size;
  as?: ElementType;
  /** Adds the brand line beneath the mark. Never used on the oversized footer mark. */
  showSubline?: boolean;
}

/**
 * The SŌL mark.
 *
 * The final letter carries a small terracotta dot — a coffee-ring reference that
 * is the one recurring decorative motif in the identity. It is drawn as text so
 * it scales and colours automatically, and it is hidden from assistive
 * technology because the mark is announced by its accessible name.
 */
export function Wordmark({ className, size = "md", as, showSubline = false }: WordmarkProps) {
  const Tag = (as ?? "span") as ElementType;

  return (
    <Tag className={cn("inline-flex flex-col items-start", className)}>
      <span
        className={cn("font-display font-normal uppercase leading-none", SIZE_CLASSES[size])}
        aria-label={cafeConfig.name}
      >
        <span aria-hidden="true">SŌL</span>
        <span
          aria-hidden="true"
          className="ml-[0.06em] inline-block h-[0.14em] w-[0.14em] rounded-full bg-terracotta align-baseline"
        />
      </span>
      {showSubline && (
        <span
          aria-hidden="true"
          className="mt-1 text-[0.5rem] font-medium tracking-[0.34em] text-current/70 uppercase"
        >
          Coffee &amp; Slow Living
        </span>
      )}
    </Tag>
  );
}
