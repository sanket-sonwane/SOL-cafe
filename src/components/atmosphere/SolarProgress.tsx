import { motion, useScroll, useSpring, useTransform } from "motion/react";

/**
 * The page's scroll indicator, rendered as the sun crossing the sky.
 *
 * A hairline runs along the top edge with a small sun riding it: the disc warms
 * from dawn amber, through a bright noon white, to a dusky rose and finally a
 * lamp-lit gold as the page travels through its day. The colour ramp is the same
 * one the surfaces use, so the indicator reads as part of the world rather than
 * as UI chrome.
 *
 * Purely decorative (`aria-hidden`), spring-smoothed so it never looks jittery,
 * and hidden entirely under reduced motion. It sits above the header so the sun
 * is never occluded.
 */
const SUN_RAMP = ["#d98a50", "#f4d6a0", "#fff3da", "#e8a05f", "#c0705c", "#d9a06a"];

export function SolarProgress() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 34,
    restDelta: 0.0005,
  });

  const left = useTransform(progress, (value) => `${value * 100}%`);
  const sun = useTransform(progress, [0, 0.32, 0.5, 0.68, 0.86, 1], SUN_RAMP);
  const glow = useTransform(sun, (color) => `0 0 12px 2px ${color}`);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-[env(safe-area-inset-top)] z-[70] h-0 motion-reduce:hidden"
    >
      {/* The horizon. */}
      <div className="absolute inset-x-0 top-0 h-px bg-espresso/10" />

      <motion.div
        className="absolute top-0 left-0 h-px w-full origin-left"
        style={{ scaleX: progress, backgroundColor: sun }}
      />

      {/* The sun, sitting half over the horizon line. */}
      <motion.div className="absolute top-0 -translate-x-1/2 -translate-y-1/2" style={{ left }}>
        <motion.span
          className="solar-corona block size-2.5 rounded-full"
          style={{ backgroundColor: sun, boxShadow: glow }}
        />
      </motion.div>
    </div>
  );
}
