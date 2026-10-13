import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

interface MarqueeProps {
  /** The repeated phrase. The full message must be legible here. */
  message: string;
  /** Seconds for one full loop. Slower reads as calmer. */
  duration?: number;
  className?: string;
  /** Optional separator glyph between repetitions. */
  separator?: string;
}

/**
 * Animation D — the kinetic editorial strip (PRD §7.3).
 *
 * Rendered as a real sentence so it is readable and selectable, then duplicated
 * once for the seamless loop. The duplicate is hidden from assistive technology
 * so the message is not announced twice.
 *
 * Movement is CSS-only, pauses on hover/focus, and stops entirely under reduced
 * motion (styles/motion.css), in which case the phrase simply reads as a
 * static line.
 */
export function Marquee({ message, duration = 38, className, separator = "·" }: MarqueeProps) {
  const repetitions = new Array(4).fill(message);

  const Track = ({ hidden }: { hidden: boolean }) => (
    <span
      className="flex shrink-0 items-center gap-6 pr-6 md:gap-10 md:pr-10"
      aria-hidden={hidden ? "true" : undefined}
    >
      {repetitions.map((text, index) => (
        <span className="flex items-center gap-6 md:gap-10" key={index}>
          <span className="font-display text-[clamp(1.05rem,2.1vw,1.6rem)] tracking-[0.16em] whitespace-nowrap uppercase">
            {text}
          </span>
          <span aria-hidden="true" className="text-terracotta">
            {separator}
          </span>
        </span>
      ))}
    </span>
  );

  return (
    <div className={cn("marquee w-full overflow-hidden", className)}>
      <div
        className="marquee-track"
        style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
      >
        <Track hidden={false} />
        <Track hidden />
      </div>
    </div>
  );
}
