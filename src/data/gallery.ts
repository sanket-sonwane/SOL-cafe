import type { ImageKey } from "@/data/images";
import type { GalleryImage } from "@/types";

/* ---------------------------------------------------------------------------
   The space — a curated gallery (PRD §6.8).

   `span` is a presentation hint for the asymmetric editorial grid on desktop; on
   small screens every item collapses to a comfortable single column so nothing
   is ever cropped into illegibility.

   Each photograph carries its own alt text describing what is actually in the
   frame. (PRD §12.2)

   ⚠️  DEMONSTRATION CONTENT.
   --------------------------------------------------------------------------- */

export const galleryImages: GalleryImage[] = [
  {
    id: "interior",
    imageKey: "gallery-interior",
    alt: "A café room with tables, chairs and a counter at the far end",
    caption: "The main room",
    span: "feature",
  },
  {
    id: "seating",
    imageKey: "gallery-seating",
    alt: "A café interior with green upholstered chairs beside tall windows",
    caption: "The window corner",
    span: "tall",
  },
  {
    id: "counter",
    imageKey: "gallery-counter",
    alt: "A barista working at a steaming espresso machine behind the counter",
    caption: "The bar",
    span: "regular",
  },
  {
    id: "light",
    imageKey: "gallery-light",
    alt: "Outdoor café tables under warm evening lighting",
    caption: "Evenings outside",
    span: "wide",
  },
  {
    id: "drinks",
    imageKey: "gallery-drinks",
    alt: "A cup of coffee on a wooden table, photographed from above",
    caption: "One table, one cup",
    span: "regular",
  },
  {
    id: "texture",
    imageKey: "gallery-texture",
    alt: "A close view of freshly roasted coffee beans",
    caption: "This week's roast",
    span: "tall",
  },
  {
    id: "people",
    imageKey: "gallery-people",
    alt: "A person seated at a café table with a drink in front of them",
    caption: "Long conversations",
    span: "regular",
  },
  {
    id: "detail",
    imageKey: "gallery-detail",
    alt: "A cup of coffee resting on an open book beside a window",
    caption: "Stay a little longer",
    span: "regular",
  },
];

/** The two portraits used by the "people behind SŌL" section. */
export const teamImages: {
  id: string;
  imageKey: ImageKey;
  alt: string;
  role: string;
}[] = [
  {
    id: "barista",
    imageKey: "team-barista",
    alt: "A person in an apron working behind a café counter",
    role: "Head barista",
  },
  {
    id: "counter",
    imageKey: "team-kitchen",
    alt: "A glass display case filled with cakes and small pastries",
    role: "The pastry counter",
  },
];
