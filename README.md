# SŌL — Coffee & Slow Living

A single-page, art-directed marketing site for a premium specialty café, built to the
specification in `PRD.md`.

The whole product is one continuous homepage rather than a set of routes: a cinematic
hero, an invitation, the coffee, a three-chapter story, an interactive menu, the food,
the room, the people, and then everything practical — visiting, reservations, social,
and a magazine-style footer.

### The art direction: the solar arc

**SŌL is the sun**, so the page is a single day. As you scroll from the hero to the
footer the hour advances — dawn, morning, noon, afternoon, golden, dusk, evening,
night — and the light on the page moves with it. Every section declares the hour it
sits at (`data-hour` on its `<Section>`), which sets that section's surface: a base
colour plus one or two restrained light *washes*. Because the surface changes, the
sections no longer read as the same ivory block repeated; the page reads as time
passing.

The identity's one recurring graphic is the **sun ring** (`SunRing`): a faint circle
with a partial accent arc and the dot from the Ō. It appears as a chapter marker, a
section index (inside `HourMark`, which pairs the ring with the section's time and
label), a progress indicator, and a large decorative motif that shifts from sun to
moon as the day ends.

Motion is **maximal but tasteful**: roughly one memorable moment per section, and none
of it gratuitous. The hero choreographs word by word; images are revealed through a
closing **aperture**; a brief **intro title card** hands off to the hero as one
gesture; the café story is a pinned horizontal scene; a moving **light sweep** crosses
two sections; a cursor accent warms the pointer; a solar progress rail traces the day.
All of it collapses cleanly under `prefers-reduced-motion` — see
[Accessibility and motion](#accessibility-and-motion).

> ### ⚠️ This is demonstration content
>
> **SŌL is a fictional café.** Every address, email, opening time, price and photograph
> in this build is illustrative; the WhatsApp number is the one live contact detail.
> Nothing here should be mistaken for a real business, and nothing in the interface
> pretends otherwise — a visible notice appears in the footer and reservation area, and
> the site explicitly describes itself as a demonstration in its structured data.
>
> Before commercial use, replace the values in [Demo values to replace](#demo-values-to-replace).

---

## Quick start

```bash
npm install

npm run dev        # local development server
npm test           # unit tests (Vitest)
npm run typecheck  # TypeScript, no emit
npm run build      # typecheck → client build → SSR build → prerender → site URL → verify
npm run preview    # serve the production build from dist/
npm run images     # regenerate the optimised photography + manifest + CREDITS.md
npm run icons      # regenerate the PNG app icons + site.webmanifest
```

Node **20 or newer** is required (developed on Node 22).

To build against a real domain, set `VITE_SITE_URL` (see [Deploying](#deploying)):

```bash
VITE_SITE_URL=https://your-domain.example npm run build
```

### What `npm run build` actually does

1. `typecheck` — `tsc --noEmit`, and the build stops here if it fails.
2. `build:client` — the normal Vite bundle to `dist/`.
3. `build:ssr` — a small server bundle to `dist-ssr/` used only for prerendering.
4. `prerender` — renders the React tree with `react-dom/server` and swaps it into
   `dist/index.html` for the `<!--app-html-->` placeholder.
5. `site-url` — `scripts/site-url.mjs` swaps the placeholder origin for `VITE_SITE_URL` in
   `dist/index.html`, `dist/robots.txt` and `dist/sitemap.xml`. With the variable unset the
   placeholder is kept, so a local build is always safe.
6. `verify-build` — `scripts/verify-build.mjs` reads the finished `dist/` and fails
   the build (`exit 1`) if anything essential is missing.

The prerender step is **non-fatal by design**. If it fails, it warns, leaves the
client-only HTML in place, and exits `0` — because the client bundle can build the
page perfectly well on its own. A prerender problem must never block a deploy.

The verify step, by contrast, **is** fatal. It reads the finished `dist/` and checks the
things that would otherwise fail silently in a browser rather than loudly at build time:

- the reveal boot script, the LCP hero preload (with `fetchpriority="high"`) and the root
  mount point are present in `dist/index.html`;
- the app placeholder was replaced, and key prerendered copy is really in the HTML — the
  hero heading, the exact enquiry sentence, the demo notice, the structured data and every
  in-page nav target — so a prerender regression cannot ship an empty page;
- the assets `public/` is supposed to ship are all there (icons — including the maskable
  one — manifest, `robots.txt`, `sitemap.xml`, `og-image.webp`);
- the canonical origin is consistent: `dist/index.html`, `dist/robots.txt` and
  `dist/sitemap.xml` all agree, and when `VITE_SITE_URL` is set, no `.example` placeholder
  survives anywhere in the built HTML;
- every image path referenced by the generated `src/data/images.ts` exists in
  `public/images/`, *and* the preloaded hero file is one of them.

That last check matters more than it looks: both the dev server and a static host's SPA
rewrite answer a missing image path with `index.html` and a `200`, so a stale or mistyped
image would show HTML rendered into an `<img>` instead of erroring.

It needs no browser and no extra dependency, so it also works as a CI gate on its own.

---

## Technology

| Concern | Choice | Why |
|---|---|---|
| Framework | React 19 + TypeScript | — |
| Build | Vite 8 | Fast, and trivially deployable as static files |
| Styling | Tailwind CSS 4 (CSS-first `@theme`) | Tokens live in `src/styles/globals.css`, not a JS config |
| Motion | **Motion for React** | Entrances, hover, overlays, filters, the intro sequence, solar progress, the cursor accent |
| Pinned scene | **GSAP + ScrollTrigger** | Used in exactly one place: the café story |
| Icons | lucide-react | Tree-shaken; brand logos are drawn locally instead |
| Fonts | `@fontsource` Cormorant Garamond + DM Sans | Self-hosted: no third-party requests |
| Images | `sharp` build pipeline | WebP + AVIF, graded, with LQIP placeholders |
| Tests | Vitest + Testing Library | Pure logic lives in `src/lib` and is tested there |

There is **no router, no state library, no WebGL, and no backend.**

### Motion ownership (an explicit rule in the PRD)

Two animation systems coexist, and no property is ever animated by both:

- **CSS + IntersectionObserver** — scroll reveals, the image aperture, the kinetic hero
  words and the solar arc surfaces (`src/styles/motion.css`, `src/hooks/useReveal.ts`).
  Reveals are CSS so they never cost a frame of JavaScript, and they keep the markup
  readable if JavaScript fails.
- **Motion for React** — hover/press states, overlays and dialogs, the mobile nav, menu
  filter and preview transitions, the magnetic CTA, hero parallax, the solar progress
  rail, the cursor accent and the intro sequence.
- **GSAP ScrollTrigger** — *only* the pinned horizontal café-story scene, and only on
  a wide viewport without reduced motion. Every transform inside that section is owned
  by GSAP and nothing else.

The **intro gate** is a small coordination point rather than a third system: while
`IntroSequence` plays it sets `data-intro="playing"` on the root, and CSS holds the
hero's kinetic words and aperture at their start state. Removing the attribute on
finish releases them as a single gesture. If JavaScript never runs the attribute is
never set, so nothing is ever held.

---

## Project structure

```
index.html                 SEO/OG meta, the LCP image preload, and the reveal boot script
vercel.json                Static deploy config, caching and security headers
PRD.md                     The specification this build implements
CREDITS.md                 Generated attribution table for every photograph

scripts/
  discover-images.mjs      Searches Wikimedia Commons and builds contact sheets
  build-images.mjs         Downloads, grades, resizes, encodes, writes the manifest + credits
  build-icons.mjs          Generates the PNG app icons (incl. the maskable one) + manifest
  prerender.mjs            Injects the server-rendered markup into dist/index.html
  site-url.mjs             Swaps the placeholder origin for VITE_SITE_URL in the built output
  verify-build.mjs         Post-build gate: fails the build if anything essential is missing

src/
  app/App.tsx              Section composition + structured data
  main.tsx                 Client entry (hydrate or mount)
  entry-server.tsx         Server entry used only by scripts/prerender.mjs
  sections/                One file per PRD section, plus IntroSequence and MarqueeBand
  components/              Reusable pieces: buttons, dialogs, gallery, menu, navigation…
    atmosphere/            The solar arc: SunRing, HourMark, SolarProgress, LightSweep
    animations/            Reveal, MaskedLines, KineticHeading, Marquee
    interactive/           CursorAccent
    media/                 Picture and the ImageFrame aperture wrapper
  hooks/                   useReveal, useFocusTrap, useScrollLock, useMediaQuery, …
  lib/                     Pure, tested logic: whatsapp, reservation, menu, format, maps, seo
  data/                    All content and configuration (see below)
  styles/                  globals.css (tokens + the solar arc hours), typography.css, motion.css
```

---

## Demo values to replace

All business information funnels through a small number of files. **No component
contains a hard-coded address, price or phone number.**

### 1. `src/data/cafe.ts` — the single source of truth

| Value | Shipped demo value | Replace with |
|---|---|---|
| `whatsappNumber` | `918468902367` | The café's WhatsApp number, digits only, international format — **already configured** |
| `phoneDisplay` | `+91 00000 00000` | The number as you want it shown |
| `phoneHref` | `+910000000000` | The same number for `tel:` links |
| `email` | `hello@sol-cafe.example` | A real, monitored address |
| `instagramUrl` | `https://www.instagram.com/` | The café's profile URL |
| `googleMapsUrl` | A directions search for the demo address | A verified map destination |
| `addressLines`, `locality`, `region`, `postalCode`, `country` | A Pune address | The real address |
| `reservationEnabled` | `true` | `false` if the café does not take reservations |
| `reservationMaxPartySize` | `12` | The largest party you will seat |
| `isDemoContent` | `true` | `false` once every value above is real |
| `openingHours` | Mon–Fri 8–10, Sat–Sun 8:30–11 | The verified weekly schedule |

### 2. Content files

- `src/data/menu.ts` — items, prices, categories, dietary labels, badges, availability.
- `src/data/story.ts` — the three café-story chapters.
- `src/data/gallery.ts` — the gallery and the two team portraits.
- `src/data/images.ts` — **generated**; never edit by hand.

### 3. Site metadata

Titles, descriptions and Open Graph tags live in `index.html` (static, so crawlers see
them without JavaScript). `src/lib/seo.ts` generates the JSON-LD `CafeOrCoffeeShop`
structured data from `cafeConfig`, so the markup can never describe a different café
than the page does.

The origin in those tags (and in `robots.txt` / `sitemap.xml`) is **not** edited here — it
is the `VITE_SITE_URL` build variable, substituted at build time. See
[Set the canonical URL](#set-the-canonical-url).

---

## Photography

All 25 photographs are openly licensed and used here as demonstration content. Every
one is downloaded, colour-graded to a single warm editorial grade, resized and encoded
to **WebP and AVIF** (139 files each, ~24 MB total) by a build script.

```bash
npm run images   # re-runs the whole pipeline
```

**To swap the photography**, edit the `SELECTION` list in `scripts/build-images.mjs` —
that array is the one place that decides which images exist — then run `npm run images`.
The script writes `src/data/images.ts` and `CREDITS.md` for you.

You can also drop replacements into `assets-src/raw/` under the same file names and
re-run, without touching the selection list at all.

`CREDITS.md` records the title, author, licence and source URL of every asset. CC BY and
CC BY-SA assets require attribution, and the shipped credits satisfy that requirement.
**If you replace an image, update or remove its row there.**

### App icons

The favicon, `apple-touch-icon`, the 192/512 app icons, a dedicated 512 **maskable** icon
and `site.webmanifest` are generated from the café wordmark by a small script, so they
never drift from the brand:

```bash
npm run icons   # rewrites public/*.png and public/site.webmanifest
```

The maskable icon is drawn separately rather than reusing the rounded-square icon: Android
crops a maskable icon to its own launcher shape, so the mark is scaled into the central
safe zone (a full-bleed espresso field with the ring well inside the 80% circle). Marking
the ordinary icon maskable would have produced a badge floating inside a ring.

`index.html` links the icons root-relative, and the Open Graph / Twitter images use the
absolute canonical origin that `scripts/site-url.mjs` substitutes at build time — so link
previews resolve from any host.

---

## Mobile and Android

The layout is mobile-first, but a few things are handled specifically for Android (and
touch devices generally), because they are the details that make a site feel native
rather than merely responsive:

- **Safe-area insets.** `viewport-fit=cover` is set, so the page draws edge to edge. The
  fixed header, the scroll-progress rail, the mobile nav, the dialogs, the lightbox and the
  footer all pad themselves with `env(safe-area-inset-*)`, and `container-sol` folds the
  left/right insets into its gutters for landscape cutouts. Without this, an installed
  (standalone) web app would tuck its wordmark under the status bar and its last line under
  the gesture bar.
- **Touch feedback.** A tray of hover-only affordances would feel inert under a finger, so
  `-webkit-tap-highlight-color` is tinted to the palette's terracotta and links and buttons
  dim briefly on `:active` — but only where `(hover: none)`, so a desktop click never
  double-applies it.
- **No focus zoom.** Form fields and the menu search are 16px, the threshold below which
  mobile browsers may zoom the layout when a field takes focus.
- **No scroll chaining.** Overlay scroll containers use `overscroll-behavior: contain`, so
  running out of content inside a dialog does not drag the page behind it.
- **A lighter GPU budget.** The large decorative sun discs carry a 46–54px blur on wide
  screens; on phones the radius is cut to 26px and the header's backdrop blur is dropped
  for a more opaque surface, since both are expensive to re-composite on a mid-range GPU.
- **Installability.** The manifest declares `display: standalone`, an `id`, `lang`/`dir`, and
  a maskable icon, so "Add to Home screen" produces a proper icon instead of a letterboxed
  crop.

---

## Deploying

The build output in `dist/` is completely static. `vercel.json` is included and:

- runs `npm run build` and publishes `dist/`;
- sends long-lived immutable cache headers for `/assets/*` and `/images/*`;
- adds `X-Content-Type-Options`, `X-Frame-Options` and `Referrer-Policy`;
- rewrites unknown paths to `index.html`.

For any other static host, run `npm run build` and serve `dist/` — no server runtime is
needed.

### Set the canonical URL

`index.html`, `robots.txt` and `sitemap.xml` ship a reserved `sol-cafe.example`
placeholder, because a static host cannot know the origin it will be served from. Set the
origin once and the build swaps it through everywhere:

```bash
VITE_SITE_URL=https://your-domain.example npm run build
```

On Vercel, add `VITE_SITE_URL` as a project environment variable (Production and Preview)
rather than inlining it in the command. If it is left unset the placeholder is kept —
nothing breaks, but social cards and the sitemap point at a domain that does not resolve.

### Deploying with the Vercel CLI

```bash
npx vercel login                         # one-off, interactive
npx vercel link                          # create/link the project
npx vercel                               # first preview deploy — prints the project URL
npx vercel env add VITE_SITE_URL production   # paste https://<project>.vercel.app
npx vercel --prod                        # production, now with the right canonical origin
```

The first preview deploy is what tells you the real `*.vercel.app` origin; setting the
environment variable afterwards and running `vercel --prod` is the point at which social
cards and the sitemap start resolving.

Vercel installs dependencies and runs `npm run build` in its own environment, so nothing
in `dist/` or `node_modules/` is uploaded — and `.vercelignore` keeps the ~20 MB of raw
source photography in `assets-src/` out of the upload as well.

Prefer continuous deployment? Push the repository to GitHub and import it in the Vercel
dashboard with build command `npm run build` and output directory `dist`; `.gitignore`
already excludes the build output and `.vercel/`.

### A note on the inline script and CSP

`index.html` contains one small inline script in `<head>`:

```html
<script>document.documentElement.classList.add("js");</script>
```

Scroll reveals are opt-in: elements are only hidden *after* this script has run, so a
visitor with JavaScript disabled — or whose bundle fails to load — sees the whole page
immediately, and nothing is ever trapped behind an animation. It runs before first
paint, so there is no flash of visible-then-hidden content.

**This project ships no Content-Security-Policy.** If you add one, it must allow this
inline script — either by hash, by nonce, or by permitting `'unsafe-inline'` for
scripts. Otherwise every `[data-reveal]` element will stay hidden.

---

## Accessibility and motion

- **Touch targets** are at least 44×44px, and no action depends on hover. (Inline links
  that sit inside a sentence are the one exception, per WCAG 2.5.8.)
- **Colour is measured, not assumed.** The solar-arc surfaces are built from nine hourly
  base colours plus light washes, and every translucent text tone in the build is checked
  against the *worst* corner of the wash it can land on, not an average. No real text sits
  below ~`70%` alpha, and three palette samples were darkened because they only cleared
  the graphical `3:1` bar as written (`coffee`, `olive`, and a `terracotta-deep` used for
  the reservation form's error message). The display headings count as large text
  (`3:1`); everything else is held to `4.5:1`. See
  [Verifying contrast](#verifying-contrast).
- **Every overlay** (menu detail, mobile nav, gallery lightbox) traps Tab focus, closes
  on Escape, and restores focus to the control that opened it.
- **The pinned story scene** contains no interactive elements at all, so a keyboard user
  tabs straight past it and can never be trapped inside it.
- **Reduced motion removes movement without removing content.** The intro title card is
  skipped, the marquee becomes a static line, the scroll cue stops, the image apertures
  open fully with no transition, the kinetic words resolve to their final position, the
  light sweep is simply absent, the cursor accent and solar progress rail are not
  rendered, the pinned scene never initialises, and parallax is disabled. Nothing is
  hidden and nothing is cropped.
- **Dietary labels** are rendered strictly from the café's own data. The interface never
  infers vegan, gluten-free or allergen-free status from an item's name — an item with no
  labels shows none, and the detail sheet tells the visitor to ask.
- **Editorial headings read as sentences.** The display type is split across lines for art
  direction, so each heading derives an accessible name from those lines
  (`src/components/animations/MaskedLines.tsx`). A screen reader announces
  *"A little Slower. A little Better."*, not the four visual fragments.
- **Unavailable items** are rendered with an explicit "Currently unavailable" state
  rather than as a broken card.
- **No live open/closed status.** A static, readable schedule is preferred to a badge
  that could be wrong.
- **The reservation flow is an enquiry**, never a booking. The confirmation reads
  *"Your enquiry is ready to send. Your reservation is not confirmed until the café
  replies."* and the message itself states it is not a confirmation.
- **WhatsApp has real fallbacks.** If no plausible number is configured, no WhatsApp link
  is rendered at all and the phone number and email are shown instead. When it *is*
  configured, the number and email are still shown beneath it, because opening a
  messaging app can fail for reasons the page cannot detect.

---

## Deliberately out of scope

The following are P2 in the PRD and are **not** implemented — and the interface never
implies they exist:

- Online ordering, payments or inventory.
- Live table availability, booking persistence or cancellation.
- A live open/closed status badge (a static schedule is used instead).
- A live Instagram feed (a fixed set of local photographs is used instead).
- WebGL / Three.js scenes.
- A backend of any kind.

---

## Testing

```bash
npm test
```

The suite covers the logic that is easy to get subtly wrong and expensive to get wrong
in production:

- WhatsApp URL construction, encoding, and the empty/implausible-number fallback.
- INR, time and date formatting, including split opening hours and impossible dates.
- Reservation validation — required fields, past dates, party-size bounds, contact
  format, note length — and the exact wording of the enquiry message and confirmation.
- Menu filtering, search, featured/seasonal selection and empty results.

### What unit tests cannot cover

Some guarantees are only true in a real browser. Re-run these by hand after touching
motion, the overlays, or the reservation flow:

- **Overlays lock the page.** With the menu detail sheet, the mobile nav, or the gallery
  lightbox open, a mouse-wheel gesture must not scroll the page behind it, and closing it
  must release the lock immediately. (This is a real regression risk: `overflow: hidden`
  boxes are still scrollable programmatically, so it takes a genuine wheel gesture to
  catch.)
- **Focus is never lost.** Tab wraps within an open overlay, Escape closes it, and focus
  returns to the control that opened it.
- **The pinned story traps nobody.** With the story pinned, Tab moves straight past the
  section to the next link, and the mobile/reduced-motion layouts stack the chapters as
  ordinary scroll content.
- **Reduced motion keeps every word.** With `prefers-reduced-motion: reduce`, the marquee
  becomes static, the story never pins, reveals resolve instantly, and all copy is
  visible.
- **The page stays light.** With the OS in dark mode, the site remains on its light
  palette rather than flashing or inverting.
- **The enquiry never overclaims.** Submitting the form shows the exact sentence *"Your
  enquiry is ready to send. Your reservation is not confirmed until the café replies."*
  and the prepared WhatsApp message states that it is not a confirmation.
- **The solar arc advances.** Each section carries its own `data-hour`; scrolling from the
  hero to the footer should move through nine distinct surfaces — `dawn → morning → noon →
  afternoon → golden → dusk → evening → night → deep-night` — and the footer should land in
  the darkest hour. If two adjacent sections look identical, an hour attribute has been
  dropped.
- **Text over photographs stays legible.** The hero headline, the hero's intro line and
  the menu preview's item name all sit over photographs behind scrims; each should stay
  clearly readable as the image changes (they measure ~12:1, ~7:1 and ~11:1 respectively).
- **The intro hands off once.** The title card plays, the page unlock releases at the end,
  and the hero's words and image resolve exactly once — no re-trigger on the first scroll.
- **The menu preview is decoration.** Hovering a list row cross-fades the sticky preview,
  but every item's photograph and details remain reachable from the list and the detail
  sheet without ever hovering.
- **On a real Android device, or installed to the home screen.** The wordmark must clear
  the status bar and the footer's closing line must clear the gesture bar; a tap on a link
  should flash the terracotta highlight; and focusing the menu search or a reservation field
  must not zoom the page. Headless Chrome reports every safe-area inset as `0`, so this one
  genuinely needs a device (or DevTools device mode on a notched preset).
- **The canonical origin is replaced.** After `VITE_SITE_URL=… npm run build`, no
  `sol-cafe.example` string should remain in `dist/index.html`, `dist/robots.txt` or
  `dist/sitemap.xml`.

### Verifying contrast

The measurements above were taken with a temporary, throwaway harness (headless Chrome
via `puppeteer-core`, plus `sharp` for pixel sampling) that is **not** committed. It:

1. modelled each hour's worst-case composited background analytically and checked every
   translucent text tone against it (4.5:1 for body text, 3:1 for large text and
   decorative graphics);
2. sampled the *rendered* pixels of each `data-hour` surface to confirm the light hours
   stay light and the dark hours stay dark;
3. screenshotted specific text elements over photographs and read their luminance range
   to measure the real contrast; and
4. submitted the reservation form empty to measure the rendered error message.

To re-check after a change to the palette or the hours, verify the rendered background of
each hour, and the error message on the reservation form, in a browser with the OS set to
`prefers-reduced-motion: reduce`.
