import { cafeConfig, fullAddress } from "@/data/cafe";

/* ---------------------------------------------------------------------------
   Directions (PRD FR-06).
   A configured destination always wins; otherwise a directions search is built
   from the address. The visitor is always sent somewhere real and useful.
   --------------------------------------------------------------------------- */

export function buildDirectionsUrl(address: string = fullAddress): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
}

export function buildSearchUrl(address: string = fullAddress): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

/**
 * Only returns a URL if it looks like a safe absolute https link, so a bad
 * configuration value can never be rendered as a `javascript:` target. (PRD §14)
 */
export function safeExternalUrl(raw: string): string | null {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function getDirectionsUrl(): string {
  return safeExternalUrl(cafeConfig.googleMapsUrl) ?? buildDirectionsUrl();
}

export function getMapSearchUrl(): string {
  return buildSearchUrl();
}
