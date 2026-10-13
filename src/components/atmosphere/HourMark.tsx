import { cn } from "@/lib/cn";
import { SunRing } from "@/components/atmosphere/SunRing";

interface HourMarkProps {
  /** The time this section sits at, e.g. "08:10". */
  time: string;
  /** The section's label — the line the eyebrow used to carry. */
  label: string;
  className?: string;
}

/**
 * A section marker for the solar arc: the identity's ring, holding the time of
 * day the section sits at, followed by the section's label.
 *
 * This replaces the plain eyebrow-plus-rule that ran through most sections, and
 * is the thread that ties the page together — every section states its hour, so
 * the visitor can feel the day moving as they scroll.
 */
export function HourMark({ time, label, className }: HourMarkProps) {
  return (
    <p className={cn("flex items-center gap-3.5", className)}>
      <SunRing
        className="size-12 shrink-0 text-[0.68rem] tracking-[0.12em]"
        fraction={0.68}
      >
        {time}
      </SunRing>
      <span className="text-eyebrow font-medium tracking-[0.22em] uppercase">{label}</span>
    </p>
  );
}
