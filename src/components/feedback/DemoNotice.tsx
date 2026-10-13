import { Info } from "lucide-react";
import { cn } from "@/lib/cn";
import { cafeConfig } from "@/data/cafe";

/**
 * A visible notice that the business information on this site is fictional.
 *
 * Every contact detail, opening time and address in this build is demonstration
 * content for a fictional café. Rather than hide that in a code comment, it is
 * surfaced wherever a visitor might act on it — so nobody mistakes a placeholder
 * WhatsApp number or address for a real one. (PRD §2, §10.4, §16)
 *
 * The notice is driven by `cafeConfig.isDemoContent`, so it removes itself from
 * every surface the moment the café's real details are dropped in. Callers can
 * therefore include it unconditionally and never have to remember to take it out.
 */
export function DemoNotice({ className, compact = false }: { className?: string; compact?: boolean }) {
  if (!cafeConfig.isDemoContent) return null;

  return (
    <p
      className={cn(
        "flex items-start gap-2.5 text-caption leading-relaxed text-current/70",
        className,
      )}
    >
      <Info aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
      <span>
        {compact ? (
          <>Demo details — not a real café.</>
        ) : (
          <>
            This is a demonstration site. SŌL is a fictional café, and every contact
            detail, address and opening time shown is placeholder content.
          </>
        )}
      </span>
    </p>
  );
}
