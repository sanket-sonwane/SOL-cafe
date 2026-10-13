import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

/* ---------------------------------------------------------------------------
   Rasterise the SVG favicon into the PNG sizes browsers and operating systems
   actually ask for.

   Apple's touch icon and the web-app manifest both require PNG; a lone SVG
   favicon leaves iOS and installed-web-app contexts showing a screenshot or a
   blank tile instead of the mark.

   The rounded corners of the source SVG are flattened onto the ivory page
   colour rather than left transparent, because iOS applies its own corner mask
   and would otherwise composite the transparent corners against black.

   Android additionally wants a **maskable** icon: a separate, edge-to-edge
   image whose important content survives the launcher's aggressive crop
   (anything outside the central 80% circle can be masked away). Marking the
   ordinary rounded-square icon as maskable would crop it into a badge floating
   in a ring, so a dedicated mark is drawn here with the logo scaled into that
   safe zone.
   --------------------------------------------------------------------------- */

const SOURCE = path.resolve("public/favicon.svg");
const IVORY = { r: 0xf5, g: 0xef, b: 0xe5, alpha: 1 };

const TARGETS = [
  { file: "public/apple-touch-icon.png", size: 180 },
  { file: "public/icon-192.png", size: 192 },
  { file: "public/icon-512.png", size: 512 },
];

/*
 * The maskable mark: a full-bleed espresso field (so the launcher's mask has
 * colour to cut into) with the ring and the S sized so their extremes stay well
 * inside the safe zone — the ring has a radius of 10 units against a 25.6-unit
 * safe radius, leaving generous margin under any launcher mask shape.
 */
const MASKABLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="#30231D"/>
  <circle cx="32" cy="32" r="10" fill="none" stroke="#B86F52" stroke-width="1.2" opacity="0.85"/>
  <text x="32" y="38.8" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="19" fill="#F5EFE5">S</text>
</svg>`;

const svg = await readFile(SOURCE);

for (const { file, size } of TARGETS) {
  await sharp(svg, { density: 600 })
    .resize(size, size, { fit: "contain", background: IVORY })
    .flatten({ background: IVORY })
    .png({ compressionLevel: 9 })
    .toFile(path.resolve(file));

  console.log(`[icons] ${path.basename(file)} — ${size}×${size}`);
}

{
  const maskable = "public/icon-512-maskable.png";
  await sharp(Buffer.from(MASKABLE_SVG), { density: 600 })
    .resize(512, 512, { fit: "cover" })
    .png({ compressionLevel: 9 })
    .toFile(path.resolve(maskable));

  console.log(`[icons] ${path.basename(maskable)} — 512×512 (maskable safe zone)`);
}

const manifest = {
  id: "/",
  name: "SŌL — Coffee & Slow Living",
  short_name: "SŌL",
  description:
    "A neighbourhood specialty café: thoughtfully brewed coffee, beautiful things to eat, and a space to stay a little longer.",
  start_url: "/",
  scope: "/",
  display: "standalone",
  lang: "en-IN",
  dir: "ltr",
  background_color: "#F5EFE5",
  theme_color: "#30231D",
  icons: [
    { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
    { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    { src: "/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
  ],
};

await writeFile(
  path.resolve("public/site.webmanifest"),
  `${JSON.stringify(manifest, null, 2)}\n`,
  "utf8",
);

console.log("[icons] site.webmanifest");
