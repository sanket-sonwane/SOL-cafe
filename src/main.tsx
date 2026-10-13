import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "@/styles/globals.css";
import { App } from "@/app/App";

/* ---------------------------------------------------------------------------
   Client entry.

   The build is hydrated when the prerenderer has injected markup, and mounted
   from scratch when it has not — so the same bundle works whether or not the
   optional prerender step ran.

   Note that the `js` class used by the reveal system is added by a tiny inline
   script in index.html *before first paint*, not here: doing it here would mean
   a visible flash as the (correctly) hidden elements appeared and then animated
   in. (PRD FR-02)
   --------------------------------------------------------------------------- */

const container = document.getElementById("root");

if (container) {
  const tree = (
    <StrictMode>
      <App />
    </StrictMode>
  );

  if (container.hasChildNodes()) {
    hydrateRoot(container, tree);
  } else {
    createRoot(container).render(tree);
  }
}
