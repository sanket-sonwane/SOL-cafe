import { cn } from "@/lib/cn";

/**
 * Keyboard users land here first. Positioned off-screen until focused, then
 * pinned to the top-left corner (see the `sr-only-focusable` utility).
 */
export function SkipLink({ targetId = "main" }: { targetId?: string }) {
  return (
    <a
      href={`#${targetId}`}
      className={cn(
        "sr-only-focusable rounded-full bg-espresso px-5 py-3 text-sm font-medium text-ivory",
        "shadow-lg",
      )}
    >
      Skip to content
    </a>
  );
}
