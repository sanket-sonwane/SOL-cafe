import { ArrowUpRight, Clock, MapPin, Phone } from "lucide-react";
import { cafeConfig, fullAddress, openingHours } from "@/data/cafe";
import { formatHoursRow } from "@/lib/format";
import { getDirectionsUrl, getMapSearchUrl } from "@/lib/maps";
import { buildGeneralEnquiryMessage } from "@/lib/whatsapp";
import { Section } from "@/components/layout/Section";
import { MaskedHeading } from "@/components/typography/MaskedHeading";
import { Reveal } from "@/components/animations/Reveal";
import { HourMark } from "@/components/atmosphere/HourMark";
import { ButtonLink } from "@/components/buttons/Button";
import { MagneticWrap } from "@/components/buttons/MagneticWrap";
import { WhatsAppButton } from "@/components/buttons/WhatsAppButton";
import { DemoNotice } from "@/components/feedback/DemoNotice";

/**
 * Section J — visit SŌL (PRD §6.10), at 20:15. Evening.
 *
 * Practical first: the full address, the weekly schedule, both ways to get in
 * touch, and a directions action that always resolves. The PRD asks for
 * accessibility and parking information only "when verified" — it is not verified
 * for this build, so rather than invent it the section says so and offers a direct
 * line to the café.
 *
 * No live open/closed badge is shown. A static, readable schedule is preferred to
 * a status that could be wrong. (PRD §6.10)
 *
 * The layout is a wide four-column directory rather than the heading-beside-copy
 * template its neighbours use: this is the section a visitor comes back to for
 * facts, so it is organised like a noticeboard, not a spread.
 */
export function VisitSection() {
  return (
    <Section
      id="visit"
      tone="espresso"
      hour="evening"
      labelledBy="visit-heading"
      className="overflow-x-clip"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="sun-disc absolute -bottom-[20%] right-[4%] size-[clamp(12rem,30vw,26rem)] rounded-full bg-[radial-gradient(circle,rgba(216,152,96,0.4),transparent_70%)] opacity-70 blur-[50px]" />
      </div>

      <div className="container-sol">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="flex flex-col gap-7 lg:max-w-[34rem]">
            <Reveal>
              <HourMark time="20:15" label="Visit us" className="text-ivory/75" />
            </Reveal>

            <MaskedHeading
              id="visit-heading"
              as="h2"
              size="display-2"
              delay={80}
              stagger={110}
              lines={["YOUR CORNER", "IS WAITING."]}
              className="text-ivory"
            />
          </div>

          <Reveal delay={200} className="flex flex-col gap-6 lg:max-w-md lg:pb-2">
            <p className="text-[1.0625rem] leading-relaxed text-ivory/75">
              Come as you are, for as long as you like. Coffee from eight in the morning, pastries
              while they last, and a table that is yours until you decide otherwise.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              {cafeConfig.reservationEnabled && (
                <MagneticWrap>
                  <ButtonLink href="#reserve" variant="inverse" size="lg">
                    Reserve a table
                  </ButtonLink>
                </MagneticWrap>
              )}

              <ButtonLink
                href={getDirectionsUrl()}
                external
                variant="outlineInverse"
                size="lg"
                className="gap-2"
              >
                <MapPin aria-hidden="true" className="size-4" />
                Get directions
              </ButtonLink>
            </div>

            <WhatsAppButton message={buildGeneralEnquiryMessage()} variant="outlineInverse" size="md">
              Chat on WhatsApp
            </WhatsAppButton>
          </Reveal>
        </div>

        <dl className="mt-14 grid gap-x-12 gap-y-10 border-t border-ivory/15 pt-10 md:mt-16 sm:grid-cols-2 lg:grid-cols-4">
          <Reveal className="flex flex-col gap-3">
            <dt className="flex items-center gap-2.5 text-micro font-medium tracking-[0.18em] text-ivory/70 uppercase">
              <MapPin aria-hidden="true" className="size-3.5" />
              Address
            </dt>
            <dd className="text-ivory/85">
              <address className="not-italic leading-relaxed">
                {cafeConfig.addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
                <span className="block">
                  {cafeConfig.locality}, {cafeConfig.region} {cafeConfig.postalCode}
                </span>
                <span className="block">{cafeConfig.country}</span>
              </address>
              <a
                href={getMapSearchUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline mt-3 inline-flex min-h-11 items-center gap-1.5 text-ivory"
              >
                View on the map
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </a>
            </dd>
          </Reveal>

          <Reveal delay={90} className="flex flex-col gap-3">
            <dt className="flex items-center gap-2.5 text-micro font-medium tracking-[0.18em] text-ivory/70 uppercase">
              <Clock aria-hidden="true" className="size-3.5" />
              Opening hours
            </dt>
            <dd className="text-ivory/85">
              <ul className="list-none space-y-1 p-0">
                {openingHours.map((row) => (
                  <li key={row.id} className="flex flex-wrap justify-between gap-x-6">
                    <span>{row.label}</span>
                    <span className="numeric text-ivory/70">{formatHoursRow(row)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-caption text-ivory/70">
                Hours may change on public holidays &mdash; a quick message will confirm.
              </p>
            </dd>
          </Reveal>

          <Reveal delay={180} className="flex flex-col gap-3">
            <dt className="flex items-center gap-2.5 text-micro font-medium tracking-[0.18em] text-ivory/70 uppercase">
              <Phone aria-hidden="true" className="size-3.5" />
              Contact
            </dt>
            <dd className="flex flex-col items-start gap-1 text-ivory/85">
              <a href={`tel:${cafeConfig.phoneHref}`} className="link-underline numeric min-h-11">
                {cafeConfig.phoneDisplay}
              </a>
              <a href={`mailto:${cafeConfig.email}`} className="link-underline min-h-11 break-all">
                {cafeConfig.email}
              </a>
            </dd>
          </Reveal>

          <Reveal delay={270} className="flex flex-col gap-3">
            <dt className="text-micro font-medium tracking-[0.18em] text-ivory/70 uppercase">
              Access &amp; getting here
            </dt>
            <dd className="text-ivory/70">
              <p className="leading-relaxed">
                Step-free access, seating, transport and parking details are being confirmed
                &mdash; we would rather check than guess. Message us and we will answer honestly
                before your visit.
              </p>
            </dd>
          </Reveal>
        </dl>

        <p className="mt-8 text-caption text-ivory/70">
          Full address for your records: {fullAddress}
        </p>

        <DemoNotice className="mt-5 text-ivory/70" />
      </div>
    </Section>
  );
}
