import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "coffee" | "ivory" | "terracotta" | "espresso";

const TONE_CLASSES: Record<Tone, string> = {
  coffee: "text-coffee",
  ivory: "text-ivory/70",
  terracotta: "text-terracotta",
  espresso: "text-espresso/70",
};

interface EyebrowProps {
  children: ReactNode;
  className?: string;
  tone?: Tone;
  /** Optional leading rule — a small editorial detail used in several sections. */
  withRule?: boolean;
}

/**
 * The small uppercase label that precedes most headlines.
 *
 * Kept in the sans face with generous tracking: experimental typography is for
 * display type, never for labels that must stay legible. (PRD §7.4)
 */
export function Eyebrow({ children, className, tone = "coffee", withRule = false }: EyebrowProps) {
  return (
    <p
      className={cn(
        "flex items-center gap-3 text-eyebrow font-medium uppercase",
        TONE_CLASSES[tone],
        className,
      )}
    >
      {withRule && <span aria-hidden="true" className="h-px w-8 bg-current opacity-50" />}
      <span>{children}</span>
    </p>
  );
}
