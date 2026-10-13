import { BADGE_LABELS } from "@/data/menu";
import type { MenuBadge } from "@/types";
import { cn } from "@/lib/cn";

const BADGE_CLASSES: Record<MenuBadge, string> = {
  bestseller: "bg-terracotta text-cream",
  signature: "bg-espresso text-ivory",
  seasonal: "bg-olive text-cream",
  new: "bg-coffee text-cream",
};

/**
 * Editorial badges only.
 *
 * These describe the café's own merchandising (a bestseller, a house signature,
 * a seasonal special). They are never used to imply a dietary or health claim.
 */
export function MenuBadgePill({ badge, className }: { badge: MenuBadge; className?: string }) {
  const label = BADGE_LABELS[badge];
  if (!label) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[0.625rem] font-medium tracking-[0.14em] uppercase",
        BADGE_CLASSES[badge],
        className,
      )}
    >
      {label}
    </span>
  );
}

export function MenuBadges({ badges, className }: { badges: MenuBadge[]; className?: string }) {
  if (badges.length === 0) return null;

  return (
    <ul className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {badges.map((badge) => (
        <li key={badge}>
          <MenuBadgePill badge={badge} />
        </li>
      ))}
    </ul>
  );
}
