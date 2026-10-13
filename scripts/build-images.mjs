/**
 * scripts/build-images.mjs
 *
 * Turns the curated Wikimedia Commons selection into the optimized asset set
 * used by the site:
 *
 *   assets-src/raw/<key>.jpg          grayscale-corrected master (git-ignored)
 *   public/images/<group>/<key>-*.webp  responsive WebP derivatives
 *   public/images/<group>/<key>-*.avif  responsive AVIF derivatives
 *   public/og-image.webp              social sharing card
 *   src/data/images.ts                generated image manifest
 *   CREDITS.md                        attribution for every source photograph
 *
 * A single, deliberately restrained warm grade is applied to every photograph
 * so that images from many different photographers read as one body of work
 * (PRD §11.3). Nothing geometric is done here — cropping is a presentation
 * decision and belongs in CSS, so aspect ratios stay flexible.
 *
 * Usage:
 *   node scripts/build-images.mjs             # download missing masters, rebuild
 *   node scripts/build-images.mjs --force     # re-download and rebuild everything
 */

import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import { setDefaultResultOrder } from "node:dns";
import path from "node:path";
import sharp from "sharp";

// See scripts/discover-images.mjs for why this is necessary.
setDefaultResultOrder("ipv4first");

const CANDIDATES_DIR = path.resolve("assets-src/candidates");
const RAW_DIR = path.resolve("assets-src/raw");
const PUBLIC_IMAGES_DIR = path.resolve("public/images");
const PUBLIC_DIR = path.resolve("public");
const MANIFEST_PATH = path.resolve("src/data/images.ts");
const CREDITS_PATH = path.resolve("CREDITS.md");

const USER_AGENT =
  "sol-cafe-image-build/1.0 (fictional design prototype; contact: hello@sol-cafe.example)";

/** Widths generated for every photograph. The largest available wins `src`. */
const WIDTHS = [400, 800, 1200, 1600, 2000, 2400];

/** Longest edge of a stored master. */
const MASTER_MAX = 2400;

/** LQIP size, inlined as a data URI. */
const PLACEHOLDER_WIDTH = 24;

/* ---------------------------------------------------------------------------
   The curated selection.
   `slug` + `index` point into assets-src/candidates/<slug>.json, produced by
   scripts/discover-images.mjs. Everything about a photograph's final framing is
   decided in CSS, so this list only chooses *which* photograph is used *where*.

   ⚠️  These are openly licensed stand-ins for a fictional café. Replace them
   with the café's own photography before production. See CREDITS.md.
   ------------------------------------------------------------------------- */
const SELECTION = [
  { key: "hero-primary", slug: "hero-cup", index: 9, note: "Hero background" },
  { key: "statement-accent", slug: "hero-cup", index: 4, note: "Brand statement accent" },
  { key: "coffee-feature", slug: "counter-machine", index: 1, note: "Signature coffee feature" },

  { key: "story-coffee", slug: "pour-over", index: 8, note: "Story chapter 01 — the coffee" },
  { key: "story-space", slug: "space-seating", index: 9, note: "Story chapter 02 — the space" },
  { key: "story-people", slug: "barista-hands", index: 4, note: "Story chapter 03 — the people" },

  { key: "menu-latte", slug: "latte-art", index: 3, note: "Menu — signature latte" },
  { key: "menu-flat-white", slug: "flat-white", index: 0, note: "Menu — flat white" },
  { key: "menu-cold-brew", slug: "pour-over", index: 4, note: "Menu — cold brew" },
  { key: "menu-matcha", slug: "matcha", index: 8, note: "Menu — iced matcha latte" },
  { key: "menu-brownie", slug: "brownie", index: 7, note: "Menu — hazelnut brownie" },
  { key: "menu-croissant", slug: "croissant", index: 1, note: "Menu — butter croissant" },
  { key: "menu-avocado-toast", slug: "avocado-toast", index: 0, note: "Menu — avocado toast" },
  { key: "menu-cookie", slug: "cookie", index: 6, note: "Menu — sea salt cookie" },

  { key: "food-feature", slug: "avocado-toast", index: 2, note: "Full-width food editorial" },

  { key: "gallery-interior", slug: "hero-interior", index: 8, note: "Gallery — interior" },
  { key: "gallery-seating", slug: "space-seating", index: 11, note: "Gallery — seating" },
  { key: "gallery-counter", slug: "counter-machine", index: 4, note: "Gallery — counter" },
  { key: "gallery-light", slug: "space-seating", index: 7, note: "Gallery — evening light" },
  { key: "gallery-drinks", slug: "hero-cup", index: 0, note: "Gallery — drinks" },
  { key: "gallery-texture", slug: "beans", index: 9, note: "Gallery — material texture" },
  { key: "gallery-people", slug: "people-cafe", index: 0, note: "Gallery — people" },
  { key: "gallery-detail", slug: "hero-cup", index: 7, note: "Gallery — detail" },

  { key: "team-barista", slug: "barista-hands", index: 8, note: "People — barista" },
  { key: "team-kitchen", slug: "pastry-counter", index: 2, note: "People — the counter" },
];

const args = process.argv.slice(2);
const FORCE = args.includes("--force");
const ONLY = args
  .filter((arg) => arg.startsWith("--only="))
  .map((arg) => arg.slice("--only=".length));

/* ---------------------------------------------------------------------------
   Helpers
   ------------------------------------------------------------------------- */

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithRetry(url, { as = "buffer", attempts = 4 } = {}) {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return as === "json" ? await response.json() : Buffer.from(await response.arrayBuffer());
    } catch (error) {
      lastError = error;
      await sleep(500 * (attempt + 1));
    }
  }
  throw lastError;
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function stripQuery(url) {
  return url.split("?")[0];
}

/**
 * Wikimedia now restricts thumbnail generation to an allow-listed set of widths,
 * so the original file is fetched and every derivative is produced locally.
 * This is also the highest-quality path.
 */
function sourceUrl(candidate) {
  return stripQuery(candidate.originalUrl);
}

function groupFor(key) {
  return key.split("-")[0];
}

/* ---------------------------------------------------------------------------
   The shared warm grade
   A restrained, repeatable treatment: slightly reduced saturation, a gentle
   red lift, a cool-blue pull and a shadow lift. This is what makes photographs
   from a dozen different cameras feel like one editorial shoot.
   ------------------------------------------------------------------------- */
async function grade(inputBuffer) {
  return sharp(inputBuffer)
    .rotate()
    .flatten({ background: "#fffdf9" })
    .resize({ width: MASTER_MAX, height: MASTER_MAX, fit: "inside", withoutEnlargement: true })
    .modulate({ saturation: 0.85, brightness: 1.03 })
    .recomb([
      [1.05, 0.02, 0.0],
      [0.0, 1.0, 0.01],
      [0.0, 0.01, 0.92],
    ])
    .linear(0.95, 7)
    .sharpen({ sigma: 0.6 })
    .jpeg({ quality: 90, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toBuffer();
}

/* ---------------------------------------------------------------------------
   Download + master
   ------------------------------------------------------------------------- */

async function ensureMaster(entry) {
  const masterPath = path.join(RAW_DIR, `${entry.key}.jpg`);
  if (!FORCE && (await exists(masterPath))) return masterPath;

  const candidatesPath = path.join(CANDIDATES_DIR, `${entry.slug}.json`);
  const { candidates } = JSON.parse(await readFile(candidatesPath, "utf8"));
  const candidate = candidates[entry.index];

  if (!candidate) {
    throw new Error(
      `No candidate [${entry.index}] in ${entry.slug}.json — re-run scripts/discover-images.mjs.`,
    );
  }

  const source = sourceUrl(candidate);
  const downloaded = await fetchWithRetry(source);
  const graded = await grade(downloaded);
  await writeFile(masterPath, graded);

  process.stdout.write(
    `  ↓ ${entry.key.padEnd(20)} ${`${candidate.width}x${candidate.height}`.padEnd(11)} ` +
      `${`${(downloaded.length / 1024 / 1024).toFixed(1)}MB`.padEnd(8)} ${candidate.license}\n`,
  );

  return masterPath;
}

/* ---------------------------------------------------------------------------
   Derivatives + manifest
   ------------------------------------------------------------------------- */

async function buildDerivatives(entry, masterPath) {
  const master = sharp(masterPath);
  const meta = await master.metadata();
  const sourceWidth = meta.width ?? 0;
  const sourceHeight = meta.height ?? 0;
  const aspectRatio = sourceWidth / sourceHeight;

  const group = groupFor(entry.key);
  const outDir = path.join(PUBLIC_IMAGES_DIR, group);
  await mkdir(outDir, { recursive: true });

  const widths = WIDTHS.filter((width) => width <= sourceWidth);
  if (widths.length === 0) widths.push(sourceWidth);

  const webpEntries = [];
  const avifEntries = [];

  for (const width of widths) {
    const height = Math.round(width / aspectRatio);

    const webpName = `${entry.key}-${width}.webp`;
    const webpPath = path.join(outDir, webpName);
    await sharp(masterPath)
      .resize({ width, height, fit: "cover", position: "centre" })
      .webp({ quality: 76, effort: 4 })
      .toFile(webpPath);
    webpEntries.push({ url: `/images/${group}/${webpName}`, width });

    // AVIF support depends on the bundled libvips build; skip gracefully.
    try {
      const avifName = `${entry.key}-${width}.avif`;
      const avifPath = path.join(outDir, avifName);
      await sharp(masterPath)
        .resize({ width, height, fit: "cover", position: "centre" })
        .avif({ quality: 52, effort: 4 })
        .toFile(avifPath);
      avifEntries.push({ url: `/images/${group}/${avifName}`, width });
    } catch {
      // WebP alone is an acceptable fallback.
    }
  }

  const placeholder = await sharp(masterPath)
    .resize({ width: PLACEHOLDER_WIDTH })
    .webp({ quality: 30 })
    .toBuffer();

  const srcSet = webpEntries.map(({ url, width }) => `${url} ${width}w`).join(", ");
  const avifSrcSet = avifEntries.map(({ url, width }) => `${url} ${width}w`).join(", ");
  const largest = webpEntries[webpEntries.length - 1];

  process.stdout.write(`  ✎ ${entry.key.padEnd(20)} ${widths.length} widths\n`);

  return {
    entry,
    record: {
      src: webpEntries[0].url,
      srcSet,
      avifSrcSet,
      width: largest.width,
      height: Math.round(largest.width / aspectRatio),
      aspectRatio: Number(aspectRatio.toFixed(4)),
      placeholder: `data:image/webp;base64,${placeholder.toString("base64")}`,
    },
    sourceWidth,
    sourceHeight,
  };
}

/* ---------------------------------------------------------------------------
   Social sharing card
   ------------------------------------------------------------------------- */

async function buildOgImage(heroMasterPath) {
  await sharp(heroMasterPath)
    .resize({ width: 1200, height: 630, fit: "cover", position: "attention" })
    .modulate({ saturation: 0.9, brightness: 0.98 })
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(path.join(PUBLIC_DIR, "og-image.webp"));

  process.stdout.write(`  ✎ og-image.webp         1200x630\n`);
}

/* ---------------------------------------------------------------------------
   Credits
   ------------------------------------------------------------------------- */

async function writeCredits(entries) {
  const sourceNotes = new Map();

  for (const entry of entries) {
    const candidatesPath = path.join(CANDIDATES_DIR, `${entry.slug}.json`);
    const { candidates } = JSON.parse(await readFile(candidatesPath, "utf8"));
    sourceNotes.set(entry.key, candidates[entry.index]);
  }

  const rows = [...sourceNotes.entries()]
    .map(([key, candidate]) => {
      const artist = candidate.artist || "Unknown";
      return `| \`${key}\` | ${candidate.title.replace(/\|/g, "\\|")} | ${artist} | [${candidate.license}](${candidate.licenseUrl || candidate.descriptionUrl}) | [source](${candidate.descriptionUrl}) |`;
    })
    .join("\n");

  const document = `# Image credits

All photography on this site is openly licensed and used here as **demonstration
content for a fictional café**. Every image has been downloaded, colour-graded
and re-encoded by \`scripts/build-images.mjs\`; the originals are unmodified.

Before production launch, replace these with the café's own photography (or
licensed assets) and regenerate, or simply drop replacements into
\`assets-src/raw/\` using the same file names.

| Asset key | Title | Author | Licence | Source |
|---|---|---|---|---|
${rows}

## Notes on licensing

- **CC0 / Public domain** works carry no attribution requirement, but the author
  is credited anyway as a matter of courtesy.
- **CC BY** and **CC BY-SA** works require attribution. The credits above
  satisfy that requirement for the images as shipped. If you re-crop, re-colour
  or otherwise adapt them, the adaptation is permitted; for CC BY-SA works the
  adaptation must be shared under the same licence.
- Some sources (e.g. Geograph, Rawpixel) impose no additional restrictions
  beyond the licence shown.
- If you replace an image, remove or update its row here.
`;

  await writeFile(CREDITS_PATH, document, "utf8");
  process.stdout.write(`  ✎ CREDITS.md             ${rows.split("\n").length} assets\n`);
}

/* ---------------------------------------------------------------------------
   Main
   ------------------------------------------------------------------------- */

async function main() {
  await mkdir(RAW_DIR, { recursive: true });
  await mkdir(PUBLIC_IMAGES_DIR, { recursive: true });

  const selected = ONLY.length > 0 ? SELECTION.filter((entry) => ONLY.includes(entry.key)) : SELECTION;

  process.stdout.write(`\nDownloading and grading ${selected.length} photographs\n`);
  const masters = new Map();
  for (const entry of selected) {
    masters.set(entry.key, await ensureMaster(entry));
    await sleep(120);
  }

  process.stdout.write(`\nGenerating responsive derivatives\n`);
  const manifest = {};
  const records = [];
  for (const entry of selected) {
    const result = await buildDerivatives(entry, masters.get(entry.key));
    manifest[entry.key] = result.record;
    records.push(entry);
  }

  if (masters.has("hero-primary")) {
    process.stdout.write(`\nGenerating social card\n`);
    await buildOgImage(masters.get("hero-primary"));
  }

  const header =
    `/* ---------------------------------------------------------------------------\n` +
    `   GENERATED FILE — do not edit by hand.\n` +
    `   Produced by scripts/build-images.mjs from the curated selection in that\n` +
    `   script. Run \`npm run images\` to regenerate.\n` +
    `   --------------------------------------------------------------------------- */\n\n` +
    `import type { ImageManifest } from "@/types";\n\n` +
    `export const images = `;

  const body =
    `${JSON.stringify(manifest, null, 2)} as const satisfies ImageManifest;\n\n` +
    `export type ImageKey = keyof typeof images;\n`;

  await writeFile(MANIFEST_PATH, header + body, "utf8");
  process.stdout.write(`  ✎ src/data/images.ts     ${Object.keys(manifest).length} entries\n`);

  await writeCredits(records);

  process.stdout.write(`\nDone.\n\n`);
}

main().catch((error) => {
  console.error(`\nImage build failed: ${error.message}\n`);
  process.exitCode = 1;
});
