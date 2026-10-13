import { readFile, access } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { resolveSiteUrl, SITE_URL_PLACEHOLDER } from "./site-url.mjs";

/* ---------------------------------------------------------------------------
   Post-build verification.

   Cheap, deterministic assertions about the artefacts this project produces.
   They guard the things that are easy to lose silently in an unrelated change:

     • the reveal boot script and the LCP preload in index.html,
     • the placeholder actually being either replaced or left intact,
     • the promised content being present in the prerendered markup,
     • the files that public/ is supposed to ship.

   Run as the last step of `npm run build`, so a regression fails the build
   rather than the deploy.
   --------------------------------------------------------------------------- */

const PLACEHOLDER = "<!--app-html-->";

const failures = [];

function check(label, condition) {
  console.log(`  ${condition ? "\u2713" : "\u2717"} ${label}`);
  if (!condition) failures.push(label);
}

const indexPath = path.resolve("dist/index.html");
const html = await readFile(indexPath, "utf8");
const prerendered = !html.includes(PLACEHOLDER);

console.log("\n[verify] dist/index.html");
check("reveal boot script present", html.includes('classList.add("js")'));
check("hero image preloaded with high priority", /rel="preload"[^>]*hero[^>]*fetchpriority="high"/.test(html) || /fetchpriority="high"[^>]*hero/.test(html));
check("root mount point present", html.includes('id="root"'));
check("app placeholder resolved or intentionally retained", prerendered || html.includes(PLACEHOLDER));

if (prerendered) {
  console.log("\n[verify] prerendered markup");
  check("hero heading present", html.includes('id="hero-heading"'));
  check("reservation enquiry copy present", html.includes("Your reservation is not confirmed until the caf"));
  check("demo content notice present", html.includes("demonstration site"));
  check("structured data present", html.includes("application/ld+json"));
  check("every in-page nav target rendered", ["statement", "coffee", "story", "menu", "food", "space", "people", "visit", "reserve", "social", "footer"].every((id) => html.includes(`id="${id}"`)));
} else {
  console.log("\n[verify] prerender did not run; skipping content assertions.");
}

console.log("\n[verify] canonical origin");
{
  const siteUrl = resolveSiteUrl();

  const canonical = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1];
  check(`index.html canonical is ${siteUrl}/`, canonical === `${siteUrl}/`);

  const ogUrl = html.match(/property="og:url"[^>]*content="([^"]+)"/)?.[1];
  check(`index.html og:url is ${siteUrl}/`, ogUrl === `${siteUrl}/`);

  try {
    const robots = await readFile(path.resolve("dist/robots.txt"), "utf8");
    check("robots.txt sitemap points at the canonical origin", robots.includes(`${siteUrl}/sitemap.xml`));
  } catch {
    check("robots.txt readable", false);
  }

  try {
    const sitemap = await readFile(path.resolve("dist/sitemap.xml"), "utf8");
    check("sitemap.xml loc matches the canonical origin", sitemap.includes(`<loc>${siteUrl}/</loc>`));
  } catch {
    check("sitemap.xml readable", false);
  }

  /* Only a real deploy can catch a stale placeholder; the default build keeps it. */
  if (siteUrl !== SITE_URL_PLACEHOLDER) {
    check(
      "placeholder .example domain removed from dist/index.html",
      !html.includes(SITE_URL_PLACEHOLDER),
    );
  }
}

console.log("\n[verify] public assets");
const assets = [
  "robots.txt",
  "sitemap.xml",
  "favicon.svg",
  "apple-touch-icon.png",
  "icon-192.png",
  "icon-512.png",
  "icon-512-maskable.png",
  "site.webmanifest",
  "og-image.webp",
];
for (const asset of assets) {
  try {
    await access(path.resolve("public", asset));
    check(asset, true);
  } catch {
    check(asset, false);
  }
}

console.log("\n[verify] image manifest");
{
  /*
   * Every path the generated manifest references must exist in public/.
   *
   * This one matters more than it looks: both the dev server and a SPA rewrite on
   * a static host answer a missing image path with index.html and a 200. A stale
   * or mistyped image would therefore fail silently — the layout would show HTML
   * rendered into an <img> — instead of erroring.
   */
  const manifest = await readFile(path.resolve("src/data/images.ts"), "utf8");
  const references = [...new Set(manifest.match(/\/images\/[A-Za-z0-9._/-]+\.(?:webp|avif)/g) ?? [])];

  if (references.length === 0) {
    check("manifest references at least one image", false);
  } else {
    const missing = [];
    await Promise.all(
      references.map(async (reference) => {
        try {
          await access(path.resolve("public", reference.replace(/^\//, "")));
        } catch {
          missing.push(reference);
        }
      }),
    );
    check(`${references.length} referenced image files all exist`, missing.length === 0);
    for (const file of missing.slice(0, 10)) console.log(`      missing: ${file}`);
  }

  const preloaded = html.match(/rel="preload"[^>]*href="([^"]+)"/)?.[1];
  if (preloaded) {
    try {
      await access(path.resolve("public", preloaded.replace(/^\//, "")));
      check(`preloaded hero image exists (${preloaded})`, true);
    } catch {
      check(`preloaded hero image exists (${preloaded})`, false);
    }
  }
}

if (failures.length > 0) {
  console.error(`\n[verify] ${failures.length} check(s) failed:\n  - ${failures.join("\n  - ")}\n`);
  process.exitCode = 1;
} else {
  console.log("\n[verify] all checks passed.\n");
}