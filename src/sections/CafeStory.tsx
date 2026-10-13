import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { getImage } from "@/lib/images";
import { storyChapters, storyIntro } from "@/data/story";
import { useIsDesktop, usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { Section } from "@/components/layout/Section";
import { MaskedHeading } from "@/components/typography/MaskedHeading";
import { Reveal } from "@/components/animations/Reveal";
import { Picture } from "@/components/media/Picture";
import { HourMark } from "@/components/atmosphere/HourMark";
import { SunRing } from "@/components/atmosphere/SunRing";

/**
 * Section E — the café story (PRD §6.5), at 14:30. Mid-afternoon.
 *
 * This is the one place GSAP is used. Motion owns everything else; here we need a
 * scrubbed, pinned timeline that reacts to the visitor's own scrolling, which is
 * exactly what ScrollTrigger is good at.
 *
 * Ownership is deliberately strict:
 *  - GSAP only ever animates transforms and opacity *inside* this section (the
 *    track's `xPercent`, the incoming media's `scale`/`yPercent`, the caption and
 *    the sky's opacity). Nothing here is also animated by Motion, and the CSS
 *    reveal system is not used inside the panels.
 *  - It initialises only when the viewport is wide **and** the visitor has not
 *    requested reduced motion. React re-runs the effect on a breakpoint change
 *    and `gsap.context().revert()` fully undoes the pin.
 *  - GSAP is imported dynamically, inside the effect, so nothing touches
 *    `document` during server rendering.
 *
 * New to the solar arc: as the chapters pan past, a second sky layer cross-fades
 * in, so the story literally travels from flat afternoon light toward dusk.
 */
export function CafeStory() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const isDesktop = useIsDesktop();
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !isDesktop || prefersReducedMotion) return;

    let cancelled = false;
    let revert: (() => void) | undefined;

    const boot = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      const context = gsap.context(() => {
        const track = stage.querySelector(".story-track");
        const panels = gsap.utils.toArray<HTMLElement>(".story-panel", stage);
        if (!track || panels.length < 2) return;

        // Hand the layout over to CSS now that GSAP is running.
        stage.dataset.storyReady = "true";

        const lastIndex = panels.length - 1;

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: () => `+=${window.innerHeight * lastIndex * 1.15}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // 1. Pan the track. One unit of timeline time per chapter transition, so
        //    the chapters land in step with the scroll rather than all at once.
        timeline.to(track, { xPercent: -100 * lastIndex, duration: lastIndex }, 0);

        // 2. Cross-fade the sky: the light cools as the chapters travel.
        const duskSky = stage.querySelector<HTMLElement>("[data-story-sky-dusk]");
        if (duskSky) {
          timeline.to(duskSky, { opacity: 1, duration: lastIndex }, 0);
        }

        // 3. Give each incoming chapter its own internal settle. Chapter one is
        //    already in place and is left untouched.
        panels.forEach((panel, index) => {
          if (index === 0) return;

          const media = panel.querySelector<HTMLElement>("[data-story-media]");
          const caption = panel.querySelector<HTMLElement>("[data-story-caption]");
          const settle = index - 0.75;

          if (media) {
            timeline.fromTo(
              media,
              { scale: 1.16, yPercent: 3 },
              { scale: 1, yPercent: 0, duration: 0.55 },
              settle,
            );
          }
          if (caption) {
            timeline.fromTo(
              caption,
              { y: 22, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 0.3, ease: "power2.out" },
              settle + 0.14,
            );
          }
        });

        // 4. A hairline progress rail beneath the scene.
        const progress = stage.querySelector<HTMLElement>("[data-story-progress]");
        if (progress) {
          timeline.fromTo(progress, { scaleX: 0 }, { scaleX: 1, duration: lastIndex }, 0);
        }
      }, stage);

      revert = () => {
        context.revert();
        delete stage.dataset.storyReady;
      };

      ScrollTrigger.refresh();
    };

    void boot();

    return () => {
      cancelled = true;
      revert?.();
    };
  }, [isDesktop, prefersReducedMotion]);

  return (
    <Section id="story" tone="ivory" hour="afternoon" labelledBy="story-heading" className="overflow-hidden">
      <div className="container-sol">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="flex flex-col gap-7 lg:col-span-7">
            <Reveal>
              <HourMark time="14:30" label={storyIntro.eyebrow} className="text-coffee" />
            </Reveal>
            <MaskedHeading
              id="story-heading"
              as="h2"
              size="display-2"
              delay={80}
              stagger={110}
              lines={storyIntro.headlineLines}
              className="max-w-[12ch]"
            />
          </div>
          <Reveal delay={200} className="lg:col-span-5 lg:pb-3">
            <p className="max-w-md text-[1.0625rem] leading-relaxed text-espresso/70">
              {storyIntro.supporting}
            </p>
          </Reveal>
        </div>
      </div>

      <div
        ref={stageRef}
        data-gsap-scene="story"
        className="relative mt-16 md:mt-20"
        aria-label="The story of SŌL, in three chapters"
      >
        {/* The sky behind the chapters. The dusk layer is faded in by the timeline. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,216,156,0.3),transparent_62%)]" />
          <div
            data-story-sky-dusk
            className="absolute inset-0 opacity-0 bg-[linear-gradient(180deg,rgba(176,104,88,0.36),rgba(122,96,122,0.22)_58%,transparent)]"
          />
        </div>

        <div className="story-track">
          {storyChapters.map((chapter, index) => (
            <article
              key={chapter.id}
              className={cn(
                "story-panel md:flex md:items-center",
                index % 2 === 1 && "md:[&_.story-media]:order-first",
              )}
            >
              <div className="container-sol w-full">
                <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
                  <div
                    className={cn("story-media lg:col-span-6", index % 2 === 1 && "lg:order-first")}
                    data-story-media
                  >
                    <Picture
                      image={getImage(chapter.imageKey)}
                      alt={chapter.imageAlt}
                      aspect="4 / 5"
                      sizes="(min-width: 1024px) 46vw, 100vw"
                      className="rounded-[1.5rem] bg-sand"
                    />
                  </div>

                  <div className="flex flex-col gap-6 lg:col-span-6">
                    <SunRing
                      className="size-20 text-taupe md:size-24"
                      fraction={0.68}
                    >
                      {chapter.index}
                    </SunRing>

                    <h3 className="font-display text-[clamp(1.75rem,3.6vw,3rem)] leading-[1.05] tracking-[-0.02em] text-balance">
                      {chapter.title}
                    </h3>
                    <p className="max-w-lg text-[1.0625rem] leading-relaxed text-espresso/70">
                      {chapter.body}
                    </p>
                    <div
                      data-story-caption
                      className="flex items-center gap-3 text-micro font-medium tracking-[0.18em] text-coffee uppercase"
                    >
                      <span aria-hidden="true" className="h-px w-10 bg-terracotta" />
                      Chapter {chapter.index} of {String(storyChapters.length).padStart(2, "0")}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div
          aria-hidden="true"
          className="story-progress pointer-events-none absolute inset-x-0 bottom-8 mx-auto h-px w-[min(28rem,72vw)] bg-taupe"
        >
          <span
            data-story-progress
            className="block h-full origin-left bg-terracotta"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </Section>
  );
}
