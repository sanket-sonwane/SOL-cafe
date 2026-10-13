import { cafeConfig } from "@/data/cafe";
import { buildGeneralEnquiryMessage } from "@/lib/whatsapp";
import { Section } from "@/components/layout/Section";
import { MaskedHeading } from "@/components/typography/MaskedHeading";
import { Reveal } from "@/components/animations/Reveal";
import { HourMark } from "@/components/atmosphere/HourMark";
import { SunRing } from "@/components/atmosphere/SunRing";
import { WhatsAppButton } from "@/components/buttons/WhatsAppButton";
import { DemoNotice } from "@/components/feedback/DemoNotice";
import { ReservationForm } from "@/sections/ReservationForm";

const STEPS = [
  {
    title: "Tell us the basics",
    body: "Name, party size, and when you would like to come. A number or email so the café can reply.",
  },
  {
    title: "We prepare a message",
    body: "Your details are filled into a WhatsApp message you can read before you send it — nothing is sent for you.",
  },
  {
    title: "The café replies",
    body: "The team replies to confirm the table, or suggests another time if that one is taken.",
  },
];

/**
 * Section K — the reservation enquiry (PRD §6.11), at 21:30. Night.
 *
 * The framing matters as much as the form: this is explicitly an enquiry, and the
 * three steps below spell out what actually happens so no visitor leaves believing
 * a table is booked. If the café does not take reservations at all, the honest
 * replacement — a direct message — is shown instead. (PRD §6.10)
 *
 * The section sits at night but the form keeps its own pale card, so it reads as a
 * lit panel in a dark room: the form's contrast is entirely self-contained and does
 * not depend on the hour behind it. The ring returns as a moon.
 */
export function ReservationSection() {
  return (
    <Section
      id="reserve"
      tone="espresso"
      hour="night"
      labelledBy="reserve-heading"
      className="overflow-x-clip"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <SunRing
          className="absolute top-[8%] right-[6%] size-[clamp(5rem,12vw,10rem)] text-ivory/15"
          fraction={0.72}
          dot={false}
        />
        <div className="sun-disc absolute -bottom-[18%] left-[2%] size-[clamp(10rem,26vw,22rem)] rounded-full bg-[radial-gradient(circle,rgba(198,140,92,0.3),transparent_70%)] opacity-60 blur-[52px]" />
      </div>

      <div className="container-sol">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="flex flex-col gap-8 lg:col-span-5">
            <Reveal>
              <HourMark time="21:30" label="Reservations" className="text-ivory/75" />
            </Reveal>

            <MaskedHeading
              id="reserve-heading"
              as="h2"
              size="display-2"
              delay={80}
              stagger={110}
              lines={["LET'S HOLD", <>A <em className="accent-italic">table.</em></>]}
              className="max-w-[11ch] text-ivory"
            />

            <Reveal delay={200}>
              <p className="max-w-md text-[1.0625rem] leading-relaxed text-ivory/75">
                {cafeConfig.reservationEnabled
                  ? "Send us an enquiry and the team will get back to you. It takes a minute, and there is no account to create."
                  : "We keep things simple and don't take reservations — message the team and they'll look after you."}
              </p>
            </Reveal>

            {cafeConfig.reservationEnabled ? (
              <Reveal delay={280}>
                <ol className="mt-2 flex list-none flex-col gap-0 border-t border-ivory/15 p-0">
                  {STEPS.map((step, index) => (
                    <li key={step.title} className="flex gap-5 border-b border-ivory/15 py-5">
                      <span
                        aria-hidden="true"
                        className="numeric shrink-0 pt-0.5 font-display text-[1.375rem] leading-none text-terracotta"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="flex flex-col gap-1">
                        <span className="text-[0.9375rem] font-medium text-ivory">{step.title}</span>
                        <span className="text-sm leading-relaxed text-ivory/75">{step.body}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </Reveal>
            ) : (
              <Reveal delay={280}>
                <WhatsAppButton message={buildGeneralEnquiryMessage()} size="lg">
                  Message the café
                </WhatsAppButton>
              </Reveal>
            )}
          </div>

          <Reveal delay={140} distance="lg" className="lg:col-span-7">
            {cafeConfig.reservationEnabled ? (
              <div className="flex flex-col gap-5">
                <div className="shadow-[0_40px_90px_-50px_rgba(0,0,0,0.8)]">
                  <ReservationForm />
                </div>
                <DemoNotice className="px-1 text-ivory/70" />
              </div>
            ) : (
              <div className="rounded-[1.5rem] border border-espresso/12 bg-cream p-6 text-espresso md:p-9">
                <h3 className="font-display text-[1.75rem] leading-tight">
                  We don&rsquo;t take reservations.
                </h3>
                <p className="mt-3 max-w-md text-[0.9375rem] leading-relaxed text-espresso/75">
                  Turn up when it suits you &mdash; there is usually room, and if there isn&rsquo;t,
                  we&rsquo;ll find you a seat. Message the team for larger groups.
                </p>
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
