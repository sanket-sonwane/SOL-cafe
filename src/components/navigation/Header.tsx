import { useCallback, useState } from "react";
import { cn } from "@/lib/cn";
import { primaryNav } from "@/data/cafe";
import { useScrolled } from "@/hooks/useScrolled";
import { Wordmark } from "@/components/navigation/Wordmark";
import { MobileNav } from "@/components/navigation/MobileNav";
import { buttonClasses } from "@/components/buttons/Button";
import { Menu as MenuIcon } from "lucide-react";

/**
 * The site header (PRD §5.2).
 *
 * Transparent while the hero fills the viewport, then settles into a softly
 * opaque ivory surface once the visitor scrolls — so the wordmark stays legible
 * over photography and over paper. `useScrolled` only re-renders when the
 * threshold is crossed, never once per frame.
 */
export function Header() {
  const scrolled = useScrolled(48);
  const [navOpen, setNavOpen] = useState(false);

  const closeNav = useCallback(() => setNavOpen(false), []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] transition-[background-color,box-shadow,backdrop-filter,border-color] duration-500 ease-[var(--ease-sol)]",
          scrolled
            ? "border-b border-taupe/60 bg-ivory/85 backdrop-blur-md max-md:bg-ivory/95 max-md:backdrop-blur-none"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="container-sol flex min-h-16 items-center justify-between gap-6 md:min-h-20">
          <a
            href="#top"
            aria-label="SŌL — back to top"
            className={cn(
              /* min-h-11 keeps the wordmark a 44px-tall touch target even though the
                 mark itself is only ~26px tall. (PRD §8.3) */
              "inline-flex min-h-11 shrink-0 items-center transition-colors duration-500",
              scrolled ? "text-espresso" : "text-ivory",
            )}
          >
            <Wordmark size="sm" />
          </a>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-8">
              {primaryNav.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    className={cn(
                      "link-underline -mx-2 inline-flex min-h-11 items-center px-2 text-[0.8125rem] font-medium tracking-[0.04em] transition-colors duration-500",
                      scrolled ? "text-espresso/80 hover:text-espresso" : "text-ivory/85 hover:text-ivory",
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            {/*
              The visibility lives on a wrapper rather than on the button itself.
              Tailwind emits `hidden` before `inline-flex`, so `hidden sm:inline-flex`
              layered onto the button's own `inline-flex` would lose the cascade and
              the CTA would stay visible on phones. (PRD §8.3)
            */}
            <div className="hidden sm:flex">
              <a
                href="#visit"
                className={cn(
                  buttonClasses({ size: "md" }),
                  "transition-colors duration-500",
                  scrolled
                    ? "bg-espresso text-ivory hover:bg-ink"
                    : "bg-ivory text-espresso hover:bg-cream",
                )}
              >
                Visit us
              </a>
            </div>

            <button
              type="button"
              onClick={() => setNavOpen(true)}
              className={cn(
                "inline-flex size-11 items-center justify-center rounded-full transition-colors duration-500 md:hidden",
                scrolled ? "text-espresso hover:bg-espresso/8" : "text-ivory hover:bg-ivory/12",
              )}
              aria-expanded={navOpen}
              aria-controls="mobile-navigation"
            >
              <MenuIcon aria-hidden="true" className="size-5" />
              <span className="sr-only">Open menu</span>
            </button>
          </div>
        </div>
      </header>

      <MobileNav open={navOpen} onClose={closeNav} />
    </>
  );
}
