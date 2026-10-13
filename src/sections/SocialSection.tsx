import { InstagramGlyph } from "@/components/icons/SocialIcons";
import { cafeConfig } from "@/data/cafe";
import type { ImageKey } from "@/data/images";
import { cn } from "@/lib/cn";
import { getImage } from "@/lib/images";
import { safeExternalUrl } from "@/lib/maps";
import { Section } from "@/components/layout/Section";
import { MaskedHeading } from "@/components/typography/MaskedHeading";
import { Reveal } from "@/components/animations/Reveal";
import { Picture } from "@/components/media/Picture";
import { HourMark } from "@/components/atmosphere/HourMark";
import { SunRing } from "@/components/atmosphere/SunRing";
import { ButtonLink } from "@/components/buttons/Button";

/**
 * A small, fixed set of photographs standing in for the feed. Kept in the repo
 * rather than pulled from Instagram, so there is no third-party script, no layout
 * shift and no dependency that can fail. (PRD §6.12)
 */
const FRAMES: { imageKey: ImageKey; alt: string }[] = [
  { imageKey: "gallery-drinks", alt: "A cup of coffee on a wooden table, photographed from above" },
  { imageKey: "gallery-texture", alt: "A close view of freshly roasted coffee beans" },
  { imageKey: "menu-croissant", alt: "A whole butter croissant on a pale surface" },
  { imageKey: "gallery-detail", alt: "A cup of coffee resting on an open book beside a window" },
];

/**
 * Section L — social connection (PRD §6.12), at 22:10. Night.
 *
 * The Instagram link is only rendered when a real profile URL is configured. The
 * demonstration value points at the platform itself rather than at somebody
 * else's account, so the link can never impersonate a real profile.
 *
 * The four photographs are staggered rather than locked into a flat row, so the
 * set reads as prints pinned to a wall at the end of the evening.
 */
export function SocialSection() {
  const instagram = safeExternalUrl(cafeConfig.instagramUrl);

  return (
    <Section
      id="social"
      tone="espresso"
      hour="night"
      labelledBy="social-heading"
      className="overflow-x-clip"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <SunRing
          className="absolute -top-[10%] left-[4%] size-[34vw] text-ivory/[0.07]"
          fraction={0.5}
          dot={false}
        />
      </div>

      <div className="container-sol">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-6">
            <Reveal>
              <HourMark time="22:10" label="Stay in touch" className="text-ivory/75" />
            </Reveal>
            <MaskedHeading
              id="social-heading"
              as="h2"
              size="display-3"
              delay={80}
              stagger={100}
              lines={["A LITTLE MORE", "OF THE SAME."]}
              className="max-w-[14ch] text-ivory"
            />
          </div>

          <Reveal delay={140} className="max-w-sm md:pb-2">
            <p className="text-ivory/70">
              What we are baking, roasting and noticing this week &mdash; photographed as it happens.
            </p>
            {instagram && (
              <ButtonLink
                href={instagram}
                external
                variant="outlineInverse"
                size="md"
                className="mt-5 gap-2"
              >
                <InstagramGlyph className="size-4" />
                Follow on Instagram
              </ButtonLink>
            )}
          </Reveal>
        </div>

        <ul className="mt-12 grid list-none grid-cols-2 gap-4 p-0 md:mt-14 md:grid-cols-4">
          {FRAMES.map((frame, index) => (
            <Reveal
              key={frame.imageKey}
              as="li"
              delay={index * 80}
              className={cn(index % 2 === 1 && "md:mt-12")}
            >
              <Picture
                image={getImage(frame.imageKey)}
                alt={frame.alt}
                aspect="1 / 1"
                sizes="(min-width: 768px) 22vw, 46vw"
                className="rounded-[1.25rem] bg-ivory/10"
                imgClassName="transition-transform duration-[900ms] ease-[var(--ease-sol)] hover:scale-[1.04]"
              />
            </Reveal>
          ))}
        </ul>

        <Reveal delay={120} className="mt-10">
          <p className="text-caption text-ivory/70">
            These are photographs from this site rather than a live feed &mdash; nothing here tracks
            you or slows the page down.
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
