import { useState, type CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { IMAGE_FALLBACK_GRADIENT } from "@/lib/images";
import type { ResponsiveImage } from "@/types";

interface PictureProps {
  image?: ResponsiveImage;
  alt: string;
  /** Wrapper classes — use for sizing, aspect ratio, rounding and colour. */
  className?: string;
  imgClassName?: string;
  /**
   * `sizes` is required in practice: without it the browser assumes 100vw and
   * downloads the largest candidate on every device.
   */
  sizes?: string;
  /** CSS aspect-ratio, e.g. `"4 / 5"`. Reserves space and prevents layout shift. */
  aspect?: string;
  /** Above-the-fold imagery: load eagerly with high priority (the LCP element). */
  priority?: boolean;
  objectPosition?: string;
  /** Text shown when there is no photograph at all. */
  fallbackLabel?: string;
}

/**
 * A single responsive image component used everywhere.
 *
 * - Emits AVIF and WebP candidates, letting the browser choose.
 * - Renders a tiny inline placeholder behind the photograph so a slow connection
 *   sees the right colour rather than an empty box.
 * - Reserves its space via `aspect`, keeping layout shift at zero.
 * - Falls back to an on-brand gradient if the file is missing or fails to load,
 *   so a broken image can never leave a hole in the composition. (PRD FR-04)
 *
 * Deliberately uses a plain <img> rather than a framework loader: there is no
 * image CDN in this project.
 */
export function Picture({
  image,
  alt,
  className,
  imgClassName,
  sizes = "100vw",
  aspect,
  priority = false,
  objectPosition,
  fallbackLabel,
}: PictureProps) {
  const [failed, setFailed] = useState(false);
  const showFallback = !image || failed;

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{
        aspectRatio: aspect,
        backgroundImage: image?.placeholder && !failed ? undefined : IMAGE_FALLBACK_GRADIENT,
        backgroundColor: image?.placeholder ? undefined : "#e9e0d3",
      }}
    >
      {image && !failed && (
        <picture>
          {image.avifSrcSet && (
            <source type="image/avif" srcSet={image.avifSrcSet} sizes={sizes} />
          )}
          <img
            src={image.src}
            srcSet={image.srcSet}
            sizes={sizes}
            alt={alt}
            width={image.width}
            height={image.height}
            loading={priority ? "eager" : "lazy"}
            decoding={priority ? "sync" : "async"}
            fetchPriority={priority ? "high" : "auto"}
            onError={() => setFailed(true)}
            className={cn("absolute inset-0 h-full w-full object-cover", imgClassName)}
            style={objectPosition ? ({ objectPosition } as CSSProperties) : undefined}
          />
        </picture>
      )}

      {showFallback && fallbackLabel && (
        <span className="absolute inset-0 flex items-end p-4 text-micro font-medium uppercase text-espresso/70">
          {fallbackLabel}
        </span>
      )}
    </div>
  );
}
