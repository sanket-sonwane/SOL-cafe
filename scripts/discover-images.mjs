/**
 * scripts/discover-images.mjs
 *
 * Curation helper. Searches Wikimedia Commons for openly licensed photographs,
 * downloads small previews, and stitches them into a labelled contact sheet per
 * search term so a human can choose a cohesive set before anything is committed.
 *
 * Commons is used because it exposes full-resolution originals and machine
 * readable license metadata without an API key, and its licence terms
 * (CC0 / public domain / CC BY / CC BY-SA) permit reuse with attribution.
 *
 * Output (all disposable, git-ignored):
 *   assets-src/candidates/<slug>.jpg    contact sheet, 4 tiles per row
 *   assets-src/candidates/<slug>.json   ordered candidate metadata
 *
 * Usage:
 *   node scripts/discover-images.mjs              # every configured term
 *   node scripts/discover-images.mjs "cold brew"  # ad-hoc term
 */

import { mkdir, writeFile } from "node:fs/promises";
import { setDefaultResultOrder } from "node:dns";
import path from "node:path";
import sharp from "sharp";

// Some networks advertise IPv6 for Wikimedia but cannot route it, which makes
// Node's fetch fail with ECONNRESET. Preferring IPv4 first is sufficient.
setDefaultResultOrder("ipv4first");

const API = "https://commons.wikimedia.org/w/api.php";
const USER_AGENT =
  "sol-cafe-image-curation/1.0 (fictional design prototype; contact: hello@sol-cafe.example)";

const OUT_DIR = path.resolve("assets-src/candidates");

/** Licenses we are willing to attribute-and-reuse. */
const ALLOWED_LICENSES = [
  "cc0",
  "public domain",
  "pd",
  "cc by",
  "cc by-sa",
  "cc by 2.0",
  "cc by 3.0",
  "cc by 4.0",
  "cc by-sa 2.0",
  "cc by-sa 3.0",
  "cc by-sa 4.0",
];

/** Search terms, grouped by the section of the site they will feed. */
const QUERIES = [
  { slug: "hero-interior", q: "coffee shop interior", aspect: "wide" },
  { slug: "hero-cup", q: "cup of coffee on table", aspect: "wide" },
  { slug: "space-seating", q: "cafe interior seating chairs", aspect: "tall" },
  { slug: "space-light", q: "cafe window daylight interior", aspect: "tall" },
  { slug: "counter-machine", q: "espresso machine counter", aspect: "tall" },
  { slug: "espresso-shot", q: "espresso extraction portafilter", aspect: "tall" },
  { slug: "pour-over", q: "pour over coffee brewing", aspect: "tall" },
  { slug: "barista-hands", q: "barista making coffee hands", aspect: "tall" },
  { slug: "latte-art", q: "latte art cappuccino", aspect: "tall" },
  { slug: "flat-white", q: "flat white coffee cup", aspect: "tall" },
  { slug: "cold-brew", q: "cold brew iced coffee glass", aspect: "tall" },
  { slug: "matcha", q: "matcha latte green tea drink", aspect: "tall" },
  { slug: "brownie", q: "chocolate brownie dessert", aspect: "tall" },
  { slug: "croissant", q: "butter croissant bakery", aspect: "tall" },
  { slug: "avocado-toast", q: "avocado toast breakfast", aspect: "tall" },
  { slug: "cookie", q: "chocolate chip cookies", aspect: "tall" },
  { slug: "food-table", q: "breakfast brunch table spread", aspect: "wide" },
  { slug: "beans", q: "roasted coffee beans", aspect: "tall" },
  { slug: "people-cafe", q: "people sitting cafe talking", aspect: "wide" },
  { slug: "pastry-counter", q: "bakery pastry display case", aspect: "wide" },
  { slug: "ceramic-texture", q: "ceramic cup saucer minimal", aspect: "tall" },
];

const SHEET = { tileWidth: 320, tileHeight: 240, columns: 4, gap: 6, labelHeight: 22 };

/**
 * Wikimedia occasionally drops a connection mid-run, so every request is
 * retried a few times with a short backoff before being treated as a failure.
 */
async function fetchWithRetry(url, options = {}, attempts = 4) {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url, { ...options, headers: { "User-Agent": USER_AGENT, ...options.headers } });
      if (response.status >= 500) throw new Error(`HTTP ${response.status}`);
      return response;
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 400 * (attempt + 1)));
    }
  }
  throw lastError;
}

function normaliseLicense(value) {
  return (value ?? "").trim().toLowerCase();
}

function isAllowedLicense(value) {
  const licence = normaliseLicense(value);
  if (!licence) return false;
  return ALLOWED_LICENSES.some((allowed) => licence === allowed || licence.startsWith(`${allowed} `));
}

async function commonsSearch(term, { limit = 12, thumbWidth = 400 } = {}) {
  const url = new URL(API);
  url.searchParams.set("action", "query");
  url.searchParams.set("format", "json");
  url.searchParams.set("formatversion", "2");
  url.searchParams.set("generator", "search");
  url.searchParams.set("gsrsearch", `filetype:bitmap ${term}`);
  url.searchParams.set("gsrnamespace", "6");
  url.searchParams.set("gsrlimit", String(limit));
  url.searchParams.set("prop", "imageinfo");
  url.searchParams.set("iiprop", "url|size|extmetadata");
  url.searchParams.set("iiurlwidth", String(thumbWidth));

  const response = await fetchWithRetry(url);
  if (!response.ok) throw new Error(`Commons responded ${response.status} for "${term}"`);

  const payload = await response.json();
  const pages = payload?.query?.pages ?? [];

  return pages
    .map((page) => {
      const info = page.imageinfo?.[0];
      if (!info) return null;
      const meta = info.extmetadata ?? {};
      const pick = (key) => meta[key]?.value ?? "";
      return {
        title: (page.title ?? "").replace(/^File:/, ""),
        descriptionUrl: info.descriptionurl ?? "",
        originalUrl: info.url ?? "",
        previewUrl: info.thumburl ?? info.url ?? "",
        width: info.width ?? 0,
        height: info.height ?? 0,
        license: pick("LicenseShortName"),
        licenseUrl: pick("LicenseUrl"),
        artist: pick("Artist").replace(/<[^>]*>/g, "").trim(),
        credit: pick("Credit").replace(/<[^>]*>/g, "").trim(),
      };
    })
    .filter(Boolean)
    .filter((item) => item.width >= 1400 && item.height >= 900)
    .filter((item) => isAllowedLicense(item.license));
}

/** Cover-crop a preview to the tile aspect so the sheet reads evenly. */
async function tileBuffer(buffer, width, height) {
  return sharp(buffer)
    .resize(width, height, { fit: "cover", position: "attention" })
    .jpeg({ quality: 72 })
    .toBuffer();
}

/** Minimal 3x5 bitmap digits, drawn without a font so labels always render. */
const DIGITS = {
  0: ["111", "101", "101", "101", "111"],
  1: ["010", "110", "010", "010", "111"],
  2: ["111", "001", "111", "100", "111"],
  3: ["111", "001", "111", "001", "111"],
  4: ["101", "101", "111", "001", "001"],
  5: ["111", "100", "111", "001", "111"],
  6: ["111", "100", "111", "101", "111"],
  7: ["111", "001", "001", "001", "001"],
  8: ["111", "101", "111", "101", "111"],
  9: ["111", "101", "111", "001", "001"],
};

function labelSvg(index, width, height) {
  const text = String(index);
  const scale = 3;
  const glyphWidth = 3 * scale;
  const glyphHeight = 5 * scale;
  const spacing = 2 * scale;
  const totalWidth = text.length * glyphWidth + (text.length - 1) * spacing;
  const originX = width - totalWidth - 10;
  const originY = height - glyphHeight - 8;

  const rects = [];
  text.split("").forEach((char, charIndex) => {
    const glyph = DIGITS[char];
    if (!glyph) return;
    const offsetX = originX + charIndex * (glyphWidth + spacing);
    glyph.forEach((row, rowIndex) => {
      row.split("").forEach((cell, columnIndex) => {
        if (cell !== "1") return;
        rects.push(
          `<rect x="${offsetX + columnIndex * scale}" y="${originY + rowIndex * scale}" ` +
            `width="${scale}" height="${scale}" />`,
        );
      });
    });
  });

  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">` +
      `<rect x="${originX - 6}" y="${originY - 5}" width="${totalWidth + 12}" height="${glyphHeight + 10}" ` +
      `rx="3" fill="#1c1512" fill-opacity="0.82" />` +
      `<g fill="#f5efe5">${rects.join("")}</g>` +
      `</svg>`,
  );
}

async function buildContactSheet(candidates, slug) {
  const { tileWidth, tileHeight, columns, gap, labelHeight } = SHEET;
  const rows = Math.max(1, Math.ceil(candidates.length / columns));
  const sheetWidth = columns * tileWidth + gap * (columns + 1);
  const sheetHeight = rows * (tileHeight + labelHeight) + gap * (rows + 1);

  const composites = [];
  for (let index = 0; index < candidates.length; index += 1) {
    const candidate = candidates[index];
    let tile;
    try {
      const response = await fetchWithRetry(candidate.previewUrl, {}, 3);
      if (!response.ok) throw new Error(String(response.status));
      tile = await tileBuffer(Buffer.from(await response.arrayBuffer()), tileWidth, tileHeight);
    } catch {
      // A single unreachable preview must not abort the whole sheet.
      tile = await sharp({
        create: {
          width: tileWidth,
          height: tileHeight,
          channels: 3,
          background: { r: 216, g: 204, b: 190 },
        },
      })
        .jpeg()
        .toBuffer();
    }

    const column = index % columns;
    const row = Math.floor(index / columns);
    const left = gap + column * (tileWidth + gap);
    const top = gap + row * (tileHeight + labelHeight + gap);

    composites.push({ input: tile, left, top });
    composites.push({ input: labelSvg(index, tileWidth, tileHeight), left, top });
  }

  const sheetPath = path.join(OUT_DIR, `${slug}.jpg`);
  await sharp({
    create: {
      width: sheetWidth,
      height: sheetHeight,
      channels: 3,
      background: { r: 245, g: 239, b: 229 },
    },
  })
    .composite(composites)
    .jpeg({ quality: 78 })
    .toFile(sheetPath);

  return sheetPath;
}

async function run(term) {
  const slug = term.slug ?? term.q.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const candidates = await commonsSearch(term.q);

  if (candidates.length === 0) {
    process.stdout.write(`\n### ${slug} — no licensed candidates\n`);
    return;
  }

  await writeFile(
    path.join(OUT_DIR, `${slug}.json`),
    `${JSON.stringify({ slug, query: term.q, aspect: term.aspect, candidates }, null, 2)}\n`,
    "utf8",
  );
  await buildContactSheet(candidates, slug);

  process.stdout.write(`\n### ${slug}  (${term.aspect}) — ${candidates.length} candidates\n`);
  candidates.forEach((candidate, index) => {
    process.stdout.write(
      `  [${String(index).padStart(2)}] ${`${candidate.width}x${candidate.height}`.padEnd(11)} ` +
        `${candidate.license.padEnd(12)} ${candidate.title.slice(0, 58)}\n`,
    );
  });
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const adHoc = process.argv.slice(2).filter((arg) => !arg.startsWith("-"));
  const queries = adHoc.length > 0 ? adHoc.map((q) => ({ slug: null, q, aspect: "any" })) : QUERIES;

  for (const term of queries) {
    try {
      await run(term);
    } catch (error) {
      process.stdout.write(`\n### ${term.q} — ERROR ${error.message}\n`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
