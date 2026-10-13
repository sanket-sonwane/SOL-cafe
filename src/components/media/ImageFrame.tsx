import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { useReveal } from "@/hooks/useReveal";
import { Picture } from "@/components/media/Picture";
import { LightSweep } from "@/components/atmosphere/LightSweep";
import type { ResponsiveImage } from "@/types";

type ApertureDirection = "in" | "up" | "down" | "left" | "right";

interface ImageFrameProps {
  image?: ResponsiveImage;
  alt: string;
  /** Sizing, rounding and colour for the frame itself. */
  className?: string;
  /** Extra classes on the <img> (e.g. object-position tweaks). */
  imgClassName?: string;
  sizes?: string;
  /** Reserves space; the frame takes this aspect ratio. */
  aspect?: string;
  priority?: boolean;
  objectPosition?: string;
  fallbackLabel?: string;
  /**
   * How the mask opens. `in` opens from a centred window (the aperture); the
   * rest behave like a curtain from that edge. Vary it between neighbouring
   * images so no two open the same way.
   */
  reveal?: ApertureDirection;
  /** Delay before the mask opens, in milliseconds. */
  delay?: number;
  /** Override the mask duration, in milliseconds. */
  duration?: number;
  /**
   * Override the starting mask (any `inset()` value), e.g. a shallow
   * `"4% 3%"` for a hero image that should stay almost fully visible.
   */
  inset?: string;
  /** Override the starting over-scale of the photograph. */
  scale?: number;
  /** Adds a scroll-linked band of light over the photograph. */
  light?: boolean;
  lightColor?: string;
}

/**
 * Animation B — the image aperture reveal (PRD §7.3).
 *
 * Wraps a `Picture` in a mask that opens as the frame enters the viewport while
 * the photograph settles from a slight over-scale. Used for hero and major story
 * imagery, not for thumbnails.
 *
 * It is a *reveal*, never a hiding mechanism: the clip and scale live behind the
 * `html.js` class, so without JavaScript the photograph is simply shown in full.
 * (PRD §12.2)
 */
export function ImageFrame({
  image,
  alt,
  className,
  imgClassName,
  sizes,
  aspect,
  priority = false,
  objectPosition,
  fallbackLabel,
  reveal = "in",
  delay = 0,
  duration,
  inset,
  scale,
  light = false,
  lightColor,
}: ImageFrameProps) {
  const ref = useReveal<HTMLDivElement>();

  const style: CSSProperties & Record<`--${string}`, string | number> = { aspectRatio: aspect };
  if (delay) style["--aperture-delay"] = `${delay}ms`;
  if (duration) style["--aperture-duration"] = `${duration}ms`;
  if (inset) style["--aperture-inset"] = inset;
  if (scale !== undefined) style["--aperture-scale"] = scale;

  return (
    <div
      ref={ref}
      data-aperture={reveal}
      style={style}
      className={cn("relative overflow-hidden", className)}
    >
      <div className="aperture-media h-full w-full">
        <Picture
          image={image}
          alt={alt}
          sizes={sizes}
          priority={priority}
          objectPosition={objectPosition}
          fallbackLabel={fallbackLabel}
          className="h-full w-full"
          imgClassName={imgClassName}
        />
      </div>

      {light && <LightSweep color={lightColor} />}
    </div>
  );
}
