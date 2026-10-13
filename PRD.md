# PRODUCT REQUIREMENTS DOCUMENT (PRD)
# SŌL — Coffee & Slow Living
## An immersive, motion-led digital experience for a premium specialty café

**Document version:** 1.0  
**Product type:** Premium café website  
**Primary platform:** Responsive web  
**Design direction:** Editorial luxury × cinematic storytelling × experimental typography  
**Development stack:** React, Vite, TypeScript, Tailwind CSS, custom CSS, Motion for React  
**Optional advanced animation tooling:** GSAP  
**Target market:** Pune, India  
**Status:** Proposed specification

---

# 1. Product Overview

## 1.1 Product vision

SŌL is a fictional specialty café built around the idea of slow living: exceptional coffee, thoughtful food, natural materials, intimate spaces, and meaningful moments.

The website must translate this physical experience into a digital one.

A visitor should not feel as though they are browsing a conventional business website. They should feel as though they have entered SŌL's world.

The first screen should establish the brand's personality through cinematic imagery, expressive typography, carefully choreographed motion, and an unmistakable visual composition.

As visitors explore, the experience should evolve into a narrative about the café, its coffee, its food, its space, and its people. The journey should eventually lead to a practical action: exploring the menu, finding directions, contacting the café, requesting a reservation, or enquiring about takeaway.

The website must combine three qualities:

1. **Art-direction quality:** A distinctive, memorable visual identity.
2. **Interaction quality:** Fluid, responsive and delightful interactions.
3. **Business quality:** A usable website that helps customers visit or contact the café.

## 1.2 Core product concept

**Brand:** SŌL  
**Full name:** SŌL — Coffee & Slow Living  
**Tagline:** A little slower. A little better.  
**Brand personality:** Warm, artistic, considered, intimate, modern and quietly unconventional.

**Central creative idea:**

> The internet moves fast. Your coffee doesn't have to.

The entire website should express this contrast: dramatic digital movement paired with calm photography, spacious layouts, warm colors and restrained moments of stillness.

The motion can be bold. The experience should remain comfortable.

## 1.3 Product objectives

The website must:

- Make an immediate visual impression during the first few seconds of a visit.
- Communicate the café's identity without requiring visitors to read extensive copy.
- Present the food and beverage menu in an attractive, accessible format.
- Make practical information easy to find.
- Encourage visitors to visit the café or initiate contact.
- Deliver a highly polished mobile experience.
- Remain fast and usable despite ambitious animation.
- Be structured so the business can update its menu, photos, hours and contact details without redesigning the entire website.

## 1.4 Success criteria

The project will be considered successful when:

- The visual identity is consistent across every section.
- The opening experience is distinctive and visually polished.
- All navigation, filters, links and interactive elements work.
- Visitors can reach the menu and location information quickly.
- Booking enquiries and WhatsApp links use configurable business details.
- Mobile, tablet and desktop layouts are deliberately designed and tested.
- Motion respects reduced-motion preferences and does not block normal navigation.
- Performance and accessibility targets are met on representative mobile devices.
- The codebase is maintainable and ready for future features.

---

# 2. Assumed Brand and Business Information

All information in this section is fictional demonstration content.

| Property | Assumed value |
|---|---|
| Café name | SŌL |
| Brand category | Specialty coffee and contemporary café |
| Location | Kalyani Nagar, Pune, Maharashtra |
| Positioning | Premium, design-conscious neighbourhood café |
| Target audience | Students, professionals, creatives, couples and coffee enthusiasts |
| Price positioning | Mid-to-premium |
| Approximate spend | ₹350–₹650 per person |
| Brand tagline | A little slower. A little better. |
| Primary conversion | Visit the café |
| Secondary conversions | WhatsApp enquiry, reservation request and menu exploration |
| Website language | English |
| Currency | Indian rupees (INR) |
| Primary visual colors | Espresso brown, warm ivory, muted olive and terracotta |
| Photography style | Natural light, cinematic shadows, tactile textures and editorial compositions |

## 2.1 Sample opening hours

- Monday–Friday: 8:00 AM–10:00 PM
- Saturday–Sunday: 8:30 AM–11:00 PM

These are sample values, not the verified hours of a real establishment.

The interface must display opening hours from centralized configuration rather than hardcoding them in multiple components.

## 2.2 Brand positioning

SŌL is not intended to feel like a large commercial coffee chain.

Its website should communicate:

- Attention to coffee preparation.
- An inviting physical atmosphere.
- Thoughtful food and beverage choices.
- A place to read, work, meet friends or spend time alone.
- A local identity with contemporary design sensibilities.

Avoid overusing coffee clichés such as endless coffee-bean backgrounds, generic brown gradients, stock illustrations of coffee cups, or repetitive latte-art imagery.

The website should feel art-directed, not assembled from a template.

---

# 3. Target Audience and User Needs

## 3.1 The visual explorer

This visitor discovers the café through social media or a shared link.

**Needs:**
- Understand the café's vibe immediately.
- See attractive photography.
- Discover what makes the café distinctive.
- Find the social media account and location.

**Desired journey:**

Landing page → immersive hero → café story → gallery → visit CTA.

## 3.2 The menu-first visitor

This visitor already knows about the café and wants to decide what to order.

**Needs:**
- Browse categories quickly.
- See item names, descriptions, prices and dietary labels.
- Identify signature drinks and bestsellers.
- Check whether suitable food options exist.

**Desired journey:**

Landing page → menu → category filter → selected item → visit or order enquiry.

## 3.3 The practical visitor

This visitor wants to know whether and when to visit.

**Needs:**
- Find the address.
- View opening hours.
- Open directions in Google Maps.
- Contact the café using WhatsApp.
- Understand the reservation process.

**Desired journey:**

Landing page → visit section → hours and address → directions or contact.

## 3.4 The returning customer

This visitor has already visited the café.

**Needs:**
- Find seasonal specials.
- Check new menu items.
- Revisit the location and contact information.
- Share the website with friends.

**Desired journey:**

Landing page → featured items or updated menu → contact or visit.

---

# 4. Scope and Feature Priorities

The website should be delivered in three implementation levels.

## P0 — Required for launch

- Cinematic homepage.
- Responsive navigation.
- Animated hero typography.
- Scroll-based storytelling.
- Interactive menu with category filters.
- Menu item photography and dietary labels.
- Café gallery.
- Opening hours and location.
- Google Maps directions.
- WhatsApp contact integration.
- Reservation enquiry flow.
- Footer with social links and business details.
- Responsive mobile layouts.
- SEO metadata and social sharing metadata.
- Accessibility, loading and error-state handling.
- Production deployment.

## P1 — High-value enhancements

- Seasonal menu highlights.
- Gallery lightbox.
- Reservation form with validation.
- Menu item detail overlays.
- Scroll progress indicator.
- Enhanced page transitions.
- Animated image masks and advanced text choreography.
- Menu search when the catalogue becomes large.
- Content management workflow.

## P2 — Optional experimental features

- WebGL or Three.js coffee visuals.
- Interactive 3D object exploration.
- Elaborate image distortion transitions.
- Cursor-responsive visual effects.
- Fully integrated reservation management.
- Online takeaway ordering and payment processing.
- Loyalty programme integration.

P2 work must not compromise the main customer journey, mobile performance or accessibility.

---

# 5. Information Architecture

## 5.1 Primary website structure

The initial product is a single, carefully art-directed homepage with anchored sections.

**Homepage sections:**

1. Introductory motion sequence
2. Cinematic hero
3. Brand statement
4. Signature coffee feature
5. Café story
6. Interactive menu
7. Food and beverage editorial feature
8. Atmosphere gallery
9. Community or people section
10. Visit and location
11. Reservation or contact CTA
12. Instagram and social section
13. Footer

**Supporting interfaces:**

- Responsive mobile navigation.
- Menu item details.
- Gallery lightbox.
- Reservation enquiry form.
- Reservation submission confirmation.
- WhatsApp contact actions.

A dedicated full menu page or individual landing pages can be added later if the amount of content or SEO strategy justifies them.

## 5.2 Navigation

The desktop navigation should remain deliberately minimal.

**Left:** SŌL wordmark  
**Centre or left-aligned links:** Our story, Menu, The space  
**Right:** Visit us CTA

The header should be transparent over the opening hero, then transition into a solid or softly opaque surface after scrolling.

The wordmark should remain recognizable throughout all header states.

On mobile, use a compact top bar with the brand mark and a menu control. The menu should open into a full-screen editorial navigation experience rather than a conventional tiny dropdown.

Navigation labels must remain understandable. Experimental typography can enhance the labels, but must not make them difficult to read or activate.

---

# 6. Detailed Homepage Requirements

## 6.1 Section A — The Introductory Sequence

**Purpose:** Introduce the visual language before revealing the main page.

### Desired experience

On initial load, the screen briefly presents a warm, textured surface with the SŌL wordmark.

The wordmark appears through a refined opacity and movement transition. A line of microcopy appears beneath it.

The surface then reveals the hero through a carefully choreographed transition, such as a vertical clip reveal or a masked image expansion.

The sequence should feel like a magazine opening or a film title card.

### Motion specifications

- Wordmark reveals with a small vertical movement and opacity transition.
- A thin line or typographic detail expands around the mark.
- The hero image reveals through a mask or clip-path transition.
- The transition resolves into the normal page without a visible jump.

### Functional requirements

- No blocking preloader unless assets genuinely require one.
- The introduction must not delay access to navigation or content unnecessarily.
- Returning visitors should not repeatedly encounter an elaborate intro if that would slow their journey.
- Respect reduced-motion preferences.
- If animation assets fail to load, show the finished hero immediately.

**Priority:** P0.

## 6.2 Section B — Cinematic Hero

This is the most important visual element on the website.

### Layout

- Approximately full viewport height on desktop.
- Large, carefully composed background photograph or short muted video.
- Wordmark integrated into the design.
- Oversized display typography.
- Minimal navigation.
- Clear menu and visit calls to action.
- Small editorial location or opening-hours detail.

Use dynamic viewport sizing with suitable mobile fallbacks so the layout behaves correctly when mobile browser controls expand and contract.

### Hero copy

**Eyebrow:**

PUNE, INDIA · SPECIALTY COFFEE

**Main headline:**

A LITTLE  
SLOWER.  
A LITTLE  
BETTER.

**Supporting copy:**

Thoughtfully brewed coffee, beautiful things to eat, and a space to stay a little longer.

**Primary CTA:** Explore the menu

**Secondary CTA:** Find your corner

### Typography treatment

The headline should not appear as a simple block of centered text.

It can be asymmetrical, with oversized serif words, tightly controlled line breaks and selective overlap with the image.

For example:

- “SLOWER.” occupies the majority of the visual width.
- “A LITTLE” appears in a smaller italic treatment.
- “BETTER.” enters with a controlled stagger.
- The last line can sit close to the lower edge of the hero while retaining adequate spacing from the CTA.

The typography should work in relation to the photography rather than being positioned independently of it.

### Hero animation

1. Background image or video begins in a slightly enlarged, cropped state.
2. The hero image gradually reaches its intended scale.
3. Text lines reveal sequentially using clipped overflow containers.
4. Individual words move by a small distance while changing opacity.
5. CTA elements appear after the headline establishes itself.
6. A subtle scroll indicator emerges near the bottom edge.

On scroll, the headline can respond to page movement by changing its position or opacity, while the image moves more slowly to create a sense of depth.

Keep effects bounded. The visitor should remain in control of scrolling.

### Background media requirements

- Prefer original café photography or professionally licensed assets.
- Use a dedicated optimized poster image.
- If video is used, it must work without sound and support an image fallback.
- Video must not autoplay with sound.
- Avoid large media files that block rendering.
- Ensure text contrast under all image crops.

**Priority:** P0.

## 6.3 Section C — Brand Statement

**Purpose:** Transition from the dramatic hero into a more intimate editorial moment.

### Copy

**Small label:** A SMALL INVITATION

**Headline:**

NOT EVERY MOMENT  
NEEDS TO BE  
PRODUCTIVE.

**Body:**

Some are meant for another cup of coffee. A conversation that runs longer than expected. A page in a book you don't want to finish.

SŌL is a neighbourhood café built around the beauty of slowing down.

### Layout

Use a warm ivory background, substantial vertical spacing and a deliberately composed text block.

The words should occupy a large part of the screen without feeling crowded.

A small secondary photograph or handwritten-style annotation can complement the composition.

### Motion

- Text reveals through a mask.
- Lines enter at slightly different intervals.
- An adjacent image drifts into view from the side.
- A short typographic annotation appears last.

Use one coherent reveal sequence rather than animating each word with a different effect.

**Priority:** P0.

## 6.4 Section D — Signature Coffee

**Purpose:** Establish the quality and personality of the café's offering.

### Copy

**Label:** THE DAILY RITUAL

**Headline:**

GOOD COFFEE.  
NO SHORTCUTS.

**Body:**

Carefully selected beans. Thoughtful preparation. Drinks made to be enjoyed, not rushed.

### Visual concept

Create a split editorial composition:

- One side presents the headline and short description.
- The other contains an expressive image of espresso extraction, a barista preparing coffee or a ceramic cup on a textured surface.
- Supporting metadata can identify the coffee selection or preparation method.

### Interaction

On desktop, the image may use subtle scroll-linked movement. A small label can change opacity or position as the visitor passes the section.

Do not use hover to expose essential explanatory content. The experience must remain complete on touchscreen devices.

### Optional advanced detail

A small decorative coffee-ring motif or curved graphic can be used as an SVG. It should be lightweight and tied to the brand's visual language.

**Priority:** P0.

## 6.5 Section E — Café Story

**Purpose:** Explain why SŌL exists.

This section can be the first major scroll-driven storytelling sequence.

### Structure

The content should describe the café through three themes:

**01 — The coffee**

Thoughtful sourcing, consistent preparation and a respect for the craft.

**02 — The space**

Natural materials, comfortable seating, soft light and an environment that encourages people to stay.

**03 — The people**

The people who prepare the coffee, create the food and make the café welcoming.

### Visual direction

Use a sequence of large photographic compositions rather than conventional cards.

A desktop experience could have a featured image beside large typography, with the text and image transitioning as the visitor moves down the story.

A pinned scene is acceptable if it improves the narrative, but it must have a normal-flow mobile equivalent.

### Advanced motion

- Image masks expand as sections enter the viewport.
- Captions move into view with their corresponding photographs.
- Small labels or numbers change as the active chapter changes.
- The background transitions between related warm color surfaces.
- The visual focus shifts from one image to another rather than animating every element simultaneously.

### Functional requirements

- Each story chapter must have semantic heading structure.
- Images require meaningful alternative text when informative.
- Pinned content must not prevent keyboard users from reaching subsequent content.
- The section must remain readable without any animation.

**Priority:** P0 for storytelling; advanced pinning is P1.

## 6.6 Section F — Interactive Menu

**Purpose:** Make the menu attractive without sacrificing usability.

### Heading

**Label:** SOMETHING TO SAVOR

**Headline:**

YOUR NEXT  
FAVOURITE.

### Menu categories

- All
- Coffee
- Tea
- Cold drinks
- Food
- Desserts

Categories should be configurable. Do not assume every café has the same assortment.

### Menu item display

Each item should support:

- Item name.
- Description.
- Price in INR.
- Category.
- Photograph, where available.
- Dietary labels.
- Optional bestseller or seasonal badge.
- Optional availability status.
- Optional featured-item status.

### Sample menu data

All prices and products below are illustrative.

| Item | Category | Sample price | Label |
|---|---|---:|---|
| SŌL Signature Latte | Coffee | ₹240 | Bestseller |
| Flat White | Coffee | ₹220 | Vegetarian |
| Vanilla Bean Cold Brew | Cold drinks | ₹260 | Signature |
| Iced Matcha Latte | Tea | ₹280 | Vegetarian |
| Hazelnut Brownie | Desserts | ₹190 | Vegetarian |
| Butter Croissant | Food | ₹180 | Vegetarian |
| Avocado Toast | Food | ₹320 | Vegetarian |
| Chocolate Sea Salt Cookie | Desserts | ₹140 | Bestseller |

Dietary labels must accurately reflect actual recipes. The website must never infer vegan, gluten-free or allergen-free status from an item's name.

### Layout

On desktop, use a flexible editorial grid rather than identical cards everywhere.

Possible arrangement:

- One large featured item.
- Two smaller items beside it.
- A clean list-style menu for secondary items.
- Large photographs interspersed with typography.
- A distinct seasonal special section.

On mobile, use a simpler single-column or compact two-column layout depending on available space and image aspect ratios.

Text and prices must remain easy to scan.

### Category-filter behavior

When a visitor selects a category:

1. The active category receives a clear selected state.
2. The visible menu items update immediately.
3. Item transitions use a short fade or staggered movement.
4. The layout must not jump unexpectedly.
5. The selected filter must be communicated semantically to assistive technology.

Filters must work by touch, keyboard and pointer.

Add an “All” state that always restores the complete menu.

### Menu item interaction

Hovering over a desktop item may reveal a subtle image zoom, animated arrow or underline.

Clicking or tapping an item can open a detail overlay containing:

- Larger image.
- Item name.
- Description.
- Price.
- Dietary information.
- Availability, when maintained by the café.

On mobile, use a sheet or full-screen detail layout that is easy to close.

### Search and availability

Menu search is optional for the initial catalogue, but the data model should support it.

Unavailable items must be handled explicitly. Do not leave an empty photograph or broken item card in the grid.

### Ordering decision

The initial release must not pretend to support online checkout.

For the MVP, a menu item can offer a pre-order or enquiry action through WhatsApp when the café supports it. The order request should include the item name and relevant details.

A fully functional ordering system requires additional inventory, price validation, order status, payment and backend functionality, which are outside the minimum scope.

**Priority:** P0.

## 6.7 Section G — Food Editorial Feature

**Purpose:** Add a change of visual rhythm and showcase the non-coffee menu.

### Headline

MADE TO  
GO TOGETHER.

**Supporting copy:**

Freshly prepared plates, indulgent little treats and the perfect excuse to stay for another cup.

### Visual direction

Use a full-width food photograph or an offset image composition.

Photography can transition between a plated pastry, hands serving food and a wide table scene.

Text should be incorporated into the layout with strong hierarchy, not placed in a generic translucent box.

### Optional interaction

A featured dish name can appear as a caption when its photograph enters the viewport.

The interaction should not hide the food image or require hovering.

**Priority:** P0 if food is part of the café's offering; otherwise replace this section with an appropriate drinks or merchandise story.

## 6.8 Section H — The Space: Photo Gallery

**Purpose:** Let visitors experience the café's atmosphere before arriving.

### Content

The gallery should include a curated collection of approximately six to ten photographs, subject to the available assets:

- Wide interior view.
- Seating details.
- Counter and coffee machine.
- Morning light.
- Food and drinks.
- Close-up material textures.
- People enjoying the space, where properly authorized.

### Layout

Use an asymmetrical editorial image grid.

Images should vary in their intended visual scale while remaining aligned to an underlying spacing system.

Avoid the appearance of an automatic photo feed.

### Interaction

- Subtle image reveal as the gallery enters the viewport.
- Gentle image scaling on hover for desktop.
- Lightbox on click or tap.
- Previous and next controls within the lightbox.
- Escape key closes the lightbox.
- Focus remains properly managed.
- Swipe support may be offered on mobile.

### Mobile behavior

Reflow the gallery into a deliberate sequence. Do not simply shrink the desktop collage and leave images too small.

**Priority:** P0 for the gallery; lightbox can be P1 if time is limited.

## 6.9 Section I — The People Behind SŌL

**Purpose:** Make the brand feel human.

### Copy

**Label:** THE PEOPLE, ALWAYS

**Headline:**

GOOD THINGS  
ARE MADE  
TOGETHER.

**Body:**

Behind every cup is a person who cares about getting the small things right.

### Content

Use real staff photography, short founder notes or a brief explanation of the team's approach to coffee and hospitality.

If approved staff photography or biographies are unavailable, keep this section small rather than inventing factual claims about a real business.

### Motion

Use a documentary-style image reveal and small, expressive captions.

The overall pace should be calmer than the hero, giving the visitor a moment of stillness after the gallery.

**Priority:** P1.

## 6.10 Section J — Visit SŌL

**Purpose:** Convert interest into a visit.

This section must be practical, legible and easy to access.

### Heading

**YOUR CORNER  
IS WAITING.**

### Information displayed

- Full address.
- Opening hours.
- Phone or WhatsApp contact.
- Directions link.
- Reservation information.
- Accessibility information, when verified.
- Available transport or parking information, when verified.

### Location interaction

Include a clear “Get directions” action that opens Google Maps using a configured address or verified map destination.

A visible map embed is optional. A map is not necessary if a lightweight image or directions link provides a better experience.

### Opening-hours display

Show the weekly schedule clearly, with separate weekday and weekend rows where appropriate.

If live open/closed status is implemented, it must:

- Use the café's local time zone.
- Correctly handle days with split hours.
- Account for exceptional holiday closures only when those are maintained.
- Avoid claiming the café is open when current hours are unknown.

A static schedule is preferable to inaccurate live status.

### Reservation and contact actions

Provide two distinct actions where supported:

- Reserve a table
- Chat on WhatsApp

If the café does not operate reservations, replace the reservation action with an appropriate contact or visit action.

**Priority:** P0.

## 6.11 Section K — Reservation Enquiry

The initial version should support a real enquiry flow without requiring a complex booking-management system.

### Fields

- Name.
- Party size.
- Requested date.
- Requested time.
- Optional contact number.
- Optional additional notes.

Required fields should be clearly identified.

The form must validate all required inputs and reject invalid dates or unsuitable party sizes.

### Submission behavior

For the MVP, the user may submit the request through a prefilled WhatsApp message.

The message should summarize the requested date, time, party size and name.

The website must not claim that a reservation is confirmed merely because WhatsApp opened or the message was prefilled.

The confirmation interface should state:

“Your enquiry is ready to send. Your reservation is not confirmed until the café replies.”

### Error handling

- If a required field is missing, show a helpful field-level error.
- Preserve valid user inputs after an error.
- Prevent accidental repeated submissions.
- Provide a visible way to return to editing.
- If WhatsApp cannot open, display the contact details as a fallback.

### Future enhancement

A full reservation system can later include server-side validation, availability checks, booking persistence, notifications, cancellation and staff management.

These are not implied by the enquiry form.

**Priority:** P0 for enquiry; live availability and confirmed bookings are P2.

## 6.12 Section L — Social Connection

**Purpose:** Extend the visitor's relationship with the café beyond the website.

### Content

- Instagram profile link.
- A small curated collection of approved photographs.
- Short invitation to follow the café.
- Optional social proof, provided claims are authentic.

Avoid building a live Instagram feed that introduces unnecessary third-party scripts, layout shifts or reliability problems.

Use locally optimized editorial images unless a live integration is a clear business requirement.

**Priority:** P1.

## 6.13 Section M — Footer

The footer should feel like the final page of a beautifully designed magazine.

### Content

- SŌL wordmark.
- Short brand statement.
- Address.
- Opening hours.
- Menu link.
- Visit link.
- WhatsApp contact.
- Instagram profile.
- Copyright notice.
- Privacy policy link if personal information is collected.

### Visual direction

Use a dark espresso or warm charcoal surface, with oversized typographic treatment and a restrained final animation.

An oversized SŌL wordmark can occupy much of the lower screen.

The footer should remain easy to navigate and should not require a long animation to reach its links.

**Priority:** P0.

---

# 7. Motion and Animation Design System

This section is central to the product.

The intended experience is ambitious and expressive. The implementation should use a small number of exceptionally designed motion patterns rather than dozens of unrelated effects.

## 7.1 Motion principles

1. Every large animation must contribute to the brand or storytelling.
2. All important content must remain available without animation.
3. Interactions must respond promptly to user input.
4. Scrolling must remain under the visitor's control.
5. Animation must not impair readability or navigation.
6. Mobile motion must be intentionally adapted, not merely reduced through CSS overrides.
7. Expensive effects should be used selectively and measured on real devices.

## 7.2 Animation tiers

**Tier 1 — Global interaction motion**

Used throughout the site:

- Button hover and press states.
- Navigation transitions.
- Underline animations.
- Small image scale changes.
- Menu-filter transitions.
- Focus-state transitions.

These interactions should normally finish quickly, often within approximately 150–300 ms.

**Tier 2 — Editorial entrance motion**

Used for the major page sections:

- Masked text reveals.
- Image clipping.
- Staggered word entrances.
- Short image translations.
- Section opacity transitions.
- Decorative line drawing.

Typical durations may be approximately 400–900 ms, depending on the effect.

**Tier 3 — Signature cinematic motion**

Reserved for two or three memorable scenes:

- Hero text choreography.
- A substantial image-led story transition.
- An oversized typographic footer reveal.

These effects can run longer when their duration serves a deliberate narrative, but must not become a compulsory wait.

The specific timings should be refined during implementation and usability testing.

## 7.3 Required signature animations

### Animation A — Kinetic Hero Typography

The hero headline enters word by word.

Each word begins slightly offset and is revealed through a clipping container. Line timing should be carefully choreographed, with the final line landing as the focal point.

The animation should use typography as the principal visual event, rather than introducing numerous decorative particles or unrelated movement.

### Animation B — Image Aperture Reveal

A large photograph is initially concealed by a simple mask.

As the image enters the viewport, the mask expands to expose the image. The image itself may move a short distance or subtly change scale during the transition.

Use this pattern for hero and major story images, not every thumbnail.

### Animation C — Scroll-Synchronized Editorial Scene

One major desktop story section may use scroll-linked animation.

The scene could contain a heading, an image and three short narrative chapters.

As the visitor scrolls:

- The current chapter gains visual emphasis.
- The image changes scale or position.
- Supporting text transitions between chapters.
- A progress marker communicates the position within the story.

This should remain a normal vertical story on mobile or when reduced motion is preferred.

The implementation must avoid forcing the visitor to scroll through an unnecessarily long pinned scene.

### Animation D — Kinetic Marquee

A narrow editorial strip can display a repeated message:

“GOOD COFFEE · SLOW MORNINGS · STAY A LITTLE LONGER”

The strip moves continuously at a restrained speed.

Use this selectively between major sections. Avoid excessive motion, especially where visitors need to read surrounding content.

Pause the motion on hover or focus where appropriate, and provide a non-animated version for reduced-motion preferences.

### Animation E — Magnetic or Responsive CTA

On desktop, primary buttons can respond subtly to pointer proximity.

The movement should be small and must never cause the target to shift away from the user's expected click location.

Disable this effect on touch devices and reduced-motion settings.

Ordinary hover, active and focus states must remain sufficient.

### Animation F — Oversized Footer Wordmark

As the footer enters the viewport, an oversized wordmark reveals from below or through a clipping mask.

A thin line and a short brand phrase complete the composition.

After the reveal, the footer becomes entirely static and navigable.

## 7.4 Typography system

Typography must be treated as a core design asset.

### Recommended font pairing

**Display serif:** Cormorant Garamond  
**Body and UI:** DM Sans

These are starting choices rather than mandatory fonts. The final selection should be based on actual rendered compositions and available font weights.

### Type roles

| Role | Treatment |
|---|---|
| Hero headline | Oversized expressive serif |
| Section headlines | Large serif, with selected italic emphasis |
| Body copy | Clear sans-serif with comfortable line height |
| Navigation | Compact sans-serif with deliberate spacing |
| Eyebrow labels | Small uppercase type with tracking |
| Menu prices | Highly legible, consistent numeric treatment |
| Captions | Small, restrained supporting text |
| Decorative typography | Oversized words and occasional rotated labels |

### Typography behavior

- Use fluid typography with CSS `clamp()`.
- Set deliberate maximum line widths.
- Use negative letter spacing selectively for large display text.
- Use italics as a compositional detail, not throughout every paragraph.
- Prevent headings from colliding with photographs at intermediate widths.
- Ensure text remains readable when the animation is disabled.
- Load only the font weights actually used.
- Prefer local, optimized font files where licensing permits.

### Experimental typography

Appropriate treatments include:

- Oversized words that extend close to the viewport edges.
- Intentional asymmetry.
- Different scale relationships between adjacent words.
- Selective line overlap.
- Masked text transitions.
- Rotated labels used as editorial annotations.
- Variable-font weight changes, if the selected font supports them.

Do not use extreme typography for menu prices, addresses, opening hours or form controls.

Experimental display type and practical UI type must have distinct roles.

## 7.5 Motion implementation strategy

**Primary library:** Motion for React.

Use it for:

- Component entrance and exit.
- Staggered typography.
- Hover and tap states.
- In-view transitions.
- Layout animation.
- Scroll-linked transforms for straightforward scenes.

**Optional library:** GSAP.

Use it only if a specific scene requires more advanced, coordinated, scrubbed or pinned scroll timelines that are difficult to implement cleanly with Motion.

Do not use Motion and GSAP to animate the same properties on the same elements. Assign clear ownership to avoid conflicting animation state.

**Lenis:** Optional, not required for launch.

Start with native browser scrolling. Add a smooth-scroll utility only if testing demonstrates a meaningful benefit and keyboard behavior, anchor navigation and reduced-motion support continue to work correctly.

**Three.js:** Not required for the initial release.

Use 3D only if a meaningful creative concept emerges. A sophisticated two-dimensional experience is preferable to unnecessary GPU-heavy effects.

---

# 8. Responsive Experience

The website must be designed for different contexts, not just different screen widths.

## 8.1 Desktop

Priorities:

- Strong art direction.
- Large editorial compositions.
- Expressive typography.
- Layered imagery.
- Selective scroll choreography.
- Precise interactions.
- Ample whitespace.

## 8.2 Tablet

Priorities:

- Simplified image overlaps.
- Rebalanced headings.
- Fewer simultaneous columns.
- Touch-friendly controls.
- No dependence on hover.
- Reduced complexity for large story scenes.

## 8.3 Mobile

Priorities:

- Fast initial rendering.
- Clearly visible primary actions.
- Readable typography.
- Simple navigation.
- Predictable vertical scrolling.
- Large image crops.
- Comfortable form fields.
- No horizontal overflow.
- No hover-only functionality.

### Mobile-specific requirements

- Use a compact brand header.
- Open navigation in a full-screen or well-sized overlay.
- Make all tappable elements comfortably sized, with a preferred minimum target around 44 × 44 CSS pixels.
- Reformat the menu into a layout suitable for one-handed browsing.
- Convert complex pinned story scenes into normal document flow.
- Avoid full-screen videos when a well-composed still image offers a better experience.
- Avoid large fixed elements covering menu content or CTAs.
- Consider mobile browser safe areas around fixed UI.
- Ensure dialogs and drawers can be dismissed without precision gestures.

The mobile version must still feel designed, not like a simplified afterthought.

---

# 9. Functional Requirements

## FR-01 — Navigation

The system shall provide working navigation to all relevant homepage sections.

Acceptance criteria:

- Links navigate to the correct sections.
- Anchor navigation accounts for a sticky header.
- Mobile navigation opens and closes correctly.
- Escape closes an open navigation overlay.
- Keyboard users can operate every navigation control.
- The current page does not jump unpredictably during transitions.

## FR-02 — Hero experience

The system shall display the hero and its primary actions without requiring completion of a blocking animation.

Acceptance criteria:

- Main content is visible if animation fails.
- Background media has an image fallback.
- Calls to action remain accessible.
- Text contrast is sufficient.
- Reduced-motion mode skips complex entrance movement.

## FR-03 — Scroll storytelling

The system shall reveal story content as visitors explore the page.

Acceptance criteria:

- Content is present in the document independently of animation.
- Animation does not make text inaccessible.
- No persistent scroll lock is introduced.
- Story progression works on touch devices.
- Reduced motion presents the same content in a simpler layout.

## FR-04 — Interactive menu

The system shall render menu items from structured data and filter them by category.

Acceptance criteria:

- Every category works.
- The All category restores the full menu.
- Prices are consistently formatted in INR.
- Missing images receive graceful placeholders.
- Dietary labels appear only when validated data exists.
- Unavailable products are clearly identified.
- Filters work with keyboard and touch input.
- No-results and loading states are handled where needed.

## FR-05 — Menu item details

The system shall support optional item detail views.

Acceptance criteria:

- Details match the selected item.
- The overlay or sheet can be dismissed.
- Focus is managed properly.
- Touch users can access every action.
- Closing the view returns focus appropriately.

## FR-06 — Visit information

The system shall expose address, schedule and contact information clearly.

Acceptance criteria:

- Address is available as selectable text.
- Directions open a correctly configured map destination.
- Opening hours are consistent throughout the site.
- Contact information is configurable.
- Mobile users can use the relevant device-supported contact action.

## FR-07 — WhatsApp

The system shall support configured WhatsApp contact and enquiry links.

Acceptance criteria:

- The number is stored in central configuration.
- The generated message is URL-encoded correctly.
- Messages contain only intended user-provided information.
- Links include safe external-link handling where applicable.
- A fallback contact option appears if the WhatsApp action cannot be used.
- The website does not claim to have sent a message merely because a link was opened.

WhatsApp links are an enquiry mechanism. They do not constitute an integrated messaging inbox or a server-side notification system.

## FR-08 — Reservation enquiry

The system shall validate and prepare reservation enquiry data.

Acceptance criteria:

- Required fields are validated.
- Past dates are rejected.
- Party size is constrained to a configured range.
- A valid request produces a correctly formatted message.
- The user can review or correct the request.
- The user sees that an enquiry is not a confirmed booking.
- The system does not invent availability.

## FR-09 — Gallery

The system shall display a curated gallery.

Acceptance criteria:

- Images have appropriate aspect ratios.
- The layout responds to viewport changes.
- Lightbox controls work with keyboard and touch.
- Escape closes an open lightbox.
- Informative images have suitable alternative text.
- Images are optimized and do not cause large layout shifts.

## FR-10 — Social links

The system shall provide verified links to the café's social accounts.

Acceptance criteria:

- Links use configurable URLs.
- No broken placeholder links appear in production.
- Social actions remain accessible without animation.

## FR-11 — Content configuration

Business information should live in a centralized configuration or structured data source.

Acceptance criteria:

- Contact information is not duplicated across components.
- Opening hours can be updated in one place.
- Menu entries can be modified without changing the menu rendering logic.
- Images have explicit asset references and suitable fallbacks.

---

# 10. Technical Architecture

## 10.1 Technology decisions

| Layer | Technology | Responsibility |
|---|---|---|
| Frontend | React | UI and component architecture |
| Build tooling | Vite | Development and production bundling |
| Language | TypeScript | Typed components and data models |
| Styling | Tailwind CSS | Responsive layout and utility styling |
| Custom design | CSS | Typography, masks, layered compositions and distinctive effects |
| Animation | Motion for React | Entrance, hover and scroll interactions |
| Advanced timelines | GSAP, optional | Complex pinned or scrubbed scenes |
| Icons | Lucide React or restrained custom SVGs | Interface symbols |
| Fonts | Google Fonts or licensed local files | Display and interface typography |
| Images | Optimized local assets or an image CDN | Photography and visual content |
| Deployment | Vercel | Hosting and delivery |
| Backend | None required for the initial visual MVP | Add only for features needing persistence or server processing |

The initial website should not introduce a backend solely because a website typically has one. A static business website can handle the initial menu, gallery, contact links and reservation enquiry preparation on the frontend.

## 10.2 Suggested project structure

```text
sol-cafe/
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   ├── og-image.webp
│   └── images/
│       ├── hero/
│       ├── coffee/
│       ├── food/
│       ├── interior/
│       └── team/
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   └── routes.tsx
│   ├── components/
│   │   ├── navigation/
│   │   ├── layout/
│   │   ├── buttons/
│   │   ├── typography/
│   │   ├── animations/
│   │   ├── menu/
│   │   ├── gallery/
│   │   └── forms/
│   ├── sections/
│   │   ├── IntroSequence.tsx
│   │   ├── HeroSection.tsx
│   │   ├── BrandStatement.tsx
│   │   ├── SignatureCoffee.tsx
│   │   ├── StorySection.tsx
│   │   ├── MenuSection.tsx
│   │   ├── FoodFeature.tsx
│   │   ├── GallerySection.tsx
│   │   ├── TeamSection.tsx
│   │   ├── VisitSection.tsx
│   │   └── Footer.tsx
│   ├── data/
│   │   ├── cafe.ts
│   │   ├── menu.ts
│   │   └── gallery.ts
│   ├── hooks/
│   ├── lib/
│   ├── styles/
│   │   ├── globals.css
│   │   ├── typography.css
│   │   └── motion.css
│   ├── types/
│   └── main.tsx
├── package.json
├── tsconfig.json
└── vite.config.ts
```

The final structure can change during implementation, but sections, data and reusable components should remain distinct.

## 10.3 Example menu model

```ts
export type MenuCategory =
  | "coffee"
  | "tea"
  | "cold-drinks"
  | "food"
  | "desserts";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  image?: string;
  dietaryLabels: string[];
  isFeatured?: boolean;
  isAvailable: boolean;
}
```

Menu labels must be sourced from verified café information. The data model must not automatically assign dietary claims.

## 10.4 Example business configuration

```ts
export const cafeConfig = {
  name: "SŌL",
  fullName: "SŌL — Coffee & Slow Living",
  address: "Replace with the verified café address",
  timeZone: "Asia/Kolkata",
  currency: "INR",
  whatsappNumber: "",
  instagramUrl: "",
  googleMapsUrl: "",
  reservationEnabled: true,
};
```

Production configuration must contain verified business information. The empty WhatsApp value is intentional: no dummy number should be deployed.

If the website later needs live reservations, online ordering or an administrative editing interface, introduce a backend and persistence layer based on the actual requirements.

---

# 11. Visual Design System

## 11.1 Color palette

Suggested initial tokens:

| Token | Sample value | Use |
|---|---|---|
| Espresso | `#30231D` | Primary dark surface and headings |
| Warm ivory | `#F5EFE5` | Main light background |
| Coffee brown | `#76533F` | Supporting text and accents |
| Muted olive | `#77785C` | Occasional secondary accent |
| Terracotta | `#B86F52` | Selective highlights |
| Light taupe | `#D8CCBE` | Borders and surface details |

These values are starting points and should be tested for actual text contrast.

Do not make every section a different accent color. The system should feel consistent, with occasional deliberate changes in background to create rhythm.

## 11.2 Spacing and layout

- Use a consistent spacing scale.
- Define a clear maximum content width.
- Use a responsive grid system.
- Preserve generous vertical space around large headings.
- Allow selected images or typography to extend toward viewport edges.
- Maintain predictable alignment between sections.
- Avoid arbitrary positioning that breaks at intermediate widths.

## 11.3 Imagery

Images are a major component of the design, not decorative fillers.

Prefer:

- Natural light.
- Strong shadow and highlight contrast.
- Warm ceramic and wood textures.
- Carefully composed food photography.
- Intentional negative space.
- A consistent color grade.
- A balanced mixture of wide scenes and detail shots.

The final photography set should be curated together. Mixing unrelated stock-photo styles will make even good layouts feel inconsistent.

## 11.4 Reusable components

Create reusable components for:

- Brand wordmark.
- Navigation.
- Display headings.
- Eyebrow labels.
- Primary and secondary buttons.
- Image frames.
- Reveal animations.
- Menu items.
- Category filters.
- Gallery items.
- Form controls.
- Section labels.
- Contact links.

Reusable components should reduce implementation inconsistencies, but should not force every section into the same visual structure.

---

# 12. Performance and Accessibility Requirements

The visual ambition of the website must be supported by disciplined engineering.

## 12.1 Performance

Performance targets should be measured under representative mobile conditions.

Target the following Core Web Vitals thresholds at the 75th percentile when field data is available:

- Largest Contentful Paint (LCP): no more than 2.5 seconds.
- Interaction to Next Paint (INP): no more than 200 milliseconds.
- Cumulative Layout Shift (CLS): no more than 0.1.

Use lab measurements during development, recognizing that they do not replace real-user field data.

### Requirements

- Serve suitably sized WebP or AVIF images where supported.
- Use responsive `srcset` and `sizes` for photographs.
- Preload only genuinely critical resources, such as the selected hero asset when appropriate.
- Do not lazy-load the main above-the-fold image if it is the LCP element.
- Lazy-load below-the-fold photography.
- Use a poster and fallback image for video.
- Avoid animating layout-heavy properties unnecessarily.
- Prefer transforms and opacity for simple motion.
- Avoid triggering React renders on every scroll frame.
- Load below-the-fold animation code when needed.
- Avoid heavy 3D assets in the initial release.
- Ensure animation failures do not conceal content.

## 12.2 Accessibility

The website should target WCAG 2.2 Level AA.

Requirements include:

- Semantic HTML landmarks.
- Clear heading hierarchy.
- Sufficient text contrast.
- Keyboard-operable navigation.
- Visible keyboard focus indicators.
- Appropriate accessible names for controls.
- Labels and error messages for form fields.
- Accessible dialogs and lightboxes.
- Meaningful image alternative text.
- Reduced-motion support.
- No autoplaying audio.
- No interaction dependent exclusively on hovering.
- No essential text embedded only inside images.
- No flashing effects that could create safety concerns.

### Reduced-motion behavior

When the user prefers reduced motion:

- Skip elaborate intro choreography.
- Remove or simplify continuous marquees.
- Disable parallax and pointer-following effects.
- Replace scroll-scrubbed story sequences with static or lightly faded sections.
- Preserve the layout and all content.
- Keep short functional feedback transitions where appropriate.

Do not interpret reduced motion as permission to hide visual content or remove important states.

## 12.3 SEO and sharing

Requirements:

- Unique page title and meta description.
- Correct canonical URL.
- Social sharing image and metadata.
- Sitemap and robots configuration.
- Descriptive headings.
- Descriptive alternative text.
- Semantic menu and business information.
- Appropriate structured data for a restaurant or café when accurate.
- Accurate opening hours and address in any structured data.
- A crawlable production rendering strategy.

Because the proposed stack uses Vite, evaluate static prerendering or another crawlable rendering solution before launch. Client-side code alone should not be assumed to provide the ideal SEO result for every crawler.

---

# 13. Data and Integration Requirements

## 13.1 Initial static data

The MVP can store the following content in typed local data files:

- Business identity.
- Opening schedule.
- Menu items.
- Dietary labels.
- Gallery assets.
- Story content.
- Social media URLs.
- Contact information.
- Navigation structure.

This is sufficient while content changes are infrequent and a developer manages updates.

## 13.2 External integrations

**Google Maps:** Open the correct directions destination.

**WhatsApp:** Prepare customer enquiries and contact actions.

**Instagram:** Link to the verified official account.

**Analytics:** Optionally track visits, menu interactions, directions clicks, reservation form attempts and WhatsApp CTA clicks.

Analytics should measure actions rather than collect unnecessary personal information. Any relevant consent and privacy obligations must be addressed.

## 13.3 Future content management

If café staff need to update prices, photographs or opening hours independently, add a CMS or administrative interface.

Do not build an admin dashboard for the initial static MVP unless the business actually requires one.

---

# 14. Security and Privacy

The initial website has a small security surface, but must still follow good practices.

- Do not store API secrets in frontend environment variables.
- Treat all client-submitted form data as untrusted.
- Do not imply that a reservation has been stored by the server if it has only been assembled locally.
- Do not collect unnecessary customer information.
- Do not expose personal information through analytics.
- Use HTTPS in production.
- Validate external URLs and business configuration.
- Apply an appropriate Content Security Policy where feasible.
- Use safe external-link attributes where appropriate.
- If a backend is introduced, apply server-side validation, rate limiting and secure logging.

A future authenticated reservation or ordering service must be assessed separately for data protection, spam prevention, persistence and operational security.

---

# 15. Testing and Quality Assurance

## 15.1 Visual QA

Test each major section at:

- Small mobile width.
- Typical modern mobile width.
- Tablet width.
- Standard laptop width.
- Large desktop width.

Check:

- Line wrapping.
- Image crops.
- Heading collisions.
- Sticky navigation.
- Overlapping elements.
- Background transitions.
- CTA positions.
- Footer composition.
- Intermediate-width behavior.

## 15.2 Functional QA

Verify:

- All navigation links.
- Menu filters.
- Menu detail overlays.
- Gallery navigation.
- WhatsApp URL construction.
- Directions link.
- Reservation validation.
- Invalid input handling.
- Unavailable menu items.
- Empty and fallback image states.
- Mobile navigation dismissal.
- External links.
- Footer links.

## 15.3 Motion QA

Test with:

- Normal motion settings.
- Reduced-motion settings.
- Mouse input.
- Touch input.
- Keyboard navigation.
- Slow network conditions.
- Failed video or image assets.
- Long and short viewport heights.

Verify there is no scroll locking, unexpected horizontal movement, inaccessible content or animation-related input lag.

## 15.4 Browser QA

Test current versions of major desktop and mobile browsers, including Chromium-based browsers, Firefox and Safari where available.

Special attention should be paid to:

- Mobile viewport sizing.
- Sticky positioning.
- Image clipping.
- Video playback behavior.
- Focus management.
- Native anchor scrolling.
- Font loading and fallback layout.

## 15.5 Accessibility QA

Use automated accessibility checks as an initial step, then perform keyboard and screen-reader checks.

Automated scans alone are not sufficient for testing motion, focus management, reading order or practical usability.

---

# 16. Acceptance Criteria for Launch

The website is ready for launch when all of the following are true:

- The full homepage is implemented with the agreed visual direction.
- The opening animation resolves correctly on supported devices.
- Headline typography scales without collisions.
- Story sections remain understandable without animation.
- The menu filters correctly and renders configured data.
- Prices, categories and dietary labels are accurate for the configured content.
- The gallery and lightbox are usable with touch and keyboard.
- The address and business hours are verified.
- Google Maps opens the intended location.
- WhatsApp links use the configured business number and correct messages.
- Reservation enquiries display an explicit unconfirmed status.
- Every primary button and external link functions.
- All required sections have mobile layouts.
- Reduced-motion behavior is implemented.
- No obvious horizontal overflow or broken assets remain.
- Critical accessibility issues are resolved.
- Image optimization and performance checks are complete.
- SEO metadata and social previews have been configured.
- Production uses real business details rather than demonstration values.
- The final website has been tested on actual mobile hardware.

---

# 17. Development Plan

A reasonable implementation plan is divided into short milestones. The timing will depend on the available developer time, asset quality and complexity of the final motion design.

## Phase 1 — Brand and visual research

Deliverables:

- Visual reference board.
- Finalized palette.
- Font pairing.
- Photography direction.
- Sitemap.
- Initial design tokens.
- Animation storyboard.

Exit criteria: The overall aesthetic is established before extensive implementation begins.

## Phase 2 — Static visual prototype

Deliverables:

- Navigation.
- Hero.
- Brand statement.
- Story layout.
- Menu composition.
- Gallery.
- Visit section.
- Footer.

Exit criteria: Every main section is visually coherent and responsive, even with animation disabled.

## Phase 3 — Motion system

Deliverables:

- Hero typography choreography.
- Section reveal system.
- Image masks.
- Scroll-linked story sequence.
- Hover and interaction states.
- Reduced-motion behavior.

Exit criteria: Animation is polished, consistent and does not harm navigation or performance.

## Phase 4 — Functional implementation

Deliverables:

- Menu filtering.
- Menu details.
- Gallery lightbox.
- WhatsApp integration.
- Directions.
- Reservation enquiry form.
- Form validation.
- Configurable business data.

Exit criteria: All interactive features function with real configuration.

## Phase 5 — Production hardening

Deliverables:

- Responsive QA.
- Accessibility checks.
- Image optimization.
- SEO metadata.
- Error and fallback states.
- Browser testing.
- Performance testing.
- Final deployment.

Exit criteria: All launch acceptance criteria are satisfied.

---

# 18. Risks and Mitigations

| Risk | Potential consequence | Mitigation |
|---|---|---|
| Over-animation | Visitors feel overwhelmed | Reserve elaborate motion for key scenes |
| Heavy hero video | Slow first load | Use optimized poster and image fallback |
| Excessive scroll pinning | Frustrating navigation | Use normal document flow as the default |
| Experimental typography | Poor readability on mobile | Define responsive type limits and line breaks |
| Inconsistent photography | Template-like appearance | Curate the complete asset set together |
| Incorrect business information | Visitors lose trust | Centralize and verify all business data |
| False reservation confirmation | Confusion for customers | Clearly distinguish enquiry from confirmed booking |
| Frontend-only SEO limitations | Reduced search visibility | Evaluate prerendering and structured metadata |
| Animation library overlap | Conflicting transitions | Assign animation ownership per element |
| Unnecessary technical complexity | Slower delivery and maintenance | Keep Three.js and advanced booking systems out of the MVP |

---

# 19. Final Product Definition

The finished SŌL website should feel like an intersection of an independent coffee brand, a high-end editorial publication and a carefully produced digital experience.

Its visual signature should come from:

- A cinematic and memorable opening.
- Oversized, expressive typography.
- Art-directed photography.
- Deliberate asymmetry.
- Carefully choreographed scroll storytelling.
- A highly usable interactive menu.
- Practical visit and contact functionality.
- A mobile experience designed with the same care as desktop.
- Smooth but restrained interaction details.

The implementation should feel ambitious without becoming fragile.

The hero and two or three signature moments can be experimental. The menu, reservation form, navigation, opening hours and directions must remain exceptionally straightforward.

**The central design principle is this: make the first impression extraordinary, make the journey feel considered, and make every real-world action effortless.**