import { cafeConfig, fullAddress, openingHours, postalAddress } from "@/data/cafe";
import { formatTime } from "@/lib/format";

/* ---------------------------------------------------------------------------
   SEO / structured data (PRD §12.3).

   Everything is derived from cafeConfig, so structured data can never drift away
   from what the page actually shows. While `isDemoContent` is true the markup is
   still emitted (it is accurate for this demonstration site) but the café is
   clearly described as a demonstration.
   --------------------------------------------------------------------------- */

/**
 * The site's canonical origin.
 *
 * Resolved from the same build-time `VITE_SITE_URL` the static tags use, so the
 * structured data, `<link rel="canonical">`/OG tags and the sitemap all describe
 * one host. Reading it here (rather than leaving the placeholder hard-coded) also
 * keeps the client bundle in step with the prerendered HTML, so hydration has
 * nothing to disagree about. `scripts/site-url.mjs` substitutes the static tags;
 * the fallback below is the reserved placeholder for an unconfigured build.
 */
const SITE_ORIGIN = (
  (import.meta.env.VITE_SITE_URL as string | undefined) ?? "https://sol-cafe.example"
).replace(/\/+$/, "");

const DAY_SCHEMA = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export function buildOpeningHoursSpecification() {
  return openingHours.flatMap((row) =>
    row.days.flatMap((day) =>
      row.intervals.map((interval) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: `https://schema.org/${DAY_SCHEMA[day]}`,
        opens: formatTime(interval.opens),
        closes: formatTime(interval.closes),
      })),
    ),
  );
}

export function buildStructuredData() {
  const sameAs = [cafeConfig.instagramUrl].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    name: cafeConfig.fullName,
    alternateName: cafeConfig.name,
    slogan: cafeConfig.tagline,
    description: cafeConfig.statement,
    url: `${SITE_ORIGIN}/`,
    telephone: cafeConfig.phoneDisplay,
    email: cafeConfig.email,
    priceRange: "₹₹",
    currenciesAccepted: "INR",
    address: {
      "@type": "PostalAddress",
      ...postalAddress,
    },
    geo: {
      // Approximate locality coordinates; replace with the verified position.
      "@type": "GeoCoordinates",
      latitude: 18.5463,
      longitude: 73.9033,
    },
    hasMap: cafeConfig.googleMapsUrl || undefined,
    openingHoursSpecification: buildOpeningHoursSpecification(),
    sameAs: sameAs.length > 0 ? sameAs : undefined,
    servesCuisine: ["Coffee", "Café", "Breakfast", "Desserts"],
    image: `${SITE_ORIGIN}/og-image.webp`,
    isAccessibleForFree: true,
    ...(cafeConfig.isDemoContent
      ? {
          disambiguatingDescription:
            "Demonstration content for a fictional café created as a design specification. Not a real business.",
        }
      : {}),
  };
}

/** Human-readable address, reused by meta tags and the footer. */
export const siteDescription = `${cafeConfig.statement} ${cafeConfig.tagline}`;

export { fullAddress };
