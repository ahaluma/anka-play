// A small local web server for trying AnkaPlay on this computer, with the same security headers as on
// Cloudflare (public/_headers), so a page that breaks the rules breaks here too.
// Run: node tools/serve.mjs   then open http://localhost:8080   (a phone in the same network: the computer's address)

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const root = new URL("../public/", import.meta.url).pathname;
const port = Number(process.env.PORT) || 8080;
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".json": "application/json", ".webmanifest": "application/manifest+json" };

// The headers of every path ("/*") in public/_headers.
const headers = {};
let inAll = false;
for (const line of (await readFile(join(root, "_headers"), "utf8")).split("\n")) {
  if (/^\S/.test(line)) inAll = line.trim() === "/*";
  else if (inAll && line.includes(":")) {
    const [k, ...v] = line.trim().split(":");
    headers[k] = v.join(":").trim();
  }
}

createServer(async (req, res) => {
  let path = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)).replace(/^(\.\.[/\\])+/, "");
  if (path.endsWith("/")) path += "index.html";
  const file = join(root, path);
  try {
    if (!(await stat(file)).isFile()) throw new Error();
    res.writeHead(200, { ...headers, "Content-Type": TYPES[extname(file)] ?? "application/octet-stream", "Cache-Control": "no-store" });
    res.end(await readFile(file));
  } catch {
    res.writeHead(404, headers);
    res.end("not found");
  }
}).listen(port, () => console.log(`AnkaPlay on http://localhost:${port}`));
