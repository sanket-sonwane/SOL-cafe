import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/cn";
import { getImage } from "@/lib/images";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { Section } from "@/components/layout/Section";
import { MaskedHeading } from "@/components/typography/MaskedHeading";
import { Reveal } from "@/components/animations/Reveal";
import { ImageFrame } from "@/components/media/ImageFrame";
import { HourMark } from "@/components/atmosphere/HourMark";

/**
 * The decorative coffee-ring motif (PRD §6.4).
 * A lightweight inline SVG, drawn once and reused — no image request, and it
 * inherits the current text colour.
 */
function CoffeeRing({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 200"
      fill="none"
      className={className}
      focusable="false"
    >
      <circle cx="100" cy="100" r="86" stroke="currentColor" strokeWidth="1" opacity="0.28" />
      <circle
        cx="100"
        cy="100"
        r="72"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.18"
        strokeDasharray="3 7"
      />
      <circle cx="100" cy="100" r="58" stroke="currentColor" strokeWidth="0.75" opacity="0.12" />
    </svg>
  );
}

const PREPARATION_NOTES = [
  { label: "House blend", value: "Ethiopia · Colombia" },
  { label: "Roast", value: "Weekly, in the city" },
  { label: "Espresso", value: "18 g in · 36 g out · 27 s" },
];

/**
 * Section D — signature coffee (PRD §6.4), at 12:20. Noon: the brightest, most
 * even light of the day, and the section argues for the product under it.
 *
 * The preparation notes were a stacked, dark list; here they run as a horizontal
 * specimen row beneath the copy, separated by hairlines, so the section does not
 * repeat the "heading beside image" template of its neighbours. The photograph
 * carries a small, bounded scroll drift and opens through an aperture.
 */
export function SignatureCoffee() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const image = getImage("coffee-feature");

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  return (
    <Section id="coffee" tone="ivory" hour="noon" labelledBy="coffee-heading" className="overflow-hidden">
      {/* Noon: the sun directly overhead, a broad, even light. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 h-96 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(255,240,206,0.7),transparent_72%)]"
      />

      <div ref={sectionRef} className="container-sol">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-x-16">
          <div className="flex flex-col gap-8 lg:col-span-5">
            <Reveal>
              <HourMark time="12:20" label="The daily ritual" className="text-coffee" />
            </Reveal>

            <MaskedHeading
              id="coffee-heading"
              as="h2"
              size="display-2"
              delay={80}
              stagger={110}
              lines={["GOOD COFFEE.", <em className="accent-italic">no shortcuts.</em>]}
              className="max-w-[11ch] text-espresso"
            />

            <Reveal delay={220}>
              <p className="max-w-md text-[1.0625rem] leading-relaxed text-espresso/75">
                Carefully selected beans. Thoughtful preparation. Drinks made to be enjoyed, not
                rushed.
              </p>
            </Reveal>

            <Reveal delay={300} className="mt-2 flex flex-col gap-3">
              <p className="font-display text-[1.375rem] leading-snug text-coffee italic">
                &ldquo;The best cup is the one you take your time with.&rdquo;
              </p>
            </Reveal>
          </div>

          <div className="relative lg:col-span-6 lg:col-start-7">
            <Reveal delay={140} className="relative">
              <CoffeeRing className="pointer-events-none absolute -top-12 -left-10 hidden size-52 text-terracotta/70 lg:block" />
              <div className="relative overflow-hidden rounded-[1.5rem] bg-sand">
                <motion.div style={prefersReducedMotion ? undefined : { y: imageY }}>
                  <ImageFrame
                    image={image}
                    alt="An espresso machine and the coffee bar, mid-service"
                    aspect="4 / 5"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    reveal="left"
                    duration={1200}
                    light
                    lightColor="rgba(255, 236, 196, 0.5)"
                    className="bg-sand"
                  />
                </motion.div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* The specimen row: reference values, read left to right like a tasting card. */}
        <Reveal delay={200} className="mt-16 border-y border-espresso/12">
          <dl className="grid sm:grid-cols-3">
            {PREPARATION_NOTES.map((note, index) => (
              <div
                key={note.label}
                className={cn(
                  "flex flex-col gap-2 py-6",
                  index > 0 && "sm:border-l sm:border-espresso/12 sm:pl-8",
                  index < PREPARATION_NOTES.length - 1 && "sm:pr-8",
                  index > 0 && "border-t border-espresso/12 sm:border-t-0",
                )}
              >
                <dt className="text-micro font-medium tracking-[0.18em] text-espresso/70 uppercase">
                  {note.label}
                </dt>
                <dd className="numeric text-espresso/85">{note.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </Section>
  );
}
