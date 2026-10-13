import { getImage } from "@/lib/images";
import { Section } from "@/components/layout/Section";
import { MaskedHeading } from "@/components/typography/MaskedHeading";
import { Reveal } from "@/components/animations/Reveal";
import { ImageFrame } from "@/components/media/ImageFrame";
import { HourMark } from "@/components/atmosphere/HourMark";
import { SunRing } from "@/components/atmosphere/SunRing";
import { LightSweep } from "@/components/atmosphere/LightSweep";

/**
 * Section C — the brand statement (PRD §6.3), at 08:10. Morning.
 *
 * A quiet, warm moment between the hero and the product story. The composition
 * is asymmetric rather than a mirrored two-column block: the copy holds the left
 * six columns while the photograph sits low and right of centre, marked by a
 * vertical caption and a drawn morning sun rising out of the bottom corner.
 */
export function BrandStatement() {
  const accent = getImage("statement-accent");

  return (
    <Section
      id="statement"
      tone="ivory"
      hour="morning"
      labelledBy="statement-heading"
      className="overflow-hidden"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <SunRing
          className="absolute -bottom-[28%] -left-[18%] size-[58vw] text-espresso/[0.07]"
          fraction={0.5}
        />
        <LightSweep color="rgba(255, 226, 178, 0.55)" />
      </div>

      <div className="container-sol">
        <div className="grid gap-y-14 lg:grid-cols-12 lg:gap-x-16">
          <div className="flex flex-col gap-9 lg:col-span-6">
            <Reveal>
              <HourMark time="08:10" label="A small invitation" className="text-coffee" />
            </Reveal>

            <MaskedHeading
              id="statement-heading"
              as="h2"
              size="display-2"
              delay={80}
              stagger={110}
              lines={["NOT EVERY MOMENT", "NEEDS TO BE", <em className="accent-italic">productive.</em>]}
              className="max-w-[13ch] text-espresso"
            />

            <Reveal delay={220} className="flex max-w-xl flex-col gap-5">
              <p className="text-[1.0625rem] leading-relaxed text-espresso/75 md:text-lg">
                Some are meant for another cup of coffee. A conversation that runs longer than
                expected. A page in a book you don&rsquo;t want to finish.
              </p>
              <p className="text-[1.0625rem] leading-relaxed text-espresso/75 md:text-lg">
                SŌL is a neighbourhood café built around the beauty of slowing down.
              </p>
            </Reveal>

            <Reveal delay={340} className="border-t border-taupe/70 pt-6">
              <p className="font-display text-[1.375rem] leading-snug text-coffee italic md:text-[1.5rem]">
                &ldquo;Sit for a while. The coffee will keep coming.&rdquo;
              </p>
            </Reveal>
          </div>

          <div className="relative lg:col-span-5 lg:col-start-8 lg:mt-20">
            <Reveal delay={160} distance="lg">
              <ImageFrame
                image={accent}
                alt="A ceramic cup on a pale, softly lit table"
                aspect="4 / 5"
                sizes="(min-width: 1024px) 40vw, 100vw"
                reveal="up"
                light
                className="rounded-[1.5rem] bg-sand"
              />
              <p className="mt-4 max-w-[20rem] text-caption text-espresso/70">
                Morning service, before the room fills. V60, single origin, no hurry.
              </p>
            </Reveal>

            <span className="absolute top-6 -left-11 hidden text-micro tracking-[0.3em] text-espresso/70 uppercase [writing-mode:vertical-rl] lg:block">
              Morning service · 08:10
            </span>
          </div>
        </div>
      </div>
    </Section>
  );
}
