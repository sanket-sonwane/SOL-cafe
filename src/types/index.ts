/* ---------------------------------------------------------------------------
   SŌL — shared domain types
   The data model is intentionally explicit about what is *not* known
   (dietary claims, availability, live opening status) so the UI can never
   invent business facts. See PRD §6.6, §6.10 and §10.3.
   --------------------------------------------------------------------------- */

import type { ImageKey } from "@/data/images";

/* --- Imagery -------------------------------------------------------------- */

/**
 * A responsive image produced by scripts/optimize-images.mjs.
 * Technical attributes only; copy and alt text live in the data files so the
 * same photograph can be reused with different, context-appropriate alt text.
 */
export interface ResponsiveImage {
  /** Smallest generated width — the `src` fallback. */
  src: string;
  /** WebP candidates for `srcset`. */
  srcSet: string;
  /** AVIF candidates for `<source type="image/avif">`. */
  avifSrcSet: string;
  /** Intrinsic dimensions of the largest generated file, for aspect-ratio boxes. */
  width: number;
  height: number;
  aspectRatio: number;
  /** Tiny inline placeholder (LQIP) used behind the photograph while it loads. */
  placeholder: string;
}

export type ImageManifest = Record<string, ResponsiveImage>;

/* --- Menu ----------------------------------------------------------------- */

export type MenuCategory = "coffee" | "tea" | "cold-drinks" | "food" | "desserts";

/** Editorial badges. `signature` is an SŌL house designation, not a claim. */
export type MenuBadge = "bestseller" | "signature" | "seasonal" | "new";

/**
 * Dietary labels must come from verified café information. The renderer only
 * ever displays what is present here — it never infers anything from a name.
 */
export type DietaryLabel = "vegetarian" | "vegan" | "contains-nuts" | "gluten-free" | "contains-dairy" | "egg";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  /** Price in whole Indian rupees. */
  price: number;
  category: MenuCategory;
  /** Key into the generated image manifest; absent means "no photograph yet". */
  imageKey?: ImageKey;
  dietaryLabels: DietaryLabel[];
  badges: MenuBadge[];
  /** Shown in the large featured tile of the editorial menu grid. */
  isFeatured: boolean;
  /** Shown in the seasonal strip when true and isAvailable is true. */
  isSeasonal: boolean;
  /**
   * The café maintains this. Unavailable items are rendered with an explicit
   * "Currently unavailable" state, never as a broken card. (PRD §6.6)
   */
  isAvailable: boolean;
  /** Optional short explanation shown with an unavailable item. */
  availabilityNote?: string;
}

/* --- Story ---------------------------------------------------------------- */

export interface StoryChapter {
  id: string;
  /** "01", "02", "03" — an editorial marker, not a semantic list index. */
  index: string;
  title: string;
  body: string;
  imageKey: ImageKey;
  imageAlt: string;
}

/* --- Gallery -------------------------------------------------------------- */

export interface GalleryImage {
  id: string;
  imageKey: ImageKey;
  alt: string;
  caption: string;
  /** Presentation hint for the asymmetric editorial grid. */
  span: "tall" | "wide" | "regular" | "feature";
}

/* --- Business information ------------------------------------------------- */

export interface OpeningInterval {
  /** 24-hour "HH:MM" in the café's local time zone. */
  opens: string;
  closes: string;
}

export interface OpeningHoursRow {
  id: string;
  /** Human label, e.g. "Monday – Friday". */
  label: string;
  /** 0 = Sunday … 6 = Saturday. Used only for accessible descriptions. */
  days: number[];
  /** One or more intervals per day, so split hours are representable. */
  intervals: OpeningInterval[];
}

export interface NavItem {
  id: string;
  label: string;
  href: `#${string}`;
}

export interface SocialLink {
  id: string;
  label: string;
  /** Empty string means "not configured" — the link is omitted, never faked. */
  url: string;
}

export interface CafeConfig {
  name: string;
  fullName: string;
  tagline: string;
  /** One-line editorial positioning statement. */
  statement: string;
  addressLines: string[];
  locality: string;
  region: string;
  postalCode: string;
  country: string;
  /** IANA time zone; used by any future live-status feature. */
  timeZone: string;
  currency: "INR";
  /** Digits only, international format. Empty means "not configured". */
  whatsappNumber: string;
  /** Human-formatted contact number for display and call fallback. */
  phoneDisplay: string;
  /** Digits only, for tel: links. */
  phoneHref: string;
  email: string;
  instagramUrl: string;
  /** Verified Google Maps destination; empty means "not configured". */
  googleMapsUrl: string;
  reservationEnabled: boolean;
  reservationMaxPartySize: number;
  /**
   * True while this repository ships demonstration content. Surfaced in the UI
   * and in generated metadata so fictional details are never mistaken for fact.
   */
  isDemoContent: boolean;
}

/* --- Reservation enquiry -------------------------------------------------- */

export interface ReservationDraft {
  name: string;
  partySize: string;
  date: string;
  time: string;
  contact: string;
  notes: string;
}

export type ReservationField = keyof ReservationDraft;

export type ReservationErrors = Partial<Record<ReservationField, string>>;

export interface ReservationValidation {
  valid: boolean;
  errors: ReservationErrors;
}
