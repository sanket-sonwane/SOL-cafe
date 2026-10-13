import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowDown } from "lucide-react";
import { getImage } from "@/lib/images";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { ImageFrame } from "@/components/media/ImageFrame";
import { Eyebrow } from "@/components/typography/Eyebrow";
import { KineticHeading } from "@/components/animations/KineticHeading";
import { SunRing } from "@/components/atmosphere/SunRing";
import { MagneticWrap } from "@/components/buttons/MagneticWrap";
import { ButtonLink } from "@/components/buttons/Button";

/**
 * Section B — the hero (PRD §6.2), and the first hour of the solar arc: dawn.
 *
 * The page is a single day, and this is its opening. A low sun sits in the
 * photograph, a horizon line runs behind the type, and a faint orbit ring
 * carries the identity's one graphic motif. The headline is set as four
 * deliberately broken lines — the two "a little" lines small and italic, the two
 * declarative lines full width — and enters **word by word** (PRD Animation A),
 * held back by the intro card so the two gestures read as one.
 *
 * The photograph opens through an aperture (PRD Animation B) whose starting mask
 * is deliberately shallow, so the LCP element is essentially visible from the
 * first frame rather than being revealed from nothing.
 *
 * Scroll behaviour: the photograph drifts slower than the page and the content
 * lifts and fades as the visitor leaves. Each is a single transform/opacity on
 * its own element, disabled entirely under reduced motion.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "9%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-7%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const hero = getImage("hero-primary");

  const imageStyle = prefersReducedMotion ? { scale: 1.08 } : { y: imageY, scale: 1.08 };
  const contentStyle = prefersReducedMotion
    ? undefined
    : { y: contentY, opacity: contentOpacity };

  return (
    <section
      ref={sectionRef}
      id="top"
      data-hour="dawn"
      aria-labelledby="hero-heading"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden text-ivory"
    >
      <div className="absolute inset-0 -z-10">
        <motion.div style={imageStyle} className="absolute inset-0">
          <ImageFrame
            image={hero}
            alt="A warm cup of coffee resting on a café table in soft dawn light"
            priority
            sizes="100vw"
            inset="7% 5%"
            scale={1.1}
            duration={1400}
            className="absolute inset-0 bg-espresso"
            imgClassName="object-cover"
            light
            lightColor="rgba(255, 206, 140, 0.4)"
          />
        </motion.div>

        {/* Contrast control: the headline must stay legible over every crop. */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/78 via-ink/38 to-ink/92" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_35%,transparent_35%,rgba(28,21,18,0.55)_100%)]" />

        {/* The sun, low and rising. */}
        <div
          aria-hidden="true"
          className="sun-disc absolute bottom-[10%] left-[4%] size-[clamp(12rem,34vw,30rem)] rounded-full bg-[radial-gradient(circle,rgba(255,214,150,0.85),rgba(233,150,84,0.35)_42%,transparent_70%)] opacity-60 mix-blend-screen blur-[46px]"
        />

        {/* The horizon it sits on. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-[26%] h-px bg-gradient-to-r from-transparent via-ivory/25 to-transparent"
        />

        {/* The orbit — the identity ring, oversized and mostly off-canvas. */}
        <SunRing
          className="pointer-events-none absolute -top-[18%] -right-[14%] size-[52vw] text-ivory/10"
          fraction={0.55}
        />
      </div>

      <div className="container-sol flex flex-1 flex-col justify-between pt-26 pb-9 md:pt-36 md:pb-12">
        <motion.div style={contentStyle} className="flex flex-1 flex-col justify-between gap-10">
          <div className="flex flex-col gap-8 md:gap-12">
            <Eyebrow tone="ivory" withRule className="text-ivory/75">
              First light · Pune, India
            </Eyebrow>

            <KineticHeading
              as="h1"
              id="hero-heading"
              delay={120}
              stagger={90}
              lines={[
                {
                  text: "A little",
                  className:
                    "accent-italic text-[clamp(1.15rem,2.6vw,2.1rem)] tracking-[0.01em] text-ivory/85 normal-case",
                },
                { text: "Slower.", className: "font-display text-display-1 uppercase" },
                {
                  text: "A little",
                  className:
                    "accent-italic text-[clamp(1.15rem,2.6vw,2.1rem)] tracking-[0.01em] text-ivory/85 normal-case",
                },
                { text: "Better.", className: "font-display text-display-1 uppercase" },
              ]}
              className="max-w-[16ch] font-normal"
            />
          </div>

          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="flex max-w-md flex-col gap-7">
              <p className="text-[0.9375rem] leading-relaxed text-ivory/80 md:text-base">
                Thoughtfully brewed coffee, beautiful things to eat, and a space to stay a little
                longer.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <MagneticWrap>
                  <ButtonLink href="#menu" variant="inverse" size="lg">
                    Explore the menu
                  </ButtonLink>
                </MagneticWrap>

                <ButtonLink href="#visit" variant="outlineInverse" size="lg">
                  Find your corner
                </ButtonLink>
              </div>
            </div>

            <div className="flex items-end justify-between gap-8 md:flex-col md:items-end md:gap-6">
              <p className="numeric text-caption text-ivory/75">
                Mon–Fri 8:00 AM – 10:00 PM
                <br />
                Sat–Sun 8:30 AM – 11:00 PM
              </p>

              <a
                href="#statement"
                className="group inline-flex flex-col items-center gap-2 text-ivory/70 transition-colors duration-300 hover:text-ivory"
              >
                <span className="text-micro font-medium tracking-[0.28em] uppercase">Scroll</span>
                <span aria-hidden="true" className="relative block h-10 w-px bg-ivory/25">
                  <span className="scroll-cue-line absolute inset-0 block bg-terracotta" />
                </span>
                <ArrowDown aria-hidden="true" className="size-3.5" />
                <span className="sr-only">Continue to the next section</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
