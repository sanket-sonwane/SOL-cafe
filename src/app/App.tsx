import { buildStructuredData } from "@/lib/seo";
import { SkipLink } from "@/components/navigation/SkipLink";
import { Header } from "@/components/navigation/Header";
import { SolarProgress } from "@/components/atmosphere/SolarProgress";
import { CursorAccent } from "@/components/interactive/CursorAccent";
import { Hero } from "@/sections/Hero";
import { IntroSequence } from "@/sections/IntroSequence";
import { BrandStatement } from "@/sections/BrandStatement";
import { SignatureCoffee } from "@/sections/SignatureCoffee";
import { CafeStory } from "@/sections/CafeStory";
import { InteractiveMenu } from "@/sections/InteractiveMenu";
import { FoodEditorial } from "@/sections/FoodEditorial";
import { AtmosphereGallery } from "@/sections/AtmosphereGallery";
import { PeopleSection } from "@/sections/PeopleSection";
import { VisitSection } from "@/sections/VisitSection";
import { ReservationSection } from "@/sections/ReservationSection";
import { SocialSection } from "@/sections/SocialSection";
import { Footer } from "@/sections/Footer";
import { MarqueeBand, PRIMARY_MARQUEE } from "@/sections/MarqueeBand";

/**
 * The SŌL homepage.
 *
 * One art-directed page rather than a set of routes: the PRD's whole argument is
 * that the café is one continuous experience, so the sections are composed in the
 * order the story is told — hero, invitation, the coffee, the story, the menu, the
 * food, the room, the people, and then everything practical (visit, reservations,
 * social, footer).
 *
 * Anchors used by the header and footer navigation are declared here rather than
 * derived, so a typo in a nav item fails loudly at review time.
 */
export function App() {
  const structuredData = buildStructuredData();

  return (
    <>
      <SkipLink />
      <IntroSequence />
      <SolarProgress />
      <CursorAccent />
      <Header />

      <main id="main" className="flex flex-col">
        <Hero />
        <BrandStatement />
        <SignatureCoffee />

        <MarqueeBand message={PRIMARY_MARQUEE} tone="light" hour="noon" />

        <CafeStory />
        <InteractiveMenu />
        <FoodEditorial />
        <AtmosphereGallery />
        <PeopleSection />
        <VisitSection />
        <ReservationSection />
        <SocialSection />

        <MarqueeBand
          tone="dark"
          hour="night"
          message="ROASTED IN THE CITY · BAKED THIS MORNING · POURED BY HAND"
        />
      </main>

      <Footer />

      {/*
        Structured data is generated from the same `cafeConfig` the page renders
        from, so the markup can never describe a different café than the visitor
        sees. (PRD §12.3)
      */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
}
