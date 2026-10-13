import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import path from "node:path";
import process from "node:process";

/* ---------------------------------------------------------------------------
   Prerender the homepage into dist/index.html.

   The site stays a single static bundle — this script renders the same React
   tree with `react-dom/server` and swaps it in for the `<!--app-html-->`
   placeholder, so the first paint already contains the real markup.

   It is deliberately non-fatal. A prerender failure must never break a deploy:
   if anything goes wrong we warn, leave the client-only HTML in place, and exit
   successfully, because the client bundle is fully capable of building the page
   on its own.
   --------------------------------------------------------------------------- */

const PLACEHOLDER = "<!--app-html-->";

const indexPath = path.resolve("dist/index.html");
const serverEntryPath = path.resolve("dist-ssr/entry-server.js");

async function prerender() {
  const template = await readFile(indexPath, "utf8");

  if (!template.includes(PLACEHOLDER)) {
    console.warn(
      `[prerender] ${PLACEHOLDER} was not found in dist/index.html — nothing to inject.`,
    );
    return;
  }

  const serverEntry = await import(pathToFileURL(serverEntryPath).href);
  if (typeof serverEntry.render !== "function") {
    throw new Error("dist-ssr/entry-server.js did not export a render() function.");
  }

  const markup = serverEntry.render();
  await writeFile(indexPath, template.replace(PLACEHOLDER, markup), "utf8");

  console.log(
    `[prerender] injected ${markup.length.toLocaleString()} characters of server-rendered markup.`,
  );
}

try {
  await prerender();
} catch (error) {
  console.warn(`[prerender] skipped: ${error?.message ?? error}`);
  console.warn("[prerender] dist/ still contains a complete client-rendered build, so this is safe.");
  process.exitCode = 0;
}
