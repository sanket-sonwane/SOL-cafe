import type { CafeConfig, NavItem, OpeningHoursRow } from "@/types";

/* ---------------------------------------------------------------------------
   SŌL — business configuration
   ⚠️  DEMONSTRATION CONTENT. SŌL is a fictional café created for this design
   specification. Every value below is illustrative and must be replaced with
   verified business information before the site is used commercially.

   FR-11: this file is the single source of truth. Contact details, opening
   hours and map destinations are never duplicated inside components.
   --------------------------------------------------------------------------- */

export const cafeConfig: CafeConfig = {
  name: "SŌL",
  fullName: "SŌL — Coffee & Slow Living",
  tagline: "A little slower. A little better.",
  statement: "A neighbourhood café built around the beauty of slowing down.",

  addressLines: ["Ground Floor, 7 Anand Park", "Kalyani Nagar"],
  locality: "Kalyani Nagar",
  region: "Maharashtra",
  postalCode: "411006",
  country: "India",

  timeZone: "Asia/Kolkata",
  currency: "INR",

  /* Contact details. The WhatsApp number below is a real, reachable number and
     is the one destination that is *not* a placeholder; the phone display/href
     and email remain demonstration values and must be replaced with verified
     business information before commercial use. */
  whatsappNumber: "918468902367",
  phoneDisplay: "+91 00000 00000",
  phoneHref: "+910000000000",
  email: "hello@sol-cafe.example",

  /* Placeholder social + map destinations. The Instagram value resolves to the
     platform rather than impersonating an existing profile; the map value is a
     genuine directions search for the address above. Both are easy to swap. */
  instagramUrl: "https://www.instagram.com/",
  googleMapsUrl: "https://www.google.com/maps/dir/?api=1&destination=Kalyani+Nagar%2C+Pune%2C+Maharashtra+411006",

  reservationEnabled: true,
  reservationMaxPartySize: 12,
  isDemoContent: true,
};

/* --- Contact display helpers --------------------------------------------- */

/** Single-line address, e.g. for meta descriptions and structured data. */
export const fullAddress = [
  ...cafeConfig.addressLines,
  cafeConfig.locality,
  `${cafeConfig.region} ${cafeConfig.postalCode}`,
  cafeConfig.country,
].join(", ");

/** Postal address in the shape expected by schema.org PostalAddress. */
export const postalAddress = {
  streetAddress: cafeConfig.addressLines.join(", "),
  addressLocality: cafeConfig.locality,
  addressRegion: cafeConfig.region,
  postalCode: cafeConfig.postalCode,
  addressCountry: "IN",
} as const;

/* --- Opening hours --------------------------------------------------------
   A static, verified schedule is deliberately preferred over an inaccurate
   live open/closed badge. (PRD §6.10)

   0 = Sunday … 6 = Saturday.
   ------------------------------------------------------------------------- */

export const openingHours: OpeningHoursRow[] = [
  {
    id: "weekdays",
    label: "Monday – Friday",
    days: [1, 2, 3, 4, 5],
    intervals: [{ opens: "08:00", closes: "22:00" }],
  },
  {
    id: "weekend",
    label: "Saturday – Sunday",
    days: [6, 0],
    intervals: [{ opens: "08:30", closes: "23:00" }],
  },
];

/* --- Navigation ------------------------------------------------------------
   Labels stay plain and legible; the expressive typography lives elsewhere.
   (PRD §5.2)
   ------------------------------------------------------------------------- */

export const primaryNav: NavItem[] = [
  { id: "story", label: "Our story", href: "#story" },
  { id: "menu", label: "Menu", href: "#menu" },
  { id: "space", label: "The space", href: "#space" },
];

export const footerNav: NavItem[] = [
  { id: "story", label: "Our story", href: "#story" },
  { id: "menu", label: "Menu", href: "#menu" },
  { id: "space", label: "The space", href: "#space" },
  { id: "people", label: "The people", href: "#people" },
  { id: "visit", label: "Visit us", href: "#visit" },
  { id: "reserve", label: "Reservations", href: "#reserve" },
];
