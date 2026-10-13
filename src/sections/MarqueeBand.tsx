import { cn } from "@/lib/cn";
import { Marquee } from "@/components/animations/Marquee";
import { SunRing } from "@/components/atmosphere/SunRing";
import type { Hour } from "@/components/layout/Section";

interface MarqueeBandProps {
  message: string;
  /** `light` on ivory/cream surfaces, `dark` on espresso surfaces. */
  tone?: "light" | "dark";
  /** Optional hour surface — lets the strip change light with the rest of the page. */
  hour?: Hour;
  className?: string;
}

/**
 * Animation D — the kinetic editorial strip (PRD §7.3).
 *
 * Used sparingly, between major sections only. A thin rule above and below keeps
 * it reading as an editorial band rather than a loose ribbon of text, and the
 * sun — the one motif — is drawn at each end as a fixed point the phrase travels
 * between. The strip pauses on hover or focus and stops entirely under reduced
 * motion (see styles/motion.css), where it resolves to a single static line.
 */
export function MarqueeBand({ message, tone = "light", hour, className }: MarqueeBandProps) {
  const isDark = tone === "dark";

  return (
    <div
      data-hour={hour}
      className={cn(
        "relative isolate overflow-hidden border-y py-5 md:py-6",
        hour ? "" : isDark ? "bg-espresso" : "bg-ivory",
        isDark ? "border-ivory/12 text-ivory" : "border-taupe/60 text-espresso",
        className,
      )}
    >
      <SunRing
        className="pointer-events-none absolute top-1/2 -left-10 size-24 -translate-y-1/2 opacity-25"
        fraction={0.6}
      />
      <SunRing
        className="pointer-events-none absolute top-1/2 -right-10 size-24 -translate-y-1/2 opacity-25"
        fraction={0.6}
        dot={false}
      />

      <Marquee message={message} />
    </div>
  );
}

/** The phrase the PRD specifies for the primary band. */
export const PRIMARY_MARQUEE = "GOOD COFFEE · SLOW MORNINGS · STAY A LITTLE LONGER";
