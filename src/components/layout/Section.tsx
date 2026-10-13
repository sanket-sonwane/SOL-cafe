import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "ivory" | "cream" | "sand" | "espresso" | "ink";

/** The hour a section sits at — see the solar arc in styles/globals.css. */
export type Hour =
  | "dawn"
  | "morning"
  | "noon"
  | "afternoon"
  | "golden"
  | "dusk"
  | "evening"
  | "night"
  | "deep-night";

const TONE_BG: Record<Tone, string> = {
  ivory: "bg-ivory",
  cream: "bg-cream",
  sand: "bg-sand",
  espresso: "bg-espresso",
  ink: "bg-ink",
};

const TONE_TEXT: Record<Tone, string> = {
  ivory: "text-espresso",
  cream: "text-espresso",
  sand: "text-espresso",
  espresso: "text-ivory",
  ink: "text-ivory",
};

interface SectionProps {
  id: string;
  children: ReactNode;
  className?: string;
  /** Foreground tone (text colour and focus-ring treatment). */
  tone?: Tone;
  /**
   * The hour of the page this section sits at. When given, it supplies the
   * background surface instead of `tone`, so the section is lit by the sun
   * rather than filled with a flat colour. (See the solar arc in globals.css.)
   */
  hour?: Hour;
  /** Id of the heading that names this section, for `aria-labelledby`. */
  labelledBy?: string;
}

/**
 * A landmark section with a consistent vertical rhythm.
 *
 * `isolate` is load-bearing: it makes the section its own stacking context so
 * decorative children placed at a negative z-index (light sweeps, background
 * washes) sit above the section's own surface but beneath its content, instead
 * of slipping behind an ancestor's background.
 */
export function Section({ id, children, className, tone = "ivory", hour, labelledBy }: SectionProps) {
  const isDark = tone === "espresso" || tone === "ink";

  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      data-hour={hour}
      className={cn(
        "relative isolate section-y",
        TONE_TEXT[tone],
        !hour && TONE_BG[tone],
        isDark && "on-dark",
        className,
      )}
    >
      {children}
    </section>
  );
}
