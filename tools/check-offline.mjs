// The offline list: public/sw.js keeps a copy of every file of the site on the phone, so AnkaPlay works without
// a connection after the first visit. Its list of files (FILES) and its version (VERSION, from the files'
// contents) are written by this tool. A new or changed file means: run it with --write.
//
//   node tools/check-offline.mjs           checks that sw.js lists every file and has the current version
//   node tools/check-offline.mjs --write   writes the list and the version into sw.js

import { readFile, writeFile, readdir } from "node:fs/promises";
import { join, relative } from "node:path";
import { createHash } from "node:crypto";

const root = new URL("../public/", import.meta.url).pathname;
const swPath = join(root, "sw.js");
const SKIP = new Set(["sw.js", "_headers"]);

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

const files = (await walk(root)).map((p) => relative(root, p).split("\\").join("/")).filter((f) => !SKIP.has(f) && !f.endsWith(".md")).sort();
// A page is asked for by its folder ("/datenschutz/"), never as ".../index.html" (Cloudflare redirects that).
const urls = files.map((f) => "/" + f.replace(/(^|\/)index\.html$/, "$1"));
const hash = createHash("sha256");
for (const f of files) hash.update(f).update("\0").update(await readFile(join(root, f))).update("\0");
const version = hash.digest("hex").slice(0, 12);

const sw = await readFile(swPath, "utf8");
const list = `const FILES = [\n${urls.map((u) => `  ${JSON.stringify(u)},`).join("\n")}\n];`;
const want = sw.replace(/const VERSION = "[^"]*";/, `const VERSION = "${version}";`).replace(/const FILES = \[[\s\S]*?\n\];/, list);

if (process.argv.includes("--write")) {
  await writeFile(swPath, want);
  console.log(`sw.js: ${urls.length} files, version ${version}.`);
} else if (want !== sw) {
  console.log("PROBLEM: sw.js is not up to date with the files in public/. Run: node tools/check-offline.mjs --write");
  process.exit(1);
} else {
  console.log(`sw.js keeps all ${urls.length} files for offline play (version ${version}).`);
}
