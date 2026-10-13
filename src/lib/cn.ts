/**
 * Joins conditional class names. Kept dependency-free: the project only needs
 * falsey filtering, not class merging, so Tailwind's own cascade is preserved.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
