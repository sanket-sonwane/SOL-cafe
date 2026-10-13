import { ArrowUpRight, MessageCircle } from "lucide-react";
import { cafeConfig, footerNav, openingHours } from "@/data/cafe";
import { formatHoursRow } from "@/lib/format";
import { buildGeneralEnquiryMessage, buildTelUrl, buildWhatsAppUrl } from "@/lib/whatsapp";
import { safeExternalUrl } from "@/lib/maps";
import { InstagramGlyph } from "@/components/icons/SocialIcons";
import { DemoNotice } from "@/components/feedback/DemoNotice";
import { Wordmark } from "@/components/navigation/Wordmark";
import { MaskedLines } from "@/components/animations/MaskedLines";

/**
 * Section M — the footer (PRD §6.13).
 *
 * Treated as the final spread of the magazine: a dark surface, an oversized
 * wordmark revealed through a clipping mask (Animation F), and everything a
 * visitor might still need — address, hours, contact, navigation.
 *
 * The reveal is CSS-only and the oversized mark is decoration beneath the real
 * links, so nothing about the footer is slow to reach or blocked by animation.
 */
export function Footer() {
  const year = new Date().getFullYear();
  const instagram = safeExternalUrl(cafeConfig.instagramUrl);
  const whatsapp = buildWhatsAppUrl(buildGeneralEnquiryMessage());
  const tel = buildTelUrl();

  return (
    <footer id="footer" data-hour="deep-night" className="on-dark relative isolate text-ivory">
      <div className="container-sol pt-16 pb-10 md:pt-20">
        <div className="grid gap-12 border-t border-ivory/12 pt-10 lg:grid-cols-12 lg:gap-10">
          <div className="flex flex-col gap-5 lg:col-span-5">
            <Wordmark size="md" className="text-ivory" showSubline />
            <p className="max-w-xs text-[0.9375rem] leading-relaxed text-ivory/70">
              {cafeConfig.statement}
            </p>
            <p className="font-display text-[1.25rem] leading-snug text-ivory/75 italic">
              {cafeConfig.tagline}
            </p>
          </div>

          <nav aria-label="Footer" className="lg:col-span-3">
            <h2 className="text-micro font-medium tracking-[0.18em] text-ivory/70 uppercase">
              Explore
            </h2>
            <ul className="mt-4 flex list-none flex-col p-0">
              {footerNav.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    className="link-underline -mx-2 inline-flex min-h-11 items-center px-2 text-[0.9375rem] text-ivory/85 hover:text-ivory"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-4">
            <h2 className="text-micro font-medium tracking-[0.18em] text-ivory/70 uppercase">
              Find us
            </h2>
            <address className="mt-4 not-italic text-[0.9375rem] leading-relaxed text-ivory/85">
              {cafeConfig.addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
              <span className="block">
                {cafeConfig.locality}, {cafeConfig.region} {cafeConfig.postalCode}
              </span>
            </address>

            <ul className="mt-4 list-none space-y-1 p-0 text-[0.9375rem] text-ivory/70">
              {openingHours.map((row) => (
                <li key={row.id} className="flex flex-wrap justify-between gap-x-6">
                  <span>{row.label}</span>
                  <span className="numeric">{formatHoursRow(row)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
              {whatsapp && (
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline inline-flex min-h-11 items-center gap-2 text-[0.9375rem] text-ivory/85 hover:text-ivory"
                >
                  <MessageCircle aria-hidden="true" className="size-4" />
                  WhatsApp
                </a>
              )}

              {tel && (
                <a
                  href={tel}
                  className="link-underline numeric inline-flex min-h-11 items-center text-[0.9375rem] text-ivory/85 hover:text-ivory"
                >
                  {cafeConfig.phoneDisplay}
                </a>
              )}

              {instagram && (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline inline-flex min-h-11 items-center gap-2 text-[0.9375rem] text-ivory/85 hover:text-ivory"
                >
                  <InstagramGlyph className="size-4" />
                  Instagram
                </a>
              )}
            </div>

            <a
              href={`mailto:${cafeConfig.email}`}
              className="link-underline mt-1 inline-flex min-h-11 items-center break-all text-[0.9375rem] text-ivory/70 hover:text-ivory"
            >
              {cafeConfig.email}
            </a>
          </div>
        </div>

        <div className="mt-14 border-t border-ivory/12 pt-8">
          <p className="text-micro font-medium tracking-[0.24em] text-ivory/70 uppercase">
            A little slower. A little better.
          </p>

          {/* Animation F — the oversized mark rises through a clipping mask. */}
          <div aria-hidden="true" className="mt-5 overflow-hidden">
            <MaskedLines
              as="div"
              lines={[<Wordmark size="xl" className="text-ivory" />]}
              stagger={0}
              duration={1.1}
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-ivory/12 pt-8 md:flex-row md:items-start md:justify-between">
          <p className="text-caption text-ivory/70">
            © {year} {cafeConfig.fullName}. All rights reserved.
          </p>

          <div className="flex max-w-md flex-col gap-2 md:items-end md:text-right">
            <p className="text-caption text-ivory/70">
              Nothing you type into the reservation form is stored on this site &mdash; it only
              becomes a message you choose to send.
            </p>
            <DemoNotice compact className="text-ivory/70" />
          </div>
        </div>
      </div>

      <a
        href="#top"
        className="link-underline container-sol flex min-h-11 items-center gap-2 pb-[calc(2rem_+_env(safe-area-inset-bottom))] text-caption text-ivory/75 hover:text-ivory"
      >
        Back to top
        <ArrowUpRight aria-hidden="true" className="size-3.5" />
      </a>
    </footer>
  );
}
