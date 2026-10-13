import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import path from "node:path";
import process from "node:process";

/* ---------------------------------------------------------------------------
   Point the built site at the domain it is actually served from.

   The source ships a single placeholder host. Search engines, social crawlers
   and the sitemap all need an absolute URL, but a static host cannot know its
   own origin at authoring time — so the origin is resolved once, at build time,
   from `VITE_SITE_URL` (`SITE_URL` is accepted as an alias), and swapped into
   every place the placeholder appears:

     • dist/index.html    — rel="canonical", og:url, og:image, twitter:image
     • dist/robots.txt    — the Sitemap directive
     • dist/sitemap.xml   — the <loc> entry

   `public/robots.txt` and `public/sitemap.xml` are copied verbatim by Vite, so
   they cannot use Vite's HTML env substitution — hence this post-build pass,
   which runs after the prerender step so it also rewrites the prerendered copy
   of index.html.

   Building without configuring a value is safe: the placeholder is a reserved
   `.example` domain and is deliberately left in place.
   --------------------------------------------------------------------------- */

export const SITE_URL_PLACEHOLDER = "https://sol-cafe.example";

/** Resolve the origin to build against, with the placeholder as the default. */
export function resolveSiteUrl(env = process.env) {
  const raw = env.VITE_SITE_URL || env.SITE_URL || SITE_URL_PLACEHOLDER;
  return raw.trim().replace(/\/+$/, "");
}

const TARGETS = ["dist/index.html", "dist/robots.txt", "dist/sitemap.xml"];

async function run() {
  const siteUrl = resolveSiteUrl();

  if (siteUrl === SITE_URL_PLACEHOLDER) {
    console.log(
      `[site-url] VITE_SITE_URL is not set; keeping the placeholder ${SITE_URL_PLACEHOLDER}.`,
    );
    return;
  }

  for (const target of TARGETS) {
    const file = path.resolve(target);
    let contents;
    try {
      contents = await readFile(file, "utf8");
    } catch {
      console.warn(`[site-url] ${target} not found; skipped.`);
      continue;
    }

    if (!contents.includes(SITE_URL_PLACEHOLDER)) {
      console.warn(`[site-url] ${target} did not contain the placeholder host; skipped.`);
      continue;
    }

    await writeFile(file, contents.split(SITE_URL_PLACEHOLDER).join(siteUrl), "utf8");
    console.log(`[site-url] ${target} \u2192 ${siteUrl}`);
  }
}

/* Only rewrite when this file is the entry point, so verify-build.mjs can import
   the resolver without triggering a second pass. */
const invokedDirectly =
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedDirectly) {
  await run();
}
