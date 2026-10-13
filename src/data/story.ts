import type { StoryChapter } from "@/types";

/* ---------------------------------------------------------------------------
   The café story — three chapters, revealed as a pinned, horizontally-panned
   scene on desktop (GSAP ScrollTrigger) and as ordinary stacked editorial
   blocks everywhere else. (PRD §6.5)

   ⚠️  DEMONSTRATION COPY for a fictional café.
   --------------------------------------------------------------------------- */

export const storyChapters: StoryChapter[] = [
  {
    id: "the-coffee",
    index: "01",
    title: "It begins with a bean",
    body:
      "We buy small — a handful of lots at a time, from growers we can name. Everything is roasted in the city, rested for a few days, then dialled in again every single morning. Nothing leaves the bar until it tastes the way it did yesterday.",
    imageKey: "story-coffee",
    imageAlt: "A pour-over coffee setup with a glass carafe on a counter",
  },
  {
    id: "the-space",
    index: "02",
    title: "A room that asks you to stay",
    body:
      "Warm plaster, worn timber, and chairs that were chosen to be sat in for an hour rather than photographed. We designed the light first and put everything else underneath it. Bring a book. Bring a friend. Bring nothing at all.",
    imageKey: "story-space",
    imageAlt: "A café interior with soft seating and large windows",
  },
  {
    id: "the-people",
    index: "03",
    title: "Made by people who care",
    body:
      "A small team who taste everything, remember your order and will happily talk about water chemistry if you let them. They are the reason the coffee is consistent and the reason the room feels the way it does.",
    imageKey: "story-people",
    imageAlt: "A person in an apron working behind a café counter",
  },
];

/** The single line that sits above the story chapters. */
export const storyIntro = {
  eyebrow: "OUR STORY",
  headlineLines: ["SLOW IS A", "CHOICE."],
  supporting:
    "SŌL began as a small idea: that good coffee and unhurried time belong together. Everything since has been an attempt to keep that promise.",
};
