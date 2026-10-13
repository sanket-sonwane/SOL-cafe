import { teamImages } from "@/data/gallery";
import { getImage } from "@/lib/images";
import { cn } from "@/lib/cn";
import { Section } from "@/components/layout/Section";
import { MaskedHeading } from "@/components/typography/MaskedHeading";
import { Reveal } from "@/components/animations/Reveal";
import { Picture } from "@/components/media/Picture";
import { HourMark } from "@/components/atmosphere/HourMark";

/**
 * Section I — the people behind SŌL (PRD §6.9), at 19:40. Evening: the lights are
 * on inside and the room has settled.
 *
 * The PRD is explicit here: if approved staff photography or biographies are not
 * available, keep the section small rather than inventing factual claims about
 * real people. There are therefore no names and no biographies — only what the
 * photographs genuinely show, plus a short note about how the team approaches the
 * work. It is deliberately the calmest section on the page.
 *
 * The two portraits are set at different heights rather than locked into a neat
 * row, so the section reads as a considered spread rather than a gallery of
 * headshots.
 */
export function PeopleSection() {
  return (
    <Section
      id="people"
      tone="espresso"
      hour="evening"
      labelledBy="people-heading"
      className="overflow-x-clip"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        {/* The lampshade warmth in the corner of the room. */}
        <div className="sun-disc absolute -top-[14%] right-[6%] size-[clamp(10rem,26vw,22rem)] rounded-full bg-[radial-gradient(circle,rgba(226,168,110,0.5),transparent_70%)] opacity-70 blur-[46px]" />
      </div>

      <div className="container-sol">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-16">
          <div className="flex flex-col gap-7 lg:col-span-7">
            <Reveal>
              <HourMark time="19:40" label="The people, always" className="text-ivory/75" />
            </Reveal>

            <MaskedHeading
              id="people-heading"
              as="h2"
              size="display-2"
              delay={80}
              stagger={110}
              lines={["GOOD THINGS", "ARE MADE", <em className="accent-italic">together.</em>]}
              className="max-w-[11ch] text-ivory"
            />
          </div>

          <Reveal delay={200} className="lg:col-span-5 lg:pb-3">
            <p className="max-w-md text-[1.0625rem] leading-relaxed text-ivory/75">
              Behind every cup is a person who cares about getting the small things right.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-8 md:mt-16 md:grid-cols-2 md:gap-10">
          {teamImages.map((member, index) => (
            <Reveal
              key={member.id}
              delay={index * 140}
              className={cn(index === 1 && "md:mt-20")}
            >
              <Picture
                image={getImage(member.imageKey)}
                alt={member.alt}
                aspect="4 / 5"
                sizes="(min-width: 768px) 44vw, 100vw"
                className="rounded-[1.5rem] bg-ivory/10"
              />
              <p className="mt-4 flex items-center gap-3 text-micro font-medium tracking-[0.18em] text-ivory/70 uppercase">
                <span aria-hidden="true" className="h-px w-8 bg-terracotta" />
                {member.role}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120} className="mt-12 md:mt-16">
          <p className="measure text-[1.0625rem] leading-relaxed text-ivory/75">
            We are a small team who taste everything before it goes out, remember how you take your
            coffee, and would happily talk about grind size for longer than is reasonable. If
            something is not right, tell us &mdash; it is the fastest way we get better.
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
