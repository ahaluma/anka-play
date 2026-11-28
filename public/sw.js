// Service worker: AnkaPlay works without a connection after the first visit.
// It only keeps copies of this site's own files on the device. Nothing is sent anywhere.
//
// Network first: with a connection the newest file is used and its copy is refreshed, so an update goes live
// at once. Without a connection the copy is used. Every file of the site is copied when the worker is installed,
// so every station plays offline, also one the child has never opened. Registered by engine/main.js.
//
// VERSION and FILES are written by tools/check-offline.mjs --write (run it after changing any file).

const VERSION = "073a20084224";
const CACHE = `anka-${VERSION}`;

const FILES = [
  "/app.css",
  "/datenschutz/contact.js",
  "/datenschutz/",
  "/datenschutz/lang/de.js",
  "/datenschutz/lang/en.js",
  "/datenschutz/lang/ne.js",
  "/datenschutz/page.css",
  "/datenschutz/page.js",
  "/engine/app.js",
  "/engine/i18n.js",
  "/engine/main.js",
  "/engine/profiles.js",
  "/engine/router.js",
  "/engine/store.js",
  "/engine/ui/home.js",
  "/engine/ui/kidform.js",
  "/engine/ui/owl.js",
  "/engine/ui/parts.js",
  "/engine/ui/sound.js",
  "/engine/ui/topbar.js",
  "/engine/ui/voice.js",
  "/favicon.svg",
  "/icon-180.png",
  "/icon-512.png",
  "/",
  "/lang/de.js",
  "/lang/en.js",
  "/lang/ne.js",
  "/manifest.webmanifest",
  "/memory/deck.js",
  "/memory/lang/de.js",
  "/memory/memory.css",
  "/memory/memory.js",
  "/offen/apfel.js",
  "/offen/apfelbaum.js",
  "/offen/bau.js",
  "/offen/figures.js",
  "/offen/hasen.js",
  "/offen/lang/de.js",
  "/offen/offen.css",
  "/offen/owl.js",
  "/offen/places.js",
  "/offen/portals.js",
  "/offen/questions.js",
  "/offen/runs.js",
  "/offen/scene.js",
  "/offen/skills.js",
  "/offen/teich.js",
  "/offen/world.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => Promise.all(FILES.map((url) => cache.add(new Request(url, { cache: "no-cache" })).catch(() => {}))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("anka-") && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== location.origin) return;
  event.respondWith(
    // "no-cache": always ask the server whether the file changed, so a phone never keeps playing an old version
    // from the browser's own cache.
    fetch(request.url, { cache: "no-cache" })
      .then((response) => {
        if (response.ok && !response.redirected) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(url.pathname, copy));
        }
        return response;
      })
      .catch(async () => {
        const cache = await caches.open(CACHE);
        // The one page answers every address of the app (#/… stays in the browser); a folder its index.
        return (await cache.match(url.pathname)) || (request.mode === "navigate" && (await cache.match("/"))) || Response.error();
      }),
  );
});
