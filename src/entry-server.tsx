import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { App } from "@/app/App";

/* ---------------------------------------------------------------------------
   Server entry, used only by scripts/prerender.mjs.

   The site is a plain single-page bundle; this exists so the first paint arrives
   with the full markup already in place — better for search engines, better for
   visitors whose JavaScript is slow to arrive, and it removes the empty-shell
   flash entirely.

   It renders the same component tree the client hydrates, so the two cannot
   drift. Any client-only behaviour (Motion, IntersectionObserver, GSAP) is
   already guarded by effects and feature detection, which is why no branching is
   needed here.
   --------------------------------------------------------------------------- */

export function render(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
