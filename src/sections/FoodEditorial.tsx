import { menuItems } from "@/data/menu";
import { formatINR } from "@/lib/format";
import { getImage } from "@/lib/images";
import type { MenuItem } from "@/types";
import { Section } from "@/components/layout/Section";
import { MaskedHeading } from "@/components/typography/MaskedHeading";
import { Reveal } from "@/components/animations/Reveal";
import { ImageFrame } from "@/components/media/ImageFrame";
import { HourMark } from "@/components/atmosphere/HourMark";
import { LightSweep } from "@/components/atmosphere/LightSweep";

/**
 * Three menu items shown as plates beside the main photograph. Referenced by id
 * from the menu data so a name, description or price can never drift out of sync
 * with the menu section.
 */
const PLATE_IDS = ["avocado-toast", "butter-croissant", "hazelnut-brownie"];

function pickPlates(): MenuItem[] {
  return PLATE_IDS.map((id) => menuItems.find((item) => item.id === id)).filter(
    (item): item is MenuItem => item !== undefined,
  );
}

/**
 * Section G — the food editorial (PRD §6.7), at 17:40. Golden hour.
 *
 * A deliberate change of rhythm after the menu, and the only section where the
 * type is stacked *over* the layout rather than beside it: the headline runs at
 * display-1 across eight columns, the supporting copy sits to its right, and the
 * photograph runs edge to edge underneath. The three plates then ride up over the
 * photograph's lower edge as mounted prints, so the composition has depth instead
 * of reading as another row of cards.
 *
 * The PRD asks that text be worked into the layout rather than dropped into a
 * generic translucent box — so nothing here sits in a panel: the headline is on
 * the page surface, and the plates carry their own solid backing.
 */
export function FoodEditorial() {
  const plates = pickPlates();

  return (
    <Section
      id="food"
      tone="ivory"
      hour="golden"
      labelledBy="food-heading"
      className="overflow-x-clip"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <LightSweep color="rgba(255, 190, 118, 0.6)" from="30%" to="70%" />
      </div>

      <div className="container-sol">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-16">
          <div className="flex flex-col gap-7 lg:col-span-8">
            <Reveal>
              <HourMark time="17:40" label="From the pass" className="text-coffee" />
            </Reveal>

            <MaskedHeading
              id="food-heading"
              as="h2"
              size="display-1"
              delay={80}
              stagger={110}
              lines={["MADE TO", <>GO <em className="accent-italic">together.</em></>]}
              className="max-w-[14ch]"
            />
          </div>

          <Reveal delay={200} className="flex flex-col gap-4 lg:col-span-4 lg:pb-4">
            <p className="text-[1.0625rem] leading-relaxed text-espresso/75">
              Freshly prepared plates, indulgent little treats and the perfect excuse to stay for
              another cup.
            </p>
            <p className="text-[0.9375rem] leading-relaxed text-espresso/75">
              Baked through the morning and cooked to order, so a short wait is part of how it
              tastes. Ask about ingredients and allergens &mdash; we would rather you asked than
              guessed.
            </p>
          </Reveal>
        </div>

        <Reveal distance="lg" className="mt-12 md:mt-16">
          <ImageFrame
            image={getImage("food-feature")}
            alt="A breakfast plate with toast, poached eggs, avocado and roasted tomatoes"
            aspect="16 / 9"
            sizes="100vw"
            reveal="in"
            duration={1300}
            light
            lightColor="rgba(255, 196, 128, 0.5)"
            className="rounded-[1.75rem] bg-cream"
          />
        </Reveal>

        <ul className="relative z-10 mt-[-2.5rem] grid list-none gap-6 p-0 sm:grid-cols-3 md:mt-[-4rem]">
          {plates.map((item, index) => (
            <Reveal key={item.id} as="li" delay={index * 90}>
              <div className="rounded-[1.5rem] bg-ivory p-3 shadow-[0_30px_60px_-40px_rgba(48,35,29,0.55)]">
                <ImageFrame
                  image={getImage(item.imageKey)}
                  alt=""
                  aspect="5 / 4"
                  sizes="(min-width: 640px) 30vw, 100vw"
                  reveal={index === 1 ? "up" : "in"}
                  className="rounded-[1.1rem] bg-cream"
                />
                <div className="flex items-baseline justify-between gap-4 px-1.5 pt-3.5 pb-1">
                  <h3 className="font-display text-[1.25rem] leading-tight">{item.name}</h3>
                  <p className="numeric shrink-0 text-sm text-coffee">{formatINR(item.price)}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}
