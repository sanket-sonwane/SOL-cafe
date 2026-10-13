/**
 * A generic "camera in a rounded square" glyph, used in place of a brand icon.
 *
 * Current versions of lucide-react deliberately do not ship brand logos, and
 * reproducing Instagram's actual mark would be a trademark question rather than a
 * design one. This outline reads as "photographs" and inherits `currentColor`, so
 * it stays legible on light and dark surfaces alike.
 */
export function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
