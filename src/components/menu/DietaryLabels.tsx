import { DIETARY_LABELS } from "@/data/menu";
import type { DietaryLabel } from "@/types";
import { cn } from "@/lib/cn";

/**
 * Dietary chips.
 *
 * Labels are rendered strictly from the item's own verified data. An unknown
 * value is dropped rather than guessed at, and when an item carries no labels
 * nothing is rendered at all — silence is more honest than a made-up claim.
 * (PRD §6.6)
 */
export function DietaryLabels({
  labels,
  className,
  tone = "default",
}: {
  labels: DietaryLabel[];
  className?: string;
  tone?: "default" | "muted";
}) {
  const known = labels.filter((label) => DIETARY_LABELS[label]);
  if (known.length === 0) return null;

  return (
    <ul className={cn("flex flex-wrap items-center gap-x-3 gap-y-1", className)}>
      {known.map((label) => (
        <li
          key={label}
          className={cn(
            "flex items-center gap-1.5 text-caption",
            tone === "muted" ? "text-current/70" : "text-coffee",
          )}
        >
          <span aria-hidden="true" className="size-1 rounded-full bg-current opacity-60" />
          {DIETARY_LABELS[label]}
        </li>
      ))}
    </ul>
  );
}

/**
 * The explicit unavailable state. Used wherever an item cannot currently be
 * served, so the menu never presents a sold-out item as available. (PRD §6.6)
 */
export function UnavailableNote({ note, className }: { note?: string; className?: string }) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-espresso/8 px-3 py-1 text-caption font-medium text-espresso/75",
        className,
      )}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-terracotta" />
      Currently unavailable{note ? ` · ${note}` : ""}
    </p>
  );
}
