import { useState } from "react";
import { galleryImages } from "@/data/gallery";
import { Section } from "@/components/layout/Section";
import { MaskedHeading } from "@/components/typography/MaskedHeading";
import { Reveal } from "@/components/animations/Reveal";
import { HourMark } from "@/components/atmosphere/HourMark";
import { SunRing } from "@/components/atmosphere/SunRing";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { Lightbox } from "@/components/gallery/Lightbox";

/**
 * Section H — the space (PRD §6.8), at 18:50. Dusk: the last warm light of the
 * day, which is exactly when the room looks best.
 *
 * The PRD specifies a curated set of six to ten photographs in an asymmetric
 * editorial grid with a lightbox. The grid itself lives in `GalleryGrid` and the
 * viewer in `Lightbox`; this section owns only the framing, the hour, and the
 * open index.
 */
export function AtmosphereGallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <Section
      id="space"
      tone="ivory"
      hour="dusk"
      labelledBy="space-heading"
      className="overflow-x-clip"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        {/* The sun going down behind the room. */}
        <div className="sun-disc absolute -bottom-[26%] left-[8%] size-[clamp(14rem,38vw,34rem)] rounded-full bg-[radial-gradient(circle,rgba(226,138,98,0.55),rgba(176,104,120,0.28)_45%,transparent_72%)] opacity-70 blur-[54px]" />
        <SunRing
          className="absolute -top-[12%] -left-[10%] size-[38vw] text-espresso/[0.06]"
          fraction={0.5}
        />
      </div>

      <div className="container-sol">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal className="flex flex-col gap-6">
            <HourMark time="18:50" label="The space" className="text-coffee" />
            <MaskedHeading
              id="space-heading"
              as="h2"
              size="display-2"
              lines={["THE ROOM,", "AS YOU'LL", <em className="accent-italic">find it.</em>]}
              className="max-w-[13ch]"
            />
          </Reveal>

          <Reveal delay={140} className="max-w-sm md:pb-2">
            <p className="text-espresso/75">
              Photographs from an ordinary evening — nothing restyled, no doors closed for the
              camera. What you see is what will be waiting for you.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 md:mt-16">
          <GalleryGrid images={galleryImages} onOpen={setOpenIndex} />
        </div>

        <Reveal delay={120} className="mt-8">
          <p className="text-caption text-espresso/70">
            Tap any photograph to see it full size. Use the arrow keys or the on-screen controls to
            move between them, and Escape to close.
          </p>
        </Reveal>
      </div>

      <Lightbox
        images={galleryImages}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onChange={setOpenIndex}
      />
    </Section>
  );
}
