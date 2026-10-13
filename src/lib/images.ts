import { images, type ImageKey } from "@/data/images";
import type { ResponsiveImage } from "@/types";

/* ---------------------------------------------------------------------------
   Image manifest access.

   `ImageKey` is derived from the generated manifest, so a typo in a data file is
   a compile error rather than a silently missing photograph. The lookup stays
   defensive anyway: a key can be absent at runtime if the manifest is regenerated
   while older data is in the tree, and a missing photograph must never leave a
   hole in the layout.
   --------------------------------------------------------------------------- */

const manifest: Record<string, ResponsiveImage> = images;

export function getImage(key: ImageKey | undefined): ResponsiveImage | undefined {
  if (!key) return undefined;
  return manifest[key];
}

/** True when a photograph exists for the given key. */
export function hasImage(key: ImageKey | undefined): boolean {
  return getImage(key) !== undefined;
}

/**
 * A neutral, on-brand gradient used whenever a photograph is missing or fails
 * to load, so a broken image can never leave a hole in the layout. (PRD FR-04)
 */
export const IMAGE_FALLBACK_GRADIENT =
  "linear-gradient(135deg, #e9e0d3 0%, #d8ccbe 45%, #a98e77 100%)";
